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

/** Preview deployments must not initialize the production GA4 property. */
export function isProductionAnalyticsHost(hostname: string): boolean {
  return hostname === "cyberknock.jp" || hostname === "www.cyberknock.jp"
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

export function trackEvent(event: AnalyticsEvent, params: Record<string, unknown> = {}): void {
  if (typeof window === "undefined" || !analyticsEvents.includes(event)) return
  const analyticsWindow = window as Window & { gtag?: (...args: unknown[]) => void }
  if (typeof analyticsWindow.gtag !== "function") return
  try {
    const page = pageCategory(window.location.pathname)
    const isDemoEvent = event.startsWith("b2b_demo_")
    const input: Record<string, unknown> = { ...params, page }
    // Video identifiers belong only to demo events; engagement flags come only from this module.
    delete input.demo_video
    if (!isDemoEvent) for (const key of videoParams) delete input[key]
    if (demoVideoStarted && demoSegmentedEvents.includes(event)) input.demo_video = "started"
    analyticsWindow.gtag("event", event, {
      ...safeAnalyticsParams(input),
      // Canonical path from the fixed page category, never from the raw URL.
      ...(isDemoEvent ? { page_path: safePagePaths[page] } : {}),
      page_location: siteOrigin + safePagePaths[page],
      page_referrer: "",
    })
  } catch { /* Optional measurement must never interrupt a lead submission. */ }
}
