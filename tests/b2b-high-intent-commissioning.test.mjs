import test from "node:test"
import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import { insights } from "../lib/b2b-insights.ts"

const read = (name) => readFileSync(new URL("../" + name, import.meta.url), "utf8")

test("high-intent AI development company guide compares the right vendor types without fabricated price ranges", () => {
  const article = insights.find((item) => item.slug === "ai-development-outsourcing-guide")
  assert.ok(article)
  const section = article.sections.find((part) => part.heading.includes("提案を比較"))
  assert.ok(section && section.table)
  assert.equal(section.table.rows.length, 4)
  assert.deepEqual(section.table.headings, ["依頼先のタイプ", "向いている相談", "見積前に確認する点"])
  assert.ok(section.table.rows.some((row) => row[0].includes("機械学習") && row[1].includes("精度評価")))
  assert.ok(section.table.rows.some((row) => row[0].includes("受託開発") && row[1].includes("Web")))
  assert.ok(section.table.rows.some((row) => row[0].includes("SaaS") && row[1].includes("既存ツール")))
  assert.ok(section.table.rows.some((row) => row[0].includes("技術顧問") && row[1].includes("社内チーム")))
  assert.match(section.paragraphs.join(" "), /ランキングではなく/)
  assert.ok(section.bullets?.length >= 6)
  assert.ok(article.relatedResources.some((item) => item.href === "/ai-development"))
})

test("service LP explicitly identifies commissioned AI development without disturbing existing proof", () => {
  const source = read("app/ai-development/page.tsx")
  assert.match(source, /AI受託開発の対応領域/)
  assert.match(source, /自社アプリ「AIスポーツトレーナー」/)
  assert.match(source, /<DemoVideoPlayer \/>/)
  assert.match(source, /<ContactForm source="ai_development"/)
  assert.match(read("app/sitemap.ts"), /"ai-development-outsourcing-guide": "2026-11-28"/)
})
