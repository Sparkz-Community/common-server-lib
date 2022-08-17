const assert = require('assert');
const app = require('../../lib/app');

describe('\'service-maps\' service', () => {
  it('registered the service', () => {
    const service = app.service('service-maps');

    assert.ok(service, 'Registered the service');
  });
});
