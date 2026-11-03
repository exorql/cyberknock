# 2026-11-04｜Google Keyword Planner実測に基づく記事タイトル・説明文改善

対象：Cyber Knockの既存3記事。**既存URL・公開履歴・本文セクション・検索流入の導線は維持**し、言い回しと検索意図を改善。

## 検証に使用した一次資料

- 出典：Google Ads Keyword Planner／保存したキーワード／ネイティブCSV、2026-11-04 07:30 JST取得
- 検索条件：**日本、Google検索、すべての言語、2025-10〜2026-09**
- 24語：100〜1,000回が7語、10〜100回が6語、数値非表示が11語。**代表値「500」「50」は厳密な検索回数ではない**
- 原本はWindowsの`D:\ai-validation\automation-state\seo\analytics-cache\2026-11-04\cyberknock-b2b\`に保存。SHA256 `1ab43a86f41ff9eec60c049dad33b980330bd7443434f6c991b3093eaa8ceef7`
- [キーワード別結果と制約](./keyword-demand-review.md)。日本語限定・自然検索の競合難易度を確認したものではない

## 既存記事への反映

| 対象 | 新H1 | 検索需要との関係 |
| --- | --- | --- |
| `/insights/ai-development-outsourcing-guide` | **AI開発会社の選び方と費用** | 「AI開発 会社」「AI開発 受託」「AI開発 費用」が100〜1,000回。受託・外注の語はdescriptionと導入文にも反映 |
| `/insights/ai-poc-process-evaluation` | **AI PoCの進め方と評価基準** | 「AI PoC」「PoC 開発」が100〜1,000回。descriptionに「PoC開発」を明記 |
| `/insights/ai-video-analysis-poc-cost` | **AI動画解析の開発費用とPoCの見積ポイント** | 「AI 動画 解析」は100〜1,000回。ただし開発費用との複合語は非表示なので商談需要があると断定せず、専門記事として維持 |

記事タイトルを無理に多くのキーワードで埋めず、モバイルで区切り記号が不自然に折り返されない短いコピーに調整。

## QA

- TypeScript／Node tests **38/38 PASS**、Next.js Production静的ビルド成功。
- Chromeを使用して`/insights/`＋3記事×320・390・768・1440pxの**16条件PASS**：単一H1、canonical、Article/FAQ構造化データ、リンク、横はみ出し0、JavaScriptエラー0。
- 最新[ブラウザQA JSON](./checks/keyword-demand-browser-qa-20261104.json)・[開発会社記事390px](./screenshots/keyword-targeting-ai-development-outsourcing-guide-390.png)・[PoC記事390px](./screenshots/keyword-targeting-ai-poc-process-evaluation-390.png)。
- 390pxの2記事ともタイトルは**2行**。検証では問い合わせ送信0、外部Slack通知0。

## 今回は行わないこと

- 検証していないBtoBキーワードを「100以上」と扱う
- 日本語限定の検索数、SEO順位上昇・実流入・商談化を保証する
- 既存URL変更や新規記事の大量追加、サッカー・弓道の未契約案件の掲載
- 広告出稿・Google Adsアカウントの再有効化・勝手な本番マージ

本変更はレビュー用の独立PRに提出する。実公開後の成果はGSCの対象クエリと記事へのクリック、GA4での相談CTA、受注件数で判断する。
