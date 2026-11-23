"use client"

import { ChevronDown } from "lucide-react"
import { useState } from "react"
import { LP_FAQS } from "@/lib/growth-web/service-lp"
import { trackGrowthWebEvent } from "@/lib/growth-web/telemetry"

export function LpFaq() {
  const [openId, setOpenId] = useState<string | null>(LP_FAQS[0]?.id ?? null)

  const handleToggle = (id: string) => {
    const nextOpen = openId === id ? null : id
    setOpenId(nextOpen)
    trackGrowthWebEvent("lp_faq_toggle", {
      question_id: id,
      expanded: nextOpen === id,
      location: "faq",
    })
  }

  return (
    <section
      id="faq"
      className="scroll-mt-24 border-b border-[#dddad0] bg-white py-16 sm:py-24"
    >
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="text-left sm:text-center">
          <p className="font-mono text-xs font-semibold uppercase tracking-[0.16em] text-[#0a5c42]">
            06 / FREQUENTLY ASKED QUESTIONS
          </p>
          <h2 className="mt-3 text-2xl font-extrabold tracking-tight text-[#101815] sm:text-4xl">
            導入前によくいただくご質問
          </h2>
        </div>

        <div className="mt-10 divide-y divide-[#dddad0] rounded-2xl border border-[#dddad0] bg-[#f6f5f0]/40">
          {LP_FAQS.map((faq) => {
            const isOpen = openId === faq.id
            const panelId = `lp-faq-panel-${faq.id}`
            const buttonId = `lp-faq-btn-${faq.id}`
            return (
              <div key={faq.id} className="px-5 sm:px-7">
                <h3>
                  <button
                    id={buttonId}
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => handleToggle(faq.id)}
                    className="flex min-h-14 w-full items-center justify-between gap-4 py-4 text-left text-sm font-bold text-[#101815] hover:text-[#0a5c42] sm:text-base"
                  >
                    <span>{faq.question}</span>
                    <ChevronDown
                      className={`h-5 w-5 shrink-0 text-[#0a5c42] transition-transform duration-200 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                      aria-hidden="true"
                    />
                  </button>
                </h3>
                <div
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  hidden={!isOpen}
                  className="pb-5 text-sm leading-relaxed text-[#38443f]"
                >
                  {faq.answer}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
