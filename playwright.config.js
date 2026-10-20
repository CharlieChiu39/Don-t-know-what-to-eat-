// @ts-check
import { defineConfig, devices } from '@playwright/test';

// 本機直接用已安裝的 Chrome；CI 則用 `npx playwright install chromium` 下載的版本。
const channel = process.env.CI ? undefined : 'chrome';

export default defineConfig({
  testDir: 'e2e',
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [['github'], ['list']] : 'list',
  use: {
    baseURL: 'http://localhost:5173',
    locale: 'zh-TW',
    timezoneId: 'Asia/Taipei',
    // 減少動態：略過開場與特效，轉盤 0.45 秒就停，讓測試穩定又快速
    reducedMotion: 'reduce',
    trace: 'retain-on-failure',
  },
  webServer: {
    command: 'node scripts/serve.mjs',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
  },
  projects: [
    { name: 'mobile', use: { ...devices['Pixel 7'], channel } },
    { name: 'desktop', use: { ...devices['Desktop Chrome'], channel } },
  ],
});
