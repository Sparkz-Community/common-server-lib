const assert = require('assert');
const app = require('../../src/app');

describe('\'extend-ir-roles-rules\' service', () => {
  it('registered the service', () => {
    const service = app.service('extend-ir-roles-rules');

    assert.ok(service, 'Registered the service');
  });
});
