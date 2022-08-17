// users-model.js - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.

const {packages: {lodash: {lunset, lmergeWith}}, extensionUtils: {schemaCustomizer}} = require('@iy4u/common-utils');

const Core = require('./common/core.schemas');

module.exports = function (app, {connection, extend_schema = {}, schema_remove_paths = []} = {}) {
  const mongoose = app.get('mongoose');
  const mongooseClient = connection;
  const {Schema} = mongoose;
  const modelName = 'environments';

  const orig_schema = {
    name: {
      type: String,
      required: true,
    },
    applications: {
      type: [{type: Schema.Types.ObjectId, ref: 'applications'}],
      validate: {
        validator(val) {
          return val.length > 0;
        },
        message: props => `applications length must be greater than 0. Current applications length is ${props.value.length}`,
      },
    },

    hosts: [{type: Schema.Types.ObjectId, ref: 'hosts'}],
    integrationAuths: [{type: Schema.Types.ObjectId, ref: 'integration-auths'}],

    responsibleAccount: {type: Schema.Types.ObjectId, ref: 'accounts'},

    // TODO: I am not sure routes should be here. I think it would be better on applications or features.
    routes: [{type: Schema.Types.ObjectId, ref: 'routes'}],
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
