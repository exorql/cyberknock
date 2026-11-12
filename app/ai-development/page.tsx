import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, ArrowUpRight, ArrowDownRight } from "lucide-react"
import { ContactForm } from "@/components/contact-form"
import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import { projectSteps } from "@/components/development/project-steps"
import { InsightsEntryPoints } from "@/components/insights-entrypoints"
import styles from "./development.module.css"

const title = "AI開発・PoC・Web／モバイルアプリ受託開発 | Cyber Knock"
const description = "AI機能開発、動画解析、Web・モバイルアプリ開発。課題の整理・構想から、必要に応じた技術検証（PoC）、プロダクト実装・改善まで。Cyber Knockにご相談ください。"

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/ai-development" },
  openGraph: { title, description, url: "https://cyberknock.jp/ai-development", type: "website", locale: "ja_JP" },
  twitter: { card: "summary_large_image", title, description },
}

const topics = [
  {
    number: "01",
    title: "AI機能を、事業や既存サービスに組み込みたい",
    description: "生成AIや動画解析など、目的とデータに応じてAI機能を設計。必要な品質・コスト・利用時の確認方法を整理します。",
  },
  {
    number: "02",
    title: "新しいWeb・モバイルアプリをつくりたい",
    description: "構想段階の要件整理から、画面設計・API・クラウド・アプリ実装まで。必要最小限の機能から検討します。",
  },
  {
    number: "03",
    title: "PoCの先も見据えて、改善・運用したい",
    description: "技術的に動くかだけでなく、使う人の体験と継続運用を確認。計測や改善につながる開発範囲を考えます。",
  },
]

const faqs = [
  {
    q: "何を開発すべきか決まっていなくても相談できますか？",
    a: "はい。解決したい業務課題、想定利用者、現在の運用と、次に判断したいことから整理できます。最初から詳細な仕様書は必要ありません。",
  },
  {
    q: "すべての案件でPoCを実施する必要がありますか？",
    a: "いいえ。技術的な不確実性が高い機能は小さなPoCを先に行うことがありますが、既存技術で実現方法が明確な場合は要件整理から実装へ進む方法も検討できます。",
  },
  {
    q: "動画解析以外のAI開発やWeb・モバイル開発も対象ですか？",
    a: "はい。AI機能の組み込み、Webサービス、iOS・Android向けアプリなども相談対象です。実際に対応できる範囲は要件や体制を確認してご案内します。",
  },
  {
    q: "費用や期間はどのように決まりますか？",
    a: "利用目的、必要機能、外部連携、評価項目、運用要件に応じて変わります。固定の料金や納期を先に保証せず、見積可能な範囲に整理してからご提案します。",
  },
  {
    q: "公開されている実績は何ですか？",
    a: "自社プロダクト「AIスポーツトレーナー」の開発・運用経験を掲載しています。契約前の案件や顧客の非公開情報を実績として紹介することはありません。",
  },
]

const schema = [
  {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "AI開発・PoC・Web／モバイルアプリ受託開発",
    serviceType: "AI機能開発、技術検証（PoC）、Webサービス・モバイルアプリ開発",
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
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, "\\u003c") }} />

        <section className={styles.hero} aria-labelledby="development-title">
          <div className={`wrap ${styles.heroLayout}`}>
            <div className={styles.heroCopy}>
              <p className={styles.eyebrow}>AI & PRODUCT DEVELOPMENT</p>
              <h1 id="development-title" className={styles.heroTitle}>AI・プロダクト開発を、<span><strong>構想から実装まで。</strong></span></h1>
              <p className={styles.heroLead}>AI機能開発、動画解析、Web・モバイルアプリ開発。課題の整理から、必要に応じた技術検証（PoC）、プロダクト実装まで、事業に必要な開発を支援します。</p>
              <div className={styles.heroActions}>
                <Link href="#contact" className={`button ${styles.primary}`} data-track="cta_click" data-location="ai_development">開発について相談する <ArrowUpRight size={19} aria-hidden="true" /></Link>
                <Link href="#product-proof" className={`text-link ${styles.secondary}`} data-track="case_study_click" data-location="ai_development">自社プロダクトの実績を見る <ArrowDownRight size={18} aria-hidden="true" /></Link>
              </div>
              <p className={styles.heroMicro}>初回相談は課題の概要だけで構いません。仕様・予算が未定でもご相談いただけます。</p>
            </div>
            <div className={styles.flowBoard} aria-label="構想から実装までの進め方">
              <div className={styles.boardTop}><span>FROM IDEA TO PRODUCT</span><span className={styles.boardStatus}>SCOPE FIRST</span></div>
              <div className={styles.boardFlow}>
                <div className={styles.boardStep}><span>01</span><div><strong>課題・目的を整理</strong><p>利用者、業務、必要な成果を明確にする</p></div></div>
                <div className={styles.boardStep}><span>02</span><div><strong>必要なら小さく検証</strong><p>AI機能・データ・実現性をPoCで確認</p></div></div>
                <div className={styles.boardStep}><span>03</span><div><strong>プロダクトを実装</strong><p>UI・API・Web・モバイルを必要な範囲で開発</p></div></div>
                <div className={styles.boardStep}><span>04</span><div><strong>使って改善を判断</strong><p>品質・利用状況・次の施策を確認</p></div></div>
              </div>
              <div className={styles.boardBottom}><span>進め方のイメージです。工程は案件ごとに異なります</span><strong>PLAN → BUILD</strong></div>
            </div>
          </div>
        </section>

        <section className={styles.chapter} aria-labelledby="challenges-title">
          <div className="wrap">
            <div className={styles.chapterHead}>
              <p className={styles.sectionCode}>01 / HOW WE CAN HELP</p>
              <div>
                <h2 id="challenges-title" className={styles.chapterTitle}>課題から、<br />必要な開発を。</h2>
                <p className={styles.chapterLead}>あらかじめ技術を決めるのではなく、達成したい成果と運用条件から作る範囲を整理します。</p>
              </div>
            </div>
            <div className={styles.challengeGrid}>
              {topics.map(item => (
                <article key={item.number} className={styles.challengeCard}>
                  <span>{item.number} / SERVICE</span>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="product-proof" className={`${styles.chapter} ${styles.chapterToned}`} aria-labelledby="product-proof-title">
          <div className="wrap">
            <div className={styles.chapterHead}>
              <p className={styles.sectionCode}>02 / FIRST-PARTY EXPERIENCE</p>
              <div>
                <h2 id="product-proof-title" className={styles.chapterTitle}>自社でつくり、<br />運用しているから。</h2>
                <p className={styles.chapterLead}>構想・実装・運用をつなぐ開発経験は、自社プロダクトの事例でご確認いただけます。受託先の未公開案件を実績とは扱いません。</p>
              </div>
            </div>
            <div className={styles.proofGrid}>
              <article className={styles.proofCard}>
                <div className={styles.proofCardTop}><span>FIRST-PARTY PRODUCT</span><small>自社プロダクト</small></div>
                <h3>AIスポーツトレーナー</h3>
                <p>動画のAI分析、練習提案、iOS・Androidアプリ、クラウドを組み合わせた自社サービスを開発・運用しています。開発と運用の内容を公開しています。</p>
                <Link className={`text-link ${styles.proofAction}`} href="/cases/ai-sports-trainer" data-track="case_study_click" data-location="ai_development">
                  自社プロダクトの開発・運用事例 <ArrowUpRight size={18} aria-hidden="true" />
                </Link>
                <Link className="text-link" href="/demos/ai-sports-trainer" data-track="demo_click" data-location="ai_development">
                  動画分析の実画面デモを見る <ArrowUpRight size={18} aria-hidden="true" />
                </Link>
              </article>
              <article className={styles.proofCard}>
                <div className={styles.proofCardTop}><span>APPROACH</span><small>案件に合わせた開発範囲</small></div>
                <h3>PoCも、実装も。必要なところから。</h3>
                <p>技術上の不確実性が高い場合は検証から。要件が明確なら実装から。成果物・費用・評価方法をすり合わせ、次の判断につなげます。</p>
                <Link className={`text-link ${styles.proofAction}`} href="#development-method" data-track="cta_click" data-location="ai_development">
                  開発の進め方を見る <ArrowDownRight size={18} aria-hidden="true" />
                </Link>
              </article>
            </div>
            <p className={styles.disclosure}>ここに掲載する実績は自社プロダクトの開発・運用です。顧客の未契約案件や非公開の技術検証を、導入事例として掲載していません。</p>
          </div>
        </section>

        <section className={styles.chapter} aria-labelledby="development-method-title" id="development-method">
          <div className="wrap">
            <div className={styles.chapterHead}>
              <p className={styles.sectionCode}>03 / OUR APPROACH</p>
              <div>
                <h2 id="development-method-title" className={styles.chapterTitle}>小さく確かめて、<br />必要なものをつくる。</h2>
                <p className={styles.chapterLead}>PoCをすべての案件に必須とはしません。目的とリスクに応じて検証・実装・改善の順序を決めます。</p>
              </div>
            </div>
            <div className={styles.stepGrid}>
              {projectSteps.map(item => (
                <article className={styles.stepCard} key={item.label}>
                  <span>{item.label}</span><h3>{item.title}</h3><p>{item.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className={`${styles.chapter} ${styles.chapterDark}`} aria-labelledby="deliverable-title">
          <div className="wrap">
            <div className={styles.chapterHead}>
              <p className={styles.sectionCode}>04 / PROJECT SCOPE</p>
              <div>
                <h2 id="deliverable-title" className={styles.chapterTitle}>最初に揃えることと、<br />次に決めること。</h2>
                <p className={styles.chapterLead}>実現可能性・費用・納期を一律には保証せず、案件ごとに必要な確認と成果物を整理します。</p>
              </div>
            </div>
            <div className={styles.requirements}>
              <div className={styles.requirementBox}>
                <h3>最初に伺うこと</h3>
                <ul><li>解決したい課題と、使う人・業務の流れ</li><li>想定するAI機能や画面、既存システム</li><li>必要なデータ・利用権限・セキュリティ</li><li>予算・時期・成功と判断する条件</li></ul>
              </div>
              <div className={styles.requirementBox}>
                <h3>案件に応じたアウトプット</h3>
                <ul><li>要件・優先順位・実装範囲の整理</li><li>必要に応じた技術検証と評価結果</li><li>Web・モバイル・API等の試作や実装</li><li>運用に必要な条件と次の改善・開発案</li></ul>
              </div>
            </div>
            <p className={styles.caseAside}>すべての案件で同じ工程を行うわけではありません。ご相談後に範囲を確認し、合意した内容に沿って提案します。</p>
          </div>
        </section>

        <section className={styles.chapter} aria-labelledby="faq-title">
          <div className="wrap">
            <div className={styles.chapterHead}>
              <p className={styles.sectionCode}>05 / FAQ</p>
              <div><h2 id="faq-title" className={styles.chapterTitle}>相談前によくある質問。</h2></div>
            </div>
            <div className={styles.faqList}>
              {faqs.map(({ q, a }) => <details key={q}><summary>{q}</summary><p>{a}</p></details>)}
            </div>
          </div>
        </section>

        <InsightsEntryPoints placement="development" />

        <section id="contact" className={styles.contactArea} aria-labelledby="development-contact-title">
          <div className={`wrap ${styles.contactLayout}`}>
            <div className={styles.contactCopy}>
              <span className={styles.sectionCode}>06 / CONSULTATION</span>
              <h2 id="development-contact-title">まずは、開発したいことを。</h2>
              <p>現在の課題と、実現したいサービスや機能を分かる範囲でお聞かせください。詳細な仕様書や見積条件がなくてもご相談いただけます。</p>
              <p>AI機能開発、動画解析、Web・モバイルアプリなど、用途に合わせて対応範囲を整理します。</p>
              <div className={styles.contactAside}>初回相談で機密データや動画の添付は不要です。データの受け渡しが必要な場合は、権利と安全な共有方法を先に確認します。<br /><Link href="/security" className="subtle-link">データの取り扱い方針 <ArrowRight size={16} aria-hidden="true" /></Link></div>
            </div>
            <ContactForm source="ai_development" />
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
