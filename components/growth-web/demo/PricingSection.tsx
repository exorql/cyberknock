"use client"

import { useState } from "react"
import { DEMO_DISPLAY_TEXT } from "@/lib/growth-web/demo-content"
import { TRANSPARENT_PRICING } from "@/lib/growth-web/demo-school"
import { trackGrowthWebEvent } from "@/lib/growth-web/telemetry"

const yen = (n: number) => n.toLocaleString("ja-JP")

/** Tier label/target split for the table ("キッズ運動基礎（週1・60分）" → name + "60分"). */
function tierParts(name: string): { title: string; minutes: string } {
  const m = name.match(/^(.*?)（週1・(\d+分)）$/)
  return m ? { title: m[1], minutes: m[2] } : { title: name, minutes: "" }
}

export function PricingSection() {
  const [siblingMode, setSiblingMode] = useState(false)
  const p = TRANSPARENT_PRICING
  const discount = siblingMode ? p.siblingDiscountMonthlyJpy : 0
  const enrollment = siblingMode ? 0 : p.enrollmentFeeJpy
  const exampleTier = p.tiers.find((t) => t.name.startsWith("U-9")) ?? p.tiers[0]
  const exampleMonthly = exampleTier.monthlyJpy - discount
  const initialTotal = enrollment + p.annualInsuranceAndAdminFeeJpy + p.uniformSetJpy

  const toggleMode = (nextSibling: boolean) => {
    if (nextSibling === siblingMode) return
    setSiblingMode(nextSibling)
    trackGrowthWebEvent("demo_pricing_toggle", {
      discount_mode: nextSibling ? "sibling_second_child" : "standard",
      is_demo: true,
    })
  }

  return (
    <section className="gwd-sec" id="demo-pricing" aria-labelledby="pricing-title">
      <div className="gwd-wrap">
        <div className="gwd-sec-h">
          <div>
            <p className="gwd-eyebrow">PRICING</p>
            <h2 className="gwd-h2" id="pricing-title">{DEMO_DISPLAY_TEXT.pricingTitle}</h2>
            <p className="gwd-note" style={{ marginTop: 10 }}>
              月謝以外にかかる費用も、ここに書いてあるものだけです。表示はすべて税込・デモ用の設定です。
            </p>
          </div>
          <div className="gwd-seg" role="group" aria-label="料金の表示" data-gwd-pin="5">
            <button type="button" aria-pressed={!siblingMode} onClick={() => toggleMode(false)}>
              1人目の料金
            </button>
            <button type="button" aria-pressed={siblingMode} onClick={() => toggleMode(true)} data-testid="pricing-sibling">
              きょうだい2人目
            </button>
          </div>
        </div>
        <div className="gwd-pr-grid">
          <table className="gwd-ptable">
            <caption className="gwd-sr">
              クラス別の月謝（{siblingMode ? "きょうだい2人目" : "1人目"}・税込）
            </caption>
            <thead>
              <tr>
                <th scope="col">クラス（週1回）</th>
                <th scope="col">月謝</th>
              </tr>
            </thead>
            <tbody>
              {p.tiers.map((tier) => {
                const { title, minutes } = tierParts(tier.name)
                return (
                  <tr key={tier.name}>
                    <th scope="row">
                      {title}
                      <small>
                        {tier.target}
                        {minutes && `・${minutes}`}
                      </small>
                    </th>
                    <td>
                      {siblingMode && (
                        <s>
                          <span className="gwd-sr">通常</span>
                          {yen(tier.monthlyJpy)}円
                        </s>
                      )}
                      <b className="gwd-num">{yen(tier.monthlyJpy - discount)}</b>円
                      <small>{tier.note}</small>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          <div className="gwd-initial">
            <h3>入会時にかかる費用</h3>
            <dl>
              <div>
                <dt>初回の体験レッスン</dt>
                <dd>無料</dd>
              </div>
              <div>
                <dt>入会金{siblingMode && "（2人目以降は無料）"}</dt>
                <dd>{yen(enrollment)}円</dd>
              </div>
              <div>
                <dt>年会費（スポーツ安全保険込み）</dt>
                <dd>{yen(p.annualInsuranceAndAdminFeeJpy)}円</dd>
              </div>
              <div>
                <dt>練習シャツ・パンツ</dt>
                <dd>{yen(p.uniformSetJpy)}円</dd>
              </div>
            </dl>
            <details>
              <summary>例：U-9基礎クラスに入会した月の合計</summary>
              <dl aria-live="polite">
                <div>
                  <dt>入会時の費用（上の合計）</dt>
                  <dd>{yen(initialTotal)}円</dd>
                </div>
                <div>
                  <dt>初月の月謝</dt>
                  <dd>{yen(exampleMonthly)}円</dd>
                </div>
                <div className="sum">
                  <dt>合計</dt>
                  <dd className="gwd-num">{yen(initialTotal + exampleMonthly)}円</dd>
                </div>
              </dl>
            </details>
            <p className="gwd-note">
              きょうだい割引：2人目から月謝{yen(p.siblingDiscountMonthlyJpy)}円引き・入会金なし。ボールとビブスは無料で貸し出します。
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
