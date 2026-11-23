"use client"

import Link from "next/link"
import { Activity, ArrowLeft, Sparkles } from "lucide-react"

interface DemoBannerProps {
  eventCount: number
  inspectorOpen: boolean
  onToggleInspector: () => void
}

export function DemoBanner({
  eventCount,
  inspectorOpen,
  onToggleInspector,
}: DemoBannerProps) {
  return (
    <div
      role="region"
      aria-label="デモサイト案内バー"
      className="gw-dark-surface sticky top-0 z-50 border-b border-[#244538] bg-[#0e1b16] text-[#f6f5f0]"
    >
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-x-3 gap-y-1.5 px-3 py-1.5 sm:px-6 sm:py-2 lg:px-8">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[11px] sm:text-xs">
          <span className="inline-flex items-center gap-1 rounded-full bg-[#b8430f] px-2 py-0.5 font-mono text-[10px] font-bold text-white sm:px-2.5 sm:text-[11px]">
            <Sparkles className="h-3 w-3" aria-hidden="true" />
            DEMO SITE
          </span>
          <span className="font-medium text-[#e3eee8]">
            <span className="text-[#a7f3d0] sm:hidden">
              架空モデル（予約・外部送信なし）
            </span>
            <span className="hidden sm:inline">
              Cyber Knock 民間スポーツスクール向け集客モデル
              <span className="text-[#a7f3d0]">
                （架空スクール・保存/外部送信なし）
              </span>
            </span>
          </span>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2">
          <button
            type="button"
            onClick={onToggleInspector}
            aria-expanded={inspectorOpen}
            aria-controls="demo-ga4-inspector"
            data-testid="toggle-ga4-inspector"
            className="inline-flex min-h-9 items-center gap-1.5 rounded-lg border border-[#6ee7b7]/50 bg-[#0a5c42]/60 px-2.5 text-[11px] font-bold text-white transition-colors hover:bg-[#0a5c42] sm:px-3 sm:text-xs"
          >
            <Activity
              className="h-3.5 w-3.5 text-[#6ee7b7]"
              aria-hidden="true"
            />
            <span>GA4ログ</span>
            <span
              data-testid="inspector-event-count"
              className="rounded-full bg-[#6ee7b7] px-1.5 py-0.5 font-mono text-[10px] font-extrabold text-[#0e1b16] tabular-nums"
            >
              {eventCount}
            </span>
          </button>

          <Link
            href="/services/growth-web"
            className="inline-flex min-h-9 items-center gap-1 rounded-lg border border-white/25 bg-white/10 px-2.5 text-[11px] font-semibold text-white transition-colors hover:bg-white/20 sm:px-3 sm:text-xs"
          >
            <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Growth Web LPへ</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
