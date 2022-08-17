const { OAuthStrategy } = require('@feathersjs/authentication-oauth');
const {packages:{lodash: {lget}}} = require('@iy4u/common-utils');

exports.GoogleStrategy = class GoogleStrategy extends OAuthStrategy {

  async getEntityData(profile) {

    // this will set 'googleId'
    const baseData = await super.getEntityData(profile);

    // this will grab the picture and email address of the Google profile
    return {
      ...baseData,
      avatar: { small: { file: lget(profile, 'picture') } },
      email: lget(profile,'email'),
      name: lget(profile,'name')
    };
  }
  setup(app) {
    this.app = app;
  }

  async findEntity(profile) {
    const existing = await this.app.service('users').find({
      query: { email: lget(profile,'email')}
    });
    return lget(existing, 'data',[])[0];
  }
};
