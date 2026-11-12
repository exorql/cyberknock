import test from "node:test"
import assert from "node:assert/strict"
import { readFileSync } from "node:fs"

const read = path => readFileSync(new URL("../" + path, import.meta.url), "utf8")
const sourceFiles = [
  "app/layout.tsx", "app/robots.ts", "app/sitemap.ts",
  "app/ai-development/page.tsx", "app/sports-dx/page.tsx",
  "app/sports-dx/content.tsx", "app/cases/ai-sports-trainer/page.tsx",
  "app/security/page.tsx", "app/privacy-policy/page.tsx",
  "app/insights/page.tsx", "app/insights/[slug]/page.tsx",
  "lib/site.ts", "lib/analytics.ts", "components/site-analytics.tsx",
]

test("public metadata, structured data, and analytics use the verified custom domain", () => {
  for (const path of sourceFiles) {
    const src = read(path)
    assert.doesNotMatch(src, /https:\/\/cyberknock\.pages\.dev/, path + " still points to Pages preview hostname")
    assert.match(src, /https:\/\/harutowatanabe\.com/, path + " is missing the official origin")
  }
})

test("root metadata, sitemap and robots agree on the custom domain", () => {
  assert.match(read("app/layout.tsx"), /const siteUrl = "https:\/\/harutowatanabe\.com"/)
  assert.match(read("app/layout.tsx"), /metadataBase: new URL\(siteUrl\)/)
  assert.match(read("app/robots.ts"), /https:\/\/harutowatanabe\.com\/sitemap\.xml/)
  assert.match(read("app/sitemap.ts"), /const baseUrl = "https:\/\/harutowatanabe\.com"/)
  assert.match(read("lib/site.ts"), /url: "https:\/\/harutowatanabe\.com"/)
  assert.match(read("lib/analytics.ts"), /const siteOrigin = "https:\/\/harutowatanabe\.com"/)
  assert.match(read("scripts/audit-lighthouse.mjs"), /const publicOrigin = 'https:\/\/harutowatanabe\.com'/)
})
