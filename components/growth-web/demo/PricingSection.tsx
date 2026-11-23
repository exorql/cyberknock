"use client"

import { useState } from "react"
import { TRANSPARENT_PRICING } from "@/lib/growth-web/demo-school"
import { trackGrowthWebEvent } from "@/lib/growth-web/telemetry"

export function PricingSection() {
  const [siblingMode, setSiblingMode] = useState(false)

  const toggleMode = (nextSibling: boolean) => {
    setSiblingMode(nextSibling)
    trackGrowthWebEvent("demo_pricing_toggle", {
      discount_mode: nextSibling ? "sibling_second_child" : "standard",
      is_demo: true,
    })
  }

  return (
    <section
      id="demo-pricing"
      className="scroll-mt-24 border-b border-[#dddad0] bg-white py-14 sm:py-20"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div className="max-w-3xl">
            <p className="font-mono text-xs font-semibold uppercase tracking-[0.16em] text-[#0d5e43]">
              TRANSPARENT PRICING（デモ料金設定）
            </p>
            <h2 className="mt-2.5 text-2xl font-extrabold tracking-tight text-[#10211b] sm:text-3xl">
              月謝以外の費用まで、すべて事前に公開します
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-[#41524b] sm:text-base">
              体験後に「思ったより初期費用が高かった」とならないよう、入会金・年会費（スポーツ安全保険込み）・練習シャツ代まで1円単位で明示しています。
            </p>
          </div>

          <div
            role="group"
            aria-label="料金表示モード切替"
            className="inline-flex self-start rounded-xl border border-[#c3bfb1] bg-[#faf9f5] p-1 sm:self-auto"
          >
            <button
              type="button"
              aria-pressed={!siblingMode}
              onClick={() => toggleMode(false)}
              className={`min-h-10 rounded-lg px-3.5 text-xs font-bold transition-colors ${
                !siblingMode
                  ? "bg-[#0d5e43] text-white"
                  : "text-[#2a3b35] hover:bg-[#eeece4]"
              }`}
            >
              通常（1名）
            </button>
            <button
              type="button"
              aria-pressed={siblingMode}
              onClick={() => toggleMode(true)}
              className={`min-h-10 rounded-lg px-3.5 text-xs font-bold transition-colors ${
                siblingMode
                  ? "bg-[#0d5e43] text-white"
                  : "text-[#2a3b35] hover:bg-[#eeece4]"
              }`}
            >
              兄弟2人目割引
            </button>
          </div>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-12">
          {/* Monthly tuition tiers */}
          <div className="rounded-2xl border border-[#dddad0] bg-[#faf9f5] p-6 lg:col-span-7">
            <h3 className="text-base font-bold text-[#10211b]">
              月謝一覧（税込・デモ料金）
            </h3>
            <div className="mt-4 divide-y divide-[#dddad0]">
              {TRANSPARENT_PRICING.tiers.map((tier) => {
                const effectivePrice = siblingMode
                  ? tier.monthlyJpy - TRANSPARENT_PRICING.siblingDiscountMonthlyJpy
                  : tier.monthlyJpy
                return (
                  <div
                    key={tier.name}
                    className="flex flex-wrap items-center justify-between gap-3 py-4"
                  >
                    <div>
                      <p className="text-sm font-bold text-[#10211b]">
                        {tier.name}
                      </p>
                      <p className="mt-0.5 text-xs text-[#41524b]">
                        対象：{tier.target}｜{tier.note}
                      </p>
                    </div>
                    <div className="text-right tabular-nums">
                      {siblingMode && (
                        <span className="mr-2 text-xs text-[#41524b] line-through">
                          ¥{tier.monthlyJpy.toLocaleString("ja-JP")}
                        </span>
                      )}
                      <span className="text-xl font-extrabold text-[#0d5e43]">
                        ¥{effectivePrice.toLocaleString("ja-JP")}
                      </span>
                      <span className="text-xs font-medium text-[#41524b]">
                        {" "}
                        / 月
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Initial & other transparent fees */}
          <div className="rounded-2xl border border-[#dddad0] bg-white p-6 lg:col-span-5">
            <h3 className="text-base font-bold text-[#10211b]">
              月謝以外にかかる費用（税込・全額公開）
            </h3>
            <ul className="mt-4 space-y-4 text-sm">
              <li className="flex items-baseline justify-between gap-3 border-b border-[#eeece4] pb-3 tabular-nums">
                <div>
                  <p className="font-bold text-[#10211b]">初回体験レッスン</p>
                  <p className="text-xs text-[#41524b]">
                    レクリエーション保険・ボール貸出込み
                  </p>
                </div>
                <span className="text-lg font-extrabold text-[#b8430f]">
                  無料（¥0）
                </span>
              </li>

              <li className="flex items-baseline justify-between gap-3 border-b border-[#eeece4] pb-3 tabular-nums">
                <div>
                  <p className="font-bold text-[#10211b]">入会金（初回のみ）</p>
                  <p className="text-xs text-[#41524b]">
                    {TRANSPARENT_PRICING.siblingEnrollmentDiscountNote}
                  </p>
                </div>
                <span className="text-lg font-extrabold text-[#10211b]">
                  {siblingMode
                    ? "¥0（兄弟割）"
                    : `¥${TRANSPARENT_PRICING.enrollmentFeeJpy.toLocaleString("ja-JP")}`}
                </span>
              </li>

              <li className="flex items-baseline justify-between gap-3 border-b border-[#eeece4] pb-3 tabular-nums">
                <div>
                  <p className="font-bold text-[#10211b]">
                    年会費（スポーツ安全保険含む）
                  </p>
                  <p className="text-xs text-[#41524b]">
                    毎年度4月更新・保険手続き代行込み
                  </p>
                </div>
                <span className="text-lg font-extrabold text-[#10211b]">
                  ¥
                  {TRANSPARENT_PRICING.annualInsuranceAndAdminFeeJpy.toLocaleString(
                    "ja-JP"
                  )}
                </span>
              </li>

              <li className="flex items-baseline justify-between gap-3 tabular-nums">
                <div>
                  <p className="font-bold text-[#10211b]">
                    指定練習シャツ（希望購入）
                  </p>
                  <p className="text-xs text-[#41524b]">
                    手持ちの体操服でも受講可能（強制購入なし）
                  </p>
                </div>
                <span className="text-lg font-extrabold text-[#10211b]">
                  ¥{TRANSPARENT_PRICING.uniformSetJpy.toLocaleString("ja-JP")}
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
