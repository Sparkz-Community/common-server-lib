// const {isProvider} = require('feathers-hooks-common');
const {BadRequest/*, GeneralError*/} = require('@feathersjs/errors');
const {packages:{lodash: {lget, lset, lpick}}, urlParser} = require('@iy4u/common-utils');

const checkContext = require('./checkContext');
const switchModel = require('./switch-model');

const {iff, isProvider} = require('feathers-hooks-common');
// ....
const checkForInstanceContext = iff(isProvider('external'),[
  async ctx => {
    const connectionStringOnService = lget(ctx, ['service', 'options', 'Model', 'db', '_connectionString']);
    const projectConnectionString = lget(ctx.app.get('mongo'), 'uri');

    if(connectionStringOnService !== projectConnectionString) {
      throw new Error(`You are not in the right context to manage ${ctx.path}`);
    }
  }
]);

const {generateDefaultInstance, coreCall, defaultCoreCall, setDataParams} = require('../utils');


const coreCallHook = (service, method, params, id, data) => {
  return context => {
    return coreCall({context, service, method, params, id, data});
  };
};

/**
 * @addFields: The fields on service you want to populate and filter by from context.params.core[field] - environment is there by default
 * @excludeServices: The services you want to exclude from being populated by these fields - all core services are there by default
 * @includeServices: The services you want to include on those being populated by these fields - all app services are there by default
 * */
const applyCore = ({addFields = [], excludeServices = [], includeServices = []} = {}) => {
  return context => {
    if (lget(context.params, 'core')) {
      const fields = ['environments'];
      fields.push(...addFields);
      const blackServices = ['instances', 'v-instances', 'domains', 'applications', 'environments', 'hosts'];
      blackServices.push(...excludeServices);
      const services = Object.keys(context.app.services);
      services.filter(service => !blackServices.includes(service));
      services.push(...includeServices);
      if (services.includes(context.path)) {
        fields.forEach(field => {
          let path = field;
          const pathId = lget(context, ['core', path, '_id']);
          if (['create', 'patch', 'update'].includes(lget(context, 'method'))) {
            lset(context.data, [path], pathId);
          } else {
            lset(context, ['params', 'query', path], pathId);
          }
        });
      }
    }
    return context;
  };
};

const sanitiseCoreObj = function (obj, {excludeFields = [], includeFields = []} = {}) {
  const fieldPaths2Clear = ['nativePermissions', 'createdBy', 'updatedBy', 'updatedByHistory', '_fastjoin'];
  fieldPaths2Clear.push(...excludeFields);
  let newObj = JSON.parse(JSON.stringify(obj));
  const fieldPaths = Object.keys(newObj);
  fieldPaths.push(...includeFields);
  fieldPaths.filter(path => fieldPaths2Clear.includes(path)).map(path => {
    delete newObj[path];
  });
  return newObj;
};

const syncDataMultiInstance = function (
  {
    remoteInstance,
    data,
    excludeFields = [],
    includeFields = [],
  } = {}) {
  return async (ctx) => {
    checkContext(ctx, 'after', ['create', 'update', 'patch'], 'syncDataMultiInstance');
    const currentInstanceId = lget(ctx, 'params.core.instance._id', lget(ctx, 'params.coreIds.inst'));

    if (remoteInstance && currentInstanceId && String(currentInstanceId) !== String(lget(remoteInstance, '_id'))) {
      try {
        const cleanData = sanitiseCoreObj(data, {excludeFields, includeFields});

        let remoteModel = await switchModel({
          setParamsMode: false,
          service: ctx.path,
          instance: remoteInstance,
        })(ctx);

        const remoteRecord = await ctx.app.service(ctx.path).patch(
          null,
          cleanData,
          {
            query: {
              _id: lget(cleanData, '_id'),
            },
            mongoose: {
              upsert: true,
            },
            core: {
              instance: remoteInstance,
            },
            adapter: {
              Model: remoteModel,
            },
          },
        );

        lset(ctx, 'params.remoteRecord', remoteRecord);
      } catch (errors) {
        throw new BadRequest(`Error ${ctx.method}ing ${ctx.path} in ${lget(remoteInstance)}`, errors);
      }
    }
    return ctx;
  };
};

// eslint-disable-next-line no-unused-vars
const setCoreIdsJwtParams = (options = {}) => {
  return async (context) => {
    checkContext(context, 'before', [], 'setCoreIdsJwtParams');

    let authentication = lget(context, 'params.authentication', {});

    let coreIds = lget(context, 'params.coreIds');
    if (!coreIds) {
      for (let [key, value] of Object.entries(authentication)) {
        let accessToken = lget(value, 'accessToken');
        if (accessToken) {
          try {
            let payload = await context.app.service(key).verifyAccessToken(accessToken, {});
            lset(context, `params.coreIds.${key}`, lpick(payload, ['inst', 'vinst', 'dn', 'hst', 'en', 'app']));
          } catch (e) {
            console.error(e);
          }
        }
      }

      // // TODO: set the finale coreIds to be used. (this is just in here for mvp this will need to be changed)
      coreIds = lget(context, 'params.coreIds');
      let authenticationCoreIds = lget(coreIds, 'authentication');
      let integrationAuthCoreIds = lget(coreIds, 'integrationAuth');
      let loginAuthCoreIds = lget(coreIds, 'loginAuth');
      let fingerprintAuthCoreIds = lget(coreIds, 'fingerprintAuth');

      if (authenticationCoreIds) {
        lset(context, 'params.coreIds', {...coreIds, ...authenticationCoreIds});
      } else if (integrationAuthCoreIds) {
        lset(context, 'params.coreIds', {...coreIds, ...integrationAuthCoreIds});
      } else if (loginAuthCoreIds) {
        lset(context, 'params.coreIds', {...coreIds, ...loginAuthCoreIds});
      } else if (fingerprintAuthCoreIds) {
        lset(context, 'params.coreIds', {...coreIds, ...fingerprintAuthCoreIds});
      }
    } else {
      // TODO: validate that the params.coreIds match jwt ids.
    }
    return context;
  };
};

// eslint-disable-next-line no-unused-vars
const setUrlConfigParams = (options = {}) => {
  return async (context) => {
    checkContext(context, 'before', [], 'setUrlConfigParams');

    if (!lget(context, 'params.core')) {
      let url = lget(context, 'params.originalOrigin', lget(context, 'params.headers.origin'));
      if (url) {
        lset(context, 'params.originalOrigin', url);

        let urlConfig = await urlParser(url);
        if (urlConfig) {
          lset(context, 'params.urlConfig', urlConfig);
        }
      }
    }
    return context;
  };
};


// eslint-disable-next-line no-unused-vars
const setCoreIdsManualParams = (options = {}) => {
  return async (context) => {
    checkContext(context, 'before', [], 'setCoreIdsManualParams');

    if (lget(context, 'service.options.Model') && !lget(context, 'params.adapter.Model') && !lget(context, 'params.core') && !lget(context, 'params.urlConfig') && !lget(context, 'params.coreIds')) {
      throw new BadRequest('params.adapter.Model or params.core or params.urlConfig or params.coreIds is not set.');
    }

    if (!lget(context, 'params.coreIds') && !lget(context, 'params.core') && !lget(context, 'params.adapter.Model')) {
      // Manual get instance, vInstance, and domain.

      let urlConfig = lget(context, 'params.urlConfig');
      if (urlConfig) {
        const domainRes = await defaultCoreCall(context, 'domains').find({
          query: {
            $or: [
              {name: urlConfig.domain},
              {name: urlConfig.fqdn},
            ],
          },
          paginate: false,
          domains_fJoinHookResolversQuery: {
            vInstance: [
              undefined,
              {
                'v-instances_fJoinHookResolversQuery': {
                  instance: true,
                },
              },
            ],
          },
        })
          .catch(err => {
            console.log(err);
          });

        if (domainRes.length === 0) {
          const projectUrl = context.app.get('clientUrl').replace('/#', '');
          let projectUrlConfig = await urlParser(projectUrl);
          if (urlConfig.fqdn === projectUrlConfig.fqdn) {
            const defaultInstance = generateDefaultInstance(context.app);
            await switchModel({instance: defaultInstance})(context);
          } else {
            throw new BadRequest(`Request is from Unsupported Domain "${urlConfig.fqdn}"`, {
              domain: urlConfig.fqdn,
            });
          }
        } else {
          // Logic to find what domain to use.
          let domain;
          if (domainRes.length > 1) {
            domain = domainRes.find(({name}) => name === urlConfig.fqdn);
          } else if (domainRes.length === 1) {
            domain = domainRes.shift();
          }

          if (lget(domain, 'name') === urlConfig.fqdn) {
            // it's here that we should get the instance context
            const instance = lget(domain, '_fastjoin.vInstance._fastjoin.instance');
            const vInstance = lget(domain, '_fastjoin.vInstance');

            lset(context, 'params.coreIds.inst', instance._id);
            lset(context, 'params.coreIds.vinst', vInstance._id);
            lset(context, 'params.coreIds.dn', domain._id);
          } else {
            // TODO: I think we need to error here but I am not sure.
            throw new BadRequest(`Request Domain "${urlConfig.fqdn}" does not match Domain found.`, {
              domain: domain.name,
            });
          }
        }
      } else {
        if (lget(context, 'service.options.Model')) {
          throw new BadRequest('params.urlConfig is not set.');
        }
      }
    }
    return context;
  };
};

// eslint-disable-next-line no-unused-vars
const setCoreParams = (options = {}) => {
  return async (context) => {
    checkContext(context, 'before', [], 'setCoreParams');

    const core = lget(context, 'params.core', {});
    const validAllCoreKeys = ['instance', 'v-instance', 'domain', 'host', 'environment', 'application'];
    let hasAllCoreKeys = validAllCoreKeys.every(key => !!core[key]);

    if (hasAllCoreKeys || lget(context, 'params.adapter.Model')) {
      await switchModel()(context);
      return context;
    }

    const coreIds = lget(context, 'params.coreIds');
    if (coreIds) {
      let validCoreIdsModelKeys = ['inst', 'vinst', 'dn'];
      let hasCoreIdsKeys = validCoreIdsModelKeys.every(key => !!coreIds[key]);

      if (hasCoreIdsKeys) {
        // if jwt is used async call instance, vInstance, and domain.
        await switchModel()(context);

        const validCoreKeys = ['instance', 'v-instance', 'domain'];
        let hasCoreKeys = validCoreKeys.every(key => !!core[key]);

        if (isProvider('external')(context) && !hasCoreKeys) {
          let dataOptions = [
            {
              service: 'instances',
              id: coreIds.inst,
              key: 'instance',
            },
            {
              service: 'v-instances',
              id: coreIds.vinst,
              key: 'v-instance',
            },
            {
              service: 'domains',
              id: coreIds.dn,
              key: 'domain',
            },
          ];
          await setDataParams(context, dataOptions, {callType: 'coreCall'});
        }

      } else {
        if (lget(context, 'service.options.Model')) {
          throw new BadRequest(`params.coreIds ${validCoreIdsModelKeys.join(', ')} are not set.`);
        }
      }
    } else {
      if (lget(context, 'service.options.Model') /*isProvider('external')(context)*/) {
        throw new BadRequest('params.core or params.coreIds was not passed or able to be set.');
      }
    }
    return context;
  };
};

// eslint-disable-next-line no-unused-vars
const setCoreContextParams = (options = {}) => {
  return async context => {

    const coreContext = lget(context, 'params.coreContext', {});

    const validCoreContextKeys = ['host', 'environment', 'application'];
    let hasCoreContextKeys = validCoreContextKeys.every(key => !!coreContext[key]);

    if (isProvider('external')(context) && !hasCoreContextKeys) {
      const coreIds = lget(context, 'params.coreIds');

      let validCoreIdsContextKeys = ['hst', 'en', 'app'];
      let hasCoreIdsContextKeys = validCoreIdsContextKeys.every(key => !!coreIds[key]);

      if (hasCoreIdsContextKeys) {
        let contextOptions = [
          {service: 'hosts', id: coreIds.hst, key: 'host'},
          {service: 'environments', id: coreIds.en, key: 'environment'},
          {service: 'applications', id: coreIds.app, key: 'application'},
        ];
        await setDataParams(context, contextOptions, {callType: 'coreCall', path: 'coreContext'});
      } else {
        // TODO: Need to validate core objects match origin domain and host.
        let hostname = lget(context, 'params.urlConfig.hostname', '');
        let domainId = lget(context, 'params.core.domain._id', lget(context, 'params.coreIds.dn'));
        const hostRes = await coreCall(context, 'hosts').find({
          query: {
            name: (hostname || ''),
            domain: domainId,
          },
          paginate: false,
          hosts_fJoinHookResolversQuery: {
            environment: true,
            application: true,
          },
        })
          .catch(err => {
            console.log(err);
          });

        const host = lget(hostRes, '0');

        if (host) {
          lset(context, 'params.coreIds.hst', host._id);
          lset(context, 'params.coreIds.en', lget(host, '_fastjoin.environment._id'));
          lset(context, 'params.coreIds.app', lget(host, '_fastjoin.application._id'));
          lset(context, 'params.coreContext.host', host);
          lset(context, 'params.coreContext.environment', lget(host, '_fastjoin.environment'));
          lset(context, 'params.coreContext.application', lget(host, '_fastjoin.application'));
        } else {
          if (!lget(context, 'params.$admin.auth')) {
            throw new BadRequest(`Request host does not match Domain: "${domainId}", Hostname: "${hostname}".`, {
              domainId,
              domain: lget(context, 'params.core.domain'),
              hostname: hostname,
              host: host,
            });
          }
        }
      }
    }
    return context;
  };
};

module.exports = {
  applyCore,
  coreCallHook,
  sanitiseCoreObj,
  syncDataMultiInstance,
  checkForInstanceContext,
  setCoreIdsJwtParams,
  setUrlConfigParams,
  setCoreIdsManualParams,
  setCoreParams,
  setCoreContextParams,
};
