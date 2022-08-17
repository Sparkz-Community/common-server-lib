const path = require('path');
const favicon = require('serve-favicon');
const compress = require('compression');
const helmet = require('helmet');
const cors = require('cors');
const {
  defaultMongoose,
  utils,
  auth: {
    authentication,
    integrationAuth,
  },
} = require('@iy4u/common-server-lib');

const {
  auth: {
    fingerprintAuth,
  },
  middleware: {
    feathersIp,
    feathersIpSocketIO
  }
} = require('@iy4u/feathers-fingerprint');

const logger = utils.logger;
logger.level = process.env.NODE_ENV === 'production' ? 'info' : 'debug';

const feathers = require('@feathersjs/feathers');
const configuration = require('@feathersjs/configuration');
const express = require('@feathersjs/express');
const socketio = require('@feathersjs/socketio');
const socketioMiddleware = require('@feathersjs/socketio/lib/middleware');

const middleware = require('./middleware');
const services = require('./services');
const appHooks = require('./app.hooks');
const appAfterHooks = require('./app.after.hooks');
const channels = require('./channels');

const app = express(feathers());

// Load app configuration
app.configure(configuration());
// Configure APM insights via - site24x7.com
if (process.env.NODE_ENV === 'production' && app.get('apminsight').licenseKey) require('apminsight')({...app.get('apminsight')});

// Enable security, CORS, compression, favicon and body parsing
app.use(helmet());
app.use(cors());
app.use(compress());
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(favicon(path.join(app.get('public'), 'favicon.ico')));
// Host the public folder
app.use('/', express.static(app.get('public')));

// Set up Plugins and providers
app.configure(express.rest());
// Add following line to expose ip to params for rest:
app.use(feathersIp('ip'));
// Add following line to expose ip to params for rest:
app.configure(socketio(function (io) {
  io.sockets.setMaxListeners(1512);
  io.use(function (socket, next) {
    // Exposing a request property to services and hooks
    socket.feathers.ip = socket.request.connection.remoteAddress;
    next();
  });
  const getParams = socket => socket.feathers;
  io.use(socketioMiddleware.authentication(app, getParams, {service: 'integrationAuth'}));
  feathersIpSocketIO(io, 'ip');
}));


app.configure(defaultMongoose);

// Configure other middleware (see `middleware/index.js`)
app.configure(middleware);
app.configure(authentication);
app.use(express.parseAuthentication({service: 'integrationAuth'}));
app.configure(integrationAuth);
app.configure( fingerprintAuth);
// Set up our services (see `services/index.js`)
app.configure(services);
// Set up event channels (see channels.js)
app.configure(channels);

// Configure a middleware for 404s and the error handler
app.use(express.notFound());
app.use(express.errorHandler({logger}));

app.hooks(appHooks);
app.configure(appAfterHooks);

module.exports = app;
