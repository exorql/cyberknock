// Cloudflare Pages Function: POST /api/growth-web/demo-trial
// STRICTLY EPHEMERAL SIMULATION:
// - NEVER sends external email or webhook notifications regardless of env vars
// - NEVER persists user-entered PII to disk, KV, or database
// - Pure Web Standard APIs (Cloudflare Workers & Node 22+ compatible)

const MAX_BODY_BYTES = 12_288;
const MAX_MEMORY_ENTRIES = 5_000;
const DEMO_IDEMPOTENCY_TTL_MS = 2 * 60 * 1000;

const DEMO_CLASS_MAP = {
  "kids-movement-tue": {
    id: "kids-movement-tue",
    name: "キッズ運動基礎＆ボール遊びクラス",
    campusName: "二子玉川グリーンパーク人工芝（架空）",
    dayOfWeek: "毎週火曜",
    timeRange: "15:45–16:45（60分）",
  },
  "u9-soccer-wed": {
    id: "u9-soccer-wed",
    name: "U-9 ジュニアサッカー基礎クラス",
    campusName: "二子玉川グリーンパーク人工芝（架空）",
    dayOfWeek: "毎週水曜",
    timeRange: "16:30–17:40（70分）",
  },
  "indoor-agility-thu": {
    id: "indoor-agility-thu",
    name: "屋内コーディネーション＆フットサル",
    campusName: "用賀コミュニティ屋内アリーナ（架空）",
    dayOfWeek: "毎週木曜",
    timeRange: "16:15–17:15（60分）",
  },
  "u12-game-sense-fri": {
    id: "u12-game-sense-fri",
    name: "U-12 実践ゲーム＆スキルアップクラス",
    campusName: "二子玉川グリーンパーク人工芝（架空）",
    dayOfWeek: "毎週金曜",
    timeRange: "17:15–18:35（80分）",
  },
  "weekend-family-sat": {
    id: "weekend-family-sat",
    name: "土曜モーニング 総合スポーツ＆サッカー",
    campusName: "用賀コミュニティ屋内アリーナ（架空）",
    dayOfWeek: "毎週土曜",
    timeRange: "09:30–10:40（70分）",
  },
};

const GRADE_LABELS = {
  preschool_senior: "年長（5〜6歳）",
  grade_1_2: "小学1〜2年生",
  grade_3_4: "小学3〜4年生",
  grade_5_6: "小学5〜6年生",
};

const TIMING_LABELS = {
  this_week: "今週中（直近の開催日）",
  next_week: "来週の開催日",
  this_month: "今月中で都合のよい日",
  flexible: "まずは日程を相談したい",
};

const EXPERIENCE_LABELS = {
  beginner: "はじめて（運動・サッカー未経験）",
  some_experience: "公園や遊びで少し経験あり",
  club_member: "他のクラブ・チーム経験あり",
};

const rateBuckets = new Map();
const idempotencyCache = new Map();

export function resetGrowthWebDemoStores() {
  rateBuckets.clear();
  idempotencyCache.clear();
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

function generateReceiptId() {
  return `DEMO-${Date.now().toString(36).toUpperCase()}-${randomHex(3)}`;
}

function maskEmail(email) {
  const [local, domain] = String(email || "").split("@");
  if (!local || !domain) return "***";
  return `${local.slice(0, Math.min(2, local.length))}***@${domain}`;
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

function checkRateLimit(key, limit, windowMs) {
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

export function validateDemoTrial(input) {
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    return { fieldErrors: { form: ["入力内容を確認してください。"] } };
  }
  const fieldErrors = {};
  const addError = (k, msg) => {
    if (!fieldErrors[k]) fieldErrors[k] = [msg];
  };

  const guardianName = sanitizeSingleLine(typeof input.guardianName === "string" ? input.guardianName : "");
  const email = normalizeEmail(typeof input.email === "string" ? input.email : "");
  const phone = input.phone === undefined ? "" : typeof input.phone === "string" ? sanitizeSingleLine(input.phone) : null;
  const selectedClassId = sanitizeSingleLine(typeof input.selectedClassId === "string" ? input.selectedClassId : "");
  const notes = input.notes === undefined ? "" : typeof input.notes === "string" ? sanitizeMultiline(input.notes) : null;

  if (guardianName.length < 1) addError("guardianName", "保護者の方のお名前を入力してください。");
  else if (guardianName.length > 50) addError("guardianName", "保護者の方のお名前は50文字以内で入力してください。");

  if (!email || email.length > 120 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    addError("email", "確認メールを受け取れる有効なメールアドレスを入力してください。");
  }

  if (phone === null) {
    addError("phone", "電話番号の形式を確認してください。");
  } else if (phone !== "") {
    const digits = phone.replace(/\D/g, "");
    if (phone.length > 25 || !/^[0-9+\-()\s]+$/.test(phone) || digits.length < 9 || digits.length > 15) {
      addError("phone", "電話番号は半角数字（9〜15桁）とハイフンで入力してください。");
    }
  }

  if (typeof input.childGrade !== "string" || !(input.childGrade in GRADE_LABELS)) {
    addError("childGrade", "お子さまの学年を選択してください。");
  }
  if (!selectedClassId || !(selectedClassId in DEMO_CLASS_MAP)) {
    addError("selectedClassId", "有効なクラスを選択してください。");
  }
  if (typeof input.preferredTiming !== "string" || !(input.preferredTiming in TIMING_LABELS)) {
    addError("preferredTiming", "ご希望時期を選択してください。");
  }
  if (typeof input.experienceLevel !== "string" || !(input.experienceLevel in EXPERIENCE_LABELS)) {
    addError("experienceLevel", "ご経験を選択してください。");
  }
  if (notes === null) addError("notes", "メモの形式を確認してください。");
  else if (notes.length > 500) addError("notes", "メモは500文字以内で入力してください。");

  if (input.demoAcknowledged !== true) {
    addError("demoAcknowledged", "デモサイトの送信確認にチェックを入れてください。");
  }

  if (Object.keys(fieldErrors).length > 0) return { fieldErrors };

  return {
    data: {
      guardianName,
      email,
      phone,
      childGrade: input.childGrade,
      selectedClassId,
      preferredTiming: input.preferredTiming,
      experienceLevel: input.experienceLevel,
      notes,
      demoAcknowledged: true,
    },
  };
}

export async function handleGrowthWebDemoTrial(request) {
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

  const validation = validateDemoTrial(body);
  if (validation.fieldErrors) {
    return jsonResponse(
      { ok: false, error: "入力内容をご確認のうえ、必須項目を正しくご記入ください。", fieldErrors: validation.fieldErrors },
      400
    );
  }

  const data = validation.data;
  const selectedClass = DEMO_CLASS_MAP[data.selectedClassId];

  // Opaque honeypot: return plausible demo receipt without leaking detection
  if (typeof body.websiteHp === "string" && body.websiteHp.trim().length > 0) {
    return jsonResponse({
      ok: true,
      selectedClass,
      receipt: {
        receiptId: generateReceiptId(),
        mode: "local_dry_run",
        externalDeliveryExecuted: false,
        recordedAt: new Date().toISOString(),
        persistedLocally: false,
      },
    }, 200);
  }

  const ip = getClientIp(request);
  const rate = checkRateLimit(`demo:${ip}`, 15, 10 * 60 * 1000);
  if (!rate.allowed) {
    return jsonResponse(
      { ok: false, error: "短時間に多数のデモ送信が行われました。少し時間をおいてからお試しください。", retryAfterSeconds: rate.retryAfterSeconds },
      429,
      { "Retry-After": String(rate.retryAfterSeconds) }
    );
  }

  const rawIdem = request.headers.get("idempotency-key")?.trim() || "";
  const clientIdemKey = /^[a-zA-Z0-9_-]{8,80}$/.test(rawIdem) ? rawIdem : null;
  const now = Date.now();
  pruneMap(idempotencyCache, now);

  if (clientIdemKey) {
    const cached = idempotencyCache.get(clientIdemKey);
    if (cached && cached.expiresAt > now) {
      return jsonResponse({
        ok: true,
        selectedClass,
        receipt: { ...cached.value, deduplicated: true },
      }, 200);
    }
  }

  const receiptId = generateReceiptId();
  const recordedAt = new Date().toISOString();
  const subject = `[DEMO・外部未送信] 無料体験申込：${selectedClass.name}（${GRADE_LABELS[data.childGrade]}）`;
  const previewLines = [
    "あおばフィールド スポーツアカデミー（架空デモサイト）より体験レッスン申込のシミュレーションを実行しました。※外部送信・サーバー永続保存は行われません。",
    "",
    `・保護者名: ${data.guardianName}`,
    `・メールアドレス: ${maskEmail(data.email)}`,
    `・当日連絡先: ${data.phone ? "入力あり（デモのため非保存）" : "未入力"}`,
    `・お子さまの学年: ${GRADE_LABELS[data.childGrade]}`,
    `・希望クラス: ${selectedClass.name}（${selectedClass.dayOfWeek} ${selectedClass.timeRange} / ${selectedClass.campusName}）`,
    `・希望時期: ${TIMING_LABELS[data.preferredTiming]}`,
    `・運動・競技経験: ${EXPERIENCE_LABELS[data.experienceLevel]}`,
    `・ご不安な点・メモ: ${data.notes || "特記なし"}`,
    "",
    "※本通知はスポーツスクール向けデモサイトのドライラン検証プレビューです（サーバー永続保存・外部送信なし）。",
  ];

  // Store ONLY non-PII receipt metadata in ephemeral short-lived idempotency cache (never PII)
  const receiptBase = {
    receiptId,
    mode: "local_dry_run",
    externalDeliveryExecuted: false,
    recordedAt,
    persistedLocally: false,
  };
  if (clientIdemKey) {
    idempotencyCache.set(clientIdemKey, {
      value: receiptBase,
      expiresAt: now + DEMO_IDEMPOTENCY_TTL_MS,
    });
  }

  return jsonResponse({
    ok: true,
    selectedClass,
    receipt: {
      ...receiptBase,
      preview: {
        emailSubject: sanitizeSingleLine(subject),
        emailRecipientMasked: maskEmail(data.email),
        emailBodyPreview: previewLines.join("\n"),
        webhookHeadline: sanitizeSingleLine(subject),
        webhookFieldCount: 8,
      },
    },
  }, 200);
}

export function onRequest(context) {
  if (context.request.method === "POST") return handleGrowthWebDemoTrial(context.request);
  return jsonResponse({ ok: false, error: "POSTを使用してください。" }, 405, { Allow: "POST" });
}
