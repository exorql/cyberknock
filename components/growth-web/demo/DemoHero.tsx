"use client"

import { useEffect, useId, useRef, useState } from "react"
import { DEMO_DISPLAY_TEXT, DEMO_IMAGE_BASE } from "@/lib/growth-web/demo-content"
import { trackGrowthWebEvent } from "@/lib/growth-web/telemetry"

const NAV = [
  { href: "#classes", label: "クラスと時間割" },
  { href: "#approach", label: "指導方針" },
  { href: "#demo-pricing", label: "料金" },
  { href: "#trial-form", label: "体験の申し込み" },
  { href: "#faq", label: "よくある質問" },
]

export function DemoLogo() {
  return (
    <>
      <svg viewBox="0 0 40 40" aria-hidden="true">
        <circle cx="20" cy="20" r="18.5" fill="#15603B" />
        <path d="M20 3.5v33M3.5 20h7M29.5 20h7" stroke="#F5F3EC" strokeWidth="1.6" />
        <circle cx="20" cy="20" r="6" fill="none" stroke="#F5F3EC" strokeWidth="1.6" />
        <circle cx="20" cy="20" r="2" fill="#FFC83A" />
      </svg>
      <span className="gwd-logo-t">
        <b>AOBA FIELD</b>
        <span>あおばフィールド スポーツアカデミー</span>
      </span>
    </>
  )
}

interface DemoHeaderProps {
  onJumpToBooking: () => void
}

export function DemoHeader({ onJumpToBooking }: DemoHeaderProps) {
  const [open, setOpen] = useState(false)
  const navId = useId()
  const btnRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false)
        btnRef.current?.focus()
      }
    }
    document.addEventListener("keydown", onKey)
    return () => document.removeEventListener("keydown", onKey)
  }, [open])

  return (
    <header className="gwd-header">
      <div className="gwd-wrap">
        <a className="gwd-logo" href="#top">
          <DemoLogo />
        </a>
        <nav id={navId} className={`gwd-nav${open ? " is-open" : ""}`} aria-label="スクールのメニュー">
          <ul>
            {NAV.map((item) => (
              <li key={item.href}>
                <a href={item.href} onClick={() => setOpen(false)}>
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <a
          className="gwd-btn gwd-btn-ink"
          href="#trial-form"
          onClick={(e) => {
            e.preventDefault()
            setOpen(false)
            trackGrowthWebEvent("demo_hero_cta_click", { action: "school_header", destination: "#trial-form", is_demo: true })
            onJumpToBooking()
          }}
        >
          <span className="l">無料体験を予約</span>
          <span className="s">体験予約</span>
        </a>
        <button
          ref={btnRef}
          type="button"
          className="gwd-menu-btn"
          aria-expanded={open}
          aria-controls={navId}
          aria-label={open ? "メニューを閉じる" : "メニューを開く"}
          onClick={() => setOpen((v) => !v)}
          data-testid="demo-menu-button"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M3 7h18M3 12h18M3 17h18" />}
          </svg>
        </button>
      </div>
    </header>
  )
}

interface DemoHeroProps {
  onJumpToBooking: () => void
}

export function DemoHero({ onJumpToBooking }: DemoHeroProps) {
  return (
    <section className="gwd-hero" id="top" aria-labelledby="demo-hero-title" data-testid="demo-hero">
      <figure className="gwd-hero-ph">
        <picture>
          <source
            media="(max-width: 767px)"
            type="image/avif"
            srcSet={`${DEMO_IMAGE_BASE}/hero-tall-480.avif 480w, ${DEMO_IMAGE_BASE}/hero-tall-720.avif 720w, ${DEMO_IMAGE_BASE}/hero-tall-828.avif 828w`}
            sizes="100vw"
          />
          <source
            media="(max-width: 767px)"
            type="image/webp"
            srcSet={`${DEMO_IMAGE_BASE}/hero-tall-480.webp 480w, ${DEMO_IMAGE_BASE}/hero-tall-720.webp 720w, ${DEMO_IMAGE_BASE}/hero-tall-828.webp 828w`}
            sizes="100vw"
          />
          <source
            type="image/avif"
            srcSet={`${DEMO_IMAGE_BASE}/hero-wide-1280.avif 1280w, ${DEMO_IMAGE_BASE}/hero-wide-1920.avif 1920w`}
            sizes="100vw"
          />
          <img
            src={`${DEMO_IMAGE_BASE}/hero-wide-1280.webp`}
            srcSet={`${DEMO_IMAGE_BASE}/hero-wide-1280.webp 1280w, ${DEMO_IMAGE_BASE}/hero-wide-1920.webp 1920w`}
            sizes="100vw"
            width={1280}
            height={756}
            alt="人工芝のコーンの間を、ボールを運んで進む小学生の足元（イメージ写真）"
            fetchPriority="high"
          />
        </picture>
        <figcaption className="gwd-credit">写真はイメージです（Unsplash）</figcaption>
      </figure>
      <div className="gwd-wrap">
        <div className="gwd-hero-copy">
          <p className="gwd-kicker">JUNIOR FOOTBALL &amp; MOVEMENT</p>
          <h1 id="demo-hero-title" data-gwd-pin="1">
            <span>
              <span className="q">「</span>
              {DEMO_DISPLAY_TEXT.heroLine1.slice(1)}
            </span>
            <span>{DEMO_DISPLAY_TEXT.heroLine2}</span>
          </h1>
          <p className="gwd-lead">
            年長〜小6のサッカー・運動教室。
            <br />
            ボールに触れる楽しさから、考えてプレーする力まで。
            <br />
            1クラス最大16名を、コーチ2名で見ています。
          </p>
          <dl className="gwd-facts">
            <div><dt>対象</dt><dd>年長〜小学6年生</dd></div>
            <div><dt>月謝</dt><dd>7,700円〜（税込・週1回）</dd></div>
            <div><dt>場所</dt><dd>二子玉川（屋外）・用賀（屋内）</dd></div>
            <div><dt>方針</dt><dd>ミスを叱らず、挑戦をほめる</dd></div>
          </dl>
          <div className="gwd-cta-row">
            <a
              className="gwd-btn gwd-btn-sun"
              href="#trial-form"
              data-gwd-pin="2"
              data-testid="hero-primary-cta"
              onClick={(e) => {
                e.preventDefault()
                trackGrowthWebEvent("demo_hero_cta_click", { action: "hero_primary", destination: "#trial-form", is_demo: true })
                onJumpToBooking()
              }}
            >
              無料体験を予約する
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </a>
            <span className="gwd-cta-sub">
              <span>体験は無料・当日の勧誘なし</span>
              <a
                href="#schedule"
                onClick={() =>
                  trackGrowthWebEvent("demo_hero_cta_click", { action: "hero_schedule", destination: "#schedule", is_demo: true })
                }
              >
                学年からクラスをさがす ↓
              </a>
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}

export function DemoMobileFacts() {
  return (
    <div className="gwd-wrap">
      <dl className="gwd-mfacts" aria-label="スクールの概要">
        <div><dt>対象</dt><dd>年長〜小6</dd></div>
        <div><dt>月謝</dt><dd>7,700円〜（税込）</dd></div>
        <div><dt>場所</dt><dd>二子玉川・用賀</dd></div>
        <div><dt>方針</dt><dd>叱らず、挑戦をほめる</dd></div>
      </dl>
    </div>
  )
}
