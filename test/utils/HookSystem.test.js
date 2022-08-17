const assert = require('assert');
const HookSystem = require('../../lib/utils/HookSystem.js');

describe('\'HookSystem\' utils', () => {
  const hookManager = new HookSystem();
  let hello_world_hook = () => console.log('Hello World!');
  let hello_world_hook_2 = () => console.log('Hello World 2!');

  beforeEach(function () {
    if (this.currentTest.title !== 'create new instance of HookSystem class') {
      hookManager.add('before', hello_world_hook);
    }
  });

  afterEach(function () {
    hookManager.removeAll();
  });

  it('create new instance of HookSystem class', () => {
    assert.ok(hookManager, 'created new hookManager instance');
  });

  it('add/get hook to validate add/get class methods', () => {
    let before_hooks = hookManager.get('before');
    assert.strictEqual(before_hooks.length, 1);
    assert.strictEqual(String(before_hooks), String([hello_world_hook]));
  });

  it('set hooks to validate', () => {
    hookManager.set('before', hello_world_hook, hello_world_hook_2);

    let before_hooks = hookManager.get('before');
    assert.strictEqual(before_hooks.length, 2);
    assert.strictEqual(before_hooks[0].name, hello_world_hook.name);

    hookManager.set('before', [hello_world_hook, [hello_world_hook_2]]);

    before_hooks = hookManager.get('before');
    assert.strictEqual(before_hooks.length, 2);
    assert.strictEqual(before_hooks[0].name, hello_world_hook.name);
  });

  it('setValue hooks to validate', () => {
    hookManager.setValue('before', {});

    let before_hooks = hookManager.get('before');
    assert.ok(typeof before_hooks === 'object');
    assert.strictEqual(JSON.stringify(before_hooks), JSON.stringify({}));
    assert.strictEqual(Object.keys(before_hooks).length, 0);
  });

  it('insert hook to validate', () => {
    hookManager.insert('before', 0, hello_world_hook_2);

    let before_hooks = hookManager.get('before');
    let expected = 1;
    assert.ok(before_hooks.length >= expected, `before_hooks length: ${before_hooks.length} >= ${expected}`);
    assert.strictEqual(before_hooks[0].name, hello_world_hook_2.name);
  });

  it('pop hook to validate', () => {
    hookManager.add('before', hello_world_hook_2);
    let before_hooks_before = Array.from(hookManager.get('before'));
    let before_hook_name = before_hooks_before[before_hooks_before.length - 1];
    hookManager.pop('before');

    let before_hooks_after = hookManager.get('before');
    assert.ok(before_hooks_after.length < before_hooks_before.length, `before_hooks length: ${before_hooks_after.length} < ${before_hooks_before.length}`);
    assert.notStrictEqual(before_hooks_after[before_hooks_after.length - 1].name, before_hook_name);
  });

  it('pop hook with no hooks', () => {
    hookManager.pop('after');

    let after_hooks = hookManager.get('after');
    assert.strictEqual(after_hooks.length, 0);
  });

  it('shift hook to validate', () => {
    hookManager.add('before', hello_world_hook_2);
    let before_hooks_before = Array.from(hookManager.get('before'));
    let before_hook_name = before_hooks_before[0];
    hookManager.shift('before');

    let before_hooks_after = hookManager.get('before');
    assert.ok(before_hooks_after.length < before_hooks_before.length, `before_hooks length: ${before_hooks_after.length} < ${before_hooks_before.length}`);
    assert.notStrictEqual(before_hooks_after[0].name, before_hook_name);
  });

  it('shift hook with no hooks', () => {
    hookManager.shift('after');

    let after_hooks = hookManager.get('after');
    assert.strictEqual(after_hooks.length, 0);
  });

  it('replace hook to validate', () => {
    let before_hooks_before = Array.from(hookManager.get('before'));
    let before_hook_name = before_hooks_before[0];
    hookManager.replace('before', {index: 0}, hello_world_hook_2);

    let before_hooks_after = hookManager.get('before');
    assert.ok(before_hooks_after.length === before_hooks_before.length, `before_hooks length: ${before_hooks_after.length} === ${before_hooks_before.length}`);
    assert.notStrictEqual(before_hooks_after[0].name, before_hook_name);
  });

  it('replace hook with no hooks', () => {
    hookManager.replace('after', {index: 0});

    let after_hooks = hookManager.get('after');
    assert.strictEqual(after_hooks.length, 0);
  });

  it('remove hook to validate', () => {
    let before_hooks_before = Array.from(hookManager.get('before'));
    hookManager.remove('before', 0);

    let before_hooks_after = hookManager.get('before');
    assert.ok(before_hooks_after.length < before_hooks_before.length, `before_hooks length: ${before_hooks_after.length} < ${before_hooks_before.length}`);
  });

  it('remove hook with no hooks', () => {
    hookManager.remove('after', 0);

    let after_hooks = hookManager.get('after');
    assert.strictEqual(after_hooks.length, 0);
  });

  it('removeAllByName hook to validate', () => {
    let before_hooks_before = Array.from(hookManager.get('before'));
    hookManager.removeAllByName('before');

    let before_hooks_after = hookManager.get('before');
    assert.ok(before_hooks_before.length > 0, `before_hooks_before length: ${before_hooks_before.length} > 0`);
    assert.ok(before_hooks_after.length === 0, `before_hooks length: ${before_hooks_after.length} === 0`);
  });

  it('removeAll hook to validate', () => {
    let before_hook_store = Object.assign({}, hookManager.hook_store);
    hookManager.removeAll();

    let after_hook_store = Object.assign({}, hookManager.hook_store);
    assert.notStrictEqual(JSON.stringify(after_hook_store), JSON.stringify(before_hook_store));
    assert.strictEqual(JSON.stringify(after_hook_store), JSON.stringify({}));
  });

  it('getKeys hook to validate', () => {
    let hook_store_keys = hookManager.getKeys();
    assert.strictEqual(String(hook_store_keys), String(['before']));

    let hook_store_before_keys = hookManager.getKeys('before');
    assert.strictEqual(String(hook_store_before_keys), String([]));

    hookManager.add('after.find', hello_world_hook);

    let hook_store_after_keys = hookManager.getKeys('after');
    assert.strictEqual(String(hook_store_after_keys), String(['find']));
  });

  it('mergeHookStore to validate', () => {
    const hookManagerInstance = new HookSystem({
      hook_store: {
        before: [hello_world_hook],
      },
    });
    hookManagerInstance.mergeHookStore({
      before: [
        {
          index: 0,
          value: hello_world_hook_2,
        },
        hello_world_hook_2,
      ],
      after: {},
    });
    let newHookStore = hookManagerInstance.mergeHookStore(0);
    let before_hooks = hookManagerInstance.get('before');
    assert.strictEqual(before_hooks.length, 3);
    assert.strictEqual(JSON.stringify(newHookStore), JSON.stringify({
      before: [hello_world_hook_2, hello_world_hook, hello_world_hook_2],
      after: {}
    }));
  });

  it('calls hooks in function to validate call method', async () => {
    function sleep(ms) {
      // eslint-disable-next-line no-unused-vars
      return new Promise((resolve, reject) => {
        return setTimeout(() => {
          // console.log(ms);
          return resolve(5);
        }, ms);
      });
    }

    async function test(context) {
      try {
        await hookManager.call({path: 'before', concurrent: context.num !== 0}, context);
      } catch (e) {
        context.error = e;
        await hookManager.call({path: 'error'}, context);
      }

      assert.ok(context.num < 0, `context.num: ${context.num} must be < 0`);

      context.num2 = await sleep(1000);
      context.total = context.num + context.num2;

      await hookManager.call({path: 'after', remove_hooks: context.remove_hooks}, context);
      await hookManager.call({path: 'error'}, context);
      return context;
    }

    hookManager.set('before', [
      (context) => {
        if (context.num === 0) {
          context.num = 1;
        }
      },
      (context) => {
        if (context.num > 0) {
          context.num *= -1;
        }
      },
    ]);
    hookManager.set('after', [
      // eslint-disable-next-line no-unused-vars
      (context) => {
        if (context.total !== 10) {
          context.total = 10;
        }
      },
    ]);

    let value = await test({num: 20});
    assert.ok(value.total === 10, `total: ${value.total} must be === 10`);

    value = await test({num: -20});
    assert.ok(value.total === 10, `total: ${value.total} must be === 10`);

    value = await test({num: 0, remove_hooks: true});
    assert.ok(value.total === 10, `total: ${value.total} must be === 10`);
  }).timeout(5000);
});
