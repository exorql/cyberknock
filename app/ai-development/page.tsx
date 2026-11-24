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
  "AI機能開発、動画解析、Web・モバイルアプリ開発。自社アプリ「AIスポーツトレーナー」「コレステAI」の商用開発・運用実績をもとに、動画解析・骨格推定・マルチモーダルAI組み込み・必要に応じた有償PoCから本番実装・運用改善まで一貫支援します。"
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
      "画像・動画・文書・数値を扱うマルチモーダルLLMを、既存のWebサービスや業務システム、モバイルアプリへ統合します。プロンプト設計だけでなく、構造化出力・誤答抑止ガードレール、推論コストと応答時間の最適化まで実装します。",
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
    label: "マルチモーダルAI・既存組み込みを相談する",
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
    a: "対象データの条件、開発範囲（技術検証・PoCのみ／MVPや本開発・運用改善まで）、評価項目、運用要件に応じて個別にお見積もりします。NDA、契約形態（準委任・請負）、成果物および知的財産権の帰属は、着手前に契約書で明確に定めます。",
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

              <div className={styles.proofSummaryCard} id="proof-choleste-ai">
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
                  <div className={styles.proofThumbWrap}>
                    <img
                      src="/images/product/choleste-meal-record.webp"
                      alt="自社アプリ「コレステAI」実画面：食事写真のマルチモーダルAI解析と栄養バランス評価UI（デモデータ）"
                      width={800}
                      height={800}
                      loading="lazy"
                      decoding="async"
                      className={styles.proofThumb}
                    />
                  </div>
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
        <section className={styles.chapter} aria-labelledby="faq-title">
          <div className="wrap">
            <div className={styles.chapterHead}>
              <p className={styles.sectionCode}>04 / FAQ</p>
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
              <span className={styles.sectionCode}>05 / CONSULTATION</span>
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
