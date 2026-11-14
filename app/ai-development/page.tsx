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

const title = "AI開発・PoC・Web／モバイルアプリ受託開発｜動画解析・生成AI | Cyber Knock"
const description =
  "AI機能開発、動画解析、Web・モバイルアプリ開発。自社アプリ「AIスポーツトレーナー」の開発・運用実績をもとに、課題整理・必要に応じた有償PoCから生成AI組み込み・本番実装まで一貫支援します。"
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
    code: "VIDEO & IMAGE AI",
    title: "動画・画像解析AI",
    description:
      "カメラ映像やスマートフォン撮影動画からの姿勢推定・骨格検出、フォーム・動作解析、特定シーンの検出・切り出しなどを設計・実装します。撮影条件の整理から評価基準の策定まで対応します。",
    scope: "対応例：スポーツ・フィットネス動作解析、現場作業・トレーニング映像の振り返り支援など",
  },
  {
    number: "02",
    code: "GENERATIVE AI",
    title: "生成AIの既存サービスへの組み込み",
    description:
      "LLM・マルチモーダルAIを既存のWebサービスや業務システム、アプリへ統合します。プロンプト設計だけでなく、出力の構造化・検証、例外時の制御、推論コストと応答時間の最適化まで実装します。",
    scope: "対応例：解析結果の自動レポート生成、業務知識の検索・要約補助、利用者向けフィードバック生成など",
  },
  {
    number: "03",
    code: "POC & MVP",
    title: "PoC（技術検証）・MVP開発",
    description:
      "「自社の映像やデータでどこまで認識・自動化できるか」を確かめる有償PoCから、実際の業務・顧客体験で価値を検証するMVP（最小実用プロダクト）の開発まで対応。次の投資判断に使える検証結果を残します。",
    scope: "成果物例：検証用プロトタイプ、評価データに対する達成・未達レポート、本開発の要件・見積前提",
  },
  {
    number: "04",
    code: "WEB & MOBILE APP",
    title: "Web・iOS・Androidアプリ開発",
    description:
      "AIモデルやAPI単体で終わらせず、現場担当者やエンドユーザーが迷わず使える画面（Next.js / React / React Native / TypeScript）とクラウド基盤（Firebase / Google Cloud 等）を一貫して開発・公開します。",
    scope: "対応範囲：UI/UX設計、フロントエンド・モバイル実装、API・認証・課金基盤、ストア公開・継続改善",
  },
] as const

const faqs = [
  {
    q: "仕様書や予算が決まっていなくても相談できますか？",
    a: "はい。解決したい業務課題、想定利用者、現在の運用状況から一緒に整理できます。実現可能性の切り分けや、最初に検証・実装すべき範囲をご案内します。",
  },
  {
    q: "すべての案件でPoC（技術検証）を実施する必要がありますか？",
    a: "いいえ。既存技術やAPIで実現方式が明確な場合は、PoCを挟まず要件定義やMVP実装から進める方が合理的です。映像条件やAIの認識品質に不確実性がある場合のみ、対象を絞った有償PoCをご提案します。",
  },
  {
    q: "スポーツ以外の業界のAI開発やWeb・モバイル開発も相談できますか？",
    a: "はい。現在公開している実績は自社アプリ「AIスポーツトレーナー」ですが、そこで培った動画・画像解析、生成AI組み込み、Web・iOS・Androidアプリ開発の技術基盤を活かし、業種を問わずご相談に対応しています。",
  },
  {
    q: "初回の問い合わせフォームで、検証用の動画や機密データを送る必要はありますか？",
    a: "いいえ、初回フォームでの動画や機密資料の添付は不要です。まずは文章で課題の概要をお知らせください。実データの確認が必要な段階になりましたら、NDA（秘密保持契約）や安全な共有・削除手順を合意したうえでお預かりします。",
  },
  {
    q: "費用や期間、成果物の権利はどのように決まりますか？",
    a: "対象データの条件、開発範囲（PoCのみ／アプリ・API実装まで）、評価項目、運用要件に応じて個別にお見積もりします。NDA、契約形態（準委任・請負）、成果物および知的財産権の帰属は、着手前に契約書で明確に定めます。",
  },
] as const

const schema = [
  {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "AI開発・PoC・Web／モバイルアプリ受託開発",
    serviceType: "動画・画像解析AI開発、生成AI組み込み、技術検証（PoC）・MVP開発、Web・iOS・Androidアプリ開発",
    provider: { "@type": "Organization", name: "Cyber Knock", url: "https://cyberknock.jp" },
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
            <div className={styles.chapterHead}>
              <p className={styles.sectionCode}>01 / OPERATIONAL PROOF &amp; DEMO</p>
              <div>
                <h2 id="product-proof-title" className={styles.chapterTitle}>
                  AIを作るだけでなく、実際に運用してきた実績。
                </h2>
                <p className={styles.chapterLead}>
                  試作で終わらず、一般ユーザーが日常的に使うiOS・Androidアプリ「AIスポーツトレーナー」を自社で企画・開発・継続運用しています。受託先の非公開案件や未契約の検証を実績として掲載することはありません。
                </p>
              </div>
            </div>

            <div className={styles.proofSummaryCard}>
              <div className={styles.proofSummaryMain}>
                <div className={styles.proofCardTop}>
                  <span>REPRESENTATIVE PRODUCT / 自社開発・継続運用プロダクト</span>
                  <small>iOS / Android 公開中</small>
                </div>
                <h3>AIスポーツトレーナー（自社企画・開発・運用）</h3>
                <p>
                  スマートフォンで撮影した動画から姿勢・動作情報を解析し、生成AIによる構造化フィードバックと練習メニュー提案までを届けるモバイルアプリです。アプリのUI実装、クラウド・AI推論基盤、課金、公開後の品質・処理時間・APIコストの改善まで代表が一貫して担当しています。
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
                <Link className={`button ${styles.proofPrimaryBtn}`} href="/demos/ai-sports-trainer" data-track="demo_click" data-location="ai_development">
                  動画分析の実画面デモを見る <ArrowUpRight size={18} aria-hidden="true" />
                </Link>
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
                  法人向けの開発対応領域。
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
                </article>
              ))}
            </div>
            <p className={styles.disclosure}>
              <strong>実績と将来対応領域の明確な区別：</strong>
              現在公開している開発・運用実績は、自社プロダクト「AIスポーツトレーナー」です。スポーツ以外の業界・業務に関する記述は、同プロダクトで培った技術基盤（動画・画像解析、生成AIの出力制御、Web・モバイル実装）を応用できる開発対応領域の説明であり、未実施または非公開の受託案件を導入実績として表現するものではありません。
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
                  初回のオンライン相談・要件整理（無償）と、実データを用いた技術検証・試作（有償PoC／本開発）の境界を明確にし、段階的にリスクを抑えて進めます。
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
                <h3>代表エンジニアが設計・実装を直接担当</h3>
                <ul>
                  <li>要件整理・技術選定から、AI機能・Web／モバイル・クラウド実装まで代表（渡辺 晴仁）が一貫して担当します</li>
                  <li>営業担当と開発者の伝言ゲームがなく、実現可能性・代替案・コストのトレードオフを直接すり合わせられます</li>
                  <li>既存の社内開発チームと連携し、AI機能や特定モジュールのみを分担する体制にも対応可能です</li>
                </ul>
                <p className={styles.requirementLinkRow}>
                  <Link href="/#profile" className={styles.caseCrosslink}>
                    代表プロフィール・経歴を見る <ArrowRight size={15} aria-hidden="true" />
                  </Link>
                </p>
              </div>
              <div className={styles.requirementBox}>
                <h3>NDA・成果物・知的財産権・契約条件</h3>
                <ul>
                  <li>
                    <strong>秘密保持（NDA）・データ管理：</strong>
                    実映像や業務データの共有前にNDA締結に対応。保管場所・利用範囲・検証後の削除手順を事前に合意します
                  </li>
                  <li>
                    <strong>無償相談と有償検証の境界：</strong>
                    初回相談と概算整理は無償です。顧客データをお預かりしての解析検証・試作実装は有償契約にて実施します
                  </li>
                  <li>
                    <strong>成果物・知的財産権：</strong>
                    検証レポート、評価結果、ソースコード等の納品範囲および知的財産権の帰属は、着手前に契約書で明文化します
                  </li>
                </ul>
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
