import { FormCheckFigure } from "@/components/growth-web/lp/FormCheckFigure"
import { TrackedCta } from "@/components/growth-web/lp/TrackedCta"
import { LP_HERO, SERIF_TEXT } from "@/lib/growth-web/lp-content"
import { GROWTH_WEB_ROUTES, SERVICE_METADATA } from "@/lib/growth-web/service-lp"

/** Accessible name of the sports band (also asserted by tests/growth-web.test.mjs). */
const SPORTS_LABEL = "対応している民間スポーツスクール：野球・サッカー・体操・ダンス・バスケ・水泳など"

export function LpHero() {
  return (
    <>
      <div className="gwl-wrap">
        <section className="gwl-hero" aria-labelledby="gwl-h1">
          <div>
            <p className="gwl-eyebrow">{LP_HERO.eyebrow}</p>
            <h1 id="gwl-h1" className="gwl-h1">
              <span className="gwl-title-line"><span className="gwl-em">{SERIF_TEXT.heroTitleLine1}</span></span>
              <span className="gwl-title-line">{SERIF_TEXT.heroTitleLine2}</span>
            </h1>
            <p className="gwl-lede">
              {LP_HERO.ledeLead}
              <br className="gwl-br-pc" />
              <strong>{LP_HERO.ledeStrong}</strong>
            </p>
            <div className="gwl-cta-row">
              <TrackedCta
                id="gwl-hero-cta"
                href="#contact"
                event="lp_hero_cta_click"
                params={{
                  cta_label: "hero_free_site_audit",
                  destination: "#contact",
                  location: "growth_web_hero",
                }}
                className="gwl-btn gwl-btn-p"
              >
                {LP_HERO.ctaLabel}
                <ArrowIcon />
              </TrackedCta>
              <TrackedCta
                href={GROWTH_WEB_ROUTES.demo}
                event="lp_demo_cta_click"
                params={{
                  section: "hero",
                  cta_label: "hero_demo",
                  location: "growth_web_hero",
                }}
                className="gwl-link"
              >
                {LP_HERO.demoLabel}
              </TrackedCta>
            </div>
            <ul className="gwl-assure" aria-label="無料診断について">
              {LP_HERO.assurances.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <p className="gwl-price-line">
              <span>
                初期 <b>¥{SERVICE_METADATA.initialPriceExclTax}</b>
              </span>
              <span>
                月額 <b>¥{SERVICE_METADATA.monthlyPriceExclTax}</b>
              </span>
              <span>（税抜）</span>
              <a href="#pricing">料金と契約条件</a>
            </p>
          </div>
          <FormCheckFigure />
        </section>
      </div>

      <section className="gwl-sports" aria-labelledby="gwl-sports-h">
        <div className="gwl-wrap">
          <div className="gwl-sports-row">
            <h2 id="gwl-sports-h">
              対応している
              <br />
              民間スポーツスクール
            </h2>
            <ul aria-label={SPORTS_LABEL}>
              <li>
                <svg viewBox="0 0 32 32" aria-hidden="true">
                  <g fill="none" stroke="#131614" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round">
                    <path d="M16 28 4 16 16 4l12 12z" />
                    <path d="M14.4 26.4 16 28l1.6-1.6L16 24.8z" fill="#131614" />
                    <path d="M4 14.4 5.6 16 4 17.6 2.4 16zM16 2.4 17.6 4 16 5.6 14.4 4zM28 14.4 29.6 16 28 17.6 26.4 16z" />
                    <circle cx="16" cy="16" r="1.8" />
                  </g>
                </svg>
                野球
              </li>
              <li>
                <svg viewBox="0 0 32 32" aria-hidden="true">
                  <g fill="none" stroke="#131614" strokeWidth="1.5" strokeLinejoin="round">
                    <rect x="3" y="7" width="26" height="18" rx="1" />
                    <path d="M16 7v18" />
                    <circle cx="16" cy="16" r="3.5" />
                    <path d="M3 11.5h3.5v9H3M29 11.5h-3.5v9H29" />
                  </g>
                </svg>
                サッカー
              </li>
              <li>
                <svg viewBox="0 0 32 32" aria-hidden="true">
                  <g fill="none" stroke="#131614" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="26" height="3" rx="1" />
                    <path d="M8 14 6 27M24 14l2 13M7 21h18" />
                  </g>
                </svg>
                体操
              </li>
              <li>
                <svg viewBox="0 0 32 32" aria-hidden="true">
                  <g fill="none" stroke="#131614" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="5" width="26" height="22" rx="1" />
                    <path d="M3 9.5h26" />
                    <path d="m9 15 3 3m0-3-3 3M20 15l3 3m0-3-3 3M14.5 21l3 3m0-3-3 3" />
                  </g>
                </svg>
                ダンス
              </li>
              <li>
                <svg viewBox="0 0 32 32" aria-hidden="true">
                  <g fill="none" stroke="#131614" strokeWidth="1.5" strokeLinejoin="round">
                    <rect x="3" y="4" width="26" height="24" rx="1" />
                    <path d="M11.5 4v11h9V4" />
                    <path d="M11.5 15a4.5 4.5 0 0 0 9 0" />
                    <path d="M6 4v6a10 10 0 0 0 20 0V4" />
                    <circle cx="16" cy="7.5" r="1.5" />
                  </g>
                </svg>
                バスケ
              </li>
              <li>
                <svg viewBox="0 0 32 32" aria-hidden="true">
                  <g fill="none" stroke="#131614" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round">
                    <rect x="3" y="5" width="26" height="22" rx="1" />
                    <path d="M3 10.5h26M3 16h26M3 21.5h26" strokeDasharray="1 3" />
                    <path d="M7 5v22" />
                  </g>
                </svg>
                水泳
              </li>
              <li className="gwl-more">ほか 武道・複合スポーツなど</li>
            </ul>
          </div>
        </div>
      </section>
    </>
  )
}

export function ArrowIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
      <path d="M3 9h11M10 4.5 14.5 9 10 13.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
