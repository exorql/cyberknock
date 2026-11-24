import { DEMO_APPROACH_POINTS, DEMO_DISPLAY_TEXT, DEMO_IMAGE_BASE } from "@/lib/growth-web/demo-content"

export function DemoApproach() {
  return (
    <section className="gwd-sec gwd-approach" id="approach" aria-labelledby="approach-title">
      <div className="gwd-wrap gwd-ap-grid">
        <figure className="gwd-ap-ph">
          <picture>
            <source
              type="image/avif"
              srcSet={`${DEMO_IMAGE_BASE}/coach-640.avif 640w, ${DEMO_IMAGE_BASE}/coach-1200.avif 1200w`}
              sizes="(max-width: 767px) 100vw, 600px"
            />
            <img
              src={`${DEMO_IMAGE_BASE}/coach-640.webp`}
              srcSet={`${DEMO_IMAGE_BASE}/coach-640.webp 640w, ${DEMO_IMAGE_BASE}/coach-1200.webp 1200w`}
              sizes="(max-width: 767px) 100vw, 600px"
              width={640}
              height={480}
              alt="大人がひざをつき、子どもの靴ひもを結んでいる様子（イメージ写真）"
              loading="lazy"
              decoding="async"
            />
          </picture>
          <figcaption className="gwd-credit">写真はイメージです（Unsplash）</figcaption>
        </figure>
        <div className="gwd-ap">
          <p className="gwd-eyebrow">OUR APPROACH</p>
          <h2 className="gwd-h2" id="approach-title">
            <span>{DEMO_DISPLAY_TEXT.approachLine1}</span>
            <span>{DEMO_DISPLAY_TEXT.approachLine2}</span>
          </h2>
          <p>
            うまくなる前に、まず「もっとやりたい」。運動が得意な子も苦手な子も、自分のペースで「昨日よりできた」を積み重ねられる練習をつくっています。
          </p>
          <ol>
            {DEMO_APPROACH_POINTS.map((point) => (
              <li key={point.title}>
                <div>
                  <b>{point.title}</b>
                  <span>{point.body}</span>
                </div>
              </li>
            ))}
          </ol>
          <p className="gwd-fict">※架空のスクールの設定です。実在の指導者・団体とは関係ありません。</p>
        </div>
      </div>
    </section>
  )
}
