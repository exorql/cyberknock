import test from "node:test"
import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import { insights } from "../lib/b2b-insights.ts"
import { safeAnalyticsParams, trackEvent } from "../lib/analytics.ts"

const read = (name) => readFileSync(new URL("../" + name, import.meta.url), "utf8")

test("homepage places compact insight links after services without replacing the inquiry CTA", () => {
  const source = read("app/page.tsx")
  const index = source.indexOf('<InsightsEntryPoints placement="home" />')
  assert.ok(index > source.indexOf('id="services"'))
  assert.ok(index < source.indexOf('id="process"'))
  assert.match(source, /href="#contact" className="button button-primary"/)
  assert.match(read("components/site-footer.tsx"), /href="\/insights"/)
})

test("general development LP shows buyer guidance after the FAQ and before the form", () => {
  const source = read("app/ai-development/page.tsx")
  const index = source.indexOf('<InsightsEntryPoints placement="development" />')
  assert.ok(index > source.indexOf('aria-labelledby="faq-title"'))
  assert.ok(index < source.indexOf('id="contact"'))
  assert.match(source, /<ContactForm source="ai_development"/)
})

test("article links are sourced from the three public, non-client-specific insight URLs", () => {
  const source = read("components/insights-entrypoints.tsx")
  assert.equal(insights.length, 3)
  assert.equal(new Set(insights.map((article) => article.slug)).size, 3)
  assert.match(source, /insights\.map/)
  assert.match(source, /href=\{\x60\/insights\/\$\{article\.slug\}\x60\}/)
  assert.match(source, /data-track="insight_click"/)
  assert.match(source, /data-guide=\{article\.slug\}/)
  assert.match(source, /href="\/insights"/)
  for (const article of insights) {
    assert.ok(!/soccer-player-tracking|kyudo-motion-analysis/.test(article.slug))
  }
})

test("article click is independently measured with allowlisted guide and no URL/PII", () => {
  const allowed = safeAnalyticsParams({
    guide: "ai-poc-process-evaluation",
    location: "content",
    email: "private@example.com",
    href: "https://example.com/?email=private@example.com",
  })
  assert.deepEqual(allowed, { location: "content", guide: "ai-poc-process-evaluation" })
  assert.deepEqual(safeAnalyticsParams({ guide: "private-user-name" }), {})
  const calls = []
  global.window = {
    location: new URL("https://harutowatanabe.com/ai-development?email=private@example.com"),
    gtag: (...args) => calls.push(args),
  }
  try {
    trackEvent("insight_click", { guide: "ai-development-outsourcing-guide", location: "content", email: "private@example.com" })
    assert.equal(calls.length, 1)
    assert.equal(calls[0][1], "insight_click")
    assert.equal(calls[0][2].page, "ai_development")
    assert.equal(calls[0][2].guide, "ai-development-outsourcing-guide")
    assert.equal(calls[0][2].location, "content")
    assert.equal(calls[0][2].page_location, "https://harutowatanabe.com/ai-development")
    assert.equal(calls[0][2].page_referrer, "")
    assert.ok(!JSON.stringify(calls).includes("private@example.com"))
  } finally {
    delete global.window
  }
})
