const {packages:{lodash: {lget}}} = require('@iy4u/common-utils');

const {fJoinHook} = require('../../hooks').joinHooks;

const setupInstanceDb = require('./hooks/setup-instance-db.js');
const coreAuthentication = require('../../hooks/core-authentication');
const {syncDataMultiInstance, checkForInstanceContext} = require('../../hooks/core-context');
const connectMongoose = require('../../connectMongoose');


const setInstanceConnection = async (context) => {
  const connectionStringOnService = lget(context, ['service', 'options', 'Model', 'db', '_connectionString']);
  const projectConnectionString = lget(context.app.get('mongo'), 'uri');

  if (connectionStringOnService === projectConnectionString) {
    let {result} = context;
    let instances = Array.isArray(result) ? result : [result];

    instances.forEach(instance => {
      const config = lget(instance, 'settings.instances.mongo');
      connectMongoose(context.app, `${instance._id}MongooseClient`, config);
    });
  }
};

// const syncRemoteInstanceRecord = async (ctx) => {
//   const connectionStringOnService = lget(ctx, ['service', 'options', 'Model', 'db', '_connectionString']);
//   const projectConnectionString = lget(ctx.app.get('mongo'), 'uri');
//
//   if (connectionStringOnService === projectConnectionString) {
//     let {result} = ctx;
//     let instances = Array.isArray(result) ? result : [result];
//
//     await Promise.all(instances.map((instance) => {
//       const remoteInstance = instance;
//       const data = instance;
//       return syncDataMultiInstance({remoteInstance, data})(ctx);
//     }));
//   }
//   return ctx;
// };

const syncRemoteInstanceRecord = async (ctx) => {
  const connectionStringOnResult = lget(ctx.result, ['settings', 'instances', 'mongo', 'uri']);
  const projectConnectionString = lget(ctx.app.get('mongo'), 'uri');

  if (connectionStringOnResult !== projectConnectionString) {
    let {result} = ctx;
    let instances = Array.isArray(result) ? result : [result];

    await Promise.all(instances.map((instance) => {
      const remoteInstance = instance;
      const data = instance;
      return syncDataMultiInstance({remoteInstance, data})(ctx);
    }));
  }
  return ctx;
};


module.exports = {
  before: {
    all: [
      coreAuthentication({
        required: [
          {service: 'authentication', strategies: ['jwt']},
          // {service: 'integrationAuth', strategies: ['jwt']},
        ],
        optional: [
          // {service: 'authentication', strategies: ['jwt']},
          {service: 'integrationAuth', strategies: ['jwt']},
        ],
      }),
    ],
    find: [],
    get: [],
    create: [
      checkForInstanceContext,
      setupInstanceDb,
    ],
    update: [checkForInstanceContext],
    patch: [checkForInstanceContext],
    remove: [checkForInstanceContext],
  },

  after: {
    all: [
      fJoinHook('vInstances', 'v-instances'),
    ],
    find: [],
    get: [],
    create: [
      setInstanceConnection,
      syncRemoteInstanceRecord,
    ],
    update: [
      setInstanceConnection,
      syncRemoteInstanceRecord,
    ],
    patch: [
      setInstanceConnection,
      syncRemoteInstanceRecord,
    ],
    remove: [],
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: [],
  },
};
