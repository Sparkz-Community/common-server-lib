const middleware = require('./middleware');
const services = require('./services');
const hooks = require('./hooks');
const auth = require('./auth');
const utils = require('./utils');
const models = require('./models');
const packages = require('./packages');
const connectMongoose = require('./connectMongoose');
const defaultMongoose = require('./defaultMongoose');
const createProxyService = require('./createProxyService');


module.exports = {
  middleware,
  hooks,
  services,
  auth,
  utils,
  models,
  packages,
  connectMongoose,
  defaultMongoose,
  createProxyService,
};
