# 中正大學吃什麼？— Food Roulette

ZUTOMAYO 暗色賽博龐克風格的轉盤選餐網站，收錄 92 筆中正大學周邊餐廳與餐飲據點。原生 HTML、CSS、JavaScript，無 build。

## 使用

開啟 `index.html`，或在此目錄啟動任意靜態伺服器：

```sh
python -m http.server 5500
```

瀏覽 `http://localhost:5500/`。可沿用 GitHub Pages 的根目錄部署。

## 功能

- 霓虹轉盤隨機選餐，餐別、價位、料理、營業中篩選。
- 不想吃的店可封鎖（存於本機 `food_blocked`），`?result=ID` 分享結果。
- Glitch 標題、霓虹按鈕、粒子與中獎特效。

## 資料

2026-09 已核對校方餐飲目錄及部分店家網站，詳見 [逐店查核紀錄](docs/restaurant-audit.md)。查閱日不等於店家更新日，也不代表實地確認。

營業狀態由 `js/core.js` 依 `Asia/Taipei` 時區判斷。未確認的舊時間移至 `legacyOpenHours`，不參與判斷；`specialHours` 支援日期限定調整，`serviceAlerts` 支援臨時公告。時間不明的店家仍會出現在「營業中」篩選內，出發前請向店家確認。

`js/room.js` 是未整合的多人房間草稿，頁面不載入它。

## 驗證

需要 Node.js 18 以上：

```sh
node --test tests/core.test.cjs
node --check js/app.js
```
