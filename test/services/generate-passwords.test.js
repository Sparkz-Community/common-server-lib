const assert = require('assert');
const app = require('../../lib/app');

describe('\'generate-passwords\' service', () => {
  it('registered the service', () => {
    const service = app.service('generate-passwords');

    assert.ok(service, 'Registered the service');
  });
});
