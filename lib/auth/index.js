const customAuthService = require('./custom-auth-service');
const authentication = require('./authentication');
const expressOauth = require('./express-oauth');
const oauthStrategies = require('./oauth-strategies');
const integrationAuth = require('./integrationAuth');

module.exports = {
  customAuthService,
  authentication,
  expressOauth,
  oauthStrategies,
  integrationAuth
};
