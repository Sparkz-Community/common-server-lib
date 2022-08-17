// const {logger} = require('@iy4u/common-utils');

// module.exports = (function () {
//   const call = Function.prototype.call;
//   Function.prototype.call = function () {
//     logger.log('verbose', 'this:', { ...this });
//     logger.log('verbose', 'arguments:', [...arguments]);
//     return call.apply(this, arguments);
//   };
// }());
