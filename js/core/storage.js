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
