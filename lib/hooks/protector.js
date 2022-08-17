// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
const {packages: {omitDeep}} = require('@iy4u/common-utils');

module.exports = (paths = [], keys = []) => {
  return context => {
    if (paths.length === 0 || paths === null) {
      paths = ['result'];
    }
    for (const path of paths) {
      context[path] = omitDeep(context[path], keys);
    }
    return context;
  };
};
