# 食間 — 開發與審查指引

## 範圍與設計

這是中正大學周邊選餐的靜態網站。維持原生 HTML / CSS / JavaScript，不需要 build 或伺服器憑證。使用者要求參考 dessertProject 的美感；目前視覺採暖紙色、柿色、襯線標題及留白，主要 tokens 在 css/style.css。

UI 與註解使用繁體中文；JS 使用 camelCase、單引號與分號。動畫必須保留 prefers-reduced-motion 分支，表單及結果對話框要能用鍵盤操作。

## 修改前

先讀實際受影響的程式。js/core.js 是時段判斷、篩選及 ID 驗證的唯一來源；js/app.js 負責 DOM 與持久化；js/wheel.js 負責畫面與落點。更動任何篩選時，同時核對清單與轉盤的選項一致。

餐廳時刻均以 Asia/Taipei 判斷，跨夜看前一天；未知時間保持 unknown。不得把既有資料描述成即時查證結果。新增店家要驗證唯一 ID；料理選單從資料自動產生。

food_blocked 是舊版保留的 storage key。新 key 為 food_saved、food_recent，讀取需驗證陣列與 ID；儲存失敗仍保持頁面可用。DOM 中的店名與備註使用 textContent。

js/room.js 為未載入的歷史草稿。修改主站不代表多人房間已實作，公開前端不得放私密 Ably key。

## 完成前

執行 node --test tests/core.test.cjs tests/wheel.test.cjs 及 node --check js/app.js。使用靜態伺服器實際驗證桌面／手機版、篩選、空清單、收藏保存、排除恢復、連續抽選、分享、Escape 與焦點。新文字若使用子集字型，檢查是否意外落到不同 fallback 字型。

本次改版的基準、已驗證項目及限制見 docs/review.md；面向使用者的執行方式見 README.md。所有程式碼由使用者安排 Claude Code 審查；只有實際收到審查結果才可宣稱審查通過。
