import { Trajectory } from "@/components/trajectory"
export function ProductVisual({ compact = false }: { compact?: boolean }) {
  return <figure className={`product-visual${compact ? " product-visual-compact" : ""}`}>
    <div className="visual-topline"><span><i /> 自社開発・運用</span><span className="mono">PRODUCT / 01</span></div>
    <div className="visual-stage">
    <Trajectory className="visual-trajectory" />
    <div className="phone-screen phone-secondary"><img src="/images/product/pitching-score.webp" srcSet="/images/product/pitching-score-320.webp 320w, /images/product/pitching-score-480.webp 480w, /images/product/pitching-score.webp 640w" sizes="(max-width: 600px) 30vw, (max-width: 1100px) 13vw, 190px" alt="AIスポーツトレーナーの実画面：競技別の評価とレーダーチャート" width="640" height="1385" loading={compact ? "lazy" : "eager"} decoding="async" /></div>
    <div className="phone-screen phone-primary"><img src="/images/product/pitching-feedback.webp" srcSet="/images/product/pitching-feedback-320.webp 320w, /images/product/pitching-feedback-480.webp 480w, /images/product/pitching-feedback.webp 640w" sizes="(max-width: 600px) 34vw, (max-width: 800px) 17vw, (max-width: 1100px) 15vw, 210px" alt="AIスポーツトレーナーの実画面：投球動画の動作分析とAIフィードバック" width="640" height="1385" loading={compact ? "lazy" : "eager"} fetchPriority={compact ? "auto" : "high"} decoding={compact ? "async" : "auto"} /></div>
    </div>
    <figcaption className="visual-caption"><div><span className="mono">AI SPORTS TRAINER</span><strong>AIスポーツトレーナー</strong></div><span className="visual-platform">iOS / Android<br />公開・運用中</span></figcaption>
  </figure>
}
