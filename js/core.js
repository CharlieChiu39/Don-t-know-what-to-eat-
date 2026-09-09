'use strict';

// 純函式共用於瀏覽器與 Node 測試；所有時刻均以台灣時間解讀。
const FoodCore = (() => {
  const dayKeys = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
  const timeFormatter = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Taipei',
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  });
  function taipeiTime(date = new Date()) {
    const parts = Object.fromEntries(
      timeFormatter.formatToParts(date).map((p) => [p.type, p.value]),
    );
    return {
      day: dayKeys.indexOf(parts.weekday.toLowerCase()),
      minute: Number(parts.hour) * 60 + Number(parts.minute),
    };
  }
  function parseHours(value) {
    if (value === '休息') return [];
    if (value === '24小時營業') return [[0, 1440]];
    if (typeof value !== 'string' || !value.trim()) return null;
    const ranges = value.split('、').map((part) => {
      const match = part
        .trim()
        .match(/^(\d{1,2}):(\d{2})\s*-\s*(\d{1,2}):(\d{2})$/);
      if (!match) return null;
      const [, h1, m1, h2, m2] = match.map(Number);
      if (h1 > 23 || h2 > 24 || m1 > 59 || m2 > 59 || (h2 === 24 && m2 !== 0))
        return null;
      const start = h1 * 60 + m1;
      const end = h2 * 60 + m2;
      return start === end ? null : [start, end];
    });
    return ranges.some((range) => range === null) ? null : ranges;
  }
  function openingStatus(restaurant, date = new Date()) {
    const { day, minute } = taipeiTime(date);
    const today = restaurant.openHours?.[dayKeys[day]];
    const previous = restaurant.openHours?.[dayKeys[(day + 6) % 7]];
    const currentRanges = parseHours(today);
    const previousRanges = parseHours(previous);
    const spill = previousRanges?.some(
      ([start, end]) => end < start && minute < end,
    );
    if (spill)
      return {
        state: 'open',
        label: '推估營業中',
        hours: `前一日延續：${previous}`,
      };
    if (
      currentRanges?.some(
        ([start, end]) => minute >= start && (end < start || minute < end),
      )
    ) {
      return { state: 'open', label: '推估營業中', hours: today };
    }
    // 前一天資料未知時，無法排除跨日營業；不把不確定狀態當成已休息。
    if (currentRanges === null || previousRanges === null) {
      return {
        state: 'unknown',
        label: '營業時間待確認',
        hours: today || '尚無營業時間資料',
      };
    }
    return {
      state: 'closed',
      label: today === '休息' ? '今日公休' : '目前休息',
      hours: today,
    };
  }
  function filterRestaurants(restaurants, filters, date = new Date()) {
    const query = (filters.query || '').trim().toLocaleLowerCase();
    const blocked = new Set(filters.blockedIds || []);
    const saved = new Set(filters.savedIds || []);
    return restaurants.filter(
      (r) =>
        ['meal', 'price', 'cuisine', 'location'].every((key) => {
          const value = filters[key];
          if (!value || value === 'all') return true;
          return key === 'meal'
            ? r.meals.includes(value)
            : r[key === 'price' ? 'price_range' : key] === value;
        }) &&
        (filters.view === 'blocked' ? blocked.has(r.id) : !blocked.has(r.id)) &&
        (filters.view !== 'saved' || saved.has(r.id)) &&
        (!filters.openOnly || openingStatus(r, date).state === 'open') &&
        (!query ||
          [r.name, r.cuisine, r.location, r.note]
            .join(' ')
            .toLocaleLowerCase()
            .includes(query)),
    );
  }
  function validIds(value, restaurants) {
    const allowed = new Set(restaurants.map((r) => r.id));
    return Array.isArray(value)
      ? [
          ...new Set(
            value.filter((id) => Number.isInteger(id) && allowed.has(id)),
          ),
        ]
      : [];
  }
  return { taipeiTime, parseHours, openingStatus, filterRestaurants, validIds };
})();
if (typeof module !== 'undefined') module.exports = FoodCore;
