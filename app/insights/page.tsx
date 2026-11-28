import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, ArrowUpRight } from "lucide-react"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { insights } from "@/lib/b2b-insights"
import { operationsInsights } from "@/lib/b2b-operations-insights"
import styles from "./insights.module.css"

const title = "業務自動化・システム化・AI開発の判断ガイド｜費用・発注 | Cyber Knock"
const description = "中小企業の業務自動化、Excelシステム化、AI導入や専門AI開発の費用・発注範囲・運用を解説する法人向けガイド。"

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
            <nav className={styles.breadcrumb} aria-label="パンくずリスト"><Link href="/">Cyber Knock</Link><span aria-hidden="true">/</span><span aria-current="page">業務改善・開発ガイド</span></nav>
            <p className={styles.eyebrow}>INSIGHTS / FOR PROJECT OWNERS</p>
            <h1>仕事の改善を、<br />判断できる計画に。</h1>
            <p className={styles.lead}>業務自動化・Excelのシステム化・AI導入の費用と発注範囲、専門AI開発の判断材料を、経営者や業務担当者向けにまとめました。既存ツールから独自開発まで、必要な範囲を比較できます。</p>
          </div>
        </header>
        <section className={styles.indexSection} aria-labelledby="articles-title">
          <div className="wrap">
            <div className={styles.indexSectionHead}><p className={styles.eyebrow}>01 / RESEARCH & DECISION</p><h2 id="articles-title">業務改善と専門開発の発注ガイド。</h2></div>
            <div className={styles.cards}>
              {[...operationsInsights, ...insights.filter(article => !operationsInsights.some(item => item.slug === article.slug))].map((article, index) => (
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
            <div><p className={styles.eyebrow}>NEXT STEP</p><h2 id="insights-contact-heading">開発の課題を、次の一歩に。</h2><p>業務の困りごと、システム化、AIや新サービスの開発について、予算や仕様が未定でも課題の概要から相談できます。</p></div>
            <Link className="button" href="/#contact" data-track="cta_click" data-location="content">業務改善・開発の相談へ <ArrowRight size={18} aria-hidden="true" /></Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
