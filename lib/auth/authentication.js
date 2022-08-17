// const {JWTStrategy} = require('@feathersjs/authentication');
const {LocalStrategy} = require('@feathersjs/authentication-local');
const {packages: {lodash: {lget, lset, lomit, lpick, lmergeWith}}} = require('@iy4u/common-utils');
const {callingParamsDefaults} = require('feathers-hooks-common');
const {extensionUtils: {hookCustomizer}} = require('@iy4u/common-utils');
const {NotAuthenticated} = require('@feathersjs/errors');
const expressOauth = require('./express-oauth');
const {
  GoogleStrategy,
  FacebookStrategy,
  LinkedinStrategy,
} = require('./oauth-strategies');
const {GCustomAuthService, CustomJWTStrategy} = require('./custom-auth-service');

callingParamsDefaults(['provider', 'authenticated', 'user', 'configKey'], {_calledByHook: true});

class CustomAuthService extends GCustomAuthService {
  async getPayload(authResult, params) {
    // Call original `getPayload` first
    let payload = await super.getPayload(authResult, params);

    let coreIds = lget(params, 'coreIds');
    if (coreIds) {
      payload = {
        ...payload,
        ...lpick(coreIds, ['inst', 'vinst', 'dn']),
      };
    }

    return payload;
  }
}

class MyJwtStrategy extends CustomJWTStrategy {
  async getEntity(id, params) {
    params.rulesJoin = true;
    params.usersResolversQuery = {
      logins: [undefined, {
        loginsResolversQuery: {
          accounts: true,
        },
      }],
    };
    return super.getEntity(id, params);
  }
}


module.exports = (app, {
  extend_hooks = {},
  extend_class_fn = (superClass) => superClass,
  extendStrategies = (Authentication) => Authentication,
} = {}) => {
  const configKey = 'authentication';
  let Authentication;

  if (typeof extend_class_fn === 'function') {
    const ExtendedClass = extend_class_fn(CustomAuthService);
    Authentication = new ExtendedClass(app, configKey);
  } else {
    Authentication = new CustomAuthService(app, configKey);
  }

  Authentication.register('local', new LocalStrategy());
  Authentication.register('jwt', new MyJwtStrategy());
  Authentication.register('google', new GoogleStrategy());
  Authentication.register('facebook', new FacebookStrategy());
  Authentication.register('linkedin', new LinkedinStrategy());

  Authentication = extendStrategies(Authentication);

  app.use('/authentication', Authentication);

  app.set('trust proxy', 1);

  app.configure(expressOauth(app, {
    // cookie: {
    //   secure: false, // if true only transmit cookie over https
    //   httpOnly: false, // if true prevent client side JS from reading the cookie
    //   maxAge: 1000 * 60 * 10 // session max age in miliseconds
    // }
  }));

  app.service('authentication').hooks(lmergeWith({
    before: {
      create: [
        context => {
          context.params.rulesJoin = true;
          context.params.usersResolversQuery = {
            logins: [undefined, {
              loginsResolversQuery: {
                accounts: true,
              },
            }],
          };
        },
      ],
    },
    after: {
      create: [
        // afterHook,
        context => {
          const {user} = context.result;
          const authenticationConfig = context.app.get('authentication');
          if (!user.isVerified && lget(authenticationConfig, 'verification', true)) {
            throw new NotAuthenticated('User Account is not yet verified.');
          }
          const defaultWhitelist = ['_id', 'createdAt', 'updatedAt'];
          let _user;
          let enforceWhitelist = lget(authenticationConfig, 'enforceWhitelist', true);
          let whitelistUserFields = lget(authenticationConfig, 'whitelistUserFields', []);
          if (enforceWhitelist || whitelistUserFields.length) _user = lpick(user, whitelistUserFields.concat(defaultWhitelist));

          let blacklistUserFields = lget(authenticationConfig, 'blacklistUserFields', []);
          _user = lomit(_user, blacklistUserFields);
          lset(context.params, 'configKey', configKey);
          context.dispatch = Object.assign({}, context.result, {user: _user});
          return context;
        },
      ],
    },
    error: {
      create: [],
    },
  }, extend_hooks, hookCustomizer));
};
