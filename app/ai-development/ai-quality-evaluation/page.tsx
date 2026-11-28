import type { Metadata } from "next"
import Link from "next/link"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import styles from "../development.module.css"

const path = "/ai-development/ai-quality-evaluation"
const url = "https://cyberknock.jp" + path
const name = "AI品質・原価改善レビュー"
const title = "稼働中AIの品質評価・精度改善支援｜月額20万円の比較レビュー | Cyber Knock"
const description = "モデルやプロンプトの更新前に、現行版と候補版を同じデータで比較。誤判定・未判定、再試行を含む原価と利用可能な結果を確かめ、リリースと改修の優先順位を決めます。初回は単月20万円（税別）。"
const ogImage = "/images/og/cyberknock-b2b.png"
const contact = "/ai-development?service=ai-improvement#contact"

export const metadata: Metadata = {
  title, description, alternates: { canonical: path },
  openGraph: { title, description, url, siteName: "Cyber Knock", locale: "ja_JP", type: "website", images: [ogImage] },
  twitter: { card: "summary_large_image", title, description, images: [ogImage] },
}

const schema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name, url, description, areaServed: "JP",
  provider: { "@id": "https://cyberknock.jp/#organization" },
  offers: {
    "@type": "Offer", url,
    priceSpecification: {
      "@type": "UnitPriceSpecification", price: 200000, priceCurrency: "JPY", valueAddedTaxIncluded: false,
      referenceQuantity: { "@type": "QuantitativeValue", value: 1, unitCode: "MON" },
    },
  },
}

export default function QualityEvaluationPage() {
  return (
    <div className={styles.root}>
      <SiteHeader consultationHref={contact} />
      <main id="main-content">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
        <header className={styles.hero}>
          <div className={`wrap ${styles.heroLayout}`}>
            <div className={styles.heroCopy}>
              <nav aria-label="パンくず"><Link className={styles.eyebrow} href="/ai-development">法人向けAI開発へ</Link></nav>
              <h1 className={styles.heroTitle}>{name}</h1>
              <p className={styles.heroLead}>モデルを更新しても、利用者に同じ品質で結果を返せるか。稼働中の画像・動画AIを現行版と候補版で比較し、リリースの可否と先に直す箇所を整理します。</p>
              <div className={styles.heroActions}>
                <Link href={contact} className={`button ${styles.primary}`} data-track="cta_click" data-location="hero" data-service="ai-improvement">レビューの対象になるか相談する</Link>
                <strong>月額20万円（税別）・初回は単月</strong>
              </div>
            </div>
            <aside className={styles.heroProofStage} aria-labelledby="review-example">
              <p className={styles.stageTop}>AIスポーツトレーナーの検証記録</p>
              <h2 id="review-example" className={styles.reviewExampleTitle}>AIの応答成功と、業務で使える結果を分けて評価</h2>
              <p className={styles.heroLead}>開発中の候補を、出力の構造、保存・画面表示、映像に即した内容の順に検証。未解決の問題を明確にし、当時の候補版は公開を見送りました。</p>
              <div className={styles.heroActions}>
                <Link className={`text-link ${styles.secondary}`} href="/cases/ai-sports-trainer#quality-evaluation" data-track="case_study_click" data-location="hero">評価条件と判断の根拠を読む <span aria-hidden="true">→</span></Link>
              </div>
            </aside>
          </div>
        </header>
        <div className="wrap document-layout">
          <nav className="document-nav" aria-label="ページ内目次">
            <p className="section-label">ご依頼を検討中の方へ</p>
            <ol>
              <li><a href="#comparison">現行版と候補版の比較方法</a></li>
              <li><a href="#scope">対象・必要データ・納品物</a></li>
              <li><a href="#consult">費用とご相談</a></li>
            </ol>
          </nav>
          <article className="prose">
            <section aria-labelledby="comparison">
              <h2 id="comparison">更新の可否を決める、3つの問い</h2>
              <h3>どの入力で結果が変わったか</h3>
              <p>同じ画像や動画を両方の版で処理し、担当者の正解判定と突き合わせます。以前は正しかったのに誤った例、見逃した例、判定を保留できた例を入力条件ごとに並べます。重大な見逃しが増えた条件は、平均値が良くなっても採用前に確認できます。</p>
              <h3>応答が利用者の手元に届いたか</h3>
              <p>API応答、形式チェック、保存、画面表示、業務上の合格を順に照合します。各段階の件数と追跡に必要なログが欠けている箇所を示し、修正・追加計測の順序を決めます。</p>
              <p><Link href="/cases/ai-sports-trainer#quality-evaluation" data-track="case_study_click" data-location="content">自社アプリでの品質評価と公開判断の事例</Link></p>
              <h3>使える結果を1件届ける費用はいくらか</h3>
              <p>失敗・再試行を含む全呼び出しの推論費を、合意した基準を満たして利用者に届いた件数で割ります。利用可能件数がゼロ、または到達を確認できない場合は単価を算定できません。請求額、料金表による推計、未計測を区別して報告します。</p>
            </section>
            <section aria-labelledby="scope">
              <h2 id="scope">ご用意いただくデータと、納品する判断材料</h2>
              <p>対象は、評価用データと改修担当者がいて、次に採用するモデルやプロンプトを決めたいSaaS・業務アプリのチームです。他社で初回検証を実施したチームもご相談いただけます。</p>
              <ul>
                <li><strong>必要なデータ</strong>　利用許諾のある代表入力、担当者の正解判定、現行版と変更案、取得できる処理ログ。入力と結果を対応づけ、共有方法と保持期間を合意してからお預かりします。</li>
                <li><strong>比較の範囲</strong>　1サービス、固定した最大30評価単位。最大2版・方式を月1回比較します。素材は動画合計15分または画像50枚まで。失敗分の再実行は追加5評価単位以内・1回までです。</li>
                <li><strong>月次の納品物</strong>　条件と版を明記した比較表、重大な失敗例、品質・原価・待ち時間の差、採用・条件付き採用・見送りの理由と修正の優先順位を報告します。</li>
              </ul>
              <p>新しい評価データの作成、用途や基準の追加、改善案の実装、本番の常時監視は個別見積もりです。基準データをこれから用意する場合は、<Link href="/ai-development#standard-offers">画像・動画AI実用性判定（60万円・税別）</Link>の対象をご確認ください。</p>
            </section>
            <section className="info-note" aria-labelledby="consult">
              <h2 id="consult">次のリリースで、何を判断したいですか。</h2>
              <p>初回は単月20万円（税別）。次に比較する変更が決まった時点で継続をご判断いただけます。無料相談では、変更予定の機能と、いま確認できるデータの種類を伺います。実データ解析、ログやコードの調査は有償です。</p>
              <p><Link href={contact} className="button button-primary" data-track="cta_click" data-location="contact" data-service="ai-improvement">品質・原価のレビューを相談する</Link></p>
            </section>
          </article>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
