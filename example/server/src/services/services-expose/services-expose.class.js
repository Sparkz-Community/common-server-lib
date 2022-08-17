const {packages: {lodash: {lget}}} = require('@iy4u/common-utils');

/* eslint-disable no-unused-vars */
exports.ServicesExpose = class ServicesExpose {
  constructor (options, app) {
    this.options = options || {};
    this.app = app;
  }

  async find (params) {
    let services = Object.keys(this.app.services);
    let modelArray = [];
    for(let i = 0; i < services.length; i++){
      modelArray.push({service: services[i],fields: Object.keys(lget(this.app.services[services[i]], 'options.Model.schema.obj', []))});
    }
    return [{serviceArray: modelArray, keyPathConfig: this.app.get('IrRoles').rules.keyPathName }];
  }
};
