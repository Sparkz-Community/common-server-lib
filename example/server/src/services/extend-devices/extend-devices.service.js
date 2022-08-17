// Initializes the `devices` service on path `/devices`
const {extendDevices} = require('./extend-devices.class');
const extendModel = require('../../models/extend-devices.model');
const hooks = require('./extend-devices.hooks');
const {services} = require('@iy4u/common-server-lib');
const {packages: {lodash: {lget}}} = require('@iy4u/common-utils');

module.exports = function (app) {
  lget(services, 'devices')(app, {
    extend_hooks: hooks,
    extend_schema: extendModel(app),
    extend_class_fn: extendDevices,
  });
};
