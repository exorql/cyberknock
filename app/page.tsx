import Link from "next/link"
import { ArrowUpRight, ArrowRight, Check, Plus } from "lucide-react"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { ContactForm } from "@/components/contact-form"
import { ProductVisual } from "@/components/product-visual"
import { DecisionLoop } from "@/components/decision-loop"
import { MethodNotes } from "@/components/method-notes"
import { Trajectory } from "@/components/trajectory"
import { services, site } from "@/lib/site"
import { InsightsEntryPoints } from "@/components/insights-entrypoints"

const process = [
  { title: "話す・整理する", text: "解決したい課題、対象ユーザー、目指す状態を共有。仕様が決まっていなくても構いません。", output: "課題・目的・優先順位" },
  { title: "確かめる・決める", text: "技術的な実現性を確認し、検証範囲と評価方法を設計。費用・期間をすり合わせます。", output: "検証計画・範囲・見積もり" },
  { title: "つくる・届ける", text: "小さく動くものを作り、確認しながら実装。Web公開やアプリストアへの申請まで支援します。", output: "MVP・公開・運用準備" },
  { title: "使われ方から磨く", text: "利用状況や現場の声、AI品質、運用コストを確認し、次に改善することを決めます。", output: "検証結果・次の改善案" },
]
const faqs = [
  ["スポーツ以外の開発も相談できますか？", "はい。スポーツ領域を強みとしながら、業種を問わずWeb・モバイルアプリ、新規プロダクト、既存サービスへのAI機能追加をご相談いただけます。"],
  ["仕様や予算が決まっていなくても大丈夫ですか？", "はい。解決したい課題や構想からお聞かせください。実現性、最初に検証する範囲、費用・期間を一緒に整理します。フォームの予算欄は任意です。"],
  ["小規模な検証や、開発の一部分だけでも依頼できますか？", "AI機能の検証、設計やコードのレビュー、既存サービスの改善など、必要な範囲でご相談いただけます。担当範囲と成果物は、着手前にすり合わせます。"],
  ["動画や機密情報は、最初の相談で必要ですか？", "初回フォームへの添付は不要です。まず概要を共有いただき、素材が必要な場合は、利用目的・共有方法・取り扱い条件を確認してからお預かりします。"],
]
export default function Home() {
  return <div className="site-shell"><SiteHeader /><main id="main-content">
    <section className="hero hero-editorial" aria-labelledby="hero-title"><div className="hero-gridlines" aria-hidden="true" /><div className="wrap hero-grid">
      <div className="hero-copy"><div className="hero-kickerline" aria-hidden="true"><span className="mono">CYBER KNOCK / INDEPENDENT DEVELOPMENT STUDIO</span><span className="mono">TOKYO · JAPAN</span></div><p className="eyebrow"><span className="signal-dot" /> AI開発・PoC・Web / アプリ開発</p>
        <h1 id="hero-title" className="hero-lead-title"><span className="hero-lead-context">AI・システム開発を、</span><span className="accent-text hero-lead-action">検証から実装まで。</span></h1>
        <p className="hero-description">AIの技術検証（PoC）から、Web・アプリ開発、公開後の改善まで。事業課題に合わせて、必要な範囲から支援します。</p>
        <div className="hero-actions"><Link href="#contact" className="button button-primary" data-track="cta_click" data-location="hero">開発について相談する <ArrowUpRight size={20} aria-hidden="true" /></Link><Link href="/cases/ai-sports-trainer" className="text-link" data-track="case_study_click" data-location="hero">開発・運用事例を見る <ArrowRight size={18} aria-hidden="true" /></Link></div>
        <p className="hero-audience"><span className="mono">WHO WE WORK WITH</span>事業会社・スタートアップ・スポーツ事業者・開発パートナー企業へ</p>
      </div><div className="hero-visual-frame"><ProductVisual /><span className="hero-visual-index mono" aria-hidden="true">MADE / SHIPPED / IMPROVED</span></div>
    </div><div className="wrap proof-strip"><p><Check size={17} aria-hidden="true" />自社アプリを企画・公開・運用</p><p><Check size={17} aria-hidden="true" />技術検証から実装・改善まで対応</p><p><Check size={17} aria-hidden="true" />企画から実装まで、代表が直接対応</p></div></section>

    <section className="inquiry-section" aria-labelledby="inquiry-title">
      <div className="wrap inquiry-inner">
        <div className="inquiry-heading">
          <p className="section-label"><span className="mono">相談テーマ /</span> 技術検証から開発まで</p>
          <h2 id="inquiry-title">こんな開発をご相談いただけます。</h2>
          <p>仕様が固まっていなくても構いません。実現可能性や最初に検証する範囲から一緒に整理します。</p><Link href="#contact" className="text-link inquiry-cta" data-track="cta_click" data-location="inquiry">相談内容を送る <ArrowUpRight size={18} aria-hidden="true" /></Link>
        </div>
        <div className="inquiry-list">
          <article><span className="mono">01 / AI INTEGRATION</span><h3>既存サービスにAI機能を追加したい</h3><p>生成AIや画像・動画分析をどう組み込めるか、品質・費用・運用を含めて検証します。</p></article>
          <article><span className="mono">02 / GAME VIDEO</span><h3>試合映像から、特定選手のプレーを抽出したい</h3><p>選手の追跡・再識別、プレー場面の抽出などを、実映像で検証します。</p></article>
          <article><span className="mono">03 / MOTION ANALYSIS</span><h3>競技動作を可視化し、指導に活かしたい</h3><p>フォーム・関節角度・動作軌跡など、撮影条件と計測可能な範囲を確かめます。</p></article>
          <article><span className="mono">04 / PRODUCT DEVELOPMENT</span><h3>新しいWeb・アプリを立ち上げたい</h3><p>PoC・MVPの企画から、Web・モバイル開発、公開後の改善まで対応します。スポーツ以外の業種もご相談いただけます。</p></article>
        </div>
      </div>
    </section>

    <section className="section approach-section" aria-labelledby="approach-title">
      <div className="wrap method-grid">
        <div className="method-statement">
          <p className="section-label"><span className="mono">01 /</span> Cyber Knockの開発姿勢</p>
          <p className="method-overline mono">BUILD IT. RUN IT. LEARN FROM IT.</p>
          <h2 id="approach-title"><span className="method-phrase">動かして、確かめて、</span><em>次をつくる。</em></h2>
          <p className="method-intro">「作れるか」だけではなく、<strong>「使われ続けるか」まで。</strong> 自社アプリを企画・公開・運用する中で得た判断を、開発の最初から組み込みます。</p>
          <div className="method-mark" aria-hidden="true"><Trajectory className="method-mark-line" /><span className="mono">OBSERVE <span>↗</span> REFINE</span></div>
        </div>
        <MethodNotes />
      </div>
    </section>

    <section id="case-study" className="section featured-case" aria-labelledby="case-title"><div className="wrap"><div className="section-heading"><p className="section-label"><span className="mono">02 /</span> 自社プロダクトの実績</p><p className="quiet">運用の経験が、開発の判断を変える。</p></div><div className="case-feature-grid"><DecisionLoop /><div className="case-copy"><span className="tag">企画・開発・運用を一貫して担当</span><h2 id="case-title">AIスポーツトレーナー</h2><p className="case-lead">撮影した動画から、次の練習につながるフィードバックへ。</p><p>スポーツ動画をAIで分析するiOS・Androidアプリ。競技者や保護者、指導者に向けて、自社で企画・開発し、継続して運用しています。</p><dl className="project-facts"><div><dt>担当領域</dt><dd>UX / アプリ / クラウド / AI / 課金 / 運用</dd></div><div><dt>改善テーマ</dt><dd>AI品質・分析完了率・利用導線・処理コスト</dd></div></dl><div className="case-cta-row"><Link href="/cases/ai-sports-trainer" className="button button-primary" data-track="case_study_click" data-location="case_study">開発の工夫と運用を見る <ArrowUpRight size={20} aria-hidden="true" /></Link><Link href="/?service=product#contact" className="text-link case-consult-link" data-track="cta_click" data-location="case_study" data-service="product">同様の開発を相談する <ArrowUpRight size={18} aria-hidden="true" /></Link></div><div className="store-links"><span>公開アプリを確認</span><a href={site.appStore} target="_blank" rel="noopener noreferrer" data-track="store_click" data-location="case_study" data-store="app_store">App Store <ArrowUpRight size={14} aria-hidden="true" /><span className="sr-only">（新しいタブ）</span></a><a href={site.googlePlay} target="_blank" rel="noopener noreferrer" data-track="store_click" data-location="case_study" data-store="google_play">Google Play <ArrowUpRight size={14} aria-hidden="true" /><span className="sr-only">（新しいタブ）</span></a></div></div></div></div></section>

    <section id="services" className="section services-section" aria-labelledby="services-title"><div className="wrap"><div className="section-heading"><p className="section-label"><span className="mono">03 /</span> 支援内容</p><h2 id="services-title" className="section-title"><span className="keep-phrase">課題から、</span><span className="keep-phrase">必要な開発を。</span></h2></div><p className="services-intro">スポーツ領域で培った経験を軸に、業種を問わず<br className="desktop-break" />Web・モバイル開発、AI機能の導入・改善をご相談いただけます。</p><div className="service-list">{services.map(service => <article className="service-row" key={service.id}><div className="service-name"><span className="service-number mono">{service.number}</span><h3>{service.title}</h3><p className="service-audience">{service.audience}</p></div><div className="service-detail"><h4>{service.question}</h4><p>{service.description}</p><dl><div><dt>支援範囲</dt><dd>{service.scope}</dd></div><div><dt>想定成果物</dt><dd>{service.deliverable}</dd></div></dl><div className="service-actions"><Link href={`/?service=${service.id}#contact`} className="text-link" data-track="cta_click" data-location="services" data-service={service.id}>このテーマで相談 <ArrowUpRight size={18} aria-hidden="true" /></Link><Link href={service.link} className="subtle-link">{service.linkText} <ArrowRight size={15} aria-hidden="true" /></Link></div></div></article>)}</div>
      <Link href="/sports-dx" className="dx-banner" data-track="cta_click" data-location="services" data-service="sports-dx"><div><p className="section-label">自治体・競技団体・地域スポーツの皆さまへ</p><h3>現場で役立つかを、<br className="mobile-break" />小さな実証から。</h3><p>課題整理・実証設計・開発・効果検証まで。スポーツDX・AI実証支援</p></div><span className="circle-arrow"><ArrowUpRight size={28} aria-hidden="true" /></span></Link>
    </div></section>

    <InsightsEntryPoints placement="home" />

    <section id="process" className="section process-section" aria-labelledby="process-title"><div className="wrap"><div className="section-heading"><p className="section-label"><span className="mono">04 /</span> ご相談からの進め方</p><h2 id="process-title" className="section-title">小さく確かめて、次の判断へ。</h2></div><div className="process-grid">{process.map((step,i) => <article key={step.title}><span className="step-number mono">0{i+1}<span aria-hidden="true">↗</span></span><h3>{step.title}</h3><p>{step.text}</p><span className="process-output">{step.output}</span></article>)}</div><div className="process-note"><p><strong>費用と期間は、目的と範囲を整理してから。</strong><br />検証・開発・運用を分け、まず必要な範囲をご提案します。着手前に成果物と条件を確認します。</p><Link href="#contact" className="text-link" data-track="cta_click" data-location="process">構想段階から相談する <ArrowUpRight size={18} aria-hidden="true" /></Link></div></div></section>

    <section id="profile" className="section profile-section" aria-labelledby="profile-title"><div className="wrap editorial-grid"><p className="section-label"><span className="mono">05 /</span> Cyber Knockについて</p><div className="profile-content"><h2 id="profile-title" className="section-title">事業の話も、実装の話も、同じ相手に。</h2><div className="profile-grid"><div className="founder-card"><Trajectory className="founder-trajectory" /><div className="founder-identity"><p className="section-label">代表 / エンジニア</p><h3>渡辺 晴仁</h3><p className="mono">HARUTO WATANABE</p></div></div><div className="profile-bio"><p>事業会社とデジタルクリエイティブ企業で、Webサービスの開発・改善、スポーツDX、AI・R&D領域のプロダクト開発を経験し、2024年に独立しました。</p><p>現在は、自ら企画・開発したiOS・Androidアプリ「AIスポーツトレーナー」を公開・運営。UX設計からAI・アプリ・バックエンドの実装、品質・処理時間・コストの改善まで一貫して取り組んでいます。</p><p>自社プロダクトを自ら育てる経験を生かし、企業のAI導入・PoC、新規Web・アプリ開発、既存サービスの改善を支援。事業の目的や優先順位を整理するところから、設計・実装・運用改善まで、代表が直接関わります。</p><div className="profile-actions"><Link href="/cases/ai-sports-trainer" className="text-link" data-track="case_study_click" data-location="profile">開発・運用事例を見る <ArrowUpRight size={18} aria-hidden="true" /></Link><Link href="#contact" className="subtle-link" data-track="cta_click" data-location="profile">開発について相談する <ArrowRight size={16} aria-hidden="true" /></Link></div></div></div><dl className="business-facts"><div><dt>屋号</dt><dd>Cyber Knock（サイバーノック）</dd></div><div><dt>代表者</dt><dd>渡辺 晴仁</dd></div><div><dt>所在地</dt><dd>東京都三鷹市</dd></div><div><dt>事業内容</dt><dd>AI・Web・モバイルプロダクト開発、開発顧問、自社プロダクト運営</dd></div></dl><Link href="/security" className="text-link">AI品質とデータの取り扱いについて <ArrowUpRight size={18} aria-hidden="true" /></Link></div></div></section>

    <section className="section faq-section" aria-labelledby="faq-title"><div className="wrap editorial-grid"><div><p className="section-label">相談する前に</p><h2 id="faq-title" className="section-title">よくあるご質問</h2></div><div className="faq-list">{faqs.map(([q,a]) => <details key={q}><summary>{q}<Plus size={20} aria-hidden="true" /></summary><p>{a}</p></details>)}</div></div></section>

    <section id="contact" className="section contact-section" aria-labelledby="contact-title"><div className="wrap contact-grid"><div className="contact-copy"><p className="eyebrow"><span className="signal-dot" /> お問い合わせ</p><h2 id="contact-title" className="section-title">まだ、仕様書がなくても大丈夫。</h2><p>実現したいサービスや、現場で困っていること。<br className="desktop-break" />まずは、その話からお聞かせください。</p><p>開発の進め方、AIで実現できる範囲、<br className="desktop-break" />最初に確かめることを一緒に考えます。</p><div className="contact-assurance"><span>代表が直接確認</span><span>予算・仕様が未定でも可</span></div><Link href="/security" className="subtle-link">データの取り扱い <ArrowUpRight size={16} aria-hidden="true" /></Link></div><ContactForm source="home" /></div></section>
  </main><SiteFooter /></div>
}
