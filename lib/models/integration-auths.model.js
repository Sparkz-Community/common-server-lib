// users-model.js - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.

const {packages: {lodash: {lunset, lmergeWith}}, extensionUtils: {schemaCustomizer}} = require('@iy4u/common-utils');

const Common = require('./common/common.schemas');
const Core = require('./common/core.schemas');


module.exports = function (app, {connection, extend_schema = {}, schema_remove_paths = []} = {}) {
  const mongoose = app.get('mongoose');
  const mongooseClient = connection;
  const {Schema} = mongoose;
  const modelName = 'integration-auths';

  const orig_schema = {
    name: {
      type: String,
      unique: true,
      required: true,
    },
    secretKey: {type: String, required: true},
    integration: {type: Schema.Types.ObjectId, ref: 'integrations'},
    settings: Common.Settings(app),

    environments: [{type: Schema.Types.ObjectId, ref: 'environments'}],

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
