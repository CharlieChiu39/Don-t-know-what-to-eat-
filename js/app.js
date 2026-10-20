// @ts-check
// 進入點：載入資料、管理狀態、把 core 的純函式結果畫到畫面上。

import { AREA_FILTERS, MEALS, PRICE_LABEL, PRICES, TAG_BY_ID, TAGS, mealForMinute } from './core/catalog.js';
import { buildCandidates, countActiveFilters, DEFAULT_FILTERS, matchesArea, splitTags } from './core/filters.js';
import { describeStatus, shortNames } from './core/format.js';
import { hasVerifiedHours, openingStatus, taipeiClock } from './core/hours.js';
import { pickIndex, pushRecent, recencyWeight } from './core/picker.js';
import { createDayStore, createIdStore, safeLocalStorage } from './core/storage.js';
import { readFilters, writeFilters } from './core/url-state.js';
import { celebrate, prefersReducedMotion, replayClass, startAmbient } from './ui/effects.js';
import { Wheel } from './ui/wheel.js';

/** @typedef {import('./types.js').Restaurant} Restaurant */
/** @typedef {import('./types.js').FoodTruck} FoodTruck */
/** @typedef {import('./types.js').Candidate} Candidate */
/** @typedef {import('./types.js').Filters} Filters */
/** @typedef {import('./types.js').Meal} Meal */
/** @typedef {import('./types.js').OpenMode} OpenMode */
/** @typedef {import('./types.js').SchoolCalendar} SchoolCalendar */

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
  seasonNote: $('season-note', HTMLElement),
  openMode: $('open-mode', HTMLElement),
  spinRow: /** @type {HTMLElement} */ (document.querySelector('.spin-row')),
  spinDock: $('spin-dock', HTMLButtonElement),
  dockCount: $('dock-count', HTMLElement),
  skippedBtn: $('skipped-btn', HTMLButtonElement),
  skippedCount: $('skipped-count', HTMLElement),
  mealTabs: $('meal-tabs', HTMLElement),
  canvas: $('wheel-canvas', HTMLCanvasElement),
  wheelWrapper: /** @type {HTMLElement} */ (document.querySelector('.wheel-wrapper')),
  legend: $('wheel-legend', HTMLElement),
  listBtn: $('list-btn', HTMLButtonElement),
  count: $('count', HTMLElement),
  excludedNote: $('excluded-note', HTMLElement),
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
  weighting: $('weighting', HTMLInputElement),
  resetBtn: $('reset-btn', HTMLButtonElement),
  blockedBtn: $('blocked-btn', HTMLButtonElement),
  blockedCount: $('blocked-count', HTMLElement),
  recentBox: $('recent-box', HTMLElement),
  recentList: $('recent-list', HTMLElement),
  truckBox: $('truck-box', HTMLDetailsElement),
  truckCount: $('truck-count', HTMLElement),
  truckList: $('truck-list', HTMLElement),
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
  result: {
    emoji: $('result-emoji', HTMLElement),
    eyebrow: $('result-eyebrow', HTMLElement),
    name: $('result-name', HTMLElement),
    cuisine: $('result-cuisine', HTMLElement),
    price: $('result-price', HTMLElement),
    area: $('result-area', HTMLElement),
    tags: $('result-tags', HTMLElement),
    status: $('result-status', HTMLElement),
    statusBadge: $('result-status-badge', HTMLElement),
    statusDetail: $('result-status-detail', HTMLElement),
    note: $('result-note', HTMLElement),
    hoursNote: $('result-hours-note', HTMLElement),
    address: $('result-address', HTMLElement),
    source: $('result-source', HTMLElement),
    callLink: $('call-link', HTMLAnchorElement),
    reportLink: $('report-link', HTMLAnchorElement),
    skipBtn: $('skip-btn', HTMLButtonElement),
    mapLink: $('map-link', HTMLAnchorElement),
    eatBtn: $('eat-btn', HTMLButtonElement),
    blockBtn: $('block-btn', HTMLButtonElement),
    respinBtn: $('respin-btn', HTMLButtonElement),
    shareBtn: $('share-btn', HTMLButtonElement),
  },
};

// ── State ──────────────────────────────────────────────────────────
const KEYS = {
  blocked: 'food_blocked',
  skipped: 'food_skipped',
  recent: 'food_recent',
  weighting: 'food_weighting',
};
const REPO = 'https://github.com/CharlieChiu39/Don-t-know-what-to-eat-';
const storage = safeLocalStorage();
const idStore = createIdStore(storage);
const dayStore = createDayStore(storage);

const state = {
  /** @type {Restaurant[]} */
  restaurants: [],
  /** @type {Map<number, Restaurant>} */
  byId: new Map(),
  /** @type {FoodTruck[]} */
  trucks: [],
  /** @type {Filters} */
  filters: { ...DEFAULT_FILTERS, tags: [] },
  /** @type {number[]} */
  blocked: [],
  /** @type {number[]} 今天跳過，隔天自動恢復 */
  skipped: [],
  /** @type {SchoolCalendar | undefined} */
  calendar: undefined,
  /** @type {Map<number, string>} 轉盤上的短店名 */
  labels: new Map(),
  /** 這次開頁面已經轉過幾次；第二次起用短動畫 */
  spinCount: 0,
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

/** 台北日期 YYYY-MM-DD，「今天跳過」以此換日 */
const today = () => taipeiClock(new Date()).dateKey;
/** 封鎖與今天跳過的店都不放進轉盤 */
const hiddenIds = () => new Set([...state.blocked, ...state.skipped]);

let toastTimer = 0;
/**
 * 提示訊息放在 top layer（popover），開著對話框時也不會被遮罩蓋住。
 * @param {string} message
 * @param {{ label: string, run: () => void }} [action] 例如「復原」
 */
function toast(message, action) {
  ui.toast.replaceChildren(h('span', {}, [message]));
  if (action) {
    const button = h('button', { type: 'button', id: 'toast-undo', class: 'toast-action' }, [action.label]);
    button.addEventListener('click', () => {
      hideToast();
      action.run();
    });
    ui.toast.append(button);
  }
  if (typeof ui.toast.showPopover === 'function') {
    if (ui.toast.matches(':popover-open')) ui.toast.hidePopover();
    ui.toast.showPopover();
  } else {
    ui.toast.hidden = false;
  }
  ui.toast.dataset.show = 'true';
  announce(message);
  clearTimeout(toastTimer);
  toastTimer = window.setTimeout(hideToast, action ? 5000 : 2400);
}

function hideToast() {
  ui.toast.dataset.show = 'false';
  if (typeof ui.toast.hidePopover === 'function' && ui.toast.matches(':popover-open')) ui.toast.hidePopover();
  else ui.toast.hidden = true;
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
  const pool = buildCandidates(state.restaurants, state.filters, { now, blockedIds: hiddenIds(), calendar: state.calendar });
  pool.sort(
    (a, b) => TONE_ORDER[describeStatus(a.status, now).tone] - TONE_ORDER[describeStatus(b.status, now).tone],
  );
  state.pool = pool;
  state.candidates = pool.filter((c) => !state.excluded.has(c.restaurant.id));

  wheel.setSlices(
    state.candidates.map((c) => ({ label: state.labels.get(c.restaurant.id) ?? c.restaurant.name, weight: weightOf(c.restaurant.id) })),
  );
  ui.canvas.setAttribute('aria-label', `餐廳轉盤，共 ${state.candidates.length} 間`);
  ui.count.textContent = String(state.candidates.length);
  ui.dockCount.textContent = String(state.candidates.length);
  ui.excludedNote.textContent = state.excluded.size ? `（排除 ${state.excluded.size}）` : '';
  ui.listBtn.dataset.single = String(state.candidates.length === 1);
  ui.legend.hidden = !(state.weighting && state.candidates.some((c) => state.recent.includes(c.restaurant.id)));

  const empty = state.candidates.length === 0;
  ui.spinBtn.disabled = empty && !state.busy;
  ui.luckyBtn.disabled = empty || state.busy;
  ui.spinDock.disabled = empty || state.busy;
  ui.emptyState.hidden = !empty || state.restaurants.length === 0;
  if (empty) renderEmptyState();

  renderControls(now);
  renderNowLine(now);
  ui.blockedCount.textContent = String(state.blocked.length);
  ui.skippedCount.textContent = String(state.skipped.length);
  ui.skippedBtn.hidden = state.skipped.length === 0;
  renderRecent();
  renderTrucks();

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

  // 標籤旁的數字：其他條件不變下，選這個標籤會有幾間（想吃什麼與飲食需求是「且」）
  const { food, diet } = splitTags(f.tags);
  const context = { now, blockedIds: hiddenIds(), calendar: state.calendar };
  const withoutFood = buildCandidates(state.restaurants, { ...f, tags: diet }, context);
  const withoutDiet = buildCandidates(state.restaurants, { ...f, tags: food }, context);
  for (const btn of [...ui.tagChips.children, ...ui.dietChips.children]) {
    const tag = btn.getAttribute('data-tag');
    const base = ui.dietChips.contains(btn) ? withoutDiet : withoutFood;
    const n = base.filter((c) => c.restaurant.tags.some((t) => t === tag)).length;
    btn.setAttribute('aria-pressed', String(f.tags.some((t) => t === tag)));
    btn.setAttribute('data-empty', String(n === 0));
    const counter = btn.querySelector('.chip-count');
    if (counter) counter.textContent = String(n);
  }

  for (const btn of ui.openMode.querySelectorAll('[data-open]'))
    btn.setAttribute('aria-pressed', String(btn.getAttribute('data-open') === f.openMode));
  ui.weighting.checked = state.weighting;
  const active = countActiveFilters({ ...f, meal: 'all', openMode: DEFAULT_FILTERS.openMode });
  ui.filterCount.hidden = active === 0;
  ui.filterCount.textContent = String(active);
}

/** @param {Date} now */
function renderNowLine(now) {
  const { minute, day } = taipeiClock(now);
  let open = 0;
  let likely = 0;
  for (const { status } of state.candidates) {
    if (status.state === 'open') open++;
    else if (status.state === 'likely') likely++;
  }
  const hhmm = `${String(Math.floor(minute / 60)).padStart(2, '0')}:${String(minute % 60).padStart(2, '0')}`;
  const weekday = '日一二三四五六'[day];
  const others = state.candidates.length - open - likely;
  ui.nowLine.replaceChildren(
    `週${weekday} ${hhmm}・${mealPeriodText(mealForMinute(minute))}時段`,
    h('br'),
    `本輪 ${state.candidates.length} 間：`,
    h('strong', {}, [`${open} 確定營業`]),
    '・',
    h('span', { class: 'likely' }, [`${likely} 可能營業`]),
    others ? `・${others} 休息或待確認` : '',
  );
  renderSeasonNote(now);
}

/**
 * 寒暑假與國定假日的提醒。
 * @param {Date} now
 */
function renderSeasonNote(now) {
  const cal = state.calendar;
  const { dateKey } = taipeiClock(now);
  const vacation = cal?.breaks.find((b) => b.from <= dateKey && dateKey <= b.to);
  const holiday = cal?.holidays.find((d) => d.date === dateKey);
  const md = (/** @type {string} */ key) => key.slice(5).replace('-', '/').replace(/^0/, '').replace('/0', '/');
  ui.seasonNote.hidden = !vacation && !holiday;
  if (vacation) {
    ui.seasonNote.textContent = `❄ ${vacation.name}期間（${md(vacation.from)}–${md(vacation.to)}）：校內店家多數暫停或時段另行公告，已依校方行事曆標示`;
  } else if (holiday) {
    ui.seasonNote.textContent = `📅 今天是${holiday.name}：校內店家可能休息，已標示為「請先確認」`;
  }
}

/** 依目前條件，建議最有效的放寬方式。 */
function relaxPlan() {
  const f = state.filters;
  const pickedArea = f.area !== 'nearby' && f.area !== 'all';
  if (f.tags.length || f.price !== 'all' || pickedArea)
    return {
      label: '清除類型、區域與價位條件',
      apply: () => Object.assign(f, { tags: [], price: 'all', area: pickedArea ? 'all' : f.area }),
    };
  if (f.meal !== 'all') return { label: '改看全部餐別', apply: () => (f.meal = 'all') };
  if (f.area === 'nearby') return { label: '擴大到民雄市區', apply: () => (f.area = 'all') };
  if (f.openMode === 'confirmed') return { label: '也看可能營業的店', apply: () => (f.openMode = 'likely') };
  if (f.openMode === 'likely') return { label: '也顯示休息與待確認的店', apply: () => (f.openMode = 'all') };
  if (state.skipped.length) return { label: '恢復今天跳過的店', apply: () => setSkipped([]) };
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
  ui.recentList.replaceChildren(
    ...items.map((r) =>
      h('li', {}, [h('button', { type: 'button', class: 'recent-chip', 'data-recent': String(r.id) }, [`${emojiOf(r)} ${r.name}`])]),
    ),
  );
}

/** 流動餐車：跟著區域篩選，但不放進轉盤 */
function renderTrucks() {
  const trucks = state.trucks.filter((t) => matchesArea(t.location, state.filters.area));
  ui.truckBox.hidden = trucks.length === 0;
  ui.truckCount.textContent = String(trucks.length);
  ui.truckList.replaceChildren(
    ...trucks.map((t) =>
      h('li', { class: 'truck' }, [
        h('p', { class: 'truck-name' }, [
          h('span', {}, [`${TAG_BY_ID.get(t.tags[0])?.emoji ?? '🚚'} ${t.name}`]),
          h('span', { class: 'truck-area' }, [t.location]),
        ]),
        h('p', { class: 'truck-food' }, [[t.food, t.priceNote].filter(Boolean).join('・')]),
        h('p', { class: 'truck-meta' }, [`📍 ${t.spot}`]),
        h('p', { class: 'truck-meta' }, [`🕗 ${t.schedule}`]),
        t.note ? h('p', { class: 'truck-meta' }, [t.note]) : '',
        t.follow ? h('p', { class: 'truck-meta' }, [`追蹤：${t.follow}`]) : '',
        h('p', { class: 'truck-source' }, [
          '資料：',
          h('a', { href: t.source.url, target: '_blank', rel: 'noopener' }, [t.source.label]),
          `（${t.source.postedAt} 貼文）`,
        ]),
      ]),
    ),
  );
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
    ...AREA_FILTERS.map((a) => h('button', { type: 'button', class: 'chip', 'data-area': a.id }, [a.label])),
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
  delegate(ui.openMode, 'data-open', (mode) => updateFilters((f) => (f.openMode = /** @type {OpenMode} */ (mode))));
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
  ui.spinBtn.disabled = !busy && state.candidates.length === 0;
  ui.luckyBtn.disabled = busy || state.candidates.length === 0;
  ui.spinDock.disabled = ui.luckyBtn.disabled;
  ui.spinBtn.setAttribute('aria-busy', String(busy));
  if (!busy) ui.spinBtn.textContent = '轉！';
}

/** 轉動中再按一次「轉！」或點轉盤，直接看結果 */
function onSpinButton() {
  if (wheel.spinning) wheel.skip();
  else spin();
}

async function spin() {
  if (state.busy || state.candidates.length === 0) return;
  const pool = state.candidates;
  const index = pickIndex(pool.map((c) => weightOf(c.restaurant.id)));
  setBusy(true);
  ui.spinBtn.textContent = '略過動畫 ▸▸';
  for (const leftover of ui.fxLayer.querySelectorAll('.fx-confetti, .fx-burst')) leftover.remove();
  await wheel.spin(index, { reducedMotion: prefersReducedMotion(), quick: state.spinCount > 0 });
  state.spinCount += 1;
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
  const opening = openingStatus(r, now, state.calendar);
  const status = describeStatus(opening, now);
  const res = ui.result;
  state.result = candidate;
  res.eyebrow.textContent = fresh ? '今天就吃' : status.tone === 'closed' ? '這間現在休息' : '店家資訊';
  res.eatBtn.disabled = false;
  res.eatBtn.textContent = '就吃這間 ✓';
  res.shareBtn.textContent = '分享 🔗';
  res.shareBtn.classList.remove('is-emphasized');

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
  res.hoursNote.hidden = !r.hoursNote;
  res.hoursNote.textContent = r.hoursNote ? `🕗 ${r.hoursNote}` : '';
  res.address.hidden = !r.address;
  res.address.textContent = r.address ? `📍 ${r.address}` : '';

  const v = r.verification;
  const sourceLink = () => h('a', { href: v.source ?? '#', target: '_blank', rel: 'noopener' }, [v.label ?? '公開資料']);
  const checked = v.checkedAt ? `（${v.checkedAt} 查閱）` : '';
  if (v.status === 'sourced' && v.source && hasVerifiedHours(r)) {
    res.source.replaceChildren('營業時間來源：', sourceLink(), checked);
  } else if (v.status === 'sourced' && v.source) {
    // 只查證了名稱、地址、電話：不能寫成營業時間來源
    res.source.replaceChildren('店家資訊來源：', sourceLink(), checked, '；營業時間尚未查證');
  } else {
    res.source.textContent = '營業時間尚未查證，僅供參考';
  }

  const uncertain = status.tone === 'likely' || status.tone === 'unknown';
  res.callLink.hidden = !r.phone;
  if (r.phone) {
    res.callLink.href = `tel:${r.phone.replace(/[^\d+]/g, '')}`;
    res.callLink.textContent = `📞 ${r.phone}${uncertain ? '・建議先打電話確認' : ''}`;
  }
  const issue = new URL(`${REPO}/issues/new`);
  issue.searchParams.set('title', `[營業資訊回報] ${r.name}（ID ${r.id}）`);
  issue.searchParams.set(
    'body',
    `店名：${r.name}\nID：${r.id}\n網站目前顯示：${status.badge}（${status.detail}）\n\n正確的營業時間或狀況：\n資料來源（照片、公告或網址）：\n`,
  );
  res.reportLink.href = issue.toString();

  const query = r.address ? `${r.name} ${r.address}` : `${r.name} 嘉義民雄`;
  res.mapLink.href = r.mapUrl ?? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;

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
  // 決定之後結果卡留著：可以接著分享、看地址，不必再轉一次才找得回來
  res.eatBtn.addEventListener('click', () => {
    if (!state.result) return;
    state.recent = pushRecent(state.recent, state.result.restaurant.id);
    const saved = idStore.write(KEYS.recent, state.recent);
    res.eatBtn.disabled = true;
    res.eatBtn.textContent = '✓ 已決定';
    res.shareBtn.classList.add('is-emphasized');
    res.shareBtn.scrollIntoView({ block: 'nearest', behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
    if (!saved) toast('已記下（瀏覽器不允許儲存，重新整理後會消失）');
    render();
  });
  res.skipBtn.addEventListener('click', () => {
    if (!state.result) return;
    const { id, name } = state.result.restaurant;
    setSkipped([...new Set([...state.skipped, id])]);
    closeResult();
    render();
    toast(`今天先跳過「${name}」`, { label: '復原', run: () => (setSkipped(state.skipped.filter((x) => x !== id)), render()) });
  });
  res.blockBtn.addEventListener('click', () => {
    if (!state.result) return;
    const { id, name } = state.result.restaurant;
    if (!state.blocked.includes(id)) state.blocked = [...state.blocked, id];
    idStore.write(KEYS.blocked, state.blocked);
    closeResult();
    render();
    toast(`已永久封鎖「${name}」`, {
      label: '復原',
      run: () => {
        state.blocked = state.blocked.filter((x) => x !== id);
        idStore.write(KEYS.blocked, state.blocked);
        render();
      },
    });
  });
  // 「再轉一次」代表不想要這間：這一輪先排除，避免馬上又抽到
  res.respinBtn.addEventListener('click', () => {
    const id = state.result?.restaurant.id;
    if (id !== undefined && state.candidates.length > 1) {
      state.excluded.add(id);
      render();
    }
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
    await navigator.clipboard.writeText(`${data.text} ${data.url}`);
    // 回饋直接顯示在按鈕上：對話框開著時，視窗外的提示無法互動，也容易被忽略
    const button = ui.result.shareBtn;
    button.textContent = '連結已複製 ✓';
    setTimeout(() => (button.textContent = '分享 🔗'), 2000);
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
      const sub = [r.location, r.cuisine, PRICE_LABEL.get(r.price_range), d.detail].filter(Boolean).join(' · ');
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
  ui.skippedBtn.addEventListener('click', () => {
    const count = state.skipped.length;
    setSkipped([]);
    render();
    toast(`已恢復今天跳過的 ${count} 間`);
  });
  delegate(ui.recentList, 'data-recent', (value) => {
    const r = state.byId.get(Number(value));
    if (r) showResult({ restaurant: r, status: openingStatus(r, new Date(), state.calendar) }, false);
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
function showSplash() {
  if (prefersReducedMotion() || new URLSearchParams(location.search).has('result')) return;

  ui.splash.hidden = false;
  const dismiss = () => {
    if (ui.splash.dataset.leaving === 'true') return;
    ui.splash.dataset.leaving = 'true';
    window.removeEventListener('keydown', dismiss);
    setTimeout(() => (ui.splash.hidden = true), 600);
  };
  ui.splash.addEventListener('click', dismiss, { once: true });
  window.addEventListener('keydown', dismiss);
  // GIF 前 1.54 秒是半身偷看、之後初音衝向鏡頭；等圖載入後再計時，讓 zoom in 與衝向鏡頭同步
  const gif = new Image();
  const startTimer = () => setTimeout(dismiss, 1600);
  gif.addEventListener('load', startTimer, { once: true });
  gif.addEventListener('error', dismiss, { once: true });
  gif.src = 'assets/miku-monitoring.gif';
  setTimeout(dismiss, 5000); // 網路太慢時不讓開場卡住
}

// ── Boot ───────────────────────────────────────────────────────────
async function loadRestaurants() {
  const response = await fetch('data/restaurants.json');
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return /** @type {Promise<Restaurant[]>} */ (response.json());
}

/** 校方行事曆：載入失敗時就不套用寒暑假判斷 */
async function loadCalendar() {
  try {
    const response = await fetch('data/calendar.json');
    return response.ok ? /** @type {SchoolCalendar} */ (await response.json()) : undefined;
  } catch {
    return undefined;
  }
}

/** @param {number[]} ids */
function setSkipped(ids) {
  state.skipped = ids;
  dayStore.write(KEYS.skipped, today(), ids);
}

/** 捲到下面看篩選時，底部浮出「轉！」，按了回到轉盤並轉動 */
function setupSpinDock() {
  const observer = new IntersectionObserver(([entry]) => {
    ui.spinDock.hidden = entry.isIntersecting;
  });
  observer.observe(ui.spinRow);
  ui.spinDock.addEventListener('click', () => {
    ui.wheelWrapper.scrollIntoView({ block: 'center', behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
    spin();
  });
}

/** 餐車資料是附加資訊，載入失敗時就不顯示，不影響轉盤 */
async function loadTrucks() {
  try {
    const response = await fetch('data/trucks.json');
    return response.ok ? /** @type {FoodTruck[]} */ (await response.json()) : [];
  } catch {
    return [];
  }
}

function restorePreferences() {
  const allowed = new Set(state.restaurants.map((r) => r.id));
  state.blocked = idStore.read(KEYS.blocked, allowed);
  state.recent = idStore.read(KEYS.recent, allowed);
  state.skipped = dayStore.read(KEYS.skipped, today(), allowed);
  try {
    state.weighting = storage?.getItem(KEYS.weighting) === '1';
  } catch {
    state.weighting = false;
  }
}

function renderDataSummary() {
  const sourced = state.restaurants.filter(hasVerifiedHours).length;
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
  ui.spinBtn.addEventListener('click', onSpinButton);
  ui.canvas.addEventListener('click', () => wheel.skip());
  ui.luckyBtn.addEventListener('click', luckySpin);

  const params = new URLSearchParams(location.search);
  const autoMeal = mealForMinute(taipeiClock(new Date()).minute);
  showSplash();
  state.filters = { ...state.filters, ...readFilters(params) };
  if (!params.has('meal')) state.filters.meal = autoMeal;
  if (matchMedia('(min-width: 1024px)').matches) ui.filterPanel.open = true;
  renderControls(new Date());

  const trucks = loadTrucks();
  const calendar = loadCalendar();
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
  state.trucks = await trucks;
  state.calendar = await calendar;
  state.labels = shortNames(state.restaurants);
  restorePreferences();
  renderDataSummary();
  render();
  state.lastMinute = Math.floor(Date.now() / 60_000);
  startClock();

  const shared = state.byId.get(Number(params.get('result')));
  if (shared) showResult({ restaurant: shared, status: openingStatus(shared, new Date(), state.calendar) }, false);

  setupSpinDock();
  startAmbient(ui.fxLayer);

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js').catch(() => {
      // 離線快取失敗不影響主要功能
    });
  }
}

main();
