// users-model.js - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.

module.exports = function (app) {
  const mongooseClient = app.get('mongoose');
  const {Schema} = mongooseClient;

  return {
    fingerprints: [{type: Schema.Types.ObjectId, ref: 'fingerprints'}],
    affiliate: {type: Schema.Types.ObjectId, ref: 'affiliates'},
    affiliates: [{type: Schema.Types.ObjectId, ref: 'users'}],
  };

};

