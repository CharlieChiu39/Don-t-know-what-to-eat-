const { test } = require('node:test');
const assert = require('node:assert/strict');
const Wheel = require('../js/wheel.js');

test('連續轉動精確命中扇形，轉動中不可換清單或重入', () => {
  const ctx = new Proxy({}, { get: () => () => {} });
  const wheel = new Wheel({ width: 800, height: 800, getContext: () => ctx });
  const frames = [];
  global.requestAnimationFrame = (callback) => frames.push(callback);
  const items = Array.from({ length: 17 }, (_, id) => ({
    id,
    name: `店家${id}`,
  }));
  wheel.setItems(items);
  for (const target of [3, 0, 16, 7, 7]) {
    let winner;
    wheel.spin(target, (value) => {
      winner = value;
    });
    wheel.setItems([]);
    wheel.spin(1, () => assert.fail('不應重入'));
    assert.equal(wheel.items.length, 17);
    let timestamp = 0;
    while (frames.length) {
      frames.shift()(timestamp);
      timestamp += 500;
    }
    assert.equal(winner.id, target);
    const normalized =
      ((-wheel.angle % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
    assert.equal(
      Math.floor(normalized / ((2 * Math.PI) / items.length)),
      target,
    );
    assert.equal(wheel.spinning, false);
  }
  let reducedWinner;
  wheel.spin(
    4,
    (value) => {
      reducedWinner = value;
    },
    true,
  );
  frames.shift()(0);
  assert.equal(reducedWinner.id, 4);
  assert.equal(frames.length, 0);
  delete global.requestAnimationFrame;
});
