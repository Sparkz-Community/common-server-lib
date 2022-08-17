/* ====================================================================================================================
*** NOTE ***
This file is not used by this library and is only included here for convenience in working with Feathers/cli generator
* Do not edit or use this file for anything production as it will not be packaged in the npm package.
==================================================================================================================== */
const mongoose = require('mongoose');
const {logger} = require('@iy4u/common-utils');

module.exports = function (app) {
  mongoose.connect(
    app.get('mongodb'),
    { useCreateIndex: true, useNewUrlParser: true }
  ).catch(err => {
    logger.error(err);
    process.exit(1);
  });

  app.set('mongooseClient', mongoose);
};
