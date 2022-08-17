const {packages:{lodash: {lget}}} = require('@iy4u/common-utils');
const {Forbidden} = require('@feathersjs/errors');

module.exports = async (ctx,application={}) =>{

  // get a list of managers for this application
  const managers = lget(application,'users',[]).filter(({manager})=>manager);
  //current user
  const you = lget(ctx.params,'user._id');
  // let's find you among the current managers for this Application
  let found = false;

  for(let manager of managers) {

    if (JSON.stringify(lget(manager,'_id')) === JSON.stringify(you)) {
      found = true;
      break;
    }

  }
  // We intend to exclude the internal request in the applications create after hook from this authorization check
  const isExternalCall = !!lget(ctx.params,'provider');
  // to allow for creation of apps before user is defined as its manager
  if (isExternalCall&&!found) {
    throw new Forbidden (`You are not authorized to manage ${lget(application,'name')} application`);
  }

  return ctx;
};
