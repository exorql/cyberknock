/** Only fixed vocabulary can leave the page. Never add contact fields or raw URLs. */
export const analyticsEvents = ["page_view", "cta_click", "case_study_click", "case_study_view", "demo_click", "insight_click", "store_click", "contact_form_start", "contact_form_submit", "contact_form_success", "contact_form_error", "contact_form_abandon"] as const
export type AnalyticsEvent = (typeof analyticsEvents)[number]

const allowedValues: Record<string, readonly string[]> = {
  location: ["header", "hero", "inquiry", "method", "services", "case_study", "process", "profile", "footer", "sports_dx", "security", "contact", "case", "faq", "mobile_nav", "content", "ai_development", "unknown"],
  service: ["sports-ai", "product", "ai-improvement", "advisory", "sports-dx", "other"],
  store: ["app_store", "google_play"],
  guide: ["overview", "ai-development-outsourcing-guide", "ai-poc-process-evaluation", "ai-video-analysis-poc-cost"],
  source: ["home", "sports_dx", "case_study", "security", "privacy", "ai_development", "other"],
  page: ["home", "sports_dx", "case_study", "security", "privacy", "ai_development", "insights", "insight_cost", "insight_poc", "insight_outsourcing", "ai_demo", "other"],
  error_type: ["validation", "network", "server", "timeout", "rate_limit", "configuration", "unknown"],
}

const siteOrigin = "https://cyberknock.jp"
const safePagePaths: Record<string, string> = {
  home: "/",
  sports_dx: "/sports-dx",
  case_study: "/cases/ai-sports-trainer",
  security: "/security",
  privacy: "/privacy-policy",
  ai_development: "/ai-development",
  insights: "/insights",
  insight_cost: "/insights/ai-video-analysis-poc-cost",
  insight_poc: "/insights/ai-poc-process-evaluation",
  insight_outsourcing: "/insights/ai-development-outsourcing-guide",
  ai_demo: "/demos/ai-sports-trainer",
  other: "/",
}

export function pageCategory(path: string): string {
  const cleanPath = path.split(/[?#]/)[0].replace(/\/$/, "")
  const pages: Record<string, string> = {
    "": "home", "/sports-dx": "sports_dx", "/cases/ai-sports-trainer": "case_study",
    "/security": "security", "/privacy-policy": "privacy", "/ai-development": "ai_development",
    "/insights": "insights", "/insights/ai-video-analysis-poc-cost": "insight_cost",
    "/insights/ai-poc-process-evaluation": "insight_poc",
    "/insights/ai-development-outsourcing-guide": "insight_outsourcing",
    "/demos/ai-sports-trainer": "ai_demo",
  }
  const aliases: Record<string, string> = { "sports-dx": "sports_dx", "case-study": "case_study", "privacy-policy": "privacy", "ai-development": "ai_development" }
  return (Object.hasOwn(pages, cleanPath) ? pages[cleanPath] : undefined) || (Object.hasOwn(aliases, cleanPath) ? aliases[cleanPath] : undefined) || (allowedValues.page.includes(cleanPath) ? cleanPath : "other")
}

export function safeAnalyticsParams(params: Record<string, unknown> = {}): Record<string, string> {
  const safe: Record<string, string> = {}
  for (const [key, values] of Object.entries(allowedValues)) {
    if (typeof params[key] === "string" && values.includes(params[key])) safe[key] = params[key]
  }
  return safe
}

export function trackEvent(event: AnalyticsEvent, params: Record<string, unknown> = {}): void {
  if (typeof window === "undefined" || !analyticsEvents.includes(event)) return
  const analyticsWindow = window as Window & { gtag?: (...args: unknown[]) => void }
  if (typeof analyticsWindow.gtag !== "function") return
  try {
    const page = pageCategory(window.location.pathname)
    analyticsWindow.gtag("event", event, {
      ...safeAnalyticsParams({ ...params, page }),
      page_location: siteOrigin + safePagePaths[page],
      page_referrer: "",
    })
  } catch { /* Optional measurement must never interrupt a lead submission. */ }
}
