import test from "node:test"
import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import { calculateRoiSimulation, DEFAULT_ROI_INPUT } from "../lib/growth-web/roi.ts"
import {
  validateServiceInquiryClient,
  validateTrialBookingClient,
} from "../lib/growth-web/form-options.ts"
import {
  buildGrowthWebDemoJsonLd,
  buildGrowthWebLpJsonLd,
  serializeJsonLd,
} from "../lib/growth-web/structured-data.ts"
import { GROWTH_WEB_ROUTES, LP_FAQS } from "../lib/growth-web/service-lp.ts"
import { DEMO_CLASSES, DEMO_FAQS } from "../lib/growth-web/demo-school.ts"
import {
  pageCategory,
  safeAnalyticsParams,
  trackEvent,
} from "../lib/analytics.ts"
import {
  handleGrowthWebInquiry,
  isPrivateOrUnsafeHost,
  onRequest as inquiryOnRequest,
  resetGrowthWebInquiryStores,
} from "../functions/api/growth-web/inquiries.js"
import {
  handleGrowthWebDemoTrial,
  onRequest as demoOnRequest,
  resetGrowthWebDemoStores,
} from "../functions/api/growth-web/demo-trial.js"

const read = (p) => readFileSync(new URL("../" + p, import.meta.url), "utf8")

function makeValidInquiryPayload(overrides = {}) {
  return {
    organizationName: "あおばキッズサッカー教室",
    contactName: "山田 太郎",
    email: "yamada@example.jp",
    phone: "090-1234-5678",
    sportCategory: "soccer",
    currentWebsiteUrl: "https://example.jp",
    inquiryType: "free_site_audit",
    monthlyStudentsBand: "30_to_80",
    message: "体験申込を増やしたいです。",
    privacyAccepted: true,
    websiteHp: "",
    ...overrides,
  }
}

function makeValidDemoPayload(overrides = {}) {
  return {
    guardianName: "鈴木 花子",
    email: "demo-parent@example.jp",
    phone: "090-0000-0000",
    childGrade: "grade_1_2",
    selectedClassId: "u9-soccer-wed",
    preferredTiming: "next_week",
    experienceLevel: "beginner",
    notes: "人見知りですが運動が好きです。",
    demoAcknowledged: true,
    websiteHp: "",
    ...overrides,
  }
}

function createJsonPost(url, payload, headers = {}) {
  return new Request(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Origin: new URL(url).origin,
      "cf-connecting-ip": "203.0.113.10",
      ...headers,
    },
    body: JSON.stringify(payload),
  })
}

test("ROI simulator computes gross-profit LTV, blended CAC, and detects unviable economics", () => {
  const baseline = calculateRoiSimulation(DEFAULT_ROI_INPUT)
  assert.equal(baseline.year1CumulativeServiceCostJpy, 49_800 + 29_800 * 12)
  assert.ok(baseline.studentGrossProfitLtvJpy < baseline.studentRevenueLtvJpy)
  assert.ok(baseline.year1BlendedCacJpy > 0)
  assert.ok(baseline.grossProfitLtvToCacRatio > 1)
  assert.equal(baseline.timeline.length, 12)

  const unviable = calculateRoiSimulation({
    monthlyTuitionJpy: 4_000,
    initialEnrollmentFeeJpy: 0,
    averageRetentionMonths: 6,
    grossMarginPercent: 25,
    trialToJoinRatePercent: 20,
    additionalTrialsPerMonth: 1,
    additionalMonthlyAcquisitionCostJpy: 50_000,
  })
  assert.equal(unviable.viabilityStatus, "unviable")
  assert.equal(unviable.grossProfitBreakEvenMonth, null)
})

test("Client validators enforce phone digits, http/https URL, and strip CR/LF", () => {
  const bad = validateServiceInquiryClient(
    makeValidInquiryPayload({
      phone: "---",
      currentWebsiteUrl: "javascript:alert(1)",
      privacyAccepted: false,
    })
  )
  assert.ok(bad.fieldErrors?.phone)
  assert.ok(bad.fieldErrors?.currentWebsiteUrl)
  assert.ok(bad.fieldErrors?.privacyAccepted)

  const clean = validateServiceInquiryClient(
    makeValidInquiryPayload({
      organizationName: "テスト\r\nスクール",
      email: "  USER@EXAMPLE.JP ",
    })
  )
  assert.equal(clean.data?.organizationName, "テスト スクール")
  assert.equal(clean.data?.email, "USER@example.jp")

  const badDemo = validateTrialBookingClient(
    makeValidDemoPayload({ phone: "() -", demoAcknowledged: false })
  )
  assert.ok(badDemo.fieldErrors?.phone)
  assert.ok(badDemo.fieldErrors?.demoAcknowledged)
})

test("Growth Web inquiry API delivers Slack plain_text payload, deduplicates replays, and coalesces concurrent requests", async () => {
  resetGrowthWebInquiryStores()
  const fetchCalls = []
  const mockFetch = async (url, init) => {
    fetchCalls.push({ url, init })
    await new Promise((r) => setTimeout(r, 15))
    return new Response("ok", { status: 200 })
  }
  const env = {
    SLACK_WEBHOOK_URL: "https://hooks.slack.com/services/T000/B000/XXXX",
    NOTIFICATION_WEBHOOK_SECRET: "test-hmac-secret",
  }

  const idem = "gw_idem_test_00001"
  const req1 = createJsonPost(
    "https://cyberknock.jp/api/growth-web/inquiries",
    makeValidInquiryPayload({ message: "<!channel> @here 相談です" }),
    { "Idempotency-Key": idem }
  )
  const req2 = createJsonPost(
    "https://cyberknock.jp/api/growth-web/inquiries",
    makeValidInquiryPayload({ message: "<!channel> @here 相談です" }),
    { "Idempotency-Key": idem }
  )

  const [res1, res2] = await Promise.all([
    handleGrowthWebInquiry(req1, env, mockFetch),
    handleGrowthWebInquiry(req2, env, mockFetch),
  ])

  assert.equal(res1.status, 200)
  assert.equal(res2.status, 200)
  assert.equal(fetchCalls.length, 1, "concurrent duplicate must invoke webhook exactly once")
  assert.equal(res1.headers.get("cache-control"), "no-store, max-age=0")

  const body1 = await res1.json()
  const body2 = await res2.json()
  assert.equal(body1.ok, true)
  assert.equal(body1.receipt.mode, "live")
  assert.equal(body1.receipt.externalDeliveryExecuted, true)
  assert.equal(body2.receipt.receiptId, body1.receipt.receiptId)
  assert.equal(body2.receipt.deduplicated, true)

  const sentPayload = JSON.parse(fetchCalls[0].init.body)
  assert.equal(sentPayload.blocks[0].text.type, "plain_text")
  assert.equal(sentPayload.blocks[1].text.type, "plain_text")
  assert.equal(fetchCalls[0].init.headers["X-Idempotency-Key"], idem)
  assert.match(fetchCalls[0].init.headers["X-CyberKnock-Signature"], /^sha256=[a-f0-9]{64}$/)

  // Sequential replay with same Idempotency-Key
  const req3 = createJsonPost(
    "https://cyberknock.jp/api/growth-web/inquiries",
    makeValidInquiryPayload({ message: "<!channel> @here 相談です" }),
    { "Idempotency-Key": idem }
  )
  const res3 = await handleGrowthWebInquiry(req3, env, mockFetch)
  const body3 = await res3.json()
  assert.equal(res3.status, 200)
  assert.equal(body3.receipt.deduplicated, true)
  assert.equal(fetchCalls.length, 1)
})

test("Growth Web inquiry API enforces security controls (Origin, Content-Type, 16KB cap, honeypot, rate limit, SSRF, fail-closed, 405)", async () => {
  resetGrowthWebInquiryStores()
  let fetchCount = 0
  const spyFetch = async () => {
    fetchCount += 1
    return new Response("ok", { status: 200 })
  }
  const env = { SLACK_WEBHOOK_URL: "https://hooks.slack.com/services/T000/B000/XXXX" }

  // Preview hosts must never invoke the production Slack webhook, even when
  // its secret is accidentally available in the preview environment.
  const previewRes = await handleGrowthWebInquiry(
    createJsonPost(
      "https://feat-growth-web-mvp-integrat.cyberknock.pages.dev/api/growth-web/inquiries",
      makeValidInquiryPayload(),
    ),
    env,
    spyFetch
  )
  assert.equal(previewRes.status, 503)
  assert.equal(fetchCount, 0)

  // Explicit QA dry-run is allowed on non-canonical local/preview hosts,
  // but it must never dispatch a notification.
  const dryRunRes = await handleGrowthWebInquiry(
    createJsonPost(
      "https://feat-growth-web-mvp-integrat.cyberknock.pages.dev/api/growth-web/inquiries",
      makeValidInquiryPayload(),
    ),
    { ...env, GROWTH_WEB_DRY_RUN: "1" },
    spyFetch
  )
  assert.equal(dryRunRes.status, 200)
  assert.equal((await dryRunRes.json()).receipt.externalDeliveryExecuted, false)
  assert.equal(fetchCount, 0)

  resetGrowthWebInquiryStores()

  // 405 GET
  const getRes = await inquiryOnRequest({
    request: new Request("https://cyberknock.jp/api/growth-web/inquiries", { method: "GET" }),
    env,
  })
  assert.equal(getRes.status, 405)
  assert.equal(getRes.headers.get("allow"), "POST")

  // 403 cross-origin
  const corsRes = await handleGrowthWebInquiry(
    createJsonPost("https://cyberknock.jp/api/growth-web/inquiries", makeValidInquiryPayload(), {
      Origin: "https://evil.example",
    }),
    env,
    spyFetch
  )
  assert.equal(corsRes.status, 403)

  // 415 wrong Content-Type
  const ctRes = await handleGrowthWebInquiry(
    new Request("https://cyberknock.jp/api/growth-web/inquiries", {
      method: "POST",
      headers: { "Content-Type": "text/plain", Origin: "https://cyberknock.jp" },
      body: "{}",
    }),
    env,
    spyFetch
  )
  assert.equal(ctRes.status, 415)

  // 413 oversized payload (>16KB)
  const bigRes = await handleGrowthWebInquiry(
    createJsonPost(
      "https://cyberknock.jp/api/growth-web/inquiries",
      makeValidInquiryPayload({ message: "a".repeat(20_000) })
    ),
    env,
    spyFetch
  )
  assert.equal(bigRes.status, 413)

  // 200 opaque honeypot (0 fetches, does not leak detection)
  const hpRes = await handleGrowthWebInquiry(
    createJsonPost(
      "https://cyberknock.jp/api/growth-web/inquiries",
      makeValidInquiryPayload({ websiteHp: "https://spam.invalid" })
    ),
    env,
    spyFetch
  )
  assert.equal(hpRes.status, 200)
  const hpText = await hpRes.text()
  assert.doesNotMatch(hpText, /honeypot|spam|bot/i)
  assert.equal(fetchCount, 0)

  // 400 validation errors
  const badRes = await handleGrowthWebInquiry(
    createJsonPost(
      "https://cyberknock.jp/api/growth-web/inquiries",
      makeValidInquiryPayload({ phone: "---", currentWebsiteUrl: "ftp://example.jp" })
    ),
    env,
    spyFetch
  )
  assert.equal(badRes.status, 400)
  const badJson = await badRes.json()
  assert.ok(badJson.fieldErrors.phone)
  assert.ok(badJson.fieldErrors.currentWebsiteUrl)

  // SSRF host guard + fail-closed 503 when webhook missing or unsafe
  assert.equal(isPrivateOrUnsafeHost("127.0.0.1"), true)
  assert.equal(isPrivateOrUnsafeHost("169.254.169.254"), true)
  assert.equal(isPrivateOrUnsafeHost("hooks.slack.com"), false)

  const unconfiguredRes = await handleGrowthWebInquiry(
    createJsonPost("https://cyberknock.jp/api/growth-web/inquiries", makeValidInquiryPayload(), {
      "cf-connecting-ip": "203.0.113.21",
    }),
    {},
    spyFetch
  )
  assert.equal(unconfiguredRes.status, 503)

  const ssrfRes = await handleGrowthWebInquiry(
    createJsonPost("https://cyberknock.jp/api/growth-web/inquiries", makeValidInquiryPayload(), {
      "cf-connecting-ip": "203.0.113.22",
    }),
    { GROWTH_WEB_WEBHOOK_URL: "https://127.0.0.1/hook" },
    spyFetch
  )
  assert.equal(ssrfRes.status, 503)

  // 502 upstream failure must not leak secret/PII or poison idempotency cache
  const failingFetch = async () => new Response("internal secret token_999", { status: 500 })
  const failRes = await handleGrowthWebInquiry(
    createJsonPost("https://cyberknock.jp/api/growth-web/inquiries", makeValidInquiryPayload(), {
      "cf-connecting-ip": "203.0.113.23",
      "Idempotency-Key": "gw_retry_after_502",
    }),
    env,
    failingFetch
  )
  assert.equal(failRes.status, 502)
  const failText = await failRes.text()
  assert.doesNotMatch(failText, /token_999|yamada@example\.jp/)

  const retryRes = await handleGrowthWebInquiry(
    createJsonPost("https://cyberknock.jp/api/growth-web/inquiries", makeValidInquiryPayload(), {
      "cf-connecting-ip": "203.0.113.23",
      "Idempotency-Key": "gw_retry_after_502",
    }),
    env,
    spyFetch
  )
  assert.equal(retryRes.status, 200)
  assert.equal(fetchCount, 1)

  // 429 rate limit (email limit: 5 per 10min, IP limit: 10 per 10min)
  resetGrowthWebInquiryStores()
  for (let i = 0; i < 5; i += 1) {
    const okRes = await handleGrowthWebInquiry(
      createJsonPost(
        "https://cyberknock.jp/api/growth-web/inquiries",
        makeValidInquiryPayload({ email: "same-rate@example.jp", message: `msg-${i}` }),
        { "cf-connecting-ip": `203.0.113.${50 + i}` }
      ),
      env,
      spyFetch
    )
    assert.equal(okRes.status, 200)
  }
  const emailLimitedRes = await handleGrowthWebInquiry(
    createJsonPost(
      "https://cyberknock.jp/api/growth-web/inquiries",
      makeValidInquiryPayload({ email: "same-rate@example.jp", message: "msg-6" }),
      { "cf-connecting-ip": "203.0.113.60" }
    ),
    env,
    spyFetch
  )
  assert.equal(emailLimitedRes.status, 429)
  assert.ok(Number(emailLimitedRes.headers.get("retry-after")) >= 1)

  resetGrowthWebInquiryStores()
  for (let i = 0; i < 10; i += 1) {
    const okRes = await handleGrowthWebInquiry(
      createJsonPost(
        "https://cyberknock.jp/api/growth-web/inquiries",
        makeValidInquiryPayload({ email: `iprate${i}@example.jp` }),
        { "cf-connecting-ip": "203.0.113.99" }
      ),
      env,
      spyFetch
    )
    assert.equal(okRes.status, 200)
  }
  const ipLimitedRes = await handleGrowthWebInquiry(
    createJsonPost(
      "https://cyberknock.jp/api/growth-web/inquiries",
      makeValidInquiryPayload({ email: "iprate10@example.jp" }),
      { "cf-connecting-ip": "203.0.113.99" }
    ),
    env,
    spyFetch
  )
  assert.equal(ipLimitedRes.status, 429)
  assert.ok(Number(ipLimitedRes.headers.get("retry-after")) >= 1)
})

test("Growth Web demo-trial API is strictly ephemeral, never calls fetch, and validates class/origin/rate-limit", async () => {
  resetGrowthWebDemoStores()

  const originalFetch = globalThis.fetch
  let externalFetchCalled = false
  globalThis.fetch = async () => {
    externalFetchCalled = true
    throw new Error("Demo endpoint must never perform outbound fetch")
  }

  try {
    // 405 non-POST
    const getRes = await demoOnRequest({
      request: new Request("https://cyberknock.jp/api/growth-web/demo-trial", { method: "GET" }),
      env: { SLACK_WEBHOOK_URL: "https://hooks.slack.com/services/SHOULD/NOT/RUN" },
    })
    assert.equal(getRes.status, 405)

    // 200 valid ephemeral response
    const okRes = await handleGrowthWebDemoTrial(
      createJsonPost("https://cyberknock.jp/api/growth-web/demo-trial", makeValidDemoPayload(), {
        "Idempotency-Key": "demo_idem_0001",
      })
    )
    assert.equal(okRes.status, 200)
    const okJson = await okRes.json()
    assert.equal(okJson.ok, true)
    assert.match(okJson.receipt.receiptId, /^DEMO-/)
    assert.equal(okJson.receipt.mode, "local_dry_run")
    assert.equal(okJson.receipt.externalDeliveryExecuted, false)
    assert.equal(okJson.receipt.persistedLocally, false)
    assert.equal(okJson.selectedClass.id, "u9-soccer-wed")
    assert.match(okJson.receipt.preview.emailSubject, /\[DEMO・外部未送信\]/)
    assert.equal(externalFetchCalled, false)

    // 400 unknown class
    const badClassRes = await handleGrowthWebDemoTrial(
      createJsonPost(
        "https://cyberknock.jp/api/growth-web/demo-trial",
        makeValidDemoPayload({ selectedClassId: "nonexistent-class" })
      )
    )
    assert.equal(badClassRes.status, 400)

    // 403 cross-origin
    const crossRes = await handleGrowthWebDemoTrial(
      createJsonPost("https://cyberknock.jp/api/growth-web/demo-trial", makeValidDemoPayload(), {
        Origin: "https://attacker.example",
      })
    )
    assert.equal(crossRes.status, 403)

    // 200 opaque honeypot
    const hpRes = await handleGrowthWebDemoTrial(
      createJsonPost(
        "https://cyberknock.jp/api/growth-web/demo-trial",
        makeValidDemoPayload({ websiteHp: "bot-value" })
      )
    )
    assert.equal(hpRes.status, 200)
    assert.doesNotMatch(await hpRes.text(), /honeypot|bot/i)
    assert.equal(externalFetchCalled, false)
  } finally {
    globalThis.fetch = originalFetch
  }
})

test("Unified GA4 analytics tracks Growth Web routes with strict allowlist and zero PII", () => {
  assert.equal(pageCategory("/services/growth-web"), "growth_web")
  assert.equal(pageCategory("/services/growth-web/demo"), "growth_web_demo")

  const safe = safeAnalyticsParams({
    class_id: "u9-soccer-wed",
    grade: "grade_1_2",
    is_demo: "true",
    email: "secret@example.jp",
    guardianName: "鈴木 花子",
    phone: "090-1234-5678",
    notes: "private note",
  })
  assert.deepEqual(safe, {
    is_demo: "true",
    class_id: "u9-soccer-wed",
    grade: "grade_1_2",
  })

  const calls = []
  global.window = {
    location: new URL("https://cyberknock.jp/services/growth-web/demo?email=secret@example.jp"),
    gtag: (...args) => calls.push(args),
  }
  try {
    trackEvent("trial_form_submit", {
      form_id: "growth_web_demo_trial",
      class_id: "u9-soccer-wed",
      grade: "grade_1_2",
      is_demo: "true",
      email: "secret@example.jp",
      guardianName: "鈴木 花子",
    })
    assert.equal(calls.length, 1)
    assert.equal(calls[0][1], "trial_form_submit")
    assert.equal(calls[0][2].page, "growth_web_demo")
    assert.equal(calls[0][2].page_location, "https://cyberknock.jp/services/growth-web/demo")
    assert.equal(calls[0][2].page_referrer, "")
    assert.ok(!JSON.stringify(calls).includes("secret@example.jp"))
    assert.ok(!JSON.stringify(calls).includes("鈴木"))
  } finally {
    delete global.window
  }
})

test("Growth Web structured data escapes dangerous chars and links official /privacy-policy without fake metrics", () => {
  const escaped = serializeJsonLd({ text: "</script><script>&\u2028\u2029" })
  assert.ok(!escaped.includes("</script>"))
  assert.ok(escaped.includes("\\u003c/script\\u003e"))

  const lpLd = JSON.stringify(buildGrowthWebLpJsonLd(LP_FAQS))
  assert.match(lpLd, /https:\/\/cyberknock\.jp\/services\/growth-web/)
  assert.doesNotMatch(lpLd, /pages\.dev|localhost/)

  const demoLd = JSON.stringify(
    buildGrowthWebDemoJsonLd(
      DEMO_CLASSES.map((c) => ({ name: c.name, description: c.focusSummary })),
      DEMO_FAQS
    )
  )
  assert.match(demoLd, /https:\/\/cyberknock\.jp\/services\/growth-web\/demo/)
  assert.match(demoLd, /架空モデル/)

  assert.equal(GROWTH_WEB_ROUTES.privacy, "/privacy-policy")
  assert.equal(GROWTH_WEB_ROUTES.lp, "/services/growth-web")
  assert.equal(GROWTH_WEB_ROUTES.demo, "/services/growth-web/demo")

  const inquiryFormSrc = read("components/growth-web/lp/ServiceInquiryForm.tsx")
  assert.match(inquiryFormSrc, /href=\{GROWTH_WEB_ROUTES\.privacy\}/)
  assert.doesNotMatch(inquiryFormSrc, /href="\/privacy"/)

  const demoAppSrc = read("components/growth-web/demo/DemoSportsSchoolApp.tsx")
  assert.match(demoAppSrc, /href="\/privacy-policy"/)
  assert.match(demoAppSrc, /href="\/services\/growth-web"/)
  assert.doesNotMatch(demoAppSrc, /href="\/privacy"/)
})
