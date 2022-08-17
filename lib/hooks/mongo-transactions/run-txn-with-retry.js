const {GeneralError} = require('@feathersjs/errors');
const {TransactionManager} = require('feathers-mongoose');
const {packages:{lodash: {lget}}} = require('@iy4u/common-utils');

// Retries commit if UnknownTransactionCommitResult encountered
function runTxnWithRetry(txnFunc, data, customErrorClass = GeneralError) {
  return async context => {
    try {
      await txnFunc(data)(context);
    } catch (errors) {
      // console.log('Transaction aborted. Caught exception during transaction.');
      // console.log(errors);
      // If transient error, retry the whole transaction
      if (lget(errors, 'errorLabels.length') && errors.errorLabels.includes('TransientTransactionError')) {
        // console.log('TransientTransactionError, retrying transaction ...');
        await runTxnWithRetry(txnFunc, data, customErrorClass)(context);
      } else {
        await TransactionManager.rollbackTransaction(context);

        throw new customErrorClass(errors.message, errors);
      }
    }
    return context;
  };
}

module.exports = runTxnWithRetry;
