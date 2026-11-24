import type { Metadata } from "next"
import "./demo.css"
import { preload } from "react-dom"
import { DemoSportsSchoolApp } from "@/components/growth-web/demo/DemoSportsSchoolApp"
import { DEMO_CLASSES, DEMO_FAQS } from "@/lib/growth-web/demo-school"
import {
  buildGrowthWebDemoJsonLd,
  serializeJsonLd,
} from "@/lib/growth-web/structured-data"

const pathname = "/services/growth-web/demo"
const title =
  "あおばフィールド スポーツアカデミー【デモサイト】｜Cyber Knock Growth Web"
const description =
  "Cyber Knockによる民間スポーツスクール向け集客改善サイトの実働デモモデル。学年・曜日・拠点で探せるクラス検索、透明な料金表示、無料体験の申込フォーム、経営者向けのGA4計測モードを体験できます。"
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

export default function GrowthWebDemoPage() {
  // LCP image (art-directed per breakpoint), then the ~11 KB display-font subset.
  preload("/images/growth-web-demo/hero-tall-480.avif", {
    as: "image",
    type: "image/avif",
    imageSrcSet: "/images/growth-web-demo/hero-tall-480.avif 480w, /images/growth-web-demo/hero-tall-720.avif 720w, /images/growth-web-demo/hero-tall-828.avif 828w",
    imageSizes: "100vw",
    media: "(max-width: 767px)",
    fetchPriority: "high",
  })
  preload("/images/growth-web-demo/hero-wide-1280.avif", {
    as: "image",
    type: "image/avif",
    imageSrcSet: "/images/growth-web-demo/hero-wide-1280.avif 1280w, /images/growth-web-demo/hero-wide-1920.avif 1920w",
    imageSizes: "100vw",
    media: "(min-width: 768px)",
    fetchPriority: "high",
  })
  const jsonLd = buildGrowthWebDemoJsonLd(
    DEMO_CLASSES.map((c) => ({
      name: `${c.name}（${c.gradeLabel}）`,
      description: `${c.focusSummary} ${c.dayOfWeek} ${c.timeRange} / ${c.campusName}`,
    })),
    DEMO_FAQS
  )

  preload("/fonts/growth-web-demo/zen-kaku-gothic-new-900.woff2", { as: "font", type: "font/woff2", crossOrigin: "anonymous" })

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }}
      />
      <DemoSportsSchoolApp />
    </>
  )
}
