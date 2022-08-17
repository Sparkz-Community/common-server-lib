// Initializes the `integrations` service on path `/integrations`
const {Integrations} = require('./integrations.class');
const createModel = require('../../models/integrations.model');
const hooks = require('./integrations.hooks');

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

    const ExtendedClass = extend_class_fn(Integrations);
    // Initialize our service with any options it requires
    app.use('/integrations', new ExtendedClass(options, app));
  } else {
    // Initialize our service with any options it requires
    app.use('/integrations', new Integrations(options, app));
  }

  // Get our initialized service so that we can register hooks
  const service = app.service('integrations');

  service.hooks(lmergeWith(hooks, extend_hooks, hookCustomizer));
};
