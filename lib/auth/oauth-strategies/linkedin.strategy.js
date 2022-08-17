const { OAuthStrategy } = require('@feathersjs/authentication-oauth');
const {packages:{lodash: {lget}, axios}} = require('@iy4u/common-utils');

exports.LinkedinStrategy = class LinkedinStrategy extends OAuthStrategy {

  async getProfile(authResult) {

    let profileData, emailData ;
    try{
      const accessToken = lget(authResult,'access_token');
      profileData = await axios.get('https://api.linkedin.com/v2/me', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'cache-control': 'no-cache',
          'X-Restli-Protocol-Version': '2.0.0'
        },
        params: {
          // There are
          projection: '(id,firstName,lastName,profilePicture(displayImage~:playableStreams))'
        }
      });

    } catch (err) {
      console.log('linkedin get profile error', err);
    }

    const accessToken = lget(authResult,'access_token');

    try{
      emailData =await axios.get('https://api.linkedin.com/v2/emailAddress', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'cache-control': 'no-cache',
          'X-Restli-Protocol-Version': '2.0.0'
        },
        params: {
          // There are
          q: 'members',
          projection: '(elements*(handle~))'
        }
      });
    }catch (err){
      console.log('linkedin get email error', err);
    }

    const { firstName, lastName, profilePicture } =profileData;

    return  {
      name: lget(firstName, 'localized.en_US') + ' ' + lget(lastName, 'localized.en_US'),
      avatar: { large: { file: lget(profilePicture, 'displayImage') } },
      email: lget(emailData, ['data', 'elements', 0, 'handle~', 'emailAddress'])
    };

  }

  async getEntityData(profile) {
    // `profile` is the data returned by getProfile
    const baseData = await super.getEntityData(profile);

    return {
      ...baseData,
      avatar: lget(profile,'avatar'),
      name: lget(profile,'name'),
      email: lget(profile,'email')
    };
  }

  setup(app) {
    this.app = app;
  }

  async findEntity(profile) {
    const existing = await this.app.service('users').find({
      query: { email: lget(profile,'email') }
    });
    return lget(existing, 'data')[0];
  }
};
