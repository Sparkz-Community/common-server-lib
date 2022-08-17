## IonRev Baseline Template for a New Project

### Instructions:
- Clone this project

- Install the following prerequisite OS packages:
  - Mac OSX: webstorm, xcode, brew ... use brew to install: nodejs/npm, yarn
  - Windows: nodejs/npm, yarn
  - Linux: nodejs/npm, yarn
  
- Install the following prerequisite NPM global packages:

    `npm install -g @vue/cli @feathersjs/cli @feathers-plus/cli @quasar/cli`
    
- Generate an ssh private key:

    `ssh-keygen -t rsa -b 4096`
    
    Note: you should password protect your public key `cat ~/.ssh/id_rsa.pub`
    
- Convert your `openssh` private key to an `rsa` private `pem`

    `cp -p ~/.ssh/id_rsa  ~/.ssh/id_rsa.pem && ssh-keygen -p -m pem -f ~/.ssh/id_rsa.pem`
    
- Open this projects code inside `WebStorm`

- Inside WebStorm click `ADD CONFIGURATION` at the top of the page ...

    ![ADD CONFIGURATION](webstorm-add-config.png)
    
    Note: You need to add 2 configurations (`server run dev`, `client run dev`)
    
    ![ADD CONFIGURATION DETAIL](webstorm-add-config-detail.png)

    Note: You will need `Environment` variables for the server as follows:
    
    ```NODE_ENV=development;HOST=localhost;PORT=3030;APP_SECRET=<CHANGEME>;TUNNEL_MONGO=false;SSH_USERNAME=centos;SSH_HOST=52.37.175.108;SSH_PORT=22;SSH_DST_HOST=10.0.1.66;SSH_DST_PORT=27017;SSH_KEY_PASSPHRASE=<CHANGEME>;SSH_PRIVATE_KEY=/Users/<CHANGEME>/.ssh/id_rsa.pem;TUNNEL_REDIS=true;REDIS_DB=1;REDIS_PASSWORD=<CHANGEME>;REDIS_PORT=6388;TWILIO_FROM_PHONE=+15005550006;TWILIO_AUTH_TOKEN=<CHANGEME>;TWILIO_SID=<CHANGEME>;FROM_EMAIL=account-management@ionrev.com;MONGO_DB_URI=mongodb+srv://<CHANGEME>:<CHANGEME>@dev0.jqbzk.mongodb.net/<CHANGEME>?replicaSet=atlas-b13tbl-shard-0&readPreference=primary&connectTimeoutMS=10000&authSource=admin&authMechanism=SCRAM-SHA-1```

    Note: Update your environment variables with specifics for your situation `< stuff >`, you will also need a database setup and give you id_rsa.pub to IT for access to the development environment.
    
- Generate a new secret for `APP_SECRET`

    `feathers-plus generate secret`
    
- In the `client` folder add a file `.quasar.env.json`

  ```json
  {
    "development": {
      "ENV_TYPE": "Running Development",
      "ENV_DEV": "Development",
      "VUE_APP_FEATHERS_URL": "http://localhost:3030"
    },
    "demo": {
      "ENV_TYPE": "Running Demo",
      "ENV_DEV": "Demo",
      "VUE_APP_FEATHERS_URL": "https://something.demo.ionrev.com"
    },
    "production": {
      "ENV_TYPE": "Running Production",
      "ENV_PROD": "Production",
      "VUE_APP_FEATHERS_URL": "https://something.ionrev.com"
    },
    "test": {
      "ENV_TYPE": "Running Test",
      "ENV_Test": "Test",
      "VUE_APP_FEATHERS_URL": "http://localhost:3030"
    }
  }
  ```


## npm Setup
create [npm account](https://www.npmjs.com/signup).

```bash
npm install -g npmrc
```

### Set up iy4u profile:
```bash
npmrc -c iy4u
npm login --scope=@iy4u --registry=https://registry.npmjs.org/
```

### Set up ionrev profile:
```bash
npmrc -c ionrev
npm login --scope=@ionrev --registry=https://registry.npmjs.org/
```

### switch profiles:
```bash
npmrc ionrev
npmrc iy4u
```
