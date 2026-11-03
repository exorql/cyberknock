import test from "node:test"
import assert from "node:assert/strict"
import { insights, findInsight } from "../lib/b2b-insights.ts"
import { pageCategory, trackEvent } from "../lib/analytics.ts"

test("B2B insight pages have unique, substantive, decision-focused content", () => {
  assert.equal(insights.length, 3)
  assert.deepEqual(insights.map(article => article.slug), [
    "ai-development-outsourcing-guide",
    "ai-poc-process-evaluation",
    "ai-video-analysis-poc-cost",
  ])
  assert.equal(new Set(insights.map(item => item.slug)).size, 3)
  for (const article of insights) {
    assert.ok(article.title.length >= 12 && article.title.length <= 60)
    assert.ok(article.description.length >= 50 && article.description.length <= 160)
    assert.ok(article.sections.length >= 4)
    assert.ok(article.faqs.length >= 3)
    assert.ok(article.summary.length >= 3)
    assert.ok(article.relatedResources.length >= 2)
    assert.ok(article.sections.every(section => section.paragraphs.length > 0))
    const characters = [article.lead, ...article.sections.flatMap(x => x.paragraphs), ...article.sections.flatMap(x => x.bullets ?? []), ...article.sections.flatMap(x => x.table ? x.table.rows.flat() : []), ...article.faqs.map(x => x.answer)].join("").length
    assert.ok(characters >= 1250, article.slug + " has too little evidence-driven guidance: " + characters)
    assert.ok(article.relatedResources.some(x => x.href === '/cases/ai-sports-trainer'))
    assert.ok(article.relatedResources.some(x => x.href === '/ai-development'))
    assert.ok(article.relatedResources.every(x => !x.href.includes('/soccer-player-tracking') && !x.href.includes('/kyudo-motion-analysis')))
    assert.equal(findInsight(article.slug), article)
  }
  assert.equal(findInsight("nonexistent"), undefined)
})

test("new article pages are tracked by fixed GA4-safe URL mapping", () => {
  const cases = [
    ["/insights", "insights", "https://cyberknock.pages.dev/insights"],
    ["/insights/ai-video-analysis-poc-cost", "insight_cost", "https://cyberknock.pages.dev/insights/ai-video-analysis-poc-cost"],
    ["/insights/ai-poc-process-evaluation", "insight_poc", "https://cyberknock.pages.dev/insights/ai-poc-process-evaluation"],
    ["/insights/ai-development-outsourcing-guide", "insight_outsourcing", "https://cyberknock.pages.dev/insights/ai-development-outsourcing-guide"],
  ]
  for (const [path, category, canonical] of cases) {
    assert.equal(pageCategory(path + "?name=private&email=qa@example.com"), category)
    const calls = []
    global.window = { location: new URL("https://cyberknock.pages.dev" + path + "?name=private&email=qa@example.com"), gtag: (...args) => calls.push(args) }
    try {
      trackEvent("page_view")
      assert.equal(calls.length, 1)
      assert.equal(calls[0][2].page, category)
      assert.equal(calls[0][2].page_location, canonical)
      assert.equal(calls[0][2].page_referrer, "")
      assert.ok(!JSON.stringify(calls).includes("qa@example.com"))
    } finally { delete global.window }
  }
})
