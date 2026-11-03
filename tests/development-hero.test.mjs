import test from "node:test"
import assert from "node:assert/strict"
import { readFileSync } from "node:fs"

const page = readFileSync(new URL("../app/ai-development/page.tsx", import.meta.url), "utf8")

test("B2B development hero remains broad and unambiguous", () => {
  assert.match(page, /<h1 id="development-title" className=\{styles.heroTitle\}>AI・プロダクト開発を、<span><strong>構想から実装まで。<\/strong><\/span><\/h1>/)
  assert.ok(!page.includes("使える条件を、<strong>PoCで確かめる。"))
  assert.ok(page.includes('AI開発・PoC・Web／モバイルアプリ受託開発'))
  assert.ok(page.includes('AI機能開発、動画解析、Web・モバイルアプリ開発。'))
})
