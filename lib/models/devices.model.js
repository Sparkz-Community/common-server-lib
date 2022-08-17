// users-model.js - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.

const {packages:{lodash: {lunset, lmergeWith}}, extensionUtils: {schemaCustomizer}} = require('@iy4u/common-utils');

const Common = require('./common/common.schemas');
const Core = require('./common/core.schemas');


module.exports = function (app,{connection, extend_schema = {}, schema_remove_paths = []} = {}) {
  const mongoose = app.get('mongoose');
  const mongooseClient = connection;
  const {Schema} = mongoose;
  const modelName = 'devices';

  const orig_schema = {
    fingerprints: [String],
    counter: Number,
    publicKey: String,
    activeKey: {type: Schema.Types.ObjectId, ref: 'fc-keys'},
    keys: [{type: Schema.Types.ObjectId, ref: 'fc-keys'}],
    user: {type: Schema.Types.ObjectId, ref: 'users'},
    users: [{type: Schema.Types.ObjectId, ref: 'users'}],
    lastRoute: {
      name: String,
      path: String,
      query: Object,
      params: Object,
      meta: Object,
      props: Object,
    },
    settings: Common.Settings(app),
    ...Core.coreSchemaFn(app).obj,
  };

  schema_remove_paths.map(path => lunset(orig_schema, path));

  const schema = new Schema(lmergeWith(orig_schema, extend_schema, schemaCustomizer), {
    timestamps: true,
  });

  // This is necessary to avoid model compilation errors in watch mode
  // see https://mongoosejs.com/docs/api/connection.html#connection_Connection-deleteModel
  if (mongooseClient.modelNames().includes(modelName)) {
    mongooseClient.deleteModel(modelName);
  }

  return mongooseClient.model(modelName, schema);

};
