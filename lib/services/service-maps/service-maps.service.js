// Initializes the `service-maps` service on path `/service-maps`
const { ServiceMaps } = require('./service-maps.class');
const createModel = require('../../models/service-maps.model');
const hooks = require('./service-maps.hooks');

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/service-maps', new ServiceMaps(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('service-maps');

  service.hooks(hooks);
};
