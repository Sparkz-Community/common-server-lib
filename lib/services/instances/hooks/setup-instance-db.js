const {packages: {lodash: {lget, lset}, axios}} = require('@iy4u/common-utils');
const {NotAuthenticated, BadRequest} = require('@feathersjs/errors');

const {generateDefaultInstance} = require('../../../utils');

const makeConnectionSiblingUrl = (parentURL, username, password) => {
  // mongodb+srv://common-server-lib-example:common-server-lib-example@dev0.jqbzk.mongodb.net/common-server-lib-example?replicaSet=atlas-b13tbl-shard-0&readPreference=primary&connectTimeoutMS=10000&authSource=admin&authMechanism=SCRAM-SHA-1
  const clean = parentURL.split('?')[0]; // remove options from uri
  // mongodb+srv://common-server-lib-example:common-server-lib-example@dev0.jqbzk.mongodb.net/common-server-lib-example
  const oldDBArray = clean.split('/'); // separate it by / so you can replace DB by new one
  // [mongodb+srv:/]/[common-server-lib-example:common-server-lib-example@dev0.jqbzk.mongodb.net]/[common-server-lib-example]
  const oldDB = oldDBArray[oldDBArray.length - 1];
  //2
  const beta = clean.replace(new RegExp(oldDB, 'g'), username); // replace username and database (temporarily have username as placeholder for password)
  // mongodb+srv://username:username@dev0.jqbzk.mongodb.net/username
  const betaArray = beta.split('@'); // isolate cluster and database from the auth part
  //  [mongodb+srv://username:username]@[dev0.jqbzk.mongodb.net/username]
  const demoArray = betaArray[0].split(':'); // split by : so you can replace temporary password with desired one
  // [mongodb+srv]:[//username]:[username]
  demoArray.pop(); // remove temporary password
  // [mongodb+srv]:[//username]:
  demoArray.push(password); // add desired password
  // [mongodb+srv]:[//username]:[password]
  // RECONSTRUCT CONNECTION STRING
  if (parentURL.split('?')[1]) {
    return `${demoArray.join(':')}@${betaArray[1]}?${parentURL.split('?')[1]}`;
    // mongodb+srv://username:password@dev0.jqbzk.mongodb.net/username?replicaSet=atlas-b13tbl-shard-0&readPreference=primary&connectTimeoutMS=10000&authSource=admin&authMechanism=SCRAM-SHA-1
  }
  // mongodb+srv://username:password@dev0.jqbzk.mongodb.net/username
  return `${demoArray.join(':')}@${betaArray[1]}`;
};

// eslint-disable-next-line no-unused-vars
module.exports = async context => {

  const projectInstanceName = lget(generateDefaultInstance(context.app), 'name');

  const connectionStringOnService = lget(context.service, ['options', 'Model', 'db', '_connectionString']);
  const projectConnectionString = lget(context.app.get('mongo'), 'uri');

  if (lget(context.data, 'name') !== projectInstanceName && connectionStringOnService === projectConnectionString) {

    const {url, atlas} = context.app.get('seawolf');

    // const $client = process.NODE_ENV === 'production' ? JSON.stringify({clusterEnv: 'prod'}) : JSON.stringify({clusterEnv: 'dev'});
    const {data: {accessToken}} = await axios.post(`${url}/authentication`, {
      'strategy': 'local',
      ...atlas,
    },
    ).catch(errors => {
      console.log('_______________________________________________');
      throw new BadRequest('Seawolf Authentication Error: ', {
        errors,
      });
    });

    // create new dB remotely
    const response = await axios.post(`${url}/create-atlas-database-user`, {
      username: context.data.name,
    }, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
      // params: {$client}
    }).catch(errors => {
      console.log('_______________________________________________');
      throw new NotAuthenticated({
        errors,
      });
    });

    const username = lget(response, 'data.username');
    const password = lget(response, 'data.password');
    if (username && password) {
      const instanceMongo = JSON.parse(JSON.stringify(context.app.settings.mongo));
      // const uri = makeConnectionSiblingUrl(instanceMongo.uri, username, password);
      const seawolfPassword = lget(atlas, 'password');
      const uri = makeConnectionSiblingUrl(instanceMongo.uri, username, password.replace(seawolfPassword, ''));
      const options = context.app.get('mongo').options;
      lset(context, 'data.settings.instances', {mongo: {uri, options: {...options, ...instanceMongo.options}}});
    }

  }
  return context;
};
