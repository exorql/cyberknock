"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ChevronDown, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"

const navLinks = [
  { label: "スポーツDX", href: "/sports-dx" },
  { label: "開発事例", href: "/cases/ai-sports-trainer" },
  { label: "セキュリティ", href: "/security" },
]

const topNavLinks = [
  { label: "支援領域", href: "/#services" },
  { label: "開発事例", href: "/#case-study" },
  { label: "進め方", href: "/#process" },
  { label: "プロフィール", href: "/#profile" },
]

export function SiteHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  const isTop = pathname === "/"

  const displayLinks = isTop ? topNavLinks : navLinks

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-slate-950/90 backdrop-blur-md border-b border-slate-800/50">
      <div className="container flex items-center justify-between h-16 max-w-6xl mx-auto px-6">
        {/* ロゴ */}
        <Link href="/" className="flex items-center gap-2 font-bold text-white tracking-tight">
          Cyber Knock
        </Link>

        {/* デスクトップナビ */}
        <nav className="hidden md:flex items-center gap-6">
          {displayLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-slate-400 hover:text-white transition-colors duration-200"
            >
              {link.label}
            </Link>
          ))}
          {!isTop && (
            <Link
              href="/"
              className="text-sm text-slate-400 hover:text-white transition-colors duration-200"
            >
              会社について
            </Link>
          )}
          <Button
            asChild
            size="sm"
            className="bg-cyan-600 hover:bg-cyan-500 text-white text-sm px-5"
          >
            <Link href="/#contact">
              <MessageSquare className="h-4 w-4 mr-1.5" />
              相談する
            </Link>
          </Button>
        </nav>

        {/* モバイルメニュートグル */}
        <button
          className="md:hidden flex items-center gap-1 text-slate-400 hover:text-white"
          onClick={() => setMobileMenuOpen((v) => !v)}
          aria-label="メニューを開く"
          aria-expanded={mobileMenuOpen}
        >
          <span className="text-sm">メニュー</span>
          <ChevronDown
            className={`h-4 w-4 transition-transform duration-200 ${mobileMenuOpen ? "rotate-180" : ""}`}
          />
        </button>
      </div>

      {/* モバイルメニュー */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-800 bg-slate-950 px-6 py-4 space-y-3">
          {displayLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="block text-sm text-slate-400 hover:text-white py-1"
              onClick={() => setMobileMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          {!isTop && (
            <Link
              href="/"
              className="block text-sm text-slate-400 hover:text-white py-1"
              onClick={() => setMobileMenuOpen(false)}
            >
              会社について
            </Link>
          )}
          <Button
            asChild
            size="sm"
            className="w-full bg-cyan-600 hover:bg-cyan-500 text-white mt-2"
          >
            <Link href="/#contact" onClick={() => setMobileMenuOpen(false)}>
              スポーツDX・開発について相談する
            </Link>
          </Button>
        </div>
      )}
    </header>
  )
}
