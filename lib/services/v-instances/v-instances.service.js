// Initializes the `applications` service on path `/applications`
const {VInstances} = require('./v-instances.class');
const createModel = require('../../models/v-instances.model');
const hooks = require('./v-instances.hooks');

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

    const ExtendedClass = extend_class_fn(VInstances);
    // Initialize our service with any options it requires
    app.use('/v-instances', new ExtendedClass(options, app));
  } else {
    // Initialize our service with any options it requires
    app.use('/v-instances', new VInstances(options, app));
  }

  // Get our initialized service so that we can register hooks
  const service = app.service('v-instances');

  service.hooks(lmergeWith(hooks, extend_hooks, hookCustomizer));
};
