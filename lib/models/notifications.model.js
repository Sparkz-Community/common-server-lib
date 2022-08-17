// notifications-model.js - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
const {packages: {lodash: {lunset, lmergeWith}}, extensionUtils: {schemaCustomizer}} = require('@iy4u/common-utils');

const Common = require('./common/common.schemas');

module.exports = function (app, {connection, extend_schema = {}, schema_remove_paths = []} = {}) {
  const mongoose = app.get('mongoose');
  const mongooseClient = connection;
  const {Schema} = mongoose;
  const modelName = 'notifications';
  const orig_schema = {
    subject: {type: String, required: true},
    from: {type: Schema.Types.ObjectId, ref: 'accounts', required: false},
    to: {type: Schema.Types.ObjectId, ref: 'accounts', required: false},
    next: {type: String, required: false},
    feature: {type: Schema.Types.ObjectId, ref: 'features', required: false},
    type: {type: String, required: true, enum: ['']},
    message: {type: String, required: false},
    icon: {type: String, default: 'notifications'},
    startDate: {type: Date, default: new Date()},
    endDate: {type: Date, required: false},
    seenDate: {type: Date},

    ...Common.commonFieldsFn(app).obj,
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
