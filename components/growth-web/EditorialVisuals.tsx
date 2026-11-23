import React from "react"

export function LpEditorialPitchVisual() {
  return (
    <div
      className="relative overflow-hidden rounded-2xl border border-[#243c33] bg-[#0e1b16] p-6 text-[#f6f5f0] shadow-[0_24px_60px_-20px_rgba(14,27,22,0.45)] sm:p-8"
      role="region"
      aria-label="スポーツスクール体験申込ファネル設計モデル"
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 640 420"
        className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-55"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <linearGradient id="gwLpTurfGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#0a5c42" stopOpacity="0.65" />
            <stop offset="55%" stopColor="#0e1b16" stopOpacity="0.88" />
            <stop offset="100%" stopColor="#09130f" stopOpacity="0.98" />
          </linearGradient>
          <radialGradient id="gwLpSunGlow" cx="85%" cy="15%" r="55%">
            <stop offset="0%" stopColor="#6ee7b7" stopOpacity="0.22" />
            <stop offset="100%" stopColor="#6ee7b7" stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect width="640" height="420" fill="url(#gwLpTurfGrad)" />
        <rect width="640" height="420" fill="url(#gwLpSunGlow)" />
        <g stroke="#6ee7b7" strokeOpacity="0.22" fill="none" strokeWidth="1.2">
          <rect x="28" y="28" width="584" height="364" rx="8" />
          <line x1="320" y1="28" x2="320" y2="392" />
          <circle cx="320" cy="210" r="68" />
          <circle cx="320" cy="210" r="4" fill="#6ee7b7" fillOpacity="0.4" />
          <rect x="28" y="118" width="96" height="184" />
          <rect x="516" y="118" width="96" height="184" />
          <path d="M124 166 A 48 48 0 0 1 124 254" />
          <path d="M516 166 A 48 48 0 0 0 516 254" />
        </g>
      </svg>

      <div className="relative z-10 flex flex-col gap-5">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/15 pb-4">
          <div className="flex items-center gap-2.5">
            <span className="inline-block h-2.5 w-2.5 rounded-full bg-[#6ee7b7]" />
            <span className="font-mono text-xs font-semibold uppercase tracking-[0.14em] text-[#6ee7b7]">
              CONVERSION ARCHITECTURE MODEL
            </span>
          </div>
          <span className="rounded-full border border-white/20 bg-white/10 px-2.5 py-1 font-mono text-[11px] text-[#d6e4dd]">
            設計モデル・計測仕様
          </span>
        </div>

        <div className="grid gap-3">
          {[
            {
              step: "01",
              stage: "地域検索・Instagram・チラシQR流入",
              detail: "「地域名 × 種目 × 小学生」SEO構造・高速表示で直帰を抑制",
              event: "demo_view / page_view",
            },
            {
              step: "02",
              stage: "学年・拠点・曜日の即時絞り込み",
              detail: "PDF時間割を廃止し、保護者が10秒以内に通える枠を発見",
              event: "demo_schedule_filter",
            },
            {
              step: "03",
              stage: "月謝以外の総額・振替・当番なしの安心開示",
              detail: "離脱要因となる不安を先回り解消し、体験意欲を維持",
              event: "demo_pricing_toggle / demo_faq_toggle",
            },
            {
              step: "04",
              stage: "希望クラス連動・60秒無料体験申込",
              detail: "最短3ステップで完了＋即時通知＋GA4ファネル自動計測",
              event: "trial_form_submit",
              accent: true,
            },
          ].map((item) => (
            <div
              key={item.step}
              className={`rounded-xl border p-4 transition-colors ${
                item.accent
                  ? "border-[#6ee7b7]/55 bg-[#0a5c42]/45"
                  : "border-white/[0.12] bg-[#13251e]/85"
              }`}
            >
              <div className="flex items-start gap-3">
                <span className="mt-0.5 font-mono text-xs font-semibold text-[#6ee7b7]">
                  {item.step}
                </span>
                <div>
                  <p className="text-sm font-bold leading-snug text-white">
                    {item.stage}
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-[#c6d4cd]">
                    {item.detail}
                  </p>
                </div>
              </div>
              <div className="mt-2.5 flex items-center justify-between border-t border-white/10 pt-2">
                <span className="font-mono text-[11px] text-[#a7f3d0]">
                  GA4: {item.event}
                </span>
                <span className="text-[11px] text-[#c6d4cd]">
                  {item.accent ? "主要CV地点" : "離脱ポイント計測"}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/[0.12] bg-black/25 px-4 py-3 text-xs text-[#d6e4dd]">
          <span>※架空の成果数値ではなく、実働デモと計測仕様を公開しています</span>
          <span className="font-mono text-[#6ee7b7]">WCAG 2.2 AA / CWV最適化</span>
        </div>
      </div>
    </div>
  )
}

export function DemoHeroArtwork() {
  return (
    <figure className="relative overflow-hidden rounded-2xl border border-[#1d4637] bg-[#0b3325] text-[#f6f5f0] shadow-[0_24px_60px_-24px_rgba(12,35,28,0.42)]">
      <div className="relative p-6 sm:p-8">
        <svg
          role="img"
          aria-label="あおばフィールド スポーツアカデミーの人工芝フィールド幾何学ビジュアル"
          viewBox="0 0 720 420"
          className="pointer-events-none absolute inset-0 h-full w-full object-cover"
          preserveAspectRatio="xMidYMid slice"
        >
          <defs>
            <linearGradient id="gwFieldHeroBg" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#0f6b4d" />
              <stop offset="52%" stopColor="#0b4d37" />
              <stop offset="100%" stopColor="#082b1f" />
            </linearGradient>
            <radialGradient id="gwGoldenLight" cx="84%" cy="14%" r="58%">
              <stop offset="0%" stopColor="#fde4b8" stopOpacity="0.34" />
              <stop offset="48%" stopColor="#6ee7b7" stopOpacity="0.14" />
              <stop offset="100%" stopColor="#082b1f" stopOpacity="0" />
            </radialGradient>
          </defs>

          <rect width="720" height="420" fill="url(#gwFieldHeroBg)" />
          <rect width="720" height="420" fill="url(#gwGoldenLight)" />

          <g fill="#15845f" fillOpacity="0.24">
            <polygon points="0,0 130,0 30,420 -80,420" />
            <polygon points="240,0 370,0 270,420 140,420" />
            <polygon points="480,0 610,0 510,420 380,420" />
          </g>

          <g stroke="#f6f5f0" strokeOpacity="0.28" strokeWidth="1.5" fill="none">
            <rect x="28" y="28" width="664" height="364" rx="10" />
            <line x1="360" y1="28" x2="360" y2="392" />
            <circle cx="360" cy="210" r="88" />
            <circle cx="360" cy="210" r="4" fill="#f6f5f0" fillOpacity="0.55" />
            <rect x="28" y="106" width="112" height="208" />
            <rect x="580" y="106" width="112" height="208" />
            <path d="M140 162 A 54 54 0 0 1 140 258" />
            <path d="M580 162 A 54 54 0 0 0 580 258" />
          </g>

          <g fill="none" strokeLinecap="round">
            <path
              d="M98 318 C210 264, 310 248, 434 196"
              stroke="#6ee7b7"
              strokeWidth="2.5"
              strokeDasharray="6 8"
              strokeOpacity="0.85"
            />
            <circle cx="434" cy="196" r="10" fill="#f6f5f0" fillOpacity="0.92" />
            <circle cx="434" cy="196" r="20" stroke="#6ee7b7" strokeWidth="1.5" strokeOpacity="0.6" />
            <path
              d="M434 196 C512 162, 566 136, 622 96"
              stroke="#f4b183"
              strokeWidth="2"
              strokeDasharray="4 6"
              strokeOpacity="0.85"
            />
          </g>
        </svg>

        <div className="relative z-10 flex min-h-[290px] flex-col justify-between gap-6 sm:min-h-[340px]">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-[#08261c]/80 px-3 py-1 font-mono text-[11px] font-semibold tracking-[0.12em] text-[#a7f3d0] backdrop-blur-sm">
              AOBA FIELD / MODEL ACADEMY
            </span>
            <span className="rounded-full border border-[#f4b183]/45 bg-[#2d1a10]/75 px-3 py-1 text-[11px] font-bold text-[#fde4b8]">
              初回無料体験 受付中
            </span>
          </div>

          <div className="max-w-md rounded-2xl border border-white/[0.16] bg-[#082219]/[0.82] p-5 backdrop-blur-md">
            <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-[#6ee7b7]">
              SESSION SNAPSHOT（モデル設計）
            </p>
            <p className="mt-2 text-lg font-extrabold leading-snug text-white">
              少人数 × 段階別カリキュラムで、
              <span className="block text-[#a7f3d0]">
                はじめての子も60分で笑顔になる。
              </span>
            </p>
            <div className="mt-4 grid grid-cols-3 gap-2.5 border-t border-white/[0.12] pt-4 text-center tabular-nums">
              <div className="rounded-lg bg-white/[0.06] px-2 py-2.5">
                <p className="font-mono text-lg font-extrabold text-white">6:1</p>
                <p className="mt-0.5 text-[10px] text-[#c6d4cd]">指導員比率</p>
              </div>
              <div className="rounded-lg bg-white/[0.06] px-2 py-2.5">
                <p className="font-mono text-lg font-extrabold text-[#6ee7b7]">2拠点</p>
                <p className="mt-0.5 text-[10px] text-[#c6d4cd]">屋外＋屋内</p>
              </div>
              <div className="rounded-lg bg-white/[0.06] px-2 py-2.5">
                <p className="font-mono text-lg font-extrabold text-[#fde4b8]">¥0</p>
                <p className="mt-0.5 text-[10px] text-[#c6d4cd]">初回体験・貸出</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <figcaption className="flex flex-wrap items-center justify-between gap-2 border-t border-white/15 bg-[#072118] px-5 py-3 text-xs text-[#d6e4dd]">
        <span>デモ用エディトリアルビジュアル（架空モデルスクール）</span>
        <span className="font-mono text-[11px] text-[#6ee7b7]">
          実導入時は貴校の練習風景写真を全面配置
        </span>
      </figcaption>
    </figure>
  )
}

export function DemoCoachArtwork({
  tone = "emerald",
  caption,
  initials = "KT",
  specialty = "BALL CONTROL & MENTORSHIP",
}: {
  tone?: "emerald" | "terracotta" | "slate"
  caption: string
  initials?: string
  specialty?: string
}) {
  const palette =
    tone === "terracotta"
      ? {
          from: "#2b160d",
          to: "#6a2e14",
          line: "#f4b183",
          pillBg: "rgba(244, 177, 131, 0.16)",
          pillText: "#fde4b8",
        }
      : {
          from: "#0b241b",
          to: "#0e5a41",
          line: "#6ee7b7",
          pillBg: "rgba(110, 231, 183, 0.16)",
          pillText: "#a7f3d0",
        }

  return (
    <div className="overflow-hidden rounded-xl border border-[#dddad0]">
      <div
        className="relative flex min-h-[196px] flex-col justify-between overflow-hidden p-5 text-white"
        style={{
          background: `linear-gradient(135deg, ${palette.from} 0%, ${palette.to} 100%)`,
        }}
      >
        <svg
          aria-hidden="true"
          viewBox="0 0 480 220"
          className="pointer-events-none absolute inset-0 h-full w-full"
          preserveAspectRatio="xMidYMid slice"
        >
          <g stroke={palette.line} strokeOpacity="0.22" fill="none" strokeWidth="1.2">
            <circle cx="390" cy="180" r="120" />
            <circle cx="390" cy="180" r="76" />
            <circle cx="390" cy="180" r="32" />
            <line x1="0" y1="180" x2="480" y2="180" />
            <line x1="270" y1="0" x2="270" y2="220" strokeOpacity="0.12" />
          </g>
        </svg>

        <div className="relative z-10 flex items-center justify-between gap-2">
          <span
            className="rounded-full px-2.5 py-1 font-mono text-[10px] font-semibold tracking-[0.12em]"
            style={{
              backgroundColor: palette.pillBg,
              color: palette.pillText,
            }}
          >
            {specialty}
          </span>
          <span className="font-mono text-[10px] text-white/75">
            PORTRAIT SLOT
          </span>
        </div>

        <div className="relative z-10 flex items-end justify-between gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-white/25 bg-white/10 font-mono text-2xl font-extrabold tracking-tight text-white backdrop-blur-sm">
            {initials}
          </div>
          <p className="max-w-[240px] text-right text-xs leading-relaxed text-white/85">
            保護者の安心感に直結する笑顔の指導ポートレートを配置する設計枠
          </p>
        </div>
      </div>

      <div className="bg-[#f6f5f0] px-3.5 py-2 text-[11px] font-medium text-[#424d48]">
        {caption}（実導入時はコーチご本人の写真を掲載）
      </div>
    </div>
  )
}
