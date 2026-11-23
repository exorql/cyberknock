import Link from "next/link"
import { ArrowRight, ArrowUpRight, CheckCircle2 } from "lucide-react"
import { LpEditorialPitchVisual } from "@/components/growth-web/EditorialVisuals"
import { TrackedCta } from "@/components/growth-web/lp/TrackedCta"
import { GROWTH_WEB_ROUTES, SERVICE_METADATA } from "@/lib/growth-web/service-lp"

export function LpHero() {
  return (
    <section className="gw-editorial-grid relative border-b border-[#dddad0] pb-16 pt-8 sm:pb-24 sm:pt-14 lg:pb-28 lg:pt-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Clean Breadcrumb tying into official Cyber Knock site IA */}
        <nav
          aria-label="パンくずリスト"
          className="mb-6 flex flex-wrap items-center gap-2 text-xs font-medium text-[#424d48]"
        >
          <Link href="/" className="hover:text-[#0a5c42] hover:underline">
            Cyber Knock
          </Link>
          <span aria-hidden="true">/</span>
          <Link href="/#services" className="hover:text-[#0a5c42] hover:underline">
            支援内容
          </Link>
          <span aria-hidden="true">/</span>
          <span aria-current="page" className="font-semibold text-[#101815]">
            Cyber Knock Growth Web
          </span>
        </nav>

        <div className="grid items-start gap-10 lg:grid-cols-12 lg:gap-12">
          {/* Left editorial column */}
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#0a5c42]/30 bg-[#e6f4ee] px-3 py-1.5 text-[11px] font-semibold text-[#0a5c42] sm:px-3.5 sm:text-xs">
              <span
                className="inline-block h-2 w-2 shrink-0 rounded-full bg-[#0a5c42]"
                aria-hidden="true"
              />
              <span>民間スポーツスクール特化｜先行パートナー3社限定募集</span>
            </div>

            <h1 className="mt-5 text-[1.72rem] font-extrabold leading-[1.24] tracking-[-0.025em] text-[#101815] sm:text-5xl sm:leading-[1.15]">
              <span className="block">ホームページ制作ではなく、</span>
              <span className="mt-1 block text-[#0a5c42]">
                体験申込を増やし続ける
              </span>
              <span className="block">集客改善。</span>
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-relaxed text-[#38443f] sm:text-lg">
              民間スポーツスクール（サッカー・体操・ダンス・バスケ・水泳等）に特化し、
              保護者がスマホで迷わず無料体験へ進めるWebサイト構築と、
              GA4計測×AI活用による毎月のCVR・地域SEO改善を一体で提供します。
            </p>

            {/* Transparent pricing strip */}
            <div className="mt-7 rounded-xl border border-[#dddad0] bg-white p-4 sm:p-5">
              <div className="flex flex-wrap items-baseline justify-between gap-3">
                <div>
                  <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.12em] text-[#424d48]">
                    PILOT PARTNER（先着3社・初期検証価格）
                  </p>
                  <p className="mt-1.5 flex flex-wrap items-baseline gap-x-3 gap-y-1 text-[#101815] tabular-nums">
                    <span className="inline-flex items-baseline gap-1.5 whitespace-nowrap">
                      <span className="text-sm font-semibold text-[#424d48]">
                        初期
                      </span>
                      <span className="text-2xl font-extrabold sm:text-3xl">
                        ¥{SERVICE_METADATA.initialPriceExclTax}
                      </span>
                    </span>
                    <span className="inline-flex items-baseline gap-1.5 whitespace-nowrap">
                      <span className="text-sm font-semibold text-[#424d48]">
                        ＋ 月額
                      </span>
                      <span className="text-2xl font-extrabold text-[#0a5c42] sm:text-3xl">
                        ¥{SERVICE_METADATA.monthlyPriceExclTax}
                      </span>
                    </span>
                    <span className="text-xs font-medium text-[#424d48]">
                      （税抜／税込 初期¥{SERVICE_METADATA.initialPriceInclTax}・月額¥
                      {SERVICE_METADATA.monthlyPriceInclTax}）
                    </span>
                  </p>
                </div>
              </div>
              <div className="mt-3.5 grid gap-2 border-t border-[#eeece4] pt-3.5 text-xs font-medium text-[#2c3632] sm:grid-cols-3">
                <span className="inline-flex items-center gap-1.5">
                  <CheckCircle2
                    className="h-4 w-4 shrink-0 text-[#0a5c42]"
                    aria-hidden="true"
                  />
                  体験申込特化UI・60秒フォーム
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <CheckCircle2
                    className="h-4 w-4 shrink-0 text-[#0a5c42]"
                    aria-hidden="true"
                  />
                  GA4計測×AI月次改善込み
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <CheckCircle2
                    className="h-4 w-4 shrink-0 text-[#0a5c42]"
                    aria-hidden="true"
                  />
                  既存予約ツール併用OK
                </span>
              </div>
            </div>

            {/* Primary CTAs */}
            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
              <TrackedCta
                href={GROWTH_WEB_ROUTES.demo}
                event="lp_demo_cta_click"
                params={{
                  section: "hero",
                  cta_label: "hero_demo",
                  location: "growth_web_hero",
                }}
                className="inline-flex min-h-[52px] items-center justify-center gap-2 rounded-xl bg-[#b8430f] px-6 text-base font-bold text-white shadow-[0_12px_28px_-10px_rgba(184,67,15,0.55)] transition-colors hover:bg-[#94340a]"
              >
                スポーツスクール実働デモを触る
                <ArrowUpRight className="h-5 w-5" aria-hidden="true" />
              </TrackedCta>
              <TrackedCta
                href="#contact"
                event="lp_hero_cta_click"
                params={{
                  cta_label: "hero_free_site_audit",
                  destination: "#contact",
                  location: "growth_web_hero",
                }}
                className="inline-flex min-h-[52px] items-center justify-center gap-2 rounded-xl border border-[#101815] bg-white px-6 text-base font-bold text-[#101815] transition-colors hover:bg-[#101815] hover:text-white"
              >
                現サイトの無料診断を相談する
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </TrackedCta>
            </div>

            {/* Explicit honesty commitment */}
            <p className="mt-4 text-xs leading-relaxed text-[#424d48]">
              ※新規事業MVPの初期検証フェーズ（先着3社限定）のため、架空の導入実績・口コミ・誇張された成果数値は掲載していません。
              実際の画面・操作感・GA4計測設計をデモサイトでご確認いただけます。
            </p>
          </div>

          {/* Right visual architectural proof column */}
          <div className="lg:col-span-5">
            <LpEditorialPitchVisual />
          </div>
        </div>
      </div>
    </section>
  )
}
