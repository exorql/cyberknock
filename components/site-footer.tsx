import Link from "next/link"
import { ExternalLink } from "lucide-react"

const CURRENT_YEAR = new Date().getFullYear()

const footerLinks = [
  { label: "スポーツDX支援", href: "/sports-dx" },
  { label: "開発事例", href: "/cases/ai-sports-trainer" },
  { label: "データ取り扱い", href: "/security" },
  { label: "プライバシーポリシー", href: "/privacy-policy" },
  { label: "お問い合わせ", href: "/#contact" },
]

export function SiteFooter() {
  return (
    <footer className="py-10 bg-slate-900 border-t border-slate-800">
      <div className="container max-w-6xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-start gap-8 mb-8">
          {/* ブランド */}
          <div className="shrink-0">
            <Link href="/" className="font-bold text-white text-sm">
              Cyber Knock
            </Link>
            <p className="text-xs text-slate-500 mt-1">
              スポーツ領域を中心としたAI・プロダクト開発
            </p>
          </div>

          {/* ナビ */}
          <nav className="flex flex-wrap items-center gap-x-6 gap-y-2" aria-label="フッターナビゲーション">
            {footerLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-xs text-slate-400 hover:text-white transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* AIスポーツトレーナーとの関係性 */}
        <div className="border-t border-slate-800 pt-6 mb-4">
          <p className="text-xs text-slate-500 leading-relaxed">
            <Link
              href="https://ai-sportstrainer.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-white transition-colors inline-flex items-center gap-0.5"
            >
              AIスポーツトレーナー
              <ExternalLink className="h-3 w-3 ml-0.5" />
            </Link>
            {" "}は、Cyber Knockが企画・開発・運営するスポーツ動画分析アプリです。
          </p>
        </div>

        <p className="text-xs text-slate-500">
          &copy; {CURRENT_YEAR} Cyber Knock
        </p>
      </div>
    </footer>
  )
}
