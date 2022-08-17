const {packages:{lodash: {lget, lset, lisNil, lomit}}, HookSystem} = require('@iy4u/common-utils');

const checkContext = require('../checkContext');
const {beginTransaction, runTxnWithRetry, commitWithRetry} = require('../mongo-transactions');
const {FeathersError} = require('@feathersjs/errors');

class relateMtmError extends FeathersError {
  constructor(message, data) {
    super(message, 'relateMtm', 522, 'relateMtmError', data);
  }
}

class removeMtmError extends FeathersError {
  constructor(message, data) {
    super(message, 'removeMtm', 523, 'removeMtmError', data);
  }
}


// TO put on the service 'here' with the one and be related to the service 'there' with the many array
const relateMtmFunc = (
  {
    idPath = '_id',
    dataPath = 'result',
    thereService,
    herePath,
    therePath,
    paramsName = `${thereService}_${therePath}_${herePath}`,
    addParams = {},
    passParams = false,
    beforeHooks = [],
    afterHooks = [],
    errorHooks = [],
  } = {}) => {

  let hookManagerMtm = new HookSystem({
    hook_store: {
      before: beforeHooks,
      after: afterHooks,
      error: errorHooks,
    },
  });

  return async context => {

    checkContext(context, ['before', 'after'], ['create', 'update', 'patch'], 'relateMtm');

    if (context.type === 'before') {
      let skipPath = lget(context, 'params.skipPath', []);
      let startTransactionOptions = lget(context, 'params.startTransactionOptions', {});
      await beginTransaction({skipPath, startTransactionOptions})(context);
    }

    if (context.type === 'before' && context.method !== 'create' && !lisNil(context.id)) {
      let relateMtm_res_before = await context.service.get(context.id,context.params);
      lset(context, ['params', 'relateMtm', paramsName, 'relateMtm_res_before'], relateMtm_res_before);
    } else if (context.type === 'after') {

      const hereData = lget(context, dataPath);
      const fkIds = lget(hereData, herePath, []);
      const id = lget(hereData, idPath, context.id);
      let oldFkIds;
      let newFkIds;
      let removedFkIds;

      let runRelate = !lisNil(fkIds) && fkIds.length;

      if (runRelate && context.method !== 'create') {
        oldFkIds = lget(context, `params.relateMtm.${paramsName}.relateMtm_res_before.${herePath}`);
        if (lisNil(lget(context, `params.relateMtm.${paramsName}.relateMtm_res_before`))) {
          runRelate = false;
        } else {
          let fkIdsMap = fkIds.map(fkId => String(fkId));
          removedFkIds = oldFkIds.reduce((acc, oldFkId) => {
            if (!fkIdsMap.includes(String(oldFkId))) {
              acc.push(oldFkId);
            }
            return acc;
          }, []);

          let oldFkIdsMap = oldFkIds.map(oldFkId => String(oldFkId));
          newFkIds = fkIds.reduce((acc, fkId) => {
            if (!oldFkIdsMap.includes(String(fkId))) {
              acc.push(fkId);
            }
            return acc;
          }, []);
          runRelate = !!newFkIds.length || !!removedFkIds.length;
        }
      } else if (runRelate && context.method === 'create') {
        newFkIds = Array.from(fkIds);
        runRelate = !!newFkIds.length;
      }

      if (runRelate) {
        let patchObj = {};
        lset(patchObj, ['$addToSet', therePath], id);

        let removedPatchObj = {};
        lset(removedPatchObj, ['$pull', therePath], id);

        let relateParams = {
          paramsName,
          idPath,
          dataPath,
          thereService,
          herePath,
          therePath,
          passParams,
          beforeHooks,
          afterHooks,
          errorHooks,
        };

        lset(context, ['params', 'relateMtm', paramsName, 'fkIds'], fkIds);
        lset(context, ['params', 'relateMtm', paramsName, 'oldFkIds'], oldFkIds);
        lset(context, ['params', 'relateMtm', paramsName, 'removedFkIds'], removedFkIds);
        lset(context, ['params', 'relateMtm', paramsName, 'newFkIds'], newFkIds);
        lset(context, ['params', 'relateMtm', paramsName, 'patchObj'], patchObj);
        lset(context, ['params', 'relateMtm', paramsName, 'removedPatchObj'], removedPatchObj);
        lset(context, ['params', 'relateMtm', paramsName, 'relateParams'], relateParams);

        let params = addParams;
        if (passParams) {
          params = {
            ...lomit(context.params, ['provider', 'query']),
            ...addParams,
          };
        }

        lset(context, ['params', 'relateMtm', paramsName, 'params'], params);

        await hookManagerMtm.call({path: 'before'}, context, {paramsName});

        const customParams = lget(context, ['params', 'relateMtm', paramsName, 'params'], params);

        if (!lisNil(lget(context, ['params', 'relateMtm', paramsName, 'newFkIds'], newFkIds)) && lget(context, ['params', 'relateMtm', paramsName, 'newFkIds'], newFkIds).length) {
          let relateMtm_res = await context.app.service(thereService).patch(
            null,
            lget(context, ['params', 'relateMtm', paramsName, 'patchObj'], patchObj),
            {
              ...customParams,
              query: {
                _id: lget(context, ['params', 'relateMtm', paramsName, 'newFkIds'], newFkIds),
              },
              relate_hook: 'relateMtm',
              disableSoftDelete: true,
            },
          );
          lset(context, ['params', 'relateMtm', paramsName, 'relateMtm_res'], relateMtm_res);
        }

        if (!lisNil(lget(context, ['params', 'relateMtm', paramsName, 'removedFkIds'], removedFkIds)) && lget(context, ['params', 'relateMtm', paramsName, 'removedFkIds'], removedFkIds).length) {
          let relateMtm_removed_res = await context.app.service(thereService).patch(
            null,
            lget(context, ['params', 'relateMtm', paramsName, 'removedPatchObj'], removedPatchObj),
            {
              ...customParams,
              query: {
                _id: lget(context, ['params', 'relateMtm', paramsName, 'removedFkIds'], removedFkIds),
              },
              relate_hook: 'relateMtm',
              disableSoftDelete: true,
            },
          );
          lset(context, ['params', 'relateMtm', paramsName, 'relateMtm_removed_res'], relateMtm_removed_res);
        }

        await hookManagerMtm.call({path: 'after'}, context, {paramsName});
      }
    }

    if (context.type === 'after') {
      await commitWithRetry(relateMtmError)(context);
    }
    return context;
  };
};

/*
* pull id from parent list of fkIds.
* */
const removeMtmFunc = (
  {
    idPath = '_id',
    dataPath = 'result',
    thereService,
    herePath,
    therePath,
    paramsName = `${thereService}_${therePath}_${herePath}`,
    addParams = {},
    passParams = false,
    beforeHooks = [],
    afterHooks = [],
    errorHooks = [],
  } = {}) => {

  let hookManagerRemoveMtm = new HookSystem({
    hook_store: {
      before: beforeHooks,
      after: afterHooks,
      error: errorHooks,
    },
  });


  return async context => {
    checkContext(context, ['before', 'after'], ['remove'], 'removeMtm');

    if (context.type === 'before') {
      let skipPath = lget(context, 'params.skipPath', []);
      let startTransactionOptions = lget(context, 'params.startTransactionOptions', {});
      await beginTransaction({skipPath, startTransactionOptions})(context);
    }

    if (context.type === 'after') {
      const hereData = lget(context, dataPath);
      const fkIds = lget(hereData, herePath, []);
      const id = lget(hereData, idPath, context.id);

      let runRelate = !lisNil(fkIds) && fkIds.length;

      if (runRelate) {
        let patchObj = {};
        lset(patchObj, ['$pull', therePath], id);

        let relateParams = {
          paramsName,
          idPath,
          dataPath,
          thereService,
          herePath,
          therePath,
          passParams,
          beforeHooks,
          afterHooks,
          errorHooks,
        };

        lset(context, ['params', 'removeMtm', paramsName, 'fkIds'], fkIds);
        lset(context, ['params', 'removeMtm', paramsName, 'patchObj'], patchObj);
        lset(context, ['params', 'removeMtm', paramsName, 'relateParams'], relateParams);

        let params = addParams;
        if (passParams) {
          params = {
            ...lomit(context.params, ['provider', 'query']),
            ...addParams,
          };
        }

        lset(context, ['params', 'removeMtm', paramsName, 'params'], params);

        await hookManagerRemoveMtm.call({path: 'before'}, context, {paramsName});

        const customParams = lget(context, ['params', 'removeMtm', paramsName, 'params'], params);

        if (!lisNil(lget(context, ['params', 'removeMtm', paramsName, 'fkIds'], fkIds)) && lget(context, ['params', 'removeMtm', paramsName, 'fkIds'], fkIds).length) {
          let removeMtm_res = await context.app.service(thereService).patch(
            null,
            lget(context, ['params', 'removeMtm', paramsName, 'patchObj'], patchObj),
            {
              ...customParams,
              query: {
                _id: lget(context, ['params', 'removeMtm', paramsName, 'fkIds'], fkIds),
              },
              relate_hook: 'removeMtm',
              disableSoftDelete: true,
            },
          );
          lset(context, ['params', 'removeMtm', paramsName, 'removeMtm_res'], removeMtm_res);
        }

        await hookManagerRemoveMtm.call({path: 'after'}, context, {paramsName});
      }
    }
    if (context.type === 'after') {
      await commitWithRetry(removeMtmError)(context);
    }
    return context;
  };
};

const relateMtm = (
  {
    idPath = '_id',
    dataPath = 'result',
    thereService,
    herePath,
    therePath,
    paramsName = `${thereService}_${therePath}_${herePath}`,
    addParams = {},
    passParams = false,
    beforeHooks = [],
    afterHooks = [],
    errorHooks = [],
  } = {}) => {
  return runTxnWithRetry(relateMtmFunc, {
    paramsName,
    idPath,
    dataPath,
    thereService,
    herePath,
    therePath,
    addParams,
    passParams,
    beforeHooks,
    afterHooks,
    errorHooks,
  }, relateMtmError);
};

const removeMtm = (
  {
    idPath = '_id',
    dataPath = 'result',
    thereService,
    herePath,
    therePath,
    paramsName = `${thereService}_${therePath}_${herePath}`,
    addParams = {},
    passParams = false,
    beforeHooks = [],
    afterHooks = [],
    errorHooks = [],
  } = {}) => {
  return runTxnWithRetry(removeMtmFunc, {
    paramsName,
    idPath,
    dataPath,
    thereService,
    herePath,
    therePath,
    addParams,
    passParams,
    beforeHooks,
    afterHooks,
    errorHooks,
  }, removeMtmError);
};

module.exports = {
  relateMtm,
  removeMtm,
};
