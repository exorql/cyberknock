import test from "node:test"
import assert from "node:assert/strict"
import { readFile } from "node:fs/promises"
import { insights } from "../lib/b2b-insights.ts"
import { guideConsultations, consultationForGuide, guideFromContactSearch, guideContactHref, inquiryMessageHint } from "../lib/b2b-inquiry.ts"
import { safeAnalyticsParams, trackEvent } from "../lib/analytics.ts"

const functionSource = await readFile(new URL("../functions/contact.js", import.meta.url), "utf8")
const { handleContact, validateContact, buildSlackPayload } = await import("data:text/javascript;base64," + Buffer.from(functionSource).toString("base64"))
const base = { name: "QA", email: "synthetic@example.test", company: "QA", message: "synthetic only", budget: "", service: "sports-ai", source: "ai_development", privacy: true, website: "" }

test("each canonical guide has distinct appropriate inquiry context and safe fixed href", () => {
  assert.deepEqual(Object.keys(guideConsultations).sort(), insights.map(x => x.slug).sort())
  const ctas = new Set()
  for (const article of insights) {
    const entry = consultationForGuide(article.slug)
    const url = new URL(entry.href, "https://cyberknock.jp")
    assert.equal(url.pathname, "/ai-development")
    assert.equal(url.hash, "#contact")
    assert.equal(url.searchParams.get("guide"), article.slug)
    assert.equal(url.searchParams.get("service"), entry.service)
    assert.equal(guideFromContactSearch(url.search, "ai_development"), article.slug)
    assert.equal(guideFromContactSearch(url.search, "home"), undefined)
    assert.equal(safeAnalyticsParams({ guide: article.slug }).guide, article.slug)
    ctas.add(entry.cta)
  }
  assert.equal(ctas.size, 4)
  assert.equal(consultationForGuide("private@example.test").href, "/ai-development#contact")
  assert.equal(consultationForGuide("__proto__").guide, undefined)
  assert.equal(new URL(guideContactHref("ai-poc-process-evaluation", "ai-improvement"), "https://cyberknock.jp").searchParams.get("service"), "ai-improvement")
})

test("unknown, repeated, long and cross-page contexts are not accepted", () => {
  const known = "ai-video-analysis-poc-cost"
  for (const raw of ["?guide=private@example.test", "?guide=__proto__", "?guide=constructor", "?guide=" + known + "&guide=" + known, "?guide=" + "a".repeat(600), ""]) {
    assert.equal(guideFromContactSearch(raw, "ai_development"), undefined)
  }
  assert.equal(guideFromContactSearch("?guide=" + known + "&email=private@example.test", "ai_development"), known)
  for (const guide of ["private@example.test", "constructor", "__proto__", ["ai-poc-process-evaluation"], {}, null, undefined]) {
    const data = validateContact({ ...base, guide }).data
    assert.equal(data.guide, undefined)
    assert.doesNotMatch(buildSlackPayload(data).blocks[0].text.text, /相談リンクのガイド:/)
  }
  assert.equal(validateContact({ ...base, source: "home", guide: known }).data.guide, undefined)
  assert.equal(validateContact({ ...base, source: "private-source", guide: known }).data.guide, undefined)
})

test("existing contact endpoint delivers a safe guide only with eligible source, preserving legacy requests", async () => {
  for (const article of insights) {
    const guide = article.slug
    const payloads = []
    const request = new Request("https://cyberknock.jp/contact", { method: "POST", headers: { "content-type": "application/json", origin: "https://cyberknock.jp" }, body: JSON.stringify({ ...base, guide }) })
    const response = await handleContact(request, { SLACK_WEBHOOK_URL: "https://example.test/mock-only" }, async (_url, init) => {
      payloads.push(JSON.parse(init.body))
      return new Response("ok")
    })
    assert.equal(response.status, 200)
    assert.equal(payloads.length, 1)
    const first = payloads[0].blocks[0].text
    assert.equal(first.type, "plain_text")
    assert.ok(first.text.includes("相談リンクのガイド: " + guideConsultations[guide].label + " (" + guide + ")"))
  }
  assert.equal(validateContact(base).data.guide, undefined)
})

test("the fixed guide does not cause query strings or contact fields to enter analytics", () => {
  const calls = []
  const guide = "ai-video-analysis-poc-cost"
  global.window = { location: new URL("https://cyberknock.jp/ai-development?guide=" + guide + "&email=private@example.test"), gtag: (...args) => calls.push(args) }
  try {
    for (const name of ["contact_form_start", "contact_form_submit", "contact_form_success", "contact_form_error", "contact_form_abandon"]) {
      trackEvent(name, { source: "ai_development", service: "sports-ai", guide, email: "private@example.test", message: "secret text" })
    }
    assert.equal(calls.length, 5)
    for (const call of calls) {
      assert.equal(call[2].guide, guide)
      assert.equal(call[2].page_location, "https://cyberknock.jp/ai-development")
    }
    assert.doesNotMatch(JSON.stringify(calls), /private@example.test|secret text|\?guide=/)
  } finally { delete global.window }
})

test("inquiry hints are optional and specific to an AI development theme", () => {
  assert.match(inquiryMessageHint("ai_development", "sports-ai"), /撮影条件/)
  assert.match(inquiryMessageHint("ai_development", "ai-improvement"), /原価/)
  assert.match(inquiryMessageHint("ai_development", "advisory"), /検証/)
  assert.match(inquiryMessageHint("ai_development", "product"), /最初に必要な機能/)
  assert.doesNotMatch(inquiryMessageHint("home", "sports-ai"), /撮影条件/)
})
