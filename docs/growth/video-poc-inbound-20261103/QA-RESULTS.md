# Cyber Knock AI動画解析・PoCインバウンド｜公開前QA結果

検証日：2026-11-03（JST）。対象：`exorql/cyberknock` の `feat/b2b-ai-video-poc-inbound-20261103`。未マージ・未公開状態での検証。**新規公開コンテンツの事業効果を示す結果ではない。**

## 最終判定

**ローカル検証：PASS。公開判定：HOLD（Draft PRでレビュー待ち）。**

- TypeScript：`npm run typecheck` PASS
- Node unit tests：`npm test` 28/28 PASS。Cloudflare Pages Functionの送信元別通知（`video_poc`/`soccer_poc`/`kyudo_poc`）・入力検証・エラー応答を含む
- Static build：`npm run build` PASS。Next.js 15.5.28で全14ページ生成、`out/` に新ページ3件・sitemap生成
- 実Chrome（静的ビルドをローカルで配信）：**3ページ × 320/390/768/1440px = 12条件 PASS**。各H1 1件、横はみ出し0、CTAからフォームへのアンカー、必須エラー（名前・メール・内容・同意）、FAQ、ページエラーの検証
- ローカルモック送信成功：**3 source PASS**。実Slack宛ての外部送信なし、正しいsourceとスポーツAIのサービス値でフォームを受付。GA4イベントはローカルメモリで確認
- ローカルモック送信失敗（HTTP 500）：**3 source PASS**。入力は保持し、成功表示を出さず、`contact_form_error`を記録
- サイトマップ：新規3 URLの収録を確認
- 画面証跡：390px/1440px × 3ページ（6枚）。実顧客映像や公開許諾未確認の資料は含めない

## 証跡

- [静的ページとフォームのブラウザQA](./checks/browser-qa.json)
- [失敗時のブラウザQA](./checks/form-failure-qa.json)
- [TypeScript・28テスト・Production build全ログ](./checks/npm-check.log)
- 390px：[`video_poc`](./screenshots/after-video_poc-390.png) / [`soccer_poc`](./screenshots/after-soccer_poc-390.png) / [`kyudo_poc`](./screenshots/after-kyudo_poc-390.png)
- 1440px：[`video_poc`](./screenshots/after-video_poc-1440.png) / [`soccer_poc`](./screenshots/after-soccer_poc-1440.png) / [`kyudo_poc`](./screenshots/after-kyudo_poc-1440.png)

## 最終レビュー内容

1. 既存のホーム・スポーツDX・ケーススタディは本文を書き換えず、新規の専門LP・技術検証への内部リンクを追加する最小差分とする。
2. サッカーは実動画→候補→人手レビュー→MP4書き出しの「技術経路」を説明し、本人追跡・プレー自動抽出の精度を完成扱いしない。
3. 弓道は動作の候補時刻・推定軌跡・参考角度の技術検証に限定し、公式な会の長さ・身体重心・3D計測精度を保証しない。
4. 新ページ内のSVGは工程説明のための模式図。サッカー・弓道の実映像や顧客名・ロゴを**許諾なしに公開しない**。
5. フォームは既存のCloudflare Pages Functionを再利用し、新しい宛先は追加しない。予算や動画は初回必須にせず、問い合わせ障壁を下げる。
6. GA4パラメータは固定値のみ。個人情報・文章・動画情報・検索文字列を送信しない。

## 未完了の外部依存

- GitHub PRの自動CI・レビュー結果を確認してからマージ判断。本書のローカルPASSをGitHub CIのPASSと読み替えない。
- 本番デプロイ後のCloudflare Functions、Slack配送、GA4受信、実問い合わせの成功は**未検証**。ローカルモック結果では保証できない。
- 顧客映像の公開許諾、商用AI精度、実顧客の理解度、SEO検索流入、有効問い合わせ、商談化、受注は未検証。
- 実映像デモは公開許諾・個人情報の整理後に別の変更として追加する。技術検証の説明図だけで実証映像を見せたことにはしない。
- 公開T0後に7日・28日で有効問い合わせ→商談→有償PoCのファネルを確認する。自動化の登録済みとは扱わない。

**マージ、デプロイ、広告出稿、価格の確約、顧客へのメール・連絡は本作業では行わない。**
