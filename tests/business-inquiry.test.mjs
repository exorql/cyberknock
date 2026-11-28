import test from "node:test"
import assert from "node:assert/strict"
import { readFile } from "node:fs/promises"
import { businessServices, businessContactHref } from "../lib/business-services.ts"
import { pageCategory, trackEvent } from "../lib/analytics.ts"

const code = await readFile(new URL("../functions/contact.js", import.meta.url), "utf8")
const { validateContact, buildSlackPayload } = await import("data:text/javascript;base64," + Buffer.from(code).toString("base64"))
const input = { name: "QA", email: "qa@example.test", message: "test message", privacy: true }

test("service links, notifications and analytics use the same fixed identifiers", () => {
  for (const [id, service] of Object.entries(businessServices)) {
    const url = new URL(businessContactHref(id), "https://cyberknock.jp")
    assert.equal(url.searchParams.get("service"), id)
    assert.equal(url.hash, "#contact")
    const source = pageCategory(url.pathname)
    assert.equal(source, service.source)
    const { data } = validateContact({ ...input, service: id, source, guide: "ai-poc-process-evaluation" })
    assert.equal(data.guide, undefined)
    const notice = buildSlackPayload(data).blocks[0].text.text
    assert.ok(notice.includes("相談テーマ: " + service.name))
    assert.ok(notice.includes("(" + source + ")"))
    const calls = []
    url.searchParams.set("email", input.email)
    global.window = { location: url, gtag: (...args) => calls.push(args) }
    try {
      for (const event of ["page_view", "cta_click", "contact_form_start", "contact_form_submit", "contact_form_success", "contact_form_error"]) {
        trackEvent(event, { ...input, source, service: id, budget: "100_300", url: url.href })
        const params = calls.at(-1)[2]
        assert.deepEqual(params, { page: source, source, service: id, page_location: url.origin + url.pathname, page_referrer: "" })
      }
    } finally { delete global.window }
  }
})

test("all legacy themes remain accepted and an unknown theme is rejected", () => {
  for (const service of ["", "sports-ai", "product", "ai-improvement", "advisory", "sports-dx", "other"]) {
    assert.equal(validateContact({ ...input, service }).data.service, service)
  }
  assert.ok(validateContact({ ...input, service: "unknown" }).errors.service)
})
