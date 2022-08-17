const { relate } = require('@iy4u/common-server-lib').hooks;

const userRelate = {
  herePath: 'user',
  therePath: 'devices',
  thereService: 'users',
  paramsName: 'userRelate'
};

module.exports = {
  before: {
    all: [],
    find: [],
    get: [],
    create: [relate('otm', userRelate)],
    update: [relate('otm', userRelate)],
    patch: [relate('otm', userRelate)],
    remove: [relate('otm', userRelate)]
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [relate('otm', userRelate)],
    update: [relate('otm', userRelate)],
    patch: [relate('otm', userRelate)],
    remove: [relate('otm', userRelate)]
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
