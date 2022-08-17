// const {authenticate} = require('@feathersjs/authentication').hooks;

// const successHook = context => {
//   // On success, context.params.googleMaps will include a `response`
//   console.log('Success: ', context.data, context.params.googleMaps);
// };
const successHook = context => {
  context.result.data = context.result.results;
  context.result.total = 0;
  context.result.limit = 400;
  context.result.skip = 0;
  // logger.log({
  //   level: 'info',
  //   message: 'context.result.data: ' + context.result.data,
  //   msg: function (req, res) {
  //     return `${res.statusCode} - ${req.method}`;
  //   }
  // });
  // logger.log({
  //   level: 'info',
  //   message: 'context.params.googleMaps: ' + context.params.googleMaps
  // });
  // logger.log({
  //   level: 'info',
  //   message: 'context.result.predictions: ' + context.result.predictions
  // });
};

// eslint-disable-next-line no-unused-vars
const preAPIHook = context => {
  // logger.log({
  //   level: 'info',
  //   message: context.params.query + ' ' + context.params.query.input
  // });
  console.log('context:',context);
};


const errorHook = context => {
  // On error, context.params.googleMaps will include an `error`
  console.log('Error: ', context.error, context.params.googleMaps);
};

module.exports = {
  before: {
    all: [],
    find: [
      preAPIHook
    ],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  after: {
    all: [],
    find: [
      preAPIHook,
      successHook
    ],
    get: [],
    create: [successHook],
    update: [],
    patch: [],
    remove: []
  },

  error: {
    all: [],
    find: [errorHook],
    get: [],
    create: [errorHook],
    update: [],
    patch: [],
    remove: []
  }
};
