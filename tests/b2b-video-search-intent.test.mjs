import test from "node:test"
import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import { insights } from "../lib/b2b-insights.ts"
import { pageCategory, safeAnalyticsParams } from "../lib/analytics.ts"

const read = (path) => readFileSync(new URL("../" + path, import.meta.url), "utf8")
const slug = "ai-video-analysis-development-request"

test("video analysis procurement guide targets commissioning intent, not cost-guide intent", () => {
  const guide = insights.find((article) => article.slug === slug)
  const cost = insights.find((article) => article.slug === "ai-video-analysis-poc-cost")
  assert.ok(guide && cost)
  assert.match(guide.title, /^AI動画解析システム開発の依頼ガイド/)
  assert.match(guide.description, /受託開発.*企業向け/)
  assert.match(guide.lead, /動画解析システムの開発を外注/)
  assert.match(cost.title, /開発費用とPoC/)
  assert.notEqual(guide.title, cost.title)
  assert.ok(guide.sections.some((part) => part.heading.includes("精度評価")))
  assert.ok(guide.sections.some((part) => part.heading.includes("PoC")))
  assert.ok(guide.sections.some((part) => part.table?.rows.some((row) => row.some((cell) => cell.includes("人物追跡")))))
  assert.ok(guide.sections.some((part) => part.bullets?.some((text) => text.startsWith("品質："))))
  assert.ok(guide.relatedResources.some((resource) => resource.href === "/ai-development"))
  assert.ok(guide.relatedResources.some((resource) => resource.href === "/demos/ai-sports-trainer"))
  assert.ok(guide.relatedResources.some((resource) => resource.href === "/cases/ai-sports-trainer"))
  assert.ok(![guide.title, guide.description, guide.lead].join(" ").includes("100〜1,000"), "do not invent search demand")
})

test("guide appears in site navigation, service context, sitemap and static article metadata", () => {
  const entrypoints = read("components/insights-entrypoints.tsx")
  const index = read("app/insights/page.tsx")
  const articlePage = read("app/insights/[slug]/page.tsx")
  const lp = read("app/ai-development/page.tsx")
  const sitemap = read("app/sitemap.ts")
  assert.match(entrypoints, /insights\.map/)
  assert.ok(index.includes("発注前に確認したい4つの論点。"))
  assert.ok(lp.includes('href="/insights/' + slug + '"'))
  assert.ok(lp.includes('data-guide="' + slug + '"'))
  assert.ok(sitemap.includes("...insights.map"))
  assert.ok(sitemap.includes('"' + slug + '": "2026-11-26"'))
  assert.ok(articlePage.includes("generateStaticParams"))
  assert.ok(articlePage.includes("alternates: { canonical: url }"))
  assert.ok(articlePage.includes('inLanguage: "ja-JP"'))
  assert.ok(articlePage.includes("href={consultation.href}"))
  assert.ok(articlePage.includes("data-guide={consultation.guide}"))
})

test("new article analytics use fixed canonical URL, without leaking arbitrary URLs", () => {
  assert.equal(pageCategory("/insights/" + slug + "?email=personal@example.com"), "insight_video_request")
  assert.deepEqual(safeAnalyticsParams({ guide: slug, location: "content", email: "personal@example.com" }), {
    guide: slug,
    location: "content",
  })
  assert.equal(pageCategory("/insights/unknown-private-slug"), "other")
})
