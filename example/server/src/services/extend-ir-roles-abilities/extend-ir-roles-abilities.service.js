// Initializes the `extend-ir-roles-abilities` service on path `/extend-ir-roles-abilities`
const {ExtendIrRolesAbilities} = require('./extend-ir-roles-abilities.class');
const extendModel = require('../../models/extend-ir-roles-abilities.model');
const hooks = require('./extend-ir-roles-abilities.hooks');

const {services} = require('@ionrev/ir-roles-server');

module.exports = function (app) {
  services.abilities(app, {
    extend_hooks: hooks,
    extend_schema: extendModel(app),
    extend_class_fn: ExtendIrRolesAbilities,
  });
};
