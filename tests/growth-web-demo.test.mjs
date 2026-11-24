import test from "node:test"
import assert from "node:assert/strict"
import { existsSync, readFileSync, statSync } from "node:fs"
import {
  DEMO_CLASS_VISUALS,
  DEMO_DISPLAY_TEXT,
  DEMO_GRADE_TILES,
  DEMO_PHOTO_CREDITS,
  dayFilterParam,
  filterDemoClasses,
  splitTimeRange,
} from "../lib/growth-web/demo-content.ts"
import {
  DEMO_CLASSES,
  TRANSPARENT_PRICING,
  getEligibleDemoClassesForGrade,
  isGradeEligibleForClass,
} from "../lib/growth-web/demo-school.ts"
import { CHILD_GRADES, validateTrialBookingClient } from "../lib/growth-web/form-options.ts"
import { isTextEntry, shouldShowDemoSticky } from "../lib/growth-web/demo-sticky.ts"
import { safeAnalyticsParams } from "../lib/analytics.ts"
import {
  handleGrowthWebDemoTrial,
  resetGrowthWebDemoStores,
  validateDemoTrial,
} from "../functions/api/growth-web/demo-trial.js"

const root = new URL("../", import.meta.url)
const read = (path) => readFileSync(new URL(path, root), "utf8")
const all = { grade: "all", days: [], campus: "all" }

test("demo display font subset covers every display character", () => {
  const manifest = JSON.parse(read("public/fonts/growth-web-demo/manifest.json"))
  const glyphs = new Set(manifest["zen-kaku-gothic-new-900.woff2"].glyphs)
  const missing = [...new Set(Object.values(DEMO_DISPLAY_TEXT).join(""))].filter((c) => !glyphs.has(c))
  assert.deepEqual(missing, [], "run scripts/build-growth-web-demo-fonts.py")
  for (const file of ["zen-kaku-gothic-new-900.woff2", "archivo-800.woff2"]) {
    const size = statSync(new URL(`public/fonts/growth-web-demo/${file}`, root)).size
    assert.ok(size > 1000 && size < 60_000, `${file} should be a small subset (${size} bytes)`)
  }
  assert.match(read("public/fonts/growth-web-demo/LICENSE.md"), /SIL Open Font License/)
})

test("every class has a visual with responsive AVIF and WebP files", () => {
  for (const slot of DEMO_CLASSES) {
    const visual = DEMO_CLASS_VISUALS[slot.id]
    assert.ok(visual, slot.id)
    assert.match(visual.imageAlt, /イメージ写真/)
    for (const w of [320, 480]) {
      for (const ext of ["avif", "webp"]) {
        assert.ok(existsSync(new URL(`public/images/growth-web-demo/${visual.image}-${w}.${ext}`, root)), `${visual.image}-${w}.${ext}`)
      }
    }
  }
  for (const name of ["hero-wide-1280", "hero-wide-1920", "hero-tall-480", "hero-tall-720", "hero-tall-828", "coach-640", "coach-1200"]) {
    for (const ext of ["avif", "webp"]) {
      const size = statSync(new URL(`public/images/growth-web-demo/${name}.${ext}`, root)).size
      assert.ok(size < 120_000, `${name}.${ext} is ${size} bytes`)
    }
  }
})

test("photo credits list every photo source and license used", () => {
  const credits = read("public/images/growth-web-demo/CREDITS.md")
  assert.match(credits, /Unsplash License/)
  assert.match(credits, /CC0 1\.0/)
  assert.match(credits, /CC BY 4\.0/)
  for (const c of DEMO_PHOTO_CREDITS) {
    assert.ok(credits.includes(c.sourceUrl), c.sourceUrl)
    assert.ok(credits.includes(c.photographer), c.photographer)
    assert.ok(credits.includes(c.license), c.license)
  }
  assert.equal(new Set(DEMO_PHOTO_CREDITS.map((c) => c.sourceUrl)).size, DEMO_PHOTO_CREDITS.length)
})

test("class search: grade, day and place are independent filters", () => {
  assert.equal(filterDemoClasses(all).length, DEMO_CLASSES.length)
  const counts = Object.fromEntries(DEMO_GRADE_TILES.map((t) => [t.id, filterDemoClasses({ ...all, grade: t.id }).length]))
  assert.deepEqual(counts, { preschool_senior: 3, grade_1_2: 4, grade_3: 3, grade_4: 3, grade_5_6: 2 })
  assert.deepEqual(filterDemoClasses({ ...all, days: ["sat"] }).map((c) => c.id), ["weekend-family-sat"])
  assert.deepEqual(filterDemoClasses({ ...all, days: ["tue", "thu"] }).map((c) => c.id), ["kids-movement-tue", "indoor-agility-thu"])
  assert.deepEqual(
    filterDemoClasses({ grade: "grade_1_2", days: [], campus: "yoga_gym" }).map((c) => c.id),
    ["indoor-agility-thu", "weekend-family-sat"]
  )
  assert.equal(filterDemoClasses({ grade: "grade_5_6", days: ["tue"], campus: "all" }).length, 0)
})

test("grade and class eligibility stay strictly consistent across search, pricing, client validation and demo API", async () => {
  // Grade 4 must never see or book the U-9 (grades 1-3) class; Grade 3 must never see or book U-12 (grades 4-6).
  assert.equal(isGradeEligibleForClass("u9-soccer-wed", "grade_3"), true)
  assert.equal(isGradeEligibleForClass("u9-soccer-wed", "grade_4"), false)
  assert.equal(isGradeEligibleForClass("u12-game-sense-fri", "grade_3"), false)
  assert.equal(isGradeEligibleForClass("u12-game-sense-fri", "grade_4"), true)

  const grade4ClassIds = filterDemoClasses({ ...all, grade: "grade_4" }).map((c) => c.id)
  assert.deepEqual(grade4ClassIds, ["indoor-agility-thu", "u12-game-sense-fri", "weekend-family-sat"])
  assert.deepEqual(
    getEligibleDemoClassesForGrade("grade_4").map((c) => c.id),
    grade4ClassIds
  )

  const grade3ClassIds = filterDemoClasses({ ...all, grade: "grade_3" }).map((c) => c.id)
  assert.deepEqual(grade3ClassIds, ["u9-soccer-wed", "indoor-agility-thu", "weekend-family-sat"])

  // Pricing table reflects U-9 (1-3) vs Saturday (preschool-6) accurately.
  const sharedTier = TRANSPARENT_PRICING.tiers.find((t) => t.name.includes("U-9"))
  assert.ok(sharedTier)
  assert.match(sharedTier.target, /小学1〜3年生/)
  assert.match(sharedTier.target, /年長〜小学6年生/)

  // Every (class, grade) pair must agree across DEMO_CLASSES, client validator and demo API validator.
  const basePayload = {
    guardianName: "青葉 花子",
    email: "hanako@example.jp",
    phone: "090-0000-0000",
    preferredTiming: "next_week",
    experienceLevel: "beginner",
    notes: "",
    demoAcknowledged: true,
    websiteHp: "",
  }
  for (const slot of DEMO_CLASSES) {
    assert.ok(slot.grades.includes(slot.defaultGradeValue), `${slot.id} defaultGradeValue must be eligible`)
    for (const grade of CHILD_GRADES) {
      const expectedOk = slot.grades.includes(grade.value)
      const payload = { ...basePayload, selectedClassId: slot.id, childGrade: grade.value }
      const clientResult = validateTrialBookingClient(payload)
      const apiResult = validateDemoTrial(payload)
      if (expectedOk) {
        assert.ok(clientResult.data, `client should accept ${slot.id} + ${grade.value}`)
        assert.ok(apiResult.data, `api should accept ${slot.id} + ${grade.value}`)
      } else {
        assert.ok(clientResult.fieldErrors?.selectedClassId, `client should reject ${slot.id} + ${grade.value}`)
        assert.ok(apiResult.fieldErrors?.selectedClassId, `api should reject ${slot.id} + ${grade.value}`)
      }
    }
  }

  // HTTP 400 from demo API when grade_4 attempts to book U-9 (grades 1-3)
  resetGrowthWebDemoStores()
  const badRes = await handleGrowthWebDemoTrial(
    new Request("https://cyberknock.jp/api/growth-web/demo-trial", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Origin: "https://cyberknock.jp",
        "cf-connecting-ip": "203.0.113.44",
      },
      body: JSON.stringify({ ...basePayload, selectedClassId: "u9-soccer-wed", childGrade: "grade_4" }),
    })
  )
  assert.equal(badRes.status, 400)
  const badBody = await badRes.json()
  assert.ok(badBody.fieldErrors?.selectedClassId?.[0])

  // GA4 allowlist permits grade_3 and grade_4 with zero PII
  assert.deepEqual(safeAnalyticsParams({ grade_filter: "grade_4", grade: "grade_3", email: "x@example.jp" }), {
    grade_filter: "grade_4",
    grade: "grade_3",
  })
})

test("day filter is measured with a fixed vocabulary only", () => {
  assert.equal(dayFilterParam([]), "all")
  assert.equal(dayFilterParam(["wed"]), "wed")
  assert.equal(dayFilterParam(["wed", "sat"]), "multiple")
  assert.deepEqual(safeAnalyticsParams({ day_filter: "multiple", grade_filter: "grade_1_2" }), {
    day_filter: "multiple",
    grade_filter: "grade_1_2",
  })
  assert.deepEqual(safeAnalyticsParams({ day_filter: "火曜", email: "a@example.jp" }), {})
})

test("time range splits into clock time and lesson length", () => {
  assert.deepEqual(splitTimeRange("16:30–17:40（70分）"), { time: "16:30–17:40", minutes: "70分" })
  for (const slot of DEMO_CLASSES) assert.match(splitTimeRange(slot.timeRange).minutes, /^\d+分$/)
})

test("mobile sticky CTA hides over the hero, at/after the form and while typing", () => {
  const base = { heroBottom: -10, formTop: 2000, viewportHeight: 844, fieldFocused: false }
  assert.equal(shouldShowDemoSticky(base), true)
  assert.equal(shouldShowDemoSticky({ ...base, heroBottom: 120 }), false)
  assert.equal(shouldShowDemoSticky({ ...base, formTop: 800 }), false)
  assert.equal(shouldShowDemoSticky({ ...base, formTop: -3000 }), false)
  assert.equal(shouldShowDemoSticky({ ...base, fieldFocused: true }), false)
  const el = (tagName, type) => ({ tagName, getAttribute: () => type ?? null })
  assert.equal(isTextEntry(el("INPUT", "email")), true)
  assert.equal(isTextEntry(el("INPUT", "checkbox")), false)
  assert.equal(isTextEntry(el("INPUT", "radio")), false)
  assert.equal(isTextEntry(el("SELECT")), true)
  assert.equal(isTextEntry(null), false)
})

test("demo page stays isolated from the LP stylesheet and keeps SEO and demo-safety copy", () => {
  const page = read("app/services/growth-web/demo/page.tsx")
  assert.match(page, /import "\.\/demo\.css"/)
  assert.doesNotMatch(page, /growth-web\.css/)
  assert.match(page, /canonical: pathname/)
  assert.match(page, /buildGrowthWebDemoJsonLd/)
  const css = read("app/services/growth-web/demo/demo.css")
  const selectors = css
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/@font-face\s*\{[^}]*\}/g, "")
    .replace(/@(media|container)[^{]*\{/g, "}")
    .match(/(^|\})\s*([^@{}][^{}]*)\{/g)
    .map((m) => m.replace(/^\}?\s*/, "").replace(/\{$/, "").trim())
    .filter((s) => s && !/^(from|to|\d+%)$/.test(s))
  for (const sel of selectors) {
    for (const part of sel.split(/,(?![^(]*\))/)) {
      assert.match(part.trim(), /^(:root )?\.gwd/, `unscoped selector: ${part.trim()}`)
    }
  }
  const form = read("components/growth-web/demo/TrialBookingForm.tsx")
  assert.match(form, /予約は成立せず/)
  assert.match(form, /\/api\/growth-web\/demo-trial/)
  assert.doesNotMatch(form, /60秒|1分で終わ/)
  const banner = read("components/growth-web/demo/DemoBanner.tsx")
  assert.match(banner, /架空のスクール/)
})
