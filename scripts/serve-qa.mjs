// Local browser QA only. This server never calls an external delivery service.
// Build first, then: node scripts/serve-qa.mjs --port=4173 --contact=success
// Contact modes: success | failure | slow (two-second success for pending-state QA).
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { resolve, extname, sep } from 'node:path';

const options = Object.fromEntries(process.argv.slice(2).map(value => value.replace(/^--/, '').split('=')));
const root = resolve(options.root || 'out');
const port = Number(options.port || 4173);
const mode = options.contact || 'failure';
if (!['success', 'failure', 'slow'].includes(mode)) throw new Error('Use contact=success, failure, or slow');
const functionSource = await readFile(new URL('../functions/contact.js', import.meta.url), 'utf8');
const { handleContact } = await import(`data:text/javascript;base64,${Buffer.from(functionSource).toString('base64')}`);
const types = { '.html': 'text/html; charset=utf-8', '.js': 'application/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.json': 'application/json', '.txt': 'text/plain; charset=utf-8', '.svg': 'image/svg+xml', '.webp': 'image/webp', '.png': 'image/png', '.jpg': 'image/jpeg', '.ico': 'image/x-icon', '.woff2': 'font/woff2' };

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
    const bytes = await readFile(file);
    response.writeHead(200, { 'Content-Type': types[extname(file)] || 'application/octet-stream', 'Cache-Control': 'no-store', 'Content-Length': bytes.length });
    response.end(request.method === 'HEAD' ? undefined : bytes);
  } catch { response.writeHead(500); response.end('Local QA server error'); }
}).listen(port, '127.0.0.1', () => console.log(`Local QA: http://127.0.0.1:${port} | contact=${mode} | external delivery disabled`));
