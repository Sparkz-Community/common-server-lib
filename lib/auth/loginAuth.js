// const {JWTStrategy,} = require('@feathersjs/authentication');
const {LocalStrategy} = require('@feathersjs/authentication-local');
const {callingParamsDefaults} = require('feathers-hooks-common');
const {packages: {lodash: {lget, lset, lomit, lpick, lmergeWith}}} = require('@iy4u/common-utils');
const {extensionUtils: {hookCustomizer}} = require('@iy4u/common-utils');

const expressOauth = require('./express-oauth');
const {GCustomAuthService, CustomJWTStrategy} = require('./custom-auth-service');
const {GoogleStrategy, FacebookStrategy, LinkedinStrategy} = require('./oauth-strategies');


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

class MyJwtStrategy extends CustomJWTStrategy {
  async getEntity(id, params) {
    params.rulesJoin = true;
    return super.getEntity(id, params);
  }
}


module.exports = (app, {
  extend_hooks = {},
  extend_class_fn = (superClass) => superClass,
  extendStrategies = (AppAuth) => AppAuth,
} = {}) => {
  // eslint-disable-next-line no-undef
  const configKey = 'loginAuth';
  let LoginAuth;

  if (typeof extend_class_fn === 'function') {
    const ExtendedClass = extend_class_fn(CustomAuthService);
    LoginAuth = new ExtendedClass(app, configKey);
  } else {
    LoginAuth = new CustomAuthService(app, configKey);
  }


  LoginAuth.register('local', new LocalStrategy());
  LoginAuth.register('jwt', new MyJwtStrategy());
  LoginAuth.register('google', new GoogleStrategy());
  LoginAuth.register('facebook', new FacebookStrategy());
  LoginAuth.register('linkedin', new LinkedinStrategy());

  LoginAuth = extendStrategies(LoginAuth);

  app.use('/loginAuth', LoginAuth);

  app.configure(expressOauth(app));

  app.service('loginAuth').hooks(lmergeWith({
    before: {
      create: [
        context => {
          context.params.rulesJoin = true;
        },
      ],
    },
    after: {
      create: [
        context => {
          const {login} = context.result;

          const loginAuthConfig = context.app.get('loginAuth');
          const defaultWhitelist = ['_id', 'name', 'createdAt', 'updatedAt', 'settings', 'updatedByHistory', 'external', 'nativePermissions', 'deletedAt', 'deleted'];
          let _login;
          let enforceWhitelist = lget(loginAuthConfig, 'enforceWhitelist', true);
          let whitelistLoginFields = lget(loginAuthConfig, 'whitelistLoginFields', []);
          if (enforceWhitelist || whitelistLoginFields.length) _login = lpick(login, whitelistLoginFields.concat(defaultWhitelist));

          let blacklistLoginFields = lget(login, 'blacklistLoginFields', []);
          _login = lomit(_login, blacklistLoginFields);
          lset(context.params, 'configKey', configKey);
          context.dispatch = Object.assign({}, context.result, {login: _login});
          return context;
        },
      ],
    },
    error: {
      create: [],
    },
  }, extend_hooks, hookCustomizer));
};
