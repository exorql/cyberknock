import test from "node:test"
import assert from "node:assert/strict"
import { readFileSync, existsSync } from "node:fs"
import { pageCategory, analyticsEvents, safeAnalyticsParams, trackEvent } from "../lib/analytics.ts"

const read = (p) => readFileSync(p, "utf8")

test("自社アプリの実画面だけを使い、動画解析を実行するふりをしない", () => {
  const source = read("app/demos/ai-sports-trainer/demo-stages.tsx")
  const images = [
    "public/images/cases/01-analysis.jpg",
    "public/images/product/pitching-feedback.webp",
    "public/images/cases/03-training.png",
  ]
  for (const image of images) assert.ok(existsSync(image), "missing: " + image)
  assert.equal((source.match(/image: "\/images\//g) || []).length, 3)
  assert.ok(source.includes('role="tablist"'))
  assert.ok(source.includes("aria-selected={active === index}"))
  assert.ok(source.includes('event.key === "ArrowRight"'))
  assert.ok(source.includes('event.key === "ArrowLeft"'))
  assert.ok(source.includes("実画面"))
  assert.ok(!source.includes("<video"))
  assert.ok(!source.includes("/api/analy"))
})

test("発注者向けのLP・開発事例・動画解析記事から実画面デモへ到達できる", () => {
  assert.ok(read("app/ai-development/page.tsx").includes('href="/demos/ai-sports-trainer" data-track="demo_click"'))
  assert.ok(read("app/cases/ai-sports-trainer/content.tsx").includes('href="/demos/ai-sports-trainer"'))
  assert.ok(read("lib/b2b-insights.ts").includes('href:"/demos/ai-sports-trainer"'))
  assert.ok(read("app/sitemap.ts").includes("/demos/ai-sports-trainer"))
  assert.ok(read("app/demos/ai-sports-trainer/page.tsx").includes("alternates: { canonical: pathname }"))
  assert.ok(read("app/demos/ai-sports-trainer/page.tsx").includes("/templates/ai-video-poc-request-template.txt"))
})

test("デモクリックの計測ではURL・氏名・メールを送らない", () => {
  assert.equal(pageCategory("/demos/ai-sports-trainer?email=test@example.com"), "ai_demo")
  assert.ok(analyticsEvents.includes("demo_click"))
  assert.deepEqual(safeAnalyticsParams({ location: "ai_development", email: "test@example.com" }), { location: "ai_development" })
  const calls = []
  global.window = {
    location: new URL("https://preview.example/demos/ai-sports-trainer?email=test@example.com"),
    gtag: (...args) => calls.push(args),
  }
  try {
    trackEvent("demo_click", { location: "content", name: "test@example.com" })
    assert.equal(calls.length, 1)
    assert.deepEqual(calls[0], ["event", "demo_click", {
      location: "content",
      page: "ai_demo",
      page_location: "https://cyberknock.jp/demos/ai-sports-trainer",
      page_referrer: "",
    }])
    assert.ok(!JSON.stringify(calls).includes("test@example.com"))
  } finally { delete global.window }
})
