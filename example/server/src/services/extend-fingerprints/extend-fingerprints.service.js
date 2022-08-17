// Initializes the `users` service on path `/users`
const {extendFingerprints} = require('./extend-fingerprints.class');
const extendModel = require('../../models/extend-fingerprints.model');
const hooks = require('./extend-fingerprints.hooks');
const {
  utils: {generateDefaultInstance},
} = require('@iy4u/common-server-lib');
const {packages: {lodash: {lget}}} = require('@iy4u/common-utils');
const {services} = require('@iy4u/feathers-fingerprint');
module.exports = function (app) {
  const projectInstanceName = lget(generateDefaultInstance(app), 'name');
  const mongoConfigName = `${projectInstanceName}MongooseClient`;
  const connection = app.get(mongoConfigName);
  lget(services, 'fingerprints')(app, {
    connection,
    extend_hooks: hooks,
    extend_schema: extendModel(app),
    extend_class_fn: extendFingerprints,
  });
};
