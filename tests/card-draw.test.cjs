const { test } = require('node:test');
const assert = require('node:assert/strict');
const vm = require('node:vm');
const fs = require('node:fs');
const path = require('node:path');

function setup(animate) {
  const document = { createElement: () => ({ append() {}, animate }) };
  const context = { document, module: { exports: {} } };
  vm.runInNewContext(
    fs.readFileSync(path.join(__dirname, '../js/card-draw.js'), 'utf8'),
    context,
  );
  const stage = { hidden: true, animate, replaceChildren() {} };
  const draw = new context.module.exports(stage);
  draw.setItems([
    { id: 1, name: 'A' },
    { id: 2, name: 'B' },
  ]);
  return { draw, stage };
}

test('reduced motion and missing animation support deliver the selected result once', async () => {
  for (const reduce of [true, false]) {
    const { draw, stage } = setup();
    const results = [];
    await draw.spin(1, (result) => results.push(result.id), reduce);
    assert.deepEqual(results, [2]);
    assert.equal(stage.hidden, true);
    assert.equal(draw.spinning, false);
  }
});

test('a draw freezes its pool and ignores overlapping requests', async () => {
  const releases = [];
  const { draw, stage } = setup(() => ({
    finished: new Promise((resolve) => releases.push(resolve)),
  }));
  const results = [];
  const pending = draw.spin(1, (result) => results.push(result.id));
  draw.setItems([{ id: 99 }]);
  await draw.spin(0, (result) => results.push(result.id));
  assert.equal(stage.hidden, false);
  assert.equal(draw.items.length, 2);
  releases.forEach((resolve) => resolve());
  await pending;
  assert.deepEqual(results, [2]);
  assert.equal(stage.hidden, true);
});

test('animation failure cannot leave the draw locked or lose the result', async () => {
  const { draw } = setup(() => {
    throw new Error('Animation unavailable');
  });
  let winner;
  await draw.spin(0, (result) => {
    winner = result.id;
  });
  assert.equal(winner, 1);
  assert.equal(draw.spinning, false);
});

test('ceremonial draw holds the chosen card after passing others', async () => {
  const calls = [];
  const { draw } = setup((_frames, options) => {
    calls.push(options);
    return { finished: Promise.resolve() };
  });
  let winner;
  await draw.spin(0, (result) => {
    winner = result.id;
  });
  assert.equal(winner, 1);
  assert.ok(calls.length >= 5);
  const last = calls[calls.length - 1];
  assert.ok(last.duration > last.delay);
  assert.equal(draw.draws, 1);
});
