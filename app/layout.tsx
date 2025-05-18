import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"

const inter = Inter({ subsets: ["latin", "latin-ext"] })

export const metadata: Metadata = {
  title: "Cyber Knock - 生成AIシステム開発・Webサービス開発",
  description:
    "最先端の生成AIと確かな開発力で、あなたのビジネスを次のステージへ。Cyber Knockは、お客様の独自の要件に最適化されたAIシステム開発、Webサービス・アプリ開発、そして自社プロダクトで培った知見を活かし、業務効率の飛躍的向上と新しい顧客体験の創出を実現します。",
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
