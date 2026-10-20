// @ts-check
/// <reference lib="webworker" />
// Service worker：讓校園網路不穩或離線時仍能開啟並轉動轉盤。
// 策略：同源資源 network-first（逾時 3 秒改用快取），確保部署後立即拿到新版；
// Google Fonts 走 cache-first，因為網址本身已帶版本。

const sw = /** @type {ServiceWorkerGlobalScope} */ (/** @type {unknown} */ (self));

const VERSION = 'v2.0.0';
const CACHE = `ccu-food-${VERSION}`;
const SHELL = [
  './',
  'index.html',
  'css/app.css',
  'js/app.js',
  'js/core/catalog.js',
  'js/core/filters.js',
  'js/core/format.js',
  'js/core/hours.js',
  'js/core/picker.js',
  'js/core/storage.js',
  'js/core/url-state.js',
  'js/ui/effects.js',
  'js/ui/wheel.js',
  'data/restaurants.json',
  'manifest.webmanifest',
  'assets/assetsbg.jpg',
  'assets/icons/icon.svg',
];

sw.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE)
      .then((cache) => cache.addAll(SHELL))
      .then(() => sw.skipWaiting()),
  );
});

sw.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key))))
      .then(() => sw.clients.claim()),
  );
});

/**
 * @param {Request} request
 * @param {number} timeoutMs
 */
async function networkFirst(request, timeoutMs) {
  const cache = await caches.open(CACHE);
  const fromCache = () => cache.match(request, { ignoreSearch: request.mode === 'navigate' });
  /** @type {ReturnType<typeof setTimeout> | undefined} */
  let timer;
  try {
    const response = await Promise.race([
      fetch(request),
      new Promise((_, reject) => {
        timer = setTimeout(() => reject(new Error('timeout')), timeoutMs);
      }),
    ]);
    if (!(response instanceof Response)) throw new Error('unexpected');
    if (response.ok) {
      cache.put(request, response.clone());
      return response;
    }
    // 404 等錯誤：有舊快取就用，否則照實回傳伺服器的回應
    return (await fromCache()) ?? response;
  } catch {
    return (await fromCache()) ?? Response.error();
  } finally {
    clearTimeout(timer);
  }
}

/** @param {Request} request */
async function cacheFirst(request) {
  const cache = await caches.open(CACHE);
  const cached = await cache.match(request);
  if (cached) return cached;
  const response = await fetch(request);
  if (response.ok || response.type === 'opaque') cache.put(request, response.clone());
  return response;
}

sw.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin === sw.location.origin) {
    event.respondWith(networkFirst(request, 3000));
  } else if (url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com') {
    event.respondWith(cacheFirst(request));
  }
});
