import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, ArrowUpRight, CheckCircle2 } from "lucide-react"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { DemoStages } from "./demo-stages"
import styles from "./demo.module.css"

const pathname = "/demos/ai-sports-trainer"
const title = "AI動画解析の実画面デモ｜開発・PoCの相談前に | Cyber Knock"
const description = "公開・運用中のAIスポーツトレーナーの実画面を使い、動画分析・AIフィードバック・練習提案の体験を紹介。企業のAI動画解析PoC・アプリ開発で評価すべき点も整理します。"

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: pathname },
  openGraph: {
    type: "website",
    url: `https://cyberknock.jp${pathname}`,
    title,
    description,
    locale: "ja_JP",
  },
}

const evaluation = [
  {
    number: "01",
    heading: "撮影とデータ",
    body: "映像の長さ、カメラの角度、対象人数、遮蔽など。どの条件で分析できるかを先に整理します。",
  },
  {
    number: "02",
    heading: "AIの評価基準",
    body: "検出・時刻・動作説明の正解と、失敗をどう数えるか。対象データに合う評価方法を設計します。",
  },
  {
    number: "03",
    heading: "プロダクトへの組み込み",
    body: "結果のUI、待ち時間、API連携、運用コスト。AI単体ではなく利用者が使える仕組みまで考えます。",
  },
] as const

export default function AiSportsTrainerDemo() {
  return (
    <div className={styles.root}>
      <SiteHeader />
      <main id="main-content">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              itemListElement: [
                { "@type": "ListItem", position: 1, name: "Cyber Knock", item: "https://cyberknock.jp" },
                { "@type": "ListItem", position: 2, name: "AI動画解析の実画面デモ", item: "https://cyberknock.jp" + pathname },
              ],
            }).replace(/</g, "\\u003c"),
          }}
        />
        <header className={styles.hero}>
          <div className="wrap">
            <nav className={styles.breadcrumb} aria-label="パンくずリスト">
              <Link href="/">Cyber Knock</Link>
              <span aria-hidden="true">/</span>
              <span aria-current="page">実画面デモ</span>
            </nav>
            <div className={styles.heroGrid}>
              <div>
                <p className={styles.eyebrow}>FIRST-PARTY APP / ACTUAL SCREENS</p>
                <h1>AI動画解析を、<br /><span>使える体験へ。</span></h1>
                <p className={styles.lead}>自社で企画・開発・運用している「AIスポーツトレーナー」の実画面を使い、動画からフィードバック、次の練習へつながる体験を紹介します。</p>
                <div className={styles.heroActions}>
                  <a className={styles.primaryLink} href="#actual-screens">実画面を見る <ArrowRight size={18} aria-hidden="true" /></a>
                  <Link className={styles.secondaryLink} href="/ai-development#contact" data-track="cta_click" data-location="hero">AI開発を相談する <ArrowUpRight size={18} aria-hidden="true" /></Link>
                </div>
              </div>
              <div className={styles.heroDetails} aria-label="このデモで確認できること">
                <p>VIEW / 3 SCREENS</p>
                <strong>実際の製品画面を使った<br />閲覧型デモ</strong>
                <ol>
                  <li><span>01</span> 動画と動作情報</li>
                  <li><span>02</span> AIフィードバック</li>
                  <li><span>03</span> 練習への提案</li>
                </ol>
                <small>新しい動画のアップロード・解析は行いません。</small>
              </div>
            </div>
          </div>
        </header>

        <DemoStages />

        <section className={styles.evaluation} aria-labelledby="evaluation-title">
          <div className="wrap">
            <div className={styles.sectionHead}>
              <div>
                <p className={styles.sectionOverline}>02 / FOR PROJECT OWNERS</p>
                <h2 id="evaluation-title">導入前に、何を検証するか。</h2>
              </div>
              <p>実画面で分かるのは利用体験の一部です。発注時には対象データと評価基準を揃え、技術PoCで判断します。</p>
            </div>
            <div className={styles.evaluationGrid}>
              {evaluation.map((item) => (
                <article className={styles.evaluationCard} key={item.number}>
                  <span>{item.number} / REVIEW</span>
                  <h3><CheckCircle2 size={19} aria-hidden="true" />{item.heading}</h3>
                  <p>{item.body}</p>
                </article>
              ))}
            </div>
            <div className={styles.resource}>
              <div>
                <strong>見積もりの前に、検証条件を揃える。</strong>
                <p>撮影条件・成功基準・納品物を書き込めるシートを無料公開しています。</p>
              </div>
              <a href="/templates/ai-video-poc-request-template.txt" download="cyberknock-ai-video-poc-request-template.txt">
                要件整理シートを保存 <ArrowUpRight size={17} aria-hidden="true" />
              </a>
            </div>
          </div>
        </section>

        <section className={styles.consultation} aria-labelledby="consultation-title">
          <div className="wrap">
            <p className={styles.eyebrow}>NEXT / YOUR PROJECT</p>
            <h2 id="consultation-title">自社の映像やサービスで、<br />実現できるかを相談する。</h2>
            <p>動画解析、既存アプリへのAI機能追加、PoCの評価設計。仕様や予算が未定でも、現在の課題から整理できます。</p>
            <Link className={styles.primaryLink} href="/ai-development#contact" data-track="cta_click" data-location="content">
              AI・プロダクト開発を相談する <ArrowUpRight size={18} aria-hidden="true" />
            </Link>
            <div className={styles.relatedLinks}>
              <Link href="/cases/ai-sports-trainer">自社アプリの開発・運用事例を見る</Link>
              <Link href="/insights/ai-video-analysis-poc-cost">動画解析PoCの費用・評価条件を読む</Link>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
