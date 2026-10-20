// @ts-check
// Canvas 轉盤：扇形大小依權重分配，指針固定在正上方。

/** @typedef {{ label: string, weight: number }} WheelSlice */

const TAU = Math.PI * 2;
const COLORS = ['#003d5c', '#1a0533', '#00334d', '#2d0050', '#001f3d', '#1f0041', '#002233', '#350060', '#00293d', '#280048'];
/** 超過這個數量就不畫店名，避免糊成一團 */
const MAX_LABELED = 24;
const FONT = 'system-ui, -apple-system, "PingFang TC", "Noto Sans CJK TC", "Microsoft JhengHei", sans-serif';

export class Wheel {
  /** @param {HTMLCanvasElement} canvas */
  constructor(canvas) {
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('此瀏覽器不支援 Canvas 2D');
    this.canvas = canvas;
    this.ctx = ctx;
    /** @type {WheelSlice[]} */
    this.slices = [];
    /** 目前旋轉角度（弧度，順時針為正） */
    this.rotation = 0;
    this.spinning = false;
    /** @type {number | null} 停下後高亮的扇形 */
    this.highlight = null;
    this.size = 320;
    // 用 ResizeObserver 取得 CSS 尺寸：初始化時不強制同步排版，RWD 改變時也會自動重畫
    new ResizeObserver(([entry]) => this.resize(entry.contentRect.width)).observe(canvas);
  }

  /**
   * 依 CSS 尺寸與裝置像素比重設畫布，Retina 螢幕才不會糊。
   * @param {number} width
   */
  resize(width) {
    if (!width) return;
    this.size = width;
    const dpr = Math.min(globalThis.devicePixelRatio || 1, 3);
    this.canvas.width = Math.round(this.size * dpr);
    this.canvas.height = Math.round(this.size * dpr);
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    this.draw();
  }

  /** @param {WheelSlice[]} slices */
  setSlices(slices) {
    this.slices = slices;
    this.highlight = null;
    this.draw();
  }

  /** 每個扇形從指針（0）順時針量起的起訖角度。 */
  layout() {
    const total = this.slices.reduce((sum, s) => sum + s.weight, 0) || 1;
    let acc = 0;
    return this.slices.map((s) => {
      const start = (acc / total) * TAU;
      acc += s.weight;
      return { start, end: (acc / total) * TAU };
    });
  }

  draw() {
    const { ctx, size, slices } = this;
    const c = size / 2;
    const r = c - 2;
    ctx.clearRect(0, 0, size, size);

    if (!slices.length) {
      ctx.fillStyle = '#12121a';
      ctx.beginPath();
      ctx.arc(c, c, r, 0, TAU);
      ctx.fill();
      ctx.fillStyle = 'rgba(0,187,255,0.55)';
      ctx.font = `700 14px ${FONT}`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('沒有符合條件的店家', c, c + 48);
      this.drawHub(c, '0 間');
      return;
    }

    const layout = this.layout();
    const labeled = slices.length <= MAX_LABELED;
    layout.forEach(({ start, end }, i) => {
      // 畫布的 0 弧度在右方，減去 π/2 讓 0 對準上方指針
      const a0 = this.rotation + start - Math.PI / 2;
      const a1 = this.rotation + end - Math.PI / 2;
      ctx.beginPath();
      ctx.moveTo(c, c);
      ctx.arc(c, c, r, a0, a1);
      ctx.closePath();
      ctx.fillStyle = COLORS[i % COLORS.length];
      ctx.fill();
      if (i === this.highlight) {
        ctx.fillStyle = 'rgba(0,187,255,0.35)';
        ctx.fill();
      }
      ctx.strokeStyle = 'rgba(0,0,0,0.45)';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // 扇形太窄就不放字
      if (labeled && (a1 - a0) * r * 0.72 >= 12) this.drawLabel(c, r, (a0 + a1) / 2, slices[i].label, i === this.highlight);
    });

    this.drawHub(c, `${slices.length} 間`);
  }

  /**
   * @param {number} c
   * @param {number} r
   * @param {number} angle
   * @param {string} text
   * @param {boolean} active
   */
  drawLabel(c, r, angle, text, active) {
    const { ctx } = this;
    // 左半邊的字轉 180° 再畫，才不會上下顛倒
    const flipped = Math.cos(angle) < 0;
    ctx.save();
    ctx.translate(c, c);
    ctx.rotate(flipped ? angle + Math.PI : angle);
    ctx.font = `600 12px ${FONT}`;
    ctx.textAlign = flipped ? 'left' : 'right';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = active ? '#ffffff' : 'rgba(214,236,255,0.88)';
    ctx.shadowColor = 'rgba(0,187,255,0.6)';
    ctx.shadowBlur = active ? 8 : 4;
    ctx.fillText(truncate(ctx, text, r * 0.6), flipped ? -(r - 12) : r - 12, 0);
    ctx.restore();
  }

  /**
   * @param {number} c
   * @param {string} text
   */
  drawHub(c, text) {
    const { ctx } = this;
    ctx.beginPath();
    ctx.arc(c, c, 34, 0, TAU);
    ctx.fillStyle = 'rgba(0,187,255,0.15)';
    ctx.fill();
    ctx.beginPath();
    ctx.arc(c, c, 28, 0, TAU);
    ctx.fillStyle = '#0a0a0f';
    ctx.fill();
    ctx.strokeStyle = '#00bbff';
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.fillStyle = '#00bbff';
    ctx.font = `700 15px ${FONT}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, c, c);
  }

  /**
   * 轉到指定扇形。停點在扇形中段隨機位置，看起來不會每次都停在正中央。
   * @param {number} index
   * @param {{ reducedMotion?: boolean, random?: () => number }} [options]
   * @returns {Promise<void>}
   */
  spin(index, { reducedMotion = false, random = Math.random } = {}) {
    if (this.spinning || !this.slices[index]) return Promise.resolve();
    this.spinning = true;
    this.highlight = null;

    const { start, end } = this.layout()[index];
    const landing = start + (end - start) * (0.15 + 0.7 * random());
    // 讓 landing 對準指針：rotation ≡ -landing (mod 2π)
    const delta = (((-landing - this.rotation) % TAU) + TAU) % TAU;
    const turns = reducedMotion ? 0 : 5 + Math.floor(random() * 3);
    const from = this.rotation;
    const distance = delta + turns * TAU;
    const duration = reducedMotion ? 450 : 4200 + random() * 800;
    const ease = (/** @type {number} */ t) => 1 - Math.pow(1 - t, 4);

    return new Promise((resolve) => {
      /** @type {number | undefined} */
      let t0;
      /** @param {number} now */
      const frame = (now) => {
        t0 ??= now;
        const progress = Math.min((now - t0) / duration, 1);
        this.rotation = from + distance * ease(progress);
        this.draw();
        if (progress < 1) {
          requestAnimationFrame(frame);
          return;
        }
        this.rotation %= TAU;
        this.spinning = false;
        this.highlight = index;
        this.draw();
        resolve();
      };
      requestAnimationFrame(frame);
    });
  }
}

/**
 * @param {CanvasRenderingContext2D} ctx
 * @param {string} text
 * @param {number} maxWidth
 */
function truncate(ctx, text, maxWidth) {
  if (ctx.measureText(text).width <= maxWidth) return text;
  let chars = [...text];
  while (chars.length > 1 && ctx.measureText(chars.join('') + '…').width > maxWidth) chars = chars.slice(0, -1);
  return chars.join('') + '…';
}
