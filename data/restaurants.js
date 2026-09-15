// 查閱日期與來源逐店記錄。legacyOpenHours 僅供追溯，不參與營業判斷。
window.RESTAURANTS = [
  {
    "id": 1,
    "name": "全家便利商店(活動中心店)",
    "cuisine": "便利商店",
    "meals": ["breakfast","lunch","dinner","latenight"],
    "price_range": "cheap",
    "location": "校內",
    "note": "活動中心2F",
    "openHours": {"mon":"07:00-24:00","tue":"07:00-24:00","wed":"07:00-24:00","thu":"07:00-24:00","fri":"07:00-24:00","sat":"07:00-24:00","sun":"07:00-24:00"},
    "legacyOpenHours": {"mon":"07:00-23:00","tue":"07:00-23:00","wed":"07:00-23:00","thu":"07:00-23:00","fri":"07:00-23:00","sat":"07:00-23:00","sun":"07:00-23:00"},
    "verification": {
      "status": "sourced",
      "checkedAt": "2026-09-10",
      "source": "https://www.ccu.edu.tw/p/406-1000-25657,r3205.php?Lang=zh-tw",
      "label": "中正大學飲食資訊",
      "fields": "名稱、位置、每週營業時間",
      "note": "依公開頁面列載；查閱日期不代表店家更新日期，出發前請確認臨時異動。"
    },
    "hoursNote": "學期一般時段；國定假日、寒暑假及臨時店休請另查校方公告。",
    "serviceAlerts": [
      {
        "from": "2026-09-20T07:00:00+08:00",
        "to": "2026-09-20T18:00:00+08:00",
        "note": "校內停水停電，部分店家暫停營業；請先確認店鋪公告。",
        "source": "https://oga.ccu.edu.tw/p/406-1006-93897,r1498.php?Lang=zh-tw"
      }
    ]
  },
  {
    "id": 2,
    "name": "微風蔬果",
    "cuisine": "台式",
    "meals": ["lunch","dinner"],
    "price_range": "cheap",
    "location": "校內",
    "note": "水果/焗烤/剉冰/飲料/披薩/潛艇堡，活動中心1F小吃街",
    "openHours": {"mon":"09:00-19:00","tue":"09:00-19:00","wed":"09:00-19:00","thu":"09:00-19:00","fri":"09:00-18:30","sat":"休息","sun":"休息"},
    "legacyOpenHours": {"mon":null,"tue":null,"wed":null,"thu":null,"fri":null,"sat":null,"sun":null},
    "verification": {
      "status": "sourced",
      "checkedAt": "2026-09-10",
      "source": "https://www.ccu.edu.tw/p/406-1000-25657,r3205.php?Lang=zh-tw",
      "label": "中正大學飲食資訊",
      "fields": "名稱、位置、每週營業時間",
      "note": "依公開頁面列載；查閱日期不代表店家更新日期，出發前請確認臨時異動。"
    },
    "hoursNote": "學期一般時段；國定假日、寒暑假及臨時店休請另查校方公告。",
    "serviceAlerts": [
      {
        "from": "2026-09-20T07:00:00+08:00",
        "to": "2026-09-20T18:00:00+08:00",
        "note": "校內停水停電，部分店家暫停營業；請先確認店鋪公告。",
        "source": "https://oga.ccu.edu.tw/p/406-1006-93897,r1498.php?Lang=zh-tw"
      }
    ]
  },
  {
    "id": 3,
    "name": "佳豐生活美食坊",
    "cuisine": "台式",
    "meals": ["lunch","dinner"],
    "price_range": "cheap",
    "location": "校內",
    "note": "自助餐/飯類/麵食，活動中心1F小吃街",
    "openHours": {"mon":"10:30-19:30","tue":"10:30-19:30","wed":"10:30-19:30","thu":"10:30-19:30","fri":"10:30-19:30","sat":null,"sun":"休息"},
    "legacyOpenHours": {"mon":null,"tue":null,"wed":null,"thu":null,"fri":null,"sat":null,"sun":null},
    "verification": {
      "status": "sourced",
      "checkedAt": "2026-09-10",
      "source": "https://www.ccu.edu.tw/p/406-1000-25657,r3205.php?Lang=zh-tw",
      "label": "中正大學飲食資訊",
      "fields": "名稱、位置、每週營業時間",
      "note": "依公開頁面列載；查閱日期不代表店家更新日期，出發前請確認臨時異動。"
    },
    "hoursNote": "週六隔週休，校方未列輪休日期，週六營業待確認；寒暑假另行公告。",
    "serviceAlerts": [
      {
        "from": "2026-09-20T07:00:00+08:00",
        "to": "2026-09-20T18:00:00+08:00",
        "note": "校內停水停電，部分店家暫停營業；請先確認店鋪公告。",
        "source": "https://oga.ccu.edu.tw/p/406-1006-93897,r1498.php?Lang=zh-tw"
      }
    ]
  },
  {
    "id": 4,
    "name": "婆媳麵食部",
    "cuisine": "台式",
    "meals": ["lunch","dinner"],
    "price_range": "cheap",
    "location": "校內",
    "note": "牛肉麵/水餃/米糕，活動中心1F小吃街",
    "openHours": {"mon":"10:30-19:30","tue":"10:30-19:30","wed":"10:30-19:30","thu":"10:30-19:30","fri":"10:30-19:30","sat":"休息","sun":"10:30-19:30"},
    "legacyOpenHours": {"mon":null,"tue":null,"wed":null,"thu":null,"fri":null,"sat":null,"sun":null},
    "verification": {
      "status": "sourced",
      "checkedAt": "2026-09-10",
      "source": "https://www.ccu.edu.tw/p/406-1000-25657,r3205.php?Lang=zh-tw",
      "label": "中正大學飲食資訊",
      "fields": "名稱、位置、每週營業時間",
      "note": "依公開頁面列載；查閱日期不代表店家更新日期，出發前請確認臨時異動。"
    },
    "hoursNote": "學期一般時段；國定假日、寒暑假及臨時店休請另查校方公告。",
    "serviceAlerts": [
      {
        "from": "2026-09-20T07:00:00+08:00",
        "to": "2026-09-20T18:00:00+08:00",
        "note": "校內停水停電，部分店家暫停營業；請先確認店鋪公告。",
        "source": "https://oga.ccu.edu.tw/p/406-1006-93897,r1498.php?Lang=zh-tw"
      }
    ]
  },
  {
    "id": 5,
    "name": "珍品餐館",
    "cuisine": "台式",
    "meals": ["lunch","dinner"],
    "price_range": "medium",
    "location": "校內",
    "note": "麻辣鴨血/臭豆腐/咖哩飯/鍋物，活動中心1F小吃街",
    "openHours": {"mon":"10:30-19:30","tue":"10:30-19:30","wed":"10:30-19:30","thu":"10:30-19:30","fri":"10:30-19:30","sat":"休息","sun":"10:30-19:30"},
    "legacyOpenHours": {"mon":null,"tue":null,"wed":null,"thu":null,"fri":null,"sat":null,"sun":null},
    "verification": {
      "status": "sourced",
      "checkedAt": "2026-09-10",
      "source": "https://www.ccu.edu.tw/p/406-1000-25657,r3205.php?Lang=zh-tw",
      "label": "中正大學飲食資訊",
      "fields": "名稱、位置、每週營業時間",
      "note": "依公開頁面列載；查閱日期不代表店家更新日期，出發前請確認臨時異動。"
    },
    "hoursNote": "學期一般時段；國定假日、寒暑假及臨時店休請另查校方公告。",
    "serviceAlerts": [
      {
        "from": "2026-09-20T07:00:00+08:00",
        "to": "2026-09-20T18:00:00+08:00",
        "note": "校內停水停電，部分店家暫停營業；請先確認店鋪公告。",
        "source": "https://oga.ccu.edu.tw/p/406-1006-93897,r1498.php?Lang=zh-tw"
      }
    ]
  },
  {
    "id": 6,
    "name": "路易莎咖啡(嘉義中正大學門市)",
    "cuisine": "咖啡",
    "meals": ["breakfast","lunch","dinner"],
    "price_range": "medium",
    "location": "校內",
    "note": "咖啡/飲料/麵包/健康餐，活動中心1F",
    "openHours": {"mon":"07:00-21:00","tue":"07:00-21:00","wed":"07:00-21:00","thu":"07:00-21:00","fri":"07:00-21:00","sat":"08:00-19:00","sun":"08:00-19:00"},
    "legacyOpenHours": {"mon":"07:00-21:00","tue":"07:00-21:00","wed":"07:00-21:00","thu":"07:00-21:00","fri":"07:00-21:00","sat":"08:00-19:00","sun":"08:00-19:00"},
    "verification": {
      "status": "sourced",
      "checkedAt": "2026-09-10",
      "source": "https://www.ccu.edu.tw/p/406-1000-25657,r3205.php?Lang=zh-tw",
      "label": "中正大學飲食資訊",
      "fields": "名稱、位置、每週營業時間",
      "note": "依公開頁面列載；查閱日期不代表店家更新日期，出發前請確認臨時異動。"
    },
    "hoursNote": "學期一般時段；國定假日、寒暑假及臨時店休請另查校方公告。",
    "serviceAlerts": [
      {
        "from": "2026-09-20T07:00:00+08:00",
        "to": "2026-09-20T18:00:00+08:00",
        "note": "校內停水停電，部分店家暫停營業；請先確認店鋪公告。",
        "source": "https://oga.ccu.edu.tw/p/406-1006-93897,r1498.php?Lang=zh-tw"
      }
    ],
    "specialHours": {"2026-09-07":"08:00-19:00","2026-09-08":"08:00-19:00","2026-09-09":"08:00-19:00","2026-09-10":"08:00-19:00","2026-09-11":"08:00-19:00","2026-09-12":"08:00-17:00","2026-09-13":"08:00-17:00"},
    "specialHoursSource": "https://www.ccu.edu.tw/p/406-1000-25657,r3205.php?Lang=zh-tw"
  },
  {
    "id": 7,
    "name": "湖畔沙龍(A3生活圈店)",
    "cuisine": "咖啡",
    "meals": ["lunch","dinner"],
    "price_range": "medium",
    "location": "校內",
    "note": "咖啡、飲料、麵包、簡餐，A3生活圈3F；活動中心1F另為咖啡豆烘焙室。",
    "openHours": {"mon":"11:00-14:00、17:00-20:00","tue":"11:00-14:00、17:00-20:00","wed":"11:00-14:00、17:00-20:00","thu":"11:00-14:00、17:00-20:00","fri":"11:00-14:00、17:00-20:00","sat":"休息","sun":"休息"},
    "legacyOpenHours": {"mon":"11:00-14:00、17:00-20:00","tue":"11:00-14:00、17:00-20:00","wed":"11:00-14:00、17:00-20:00","thu":"11:00-14:00、17:00-20:00","fri":"11:00-14:00、17:00-20:00","sat":"休息","sun":"休息"},
    "verification": {
      "status": "sourced",
      "checkedAt": "2026-09-10",
      "source": "https://www.ccu.edu.tw/p/406-1000-25657,r3205.php?Lang=zh-tw",
      "label": "中正大學飲食資訊",
      "fields": "名稱、位置、每週營業時間",
      "note": "依公開頁面列載；查閱日期不代表店家更新日期，出發前請確認臨時異動。"
    },
    "hoursNote": "學期一般時段；國定假日、寒暑假及臨時店休請另查校方公告。",
    "serviceAlerts": [
      {
        "from": "2026-09-20T07:00:00+08:00",
        "to": "2026-09-20T18:00:00+08:00",
        "note": "校內停水停電，部分店家暫停營業；請先確認店鋪公告。",
        "source": "https://oga.ccu.edu.tw/p/406-1006-93897,r1498.php?Lang=zh-tw"
      }
    ]
  },
  {
    "id": 8,
    "name": "元氣早餐店",
    "cuisine": "台式",
    "meals": ["breakfast","lunch"],
    "price_range": "cheap",
    "location": "校內",
    "note": "漢堡/土司/蛋餅/奶茶，A3生活圈3F",
    "openHours": {"mon":"07:00-13:00","tue":"07:00-13:00","wed":"07:00-13:00","thu":"07:00-13:00","fri":"07:00-13:00","sat":"休息","sun":"休息"},
    "legacyOpenHours": {"mon":null,"tue":null,"wed":null,"thu":null,"fri":null,"sat":null,"sun":null},
    "verification": {
      "status": "sourced",
      "checkedAt": "2026-09-10",
      "source": "https://www.ccu.edu.tw/p/406-1000-25657,r3205.php?Lang=zh-tw",
      "label": "中正大學飲食資訊",
      "fields": "名稱、位置、每週營業時間",
      "note": "依公開頁面列載；查閱日期不代表店家更新日期，出發前請確認臨時異動。"
    },
    "hoursNote": "學期一般時段；國定假日、寒暑假及臨時店休請另查校方公告。",
    "serviceAlerts": [
      {
        "from": "2026-09-20T07:00:00+08:00",
        "to": "2026-09-20T18:00:00+08:00",
        "note": "校內停水停電，部分店家暫停營業；請先確認店鋪公告。",
        "source": "https://oga.ccu.edu.tw/p/406-1006-93897,r1498.php?Lang=zh-tw"
      }
    ]
  },
  {
    "id": 9,
    "name": "松屋食坊",
    "cuisine": "台式",
    "meals": ["lunch"],
    "price_range": "cheap",
    "location": "校內",
    "note": "中式自助餐/餐盒，A3生活圈2F",
    "openHours": {"mon":"11:00-13:30","tue":"11:00-13:30","wed":"11:00-13:30","thu":"11:00-13:30","fri":null,"sat":null,"sun":null},
    "legacyOpenHours": {"mon":null,"tue":null,"wed":null,"thu":null,"fri":null,"sat":null,"sun":null},
    "verification": {
      "status": "sourced",
      "checkedAt": "2026-09-10",
      "source": "https://www.ccu.edu.tw/p/406-1000-25657,r3205.php?Lang=zh-tw",
      "label": "中正大學飲食資訊",
      "fields": "名稱、位置、每週營業時間",
      "note": "依公開頁面列載；查閱日期不代表店家更新日期，出發前請確認臨時異動。"
    },
    "hoursNote": "校方僅列週一至週四午餐；週五至週日未提供時段。",
    "serviceAlerts": [
      {
        "from": "2026-09-20T07:00:00+08:00",
        "to": "2026-09-20T18:00:00+08:00",
        "note": "校內停水停電，部分店家暫停營業；請先確認店鋪公告。",
        "source": "https://oga.ccu.edu.tw/p/406-1006-93897,r1498.php?Lang=zh-tw"
      }
    ]
  },
  {
    "id": 10,
    "name": "食凡(EB1)",
    "cuisine": "台式",
    "meals": ["lunch"],
    "price_range": "cheap",
    "location": "校內",
    "note": "健康餐盒，學士班宿舍E棟地下一樓（EB1）。",
    "openHours": {"mon":"11:00-14:00","tue":"11:00-14:00","wed":"11:00-14:00","thu":"11:00-14:00","fri":"11:00-14:00","sat":"休息","sun":"休息"},
    "legacyOpenHours": {"mon":"11:30-20:00","tue":"11:30-20:00","wed":"11:30-20:00","thu":"11:30-20:00","fri":"11:30-20:00","sat":"11:30-20:00","sun":"11:30-20:00"},
    "verification": {
      "status": "sourced",
      "checkedAt": "2026-09-10",
      "source": "https://www.ccu.edu.tw/p/406-1000-25657,r3205.php?Lang=zh-tw",
      "label": "中正大學飲食資訊",
      "fields": "名稱、位置、每週營業時間",
      "note": "依公開頁面列載；查閱日期不代表店家更新日期，出發前請確認臨時異動。"
    },
    "hoursNote": "寒暑假暫停營業；學期一般時段以外請另查校方公告。",
    "serviceAlerts": [
      {
        "from": "2026-09-20T07:00:00+08:00",
        "to": "2026-09-20T18:00:00+08:00",
        "note": "校內停水停電，部分店家暫停營業；請先確認店鋪公告。",
        "source": "https://oga.ccu.edu.tw/p/406-1006-93897,r1498.php?Lang=zh-tw"
      }
    ]
  },
  {
    "id": 11,
    "name": "全家便利商店(共同教室大樓店)",
    "cuisine": "便利商店",
    "meals": ["breakfast","lunch","dinner","latenight"],
    "price_range": "cheap",
    "location": "校內",
    "note": "共同教室大樓1F",
    "openHours": {"mon":"07:00-23:00","tue":"07:00-23:00","wed":"07:00-23:00","thu":"07:00-23:00","fri":"07:00-23:00","sat":"07:00-18:00","sun":"07:00-18:00"},
    "legacyOpenHours": {"mon":"07:00-23:00","tue":"07:00-23:00","wed":"07:00-23:00","thu":"07:00-23:00","fri":"07:00-23:00","sat":"07:00-18:00","sun":"07:00-18:00"},
    "verification": {
      "status": "sourced",
      "checkedAt": "2026-09-10",
      "source": "https://www.ccu.edu.tw/p/406-1000-25657,r3205.php?Lang=zh-tw",
      "label": "中正大學飲食資訊",
      "fields": "名稱、位置、每週營業時間",
      "note": "依公開頁面列載；查閱日期不代表店家更新日期，出發前請確認臨時異動。"
    },
    "hoursNote": "寒暑假暫停營業；學期一般時段以外請另查校方公告。",
    "serviceAlerts": [
      {
        "from": "2026-09-20T07:00:00+08:00",
        "to": "2026-09-20T18:00:00+08:00",
        "note": "校內停水停電，部分店家暫停營業；請先確認店鋪公告。",
        "source": "https://oga.ccu.edu.tw/p/406-1006-93897,r1498.php?Lang=zh-tw"
      }
    ]
  },
  {
    "id": 12,
    "name": "全家便利商店(荊竹園/學人宿舍店)",
    "cuisine": "便利商店",
    "meals": ["breakfast","lunch","dinner","latenight"],
    "price_range": "cheap",
    "location": "校內",
    "note": "荊竹園宿舍區1F",
    "openHours": {"mon":"07:00-23:00","tue":"07:00-23:00","wed":"07:00-23:00","thu":"07:00-23:00","fri":"07:00-23:00","sat":"07:00-23:00","sun":"07:00-23:00"},
    "legacyOpenHours": {"mon":"07:00-23:00","tue":"07:00-23:00","wed":"07:00-23:00","thu":"07:00-23:00","fri":"07:00-23:00","sat":"07:00-23:00","sun":"07:00-23:00"},
    "verification": {
      "status": "sourced",
      "checkedAt": "2026-09-10",
      "source": "https://www.ccu.edu.tw/p/406-1000-25657,r3205.php?Lang=zh-tw",
      "label": "中正大學飲食資訊",
      "fields": "名稱、位置、每週營業時間",
      "note": "依公開頁面列載；查閱日期不代表店家更新日期，出發前請確認臨時異動。"
    },
    "hoursNote": "學期一般時段；國定假日、寒暑假及臨時店休請另查校方公告。",
    "serviceAlerts": [
      {
        "from": "2026-09-20T07:00:00+08:00",
        "to": "2026-09-20T18:00:00+08:00",
        "note": "校內停水停電，部分店家暫停營業；請先確認店鋪公告。",
        "source": "https://oga.ccu.edu.tw/p/406-1006-93897,r1498.php?Lang=zh-tw"
      }
    ]
  },
  {
    "id": 13,
    "name": "基地咖啡",
    "cuisine": "咖啡",
    "meals": ["breakfast","lunch"],
    "price_range": "medium",
    "location": "校內",
    "note": "茶飲、咖啡、輕食，社科院1F；此筆不是共同教室舊據點。",
    "openHours": {"mon":"08:50-16:10","tue":"08:50-16:10","wed":"08:50-16:10","thu":"08:50-16:10","fri":"08:50-16:10","sat":"休息","sun":"休息"},
    "legacyOpenHours": {"mon":"08:50-16:10","tue":"08:50-16:10","wed":"08:50-16:10","thu":"08:50-16:10","fri":"08:50-16:10","sat":"休息","sun":"休息"},
    "verification": {
      "status": "sourced",
      "checkedAt": "2026-09-10",
      "source": "https://www.ccu.edu.tw/p/406-1000-25657,r3205.php?Lang=zh-tw",
      "label": "中正大學飲食資訊",
      "fields": "名稱、位置、每週營業時間",
      "note": "依公開頁面列載；查閱日期不代表店家更新日期，出發前請確認臨時異動。"
    },
    "hoursNote": "寒暑假暫停營業；學期一般時段以外請另查校方公告。",
    "serviceAlerts": [
      {
        "from": "2026-09-20T07:00:00+08:00",
        "to": "2026-09-20T18:00:00+08:00",
        "note": "校內停水停電，部分店家暫停營業；請先確認店鋪公告。",
        "source": "https://oga.ccu.edu.tw/p/406-1006-93897,r1498.php?Lang=zh-tw"
      }
    ],
    "specialHours": {"2026-09-09":"休息"},
    "specialHoursSource": "https://oga.ccu.edu.tw/p/406-1006-94548,r1498.php?Lang=zh-tw"
  },
  {
    "id": 14,
    "name": "楊家豆漿",
    "cuisine": "台式",
    "meals": ["dinner","latenight"],
    "price_range": "cheap",
    "location": "神農路",
    "note": "豆漿/蛋餅/燒餅",
    "address": "嘉義縣民雄鄉神農路145號",
    "phone": "05-2722258",
    "openHours": {"mon":null,"tue":null,"wed":null,"thu":null,"fri":null,"sat":null,"sun":null},
    "legacyOpenHours": {"mon":"17:00-02:00","tue":"17:00-02:00","wed":"17:00-02:00","thu":"17:00-02:00","fri":"17:00-02:00","sat":"休息","sun":"17:00-02:00"},
    "hoursNote": "Footinder列神農路145號、05-2722258；Bing知識面板另寫147號。2026-01 Dcard與2026-03鄰攤仍提及。不恢復時刻表。",
    "verification": {
      "status": "unconfirmed",
      "checkedAt": "2026-09-15",
      "note": "地址電話取自聚合地圖，門牌145/147衝突；不是店家頁。"
    }
  },
  {
    "id": 15,
    "name": "鮮盛食堂",
    "cuisine": "台式",
    "meals": ["lunch","dinner"],
    "price_range": "cheap",
    "location": "神農路",
    "note": "自助餐/便當",
    "phone": "05-2720321",
    "openHours": {"mon":null,"tue":null,"wed":null,"thu":null,"fri":null,"sat":null,"sun":null},
    "legacyOpenHours": {"mon":"11:00-21:00","tue":"11:00-21:00","wed":"11:00-21:00","thu":"11:00-21:00","fri":"11:00-21:00","sat":"休息","sun":"11:00-21:00"},
    "hoursNote": "Bing地圖列05-2720321，門牌129-1與Tea's衝突未採用。Dcard 2025-08、Facebook 2026仍提及。不恢復時刻表。",
    "verification": {
      "status": "unconfirmed",
      "checkedAt": "2026-09-15",
      "note": "電話取自聚合地圖；門牌與Tea's 129-1衝突，未寫入地址。"
    }
  },
  {
    "id": 16,
    "name": "丼飽處x味自慢",
    "cuisine": "日式",
    "meals": ["lunch","dinner"],
    "price_range": "medium",
    "location": "神農路",
    "note": "丼飯/日式料理",
    "phone": "05-2723085",
    "openHours": {"mon":"11:30-13:30、17:00-21:00","tue":"11:30-13:30、17:00-21:00","wed":"11:30-13:30、17:00-21:00","thu":"11:30-13:30、17:00-21:00","fri":"11:30-13:30、17:00-21:00","sat":"11:30-13:30、17:00-21:00","sun":"休息"},
    "legacyOpenHours": {"mon":"11:30-13:30、17:00-20:30","tue":"11:30-13:30、17:00-20:30","wed":"11:30-13:30、17:00-20:30","thu":"11:30-13:30、17:00-20:30","fri":"11:30-13:30、17:00-20:30","sat":"11:30-13:30、17:00-20:30","sun":"休息"},
    "verification": {
      "status": "sourced",
      "checkedAt": "2026-09-10",
      "source": "https://dongbaochu.webflow.io/",
      "label": "丼飽處店家網站",
      "fields": "名稱、每週營業時間",
      "note": "依公開頁面列載；查閱日期不代表店家更新日期，出發前請確認臨時異動。"
    }
  },
  {
    "id": 17,
    "name": "牛筋伯爵",
    "cuisine": "台式",
    "meals": ["lunch","dinner"],
    "price_range": "cheap",
    "location": "神農路",
    "note": "中式麵食/牛肉麵/水餃",
    "address": "嘉義縣民雄鄉神農路73號",
    "phone": "05-2723039",
    "openHours": {"mon":null,"tue":null,"wed":null,"thu":null,"fri":null,"sat":null,"sun":null},
    "legacyOpenHours": {"mon":"休息","tue":"11:00-13:30、17:00-21:00","wed":"11:00-13:30、17:00-21:00","thu":"11:00-13:30、17:00-21:00","fri":"11:00-13:30、17:00-21:00","sat":"11:00-13:30、17:00-21:00","sun":"11:00-13:30、17:00-21:00"},
    "hoursNote": "Bing地圖列神農路73號、05-2723039；不恢復聚合時段。",
    "verification": {
      "status": "unconfirmed",
      "checkedAt": "2026-09-15",
      "note": "地址電話取自聚合地圖，不是店家頁。"
    }
  },
  {
    "id": 18,
    "name": "ㄎㄎ韓食",
    "cuisine": "韓式",
    "meals": ["lunch","dinner"],
    "price_range": "medium",
    "location": "神農路",
    "note": "豆腐鍋/韓食",
    "address": "嘉義縣民雄鄉神農路71號",
    "phone": "05-2722729",
    "openHours": {"mon":null,"tue":null,"wed":null,"thu":null,"fri":null,"sat":null,"sun":null},
    "legacyOpenHours": {"mon":"11:00-14:00、17:00-20:00","tue":"11:00-14:00、17:00-20:00","wed":"11:00-14:00、17:00-20:00","thu":"11:00-14:00、17:00-20:00","fri":"休息","sat":"休息","sun":"11:00-14:00、17:00-20:00"},
    "hoursNote": "Bing地圖與Uber列神農路71號、05-2722729；外送時段不作現場週表。",
    "verification": {
      "status": "unconfirmed",
      "checkedAt": "2026-09-15",
      "note": "地址電話取自聚合地圖／外送頁，不是店家頁。"
    }
  },
  {
    "id": 19,
    "name": "洪媽媽泰式簡餐",
    "cuisine": "泰式",
    "meals": ["lunch","dinner"],
    "price_range": "medium",
    "location": "神農路",
    "note": "檸檬魚/黑胡椒豬肉",
    "openHours": {"mon":null,"tue":null,"wed":null,"thu":null,"fri":null,"sat":null,"sun":null},
    "legacyOpenHours": {"mon":"11:30-14:00、17:00-20:00","tue":"11:30-14:00、17:00-20:00","wed":"11:30-14:00、17:00-20:00","thu":"11:30-14:00、17:00-20:00","fri":"11:30-14:00、17:00-20:00","sat":"休息","sun":"休息"},
    "verification": {
      "status": "unconfirmed",
      "note": "尚未取得可核對的現行店家資訊；店址、價格與營業情形待確認。"
    }
  },
  {
    "id": 20,
    "name": "西貢小吃",
    "cuisine": "越式",
    "meals": ["dinner"],
    "price_range": "cheap",
    "location": "神農路",
    "note": "河粉/涼拌/生春捲",
    "openHours": {"mon":null,"tue":null,"wed":null,"thu":null,"fri":null,"sat":null,"sun":null},
    "legacyOpenHours": {"mon":"16:30-20:30","tue":"16:30-20:30","wed":"16:30-20:30","thu":"16:30-20:30","fri":"休息","sat":"休息","sun":"16:30-20:30"},
    "verification": {
      "status": "unconfirmed",
      "note": "尚未取得可核對的現行店家資訊；店址、價格與營業情形待確認。"
    }
  },
  {
    "id": 21,
    "name": "薩克廚房",
    "cuisine": "西式",
    "meals": ["lunch","dinner"],
    "price_range": "medium",
    "location": "神農路",
    "note": "義大利麵/排餐/複合式",
    "openHours": {"mon":null,"tue":null,"wed":null,"thu":null,"fri":null,"sat":null,"sun":null},
    "legacyOpenHours": {"mon":"11:30-14:00、17:30-20:00","tue":"11:30-14:00、17:30-20:00","wed":"11:30-14:00、17:30-20:00","thu":"11:30-14:00、17:30-20:00","fri":"休息","sat":"休息","sun":"11:30-14:00、17:30-20:00"},
    "verification": {
      "status": "unconfirmed",
      "note": "尚未取得可核對的現行店家資訊；店址、價格與營業情形待確認。"
    }
  },
  {
    "id": 22,
    "name": "農閒時刻的粥",
    "cuisine": "台式",
    "meals": ["lunch","dinner","latenight"],
    "price_range": "cheap",
    "location": "神農路",
    "note": "粥品/台式料理",
    "openHours": {"mon":null,"tue":null,"wed":null,"thu":null,"fri":null,"sat":null,"sun":null},
    "legacyOpenHours": {"mon":"11:30-14:30、17:00-23:00","tue":"11:30-14:30、17:00-23:00","wed":"11:30-14:30、17:00-23:00","thu":"11:30-14:30、17:00-23:00","fri":"11:30-14:30、17:00-23:00","sat":"17:00-23:00","sun":"17:00-23:00"},
    "verification": {
      "status": "unconfirmed",
      "note": "尚未取得可核對的現行店家資訊；店址、價格與營業情形待確認。"
    }
  },
  {
    "id": 23,
    "name": "豪緯麵食館",
    "cuisine": "台式",
    "meals": ["lunch","dinner"],
    "price_range": "cheap",
    "location": "神農路",
    "note": "石鍋拌麵/涼麵。Facebook列神農二街7號。",
    "address": "嘉義縣民雄鄉神農二街7號",
    "phone": "05-2723636",
    "openHours": {"mon":null,"tue":null,"wed":null,"thu":null,"fri":null,"sat":null,"sun":null},
    "legacyOpenHours": {"mon":"11:00-13:45、17:00-19:45","tue":"11:00-13:45、17:00-19:45","wed":"11:00-13:45、17:00-19:45","thu":"11:00-13:45、17:00-19:45","fri":"11:00-13:45、17:00-19:45","sat":"11:00-13:45","sun":"休息"},
    "hoursNote": "店家Facebook列神農二街7號、05-2723636，2026-06仍有發文；舊食記為神農路129-10。本輪未打開粉絲頁全文，不恢復時刻表。",
    "verification": {
      "status": "unconfirmed",
      "checkedAt": "2026-09-15",
      "note": "地址電話取自搜尋摘錄的店家Facebook；本輪無法開啟完整頁。"
    }
  },
  {
    "id": 24,
    "name": "地中海美食",
    "cuisine": "西式",
    "meals": ["lunch","dinner"],
    "price_range": "medium",
    "location": "神農路",
    "note": "麵食/複合式",
    "openHours": {"mon":null,"tue":null,"wed":null,"thu":null,"fri":null,"sat":null,"sun":null},
    "legacyOpenHours": {"mon":"11:00-13:30、17:00-19:30","tue":"11:00-13:30、17:00-19:30","wed":"11:00-13:30、17:00-19:30","thu":"11:00-13:30、17:00-19:30","fri":"11:00-13:30、17:00-19:30","sat":"休息","sun":"休息"},
    "verification": {
      "status": "unconfirmed",
      "note": "尚未取得可核對的現行店家資訊；店址、價格與營業情形待確認。"
    }
  },
  {
    "id": 25,
    "name": "中正海南雞飯",
    "cuisine": "亞洲",
    "meals": ["lunch","dinner"],
    "price_range": "medium",
    "location": "神農路",
    "note": "海南雞飯/亞洲料理",
    "openHours": {"mon":null,"tue":null,"wed":null,"thu":null,"fri":null,"sat":null,"sun":null},
    "legacyOpenHours": {"mon":"11:30-13:30、17:00-19:00","tue":"11:30-13:30、17:00-19:00","wed":"11:30-13:30、17:00-19:00","thu":"11:30-13:30、17:00-19:00","fri":"11:30-13:30、17:00-19:00","sat":"休息","sun":"休息"},
    "verification": {
      "status": "unconfirmed",
      "note": "尚未取得可核對的現行店家資訊；店址、價格與營業情形待確認。"
    }
  },
  {
    "id": 26,
    "name": "榕樹下古早味香菇肉羹麵",
    "cuisine": "台式",
    "meals": ["lunch","dinner"],
    "price_range": "cheap",
    "location": "神農路",
    "note": "香菇肉羹麵/羹麵/小吃",
    "openHours": {"mon":null,"tue":null,"wed":null,"thu":null,"fri":null,"sat":null,"sun":null},
    "legacyOpenHours": {"mon":"11:00-13:30、16:00-20:00","tue":"11:00-13:30、16:00-20:00","wed":"11:00-13:30、16:00-20:00","thu":"11:00-13:30、16:00-20:00","fri":"休息","sat":"11:00-13:30、16:00-20:00","sun":"11:00-13:30、16:00-20:00"},
    "verification": {
      "status": "unconfirmed",
      "note": "尚未取得可核對的現行店家資訊；店址、價格與營業情形待確認。"
    }
  },
  {
    "id": 27,
    "name": "Amina's Kitchen",
    "cuisine": "清真",
    "meals": ["dinner","latenight"],
    "price_range": "medium",
    "location": "神農路",
    "note": "清真料理/Halal Food",
    "openHours": {"mon":null,"tue":null,"wed":null,"thu":null,"fri":null,"sat":null,"sun":null},
    "legacyOpenHours": {"mon":"17:30-22:30","tue":"17:30-22:30","wed":"17:30-22:30","thu":"17:30-22:30","fri":"休息","sat":"休息","sun":"17:30-22:30"},
    "verification": {
      "status": "unconfirmed",
      "note": "尚未取得可核對的現行店家資訊；店址、價格與營業情形待確認。"
    }
  },
  {
    "id": 28,
    "name": "越式炒泡麵",
    "cuisine": "越式",
    "meals": ["dinner","latenight"],
    "price_range": "cheap",
    "location": "神農路",
    "note": "炒泡麵/河粉",
    "openHours": {"mon":null,"tue":null,"wed":null,"thu":null,"fri":null,"sat":null,"sun":null},
    "legacyOpenHours": {"mon":"17:00-23:00","tue":"17:00-23:00","wed":"17:00-23:00","thu":"17:00-23:00","fri":"休息","sat":"休息","sun":"17:00-23:00"},
    "verification": {
      "status": "unconfirmed",
      "note": "尚未取得可核對的現行店家資訊；店址、價格與營業情形待確認。"
    }
  },
  {
    "id": 29,
    "name": "蘭姐手工水餃",
    "cuisine": "台式",
    "meals": ["lunch","dinner","latenight"],
    "price_range": "cheap",
    "location": "神農路",
    "note": "手工水餃",
    "openHours": {"mon":null,"tue":null,"wed":null,"thu":null,"fri":null,"sat":null,"sun":null},
    "legacyOpenHours": {"mon":"11:00-14:00、16:30-22:00","tue":"11:00-14:00、16:30-22:00","wed":"11:00-14:00、16:30-22:00","thu":"11:00-14:00、16:30-22:00","fri":"11:00-14:00、16:30-22:00","sat":"休息","sun":"11:00-14:00、16:30-22:00"},
    "verification": {
      "status": "unconfirmed",
      "note": "尚未取得可核對的現行店家資訊；店址、價格與營業情形待確認。"
    }
  },
  {
    "id": 30,
    "name": "嘉農小館",
    "cuisine": "台式",
    "meals": ["lunch","dinner"],
    "price_range": "cheap",
    "location": "神農路",
    "note": "台式家常菜/合菜",
    "openHours": {"mon":null,"tue":null,"wed":null,"thu":null,"fri":null,"sat":null,"sun":null},
    "legacyOpenHours": {"mon":"11:00-14:00、17:00-20:00","tue":"11:00-14:00、17:00-20:00","wed":"11:00-14:00、17:00-20:00","thu":"11:00-14:00、17:00-20:00","fri":"11:00-14:00、17:00-20:00","sat":"休息","sun":"11:00-14:00、17:00-20:00"},
    "verification": {
      "status": "unconfirmed",
      "note": "尚未取得可核對的現行店家資訊；店址、價格與營業情形待確認。"
    }
  },
  {
    "id": 31,
    "name": "阿梅簡餐便當",
    "cuisine": "台式",
    "meals": ["lunch","dinner"],
    "price_range": "cheap",
    "location": "神農路",
    "note": "便當/簡餐",
    "openHours": {"mon":null,"tue":null,"wed":null,"thu":null,"fri":null,"sat":null,"sun":null},
    "legacyOpenHours": {"mon":"11:00-14:00、16:30-20:00","tue":"11:00-14:00、16:30-20:00","wed":"11:00-14:00、16:30-20:00","thu":"11:00-14:00、16:30-20:00","fri":"11:00-14:00、16:30-20:00","sat":"11:00-14:00、16:30-20:00","sun":"休息"},
    "verification": {
      "status": "unconfirmed",
      "note": "尚未取得可核對的現行店家資訊；店址、價格與營業情形待確認。"
    }
  },
  {
    "id": 32,
    "name": "渝香園簡餐便當",
    "cuisine": "台式",
    "meals": ["lunch","dinner"],
    "price_range": "cheap",
    "location": "神農路",
    "note": "自助餐/便當",
    "openHours": {"mon":null,"tue":null,"wed":null,"thu":null,"fri":null,"sat":null,"sun":null},
    "legacyOpenHours": {"mon":"11:00-14:00、16:30-20:00","tue":"11:00-14:00、16:30-20:00","wed":"11:00-14:00、16:30-20:00","thu":"11:00-14:00、16:30-20:00","fri":"11:00-14:00、16:30-20:00","sat":"11:00-14:00、16:30-20:00","sun":"休息"},
    "verification": {
      "status": "unconfirmed",
      "note": "尚未取得可核對的現行店家資訊；店址、價格與營業情形待確認。"
    }
  },
  {
    "id": 33,
    "name": "二口食堂",
    "cuisine": "台式",
    "meals": ["dinner","latenight"],
    "price_range": "cheap",
    "location": "神農路",
    "note": "便當/自助餐",
    "openHours": {"mon":null,"tue":null,"wed":null,"thu":null,"fri":null,"sat":null,"sun":null},
    "legacyOpenHours": {"mon":"17:00-21:30","tue":"17:00-21:30","wed":"17:00-21:30","thu":"17:00-21:30","fri":"17:00-21:30","sat":"17:00-21:30","sun":"17:00-21:30"},
    "verification": {
      "status": "unconfirmed",
      "note": "尚未取得可核對的現行店家資訊；店址、價格與營業情形待確認。"
    }
  },
  {
    "id": 34,
    "name": "豪記滷味",
    "cuisine": "台式",
    "meals": ["dinner","latenight"],
    "price_range": "cheap",
    "location": "神農路",
    "note": "滷味",
    "openHours": {"mon":null,"tue":null,"wed":null,"thu":null,"fri":null,"sat":null,"sun":null},
    "legacyOpenHours": {"mon":"17:00-23:30","tue":"17:00-23:30","wed":"17:00-23:30","thu":"17:00-23:30","fri":"17:00-23:30","sat":"休息","sun":"休息"},
    "verification": {
      "status": "unconfirmed",
      "note": "尚未取得可核對的現行店家資訊；店址、價格與營業情形待確認。"
    }
  },
  {
    "id": 35,
    "name": "溫家冷滷味",
    "cuisine": "台式",
    "meals": ["dinner","latenight"],
    "price_range": "cheap",
    "location": "神農路",
    "note": "冷滷味",
    "openHours": {"mon":null,"tue":null,"wed":null,"thu":null,"fri":null,"sat":null,"sun":null},
    "legacyOpenHours": {"mon":"17:30-23:00","tue":"17:30-23:00","wed":"17:30-23:00","thu":"17:30-23:00","fri":"休息","sat":"休息","sun":"17:30-23:00"},
    "verification": {
      "status": "unconfirmed",
      "note": "尚未取得可核對的現行店家資訊；店址、價格與營業情形待確認。"
    }
  },
  {
    "id": 36,
    "name": "魯都香加熱式滷味",
    "cuisine": "台式",
    "meals": ["dinner","latenight"],
    "price_range": "cheap",
    "location": "神農路",
    "note": "加熱式滷味",
    "openHours": {"mon":null,"tue":null,"wed":null,"thu":null,"fri":null,"sat":null,"sun":null},
    "legacyOpenHours": {"mon":"16:00-23:30","tue":"16:00-23:30","wed":"16:00-23:30","thu":"16:00-23:30","fri":"休息","sat":"休息","sun":"16:00-23:30"},
    "verification": {
      "status": "unconfirmed",
      "note": "尚未取得可核對的現行店家資訊；店址、價格與營業情形待確認。"
    }
  },
  {
    "id": 37,
    "name": "十畝田滷味",
    "cuisine": "台式",
    "meals": ["lunch","dinner"],
    "price_range": "cheap",
    "location": "神農路",
    "note": "滷味",
    "openHours": {"mon":null,"tue":null,"wed":null,"thu":null,"fri":null,"sat":null,"sun":null},
    "legacyOpenHours": {"mon":"11:00-20:00","tue":"11:00-20:00","wed":"11:00-20:00","thu":"11:00-20:00","fri":"休息","sat":"休息","sun":"11:00-20:00"},
    "verification": {
      "status": "unconfirmed",
      "note": "尚未取得可核對的現行店家資訊；店址、價格與營業情形待確認。"
    }
  },
  {
    "id": 38,
    "name": "財哥鹹酥雞(神農路)",
    "cuisine": "速食",
    "meals": ["dinner","latenight"],
    "price_range": "cheap",
    "location": "神農路",
    "note": "炸物/鹹酥雞",
    "openHours": {"mon":null,"tue":null,"wed":null,"thu":null,"fri":null,"sat":null,"sun":null},
    "legacyOpenHours": {"mon":"休息","tue":"18:00-02:00","wed":"18:00-02:00","thu":"18:00-02:00","fri":"18:00-02:00","sat":"18:00-02:00","sun":"18:00-02:00"},
    "verification": {
      "status": "unconfirmed",
      "note": "尚未取得可核對的現行店家資訊；店址、價格與營業情形待確認。"
    }
  },
  {
    "id": 39,
    "name": "中正雞場",
    "cuisine": "速食",
    "meals": ["dinner","latenight"],
    "price_range": "cheap",
    "location": "神農路",
    "note": "鹹酥雞/炸物",
    "openHours": {"mon":null,"tue":null,"wed":null,"thu":null,"fri":null,"sat":null,"sun":null},
    "legacyOpenHours": {"mon":"休息","tue":"18:00-02:00","wed":"18:00-02:00","thu":"18:00-02:00","fri":"18:00-02:00","sat":"18:00-02:00","sun":"休息"},
    "verification": {
      "status": "unconfirmed",
      "note": "尚未取得可核對的現行店家資訊；店址、價格與營業情形待確認。"
    }
  },
  {
    "id": 40,
    "name": "海派鹽酥雞",
    "cuisine": "速食",
    "meals": ["dinner","latenight"],
    "price_range": "cheap",
    "location": "神農路",
    "note": "鹽酥雞/炸物",
    "openHours": {"mon":null,"tue":null,"wed":null,"thu":null,"fri":null,"sat":null,"sun":null},
    "legacyOpenHours": {"mon":"18:00-02:00","tue":"18:00-02:00","wed":"18:00-02:00","thu":"18:00-02:00","fri":"18:00-02:00","sat":"18:00-02:00","sun":"18:00-02:00"},
    "verification": {
      "status": "unconfirmed",
      "note": "尚未取得可核對的現行店家資訊；店址、價格與營業情形待確認。"
    }
  },
  {
    "id": 41,
    "name": "蜂炸雞超級大雞排",
    "cuisine": "速食",
    "meals": ["dinner","latenight"],
    "price_range": "cheap",
    "location": "神農路",
    "note": "超級大雞排",
    "openHours": {"mon":null,"tue":null,"wed":null,"thu":null,"fri":null,"sat":null,"sun":null},
    "legacyOpenHours": {"mon":"16:30-01:30","tue":"16:30-01:30","wed":"16:30-01:30","thu":"16:30-01:30","fri":"16:30-01:30","sat":"休息","sun":"16:30-01:30"},
    "verification": {
      "status": "unconfirmed",
      "note": "尚未取得可核對的現行店家資訊；店址、價格與營業情形待確認。"
    }
  },
  {
    "id": 42,
    "name": "懷念鹽酥雞",
    "cuisine": "速食",
    "meals": ["dinner","latenight"],
    "price_range": "cheap",
    "location": "神農路",
    "note": "鹽酥雞/炸物",
    "openHours": {"mon":null,"tue":null,"wed":null,"thu":null,"fri":null,"sat":null,"sun":null},
    "legacyOpenHours": {"mon":"17:00-02:00","tue":"17:00-02:00","wed":"17:00-02:00","thu":"17:00-02:00","fri":"休息","sat":"休息","sun":"17:00-02:00"},
    "verification": {
      "status": "unconfirmed",
      "note": "尚未取得可核對的現行店家資訊；店址、價格與營業情形待確認。"
    }
  },
  {
    "id": 43,
    "name": "墨醬章魚燒",
    "cuisine": "速食",
    "meals": ["dinner","latenight"],
    "price_range": "cheap",
    "location": "神農路",
    "note": "章魚燒/小吃",
    "openHours": {"mon":null,"tue":null,"wed":null,"thu":null,"fri":null,"sat":null,"sun":null},
    "legacyOpenHours": {"mon":"16:00-23:00","tue":"16:00-23:00","wed":"16:00-23:00","thu":"16:00-23:00","fri":"16:00-23:00","sat":"休息","sun":"16:00-23:00"},
    "verification": {
      "status": "unconfirmed",
      "note": "尚未取得可核對的現行店家資訊；店址、價格與營業情形待確認。"
    }
  },
  {
    "id": 44,
    "name": "Tea's原味(中正大學店)",
    "cuisine": "飲料",
    "meals": ["lunch","dinner"],
    "price_range": "cheap",
    "location": "神農路",
    "note": "茶飲。",
    "address": "嘉義縣民雄鄉神農路129-1號",
    "phone": "05-2722236",
    "openHours": {"mon":null,"tue":null,"wed":null,"thu":null,"fri":null,"sat":null,"sun":null},
    "legacyOpenHours": {"mon":"10:00-21:00","tue":"10:00-21:00","wed":"10:00-21:00","thu":"10:00-21:00","fri":"10:00-21:00","sat":"10:00-21:00","sun":"10:00-21:00"},
    "hoursNote": "品牌官網未列每週營業時段。",
    "verification": {
      "status": "sourced",
      "checkedAt": "2026-09-15",
      "source": "https://www.teas.com.tw/store.php?class_id=3&p=4",
      "label": "TEA'S原味品牌門市頁",
      "fields": "名稱、地址、電話",
      "note": "依公開頁面列載；查閱日期不代表店家更新日期，出發前請確認臨時異動。"
    }
  },
  {
    "id": 45,
    "name": "鮮茶道(中正大學店)",
    "cuisine": "飲料",
    "meals": ["lunch","dinner"],
    "price_range": "cheap",
    "location": "神農路",
    "note": "茶飲。民雄另有東榮、吳鳳、工業區店，不可混用。",
    "address": "嘉義縣民雄鄉三興村神農路129之3號",
    "phone": "05-2720970",
    "openHours": {"mon":null,"tue":null,"wed":null,"thu":null,"fri":null,"sat":null,"sun":null},
    "legacyOpenHours": {"mon":"10:30-21:00","tue":"10:30-21:00","wed":"10:30-21:00","thu":"10:30-21:00","fri":"10:30-21:00","sat":"10:30-21:00","sun":"10:30-21:00"},
    "hoursNote": "SipSpot與店家Facebook摘錄列每日10:30–21:00；不是品牌官網，不恢復即時營業判斷。",
    "verification": {
      "status": "unconfirmed",
      "checkedAt": "2026-09-15",
      "note": "地址電話與SipSpot中正大學店一致（神農路129之3號、05-2720970）；品牌官網無法讀取。"
    }
  },
  {
    "id": 46,
    "name": "七里香",
    "cuisine": "速食",
    "meals": ["dinner","latenight"],
    "price_range": "cheap",
    "location": "神農路",
    "note": "鹹酥雞/炸物",
    "openHours": {"mon":null,"tue":null,"wed":null,"thu":null,"fri":null,"sat":null,"sun":null},
    "legacyOpenHours": {"mon":"17:00-02:00","tue":"17:00-02:00","wed":"17:00-02:00","thu":"17:00-02:00","fri":"17:00-02:00","sat":"17:00-02:00","sun":"17:00-00:00"},
    "verification": {
      "status": "unconfirmed",
      "note": "尚未取得可核對的現行店家資訊；店址、價格與營業情形待確認。"
    }
  },
  {
    "id": 47,
    "name": "果真現打真果汁",
    "cuisine": "飲料",
    "meals": ["dinner","latenight"],
    "price_range": "cheap",
    "location": "神農路",
    "note": "鮮打果汁",
    "openHours": {"mon":null,"tue":null,"wed":null,"thu":null,"fri":null,"sat":null,"sun":null},
    "legacyOpenHours": {"mon":"17:00-01:00","tue":"17:00-01:00","wed":"17:00-01:00","thu":"17:00-01:00","fri":"17:00-00:00","sat":"17:00-00:00","sun":"17:00-00:00"},
    "verification": {
      "status": "unconfirmed",
      "note": "尚未取得可核對的現行店家資訊；店址、價格與營業情形待確認。"
    }
  },
  {
    "id": 48,
    "name": "茶湯會(民雄神農店)",
    "cuisine": "飲料",
    "meals": ["lunch","dinner"],
    "price_range": "cheap",
    "location": "神農路",
    "note": "輕食限定店。",
    "address": "嘉義縣民雄鄉神農二街9號",
    "phone": "05-2723564",
    "openHours": {"mon":null,"tue":null,"wed":null,"thu":null,"fri":null,"sat":null,"sun":null},
    "legacyOpenHours": {"mon":"11:00-21:00","tue":"11:00-21:00","wed":"11:00-21:00","thu":"11:00-21:00","fri":"11:00-21:00","sat":"11:00-21:00","sun":"11:00-21:00"},
    "hoursNote": "品牌門市頁未列每週時段。SipSpot 與 foodpanda 時段不一致（後者列每日11:00–20:30），不恢復即時營業判斷。",
    "verification": {
      "status": "sourced",
      "checkedAt": "2026-09-15",
      "source": "https://tw.tp-tea.com/store/?index_m_id=1&city=%E5%98%89%E7%BE%A9%E7%B8%A3&town=%E6%B0%91%E9%9B%84%E9%84%89",
      "label": "茶湯會品牌門市頁",
      "fields": "名稱、地址、電話",
      "note": "依公開頁面列載；查閱日期不代表店家更新日期，出發前請確認臨時異動。"
    }
  },
  {
    "id": 49,
    "name": "巧味果汁",
    "cuisine": "飲料",
    "meals": ["dinner"],
    "price_range": "cheap",
    "location": "神農路",
    "note": "果汁/飲料",
    "address": "嘉義縣民雄鄉神農路148-3號",
    "openHours": {"mon":null,"tue":null,"wed":null,"thu":null,"fri":null,"sat":null,"sun":null},
    "legacyOpenHours": {"mon":"16:00-22:00","tue":"16:00-22:00","wed":"16:00-22:00","thu":"16:00-22:00","fri":"16:00-22:00","sat":"16:00-22:00","sun":"16:00-22:00"},
    "hoursNote": "Bing地圖列神農路148-3；不恢復聚合時段。",
    "verification": {
      "status": "unconfirmed",
      "checkedAt": "2026-09-15",
      "note": "地址取自聚合地圖，不是店家頁。"
    }
  },
  {
    "id": 50,
    "name": "艾絲ice tea",
    "cuisine": "飲料",
    "meals": ["lunch","dinner"],
    "price_range": "cheap",
    "location": "神農路",
    "note": "飲料/茶飲",
    "openHours": {"mon":null,"tue":null,"wed":null,"thu":null,"fri":null,"sat":null,"sun":null},
    "legacyOpenHours": {"mon":"11:00-15:00、16:00-21:00","tue":"11:00-15:00、16:00-21:00","wed":"11:00-15:00、16:00-21:00","thu":"11:00-15:00、16:00-21:00","fri":"11:00-15:00、16:00-21:00","sat":"休息","sun":"11:00-15:00、16:00-21:00"},
    "verification": {
      "status": "unconfirmed",
      "note": "尚未取得可核對的現行店家資訊；店址、價格與營業情形待確認。"
    }
  },
  {
    "id": 51,
    "name": "Ink Hall 隱客廳",
    "cuisine": "咖啡",
    "meals": ["lunch","dinner","latenight"],
    "price_range": "medium",
    "location": "神農路",
    "note": "咖啡/輕食",
    "openHours": {"mon":"11:00-24:00","tue":"11:00-24:00","wed":"11:00-24:00","thu":"11:00-24:00","fri":"11:00-24:00","sat":"11:00-24:00","sun":"11:00-24:00"},
    "legacyOpenHours": {"mon":"11:00-00:00","tue":"11:00-00:00","wed":"11:00-00:00","thu":"11:00-00:00","fri":"11:00-00:00","sat":"11:00-00:00","sun":"11:00-00:00"},
    "verification": {
      "status": "sourced",
      "checkedAt": "2026-09-10",
      "source": "https://inkhallweb.wixsite.com/ink-hall",
      "label": "隱客廳店家網站",
      "fields": "名稱、位置、每週營業時間",
      "note": "依公開頁面列載；查閱日期不代表店家更新日期，出發前請確認臨時異動。"
    },
    "address": "嘉義縣民雄鄉神農一街20號",
    "hoursNote": "店家網站列每日營業，臨時公休於粉專公告。"
  },
  {
    "id": 52,
    "name": "月亮與貓",
    "cuisine": "甜點",
    "meals": ["lunch","dinner","latenight"],
    "price_range": "medium",
    "location": "神農路",
    "note": "甜點/手作坊",
    "openHours": {"mon":null,"tue":null,"wed":null,"thu":null,"fri":null,"sat":null,"sun":null},
    "legacyOpenHours": {"mon":null,"tue":null,"wed":null,"thu":null,"fri":null,"sat":null,"sun":null},
    "verification": {
      "status": "unconfirmed",
      "note": "尚未取得可核對的現行店家資訊；店址、價格與營業情形待確認。"
    }
  },
  {
    "id": 53,
    "name": "九九義式冰淇淋",
    "cuisine": "甜點",
    "meals": ["lunch","dinner"],
    "price_range": "cheap",
    "location": "神農路",
    "note": "義式冰淇淋",
    "openHours": {"mon":null,"tue":null,"wed":null,"thu":null,"fri":null,"sat":null,"sun":null},
    "legacyOpenHours": {"mon":"12:00-20:00","tue":"12:00-20:00","wed":"12:00-20:00","thu":"12:00-20:00","fri":"休息","sat":"12:00-20:00","sun":"12:00-20:00"},
    "verification": {
      "status": "unconfirmed",
      "note": "尚未取得可核對的現行店家資訊；店址、價格與營業情形待確認。"
    }
  },
  {
    "id": 54,
    "name": "SmileJoyce微微笑手作坊",
    "cuisine": "甜點",
    "meals": ["dinner"],
    "price_range": "cheap",
    "location": "神農路",
    "note": "甜點/手作",
    "openHours": {"mon":null,"tue":null,"wed":null,"thu":null,"fri":null,"sat":null,"sun":null},
    "legacyOpenHours": {"mon":"18:00-21:00","tue":"18:00-21:00","wed":"18:00-21:00","thu":"18:00-21:00","fri":"18:00-21:00","sat":"休息","sun":"休息"},
    "verification": {
      "status": "unconfirmed",
      "note": "尚未取得可核對的現行店家資訊；店址、價格與營業情形待確認。"
    }
  },
  {
    "id": 55,
    "name": "仙草奶酪",
    "cuisine": "甜點",
    "meals": ["lunch","dinner","latenight"],
    "price_range": "cheap",
    "location": "神農路",
    "note": "仙草奶酪/紅豆湯圓",
    "openHours": {"mon":null,"tue":null,"wed":null,"thu":null,"fri":null,"sat":null,"sun":null},
    "legacyOpenHours": {"mon":null,"tue":null,"wed":null,"thu":null,"fri":null,"sat":null,"sun":null},
    "verification": {
      "status": "unconfirmed",
      "note": "尚未取得可核對的現行店家資訊；店址、價格與營業情形待確認。"
    }
  },
  {
    "id": 56,
    "name": "伊卓島",
    "cuisine": "台式",
    "meals": ["lunch","dinner"],
    "price_range": "cheap",
    "location": "神農路",
    "note": "簡餐/便當",
    "openHours": {"mon":null,"tue":null,"wed":null,"thu":null,"fri":null,"sat":null,"sun":null},
    "legacyOpenHours": {"mon":"11:00-14:00、17:00-20:30","tue":"11:00-14:00、17:00-20:30","wed":"11:00-14:00、17:00-20:30","thu":"11:00-14:00、17:00-20:30","fri":"11:00-14:00、17:00-20:30","sat":"休息","sun":"休息"},
    "verification": {
      "status": "unconfirmed",
      "note": "尚未取得可核對的現行店家資訊；店址、價格與營業情形待確認。"
    }
  },
  {
    "id": 57,
    "name": "花漾廚房",
    "cuisine": "台式",
    "meals": ["lunch","dinner"],
    "price_range": "cheap",
    "location": "神農路",
    "note": "簡餐/便當",
    "openHours": {"mon":null,"tue":null,"wed":null,"thu":null,"fri":null,"sat":null,"sun":null},
    "legacyOpenHours": {"mon":"12:00-14:30、17:00-20:00","tue":"12:00-14:30、17:00-20:00","wed":"12:00-14:30、17:00-20:00","thu":"12:00-14:30、17:00-20:00","fri":"12:00-14:30、17:00-20:00","sat":"12:00-14:30、17:00-20:00","sun":"休息"},
    "verification": {
      "status": "unconfirmed",
      "note": "尚未取得可核對的現行店家資訊；店址、價格與營業情形待確認。"
    }
  },
  {
    "id": 58,
    "name": "早叄早午餐",
    "cuisine": "西式",
    "meals": ["breakfast","lunch"],
    "price_range": "medium",
    "location": "神農路",
    "note": "河粉蛋餅/早午餐盤",
    "address": "嘉義縣民雄鄉三興村神農路91號",
    "phone": "05-2720155",
    "openHours": {"mon":null,"tue":null,"wed":null,"thu":null,"fri":null,"sat":null,"sun":null},
    "legacyOpenHours": {"mon":"08:00-14:30","tue":"08:00-14:30","wed":"08:00-14:30","thu":"08:00-14:30","fri":"08:00-14:30","sat":"08:00-14:30","sun":"08:00-14:30"},
    "hoursNote": "店家IG列08:00–14:30，未列每週營業日；9月公休7、10、14、15、24、25。",
    "specialHours": {
      "2026-09-07": "休息",
      "2026-09-10": "休息",
      "2026-09-14": "休息",
      "2026-09-15": "休息",
      "2026-09-24": "休息",
      "2026-09-25": "休息"
    },
    "specialHoursSource": "https://www.instagram.com/zao__san/",
    "verification": {
      "status": "sourced",
      "checkedAt": "2026-09-15",
      "source": "https://www.facebook.com/people/%E6%97%A9%E5%8F%84-%E6%97%A9%E5%8D%88%E9%A4%90/61566301978733/",
      "label": "早叄店家Facebook",
      "fields": "名稱、地址、電話",
      "note": "時段與9月公休見店家IG；查閱日期不代表店家更新日期，出發前請確認臨時異動。"
    }
  },
  {
    "id": 59,
    "name": "豪豪吃早餐",
    "cuisine": "台式",
    "meals": ["breakfast","lunch"],
    "price_range": "cheap",
    "location": "神農路",
    "note": "鐵板麵/蛋餅/燒肉",
    "openHours": {"mon":null,"tue":null,"wed":null,"thu":null,"fri":null,"sat":null,"sun":null},
    "legacyOpenHours": {"mon":"07:30-13:30","tue":"07:30-13:30","wed":"07:30-13:30","thu":"07:30-13:30","fri":"07:30-13:30","sat":"08:00-13:30","sun":"08:00-13:30"},
    "hoursNote": "Threads @howhow_eat 2026-08仍發「在中正開店」；無門牌。不可與早餐好樂混淆。",
    "verification": {
      "status": "unconfirmed",
      "checkedAt": "2026-09-15",
      "note": "近期社群顯示仍在中正營業，沒有可核對的地址或週表。"
    }
  },
  {
    "id": 60,
    "name": "翅炸鍋",
    "cuisine": "速食",
    "meals": ["dinner","latenight"],
    "price_range": "cheap",
    "location": "神農路",
    "note": "碳烤雞排/酥炸雞排/炸雞翅",
    "openHours": {"mon":null,"tue":null,"wed":null,"thu":null,"fri":null,"sat":null,"sun":null},
    "legacyOpenHours": {"mon":"16:00-21:30","tue":"16:00-21:30","wed":"16:00-21:30","thu":"16:00-21:30","fri":"16:00-21:30","sat":"16:00-21:30","sun":"休息"},
    "verification": {
      "status": "unconfirmed",
      "note": "尚未取得可核對的現行店家資訊；店址、價格與營業情形待確認。"
    }
  },
  {
    "id": 61,
    "name": "阿湯哥脆皮湯包",
    "cuisine": "台式",
    "meals": ["dinner","latenight"],
    "price_range": "cheap",
    "location": "神農路",
    "note": "湯包。歷史線索列神農路148附1號。",
    "openHours": {"mon":null,"tue":null,"wed":null,"thu":null,"fri":null,"sat":null,"sun":null},
    "legacyOpenHours": {"mon":"17:00-01:00","tue":"17:00-01:00","wed":"17:00-01:00","thu":"17:00-01:00","fri":"17:00-01:00","sat":"17:00-01:00","sun":"17:00-01:00"},
    "hoursNote": "2024聚合頁列神農路148附1號、0905-412540、17:00–01:00；不是2026店家公告，不恢復即時營業判斷。",
    "verification": {
      "status": "unconfirmed",
      "checkedAt": "2026-09-10",
      "note": "未取得現行第一手時間表；歷史地址電話僅供核對，不能宣稱已核實。"
    }
  },
  {
    "id": 62,
    "name": "小羚風味小火鍋",
    "cuisine": "火鍋",
    "meals": ["dinner"],
    "price_range": "medium",
    "location": "神農路",
    "note": "小火鍋",
    "openHours": {"mon":"11:00-13:00、17:00-21:30","tue":"11:00-13:00、17:00-21:30","wed":"11:00-13:00、17:00-21:30","thu":"11:00-13:00、17:00-21:30","fri":"17:30-21:30","sat":"17:30-21:30","sun":"17:30-21:30"},
    "legacyOpenHours": {"mon":"17:00-21:30","tue":"17:00-21:30","wed":"17:00-00:00","thu":"17:00-21:30","fri":"17:30-21:30","sat":"17:30-21:00","sun":"17:30-21:00"},
    "verification": {
      "status": "sourced",
      "checkedAt": "2026-09-10",
      "source": "https://somlinlinlin.blogspot.com/",
      "label": "小羚店家介紹頁（文章日期2024年）",
      "fields": "名稱、位置、每週營業時間",
      "note": "依公開頁面列載；查閱日期不代表店家更新日期，出發前請確認臨時異動。"
    },
    "address": "嘉義縣民雄鄉神農一街139號",
    "hoursNote": "午間僅炒飯可內用，火鍋僅外帶；晚間火鍋可內用。"
  },
  {
    "id": 63,
    "name": "意素佳 創意蔬食料理",
    "cuisine": "素食",
    "meals": ["dinner"],
    "price_range": "medium",
    "location": "神農路",
    "note": "素食簡餐、鍋燒與烏龍麵。",
    "address": "嘉義縣民雄鄉神農一街12號之2",
    "openHours": {"mon":null,"tue":null,"wed":null,"thu":null,"fri":null,"sat":null,"sun":null},
    "legacyOpenHours": {"mon":"17:00-22:30","tue":"17:00-22:30","wed":"17:00-22:30","thu":"17:00-22:30","fri":"17:00-22:30","sat":"17:00-22:30","sun":"17:00-22:30"},
    "hoursNote": "Uber Eats 可見時段17:00–21:00，未取得每週完整營業日；外送價不作店內售價，不恢復即時營業判斷。",
    "verification": {
      "status": "unconfirmed",
      "checkedAt": "2026-09-10",
      "note": "平台列址可採用；未取得店家每週時間表，仍待確認。"
    }
  },
  {
    "id": 64,
    "name": "蔬香是家 Veggie House",
    "cuisine": "素食",
    "meals": ["lunch"],
    "price_range": "medium",
    "location": "神農路",
    "note": "素食便當。外送平台現以忙蔬蔬（蔬香是家店）出現。",
    "address": "嘉義縣民雄鄉三興路186號",
    "openHours": {"mon":null,"tue":null,"wed":null,"thu":null,"fri":null,"sat":null,"sun":null},
    "legacyOpenHours": {"mon":"10:30-14:00","tue":"10:30-14:00","wed":"10:30-14:00","thu":"10:30-14:00","fri":"10:30-14:00","sat":"休息","sun":"休息"},
    "hoursNote": "foodpanda 最新列週一至週五10:30–14:00，同頁舊版另列晚間；只作平台線索，現場時段請洽店家。",
    "verification": {
      "status": "unconfirmed",
      "checkedAt": "2026-09-10",
      "note": "可採用平台地址與外送別名；不推斷實體招牌已改名，不恢復即時營業判斷。"
    }
  },
  {
    "id": 65,
    "name": "全方味便當",
    "cuisine": "台式",
    "meals": ["dinner"],
    "price_range": "cheap",
    "location": "神農路",
    "note": "便當、咖哩、炒泡麵。",
    "address": "嘉義縣民雄鄉三興村公園一街40號",
    "phone": "0928-226695",
    "openHours": {"mon":null,"tue":null,"wed":null,"thu":null,"fri":null,"sat":null,"sun":null},
    "legacyOpenHours": {"mon":"16:00-21:00","tue":"16:00-21:00","wed":"16:00-21:00","thu":"16:00-21:00","fri":"16:00-21:00","sat":"16:00-21:00","sun":"16:00-21:00"},
    "hoursNote": "店家2025-11-19宣傳列週二至日16:00–21:00；本輪未取得更晚公告，不恢復即時營業判斷。",
    "verification": {
      "status": "unconfirmed",
      "checkedAt": "2026-09-10",
      "note": "地址電話取自店家Dcard宣傳；不能說2026年9月新開，也不能當現行核實。"
    }
  },
  {
    "id": 66,
    "name": "三街亭便當",
    "cuisine": "台式",
    "meals": ["lunch","dinner"],
    "price_range": "cheap",
    "location": "神農路",
    "note": "便當。平台列大學路二段，與原神農路分類衝突，地點待確認。",
    "openHours": {"mon":null,"tue":null,"wed":null,"thu":null,"fri":null,"sat":null,"sun":null},
    "legacyOpenHours": {"mon":"11:00-14:00、17:00-20:00","tue":"11:00-14:00、17:00-20:00","wed":"11:00-14:00、17:00-20:00","thu":"11:00-14:00、17:00-20:00","fri":"11:00-14:00、17:00-20:00","sat":"11:00-14:00、17:00-20:00","sun":"休息"},
    "hoursNote": "聚合頁列大學路二段2000附3號、05-2060882、週一至六11:00–14:00週日休；無來源更新日，不恢復即時營業判斷。",
    "verification": {
      "status": "unconfirmed",
      "checkedAt": "2026-09-10",
      "note": "平台地址與原神農路分類不符；是否仍營業須 Maps 或電話。"
    }
  },
  {
    "id": 67,
    "name": "泰麻吉",
    "cuisine": "泰式",
    "meals": ["lunch","dinner"],
    "price_range": "medium",
    "location": "神農路",
    "note": "泰式料理。",
    "openHours": {"mon":null,"tue":null,"wed":null,"thu":null,"fri":null,"sat":null,"sun":null},
    "legacyOpenHours": {"mon":"10:00-20:00","tue":"10:00-20:00","wed":"10:00-20:00","thu":"10:00-20:00","fri":"10:00-20:00","sat":"休息","sun":"10:00-20:00"},
    "hoursNote": "2016食記與舊名冊列0976-010850、11:00–20:30；不是現行時間來源，不判定歇業。",
    "verification": {
      "status": "unconfirmed",
      "checkedAt": "2026-09-10",
      "note": "未找到可驗證的現行店家頁；電話線索待人工核對。"
    }
  },
  {
    "id": 68,
    "name": "紅樓極麵（南松食堂）",
    "cuisine": "台式",
    "meals": ["lunch","dinner"],
    "price_range": "cheap",
    "location": "神農路",
    "note": "四川風味麵食，由紅樓麻辣燙轉型。",
    "openHours": {"mon":null,"tue":null,"wed":null,"thu":null,"fri":null,"sat":null,"sun":null},
    "legacyOpenHours": {"mon":"11:00-21:30","tue":"11:00-21:30","wed":"11:00-21:30","thu":"11:00-21:30","fri":"11:00-21:30","sat":"11:00-21:30","sun":"16:00-21:30"},
    "hoursNote": "雇主頁確認店名與菜系，未列地址與客人營業時間；不能用招工證明今天營業。",
    "verification": {
      "status": "unconfirmed",
      "checkedAt": "2026-09-10",
      "note": "正式名可改；現行地址與時段仍待店家或電話。"
    }
  },
  {
    "id": 69,
    "name": "小栗鼠cafe",
    "cuisine": "咖啡",
    "meals": ["breakfast","lunch","dinner"],
    "price_range": "medium",
    "location": "神農路",
    "note": "咖啡、西點。歷史線索列公園路，原神農路分類過粗。",
    "openHours": {"mon":null,"tue":null,"wed":null,"thu":null,"fri":null,"sat":null,"sun":null},
    "legacyOpenHours": {"mon":null,"tue":null,"wed":null,"thu":null,"fri":null,"sat":null,"sun":null},
    "hoursNote": "2024聚合頁列公園路12號1F、05-2724037，無營業時間；未找到自營頁，不能捏造週表。",
    "verification": {
      "status": "unconfirmed",
      "checkedAt": "2026-09-10",
      "note": "地址僅為歷史線索；現行營業情形待確認。"
    }
  },
  {
    "id": 70,
    "name": "Yes厚切雞排",
    "cuisine": "速食",
    "meals": ["lunch","dinner"],
    "price_range": "medium",
    "location": "裕農路",
    "note": "雞排、豬排與海鮮定食，經典炸物。",
    "openHours": {"mon":"12:00-20:30","tue":"12:00-20:30","wed":"12:00-20:30","thu":"12:00-20:30","fri":"12:00-20:30","sat":"休息","sun":"12:00-20:30"},
    "legacyOpenHours": {"mon":"12:00-20:30","tue":"12:00-20:30","wed":"12:00-20:30","thu":"12:00-20:30","fri":"12:00-20:30","sat":"休息","sun":"12:00-20:30"},
    "verification": {
      "status": "sourced",
      "checkedAt": "2026-09-10",
      "source": "https://yeschicken.webflow.io/",
      "label": "Yes厚切雞排店家網站",
      "fields": "名稱、地址、電話、每週營業時間、定食價格",
      "note": "依公開頁面列載；查閱日期不代表店家更新日期，出發前請確認臨時異動。"
    },
    "address": "嘉義縣民雄鄉裕農一街19號",
    "phone": "05-2722202",
    "priceNote": "官網定食128–138元；實際價格以現場為準。"
  },
  {
    "id": 71,
    "name": "i嘎嗶複合式餐廳",
    "cuisine": "台式",
    "meals": ["lunch","dinner"],
    "price_range": "medium",
    "location": "裕農路",
    "note": "複合式料理，亦作愛嘎逼。",
    "address": "嘉義縣民雄鄉裕農一街5號",
    "phone": "05-2723659",
    "openHours": {"mon":null,"tue":null,"wed":null,"thu":null,"fri":null,"sat":null,"sun":null},
    "legacyOpenHours": {"mon":"10:00-20:30","tue":"10:00-20:30","wed":"10:00-20:30","thu":"10:00-20:30","fri":"10:00-20:30","sat":"10:00-20:30","sun":"10:00-20:30"},
    "hoursNote": "聚合頁列每天10:00–20:30，無更新日期或可讀自營頁；時間保持未確認。",
    "verification": {
      "status": "unconfirmed",
      "checkedAt": "2026-09-10",
      "note": "已見地址屬裕農一街，故改區域；不是店家現行公告。"
    }
  },
  {
    "id": 72,
    "name": "瘋Beef排餐料理",
    "cuisine": "西式",
    "meals": ["lunch","dinner"],
    "price_range": "expensive",
    "location": "裕農路",
    "note": "排餐料理。",
    "address": "嘉義縣民雄鄉裕農路185號",
    "phone": "0912-256952",
    "openHours": {"mon":null,"tue":null,"wed":null,"thu":null,"fri":null,"sat":null,"sun":null},
    "legacyOpenHours": {"mon":"休息","tue":"11:00-13:00、17:00-20:00","wed":"11:00-13:00、17:00-20:00","thu":"11:00-13:00、17:00-20:00","fri":"11:00-13:00、17:00-20:00","sat":"11:00-13:30、17:00-20:00","sun":"11:00-13:30、17:00-20:00"},
    "hoursNote": "Uber Eats 列週二至週日11:00–13:00、17:00–20:00，週一空白；僅限外送服務時段，不是現場即時判斷。",
    "verification": {
      "status": "unconfirmed",
      "checkedAt": "2026-09-10",
      "note": "地址電話可採用平台／雇主頁；外送週表不作現場最新營業時間。"
    }
  },
  {
    "id": 73,
    "name": "三米藍",
    "cuisine": "西式",
    "meals": ["lunch","dinner"],
    "price_range": "expensive",
    "location": "裕農路",
    "note": "義式餐廳。",
    "address": "嘉義縣民雄鄉裕農路195號",
    "phone": "05-2721112",
    "openHours": {"mon":null,"tue":null,"wed":null,"thu":null,"fri":null,"sat":null,"sun":null},
    "legacyOpenHours": {"mon":"12:00-20:30","tue":"12:00-20:30","wed":"休息","thu":"12:00-20:30","fri":"12:00-20:30","sat":"12:00-20:30","sun":"12:00-20:30"},
    "hoursNote": "公休日來源衝突（週三休／週三四休）；現行休假表待社群或電話。",
    "verification": {
      "status": "unconfirmed",
      "checkedAt": "2026-09-10",
      "note": "104雇主頁確認地址電話；Facebook本輪無法讀取，不沿用舊公休日。"
    }
  },
  {
    "id": 74,
    "name": "8鍋臭臭鍋（民雄中正店）",
    "cuisine": "火鍋",
    "meals": ["lunch","dinner"],
    "price_range": "medium",
    "location": "裕農路",
    "note": "火鍋。",
    "address": "嘉義縣民雄鄉三興村裕農路183號",
    "openHours": {"mon":null,"tue":null,"wed":null,"thu":null,"fri":null,"sat":null,"sun":null},
    "legacyOpenHours": {"mon":"休息","tue":"11:00-14:30、17:00-22:30","wed":"11:00-14:30、17:00-22:30","thu":"11:00-14:30、17:00-22:30","fri":"11:00-14:30、17:00-22:30","sat":"11:00-14:30、17:00-22:30","sun":"11:00-14:30、17:00-22:30"},
    "hoursNote": "Uber Eats 列週二至週日11:00–14:15、17:00–21:45，週一空白；僅外送時段，不把舊現場22:30改成21:45。",
    "verification": {
      "status": "unconfirmed",
      "checkedAt": "2026-09-10",
      "note": "平台地址可採用；外送價與外送時段不作店內最新資料。"
    }
  },
  {
    "id": 75,
    "name": "即食樂複合式餐廳",
    "cuisine": "台式",
    "meals": ["lunch","dinner"],
    "price_range": "medium",
    "location": "裕農路",
    "note": "複合式料理。",
    "openHours": {"mon":null,"tue":null,"wed":null,"thu":null,"fri":null,"sat":null,"sun":null},
    "legacyOpenHours": {"mon":"17:00-20:30","tue":"11:30-14:30、17:00-20:30","wed":"11:30-14:30、17:00-20:30","thu":"11:30-14:30、17:00-20:30","fri":"11:30-14:30、17:00-20:30","sat":"11:30-14:30、17:00-20:30","sun":"11:30-14:30、17:00-20:30"},
    "hoursNote": "2023聚合頁列裕農路187號、05-2723456；桃園同名店已排除。不沿用舊時段。",
    "verification": {
      "status": "unconfirmed",
      "checkedAt": "2026-09-10",
      "note": "歷史地址電話僅供核對；現行營業情形待確認。"
    }
  },
  {
    "id": 76,
    "name": "韓金湯匙(嘉義中正店)",
    "cuisine": "韓式",
    "meals": ["lunch","dinner","latenight"],
    "price_range": "medium",
    "location": "裕農路",
    "note": "韓式無人拉麵。24小時尚未取得店家證明。",
    "address": "嘉義縣民雄鄉三興村裕農一街1號",
    "phone": "0958-606153",
    "openHours": {"mon":null,"tue":null,"wed":null,"thu":null,"fri":null,"sat":null,"sun":null},
    "legacyOpenHours": {"mon":"24小時營業","tue":"24小時營業","wed":"24小時營業","thu":"24小時營業","fri":"24小時營業","sat":"24小時營業","sun":"24小時營業"},
    "hoursNote": "品牌通路頁確認店名地址電話；未公開店內週表，不恢復24小時即時狀態。",
    "verification": {
      "status": "unconfirmed",
      "checkedAt": "2026-09-10",
      "note": "名稱與料理改依品牌通路頁；不是現行營業時間核實。"
    }
  },
  {
    "id": 77,
    "name": "A-bao裕農店",
    "cuisine": "西式",
    "meals": ["breakfast","lunch"],
    "price_range": "medium",
    "location": "裕農路",
    "note": "早午餐。勿與民雄其他A-bao據點混淆。",
    "address": "嘉義縣民雄鄉裕農路189號",
    "phone": "05-2720677",
    "openHours": {"mon":null,"tue":null,"wed":null,"thu":null,"fri":null,"sat":null,"sun":null},
    "legacyOpenHours": {"mon":"06:30-16:00","tue":"06:30-16:00","wed":"06:30-16:00","thu":"06:30-16:00","fri":"06:30-16:00","sat":"06:30-16:00","sun":"06:30-16:00"},
    "hoursNote": "LINE熱點列地址電話，未有完整週表；不採用2016食記或舊06:30–16:00作最新。",
    "verification": {
      "status": "unconfirmed",
      "checkedAt": "2026-09-10",
      "note": "平台地址電話可作線索；現行週表待 Maps 或店家。"
    }
  },
  {
    "id": 78,
    "name": "侯記中式早餐",
    "cuisine": "台式",
    "meals": ["breakfast","lunch"],
    "price_range": "cheap",
    "location": "裕農路",
    "note": "米飯、麵、粥。2026-04-27校方採訪時店主未訂結束日期。",
    "openHours": {"mon":null,"tue":null,"wed":null,"thu":null,"fri":null,"sat":null,"sun":null},
    "legacyOpenHours": {"mon":"06:00-14:00","tue":"06:00-14:00","wed":"06:00-14:00","thu":"06:00-14:00","fri":"06:00-14:00","sat":"06:00-14:00","sun":"休息"},
    "hoursNote": "採訪證明當時仍在營業，不是今日已核實；舊聚合頁週一至六06:00–14:00待電話核對。",
    "verification": {
      "status": "unconfirmed",
      "checkedAt": "2026-09-10",
      "note": "未查到歇業證據；不宜改成今日已確認營業，也不可填入學校總地址當門牌。"
    }
  },
  {
    "id": 79,
    "name": "123活力早餐屋",
    "cuisine": "台式",
    "meals": ["breakfast","lunch"],
    "price_range": "cheap",
    "location": "裕農路",
    "note": "蛋餅、炒麵、玉米濃湯。",
    "address": "嘉義縣民雄鄉大學路一段437號",
    "phone": "05-2724567",
    "openHours": {"mon":null,"tue":null,"wed":null,"thu":null,"fri":null,"sat":null,"sun":null},
    "legacyOpenHours": {"mon":"休息","tue":"06:30-14:30","wed":"06:30-14:30","thu":"06:30-14:30","fri":"06:30-14:30","sat":"06:30-14:30","sun":"06:30-14:30"},
    "hoursNote": "平台列06:30–14:30；2025-03食記確認到訪。官方FB本輪無法讀取，不直接斷言週一休。",
    "verification": {
      "status": "unconfirmed",
      "checkedAt": "2026-09-10",
      "note": "地址電話為平台層級來源；舊均價不作最新，現行休假表待店家。"
    }
  },
  {
    "id": 80,
    "name": "花圓巧芋",
    "cuisine": "甜點",
    "meals": ["dinner"],
    "price_range": "cheap",
    "location": "裕農路",
    "note": "芋頭類甜品。",
    "address": "嘉義縣民雄鄉裕農路193號",
    "openHours": {"mon":null,"tue":null,"wed":null,"thu":null,"fri":null,"sat":null,"sun":null},
    "legacyOpenHours": {"mon":"17:00-22:00","tue":"17:00-22:00","wed":"17:00-22:00","thu":"17:00-22:00","fri":"17:00-22:00","sat":"17:00-22:00","sun":"17:00-22:00"},
    "hoursNote": "餐飲登錄鏡像（同步2026-04-05）列裕農路193號、字號Q-200074733-00001-0；登錄不能證明現場營業或沿用舊17:00–22:00。",
    "verification": {
      "status": "unconfirmed",
      "checkedAt": "2026-09-10",
      "note": "有登錄地址線索；無時間表，不能宣稱現行核實。"
    }
  },
  {
    "id": 81,
    "name": "誠石火鍋",
    "cuisine": "火鍋",
    "meals": ["dinner","latenight"],
    "price_range": "medium",
    "location": "裕農路",
    "note": "火鍋，民雄中正大學店。勿套用大林或斗南分店資料。",
    "openHours": {"mon":null,"tue":null,"wed":null,"thu":null,"fri":null,"sat":null,"sun":null},
    "legacyOpenHours": {"mon":"17:00-23:00","tue":"17:00-23:00","wed":"17:00-23:00","thu":"17:00-23:00","fri":"17:00-23:00","sat":"17:00-23:00","sun":"17:00-23:00"},
    "hoursNote": "雲林字號與大林／斗南中正路分店皆已排除；本店門牌與店家頁仍缺，暫無歇業確證。",
    "verification": {
      "status": "unconfirmed",
      "checkedAt": "2026-09-10",
      "note": "最需要實際門牌與店家頁；不得套用其他分店地址與時段。"
    }
  },
  {
    "id": 82,
    "name": "佳豐生活美食(共同教室餐盒供應處)",
    "cuisine": "台式",
    "meals": ["lunch"],
    "price_range": "unknown",
    "location": "校內",
    "note": "中午便當、麵食，共同教室大樓1F臨時餐盒供應處。",
    "openHours": {"mon":"11:00-14:00","tue":"11:00-14:00","wed":"11:00-14:00","thu":"11:00-14:00","fri":"11:00-14:00","sat":"休息","sun":"休息"},
    "hoursNote": "寒暑假暫停營業。",
    "serviceAlerts": [
      {
        "from": "2026-09-20T07:00:00+08:00",
        "to": "2026-09-20T18:00:00+08:00",
        "note": "校內停水停電，部分店家暫停營業；請先確認店鋪公告。",
        "source": "https://oga.ccu.edu.tw/p/406-1006-93897,r1498.php?Lang=zh-tw"
      }
    ],
    "verification": {
      "status": "sourced",
      "checkedAt": "2026-09-10",
      "source": "https://www.ccu.edu.tw/p/406-1000-25657,r3205.php?Lang=zh-tw",
      "label": "中正大學飲食資訊",
      "fields": "名稱、位置、每週營業時間",
      "note": "依公開頁面列載；查閱日期不代表店家更新日期，出發前請確認臨時異動。"
    }
  },
  {
    "id": 83,
    "name": "食凡(共同教室餐盒供應處)",
    "cuisine": "台式",
    "meals": ["lunch"],
    "price_range": "unknown",
    "location": "校內",
    "note": "中午餐盒，共同教室大樓1F臨時餐盒供應處。",
    "openHours": {"mon":"11:00-14:00","tue":"11:00-14:00","wed":"11:00-14:00","thu":"11:00-14:00","fri":"11:00-14:00","sat":"休息","sun":"休息"},
    "hoursNote": "寒暑假暫停營業。",
    "serviceAlerts": [
      {
        "from": "2026-09-20T07:00:00+08:00",
        "to": "2026-09-20T18:00:00+08:00",
        "note": "校內停水停電，部分店家暫停營業；請先確認店鋪公告。",
        "source": "https://oga.ccu.edu.tw/p/406-1006-93897,r1498.php?Lang=zh-tw"
      }
    ],
    "verification": {
      "status": "sourced",
      "checkedAt": "2026-09-10",
      "source": "https://www.ccu.edu.tw/p/406-1000-25657,r3205.php?Lang=zh-tw",
      "label": "中正大學飲食資訊",
      "fields": "名稱、位置、每週營業時間",
      "note": "依公開頁面列載；查閱日期不代表店家更新日期，出發前請確認臨時異動。"
    }
  },
  {
    "id": 84,
    "name": "早安山丘(中正大學店)",
    "cuisine": "西式",
    "meals": ["breakfast","lunch"],
    "price_range": "unknown",
    "location": "神農路",
    "note": "早餐、早午餐。",
    "address": "嘉義縣民雄鄉神農路135號",
    "phone": "05-2722392",
    "openHours": {"mon":null,"tue":null,"wed":null,"thu":null,"fri":null,"sat":null,"sun":null},
    "hoursNote": "品牌官網列07:00–15:00，未列每週營業日；公休日待確認。",
    "verification": {
      "status": "sourced",
      "checkedAt": "2026-09-10",
      "source": "https://www.morninghill.com.tw/store.php?class_id=6&p=2",
      "label": "早安山丘品牌門市頁",
      "fields": "名稱、地址、電話、時段（營業日待確認）",
      "note": "依公開頁面列載；查閱日期不代表店家更新日期，出發前請確認臨時異動。"
    }
  },
  {
    "id": 85,
    "name": "中正大四喜牛肉麵(旗艦店)",
    "cuisine": "台式",
    "meals": ["lunch","dinner"],
    "price_range": "medium",
    "location": "神農路",
    "note": "大份量牛肉麵、免費續湯續麵，黃金昆布泡菜與珍珠奶茶無限暢飲。",
    "address": "嘉義縣民雄鄉正義一街66號",
    "phone": "05-2722720",
    "openHours": {"mon":"11:00-14:00、17:00-19:00","tue":"11:00-14:00、17:00-19:00","wed":"11:00-14:00、17:00-19:00","thu":"11:00-14:00、17:00-19:00","fri":"11:00-14:00、17:00-19:00","sat":"11:00-14:00、17:00-19:00","sun":"11:00-14:00、17:00-19:00"},
    "hoursNote": "假日人潮眾多建議提早預約；營業時間依現場與粉專公告為準。",
    "verification": {
      "status": "sourced",
      "checkedAt": "2026-09-15",
      "source": "https://www.facebook.com/ccubig4/",
      "label": "店家官方Facebook",
      "fields": "名稱、地址、電話、每週營業時間",
      "note": "依公開粉專列載；查閱日期不代表店家更新日期，出發前請確認臨時異動。"
    }
  },
  {
    "id": 86,
    "name": "琪琪健康舖",
    "cuisine": "甜點",
    "meals": ["lunch","dinner"],
    "price_range": "medium",
    "location": "神農路",
    "note": "自製手工優格、新鮮水果優格杯、天然果醬。",
    "address": "嘉義縣民雄鄉三興村陳厝寮27號",
    "phone": "05-2721122",
    "openHours": {"mon":"09:00-18:00","tue":"09:00-18:00","wed":"09:00-18:00","thu":"09:00-18:00","fri":"09:00-18:00","sat":"09:00-18:00","sun":"09:00-18:00"},
    "hoursNote": "節日或連假營業調整請參考店家官網公告。",
    "verification": {
      "status": "sourced",
      "checkedAt": "2026-09-15",
      "source": "https://www.gigishop.com.tw/",
      "label": "琪琪健康舖官方網站",
      "fields": "名稱、地址、電話、每週營業時間",
      "note": "依官方網站列載；查閱日期不代表店家更新日期，出發前請確認臨時異動。"
    }
  },
  {
    "id": 87,
    "name": "Simple Fit 簡單瘦",
    "cuisine": "台式",
    "meals": ["lunch","dinner"],
    "price_range": "medium",
    "location": "裕農路",
    "note": "高蛋白健身健康餐盒、舒肥牛排、香煎鮭魚、櫻桃鴨胸。",
    "address": "嘉義縣民雄鄉三興村裕農一街9號",
    "openHours": {"mon":"11:00-13:30、17:00-19:30","tue":"11:00-13:30、17:00-19:30","wed":"11:00-13:30、17:00-19:30","thu":"11:00-13:30、17:00-19:30","fri":"11:00-13:30、17:00-19:30","sat":"休息","sun":"休息"},
    "hoursNote": "週一至週五供餐，可透過官方LINE預約訂餐。",
    "verification": {
      "status": "sourced",
      "checkedAt": "2026-09-15",
      "source": "https://www.facebook.com/simplefit.ccu/",
      "label": "Simple Fit 店家Facebook",
      "fields": "名稱、地址、每週營業時間",
      "note": "依公開粉專列載；查閱日期不代表店家更新日期，出發前請確認臨時異動。"
    }
  },
  {
    "id": 88,
    "name": "大學路生煎包",
    "cuisine": "台式",
    "meals": ["lunch","dinner"],
    "price_range": "cheap",
    "location": "神農路",
    "note": "正大路與大學路交叉口餐車，銅板價現包現煎多汁生煎包、蔥肉與泡菜口味。",
    "address": "嘉義縣民雄鄉大學路一段429號附近T字路口",
    "openHours": {"mon":"11:30-18:30","tue":"11:30-18:30","wed":"11:30-18:30","thu":"11:30-18:30","fri":"11:30-18:30","sat":"13:00-18:30","sun":"休息"},
    "hoursNote": "下午至傍晚售完為止，週日公休。",
    "verification": {
      "status": "sourced",
      "checkedAt": "2026-09-15",
      "source": "https://www.dcard.tw/f/ccu",
      "label": "Dcard中正板學生探店實測紀錄",
      "fields": "名稱、地址、每週營業時間、特色",
      "note": "依校園生活分享列載；攤位營業以現場售完時間為準。"
    }
  },
  {
    "id": 89,
    "name": "八方雲集(嘉義中大店)",
    "cuisine": "台式",
    "meals": ["lunch","dinner"],
    "price_range": "cheap",
    "location": "神農路",
    "note": "鍋貼、水餃、湯品、乾麵。",
    "address": "嘉義縣民雄鄉神農路89號",
    "phone": "05-2720235",
    "openHours": {"mon":null,"tue":null,"wed":null,"thu":null,"fri":null,"sat":null,"sun":null},
    "legacyOpenHours": {"mon":null,"tue":null,"wed":null,"thu":null,"fri":null,"sat":null,"sun":null},
    "hoursNote": "品牌官網確認中大店門市與地址，外送平台時段不穩定，出發前請確認現場開店狀況。",
    "verification": {
      "status": "unconfirmed",
      "checkedAt": "2026-09-15",
      "note": "官網門市確定，但營業時間有臨時調動紀錄，標示為待確認。"
    }
  },
  {
    "id": 90,
    "name": "A咖美食平價牛排",
    "cuisine": "西式",
    "meals": ["lunch","dinner"],
    "price_range": "medium",
    "location": "神農路",
    "note": "平價台式牛排排餐、可免費續麵、玉米濃湯飲料暢飲，學生月底救星。",
    "address": "嘉義縣民雄鄉神農一街",
    "phone": "0910-942303",
    "openHours": {"mon":null,"tue":null,"wed":null,"thu":null,"fri":null,"sat":null,"sun":null},
    "legacyOpenHours": {"mon":null,"tue":null,"wed":null,"thu":null,"fri":null,"sat":null,"sun":null},
    "hoursNote": "寒暑假店休，平日營業時段依現場公告，前往前可電洽確認。",
    "verification": {
      "status": "unconfirmed",
      "checkedAt": "2026-09-15",
      "note": "學生平價排餐推薦；現場實際營業時間請電洽店家。"
    }
  },
  {
    "id": 91,
    "name": "Chill bowl",
    "cuisine": "台式",
    "meals": ["lunch","dinner"],
    "price_range": "medium",
    "location": "神農路",
    "note": "自選健康輕食丼飯、豐富蔬菜配料與特調醬汁（原那間店址）。",
    "address": "嘉義縣民雄鄉神農路",
    "openHours": {"mon":null,"tue":null,"wed":null,"thu":null,"fri":null,"sat":null,"sun":null},
    "legacyOpenHours": {"mon":null,"tue":null,"wed":null,"thu":null,"fri":null,"sat":null,"sun":null},
    "hoursNote": "大吃市自選輕食丼飯，營業時段請參考現場或店家社群公告。",
    "verification": {
      "status": "unconfirmed",
      "checkedAt": "2026-09-15",
      "note": "店址與品牌經學生社群確認；營業時段待核實。"
    }
  },
  {
    "id": 92,
    "name": "布格早餐",
    "cuisine": "台式",
    "meals": ["breakfast","lunch"],
    "price_range": "cheap",
    "location": "神農路",
    "note": "平價早餐、招牌炒泡麵、漢堡蛋餅。",
    "address": "嘉義縣民雄鄉神農路周邊",
    "phone": "0929-100686",
    "openHours": {"mon":null,"tue":null,"wed":null,"thu":null,"fri":null,"sat":null,"sun":null},
    "legacyOpenHours": {"mon":null,"tue":null,"wed":null,"thu":null,"fri":null,"sat":null,"sun":null},
    "hoursNote": "晨間至中午供餐，可電洽確認當日營業狀況。",
    "verification": {
      "status": "unconfirmed",
      "checkedAt": "2026-09-15",
      "note": "學生平價早餐推薦；現場實際營業時間請電洽店家。"
    }
  }
];
