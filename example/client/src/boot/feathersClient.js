import Vue from 'vue';

import feathersClient from '../api/feathers-client';
import feathersRestClient from '../api/feathers-rest-client';

Vue.prototype.$feathersClient = feathersClient;
Vue.prototype.$feathersRestClient = feathersRestClient;
