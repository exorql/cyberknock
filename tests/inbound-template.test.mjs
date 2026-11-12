import { test } from "node:test"
import assert from "node:assert/strict"
import { readFileSync } from "node:fs"

test("PoC発注準備シートが2つの既存記事で案内される", () => {
  const page = readFileSync("app/insights/[slug]/page.tsx", "utf8")
  assert.match(page, /ai-poc-process-evaluation/)
  assert.match(page, /ai-video-analysis-poc-cost/)
  assert.match(page, /href="\/templates\/ai-video-poc-request-template\.txt"/)
  assert.match(page, /download="cyberknock-ai-video-poc-request-template.txt"/)
})

test("要件整理シートは検証・同意・失敗条件・意思決定の確認を含む", () => {
  const template = readFileSync("public/templates/ai-video-poc-request-template.txt", "utf8")
  for (const heading of ["目的と利用者", "映像・入力データ", "AIに期待する出力", "PoCで測る品質", "データの権利", "成功条件", "判断の記録"]) {
    assert.ok(template.includes(heading), `missing: ${heading}`)
  }
  assert.match(template, /未定/)
  assert.match(template, /機密/)
})
