// Initializes the `extend-ir-roles-roles` service on path `/extend-ir-roles-roles`
const {ExtendIrRolesRoles} = require('./extend-ir-roles-roles.class');
const extendModel = require('../../models/extend-ir-roles-roles.model');
const hooks = require('./extend-ir-roles-roles.hooks');

const {services} = require('@ionrev/ir-roles-server');

module.exports = function (app) {
  services.roles(app, {
    extend_hooks: hooks,
    extend_schema: extendModel(app),
    extend_class_fn: ExtendIrRolesRoles,
  });
};
