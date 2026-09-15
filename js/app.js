'use strict';

const $ = (id) => document.getElementById(id);
const restaurants = window.RESTAURANTS;
const { openingStatus, filterRestaurants, validIds } = FoodCore;
const priceLabels = {
  cheap: '< 80 元',
  medium: '80–150 元',
  expensive: '> 150 元',
  unknown: '',
};
function isStaffCopy(text) {
  return /本輪|不恢復|雇主頁|聚合頁|聚合地圖|不能用招工|不能刪除|不能捏造|不能宣稱|不能套用|歷史線索|尚未取得可核對|字號|已排除|不是品牌|不是現場|不是2026|無來源更新日|登錄不能|SipSpot|Uber Eats|foodpanda|LINE熱點|查閱日期|核對：|現行資料待確認|時間保持未確認/.test(
    text || '',
  );
}
function visitorNote(restaurant) {
  const note = (restaurant.note || '').trim();
  if (!note) return '';
  if (!isStaffCopy(note)) return note;
  const first = note.split('。')[0].trim();
  return first && !isStaffCopy(first) && first.length < 40 ? first : '';
}
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
const draw = new CardDraw($('draw-stage'));
const dialog = $('result-dialog');
let resultMotion;
let closingResult = false;
let keyboardInput = false;
document.addEventListener('keydown', () => {
  keyboardInput = true;
});
document.addEventListener('pointerdown', () => {
  keyboardInput = false;
});
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
  const meals = {
    breakfast: '早餐',
    lunch: '午餐',
    dinner: '晚餐',
    latenight: '宵夜',
  };
  const selected = [
    meals[state.meal],
    priceLabels[state.price],
    state.location === 'all' ? '' : state.location,
    state.cuisine === 'all' ? '' : state.cuisine,
    state.openOnly ? '目前營業' : '',
  ].filter(Boolean);
  $('filter-label').textContent = selected.length
    ? selected.join(' · ')
    : '調整餐別、預算與區域';

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
      : [makeElement('span', 'muted', '選過的餐廳會留在這裡。')]),
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
        [r.cuisine, r.location, priceLabels[r.price_range]]
          .filter(Boolean)
          .join(' · '),
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
    if (status.state !== 'unknown')
      bottom.append(
        makeElement('span', `status ${status.state}`, status.label),
      );
    bottom.append(
      actionButton(
        state.view === 'blocked' ? 'restore' : 'details',
        r.id,
        state.view === 'blocked' ? '恢復選項 ↗' : '看看這間 ↗',
        'card-details',
      ),
    );
    const note = visitorNote(r);
    card.append(top, ...(note ? [makeElement('p', 'card-note', note)] : []), bottom);
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
    `共 ${items.length} 間`;
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
    draw.setItems(pool);
    $('spin-btn').dataset.count = pool.length;
    $('spin-btn').disabled = !pool.length;
    $('spin-label').textContent =
      pool.length === 1 ? '就是這一間' : '幫我選一間';
    $('spin-hint').textContent =
      state.view === 'blocked'
        ? '先恢復店家，或切回全部餐廳再抽選。'
        : !pool.length
          ? '暫無符合的選項，試著重設條件或恢復店家。'
          : `目前 ${pool.length} 間符合條件 · 抽選機會相同`;
  }
  renderList(items, date);
}
function updateResult() {
  const r = state.lastResult;
  if (!r) return;
  $('result-name').textContent = r.name;
  $('result-emoji').textContent = cuisineMarks[r.cuisine] || '食';
  $('result-kicker').textContent = resultIsDraw ? '本次選餐' : '餐廳詳情';
  $('result-intro').textContent = resultIsDraw
    ? '今天，就吃這間。'
    : '店家資訊';
  $('result-tags').replaceChildren(
    ...[r.cuisine, priceLabels[r.price_range], r.location]
      .filter(Boolean)
      .map((text) => makeElement('span', '', text)),
  );
  const note = visitorNote(r);
  $('result-note').textContent = note;
  $('result-note').hidden = !note;
  const status = openingStatus(r);
  $('result-status').className = `status ${status.state}`;
  $('result-status').textContent = status.label;
  $('result-hours').textContent = status.hours || '';
  $('result-hours').hidden = !status.hours;
  const hoursNote =
    r.hoursNote && !isStaffCopy(r.hoursNote) ? r.hoursNote : '';
  $('result-hours-note').textContent = hoursNote;
  $('result-hours-note').hidden = !hoursNote;
  $('result-address').textContent = [r.address, r.phone]
    .filter(Boolean)
    .join(' · ');
  $('result-address').hidden = !r.address && !r.phone;
  const info = r.verification;
  $('result-verification').textContent = info?.source
    ? `資料來自${info.label}`
    : '';
  $('result-verification').hidden = !info?.source;
  $('result-price-note').textContent = r.priceNote || '';
  $('result-price-note').hidden = !r.priceNote;
  $('result-source').hidden = !info?.source;
  if (info?.source) {
    $('result-source').href = info.source;
    $('result-source').textContent = `${info.label} ↗`;
  }
  $('hours-disclaimer').hidden =
    status.state === 'unknown' && !status.hours && !hoursNote;
  document.querySelector('.result-provenance').hidden =
    $('result-verification').hidden && $('result-price-note').hidden;
  const noticeSource =
    status.source ||
    (Object.hasOwn(
      r.specialHours || {},
      new Date(Date.now() + 28800000).toISOString().slice(0, 10),
    )
      ? r.specialHoursSource
      : null);
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
  $('respin').disabled = !draw.items.length || state.busy;
}
function showResult(restaurant, fromDraw = false) {
  const origin = fromDraw
    ? $('spin-btn')
    : document.activeElement?.closest('.restaurant-card');
  const originRect = origin?.getBoundingClientRect();
  shareRequest++;
  if (!dialog.open)
    returnFocus = fromDraw ? $('spin-btn') : document.activeElement;
  state.lastResult = restaurant;
  resultIsDraw = fromDraw;
  $('share-fallback').hidden = true;
  $('share-result').textContent = '分享這間 ↗';
  $('result-feedback').hidden = true;
  updateResult();
  if (!dialog.open) {
    dialog.showModal();
    dialog.scrollTop = 0;
    dialog.querySelector('details').open = false;
    animateResult(originRect);
  }
}
function closeResult(immediate = false) {
  if (!dialog.open || closingResult) return;
  const target = returnFocus?.isConnected ? returnFocus : $('spin-btn');
  const source = target.getBoundingClientRect();
  if (
    immediate ||
    keyboardInput ||
    matchMedia('(prefers-reduced-motion: reduce)').matches ||
    !dialog.animate
  ) {
    resultMotion?.cancel();
    dialog.close();
    return;
  }
  closingResult = true;
  resultMotion?.cancel();
  const rect = dialog.getBoundingClientRect();
  const dx = source.left + source.width / 2 - rect.left - rect.width / 2;
  const dy = source.top + source.height / 2 - rect.top - rect.height / 2;
  resultMotion = dialog.animate(
    [
      { transform: 'translate(0, 0) scale(1)', opacity: 1 },
      {
        transform: `translate(${dx * 0.15}px, ${dy * 0.15}px) scale(.94)`,
        opacity: 0,
      },
    ],
    {
      duration: 180,
      easing: 'cubic-bezier(0.23, 1, 0.32, 1)',
      fill: 'forwards',
    },
  );
  resultMotion.finished
    .catch(() => {})
    .then(() => {
      dialog.close();
      resultMotion?.cancel();
      closingResult = false;
    });
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
  if (!draw.items.length) return;
  if (dialog.open) closeResult(true);
  setBusy(true);
  $('spin-label').textContent = '正在揭曉…';
  $('spin-hint').textContent = '請稍候，這一餐正在選定。';
  const targetIndex = Math.floor(Math.random() * draw.items.length);
  draw.spin(
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
      keyboardInput ||
      draw.items.length === 1,
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
$('close-result').addEventListener('click', () => closeResult());
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
renderRecent();
render();
const sharedId = Number(new URLSearchParams(location.search).get('result'));
const sharedRestaurant = restaurants.find((r) => r.id === sharedId);
if (sharedRestaurant) showResult(sharedRestaurant);

function animateResult(origin) {
  resultMotion?.cancel();
  if (
    keyboardInput ||
    matchMedia('(prefers-reduced-motion: reduce)').matches ||
    !dialog.animate
  )
    return;
  const end = dialog.getBoundingClientRect();
  const dx = origin
    ? origin.left + origin.width / 2 - end.left - end.width / 2
    : 0;
  const dy = origin
    ? origin.top + origin.height / 2 - end.top - end.height / 2
    : 30;
  resultMotion = dialog.animate(
    [
      { transform: `translate(${dx}px, ${dy}px) scale(.94)`, opacity: 0 },
      { transform: 'translate(0, 0) scale(1)', opacity: 1 },
    ],
    { duration: 280, easing: 'cubic-bezier(0.23, 1, 0.32, 1)' },
  );
}
if (
  'IntersectionObserver' in window &&
  !matchMedia('(prefers-reduced-motion: reduce)').matches
) {
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries)
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
    },
    { threshold: 0.12 },
  );
  document.querySelectorAll('.explore-heading, .recent-strip').forEach((el) => {
    el.classList.add('reveal-on-scroll');
    observer.observe(el);
  });
}
