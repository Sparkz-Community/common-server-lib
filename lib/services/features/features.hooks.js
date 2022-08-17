
const { relate } = require('../../hooks/relate-utils');
const coreAuthentication = require('../../hooks/core-authentication');

const relateApplicationConfig = {
  paramsName: 'relateApplicationsConfig',
  herePath: 'applications',
  thereService: 'applications',
  therePath: 'features',
};

// subFeatures
const relateParentConfig = {
  paramsName: 'relateParentConfig',
  herePath: 'parent',
  thereService: 'features',
  therePath: 'children',
};

module.exports = {
  before: {
    all: [
      coreAuthentication({
        required: [
          {service: 'authentication', strategies: ['jwt']},
          // {service: 'integrationAuth', strategies: ['jwt']},
        ],
        optional: [
          // {service: 'authentication', strategies: ['jwt']},
          {service: 'integrationAuth', strategies: ['jwt']},
        ],
      }),
    ],
    find: [],
    get: [],
    create: [
      relate('mtm', relateApplicationConfig),
      relate('otm', relateParentConfig)
    ],
    update: [
      relate('mtm', relateApplicationConfig),
      relate('otm', relateParentConfig)
    ],
    patch: [
      relate('mtm', relateApplicationConfig),
      relate('otm', relateParentConfig)
    ],
    remove: [
      relate('mtm', relateApplicationConfig),
      relate('otm', relateParentConfig)
    ]
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [
      relate('mtm', relateApplicationConfig),
      relate('otm', relateParentConfig)
    ],
    update: [
      relate('mtm', relateApplicationConfig),
      relate('otm', relateParentConfig)
    ],
    patch: [
      relate('mtm', relateApplicationConfig),
      relate('otm', relateParentConfig)
    ],
    remove: [
      relate('mtm', relateApplicationConfig),
      relate('otm', relateParentConfig)
    ]
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
