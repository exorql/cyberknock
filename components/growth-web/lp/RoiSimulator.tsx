"use client"

import {
  AlertTriangle,
  ArrowRight,
  Calculator,
  CheckCircle2,
  Info,
  RotateCcw,
} from "lucide-react"
import { useMemo, useRef, useState } from "react"
import {
  DEFAULT_ROI_INPUT,
  SERVICE_INITIAL_FEE_JPY,
  SERVICE_MONTHLY_FEE_JPY,
  type RoiSimulationInput,
  calculateRoiSimulation,
} from "@/lib/growth-web/roi"
import { trackGrowthWebEvent } from "@/lib/growth-web/telemetry"

function formatYen(amount: number): string {
  const rounded = Math.round(amount)
  const abs = Math.abs(rounded).toLocaleString("ja-JP")
  return rounded < 0 ? `-¥${abs}` : `¥${abs}`
}

function paybackBand(months: number | null): string {
  if (months === null) return "over_12m"
  if (months <= 6) return "within_6m"
  if (months <= 9) return "7_to_9m"
  return "10_to_12m"
}

export function RoiSimulator({ embedded = false }: { embedded?: boolean } = {}) {
  const [input, setInput] = useState<RoiSimulationInput>(DEFAULT_ROI_INPUT)
  const lastTrackedRef = useRef<number>(0)

  const result = useMemo(() => calculateRoiSimulation(input), [input])

  const updateField = <K extends keyof RoiSimulationInput>(
    field: K,
    value: number
  ) => {
    const next = { ...input, [field]: value }
    setInput(next)

    const now = Date.now()
    if (now - lastTrackedRef.current > 400) {
      lastTrackedRef.current = now
      const calc = calculateRoiSimulation(next)
      trackGrowthWebEvent("lp_roi_calculator_change", {
        location: "growth_web_simulator",
        viability_status: calc.viabilityStatus,
        payback_band: paybackBand(calc.grossProfitBreakEvenMonth),
      })
    }
  }

  const handleReset = () => {
    setInput(DEFAULT_ROI_INPUT)
    const calc = calculateRoiSimulation(DEFAULT_ROI_INPUT)
    trackGrowthWebEvent("lp_roi_calculator_change", {
      location: "growth_web_simulator",
      viability_status: calc.viabilityStatus,
      payback_band: paybackBand(calc.grossProfitBreakEvenMonth),
    })
  }

  const maxTimelineVal = Math.max(
    result.year1CumulativeGrossProfitJpy,
    result.year1CumulativeTotalCostJpy,
    1
  )

  const Wrapper = embedded ? "div" : "section"
  return (
    <Wrapper
      id="simulator"
      className={
        embedded
          ? "scroll-mt-24 py-6 sm:py-8"
          : "scroll-mt-24 border-b border-[#dddad0] bg-[#f6f5f0] py-16 sm:py-24"
      }
    >
      <div className={embedded ? "px-4 sm:px-7" : "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"}>
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div className="max-w-3xl">
            {!embedded && (
              <>
                <p className="font-mono text-xs font-semibold uppercase tracking-[0.16em] text-[#0a5c42]">
                  04 / UNIT ECONOMICS SIMULATOR
                </p>
                <h2 className="mt-3 text-2xl font-extrabold tracking-tight text-[#101815] sm:text-4xl">
                  粗利と顧客獲得費を含めて、現実的な採算を試算
                </h2>
              </>
            )}
            <p className={`${embedded ? "" : "mt-3 "}text-base leading-relaxed text-[#424d48]`}>
              売上LTVだけで回収を断定しません。貴校の月謝・継続期間に加え、
              <strong>粗利益率・体験入会率・追加の集客コスト（広告/チラシ等）</strong>
              を織り込み、初期{formatYen(SERVICE_INITIAL_FEE_JPY)}＋月額
              {formatYen(SERVICE_MONTHLY_FEE_JPY)}（税抜）に対する12ヶ月粗利収支を検証できます。
            </p>
          </div>
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex min-h-11 shrink-0 items-center gap-1.5 self-start rounded-lg border border-[#c3bfb1] bg-white px-3.5 text-xs font-semibold text-[#101815] hover:bg-[#eeece4] sm:self-auto"
          >
            <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
            標準値に戻す
          </button>
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-12">
          <div className="rounded-2xl border border-[#dddad0] bg-white p-6 sm:p-8 lg:col-span-5">
            <div className="flex items-center gap-2 text-sm font-bold text-[#101815]">
              <Calculator className="h-4 w-4 text-[#0a5c42]" aria-hidden="true" />
              <span>貴校の収益構造・集客前提を入力</span>
            </div>

            <div className="mt-6 space-y-5">
              <div>
                <div className="flex items-baseline justify-between gap-3">
                  <label
                    htmlFor="roi-monthly-tuition"
                    className="text-sm font-semibold text-[#101815]"
                  >
                    平均月謝（1名あたり）
                  </label>
                  <span className="shrink-0 whitespace-nowrap font-mono text-sm font-bold text-[#0a5c42] tabular-nums sm:text-base">
                    {formatYen(input.monthlyTuitionJpy)} / 月
                  </span>
                </div>
                <input
                  id="roi-monthly-tuition"
                  type="range"
                  min={4000}
                  max={18000}
                  step={500}
                  value={input.monthlyTuitionJpy}
                  onChange={(e) =>
                    updateField("monthlyTuitionJpy", Number(e.target.value))
                  }
                  className="gw-range mt-2.5"
                />
                <div className="mt-1 flex justify-between text-xs text-[#424d48] tabular-nums">
                  <span>¥4,000</span>
                  <span>¥18,000</span>
                </div>
              </div>

              <div>
                <div className="flex items-baseline justify-between gap-3">
                  <label
                    htmlFor="roi-initial-fee"
                    className="text-sm font-semibold text-[#101815]"
                  >
                    入会金・初年度諸費用
                  </label>
                  <span className="shrink-0 whitespace-nowrap font-mono text-sm font-bold text-[#0a5c42] tabular-nums sm:text-base">
                    {formatYen(input.initialEnrollmentFeeJpy)}
                  </span>
                </div>
                <input
                  id="roi-initial-fee"
                  type="range"
                  min={0}
                  max={25000}
                  step={1000}
                  value={input.initialEnrollmentFeeJpy}
                  onChange={(e) =>
                    updateField("initialEnrollmentFeeJpy", Number(e.target.value))
                  }
                  className="gw-range mt-2.5"
                />
                <div className="mt-1 flex justify-between text-xs text-[#424d48] tabular-nums">
                  <span>¥0</span>
                  <span>¥25,000</span>
                </div>
              </div>

              <div>
                <div className="flex items-baseline justify-between gap-3">
                  <label
                    htmlFor="roi-retention"
                    className="text-sm font-semibold text-[#101815]"
                  >
                    平均継続期間
                  </label>
                  <span className="shrink-0 whitespace-nowrap font-mono text-sm font-bold text-[#0a5c42] tabular-nums sm:text-base">
                    {input.averageRetentionMonths} ヶ月
                  </span>
                </div>
                <input
                  id="roi-retention"
                  type="range"
                  min={6}
                  max={36}
                  step={3}
                  value={input.averageRetentionMonths}
                  onChange={(e) =>
                    updateField("averageRetentionMonths", Number(e.target.value))
                  }
                  className="gw-range mt-2.5"
                />
                <div className="mt-1 flex justify-between text-xs text-[#424d48] tabular-nums">
                  <span>6ヶ月</span>
                  <span>36ヶ月</span>
                </div>
              </div>

              <div>
                <div className="flex items-baseline justify-between gap-3">
                  <label
                    htmlFor="roi-gross-margin"
                    className="text-sm font-semibold text-[#101815]"
                  >
                    粗利益率（変動費控除後）
                  </label>
                  <span className="shrink-0 whitespace-nowrap font-mono text-sm font-bold text-[#0a5c42] tabular-nums sm:text-base">
                    {input.grossMarginPercent}%
                  </span>
                </div>
                <p className="mt-0.5 text-xs text-[#424d48]">
                  指導員変動人件費・会場費・保険・決済手数料等を差し引いた目安
                </p>
                <input
                  id="roi-gross-margin"
                  type="range"
                  min={30}
                  max={90}
                  step={5}
                  value={input.grossMarginPercent}
                  onChange={(e) =>
                    updateField("grossMarginPercent", Number(e.target.value))
                  }
                  className="gw-range mt-2"
                />
                <div className="mt-1 flex justify-between text-xs text-[#424d48] tabular-nums">
                  <span>30%（高コスト）</span>
                  <span>90%（空き枠活用）</span>
                </div>
              </div>

              <div className="border-t border-[#eeece4] pt-4">
                <div className="flex items-baseline justify-between gap-3">
                  <label
                    htmlFor="roi-trials"
                    className="text-sm font-semibold text-[#101815]"
                  >
                    Web改善による体験申込の純増仮説
                  </label>
                  <span className="shrink-0 whitespace-nowrap font-mono text-sm font-bold text-[#b8430f] tabular-nums sm:text-base">
                    ＋{input.additionalTrialsPerMonth} 件 / 月
                  </span>
                </div>
                <input
                  id="roi-trials"
                  type="range"
                  min={1}
                  max={10}
                  step={1}
                  value={input.additionalTrialsPerMonth}
                  onChange={(e) =>
                    updateField("additionalTrialsPerMonth", Number(e.target.value))
                  }
                  className="gw-range mt-2.5"
                />
                <div className="mt-1 flex justify-between text-xs text-[#424d48] tabular-nums">
                  <span>＋1件/月</span>
                  <span>＋10件/月</span>
                </div>
              </div>

              <div>
                <div className="flex items-baseline justify-between gap-3">
                  <label
                    htmlFor="roi-join-rate"
                    className="text-sm font-semibold text-[#101815]"
                  >
                    体験参加から入会への転換率
                  </label>
                  <span className="shrink-0 whitespace-nowrap font-mono text-sm font-bold text-[#0a5c42] tabular-nums sm:text-base">
                    {input.trialToJoinRatePercent}%
                  </span>
                </div>
                <input
                  id="roi-join-rate"
                  type="range"
                  min={20}
                  max={80}
                  step={5}
                  value={input.trialToJoinRatePercent}
                  onChange={(e) =>
                    updateField("trialToJoinRatePercent", Number(e.target.value))
                  }
                  className="gw-range mt-2.5"
                />
                <div className="mt-1 flex justify-between text-xs text-[#424d48] tabular-nums">
                  <span>20%</span>
                  <span>80%</span>
                </div>
              </div>

              <div>
                <div className="flex items-baseline justify-between gap-3">
                  <label
                    htmlFor="roi-acq-cost"
                    className="text-sm font-semibold text-[#101815]"
                  >
                    追加の月間集客・体験対応費
                  </label>
                  <span className="shrink-0 whitespace-nowrap font-mono text-sm font-bold text-[#101815] tabular-nums sm:text-base">
                    {formatYen(input.additionalMonthlyAcquisitionCostJpy)} / 月
                  </span>
                </div>
                <p className="mt-0.5 text-xs text-[#424d48]">
                  本サービス月額とは別にかかる広告費・チラシ費・体験運営費
                </p>
                <input
                  id="roi-acq-cost"
                  type="range"
                  min={0}
                  max={50000}
                  step={5000}
                  value={input.additionalMonthlyAcquisitionCostJpy}
                  onChange={(e) =>
                    updateField(
                      "additionalMonthlyAcquisitionCostJpy",
                      Number(e.target.value)
                    )
                  }
                  className="gw-range mt-2"
                />
                <div className="mt-1 flex justify-between text-xs text-[#424d48] tabular-nums">
                  <span>¥0</span>
                  <span>¥50,000 / 月</span>
                </div>
              </div>
            </div>
          </div>

          <div
            className="flex flex-col justify-between rounded-2xl border border-[#dddad0] bg-white p-6 sm:p-8 lg:col-span-7"
            aria-live="polite"
          >
            <div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-xl border border-[#dddad0] bg-[#f6f5f0] p-4">
                  <p className="text-xs font-semibold text-[#424d48]">
                    生徒1名の累積粗利（粗利LTV）
                  </p>
                  <p
                    data-testid="roi-student-ltv"
                    className="mt-1.5 text-2xl font-extrabold text-[#101815] tabular-nums"
                  >
                    {formatYen(result.studentGrossProfitLtvJpy)}
                  </p>
                  <p className="mt-1 text-xs text-[#424d48] tabular-nums">
                    参考：累積売上LTV {formatYen(result.studentRevenueLtvJpy)} × 粗利率
                    {input.grossMarginPercent}%
                  </p>
                </div>

                <div className="rounded-xl border border-[#dddad0] bg-[#f6f5f0] p-4">
                  <p className="text-xs font-semibold text-[#424d48]">
                    月間新規入会の試算増分
                  </p>
                  <p
                    data-testid="roi-new-members"
                    className="mt-1.5 text-2xl font-extrabold text-[#0a5c42] tabular-nums"
                  >
                    ＋{result.expectedNewMembersPerMonth} 名 / 月
                  </p>
                  <p className="mt-1 text-xs text-[#424d48] tabular-nums">
                    6ヶ月目の月次粗利増分{" "}
                    {formatYen(result.month6MonthlyGrossProfitJpy)}
                  </p>
                </div>

                <div className="rounded-xl border border-[#dddad0] bg-[#f6f5f0] p-4">
                  <p className="text-xs font-semibold text-[#424d48]">
                    初年度平均 顧客獲得単価（CAC）
                  </p>
                  <p
                    data-testid="roi-cac"
                    className="mt-1.5 text-2xl font-extrabold text-[#101815] tabular-nums"
                  >
                    {formatYen(result.year1BlendedCacJpy)}
                    <span className="ml-1 text-xs font-semibold text-[#424d48]">
                      / 名
                    </span>
                  </p>
                  <p className="mt-1 text-xs text-[#424d48] tabular-nums">
                    粗利LTV / CAC ={" "}
                    <strong className="text-[#101815]">
                      {result.grossProfitLtvToCacRatio}倍
                    </strong>
                    （健全目安 2.5倍以上）
                  </p>
                </div>

                <div
                  className={`rounded-xl border p-4 ${
                    result.viabilityStatus === "favorable"
                      ? "border-[#0a5c42]/35 bg-[#e6f4ee]"
                      : result.viabilityStatus === "caution"
                        ? "border-[#b45309]/35 bg-[#fef7e6]"
                        : "border-[#b8430f]/40 bg-[#fdf0e8]"
                  }`}
                >
                  <p
                    className={`text-xs font-semibold ${
                      result.viabilityStatus === "favorable"
                        ? "text-[#0a5c42]"
                        : result.viabilityStatus === "caution"
                          ? "text-[#92400e]"
                          : "text-[#94340a]"
                    }`}
                  >
                    粗利ベースの累積回収目安
                  </p>
                  <p
                    data-testid="roi-breakeven"
                    className="mt-1.5 text-2xl font-extrabold text-[#101815] tabular-nums"
                  >
                    {result.grossProfitBreakEvenMonth
                      ? `${result.grossProfitBreakEvenMonth}ヶ月目`
                      : "12ヶ月超"}
                  </p>
                  <p className="mt-1 text-xs text-[#2c3632] tabular-nums">
                    12ヶ月累積粗利収支{" "}
                    <strong>
                      {result.year1CumulativeNetGrossProfitJpy > 0 ? "+" : ""}
                      {formatYen(result.year1CumulativeNetGrossProfitJpy)}
                    </strong>
                  </p>
                </div>
              </div>

              {result.viabilityStatus === "unviable" && (
                <div
                  data-testid="roi-viability-banner"
                  className="mt-4 flex items-start gap-2.5 rounded-xl border border-[#b8430f]/40 bg-[#fdf0e8] p-4 text-xs leading-relaxed text-[#7c2d0b]"
                >
                  <AlertTriangle
                    className="mt-0.5 h-4 w-4 shrink-0 text-[#b8430f]"
                    aria-hidden="true"
                  />
                  <p>
                    <strong>現条件では12ヶ月以内の粗利回収が困難です：</strong>
                    売上LTVが高く見えても、粗利益率と獲得費を考慮すると採算が合いません。無理な導入はお勧めせず、無料診断にて単価構造・入会率・エリア需要を整理したうえで導入可否を判断します。
                  </p>
                </div>
              )}

              {result.viabilityStatus === "caution" && (
                <div
                  data-testid="roi-viability-banner"
                  className="mt-4 flex items-start gap-2.5 rounded-xl border border-[#b45309]/35 bg-[#fef7e6] p-4 text-xs leading-relaxed text-[#78350f]"
                >
                  <AlertTriangle
                    className="mt-0.5 h-4 w-4 shrink-0 text-[#b45309]"
                    aria-hidden="true"
                  />
                  <p>
                    <strong>慎重な検証が必要なレンジです：</strong>
                    粗利回収に時間がかかる、または粗利LTV/CACが2.5倍未満です。体験入会率の改善や、既存空き枠の活用で変動費を抑えられるかを事前診断で確認してください。
                  </p>
                </div>
              )}

              {result.viabilityStatus === "favorable" && (
                <div
                  data-testid="roi-viability-banner"
                  className="mt-4 flex items-start gap-2.5 rounded-xl border border-[#0a5c42]/30 bg-[#e6f4ee] p-4 text-xs leading-relaxed text-[#144333]"
                >
                  <CheckCircle2
                    className="mt-0.5 h-4 w-4 shrink-0 text-[#0a5c42]"
                    aria-hidden="true"
                  />
                  <p>
                    <strong>仮定条件では粗利ベースの採算が見込めるレンジです：</strong>
                    ただし体験純増数や入会率はエリア競合・季節性により変動します。導入前に現サイトと地域検索需要を無料診断で検証します。
                  </p>
                </div>
              )}

              <div className="mt-7">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="text-sm font-bold text-[#101815]">
                    累積粗利増分 vs 累計総投資額（初期＋月額＋追加獲得費）
                  </h3>
                  <div className="flex items-center gap-4 text-xs text-[#424d48]">
                    <span className="inline-flex items-center gap-1.5">
                      <span className="h-2.5 w-2.5 rounded-sm bg-[#0a5c42]" />
                      累積粗利増分
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <span className="h-2.5 w-2.5 rounded-sm bg-[#7c8882]" />
                      累計総投資額
                    </span>
                  </div>
                </div>

                <div className="mt-4 space-y-3.5">
                  {[
                    result.timeline[2],
                    result.timeline[5],
                    result.timeline[8],
                    result.timeline[11],
                  ].map((point) => {
                    const gpPct = Math.min(
                      100,
                      Math.round(
                        (point.cumulativeGrossProfitJpy / maxTimelineVal) * 100
                      )
                    )
                    const costPct = Math.min(
                      100,
                      Math.round(
                        (point.cumulativeTotalCostJpy / maxTimelineVal) * 100
                      )
                    )
                    return (
                      <div key={point.month} className="space-y-1.5">
                        <div className="flex flex-wrap items-center justify-between gap-2 text-xs tabular-nums">
                          <span className="font-bold text-[#101815]">
                            {point.month}ヶ月目
                            <span className="ml-2 font-normal text-[#424d48]">
                              （累計純増 {point.activeIncrementalMembers}名）
                            </span>
                          </span>
                          <span className="font-semibold text-[#101815]">
                            粗利 {formatYen(point.cumulativeGrossProfitJpy)} ／
                            投資 {formatYen(point.cumulativeTotalCostJpy)}
                          </span>
                        </div>
                        <div className="space-y-1">
                          <div className="h-2.5 w-full overflow-hidden rounded-full bg-[#eeece4]">
                            <div
                              className="h-full rounded-full bg-[#0a5c42] transition-all duration-200"
                              style={{ width: `${Math.max(gpPct, 2)}%` }}
                            />
                          </div>
                          <div className="h-2 w-full overflow-hidden rounded-full bg-[#eeece4]">
                            <div
                              className="h-full rounded-full bg-[#7c8882] transition-all duration-200"
                              style={{ width: `${Math.max(costPct, 2)}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              <div className="flex flex-col justify-between gap-3 rounded-xl border border-[#dddad0] bg-[#f6f5f0] p-4 sm:flex-row sm:items-center">
                <p className="text-xs font-semibold leading-relaxed text-[#101815]">
                  貴校のエリアで「月＋{input.additionalTrialsPerMonth}
                  件」の体験増が現実的か、無料診断で確認できます。
                </p>
                <a
                  href="#contact"
                  onClick={() =>
                    trackGrowthWebEvent("lp_hero_cta_click", {
                      cta_label: "simulator_to_free_audit",
                      destination: "#contact",
                      location: "growth_web_simulator",
                    })
                  }
                  className="inline-flex min-h-11 shrink-0 items-center justify-center gap-1.5 rounded-xl bg-[#b8430f] px-4 text-xs font-bold text-white transition-colors hover:bg-[#94340a]"
                >
                  この条件で無料診断を相談
                  <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                </a>
              </div>

              <div className="flex items-start gap-2 rounded-xl bg-[#f6f5f0] p-3.5 text-xs leading-relaxed text-[#424d48]">
                <Info
                  className="mt-0.5 h-4 w-4 shrink-0 text-[#0a5c42]"
                  aria-hidden="true"
                />
                <p>
                  上記は入力条件に基づく概算試算であり、将来の体験申込数・入会率・粗利を保証するものではありません。公開直後の立ち上がり期間（SEO浸透に1〜3ヶ月）や季節変動も踏まえ、導入前に現実的な期待値をすり合わせます。
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Wrapper>
  )
}
