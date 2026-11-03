import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import "./art-direction.css"
import { SiteAnalytics } from "@/components/site-analytics"


const siteUrl = "https://cyberknock.pages.dev"
const siteTitle = "Cyber Knock | スポーツAI・Web・モバイルの開発パートナー"
const siteDescription =
  "自社プロダクトを開発・運用する経験を、あなたの事業へ。スポーツAI・動画分析、Web・モバイルの新規開発、AI品質改善、自治体・競技団体の実証を、企画から運用まで支援します。"

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
    title: "Cyber Knock | つくる。育てる。事業を、動かす。",
    description: siteDescription,
    url: siteUrl,
    siteName: "Cyber Knock",
    type: "website",
    locale: "ja_JP",
  },
  twitter: {
    card: "summary_large_image",
    title: "Cyber Knock | つくる。育てる。事業を、動かす。",
    description: siteDescription,
  },
  verification: {
    google: "ib75LQ9trTgK_ExlWI9S7ZRaNfGtWg6O_8fJT3PN_d0",
  },
}

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Cyber Knock",
  url: siteUrl,
  description: siteDescription,
  address: {
    "@type": "PostalAddress",
    addressLocality: "三鷹市",
    addressRegion: "東京都",
    addressCountry: "JP",
  },
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


