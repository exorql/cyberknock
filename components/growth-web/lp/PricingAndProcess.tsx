import { ArrowRight, ArrowUpRight, Check, Shield } from "lucide-react"
import { TrackedCta } from "@/components/growth-web/lp/TrackedCta"
import {
  GROWTH_WEB_ROUTES,
  PRICING_INCLUDES,
  PROCESS_STEPS,
  SERVICE_METADATA,
} from "@/lib/growth-web/service-lp"

export function PricingAndProcess() {
  return (
    <section
      id="pricing"
      className="scroll-mt-24 border-b border-[#dddad0] bg-[#f6f5f0] py-16 sm:py-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="font-mono text-xs font-semibold uppercase tracking-[0.16em] text-[#0a5c42]">
            05 / PRICING &amp; PILOT TERMS
          </p>
          <h2 className="mt-3 text-2xl font-extrabold tracking-tight text-[#101815] sm:text-4xl">
            料金体系と、先行検証パートナー3社の透明条件
          </h2>
          <p className="mt-4 text-base leading-relaxed text-[#424d48]">
            初期構築と毎月の集客改善を分かりやすい定額構成にまとめています。
            まずは民間スポーツスクール3社様との共同検証として、設計・計測・改善の全工程を丁寧に伴走します。
          </p>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-12">
          <div className="rounded-2xl border border-[#dddad0] bg-white p-6 sm:p-8 lg:col-span-5">
            <span className="font-mono text-xs font-semibold uppercase tracking-[0.14em] text-[#0a5c42]">
              INITIAL BUILD
            </span>
            <h3 className="mt-2 text-lg font-bold text-[#101815]">
              初期設計・サイト構築・計測実装
            </h3>
            <div className="mt-4 flex items-baseline gap-2 tabular-nums">
              <span className="text-4xl font-extrabold text-[#101815]">
                ¥{SERVICE_METADATA.initialPriceExclTax}
              </span>
              <span className="text-sm font-semibold text-[#424d48]">
                （税抜）
              </span>
            </div>
            <p className="mt-1 text-xs text-[#424d48] tabular-nums">
              税込 ¥{SERVICE_METADATA.initialPriceInclTax}／初回のみ（先行3社価格）
            </p>

            <ul className="mt-6 space-y-3 border-t border-[#eeece4] pt-5">
              {PRICING_INCLUDES.initial.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-2.5 text-sm leading-relaxed text-[#2c3632]"
                >
                  <Check
                    className="mt-0.5 h-4 w-4 shrink-0 text-[#0a5c42]"
                    aria-hidden="true"
                  />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border-2 border-[#0a5c42] bg-white p-6 shadow-[0_18px_45px_-24px_rgba(10,92,66,0.35)] sm:p-8 lg:col-span-7">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="font-mono text-xs font-semibold uppercase tracking-[0.14em] text-[#0a5c42]">
                MONTHLY GROWTH &amp; OPERATIONS
              </span>
              <span className="rounded-full bg-[#e6f4ee] px-3 py-1 text-xs font-bold text-[#0a5c42]">
                先着3社・初期検証枠
              </span>
            </div>
            <h3 className="mt-2 text-lg font-bold text-[#101815]">
              月次CVR改善・地域SEO・更新運用代行
            </h3>
            <div className="mt-4 flex items-baseline gap-2 tabular-nums">
              <span className="text-4xl font-extrabold text-[#0a5c42]">
                ¥{SERVICE_METADATA.monthlyPriceExclTax}
              </span>
              <span className="text-sm font-semibold text-[#424d48]">
                / 月（税抜）
              </span>
            </div>
            <p className="mt-1 text-xs text-[#424d48] tabular-nums">
              税込 ¥{SERVICE_METADATA.monthlyPriceInclTax} / 月（先行3社価格）
            </p>

            <ul className="mt-6 grid gap-3 border-t border-[#eeece4] pt-5 sm:grid-cols-2">
              {PRICING_INCLUDES.monthly.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-2.5 text-sm leading-relaxed text-[#2c3632]"
                >
                  <Check
                    className="mt-0.5 h-4 w-4 shrink-0 text-[#0a5c42]"
                    aria-hidden="true"
                  />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <div className="mt-6 flex items-start gap-3 rounded-xl bg-[#f6f5f0] p-4 text-xs leading-relaxed text-[#2c3632]">
              <Shield
                className="mt-0.5 h-4 w-4 shrink-0 text-[#0a5c42]"
                aria-hidden="true"
              />
              <div>
                <p className="font-bold text-[#101815]">
                  権利帰属と契約条件の透明化
                </p>
                <p className="mt-1">
                  スクール様ご契約の独自ドメインおよびご提供素材の権利はスクール様に帰属します。
                  先行検証パートナー様には、3ヶ月を目安とした改善サイクルと範囲外作業の事前見積もりを明文化したうえで開始します。
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16">
          <h3 className="text-xl font-extrabold text-[#101815] sm:text-2xl">
            導入から毎月改善までの3ステップ
          </h3>
          <div className="mt-6 grid gap-5 md:grid-cols-3">
            {PROCESS_STEPS.map((step) => (
              <article
                key={step.phase}
                className="flex flex-col justify-between rounded-2xl border border-[#dddad0] bg-white p-6"
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-xs font-bold tracking-[0.14em] text-[#0a5c42]">
                      {step.phase}
                    </span>
                    <span className="rounded-full bg-[#eeece4] px-2.5 py-0.5 text-[11px] font-semibold text-[#2c3632]">
                      {step.duration}
                    </span>
                  </div>
                  <h4 className="mt-3 text-base font-bold leading-snug text-[#101815]">
                    {step.title}
                  </h4>
                  <p className="mt-2.5 text-sm leading-relaxed text-[#424d48]">
                    {step.description}
                  </p>
                </div>
                <div className="mt-5 border-t border-[#eeece4] pt-4">
                  <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-[#424d48]">
                    主なアウトプット
                  </p>
                  <ul className="mt-2 space-y-1.5 text-xs font-medium text-[#101815]">
                    {step.deliverables.map((d) => (
                      <li key={d} className="flex items-center gap-1.5">
                        <span
                          className="h-1.5 w-1.5 rounded-full bg-[#0a5c42]"
                          aria-hidden="true"
                        />
                        {d}
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-8 flex flex-col items-start justify-between gap-4 rounded-2xl border border-[#0a5c42]/30 bg-white p-6 sm:flex-row sm:items-center">
            <div>
              <p className="text-base font-extrabold text-[#101815]">
                まずは30分の無料サイト診断から（押し売りなし）
              </p>
              <p className="mt-1 text-xs leading-relaxed text-[#424d48]">
                現在のホームページURLをお送りいただくだけで、体験申込までの改善余地と先行3社枠の適用可否をご案内します。
              </p>
            </div>
            <div className="flex w-full flex-col gap-2.5 sm:w-auto sm:shrink-0 sm:flex-row">
              <TrackedCta
                href="#contact"
                event="lp_hero_cta_click"
                params={{
                  cta_label: "pricing_free_site_audit",
                  destination: "#contact",
                  location: "growth_web_pricing",
                }}
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#b8430f] px-5 text-sm font-bold text-white transition-colors hover:bg-[#94340a]"
              >
                無料サイト診断を申し込む
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </TrackedCta>
              <TrackedCta
                href={GROWTH_WEB_ROUTES.demo}
                event="lp_demo_cta_click"
                params={{
                  section: "pricing",
                  cta_label: "pricing_demo",
                  location: "growth_web_pricing",
                }}
                className="inline-flex min-h-12 items-center justify-center gap-1.5 rounded-xl border border-[#0a5c42] bg-white px-4 text-sm font-bold text-[#0a5c42] transition-colors hover:bg-[#e6f4ee]"
              >
                デモを確認
                <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </TrackedCta>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
