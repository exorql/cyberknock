"use client"

import { useEffect, useRef } from "react"
import { usePathname } from "next/navigation"
import { analyticsEvents, pageCategory, trackEvent, type AnalyticsEvent } from "@/lib/analytics"

type AnalyticsWindow = Window & {
  gtag?: (...args: unknown[]) => void
  dataLayer?: unknown[][]
  __cyberknockGa4Bootstrapped?: boolean
}

/**
 * Optional GA4 setup. Measurement ID comes from deployment settings, never from
 * a placeholder or a hard-coded account value. With no ID, no script is loaded.
 * A pre-existing gtag integration remains responsible for its own page views.
 */
function ensureSiteGa4(): boolean {
  const id = process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID
  if (!id || !/^G-[A-Z0-9]{6,15}$/.test(id)) return false
  const analyticsWindow = window as AnalyticsWindow
  if (analyticsWindow.__cyberknockGa4Bootstrapped) return true
  if (typeof analyticsWindow.gtag === "function") return false

  analyticsWindow.dataLayer = analyticsWindow.dataLayer || []
  analyticsWindow.gtag = (...args: unknown[]) => { analyticsWindow.dataLayer?.push(args) }
  analyticsWindow.__cyberknockGa4Bootstrapped = true
  analyticsWindow.gtag("js", new Date())
  analyticsWindow.gtag("config", id, {
    send_page_view: false,
    page_location: "https://cyberknock.pages.dev/",
    page_referrer: "",
    allow_google_signals: false,
    allow_ad_personalization_signals: false,
  })
  const script = document.createElement("script")
  script.async = true
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(id)}`
  script.dataset.cyberknockGa4 = "true"
  document.head.appendChild(script)
  return true
}

/** Events use only fixed, non-identifying page and source categories. */
export function SiteAnalytics() {
  const pathname = usePathname()
  const lastPath = useRef<string | null>(null)

  useEffect(() => {
    const currentPath = pathname || "/"
    if (lastPath.current === currentPath) return
    lastPath.current = currentPath

    if (ensureSiteGa4()) trackEvent("page_view")
    if (["case_study", "soccer_poc", "kyudo_poc"].includes(pageCategory(currentPath))) {
      trackEvent("case_study_view")
    }
  }, [pathname])

  useEffect(() => {
    function click(event: MouseEvent) {
      const target = event.target instanceof Element ? event.target.closest<HTMLElement>("[data-track]") : null
      const name = target?.dataset.track
      if (!target || !name || !analyticsEvents.includes(name as AnalyticsEvent)) return
      trackEvent(name as AnalyticsEvent, {
        location: target.dataset.location,
        service: target.dataset.service,
        store: target.dataset.store,
      })
    }
    document.addEventListener("click", click)
    return () => document.removeEventListener("click", click)
  }, [])
  return null
}
