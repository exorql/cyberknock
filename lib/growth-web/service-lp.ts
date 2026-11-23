export interface CompetitorRow {
  category: string
  label: string
  initialCost: string
  monthlyCost: string
  primaryGoal: string
  cvrAndMeasurement: string
  sportsSchoolFit: string
  highlight?: boolean
}

export interface DifferentiationPillar {
  index: string
  tag: string
  title: string
  summary: string
  details: string[]
}

export interface ProcessStep {
  phase: string
  duration: string
  title: string
  description: string
  deliverables: string[]
}

export interface FaqItem {
  id: string
  question: string
  answer: string
}

export const GROWTH_WEB_ROUTES = {
  lp: "/services/growth-web",
  demo: "/services/growth-web/demo",
  privacy: "/privacy-policy",
} as const

export const SERVICE_METADATA = {
  brandName: "Cyber Knock",
  serviceName: "Cyber Knock Growth Web",
  tagline: "ホームページ制作ではなく、体験申込を増やし続ける集客改善。",
  targetLabel: "民間スポーツスクール特化・先行パートナー3社限定募集",
  initialPriceExclTax: "49,800",
  monthlyPriceExclTax: "29,800",
  initialPriceInclTax: "54,780",
  monthlyPriceInclTax: "32,780",
} as const

export const SCHOOL_PAIN_POINTS = [
  {
    code: "01",
    title: "スマホで曜日・対象学年・費用がすぐ見つからない",
    body: "検索やInstagramから保護者が訪れても、PDFの時間割や古いお知らせばかりで「自分の子どもが通えるか」が10秒以内に判断できず離脱されます。",
  },
  {
    code: "02",
    title: "作って終わりのサイトになり、改善する時間がない",
    body: "現場指導と保護者連絡に追われるスクール運営では、季節募集のバナー更新やアクセス分析、フォーム離脱の検証まで手が回りません。",
  },
  {
    code: "03",
    title: "ポータル依存や高額制作のあいだに選択肢がない",
    body: "買い切り制作は初期50万円超とリスクが大きく、月額数千円の丸投げ代行では集客改善まで踏み込めない。その空白を埋める設計が不足しています。",
  },
] as const

export const COMPETITOR_COMPARISON_ROWS: CompetitorRow[] = [
  {
    category: "比較基準（制作代行サブスク）",
    label: "ラクスル おまかせプラン等",
    initialCost: "0〜5,000円（税抜）",
    monthlyCost: "9,800円（税抜）",
    primaryGoal: "安価にサイトを保有し、月8回程度の更新を丸投げ",
    cvrAndMeasurement: "基本フォーム・SNS連携。継続的なCVR検証や業種特化改善は標準外",
    sportsSchoolFit: "名刺サイト保有には有効だが、体験申込を増やす改善基盤としては不足",
  },
  {
    category: "大手集客パック",
    label: "NTTタウンページ デジタルリード等",
    initialCost: "5,500円〜（本格SEOは43万円超）",
    monthlyCost: "1.4万〜3万円超（MEO別）",
    primaryGoal: "大手サポートのもとでHPと検索・マップ対策を併用",
    cvrAndMeasurement: "上位プランでレポート伴走。初期・月額の合算負担が大きくなりやすい",
    sportsSchoolFit: "複数拠点の予算規模向け。小規模スクールには機動性と費用対効果が重い",
  },
  {
    category: "一般制作会社・買い切り",
    label: "地域制作会社 / フリーランス",
    initialCost: "30万〜80万円",
    monthlyCost: "保守0.5万〜1.5万円（改善別）",
    primaryGoal: "オーダーメイドデザインでの初期納品",
    cvrAndMeasurement: "公開後の改善・GA4分析は別契約（月5万〜10万円）になることが多い",
    sportsSchoolFit: "初期キャッシュ負担が重く、公開後の検証サイクルが止まりやすい",
  },
  {
    category: "スポーツポータル / DIY",
    label: "スポスル / STUDIO・Wix等",
    initialCost: "0円",
    monthlyCost: "0〜4,980円（または成果報酬）",
    primaryGoal: "ポータル送客または自社手作業での安価な立ち上げ",
    cvrAndMeasurement: "ポータルでは近隣競合と比較されやすく、DIYは現場多忙で放置されがち",
    sportsSchoolFit: "併用チャネルとして有効だが、自社指名検索を受け切る母艦が必要",
  },
  {
    category: "Cyber Knock（本サービス）",
    label: "Cyber Knock Growth Web",
    initialCost: "49,800円（税抜）",
    monthlyCost: "29,800円（税抜）",
    primaryGoal: "スポーツスクールの体験申込数・問い合わせ数を毎月増やす",
    cvrAndMeasurement:
      "GA4イベント計測を初期標準搭載。AI支援で離脱分析・コピー・FAQ・地域SEOを毎月改善",
    sportsSchoolFit:
      "保護者の体験申込導線・高速表示・既存予約ツール協調まで一貫設計",
    highlight: true,
  },
]

export const DIFFERENTIATION_PILLARS: DifferentiationPillar[] = [
  {
    index: "01",
    tag: "CONVERSION ARCHITECTURE",
    title: "保護者の不安を先回り解消し、60秒で体験申込へ導くUI",
    summary:
      "スポーツスクール選びで保護者が離脱する「対象学年・曜日・拠点・総額費用・雨天振替・コーチの人柄」を、スマホ1画面ごとに迷わず確認できる情報構造で設計します。",
    details: [
      "学年×拠点の即時絞り込みから、希望クラスを引き継いだ体験申込フォームへ直結",
      "月謝だけでなく入会金・年会費・ウェア代まで隠さず提示し、体験後の不信感を排除",
      "スマホ下部追従CTAと48px以上のタップ領域で、片手操作でも迷わない導線",
    ],
  },
  {
    index: "02",
    tag: "AI-ASSISTED MONTHLY PDCA",
    title: "GA4ファネル計測 × AI分析による、毎月の継続改善",
    summary:
      "「テキスト差し替え代行」では終わりません。クラス検索、FAQ展開、フォーム着手、送信完了までのイベントを計測し、AI開発ワークフローで離脱箇所を特定して毎月改修します。",
    details: [
      "GA4のカスタムイベント（クラス選択・FAQ開閉・フォーム開始/完了）を初期標準実装",
      "春の新学期・夏休み短期・秋の体験会など季節需要に合わせた募集セクションを迅速更新",
      "更新や修正依頼はチャット1通で完結。現場コーチの管理画面操作は不要",
    ],
  },
  {
    index: "03",
    tag: "TECHNICAL SEO & SPEED",
    title: "地域名×種目検索で選ばれる技術品質と高速表示",
    summary:
      "重い汎用テンプレートではなく、Next.jsベースの軽量実装・Core Web Vitals良好水準・SportsActivityLocationやCourseの構造化データ・WCAG 2.2 AA準拠で土台を作ります。",
    details: [
      "「地域名＋種目＋小学生／年長」の検索意図に即した見出し・内部構造とMEO連動設計",
      "モバイル回線でもストレスなく開く高速表示で、InstagramやチラシQRからの直帰を抑制",
      "見やすさ・コントラスト・操作性をWCAG 2.2 AA基準で検証し、保護者の信頼感を高める",
    ],
  },
  {
    index: "04",
    tag: "OPEN & PRAGMATIC STACK",
    title: "既存予約ツールと協調し、不要な囲い込みをしない",
    summary:
      "高額な独自会員システムを無理に押し付けません。最小構成の高CVR体験フォームから始め、LINE公式アカウント・STORES予約・hacomono等とも柔軟に連携できます。",
    details: [
      "まずは体験申込フォーム＋メール/チャット即時通知で翌日から取りこぼしを防止",
      "すでに利用中のSTORES予約・hacomono・LINE公式への導線統合にも対応",
      "独自ドメインとご提供素材の権利はスクール様に帰属。透明な条件で運用",
    ],
  },
]

export const DEMO_CHECKPOINTS = [
  {
    number: "1",
    title: "学年×拠点の即時絞り込みとフォーム連動",
    description:
      "保護者目線で学年と拠点を選ぶと対象クラスだけが残り、「このクラスで無料体験」を押すと希望クラスが自動入力されたフォームへ移動します。",
  },
  {
    number: "2",
    title: "月謝以外の総額費用と安心基準の透明開示",
    description:
      "保護者が最も気にする「ウェア代・年会費・雨天振替・親当番の有無」を申込前に解消し、心理的ハードルを下げます。",
  },
  {
    number: "3",
    title: "GA4ファネル計測のリアルタイム可視化",
    description:
      "デモ画面上部の「GA4ログ」を開くと、クリック・絞り込み・FAQ展開・フォーム送信のGA4イベントが個人情報を除いた形で即座に記録される様子を確認できます。",
  },
] as const

export const PRICING_INCLUDES = {
  initial: [
    "現状ヒアリング・競合エリア調査・体験申込導線設計",
    "スポーツスクール特化Webサイト構築（スマホ最優先・WCAG 2.2 AA準拠）",
    "学年×拠点スケジュール設計・料金透明化セクション・保護者FAQ構成",
    "体験申込フォーム・自動通知連携（メール・Slack等のWebhook通知対応）",
    "GA4ファネルイベント計測設定・地域SEO内部最適化・構造化データ実装",
  ],
  monthly: [
    "GA4計測データに基づく月次ファネル診断・改善レポート共有",
    "AI支援を活用した月次CVR改善改修（見出し・CTA・FAQ・募集枠の調整）",
    "チャット1通での日常更新代行（スケジュール変更・体験日程・写真差し替え等）",
    "季節キャンペーン（新学期・夏期・紹介強化等）のセクション反映",
    "Googleビジネスプロフィール（MEO）と連動したローカルSEO改善アドバイス",
    "ホスティング・SSL・セキュリティ・表示速度（Core Web Vitals）の保守監視",
  ],
} as const

export const PROCESS_STEPS: ProcessStep[] = [
  {
    phase: "STEP 01",
    duration: "所要30分・無料",
    title: "現サイト・地域検索の無料診断とヒアリング",
    description:
      "現在のホームページ（またはSNS・チラシ）、対象エリア、募集したい学年枠を伺い、体験申込までの離脱要因と改善余地を具体的に整理します。",
    deliverables: ["現状の体験導線ボトルネック診断", "初期構築スコープとスケジュール案"],
  },
  {
    phase: "STEP 02",
    duration: "約10〜14日（目標）",
    title: "スポーツスクール特化サイト構築・計測実装",
    description:
      "ヒアリング内容と既存写真をもとに、構成案・デザイン・高CVR体験フォーム・GA4イベント計測・構造化データを一気通貫で構築します。",
    deliverables: ["スマホ最適化サイト一式", "体験申込フォーム＋即時通知", "GA4イベント計測基盤"],
  },
  {
    phase: "STEP 03",
    duration: "毎月継続",
    title: "計測データ×AI分析による月次集客改善",
    description:
      "公開後がスタートです。どの学年枠が見られ、どこで離脱したかを毎月確認し、コピー・FAQ・募集枠・地域SEOを継続的にアップデートします。",
    deliverables: ["月次ファネル振り返り", "改善仮説に基づくページ改修", "日常更新の代行対応"],
  },
]

export const LP_FAQS: FaqItem[] = [
  {
    id: "why-no-fake-cases",
    question: "導入事例や口コミが掲載されていないのはなぜですか？",
    answer:
      "本サービスは民間スポーツスクール特化の新規事業として立ち上げた初期検証フェーズにあり、まずは先行パートナー3社様との実証を最優先しているためです。架空の実績や誇張された成果数値は一切掲載せず、実際に操作できるスポーツスクール向けデモサイト、設計根拠、計測基盤の品質そのものでご判断いただけるようにしています。",
  },
  {
    id: "difference-from-raksul",
    question: "月額1万円前後の制作代行（ラクスル等）との違いは何ですか？",
    answer:
      "低価格の制作代行は「安価にサイトを保有し、指示通りの差し替えを代行すること」が中心です。Cyber Knockでは、初期設計の段階からスポーツスクールの保護者心理と体験申込CVRに特化し、GA4イベント計測・離脱分析・地域SEO・季節募集改善までを毎月回す点に月額29,800円の価値を置いています。",
  },
  {
    id: "photos-and-materials",
    question: "プロ撮影の写真や文章素材が手元になくても始められますか？",
    answer:
      "はい。スマートフォンの練習風景写真や既存のチラシ・Instagram投稿から構成と文章をこちらで整理します。実サイトでは保護者の安心感に直結するため、スマホで清潔感ある練習・コーチ写真を撮るための簡単な撮影チェックリストもお渡しします（プロの出張撮影が必要な場合は別途実費にて調整可能です）。",
  },
  {
    id: "existing-booking-tools",
    question: "すでにLINE公式アカウントやSTORES予約・hacomonoを使っています。併用できますか？",
    answer:
      "併用できます。会員管理や月謝決済を無理に置き換える必要はありません。ホームページで保護者の疑問を解消して体験意欲を高めたうえで、本サービスの60秒体験フォーム、または既存のSTORES予約・hacomono・LINE公式へシームレスに誘導する構成を選べます。",
  },
  {
    id: "contract-and-ownership",
    question: "契約期間の縛りや、解約時のドメイン・データの扱いはどうなりますか？",
    answer:
      "初期検証パートナー3社様については、まず3ヶ月間の改善サイクル（構築＋2回の月次検証）を目安としながら、具体的な契約条件は事前合意のうえで透明に定めます。スクール様ご契約の独自ドメインおよびご提供いただいた写真・文章素材の権利はすべてスクール様に帰属し、無理な囲い込みは行いません。",
  },
  {
    id: "consultation-flow",
    question: "フォーム送信後にしつこい営業電話は来ますか？",
    answer:
      "来ません。原則としてご記入いただいたメールアドレス宛に、現サイト診断メモまたはオンライン説明の日程候補をお送りします。なお、公開前のプレビュー検証環境では外部通知を無効化しており、お客様へ無断送信されることはありません。",
  },
]
