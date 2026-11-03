import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { site } from "@/lib/site"
export function SiteFooter() {
  return <footer className="site-footer"><div className="wrap">
    <div className="footer-top"><div><p className="section-label">Cyber Knock / サイバーノック</p><p className="footer-statement">つくる。その先の事業と、現場まで。</p><p className="footer-description">スポーツで磨いたAI・Web・モバイルの開発力を、新しいプロダクトと、使い続けられるサービスへ。</p></div>
      <nav className="footer-nav" aria-label="フッターナビゲーション">
        <Link href="/#services">支援内容</Link><Link href="/cases/ai-sports-trainer">開発・運用事例</Link><Link href="/sports-dx">スポーツDX・AI実証支援</Link><Link href="/ai-development">AI開発・PoC受託開発</Link><Link href="/#process">進め方</Link><Link href="/#profile">事業者情報</Link><Link href="/#contact" data-track="cta_click" data-location="footer">お問い合わせ <ArrowUpRight size={16} aria-hidden="true" /></Link><Link href="/security">データの取り扱い</Link><Link href="/privacy-policy">プライバシーポリシー</Link>
      </nav>
    </div>
    <div className="footer-wordmark" aria-hidden="true">Cyber Knock<span>↗</span></div>
    <div className="footer-bottom"><p>© {new Date().getFullYear()} Cyber Knock</p><a href={site.appUrl} target="_blank" rel="noopener noreferrer">自社プロダクト：AIスポーツトレーナー <ArrowUpRight size={14} aria-hidden="true" /><span className="sr-only">（新しいタブで開きます）</span></a></div>
  </div></footer>
}
