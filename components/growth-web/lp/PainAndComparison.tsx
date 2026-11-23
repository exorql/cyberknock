import { ArrowRight, Calculator } from "lucide-react"
import { TrackedCta } from "@/components/growth-web/lp/TrackedCta"
import {
  COMPETITOR_COMPARISON_ROWS,
  SCHOOL_PAIN_POINTS,
} from "@/lib/growth-web/service-lp"

export function PainAndComparison() {
  return (
    <section
      id="comparison"
      className="scroll-mt-24 border-b border-[#dddad0] bg-[#f6f5f0] py-16 sm:py-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="font-mono text-xs font-semibold uppercase tracking-[0.16em] text-[#0a5c42]">
            01 / PROBLEM STRUCTURE
          </p>
          <h2 className="mt-3 text-2xl font-extrabold tracking-tight text-[#101815] sm:text-4xl">
            民間スポーツスクールのWeb集客が止まる3つの原因
          </h2>
          <p className="mt-4 text-base leading-relaxed text-[#424d48]">
            良い指導をしていても、保護者がスマホで検索した瞬間に「通える条件」と「安心材料」が届かなければ、体験申込の前に別のスクールへ流れてしまいます。
          </p>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {SCHOOL_PAIN_POINTS.map((pain) => (
            <article
              key={pain.code}
              className="flex flex-col justify-between rounded-2xl border border-[#dddad0] bg-white p-6"
            >
              <div>
                <span className="font-mono text-xs font-semibold tracking-[0.14em] text-[#b8430f]">
                  PAIN {pain.code}
                </span>
                <h3 className="mt-3 text-lg font-bold leading-snug text-[#101815]">
                  {pain.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-[#424d48]">
                  {pain.body}
                </p>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-20">
          <div className="max-w-3xl">
            <p className="font-mono text-xs font-semibold uppercase tracking-[0.16em] text-[#0a5c42]">
              02 / MARKET POSITIONING
            </p>
            <h2 className="mt-3 text-2xl font-extrabold tracking-tight text-[#101815] sm:text-4xl">
              なぜ「月額9,800円の制作代行」ではなく、集客改善型なのか
            </h2>
            <p className="mt-4 text-base leading-relaxed text-[#424d48]">
              ラクスル等の低価格サブスクは「安価にホームページを保有・更新代行する」優れた選択肢です。
              一方、Cyber Knockは「毎月の体験申込を増やすための設計・計測・改善」に特化することで、投資回収を前提とした立ち位置を取ります。
            </p>
          </div>

          <div className="mt-8 space-y-4 md:hidden">
            {COMPETITOR_COMPARISON_ROWS.map((row) => (
              <article
                key={row.label}
                className={`rounded-2xl border p-5 ${
                  row.highlight
                    ? "border-[#0a5c42] bg-[#e6f4ee]/65 ring-1 ring-[#0a5c42]"
                    : "border-[#dddad0] bg-white"
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="font-mono text-[11px] font-semibold text-[#424d48]">
                    {row.category}
                  </span>
                  {row.highlight && (
                    <span className="rounded-full bg-[#0a5c42] px-2.5 py-0.5 text-[11px] font-bold text-white">
                      本サービス
                    </span>
                  )}
                </div>
                <h3 className="mt-1.5 text-base font-extrabold text-[#101815]">
                  {row.label}
                </h3>
                <dl className="mt-4 space-y-2.5 text-xs">
                  <div className="flex justify-between gap-3 border-b border-[#dddad0]/70 pb-2">
                    <dt className="font-semibold text-[#424d48]">初期費用</dt>
                    <dd className="text-right font-bold text-[#101815] tabular-nums">
                      {row.initialCost}
                    </dd>
                  </div>
                  <div className="flex justify-between gap-3 border-b border-[#dddad0]/70 pb-2">
                    <dt className="font-semibold text-[#424d48]">月額費用</dt>
                    <dd className="text-right font-bold text-[#101815] tabular-nums">
                      {row.monthlyCost}
                    </dd>
                  </div>
                  <div>
                    <dt className="font-semibold text-[#424d48]">主な目的</dt>
                    <dd className="mt-0.5 leading-relaxed text-[#101815]">
                      {row.primaryGoal}
                    </dd>
                  </div>
                  <div>
                    <dt className="font-semibold text-[#424d48]">計測・CVR改善</dt>
                    <dd className="mt-0.5 leading-relaxed text-[#101815]">
                      {row.cvrAndMeasurement}
                    </dd>
                  </div>
                  <div>
                    <dt className="font-semibold text-[#424d48]">
                      スクール集客との適合
                    </dt>
                    <dd className="mt-0.5 leading-relaxed text-[#101815]">
                      {row.sportsSchoolFit}
                    </dd>
                  </div>
                </dl>
              </article>
            ))}
          </div>

          <div className="mt-10 hidden overflow-hidden rounded-2xl border border-[#dddad0] bg-white md:block">
            <table className="w-full border-collapse text-left text-sm">
              <caption className="sr-only">
                中小企業向けホームページ制作・集客支援サービスとCyber Knockの構造比較
              </caption>
              <thead>
                <tr className="border-b border-[#dddad0] bg-[#eeece4]/80 text-xs font-bold uppercase tracking-wider text-[#2c3632]">
                  <th scope="col" className="w-[21%] px-5 py-4">
                    サービス類型
                  </th>
                  <th scope="col" className="w-[14%] px-4 py-4">
                    初期費用目安
                  </th>
                  <th scope="col" className="w-[14%] px-4 py-4">
                    月額費用目安
                  </th>
                  <th scope="col" className="w-[17%] px-4 py-4">
                    主な価値提供
                  </th>
                  <th scope="col" className="w-[17%] px-4 py-4">
                    計測・CVR改善
                  </th>
                  <th scope="col" className="w-[17%] px-5 py-4">
                    スクール集客適合
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#eeece4]">
                {COMPETITOR_COMPARISON_ROWS.map((row) => (
                  <tr
                    key={row.label}
                    className={
                      row.highlight
                        ? "bg-[#e6f4ee]/65 font-medium text-[#101815]"
                        : "bg-white text-[#2c3632]"
                    }
                  >
                    <th scope="row" className="px-5 py-4 align-top">
                      <span className="block font-mono text-[11px] font-semibold text-[#424d48]">
                        {row.category}
                      </span>
                      <span className="mt-1 flex items-center gap-2 text-sm font-extrabold text-[#101815]">
                        {row.label}
                        {row.highlight && (
                          <span className="rounded-full bg-[#0a5c42] px-2 py-0.5 text-[10px] font-bold text-white">
                            本サービス
                          </span>
                        )}
                      </span>
                    </th>
                    <td className="px-4 py-4 align-top font-semibold text-[#101815] tabular-nums">
                      {row.initialCost}
                    </td>
                    <td className="px-4 py-4 align-top font-semibold text-[#101815] tabular-nums">
                      {row.monthlyCost}
                    </td>
                    <td className="px-4 py-4 align-top leading-relaxed">
                      {row.primaryGoal}
                    </td>
                    <td className="px-4 py-4 align-top leading-relaxed">
                      {row.cvrAndMeasurement}
                    </td>
                    <td className="px-5 py-4 align-top leading-relaxed">
                      {row.sportsSchoolFit}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 flex flex-col justify-between gap-4 rounded-2xl border border-[#0a5c42]/30 bg-white p-5 sm:p-6 lg:flex-row lg:items-center">
            <div className="max-w-2xl">
              <p className="font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-[#0a5c42]">
                WHY +¥20,000 / MONTH vs. 制作代行
              </p>
              <p className="mt-1.5 text-sm font-bold leading-relaxed text-[#101815]">
                月額9,800円との差額＋2万円は「指示待ちの更新費」ではなく、
                <span className="text-[#0a5c42]">
                  ①保護者特化の体験導線設計 ②GA4ファネル離脱分析 ③毎月のCVR・地域SEO改修
                </span>
                を回し続けるための投資です。
              </p>
            </div>
            <div className="flex flex-col gap-2.5 sm:shrink-0 sm:flex-row">
              <TrackedCta
                href="#simulator"
                event="lp_hero_cta_click"
                params={{
                  cta_label: "comparison_to_simulator",
                  destination: "#simulator",
                  location: "growth_web_comparison",
                }}
                className="inline-flex min-h-11 items-center justify-center gap-1.5 rounded-xl border border-[#0a5c42] bg-[#e6f4ee] px-4 text-xs font-bold text-[#0a5c42] transition-colors hover:bg-[#0a5c42] hover:text-white sm:text-sm"
              >
                <Calculator className="h-4 w-4" aria-hidden="true" />
                粗利ベースで採算を試算
              </TrackedCta>
              <TrackedCta
                href="#contact"
                event="lp_hero_cta_click"
                params={{
                  cta_label: "comparison_to_audit",
                  destination: "#contact",
                  location: "growth_web_comparison",
                }}
                className="inline-flex min-h-11 items-center justify-center gap-1.5 rounded-xl bg-[#b8430f] px-4 text-xs font-bold text-white transition-colors hover:bg-[#94340a] sm:text-sm"
              >
                無料サイト診断を相談
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </TrackedCta>
            </div>
          </div>

          <p className="mt-3 text-xs text-[#424d48]">
            ※他社料金・仕様は2026年時点の公開情報に基づく一般的な目安です。プラン改定やオプション構成により変動します。
          </p>
        </div>
      </div>
    </section>
  )
}
