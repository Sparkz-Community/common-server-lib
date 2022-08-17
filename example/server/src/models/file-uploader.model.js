// fileUploader-model.js - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app, {connection} = {}) {
  const mongoose = app.get('mongoose');
  const mongooseClient = connection;
  const {Schema} = mongoose;
  const modelName = 'file-uploader';

  const schema = new Schema({
    name: {type: String, required: false},
    file: {type: String, required: true},
    originalName: {type: String, required: false},
    type: {type: String, required: false},
    info: {
      type: Object,
      required: false,
      contains: {
        name: {type: String, required: false},
        size: {type: String, required: false},
        type: {type: String, required: false},
        lastModifiedDate: {type: Date, required: false},
      },
    },
    user: {type: Schema.Types.ObjectId, ref: 'users'},
    fileId: {type: String, required: true},
    storage: {
      type: String,
      required: true,
      enum: [
        's3',
        'local-private',
        'local-public',
        'google-cloud',
        'others',
      ],
    },
    uploadChannel: {
      type: String,
      required: false,
      enum: ['site', 'back-office', 'app'],
      default: 'back-office',
    },
    createdBy: {type: Schema.Types.ObjectId, ref: 'users'},
    updatedBy: {type: Schema.Types.ObjectId, ref: 'users'},
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


