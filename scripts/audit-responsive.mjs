// Official Lighthouse CLI navigation audits only; no standalone browser automation.
// Build first. --probe captures/guards home at 375px; --resume-probe completes the matrix.
// These unthrottled layout/accessibility runs must not be compared with mobile performance scores.
import { spawn, execFile } from 'node:child_process';
import { mkdir, readFile, writeFile, appendFile, copyFile } from 'node:fs/promises';
import { resolve, relative } from 'node:path';
import { promisify } from 'node:util';
import { setTimeout as delay } from 'node:timers/promises';

const execute = promisify(execFile);
const version = '12.8.2';
const origin = 'http://127.0.0.1:4176';
const output = resolve('docs/redesign-20261102/responsive-lighthouse');
const rawDirectory = resolve(output, 'raw');
const imageDirectory = resolve(output, 'screenshots');
const python = process.env.RESPONSIVE_IMAGE_PYTHON || (process.platform === 'linux' ? '/usr/bin/python3' : 'python');
const probeOnly = process.argv.includes('--probe');
const resumeProbe = process.argv.includes('--resume-probe');
const widths = [320, 375, 390, 768, 1024, 1440];
const height = 900;
const pages = [['home', '/'], ['sports-dx', '/sports-dx'], ['case-study', '/cases/ai-sports-trainer'], ['security', '/security'], ['privacy-policy', '/privacy-policy']];
const blocked = ['*://*/contact*', '*://hooks.slack.com/*', '*://*.google-analytics.com/*', '*://*.googletagmanager.com/*', '*://*.analytics.google.com/*'];
const npx = process.platform === 'win32' ? 'npx.cmd' : 'npx';
let server;
let serverLog = '';
let summary = {
  generatedAt: new Date().toISOString(),
  commit: process.env.GITHUB_SHA ?? null,
  runUrl: process.env.GITHUB_RUN_ID ? `https://github.com/${process.env.GITHUB_REPOSITORY}/actions/runs/${process.env.GITHUB_RUN_ID}` : null,
  lighthouseVersion: version, nodeVersion: process.version, platform: process.platform,
  conditions: {
    purpose: 'Responsive layout screenshot evidence and automated accessibility; navigation only',
    origin, widths, height, deviceScaleFactor: 1,
    mobileEmulation: 'true for 320/375/390/768; desktop preset with mobile=false for 1024/1440',
    throttlingMethod: 'provided', cpuSlowdownMultiplier: 1, artificialNetworkThrottling: false,
    categories: ['accessibility'], japaneseSystemFont: process.env.LIGHTHOUSE_CJK_FONT ?? null,
    delivery: 'Local production static export, gzip, no-store; contact delivery always mocked',
    noPerformanceComparison: 'No performance/CWV acceptance inference from these unthrottled accessibility runs',
    noManualEquivalence: 'No form interaction, keyboard sequence, real mobile OS, or screen-reader test is performed',
    overflow: 'documentElement.clientWidth and scrollWidth are not collected; screenshot dimensions alone do not prove absence of horizontal overflow',
    blockedUrlPatterns: blocked,
    references: ['https://github.com/GoogleChrome/lighthouse/blob/v12.8.2/readme.md', 'https://github.com/GoogleChrome/lighthouse/blob/v12.8.2/docs/emulation.md'],
  }, results: [],
};

await mkdir(rawDirectory, { recursive: true });
await mkdir(imageDirectory, { recursive: true });

async function saveSummary() {
  await writeFile(resolve(output, 'summary.json'), JSON.stringify(summary, null, 2) + '\n');
}

async function ready() {
  for (let attempt = 0; attempt < 40; attempt++) {
    if (server.exitCode !== null) throw new Error(`QA server exited ${server.exitCode}: ${serverLog}`);
    try { if ((await fetch(origin, { signal: AbortSignal.timeout(1000) })).ok) return; } catch { /* Own server still starting. */ }
    await delay(250);
  }
  throw new Error('Responsive QA server readiness timeout');
}

async function extractScreenshots(report, key, width) {
  const screen = report.configSettings?.screenEmulation;
  const mobile = width < 1024;
  if (!screen || screen.width !== width || screen.height !== height || screen.deviceScaleFactor !== 1 || screen.mobile !== mobile || screen.disabled) {
    throw new Error(`Viewport guard failed: requested ${width}x${height} DPR1 mobile=${mobile}; got ${JSON.stringify(screen)}`);
  }
  if (report.configSettings.throttlingMethod !== 'provided') throw new Error('Unexpected throttling method');
  const shot = report.fullPageScreenshot?.screenshot;
  if (!shot?.data || !Number.isFinite(shot.width) || shot.width <= 0 || shot.height < height) throw new Error('Full-page screenshot missing or dimensions inconsistent');
  const match = /^data:(image\/(?:webp|png|jpeg));base64,([\s\S]+)$/.exec(shot.data);
  if (!match) throw new Error('Unsupported Lighthouse screenshot data URI');
  const extension = { 'image/webp': 'webp', 'image/png': 'png', 'image/jpeg': 'jpg' }[match[1]];
  const fullPath = resolve(imageDirectory, `${key}-full.${extension}`);
  const viewportPath = resolve(imageDirectory, `${key}-viewport.png`);
  await writeFile(fullPath, Buffer.from(match[2], 'base64'));
  // Raster processing only: preserve the exact full-page bytes and crop its first 900 rows.
  // This does not connect to Chrome, run page JavaScript, or create/modify UI pixels.
  const program = [
    'import json,sys',
    'from PIL import Image, __version__',
    'source,destination,width,height=sys.argv[1:]',
    'width,height=int(width),int(height)',
    'image=Image.open(source)',
    'assert image.width == width, f"Encoded image width {image.width} != requested {width}"',
    'assert image.height >= height, f"Encoded image height {image.height} < viewport {height}"',
    'image.crop((0,0,width,height)).save(destination,"PNG")',
    'print(json.dumps({"fullImageWidth":image.width,"fullImageHeight":image.height,"viewportImageWidth":width,"viewportImageHeight":height,"pillowVersion":__version__}))',
  ].join('\n');
  const { stdout } = await execute(python, ['-c', program, fullPath, viewportPath, String(width), String(height)], { timeout: 30_000 });
  const dimensions = JSON.parse(stdout);
  if (dimensions.fullImageHeight !== shot.height) throw new Error('Encoded full-page height differs from Lighthouse screenshot metadata');
  return {
    ...dimensions, fullPage: relative(output, fullPath).replaceAll('\\', '/'), viewport: relative(output, viewportPath).replaceAll('\\', '/'),
    lighthouseScreenshotMetadataWidth: shot.width,
    metadataWidthDiffersFromEncodedImage: shot.width !== dimensions.fullImageWidth,
    crop: { x: 0, y: 0, width, height, method: 'Lossless PNG crop from original Lighthouse full-page screenshot, no resize' },
    documentClientWidth: null, documentScrollWidth: null, horizontalOverflowVerified: false,
  };
}

async function audit(name, pathname, width) {
  const key = `${width}-${name}`;
  const jsonPath = resolve(rawDirectory, `${key}.report.json`);
  const result = { page: name, pathname, requestedWidth: width, requestedHeight: height, requestedDpr: 1, status: 'unavailable' };
  const args = [
    '--yes', `lighthouse@${version}`, new URL(pathname, origin).href,
    ...(width >= 1024 ? ['--preset=desktop'] : []),
    `--form-factor=${width >= 1024 ? 'desktop' : 'mobile'}`,
    `--screenEmulation.mobile=${width < 1024}`, `--screenEmulation.width=${width}`, `--screenEmulation.height=${height}`, '--screenEmulation.deviceScaleFactor=1',
    '--throttling-method=provided', '--throttling.cpuSlowdownMultiplier=1', '--throttling.rttMs=0', '--throttling.throughputKbps=0', '--throttling.requestLatencyMs=0', '--throttling.downloadThroughputKbps=0', '--throttling.uploadThroughputKbps=0',
    '--only-categories=accessibility', '--output=json', `--output-path=${jsonPath}`,
    '--chrome-flags=--headless --disable-dev-shm-usage', '--no-enable-error-reporting', '--max-wait-for-load=45000',
    ...blocked.map(pattern => `--blocked-url-patterns=${pattern}`),
  ];
  console.log(`Responsive Lighthouse: ${width}px ${pathname}`);
  try {
    const { stdout, stderr } = await execute(npx, args, { timeout: 150_000, maxBuffer: 4 * 1024 * 1024, env: { ...process.env, CI: '1' } });
    await writeFile(resolve(rawDirectory, `${key}.log`), `${stdout}\n${stderr}`);
    const report = JSON.parse(await readFile(jsonPath, 'utf8'));
    if (report.runtimeError) throw new Error(`${report.runtimeError.code}: ${report.runtimeError.message}`);
    if (report.lighthouseVersion !== version) throw new Error(`Unexpected Lighthouse version ${report.lighthouseVersion}`);
    const screenshots = await extractScreenshots(report, key, width);
    Object.assign(result, {
      status: 'measured', fetchTime: report.fetchTime, requestedUrl: report.requestedUrl,
      actualViewport: report.configSettings.screenEmulation, userAgent: report.userAgent, environment: report.environment,
      accessibility: Math.round(report.categories.accessibility.score * 100), screenshots,
      failedAccessibilityAudits: report.categories.accessibility.auditRefs.map(ref => report.audits[ref.id]).filter(item => typeof item.score === 'number' && item.score < 1).map(item => ({ id: item.id, title: item.title, explanation: item.explanation, details: item.details })),
      auditErrors: Object.values(report.audits).filter(item => item.scoreDisplayMode === 'error' || item.errorMessage).map(item => ({ id: item.id, errorMessage: item.errorMessage })),
      warnings: report.runWarnings ?? [], reportFile: `raw/${key}.report.json`,
    });
  } catch (error) {
    result.error = error.message;
    if (error.stdout || error.stderr) await writeFile(resolve(rawDirectory, `${key}.log`), `${error.message}\n${error.stdout ?? ''}\n${error.stderr ?? ''}`);
  }
  summary.results.push(result);
  await saveSummary();
  console.log(JSON.stringify({ page: name, width, status: result.status, accessibility: result.accessibility, dimensions: result.screenshots, failedAudits: result.failedAccessibilityAudits?.map(item => item.id), auditErrors: result.auditErrors, error: result.error }));
  return result;
}

try {
  if (!process.env.LIGHTHOUSE_CJK_FONT) throw new Error('Set LIGHTHOUSE_CJK_FONT only after verifying installed Japanese fonts; refusing unrepresentative screenshots');
  if (resumeProbe) {
    const previous = JSON.parse(await readFile(resolve(output, 'summary.json'), 'utf8'));
    const first = previous.results?.[0];
    if (previous.commit !== summary.commit || previous.results.length !== 1 || first.page !== 'home' || first.requestedWidth !== 375 || first.status !== 'measured' || first.screenshots?.viewportImageWidth !== 375 || first.screenshots?.viewportImageHeight !== 900) throw new Error('Cannot resume: current-commit 375px probe is missing or invalid');
    summary = { ...previous, resumedAt: new Date().toISOString(), probeOnly: false };
  }
  summary.probeOnly = probeOnly;
  const help = await execute(npx, ['--yes', `lighthouse@${version}`, '--help'], { timeout: 60_000, maxBuffer: 2 * 1024 * 1024 });
  if (!help.stdout.includes('--screenEmulation') || !help.stdout.includes('--throttling-method')) throw new Error('Pinned CLI help did not expose required flags');
  await writeFile(resolve(output, 'lighthouse-help.txt'), help.stdout);
  await copyFile(resolve('docs/redesign-20261102/lighthouse/font-environment.txt'), resolve(output, 'font-environment.txt'));
  let occupied = false;
  try { await fetch(origin, { signal: AbortSignal.timeout(1000) }); occupied = true; } catch { /* Free port expected. */ }
  if (occupied) throw new Error('Port 4176 is in use; refusing to audit an unrelated service');
  server = spawn(process.execPath, ['scripts/serve-qa.mjs', '--port=4176', '--contact=failure', '--compress=gzip'], { stdio: ['ignore', 'pipe', 'pipe'] });
  summary.serverPid = server.pid;
  server.stdout.on('data', chunk => { serverLog += chunk; });
  server.stderr.on('data', chunk => { serverLog += chunk; });
  await ready();
  if (!resumeProbe) {
    const probe = await audit('home', '/', 375);
    if (probe.status !== 'measured') throw new Error(`375px first-run guard failed: ${probe.error}`);
  }
  if (!probeOnly) {
    for (const width of widths) for (const [name, pathname] of pages) {
      if (width === 375 && name === 'home') continue;
      await audit(name, pathname, width);
    }
  }
} catch (error) {
  summary.setupError = error.message;
  process.exitCode = 1;
} finally {
  if (server && server.exitCode === null) { server.kill('SIGTERM'); summary.serverStopRequested = true; }
  await writeFile(resolve(output, probeOnly ? 'server-probe.log' : 'server.log'), serverLog);
  summary.completedAt = new Date().toISOString();
  summary.expectedCount = probeOnly ? 1 : widths.length * pages.length;
  summary.allDimensionsVerified = summary.results.length === summary.expectedCount && summary.results.every(item => item.status === 'measured');
  summary.automatedAccessibilityTargetsMet = summary.allDimensionsVerified && summary.results.every(item => item.accessibility >= 95 && item.auditErrors.length === 0);
  await saveSummary();
  const zipProgram = 'import pathlib,sys,zipfile\np=pathlib.Path(sys.argv[1])\nwith zipfile.ZipFile(sys.argv[2],"w",zipfile.ZIP_DEFLATED) as z:\n for f in sorted(p.glob("*")):\n  if f.is_file(): z.write(f,"raw/"+f.name)';
  await execute(python, ['-c', zipProgram, rawDirectory, resolve(output, 'raw-reports.zip')], { timeout: 30_000 }).catch(error => { summary.archiveError = error.message; process.exitCode = 1; });
  await saveSummary();
  const rows = summary.results.map(item => `| ${item.requestedWidth} | ${item.pathname} | ${item.accessibility ?? '—'} | ${item.screenshots ? `${item.screenshots.fullImageWidth}×${item.screenshots.fullImageHeight}` : '—'} | ${item.status} | ${(item.failedAccessibilityAudits ?? []).map(audit => audit.id).join(', ') || item.error || '—'} |`);
  const markdown = ['## Responsive Lighthouse layout evidence', '', `Commit: ${summary.commit}; Japanese font: ${summary.conditions.japaneseSystemFont}; Lighthouse ${version}.`, '', 'Accessibility only, no artificial CPU/network throttling. Viewport height 900px, DPR1. No performance/CWV comparison, manual interaction, or real-device claim.', '', '| Width | Page | A | Full-page image pixels | Status | Failures |', '| ---: | --- | ---: | --- | --- | --- |', ...rows, '', '**Limit:** clientWidth/scrollWidth are unmeasured. Matching screenshot dimensions do not establish absence of horizontal overflow; inspect the actual screenshots and manual interaction results.', summary.setupError ? `\nSetup error: ${summary.setupError}` : ''].join('\n');
  await writeFile(resolve(output, 'summary.md'), markdown + '\n');
  if (process.env.GITHUB_STEP_SUMMARY) await appendFile(process.env.GITHUB_STEP_SUMMARY, markdown + '\n');
  console.log(markdown);
  if (!summary.allDimensionsVerified || (!probeOnly && !summary.automatedAccessibilityTargetsMet)) process.exitCode = 1;
}
