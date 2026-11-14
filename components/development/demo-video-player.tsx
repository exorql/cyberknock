import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import styles from "@/app/ai-development/development.module.css"

export type CorporateDemoVideoConfig = {
  src: string
  poster: string
  captionsSrc: string
  durationLabel?: string
  title?: string
}

/**
 * 権利確認済みの法人向けデモ動画（20〜25秒・Remotion/AppProofMotionV2）が
 * 本番公開承認されるまでは null を維持し、未確認動画を勝手に公開しない。
 */
export const verifiedCorporateDemoVideo: CorporateDemoVideoConfig | null = null

const demoScreens = [
  {
    step: "01",
    tag: "ACTUAL SCREEN / 映像・姿勢解析",
    title: "投球映像から姿勢・動作情報を抽出",
    description:
      "スマートフォン等で撮影した動画を入力し、骨格・関節角度・動作フェーズを解析して映像上に可視化します。",
    image: "/images/cases/01-analysis.jpg",
    width: 333,
    height: 720,
    alt: "AIスポーツトレーナーの実アプリ画面：野球の投球映像に骨格・関節角度の動作解析情報を重ねて表示",
  },
  {
    step: "02",
    tag: "ACTUAL SCREEN / AIフィードバック",
    title: "生成AIによる構造化フィードバック",
    description:
      "AIの生出力をそのまま表示せず、出力の構造化・検証・正規化を経て、利用者が理解しやすい評価と改善要点を提示します。",
    image: "/images/product/pitching-feedback.webp",
    srcSet:
      "/images/product/pitching-feedback-320.webp 320w, /images/product/pitching-feedback-480.webp 480w, /images/product/pitching-feedback.webp 640w",
    sizes: "(max-width: 600px) 78vw, (max-width: 900px) 42vw, 240px",
    width: 640,
    height: 1385,
    alt: "AIスポーツトレーナーの実アプリ画面：動画と連動したAIフィードバックおよび評価レポート",
  },
  {
    step: "03",
    tag: "ACTUAL SCREEN / 次のアクション提案",
    title: "課題に応じたメニュー提案とアプリ表示",
    description:
      "解析で特定した課題に対し、次に取り組むべき練習メニューと選定理由を提示。解析から行動変容までを1つのアプリ体験でつなぎます。",
    image: "/images/cases/03-training.png",
    width: 333,
    height: 720,
    alt: "AIスポーツトレーナーの実アプリ画面：分析結果に基づく練習ドリルと選定理由の表示",
  },
] as const

export function DemoVideoPlayer({
  video = verifiedCorporateDemoVideo,
}: {
  video?: CorporateDemoVideoConfig | null
}) {
  return (
    <div className={styles.demoShowcase} aria-label="AI動画解析・生成AIの技術デモ">
      <div className={styles.demoHeader}>
        <div>
          <span className={styles.demoBadge}>TECHNICAL DEMO / 実アプリ画面による技術紹介</span>
          <h3 className={styles.demoTitle}>
            映像入力から動作解析・AIフィードバック・画面表示までの一貫実装
          </h3>
        </div>
        <Link
          href="/demos/ai-sports-trainer"
          className={`text-link ${styles.demoHeaderLink}`}
          data-track="demo_click"
          data-location="ai_development"
        >
          対話型の実画面デモページへ <ArrowUpRight size={17} aria-hidden="true" />
        </Link>
      </div>

      {video ? (
        <figure className={styles.videoPlayerFrame}>
          <video
            className={styles.videoElement}
            controls
            playsInline
            preload="none"
            poster={video.poster}
            aria-label={
              video.title ??
              "AIスポーツトレーナーの技術デモ動画（野球投球映像の姿勢解析・AIフィードバック・アプリ表示）"
            }
          >
            <source src={video.src} type="video/mp4" />
            <track
              kind="captions"
              src={video.captionsSrc}
              srcLang="ja"
              label="日本語字幕"
              default
            />
            お使いのブラウザは動画再生に対応していません。下の実アプリ画面で体験の流れをご確認いただけます。
          </video>
          <figcaption className={styles.videoCaption}>
            <span>
              クリック・タップで再生（約{video.durationLabel ?? "20〜25秒"}・自動再生なし・字幕対応）
            </span>
            <span>
              ※映像内のアプリUIは実画面、導入説明パートは法人案内用に再構成した表現です。
            </span>
          </figcaption>
        </figure>
      ) : null}

      <div className={styles.demoStepsGrid}>
        {demoScreens.map((item) => (
          <article key={item.step} className={styles.demoStepCard}>
            <div className={styles.demoStepMeta}>
              <span className={styles.demoStepNumber}>STEP {item.step}</span>
              <span className={styles.demoStepTag}>{item.tag}</span>
            </div>
            <div className={styles.demoScreenBox}>
              <img
                src={item.image}
                srcSet={"srcSet" in item ? item.srcSet : undefined}
                sizes={"sizes" in item ? item.sizes : undefined}
                width={item.width}
                height={item.height}
                loading="lazy"
                decoding="async"
                alt={item.alt}
              />
            </div>
            <h4>{item.title}</h4>
            <p>{item.description}</p>
          </article>
        ))}
      </div>

      <div className={styles.demoFooterBar}>
        <p className={styles.demoDistinctionNote}>
          <strong>実アプリ画面と法人向けご案内の区別：</strong>
          上記3画面はすべて公開・運用中の「AIスポーツトレーナー」実アプリ画面（撮影時点）です。画面内のスコアはアプリ上の表示例であり、特定業務におけるAIの認識精度を一律に保証するものではありません。法人開発では貴社の対象映像・運用条件に合わせた評価設計を行います。
        </p>
        <div className={styles.demoFooterActions}>
          <Link
            href="/demos/ai-sports-trainer"
            className="text-link"
            data-track="demo_click"
            data-location="ai_development"
          >
            実画面デモを拡大して見る <ArrowUpRight size={17} aria-hidden="true" />
          </Link>
          <Link
            href="#contact"
            className="text-link"
            data-track="cta_click"
            data-location="ai_development"
          >
            自社の映像・業務で相談する <ArrowUpRight size={17} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </div>
  )
}
