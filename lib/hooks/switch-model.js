// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

const {packages:{lodash: {lget, lset}}} = require('@iy4u/common-utils');
const {GeneralError} = require('@feathersjs/errors');

const connectMongoose = require('../connectMongoose');

// eslint-disable-next-line no-unused-vars
module.exports = ({setParamsMode = true, service, ...options} = {}) => {
  return async context => {
    try {
      let Model = service ? lget(context.app.service(service), 'options.Model') : lget(context, 'service.options.Model');
      if (Model) {
        // TODO: Remove this code when upgrade to Feathers v5.
        let modelParams = lget(context, 'params.adapter.Model');
        if (modelParams && modelParams.modelName === context.path && setParamsMode) {
          lset(context, 'service.options.Model', modelParams);
          return context;
        }

        // console.log('switching model', context.type, context.method, context.path, context.params);
        const instance = lget(options, 'instance', lget(context, 'params.core.instance'));
        let instanceId = lget(instance, '_id', lget(context, 'params.coreIds.inst'));

        let connection;
        if (instanceId === undefined) {
          let instanceName = lget(instance, 'name');
          if (instanceName && instanceName === lget(context.app.get('instances'), 'name', 'default')) {
            connection = context.app.get(`${instanceName}MongooseClient`);
            instanceId = instanceName;
          }
        } else {
          connection = context.app.get(`${instanceId}MongooseClient`);
        }

        // TODO: Not sure we need this. We should be setting this on server load and when an instance is created or updated.
        if (!connection) { // when you first create an instance, it has no connection, so we set that here
          let instance = lget(options, 'instance', lget(context, 'params.core.instance'));
          const config = lget(instance, 'settings.instances.mongo');
          if (config === undefined) {
            throw new GeneralError('We were not able to find your instance or mongo config', {instance, config});
          }
          connection = connectMongoose(context.app, `${instance._id}MongooseClient`, config);
        }

        let modelName = lget(Model, 'modelName', (service || context.path));

        const modelKeyName = `${instanceId}_${modelName}_model`;
        let instanceModel = context.app.get(modelKeyName);

        if (!instanceModel) {
          let schema = lget(Model, 'schema');

          // This is necessary to avoid model compilation errors in watch mode
          // see https://mongoosejs.com/docs/api/connection.html#connection_Connection-deleteModel
          if (connection.modelNames().includes(modelName)) {
            connection.deleteModel(modelName);
          }
          instanceModel = connection.model(modelName, schema);
          context.app.set(modelKeyName, instanceModel);
        }

        if (setParamsMode) {
          lset(context, 'params.adapter.Model', instanceModel);
          lset(context, 'service.options.Model', instanceModel);
          return context;
        }
        return instanceModel;
      }
    } catch (errors) {
      throw new GeneralError(`Error connecting model to service ${context.path}`, errors);
    }

    return context;
  };
};
