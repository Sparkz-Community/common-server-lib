const assert = require('assert');
const app = require('../../lib/app');

describe('\'url-parses\' service', () => {
  it('registered the service', () => {
    const service = app.service('url-parses');

    assert.ok(service, 'Registered the service');
  });
});
