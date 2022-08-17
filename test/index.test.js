const { expect } = require('chai');
const plugin = require('../lib');

describe('server', () => {
  it('basic functionality', () => {
    expect(typeof plugin).to.equal('object', 'It worked');
  });
});
