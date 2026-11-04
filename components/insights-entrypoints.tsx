import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { insights } from "@/lib/b2b-insights"
import styles from "./insights-entrypoints.module.css"

type Props = {
  placement: "home" | "development"
}

export function InsightsEntryPoints({ placement }: Props) {
  const home = placement === "home"
  const headingId = home ? "home-insights-heading" : "development-insights-heading"

  return (
    <section
      id={home ? "home-insights" : "development-insights"}
      className={styles.section}
      aria-labelledby={headingId}
      data-insights-entrypoints={placement}
    >
      <div className={`wrap ${styles.layout}`}>
        <div className={styles.intro}>
          <p className={styles.eyebrow}>INSIGHTS / FOR PROJECT OWNERS</p>
          <h2 id={headingId} className={styles.heading}>
            {home ? <>開発を依頼する前に、<span className={styles.secondLine}>知っておきたいこと。</span></> : "開発の判断材料を、先に。"}
          </h2>
          <p className={styles.description}>
            AI開発の費用や外注先の選び方、PoCの評価方法を、発注担当者向けにまとめています。
          </p>
          <Link
            href="/insights"
            className={styles.indexLink}
            data-track="insight_click"
            data-location="content"
            data-guide="overview"
          >
            ガイドをすべて見る <ArrowUpRight size={17} aria-hidden="true" />
          </Link>
        </div>
        <nav aria-label="開発発注の判断ガイド" className={styles.links}>
          {insights.map((article, index) => (
            <Link
              key={article.slug}
              href={`/insights/${article.slug}`}
              className={styles.articleLink}
              data-track="insight_click"
              data-location="content"
              data-guide={article.slug}
            >
              <span className={styles.number} aria-hidden="true">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className={styles.linkText}>{article.title}</span>
              <ArrowUpRight className={styles.linkArrow} size={20} aria-hidden="true" />
            </Link>
          ))}
        </nav>
      </div>
    </section>
  )
}
