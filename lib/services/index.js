/* eslint-disable no-unused-vars */
// const authManagement = require('@ionrev/ir-auth-management-server');
const {packages:{lodash: {lget, lunion}}} = require('@iy4u/common-utils');

const instances = require('./instances/instances.service');
const vInstances = require('./v-instances/v-instances.service');
const domains = require('./domains/domains.service');
const hosts = require('./hosts/hosts.service');
const environments = require('./environments/environments.service');
const applications = require('./applications/applications.service');
const features = require('./features/features.service');
const users = require('./users/users.service');
const logins = require('./logins/logins.service');
const integrations = require('./integrations/integrations.service');
const integrationAuths = require('./integration-auths/integration-auths.service');
const devices = require('./devices/devices.service');
const accounts = require('./accounts/accounts.service');
const notifications = require('./notifications/notifications.service');
const announcements = require('./announcements/announcements.service');
const generatePasswords = require('./generate-passwords/generate-passwords.service.js');
const urlParses = require('./url-parses/url-parses.service.js');

const connectMongoose = require('../connectMongoose');

// const userOrApplicationAuthentication = require('../hooks/application-authentication');
// const { Service } = require('feathers-mongoose');

const services = {
  instances,
  vInstances,
  domains,
  hosts,
  environments,
  applications,
  features,
  users,
  logins,
  integrations,
  integrationAuths,
  devices,
  accounts,
  notifications,
  announcements,
  generatePasswords,
  urlParses,
};

// async function generateInstancesServices(app) {
//   const instanceServices = {};
//   const instancesArray = await app.service('instances').find({paginate: false});
//   const defaultServices = Object.keys(app.services);
//
//   instancesArray.forEach((instance) => {
//     const name = String(instance.name);
//     const config = lget(instance.settings, 'instances.mongo');
//     const conn = connectMongoose(app, name, config);
//
//     for (let key of defaultServices) {
//       instanceServices[`${name}/${key}`] = function (app) {
//         const serviceInstance = app.service(key);
//         const serviceOptions = lget(serviceInstance, 'options');
//         const hooks = lget(serviceInstance, 'hooks');
//
//         if (lget(serviceOptions, 'Model')) {
//           const schema =serviceInstance.options.Model.schema;
//           const parentOptions = lget(serviceInstance,'options');
//           // Initialize our service with any options it requires
//           const newOptions = Object.assign({Model: conn.model(key, schema)},{});
//           const options = Object.assign(parentOptions,newOptions);
//
//           const MergedServicePrototype = Object.assign(Service.prototype,Object.getPrototypeOf(serviceInstance));
//           const MergedService = MergedServicePrototype.constructor;
//           app.use(`/${name}/${key}`, new MergedService(options,app));
//
//         }else{
//           // Initialize our service with any options it requires
//           app.use(`/${name}/${key}`, serviceInstance);
//         }
//         // Get our initialized service so that we can register hooks
//         const service = app.service(`${name}/${key}`);
//         service.hooks(hooks);
//         return service;
//       };
//     }
//   });
//   return instanceServices;
// }

function instancesConnections(app) {
  return app.service('instances').find({paginate: false}).then(instancesArray => {
    instancesArray.forEach((instance) => {
      const config = lget(instance, 'settings.instances.mongo');
      const mongoConfigName = `${lget(instance, '_id')}MongooseClient`;
      connectMongoose(app, mongoConfigName, config);
    });
  });
}

module.exports = {
  hooks: {},
  ...services,
  middleware: {},
  configureServices: function (app, remove_service = []) {
    // // exposing header for external requests on all services
    // app.use(function (req, res, next) {
    //   req.feathers.headers = req.headers;
    //   next();
    // });

    remove_service = lunion(remove_service, lget(app.get('common-server-lib'), 'remove_service', []));
    for (const service of Object.keys(services)) {
      if (!remove_service.includes(`${service}`)) app.configure(services[service]);
    }

    instancesConnections(app);

    // // console.log(instancesServices);
    // for (const service of Object.keys(instancesServices)) {
    //   app.configure(instancesServices[service]);
    // }
  },
};
