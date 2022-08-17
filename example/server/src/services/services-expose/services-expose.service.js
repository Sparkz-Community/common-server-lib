// Initializes the `services-expose` service on path `/services-expose`
const { ServicesExpose } = require('./services-expose.class');
const hooks = require('./services-expose.hooks');

module.exports = function (app) {
  const options = {
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/services-expose', new ServicesExpose(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('services-expose');

  service.hooks(hooks);
};
