"use client"

import Link from "next/link"
import { ArrowRight, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useInView } from "@/hooks/use-in-view"

/* ─── 担当範囲 ─── */
const ownershipAreas = [
  {
    title: "企画・プロダクト設計",
    sub: "UI / UX、機能設計",
    tech: null,
  },
  {
    title: "アプリ・クラウド開発",
    sub: null,
    tech: "React Native / TypeScript / Node.js / Firebase / GCP",
  },
  {
    title: "AI動画分析",
    sub: null,
    tech: "姿勢推定 / 関節角度 / 動作解析 / LLM",
  },
  {
    title: "リリース・運用改善",
    sub: null,
    tech: "サブスクリプション / iOS・Android公開 / 利用データ分析 / 継続改善",
  },
]

/* ─── 実運用の難しさ ─── */
const challenges = [
  {
    title: "AIに評価させすぎない",
    description:
      "姿勢推定や映像から取得できる情報にも限界があるため、確認できない動作や身体状態を推測して評価しないよう設計しています。カメラアングルや画質の制約上、判断できない項目は「評価できない」と返す設計です。",
  },
  {
    title: "入力動画のばらつき",
    description:
      "撮影角度、カメラ距離、全身が映っているか、遮蔽、動作速度など、実ユーザーの動画には大きなばらつきがあります。これらは姿勢推定・動作解析の結果にも影響するため、実ユーザー動画を前提とした入力検証と例外処理の設計が必要でした。",
  },
  {
    title: "競技ごとの評価軸",
    description:
      "同じ関節角度や動作でも、競技・局面によって意味が異なります。共通の姿勢推定処理だけでは対応できないため、競技特性を考慮した評価設計が必要です。",
  },
  {
    title: "年齢に応じたフィードバック",
    description:
      "子ども向け・保護者向け・成人向けでは、適切な説明の粒度や言葉が変わります。同じ分析結果でも伝え方を調整する仕組みが必要でした。",
  },
  {
    title: "AI出力の安定化",
    description:
      "JSON等の構造化出力、検証ロジック、異常値の処理、分析不能ケースのハンドリングなど、AI出力を安定してサービスに組み込むための処理が必要です。",
  },
  {
    title: "コストと待ち時間",
    description:
      "精度だけでなく、AI APIのコストや動画処理時間もプロダクトの品質に直結します。実運用の中でバランスを調整し続けています。",
  },
]

/* ─── 得られた知見 ─── */
const insights = [
  "AIモデルの精度だけではプロダクト品質は決まらない",
  "実際のユーザー入力を前提に例外処理を設計する必要がある",
  "AIを評価する仕組みそのものが必要",
  "AI分析とUXは一体で改善する必要がある",
  "モデルやプロンプト変更時には継続的な品質検証が必要",
  "AIが判断できないことを適切に「判断しない」設計も重要",
  "姿勢推定や関節角度は、それだけで良し悪しを決めるものではなく、競技・局面・映像条件と組み合わせて解釈する必要がある",
  "動作データを取得することと、それを競技上意味のあるフィードバックへ変換することは別の課題",
]

/* ─── 応用可能領域 ─── */
const applications = [
  "スポーツ団体のAI動画分析",
  "地域スポーツのデジタル指導",
  "ジュニア選手の振り返り支援",
  "指導者支援",
  "新規スポーツDXサービス",
  "実証用MVP",
]

/* ─── JSON-LD ─── */
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
          name: "開発事例",
          item: "https://cyberknock.pages.dev/cases/ai-sports-trainer",
        },
      ],
    },
    {
      "@type": "SoftwareApplication",
      name: "AIスポーツトレーナー",
      description:
        "スマートフォンで撮影したスポーツ動画から姿勢・関節角度・動作を解析し、AIによる競技別フィードバックを提示するiOS/Androidアプリ。",
      applicationCategory: "SportsApplication",
      operatingSystem: "iOS, Android",
      url: "https://ai-sportstrainer.com",
      author: {
        "@type": "Organization",
        name: "Cyber Knock",
        url: "https://cyberknock.pages.dev",
      },
    },
  ],
}

export function CaseStudyContent() {
  const heroRef = useInView()
  const ownershipRef = useInView()
  const flowRef = useInView()
  const challengesRef = useInView()
  const insightsRef = useInView()
  const applicationsRef = useInView()

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main>
        {/* ═══════════ HERO ═══════════ */}
        <section className="relative pt-32 pb-16 md:pt-40 md:pb-24 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950 pointer-events-none" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-cyan-500/5 rounded-full blur-[120px] pointer-events-none" />

          <div
            ref={heroRef.ref}
            className={`relative container max-w-5xl mx-auto px-6 transition-all duration-1000 ${
              heroRef.isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            <p className="text-xs font-semibold text-cyan-500 tracking-widest uppercase mb-4">
              開発・運用事例
            </p>

            <h1 className="text-3xl sm:text-4xl lg:text-[44px] font-bold tracking-tight text-white leading-[1.35] mb-8">
              スポーツ動画をAIで分析するプロダクトを、
              <br />
              <span className="text-cyan-400">企画から運用まで。</span>
            </h1>

            {/* プロダクト概要 */}
            <div className="max-w-2xl">
              <p className="text-lg text-slate-400 leading-relaxed mb-6">
                スマートフォンで撮影したスポーツ動画をもとに、競技や分析内容に応じて姿勢・関節角度・動作情報を解析し、AIによる評価や改善ポイントを提示するスポーツトレーニングアプリ。
                複数競技を対象とし、iOS / Androidで実ユーザー向けに提供・運用しています。
              </p>
              <p className="text-base text-slate-300 leading-relaxed mb-10 p-4 rounded-lg border border-cyan-500/20 bg-cyan-500/5">
                企画・開発・リリース後の運用改善まで、自社で継続して取り組んでいるプロダクトです。
              </p>

              {/* ストアリンク */}
              <div className="flex flex-wrap gap-3">
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white"
                >
                  <Link
                    href="https://apps.apple.com/jp/app/ai%E3%82%B9%E3%83%9D%E3%83%BC%E3%83%84%E3%83%88%E3%83%AC%E3%83%BC%E3%83%8A%E3%83%BC-%E3%83%95%E3%82%A9%E3%83%BC%E3%83%A0%E5%8B%95%E7%94%BB%E5%88%86%E6%9E%90-%E7%B7%B4%E7%BF%92%E3%83%A1%E3%83%8B%E3%83%A5%E3%83%BC/id6742685461"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <svg className="h-4 w-4 mr-1.5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                    </svg>
                    App Store
                    <ExternalLink className="h-3 w-3 ml-1.5" />
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white"
                >
                  <Link
                    href="https://play.google.com/store/apps/details?id=com.harutowatanabe.mealier"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <svg className="h-4 w-4 mr-1.5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 0 1-.61-.92V2.734a1 1 0 0 1 .609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.199l2.807 1.626a1 1 0 0 1 0 1.732l-2.808 1.626L15.206 12l2.492-2.492zM5.864 2.658L16.8 8.99l-2.3 2.3-8.636-8.632z" />
                    </svg>
                    Google Play
                    <ExternalLink className="h-3 w-3 ml-1.5" />
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white"
                >
                  <Link
                    href="https://ai-sportstrainer.com"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    AIスポーツトレーナー公式サイト
                    <ExternalLink className="h-3 w-3 ml-1.5" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════ 担当範囲 ═══════════ */}
        <section className="py-20 md:py-28 bg-slate-900/40" aria-labelledby="ownership-heading">
          <div className="container max-w-5xl mx-auto px-6">
            <div
              ref={ownershipRef.ref}
              className={`transition-all duration-700 ${
                ownershipRef.isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
            >
              <p className="text-xs font-semibold text-cyan-500 tracking-widest uppercase mb-4">
                担当範囲
              </p>
              <h2 id="ownership-heading" className="text-2xl md:text-3xl font-bold text-white mb-10">
                企画から開発・運用改善まで一貫して担当
              </h2>

              <div className="grid sm:grid-cols-2 gap-4 mb-8">
                {ownershipAreas.map((area) => (
                  <div key={area.title} className="p-5 rounded-xl border border-slate-800 bg-slate-900/60">
                    <p className="text-sm font-semibold text-white mb-2">{area.title}</p>
                    {area.sub && (
                      <p className="text-xs text-slate-500 mb-1">{area.sub}</p>
                    )}
                    {area.tech && (
                      <p className="text-xs text-slate-500 leading-relaxed">{area.tech}</p>
                    )}
                  </div>
                ))}
              </div>
              <p className="text-sm text-slate-500 leading-relaxed">
                リリース後も実ユーザー環境で運用し、利用データをもとに継続的に改善しています。
              </p>
            </div>
          </div>
        </section>

        {/* ═══════════ システム概要 ═══════════ */}
        <section className="py-20 md:py-28 bg-slate-950" aria-labelledby="flow-heading">
          <div className="container max-w-5xl mx-auto px-6">
            <div
              ref={flowRef.ref}
              className={`transition-all duration-700 ${
                flowRef.isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
            >
              <p className="text-xs font-semibold text-cyan-500 tracking-widest uppercase mb-4">
                システム概要
              </p>
              <h2 id="flow-heading" className="text-2xl md:text-3xl font-bold text-white mb-4">
                動画撮影からフィードバックまでの流れ
              </h2>
              <p className="text-slate-400 mb-16 max-w-2xl">
                スマートフォンで撮影した動画から、姿勢・動作情報の解析、競技別AI評価、結果の検証を経て、改善ポイントをユーザーへ提示します。
              </p>

              {/* ── フェーズ 01 ── */}
              <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center mb-6">
                <div>
                  <p className="text-xs font-bold text-cyan-500 font-mono mb-2">01</p>
                  <h3 className="text-lg font-semibold text-white mb-3">動画を撮影</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">
                    スマートフォンで練習動画を撮影し、アプリからアップロードします。
                  </p>
                </div>
                <div className="rounded-xl overflow-hidden border border-slate-800 bg-slate-900/40">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/images/cases/00-recording.jpg"
                    alt="野球の練習動画をスマートフォンで撮影するイメージ"
                    width={896}
                    height={1200}
                    className="w-full h-auto object-contain"
                    loading="lazy"
                  />
                </div>
              </div>

              {/* 矢印 */}
              <div className="flex justify-center py-4">
                <div className="w-px h-10 bg-gradient-to-b from-cyan-500/40 to-slate-800" />
              </div>

              {/* ── フェーズ 02 ── */}
              <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center mb-6">
                <div className="order-2 md:order-1 rounded-xl overflow-hidden border border-slate-800 bg-slate-900/40">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/images/cases/01-analysis.jpg"
                    alt="投球動画から姿勢と関節角度を解析している画面"
                    width={333}
                    height={720}
                    className="w-full h-auto object-contain"
                    loading="lazy"
                  />
                </div>
                <div className="order-1 md:order-2">
                  <p className="text-xs font-bold text-cyan-500 font-mono mb-2">02</p>
                  <h3 className="text-lg font-semibold text-white mb-3">動きを解析</h3>
                  <p className="text-sm text-slate-400 leading-relaxed mb-4">
                    競技や分析内容に応じて、姿勢・関節角度・動作情報を映像から解析します。
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {["姿勢推定", "関節角度", "動作解析"].map((tag) => (
                      <span key={tag} className="px-2 py-0.5 text-xs rounded border border-cyan-500/30 bg-cyan-500/10 text-cyan-400">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* 矢印 */}
              <div className="flex justify-center py-4">
                <div className="w-px h-10 bg-gradient-to-b from-cyan-500/40 to-slate-800" />
              </div>

              {/* ── フェーズ 03 ── */}
              <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center mb-6">
                <div>
                  <p className="text-xs font-bold text-cyan-500 font-mono mb-2">03</p>
                  <h3 className="text-lg font-semibold text-white mb-3">AIが競技別に評価</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">
                    動画・動作情報と競技ごとの評価設計を組み合わせ、競技に応じた評価軸で分析します。
                  </p>
                </div>
                <div className="rounded-xl overflow-hidden border border-slate-800 bg-slate-900/40 flex justify-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/images/cases/04-score.png"
                    alt="AIスポーツトレーナーの野球分析スコア画面"
                    width={473}
                    height={1024}
                    className="w-full max-w-[320px] h-auto object-contain"
                    loading="lazy"
                  />
                </div>
              </div>

              {/* 矢印 */}
              <div className="flex justify-center py-4">
                <div className="w-px h-10 bg-gradient-to-b from-cyan-500/40 to-slate-800" />
              </div>

              {/* ── フェーズ 04 ── */}
              <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
                <div className="order-2 md:order-1 rounded-xl overflow-hidden border border-slate-800 bg-slate-900/40 flex justify-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/images/cases/02-feedback.png"
                    alt="AIスポーツトレーナーの分析フィードバック画面"
                    width={473}
                    height={1024}
                    className="w-full max-w-[320px] h-auto object-contain"
                    loading="lazy"
                  />
                </div>
                <div className="order-1 md:order-2">
                  <p className="text-xs font-bold text-cyan-500 font-mono mb-2">04</p>
                  <h3 className="text-lg font-semibold text-white mb-3">改善ポイントをフィードバック</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">
                    分析結果を構造化・検証し、競技者が理解しやすい改善ポイントとして提示します。映像から判断できない内容は無理に評価しない設計です。
                  </p>
                </div>
              </div>

              {/* ── 技術詳細サマリー ── */}
              <div className="grid sm:grid-cols-3 gap-3 mt-16">
                {[
                  { label: "動作解析", detail: "姿勢推定 / 関節角度 / 動作情報" },
                  { label: "AI評価", detail: "動画・動作情報 / 競技別評価 / LLM" },
                  { label: "品質管理", detail: "構造化出力 / 検証 / 分析不能判定" },
                ].map((item) => (
                  <div key={item.label} className="p-4 rounded-lg border border-slate-800 bg-slate-900/40">
                    <p className="text-xs font-semibold text-cyan-400 mb-1">{item.label}</p>
                    <p className="text-xs text-slate-500">{item.detail}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════ 次の練習へ ═══════════ */}
        <section className="py-20 md:py-28 bg-slate-900/40" aria-labelledby="next-practice-heading">
          <div className="container max-w-5xl mx-auto px-6">
            <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
              <div>
                <p className="text-xs font-semibold text-cyan-500 tracking-widest uppercase mb-4">
                  分析のその先
                </p>
                <h2 id="next-practice-heading" className="text-2xl md:text-3xl font-bold text-white mb-4">
                  分析結果を、次の練習へ
                </h2>
                <p className="text-slate-400 leading-relaxed mb-4">
                  分析で見つかった課題に応じて、改善につながる練習ドリルも提案します。課題の把握から、次に取り組む内容までつなげます。
                </p>
              </div>
              <div className="rounded-xl overflow-hidden border border-slate-800 bg-slate-900/40 flex justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/cases/03-training.png"
                  alt="分析結果に応じたAIドリル提案画面"
                  width={333}
                  height={720}
                  className="w-full max-w-[320px] h-auto object-contain"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════ 実運用で難しかったこと ═══════════ */}
        <section className="py-20 md:py-28 bg-slate-900/40" aria-labelledby="challenges-heading">
          <div className="container max-w-5xl mx-auto px-6">
            <div
              ref={challengesRef.ref}
              className={`transition-all duration-700 ${
                challengesRef.isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
            >
              <p className="text-xs font-semibold text-cyan-500 tracking-widest uppercase mb-4">
                実運用の知見
              </p>
              <h2 id="challenges-heading" className="text-2xl md:text-3xl font-bold text-white mb-4">
                実運用で難しかったこと
              </h2>
              <p className="text-slate-400 mb-12">
                デモやプロトタイプではなく、実ユーザー環境で継続的に運用するからこそ直面した課題です。
              </p>

              <div className="space-y-4">
                {challenges.map((item, i) => (
                  <div key={i} className="flex gap-4 md:gap-6 p-5 md:p-6 rounded-xl border border-slate-800 bg-slate-900/60">
                    <div className="shrink-0 pt-0.5">
                      <span className="text-sm font-bold text-cyan-500 font-mono">0{i + 1}</span>
                    </div>
                    <div>
                      <h3 className="text-base font-semibold text-white mb-2">{item.title}</h3>
                      <p className="text-sm text-slate-400 leading-relaxed">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════ 得られた知見 ═══════════ */}
        <section className="py-20 md:py-28 bg-slate-950" aria-labelledby="insights-heading">
          <div className="container max-w-5xl mx-auto px-6">
            <div
              ref={insightsRef.ref}
              className={`transition-all duration-700 ${
                insightsRef.isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
            >
              <p className="text-xs font-semibold text-cyan-500 tracking-widest uppercase mb-4">
                知見
              </p>
              <h2 id="insights-heading" className="text-2xl md:text-3xl font-bold text-white mb-12">
                得られた知見
              </h2>

              <ul className="space-y-4">
                {insights.map((item, i) => (
                  <li key={i} className="flex items-start gap-4">
                    <span className="text-xs font-bold text-cyan-500 font-mono shrink-0 mt-0.5">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <p className="text-slate-300 leading-relaxed">{item}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* ═══════════ 公共・団体案件への応用 ═══════════ */}
        <section className="py-20 md:py-28 bg-slate-900/40" aria-labelledby="applications-heading">
          <div className="container max-w-5xl mx-auto px-6">
            <div
              ref={applicationsRef.ref}
              className={`transition-all duration-700 ${
                applicationsRef.isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
            >
              <p className="text-xs font-semibold text-cyan-500 tracking-widest uppercase mb-4">
                応用
              </p>
              <h2 id="applications-heading" className="text-2xl md:text-3xl font-bold text-white mb-4">
                公共・団体案件への応用
              </h2>
              <p className="text-slate-400 mb-10">
                AIスポーツプロダクトの運用経験を、以下のような実証事業・スポーツDXへ応用できます。
              </p>

              <ul className="grid sm:grid-cols-2 gap-3 mb-12">
                {applications.map((item, i) => (
                  <li key={i} className="flex items-start gap-3 p-4 rounded-lg border border-slate-800 bg-slate-900/60">
                    <span className="w-1 h-1 rounded-full bg-cyan-500 shrink-0 mt-2" />
                    <span className="text-sm text-slate-300">{item}</span>
                  </li>
                ))}
              </ul>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  asChild
                  size="lg"
                  className="bg-cyan-600 hover:bg-cyan-500 text-white px-8 text-base"
                >
                  <Link href="/sports-dx">
                    スポーツDX・実証支援について見る
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white text-base px-8"
                >
                  <Link href="/security">データ取り扱いを確認する</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  )
}
