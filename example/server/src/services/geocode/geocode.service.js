// Initializes the `geocode` service on path `/geocode`
// const { Geocode } = require('./geocode.class');
const hooks = require('./geocode.hooks');
const GoogleMapsService = require('feathers-google-maps');

module.exports = function (app) {
  // const options = {
  //   paginate: app.get('paginate')
  // };

  // Initialize our service with any options it requires
  // app.use('/geocode', new Geocode(options, app));

  // Create a GoogleMapsService geocode service
  app.use('/geocode', new GoogleMapsService({
    key: process.env.GOOGLE_API_KEY,
    method: 'geocode'
  }));

  // Get our initialized service so that we can register hooks
  const service = app.service('geocode');

  // Swagger docs
  // if (app.docs && app.docs.paths['/geocode']) {
  //   app.docs.paths['/geocode'].get.description = 'Geolocate address';
  //   app.docs.paths['/geocode'].get.parameters['place_id'] = 'ChIJWQ63cdp_TYcRFbbxICErrHg';
  // }


  service.hooks(hooks);
};
