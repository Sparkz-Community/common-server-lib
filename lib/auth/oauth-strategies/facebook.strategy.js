const { OAuthStrategy } = require('@feathersjs/authentication-oauth');
const {packages:{lodash: {lget}, axios}} = require('@iy4u/common-utils');

exports.FacebookStrategy = class FacebookStrategy extends OAuthStrategy {
  async getProfile(authResult) {
    // This is the OAuth access token that can be used
    // for Facebook API requests as the Bearer token
    const accessToken = lget(authResult,'access_token');

    const { data } = await axios.get('https://graph.facebook.com/me', {
      headers: {
        authorization: `Bearer ${accessToken}`
      },
      params: {
        // There are
        fields: 'id,name,email,picture'
      }
    });

    return data;
  }

  async getEntityData(profile) {
    // `profile` is the data returned by getProfile
    const baseData = await super.getEntityData(profile);

    return {
      ...baseData,
      avatar: { large: { file: lget(profile, 'picture') } },
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
