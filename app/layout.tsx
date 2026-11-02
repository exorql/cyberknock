// QA ONLY — qa/contact-validation-20261102. NEVER MERGE INTO MAIN OR A PRODUCTION BRANCH.
// Base: f1b4d4e59a6665d0f593b541e16c9bc49e2ea00b. Synthetic input only; no real notification or analytics delivery.
import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import { SiteAnalytics } from "@/components/site-analytics"


// This in-memory gtag mock is QA-only and never forwards to any analytics service.
const qaAnalyticsMock = "(function installMockAnalytics() {\n  const events = [];\n  let inspector;\n  let log;\n  let count;\n\n  function appendEntry(entry, index) {\n    const item = document.createElement('li');\n    item.dataset.eventIndex = String(index + 1);\n    item.dataset.eventName = entry.name;\n    const content = document.createElement('pre');\n    content.style.cssText = 'white-space:pre-wrap;overflow-wrap:anywhere;margin:8px 0 16px';\n    content.textContent = entry.json;\n    item.append(content);\n    log.append(item);\n    inspector.dataset.eventCount = String(events.length);\n    count.textContent = String(events.length);\n  }\n\n  function mountInspector() {\n    if (inspector?.isConnected || !document.body) return;\n    inspector = document.createElement('details');\n    inspector.id = 'qa-analytics';\n    inspector.open = true;\n    inspector.dataset.analyticsMode = 'mock';\n    inspector.dataset.eventCount = String(events.length);\n    inspector.style.cssText = 'box-sizing:border-box;margin:24px;padding:16px;border:1px solid #82948c;background:#fffefa;color:#192b2b;font:13px/1.6 ui-monospace,monospace;overflow-wrap:anywhere';\n    const heading = document.createElement('summary');\n    heading.style.cssText = 'cursor:pointer;font-weight:700';\n    heading.textContent = '動作確認用イベント（外部送信なし）';\n    count = document.createElement('output');\n    count.id = 'qa-analytics-count';\n    count.textContent = String(events.length);\n    count.setAttribute('aria-live', 'polite');\n    heading.append(' / ', count, '件');\n    const note = document.createElement('p');\n    note.textContent = 'このページ内のメモリにだけ記録します。再読み込みで消去されます。合成テストデータのみを使用してください。';\n    log = document.createElement('ol');\n    log.id = 'qa-analytics-log';\n    log.style.cssText = 'padding-left:24px;margin:12px 0 0';\n    log.setAttribute('aria-label', '計測イベント引数');\n    inspector.append(heading, note, log);\n    events.forEach(appendEntry);\n    document.body.append(inspector);\n  }\n\n  window.gtag = (...args) => {\n    const entry = { name: typeof args[1] === 'string' ? args[1] : 'unknown', json: JSON.stringify(args, null, 2) };\n    events.push(entry);\n    if (log?.isConnected) appendEntry(entry, events.length - 1);\n    else if (document.readyState === 'complete') mountInspector();\n  };\n\n  // Collect early effects immediately, but add the inspector after document load\n  // so the initial application markup is left intact during normal hydration.\n  function afterDomReady() {\n    if (document.readyState === 'complete') window.setTimeout(mountInspector, 0);\n    else window.addEventListener('load', () => window.setTimeout(mountInspector, 0), { once: true });\n  }\n  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', afterDomReady, { once: true });\n  else afterDomReady();\n})();"

const siteUrl = "https://cyberknock.pages.dev"
const siteTitle = "Cyber Knock | スポーツAI・Web・モバイルの開発パートナー"
const siteDescription =
  "自社プロダクトを開発・運用する経験を、あなたの事業へ。スポーツAI・動画分析、Web・モバイルの新規開発、AI品質改善、自治体・競技団体の実証を、企画から運用まで支援します。"

export const metadata: Metadata = {
  title: siteTitle,
  description: siteDescription,
  metadataBase: new URL(siteUrl),
  alternates: {
    canonical: "/",
  },
  robots: {
    index: false,
    follow: false,
  },
  openGraph: {
    title: "Cyber Knock | 構想を、使われるプロダクトへ。",
    description: siteDescription,
    url: siteUrl,
    siteName: "Cyber Knock",
    type: "website",
    locale: "ja_JP",
  },
  twitter: {
    card: "summary_large_image",
    title: "Cyber Knock | 構想を、使われるプロダクトへ。",
    description: siteDescription,
  },
  verification: {
    google: "ib75LQ9trTgK_ExlWI9S7ZRaNfGtWg6O_8fJT3PN_d0",
  },
}

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Cyber Knock",
  url: siteUrl,
  description: siteDescription,
  address: {
    "@type": "PostalAddress",
    addressLocality: "三鷹市",
    addressRegion: "東京都",
    addressCountry: "JP",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ja">
      <head>
        <script id="qa-analytics-bootstrap" data-qa-analytics="mock" dangerouslySetInnerHTML={{ __html: qaAnalyticsMock }} />
      </head>
      <body>
        <aside id="qa-contact-banner" aria-label="動作確認専用プレビュー" style={{ background: "#fff1b8", color: "#192b2b", borderBottom: "2px solid #192b2b", padding: "16px 24px", fontSize: 15, lineHeight: 1.7 }}>
          <strong>動作確認用・お問い合わせは届きません。架空の内容でテストしてください。</strong>
          <p style={{ marginTop: 4 }}>このプレビューは検証専用です。通知と分析の外部送信は行いません。本番へマージしないでください。</p>
          <nav aria-label="問い合わせのテストモード" style={{ display: "flex", flexWrap: "wrap", gap: "8px 24px", marginTop: 8 }}>
            <a href="/?qa=success#contact" data-qa-contact-mode="success" style={{ textDecoration: "underline", fontWeight: 700 }}>成功をテスト</a>
            <a href="/?qa=failure#contact" data-qa-contact-mode="failure" style={{ textDecoration: "underline", fontWeight: 700 }}>失敗をテスト（既定）</a>
            <a href="/?qa=slow#contact" data-qa-contact-mode="slow" style={{ textDecoration: "underline", fontWeight: 700 }}>送信中をテスト（2秒後に成功）</a>
          </nav>
        </aside>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        {children}
        <SiteAnalytics />
      </body>
    </html>
  )
}


