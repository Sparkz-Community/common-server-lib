// wallets-model.js - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app, {connection} = {}) {
  const mongoose = app.get('mongoose');
  const mongooseClient = connection;
  const {Schema} = mongoose;
  const modelName = 'wallets';

  const schema = new Schema({
    tallyBank: {
      type: Object,
      required: false,
      contains: {
        stripe: {
          type: Object,
          required: false,
          contains: {
            customerId: {type: String, required: true},
          },
        },
      },
    },
    cards: [{type: String, required: false}],
    banksAccounts: [{type: String, required: false}],
  }, {
    timestamps: true,
  });

  // This is necessary to avoid model compilation errors in watch mode
  // see https://mongoosejs.com/docs/api/connection.html#connection_Connection-deleteModel
  if (mongooseClient.modelNames().includes(modelName)) {
    mongooseClient.deleteModel(modelName);
  }
  return mongooseClient.model(modelName, schema);
};
