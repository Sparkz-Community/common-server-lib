const {handlePermissions} = require('./native-permissions');
const {packages:{lodash: {lget}}} = require('@iy4u/common-utils');

const {createdBy} = require('./created-by');
const {updatedBy} = require('./updated-by');
const getPermissionEntity = require('./get-permission-entity');

const handleCoreCreate = async context => {
  let {
    subject = context.params.user,
    subjectModel = 'users',
    addPermissions = ['own', 'manage', 'member'],
    removePermissions,
  } = lget(context, 'params.$core');
  const config = {subject, subjectModel, addPermissions, removePermissions};
  await handlePermissions(config)(createdBy(context));
  return context;
};

const handleCoreUpdate = async context => {
  let {
    subject = context.params.user,
    subjectModel = 'users',
    addPermissions = ['member'],
    removePermissions,
  } = lget(context, 'params.$core');
  const config = {subject, subjectModel, addPermissions, removePermissions};
  await handlePermissions(config)(updatedBy(context));
  return context;
};

//pass: clear
const checkCorePermission = ({context, subject, permissions = ['manage']}) => {
  getPermissionEntity(context);
  const {entity, model} = context.params;
  return permissions.some(key => {
    const permisionArrayOfObjectIDs = lget(subject, `nativePermissions.${model}.${key}`, []);
    const permisionArrayOfStrings = permisionArrayOfObjectIDs.map(objId => String(objId));
    const entityId = lget(entity, '_id');
    return permisionArrayOfStrings.includes(String(entityId));
  });
};
// TODO: add create, find, and get hooks for these
//pass: clear
const corePermissionsHook = ({subject} = {}) => {
  return async context => {
    const getSubject = async () => {
      if (subject) return subject;
      else {
        let id = context.id;
        if (id) {
          // const instance = lget(context.params, 'instance');
          try {
            return await context.app.service(context.path).get(id, context.params);
          } catch (e) {
            throw new Error(`Error: ${e}`);
          }
        }
        return undefined;
      }
    };

    const methods = {
      get: async () => {
        // let subject = await getSubject();
        // return checkCorePermission({ context, subject });
        return true;
      },
      find: async () => {
        return true;
      },
      create: async () => {
        return true;
      },
      patch: async () => {
        let subject = await getSubject();
        return checkCorePermission({context, subject});
      },
      update: async () => {
        let subject = await getSubject();
        return checkCorePermission({context, subject});
      },
      remove: async () => {
        let subject = await getSubject();
        return checkCorePermission({context, subject});
      },
    };

    let permission = await methods[context.method]();

    if (!permission) {
      throw new Error(`Permission to ${context.method} ${context.path} denied`);
    }

    return context;
  };
};

module.exports = {
  handleCoreUpdate,
  handleCoreCreate,
  getPermissionEntity,
  checkCorePermission,
  corePermissionsHook,
};
