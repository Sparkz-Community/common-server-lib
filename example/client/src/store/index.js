import Vue from 'vue';
import Vuex from 'vuex';
import {FeathersVuex} from 'feathers-vuex';

import {plugins as rolesPlugins} from '@iy4u/roles-client-lib';
const {irRolesAbilities, irRolesRoles, irRolesRules} = rolesPlugins;

import auth from './store.auth';

// import example from './module-example'


Vue.use(Vuex);
Vue.use(FeathersVuex);

const requireModule = require.context(
  // The path where the service modules live
  './services',
  // Whether to look in subfolders
  false,
  // Only include .js files (prevents duplicate imports`)
  /.js$/
);
const servicePlugins = requireModule
  .keys()
  .map(modulePath => requireModule(modulePath).default);


/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Store instance.
 */

export default async function (/* { ssrContext } */) {
  console.log('test');
  const irRolesAbilitiesPlugin = await irRolesAbilities({
    FeathersClient: () => import('../api/feathers-client')
  });
  const irRolesRolesPlugin = await irRolesRoles({
    FeathersClient: () => import('../api/feathers-client')
  });
  const irRolesRulesplugin = await irRolesRules({
    FeathersClient: () => import('../api/feathers-client')
  });

  const Store = new Vuex.Store({
    state: {
      showApplication:undefined,
    },
    getters: {},
    mutations: {
      setActiveContent(state,payload) {
        state.activeContent = payload;
      },
      openApplication (state,payload) {
        state.showApplication = payload;
      },
      closeApplication (state) {
        state.showApplication = undefined;
      },
    },
    actions: {},

    modules: {
      // example
    },
    plugins: [...servicePlugins, irRolesAbilitiesPlugin, irRolesRolesPlugin, irRolesRulesplugin,  auth],

    // enable strict mode (adds overhead!)
    // for dev mode only
    strict: process.env.DEV
  });

  return Store;
}
