// Initializes the `integrations` service on path `/integrations`
const {IntegrationAuths} = require('./integration-auths.class');
const createModel = require('../../models/integration-auths.model');
const hooks = require('./integration-auths.hooks');

const {packages: {lodash: {lget, lmergeWith}}, extensionUtils: {hookCustomizer}} = require('@iy4u/common-utils');

module.exports = function (app, {
  extend_hooks = {},
  extend_schema = {},
  schema_remove_paths = [],
  extend_class_fn = (superClass) => superClass,
} = {}) {
  const defaultName = lget(app.get('instances'), 'name', 'default');
  const connection = app.get(`${defaultName}MongooseClient`);

  const options = {
    Model: createModel(app, {connection, extend_schema, schema_remove_paths}),
    paginate: app.get('paginate'),
    multi: true,
  };

  if (typeof extend_class_fn === 'function') {

    const ExtendedClass = extend_class_fn(IntegrationAuths);
    // Initialize our service with any options it requires
    app.use('/integration-auths', new ExtendedClass(options, app));
  } else {
    // Initialize our service with any options it requires
    app.use('/integration-auths', new IntegrationAuths(options, app));
  }

  // Get our initialized service so that we can register hooks
  const service = app.service('integration-auths');

  service.hooks(lmergeWith(hooks, extend_hooks, hookCustomizer));
};
