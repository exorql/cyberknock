import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, ArrowUpRight, ArrowDownRight, Check } from "lucide-react"
import { ContactForm } from "@/components/contact-form"
import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import { projectSteps } from "@/components/development/project-steps"
import { DemoVideoPlayer } from "@/components/development/demo-video-player"
import { InsightsEntryPoints } from "@/components/insights-entrypoints"
import { site } from "@/lib/site"
import styles from "./development.module.css"

const title = "AI開発・PoC・Web／モバイルアプリ受託開発｜動画解析・骨格推定・マルチモーダルAI | Cyber Knock"
const description =
  "画像・動画AI実用性判定は60万円、稼働中のAI品質・原価改善レビューは月額20万円（いずれも税別）。自社アプリの開発・運用経験をもとに、動画解析・生成AIの有償検証からWeb・モバイルへの本番実装まで支援します。"
const ogImage = "/images/og/cyberknock-b2b.png"

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/ai-development" },
  openGraph: {
    title,
    description,
    url: "https://cyberknock.jp/ai-development",
    siteName: "Cyber Knock",
    type: "website",
    locale: "ja_JP",
    images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: [ogImage],
  },
}

const capabilities = [
  {
    number: "01",
    code: "VIDEO, POSE & TRACKING AI",
    title: "動画解析・骨格推定・動作分析AI",
    description:
      "スマートフォン撮影動画や既存カメラ録画からの骨格推定・姿勢推定、フォームや作業動作の評価、複数人映像の人物追跡（トラッキング）や特定シーンの自動抽出まで設計・実装します。撮影条件の整理から評価基準の策定まで対応します。",
    scope: "対応例：スポーツ・フィットネス動作解析、リハビリ姿勢評価、作業教育映像の振り返り、シーン抽出など",
  },
  {
    number: "02",
    code: "MULTIMODAL & GEN AI",
    title: "マルチモーダルAI・生成AI組み込み",
    description:
      "画像・動画・文書・数値を扱うマルチモーダルLLMを、既存のWebサービスや業務システム、モバイルアプリへ統合します。既存アプリへ1機能を追加する場合は、利用するAPI、送信できるデータと閲覧権限、失敗時に画面へ返す内容を整理します。貴社が担当する画面・認証と、当社が実装する出力検証や再試行の範囲を分けて見積もります。",
    scope: "対応例：写真や動画解析結果の構造化レポート生成、画像と数値の複合判定、業務知識の検索・要約支援など",
  },
  {
    number: "03",
    code: "VALIDATION, POC & MVP",
    title: "小規模技術検証・PoC・新規事業MVP開発",
    description:
      "手元のサンプルデータで実現可能性を早期に確かめる小規模な技術検証から、評価基準を定めた本格PoC、実ユーザー向けに課金・運用まで検証する新規事業MVP開発まで対応。次の事業判断に使える明確な検証結果とプロダクトを残します。",
    scope: "成果物例：技術検証プロトタイプ、評価データに対する達成・未達レポート、最小実用プロダクト（MVP）",
  },
  {
    number: "04",
    code: "WEB, MOBILE & GROWTH",
    title: "Web・iOS・Android開発と公開後改善",
    description:
      "AIモデルやAPI単体で終わらせず、現場担当者やエンドユーザーが迷わず使える画面（Next.js / React / React Native / TypeScript）とクラウド基盤を一貫開発。ストア公開申請から公開後のGA4計測・SEO・継続改善まで支えます。",
    scope: "対応範囲：企画・UI/UX設計、Web・モバイル実装、API・認証・サブスク課金基盤、ストア公開・運用改善",
  },
] as const

const consultationShortcuts = [
  {
    service: "sports-ai",
    label: "動画解析・骨格推定の実現性を相談する",
  },
  {
    service: "ai-improvement",
    label: "AI機能の組み込み・品質や原価の改善を相談する",
  },
  {
    service: "product",
    label: "新規事業MVP・アプリ開発を相談する",
  },
  {
    service: "advisory",
    label: "要件整理・技術壁打ちから相談する",
  },
] as const

const standardOffers = [
  {
    name: "画像・動画AI実用性判定",
    price: "60万円",
    audience: "手元の画像や録画でAI機能を公開できるか判断したい、SaaS・業務アプリの責任者や開発会社向けです。",
    requirements: "利用権限のある素材、成功例と失敗例、業務上の正解を判断できる方をご用意ください。画像認識・画像解析では、照明や撮影角度をそろえた場合と変えた場合で、誤検出・見逃しと人の確認が必要な条件を調べます。",
    scope: "1用途・1種類の入力・1種類の出力に絞り、最大2方式を比較。判定する場面などを1評価単位と定め、最大30単位、かつ動画は合計15分または画像は50枚までとします。",
    delivery: "評価仕様、データと方式の版、再現手順、失敗例、原価・遅延と測定できなかった項目をレポートにまとめます。60分の報告会で、採用・条件付き採用・見送りの根拠と次の検証条件を説明します。",
    exclusions: "大量の正解付け、独自モデルの学習、画面開発・本番連携は個別見積もりです。判定は合意した評価素材と条件に限ります。",
    detail: { href: "#report-sample", label: "評価レポートの見本を読む（架空の例）" },
    consultation: { service: "sports-ai", label: "検証したい画像・動画の用途を相談する" },
  },
  {
    name: "AI品質・原価改善レビュー",
    price: "月額20万円",
    audience: "運用中のAI機能で、モデルやプロンプトを更新するか決めたいチーム向けです。改善を実装する担当者がいることが前提です。",
    requirements: "現行版のモデル・設定、変更候補、正解と判断基準を付けた固定データ、失敗や再処理・費用が分かるログをご用意ください。同等の評価資産があれば、初回の実用性判定を経ずに依頼できます。",
    scope: "1サービスで固定30評価単位以内、合計15分以内の動画または50枚以内の画像を使用します。現行版と候補版の最大2版を月1回比較し、失敗分の再実行は5評価単位まで各1回です。",
    delivery: "誤判定・未判定の変化、待ち時間、再試行を含む利用可能な結果1件あたりの原価を比較できる範囲で報告します。変更の採否と、実装担当者が次に直す項目の優先順位をお渡しします。",
    exclusions: "初回は単月です。新規データの追加、基準の変更、改善実装、常時監視は個別見積もりです。",
    detail: { href: "/ai-development/ai-quality-evaluation", label: "品質評価の進め方と必要なログを見る" },
    consultation: { service: "ai-improvement", label: "運用中のAI機能の評価を相談する" },
  },
] as const

const developmentPricing = [
  {
    title: "小規模技術検証",
    consultation: { service: "sports-ai", label: "動画解析の技術検証を相談する" },
    price: "30万〜80万円",
    audience: "手元の動画・画像で、AIを業務に使えるか判断したい方へ。",
    scope: "画像・動画AI実用性判定は、この範囲に含まれる標準商品です。対象や評価方法が標準条件を外れるときは、必要な検証項目に合わせて見積もります。",
  },
  { title: "本格PoC", price: "80万〜250万円", audience: "評価基準を定め、本開発の投資判断をしたい方へ。", scope: "成果物：試作パイプライン、定量評価・本開発の要件整理。評価範囲は事前合意。" },
  { title: "新規事業MVP開発", price: "150万〜600万円", audience: "最小限の機能で実ユーザーに価値を検証したい方へ。", scope: "成果物：実用Web・モバイルアプリ。低価格帯はWeb単体・AI機能1系統などに限定。" },
  { title: "本開発・既存システム統合", price: "個別見積もり", audience: "商用環境への導入や既存システムとの連携を進めたい方へ。", scope: "成果物：要件に応じた実装・テスト・リリース支援。" },
  {
    title: "継続開発・運用改善",
    consultation: { service: "ai-improvement", label: "運用中のAI機能の改善を相談する" },
    price: "個別見積もり",
    audience: "運用中のAI機能で、更新のたびに品質や処理原価を見直したい方へ。",
    scope: "標準の月次レビューから先の改善実装、機能追加、監視・保守は、変更の頻度と担当範囲に応じて個別に見積もります。",
  },
] as const

const faqs = [
  {
    q: "仕様書や予算が決まっていなくても相談できますか？",
    a: "はい。解決したい業務課題、想定利用者、現在の運用状況から一緒に整理できます。実現可能性の切り分けや、最初に検証・実装すべき範囲をご案内します。",
  },
  {
    q: "すべての案件でPoC（技術検証）を実施する必要がありますか？",
    a: "いいえ。既存技術やAPIで実現方式が明確な場合は、PoCを挟まず要件定義やMVP実装から進める方が合理的です。映像条件やAIの認識品質に不確実性がある場合のみ、小規模な技術検証やPoCをご提案します。",
  },
  {
    q: "スポーツ以外の業界のAI開発やWeb・モバイル開発も相談できますか？",
    a: "はい。現在公開している実績は自社アプリ「AIスポーツトレーナー」および「コレステAI」の2プロダクトです。そこで培った動画解析・骨格推定、マルチモーダルAIの構造化制御、Web・iOS・Androidアプリ開発と運用改善の技術基盤を活かし、業種を問わずご相談に対応しています。",
  },
  {
    q: "初回の問い合わせフォームで、検証用の動画や機密データを送る必要はありますか？",
    a: "いいえ、初回フォームでの動画や機密資料の添付は不要です。まずは文章で課題の概要をお知らせください。実データの確認が必要な段階になりましたら、NDA（秘密保持契約）や安全な共有・削除手順を合意したうえでお預かりします。",
  },
  {
    q: "費用や期間、成果物の権利はどのように決まりますか？",
    a: "標準条件でお引き受けする場合、画像・動画AI実用性判定は60万円（税別）、AI品質・原価改善レビューは月額20万円（税別）です。合意した範囲で固定見積もりを提示し、条件外の開発や調査は個別に見積もります。日程は素材の受領時期を確認して決めます。NDA、契約形態（準委任・請負）、成果物および知的財産権の帰属は、着手前に契約書で明確に定めます。",
  },
] as const

const schema = [
  {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "AI開発・PoC・Web／モバイルアプリ受託開発",
    serviceType:
      "動画解析・骨格推定AI開発、マルチモーダルAI・生成AI組み込み、小規模技術検証・PoC・MVP開発、Web・iOS・Androidアプリ開発と運用改善",
    provider: {
      "@type": "Organization",
      "@id": "https://cyberknock.jp/#organization",
      name: "Cyber Knock",
      url: "https://cyberknock.jp",
    },
    areaServed: "JP",
    url: "https://cyberknock.jp/ai-development",
    description,
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map(({ q, a }) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: { "@type": "Answer", text: a },
    })),
  },
]

export default function AiDevelopmentPage() {
  return (
    <div className={styles.root}>
      <SiteHeader />
      <main id="main-content">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, "\\u003c") }}
        />

        {/* ① ファーストビュー */}
        <section className={styles.hero} aria-labelledby="development-title">
          <div className={`wrap ${styles.heroLayout}`}>
            <div className={styles.heroCopy}>
              <p className={styles.eyebrow}>B2B AI &amp; PRODUCT DEVELOPMENT</p>
              <h1 id="development-title" className={styles.heroTitle}>
                動画解析・生成AIを、<span><strong>現場で使われるプロダクトへ。</strong></span>
              </h1>
              <p className={styles.heroLead}>
                AI機能開発、動画解析、Web・モバイルアプリ開発。動画・画像解析AIや既存サービスへの生成AI組み込み、必要に応じた技術検証（PoC）からWeb・iOS・Androidアプリの実装・運用まで一貫して支援します。
              </p>
              <div className={styles.heroActions}>
                <Link
                  href="#contact"
                  className={`button ${styles.primary}`}
                  data-track="cta_click"
                  data-location="ai_development"
                >
                  開発について相談する（無料） <ArrowUpRight size={19} aria-hidden="true" />
                </Link>
                <Link
                  href="#product-proof"
                  className={`text-link ${styles.secondary}`}
                  data-track="demo_click"
                  data-location="ai_development"
                >
                  実際の技術デモを見る <ArrowDownRight size={18} aria-hidden="true" />
                </Link>
                <Link href="#standard-offers" className={`text-link ${styles.secondary}`}>
                  検証・レビューの料金を見る <ArrowDownRight size={18} aria-hidden="true" />
                </Link>
              </div>
              <p className={styles.heroMicro}>
                仕様・予算が未定でも相談可能 ／ 初回フォームで機密動画の添付は不要 ／ 代表エンジニアが直接対応
              </p>
            </div>

            <figure className={styles.heroProofStage} aria-label="自社開発・運用アプリの実画面による技術証明">
              <div className={styles.stageTop}>
                <span>FIRST-PARTY PRODUCT PROOF</span>
                <span className={styles.stageStatus}>iOS / Android 自社開発・運用中</span>
              </div>
              <div className={styles.stageScreens}>
                <div className={styles.stagePhoneSecondary}>
                  <img
                    src="/images/cases/01-analysis.jpg"
                    width={333}
                    height={720}
                    loading="eager"
                    decoding="async"
                    alt="自社アプリ実画面：動画からの骨格・関節角度・動作解析表示"
                  />
                  <span>01 動画・姿勢解析</span>
                </div>
                <div className={styles.stagePhonePrimary}>
                  <img
                    src="/images/product/pitching-feedback.webp"
                    srcSet="/images/product/pitching-feedback-320.webp 320w, /images/product/pitching-feedback-480.webp 480w, /images/product/pitching-feedback.webp 640w"
                    sizes="(max-width: 600px) 46vw, (max-width: 900px) 28vw, 220px"
                    width={640}
                    height={1385}
                    loading="eager"
                    fetchPriority="high"
                    decoding="auto"
                    alt="自社アプリ実画面：動画解析結果に基づく生成AIフィードバックと評価UI"
                  />
                  <span>02 生成AIフィードバック・UI</span>
                </div>
              </div>
              <figcaption className={styles.stageCaption}>
                <strong>代表事例：自社アプリ「AIスポーツトレーナー」実画面</strong>
                <p>
                  動画解析・生成AIの出力制御・モバイルUI・クラウド運用まで自社で一貫開発。この技術基盤を、貴社の業務・サービス開発に応用します。
                </p>
              </figcaption>
            </figure>
          </div>
        </section>

        <section id="standard-offers" className={styles.chapter} aria-labelledby="standard-offers-title">
          <div className="wrap">
            <h2 id="standard-offers-title" className={styles.chapterTitle}>AI検証・改善の標準料金</h2>
            <p className={styles.chapterLead}>
              新しいAI機能を採用する判断と、運用中の機能を更新する判断。それぞれに必要なデータと納品物を定めた、法人向けの標準商品です。
            </p>
            <div className={styles.offerGrid}>
              {standardOffers.map((offer) => (
                <article className={styles.offerCard} key={offer.name}>
                  <h3>{offer.name}</h3>
                  <p className={styles.offerPrice}>{offer.price}<small>（税別）</small></p>
                  <p>{offer.audience}</p>
                  <dl className={styles.offerTerms}>
                    <dt>ご用意いただくもの</dt><dd>{offer.requirements}</dd>
                    <dt>検証範囲</dt><dd>{offer.scope}</dd>
                    <dt>納品物</dt><dd>{offer.delivery}</dd>
                    <dt>適用条件・対象外</dt><dd>{offer.exclusions}</dd>
                  </dl>
                  <div className={styles.offerLinks}>
                    <Link href={offer.detail.href} className={styles.challengeGuideLink}>
                      {offer.detail.label} <ArrowRight size={15} aria-hidden="true" />
                    </Link>
                    <Link
                      href={`?service=${offer.consultation.service}#contact`}
                      className={styles.consultBridgeLink}
                      data-track="cta_click"
                      data-location="ai_development"
                      data-service={offer.consultation.service}
                    >
                      {offer.consultation.label} <ArrowDownRight size={16} aria-hidden="true" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
            <p className={styles.disclosure}>
              <strong>無料相談の範囲</strong>　課題の概要を伺い、必要に応じて初回面談（30分以内・1回）で、適用条件と概算を確認します。
              実データの解析、コード調査、比較検証は、データの扱いと見積もりに合意してから有償で行います。
              標準条件を超える場合は<Link href="#pricing" className="subtle-link">開発サービスの参考費用</Link>をご覧ください。
            </p>
          </div>
        </section>

        {/* ② 実運用実績＋技術デモ */}
        <section
          id="product-proof"
          className={`${styles.chapter} ${styles.chapterToned}`}
          aria-labelledby="product-proof-title"
        >
          <div className="wrap">
            <div className={`${styles.chapterHead} ${styles.productProofHead}`}>
              <p className={styles.sectionCode}>01 / OPERATIONAL PROOF &amp; DEMO</p>
              <div>
                <h2 id="product-proof-title" className={`${styles.chapterTitle} ${styles.productProofTitle}`}>
                  AIを作るだけでなく、実際に運用してきた実績。
                </h2>
                <p className={styles.chapterLead}>
                  試作で終わらず、一般ユーザーが日常的に使う商用プロダクトとして「AIスポーツトレーナー」（動画・姿勢解析）と「コレステAI」（食事画像・健診データ×マルチモーダルLLM）の2プロダクトを企画・開発・公開・継続運用しています。受託先の非公開案件や未契約の検証を実績として掲載することはありません。
                </p>
              </div>
            </div>

            <div className={styles.proofStack}>
              <div className={styles.proofSummaryCard}>
                <div className={styles.proofSummaryMain}>
                  <div className={styles.proofCardTop}>
                    <span>REPRESENTATIVE PRODUCT 01 / 動画解析・骨格推定×生成AI</span>
                    <small>iOS / Android 公開・運用中</small>
                  </div>
                  <h3>AIスポーツトレーナー（自社企画・開発・運用）</h3>
                  <p>
                    スマートフォンで撮影した動画から姿勢・動作情報を解析し、生成AIによる構造化フィードバックと練習メニュー提案までを届けるモバイルアプリです。アプリのUI実装、クラウド・AI推論基盤、課金、公開後の品質・処理時間・APIコストの改善、SEOによる集客運用まで代表が一貫して担当しています。
                  </p>
                  <ul className={styles.proofPoints}>
                    <li>
                      <Check size={16} aria-hidden="true" />
                      <span>
                        <strong>本番環境での継続運用：</strong>
                        多様な撮影角度・端末環境での入力検証、解析不能時のハンドリング、出力の構造化・検証を実装
                      </span>
                    </li>
                    <li>
                      <Check size={16} aria-hidden="true" />
                      <span>
                        <strong>公開ストアで実物を確認可能：</strong>
                        App Store・Google Playにて公開・運用中のプロダクトとして実際の動作・UIをご確認いただけます
                      </span>
                    </li>
                  </ul>
                </div>
                <div className={styles.proofSummaryLinks}>
                  <p className={styles.proofLinksHeading}>実績・ストア詳細</p>
                  <Link className={`text-link ${styles.proofAction}`} href="/cases/ai-sports-trainer" data-track="case_study_click" data-location="ai_development">
                    自社プロダクトの開発・運用事例 <ArrowUpRight size={18} aria-hidden="true" />
                  </Link>
                  <Link className={`text-link ${styles.proofAction}`} href="/cases/ai-sports-trainer#quality-evaluation" data-track="case_study_click" data-location="ai_development">
                    分析結果を公開するための品質評価を読む <ArrowUpRight size={18} aria-hidden="true" />
                  </Link>
                  <div className={styles.proofStoreRow}>
                    <a
                      href={site.appStore}
                      target="_blank"
                      rel="noopener noreferrer"
                      data-track="store_click"
                      data-location="ai_development"
                      data-store="app_store"
                    >
                      App Store <ArrowUpRight size={14} aria-hidden="true" />
                      <span className="sr-only">（新しいタブ）</span>
                    </a>
                    <a
                      href={site.googlePlay}
                      target="_blank"
                      rel="noopener noreferrer"
                      data-track="store_click"
                      data-location="ai_development"
                      data-store="google_play"
                    >
                      Google Play <ArrowUpRight size={14} aria-hidden="true" />
                      <span className="sr-only">（新しいタブ）</span>
                    </a>
                  </div>
                </div>
              </div>

              <div className={`${styles.proofSummaryCard} ${styles.cholesteProofCard}`} id="proof-choleste-ai">
                <div className={styles.proofSummaryMain}>
                  <div className={styles.proofCardTop}>
                    <span>REPRESENTATIVE PRODUCT 02 / マルチモーダルAI・ヘルスケア領域</span>
                    <small>iOS / Web 公開・運用中</small>
                  </div>
                  <h3>コレステAI（自社企画・開発・運用）</h3>
                  <p>
                    食事写真や健康診断結果の画像をマルチモーダルLLMで解析し、脂質バランスや生活習慣の振り返りを支援する商用iOSアプリおよびWebメディアです。企画設計・モバイル実装から、構造化JSON出力検証、安全表現の制御、サブスク課金、公開後のSEO・CRO運用改善まで自社で継続しています。
                  </p>
                  <ul className={styles.proofPoints}>
                    <li>
                      <Check size={16} aria-hidden="true" />
                      <span>
                        <strong>マルチモーダルAIの実務制御：</strong>
                        画像と数値入力のばらつきを踏まえた構造化出力、医療行為に踏み込まないガードレール、APIコスト最適化を運用
                      </span>
                    </li>
                    <li>
                      <Check size={16} aria-hidden="true" />
                      <span>
                        <strong>企画〜公開・運用改善までの一貫実証：</strong>
                        スポーツ以外の一般向け領域でも、要件定義からストア公開・集客改善・継続運用まで完結できる技術基盤を証明
                      </span>
                    </li>
                  </ul>
                </div>
                <div className={styles.proofSummaryLinks}>
                  <p className={styles.proofLinksHeading}>プロダクト画面・公開先</p>
                  <figure className={styles.cholesteStoreFigure}>
                    <figcaption className={styles.cholesteStoreCaption}>
                      App Store掲載スクリーンショット
                      <span className={styles.cholesteScrollHint}>左右にスクロールして表示</span>
                    </figcaption>
                    <ul className={styles.cholesteStoreGallery} aria-label="コレステAIのApp Store掲載画面" tabIndex={0}>
                      <li>
                        <img src="/images/product/choleste-store-meal-analysis.webp" alt="食事写真をAIが分析する画面" width={660} height={1434} loading="lazy" decoding="async" />
                      </li>
                      <li>
                        <img src="/images/product/choleste-store-lipid-report.webp" alt="脂質バランスをレーダーチャートと評価で見える化する食事AIレポート" width={660} height={1434} loading="lazy" decoding="async" />
                      </li>
                      <li>
                        <img src="/images/product/choleste-store-lab-history.webp" alt="コレステロールなどの検査値と推移グラフを記録する画面" width={660} height={1434} loading="lazy" decoding="async" />
                      </li>
                    </ul>
                  </figure>
                  <a
                    className={`text-link ${styles.proofAction}`}
                    href={site.cholesteUrl}
                    target="_blank"
                    rel="noopener"
                  >
                    コレステAI公式サイトを見る <ArrowUpRight size={18} aria-hidden="true" />
                    <span className="sr-only">（新しいタブ）</span>
                  </a>
                  <div className={styles.proofStoreRow}>
                    <a
                      href={site.cholesteAppStore}
                      target="_blank"
                      rel="noopener noreferrer"
                      data-track="store_click"
                      data-location="ai_development"
                      data-store="app_store"
                    >
                      App Store <ArrowUpRight size={14} aria-hidden="true" />
                      <span className="sr-only">（新しいタブ）</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <DemoVideoPlayer />
          </div>
        </section>

        {/* ③ 法人向けの開発対応領域 */}
        <section id="capabilities" className={styles.chapter} aria-labelledby="challenges-title">
          <div className="wrap">
            <div className={styles.chapterHead}>
              <p className={styles.sectionCode}>02 / CAPABILITIES FOR BUSINESS</p>
              <div>
                <h2 id="challenges-title" className={styles.chapterTitle}>
                  AI受託開発の対応領域。
                </h2>
                <p className={styles.chapterLead}>
                  自社プロダクトで構築・運用してきた動画解析・生成AI・アプリ開発の技術基盤をもとに、スポーツ分野に限らず幅広い業界のAI導入・新規プロダクト開発を支援します。
                </p>
              </div>
            </div>
            <div className={styles.challengeGrid}>
              {capabilities.map((item) => (
                <article key={item.number} className={styles.challengeCard}>
                  <span>
                    {item.number} / {item.code}
                  </span>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                  <p className={styles.challengeScope}>{item.scope}</p>
                  {item.number === "01" && (
                    <Link
                      href="/insights/ai-video-analysis-development-request"
                      className={styles.challengeGuideLink}
                      data-track="insight_click"
                      data-location="content"
                      data-guide="ai-video-analysis-development-request"
                    >
                      動画解析AIの開発依頼で確認する条件 <ArrowUpRight size={16} aria-hidden="true" />
                    </Link>
                  )}
                </article>
              ))}
            </div>
            <div className={styles.consultBridge}>
              <div className={styles.consultBridgeHead}>
                <h3>テーマ別・技術相談窓口</h3>
                <p>検討中のテーマを選ぶと、下の相談フォームで該当カテゴリが自動選択されます。</p>
              </div>
              <div className={styles.consultBridgeActions}>
                {consultationShortcuts.map((shortcut) => (
                  <Link
                    key={shortcut.service}
                    href={`?service=${shortcut.service}#contact`}
                    className={styles.consultBridgeLink}
                    data-track="cta_click"
                    data-location="ai_development"
                    data-service={shortcut.service}
                  >
                    {shortcut.label} <ArrowDownRight size={16} aria-hidden="true" />
                  </Link>
                ))}
              </div>
            </div>
            <p className={styles.disclosure}>
              <strong>実績と将来対応領域の明確な区別：</strong>
              現在公開している開発・運用実績は、自社プロダクト「AIスポーツトレーナー」および「コレステAI」の2プロダクトです。対象業種や業務に関する記述は、両プロダクトで培った技術基盤（動画解析・骨格推定、マルチモーダルAIの出力制御、Web・モバイル実装と運用改善）を応用できる開発対応領域の説明であり、未契約の相談や非公開案件を導入実績として表現するものではありません。
            </p>
          </div>
        </section>

        {/* ④ 開発の進め方と体制 */}
        <section
          className={`${styles.chapter} ${styles.chapterDark}`}
          aria-labelledby="development-method-title"
          id="development-method"
        >
          <div className="wrap">
            <div className={styles.chapterHead}>
              <p className={styles.sectionCode}>03 / PROCESS &amp; GOVERNANCE</p>
              <div>
                <h2 id="development-method-title" className={styles.chapterTitle}>
                  開発の進め方と体制。
                </h2>
                <p className={styles.chapterLead}>
                  初回相談で課題と実現したいことを整理し、必要に応じて技術検証から実装へ進めます。対象データと評価基準を確認しながら、段階的にリスクを抑えます。
                </p>
              </div>
            </div>
            <div className={styles.stepGrid}>
              {projectSteps.map((item) => (
                <article className={styles.stepCard} key={item.label}>
                  <span>{item.label}</span>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </article>
              ))}
            </div>
            <div className={styles.requirements}>
              <div className={styles.requirementBox}>
                <h3>代表エンジニアが設計・実装・運用改善まで直接担当</h3>
                <ul>
                  <li>要件整理・技術選定から、AI機能・Web／モバイル・クラウド実装、公開後の継続改善まで代表（渡辺 晴仁）が一貫して担当します</li>
                  <li>自社アプリ2本の企画・公開・課金・計測運用で得た知見を活かし、応答速度・APIコスト・利用継続まで見据えて設計します</li>
                  <li>既存の社内開発チームと連携し、AI機能や特定モジュールのみを分担する体制にも対応可能です</li>
                </ul>
                <p className={styles.requirementLinkRow}>
                  <Link href="/#profile" className={styles.caseCrosslink}>
                    代表プロフィール・経歴を見る <ArrowRight size={15} aria-hidden="true" />
                  </Link>
                </p>
              </div>
              <div className={styles.requirementBox}>
                <h3>安心してご相談いただくために</h3>
                <p className={styles.requirementSummary}>
                  初回相談・概算見積もりは無料です。機密情報の取り扱いはNDA締結に対応しています。
                  実データを用いた検証・試作は、内容と費用を事前に合意したうえで有償にて実施します。
                </p>
                <p className={styles.requirementLinkRow}>
                  <Link href="/security" className={styles.caseCrosslink}>
                    AIの限界とデータの取り扱い方針 <ArrowRight size={15} aria-hidden="true" />
                  </Link>
                </p>
              </div>
            </div>
            <p className={styles.caseAside}>
              ※すべての業界・撮影条件の動画を無条件に解析できることや、一律の認識精度・納期を事前に保証するものではありません。対象データと成功基準を確認したうえで、実現可能な範囲をご提案します。
            </p>
          </div>
        </section>

        {/* ⑤ FAQ＋お問い合わせ */}
        <section id="pricing" className={styles.chapter} aria-labelledby="pricing-title">
          <div className="wrap">
            <div className={styles.chapterHead}>
              <p className={styles.sectionCode}>04 / ESTIMATED COST</p>
              <div>
                <h2 id="pricing-title" className={styles.chapterTitle}>AI開発の参考費用。</h2>
                <p className={styles.chapterLead}>小さな技術検証から商用サービスの開発まで、必要な範囲に合わせてご提案します。</p>
              </div>
            </div>
            <div className={styles.priceGrid}>
              {developmentPricing.map((item) => (
                <article className={styles.challengeCard} key={item.title}>
                  <h3>{item.title}</h3>
                  <p className={styles.priceAmount}>{item.price}</p>
                  <p>{item.audience}</p>
                  <p className={styles.challengeScope}>{item.scope}</p>
                  {"consultation" in item && (
                    <Link
                      href={`?service=${item.consultation.service}#contact`}
                      className={styles.challengeGuideLink}
                      data-track="cta_click"
                      data-location="ai_development"
                      data-service={item.consultation.service}
                    >
                      {item.consultation.label} <ArrowRight size={15} aria-hidden="true" />
                    </Link>
                  )}
                </article>
              ))}
            </div>
            <p className={styles.disclosure}>上記の価格帯は個別見積もりのための税抜の参考費用です。固定料金や認識精度の保証ではありません。<Link href="#standard-offers" className="subtle-link">2つの標準商品</Link>は、対象データと納品物の範囲を確認したうえで固定見積もりを提示します。</p>
            <div className={styles.faqList}>
              <details id="report-sample">
                <summary>技術検証の評価レポート見本を見る（架空の例）</summary>
                <p>
                  <strong>検証したいこと</strong>　固定カメラの動画から指定した動作の候補区間を抽出し、人が映像を確認する時間を減らせるか。
                  <br />
                  <strong>評価結果の例</strong>　評価用の動画24本のうち、動作がある12本中10本を検出。残りは見落とし1本、判定保留1本で、事前に決めた検出率90％に届きませんでした。
                  <br />
                  <strong>本開発の判断</strong>　24本の確認・修正時間は8分から4.8分になり、AIの変動費は144円。動作が隠れると見落とすため、自動確定は見送ります。次は撮影条件を絞り、新しい動画で再評価するかを判断します。
                </p>
              </details>
            </div>
            <a href="#contact" className={styles.challengeGuideLink} data-track="cta_click" data-location="ai_development">開発費用・進め方を相談する <ArrowRight size={15} aria-hidden="true" /></a>
          </div>
        </section>

        <section className={styles.chapter} aria-labelledby="faq-title">
          <div className="wrap">
            <div className={styles.chapterHead}>
              <p className={styles.sectionCode}>05 / FAQ</p>
              <div>
                <h2 id="faq-title" className={styles.chapterTitle}>
                  相談前によくある質問。
                </h2>
              </div>
            </div>
            <div className={styles.faqList}>
              {faqs.map(({ q, a }) => (
                <details key={q}>
                  <summary>{q}</summary>
                  <p>{a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <InsightsEntryPoints placement="development" />

        <section id="contact" className={styles.contactArea} aria-labelledby="development-contact-title">
          <div className={`wrap ${styles.contactLayout}`}>
            <div className={styles.contactCopy}>
              <span className={styles.sectionCode}>06 / CONSULTATION</span>
              <h2 id="development-contact-title">まずは、開発したいことを。</h2>
              <p>
                現在の業務課題や、実現したいサービス・AI機能を分かる範囲でお聞かせください。詳細な仕様書や予算が決まっていなくてもご相談いただけます。
              </p>
              <ul className={styles.contactChecklist}>
                <li>
                  <Check size={16} aria-hidden="true" />
                  <span>仕様・予算が未定でも相談可能</span>
                </li>
                <li>
                  <Check size={16} aria-hidden="true" />
                  <span>PoC不要の直接実装も、小規模な有償PoCも対応</span>
                </li>
                <li>
                  <Check size={16} aria-hidden="true" />
                  <span>スポーツ以外の業界・業務システムも相談可能</span>
                </li>
                <li>
                  <Check size={16} aria-hidden="true" />
                  <span>初回フォームでの機密データ・動画の送信は不要</span>
                </li>
              </ul>
              <div className={styles.contactAside}>
                データの受け渡しが必要な場合は、NDA（秘密保持契約）および安全な共有・削除手順を先に確認します。
                <br />
                <Link href="/security" className="subtle-link">
                  データの取り扱い方針 <ArrowRight size={16} aria-hidden="true" />
                </Link>
              </div>
            </div>
            <ContactForm source="ai_development" />
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
