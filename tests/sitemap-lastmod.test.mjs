import test from "node:test"
import assert from "node:assert/strict"
import { readFileSync } from "node:fs"

const read = (path) => readFileSync(new URL("../" + path, import.meta.url), "utf8")

test("sitemap lastmod tracks page changes rather than deployment time", () => {
  const src = read("app/sitemap.ts").replace(/\r\n/g, "\n")
  // A build-time new Date() claims a content change on every deployment.
  assert.doesNotMatch(src, /lastModified:\s*new Date\(\s*\)/)

  const block = src.match(/const lastSignificantUpdate\s*=\s*\{([\s\S]*?)\}\s*as const/)
  assert.ok(block, "explicit editorial update dates should be maintained")
  const dates = Object.fromEntries(
    [...block[1].matchAll(/(\w+):\s*"(\d{4}-\d{2}-\d{2})"/g)].map((m) => [m[1], m[2]])
  )
  assert.deepEqual(dates, {
    home: "2026-11-23",
    sportsDx: "2026-11-12",
    aiDevelopment: "2026-11-28",
    aiQualityEvaluation: "2026-11-28",
    growthWeb: "2026-11-23",
    caseStudy: "2026-11-28",
    security: "2026-11-12",
    privacy: "2026-11-23",
  })
  const expectedPaths = {
    home: "baseUrl",
    sportsDx: "`${baseUrl}/sports-dx`",
    aiDevelopment: "`${baseUrl}/ai-development`",
    aiQualityEvaluation: "`${baseUrl}/ai-development/ai-quality-evaluation`",
    growthWeb: "`${baseUrl}/services/growth-web`",
    caseStudy: "`${baseUrl}/cases/ai-sports-trainer`",
    security: "`${baseUrl}/security`",
    privacy: "`${baseUrl}/privacy-policy`",
  }
  for (const [key, urlExpression] of Object.entries(expectedPaths)) {
    assert.ok(src.includes(`url: ${urlExpression},\n      lastModified: new Date(lastSignificantUpdate.${key}),`), key)
    assert.ok(Number.isFinite(Date.parse(dates[key])), key)
  }
  assert.doesNotMatch(src, /growthWebDemo|\/services\/growth-web\/demo/)
  assert.match(src, /\.\.\.insights\.map/)
  const guideDates = src.match(/const insightLastSignificantUpdate[^=]*=\s*\{([\s\S]*?)\}/)
  assert.ok(guideDates)
  const guideMap = Object.fromEntries([...guideDates[1].matchAll(/"([a-z-]+)": "(\d{4}-\d{2}-\d{2})"/g)].map(m => [m[1], m[2]]))
  assert.deepEqual(guideMap, Object.fromEntries([
    "ai-development-outsourcing-guide", "ai-poc-process-evaluation",
    "ai-video-analysis-poc-cost", "ai-video-analysis-development-request",
  ].map(slug => [slug, "2026-11-28"])))
  assert.match(src, /lastModified: insightLastSignificantUpdate\[slug\]/)
})

test("sitemap remains canonical and is referenced by robots", () => {
  const src = read("app/sitemap.ts")
  assert.match(src, /const baseUrl = "https:\/\/cyberknock\.jp"/)
  assert.match(read("app/robots.ts"), /https:\/\/cyberknock\.jp\/sitemap\.xml/)
})
