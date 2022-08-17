// Initializes the `domains` service on path `/domains`
const {Domains} = require('./domains.class');
const createModel = require('../../models/domains.model');
const hooks = require('./domains.hooks');

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

    const ExtendedClass = extend_class_fn(Domains);
    // Initialize our service with any options it requires
    app.use('/domains', new ExtendedClass(options, app));
  } else {
    // Initialize our service with any options it requires
    app.use('/domains', new Domains(options, app));
  }

  // Get our initialized service so that we can register hooks
  const service = app.service('domains');

  service.hooks(lmergeWith(hooks, extend_hooks, hookCustomizer));
};
