import styles from "./pilot-blueprint.module.css"

/** Planned decisions and deliverables only. This is not a completed client project. */
export function PilotBlueprint() {
  return (
    <figure className={styles.figure}>
      <figcaption className={styles.heading}>
        <p className={styles.kicker}><span>実証の設計図</span><span className={styles.concept}>概念図</span></p>
        <p className={styles.title}>実証のあとに、<span>判断が残る。</span></p>
      </figcaption>

      <div className={styles.diagram}>
        <svg className={styles.trace} viewBox="0 0 34 300" preserveAspectRatio="none" aria-hidden="true" focusable="false">
          <path d="M17 15 L17 270 C17 293 3 293 3 270 L3 21 C3 2 17 2 17 15" />
          <path className={styles.echo} d="M23 15 L23 270 C23 306 -3 306 -3 270 L-3 21 C-3 -10 23 -10 23 15" />
        </svg>
        <ol className={styles.steps} aria-label="実証で整理する3つの判断と想定成果物" role="list">
          <li className={styles.step}>
            <span className={styles.number} aria-hidden="true">01</span>
            <div>
              <p className={styles.stepTitle}>問いを、揃える。</p>
              <p className={styles.question}>誰の、どんな課題を確かめるか。</p>
              <p className={styles.output}><span>想定</span>検証計画・評価基準</p>
            </div>
          </li>
          <li className={styles.step}>
            <span className={styles.number} aria-hidden="true">02</span>
            <div>
              <p className={styles.stepTitle}>現場で、確かめる。</p>
              <p className={styles.question}>使いやすさ・AI出力・運用の負担。</p>
              <p className={styles.output}><span>想定</span>プロトタイプ・評価記録</p>
            </div>
          </li>
          <li className={styles.step}>
            <span className={styles.number} aria-hidden="true">03</span>
            <div>
              <p className={styles.stepTitle}>次の判断へ、つなぐ。</p>
              <p className={styles.findings}><span>確認できたこと</span><span>残った課題</span></p>
              <p className={styles.output}><span>想定</span>結果レポート・次段階の提案</p>
            </div>
          </li>
        </ol>
      </div>

      <p className={styles.note}>実証の組み立て方を示しています。成果物は、目的と範囲に合わせて決めます。</p>
    </figure>
  )
}
