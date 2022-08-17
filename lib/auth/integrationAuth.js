// const {JWTStrategy,} = require('@feathersjs/authentication');
const {LocalStrategy} = require('@feathersjs/authentication-local');
const {callingParamsDefaults} = require('feathers-hooks-common');
const {packages: {lodash: {lget, lset, lomit, lpick, lmergeWith}}} = require('@iy4u/common-utils');
const {extensionUtils: {hookCustomizer}} = require('@iy4u/common-utils');

const expressOauth = require('./express-oauth');
const {GCustomAuthService, CustomJWTStrategy} = require('./custom-auth-service');


callingParamsDefaults(['provider', 'authenticated', 'integration'], {_calledByHook: true});

class CustomAuthService extends GCustomAuthService {
  async getPayload(authResult, params) {
    // Call original `getPayload` first
    let payload = await super.getPayload(authResult, params);

    let coreIds = lget(params, 'coreIds');
    if (coreIds) {
      payload = {
        ...payload,
        ...coreIds,
      };
    }

    return payload;
  }
}


module.exports = (app, {
  extend_hooks = {},
  extend_class_fn = (superClass) => superClass,
  extendStrategies = (AppAuth) => AppAuth,
} = {}) => {
  // eslint-disable-next-line no-undef
  const configKey = 'integrationAuth';
  let IntegrationAuth;

  if (typeof extend_class_fn === 'function') {
    const ExtendedClass = extend_class_fn(CustomAuthService);
    IntegrationAuth = new ExtendedClass(app, configKey);
  } else {
    IntegrationAuth = new CustomAuthService(app, configKey);
  }


  IntegrationAuth.register('local', new LocalStrategy());
  IntegrationAuth.register('jwt', new CustomJWTStrategy());

  IntegrationAuth = extendStrategies(IntegrationAuth);

  app.use('/integrationAuth', IntegrationAuth);

  app.configure(expressOauth(app));

  app.service('integrationAuth').hooks(lmergeWith({
    before: {
      create: [],
    },
    after: {
      create: [
        context => {
          const {integration} = context.result;

          const integrationAuthConfig = context.app.get('integrationAuth');
          const defaultWhitelist = ['_id', 'name', 'createdAt', 'updatedAt', 'settings', 'updatedByHistory', 'external', 'nativePermissions', 'deletedAt', 'deleted'];
          let _integration;
          let enforceWhitelist = lget(integrationAuthConfig, 'enforceWhitelist', true);
          let whitelistIntegrationFields = lget(integrationAuthConfig, 'whitelistIntegrationFields', []);
          if (enforceWhitelist || whitelistIntegrationFields.length) _integration = lpick(integration, whitelistIntegrationFields.concat(defaultWhitelist));

          let blacklistIntegrationFields = lget(integration, 'blacklistIntegrationFields', []);
          _integration = lomit(_integration, blacklistIntegrationFields);
          lset(context.params, 'configKey', configKey);
          context.dispatch = Object.assign({}, context.result, {integration: _integration});
          return context;
        },
      ],
    },
    error: {
      create: [],
    },
  }, extend_hooks, hookCustomizer));
};
