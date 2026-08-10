import type { Metadata } from "next"
import Link from "next/link"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"

const siteUrl = "https://cyberknock.pages.dev"

export const metadata: Metadata = {
  title: "AI・スポーツ動画データの取り扱いについて | Cyber Knock",
  description:
    "Cyber Knockが運営するスポーツAIサービスにおける、データの利用目的・アクセス管理・AIの利用範囲・未成年者対応などの考え方を説明します。",
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
          item: "https://cyberknock.pages.dev/",
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "データの取り扱い",
          item: "https://cyberknock.pages.dev/security",
        },
      ],
    },
  ],
}

export default function SecurityPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <SiteHeader />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main>
        {/* ─── HERO ─── */}
        <section className="relative pt-32 pb-16 md:pt-40 md:pb-20 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950 pointer-events-none" />

          <div className="relative container max-w-3xl mx-auto px-6">
            <p className="text-xs font-semibold text-cyan-500 tracking-widest uppercase mb-4">
              データ取り扱い
            </p>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white leading-[1.35] mb-8">
              AI・スポーツ動画データの取り扱いについて
            </h1>
            <p className="text-slate-400 leading-relaxed">
              Cyber Knockでは、スポーツ動画やAIを扱うサービスにおいて、データの利用目的、アクセス管理、AIの利用範囲などを明確にすることを重視しています。
            </p>
            <p className="text-slate-400 leading-relaxed mt-4">
              本ページでは、AIスポーツトレーナーを中心に、データの取り扱い方針やAIを利用する際の基本的な考え方を説明します。
            </p>
          </div>
        </section>

        {/* ─── コンテンツ ─── */}
        <section className="pb-24 md:pb-32">
          <div className="container max-w-3xl mx-auto px-6 space-y-16">

            {/* 1. データの利用目的 */}
            <div>
              <h2 className="text-xl font-bold text-white mb-4 pb-3 border-b border-slate-800">
                データの利用目的
              </h2>
              <p className="text-slate-400 leading-relaxed mb-4">
                収集するデータは、以下の目的でのみ利用します。
              </p>
              <ul className="space-y-2">
                {[
                  "サービスの提供・機能の実現",
                  "AI分析結果の生成・ユーザーへの提示",
                  "サービス品質の確認・改善",
                  "ユーザーからの問い合わせへの対応",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-slate-400">
                    <span className="w-1 h-1 rounded-full bg-slate-600 shrink-0 mt-2" />
                    {item}
                  </li>
                ))}
              </ul>
              <p className="text-sm text-slate-500 mt-4">
                上記以外の目的（広告配信・第三者への販売等）でのデータ利用は行いません。
              </p>
            </div>

            {/* 2. 動画データの取り扱い */}
            <div>
              <h2 className="text-xl font-bold text-white mb-4 pb-3 border-b border-slate-800">
                動画データの取り扱い
              </h2>
              <p className="text-slate-400 leading-relaxed mb-4">
                ユーザーがアップロードした動画は、AI分析の目的でのみ処理します。
                動画データは第三者に提供・販売しません。
              </p>
              <p className="text-slate-400 leading-relaxed mb-4">
                動画はGoogle Cloud上のストレージ（Firebase Cloud Storage）に保存されます。
              </p>
              <ul className="space-y-2 mb-4">
                {[
                  "無料プランのユーザー：アップロードから一定期間（約1か月）経過後に、動画ファイルは自動的に削除されます",
                  "有料プランのユーザー：動画ファイルは自動削除の対象外となり、サービス利用期間中は保存されます",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-slate-400">
                    <span className="w-1 h-1 rounded-full bg-slate-600 shrink-0 mt-2" />
                    {item}
                  </li>
                ))}
              </ul>
              <p className="text-sm text-slate-500">
                動画ファイルが削除された場合も、AI分析結果のテキストデータはサービス上で引き続き閲覧できます。
              </p>
            </div>

            {/* 3. 外部AIサービスへの送信 */}
            <div>
              <h2 className="text-xl font-bold text-white mb-4 pb-3 border-b border-slate-800">
                外部AIサービスへの送信
              </h2>
              <p className="text-slate-400 leading-relaxed mb-4">
                AI分析にはGoogle Cloud（Vertex AI）のAPIを利用しています。
                分析時に以下のデータがGoogle Cloudのサーバーに送信されます。
              </p>
              <ul className="space-y-2">
                {[
                  "ユーザーがアップロードした動画ファイル",
                  "分析に必要なコンテキスト情報（年齢層、競技種目、分析の目的など）",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-slate-400">
                    <span className="w-1 h-1 rounded-full bg-slate-600 shrink-0 mt-2" />
                    {item}
                  </li>
                ))}
              </ul>
              <p className="text-sm text-slate-500 mt-4">
                ※ 利用するAIサービスは、サービスの改善に伴い変更される場合があります。変更時には本ページを更新します。
              </p>
            </div>

            {/* 4. AIモデルの学習利用 */}
            <div>
              <h2 className="text-xl font-bold text-white mb-4 pb-3 border-b border-slate-800">
                AIモデルの学習利用
              </h2>
              <p className="text-slate-400 leading-relaxed mb-4">
                ユーザーがアップロードしたデータを、Cyber Knock独自のAIモデルの学習に利用することはありません。
              </p>
              <p className="text-slate-400 leading-relaxed">
                現在利用しているGoogle Cloud（Vertex AI）のAPIでは、APIを通じて送信されたデータがGoogleのモデル学習に使用されることはありません（Google Cloud の利用規約に基づく）。
              </p>
            </div>

            {/* 5. アクセス管理 */}
            <div>
              <h2 className="text-xl font-bold text-white mb-4 pb-3 border-b border-slate-800">
                アクセス管理
              </h2>
              <p className="text-slate-400 leading-relaxed mb-4">
                ユーザーデータへのアクセスは、サービス運営に必要な範囲に限定しています。
              </p>
              <ul className="space-y-2">
                {[
                  "ユーザーの動画・分析結果には、本人のアカウントからのみアクセスできます",
                  "運営側のデータアクセスは、障害対応やユーザーサポートなど業務上必要な場合に限定しています",
                  "不正なアクセスやAPIの異常利用は、検知・通知の仕組みを設けています",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-slate-400">
                    <span className="w-1 h-1 rounded-full bg-slate-600 shrink-0 mt-2" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* 6. データの削除 */}
            <div>
              <h2 className="text-xl font-bold text-white mb-4 pb-3 border-b border-slate-800">
                データの削除
              </h2>
              <p className="text-slate-400 leading-relaxed mb-4">
                ユーザーのデータ削除については、以下の方法で対応しています。
              </p>
              <ul className="space-y-2">
                {[
                  "動画データ：無料プランでは一定期間後に自動削除されます",
                  "アカウントおよび関連データの削除を希望される場合は、お問い合わせフォームよりご連絡ください。運営側で対応します",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-slate-400">
                    <span className="w-1 h-1 rounded-full bg-slate-600 shrink-0 mt-2" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* 7. 未成年者について */}
            <div>
              <h2 className="text-xl font-bold text-white mb-4 pb-3 border-b border-slate-800">
                未成年者について
              </h2>
              <p className="text-slate-400 leading-relaxed mb-4">
                本サービスは、スポーツ動画の分析を目的としており、ジュニア選手など未成年者が利用する場合があります。
              </p>
              <p className="text-slate-400 leading-relaxed">
                未成年者がサービスを利用する際は、保護者の関与・同意のもとで利用することを推奨しています。
              </p>
            </div>

            {/* 8. AIの限界 */}
            <div>
              <h2 className="text-xl font-bold text-white mb-4 pb-3 border-b border-slate-800">
                AIによる分析の限界
              </h2>
              <p className="text-slate-400 leading-relaxed mb-4">
                AIによる動画分析は、映像から確認できる範囲に限定した評価を提供するものです。
                以下の点をご理解ください。
              </p>
              <ul className="space-y-3">
                {[
                  "映像から確認できない情報（体の内側の状態、感覚、痛みなど）はAIでは判断できません",
                  "撮影角度・画質・動画の長さによっては、正確な分析ができない場合があります",
                  "AIの評価は参考情報として提供するものであり、絶対的な判断を示すものではありません",
                  "競技の指導・トレーニングについては、必要に応じて指導者や専門家に相談することを推奨します",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-slate-400">
                    <span className="w-1 h-1 rounded-full bg-slate-600 shrink-0 mt-2" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* 9. お問い合わせ */}
            <div>
              <h2 className="text-xl font-bold text-white mb-4 pb-3 border-b border-slate-800">
                お問い合わせ
              </h2>
              <p className="text-slate-400 leading-relaxed mb-4">
                データ取り扱いに関するご質問、データ削除のご依頼、問題が発生した場合のご連絡は、お問い合わせフォームよりご連絡ください。代表者が直接確認し、速やかに対応します。
              </p>
              <p className="text-slate-400 leading-relaxed">
                Cyber Knock（代表者：渡辺 晴仁）<br />
                所在地：〒150-0043 東京都渋谷区道玄坂1丁目10番8号 渋谷道玄坂東急ビル2F−C
              </p>
            </div>

            {/* ─── 関連リンク ─── */}
            <div className="border-t border-slate-800 pt-10">
              <p className="text-xs text-slate-500 uppercase tracking-widest mb-4">関連ページ</p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  href="/privacy-policy"
                  className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors"
                >
                  プライバシーポリシー →
                </Link>
                <Link
                  href="/sports-dx"
                  className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors"
                >
                  スポーツDX・実証支援 →
                </Link>
                <Link
                  href="/cases/ai-sports-trainer"
                  className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors"
                >
                  AIスポーツトレーナー 開発事例 →
                </Link>
              </div>
            </div>

          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  )
}
