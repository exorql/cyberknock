import test from "node:test"
import assert from "node:assert/strict"
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs"
import { INQUIRY_REQUIRED_FIELD_LABELS, LP_HERO, PRICING_TERMS, SERIF_TEXT } from "../lib/growth-web/lp-content.ts"
import { isFormVisibleOrPassed, isKeyboardOpen, shouldShowSticky } from "../lib/growth-web/sticky-cta.ts"
import { safeAnalyticsParams } from "../lib/analytics.ts"

const root = new URL("../", import.meta.url)
const read = (p) => readFileSync(new URL(p, root), "utf8")
const FONT_DIR = "public/fonts/growth-web/"

// Keep in sync with SANS_SOURCE_GLOBS in scripts/build-growth-web-fonts.py.
const SANS_SOURCES = [
  "app/services/growth-web/page.tsx",
  ...readdirSync(new URL("components/growth-web/lp/", root))
    .filter((f) => f.endsWith(".tsx"))
    .map((f) => `components/growth-web/lp/${f}`),
  "lib/growth-web/lp-content.ts",
  "lib/growth-web/service-lp.ts",
  "lib/growth-web/form-options.ts",
  "functions/api/growth-web/inquiries.js",
]
const LP_COMPONENTS = SANS_SOURCES.filter((p) => p.startsWith("components/") || p.startsWith("app/"))

test("Growth Web LP font subsets cover every character rendered in the display faces", () => {
  const manifest = JSON.parse(read(FONT_DIR + "manifest.json"))
  const serif = new Set(manifest["gw-mincho-800.woff2"])
  const serifMissing = [...Object.values(SERIF_TEXT).join("")].filter((c) => !serif.has(c))
  assert.deepEqual(serifMissing, [], `gw-mincho-800: run scripts/build-growth-web-fonts.py (missing ${serifMissing.join("")})`)
  // Every mincho heading in the LP components must come from SERIF_TEXT (otherwise it is not subset).
  for (const file of LP_COMPONENTS) {
    for (const m of read(file).matchAll(/className="[^"]*gwl-serif[^"]*"[^>]*>([\s\S]*?)<\/h[12]>/g)) {
      const literal = m[1].replace(/\{[^}]*\}/g, "").replace(/<[^>]+>/g, "").trim()
      assert.equal(literal, "", `${file}: mincho heading text must use SERIF_TEXT (found "${literal}")`)
    }
  }
  // Latin subset (prices, labels) covers Basic Latin + Latin-1 (incl. ¥).
  const latin = new Set(manifest["inter-latin-700.woff2"])
  for (const ch of "0123456789,¥%+ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz") assert.ok(latin.has(ch), ch)
})

test("Growth Web LP fonts stay small and are declared only for the LP", () => {
  let total = 0
  for (const name of Object.keys(JSON.parse(read(FONT_DIR + "manifest.json")))) {
    assert.ok(existsSync(new URL(FONT_DIR + name, root)), name)
    total += statSync(new URL(FONT_DIR + name, root)).size
  }
  assert.ok(total < 400 * 1024, `font payload ${total} bytes`)
  const full = read("app/services/growth-web/growth-web.css")
  const css = full.slice(full.indexOf("*/", full.indexOf("Service LP (final design)")) + 2)
  assert.ok(css.length > 1000, "LP section of growth-web.css")
  for (const name of Object.keys(JSON.parse(read(FONT_DIR + "manifest.json")))) assert.match(css, new RegExp(`/fonts/growth-web/${name.replace(".", "\\.")}`))
  // every rule outside @font-face/@media is scoped to the LP root
  const selectors = css.replace(/\/\*[\s\S]*?\*\//g, "").replace(/@font-face\s*\{[^}]*\}/g, "").match(/(^|\})\s*([^\s@{}][^{}]*)\{/g) || []
  for (const raw of selectors) {
    const sel = raw.replace(/^\}?\s*/, "").replace(/\{$/, "").trim()
    if (!sel || /^(from|to|\d+%)$/.test(sel)) continue
    for (const part of sel.split(/,(?![^(]*\))/)) assert.match(part.trim(), /^\.gwl-/, `unscoped selector: ${part.trim()}`)
  }
})

test("Growth Web LP hero copy matches the real inquiry form requirements", () => {
  const form = read("components/growth-web/lp/ServiceInquiryForm.tsx")
  const requiredNames = [...form.matchAll(/name="(\w+)"\s+type="[^"]+"\s+required/g)].map((m) => m[1])
  assert.deepEqual(requiredNames, ["organizationName", "contactName", "email"])
  assert.equal(INQUIRY_REQUIRED_FIELD_LABELS.length, requiredNames.length)
  assert.ok(LP_HERO.assurances[0].includes(INQUIRY_REQUIRED_FIELD_LABELS.join("・")))
  assert.match(LP_HERO.assurances[0], /プライバシーポリシーへの同意/)
  assert.match(form, /name="privacyAccepted"/)
  assert.match(read("lib/growth-web/form-options.ts"), /privacyAccepted/)
  // Promises that the service does not define must not reappear.
  const copy = SANS_SOURCES.map(read).join("\n")
  for (const banned of ["URLを送るだけ", "約5分", "約60分", "1週目"]) assert.ok(!copy.includes(banned), banned)
})

test("Growth Web LP names no real competitors and frames the ROI tool as a non-guaranteed estimate", () => {
  const copy = SANS_SOURCES.map(read).join("\n") + read("lib/analytics.ts")
  for (const name of ["ラクスル", "タウンページ", "スポスル", "raksul"]) assert.ok(!copy.includes(name), name)
  assert.match(PRICING_TERMS.roiNote, /保証するものではありません/)
  const page = read("components/growth-web/lp/TrustAndPricing.tsx")
  assert.match(page, /<details className="gwl-roi">/)
  assert.match(page, /<RoiSimulator embedded \/>/)
})

test("Growth Web LP keeps anchors, sections and tracked CTAs", () => {
  const all = LP_COMPONENTS.map(read).join("\n")
  for (const id of ['id="contact"', 'id="pricing"', 'id="faq"', 'id="simulator"', 'id="demo"', 'id="gwl-hero-cta"']) assert.ok(all.includes(id), id)
  assert.match(all, /event="lp_hero_cta_click"/)
  assert.match(all, /event="lp_demo_cta_click"/)
  assert.match(read("app/services/growth-web/page.tsx"), /<MobileStickyCta \/>/)
})

test("Growth Web sticky CTA visibility rule and PII-free tracking", () => {
  const base = { isMobile: true, heroCtaVisible: false, formVisible: false, fieldFocused: false, keyboardOpen: false }
  assert.equal(shouldShowSticky(base), true)
  assert.equal(shouldShowSticky({ ...base, isMobile: false }), false)
  assert.equal(shouldShowSticky({ ...base, heroCtaVisible: true }), false)
  assert.equal(shouldShowSticky({ ...base, formVisible: true }), false)
  assert.equal(shouldShowSticky({ ...base, fieldFocused: true }), false)
  assert.equal(shouldShowSticky({ ...base, keyboardOpen: true }), false)
  // Below the form: show; entering it: hide; after scrolling into footer: stay hidden.
  assert.equal(isFormVisibleOrPassed(false, 900), false)
  assert.equal(isFormVisibleOrPassed(true, 600), true)
  assert.equal(isFormVisibleOrPassed(false, 0), true)
  assert.equal(isFormVisibleOrPassed(false, -150), true)
  assert.equal(shouldShowSticky({ ...base, formVisible: isFormVisibleOrPassed(false, -150) }), false)
  // Scrolling back up: keep hidden over the form; resume only above the form.
  assert.equal(isFormVisibleOrPassed(true, 300), true)
  assert.equal(isFormVisibleOrPassed(false, 900), false)
  assert.equal(isKeyboardOpen(400, 844), true)
  assert.equal(isKeyboardOpen(800, 844), false)
  assert.deepEqual(
    safeAnalyticsParams({ location: "growth_web_sticky", cta_label: "hero_free_site_audit", destination: "#contact", email: "a@example.jp" }),
    { location: "growth_web_sticky", cta_label: "hero_free_site_audit", destination: "#contact" }
  )
  const sticky = read("components/growth-web/lp/MobileStickyCta.tsx")
  assert.match(sticky, /location: "growth_web_sticky"/)
  assert.match(sticky, /isFormVisibleOrPassed\(entry\.isIntersecting, entry\.boundingClientRect\.bottom\)/)
})
