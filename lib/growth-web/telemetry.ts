import {
  safeAnalyticsParams,
  trackEvent,
  type AnalyticsEvent,
} from "@/lib/analytics"

export type GrowthWebEventName = Extract<
  AnalyticsEvent,
  | "lp_hero_cta_click"
  | "lp_demo_cta_click"
  | "lp_roi_calculator_change"
  | "lp_faq_toggle"
  | "service_inquiry_start"
  | "service_inquiry_submit"
  | "service_inquiry_error"
  | "demo_view"
  | "demo_hero_cta_click"
  | "demo_sticky_cta_click"
  | "demo_schedule_filter"
  | "demo_class_select"
  | "demo_pricing_toggle"
  | "demo_faq_toggle"
  | "trial_form_start"
  | "trial_form_submit"
  | "trial_form_error"
  | "demo_inspector_toggle"
>

export interface GrowthWebEventRecord {
  id: string
  event: GrowthWebEventName
  params: Record<string, string>
  timestamp: string
}

declare global {
  interface Window {
    __ckGrowthWebEvents?: GrowthWebEventRecord[]
  }
}

export const GROWTH_WEB_TELEMETRY_EVENT = "ck:growth-web-ga4-event"
const MAX_HISTORY = 40
const EMPTY_EVENTS: GrowthWebEventRecord[] = []

/**
 * Emits a strictly allowlisted, PII-free GA4 event through Cyber Knock's unified
 * analytics pipeline (lib/analytics.ts) AND records the sanitized payload in memory
 * for the interactive Demo GA4 Inspector drawer.
 */
export function trackGrowthWebEvent(
  event: GrowthWebEventName,
  rawParams: Record<string, string | number | boolean> = {}
): GrowthWebEventRecord {
  // Convert primitive values to strings before passing through lib/analytics strict allowlist
  const normalized: Record<string, string> = {}
  for (const [key, value] of Object.entries(rawParams)) {
    normalized[key] = String(value)
  }

  const safeParams = safeAnalyticsParams(normalized)
  const record: GrowthWebEventRecord = {
    id: `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`,
    event,
    params: safeParams,
    timestamp: new Date().toISOString(),
  }

  // Delegate GA4 dispatch to the existing canonical allowlisted tracker (zero raw URLs, zero PII)
  trackEvent(event, safeParams)

  if (typeof window !== "undefined") {
    const existing = window.__ckGrowthWebEvents || EMPTY_EVENTS
    window.__ckGrowthWebEvents = [record, ...existing].slice(0, MAX_HISTORY)
    window.dispatchEvent(
      new CustomEvent<GrowthWebEventRecord>(GROWTH_WEB_TELEMETRY_EVENT, {
        detail: record,
      })
    )
  }

  return record
}

export function getRecentGrowthWebEvents(): GrowthWebEventRecord[] {
  if (typeof window === "undefined") return EMPTY_EVENTS
  return window.__ckGrowthWebEvents || EMPTY_EVENTS
}

export function getServerGrowthWebEventsSnapshot(): GrowthWebEventRecord[] {
  return EMPTY_EVENTS
}

export function subscribeGrowthWebEvents(onStoreChange: () => void): () => void {
  if (typeof window === "undefined") return () => {}
  window.addEventListener(GROWTH_WEB_TELEMETRY_EVENT, onStoreChange)
  return () => {
    window.removeEventListener(GROWTH_WEB_TELEMETRY_EVENT, onStoreChange)
  }
}
