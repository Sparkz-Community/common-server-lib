const assert = require('assert');
const app = require('../../src/app');

describe('\'wallet\' service', () => {
  it('registered the service', () => {
    const service = app.service('wallet');

    assert.ok(service, 'Registered the service');
  });
});
