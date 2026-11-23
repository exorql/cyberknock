// Cloudflare Pages Function: POST /api/growth-web/inquiries
// Zero Node-only imports (pure Web Standard APIs for Cloudflare Workers & Node 22+).
// Reuses existing SLACK_WEBHOOK_URL (or optional GROWTH_WEB_WEBHOOK_URL / Resend).
// Never writes PII or upstream secrets to logs or responses.

const MAX_BODY_BYTES = 16_384;
const MAX_MEMORY_ENTRIES = 5_000;
const IDEMPOTENCY_TTL_MS = 5 * 60 * 1000;

const SPORT_CATEGORY_LABELS = {
  soccer: "サッカー・フットサル",
  gymnastics: "体操・運動基礎・体幹",
  dance: "ダンス・チアリーディング",
  basketball: "バスケットボール",
  swimming: "スイミング・水泳",
  martial_arts: "空手・柔道・武道",
  multi_sport: "複合スポーツ・マルチ競技",
  other: "その他のスポーツスクール",
};

const INQUIRY_TYPE_LABELS = {
  free_site_audit: "現サイトの無料CVR・SEO診断を希望",
  pilot_partner: "先着3社・初期検証パートナー枠の相談",
  demo_walkthrough: "デモ解説・料金や運用フローの質問",
  other: "その他のお問い合わせ",
};

const STUDENT_BAND_LABELS = {
  launching: "開校準備中",
  under_30: "30名未満",
  "30_to_80": "30〜80名",
  "80_to_150": "80〜150名",
  over_150: "150名以上",
};

const rateBuckets = new Map();
const idempotencyCache = new Map();
const inFlightMap = new Map();

export function resetGrowthWebInquiryStores() {
  rateBuckets.clear();
  idempotencyCache.clear();
  inFlightMap.clear();
}

function jsonResponse(body, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store, max-age=0",
      "X-Content-Type-Options": "nosniff",
      ...extraHeaders,
    },
  });
}

function sanitizeSingleLine(value) {
  return String(value ?? "").replace(/[\r\n\t\x00-\x1f\x7f]+/g, " ").trim();
}

function sanitizeMultiline(value) {
  return String(value ?? "")
    .replace(/\r\n?/g, "\n")
    .replace(/[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]/g, "")
    .trim();
}

function normalizeEmail(value) {
  return sanitizeSingleLine(value)
    .normalize("NFKC")
    .replace(/@(.+)$/, (_, domain) => `@${domain.toLowerCase()}`);
}

function randomHex(byteLength) {
  const bytes = new Uint8Array(byteLength);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("").toUpperCase();
}

async function sha256Hex(parts) {
  const joined = parts.map((p) => String(p ?? "").trim().toLowerCase()).join("\u001f");
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(joined));
  return Array.from(new Uint8Array(digest), (b) => b.toString(16).padStart(2, "0")).join("").slice(0, 32);
}

async function hmacSha256Hex(secret, message) {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(message));
  return Array.from(new Uint8Array(sig), (b) => b.toString(16).padStart(2, "0")).join("");
}

function generateReceiptId() {
  return `CK-${Date.now().toString(36).toUpperCase()}-${randomHex(3)}`;
}

export function maskEmail(email) {
  const [local, domain] = String(email || "").split("@");
  if (!local || !domain) return "***";
  return `${local.slice(0, Math.min(2, local.length))}***@${domain}`;
}

export function neutralizeWebhookText(input) {
  return String(input ?? "")
    .replace(/<!(channel|here|everyone|subteam[^>]*)>/gi, "[$1]")
    .replace(/@(channel|here|everyone)/gi, "[at-$1]")
    .replace(/<(https?:\/\/[^>|]+)\|([^>]+)>/gi, "$2 ($1)");
}

export function isPrivateOrUnsafeHost(hostname) {
  const lower = String(hostname || "").toLowerCase().replace(/^\[|\]$/g, "");
  if (
    !lower ||
    lower === "localhost" ||
    lower.endsWith(".localhost") ||
    lower.endsWith(".local") ||
    lower.endsWith(".internal") ||
    lower === "metadata.google.internal"
  ) {
    return true;
  }

  const ipv4Match = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/.exec(lower);
  if (ipv4Match) {
    const [a, b] = ipv4Match.slice(1).map(Number);
    if (a === 0 || a === 10 || a === 127) return true;
    if (a === 169 && b === 254) return true;
    if (a === 172 && b >= 16 && b <= 31) return true;
    if (a === 192 && b === 168) return true;
    if (a === 100 && b >= 64 && b <= 127) return true;
  }

  if (
    lower === "::1" ||
    lower === "::" ||
    lower.startsWith("fc") ||
    lower.startsWith("fd") ||
    lower.startsWith("fe80") ||
    lower.startsWith("::ffff:127.") ||
    lower.startsWith("::ffff:10.") ||
    lower.startsWith("::ffff:169.254.") ||
    lower.startsWith("::ffff:192.168.")
  ) {
    return true;
  }

  return false;
}

export function assertSafeWebhookUrl(rawUrl) {
  let parsed;
  try {
    parsed = new URL(rawUrl);
  } catch {
    throw new Error("Invalid webhook URL");
  }
  if (parsed.protocol !== "https:") throw new Error("Webhook must use HTTPS");
  if (parsed.username || parsed.password) throw new Error("Webhook must not contain credentials");
  if (isPrivateOrUnsafeHost(parsed.hostname)) throw new Error("Unsafe webhook host");
  return parsed.toString();
}

async function readLimitedJson(request) {
  const contentLength = Number(request.headers.get("content-length"));
  if (Number.isFinite(contentLength) && contentLength > MAX_BODY_BYTES) {
    throw new RangeError("body_limit");
  }
  if (!request.body) throw new SyntaxError("empty_body");
  const reader = request.body.getReader();
  const chunks = [];
  let length = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      length += value.byteLength;
      if (length > MAX_BODY_BYTES) {
        await reader.cancel();
        throw new RangeError("body_limit");
      }
      chunks.push(value);
    }
  } finally {
    reader.releaseLock();
  }
  const merged = new Uint8Array(length);
  let offset = 0;
  for (const chunk of chunks) {
    merged.set(chunk, offset);
    offset += chunk.byteLength;
  }
  const parsed = JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(merged));
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    throw new SyntaxError("not_object");
  }
  return parsed;
}

function getClientIp(request) {
  const candidates = [
    request.headers.get("cf-connecting-ip"),
    request.headers.get("x-vercel-forwarded-for"),
    request.headers.get("x-real-ip"),
    request.headers.get("x-forwarded-for"),
  ];
  for (const raw of candidates) {
    if (!raw) continue;
    const first = raw.split(",")[0]?.trim();
    if (first && /^[0-9a-fA-F:.]{2,64}$/.test(first)) return first;
  }
  return "local-client";
}

function pruneMap(map, now) {
  if (map.size < MAX_MEMORY_ENTRIES) return;
  for (const [k, entry] of map.entries()) {
    if (entry.expiresAt <= now) map.delete(k);
  }
  while (map.size >= MAX_MEMORY_ENTRIES) {
    const oldest = map.keys().next().value;
    if (!oldest) break;
    map.delete(oldest);
  }
}

async function checkRateLimit(key, limit, windowMs, env, fetchImpl) {
  const redisUrl = env?.UPSTASH_REDIS_REST_URL?.trim();
  const redisToken = env?.UPSTASH_REDIS_REST_TOKEN?.trim();
  if (redisUrl && redisToken) {
    try {
      const windowSec = Math.max(1, Math.ceil(windowMs / 1000));
      const bucket = Math.floor(Date.now() / windowMs);
      const redisKey = `ck:gw:rl:${key}:${bucket}`;
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 2_500);
      try {
        const res = await fetchImpl(`${redisUrl.replace(/\/+$/, "")}/pipeline`, {
          method: "POST",
          headers: { Authorization: `Bearer ${redisToken}`, "Content-Type": "application/json" },
          body: JSON.stringify([["INCR", redisKey], ["EXPIRE", redisKey, windowSec, "NX"], ["TTL", redisKey]]),
          signal: controller.signal,
        });
        if (res.ok) {
          const data = await res.json();
          const count = Number(data?.[0]?.result ?? 0);
          const ttl = Number(data?.[2]?.result ?? windowSec);
          if (count > limit) return { allowed: false, retryAfterSeconds: Math.max(1, ttl > 0 ? ttl : windowSec) };
          return { allowed: true, retryAfterSeconds: 0 };
        }
      } finally {
        clearTimeout(timer);
      }
    } catch {
      // Fallback to bounded in-memory sliding window
    }
  }

  const now = Date.now();
  pruneMap(rateBuckets, now);
  const entry = rateBuckets.get(key);
  const recent = entry ? entry.timestamps.filter((ts) => ts > now - windowMs) : [];
  if (recent.length >= limit) {
    const retryAfterSeconds = Math.max(1, Math.ceil((recent[0] + windowMs - now) / 1000));
    rateBuckets.set(key, { timestamps: recent, expiresAt: now + windowMs });
    return { allowed: false, retryAfterSeconds };
  }
  recent.push(now);
  rateBuckets.set(key, { timestamps: recent, expiresAt: now + windowMs });
  return { allowed: true, retryAfterSeconds: 0 };
}

export function validateGrowthWebInquiry(input) {
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    return { fieldErrors: { form: ["入力内容を確認してください。"] } };
  }
  const fieldErrors = {};
  const addError = (k, msg) => {
    if (!fieldErrors[k]) fieldErrors[k] = [msg];
  };

  const orgRaw = typeof input.organizationName === "string" ? input.organizationName : "";
  const contactRaw = typeof input.contactName === "string" ? input.contactName : "";
  const emailRaw = typeof input.email === "string" ? input.email : "";
  const phoneRaw = input.phone === undefined ? "" : typeof input.phone === "string" ? input.phone : null;
  const urlRaw = input.currentWebsiteUrl === undefined ? "" : typeof input.currentWebsiteUrl === "string" ? input.currentWebsiteUrl : null;
  const msgRaw = input.message === undefined ? "" : typeof input.message === "string" ? input.message : null;

  const organizationName = sanitizeSingleLine(orgRaw);
  const contactName = sanitizeSingleLine(contactRaw);
  const email = normalizeEmail(emailRaw);
  const phone = phoneRaw === null ? null : sanitizeSingleLine(phoneRaw);
  const currentWebsiteUrl = urlRaw === null ? null : sanitizeSingleLine(urlRaw);
  const message = msgRaw === null ? null : sanitizeMultiline(msgRaw);

  if (organizationName.length < 2) addError("organizationName", "スクール名または法人名は2文字以上で入力してください。");
  else if (organizationName.length > 80) addError("organizationName", "スクール名または法人名は80文字以内で入力してください。");

  if (contactName.length < 2) addError("contactName", "ご担当者名は2文字以上で入力してください。");
  else if (contactName.length > 50) addError("contactName", "ご担当者名は50文字以内で入力してください。");

  if (!email || email.length > 120 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    addError("email", "有効なメールアドレスを入力してください。");
  }

  if (phone === null) {
    addError("phone", "電話番号の形式を確認してください。");
  } else if (phone !== "") {
    const digits = phone.replace(/\D/g, "");
    if (phone.length > 25 || !/^[0-9+\-()\s]+$/.test(phone) || digits.length < 9 || digits.length > 15) {
      addError("phone", "電話番号は半角数字（9〜15桁）とハイフンで入力してください。");
    }
  }

  if (typeof input.sportCategory !== "string" || !(input.sportCategory in SPORT_CATEGORY_LABELS)) {
    addError("sportCategory", "主な種目を選択肢から選んでください。");
  }
  if (typeof input.monthlyStudentsBand !== "string" || !(input.monthlyStudentsBand in STUDENT_BAND_LABELS)) {
    addError("monthlyStudentsBand", "現在の生徒数規模を選択肢から選んでください。");
  }
  if (typeof input.inquiryType !== "string" || !(input.inquiryType in INQUIRY_TYPE_LABELS)) {
    addError("inquiryType", "ご相談内容を選択肢から選んでください。");
  }

  if (currentWebsiteUrl === null) {
    addError("currentWebsiteUrl", "URLの形式を確認してください。");
  } else if (currentWebsiteUrl !== "") {
    if (currentWebsiteUrl.length > 250) {
      addError("currentWebsiteUrl", "URLは250文字以内で入力してください。");
    } else {
      try {
        const parsed = new URL(currentWebsiteUrl);
        if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
          addError("currentWebsiteUrl", "URLは https:// または http:// から始まる形式で入力してください。");
        }
      } catch {
        addError("currentWebsiteUrl", "URLは https:// または http:// から始まる形式で入力してください。");
      }
    }
  }

  if (message === null) addError("message", "ご相談内容の形式を確認してください。");
  else if (message.length > 1000) addError("message", "ご相談内容は1000文字以内で入力してください。");

  if (input.privacyAccepted !== true) {
    addError("privacyAccepted", "プライバシーポリシーへの同意が必要です。");
  }

  if (Object.keys(fieldErrors).length > 0) return { fieldErrors };

  return {
    data: {
      organizationName,
      contactName,
      email,
      phone,
      sportCategory: input.sportCategory,
      monthlyStudentsBand: input.monthlyStudentsBand,
      inquiryType: input.inquiryType,
      currentWebsiteUrl,
      message,
      privacyAccepted: true,
    },
  };
}

export function buildGrowthWebSlackPayload(data, receiptId) {
  const fieldsText = [
    `受付番号: ${receiptId}`,
    `スクール名・法人名: ${data.organizationName}`,
    `ご担当者名: ${data.contactName}`,
    `メールアドレス: ${data.email}`,
    `電話番号: ${data.phone || "未入力"}`,
    `主な種目: ${SPORT_CATEGORY_LABELS[data.sportCategory]}`,
    `現在の生徒数規模: ${STUDENT_BAND_LABELS[data.monthlyStudentsBand]}`,
    `ご相談種別: ${INQUIRY_TYPE_LABELS[data.inquiryType]}`,
    `現在のWebサイト: ${data.currentWebsiteUrl || "未入力"}`,
    `相談元: Growth Web LP (/services/growth-web)`,
  ].join("\n");

  const blocks = [
    { type: "section", text: { type: "plain_text", text: fieldsText, emoji: false } },
  ];
  if (data.message) {
    blocks.push({
      type: "section",
      text: { type: "plain_text", text: `ご相談内容:\n${data.message}`, emoji: false },
    });
  }

  return {
    text: "Cyber Knock Growth Web（スポーツスクール向けLP）から新しいご相談が届きました。",
    unfurl_links: false,
    unfurl_media: false,
    blocks,
  };
}

function buildDryRunPreview(data) {
  const subject = `[Cyber Knock受付] 新規ご相談：${data.organizationName}（${INQUIRY_TYPE_LABELS[data.inquiryType]}）`;
  const lines = [
    "Cyber Knock Growth Web サービスLPより新しいご相談・診断リクエストを受信しました。",
    "",
    `・スクール名・法人名: ${data.organizationName}`,
    `・ご担当者名: ${data.contactName}`,
    `・メールアドレス: ${data.email}`,
    `・電話番号: ${data.phone || "未入力"}`,
    `・主な種目: ${SPORT_CATEGORY_LABELS[data.sportCategory]}`,
    `・現在の生徒数規模: ${STUDENT_BAND_LABELS[data.monthlyStudentsBand]}`,
    `・ご相談種別: ${INQUIRY_TYPE_LABELS[data.inquiryType]}`,
    `・現在のWebサイト: ${data.currentWebsiteUrl || "未入力"}`,
    `・ご相談内容: ${data.message || "特記なし"}`,
    "",
    "※Cyber Knock Growth Web 問い合わせフォームより生成された通知内容です。",
  ];
  return {
    emailSubject: sanitizeSingleLine(subject),
    emailRecipientMasked: maskEmail(data.email),
    emailBodyPreview: lines.join("\n"),
    webhookHeadline: neutralizeWebhookText(subject),
    webhookFieldCount: 9,
  };
}

async function runIdempotent(keys, producer) {
  const now = Date.now();
  pruneMap(idempotencyCache, now);

  for (const key of keys) {
    const cached = idempotencyCache.get(key);
    if (cached && cached.expiresAt > now) {
      return { result: cached.value, deduplicated: true };
    }
  }
  for (const key of keys) {
    const pending = inFlightMap.get(key);
    if (pending) {
      return { result: await pending, deduplicated: true };
    }
  }

  const promise = producer();
  for (const key of keys) inFlightMap.set(key, promise);
  try {
    const result = await promise;
    const expiresAt = Date.now() + IDEMPOTENCY_TTL_MS;
    for (const key of keys) idempotencyCache.set(key, { value: result, expiresAt });
    return { result, deduplicated: false };
  } finally {
    for (const key of keys) inFlightMap.delete(key);
  }
}

export async function handleGrowthWebInquiry(request, env, fetchImpl = fetch) {
  // Never deliver live lead notifications from Cloudflare preview or other
  // non-canonical hosts, even if production Webhook secrets are accidentally bound.
  // Explicit local/preview dry-run remains safe because it never sends externally.
  const requestHostname = new URL(request.url).hostname.toLowerCase();
  const isCanonicalHost = requestHostname === "cyberknock.jp" || requestHostname === "www.cyberknock.jp";
  // Never falsely acknowledge a production lead when delivery is disabled.
  if (isCanonicalHost && env?.GROWTH_WEB_DRY_RUN === "1") {
    return jsonResponse({
      ok: false,
      error: "現在お問い合わせ受付システムの設定調整中です。時間をおいて再度お試しください。",
    }, 503);
  }
  if (!isCanonicalHost && env?.GROWTH_WEB_DRY_RUN !== "1") {
    return jsonResponse({
      ok: false,
      error: "プレビュー環境ではお問い合わせを受け付けていません。正式サイトからお問い合わせください。",
    }, 503);
  }

  const origin = request.headers.get("origin");
  if ((origin && origin !== new URL(request.url).origin) || request.headers.get("sec-fetch-site") === "cross-site") {
    return jsonResponse({ ok: false, error: "不正な送信元からのリクエストです。" }, 403);
  }

  if (!/^application\/json(?:\s*;|$)/i.test(request.headers.get("content-type") || "")) {
    return jsonResponse({ ok: false, error: "Content-Type は application/json を指定してください。" }, 415);
  }

  let body;
  try {
    body = await readLimitedJson(request);
  } catch (error) {
    return jsonResponse(
      { ok: false, error: error instanceof RangeError ? "送信データが大きすぎます。" : "リクエスト形式（JSON）が正しくありません。" },
      error instanceof RangeError ? 413 : 400
    );
  }

  // Opaque honeypot: silently return plausible receipt without dispatching or leaking detection
  if (typeof body.websiteHp === "string" && body.websiteHp.trim().length > 0) {
    return jsonResponse({
      ok: true,
      receipt: {
        receiptId: generateReceiptId(),
        mode: env?.GROWTH_WEB_DRY_RUN === "1" ? "local_dry_run" : "live",
        externalDeliveryExecuted: false,
        recordedAt: new Date().toISOString(),
        persistedLocally: false,
      },
    }, 200);
  }

  const validation = validateGrowthWebInquiry(body);
  if (validation.fieldErrors) {
    return jsonResponse(
      { ok: false, error: "入力内容をご確認のうえ、必須項目を正しくご記入ください。", fieldErrors: validation.fieldErrors },
      400
    );
  }
  const data = validation.data;

  const ip = getClientIp(request);
  const emailHash = await sha256Hex(["gw-inquiry-email", data.email]);
  const [ipRate, emailRate] = await Promise.all([
    checkRateLimit(`ip:${ip}`, 10, 10 * 60 * 1000, env, fetchImpl),
    checkRateLimit(`email:${emailHash}`, 5, 10 * 60 * 1000, env, fetchImpl),
  ]);
  const blocked = !ipRate.allowed ? ipRate : !emailRate.allowed ? emailRate : null;
  if (blocked) {
    return jsonResponse(
      { ok: false, error: "短時間に多数の送信が行われました。しばらく時間をおいてから再度お試しください。", retryAfterSeconds: blocked.retryAfterSeconds },
      429,
      { "Retry-After": String(blocked.retryAfterSeconds) }
    );
  }

  const rawIdem = request.headers.get("idempotency-key")?.trim() || "";
  const clientIdemKey = /^[a-zA-Z0-9_-]{8,80}$/.test(rawIdem) ? rawIdem : null;
  const fingerprint = await sha256Hex([
    "gw_inquiry",
    data.email,
    data.organizationName,
    data.inquiryType,
    data.currentWebsiteUrl,
    data.message,
  ]);
  const dedupKeys = [`fp:${fingerprint}`];
  if (clientIdemKey) dedupKeys.unshift(`key:${clientIdemKey}`);

  try {
    const { result, deduplicated } = await runIdempotent(dedupKeys, async () => {
      const receiptId = generateReceiptId();
      const recordedAt = new Date().toISOString();

      // Explicit local QA dry-run only (never active in Cloudflare production unless explicitly set)
      if (env?.GROWTH_WEB_DRY_RUN === "1") {
        return {
          status: 200,
          receipt: {
            receiptId,
            mode: "local_dry_run",
            externalDeliveryExecuted: false,
            recordedAt,
            persistedLocally: false,
            preview: buildDryRunPreview(data),
          },
        };
      }

      const rawWebhook = (env?.GROWTH_WEB_WEBHOOK_URL || env?.SLACK_WEBHOOK_URL || "").trim();
      if (!rawWebhook) {
        return { status: 503, error: "現在お問い合わせ受付システムの設定調整中です。恐れ入りますが時間をおいて再度お試しください。" };
      }

      let safeWebhook;
      try {
        safeWebhook = assertSafeWebhookUrl(rawWebhook);
      } catch {
        return { status: 503, error: "現在お問い合わせ受付システムの設定調整中です。恐れ入りますが時間をおいて再度お試しください。" };
      }

      const payloadJson = JSON.stringify(buildGrowthWebSlackPayload(data, receiptId));
      const headers = {
        "Content-Type": "application/json",
        "X-Idempotency-Key": clientIdemKey || receiptId,
      };
      if (env?.NOTIFICATION_WEBHOOK_SECRET?.trim()) {
        const sig = await hmacSha256Hex(env.NOTIFICATION_WEBHOOK_SECRET.trim(), payloadJson);
        headers["X-CyberKnock-Signature"] = `sha256=${sig}`;
      }

      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 8_000);
      try {
        const upstream = await fetchImpl(safeWebhook, {
          method: "POST",
          headers,
          body: payloadJson,
          signal: controller.signal,
        });
        if (!upstream.ok) {
          return { status: 502, error: "送信を完了できませんでした。入力内容は残っています。時間をおいて再度お試しください。" };
        }
        return {
          status: 200,
          receipt: {
            receiptId,
            mode: "live",
            externalDeliveryExecuted: true,
            recordedAt,
            persistedLocally: false,
          },
        };
      } catch {
        return { status: 502, error: "送信を完了できませんでした。入力内容は残っています。時間をおいて再度お試しください。" };
      } finally {
        clearTimeout(timer);
      }
    });

    if (result.status !== 200) {
      // Do not cache transient errors in idempotency store
      for (const key of dedupKeys) idempotencyCache.delete(key);
      return jsonResponse({ ok: false, error: result.error }, result.status);
    }

    return jsonResponse(
      { ok: true, receipt: { ...result.receipt, ...(deduplicated ? { deduplicated: true } : {}) } },
      200
    );
  } catch {
    return jsonResponse(
      { ok: false, error: "受付通知の処理中にエラーが発生しました。時間をおいて再度お試しください。" },
      500
    );
  }
}

export function onRequest(context) {
  if (context.request.method === "POST") return handleGrowthWebInquiry(context.request, context.env);
  return jsonResponse({ ok: false, error: "POSTを使用してください。" }, 405, { Allow: "POST" });
}
