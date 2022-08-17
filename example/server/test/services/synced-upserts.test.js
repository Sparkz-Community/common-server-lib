const assert = require('assert');
const app = require('../../src/app');

describe('\'synced-upserts\' service', () => {
  it('registered the service', () => {
    const service = app.service('synced-upserts');

    assert.ok(service, 'Registered the service');
  });
});
