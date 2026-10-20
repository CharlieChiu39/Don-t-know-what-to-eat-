---
name: add-restaurant
description: Add a new restaurant to the Food Roulette database (data/restaurants.json)
---

# 新增餐廳

## 1. 收集資訊

缺少的欄位要問使用者。型別定義在 `js/types.d.ts`。

- **name**：店名（繁體中文）
- **cuisine**：口味，例如 台式、日式、韓式、越式、泰式、西式、亞洲、速食、火鍋、飲料、甜點、咖啡、素食、清真、便利商店
- **tags**：想吃什麼標籤，必須是 `js/core/catalog.js` 的 `TAGS` 之一，第一個標籤決定顯示的 emoji
- **meals**：`breakfast` | `lunch` | `dinner` | `latenight` 的子集合
- **price_range**：`cheap`（< 80）| `medium`（80–150）| `expensive`（> 150）| `unknown`
- **location**：`校內` | `神農路` | `裕農路`
- **note**：簡短描述；有的話也填 **address**、**phone**
- **營業時間**：每週七天 `mon`–`sun` 都要有值，值可以是 `"11:00-14:00、17:00-20:00"`、`"休息"`、`"24小時營業"` 或 `null`（未知）
  - 有公開來源（校方頁面、店家官網或粉專）→ 填 `openHours`，並寫入 `verification: { status: "sourced", source: "https://…", label, checkedAt: "YYYY-MM-DD" }`
  - 沒有來源 → `openHours` 七天都填 `null`，時間放進 `legacyOpenHours`，並設 `verification: { status: "unconfirmed" }`
  - 外送平台與聚合地圖的時段**不算**來源

## 2. ID

取 `data/restaurants.json` 中最大的 `id` 加 1，舊 ID 不要重複使用（使用者的收藏和分享連結都依賴 ID）。

## 3. 新增後驗證

```sh
npm test
```

資料檢查會擋下這些問題：ID 重複、列舉值不合法、時段無法解析、已查證卻沒有 https 來源、標籤不存在。

如果新增了標籤種類，要同時更新 `catalog.js` 的 `TAGS` 與 `js/types.d.ts` 的 `TagId`。
