// Initializes the `placesAutoComplete` service on path `/places-auto-complete`
// const { PlacesAutoComplete } = require('./places-auto-complete.class');
const hooks = require('./places-auto-complete.hooks');
const GoogleMapsService = require('feathers-google-maps');


module.exports = function (app) {
  // const options = {
  //   paginate: app.get('paginate')
  // };

  // Initialize our service with any options it requires
  // app.use('/places-auto-complete', new PlacesAutoComplete(options, app));

  // Create a GoogleMapsService places service
  app.use('/places-auto-complete', new GoogleMapsService({
    key: process.env.GOOGLE_API_KEY,
    method: 'placeAutocomplete'
  }));

  // Get our initialized service so that we can register hooks
  const service = app.service('places-auto-complete');

  service.hooks(hooks);
};
