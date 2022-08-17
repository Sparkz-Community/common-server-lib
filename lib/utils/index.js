const LogEverything = require('./LogEverything');
const setCore = require('./set-core');

const {
  cloneObject,
  extensionUtils,
  HookSystem,
  isEmpty,
  logger,
  passwordGen,
  urlParser
} = require('@iy4u/common-utils');

module.exports = {
  cloneObject,
  extensionUtils,
  HookSystem,
  isEmpty,
  LogEverything,
  logger,
  passwordGen,
  urlParser,

  ...setCore,
};
