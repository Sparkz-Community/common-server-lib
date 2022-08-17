const {packages:{lodash: {lget, lset, lisNil, lomit}}, HookSystem, isEmpty} = require('@iy4u/common-utils');

const checkContext = require('../checkContext');
const runTxnWithRetry = require('../mongo-transactions').runTxnWithRetry;
const commitWithRetry = require('../mongo-transactions').commitWithRetry;
const beginTransaction = require('../mongo-transactions').beginTransaction;
const {FeathersError} = require('@feathersjs/errors');

class relateOtoError extends FeathersError {
  constructor(message, data) {
    super(message, 'relateOto', 520, 'relateOtoError', data);
  }
}

class removeOtoError extends FeathersError {
  constructor(message, data) {
    super(message, 'removeOto', 521, 'removeOtoError', data);
  }
}

// TO put on the service 'here' with the one and be related to the service 'there' with the many array
const relateOtoFunc = (
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
  let hookManagerOto = new HookSystem({
    hook_store: {
      before: beforeHooks,
      after: afterHooks,
      error: errorHooks,
    },
  });
  return async context => {
    checkContext(context, ['before', 'after'], ['create', 'update', 'patch'], 'relateOto');

    if (context.type === 'before') {
      let skipPath = lget(context, 'params.skipPath', []);
      let startTransactionOptions = lget(context, 'params.startTransactionOptions', {});
      await beginTransaction({skipPath, startTransactionOptions})(context);
    }

    if (context.type === 'before' && context.method !== 'create' && !lisNil(context.id)) {
      let relateOto_res_before = await context.service.get(context.id,context.params);
      lset(context, ['params', 'relateOto', paramsName, 'relateOto_res_before'], relateOto_res_before);
    } else if (context.type === 'after') {

      const hereData = lget(context, dataPath);
      const fkId = lget(hereData, herePath);
      let oldFkId;
      const id = lget(hereData, idPath, context.id);

      const notEmpty = !Array.isArray(fkId) ? !isEmpty(fkId) : !!fkId.length;

      // Evaluate Relate Possibility
      let runRelate = !lisNil(fkId) && notEmpty;

      if (runRelate && context.method !== 'create') {
        oldFkId = lget(context, `params.relateOto.${paramsName}.relateOto_res_before.${herePath}`);
        if (lisNil(lget(context, `params.relateOto.${paramsName}.relateOto_res_before`))) {
          runRelate = false;
        } else {
          runRelate = !lisNil(oldFkId) && (String(oldFkId) !== String(fkId));
        }
      }

      if (runRelate) {
        let patchObj = {};
        lset(patchObj, therePath, id);

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

        lset(context, ['params', 'relateOto', paramsName, 'fkId'], fkId);
        lset(context, ['params', 'relateOto', paramsName, 'oldFkId'], oldFkId);
        lset(context, ['params', 'relateOto', paramsName, 'patchObj'], patchObj);
        lset(context, ['params', 'relateOto', paramsName, 'relateParams'], relateParams);

        let params = addParams;
        if (passParams) {
          params = {
            ...lomit(context.params, ['provider', 'query']),
            ...addParams,
          };
        }

        lset(context, ['params', 'relateOto', paramsName, 'params'], params);

        await hookManagerOto.call({path: 'before'}, context, {paramsName});

        const customParams = lget(context, ['params', 'relateOto', paramsName, 'params'], params);

        let relateOto_res = await context.app.service(thereService).patch(
          lget(context, ['params', 'relateOto', paramsName, 'fkId'], fkId),
          lget(context, ['params', 'relateOto', paramsName, 'patchObj'], patchObj),
          {...customParams, relate_hook: 'relateOto', disableSoftDelete: true},
        );
        lset(context, ['params', 'relateOto', paramsName, 'relateOto_res'], relateOto_res);

        await hookManagerOto.call({path: 'after'}, context, {paramsName});

        if (context.method !== 'create') {
          let oldFkPayload = {};
          let newOldFk = lget(context, 'params.replaceId');
          if (newOldFk) {
            oldFkPayload = {
              [therePath]: newOldFk,
            };
          } else {
            oldFkPayload = {
              $unset: {
                [therePath]: 1,
              },
            };
          }

          await context.app.service(thereService).patch(oldFkId, oldFkPayload, {
            ...customParams,
            relate_hook: 'relateOto',
            disableSoftDelete: true,
          });
        }
      }
    }

    if (context.type === 'after') {
      await commitWithRetry(relateOtoError)(context);
    }
    return context;
  };
};

/*
* pull id from parent list of fkIds.
* */
const removeOtoFunc = (
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

  let hookManagerRemoveOto = new HookSystem({
    hook_store: {
      before: beforeHooks,
      after: afterHooks,
      error: errorHooks,
    },
  });

  let fkActionOptions = ['protect', 'replace', 'null', 'unset', 'cascade'];
  if (!fkActionOptions.includes(fkAction)) {
    throw Error(`fkAction must be on of these options: "${fkActionOptions.join(', ')}". fkAction: "${fkAction}",`);
  }

  return async context => {
    checkContext(context, ['before', 'after'], ['remove'], 'removeOto');

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
        if (fkAction.toLowerCase() === 'protect') {
          throw new removeOtoError(`Dependent relationship: "${fkId}". Can't remove record: "${id}".`);
        }

        let patchObj = {};
        let newFkId = lget(context, 'params.replaceId');

        if (fkAction.toLowerCase() === 'replace') {
          patchObj = {
            [therePath]: newFkId,
          };
        } else if (fkAction.toLowerCase() === 'null') {
          patchObj = {
            [therePath]: null,
          };
        } else if (fkAction.toLowerCase() === 'unset') {
          patchObj = {
            $unset: {
              [therePath]: 1,
            },
          };
        }

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
          fkAction,
        };

        lset(context, ['params', 'removeOto', paramsName, 'fkId'], fkId);
        lset(context, ['params', 'removeOto', paramsName, 'newFkId'], newFkId);
        lset(context, ['params', 'removeOto', paramsName, 'patchObj'], patchObj);
        lset(context, ['params', 'removeOto', paramsName, 'relateParams'], relateParams);


        let params = addParams;
        if (passParams) {
          params = {
            ...lomit(context.params, ['provider', 'query']),
            ...addParams,
          };
        }

        lset(context, ['params', 'removeOto', paramsName, 'params'], params);

        await hookManagerRemoveOto.call({path: 'before'}, context, {paramsName});

        const customParams = lget(context, ['params', 'relateOto', paramsName, 'params'], params);

        if (fkAction.toLowerCase() === 'cascade') {
          let removeOto_res = await context.app.service(thereService).remove(
            lget(context, ['params', 'removeOto', paramsName, 'fkId'], fkId),
            {...customParams, relate_hook: 'removeOto', disableSoftDelete: true},
          );
          lset(context, ['params', 'removeOto', paramsName, 'removeOto_res'], removeOto_res);
        } else {
          let removeOto_res = await context.app.service(thereService).patch(
            lget(context, ['params', 'removeOto', paramsName, 'fkId'], fkId),
            lget(context, ['params', 'removeOto', paramsName, 'patchObj'], patchObj),
            {...customParams, relate_hook: 'removeOto', disableSoftDelete: true},
          );
          lset(context, ['params', 'removeOto', paramsName, 'removeOto_res'], removeOto_res);
        }

        await hookManagerRemoveOto.call({path: 'after'}, context, {paramsName});
      }
    }
    if (context.type === 'after') {
      await commitWithRetry(removeOtoError)(context);
    }
    return context;
  };
};

const relateOto = (
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
  return runTxnWithRetry(relateOtoFunc, {
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
  }, relateOtoError);
};

const removeOto = (
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
  return runTxnWithRetry(removeOtoFunc, {
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
  }, removeOtoError);
};

module.exports = {
  relateOto,
  removeOto,
};
