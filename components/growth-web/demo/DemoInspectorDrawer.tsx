"use client"

import { useState } from "react"
import { DEMO_MEASURE_POINTS } from "@/lib/growth-web/demo-content"
import type { GrowthWebEventRecord } from "@/lib/growth-web/telemetry"

interface DemoInspectorDrawerProps {
  open: boolean
  events: GrowthWebEventRecord[]
  onClose: () => void
}

const CRO_DESIGN_NOTES = [
  "学年・曜日・場所の3条件でクラスを絞り込み、PDFの時間割を開かずに選べる",
  "選んだクラスと学年が、体験フォームに自動で入る",
  "月謝以外の費用・当番なし・雨天振替を、申し込み前に公開",
  "計測は決められた語彙だけをGA4に送り、名前やメールなどの個人情報は送らない",
]

/**
 * Owner (measurement) mode. Hidden for parents. On wide screens it is a side rail
 * and the page shifts left so nothing is covered; on narrow screens it is a
 * one-line strip at the top that expands in the page flow (never over the CTAs).
 */
export function DemoInspectorDrawer({ open, events, onClose }: DemoInspectorDrawerProps) {
  const [expanded, setExpanded] = useState(false)
  if (!open) return null

  return (
    <aside
      id="demo-ga4-inspector"
      className={`gwd-insp gwd-dark${expanded ? " is-expanded" : ""}`}
      aria-label="計測モード（経営者向け）"
      data-testid="ga4-inspector-drawer"
    >
      <div className="gwd-insp-h">
        <h2>OWNER VIEW</h2>
        <span className="c">計測イベント {events.length}件</span>
        <button
          type="button"
          className="toggle"
          aria-expanded={expanded}
          aria-controls="demo-inspector-body"
          onClick={() => setExpanded((v) => !v)}
        >
          {expanded ? "たたむ" : "詳細"}
        </button>
        <button type="button" onClick={onClose} aria-label="計測モードを閉じる">
          閉じる
        </button>
      </div>
      <div className="gwd-insp-body" id="demo-inspector-body">
        <p className="gwd-insp-hint">保護者には表示されません。ページ上の番号の場所で、次の行動を計測しています。</p>
        <ol className="gwd-pins">
          {DEMO_MEASURE_POINTS.map((p) => (
            <li key={p.pin}>
              <i>{p.pin}</i>
              <span>{p.label}</span>
              <code>{p.event}</code>
            </li>
          ))}
        </ol>
        <h3>このページで発生したイベント</h3>
        {events.length === 0 ? (
          <p className="gwd-insp-hint">クラス検索・料金・FAQ・体験フォームを操作すると、ここに表示されます。</p>
        ) : (
          <ul className="gwd-events" data-testid="inspector-event-list">
            {events.slice(0, 12).map((ev) => (
              <li key={ev.id}>
                <div>
                  <code>{ev.event}</code>
                  <time dateTime={ev.timestamp}>
                    {new Date(ev.timestamp).toLocaleTimeString("ja-JP", { hour12: false })}
                  </time>
                </div>
                <pre>{JSON.stringify(ev.params)}</pre>
              </li>
            ))}
          </ul>
        )}
        <h3>このデモに入っているCVR改善の工夫</h3>
        <ul className="gwd-notes">
          {CRO_DESIGN_NOTES.map((note) => (
            <li key={note}>{note}</li>
          ))}
        </ul>
      </div>
    </aside>
  )
}
