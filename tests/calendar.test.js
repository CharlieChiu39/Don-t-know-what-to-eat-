// @ts-check
// 校方行事曆（寒暑假、國定假日）與「營業時間是否查證」的判斷。
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { describeStatus } from '../js/core/format.js';
import { calendarStatus, hasVerifiedHours, openingStatus } from '../js/core/hours.js';
import { at, byId, restaurants, shop } from './helpers.js';

/** @type {import('../js/types.js').SchoolCalendar} */
const calendar = JSON.parse(readFileSync(new URL('../data/calendar.json', import.meta.url), 'utf8'));
const DATE = /^\d{4}-\d{2}-\d{2}$/;

test('行事曆資料：日期格式、區間順序、https 來源', () => {
  assert.equal(new URL(calendar.source).protocol, 'https:');
  assert.match(calendar.checkedAt, DATE);
  for (const b of calendar.breaks) {
    assert.match(b.from, DATE);
    assert.match(b.to, DATE);
    assert.ok(b.from <= b.to, b.name);
  }
  const days = calendar.holidays.map((h) => h.date);
  for (const day of days) assert.match(day, DATE);
  assert.deepEqual(days, [...new Set(days)].sort(), '國定假日需依日期排序且不重複');
});

test('行事曆資料：政策只列校內店家，且兩種政策不重疊', () => {
  const closed = calendar.campusPolicies['closed-on-break'];
  const check = calendar.campusPolicies['check-on-break'];
  assert.equal(new Set([...closed, ...check]).size, closed.length + check.length);
  for (const id of [...closed, ...check]) assert.equal(byId(id).location, '校內', String(id));
  // 每間校內店都要有寒暑假政策，避免寒假時被誤判營業
  for (const r of restaurants.filter((x) => x.location === '校內'))
    assert.ok(closed.includes(r.id) || check.includes(r.id), `${r.name} 缺少寒暑假政策`);
});

test('寒假：確定暫停的店顯示休息與恢復日；需確認的店變成未知', () => {
  const winter = at('2027-01-26T12:00');
  const closed = openingStatus(byId(10), winter, calendar);
  assert.equal(closed.state, 'closed');
  assert.equal(closed.reason, 'break');
  assert.deepEqual(describeStatus(closed, winter), {
    tone: 'closed', badge: '寒假暫停營業', detail: '預計 2/22 起恢復・依校方行事曆',
  });
  const check = openingStatus(byId(4), winter, calendar);
  assert.equal(check.state, 'unknown');
  assert.equal(check.reason, 'break-check');
  assert.equal(describeStatus(check, winter).badge, '寒假・請先確認');
});

test('寒假：校外店家不受行事曆影響；寒假前後恢復一般時刻表', () => {
  const winter = at('2027-01-26T12:00');
  for (const r of restaurants.filter((x) => x.location !== '校內'))
    assert.deepEqual(openingStatus(r, winter, calendar), openingStatus(r, winter), r.name);
  assert.equal(calendarStatus(byId(10), at('2027-01-08T12:00'), calendar), null);
  assert.equal(calendarStatus(byId(10), at('2027-01-09T00:00'), calendar)?.reason, 'break');
  assert.equal(calendarStatus(byId(10), at('2027-02-21T23:59'), calendar)?.reason, 'break');
  assert.equal(calendarStatus(byId(10), at('2027-02-22T00:00'), calendar), null);
});

test('國定假日：校內店家標示請先確認，學期中一般日不受影響', () => {
  const holiday = at('2026-10-26T12:00');
  const status = openingStatus(byId(4), holiday, calendar);
  assert.equal(status.reason, 'holiday');
  assert.equal(describeStatus(status, holiday).badge, '臺灣光復節補假・請先確認');
  const term = at('2026-09-15T12:00');
  for (const r of restaurants) assert.deepEqual(openingStatus(r, term, calendar), openingStatus(r, term), r.name);
});

test('店家有當天的明確公告（specialHours）時，以公告為準', () => {
  const r = { ...byId(10), specialHours: { '2027-01-26': '11:00-14:00' } };
  const status = openingStatus(r, at('2027-01-26T12:00'), calendar);
  assert.equal(status.state, 'open');
});

test('營業時間查證：只核對名稱地址、openHours 全空的店不算已查證', () => {
  const nullDays = { sun: null, mon: null, tue: null, wed: null, thu: null, fri: null, sat: null };
  assert.equal(hasVerifiedHours(shop({ tue: '11:00-14:00' })), true);
  assert.equal(hasVerifiedHours(shop({}, { openHours: nullDays, verification: { status: 'sourced' } })), false);
  for (const r of restaurants)
    if (hasVerifiedHours(r)) assert.equal(r.verification.status, 'sourced', `${r.name} 有時刻表卻沒有來源`);
});

test('可能營業：顯示依舊資料推算的剩餘時間，快打烊時與確定營業的提示分開', () => {
  const nullDays = { sun: null, mon: null, tue: null, wed: null, thu: null, fri: null, sat: null };
  const legacy = shop({}, {
    openHours: nullDays,
    legacyOpenHours: { ...nullDays, mon: '休息', tue: '11:00-20:00' },
    verification: { status: 'unconfirmed' },
  });
  const noon = at('2026-09-08T12:00');
  assert.deepEqual(describeStatus(openingStatus(legacy, noon), noon), {
    tone: 'likely', badge: '可能營業', detail: '舊資料 11:00-20:00・約剩 8 小時・未查證',
  });
  const late = at('2026-09-08T19:40');
  assert.equal(describeStatus(openingStatus(legacy, late), late).badge, '可能 20 分後打烊');
  assert.equal(describeStatus(openingStatus(legacy, late), late).tone, 'likely');
});
