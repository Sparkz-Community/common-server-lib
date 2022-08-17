const assert = require('assert');
const app = require('../../src/app');

describe('\'services-expose\' service', () => {
  it('registered the service', () => {
    const service = app.service('services-expose');

    assert.ok(service, 'Registered the service');
  });
});
