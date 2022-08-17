const assert = require('assert');
const app = require('../../src/app');

describe('\'extend-ir-roles-abilities\' service', () => {
  it('registered the service', () => {
    const service = app.service('extend-ir-roles-abilities');

    assert.ok(service, 'Registered the service');
  });
});
