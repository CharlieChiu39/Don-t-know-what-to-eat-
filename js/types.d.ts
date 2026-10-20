// 共用型別：JS 檔以 JSDoc `import('./types.js')` 引用，由 `npm run typecheck` 檢查。

export type DayKey = 'sun' | 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat';
export type Meal = 'breakfast' | 'lunch' | 'dinner' | 'latenight';
export type PriceRange = 'cheap' | 'medium' | 'expensive' | 'unknown';
export type Area = '校內' | '神農路' | '裕農路' | '大學路' | '民雄市區';
/** nearby＝中正周邊（民雄市區以外的區域）；all＝不限 */
export type AreaFilter = Area | 'nearby' | 'all';
export type TagId =
  | 'bento' | 'rice' | 'noodles' | 'breakfast' | 'snack' | 'luwei' | 'fried'
  | 'hotpot' | 'western' | 'asian' | 'healthy' | 'drinks' | 'dessert' | 'cafe'
  | 'convenience' | 'vegetarian' | 'halal';

/** "11:00-14:00、17:00-20:00" | "休息" | "24小時營業" | null（未知） */
export type HoursValue = string | null;
export type WeeklyHours = Record<DayKey, HoursValue>;

export interface ServiceAlert {
  from: string;
  to: string;
  note: string;
  source?: string;
}

export interface Verification {
  status: 'sourced' | 'unconfirmed';
  checkedAt?: string;
  source?: string;
  label?: string;
  fields?: string;
  note?: string;
}

export interface Restaurant {
  id: number;
  name: string;
  cuisine: string;
  tags: TagId[];
  meals: Meal[];
  price_range: PriceRange;
  priceNote?: string;
  location: Area;
  note: string;
  address?: string;
  phone?: string;
  /** Google 地圖商家頁；有的話「看地圖」直接開這個頁面 */
  mapUrl?: string;
  openHours: WeeklyHours;
  hoursNote?: string;
  /** 以台北日期 YYYY-MM-DD 為 key 的單日調整，例如臨時店休 */
  specialHours?: Record<string, string>;
  specialHoursSource?: string;
  serviceAlerts?: ServiceAlert[];
  /** 未查證的舊時刻表，只用來推估「可能營業」 */
  legacyOpenHours?: WeeklyHours;
  verification: Verification;
}

/**
 * open    已查證時刻表顯示營業中
 * likely  只有舊時刻表，推估營業中
 * closed  休息中（estimated 為 true 時代表推估）
 * unknown 沒有足夠資料
 */
export type OpenState = 'open' | 'likely' | 'closed' | 'unknown';

export interface NextOpening {
  /** 0 = 今天、1 = 明天… */
  dayOffset: number;
  /** 當天第幾分鐘 */
  minute: number;
}

export interface OpeningStatus {
  state: OpenState;
  /** 是否由未查證的舊時刻表推估 */
  estimated: boolean;
  /** 今日時段原文，或公告內容 */
  hours: string;
  /** 距離打烊的分鐘數；無法計算或 24 小時營業時為 null */
  minutesLeft: number | null;
  next: NextOpening | null;
  /** 臨時店休、服務公告等特殊原因 */
  reason?: 'special-closure' | 'alert' | 'day-off' | 'break' | 'break-check' | 'holiday';
  source?: string;
  /** 寒暑假或國定假日的名稱與結束日（台北日期 YYYY-MM-DD） */
  period?: { name: string; until: string };
}

/**
 * confirmed 只放查證過、此刻營業中的店
 * likely    再加上舊資料推估「可能營業」的店（預設）
 * all       不看營業狀態
 */
export type OpenMode = 'confirmed' | 'likely' | 'all';

export interface Filters {
  meal: Meal | 'all';
  price: PriceRange | 'all';
  area: AreaFilter;
  tags: TagId[];
  openMode: OpenMode;
}

/** 流動餐車：出沒時間不固定，不放進轉盤，只列出地點與追蹤方式。 */
export interface FoodTruck {
  id: string;
  name: string;
  food: string;
  tags: TagId[];
  location: Area;
  /** 常出現的位置 */
  spot: string;
  /** 出攤規律的文字描述 */
  schedule: string;
  priceNote?: string;
  note?: string;
  /** 追蹤出攤公告的方式，例如 IG 帳號名稱 */
  follow?: string;
  source: { label: string; url: string; postedAt: string };
  checkedAt: string;
}

export interface Candidate {
  restaurant: Restaurant;
  status: OpeningStatus;
}

/** 校方行事曆：寒暑假與國定假日，只影響 campusPolicies 列出的校內店家 */
export interface SchoolCalendar {
  label: string;
  source: string;
  checkedAt: string;
  note?: string;
  breaks: { name: string; from: string; to: string }[];
  holidays: { date: string; name: string }[];
  campusPolicies: {
    /** 寒暑假確定暫停營業 */
    'closed-on-break': number[];
    /** 寒暑假與國定假日時段另行公告，需要先確認 */
    'check-on-break': number[];
  };
}
