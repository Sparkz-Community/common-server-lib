const assert = require('assert');
const app = require('../../src/app');

describe('\'places-auto-complete\' service', () => {
  it('registered the service', () => {
    const service = app.service('places-auto-complete');

    assert.ok(service, 'Registered the service');
  });
});
