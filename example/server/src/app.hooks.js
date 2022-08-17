// Application hooks that run for every service
const {softDelete, paramsFromClient, iff} = require('feathers-hooks-common');

const {
  hooks: {
    restQueryUnstringify,
    removeFastjoin,
    aggregateHook,
    setCoreIdsJwtParams,
    setUrlConfigParams,
    setCoreIdsManualParams,
    setCoreParams,
    setCoreContextParams,
    setWhitelistService,
  },
} = require('@iy4u/common-server-lib');


module.exports = {
  before: {
    all: [
      ctx => {
        console.log(ctx);
      },
      restQueryUnstringify(),
      removeFastjoin(),
      paramsFromClient(
        'disableSoftDelete',
        '$globalAggregate',
        'verify_methods',
        'customLogo',
        'customBaseUrl',
        'customNextUrl',
        'relate_hook',
        'userJoin',
        'rulesJoin',
        'withAbilities',
        'loginsResolversQuery',
        'usersResolversQuery',
        'instances_fJoinHookResolversQuery',
        'v-instances_fJoinHookResolversQuery',
        'domains_fJoinHookResolversQuery',
        'hosts_fJoinHookResolversQuery',
        'environments_fJoinHookResolversQuery',
        'applications_fJoinHookResolversQuery',
        'integrations_fJoinHookResolversQuery',
        'integration-auths_fJoinHookResolversQuery',
      ),
      iff(
        context => ![
          'authentication',
          'sms',
          'mailer',
          'authManagement',
          'geocode',
          'places',
          'places-auto-complete',
          'file-uploader',
          'uploads',
          ...Object.values(context.app.get('uploads').enums.UPLOAD_SERVICES),
        ].includes(context.path),
        softDelete({
          // eslint-disable-next-line no-unused-vars
          deletedQuery: async context => {
            return {deleted: {$ne: true}, deletedAt: null};
          },
          // eslint-disable-next-line no-unused-vars
          removeData: async context => {
            return {deleted: true, deletedAt: new Date()};
          },
        }),
      ),
      ctx => {
        console.log(ctx);
      },
      setCoreIdsJwtParams(),
      setUrlConfigParams(),
      setCoreIdsManualParams(),
      setCoreParams(),
      setCoreContextParams(),
      setWhitelistService({
        whitelist: ['$options', '$regex'],
        services: ['instances', 'v-instances', 'domains', 'applications', 'environments', 'hosts', 'integrations', 'integration-auths'],
      }),

    ],
    find: [
      aggregateHook(),
    ],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: [],
  },

  after: {
    all: [
      // serviceLogger(),
    ],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: [],
  },

  error: {
    all: [
      // serviceLogger(),
    ],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: [],
  },
};
