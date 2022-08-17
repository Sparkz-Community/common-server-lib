const mongoose = require('mongoose');
const tunnel = require('tunnel-ssh');
const {packages:{lodash: {lget, lomitBy, lisNil}}, logger} = require('@iy4u/common-utils');

logger.level = process.env.NODE_ENV === 'production' ? 'info' : 'debug';

module.exports = function (app, mongoConfigName, mongoConfig={}) {
  mongoose.set('debug', process.env.NODE_ENV !== 'production');
  // const mongoConfig = app.get('mongo');
  let uri = '';
  let options = {
    // bufferCommands?: boolean;
    // /** The name of the database you want to use. If not provided, Mongoose uses the database name from connection string. */
    // dbName?: string;
    // /** username for authentication, equivalent to `options.auth.user`. Maintained for backwards compatibility. */
    // user?: string;
    // /** password for authentication, equivalent to `options.auth.password`. Maintained for backwards compatibility. */
    // pass?: string;
    // /** Set to false to disable automatic index creation for all models associated with this connection. */
    // autoIndex?: boolean;
    // /** Set to `true` to make Mongoose automatically call `createCollection()` on every model created on this connection. */
    // autoCreate?: boolean;

    // /** Specifies the name of the replica set, if the mongod is a member of a replica set. */
    // replicaSet?: string;
    // /** Enables or disables TLS/SSL for the connection. */
    // tls?: boolean;
    // /** A boolean to enable or disables TLS/SSL for the connection. (The ssl option is equivalent to the tls option.) */
    // ssl?: boolean;
    // /** Specifies the location of a local TLS Certificate */
    // tlsCertificateFile?: string;
    // /** Specifies the location of a local .pem file that contains either the client's TLS/SSL certificate and key or only the client's TLS/SSL key when tlsCertificateFile is used to provide the certificate. */
    // tlsCertificateKeyFile?: string;
    // /** Specifies the password to de-crypt the tlsCertificateKeyFile. */
    // tlsCertificateKeyFilePassword?: string;
    // /** Specifies the location of a local .pem file that contains the root certificate chain from the Certificate Authority. This file is used to validate the certificate presented by the mongod/mongos instance. */
    // tlsCAFile?: string;
    // /** Bypasses validation of the certificates presented by the mongod/mongos instance */
    // tlsAllowInvalidCertificates?: boolean;
    // /** Disables hostname validation of the certificate presented by the mongod/mongos instance. */
    // tlsAllowInvalidHostnames?: boolean;
    // /** Disables various certificate validations. */
    // tlsInsecure?: boolean;
    // /** The time in milliseconds to attempt a connection before timing out. */
    // connectTimeoutMS?: number;
    // /** The time in milliseconds to attempt a send or receive on a socket before the attempt times out. */
    // socketTimeoutMS?: number;
    // /** An array or comma-delimited string of compressors to enable network compression for communication between this client and a mongod/mongos instance. */
    // compressors?: CompressorName[] | string;
    // /** An integer that specifies the compression level if using zlib for network compression. */
    // zlibCompressionLevel?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | undefined;
    // /** The maximum number of hosts to connect to when using an srv connection string, a setting of `0` means unlimited hosts */
    // srvMaxHosts?: number;
    // /**
    //  * Modifies the srv URI to look like:
    //  *
    //  * `_{srvServiceName}._tcp.{hostname}.{domainname}`
    //  *
    //  * Querying this DNS URI is expected to respond with SRV records
    //  */
    // srvServiceName?: string;
    // /** The maximum number of connections in the connection pool. */
    // maxPoolSize?: number;
    // /** The minimum number of connections in the connection pool. */
    // minPoolSize?: number;
    // /** The maximum number of milliseconds that a connection can remain idle in the pool before being removed and closed. */
    // maxIdleTimeMS?: number;
    // /** The maximum time in milliseconds that a thread can wait for a connection to become available. */
    // waitQueueTimeoutMS?: number;
    // /** Specify a read concern for the collection (only MongoDB 3.2 or higher supported) */
    // readConcern?: ReadConcernLike;
    // /** The level of isolation */
    // readConcernLevel?: ReadConcernLevel;
    // /** Specifies the read preferences for this connection */
    // readPreference?: ReadPreferenceMode | ReadPreference;
    // /** Specifies, in seconds, how stale a secondary can be before the client stops using it for read operations. */
    // maxStalenessSeconds?: number;
    // /** Specifies the tags document as a comma-separated list of colon-separated key-value pairs.  */
    // readPreferenceTags?: TagSet[];
    // /** The auth settings for when connection to server. */
    // auth?: Auth;
    // /** Specify the database name associated with the user’s credentials. */
    // authSource?: string;
    // /** Specify the authentication mechanism that MongoDB will use to authenticate the connection. */
    // authMechanism?: AuthMechanism;
    // /** Specify properties for the specified authMechanism as a comma-separated list of colon-separated key-value pairs. */
    // authMechanismProperties?: AuthMechanismProperties;
    // /** The size (in milliseconds) of the latency window for selecting among multiple suitable MongoDB instances. */
    // localThresholdMS?: number;
    // /** Specifies how long (in milliseconds) to block for server selection before throwing an exception.  */
    // serverSelectionTimeoutMS?: number;
    // /** heartbeatFrequencyMS controls when the driver checks the state of the MongoDB deployment. Specify the interval (in milliseconds) between checks, counted from the end of the previous check until the beginning of the next one. */
    // heartbeatFrequencyMS?: number;
    // /** Sets the minimum heartbeat frequency. In the event that the driver has to frequently re-check a server's availability, it will wait at least this long since the previous check to avoid wasted effort. */
    // minHeartbeatFrequencyMS?: number;
    // /** The name of the application that created this MongoClient instance. MongoDB 3.4 and newer will print this value in the server log upon establishing each connection. It is also recorded in the slow query log and profile collections */
    // appName?: string;
    // /** Enables retryable reads. */
    // retryReads?: boolean;
    // /** Enable retryable writes. */
    // retryWrites?: boolean;
    // /** Allow a driver to force a Single topology type with a connection string containing one host */
    // directConnection?: boolean;
    // /** Instruct the driver it is connecting to a load balancer fronting a mongos like service */
    // loadBalanced?: boolean;
    // /** The write concern w value */
    // w?: W;
    // /** The write concern timeout */
    // wtimeoutMS?: number;
    // /** The journal write concern */
    // journal?: boolean;
    // /** Validate mongod server certificate against Certificate Authority */
    // sslValidate?: boolean;
    // /** SSL Certificate file path. */
    // sslCA?: string;
    // /** SSL Certificate file path. */
    // sslCert?: string;
    // /** SSL Key file file path. */
    // sslKey?: string;
    // /** SSL Certificate pass phrase. */
    // sslPass?: string;
    // /** SSL Certificate revocation list file path. */
    // sslCRL?: string;
    // /** TCP Connection no delay */
    // noDelay?: boolean;
    // /** TCP Connection keep alive enabled */
    // keepAlive?: boolean;
    // /** The number of milliseconds to wait before initiating keepAlive on the TCP socket */
    // keepAliveInitialDelay?: number;
    // /** Force server to assign `_id` values instead of driver */
    // forceServerObjectId?: boolean;
    // /** Return document results as raw BSON buffers */
    // raw?: boolean;
    // /** A primary key factory function for generation of custom `_id` keys */
    // pkFactory?: PkFactory;
    // /** A Promise library class the application wishes to use such as Bluebird, must be ES6 compatible */
    // promiseLibrary?: any;
    // /** The logging level */
    // loggerLevel?: LoggerLevel;
    // /** Custom logger object */
    // logger?: Logger;
    // /** Enable command monitoring for this client */
    // monitorCommands?: boolean;
    // /** Server API version */
    // serverApi?: ServerApi | ServerApiVersion;
    // /**
    //  * Optionally enable client side auto encryption
    //  *
    //  * @remarks
    //  *  Automatic encryption is an enterprise only feature that only applies to operations on a collection. Automatic encryption is not supported for operations on a database or view, and operations that are not bypassed will result in error
    //  *  (see [libmongocrypt: Auto Encryption Allow-List](https://github.com/mongodb/specifications/blob/master/source/client-side-encryption/client-side-encryption.rst#libmongocrypt-auto-encryption-allow-list)). To bypass automatic encryption for all operations, set bypassAutoEncryption=true in AutoEncryptionOpts.
    //  *
    //  *  Automatic encryption requires the authenticated user to have the [listCollections privilege action](https://docs.mongodb.com/manual/reference/command/listCollections/#dbcmd.listCollections).
    //  *
    //  *  If a MongoClient with a limited connection pool size (i.e a non-zero maxPoolSize) is configured with AutoEncryptionOptions, a separate internal MongoClient is created if any of the following are true:
    //  *  - AutoEncryptionOptions.keyVaultClient is not passed.
    //  *  - AutoEncryptionOptions.bypassAutomaticEncryption is false.
    //  *
    //  * If an internal MongoClient is created, it is configured with the same options as the parent MongoClient except minPoolSize is set to 0 and AutoEncryptionOptions is omitted.
    //  */
    // autoEncryption?: AutoEncryptionOptions;
    // /** Allows a wrapping driver to amend the client metadata generated by the driver to include information about the wrapping driver */
    // driverInfo?: DriverInfo;
    // /* Excluded from this release type: srvPoller */
    // /* Excluded from this release type: connectionType */

    // /** Return BSON filled buffers from operations */
    // raw?: boolean;

  };

  // if (mongoConfig.useUnifiedTopology) {
  //   console.log('Here!');
  //   options.autoReconnect = true; // DeprecationWarning: The option `autoReconnect` is incompatible with the unified topology, please read more by visiting http://bit.ly/2D8WfT6
  //   options.reconnectTries = 30; // DeprecationWarning: The option `reconnectTries` is incompatible with the unified topology, please read more by visiting http://bit.ly/2D8WfT6
  //   options.reconnectInterval = 1000; // DeprecationWarning: The option `reconnectInterval` is incompatible with the unified topology, please read more by visiting http://bit.ly/2D8WfT6
  //   options.bufferMaxEntries = -1; // DeprecationWarning: The option `bufferMaxEntries` is incompatible with the unified topology, please read more by visiting http://bit.ly/2D8WfT6
  // }


  if (lget(mongoConfig,'uri')) {
    uri = mongoConfig.uri;
  }


  // options.loggerLevel = process.env.NODE_ENV === 'production' ? 'info' : 'debug';
  // options.logger = function (collectionName, methodName, ...methodArgs) {
  //   logger[process.env.NODE_ENV === 'production' ? 'info' : 'debug'](`${collectionName}.${methodName}(${methodArgs.join(', ')})`);
  // };
  options = lomitBy({...options, ...mongoConfig.options}, lisNil);

  if (mongoConfig.tunnelMongo) {
    tunnel(mongoConfig.tunnel, (error) => {
      if (error) {
        logger.error('SSH tunnel connection for MongoDB via SSH host - ' + mongoConfig.tunnel.host + error);
        process.exit(1);
      } else {
        logger.info('SSH tunnel ready for MongoDB via SSH host - ' + mongoConfig.tunnel.host);
      }
    });
  }
  logger.debug('mongo uri - ' + uri);
  let conn;


  try {
    conn = mongoose.createConnection(uri, options, (callbackError) => {
      if (callbackError) {
        logger.error({uri, options});
        logger.error('ERROR (mongoose connect callback error): ' + callbackError);
      }
    });

    // conn.on('connected', () => {
    //   logger.info('Connection to mongoDB now connected!');
    // });
    conn.on('open', () => {
      if (lget(mongoose, 'connections', []).some(connection => connection._connectionString === uri && connection.readyState === 1)) {
        logger.info('Successfully connected to mongoDB :)');
      }
      logger.info('Connection to mongoDB now open!');
    });
    conn.on('disconnected', () => {
      logger.log('warn', 'Mongo connection disconnected :/');
    });
    conn.on('error', (err) => {
      logger.error('ERROR (mongo error): ' + err);
    });
    conn.on('reconnectFailed', () => {
      process.nextTick(() => {
        throw new Error('Mongoose could not reconnect to MongoDB server');
      });
    });

  } catch (error) {
    logger.error('ERROR: could not connect to mongoDB :( - ' + error);
  }

  app.set(mongoConfigName, conn);
  app.set('mongoose', mongoose);

  logger.debug(`Successfully app.set(${mongoConfigName}, conn) mongoose connection :)`);

  return conn;
};

