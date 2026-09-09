'use strict';

const $ = (id) => document.getElementById(id);
const restaurants = window.RESTAURANTS;
const { openingStatus, filterRestaurants, validIds } = FoodCore;
const priceLabels = {
  cheap: '< 80 元',
  medium: '80–150 元',
  expensive: '> 150 元',
  unknown: '價格待確認',
};
const cuisineMarks = {
  台式: '飯',
  日式: '和',
  韓式: '韓',
  越式: '越',
  泰式: '泰',
  西式: '洋',
  亞洲: '食',
  速食: '炸',
  火鍋: '鍋',
  飲料: '茶',
  甜點: '甘',
  咖啡: '珈',
  素食: '蔬',
  清真: '清',
  便利商店: '便',
};
const storageKeys = {
  blockedIds: 'food_blocked',
  savedIds: 'food_saved',
  recentIds: 'food_recent',
};
const defaults = {
  meal: 'all',
  price: 'all',
  cuisine: 'all',
  location: 'all',
  openOnly: false,
  query: '',
  view: 'all',
};
function readIds(key) {
  try {
    return validIds(JSON.parse(localStorage.getItem(key)), restaurants);
  } catch {
    return [];
  }
}
const state = {
  ...defaults,
  sort: 'default',
  limit: 12,
  busy: false,
  lastResult: null,
  blockedIds: readIds(storageKeys.blockedIds),
  savedIds: readIds(storageKeys.savedIds),
  recentIds: readIds(storageKeys.recentIds).slice(0, 5),
};
const wheel = new Wheel($('wheel-canvas'));
const dialog = $('result-dialog');
let toastTimer;
let returnFocus;
let resultIsDraw = false;
let shareRequest = 0;

function toast(message) {
  clearTimeout(toastTimer);
  if (dialog.open) {
    $('toast').hidden = true;
    $('result-feedback').textContent = message;
    $('result-feedback').hidden = false;
    return;
  }
  $('toast').textContent = message;
  $('toast').hidden = false;
  toastTimer = setTimeout(() => {
    $('toast').hidden = true;
  }, 3200);
}
function persist(key) {
  try {
    localStorage.setItem(storageKeys[key], JSON.stringify(state[key]));
  } catch {
    toast('瀏覽器無法儲存，這次操作仍在本頁有效。');
  }
}
function makeElement(tag, className, text) {
  const el = document.createElement(tag);
  if (className) el.className = className;
  if (text !== undefined) el.textContent = text;
  return el;
}
function actionButton(action, id, label, className) {
  const button = makeElement('button', className, label);
  button.dataset.action = action;
  button.dataset.id = id;
  return button;
}
function currentItems(date = new Date()) {
  return filterRestaurants(restaurants, state, date);
}
function syncControls() {
  document.querySelectorAll('[data-filter]').forEach((group) => {
    group
      .querySelectorAll('button')
      .forEach((button) =>
        button.setAttribute(
          'aria-pressed',
          String(state[group.dataset.filter] === button.dataset.value),
        ),
      );
  });
  document
    .querySelectorAll('[data-view]')
    .forEach((button) =>
      button.setAttribute(
        'aria-pressed',
        String(state.view === button.dataset.view),
      ),
    );
  $('cuisine').value = state.cuisine;
  $('open-only').checked = state.openOnly;
  $('search').value = state.query;
  $('saved-count').textContent = String(state.savedIds.length).padStart(2, '0');
  $('blocked-count').textContent = state.blockedIds.length;
  $('restore-blocked').hidden =
    state.view !== 'blocked' || !state.blockedIds.length;
}
function renderRecent() {
  const content = state.recentIds.map((id) => {
    const restaurant = restaurants.find((r) => r.id === id);
    return actionButton('details', id, restaurant.name, 'recent-chip');
  });
  $('recent-list').replaceChildren(
    ...(content.length
      ? content
      : [makeElement('span', 'muted', '還沒有紀錄，讓轉盤幫你開個頭。')]),
  );
  $('clear-history').hidden = !content.length;
}
function renderList(items, date) {
  const active = document.activeElement;
  const focus = active?.closest('#restaurant-grid')
    ? { action: active.dataset.action, id: active.dataset.id }
    : null;
  const sorted = [...items];
  if (state.sort === 'price') {
      const rank = { cheap: 0, medium: 1, expensive: 2, unknown: 3 };
    sorted.sort((a, b) => rank[a.price_range] - rank[b.price_range]);
  } else if (state.sort === 'name')
    sorted.sort((a, b) => a.name.localeCompare(b.name, 'zh-Hant'));
  const cards = sorted.slice(0, state.limit).map((r) => {
    const card = makeElement('article', 'restaurant-card');
    const top = makeElement('div', 'card-top');
    const icon = makeElement(
      'span',
      'food-icon',
      cuisineMarks[r.cuisine] || '食',
    );
    icon.setAttribute('aria-hidden', 'true');
    const heading = makeElement('div');
    const title = makeElement('h3');
    title.append(actionButton('details', r.id, r.name, 'card-title'));
    heading.append(
      title,
      makeElement(
        'p',
        'card-meta',
        `${r.cuisine} · ${r.location} · ${priceLabels[r.price_range]}`,
      ),
    );
    const saved = state.savedIds.includes(r.id);
    const favorite = actionButton(
      'save',
      r.id,
      saved ? '♥' : '♡',
      'favorite-button icon-button',
    );
    favorite.setAttribute(
      'aria-label',
      `${saved ? '取消收藏' : '收藏'}${r.name}`,
    );
    favorite.setAttribute('aria-pressed', String(saved));
    top.append(icon, heading, favorite);
    const bottom = makeElement('div', 'card-bottom');
    const status = openingStatus(r, date);
    bottom.append(makeElement('span', `status ${status.state}`, status.label));
    bottom.append(
      actionButton(
        state.view === 'blocked' ? 'restore' : 'details',
        r.id,
        state.view === 'blocked' ? '恢復選項 ↗' : '看看這間 ↗',
        'card-details',
      ),
    );
    card.append(top, makeElement('p', 'card-note', r.note), bottom);
    return card;
  });
  $('restaurant-grid').replaceChildren(...cards);
  $('empty-state').hidden = items.length > 0;
  $('load-more').hidden = items.length <= state.limit;
  $('load-more').textContent =
    `再看看更多餐廳（還有 ${Math.max(0, items.length - state.limit)} 間）↓`;
  $('empty-title').textContent =
    state.view === 'saved'
      ? '把喜歡的，留在口袋裡。'
      : state.view === 'blocked'
        ? '沒有暫不考慮的餐廳'
        : '這次沒有找到餐廳';
  $('empty-description').textContent =
    state.view === 'saved'
      ? '點餐廳旁的愛心收藏；已有收藏的話，試著放寬篩選。'
      : state.view === 'blocked'
        ? '你暫時略過的餐廳會出現在這裡，也能隨時恢復。'
        : '換個關鍵字，或放寬上方的篩選條件。';
  $('list-count').textContent = filterRestaurants(
    restaurants,
    { ...state, view: 'all' },
    date,
  ).length;
  $('list-summary').textContent =
    `共 ${items.length} 間・${state.view === 'blocked' ? '這份清單不參與抽選' : '清單與轉盤使用相同條件'}・營業狀態為時刻表推估`;
  if (focus) {
    const replacement = $('restaurant-grid').querySelector(
      `[data-action="${focus.action}"][data-id="${focus.id}"]`,
    );
    (
      replacement || document.querySelector(`[data-view="${state.view}"]`)
    ).focus({ preventScroll: true });
  }
}
function render() {
  const date = new Date();
  const items = currentItems(date);
  syncControls();
  if (!state.busy) {
    const pool = state.view === 'blocked' ? [] : items;
    wheel.setItems(pool);
    $('pool-count').textContent = pool.length;
    $('spin-btn').disabled = !pool.length;
    $('spin-label').textContent =
      pool.length === 1 ? '就是這一間' : '讓食間，選一間';
    $('spin-hint').textContent =
      state.view === 'blocked'
        ? '先恢復店家，或切回全部餐廳再抽選。'
        : !pool.length
          ? '暫無符合的選項，試著重設條件或恢復店家。'
          : '每間餐廳機會均等，把驚喜留給下一秒。';
  }
  renderList(items, date);
}
function updateResult() {
  const r = state.lastResult;
  if (!r) return;
  $('result-name').textContent = r.name;
  $('result-emoji').textContent = cuisineMarks[r.cuisine] || '食';
  $('result-kicker').textContent = resultIsDraw
    ? 'THE CHOSEN ONE'
    : 'THE NEIGHBORHOOD EDIT';
  $('result-intro').textContent = resultIsDraw
    ? '今天，就吃這間。'
    : '下一餐，也許在這裡。';
  $('result-tags').replaceChildren(
    ...[r.cuisine, priceLabels[r.price_range], r.location].map((text) =>
      makeElement('span', '', text),
    ),
  );
  $('result-note').textContent = r.note;
  const status = openingStatus(r);
  $('result-status').className = `status ${status.state}`;
  $('result-status').textContent = status.label;
  $('result-hours').textContent = status.hours || '尚無營業時間資料';
  $('result-hours-note').textContent = r.hoursNote || (r.verification?.source
    ? '依店家網站列載時段，臨時異動請另向店家確認。'
    : '時刻表尚待確認，出發前請查詢店家近況。');
  $('result-address').textContent = [r.address, r.phone].filter(Boolean).join(' · ');
  $('result-address').hidden = !r.address && !r.phone;
  const info = r.verification;
  $('result-verification').textContent = info?.source
    ? `來源查閱 ${info.checkedAt} · 核對：${info.fields}。${info.note}`
    : (info?.note || '現行資料待確認。');
  $('result-price-note').textContent = r.priceNote || (r.price_range === 'unknown'
    ? '尚未取得可確認的價格。' : '價格分類為舊資料估計，尚未核對現行菜單。');
  $('result-source').hidden = !info?.source;
  if (info?.source) {
    $('result-source').href = info.source;
    $('result-source').textContent = `${info.label} ↗`;
  }
  const noticeSource = status.source || (Object.hasOwn(r.specialHours || {}, new Date(Date.now() + 28800000).toISOString().slice(0, 10)) ? r.specialHoursSource : null);
  $('result-notice').hidden = !noticeSource;
  if (noticeSource) $('result-notice').href = noticeSource;
  $('map-link').href =
    `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${r.name} ${r.address || `嘉義 民雄 ${r.location === '校內' ? '中正大學' : r.location}`}`)}`;
  const saved = state.savedIds.includes(r.id);
  $('save-result').textContent = saved ? '♥ 已收藏' : '♡ 收藏這間';
  $('save-result').setAttribute('aria-pressed', String(saved));
  $('block-result').textContent = state.blockedIds.includes(r.id)
    ? '恢復這間餐廳'
    : '暫時不考慮';
  $('respin').disabled = !wheel.items.length || state.busy;
}
function showResult(restaurant, fromDraw = false) {
  shareRequest++;
  if (!dialog.open)
    returnFocus = fromDraw ? $('spin-btn') : document.activeElement;
  state.lastResult = restaurant;
  resultIsDraw = fromDraw;
  $('share-fallback').hidden = true;
  $('share-result').textContent = '分享這間 ↗';
  $('result-feedback').hidden = true;
  updateResult();
  if (!dialog.open) dialog.showModal();
}
function closeResult() {
  dialog.close();
}
function toggleSave(id) {
  state.savedIds = state.savedIds.includes(id)
    ? state.savedIds.filter((value) => value !== id)
    : [...state.savedIds, id];
  persist('savedIds');
  render();
  updateResult();
}
function restore(id) {
  state.blockedIds = state.blockedIds.filter((value) => value !== id);
  persist('blockedIds');
  render();
  toast('已恢復這間餐廳。');
}
function setBusy(busy) {
  state.busy = busy;
  document
    .querySelectorAll(
      '.preferences button, .preferences select, .preferences input, .list-toolbar button, .list-toolbar select, #search, #nav-saved, #empty-reset, #restore-blocked, #restaurant-grid button, #recent-list button, #load-more, #clear-history',
    )
    .forEach((el) => {
      el.disabled = busy;
    });
  $('spin-btn').disabled = busy;
  $('spin-btn').setAttribute('aria-busy', String(busy));
}
function spin() {
  if (state.busy) return;
  // 重新確認時刻，並將整輪選項固定到動畫結束。
  render();
  if (!wheel.items.length) return;
  if (dialog.open) closeResult();
  setBusy(true);
  $('spin-label').textContent = '好食，正在路上…';
  $('spin-hint').textContent = '正在為你選一間。';
  const targetIndex = Math.floor(Math.random() * wheel.items.length);
  wheel.spin(
    targetIndex,
    (winner) => {
      setBusy(false);
      state.recentIds = [
        winner.id,
        ...state.recentIds.filter((id) => id !== winner.id),
      ].slice(0, 5);
      persist('recentIds');
      renderRecent();
      render();
      showResult(winner, true);
    },
    matchMedia('(prefers-reduced-motion: reduce)').matches ||
      wheel.items.length === 1,
  );
}
function reset() {
  const fromEmptyState = document.activeElement === $('empty-reset');
  Object.assign(state, defaults, { limit: 12 });
  render();
  if (fromEmptyState) $('search').focus({ preventScroll: true });
}
async function shareResult() {
  if (!state.lastResult) return;
  const request = ++shareRequest;
  const isCurrent = () => dialog.open && request === shareRequest;
  const url = new URL(location.href);
  url.search = '';
  url.hash = '';
  url.searchParams.set('result', state.lastResult.id);
  try {
    if (!navigator.clipboard?.writeText)
      throw new Error('Clipboard unavailable');
    await navigator.clipboard.writeText(url.href);
    if (!isCurrent()) return;
    $('share-result').textContent = '已複製連結 ✓';
    $('share-fallback').hidden = true;
  } catch {
    if (!isCurrent()) return;
    $('share-result').textContent = '請手動複製連結';
    toast('無法自動複製，請複製下方連結。');
    $('share-fallback').hidden = false;
    $('share-url').value = url.href;
    $('share-url').focus();
    $('share-url').select();
  }
}

document.querySelectorAll('[data-filter]').forEach((group) =>
  group.addEventListener('click', (event) => {
    const button = event.target.closest('button');
    if (!button || state.busy) return;
    state[group.dataset.filter] = button.dataset.value;
    state.limit = 12;
    render();
  }),
);
document.querySelectorAll('[data-view]').forEach((button) =>
  button.addEventListener('click', () => {
    if (state.busy) return;
    state.view = button.dataset.view;
    state.limit = 12;
    render();
  }),
);
['cuisine', 'sort'].forEach((id) =>
  $(id).addEventListener('change', (event) => {
    if (state.busy) return;
    state[id] = event.target.value;
    state.limit = 12;
    render();
  }),
);
$('search').addEventListener('input', (event) => {
  if (state.busy) return;
  state.query = event.target.value;
  state.limit = 12;
  render();
});
$('open-only').addEventListener('change', (event) => {
  if (state.busy) return;
  state.openOnly = event.target.checked;
  state.limit = 12;
  render();
});
['restaurant-grid', 'recent-list'].forEach((id) =>
  $(id).addEventListener('click', (event) => {
    if (state.busy) return;
    const button = event.target.closest('button[data-action]');
    if (!button) return;
    const restaurant = restaurants.find(
      (r) => r.id === Number(button.dataset.id),
    );
    if (!restaurant) return;
    if (button.dataset.action === 'save') toggleSave(restaurant.id);
    else if (button.dataset.action === 'restore') restore(restaurant.id);
    else showResult(restaurant);
  }),
);
$('reset-filters').addEventListener('click', reset);
$('empty-reset').addEventListener('click', reset);
$('nav-saved').addEventListener('click', () => {
  Object.assign(state, defaults, { view: 'saved', limit: 12 });
  render();
  $('explore').scrollIntoView();
});
$('load-more').addEventListener('click', () => {
  const previousLimit = state.limit;
  state.limit += 12;
  render();
  // 增載後讓鍵盤使用者接續第一張新卡片。
  $('restaurant-grid')
    .children[previousLimit]?.querySelector('button')
    ?.focus({ preventScroll: true });
});
$('clear-history').addEventListener('click', () => {
  state.recentIds = [];
  persist('recentIds');
  renderRecent();
});
$('restore-blocked').addEventListener('click', () => {
  state.blockedIds = [];
  persist('blockedIds');
  render();
  toast('已恢復全部餐廳。');
});
$('spin-btn').addEventListener('click', spin);
$('respin').addEventListener('click', spin);
$('close-result').addEventListener('click', closeResult);
dialog.addEventListener('click', (event) => {
  const rect = dialog.getBoundingClientRect();
  if (
    event.target === dialog &&
    (event.clientX < rect.left ||
      event.clientX > rect.right ||
      event.clientY < rect.top ||
      event.clientY > rect.bottom)
  )
    closeResult();
});
dialog.addEventListener('close', () => {
  shareRequest++;
  if (!$('result-feedback').hidden) {
    const message = $('result-feedback').textContent;
    $('result-feedback').hidden = true;
    toast(message);
  }
  $('share-result').textContent = '分享這間 ↗';
  if (returnFocus === document.body)
    $('spin-btn').focus({ preventScroll: true });
  else if (returnFocus?.isConnected) returnFocus.focus({ preventScroll: true });
  else if (returnFocus?.dataset.id) {
    const { action, id } = returnFocus.dataset;
    const replacement = document.querySelector(
      `button[data-action="${action}"][data-id="${id}"]`,
    );
    (replacement || $('reset-filters')).focus({ preventScroll: true });
  }
});
$('save-result').addEventListener('click', () => {
  if (state.lastResult) toggleSave(state.lastResult.id);
});
$('share-result').addEventListener('click', shareResult);
$('block-result').addEventListener('click', () => {
  const id = state.lastResult?.id;
  if (!id) return;
  if (state.blockedIds.includes(id)) restore(id);
  else {
    state.blockedIds.push(id);
    persist('blockedIds');
    render();
    toast('已暫時略過，可從「暫不考慮」恢復。');
  }
  closeResult();
});
// 回到頁面與每分鐘更新，避免開著網頁後沿用過期的營業狀態。
function refreshTime() {
  if (!state.busy && !document.hidden) {
    render();
    if (dialog.open) updateResult();
  }
}
document.addEventListener('visibilitychange', refreshTime);
setInterval(refreshTime, 60000);

for (const cuisine of new Set(restaurants.map((r) => r.cuisine))) {
  const option = makeElement('option', '', cuisine);
  option.value = cuisine;
  $('cuisine').append(option);
}
$('total-count').textContent = restaurants.length;
const sourcedCount = restaurants.filter((r) => r.verification?.source).length;
$('data-coverage').textContent = `2026.09.10 資料查核 · ${sourcedCount} 間附來源 · ${restaurants.length - sourcedCount} 間待確認`;
renderRecent();
render();
document.fonts?.ready.then(() => {
  if (!state.busy) wheel.draw();
});
const sharedId = Number(new URLSearchParams(location.search).get('result'));
const sharedRestaurant = restaurants.find((r) => r.id === sharedId);
if (sharedRestaurant) showResult(sharedRestaurant);
