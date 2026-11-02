// Local browser QA only. This server never calls an external delivery service.
// Build first, then: node scripts/serve-qa.mjs --port=4173 --contact=success
// Contact modes: success | failure | slow (two-second success for pending-state QA).
// Optional --analytics=mock adds a local-only gtag inspector; the default is none.
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { resolve, extname, sep } from 'node:path';
import { gzipSync } from 'node:zlib';

const options = Object.fromEntries(process.argv.slice(2).map(value => value.replace(/^--/, '').split('=')));
const root = resolve(options.root || 'out');
const port = Number(options.port || 4173);
const mode = options.contact || 'failure';
const compression = options.compress || 'none';
const analytics = options.analytics || 'none';
if (!['success', 'failure', 'slow'].includes(mode)) throw new Error('Use contact=success, failure, or slow');
if (!['none', 'gzip'].includes(compression)) throw new Error('Use compress=none or gzip');
if (!['none', 'mock'].includes(analytics)) throw new Error('Use analytics=none or mock');
const functionSource = await readFile(new URL('../functions/contact.js', import.meta.url), 'utf8');
const { handleContact } = await import(`data:text/javascript;base64,${Buffer.from(functionSource).toString('base64')}`);
const types = { '.html': 'text/html; charset=utf-8', '.js': 'application/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.json': 'application/json', '.txt': 'text/plain; charset=utf-8', '.xml': 'application/xml', '.svg': 'image/svg+xml', '.webp': 'image/webp', '.png': 'image/png', '.jpg': 'image/jpeg', '.ico': 'image/x-icon', '.woff2': 'font/woff2' };
const compressible = new Set(['.html', '.js', '.css', '.json', '.txt', '.xml', '.svg']);

// Serialized into QA HTML only. It records the exact gtag arguments as text,
// without filtering away mistakes, making requests, or persisting any data.
function installMockAnalytics() {
  const events = [];
  let inspector;
  let log;
  let count;

  function appendEntry(entry, index) {
    const item = document.createElement('li');
    item.dataset.eventIndex = String(index + 1);
    item.dataset.eventName = entry.name;
    const content = document.createElement('pre');
    content.style.cssText = 'white-space:pre-wrap;overflow-wrap:anywhere;margin:8px 0 16px';
    content.textContent = entry.json;
    item.append(content);
    log.append(item);
    inspector.dataset.eventCount = String(events.length);
    count.textContent = String(events.length);
  }

  function mountInspector() {
    if (inspector?.isConnected || !document.body) return;
    inspector = document.createElement('details');
    inspector.id = 'qa-analytics';
    inspector.open = true;
    inspector.dataset.analyticsMode = 'mock';
    inspector.dataset.eventCount = String(events.length);
    inspector.style.cssText = 'box-sizing:border-box;margin:24px;padding:16px;border:1px solid #82948c;background:#fffefa;color:#192b2b;font:13px/1.6 ui-monospace,monospace;overflow-wrap:anywhere';
    const heading = document.createElement('summary');
    heading.style.cssText = 'cursor:pointer;font-weight:700';
    heading.textContent = 'ローカル検証用イベント（外部送信なし）';
    count = document.createElement('output');
    count.id = 'qa-analytics-count';
    count.textContent = String(events.length);
    count.setAttribute('aria-live', 'polite');
    heading.append(' / ', count, '件');
    const note = document.createElement('p');
    note.textContent = 'このページ内のメモリにだけ記録します。再読み込みで消去されます。合成テストデータのみを使用してください。';
    log = document.createElement('ol');
    log.id = 'qa-analytics-log';
    log.style.cssText = 'padding-left:24px;margin:12px 0 0';
    log.setAttribute('aria-label', '計測イベント引数');
    inspector.append(heading, note, log);
    events.forEach(appendEntry);
    document.body.append(inspector);
  }

  window.gtag = (...args) => {
    const entry = { name: typeof args[1] === 'string' ? args[1] : 'unknown', json: JSON.stringify(args, null, 2) };
    events.push(entry);
    if (log?.isConnected) appendEntry(entry, events.length - 1);
    else if (document.readyState === 'complete') mountInspector();
  };

  // Collect early effects immediately, but add the inspector after document load
  // so the initial application markup is left intact during normal hydration.
  function afterDomReady() {
    if (document.readyState === 'complete') window.setTimeout(mountInspector, 0);
    else window.addEventListener('load', () => window.setTimeout(mountInspector, 0), { once: true });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', afterDomReady, { once: true });
  else afterDomReady();
}

const analyticsMockScript = `<script data-qa-analytics="mock">(${installMockAnalytics.toString()})();</script>`;

function acceptsGzip(value = '') {
  const encodings = String(value).toLowerCase().split(',').map(part => {
    const [name, ...parameters] = part.trim().split(';');
    const quality = parameters.map(item => item.trim()).find(item => item.startsWith('q='));
    return { name: name.trim(), quality: quality ? Number(quality.slice(2)) : 1 };
  });
  const encoding = encodings.find(item => item.name === 'gzip') ?? encodings.find(item => item.name === '*');
  return !!encoding && Number.isFinite(encoding.quality) && encoding.quality > 0;
}

createServer(async (request, response) => {
  const url = new URL(request.url, `http://127.0.0.1:${port}`);
  try {
    if (url.pathname === '/contact' && request.method === 'POST') {
      const chunks = [];
      let length = 0;
      for await (const chunk of request) {
        length += chunk.length;
        if (length > 24_000) { response.writeHead(413, { 'Content-Type': 'application/json' }); response.end('{"ok":false}'); return; }
        chunks.push(chunk);
      }
      const headers = new Headers();
      for (const [name, value] of Object.entries(request.headers)) if (typeof value === 'string') headers.set(name, value);
      const host = request.headers.host || `127.0.0.1:${port}`;
      const input = new Request(`http://${host}/contact`, { method: 'POST', headers, body: Buffer.concat(chunks) });
      const result = await handleContact(input, { SLACK_WEBHOOK_URL: 'https://hooks.slack.com/services/local-qa-only' }, async () => {
        if (mode === 'slow') await new Promise(done => setTimeout(done, 2000));
        return new Response(mode === 'failure' ? 'simulated failure' : 'ok', { status: mode === 'failure' ? 500 : 200 });
      });
      response.writeHead(result.status, Object.fromEntries(result.headers));
      response.end(await result.text());
      return;
    }
    if (request.method !== 'GET' && request.method !== 'HEAD') { response.writeHead(405); response.end(); return; }
    const pathname = decodeURIComponent(url.pathname);
    const base = resolve(root, `.${pathname}`);
    if (base !== root && !base.startsWith(root + sep)) { response.writeHead(403); response.end(); return; }
    const candidates = pathname.endsWith('/') ? [resolve(base, 'index.html')] : [base, base + '.html', resolve(base, 'index.html')];
    let file;
    for (const candidate of candidates) {
      if (await stat(candidate).then(info => info.isFile()).catch(() => false)) { file = candidate; break; }
    }
    if (!file) { response.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' }); response.end('Not found'); return; }
    let bytes = await readFile(file);
    const extension = extname(file);
    if (analytics === 'mock' && extension === '.html') {
      bytes = Buffer.from(bytes.toString('utf8').replace(/<head(?:\s[^>]*)?>/i, head => head + analyticsMockScript));
    }
    const canCompress = compression === 'gzip' && compressible.has(extension) && bytes.length >= 1024;
    const compressed = canCompress && acceptsGzip(request.headers['accept-encoding']);
    const body = compressed ? gzipSync(bytes) : bytes;
    response.writeHead(200, {
      'Content-Type': types[extension] || 'application/octet-stream',
      'Cache-Control': 'no-store',
      'Content-Length': body.length,
      ...(canCompress ? { Vary: 'Accept-Encoding' } : {}),
      ...(compressed ? { 'Content-Encoding': 'gzip' } : {}),
    });
    response.end(request.method === 'HEAD' ? undefined : body);
  } catch { response.writeHead(500); response.end('Local QA server error'); }
}).listen(port, '127.0.0.1', () => console.log(`Local QA: http://127.0.0.1:${port} | contact=${mode} | compression=${compression} | analytics=${analytics} | external delivery disabled`));
