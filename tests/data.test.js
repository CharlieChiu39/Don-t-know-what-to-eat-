// @ts-check
// 資料完整性檢查：新增或修改餐廳時，CI 會擋下格式錯誤。
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { AREAS, MEALS, PRICES, TAGS } from '../js/core/catalog.js';
import { DAY_KEYS, parseHours } from '../js/core/hours.js';
import { restaurants, trucks } from './helpers.js';

const tagIds = new Set(TAGS.map((t) => t.id));

test('ID 唯一且為正整數', () => {
  const ids = restaurants.map((r) => r.id);
  assert.ok(ids.every((id) => Number.isInteger(id) && id > 0));
  assert.equal(new Set(ids).size, ids.length);
});

test('每筆資料的列舉欄位都在 catalog 定義內', () => {
  const meals = new Set(MEALS.map((m) => m.id));
  const prices = new Set(PRICES.map((p) => p.id));
  for (const r of restaurants) {
    assert.ok(r.name.trim() && r.cuisine.trim(), `${r.id} 缺少名稱或口味`);
    assert.ok(r.meals.length && r.meals.every((m) => meals.has(m)), `${r.name} meals`);
    assert.ok(prices.has(r.price_range), `${r.name} price_range`);
    assert.ok(AREAS.includes(r.location), `${r.name} location`);
    assert.ok(r.tags.length && r.tags.every((t) => tagIds.has(t)), `${r.name} tags`);
    assert.equal(new Set(r.tags).size, r.tags.length, `${r.name} tags 重複`);
  }
});

test('每個標籤至少對應一間店，避免出現永遠空的篩選', () => {
  for (const tag of TAGS)
    assert.ok(restaurants.some((r) => r.tags.includes(tag.id)), tag.id);
});

test('所有時刻表都能解析：七天齊全，非 null 的值不可格式錯誤', () => {
  for (const r of restaurants) {
    for (const schedule of [r.openHours, r.legacyOpenHours]) {
      if (!schedule) continue;
      assert.deepEqual(Object.keys(schedule).sort(), [...DAY_KEYS].sort(), r.name);
      for (const value of Object.values(schedule))
        if (value !== null) assert.notEqual(parseHours(value), null, `${r.name}: ${value}`);
    }
    for (const [day, value] of Object.entries(r.specialHours ?? {})) {
      assert.match(day, /^\d{4}-\d{2}-\d{2}$/);
      assert.notEqual(parseHours(value), null, `${r.name} ${day}`);
    }
  }
});

test('地圖連結與民雄市區店家：都要附 Google 地圖頁', () => {
  for (const r of restaurants) {
    if (r.mapUrl) assert.equal(new URL(r.mapUrl).protocol, 'https:', r.name);
    if (r.location === '民雄市區') assert.ok(r.mapUrl, `${r.name} 缺少 mapUrl`);
  }
});

test('流動餐車：ID 唯一、欄位合法、附 https 來源', () => {
  assert.ok(trucks.length > 0);
  assert.equal(new Set(trucks.map((t) => t.id)).size, trucks.length);
  for (const t of trucks) {
    assert.ok(t.name.trim() && t.food.trim() && t.spot.trim() && t.schedule.trim(), t.id);
    assert.ok(AREAS.includes(t.location), `${t.name} location`);
    assert.ok(t.tags.length && t.tags.every((tag) => tagIds.has(tag)), `${t.name} tags`);
    assert.equal(new URL(t.source.url).protocol, 'https:', t.name);
    assert.match(t.source.postedAt, /^\d{4}-\d{2}-\d{2}$/);
    assert.match(t.checkedAt, /^\d{4}-\d{2}-\d{2}$/);
  }
});

test('查證資訊：已查證的店必須附 https 來源，公告必須有合法期間', () => {
  for (const r of restaurants) {
    assert.ok(['sourced', 'unconfirmed'].includes(r.verification.status), r.name);
    if (r.verification.status === 'sourced')
      assert.equal(new URL(r.verification.source ?? '').protocol, 'https:', r.name);
    for (const alert of r.serviceAlerts ?? []) {
      const from = new Date(alert.from);
      const to = new Date(alert.to);
      assert.ok(!Number.isNaN(from.getTime()) && from < to, `${r.name} 公告期間`);
    }
  }
});
