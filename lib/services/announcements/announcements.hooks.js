// eslint-disable-next-line no-unused-vars
const { relate } = require('../../hooks/relate-utils');
const coreAuthentication = require('../../hooks/core-authentication');

// eslint-disable-next-line no-unused-vars
const relateAccountsConfig = {
  paramsName: 'relateAccountsConfig',
  herePath: '',
  thereService: 'accounts',
  therePath: '',
};

module.exports = {
  before: {
    all: [
      coreAuthentication({
        required: [
          {service: 'authentication', strategies: ['jwt']},
          // {service: 'integrationAuth', strategies: ['jwt']},
        ],
        optional: [
          // {service: 'authentication', strategies: ['jwt']},
          {service: 'integrationAuth', strategies: ['jwt']},
        ],
      }),
    ],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
};
