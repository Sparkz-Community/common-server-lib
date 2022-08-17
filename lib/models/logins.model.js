// logins-model.js - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
const {packages: {lodash: {lunset, lmergeWith}}, extensionUtils: {schemaCustomizer}} = require('@iy4u/common-utils');

const Common = require('./common/common.schemas');

module.exports = function (app, {connection, extend_schema = {}, schema_remove_paths = []} = {}) {
  const mongoose = app.get('mongoose');
  const mongooseClient = connection;
  const {Schema} = mongoose;
  const modelName = 'logins';


  const orig_schema = {
    name: {type: String, index: true},
    email: {type: String, lowercase: true, required: true},
    password: {type: String, required: true},
    phones: [{type: Common.Phone(app)}],
    addresses: [{type: Common.Address(app)}],
    avatar: {type: Common.Images(app)},
    banner: {type: Common.Images(app)},
    images: [{
      image: {type: Common.Images(app)},
      tags: [{type: String}],
    }],
    settings: Common.Settings(app),

    roles: [{type: Schema.Types.ObjectId, ref: 'ir-roles-roles', required: false}],
    user: {type: Schema.Types.ObjectId, ref: 'users', required: true},
    accounts: {
      owns: {
        ids: [{type: Schema.Types.ObjectId, ref: 'accounts'}],
        active: {type: Schema.Types.ObjectId, ref: 'accounts'},
      },
      memberOf: [{type: Schema.Types.ObjectId, ref: 'accounts'}]
    },

    auth0Id: {type: String},
    googleId: {type: String},
    facebookId: {type: String},
    twitterId: {type: String},
    githubId: {type: String},
    linkedInId: {type: String},
    boxId: {type: String},

    verifiers: [{type: Schema.Types.ObjectId, ref: 'logins'}],
    isVerified: {type: Boolean, required: false},
    resetToken: {type: String, required: false},
    verifyChanges: {type: Object, required: false},
    verifyToken: {type: String, required: false},
    verifyExpires: {type: Date, required: false},
    verifyShortToken: {type: String, required: false},
    resetShortToken: {type: String, required: false},
    resetExpires: {type: Date, required: false},
    resetAttempts: {type: Number, required: false},

    ...Common.commonFieldsFn(app).obj,
  };

  schema_remove_paths.map(path => lunset(orig_schema, path));

  const schema = new Schema(lmergeWith(orig_schema, extend_schema, schemaCustomizer), {
    timestamps: true,
  });

  schema.index({email: 1, environment: 1}, {unique: true});

  // This is necessary to avoid model compilation errors in watch mode
  // see https://mongoosejs.com/docs/api/connection.html#connection_Connection-deleteModel
  if (mongooseClient.modelNames().includes(modelName)) {
    mongooseClient.deleteModel(modelName);
  }

  return mongooseClient.model(modelName, schema);
};
