# 食間 — 中正大學，今天吃什麼？

把猶豫留給轉盤，把時間留給好好吃飯。原生 HTML、CSS、JavaScript 的靜態選餐工具，保留既有 81 間中正大學周邊餐廳資料。

## 使用

開啟 `index.html`，或在此目錄啟動任意靜態伺服器：

```sh
python -m http.server 4173 --bind 127.0.0.1
```

瀏覽 `http://127.0.0.1:4173/`。沒有 build、npm install、API key 或執行期 CDN 依賴。可沿用 GitHub Pages 的根目錄部署。

## 已完成

- 餐別、預算、區域、料理、關鍵字及營業狀態交集篩選。
- 清單與轉盤使用相同條件；在口袋名單中可只抽收藏的店。
- 公平隨機抽選、正確的連續轉盤落點、轉動期間固定選項。單一選項與減少動態偏好直接揭示結果。
- 收藏、最近五間抽選、暫不考慮與逐間／全部恢復。
- 店家詳情、Google Maps 搜尋、`?result=ID` 分享；剪貼簿不可用時顯示可複製的網址。
- 原生 dialog、Escape 關閉、焦點回復、鍵盤操作、手機排版。
- 本機 Noto Serif TC 子集、原創 SVG 插畫、紙色／柿色的「食間」視覺。

上方篩選、搜尋及清單頁籤都會影響本輪選項。「暫不考慮」僅供管理，不參與抽選。重設不會刪除收藏或排除紀錄。

## 資料與隱私

餐廳來源是本專案既有 `data/restaurants.js`，本次沒有對店家營業或價格做實地／即時查證。營業狀態依 `Asia/Taipei` 時區與時刻表推估：跨夜時段歸屬前一日，時間未知不會混入「只選現在營業」結果。出發前仍需向店家確認。

收藏、排除與最近抽選僅儲存在本機瀏覽器，不跨裝置同步。保留原版 `food_blocked` key；新增 `food_saved`、`food_recent`。儲存被禁止時，本頁仍可操作，會提示無法永久儲存。

`js/room.js` 是原有未整合的多人房間草稿，頁面不載入它。若未來開發多人功能，需另外設計伺服器權杖驗證及房間同步，不可將 Ably 私密金鑰置於公開前端。

## 驗證

需要 Node.js 18 以上執行內建測試，無第三方測試套件：

```sh
node --test tests/core.test.cjs tests/wheel.test.cjs
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

使用者指定的 dessertProject 現行設計是主要參考：暖紙色、柿色、宋體層次、留白與克制動態。另對照 [HIGASHIYA](https://www.higashiya.com/) 的實際首頁與 [Aesop](https://www.aesop.com/) 的官方網站；本專案未複製其圖片、商標或文案。
