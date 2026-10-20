// @ts-check
// 端對端測試：在真實瀏覽器（手機與桌面）驗證主要流程、無障礙與離線能力。
import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

// 固定在學期中的週二中午，讓營業狀態可重現
const TUESDAY_NOON = new Date('2026-09-15T12:00:00+08:00');

/** @param {import('@playwright/test').Page} page */
async function openFilters(page) {
  const panel = page.locator('#filter-panel');
  if ((await panel.getAttribute('open')) === null) await panel.locator('summary').click();
}

test.beforeEach(async ({ page }) => {
  await page.clock.setFixedTime(TUESDAY_NOON);
});

test('中午自動選午餐，並顯示營業中的店', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('[data-meal="lunch"]')).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('#now-line')).toContainText('午餐時段');
  await expect(page.locator('#count')).not.toHaveText('0');
});

test('標籤篩選依數字縮小候選，並同步到網址', async ({ page }) => {
  await page.goto('/');
  await openFilters(page);
  const chip = page.locator('[data-tag="noodles"]');
  const expected = (await chip.locator('.chip-count').textContent()) ?? '';
  await chip.click();
  await expect(chip).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('#count')).toHaveText(expected);
  await expect(page).toHaveURL(/tags=noodles/);
});

test('轉動後顯示結果，「就吃這間」會記到最近吃過並保存', async ({ page }) => {
  await page.goto('/');
  await page.locator('#spin-btn').click();
  const dialog = page.locator('#result-dialog');
  await expect(dialog).toBeVisible();
  await expect(page).toHaveURL(/result=\d+/);
  await expect(page.locator('#result-status-badge')).not.toBeEmpty();
  const name = (await page.locator('#result-name').textContent()) ?? '';
  expect(name).not.toBe('');

  await page.locator('#eat-btn').click();
  // 決定之後結果卡留著，方便接著分享
  await expect(page.locator('#eat-btn')).toContainText('已決定');
  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();
  await expect(page.locator('#recent-list')).toContainText(name);
  await page.reload();
  await expect(page.locator('#recent-list')).toContainText(name);
});

test('分享連結直接開啟指定餐廳；Esc 關閉後網址移除 result', async ({ page }) => {
  await page.goto('/?result=6');
  await expect(page.locator('#result-name')).toHaveText('路易莎咖啡(嘉義中正大學門市)');
  await expect(page.locator('#result-status')).toHaveAttribute('data-tone', 'open');
  await expect(page.locator('#result-source a')).toHaveAttribute('href', /^https:\/\/www\.ccu\.edu\.tw/);
  await page.keyboard.press('Escape');
  await expect(page.locator('#result-dialog')).toBeHidden();
  await expect(page).not.toHaveURL(/result=/);
});

test('預設只抽中正周邊；改選民雄市區會換一批店並寫進網址', async ({ page }) => {
  await page.goto('/');
  await openFilters(page);
  await expect(page.locator('[data-area="nearby"]')).toHaveAttribute('aria-pressed', 'true');
  const nearby = await page.locator('#count').textContent();
  await page.locator('[data-area="民雄市區"]').click();
  await expect(page).toHaveURL(/area=%E6%B0%91%E9%9B%84%E5%B8%82%E5%8D%80/);
  await expect(page.locator('#count')).not.toHaveText('0');
  await expect(page.locator('#count')).not.toHaveText(nearby ?? '');
});

test('民雄市區的結果附 Google 地圖來源，「看地圖」直接開商家頁', async ({ page }) => {
  await page.goto('/?result=93');
  await expect(page.locator('#result-area')).toHaveText('民雄市區');
  const source = page.locator('#result-source a');
  await expect(source).toHaveText('Google 地圖商家資訊');
  const href = (await source.getAttribute('href')) ?? '';
  expect(href).toMatch(/^https:\/\/maps\.google\.com\/\?cid=\d+$/);
  await expect(page.locator('#map-link')).toHaveAttribute('href', href);
});

test('流動餐車列在側欄、跟著區域篩選，而且不放進轉盤', async ({ page }) => {
  await page.goto('/');
  const box = page.locator('#truck-box');
  await expect(box).toBeVisible();
  await box.locator('summary').click();
  const trucks = box.locator('#truck-list > li');
  await expect(trucks).toHaveCount(Number(await page.locator('#truck-count').textContent()));
  await expect(trucks.first().locator('a')).toHaveAttribute('href', /^https:\/\/www\.dcard\.tw\//);
  const axe = await new AxeBuilder({ page }).include('#truck-box').analyze();
  expect(axe.violations).toEqual([]);

  // 轉盤上的名稱不包含餐車
  const names = await trucks.locator('.truck-name > span:first-child').allTextContents();
  await page.locator('#list-btn').click();
  const list = await page.locator('#list').textContent();
  for (const name of names) expect(list).not.toContain(name.replace(/^\S+\s/, ''));

  await page.goto('/?area=%E6%B0%91%E9%9B%84%E5%B8%82%E5%8D%80');
  await expect(page.locator('#truck-count')).toHaveText('1');
});

test('封鎖後不會出現在本輪選項，可從封鎖清單恢復', async ({ page }) => {
  await page.goto('/?result=6');
  const before = Number(await page.locator('#count').textContent());
  await page.locator('#block-btn').click();
  await expect(page.locator('#count')).toHaveText(String(before - 1));
  await expect(page.locator('#blocked-count')).toHaveText('1');

  await openFilters(page);
  await page.locator('#blocked-btn').click();
  await page.locator('#blocked-list button', { hasText: '恢復' }).click();
  await expect(page.locator('#blocked-count')).toHaveText('0');
  await expect(page.locator('#count')).toHaveText(String(before));
});

test('條件太嚴時提供一鍵放寬', async ({ page }) => {
  await page.goto('/?meal=breakfast&tags=halal');
  await expect(page.locator('#empty-state')).toBeVisible();
  await expect(page.locator('#spin-btn')).toBeDisabled();
  await page.locator('#relax-btn').click();
  await expect(page.locator('#count')).not.toHaveText('0');
  await expect(page.locator('#spin-btn')).toBeEnabled();
});

test('「降低最近吃過的抽中率」預設關閉，開啟後保存偏好', async ({ page }) => {
  await page.goto('/');
  await openFilters(page);
  await expect(page.locator('#weighting')).not.toBeChecked();
  await page.locator('#weighting').check();
  await page.reload();
  await openFilters(page);
  await expect(page.locator('#weighting')).toBeChecked();
});

test('鍵盤可操作：Tab 到轉盤按鈕並以 Enter 轉動', async ({ page }) => {
  await page.goto('/');
  await page.locator('#spin-btn').focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('#result-dialog')).toBeVisible();
  // 原生 <dialog> 會把焦點移進對話框
  await expect(page.locator('#result-dialog')).toContainText('今天就吃');
  expect(await page.evaluate(() => document.activeElement?.closest('dialog')?.id)).toBe('result-dialog');
});

test('主畫面與結果對話框沒有 axe 無障礙違規', async ({ page }) => {
  await page.goto('/');
  await openFilters(page);
  const main = await new AxeBuilder({ page }).analyze();
  expect(main.violations).toEqual([]);

  await page.goto('/?result=27');
  await expect(page.locator('#result-dialog')).toBeVisible();
  const dialog = await new AxeBuilder({ page }).include('#result-dialog').analyze();
  expect(dialog.violations).toEqual([]);
});

test('載入與轉動過程沒有 console 錯誤', async ({ page }) => {
  /** @type {string[]} */
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text());
  });
  await page.goto('/');
  await page.locator('#spin-btn').click();
  await expect(page.locator('#result-dialog')).toBeVisible();
  expect(errors).toEqual([]);
});

test('第一次載入後，離線也能開啟並轉動', async ({ page, context }) => {
  await page.goto('/');
  await page.evaluate(() => navigator.serviceWorker.ready);
  await page.reload();
  await page.waitForFunction(() => navigator.serviceWorker.controller !== null);

  await context.setOffline(true);
  await page.reload();
  await expect(page.locator('#count')).not.toHaveText('0');
  await page.locator('#spin-btn').click();
  await expect(page.locator('#result-dialog')).toBeVisible();
  await context.setOffline(false);
});
