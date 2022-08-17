const { authenticate } = require('@feathersjs/authentication').hooks;

const dauria = require('dauria');
const { GeneralError } = require('@feathersjs/errors');
const { disallow } = require('feathers-hooks-common');


module.exports = {
  before: {
    all: [
      authenticate('jwt'),
      disallow('external')
    ],
    find: [],
    get: [],
    create: [
      function (context) {
        const uploads = context.app.get('uploads');
        const {enums} = uploads;

        if (context.data[enums.UPLOAD_PUBLIC_FILE_KEY]) {
          // Make the file public
          if (context.path === 'uploads-s3') {
            context.params.s3 = { ACL: 'public-read' }; // makes uploaded files public
          }
          if (context.path === 'uploads-google') {
            context.params[enums.UPLOAD_PUBLIC_FILE_KEY] = true;
          }
        }
        if (context.path !== 'uploads-google') {
          if (context.data.buffer) {
            const uri = dauria.getBase64DataURI(context.data.buffer.buffer, context.data.buffer.mimetype);
            context.data = {
              uri: uri,
              mimetype: context.data.buffer.mimetype,
              id: context.data.fileId
            };
          } else if (!context.data.uri && !context.params.file) {
            throw new GeneralError('file or uri is required');
          } else if (!context.data.uri && context.params.file) {
            const file = context.params.file;
            const uri = dauria.getBase64DataURI(file.buffer, file.mimetype);
            context.data = {
              uri: uri,
              mimetype: file.mimetype,
              id: context.data.fileId
            };
          }
        }
      }
    ],
    update: [],
    patch: [],
    remove: []
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
};
