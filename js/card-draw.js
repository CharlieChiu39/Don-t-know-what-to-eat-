'use strict';

class CardDraw {
  constructor(stage) {
    this.stage = stage;
    this.items = [];
    this.spinning = false;
    this.draws = 0;
  }
  setItems(items) {
    if (!this.spinning) this.items = [...items];
  }
  card(restaurant, final) {
    const card = document.createElement('div');
    card.className = final ? 'draw-card is-final' : 'draw-card';
    const label = document.createElement('span');
    label.textContent = `${restaurant.location} / ${restaurant.cuisine}`;
    const name = document.createElement('strong');
    name.textContent = restaurant.name;
    const footer = document.createElement('span');
    footer.textContent = final ? '今天，就吃這間。' : '候選';
    card.append(label, name, footer);
    return card;
  }
  async spin(index, onDone, reducedMotion = false) {
    if (this.spinning || !this.items[index]) return;
    this.spinning = true;
    const winner = this.items[index];
    try {
      if (!reducedMotion && this.stage.animate) {
        this.stage.hidden = false;
        const compact =
          typeof matchMedia === 'function' &&
          matchMedia('(max-width: 700px)').matches;
        const duration = this.draws++
          ? compact
            ? 1200
            : 1600
          : compact
            ? 1800
            : 2600;
        const count = this.items.length;
        const kicker = document.createElement('p');
        kicker.className = 'draw-kicker';
        kicker.textContent = `從 ${count} 間裡，選出這一餐`;
        const passers = [1, 2, 3].map((offset) =>
          this.card(this.items[(index + offset) % count], false),
        );
        const chosen = this.card(winner, true);
        this.stage.replaceChildren(kicker, ...passers, chosen);
        const finish = (animation) =>
          animation?.finished ? animation.finished.catch(() => {}) : Promise.resolve();
        await Promise.all([
          finish(
            kicker.animate(
              [
                { opacity: 0 },
                { opacity: 1, offset: 0.12 },
                { opacity: 1, offset: 0.72 },
                { opacity: 0 },
              ],
              { duration, fill: 'both' },
            ),
          ),
          ...passers.map((card, i) =>
            finish(
              card.animate(
                [
                  { transform: 'translate(72%, 10%) rotate(5deg)', opacity: 0 },
                  {
                    transform: 'translate(6%, 0) rotate(-1deg)',
                    opacity: 0.92,
                    offset: 0.42,
                  },
                  {
                    transform: 'translate(-108%, -8%) rotate(-7deg)',
                    opacity: 0,
                  },
                ],
                {
                  duration: duration * 0.52,
                  delay: i * duration * 0.11,
                  easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
                  fill: 'both',
                },
              ),
            ),
          ),
          finish(
            chosen.animate(
              [
                { transform: 'translate(10%, 14%) rotate(3deg)', opacity: 0 },
                {
                  transform: 'translate(0, 0) rotate(0)',
                  opacity: 1,
                  offset: 0.34,
                },
                { transform: 'translate(0, 0)', opacity: 1 },
              ],
              {
                duration,
                delay: duration * 0.26,
                easing: 'cubic-bezier(0.23, 1, 0.32, 1)',
                fill: 'both',
              },
            ),
          ),
        ]);
      }
    } catch {
      // Animation support must never prevent a valid result from being delivered.
    } finally {
      this.stage.hidden = true;
      this.stage.replaceChildren();
      this.spinning = false;
    }
    onDone(winner);
  }
}
if (typeof module !== 'undefined') module.exports = CardDraw;
