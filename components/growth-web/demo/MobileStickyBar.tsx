"use client"

import { CalendarCheck, Search } from "lucide-react"
import { useEffect, useState } from "react"
import { trackGrowthWebEvent } from "@/lib/growth-web/telemetry"

interface MobileStickyBarProps {
  onJumpToBooking: () => void
}

export function MobileStickyBar({ onJumpToBooking }: MobileStickyBarProps) {
  const [heroVisible, setHeroVisible] = useState(true)
  const [formVisible, setFormVisible] = useState(false)

  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return

    const heroTarget = document.getElementById("demo-hero")
    const formTarget = document.getElementById("trial-form")

    const heroObserver = heroTarget
      ? new IntersectionObserver(
          (entries) => {
            setHeroVisible(Boolean(entries[0]?.isIntersecting))
          },
          { threshold: 0.1 }
        )
      : null

    const formObserver = formTarget
      ? new IntersectionObserver(
          (entries) => {
            setFormVisible(Boolean(entries[0]?.isIntersecting))
          },
          { threshold: 0.15 }
        )
      : null

    if (heroTarget && heroObserver) heroObserver.observe(heroTarget)
    if (formTarget && formObserver) formObserver.observe(formTarget)

    return () => {
      heroObserver?.disconnect()
      formObserver?.disconnect()
    }
  }, [])

  if (heroVisible || formVisible) {
    return null
  }

  return (
    <div
      role="region"
      aria-label="モバイル体験予約クイックバー"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-[#dddad0] bg-white/95 px-3 py-2.5 shadow-[0_-8px_24px_rgba(16,33,27,0.12)] backdrop-blur-md lg:hidden"
    >
      <div className="mx-auto grid max-w-md grid-cols-2 gap-2.5">
        <a
          href="#schedule"
          onClick={() =>
            trackGrowthWebEvent("demo_sticky_cta_click", {
              action: "jump_schedule",
              is_demo: true,
            })
          }
          className="inline-flex min-h-12 items-center justify-center gap-1.5 rounded-xl border border-[#0d5e43] bg-white px-3 text-xs font-bold text-[#0d5e43]"
        >
          <Search className="h-4 w-4" aria-hidden="true" />
          クラス・曜日を見る
        </a>
        <button
          type="button"
          onClick={() => {
            trackGrowthWebEvent("demo_sticky_cta_click", {
              action: "jump_trial_form",
              is_demo: true,
            })
            onJumpToBooking()
          }}
          className="inline-flex min-h-12 items-center justify-center gap-1.5 rounded-xl bg-[#b8430f] px-3 text-xs font-bold text-white shadow-sm"
        >
          <CalendarCheck className="h-4 w-4" aria-hidden="true" />
          無料体験（60秒）
        </button>
      </div>
    </div>
  )
}
