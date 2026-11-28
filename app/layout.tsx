import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import "./art-direction.css"
import { SiteAnalytics } from "@/components/site-analytics"


const siteUrl = "https://cyberknock.jp"
const siteTitle = "業務改善・自動化と業務システム開発 | Cyber Knock"
const siteDescription =
  "受発注・見積・報告の手作業やExcelの二重入力を整理し、既存ツールの活用から業務システムの導入・運用まで支援します。支援内容・料金の目安・無料相談のほか、AI開発や自社アプリの実績をご覧いただけます。"

export const metadata: Metadata = {
  title: siteTitle,
  description: siteDescription,
  metadataBase: new URL(siteUrl),
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: siteTitle,
    description: siteDescription,
    url: siteUrl,
    siteName: "Cyber Knock",
    type: "website",
    locale: "ja_JP",
    images: [{ url: "/images/og/business-operations.png", width: 1200, height: 630, alt: siteTitle }],
  },
  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description: siteDescription,
    images: ["/images/og/business-operations.png"],
  },
  verification: {
    google: "ib75LQ9trTgK_ExlWI9S7ZRaNfGtWg6O_8fJT3PN_d0",
  },
}

const organizationRef = {
  "@type": "Organization",
  "@id": `${siteUrl}/#organization`,
  name: "Cyber Knock",
  url: siteUrl,
}

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      ...organizationRef,
      description: siteDescription,
      address: {
        "@type": "PostalAddress",
        addressLocality: "三鷹市",
        addressRegion: "東京都",
        addressCountry: "JP",
      },
      makesOffer: [
        {
          "@type": "Offer",
          itemOffered: { "@id": "https://ai-sportstrainer.com/#app" },
        },
        {
          "@type": "Offer",
          itemOffered: { "@id": "https://choleste-coach.com/#app" },
        },
      ],
    },
    {
      "@type": "SoftwareApplication",
      "@id": "https://ai-sportstrainer.com/#app",
      name: "AIスポーツトレーナー",
      applicationCategory: "SportsApplication",
      operatingSystem: "iOS, Android",
      url: "https://ai-sportstrainer.com",
      creator: organizationRef,
      publisher: organizationRef,
    },
    {
      "@type": "MobileApplication",
      "@id": "https://choleste-coach.com/#app",
      name: "コレステAI（コレステAIコーチ）",
      applicationCategory: "HealthApplication",
      operatingSystem: "iOS",
      url: "https://choleste-coach.com",
      creator: organizationRef,
      publisher: organizationRef,
    },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ja">
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        {children}
        <SiteAnalytics />
      </body>
    </html>
  )
}


