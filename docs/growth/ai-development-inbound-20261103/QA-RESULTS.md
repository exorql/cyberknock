# Cyber Knock｜AI・プロダクト受託開発LP 公開前QA

対象：PR #4（`/ai-development`）。旧`/ai-video-analysis`は今回の公開対象外。未契約の個別案件はサイトへ掲載しない。

## 結果

**ローカル検証：PASS。公開判定：GitHub CI・レビュー待ち。**

- TypeScript・Node **32テストPASS**、Next.js Production静的ビルド**PASS**。[ビルド・テストログ](./checks/npm-check.log)
- Chromeの静的ビルド表示：**320・360・390・768・1440px、5条件PASS**。見出し「AI・プロダクト開発を、構想から実装まで。」は全幅で2行、ページ横はみ出しなし、ブラウザJavaScriptエラーなし。[ブラウザQA](./checks/browser-qa.json)
- CTA実クリック：ページ内`#contact`へ移動し、名前・メール・相談内容フォームを表示。相談テーマは初期状態では未選択で、動画解析に固定されない。
- ローカル成功モック送信：**source=`ai_development`**、service=空欄、POSTはローカルの1回のみ。実Slack送信0。
- ローカルHTTP 500モック：失敗表示、入力値保持、誤った成功表示なし。[失敗時QA](./checks/form-failure-qa.json)
- 自社アプリ「AIスポーツトレーナー」へのリンクあり。一般的なAI・Web・モバイル開発を紹介し、個別未契約案件を公開していない。
- ホーム・スポーツDXのリンク、canonical、Service・FAQ JSON-LD、sitemapを`/ai-development`で確認。旧`/ai-video-analysis`はローカルの静的出力で**404**。旧URLや未契約案件の個別URLはHTML/XMLにない。

## 画面証跡

[320px](./screenshots/ai-development-320.png)／[390px](./screenshots/ai-development-390.png)／[1440px](./screenshots/ai-development-1440.png)／[失敗時390px](./screenshots/ai-development-failure-390.png)。

上記はWindowsの最適化静的エクスポートをローカルChromeで検証した結果。本番Cloudflare Pagesの公開状態、実機スマートフォン、GA4実測定IDとイベント受信、実Slack通知、商談化率・売上は**未検証**です。

## 公開判断

- コードの最終差分とCIを確認したうえでPRをレビューする。
- 以前の中間コミットには後から取り下げた内容が含まれるため、mainへのマージは**Squash and merge**を推奨。ただしPRやプレビューの履歴削除を意味しない。
- PR #5は上流PR #4に依存するため、#4を先に取り込んだ後に記事差分だけをmainへ反映する。
- 本PRではマージ・本番公開・本番問い合わせ送信・広告出稿・顧客メールを行っていない。
