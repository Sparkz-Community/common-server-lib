// Initializes the `generatePassword` service on path `/generate-password`
const { GeneratePasswords } = require('./generate-passwords.class');
const hooks = require('./generate-passwords.hooks');

module.exports = function (app) {
  const options = {
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/generate-passwords', new GeneratePasswords(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('generate-passwords');

  service.hooks(hooks);
};
