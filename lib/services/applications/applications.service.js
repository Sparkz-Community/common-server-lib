// Initializes the `applications` service on path `/applications`
const {Applications} = require('./applications.class');
const createModel = require('../../models/applications.model');
const hooks = require('./applications.hooks');

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

    const ExtendedClass = extend_class_fn(Applications);
    // Initialize our service with any options it requires
    app.use('/applications', new ExtendedClass(options, app));
  } else {
    // Initialize our service with any options it requires
    app.use('/applications', new Applications(options, app));
  }

  // Get our initialized service so that we can register hooks
  const service = app.service('applications');

  service.hooks(lmergeWith(hooks, extend_hooks, hookCustomizer));
};
