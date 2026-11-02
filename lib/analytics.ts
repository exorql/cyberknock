/** Only fixed vocabulary can leave the page. Never add contact fields or raw URLs. */
export const analyticsEvents = ["cta_click", "case_study_click", "case_study_view", "store_click", "contact_form_start", "contact_form_submit", "contact_form_success", "contact_form_error", "contact_form_abandon"] as const
export type AnalyticsEvent = (typeof analyticsEvents)[number]

const allowedValues: Record<string, readonly string[]> = {
  location: ["header", "hero", "services", "case_study", "process", "profile", "footer", "sports_dx", "security", "contact", "case", "faq", "mobile_nav", "content", "unknown"],
  service: ["sports-ai", "product", "ai-improvement", "advisory", "sports-dx", "other"],
  store: ["app_store", "google_play"],
  source: ["home", "sports_dx", "case_study", "security", "privacy", "other"],
  page: ["home", "sports_dx", "case_study", "security", "privacy", "other"],
  error_type: ["validation", "network", "server", "timeout", "rate_limit", "configuration", "unknown"],
}

const siteOrigin = "https://cyberknock.pages.dev"
const safePagePaths: Record<string, string> = {
  home: "/",
  sports_dx: "/sports-dx",
  case_study: "/cases/ai-sports-trainer",
  security: "/security",
  privacy: "/privacy-policy",
  other: "/",
}

export function pageCategory(path: string): string {
  const cleanPath = path.split(/[?#]/)[0].replace(/\/$/, "")
  const pages: Record<string, string> = { "": "home", "/sports-dx": "sports_dx", "/cases/ai-sports-trainer": "case_study", "/security": "security", "/privacy-policy": "privacy" }
  const aliases: Record<string, string> = { "sports-dx": "sports_dx", "case-study": "case_study", "privacy-policy": "privacy" }
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
      // gtag otherwise defaults these to document.location and document.referrer.
      // Build from constants only; callers cannot override either reserved field.
      page_location: siteOrigin + safePagePaths[page],
      page_referrer: "",
    })
  } catch { /* Optional measurement must never interrupt a lead submission. */ }
}
