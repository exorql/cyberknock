import styles from "./decision-loop.module.css"

const decisions = [
  {
    phase: "映像の条件",
    title: "見えるものを、確かめる。",
    description: "撮影条件と動きから、使える情報を整理。",
  },
  {
    phase: "AIの判断範囲",
    title: "言える範囲を、決める。",
    description: "評価基準と、不確かな出力への対応を設計。",
  },
  {
    phase: "利用者の体験",
    title: "次の行動へ、届ける。",
    description: "評価・フィードバック・練習メニューをつなぐ。",
  },
  {
    phase: "継続する運用",
    title: "使われ方から、見直す。",
    description: "品質・待ち時間・費用を、体験と一緒に改善。",
  },
] as const

/** A server-rendered explanation of development decisions, not measured motion data. */
export function DecisionLoop() {
  return (
    <figure className={styles.figure}>
      <figcaption className={styles.heading}>
        <p className={styles.kicker}>実プロダクトから、開発の判断へ</p>
        <p className={styles.title}>ひとつの動きから、<br />改善の一周へ。</p>
      </figcaption>

      <div className={styles.board}>
        <div className={styles.evidence}>
          <div className={styles.capture}>
            <img
              src="/images/cases/01-analysis.jpg"
              width="333"
              height="720"
              loading="lazy"
              decoding="async"
              alt="AIスポーツトレーナーで投球動画に動作情報を重ねた実際の分析画面"
            />
          </div>
          <div className={styles.captureNote}>
            <span className={styles.screenLabel}>実アプリの分析画面</span>
            <p>動きを捉えた先に、<br />考えることがある。</p>
            <span className={styles.productName}>AIスポーツトレーナー</span>
          </div>
        </div>

        <div className={styles.decisions}>
          <svg className={styles.loop} viewBox="0 0 46 480" preserveAspectRatio="none" aria-hidden="true" focusable="false">
            <path d="M25 24 L25 432 C25 468 5 468 5 432 L5 30 C5 7 25 7 25 24" />
            <path className={styles.echo} d="M31 24 L31 432 C31 479 0 479 0 432 L0 30 C0 -4 31 -4 31 24" />
            <path className={styles.arrow} d="M20 17 L25 24 L30 17" />
          </svg>
          <ol className={styles.steps} aria-label="開発と運用で検討する4つの判断" role="list">
            {decisions.map((decision, index) => (
              <li className={styles.step} key={decision.phase}>
                <span className={styles.number} aria-hidden="true">0{index + 1}</span>
                <div>
                  <p className={styles.phase}>{decision.phase}</p>
                  <p className={styles.stepTitle}>{decision.title}</p>
                  <p className={styles.description}>{decision.description}</p>
                </div>
              </li>
            ))}
          </ol>
          <p className={styles.returnLabel}>見直しを、次の設計へ <span aria-hidden="true">↗</span></p>
        </div>
      </div>

      <p className={styles.note}>実アプリの画面を使用。周囲の線は計測値ではなく、開発判断を見直す流れを示す概念図です。</p>
    </figure>
  )
}
