// @ts-check
// ZUTOMAYO 霧面風格特效：低存在感、不閃屏。全部尊重 prefers-reduced-motion，分頁隱藏時暫停。

const motionQuery = globalThis.matchMedia?.('(prefers-reduced-motion: reduce)');
export const prefersReducedMotion = () => motionQuery?.matches ?? false;

const SYMBOLS = ['+', '◇', '▪', '×', '✧'];
const MATTE = ['#6f2add', '#636683', '#524e61', '#8a799e'];
const CONFETTI = ['#6f2add', '#dbdad2', '#e8d2e9', '#636683', '#cb5149', '#52b788'];

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
  const MAX = 8;
  /** @type {number | undefined} */
  let timer;
  const tick = () => {
    if (prefersReducedMotion() || layer.childElementCount >= MAX) return;
    spawn(layer, 'fx-fall', sample(SYMBOLS), {
      left: `${Math.random() * 100}vw`,
      'font-size': `${0.7 + Math.random() * 0.7}rem`,
      color: sample(MATTE),
      'animation-duration': `${7 + Math.random() * 6}s`,
    });
  };
  const run = () => {
    clearInterval(timer);
    if (!document.hidden) timer = window.setInterval(tick, 1200);
  };
  document.addEventListener('visibilitychange', run);
  for (let i = 0; i < 4; i++) tick();
  run();
}

/**
 * 抽中時的彩帶與粒子（數量少、霧面色）。
 * @param {HTMLElement} layer
 * @param {string} emoji
 */
export function celebrate(layer, emoji) {
  if (prefersReducedMotion()) return;
  for (let i = 0; i < 45; i++) {
    spawn(layer, 'fx-confetti', '', {
      left: `${Math.random() * 100}vw`,
      background: sample(CONFETTI),
      width: `${4 + Math.random() * 6}px`,
      height: `${6 + Math.random() * 6}px`,
      'animation-duration': `${1.6 + Math.random() * 1.4}s`,
      'animation-delay': `${Math.random() * 0.4}s`,
    });
  }
  for (let i = 0; i < 10; i++) {
    const angle = (i / 10) * Math.PI * 2;
    const dist = 55 + Math.random() * 55;
    spawn(layer, 'fx-burst', i % 2 === 0 ? '◆' : emoji, {
      '--tx': `${Math.cos(angle) * dist}px`,
      '--ty': `${Math.sin(angle) * dist}px`,
      'animation-delay': `${i * 30}ms`,
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
