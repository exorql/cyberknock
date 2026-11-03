"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"
import { analyticsEvents, pageCategory, trackEvent, type AnalyticsEvent } from "@/lib/analytics"

/** Uses an existing gtag only. No measurement ID, remote script, or tracker is invented. */
export function SiteAnalytics() {
  const pathname = usePathname()
  useEffect(() => {
    if (["case_study", "soccer_poc", "kyudo_poc"].includes(pageCategory(pathname || "/"))) trackEvent("case_study_view")
  }, [pathname])

  useEffect(() => {
    function click(event: MouseEvent) {
      const target = event.target instanceof Element ? event.target.closest<HTMLElement>("[data-track]") : null
      const name = target?.dataset.track
      if (!target || !name || !analyticsEvents.includes(name as AnalyticsEvent)) return
      trackEvent(name as AnalyticsEvent, { location: target.dataset.location, service: target.dataset.service, store: target.dataset.store })
    }
    document.addEventListener("click", click)
    return () => document.removeEventListener("click", click)
  }, [])
  return null
}
