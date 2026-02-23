import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"

const inter = Inter({ subsets: ["latin", "latin-ext"] })

export const metadata: Metadata = {
  title: "Cyber Knock | 生成AIシステム開発・Web/アプリ受託開発・SEO×LLMO支援 | 東京・渋谷",
  description:
    "生成AI活用のシステム開発、Web・ネイティブアプリ受託開発、SEO×LLMOハイブリッド伴走支援。自社プロダクト（AIスポーツトレーナー・コレステAI）で培った実践力で、企画から運用まで一気通貫サポート。AI活用・新規プロダクト開発のご相談はCyber Knockへ。",
  keywords: ["生成AI開発", "AIシステム開発", "Web開発", "アプリ開発", "受託開発", "SEO", "LLMO", "AI活用", "東京", "渋谷"],
  openGraph: {
    title: "Cyber Knock | 生成AI × 開発で事業成長を加速",
    description: "AI活用のシステム開発からSEO×LLMO戦略まで。自社プロダクトで磨いた実践力で、お客様のビジネス成果にコミットします。",
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
