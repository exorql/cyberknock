import { RoiSimulator } from "@/components/growth-web/lp/RoiSimulator"
import { TrackedCta } from "@/components/growth-web/lp/TrackedCta"
import { PRICING_TERMS, SERIF_TEXT, TRUST } from "@/lib/growth-web/lp-content"
import { GROWTH_WEB_ROUTES, PROCESS_STEPS, SERVICE_METADATA } from "@/lib/growth-web/service-lp"

const buildDuration = PROCESS_STEPS[1]?.duration ?? ""

export function TrustAndPricing() {
  return (
    <section className="gwl-trust" id="trust" aria-labelledby="gwl-trust-h">
      <div className="gwl-wrap">
        <div className="gwl-sec-head">
          <h2 id="gwl-trust-h" className="gwl-serif">
            {SERIF_TEXT.trustTitleLine1}
            <br />
            {SERIF_TEXT.trustTitleLine2}
          </h2>
          <p className="gwl-lead">{TRUST.lead}</p>
        </div>

        <ul className="gwl-proofs">
          <li className="gwl-proof" id="demo">
            <p className="gwl-lbl">{TRUST.demo.label}</p>
            <h3>{TRUST.demo.title}</h3>
            <p>{TRUST.demo.body}</p>
            <ul>{TRUST.demo.points.map((p) => <li key={p}>{p}</li>)}</ul>
            <TrackedCta
              href={GROWTH_WEB_ROUTES.demo}
              event="lp_demo_cta_click"
              params={{ section: "demo_bridge", cta_label: "demo_bridge", location: "growth_web_demo_bridge" }}
              className="gwl-go gwl-link"
            >
              {TRUST.demo.cta} <span aria-hidden="true">↗</span>
            </TrackedCta>
          </li>
          <li className="gwl-proof">
            <p className="gwl-lbl">{TRUST.scope.label}</p>
            <h3>{TRUST.scope.title}</h3>
            <ul>
              <li><span><b>初期構築：</b>{TRUST.scope.initial}</span></li>
              <li><span><b>毎月：</b>{TRUST.scope.monthly}</span></li>
            </ul>
            <a className="gwl-go gwl-link" href="#pricing">{TRUST.scope.cta} <span aria-hidden="true">↓</span></a>
          </li>
          <li className="gwl-proof">
            <p className="gwl-lbl">{TRUST.deliverables.label}</p>
            <h3>{TRUST.deliverables.title}</h3>
            <p>{TRUST.deliverables.body}</p>
            <a className="gwl-go gwl-link" href="#sample-report">{TRUST.deliverables.cta} <span aria-hidden="true">↑</span></a>
          </li>
        </ul>

        <div className="gwl-pricing" id="pricing">
          <div className="gwl-pv">
            <div>
              <small>初期費用（税抜）</small>
              <strong>¥{SERVICE_METADATA.initialPriceExclTax}</strong>
              <span>税込 ¥{SERVICE_METADATA.initialPriceInclTax}</span>
            </div>
            <div>
              <small>月額（税抜）</small>
              <strong>¥{SERVICE_METADATA.monthlyPriceExclTax}</strong>
              <span>税込 ¥{SERVICE_METADATA.monthlyPriceInclTax}</span>
            </div>
          </div>
          <ul className="gwl-terms">
            <li><b>{PRICING_TERMS.pilot}</b>構築期間は{buildDuration}。</li>
            <li><b>契約：</b>{PRICING_TERMS.contract}</li>
            <li><b>権利：</b>{PRICING_TERMS.rights}</li>
          </ul>
        </div>

        <details className="gwl-roi">
          <summary>
            <span>
              {PRICING_TERMS.roiSummary}
              <small>{PRICING_TERMS.roiNote}</small>
            </span>
          </summary>
          <div className="gwl-roi-body">
            <RoiSimulator embedded />
          </div>
        </details>
      </div>
    </section>
  )
}
