import feathersClient, {makeServicePlugin, BaseModel} from '../../api/feathers-client';

class Integrations extends BaseModel {
  constructor(data, options) {
    super(data, options);
  }

  // Required for $FeathersVuex plugin to work after production transpile.
  static modelName = 'Integrations';

  // Define default properties here
  static instanceDefaults() {
    return {
      name: undefined,
      oneTimeSecretKey:undefined
    };
  }
}

const servicePath = 'integrations';
const servicePlugin = makeServicePlugin({
  Model: Integrations,
  service: feathersClient.service(servicePath),
  servicePath,
  state: {},
  getters: {},
  mutations: {},
  actions: {},
  debug: ['development', 'staging'].includes(process.env.NODE_ENV)});

// Setup the client-side Feathers hooks.
feathersClient.service(servicePath).hooks({
  before: {
    all: [],
    find: [],
    get: [],
    create: [],
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
});

export default servicePlugin;
