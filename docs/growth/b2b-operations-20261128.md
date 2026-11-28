# 法人サイト改修の基準と維持範囲

2026年11月28日着手時に取得した `origin/main` は `317ef51e99fb7ad38b1f882952809301ed0e2742`。設計資料の監査SHAと一致し、#26・#27はマージ済み。未マージの#1は旧所在地の表記修正。現行トップの所在地は東京都三鷹市。この記録の基準はGitのmainで、本番配信と同一のコミットであることの確認は含まない。

| ページ | 維持・変更する役割 |
| --- | --- |
| `/` | 業務課題別の入口。代表・所在地・データ取扱・自社製品とストアへ接続 |
| `/services/business-automation`（新設） | 1部署の既存AI導入と、受発注・見積・報告など1業務の連携を比較 |
| `/services/business-systems`（新設） | Excel・紙台帳の移行、権限・承認、運用を含む業務管理 |
| `/ai-development` | 新サービス・専門AI開発、画像・動画AI実用性判定60万円、AI品質・原価改善レビュー月20万円。コレステAIのストア画像3枚・キャプション、評価レポート例、25秒デモ |
| `/ai-development/ai-quality-evaluation` | 改修担当者・固定評価資産のあるチーム向けの月次評価 |
| `/cases/ai-sports-trainer`、`/demos/ai-sports-trainer` | 自社製品の評価事例・実画面。顧客実績と区別 |
| `/insights` | 商用ガイド一覧 |
| `/insights/ai-development-outsourcing-guide` | 発注範囲・会社選定 |
| `/insights/ai-poc-process-evaluation` | 技術検証の進め方・評価 |
| `/insights/ai-video-analysis-poc-cost` | 動画解析の検証費用 |
| `/insights/ai-video-analysis-development-request` | 動画解析の開発依頼 |
| `/services/growth-web`、`/services/growth-web/demo` | スクール専用の料金・申込・デモ。デモのnoindexと専用APIを維持 |
| `/sports-dx`、`/security`、`/privacy-policy` | 自治体等の相談、データ取扱、個人情報の方針 |

業務向け2商品の範囲・納品物・初期費用・任意の継続費は `lib/business-services.ts` を参照する。専門AIの参考料金は既存LPで管理し、新規事業MVPは初期300〜800万円・標準500万円（税別）。商品範囲に対応した見積例で、過去の受注価格ではない。

従来のREADMEが記していた「計測IDを読む環境変数なし」「9イベントのみ」は現行ソースと異なる。既存の本番ホスト限定GA4初期化・初回の許可済み流入属性・手動ページビューを維持し、2ページの固定分類を追加。フォーム・通知の相談元と相談テーマ、既存4記事からの相談文脈を別々に扱う。

11月4日改訂の既存キーワード調査は2025年10月〜2026年9月の日本・全言語のPlanner記録。今回、新規業務語の需要、GSC・GA4管理画面の当期実測、実通知、成約効果は取得していない。日付・母集団が異なる過去記録からは補完しない。
