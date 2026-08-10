import type { Metadata } from "next"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { CaseStudyContent } from "./content"

const siteUrl = "https://cyberknock.pages.dev"

export const metadata: Metadata = {
  title: "AIスポーツトレーナー 開発・運用事例 | スポーツAI・動画分析 | Cyber Knock",
  description:
    "スポーツ動画分析、姿勢推定、動作解析、生成AIを組み合わせた「AIスポーツトレーナー」の開発・運用事例。企画からモバイルアプリ、クラウド、AI品質設計、継続改善まで紹介します。",
  alternates: {
    canonical: "/cases/ai-sports-trainer",
  },
  openGraph: {
    title: "AIスポーツトレーナー 開発・運用事例 | スポーツAI・動画分析 | Cyber Knock",
    description:
      "スポーツ動画分析、姿勢推定、動作解析、生成AIを組み合わせた「AIスポーツトレーナー」の開発・運用事例。企画からモバイルアプリ、クラウド、AI品質設計、継続改善まで紹介します。",
    url: `${siteUrl}/cases/ai-sports-trainer`,
    siteName: "Cyber Knock",
    type: "website",
    locale: "ja_JP",
  },
  twitter: {
    card: "summary_large_image",
    title: "AIスポーツトレーナー 開発・運用事例 | スポーツAI・動画分析 | Cyber Knock",
    description:
      "スポーツ動画分析、姿勢推定、動作解析、生成AIを組み合わせた「AIスポーツトレーナー」の開発・運用事例。企画からモバイルアプリ、クラウド、AI品質設計、継続改善まで紹介します。",
  },
}

export default function CaseStudyPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <SiteHeader />
      <CaseStudyContent />
      <SiteFooter />
    </div>
  )
}
