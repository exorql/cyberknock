"use client"
import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { ArrowUpRight, Menu, X } from "lucide-react"
const links = [
  { href: "/#services", label: "支援内容" },
  { href: "/cases/ai-sports-trainer", label: "開発事例" },
  { href: "/sports-dx", label: "スポーツDX" },
  { href: "/#profile", label: "Cyber Knockについて" },
]
export function BrandMark() {
  return <svg viewBox="0 0 36 36" width="32" height="32" fill="none" aria-hidden="true"><path d="M23 5H12L4 18l8 13h11M19 18 31 6M19 18l12 12" stroke="currentColor" strokeWidth="3.2" strokeLinejoin="round"/><circle cx="19" cy="18" r="3.4" fill="currentColor"/></svg>
}
export function SiteHeader() {
  const [open, setOpen] = useState(false)
  const toggle = useRef<HTMLButtonElement>(null)
  useEffect(() => {
    if (!open) return
    const escape = (event: KeyboardEvent) => { if (event.key === "Escape") { setOpen(false); toggle.current?.focus() } }
    document.addEventListener("keydown", escape)
    return () => document.removeEventListener("keydown", escape)
  }, [open])
  return <>
    <a href="#main-content" className="skip-link">本文へ移動する</a>
    <header className="site-header">
      <div className="wrap header-inner">
        <Link href="/" className="brand" aria-label="Cyber Knock ホーム" onClick={() => setOpen(false)}><BrandMark /><span>Cyber Knock</span></Link>
        <nav className="desktop-nav" aria-label="メインナビゲーション">{links.map(link => <Link key={link.href} href={link.href} prefetch={false}>{link.label}</Link>)}</nav>
        <div className="header-actions">
          <Link href="/#contact" className="button button-primary header-cta" data-track="cta_click" data-location="header" onClick={() => setOpen(false)}>相談する <ArrowUpRight size={17} aria-hidden="true" /></Link>
          <button ref={toggle} type="button" className="menu-toggle" aria-expanded={open} aria-controls="mobile-navigation" aria-label={open ? "メニューを閉じる" : "メニューを開く"} onClick={() => setOpen(!open)}>{open ? <X size={24} aria-hidden="true" /> : <Menu size={24} aria-hidden="true" />}</button>
        </div>
      </div>
      <nav id="mobile-navigation" className="mobile-nav" aria-label="モバイルナビゲーション" hidden={!open}>
        <div className="wrap">{links.map((link,i) => <Link key={link.href} href={link.href} prefetch={false} onClick={() => setOpen(false)}><span className="mono" aria-hidden="true">0{i+1}</span>{link.label}<ArrowUpRight size={18} aria-hidden="true" /></Link>)}<Link href="/#process" onClick={() => setOpen(false)}>ご相談からの進め方<ArrowUpRight size={18} aria-hidden="true" /></Link></div>
      </nav>
    </header>
  </>
}
