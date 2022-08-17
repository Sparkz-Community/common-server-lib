const {discard, iff, isProvider, preventChanges} = require('feathers-hooks-common');
const {hashPassword, protect} = require('@feathersjs/authentication-local').hooks;
const {packages: {lodash: {lget, lset}}, passwordGen} = require('@iy4u/common-utils');
const {fJoinHook/*, getJoin*/} = require('../../hooks').joinHooks;
const {relate} = require('../../hooks/relate-utils');
const coreAuthentication = require('../../hooks/core-authentication');


const relateEnvironmentsConfig = {
  paramsName: 'relateEnvironmentsConfig',
  herePath: 'environments',
  thereService: 'environments',
  therePath: 'integrationAuths',
};

const relateIntegrationConfig = {
  paramsName: 'relateIntegrationConfig',
  herePath: 'integration',
  thereService: 'integrations',
  therePath: 'integrationAuths',
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
      context => {
        let secretKey = lget(context, 'data.secretKey');
        if (!secretKey) {
          secretKey = passwordGen({
            length: 24,
            strict: true,
            numbers: true,
          });
          lset(context, 'data.secretKey', secretKey);
        }
        lset(context, 'params.secretKey', secretKey);
      },
      hashPassword('secretKey'),
      relate('mtm', relateEnvironmentsConfig),
      relate('otm', relateIntegrationConfig),
    ],
    update: [
      iff(isProvider('external'),
        discard('secretKey'),
        preventChanges(
          true,
          'secretKey',
        ),
      ),
      relate('mtm', relateEnvironmentsConfig),
      relate('otm', relateIntegrationConfig),
    ],
    patch: [
      iff(isProvider('external'),
        discard('secretKey'),
        preventChanges(
          true,
          'secretKey',
        ),
      ),
      relate('mtm', relateEnvironmentsConfig),
      relate('otm', relateIntegrationConfig),
    ],
    remove: [
      relate('mtm', relateEnvironmentsConfig),
      relate('otm', relateIntegrationConfig),
    ],
  },

  after: {
    all: [
      protect('secretKey'),
      fJoinHook('integration', 'integrations'),
    ],
    find: [],
    get: [],
    create: [
      relate('mtm', relateEnvironmentsConfig),
      relate('otm', relateIntegrationConfig),
      context => {
        let secretKey = lget(context, 'params.secretKey');
        if (secretKey) lset(context, 'result.secretKey', secretKey);
      },
    ],
    update: [
      relate('mtm', relateEnvironmentsConfig),
      relate('otm', relateIntegrationConfig),
    ],
    patch: [
      relate('mtm', relateEnvironmentsConfig),
      relate('otm', relateIntegrationConfig),
    ],
    remove: [
      relate('mtm', relateEnvironmentsConfig),
      relate('otm', relateIntegrationConfig),
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
