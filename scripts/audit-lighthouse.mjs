// Navigation-only Lighthouse audits. No form submission, GA API, or external delivery.
// Pinned official CLI: https://github.com/GoogleChrome/lighthouse/releases/tag/v12.8.2
// Build first: npm run check; then: node scripts/audit-lighthouse.mjs [--enforce] [--stage=all|before|after|preview|after-preview]
// Preview runs also require --preview-origin=https://<deployment>.cyberknock.pages.dev
import { spawn, execFile } from 'node:child_process';
import { mkdir, readFile, writeFile, appendFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { promisify } from 'node:util';
import { setTimeout as delay } from 'node:timers/promises';
import { combineLighthouseAttempts } from './lighthouse-stats.mjs';

const execute = promisify(execFile);
const version = '12.8.2';
const output = resolve('docs/redesign-20261102/lighthouse');
const localOrigin = 'http://127.0.0.1:4173';
const publicOrigin = 'https://cyberknock.jp';
const enforce = process.argv.includes('--enforce');
const options = Object.fromEntries(process.argv.slice(2).filter(value => value.includes('=')).map(value => {
  const delimiter = value.indexOf('=');
  return [value.slice(2, delimiter), value.slice(delimiter + 1)];
}));
const stageOptions = { all: ['before', 'after'], before: ['before'], after: ['after'], preview: ['preview'], 'after-preview': ['after', 'preview'] };
const stages = stageOptions[options.stage || 'all'];
if (!stages) throw new Error('Use --stage=all, before, after, preview, or after-preview.');
let previewOrigin = null;
if (stages.includes('preview')) {
  const preview = new URL(options['preview-origin'] || 'missing-preview-origin');
  if (preview.protocol !== 'https:' || !/^[a-z0-9-]+\.cyberknock\.pages\.dev$/.test(preview.hostname) || preview.port || preview.username || preview.password || preview.pathname !== '/' || preview.search || preview.hash) {
    throw new Error('Preview origin must be an HTTPS Cyber Knock Cloudflare Pages deployment origin.');
  }
  previewOrigin = preview.origin;
}
const pages = [
  ['home', '/'],
  ['sports-dx', '/sports-dx'],
  ['case-study', '/cases/ai-sports-trainer'],
  ['security', '/security'],
  ['privacy-policy', '/privacy-policy'],
];
const targets = { performance: 90, accessibility: 95, 'best-practices': 95, seo: 95, lcpMs: 2500, cls: 0.1 };
const blocked = [
  '*://*/contact*',
  '*://hooks.slack.com/*',
  '*://*.google-analytics.com/*',
  '*://*.googletagmanager.com/*',
  '*://*.analytics.google.com/*',
];
const summary = {
  generatedAt: new Date().toISOString(),
  commit: process.env.GITHUB_SHA ?? null,
  runUrl: process.env.GITHUB_RUN_ID ? `https://github.com/${process.env.GITHUB_REPOSITORY}/actions/runs/${process.env.GITHUB_RUN_ID}` : null,
  lighthouseVersion: version,
  nodeVersion: process.version,
  platform: process.platform,
  runsPerPage: {
    baseline: 1, gatedHome: 3, gatedIfInitialFailure: 3,
    strategy: 'Per-metric median. All raw attempts are retained.',
  },
  requestedStages: stages,
  conditions: {
    formFactor: 'mobile',
    throttlingMethod: 'simulate',
    settings: 'Lighthouse pinned-version default mobile CPU, network, screen emulation, and storage reset',
    japaneseSystemFont: process.env.LIGHTHOUSE_CJK_FONT ?? 'Not recorded by this runner; inspect final screenshot before accepting Japanese UI measurements',
    fontEnvironmentFile: process.env.LIGHTHOUSE_CJK_FONT ? 'font-environment.txt' : null,
    beforeOrigin: publicOrigin,
    afterOrigin: localOrigin,
    beforeDelivery: 'Public Cloudflare Pages deployment at audit time',
    afterDelivery: 'Production static export served locally over HTTP/1.1 with gzip text compression and no-store response headers',
    previewOrigin,
    previewDelivery: previewOrigin ? 'Observed Cloudflare Pages preview; record this immutable deployment URL with its commit separately' : null,
    previewSeo: 'Preview SEO scores are reported but excluded from threshold gates because Cloudflare preview deployments may intentionally return X-Robots-Tag: noindex.',
    deliveryComparable: false,
    limitation: 'Same runner, Chrome, Lighthouse, and emulation; CDN/HTTPS/network/cache conditions differ. This is not a controlled production speed experiment.',
    blockedUrlPatterns: blocked,
    fieldData: 'Not collected. LCP and CLS below are lab measurements; navigation audits do not establish field INP or 75th-percentile Core Web Vitals.',
    accessibility: 'Automated audit only; passing scores do not establish full WCAG 2.2 AA conformance.',
    baseline: 'Before means the live site at audit time; preserve this artifact before a production release changes that site.',
  },
  targets,
  results: [],
};

await mkdir(output, { recursive: true });
let server;
let serverLog = '';

function metric(report, id) {
  const value = report.audits?.[id]?.numericValue;
  return typeof value === 'number' && Number.isFinite(value) ? value : null;
}

function targetFailures(result) {
  if (result.status !== 'measured') return ['measurement unavailable'];
  const failures = [];
  for (const [key, value] of Object.entries(targets)) {
    if (result.stage === 'preview' && key === 'seo') continue;
    const actual = key === 'lcpMs' || key === 'cls' ? result.metrics[key] : result.scores[key];
    if (actual === null || actual === undefined) failures.push(`${key}: not measured`);
    else if (key === 'lcpMs' || key === 'cls' ? actual > value : actual < value) failures.push(`${key}: ${actual} (target ${value})`);
  }
  return failures;
}

async function waitForServer() {
  for (let attempt = 0; attempt < 40; attempt += 1) {
    if (server.exitCode !== null) throw new Error(`Local QA server exited with ${server.exitCode}: ${serverLog}`);
    try {
      const response = await fetch(localOrigin, { signal: AbortSignal.timeout(1000) });
      if (response.ok) return;
    } catch { /* Wait for this script's QA server to start. */ }
    await delay(250);
  }
  throw new Error('Local QA server did not become ready within 10 seconds.');
}

async function audit(stage, name, pathname, origin, attempt = 1) {
  const directory = resolve(output, stage);
  await mkdir(directory, { recursive: true });
  const prefix = resolve(directory, attempt === 1 ? name : name + '-attempt-' + attempt);
  const url = new URL(pathname, origin).href;
  const result = { stage, page: name, pathname, requestedUrl: url, attempt, status: 'unavailable' };
  const args = [
    '--yes', `lighthouse@${version}`, url,
    '--output=json', '--output=html', `--output-path=${prefix}`,
    '--form-factor=mobile', '--throttling-method=simulate',
    '--chrome-flags=--headless --disable-dev-shm-usage',
    '--only-categories=performance,accessibility,best-practices,seo',
    '--no-enable-error-reporting', '--max-wait-for-load=45000',
    ...blocked.map(pattern => `--blocked-url-patterns=${pattern}`),
  ];
  console.log(`Lighthouse ${stage}: ${url}`);
  let cliFailure;
  try {
    const { stdout, stderr } = await execute(process.platform === 'win32' ? 'npx.cmd' : 'npx', args, {
      timeout: 150_000,
      maxBuffer: 4 * 1024 * 1024,
      env: { ...process.env, CI: '1' },
    });
    await writeFile(`${prefix}.log`, `${stdout}\n${stderr}`, 'utf8');
  } catch (error) {
    cliFailure = error.message;
    await writeFile(`${prefix}.log`, `${error.message}\n${error.stdout ?? ''}\n${error.stderr ?? ''}`, 'utf8');
  }
  try {
    const report = JSON.parse(await readFile(`${prefix}.report.json`, 'utf8'));
    if (report.runtimeError) throw new Error(`${report.runtimeError.code}: ${report.runtimeError.message}`);
    if (cliFailure) throw new Error(cliFailure);
    if (report.lighthouseVersion !== version) throw new Error(`Unexpected Lighthouse version ${report.lighthouseVersion}`);
    Object.assign(result, {
      status: 'measured',
      fetchTime: report.fetchTime,
      finalDisplayedUrl: report.finalDisplayedUrl ?? report.finalUrl,
      userAgent: report.userAgent,
      environment: report.environment,
      configSettings: report.configSettings,
      scores: Object.fromEntries(['performance', 'accessibility', 'best-practices', 'seo'].map(key => [key, typeof report.categories?.[key]?.score === 'number' ? Math.round(report.categories[key].score * 100) : null])),
      metrics: {
        lcpMs: metric(report, 'largest-contentful-paint'),
        cls: metric(report, 'cumulative-layout-shift'),
        tbtMs: metric(report, 'total-blocking-time'),
        fcpMs: metric(report, 'first-contentful-paint'),
        inpMs: null,
      },
      warnings: report.runWarnings ?? [],
      auditErrors: Object.values(report.audits ?? {}).filter(item => item.scoreDisplayMode === 'error' || item.errorMessage).map(item => ({ id: item.id, title: item.title, errorMessage: item.errorMessage, explanation: item.explanation })),
      failedAudits: Object.values(report.audits ?? {}).filter(item => item.score !== null && item.score < 1 && !['manual', 'notApplicable', 'informative'].includes(item.scoreDisplayMode)).map(item => ({ id: item.id, title: item.title, score: item.score, displayValue: item.displayValue, explanation: item.explanation })),
      files: { json: `${stage}/${name}.report.json`, html: `${stage}/${name}.report.html`, log: `${stage}/${name}.log` },
    });
  } catch (error) { result.error = error.message; }
  result.targetFailures = targetFailures(result);
  result.meetsLabTargets = result.targetFailures.length === 0;
  summary.results.push(result);
  await writeFile(resolve(output, 'summary.json'), JSON.stringify(summary, null, 2) + '\n');
  console.log(JSON.stringify({ stage, page: name, status: result.status, scores: result.scores, metrics: result.metrics, auditErrors: result.auditErrors, targetFailures: result.targetFailures, error: result.error }));
}

try {
  if (stages.includes('after')) {
    // Fail rather than accidentally auditing an unrelated service on the selected port.
    let occupied = false;
    try { await fetch(localOrigin, { signal: AbortSignal.timeout(1000) }); occupied = true; } catch { /* Free port expected. */ }
    if (occupied) throw new Error('Port 4173 is already serving a site; stop it before running this audit.');
    server = spawn(process.execPath, ['scripts/serve-qa.mjs', '--port=4173', '--contact=failure', '--compress=gzip'], { stdio: ['ignore', 'pipe', 'pipe'] });
    server.stdout.on('data', chunk => { serverLog += chunk; });
    server.stderr.on('data', chunk => { serverLog += chunk; });
    await waitForServer();
  }
  // Sequential measurements avoid competition between Lighthouse Chrome processes.
  // The fluctuating homepage is always sampled 3 times in gated stages.
  // Other gated pages are sampled 3 times only if the first run fails.
  // Thresholds are unchanged. Each original CLI report and score is retained.
  for (const [name, pathname] of pages) {
    for (const stage of stages) {
      const origin = stage === 'before' ? publicOrigin : stage === 'after' ? localOrigin : previewOrigin;
      const attempts = [];
      await audit(stage, name, pathname, origin, 1);
      attempts.push(summary.results.pop());
      if (stage !== 'before' && (name === 'home' || !attempts[0].meetsLabTargets)) {
        for (const attempt of [2, 3]) {
          await audit(stage, name, pathname, origin, attempt);
          attempts.push(summary.results.pop());
        }
      }
      const combined = combineLighthouseAttempts(attempts, targets);
      summary.results.push(combined);
      console.log(JSON.stringify({
        stage, page: name, attemptCount: combined.attemptCount,
        scoreSamples: attempts.map(item => item.scores?.performance ?? null),
        tbtSamples: attempts.map(item => item.metrics?.tbtMs ?? null),
        medianScore: combined.scores?.performance,
        medianTbtMs: combined.metrics?.tbtMs,
        targetFailures: combined.targetFailures,
      }));
    }
  }
} catch (error) {
  summary.setupError = error.message;
  process.exitCode = 1;
} finally {
  if (server && server.exitCode === null) server.kill('SIGTERM');
  await writeFile(resolve(output, 'server.log'), serverLog);
  summary.completedAt = new Date().toISOString();
  summary.stageLabTargetsMet = Object.fromEntries(stages.map(stage => {
    const results = summary.results.filter(item => item.stage === stage);
    return [stage, results.length === pages.length && results.every(item => item.meetsLabTargets)];
  }));
  summary.afterLabTargetsMet = summary.stageLabTargetsMet.after ?? null;
  await writeFile(resolve(output, 'summary.json'), JSON.stringify(summary, null, 2) + '\n');
  const cell = value => value === null || value === undefined ? '—' : String(value);
  const rows = summary.results.map(item => `| ${item.stage} | ${item.pathname} | ${cell(item.scores?.performance)} | ${cell(item.scores?.accessibility)} | ${cell(item.scores?.['best-practices'])} | ${cell(item.scores?.seo)} | ${item.metrics?.lcpMs == null ? '—' : (item.metrics.lcpMs / 1000).toFixed(2)} | ${item.metrics?.cls == null ? '—' : item.metrics.cls.toFixed(3)} | ${cell(item.auditErrors?.length)} | ${item.status === 'measured' ? item.meetsLabTargets ? 'Pass' : 'Below target' : 'Unavailable'} |`);
  const markdown = [
    '## Cyber Knock — Lighthouse mobile lab audit',
    '',
    `Lighthouse ${version}; Node ${process.version}; baseline uses one navigation; gated home and initially failing gated pages use 3 with per-metric medians. All raw reports are saved. See artifact summary.json for exact settings.`,
    '',
    '| Stage | Page | Performance | Accessibility | Best Practices | SEO | LCP (s, lab) | CLS (lab) | Audit errors | Lab targets |',
    '| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | --- |',
    ...rows,
    '',
    '#### Repeated navigation samples (same page and stage; median used for gates)',
    ...summary.results.filter(item => item.attemptCount > 1).map(item =>
      '- ' + item.stage + ' ' + item.pathname +
      ': Performance = [' + item.attempts.map(a => a.scores?.performance ?? 'unavailable').join(', ') +
      '], TBT ms = [' + item.attempts.map(a => a.metrics?.tbtMs == null ? 'unavailable' : Math.round(a.metrics.tbtMs)).join(', ') +
      '], median Performance = ' + item.scores?.performance +
      ', median TBT = ' + item.metrics?.tbtMs +
      ', pass = ' + item.meetsLabTargets),
    '',
    '**Measurement limits:** Before is the public Cloudflare site; after is the local production export. Same runner/tool/emulation, different delivery and caching. These are lab results, not field Core Web Vitals or proof of conversion improvement. Repeat scores are medians with all attempts preserved. INP and field 75th percentiles are unmeasured. Automated accessibility scores do not establish WCAG conformance.',
    'After uses gzip for compressible text. Preview runs use the recorded Cloudflare deployment origin; preview SEO is reported but not gated because noindex is expected for preview deployments. Any individual audit errors are listed in summary.json; a numeric category score does not mean every audit completed.',
    '',
    'No form submission is performed. Contact delivery and analytics endpoints are blocked; no GA API is called. The local server uses an injected failure response and never delivers to Slack.',
    summary.setupError ? `\nSetup error: ${summary.setupError}\n` : '',
  ].join('\n');
  await writeFile(resolve(output, 'summary.md'), markdown + '\n');
  if (process.env.GITHUB_STEP_SUMMARY) await appendFile(process.env.GITHUB_STEP_SUMMARY, markdown + '\n');
  console.log(markdown);
  const gatedStages = stages.filter(stage => stage !== 'before');
  if (summary.results.some(item => item.status !== 'measured') || summary.results.length !== pages.length * stages.length || (enforce && gatedStages.some(stage => !summary.stageLabTargetsMet[stage]))) process.exitCode = 1;
}
