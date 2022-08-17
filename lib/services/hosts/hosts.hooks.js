const {packages:{lodash: {lget}}} = require('@iy4u/common-utils');

const {fJoinHook/*, getJoin*/}= require('../../hooks').joinHooks;
// const { corePermissionsHook } = require('../../hooks/core-permissions');
const { relate } = require('../../hooks/relate-utils');
const coreAuthentication = require('../../hooks/core-authentication');


// const joinDomain = async context => {
//   if(!context.params.joiningHost) {
//     const config = {
//       params: { joiningDomain: true },
//       service: 'domains',
//       herePath: 'domain',
//     };
//     context.params.joiningDomain = true;
//     return getJoin(config)(context);
//   } else return context;
// };

// const joinWhiteLabel = async context => {
//   return getJoin({
//     herePath: 'environment',
//     service: 'environments'
//   })(context);
// };
//
// const joinApplication = async context => {
//   return getJoin({
//     herePath: 'application',
//     service: 'applications'
//   })(context);
// };

// const checkPermission = async context => {
//   let subject = lget(context.params, 'relateOtm.relateWhiteLabel.relateOtm_res_before');
//   return corePermissionsHook({ subject })(context);
// };

// const { joinSettings, joinRoutes } = require('../../hooks/core-settings');
//
//
//
// const routeJoin = async context => {
//   return joinRoutes(context);
// };

const relateEnvironment = {
  herePath: 'environment',
  thereService: 'environments',
  therePath: 'hosts',
  paramsName: 'relateEnvironment'
};

const relateDomain = {
  paramsName: 'relateDomain',
  herePath: 'domain',
  thereService: 'domains',
  therePath: 'hosts',
};

const relateApplication = {
  paramsName: 'relateApplication',
  herePath: 'application',
  thereService: 'applications',
  therePath: 'hosts',
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
      // checkPermission,
      relate('otm', relateDomain),
      relate('otm', relateEnvironment),
      relate('otm', relateApplication),
    ],
    update: [
      relate('otm', relateDomain),
      relate('otm', relateEnvironment),
      relate('otm', relateApplication),
    ],
    patch: [
      // checkPermission,
      // setDomain,
      relate('otm', relateDomain),
      relate('otm',relateEnvironment),
      relate('otm', relateApplication),
    ],
    remove: [
      // checkPermission,
      relate('otm', relateDomain),
      relate('otm', relateEnvironment),
      relate('otm', relateApplication),
    ]
  },

  after: {
    all: [
      fJoinHook('environment','environments'),
      fJoinHook('domain','domains'),
      fJoinHook('application','applications'),
    ],
    find: [],
    get: [],
    create: [
      relate('otm', relateDomain),
      relate('otm', relateEnvironment),
      relate('otm', relateApplication),
    ],
    update: [
      relate('otm', relateDomain),
      relate('otm', relateEnvironment),
      relate('otm', relateApplication),
    ],
    patch: [
      relate('otm', relateDomain),
      relate('otm', relateEnvironment),
      relate('otm', relateApplication),
    ],
    remove: [
      relate('otm', relateDomain),
      relate('otm', relateEnvironment),
      relate('otm', relateApplication),
    ]
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
};
