import test from 'node:test';
import assert from 'node:assert/strict';
import { combineLighthouseAttempts, median, targetFailures } from '../scripts/lighthouse-stats.mjs';

const targets = { performance: 90, accessibility: 95, 'best-practices': 95, seo: 95, lcpMs: 2500, cls: 0.1 };
function run(attempt, performance = 98, tbt = 70, lcp = 2200) {
  return {
    attempt, stage: 'after', page: 'home', pathname: '/', status: 'measured',
    scores: { performance, accessibility: 100, 'best-practices': 100, seo: 100 },
    metrics: { lcpMs: lcp, cls: 0, tbtMs: tbt, fcpMs: 1000, inpMs: null },
    auditErrors: [], targetFailures: performance < 90 ? ['performance'] : [],
    files: { json: `after/home${attempt === 1 ? '' : '-attempt-' + attempt}.report.json` },
  };
}

test('median rejects missing or invalid values instead of silently ignoring them', () => {
  assert.equal(median([84, 98, 99]), 98);
  assert.equal(median([98, 84, 99]), 98);
  assert.equal(median([70, 560, 1204]), 560);
  assert.equal(median([]), null);
  assert.equal(median([99, null, 98]), null);
});

test('one noisy low performance sample does not fail a passing median', () => {
  const result = combineLighthouseAttempts([run(1,84,560),run(2,98,71),run(3,99,65)], targets);
  assert.equal(result.scores.performance, 98);
  assert.equal(result.metrics.tbtMs, 71);
  assert.equal(result.attemptCount, 3);
  assert.equal(result.attempts[0].scores.performance, 84);
  assert.equal(result.attempts[2].files.json, 'after/home-attempt-3.report.json');
  assert.equal(result.meetsLabTargets, true);
});

test('two measured failures still fail at the original 90-point target', () => {
  const result = combineLighthouseAttempts([run(1,74,1204),run(2,84,560),run(3,98,71)], targets);
  assert.equal(result.scores.performance, 84);
  assert.equal(result.meetsLabTargets, false);
  assert.deepEqual(result.targetFailures, ['performance: 84 (target 90)']);
});

test('LCP and SEO are gated independently, while preview noindex SEO is excluded', () => {
  const slow = combineLighthouseAttempts([run(1,98,70,2700),run(2,99,70,2600),run(3,99,70,2200)], targets);
  assert.ok(slow.targetFailures.some(v => v.includes('lcpMs: 2600')));
  const preview = { ...run(1), stage: 'preview', scores: { ...run(1).scores, seo: 0 } };
  assert.deepEqual(targetFailures(preview, targets), []);
});

test('unavailable navigation is not hidden by other good scores', () => {
  const missing = { ...run(2), status: 'unavailable', error: 'Chrome failed' };
  const result = combineLighthouseAttempts([run(1),missing,run(3)], targets);
  assert.equal(result.status, 'unavailable');
  assert.equal(result.meetsLabTargets, false);
  assert.ok(result.targetFailures.includes('measurement unavailable'));
});

test('audit errors remain surfaced even when the sampled median passes', () => {
  const bad = { ...run(1), auditErrors: [{ id: 'runtime', errorMessage: 'failed audit' }] };
  const result = combineLighthouseAttempts([bad,run(2),run(3)], targets);
  assert.equal(result.meetsLabTargets, false);
  assert.equal(result.auditErrors[0].attempt, 1);
});
