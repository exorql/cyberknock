import test from "node:test"
import assert from "node:assert/strict"
import { readFileSync, existsSync } from "node:fs"

const page = readFileSync(new URL("../app/ai-development/page.tsx", import.meta.url), "utf8")
const demoPlayer = readFileSync(new URL("../components/development/demo-video-player.tsx", import.meta.url), "utf8")
const contactForm = readFileSync(new URL("../components/contact-form.tsx", import.meta.url), "utf8")
const caseContent = readFileSync(new URL("../app/cases/ai-sports-trainer/content.tsx", import.meta.url), "utf8")
const casePage = readFileSync(new URL("../app/cases/ai-sports-trainer/page.tsx", import.meta.url), "utf8")
const demoPage = readFileSync(new URL("../app/demos/ai-sports-trainer/page.tsx", import.meta.url), "utf8")
const rootLayout = readFileSync(new URL("../app/layout.tsx", import.meta.url), "utf8")

test("B2B development hero communicates video analysis & generative AI product development with real app screens", () => {
  assert.match(
    page,
    /<h1 id="development-title" className=\{styles\.heroTitle\}>\s*動画解析・生成AIを、<span><strong>現場で使われるプロダクトへ。<\/strong><\/span>\s*<\/h1>/
  )
  assert.ok(!page.includes("使える条件を、<strong>PoCで確かめる。"))
  assert.ok(!page.includes("flowBoard"))
  assert.ok(page.includes("AI開発・PoC・Web／モバイルアプリ受託開発"))
  assert.ok(page.includes("AI機能開発、動画解析、Web・モバイルアプリ開発。"))
  assert.ok(page.includes("開発について相談する（無料）"))
  assert.ok(page.includes("実際の技術デモを見る"))
  assert.ok(page.includes('/images/product/pitching-feedback.webp'))
  assert.ok(page.includes('/images/cases/01-analysis.jpg'))
})

test("B2B LP excludes unverified analysis counts and prohibited guarantees", () => {
  for (const forbidden of [
    "18,170",
    "18170",
    "18,285",
    "23,003",
    "23003",
    "必ず2営業日以内",
    "2営業日以内に",
    "すべての業界・動画を解析できる",
    "無償で顧客動画を解析する",
    "必ず一定の精度を達成する",
  ]) {
    assert.ok(!page.includes(forbidden), `unexpected text in LP: ${forbidden}`)
    assert.ok(!contactForm.includes(forbidden), `unexpected text in ContactForm: ${forbidden}`)
  }
})

test("DemoVideoPlayer withholds unverified video by default and supports accessible click-to-play with captions", () => {
  assert.match(demoPlayer, /export const verifiedCorporateDemoVideo: CorporateDemoVideoConfig \| null = null/)
  assert.ok(demoPlayer.includes('controls'))
  assert.ok(demoPlayer.includes('preload="none"'))
  assert.ok(demoPlayer.includes('kind="captions"'))
  assert.ok(!demoPlayer.includes("autoPlay"))
})

test("Case study CTAs unify to /ai-development#contact and OGP images exist for B2B pages", () => {
  assert.ok(caseContent.includes('href="/ai-development#contact"'))
  assert.ok(!caseContent.includes('href="/?service=sports-ai#contact"'))
  assert.ok(existsSync(new URL("../public/images/og/cyberknock-b2b.png", import.meta.url)))
  assert.ok(existsSync(new URL("../public/images/og/ai-sports-trainer-demo.png", import.meta.url)))
  assert.ok(page.includes("/images/og/cyberknock-b2b.png"))
  assert.ok(rootLayout.includes("/images/og/cyberknock-b2b.png"))
  assert.ok(casePage.includes("/images/og/ai-sports-trainer-demo.png"))
  assert.ok(demoPage.includes("/images/og/ai-sports-trainer-demo.png"))
})
