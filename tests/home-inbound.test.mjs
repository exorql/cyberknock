import test from "node:test"
import assert from "node:assert/strict"
import { readFileSync } from "node:fs"

const home = readFileSync(new URL("../app/page.tsx", import.meta.url), "utf8")
const metadata = readFileSync(new URL("../app/layout.tsx", import.meta.url), "utf8")
const analytics = readFileSync(new URL("../lib/analytics.ts", import.meta.url), "utf8")

test("home hero communicates business operations and a free consultation", () => {
  const hero = home.match(/<h1 id="hero-title"[^>]*>([\s\S]*?)<\/h1>/)?.[1]
  assert.ok(hero)
  assert.equal(hero.replace(/<[^>]+>/g, ""), "手作業を減らし、本業に使える時間を増やす。")
  assert.match(home, /受発注・見積・報告/)
  assert.match(home, /中小・中堅企業の業務改善/)
  assert.doesNotMatch(hero, /<br\b/)
  assert.match(metadata, /業務改善・自動化と業務システム開発 \| Cyber Knock/)
  assert.match(metadata, /既存ツールの活用から業務システムの導入・運用まで/)
})

test("lead CTAs take interested visitors to the contact form without unwanted sport preselection", () => {
  assert.match(home, /<Link href="#contact" className="button button-primary" data-track="cta_click" data-location="hero">業務の困りごとを相談する/)
  assert.match(home, /<Link href="#contact" className="text-link inquiry-cta" data-track="cta_click" data-location="inquiry">相談内容を送る/)
  assert.match(home, /<Link href="\/\?service=product#contact" className="text-link case-consult-link" data-track="cta_click" data-location="case_study" data-service="product">/)
  assert.match(analytics, /"hero", "inquiry", "method"/)
})

test("buyer questions lead to both operations services and the specialist development pages", () => {
  for (const target of ["business-automation", "business-systems", "/ai-development", "/ai-development/ai-quality-evaluation"]) {
    assert.ok(home.includes('"' + target + '"'), target)
  }
  assert.match(home, /公開アプリを確認/)
})
