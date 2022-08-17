// const {iff, isProvider} = require('feathers-hooks-common');

// BYPASS: Authentication hook throws Not Authenticated errors for internal calls
// TODO: Make it active only for external requests
// const {coreAuthentication} = require('../../hooks/core-authentication');
module.exports = {
  before: {
    all: [
      // iff(isProvider('external'),
      //   coreAuthentication({
      //     required: [
      //       {service: 'authentication', strategies: ['jwt']},
      //       // {service: 'integrationAuth', strategies: ['jwt']},
      //     ],
      //     optional: [
      //       // {service: 'authentication', strategies: ['jwt']},
      //       {service: 'integrationAuth', strategies: ['jwt']},
      //     ],
      //   }),
      // ),

    ],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  after: {
    all: [],
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
