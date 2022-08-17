const getFileFromRequest = require('./utils/getFileFromRequest');
const { GeneralError, BadRequest } = require('@feathersjs/errors');

const getMulter = require('./utils/getMulter');

const uploadMiddleware = function (config) {
  const {
    app,
    fileKeyName = 'file',
    mimetypes
  } = config;

  /**
   * Validate config
   * --------------------------------------------------------------------------------
   * When service is setup with a middleware we validate that storage is exists
   * --------------------------------------------------------------------------------
  */
  const multipartMiddleware = getMulter(mimetypes);

  return async function (req, res, next) {
    if (req.method === 'GET') {
      /**
       * GET request
       * --------------------------------------------------------------------------------
       * uploadMiddleware is not relevant when client GET document from DB
       * --------------------------------------------------------------------------------
       */
      return next();
    } else if (req.method === 'DELETE') {
      /*
      *
      * DELETE
      * --------------------------------------------------------------------------------
      * When service get delete request,
      * this middleware will delete the file from the storage
      * before deleting the document from the DB
      * --------------------------------------------------------------------------------
      *
      */
      return next();
    } else {
      /**
     * get File From Request
     * --------------------------------------------------------------------------------
     * This function will add the file inside [req[fileKeyName]] with multer
     * --------------------------------------------------------------------------------
     *
     */
      try {
        await getFileFromRequest(multipartMiddleware, req, res, fileKeyName); // async  multer
      } catch (error) {
        app.debug('src > utils > uploadMiddleware - failed to upload a file ', error);
        if (error.message.includes('Accept')) {
          /**
           * File type is not acceptable
           */
          return next(new BadRequest(error.message));
        } else {
          return next(new GeneralError('upload failed'));
        }
      }
      req.feathers.file = req.file;
      return next();
    }
  };
};

module.exports = uploadMiddleware;
