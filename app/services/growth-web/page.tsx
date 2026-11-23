import type { Metadata } from "next"
import "@/app/services/growth-web/growth-web.css"
import { DemoShowcaseBridge } from "@/components/growth-web/lp/DemoShowcaseBridge"
import { DifferentiationPillars } from "@/components/growth-web/lp/DifferentiationPillars"
import { LpFaq } from "@/components/growth-web/lp/LpFaq"
import { LpHero } from "@/components/growth-web/lp/LpHero"
import { PainAndComparison } from "@/components/growth-web/lp/PainAndComparison"
import { PricingAndProcess } from "@/components/growth-web/lp/PricingAndProcess"
import { RoiSimulator } from "@/components/growth-web/lp/RoiSimulator"
import { ServiceInquiryForm } from "@/components/growth-web/lp/ServiceInquiryForm"
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

  return (
    <div className="gw-scope min-h-screen bg-[#f6f5f0] text-[#101815]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }}
      />
      <SiteHeader />
      <main id="main-content">
        <LpHero />
        <PainAndComparison />
        <DifferentiationPillars />
        <RoiSimulator />
        <DemoShowcaseBridge />
        <PricingAndProcess />
        <LpFaq />
        <ServiceInquiryForm />
      </main>
      <SiteFooter />
    </div>
  )
}
