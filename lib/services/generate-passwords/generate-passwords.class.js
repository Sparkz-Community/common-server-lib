/* eslint-disable no-unused-vars */
const crypto = require('crypto');
const {packages:{lodash: {lget}}} = require('@iy4u/common-utils');

exports.GeneratePasswords = class GeneratePasswords {
  constructor (options, app, lowercase, uppercase, numbers, symbols, similarCharacters, strictRules, randomBatchSize) {
    this.options = options || {};
    this.app = app || {};
    this.lower = lowercase || 'abcdefghijklmnopqrstuvwxyz';
    this.upper = uppercase || 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    this.num = numbers || '0123456789';
    this.sym = symbols || '!@#$%^&*()+_-=}{[]|:;"/?.><,`~';
    this.similarCharacters = similarCharacters || /[ilLI|`oO0]/g;
    this.strictRules = strictRules || [
      { name: 'lowercase', rule: /[a-z]/ },
      { name: 'uppercase', rule: /[A-Z]/ },
      { name: 'numbers', rule: /[0-9]/ },
      { name: 'symbols', rule: /[!@#$%^&*()+_\\\-=}{[\\\]|:;"/?.><,`~]/ }
    ];
    this.randomBatchSize = randomBatchSize || 1024;
    this.randomIndex = undefined;
    this.randomBytes = undefined;
  }

  getNextRandomValue() {
    if (this.randomIndex === undefined || this.randomIndex >= this.randomBytes.length) {
      this.randomIndex = 0;
      this.randomBytes = crypto.randomBytes(this.randomBatchSize);
    }

    let result = this.randomBytes[this.randomIndex];
    this.randomIndex += 1;

    return result;
  }

  randomNumber(max) {
    // gives a number between 0 (inclusive) and max (exclusive)
    let rand = this.getNextRandomValue();
    while (rand >= 256 - (256 % max)) {
      rand = this.getNextRandomValue();
    }
    return rand % max;
  }

  generate(options, pool) {
    let password = '',
      optionsLength = options.length,
      poolLength = pool.length;

    for (let i = 0; i < optionsLength; i++) {
      password += pool[this.randomNumber(poolLength)];
    }

    if (options.strict) {
      // Iterate over each rule, checking to see if the password works.
      let fitsRules = this.strictRules.every(function(rule) {
        // If the option is not checked, ignore it.
        if (options[rule.name] == false) return true;

        // Treat symbol differently if explicit string is provided
        if (rule.name === 'symbols' && typeof options[rule.name] === 'string') {
          // Create a regular expression from the provided symbols
          let re = new RegExp('['+options[rule.name]+']');
          return re.test(password);
        }

        // Run the regex on the password and return whether
        // or not it matches.
        return rule.rule.test(password);
      });

      // If it doesn't fit the rules, generate a new one (recursion).
      if (!fitsRules) return this.generate(options, pool);
    }

    return password;
  }



  async create (data, params) {
    if (Array.isArray(data)) {
      return Promise.all(data.map(current => this.create(current, params)));
    }

    // Set defaults.
    let _data = {};
    _data.length = lget(data,'length', 10);
    _data.numbers = lget(data,'numbers', false);
    _data.symbols = lget(data,'symbols', false);
    _data.exclude = lget(data,'exclude', '');
    _data.uppercase = lget(data,'uppercase', true);
    _data.lowercase = lget(data,'lowercase', true);
    _data.excludeSimilarCharacters = lget(data,'excludeSimilarCharacters', false);
    _data.strict = lget(data,'strict', false);

    if (_data.strict) {
      let minStrictLength = 1 + (_data.numbers ? 1 : 0) + (_data.symbols ? 1 : 0) + (_data.uppercase ? 1 : 0);
      if (minStrictLength > _data['length']) {
        throw new TypeError('Length must correlate with strict guidelines');
      }
    }

    // Generate character pool
    let pool = '';

    // lowercase
    if (_data.lowercase) {
      pool += this.lower;
    }

    // uppercase
    if (_data.uppercase) {
      pool += this.upper;
    }
    // numbers
    if (_data.numbers) {
      pool += this.num;
    }
    // symbols
    if (_data.symbols) {
      if (typeof _data.symbols === 'string') {
        pool += _data.symbols;
      } else {
        pool += this.sym;
      }
    }

    // Throw error if pool is empty.
    if (!pool) {
      throw new TypeError('At least one rule for pools must be true');
    }

    // similar characters
    if (_data.excludeSimilarCharacters) {
      pool = pool.replace(this.similarCharacters, '');
    }

    // excludes characters from the pool
    let i = _data.exclude.length;
    while (i--) {
      pool = pool.replace(_data.exclude[i], '');
    }

    let password = this.generate(_data, pool);

    return password;
  }

};
