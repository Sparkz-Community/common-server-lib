/* eslint-disable no-unused-vars */
const {hashPassword, protect} = require('@feathersjs/authentication-local').hooks;
const {iff, isProvider, preventChanges, fastJoin} = require('feathers-hooks-common');
const {hooks: {authorize}, utils: {collectRules, rulesTemplater}} = require('@ionrev/ir-roles-server');
const {packages: {lodash: {lget, lset}}, passwordGen} = require('@iy4u/common-utils');
const {setField} = require('feathers-authentication-hooks');

const {coreAuthentication} = require('../../hooks');
const {coreCall} = require('../../utils');

const verifyHooks = require('@ionrev/ir-auth-management-server')['feathers-authentication-management'].hooks;
const {services: {middleware: {notifier: accountService}}} = require('@ionrev/ir-auth-management-server');

const {checkContext} = require('../../hooks');
const {relate} = require('../../hooks/relate-utils');


const passwordLater = (context) => {
  checkContext(context, 'before', 'create');

  if (lget(context, 'params.passwordLater', false)) {
    let password = passwordGen();
    lset(context, 'data.password', password);
  }
};

const verifyOAuth = context => {
  if (context.data.googleId || context.data.facebookId || context.data.linkedinId || context.data.githubId || context.data.vimeoId) {
    context.data.isVerified = true;
    context.data.verifyToken = null;
    context.data.verifyShortToken = null;
    context.data.verifyExpires = null;
    context.data.verifyChanges = {};
  }
};

const rulesConfig = {
  rulesLocation: 'params.login._fastjoin.rules',
  deBug: true,
};

const attachUserRole = async context => {
  let defaultUserRole = await coreCall(context, 'ir-roles-roles').find({
    query: {name: 'Default Basic login'},
    paginate: false,
  });
  if (defaultUserRole.length) {
    let defaultId = defaultUserRole[0]._id;
    if (defaultId && context.data) {
      lset(context, 'data.roles', [defaultId]);
    }
  }
  return context;
};

const loginsResolvers = {
  joins: {
    // eslint-disable-next-line no-unused-vars
    accounts: ($select, params) => async (data, context) => {
      const remoteService = 'accounts';
      const dataPath = 'accounts.owns.ids';

      let remoteIds = lget(data, dataPath, []);
      if (remoteIds.length > 0) {
        params = {
          query: {
            $client: {
              ...params,
            },
            _id: {
              $in: remoteIds,
            },
          },
          paginate: false,
        };

        if ($select) {
          lset(params, 'query.$select', $select);
        }

        let results = await coreCall(context, remoteService).find(params);

        if (results && results.length) {
          lset(data, `_fastjoin.${dataPath}`, results);

          let active = results.find(result => {
            return String(lget(result, '_id', '_id')) === String(lget(data, 'accounts.owns.active', 'active'));
          });
          lset(data, '_fastjoin.accounts.owns.active', active ? active : results[0]);
        }
      }
    },
  },
};

const rulesResolver = {
  joins: {
    children: {
      resolver: () => async (user, context) => {
        if (String(lget(context, 'params.login._id')) === String(user._id) || !isProvider('external')(context)) {
          let {roleRules} = await collectRules(context, {roles: lget(user, 'roles', [])});
          if (!context.params.user) context.params.user = user;
          roleRules = rulesTemplater({rules: roleRules, context});
          roleRules = roleRules.reduce((acc, curr) => {
            if (Array.isArray(curr.fields) && curr.fields.length === 0) {
              delete curr.fields;
            }
            return [...acc, curr];
          }, []);
          lset(user, '_fastjoin.rules', roleRules);
        }
      },
    },
  },
};

const rolesResolver = {
  joins: {
    children: {
      resolver: ($select, params) => async (login, context) => {
        if (login.roles && login.roles.length) {
          params = {
            query: {
              $client: {
                ...params,
              },
              _id: {
                $in: login.roles,
              },
            },
          };
          if ($select) {
            lset(params, 'query.$select', $select);
          }
          const roles = await coreCall(context, 'ir-roles-roles').find({
            ...params,
            paginate: false,
          })
            .catch(err => {
              console.error('error joining roles to login: ' + err.message);
            });
          lset(login, '_fastjoin.roles', roles);
        }
      },
    },
  },
};

const relateLoginsToUsersConfig = {
  paramsName: 'relateLoginsToUsersConfig',
  herePath: 'user',
  therePath: 'logins.ids',
  thereService: 'users',
};

const relateLoginsToAccountOwnsConfig = {
  paramsName: 'relateLoginsToAccountOwnsConfig',
  herePath: 'accounts.owns.ids',
  therePath: 'logins.ownedBy',
  thereService: 'accounts',
};

const relateLoginsToAccountMembersConfig = {
  paramsName: 'relateLoginsToAccountMembersConfig',
  herePath: 'accounts.memberOf',
  therePath: 'logins.members',
  thereService: 'account',
};

const setEnvironment = setField({
  from: 'params.coreContext.environment._id',
  as: 'data.environment',
});


// eslint-disable-next-line no-unused-vars
module.exports = function (options = {}) {
  return {
    before: {
      all: [],
      find: [
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
      get: [
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
      create: [
        setEnvironment,
        passwordLater,
        context => {
          let password = lget(context, 'data.password');
          if (password) {
            lset(context, 'params.password', password);
          }
        },
        hashPassword('password'),
        verifyHooks.addVerification(),
        verifyOAuth,
        attachUserRole,
        relate('otm', relateLoginsToUsersConfig),
        relate('mtm', relateLoginsToAccountOwnsConfig),
        relate('mtm', relateLoginsToAccountMembersConfig),
      ],
      update: [
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
        setEnvironment,
        iff(isProvider('external'),
          preventChanges(
            true,
            'email',
            'password',
            'isVerified',
            'verifyToken',
            'verifyShortToken',
            'verifyExpires',
            'verifyChanges',
            'resetToken',
            'resetShortToken',
            'resetExpires',
          ),
        ),
        // relateMtm(relateApplicationsConfig),
        relate('otm', relateLoginsToUsersConfig),
        relate('mtm', relateLoginsToAccountOwnsConfig),
        relate('mtm', relateLoginsToAccountMembersConfig),
      ],
      patch: [
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
        setEnvironment,
        iff(isProvider('external'),
          preventChanges(
            true,
            'email',
            'password',
            'isVerified',
            'verifyToken',
            'verifyShortToken',
            'verifyExpires',
            'verifyChanges',
            'resetToken',
            'resetShortToken',
            'resetExpires',
          ),
        ),
        relate('otm', relateLoginsToUsersConfig),
        relate('mtm', relateLoginsToAccountOwnsConfig),
        relate('mtm', relateLoginsToAccountMembersConfig),
      ],
      remove: [
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
        relate('otm', relateLoginsToUsersConfig),
        relate('mtm', relateLoginsToAccountOwnsConfig),
        relate('mtm', relateLoginsToAccountMembersConfig),
      ],
    },

    after: {
      all: [
        iff(ctx => !!ctx.params.rolesJoin || !!ctx.params.rulesJoin, fastJoin(rolesResolver)),
        iff(ctx => !!ctx.params.rulesJoin, fastJoin(rulesResolver)),

        fastJoin(
          loginsResolvers,
          context => {
            let query = {};
            if (lget(context, ['params', 'loginsResolversQuery'])) {
              Object.keys(loginsResolvers.joins).forEach(key => {
                let val = lget(context, ['params', 'loginsResolversQuery', key], false);
                if (val) lset(query, key, val);
              });
            }
            return query;
          },
        ),

        // Make sure the password field is never sent to the client
        // Always must be the last hook
        protect('password'),
      ],
      find: [],
      get: [],
      create: [
        async (context) => {
          let options = await context.app.service('authManagement').create({
            action: 'options',
          });

          let notifierOptions = {
            preferredComm: lget(context, 'params.verify_methods', []),
            customLogo: lget(context, 'params.customLogo'),
            customBaseUrl: lget(context, 'params.customBaseUrl'),
            customNextUrl: lget(context, 'params.customNextUrl'),
          };
          if (lget(context, 'params.passwordLater', false)) {
            lset(notifierOptions, 'customLinkParams.reset_password', true);
          }
          if (lget(context, 'params.showPassword', false)) {
            lset(notifierOptions, 'customLinkParams.password', lget(context, 'params.password'));
          }
          accountService(context.app, options).notifier('resendVerifySignup', context.result, notifierOptions);
        },
        verifyHooks.removeVerification(),
        relate('otm', relateLoginsToUsersConfig),
        relate('mtm', relateLoginsToAccountOwnsConfig),
        relate('mtm', relateLoginsToAccountMembersConfig),
      ],
      update: [
        relate('otm', relateLoginsToUsersConfig),
        relate('mtm', relateLoginsToAccountOwnsConfig),
        relate('mtm', relateLoginsToAccountMembersConfig),
      ],
      patch: [
        relate('otm', relateLoginsToUsersConfig),
        relate('mtm', relateLoginsToAccountOwnsConfig),
        relate('mtm', relateLoginsToAccountMembersConfig),
      ],
      remove: [
        relate('otm', relateLoginsToUsersConfig),
        relate('mtm', relateLoginsToAccountOwnsConfig),
        relate('mtm', relateLoginsToAccountMembersConfig),
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
};
