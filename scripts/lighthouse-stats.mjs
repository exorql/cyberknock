/**
 * Pure, deterministic Lighthouse statistics.
 * Median is used only for navigations of the *same* page and stage.
 * Raw per-attempt scores and reports must remain available.
 */
export function median(values) {
  if (!Array.isArray(values) || values.length === 0 || values.some(value => typeof value !== 'number' || !Number.isFinite(value))) return null;
  const sorted = [...values].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[middle] : (sorted[middle - 1] + sorted[middle]) / 2;
}

export function targetFailures(result, targets) {
  if (result.status !== 'measured') return ['measurement unavailable'];
  const failures = [];
  for (const [key, value] of Object.entries(targets)) {
    if (result.stage === 'preview' && key === 'seo') continue;
    const actual = key === 'lcpMs' || key === 'cls' ? result.metrics?.[key] : result.scores?.[key];
    if (actual === null || actual === undefined) failures.push(`${key}: not measured`);
    else if (key === 'lcpMs' || key === 'cls' ? actual > value : actual < value) failures.push(`${key}: ${actual} (target ${value})`);
  }
  return failures;
}

export function combineLighthouseAttempts(attempts, targets) {
  if (!Array.isArray(attempts) || !attempts.length) throw new Error('At least one Lighthouse attempt is required');
  const first = attempts[0];
  if (attempts.some(item => item.stage !== first.stage || item.page !== first.page || item.pathname !== first.pathname)) {
    throw new Error('Cannot combine different pages or stages');
  }
  const out = {
    ...first,
    attemptCount: attempts.length,
    aggregation: attempts.length === 1 ? 'single navigation' : 'per-metric median across independent navigations',
    attempts: attempts.map(item => ({
      attempt: item.attempt, status: item.status, fetchTime: item.fetchTime,
      scores: item.scores, metrics: item.metrics, targetFailures: item.targetFailures,
      error: item.error, auditErrors: item.auditErrors, files: item.files,
    })),
  };

  // One missing/invalid navigation cannot be silently treated as a passing run.
  if (attempts.some(item => item.status !== 'measured')) {
    out.status = 'unavailable';
    out.error = 'At least one Lighthouse navigation was unavailable; inspect saved per-attempt logs';
    out.targetFailures = targetFailures(out, targets);
    out.meetsLabTargets = false;
    return out;
  }

  if (attempts.length > 1) {
    out.scores = Object.fromEntries(Object.keys(first.scores).map(key =>
      [key, median(attempts.map(item => item.scores?.[key]))]));
    out.metrics = Object.fromEntries(Object.keys(first.metrics).map(key =>
      [key, median(attempts.map(item => item.metrics?.[key]))]));
    // Preserve errors across all runs; never present an error as a clean median.
    out.auditErrors = attempts.flatMap(item =>
      (item.auditErrors || []).map(error => ({ ...error, attempt: item.attempt })));
  }
  out.targetFailures = targetFailures(out, targets);
  if (out.auditErrors?.length) out.targetFailures.push(`audit errors in ${out.auditErrors.length} recorded attempts`);
  out.meetsLabTargets = out.targetFailures.length === 0;
  return out;
}
