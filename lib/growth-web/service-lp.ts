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

export const BUILD_TIMELINE = {
  duration: "約3〜5営業日（目安）",
  note: "必要な情報・素材が揃ってからの期間です。公開日は確認・修正状況により異なります。",
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
    duration: BUILD_TIMELINE.duration,
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
    id: "difference-from-low-cost-updates",
    question: "月額1万円前後の制作代行・更新代行サービスとの違いは何ですか？",
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
