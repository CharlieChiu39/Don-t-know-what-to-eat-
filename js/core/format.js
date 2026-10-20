// @ts-check
// 把營業狀態轉成畫面文字。與 DOM 無關，方便測試。

import { isClosingSoon, taipeiClock } from './hours.js';

/** @typedef {import('../types.js').OpeningStatus} OpeningStatus */
/** @typedef {import('../types.js').NextOpening} NextOpening */
/** @typedef {'open' | 'soon' | 'likely' | 'closed' | 'unknown'} StatusTone */

const WEEKDAY = ['日', '一', '二', '三', '四', '五', '六'];

/** @param {number} minute */
export function formatClock(minute) {
  const h = Math.floor(minute / 60) % 24;
  const m = minute % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

/** @param {number} minutes */
export function formatDuration(minutes) {
  if (minutes < 60) return `${minutes} 分鐘`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m ? `${h} 小時 ${m} 分` : `${h} 小時`;
}

/**
 * @param {NextOpening} next
 * @param {Date} now
 */
export function formatNextOpening(next, now) {
  const time = formatClock(next.minute);
  if (next.dayOffset === 0) return `今天 ${time}`;
  if (next.dayOffset === 1) return `明天 ${time}`;
  const { day } = taipeiClock(new Date(now.getTime() + next.dayOffset * 86_400_000));
  return `週${WEEKDAY[day]} ${time}`;
}

/**
 * @param {OpeningStatus} status
 * @param {Date} now
 * @returns {{ tone: StatusTone, badge: string, detail: string }}
 */
export function describeStatus(status, now) {
  if (status.reason === 'alert') {
    return { tone: 'unknown', badge: '請先確認', detail: status.hours };
  }
  if (status.state === 'open' || status.state === 'likely') {
    const allDay = status.minutesLeft === null;
    const today = allDay ? '24 小時營業' : `今日 ${status.hours}`;
    if (isClosingSoon(status) && status.minutesLeft !== null) {
      return { tone: 'soon', badge: `${status.minutesLeft} 分後打烊`, detail: today };
    }
    if (status.state === 'likely') {
      return { tone: 'likely', badge: '可能營業', detail: `舊資料 ${status.hours}・未查證` };
    }
    const left = allDay ? '' : `・還有 ${formatDuration(status.minutesLeft ?? 0)}`;
    return { tone: 'open', badge: '營業中', detail: today + left };
  }
  if (status.state === 'closed') {
    const badge =
      status.reason === 'special-closure' ? '今日臨時店休'
        : status.reason === 'day-off' ? '今日公休'
          : '休息中';
    const next = status.next ? `下次營業 ${formatNextOpening(status.next, now)}` : '';
    const estimated = status.estimated ? '依舊資料推估' : '';
    return { tone: 'closed', badge, detail: [next, estimated].filter(Boolean).join('・') };
  }
  return { tone: 'unknown', badge: '時間未知', detail: '出發前請向店家確認' };
}
