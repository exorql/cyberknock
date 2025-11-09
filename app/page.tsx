"use client";

import Image from "next/image"
import Link from "next/link"
import { ChevronDown, Send, ExternalLink, Code, Cpu, Globe, Lightbulb, Award, User, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { useState } from "react";

export default function Home() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    company: "",
    message: "",
    privacy: false,
  })
  const [sending, setSending] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState("")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
        setForm({
          name: "",
          email: "",
          company: "",
          message: "",
          privacy: false,
        });
      } else {
        setError("送信に失敗しました。しばらくしてから再度お試しください。");
      }
    } catch {
      setError("送信に失敗しました。しばらくしてから再度お試しください。");
    }
    setSending(false);
  };

  return (
    <div className="flex min-h-screen flex-col bg-slate-950 text-slate-100">
      {/* ヘッダー */}
      <header className="sticky top-0 z-50 w-full border-b border-slate-800 bg-slate-950/80 backdrop-blur-sm">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Cpu className="h-6 w-6 text-cyan-500" />
            <span className="text-xl font-bold">Cyber Knock</span>
          </div>
          <div className="flex items-center gap-6">
            <nav className="hidden md:flex items-center gap-6 ml-auto">
              <Link href="#about" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
                ABOUT US
              </Link>
              <Link href="#contact" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
                CONTACT
              </Link>
            </nav>
            <Button asChild className="hidden md:inline-flex bg-cyan-600 hover:bg-cyan-700">
              <Link href="#contact">お問い合わせ</Link>
            </Button>
            <Button variant="ghost" size="icon" className="md:hidden">
              <span className="sr-only">メニューを開く</span>
              <ChevronDown className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* ヒーローセクション */}
        <section className="relative overflow-hidden py-20 md:py-32 lg:py-40">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950"></div>
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#2463EB_1px,transparent_1px)] [background-size:24px_24px]"></div>
          <div className="container relative z-10">
            <div className="mx-auto max-w-3xl text-center">
            <h1 className="mb-6 text-3xl font-bold tracking-tight sm:text-4xl text-white">
              エンジニアリングの力で社会の課題を解決し、<br className="hidden md:inline" />
              より良い未来を創造する。
            </h1>

              {/* <p className="mb-8 text-lg text-slate-300 sm:text-xl">
                Cyber
                Knockは、お客様の独自の要件に最適化されたAIシステム開発、Webサービス・アプリ開発、そして自社プロダクトで培った知見を活かし、業務効率の飛躍的向上と新しい顧客体験の創出を実現します。
              </p> */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="bg-cyan-600 hover:bg-cyan-700">
                  <Link href="#contact">お問い合わせ</Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="border-slate-700 text-slate-200 hover:bg-slate-800 hover:text-white"
                >
                  <Link href="#about">事業内容を見る</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* ABOUT USセクション */}
        <section id="about" className="py-20 bg-slate-950">
          <div className="container">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">ABOUT US - 私たちについて</h2>
              <p className="max-w-3xl mx-auto text-slate-300">
                Cyber
                Knockは『エンジニアリングの力で社会の課題を解決し、より良い未来を創造する』というミッションのもと、お客様のビジネス成長と社会の発展に貢献するテクノロジーソリューションを提供します。
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 mb-12">
              <div className="bg-gradient-to-b from-slate-800 to-slate-900 rounded-lg p-6 shadow-lg">
                <div className="mb-4 p-3 bg-cyan-900/30 rounded-full w-fit">
                  <Cpu className="h-6 w-6 text-cyan-400" />
                </div>
                <h3 className="text-xl font-semibold mb-3">生成AIシステム開発</h3>
                  <p className="text-slate-300">
                    生成AI技術やDifyなどのプラットフォームを活用し、業務効率化や新たな価値創出を実現するAIシステムを開発します。<br />
                    企業データを活用したシステム、業務自動化のためのAIエージェント構築、Google Vertex AIによるAIアプリの迅速なプロトタイピングや運用支援など、生成AIを核としたソリューションを提供します。<br />
                  </p>
              </div>
              <div className="bg-gradient-to-b from-slate-800 to-slate-900 rounded-lg p-6 shadow-lg">
                <div className="mb-4 p-3 bg-cyan-900/30 rounded-full w-fit">
                  <Code className="h-6 w-6 text-cyan-400" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Webサービス・アプリ開発支援</h3>
                <p className="text-slate-300">
                  業務システム、顧客向けWebサービス、スマートフォンアプリなど、お客様の多様なニーズに応える受託開発を行います。企画から設計、開発、保守運用までワンストップでサポートし、ビジネスの成功を力強く後押しします。
                </p>
              </div>
              <div className="bg-gradient-to-b from-slate-800 to-slate-900 rounded-lg p-6 shadow-lg">
                <div className="mb-4 p-3 bg-cyan-900/30 rounded-full w-fit">
                  <Lightbulb className="h-6 w-6 text-cyan-400" />
                </div>
                <h3 className="text-xl font-semibold mb-3">自社プロダクト開発</h3>
                <p className="text-slate-300">
                  日々の課題や社会のニーズに応える、独創的な自社プロダクトの開発にも挑戦しています。この経験で得た最新技術の知見やユーザー視点のUI/UX設計ノウハウを、お客様へのサービス提供にも活かしています。
                </p>
              </div>
            </div>

            {/* 自社プロダクト事例 */}
            <div className="bg-slate-800/50 rounded-lg p-8 shadow-lg">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <h3 className="text-2xl font-semibold mb-4">自社プロダクト: AIスポーツトレーナー - 動画分析</h3>
                  <h4 className="text-xl font-medium mb-3 text-cyan-400">フォーム改善に特化したAI動画分析</h4>
                  <p className="text-slate-300 mb-4">
                    AIが動画からフォームを解析し、改善が必要なポイントを可視化するスポーツ特化アプリです。撮影した短い動画をアップロードするだけで、技術的課題の把握と具体的な改善ヒントが得られます。
                    <span className="font-semibold text-cyan-400">
                      AI動画分析で、部活生からプロ志向アマまで効率的なフォーム改善をサポート。
                    </span>
                  </p>
                  <div className="space-y-4 mb-6">
                    <div>
                      <h5 className="font-medium text-white">【主な機能】</h5>
                      <ul className="list-disc pl-5 text-slate-300 space-y-2 mt-2">
                        <li>AI動画分析でフォーム改善 - 30秒の動画から具体的な改善ポイントを提示</li>
                      </ul>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mb-6">
                    <Link
                      href="https://mealierai.vercel.app/"
                      target="_blank"
                      className="inline-flex items-center gap-1 text-cyan-400 hover:text-cyan-300 transition-colors"
                    >
                      AIスポーツトレーナーアプリを見る <ExternalLink className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
                <div className="relative aspect-[16/9] overflow-hidden rounded-lg shadow-xl">
                  <Image
                    src="/xiantointa.jpg"
                    alt="AIスポーツトレーナー アプリのコンセプトイラスト"
                    width={800}
                    height={600}
                    className="object-cover"
                  />
                </div>
              </div>
            </div>

            {/* 会社情報 */}
            <div className="mt-16 bg-slate-900 rounded-xl p-8 md:p-12 shadow-2xl border border-slate-800">
              <h3 className="text-3xl font-bold mb-8 text-center text-white">COMPANY PROFILE</h3>
              <div className="grid md:grid-cols-2 gap-x-12 gap-y-8">
                <div className="space-y-8">
                  <div>
                    <div className="flex items-center mb-2">
                      <User className="h-5 w-5 text-cyan-400 mr-3" />
                      <h4 className="text-lg font-semibold text-slate-200">社名</h4>
                    </div>
                    <p className="text-slate-300 pl-8">Cyber Knock（サイバーノック）</p>
                  </div>
                  <div>
                    <div className="flex items-center mb-2">
                      <Award className="h-5 w-5 text-cyan-400 mr-3" /> {/* 代表者アイコン例 */}
                      <h4 className="text-lg font-semibold text-slate-200">代表者</h4>
                    </div>
                    <p className="text-slate-300 pl-8">渡辺 晴仁</p>
                  </div>
                </div>
                <div>
                  <div className="flex items-center mb-2">
                    <MapPin className="h-5 w-5 text-cyan-400 mr-3" />
                    <h4 className="text-lg font-semibold text-slate-200">所在地</h4>
                  </div>
                  <p className="text-slate-300 pl-8 leading-relaxed">
                    〒150-0043<br />
                    東京都渋谷区道玄坂1丁目10番8号<br />
                    渋谷道玄坂東急ビル2F−C
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* お問い合わせセクション */}
        <section id="contact" className="pt-8 pb-20 bg-slate-950">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">お気軽にご相談ください</h2>
              {/* <p className="max-w-2xl mx-auto text-slate-300">
                お客様の課題やご要望を詳しくお伺いし、最適なAI活用プランや開発プランをご提案します。
              </p> */}
            </div>

            <div className="max-w-xl mx-auto bg-slate-900 rounded-lg p-8 shadow-lg">
              {done ? (
                <div className="text-center text-green-500 text-lg font-semibold py-12">
                  送信が完了しました。<br />
                  お問い合わせいただき、ありがとうございました！
                </div>
              ) : (
                <form className="space-y-6" onSubmit={handleSubmit}>
                  <div className="space-y-2">
                    <label htmlFor="name" className="block text-sm font-medium">
                      氏名 <span className="text-red-500">*</span>
                    </label>
                    <Input
                      id="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="山田 太郎"
                      required
                      className="bg-slate-800 border-slate-700 focus-visible:ring-cyan-500"
                      disabled={sending}
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="email" className="block text-sm font-medium">
                      メールアドレス <span className="text-red-500">*</span>
                    </label>
                    <Input
                      id="email"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="example@company.com"
                      required
                      className="bg-slate-800 border-slate-700 focus-visible:ring-cyan-500"
                      disabled={sending}
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="company" className="block text-sm font-medium">
                      会社名/組織名
                    </label>
                    <Input
                      id="company"
                      value={form.company}
                      onChange={handleChange}
                      placeholder="株式会社サンプル"
                      className="bg-slate-800 border-slate-700 focus-visible:ring-cyan-500"
                      disabled={sending}
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="message" className="block text-sm font-medium">
                      お問い合わせ内容 <span className="text-red-500">*</span>
                    </label>
                    <Textarea
                      id="message"
                      value={form.message}
                      onChange={handleChange}
                      placeholder="ご相談内容をご記入ください"
                      required
                      className="min-h-[120px] bg-slate-800 border-slate-700 focus-visible:ring-cyan-500"
                      disabled={sending}
                    />
                  </div>
                  <div className="flex items-start gap-2">
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

                    <label htmlFor="privacy" className="text-sm text-slate-300">
                      <span className="text-red-500">*</span> プライバシーポリシーに同意します
                    </label>
                  </div>
                  {error && (
                    <div className="text-red-500 text-sm">{error}</div>
                  )}
                  <Button
                    type="submit"
                    className="w-full bg-cyan-600 hover:bg-cyan-700"
                    disabled={sending}
                  >
                    <Send className="mr-2 h-4 w-4" />
                    {sending ? "送信中..." : "相談内容を送信する"}
                  </Button>
                </form>
              )}
            </div>
          </div>
        </section>
      </main>
      {/* フッター */}
      <footer className="py-8 bg-slate-900 border-t border-slate-800">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <Cpu className="h-5 w-5 text-cyan-500" />
              <span className="font-bold">Cyber Knock</span>
            </div>
            <div className="flex items-center gap-6">
              <Link href="#about" className="text-sm text-slate-400 hover:text-white transition-colors">
                ABOUT US
              </Link>
              <Link href="#contact" className="text-sm text-slate-400 hover:text-white transition-colors">
                CONTACT
              </Link>
              <Link href="/privacy-policy" className="text-sm text-slate-400 hover:text-white transition-colors">
                プライバシーポリシー
              </Link>
            </div>
            <div className="text-sm text-slate-400">
              &copy; {new Date().getFullYear()} Cyber Knock. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
