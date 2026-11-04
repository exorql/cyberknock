# Cyber Knock｜ホーム・総合受託LPから技術ガイドへの導線追加

検証日：2026年11月4日。対象：`exorql/cyberknock` の最新mainを起点とした独立ブランチ。

## 目的・優先順位

事業目的は**有効な法人開発相談 → 商談 → 提案 → 有償受注**。技術ガイドは発注を検討する訪問者へ判断材料を提供する補助導線とし、既存の主CTA「開発について相談する」を弱めたり、記事クリックを問い合わせCTAと混同したりしない。

## 実装した内容

- ホーム `/`：「支援内容」の直後、「ご相談からの進め方」の前に、コンパクトな「開発を依頼する前に、知っておきたいこと。」を追加。
- 総合受託LP `/ai-development`：FAQの後・問い合わせフォームの前に、同じ記事3本＋一覧へのリンクを追加。
- 共通フッターの既存「技術・PoCガイド」は変更せず維持。
- 記事のタイトルとURLは既存の`lib/b2b-insights.ts`から取得するため、記事情報を2か所で重複管理しない。
- 実際のリンク：
  - `/insights/ai-development-outsourcing-guide`（AI開発会社の選び方と費用）
  - `/insights/ai-poc-process-evaluation`（AI PoCの進め方と評価基準）
  - `/insights/ai-video-analysis-poc-cost`（AI動画解析の開発費用とPoCの見積ポイント）
  - `/insights`（一覧）
- 記事への導線は大きなカードにせず、3本の編集的なリンク行として掲載。スマートフォンでは縦並び・タップ領域70px以上。
- ホームのH2は「開発を依頼する前に、」／「知っておきたいこと。」の語句単位で改行し、320〜1440pxで語中改行しないよう検証。

## 計測の契約

- 新イベント：`insight_click`。
- 固定パラメータ：`location=content`、`guide=overview`または記事slug、`page=home|ai_development`。
- `guide`は4種類のallowlistに限定。氏名・メール・自由入力・生URLはイベントへ入れない。
- **`cta_click`は主に問い合わせへのCTA用として維持**。記事リンクのクリックでは加算しない。
- イベント発火のコードとローカルモックは検証したが、本番GA4の設定・受信は未確認。

## QA

- `npm run check`：TypeScript **PASS**、Nodeテスト **45/45 PASS**、Next.js 15.5.28のProduction静的ビルド **PASS**。
- Chrome（Macの独立したテスト環境）：ホーム／総合受託LP × **320・390・768・1440px = 8条件PASS**。記事リンク各3、記事一覧、フッター、配置順、主CTA、記事URL HTTP 200、横はみ出し0、ブラウザJavaScriptエラー0。
- 390pxの両ページではサーバーのローカルGA4モックによって**`insight_click`が1件、`cta_click`が0件**であることを検証。
- 本番の問い合わせフォームPOST **0件**、外部Google/Slackへのテスト送信なし。
- [ブラウザ実測JSON](./checks/browser-qa.json)
- [ホーム390px](./screenshots/home-390-insights-entrypoints.png)・[ホーム1440px](./screenshots/home-1440-insights-entrypoints.png)
- [総合受託LP390px](./screenshots/development-390-insights-entrypoints.png)・[総合受託LP1440px](./screenshots/development-1440-insights-entrypoints.png)
- [ビルド・ユニットテストログ](./checks/npm-check.log)

## 今回変更しないもの

記事本文・記事URL・canonical・sitemap・既存GA4イベントの値・問い合わせ送信処理・Webhook・料金・自社アプリのStore導線。未契約の顧客案件の新規掲載、広告出稿、顧客メール送信もしない。

**マージ・本番公開は保留。** リンク追加が有効問い合わせ数を改善するかは、公開後の`insight_click`から相談フォーム到達・実際の商談まで計測して評価する。
