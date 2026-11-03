import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, ArrowUpRight, ArrowDownRight } from "lucide-react"
import { ContactForm } from "@/components/contact-form"
import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import { pocSteps } from "@/components/video-poc/poc-steps"
import styles from "./video-poc.module.css"

const title = "AI動画解析の受託開発・PoC｜選手追跡・姿勢推定 | Cyber Knock"
const description = "AI動画解析・選手追跡・プレー抽出・姿勢推定の受託開発。手元の動画を使った技術PoCで、できること・できないこと・次の開発範囲を整理。スポーツを中心に映像AIのご相談に対応します。"

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/ai-video-analysis" },
  openGraph: { title, description, url: "https://cyberknock.pages.dev/ai-video-analysis", type: "website", locale: "ja_JP" },
  twitter: { card: "summary_large_image", title, description },
}

const topics = [
  { number: "01", title: "動画から対象や区間を探したい", description: "人物などの対象を追跡し、関係する場面の候補を抽出する仕組みを検討します。取り違えや見落としも評価対象にします。" },
  { number: "02", title: "競技動作を数値・軌跡で見たい", description: "姿勢推定、関節角度、手首・肘の軌跡、動作境界の候補。撮影条件に対する推定の限界を確認します。" },
  { number: "03", title: "AI動画機能をサービスにしたい", description: "処理API・レビュー画面・動画書き出し・Web／モバイル連携。品質・費用・利用導線を含めて設計します。" },
]

const faqs = [
  { q: "動画だけあれば、自動抽出や姿勢計測は実現できますか？", a: "撮影条件、画角、対象人数、評価したい項目により異なります。まず代表動画と正解の確認方法を決め、PoCで精度と欠測・誤判定の条件を調べます。自動化の成立は事前に保証しません。" },
  { q: "スポーツ以外の映像AI案件も相談できますか？", a: "はい。自社アプリで培った動画処理・AI連携・Webやモバイル開発の経験を土台に、用途と素材条件を確認して技術的な適合性を判断します。" },
  { q: "初回問い合わせで動画や個人情報を送る必要がありますか？", a: "不要です。まず目的、撮影方法、動画の長さなど概要をお知らせください。素材の受け渡しが必要な場合は、権利・同意・保存方法・閲覧範囲を先に確認します。" },
  { q: "PoCの費用や期間は決まっていますか？", a: "一律の価格や期間は設けていません。手元の映像、必要な精度、レビューの方法、納品するものを確認し、着手前に範囲・受入条件・見積を提示します。" },
  { q: "公開されている実績は何ですか？", a: "公開しているのは自社プロダクト「AIスポーツトレーナー」の開発・運用経験です。契約前の案件や顧客の非公開情報は掲載していません。個別案件のAI精度・納期は事前に保証せず、必要に応じてPoCで検証します。" },
]

const schema = [
  { "@context": "https://schema.org", "@type": "Service", name: "AI動画解析・PoC受託開発", serviceType: "AI動画解析システム開発、姿勢推定、選手追跡PoC", provider: { "@type": "Organization", name: "Cyber Knock", url: "https://cyberknock.pages.dev" }, areaServed: "JP", url: "https://cyberknock.pages.dev/ai-video-analysis", description },
  { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faqs.map(({ q, a }) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })) },
]

export default function VideoAnalysisDevelopmentPage() {
  return (
    <div className={styles.root}>
      <SiteHeader />
      <main id="main-content">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, "\\u003c") }} />
        <section className={styles.hero} aria-labelledby="video-poc-title">
          <div className={`wrap ${styles.heroLayout}`}>
            <div className={styles.heroCopy}>
              <p className={styles.eyebrow}>AI VIDEO ANALYSIS / POC DEVELOPMENT</p>
              <h1 id="video-poc-title" className={styles.heroTitle}>映像AIの開発を、<span><strong>PoCから実装まで。</strong></span></h1>
              <p className={styles.heroLead}>選手追跡・プレー抽出・フォーム解析・姿勢推定。技術的に動くことと、事業で使えることを分け、映像の条件から評価方法・試作・次の開発判断まで整理します。</p>
              <div className={styles.heroActions}>
                <Link href="#contact" className={`button ${styles.primary}`} data-track="cta_click" data-location="video_poc" data-service="sports-ai">手元の動画でPoCを相談する <ArrowUpRight size={19} aria-hidden="true" /></Link>
                <Link href="#product-proof" className={`text-link ${styles.secondary}`} data-track="case_study_click" data-location="video_poc">自社アプリの開発実績を見る <ArrowDownRight size={18} aria-hidden="true" /></Link>
              </div>
              <p className={styles.heroMicro}>初回相談では動画の添付不要。スポーツ以外の映像AIやWeb・モバイル開発もご相談いただけます。</p>
            </div>
            <div className={styles.flowBoard} aria-label="AI動画解析PoCの流れ">
              <div className={styles.boardTop}><span>FEASIBILITY / WORKFLOW</span><span className={styles.boardStatus}>SCOPE FIRST</span></div>
              <div className={styles.boardFlow}>
                <div className={styles.boardStep}><span>01</span><div><strong>実映像・撮影条件</strong><p>対象、画角、動作、許諾範囲を整理</p></div></div>
                <div className={styles.boardStep}><span>02</span><div><strong>推定・追跡・候補生成</strong><p>得られる根拠と欠測・取り違えを可視化</p></div></div>
                <div className={styles.boardStep}><span>03</span><div><strong>人が確認・評価</strong><p>正解との照合、誤判定、実際の確認工数</p></div></div>
                <div className={styles.boardStep}><span>04</span><div><strong>次の開発を判断</strong><p>達成・未達・改善案・追加開発範囲</p></div></div>
              </div>
              <div className={styles.boardBottom}><span>工程説明 / 顧客導入実績やAI出力画面の再現ではありません</span><strong>TEST → DECIDE</strong></div>
            </div>
          </div>
        </section>

        <section className={styles.chapter} aria-labelledby="challenges-title">
          <div className="wrap">
            <div className={styles.chapterHead}>
              <p className={styles.sectionCode}>01 / YOUR QUESTION</p>
              <div><h2 id="challenges-title" className={styles.chapterTitle}>その映像から、<br />何を判断したいですか。</h2><p className={styles.chapterLead}>「AIでできそう」を前提に開発するのではなく、入力条件と欲しい結果を揃えてから実装・評価します。</p></div>
            </div>
            <div className={styles.challengeGrid}>{topics.map((item) => <article key={item.number} className={styles.challengeCard}><span>{item.number} / TOPIC</span><h3>{item.title}</h3><p>{item.description}</p></article>)}</div>
          </div>
        </section>


        <section id="product-proof" className={[styles.chapter, styles.chapterToned].join(" ")} aria-labelledby="product-proof-title">
          <div className="wrap">
            <div className={styles.chapterHead}>
              <p className={styles.sectionCode}>02 / PRODUCT EXPERIENCE</p>
              <div>
                <h2 id="product-proof-title" className={styles.chapterTitle}>自社プロダクトをつくり、<br />運用してきた経験から。</h2>
                <p className={styles.chapterLead}>発注前に確認できる実例として、自社で提供するアプリの開発・運用経験を紹介します。受託先の未公開案件や、精度未検証の技術デモを実績とは扱いません。</p>
              </div>
            </div>
            <div className={styles.proofGrid}>
              <article className={styles.proofCard}>
                <div className={styles.proofCardTop}><span>FIRST-PARTY PRODUCT</span><small>自社プロダクト</small></div>
                <h3>AIスポーツトレーナー</h3>
                <p>スマートフォンの動画から身体フォームを分析し、改善ポイントや練習提案を表示する自社アプリを開発・運用しています。実際の開発・運用範囲をご覧いただけます。</p>
                <Link className={[styles.proofAction, "text-link"].join(" ")} href="/cases/ai-sports-trainer" data-track="case_study_click" data-location="video_poc">
                  自社アプリの開発・運用事例を見る <ArrowUpRight size={18} aria-hidden="true" />
                </Link>
              </article>
              <article className={styles.proofCard}>
                <div className={styles.proofCardTop}><span>POC DESIGN</span><small>案件ごとに要件を整理</small></div>
                <h3>検証から本番開発までを見据える</h3>
                <p>AIによる検出精度と利用者が確認する手間を切り分け、対象映像・評価項目・試作範囲を合意してから進めます。動画の追跡や抽出、数値化の実現性は素材ごとに検証します。</p>
                <Link className={[styles.proofAction, "text-link"].join(" ")} href="#poc-method-title">
                  PoCの進め方を確認する <ArrowDownRight size={18} aria-hidden="true" />
                </Link>
              </article>
            </div>
            <p className={styles.disclosure}>掲載している実績は自社プロダクトの開発・運用です。未契約の個別相談、顧客の非公開案件、技術検証中の映像や結果は掲載していません。</p>
          </div>
        </section>

        <section className={styles.chapter} aria-labelledby="poc-method-title">
          <div className="wrap">
            <div className={styles.chapterHead}>
              <p className={styles.sectionCode}>03 / OUR APPROACH</p>
              <div><h2 id="poc-method-title" className={styles.chapterTitle}>最初に作るのは、<br />判断できる材料。</h2><p className={styles.chapterLead}>対象映像や要件によって変わるため、期間や価格を一律に約束せず、必要最小限の検証条件から合意します。</p></div>
            </div>
            <div className={styles.stepGrid}>{pocSteps.map(item => <article className={styles.stepCard} key={item.label}><span>{item.label}</span><h3>{item.title}</h3><p>{item.description}</p></article>)}</div>
          </div>
        </section>

        <section className={`${styles.chapter} ${styles.chapterDark}`} aria-labelledby="deliverable-title">
          <div className="wrap">
            <div className={styles.chapterHead}>
              <p className={styles.sectionCode}>04 / PROJECT BOUNDARY</p>
              <div><h2 id="deliverable-title" className={styles.chapterTitle}>何を確かめ、<br />何を持ち帰るか。</h2><p className={styles.chapterLead}>以下はPoC設計時の確認項目です。成果物・費用・検収条件は案件ごとに合意します。</p></div>
            </div>
            <div className={styles.requirements}>
              <div className={styles.requirementBox}><h3>検証前に伺うこと</h3><ul><li>動画の長さ、画角、解像度と撮影方法</li><li>対象人数、見たい動作や抽出したい場面</li><li>正解を確認できる人・評価指標</li><li>動画・人物情報の利用権限と保存方法</li></ul></div>
              <div className={styles.requirementBox}><h3>想定するアウトプット</h3><ul><li>検証条件と技術的な実現可能性の整理</li><li>合意した範囲の試作・評価結果</li><li>誤認・欠測・取り違えの原因と制約</li><li>次段階の開発案・概算・判断ポイント</li></ul></div>
            </div>
            <p className={styles.caseAside}>最初から全自動・全条件対応を保証するものではありません。利用者に必要な「人が確認する運用」を含めて、どこまで自動化すべきかを判断します。</p>
          </div>
        </section>

        <section className={styles.chapter} aria-labelledby="faq-title">
          <div className="wrap">
            <div className={styles.chapterHead}><p className={styles.sectionCode}>05 / FAQ</p><div><h2 id="faq-title" className={styles.chapterTitle}>相談前によくある質問。</h2></div></div>
            <div className={styles.faqList}>{faqs.map(({ q, a }) => <details key={q}><summary>{q}</summary><p>{a}</p></details>)}</div>
          </div>
        </section>

        <section id="contact" className={styles.contactArea} aria-labelledby="video-contact-title">
          <div className={`wrap ${styles.contactLayout}`}>
            <div className={styles.contactCopy}><span className={styles.sectionCode}>06 / CONSULTATION</span><h2 id="video-contact-title">まずは、何ができるかの相談から。</h2><p>対象の競技や用途、撮影条件、実現したいことを分かる範囲でお聞かせください。仕様・予算が未定でもご相談いただけます。</p><p>スポーツ以外の映像AI、既存アプリへの機能追加も対象です。</p><div className={styles.contactAside}>初回フォームへの動画添付は不要です。素材の受け渡しが必要な場合は、権利と安全な共有方法を先に確認します。<br /><Link href="/security" className="subtle-link">データの取り扱い方針 <ArrowRight size={16} aria-hidden="true" /></Link></div></div>
            <ContactForm source="video_poc" defaultService="sports-ai" />
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
