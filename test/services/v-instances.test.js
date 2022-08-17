const assert = require('assert');
const app = require('../../lib/app');

describe('\'v-instances\' service', () => {
  it('registered the service', () => {
    const service = app.service('v-instances');

    assert.ok(service, 'Registered the service');
  });
});
