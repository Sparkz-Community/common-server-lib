const {paramCase} = require('change-case');
let appName = require(__dirname + '/../package.json').name;
if (appName === 'server') appName = paramCase(require(__dirname + '/../package.json').description);
const {packages: {lodash: {lget}}} = require('@iy4u/common-utils');

const _HOST = lget(process.env, 'HOST') || 'localhost';
const _PORT = lget(process.env, 'PORT') || 3030;
const _SERVER_URL = lget(process.env, 'SERVER_URL') || 'http://' + _HOST + ':' + _PORT;
const _CLIENT_URL = lget(process.env, 'CLIENT_URL') || 'http://localhost:8080/#';

const STORAGE_TYPES = {
  's3': 's3',
  'local-private': 'local-private',
  'local-public': 'local-public',
  'google-cloud': 'google-cloud',
  'others': 'others',
};

const _APP_SECRET = lget(process.env, 'APP_SECRET', '0dd0ae63acf12332b8ef9d171f4d707dd4d05bfad3ed06f8d32a777aa97692f3593a816e83ca90970e080d14eda2c32a5b6cf5626ee22cad5258537c99292c419b52dca372b408de74720e67d71f6185b0d70950e4843a29fcf5ab1df3e8653cb38316850cff3966bb8005e9368dbbddd0d9b3e555391f5b5234e46de4f0d95550449d31eabbf08bac0111f378187581e53a165bd1f5f10150365fff2670c776327fe3e3bc4686f7adfa89ca0b75e8b3a23ac7d83a722eb20fd42371d67b7dad4fd16781d8942c5a8b15e3c47ff82cea2746f42c57ada5a9ec061086319e5598afd38ce556880ae792ce05ebe67dafff6d88e75d16e42527b99aebb9d4155eb1');
const _MONGO_SSH_PRIVATE_KEY = lget(process.env, 'SSH_PRIVATE_KEY');
const MONGO_SSH_PRIVATE_KEY = _MONGO_SSH_PRIVATE_KEY ? require('fs').readFileSync(_MONGO_SSH_PRIVATE_KEY) : undefined;
const _REDIS_SSH_PRIVATE_KEY = lget(process.env, 'REDIS_SSH_PRIVATE_KEY', lget(process.env, 'SSH_PRIVATE_KEY'));
const REDIS_SSH_PRIVATE_KEY = _REDIS_SSH_PRIVATE_KEY ? require('fs').readFileSync(_REDIS_SSH_PRIVATE_KEY) : undefined;

module.exports = {
  name: appName,
  host: _HOST,
  port: _PORT,
  secret: _APP_SECRET,
  sessionSecret: lget(process.env, 'SESSION_SECRET', _APP_SECRET),
  serverUrl: _SERVER_URL,
  clientUrl: _CLIENT_URL,
  clientLoginUrl: _CLIENT_URL + (lget(process.env, 'CLIENT_LOGIN_PATH') || '/login'),
  public: '../public/',
  paginate: {
    default: 500,
    max: 1000,
  },
  logger: {
    blacklist: [],
    searchIn: [],
  },
  IrRoles: {
    serviceWhiteList: [], // ex: ['users', 'organizations', 'teams'] ** providing values is optional **
    serviceBlackList: [], // ex: ['vendors', 'contributors', 'users', 'organizations'] ** providing values is optional **
    rules: {
      keyPathName: 'dynamicPath', // for when you want to set a specific interpolation key name for dynamic values on the rules object.
      // ex: conditions: {_id: {keyPath: 'params.user._id}}   defaults to keyPath
    }
  },
  notifications: {
    fromEmail: 'support@ionrev.com',
    hostPath: 'host',
    fromPhone: '+13852208190',
  },
  apminsight: {
    licenseKey: lget(process.env, 'APMINSIGHT_LICENSEKEY'),
    appName: lget(process.env, 'APMINSIGHT_APPNAME', appName),
    port: lget(process.env, 'APMINSIGHT_PORT', _PORT),
    // proxyServerHost: lget(process.env, 'APMINSIGHT_PROXYSERVERHOST', _HOST),
    // proxyServerPort: lget(process.env, 'APMINSIGHT_PROXYSERVERPORT', 443),
    // proxyAuthUser: lget(process.env, 'APMINSIGHT_PROXYAUTHUSER'),
    // proxyAuthPassword: lget(process.env, 'APMINSIGHT_PROXYAUTHPASSWORD')
  },
  s3: {
    bucket: lget(process.env, 'AWS_BUCKET_NAME'),
    accessKeyId: lget(process.env, 'AWS_ACCESS_KEY'),
    secretAccessKey: lget(process.env, 'AWS_SECRET_ACCESS_KEY'),
    signedUrlExpires: 900,
  },
  applicationRegistry: {
    name: lget(process.env, 'APP_NAME') || appName,
    secret: lget(process.env, 'APPLICATIONREG_SECRET', _APP_SECRET || '716b430a674beac1dc55330f5a5fcc656e92667adfa4cbd94c8825ca8bea3533a8bab27c24dd146ac70feea03202d770ebb8f375863fd55214a96c698c2f7765d0c7374fa9a49cea58dcedeca93ba9a7fc2fc15d1e1acd2a21999db08addc41e17bfb0395775440757c880b8bac0cbe9a3803042fd5e241c42b3fc1fcdec0739e314e499552418b8697915f4e6d8dd262d79be876db4e55dcec9af4be554dd7abd5ed7aca9fe3d76b7a02fb0484d3c4d912ff61ca6dbe5e1c553143b2019d743b57e0e0d653db40d21d3ac6a459880958bbf0ca1a6e8375300a291019cd48f6d6d45bdf9e17ecab401ecdfba94d09b9df202eb61920f9113f38276797a0283b2'),
    idm: {
      host: lget(process.env, 'SERVER_URL'),
    },
    jwtOptions: {
      audience: lget(process.env, 'AUTH_JWT_OPTIONS_APPLICATIONREG_AUDIENCE', '0.0.0.0'),
      issuer: lget(process.env, 'AUTH_JWT_OPTIONS_APPLICATIONREG_ISSUER', lget(process.env, 'APP_NAME', 'IonRev')),
      algorithm: lget(process.env, 'AUTH_JWT_OPTIONS_APPLICATIONREG_ALGORITHM', 'HS256'),
      expiresIn: lget(process.env, 'AUTH_JWT_OPTIONS_APPLICATIONREG_EXPIRESIN', '1d'),
    },
  },
  authentication: {
    entity: 'user',
    service: 'users',
    secret: lget(process.env, 'AUTHENTICATION_SECRET', _APP_SECRET || '716b430a674beac1dc55330f5a5fcc656e92667adfa4cbd94c8825ca8bea3533a8bab27c24dd146ac70feea03202d770ebb8f375863fd55214a96c698c2f7765d0c7374fa9a49cea58dcedeca93ba9a7fc2fc15d1e1acd2a21999db08addc41e17bfb0395775440757c880b8bac0cbe9a3803042fd5e241c42b3fc1fcdec0739e314e499552418b8697915f4e6d8dd262d79be876db4e55dcec9af4be554dd7abd5ed7aca9fe3d76b7a02fb0484d3c4d912ff61ca6dbe5e1c553143b2019d743b57e0e0d653db40d21d3ac6a459880958bbf0ca1a6e8375300a291019cd48f6d6d45bdf9e17ecab401ecdfba94d09b9df202eb61920f9113f38276797a0283b2'),
    authStrategies: [
      'jwt',
      'local',
      'api-key',
      'api-key-file-uploader',
      'oauth',
    ],
    jwtOptions: {
      header: {
        typ: 'access',
      },
      audience: lget(process.env, 'AUTH_JWT_OPTIONS_AUDIENCE', '0.0.0.0'),
      issuer: lget(process.env, 'AUTH_JWT_OPTIONS_ISSUER', lget(process.env, 'APP_NAME', 'IonRev')),
      algorithm: lget(process.env, 'AUTH_JWT_OPTIONS_ALGORITHM', 'HS256'),
      expiresIn: lget(process.env, 'AUTH_JWT_OPTIONS_EXPIRESIN', '1d'),
    },
    local: {
      usernameField: 'email',
      passwordField: 'password',
    },
    'api-key': {
      headerField: 'x-api-key', // Required
      entity: 'key', // Required - The name of the key field
      service: 'secret/keys', // Required - The name of the service to use.
      revokedField: 'revoked', // Optional - The name of the revoked field
      activeField: 'active', // Optional - The name of the active field
      authorizedField: 'authorized', // Optional - The name of the authorized field
    },
    'api-key-file-uploader': {
      headerField: 'x-api-key', // Required
      entity: 'api-key', // Required - The name of the key field
      service: 'll-host-keys', // Required - The name of the service to use.
      revokedField: 'revoked', // Optional - The name of the revoked field
      activeField: 'active', // Optional - The name of the active field
      authorizedField: 'authorized', // Optional - The name of the authorized field
    },
    oauth: {
      redirect: lget(process.env, 'AUTH_OAUTH_REDIRECT', _CLIENT_URL),
      google: {
        key: lget(process.env, 'AUTH_OAUTH_GOOGLE_KEY'),
        secret: lget(process.env, 'AUTH_OAUTH_GOOGLE_SECRET'),
        scope: ['openid', 'profile', 'email'],
        nonce: true,
        name: 'google',
      },
      facebook: {
        key: lget(process.env, 'AUTH_OAUTH_FACEBOOK_KEY'),
        secret: lget(process.env, 'AUTH_OAUTH_FACEBOOK_SECRET'),
        scope: ['email', 'public_profile'],
        name: 'facebook',
      },
      linkedin: {
        name: 'linkedin',
        'authorize_url': 'https://www.linkedin.com/oauth/v2/authorization',
        'access_url': 'https://www.linkedin.com/oauth/v2/accessToken',
        'oauth': 2,
        'scope_delimiter': ' ',
        key: lget(process.env, 'AUTH_OAUTH_LINKEDIN_KEY'),
        secret: lget(process.env, 'AUTH_OAUTH_LINKEDIN_SECRET'),
        scope: ['r_liteprofile', 'r_emailaddress', 'w_member_social'],
      },
      auth0: {
        key: lget(process.env, 'AUTH_OAUTH_AUTH0_KEY'),
        secret: lget(process.env, 'AUTH_OAUTH_AUTH0_SECRET'),
        subdomain: lget(process.env, 'AUTH_OAUTH_AUTH0_SUBDOMAIN'), // "<Domain without auth0.com"
        scope: ['openid', 'profile', 'email'],
      },
      discord: {
        key: lget(process.env, 'AUTH_OAUTH_DISCORD_KEY'),
        secret: lget(process.env, 'AUTH_OAUTH_DISCORD_SECRET'),
        scopes: ['identify email'],
      },
      github: {
        key: lget(process.env, 'AUTH_OAUTH_GITHUB_KEY'),
        secret: lget(process.env, 'AUTH_OAUTH_GITHUB_SECRET'),
      },
    },
    enforceWhitelist: true,
    whitelistUserFields: [
      'email',
      'name',
      'theme',
      'roles',
      'addresses',
      'socialLinks',
      'avatar',
      'phones',
      '_fastjoin',
    ],
    blacklistUserFields: [],
  },
  loginAuth: {
    entity: 'login',
    service: 'logins',
    secret: lget(process.env, 'AUTHENTICATION_LOGINAUTH_SECRET', _APP_SECRET || '716b430a674beac1dc55330f5a5fcc656e92667adfa4cbd94c8825ca8bea3533a8bab27c24dd146ac70feea03202d770ebb8f375863fd55214a96c698c2f7765d0c7374fa9a49cea58dcedeca93ba9a7fc2fc15d1e1acd2a21999db08addc41e17bfb0395775440757c880b8bac0cbe9a3803042fd5e241c42b3fc1fcdec0739e314e499552418b8697915f4e6d8dd262d79be876db4e55dcec9af4be554dd7abd5ed7aca9fe3d76b7a02fb0484d3c4d912ff61ca6dbe5e1c553143b2019d743b57e0e0d653db40d21d3ac6a459880958bbf0ca1a6e8375300a291019cd48f6d6d45bdf9e17ecab401ecdfba94d09b9df202eb61920f9113f38276797a0283b2'),
    authStrategies: [
      'jwt',
      'local',
      'oauth',
    ],
    jwtOptions: {
      header: {
        typ: 'access',
      },
      audience: lget(process.env, 'AUTH_JWT_OPTIONS_LOGINAUTH_AUDIENCE', '0.0.0.0'),
      issuer: lget(process.env, 'AUTH_JWT_OPTIONS_LOGINAUTH_ISSUER', lget(process.env, 'APP_NAME', 'IonRev')),
      algorithm: lget(process.env, 'AUTH_JWT_OPTIONS_LOGINAUTH_ALGORITHM', 'HS256'),
      expiresIn: lget(process.env, 'AUTH_JWT_OPTIONS_LOGINAUTH_EXPIRESIN', '1d'),
    },
    local: {
      usernameField: 'email',
      passwordField: 'password',
    },
    jwt: {
      header: 'L-Authorization',
    },
    oauth: {
      redirect: lget(process.env, 'AUTH_OAUTH_LOGINAUTH_REDIRECT', _CLIENT_URL),
      google: {
        key: lget(process.env, 'AUTH_OAUTH_LOGINAUTH_GOOGLE_KEY'),
        secret: lget(process.env, 'AUTH_OAUTH_LOGINAUTH_GOOGLE_SECRET'),
        scope: ['openid', 'profile', 'email'],
        nonce: true,
        name: 'google',
      },
      facebook: {
        key: lget(process.env, 'AUTH_OAUTH_LOGINAUTH_FACEBOOK_KEY'),
        secret: lget(process.env, 'AUTH_OAUTH_LOGINAUTH_FACEBOOK_SECRET'),
        scope: ['email', 'public_profile'],
        name: 'facebook',
      },
      linkedin: {
        name: 'linkedin',
        'authorize_url': 'https://www.linkedin.com/oauth/v2/authorization',
        'access_url': 'https://www.linkedin.com/oauth/v2/accessToken',
        'oauth': 2,
        'scope_delimiter': ' ',
        key: lget(process.env, 'AUTH_OAUTH_LOGINAUTH_LINKEDIN_KEY'),
        secret: lget(process.env, 'AUTH_OAUTH_LOGINAUTH_LINKEDIN_SECRET'),
        scope: ['r_liteprofile', 'r_emailaddress', 'w_member_social'],
      },
      auth0: {
        key: lget(process.env, 'AUTH_OAUTH_LOGINAUTH_AUTH0_KEY'),
        secret: lget(process.env, 'AUTH_OAUTH_LOGINAUTH_AUTH0_SECRET'),
        subdomain: lget(process.env, 'AUTH_OAUTH_LOGINAUTH_AUTH0_SUBDOMAIN'), // "<Domain without auth0.com"
        scope: ['openid', 'profile', 'email'],
      },
      discord: {
        key: lget(process.env, 'AUTH_OAUTH_LOGINAUTH_DISCORD_KEY'),
        secret: lget(process.env, 'AUTH_OAUTH_LOGINAUTH_DISCORD_SECRET'),
        scopes: ['identify email'],
      },
      github: {
        key: lget(process.env, 'AUTH_OAUTH_LOGINAUTH_GITHUB_KEY'),
        secret: lget(process.env, 'AUTH_OAUTH_LOGINAUTH_GITHUB_SECRET'),
      },
    },
    enforceWhitelist: true,
    whitelistUserFields: [
      'email',
      'name',
      'theme',
      'roles',
      'addresses',
      'socialLinks',
      'avatar',
      'phones',
      '_fastjoin',
    ],
    blacklistUserFields: [],
  },
  integrationAuth: {
    entity: 'integrationAuth',
    service: 'integration-auths',
    secret: lget(process.env, 'INTAUTH_SECRET', _APP_SECRET || '5087cc3e6d61591ed5715c5fbf0056a69b0090800d12992368ec267179c30b90748fac4c504aafff0638bb02fb3f78cf15ce31868ab217cd51237614a9ae6d99ea2593184b2cc509d403186b8bc3f440ecdb082ce6e62842105e4cf3e046ce2f16f854c4ac84b7b04b120dd362571bcee606c4bb9b76639111a72e18eb9316d454ba1d74c5c34cd22ce89d51d1e321681b6768f03ac525fb8dc9b89ed6ab4cf2a0e6a6a07b9ce07983c62b7c208fbcbe49ca6a1914547e765a89f08fbca28524ee3231eb1d5cb6ea57a3d56bb8401f3db34ac73e52417032d1449b4ce2e9684bacd365f8385341ab9fa3b58dadf02218c5f74142e52aeed9cc32feab35b520de'),
    authStrategies: [
      'local',
      'jwt',
    ],
    jwtOptions: {
      header: {
        typ: 'access',
      },
      audience: lget(process.env, 'AUTH_JWT_OPTIONS_INTAUTH_AUDIENCE', '0.0.0.0'),
      issuer: lget(process.env, 'AUTH_JWT_OPTIONS_INTAUTH_ISSUER', lget(process.env, 'APP_NAME', 'IonRev')),
      algorithm: lget(process.env, 'AUTH_JWT_OPTIONS_INTAUTH_ALGORITHM', 'HS256'),
      expiresIn: lget(process.env, 'AUTH_JWT_OPTIONS_INTAUTH_EXPIRESIN', '1w'),
    },
    local: {
      usernameField: 'name',
      passwordField: 'secretKey',
    },
    jwt: {
      header: 'I-Authorization',
    },
    unSupportedServices: [
      'users',
      'applications',
      'hosts',
      'domains',
      'instances',
    ],
    enforceWhitelist: true,
    whitelistIntegrationFields: [
      '_id',
      'name',
      'environments',
    ],
    blacklistIntegrationFields: [],
  },
  fingerprintAuth: {
    entity: 'fingerprint',
    service: 'fingerprints',
    secret: lget(process.env, 'FINGERPRINTAUTH_SECRET', _APP_SECRET || '5087cc3e6d61591ed5715c5fbf0056a69b0090800d12992368ec267179c30b90748fac4c504aafff0638bb02fb3f78cf15ce31868ab217cd51237614a9ae6d99ea2593184b2cc509d403186b8bc3f440ecdb082ce6e62842105e4cf3e046ce2f16f854c4ac84b7b04b120dd362571bcee606c4bb9b76639111a72e18eb9316d454ba1d74c5c34cd22ce89d51d1e321681b6768f03ac525fb8dc9b89ed6ab4cf2a0e6a6a07b9ce07983c62b7c208fbcbe49ca6a1914547e765a89f08fbca28524ee3231eb1d5cb6ea57a3d56bb8401f3db34ac73e52417032d1449b4ce2e9684bacd365f8385341ab9fa3b58dadf02218c5f74142e52aeed9cc32feab35b520de'),
    authStrategies: [
      'local',
      'jwt',
      'password-less'
    ],
    jwtOptions: {
      header: {
        typ: 'access'
      },
      audience: lget(process.env, 'AUTH_JWT_OPTIONS_FINGERPRINTAUTH_AUDIENCE', '0.0.0.0'),
      issuer: lget(process.env, 'AUTH_JWT_OPTIONS_FINGERPRINTAUTH_ISSUER', lget(process.env, 'APP_NAME', 'IonRev')),
      algorithm: lget(process.env, 'AUTH_JWT_OPTIONS_FINGERPRINTAUTH_ALGORITHM', 'HS256'),
      expiresIn: lget(process.env, 'AUTH_JWT_OPTIONS_FINGERPRINTAUTH_EXPIRESIN', '1d'),
    },
    local: {
      usernameField: 'device',
      passwordField: 'visitorId'
    },
    jwt: {
      header: 'F-Authorization',
    },
    'password-less':{
      usernameField: 'visitorId',
      passwordField: ''
    },
    enforceWhitelist: true,
    whitelistFingerprintFields: [
      '_id',
      'visits',
      'browser',
      'os',
      'platform',
      'engine',
      'userAgent',
      'appVersion',
      'ipInfo',
      'components',
      'createdAt',
      'updatedAt',
      'settings',
      'updatedByHistory',
      'external',
      'nativePermissions',
    ],
    blacklistIntegrationFields: [
      'visitorId'
    ],
  },
  plans: [
    {
      name: 'basic',
      blackList: {
        services: [],
        message: '',
      },
      whiteList: {
        services: [],
        message: '',
      },
    },
  ],
  uploads: {
    privateFolder: '../private-files',
    services: {
      's3': true,
      'local-private': true,
      'local-public': true,
      'google-cloud': false,
    },
    defaultFileService: lget(process.env, 'DEFAULT_FILE_SERVICE', 'local-public'),
    blockDeleteDocumentWhenDeleteFileFailed: false,
    blockUpdateDocumentWhenReplaceFileFailed: false,
    enums: {
      STORAGE_TYPES,
      UPLOAD_SERVICES: {
        [STORAGE_TYPES['local-private']]: 'upload-local-private',
        [STORAGE_TYPES['local-public']]: 'upload-local-public',
        [STORAGE_TYPES.s3]: 'uploads-s3',
        [STORAGE_TYPES['google-cloud']]: 'uploads-google',
      },
      UPLOAD_PUBLIC_FILE_KEY: Symbol.for('public-file'),
    },
  },
  sms: {
    default: 'twilio',
    verifyResetUrl: lget(process.env, 'SMS_URL') || _CLIENT_URL || _SERVER_URL,
    identifyUserProps: ['_id', 'username', 'email', 'phone.number.e164'],
    shortTokenLen: lget(process.env, 'SMS_SHORTTOKEN_LENGTH') || 6,
    shortTokenDigits: lget(process.env, 'SMS_SHORTTOKEN_DIGITS') || true,
    twilio: {
      phone: lget(process.env, 'TWILIO_FROM_PHONE', '+15005550006'),
      apiKey: lget(process.env, 'TWILIO_API_KEY'),
      domain: lget(process.env, 'TWILIO_DOMAIN'),
    },
  },
  mailer: {
    default: lget(process.env, 'MAILER_DEFAULT', 'sendgrid'),
    from: lget(process.env, 'FROM_EMAIL', 'account-management@app.ionrev.com'),
    verifyResetUrl: lget(process.env, 'MAILER_URL') || _CLIENT_URL || _SERVER_URL,
    helpEmail: lget(process.env, 'HELP_EMAIL') || 'account-management@ionrev.com',
    logo: lget(process.env, 'MAILER_LOGO'),
    mailgun: {
      host: lget(process.env, 'MAILGUN_HOST', 'smtp.mailgun.org'),
      port: lget(process.env, 'MAILGUN_PORT', 587),
      secure: false, // use SSL
      auth: function () {
        if (lget(process.env, 'MAILGUN_API_KEY') && lget(process.env, 'MAILGUN_DOMAIN')) {
          return {
            apikey: lget(process.env, 'MAILGUN_API_KEY', 'key-b16caad205345c8408746ff25c545b07'),
            domain: lget(process.env, 'MAILGUN_DOMAIN', 'sandboxd5991780fa8c4835865c326bee6a24e5.mailgun.org'),
          };
        } else {
          return {
            user: lget(process.env, 'MAILGUN_USER', 'postmaster@sandboxd5991780fa8c4835865c326bee6a24e5.mailgun.org'),
            pass: lget(process.env, 'MAILGUN_PASS', '3825009be5a3c8a1e3703b12c1401ab5-3939b93a-acc390be'),
          };
        }
      }(),
      tls: {
        ciphers: 'SSLv3',
      },
    },
    sendgrid: {
      host: lget(process.env, 'SENDGRID_HOST', 'smtp.sendgrid.net'),
      port: lget(process.env, 'SENDGRID_PORT', 465),
      secure: true,
      auth: function () {
        if (lget(process.env, 'SENDGRID_API_KEY')) {
          return {
            apikey: lget(process.env, 'SENDGRID_API_KEY'),
          };
        } else {
          return {
            user: lget(process.env, 'SENDGRID_API_USER'),
            pass: lget(process.env, 'SENDGRID_API_PASS'),
          };
        }
      }(),
      // tls: {
      //   ciphers:'SSLv3'
      // }
    },
    ses: {
      host: lget(process.env, 'SES_HOST', 'email-smtp.us-west-2.amazonaws.com'),
      port: lget(process.env, 'SES_PORT', 587),
      secure: true,
      auth: {
        user: lget(process.env, 'SES_SMTP_USER'),
        pass: lget(process.env, 'SES_SMTP_PASS'),
      },
    },
    sparkpost: {
      host: lget(process.env, 'SPARKPOST_HOST', 'smtp.sparkpostmail.com'),
      port: lget(process.env, 'SPARKPOST_PORT', 587),
      secure: false,
      ignoreTLS: false,
      auth: {
        user: lget(process.env, 'SPARKPOST_USER', 'SMTP_Injection'),
        pass: lget(process.env, 'SPARKPOST_API_KEY', 'Spark Key'),
      },
    },
  },
  redis: {
    on: (lget(process.env, 'USE_REDIS') === 'true'),
    monitor: (lget(process.env, 'REDIS_MONITOR') === 'true'),
    secret: lget(process.env, 'REDIS_SECRET', _APP_SECRET || 'c159d1785e7979395ed5713971415d902569e21af09273bdb750a4ee689f6bf4e2ea539fa00f83e667b184f0db0762078e13fbfc69fb6d382c2110e8ac947709252a1bc341f1c5b8b2cc68e481a0d32e52a4fba045af8316e8eae5b1d0e6950df0663071ca5f314833214c33a38576c6c6c5f8e39347e540824d19ba183ec7cd5f0797064eaf2b425a418c61cc72b846feafa32606f23e824d1be05fd43b94e5d242203f945eada469d2c6dd20b3c4620cf1cc784bc055ae5df52d61dd697c71dfbd7f6fc219c653924775d659df4c4f52260e7a0542ea56e773c08851d54f53df8def540795638c39f3d20a2214c77719749cb3886adc18cbd1abdf70ab4d49'),
    host: lget(process.env, 'REDIS_HOST') || lget(process.env, 'REDIS_DB_HOST') || 'localhost',
    port: lget(process.env, 'REDIS_PORT') || lget(process.env, 'REDIS_DB_PORT') || 6379,
    pingInterval: lget(process.env, 'REDIS_PING_INTERVAL', 180000),
    redisOptions: {
      db: lget(process.env, 'REDIS_DB') || 1,
      password: lget(process.env, 'REDIS_PASSWORD'),
    },
    clusterOptions: {},
    tunnelRedis: (lget(process.env, 'TUNNEL_REDIS') === 'true'),
    tunnel: {
      agent: lget(process.env, 'REDIS_SSH_AUTH_SOCK', lget(process.env, 'SSH_AUTH_SOCK')),
      username: lget(process.env, 'REDIS_SSH_USERNAME', lget(process.env, 'SSH_USERNAME')),
      privateKey: REDIS_SSH_PRIVATE_KEY,
      passphrase: lget(process.env, 'REDIS_SSH_KEY_PASSPHRASE', lget(process.env, 'SSH_KEY_PASSPHRASE')),
      host: lget(process.env, 'REDIS_SSH_HOST', lget(process.env, 'SSH_HOST')),
      port: lget(process.env, 'REDIS_SSH_PORT', lget(process.env, 'SSH_PORT', 22)),
      dstHost: lget(process.env, 'REDIS_SSH_DST_HOST', lget(process.env, 'SSH_DST_HOST')),
      dstPort: lget(process.env, 'REDIS_SSH_DST_PORT', 6379),
      localHost: lget(process.env, 'REDIS_HOST') || lget(process.env, 'REDIS_DB_HOST') || 'localhost',
      localPort: lget(process.env, 'REDIS_PORT') || lget(process.env, 'REDIS_DB_PORT') || 6379,
    },
  },
  mongo: {
    uri: lget(process.env, 'MONGO_DB_URI', 'mongodb+srv://test:test@localhost/test?retryWrites=true&w=majority'),
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      retryWrites: true,
      w: 'majority'
      // keepAlive: (lget(process.env, 'MONGO_DB_KEEPALIVE') === 'true'),
      // keepAliveInitialDelay: lget(process.env, 'MONGO_DB_KEEPALIVE_DELAY', 200000),
      // useUnifiedTopology: lget(process.env, 'MONGO_DB_USE_UNIFIED_TOPOLOGY', true),
      // // useFindAndModify: lget(process.env, 'MONGO_DB_USE_FIND_AND_MODIFY', false),
      // useNewUrlParser: lget(process.env, 'MONGO_DB_USE_NEW_URL_PARSER', true),
      // // useCreateIndex: lget(process.env, 'MONGO_DB_USE_CREATE_INDEX', true),
      // replicaSet: lget(process.env, 'MONGO_DB_REPLICA_SET', 'atlas-b13tbl-shard-0'),
      // readPreference: lget(process.env, 'MONGO_DB_READ_PREFERENCE', 'primary'),
      // authSource: lget(process.env, 'MONGO_DB_AUTH_SOURCE', 'admin'),
      // authMechanism: lget(process.env, 'MONGO_DB_AUTH_MECHANISM', 'SCRAM-SHA-1'),
      // appname: lget(process.env, 'MONGO_DB_APPNAME', appName),
    },
    tunnelMongo: (lget(process.env, 'TUNNEL_MONGO') === 'true'),
    tunnel: {
      agent: lget(process.env, 'SSH_AUTH_SOCK'),
      username: lget(process.env, 'SSH_USERNAME'),
      privateKey: MONGO_SSH_PRIVATE_KEY,
      passphrase: lget(process.env, 'SSH_KEY_PASSPHRASE', undefined),
      host: lget(process.env, 'SSH_HOST'),
      port: lget(process.env, 'SSH_PORT', 22),
      dstHost: lget(process.env, 'SSH_DST_HOST'),
      dstPort: lget(process.env, 'SSH_DST_PORT', 27017),
      localHost: lget(process.env, 'MONGO_DB_HOST'),
      localPort: lget(process.env, 'MONGO_DB_PORT', 27017),
    },
  },
  irBank: {
    plaid: {
      clientID: lget(process.env, 'PLAID_CLIENT_ID'),
      secret: lget(process.env, 'PLAID_CLIENT_SECRET'),
      env: lget(process.env, 'PLAID_ENVIRONMENT', 'sandbox'),
      PLAID_SETTINGS_PATH: lget(process.env, 'PLAID_SETTINGS_PATH', 'settings.payments.plaid'),
    },
    stripe: {
      STRIPE_SETTINGS_PATH: lget(process.env, 'STRIPE_SETTINGS_PATH', 'settings.payments.stripe'),
      STRIPE_SECRET_KEY: lget(process.env, 'STRIPE_SECRET_KEY'),
      RETURN_URL: lget(process.env, 'STRIPE_RETURN_URL'),
      REFRESH_URL: lget(process.env, 'STRIPE_REFRESH_URL'),
    },
  },
  encryption: {
    JWT_PUBLIC_KEY: lget(process.env, 'JWT_PUBLIC_KEY'),
    JWT_PRIVATE_KEY: lget(process.env, 'JWT_PRIVATE_KEY'),
    ENCRYPTION_SECRET_KEY: lget(process.env, 'SECRET_ENCRYPTION_KEY'),
    ENCRYPTION_PUBLIC_KEY: lget(process.env, 'PUBLIC_ENCRYPTION_KEY'),
  },
  instances: {
    name: 'default'
  },
  controllers: {
    name: 'default'
  },
  applications: {
    name: 'default'
  },
  domains: {
    name: 'localhost'
  },
  environments: {
    name: 'default'
  },
  hosts: {
    name: ''
  },
  seawolf: {
    url: lget(process.env, 'SEAWOLF_URL'),
    atlas: {
      email: lget(process.env, 'SEAWOLF_ATLAS_EMAIL'),
      password: lget(process.env, 'SEAWOLF_ATLAS_PASSWORD'),
    },
  },
};
