const {packages:{lodash: {lget, lset}}} = require('@iy4u/common-utils');

module.exports = context => {
  const authenticationConfig = context.app.get('authentication');
  const loginConfig = context.app.get('loginAuth');
  const integrationConfig = context.app.get('integrationAuth');
  const fingerprintConfig = context.app.get('fingerprintAuth');

  const {
    [lget(authenticationConfig, 'entity')]: userEntity,
    [lget(integrationConfig, 'entity')]: integrationEntity,
    [lget(loginConfig, 'entity')]: loginEntity,
    [lget(fingerprintConfig, 'entity')]: fingerprintEntity,
  } = context.params;

  let createdBy = {};

  if (userEntity) {
    lset(createdBy, 'user', lget(userEntity, '_id'));
  }

  if (loginEntity) {
    lset(createdBy, 'login', lget(loginEntity, '_id'));
  }

  if (integrationEntity) {
    lset(createdBy, 'integration', lget(integrationEntity, '_id'));
  }

  if (fingerprintEntity) {
    lset(createdBy, 'fingerprint', lget(fingerprintEntity, '_id'));
  }

  if (Object.keys(createdBy).length) lset(context.data, 'createdBy', createdBy);
  return context;
};
