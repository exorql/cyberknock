# 静的品質検証 — Cyber Knock

検証日：2026-11-02（日本時間）。対象：全面改善後のローカルソース。

## 結論と検証範囲

今回調べたソース構造・配色ペア・フォームの意味づけ・SEO設定では、追加のP0修正を要する問題は検出しませんでした。これはソースコードと数式に基づく部分検証です。WCAG 2.2 AAへの完全適合、実ブラウザ全組み合わせでの動作、Core Web Vitals達成を意味しません。

実際のスクリーンショット・レスポンシブ・ブラウザ操作・Lighthouse結果は、それぞれの検証記録で扱います。Remote Desktop Commanderの応答停止後、GitHub ActionsでBefore/After各5ページのLighthouse実測を取得しました。初回の改善後はA/BP/SEOが全ページ100、CLSは全ページ0ですが、非圧縮QAサーバーでのPerformance/LCP未達があり、再測定対象です。条件・生レポート・個別監査エラーは`lighthouse-cycle2/DIAGNOSIS.md`を参照してください。

対象ファイル：`app/globals.css`、`app/layout.tsx`、各主要ページ、`components/site-header.tsx`、`components/site-footer.tsx`、`components/product-visual.tsx`、`components/trajectory.tsx`、`components/contact-form.tsx`、`components/site-analytics.tsx`、`lib/site.ts`、`lib/analytics.ts`、`app/robots.ts`、`app/sitemap.ts`、`next.config.mjs`。

## 1. コントラストの計算

CSSで指定された不透明な文字色と背景色について、sRGBを線形化し、相対輝度 `L = 0.2126R + 0.7152G + 0.0722B` と `(明るいL + 0.05) / (暗いL + 0.05)` で計算しました。各RGB成分は0〜1へ変換し、`c <= 0.04045` なら `c / 12.92`、それ以外は `((c + 0.055) / 1.055) ** 2.4` を使用しています。判定は丸め前の値、表示のみ小数3桁です。

通常文字4.5:1、大きな文字3:1を基準とし、フォームの識別に必要な枠などは非テキスト3:1で確認しました。各賞の採点ではなく、WCAGに関連する配色の部分検証です。[W3C: Contrast Minimum](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html)、[W3C: Non-text Contrast](https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html)

| 用途 | 前景 | 背景 | 比率 | 判定 |
| --- | --- | --- | ---: | --- |
| 主本文 / paper | `#192b2b` | `#f5f3ed` | 13.311:1 | 通常文字合格 |
| 補助本文 / paper | `#526662` | `#f5f3ed` | 5.509:1 | 通常文字合格 |
| 強調・リンク / paper | `#006d65` | `#f5f3ed` | 5.607:1 | 通常文字合格 |
| 主本文 / white | `#192b2b` | `#fffefa` | 14.636:1 | 通常文字合格 |
| 補助本文 / white | `#526662` | `#fffefa` | 6.057:1 | 通常文字合格 |
| 強調・リンク / white | `#006d65` | `#fffefa` | 6.165:1 | 通常文字合格 |
| 主本文 / mint | `#192b2b` | `#dfe9e1` | 11.873:1 | 通常文字合格 |
| 補助本文 / mint | `#526662` | `#dfe9e1` | 4.913:1 | 通常文字合格 |
| 強調・リンク / mint | `#006d65` | `#dfe9e1` | 5.001:1 | 通常文字合格 |
| タグ / mint | `#004f49` | `#dfe9e1` | 7.622:1 | 通常文字合格 |
| 通常CTA | `#fffefa` | `#192b2b` | 14.636:1 | 通常文字合格 |
| CTA hover・DXバナー | `#fffefa` | `#006d65` | 6.165:1 | 通常文字合格 |
| DXバナー補助文 | `#e3f0e7` | `#006d65` | 5.298:1 | 通常文字合格 |
| Placeholder指定 | `#687771` | `#fffefa` | 4.660:1 | 通常文字合格 |
| 項目エラー | `#a92b2b` | `#fffefa` | 6.784:1 | 通常文字合格 |
| エラー通知 | `#8e2020` | `#fff1ec` | 8.010:1 | 通常文字合格 |
| 必須表示 | `#00574b` | `#e3eee7` | 7.161:1 | 通常文字合格 |
| Contact補助文 | `#526662` | `#e5eae1` | 5.003:1 | 通常文字合格 |
| 製品図のプラットフォーム表示 | `#355246` | `#e1e7de` | 6.820:1 | 通常文字合格 |
| 同・compact版 | `#355246` | `#cbdacb` | 5.898:1 | 通常文字合格 |
| Footer補助文 | `#c5d4cb` | `#192b2b` | 9.603:1 | 通常文字合格 |
| Footerリンクhover・focus | `#b6e9d3` | `#192b2b` | 10.962:1 | 通常文字・非テキスト合格 |
| Footerの大きな矢印 | `#a7cabb` | `#192b2b` | 8.306:1 | 非テキスト合格 |
| 入力フィールド枠 | `#82948c` | `#fffefa` | 3.170:1 | 非テキスト合格 |
| 通常focus輪郭 / paper | `#006d65` | `#f5f3ed` | 5.607:1 | 非テキスト合格 |

検査した通常テキストペアの最低値は4.660:1です。実際のアプリ画像内の文字、透過・重なりを含む最終ピクセル、ブラウザ固有のフォームUIはこの数値表の対象外です。画像には代替テキストと補足があり、事例内の画像は原寸画像を別タブで開けます。

汎用区切り線 `#cbd2c9 / #fffefa` は1.530:1です。本文の識別に必要な文字色や、入力欄の識別に必要な枠には使っていません。装飾的な区切り線を、通常文字・必須のUI識別線が合格した根拠に含めていません。メニューボタンの薄い外枠も、濃い色のアイコンとは分けて扱います。

## 2. 見出し・ランドマーク・参照先

ソースのリテラルタグ/属性を検索した結果です。動的に生成される最終DOMの完全検証ではありません。

| ページ | h1 | main | リテラルID重複 | aria-labelledby参照先欠落 | 前方への見出しレベル飛び |
| --- | ---: | ---: | ---: | ---: | ---: |
| `/` | 1 | 1 | 0 | 0 | 0 |
| `/sports-dx` | 1 | 1 | 0 | 0 | 0 |
| `/cases/ai-sports-trainer` | 1 | 1 | 0 | 0 | 0 |
| `/security` | 1 | 1 | 0 | 0 | 0 |
| `/privacy-policy` | 1 | 1 | 0 | 0 | 0 |

- 全ページで共通の`header`、名前付き`nav`、`main#main-content`、`footer`を使用。
- `本文へ移動する`のスキップリンクを先頭に配置。固定ヘッダーを考慮したscroll padding/marginを指定。
- モバイルメニューはnative button、`aria-expanded`、`aria-controls`、開閉に応じたaccessible name、閉じた状態の`hidden`を使用。Escapeで閉じてトグルへfocusを戻す実装。
- FAQはnative `details/summary`。JavaScriptがなくても内容にアクセスできる。
- 本文はスクロール検出後のopacity変更に依存せず、初期状態から表示。
- 原則として装飾SVGは`aria-hidden="true"`。軌跡は`focusable="false"`で実測のモーションデータではないことがソースコメントに明記。
- 実アプリ画像には内容を説明する`alt`と寸法属性。検査対象の`img`に`alt`欠落は0件。
- スポーツDXの成果物表には`caption`、列見出し`scope="col"`、行見出し`scope="row"`。
- 文書ページの目次は名前付き`nav`で、対応する見出しIDへ移動。

## 3. フォームの意味づけと状態

`components/contact-form.tsx`を確認しました。

| 項目 | 静的確認結果 |
| --- | --- |
| Label関連付け | 各項目を`useId()`由来のIDと`htmlFor`で対応付け |
| 必須/任意 | 名前・メール・相談内容・同意が必須。会社・テーマ・予算は任意と明記 |
| 自動入力・入力方式 | 名前/email/organizationのautocomplete、emailのtype/inputMode、autocapitalize無効 |
| 入力チェック | `noValidate`と独自validationを併用。空欄、email形式、長さ、同意を確認 |
| エラー理解 | `aria-invalid`、項目ごとの`aria-describedby`、エラー件数の`role="alert"` |
| エラー時focus | 最初の不正項目へfocus。サーバーからの項目エラーにも対応 |
| 送信中 | `aria-busy`、送信ボタンと項目のdisabled、polite live text、二重送信抑止 |
| 送信失敗 | 同じcontrolled stateを維持し、入力内容を消去しない。通信/timeout/serverの説明 |
| 送信成功 | `role="status"`、成功見出し`tabIndex=-1`へfocus、返信目安と次の導線 |
| 同意 | native checkboxと関連label。プライバシー文書は別タブで開くことを支援技術向けにも通知 |
| Bot用の非表示項目 | `aria-hidden`、`tabIndex=-1`、クリップされた領域に隔離 |

成功・失敗の実ブラウザ操作、支援技術の読み上げ、実際の通知到達は、この静的確認の証明には含めません。実際のSlackへの通知を本担当から送信していません。

## 4. キーボード・モーション・操作領域

- 通常focusは3pxの輪郭＋4px offset、濃いFooter内は明るい輪郭へ切り替え。
- `prefers-reduced-motion: reduce`でanimation/transitionを無効にし、smooth scrollも無効化。
- `forced-colors: active`でボタン、タグ等の境界をCanvasTextへ切り替え。
- 通常ボタンはmin-height 54px、フォームinput/selectは48px。モバイルのメニューは38〜40px×40px、ヘッダーCTAは40px高で、24pxのAA最低サイズを上回る設計。
- 同意checkbox本体は再レビューで24×24pxに変更されました。ソースの`width: 24px; height: 24px`を確認済みです。関連labelと周囲の間隔を含む有効クリック領域・隣接リンクの位置は、引き続きブラウザで確認する対象です。[W3C: Target Size Minimum](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html)
- 320px幅、文字拡大、400%ズーム、Text Spacing変更での重なりはソースだけでは判断せず、別途ブラウザの検証対象とします。

Root担当からはChromeでスキップリンク、Tab移動、メニューのEscape、相談テーマ連動、空欄時validationを確認済みと報告されています。この担当が独立して再実測した結果とは区別します。

## 5. SEO・構造化データ

| 項目 | 確認結果 |
| --- | --- |
| 言語 | Root layoutに`html lang="ja"` |
| タイトル・説明 | 各主要ページに固有title/description。トップは事業範囲を明示 |
| Canonical | `/`、`/sports-dx`、`/cases/ai-sports-trainer`、`/security`、`/privacy-policy`を個別指定 |
| Base URL | `https://cyberknock.pages.dev`を維持 |
| Robots | `index: true`、`follow: true`。robots.tsは`User-agent: *`にallow `/`、sitemap URLを維持 |
| Sitemap | 同じ主要5ページを維持。公開パスの変更なし |
| Search Console | 既存google verification値を保持 |
| OGP/Twitter | title/description/siteName/locale等を維持・更新。専用共有画像は未追加 |
| 組織データ | Organizationを維持。所在地は三鷹市・東京都・JP。旧streetAddress/postalCodeを除去 |
| 個別構造化データ | BreadcrumbList、スポーツDXのService、事例のSoftwareApplicationを使用 |
| 実績数値 | 架空のaggregateRating、受賞歴、売上数値は構造化データへ追加していない |
| 静的出力 | Next `output: export`を維持。既存公開URLを維持してprivacyページをApp Routerへ統合 |

変更後`app`内に旧住所「道玄坂」「150-0043」「streetAddress」の残存はありません。住所の番地・建物名など非公開情報は追加していません。

外部ストアURLは`lib/site.ts`へ集約されています。App Store IDは`6742685461`、Google Playのpackage IDは`com.harutowatanabe.mealier`です。公開状態はRoot担当が確認済みで、本担当のネットワーク再確認対象からは除外しました。

共有画像の追加、sitemapのlastModifiedを実際の更新日に固定する改善はP1/P2候補です。現状のsitemapは既存方式のbuild時刻を使用しています。リッチリザルトの適格性・検索順位・索引状態は、この静的検査から断定しません。

## 6. 計測コードの境界

- `SiteAnalytics`は既存の`window.gtag`が存在する場合だけイベントを送信します。計測IDや外部タグは作成していません。
- イベント名・location/service/store/source/page/error_typeは許可語彙に限定。
- 名前・メール・相談本文・会社名・任意の文字列を許可しない設計。
- `page_location`は定数のcanonical originとページ分類から生成し、query/hashを取り除きます。`page_referrer`は空文字を指定。
- 計測失敗がフォーム送信を妨げないよう例外を処理。

GA4のプロパティ接続・DebugViewでの受信確認・KPIの変更前数値は未検証です。イベントコードの存在と実際のデータ収集開始は別です。

## 7. 未検証・追加確認事項

| 項目 | 状態・必要な確認 |
| --- | --- |
| Lighthouse Mobile | 初回Before/After各5ページを取得。A/BP/SEOはAfter全100、CLS全0。Performance/LCPは圧縮配信で再検証、詳細は別記録 |
| 実ユーザーCWV | LCP/INP/CLSの75pは未取得 |
| VoiceOver/NVDA/TalkBack | 実際の読み上げ順、エラー通知、menu操作は未確認 |
| iOS Safari / Android Chrome実機 | 未確認。Desktop Chrome emulationと区別 |
| 拡大・reflow・text spacing | 200%文字拡大、400%ズーム、カスタム行間等は未確認 |
| 同意checkboxの有効領域 | 関連label込みの領域・隣接リンクとの距離を実画面で確認 |
| データ取り扱い本文の実態 | 既存記載の運用・法的妥当性を本担当が再監査したものではない |
| 実通知到達 | 実Slack送信なし。モックテストと区別 |
| 分析・事業成果 | 既存GA4受信、有効問い合わせ、商談化、受注の実測なし |

静的確認のみを根拠に総合90点、受賞相当、WCAG完全適合、CVR改善済みとは評価しません。
