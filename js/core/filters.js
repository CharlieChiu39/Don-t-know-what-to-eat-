// @ts-check
import { NEARBY_AREAS } from './catalog.js';
import { isAvailable, openingStatus } from './hours.js';

/** @typedef {import('../types.js').Restaurant} Restaurant */
/** @typedef {import('../types.js').Filters} Filters */
/** @typedef {import('../types.js').Candidate} Candidate */
/** @typedef {import('../types.js').Area} Area */
/** @typedef {import('../types.js').AreaFilter} AreaFilter */

/** @type {Readonly<Filters>} */
export const DEFAULT_FILTERS = Object.freeze({
  meal: 'all',
  price: 'all',
  area: 'nearby',
  tags: [],
  openOnly: true,
  verifiedOnly: false,
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
 * 與時間無關的條件。標籤是「任一符合」：勾麵食＋便當代表兩種都可以。
 * @param {Restaurant} r
 * @param {Filters} f
 */
export function matchesStatic(r, f) {
  return (
    (f.meal === 'all' || r.meals.includes(f.meal)) &&
    (f.price === 'all' || r.price_range === f.price) &&
    matchesArea(r.location, f.area) &&
    (f.tags.length === 0 || f.tags.some((tag) => r.tags.includes(tag))) &&
    (!f.verifiedOnly || r.verification.status === 'sourced')
  );
}

/**
 * 產生本輪候選名單，連同此刻的營業狀態一起回傳，避免 UI 重複計算。
 * @param {readonly Restaurant[]} restaurants
 * @param {Filters} filters
 * @param {{ now: Date, blockedIds: ReadonlySet<number> }} context
 * @returns {Candidate[]}
 */
export function buildCandidates(restaurants, filters, { now, blockedIds }) {
  /** @type {Candidate[]} */
  const result = [];
  for (const restaurant of restaurants) {
    if (blockedIds.has(restaurant.id) || !matchesStatic(restaurant, filters)) continue;
    const status = openingStatus(restaurant, now);
    if (filters.openOnly && !isAvailable(status)) continue;
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
    Number(!f.openOnly) +
    Number(f.verifiedOnly)
  );
}
