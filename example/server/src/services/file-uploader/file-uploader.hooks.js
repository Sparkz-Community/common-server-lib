const {authenticate} = require('@feathersjs/authentication').hooks;
// const uploadsHooks = require('./hooks/uploadsHooks');
const { v4: uuidv4 } = require('uuid');
const {GeneralError} = require('@feathersjs/errors');

const getFileUrl = require('./utils/getFileUrl');

const {packages: {lodash: {lget}}} = require('@iy4u/common-utils');


// const uploadHookConfig = {
//   fileKeyName: 'file',
//   userKeyName: 'user',
//   publicRead: true,
//   singUrlKeyName: 'file'
// };

const handleUpload = async context => {
  const uploadsConfig = context.app.get('uploads');
  const {enums} = uploadsConfig;

  const storageService = context.data['storage'] || enums.STORAGE_TYPES[uploadsConfig.defaultFileService];
  const uploadServiceName = enums.UPLOAD_SERVICES[storageService];
  const publicRead = true;

  let fileKeyName = 'file';
  let uploadService = context.app.service(uploadServiceName);


  try {
    const isFile = context.params.file && typeof context.params.file === 'object';
    const isUrlLink = !isFile && context.data[fileKeyName] && typeof context.data[fileKeyName] === 'string';

    if (isFile) {
      /**
       * Get file info
       */
      const originalName = lget(context, 'params.file.originalname', '');
      const fileId = uuidv4() + '--' + originalName;

      /**
       * Upload the file to storage
       */
      const upload = await uploadService.create({
        fileId,
        buffer: context.params.file,
        [enums.UPLOAD_PUBLIC_FILE_KEY]: publicRead
      });

      /**
       * uploadService return the file id in the storage
       */
      if (upload && upload.id) {
        /**
         * get File Url
         * --------------------------------------------------------------------------------
         * get file url will return link to the file in the storage, for example:
         * `${serverUrl}:${app.get('port')}`;
         * `https://s3.amazonaws.com/${app.get('s3').bucket}/${fileId}`;
         * --------------------------------------------------------------------------------
         */
        const fileUrl = getFileUrl({app: context.app, fileId: upload.id, storageService});

        /**
         * Request data
         * --------------------------------------------------------------------------------
         * Add to request data info about the file , this info will be saved on the document in DB
         * --------------------------------------------------------------------------------
         * */
        context.data[fileKeyName] = fileUrl;
        if (!context.data.storage) context.data.storage = storageService;
        context.data.fileId = upload.id;
        context.data.originalName = originalName;
        if (typeof context.data.info === 'string') context.data.info = JSON.parse(context.data.info);
      } else {
        throw new Error('src/utils/uploadMiddleware/utils/handleUpload.js failed to upload a file');
      }
    } else if (isUrlLink) {
      /**
       * When request include a file that is a string (this is link to a file and not a real file)
       * then we add to request data storage equal to others
       */
      context.data.storage = enums.STORAGE_TYPES.others;
    }
  } catch (error) {
    context.app.error('src/utils/uploadMiddleware/utils/handleUpload.js', error);
    throw error;
  }
};

const handleDelete = async context => {
  const uploadsConfig = context.app.get('uploads');
  const {enums} = uploadsConfig;

  try {
    /**
     * Find document data
     */
    const docId = context.id;
    const currentDoc = await context.app.service('file-uploader').get(docId);
    if (currentDoc && currentDoc.storage !== enums.STORAGE_TYPES.others) {
      const storageService = lget(currentDoc, 'storage', enums.STORAGE_TYPES[uploadsConfig.defaultFileService]);
      const uploadServiceName = enums.UPLOAD_SERVICES[storageService];
      let uploadService = context.app.service(uploadServiceName);

      /**
       * Remove file from storage
       */
      await uploadService.remove(currentDoc.fileId);
    }
  } catch (error) {
    // context.error(`try to remove ${context.id} from storage failed, method: ` + context.method);
    if (uploadsConfig.blockDeleteDocumentWhenDeleteFileFailed) {
      throw new GeneralError('Delete file failed');
    }
    context.error = new Error(`try to remove ${context.id} from storage failed, method: ${context.method}, Error: ${error}`);
  }
};

// const beforeHook = context => {
//   console.log('beforeHook - context.path:', context.path);
//   console.log('beforeHook - context.method:', context.method);
//   console.log('beforeHook - context.data:', context.data);
//   console.log('beforeHook - context.params:', context.params);
// };

// const afterHook = context => {
//   console.log('afterHook - context:', context);
// };

// const errorHook = context => {
//   console.log('errorHook - Error: ', context.error);
// };

module.exports = {
  before: {
    all: [
      authenticate('jwt', 'api-key'),
      // beforeHook,
      // uploadsHooks(uploadHookConfig),
    ],
    find: [],
    get: [],
    create: [
      handleUpload,
    ],
    update: [
      handleDelete,
      handleUpload,
    ],
    patch: [
      handleDelete,
      handleUpload,
    ],
    remove: [
      handleDelete,
    ]
  },

  after: {
    all: [
      // afterHook,
      // uploadsHooks(uploadHookConfig)
    ],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  error: {
    all: [
      // errorHook
    ],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
};
