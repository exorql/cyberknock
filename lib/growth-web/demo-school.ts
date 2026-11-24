export type GradeFilterId =
  | "all"
  | "preschool_senior"
  | "grade_1_2"
  | "grade_3"
  | "grade_4"
  | "grade_5_6"

export type CampusFilterId = "all" | "futako_turf" | "yoga_gym"

export interface DemoClassSlot {
  id: string
  name: string
  shortLabel: string
  campusId: Exclude<CampusFilterId, "all">
  campusName: string
  campusAccess: string
  grades: Array<Exclude<GradeFilterId, "all">>
  gradeLabel: string
  dayOfWeek: string
  timeRange: string
  capacity: number
  coachRatio: string
  trialStatus: "open" | "few_left"
  trialStatusLabel: string
  focusSummary: string
  monthlyFeeJpy: number
  defaultGradeValue: Exclude<GradeFilterId, "all">
}

export interface DemoCoach {
  id: string
  role: string
  name: string
  credentials: string[]
  philosophy: string
  accentTone: "emerald" | "terracotta" | "slate"
}

export const DEMO_SCHOOL_INFO = {
  name: "あおばフィールド スポーツアカデミー",
  englishName: "AOBA FIELD SPORTS ACADEMY",
  demoBadge: "架空モデルスクール（デモ・ダミーデータ）",
  areaLabel: "東京都世田谷区・二子玉川／用賀エリア（架空設定）",
  ageRangeLabel: "年長（5歳）〜小学6年生",
  disciplinesLabel: "ジュニアサッカー・運動基礎",
  phoneDemo: "03-0000-0000（架空デモ番号）",
} as const

export const DEMO_CAMPUSES = [
  { id: "all" as const, label: "すべての拠点（2拠点）" },
  { id: "futako_turf" as const, label: "二子玉川グリーンパーク人工芝（架空）" },
  { id: "yoga_gym" as const, label: "用賀コミュニティ屋内アリーナ（架空）" },
]

export const DEMO_GRADE_FILTERS = [
  { id: "all" as const, label: "全学年" },
  { id: "preschool_senior" as const, label: "年長" },
  { id: "grade_1_2" as const, label: "小1〜2" },
  { id: "grade_3" as const, label: "小3" },
  { id: "grade_4" as const, label: "小4" },
  { id: "grade_5_6" as const, label: "小5〜6" },
]

export const DEMO_CLASSES: DemoClassSlot[] = [
  {
    id: "kids-movement-tue",
    name: "キッズ運動基礎＆ボール遊びクラス",
    shortLabel: "年長・小1〜2｜火曜 15:45",
    campusId: "futako_turf",
    campusName: "二子玉川グリーンパーク人工芝（架空）",
    campusAccess: "二子玉川駅 徒歩9分・送迎用一時停車スペースあり",
    grades: ["preschool_senior", "grade_1_2"],
    gradeLabel: "年長〜小学2年生",
    dayOfWeek: "毎週火曜",
    timeRange: "15:45–16:45（60分）",
    capacity: 12,
    coachRatio: "指導員2名体制（最大6名に1名）",
    trialStatus: "open",
    trialStatusLabel: "無料体験 受付中",
    focusSummary:
      "走る・止まる・跳ぶの運動基礎と、ボールに親しむゲーム中心のメニュー。初めての習い事でも安心して参加できます。",
    monthlyFeeJpy: 7_700,
    defaultGradeValue: "preschool_senior",
  },
  {
    id: "u9-soccer-wed",
    name: "U-9 ジュニアサッカー基礎クラス",
    shortLabel: "小1〜3｜水曜 16:30",
    campusId: "futako_turf",
    campusName: "二子玉川グリーンパーク人工芝（架空）",
    campusAccess: "二子玉川駅 徒歩9分・近隣コインパーキング併設",
    grades: ["grade_1_2", "grade_3"],
    gradeLabel: "小学1〜3年生",
    dayOfWeek: "毎週水曜",
    timeRange: "16:30–17:40（70分）",
    capacity: 14,
    coachRatio: "指導員2名体制（最大7名に1名）",
    trialStatus: "few_left",
    trialStatusLabel: "体験枠 残りわずか（デモ表示）",
    focusSummary:
      "ボールコントロール・視野の広げ方・仲間への声かけを段階的に習得。勝敗よりも「できた」の積み上げを重視します。",
    monthlyFeeJpy: 8_800,
    defaultGradeValue: "grade_1_2",
  },
  {
    id: "indoor-agility-thu",
    name: "屋内コーディネーション＆フットサル",
    shortLabel: "年長〜小4｜木曜 16:15",
    campusId: "yoga_gym",
    campusName: "用賀コミュニティ屋内アリーナ（架空）",
    campusAccess: "用賀駅 徒歩6分・屋内施設のため雨天中止なし",
    grades: ["preschool_senior", "grade_1_2", "grade_3", "grade_4"],
    gradeLabel: "年長〜小学4年生",
    dayOfWeek: "毎週木曜",
    timeRange: "16:15–17:15（60分）",
    capacity: 12,
    coachRatio: "指導員2名体制（屋内安全管理）",
    trialStatus: "open",
    trialStatusLabel: "無料体験 受付中",
    focusSummary:
      "ラダー・ミニハードルでリズム感とバランス力を養い、後半は少人数ミニゲームで判断力を伸ばす全天候クラス。",
    monthlyFeeJpy: 8_250,
    defaultGradeValue: "grade_3",
  },
  {
    id: "u12-game-sense-fri",
    name: "U-12 実践ゲーム＆スキルアップクラス",
    shortLabel: "小4〜6｜金曜 17:15",
    campusId: "futako_turf",
    campusName: "二子玉川グリーンパーク人工芝（架空）",
    campusAccess: "二子玉川駅 徒歩9分・夜間照明完備",
    grades: ["grade_4", "grade_5_6"],
    gradeLabel: "小学4〜6年生",
    dayOfWeek: "毎週金曜",
    timeRange: "17:15–18:35（80分）",
    capacity: 16,
    coachRatio: "指導員2名体制（レベル別グループ分け）",
    trialStatus: "open",
    trialStatusLabel: "無料体験 受付中",
    focusSummary:
      "ファーストタッチ・1対1の駆け引き・数的優位の判断をミニゲーム形式で反復。他クラブ所属の週1追加受講にも対応。",
    monthlyFeeJpy: 9_900,
    defaultGradeValue: "grade_5_6",
  },
  {
    id: "weekend-family-sat",
    name: "土曜モーニング 総合スポーツ＆サッカー",
    shortLabel: "年長〜小6｜土曜 09:30",
    campusId: "yoga_gym",
    campusName: "用賀コミュニティ屋内アリーナ（架空）",
    campusAccess: "用賀駅 徒歩6分・週末の送迎がしやすい午前枠",
    grades: ["preschool_senior", "grade_1_2", "grade_3", "grade_4", "grade_5_6"],
    gradeLabel: "年長〜小学6年生（2グループ制）",
    dayOfWeek: "毎週土曜",
    timeRange: "09:30–10:40（70分）",
    capacity: 16,
    coachRatio: "低学年・高学年で各1名以上配置",
    trialStatus: "few_left",
    trialStatusLabel: "体験枠 残りわずか（デモ表示）",
    focusSummary:
      "平日の送迎が難しいご家庭向けの土曜午前クラス。兄弟で同じ時間帯に通えるよう、学年別にコートを分けて実施します。",
    monthlyFeeJpy: 8_800,
    defaultGradeValue: "grade_1_2",
  },
]

export function getDemoClassById(classId: string): DemoClassSlot | undefined {
  return DEMO_CLASSES.find((slot) => slot.id === classId)
}

export function isGradeEligibleForClass(classId: string, grade: string): boolean {
  const slot = getDemoClassById(classId)
  if (!slot) return false
  return slot.grades.includes(grade as Exclude<GradeFilterId, "all">)
}

export function getEligibleDemoClassesForGrade(grade: string): DemoClassSlot[] {
  if (!grade || grade === "all") return DEMO_CLASSES
  return DEMO_CLASSES.filter((slot) =>
    slot.grades.includes(grade as Exclude<GradeFilterId, "all">)
  )
}

export const SAFETY_STANDARDS = [
  {
    code: "01",
    title: "保護者の当番・お茶出しは一切なし",
    description:
      "送迎と見学のみでご参加いただけます。練習中の水分補給や体調チェックはすべて指導員が管理します。",
  },
  {
    code: "02",
    title: "定員12〜16名・指導員2名の少人数制",
    description:
      "待ち時間を減らし、ボールに触れる回数と「一人ひとりへの声かけ」を確保する人数上限を設けています。",
  },
  {
    code: "03",
    title: "雨天・体調不良は月2回まで別曜日へ振替",
    description:
      "屋外拠点が雨天中止になった場合も、用賀屋内アリーナ枠や翌月の空き枠へ手数料無料で振替できます。",
  },
  {
    code: "04",
    title: "月謝以外の費用も事前に1円単位で公開",
    description:
      "入会金・年会費（保険料含む）・指定シャツ代をWeb上に明記。体験後に想定外の追加費用が発生しません。",
  },
  {
    code: "05",
    title: "安全管理・スポーツ安全保険への全員加入",
    description:
      "AED設置確認・熱中症指数（WBGT）基準に沿った休憩管理を徹底。体験参加時もレクリエーション保険を適用します。",
  },
  {
    code: "06",
    title: "体験当日の無理な入会勧誘は行いません",
    description:
      "ご帰宅後にお子さまの「また行きたい」という反応を確かめてから、WebまたはLINEでご判断いただけます。",
  },
] as const

export const TRANSPARENT_PRICING = {
  enrollmentFeeJpy: 5_500,
  annualInsuranceAndAdminFeeJpy: 3_300,
  uniformSetJpy: 4_950,
  siblingDiscountMonthlyJpy: 1_100,
  siblingEnrollmentDiscountNote: "2人目以降の入会金は無料（デモ設定）",
  tiers: [
    {
      name: "キッズ運動基礎（週1・60分）",
      target: "年長〜小学2年生",
      monthlyJpy: 7_700,
      note: "月4回開催・振替対応",
    },
    {
      name: "屋内コーディネーション（週1・60分）",
      target: "年長〜小学4年生",
      monthlyJpy: 8_250,
      note: "全天候・雨天中止なし",
    },
    {
      name: "U-9基礎 / 土曜総合（週1・70分）",
      target: "U-9：小学1〜3年生 ／ 土曜：年長〜小学6年生",
      monthlyJpy: 8_800,
      note: "月4回開催・振替対応",
    },
    {
      name: "U-12実践スキルアップ（週1・80分）",
      target: "小学4〜6年生",
      monthlyJpy: 9_900,
      note: "週2回プラン 15,400円（税込）もあり",
    },
  ],
} as const

export const TRIAL_TIMELINE = [
  {
    minute: "00–05分",
    title: "受付・コーチ挨拶・コート案内",
    detail:
      "開始10分前を目安にお越しください。緊張しているお子さまも、まずは名前を呼び合いながらボールに触れるところから始めます。",
  },
  {
    minute: "05–20分",
    title: "鬼ごっこ＆リズムウォームアップ",
    detail:
      "楽しみながら体をほぐし、自然に他の子どもたちと混ざれる導入メニューを行います。",
  },
  {
    minute: "20–40分",
    title: "基礎ドリブル・ステップ練習",
    detail:
      "難易度をお子さまの経験に合わせて個別調整。成功体験を言葉にしてフィードバックします。",
  },
  {
    minute: "40–55分",
    title: "少人数ミニゲーム",
    detail:
      "全員が何度もボールに触れる4対4などの小コートゲーム。ルールが分からなくてもコーチが隣でサポートします。",
  },
  {
    minute: "55–60分",
    title: "振り返り・保護者様への質疑応答",
    detail:
      "レッスン中のお子さまの良い変化をお伝えし、通い方や持ち物のご質問にお答えして終了です（無理な勧誘はありません）。",
  },
] as const

export const TRIAL_BELONGINGS = [
  "動きやすい服装（体操服やジャージで構いません）",
  "運動靴（屋内クラスは室内用シューズ。スパイク不要）",
  "飲み物（水筒・多めにご持参ください）",
  "汗拭きタオル",
  "※ボール・ビブスはスクールから無料貸し出しします",
] as const

export const DEMO_COACHES: DemoCoach[] = [
  {
    id: "coach-takahashi",
    role: "ヘッドコーチ（架空モデル）",
    name: "高橋 健太（架空プロフィール）",
    credentials: ["JFA公認C級コーチ（設定例）", "普通救命講習修了（設定例）"],
    philosophy:
      "「ミスを叱らず、挑戦の回数を褒める」が方針です。運動が得意な子も苦手な子も、自分のペースで『昨日よりできた』を実感できる声かけを徹底します。",
    accentTone: "emerald",
  },
  {
    id: "coach-sato",
    role: "運動基礎・キッズ担当（架空モデル）",
    name: "佐藤 彩乃（架空プロフィール）",
    credentials: ["ジュニアスポーツ指導員（設定例）", "保育・幼児運動指導経験（設定例）"],
    philosophy:
      "年長〜低学年の時期は、特定競技の技術より『体を動かすことが好きになること』が土台になります。人見知りのお子さまも段階的に輪に入れるよう伴走します。",
    accentTone: "terracotta",
  },
]

export const DEMO_FAQS = [
  {
    id: "demo-faq-beginner",
    question: "運動が苦手でサッカーも未経験ですが、ついていけますか？",
    answer:
      "はい、問題ありません。年齢別かつ少人数制で実施しているため、経験に合わせて練習の距離やルールを個別に調整します。体験当日はコーチが近くでサポートしますのでご安心ください。",
  },
  {
    id: "demo-faq-parent-duty",
    question: "保護者の当番や試合の引率、お茶出しなどはありますか？",
    answer:
      "一切ありません。保護者の方は送迎と見学のみでご参加いただけます。練習中の見学も自由ですが、お買い物などで一時退出される場合は開始前にコーチへお声がけいただければ大丈夫です。",
  },
  {
    id: "demo-faq-rain",
    question: "雨の日や体調不良でお休みした場合はどうなりますか？",
    answer:
      "屋外クラスが雨天中止になった場合、開始60分前までにメール・LINEでご連絡します。雨天中止や体調不良による欠席は、月2回まで他曜日や用賀屋内アリーナ枠へ無料で振替できます。",
  },
  {
    id: "demo-faq-items",
    question: "体験のためにボールや専用ユニフォームを買う必要はありますか？",
    answer:
      "不要です。ボールやビブスはすべて無料でお貸しします。動きやすい服装、履き慣れた運動靴（屋内クラスのみ室内履き）、水筒、タオルだけでご参加いただけます。",
  },
  {
    id: "demo-faq-demo-notice",
    question: "このサイトの体験フォームを送信するとどうなりますか？（デモ仕様）",
    answer:
      "本ページはCyber Knockが制作した民間スポーツスクール向け集客改善サイトの架空デモです。フォーム送信時は完全なドライラン検証モードで動作し、外部へのメール送信・実在スクールへの予約登録・サーバー側への個人情報保存は一切行われません。送信後に通知プレビューとGA4計測イベントを確認できます。",
  },
] as const
