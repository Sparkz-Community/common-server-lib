// Initializes the `wallets` service on path `/wallets`
const { Wallets } = require('./wallets.class');
const createModel = require('../../models/wallets.model');
const hooks = require('./wallets.hooks');

const {
  utils: {generateDefaultInstance},
} = require('@iy4u/common-server-lib');
const {packages: {lodash: {lget}}} = require('@iy4u/common-utils');

module.exports = function (app) {
  const projectInstanceName = lget(generateDefaultInstance(app), 'name');
  const mongoConfigName = `${projectInstanceName}MongooseClient`;
  const connection = app.get(mongoConfigName);

  const options = {
    Model: createModel(app, {connection}),
    paginate: app.get('paginate'),
  };

  // Initialize our service with any options it requires
  app.use('/wallets', new Wallets(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('wallets');

  service.hooks(hooks);
};
