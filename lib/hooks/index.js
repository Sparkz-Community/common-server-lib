const createdBy = require('./created-by');
const updatedBy = require('./updated-by');
const getPermissionEntity = require('./get-permission-entity');
const restQueryUnstringify = require('./rest-query-unstringify');
const removeFastjoin = require('./remove-fastjoin');
const protector = require('./protector');
const aggregateHook = require('./aggregateHook');
const sanitizeHtml = require('./sanitizeHtml');
const relaters = require('./relaters');
const checkContext = require('./checkContext');
const joinHooks = require('./fast-join');
const coreAuthentication = require('./core-authentication');
const {handlePermissions} = require('./native-permissions');
const coreContext =  require('./core-context');
const { relate } = require('./relate-utils');
const switchModel = require('./switch-model');
const setWhitelistService = require('./setWhitelistService');

module.exports = {
  createdBy,
  updatedBy,
  getPermissionEntity,
  relate,
  restQueryUnstringify,
  removeFastjoin,
  protector,
  aggregateHook,
  sanitizeHtml,
  relaters,
  checkContext,
  joinHooks,
  coreAuthentication,
  switchModel,
  setWhitelistService,
  handlePermissions,
  ...coreContext
};
