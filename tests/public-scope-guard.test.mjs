import test from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const read = (p) => readFileSync(resolve(root, p), "utf8");
const neverPublish = ["soccer-player-tracking", "kyudo-motion-analysis", "soccer_poc", "kyudo_poc"];

test("no pre-contract client-specific pages are exposed by the public app or sitemap", () => {
  const page = read("app/ai-development/page.tsx");
  const sitemap = read("app/sitemap.ts");
  assert.ok(page.includes('href="/cases/ai-sports-trainer"'), "Only the first-party product may be public evidence");
  assert.ok(page.includes('id="product-proof"'), "First-party evidence should be explicit");
  assert.ok(!page.includes('id="technical-studies"'), "Previous case notes must be removed");
  for (const slug of neverPublish) {
    assert.ok(!page.includes(slug));
    assert.ok(!sitemap.includes(slug));
    assert.ok(!read("lib/analytics.ts").includes(slug));
    assert.ok(!read("functions/contact.js").includes(slug));
  }
  assert.ok(!existsSync(resolve(root, "app/ai-development/soccer-player-tracking/page.tsx")));
  assert.ok(!existsSync(resolve(root, "app/ai-development/kyudo-motion-analysis/page.tsx")));
});

test("only the generic B2B development referral is a recognized contact source", async () => {
  const code = read("functions/contact.js");
  const { validateContact } = await import("data:text/javascript;base64," + Buffer.from(code).toString("base64"));
  const input = {
    name: "QA", email: "qa@example.com", company: "", budget: "", service: "sports-ai",
    message: "General enquiry", privacy: true, website: "",
  };
  assert.equal(validateContact({ ...input, source: "ai_development" }).data.source, "ai_development");
  for (const source of ["soccer_poc", "kyudo_poc", "video_poc"]) {
    assert.equal(validateContact({ ...input, source }).data.source, "other");
  }
});
