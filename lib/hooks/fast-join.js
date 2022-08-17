const {fastJoin} = require('feathers-hooks-common');
const {packages:{lodash: {lget, lset}}} = require('@iy4u/common-utils');
const {coreCall} = require('../utils');


const getJoin = (
  {
    service,
    servicePath,
    herePath,
    getId,
    joinPath,
    params = {},
    errMessage,
    passError = true,
    joinFn,
    throwErr,
  }) => {
  let jPath = joinPath ? joinPath : herePath;
  let errorMessage = errMessage ? errMessage : `could not join ${service} ${herePath}`;
  const config = {
    joins: {
      // eslint-disable-next-line no-unused-vars
      [herePath]: $select => async (item, context) => {
        let item_id = getId ? getId : lget(item, herePath);
        let s = service ? service : lget(item, servicePath);
        if (item_id && s) {
          console.log('get in get join', context.type, ' - ', context.method, ' - ', context.path);

          let customParams = {};
          if ($select) {
            lset(customParams, 'query.$select', $select);
          }

          let joinItem = await coreCall(context, s).get(item_id, {...customParams, ...params})
            .catch(err => {
              let msg = errorMessage + passError ? ` ${err.message}` : '';
              console.error(msg);
              if (throwErr) throw new Error(msg);
            });
          console.log('get join item', s);
          if (joinFn) {
            joinFn(item, joinItem);
          } else {
            lset(item, ['_fastjoin', jPath], joinItem);
          }
        }
      },
    },
  };
  return fastJoin(
    config,
    context => {
      let query = {};
      if (lget(context, ['params', `${context.path}_getJoinResolversQuery`])) {
        Object.keys(config.joins).forEach(key => {
          let val = lget(context, ['params', `${context.path}_getJoinResolversQuery`, key], false);
          if (val) lset(query, key, val);
        });
      }
      return query;
    },
  );
};

const findJoin = (
  {
    service,
    servicePath,
    herePath,
    findIds,
    therePath = '_id',
    joinPath,
    params = {},
    errMessage,
    passError = true,
    throwErr,
    query,
    queryFn,
    joinFn,
    resultPath = 'data',
  }) => {
  let jPath = joinPath ? joinPath : herePath;
  let errorMessage = errMessage ? errMessage : `could not join ${service} ${herePath}`;
  const config = {
    joins: {
      // eslint-disable-next-line no-unused-vars
      [herePath]: ($select, customParams = {}) => async (item, context) => {
        let joinService = service ? service : lget(item, servicePath);
        if (joinService) {
          let q = query ? query : queryFn ? queryFn(item) : {};

          if (!q) {
            let item_ids = findIds ? findIds : lget(item, herePath);
            if (item_ids) q = {[therePath]: {$in: item_ids}};
          }

          if (q) {
            customParams = {
              query: {
                $client: {
                  ...customParams,
                },
                ...q
              },
            };
            if ($select) {
              lset(customParams, 'query.$select', $select);
            }

            let joinItems = await coreCall(context, joinService).find({...customParams, ...params})
              .catch(err => {
                let msg = errorMessage + passError ? ` ${err.message}` : '';
                console.error(msg);
                if (throwErr) throw new Error(msg);
              });

            let result = resultPath ? lget(joinItems, resultPath) : joinItems;

            if (joinFn) {
              joinFn(item, joinItems);
            } else lset(item, ['_fastjoin', jPath], result);
          }
        }
      },
    },
  };
  return fastJoin(
    config,
    context => {
      let query = {};
      if (lget(context, ['params', `${context.path}_findJoinResolversQuery`])) {
        Object.keys(config.joins).forEach(key => {
          let val = lget(context, ['params', `${context.path}_findJoinResolversQuery`, key], false);
          if (val) lset(query, key, val);
        });
      }
      return query;
    },
  );
};


const nestedFJoinHook = function (path, service, idKey, customQuery = {}, queryPath = '_id', customParams = {}) {
  let resolver = {
    joins: {
      // eslint-disable-next-line no-unused-vars
      [path]: ($select) => async (data, context) => {
        let items = lget(data, path, []);
        let ids = items.map(item => lget(item, idKey));
        if (ids.length > 0) {
          const query = {
            [queryPath]: ids,
            ...customQuery,
          };

          let params = {
            query,
          };
          if ($select) {
            lset(params, 'query.$select', $select);
          }


          const items_res = await context.app.service(service).find({
            ...context.params,
            ...params,
            ...customParams,
          });

          const queriedItems = items_res.data;
          const fastJoin_items = items.map(item => {
            return lset(JSON.parse(JSON.stringify(item)),
              idKey,
              queriedItems.find(query => String(query._id) === String(lget(item, idKey)) || lget(item, idKey)),
            );
          });
          // console.log( fastJoin_items);
          lset(data, `_fastjoin.${path}.${idKey}`, fastJoin_items);
        }

      },
    },
  };
  return fastJoin(
    resolver,
    context => {
      let query = {};
      if (lget(context, ['params', `${context.path}_nestedFJoinHookHookResolversQuery`])) {
        Object.keys(resolver.joins).forEach(key => {
          let val = lget(context, ['params', `${context.path}_nestedFJoinHookResolversQuery`, key], false);
          if (val) lset(query, key, val);
        });
      }
      return query;
    },
  );
};


const fJoinHook = function (path, service, customQuery = {}, queryPath = '_id', customParams = {}) {
  let resolver = {
    joins: {
      [path]: ($select, params) => async (item, context) => {

        let ids = Array.isArray(lget(item, path)) ? lget(item, path, []) : String(lget(item, path, ''));
        let newItems;
        if (ids.length > 0) {
          const query = {
            [queryPath]: ids,
            ...customQuery,
          };

          params = {
            query: {
              $client: {
                ...params,
              },
              ...query,
            },
          };
          if ($select) {
            lset(params, 'query.$select', $select);
          }

          let queried = await context.app.service(service).find({
            ...context.params,
            ...params,
            ...customParams,
          });
          newItems = Array.isArray(ids) ? lget(queried, 'data', queried) : lget(queried, 'data.0', queried[0]);
        }

        lset(item, `_fastjoin.${path}`, newItems);
      },
    },
  };
  return fastJoin(
    resolver,
    context => {
      let query = {};
      if (lget(context, ['params', `${context.path}_fJoinHookResolversQuery`])) {
        Object.keys(resolver.joins).forEach(key => {
          let val = lget(context, ['params', `${context.path}_fJoinHookResolversQuery`, key], false);
          if (val) lset(query, key, val);
        });
      }
      return query;
    },
  );
};


module.exports = {
  nestedFJoinHook,
  fJoinHook,
  getJoin,
  findJoin,
};
