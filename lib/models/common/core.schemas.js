const {packages:{lodash: {lget, lunset, lmergeWith}}, extensionUtils: {schemaCustomizer}} = require('@iy4u/common-utils');

const corePermissions = (app, { extend_schema = {}, schema_remove_paths = [] } = {}) => {
  const mongoose = app.get('mongoose');
  const { Schema } = mongoose;

  const orig_schema = {
    users: {
      manage: [],
      own: [],
      member: []
    },
    integrations: {
      manage: [],
      own: [],
      member: []
    }
  };
  schema_remove_paths.map(path => lunset(orig_schema, path));

  return new Schema(lmergeWith(orig_schema, extend_schema, schemaCustomizer), {
    _id: false
  });
};

// eslint-disable-next-line no-unused-vars
const coreSchemaFn = (app, {
  audited = false,
  extend_schema = {},
  schema_remove_paths = [],
  // requiredFields = []
} = {}) => {
  const mongoose = app.get('mongoose');
  const { Schema } = mongoose;

  const orig_schema = {
    // nativePermissions: corePermissions(app).obj,
    nativePermissions: corePermissions(app),
    deleted: { type: Boolean, default: false, index: true },
    deletedAt: { type: Date, default: null, index: true },

    createdBy: {
      _id: { type: Schema.Types.ObjectId, refPath: 'createdByModel' },
      createdByModel: {
        type: String,
        enum: ['users', 'integrations'],
        required() {
          // if created by authentication, specify the service
          return !!lget(this.createdBy, '_id');
        }
      },
      device: { type: Schema.Types.ObjectId, ref: 'devices' },

    },

    updatedBy: {
      _id: { type: Schema.Types.ObjectId, refPath: 'updatedByModel' },
      updatedByModel: {
        type: String,
        enum: ['users', 'integrations'],
        required() {
          return !!lget(this.updatedBy, '_id');
        }
      },
      device: { type: Schema.Types.ObjectId, ref: 'devices' },

    },

    updatedByHistory: [{
      _id: { type: Schema.Types.ObjectId, refPath: 'updatedByModel' },
      updatedByModel: {
        type: String,
        default: 'users',
        enum: ['users', 'integrations'],
      },
      device: { type: Schema.Types.ObjectId, ref: 'devices' },
      updatedAt: Date,
    }],

    settings: {
      type: Object,
      contains: {
        routes: [],
        mergeSettings: {
          default: {
            behavior: { type: String, enum: ['replace', 'merge'], default: 'merge' },
            keyBy: { type: String, default: '_id' }
          }
        }
      }
    },

    external: {
      type: Object,
      contains: {
        createdBySource: {
          _id: {
            type: String,
            required() {
              return audited && (lget(this.createdBy, 'createdByModel') === 'integrations');
            }
          },
          Model: {
            type: String,
            required() {
              return !!lget(this.createdBySource, '_id');
            }
          }
        },
        updatedBySource: {
          _id: {
            type: String,
            required() {
              return audited && (lget(this.createdBy, 'createdByModel') === 'integrations');
            }
          },
          Model: {
            type: String,
            required() {
              return !!lget(this.updatedBySource, '_id');
            }
          }
        },
        updatedBySourceHistory: [{
          updatedBy: String,
          updatedByHistoryModel: String,
          updatedAt: Date,
        }],
        meta: Schema.Types.Mixed
      },
    }

  };

  schema_remove_paths.map(path => lunset(orig_schema, path));

  return new Schema(lmergeWith(orig_schema, extend_schema, schemaCustomizer), {
    _id: false
  });
};

module.exports = {
  corePermissions,
  coreSchemaFn
};
