// @ts-check
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mealForMinute, NEARBY_AREAS } from '../js/core/catalog.js';
import { buildCandidates, countActiveFilters, DEFAULT_FILTERS, matchesArea } from '../js/core/filters.js';
import { describeStatus, formatDuration, formatNextOpening } from '../js/core/format.js';
import { openingStatus } from '../js/core/hours.js';
import { pickIndex, pushRecent, recencyWeight, secureRandom } from '../js/core/picker.js';
import { createIdStore, sanitizeIds } from '../js/core/storage.js';
import { readFilters, writeFilters } from '../js/core/url-state.js';
import { at, restaurants, shop } from './helpers.js';

/** @typedef {import('../js/types.js').Filters} Filters */

const none = new Set();
/** @param {Partial<Filters>} f */
const filters = (f) => ({ ...DEFAULT_FILTERS, ...f });

test('複合篩選：餐別、價位、區域、標籤（任一）同時成立', () => {
  const f = filters({ meal: 'dinner', price: 'cheap', area: '神農路', tags: ['noodles', 'luwei'], openOnly: false });
  const result = buildCandidates(restaurants, f, { now: at('2026-09-08T12:00'), blockedIds: none });
  assert.ok(result.length > 5);
  for (const { restaurant: r } of result) {
    assert.ok(r.meals.includes('dinner') && r.price_range === 'cheap' && r.location === '神農路');
    assert.ok(r.tags.includes('noodles') || r.tags.includes('luwei'));
  }
});

test('營業中篩選只留下可前往的店，且狀態與單獨計算一致', () => {
  const now = at('2026-09-08T12:00');
  const result = buildCandidates(restaurants, filters({}), { now, blockedIds: none });
  assert.ok(result.length > 0);
  for (const { restaurant, status } of result) {
    assert.ok(status.state === 'open' || status.state === 'likely');
    assert.deepEqual(status, openingStatus(restaurant, now));
  }
});

test('只看已查證 + 封鎖清單', () => {
  const blocked = new Set([1]);
  const result = buildCandidates(restaurants, filters({ verifiedOnly: true, openOnly: false }), {
    now: at('2026-09-08T12:00'),
    blockedIds: blocked,
  });
  assert.ok(result.every(({ restaurant: r }) => r.verification.status === 'sourced' && r.id !== 1));
  const all = new Set(restaurants.map((r) => r.id));
  assert.equal(buildCandidates(restaurants, filters({ openOnly: false }), { now: new Date(), blockedIds: all }).length, 0);
});

test('區域：預設只抽中正周邊，民雄市區要另外選或選不限', () => {
  const now = at('2026-09-08T12:00');
  const pick = (/** @type {Filters['area']} */ area) =>
    buildCandidates(restaurants, filters({ area, openOnly: false }), { now, blockedIds: none }).map((c) => c.restaurant);
  const nearby = pick('nearby');
  const downtown = pick('民雄市區');
  assert.ok(nearby.length > 0 && downtown.length > 0);
  assert.ok(nearby.every((r) => NEARBY_AREAS.includes(r.location)));
  assert.ok(downtown.every((r) => r.location === '民雄市區'));
  assert.equal(pick('all').length, nearby.length + downtown.length);
  assert.equal(DEFAULT_FILTERS.area, 'nearby');
  assert.equal(matchesArea('大學路', 'nearby'), true);
  assert.equal(matchesArea('民雄市區', 'nearby'), false);
  assert.equal(matchesArea('民雄市區', 'all'), true);
});

test('countActiveFilters 計算偏離預設的條件數', () => {
  assert.equal(countActiveFilters(DEFAULT_FILTERS), 0);
  assert.equal(countActiveFilters(filters({ meal: 'lunch', tags: ['rice', 'bento'], openOnly: false })), 4);
  assert.equal(countActiveFilters(filters({ area: 'all' })), 1);
});

test('網址參數來回轉換，並忽略不合法的值', () => {
  const f = filters({ meal: 'lunch', area: '校內', tags: ['noodles', 'bento'], openOnly: false });
  const params = writeFilters(f, new URLSearchParams('result=12'));
  assert.equal(params.get('result'), '12');
  assert.deepEqual({ ...DEFAULT_FILTERS, ...readFilters(params) }, f);
  assert.equal(writeFilters(DEFAULT_FILTERS).toString(), '');
  assert.deepEqual(readFilters(new URLSearchParams('meal=brunch&price=free&area=台北&tags=noodles,hack,noodles&open=maybe')), {
    tags: ['noodles'],
  });
  // 預設的中正周邊不寫進網址；不限與民雄市區要能分享
  assert.equal(writeFilters(filters({ area: 'all' })).get('area'), 'all');
  assert.deepEqual(readFilters(writeFilters(filters({ area: '民雄市區' }))), { area: '民雄市區' });
  assert.deepEqual(readFilters(new URLSearchParams('area=nearby')), { area: 'nearby' });
});

test('加權抽選：權重越低越少被抽中，random 可注入', () => {
  assert.equal(pickIndex([1, 1, 1], () => 0), 0);
  assert.equal(pickIndex([1, 1, 1], () => 0.999), 2);
  assert.equal(pickIndex([0.25, 1], () => 0.2), 1);
  assert.throws(() => pickIndex([0, 0]), RangeError);
  const counts = [0, 0];
  for (let i = 0; i < 20_000; i++) counts[pickIndex([0.25, 1])]++;
  const ratio = counts[0] / counts[1];
  assert.ok(ratio > 0.2 && ratio < 0.3, `比例 ${ratio}`);
  for (let i = 0; i < 1000; i++) {
    const value = secureRandom();
    assert.ok(value >= 0 && value < 1);
  }
});

test('最近吃過：去重、新的在前、最多 5 筆；越近權重越低', () => {
  assert.deepEqual(pushRecent([3, 2, 1], 2), [2, 3, 1]);
  assert.deepEqual(pushRecent([1, 2, 3, 4, 5], 6), [6, 1, 2, 3, 4]);
  assert.equal(recencyWeight(9, [1, 2]), 1);
  assert.ok(recencyWeight(1, [1, 2]) < recencyWeight(2, [1, 2]));
});

test('本機儲存：損壞、舊格式或無法寫入時安全降級', () => {
  const allowed = new Set([1, 2, 3]);
  for (const value of [null, {}, 'bad', 3]) assert.deepEqual(sanitizeIds(value, allowed), []);
  assert.deepEqual(sanitizeIds([1, 1, 2, '3', -1, 999, null], allowed), [1, 2]);

  /** @type {Map<string, string>} */
  const memory = new Map();
  const store = createIdStore({
    getItem: (k) => memory.get(k) ?? null,
    setItem: (k, v) => void memory.set(k, v),
  });
  assert.equal(store.write('ids', [1, 2]), true);
  assert.deepEqual(store.read('ids', allowed), [1, 2]);
  memory.set('ids', '{not json');
  assert.deepEqual(store.read('ids', allowed), []);

  const full = createIdStore({
    getItem: () => null,
    setItem: () => { throw new Error('QuotaExceededError'); },
  });
  assert.equal(full.write('ids', [1]), false);
  assert.equal(createIdStore(null).write('ids', [1]), false);
});

test('狀態文字：營業倒數、即將打烊、推估、下次營業、公告', () => {
  const now = at('2026-09-08T12:00');
  const r = shop({ tue: '11:00-14:00', wed: '11:00-14:00' });
  assert.deepEqual(describeStatus(openingStatus(r, now), now), {
    tone: 'open', badge: '營業中', detail: '今日 11:00-14:00・還有 2 小時',
  });
  const soon = at('2026-09-08T13:40');
  assert.equal(describeStatus(openingStatus(r, soon), soon).badge, '20 分後打烊');
  const night = at('2026-09-08T20:00');
  assert.deepEqual(describeStatus(openingStatus(r, night), night), {
    tone: 'closed', badge: '休息中', detail: '下次營業 明天 11:00',
  });
  assert.equal(formatNextOpening({ dayOffset: 3, minute: 690 }, at('2026-09-08T20:00')), '週五 11:30');
  assert.equal(formatDuration(45), '45 分鐘');
  assert.equal(formatDuration(130), '2 小時 10 分');
  const alertShop = shop({ tue: '11:00-14:00' }, {
    serviceAlerts: [{ from: '2026-09-08T00:00:00+08:00', to: '2026-09-09T00:00:00+08:00', note: '停電' }],
  });
  assert.deepEqual(describeStatus(openingStatus(alertShop, now), now), {
    tone: 'unknown', badge: '請先確認', detail: '停電',
  });
});

test('依時段推薦餐別', () => {
  const hm = (/** @type {number} */ h, m = 0) => h * 60 + m;
  assert.equal(mealForMinute(hm(7)), 'breakfast');
  assert.equal(mealForMinute(hm(10, 30)), 'lunch');
  assert.equal(mealForMinute(hm(15)), 'all');
  assert.equal(mealForMinute(hm(18)), 'dinner');
  assert.equal(mealForMinute(hm(23)), 'latenight');
  assert.equal(mealForMinute(hm(2)), 'latenight');
});
