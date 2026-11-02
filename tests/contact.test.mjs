import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

// Load the Pages Function without changing this Next.js repository's module mode.
const source = await readFile(new URL('../functions/contact.js', import.meta.url), 'utf8');
const { handleContact, validateContact, buildSlackPayload, onRequest } = await import(`data:text/javascript;base64,${Buffer.from(source).toString('base64')}`);
const valid = { name: '検証用ユーザー', email: 'qa@example.com', company: '', budget: '', service: '', message: '動画分析の実現可能性について相談したいです。', privacy: true, website: '', source: 'home' };
const env = { SLACK_WEBHOOK_URL: 'https://hooks.slack.com/services/test-only/never-sent' };
const request = (body = valid, headers = {}, url = 'https://cyberknock.pages.dev/contact') => new Request(url, { method: 'POST', headers: { 'content-type': 'application/json', origin: new URL(url).origin, ...headers }, body: typeof body === 'string' ? body : JSON.stringify(body) });
function stub(status = 200, throws = false) {
  const calls = [];
  const fetch = async (...args) => { calls.push(args); if (throws) throw new Error('upstream credentials must never appear'); return new Response('ok', { status }); };
  return { calls, fetch };
}

test('valid minimum submission sends once to the existing environment destination', async () => {
  const upstream = stub();
  const response = await handleContact(request(), env, upstream.fetch);
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { ok: true });
  assert.equal(upstream.calls.length, 1);
  assert.equal(upstream.calls[0][0], env.SLACK_WEBHOOK_URL);
  assert.equal(response.headers.get('cache-control'), 'no-store');
  const payload = JSON.parse(upstream.calls[0][1].body);
  assert.match(payload.blocks[0].text.text, /qa@example.com/);
  assert.ok(payload.blocks.every(block => block.text.type === 'plain_text'));
});

test('optional budget can be undecided; email whitespace/fullwidth/domain are normalized', () => {
  const result = validateContact({ ...valid, email: ' ＱＡ＠ＥＸＡＭＰＬＥ．ＣＯＭ ', budget: 'undecided', service: 'sports-ai' });
  assert.equal(result.data.email, 'QA@example.com');
  assert.equal(result.data.budget, 'undecided');
});

test('blank mandatory values and missing consent cannot reach Slack', async () => {
  const upstream = stub();
  const response = await handleContact(request({ ...valid, name: ' ', email: 'bad', message: '', privacy: false }), env, upstream.fetch);
  assert.equal(response.status, 400);
  const body = await response.json();
  assert.deepEqual(Object.keys(body.errors).sort(), ['email', 'message', 'name', 'privacy']);
  assert.equal(upstream.calls.length, 0);
});

test('server rejects invalid optional values, objects, arrays, and field length violations', async () => {
  const upstream = stub();
  for (const body of [null, [], 'null', { ...valid, budget: 'anything' }, { ...valid, company: {} }, { ...valid, service: 'not-a-service' }, { ...valid, message: 'a'.repeat(5001) }, { ...valid, name: 'x'.repeat(101) }]) {
    assert.equal((await handleContact(request(body), env, upstream.fetch)).status, 400);
  }
  assert.equal(upstream.calls.length, 0);
});

test('malformed JSON is a controlled response without exception or outbound request', async () => {
  const upstream = stub();
  const response = await handleContact(request('{not JSON'), env, upstream.fetch);
  assert.equal(response.status, 400);
  assert.equal(upstream.calls.length, 0);
});

test('unexpected origin or cross-site browser request is rejected; preview same origin works', async () => {
  const upstream = stub();
  assert.equal((await handleContact(request(valid, { origin: 'https://evil.example' }), env, upstream.fetch)).status, 403);
  assert.equal((await handleContact(request(valid, { 'sec-fetch-site': 'cross-site' }), env, upstream.fetch)).status, 403);
  assert.equal((await handleContact(request(valid, {}, 'https://branch.cyberknock.pages.dev/contact'), env, upstream.fetch)).status, 200);
  assert.equal(upstream.calls.length, 1);
});

test('content type and streamed body limit are enforced before delivery', async () => {
  const upstream = stub();
  assert.equal((await handleContact(request(valid, { 'content-type': 'text/plain' }), env, upstream.fetch)).status, 415);
  assert.equal((await handleContact(request('a'.repeat(24001)), env, upstream.fetch)).status, 413);
  assert.equal((await handleContact(request(valid, { 'content-length': '24001' }), env, upstream.fetch)).status, 413);
  assert.equal(upstream.calls.length, 0);
});

test('filled honeypot is discarded without notifying anyone', async () => {
  const upstream = stub();
  assert.equal((await handleContact(request({ ...valid, website: 'https://spam.example' }), env, upstream.fetch)).status, 200);
  assert.equal(upstream.calls.length, 0);
});

test('long Japanese messages remain under Slack block limits and literal mentions stay plain text', () => {
  const data = validateContact({ ...valid, message: '<!channel> <@U123> <https://evil.example|link> ' + 'あ'.repeat(4900) }).data;
  const payload = buildSlackPayload(data);
  assert.ok(payload.blocks.every(block => Array.from(block.text.text).length <= 3000));
  assert.ok(payload.blocks.every(block => block.text.type === 'plain_text'));
  assert.ok(!payload.text.includes('<!channel>'));
  assert.equal(payload.unfurl_links, false);
});

test('missing delivery configuration is visible as failure, never a fake success', async () => {
  const upstream = stub();
  const response = await handleContact(request(), {}, upstream.fetch);
  assert.equal(response.status, 503);
  assert.equal((await response.json()).ok, false);
  assert.equal(upstream.calls.length, 0);
});

test('upstream failure and network exception do not expose service errors or secrets', async () => {
  for (const upstream of [stub(500), stub(200, true)]) {
    const response = await handleContact(request(), env, upstream.fetch);
    assert.equal(response.status, 502);
    const body = await response.text();
    assert.ok(!body.includes('upstream'));
    assert.ok(!body.includes('hooks.slack.com'));
    assert.ok(!body.includes('qa@example.com'));
    assert.equal(upstream.calls.length, 1);
  }
});

test('non-POST method is rejected by the Cloudflare entry point', async () => {
  const response = await onRequest({ request: new Request('https://cyberknock.pages.dev/contact'), env });
  assert.equal(response.status, 405);
  assert.equal(response.headers.get('allow'), 'POST');
});
