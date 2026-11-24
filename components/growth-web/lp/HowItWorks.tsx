import { HOW_IT_WORKS, SERIF_TEXT } from "@/lib/growth-web/lp-content"

const C = { line: "#B9C5BE", chalk: "#EEF1EC", mark: "#C93D14" }

function PhoneOutline({ x, opacity = 1, stroke = C.line }: { x: number; opacity?: number; stroke?: string }) {
  return (
    <g opacity={opacity}>
      <rect x={x} y="2" width="64" height="104" rx="10" fill="none" stroke={stroke} strokeWidth="1.5" />
      <rect x={x + 10} y="16" width="34" height="5" rx="2.5" fill={C.line} />
    </g>
  )
}

const MINIS = [
  <svg key="m1" viewBox="0 0 240 108">
    <PhoneOutline x={88} />
    <rect x="98" y="30" width="44" height="14" rx="3" fill="none" stroke={C.line} strokeWidth="1.5" />
    <rect x="98" y="52" width="44" height="14" rx="3" fill="none" stroke={C.line} strokeWidth="1.5" />
    <rect x="98" y="80" width="44" height="12" rx="3" fill={C.line} />
    <g fill={C.chalk}><circle cx="108" cy="37" r="3" /><circle cx="130" cy="59" r="3" /><circle cx="120" cy="86" r="3" /></g>
    <g fill="none" stroke={C.chalk} strokeWidth="1.5" opacity=".5"><circle cx="108" cy="37" r="7.5" /><circle cx="130" cy="59" r="7.5" /><circle cx="120" cy="86" r="7.5" /></g>
  </svg>,
  <svg key="m2" viewBox="0 0 240 108">
    <PhoneOutline x={88} />
    <rect x="98" y="30" width="44" height="14" rx="3" fill="none" stroke={C.line} strokeWidth="1.5" />
    <rect x="98" y="52" width="44" height="14" rx="3" fill="none" stroke={C.line} strokeWidth="1.5" />
    <rect x="93" y="48" width="54" height="22" rx="6" fill="none" stroke={C.mark} strokeWidth="1.5" strokeDasharray="3 3" />
    <rect x="98" y="80" width="44" height="12" rx="3" fill={C.line} />
    <path d="M147 59h33" stroke={C.mark} strokeWidth="1.5" strokeDasharray="3 3" />
    <circle cx="192" cy="59" r="11" fill={C.mark} />
    <path d="M192 53v7" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
    <circle cx="192" cy="64" r="1.3" fill="#fff" />
  </svg>,
  <svg key="m3" viewBox="0 0 240 108">
    <g opacity=".55">
      <PhoneOutline x={30} />
      <rect x="40" y="30" width="44" height="14" rx="3" fill="none" stroke={C.line} strokeWidth="1.5" />
      <rect x="40" y="62" width="44" height="14" rx="3" fill="none" stroke={C.line} strokeWidth="1.5" />
      <rect x="40" y="84" width="44" height="12" rx="3" fill={C.line} />
    </g>
    <path d="M106 54h26m-6-5 6 5-6 5" fill="none" stroke={C.chalk} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <PhoneOutline x={146} stroke={C.chalk} />
    <rect x="156" y="30" width="44" height="14" rx="3" fill="none" stroke={C.line} strokeWidth="1.5" />
    <rect x="156" y="48" width="44" height="12" rx="3" fill={C.mark} />
    <rect x="156" y="66" width="44" height="12" rx="3" fill="none" stroke={C.line} strokeWidth="1.5" />
    <rect x="156" y="84" width="44" height="12" rx="3" fill={C.line} />
  </svg>,
  <svg key="m4" viewBox="0 0 240 108">
    <path d="M16 92h208" stroke={C.line} strokeWidth="1.5" opacity=".5" />
    <path d="M24 80c30-1 60-3 96-6" fill="none" stroke={C.line} strokeWidth="1.5" strokeDasharray="3 4" />
    <path d="M120 74c34-6 62-18 96-30" fill="none" stroke={C.chalk} strokeWidth="1.5" strokeLinecap="round" />
    <path d="M120 10v82" stroke={C.mark} strokeWidth="1.5" strokeDasharray="3 3" />
    <circle cx="120" cy="10" r="4" fill={C.mark} />
    <text x="128" y="14" fill={C.chalk} fontSize="12" fontFamily="Hiragino Sans, Yu Gothic UI, Noto Sans JP, sans-serif">改修</text>
    <text x="224" y="106" fill={C.line} fontSize="12" fontFamily="Hiragino Sans, Yu Gothic UI, Noto Sans JP, sans-serif" textAnchor="end">概念図（数値なし）</text>
  </svg>,
]

export function HowItWorks() {
  const { steps, report, roles } = HOW_IT_WORKS
  return (
    <section className="gwl-how" id="how" aria-labelledby="gwl-how-h">
      <div className="gwl-wrap">
        <div className="gwl-how-head">
          <div>
            <p className="gwl-lbl">{HOW_IT_WORKS.label}</p>
            <h2 id="gwl-how-h" className="gwl-serif">
              {SERIF_TEXT.howTitleLine1}
              <br />
              {SERIF_TEXT.howTitleLine2}
            </h2>
          </div>
          <p className="gwl-sub">
            {HOW_IT_WORKS.sub}
            <b>{HOW_IT_WORKS.subStrong}</b>
          </p>
        </div>

        <ol className="gwl-loop">
          {steps.map((step, i) => (
            <li key={step.n} className={`gwl-st${"hot" in step && step.hot ? " is-hot" : ""}`}>
              <span className="gwl-n" aria-hidden="true">{step.n}</span>
              <h3>{step.title}</h3>
              <p>{step.body}</p>
              <div className="gwl-mini" aria-hidden="true">{MINIS[i]}</div>
            </li>
          ))}
        </ol>
        <p className="gwl-again">
          <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
            <path d="M14 6a6 6 0 1 0 1 5" fill="none" stroke={C.line} strokeWidth="1.5" strokeLinecap="round" />
            <path d="M14.5 2.5v4h-4" fill="none" stroke={C.line} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {HOW_IT_WORKS.again}
        </p>

        <div className="gwl-duo">
          <article className="gwl-sheet" id="sample-report" aria-labelledby="gwl-report-h">
            <div className="gwl-sheet-h">
              <div>
                <h3 id="gwl-report-h">{report.title}</h3>
                <p>{report.caption}</p>
              </div>
              <span className="gwl-stamp">SAMPLE</span>
            </div>
            <dl>
              {report.rows.map((row) => (
                <div key={row.label}>
                  <dt>{row.label}</dt>
                  <dd>{row.body}</dd>
                </div>
              ))}
            </dl>
            <p className="gwl-fine">{report.note}</p>
          </article>
          <div className="gwl-roles">
            <div>
              <h3>スクールがすること</h3>
              <ul>{roles.school.map((r) => <li key={r}>{r}</li>)}</ul>
            </div>
            <div className="gwl-us">
              <h3>Growth Webがすること</h3>
              <ul>{roles.us.map((r) => <li key={r}>{r}</li>)}</ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
