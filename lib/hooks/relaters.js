/* eslint-disable no-unused-vars */
const {TransactionManager} = require('feathers-mongoose');
const beginTransaction = require('./beginTransaction');
const {FeathersError/*, GeneralError*/} = require('@feathersjs/errors');
const {packages: {lodash: {lget, lset, lomit, lisNil, lisEqual}}, HookSystem} = require('@iy4u/common-utils');

const checkContext = require('./checkContext');

function isEmpty(obj) {
  return Array.isArray(obj) ? obj.length :
    (obj // 👈 null and undefined check
      && Object.keys(obj).length === 0
      && Object.getPrototypeOf(obj) === Object.prototype);
}

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
    noTransaction = false,
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

    try {
      if (context.type === 'before') {
        if (!noTransaction) {
          let skipPath = lget(context, 'params.skipPath', []);
          let startTransactionOptions = lget(context, 'params.startTransactionOptions', {});
          await beginTransaction(context, {skipPath, startTransactionOptions});
        }
      }

      if (context.type === 'before' && context.method !== 'create') {
        let id = lget(context, 'id');
        let relateOto_res_before;

        if (!lisNil(id)) {
          relateOto_res_before = await context.service.get(id, {...addParams, disableSoftDelete: true});
        } else if (id === null) {
          relateOto_res_before = await context.service.find({
            ...context.params,
            ...addParams,
            paginate: false,
            disableSoftDelete: true,
          });
        }

        if (relateOto_res_before) lset(context, ['params', 'relateOto', paramsName, 'relateOto_res_before'], relateOto_res_before);
      } else if (context.type === 'after') {
        const hereData = lget(context, dataPath);

        if (Array.isArray(hereData)) {
          const relateOto_res_before = lget(context, `params.relateOto.${paramsName}.relateOto_res_before`, []);

          await Promise.all(hereData.map(async (record) => {
            const fkId = lget(record, herePath, []);
            const id = lget(record, idPath);
            let beforeRecord = relateOto_res_before.find(rec => lisEqual(lget(rec, idPath, 'recId'), id));
            let oldFkId;

            const notEmpty = !Array.isArray(fkId) ? !isEmpty(fkId) : !!fkId.length;
            // let runRelate = !lisNil(fkId) && !['{}', '[]'].includes(JSON.stringify(fkId));
            let runRelate = !lisNil(fkId) && notEmpty;

            if (runRelate && context.method !== 'create') {
              oldFkId = lget(beforeRecord, herePath);
              if (lisNil(beforeRecord)) {
                runRelate = false;
              } else {
                runRelate = !lisNil(oldFkId) && !lisEqual(oldFkId, fkId);
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

              lset(context, ['params', 'relateMtm', paramsName, 'params'], params);

              await hookManagerOto.call({path: 'before'}, context, {paramsName});

              const customParams = lget(context, ['params', 'relateMtm', paramsName, 'params'], params);

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
          }));
        } else {
          const fkId = lget(hereData, herePath);
          const id = lget(hereData, idPath, context.id);
          let oldFkId;

          const notEmpty = !Array.isArray(fkId) ? !isEmpty(fkId) : !!fkId.length;
          // let runRelate = !lisNil(fkId) && !['{}', '[]'].includes(JSON.stringify(fkId));
          let runRelate = !lisNil(fkId) && notEmpty;

          if (runRelate && context.method !== 'create') {
            oldFkId = lget(context, `params.relateOto.${paramsName}.relateOto_res_before.${herePath}`);
            if (lisNil(lget(context, `params.relateOto.${paramsName}.relateOto_res_before`))) {
              runRelate = false;
            } else {
              runRelate = !lisNil(oldFkId) && !lisEqual(oldFkId, fkId);
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

            lset(context, ['params', 'relateMtm', paramsName, 'params'], params);

            await hookManagerOto.call({path: 'before'}, context, {paramsName});

            const customParams = lget(context, ['params', 'relateMtm', paramsName, 'params'], params);

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
      }

      if (context.type === 'after') {
        if (!noTransaction) {
          await TransactionManager.commitTransaction(context);
        }
      }
    } catch (err) {
      lset(context, ['params', 'relateOto', paramsName, 'Error'], err);
      await hookManagerOto.call({path: 'error'}, context, {err, paramsName});

      if (!lget(context, ['params', 'relateOto', paramsName, 'skipError'], false)) {
        if (!noTransaction) {
          await TransactionManager.rollbackTransaction(context);
        }
        throw new relateOtoError(err.message, err);
      }
    }
    return context;
  };
};

/* 4 things removeOto hook must handle:
  1. Cascade delete.
  2. If Allow null set to null or unset
  3. Stop and don't allow action to happen.
  4. switch relationship to some other record.
*/
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
    noTransaction = false,
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

    try {
      if (context.type === 'before') {
        if (!noTransaction) {
          let skipPath = lget(context, 'params.skipPath', []);
          let startTransactionOptions = lget(context, 'params.startTransactionOptions', {});
          await beginTransaction(context, {skipPath, startTransactionOptions});
        }
      }

      if (context.type === 'after') {
        const hereData = lget(context, dataPath);

        if (Array.isArray(hereData)) {
          await Promise.all(hereData.map(async (record) => {
            const fkId = lget(record, herePath, []);
            const id = lget(record, idPath);

            const notEmpty = !Array.isArray(fkId) ? !isEmpty(fkId) : !!fkId.length;
            // let runRelate = !lisNil(fkId) && !['{}', '[]'].includes(JSON.stringify(fkId));
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

              lset(context, ['params', 'relateMtm', paramsName, 'params'], params);

              await hookManagerRemoveOto.call({path: 'before'}, context, {paramsName});

              const customParams = lget(context, ['params', 'relateMtm', paramsName, 'params'], params);

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
          }));
        } else {
          const fkId = lget(hereData, herePath);
          const id = lget(hereData, idPath, context.id);

          const notEmpty = !Array.isArray(fkId) ? !isEmpty(fkId) : !!fkId.length;
          // let runRelate = !lisNil(fkId) && !['{}', '[]'].includes(JSON.stringify(fkId));
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

            lset(context, ['params', 'relateMtm', paramsName, 'params'], params);

            await hookManagerRemoveOto.call({path: 'before'}, context, {paramsName});

            const customParams = lget(context, ['params', 'relateMtm', paramsName, 'params'], params);

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
      }

      if (context.type === 'after') {
        if (!noTransaction) {
          await TransactionManager.commitTransaction(context);
        }
      }
    } catch (err) {
      lset(context, ['params', 'removeOto', paramsName, 'Error'], err);
      await hookManagerRemoveOto.call({path: 'error'}, context, {err, paramsName});

      if (!lget(context, ['params', 'removeOto', paramsName, 'skipError'], false)) {
        if (!noTransaction) {
          await TransactionManager.rollbackTransaction(context);
        }
        throw new removeOtoError(err.message, err);
      }
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
    noTransaction = false,
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

    try {
      if (context.type === 'before') {
        if (!noTransaction) {
          let skipPath = lget(context, 'params.skipPath', []);
          let startTransactionOptions = lget(context, 'params.startTransactionOptions', {});
          await beginTransaction(context, {skipPath, startTransactionOptions});
        }
      }

      if (context.type === 'before' && context.method !== 'create') {
        let id = lget(context, 'id');
        let relateMtm_res_before;

        if (!lisNil(id)) {
          relateMtm_res_before = await context.service.get(id, {...addParams, disableSoftDelete: true});
        } else if (id === null) {
          relateMtm_res_before = await context.service.find({
            ...context.params,
            ...addParams,
            paginate: false,
            disableSoftDelete: true,
          });
        }

        if (relateMtm_res_before) lset(context, ['params', 'relateMtm', paramsName, 'relateMtm_res_before'], relateMtm_res_before);
      } else if (context.type === 'after') {
        const hereData = lget(context, dataPath);

        if (Array.isArray(hereData)) {
          const relateMtm_res_before = lget(context, `params.relateMtm.${paramsName}.relateMtm_res_before`, []);

          await Promise.all(hereData.map(async (record) => {
            const fkIds = lget(record, herePath, []);
            const id = lget(record, idPath);
            let beforeRecord = relateMtm_res_before.find(rec => lisEqual(lget(rec, idPath, 'recId'), id));
            let oldFkIds = lget(beforeRecord, herePath, []);
            let newFkIds;
            let removedFkIds;

            let runRelate = !lisNil(fkIds) && (fkIds.length !== oldFkIds.length || !lisEqual(fkIds, oldFkIds));

            if (runRelate && context.method !== 'create') {
              if (lisNil(lget(context, `params.relateMtm.${paramsName}.relateMtm_res_before`))) {
                runRelate = false;
              } else {
                let fkIdsMap = fkIds.map(fkId => fkId);
                removedFkIds = oldFkIds.reduce((acc, oldFkId) => {
                  if (fkIdsMap.every(fkId => !lisEqual(oldFkId, fkId))) {
                    acc.push(oldFkId);
                  }
                  return acc;
                }, []);

                let oldFkIdsMap = oldFkIds.map(oldFkId => oldFkId);
                newFkIds = fkIds.reduce((acc, fkId) => {
                  if (oldFkIdsMap.every(oldFkId => !lisEqual(fkId, oldFkId))) {
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
          }));
        } else {
          const fkIds = lget(hereData, herePath, []);
          const id = lget(hereData, idPath, context.id);
          let oldFkIds = lget(context, `params.relateMtm.${paramsName}.relateMtm_res_before.${herePath}`, []);
          let newFkIds;
          let removedFkIds;

          let runRelate = !lisNil(fkIds) && (fkIds.length !== oldFkIds.length || !lisEqual(fkIds, oldFkIds));

          if (runRelate && context.method !== 'create') {
            if (lisNil(lget(context, `params.relateMtm.${paramsName}.relateMtm_res_before`))) {
              runRelate = false;
            } else {
              let fkIdsMap = fkIds.map(fkId => fkId);
              removedFkIds = oldFkIds.reduce((acc, oldFkId) => {
                if (fkIdsMap.every(fkId => !lisEqual(oldFkId, fkId))) {
                  acc.push(oldFkId);
                }
                return acc;
              }, []);

              let oldFkIdsMap = oldFkIds.map(oldFkId => oldFkId);
              newFkIds = fkIds.reduce((acc, fkId) => {
                if (oldFkIdsMap.every(oldFkId => !lisEqual(fkId, oldFkId))) {
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
      }

      if (context.type === 'after') {
        if (!noTransaction) {
          await TransactionManager.commitTransaction(context);
        }
      }
    } catch (err) {
      lset(context, ['params', 'relateMtm', paramsName, 'Error'], err);
      await hookManagerMtm.call({path: 'error'}, context, {err, paramsName});

      if (!lget(context, ['params', 'relateMtm', paramsName, 'skipError'], false)) {
        if (!noTransaction) {
          await TransactionManager.rollbackTransaction(context);
        }
        throw new relateMtmError(err.message, err);
      }
    }
    return context;
  };
};

/*
* pull id from parents list of fkIds.
* */
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
    noTransaction = false,
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

    try {
      if (context.type === 'before') {
        if (!noTransaction) {
          let skipPath = lget(context, 'params.skipPath', []);
          let startTransactionOptions = lget(context, 'params.startTransactionOptions', {});
          await beginTransaction(context, {skipPath, startTransactionOptions});
        }
      }

      if (context.type === 'after') {
        const hereData = lget(context, dataPath);

        if (Array.isArray(hereData)) {
          await Promise.all(hereData.map(async (record) => {
            const fkIds = lget(record, herePath, []);
            const id = lget(record, idPath);

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

              lset(context, ['params', 'relateMtm', paramsName, 'params'], params);

              await hookManagerRemoveMtm.call({path: 'before'}, context, {paramsName});

              const customParams = lget(context, ['params', 'relateMtm', paramsName, 'params'], params);

              if (!lisNil(lget(context, ['params', 'removeMtm', paramsName, 'fkIds'], fkIds)) && lget(context, ['params', 'removeMtm', paramsName, 'fkIds'], fkIds).length) {
                let relateMtm_res = await context.app.service(thereService).patch(
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
                lset(context, ['params', 'removeMtm', paramsName, 'relateMtm_res'], relateMtm_res);
              }

              await hookManagerRemoveMtm.call({path: 'after'}, context, {paramsName});
            }
          }));
        } else {
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

            lset(context, ['params', 'relateMtm', paramsName, 'params'], params);

            await hookManagerRemoveMtm.call({path: 'before'}, context, {paramsName});

            const customParams = lget(context, ['params', 'relateMtm', paramsName, 'params'], params);

            if (!lisNil(lget(context, ['params', 'removeMtm', paramsName, 'fkIds'], fkIds)) && lget(context, ['params', 'removeMtm', paramsName, 'fkIds'], fkIds).length) {
              let relateMtm_res = await context.app.service(thereService).patch(
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
              lset(context, ['params', 'removeMtm', paramsName, 'relateMtm_res'], relateMtm_res);
            }

            await hookManagerRemoveMtm.call({path: 'after'}, context, {paramsName});
          }
        }
      }

      if (context.type === 'after') {
        if (!noTransaction) {
          await TransactionManager.commitTransaction(context);
        }
      }
    } catch (err) {
      lset(context, ['params', 'removeMtm', paramsName, 'Error'], err);
      await hookManagerRemoveMtm.call({path: 'error'}, context, {err, paramsName});

      if (!lget(context, ['params', 'removeMtm', paramsName, 'skipError'], false)) {
        if (!noTransaction) {
          await TransactionManager.rollbackTransaction(context);
        }
        throw new removeMtmError(err.message, err);
      }
    }
    return context;
  };
};

// TO put on the service 'here' with the one and be related to the service 'there' with the many array
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
    noTransaction = false,
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

    try {
      if (context.type === 'before') {
        if (!noTransaction) {
          let skipPath = lget(context, 'params.skipPath', []);
          let startTransactionOptions = lget(context, 'params.startTransactionOptions', {});
          await beginTransaction(context, {skipPath, startTransactionOptions});
        }
      }

      if (context.type === 'before' && context.method !== 'create') {
        let id = lget(context, 'id');
        let relateOtm_res_before;

        if (!lisNil(id)) {
          relateOtm_res_before = await context.service.get(id, {...addParams, disableSoftDelete: true});
        } else if (id === null) {
          relateOtm_res_before = await context.service.find({
            ...context.params,
            ...addParams,
            paginate: false,
            disableSoftDelete: true,
          });
        }

        if (relateOtm_res_before) lset(context, ['params', 'relateOtm', paramsName, 'relateOtm_res_before'], relateOtm_res_before);
      } else if (context.type === 'after') {
        const hereData = lget(context, dataPath);

        if (Array.isArray(hereData)) {
          const relateOtm_res_before = lget(context, `params.relateOtm.${paramsName}.relateOtm_res_before`, []);

          await Promise.all(hereData.map(async (record) => {
            const fkId = lget(record, herePath, []);
            const id = lget(record, idPath);
            let beforeRecord = relateOtm_res_before.find(rec => lisEqual(lget(rec, idPath, 'recId'), id));
            let oldFkId;

            const notEmpty = !Array.isArray(fkId) ? !isEmpty(fkId) : !!fkId.length;
            // let runRelate = !lisNil(fkId) && !['{}', '[]'].includes(JSON.stringify(fkId));
            let runRelate = notEmpty;

            if (runRelate && context.method !== 'create') {
              oldFkId = lget(beforeRecord, herePath);
              if (lisNil(beforeRecord)) {
                runRelate = false;
              } else {
                runRelate = !lisEqual(oldFkId, fkId);
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

              lset(context, ['params', 'relateMtm', paramsName, 'params'], params);

              await hookManagerOtm.call({path: 'before'}, context, {paramsName});

              const customParams = lget(context, ['params', 'relateMtm', paramsName, 'params'], params);

              if (!lisNil(lget(context, ['params', 'relateOtm', paramsName, 'fkId'], fkId))) {
                let relateOtm_res = await context.app.service(thereService).patch(
                  lget(context, ['params', 'relateOtm', paramsName, 'fkId'], fkId),
                  lget(context, ['params', 'relateOtm', paramsName, 'patchObj'], patchObj),
                  {...customParams, relate_hook: 'relateOtm', disableSoftDelete: true},
                );
                lset(context, ['params', 'relateOtm', paramsName, 'relateOtm_res'], relateOtm_res);
              }

              if (context.method !== 'create') {
                let oldFkPayload = {};
                lset(oldFkPayload, ['$pull', therePath], id);

                await context.app.service(thereService).patch(
                  lget(context, ['params', 'relateOtm', paramsName, 'oldFkId'], oldFkId),
                  oldFkPayload,
                  {
                    ...customParams,
                    relate_hook: 'relateOtm',
                    disableSoftDelete: true,
                  },
                );
              }

              await hookManagerOtm.call({path: 'after'}, context, {paramsName});
            }
          }));
        } else {
          const fkId = lget(hereData, herePath);
          const id = lget(hereData, idPath, context.id);
          let oldFkId;

          const notEmpty = !Array.isArray(fkId) ? !isEmpty(fkId) : !!fkId.length;
          // let runRelate = !lisNil(fkId) && !['{}', '[]'].includes(JSON.stringify(fkId));
          let runRelate = notEmpty;

          if (runRelate && context.method !== 'create') {
            oldFkId = lget(context, `params.relateOtm.${paramsName}.relateOtm_res_before.${herePath}`);
            if (lisNil(lget(context, `params.relateOtm.${paramsName}.relateOtm_res_before`))) {
              runRelate = false;
            } else {
              runRelate = !lisEqual(oldFkId, fkId);
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

            lset(context, ['params', 'relateMtm', paramsName, 'params'], params);

            await hookManagerOtm.call({path: 'before'}, context, {paramsName});

            const customParams = lget(context, ['params', 'relateMtm', paramsName, 'params'], params);

            if (!lisNil(lget(context, ['params', 'relateOtm', paramsName, 'fkId'], fkId))) {
              let relateOtm_res = await context.app.service(thereService).patch(
                lget(context, ['params', 'relateOtm', paramsName, 'fkId'], fkId),
                lget(context, ['params', 'relateOtm', paramsName, 'patchObj'], patchObj),
                {...customParams, relate_hook: 'relateOtm', disableSoftDelete: true},
              );
              lset(context, ['params', 'relateOtm', paramsName, 'relateOtm_res'], relateOtm_res);
            }

            if (!lisNil(lget(context, ['params', 'relateOtm', paramsName, 'oldFkId'], oldFkId)) && context.method !== 'create') {
              let oldFkPayload = {};
              lset(oldFkPayload, ['$pull', therePath], id);

              await context.app.service(thereService).patch(
                lget(context, ['params', 'relateOtm', paramsName, 'oldFkId'], oldFkId),
                oldFkPayload,
                {
                  ...customParams,
                  relate_hook: 'relateOtm',
                  disableSoftDelete: true,
                },
              );
            }

            await hookManagerOtm.call({path: 'after'}, context, {paramsName});
          }
        }
      }

      if (context.type === 'after') {
        if (!noTransaction) {
          await TransactionManager.commitTransaction(context);
        }
      }
    } catch (err) {
      lset(context, ['params', 'relateOtm', paramsName, 'Error'], err);
      await hookManagerOtm.call({path: 'error'}, context, {err, paramsName});

      if (!lget(context, ['params', 'relateOtm', paramsName, 'skipError'], false)) {
        if (!noTransaction) {
          await TransactionManager.rollbackTransaction(context);
        }
        throw new relateOtmError(err.message, err);
      }
    }
    return context;
  };
};

/*
* pull id from parent list of fkIds.
* */
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
    noTransaction = false,
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

    try {
      if (context.type === 'before') {
        if (!noTransaction) {
          let skipPath = lget(context, 'params.skipPath', []);
          let startTransactionOptions = lget(context, 'params.startTransactionOptions', {});
          await beginTransaction(context, {skipPath, startTransactionOptions});
        }
      }

      if (context.type === 'after') {
        const hereData = lget(context, dataPath);

        if (Array.isArray(hereData)) {
          await Promise.all(hereData.map(async (record) => {
            const fkId = lget(record, herePath, []);
            const id = lget(record, idPath);

            const notEmpty = !Array.isArray(fkId) ? !isEmpty(fkId) : !!fkId.length;
            // let runRelate = !lisNil(fkId) && !['{}', '[]'].includes(JSON.stringify(fkId));
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

              lset(context, ['params', 'relateMtm', paramsName, 'params'], params);

              await hookManagerRemoveOtm.call({path: 'before'}, context, {paramsName});

              const customParams = lget(context, ['params', 'relateMtm', paramsName, 'params'], params);

              let removeOtm_res = await context.app.service(thereService).patch(
                lget(context, ['params', 'removeOtm', paramsName, 'fkId'], fkId),
                lget(context, ['params', 'removeOtm', paramsName, 'patchObj'], patchObj),
                {...customParams, relate_hook: 'removeOtm', disableSoftDelete: true},
              );
              lset(context, ['params', 'removeOtm', paramsName, 'removeOtm_res'], removeOtm_res);

              await hookManagerRemoveOtm.call({path: 'after'}, context, {paramsName});
            }
          }));
        } else {
          const fkId = lget(hereData, herePath);
          const id = lget(hereData, idPath, context.id);

          const notEmpty = !Array.isArray(fkId) ? !isEmpty(fkId) : !!fkId.length;
          // let runRelate = !lisNil(fkId) && !['{}', '[]'].includes(JSON.stringify(fkId));
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

            lset(context, ['params', 'relateMtm', paramsName, 'params'], params);

            await hookManagerRemoveOtm.call({path: 'before'}, context, {paramsName});

            const customParams = lget(context, ['params', 'relateMtm', paramsName, 'params'], params);

            let removeOtm_res = await context.app.service(thereService).patch(
              lget(context, ['params', 'removeOtm', paramsName, 'fkId'], fkId),
              lget(context, ['params', 'removeOtm', paramsName, 'patchObj'], patchObj),
              {...customParams, relate_hook: 'removeOtm', disableSoftDelete: true},
            );
            lset(context, ['params', 'removeOtm', paramsName, 'removeOtm_res'], removeOtm_res);

            await hookManagerRemoveOtm.call({path: 'after'}, context, {paramsName});
          }
        }
      }

      if (context.type === 'after') {
        if (!noTransaction) {
          await TransactionManager.commitTransaction(context);
        }
      }
    } catch (err) {
      lset(context, ['params', 'removeOtm', paramsName, 'Error'], err);
      await hookManagerRemoveOtm.call({path: 'error'}, context, {err, paramsName});

      if (!lget(context, ['params', 'removeOtm', paramsName, 'skipError'], false)) {
        if (!noTransaction) {
          await TransactionManager.rollbackTransaction(context);
        }
        throw new removeOtmError(err.message, err);
      }
    }
    return context;
  };
};

module.exports = {
  relateOto,
  removeOto,
  relateMtm,
  removeMtm,
  relateOtm,
  removeOtm,
};
