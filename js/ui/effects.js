// @ts-check
// ZUTOMAYO 風格特效。全部尊重 prefers-reduced-motion，分頁隱藏時暫停。

const motionQuery = globalThis.matchMedia?.('(prefers-reduced-motion: reduce)');
export const prefersReducedMotion = () => motionQuery?.matches ?? false;

const SYMBOLS = ['✦', '◆', '✧', '◇', '★', '⬡', '⬢'];
const NEON = ['#00bbff', '#9b5de5', '#00ff88', '#bf8fff'];
const FOOD = ['🍜', '🍕', '🍱', '🍣', '🍔', '🌮', '🍛', '🍝', '🍦', '🍰', '🥗', '🍲', '🍗', '🍤', '🧋', '🍙'];
const CONFETTI = ['#00bbff', '#9b5de5', '#00ff88', '#ff6b6b', '#bf8fff', '#00e5ff', '#7c3aed', '#34d399'];

/** @template T @param {readonly T[]} list */
const sample = (list) => list[Math.floor(Math.random() * list.length)];

/**
 * 建立短暫存在的元素，動畫結束後自動移除。
 * @param {HTMLElement} layer
 * @param {string} className
 * @param {string} text
 * @param {Record<string, string>} style
 */
function spawn(layer, className, text, style) {
  const el = document.createElement('span');
  el.className = className;
  el.textContent = text;
  for (const [key, value] of Object.entries(style)) el.style.setProperty(key, value);
  el.addEventListener('animationend', () => el.remove(), { once: true });
  layer.append(el);
  return el;
}

/** @param {HTMLElement} layer */
export function startAmbient(layer) {
  const MAX = 14;
  /** @type {number | undefined} */
  let timer;
  const tick = () => {
    if (prefersReducedMotion() || layer.childElementCount >= MAX) return;
    const color = sample(NEON);
    spawn(layer, 'fx-fall', sample(SYMBOLS), {
      left: `${Math.random() * 100}vw`,
      'font-size': `${0.6 + Math.random() * 0.8}rem`,
      color,
      'text-shadow': `0 0 6px ${color}`,
      'animation-duration': `${5 + Math.random() * 6}s`,
    });
  };
  const run = () => {
    clearInterval(timer);
    if (!document.hidden) timer = window.setInterval(tick, 800);
  };
  document.addEventListener('visibilitychange', run);
  for (let i = 0; i < 6; i++) tick();
  run();
}

/**
 * @param {HTMLElement} layer
 * @param {number} x
 * @param {number} y
 */
export function foodPop(layer, x, y) {
  if (prefersReducedMotion() || layer.childElementCount > 60) return;
  for (let i = 0; i < 2; i++) {
    spawn(layer, 'fx-pop', sample(FOOD), {
      left: `${x + (Math.random() - 0.5) * 40}px`,
      top: `${y}px`,
      '--fy': `-${60 + Math.random() * 30}px`,
      'animation-delay': `${i * 60}ms`,
    });
  }
}

/**
 * 抽中時的彩帶、粒子與閃光。
 * @param {HTMLElement} layer
 * @param {string} emoji
 */
export function celebrate(layer, emoji) {
  if (prefersReducedMotion()) return;
  for (let i = 0; i < 90; i++) {
    spawn(layer, 'fx-confetti', '', {
      left: `${Math.random() * 100}vw`,
      background: sample(CONFETTI),
      width: `${5 + Math.random() * 7}px`,
      height: `${8 + Math.random() * 8}px`,
      'animation-duration': `${1.8 + Math.random() * 1.8}s`,
      'animation-delay': `${Math.random() * 0.6}s`,
    });
  }
  for (let i = 0; i < 18; i++) {
    const angle = (i / 18) * Math.PI * 2;
    const dist = 70 + Math.random() * 80;
    const star = i % 3 === 0;
    spawn(layer, 'fx-burst', star ? '★' : emoji, {
      '--tx': `${Math.cos(angle) * dist}px`,
      '--ty': `${Math.sin(angle) * dist}px`,
      color: star ? '#00bbff' : 'inherit',
      'animation-delay': `${i * 40}ms`,
    });
  }
}

/**
 * 重新觸發 CSS 動畫 class。
 * @param {Element} el
 * @param {string} className
 */
export function replayClass(el, className) {
  if (prefersReducedMotion()) return;
  el.classList.remove(className);
  void (/** @type {HTMLElement} */ (el).offsetWidth);
  el.classList.add(className);
  el.addEventListener('animationend', () => el.classList.remove(className), { once: true });
}
