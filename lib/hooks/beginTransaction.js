// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

// eslint-disable-next-line no-unused-vars
module.exports = async (context, {skipPath = [], startTransactionOptions = {}} = {}) => {
  const client = context.app.get('mongoDbClient') || context.service.Model.db;
  try {
    // if the current path is not added to skipPath-list
    if (skipPath.indexOf(context.path) === -1) {
      // if there is no open-transaction appended already
      if (context.params && !context.params.transactionOpen) {
        const session = await client.startSession();
        await session.startTransaction(startTransactionOptions);
        context.params.transactionOpen = true;
        context.params.mongoose = { ...context.params.mongoose, session };
      }
      context.enableTransaction = true; // true if transaction is enabled
    } else {
      context.enableTransaction = false;
    }
    return context;
  } catch (err) {
    throw new Error(`Error while starting session ${err}`);
  }
};
