const {relateMtm, removeMtm} = require('./many-to-many');

const {relateOtm, removeOtm} = require('./one-to-many');

const {relateOto, removeOto} = require('./one-to-one');

module.exports = {
  relateMtm,
  removeMtm,
  relateOtm,
  removeOtm,
  relateOto,
  removeOto,
};

