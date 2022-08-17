// users-model.js - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
const {packages: {lodash: {lunset, lmergeWith}}, extensionUtils: {schemaCustomizer}} = require('@iy4u/common-utils');

const Common = require('./common/common.schemas');

module.exports = function (app, {connection, extend_schema = {}, schema_remove_paths = []} = {}) {
  const mongoose = app.get('mongoose');
  const mongooseClient = connection;
  const {Schema} = mongoose;
  const modelName = 'accounts';

  const orig_schema = {
    name: {
      type: String,
      required: function () {
        return !this.email;
      },
    },
    email: {
      type: String,
      required: function () {
        return !this.name;
      },
    },
    description: String,
    avatar: {type: Common.Images(app)},
    banner: {type: Common.Images(app)},
    images: [{
      image: {type: Common.Images(app)},
      tags: [{type: String}],
    }],
    addresses: [Common.Address(app)],
    phones: [Common.Phone(app)],
    socialLinks: [{type: Object, required: false}],

    logins: {
      ownedBy: [{type: Schema.Types.ObjectId, ref: 'logins'}],
      members: [{type: Schema.Types.ObjectId, ref: 'logins'}],
    },

    ownership: {
      owners: {
        type: [{
          id: {type: Schema.Types.ObjectId, ref: 'accounts'},
          percent: {type: Number, default: null, min: 0, max: 100},
        }],
        validate: {
          validator: function (val) {
            return val.reduce((acc, curr) => {
              if (typeof curr.percent === 'number') {
                acc += curr.percent;
              }
              return acc;
            }, 0) <= 100;
          },
          message: 'owners can not exceed a total of 100.',
        },
      },
      owns: [{type: Schema.Types.ObjectId, ref: 'accounts'}],
    },
    membership: {
      members: [{type: Schema.Types.ObjectId, ref: 'accounts'}],
      membersOf: [{type: Schema.Types.ObjectId, ref: 'accounts'}],
    },

    authOwnerId: {type: Schema.Types.ObjectId, refPath: 'authModelName'},
    authModelName: {type: String, enum: ['users', 'logins', 'integrations']},

    responsibleForEnvironments: [{type: Schema.Types.ObjectId, ref: 'environments'}],

    settings: Common.Settings(app),
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
