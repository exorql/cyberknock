import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"

const inter = Inter({ subsets: ["latin", "latin-ext"] })

const siteUrl = "https://cyberknock.pages.dev"
const siteTitle = "Cyber Knock | スポーツ領域のAI・プロダクト開発パートナー"
const siteDescription =
  "自社でスポーツAI動画分析アプリを開発・運用する知見をもとに、スポーツ領域の新規サービスやAI機能を、要件整理からWeb・モバイル開発、リリース後の改善まで支援します。"

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
    title: "Cyber Knock | スポーツ領域の新しいサービスを、企画から開発・改善まで。",
    description: siteDescription,
    url: siteUrl,
    siteName: "Cyber Knock",
    type: "website",
    locale: "ja_JP",
  },
  twitter: {
    card: "summary_large_image",
    title: "Cyber Knock | スポーツ領域の新しいサービスを、企画から開発・改善まで。",
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
    streetAddress: "道玄坂1丁目10番8号 渋谷道玄坂東急ビル2F−C",
    addressLocality: "渋谷区",
    addressRegion: "東京都",
    postalCode: "150-0043",
    addressCountry: "JP",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ja" suppressHydrationWarning>
      <body className={inter.className}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}

