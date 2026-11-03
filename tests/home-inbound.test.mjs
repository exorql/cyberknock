import test from "node:test"
import assert from "node:assert/strict"
import { readFileSync } from "node:fs"

const home = readFileSync(new URL("../app/page.tsx", import.meta.url), "utf8")
const metadata = readFileSync(new URL("../app/layout.tsx", import.meta.url), "utf8")
const analytics = readFileSync(new URL("../lib/analytics.ts", import.meta.url), "utf8")

test("home hero communicates cross-industry AI and system development in two natural lines", () => {
  const hero = home.match(/<h1 id="hero-title"[^>]*>([\s\S]*?)<\/h1>/)?.[1]
  assert.ok(hero)
  assert.equal(hero.replace(/<[^>]+>/g, ""), "AI・システム開発を、検証から実装まで。")
  assert.match(home, /AIの技術検証（PoC）から、Web・アプリ開発、公開後の改善まで。/)
  assert.match(home, /事業会社・スタートアップ・スポーツ事業者・開発パートナー企業へ/)
  assert.doesNotMatch(hero, /<br\b/)
  assert.match(metadata, /Cyber Knock \| AI・システム開発・PoC・アプリ開発/)
  assert.match(metadata, /業種を問わず新規サービス開発とAI活用を支援/)
})

test("lead CTAs take interested visitors to the contact form without unwanted sport preselection", () => {
  assert.match(home, /<Link href="#contact" className="button button-primary" data-track="cta_click" data-location="hero">開発について相談する/)
  assert.match(home, /<Link href="#contact" className="text-link inquiry-cta" data-track="cta_click" data-location="inquiry">相談内容を送る/)
  assert.match(home, /<Link href="\/\?service=product#contact" className="text-link case-consult-link" data-track="cta_click" data-location="case_study" data-service="product">/)
  assert.match(analytics, /"hero", "inquiry", "method"/)
})

test("buyer questions include general AI work and retain sport-specific validation examples", () => {
  assert.match(home, /既存サービスにAI機能を追加したい/)
  assert.match(home, /試合映像から、特定選手のプレーを抽出したい/)
  assert.match(home, /競技動作を可視化し、指導に活かしたい/)
  assert.match(home, /新しいWeb・アプリを立ち上げたい/)
  assert.match(home, /スポーツ以外の業種もご相談いただけます。/)
  assert.match(home, /公開アプリを確認/)
})
