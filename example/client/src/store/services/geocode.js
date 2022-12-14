import feathersClient, {makeServicePlugin, BaseModel} from '../../api/feathers-client';

class Geocode extends BaseModel {
  constructor(data, options) {
    super(data, options);
  }

  // Required for $FeathersVuex plugin to work after production transpile.
  static modelName = 'geocode';

  // Define default properties here
  static instanceDefaults() {
    return {
      input: ''
    };
  }
}

const servicePath = 'geocode';
const servicePlugin = makeServicePlugin({
  Model: Geocode,
  service: feathersClient.service(servicePath),
  servicePath,
  idField: 'place_id',
});

const requestHook = context => {
  // On success, context.params.googleMaps will include a `response`
  // eslint-disable-next-line no-console
  console.log('requestHook: ', context);
};
const successfullResponseHook = context => {
  // On success, context.params.googleMaps will include a `response`
  // eslint-disable-next-line no-console
  console.log('successfullResponseHook: ', context);
};

// Setup the client-side Feathers hooks.
feathersClient.service(servicePath).hooks({
  before: {
    all: [],
    find: [requestHook],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },
  after: {
    all: [],
    find: [successfullResponseHook],
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
