import { Trajectory } from "@/components/trajectory"
export function ProductVisual({ compact = false }: { compact?: boolean }) {
  return <figure className={`product-visual${compact ? " product-visual-compact" : ""}`}>
    <div className="visual-topline"><span><i /> 自社開発・運用</span><span className="mono">PRODUCT / 01</span></div>
    <div className="visual-stage">
    <Trajectory className="visual-trajectory" />
    <div className="phone-screen phone-secondary"><img src="/images/product/pitching-score.webp" alt="AIスポーツトレーナーの実画面：競技別の評価とレーダーチャート" width="640" height="1385" loading={compact ? "lazy" : "eager"} decoding="async" /></div>
    <div className="phone-screen phone-primary"><img src="/images/product/pitching-feedback.webp" alt="AIスポーツトレーナーの実画面：投球動画の動作分析とAIフィードバック" width="640" height="1385" loading={compact ? "lazy" : "eager"} fetchPriority={compact ? "auto" : "high"} decoding="async" /></div>
    </div>
    <figcaption className="visual-caption"><div><span className="mono">AI SPORTS TRAINER</span><strong>AIスポーツトレーナー</strong></div><span className="visual-platform">iOS / Android<br />公開・運用中</span></figcaption>
  </figure>
}
