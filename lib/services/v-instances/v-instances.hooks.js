const {packages:{lodash: {lget}}} = require('@iy4u/common-utils');

const coreAuthentication = require('../../hooks/core-authentication');
const {relate} = require('../../hooks/relate-utils');
const {syncDataMultiInstance, checkForInstanceContext} = require('../../hooks/core-context');
// const {coreCall} = require('../../utils');
const {defaultCoreCall} = require('../../utils');
const {fJoinHook} = require('../../hooks').joinHooks;

// const syncRemoteVInstanceRecord = async (ctx) => {
//   const connectionStringOnService = lget(ctx, ['service', 'options', 'Model', 'db', '_connectionString']);
//   const projectConnectionString = lget(ctx.app.get('mongo'), 'uri');
//
//   if (connectionStringOnService === projectConnectionString) {
//     let {result} = ctx;
//     let vInstances = Array.isArray(result) ? result : [result];
//
//     await Promise.all(vInstances.map(async (vInstance) => {
//       const remoteInstance = await coreCall(ctx, 'instances').get(vInstance.instance);
//       const data = vInstance;
//       return syncDataMultiInstance({remoteInstance, data})(ctx);
//     }));
//   }
//   return ctx;
// };

const syncRemoteVInstanceRecord = async (ctx) => {
  // const connectionStringOnService = lget(ctx, ['service', 'options', 'Model', 'db', '_connectionString']);

  // get instanceId
  const resultInstanceId = lget(ctx.result, 'instance');
  // from project database
  if(resultInstanceId){
    const resultInstance = await defaultCoreCall(ctx, 'instances').get(resultInstanceId);

    const connectionStringOnResult = lget(resultInstance, ['settings', 'instances', 'mongo', 'uri']);

    const projectConnectionString = lget(ctx.app.get('mongo'), 'uri');

    if (connectionStringOnResult !== projectConnectionString) {
      let {result} = ctx;
      let vInstances = Array.isArray(result) ? result : [result];

      await Promise.all(vInstances.map(async (vInstance) => {
        const remoteInstance = resultInstance;
        const data = vInstance;
        return syncDataMultiInstance({remoteInstance, data})(ctx);
      }));
    }
  }
  return ctx;
};

const relateInstance = {
  herePath: 'instance',
  therePath: 'vInstances',
  thereService: 'instances',
  paramsName: 'relateInstance',
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
      relate('otm', relateInstance),
    ],
    update: [
      checkForInstanceContext,
      relate('otm', relateInstance),
    ],
    patch: [
      checkForInstanceContext,
      relate('otm', relateInstance),
    ],
    remove: [
      checkForInstanceContext,
      relate('otm', relateInstance),
    ],
  },

  after: {
    all: [
      fJoinHook('instance', 'instances'),
      fJoinHook('domains','domains'),
    ],
    find: [],
    get: [],
    create: [
      relate('otm', relateInstance),
      syncRemoteVInstanceRecord,
    ],
    update: [
      relate('otm', relateInstance),
      syncRemoteVInstanceRecord,
    ],
    patch: [
      relate('otm', relateInstance),
      syncRemoteVInstanceRecord,
    ],
    remove: [
      relate('otm', relateInstance),
    ],
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
