import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"

const inter = Inter({ subsets: ["latin", "latin-ext"] })

export const metadata: Metadata = {
  title: "Cyber Knock | AIプロダクト開発。企画から、収益化まで。 | 東京・渋谷",
  description:
    "自社AIアプリの企画・開発・収益化を一人で完結した開発者が、御社のプロダクト開発を支援。生成AIシステム・Web/アプリ開発からSEO×LLMO戦略まで、企画・設計・開発・運用をワンストップで。",
  keywords: ["生成AI開発", "AIシステム開発", "Web開発", "アプリ開発", "受託開発", "SEO", "LLMO", "AI活用", "東京", "渋谷"],
  openGraph: {
    title: "Cyber Knock | AIプロダクト開発。企画から、収益化まで。",
    description: "自社AIアプリを企画から収益化まで一人で完結。その実践知をもとに、生成AIシステム・アプリ開発・SEO×LLMO戦略を支援します。",
    type: "website",
    locale: "ja_JP",
  },
  verification: {
    google: "ib75LQ9trTgK_ExlWI9S7ZRaNfGtWg6O_8fJT3PN_d0",
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
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
