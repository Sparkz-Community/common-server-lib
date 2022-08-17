const { GeneralError } = require('@feathersjs/errors');

/**
 * @function getFileUrl
 * Build full url by the storage type,
 * when the storage is local we use get-file without serverUrl, in this way we can support the DB even if server url is changed
 * @param {object} payload
 * @param {object} payload.app
 * @param {string} payload.storageService // storageService name, oneOf: ['local-private','local-public','s3','google-cloud']
 * @param {string} payload.fileId // file id in storage service
 */
const getFileUrl = function (payload) {
  try {
    const {
      app,
      storageService,
      fileId
    } = payload;
    const uploadsConfig = app.get('uploads');
    const {enums} = uploadsConfig;


    let fileUrl;
    if (storageService === enums.STORAGE_TYPES['local-private']) {
      fileUrl = `${uploadsConfig.privateFolder}/uploads/${fileId}`;
    }
    if (storageService === enums.STORAGE_TYPES['local-public']) {
      let serverUrl = app.get('host') || app.get('serverUrl');
      if (!serverUrl) throw new Error('missing serverUrl is appConfig');
      if (serverUrl === 'localhost') {
        serverUrl = `http://${serverUrl}:${app.get('port')}`;
      }
      fileUrl = `${serverUrl}/uploads/${fileId}`;
    }
    if (storageService === enums.STORAGE_TYPES.s3) {
      fileUrl = `https://${app.get('s3').bucket}.s3.amazonaws.com/${fileId}`;
    }
    if (storageService === enums.STORAGE_TYPES['google-cloud'] || storageService === 'google-storage') { // google-storage only in version before 1.5.0
      fileUrl = `https://storage.googleapis.com/${app.get('google-cloud').bucket}/${fileId}`;
    }
    return fileUrl;
  } catch (error) {
    payload.app.error('src/services/file-uploader/utils/getFileUrl.js', error);
    throw new GeneralError();
  }
};

module.exports = getFileUrl;
