"use client"

import { useRef, useState, type KeyboardEvent } from "react"
import { ArrowUpRight } from "lucide-react"
import styles from "./demo.module.css"

const stages = [
  {
    id: "observation",
    number: "01",
    short: "動画と動作",
    heading: "動きを、映像と一緒に振り返る",
    image: "/images/cases/01-analysis.jpg",
    width: 333,
    height: 720,
    alt: "AIスポーツトレーナーの投球動画に動作情報を重ねた実際のアプリ画面",
    visible: "動画と姿勢・動作情報を同じ画面で確認する体験",
    validation: "対象の映り方、撮影角度、見落とし・誤認識の条件",
    note: "画面上のスコアは解析精度の測定値ではありません。",
  },
  {
    id: "feedback",
    number: "02",
    short: "分析結果",
    heading: "結果を、改善につながる言葉へ",
    image: "/images/product/pitching-feedback.webp",
    width: 640,
    height: 1385,
    alt: "AIスポーツトレーナーが動画とフィードバックを表示している実際のアプリ画面",
    visible: "動画の観察結果と、利用者向けのフィードバックの見せ方",
    validation: "説明と元映像との整合性、根拠が足りない場合の扱い",
    note: "特定の競技・入力条件に対する精度や改善効果は別途評価が必要です。",
  },
  {
    id: "practice",
    number: "03",
    short: "次の練習",
    heading: "分析で終わらず、次の行動へ",
    image: "/images/cases/03-training.png",
    width: 333,
    height: 720,
    alt: "AIスポーツトレーナーが練習内容と選定理由を示している実際のアプリ画面",
    visible: "フィードバックを踏まえた練習提案と、その理由の提示",
    validation: "提案内容の妥当性、利用者への伝わりやすさ、運用時の品質",
    note: "練習成果や利用者の上達を保証するものではありません。",
  },
] as const

export function DemoStages() {
  const [active, setActive] = useState(0)
  const buttons = useRef<Array<HTMLButtonElement | null>>([])
  const current = stages[active]

  function onTabKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    let next = index
    if (event.key === "ArrowRight") next = (index + 1) % stages.length
    else if (event.key === "ArrowLeft") next = (index - 1 + stages.length) % stages.length
    else if (event.key === "Home") next = 0
    else if (event.key === "End") next = stages.length - 1
    else return
    event.preventDefault()
    setActive(next)
    buttons.current[next]?.focus()
  }

  return (
    <section id="actual-screens" className={styles.walkthrough} aria-labelledby="walkthrough-title">
      <div className="wrap">
        <div className={styles.sectionHead}>
          <div>
            <p className={styles.sectionOverline}>01 / PRODUCT WALKTHROUGH</p>
            <h2 id="walkthrough-title">3つの実画面で、体験の流れを見る。</h2>
          </div>
          <p>掲載画像は自社アプリの実画面です。画面を選んで確認できます。動画やAIをこのページ上で実行するデモではありません。</p>
        </div>
        <div className={styles.tabList} role="tablist" aria-label="実画面の表示を切り替える">
          {stages.map((stage, index) => (
            <button
              key={stage.id}
              ref={(element) => { buttons.current[index] = element }}
              type="button"
              id={`demo-tab-${stage.id}`}
              className={styles.tab}
              role="tab"
              aria-selected={active === index}
              aria-controls="demo-stage-panel"
              tabIndex={active === index ? 0 : -1}
              onClick={() => setActive(index)}
              onKeyDown={(event) => onTabKeyDown(event, index)}
            >
              <span>{stage.number}</span>
              <strong>{stage.short}</strong>
            </button>
          ))}
        </div>

        <div
          key={current.id}
          id="demo-stage-panel"
          className={styles.stage}
          role="tabpanel"
          aria-labelledby={`demo-tab-${current.id}`}
          tabIndex={0}
        >
          <figure className={styles.screenArea}>
            <div className={styles.screenFrame}>
              <img
                src={current.image}
                width={current.width}
                height={current.height}
                alt={current.alt}
                decoding="async"
              />
            </div>
            <figcaption>AIスポーツトレーナーの実画面（撮影時点）</figcaption>
          </figure>
          <div className={styles.stageCopy}>
            <p className={styles.stageNumber}>STEP {current.number} / {current.short}</p>
            <h3>{current.heading}</h3>
            <dl className={styles.reviewPoints}>
              <div>
                <dt>この画面で確認できること</dt>
                <dd>{current.visible}</dd>
              </div>
              <div>
                <dt>法人の導入判断で別途確かめること</dt>
                <dd>{current.validation}</dd>
              </div>
            </dl>
            <p className={styles.stageNote}>{current.note}</p>
            <a
              className={styles.fullImage}
              href={current.image}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${current.short}の実画面を別タブで拡大`}
            >
              画面を大きく見る <ArrowUpRight size={17} aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
