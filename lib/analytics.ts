/** Only fixed vocabulary can leave the page. Never add contact fields or raw URLs. */
export const analyticsEvents = [
  "page_view",
  "cta_click",
  "case_study_click",
  "case_study_view",
  "demo_click",
  "insight_click",
  "store_click",
  "contact_form_start",
  "contact_form_submit",
  "contact_form_success",
  "contact_form_error",
  "contact_form_abandon",
  "b2b_demo_video_start",
  "b2b_demo_video_50",
  "b2b_demo_video_complete",
  "b2b_demo_contact_click",
  "lp_hero_cta_click",
  "lp_demo_cta_click",
  "lp_roi_calculator_change",
  "lp_faq_toggle",
  "service_inquiry_start",
  "service_inquiry_submit",
  "service_inquiry_error",
  "demo_view",
  "demo_hero_cta_click",
  "demo_sticky_cta_click",
  "demo_schedule_filter",
  "demo_class_select",
  "demo_pricing_toggle",
  "demo_faq_toggle",
  "trial_form_start",
  "trial_form_submit",
  "trial_form_error",
  "demo_inspector_toggle",
] as const
export type AnalyticsEvent = (typeof analyticsEvents)[number]

/** The only first-party B2B demo video whose events may be measured. */
export const b2bDemoVideo = { id: "cyberknock_b2b_ai_demo_25s", durationSeconds: 25, placement: "ai_development_proof" } as const

const allowedValues: Record<string, readonly string[]> = {
  location: [
    "header", "hero", "inquiry", "method", "services", "case_study", "process", "profile",
    "footer", "sports_dx", "security", "contact", "case", "faq", "mobile_nav", "content",
    "ai_development", "demo_video", "demo_footer",
    "growth_web_hero", "growth_web_comparison", "growth_web_simulator",
    "growth_web_demo_bridge", "growth_web_pricing", "growth_web_demo_hero",
    "growth_web_demo_sticky", "growth_web_sticky", "unknown",
  ],
  service: ["sports-ai", "product", "ai-improvement", "advisory", "sports-dx", "growth-web", "other"],
  store: ["app_store", "google_play"],
  guide: ["overview", "ai-development-outsourcing-guide", "ai-poc-process-evaluation", "ai-video-analysis-poc-cost", "ai-video-analysis-development-request"],
  source: ["home", "sports_dx", "case_study", "security", "privacy", "ai_development", "growth_web", "other"],
  page: [
    "home", "sports_dx", "case_study", "security", "privacy", "ai_development",
    "insights", "insight_cost", "insight_poc", "insight_outsourcing", "insight_video_request",
    "ai_demo", "growth_web", "growth_web_demo", "other",
  ],
  error_type: ["validation", "network", "server", "timeout", "rate_limit", "configuration", "unknown"],
  video_id: [b2bDemoVideo.id],
  video_duration: [String(b2bDemoVideo.durationSeconds)],
  placement: [b2bDemoVideo.placement],
  demo_video: ["started"],
  // Growth Web strictly allowlisted funnel parameters (zero PII possible)
  cta_label: [
    "hero_free_site_audit", "comparison_to_simulator", "comparison_to_audit",
    "simulator_to_free_audit", "pricing_free_site_audit", "subnav_free_audit",
    "hero_demo", "demo_bridge", "pricing_demo", "subnav_demo",
  ],
  section: ["hero", "demo_bridge", "pricing", "subnav"],
  destination: ["#contact", "#simulator", "#schedule", "#trial-form"],
  form_id: ["growth_web_inquiry", "growth_web_demo_trial"],
  inquiry_type: ["free_site_audit", "pilot_partner", "demo_walkthrough", "other"],
  delivery_mode: ["live", "local_dry_run"],
  viability_status: ["favorable", "caution", "unviable"],
  payback_band: ["within_6m", "7_to_9m", "10_to_12m", "over_12m"],
  question_id: [
    "why-no-fake-cases", "difference-from-low-cost-updates", "photos-and-materials",
    "existing-booking-tools", "contract-and-ownership", "consultation-flow",
    "demo-faq-beginner", "demo-faq-parent-duty", "demo-faq-rain",
    "demo-faq-items", "demo-faq-demo-notice",
  ],
  expanded: ["true", "false"],
  open: ["true", "false"],
  is_demo: ["true", "false"],
  school_type: ["junior_soccer_and_movement"],
  grade_filter: ["all", "preschool_senior", "grade_1_2", "grade_3", "grade_4", "grade_3_4", "grade_5_6"],
  campus_filter: ["all", "futako_turf", "yoga_gym"],
  day_filter: ["all", "tue", "wed", "thu", "fri", "sat", "multiple"],
  class_id: ["kids-movement-tue", "u9-soccer-wed", "indoor-agility-thu", "u12-game-sense-fri", "weekend-family-sat"],
  preselected_class: ["kids-movement-tue", "u9-soccer-wed", "indoor-agility-thu", "u12-game-sense-fri", "weekend-family-sat"],
  grade: ["preschool_senior", "grade_1_2", "grade_3", "grade_4", "grade_3_4", "grade_5_6"],
  discount_mode: ["standard", "sibling_second_child"],
  action: ["jump_schedule", "jump_trial_form", "school_header", "hero_primary", "hero_schedule", "schedule_consult_card"],
  result_count: ["0", "1", "2", "3", "4", "5"],
}

const siteOrigin = "https://cyberknock.jp"
const allowedUtmKeys = ["utm_source", "utm_medium", "utm_campaign", "utm_content"] as const
const allowedUtmMedia = new Set([
  "organic", "referral", "social", "video", "email", "cpc", "ppc",
  "display", "affiliate", "partner", "qr", "profile", "footer", "doc",
])
const safeUtmSlugPattern = /^[a-z0-9]+(?:[_-][a-z0-9]+)*$/
const publicHostPattern = /^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,24}$/
const piiTokenSegmentPattern = /(?:^|[_-])(?:email|mail|phone|tel|mobile|user|userid|name|fullname|token|session|secret|passwd|password|client|address|birthday)(?:$|[_-])/
const phoneLikePattern = /^0\d{1,4}[_-]\d{1,4}[_-]\d{3,4}$/
const postalLikePattern = /^\d{3}[_-]\d{4}$/
const longHexPattern = /^[0-9a-f]{12,}$/
const uuidPrefixPattern = /^[0-9a-f]{8}[_-][0-9a-f]{4}[_-][0-9a-f]{4}/
const disallowedReferrerSuffixes = [".cyberknock.jp", ".pages.dev", ".localhost", ".local", ".internal", ".invalid", ".test", ".example"]

/** Preview deployments must not initialize the production GA4 property. */
export function isProductionAnalyticsHost(hostname: string): boolean {
  return hostname === "cyberknock.jp" || hostname === "www.cyberknock.jp"
}

/**
 * Returns only the stripped origin (with trailing slash) for public external HTTP/HTTPS referrers.
 * Internal hosts, preview hostnames, IP literals, ports, credentials, paths, and queries are rejected.
 */
export function safeExternalReferrer(rawReferrer?: string | null): string {
  if (typeof rawReferrer !== "string") return ""
  const trimmed = rawReferrer.trim()
  if (!trimmed || trimmed.length > 2048) return ""
  try {
    const parsed = new URL(trimmed)
    if (parsed.protocol !== "https:" && parsed.protocol !== "http:") return ""
    if (parsed.username || parsed.password || parsed.port) return ""
    const host = parsed.hostname.toLowerCase().replace(/\.$/, "")
    if (!host || host === "cyberknock.jp" || host === "localhost") return ""
    if (disallowedReferrerSuffixes.some((suffix) => host.endsWith(suffix))) return ""
    if (/^\d{1,3}(?:\.\d{1,3}){3}$/.test(host) || host.includes(":")) return ""
    if (!publicHostPattern.test(host)) return ""
    return `${parsed.protocol}//${host}/`
  } catch {
    return ""
  }
}

function isSafeUtmValue(key: (typeof allowedUtmKeys)[number], rawValue: string): string | null {
  if (!rawValue || rawValue.length > 50) return null
  if (/[\u0000-\u001f\u007f\s@./:%?&#=+\\]/.test(rawValue)) return null
  const normalized = rawValue.toLowerCase()
  if (!safeUtmSlugPattern.test(normalized)) return null
  if (key === "utm_medium") {
    return allowedUtmMedia.has(normalized) ? normalized : null
  }
  const digitCount = (normalized.match(/\d/g) || []).length
  if (digitCount >= 9) return null
  if (phoneLikePattern.test(normalized) || postalLikePattern.test(normalized)) return null
  if (longHexPattern.test(normalized) || uuidPrefixPattern.test(normalized)) return null
  if (piiTokenSegmentPattern.test(normalized)) return null
  return normalized
}

/**
 * Validates both UTM parameter keys and values against a strict slug/token allowlist
 * so raw search terms, emails, phone numbers, names, or IDs can never reach GA4.
 */
export function sanitizeUtmQuery(rawSearch?: string | null): string {
  if (typeof rawSearch !== "string") return ""
  const trimmed = rawSearch.trim().replace(/^\?/, "")
  if (!trimmed || trimmed.length > 512) return ""
  const params = new URLSearchParams(trimmed)
  const clean = new URLSearchParams()
  for (const key of allowedUtmKeys) {
    const values = params.getAll(key)
    if (values.length !== 1) continue
    const safeVal = isSafeUtmValue(key, values[0])
    if (safeVal) clean.set(key, safeVal)
  }
  const serialized = clean.toString()
  return serialized ? `?${serialized}` : ""
}

export function buildSafePageLocation(
  page: string,
  rawSearch?: string | null,
  includeUtm = false,
): string {
  const safePath = Object.hasOwn(safePagePaths, page) ? safePagePaths[page] : "/"
  const query = includeUtm ? sanitizeUtmQuery(rawSearch) : ""
  return `${siteOrigin}${safePath}${query}`
}
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
  insight_video_request: "/insights/ai-video-analysis-development-request",
  ai_demo: "/demos/ai-sports-trainer",
  growth_web: "/services/growth-web",
  growth_web_demo: "/services/growth-web/demo",
  other: "/",
}

const videoParams = ["video_id", "video_duration", "placement"] as const
const demoSegmentedEvents: readonly AnalyticsEvent[] = ["contact_form_start", "contact_form_submit", "contact_form_success"]
let demoVideoStarted = false

/**
 * Records, in memory only, that the visitor started the B2B demo video in this page session.
 * Nothing is persisted; a reload resets it. Contact events then carry demo_video=started so
 * inquiries can be segmented by demo engagement without creating a second conversion event.
 */
export function markDemoVideoStarted(): void { demoVideoStarted = true }

export function pageCategory(path: string): string {
  const cleanPath = path.split(/[?#]/)[0].replace(/\/$/, "")
  const pages: Record<string, string> = {
    "": "home", "/sports-dx": "sports_dx", "/cases/ai-sports-trainer": "case_study",
    "/security": "security", "/privacy-policy": "privacy", "/ai-development": "ai_development",
    "/insights": "insights", "/insights/ai-video-analysis-poc-cost": "insight_cost",
    "/insights/ai-poc-process-evaluation": "insight_poc",
    "/insights/ai-development-outsourcing-guide": "insight_outsourcing",
    "/insights/ai-video-analysis-development-request": "insight_video_request",
    "/demos/ai-sports-trainer": "ai_demo",
    "/services/growth-web": "growth_web",
    "/services/growth-web/demo": "growth_web_demo",
  }
  const aliases: Record<string, string> = {
    "sports-dx": "sports_dx",
    "case-study": "case_study",
    "privacy-policy": "privacy",
    "ai-development": "ai_development",
    "growth-web": "growth_web",
  }
  return (Object.hasOwn(pages, cleanPath) ? pages[cleanPath] : undefined) || (Object.hasOwn(aliases, cleanPath) ? aliases[cleanPath] : undefined) || (allowedValues.page.includes(cleanPath) ? cleanPath : "other")
}

export function safeAnalyticsParams(params: Record<string, unknown> = {}): Record<string, string> {
  const safe: Record<string, string> = {}
  for (const [key, values] of Object.entries(allowedValues)) {
    if (typeof params[key] === "string" && values.includes(params[key])) safe[key] = params[key]
  }
  return safe
}

type GtagQueueWindow = {
  dataLayer?: unknown[]
  gtag?: (...args: unknown[]) => void
}

/**
 * The Google tag processes IArguments objects, not arrays.
 * Keep the standard gtag.js queue shape so config and manual page_view reach GA4.
 */
export function initializeGtagDataLayer(target: GtagQueueWindow): (...args: unknown[]) => void {
  target.dataLayer ??= []
  target.gtag = function (..._args: unknown[]) {
    target.dataLayer?.push(arguments)
  }
  return target.gtag
}

export type TrackEventOptions = {
  includeAttribution?: boolean
}

export function trackEvent(
  event: AnalyticsEvent,
  params: Record<string, unknown> = {},
  options: TrackEventOptions = {},
): void {
  if (typeof window === "undefined" || !analyticsEvents.includes(event)) return
  const analyticsWindow = window as Window & { gtag?: (...args: unknown[]) => void }
  if (typeof analyticsWindow.gtag !== "function") return
  try {
    const page = pageCategory(window.location.pathname)
    const isDemoEvent = event.startsWith("b2b_demo_")
    const includeAttribution = event === "page_view" && options.includeAttribution === true
    const rawSearch = typeof window.location?.search === "string" ? window.location.search : ""
    const rawReferrer = typeof document !== "undefined" && typeof document.referrer === "string" ? document.referrer : ""
    const input: Record<string, unknown> = { ...params, page }
    // Video identifiers belong only to demo events; engagement flags come only from this module.
    delete input.demo_video
    if (!isDemoEvent) for (const key of videoParams) delete input[key]
    if (demoVideoStarted && demoSegmentedEvents.includes(event)) input.demo_video = "started"
    analyticsWindow.gtag("event", event, {
      ...safeAnalyticsParams(input),
      // Canonical path from the fixed page category, never from the raw URL.
      ...(isDemoEvent ? { page_path: safePagePaths[page] } : {}),
      page_location: buildSafePageLocation(page, rawSearch, includeAttribution),
      page_referrer: includeAttribution ? safeExternalReferrer(rawReferrer) : "",
    })
  } catch { /* Optional measurement must never interrupt a lead submission. */ }
}
