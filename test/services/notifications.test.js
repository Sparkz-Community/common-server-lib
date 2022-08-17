const assert = require('assert');
const app = require('../../lib/app');

describe('\'notifications\' service', () => {
  it('registered the service', () => {
    const service = app.service('notifications');

    assert.ok(service, 'Registered the service');
  });
});
