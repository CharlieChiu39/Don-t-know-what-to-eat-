const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const {
  openingStatus,
  parseHours,
  filterRestaurants,
  validIds,
  taipeiTime,
} = require('../js/core.js');
const sandbox = { window: {} };
vm.runInNewContext(
  fs.readFileSync(require.resolve('../data/restaurants.js'), 'utf8'),
  sandbox,
);
const restaurants = JSON.parse(JSON.stringify(sandbox.window.RESTAURANTS));
const date = (value) => new Date(value + '+08:00');
const shop = (hours) => ({
  openHours: {
    sun: '休息',
    mon: '休息',
    tue: '休息',
    wed: '休息',
    thu: '休息',
    fri: '休息',
    sat: '休息',
    ...hours,
  },
});

test('84 筆餐廳資料可用且 ID 唯一，所有現行時段皆可解析', () => {
  assert.equal(restaurants.length, 84);
  assert.equal(new Set(restaurants.map((r) => r.id)).size, restaurants.length);
  for (const r of restaurants) {
    assert.ok(r.name && r.cuisine && r.meals.length && r.location);
    assert.ok(['cheap', 'medium', 'expensive', 'unknown'].includes(r.price_range));
    for (const hours of Object.values(r.openHours || {}))
      if (hours !== null)
        assert.notEqual(parseHours(hours), null, `${r.name}: ${hours}`);
  }
});
test('未核實舊時刻表不會混入營業中，新店保留來源及未知欄位', () => {
  const unconfirmed = restaurants.filter(r => r.verification.status === 'unconfirmed');
  assert.equal(unconfirmed.length, 64);
  for (const r of unconfirmed) {
    assert.ok(r.legacyOpenHours);
    assert.equal(openingStatus(r, date('2026-09-10T12:00:00')).state, 'unknown');
  }
  for (const r of restaurants.filter(r => r.verification.status === 'sourced')) {
    assert.ok(new URL(r.verification.source).protocol === 'https:');
    assert.equal(r.verification.checkedAt, '2026-09-10');
  }
  assert.equal(openingStatus(restaurants.find(r => r.id === 84), date('2026-09-10T09:00:00')).state, 'unknown');
});
test('日期限定時段以台灣日期生效，結束後恢復一般時刻表', () => {
  const louisa = restaurants.find(r => r.id === 6);
  assert.equal(openingStatus(louisa, new Date('2026-09-09T23:30:00Z')).state, 'closed');
  assert.equal(openingStatus(louisa, date('2026-09-10T08:00:00')).state, 'open');
  assert.equal(openingStatus(louisa, date('2026-09-12T17:00:00')).state, 'closed');
  assert.equal(openingStatus(louisa, date('2026-09-14T07:30:00')).state, 'open');
  const base = restaurants.find(r => r.id === 13);
  assert.equal(openingStatus(base, date('2026-09-09T12:00:00')).label, '今日臨時店休');
  assert.equal(openingStatus(base, date('2026-09-16T12:00:00')).state, 'open');
  const overnight = {...shop({mon:'18:00-02:00'}),specialHours:{'2026-09-07':'休息'}};
  assert.equal(openingStatus(overnight, date('2026-09-08T01:00:00')).state, 'closed');
});
test('停水停電只標示公告時段待確認，不永久關閉店家或影響校外', () => {
  const family = restaurants.find(r => r.id === 1);
  assert.equal(openingStatus(family, date('2026-09-20T07:00:00')).state, 'unknown');
  assert.equal(openingStatus(family, date('2026-09-20T17:59:00')).state, 'unknown');
  assert.equal(openingStatus(family, date('2026-09-20T18:00:00')).state, 'open');
  assert.equal(openingStatus(family, date('2026-09-21T12:00:00')).state, 'open');
  const open = filterRestaurants(restaurants, {openOnly:true}, date('2026-09-20T12:00:00'));
  assert.ok(open.some(r => r.id === 70));
  assert.ok(open.every(r => r.location !== '校內'));
});
test('核對後的校內午餐時段與隔週休不被誤判成晚餐或固定週六營業', () => {
  for (const id of [9,10,82,83]) {
    const r = restaurants.find(r => r.id === id);
    assert.deepEqual(r.meals, ['lunch']);
    assert.notEqual(openingStatus(r, date('2026-09-10T18:00:00')).state, 'open');
  }
  assert.equal(openingStatus(restaurants.find(r=>r.id===3), date('2026-09-12T12:00:00')).state, 'unknown');
});
test('台灣時區、分段與開始包含／結束排除', () => {
  assert.deepEqual(taipeiTime(new Date('2026-09-08T04:00:00Z')), {
    day: 2,
    minute: 720,
  });
  const r = shop({ tue: '11:00-14:00、17:00-21:00' });
  for (const time of ['11:00', '13:59', '17:00', '20:59'])
    assert.equal(openingStatus(r, date(`2026-09-08T${time}:00`)).state, 'open');
  for (const time of ['10:59', '14:00', '16:59', '21:00'])
    assert.equal(
      openingStatus(r, date(`2026-09-08T${time}:00`)).state,
      'closed',
    );
});
test('跨夜營業歸前一天，即使今天公休仍延續；不把今晚時段算到今天凌晨', () => {
  const r = shop({ mon: '18:00-02:00', tue: '休息', wed: '18:00-02:00' });
  assert.equal(openingStatus(r, date('2026-09-08T01:00:00')).state, 'open');
  assert.equal(openingStatus(r, date('2026-09-08T02:00:00')).state, 'closed');
  assert.equal(openingStatus(r, date('2026-09-09T01:00:00')).state, 'closed');
  assert.equal(openingStatus(r, date('2026-09-09T18:00:00')).state, 'open');
  assert.equal(
    openingStatus(shop({ sun: '18:00-02:00' }), date('2026-09-07T01:00:00'))
      .state,
    'open',
  );
});
test('未知與不合法時刻不可宣稱營業中，24 小時與午夜可正確處理', () => {
  assert.equal(openingStatus({}, date('2026-09-08T12:00:00')).state, 'unknown');
  assert.equal(
    openingStatus(shop({ mon: null }), date('2026-09-08T01:00:00')).state,
    'unknown',
  );
  assert.equal(parseHours('garbage'), null);
  assert.equal(parseHours('25:00-26:00'), null);
  assert.equal(parseHours('11:00-11:00'), null);
  assert.equal(
    openingStatus(shop({ tue: '24小時營業' }), date('2026-09-08T00:00:00'))
      .state,
    'open',
  );
  assert.equal(
    openingStatus(shop({ mon: '11:00-00:00' }), date('2026-09-08T00:00:00'))
      .state,
    'closed',
  );
});
test('複合篩選、搜尋、收藏、排除與待恢復清單共用一致的條件', () => {
  const filters = {
    meal: 'dinner',
    price: 'cheap',
    location: '神農路',
    cuisine: '台式',
    query: '麵',
    blockedIds: [17],
  };
  const result = filterRestaurants(restaurants, filters);
  assert.ok(result.length);
  assert.ok(
    result.every(
      (r) =>
        r.meals.includes('dinner') &&
        r.price_range === 'cheap' &&
        r.location === '神農路' &&
        r.cuisine === '台式' &&
        (r.name + r.note).includes('麵') &&
        r.id !== 17,
    ),
  );
  assert.deepEqual(
    filterRestaurants(restaurants, {
      view: 'saved',
      savedIds: [1, 2],
      blockedIds: [2],
    }).map((r) => r.id),
    [1],
  );
  assert.deepEqual(
    filterRestaurants(restaurants, { view: 'blocked', blockedIds: [2] }).map(
      (r) => r.id,
    ),
    [2],
  );
  const open = filterRestaurants(
    restaurants,
    { openOnly: true },
    date('2026-09-08T12:00:00'),
  );
  assert.ok(open.length);
  assert.ok(
    open.every(
      (r) => openingStatus(r, date('2026-09-08T12:00:00')).state === 'open',
    ),
  );
  assert.equal(
    filterRestaurants(restaurants, { query: '找不到這間xyz' }).length,
    0,
  );
  assert.equal(
    filterRestaurants(restaurants, { blockedIds: restaurants.map((r) => r.id) })
      .length,
    0,
  );
});
test('損壞或舊的本機儲存值會被清理', () => {
  for (const value of [null, {}, 'bad', 3])
    assert.deepEqual(validIds(value, restaurants), []);
  assert.deepEqual(
    validIds([1, 1, 2, '3', -1, 999, null], restaurants),
    [1, 2],
  );
});
