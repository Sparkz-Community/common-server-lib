// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
const {NotAuthenticated} = require('@feathersjs/errors');
const {packages:{lodash: {lget, lset, lomit, lflattenDeep}}} = require('@iy4u/common-utils');

// eslint-disable-next-line no-unused-vars
const coreAuthentication = (
  {
    authConfigKeys = ['authentication', 'integrationAuth', 'loginAuth', 'fingerprintAuth'],
    required = [],
    optional = [],
  }) => {
  const requiredSettings = typeof required === 'string' ? [{
    service: 'authentication',
    strategies: lflattenDeep([required]),
  }] : required;
  const optionalSettings = typeof optional === 'string' ? [{
    service: 'authentication',
    strategies: lflattenDeep([optional]),
  }] : optional;
  const allSettings = [...requiredSettings, ...optionalSettings];

  if (!allSettings.length || allSettings.some(setting => setting.strategies.length === 0)) {
    throw new Error('The coreAuthentication hook needs at least one allowed strategy for each authentication');
  }

  return async (context) => {
    const {provider, authentication} = context.params;

    if (context.type && context.type !== 'before') {
      throw new NotAuthenticated('The coreAuthentication hook must be used as a before hook');
    }

    if (context.params.authenticated === true) {
      return context;
    }

    for (let authConfigKey of authConfigKeys) {
      const authenticationConfig = context.app.get(authConfigKey);
      const authService = context.app.service(authConfigKey);

      if (allSettings.some(setting => setting.service === authConfigKey)) {
        if (context.service === authService) {
          throw new NotAuthenticated(`'The coreAuthentication hook does not need to be used on the ${lget(authenticationConfig, 'service')} authentication service'`);
        }

        if (!authService || typeof authService.authenticate !== 'function') {
          throw new NotAuthenticated(`Could not find a valid ${lget(authenticationConfig, 'service')} authentication service`);
        }

        const requiredAuthSetting = requiredSettings.find(settings => settings.service === authConfigKey);
        const optionalAuthSetting = optionalSettings.find(settings => settings.service === authConfigKey);
        const auth = lget(authentication, [authConfigKey]);

        if (auth) {
          const {strategies} = requiredAuthSetting || optionalAuthSetting;
          const authParams = lomit(context.params, 'provider', 'authentication');

          try {
            const authResult = await authService.authenticate(auth, authParams, ...strategies);
            context.params = Object.assign({}, context.params, lomit(authResult, 'accessToken', 'authentication'), {authenticated: true});
            lset(context, `params.authentication.${authConfigKey}`, {
              ...lget(context, `params.authentication.${authConfigKey}`, {}),
              ...lget(authResult, 'authentication', {}),
            });
          } catch (e) {
            if (!optionalAuthSetting) {
              throw e;
            }
          }
        } else if (provider && !optionalAuthSetting) {
          throw new NotAuthenticated('Not authenticated');
        }
      }
    }
    return context;
  };
};

// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

// eslint-disable-next-line no-unused-vars
module.exports = coreAuthentication;
