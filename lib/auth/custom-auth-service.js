const {AuthenticationService, JWTStrategy} = require('@feathersjs/authentication');
const lt = require('long-timeout');

const {packages: {lodash: {lset/*, lget*/}}} = require('@iy4u/common-utils');

class GCustomAuthService extends AuthenticationService {
  // async getPayload(authResult, params) {
  //   // Call original `getPayload` first
  //   let payload = await super.getPayload(authResult, params);
  //
  //   let coreIds = lget(params, 'coreIds');
  //   if (coreIds) {
  //     payload = {
  //       ...payload,
  //       ...coreIds,
  //     };
  //   }
  //
  //   return payload;
  // }

  async parse(req, res, ...names) {
    const strategies = this.getStrategies(...names)
      .filter(current => typeof current.parse === 'function');

    for (const authStrategy of strategies) {
      const value = await authStrategy.parse(req, res);

      if (value !== null) {
        return {[authStrategy.authentication.configKey]: value};
      }
    }

    return null;
  }
}

class CustomJWTStrategy extends JWTStrategy {
  async handleConnection(event, connection, authResult) {
    const isValidLogout = event === 'logout' && connection.authentication && authResult &&
      connection.authentication.accessToken === authResult.accessToken;

    const {accessToken} = authResult || {};

    if (accessToken && event === 'login') {
      const {exp} = await this.authentication.verifyAccessToken(accessToken);
      // The time (in ms) until the token expires
      const duration = (exp * 1000) - Date.now();
      // This may have to be a `logout` event but right now we don't want
      // the whole context object lingering around until the timer is gone
      const timer = lt.setTimeout(() => this.app.emit('disconnect', connection), duration);

      lt.clearTimeout(this.expirationTimers.get(connection));
      this.expirationTimers.set(connection, timer);

      lset(connection, ['authentication', this.authentication.configKey], {
        strategy: this.name,
        accessToken,
      });
    } else if (event === 'disconnect' || isValidLogout) {

      const {entity} = this.configuration;

      delete connection[entity];
      delete connection.authentication;

      lt.clearTimeout(this.expirationTimers.get(connection));
      this.expirationTimers.delete(connection);
    }
  }
}

module.exports = {
  GCustomAuthService,
  CustomJWTStrategy,
};
