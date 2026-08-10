"use client"

import Link from "next/link"
import { ArrowRight, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useInView } from "@/hooks/use-in-view"

/* ─── 対象・テーマ データ ─── */
const targetCategories = [
  {
    label: "自治体",
    items: [
      "地域スポーツDX",
      "スポーツ参加機会の拡大",
      "指導環境のデジタル化",
      "部活動の地域展開におけるデジタル活用",
    ],
  },
  {
    label: "競技団体",
    items: [
      "指導DX",
      "データ活用",
      "競技普及",
      "会員向けデジタルサービス",
    ],
  },
  {
    label: "スポーツクラブ",
    items: [
      "指導支援",
      "会員向け付加価値",
      "オンライン指導",
      "新規デジタルサービス",
    ],
  },
  {
    label: "スクール",
    items: [
      "AI動画分析",
      "選手の振り返り",
      "指導者との情報共有",
    ],
  },
  {
    label: "スポーツ事業会社",
    items: [
      "スポーツ領域の新規サービス",
      "AI機能開発",
      "PoC / MVP",
    ],
  },
  {
    label: "公的事業の受託企業",
    items: [
      "スポーツ領域の技術パートナー",
      "AI部分の開発",
      "モバイル / Web開発",
      "再委託",
    ],
  },
]

/* ─── 提供サービス データ ─── */
const services = [
  {
    title: "課題整理・実証企画",
    description:
      "現場ヒアリングをもとに、対象者、仮説、KPI、実証方法を整理します。",
  },
  {
    title: "PoC・MVP開発",
    description:
      "必要最小限のWeb・モバイルアプリ・AI機能を短期間で構築します。",
  },
  {
    title: "AI・データ活用",
    description:
      "動画分析、姿勢・動作推定、関節角度の可視化、生成AIなどをサービスへ組み込みます。",
  },
  {
    title: "効果検証・改善",
    description:
      "利用データ、アンケート、現場ヒアリングをもとに結果を整理し、次の施策につなげます。",
  },
]

/* ─── 実証テーマ例 データ ─── */
const pocExamples = [
  {
    title: "AI動画分析による指導支援",
    description:
      "スマートフォンで撮影した練習動画から、姿勢・関節角度・動作などを分析・可視化し、AIによる競技別フィードバックと組み合わせて、競技者の振り返りや指導者とのコミュニケーションを支援します。",
  },
  {
    title: "地域スポーツのデジタル指導",
    description:
      "対面指導だけでは届きにくい時間・地域でも、動画・AIを活用した継続的なフィードバック環境を検証。",
  },
  {
    title: "部活動・地域クラブの指導DX",
    description:
      "選手の記録、分析結果、課題を蓄積し、指導者と選手間の情報共有方法を検証。",
  },
  {
    title: "スポーツ団体の新規デジタルサービス",
    description:
      "競技団体が保有する専門知識とWeb・アプリ・AIを組み合わせ、会員・競技者向けサービスを検証。",
  },
]

/* ─── 実証ステップ ─── */
const pocSteps = [
  { step: "STEP 1", title: "現場課題・仮説整理" },
  { step: "STEP 2", title: "既存プロダクトまたはMVPを使って実証" },
  { step: "STEP 3", title: "利用状況・アンケート・現場ヒアリング" },
  { step: "STEP 4", title: "成果整理・改善案・次の展開" },
]

/* ─── KPI ─── */
const kpiGroups = [
  {
    label: "利用",
    items: ["利用開始率", "継続利用率", "利用回数"],
  },
  {
    label: "指導",
    items: ["指導者の確認時間", "フィードバック負担", "選手とのコミュニケーション"],
  },
  {
    label: "参加者",
    items: ["満足度", "継続意向", "利用しやすさ"],
  },
  {
    label: "AI品質",
    items: ["分析完了率", "分析不能率", "ユーザー評価"],
  },
  {
    label: "事業",
    items: ["継続導入意向", "有料化可能性", "他競技・他地域への展開可能性"],
  },
]

/* ─── 問い合わせテーマ ─── */
const consultTopics = [
  "自治体・団体でAIを活用した実証を検討したい",
  "スポーツDXの企画段階から相談したい",
  "公募に共同提案できる技術パートナーを探している",
  "スポーツ案件のAI・アプリ部分を再委託したい",
  "既存サービスへAI機能を追加したい",
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
  const heroRef = useInView()
  const targetsRef = useInView()
  const servicesRef = useInView()
  const pocExamplesRef = useInView()
  const pocModelRef = useInView()
  const kpiRef = useInView()
  const productRef = useInView()
  const contactRef = useInView()

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
            <p className="text-sm font-medium text-cyan-400 mb-6 tracking-wide">
              自治体・スポーツ団体向け スポーツDX / AI活用支援
            </p>

            <h1 className="text-3xl sm:text-4xl lg:text-[44px] font-bold text-white leading-[1.4] mb-8">
              スポーツ現場の課題を、
              <br />
              <span className="text-cyan-400 inline-block mt-3">実証からサービス化まで。</span>
            </h1>

            <p className="text-lg text-slate-400 leading-relaxed max-w-2xl mb-10">
              自社スポーツAIプロダクトの開発・運用で得た知見をもとに、自治体・競技団体・スポーツ事業者のDX・AI活用を支援します。
              <br className="hidden sm:inline" />
              課題整理、実証設計、Web・モバイル・AI開発、データ分析、効果検証まで一貫して対応します。
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                asChild
                size="lg"
                className="bg-cyan-600 hover:bg-cyan-500 text-white px-8 text-base w-full sm:w-auto justify-center"
              >
                <Link href="/#contact">
                  スポーツDX・実証について相談する
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white text-base px-8 w-full sm:w-auto justify-center"
              >
                <Link href="/cases/ai-sports-trainer">AIスポーツプロダクトの開発事例を見る</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* ═══════════ 対象・テーマ ═══════════ */}
        <section className="py-20 md:py-28 bg-slate-950" aria-labelledby="targets-heading">
          <div className="container max-w-5xl mx-auto px-6">
            <div
              ref={targetsRef.ref}
              className={`transition-all duration-700 ${
                targetsRef.isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
            >
              <p className="text-xs font-semibold text-cyan-500 tracking-widest uppercase mb-4">
                対象・テーマ
              </p>
              <h2 id="targets-heading" className="text-2xl md:text-3xl font-bold text-white mb-12">
                自治体・スポーツ団体の、こんなテーマに
              </h2>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {targetCategories.map((cat) => (
                  <div
                    key={cat.label}
                    className="p-5 rounded-xl border border-slate-800 bg-slate-900/60"
                  >
                    <h3 className="text-sm font-semibold text-cyan-400 mb-3">{cat.label}</h3>
                    <ul className="space-y-1.5">
                      {cat.items.map((item) => (
                        <li key={item} className="flex items-start gap-2 text-sm text-slate-400">
                          <span className="w-1 h-1 rounded-full bg-slate-600 shrink-0 mt-2" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════ 提供サービス ═══════════ */}
        <section className="py-20 md:py-28 bg-slate-900/40" aria-labelledby="services-heading">
          <div className="container max-w-5xl mx-auto px-6">
            <div
              ref={servicesRef.ref}
              className={`transition-all duration-700 ${
                servicesRef.isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
            >
              <p className="text-xs font-semibold text-cyan-500 tracking-widest uppercase mb-4">
                提供サービス
              </p>
              <h2 id="services-heading" className="text-2xl md:text-3xl font-bold text-white mb-4">
                構想だけでも、既存サービスがあっても対応できます
              </h2>
              <p className="text-slate-400 mb-12 max-w-xl">
                段階に応じた関わり方が可能です。企画段階からでも、技術パートナーとしての部分参加でも対応します。
              </p>

              <div className="grid sm:grid-cols-2 gap-4">
                {services.map((svc, i) => (
                  <div
                    key={i}
                    className="p-6 rounded-xl border border-slate-800 bg-slate-900/60"
                  >
                    <h3 className="text-base font-semibold text-cyan-400 mb-3">{svc.title}</h3>
                    <p className="text-sm text-slate-400 leading-relaxed">{svc.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════ 実証テーマ例 ═══════════ */}
        <section className="py-20 md:py-28 bg-slate-950" aria-labelledby="poc-examples-heading">
          <div className="container max-w-5xl mx-auto px-6">
            <div
              ref={pocExamplesRef.ref}
              className={`transition-all duration-700 ${
                pocExamplesRef.isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
            >
              <p className="text-xs font-semibold text-cyan-500 tracking-widest uppercase mb-4">
                実証テーマ例
              </p>
              <h2 id="poc-examples-heading" className="text-2xl md:text-3xl font-bold text-white mb-12">
                例えば、このような実証が想定できます
              </h2>

              <div className="space-y-4">
                {pocExamples.map((ex, i) => (
                  <div
                    key={i}
                    className="flex flex-col sm:flex-row gap-4 p-6 rounded-xl border border-slate-800 bg-slate-900/60"
                  >
                    <div className="sm:w-56 shrink-0">
                      <h3 className="text-sm font-semibold text-white">{ex.title}</h3>
                    </div>
                    <p className="text-sm text-slate-400 leading-relaxed">{ex.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════ 実証モデル ═══════════ */}
        <section className="py-20 md:py-28 bg-slate-900/40" aria-labelledby="poc-model-heading">
          <div className="container max-w-4xl mx-auto px-6">
            <div
              ref={pocModelRef.ref}
              className={`transition-all duration-700 ${
                pocModelRef.isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
            >
              <p className="text-xs font-semibold text-cyan-500 tracking-widest uppercase mb-4">
                実証モデルの一例
              </p>
              <h2 id="poc-model-heading" className="text-2xl md:text-3xl font-bold text-white mb-4">
                小さく試し、効果を確認してから広げる
              </h2>
              <p className="text-slate-400 mb-10">
                以下は初期実証を想定したモデルの一例です。対象人数や期間、検証内容は、課題や目的に応じて設計します。
              </p>

              {/* 想定規模 */}
              <div className="flex flex-wrap gap-4 mb-12">
                {[
                  { label: "競技数", value: "1競技" },
                  { label: "参加規模", value: "10〜30人程度" },
                  { label: "期間", value: "1〜3か月程度" },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="px-5 py-3 rounded-lg border border-slate-800 bg-slate-900/60 text-center"
                  >
                    <p className="text-xs text-slate-500 mb-1">{item.label}</p>
                    <p className="text-sm font-semibold text-white">{item.value}</p>
                  </div>
                ))}
              </div>

              {/* ステップ */}
              <ol className="relative space-y-0" role="list">
                {pocSteps.map((item, i, arr) => (
                  <li key={i} className="flex gap-6">
                    <div className="flex flex-col items-center">
                      <div className="flex items-center justify-center w-9 h-9 rounded-full border-2 border-cyan-500 bg-slate-950 text-cyan-400 text-xs font-bold shrink-0">
                        {i + 1}
                      </div>
                      {i < arr.length - 1 && (
                        <div className="w-px flex-1 bg-slate-800 my-2" />
                      )}
                    </div>
                    <div className="pb-8">
                      <p className="text-xs text-cyan-500 font-semibold tracking-widest mb-1">
                        {item.step}
                      </p>
                      <h3 className="text-base font-semibold text-white">{item.title}</h3>
                    </div>
                  </li>
                ))}
              </ol>

              <p className="text-sm text-slate-500 mt-4 border-l-2 border-slate-800 pl-4">
                対象人数、期間、競技、検証項目、開発範囲は事業内容に応じて調整します。
              </p>
            </div>
          </div>
        </section>

        {/* ═══════════ KPI ═══════════ */}
        <section className="py-20 md:py-28 bg-slate-950" aria-labelledby="kpi-heading">
          <div className="container max-w-5xl mx-auto px-6">
            <div
              ref={kpiRef.ref}
              className={`transition-all duration-700 ${
                kpiRef.isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
            >
              <p className="text-xs font-semibold text-cyan-500 tracking-widest uppercase mb-4">
                効果検証
              </p>
              <h2 id="kpi-heading" className="text-2xl md:text-3xl font-bold text-white mb-4">
                「作って終わり」にしない効果検証
              </h2>
              <p className="text-slate-400 mb-12">
                以下はKPIの設計例です。実証内容に応じて指標を選定します。
              </p>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {kpiGroups.map((group) => (
                  <div
                    key={group.label}
                    className="p-5 rounded-xl border border-slate-800 bg-slate-900/60"
                  >
                    <h3 className="text-xs font-semibold text-cyan-400 tracking-widest uppercase mb-3">
                      {group.label}
                    </h3>
                    <ul className="space-y-1.5">
                      {group.items.map((item) => (
                        <li key={item} className="flex items-start gap-2 text-sm text-slate-400">
                          <span className="w-1 h-1 rounded-full bg-slate-600 shrink-0 mt-2" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════ 自社プロダクト実績 ═══════════ */}
        <section className="py-20 md:py-28 bg-slate-900/40" aria-labelledby="product-heading">
          <div className="container max-w-5xl mx-auto px-6">
            <div
              ref={productRef.ref}
              className={`transition-all duration-700 ${
                productRef.isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
            >
              <p className="text-xs font-semibold text-cyan-500 tracking-widest uppercase mb-4">
                自社プロダクト
              </p>
              <h2 id="product-heading" className="text-2xl md:text-3xl font-bold text-white mb-4">
                実際のスポーツ現場で使われるAIプロダクトを自社運営
              </h2>
              <p className="text-slate-400 mb-10 max-w-2xl">
                スマートフォンで撮影したスポーツ動画から、競技や分析内容に応じて姿勢・関節角度・動作を解析し、AIによる競技別フィードバックを提示するiOS / Androidアプリを企画・開発・運営しています。
              </p>

              <div className="space-y-4 mb-10">
                {[
                  {
                    title: "企画から運用まで",
                    body: "要件定義、React Nativeアプリ、Firebase / GCP、AI分析、サブスクリプション、ストア公開、利用データ分析まで一貫して担当。",
                  },
                  {
                    title: "AI品質設計",
                    body: "映像から判断できない内容を無理に評価しない、分析不能動画を適切に扱うなど、実運用を前提に品質を設計。",
                  },
                  {
                    title: "継続改善",
                    body: "利用データ、ユーザー評価、処理時間、AIコストなどを確認しながら継続的に改善。",
                  },
                ].map((item, i) => (
                  <div key={i} className="flex gap-4 md:gap-6 p-5 rounded-xl border border-slate-800 bg-slate-900/60">
                    <div className="shrink-0 pt-0.5">
                      <span className="text-sm font-bold text-cyan-500 font-mono">0{i + 1}</span>
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-white mb-1">{item.title}</h3>
                      <p className="text-sm text-slate-400 leading-relaxed">{item.body}</p>
                    </div>
                  </div>
                ))}
              </div>

              <Button
                asChild
                size="sm"
                className="bg-cyan-600 hover:bg-cyan-500 text-white"
              >
                <Link href="/cases/ai-sports-trainer">
                  開発・運用事例を詳しく見る
                  <ArrowRight className="ml-1.5 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* ═══════════ 問い合わせ ═══════════ */}
        <section className="py-20 md:py-28 bg-slate-950" aria-labelledby="contact-heading">
          <div className="container max-w-3xl mx-auto px-6">
            <div
              ref={contactRef.ref}
              className={`transition-all duration-700 ${
                contactRef.isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
            >
              <p className="text-xs font-semibold text-cyan-500 tracking-widest uppercase mb-4">
                ご相談
              </p>
              <h2 id="contact-heading" className="text-2xl md:text-3xl font-bold text-white mb-4">
                こんなご相談に対応できます
              </h2>
              <p className="text-slate-400 mb-10">
                構想段階でも、既に進行中の案件でも対応可能です。まずはご相談ください。
              </p>

              <ul className="space-y-3 mb-10">
                {consultTopics.map((topic, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <ChevronRight className="h-5 w-5 text-cyan-500 mt-0.5 shrink-0" />
                    <span className="text-slate-300 leading-relaxed">{topic}</span>
                  </li>
                ))}
              </ul>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  asChild
                  size="lg"
                  className="bg-cyan-600 hover:bg-cyan-500 text-white px-8 text-base"
                >
                  <Link href="/#contact">
                    スポーツDX・実証について相談する
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
