/**
 * Copy for the Growth Web service LP (/services/growth-web).
 *
 * Every promise here must stay consistent with the real inquiry form
 * (components/growth-web/lp/ServiceInquiryForm.tsx), PRICING_INCLUDES,
 * PROCESS_STEPS and LP_FAQS in ./service-lp.ts. tests/growth-web-lp.test.mjs
 * checks the required-field wording against the form.
 *
 * Text rendered in the mincho display face must live in SERIF_TEXT: the font
 * subset (scripts/build-growth-web-fonts.py) only contains those glyphs.
 */

/** Headings rendered with the "GW Mincho" subset. Keep in sync with the components. */
export const SERIF_TEXT = {
  heroTitleLine1: "サイトに、",
  heroTitleEm: "専属コーチ",
  heroTitleTail: "を。",
  howTitleLine1: "毎月、サイトの",
  howTitleLine2: "フォームを直す。",
  trustTitleLine1: "依頼する前に、",
  trustTitleLine2: "確かめられるもの。",
  faqTitle: "導入前によくいただくご質問",
  applyTitleLine1: "無料サイト診断の",
  applyTitleLine2: "お申し込み",
} as const

/** Required fields of ServiceInquiryForm (text inputs marked `required`). */
export const INQUIRY_REQUIRED_FIELD_LABELS = ["スクール名", "お名前", "メールアドレス"] as const

export const LP_HERO = {
  eyebrow: "民間スポーツスクール経営者のための Web集客改善サービス",
  kicker: "スポーツスクールの",
  definition: ["サイト制作", "毎月の計測と改修", "地域検索対策"],
  definitionNote: "定額・先行3社",
  ledeLead: "公開して終わりにせず、保護者がサイトのどこで迷ったかを",
  ledeStrong: "毎月計測し、体験申込が増えるように直し続けます。",
  ctaLabel: "無料サイト診断を申し込む",
  demoLabel: "実働デモサイトを見る",
  assurances: [
    `必須：${INQUIRY_REQUIRED_FIELD_LABELS.join("・")}＋プライバシーポリシーへの同意`,
    "ご連絡は原則メール。営業電話はしません",
  ],
} as const

export interface FormCheckNote {
  id: "c1" | "c2" | "c3" | "c4"
  side: "l" | "r"
  title: string
  body: string
  metric: string
  hot?: boolean
}

/** Annotations on the sample (fictional) school site in the hero figure. */
export const FORM_CHECK_NOTES: FormCheckNote[] = [
  { id: "c1", side: "l", title: "検索で見つかる", body: "「少年野球 地域名 小3」の検索から、その学年向けのページへ。", metric: "検索語と流入ページ" },
  { id: "c2", side: "r", title: "学年・曜日で探せる", body: "通えるクラスに、迷わず辿り着ける。", metric: "絞り込みの操作" },
  { id: "c3", side: "l", title: "費用を時間割の隣に", body: "月謝以外の費用が見えず、比較の途中で離れやすい箇所。", metric: "料金・FAQの閲覧", hot: true },
  { id: "c4", side: "r", title: "迷わず体験申込", body: "入力を最小限にしたフォームへ。", metric: "申込の開始と完了" },
]

export const HOW_IT_WORKS = {
  label: "How it works",
  sub: "コーチが練習のたびにフォームを見るように、保護者がどこで迷ったかを毎月見て、サイトを直します。",
  subStrong: "スクールは、レポートを確認して変更点をチャットで送るだけです。",
  steps: [
    { n: "01", title: "計測する", body: "検索・閲覧・申込の動きをGA4で記録。個人を特定する情報は送りません。" },
    { n: "02", title: "止まる場所を見つける", body: "どの学年・どのページで離れたかを特定し、原因の仮説を立てます。", hot: true },
    { n: "03", title: "直す", body: "見出し・FAQ・ページ構成・募集枠を改修。時間割や写真の更新もチャット1通で対応。" },
    { n: "04", title: "確かめる", body: "翌月の計測で変化を確認。効果がなければ、別の打ち手に切り替えます。" },
  ],
  again: "翌月は、次に止まっている場所へ。新学年・夏期など募集期に合わせて優先順位を変えます。",
  report: {
    title: "月次レポート",
    caption: "毎月お送りするレポートの見本",
    rows: [
      { label: "今月見えたこと", body: "スマホで時間割を見た保護者が、料金を見ずに離れる動きが目立つ。" },
      { label: "今月直したこと", body: "月謝・入会金・用具代を各クラスの横に表示。振替ルールをFAQに追加。" },
      { label: "来月試すこと", body: "「小3・火曜」のように学年×曜日で探す保護者向けのページを追加。" },
    ],
    note: "※架空のスクールを想定した記載例です。実在の顧客の結果ではありません。",
  },
  roles: {
    school: ["最初の無料診断・ヒアリング", "時間割や写真の変更をチャットで送る", "月次レポートを確認する"],
    us: ["サイト構築と体験申込フォーム", "GA4計測と月次レポート", "見出し・FAQ・募集ページの改修", "地域検索・Googleビジネスプロフィール"],
  },
} as const

export const TRUST = {
  lead: "先行パートナー3社を募集中のため、導入事例はまだありません。代わりに、実際に動くデモと、提供範囲・成果物の見本を公開しています。",
  demo: {
    label: "Live demo",
    title: "実働デモサイト",
    body: "架空のスクールを想定した、実際に動くサイトです。保護者の立場で操作し、どこが計測されるかも確認できます。",
    points: ["学年・曜日でのクラス絞り込み", "料金・振替・FAQの表示", "体験申込フォーム（送信はされません）"],
    cta: "デモサイトを開く",
  },
  scope: {
    label: "Scope",
    title: "提供範囲",
    initial: "サイト構築・料金/時間割の整理・体験申込フォームと通知・GA4計測・構造化データ",
    monthly: "月次レポート・見出しやFAQの改修・チャットでの更新代行・季節募集の反映・保守監視",
    cta: "料金と契約条件",
  },
  deliverables: {
    label: "Deliverables",
    title: "成果物の見本",
    body: "無料診断では、現サイトの体験申込までの流れと改善の優先順位をまとめてお送りします。毎月のレポートは見本を公開しています。",
    cta: "月次レポートの見本",
  },
} as const

export const PRICING_TERMS = {
  pilot: "先行3社の価格です。",
  contract: "最初の3ヶ月（構築＋2回の月次改善）を目安に、条件は事前に合意して決めます。",
  rights: "独自ドメインとご提供の写真・文章の権利はスクールに帰属します。",
  roiSummary: "採算の参考試算を開く",
  roiNote: "入力した仮定に基づく参考値です。体験申込数・入会数・収益を保証するものではありません。",
} as const

export const APPLY = {
  lead: "現在のサイト（なければSNSやチラシ）をもとに、体験申込までの流れと改善の優先順位をお伝えします。所要30分・無料です。",
  afterSubmit: "送信後は、ご入力のメールアドレスに原則メールでご連絡します。営業電話はしません。",
} as const
