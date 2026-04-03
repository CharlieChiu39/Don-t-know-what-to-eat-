# Food Roulette — 中正大學吃什麼？

## Project Overview
靜態網頁應用，幫助中正大學學生用轉盤隨機決定吃什麼。無 build tools、無 Node.js，直接開 `index.html` 即可使用。

## Tech Stack
- Vanilla HTML5 / CSS3 / JavaScript (ES6+)
- Tailwind CSS via CDN（含自訂色系擴充：neon / cyber / void）
- Canvas API（轉盤動畫）
- Google Fonts: Noto Sans TC + Orbitron
- Ably Realtime SDK（多人房間功能，尚未整合）

## Design Style
**ZUTOMAYO 暗色賽博龐克主題**
- 背景：深黑 `#0a0a0f` + 霓虹藍/紫光暈
- 主色：霓虹藍 `#00bbff`、電紫 `#9b5de5`
- 功能色：霓虹綠 `#00ff88`（營業中）、軟紅 `#ff6b6b`（封鎖/休息）
- 卡片/面板底色：`#12121a`，邊框：`#1e1e2e`
- 標題：CSS Glitch 動畫（`::before/::after` + `clip-path` + `attr(data-text)`）
- 按鈕：Neon Glow（多層 `box-shadow` 模擬霓虹燈管）
- 轉盤：深色底霓虹系扇形（藍/紫交錯），霓虹藍光環外框
- 粒子特效：幾何符號（✦ ◆ ✧ ◇ ★ ⬡ ⬢）+ 隨機霓虹色 + `textShadow` 發光

## File Structure
```
├── index.html           # 主 UI — layout, modals, HTML 結構
├── css/style.css        # 自訂樣式、動畫、元件 class（ZUTOMAYO 暗色主題）
├── js/app.js            # 核心邏輯 — state, 篩選, 事件, UI, 特效
├── js/wheel.js          # Wheel class — Canvas 轉盤動畫
├── js/room.js           # RoomManager class — Ably 多人房間（未整合）
├── data/restaurants.js  # window.RESTAURANTS 陣列 — 餐廳資料庫（81 間）
├── assets/assetsbg.jpg  # Loading 畫面背景圖
├── robots.txt           # SEO
├── sitemap.xml          # SEO
└── CLAUDE.md
```

**Script 載入順序** (in index.html): `restaurants.js` → `wheel.js` → `app.js`

## Restaurant Data Schema
每筆 `window.RESTAURANTS` 資料格式：
```js
{
  id: Number,            // 唯一、從 1 開始
  name: String,          // 店名（繁體中文）
  cuisine: String,       // 台式|日式|韓式|越式|泰式|西式|亞洲|速食|火鍋|飲料|甜點|咖啡|素食|清真|便利商店
  meals: String[],       // ["breakfast","lunch","dinner","latenight"]
  price_range: String,   // "cheap"(<80)|"medium"(80-150)|"expensive"(>150)
  location: String,      // "校內"|"神農路"|"裕農路"
  note: String,          // 簡短描述
  openHours: Object      // { mon:"11:00-21:00", tue:..., ... } 或 null/"休息"/"24小時營業"
}
```

## Architecture
- **State**: `app.js` 中的 `state` 物件（meal, price, cuisine, blockedIds, openOnly, lastResult）
- **Persistence**: localStorage key `food_blocked`
- **DOM**: `const $ = id => document.getElementById(id)` helper
- **Filtering**: `getFiltered()` 結合餐別/價位/料理/封鎖/營業狀態（封鎖清單使用 `Set` 查詢）
- **Wheel**: 純裝飾性動畫轉盤，從所有篩選結果中隨機選取
- **Particles**: 全域計數器控制上限（落下粒子 MAX 15、點擊粒子 MAX 60），防止 DOM 爆炸

## Tailwind 擴充色系
在 `index.html` 的 `<script>` 中定義：
```js
tailwind.config = {
  theme: { extend: { colors: {
    neon:  { DEFAULT: '#00bbff', dim: '#0077aa' },
    cyber: { DEFAULT: '#9b5de5', dark: '#6a35b0' },
    void:  { DEFAULT: '#0a0a0f', card: '#12121a', border: '#1e1e2e' },
  }}}
}
```

## Coding Conventions
- UI 文字與註解：繁體中文
- 變數/函式名：英文 camelCase
- CSS class：kebab-case
- 一致使用分號、單引號
- Tailwind 用於 HTML layout；自訂元件樣式在 style.css
- 暗色主題的文字顏色：優先用 inline `style` 覆蓋 Tailwind 淺色 class

## Development
- 啟動：VS Code Live Server（port 5500）或任意靜態伺服器
- 測試：手動瀏覽器測試，無測試框架
- 新增餐廳：使用 `/add-restaurant` skill 或手動加入 `data/restaurants.js`
- 新增料理類型：同時更新 `CUISINE_EMOJI`（app.js）和 `#cuisine-chips`（index.html）
- 修改配色：主要改 `css/style.css`；轉盤色盤在 `js/wheel.js` 的 `this.colors`；特效顏色在 `js/app.js` 的 `NEON_COLORS` / confetti colors
