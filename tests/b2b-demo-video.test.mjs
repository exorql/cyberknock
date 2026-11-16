import test from "node:test"
import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import { analyticsEvents, b2bDemoVideo, markDemoVideoStarted, trackEvent } from "../lib/analytics.ts"
import { dueDemoMilestones } from "../lib/demo-video-progress.ts"

const videoParams = { video_id: b2bDemoVideo.id, video_duration: "25", placement: b2bDemoVideo.placement }

function capture(url) {
  const calls = []
  global.window = { location: new URL(url), gtag: (...args) => calls.push(args) }
  return calls
}

test("B2B demo events are allowlisted and carry only the four identifying parameters", () => {
  for (const name of ["b2b_demo_video_start", "b2b_demo_video_50", "b2b_demo_video_complete", "b2b_demo_contact_click"]) {
    assert.ok(analyticsEvents.includes(name), name)
  }
  const calls = capture("https://preview.example/ai-development?email=qa@example.com#private")
  try {
    trackEvent("b2b_demo_video_start", { ...videoParams, email: "qa@example.com", page_path: "/ai-development?email=qa@example.com" })
    assert.deepEqual(calls[0], ["event", "b2b_demo_video_start", {
      page: "ai_development",
      video_id: "cyberknock_b2b_ai_demo_25s",
      video_duration: "25",
      placement: "ai_development_proof",
      page_path: "/ai-development",
      page_location: "https://cyberknock.jp/ai-development",
      page_referrer: "",
    }])
    trackEvent("b2b_demo_video_50", { video_id: "other_video", video_duration: "99", placement: "hero" })
    assert.deepEqual(Object.keys(calls[1][2]).sort(), ["page", "page_location", "page_path", "page_referrer"])
    assert.ok(!JSON.stringify(calls).includes("qa@example.com"))
  } finally { delete global.window }
})

test("contact click near the demo is one event with location, and video parameters never leak into other events", () => {
  const calls = capture("https://cyberknock.jp/ai-development")
  try {
    trackEvent("b2b_demo_contact_click", { location: "demo_video", ...videoParams })
    assert.equal(calls[0][2].location, "demo_video")
    assert.equal(calls[0][2].video_id, b2bDemoVideo.id)
    trackEvent("cta_click", { location: "hero", ...videoParams })
    assert.deepEqual(calls[1], ["event", "cta_click", { location: "hero", page: "ai_development", page_location: "https://cyberknock.jp/ai-development", page_referrer: "" }])
  } finally { delete global.window }
})

test("the LP never reports both cta_click and b2b_demo_contact_click for the same demo CTA", () => {
  const player = readFileSync("components/development/demo-video-player.tsx", "utf8")
  const demo = readFileSync("components/development/demo-video.tsx", "utf8")
  const footerCta = player.slice(player.indexOf("One click = one event"))
  assert.ok(footerCta.includes('"data-track": "b2b_demo_contact_click"'))
  assert.equal((demo.match(/data-track=/g) || []).length, 1)
  assert.ok(demo.includes('data-track="b2b_demo_contact_click"'))
  const site = readFileSync("components/site-analytics.tsx", "utf8")
  assert.ok(site.includes("target.dataset.videoId") && site.includes("target.dataset.placement"))
})

test("milestones fire once each, in funnel order, and never before a real play", () => {
  const base = { duration: 25, fallbackDuration: 25 }
  const sent = new Set()
  const step = (event, currentTime) => { const due = dueDemoMilestones(sent, { ...base, event, currentTime }); due.forEach((m) => sent.add(m)); return due }
  assert.deepEqual(dueDemoMilestones(new Set(), { ...base, event: "progress", currentTime: 20 }), [], "scrubbing a paused video is not a view")
  assert.deepEqual(step("play", 0), ["start"])
  assert.deepEqual(step("progress", 12.4), [])
  assert.deepEqual(step("progress", 12.5), ["50"])
  assert.deepEqual(step("progress", 13), [])
  assert.deepEqual(step("progress", 22.5), ["complete"])
  assert.deepEqual(step("ended", 25), [])
  assert.deepEqual(step("play", 0), [], "replay does not resend")
  const jumped = new Set(["start"])
  assert.deepEqual(dueDemoMilestones(jumped, { ...base, event: "ended", currentTime: 25 }), ["50", "complete"])
  assert.deepEqual(dueDemoMilestones(new Set(["start"]), { event: "progress", currentTime: 13, duration: NaN, fallbackDuration: 25 }), ["50"], "unknown duration falls back to 25s")
})

test("development traffic and local previews never bootstrap the production GA4 property", () => {
  const site = readFileSync("components/site-analytics.tsx", "utf8")
  assert.ok(site.includes('process.env.NODE_ENV !== "production"'))
  assert.ok(site.includes('hostname === "localhost"') && site.includes('hostname === "127.0.0.1"'))
})

test("contact events are segmented by demo engagement without a second conversion", () => {
  const calls = capture("https://cyberknock.jp/ai-development")
  try {
    trackEvent("contact_form_success", { source: "ai_development", service: "sports-ai", demo_video: "started" })
    assert.ok(!("demo_video" in calls[0][2]), "callers cannot assert engagement")
    markDemoVideoStarted()
    trackEvent("contact_form_success", { source: "ai_development", service: "sports-ai" })
    trackEvent("contact_form_error", { source: "ai_development", error_type: "network" })
    trackEvent("cta_click", { location: "hero" })
    assert.equal(calls[1][1], "contact_form_success")
    assert.equal(calls[1][2].demo_video, "started")
    assert.ok(!("demo_video" in calls[2][2]))
    assert.ok(!("demo_video" in calls[3][2]))
    assert.equal(calls.filter(([, name]) => name === "contact_form_success").length, 2, "one event per submission")
  } finally { delete global.window }
})
