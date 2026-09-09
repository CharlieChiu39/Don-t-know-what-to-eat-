const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { JSDOM } = require(process.argv[2] || 'jsdom');
const root = path.join(__dirname, '..');
const dom = new JSDOM(fs.readFileSync(path.join(root, 'index.html'), 'utf8'), {
  url: 'http://localhost/',
  runScripts: 'outside-only',
  pretendToBeVisual: true,
});
const w = dom.window;
const d = w.document;
w.HTMLCanvasElement.prototype.getContext = () =>
  new Proxy({}, { get: () => () => {} });
w.matchMedia = () => ({ matches: true });
w.HTMLDialogElement.prototype.showModal = function () {
  this.open = true;
};
w.HTMLDialogElement.prototype.close = function () {
  this.open = false;
  this.dispatchEvent(new w.Event('close'));
};
w.eval(
  ['data/restaurants.js', 'js/core.js', 'js/wheel.js', 'js/app.js']
    .map((file) => fs.readFileSync(path.join(root, file), 'utf8'))
    .join('\n'),
);
const $ = (id) => d.getElementById(id);
const open = (index) => d.querySelectorAll('.card-title')[index].click();
const close = () => $('close-result').click();
let checks = 0;
async function run() {
  for (const rejected of [false, true]) {
    let resolve, reject;
    Object.defineProperty(w.navigator, 'clipboard', {
      configurable: true,
      value: {
        writeText: () =>
          new Promise((ok, fail) => {
            resolve = ok;
            reject = fail;
          }),
      },
    });
    open(0);
    $('share-result').click();
    close();
    open(1);
    const name = $('result-name').textContent;
    rejected ? reject(new Error('denied')) : resolve();
    await new Promise(setImmediate);
    assert.equal($('result-name').textContent, name);
    assert.equal($('share-result').textContent, '分享這間 ↗');
    assert.equal($('share-fallback').hidden, true);
    close();
    checks++;
  }
  Object.defineProperty(w.navigator, 'clipboard', {
    configurable: true,
    value: {
      writeText: async () => {
        throw new Error('denied');
      },
    },
  });
  open(0);
  $('share-result').click();
  await new Promise(setImmediate);
  assert.equal($('share-fallback').hidden, false);
  assert.equal($('share-result').textContent, '請手動複製連結');
  assert.equal(d.activeElement.id, 'share-url');
  assert.match($('result-feedback').textContent, /無法自動複製/);
  checks++;
  w.Storage.prototype.setItem = () => {
    throw new Error('quota');
  };
  $('save-result').click();
  assert.equal($('result-feedback').hidden, false);
  assert.match($('result-feedback').textContent, /無法儲存/);
  assert.equal($('result-feedback').closest('dialog').open, true);
  checks++;
  close();
  $('search').value = 'no-such-restaurant-xyz';
  $('search').dispatchEvent(new w.Event('input'));
  $('empty-reset').focus();
  $('empty-reset').click();
  assert.equal(d.activeElement.id, 'search');
  assert.equal($('empty-state').hidden, true);
  checks++;
  console.log(
    `${checks} DOM integration scenarios passed (JSDOM; native dialog behavior checked separately in browser).`,
  );
}
run()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => w.close());
