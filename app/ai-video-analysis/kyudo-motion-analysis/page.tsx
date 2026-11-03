import type { Metadata } from "next"
import { VideoPocCaseDetail } from "@/components/video-poc/case-detail"

const title = "弓道の姿勢推定・動作軌跡解析PoC｜技術検証と課題 | Cyber Knock"
const description = "弓道の一射を対象に、八節の動作候補時刻、姿勢・関節角度・手首軌跡の可視化を試作。精度・撮影条件・人による確認を含めたPoCの進め方を紹介します。"
export const metadata: Metadata = {
  title, description,
  alternates: { canonical: "/ai-video-analysis/kyudo-motion-analysis" },
  openGraph: { title, description, url: "https://cyberknock.pages.dev/ai-video-analysis/kyudo-motion-analysis", type: "website", locale: "ja_JP" },
  twitter: { card: "summary_large_image", title, description },
}
export default function KyudoPocPage() { return <VideoPocCaseDetail kind="kyudo" /> }
