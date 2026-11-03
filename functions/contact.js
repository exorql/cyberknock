// Cloudflare Pages Function. The existing Slack destination stays in the environment.
// No submission data or webhook errors are written to logs or returned to callers.
const MAX_BODY_BYTES = 24_000;
const LIMITS = { name: 100, email: 254, company: 200, message: 5_000 };
const BUDGETS = new Set(["", "undecided", "under_50", "50_100", "100_300", "300_500", "over_500"]);
const SERVICES = new Set(["", "sports-ai", "product", "ai-improvement", "advisory", "sports-dx", "other"]);
const SOURCES = new Set(["home", "sports_dx", "case_study", "security", "privacy", "video_poc", "soccer_poc", "kyudo_poc", "other"]);
const BUDGET_LABELS = { undecided: "相談して決めたい", under_50: "50万円未満", "50_100": "50〜100万円", "100_300": "100〜300万円", "300_500": "300〜500万円", over_500: "500万円以上" };
const SOURCE_LABELS = { home: "ホーム", sports_dx: "スポーツDX", case_study: "アプリ事例", security: "セキュリティ", privacy: "プライバシー", video_poc: "AI動画解析・PoC受託開発", soccer_poc: "サッカー選手追跡の検証", kyudo_poc: "弓道動作解析の検証", other: "その他" };
const SERVICE_LABELS = { "sports-ai": "スポーツAI・動画分析", product: "Web・モバイルプロダクト開発", "ai-improvement": "AI機能開発・品質改善", advisory: "開発顧問・技術支援", "sports-dx": "スポーツDX・AI実証", other: "相談しながら整理したい" };

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff" },
  });
}

async function readLimitedJson(request) {
  const contentLength = Number(request.headers.get("content-length"));
  if (Number.isFinite(contentLength) && contentLength > MAX_BODY_BYTES) throw new RangeError("body_limit");
  if (!request.body) throw new SyntaxError("empty_body");
  const reader = request.body.getReader();
  const chunks = [];
  let length = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      length += value.byteLength;
      if (length > MAX_BODY_BYTES) { await reader.cancel(); throw new RangeError("body_limit"); }
      chunks.push(value);
    }
  } finally { reader.releaseLock(); }
  const body = new Uint8Array(length);
  let offset = 0;
  for (const chunk of chunks) { body.set(chunk, offset); offset += chunk.byteLength; }
  return JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(body));
}

export function validateContact(input) {
  if (!input || typeof input !== "object" || Array.isArray(input)) return { errors: { form: "入力内容を確認してください。" } };
  const errors = {};
  const data = {};
  for (const [key, max] of Object.entries(LIMITS)) {
    const raw = input[key];
    if (raw !== undefined && typeof raw !== "string") { errors[key] = "入力内容を確認してください。"; continue; }
    data[key] = (raw || "").trim();
    if (data[key].length > max) errors[key] = `${max}文字以内で入力してください。`;
  }
  if (!data.name) errors.name = "お名前を入力してください。";
  if (data.name && /[\r\n\u0000-\u001f]/.test(data.name)) errors.name = "お名前を確認してください。";
  if (data.email) data.email = data.email.normalize("NFKC").replace(/@(.+)$/, (_, domain) => `@${domain.toLowerCase()}`);
  if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email) || data.email.length > LIMITS.email) errors.email = "有効なメールアドレスを入力してください。";
  if (!data.message) errors.message = "ご相談内容を入力してください。";
  if (input.privacy !== true) errors.privacy = "プライバシーポリシーへの同意が必要です。";
  for (const [key, values] of [["budget", BUDGETS], ["service", SERVICES]]) {
    const value = input[key] === undefined ? "" : input[key];
    if (typeof value !== "string" || !values.has(value)) errors[key] = "選択肢から選んでください。";
    else data[key] = value;
  }
  data.source = SOURCES.has(input.source) ? input.source : "other";
  return Object.keys(errors).length ? { errors } : { data };
}

export function buildSlackPayload(data) {
  const details = `氏名: ${data.name}\nメール: ${data.email}\n会社名・組織名: ${data.company || "未入力"}\n相談テーマ: ${SERVICE_LABELS[data.service] || "未選択"}\nご予算: ${BUDGET_LABELS[data.budget] || "未選択"}\n相談元: ${SOURCE_LABELS[data.source] || "その他"} (${data.source})`;
  const characters = Array.from(data.message);
  const sections = [details];
  for (let index = 0; index < characters.length; index += 2_500) {
    sections.push(`${index === 0 ? "ご相談内容:\n" : "（続き）\n"}${characters.slice(index, index + 2_500).join("")}`);
  }
  return {
    text: "Cyber KnockのWebサイトから新しいお問い合わせが届きました。",
    unfurl_links: false,
    unfurl_media: false,
    blocks: sections.map((text) => ({ type: "section", text: { type: "plain_text", text, emoji: false } })),
  };
}

export async function handleContact(request, env, fetchImpl = fetch) {
  const origin = request.headers.get("origin");
  if ((origin && origin !== new URL(request.url).origin) || request.headers.get("sec-fetch-site") === "cross-site") {
    return json({ ok: false, error: "このページから再度お試しください。" }, 403);
  }
  if (!/^application\/json(?:\s*;|$)/i.test(request.headers.get("content-type") || "")) {
    return json({ ok: false, error: "送信形式を確認してください。" }, 415);
  }
  let input;
  try { input = await readLimitedJson(request); }
  catch (error) {
    return json({ ok: false, error: error instanceof RangeError ? "入力内容が長すぎます。" : "入力内容を確認してください。" }, error instanceof RangeError ? 413 : 400);
  }
  // Honeypot is deliberately excluded from the accessible form and normal navigation.
  if (input && typeof input.website === "string" && input.website.trim()) return json({ ok: true });
  const validation = validateContact(input);
  if (validation.errors) return json({ ok: false, errors: validation.errors, error: "入力内容を確認してください。" }, 400);
  const webhookUrl = env?.SLACK_WEBHOOK_URL;
  if (typeof webhookUrl !== "string" || !webhookUrl.startsWith("https://")) {
    return json({ ok: false, error: "現在送信を受け付けられません。時間をおいて再度お試しください。" }, 503);
  }
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8_000);
  try {
    const response = await fetchImpl(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(buildSlackPayload(validation.data)),
      signal: controller.signal,
    });
    if (!response.ok) return json({ ok: false, error: "送信を完了できませんでした。入力内容は残っています。時間をおいて再度お試しください。" }, 502);
    return json({ ok: true });
  } catch {
    return json({ ok: false, error: "送信を完了できませんでした。入力内容は残っています。時間をおいて再度お試しください。" }, 502);
  } finally { clearTimeout(timeout); }
}

export function onRequest(context) {
  if (context.request.method === "POST") return handleContact(context.request, context.env);
  const response = json({ ok: false, error: "POSTを使用してください。" }, 405);
  response.headers.set("Allow", "POST");
  return response;
}

