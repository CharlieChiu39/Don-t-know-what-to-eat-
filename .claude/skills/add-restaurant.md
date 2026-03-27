---
name: add-restaurant
description: Add a new restaurant to the Food Roulette database
---

# Add Restaurant to Food Roulette

When the user asks to add a new restaurant (or multiple restaurants), follow these steps:

## 1. Gather Information
Ask the user for any missing details. Required fields:
- **name** — Restaurant name (Traditional Chinese preferred)
- **cuisine** — Must be one of: 台式, 日式, 韓式, 越式, 泰式, 西式, 亞洲, 速食, 火鍋, 飲料, 甜點, 咖啡, 素食, 清真, 便利商店
- **meals** — Array, subset of: "breakfast", "lunch", "dinner", "latenight"
- **price_range** — One of: "cheap" (< 80元), "medium" (80-150元), "expensive" (> 150元)
- **location** — One of: 校內, 神農路, 裕農路
- **note** — Brief description in Traditional Chinese
- **openHours** — Object with keys mon-sun, values are time strings like "11:00-21:00", "休息", "24小時營業", or null

## 2. Determine the Next ID
Read `data/restaurants.js` and find the highest existing `id` value. The new restaurant's `id` should be `max_id + 1`.

## 3. Add the Entry
Append the new restaurant object to the `window.RESTAURANTS` array in `data/restaurants.js`. Place it in the correct location section (entries are grouped by location with comment headers). Follow the exact formatting pattern of existing entries.

## 4. Handle New Cuisine Types
If the restaurant uses a cuisine type not in the existing list:
1. Add a new emoji mapping in `js/app.js` in the `CUISINE_EMOJI` object
2. Add a new filter chip button in `index.html` inside the `#cuisine-chips` container

## 5. Verify
After adding, confirm:
- The `id` is unique and sequential
- The `cuisine` value matches an existing type (or new UI was added)
- The `meals` array only contains valid meal strings
- The `price_range` is one of the three valid values
- The `location` matches one of the valid areas
- The `openHours` object has all 7 days (mon-sun)
