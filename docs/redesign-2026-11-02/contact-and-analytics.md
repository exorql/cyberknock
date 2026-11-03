# 問い合わせと計測の検証記録

## 変更前（main `5d86802c2a7655da221f0f624a4479d509cc4acc`）

- フォームは `noValidate` でブラウザの必須・email検証を無効化している一方、送信前の確認はprivacyだけだった。
- `/contact` はJSON入力を無検証で `SLACK_WEBHOOK_URL` へ転送。JSON解析がtry外であり、不正JSONを処理できなかった。
- 送信先のmrkdwn文字列に入力を直接連結していた。メンション等を解釈しない安全な表示へ変更する必要があった。
- 失敗応答に上流の例外メッセージを返していた。
- 既存ソースにGA4計測IDまたはgtagの初期化は発見できなかった。CVR、問い合わせ数の基準値は取得していない。

## 実装

`components/contact-form.tsx` は名前、メール、相談内容、privacy同意を必須とする。会社名、相談テーマ、予算は任意。予算は未定・相談して決めたいを選択できる。テーマのqueryは `sports-ai / product / ai-improvement / sports-dx / advisory / other` だけを受け入れる。

各エラーを入力と `aria-describedby` で関連づけ、`aria-invalid` とエラー要約を表示し、最初の不正項目へフォーカスを移す。送信中は入力と再送信を無効化する。成功時は成功見出しへフォーカスを移す。HTTP・ネットワーク・タイムアウト失敗時に入力を初期化しない。privacyページは別タブで開き、読み上げ用の通知を付ける。

`functions/contact.js` は既存の `SLACK_WEBHOOK_URL` を維持し、同意・形式・選択肢・文字数をサーバーで検証する。BodyはContent-Lengthだけに依存せず、読み込み中に24,000バイト上限を検査する。Origin不一致、ブラウザのcross-site送信、不正なContent-Typeを拒否する。honeypot入力は通知しない。Slackには固定の通知文と `plain_text` のsectionを送り、長文を分割する。上流の失敗詳細・入力・秘密情報はログや応答へ返さない。

### 防御の限界

Origin確認やhoneypotは認証・レート制限・CAPTCHAの代替にはならない。Cloudflareのレート制限ルール/Turnstile、永続的な重複送信防止は未設定であり、実装済みとは扱わない。旧キャッシュのフロントエンドはprivacy値を送信しないため、新APIは400を返す。新ビルドとPages Functionsを同じデプロイに含め、公開時にキャッシュ更新とフォーム配信の一致を確認する。

## 計測

`SiteAnalytics` は既存の `window.gtag` がある場合だけイベントを送る。新しい計測ID、追跡script、cookieを追加していない。現状は計測コードを接続できる状態であり、GA4への収集・管理画面での受信検証は未実施。

| イベント | 発生条件 |
| --- | --- |
| `cta_click` | 指定されたCTAクリック |
| `case_study_click` | 指定された事例リンククリック |
| `case_study_view` | 事例ページの表示 |
| `store_click` | 指定されたストアリンククリック |
| `contact_form_start` | 初回入力フォーカスまたは送信操作 |
| `contact_form_submit` | クライアント検証通過後の送信試行 |
| `contact_form_success` | APIがHTTP成功かつ `ok: true` を返す |
| `contact_form_error` | 入力・HTTP・通信・時間切れエラー |
| `contact_form_abandon` | 入力開始済み・未成功状態でpagehide（近似指標） |

属性 `data-track` / `data-location` / `data-service` / `data-store` は許可リストで検証される。入力由来の計測パラメーターは固定値の `location / service / store / source / page / error_type` のみ。`store` は `app_store / google_play` の2値に限定する。氏名、メール、会社名、相談文、任意値、raw URL/query/hashを送らない。

gtagが暗黙に付与するURL由来情報も、本実装のイベントでは明示的に上書きする。`page_location` は固定origin `https://cyberknock.pages.dev` と許可済みページの固定パスから組み立て、`page_referrer` は空文字とする。不明なパスはルートURLと `page: other` に分類する。呼び出し元が `page_location / page_referrer` を入力しても採用しない。将来GA4を初期化する際には、自動page_viewや拡張計測にも別途同じデータ最小化の設定・検証が必要。本実装は未接続の自動イベントまで制御したことを意味しない。

成功件数は受信の代理指標であり、有効問い合わせ・商談化・受注を意味しない。

### source・テーマ・CTA経由の集計

フォームイベントの `source` は、**フォームを設置しているページの分類**を示す。現状は全ページの相談がトップページのフォームへ集まるため `home` となる。訪問者の流入元、直前に見たページ、広告・キャンペーンを推定する値ではない。通知の「相談元」欄もこの設置ページを表す。追跡用storageや任意の参照元情報は追加していない。

`service` は相談テーマを示し、許可されたqueryによる事前選択か、訪問者自身の選択だけを採用する。フォームの開始・送信試行・成功・離脱イベントには、それぞれの時点で選択されているテーマを渡す。未選択時はパラメーターを省略する。テーマを選んだ後も開始イベントを重複発火させない。

CTAイベントの `page / location / service` で、クリックされたページ・配置場所・相談テーマごとの関心を確認できる。一方、フォームイベント単独では「どのCTAから完了したか」は判定できない。専用の帰属キーは実装しておらず、CTAクリック数とフォーム成功数の単純な対応付けは行わない。

テーマ別の開始と完了は同じ期間・計測条件で比較する。ただし、開始後にテーマを変更・選択した利用者では開始時と完了時の分類が異なるため、単純な件数比を同一集団の厳密な完了率とは扱わない。未選択を含む全体の開始→完了率を主指標とし、テーマ別の件数は補助指標として確認する。`contact_form_abandon` はpagehideを使う近似値であり、すべてのSPA画面遷移や実際の離脱を捕捉する指標ではない。

## 実行した検証

2026-11-02、Linux Node v24.22.1。

```sh
node tests/contact.test.mjs
node tests/analytics.test.mjs
```

**API 12件 + 計測6件 = 18件成功、0件失敗。**

APIテストは最小有効入力、任意項目・メール正規化、必須・同意欠落、不正型/文字数、不正JSON、Origin/preview origin、Content-Type/実body上限、honeypot、Slack長文分割とplain_text、設定欠落、上流失敗/例外、HTTP methodを確認。計測テストはPII・任意値の除外、パス分類、gtag未設定時の動作、許可イベントのみの発火に加え、現在URL・referrerにメールアドレスや氏名がある場合の暗黙値上書き、不明パスの除外、ストア分類の許可リストを確認。

すべての通知fetchはテスト用stubへ注入し、実際のSlack通知は行っていない。UIの実ブラウザ検証、実Cloudflareルートへの配信、実通知先への到達確認はこのテスト結果には含めない。

## 参照した仕様

- [Slack section block](https://docs.slack.dev/reference/block-kit/blocks/section-block/) — sectionはplain_text対応、文字数上限3,000。
- [Slack text formatting](https://docs.slack.dev/messaging/formatting-message-text/) — `plain_text` / `mrkdwn` の違いと通知fallback。
- [Slack incoming webhooks](https://docs.slack.dev/messaging/sending-messages-using-incoming-webhooks/) —既存webhookによるBlock Kit形式の送信。
- [GA4 configuration reference](https://developers.google.com/analytics/devguides/collection/ga4/reference/config) — `page_location / page_referrer` の既定値と上書き。
