// @ts-check
// 進入點：載入資料、管理狀態、把 core 的純函式結果畫到畫面上。

import { AREAS, MEALS, PRICE_LABEL, PRICES, TAG_BY_ID, TAGS, mealForMinute } from './core/catalog.js';
import { buildCandidates, countActiveFilters, DEFAULT_FILTERS } from './core/filters.js';
import { describeStatus } from './core/format.js';
import { openingStatus, taipeiClock } from './core/hours.js';
import { pickIndex, pushRecent, recencyWeight } from './core/picker.js';
import { createIdStore, safeLocalStorage } from './core/storage.js';
import { readFilters, writeFilters } from './core/url-state.js';
import { celebrate, prefersReducedMotion, replayClass, startAmbient } from './ui/effects.js';
import { Wheel } from './ui/wheel.js';

/** @typedef {import('./types.js').Restaurant} Restaurant */
/** @typedef {import('./types.js').Candidate} Candidate */
/** @typedef {import('./types.js').Filters} Filters */
/** @typedef {import('./types.js').Meal} Meal */

// ── DOM ────────────────────────────────────────────────────────────
/**
 * @template {HTMLElement} T
 * @param {string} id
 * @param {{ new (): T }} type
 * @returns {T}
 */
function $(id, type) {
  const el = document.getElementById(id);
  if (!(el instanceof type)) throw new Error(`#${id} 不存在或型別不符`);
  return el;
}

const ui = {
  nowLine: $('now-line', HTMLElement),
  mealTabs: $('meal-tabs', HTMLElement),
  canvas: $('wheel-canvas', HTMLCanvasElement),
  wheelWrapper: /** @type {HTMLElement} */ (document.querySelector('.wheel-wrapper')),
  legend: $('wheel-legend', HTMLElement),
  listBtn: $('list-btn', HTMLButtonElement),
  count: $('count', HTMLElement),
  excludedNote: $('excluded-note', HTMLElement),
  openOnly: $('open-only', HTMLInputElement),
  luckyBtn: $('lucky-btn', HTMLButtonElement),
  spinBtn: $('spin-btn', HTMLButtonElement),
  emptyState: $('empty-state', HTMLElement),
  emptyText: $('empty-text', HTMLElement),
  relaxBtn: $('relax-btn', HTMLButtonElement),
  filterPanel: $('filter-panel', HTMLDetailsElement),
  filterCount: $('filter-count', HTMLElement),
  tagChips: $('tag-chips', HTMLElement),
  dietChips: $('diet-chips', HTMLElement),
  areaChips: $('area-chips', HTMLElement),
  priceChips: $('price-chips', HTMLElement),
  verifiedOnly: $('verified-only', HTMLInputElement),
  weighting: $('weighting', HTMLInputElement),
  resetBtn: $('reset-btn', HTMLButtonElement),
  blockedBtn: $('blocked-btn', HTMLButtonElement),
  blockedCount: $('blocked-count', HTMLElement),
  recentBox: $('recent-box', HTMLElement),
  recentList: $('recent-list', HTMLElement),
  clearRecentBtn: $('clear-recent-btn', HTMLButtonElement),
  dataSummary: $('data-summary', HTMLElement),
  listDialog: $('list-dialog', HTMLDialogElement),
  list: $('list', HTMLElement),
  resultDialog: $('result-dialog', HTMLDialogElement),
  blockedDialog: $('blocked-dialog', HTMLDialogElement),
  blockedList: $('blocked-list', HTMLElement),
  unblockAllBtn: $('unblock-all-btn', HTMLButtonElement),
  toast: $('toast', HTMLElement),
  announcer: $('sr-announcer', HTMLElement),
  fxLayer: $('fx-layer', HTMLElement),
  splash: $('splash', HTMLElement),
  splashText: $('splash-text', HTMLElement),
  result: {
    emoji: $('result-emoji', HTMLElement),
    name: $('result-name', HTMLElement),
    cuisine: $('result-cuisine', HTMLElement),
    price: $('result-price', HTMLElement),
    area: $('result-area', HTMLElement),
    tags: $('result-tags', HTMLElement),
    status: $('result-status', HTMLElement),
    statusBadge: $('result-status-badge', HTMLElement),
    statusDetail: $('result-status-detail', HTMLElement),
    note: $('result-note', HTMLElement),
    address: $('result-address', HTMLElement),
    source: $('result-source', HTMLElement),
    mapLink: $('map-link', HTMLAnchorElement),
    eatBtn: $('eat-btn', HTMLButtonElement),
    blockBtn: $('block-btn', HTMLButtonElement),
    respinBtn: $('respin-btn', HTMLButtonElement),
    shareBtn: $('share-btn', HTMLButtonElement),
  },
};

// ── State ──────────────────────────────────────────────────────────
const KEYS = { blocked: 'food_blocked', recent: 'food_recent', weighting: 'food_weighting', splash: 'food_splash_seen' };
const storage = safeLocalStorage();
const idStore = createIdStore(storage);

const state = {
  /** @type {Restaurant[]} */
  restaurants: [],
  /** @type {Map<number, Restaurant>} */
  byId: new Map(),
  /** @type {Filters} */
  filters: { ...DEFAULT_FILTERS, tags: [] },
  /** @type {number[]} */
  blocked: [],
  /** @type {number[]} 由新到舊 */
  recent: [],
  weighting: false,
  /** @type {Set<number>} 本輪暫時排除，不寫入儲存 */
  excluded: new Set(),
  /** @type {Candidate[]} 符合篩選的店（含暫時排除者） */
  pool: [],
  /** @type {Candidate[]} 真正放上轉盤的店 */
  candidates: [],
  /** @type {Candidate | null} */
  result: null,
  /** 使用者動過篩選後才把條件寫進網址 */
  urlDirty: false,
  busy: false,
  lastMinute: -1,
};

const wheel = new Wheel(ui.canvas);
const TONE_ORDER = { open: 0, soon: 1, likely: 2, unknown: 3, closed: 4 };

// ── Helpers ────────────────────────────────────────────────────────
/** @param {Restaurant} r */
const emojiOf = (r) => TAG_BY_ID.get(r.tags[0])?.emoji ?? '🍽️';
/** @param {number} id */
const weightOf = (id) => (state.weighting ? recencyWeight(id, state.recent) : 1);

/**
 * @param {string} tag
 * @param {Record<string, string>} [attrs]
 * @param {(string | Node)[]} [children]
 */
function h(tag, attrs = {}, children = []) {
  const el = document.createElement(tag);
  for (const [key, value] of Object.entries(attrs)) {
    if (key === 'class') el.className = value;
    else el.setAttribute(key, value);
  }
  el.append(...children);
  return el;
}

let toastTimer = 0;
/** @param {string} message */
function toast(message) {
  ui.toast.textContent = message;
  ui.toast.dataset.show = 'true';
  clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => (ui.toast.dataset.show = 'false'), 2200);
}

/** @param {string} message */
function announce(message) {
  ui.announcer.textContent = '';
  requestAnimationFrame(() => (ui.announcer.textContent = message));
}

/** @param {Meal | 'all'} meal */
function mealPeriodText(meal) {
  return { breakfast: '早餐', lunch: '午餐', dinner: '晚餐', latenight: '宵夜', all: '下午茶' }[meal];
}

// ── Render ─────────────────────────────────────────────────────────
function render() {
  const now = new Date();
  const blockedIds = new Set(state.blocked);
  const pool = buildCandidates(state.restaurants, state.filters, { now, blockedIds });
  pool.sort(
    (a, b) => TONE_ORDER[describeStatus(a.status, now).tone] - TONE_ORDER[describeStatus(b.status, now).tone],
  );
  state.pool = pool;
  state.candidates = pool.filter((c) => !state.excluded.has(c.restaurant.id));

  wheel.setSlices(state.candidates.map((c) => ({ label: c.restaurant.name, weight: weightOf(c.restaurant.id) })));
  ui.canvas.setAttribute('aria-label', `餐廳轉盤，共 ${state.candidates.length} 間`);
  ui.count.textContent = String(state.candidates.length);
  ui.excludedNote.textContent = state.excluded.size ? `（排除 ${state.excluded.size}）` : '';
  ui.listBtn.dataset.single = String(state.candidates.length === 1);
  ui.legend.hidden = !(state.weighting && state.candidates.some((c) => state.recent.includes(c.restaurant.id)));

  const empty = state.candidates.length === 0;
  ui.spinBtn.disabled = empty || state.busy;
  ui.luckyBtn.disabled = empty || state.busy;
  ui.emptyState.hidden = !empty || state.restaurants.length === 0;
  if (empty) renderEmptyState();

  renderControls(now);
  renderNowLine(now);
  ui.blockedCount.textContent = String(state.blocked.length);
  renderRecent();

  if (state.urlDirty) {
    const params = writeFilters(state.filters, new URLSearchParams(location.search));
    params.delete('result');
    const query = params.toString();
    history.replaceState(null, '', query ? `?${query}` : location.pathname);
  }
}

/** @param {Date} now */
function renderControls(now) {
  const f = state.filters;
  for (const btn of ui.mealTabs.querySelectorAll('[data-meal]'))
    btn.setAttribute('aria-pressed', String(btn.getAttribute('data-meal') === f.meal));
  for (const btn of ui.areaChips.querySelectorAll('[data-area]'))
    btn.setAttribute('aria-pressed', String(btn.getAttribute('data-area') === f.area));
  for (const btn of ui.priceChips.querySelectorAll('[data-price]'))
    btn.setAttribute('aria-pressed', String(btn.getAttribute('data-price') === f.price));

  // 標籤旁的數字：在其他條件不變下，選這個標籤會有幾間
  const withoutTags = buildCandidates(state.restaurants, { ...f, tags: [] }, { now, blockedIds: new Set(state.blocked) });
  for (const btn of [...ui.tagChips.children, ...ui.dietChips.children]) {
    const tag = btn.getAttribute('data-tag');
    const n = withoutTags.filter((c) => c.restaurant.tags.some((t) => t === tag)).length;
    btn.setAttribute('aria-pressed', String(f.tags.some((t) => t === tag)));
    btn.setAttribute('data-empty', String(n === 0));
    const counter = btn.querySelector('.chip-count');
    if (counter) counter.textContent = String(n);
  }

  ui.openOnly.checked = f.openOnly;
  ui.verifiedOnly.checked = f.verifiedOnly;
  ui.weighting.checked = state.weighting;
  const active = countActiveFilters({ ...f, meal: 'all', openOnly: true });
  ui.filterCount.hidden = active === 0;
  ui.filterCount.textContent = String(active);
}

/** @param {Date} now */
function renderNowLine(now) {
  const { minute, day } = taipeiClock(now);
  let open = 0;
  let likely = 0;
  for (const r of state.restaurants) {
    const s = openingStatus(r, now).state;
    if (s === 'open') open++;
    else if (s === 'likely') likely++;
  }
  const hhmm = `${String(Math.floor(minute / 60)).padStart(2, '0')}:${String(minute % 60).padStart(2, '0')}`;
  const weekday = '日一二三四五六'[day];
  ui.nowLine.replaceChildren(
    `週${weekday} ${hhmm}・${mealPeriodText(mealForMinute(minute))}時段　`,
    h('strong', {}, [`${open} 間確定營業`]),
    '・',
    h('span', { class: 'likely' }, [`${likely} 間可能營業`]),
  );
}

/** 依目前條件，建議最有效的放寬方式。 */
function relaxPlan() {
  const f = state.filters;
  if (f.tags.length || f.price !== 'all' || f.area !== 'all' || f.verifiedOnly)
    return { label: '清除類型、區域與價位條件', apply: () => Object.assign(f, { tags: [], price: 'all', area: 'all', verifiedOnly: false }) };
  if (f.meal !== 'all') return { label: '改看全部餐別', apply: () => (f.meal = 'all') };
  if (f.openOnly) return { label: '也顯示休息中的店', apply: () => (f.openOnly = false) };
  if (state.excluded.size) return { label: '恢復本輪排除的店', apply: () => state.excluded.clear() };
  return null;
}

function renderEmptyState() {
  const plan = relaxPlan();
  const allBlocked = state.blocked.length > 0 && state.blocked.length >= state.restaurants.length;
  ui.emptyText.textContent = allBlocked ? '所有餐廳都被封鎖了！' : '沒有符合條件的店家';
  ui.relaxBtn.hidden = !plan && !state.blocked.length;
  ui.relaxBtn.textContent = plan ? `一鍵放寬：${plan.label}` : '查看封鎖清單';
}

function renderRecent() {
  const items = state.recent.map((id) => state.byId.get(id)).filter((r) => r !== undefined);
  ui.recentBox.hidden = items.length === 0;
  ui.recentList.replaceChildren(...items.map((r) => h('li', {}, [`${emojiOf(r)} ${r.name}`])));
}

// ── Static controls ────────────────────────────────────────────────
function buildControls() {
  const meals = [{ id: 'all', label: '全部', emoji: '🍽️' }, ...MEALS];
  ui.mealTabs.replaceChildren(
    ...meals.map((m) => h('button', { type: 'button', class: 'meal-tab', 'data-meal': m.id }, [`${m.emoji} ${m.label}`])),
  );
  /** @param {(typeof TAGS)[number]} tag */
  const tagChip = (tag) =>
    h('button', { type: 'button', class: 'chip', 'data-tag': tag.id }, [
      `${tag.emoji} ${tag.label}`,
      h('span', { class: 'chip-count' }),
    ]);
  ui.tagChips.replaceChildren(...TAGS.filter((t) => t.group === 'food').map(tagChip));
  ui.dietChips.replaceChildren(...TAGS.filter((t) => t.group === 'diet').map(tagChip));
  ui.areaChips.replaceChildren(
    ...['all', ...AREAS].map((a) => h('button', { type: 'button', class: 'chip', 'data-area': a }, [a === 'all' ? '不限' : a])),
  );
  ui.priceChips.replaceChildren(
    ...[{ id: 'all', label: '不限' }, ...PRICES].map((p) =>
      h('button', { type: 'button', class: 'chip', 'data-price': p.id }, [p.label]),
    ),
  );
}

// ── Filters ────────────────────────────────────────────────────────
/** @param {(f: Filters) => void} mutate */
function updateFilters(mutate) {
  if (state.busy) return;
  mutate(state.filters);
  state.excluded.clear();
  state.urlDirty = true;
  render();
}

/**
 * 把同一組按鈕的點擊委派給容器。
 * @param {HTMLElement} container
 * @param {string} attr
 * @param {(value: string) => void} onPick
 */
function delegate(container, attr, onPick) {
  container.addEventListener('click', (event) => {
    const target = event.target instanceof Element ? event.target.closest(`[${attr}]`) : null;
    const value = target?.getAttribute(attr);
    if (value != null) onPick(value);
  });
}

function wireFilters() {
  delegate(ui.mealTabs, 'data-meal', (meal) => updateFilters((f) => (f.meal = /** @type {Filters['meal']} */ (meal))));
  delegate(ui.areaChips, 'data-area', (area) => updateFilters((f) => (f.area = /** @type {Filters['area']} */ (area))));
  delegate(ui.priceChips, 'data-price', (price) => updateFilters((f) => (f.price = /** @type {Filters['price']} */ (price))));
  /** @param {string} tag */
  const toggleTag = (tag) =>
    updateFilters((f) => {
      const id = /** @type {Filters['tags'][number]} */ (tag);
      f.tags = f.tags.includes(id) ? f.tags.filter((t) => t !== id) : [...f.tags, id];
    });
  delegate(ui.tagChips, 'data-tag', toggleTag);
  delegate(ui.dietChips, 'data-tag', toggleTag);
  ui.openOnly.addEventListener('change', () => updateFilters((f) => (f.openOnly = ui.openOnly.checked)));
  ui.verifiedOnly.addEventListener('change', () => updateFilters((f) => (f.verifiedOnly = ui.verifiedOnly.checked)));
  ui.weighting.addEventListener('change', () => {
    state.weighting = ui.weighting.checked;
    try {
      storage?.setItem(KEYS.weighting, state.weighting ? '1' : '0');
    } catch {
      // 無法儲存偏好時僅本次有效
    }
    render();
  });
  ui.resetBtn.addEventListener('click', () => updateFilters((f) => Object.assign(f, DEFAULT_FILTERS, { tags: [] })));
  ui.relaxBtn.addEventListener('click', () => {
    const plan = relaxPlan();
    if (plan) updateFilters(plan.apply);
    else openBlockedDialog();
  });
}

// ── Spin ───────────────────────────────────────────────────────────
/** @param {boolean} busy */
function setBusy(busy) {
  state.busy = busy;
  ui.spinBtn.disabled = busy || state.candidates.length === 0;
  ui.luckyBtn.disabled = ui.spinBtn.disabled;
  ui.spinBtn.setAttribute('aria-busy', String(busy));
  if (!busy) ui.spinBtn.textContent = '轉！';
}

async function spin() {
  if (state.busy || state.candidates.length === 0) return;
  const pool = state.candidates;
  const index = pickIndex(pool.map((c) => weightOf(c.restaurant.id)));
  setBusy(true);
  ui.spinBtn.textContent = '轉中…';
  await wheel.spin(index, { reducedMotion: prefersReducedMotion() });
  setBusy(false);
  replayClass(ui.wheelWrapper, 'is-celebrating');
  replayClass(ui.wheelWrapper, 'is-shaking');
  showResult(pool[index], true);
}

function luckySpin() {
  if (state.busy || state.candidates.length === 0) return;
  setBusy(true);
  let n = 3;
  ui.spinBtn.textContent = `${n}…`;
  const timer = setInterval(() => {
    n -= 1;
    if (n > 0) {
      ui.spinBtn.textContent = `${n}…`;
      return;
    }
    clearInterval(timer);
    setBusy(false);
    spin();
  }, 1000);
}

// ── Result ─────────────────────────────────────────────────────────
/**
 * @param {Candidate} candidate
 * @param {boolean} fresh 剛抽出來（播放特效）或從分享連結開啟
 */
function showResult(candidate, fresh) {
  const r = candidate.restaurant;
  const now = new Date();
  const status = describeStatus(openingStatus(r, now), now);
  const res = ui.result;
  state.result = candidate;

  res.emoji.textContent = emojiOf(r);
  res.name.textContent = r.name;
  res.cuisine.textContent = r.cuisine;
  res.price.textContent = PRICE_LABEL.get(r.price_range) ?? r.price_range;
  res.area.textContent = r.location;
  res.tags.replaceChildren(
    ...r.tags.map((t) => TAG_BY_ID.get(t)).filter((t) => t !== undefined).map((t) => h('li', {}, [`${t.emoji} ${t.label}`])),
  );
  res.status.dataset.tone = status.tone;
  res.statusBadge.textContent = status.badge;
  res.statusDetail.textContent = status.detail;
  res.note.textContent = r.note;
  res.address.hidden = !r.address;
  res.address.textContent = r.address ? `📍 ${r.address}` : '';

  const v = r.verification;
  if (v.status === 'sourced' && v.source) {
    res.source.replaceChildren(
      '營業時間來源：',
      h('a', { href: v.source, target: '_blank', rel: 'noopener' }, [v.label ?? '公開資料']),
      v.checkedAt ? `（${v.checkedAt} 查閱）` : '',
    );
  } else {
    res.source.textContent = '營業時間尚未查證，僅供參考';
  }

  const query = r.address ? `${r.name} ${r.address}` : `${r.name} 嘉義民雄`;
  res.mapLink.href = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;

  const url = new URL(location.href);
  url.searchParams.set('result', String(r.id));
  history.replaceState(null, '', url);

  if (!ui.resultDialog.open) ui.resultDialog.showModal();
  if (fresh) {
    celebrate(ui.fxLayer, emojiOf(r));
    announce(`抽中：${r.name}，${status.badge}`);
  }
}

function closeResult() {
  ui.resultDialog.close();
}

function wireResult() {
  const res = ui.result;
  res.eatBtn.addEventListener('click', () => {
    if (!state.result) return;
    state.recent = pushRecent(state.recent, state.result.restaurant.id);
    const saved = idStore.write(KEYS.recent, state.recent);
    closeResult();
    toast(saved ? '已記下！祝用餐愉快 😋' : '已記下（瀏覽器不允許儲存，重新整理後會消失）');
    render();
  });
  res.blockBtn.addEventListener('click', () => {
    if (!state.result) return;
    const { id, name } = state.result.restaurant;
    if (!state.blocked.includes(id)) state.blocked = [...state.blocked, id];
    idStore.write(KEYS.blocked, state.blocked);
    closeResult();
    toast(`已封鎖「${name}」`);
    render();
  });
  res.respinBtn.addEventListener('click', () => {
    closeResult();
    spin();
  });
  res.shareBtn.addEventListener('click', share);
  ui.resultDialog.addEventListener('close', () => {
    const url = new URL(location.href);
    url.searchParams.delete('result');
    history.replaceState(null, '', url);
  });
}

async function share() {
  if (!state.result) return;
  const url = new URL(location.href);
  url.searchParams.set('result', String(state.result.restaurant.id));
  const data = { title: '中正大學吃什麼？', text: `今天就吃「${state.result.restaurant.name}」！`, url: url.toString() };
  try {
    if (navigator.share) {
      await navigator.share(data);
      return;
    }
    await navigator.clipboard.writeText(data.url);
    toast('連結已複製！');
  } catch (error) {
    // 使用者取消分享不算錯誤
    if (error instanceof DOMException && error.name === 'AbortError') return;
    window.prompt('複製這個連結：', data.url);
  }
}

// ── List / blocked dialogs ─────────────────────────────────────────
function openListDialog() {
  const now = new Date();
  ui.list.replaceChildren(
    ...state.pool.map(({ restaurant: r, status }) => {
      const d = describeStatus(status, now);
      const inputId = `pick-${r.id}`;
      const checkbox = h('input', { type: 'checkbox', id: inputId, 'data-id': String(r.id) });
      /** @type {HTMLInputElement} */ (checkbox).checked = !state.excluded.has(r.id);
      const sub = [r.cuisine, PRICE_LABEL.get(r.price_range), d.detail].filter(Boolean).join(' · ');
      return h('li', { class: 'item-row' }, [
        checkbox,
        h('label', { for: inputId, class: 'item-label' }, [
          h('span', { class: 'item-emoji', 'aria-hidden': 'true' }, [emojiOf(r)]),
          h('span', { class: 'item-text' }, [
            h('span', { class: 'item-name' }, [
              h('span', {}, [r.name]),
              h('span', { class: 'status-badge', 'data-tone': d.tone }, [d.badge]),
            ]),
            h('span', { class: 'item-sub' }, [sub]),
            state.recent.includes(r.id) ? h('span', { class: 'item-recent' }, [' ・最近吃過']) : '',
          ]),
        ]),
      ]);
    }),
  );
  ui.listDialog.showModal();
}

function applyListDialog() {
  state.excluded = new Set(
    [...ui.list.querySelectorAll('input[type="checkbox"]')]
      .filter((el) => el instanceof HTMLInputElement && !el.checked)
      .map((el) => Number(el.getAttribute('data-id'))),
  );
  render();
}

function openBlockedDialog() {
  const items = state.blocked.map((id) => state.byId.get(id)).filter((r) => r !== undefined);
  ui.blockedList.replaceChildren(
    ...(items.length
      ? items.map((r) =>
          h('li', { class: 'item-row' }, [
            h('span', { class: 'item-emoji', 'aria-hidden': 'true' }, [emojiOf(r)]),
            h('span', { class: 'item-text item-name' }, [r.name]),
            h('button', { type: 'button', class: 'ghost-btn', 'data-unblock': String(r.id) }, ['恢復']),
          ]),
        )
      : [h('li', { class: 'item-sub' }, ['目前沒有封鎖任何店家'])]),
  );
  ui.unblockAllBtn.hidden = items.length === 0;
  if (!ui.blockedDialog.open) ui.blockedDialog.showModal();
}

function wireDialogs() {
  ui.listBtn.addEventListener('click', openListDialog);
  ui.listDialog.addEventListener('close', applyListDialog);
  ui.blockedBtn.addEventListener('click', openBlockedDialog);
  delegate(ui.blockedList, 'data-unblock', (value) => {
    state.blocked = state.blocked.filter((id) => id !== Number(value));
    idStore.write(KEYS.blocked, state.blocked);
    render();
    openBlockedDialog();
  });
  ui.unblockAllBtn.addEventListener('click', () => {
    state.blocked = [];
    idStore.write(KEYS.blocked, state.blocked);
    render();
    openBlockedDialog();
    toast('封鎖清單已清空');
  });
  ui.clearRecentBtn.addEventListener('click', () => {
    state.recent = [];
    idStore.write(KEYS.recent, state.recent);
    render();
  });
  // 點 backdrop 關閉
  for (const dialog of [ui.listDialog, ui.resultDialog, ui.blockedDialog]) {
    dialog.addEventListener('click', (event) => {
      if (event.target === dialog) dialog.close();
    });
  }
}

// ── Splash ─────────────────────────────────────────────────────────
/** @param {Meal | 'all'} meal */
function showSplash(meal) {
  let seen = false;
  try {
    seen = sessionStorage.getItem(KEYS.splash) === '1';
    sessionStorage.setItem(KEYS.splash, '1');
  } catch {
    // 無 sessionStorage 時每次都顯示也無妨
  }
  if (seen || prefersReducedMotion() || new URLSearchParams(location.search).has('result')) return;

  ui.splashText.textContent = `${mealPeriodText(meal)}吃到飽`;
  ui.splash.hidden = false;
  const dismiss = () => {
    ui.splash.dataset.leaving = 'true';
    window.removeEventListener('keydown', dismiss);
    setTimeout(() => (ui.splash.hidden = true), 450);
  };
  ui.splash.addEventListener('click', dismiss, { once: true });
  window.addEventListener('keydown', dismiss);
  setTimeout(dismiss, 1400);
}

// ── Boot ───────────────────────────────────────────────────────────
async function loadRestaurants() {
  const response = await fetch('data/restaurants.json');
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return /** @type {Promise<Restaurant[]>} */ (response.json());
}

function restorePreferences() {
  const allowed = new Set(state.restaurants.map((r) => r.id));
  state.blocked = idStore.read(KEYS.blocked, allowed);
  state.recent = idStore.read(KEYS.recent, allowed);
  try {
    state.weighting = storage?.getItem(KEYS.weighting) === '1';
  } catch {
    state.weighting = false;
  }
}

function renderDataSummary() {
  const sourced = state.restaurants.filter((r) => r.verification.status === 'sourced').length;
  const latest = state.restaurants.map((r) => r.verification.checkedAt ?? '').sort().at(-1);
  ui.dataSummary.textContent = `共 ${state.restaurants.length} 間・${sourced} 間營業時間已查證・最後查核 ${latest}`;
}

function startClock() {
  // 每 20 秒檢查一次是否跨分鐘；轉動中或開著選單時延後更新，避免畫面跳動
  setInterval(() => {
    const minute = Math.floor(Date.now() / 60_000);
    if (minute === state.lastMinute || state.busy || ui.listDialog.open) return;
    state.lastMinute = minute;
    render();
  }, 20_000);
}

async function main() {
  buildControls();
  wireFilters();
  wireResult();
  wireDialogs();
  ui.spinBtn.addEventListener('click', spin);
  ui.luckyBtn.addEventListener('click', luckySpin);

  const params = new URLSearchParams(location.search);
  const autoMeal = mealForMinute(taipeiClock(new Date()).minute);
  showSplash(autoMeal);
  state.filters = { ...state.filters, ...readFilters(params) };
  if (!params.has('meal')) state.filters.meal = autoMeal;
  if (matchMedia('(min-width: 1024px)').matches) ui.filterPanel.open = true;
  renderControls(new Date());

  try {
    state.restaurants = await loadRestaurants();
  } catch {
    ui.dataSummary.textContent = '餐廳資料載入失敗，請確認網路後重新整理。';
    ui.emptyState.hidden = false;
    ui.emptyText.textContent = '資料載入失敗';
    ui.relaxBtn.hidden = true;
    wheel.setSlices([]);
    return;
  }
  state.byId = new Map(state.restaurants.map((r) => [r.id, r]));
  restorePreferences();
  renderDataSummary();
  render();
  state.lastMinute = Math.floor(Date.now() / 60_000);
  startClock();

  const shared = state.byId.get(Number(params.get('result')));
  if (shared) showResult({ restaurant: shared, status: openingStatus(shared) }, false);

  startAmbient(ui.fxLayer);


  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js').catch(() => {
      // 離線快取失敗不影響主要功能
    });
  }
}

main();
