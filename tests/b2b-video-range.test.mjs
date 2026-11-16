import assert from "node:assert/strict";
import test from "node:test";
import { onRequest } from "../functions/videos/[filename].js";

const DATA = Uint8Array.from({ length: 16 }, (_, index) => index);
const VIDEO = "https://example.test/videos/cyberknock-b2b-ai-demo-25s-web.mp4";

function setup({url = VIDEO, method = "GET", range, ifRange} = {}) {
  const headers = new Headers();
  if (range) headers.set("Range", range);
  if (ifRange) headers.set("If-Range", ifRange);
  const request = new Request(url, {method, headers});
  const fetches = [];
  const env = {ASSETS: {async fetch(sourceRequest) {
    fetches.push(sourceRequest);
    return new Response(sourceRequest.method === "HEAD" ? null : DATA, {
      status: 200,
      headers: {
        "Content-Type": "video/mp4",
        "Content-Length": String(DATA.byteLength),
        "ETag": '"fixture-etag"',
      },
    });
  }}};
  return {request, env, fetches};
}

test("Cloudflare MP4 video responds as a full playable 200 when no Range is requested", async () => {
  const context = setup();
  const response = await onRequest(context);
  assert.equal(response.status, 200);
  assert.equal(response.headers.get("Accept-Ranges"), "bytes");
  assert.deepEqual(new Uint8Array(await response.arrayBuffer()), DATA);
  assert.equal(context.fetches.length, 1);
});

test("Cloudflare MP4 video provides Safari's initial bytes=0-1 as a 206", async () => {
  const context = setup({range: "bytes=0-1"});
  const response = await onRequest(context);
  assert.equal(response.status, 206);
  assert.equal(response.headers.get("Content-Range"), "bytes 0-1/16");
  assert.equal(response.headers.get("Content-Length"), "2");
  assert.equal(response.headers.get("Content-Type"), "video/mp4");
  assert.deepEqual([...new Uint8Array(await response.arrayBuffer())], [0, 1]);
  assert.equal(context.fetches[0].headers.has("Range"), false);
});

test("open-ended and suffix ranges return exact bytes", async () => {
  for (const [range, expectedRange, expected] of [
    ["bytes=12-", "bytes 12-15/16", [12, 13, 14, 15]],
    ["bytes=-3", "bytes 13-15/16", [13, 14, 15]],
    ["bytes=14-200", "bytes 14-15/16", [14, 15]],
  ]) {
    const response = await onRequest(setup({range}));
    assert.equal(response.status, 206);
    assert.equal(response.headers.get("Content-Range"), expectedRange);
    assert.deepEqual([...new Uint8Array(await response.arrayBuffer())], expected);
  }
});

test("impossible and malformed single ranges return 416", async () => {
  for (const range of ["bytes=16-", "bytes=4-3", "bytes=-0", "bytes=", "items=0-1"]) {
    const response = await onRequest(setup({range}));
    assert.equal(response.status, 416);
    assert.equal(response.headers.get("Content-Range"), "bytes */16");
    assert.equal(response.headers.get("Accept-Ranges"), "bytes");
  }
});

test("multipart Range safely falls back to full content rather than an invalid multipart body", async () => {
  const response = await onRequest(setup({range:"bytes=0-1,5-6"}));
  assert.equal(response.status, 200);
  assert.deepEqual(new Uint8Array(await response.arrayBuffer()), DATA);
});

test("If-Range mismatch sends a complete 200 response", async () => {
  const response = await onRequest(setup({range:"bytes=1-3", ifRange:'"different"'}));
  assert.equal(response.status, 200);
  assert.deepEqual(new Uint8Array(await response.arrayBuffer()), DATA);
});

test("HEAD exposes range support without sending a body", async () => {
  const response = await onRequest(setup({method:"HEAD"}));
  assert.equal(response.status, 200);
  assert.equal(response.headers.get("Accept-Ranges"), "bytes");
  assert.equal(response.headers.get("Content-Length"), "16");
  assert.equal((await response.arrayBuffer()).byteLength, 0);
});

test("only the demo MP4 is intercepted, and unsupported methods are rejected", async () => {
  const unrelated = setup({url:"https://example.test/videos/another.mp4"});
  const passThrough = await onRequest(unrelated);
  assert.equal(passThrough.status, 200);
  assert.equal(passThrough.headers.has("Accept-Ranges"), false);
  const denied = await onRequest(setup({method:"POST"}));
  assert.equal(denied.status, 405);
  assert.equal(denied.headers.get("Allow"), "GET, HEAD");
});
