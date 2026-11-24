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
import { DEMO_CLASSES } from "../lib/growth-web/demo-school.ts"
import { isTextEntry, shouldShowDemoSticky } from "../lib/growth-web/demo-sticky.ts"
import { safeAnalyticsParams } from "../lib/analytics.ts"

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

test("photo credits list every Unsplash photo used", () => {
  const credits = read("public/images/growth-web-demo/CREDITS.md")
  assert.match(credits, /Unsplash License/)
  for (const c of DEMO_PHOTO_CREDITS) {
    assert.ok(credits.includes(`https://unsplash.com/photos/${c.photoId}`), c.photoId)
    assert.ok(credits.includes(c.photographer), c.photographer)
  }
  assert.equal(new Set(DEMO_PHOTO_CREDITS.map((c) => c.photoId)).size, DEMO_PHOTO_CREDITS.length)
})

test("class search: grade, day and place are independent filters", () => {
  assert.equal(filterDemoClasses(all).length, DEMO_CLASSES.length)
  const counts = Object.fromEntries(DEMO_GRADE_TILES.map((t) => [t.id, filterDemoClasses({ ...all, grade: t.id }).length]))
  assert.deepEqual(counts, { preschool_senior: 3, grade_1_2: 4, grade_3_4: 4, grade_5_6: 2 })
  assert.deepEqual(filterDemoClasses({ ...all, days: ["sat"] }).map((c) => c.id), ["weekend-family-sat"])
  assert.deepEqual(filterDemoClasses({ ...all, days: ["tue", "thu"] }).map((c) => c.id), ["kids-movement-tue", "indoor-agility-thu"])
  assert.deepEqual(
    filterDemoClasses({ grade: "grade_1_2", days: [], campus: "yoga_gym" }).map((c) => c.id),
    ["indoor-agility-thu", "weekend-family-sat"]
  )
  assert.equal(filterDemoClasses({ grade: "grade_5_6", days: ["tue"], campus: "all" }).length, 0)
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
