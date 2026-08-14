"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import {
  ChevronDown,
  Send,
  ExternalLink,
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  Video,
  Brain,
  MessageSquare,
  Dumbbell,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"

/* ─────────────────────────────────────────────
   カスタムフック: スクロール表示検知
───────────────────────────────────────────── */
const CURRENT_YEAR = new Date().getFullYear()
function useInView(options?: IntersectionObserverInit) {
  const ref = useRef<HTMLDivElement>(null)
  const [isInView, setIsInView] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
          observer.unobserve(el)
        }
      },
      { threshold: 0.12, ...options }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return { ref, isInView }
}

/* ─────────────────────────────────────────────
   メインコンポーネント
───────────────────────────────────────────── */
export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [form, setForm] = useState({
    name: "",
    email: "",
    company: "",
    budget: "",
    message: "",
    privacy: false,
  })
  const [sending, setSending] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState("")

  const heroRef = useInView()
  const challengesRef = useInView()
  const servicesRef = useInView()
  const caseStudyRef = useInView()
  const processRef = useInView()
  const profileRef = useInView()
  const contactRef = useInView()

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    const { id, value } = e.target
    setForm((prev) => ({ ...prev, [id]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.privacy) {
      setError("プライバシーポリシーに同意してください。")
      return
    }
    setSending(true)
    setError("")
    try {
      const res = await fetch("/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          company: form.company,
          budget: form.budget,
          message: form.message,
        }),
      })
      if (!res.ok) throw new Error("送信に失敗しました。")
      setDone(true)
    } catch {
      setError("送信に失敗しました。しばらくしてから再度お試しください。")
    } finally {
      setSending(false)
    }
  }

  const navLinks = [
    { label: "支援領域", href: "#services" },
    { label: "開発事例", href: "#case-study" },
    { label: "進め方", href: "#process" },
    { label: "プロフィール", href: "#profile" },
  ]

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* ─── Header ─── */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-slate-950/90 backdrop-blur-md border-b border-slate-800/50">
        <div className="container flex items-center justify-between h-16 max-w-6xl mx-auto px-6">
          {/* ロゴ */}
          <Link href="/" className="flex items-center gap-2 font-bold text-white tracking-tight">
            Cyber Knock
          </Link>

          {/* デスクトップナビ */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-slate-400 hover:text-white transition-colors duration-200"
              >
                {link.label}
              </Link>
            ))}
            <Button
              asChild
              size="sm"
              className="bg-cyan-600 hover:bg-cyan-500 text-white text-sm px-5"
            >
              <Link href="#contact">
                <MessageSquare className="h-4 w-4 mr-1.5" />
                相談する
              </Link>
            </Button>
          </nav>

          {/* モバイルメニュートグル */}
          <button
            className="md:hidden flex items-center gap-1 text-slate-400 hover:text-white"
            onClick={() => setMobileMenuOpen((v) => !v)}
            aria-label="メニューを開く"
          >
            <span className="text-sm">メニュー</span>
            <ChevronDown
              className={`h-4 w-4 transition-transform duration-200 ${mobileMenuOpen ? "rotate-180" : ""}`}
            />
          </button>
        </div>

        {/* モバイルメニュー */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-800 bg-slate-950 px-6 py-4 space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block text-sm text-slate-400 hover:text-white py-1"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Button
              asChild
              size="sm"
              className="w-full bg-cyan-600 hover:bg-cyan-500 text-white mt-2"
            >
              <Link href="#contact" onClick={() => setMobileMenuOpen(false)}>
                サービス開発について相談する
              </Link>
            </Button>
          </div>
        )}
      </header>

      <main>
        {/* ═══════════ HERO ═══════════ */}
        <section className="relative pt-32 pb-16 md:pt-40 md:pb-24 overflow-hidden">
          {/* 背景: 控えめなグラデーション */}
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950 pointer-events-none" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-cyan-500/5 rounded-full blur-[120px] pointer-events-none" />

          <div
            ref={heroRef.ref}
            className={`relative container max-w-7xl mx-auto px-6 transition-all duration-1000 ${
              heroRef.isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
              
              {/* 左側: テキスト */}
              <div className="lg:col-span-7 flex flex-col justify-center order-1 relative z-10 mt-4 md:mt-0">
                {/* 補助見出し */}
                <p className="text-sm font-medium text-cyan-400 mb-6 tracking-wide">
                  自社でスポーツAIプロダクトを開発・運用
                </p>

                {/* メイン見出し */}
                <h1 className="text-3xl sm:text-4xl lg:text-[40px] xl:text-[48px] font-bold tracking-tight text-white leading-[1.35] lg:leading-[1.25] mb-8">
                  <span className="lg:whitespace-nowrap">スポーツ領域の新しいサービスを、</span>
                  <br className="hidden lg:inline" />
                  <span className="text-cyan-400 lg:whitespace-nowrap lg:mt-2 lg:inline-block">企画から開発・改善まで。</span>
                </h1>

                {/* 補足 */}
                <p className="text-lg text-slate-400 leading-relaxed max-w-xl mb-10">
                  自社でAI動画分析アプリを企画・開発・運用してきた経験をもとに、
                  <br className="hidden sm:inline" />
                  スポーツ領域の新規サービスやAI機能を、要件整理からWeb・モバイル開発、リリース後の改善まで支援します。
                </p>

                {/* CTA */}
                <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                  <Button
                    asChild
                    size="lg"
                    className="bg-cyan-600 hover:bg-cyan-500 text-white px-8 text-base w-full sm:w-auto justify-center"
                  >
                    <Link href="#contact">
                      サービス開発について相談する
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                  <Button
                    asChild
                    size="lg"
                    variant="outline"
                    className="border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white text-base px-8 w-full sm:w-auto justify-center"
                  >
                    <Link href="#case-study">開発・運用事例を見る</Link>
                  </Button>
                </div>
              </div>

              {/* 右側: 画像 */}
              <div className="lg:col-span-5 order-2 relative z-0 flex justify-center lg:justify-end">
                <div className="relative w-full max-w-[540px] lg:max-w-none lg:w-[120%] xl:w-[125%] lg:-mr-[10%] xl:-mr-[15%]">
                  {/* 装飾用のグローエフェクト */}
                  <div className="absolute inset-0 bg-cyan-500/20 rounded-3xl blur-[80px] -z-10" />
                  <div className="rounded-2xl overflow-hidden border border-slate-800/60 drop-shadow-[0_0_40px_rgba(34,211,238,0.15)]">
                    <img 
                      src="/hero-main.png" 
                      alt="AI動画分析アプリの画面イメージ"
                      className="w-full h-auto object-cover"
                      loading="eager"
                    />
                  </div>
                </div>
              </div>
              
            </div>
          </div>
        </section>

        {/* ═══════════ CHALLENGES ═══════════ */}
        <section id="challenges" className="pt-16 pb-24 md:pt-20 md:pb-32 bg-slate-950">
          <div className="container max-w-4xl mx-auto px-6">
            <div
              ref={challengesRef.ref}
              className={`transition-all duration-700 ${
                challengesRef.isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
            >
              <p className="text-xs font-semibold text-cyan-500 tracking-widest uppercase mb-4">
                こんな課題はありませんか
              </p>
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-10">
                スポーツ領域のプロダクト開発に関わる企業・チームのご相談
              </h2>
              <ul className="space-y-5" role="list">
                {[
                  "スポーツ動画や動作データをサービスに活用したい",
                  "新しいスポーツサービスやアプリを構想している",
                  "AIでどこまで実現できるか、品質やコストを判断したい",
                  "事業側と開発側をつなぎ、構想からリリースまで主導する技術パートナーが必要",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-4">
                    <ChevronRight className="h-5 w-5 text-cyan-500 mt-0.5 shrink-0" />
                    <span className="text-lg text-slate-300 leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* ═══════════ SERVICES ═══════════ */}
        <section id="services" className="py-24 md:py-32 bg-slate-900/40">
          <div className="container max-w-5xl mx-auto px-6">
            <div
              ref={servicesRef.ref}
              className={`transition-all duration-700 ${
                servicesRef.isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
            >
              <p className="text-xs font-semibold text-cyan-500 tracking-widest uppercase mb-4">
                支援領域
              </p>
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-12">
                できること
              </h2>

              {/* 横長ブロック */}
              <div className="space-y-4">
                {[
                  {
                    title: "スポーツAI・動画分析開発",
                    description:
                      "スポーツ動画を使ったAI分析基盤の設計・開発。競技別の評価基準設計、映像から確認できる範囲に限定した分析設計、AI出力の構造化・検証・正規化、処理時間とコストの最適化まで対応します。",
                  },
                  {
                    title: "スポーツプロダクトの新規開発",
                    description:
                      "要件整理、UX設計、Web・モバイルアプリ開発、バックエンド構築、ストア公開まで一貫して対応。サブスクリプション設計、ユーザー管理、継続改善を含む0→1開発を支援します。",
                  },
                  {
                    title: "開発顧問・リリース後の改善",
                    description:
                      "技術選定、アーキテクチャ設計、AI品質・コスト改善、既存サービスへのAI機能追加、外部開発会社のレビューなど。要件が固まる前の段階からご相談いただけます。",
                  },
                ].map((service, i) => (
                  <div
                    key={i}
                    className="flex flex-col sm:flex-row gap-6 p-6 md:p-8 rounded-xl border border-slate-800 bg-slate-900/60"
                  >
                    <div className="sm:w-64 shrink-0">
                      <h3 className="text-base font-semibold text-cyan-400">{service.title}</h3>
                    </div>
                    <p className="text-slate-400 leading-relaxed text-sm">{service.description}</p>
                  </div>
                ))}
              </div>

              {/* 活用例 */}
              <div className="mt-10 p-6 rounded-xl border border-slate-800/60 bg-slate-950/50">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-4">
                  活用例
                </p>
                <ul className="grid sm:grid-cols-2 gap-2 text-sm text-slate-400">
                  {[
                    "選手・保護者向けのトレーニング支援アプリ",
                    "指導者向けの練習管理・フィードバックツール",
                    "スクール・施設向けの会員アプリ・動画指導サービス",
                    "ファン・コミュニティ向けの検定・ランキング・イベント機能",
                  ].map((example, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <span className="w-1 h-1 rounded-full bg-slate-600 shrink-0" />
                      {example}
                    </li>
                  ))}
                </ul>
                {/* スポーツDXへの導線 */}
                <div className="mt-6 pt-5 border-t border-slate-800">
                  <p className="text-xs text-slate-500 mb-3">自治体・競技団体・スポーツ事業者の方へ</p>
                  <Link
                    href="/sports-dx"
                    className="inline-flex items-center gap-1.5 text-sm text-cyan-400 hover:text-cyan-300 transition-colors"
                  >
                    スポーツDX・AI実証支援について見る
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════ CASE STUDY ═══════════ */}
        <section id="case-study" className="py-24 md:py-32 bg-slate-950">
          <div className="container max-w-5xl mx-auto px-6">
            <div
              ref={caseStudyRef.ref}
              className={`transition-all duration-700 ${
                caseStudyRef.isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
            >
              <p className="text-xs font-semibold text-cyan-500 tracking-widest uppercase mb-4">
                自社プロダクト開発・運用
              </p>
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                AIスポーツトレーナー
              </h2>
              <p className="text-slate-400 mb-10 max-w-2xl">
                スマートフォンで撮影したスポーツ動画をAIで分析し、競技者や保護者、指導者が理解しやすい改善点を提示するiOS・Androidアプリ。
                <br className="hidden md:inline" />
                企画から要件定義、開発、ストア公開、継続運用まで自社で一貫して担当しています。
              </p>

              {/* ストアリンク */}
              <div className="flex flex-wrap gap-3 mb-14">
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
              </div>

              {/* CSSフロー図 */}
              <div className="mb-14">
                <p className="text-xs text-slate-500 mb-4 uppercase tracking-widest">
                  アプリの処理フロー
                </p>
                <div className="flex flex-wrap items-center gap-0">
                  {[
                    { icon: Video, label: "動画撮影" },
                    { icon: Brain, label: "AI・動作分析" },
                    { icon: MessageSquare, label: "フィードバック生成" },
                    { icon: Dumbbell, label: "練習・改善" },
                  ].map((step, i, arr) => (
                    <div key={i} className="flex items-center">
                      <div className="flex flex-col items-center gap-2 px-4 py-3">
                        <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-slate-800 border border-slate-700">
                          <step.icon className="h-5 w-5 text-cyan-400" />
                        </div>
                        <span className="text-xs text-slate-400 whitespace-nowrap">{step.label}</span>
                      </div>
                      {i < arr.length - 1 && (
                        <ArrowRight className="h-4 w-4 text-slate-600 shrink-0" />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* 3項目 – 番号とコンテンツ */}
              <div className="space-y-10">
                {[
                  {
                    title: "公開・運用まで一貫して担当",
                    body: "企画・要件定義・UX設計・React NativeによるiOS/Android開発・Firebase/GCPを使ったバックエンド・AI動画分析基盤・サブスクリプション・ストア公開・データ分析・継続改善まで、すべて自社で担当しています。",
                  },
                  {
                    title: "無理に評価しないための品質設計",
                    body: "競技によって見るべき動作が異なること、映像だけでは判断できない項目があること、年齢や経験によって適切な説明が変わることを考慮して評価基準を設計しています。分析不能な動画や不適切な入力を安全に扱う設計、AI出力の構造化・検証・正規化にも取り組んでいます。",
                  },
                  {
                    title: "利用結果から継続的に改善",
                    body: "ユーザー評価をもとにした品質改善、モデル変更時の評価方法の整備、処理時間と推論コストの調整、利用導線の見直しを継続的に行っています。",
                  },
                ].map((item, i) => (
                  <div key={i} className="flex gap-4 md:gap-6">
                    {/* 番号 */}
                    <div className="shrink-0 pt-1">
                      <span className="text-sm md:text-base font-bold text-cyan-500 tracking-widest font-mono">
                        0{i + 1}
                      </span>
                      <div className="h-0.5 w-full bg-cyan-500/20 mt-2" />
                    </div>
                    {/* コンテンツ (見出し＋本文) */}
                    <div>
                      <h3 className="text-base font-semibold text-white mb-2 leading-snug">
                        {item.title}
                      </h3>
                      <p className="text-slate-400 leading-relaxed text-sm">
                        {item.body}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* 他社支援への接続 */}
              <div className="mt-12 p-6 rounded-xl border border-cyan-500/20 bg-cyan-500/5">
                <p className="text-sm text-slate-300 leading-relaxed">
                  この開発・運用で得た知見を、スポーツ企業の新規プロダクト開発、
                  既存サービスへのAI機能追加、モバイルアプリ開発に活用できます。
                </p>
                <div className="flex flex-col sm:flex-row gap-3 mt-4">
                  <Button
                    asChild
                    size="sm"
                    className="bg-cyan-600 hover:bg-cyan-500 text-white"
                  >
                    <Link href="#contact">
                      開発について相談する
                      <ArrowRight className="ml-1.5 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button
                    asChild
                    size="sm"
                    variant="outline"
                    className="border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white"
                  >
                    <Link href="/cases/ai-sports-trainer">
                      開発・運用事例を詳しく見る
                      <ArrowRight className="ml-1.5 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════ PROCESS ═══════════ */}
        <section id="process" className="py-24 md:py-32 bg-slate-900/40">
          <div className="container max-w-4xl mx-auto px-6">
            <div
              ref={processRef.ref}
              className={`transition-all duration-700 ${
                processRef.isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
            >
              <p className="text-xs font-semibold text-cyan-500 tracking-widest uppercase mb-4">
                支援の進め方
              </p>
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                要件が固まる前から相談できます
              </h2>
              <p className="text-slate-400 mb-12 max-w-xl">
                アイデア段階でも構いません。小さく検証して改善していく進め方を基本としています。
              </p>

              {/* タイムライン */}
              <ol className="relative space-y-0" role="list">
                {[
                  {
                    step: "01",
                    title: "現場課題と事業構想の整理",
                    desc: "何を解決したいか、誰のためのサービスか、どこまでをAIで実現するかを一緒に整理します。",
                  },
                  {
                    step: "02",
                    title: "実現可能性の確認とMVP設計",
                    desc: "技術的な実現可能性を確認し、最初にリリースすべき範囲を決めます。精度・コスト・開発期間のバランスを考慮します。",
                  },
                  {
                    step: "03",
                    title: "開発・公開",
                    desc: "Web・モバイル・AIバックエンドを設計・実装し、ストア公開やリリースまで対応します。",
                  },
                  {
                    step: "04",
                    title: "利用結果をもとに改善",
                    desc: "利用状況・ユーザー評価・AI品質・処理コストを確認しながら、継続的に改善します。",
                  },
                ].map((item, i, arr) => (
                  <li key={i} className="flex gap-6">
                    {/* タイムラインライン */}
                    <div className="flex flex-col items-center">
                      <div className="flex items-center justify-center w-9 h-9 rounded-full border-2 border-cyan-500 bg-slate-950 text-cyan-400 text-xs font-bold shrink-0">
                        {item.step}
                      </div>
                      {i < arr.length - 1 && (
                        <div className="w-px flex-1 bg-slate-800 my-2" />
                      )}
                    </div>
                    {/* コンテンツ */}
                    <div className="pb-10">
                      <h3 className="text-base font-semibold text-white mb-1">{item.title}</h3>
                      <p className="text-sm text-slate-400 leading-relaxed">{item.desc}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        {/* ═══════════ PROFILE ═══════════ */}
        <section id="profile" className="py-24 md:py-32 bg-slate-950">
          <div className="container max-w-4xl mx-auto px-6">
            <div
              ref={profileRef.ref}
              className={`transition-all duration-700 ${
                profileRef.isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
            >
              <p className="text-xs font-semibold text-cyan-500 tracking-widest uppercase mb-4">
                プロフィール
              </p>
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-8">渡辺 晴仁</h2>

              <div className="max-w-2xl space-y-4 text-slate-400 leading-relaxed mb-14">
                <p>
                  事業会社とデジタルクリエイティブ企業で、Webサービスの開発・改善、スポーツDX、AI・R&D領域のプロダクト開発を経験した後、2024年に独立。
                </p>
                <p>
                  現在は、自ら企画・開発したスポーツAIプロダクトを運営しながら、スタートアップや新規事業チームのプロダクト開発・技術支援を行っています。
                </p>
                <p>
                  Web・モバイル・バックエンド・クラウド・AIまで横断し、企画・要件整理から設計・実装、リリース後の改善まで一貫して対応しています。
                </p>
              </div>

              {/* 事業者情報 */}
              <div className="border-t border-slate-800 pt-10">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-6">
                  事業者情報
                </p>
                <dl className="space-y-4 text-sm">
                  {[
                    { dt: "屋号", dd: "Cyber Knock（サイバーノック）" },
                    { dt: "代表者", dd: "渡辺 晴仁" },
                    {
                      dt: "所在地",
                      dd: "〒150-0043 東京都渋谷区道玄坂1丁目10番8号 渋谷道玄坂東急ビル2F−C",
                    },
                    {
                      dt: "事業内容",
                      dd: "スポーツ領域を中心としたAI・Web・モバイルプロダクト開発、開発顧問、自社プロダクト運営",
                    },
                  ].map((row) => (
                    <div key={row.dt} className="flex flex-col sm:flex-row gap-1 sm:gap-8">
                      <dt className="w-24 shrink-0 text-slate-500">{row.dt}</dt>
                      <dd className="text-slate-300">{row.dd}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════ CONTACT ═══════════ */}
        <section id="contact" className="py-24 md:py-32 bg-slate-900/40">
          <div className="container max-w-2xl mx-auto px-6">
            <div
              ref={contactRef.ref}
              className={`transition-all duration-700 ${
                contactRef.isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
            >
              <p className="text-xs font-semibold text-cyan-500 tracking-widest uppercase mb-4">
                お問い合わせ
              </p>
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                構想段階から相談できます
              </h2>
              <p className="text-slate-400 mb-10 leading-relaxed">
                まだ要件や仕様が固まっていない段階でもご相談いただけます。
                実現可能性の整理、AIを使うべき範囲、MVPの進め方から一緒に検討します。
              </p>

              <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-8 md:p-10">
                {done ? (
                  <div className="text-center py-12">
                    <div className="inline-flex p-4 rounded-full bg-emerald-500/10 mb-6">
                      <CheckCircle2 className="h-10 w-10 text-emerald-500" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3">送信が完了しました</h3>
                    <p className="text-slate-400">
                      お問い合わせいただき、ありがとうございます。
                      <br />
                      内容を確認の上、2営業日以内にご連絡いたします。
                    </p>
                  </div>
                ) : (
                  <form className="space-y-5" onSubmit={handleSubmit} noValidate>
                    <div className="grid sm:grid-cols-2 gap-5">
                      <div className="space-y-2">
                        <label htmlFor="name" className="block text-sm font-medium text-slate-300">
                          氏名 <span className="text-red-400">*</span>
                        </label>
                        <Input
                          id="name"
                          value={form.name}
                          onChange={handleChange}
                          placeholder="山田 太郎"
                          required
                          className="bg-slate-800/60 border-slate-700 focus-visible:ring-cyan-500 placeholder:text-slate-600"
                          disabled={sending}
                        />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="email" className="block text-sm font-medium text-slate-300">
                          メールアドレス <span className="text-red-400">*</span>
                        </label>
                        <Input
                          id="email"
                          type="email"
                          value={form.email}
                          onChange={handleChange}
                          placeholder="example@company.com"
                          required
                          className="bg-slate-800/60 border-slate-700 focus-visible:ring-cyan-500 placeholder:text-slate-600"
                          disabled={sending}
                        />
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-5">
                      <div className="space-y-2">
                        <label htmlFor="company" className="block text-sm font-medium text-slate-300">
                          会社名・組織名
                        </label>
                        <Input
                          id="company"
                          value={form.company}
                          onChange={handleChange}
                          placeholder="株式会社サンプル"
                          className="bg-slate-800/60 border-slate-700 focus-visible:ring-cyan-500 placeholder:text-slate-600"
                          disabled={sending}
                        />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="budget" className="block text-sm font-medium text-slate-300">
                          ご予算感
                        </label>
                        <select
                          id="budget"
                          value={form.budget}
                          onChange={handleChange}
                          className="flex h-10 w-full rounded-md border border-slate-700 bg-slate-800/60 px-3 py-2 text-sm text-slate-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500"
                          disabled={sending}
                        >
                          <option value="">選択してください</option>
                          <option value="〜50万円">〜50万円</option>
                          <option value="50〜100万円">50〜100万円</option>
                          <option value="100〜300万円">100〜300万円</option>
                          <option value="300〜500万円">300〜500万円</option>
                          <option value="500万円〜">500万円〜</option>
                          <option value="相談して決めたい">相談して決めたい</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="message" className="block text-sm font-medium text-slate-300">
                        ご相談内容 <span className="text-red-400">*</span>
                      </label>
                      <Textarea
                        id="message"
                        value={form.message}
                        onChange={handleChange}
                        placeholder="例：スポーツスクールの会員向けアプリを開発したい。動画を使ったAI分析機能を検討しているが、どこまで実現できるか相談したい。"
                        required
                        className="min-h-[140px] bg-slate-800/60 border-slate-700 focus-visible:ring-cyan-500 placeholder:text-slate-600"
                        disabled={sending}
                      />
                    </div>

                    <div className="flex items-start gap-2.5">
                      <Checkbox
                        id="privacy"
                        checked={form.privacy}
                        onCheckedChange={(checked) =>
                          setForm((prev) => ({ ...prev, privacy: checked as boolean }))
                        }
                        className="mt-1 data-[state=checked]:bg-cyan-600 data-[state=checked]:border-cyan-600"
                        disabled={sending}
                      />
                      <label htmlFor="privacy" className="text-sm text-slate-400">
                        <span className="text-red-400">*</span>{" "}
                        <Link
                          href="/privacy-policy"
                          className="text-cyan-400 hover:text-cyan-300 underline underline-offset-2"
                        >
                          プライバシーポリシー
                        </Link>
                        に同意します
                      </label>
                    </div>

                    {error && (
                      <div className="text-red-400 text-sm bg-red-500/10 rounded-lg px-4 py-2.5">
                        {error}
                      </div>
                    )}

                    <Button
                      type="submit"
                      className="w-full bg-cyan-600 hover:bg-cyan-500 text-white h-12 text-base"
                      disabled={sending}
                    >
                      <Send className="mr-2 h-4 w-4" />
                      {sending ? "送信中..." : "相談内容を送信する"}
                    </Button>

                    <p className="text-center text-xs text-slate-500">
                      2営業日以内にご連絡いたします。
                    </p>
                  </form>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ─── Footer ─── */}
      <footer className="py-10 bg-slate-900 border-t border-slate-800">
        <div className="container max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-6">
            <div className="shrink-0">
              <Link href="/" className="font-bold text-white text-sm">
                Cyber Knock
              </Link>
              <p className="text-xs text-slate-500 mt-1">
                スポーツ領域を中心としたAI・プロダクト開発
              </p>
            </div>
            <nav className="flex flex-wrap items-center gap-x-6 gap-y-2" aria-label="フッターナビゲーション">
              {[
                { label: "支援領域", href: "#services" },
                { label: "開発事例", href: "#case-study" },
                { label: "進め方", href: "#process" },
                { label: "プロフィール", href: "#profile" },
                { label: "お問い合わせ", href: "#contact" },
                { label: "スポーツDX支援", href: "/sports-dx" },
                { label: "AIスポーツトレーナー事例", href: "/cases/ai-sports-trainer" },
                { label: "データ取り扱い", href: "/security" },
                { label: "プライバシーポリシー", href: "/privacy-policy" },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-xs text-slate-400 hover:text-white transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
          <div className="border-t border-slate-800 pt-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <p className="text-xs text-slate-500">
              <Link
                href="https://ai-sportstrainer.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-400 hover:text-white transition-colors"
              >
                AIスポーツトレーナー
              </Link>
              {" "}は、Cyber Knockが企画・開発・運営するスポーツ動画分析アプリです。
            </p>
            <p className="text-xs text-slate-500 shrink-0">
              &copy; {CURRENT_YEAR} Cyber Knock
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
