"use client"

import { useState } from "react"
import { DEMO_DISPLAY_TEXT } from "@/lib/growth-web/demo-content"
import { DEMO_FAQS } from "@/lib/growth-web/demo-school"
import { trackGrowthWebEvent } from "@/lib/growth-web/telemetry"

export function DemoFaq() {
  const [openId, setOpenId] = useState<string | null>(null)

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
    <section className="gwd-sec" id="faq" aria-labelledby="faq-title">
      <div className="gwd-wrap gwd-faq-grid">
        <div>
          <p className="gwd-eyebrow">FAQ</p>
          <h2 className="gwd-h2" id="faq-title">{DEMO_DISPLAY_TEXT.faqTitle}</h2>
        </div>
        <div className="gwd-faq" data-gwd-pin="7">
          {DEMO_FAQS.map((faq) => {
            const open = openId === faq.id
            return (
              <div className="gwd-faq-item" key={faq.id}>
                <h3>
                  <button
                    type="button"
                    id={`${faq.id}-q`}
                    aria-expanded={open}
                    aria-controls={`${faq.id}-a`}
                    onClick={() => toggle(faq.id)}
                    data-testid={`faq-${faq.id}`}
                  >
                    {faq.question}
                  </button>
                </h3>
                <div id={`${faq.id}-a`} role="region" aria-labelledby={`${faq.id}-q`} hidden={!open}>
                  <p>{faq.answer}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
