const assert = require('assert');
const app = require('../../src/app');

describe('\'file-uploader\' service', () => {
  it('registered the service', () => {
    const service = app.service('file-uploader');

    assert.ok(service, 'Registered the service');
  });
});
