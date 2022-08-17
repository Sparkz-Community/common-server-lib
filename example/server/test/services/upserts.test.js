const assert = require('assert');
const app = require('../../src/app');

describe('\'upserts\' service', () => {
  it('registered the service', () => {
    const service = app.service('upserts');

    assert.ok(service, 'Registered the service');
  });
});
