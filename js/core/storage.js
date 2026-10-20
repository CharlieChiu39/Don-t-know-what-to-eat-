// @ts-check
// localStorage 包裝：隱私模式、容量已滿或資料損壞時都不讓頁面壞掉。

/**
 * 只保留存在於資料庫中的整數 ID，並去除重複。
 * @param {unknown} value
 * @param {ReadonlySet<number>} allowed
 * @returns {number[]}
 */
export function sanitizeIds(value, allowed) {
  if (!Array.isArray(value)) return [];
  return [...new Set(value.filter((id) => Number.isInteger(id) && allowed.has(id)))];
}

/**
 * @param {Pick<Storage, 'getItem' | 'setItem'> | null} storage
 */
export function createIdStore(storage) {
  return {
    /**
     * @param {string} key
     * @param {ReadonlySet<number>} allowed
     */
    read(key, allowed) {
      try {
        return sanitizeIds(JSON.parse(storage?.getItem(key) ?? '[]'), allowed);
      } catch {
        return [];
      }
    },
    /**
     * @param {string} key
     * @param {readonly number[]} ids
     * @returns {boolean} 是否成功寫入
     */
    write(key, ids) {
      try {
        storage?.setItem(key, JSON.stringify(ids));
        return storage !== null;
      } catch {
        return false;
      }
    },
  };
}

/** 存取 window.localStorage 本身就可能拋錯（例如 Safari 封鎖第三方儲存）。 */
export function safeLocalStorage() {
  try {
    return globalThis.localStorage ?? null;
  } catch {
    return null;
  }
}

/**
 * 只在同一天有效的 ID 清單（「今天跳過」），換日後自動清空。
 * 存成 { day: 'YYYY-MM-DD', ids: number[] }。
 * @param {Pick<Storage, 'getItem' | 'setItem'> | null} storage
 */
export function createDayStore(storage) {
  return {
    /**
     * @param {string} key
     * @param {string} today 台北日期 YYYY-MM-DD
     * @param {ReadonlySet<number>} allowed
     */
    read(key, today, allowed) {
      try {
        const saved = JSON.parse(storage?.getItem(key) ?? 'null');
        return saved?.day === today ? sanitizeIds(saved.ids, allowed) : [];
      } catch {
        return [];
      }
    },
    /**
     * @param {string} key
     * @param {string} today
     * @param {readonly number[]} ids
     * @returns {boolean} 是否成功寫入
     */
    write(key, today, ids) {
      try {
        storage?.setItem(key, JSON.stringify({ day: today, ids }));
        return storage !== null;
      } catch {
        return false;
      }
    },
  };
}
