"use client"

import { Activity, CheckCircle2, X } from "lucide-react"
import { useEffect } from "react"
import type { GrowthWebEventRecord } from "@/lib/growth-web/telemetry"

interface DemoInspectorDrawerProps {
  open: boolean
  events: GrowthWebEventRecord[]
  onClose: () => void
}

const CRO_DESIGN_NOTES = [
  "学年×拠点の即時絞り込みで、PDF時間割によるスマホ離脱を排除",
  "クラス選択から体験フォームへ自動プリフィル連動し、入力負荷を半減",
  "月謝以外の初期費用・親当番なし・雨天振替を申込前に全公開",
  "全ファネル操作をGA4カスタムイベント（個人情報除外・許可語彙のみ）として構造化計測",
]

export function DemoInspectorDrawer({
  open,
  events,
  onClose,
}: DemoInspectorDrawerProps) {
  useEffect(() => {
    if (!open) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      id="demo-ga4-inspector"
      role="dialog"
      aria-modal="false"
      aria-label="Cyber Knock CVR・GA4計測インスペクター"
      data-testid="ga4-inspector-drawer"
      className="gw-dark-surface fixed right-3 top-[5.25rem] z-50 flex max-h-[78vh] w-[calc(100vw-1.5rem)] max-w-md flex-col overflow-hidden rounded-2xl border border-[#2a4e40] bg-[#0e1b16] text-[#f6f5f0] shadow-2xl sm:right-5 sm:top-14 sm:max-h-[82vh]"
    >
      <div className="flex items-center justify-between border-b border-white/15 px-4 py-3">
        <div className="flex items-center gap-2">
          <Activity className="h-4 w-4 text-[#6ee7b7]" aria-hidden="true" />
          <div>
            <p className="font-mono text-xs font-bold text-[#6ee7b7]">
              CYBER KNOCK GA4 / CVR INSPECTOR
            </p>
            <p className="text-[11px] text-[#c6d4cd]">
              スクール経営者向け・計測動作確認パネル
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="計測インスペクターを閉じる"
          className="inline-flex min-h-9 min-w-9 items-center justify-center rounded-lg border border-white/20 text-white hover:bg-white/10"
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>

      <div className="flex-1 space-y-5 overflow-y-auto p-4">
        {/* Live GA4 Events */}
        <div>
          <div className="flex items-center justify-between">
            <h3 className="font-mono text-[11px] font-bold uppercase tracking-[0.12em] text-[#a7f3d0]">
              LIVE DATA LAYER EVENTS ({events.length})
            </h3>
            <span className="text-[11px] text-[#c6d4cd]">最新順</span>
          </div>

          {events.length === 0 ? (
            <p className="mt-2 rounded-xl border border-white/10 bg-white/[0.04] p-3 text-xs text-[#c6d4cd]">
              ページ内のフィルタ・FAQ・体験フォームを操作すると、GA4イベントがここに即時表示されます。
            </p>
          ) : (
            <ul
              data-testid="inspector-event-list"
              className="mt-2.5 space-y-2"
            >
              {events.map((ev) => (
                <li
                  key={ev.id}
                  className="rounded-xl border border-white/[0.12] bg-[#14261f] p-3 font-mono text-[11px]"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-bold text-[#6ee7b7]">{ev.event}</span>
                    <span className="text-[10px] text-[#9fb2a8]">
                      {new Date(ev.timestamp).toLocaleTimeString("ja-JP", {
                        hour12: false,
                      })}
                    </span>
                  </div>
                  <pre className="mt-1.5 overflow-x-auto whitespace-pre-wrap text-[10px] leading-relaxed text-[#d6e4dd]">
                    {JSON.stringify(ev.params)}
                  </pre>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* CRO Blueprint Checklist */}
        <div className="border-t border-white/[0.12] pt-4">
          <h3 className="font-mono text-[11px] font-bold uppercase tracking-[0.12em] text-[#a7f3d0]">
            実装済みの体験CVR向上ポイント
          </h3>
          <ul className="mt-2.5 space-y-2">
            {CRO_DESIGN_NOTES.map((note) => (
              <li
                key={note}
                className="flex items-start gap-2 text-xs leading-relaxed text-[#d6e4dd]"
              >
                <CheckCircle2
                  className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#6ee7b7]"
                  aria-hidden="true"
                />
                <span>{note}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
