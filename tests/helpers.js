// @ts-check
import { readFileSync } from 'node:fs';

/** @typedef {import('../js/types.js').Restaurant} Restaurant */
/** @typedef {import('../js/types.js').WeeklyHours} WeeklyHours */
/** @typedef {import('../js/types.js').FoodTruck} FoodTruck */

/** @type {Restaurant[]} */
export const restaurants = JSON.parse(
  readFileSync(new URL('../data/restaurants.json', import.meta.url), 'utf8'),
);

/** @type {FoodTruck[]} */
export const trucks = JSON.parse(readFileSync(new URL('../data/trucks.json', import.meta.url), 'utf8'));

/** @param {number} id */
export function byId(id) {
  const found = restaurants.find((r) => r.id === id);
  if (!found) throw new Error(`找不到 ID ${id}`);
  return found;
}

/** 以台北時間建立 Date，例如 at('2026-09-08T12:00') */
export const at = (/** @type {string} */ local) => new Date(`${local}:00+08:00`);

/**
 * 建立一間測試用店家：未指定的日子都是休息。
 * @param {Partial<WeeklyHours>} hours
 * @param {Partial<Restaurant>} [extra]
 * @returns {Restaurant}
 */
export function shop(hours, extra = {}) {
  return {
    id: 9999,
    name: '測試店',
    cuisine: '台式',
    tags: ['bento'],
    meals: ['lunch'],
    price_range: 'cheap',
    location: '神農路',
    note: '',
    verification: { status: 'sourced' },
    openHours: {
      sun: '休息', mon: '休息', tue: '休息', wed: '休息', thu: '休息', fri: '休息', sat: '休息',
      ...hours,
    },
    ...extra,
  };
}
