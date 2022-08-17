const {hooks: {createdBy, updatedBy}} = require('@iy4u/common-server-lib');

module.exports = function (app) {
  Object.keys(app.services).forEach(service => {
    // if (!['authentication', 'appauth', 'user-vault'].includes(service)) {
    app.service(service).hooks({
      before: {
        all: [],
        find: [],
        get: [],
        create: [createdBy, updatedBy],
        update: [updatedBy],
        patch: [updatedBy],
        remove: [updatedBy]
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
    });
    // }
  });
};
