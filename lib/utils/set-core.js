const {packages:{lodash: {lget, lset}}} = require('@iy4u/common-utils');

const generateDefaultInstance = (app, options = {}) => {
  let defaultName = lget(app.get('instances'), 'name', 'default');
  return {name: defaultName, settings: {instances: {mongo: app.get('mongo')}}, ...options};
};

const defaultCoreCall = (context, service) => {
  const switchModel = require('../hooks/switch-model');

  let getCoreParams = async () => {
    const defaultInstance = generateDefaultInstance(context.app);
    let defaultModel = await switchModel({setParamsMode: false, service, instance: defaultInstance})(context);

    return {
      urlConfig: lget(context, 'params.urlConfig'),
      originalOrigin: lget(context, 'params.originalOrigin', lget(context, 'params.headers.origin')),
      core: {
        instance: defaultInstance,
      },
      adapter: {
        Model: defaultModel,
      },
    };
  };

  const callService = context.app.service(service);

  return {
    async get(id, params) {
      const coreParams = await getCoreParams();
      return callService.get(id, {...coreParams, ...params});
    },
    async find(params) {
      const coreParams = await getCoreParams();
      return callService.find({...coreParams, ...params});
    },
    async create(data, params) {
      const coreParams = await getCoreParams();
      return callService.create(data, {...coreParams, ...params});
    },
    async update(id, data, params) {
      const coreParams = await getCoreParams();
      return callService.update(id, data, {...coreParams, ...params});
    },
    async patch(id, data, params) {
      const coreParams = await getCoreParams();
      return callService.patch(id, data, {...coreParams, ...params});
    },
    async remove(id, params) {
      const coreParams = await getCoreParams();
      return callService.remove(id, {...coreParams, ...params});
    },
  };
};

const coreMethods = ({context, service, method, params = {}, id, data}) => {

  let url = lget(context, 'params.originalOrigin', lget(context, 'params.headers.origin'));
  let coreParams = {
    coreIds: context.params.coreIds,
    core: context.params.core,
    coreContext: context.params.coreContext,
    urlConfig: context.params.urlConfig,
    originalOrigin: url,
    ...params,
  };

  let Model = lget(coreParams, 'adapter.Model', lget(context, 'adapter.Model'));
  if (Model) lset(coreParams, 'adapter.Model', Model);

  let callService = context.app.service(service);

  const methods = {
    get: () => {
      return callService.get(id, coreParams);
    },
    find: () => {
      return callService.find(coreParams);
    },
    create: () => {
      return callService.create(data, coreParams);
    },
    update: () => {
      return callService.update(id, data, coreParams);
    },
    patch: () => {
      return callService.patch(id, data, coreParams);
    },
    remove: () => {
      return callService.remove(id, coreParams);
    },
  };
  return methods[method]();
};

const coreCall = (context, service) => {
  return {
    get: (id, params) => {
      return coreMethods({context, id, params, service, method: 'get'});
    },
    find: (params) => {
      return coreMethods({params, method: 'find', context, service});
    },
    create: (data, params) => {
      return coreMethods({context, service, method: 'create', params, data});
    },
    update: (id, data, params) => {
      return coreMethods({context, id, data, params, service, method: 'update'});
    },
    patch: (id, data, params) => {
      return coreMethods({context, id, data, params, service, method: 'patch'});
    },
    remove: (id, params) => {
      return coreMethods({context, id, params, service, method: 'remove'});
    },
  };
};

const setDataParams = async (context, options = [], {
  path = 'core',
  callType,
  concurrent = true,
  globalParams = {},
} = {}) => {
  if (Array.isArray(options) && options.length > 0) {
    if (concurrent) {
      await Promise.all(options.map(async option => {
        const {service, id, params} = option;
        let callMethod;
        if (callType === 'defaultCoreCall') {
          callMethod = defaultCoreCall(context, service);
        } else if (callType === 'coreCall') {
          callMethod = coreCall(context, service);
        } else {
          callMethod = context.app.service(service);
        }
        return {
          ...option,
          value: await callMethod.get(id, {...globalParams, ...params}),
        };
      }, this))
        .then(results => {
          for (const result of results) {
            const {service, key, value} = result;
            lset(context.params, `${path}.${key ? key : service}`, value);
          }
        });
    } else {
      for (const option of options) {
        const {service, id, key, params} = option;
        let callMethod;
        if (callType === 'defaultCoreCall') {
          callMethod = defaultCoreCall(context, service);
        } else if (callType === 'coreCall') {
          callMethod = coreCall(context, service);
        } else {
          callMethod = context.app.service(service);
        }
        lset(context.params, `${path}.${key ? key : service}`, await callMethod.get(id, {...globalParams, ...params}));
      }
    }
  }
  return context;
};


module.exports = {
  generateDefaultInstance,
  defaultCoreCall,
  coreMethods,
  coreCall,
  setDataParams,
};
