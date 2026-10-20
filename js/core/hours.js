// @ts-check
// 營業時間判斷：純函式，瀏覽器與 Node 測試共用。所有時刻一律以台北時間解讀。

/** @typedef {import('../types.js').DayKey} DayKey */
/** @typedef {import('../types.js').WeeklyHours} WeeklyHours */
/** @typedef {import('../types.js').Restaurant} Restaurant */
/** @typedef {import('../types.js').OpeningStatus} OpeningStatus */
/** @typedef {import('../types.js').NextOpening} NextOpening */
/** @typedef {[start: number, end: number]} Range 當天第幾分鐘；end < start 代表跨夜 */

/** @type {readonly DayKey[]} */
export const DAY_KEYS = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];

/** 剩不到這麼多分鐘就提示「即將打烊」 */
export const CLOSING_SOON_MINUTES = 30;
/** 剩不到這麼多分鐘就不放進轉盤：走過去也來不及點餐 */
export const LAST_CALL_MINUTES = 15;

const MINUTES_PER_DAY = 24 * 60;
const DAY_MS = MINUTES_PER_DAY * 60 * 1000;
// 台灣沒有夏令時間，固定 UTC+8 即可，不必依賴 Intl 時區資料。
const TAIPEI_OFFSET_MS = 8 * 60 * 60 * 1000;

/**
 * @param {Date} date
 * @returns {{ day: number, minute: number, dateKey: string }}
 */
export function taipeiClock(date) {
  const shifted = new Date(date.getTime() + TAIPEI_OFFSET_MS);
  return {
    day: shifted.getUTCDay(),
    minute: shifted.getUTCHours() * 60 + shifted.getUTCMinutes(),
    dateKey: shifted.toISOString().slice(0, 10),
  };
}

/**
 * 解析單日時段。休息回傳空陣列；無法判斷（null 或格式錯誤）回傳 null。
 * @param {string | null | undefined} value
 * @returns {Range[] | null}
 */
export function parseHours(value) {
  if (value === '休息') return [];
  if (value === '24小時營業') return [[0, MINUTES_PER_DAY]];
  if (typeof value !== 'string' || !value.trim()) return null;
  /** @type {Range[]} */
  const ranges = [];
  for (const part of value.split('、')) {
    const match = part.trim().match(/^(\d{1,2}):(\d{2})\s*-\s*(\d{1,2}):(\d{2})$/);
    if (!match) return null;
    const [h1, m1, h2, m2] = match.slice(1).map(Number);
    if (h1 > 23 || h2 > 24 || m1 > 59 || m2 > 59 || (h2 === 24 && m2 !== 0)) return null;
    const start = h1 * 60 + m1;
    const end = h2 * 60 + m2;
    if (start === end) return null;
    ranges.push([start, end]);
  }
  return ranges;
}

/**
 * 取出相對於 date 第 offset 天的時段：單日調整優先於每週固定時段。
 * @param {WeeklyHours} weekly
 * @param {Record<string, string> | undefined} special
 * @param {Date} date
 * @param {number} offset
 */
function dayHours(weekly, special, date, offset) {
  const { day, dateKey } = taipeiClock(new Date(date.getTime() + offset * DAY_MS));
  const isSpecial = special !== undefined && Object.hasOwn(special, dateKey);
  const text = isSpecial ? special[dateKey] : weekly[DAY_KEYS[day]];
  return { text: text ?? '', isSpecial, ranges: parseHours(text) };
}

/**
 * 從現在往後找下一次開門時間，最多看 7 天；遇到未知的日子就放棄。
 * @param {WeeklyHours} weekly
 * @param {Record<string, string> | undefined} special
 * @param {Date} date
 * @returns {NextOpening | null}
 */
function nextOpening(weekly, special, date) {
  const { minute } = taipeiClock(date);
  for (let offset = 0; offset <= 7; offset++) {
    const { ranges } = dayHours(weekly, special, date, offset);
    if (ranges === null) return null;
    const starts = ranges.map(([start]) => start).filter((start) => offset > 0 || start > minute);
    if (starts.length) return { dayOffset: offset, minute: Math.min(...starts) };
  }
  return null;
}

/**
 * 依單一時刻表判斷營業狀態（不處理公告與舊資料備援）。
 * @param {WeeklyHours} weekly
 * @param {Record<string, string> | undefined} special
 * @param {Date} date
 * @returns {OpeningStatus}
 */
function evaluate(weekly, special, date) {
  const { minute } = taipeiClock(date);
  const today = dayHours(weekly, special, date, 0);
  const yesterday = dayHours(weekly, special, date, -1);

  /** @type {(hours: string, minutesLeft: number | null) => OpeningStatus} */
  const open = (hours, minutesLeft) => ({ state: 'open', estimated: false, hours, minutesLeft, next: null });

  // 昨晚的跨夜時段延續到今天凌晨
  const spill = yesterday.ranges?.find(([start, end]) => end < start && minute < end);
  if (spill) return open(yesterday.text, spill[1] - minute);

  const current = today.ranges?.find(([start, end]) => minute >= start && (end < start || minute < end));
  if (current) {
    const [start, end] = current;
    if (start === 0 && end === MINUTES_PER_DAY) return open(today.text, null);
    return open(today.text, end < start ? MINUTES_PER_DAY - minute + end : end - minute);
  }

  // 前一天未知時無法排除跨夜營業，不把不確定的狀態當成休息。
  if (today.ranges === null || yesterday.ranges === null) {
    return { state: 'unknown', estimated: false, hours: '', minutesLeft: null, next: null };
  }

  /** @type {OpeningStatus['reason']} */
  let reason;
  if (today.text === '休息') reason = today.isSpecial ? 'special-closure' : 'day-off';
  return {
    state: 'closed',
    estimated: false,
    hours: today.text,
    minutesLeft: null,
    next: nextOpening(weekly, special, date),
    reason,
  };
}

/**
 * 綜合服務公告、已查證時刻表與舊時刻表，判斷某間店此刻的狀態。
 * @param {Restaurant} restaurant
 * @param {Date} [date]
 * @returns {OpeningStatus}
 */
export function openingStatus(restaurant, date = new Date()) {
  const alert = restaurant.serviceAlerts?.find(
    (item) => date >= new Date(item.from) && date < new Date(item.to),
  );
  if (alert) {
    return {
      state: 'unknown',
      estimated: false,
      hours: alert.note,
      minutesLeft: null,
      next: null,
      reason: 'alert',
      source: alert.source,
    };
  }

  const verified = evaluate(restaurant.openHours, restaurant.specialHours, date);
  if (verified.reason === 'special-closure') verified.source = restaurant.specialHoursSource;
  if (verified.state !== 'unknown' || !restaurant.legacyOpenHours) return verified;

  // 沒有查證過的時刻表：退而使用舊資料推估，並明確標示為推估。
  const legacy = evaluate(restaurant.legacyOpenHours, restaurant.specialHours, date);
  if (legacy.state === 'open') return { ...legacy, state: 'likely', estimated: true };
  if (legacy.state === 'closed') return { ...legacy, estimated: true };
  return verified;
}

/**
 * 是否適合放進「營業中」的轉盤：已查證或推估營業，且不是快要打烊。
 * @param {OpeningStatus} status
 */
export function isAvailable(status) {
  if (status.state !== 'open' && status.state !== 'likely') return false;
  return status.minutesLeft === null || status.minutesLeft >= LAST_CALL_MINUTES;
}

/** @param {OpeningStatus} status */
export function isClosingSoon(status) {
  return (
    (status.state === 'open' || status.state === 'likely') &&
    status.minutesLeft !== null &&
    status.minutesLeft <= CLOSING_SOON_MINUTES
  );
}
