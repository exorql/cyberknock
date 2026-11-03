# Cyber Knock｜BtoB受託開発の検索流入から商談まで

更新：2026年11月3日。対象：Draft PR #5の全面改稿。**掲載先はCyber Knockの `/insights/`**。AIスポーツトレーナーの `/columns/` は競技の上達・アプリ利用の検索目的を持つため、法人の受託AI開発記事を同じ場所へ複製しない。

## 新しい記事3本

| 表示順 | ページ | 発注者が知りたいこと | 狙う問い合わせ |
| --- | --- | --- | --- |
| 1 | `/insights/ai-development-outsourcing-guide` | AI開発の外注前に決める要件・費用区分・会社の比較方法 | 幅広いAI・Web・モバイル受託 |
| 2 | `/insights/ai-poc-process-evaluation` | PoCの要否、評価項目、合格・条件付き・保留、本番移行 | AI機能のPoCと本番実装 |
| 3 | `/insights/ai-video-analysis-poc-cost` | 動画解析PoCの費用を左右する7項目、入力条件、納品物 | 動画解析の具体的な開発相談 |

4ページ目は`/insights`記事一覧。第一・第二記事は一般的な発注課題、第三記事は専門技術の発注意図を担う。記事の内容は独立させ、相互内部リンクを追加。全記事から総合受託LP `/ai-development#contact`へ誘導する。

## 実装の内容

- 各記事に固有のtitle、description、canonical、Article・BreadcrumbList・FAQPage JSON-LD、FAQ、実務チェックリスト・比較表を設定。
- 旧記事（未公開）の`sports-video-ai-poc-checklist`、`pose-estimation-vs-player-tracking`は新タイトル・新slugへ置換。既に本番公開されたURLではないためリダイレクトは不要と判断したが、本番公開状況は別途確認する。
- Google Analyticsのページ分類：`insight_outsourcing`、`insight_poc`、`insight_cost`。クエリやフォームの氏名・メール・本文をGA4へ送信しない。
- 関連記事と自社プロダクト「AIスポーツトレーナー」の開発・運用事例への内部リンク。契約前のサッカー・弓道案件の事例・画像・動画・リンクは掲載しない。
- 実測していないPoC価格、実務性能、平均開発期間、成約件数を捏造しない。
- 既存のトップページやスポーツユーザー向けSEO、ストア導線は変更しない。

## 公開前の重要な未完了事項：キーワード需要

**日本向けGoogle Keyword Plannerの最新12か月の月間検索需要は、この3つのBtoBキーワードでは確認できていません。** スポーツアプリ向けに保存されていたPlannerデータは別領域であり、このBtoBの記事の検索需要を裏付けません。

[対象キーワードと保留事項](./keyword-demand-review.md)へ記録。**需要データを確認するまでは、見出し・URL・掲載順位を暫定版とし、SEO成果や検索需要を確定したと扱わない。** ただしBtoBの専門性が高く高単価なテーマでは、検索数だけではなく商談意図も評価する。Draftを維持する。

## PRの履歴と安全なマージ

先行するPR #4（AI・プロダクト開発LP）は2026-11-03に**通常のMerge commit（0e7dab3）**としてmainへマージ済み。Squashではなかったため、以前の中間コミットもmainの履歴に残っている。旧PR #5はその前の開発ブランチを親に含むため、**最新mainからSEO関連ファイルだけを再構成してPR #5の差分をクリーンにする**。PR #5から旧ブランチの追加履歴を持ち込まない。ただしPR #4が既にmainへ取り込んだ過去の履歴は、本PRでは変更・削除できない。

マージ、本番公開、広告出稿、顧客連絡は本作業では実施しない。公開後はGSC表示回数だけでなく、記事別の自然検索着地 → 相談クリック → 有効問い合わせ → 商談 → 有償契約を評価する。

## 検証

- `npm run check`（TypeScript、Nodeテスト、Next.js Production静的ビルド）。
- Chrome：`/insights`＋3記事の320/390/768/1440px。横はみ出し、H1、canonical、構造化データ、リンク、フォームへの実遷移。
- 未公開の旧2slugが静的出力に生成されていないこと、sitemapが最新4URLになっていることを確認。
- 実GA4イベント送信、実Slack受付、インデックス、商談・売上は本番公開後に確認する。ローカルモックは実顧客問い合わせとみなさない。

## 最新の実装・品質検証結果（2026-11-03）

クリーンな最新main（PR #4マージ後）からSEOの一覧・3記事・サイトマップ・フッター・GA4ページ分類だけを再構成しました。

- **TypeScript：PASS／Nodeテスト34/34 PASS／Next.js Production静的ビルド：PASS**。[実行ログ](./checks/npm-check.log)
- **Chromeブラウザ4ページ×320・390・768・1440px＝16条件すべてPASS**。[ブラウザQA JSON](./checks/browser-qa.json)
- 正しいH1、canonical、Article・FAQPage構造化データ、横はみ出しなし、内部関連記事リンク各2本、各記事から`/ai-development#contact`への実遷移、エラー0を確認。
- sitemapに新規4URL、未公開の旧2記事URLは**404**でサイトマップにない。
- 各ページ390px・1440pxの[最新スクリーンショット8枚](./screenshots/)を保存。
- 現時点でフォームへの実送信・外部Slack通知・本番GA4の受信は行っていない。問い合わせ・商談・売上の効果は未実測。

**公開判断は需要データ確認待ちのDraft。** URL・主キーワード・見出しは暫定であり、検索量やSEO効果を断定しない。

## 最終確認（2026-11-03）

- 既存のCyber Knock本番URL`/ai-development`はHTTP 200。
- 旧案の2記事URL`/insights/sports-video-ai-poc-checklist`・`/insights/pose-estimation-vs-player-tracking`は本番でもHTTP 404。**既存の公開記事からのURL変更ではない**ことを確認。
- 新規3記事と一覧はこのPRでは未公開、自然検索需要も未検証。公開前の品質試験でSEO成果を証明したと解釈しない。
- 最終コードの`npm run check`はTypeScript・Node **34/34**・Production Buildすべて成功。[最新ログ](./checks/npm-check.log)
- Chromeの`/insights`＋3記事の320/390/768/1440px、**16条件PASS**。Article/FAQPage構造化データ、相互リンク、フォームへの遷移、横はみ出しなし、JavaScriptエラー0。
- クリーンmain起点から作成した記事差分だけをPR #5へ反映予定。mainの過去履歴は書き換えず、競合による旧内容の再混入を防ぐ。
