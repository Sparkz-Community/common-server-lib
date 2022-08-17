import {makeAuthPlugin} from '../api/feathers-client';

export default makeAuthPlugin({
  userService: 'users',
  state: {},
  getters: {},
  mutations: {},
  actions: {},
});
