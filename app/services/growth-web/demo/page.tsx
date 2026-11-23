import type { Metadata } from "next"
import "@/app/services/growth-web/growth-web.css"
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
  "Cyber Knockによる民間スポーツスクール向け集客改善サイトの実働デモモデル。学年×拠点フィルタ、透明な料金表示、60秒無料体験予約フォーム、GA4イベント計測インスペクターを体験できます。"
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
  const jsonLd = buildGrowthWebDemoJsonLd(
    DEMO_CLASSES.map((c) => ({
      name: `${c.name}（${c.gradeLabel}）`,
      description: `${c.focusSummary} ${c.dayOfWeek} ${c.timeRange} / ${c.campusName}`,
    })),
    DEMO_FAQS
  )

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
