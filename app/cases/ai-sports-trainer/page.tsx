import type { Metadata } from "next"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { CaseStudyContent } from "./content"

const siteUrl = "https://cyberknock.jp"
const title = "AIスポーツトレーナー 開発・運用事例 | スポーツAI・動画分析 | Cyber Knock"
const description =
  "AIスポーツトレーナーの開発・運用事例。短距離走の動画分析でAPIが応答しても結果が届かなかった1件を起点に、実動画での6試行、採点理由の欠落、推論原価、修正候補の公開判断を紹介します。"
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
