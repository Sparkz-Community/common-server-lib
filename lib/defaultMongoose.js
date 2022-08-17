const connectMongoose = require('./connectMongoose');
const {packages:{lodash: {lget}}} = require('@iy4u/common-utils');

const {generateDefaultInstance} = require('./utils');

module.exports = function (app) {
  const projectInstanceName = lget(generateDefaultInstance(app),'name');
  const mongoConfigName= `${projectInstanceName}MongooseClient`;
  connectMongoose(app, mongoConfigName, app.get('mongo'));
};

