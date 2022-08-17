// Use this hook to manipulate incoming or outgoing data.
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

  let updatedBy = {};

  if (userEntity) {
    lset(updatedBy, 'user', lget(userEntity, '_id'));
  }

  if (loginEntity) {
    lset(updatedBy, 'login', lget(loginEntity, '_id'));
  }

  if (integrationEntity) {
    lset(updatedBy, 'integration', lget(integrationEntity, '_id'));
  }

  if (fingerprintEntity) {
    lset(updatedBy, 'fingerprint', lget(fingerprintEntity, '_id'));
  }

  if (Object.keys(updatedBy).length) {
    lset(context.data, 'updatedBy', updatedBy);

    // if (context.method === 'create') {
    //   lset(context.data, 'updatedByHistory', [updatedBy]);
    // } else {
    //   lset(context.data, '$addToSet.updatedByHistory', updatedBy);
    // }
  }
  return context;
};
