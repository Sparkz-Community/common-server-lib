const {GeneralError} = require('@feathersjs/errors');
const {TransactionManager} = require('feathers-mongoose');
const {packages:{lodash: {lget}}} = require('@iy4u/common-utils');

// Retries commit if UnknownTransactionCommitResult encountered
function commitWithRetry(customErrorClass = GeneralError) {
  return async (ctx) => {
    try {
      await TransactionManager.commitTransaction(ctx);
      // console.log('Transaction committed.');
    } catch (errors) {
      if (lget(errors, 'errorLabels.length') && errors.errorLabels.includes('UnknownTransactionCommitResult')) {
        // console.log('UnknownTransactionCommitResult, retrying commit operation ...');
        await commitWithRetry(customErrorClass)(ctx);
      } else {
        throw new customErrorClass(errors.message, errors);
      }
    }
    return ctx;
  };
}


module.exports = commitWithRetry;
