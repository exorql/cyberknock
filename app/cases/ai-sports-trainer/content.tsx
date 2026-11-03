import Link from "next/link"
import { ArrowUpRight, ArrowRight } from "lucide-react"
import { ProductVisual } from "@/components/product-visual"
import { ChapterNav } from "@/components/chapter-nav"
import { site } from "@/lib/site"

const quality = [
  { title: "見えない動作を、決めつけない。", body: "撮影角度、全身の映り方、遮蔽、動作の速さによって、動画から確認できる範囲は変わります。分析できる入力かを確認し、根拠が不足する項目は無理に評価しない設計に取り組んでいます。" },
  { title: "競技と利用者に合わせて伝える。", body: "同じ動作情報でも、競技や局面によって意味は異なります。評価の観点を競技ごとに設計し、年齢・経験を踏まえて、利用者が練習に生かしやすい説明を目指しています。" },
  { title: "AIの出力を、そのまま表示しない。", body: "出力の構造化、検証、正規化、分析不能時の処理を組み合わせています。モデルやプロンプトの変更時にも評価を行い、機能として安定して届けるための改善を続けています。" },
  { title: "品質と、待ち時間と、コスト。", body: "分析が詳しくても、待ち時間や推論コストが大きければ運用は難しくなります。映像の処理方法、AIモデル、出力内容を、結果の分かりやすさや利用導線と一緒に調整しています。" },
]
const jsonLd = { "@context": "https://schema.org", "@graph": [
  { "@type": "BreadcrumbList", itemListElement: [ { "@type": "ListItem", position: 1, name: "Cyber Knock", item: site.url }, { "@type": "ListItem", position: 2, name: "開発・運用事例", item: `${site.url}/cases/ai-sports-trainer` } ] },
  { "@type": "SoftwareApplication", name: "AIスポーツトレーナー", description: "スポーツ動画を分析し、競技別のフィードバックや練習の振り返りを支援するアプリ。", applicationCategory: "SportsApplication", operatingSystem: "iOS, Android", url: site.appUrl, author: { "@type": "Organization", name: site.name, url: site.url } },
] }
export function CaseStudyContent() {
  return <><script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(jsonLd)}} /><main id="main-content">
    <section className="page-hero case-page-hero"><div className="wrap"><div className="case-hero-grid"><div><p className="eyebrow">自社プロダクト / 開発・運用事例</p><h1 className="page-title">AIを、次の練習につながる<span className="accent-text">体験へ。</span></h1><p className="lead">AIスポーツトレーナーは、スポーツ動画の分析を、利用者が理解して練習に生かせるフィードバックへつなぐiOS・Androidアプリです。</p><p className="body-copy" style={{marginTop:16}}>企画、開発、公開。その先の品質・課金・利用導線の改善まで、自社で取り組んでいます。</p><div className="hero-actions"><Link href="/?service=sports-ai#contact" className="button button-primary" data-track="cta_click" data-location="case" data-service="sports-ai"><span>この経験を活かした<span className="keep-phrase">開発を相談する</span></span> <ArrowUpRight size={20} aria-hidden="true" /></Link></div><div className="store-links"><a href={site.appStore} target="_blank" rel="noopener noreferrer" data-track="store_click" data-location="case" data-store="app_store">App Store <ArrowUpRight size={14} aria-hidden="true" /><span className="sr-only">（新しいタブ）</span></a><a href={site.googlePlay} target="_blank" rel="noopener noreferrer" data-track="store_click" data-location="case" data-store="google_play">Google Play <ArrowUpRight size={14} aria-hidden="true" /><span className="sr-only">（新しいタブ）</span></a><a href={site.appUrl} target="_blank" rel="noopener noreferrer">プロダクトサイト <ArrowUpRight size={14} aria-hidden="true" /><span className="sr-only">（新しいタブ）</span></a></div></div><ProductVisual /></div><dl className="case-summary"><div><dt>プロジェクト</dt><dd>自社企画・自社開発・自社運用</dd></div><div><dt>提供先</dt><dd>競技者・保護者・指導者 / iOS・Android</dd></div><div><dt>担当範囲</dt><dd>企画・UX・アプリ・クラウド・AI・課金・運用</dd></div></dl></div></section>

    <ChapterNav note="EXPLORE / PRODUCT STORY" location="case" chapters={[
      { href: "#screens-title", label: "実画面" },
      { href: "#ownership", label: "担当範囲" },
      { href: "#quality", label: "AI品質と運用" },
      { href: "/?service=sports-ai#contact", label: "相談窓口", service: "sports-ai" },
    ]} />

    <section className="section"><div className="wrap editorial-grid"><p className="section-label"><span className="mono">01 /</span> 解決したかった課題</p><div><h2 className="section-title">動画を見返した、その先に。次に取り組むことが分かる。</h2><div className="approach-body"><p>練習を撮影しても、自分の動きのどこに注目すればよいか、次に何を変えればよいかは分かりにくい。映像から得られる情報を、競技者や保護者、指導者に伝わる形にすることを目指しました。</p><p>必要なのは、分析結果を並べるだけの画面ではありません。動画、評価、改善ポイント、練習メニュー、振り返りをつなぎ、次の行動を考えやすくする体験を設計しています。</p></div></div></div></section>

    <section className="section" style={{background:"var(--white)"}} aria-labelledby="screens-title"><div className="wrap"><div className="section-heading"><p className="section-label"><span className="mono">02 /</span> プロダクトの体験</p><h2 id="screens-title" className="section-title">動きを見る。理解して、練習につなぐ。</h2></div><div className="screen-gallery">
      <figure><a className="screen-stage" href="/images/cases/01-analysis.jpg" target="_blank" rel="noopener noreferrer" aria-label="動画分析の実画面を拡大（新しいタブ）"><img src="/images/cases/01-analysis.jpg" width="333" height="720" loading="lazy" decoding="async" alt="投球動画に動作情報を重ねた実際の分析画面" /></a><figcaption><h3>01 動作を振り返る</h3><p>競技や分析内容に応じて、姿勢・動作の情報を動画と合わせて確認します。</p></figcaption></figure>
      <figure><a className="screen-stage" href="/images/product/pitching-feedback.webp" target="_blank" rel="noopener noreferrer" aria-label="フィードバックの実画面を拡大（新しいタブ）"><img src="/images/product/pitching-feedback.webp" width="640" height="1385" loading="lazy" decoding="async" alt="動画とAIによるフィードバックを表示する実アプリ画面" /></a><figcaption><h3>02 改善の意味を知る</h3><p>評価や改善ポイントを、利用者が理解できる言葉で届けるために出力とUIを設計します。</p></figcaption></figure>
      <figure><a className="screen-stage" href="/images/cases/03-training.png" target="_blank" rel="noopener noreferrer" aria-label="AIドリル提案の実画面を拡大（新しいタブ）"><img src="/images/cases/03-training.png" width="333" height="720" loading="lazy" decoding="async" alt="分析結果をもとにドリルの内容や選定理由を提案する実アプリ画面" /></a><figcaption><h3>03 次の練習につなぐ</h3><p>AIドリル提案を通じて、分析で見つけた課題を次の練習へつなぐ体験をつくります。</p></figcaption></figure>
    </div><p className="media-note">画面を選択すると拡大表示します。掲載画像は撮影時点の実アプリ画面です。画面・機能は更新される場合があります。画面内のスコアは分析例であり、分析精度を示す数値ではありません。</p></div></section>

    <section id="ownership" className="section"><div className="wrap"><div className="section-heading"><p className="section-label"><span className="mono">03 /</span> 担当範囲と構成</p><h2 className="section-title">ひとつの機能から、サービス全体まで。</h2></div><div className="three-grid"><article className="info-card"><p className="mono">PRODUCT</p><h3>企画・UX・事業設計</h3><p>対象ユーザー、機能の優先順位、画面設計、利用導線、サブスクリプションを自社で設計。</p></article><article className="info-card"><p className="mono">ENGINEERING</p><h3>アプリ・クラウド・AI</h3><p>React Native / TypeScriptによるアプリと、Firebase / Google Cloudを使うバックエンド、AI動画分析基盤を構築。</p></article><article className="info-card"><p className="mono">OPERATIONS</p><h3>公開・検証・継続改善</h3><p>iOS・Android公開、利用データの確認、AI品質・処理時間・推論コスト・利用導線の改善を担当。</p></article></div><div className="architecture" style={{marginTop:32}}><p className="section-label" style={{marginBottom:25}}>動画からフィードバックまでの概略</p><ol>{[
      ["01", "動画の入力", "撮影・アップロード。撮影条件や入力形式を確認。"],
      ["02", "映像・動作の分析", "競技や内容に応じて姿勢・関節角度・動作情報、AIを活用。"],
      ["03", "出力の検証", "結果の構造化・検証・正規化と、分析できない場合の処理。"],
      ["04", "利用者へ届ける", "動画・評価・フィードバックを、練習や振り返りにつなぐ。"],
    ].map(([n,title,body]) => <li key={n}><span className="mono">{n}</span><strong>{title}</strong><p>{body}</p></li>)}</ol></div><p className="media-note">理解のために簡略化した構成です。競技・分析内容により利用する処理や情報は異なります。</p></div></section>

    <section id="quality" className="section" style={{background:"var(--mint)"}}><div className="wrap"><div className="section-heading"><p className="section-label"><span className="mono">04 /</span> 実運用で向き合ってきたこと</p><h2 className="section-title">AIの回答を、プロダクトの品質にする。</h2></div><div className="quality-list">{quality.map(item => <article className="quality-row" key={item.title}><h3>{item.title}</h3><p>{item.body}</p></article>)}</div><div className="evidence-links"><Link href="/security" className="text-link">AIの限界とデータの取り扱い <ArrowUpRight size={18} aria-hidden="true" /></Link></div></div></section>

    <section className="section"><div className="wrap editorial-grid"><p className="section-label"><span className="mono">05 /</span> 確認できる成果と次の改善</p><div><h2 className="section-title">公開して終わりにしない。使われ方から、学び続ける。</h2><div className="body-copy" style={{marginTop:25}}><p>iOS・Androidの公開アプリとして、動画分析からフィードバック、練習支援までを提供しています。企画から継続運用まで、ひとつのプロダクトを自社で担っていることが、この事例の実績です。</p><p>ユーザー評価や利用状況をもとに、分析結果の説明、分析不能時の対応、画面の導線、待ち時間とコストを見直しています。モデルや機能の変更時にも、評価と改善を継続します。</p><p>公開アプリで実際の体験を確認いただけます。個別の開発相談では、この事例での設計・運用経験を、対象の課題や条件に合わせてご説明します。</p></div><div className="evidence-links"><a href={site.appStore} target="_blank" rel="noopener noreferrer" className="text-link">App Storeで確認 <ArrowUpRight size={16} aria-hidden="true" /><span className="sr-only">（新しいタブ）</span></a><a href={site.googlePlay} target="_blank" rel="noopener noreferrer" className="text-link">Google Playで確認 <ArrowUpRight size={16} aria-hidden="true" /><span className="sr-only">（新しいタブ）</span></a></div></div></div></section>

    <section className="section" style={{paddingTop:0}}><div className="wrap"><div className="cta-panel"><p className="eyebrow">この経験を、あなたの事業へ。</p><h2 style={{marginTop:18}}>AIを組み込むところから、使い続けられるサービスまで。</h2><p>スポーツ動画分析、新規Web・モバイル開発、既存のAI機能の改善。いまの課題と、目指す体験からご相談いただけます。</p><Link href="/?service=sports-ai#contact" className="button button-primary" data-track="cta_click" data-location="case" data-service="sports-ai">開発について相談する <ArrowUpRight size={20} aria-hidden="true" /></Link><div style={{marginTop:14}}><Link href="/sports-dx" className="text-link">自治体・競技団体の実証支援 <ArrowRight size={18} aria-hidden="true" /></Link></div></div></div></section>
  </main></>
}
