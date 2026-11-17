// Temporary lab measurement for /ai-development. Usage:
// node ck-lh.mjs <repoRoot> <exportRoot> <label> <port> [runs]
import { spawn, execFile } from 'node:child_process';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { promisify } from 'node:util';
import { setTimeout as delay } from 'node:timers/promises';
const run = promisify(execFile);
const [repo, root, label, port = '4174', runsArg = '3'] = process.argv.slice(2);
const runs = Number(runsArg);
const outDir = resolve(import.meta.dirname, label);
await mkdir(outDir, { recursive: true });
const server = spawn(process.execPath, [resolve(repo, 'scripts/serve-qa.mjs'), `--root=${root}`, `--port=${port}`, '--contact=failure', '--compress=gzip'], { cwd: repo, stdio: 'ignore' });
const origin = `http://127.0.0.1:${port}`;
for (let i = 0; i < 40; i++) { try { if ((await fetch(origin)).ok) break; } catch {} await delay(250); }
const results = [];
try {
  for (const preset of ['mobile', 'desktop']) {
    for (let i = 1; i <= runs; i++) {
      const prefix = resolve(outDir, `${preset}-${i}`);
      const args = ['--yes', 'lighthouse@12.8.2', `${origin}/ai-development`, '--output=json', `--output-path=${prefix}.json`,
        '--only-categories=performance,accessibility,best-practices,seo', '--chrome-flags=--headless=new', '--quiet',
        '--blocked-url-patterns=*://*.googletagmanager.com/*', '--blocked-url-patterns=*://*.google-analytics.com/*'];
      if (preset === 'desktop') args.push('--preset=desktop'); else args.push('--form-factor=mobile', '--throttling-method=simulate');
      try { await run('npx.cmd', args, { timeout: 180000, maxBuffer: 8 << 20, shell: true }); } catch (e) { console.error(e.message.slice(0, 400)); }
      const r = JSON.parse(await readFile(`${prefix}.json`, 'utf8'));
      const items = r.audits['network-requests']?.details?.items ?? [];
      const media = items.filter(x => /videos\//.test(x.url)).map(x => ({ url: x.url.replace(origin, ''), bytes: x.transferSize }));
      const row = {
        preset, run: i,
        perf: Math.round(r.categories.performance.score * 100),
        a11y: Math.round(r.categories.accessibility.score * 100),
        bp: Math.round(r.categories['best-practices'].score * 100),
        seo: Math.round(r.categories.seo.score * 100),
        lcpMs: Math.round(r.audits['largest-contentful-paint'].numericValue),
        cls: Number(r.audits['cumulative-layout-shift'].numericValue.toFixed(4)),
        tbtMs: Math.round(r.audits['total-blocking-time'].numericValue),
        fcpMs: Math.round(r.audits['first-contentful-paint'].numericValue),
        totalBytes: r.audits['total-byte-weight'].numericValue,
        requests: items.length,
        videoAssetsLoaded: media,
        lcpElement: r.audits['largest-contentful-paint-element']?.details?.items?.[0]?.items?.[0]?.node?.snippet ?? null,
        failedA11y: Object.values(r.audits).filter(a => a.score === 0 && r.categories.accessibility.auditRefs.some(ref => ref.id === a.id)).map(a => a.id),
      };
      results.push(row);
      console.log(JSON.stringify(row));
    }
  }
} finally { server.kill(); }
await writeFile(resolve(outDir, 'summary.json'), JSON.stringify({ label, measuredAt: new Date().toISOString(), lighthouse: '12.8.2', delivery: 'local static export via scripts/serve-qa.mjs (gzip, no-store)', results }, null, 2));
