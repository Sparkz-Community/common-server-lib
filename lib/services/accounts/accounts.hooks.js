const coreAuthentication = require('../../hooks/core-authentication');
const {relate} = require('../../hooks/relate-utils');
const {packages: {lodash: {lget, lset}}} = require('@iy4u/common-utils');

const relateAccountsToLoginOwnsConfig = {
  paramsName: 'relateAccountsToLoginOwnsConfig',
  herePath: 'logins.ownedBy',
  therePath: 'accounts.owns.ids',
  thereService: 'logins',
};

const relateAccountsToLoginMembersConfig = {
  paramsName: 'relateAccountsToLoginMembersConfig',
  herePath: 'logins.members',
  therePath: 'accounts.memberOf',
  thereService: 'logins',
};

const relateAccountsOwnersConfig = {
  paramsName: 'relateAccountsOwnersConfig',
  herePath: 'ownership.owners',
  therePath: 'ownership.owns',
  thereService: 'accounts',
  beforeHooks: [
    context => {
      let newFkIds = lget(context, ['params', 'relateMtm', 'relateAccountsOwnersConfig', 'newFkIds'], []);
      if (newFkIds.length) {
        lset(context, ['params', 'relateMtm', 'relateAccountsOwnersConfig', 'newFkIds'], newFkIds.map(fkObj => fkObj.id));
      }

      let removedFkIds = lget(context, ['params', 'relateMtm', 'relateAccountsOwnersConfig', 'removedFkIds'], []);
      if (removedFkIds.length) {
        lset(context, ['params', 'relateMtm', 'relateAccountsOwnersConfig', 'removedFkIds'], removedFkIds.map(fkObj => fkObj.id));
      }

      let fkIds = lget(context, ['params', 'removeMtm', 'relateAccountsOwnersConfig', 'fkIds'], []);
      if (fkIds.length) {
        lset(context, ['params', 'removeMtm', 'relateAccountsOwnersConfig', 'fkIds'], fkIds.map(fkObj => fkObj.id));
      }
    },
  ],
};

module.exports = {
  before: {
    all: [
      coreAuthentication({
        required: [
          // {service: 'authentication', strategies: ['jwt']},
          // {service: 'integrationAuth', strategies: ['jwt']},
        ],
        optional: [
          {service: 'authentication', strategies: ['jwt']},
          {service: 'integrationAuth', strategies: ['jwt']},
        ],
      }),
    ],
    find: [],
    get: [],
    create: [
      relate('mtm', relateAccountsToLoginOwnsConfig),
      relate('mtm', relateAccountsToLoginMembersConfig),
      relate('mtm', relateAccountsOwnersConfig),
    ],
    update: [
      relate('mtm', relateAccountsToLoginOwnsConfig),
      relate('mtm', relateAccountsToLoginMembersConfig),
      relate('mtm', relateAccountsOwnersConfig),
    ],
    patch: [
      relate('mtm', relateAccountsToLoginOwnsConfig),
      relate('mtm', relateAccountsToLoginMembersConfig),
      relate('mtm', relateAccountsOwnersConfig),
    ],
    remove: [
      relate('mtm', relateAccountsToLoginOwnsConfig),
      relate('mtm', relateAccountsToLoginMembersConfig),
      relate('mtm', relateAccountsOwnersConfig),
    ],
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [
      relate('mtm', relateAccountsToLoginOwnsConfig),
      relate('mtm', relateAccountsToLoginMembersConfig),
      relate('mtm', relateAccountsOwnersConfig),
    ],
    update: [
      relate('mtm', relateAccountsToLoginOwnsConfig),
      relate('mtm', relateAccountsToLoginMembersConfig),
      relate('mtm', relateAccountsOwnersConfig),
    ],
    patch: [
      relate('mtm', relateAccountsToLoginOwnsConfig),
      relate('mtm', relateAccountsToLoginMembersConfig),
      relate('mtm', relateAccountsOwnersConfig),
    ],
    remove: [
      relate('mtm', relateAccountsToLoginOwnsConfig),
      relate('mtm', relateAccountsToLoginMembersConfig),
      relate('mtm', relateAccountsOwnersConfig),
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
