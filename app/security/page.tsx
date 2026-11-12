import type { Metadata } from "next"
import Link from "next/link"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"

const siteUrl = "https://harutowatanabe.com"

export const metadata: Metadata = {
  title: "AI・スポーツ動画データの取り扱いについて | Cyber Knock",
  description:
    "Cyber Knockの実証・受託開発で整理するデータ要件と、AIスポーツトレーナーにおける動画の保存・外部AIの利用・アクセス管理・削除の方針を説明します。",
  alternates: {
    canonical: "/security",
  },
  openGraph: {
    title: "AI・スポーツ動画データの取り扱いについて | Cyber Knock",
    description:
      "Cyber Knockが運営するスポーツAIサービスにおける、データの利用目的・アクセス管理・AIの利用範囲などの考え方を説明します。",
    url: `${siteUrl}/security`,
    siteName: "Cyber Knock",
    type: "website",
    locale: "ja_JP",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI・スポーツ動画データの取り扱いについて | Cyber Knock",
    description:
      "Cyber Knockが運営するスポーツAIサービスにおける、データの利用目的・アクセス管理・AIの利用範囲などの考え方を説明します。",
  },
}

/*
 * ============================================================
 * 実装確認済み事項メモ（コードコメント — ページには表示しない）
 * ============================================================
 *
 * 以下は mealier-analysis/functions のソースコード調査に基づく。
 *
 * [確認済] 動画保存先: Firebase Cloud Storage（GCS バッキング）
 * [確認済] 動画保存期間: 無料ユーザーは約1ヶ月で自動削除（scheduledCleanupHandler）
 *          プレミアムユーザーは自動削除の対象外
 * [確認済] 分析結果: Firestore に保存。TTL なし。動画削除時に videoUrl が null 化されるのみ
 * [確認済] 外部AI: Vertex AI Gemini（Google Cloud）。動画ファイル + ユーザーコンテキストを送信
 * [確認済] 学習利用: Vertex AI API 利用。Google の規約上、API 経由の顧客データはモデル学習に使用されない
 * [確認済] ユーザー削除: セルフサービス削除 API は未実装。問い合わせ経由で手動対応
 * [確認済] 管理者削除: cleanup-orphans スクリプトで孤立ファイルの一括削除が可能
 * [確認済] 未成年者: 保護者同意の専用フローは未実装。推奨ベース
 * [確認済] インシデント: Slack 通知あり（prompt_injection / rate_limit / app_check_failure 検知）
 *          代表者が直接対応する体制
 *
 * ============================================================
 */

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
          item: "https://harutowatanabe.com/",
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "データの取り扱い",
          item: "https://harutowatanabe.com/security",
        },
      ],
    },
  ],
}

export default function SecurityPage() {
  return (
    <div className="site-shell">
      <SiteHeader />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <main id="main-content">
        <section className="document-hero">
          <div className="wrap">
            <p className="eyebrow">データの取り扱い</p>
            <h1 className="page-title">AI・スポーツ動画<span className="keep-phrase">データの</span><br />取り扱いについて。</h1>
            <p className="lead">
              データの利用目的、アクセス管理、AIの利用範囲を明確にしながら、
              サービスを設計・運用することを重視しています。
            </p>
            <div className="info-note">
              <p className="section-label">実証・受託開発をご検討の方へ</p>
              <p>実証・受託開発では、目的・閲覧権限・保存期間・外部AIへ送る範囲を開始前に整理します。</p>
              <p>以下は、自社サービス「AIスポーツトレーナー」を中心とした現在の取り扱い方針です。ご依頼いただく開発では、対象データや運用に合わせて要件を確認します。</p>
              <Link href="/?service=sports-ai#contact" className="text-link">開発時のデータ要件について相談する <span aria-hidden="true">↗</span></Link>
            </div>
          </div>
        </section>

        <div className="wrap document-layout">
          <aside className="document-nav">
            <nav aria-label="データの取り扱いの目次">
              <p className="section-label">このページの内容</p>
              <ol>
                <li><a href="#purpose">データの利用目的</a></li>
                <li><a href="#video">動画データの取り扱い</a></li>
                <li><a href="#external-ai">外部AIサービスへの送信</a></li>
                <li><a href="#model-training">AIモデルの学習利用</a></li>
                <li><a href="#access">アクセス管理</a></li>
                <li><a href="#deletion">データの削除</a></li>
                <li><a href="#minors">未成年者について</a></li>
                <li><a href="#limitations">AIによる分析の限界</a></li>
                <li><a href="#contact">お問い合わせ</a></li>
              </ol>
            </nav>
          </aside>
          <article className="prose" aria-label="AIスポーツトレーナーのデータ取り扱い方針">
            <section aria-labelledby="purpose">
              <h2 id="purpose">データの利用目的</h2>
              <p>
                収集するデータは、以下の目的でのみ利用します。
              </p>
              <ul>
                {[
                  "サービスの提供・機能の実現",
                  "AI分析結果の生成・ユーザーへの提示",
                  "サービス品質の確認・改善",
                  "ユーザーからの問い合わせへの対応",
                ].map((item) => (
                  <li key={item}>
                    {item}
                  </li>
                ))}
              </ul>
              <p>
                上記以外の目的（広告配信・第三者への販売等）でのデータ利用は行いません。
              </p>
            </section>

            <section aria-labelledby="video">
              <h2 id="video">動画データの取り扱い</h2>
              <p>
                ユーザーがアップロードした動画は、AI分析の目的でのみ処理します。
                動画データは第三者に提供・販売しません。
              </p>
              <p>
                動画はGoogle Cloud上のストレージ（Firebase Cloud Storage）に保存されます。
              </p>
              <ul>
                {[
                  "無料プランのユーザー：アップロードから一定期間（約1か月）経過後に、動画ファイルは自動的に削除されます",
                  "有料プランのユーザー：動画ファイルは自動削除の対象外となり、サービス利用期間中は保存されます",
                ].map((item) => (
                  <li key={item}>
                    {item}
                  </li>
                ))}
              </ul>
              <p>
                動画ファイルが削除された場合も、AI分析結果のテキストデータはサービス上で引き続き閲覧できます。
              </p>
            </section>

            <section aria-labelledby="external-ai">
              <h2 id="external-ai">外部AIサービスへの送信</h2>
              <p>
                AI分析にはGoogle Cloud（Vertex AI）のAPIを利用しています。
                分析時に以下のデータがGoogle Cloudのサーバーに送信されます。
              </p>
              <ul>
                {[
                  "ユーザーがアップロードした動画ファイル",
                  "分析に必要なコンテキスト情報（年齢層、競技種目、分析の目的など）",
                ].map((item) => (
                  <li key={item}>
                    {item}
                  </li>
                ))}
              </ul>
              <p>
                ※ 利用するAIサービスは、サービスの改善に伴い変更される場合があります。変更時には本ページを更新します。
              </p>
            </section>

            <section aria-labelledby="model-training">
              <h2 id="model-training">AIモデルの学習利用</h2>
              <p>
                ユーザーがアップロードしたデータを、Cyber Knock独自のAIモデルの学習に利用することはありません。
              </p>
              <p>
                現在利用しているGoogle Cloud（Vertex AI）のAPIでは、APIを通じて送信されたデータがGoogleのモデル学習に使用されることはありません（Google Cloud の利用規約に基づく）。
              </p>
            </section>

            <section aria-labelledby="access">
              <h2 id="access">アクセス管理</h2>
              <p>
                ユーザーデータへのアクセスは、サービス運営に必要な範囲に限定しています。
              </p>
              <ul>
                {[
                  "ユーザーの動画・分析結果には、本人のアカウントからのみアクセスできます",
                  "運営側のデータアクセスは、障害対応やユーザーサポートなど業務上必要な場合に限定しています",
                  "不正なアクセスやAPIの異常利用は、検知・通知の仕組みを設けています",
                ].map((item) => (
                  <li key={item}>
                    {item}
                  </li>
                ))}
              </ul>
            </section>

            <section aria-labelledby="deletion">
              <h2 id="deletion">データの削除</h2>
              <p>
                ユーザーのデータ削除については、以下の方法で対応しています。
              </p>
              <ul>
                {[
                  "動画データ：無料プランでは一定期間後に自動削除されます",
                  "アカウントおよび関連データの削除を希望される場合は、お問い合わせフォームよりご連絡ください。運営側で対応します",
                ].map((item) => (
                  <li key={item}>
                    {item}
                  </li>
                ))}
              </ul>
            </section>

            <section aria-labelledby="minors">
              <h2 id="minors">未成年者について</h2>
              <p>
                本サービスは、スポーツ動画の分析を目的としており、ジュニア選手など未成年者が利用する場合があります。
              </p>
              <p>
                未成年者がサービスを利用する際は、保護者の関与・同意のもとで利用することを推奨しています。
              </p>
            </section>

            <section aria-labelledby="limitations">
              <h2 id="limitations">AIによる分析の限界</h2>
              <p>
                AIによる動画分析は、映像から確認できる範囲に限定した評価を提供するものです。
                以下の点をご理解ください。
              </p>
              <ul>
                {[
                  "映像から確認できない情報（体の内側の状態、感覚、痛みなど）はAIでは判断できません",
                  "撮影角度・画質・動画の長さによっては、正確な分析ができない場合があります",
                  "AIの評価は参考情報として提供するものであり、絶対的な判断を示すものではありません",
                  "競技の指導・トレーニングについては、必要に応じて指導者や専門家に相談することを推奨します",
                ].map((item) => (
                  <li key={item}>
                    {item}
                  </li>
                ))}
              </ul>
            </section>

            <section aria-labelledby="contact">
              <h2 id="contact">お問い合わせ</h2>
              <p>
                データ取り扱いに関するご質問、データ削除のご依頼、問題が発生した場合のご連絡は、お問い合わせフォームよりご連絡ください。代表者が直接確認し、速やかに対応します。
              </p>
              <p>
                Cyber Knock（代表者：渡辺 晴仁）<br />
                所在地：東京都三鷹市
              </p>

              <p><Link href="/?service=sports-ai#contact" className="button button-primary">データの取り扱いについて相談する <span aria-hidden="true">↗</span></Link></p>
            </section>

            <div className="info-note">
              <p className="section-label">関連ページ</p>
              <ul>
                <li><Link href="/privacy-policy" className="text-link">プライバシーポリシー</Link></li>
                <li><Link href="/sports-dx" className="text-link">スポーツDX・AI実証支援</Link></li>
                <li><Link href="/cases/ai-sports-trainer" className="text-link">AIスポーツトレーナーの開発・運用事例</Link></li>
              </ul>
            </div>
          </article>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
