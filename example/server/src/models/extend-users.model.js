// users-model.js - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.

module.exports = function (app) {
  const mongooseClient = app.get('mongoose');
  const {Schema} = mongooseClient;

  return {
    name: {type: String},
    devices: [{type: Schema.Types.ObjectId, ref: 'devices'}],
  };

};

