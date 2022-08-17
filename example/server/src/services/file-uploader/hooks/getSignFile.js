const { getServerUrl } = require('../utils/helpers');

/**
   * @function signFile
   * @description return document with sign url
   * @param {*} item
   */
const getSignFile = async function ({ item, fileKeyName, hook }) {
  const uploadsConfig = hook.app.get('uploads');
  const {enums} = uploadsConfig;

  let url;
  const hasFileToSign = ![enums.STORAGE_TYPES['others'], enums.STORAGE_TYPES['local-public']].includes(item.storage);
  if (!hasFileToSign) {
    url = item[fileKeyName];
  } else if (item.storage === enums.STORAGE_TYPES['local-public']) {
    const serverUrl = getServerUrl(hook.app);
    url = `${serverUrl}/uploads/${item.fileId}`;
  } else {
    url = await hook.app.service('get-public-file-url').find({ fileId: item.fileId, storage: item.storage, file: item[fileKeyName] });
  }
  return url;
};

module.exports = getSignFile;
