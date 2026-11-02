import Link from "next/link"
import { ArrowUpRight } from "lucide-react"

const contactHref = "/?service=sports-dx#contact"

const themes = [
  {
    audience: "競技団体・クラブ・スクール",
    title: "練習動画を、指導の会話につなぐ。",
    body: "動画の記録・共有とAIによるフィードバックを組み合わせ、選手が振り返りやすく、指導者が確認しやすい方法を試します。",
    checks: ["フィードバックは指導に役立つか", "撮影・確認の負担は許容できるか"],
  },
  {
    audience: "自治体・地域スポーツの担当者",
    title: "離れた場所でも、支援を届ける。",
    body: "地域クラブや指導者、参加者の間で記録を共有する仕組みを検証。利用する人と運営する人、両方の使いやすさを確かめます。",
    checks: ["対象者が迷わず利用を始められるか", "現場の運用に無理なく組み込めるか"],
  },
  {
    audience: "スポーツ事業者・公的事業の受託企業",
    title: "新しいサービスの可能性を試す。",
    body: "団体の専門知識を会員向けサービスやAI機能へ。既存サービスへの機能追加から、実証用のWeb・モバイル開発まで対応します。",
    checks: ["利用者が継続して使う理由があるか", "品質・処理時間・費用が見合うか"],
  },
]

const steps = [
  { title: "目的と評価基準を揃える", body: "誰のどの課題を解くか、何を確認できれば次へ進むかを決めます。撮影条件やデータの利用範囲も整理します。", output: "課題整理・検証計画" },
  { title: "必要な範囲を実装する", body: "既存の仕組みを活用できるかを確認し、実証に必要なWeb・アプリ・AI機能に開発範囲を絞ります。", output: "試せるプロトタイプ" },
  { title: "現場で使い、確かめる", body: "実際の利用条件で、使いやすさ、AI出力の妥当性、処理時間、運用負担を確認します。", output: "利用記録・評価結果" },
  { title: "次の進め方を決める", body: "確認できたことと残った課題を整理。改善、対象拡大、サービス化などの選択肢を検討します。", output: "結果レポート・改善提案" },
]

const deliverables = [
  ["実証計画・評価基準", "対象者、検証する機能、実施条件、評価方法を明確にし、関係者の期待を揃えます。"],
  ["プロトタイプ・実証環境", "利用者が操作できる形で、技術的な実現可能性と利用体験を確かめます。"],
  ["評価結果・課題一覧", "利用状況、現場の声、AI品質、処理時間・費用を整理し、改善の優先順位を判断できます。"],
  ["次段階の提案・概算", "継続に必要な改修、運用体制、開発・運用費用の考え方を整理し、次の計画に使える形へまとめます。"],
]

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Cyber Knock",
          item: "https://cyberknock.pages.dev/",
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "スポーツDX・AI実証支援",
          item: "https://cyberknock.pages.dev/sports-dx",
        },
      ],
    },
    {
      "@type": "Service",
      name: "スポーツDX・AI実証支援",
      description:
        "自治体・競技団体・地域スポーツクラブ向けに、AI・動画分析・Web・モバイルを活用したスポーツDXを支援。現場課題の整理、PoC・実証設計、開発、効果検証、継続改善まで一貫して対応します。",
      provider: {
        "@type": "Organization",
        name: "Cyber Knock",
        url: "https://cyberknock.pages.dev",
      },
      areaServed: "JP",
    },
  ],
}


export function SportsDxContent() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <main id="main-content">
        <section className="page-hero">
          <div className="wrap">
            <p className="eyebrow">スポーツDX・AI実証支援</p>
            <h1 className="page-title">現場で役立つかを、<br />小さな実証から。</h1>
            <p className="lead">自治体・競技団体・クラブの、指導支援や新しいサービスづくりに。自社スポーツAIアプリの開発・運用経験をもとに、課題整理から実証・効果検証まで支援します。</p>
            <div className="hero-actions">
              <Link href={contactHref} className="button button-primary" data-track="cta_click" data-location="hero" data-service="sports-dx">実証について相談する <ArrowUpRight size={20} aria-hidden="true" /></Link>
              <Link href="/cases/ai-sports-trainer" className="text-link" data-track="case_study_click" data-location="hero">開発・運用事例を見る <ArrowUpRight size={18} aria-hidden="true" /></Link>
            </div>
          </div>
        </section>

        <section className="section" aria-labelledby="themes-heading">
          <div className="wrap">
            <div className="section-heading">
              <p className="section-label">01 / 実証テーマ例</p>
              <h2 id="themes-heading" className="section-title">まず、何を確かめますか。</h2>
            </div>
            <div className="three-grid">
              {themes.map((theme) => (
                <article className="info-card" key={theme.title}>
                  <p className="tag">{theme.audience}</p>
                  <h3>{theme.title}</h3>
                  <p>{theme.body}</p>
                  <ul>{theme.checks.map((check) => <li key={check}>{check}</li>)}</ul>
                </article>
              ))}
            </div>
            <p className="info-note">上記は実証テーマの例です。導入実績を示すものではありません。対象競技・現場の条件を伺い、検証内容を一緒に絞り込みます。</p>
          </div>
        </section>

        <section className="section" aria-labelledby="process-heading">
          <div className="wrap">
            <div className="section-heading">
              <p className="section-label">02 / 進め方</p>
              <h2 id="process-heading" className="section-title">小さく試して、次の判断へ。</h2>
            </div>
            <p className="lead">最初に「何が分かればよいか」を決めることで、実証に必要な開発と評価に集中できます。</p>
            <div className="process-grid">
              {steps.map((step, index) => (
                <article key={step.title}>
                  <p className="step-number mono"><span className="sr-only">ステップ</span>0{index + 1}</p>
                  <h3>{step.title}</h3>
                  <p>{step.body}</p>
                  <p className="process-output"><span>残すもの</span>{step.output}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section" aria-labelledby="deliverables-heading">
          <div className="wrap">
            <div className="section-heading">
              <p className="section-label">03 / 成果物と判断材料</p>
              <h2 id="deliverables-heading" className="section-title">実証の成果を、次の計画に。</h2>
            </div>
            <table className="deliverable-table">
              <caption>想定する成果物。ご提供する範囲・形式は、実証の目的に合わせて合意します。</caption>
              <thead><tr><th scope="col">成果物</th><th scope="col">確認・判断できること</th></tr></thead>
              <tbody>{deliverables.map(([name, description]) => <tr key={name}><th scope="row">{name}</th><td>{description}</td></tr>)}</tbody>
            </table>
            <p className="info-note">評価結果は、対象者・映像・撮影環境などの実施条件とあわせて整理します。少数の成功例だけで、すべての現場に使えるとは判断しません。</p>
          </div>
        </section>

        <section className="section" aria-labelledby="quality-heading">
          <div className="wrap editorial-grid">
            <div>
              <p className="section-label">04 / 品質と運用</p>
              <h2 id="quality-heading" className="section-title">AIの結果と、<br />現場の使いやすさ。</h2>
            </div>
            <div className="body-copy">
              <h3>役に立つか。</h3>
              <p>指導者が見た内容とAIの説明を照らし合わせ、映像で確認できること、判断を控えることを整理します。目的に応じて、分析完了率や出力の妥当性を評価します。</p>
              <h3>無理なく使えるか。</h3>
              <p>撮影・入力・結果確認の流れを実際に試し、操作のしやすさ、確認にかかる時間、参加者の利用状況を見ます。技術的に動くことと、現場で使い続けられることを一緒に確かめます。</p>
              <h3>続けられるか。</h3>
              <p>動画の保存・閲覧権限、本人や保護者への説明、AI処理費用、保守の範囲を事前に整理。取り扱うデータや利用する外部サービスは、案件ごとに確認します。</p>
              <Link href="/security" className="text-link">データの取り扱い方針を確認する <ArrowUpRight size={18} aria-hidden="true" /></Link>
            </div>
          </div>
        </section>

        <section className="section" aria-labelledby="evidence-heading">
          <div className="wrap">
            <div className="section-heading">
              <p className="section-label">05 / 開発・運用の経験</p>
              <h2 id="evidence-heading" className="section-title">公開後の課題にも、向き合っています。</h2>
            </div>
            <div className="editorial-grid">
              <figure>
                <img src="/images/product/pitching-score.webp" width={280} height={606} loading="lazy" decoding="async" alt="AIスポーツトレーナーの実画面。動作の評価と競技者向けのフィードバックを表示。" />
                <figcaption className="info-note">自社アプリの実画面（表示例）</figcaption>
              </figure>
              <div className="body-copy">
                <p className="tag">自社プロダクト / iOS・Android</p>
                <h3>AIスポーツトレーナー</h3>
                <p>撮影したスポーツ動画をAIで分析し、練習の振り返りに役立つフィードバックを届けるアプリです。企画、Web・モバイルとバックエンドの開発、課金、ストア公開、継続運用まで自社で担当しています。</p>
                <p>実際の動画のばらつき、AIが判断できる範囲、説明の分かりやすさ、待ち時間と処理費用。利用者に提供してから生まれる課題を、品質と体験の両面から改善してきました。</p>
                <p>この経験を、実証で確認すべきポイントや、運用を見据えた開発範囲の整理に活用します。</p>
                <Link href="/cases/ai-sports-trainer" className="text-link" data-track="case_study_click" data-location="sports_dx">開発の判断と実画面を見る <ArrowUpRight size={18} aria-hidden="true" /></Link>
              </div>
            </div>
          </div>
        </section>

        <section className="section" aria-labelledby="planning-heading">
          <div className="wrap editorial-grid">
            <div>
              <p className="section-label">06 / ご相談にあたって</p>
              <h2 id="planning-heading" className="section-title">予算や仕様は、<br />これからでも。</h2>
            </div>
            <div className="body-copy">
              <h3>分かっている課題から、お聞かせください。</h3>
              <p>対象競技や利用する人、今困っていること、希望する時期が分かると、実証の範囲を整理しやすくなります。資料や仕様書が完成している必要はありません。</p>
              <h3>費用と期間は、検証範囲に合わせて。</h3>
              <p>撮影条件や手元にあるデータ、必要な機能、評価方法を確認したうえで、開発範囲と概算を整理します。AIの処理やデータ保存など、継続的にかかる費用も分けて検討します。</p>
              <h3>技術パートナーとしての参加も。</h3>
              <p>企画からの支援に加え、公募への共同提案や進行中の案件の技術相談、AI・Web・モバイル部分の開発もご相談いただけます。契約・納品・保守の範囲は着手前に確認します。</p>
            </div>
          </div>
        </section>

        <section className="section" aria-labelledby="contact-heading">
          <div className="wrap">
            <div className="cta-panel">
              <h2 id="contact-heading">その現場で、何を変えたいですか。</h2>
              <p>構想段階から、実証の進め方を一緒に整理します。<br />予算・仕様が未定でもご相談いただけます。</p>
              <Link href={contactHref} className="button button-primary" data-track="cta_click" data-location="sports_dx" data-service="sports-dx">スポーツDX・実証について相談する <ArrowUpRight size={20} aria-hidden="true" /></Link>
            </div>
          </div>
        </section>
      </main>
    </>
  )
}
