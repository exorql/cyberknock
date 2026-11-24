import type { Metadata } from "next"
import { preload } from "react-dom"
import "@/app/services/growth-web/growth-web.css"
import { HowItWorks } from "@/components/growth-web/lp/HowItWorks"
import { LpFaq } from "@/components/growth-web/lp/LpFaq"
import { LpHero } from "@/components/growth-web/lp/LpHero"
import { MobileStickyCta } from "@/components/growth-web/lp/MobileStickyCta"
import { ServiceInquiryForm } from "@/components/growth-web/lp/ServiceInquiryForm"
import { TrustAndPricing } from "@/components/growth-web/lp/TrustAndPricing"
import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import { LP_FAQS } from "@/lib/growth-web/service-lp"
import {
  buildGrowthWebLpJsonLd,
  serializeJsonLd,
} from "@/lib/growth-web/structured-data"

const pathname = "/services/growth-web"
const title =
  "Cyber Knock Growth Web｜民間スポーツスクール特化 ホームページ制作・集客改善 | Cyber Knock"
const description =
  "ホームページ制作そのものではなく、体験申込と問い合わせを増やし続ける民間スポーツスクール特化のWeb集客改善サービス。初期49,800円＋月額29,800円（税抜・先着3社限定）。実働デモサイトを公開中。"
const ogImage = "/images/og/cyberknock-b2b.png"

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: pathname,
  },
  openGraph: {
    type: "website",
    locale: "ja_JP",
    siteName: "Cyber Knock",
    title,
    description,
    url: `https://cyberknock.jp${pathname}`,
    images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: [ogImage],
  },
}

export default function GrowthWebServicePage() {
  const jsonLd = buildGrowthWebLpJsonLd(LP_FAQS)
  // The display face is the only font needed for the first paint of the H1.
  preload("/fonts/growth-web/gw-mincho-800.woff2", {
    as: "font",
    type: "font/woff2",
    crossOrigin: "anonymous",
  })

  return (
    <div className="gw-scope gwl-page min-h-screen bg-[#F1EFE9] text-[#131614]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }}
      />
      <SiteHeader />
      <main id="main-content" className="gwl-root">
        <LpHero />
        <HowItWorks />
        <TrustAndPricing />
        <LpFaq />
        <ServiceInquiryForm />
        <MobileStickyCta />
      </main>
      <SiteFooter />
    </div>
  )
}
