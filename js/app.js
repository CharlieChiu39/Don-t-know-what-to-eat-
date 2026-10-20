/* ================================================================
   app.js — Main orchestrator (ZUTOMAYO × ZUTOMAYO MART Matte Edition)
   ================================================================ */

// ── State ────────────────────────────────────────────────────────
const state = {
  meal:       'all',
  price:      'all',
  cuisine:    'all',
  openOnly:   true,
  blockedIds: [],
  lastResult: null,
};

// ── DOM refs ──────────────────────────────────────────────────────
const $ = id => document.getElementById(id);

const loadingScreen  = $('loading-screen');
const loadingText    = $('loading-meal-text');
const appEl          = $('app');
const spinBtn        = $('spin-btn');
const spinBtnText    = $('spin-btn-text');
const noResults      = $('no-results');
const resultModal    = $('result-modal');
const resultName     = $('result-name');
const resultEmoji    = $('result-emoji');
const resultCuisine  = $('result-cuisine');
const resultPrice    = $('result-price');
const resultLocation = $('result-location');
const resultNote     = $('result-note');
const resultHours    = $('result-hours');
const blockBtn       = $('block-btn');
const respinBtn      = $('respin-btn');
const closeResultBtn = $('close-result-btn');
const resultOverlay  = $('result-overlay');
const shareBtn       = $('share-btn');
const clearBlockedBtn= $('clear-blocked-btn');
const blockedCount   = $('blocked-count');
const filterBadge    = $('filter-badge');
const toastEl        = $('toast');
const toastText      = $('toast-text');
const viewItemsBtn   = $('view-items-btn');
const wheelCountEl   = $('wheel-count');
const itemsModal     = $('items-modal');
const itemsOverlay   = $('items-overlay');
const itemsList      = $('items-list');
const closeItemsBtn  = $('close-items-btn');
const luckyBtn       = $('lucky-btn');
const mapBtn         = $('map-btn');
const openOnlyToggle = $('open-only-toggle');

// ── Wheel setup ───────────────────────────────────────────────────
const canvas = $('wheel-canvas');
const wheel  = new Wheel(canvas);

// ── Helpers ───────────────────────────────────────────────────────
function saveBlocked() {
  localStorage.setItem('food_blocked', JSON.stringify(state.blockedIds));
}
function loadBlocked() {
  try { state.blockedIds = JSON.parse(localStorage.getItem('food_blocked') || '[]'); }
  catch { state.blockedIds = []; }
}

// ── Open Hours（判斷邏輯在 js/core.js，含臨時店休與公告）─────────
function isOpenNow(restaurant) {
  // 資料不明（unknown）仍視為開
  return FoodCore.openingStatus(restaurant).state !== 'closed';
}

function getTodayHoursText(restaurant) {
  const status = FoodCore.openingStatus(restaurant);
  if (status.state === 'closed') return status.label === '目前休息' ? status.hours : status.label;
  if (status.state === 'unknown') return status.hours ? `${status.label}：${status.hours}` : null;
  return status.hours || null;
}

// ── Filtering ─────────────────────────────────────────────────────
function getFiltered() {
  const blockedSet = new Set(state.blockedIds);
  return window.RESTAURANTS.filter(r =>
    (state.meal    === 'all' || r.meals.includes(state.meal)) &&
    (state.price   === 'all' || r.price_range === state.price) &&
    (state.cuisine === 'all' || r.cuisine === state.cuisine) &&
    (!state.openOnly || isOpenNow(r)) &&
    !blockedSet.has(r.id)
  );
}

function updateWheel() {
  const filtered = getFiltered();
  wheel.setItems(filtered);
  wheelCountEl.textContent = filtered.length;
  if (filtered.length === 0) {
    noResults.classList.remove('hidden');
    const allBlocked = state.blockedIds.length > 0 &&
      state.meal === 'all' && state.price === 'all' && state.cuisine === 'all';
    noResults.innerHTML = allBlocked
      ? '<p class="f-px text-xs text-[#cb5149] mb-1">[ ALL BLOCKED ]</p><p>所有餐廳都被封鎖了！</p><button onclick="document.getElementById(\'clear-blocked-btn\').click()" class="mt-2 f-px text-xs underline text-[#DBDAD2]">點這裡清除封鎖清單</button>'
      : '<p class="f-px text-xs text-[#cb5149] mb-1">[ ERROR // NO_MATCH ]</p><p>沒有符合條件的店家，試著放寬篩選條件！</p>';
  } else {
    noResults.classList.add('hidden');
  }
  spinBtn.disabled = filtered.length === 0;
  // 只剩 1 間時提示
  viewItemsBtn.style.borderColor = filtered.length === 1 ? '#52b788' : '';
  viewItemsBtn.title = filtered.length === 1 ? '目前只有唯一選擇！' : '';
}

// ── Items modal ───────────────────────────────────────────────────
function showItemsModal() {
  const filtered = getFiltered();
  itemsList.innerHTML = '';
  filtered.forEach((r) => {
    const id = `item-chk-${r.id}`;
    const hoursText = getTodayHoursText(r);
    const openBadge = isOpenNow(r)
      ? '<span class="open-badge">OPEN</span>'
      : '<span class="closed-badge">CLOSED</span>';
    const li = document.createElement('li');
    li.className = 'item-row';
    li.dataset.id = r.id;
    li.innerHTML =
      `<input type="checkbox" id="${id}" class="item-chk" checked />` +
      `<label for="${id}" class="flex items-center gap-3 flex-1 min-w-0 cursor-pointer">` +
        `<span class="text-lg">${CUISINE_EMOJI[r.cuisine] || '🍽️'}</span>` +
        `<div class="flex-1 min-w-0">` +
          `<div class="flex items-center gap-1.5">` +
            `<p class="font-bold text-sm truncate" style="color:#DBDAD2;">${r.name}</p>` +
            openBadge +
          `</div>` +
          `<p class="text-xs" style="color:#8e8999;">${r.cuisine} · ${PRICE_LABEL[r.price_range]}${hoursText ? ' · ' + hoursText : ''}</p>` +
        `</div>` +
      `</label>`;
    itemsList.appendChild(li);
  });
  itemsModal.classList.remove('hidden');
}

function hideItemsModal() {
  const checkedIds = [...itemsList.querySelectorAll('.item-chk:checked')]
    .map(el => Number(el.closest('li').dataset.id));
  const allFiltered = getFiltered();
  const next = allFiltered.filter(r => checkedIds.includes(r.id));
  if (next.length > 0) {
    wheel.setItems(next);
    wheelCountEl.textContent = next.length;
    spinBtn.disabled = false;
  }
  itemsModal.classList.add('hidden');
}

function updateBlockedUI() {
  blockedCount.textContent = state.blockedIds.length;
}

function updateFilterBadge() {
  const active = state.meal !== 'all' || state.price !== 'all' || state.cuisine !== 'all' || !state.openOnly;
  filterBadge.classList.toggle('hidden', !active);
}

// ── Loading screen ────────────────────────────────────────────────
function getMealTimeText() {
  const h = new Date().getHours();
  if (h >= 6  && h < 10.5) return '早餐吃到飽';
  if (h >= 10 && h < 15)   return '午餐吃到飽';
  if (h >= 15 && h < 21)   return '晚餐吃到飽';
  return '宵夜吃到飽';
}

function showApp() {
  loadingScreen.classList.add('fade-out');
  setTimeout(() => {
    loadingScreen.style.display = 'none';
    appEl.classList.remove('hidden');
  }, 350);
}

// ── Toast ─────────────────────────────────────────────────────────
let toastTimer;
function showToast(msg, duration = 2000) {
  toastText.textContent = msg;
  toastEl.classList.remove('hidden');
  toastEl.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toastEl.classList.remove('show');
    setTimeout(() => toastEl.classList.add('hidden'), 250);
  }, duration);
}

// ── Ripple ────────────────────────────────────────────────────────
function addRipple(e) {
  const btn = e.currentTarget;
  const circle = document.createElement('span');
  const d = Math.max(btn.clientWidth, btn.clientHeight);
  const rect = btn.getBoundingClientRect();
  circle.style.cssText = `width:${d}px;height:${d}px;left:${e.clientX-rect.left-d/2}px;top:${e.clientY-rect.top-d/2}px`;
  circle.className = 'ripple-effect';
  btn.querySelector('.ripple-effect')?.remove();
  btn.appendChild(circle);
  setTimeout(() => circle.remove(), 500);
}
function setupRipples() {
  document.querySelectorAll('button').forEach(btn => {
    if (getComputedStyle(btn).position === 'static') btn.style.position = 'relative';
    btn.style.overflow = 'hidden';
    btn.addEventListener('click', addRipple);
  });
}

// ── Confetti (Matte ZUTOMAYO paper scraps, reduced count) ─────────
function launchConfetti() {
  const colors = ['#6F2ADD', '#DBDAD2', '#E8D2E9', '#636683', '#cb5149', '#52b788'];
  for (let i = 0; i < 45; i++) {
    const el = document.createElement('div');
    el.className = 'confetti-piece';
    el.style.left = (Math.random() * 100) + 'vw';
    el.style.background = colors[Math.floor(Math.random() * colors.length)];
    const dur = 1.6 + Math.random() * 1.4;
    el.style.animationDuration = dur + 's';
    el.style.animationDelay = (Math.random() * 0.4) + 's';
    el.style.width = (4 + Math.random() * 6) + 'px';
    el.style.height = (6 + Math.random() * 6) + 'px';
    document.body.appendChild(el);
    setTimeout(() => el.remove(), (dur + 0.8) * 1000);
  }
}

// ── Particle burst ────────────────────────────────────────────────
function spawnResultParticles(emoji) {
  for (let i = 0; i < 10; i++) {
    const el = document.createElement('span');
    el.textContent = i % 2 === 0 ? '◆' : emoji;
    el.style.cssText = `position:fixed;left:50%;top:38%;font-size:${0.85+Math.random()*0.5}rem;pointer-events:none;z-index:300;color:#DBDAD2;`;
    const angle = (i / 10) * 2 * Math.PI;
    const dist = 55 + Math.random() * 55;
    el.style.setProperty('--tx', Math.cos(angle) * dist + 'px');
    el.style.setProperty('--ty', Math.sin(angle) * dist + 'px');
    el.style.animation = `particle-burst ${0.45 + Math.random()*0.25}s ease-out ${i*0.03}s forwards`;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 900);
  }
}

// ── Wheel flash + shake ───────────────────────────────────────────
function flashWheel() {
  const wrapper = document.querySelector('.wheel-wrapper');
  wrapper.classList.remove('wheel-flash');
  void wrapper.offsetWidth;
  wrapper.classList.add('wheel-flash');
  setTimeout(() => wrapper.classList.remove('wheel-flash'), 600);

  wrapper.classList.remove('wheel-shake');
  void wrapper.offsetWidth;
  wrapper.classList.add('wheel-shake');
  setTimeout(() => wrapper.classList.remove('wheel-shake'), 350);
}

// ── Screen flash (no-op glare to prevent light pollution) ─────────
function screenFlash() {
  // Intentionally toned down to avoid screen flash light pollution on mobile
}

// ── Result modal ──────────────────────────────────────────────────
const CUISINE_EMOJI = {
  '台式': '🍜', '日式': '🍣', '韓式': '🍲', '越式': '🍃',
  '泰式': '🌶️', '西式': '🍝', '亞洲': '🥢', '速食': '🍟',
  '火鍋': '🫕', '飲料': '🧋', '甜點': '🍮', '咖啡': '☕',
  '素食': '🥗', '清真': '🌙', '便利商店': '🏪',
};
const PRICE_LABEL = { cheap: '< 80元', medium: '80-150元', expensive: '> 150元', unknown: '價位待確認' };

function showResult(restaurant) {
  state.lastResult = restaurant;
  resultName.textContent     = restaurant.name;
  resultEmoji.textContent    = CUISINE_EMOJI[restaurant.cuisine] || '🍽️';
  resultCuisine.textContent  = restaurant.cuisine;
  resultPrice.textContent    = PRICE_LABEL[restaurant.price_range] || restaurant.price_range;
  resultLocation.textContent = restaurant.location;
  resultNote.textContent     = restaurant.note || '無額外備註';
  const hoursText = getTodayHoursText(restaurant);
  if (hoursText) {
    resultHours.textContent = 'HOURS // 今日：' + hoursText;
    resultHours.classList.remove('hidden');
  } else {
    resultHours.classList.add('hidden');
  }
  mapBtn.href = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(restaurant.name + ' 嘉義')}`;
  shareBtn.classList.remove('hidden');
  resultModal.classList.remove('hidden');
  launchConfetti();
  setTimeout(() => spawnResultParticles(CUISINE_EMOJI[restaurant.cuisine] || '🍽️'), 60);
}

function hideResult() {
  resultModal.classList.add('hidden');
}

// ── Spin logic ────────────────────────────────────────────────────
function doSpin() {
  const items = wheel.items;
  if (!items.length) return;

  const targetIndex = Math.floor(Math.random() * items.length);

  spinBtn.disabled = true;
  spinBtnText.textContent = '轉動中…';

  wheel.spin(targetIndex, (winner) => {
    spinBtn.disabled = false;
    spinBtnText.textContent = '轉！';
    luckyBtn.disabled = false;
    flashWheel();
    screenFlash();
    setTimeout(() => showResult(winner), 160);
    const url = new URL(location.href);
    url.searchParams.set('result', winner.id);
    history.replaceState(null, '', url.toString());
  });
}

// ── Lucky Spin ────────────────────────────────────────────────────
function doLuckySpin() {
  if (wheel.spinning || !wheel.items.length || spinBtn.disabled) return;
  spinBtn.disabled = true;
  luckyBtn.disabled = true;
  let count = 3;
  spinBtnText.textContent = count + '...';
  const iv = setInterval(() => {
    count--;
    if (count > 0) {
      spinBtnText.textContent = count + '...';
    } else {
      clearInterval(iv);
      spinBtnText.textContent = '轉！';
      doSpin();
    }
  }, 1000);
}

// ── Share ─────────────────────────────────────────────────────────
function copyShareLink() {
  const url = new URL(location.href);
  if (state.lastResult) url.searchParams.set('result', state.lastResult.id);
  navigator.clipboard.writeText(url.toString())
    .then(() => showToast('連結已複製！'))
    .catch(() => {
      prompt('複製此連結：', url.toString());
    });
}

// ── Deep-link result ──────────────────────────────────────────────
function checkSharedResult() {
  const params = new URLSearchParams(location.search);
  const rid = parseInt(params.get('result'), 10);
  if (rid) {
    const r = window.RESTAURANTS.find(x => x.id === rid);
    if (r) setTimeout(() => showResult(r), 600);
  }
}

// ── Event wiring ──────────────────────────────────────────────────
// Loading screen
loadingText.textContent = getMealTimeText();
loadingScreen.addEventListener('click', showApp);
setTimeout(showApp, 1800);

// Meal tabs
document.querySelectorAll('.meal-tab').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.meal-tab').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    state.meal = btn.dataset.meal;
    updateWheel();
    updateFilterBadge();
  });
});

// Filter chips
document.querySelectorAll('.filter-chip').forEach(btn => {
  btn.addEventListener('click', () => {
    const type = btn.dataset.type;
    document.querySelectorAll(`.filter-chip[data-type="${type}"]`).forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    state[type] = btn.dataset.value;
    updateWheel();
    updateFilterBadge();
  });
});

// Open-only toggle
openOnlyToggle.checked = state.openOnly;
openOnlyToggle.addEventListener('change', () => {
  state.openOnly = openOnlyToggle.checked;
  updateWheel();
  updateFilterBadge();
});

// Spin button
spinBtn.addEventListener('click', doSpin);

// Result modal actions
closeResultBtn.addEventListener('click', hideResult);
resultOverlay.addEventListener('click', hideResult);

blockBtn.addEventListener('click', () => {
  if (state.lastResult) {
    if (!state.blockedIds.includes(state.lastResult.id)) {
      state.blockedIds.push(state.lastResult.id);
      saveBlocked();
      updateBlockedUI();
      updateWheel();
    }
    hideResult();
    showToast(`已封鎖「${state.lastResult.name}」`);
  }
});

respinBtn.addEventListener('click', () => {
  hideResult();
  setTimeout(doSpin, 100);
});

shareBtn.addEventListener('click', copyShareLink);
luckyBtn.addEventListener('click', doLuckySpin);

// Items modal
viewItemsBtn.addEventListener('click', showItemsModal);
closeItemsBtn.addEventListener('click', hideItemsModal);
itemsOverlay.addEventListener('click', hideItemsModal);

clearBlockedBtn.addEventListener('click', () => {
  state.blockedIds = [];
  saveBlocked();
  updateBlockedUI();
  updateWheel();
  showToast('封鎖清單已清除');
});

// ── Subtle background symbols (Matte ZUTOMAYO glyphs, zero glow) ──
const ZUTO_SYMBOLS = ['+', '◇', '▪', '×', '✧'];
const MATTE_COLORS = ['#6F2ADD', '#636683', '#524e61', '#8a799e'];
const MAX_PARTICLES = 8;
let particleCount = 0;

function spawnPineapple() {
  if (particleCount >= MAX_PARTICLES) return;
  particleCount++;
  const el = document.createElement('span');
  el.textContent = ZUTO_SYMBOLS[Math.floor(Math.random() * ZUTO_SYMBOLS.length)];
  el.className = 'falling-pineapple f-px';
  el.style.left = (Math.random() * 100) + 'vw';
  el.style.fontSize = (0.55 + Math.random() * 0.45) + 'rem';
  el.style.color = MATTE_COLORS[Math.floor(Math.random() * MATTE_COLORS.length)];
  const duration = 7 + Math.random() * 7;
  el.style.animationDuration = duration + 's';
  el.style.animationDelay = (Math.random() * -3) + 's';
  document.body.appendChild(el);
  setTimeout(() => { el.remove(); particleCount--; }, (duration + 2) * 1000);
}

for (let i = 0; i < 4; i++) spawnPineapple();
setInterval(spawnPineapple, 1400);

// ── Init ──────────────────────────────────────────────────────────
loadBlocked();
updateBlockedUI();
updateWheel();
checkSharedResult();
setupRipples();
