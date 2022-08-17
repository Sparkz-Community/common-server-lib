// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

const {packages:{lodash: {lget}}} = require('@iy4u/common-utils');

// eslint-disable-next-line no-unused-vars
module.exports = (options = {}) => {
  return async context => {
    const fastjoin = lget(context.data, '_fastjoin');
    if (fastjoin) delete context.data._fastjoin;
    return context;
  };
};
