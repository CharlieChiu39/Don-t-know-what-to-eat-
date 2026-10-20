/**
 * Wheel.js — Canvas spinning wheel (ZUTOMAYO Vinyl / Mechanical Turntable Style)
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

    // Matte ZUTOMAYO / MART palette (charcoal, muted plum, slate, deep violet — zero neon glare)
    this.colors = [
      '#17161e', '#261b3a', '#1e202b', '#32204d',
      '#1b1922', '#292736', '#231934', '#21242e',
      '#191820', '#2f1d47', '#1c1d26', '#282338',
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
    const innerRim = r - 11;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (!items || items.length === 0) {
      ctx.fillStyle = '#14131a';
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#353240';
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.fillStyle = '#9e9aa8';
      ctx.font = '700 13px "Noto Sans TC", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('沒有符合條件的店家', cx, cy);
      return;
    }

    const sliceAngle = (Math.PI * 2) / items.length;

    // 1. Sectors
    items.forEach((item, i) => {
      const start = angle + i * sliceAngle - Math.PI / 2;
      const end   = start + sliceAngle;

      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, innerRim, start, end);
      ctx.closePath();
      ctx.fillStyle = colors[i % colors.length];
      ctx.fill();

      ctx.strokeStyle = 'rgba(219, 218, 210, 0.16)';
      ctx.lineWidth = 1;
      ctx.stroke();

      // Radial label when item count is readable (<= 28)
      if (items.length <= 28 && item && item.name) {
        const mid = start + sliceAngle / 2;
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(mid);
        ctx.textAlign = 'right';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = i % 2 === 0 ? '#DBDAD2' : '#c5b8d9';
        const fontSize = items.length <= 12 ? 11 : items.length <= 20 ? 10 : 9;
        ctx.font = `600 ${fontSize}px "Noto Sans TC", sans-serif`;
        const label = item.name.length > 7 ? item.name.slice(0, 6) + '…' : item.name;
        ctx.fillText(label, innerRim - 10, 0);
        ctx.restore();
      }
    });

    // 2. Subtle vinyl groove rings (tactile mechanical texture)
    [0.76, 0.58, 0.42].forEach(ratio => {
      ctx.beginPath();
      ctx.arc(cx, cy, innerRim * ratio, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(219, 218, 210, 0.06)';
      ctx.lineWidth = 1;
      ctx.stroke();
    });

    // 3. Outer mechanical strobe / gauge bezel
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.arc(cx, cy, innerRim, 0, Math.PI * 2, true);
    ctx.fillStyle = '#121116';
    ctx.fill();

    ctx.beginPath();
    ctx.arc(cx, cy, innerRim, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(219, 218, 210, 0.45)';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Outer tick marks (rotates with wheel)
    const tickCount = Math.min(Math.max(items.length, 24), 72);
    const tickStep  = (Math.PI * 2) / tickCount;
    for (let t = 0; t < tickCount; t++) {
      const a = angle + t * tickStep - Math.PI / 2;
      const isMajor = t % 4 === 0;
      const rIn = innerRim + 2;
      const rOut = isMajor ? r - 2 : r - 4.5;
      ctx.beginPath();
      ctx.moveTo(cx + Math.cos(a) * rIn,  cy + Math.sin(a) * rIn);
      ctx.lineTo(cx + Math.cos(a) * rOut, cy + Math.sin(a) * rOut);
      ctx.strokeStyle = isMajor ? '#DBDAD2' : '#6F2ADD';
      ctx.lineWidth = isMajor ? 1.5 : 1;
      ctx.stroke();
    }

    // 4. Center Turntable Label / ZUTOMAYO Hub
    ctx.beginPath();
    ctx.arc(cx, cy, 38, 0, Math.PI * 2);
    ctx.fillStyle = '#191820';
    ctx.fill();
    ctx.strokeStyle = '#DBDAD2';
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(cx, cy, 32, 0, Math.PI * 2);
    ctx.fillStyle = '#6F2ADD';
    ctx.fill();

    ctx.beginPath();
    ctx.arc(cx, cy, 25, 0, Math.PI * 2);
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
      ctx.font = '900 13px "DotGothic16", "Noto Sans TC", monospace';
      ctx.fillText(items.length + '間', cx, cy - 3);
      ctx.fillStyle = '#9e9aa8';
      ctx.font = '700 8px "DotGothic16", monospace';
      ctx.fillText('POOL', cx, cy + 9);
    } else {
      ctx.font = 'bold 20px monospace';
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

    const duration = 3600 + Math.random() * 800;
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
