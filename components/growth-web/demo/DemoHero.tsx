"use client"

import { ArrowDown, CalendarCheck, CheckCircle2, MapPin } from "lucide-react"
import { DemoHeroArtwork } from "@/components/growth-web/EditorialVisuals"
import { DEMO_SCHOOL_INFO } from "@/lib/growth-web/demo-school"
import { trackGrowthWebEvent } from "@/lib/growth-web/telemetry"

interface DemoHeroProps {
  onJumpToBooking: () => void
}

export function DemoHero({ onJumpToBooking }: DemoHeroProps) {
  const handleBookingClick = (action: "school_header" | "hero_primary") => {
    trackGrowthWebEvent("demo_hero_cta_click", {
      action,
      destination: "#trial-form",
      is_demo: true,
    })
    onJumpToBooking()
  }

  return (
    <>
      {/* School Navigation Header */}
      <header className="border-b border-[#dddad0] bg-[#faf9f5]">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3.5 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <span
              aria-hidden="true"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#0d5e43] font-mono text-xs font-extrabold text-white"
            >
              AF
            </span>
            <div>
              <p className="text-sm font-extrabold tracking-tight text-[#10211b] sm:text-base">
                {DEMO_SCHOOL_INFO.name}
              </p>
              <p className="text-[11px] font-medium text-[#41524b]">
                {DEMO_SCHOOL_INFO.demoBadge}
              </p>
            </div>
          </div>

          <nav
            aria-label="デモスクール内ナビゲーション"
            className="hidden items-center gap-1 lg:flex"
          >
            {[
              { href: "#safety", label: "6つの安心" },
              { href: "#schedule", label: "クラス・曜日" },
              { href: "#demo-pricing", label: "料金" },
              { href: "#trial-flow", label: "体験の流れ" },
              { href: "#coaches", label: "コーチ紹介" },
              { href: "#demo-faq", label: "よくある質問" },
            ].map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="inline-flex min-h-11 items-center rounded-lg px-3 text-sm font-semibold text-[#2a3b35] hover:bg-[#eeece4] hover:text-[#10211b]"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <button
            type="button"
            onClick={() => handleBookingClick("school_header")}
            className="hidden min-h-11 items-center gap-1.5 rounded-xl bg-[#b8430f] px-4 text-sm font-bold text-white shadow-sm transition-colors hover:bg-[#94340a] sm:inline-flex"
          >
            <CalendarCheck className="h-4 w-4" aria-hidden="true" />
            無料体験を予約
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section
        id="demo-hero"
        className="border-b border-[#dddad0] bg-[#faf9f5] pb-14 pt-8 sm:pb-20 sm:pt-14"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-8 lg:grid-cols-12 lg:gap-12">
            <div className="lg:col-span-6">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#e6f4ee] px-3 py-1 text-xs font-bold text-[#0d5e43]">
                  <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
                  {DEMO_SCHOOL_INFO.areaLabel}
                </span>
                <span className="rounded-full border border-[#c3bfb1] bg-white px-3 py-1 text-xs font-bold text-[#10211b]">
                  {DEMO_SCHOOL_INFO.ageRangeLabel}
                </span>
              </div>

              <h1 className="mt-5 text-[1.95rem] font-extrabold leading-[1.24] tracking-[-0.02em] text-[#10211b] sm:text-5xl sm:leading-[1.16]">
                「できた！」の笑顔が、
                <span className="block text-[#0d5e43]">
                  体を動かす好きを育てる。
                </span>
              </h1>

              <p className="mt-4 text-base leading-relaxed text-[#41524b] sm:text-lg">
                年長から小学6年生まで、未経験のお子さまも安心して始められる少人数制ジュニアサッカー＆運動基礎スクールです。
                保護者の当番なし・雨天振替対応で、ご家庭の負担を抑えて続けられます。
              </p>

              {/* Quick parent decision cues */}
              <ul className="mt-6 grid grid-cols-2 gap-2.5 text-xs font-semibold text-[#10211b] sm:text-sm">
                {[
                  "未経験・運動が苦手でも歓迎",
                  "親の当番・お茶出し一切なし",
                  "雨天中止は屋内枠へ無料振替",
                  "月謝以外の費用もすべて公開",
                ].map((point) => (
                  <li
                    key={point}
                    className="flex items-center gap-2 rounded-xl border border-[#dddad0] bg-white px-3 py-2.5"
                  >
                    <CheckCircle2
                      className="h-4 w-4 shrink-0 text-[#0d5e43]"
                      aria-hidden="true"
                    />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={() => handleBookingClick("hero_primary")}
                  className="inline-flex min-h-[52px] items-center justify-center gap-2 rounded-xl bg-[#b8430f] px-6 text-base font-bold text-white shadow-[0_12px_28px_-10px_rgba(184,67,15,0.55)] transition-colors hover:bg-[#94340a]"
                >
                  <CalendarCheck className="h-5 w-5" aria-hidden="true" />
                  60秒で無料体験を予約する
                </button>
                <a
                  href="#schedule"
                  onClick={() =>
                    trackGrowthWebEvent("demo_hero_cta_click", {
                      action: "hero_schedule",
                      destination: "#schedule",
                      is_demo: true,
                    })
                  }
                  className="inline-flex min-h-[52px] items-center justify-center gap-2 rounded-xl border border-[#0d5e43] bg-white px-6 text-base font-bold text-[#0d5e43] transition-colors hover:bg-[#e6f4ee]"
                >
                  学年・曜日からクラスを見る
                  <ArrowDown className="h-4 w-4" aria-hidden="true" />
                </a>
              </div>

              <p className="mt-3 text-xs text-[#41524b]">
                ※ボール・ビブスは無料貸出。体験当日の無理な入会勧誘はありません。
              </p>
            </div>

            <div className="lg:col-span-6">
              <DemoHeroArtwork />
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
