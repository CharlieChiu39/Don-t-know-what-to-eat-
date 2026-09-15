# 食間 — 中正大學，今天吃什麼？

首屏直接選餐，電影感菜單卡揭曉。原生 HTML、CSS、JavaScript 的靜態選餐工具，收錄 84 筆中正大學周邊餐廳與餐飲據點。

## 使用

開啟 `index.html`，或在此目錄啟動任意靜態伺服器：

```sh
python -m http.server 4173 --bind 127.0.0.1
```

瀏覽 `http://127.0.0.1:4173/`。沒有 build、npm install、API key 或執行期 CDN 依賴。可沿用 GitHub Pages 的根目錄部署。

## 已完成

- 餐別、預算、區域、料理、關鍵字及營業狀態交集篩選。
- 清單與抽選使用相同條件；在口袋名單中可只抽收藏的店。
- 公平隨機抽選、動畫期間固定選項。首次揭曉約 2.6 秒、再次約 1.6 秒：候選卡過場後中選菜單停住；單一選項、鍵盤操作與減少動態偏好直接揭示結果。
- 收藏、最近五間抽選、暫不考慮與逐間／全部恢復。
- 店家詳情、Google Maps 搜尋、`?result=ID` 分享；剪貼簿不可用時顯示可複製的網址。
- 原生 dialog、Escape 關閉、焦點回復、鍵盤操作、手機排版。
- 本機 Noto Serif TC 子集、清楚的文字層級。不放餐點圖片。

上方篩選、搜尋及清單頁籤都會影響本輪選項。「暫不考慮」僅供管理，不參與抽選。重設不會刪除收藏或排除紀錄。

## 資料與隱私

2026-09-15 已核對校方餐飲目錄及部分店家網站：21 筆附來源，63 筆仍待確認。詳見 [逐店查核紀錄](docs/restaurant-audit.md)。查閱日不等於店家更新日，也不代表實地確認。除 Yes 官網定食外，舊價格分類尚未核對現行菜單。

營業狀態依 `Asia/Taipei` 時區與有來源的時刻表推估。未確認的舊時間移至 `legacyOpenHours`，不參與營業判斷；`specialHours` 支援日期限定調整，`serviceAlerts` 支援臨時公告。已處理路易莎 9/7–13 調整、基地咖啡 9/9 店休、校內 9/20 停水停電。寒暑假與國定假日尚未自動接入校曆，出發前仍需向店家確認。

收藏、排除與最近抽選僅儲存在本機瀏覽器，不跨裝置同步。保留原版 `food_blocked` key；新增 `food_saved`、`food_recent`。儲存被禁止時，本頁仍可操作，會提示無法永久儲存。

`js/room.js` 是原有未整合的多人房間草稿，頁面不載入它。若未來開發多人功能，需另外設計伺服器權杖驗證及房間同步，不可將 Ably 私密金鑰置於公開前端。

## 驗證

需要 Node.js 18 以上執行內建測試，無第三方測試套件：

```sh
node --test tests/core.test.cjs tests/card-draw.test.cjs
node --check js/app.js
```

本次驗收紀錄與審查入口：[docs/review.md](docs/review.md)。

另有可選的 DOM 回歸檢查，需要可解析的 `jsdom` 套件；不影響網站或上述 Node 測試：

```sh
node tests/dom-check.cjs
# 或指定已安裝 jsdom 的絕對路徑
node tests/dom-check.cjs /path/to/node_modules/jsdom
```

此檢查模擬剪貼簿延遲與失敗、儲存失敗及空結果重設。JSDOM 的 dialog 使用替身，不能取代原生瀏覽器焦點驗證。

## 字型與設計

`assets/fonts/shi-jian-serif.ttf` 為 Google Fonts Noto Serif TC 400 的文字子集，使用 SIL Open Font License，授權位於同目錄的 `OFL.txt`。新增字元若不在子集內，會使用系統襯線字型。

使用者指定的 dessertProject 現行設計是主要參考：宋體層次與留白。最新經確認方向為電影感卡片揭曉與首屏選餐，詳見 [設計決策](docs/design-decisions.md)。另對照 [HIGASHIYA](https://www.higashiya.com/) 的實際首頁與 [Aesop](https://www.aesop.com/) 的官方網站；本專案未複製其圖片、商標或文案。
