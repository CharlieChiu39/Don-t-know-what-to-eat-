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
  if (status.reason === 'break' && status.period) {
    return {
      tone: 'closed',
      badge: `${status.period.name}暫停營業`,
      detail: `預計 ${formatDate(nextDay(status.period.until))} 起恢復・依校方行事曆`,
    };
  }
  if (status.reason === 'break-check' && status.period) {
    return {
      tone: 'unknown',
      badge: `${status.period.name}・請先確認`,
      detail: `${status.period.name}期間時段另行公告（至 ${formatDate(status.period.until)}）`,
    };
  }
  if (status.reason === 'holiday' && status.period) {
    return { tone: 'unknown', badge: `${status.period.name}・請先確認`, detail: '國定假日可能休息或縮短營業' };
  }
  if (status.state === 'open' || status.state === 'likely') {
    const allDay = status.minutesLeft === null;
    const left = allDay ? '' : formatDuration(status.minutesLeft ?? 0);
    if (status.state === 'likely') {
      // 推估的店用自己的色調，與「確定營業但快打烊」分開
      const badge = isClosingSoon(status) ? `可能 ${status.minutesLeft} 分後打烊` : '可能營業';
      const remain = left ? `・約剩 ${left}` : '';
      return { tone: 'likely', badge, detail: `舊資料 ${status.hours}${remain}・未查證` };
    }
    const today = allDay ? '24 小時營業' : `今日 ${status.hours}`;
    if (isClosingSoon(status)) return { tone: 'soon', badge: `${status.minutesLeft} 分後打烊`, detail: today };
    return { tone: 'open', badge: '營業中', detail: allDay ? today : `${today}・還有 ${left}` };
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

/** @param {string} dateKey YYYY-MM-DD */
function formatDate(dateKey) {
  const [, m, d] = dateKey.split('-').map(Number);
  return `${m}/${d}`;
}

/** @param {string} dateKey YYYY-MM-DD */
function nextDay(dateKey) {
  const date = new Date(`${dateKey}T00:00:00Z`);
  date.setUTCDate(date.getUTCDate() + 1);
  return date.toISOString().slice(0, 10);
}

/**
 * 拆出店名主體與括號裡的分店名稱，順便去掉「便利商店」「門市」等贅字。
 * @param {string} name
 */
function splitBranch(name) {
  const match = name.match(/^(.+?)s*[（(](.+)[)）]$/);
  if (!match) return { base: name, branch: '' };
  return {
    base: match[1].replace('便利商店', '').trim(),
    branch: match[2].replace(/^(嘉義|民雄)/, '').replace(/(店|門市|餐廳|供應處)$/, '').trim(),
  };
}

/**
 * 轉盤用的短店名：只有同名的連鎖店才保留分店名，其餘去掉括號。
 * 例：三間「全家便利商店(…)」→ 全家・活動中心、全家・共同教室大樓…
 * @param {readonly { id: number, name: string }[]} restaurants
 * @returns {Map<number, string>}
 */
export function shortNames(restaurants) {
  const parts = restaurants.map((r) => ({ id: r.id, ...splitBranch(r.name) }));
  // 主體相同，或一間是另一間的前綴（佳豐生活美食／佳豐生活美食坊），就視為同一連鎖
  const ambiguous = (/** @type {(typeof parts)[number]} */ p) =>
    parts.some((q) => q.id !== p.id && (q.base.startsWith(p.base) || p.base.startsWith(q.base)));
  return new Map(parts.map((p) => [p.id, p.branch && ambiguous(p) ? `${p.base}・${p.branch}` : p.base]));
}
