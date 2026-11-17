# Cyber Knock：sitemap最終更新日とGoogleインデックス状態の検証

作業日：2026-11-17 JST

## 変更の理由

以前の `app/sitemap.ts` はホーム・スポーツDX・AI受託LP・開発事例・セキュリティ・プライバシーポリシーに `new Date()` を渡していた。そのため**ページを変更していないデプロイ**でも、サイトマップの `lastmod` はデプロイの日時になっていた。

Google Search Centralは、`lastmod` が本文・構造化データ・内部リンク等の**実際の重要な変更日**として一貫して正確なときに利用する、と説明している。参照：https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap

## 修正方針と根拠

- ホーム：2026-11-17（購入検討ガイドへの導線 `InsightsEntryPoints` 変更）
- スポーツDX：2026-11-12（正規ドメインとページコンテンツ更新）
- AI受託LP：2026-11-17（受託意図を明確にする見出し更新）
- 開発事例：2026-11-14（事例メタデータ等の変更）
- セキュリティ：2026-11-12（正規ドメイン変更）
- プライバシーポリシー：2026-11-12（正規ドメイン変更）

各日付は `git log origin/main -- <path>` と関連コンポーネントの更新履歴で検証した。これらのページを実質的に更新したときだけ、`app/sitemap.ts` の該当日付を手動で更新する。単なるデプロイ・著作権表示年の変更では更新しない。既存の `/insights`・4記事・デモの日付は維持。

## Search Consoleでの確認項目（未検証）

利用中のGSC Wizard連携は契約制限でデータ取得不可。現在開いているブラウザタブにSearch Consoleはなく、今回**Googleのインデックス状態・選択canonicalは確認できていない**。公開サイト側のHTTP 200・canonical一致だけでは、Search Consoleの重複警告が解決したかは判断できない。

次のURLをプロパティ `sc-domain:cyberknock.jp` または `https://cyberknock.jp/` のURL検査へ入力：

1. https://cyberknock.jp/ai-development
2. https://cyberknock.jp/insights/ai-development-outsourcing-guide
3. https://cyberknock.jp/insights/ai-video-analysis-development-request
4. https://cyberknock.jp/cases/ai-sports-trainer
5. https://cyberknock.jp/insights/ai-poc-process-evaluation

各URLで以下を記録する：

- インデックス登録済み / 未登録と理由
- ユーザーが指定した正規URL
- Googleが選択した正規URL
- 最終クロール日時・サイトマップの検出
- 「重複しています。Googleにより異なる正規ページが選択されました」の対象URLが上記の中に含まれているか

対象が `https://cyberknock.pages.dev/...` 等であれば、正規ドメインへの301/308転送とcanonicalの一致を確認したうえで、意図した正規URLのインデックス状態を確認。正規URLの例外を見つけた場合のみ追加のリダイレクト/リンク修正を検討する。対象がページネーション・追跡パラメータなどの意図した重複であれば、むやみにindex化しない。

公式参考：https://support.google.com/webmasters/answer/9012289?hl=ja

## 効果の確認

PR公開後に `https://cyberknock.jp/sitemap.xml` で対象6件の `lastmod` が上記の固定日に変化したことを確認。日付の正確性は**ランキング向上を保証しない**。自然検索の表示回数、クリック、LP到達、法人の有効問い合わせは別途GA4とSearch Consoleで測定する。
