// Cloudflare Pages serves static assets with HTTP 200 even when Range is supplied.
// Scope byte-range support to this single public demo MP4 (Safari-compatible seeking).
const VIDEO_PATH = "/videos/cyberknock-b2b-ai-demo-25s-web.mp4";
const METHODS = "GET, HEAD";

const fullAssetRequest = (url, method = "GET") => new Request(url, { method });

function assetResponse(asset, extraHeaders = {}) {
  const headers = new Headers(asset.headers);
  headers.set("Accept-Ranges", "bytes");
  for (const [key, value] of Object.entries(extraHeaders)) headers.set(key, value);
  return new Response(asset.body, { status: asset.status, headers });
}

function parseSingleByteRange(raw, length) {
  // Prefer a full response for multipart ranges rather than sending invalid multipart bytes.
  if (raw.includes(",")) return null;
  const match = /^bytes=(\d*)-(\d*)$/.exec(raw.trim());
  if (!match || (!match[1] && !match[2])) return { unsatisfiable: true };
  let start;
  let end;
  if (match[1]) {
    start = Number(match[1]);
    end = match[2] ? Number(match[2]) : length - 1;
  } else {
    const suffix = Number(match[2]);
    if (!Number.isSafeInteger(suffix) || suffix < 1) return { unsatisfiable: true };
    start = Math.max(0, length - suffix);
    end = length - 1;
  }
  if (!Number.isSafeInteger(start) || !Number.isSafeInteger(end) ||
      start >= length || start < 0 || start > end) return { unsatisfiable: true };
  return { start, end: Math.min(end, length - 1) };
}

export async function onRequest({ request, env }) {
  const url = new URL(request.url);
  if (url.pathname !== VIDEO_PATH) return env.ASSETS.fetch(request);
  if (request.method !== "GET" && request.method !== "HEAD") {
    return new Response("Method Not Allowed", { status: 405, headers: { Allow: METHODS } });
  }
  if (request.method === "HEAD") {
    const asset = await env.ASSETS.fetch(fullAssetRequest(request.url, "HEAD"));
    return assetResponse(asset);
  }

  const range = request.headers.get("Range");
  if (!range) return assetResponse(await env.ASSETS.fetch(request));
  // Fetch the full source from ASSETS (Pages ignores Range on static files).
  const asset = await env.ASSETS.fetch(fullAssetRequest(request.url));
  if (asset.status !== 200 || asset.headers.has("Content-Encoding")) return asset;
  const ifRange = request.headers.get("If-Range");
  if (ifRange && ifRange !== asset.headers.get("ETag") &&
      ifRange !== asset.headers.get("Last-Modified")) return assetResponse(asset);

  const bytes = await asset.arrayBuffer();
  const result = parseSingleByteRange(range, bytes.byteLength);
  if (result === null) {
    const headers = new Headers(asset.headers);
    headers.set("Accept-Ranges", "bytes");
    return new Response(bytes, { status: 200, headers });
  }
  if (result.unsatisfiable) {
    return new Response(null, {
      status: 416,
      headers: {
        "Accept-Ranges": "bytes",
        "Content-Range": `bytes */${bytes.byteLength}`,
        "Cache-Control": "no-store",
      },
    });
  }
  const { start, end } = result;
  const headers = new Headers(asset.headers);
  headers.set("Accept-Ranges", "bytes");
  headers.set("Content-Range", `bytes ${start}-${end}/${bytes.byteLength}`);
  headers.set("Content-Length", String(end - start + 1));
  return new Response(bytes.slice(start, end + 1), { status: 206, headers });
}
