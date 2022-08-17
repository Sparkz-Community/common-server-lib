const {relateOto, removeOto, relateMtm, removeMtm, relateOtm, removeOtm} = require('./relaters');
// const {relateOto, removeOto, relateMtm, removeMtm, relateOtm, removeOtm} = require('./relate-hooks');
const {packages:{lodash: {lget, lmerge}}} = require('@iy4u/common-utils');
// const {GeneralError} = require('@feathersjs/errors');

const actions = (type, path) => {
  const paths = {
    remove: {
      oto: removeOto,
      otm: removeOtm,
      mtm: removeMtm,
    },
    relate: {
      oto: relateOto,
      otm: relateOtm,
      mtm: relateMtm,
    },
  };
  return lget(paths, [type, path]);
};

// eslint-disable-next-line no-unused-vars
const relate = (method, config, err = '') => {
  return (context) => {
    let type = context.method === 'remove' ? 'remove' : 'relate';

    let url = lget(context, 'params.originalOrigin', lget(context, 'params.headers.origin'));
    let coreParams = {
      coreIds: context.params.coreIds,
      core: context.params.core,
      urlConfig: context.params.urlConfig,
      originalOrigin: url,
    };

    // console.log(`running relate-utils relate: ${context.type}-${context.method}-${context.path}`);
    // let result = await actions(type, method.toLowerCase())({addParams: coreParams, ...config})(context)
    //   .catch(error => {
    //     console.log('got an error in relate hook', url);
    //     throw new GeneralError(`Error ${context.type} ${type}${method} - ${context.path}. Message: ${error.message} - ${err}`, {error});
    //   });
    // return result;
    return actions(type, method.toLowerCase())(lmerge({addParams: coreParams}, config))(context);
  };
};

module.exports = {
  relate,
};
