import { Check } from "lucide-react"
import { DIFFERENTIATION_PILLARS } from "@/lib/growth-web/service-lp"

export function DifferentiationPillars() {
  return (
    <section
      id="pillars"
      className="gw-dark-surface gw-dark-grid scroll-mt-24 border-b border-[#1f352c] bg-[#0e1b16] py-16 text-[#f6f5f0] sm:py-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div className="max-w-3xl">
            <p className="font-mono text-xs font-semibold uppercase tracking-[0.16em] text-[#6ee7b7]">
              03 / DIFFERENTIATION PILLARS
            </p>
            <h2 className="mt-3 text-2xl font-extrabold tracking-tight text-white sm:text-4xl">
              Cyber KnockのAI開発・SEO・CVR改善を、
              <span className="block text-[#6ee7b7]">
                体験申込の増加へ直結させる4つの柱
              </span>
            </h2>
          </div>
          <p className="max-w-md text-sm leading-relaxed text-[#c6d4cd]">
            単なるテンプレート流し込みではなく、保護者行動の設計から計測・月次改修までをソフトウェア開発の精度で回します。
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {DIFFERENTIATION_PILLARS.map((pillar) => (
            <article
              key={pillar.index}
              className="flex flex-col justify-between rounded-2xl border border-white/[0.14] bg-[#14261f]/90 p-6 sm:p-8"
            >
              <div>
                <div className="flex items-center justify-between gap-3 border-b border-white/[0.12] pb-4">
                  <span className="font-mono text-xs font-semibold uppercase tracking-[0.14em] text-[#6ee7b7]">
                    {pillar.tag}
                  </span>
                  <span className="font-mono text-sm font-bold text-[#a7f3d0]">
                    {pillar.index}
                  </span>
                </div>

                <h3 className="mt-5 text-xl font-bold leading-snug text-white">
                  {pillar.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-[#c6d4cd]">
                  {pillar.summary}
                </p>

                <ul className="mt-6 space-y-3 border-t border-white/10 pt-5">
                  {pillar.details.map((detail) => (
                    <li
                      key={detail}
                      className="flex items-start gap-2.5 text-sm leading-relaxed text-[#e6efe9]"
                    >
                      <Check
                        className="mt-0.5 h-4 w-4 shrink-0 text-[#6ee7b7]"
                        aria-hidden="true"
                      />
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
