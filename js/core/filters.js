// @ts-check
import { NEARBY_AREAS, TAGS } from './catalog.js';
import { isAvailable, openingStatus } from './hours.js';

/** @typedef {import('../types.js').Restaurant} Restaurant */
/** @typedef {import('../types.js').Filters} Filters */
/** @typedef {import('../types.js').Candidate} Candidate */
/** @typedef {import('../types.js').Area} Area */
/** @typedef {import('../types.js').AreaFilter} AreaFilter */
/** @typedef {import('../types.js').OpenMode} OpenMode */
/** @typedef {import('../types.js').OpeningStatus} OpeningStatus */
/** @typedef {import('../types.js').SchoolCalendar} SchoolCalendar */

const DIET_TAGS = new Set(TAGS.filter((t) => t.group === 'diet').map((t) => t.id));

/** @type {Readonly<Filters>} */
export const DEFAULT_FILTERS = Object.freeze({
  meal: 'all',
  price: 'all',
  area: 'nearby',
  tags: [],
  openMode: 'likely',
});

/**
 * @param {Area} location
 * @param {AreaFilter} area
 */
export function matchesArea(location, area) {
  if (area === 'all') return true;
  if (area === 'nearby') return NEARBY_AREAS.includes(location);
  return location === area;
}

/**
 * 把勾選的標籤分成「想吃什麼」與「飲食需求」兩組。
 * @param {Filters['tags']} tags
 */
export function splitTags(tags) {
  return { food: tags.filter((t) => !DIET_TAGS.has(t)), diet: tags.filter((t) => DIET_TAGS.has(t)) };
}

/**
 * 與時間無關的條件。同一組標籤是「任一符合」（麵＋便當＝兩種都可以），
 * 但飲食需求必須和想吃什麼同時成立：素食＋麵＝素的麵，不會混進牛肉麵。
 * @param {Restaurant} r
 * @param {Filters} f
 */
export function matchesStatic(r, f) {
  const { food, diet } = splitTags(f.tags);
  return (
    (f.meal === 'all' || r.meals.includes(f.meal)) &&
    (f.price === 'all' || r.price_range === f.price) &&
    matchesArea(r.location, f.area) &&
    (food.length === 0 || food.some((tag) => r.tags.includes(tag))) &&
    (diet.length === 0 || diet.some((tag) => r.tags.includes(tag)))
  );
}

/**
 * 依營業篩選模式決定是否放進轉盤。
 * @param {OpeningStatus} status
 * @param {OpenMode} mode
 */
export function passesOpenMode(status, mode) {
  if (mode === 'all') return true;
  if (!isAvailable(status)) return false;
  return mode === 'likely' || status.state === 'open';
}

/**
 * 產生本輪候選名單，連同此刻的營業狀態一起回傳，避免 UI 重複計算。
 * @param {readonly Restaurant[]} restaurants
 * @param {Filters} filters
 * @param {{ now: Date, blockedIds: ReadonlySet<number>, calendar?: SchoolCalendar }} context
 * @returns {Candidate[]}
 */
export function buildCandidates(restaurants, filters, { now, blockedIds, calendar }) {
  /** @type {Candidate[]} */
  const result = [];
  for (const restaurant of restaurants) {
    if (blockedIds.has(restaurant.id) || !matchesStatic(restaurant, filters)) continue;
    const status = openingStatus(restaurant, now, calendar);
    if (!passesOpenMode(status, filters.openMode)) continue;
    result.push({ restaurant, status });
  }
  return result;
}

/** @param {Filters} f */
export function countActiveFilters(f) {
  return (
    Number(f.meal !== 'all') +
    Number(f.price !== 'all') +
    Number(f.area !== DEFAULT_FILTERS.area) +
    f.tags.length +
    Number(f.openMode !== DEFAULT_FILTERS.openMode)
  );
}
