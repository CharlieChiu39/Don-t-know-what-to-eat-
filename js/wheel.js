'use strict';

class Wheel {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.items = [];
    this.angle = 0;
    this.spinning = false;
    this.colors = [
      '#d5bea0',
      '#785a40',
      '#b18b62',
      '#e5d4b9',
      '#95734f',
      '#c6a77e',
    ];
  }
  setItems(items) {
    if (this.spinning) return;
    this.items = [...items];
    this.draw();
  }
  draw() {
    const { ctx, canvas, items } = this;
    const c = canvas.width / 2;
    const radius = c - 3;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const count = items.length || 1;
    const slice = (Math.PI * 2) / count;
    for (let i = 0; i < count; i++) {
      const start = this.angle + i * slice - Math.PI / 2;
      ctx.beginPath();
      ctx.moveTo(c, c);
      ctx.arc(c, c, radius, start, start + slice);
      ctx.closePath();
      ctx.fillStyle = items.length
        ? this.colors[i % this.colors.length]
        : '#544330';
      ctx.fill();
      ctx.strokeStyle = '#302319';
      ctx.lineWidth = 1;
      ctx.stroke();
      if (count > 1 && count <= 16) {
        ctx.save();
        ctx.translate(c, c);
        ctx.rotate(start + slice / 2);
        ctx.textAlign = 'right';
        ctx.textBaseline = 'middle';
        ctx.font = '25px ShiJianSerif, serif';
        ctx.fillStyle = i % 6 === 1 || i % 6 === 4 ? '#fff2dd' : '#322217';
        const label =
          items[i].name.length > 7
            ? `${items[i].name.slice(0, 6)}…`
            : items[i].name;
        ctx.fillText(label, radius - 35, 0, radius - 200);
        ctx.restore();
      }
    }
    ctx.beginPath();
    ctx.arc(c, c, radius - 20, 0, Math.PI * 2);
    ctx.strokeStyle = '#eee0c366';
    ctx.stroke();
  }
  spin(targetIndex, onDone, reducedMotion = false) {
    if (this.spinning || !this.items[targetIndex]) return;
    this.spinning = true;
    const winner = this.items[targetIndex];
    const full = Math.PI * 2;
    const target =
      (full - ((targetIndex + 0.5) * full) / this.items.length) % full;
    const start = this.angle;
    // 每次均以目前角度計算位移，確保連續抽選仍落在正確扇形。
    const distance = ((target - start + full) % full) + full * 4;
    const duration = reducedMotion ? 0 : 2800;
    let started;
    const frame = (timestamp) => {
      if (started === undefined) started = timestamp;
      const progress = duration
        ? Math.min((timestamp - started) / duration, 1)
        : 1;
      this.angle = start + distance * (1 - (1 - progress) ** 4);
      this.draw();
      if (progress < 1) requestAnimationFrame(frame);
      else {
        this.angle = target;
        this.spinning = false;
        onDone(winner);
      }
    };
    requestAnimationFrame(frame);
  }
}
if (typeof module !== 'undefined') module.exports = Wheel;
