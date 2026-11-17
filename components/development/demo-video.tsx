"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { ArrowUpRight, Play, RotateCcw } from "lucide-react"
import { markDemoVideoStarted, trackEvent, type AnalyticsEvent } from "@/lib/analytics"
import { dueDemoMilestones, type DemoMediaEvent, type DemoMilestone } from "@/lib/demo-video-progress"
import styles from "@/app/ai-development/development.module.css"
import type { CorporateDemoVideoConfig } from "./demo-video-player"

type Stage = "poster" | "player" | "error"

const milestoneEvents: Record<DemoMilestone, AnalyticsEvent> = {
  start: "b2b_demo_video_start",
  "50": "b2b_demo_video_50",
  complete: "b2b_demo_video_complete",
}

/**
 * Click-to-play facade: until the visitor asks for the video, only a lazy-loaded
 * poster image is requested. No autoplay, no video bytes on initial page load.
 */
export function DemoVideo({ video }: { video: CorporateDemoVideoConfig }) {
  const [stage, setStage] = useState<Stage>("poster")
  const [attempt, setAttempt] = useState(0)
  const sent = useRef(new Set<DemoMilestone>())
  const startOnMount = useRef(false)
  const retryButton = useRef<HTMLButtonElement | null>(null)
  const stageRef = useRef<HTMLDivElement | null>(null)
  const [posterWanted, setPosterWanted] = useState(false)
  const transcriptId = `${video.videoId}-transcript`

  // Native lazy-loading starts ~1250-2500px early and competed with the hero on mobile,
  // so the poster is requested only when the player is about to scroll into view.
  useEffect(() => {
    const node = stageRef.current
    if (!node || posterWanted) return
    if (typeof IntersectionObserver === "undefined") { setPosterWanted(true); return }
    const observer = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) { setPosterWanted(true); observer.disconnect() }
    }, { rootMargin: "320px 0px" })
    observer.observe(node)
    return () => observer.disconnect()
  }, [posterWanted])

  function report(element: HTMLVideoElement, mediaEvent: DemoMediaEvent) {
    if (mediaEvent === "play") markDemoVideoStarted()
    const due = dueDemoMilestones(sent.current, {
      event: mediaEvent,
      currentTime: element.currentTime,
      duration: element.duration,
      fallbackDuration: video.durationSeconds,
    })
    for (const milestone of due) {
      // Each milestone is sent at most once per page view, even after replay or retry.
      sent.current.add(milestone)
      trackEvent(milestoneEvents[milestone], {
        video_id: video.videoId,
        video_duration: String(video.durationSeconds),
        placement: video.placement,
      })
    }
  }

  const attachVideo = useCallback((node: HTMLVideoElement | null) => {
    if (!node || !startOnMount.current) return
    startOnMount.current = false
    // Runs during the click's commit, so play() keeps the user gesture on iOS/Android.
    node.focus({ preventScroll: true })
    node.play().catch(() => { /* Native controls remain available if the browser defers playback. */ })
  }, [])

  function openPlayer() {
    startOnMount.current = true
    setAttempt((value) => value + 1)
    setStage("player")
  }

  // Focus moves from the removed <video> to the retry action so keyboard users are not lost.
  useEffect(() => {
    if (stage === "error") retryButton.current?.focus()
  }, [stage])

  return (
    <figure className={styles.videoPlayerFrame} aria-labelledby={`${video.videoId}-title`}>
      <p id={`${video.videoId}-title`} className="sr-only">{video.title}</p>
      <div ref={stageRef} className={styles.videoStage}>
        {stage === "player" ? (
          <video
            key={attempt}
            ref={attachVideo}
            className={styles.videoElement}
            src={video.src}
            poster={video.poster}
            width={1920}
            height={1080}
            controls
            muted
            playsInline
            preload="auto"
            aria-label={video.title}
            aria-describedby={transcriptId}
            // "playing" (not "play"): a start is counted only once frames actually render,
            // so a failed load never reports a view.
            onPlaying={(event) => report(event.currentTarget, "play")}
            onTimeUpdate={(event) => report(event.currentTarget, "progress")}
            onEnded={(event) => report(event.currentTarget, "ended")}
            onError={() => setStage("error")}
          >
            {/* Off by default: the cues repeat the on-screen headlines and would cover the
                source/score notes at the bottom of the frame. Viewers can enable them with CC. */}
            <track kind="captions" src={video.captionsSrc} srcLang="ja" label="日本語字幕" />
          </video>
        ) : (
          <>
            {posterWanted ? (
              <img
                className={styles.videoPoster}
                src={video.poster}
                width={1920}
                height={1080}
                loading="lazy"
                decoding="async"
                alt=""
              />
            ) : null}
            {stage === "poster" ? (
              <button type="button" className={styles.videoPlayButton} onClick={openPlayer}>
                <span className={styles.videoPlayIcon} aria-hidden="true"><Play size={26} fill="currentColor" /></span>
                <span className={styles.videoPlayLabel}>
                  技術デモ動画を再生
                  <small>{video.durationLabel}・音声なし・日本語字幕</small>
                </span>
              </button>
            ) : (
              <div className={styles.videoError} role="alert">
                <p>動画を読み込めませんでした。通信環境をご確認のうえ、もう一度お試しください。</p>
                <p>下の実アプリ画面（STEP 01〜03）でも、同じ流れをご覧いただけます。</p>
                <button ref={retryButton} type="button" className={styles.videoRetry} onClick={openPlayer}>
                  <RotateCcw size={16} aria-hidden="true" /> もう一度読み込む
                </button>
              </div>
            )}
          </>
        )}
      </div>
      <figcaption className={styles.videoCaption}>
        <div className={styles.videoCaptionRow}>
          <span>{video.durationLabel}・自動再生なし・音声なし（日本語字幕はCCボタンで表示）</span>
          <a
            href="#contact"
            className={`text-link ${styles.videoCta}`}
            data-track="b2b_demo_contact_click"
            data-location="demo_video"
            data-video-id={video.videoId}
            data-video-duration={String(video.durationSeconds)}
            data-placement={video.placement}
          >
            この技術で自社の課題を相談する <ArrowUpRight size={16} aria-hidden="true" />
          </a>
        </div>
        <p className={styles.videoNote}>
          ※投球映像はPexelsの素材です。姿勢解析の動画と評価画面（総合73点・評価B）は、同じ投球をAIスポーツトレーナーで実際に分析した出力です。73点はフォームの評価で、AIの認識精度を示す数値ではありません。15〜20秒のアプリ画面は別の表示例です。
        </p>
        <details className={styles.videoTranscript}>
          <summary>動画の内容をテキストで読む</summary>
          <ol id={transcriptId}>
            {video.transcript.map((line) => <li key={line}>{line}</li>)}
          </ol>
        </details>
      </figcaption>
    </figure>
  )
}
