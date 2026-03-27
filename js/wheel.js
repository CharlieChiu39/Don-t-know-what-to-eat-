/**
 * Wheel.js — Canvas spinning wheel
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

    // Colour palette (vivid, food-friendly)
    this.colors = [
      '#FF6B6B','#FFD93D','#6BCB77','#4D96FF','#FF922B',
      '#CC5DE8','#20C997','#F06595','#74C0FC','#FFA94D',
      '#A9E34B','#63E6BE','#FF8787','#748FFC','#FFEC99',
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

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (!items || items.length === 0) {
      ctx.fillStyle = '#e5e7eb';
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#9ca3af';
      ctx.font = 'bold 14px sans-serif';
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
      ctx.arc(cx, cy, r, start, end);
      ctx.closePath();
      ctx.fillStyle = colors[i % colors.length];
      ctx.fill();
      ctx.strokeStyle = 'white';
      ctx.lineWidth = 2;
      ctx.stroke();

    });

    // Center glow ring
    ctx.beginPath();
    ctx.arc(cx, cy, 32, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255,255,255,0.6)';
    ctx.fill();

    // Center white circle
    ctx.beginPath();
    ctx.arc(cx, cy, 26, 0, Math.PI * 2);
    ctx.fillStyle = 'white';
    ctx.fill();
    ctx.strokeStyle = '#f97316';
    ctx.lineWidth = 3;
    ctx.stroke();

    // Center text: item count or spin icon
    ctx.fillStyle = '#f97316';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    if (items.length > 0) {
      ctx.font = 'bold 16px sans-serif';
      ctx.fillText(items.length + '間', cx, cy);
    } else {
      ctx.font = 'bold 24px sans-serif';
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

    // We want the TARGET slice centre to end up at the top (angle = 0 → top of canvas).
    // Current rotation is `this.angle`. We need to find how much more to rotate.
    // Pointer sits at top = -Math.PI/2 in canvas coords; but our draw() already offsets by -Math.PI/2.
    // So target angle offset = -(targetIndex * sliceAngle + sliceAngle/2)
    const targetOffset = -(targetIndex * sliceAngle + sliceAngle / 2);
    // Full rotations (5–8) plus the offset
    const extraSpins   = (5 + Math.floor(Math.random() * 4)) * Math.PI * 2;
    const startAngle   = this.angle;
    const endAngle     = targetOffset + extraSpins;  // always positive spin

    const duration = 4000 + Math.random() * 1000;   // 4-5 seconds
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
