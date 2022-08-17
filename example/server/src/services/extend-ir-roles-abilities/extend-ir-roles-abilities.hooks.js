const {fastJoin, iff} = require('feathers-hooks-common');
const {packages: {lodash: {lset, lget}}} = require('@iy4u/common-utils');

const userResolver = {
  joins: {
    children: {
      resolver: () => async (role, context) => {

        let createdBy = context.app.service('users').find({
          query: {_id: {$in: lget(role, 'createdBy', [])}},
          paginate: false
        });


        let updatedBy = context.app.service('users').find({
          query: {_id: {$in: lget(role, 'updatedBy', [])}},
          paginate: false
        });

        await Promise.all([createdBy, updatedBy ]).then((res) => {
          lset(role, '_fastjoin.createdBy', lget(res, '[0][0].email', 'No Email Found'));
          lset(role, '_fastjoin.updatedBy', lget(res, '[1][0].email', 'No Email Found'));
        }).catch((err) => {
          return err;
        });

      }
    }
  }
};

module.exports = {
  before: {
    all: [
      context => {
        context.service.options.whitelist = ['$options', '$regex'];
      },
    ],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  after: {
    all: [
      iff(ctx => !!ctx.params.userJoin, fastJoin(userResolver)),
    ],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
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
