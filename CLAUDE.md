# 中正大學吃什麼？— 開發指引

靜態網站：原生 ES Modules 加上原生 CSS，沒有框架，也沒有建置步驟。GitHub Pages 直接發布 `main` 的根目錄。
`devDependencies`（TypeScript、Playwright、axe）只用於檢查與測試，**不可以加入任何執行期依賴或 CDN script**。

## 架構

- `js/core/`：純函式，不碰 DOM，時間一律可注入。商業邏輯只放在這裡。
  - `hours.js` 是營業判斷的唯一來源，判斷順序為 `serviceAlerts` → `openHours`＋`specialHours` → `legacyOpenHours`（推估）
  - `catalog.js` 是標籤、餐別、價位、區域的唯一來源，UI 按鈕與網址驗證都從這裡讀
- `js/ui/`：Canvas 轉盤（`wheel.js`）與特效（`effects.js`）
- `js/app.js`：狀態、事件、渲染。用 `textContent`／`h()` 建立 DOM，**不使用 innerHTML**
- `js/types.d.ts`：共用型別；JS 檔以 `// @ts-check` 搭配 JSDoc 引用
- `sw.js`：離線快取。新增前端檔案時，要同步更新 `SHELL` 清單與 `VERSION`

## 規則

- 時間：一律以台北時間（固定 UTC+8）判斷。資料不明時回傳 unknown，不可以把推估寫成已查證。
- 特效與動畫：必須尊重 `prefers-reduced-motion`；分頁隱藏時要暫停。
- 無障礙：對話框用原生 `<dialog>`；文字對比要達 WCAG AA；狀態不可以只靠顏色表達。
- 樣式：ZUTOMAYO × ZUTOMAYO MART 霧面復古視窗主題。用霧面色、直角（2px）、硬邊位移陰影，對話框做成帶紫色標題列的視窗；**不使用**霓虹光暈、閃屏或點擊粒子。色彩 token 集中在 `css/app.css` 的 `:root`。不使用 CSS nesting（照顧 iOS 16）。
- 字型：內文一律用系統字型。標題（Noto Serif TC）與像素字（DotGothic16，`.f-px`）只載入 `index.html` 字型網址裡 `text=` 列出的字；新增這兩種字型的文字時，要把新字補進 `text=`。
- 磚紅文字用 `--rust-ink`，`--rust` 只用於邊框與色塊（原色在深底上對比不足）。
- 撰寫慣例：UI 文字與註解用繁體中文；JS 用 camelCase、單引號、分號。
- 儲存：localStorage 的 key 有 `food_blocked`、`food_recent`、`food_weighting`。讀取時一律經過 `sanitizeIds` 驗證，寫入失敗也不能讓頁面壞掉。

## 資料

- `data/restaurants.json`：新增餐廳時 ID 取最大值加 1，`tags` 必須是 `catalog.js` 裡定義的標籤。
- 有來源的時段放 `openHours`，並在 `verification` 附上 https 來源與查閱日；沒有來源的放 `legacyOpenHours`。
- 不要用外送平台或聚合地圖的時段當作已查證資料。查核過程記錄在 `docs/restaurant-audit.md`。

## 完成前

```sh
npm run check   # typecheck + 單元測試（含資料檢查）+ Playwright E2E（含 axe、離線）
```

UI 有改動時，執行 `node scripts/screenshots.mjs`（需先 `npm run dev`）重新產生 README 截圖，並親自看過手機與桌面兩種版面。
