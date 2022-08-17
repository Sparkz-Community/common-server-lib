const {packages:{lodash: {lget, lset}}} = require('@iy4u/common-utils');

module.exports = function (context) {
  const authenticationConfig = context.app.get('authentication');
  const integrationConfig = context.app.get('integrationAuth');

  const deviceFromHeader = lget(context.params, 'headers.device');
  const device = lget(context.params, 'device', deviceFromHeader);

  let model;
  const integrationEntity = lget(context.params, integrationConfig.entity);
  const integrationModel = lget(integrationConfig, 'service');

  if (integrationEntity) {
    model = integrationModel;
  } else {
    model = lget(authenticationConfig, 'service');
  }
  lset(context.params, 'entity', lget(context.params, authenticationConfig.entity) || integrationEntity);
  lset(context.params, 'model', model);
  lset(context.params, 'deviceEntity', device);
  return context;
};
