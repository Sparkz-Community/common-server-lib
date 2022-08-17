// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
const {packages:{lodash: {lget, lset}}} = require('@iy4u/common-utils');

// eslint-disable-next-line no-unused-vars
module.exports = (options = {}) => {
  return async context => {
    if (context.params.provider === 'rest') {
      for (const key of Object.keys(lget(context, 'params.query', {}))) {
        try {
          if (/\{|\}|\[|\]/.test(context.params.query[key])) lset(context, ['params', 'query', key], JSON.parse(context.params.query[key]));
        } catch (e) {
          console.log('Ignore this error. This error is escaped so nothing happens.', e);
        }
      }
    }
    return context;
  };
};
