// @ts-check
// 抽選邏輯：加權隨機。最近決定吃過的店機率較低，轉盤扇形也會跟著變窄。

export const RECENT_LIMIT = 5;

/**
 * 最近一次吃的權重 0.25，往前依序回升到 0.65；沒吃過為 1。
 * @param {number} id
 * @param {readonly number[]} recentIds 由新到舊
 */
export function recencyWeight(id, recentIds) {
  const index = recentIds.indexOf(id);
  return index === -1 ? 1 : 0.25 + 0.1 * index;
}

/**
 * 依權重抽出索引。random 可注入，讓測試可重現。
 * @param {readonly number[]} weights
 * @param {() => number} [random] 回傳 [0, 1)
 */
export function pickIndex(weights, random = secureRandom) {
  const total = weights.reduce((sum, w) => sum + w, 0);
  if (!(total > 0)) throw new RangeError('至少需要一個正權重');
  let target = random() * total;
  for (let i = 0; i < weights.length; i++) {
    target -= weights[i];
    if (target < 0) return i;
  }
  return weights.length - 1;
}

/**
 * 把剛決定的店放到最前面，去重並截斷。
 * @param {readonly number[]} recentIds
 * @param {number} id
 */
export function pushRecent(recentIds, id) {
  return [id, ...recentIds.filter((x) => x !== id)].slice(0, RECENT_LIMIT);
}

/** 使用 Web Crypto，避免 Math.random 的可預測性；結果落在 [0, 1)。 */
export function secureRandom() {
  const buffer = new Uint32Array(1);
  globalThis.crypto.getRandomValues(buffer);
  return buffer[0] / 2 ** 32;
}
