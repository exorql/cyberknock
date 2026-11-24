import test from "node:test"
import assert from "node:assert/strict"
import { readFileSync, existsSync } from "node:fs"

const page = readFileSync(new URL("../app/ai-development/page.tsx", import.meta.url), "utf8")
const demoPlayer = readFileSync(new URL("../components/development/demo-video-player.tsx", import.meta.url), "utf8")
const developmentStyles = readFileSync(new URL("../app/ai-development/development.module.css", import.meta.url), "utf8")
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

test("Operational proof heading stays one line on desktop without forcing mobile overflow", () => {
  assert.match(page, /className=\{\x60\$\{styles\.chapterHead\} \$\{styles\.productProofHead\}\x60\}/)
  assert.match(page, /id="product-proof-title" className=\{\x60\$\{styles\.chapterTitle\} \$\{styles\.productProofTitle\}\x60\}/)
  assert.ok(page.includes("AIを作るだけでなく、実際に運用してきた実績。"))
  assert.match(developmentStyles, /\.productProofHead\s*\{\s*grid-template-columns:\s*minmax\(0,\s*1fr\)/)
  assert.match(developmentStyles, /@media\s*\(min-width:\s*851px\)\s*\{\s*\.productProofTitle\s*\{\s*white-space:\s*nowrap;/)
  assert.ok(!/@media\s*\(max-width:\s*\d+px\)[^}]*\.productProofTitle\s*\{\s*white-space:\s*nowrap/.test(developmentStyles))
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

test("B2B LP explains NDA and paid validation in one short reassurance paragraph", () => {
  assert.ok(page.includes("<h3>安心してご相談いただくために</h3>"))
  assert.ok(page.includes("初回相談・概算見積もりは無料です"))
  assert.ok(page.includes("NDA締結に対応しています"))
  assert.ok(page.includes("内容と費用を事前に合意したうえで有償にて実施します"))
  assert.ok(page.includes("className={styles.requirementSummary}"))
  assert.ok(developmentStyles.includes(".requirementSummary {"))
  assert.ok(page.includes('href="/security"'), "retain the detailed security-policy link")
  assert.ok(!page.includes("NDA・成果物・知的財産権・契約条件"))
  assert.ok(!page.includes("成果物・知的財産権："))
  assert.ok(!page.includes("保管場所・利用範囲・検証後の削除手順"))
})

test("DemoVideoPlayer uses only the three web delivery files and a click-to-play, captioned player", () => {
  const demoVideo = readFileSync(new URL("../components/development/demo-video.tsx", import.meta.url), "utf8")
  for (const path of [
    "/videos/cyberknock-b2b-ai-demo-25s-web.mp4",
    "/videos/cyberknock-b2b-ai-demo-25s-poster.webp",
    "/videos/cyberknock-b2b-ai-demo-25s.ja.vtt",
  ]) {
    assert.ok(demoPlayer.includes(`"${path}"`), `config must reference ${path}`)
  }
  // No autoplay; the <video> element only exists after the visitor asks for it.
  assert.ok(!/\bautoPlay\b|<video[^>]*\sautoplay\b/.test(demoVideo + demoPlayer))
  assert.match(demoVideo, /stage === "player" \? \(\s*<video/)
  assert.ok(demoVideo.includes('loading="lazy"'), "poster facade must not compete with initial content")
  assert.ok(demoVideo.includes("controls"))
  assert.ok(demoVideo.includes("playsInline"))
  assert.ok(demoVideo.includes('kind="captions"') && demoVideo.includes('srcLang="ja"'))
  assert.ok(demoVideo.includes('type="button"'))
  assert.ok(demoVideo.includes('role="alert"'), "load failures must be announced with a retry path")
  assert.ok(demoVideo.includes("動画の内容をテキストで読む"), "silent video needs a text alternative")
  assert.ok(demoVideo.includes("AIの認識精度を示す数値ではありません"), "the 73-point score must not read as model accuracy")
  // The static three-step explanation stays alongside the video.
  assert.equal((demoPlayer.match(/step: "0\d"/g) || []).length, 3)
})

test("B2B LP keeps one secondary detail link below the video and three screens", () => {
  assert.ok(!page.includes('href="/demos/ai-sports-trainer"'), "do not navigate away before the video")
  assert.ok(!page.includes("動画分析の実画面デモを見る"), "remove the redundant upper button")
  assert.equal((demoPlayer.match(/href="\/demos\/ai-sports-trainer"/g) || []).length, 1)
  const videoIndex = demoPlayer.indexOf("<DemoVideo video={video} />")
  const stepsIndex = demoPlayer.indexOf("className={styles.demoStepsGrid}")
  const detailIndex = demoPlayer.indexOf('href="/demos/ai-sports-trainer"')
  const contactIndex = demoPlayer.indexOf('href="#contact"')
  assert.ok(videoIndex >= 0 && videoIndex < stepsIndex && stepsIndex < detailIndex && detailIndex < contactIndex)
  assert.ok(demoPlayer.includes("実画面3点と検証ポイントを詳しく見る"))
  assert.ok(!demoPlayer.includes("対話型の実画面デモページへ"))
  assert.match(demoPlayer, /href="#contact"\s+className="button button-primary"/)
  assert.ok(page.includes('href="/cases/ai-sports-trainer"'), "keep the case study link")
})

test("Only web delivery files are public; the master, raw media and QA material are not", async () => {
  const { readdirSync } = await import("node:fs")
  const { createHash } = await import("node:crypto")
  const dir = new URL("../public/videos/", import.meta.url)
  assert.deepEqual(readdirSync(dir).sort(), [
    "cyberknock-b2b-ai-demo-25s-poster.webp",
    "cyberknock-b2b-ai-demo-25s-web.mp4",
    "cyberknock-b2b-ai-demo-25s.ja.vtt",
  ])
  const expected = {
    "cyberknock-b2b-ai-demo-25s-web.mp4": "6e6400b4578075d740a953f811ecd21a8ec341db1d0e70702af9593492331669",
    "cyberknock-b2b-ai-demo-25s-poster.webp": "4610baa770e4ed9945e2996ebd738e2792dfef42708cc69c231b0e8f9ceedfbb",
    "cyberknock-b2b-ai-demo-25s.ja.vtt": "6329d4176d5c442d524dea27730fee517419706e01f26d659fbd34ea7181b2bf",
  }
  for (const [name, hash] of Object.entries(expected)) {
    const bytes = readFileSync(new URL(name, dir))
    assert.equal(createHash("sha256").update(bytes).digest("hex"), hash, `${name} must match the QA-verified delivery file`)
  }
  const vtt = readFileSync(new URL("cyberknock-b2b-ai-demo-25s.ja.vtt", dir), "utf8")
  assert.ok(vtt.startsWith("WEBVTT"))
  assert.equal((vtt.match(/-->/g) || []).length, 5)
  assert.ok(!vtt.includes("�"))
  const publicFiles = readdirSync(new URL("../public/", import.meta.url), { recursive: true }).map(String)
  assert.ok(!publicFiles.some((file) => /master|pitching\.mp4|pose\.mp4|material-handoff|QA\.md|HANDOFF/i.test(file)))
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

test("B2B LP showcases Choleste AI commercial proof, consultation shortcuts, and presents scoped reference prices", () => {
  assert.ok(page.includes("コレステAI"))
  assert.ok(page.includes("/images/product/choleste-meal-record.webp"))
  assert.match(page, /choleste-meal-record\.webp[\s\S]*loading="lazy"/)
  assert.ok(existsSync(new URL("../public/images/product/choleste-meal-record.webp", import.meta.url)))
  assert.ok(page.includes("https://choleste-coach.com") || page.includes("site.cholesteUrl"))
  for (const service of ["sports-ai", "ai-improvement", "product", "advisory"]) {
    assert.ok(page.includes(`?service=${service}#contact`) || page.includes("`?service=${shortcut.service}#contact`"))
    assert.ok(page.includes(`"${service}"`))
  }
  for (const approvedPrice of ["30万〜80万円", "80万〜250万円", "150万〜600万円", "個別見積もり"]) {
    assert.ok(page.includes(approvedPrice), `missing reference price: \${approvedPrice}`)
  }
  assert.ok(page.includes('id="pricing"'))
  assert.ok(page.includes('税抜の参考費用'))
  assert.ok(page.includes('固定料金や認識精度の保証ではありません'))
  assert.ok(page.includes('href="#contact"'))
})
