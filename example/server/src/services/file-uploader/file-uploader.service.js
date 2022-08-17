// Initializes the `fileUploader` service on path `/file-uploader`
const { FileUploader } = require('./file-uploader.class');
const createModel = require('../../models/file-uploader.model');
const hooks = require('./file-uploader.hooks');
const uploadMiddleware = require('../../middleware/upload');

const {
  utils: {generateDefaultInstance},
} = require('@iy4u/common-server-lib');
const {packages: {lodash: {lget}}} = require('@iy4u/common-utils');

module.exports = function (app) {
  const projectInstanceName = lget(generateDefaultInstance(app), 'name');
  const mongoConfigName = `${projectInstanceName}MongooseClient`;
  const connection = app.get(mongoConfigName);

  const options = {
    Model: createModel(app, {connection}),
    paginate: app.get('paginate'),
  };

  // Initialize our service with any options it requires
  app.use('/file-uploader',
    uploadMiddleware({
      app,
      fileKeyName: 'file',
      mimetypes: null // optional - array of mimetypes to allow
    }),
    new FileUploader(options, app)
  );

  // Get our initialized service so that we can register hooks
  const service = app.service('file-uploader');

  service.hooks(hooks);
};
