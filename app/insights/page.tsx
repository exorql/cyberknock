import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, ArrowUpRight } from "lucide-react"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { insights } from "@/lib/b2b-insights"
import styles from "./insights.module.css"

const title = "AI開発・PoC・外注の判断ガイド｜費用・進め方・会社選び | Cyber Knock"
const description = "AI・プロダクト開発の発注前に確認したい外注先の選び方、PoCの進め方、動画解析の開発費用を解説。企業の事業担当者向けガイド。"

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/insights" },
  openGraph: {
    type: "website",
    title,
    description,
    url: "https://cyberknock.jp/insights",
    siteName: "Cyber Knock",
    locale: "ja_JP",
    images: [{ url: "/images/og/cyberknock-b2b.png", width: 1200, height: 630, alt: title }],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/images/og/cyberknock-b2b.png"],
  },
}

export default function InsightsIndex() {
  return (
    <div className={styles.root}>
      <SiteHeader />
      <main id="main-content">
        <header className={styles.indexHero}>
          <div className="wrap">
            <nav className={styles.breadcrumb} aria-label="パンくずリスト"><Link href="/">Cyber Knock</Link><span aria-hidden="true">/</span><span aria-current="page">技術・PoCガイド</span></nav>
            <p className={styles.eyebrow}>INSIGHTS / FOR PROJECT OWNERS</p>
            <h1>AI開発を、<br />判断できる計画に。</h1>
            <p className={styles.lead}>AI機能やWeb・モバイルサービスを検討する企業・団体へ。外注前の要件整理、PoCの評価方法、動画解析の開発費用を、発注担当者の立場でまとめました。自社アプリの開発・運用経験と、一般的な技術上の注意点を区別して説明します。</p>
          </div>
        </header>
        <section className={styles.indexSection} aria-labelledby="articles-title">
          <div className="wrap">
            <div className={styles.indexSectionHead}><p className={styles.eyebrow}>01 / RESEARCH & DECISION</p><h2 id="articles-title">発注の前に読みたい3つの論点。</h2></div>
            <div className={styles.cards}>
              {insights.map((article, index) => (
                <article className={styles.card} key={article.slug}>
                  <div className={styles.cardTop}><span>0{index+1} / GUIDE</span><span>{article.eyebrow.split(" / ")[0]}</span></div>
                  <h3><Link href={`/insights/${article.slug}`}>{article.title}</Link></h3>
                  <p>{article.description}</p>
                  <Link className={styles.cardAction} href={`/insights/${article.slug}`}>詳しく読む <ArrowUpRight size={18} aria-hidden="true" /></Link>
                </article>
              ))}
            </div>
          </div>
        </section>
        <section className={styles.contactStrip} aria-labelledby="insights-contact-heading">
          <div className={`wrap ${styles.contactInner}`}>
            <div><p className={styles.eyebrow}>NEXT STEP</p><h2 id="insights-contact-heading">開発の課題を、次の一歩に。</h2><p>AI機能開発、Web・モバイルの新規開発、技術検証（PoC）を相談できます。仕様や費用が未定でも、課題の概要から整理できます。</p></div>
            <Link className="button" href="/ai-development#contact" data-track="cta_click" data-location="content">AI・プロダクト開発の相談へ <ArrowRight size={18} aria-hidden="true" /></Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
