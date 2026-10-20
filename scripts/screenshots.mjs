// @ts-check
// 產生 README 截圖與社群分享預覽圖（og-image）。
// 用法：先 `npm run dev`，再 `node scripts/screenshots.mjs`

import { chromium } from '@playwright/test';

const BASE = process.env.BASE_URL ?? 'http://localhost:5173';
const NOON = new Date('2026-09-15T12:10:00+08:00');

const browser = await chromium.launch({ channel: process.env.CI ? undefined : 'chrome' });

/**
 * @param {{ name: string, path: string, width: number, height: number, scale?: number, prepare?: (page: import('@playwright/test').Page) => Promise<void> }} shot
 */
async function capture({ name, path, width, height, scale = 2, prepare }) {
  const context = await browser.newContext({
    viewport: { width, height },
    deviceScaleFactor: scale,
    locale: 'zh-TW',
    timezoneId: 'Asia/Taipei',
  });
  // 略過開場畫面
  await context.addInitScript(() => sessionStorage.setItem('food_splash_seen', '1'));
  const page = await context.newPage();
  await page.clock.setFixedTime(NOON);
  await page.goto(BASE + path);
  await page.locator('#count').filter({ hasNotText: /^0$/ }).waitFor();
  await page.evaluate(() => document.fonts.ready);
  await prepare?.(page);
  await page.waitForTimeout(600);
  await page.screenshot({ path: name });
  await context.close();
  console.log('✓', name);
}

/** @param {import('@playwright/test').Page} page */
const openPanel = async (page) => {
  const panel = page.locator('#filter-panel');
  if ((await panel.getAttribute('open')) === null) await panel.locator('summary').click();
};

await capture({ name: 'docs/screenshots/mobile-home.png', path: '/?meal=lunch&area=%E6%A0%A1%E5%85%A7&open=0', width: 390, height: 844 });
await capture({ name: 'docs/screenshots/mobile-result.png', path: '/?result=85', width: 390, height: 844 });
await capture({
  name: 'docs/screenshots/mobile-filters.png',
  path: '/?tags=noodles,bento',
  width: 390,
  height: 844,
  prepare: async (page) => {
    await openPanel(page);
    await page.locator('#filter-panel').scrollIntoViewIfNeeded();
    await page.evaluate(() => document.getElementById('filter-panel')?.scrollIntoView({ block: 'start' }));
  },
});
await capture({
  name: 'docs/screenshots/mobile-trucks.png',
  path: '/',
  width: 390,
  height: 844,
  prepare: async (page) => {
    const box = page.locator('#truck-box');
    await box.locator('summary').click();
    await page.evaluate(() => document.getElementById('truck-box')?.scrollIntoView({ block: 'start' }));
  },
});
await capture({ name: 'docs/screenshots/desktop.png', path: '/?tags=noodles,rice,bento', width: 1280, height: 860, scale: 1.5 });
await capture({ name: 'assets/og-image.png', path: '/?tags=noodles,rice,bento', width: 1200, height: 630, scale: 1 });

await browser.close();
