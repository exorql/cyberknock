import type { Metadata } from "next"
import { VideoPocCaseDetail } from "@/components/video-poc/case-detail"

const title = "サッカー選手追跡・プレー自動抽出PoC｜技術検証と課題 | Cyber Knock"
const description = "サッカー試合映像からの対象選手指定、追跡候補、区間確認、MP4書き出しの技術検証。自動抽出精度の課題とPoCで確かめるべき条件を整理します。"
export const metadata: Metadata = {
  title, description,
  alternates: { canonical: "/ai-video-analysis/soccer-player-tracking" },
  openGraph: { title, description, url: "https://cyberknock.pages.dev/ai-video-analysis/soccer-player-tracking", type: "website", locale: "ja_JP" },
  twitter: { card: "summary_large_image", title, description },
}
export default function SoccerPocPage() { return <VideoPocCaseDetail kind="soccer" /> }
