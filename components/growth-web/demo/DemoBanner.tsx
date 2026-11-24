"use client"

interface DemoBannerProps {
  ownerMode: boolean
  onToggleOwnerMode: () => void
}

/** One quiet line: tells parents this is a fictional demo; owners switch on measurement mode here. */
export function DemoBanner({ ownerMode, onToggleOwnerMode }: DemoBannerProps) {
  return (
    <div className="gwd-demobar" role="region" aria-label="デモサイトについて">
      <p>
        <b>DEMO</b>
        <span className="l">
          Growth Webの制作デモです。架空のスクールのため、体験予約・メール・通知は発生しません。
        </span>
        <span className="s">架空のデモ（予約なし）</span>
      </p>
      <div className="gwd-demobar-r">
        <button
          type="button"
          aria-pressed={ownerMode}
          aria-controls={ownerMode ? "demo-ga4-inspector" : undefined}
          onClick={onToggleOwnerMode}
          data-testid="inspector-toggle"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="M4 19V9M10 19V5M16 19v-7M22 19H2" />
          </svg>
          計測を見る<small>経営者向け</small>
        </button>
        <a href="/services/growth-web" aria-label="Growth Webのサービス紹介へ戻る">
          ←<span> Growth Web</span>
        </a>
      </div>
    </div>
  )
}
