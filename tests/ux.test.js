// @ts-check
// 使用者實測後補上的體驗相關邏輯。
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { shortNames } from '../js/core/format.js';
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
