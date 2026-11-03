import test from "node:test"
import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import { insights } from "../lib/b2b-insights.ts"

test("high-demand AI development company and contract terms appear naturally in the buyer guide", () => {
  const article = insights.find(x => x.slug === "ai-development-outsourcing-guide")
  assert.ok(article)
  assert.match(article.title, /AI開発会社の選び方/)
  assert.match(article.title, /AI開発会社の選び方と費用/)
  assert.match(article.description, /外注/)
  assert.match(article.description, /AI開発.*受託.*外注/)
  assert.match(article.lead, /開発会社/)
})

test("AI PoC retains its 100-1000 volume main query and includes PoC development", () => {
  const article = insights.find(x => x.slug === "ai-poc-process-evaluation")
  assert.ok(article)
  assert.match(article.title, /^AI PoC/)
  assert.match(article.description, /PoC開発/)
  assert.ok(article.sections.some(s => s.heading.includes("PoC")))
})

test("video analysis cost guide retains its specialist intent without misleading SEO claims", () => {
  const article = insights.find(x => x.slug === "ai-video-analysis-poc-cost")
  assert.ok(article)
  assert.match(article.title, /^AI動画解析/)
  assert.match(article.description, /開発|費用/)
  assert.equal(insights.length, 3)
  assert.equal(new Set(insights.map(x => x.slug)).size, 3)
})

test("native source is described as Japan all-languages search bands, not exact values", () => {
  const doc = readFileSync(new URL("../docs/growth/b2b-insights-20261103/keyword-demand-review.md", import.meta.url), "utf8")
  assert.match(doc, /すべての言語/)
  assert.match(doc, /2025年10月1日〜2026年9月30日/)
  assert.match(doc, /月間100〜1,000回/)
  assert.match(doc, /厳密な検索数ではない/)
  assert.match(doc, /0の意味ではない/)
})
