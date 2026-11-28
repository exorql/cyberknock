import type { Metadata } from "next"
import Link from "next/link"
import { Plus } from "lucide-react"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { ContactForm } from "@/components/contact-form"
import { WorkflowExample } from "@/components/workflow-example"
import { BusinessOrderDemo } from "@/components/business-order-demo"
import { operationsInsights } from "@/lib/b2b-operations-insights"
import { businessServices, businessPath, businessContactHref, investmentDesign, supportPlans, type BusinessServiceId } from "@/lib/business-services"
import { site } from "@/lib/site"

export function businessMetadata(id: BusinessServiceId): Metadata {
  const service = businessServices[id]
  const title = service.title + "・料金 | Cyber Knock"
  const url = site.url + businessPath(id)
  const image = "/images/og/business-operations.png"
  return {
    title, description: service.description, alternates: { canonical: url },
    openGraph: { title, description: service.description, url, siteName: site.name, locale: "ja_JP", type: "website", images: [image] },
    twitter: { card: "summary_large_image", title, description: service.description, images: [image] },
  }
}

export function BusinessServicePage({ id }: { id: BusinessServiceId }) {
  const service = businessServices[id]
  const automation = id === "business-automation"
  const other = automation ? "business-systems" : "business-automation"
  const contact = businessContactHref(id)
  const schema = {
    "@context": "https://schema.org", "@type": "Service", name: service.title, description: service.description,
    url: site.url + businessPath(id), areaServed: "JP", provider: { "@id": site.url + "/#organization" },
    offers: service.offers.map(offer => ({
      "@type": "Offer", name: offer.name + "（標準例・初期費用）", description: offer.scope,
      priceSpecification: { "@type": "PriceSpecification", price: offer.standardManYen * 10000, priceCurrency: "JPY", valueAddedTaxIncluded: false },
    })),
  }
  return <div className="site-shell business-page">
    <SiteHeader consultationHref={contact} consultationService={id} />
    <main id="main-content">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, "\\u003c") }} />
      <section className="business-hero"><div className="wrap business-hero-grid">
        <div><p className="business-kicker">{service.name}</p>
          <h1>{service.headline[0]}<span>{service.headline[1]}</span></h1>
          <p className="business-lead">{service.description}</p>
          <p className="business-hero-price"><span>{service.primary.name}</span> <span>標準例 <strong>{service.primary.standardManYen}万円</strong>（初期・税別）</span></p>
          <div className="business-actions"><Link className="button button-primary" href={contact} data-track="cta_click" data-location="hero" data-service={id}>この業務を無料で相談する</Link>
            <a className="text-link" href="#pricing" data-track="cta_click" data-location="hero" data-service={id}>支援範囲と料金を見る</a></div>
        </div><WorkflowExample kind={automation ? "order" : "ledger"} />
      </div></section>

      <section className="section"><div className="wrap business-layout">
        <div><p className="section-label">対象業務</p><h2 className="business-title">{automation ? "何度も入力する仕事から。" : "更新と引き継ぎが重なる仕事から。"}</h2></div>
        <div className="business-rows">{service.examples.map(([name, problem, change]) => <article key={name}>
          <p className="business-kicker">{name}</p><h3>{problem}</h3><p>{change}</p>
        </article>)}</div>
      </div></section>

      {automation && <section id="order-demo" className="section business-tint"><div className="wrap business-layout">
        <div><p className="section-label">受注入力の実演</p><h2 className="business-title">登録前に、確認する。</h2><p>通常の注文と、単価や品番が異なる例を比べてください。読み取った値をそのまま登録せず、業務のルールで確認する仕組みです。</p></div>
        <BusinessOrderDemo />
      </div></section>}
      <section className="section business-tint"><div className="wrap business-layout">
        <div><p className="section-label">方法の選び方</p><h2 className="business-title">今ある道具で、どこまでできるか。</h2>
          <p>同じ業務を対象に、導入費、毎月の利用料、担当者の作業時間を比べます。</p></div>
        <dl className="business-options">{service.choices.map(([name, text]) => <div key={name}><dt>{name}</dt><dd>{text}</dd></div>)}</dl>
      </div></section>

      <section id="pricing" className="section"><div className="wrap">
        <p className="section-label">料金・納品物</p><h2 className="business-title">最初にかかる費用</h2>
        <p className="business-intro">初回相談は無料です。以下は税別の参考料金です。範囲・成果物・お見積もりをご確認いただいてから着手します。</p>
        {service.offers.map(offer => <article className="business-offer" key={offer.name}>
          <div><h3>{offer.name}</h3><p className="business-price"><span>標準例</span><strong>{offer.standardManYen}</strong>万円</p>
            <p>目安 {offer.rangeManYen[0]}〜{offer.rangeManYen[1]}万円（税別）</p></div>
          <div><p>{offer.scope}</p><dl className="business-spec"><div><dt>納品するもの</dt><dd>{offer.delivery}</dd></div>
            <div><dt>見積が変わる条件</dt><dd>{offer.variable}</dd></div></dl>
            <Link href={contact} className="text-link" data-track="cta_click" data-location="services" data-service={id}>{offer.name}を相談する</Link></div>
        </article>)}
        <aside className="business-design"><h3>先に投資判断をしたい場合</h3>
          <p><strong>{investmentDesign.name}　標準{investmentDesign.standardManYen}万円（税別）</strong></p><p>{investmentDesign.scope}</p>
          {automation && <p>例：設計{investmentDesign.standardManYen}万円＋設計済みの作業を除く実装{service.primary.standardManYen}万円＝初期合計{investmentDesign.standardManYen + service.primary.standardManYen}万円。直接実装に進む場合は必要な設計を含めてお見積もりします。</p>}
          <Link className="text-link" href={contact} data-track="cta_click" data-location="process" data-service={id}>相談して進め方を決める</Link>
        </aside>
        <p className="business-cost-note">お客様が直接契約する業務ソフト・クラウド・AIの利用料は、導入費・継続支援費とは別にかかります。出張や大量のデータ整備も別途お見積もりします。作業中に部門・連携先・移行範囲を追加する場合は、追加費用と日程を合意してから進めます。</p>
      </div></section>

      <section className="section business-tint"><div className="wrap business-layout">
        <div><p className="section-label">導入後の費用</p><h2 className="business-title">継続支援は必要に応じて。</h2>
          <p>導入費とは別の任意契約です。初回3か月を目安に、毎月の作業範囲を決めて効果を振り返ります。日々の入力・承認を行う社内担当者、障害時の連絡先、当社が調査・復旧を担う範囲を引き継ぎ時に確認します。</p></div>
        <div className="business-rows">{supportPlans.map(plan => <article key={plan.name}>
          <h3>{plan.name}</h3><p className="business-monthly">月{plan.monthlyManYen}万円{plan.from && "から"} <small>（税別）</small></p>
          <p>{plan.scope}</p><p className="business-exclusion">別途見積：{plan.outside}</p>
        </article>)}</div>
      </div></section>

      <section className="section"><div className="wrap business-layout">
        <div><p className="section-label">導入の進め方</p><h2 className="business-title">{automation ? "小さく試し、負担の変化を測る。" : "元の台帳と比べながら切り替える。"}</h2></div>
        <ol className="business-steps">{[0, 2, 4].map(i => <li key={service.rollout[i]}><h3>{service.rollout[i]}</h3><p>{service.rollout[i + 1]}</p></li>)}</ol>
      </div></section>

      <section className="section business-proof"><div className="wrap business-layout">
        <div><p className="section-label">自社開発の実績</p><h2 className="business-title">使う人の画面と、運用まで。</h2></div>
        <div><p>自社アプリ「AIスポーツトレーナー」では、動画の入力から結果の確認、失敗時の再処理までを設計・運用しています。実際の画面と、公開後に見直した点をご覧いただけます。</p>
          <div className="business-actions"><Link className="text-link" href="/cases/ai-sports-trainer" data-track="case_study_click" data-location="case_study">自社アプリの開発・運用事例</Link>
            <Link className="text-link" href="/demos/ai-sports-trainer" data-track="demo_click" data-location="case_study">実画面デモを見る</Link></div></div>
      </div></section>

      <section className="section"><div className="wrap business-layout">
        <h2 className="business-title">よくあるご質問</h2><div className="faq-list">
          {[service.faq, ["無料相談で何を用意すればよいですか？", "困っている作業を一つ、文章でお知らせください。予算や件数は分かる範囲で十分です。顧客名や実際の帳票・機密資料の添付は不要です。"]].map(([q, a]) => <details key={q}><summary>{q}<Plus size={18} aria-hidden="true" /></summary><p>{a}</p></details>)}
          <Link className="text-link" href={businessPath(other)} data-track="cta_click" data-location="services" data-service={other}>{businessServices[other].name}の支援内容を見る</Link>
        </div>
      </div></section>

      <section className="section"><div className="wrap business-layout">
        <div><p className="section-label">発注前のガイド</p><h2 className="business-title">費用と進め方を考える。</h2></div>
        <div className="business-rows">{operationsInsights.filter(article => automation ? article.slug !== "excel-systemization-cost" : article.slug === "excel-systemization-cost").map(article => <article key={article.slug}><h3><Link href={"/insights/" + article.slug} data-track="insight_click" data-location="content" data-guide={article.slug}>{article.title}</Link></h3><p>{article.description}</p></article>)}</div>
      </div></section>
      <section id="contact" className="section contact-section"><div className="wrap contact-grid">
        <div className="contact-copy"><p className="eyebrow">初回無料相談</p><h2 className="section-title">どの作業に時間がかかっていますか？</h2>
          <p>使っている道具と、困っている場面を一つ教えてください。代表が内容を確認し、次に整理したいことをメールでご連絡します。</p>
          <Link href="/security" className="subtle-link">データの取り扱い</Link></div>
        <ContactForm key={id} source={service.source} defaultService={id} />
      </div></section>
    </main><SiteFooter consultationHref={contact} consultationService={id} />
  </div>
}
