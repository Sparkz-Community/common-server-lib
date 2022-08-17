const {relate} = require('../../hooks/relate-utils');
const coreAuthentication = require('../../hooks/core-authentication');
// const {coreInstanceDefault} = require('../../hooks/core-context');
const {fJoinHook} = require('../../hooks').joinHooks;


const relateFeaturesConfig = {
  paramsName: 'relateFeaturesConfig',
  idPath: '_id',
  herePath: 'features',
  thereService: 'features',
  therePath: 'applications',
};

const relateEnvironmentsConfig = {
  paramsName: 'relateEnvironmentsConfig',
  herePath: 'environments',
  thereService: 'environments',
  therePath: 'applications',
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
      // coreInstanceDefault,
      relate('mtm', relateFeaturesConfig),
      relate('mtm', relateEnvironmentsConfig),
    ],
    update: [
      relate('mtm', relateFeaturesConfig),
      relate('mtm', relateEnvironmentsConfig),
    ],
    patch: [
      relate('mtm', relateFeaturesConfig),
      relate('mtm', relateEnvironmentsConfig),
    ],
    remove: [
      relate('mtm', relateFeaturesConfig),
      relate('mtm', relateEnvironmentsConfig),
    ],
  },

  after: {
    all: [
      fJoinHook('environments', 'environments'),
      fJoinHook('hosts', 'hosts'),
    ],
    find: [],
    get: [],
    create: [
      relate('mtm', relateFeaturesConfig),
      relate('mtm', relateEnvironmentsConfig),
    ],
    update: [
      relate('mtm', relateFeaturesConfig),
      relate('mtm', relateEnvironmentsConfig),
    ],
    patch: [
      relate('mtm', relateFeaturesConfig),
      relate('mtm', relateEnvironmentsConfig),
    ],
    remove: [
      relate('mtm', relateFeaturesConfig),
      relate('mtm', relateEnvironmentsConfig),
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
