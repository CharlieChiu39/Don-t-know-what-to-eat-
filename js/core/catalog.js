// @ts-check
// 篩選選項的唯一來源：UI 按鈕、URL 驗證與資料檢查都從這裡讀。

/** @typedef {import('../types.js').TagId} TagId */
/** @typedef {import('../types.js').Meal} Meal */
/** @typedef {import('../types.js').PriceRange} PriceRange */
/** @typedef {import('../types.js').Area} Area */
/** @typedef {import('../types.js').AreaFilter} AreaFilter */

/** @type {readonly { id: TagId, label: string, emoji: string, group: 'food' | 'diet' }[]} */
export const TAGS = [
  { id: 'bento', label: '便當自助餐', emoji: '🍱', group: 'food' },
  { id: 'rice', label: '飯・丼', emoji: '🍚', group: 'food' },
  { id: 'noodles', label: '麵・水餃', emoji: '🍜', group: 'food' },
  { id: 'breakfast', label: '早午餐', emoji: '🍳', group: 'food' },
  { id: 'snack', label: '小吃', emoji: '🍢', group: 'food' },
  { id: 'luwei', label: '滷味', emoji: '🥢', group: 'food' },
  { id: 'fried', label: '炸物', emoji: '🍗', group: 'food' },
  { id: 'hotpot', label: '鍋物', emoji: '🍲', group: 'food' },
  { id: 'western', label: '排餐・義式', emoji: '🍝', group: 'food' },
  { id: 'asian', label: '異國', emoji: '🌏', group: 'food' },
  { id: 'healthy', label: '輕食・健康餐', emoji: '🥗', group: 'food' },
  { id: 'drinks', label: '飲料', emoji: '🧋', group: 'food' },
  { id: 'dessert', label: '甜點・冰品', emoji: '🍨', group: 'food' },
  { id: 'cafe', label: '咖啡', emoji: '☕', group: 'food' },
  { id: 'convenience', label: '超商', emoji: '🏪', group: 'food' },
  { id: 'vegetarian', label: '素食', emoji: '🌱', group: 'diet' },
  { id: 'halal', label: '清真', emoji: '☪️', group: 'diet' },
];

/** @type {readonly { id: Meal, label: string, emoji: string }[]} */
export const MEALS = [
  { id: 'breakfast', label: '早餐', emoji: '🌅' },
  { id: 'lunch', label: '午餐', emoji: '☀️' },
  { id: 'dinner', label: '晚餐', emoji: '🌙' },
  { id: 'latenight', label: '宵夜', emoji: '🌃' },
];

/** @type {readonly { id: PriceRange, label: string }[]} */
export const PRICES = [
  { id: 'cheap', label: '< 80 元' },
  { id: 'medium', label: '80–150 元' },
  { id: 'expensive', label: '> 150 元' },
  { id: 'unknown', label: '價位待確認' },
];

/** @type {readonly Area[]} */
export const AREAS = ['校內', '神農路', '裕農路', '大學路', '民雄市區'];

/**
 * 「中正周邊」包含的區域：走路或騎車幾分鐘內就到，預設只抽這些。
 * @type {readonly Area[]}
 */
export const NEARBY_AREAS = ['校內', '神農路', '裕農路', '大學路'];

/**
 * 區域篩選按鈕，依序顯示。
 * @type {readonly { id: AreaFilter, label: string }[]}
 */
export const AREA_FILTERS = [
  { id: 'nearby', label: '中正周邊' },
  ...AREAS.map((area) => ({ id: area, label: area })),
  { id: 'all', label: '不限' },
];

export const TAG_BY_ID = new Map(TAGS.map((tag) => [tag.id, tag]));
export const PRICE_LABEL = new Map(PRICES.map((price) => [price.id, price.label]));

/**
 * 依台北時間的「第幾分鐘」推薦餐別；下午茶時段不限定。
 * @param {number} minute
 * @returns {Meal | 'all'}
 */
export function mealForMinute(minute) {
  if (minute >= 5 * 60 && minute < 10 * 60 + 30) return 'breakfast';
  if (minute >= 10 * 60 + 30 && minute < 14 * 60 + 30) return 'lunch';
  if (minute >= 14 * 60 + 30 && minute < 16 * 60 + 30) return 'all';
  if (minute >= 16 * 60 + 30 && minute < 21 * 60) return 'dinner';
  return 'latenight';
}
