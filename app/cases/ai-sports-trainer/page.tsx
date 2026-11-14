import type { Metadata } from "next"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { CaseStudyContent } from "./content"

const siteUrl = "https://cyberknock.jp"
const title = "AIスポーツトレーナー 開発・運用事例 | スポーツAI・動画分析 | Cyber Knock"
const description =
  "スポーツ動画分析、姿勢推定、動作解析、生成AIを組み合わせた「AIスポーツトレーナー」の開発・運用事例。企画からモバイルアプリ、クラウド、AI品質設計、継続改善まで紹介します。"
const ogImage = "/images/og/ai-sports-trainer-demo.png"

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: "/cases/ai-sports-trainer",
  },
  openGraph: {
    title,
    description,
    url: `${siteUrl}/cases/ai-sports-trainer`,
    siteName: "Cyber Knock",
    type: "website",
    locale: "ja_JP",
    images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: [ogImage],
  },
}

export default function CaseStudyPage() {
  return (
    <div className="site-shell">
      <SiteHeader />
      <CaseStudyContent />
      <SiteFooter />
    </div>
  )
}
