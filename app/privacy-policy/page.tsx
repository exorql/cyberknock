import type { Metadata } from "next"
import Link from "next/link"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"

const siteUrl = "https://harutowatanabe.com"
const title = "プライバシーポリシー | Cyber Knock"
const description = "Cyber Knockのウェブサイトにおける個人情報の利用目的、第三者提供、開示・訂正・削除、お問い合わせ窓口について定めたプライバシーポリシーです。"

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/privacy-policy" },
  openGraph: {
    title,
    description,
    url: `${siteUrl}/privacy-policy`,
    siteName: "Cyber Knock",
    type: "website",
    locale: "ja_JP",
  },
  twitter: { card: "summary_large_image", title, description },
}

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Cyber Knock", item: `${siteUrl}/` },
    { "@type": "ListItem", position: 2, name: "プライバシーポリシー", item: `${siteUrl}/privacy-policy` },
  ],
}

export default function PrivacyPolicyPage() {
  return (
    <div className="site-shell">
      <SiteHeader />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <main id="main-content">
        <section className="document-hero">
          <div className="wrap">
            <p className="eyebrow">プライバシー</p>
            <h1 className="page-title">プライバシーポリシー</h1>
            <p className="lead">当サイトにおける個人情報の取り扱いと、お問い合わせの窓口をご案内します。</p>
            <p className="section-label">制定日：2025年5月17日</p>
          </div>
        </section>

        <div className="wrap document-layout">
          <aside className="document-nav">
            <nav aria-label="プライバシーポリシーの目次">
              <p className="section-label">このページの内容</p>
              <ol>
                <li><a href="#article-1">第1条（個人情報）</a></li>
                <li><a href="#article-2">第2条（個人情報を収集・利用する目的）</a></li>
                <li><a href="#article-3">第3条（利用目的の変更）</a></li>
                <li><a href="#article-4">第4条（個人情報の第三者提供）</a></li>
                <li><a href="#article-5">第5条（個人情報の開示）</a></li>
                <li><a href="#article-6">第6条（個人情報の訂正および削除）</a></li>
                <li><a href="#article-7">第7条（個人情報の利用停止等）</a></li>
                <li><a href="#article-8">第8条（Cookie（クッキー）の使用について）</a></li>
                <li><a href="#article-9">第9条（プライバシーポリシーの変更）</a></li>
                <li><a href="#article-10">第10条（免責事項）</a></li>
                <li><a href="#article-11">第11条（著作権）</a></li>
                <li><a href="#article-12">第12条（お問い合わせ窓口）</a></li>
              </ol>
            </nav>
          </aside>
          <article className="prose" aria-label="プライバシーポリシー本文">
            <p>Cyber Knock（以下「当事業」といいます。）は、当事業が運営するウェブサイト（以下「当サイト」といいます。）における、お客様の個人情報の取扱いについて、以下のとおりプライバシーポリシー（以下「本ポリシー」といいます。）を定めます。</p>

            <section aria-labelledby="article-1">
              <h2 id="article-1">第1条（個人情報）</h2>
              <p>
                本ポリシーにおいて「個人情報」とは、個人情報保護法にいう「個人情報」を指すものとし、生存する個人に関する情報であって、当該情報に含まれる氏名、メールアドレス、会社名/組織名、その他の記述等により特定の個人を識別できる情報を指します。
              </p>
            </section>

            <section aria-labelledby="article-2">
              <h2 id="article-2">第2条（個人情報を収集・利用する目的）</h2>
              <ol>
                <li>当事業のサービス（スポーツ領域を中心としたAI・Web・モバイルプロダクト開発、開発顧問、自社プロダクト運営等）の提供・運営のため</li>
                <li>お客様からのお問い合わせに回答するため（本人確認を行うことを含む）</li>
                <li>お客様にご自身の登録情報の閲覧や変更、削除、ご利用状況の閲覧を行っていただくため</li>
                <li>メンテナンス、重要なお知らせなど必要に応じたご連絡のため</li>
                <li>上記の利用目的に付随する目的</li>
              </ol>
            </section>

            <section aria-labelledby="article-3">
              <h2 id="article-3">第3条（利用目的の変更）</h2>
              <ol>
                <li>
                  当事業は、利用目的が変更前と関連性を有すると合理的に認められる場合に限り、個人情報の利用目的を変更するものとします。
                </li>
                <li>
                  利用目的の変更を行った場合には、変更後の目的について、当事業所定の方法により、お客様に通知し、または当サイト上に公表するものとします。
                </li>
              </ol>
            </section>

            <section aria-labelledby="article-4">
              <h2 id="article-4">第4条（個人情報の第三者提供）</h2>
              <ol>
                <li>
                  当事業は、次に掲げる場合を除いて、あらかじめお客様の同意を得ることなく、第三者に個人情報を提供することはありません。ただし、個人情報保護法その他の法令で認められる場合を除きます。
                  <ul>
                    <li>人の生命、身体または財産の保護のために必要がある場合であって、本人の同意を得ることが困難であるとき</li>
                    <li>公衆衛生の向上または児童の健全な育成の推進のために特に必要がある場合であって、本人の同意を得ることが困難であるとき</li>
                    <li>国の機関もしくは地方公共団体またはその委託を受けた者が法令の定める事務を遂行することに対して協力する必要がある場合であって、本人の同意を得ることにより当該事務の遂行に支障を及ぼすおそれがあるとき</li>
                    <li>
                      予め次の事項を告知あるいは公表し、かつ当事業が個人情報保護委員会に届出をしたとき
                      <ul>
                        <li>利用目的に第三者への提供を含むこと</li>
                        <li>第三者に提供されるデータの項目</li>
                        <li>第三者への提供の手段または方法</li>
                        <li>本人の求めに応じて個人情報の第三者への提供を停止すること</li>
                        <li>本人の求めを受け付ける方法</li>
                      </ul>
                    </li>
                  </ul>
                </li>
                <li>
                  前項の定めにかかわらず、次に掲げる場合には、当該情報の提供先は第三者に該当しないものとします。
                  <ul>
                    <li>当事業が利用目的の達成に必要な範囲内において個人情報の取扱いの全部または一部を委託する場合</li>
                    <li>合併その他の事由による事業の承継に伴って個人情報が提供される場合</li>
                    <li>
                      個人情報を特定の者との間で共同して利用する場合であって、その旨並びに共同して利用される個人情報の項目、共同して利用する者の範囲、利用する者の利用目的および当該個人情報の管理について責任を有する者の氏名または名称について、あらかじめ本人に通知し、または本人が容易に知り得る状態に置いた場合
                    </li>
                  </ul>
                </li>
              </ol>
            </section>

            <section aria-labelledby="article-5">
              <h2 id="article-5">第5条（個人情報の開示）</h2>
              <ol>
                <li>
                  当事業は、本人から個人情報の開示を求められたときは、本人に対し、遅滞なくこれを開示します。ただし、開示することにより次のいずれかに該当する場合は、その全部または一部を開示しないこともあり、開示しない決定をした場合には、その旨を遅滞なく通知します。
                  <ul>
                    <li>本人または第三者の生命、身体、財産その他の権利利益を害するおそれがある場合</li>
                    <li>当事業の業務の適正な実施に著しい支障を及ぼすおそれがある場合</li>
                    <li>その他法令に違反することとなる場合</li>
                  </ul>
                </li>
                <li>
                  前項の定めにかかわらず、履歴情報および特性情報などの個人情報以外の情報については、原則として開示いたしません。
                </li>
              </ol>
            </section>

            <section aria-labelledby="article-6">
              <h2 id="article-6">第6条（個人情報の訂正および削除）</h2>
              <ol>
                <li>お客様は、当事業の保有する自己の個人情報が誤った情報である場合には、当事業が定める手続きにより、当事業に対して個人情報の訂正、追加または削除（以下「訂正等」といいます。）を請求することができます。</li>
                <li>当事業は、お客様から前項の請求を受けてその請求に応じる必要があると判断した場合には、遅滞なく、当該個人情報の訂正等を行うものとします。</li>
                <li>当事業は、前項の規定に基づき訂正等を行った場合、または訂正等を行わない旨の決定をしたときは遅滞なく、これをお客様に通知します。</li>
              </ol>
            </section>

            <section aria-labelledby="article-7">
              <h2 id="article-7">第7条（個人情報の利用停止等）</h2>
              <ol>
                <li>当事業は、本人から、個人情報が、利用目的の範囲を超えて取り扱われているという理由、または不正の手段により取得されたものであるという理由により、その利用の停止または消去（以下「利用停止等」といいます。）を求められた場合には、遅滞なく必要な調査を行います。</li>
                <li>前項の調査結果に基づき、その請求に応じる必要があると判断した場合には、遅滞なく、当該個人情報の利用停止等を行います。</li>
                <li>当事業は、前項の規定に基づき利用停止等を行った場合、または利用停止等を行わない旨の決定をしたときは、遅滞なく、これをお客様に通知します。</li>
                <li>前2項にかかわらず、利用停止等に多額の費用を有する場合その他利用停止等を行うことが困難な場合であって、お客様の権利利益を保護するために必要なこれに代わるべき措置をとれる場合は、この代替策を講じるものとします。</li>
              </ol>
            </section>

            <section aria-labelledby="article-8">
              <h2 id="article-8">第8条（Cookie（クッキー）の使用について）</h2>
              <p>
                当サイトでは、お客様の利便性向上やサイト改善のため、Cookieを使用することがあります。お客様はブラウザの設定によりCookieの受け取りを拒否することができますが、その場合、当サイトの一部機能がご利用いただけなくなることがあります。
              </p>
            </section>

            <section aria-labelledby="article-9">
              <h2 id="article-9">第9条（プライバシーポリシーの変更）</h2>
              <ol>
                <li>本ポリシーの内容は、法令その他本ポリシーに別段の定めのある事項を除いて、お客様に通知することなく、変更することができるものとします。</li>
                <li>当事業が別途定める場合を除いて、変更後のプライバシーポリシーは、当サイトに掲載したときから効力を生じるものとします。</li>
              </ol>
            </section>

            <section aria-labelledby="article-10">
              <h2 id="article-10">第10条（免責事項）</h2>
              <p>
                当サイトからリンクやバナーなどによって他のサイトに移動された場合、移動先サイトで提供される情報、サービス等について一切の責任を負いません。当サイトのコンテンツ・情報につきまして、可能な限り正確な情報を掲載するよう努めておりますが、誤情報が入り込んだり、情報が古くなっていることもございます。当サイトに掲載された内容によって生じた損害等の一切の責任を負いかねますのでご了承ください。
              </p>
            </section>

            <section aria-labelledby="article-11">
              <h2 id="article-11">第11条（著作権）</h2>
              <p>
                当サイトで掲載している文章や画像などにつきましては、無断転載することを禁止します。
              </p>
            </section>

            <section aria-labelledby="article-12">
              <h2 id="article-12">第12条（お問い合わせ窓口）</h2>
              <div>
                <p>
                  本ポリシーに関するお問い合わせは、下記の窓口までお願いいたします。
                </p>
                <ul>
                  <li>屋号：Cyber Knock（サイバーノック）</li>
                  <li>代表者名：渡辺 晴仁</li>
                  <li>
                    住所：東京都三鷹市（詳細住所は、ご本人からのご請求に応じて遅滞なくご案内します）
                  </li>
                  <li>
                    お問い合わせフォーム：<Link href="/#contact" className="text-link">お問い合わせフォームへ</Link>
                  </li>
                </ul>
              </div>
            </section>

            <div className="info-note">
              <p className="section-label">動画・AI分析データについて</p>
              <p>AIスポーツトレーナーの動画保存、外部AIサービスの利用、データ削除などは、データの取り扱いページでご案内しています。</p>
              <Link href="/security" className="text-link">データの取り扱いを確認する <span aria-hidden="true">↗</span></Link>
            </div>
          </article>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
