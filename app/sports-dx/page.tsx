import type { Metadata } from "next"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { SportsDxContent } from "./content"


const siteUrl = "https://cyberknock.pages.dev"

export const metadata: Metadata = {
  title: "自治体・スポーツ団体向けスポーツDX・AI実証支援 | Cyber Knock",
  description:
    "自治体・競技団体・地域スポーツクラブ向けに、AI・動画分析・Web・モバイルを活用したスポーツDXを支援。現場課題の整理、PoC・実証設計、開発、効果検証、継続改善まで一貫して対応します。",
  alternates: {
    canonical: "/sports-dx",
  },
  openGraph: {
    title: "自治体・スポーツ団体向けスポーツDX・AI実証支援 | Cyber Knock",
    description:
      "自治体・競技団体・地域スポーツクラブ向けに、AI・動画分析・Web・モバイルを活用したスポーツDXを支援。現場課題の整理、PoC・実証設計、開発、効果検証、継続改善まで一貫して対応します。",
    url: `${siteUrl}/sports-dx`,
    siteName: "Cyber Knock",
    type: "website",
    locale: "ja_JP",
  },
  twitter: {
    card: "summary_large_image",
    title: "自治体・スポーツ団体向けスポーツDX・AI実証支援 | Cyber Knock",
    description:
      "自治体・競技団体・地域スポーツクラブ向けに、AI・動画分析・Web・モバイルを活用したスポーツDXを支援。現場課題の整理、PoC・実証設計、開発、効果検証、継続改善まで一貫して対応します。",
  },
}

export default function SportsDxPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <SiteHeader />
      <SportsDxContent />
      <SiteFooter />
    </div>
  )
}
