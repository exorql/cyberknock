import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, ArrowRight, ArrowUpRight, CheckCircle2 } from "lucide-react"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { findInsight, insights } from "@/lib/b2b-insights"
import styles from "../insights.module.css"

const origin = "https://cyberknock.jp"
type Props = { params: Promise<{ slug: string }> }

export function generateStaticParams() {
  return insights.map(({ slug }) => ({ slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const article = findInsight(slug)
  if (!article) return { title: "記事が見つかりません | Cyber Knock", robots: { index: false } }
  const url = `/insights/${slug}`
  return {
    title: `${article.title} | Cyber Knock`,
    description: article.description,
    alternates: { canonical: url },
    openGraph: { type: "article", title: article.title, description: article.description, url: origin + url, locale: "ja_JP" },
    twitter: { card: "summary_large_image", title: article.title, description: article.description },
  }
}

export default async function InsightPage({ params }: Props) {
  const { slug } = await params
  const article = findInsight(slug)
  if (!article) notFound()
  const url = `${origin}/insights/${article.slug}`
  const jsonLd = [
    {
      "@context": "https://schema.org", "@type": "Article",
      headline: article.title, description: article.description, inLanguage: "ja-JP", mainEntityOfPage: url,
      author: { "@type": "Organization", name: "Cyber Knock", url: origin },
      publisher: { "@type": "Organization", name: "Cyber Knock", url: origin },
    },
    {
      "@context": "https://schema.org", "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Cyber Knock", item: origin },
        { "@type": "ListItem", position: 2, name: "技術・PoCガイド", item: origin + "/insights" },
        { "@type": "ListItem", position: 3, name: article.title, item: url },
      ],
    },
    {
      "@context": "https://schema.org", "@type": "FAQPage",
      mainEntity: article.faqs.map(({ question, answer }) => ({
        "@type": "Question", name: question, acceptedAnswer: { "@type": "Answer", text: answer },
      })),
    },
  ]

  return (
    <div className={styles.root}>
      <SiteHeader />
      <main id="main-content">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
        <header className={styles.articleHero}>
          <div className="wrap">
            <nav className={styles.breadcrumb} aria-label="パンくずリスト">
              <Link href="/">Cyber Knock</Link><span aria-hidden="true">/</span>
              <Link href="/insights">技術・PoCガイド</Link><span aria-hidden="true">/</span>
              <span aria-current="page">この記事</span>
            </nav>
            <p className={styles.eyebrow}>{article.eyebrow}</p>
            <h1>{article.title}</h1>
            <p className={styles.lead}>{article.lead}</p>
            <p className={styles.updated}>対象：AI開発の発注・PoC担当者</p>
          </div>
        </header>

        <div className={`wrap ${styles.articleGrid}`}>
          <aside className={styles.side}>
            <nav aria-label="記事内目次">
              <p className={styles.sideTitle}>この記事の内容</p>
              {article.sections.map((section, index) => (
                <a href={`#section-${index + 1}`} key={section.heading}>{section.heading}</a>
              ))}
              <a href="#common-questions">よくある質問</a>
            </nav>
            <div className={styles.sideContact}>
              <p>開発できるか、まず確かめたい方へ</p>
              <Link href="/ai-development#contact">開発について相談する <ArrowUpRight size={17} aria-hidden="true" /></Link>
            </div>
          </aside>

          <article className={styles.articleBody}>
            <section className={styles.summary} aria-labelledby="summary-heading">
              <p className={styles.summaryLabel}>KEY TAKEAWAYS</p>
              <h2 id="summary-heading">最初に押さえたいこと</h2>
              <ul>{article.summary.map(value => <li key={value}><CheckCircle2 size={19} aria-hidden="true" />{value}</li>)}</ul>
            </section>
            {(article.slug === "ai-poc-process-evaluation" || article.slug === "ai-video-analysis-poc-cost") && (
              <section className={styles.related} aria-labelledby="poc-request-template-heading">
                <p className={styles.relatedOverline}>FREE RESOURCE / 見積依頼の準備</p>
                <h2 id="poc-request-template-heading">PoCの検証条件を整理できるシート</h2>
                <p>対象映像・評価指標・成功条件・納品物を1枚の記入項目にまとめました。
                  発注前の整理や、複数社への見積依頼にそのまま使えます。機密動画のアップロードは不要です。</p>
                <a href="/templates/ai-video-poc-request-template.txt" download="cyberknock-ai-video-poc-request-template.txt">
                  AI動画解析・PoCの要件整理シートを保存（TXT） <ArrowUpRight size={18} aria-hidden="true" />
                </a>
              </section>
            )}

            {article.sections.map((section, index) => (
              <section className={styles.bodySection} aria-labelledby={`section-title-${index + 1}`} id={`section-${index + 1}`} key={section.heading}>
                <h2 id={`section-title-${index + 1}`}>{section.heading}</h2>
                {section.paragraphs.map(p => <p key={p}>{p}</p>)}
                {section.table && (
                  <div className={styles.tableScroll} tabIndex={0} role="region" aria-label={`${section.heading}の比較表`}>
                    <table>
                      <thead><tr>{section.table.headings.map(h => <th key={h} scope="col">{h}</th>)}</tr></thead>
                      <tbody>{section.table.rows.map(row => <tr key={row[0]}>{row.map((value,i) => <td key={i}>{value}</td>)}</tr>)}</tbody>
                    </table>
                  </div>
                )}
                {section.bullets && <ul className={styles.checklist}>{section.bullets.map(value => <li key={value}>{value}</li>)}</ul>}
              </section>
            ))}

            <section id="common-questions" className={styles.bodySection} aria-labelledby="faq-title">
              <h2 id="faq-title">よくある質問</h2>
              <div className={styles.faqs}>{article.faqs.map(({ question, answer }) => (
                <details key={question}><summary>{question}</summary><p>{answer}</p></details>
              ))}</div>
            </section>

            <section className={styles.related} aria-labelledby="more-guides-title">
              <p className={styles.relatedOverline}>RELATED GUIDES</p>
              <h2 id="more-guides-title">次に読む発注ガイド</h2>
              <p>開発の外注・PoCの評価・動画解析の費用を、発注前に整理できます。</p>
              {insights.filter(other => other.slug !== article.slug).map(other => (
                <Link key={other.slug} href={"/insights/" + other.slug}>
                  {other.title}<ArrowUpRight size={18} aria-hidden="true" />
                </Link>
              ))}
            </section>
            <section className={styles.related} aria-labelledby="related-title">
              <p className={styles.relatedOverline}>FURTHER READING</p>
              <h2 id="related-title">関連するサービスと実績</h2>
              <p>自社アプリの開発・運用実績と、AI・プロダクト開発の相談窓口をご案内します。未契約の個別案件を実績として紹介することはありません。</p>
              {article.relatedResources.map(item => <Link key={item.href} href={item.href}>{item.label}<ArrowUpRight size={18} aria-hidden="true" /></Link>)}
              <Link href="/insights">技術・PoCガイドの一覧へ<ArrowLeft size={18} aria-hidden="true" /></Link>
            </section>
          </article>
        </div>

        <section className={styles.contactStrip} aria-labelledby="insight-contact-heading">
          <div className={`wrap ${styles.contactInner}`}>
            <div>
              <p className={styles.eyebrow}>NEXT STEP</p>
              <h2 id="insight-contact-heading">最初は、可能性の確認から。</h2>
              <p>実現したい業務・機能、現在の仕組み、判断したいことを教えてください。仕様が未定でも相談できます。</p>
            </div>
            <Link className="button" href="/ai-development#contact" data-track="cta_click" data-location="content">AI・プロダクト開発を相談する <ArrowRight size={18} aria-hidden="true" /></Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
