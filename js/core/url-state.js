// @ts-check
// 篩選條件 ⇄ 網址參數。只寫入與預設不同的值，讓分享連結保持簡短。

import { AREAS, MEALS, PRICES, TAGS } from './catalog.js';
import { DEFAULT_FILTERS } from './filters.js';

/** @typedef {import('../types.js').Filters} Filters */

/**
 * @template {string} T
 * @param {readonly T[]} allowed
 * @param {string | null} value
 * @returns {value is T}
 */
const isOneOf = (allowed, value) => value !== null && /** @type {readonly string[]} */ (allowed).includes(value);

const MEAL_IDS = MEALS.map((m) => m.id);
const PRICE_IDS = PRICES.map((p) => p.id);
const TAG_IDS = TAGS.map((t) => t.id);

/**
 * @param {Filters} f
 * @param {URLSearchParams} [params] 會保留其他無關參數
 */
export function writeFilters(f, params = new URLSearchParams()) {
  const next = new URLSearchParams(params);
  for (const key of ['meal', 'price', 'area', 'tags', 'open', 'verified']) next.delete(key);
  if (f.meal !== DEFAULT_FILTERS.meal) next.set('meal', f.meal);
  if (f.price !== DEFAULT_FILTERS.price) next.set('price', f.price);
  if (f.area !== DEFAULT_FILTERS.area) next.set('area', f.area);
  if (f.tags.length) next.set('tags', f.tags.join(','));
  if (f.openMode !== DEFAULT_FILTERS.openMode) next.set('open', f.openMode);
  return next;
}

/**
 * 讀取網址中的篩選條件；不合法的值直接忽略，不讓壞連結弄壞頁面。
 * @param {URLSearchParams} params
 * @returns {Partial<Filters>}
 */
export function readFilters(params) {
  /** @type {Partial<Filters>} */
  const f = {};
  const meal = params.get('meal');
  if (meal === 'all' || isOneOf(MEAL_IDS, meal)) f.meal = meal;
  const price = params.get('price');
  if (isOneOf(PRICE_IDS, price)) f.price = price;
  const area = params.get('area');
  if (area === 'all' || area === 'nearby' || isOneOf(AREAS, area)) f.area = area;
  const tags = params.get('tags');
  if (tags !== null) f.tags = [...new Set(tags.split(','))].filter((tag) => isOneOf(TAG_IDS, tag));
  const open = params.get('open');
  if (open === 'confirmed' || open === 'likely' || open === 'all') f.openMode = open;
  // 舊版分享連結：open=0／1、verified=1
  else if (open === '0') f.openMode = 'all';
  else if (open === '1') f.openMode = 'likely';
  if (params.get('verified') === '1' && f.openMode !== 'all') f.openMode = 'confirmed';
  return f;
}
