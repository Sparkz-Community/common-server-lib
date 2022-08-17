const {packages: {lodash: {lget}}} = require('@iy4u/common-utils');
const {relate} = require('@iy4u/common-server-lib').hooks;

const deviceRelate = {
  herePath: 'device',
  therePath: 'fingerprints',
  thereService: 'devices',
  paramsName: 'deviceRelate',
};

const addDevice = async context => {
  if (!context.data.device) {
    let deviceData = {
      fingerprints: [context.result._id],
      affiliate: context.result.affiliate,
      user: lget(context.params, 'user._id'),
      users: [lget(context.params, 'user._id')],
    };
    let device = await context.app.service('devices').create(deviceData, context.params);
    // context.data.device = device._id;
    context.result = await context.app.service('fingerprints').patch(context.result._id, {device: device._id}, context.params);
    console.log(device);
  }
  return context;
};


module.exports = {
  before: {
    all: [],
    find: [],
    get: [],
    create: [relate('otm', deviceRelate)],
    update: [relate('otm', deviceRelate)],
    patch: [relate('otm', deviceRelate)],
    remove: [relate('otm', deviceRelate)],
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [relate('otm', deviceRelate), addDevice],
    update: [relate('otm', deviceRelate)],
    patch: [relate('otm', deviceRelate)],
    remove: [relate('otm', deviceRelate)],
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: [],
  },
};
