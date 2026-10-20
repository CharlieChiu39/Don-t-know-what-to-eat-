// @ts-check
// 使用者實測（4 位模擬用戶）找到的問題，修好後用這些情境守住。
import { readFileSync } from 'node:fs';
import { expect, test } from '@playwright/test';

/** @type {import('../js/types.js').Restaurant[]} */
const restaurants = JSON.parse(readFileSync(new URL('../data/restaurants.json', import.meta.url), 'utf8'));
const TUESDAY_NOON = new Date('2026-09-15T12:00:00+08:00');
const WINTER_NOON = new Date('2027-01-26T12:00:00+08:00');

/** @param {import('@playwright/test').Page} page */
async function openFilters(page) {
  const panel = page.locator('#filter-panel');
  if ((await panel.getAttribute('open')) === null) await panel.locator('summary').click();
}

/** @param {import('@playwright/test').Page} page */
async function spinOnce(page) {
  await page.locator('#spin-btn').click();
  await expect(page.locator('#result-dialog')).toBeVisible();
  return (await page.locator('#result-name').textContent()) ?? '';
}

test.describe('營業狀態的可信度', () => {
  test('寒假期間：校內店家不再顯示營業中，並提示寒假', async ({ page }) => {
    await page.clock.setFixedTime(WINTER_NOON);
    await page.goto('/?area=%E6%A0%A1%E5%85%A7');
    await expect(page.locator('#season-note')).toContainText('寒假');
    // 預設只放營業中與可能營業：校內 15 間寒假都是休息或待確認
    await expect(page.locator('#empty-state')).toBeVisible();

    await page.goto('/?area=%E6%A0%A1%E5%85%A7&open=all');
    await page.locator('#list-btn').click();
    const eb1 = page.locator('#list li', { hasText: '食凡(EB1)' });
    await expect(eb1.locator('.status-badge')).toHaveText('寒假暫停營業');
    await expect(page.locator('#list .status-badge', { hasText: '營業中' })).toHaveCount(0);
  });

  test('三段營業篩選：確定營業只留下有查證時刻表的店', async ({ page }) => {
    await page.clock.setFixedTime(TUESDAY_NOON);
    await page.goto('/');
    await expect(page.locator('[data-open="likely"]')).toHaveAttribute('aria-pressed', 'true');
    const likelyCount = Number(await page.locator('#count').textContent());
    await page.locator('[data-open="confirmed"]').click();
    await expect(page).toHaveURL(/open=confirmed/);
    const confirmedCount = Number(await page.locator('#count').textContent());
    expect(confirmedCount).toBeGreaterThan(0);
    expect(confirmedCount).toBeLessThan(likelyCount);
    await page.locator('#list-btn').click();
    await expect(page.locator('#list .status-badge', { hasText: '可能' })).toHaveCount(0);
  });

  test('頂部數字跟著本輪條件，不再和轉盤對不上', async ({ page }) => {
    await page.clock.setFixedTime(TUESDAY_NOON);
    await page.goto('/?area=%E6%A0%A1%E5%85%A7');
    const count = await page.locator('#count').textContent();
    await expect(page.locator('#now-line')).toContainText(`本輪 ${count} 間`);
  });

  test('結果卡：顯示營業提醒、電話與回報連結；只查證地址的店不寫營業時間來源', async ({ page }) => {
    await page.clock.setFixedTime(TUESDAY_NOON);
    const withPhone = restaurants.find((r) => r.phone && r.hoursNote);
    if (!withPhone) throw new Error('測試資料缺少有電話與營業提醒的店');
    await page.goto(`/?result=${withPhone.id}`);
    await expect(page.locator('#result-hours-note')).toContainText(withPhone.hoursNote ?? '');
    await expect(page.locator('#call-link')).toHaveAttribute('href', `tel:${withPhone.phone?.replace(/[^\d+]/g, '')}`);
    await expect(page.locator('#report-link')).toHaveAttribute('href', /github\.com\/.+\/issues\/new/);

    const addressOnly = restaurants.find(
      (r) => r.verification.status === 'sourced' && Object.values(r.openHours).every((v) => v === null),
    );
    if (addressOnly) {
      await page.goto(`/?result=${addressOnly.id}`);
      await expect(page.locator('#result-source')).not.toContainText('營業時間來源');
    }
  });
});

test.describe('抽完之後的流程', () => {
  test('今天跳過：從本輪移除、可以復原，重新整理後當天仍然跳過', async ({ page }) => {
    await page.clock.setFixedTime(TUESDAY_NOON);
    await page.goto('/');
    const before = Number(await page.locator('#count').textContent());
    await spinOnce(page);
    await page.locator('#skip-btn').click();
    await expect(page.locator('#result-dialog')).toBeHidden();
    await expect(page.locator('#count')).toHaveText(String(before - 1));
    await page.locator('#toast-undo').click();
    await expect(page.locator('#count')).toHaveText(String(before));

    await spinOnce(page);
    await page.locator('#skip-btn').click();
    await page.reload();
    await expect(page.locator('#count')).toHaveText(String(before - 1));
    await expect(page.locator('#blocked-count')).toHaveText('0');
  });

  test('永久封鎖與今天跳過分開，封鎖後會記在封鎖清單', async ({ page }) => {
    await page.clock.setFixedTime(TUESDAY_NOON);
    await page.goto('/');
    await spinOnce(page);
    await page.locator('#block-btn').click();
    await expect(page.locator('#blocked-count')).toHaveText('1');
  });

  test('再轉一次不會抽回剛被否決的那間', async ({ page }) => {
    await page.clock.setFixedTime(TUESDAY_NOON);
    await page.goto('/');
    for (let i = 0; i < 5; i++) {
      const first = await spinOnce(page);
      await page.locator('#respin-btn').click();
      await expect(page.locator('#result-dialog')).toBeVisible();
      await expect(page.locator('#result-name')).not.toHaveText(first);
      await page.keyboard.press('Escape');
    }
    await expect(page.locator('#excluded-note')).toContainText('排除');
  });

  test('就吃這間：結果卡不會消失，可以接著分享；最近吃過可以點開', async ({ page }) => {
    await page.clock.setFixedTime(TUESDAY_NOON);
    await page.goto('/');
    const name = await spinOnce(page);
    await page.locator('#eat-btn').click();
    await expect(page.locator('#result-dialog')).toBeVisible();
    await expect(page.locator('#eat-btn')).toContainText('已決定');
    await expect(page.locator('#share-btn')).toBeVisible();
    await page.keyboard.press('Escape');
    await page.locator('#recent-list button', { hasText: name.split('(')[0] }).first().click();
    await expect(page.locator('#result-name')).toHaveText(name);
  });

  test('飲食需求與想吃什麼同時成立（素食＋麵）', async ({ page }) => {
    await page.clock.setFixedTime(TUESDAY_NOON);
    await page.goto('/?tags=vegetarian,noodles,rice&open=all&meal=all&area=all');
    const expected = restaurants.filter(
      (r) => r.tags.includes('vegetarian') && (r.tags.includes('noodles') || r.tags.includes('rice')),
    ).length;
    await expect(page.locator('#count')).toHaveText(String(expected));
  });

  test('分享：複製連結後直接在按鈕上回饋', async ({ page }) => {
    await page.clock.setFixedTime(TUESDAY_NOON);
    await page.goto('/?result=6');
    await expect(page.locator('#result-dialog')).toBeVisible();
    await page.evaluate(() => {
      // @ts-expect-error 測試用：模擬不支援 Web Share 的瀏覽器
      delete Navigator.prototype.share;
      Object.defineProperty(navigator, 'clipboard', { value: { writeText: () => Promise.resolve() } });
    });
    await page.locator('#share-btn').click();
    await expect(page.locator('#share-btn')).toHaveText('連結已複製 ✓');
  });

  test('提示訊息位在 top layer：關掉結果卡後的「復原」可以點', async ({ page }) => {
    await page.clock.setFixedTime(TUESDAY_NOON);
    await page.goto('/?result=6');
    await page.locator('#skip-btn').click();
    const toast = page.locator('#toast');
    await expect(toast).toBeVisible();
    expect(await toast.evaluate((el) => el.matches(':popover-open'))).toBe(true);
    await page.locator('#toast-undo').click();
    await expect(toast).toBeHidden();
  });
});

test.describe('手機版面與轉動', () => {
  test('小螢幕手機：第一屏就同時看得到指針與「轉！」', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 664 });
    await page.clock.setFixedTime(TUESDAY_NOON);
    await page.goto('/');
    await page.locator('#count').filter({ hasNotText: /^0$/ }).waitFor();
    const inView = async (/** @type {string} */ selector) =>
      page.locator(selector).evaluate((el) => {
        const r = el.getBoundingClientRect();
        return r.top >= 0 && r.bottom <= innerHeight;
      });
    expect(await inView('.wheel-pointer')).toBe(true);
    expect(await inView('#spin-btn')).toBe(true);
  });

  test('捲到下面時出現浮動的「轉！」，按了會回到轉盤並轉動', async ({ page, isMobile }) => {
    test.skip(!isMobile, '桌面版轉盤與篩選並排，不需要浮動按鈕');
    await page.clock.setFixedTime(TUESDAY_NOON);
    await page.goto('/');
    await openFilters(page);
    await page.locator('.app-footer').scrollIntoViewIfNeeded();
    const dock = page.locator('#spin-dock');
    await expect(dock).toBeVisible();
    await dock.click();
    await expect(page.locator('#result-dialog')).toBeVisible();
  });

  test.describe('完整動畫', () => {
    test.use({ reducedMotion: 'no-preference' });
    test('轉動中可以略過動畫，連續再轉時動畫較短', async ({ page }) => {
      await page.clock.setFixedTime(TUESDAY_NOON);
      await page.goto('/');
      // 開場每次載入都會播；按任意鍵略過（不用點擊，避免與自動結束的淡出搶時間）
      await page.keyboard.press('Escape');
      await expect(page.locator('#splash')).toBeHidden();
      await page.locator('#spin-btn').click();
      await page.waitForTimeout(300);
      const skipAt = Date.now();
      await page.locator('#spin-btn').click();
      await expect(page.locator('#result-dialog')).toBeVisible({ timeout: 1500 });
      expect(Date.now() - skipAt).toBeLessThan(1500);

      await page.locator('#respin-btn').click();
      const respinAt = Date.now();
      await expect(page.locator('#result-dialog')).toBeVisible();
      await expect(page.locator('#result-name')).not.toBeEmpty();
      expect(Date.now() - respinAt).toBeLessThan(3500);
    });
  });
});
