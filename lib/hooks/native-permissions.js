// const {packages:{lodash: {lget}}} = require('@iy4u/common-utils');
const getPermissionEntity = require('./get-permission-entity');
const {packages:{lodash: {lget, lset}}} = require('@iy4u/common-utils');


const handlePermissions = ({addPermissions, removePermissions}) => {
  return context => {
    getPermissionEntity(context);
    const {entity, model} = context.params;

    if (entity) {
      const isObject = (typeof entity === 'object' && true);
      let id = isObject ? lget(entity, '_id') : typeof String(entity) === 'string' ? entity : undefined;

      if (id) {
        if (addPermissions) {
          addPermissions.forEach(key => {
            if (context.method === 'create') {
              lset(context.data, `nativePermissions.${model}.${key}`, [id]);
            } else {
              lset(context.data, ['$addToSet', `nativePermissions.${model}.${key}`], id);
            }
          });
        }
        if (removePermissions) {
          removePermissions.forEach(key => {
            lset(context.data, ['$pull', `nativePermissions.${model}.${key}`], id);
          });
        }

      }

    }
    return context;
  };
};

module.exports = {
  handlePermissions,
};
