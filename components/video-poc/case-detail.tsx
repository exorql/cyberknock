import Link from "next/link"
import { ArrowRight, ArrowUpRight } from "lucide-react"
import { ContactForm } from "@/components/contact-form"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { CaseIllustration } from "./case-illustration"
import { videoPocCases, type VideoPocKind } from "./case-data"
import styles from "@/app/ai-video-analysis/video-poc.module.css"

export function VideoPocCaseDetail({ kind }: { kind: VideoPocKind }) {
  const item = videoPocCases[kind]
  const source = kind === "soccer" ? "soccer_poc" : "kyudo_poc"
  const other = videoPocCases[kind === "soccer" ? "kyudo" : "soccer"]
  const url = `https://cyberknock.pages.dev/ai-video-analysis/${item.slug}`
  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Cyber Knock", item: "https://cyberknock.pages.dev/" },
      { "@type": "ListItem", position: 2, name: "AI動画解析・PoC受託開発", item: "https://cyberknock.pages.dev/ai-video-analysis" },
      { "@type": "ListItem", position: 3, name: item.label, item: url },
    ],
  }

  return (
    <div className={styles.root}>
      <SiteHeader />
      <main id="main-content">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
        <section className={styles.caseHero} aria-labelledby="case-title">
          <div className="wrap">
            <nav className={styles.breadcrumbs} aria-label="パンくずリスト">
              <Link href="/">Cyber Knock</Link><span aria-hidden="true">/</span>
              <Link href="/ai-video-analysis">AI動画解析・PoC</Link><span aria-hidden="true">/</span>
              <span aria-current="page">{kind === "soccer" ? "サッカー" : "弓道"}</span>
            </nav>
            <div className={styles.caseHeroGrid}>
              <div>
                <span className={styles.eyebrow}>{item.overline}</span>
                <h1 id="case-title">{item.headline}</h1>
                <p className={styles.caseLead}>{item.introduction}</p>
                <div className={styles.heroActions}>
                  <Link href="#contact" className={`button ${styles.primary}`} data-track="cta_click" data-location="video_case" data-service="sports-ai">類似する技術PoCを相談する <ArrowUpRight size={19} aria-hidden="true" /></Link>
                  <Link href="/ai-video-analysis" className={`text-link ${styles.secondary}`}>開発サービス全体へ <ArrowRight size={17} aria-hidden="true" /></Link>
                </div>
                <p className={styles.caseNote}><span className={styles.caseBadge}>技術検証 / 顧客への導入事例ではありません</span><br />実映像の公開権限が確認できないため、動画自体は非公開です。下図は説明用の模式図です。</p>
              </div>
              <CaseIllustration kind={kind} />
            </div>
          </div>
        </section>

        <section className={styles.chapter} aria-labelledby="result-heading">
          <div className="wrap">
            <div className={styles.chapterHead}><span className={styles.sectionCode}>01 / EVIDENCE & LIMITS</span><div><h2 id="result-heading" className={styles.chapterTitle}>動作した範囲と、<br />まだ保証できない範囲。</h2><p className={styles.chapterLead}>テストを通過したという事実と、AIの検出精度や商用運用が成立したという判断は分けて記載しています。</p></div></div>
            <div className={styles.outcomeColumns}>
              <article className={styles.outcomePanel}><h3>検証したこと</h3><ul>{item.tested.map(value => <li key={value}>{value}</li>)}</ul></article>
              <article className={styles.outcomePanel}><h3>未達・追加評価が必要なこと</h3><ul>{item.notVerified.map(value => <li key={value}>{value}</li>)}</ul></article>
            </div>
            <p className={styles.disclosure}>{item.decision}</p>
          </div>
        </section>

        <section className={`${styles.chapter} ${styles.chapterDark}`} aria-labelledby="workflow-heading">
          <div className="wrap">
            <div className={styles.chapterHead}><span className={styles.sectionCode}>02 / VALIDATION FLOW</span><div><h2 id="workflow-heading" className={styles.chapterTitle}>どう検証して、<br />次を判断するか。</h2></div></div>
            <div className={styles.caseFlow}>{item.workflow.map((step, index) => <article key={step.title}><small>0{index+1} / STEP</small><h3>{step.title}</h3><p>{step.description}</p></article>)}</div>
            <div className={styles.caseAside}>実装範囲は撮影素材・対象人数・精度要件により変わります。「AIが全動作を自動判別する」といった未検証の成果は、事前に保証しません。</div>
          </div>
        </section>

        <section className={styles.chapter} aria-labelledby="inputs-heading">
          <div className="wrap">
            <div className={styles.chapterHead}><span className={styles.sectionCode}>03 / NEXT POC</span><div><h2 id="inputs-heading" className={styles.chapterTitle}>次に検証するなら、<br />最初に揃えたい条件。</h2></div></div>
            <div className={styles.outcomeColumns}>
              <div className={styles.outcomePanel}><h3>ご相談時の確認事項</h3><ul>{item.firstInputs.map(value => <li key={value}>{value}</li>)}</ul></div>
              <div className={styles.outcomePanel}><h3>PoCで確認する判断材料</h3><ul><li>撮影条件ごとの成功・失敗とその理由</li><li>本人性・時刻・位置などの誤判定の種類</li><li>人のレビューにかかる手間と必要なUI</li><li>次の開発段階・費用・運用上の制約</li></ul></div>
            </div>
            <Link href={`/ai-video-analysis/${other.slug}`} className={styles.caseCrosslink} data-track="case_study_click" data-location="video_case">別テーマの技術検証：{other.label} <ArrowUpRight size={17} aria-hidden="true" /></Link>
          </div>
        </section>

        <section id="contact" className={styles.contactArea} aria-labelledby="case-contact-heading">
          <div className={`wrap ${styles.contactLayout}`}>
            <div className={styles.contactCopy}>
              <span className={styles.sectionCode}>04 / CONSULTATION</span>
              <h2 id="case-contact-heading">似た映像を使う開発について、まず相談する。</h2>
              <p>対象映像、検証したい機能、利用する人、今の課題を分かる範囲でお知らせください。</p>
              <p>仕様や予算が未定でも構いません。技術上の難しさや、最初に必要な実証範囲から整理します。</p>
              <div className={styles.contactAside}>初回問い合わせに実映像のアップロードは不要です。第三者の動画を共有する前に、権利と情報の扱いを確認します。<br/><Link href="/security" className="subtle-link">データの取り扱い <ArrowUpRight size={16} aria-hidden="true" /></Link></div>
            </div>
            <ContactForm source={source} defaultService="sports-ai" />
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
