
const batch = require('./batch/batch.service.js');

const IrRolesServer = require('@ionrev/ir-roles-server');
const extendIrRolesRoles = require('./extend-ir-roles-roles/extend-ir-roles-roles.service.js');
const extendIrRolesAbilities = require('./extend-ir-roles-abilities/extend-ir-roles-abilities.service.js');
const geocode = require('./geocode/geocode.service.js');

const placesAutoComplete = require('./places-auto-complete/places-auto-complete.service.js');
const servicesExpose = require('./services-expose/services-expose.service.js');
const extendIrRolesRules = require('./extend-ir-roles-rules/extend-ir-roles-rules.service.js');
const fileUploader = require('./file-uploader/file-uploader.service.js');
const uploads = require('./uploads/uploads.service.js');
const wallets = require('./wallets/wallets.service.js');


const feathersFingerprints = require('@iy4u/feathers-fingerprint');

const extendFingerprints = require('./extend-fingerprints/extend-fingerprints.service');


const authManagement = require('@ionrev/ir-auth-management-server');
const commonServerLib = require('@iy4u/common-server-lib');
const extendUsers = require('./extend-users/extend-users.service.js');

// eslint-disable-next-line no-unused-vars
module.exports = function (app) {
  app.configure(batch);
  app.configure(extendIrRolesRoles);
  app.configure(extendIrRolesAbilities);

  app.configure(geocode);
  app.configure(placesAutoComplete);
  app.configure(fileUploader);
  app.configure(uploads);
  app.configure(servicesExpose);
  app.configure(extendIrRolesRules);
  app.configure(wallets);

  authManagement.services.configureServices(app);
  IrRolesServer.services.configureServices(app);

  authManagement.services.configureServices(app);

  app.configure(extendUsers);
  app.configure(extendFingerprints);
  commonServerLib.services.configureServices(app, ['users', 'features']);
  feathersFingerprints.services.configureServices(app,['fingerprints']);
};
