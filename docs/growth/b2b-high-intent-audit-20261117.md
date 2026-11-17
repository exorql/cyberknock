# AI受託開発・開発会社選び：公開検索結果とのギャップ調査

調査日：2026-11-17 JST。対象：日本語の「AI開発 受託」「AI開発 会社」周辺の公開検索結果、Cyber Knockの `/ai-development` と `/insights/ai-development-outsourcing-guide`。**厳密なGoogle検索順位・全競合の網羅調査ではない**。

## 需要の根拠と制約

既存のGoogle Ads Keyword Planner CSV（日本・全言語、2025-10〜2026-09の平均）によると、「AI 開発 会社」「AI 開発 受託」「AI 開発 費用」「AI システム 開発」はそれぞれ**月間100〜1,000回の帯**。数値は帯であり精確な月間件数ではない。元CSVは `docs/growth/b2b-insights-20261103/keyword-demand-review.md` を参照。GSC Wizardは契約上の制限で現在の自社順位・クリックを取得できない。

## SERPで確認できたページの型

| 意図とページ型 | 参考ページ | 得られた示唆 |
| --- | --- | --- |
| 発注会社の比較 | https://www.aikurabe.com/articles/ai-development-erabikata/ | 会社タイプ、比較軸、契約・費用範囲を見たい層 |
| 発注会社の比較 | https://aitech-japan.co.jp/aitech/column/ai-development-company/ | 料金表示の有無や見積条件を比較したい層 |
| 受託開発の直接相談 | https://code-and-design.jp/services/ai-app-development.html | 対応アプリ、役割範囲、開発実績、問い合わせを見たい層 |
| AIシステムの直接相談 | https://localnexus.jp/services/development/ | 実際に使えるサービスの範囲と自社開発実績を見たい層 |

上記は**検索で発見されたページ**であり順位や優劣は確定していない。

## Cyber Knockの状態

- /ai-development：AI機能開発・動画解析・生成AI統合・Web/iOS/Android・PoC・本番運用まで、見積前の相談と自社アプリ実績・25秒デモを掲載済み。**同じ実績のコピー・水増しは不要**。
- /insights/ai-development-outsourcing-guide：要件の整理、PoC判断、費用の構造、比較時の質問、契約・データの取り扱いを網羅済み。記事名と内容が正しく対応している。
- 改善余地は「依頼先をどう選び分けるか」という比較意図への直接回答。現在の6つの質問は有用だが、受託開発・機械学習専門・SaaS導入・技術顧問の**案件別の使い分け**が明示されていない。
- /ai-development の「法人向け開発対応領域」はサービスがAI受託開発であることを明示するH2へ調整する。既存のデザイン・CTA・実績を維持。

## 今回の変更と評価方針

- 既存の選び方記事の比較節に、会社タイプ別の「向いている相談／見積前に確認する点」を追加し、既存6つの質問を保持。
- LPのH2のみを明確にし、過度のキーワード反復・架空の料金やランキング・実績の重複を避ける。
- 実質的な追記を行った既存記事のsitemap最終更新日を更新。
- **SEO順位・流入・問い合わせの改善は未検証**。公開後は検索クエリ・検索表示回数・クリック・/ai-development遷移・有効問い合わせを比較する。
- 先にマージされたPR #13の新記事は公開URL 200とcanonicalを確認済み。別施策の結果と混同しない。
