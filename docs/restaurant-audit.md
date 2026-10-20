# 餐廳資料查核 — 2026-10-21

共 204 間：中正周邊 92 間、民雄市區 112 間。其中 194 間的營業時間有來源（校方或店家公開頁面 23 間，Google 地圖商家資訊 171 間），10 間仍待確認。另外列出 4 台流動餐車，不放進轉盤。

上一輪（2026-09-10）的逐店紀錄移到 [archive/restaurant-audit-2026-09-10.md](archive/restaurant-audit-2026-09-10.md)。

## 來源優先順序

1. **校方飲食資訊**（校內店家）
2. **店家官網、品牌門市頁、店家粉專或 IG**
3. **Google 地圖商家資訊**：前兩者沒有每週時段時才採用，結果卡上標明「Google 地圖商家資訊」並附商家頁連結
4. **不採用**：外送平台時段（只代表外送服務時間）、沒有更新日期的聚合頁

已經有校方或店家完整時刻表的店，這次沒有用 Google 覆蓋。品牌頁只確認店名地址、沒有每週時段的店（TEA'S、茶湯會、早叄、早安山丘），時段改用 Google，原本的品牌來源寫在 `verification.note`。

## 範圍

- **中正周邊**：校內、神農路、裕農路、大學路，就是原本的 92 間，這次重新查核時段與地址。轉盤預設只抽這一區。
- **民雄市區**：以麥當勞嘉義民雄餐廳（建國路一段 18 號）為中心，方圓約 1 公里內、Google 評論至少 200 則的店。使用者選「民雄市區」或「不限」才會出現，中正周邊沒有店營業時，「一鍵放寬」也會提議擴大到市區。

## 方法

- 每間店打開 Google 地圖商家頁，讀取每週營業時間、地址、電話與是否「暫時關閉」，商家頁連結存成 `mapUrl`（`https://maps.google.com/?cid=…`）。
- 時段轉成 `HH:MM-HH:MM`。凌晨打烊寫成跨夜時段（例如 `17:00-02:00`）；Google 把「17:00 開到隔天 11:00」拆成「00:00–11:00、17:00–24:00」兩段時，匯入時合併成 `17:00-11:00`，避免午夜被誤判為「即將打烊」。
- `meals`（供餐時段）依時刻表重新推算：營業時間與早餐 06–10、午餐 11–14、晚餐 17–20、宵夜 21:30–02 任一時窗重疊至少 60 分鐘，就算有供應該餐。
- 有完整時刻表的店移除 `legacyOpenHours`（舊的未查證時刻表），避免兩份資料不一致。
- 民雄市區店家的價位：Google 有標示人均價格的才填（`expensive` 並附 `priceNote`），其餘標為「價位待確認」，不自行估計。

## 例外與未解決

- **比對錯誤，不採用**：佳豐生活美食坊（校內）在 Google 對到建國路的「嘉豐鐵板燒」，松屋食坊對到已暫時關閉的「阿松の店」。兩間仍以校方資料為準；嘉豐鐵板燒另外以民雄市區店家收錄。
- **Google 沒有列出時段**：月亮與貓（看 IG cindy._.handmade）、仙草奶酪（看 IG ccu_grass_jelly）、小栗鼠cafe、八方雲集中大店、韓金湯匙（店名標示 24 Hrs 無人店，但沒有每週時刻表，只推估「可能營業」），以及市區的嘉鄉羊鵝肉、松林庭園咖啡簡餐、鶴茶樓、澎湃先生古早味蛋糕、可以可以地瓜球。這些店不會出現在「只顯示營業中」的轉盤上。
- **暫時關閉，不收錄**：紅樓麻辣燙、金大尉 2.0 韓式鐵板燒烤肉吃到飽（市區候選）。
- **來源衝突**：早安山丘中正大學店的品牌頁列 07:00–15:00，Google 列每天 07:00–14:30，採用較早的結束時間。
- **區域更正**：伊卓島（裕農一街）改為裕農路；三街亭便當、123活力早餐屋、誠石火鍋、大學路生煎包改為大學路。
- Google 時段由店家或使用者維護，可能比現況舊；臨時店休、寒暑假與國定假日仍以店家公告為準。

## 流動餐車

餐車沒有固定時刻表，所以不參與營業判斷、也不放進轉盤，只在側欄「流動餐車」列出常出現的位置、出攤規律與追蹤方式。資料來自 Dcard 中正大學板的討論，每台都附原文連結與貼文日期。

- **烤雞肉飯餐車**（神農路）：中吃與大吃之間那條橫向小路；不固定，大約晚上 8、9 點出攤。來源：[Dcard 中正大學板](https://www.dcard.tw/f/ccu/p/261074960)，2026-03-13
- **食良 臭豆腐麵線餐車**（神農路）：大吃楊家豆漿那一側的停車場；晚上出攤，通常週二、週六（有時週六改週五）。來源：[Dcard 中正大學板](https://www.dcard.tw/f/ccu/p/260446325)，2025-12-11
- **關東煮餐車**（神農路）：學校大門附近的廣場、大吃全家旁；不固定。來源：[Dcard 中正大學板](https://www.dcard.tw/f/ccu/p/258577478)，2025-04-17
- **現烤麵包餐車**（民雄市區）：阿吉麵攤旁（民雄市區）；不固定。來源：[Dcard 中正大學板](https://www.dcard.tw/f/ccu/p/258565460)，2025-04-16

學生會不定期在校內舉辦「餐車日」，攤商名單公布在學生會 IG（[Dcard 討論](https://www.dcard.tw/f/ccu/p/260387131)）。活動性質不固定，沒有收錄成個別餐車。

## 逐店結果

### 中正周邊

| ID | 店名 | 區域 | 本次結果 | 來源 |
| --- | --- | --- | --- | --- |
| 1 | 全家便利商店(活動中心店) | 校內 | 沿用校方／店家公開時段 | [中正大學飲食資訊](https://www.ccu.edu.tw/p/406-1000-25657,r3205.php?Lang=zh-tw) |
| 2 | 微風蔬果 | 校內 | 沿用校方／店家公開時段 | [中正大學飲食資訊](https://www.ccu.edu.tw/p/406-1000-25657,r3205.php?Lang=zh-tw) |
| 3 | 佳豐生活美食坊 | 校內 | 沿用校方／店家公開時段 | [中正大學飲食資訊](https://www.ccu.edu.tw/p/406-1000-25657,r3205.php?Lang=zh-tw) |
| 4 | 婆媳麵食部 | 校內 | 沿用校方／店家公開時段 | [中正大學飲食資訊](https://www.ccu.edu.tw/p/406-1000-25657,r3205.php?Lang=zh-tw) |
| 5 | 珍品餐館 | 校內 | 沿用校方／店家公開時段 | [中正大學飲食資訊](https://www.ccu.edu.tw/p/406-1000-25657,r3205.php?Lang=zh-tw) |
| 6 | 路易莎咖啡(嘉義中正大學門市) | 校內 | 沿用校方／店家公開時段 | [中正大學飲食資訊](https://www.ccu.edu.tw/p/406-1000-25657,r3205.php?Lang=zh-tw) |
| 7 | 湖畔沙龍(A3生活圈店) | 校內 | 沿用校方／店家公開時段 | [中正大學飲食資訊](https://www.ccu.edu.tw/p/406-1000-25657,r3205.php?Lang=zh-tw) |
| 8 | 元氣早餐店 | 校內 | 沿用校方／店家公開時段 | [中正大學飲食資訊](https://www.ccu.edu.tw/p/406-1000-25657,r3205.php?Lang=zh-tw) |
| 9 | 松屋食坊 | 校內 | 沿用校方／店家公開時段 | [中正大學飲食資訊](https://www.ccu.edu.tw/p/406-1000-25657,r3205.php?Lang=zh-tw) |
| 10 | 食凡(EB1) | 校內 | 沿用校方／店家公開時段 | [中正大學飲食資訊](https://www.ccu.edu.tw/p/406-1000-25657,r3205.php?Lang=zh-tw) |
| 11 | 全家便利商店(共同教室大樓店) | 校內 | 沿用校方／店家公開時段 | [中正大學飲食資訊](https://www.ccu.edu.tw/p/406-1000-25657,r3205.php?Lang=zh-tw) |
| 12 | 全家便利商店(荊竹園/學人宿舍店) | 校內 | 沿用校方／店家公開時段 | [中正大學飲食資訊](https://www.ccu.edu.tw/p/406-1000-25657,r3205.php?Lang=zh-tw) |
| 13 | 基地咖啡 | 校內 | 沿用校方／店家公開時段 | [中正大學飲食資訊](https://www.ccu.edu.tw/p/406-1000-25657,r3205.php?Lang=zh-tw) |
| 14 | 楊家豆漿 | 神農路 | 已依 Google 地圖更新時刻表 | [Google 地圖商家資訊](https://maps.google.com/?cid=4481657162940129259) |
| 15 | 鮮盛食堂 | 神農路 | 已依 Google 地圖更新時刻表 | [Google 地圖商家資訊](https://maps.google.com/?cid=12650057201675339670) |
| 16 | 丼飽處x味自慢 | 神農路 | 沿用校方／店家公開時段 | [丼飽處店家網站](https://dongbaochu.webflow.io/) |
| 17 | 牛筋伯爵 | 神農路 | 已依 Google 地圖更新時刻表 | [Google 地圖商家資訊](https://maps.google.com/?cid=16813179358634308817) |
| 18 | ㄎㄎ韓食 | 神農路 | 已依 Google 地圖更新時刻表 | [Google 地圖商家資訊](https://maps.google.com/?cid=359410135548983401) |
| 19 | 洪媽媽泰式簡餐 | 神農路 | 已依 Google 地圖更新時刻表 | [Google 地圖商家資訊](https://maps.google.com/?cid=290577023717785840) |
| 20 | 西貢小吃 | 神農路 | 已依 Google 地圖更新時刻表 | [Google 地圖商家資訊](https://maps.google.com/?cid=643800234722093822) |
| 21 | 薩克廚房 | 神農路 | 已依 Google 地圖更新時刻表 | [Google 地圖商家資訊](https://maps.google.com/?cid=7081079715265422926) |
| 22 | 農閒時刻的粥 | 神農路 | 已依 Google 地圖更新時刻表 | [Google 地圖商家資訊](https://maps.google.com/?cid=15411751897971792404) |
| 23 | 豪緯麵食館 | 神農路 | 已依 Google 地圖更新時刻表 | [Google 地圖商家資訊](https://maps.google.com/?cid=16862628929911731442) |
| 24 | 地中海美食 | 神農路 | 已依 Google 地圖更新時刻表 | [Google 地圖商家資訊](https://maps.google.com/?cid=16735562923641391234) |
| 25 | 中正海南雞飯 | 神農路 | 已依 Google 地圖更新時刻表 | [Google 地圖商家資訊](https://maps.google.com/?cid=6298370754352066164) |
| 26 | 榕樹下古早味香菇肉羹麵 | 神農路 | 已依 Google 地圖更新時刻表 | [Google 地圖商家資訊](https://maps.google.com/?cid=535586748654286163) |
| 27 | Amina's Kitchen | 神農路 | 已依 Google 地圖更新時刻表 | [Google 地圖商家資訊](https://maps.google.com/?cid=3824409005718822547) |
| 28 | 越式炒泡麵 | 神農路 | 已依 Google 地圖更新時刻表 | [Google 地圖商家資訊](https://maps.google.com/?cid=15107057816747550653) |
| 29 | 蘭姐手工水餃 | 神農路 | 已依 Google 地圖更新時刻表 | [Google 地圖商家資訊](https://maps.google.com/?cid=11006399432139251410) |
| 30 | 嘉農小館 | 神農路 | 已依 Google 地圖更新時刻表 | [Google 地圖商家資訊](https://maps.google.com/?cid=9560331378579886293) |
| 31 | 阿梅簡餐便當 | 神農路 | 已依 Google 地圖更新時刻表 | [Google 地圖商家資訊](https://maps.google.com/?cid=8675573065899011313) |
| 32 | 渝香園簡餐便當 | 神農路 | 已依 Google 地圖更新時刻表 | [Google 地圖商家資訊](https://maps.google.com/?cid=10538879760333088249) |
| 33 | 二口食堂 | 神農路 | 已依 Google 地圖更新時刻表 | [Google 地圖商家資訊](https://maps.google.com/?cid=12316446496011096797) |
| 34 | 豪記滷味 | 神農路 | 已依 Google 地圖更新時刻表 | [Google 地圖商家資訊](https://maps.google.com/?cid=11475678776190246157) |
| 35 | 溫家冷滷味 | 神農路 | 已依 Google 地圖更新時刻表 | [Google 地圖商家資訊](https://maps.google.com/?cid=10760419064564157884) |
| 36 | 魯都香加熱式滷味 | 神農路 | 已依 Google 地圖更新時刻表 | [Google 地圖商家資訊](https://maps.google.com/?cid=13333018575458852206) |
| 37 | 十畝田滷味 | 神農路 | 已依 Google 地圖更新時刻表 | [Google 地圖商家資訊](https://maps.google.com/?cid=13295422634066985352) |
| 38 | 財哥鹹酥雞(神農路) | 神農路 | 已依 Google 地圖更新時刻表 | [Google 地圖商家資訊](https://maps.google.com/?cid=17462166941288612055) |
| 39 | 中正雞場 | 神農路 | 已依 Google 地圖更新時刻表 | [Google 地圖商家資訊](https://maps.google.com/?cid=17914792469007424243) |
| 40 | 海派鹽酥雞 | 神農路 | 已依 Google 地圖更新時刻表 | [Google 地圖商家資訊](https://maps.google.com/?cid=8141166164113762049) |
| 41 | 蜂炸雞超級大雞排 | 神農路 | 已依 Google 地圖更新時刻表 | [Google 地圖商家資訊](https://maps.google.com/?cid=9316781803159605078) |
| 42 | 懷念鹽酥雞 | 神農路 | 已依 Google 地圖更新時刻表 | [Google 地圖商家資訊](https://maps.google.com/?cid=14214458723826679645) |
| 43 | 墨醬章魚燒 | 神農路 | 已依 Google 地圖更新時刻表 | [Google 地圖商家資訊](https://maps.google.com/?cid=16839558359542517975) |
| 44 | Tea's原味(中正大學店) | 神農路 | 已依 Google 地圖更新時刻表 | [Google 地圖商家資訊](https://maps.google.com/?cid=1854872479724878930) |
| 45 | 鮮茶道(中正大學店) | 神農路 | 已依 Google 地圖更新時刻表 | [Google 地圖商家資訊](https://maps.google.com/?cid=7656842165945212587) |
| 46 | 七里香 | 神農路 | 已依 Google 地圖更新時刻表 | [Google 地圖商家資訊](https://maps.google.com/?cid=9208949190605389442) |
| 47 | 果真現打真果汁 | 神農路 | 已依 Google 地圖更新時刻表 | [Google 地圖商家資訊](https://maps.google.com/?cid=12879399247674298494) |
| 48 | 茶湯會(民雄神農店) | 神農路 | 已依 Google 地圖更新時刻表 | [Google 地圖商家資訊](https://maps.google.com/?cid=9226671162415239409) |
| 49 | 巧味果汁 | 神農路 | 已依 Google 地圖更新時刻表 | [Google 地圖商家資訊](https://maps.google.com/?cid=2861193622320280657) |
| 50 | 艾絲ice tea | 神農路 | 已依 Google 地圖更新時刻表 | [Google 地圖商家資訊](https://maps.google.com/?cid=5005635845565726547) |
| 51 | Ink Hall 隱客廳 | 神農路 | 沿用校方／店家公開時段 | [隱客廳店家網站](https://inkhallweb.wixsite.com/ink-hall) |
| 52 | 月亮與貓 | 神農路 | 店家仍在，時刻表待確認 | [Google 地圖](https://maps.google.com/?cid=5797080961604628816) |
| 53 | 九九義式冰淇淋 | 神農路 | 已依 Google 地圖更新時刻表 | [Google 地圖商家資訊](https://maps.google.com/?cid=14052731332614006899) |
| 54 | SmileJoyce微微笑手作坊 | 神農路 | 已依 Google 地圖更新時刻表 | [Google 地圖商家資訊](https://maps.google.com/?cid=14907368137919833599) |
| 55 | 仙草奶酪 | 神農路 | 店家仍在，時刻表待確認 | [Google 地圖](https://maps.google.com/?cid=14780947907549034268) |
| 56 | 伊卓島 | 裕農路 | 已依 Google 地圖更新時刻表 | [Google 地圖商家資訊](https://maps.google.com/?cid=14868473562978688015) |
| 57 | 花漾廚房 | 神農路 | 已依 Google 地圖更新時刻表 | [Google 地圖商家資訊](https://maps.google.com/?cid=15745559371768556542) |
| 58 | 早叄早午餐 | 神農路 | 已依 Google 地圖更新時刻表 | [Google 地圖商家資訊](https://maps.google.com/?cid=4270676679826670413) |
| 59 | 豪豪吃早餐 | 神農路 | 已依 Google 地圖更新時刻表 | [Google 地圖商家資訊](https://maps.google.com/?cid=2103847027796314822) |
| 60 | 翅炸鍋 | 神農路 | 已依 Google 地圖更新時刻表 | [Google 地圖商家資訊](https://maps.google.com/?cid=16875114789064964013) |
| 61 | 阿湯哥脆皮湯包 | 神農路 | 已依 Google 地圖更新時刻表 | [Google 地圖商家資訊](https://maps.google.com/?cid=851805594366821925) |
| 62 | 小羚風味小火鍋 | 神農路 | 沿用校方／店家公開時段 | [小羚店家介紹頁（文章日期2024年）](https://somlinlinlin.blogspot.com/) |
| 63 | 意素佳 創意蔬食料理 | 神農路 | 已依 Google 地圖更新時刻表 | [Google 地圖商家資訊](https://maps.google.com/?cid=4896147075731655154) |
| 64 | 蔬香是家 Veggie House | 神農路 | 已依 Google 地圖更新時刻表 | [Google 地圖商家資訊](https://maps.google.com/?cid=16482550232170811977) |
| 65 | 全方味便當 | 神農路 | 已依 Google 地圖更新時刻表 | [Google 地圖商家資訊](https://maps.google.com/?cid=17536917204869090209) |
| 66 | 三街亭便當 | 大學路 | 已依 Google 地圖更新時刻表 | [Google 地圖商家資訊](https://maps.google.com/?cid=17350594590262871980) |
| 67 | 泰麻吉 | 神農路 | 已依 Google 地圖更新時刻表 | [Google 地圖商家資訊](https://maps.google.com/?cid=4865176585491613728) |
| 68 | 紅樓極麵（南松食堂） | 神農路 | 已依 Google 地圖更新時刻表 | [Google 地圖商家資訊](https://maps.google.com/?cid=4927768513725141574) |
| 69 | 小栗鼠cafe | 神農路 | 店家仍在，時刻表待確認 | [Google 地圖](https://maps.google.com/?cid=2929445119566553408) |
| 70 | Yes厚切雞排 | 裕農路 | 沿用校方／店家公開時段 | [Yes厚切雞排店家網站](https://yeschicken.webflow.io/) |
| 71 | i嘎嗶複合式餐廳 | 裕農路 | 已依 Google 地圖更新時刻表 | [Google 地圖商家資訊](https://maps.google.com/?cid=9386755770927592235) |
| 72 | 瘋Beef排餐料理 | 裕農路 | 已依 Google 地圖更新時刻表 | [Google 地圖商家資訊](https://maps.google.com/?cid=8119956667969044110) |
| 73 | 三米藍 | 裕農路 | 已依 Google 地圖更新時刻表 | [Google 地圖商家資訊](https://maps.google.com/?cid=8627273990673793122) |
| 74 | 8鍋臭臭鍋（民雄中正店） | 裕農路 | 已依 Google 地圖更新時刻表 | [Google 地圖商家資訊](https://maps.google.com/?cid=14917669133717340800) |
| 75 | 即食樂複合式餐廳 | 裕農路 | 已依 Google 地圖更新時刻表 | [Google 地圖商家資訊](https://maps.google.com/?cid=4781897612083683398) |
| 76 | 韓金湯匙(嘉義中正店) | 裕農路 | 店家仍在，時刻表待確認 | [Google 地圖](https://maps.google.com/?cid=933657022504576761) |
| 77 | A-bao裕農店 | 裕農路 | 已依 Google 地圖更新時刻表 | [Google 地圖商家資訊](https://maps.google.com/?cid=8013746830513432784) |
| 78 | 侯記中式早餐 | 裕農路 | 已依 Google 地圖更新時刻表 | [Google 地圖商家資訊](https://maps.google.com/?cid=18153040571393501304) |
| 79 | 123活力早餐屋 | 大學路 | 已依 Google 地圖更新時刻表 | [Google 地圖商家資訊](https://maps.google.com/?cid=423231136257563971) |
| 80 | 花圓巧芋 | 裕農路 | 已依 Google 地圖更新時刻表 | [Google 地圖商家資訊](https://maps.google.com/?cid=15864892864337445159) |
| 81 | 誠石火鍋 | 大學路 | 已依 Google 地圖更新時刻表 | [Google 地圖商家資訊](https://maps.google.com/?cid=3740078508359235342) |
| 82 | 佳豐生活美食(共同教室餐盒供應處) | 校內 | 沿用校方／店家公開時段 | [中正大學飲食資訊](https://www.ccu.edu.tw/p/406-1000-25657,r3205.php?Lang=zh-tw) |
| 83 | 食凡(共同教室餐盒供應處) | 校內 | 沿用校方／店家公開時段 | [中正大學飲食資訊](https://www.ccu.edu.tw/p/406-1000-25657,r3205.php?Lang=zh-tw) |
| 84 | 早安山丘(中正大學店) | 神農路 | 已依 Google 地圖更新時刻表 | [Google 地圖商家資訊](https://maps.google.com/?cid=15903999990629906991) |
| 85 | 中正大四喜牛肉麵(旗艦店) | 神農路 | 沿用校方／店家公開時段 | [店家官方Facebook](https://www.facebook.com/ccubig4/) |
| 86 | 琪琪健康舖 | 神農路 | 沿用校方／店家公開時段 | [琪琪健康舖官方網站](https://www.gigishop.com.tw/) |
| 87 | Simple Fit 簡單瘦 | 裕農路 | 沿用校方／店家公開時段 | [Simple Fit 店家Facebook](https://www.facebook.com/simplefit.ccu/) |
| 88 | 大學路生煎包 | 大學路 | 沿用校方／店家公開時段 | [Dcard中正板學生探店實測紀錄](https://www.dcard.tw/f/ccu) |
| 89 | 八方雲集(嘉義中大店) | 神農路 | 店家仍在，時刻表待確認 | [Google 地圖](https://maps.google.com/?cid=3116092050714949103) |
| 90 | A咖美食平價牛排 | 神農路 | 已依 Google 地圖更新時刻表 | [Google 地圖商家資訊](https://maps.google.com/?cid=1909540637641087420) |
| 91 | Chill bowl | 神農路 | 已依 Google 地圖更新時刻表 | [Google 地圖商家資訊](https://maps.google.com/?cid=7997410405676832310) |
| 92 | 布格早餐 | 神農路 | 已依 Google 地圖更新時刻表 | [Google 地圖商家資訊](https://maps.google.com/?cid=2759682806429642200) |

### 民雄市區（Google 評論數由多到少）

| ID | 店名 | 區域 | 本次結果 | 來源 |
| --- | --- | --- | --- | --- |
| 93 | 正宗民雄鵝肉亭 | 民雄市區 | 新增；Google 地圖時刻表 | [Google 地圖商家資訊](https://maps.google.com/?cid=1017516326307885442) |
| 94 | 星巴克（嘉義民雄門市） | 民雄市區 | 新增；Google 地圖時刻表 | [Google 地圖商家資訊](https://maps.google.com/?cid=11500106240791071582) |
| 95 | 初八拉麵（民雄店） | 民雄市區 | 新增；Google 地圖時刻表 | [Google 地圖商家資訊](https://maps.google.com/?cid=6680387901932002578) |
| 96 | 羅記民雄肉包 | 民雄市區 | 新增；Google 地圖時刻表 | [Google 地圖商家資訊](https://maps.google.com/?cid=9956780088588939552) |
| 97 | 麥當勞（嘉義民雄餐廳） | 民雄市區 | 新增；Google 地圖時刻表 | [Google 地圖商家資訊](https://maps.google.com/?cid=4881734082875626543) |
| 98 | 龍坐鐵板燒 | 民雄市區 | 新增；Google 地圖時刻表 | [Google 地圖商家資訊](https://maps.google.com/?cid=11568657664141941874) |
| 99 | 頂好馨平價鍋物（民雄店） | 民雄市區 | 新增；Google 地圖時刻表 | [Google 地圖商家資訊](https://maps.google.com/?cid=17889734571814879802) |
| 100 | 花亭壽司專賣 | 民雄市區 | 新增；Google 地圖時刻表 | [Google 地圖商家資訊](https://maps.google.com/?cid=1950630094452245379) |
| 101 | 大埔鐵板燒（嘉義民雄店） | 民雄市區 | 新增；Google 地圖時刻表 | [Google 地圖商家資訊](https://maps.google.com/?cid=6272151105845357482) |
| 102 | 鴻澄鐵板燒（民雄分局） | 民雄市區 | 新增；Google 地圖時刻表 | [Google 地圖商家資訊](https://maps.google.com/?cid=1457903322018182303) |
| 103 | 民雄鵝肉太郎老店 | 民雄市區 | 新增；Google 地圖時刻表 | [Google 地圖商家資訊](https://maps.google.com/?cid=10551688870783344115) |
| 104 | 聖保羅烘焙花園（民雄店） | 民雄市區 | 新增；Google 地圖時刻表 | [Google 地圖商家資訊](https://maps.google.com/?cid=16352703468775505561) |
| 105 | 民雄鵝肉町 | 民雄市區 | 新增；Google 地圖時刻表 | [Google 地圖商家資訊](https://maps.google.com/?cid=12800551086701640351) |
| 106 | 民雄鵝肉慶 | 民雄市區 | 新增；Google 地圖時刻表 | [Google 地圖商家資訊](https://maps.google.com/?cid=2869133538860737537) |
| 107 | 湯師父美味鍋 24H（嘉義民雄） | 民雄市區 | 新增；Google 地圖時刻表 | [Google 地圖商家資訊](https://maps.google.com/?cid=1883647334459202772) |
| 108 | 濟濟一堂 | 民雄市區 | 新增；Google 地圖時刻表 | [Google 地圖商家資訊](https://maps.google.com/?cid=4469072423510578558) |
| 109 | 爭鮮PLUS（民雄店） | 民雄市區 | 新增；Google 地圖時刻表 | [Google 地圖商家資訊](https://maps.google.com/?cid=10233614346422986703) |
| 110 | 豚將日本拉麵（民雄店） | 民雄市區 | 新增；Google 地圖時刻表 | [Google 地圖商家資訊](https://maps.google.com/?cid=14508378083123463160) |
| 111 | 民雄阿君鵝肉 | 民雄市區 | 新增；Google 地圖時刻表 | [Google 地圖商家資訊](https://maps.google.com/?cid=12296638709715656083) |
| 112 | 松阪家日式料理 | 民雄市區 | 新增；Google 地圖時刻表 | [Google 地圖商家資訊](https://maps.google.com/?cid=9393105839591211803) |
| 113 | 渡對 | 民雄市區 | 新增；Google 地圖時刻表 | [Google 地圖商家資訊](https://maps.google.com/?cid=3348985700892126308) |
| 114 | 六扇門時尚湯鍋（民雄保生店） | 民雄市區 | 新增；Google 地圖時刻表 | [Google 地圖商家資訊](https://maps.google.com/?cid=17080750449594129101) |
| 115 | 五花馬水餃館（民雄門市） | 民雄市區 | 新增；Google 地圖時刻表 | [Google 地圖商家資訊](https://maps.google.com/?cid=16949654987039543809) |
| 116 | 民雄大慶鵝肉 | 民雄市區 | 新增；Google 地圖時刻表 | [Google 地圖商家資訊](https://maps.google.com/?cid=5759698418093993973) |
| 117 | 嘉鄉羊鵝肉 | 民雄市區 | 新增；時刻表待確認 | [Google 地圖](https://maps.google.com/?cid=4056807606331550755) |
| 118 | 民雄照記芋圓 | 民雄市區 | 新增；Google 地圖時刻表 | [Google 地圖商家資訊](https://maps.google.com/?cid=8996626285991541812) |
| 119 | 民雄正港鴨肉羹 | 民雄市區 | 新增；Google 地圖時刻表 | [Google 地圖商家資訊](https://maps.google.com/?cid=5794259666302702251) |
| 120 | 早到晚到（民雄店） | 民雄市區 | 新增；Google 地圖時刻表 | [Google 地圖商家資訊](https://maps.google.com/?cid=2327959273052344336) |
| 121 | 布札諾義式披薩屋 | 民雄市區 | 新增；Google 地圖時刻表 | [Google 地圖商家資訊](https://maps.google.com/?cid=3778540937631230370) |
| 122 | 民雄掽皮切仔麵 | 民雄市區 | 新增；Google 地圖時刻表 | [Google 地圖商家資訊](https://maps.google.com/?cid=13848912946600453670) |
| 123 | 韓楓館 | 民雄市區 | 新增；Google 地圖時刻表 | [Google 地圖商家資訊](https://maps.google.com/?cid=13908569289509837974) |
| 124 | 米澤鍋物 | 民雄市區 | 新增；Google 地圖時刻表 | [Google 地圖商家資訊](https://maps.google.com/?cid=3466671817017656201) |
| 125 | 民雄松林庭園咖啡簡餐 | 民雄市區 | 新增；時刻表待確認 | [Google 地圖](https://maps.google.com/?cid=12166070429307498149) |
| 126 | 韓山寺平價韓式料理（民雄保生店） | 民雄市區 | 新增；Google 地圖時刻表 | [Google 地圖商家資訊](https://maps.google.com/?cid=1476212351481630900) |
| 127 | 俗擱大碗小吃店 | 民雄市區 | 新增；Google 地圖時刻表 | [Google 地圖商家資訊](https://maps.google.com/?cid=15510394225165173874) |
| 128 | 鴨沐農烤鴨專賣店 | 民雄市區 | 新增；Google 地圖時刻表 | [Google 地圖商家資訊](https://maps.google.com/?cid=3611459230645982032) |
| 129 | 歡樂牛排（民雄店） | 民雄市區 | 新增；Google 地圖時刻表 | [Google 地圖商家資訊](https://maps.google.com/?cid=4806600655141559991) |
| 130 | 京品北方麵食館 | 民雄市區 | 新增；Google 地圖時刻表 | [Google 地圖商家資訊](https://maps.google.com/?cid=14326756874767455886) |
| 131 | 二吉軒豆漿（嘉義民雄店） | 民雄市區 | 新增；Google 地圖時刻表 | [Google 地圖商家資訊](https://maps.google.com/?cid=600907503174487429) |
| 132 | 阿吉麵攤 | 民雄市區 | 新增；Google 地圖時刻表 | [Google 地圖商家資訊](https://maps.google.com/?cid=673757068151768358) |
| 133 | BB SUGAR 逼逼堂碳烤甜甜圈 | 民雄市區 | 新增；Google 地圖時刻表 | [Google 地圖商家資訊](https://maps.google.com/?cid=5770936638414425506) |
| 134 | 川沐燒肉 | 民雄市區 | 新增；Google 地圖時刻表 | [Google 地圖商家資訊](https://maps.google.com/?cid=6842728109745979480) |
| 135 | 尋光小徑義式冰淇淋 | 民雄市區 | 新增；Google 地圖時刻表 | [Google 地圖商家資訊](https://maps.google.com/?cid=12514239163440455822) |
| 136 | A-bao house（民雄東榮店） | 民雄市區 | 新增；Google 地圖時刻表 | [Google 地圖商家資訊](https://maps.google.com/?cid=13011056954378267827) |
| 137 | 一魂拉麵（民雄店） | 民雄市區 | 新增；Google 地圖時刻表 | [Google 地圖商家資訊](https://maps.google.com/?cid=2705144939368786257) |
| 138 | 阜壽司 | 民雄市區 | 新增；Google 地圖時刻表 | [Google 地圖商家資訊](https://maps.google.com/?cid=18352489789144715760) |
| 139 | 民雄扁食意麵 | 民雄市區 | 新增；Google 地圖時刻表 | [Google 地圖商家資訊](https://maps.google.com/?cid=16126158746715643198) |
| 140 | 慢靈魂咖啡館 | 民雄市區 | 新增；Google 地圖時刻表 | [Google 地圖商家資訊](https://maps.google.com/?cid=4952600385108057134) |
| 141 | 小燈步道 | 民雄市區 | 新增；Google 地圖時刻表 | [Google 地圖商家資訊](https://maps.google.com/?cid=13194518152211701696) |
| 142 | 金御咖哩 | 民雄市區 | 新增；Google 地圖時刻表 | [Google 地圖商家資訊](https://maps.google.com/?cid=15153325492695206403) |
| 143 | 金品早午餐 | 民雄市區 | 新增；Google 地圖時刻表 | [Google 地圖商家資訊](https://maps.google.com/?cid=979771511915136667) |
| 144 | 拉亞漢堡（民雄文化店） | 民雄市區 | 新增；Google 地圖時刻表 | [Google 地圖商家資訊](https://maps.google.com/?cid=12304389703183040407) |
| 145 | 阮氏料理 | 民雄市區 | 新增；Google 地圖時刻表 | [Google 地圖商家資訊](https://maps.google.com/?cid=15018776380717470546) |
| 146 | 飯丸屋（民雄店） | 民雄市區 | 新增；Google 地圖時刻表 | [Google 地圖商家資訊](https://maps.google.com/?cid=17368158889659612172) |
| 147 | 8鍋臭臭鍋（民雄店） | 民雄市區 | 新增；Google 地圖時刻表 | [Google 地圖商家資訊](https://maps.google.com/?cid=7665357084269234366) |
| 148 | PC's 蔬房 | 民雄市區 | 新增；Google 地圖時刻表 | [Google 地圖商家資訊](https://maps.google.com/?cid=919237014037504416) |
| 149 | Long Stay 現泡茶（龍喜嗲民雄總店） | 民雄市區 | 新增；Google 地圖時刻表 | [Google 地圖商家資訊](https://maps.google.com/?cid=9921823198365441867) |
| 150 | 樂趣 AT FUN | 民雄市區 | 新增；Google 地圖時刻表 | [Google 地圖商家資訊](https://maps.google.com/?cid=12423573612434247563) |
| 151 | 偉仔炸蛋蔥油餅 | 民雄市區 | 新增；Google 地圖時刻表 | [Google 地圖商家資訊](https://maps.google.com/?cid=1579198923272235362) |
| 152 | 伊豆壽司 | 民雄市區 | 新增；Google 地圖時刻表 | [Google 地圖商家資訊](https://maps.google.com/?cid=12197897950149242185) |
| 153 | 福星藥頭排骨 | 民雄市區 | 新增；Google 地圖時刻表 | [Google 地圖商家資訊](https://maps.google.com/?cid=13438518227590288569) |
| 154 | 草魚的店 | 民雄市區 | 新增；Google 地圖時刻表 | [Google 地圖商家資訊](https://maps.google.com/?cid=2517100902269667863) |
| 155 | 阿寬的店 | 民雄市區 | 新增；Google 地圖時刻表 | [Google 地圖商家資訊](https://maps.google.com/?cid=10089454488615582170) |
| 156 | 玖凉冰品・咖哩專賣店 | 民雄市區 | 新增；Google 地圖時刻表 | [Google 地圖商家資訊](https://maps.google.com/?cid=13049822650099328943) |
| 157 | 夯仔內牛肉麵食館（嘉義民雄店） | 民雄市區 | 新增；Google 地圖時刻表 | [Google 地圖商家資訊](https://maps.google.com/?cid=11157556922304763059) |
| 158 | MAMA 早午餐廚房 | 民雄市區 | 新增；Google 地圖時刻表 | [Google 地圖商家資訊](https://maps.google.com/?cid=362198606610057669) |
| 159 | 民雄鴨對寶烤鴨專賣店 | 民雄市區 | 新增；Google 地圖時刻表 | [Google 地圖商家資訊](https://maps.google.com/?cid=1386275428628595728) |
| 160 | 宅豆花甜品專賣店（民雄店） | 民雄市區 | 新增；Google 地圖時刻表 | [Google 地圖商家資訊](https://maps.google.com/?cid=1400923342394564485) |
| 161 | 50嵐（嘉義民雄店） | 民雄市區 | 新增；Google 地圖時刻表 | [Google 地圖商家資訊](https://maps.google.com/?cid=13371553326872804500) |
| 162 | 古丁原味品茶館（民雄店） | 民雄市區 | 新增；Google 地圖時刻表 | [Google 地圖商家資訊](https://maps.google.com/?cid=5559327819188462760) |
| 163 | 百年自助餐 | 民雄市區 | 新增；Google 地圖時刻表 | [Google 地圖商家資訊](https://maps.google.com/?cid=609070545768633997) |
| 164 | 河馬先生甜點烘焙坊 | 民雄市區 | 新增；Google 地圖時刻表 | [Google 地圖商家資訊](https://maps.google.com/?cid=7953935247549454190) |
| 165 | 紅葉牛排 | 民雄市區 | 新增；Google 地圖時刻表 | [Google 地圖商家資訊](https://maps.google.com/?cid=17576668973534323235) |
| 166 | 老地方廚房 | 民雄市區 | 新增；Google 地圖時刻表 | [Google 地圖商家資訊](https://maps.google.com/?cid=9774985660171701926) |
| 167 | 早安山丘（民雄保生店） | 民雄市區 | 新增；Google 地圖時刻表 | [Google 地圖商家資訊](https://maps.google.com/?cid=169475355877621493) |
| 168 | 嘉豐鐵板燒 | 民雄市區 | 新增；Google 地圖時刻表 | [Google 地圖商家資訊](https://maps.google.com/?cid=6038826001334107482) |
| 169 | Coffeeology 咖啡學 | 民雄市區 | 新增；Google 地圖時刻表 | [Google 地圖商家資訊](https://maps.google.com/?cid=9340746596823896882) |
| 170 | 岐也紅茶（民雄店） | 民雄市區 | 新增；Google 地圖時刻表 | [Google 地圖商家資訊](https://maps.google.com/?cid=4350787319125371684) |
| 171 | 一柳涮涮鍋 | 民雄市區 | 新增；Google 地圖時刻表 | [Google 地圖商家資訊](https://maps.google.com/?cid=10691761478386317611) |
| 172 | 御繕早ㄉㄥˋ店 | 民雄市區 | 新增；Google 地圖時刻表 | [Google 地圖商家資訊](https://maps.google.com/?cid=5713657166488012153) |
| 173 | 鶴茶樓（嘉義民雄店） | 民雄市區 | 新增；時刻表待確認 | [Google 地圖](https://maps.google.com/?cid=12903407237083958591) |
| 174 | 野餐，日。健康餐盒（民雄店） | 民雄市區 | 新增；Google 地圖時刻表 | [Google 地圖商家資訊](https://maps.google.com/?cid=18421768068580303735) |
| 175 | 85度C（嘉義民雄店） | 民雄市區 | 新增；Google 地圖時刻表 | [Google 地圖商家資訊](https://maps.google.com/?cid=1747780895553696939) |
| 176 | 舊是這一家鹽酥雞 | 民雄市區 | 新增；Google 地圖時刻表 | [Google 地圖商家資訊](https://maps.google.com/?cid=13948714910281461111) |
| 177 | 巴豆夭（民雄建國店） | 民雄市區 | 新增；Google 地圖時刻表 | [Google 地圖商家資訊](https://maps.google.com/?cid=16337526758487956830) |
| 178 | Bella 貝拉甜品專賣（民雄店） | 民雄市區 | 新增；Google 地圖時刻表 | [Google 地圖商家資訊](https://maps.google.com/?cid=593015386506623145) |
| 179 | 民雄帕仕噠 PASTA 義式餐飲 | 民雄市區 | 新增；Google 地圖時刻表 | [Google 地圖商家資訊](https://maps.google.com/?cid=8343510698638890942) |
| 180 | 廟街水餃 | 民雄市區 | 新增；Google 地圖時刻表 | [Google 地圖商家資訊](https://maps.google.com/?cid=6545766075878184918) |
| 181 | 民雄老莊鵝肉 | 民雄市區 | 新增；Google 地圖時刻表 | [Google 地圖商家資訊](https://maps.google.com/?cid=3476605849811044571) |
| 182 | 隔壁宵夜（民雄店） | 民雄市區 | 新增；Google 地圖時刻表 | [Google 地圖商家資訊](https://maps.google.com/?cid=100970064293894367) |
| 183 | 藍盤子早午餐（民雄復興店） | 民雄市區 | 新增；Google 地圖時刻表 | [Google 地圖商家資訊](https://maps.google.com/?cid=4642539750322578213) |
| 184 | 香港梁記燒臘 | 民雄市區 | 新增；Google 地圖時刻表 | [Google 地圖商家資訊](https://maps.google.com/?cid=16811287549113513372) |
| 185 | 霸味薑母鴨（嘉義民雄店） | 民雄市區 | 新增；Google 地圖時刻表 | [Google 地圖商家資訊](https://maps.google.com/?cid=18200882012112603381) |
| 186 | 阿立鱔魚麵 | 民雄市區 | 新增；Google 地圖時刻表 | [Google 地圖商家資訊](https://maps.google.com/?cid=3896180898433561679) |
| 187 | House Cafe 好鄰咖啡 | 民雄市區 | 新增；Google 地圖時刻表 | [Google 地圖商家資訊](https://maps.google.com/?cid=17806646697601704144) |
| 188 | 煮丼一点 | 民雄市區 | 新增；Google 地圖時刻表 | [Google 地圖商家資訊](https://maps.google.com/?cid=11711225710896275862) |
| 189 | 民雄廟口碳烤雞排 | 民雄市區 | 新增；Google 地圖時刻表 | [Google 地圖商家資訊](https://maps.google.com/?cid=17936355871428552377) |
| 190 | 鬍鬚豆豆 | 民雄市區 | 新增；Google 地圖時刻表 | [Google 地圖商家資訊](https://maps.google.com/?cid=10438023584800258414) |
| 191 | 迷客夏（嘉義民雄店） | 民雄市區 | 新增；Google 地圖時刻表 | [Google 地圖商家資訊](https://maps.google.com/?cid=5626117901297425375) |
| 192 | 有間鍋物 | 民雄市區 | 新增；Google 地圖時刻表 | [Google 地圖商家資訊](https://maps.google.com/?cid=11988882472848087644) |
| 193 | 胖老爹美式炸雞（民雄店） | 民雄市區 | 新增；Google 地圖時刻表 | [Google 地圖商家資訊](https://maps.google.com/?cid=3755313321535764457) |
| 194 | 九湯屋日本拉麵（嘉義民雄店） | 民雄市區 | 新增；Google 地圖時刻表 | [Google 地圖商家資訊](https://maps.google.com/?cid=1380914367536917000) |
| 195 | 藝鍋物（民雄店） | 民雄市區 | 新增；Google 地圖時刻表 | [Google 地圖商家資訊](https://maps.google.com/?cid=15240817397512479525) |
| 196 | 民雄佑壽司 | 民雄市區 | 新增；Google 地圖時刻表 | [Google 地圖商家資訊](https://maps.google.com/?cid=3784157799481942850) |
| 197 | 好家園自助餐（民雄店） | 民雄市區 | 新增；Google 地圖時刻表 | [Google 地圖商家資訊](https://maps.google.com/?cid=8754441854127571072) |
| 198 | 澎湃先生古早味蛋糕（民雄店） | 民雄市區 | 新增；時刻表待確認 | [Google 地圖](https://maps.google.com/?cid=8035099991228492032) |
| 199 | 木村御飯糰&可樂餅 | 民雄市區 | 新增；Google 地圖時刻表 | [Google 地圖商家資訊](https://maps.google.com/?cid=9815716828360371621) |
| 200 | 小媽咪早午餐 | 民雄市區 | 新增；Google 地圖時刻表 | [Google 地圖商家資訊](https://maps.google.com/?cid=15752022250989716878) |
| 201 | 可以可以地瓜球（民雄店） | 民雄市區 | 新增；時刻表待確認 | [Google 地圖](https://maps.google.com/?cid=17810148637178450898) |
| 202 | 民雄薑母鴨羊肉爐 | 民雄市區 | 新增；Google 地圖時刻表 | [Google 地圖商家資訊](https://maps.google.com/?cid=10291245837419555792) |
| 203 | 安和1號食堂 | 民雄市區 | 新增；Google 地圖時刻表 | [Google 地圖商家資訊](https://maps.google.com/?cid=7610658417801640236) |
| 204 | 甘泉魚麵（嘉義民雄店） | 民雄市區 | 新增；Google 地圖時刻表 | [Google 地圖商家資訊](https://maps.google.com/?cid=13914044072549767250) |
