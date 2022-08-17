// const {packages:{lodash: {lget, lset}}} = require('@iy4u/common-utils');

const {fJoinHook} = require('../../hooks/fast-join');
const coreAuthentication = require('../../hooks/core-authentication');
const {relate} = require('../../hooks/relate-utils');

//
// const relateDomain = async context => {
//
//   const updateHostDomain = async ctx => {
//     let host = extractHost({ context, domain: lget(context.result, '_fastjoin.domain'), path: 'host' });
//     ctx.params.syncHostDomain = await ctx.app.service('hosts').patch(host._id, { domain: ctx.result.domain });
//   };
//
//   const config = {
//     paramsName: 'relateDomain',
//     herePath: 'domain',
//     thereService: 'domains',
//     therePath: 'environments',
//     afterHooks: [updateHostDomain]
//   };
//
//   if (context.method !== 'remove') return await relateOtm(config)(context);
//   else return await removeOtm(config)(context);
// };


// const syncHostDomain = async context => {
//   let existing = lget(context.params, 'relateOtm.relateDomain.relateOtm_res_before');
//   if(existing && existing.domain !== context.result.domain){
//     let host = extractHost({ context, domain: lget(existing, '_fastjoin.domain'), path: 'host' })
//     context.params.updatedHostDomain = await context.app.service('hosts').
//   };

const relateApplicationsConfig = {
  paramsName: 'relateApplicationsConfig',
  herePath: 'applications',
  thereService: 'applications',
  therePath: 'environments',
};

const relateIntegrationAuthsConfig = {
  paramsName: 'relateIntegrationAuthsConfig',
  herePath: 'integrationAuths',
  thereService: 'integration-auths',
  therePath: 'environments',
};

const relateResponsibleAccountConfig = {
  paramsName: 'relateResponsibleAccountConfig',
  herePath: 'responsibleAccount',
  thereService: 'accounts',
  therePath: 'responsibleForEnvironments',
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
      relate('mtm', relateApplicationsConfig),
      relate('mtm', relateIntegrationAuthsConfig),
      relate('otm',relateResponsibleAccountConfig)
    ],
    update: [
      relate('mtm', relateApplicationsConfig),
      relate('mtm', relateIntegrationAuthsConfig),
      relate('otm',relateResponsibleAccountConfig)
    ],
    patch: [
      relate('mtm', relateApplicationsConfig),
      relate('mtm', relateIntegrationAuthsConfig),
      relate('otm',relateResponsibleAccountConfig)
    ],
    remove: [
      relate('mtm', relateApplicationsConfig),
      relate('mtm', relateIntegrationAuthsConfig),
      relate('otm',relateResponsibleAccountConfig)
    ],

  },

  after: {
    all: [
      fJoinHook('applications', 'applications'),
      fJoinHook('hosts', 'hosts'),
      fJoinHook('integrationAuths', 'integration-auths'),
      fJoinHook('responsibleAccount', 'accounts'),
    ],
    find: [],
    get: [],
    create: [
      relate('mtm', relateApplicationsConfig),
      relate('mtm', relateIntegrationAuthsConfig),
      relate('otm',relateResponsibleAccountConfig)
    ],
    update: [
      relate('mtm', relateApplicationsConfig),
      relate('mtm', relateIntegrationAuthsConfig),
      relate('otm',relateResponsibleAccountConfig)
    ],
    patch: [
      relate('mtm', relateApplicationsConfig),
      relate('mtm', relateIntegrationAuthsConfig),
      relate('otm',relateResponsibleAccountConfig)
    ],
    remove: [
      relate('mtm', relateApplicationsConfig),
      relate('mtm', relateIntegrationAuthsConfig),
      relate('otm',relateResponsibleAccountConfig)
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
