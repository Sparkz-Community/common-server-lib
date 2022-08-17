import Vue from 'vue';
import { abilitiesPlugin } from '@casl/vue';
import { Ability} from '@casl/ability';

const defaultAbility = new Ability();

Vue.use(abilitiesPlugin, defaultAbility);
Vue.prototype.$createEntity = function (path, item) {
  const classFn =  new Function('item', `return new class ${path} {constructor(args) {Object.assign(this, item)}}`);
  const newClass = classFn(item);
  return newClass;
};

