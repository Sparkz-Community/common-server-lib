// Initializes the `extend-ir-roles-rules` service on path `/extend-ir-roles-rules`
const {ExtendIrRolesRules} = require('./extend-ir-roles-rules.class');
const extendModel = require('../../models/extend-ir-roles-rules.model');
const hooks = require('./extend-ir-roles-rules.hooks');

const {services} = require('@ionrev/ir-roles-server');

module.exports = function (app) {
  services.rules(app, {
    extend_hooks: hooks,
    extend_schema: extendModel(app),
    extend_class_fn: ExtendIrRolesRules,
  });
};

