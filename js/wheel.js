/**
 * Wheel.js — Canvas spinning wheel (ZUTOMAYO Matte Vinyl / Mechanical Style)
 * Usage:
 *   const wheel = new Wheel(canvas, items)
 *   wheel.spin(targetIndex, onDone)   // targetIndex = which item to land on
 */

class Wheel {
  constructor(canvas) {
    this.canvas  = canvas;
    this.ctx     = canvas.getContext('2d');
    this.items   = [];
    this.angle   = 0;          // current rotation (radians)
    this.animId  = null;
    this.spinning = false;

    // Matte ZUTOMAYO palette (charcoal, muted plum, slate, deep violet — zero neon glare)
    this.colors = [
      '#181622', '#261b3a', '#1c1e29', '#31204c',
      '#1d1a26', '#2a243b', '#221933', '#20232e',
      '#191820', '#2e1d46', '#1c1d26', '#272236',
    ];
  }

  /** Set items to draw on wheel */
  setItems(items) {
    this.items = items;
    this.draw();
  }

  /** Draw current state */
  draw() {
    const { ctx, canvas, items, angle, colors } = this;
    const cx = canvas.width  / 2;
    const cy = canvas.height / 2;
    const r  = cx - 4;
    const innerRim = r - 10;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (!items || items.length === 0) {
      ctx.fillStyle = '#191820';
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#9e9aa8';
      ctx.font = 'bold 14px "Noto Sans TC", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('沒有符合條件的店家', cx, cy);
      return;
    }

    const sliceAngle = (Math.PI * 2) / items.length;

    items.forEach((_item, i) => {
      const start = angle + i * sliceAngle - Math.PI / 2;
      const end   = start + sliceAngle;

      // Sector
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, innerRim, start, end);
      ctx.closePath();
      ctx.fillStyle = colors[i % colors.length];
      ctx.fill();
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.45)';
      ctx.lineWidth = 1.2;
      ctx.stroke();
    });

    // Subtle vinyl groove rings
    [0.72, 0.5].forEach(ratio => {
      ctx.beginPath();
      ctx.arc(cx, cy, innerRim * ratio, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(219, 218, 210, 0.06)';
      ctx.lineWidth = 1;
      ctx.stroke();
    });

    // Outer mechanical bezel ring
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.arc(cx, cy, innerRim, 0, Math.PI * 2, true);
    ctx.fillStyle = '#121116';
    ctx.fill();

    ctx.beginPath();
    ctx.arc(cx, cy, innerRim, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(219, 218, 210, 0.35)';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Outer scale ticks
    const tickCount = 36;
    const tickStep  = (Math.PI * 2) / tickCount;
    for (let t = 0; t < tickCount; t++) {
      const a = angle + t * tickStep - Math.PI / 2;
      const isMajor = t % 3 === 0;
      const rIn = innerRim + 2;
      const rOut = isMajor ? r - 2 : r - 4;
      ctx.beginPath();
      ctx.moveTo(cx + Math.cos(a) * rIn,  cy + Math.sin(a) * rIn);
      ctx.lineTo(cx + Math.cos(a) * rOut, cy + Math.sin(a) * rOut);
      ctx.strokeStyle = isMajor ? '#DBDAD2' : '#6F2ADD';
      ctx.lineWidth = isMajor ? 1.5 : 1;
      ctx.stroke();
    }

    // Center accent ring
    ctx.beginPath();
    ctx.arc(cx, cy, 34, 0, Math.PI * 2);
    ctx.fillStyle = '#6F2ADD';
    ctx.fill();
    ctx.strokeStyle = '#DBDAD2';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Center circle
    ctx.beginPath();
    ctx.arc(cx, cy, 27, 0, Math.PI * 2);
    ctx.fillStyle = '#121116';
    ctx.fill();
    ctx.strokeStyle = '#DBDAD2';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Center text: item count
    ctx.fillStyle = '#DBDAD2';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    if (items.length > 0) {
      ctx.font = 'bold 15px "Noto Sans TC", sans-serif';
      ctx.fillText(items.length + '間', cx, cy);
    } else {
      ctx.font = 'bold 22px sans-serif';
      ctx.fillText('?', cx, cy);
    }
  }

  /**
   * Spin to the target item index.
   * @param {number} targetIndex  - which item should land under pointer
   * @param {function} onDone     - callback with the winning item
   */
  spin(targetIndex, onDone) {
    if (this.spinning || !this.items.length) return;
    this.spinning = true;

    const items      = this.items;
    const sliceAngle = (Math.PI * 2) / items.length;

    const targetOffset = -(targetIndex * sliceAngle + sliceAngle / 2);
    const extraSpins   = (5 + Math.floor(Math.random() * 4)) * Math.PI * 2;
    const startAngle   = this.angle;
    const endAngle     = targetOffset + extraSpins;

    const duration = 4000 + Math.random() * 1000;
    let   startTime = null;

    const easeOut = t => 1 - Math.pow(1 - t, 4);

    const step = (ts) => {
      if (!startTime) startTime = ts;
      const elapsed = ts - startTime;
      const progress = Math.min(elapsed / duration, 1);
      this.angle = startAngle + endAngle * easeOut(progress);
      this.draw();

      if (progress < 1) {
        this.animId = requestAnimationFrame(step);
      } else {
        this.angle   = ((startAngle + endAngle) % (Math.PI * 2) + Math.PI * 2) % (Math.PI * 2);
        this.spinning = false;
        if (onDone) onDone(items[targetIndex]);
      }
    };

    this.animId = requestAnimationFrame(step);
  }

  /** Stop any running animation */
  stop() {
    if (this.animId) cancelAnimationFrame(this.animId);
    this.spinning = false;
  }
}

// Seeded random number generator (LCG) — same seed → same sequence
function seededRandom(seed) {
  let s = seed;
  return function () {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    return (s >>> 0) / 0xffffffff;
  };
}
