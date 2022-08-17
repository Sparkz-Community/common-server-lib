/* eslint-disable no-unused-vars */
const {packages:{lodash: {lget, lset}}, urlParser} = require('@iy4u/common-utils');

exports.UrlParses = class UrlParses {
  constructor(options) {
    this.options = options || {};
  }

  // async find (params) {
  //   return [];
  // }
  //
  // async get (id, params) {
  //   return {
  //     id, text: `A new message with ID: ${id}!`
  //   };
  // }

  async create(data, params) {
    if (Array.isArray(data)) {
      return Promise.all(data.map(current => this.create(current, params)));
    }
    let url = lget(data, 'url');
    if (url) {
      lset(data, 'parsedUrl', await urlParser(url));
    }

    return data;
  }

  // async update (id, data, params) {
  //   return data;
  // }
  //
  // async patch (id, data, params) {
  //   return data;
  // }
  //
  // async remove (id, params) {
  //   return { id };
  // }
};
