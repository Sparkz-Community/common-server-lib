// Initializes the `url-parses` service on path `/url-parses`
const { UrlParses } = require('./url-parses.class');
const hooks = require('./url-parses.hooks');

module.exports = function (app) {
  const options = {
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/url-parses', new UrlParses(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('url-parses');

  service.hooks(hooks);
};
