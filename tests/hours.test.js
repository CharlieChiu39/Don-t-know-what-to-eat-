// @ts-check
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { isAvailable, isClosingSoon, openingStatus, parseHours, taipeiClock } from '../js/core/hours.js';
import { at, byId, shop } from './helpers.js';

const unknownDays = /** @type {const} */ ({
  sun: null, mon: null, tue: null, wed: null, thu: null, fri: null, sat: null,
});

test('parseHours：分段、跨夜、24 小時與不合法格式', () => {
  assert.deepEqual(parseHours('11:00-14:00、17:00-21:00'), [[660, 840], [1020, 1260]]);
  assert.deepEqual(parseHours('18:00-02:00'), [[1080, 120]]);
  assert.deepEqual(parseHours('07:00-24:00'), [[420, 1440]]);
  assert.deepEqual(parseHours('24小時營業'), [[0, 1440]]);
  assert.deepEqual(parseHours('休息'), []);
  for (const bad of [null, undefined, '', 'garbage', '25:00-26:00', '11:00-11:00', '10:00-24:30'])
    assert.equal(parseHours(bad), null, String(bad));
});

test('taipeiClock 以 UTC+8 換日，不受執行環境時區影響', () => {
  assert.deepEqual(taipeiClock(new Date('2026-09-08T04:00:00Z')), { day: 2, minute: 720, dateKey: '2026-09-08' });
  assert.deepEqual(taipeiClock(new Date('2026-09-14T16:30:00Z')), { day: 2, minute: 30, dateKey: '2026-09-15' });
});

test('開始時刻包含、結束時刻排除，並計算距離打烊時間', () => {
  const r = shop({ tue: '11:00-14:00、17:00-21:00' });
  for (const time of ['11:00', '13:59', '17:00', '20:59'])
    assert.equal(openingStatus(r, at(`2026-09-08T${time}`)).state, 'open', time);
  for (const time of ['10:59', '14:00', '16:59', '21:00'])
    assert.equal(openingStatus(r, at(`2026-09-08T${time}`)).state, 'closed', time);
  assert.equal(openingStatus(r, at('2026-09-08T12:30')).minutesLeft, 90);
});

test('休息時提供下一次營業時間：今天稍晚、隔天或跳過公休日', () => {
  const r = shop({ tue: '11:00-14:00、17:00-21:00', thu: '11:00-14:00' });
  assert.deepEqual(openingStatus(r, at('2026-09-08T15:00')).next, { dayOffset: 0, minute: 1020 });
  assert.deepEqual(openingStatus(r, at('2026-09-08T22:00')).next, { dayOffset: 2, minute: 660 });
  const dayOff = openingStatus(r, at('2026-09-09T12:00'));
  assert.equal(dayOff.reason, 'day-off');
  assert.deepEqual(dayOff.next, { dayOffset: 1, minute: 660 });
  const unknownAhead = shop({ tue: '11:00-14:00', wed: null });
  assert.equal(openingStatus(unknownAhead, at('2026-09-08T15:00')).next, null);
});

test('跨夜時段歸前一天：今天公休仍延續，今晚時段不算進今天凌晨', () => {
  const r = shop({ mon: '18:00-02:00', tue: '休息', wed: '18:00-02:00' });
  const lateNight = openingStatus(r, at('2026-09-08T01:00'));
  assert.equal(lateNight.state, 'open');
  assert.equal(lateNight.minutesLeft, 60);
  assert.equal(openingStatus(r, at('2026-09-08T02:00')).state, 'closed');
  assert.equal(openingStatus(r, at('2026-09-09T01:00')).state, 'closed');
  assert.equal(openingStatus(r, at('2026-09-09T23:00')).minutesLeft, 180);
  assert.equal(openingStatus(shop({ mon: '11:00-00:00' }), at('2026-09-08T00:00')).state, 'closed');
});

test('未知資料不宣稱營業；24 小時營業沒有打烊倒數', () => {
  assert.equal(openingStatus(shop({ tue: null }), at('2026-09-08T12:00')).state, 'unknown');
  // 前一天未知時無法排除跨夜營業
  assert.equal(openingStatus(shop({ mon: null, tue: '18:00-22:00' }), at('2026-09-08T01:00')).state, 'unknown');
  const allDay = openingStatus(shop({ tue: '24小時營業' }), at('2026-09-08T23:50'));
  assert.equal(allDay.state, 'open');
  assert.equal(allDay.minutesLeft, null);
  assert.equal(isClosingSoon(allDay), false);
});

test('舊時刻表只用來推估，並標示 estimated', () => {
  const legacy = shop({}, {
    openHours: unknownDays,
    legacyOpenHours: { ...unknownDays, mon: '休息', tue: '11:00-20:00' },
    verification: { status: 'unconfirmed' },
  });
  const likely = openingStatus(legacy, at('2026-09-08T12:00'));
  assert.equal(likely.state, 'likely');
  assert.equal(likely.estimated, true);
  assert.equal(likely.hours, '11:00-20:00');
  const closed = openingStatus(legacy, at('2026-09-08T21:00'));
  assert.equal(closed.state, 'closed');
  assert.equal(closed.estimated, true);
  // 舊資料也沒有那天的時段 → 維持未知
  assert.equal(openingStatus(legacy, at('2026-09-09T12:00')).state, 'unknown');
});

test('isAvailable：營業中或推估營業，但剩不到 15 分鐘就不放進轉盤', () => {
  const r = shop({ tue: '11:00-14:00' });
  assert.equal(isAvailable(openingStatus(r, at('2026-09-08T13:44'))), true);
  assert.equal(isAvailable(openingStatus(r, at('2026-09-08T13:46'))), false);
  assert.equal(isClosingSoon(openingStatus(r, at('2026-09-08T13:30'))), true);
  assert.equal(isClosingSoon(openingStatus(r, at('2026-09-08T13:29'))), false);
  assert.equal(isAvailable(openingStatus(r, at('2026-09-08T15:00'))), false);
});

test('真實資料：日期限定時段以台灣日期生效，結束後恢復每週時刻表', () => {
  const louisa = byId(6);
  assert.equal(openingStatus(louisa, new Date('2026-09-09T23:30:00Z')).state, 'closed');
  assert.equal(openingStatus(louisa, at('2026-09-10T08:00')).state, 'open');
  assert.equal(openingStatus(louisa, at('2026-09-12T17:00')).state, 'closed');
  assert.equal(openingStatus(louisa, at('2026-09-14T07:30')).state, 'open');

  const base = byId(13);
  const closure = openingStatus(base, at('2026-09-09T12:00'));
  assert.equal(closure.reason, 'special-closure');
  assert.match(closure.source ?? '', /^https:/);
  assert.equal(openingStatus(base, at('2026-09-16T12:00')).state, 'open');

  const overnight = shop({ mon: '18:00-02:00' }, { specialHours: { '2026-09-07': '休息' } });
  assert.equal(openingStatus(overnight, at('2026-09-08T01:00')).state, 'closed');
});

test('真實資料：9/20 停水停電只把公告時段標為待確認', () => {
  const family = byId(1);
  for (const time of ['2026-09-20T07:00', '2026-09-20T17:59']) {
    const status = openingStatus(family, at(time));
    assert.equal(status.state, 'unknown');
    assert.equal(status.reason, 'alert');
  }
  assert.equal(openingStatus(family, at('2026-09-20T18:00')).state, 'open');
  assert.equal(openingStatus(family, at('2026-09-21T12:00')).state, 'open');
});

test('真實資料：Google 地圖時段的跨夜營業與公休日', () => {
  // 楊家豆漿：週五 17:00 開到週六 02:00，週六公休
  const soy = byId(14);
  assert.equal(openingStatus(soy, at('2026-09-12T01:00')).state, 'open');
  assert.equal(openingStatus(soy, at('2026-09-12T20:00')).reason, 'day-off');
  assert.equal(openingStatus(soy, at('2026-09-13T01:00')).state, 'closed');

  // 二吉軒：每天 17:00 開到隔天 11:00（Google 原始資料拆成兩段，匯入時合併成跨夜）
  const overnight = byId(131);
  assert.equal(overnight.openHours.tue, '17:00-11:00');
  assert.equal(openingStatus(overnight, at('2026-09-08T02:00')).state, 'open');
  assert.equal(openingStatus(overnight, at('2026-09-08T10:30')).minutesLeft, 30);
  const noon = openingStatus(overnight, at('2026-09-08T12:00'));
  assert.equal(noon.state, 'closed');
  assert.deepEqual(noon.next, { dayOffset: 0, minute: 17 * 60 });
});

test('真實資料：校內午餐據點晚上不會被判定為營業', () => {
  for (const id of [9, 10, 82, 83])
    assert.notEqual(openingStatus(byId(id), at('2026-09-10T18:00')).state, 'open', String(id));
});
