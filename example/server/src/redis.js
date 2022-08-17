const Redis = require('ioredis');
const session = require('express-session');
const RedisStore = require('connect-redis')(session);
const tunnel = require('tunnel-ssh');
const {packages:{lodash: {lget, lisNil, lomitBy}}, logger} = require('@iy4u/common-utils');

logger.level = process.env.NODE_ENV === 'production' ? 'info' : 'debug';

module.exports = function (app) {
  const redisConf = app.get('redis');

  let redisOptions = {
    // Creates a Redis instance - new Redis([port], [host], [options])
    port: undefined, //	optional (number) - Port of the Redis server.
    host: undefined, //	optional (string) - Host of the Redis server.
    family: '4', //	optional (string) - Version of IP stack. Defaults to 4.
    path: null, //	optional (string) - Local domain socket path. If set the port, host and family will be ignored.
    keepAlive: 0, //	optional (number) - TCP KeepAlive on the socket with a X ms delay before start. Set to a non-number value to disable keepAlive.
    noDelay: true, //	optional (boolean) - Whether to disable the Nagle's Algorithm. By default we disable it to reduce the latency.
    connectionName: null, //	optional (string) - Connection name.
    db: 0, //	optional (number) - Database index to use.
    password: null, //	optional (string) - If set, client will send AUTH command with the value of this option when connected.
    username: null, //	optional (string) - Similar to password. Provide this for Redis ACL support.
    dropBufferSupport: false, //	optional (boolean) - Drop the buffer support for better performance. This option is recommended to be enabled when handling large array response and you don't need the buffer support.
    enableReadyCheck: true, //	optional (boolean) - When a connection is established to the Redis server, the server might still be loading the database from disk. While loading, the server not respond to any commands. To work around this, when this option is true, ioredis will check the status of the Redis server, and when the Redis server is able to process commands, a ready event will be emitted.
    enableOfflineQueue: true, //	optional (boolean) - By default, if there is no active connection to the Redis server, commands are added to a queue and are executed once the connection is "ready" (when enableReadyCheck is true, "ready" means the Redis server has loaded the database from disk, otherwise means the connection to the Redis server has been established). If this option is false, when execute the command when the connection isn't ready, an error will be returned.
    connectTimeout: 10000, //	optional (number) - The milliseconds before a timeout occurs during the initial connection to the Redis server.
    disconnectTimeout: 2000, //	optional (number) - The milliseconds before socket.destroy() is called after socket.end() if the connection remains half-open during disconnection.
    commandTimeout: undefined, //	optional (number) - The milliseconds before a timeout occurs when executing a single command. By default, there is no timeout and the client will wait indefinitely. The timeout is enforced only on the client side, not server side. The server may still complete the operation after a timeout error occurs on the client side.
    autoResubscribe: true, //	optional (boolean) - After reconnected, if the previous connection was in the subscriber mode, client will auto re-subscribe these channels.
    autoResendUnfulfilledCommands: true, //	optional (boolean) - If true, client will resend unfulfilled commands(e.g. block commands) in the previous connection when reconnected.
    lazyConnect: false, //	optional (boolean) - By default, When a new Redis instance is created, it will connect to Redis server automatically. If you want to keep the instance disconnected until a command is called, you can pass the lazyConnect option to the constructor: javascript var redis = new Redis({ lazyConnect: true }); // No attempting to connect to the Redis server here. // Now let's connect to the Redis server redis.get('foo', function () { });
    tls: undefined, //	optional (Object) - TLS connection support. See https://github.com/luin/ioredis#tls-options
    keyPrefix: '', //	optional (string) - The prefix to prepend to all keys in a command.
    retryStrategy: undefined, //	optional (function) - See "Quick Start" section
    maxRetriesPerRequest: undefined, //	optional (number) - See "Quick Start" section
    reconnectOnError: undefined, //	optional (function) - See "Quick Start" section
    readOnly: false, //	optional (boolean) - Enable READONLY mode for the connection. Only available for cluster mode.
    stringNumbers: false, //	optional (boolean) - Force numbers to be always returned as JavaScript strings. This option is necessary when dealing with big numbers (exceed the [-2^53, +2^53] range).
    enableAutoPipelining: false, //	optional (boolean) - When enabled, all commands issued during an event loop iteration are automatically wrapped in a pipeline and sent to the server at the same time. This can improve performance by 30-50%.
    autoPipeliningIgnoredCommands: undefined, //	optional (string[]) - The list of commands which must not be automatically wrapped in pipelines.
    maxScriptsCachingTime: 60000, //	optional (number) - Default script definition caching time.
  };

  logger.info('TUNNEL_REDIS - ' + redisConf.tunnelRedis);
  if (redisConf.tunnelRedis) {
    const server = tunnel(redisConf.tunnel, function (error, server) {
      if (error) {
        logger.error(`SSH tunnel connection for Redis via SSH host:  ${redisConf.tunnel.host} ${error}`);
        process.exit(1);
      } else {
        logger.debug(`SSH tunnel: ${JSON.stringify(server)}`);
        logger.info(`SSH tunnel ready for Redis via SSH host:  ${server._connectionKey}`);
      }
    });

    // Use a listener to handle errors outside the callback
    server.on('error', function (err) {
      logger.error(`ERROR - Listener on redis tunnel reported error at (${err.level}): ${err.message}`);
      logger.debug(err.stack);
    });
  }
  if (process.env.DEBUG) {
    logger.debug(`redisConf: ${JSON.stringify(redisConf)}`);
  }

  let redisClient;
  if (typeof lget(redisConf, 'startupNodes') !== 'undefined') {
    const hosts = JSON.parse(lget(redisConf, 'startupNodes'));
    let clusterOptions = {
      // Creates a Redis Cluster instance - new Cluster(startupNodes, options)
      clusterRetryStrategy: undefined, //	optional (function) - See "Quick Start" section
      dnsLookup: undefined, //	optional (function(hostname, function(err, addr, family)), default: dns.lookup) - Function used to resolve DNS hostnames of Redis cluster members.
      enableOfflineQueue: true, //	optional (boolean) - See Redis class
      enableReadyCheck: true, //	optional (boolean) - When enabled, ioredis only emits "ready" event when CLUSTER INFO command reporting the cluster is ready for handling commands.
      scaleReads: 'master', //	optional (string) - Scale reads to the node with the specified role. Available values are "master", "slave" and "all".
      maxRedirections: 16, //	optional (number) - When a MOVED or ASK error is received, client will redirect the command to another node. This option limits the max redirections allowed to send a command.
      retryDelayOnFailover: 100, //	optional (number) - When an error is received when sending a command(e.g. "Connection is closed." when the target Redis node is down),
      retryDelayOnClusterDown: 100, //	optional (number) - When a CLUSTERDOWN error is received, client will retry if retryDelayOnClusterDown is valid delay time.
      retryDelayOnTryAgain: 100, //	optional (number) - When a TRYAGAIN error is received, client will retry if retryDelayOnTryAgain is valid delay time.
      slotsRefreshTimeout: 1000, //	optional (number) - The milliseconds before a timeout occurs while refreshing slots from the cluster.
      slotsRefreshInterval: 5000, //	optional (number) - The milliseconds between every automatic slots refresh.
      redisOptions: {...redisOptions}, //	optional (object) - Passed to the constructor of Redis.
    };
    clusterOptions = lomitBy({...clusterOptions, ...lget(redisConf, 'clusterOptions')}, lisNil);
    logger.debug(`clusterOptions: ${JSON.stringify(clusterOptions)}`);

    redisClient = new Redis.Cluster(
      [
        ...hosts,
      ],
      clusterOptions,
    );
  } else {

    redisOptions = lomitBy({...redisOptions, ...lget(redisConf, 'redisOptions')}, lisNil);

    logger.debug(`redisOptions: ${JSON.stringify(redisOptions)}`);

    redisClient = new Redis(
      lget(redisConf, 'port'),
      lget(redisConf, 'host'),
      redisOptions,
    );
  }

  redisClient.set(encodeURIComponent(app.get('name')), app.get('host'), 'ex', 60).then((reply) => {
    logger.info(JSON.stringify(reply));
  }).catch((e) => {
    logger.error(`ERROR @ redisClient.set: ${e.message}`);
    throw e;
  });

  redisClient.get(encodeURIComponent(app.get('name')), (err, reply) => {
    if (err) logger.error(`${JSON.stringify(err)}`);
    if (reply === app.get('host')) {
      logger.info(`Successfull Redis write/retrieved test key value: ${reply}`);
    } else {
      throw new Error(`ERROR - failed to retrieve test key value: ${app.get('host')} ... got: ${reply}`);
    }
  });

  // Enable for debug only
  if (lget(app.get('redis'), 'monitor', false)) {
    redisClient.monitor((err, monitor) => {
      monitor.on('monitor', (time, args, source, database) => {
        logger.info(`Redis monitor: time, args, source, database - ${time}, ${args}, ${source}, ${database}`);
      });
    });
  }


  redisClient.on('connect', () => {
    logger.info('Successfully connected to Redis :)');
  });
  redisClient.on('ready', () => {
    logger.info('Redis connection ready :)');
  });
  redisClient.on('reconnecting', () => {
    logger.log('warn', 'Redis reconnecting... :/');
  });
  redisClient.on('error', (err) => {
    logger.error(`ERROR - Redis errored... :(  ${JSON.stringify(err)}`);
  });
  redisClient.on('end', () => {
    logger.log('warn', 'Redis connection ended... :|');
  });

  setInterval(function () {
    redisClient.ping().then(response => {
      logger.verbose(`Redis ping: ${response}`);
    }).catch(error => {
      logger.error(`Error during Redis ping attempt: ${JSON.stringify(error)}`);
    });
  }, redisConf.pingInterval || 600000);
  const sessionStore = new RedisStore({client: redisClient, prefix: app.get('name') + '-sess:'});
  // exports.sessionStore.client.on('error', function (err) {
  //   logger.error('FATAL: Redis server sessionStore connection error - ' + JSON.stringify(err));
  // });
  app.set('redisSessionStore', sessionStore);
};

