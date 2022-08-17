// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
const {packages:{lodash: {lget, lset}}} = require('@iy4u/common-utils');

const checkContext = require('./checkContext');

// eslint-disable-next-line no-unused-vars
module.exports = ({whitelist = [], services = []} = {}) => {
  return async context => {
    checkContext(context, 'before', [], 'setWhiteListService');

    if (services.includes(context.path)) lset(context, 'service.options.whitelist', [...new Set(lget(context, 'service.options.whitelist', []).concat(whitelist))]);
    return context;
  };
};
