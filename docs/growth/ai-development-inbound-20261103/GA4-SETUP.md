# Cyber Knock GA4初期設定と安全な検証（2026-11-03）

## 現状と公開前の条件

既存サイトの`SiteAnalytics`は`window.gtag`が存在するときだけカスタムイベントを送信しますが、リポジトリ内にはGA4タグの初期化コードがありませんでした。2026-11-03の公開ページHTMLでも`googletagmanager.com/gtag/js`を確認できていません。Cloudflare等でタグを別途挿入している可能性までは否定できません。

今回、デプロイ先の **`NEXT_PUBLIC_GA4_MEASUREMENT_ID`** に正規のGA4測定ID（例の形式：`G-...`）が設定されたときにだけ、Googleタグを読み込んで計測する処理を追加しました。**測定IDは未取得・未設定のため、計測が本番で有効になったとは扱いません。** IDをリポジトリに直接書き込まないでください。

## 設定

1. Cyber Knock用のGA4 Webデータストリームで、実際に使用する測定IDを確認する。別アプリ・別メディアのIDを流用しない。
2. Cloudflare PagesのCyber KnockプロジェクトのProductionビルド環境変数へ`NEXT_PUBLIC_GA4_MEASUREMENT_ID`として設定し、新しいビルドをデプロイする。NEXT_PUBLIC変数は**ビルド時埋め込み**のため、設定だけで既存公開成果物には反映されません。
3. 既存のCloudflare側カスタムタグ・GTM・他プラットフォームのタグがある場合、重複計測を避けるためロード経路を確認する。
4. GA4 Realtime / DebugViewで、ページ遷移時の`page_view`、`cta_click`、`case_study_click`、`contact_form_start`、`contact_form_submit`、`contact_form_success`を確認する。初回は個人情報のない内部テスト入力に限定し、本番Slackへのテスト通知は別途許可された手順で行う。
5. BtoB案件の獲得評価では、本番GA4の件数と実Slackで受付した**有効問い合わせ**を照合する。GA4イベント受付だけを「受注」と扱わない。

## データを保護する設定と制約

- ID形式の検証は`G-` + 英数字6〜15文字。未設定・形式不正ならGA4タグを読み込まない。
- 自動ページビューは`send_page_view: false`とし、SPAのパス変更にあわせて固定パスから手動で`page_view`を発行する。クエリ文字列・フラグメント・メールアドレス・氏名をGA4イベントへ転送しない。
- `page_location`はコード内の固定URL、`page_referrer`は空文字列を送る。未登録ルートは`other`に集約する。
- `allow_google_signals: false`、`allow_ad_personalization_signals: false`を指定。これらのフラグだけで全ての個人情報保護や法的遵守が完了するわけではありません。
- 追加の広告コンバージョン、個人ユーザーID、入力値、自由記述内容は送らない。
- 外部から`gtag`を事前に設定する構成では、このコードはスクリプトを重ねてロードせず、外部構成の自動ページビューは管理しません。既存タグがある場合はGA4管理画面・GTMで二重計測と機密URLを別途確認してください。

## 証明できる範囲

新しい総合LPの`/ai-development`と固定分類`ai_development`はNodeのテストで検証します。以前のダミー測定IDによるブラウザ試験は旧LPを対象としていたため、新しいURLの計測が確認できた証跡とは扱いません。実GA4計測・Cloudflareの環境変数・本番GTM/同意管理の状態は、PRのコードレビューのみでは確認できません。

**本番デプロイ・GA4設定操作・広告出稿・顧客へのメールはこの作業では実施していません。**
