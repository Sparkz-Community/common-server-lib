const {packages:{lodash: {lget, lset, lisNil, lomit}}, HookSystem, isEmpty} = require('@iy4u/common-utils');

const checkContext = require('../checkContext');
const {beginTransaction, runTxnWithRetry, commitWithRetry} = require('../mongo-transactions');
const {FeathersError} = require('@feathersjs/errors');

class relateOtmError extends FeathersError {
  constructor(message, data) {
    super(message, 'relateOtm', 524, 'relateOtmError', data);
  }
}

class removeOtmError extends FeathersError {
  constructor(message, data) {
    super(message, 'removeOtm', 525, 'removeOtmError', data);
  }
}

// TO put on the service 'here' with the one and be related to the service 'there' with the many array
const relateOtmFunc = (
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
  let hookManagerOtm = new HookSystem({
    hook_store: {
      before: beforeHooks,
      after: afterHooks,
      error: errorHooks,
    },
  });
  return async context => {
    checkContext(context, ['before', 'after'], ['create', 'update', 'patch'], 'relateOtm');

    if (context.type === 'before') {
      let skipPath = lget(context, 'params.skipPath', []);
      let startTransactionOptions = lget(context, 'params.startTransactionOptions', {});
      await beginTransaction({skipPath, startTransactionOptions})(context);
    }

    if (context.type === 'before' && context.method !== 'create' && !lisNil(context.id)) {
      let relateOtm_res_before = await context.service.get(context.id, context.params);
      lset(context, ['params', 'relateOtm', paramsName, 'relateOtm_res_before'], relateOtm_res_before);
    } else if (context.type === 'after') {
      const hereData = lget(context, dataPath);
      const fkId = lget(hereData, herePath);
      let oldFkId;
      const id = lget(hereData, idPath, context.id);

      const notEmpty = !Array.isArray(fkId) ? !isEmpty(fkId) : !!fkId.length;

      // Evaluate Relate Possibility
      let runRelate = !lisNil(fkId) && notEmpty;

      if (runRelate && context.method !== 'create') {
        oldFkId = lget(context, `params.relateOtm.${paramsName}.relateOtm_res_before.${herePath}`);
        if (lisNil(lget(context, `params.relateOtm.${paramsName}.relateOtm_res_before`))) {
          runRelate = false;
        } else {
          runRelate = !lisNil(oldFkId) && (String(oldFkId) !== String(fkId));
        }
      }

      if (runRelate) {
        let patchObj = {};
        lset(patchObj, ['$addToSet', therePath], id);

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

        lset(context, ['params', 'relateOtm', paramsName, 'fkId'], fkId);
        lset(context, ['params', 'relateOtm', paramsName, 'oldFkId'], oldFkId);
        lset(context, ['params', 'relateOtm', paramsName, 'patchObj'], patchObj);
        lset(context, ['params', 'relateOtm', paramsName, 'relateParams'], relateParams);

        let params = addParams;
        if (passParams) {
          params = {
            ...lomit(context.params, ['provider', 'query']),
            ...addParams,
          };
        }

        lset(context, ['params', 'relateOtm', paramsName, 'params'], params);

        await hookManagerOtm.call({path: 'before'}, context, {paramsName});

        let customParams = lget(context, ['params', 'relateOtm', paramsName, 'params'], params);

        let relateOtm_res = await context.app.service(thereService).patch(
          lget(context, ['params', 'relateOtm', paramsName, 'fkId'], fkId),
          lget(context, ['params', 'relateOtm', paramsName, 'patchObj'], patchObj),
          {...customParams, relate_hook: 'relateOtm', disableSoftDelete: true},
        );
        lset(context, ['params', 'relateOtm', paramsName, 'relateOtm_res'], relateOtm_res);

        await hookManagerOtm.call({path: 'after'}, context, {paramsName});

        if (context.method !== 'create') {
          let oldFkPayload = {};
          lset(oldFkPayload, ['$pull', therePath], id);

          await context.app.service(thereService).patch(oldFkId, oldFkPayload, {
            ...customParams,
            relate_hook: 'relateOtm',
            disableSoftDelete: true,
          });
        }

      }
    }

    if (context.type === 'after') {
      await commitWithRetry(relateOtmError)(context);
    }
    return context;
  };
};

/*
* pull id from parent list of fkIds.
* */
const removeOtmFunc = (
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
  let hookManagerRemoveOtm = new HookSystem({
    hook_store: {
      before: beforeHooks,
      after: afterHooks,
      error: errorHooks,
    },
  });
  return async context => {
    checkContext(context, ['before', 'after'], ['remove'], 'removeOtm');

    if (context.type === 'before') {
      let skipPath = lget(context, 'params.skipPath', []);
      let startTransactionOptions = lget(context, 'params.startTransactionOptions', {});
      await beginTransaction({skipPath, startTransactionOptions})(context);
    }

    if (context.type === 'after') {
      const hereData = lget(context, dataPath);
      const fkId = lget(hereData, herePath);
      const id = lget(hereData, idPath, context.id);

      const notEmpty = !Array.isArray(fkId) ? !isEmpty(fkId) : !!fkId.length;

      // Evaluate Relate Possibility
      let runRelate = !lisNil(fkId) && notEmpty;

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

        lset(context, ['params', 'removeOtm', paramsName, 'fkId'], fkId);
        lset(context, ['params', 'removeOtm', paramsName, 'patchObj'], patchObj);
        lset(context, ['params', 'removeOtm', paramsName, 'relateParams'], relateParams);

        let params = addParams;
        if (passParams) {
          params = {
            ...lomit(context.params, ['provider', 'query']),
            ...addParams,
          };
        }

        lset(context, ['params', 'removeOtm', paramsName, 'params'], params);


        await hookManagerRemoveOtm.call({path: 'before'}, context, {paramsName});

        const customParams = lget(context, ['params', 'relateOtm', paramsName, 'params'], params);

        let removeOtm_res = await context.app.service(thereService).patch(
          lget(context, ['params', 'removeOtm', paramsName, 'fkId'], fkId),
          lget(context, ['params', 'removeOtm', paramsName, 'patchObj'], patchObj),
          {...customParams, relate_hook: 'removeOtm', disableSoftDelete: true},
        );
        lset(context, ['params', 'removeOtm', paramsName, 'removeOtm_res'], removeOtm_res);

        await hookManagerRemoveOtm.call({path: 'after'}, context, {paramsName});
      }
    }
    if (context.type === 'after') {
      await commitWithRetry(removeOtmError)(context);
    }
    return context;
  };
};

const relateOtm = (
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
  return runTxnWithRetry(relateOtmFunc, {
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
  }, relateOtmError);
};

const removeOtm = (
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
    fkAction = 'null',
  } = {}) => {
  return runTxnWithRetry(removeOtmFunc, {
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
    fkAction,
  }, removeOtmError);
};

module.exports = {
  relateOtm,
  removeOtm,
};
