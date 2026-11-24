"use client"

import { useEffect, useState } from "react"
import { isTextEntry, shouldShowDemoSticky } from "@/lib/growth-web/demo-sticky"
import { trackGrowthWebEvent } from "@/lib/growth-web/telemetry"

interface MobileStickyBarProps {
  onJumpToBooking: () => void
}

/** Mobile-only (CSS) bar. Visibility: lib/growth-web/demo-sticky.ts */
export function MobileStickyBar({ onJumpToBooking }: MobileStickyBarProps) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    let frame = 0
    const update = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        const hero = document.getElementById("top")
        const form = document.getElementById("trial-form")
        if (!hero || !form) return
        setVisible(
          shouldShowDemoSticky({
            heroBottom: hero.getBoundingClientRect().bottom,
            formTop: form.getBoundingClientRect().top,
            viewportHeight: window.innerHeight,
            fieldFocused: isTextEntry(document.activeElement),
          })
        )
      })
    }
    update()
    window.addEventListener("scroll", update, { passive: true })
    window.addEventListener("resize", update)
    document.addEventListener("focusin", update)
    document.addEventListener("focusout", update)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener("scroll", update)
      window.removeEventListener("resize", update)
      document.removeEventListener("focusin", update)
      document.removeEventListener("focusout", update)
    }
  }, [])

  return (
    <div className={`gwd-stick${visible ? " is-visible" : ""}`} aria-hidden={!visible} data-testid="mobile-sticky-bar">
      <span className="p">
        月謝<b className="gwd-num">7,700円〜</b>
      </span>
      <a
        className="gwd-btn gwd-btn-sun"
        href="#trial-form"
        tabIndex={visible ? 0 : -1}
        data-gwd-pin="8"
        onClick={(e) => {
          e.preventDefault()
          trackGrowthWebEvent("demo_sticky_cta_click", { action: "jump_trial_form", is_demo: true })
          onJumpToBooking()
        }}
      >
        無料体験を予約する
      </a>
    </div>
  )
}
