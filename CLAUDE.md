# Food Roulette — 中正大學吃什麼？

## Project Overview
靜態網頁應用，幫助中正大學學生用轉盤隨機決定吃什麼。無 build tools、無 Node.js，直接開 `index.html` 即可使用。

## Tech Stack
- Vanilla HTML5 / CSS3 / JavaScript (ES6+)
- Tailwind CSS via CDN
- Canvas API（轉盤動畫）
- Ably Realtime SDK（多人房間功能，尚未整合）

## File Structure
```
├── index.html           # 主 UI — layout, modals, HTML 結構
├── css/style.css        # 自訂樣式、動畫、元件 class
├── js/app.js            # 核心邏輯 — state, 篩選, 事件, UI
├── js/wheel.js          # Wheel class — Canvas 轉盤動畫
├── js/room.js           # RoomManager class — Ably 多人房間（未整合）
├── data/restaurants.js  # window.RESTAURANTS 陣列 — 餐廳資料庫
├── assets/assetsbg.jpg  # Loading 畫面背景圖
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
- **Filtering**: `getFiltered()` 結合餐別/價位/料理/封鎖/營業狀態
- **Wheel**: 純裝飾性動畫轉盤，從所有篩選結果中隨機選取

## Coding Conventions
- UI 文字與註解：繁體中文
- 變數/函式名：英文 camelCase
- CSS class：kebab-case
- 一致使用分號、單引號
- Tailwind 用於 HTML layout；自訂元件樣式在 style.css

## Development
- 啟動：任意靜態伺服器（`npx serve`、Live Server、`python -m http.server`）
- 測試：手動瀏覽器測試，無測試框架
- 新增餐廳：使用 `/add-restaurant` skill 或手動加入 `data/restaurants.js`
- 新增料理類型：同時更新 `CUISINE_EMOJI`（app.js）和 `#cuisine-chips`（index.html）
