"use client";

import Image from "next/image"
import Link from "next/link"
import {
  ChevronDown, Send, ExternalLink, Code, Cpu, Globe, Lightbulb,
  Award, User, MapPin, ArrowRight, Sparkles, Zap, Search, Bot,
  Smartphone, BarChart3, MessageSquare, CheckCircle2, Clock, Target,
  Layers, TrendingUp, ChevronRight
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { useState, useEffect, useRef } from "react";

/* ────────── Intersection Observer Hook ────────── */
function useInView(options?: IntersectionObserverInit) {
  const ref = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsInView(true);
        observer.unobserve(el);
      }
    }, { threshold: 0.15, ...options });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return { ref, isInView };
}

/* ────────── Animated Counter ────────── */
function AnimatedCounter({ end, suffix = "", duration = 2000 }: { end: number; suffix?: string; duration?: number }) {
  const [count, setCount] = useState(0);
  const { ref, isInView } = useInView();

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const increment = end / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [isInView, end, duration]);

  return <span ref={ref}>{count}{suffix}</span>;
}

/* ────────── Service Card ────────── */
function ServiceCard({ icon: Icon, title, description, features, gradient }: {
  icon: React.ElementType;
  title: string;
  description: string;
  features: string[];
  gradient: string;
}) {
  const { ref, isInView } = useInView();
  return (
    <div
      ref={ref}
      className={`group relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-sm p-8
        transition-all duration-700 hover:border-cyan-800/60 hover:shadow-[0_0_40px_rgba(6,182,212,0.08)]
        ${isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
    >
      <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${gradient}`} />
      <div className="relative z-10">
        <div className="mb-5 p-3.5 bg-cyan-500/10 rounded-xl w-fit group-hover:bg-cyan-500/20 transition-colors duration-300">
          <Icon className="h-7 w-7 text-cyan-400" />
        </div>
        <h3 className="text-xl font-bold mb-3 text-white">{title}</h3>
        <p className="text-slate-400 mb-5 leading-relaxed">{description}</p>
        <ul className="space-y-2.5">
          {features.map((f, i) => (
            <li key={i} className="flex items-start gap-2.5 text-sm text-slate-300">
              <CheckCircle2 className="h-4 w-4 text-cyan-500 mt-0.5 shrink-0" />
              <span>{f}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/* ────────── Process Step ────────── */
function ProcessStep({ step, title, description, icon: Icon }: {
  step: string; title: string; description: string; icon: React.ElementType;
}) {
  const { ref, isInView } = useInView();
  return (
    <div ref={ref} className={`flex flex-col items-center text-center transition-all duration-700 ${isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
      <div className="relative mb-5">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-cyan-500/20 to-blue-600/20 flex items-center justify-center border border-cyan-500/30">
          <Icon className="h-7 w-7 text-cyan-400" />
        </div>
        <span className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-cyan-600 text-white text-xs font-bold flex items-center justify-center">{step}</span>
      </div>
      <h4 className="text-lg font-bold text-white mb-2">{title}</h4>
      <p className="text-sm text-slate-400 leading-relaxed max-w-[240px]">{description}</p>
    </div>
  );
}

/* ────────── Main Component ────────── */
export default function Home() {
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const target = e.target as HTMLInputElement;
    const { id, value, type, checked } = target;
    setForm((prev) => ({
      ...prev,
      [id]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    if (!form.privacy) {
      setError("プライバシーポリシーに同意してください。");
      return;
    }
    setSending(true);
    try {
      const res = await fetch("/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setDone(true);
        setForm({ name: "", email: "", company: "", budget: "", message: "", privacy: false });
      } else {
        setError("送信に失敗しました。しばらくしてから再度お試しください。");
      }
    } catch {
      setError("送信に失敗しました。しばらくしてから再度お試しください。");
    }
    setSending(false);
  };

  const heroRef = useInView();
  const statsRef = useInView();
  const productsRef = useInView();

  return (
    <div className="flex min-h-screen flex-col bg-slate-950 text-slate-100">
      {/* ─── Header ─── */}
      <header className="fixed top-0 z-50 w-full border-b border-slate-800/60 bg-slate-950/80 backdrop-blur-xl">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="relative">
              <Cpu className="h-7 w-7 text-cyan-500 group-hover:text-cyan-400 transition-colors" />
              <div className="absolute inset-0 blur-lg bg-cyan-500/30 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <span className="text-xl font-bold tracking-tight">Cyber Knock</span>
          </Link>
          <nav className="hidden md:flex items-center gap-8">
            <Link href="#services" className="text-sm font-medium text-slate-400 hover:text-white transition-colors duration-300">
              サービス
            </Link>
            <Link href="#products" className="text-sm font-medium text-slate-400 hover:text-white transition-colors duration-300">
              プロダクト
            </Link>
            <Link href="#process" className="text-sm font-medium text-slate-400 hover:text-white transition-colors duration-300">
              開発の流れ
            </Link>
            <Link href="#about" className="text-sm font-medium text-slate-400 hover:text-white transition-colors duration-300">
              会社概要
            </Link>
            <Button asChild size="sm" className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white shadow-lg shadow-cyan-500/20">
              <Link href="#contact">
                <MessageSquare className="h-4 w-4 mr-1.5" />
                無料相談する
              </Link>
            </Button>
          </nav>
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            <span className="sr-only">メニューを開く</span>
            <ChevronDown className={`h-5 w-5 transition-transform duration-300 ${mobileMenuOpen ? "rotate-180" : ""}`} />
          </Button>
        </div>
        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-800/60 bg-slate-950/95 backdrop-blur-xl">
            <nav className="container py-4 flex flex-col gap-3">
              <Link href="#services" className="py-2 text-sm text-slate-300 hover:text-white" onClick={() => setMobileMenuOpen(false)}>サービス</Link>
              <Link href="#products" className="py-2 text-sm text-slate-300 hover:text-white" onClick={() => setMobileMenuOpen(false)}>プロダクト</Link>
              <Link href="#process" className="py-2 text-sm text-slate-300 hover:text-white" onClick={() => setMobileMenuOpen(false)}>開発の流れ</Link>
              <Link href="#about" className="py-2 text-sm text-slate-300 hover:text-white" onClick={() => setMobileMenuOpen(false)}>会社概要</Link>
              <Button asChild size="sm" className="bg-gradient-to-r from-cyan-600 to-blue-600 text-white w-full mt-2">
                <Link href="#contact" onClick={() => setMobileMenuOpen(false)}>無料相談する</Link>
              </Button>
            </nav>
          </div>
        )}
      </header>

      <main className="flex-1 pt-16">
        {/* ═══════════ HERO ═══════════ */}
        <section className="relative overflow-hidden py-24 md:py-36 lg:py-44">
          {/* Background layers */}
          <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950" />
          <div className="absolute inset-0 opacity-[0.07] bg-[radial-gradient(#06b6d4_1px,transparent_1px)] [background-size:32px_32px]" />
          <div className="absolute top-1/4 -left-32 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px]" />
          <Image
            src="/hero-bg.png"
            alt=""
            fill
            className="object-cover opacity-20 mix-blend-lighten"
            priority
          />

          <div ref={heroRef.ref} className={`container relative z-10 transition-all duration-1000 ${heroRef.isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}>
            <div className="mx-auto max-w-4xl text-center">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 px-4 py-1.5 mb-8">
                <Sparkles className="h-4 w-4 text-cyan-400" />
                <span className="text-sm font-medium text-cyan-300">AI × エンジニアリングで事業成長を加速</span>
              </div>

              <h1 className="mb-6 text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl bg-gradient-to-b from-white to-slate-300 bg-clip-text text-transparent leading-[1.15]">
                <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">AI × 開発力</span>で、事業成長を加速させる。
              </h1>

              <p className="mb-10 text-lg text-slate-400 sm:text-xl max-w-2xl mx-auto leading-relaxed">
                生成AIシステム・Web/アプリ開発からSEO×LLMO戦略まで。<br className="hidden sm:inline" />
                企画・設計・開発・運用をワンストップで支援します。
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-base shadow-xl shadow-cyan-500/20 px-8">
                  <Link href="#contact">
                    無料で相談する
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="border-slate-700 text-slate-200 hover:bg-slate-800 hover:text-white text-base px-8"
                >
                  <Link href="#services">提供サービスを見る</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════ STATS BAR ═══════════ */}
        <section className="relative py-12 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border-y border-slate-800/60">
          <div ref={statsRef.ref} className={`container transition-all duration-700 ${statsRef.isInView ? "opacity-100" : "opacity-0"}`}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-3xl md:text-4xl font-bold text-cyan-400 mb-1">
                  <AnimatedCounter end={2} suffix="つ+" />
                </div>
                <p className="text-sm text-slate-400">自社プロダクト運用中</p>
              </div>
              <div>
                <div className="text-3xl md:text-4xl font-bold text-cyan-400 mb-1">
                  iOS / Android
                </div>
                <p className="text-sm text-slate-400">クロスプラットフォーム対応</p>
              </div>
              <div>
                <div className="text-3xl md:text-4xl font-bold text-cyan-400 mb-1">
                  <AnimatedCounter end={0} suffix="" />→リリース
                </div>
                <p className="text-sm text-slate-400">個人で0→1のプロダクト開発</p>
              </div>
              <div>
                <div className="text-3xl md:text-4xl font-bold text-cyan-400 mb-1">
                  AI特化
                </div>
                <p className="text-sm text-slate-400">生成AI活用の知見・実績</p>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════ SERVICES ═══════════ */}
        <section id="services" className="py-24 md:py-32 bg-slate-950">
          <div className="container">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 px-4 py-1.5 mb-4">
                <Layers className="h-4 w-4 text-cyan-400" />
                <span className="text-sm font-medium text-cyan-300">SERVICES</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">提供サービス</h2>
              <p className="max-w-2xl mx-auto text-slate-400 leading-relaxed">
                お客様のビジネスフェーズに合わせて、<br className="hidden sm:inline" />
                技術選定・設計から開発・運用まで一気通貫でサポートします。
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <ServiceCard
                icon={Bot}
                title="生成AIシステム開発"
                description="生成AI技術を活用し、業務効率化や新たな価値創出を実現するシステムを開発します。"
                features={[
                  "OpenAI / Gemini / Claude APIを活用したAIアプリ",
                  "Dify・LangChainによるAIエージェント構築",
                  "AIによる画像・動画解析システムの構築",
                  "Google Vertex AIによる迅速なプロトタイピング",
                ]}
                gradient="bg-gradient-to-br from-cyan-500/5 to-transparent"
              />
              <ServiceCard
                icon={Code}
                title="Web・ネイティブアプリ開発"
                description="業務システム、Webサービス、スマートフォンアプリなど多様なニーズに応える受託開発を行います。"
                features={[
                  "React / Next.js / TypeScriptによるモダンWeb開発",
                  "iOS / Android ネイティブ・クロスプラットフォーム開発",
                  "Firebase / Supabase / AWSを使ったバックエンド構築",
                  "企画・設計から保守運用までワンストップ対応",
                ]}
                gradient="bg-gradient-to-br from-blue-500/5 to-transparent"
              />
              <ServiceCard
                icon={Target}
                title="SEO × LLMO ハイブリッド伴走支援"
                description="生成AI時代に貴社ブランドが真っ先に選ばれる仕組みづくりと事業成果の創出に貢献します。"
                features={[
                  "コンテンツ設計・技術/UX改善・KPI設計",
                  "LLM最適化（LLMO）による生成AI検索対策",
                  "SEO戦略とLLMO戦略のハイブリッド施策",
                  "データ分析に基づくPDCA伴走支援",
                ]}
                gradient="bg-gradient-to-br from-purple-500/5 to-transparent"
              />
              <ServiceCard
                icon={Lightbulb}
                title="新規プロダクト 技術選定・設計"
                description="新規プロダクトの立ち上げ段階から、最適な技術選定とアーキテクチャ設計を支援します。"
                features={[
                  "MVP開発による仮説検証の高速化",
                  "スケーラブルなアーキテクチャ設計",
                  "技術的負債を最小化するコードベース構築",
                  "CI/CD・監視体制の構築",
                ]}
                gradient="bg-gradient-to-br from-emerald-500/5 to-transparent"
              />
              <ServiceCard
                icon={Sparkles}
                title="AIを活用したプロダクト開発相談"
                description="AIとビジネス両方の視点から、プロダクトにAIをどう活かすか一緒に考えます。"
                features={[
                  "AI活用の要件定義・技術PoC支援",
                  "既存サービスへのAI機能組み込み",
                  "AI×UXの設計コンサルティング",
                  "コスト最適化とスケーリング戦略",
                ]}
                gradient="bg-gradient-to-br from-amber-500/5 to-transparent"
              />
              <ServiceCard
                icon={Zap}
                title="OpenClaw等を活用したAIシステム開発"
                description="オープンソースAIフレームワークを活用し、柔軟でコスト効率の高いAIシステムを構築します。"
                features={[
                  "OpenClaw / LangChain / CrewAIの活用",
                  "マルチエージェントシステム設計・構築",
                  "カスタムAIワークフロー開発",
                  "自社インフラでのAI運用環境構築",
                ]}
                gradient="bg-gradient-to-br from-rose-500/5 to-transparent"
              />
            </div>
          </div>
        </section>

        {/* ═══════════ PRODUCTS ═══════════ */}
        <section id="products" className="py-24 md:py-32 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
          <div className="container">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 px-4 py-1.5 mb-4">
                <Smartphone className="h-4 w-4 text-cyan-400" />
                <span className="text-sm font-medium text-cyan-300">OUR PRODUCTS</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">自社プロダクト</h2>
              <p className="max-w-2xl mx-auto text-slate-400 leading-relaxed">
                個人で0からの企画・開発・運用を通じて培った<br className="hidden sm:inline" />
                実践的な知見をお客様への価値に変えます。
              </p>
            </div>

            {/* Product 1: AI Sports Trainer */}
            <div ref={productsRef.ref} className={`mb-16 transition-all duration-1000 ${productsRef.isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}>
              <div className="relative overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/40 backdrop-blur-sm">
                <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-cyan-500/5 to-transparent pointer-events-none" />
                <div className="grid lg:grid-cols-2 gap-8 p-8 md:p-12 items-center">
                  <div>
                    <div className="inline-flex items-center gap-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 px-3 py-1 mb-5">
                      <span className="text-xs font-medium text-cyan-300">iOS / Android</span>
                    </div>
                    <h3 className="text-2xl md:text-3xl font-bold mb-3 text-white">
                      AIスポーツトレーナー
                    </h3>
                    <p className="text-lg text-cyan-400 font-medium mb-4">30秒でフォーム診断・課題カルテとドリルで即改善</p>
                    <p className="text-slate-400 mb-6 leading-relaxed">
                      AIが動画からフォームを解析し、改善が必要なポイントを可視化するスポーツ特化アプリ。
                      撮影した短い動画をアップロードするだけで、技術的課題の把握と具体的な改善ヒントが得られます。
                    </p>
                    <div className="space-y-3 mb-8">
                      {[
                        "AI動画分析でフォーム改善 – 30秒動画から具体的な改善ポイントを提示",
                        "課題カルテで強化ポイントを整理 – 新着/優先/完了に自動分類",
                        "トレーニングプランカードで日別メニューを一元管理"
                      ].map((f, i) => (
                        <div key={i} className="flex items-start gap-2.5">
                          <CheckCircle2 className="h-5 w-5 text-cyan-500 mt-0.5 shrink-0" />
                          <span className="text-sm text-slate-300">{f}</span>
                        </div>
                      ))}
                    </div>
                    <div className="flex flex-wrap gap-3">
                      <Button asChild variant="outline" size="sm" className="border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white">
                        <Link href="https://apps.apple.com/jp/app/ai%E3%82%B9%E3%83%9D%E3%83%BC%E3%83%84%E3%83%88%E3%83%AC%E3%83%BC%E3%83%8A%E3%83%BC-%E3%83%95%E3%82%A9%E3%83%BC%E3%83%A0%E5%8B%95%E7%94%BB%E5%88%86%E6%9E%90-%E7%B7%B4%E7%BF%92%E3%83%A1%E3%83%8B%E3%83%A5%E3%83%BC/id6742685461" target="_blank">
                          <svg className="h-4 w-4 mr-1.5" viewBox="0 0 24 24" fill="currentColor"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" /></svg>
                          App Store
                          <ExternalLink className="h-3 w-3 ml-1.5" />
                        </Link>
                      </Button>
                      <Button asChild variant="outline" size="sm" className="border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white">
                        <Link href="https://play.google.com/store/apps/details?id=com.harutowatanabe.mealier" target="_blank">
                          <svg className="h-4 w-4 mr-1.5" viewBox="0 0 24 24" fill="currentColor"><path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 0 1-.61-.92V2.734a1 1 0 0 1 .609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.199l2.807 1.626a1 1 0 0 1 0 1.732l-2.808 1.626L15.206 12l2.492-2.492zM5.864 2.658L16.8 8.99l-2.3 2.3-8.636-8.632z" /></svg>
                          Google Play
                          <ExternalLink className="h-3 w-3 ml-1.5" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                  <div className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-2xl shadow-cyan-500/10">
                    <Image
                      src="/sports-trainer-mockup.png"
                      alt="AIスポーツトレーナーアプリのモックアップ"
                      fill
                      sizes="(min-width: 1024px) 560px, 100vw"
                      className="object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Product 2: CholestAI */}
            <div className="transition-all duration-1000">
              <div className="relative overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/40 backdrop-blur-sm">
                <div className="absolute top-0 left-0 w-1/2 h-full bg-gradient-to-r from-emerald-500/5 to-transparent pointer-events-none" />
                <div className="grid lg:grid-cols-2 gap-8 p-8 md:p-12 items-center">
                  <div className="order-2 lg:order-1 relative aspect-[4/3] overflow-hidden rounded-2xl shadow-2xl shadow-emerald-500/10">
                    <Image
                      src="/choleste-ai-mockup.png"
                      alt="コレステAIアプリのモックアップ"
                      fill
                      sizes="(min-width: 1024px) 560px, 100vw"
                      className="object-cover"
                    />
                  </div>
                  <div className="order-1 lg:order-2">
                    <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 mb-5">
                      <span className="text-xs font-medium text-emerald-300">iOS</span>
                    </div>
                    <h3 className="text-2xl md:text-3xl font-bold mb-3 text-white">
                      コレステAI
                    </h3>
                    <p className="text-lg text-emerald-400 font-medium mb-4">AIコーチがコレステロール値改善をサポート</p>
                    <p className="text-slate-400 mb-6 leading-relaxed">
                      LDLコレステロール・中性脂肪の改善を目指す方のための食事管理アプリ。
                      AIが毎日の食事内容を分析し、コレステロール値の改善に向けた具体的なアドバイスを提供します。
                    </p>
                    <div className="space-y-3 mb-8">
                      {[
                        "AIコーチが食事内容を分析し、改善アドバイスを毎日提供",
                        "LDLコレステロール・LH比のトラッキングとグラフ化",
                        "検査値の推移を記録して改善の手応えを可視化"
                      ].map((f, i) => (
                        <div key={i} className="flex items-start gap-2.5">
                          <CheckCircle2 className="h-5 w-5 text-emerald-500 mt-0.5 shrink-0" />
                          <span className="text-sm text-slate-300">{f}</span>
                        </div>
                      ))}
                    </div>
                    <div className="flex flex-wrap gap-3">
                      <Button asChild variant="outline" size="sm" className="border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white">
                        <Link href="https://apps.apple.com/jp/app/%E3%82%B3%E3%83%AC%E3%82%B9%E3%83%86ai%E3%82%B3%E3%83%BC%E3%83%81-ldl%E3%82%B3%E3%83%AC%E3%82%B9%E3%83%86%E3%83%AD%E3%83%BC%E3%83%AB-%E4%B8%AD%E6%80%A7%E8%84%82%E8%82%AA%E3%82%92%E6%94%B9%E5%96%84/id6756923850" target="_blank">
                          <svg className="h-4 w-4 mr-1.5" viewBox="0 0 24 24" fill="currentColor"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" /></svg>
                          App Store
                          <ExternalLink className="h-3 w-3 ml-1.5" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════ PROCESS ═══════════ */}
        <section id="process" className="py-24 md:py-32 bg-slate-950">
          <div className="container">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 px-4 py-1.5 mb-4">
                <Clock className="h-4 w-4 text-cyan-400" />
                <span className="text-sm font-medium text-cyan-300">PROCESS</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">開発の流れ</h2>
              <p className="max-w-2xl mx-auto text-slate-400 leading-relaxed">
                お客様のビジネスを深く理解することから始め、<br className="hidden sm:inline" />
                納品後の運用まで伴走します。
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 relative">
              {/* Connecting line */}
              <div className="hidden md:block absolute top-8 left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-cyan-500/30 via-cyan-500/50 to-cyan-500/30" />

              <ProcessStep step="1" title="ヒアリング" description="課題・ゴール・技術要件を丁寧にヒアリングし、最適なプランをご提案" icon={MessageSquare} />
              <ProcessStep step="2" title="設計・見積もり" description="要件定義・技術選定・アーキテクチャ設計を行い、詳細なお見積もりを提出" icon={Layers} />
              <ProcessStep step="3" title="開発・テスト" description="アジャイル開発で定期的に進捗を共有しながら、品質の高いプロダクトを構築" icon={Code} />
              <ProcessStep step="4" title="納品・運用サポート" description="リリース後もKPI分析・改善提案を通じて成果創出をサポート" icon={TrendingUp} />
            </div>
          </div>
        </section>

        {/* ═══════════ WHY US ═══════════ */}
        <section className="py-24 md:py-32 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
          <div className="container">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 px-4 py-1.5 mb-4">
                <Award className="h-4 w-4 text-cyan-400" />
                <span className="text-sm font-medium text-cyan-300">WHY US</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">Cyber Knockが選ばれる理由</h2>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: Smartphone,
                  title: "自社プロダクトで磨いた実践力",
                  description: "0→1で複数アプリを開発・運用する中で培った、企画からグロースまでの実践的知見。開発だけでなく「売れるプロダクト」を一緒につくります。"
                },
                {
                  icon: Bot,
                  title: "AI技術の最前線",
                  description: "自社プロダクトで生成AI（LLM・画像/動画解析など）を日常的に活用。机上の空論ではなく実運用実績に基づいたAIソリューションをご提案します。"
                },
                {
                  icon: BarChart3,
                  title: "ビジネス成果にコミット",
                  description: "開発で終わりではなく、KPI設計・データ分析・PDCA伴走まで。お客様のビジネス成果を最大化するパートナーとして事業を加速させます。"
                },
              ].map((item, i) => {
                const { ref, isInView } = useInView();
                return (
                  <div
                    key={i}
                    ref={ref}
                    className={`text-center p-8 rounded-2xl border border-slate-800 bg-slate-900/40 backdrop-blur-sm
                      transition-all duration-700 hover:border-cyan-800/40
                      ${isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
                    style={{ transitionDelay: `${i * 150}ms` }}
                  >
                    <div className="inline-flex p-4 rounded-2xl bg-gradient-to-br from-cyan-500/10 to-blue-600/10 mb-5">
                      <item.icon className="h-8 w-8 text-cyan-400" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                    <p className="text-slate-400 leading-relaxed">{item.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ═══════════ COMPANY PROFILE ═══════════ */}
        <section id="about" className="py-24 md:py-32 bg-slate-950">
          <div className="container">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 px-4 py-1.5 mb-4">
                <Globe className="h-4 w-4 text-cyan-400" />
                <span className="text-sm font-medium text-cyan-300">COMPANY</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">会社概要</h2>
            </div>

            <div className="max-w-3xl mx-auto">
              <div className="rounded-2xl border border-slate-800 bg-slate-900/40 backdrop-blur-sm overflow-hidden">
                <table className="w-full">
                  <tbody>
                    {[
                      { label: "社名", value: "Cyber Knock（サイバーノック）", icon: Cpu },
                      { label: "代表者", value: "渡辺 晴仁", icon: User },
                      { label: "所在地", value: "〒150-0043 東京都渋谷区道玄坂1丁目10番8号 渋谷道玄坂東急ビル2F−C", icon: MapPin },
                      { label: "事業内容", value: "生成AIシステム開発、Web・アプリ受託開発、SEO×LLMO伴走支援、自社プロダクト開発・運用", icon: Layers },
                    ].map((row, i) => (
                      <tr key={i} className="border-b border-slate-800 last:border-b-0">
                        <td className="px-6 py-5 text-sm font-medium text-slate-300 w-32 align-top">
                          <div className="flex items-center gap-2.5">
                            <row.icon className="h-4 w-4 text-cyan-500 shrink-0" />
                            {row.label}
                          </div>
                        </td>
                        <td className="px-6 py-5 text-sm text-slate-400">{row.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════ CTA BANNER ═══════════ */}
        <section className="py-20 bg-gradient-to-r from-cyan-600/10 via-blue-600/10 to-purple-600/10 border-y border-slate-800/60">
          <div className="container text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
              まずはお気軽にご相談ください
            </h2>
            <p className="text-lg text-slate-400 mb-8 max-w-2xl mx-auto">
              AI活用・システム開発・SEO×LLMO戦略など、<br className="hidden sm:inline" />
              お客様の課題に合わせた最適なプランをご提案します。
            </p>
            <Button asChild size="lg" className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-lg shadow-xl shadow-cyan-500/20 px-10">
              <Link href="#contact">
                <MessageSquare className="mr-2 h-5 w-5" />
                無料で相談する
              </Link>
            </Button>
          </div>
        </section>

        {/* ═══════════ CONTACT ═══════════ */}
        <section id="contact" className="py-24 md:py-32 bg-slate-950">
          <div className="container">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 px-4 py-1.5 mb-4">
                <Send className="h-4 w-4 text-cyan-400" />
                <span className="text-sm font-medium text-cyan-300">CONTACT</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">お問い合わせ</h2>
              <p className="max-w-2xl mx-auto text-slate-400 leading-relaxed">
                課題やご要望を詳しくお伺いし、最適なAI活用プランや開発プランをご提案します。<br className="hidden sm:inline" />
                まずはお気軽にお問い合わせください。
              </p>
            </div>

            <div className="max-w-xl mx-auto">
              <div className="rounded-2xl border border-slate-800 bg-slate-900/40 backdrop-blur-sm p-8 md:p-10 shadow-2xl shadow-cyan-500/5">
                {done ? (
                  <div className="text-center py-16">
                    <div className="inline-flex p-4 rounded-full bg-emerald-500/10 mb-6">
                      <CheckCircle2 className="h-12 w-12 text-emerald-500" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-3">送信が完了しました</h3>
                    <p className="text-slate-400">
                      お問い合わせいただき、ありがとうございます。<br />
                      内容を確認の上、2営業日以内にご連絡いたします。
                    </p>
                  </div>
                ) : (
                  <form className="space-y-5" onSubmit={handleSubmit}>
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
                          会社名/組織名
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
                          <option value="~50万円">〜50万円</option>
                          <option value="50-100万円">50〜100万円</option>
                          <option value="100-300万円">100〜300万円</option>
                          <option value="300-500万円">300〜500万円</option>
                          <option value="500万円~">500万円〜</option>
                          <option value="相談して決めたい">相談して決めたい</option>
                        </select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="message" className="block text-sm font-medium text-slate-300">
                        お問い合わせ内容 <span className="text-red-400">*</span>
                      </label>
                      <Textarea
                        id="message"
                        value={form.message}
                        onChange={handleChange}
                        placeholder="ご相談内容をご記入ください（例: AIチャットボットを社内向けに開発したい、既存サービスにAI機能を追加したい、SEO対策とLLMO対策を両立させたい　など）"
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
                          setForm((prev) => ({
                            ...prev,
                            privacy: checked as boolean
                          }))
                        }
                        className="mt-1 data-[state=checked]:bg-cyan-600 data-[state=checked]:border-cyan-600"
                        disabled={sending}
                      />
                      <label htmlFor="privacy" className="text-sm text-slate-400">
                        <span className="text-red-400">*</span>{" "}
                        <Link href="/privacy-policy" className="text-cyan-400 hover:text-cyan-300 underline underline-offset-2">プライバシーポリシー</Link>に同意します
                      </label>
                    </div>
                    {error && (
                      <div className="text-red-400 text-sm bg-red-500/10 rounded-lg px-4 py-2.5">{error}</div>
                    )}
                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white shadow-lg shadow-cyan-500/20 h-12 text-base"
                      disabled={sending}
                    >
                      <Send className="mr-2 h-4 w-4" />
                      {sending ? "送信中..." : "相談内容を送信する"}
                    </Button>
                    <p className="text-center text-xs text-slate-500">
                      2営業日以内にご連絡いたします。お急ぎの場合はお電話でもお気軽にどうぞ。
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
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <Link href="/" className="flex items-center gap-2">
              <Cpu className="h-5 w-5 text-cyan-500" />
              <span className="font-bold">Cyber Knock</span>
            </Link>
            <nav className="flex flex-wrap items-center justify-center gap-6">
              <Link href="#services" className="text-sm text-slate-400 hover:text-white transition-colors">
                サービス
              </Link>
              <Link href="#products" className="text-sm text-slate-400 hover:text-white transition-colors">
                プロダクト
              </Link>
              <Link href="#process" className="text-sm text-slate-400 hover:text-white transition-colors">
                開発の流れ
              </Link>
              <Link href="#about" className="text-sm text-slate-400 hover:text-white transition-colors">
                会社概要
              </Link>
              <Link href="#contact" className="text-sm text-slate-400 hover:text-white transition-colors">
                お問い合わせ
              </Link>
              <Link href="/privacy-policy" className="text-sm text-slate-400 hover:text-white transition-colors">
                プライバシーポリシー
              </Link>
            </nav>
            <div className="text-sm text-slate-500">
              &copy; {new Date().getFullYear()} Cyber Knock. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
