import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import "./art-direction.css"
import { SiteAnalytics } from "@/components/site-analytics"


const siteUrl = "https://cyberknock.jp"
const siteTitle = "Cyber Knock | AI・システム開発・PoC・アプリ開発"
const siteDescription =
  "AI機能の技術検証（PoC）、動画解析、Web・モバイルアプリ開発から公開後の改善まで。自社アプリの開発・運用経験を活かし、業種を問わず新規サービス開発とAI活用を支援します。"

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
    title: "Cyber Knock | スポーツAI・動画解析のPoC・アプリ開発",
    description: siteDescription,
    url: siteUrl,
    siteName: "Cyber Knock",
    type: "website",
    locale: "ja_JP",
  },
  twitter: {
    card: "summary_large_image",
    title: "Cyber Knock | スポーツAI・動画解析のPoC・アプリ開発",
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


