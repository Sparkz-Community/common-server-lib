const {packages:{lodash: {lget}}} = require('@iy4u/common-utils');

const coreAuthentication = require('../../hooks/core-authentication');
const {fJoinHook} = require('../../hooks').joinHooks;
const {relate} = require('../../hooks/relate-utils');
const {syncDataMultiInstance, checkForInstanceContext} = require('../../hooks/core-context');
// const {coreCall} = require('../../utils');
const {defaultCoreCall} = require('../../utils');

const relateController = {
  herePath: 'vInstance',
  thereService: 'v-instances',
  therePath: 'domains',
  paramsName: 'relateController',
};

// const syncRemoteDomainRecord = async (ctx) => {
//   const connectionStringOnService = lget(ctx, ['service', 'options', 'Model', 'db', '_connectionString']);
//   const projectConnectionString = lget(ctx.app.get('mongo'), 'uri');
//
//   if (connectionStringOnService === projectConnectionString) {
//     let {result} = ctx;
//     let domains = Array.isArray(result) ? result : [result];
//
//     await Promise.all(domains.map(async (domain) => {
//       const vInstance = await coreCall(ctx, 'v-instances').get(domain.vInstance, {
//         'v-instances_fJoinHookResolversQuery': {
//           instance: true,
//         },
//       });
//       const remoteInstance = lget(vInstance, '_fastjoin.instance');
//       const data = domain;
//       return syncDataMultiInstance({remoteInstance, data})(ctx);
//     }));
//   }
//   return ctx;
// };

const syncRemoteDomainRecord = async (ctx) => {
  // const connectionStringOnService = lget(ctx, ['service', 'options', 'Model', 'db', '_connectionString']);
  const projectConnectionString = lget(ctx.app.get('mongo'), 'uri');

  // get vInstanceId
  const resultVInstanceId = lget(ctx.result, 'vInstance');

  if(resultVInstanceId) {
    // get the vInstanceFromRootDB
    const vInstanceFromRootDB = await defaultCoreCall(ctx, 'v-instances').get(resultVInstanceId, {
      'v-instances_fJoinHookResolversQuery': {
        instance: true,
      },
    });
    const resultInstance = lget(vInstanceFromRootDB,['_fastjoin','instance']);

    const connectionStringOnResult = lget(resultInstance, ['settings', 'instances', 'mongo', 'uri']);

    if (connectionStringOnResult !== projectConnectionString) {
      let {result} = ctx;
      let domains = Array.isArray(result) ? result : [result];
      await Promise.all(domains.map(async (domain) => {
        const remoteInstance = resultInstance;
        const data = domain;
        return syncDataMultiInstance({remoteInstance, data})(ctx);
      }));
    }
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
      relate('otm', relateController),
    ],
    update: [
      checkForInstanceContext,
      relate('otm', relateController),
    ],
    patch: [
      checkForInstanceContext,
      relate('otm', relateController),
    ],
    remove: [
      checkForInstanceContext,
      relate('otm', relateController),
    ],
  },

  after: {
    all: [
      fJoinHook('vInstance', 'v-instances'),
      fJoinHook('hosts','hosts'),
    ],
    find: [],
    get: [],
    create: [
      relate('otm', relateController),
      syncRemoteDomainRecord,
    ],
    update: [
      relate('otm', relateController),
      syncRemoteDomainRecord,
    ],
    patch: [
      relate('otm', relateController),
      syncRemoteDomainRecord,
    ],
    remove: [
      relate('otm', relateController),
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

