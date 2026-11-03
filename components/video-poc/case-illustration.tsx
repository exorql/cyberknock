import type { VideoPocKind } from "./case-data"
import styles from "@/app/ai-video-analysis/video-poc.module.css"

export function CaseIllustration({ kind }: { kind: VideoPocKind }) {
  if (kind === "soccer") return (
    <div className={styles.diagram} aria-label="選手を選び、追跡候補をレビューして区間を切り出す工程説明図">
      <div className={styles.diagramTop}><span>PLAY / FRAME REVIEW</span><span>SCHEMATIC / 01</span></div>
      <svg viewBox="0 0 460 265" fill="none" role="img" aria-label="サッカー場の模式図。選手位置と選択対象の軌跡を示す">
        <rect x="1" y="1" width="458" height="263" rx="5" fill="#123A31" stroke="#789F88" strokeOpacity=".54"/>
        <path d="M230 0V265M1 45H74V221H1M459 45H386V221H459M1 1H459V264H1M230 1a131 131 0 0 0 0 262M230 1a131 131 0 0 1 0 262" stroke="#B3D8BC" strokeOpacity=".34" strokeWidth="1.4"/>
        <circle cx="230" cy="132" r="47" stroke="#B3D8BC" strokeOpacity=".35" strokeWidth="1.5"/>
        <path d="M122 198C147 175 175 158 193 129C214 96 233 76 279 62" stroke="#D2FB91" strokeWidth="3" strokeDasharray="7 8" strokeLinecap="round"/>
        <g fill="#C3E8D3" stroke="#052D2B" strokeWidth="2.5"><circle cx="88" cy="84" r="10"/><circle cx="128" cy="194" r="10"/><circle cx="275" cy="64" r="10"/><circle cx="342" cy="173" r="10"/><circle cx="361" cy="93" r="10"/></g>
        <g fill="#92B8D9" stroke="#052D2B" strokeWidth="2.5"><circle cx="170" cy="83" r="10"/><circle cx="198" cy="154" r="10"/><circle cx="286" cy="191" r="10"/><circle cx="317" cy="113" r="10"/></g>
        <circle cx="128" cy="194" r="20" stroke="#D2FB91" strokeWidth="3"/>
        <path d="M111 215L88 235H38" stroke="#D2FB91" strokeWidth="1.6"/>
        <rect x="14" y="222" width="88" height="29" rx="3" fill="#D2FB91"/>
        <text x="23" y="240" fill="#0B2D28" fontSize="13" fontWeight="700" fontFamily="Arial">SELECTED</text>
      </svg>
      <div className={styles.diagramTimeline}>
        <span>候補</span><div className={styles.timelineTrack}><i/><i/><i/></div><span>要確認</span>
      </div>
      <p className={styles.diagramDisclosure}>工程を示す模式図です。実映像・AIの検出結果・達成精度を表したものではありません。</p>
    </div>
  )

  return (
    <div className={styles.diagram} aria-label="弓道の姿勢推定と動作時刻のレビュー工程説明図">
      <div className={styles.diagramTop}><span>MOTION / POINT REVIEW</span><span>SCHEMATIC / 02</span></div>
      <svg viewBox="0 0 460 265" fill="none" role="img" aria-label="弓道の身体の推定点と、時間の経過を抽象化した模式図">
        <rect x="1" y="1" width="458" height="263" rx="5" fill="#11342C" stroke="#789F88" strokeOpacity=".55"/>
        <g stroke="#8DAF9B" strokeOpacity=".26"><path d="M1 65H459M1 132H459M1 198H459M115 1V264M230 1V264M345 1V264"/></g>
        <path d="M230 49L230 72M184 105L230 87L277 101M230 87L225 160L201 215M225 160L263 218" stroke="#D7F0E0" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M184 105L147 83L124 41M277 101L326 88L365 49" stroke="#D2FB91" strokeWidth="5" strokeLinecap="round"/>
        <path d="M365 49Q404 130 365 209" stroke="#88B7B3" strokeWidth="3"/>
        <path d="M365 49L365 209" stroke="#D2FB91" strokeWidth="1.6" strokeDasharray="4 6"/>
        <g fill="#D2FB91" stroke="#17342D" strokeWidth="2"><circle cx="230" cy="87" r="7"/><circle cx="184" cy="105" r="7"/><circle cx="277" cy="101" r="7"/><circle cx="147" cy="83" r="7"/><circle cx="326" cy="88" r="7"/><circle cx="124" cy="41" r="7"/><circle cx="365" cy="49" r="7"/><circle cx="225" cy="160" r="7"/></g>
        <circle cx="230" cy="47" r="17" fill="#A5C2B5"/>
        <path d="M295 140C305 123 319 120 332 127C348 134 363 121 375 104" stroke="#D2FB91" strokeDasharray="4 7" strokeWidth="2"/>
        <text x="22" y="32" fill="#BFDCD0" fontSize="12" fontFamily="Arial">2D POINTS / REFERENCE</text>
      </svg>
      <div className={styles.diagramTimeline}>
        <span>候補時刻</span><div className={styles.timelineTrack}><i/><i/><i/></div><span>人が確認</span>
      </div>
      <p className={styles.diagramDisclosure}>工程を示す模式図です。実際の一射・測定値・推定精度を表したものではありません。</p>
    </div>
  )
}
