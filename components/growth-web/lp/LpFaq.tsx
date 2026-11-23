"use client"

import { useState } from "react"
import { SERIF_TEXT } from "@/lib/growth-web/lp-content"
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
    <section id="faq" className="gwl-faq" aria-labelledby="gwl-faq-h">
      <div className="gwl-wrap">
        <div className="gwl-faq-inner">
          <h2 id="gwl-faq-h" className="gwl-serif">
            {SERIF_TEXT.faqTitle}
          </h2>
          <div className="gwl-faq-list">
            {LP_FAQS.map((faq) => {
              const isOpen = openId === faq.id
              const panelId = `lp-faq-panel-${faq.id}`
              const buttonId = `lp-faq-btn-${faq.id}`
              return (
                <div key={faq.id} className="gwl-faq-item">
                  <h3>
                    <button
                      id={buttonId}
                      type="button"
                      aria-expanded={isOpen}
                      aria-controls={panelId}
                      onClick={() => handleToggle(faq.id)}
                      className="gwl-faq-btn"
                    >
                      <span>{faq.question}</span>
                    </button>
                  </h3>
                  <div
                    id={panelId}
                    role="region"
                    aria-labelledby={buttonId}
                    hidden={!isOpen}
                    className="gwl-faq-panel"
                  >
                    {faq.answer}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
