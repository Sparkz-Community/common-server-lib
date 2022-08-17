const {packages:{lodash: {lget, lset, lcloneDeep, lunion}}} = require('@iy4u/common-utils');

const orderDefault = ['instances', 'v-instances', 'applications', 'domains', 'environments', 'hosts'];
const { assembleCore, singlePath } = require('./core-context');

const { findJoin } = require('./fast-join');


const mergeArray = (oldVal, newVal, keyById) => {
  let isObjectArray = typeof lget(newVal, [0], 1) === 'object';
  if (isObjectArray) {
    let newArr = [];
    newVal.forEach(val => {
      if (lget(val, keyById)) newArr.push(val);
    });
    oldVal.forEach(val => {
      if (lget(val, keyById) && !newArr.map(a => a[keyById]).includes(val[keyById])) {
        newArr.push(val);
      }
    });
    if (lget(newArr, [0])) return newArr;
    else return lunion(oldVal, newVal);
  } else return lunion(oldVal, newVal);
};

const recursiveMerge = (oldVal = {}, newVal = {}) => {
  if (oldVal && newVal) {
    // let f = lcloneDeep(oldVal);
    // let i = lcloneDeep(newVal);
    //
    let newSettings = {};
    let keys = Object.keys(newVal).filter(a => a !== 'mergeSettings') || [];

    let settings = lget(newVal, 'mergeSettings');

    keys.forEach(key => {
      let ov = oldVal[key];
      let nv = newVal[key];
      if (ov && nv) {
        let behavior = lget(settings, [key, 'behavior'], lget(settings, 'default.behavior', 'merge'));
        let ovType = typeof ov;
        if (ovType === 'object' && behavior === 'merge') {
          if (Array.isArray(ov)) {
            newSettings[key] = mergeArray(ov, nv, lget(settings, [key, 'keyById'], lget(settings, 'default.keyById', '_id')));
          } else newSettings[key] = recursiveMerge(ov, nv);
        } else {
          let val = nv ? nv : ov;
          newSettings[key] = val;
        }
      } else if (nv) newSettings[key] = nv;
      else newSettings[key] = ov;
    });


  } else if (newVal) return newVal;
  else return oldVal;
};

const mergeSettings = (
  {
    order = orderDefault,
    coreRecord,
    service
  } = {}) => {
  let core = assembleCore(coreRecord, service);
  let settings = {};
  order.filter(a => Object.keys(core).includes(singlePath(a))).forEach((key, i) => {
    let newVal = lcloneDeep(lget(core, [key, 'settings'], {}));
    if(i === 0) settings = newVal;
    else settings = recursiveMerge(settings, newVal);
  });
  return settings;
};

const joinRoutes = async (
  context,
  settings = {
    joinPath: 'routesList',
    service: 'routes',
    herePath: '_fastjoin.settings.routes.routeIds'
  }) => {
  if (lget(context, 'params.$core.joinRoutes')) {
    return findJoin(settings)(context);
  } else return context;
};

const joinSettings = (
  {
    servicePath
  } = {}
) => {
  return context => {

    let service = servicePath ? servicePath : context.path;
    const joinFn = coreRecord => {
      lset(coreRecord, '_fastjoin.coreSettings', mergeSettings({ coreRecord, service }));
      return coreRecord;
    };

    if(context.method === 'find'){
      context.result.data = lget(context.result, 'data', []).map(a => joinFn(a));
    } else {
      context.result = joinFn(context.result);
    }
    return context;
  };
};

module.exports = {
  mergeSettings,
  joinRoutes,
  joinSettings
};
