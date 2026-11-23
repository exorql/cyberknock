"use client"

import { useEffect, useRef, useState } from "react"
import { LP_HERO } from "@/lib/growth-web/lp-content"
import {
  STICKY_MAX_WIDTH_QUERY,
  type StickyVisibilityState,
  isKeyboardOpen,
  isFormVisibleOrPassed,
  shouldShowSticky,
} from "@/lib/growth-web/sticky-cta"
import { trackGrowthWebEvent } from "@/lib/growth-web/telemetry"

/**
 * Mobile-only CTA to the inquiry form. Shown after the hero CTA leaves the
 * viewport; hidden from the moment the form is reached through the footer,
 * while a field is focused and while the keyboard shrinks the visual viewport.
 */
export function MobileStickyCta() {
  const [visible, setVisible] = useState(false)
  const barRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (typeof window === "undefined" || !("IntersectionObserver" in window)) return
    const mq = window.matchMedia(STICKY_MAX_WIDTH_QUERY)
    const state: StickyVisibilityState = {
      isMobile: mq.matches,
      heroCtaVisible: true,
      formVisible: false,
      fieldFocused: false,
      keyboardOpen: false,
    }
    const baseHeight = window.innerHeight
    const root = document.querySelector<HTMLElement>(".gwl-root")
    const update = () => {
      const on = shouldShowSticky(state)
      setVisible(on)
      root?.style.setProperty("--gwl-sticky-h", on ? `${barRef.current?.offsetHeight ?? 72}px` : "0px")
    }

    const observers: IntersectionObserver[] = []
    const hero = document.getElementById("gwl-hero-cta")
    if (hero) {
      const io = new IntersectionObserver(([entry]) => {
        state.heroCtaVisible = entry.isIntersecting
        update()
      })
      io.observe(hero)
      observers.push(io)
    }
    const form = document.getElementById("contact")
    if (form) {
      const io = new IntersectionObserver(
        ([entry]) => {
          state.formVisible = isFormVisibleOrPassed(entry.isIntersecting, entry.boundingClientRect.bottom)
          update()
        },
        { rootMargin: "0px 0px -20% 0px" }
      )
      io.observe(form)
      observers.push(io)
    }

    const isField = (t: EventTarget | null) =>
      t instanceof HTMLElement && t.matches("input, select, textarea")
    const onFocusIn = (e: FocusEvent) => {
      if (isField(e.target)) {
        state.fieldFocused = true
        update()
      }
    }
    const onFocusOut = (e: FocusEvent) => {
      if (isField(e.target)) {
        state.fieldFocused = false
        update()
      }
    }
    const onMq = () => {
      state.isMobile = mq.matches
      update()
    }
    const vv = window.visualViewport
    const onViewport = () => {
      if (!vv) return
      state.keyboardOpen = isKeyboardOpen(vv.height, baseHeight)
      update()
    }

    document.addEventListener("focusin", onFocusIn)
    document.addEventListener("focusout", onFocusOut)
    mq.addEventListener("change", onMq)
    vv?.addEventListener("resize", onViewport)
    update()
    return () => {
      observers.forEach((o) => o.disconnect())
      document.removeEventListener("focusin", onFocusIn)
      document.removeEventListener("focusout", onFocusOut)
      mq.removeEventListener("change", onMq)
      vv?.removeEventListener("resize", onViewport)
      root?.style.setProperty("--gwl-sticky-h", "0px")
    }
  }, [])

  return (
    <div ref={barRef} className={`gwl-sticky${visible ? " is-on" : ""}`} aria-hidden={!visible} data-testid="gwl-sticky-cta">
      <a
        href="#contact"
        tabIndex={visible ? 0 : -1}
        className="gwl-btn gwl-btn-p"
        onClick={() =>
          trackGrowthWebEvent("lp_hero_cta_click", {
            cta_label: "hero_free_site_audit",
            destination: "#contact",
            location: "growth_web_sticky",
          })
        }
      >
        {LP_HERO.ctaLabel}
      </a>
    </div>
  )
}
