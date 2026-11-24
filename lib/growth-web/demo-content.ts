/**
 * Presentation content for the Growth Web demo school (/services/growth-web/demo).
 * School facts (classes, prices, FAQ) stay in demo-school.ts; this file only holds
 * copy and visual mappings for the draft-2 design.
 */
import { type CampusFilterId, DEMO_CLASSES, type DemoClassSlot, type GradeFilterId } from "./demo-school.ts"

/**
 * Every string set in the display face (Zen Kaku Gothic New Black). The font is
 * subset to exactly these glyphs by scripts/build-growth-web-demo-fonts.py, and
 * tests/growth-web-demo.test.mjs fails if a character here is missing from it.
 */
export const DEMO_DISPLAY_TEXT = {
  heroLine1: "「見てて！」が、",
  heroLine2: "毎週ふえていく。",
  finderTitle: "体験するクラスをさがす",
  classesTitle: "クラスと時間割",
  approachLine1: "ミスを叱らず、",
  approachLine2: "挑戦の回数をほめる。",
  pricingTitle: "料金は、入会前にすべてお見せします。",
  trialLine1: "体験は無料。",
  trialLine2: "入力は必須4項目と確認だけ。",
  formTitle: "無料体験の申し込み",
  receiptTitle: "デモ申込を受け付けました",
  faqTitle: "よくある質問",
  gradeTiles: "年長小1・2小3・4小5・6",
  dayLabels: "火水木金土",
} as const

export type DemoDayId = "tue" | "wed" | "thu" | "fri" | "sat"

export const DEMO_DAY_FILTERS: ReadonlyArray<{ id: DemoDayId; label: string; name: string; en: string }> = [
  { id: "tue", label: "火", name: "火曜日", en: "TUE" },
  { id: "wed", label: "水", name: "水曜日", en: "WED" },
  { id: "thu", label: "木", name: "木曜日", en: "THU" },
  { id: "fri", label: "金", name: "金曜日", en: "FRI" },
  { id: "sat", label: "土", name: "土曜日", en: "SAT" },
]

export const DEMO_GRADE_TILES: ReadonlyArray<{ id: Exclude<GradeFilterId, "all">; label: string; formGrade: string }> = [
  { id: "preschool_senior", label: "年長", formGrade: "preschool_senior" },
  { id: "grade_1_2", label: "小1・2", formGrade: "grade_1_2" },
  { id: "grade_3_4", label: "小3・4", formGrade: "grade_3_4" },
  { id: "grade_5_6", label: "小5・6", formGrade: "grade_5_6" },
]

export const DEMO_PLACE_OPTIONS: ReadonlyArray<{ id: CampusFilterId; label: string; note: string }> = [
  { id: "all", label: "どちらでも", note: "" },
  { id: "futako_turf", label: "二子玉川", note: "屋外・人工芝" },
  { id: "yoga_gym", label: "用賀", note: "屋内・雨でも開催" },
]

/** Image path prefix; files are built by scripts/build-growth-web-demo-images.py. */
export const DEMO_IMAGE_BASE = "/images/growth-web-demo"

export const DEMO_CLASS_VISUALS: Record<
  string,
  { day: DemoDayId; image: string; imageAlt: string; campusShort: string; accessShort: string }
> = {
  "kids-movement-tue": {
    day: "tue",
    image: "class-movement",
    imageAlt: "芝生の上でボール遊びをする幼児2人（イメージ写真）",
    campusShort: "二子玉川・屋外人工芝",
    accessShort: "二子玉川駅 徒歩9分",
  },
  "u9-soccer-wed": {
    day: "wed",
    image: "class-u9",
    imageAlt: "芝生でボールを追う2人の小学生の後ろ姿（イメージ写真）",
    campusShort: "二子玉川・屋外人工芝",
    accessShort: "二子玉川駅 徒歩9分",
  },
  "indoor-agility-thu": {
    day: "thu",
    image: "class-indoor",
    imageAlt: "屋内コートでボールを追う選手の足元（イメージ写真）",
    campusShort: "用賀・屋内アリーナ",
    accessShort: "用賀駅 徒歩6分・雨でも開催",
  },
  "u12-game-sense-fri": {
    day: "fri",
    image: "class-u12",
    imageAlt: "スローインの姿勢でボールを構える選手の後ろ姿（イメージ写真）",
    campusShort: "二子玉川・屋外人工芝",
    accessShort: "二子玉川駅 徒歩9分・夜間照明あり",
  },
  "weekend-family-sat": {
    day: "sat",
    image: "class-weekend",
    imageAlt: "ラインの上でサッカーボールに足を乗せる様子（イメージ写真）",
    campusShort: "用賀・屋内アリーナ",
    accessShort: "用賀駅 徒歩6分",
  },
}

/** "15:45–16:45（60分）" → { time: "15:45–16:45", minutes: "60分" } */
export function splitTimeRange(timeRange: string): { time: string; minutes: string } {
  const m = timeRange.match(/^(.*?)（(\d+分)）$/)
  return m ? { time: m[1], minutes: m[2] } : { time: timeRange, minutes: "" }
}

/** Single-value summary of the day filter for GA4 (no free text, fixed vocabulary). */
export function dayFilterParam(days: readonly DemoDayId[]): "all" | DemoDayId | "multiple" {
  if (days.length === 0) return "all"
  if (days.length === 1) return days[0]
  return "multiple"
}

export const DEMO_ASSURANCES = [
  { title: "未経験・運動が苦手でも大丈夫", body: "経験に合わせて、距離やルールを一人ずつ調整します。", icon: "check" },
  { title: "保護者の当番・お茶出しなし", body: "送迎と見学だけ。水分補給や体調確認はコーチが行います。", icon: "cup" },
  { title: "雨や体調不良は月2回まで振替", body: "用賀の屋内クラスや翌月の空き枠へ、手数料なしで。", icon: "rain" },
  { title: "体験当日の入会勧誘なし", body: "おうちで「また行きたい？」を聞いてから決めてください。", icon: "talk" },
] as const

export const DEMO_APPROACH_POINTS = [
  { title: "最大16名を、コーチ2名で", body: "待ち時間を減らし、ボールに触れる回数と一人ひとりへの声かけを確保します。" },
  { title: "経験に合わせて、ルールを変える", body: "同じメニューでも距離や人数を個別に調整。ついていけない時間をつくりません。" },
  { title: "毎回、できたことを保護者へ", body: "練習の最後に、その日の良い変化をコーチからお伝えします。" },
] as const

/** Unsplash License photos (https://unsplash.com/license). Faces of children are not identifiable. */
export const DEMO_PHOTO_CREDITS = [
  { use: "ヒーロー", photographer: "Ile Ristov", photoId: "ocroZaKaoyI" },
  { use: "指導方針", photographer: "Adrià Crehuet Cano", photoId: "yndHHu2kJAw" },
  { use: "火曜クラス", photographer: "Arion Reyvonputra", photoId: "WtpTVeCXcAg" },
  { use: "水曜クラス", photographer: "James Lee", photoId: "0axqBrI8Or4" },
  { use: "木曜クラス", photographer: "Abby Tait", photoId: "3EBaEQ0mKPk" },
  { use: "金曜クラス", photographer: "Syed Ali", photoId: "PDbr_bFHvL4" },
  { use: "土曜クラス", photographer: "Amr Taha™", photoId: "RuFuCkow5uw" },
] as const

/** Numbered measurement points shown only in owner (inspector) mode. */
export const DEMO_MEASURE_POINTS = [
  { pin: "1", label: "ページ表示", event: "demo_view" },
  { pin: "2", label: "体験予約ボタン", event: "demo_hero_cta_click" },
  { pin: "3", label: "クラス検索（学年・曜日・場所）", event: "demo_schedule_filter" },
  { pin: "4", label: "クラスを選んで体験へ", event: "demo_class_select" },
  { pin: "5", label: "きょうだい割引の切り替え", event: "demo_pricing_toggle" },
  { pin: "6", label: "体験申込フォーム", event: "trial_form_start / submit / error" },
  { pin: "7", label: "よくある質問の開閉", event: "demo_faq_toggle" },
  { pin: "8", label: "スマホ追従ボタン", event: "demo_sticky_cta_click" },
] as const

export interface DemoClassFilters {
  grade: GradeFilterId
  days: DemoDayId[]
  campus: CampusFilterId
}

/** Classes matching grade AND (any selected day) AND campus. Empty days = every day. */
export function filterDemoClasses(filters: DemoClassFilters): DemoClassSlot[] {
  return DEMO_CLASSES.filter((slot) => {
    const visual = DEMO_CLASS_VISUALS[slot.id]
    const gradeOk = filters.grade === "all" || slot.grades.includes(filters.grade)
    const dayOk = filters.days.length === 0 || (visual ? filters.days.includes(visual.day) : false)
    const campusOk = filters.campus === "all" || slot.campusId === filters.campus
    return gradeOk && dayOk && campusOk
  })
}
