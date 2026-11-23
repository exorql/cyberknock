"use client"

import { ChevronDown } from "lucide-react"
import { useState } from "react"
import { DEMO_FAQS } from "@/lib/growth-web/demo-school"
import { trackGrowthWebEvent } from "@/lib/growth-web/telemetry"

export function DemoFaq() {
  const [openId, setOpenId] = useState<string | null>(DEMO_FAQS[0]?.id ?? null)

  const toggle = (id: string) => {
    const next = openId === id ? null : id
    setOpenId(next)
    trackGrowthWebEvent("demo_faq_toggle", {
      question_id: id,
      expanded: next === id,
      is_demo: true,
    })
  }

  return (
    <section
      id="demo-faq"
      className="scroll-mt-24 border-b border-[#dddad0] bg-[#faf9f5] py-14 sm:py-20"
    >
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="text-left sm:text-center">
          <p className="font-mono text-xs font-semibold uppercase tracking-[0.16em] text-[#0d5e43]">
            PARENT FAQ
          </p>
          <h2 className="mt-2.5 text-2xl font-extrabold tracking-tight text-[#10211b] sm:text-3xl">
            体験前によくいただくご質問
          </h2>
        </div>

        <div className="mt-8 divide-y divide-[#dddad0] rounded-2xl border border-[#dddad0] bg-white">
          {DEMO_FAQS.map((faq) => {
            const isOpen = openId === faq.id
            const panelId = `demo-faq-panel-${faq.id}`
            const buttonId = `demo-faq-btn-${faq.id}`
            return (
              <div key={faq.id} className="px-5 sm:px-7">
                <h3>
                  <button
                    id={buttonId}
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => toggle(faq.id)}
                    className="flex min-h-14 w-full items-center justify-between gap-4 py-4 text-left text-sm font-bold text-[#10211b] hover:text-[#0d5e43] sm:text-base"
                  >
                    <span>{faq.question}</span>
                    <ChevronDown
                      className={`h-5 w-5 shrink-0 text-[#0d5e43] transition-transform duration-200 ${
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
                  className="pb-5 text-sm leading-relaxed text-[#41524b]"
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
