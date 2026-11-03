import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const home = readFileSync(new URL("../app/page.tsx", import.meta.url), "utf8");
const casePage = readFileSync(new URL("../app/cases/ai-sports-trainer/content.tsx", import.meta.url), "utf8");
const sports = readFileSync(new URL("../app/sports-dx/content.tsx", import.meta.url), "utf8");
const footer = readFileSync(new URL("../components/site-footer.tsx", import.meta.url), "utf8");

const headingById = (source, id) => {
  const re = new RegExp('<h[12][^>]*id="' + id + '"[^>]*>([\\s\\S]*?)</h[12]>');
  return source.match(re)?.[1] ?? null;
};

test("unnecessary manual line breaks remain absent from specified headings", () => {
  for (const id of ["approach-title", "case-title", "services-title", "process-title"]) {
    const heading = headingById(home, id);
    assert.ok(heading, id);
    assert.doesNotMatch(heading, /<br\b/, id);
  }
  const caseHero = casePage.match(/<h1 className="page-title">([\s\S]*?)<\/h1>/)?.[1];
  assert.ok(caseHero);
  assert.doesNotMatch(caseHero, /<br\b/);
  assert.match(caseHero.replace(/<[^>]+>/g, ""), /^AIを、次の練習につながる体験へ。$/);
  assert.match(footer, /つくる。その先の事業と、現場まで。/);
  assert.doesNotMatch(footer, /つくる。その先の<br\b/);
});

test("the profile badge and redundant sports-DX evidence section are removed", () => {
  assert.doesNotMatch(home, /<span className="tag">2024年 独立<\/span>/);
  assert.doesNotMatch(sports, /公開後の課題にも、向き合っています。/);
  assert.doesNotMatch(sports, /evidence-heading/);
  assert.match(sports, /05 \/ ご相談にあたって/);
  assert.doesNotMatch(sports, /06 \/ ご相談にあたって/);
});
