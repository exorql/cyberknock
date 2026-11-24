import type { ReactNode } from "react"
import { DEMO_ASSURANCES } from "@/lib/growth-web/demo-content"

const ICONS: Record<(typeof DEMO_ASSURANCES)[number]["icon"], ReactNode> = {
  check: (
    <>
      <circle cx="16" cy="16" r="12" />
      <path d="M11 17l3.5 3.5L21.5 13" />
    </>
  ),
  cup: (
    <>
      <path d="M8 13h16v10a4 4 0 0 1-4 4h-8a4 4 0 0 1-4-4z" />
      <path d="M24 15h2a3 3 0 0 1 0 6h-2M5 5l22 22" />
    </>
  ),
  rain: (
    <>
      <path d="M9 20a6 6 0 1 1 1.5-11.8A8 8 0 0 1 25 12a5 5 0 0 1-1 9.9" />
      <path d="M12 24l-2 4M18 24l-2 4" />
    </>
  ),
  talk: (
    <>
      <path d="M6 8h20v13H14l-6 5v-5H6z" />
      <path d="M11 14h10" />
    </>
  ),
}

/** Four reassurance points for first-time parents, shown right under the class search. */
export function SafetyStandards() {
  return (
    <section className="gwd-assure" aria-label="はじめての方へ">
      <div className="gwd-wrap">
        <ul>
          {DEMO_ASSURANCES.map((item) => (
            <li key={item.title}>
              <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                {ICONS[item.icon]}
              </svg>
              <div>
                <b>{item.title}</b>
                <span>{item.body}</span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
