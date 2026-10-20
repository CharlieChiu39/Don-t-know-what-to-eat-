// @ts-check
// 使用者實測後補上的體驗相關邏輯。
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { shortNames } from '../js/core/format.js';
import { createDayStore } from '../js/core/storage.js';
import { restaurants } from './helpers.js';

test('轉盤短店名：連鎖店保留分店名，其餘去掉括號', () => {
  const names = shortNames([
    { id: 1, name: '全家便利商店(活動中心店)' },
    { id: 2, name: '全家便利商店(共同教室大樓店)' },
    { id: 3, name: '佳豐生活美食坊' },
    { id: 4, name: '佳豐生活美食(共同教室餐盒供應處)' },
    { id: 5, name: '鮮茶道(中正大學店)' },
    { id: 6, name: '紅樓極麵（南松食堂）' },
  ]);
  assert.deepEqual([...names.values()], [
    '全家・活動中心', '全家・共同教室大樓', '佳豐生活美食坊', '佳豐生活美食・共同教室餐盒', '鮮茶道', '紅樓極麵',
  ]);
});

test('轉盤短店名：真實資料裡沒有兩間店的短名稱相同', () => {
  const labels = [...shortNames(restaurants).values()];
  const dupes = labels.filter((label, i) => labels.indexOf(label) !== i);
  assert.deepEqual(dupes, []);
});

test('今天跳過：同一天讀得回來，換日自動清空，壞資料安全降級', () => {
  /** @type {Map<string, string>} */
  const memory = new Map();
  const store = createDayStore({ getItem: (k) => memory.get(k) ?? null, setItem: (k, v) => void memory.set(k, v) });
  const allowed = new Set([1, 2, 3]);
  assert.equal(store.write('skip', '2026-09-15', [1, 2, 99]), true);
  assert.deepEqual(store.read('skip', '2026-09-15', allowed), [1, 2]);
  assert.deepEqual(store.read('skip', '2026-09-16', allowed), []);
  memory.set('skip', '[1,2]');
  assert.deepEqual(store.read('skip', '2026-09-15', allowed), []);
  memory.set('skip', '{oops');
  assert.deepEqual(store.read('skip', '2026-09-15', allowed), []);
});
