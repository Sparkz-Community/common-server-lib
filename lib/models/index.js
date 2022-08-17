const Common = require('./common/common.schemas');
const Core = require('./common/core.schemas');
const instances = require('./instances.model');
const vInstances = require('./v-instances.model');
const domains = require('./domains.model');
const hosts = require('./hosts.model');
const integrations = require('./integrations.model');
const integrationAuths = require('./integration-auths.model');
const environments = require('./environments.model');
const applications = require('./applications.model');
const features = require('./features.model');
const users = require('./users.model');
const devices = require('./devices.model');
const accounts = require('./accounts.model');
const serviceMaps = require('./service-maps.model');

module.exports = {
  Core,
  Common,
  instances,
  vInstances,
  domains,
  hosts,
  environments,
  applications,
  features,
  integrations,
  integrationAuths,
  users,
  devices,
  accounts,
  serviceMaps,
};
