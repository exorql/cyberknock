import test from "node:test"
import assert from "node:assert/strict"
import { readFileSync } from "node:fs"

const page = readFileSync(new URL("../app/ai-video-analysis/page.tsx", import.meta.url), "utf8")

test("B2B video AI hero uses the concise two-line headline and retains service SEO", () => {
  assert.match(page, /<h1 id="video-poc-title" className=\{styles.heroTitle\}>映像AIの開発を、<span><strong>PoCから実装まで。<\/strong><\/span><\/h1>/)
  assert.ok(!page.includes("使える条件を、<strong>PoCで確かめる。"))
  assert.ok(page.includes('AI動画解析の受託開発・PoC'))
  assert.ok(page.includes('スポーツ以外の映像AIやWeb・モバイル開発も'))
})
