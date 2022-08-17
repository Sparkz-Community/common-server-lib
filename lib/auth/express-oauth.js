
const { expressOauth } = require('@feathersjs/authentication-oauth');
const session = require('express-session');
const {packages:{lodash: {lget}}} = require('@iy4u/common-utils');

module.exports = function(app, extendRedisOptions={}){
  if(process.env.NODE_ENV === 'production' || lget(app.get('redis'), 'on', false)) {
    const redisConnect = require('./redis');
    app.configure(redisConnect);
    return expressOauth({
      expressSession: session({
        store: app.get('redisSessionStore'),
        secret: app.get('sessionSecret'),
        resave: false,
        saveUninitialized: true,
        ...extendRedisOptions
      })
    });
  }
  return expressOauth();
};
