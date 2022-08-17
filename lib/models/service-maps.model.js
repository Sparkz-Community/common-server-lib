// service-maps-model.js - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function(app,{connection} = {}){
  const mongoose = app.get('mongoose');
  const mongooseClient = connection;
  const {Schema} = mongoose;
  const modelName = 'service-maps';

  const schema = new Schema({
    deleted: { type: Boolean, required: true, default: false },
    deletedAt: Date,
    createdBy: { type: Schema.Types.ObjectId, ref: 'users' },
    updatedBy: { type: Schema.Types.ObjectId, ref: 'users' },
    service: { type: String },
    name: { type: String },
    description: { type: String },
    fieldsMap: [{
      field: { type: String, trim: true },
      ref: { type: String },
      hereIdPath: { type: String, trim: true },
      thereIdPath: { type: String, trim: true },
      name: { type: String },
      description: { type: String },
      allowGovernance: Boolean
    }]
  }, {
    timestamps: true
  });

  // This is necessary to avoid model compilation errors in watch mode
  // see https://github.com/Automattic/mongoose/issues/1251
  try {
    return mongooseClient.model(modelName);
  } catch (e) {
    return mongooseClient.model(modelName, schema);
  }
};
