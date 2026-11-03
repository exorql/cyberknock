# Lighthouse 初回CI実測と監査環境の修正

> 後続レビューで、cycle2/3のUbuntu runnerに日本語フォントがなく、Lighthouse画像が日本語を正しく描画していないことを発見しました。cycle2のBefore画像も日本語を読めないため、以下の測定値は元の実測記録として保持しますが、日本語UIを代表する最終baselineとしては採用を保留します。日本語フォント導入後にBefore/Afterを再取得します。詳細は`../lighthouse-cycle3/DIAGNOSIS.md`を参照してください。

## 結論

2026-11-02の初回CIでは、型検査・18テスト・本番静的ビルドが成功しました。Lighthouseの10ナビゲーションもすべてレポートを生成しました。ジョブが失敗した直接の理由は、改善後ローカル版のPerformanceがトップ83・事例85、LCPが全5ページで2.5秒を超えたためです。

一方、この初回のローカルQAサーバーはHTML/CSS/JavaScriptを非圧縮で配信していました。変更前の公開Cloudflareサイトは圧縮配信です。トップではLighthouseが圧縮による431,683 bytes・LCP 1,950 msの推定削減余地を報告しています。この結果を、そのまま本番サイトの速度悪化と解釈することはできません。推定削減値を実測LCPから引いて「合格」とすることもしていません。

改善後は全5ページでAccessibility / Best Practices / SEOが100、CLSが0でした。ただしプライバシーページの圧縮診断1件にgathererエラーがあります。カテゴリー点数があることと、全診断が完了したことを区別します。WCAG完全適合や実ユーザーCore Web Vitalsの達成は未証明です。

## 1. 出典と再現条件

- GitHub Actions: https://github.com/exorql/cyberknock/actions/runs/41413763972
- Job: `125172564680` / artifact: `13126587557`
- 検査対象HEAD: `6a58ff2087d697dfeb6af7bfd06b368a8ec3ba9b`
- RunnerがcheckoutしたPR仮マージSHA: `9d55e8711628b5993ea409fee64818544571d1f8`。`job.log`にHEADと公開main `5d86802c2a7655da221f0f624a4479d509cc4acc`の仮マージであることを記録。
- 測定時間: 2026-11-02 08:33:06〜08:35:15 UTC（17:33〜17:35 JST）。
- Ubuntu runner / Node 22.23.4 / Google Chrome 156.0.8078.47 / 公式Lighthouse CLI 12.8.2。
- Mobile 412×823 CSS px、DPR 1.75。`throttlingMethod=simulate`、CPU slowdown 4、RTT 150 ms、throughput 1,638.4 Kbps。各レポートの`configSettings`に完全設定を保存。
- 5ページをbefore→afterの順に1回ずつ、並列化せず計10回。中央値ではありません。
- Before: `https://cyberknock.pages.dev`、公開Cloudflare HTTPS/CDN。
- After: `http://127.0.0.1:4173`、`next build`の静的out、HTTP/1.1・no-store・**初回は非圧縮**。
- 同一runner・Chrome・Lighthouse・モバイルエミュレーションですが、配信経路・TLS・CDN・キャッシュ条件は同一ではありません。
- 問い合わせ送信なし。contact、Slack、Google Analytics関連エンドポイントを監査CLIで遮断。GA API呼び出しなし。QAサーバーの通知処理は注入した失敗応答のみで、外部配信しません。

証拠は同ディレクトリの`before/`、`after/`にJSON・HTML・CLIログを保存しました。`summary.json`、`summary.md`、`server.log`、`job.log`も保持しています。元ZIP `reports.zip`のSHA-256は`30eadf4a37c2287f8690a5638737ef9c981b0c913b02e39ee236224c38c602e0`です。初回測定のファイルを修正後の値で上書きしていません。

## 2. 初回の実測値

P = Performance、A = Accessibility、BP = Best Practices。LCPはシミュレートされたラボ値です。

| ページ | Before P / A / BP / SEO | Before LCP | After P / A / BP / SEO | After LCP | After TBT | After CLS |
| --- | --- | ---: | --- | ---: | ---: | ---: |
| `/` | 93 / 93 / 100 / 100 | 3.126 s | 83 / 100 / 100 / 100 | 4.476 s | 48.5 ms | 0 |
| `/sports-dx` | 95 / 96 / 100 / 100 | 2.933 s | 95 / 100 / 100 / 100 | 2.855 s | 79 ms | 0 |
| `/cases/ai-sports-trainer` | 95 / 96 / 100 / 100 | 2.936 s | 85 / 100 / 100 / 100 | 4.329 s | 37 ms | 0 |
| `/security` | 96 / 95 / 100 / 100 | 2.748 s | 96 / 100 / 100 / 100 | 2.706 s | 69 ms | 0 |
| `/privacy-policy` | 100 / 90 / 96 / 82 | 0.927 s | 95 / 100 / 100 / 100 | 2.858 s | 72 ms | 0 |

BeforeのCLSも全ページ0です。BeforeのプライバシーページはCSSのない旧ページで、改善後とは描画内容が異なります。速度スコアだけでそのページの品質向上・悪化を判断しません。

初回のlab閾値判定はAfter全ページ未達です。トップ・事例のPerformanceと、全ページのLCPが未達の項目です。Accessibility / Best Practices / SEOおよびCLSは全ページで設定閾値を満たしました。INP、実ユーザーの75パーセンタイル、CrUX/RUM、CVRは取得していません。

変更前の具体的な非性能問題もレポートで確認できます。トップ・スポーツDX・事例・データ取り扱いではFooter等の`color-contrast`が失敗し、トップでは`link-in-text-block`も失敗していました。旧プライバシーでは`document-title`、`html-has-lang`、`meta-description`が失敗し、console errorも記録されています。変更後の各レポートでは、これらの自動監査は解消しています。

## 3. 失敗の原因と残る改善候補

### 3.1 QAサーバーの非圧縮配信 — 監査環境の問題

Afterトップの転送量は695,124 bytes。HTMLは94,900 bytes、主要CSSは82,242 bytes、JavaScript転送は約379 KBでした。BeforeのCSSはresource size 65,821 bytesに対して約13.2 KBを転送しており、同じ配信条件ではありません。

| Afterページ | `uses-text-compression`推定削減量 | 推定LCP短縮 | 状態 |
| --- | ---: | ---: | --- |
| トップ | 431,683 bytes | 1,950 ms | 診断完了 |
| スポーツDX | 435,268 bytes | 1,350 ms | 診断完了 |
| 開発事例 | 419,599 bytes | 1,950 ms | 診断完了 |
| データ取り扱い | 400,591 bytes | 1,200 ms | 診断完了 |
| プライバシー | 未取得 | 未取得 | 個別gathererエラー |

これはLighthouseの反実仮想推定で、修正後の保証値ではありません。公式の診断説明: https://developer.chrome.com/docs/lighthouse/performance/uses-text-compression/

### 3.2 使用していないCSS — プロダクト側の改善候補

Afterトップでは主要CSS 82,242 bytesのうち56,356 bytes（68.5%）が当該ナビゲーションで未使用と診断されました。プライバシーでは71,703 bytes（87.2%）です。

Tailwindのcontent指定が未使用の`components/ui/`群も走査することを確認しました。Root担当が、現行ページと実際に使用するトップ階層コンポーネントへ走査範囲を絞る方針です。これはCSSの生成範囲の修正で、既存コンポーネントファイルを削除する処理ではありません。監査担当はCSS・ページを変更していません。削減後の実転送量とLCPは再測定で判断します。

未使用JavaScriptの診断もありますが、今回の結果だけを根拠にReact/Nextの共通ランタイムを除去する大規模変更は行っていません。

### 3.3 LCP対象と画像

AfterトップのLCPは投球フィードバックの実アプリ画像です。`loading=eager`、`fetchpriority=high`で、Lighthouseの画像発見チェックは満たしています。事例・データ取り扱いのLCPは見出し、スポーツDX・プライバシーは導入文です。全ページのLCP超過を、画像の大きさだけに帰属させる根拠はありません。

### 3.4 個別監査エラー

Afterプライバシーの`uses-text-compression`は次のエラーで結果がありません。

```text
Required ResponseCompression gatherer encountered an error:
Protocol error (Network.getResponseBody): No data found for resource with given identifier
```

上位の`runtimeError`はなく、他の指標とカテゴリー点数は取得されています。`score=null`の個別エラーが従来の`failedAudits`抽出から漏れていたため、監査スクリプトに独立した`auditErrors`配列と表の件数列を追加しました。エラーを合格として扱いません。

## 4. 監査環境の修正と確認

`scripts/serve-qa.mjs`に任意の`--compress=gzip`を追加しました。既定のブラウザQA動作は維持し、Lighthouse時だけHTML/CSS/JS/JSON/TXT/XML/SVGの1 KB以上をgzip配信します。`Accept-Encoding`を確認し、`gzip;q=0`なら圧縮しません。実圧縮後のContent-Length、Content-Encoding、Varyを返します。画像やwoff2を再圧縮せず、contact処理は変更していません。

修正した監査スクリプトはgzipサーバーを起動します。HTTP/1.1・no-store・localhostである点は引き続き記録し、本番Cloudflareと同一条件とは呼びません。

ローカル限定の一時HTML fixtureで、gzip round trip、非圧縮fallback、q=0除外、HEADのボディなし・正しい長さの4検証が成功しました。3,152 bytesのfixtureが95 bytesで転送され、展開後の内容が一致しました。`node --check`も両スクリプトで成功しました。最初のローカルlistenはsandboxのEPERMで実行できず、ローカル限定確認の実行許可後に成功しています。

## 5. 再測定方法と比較の扱い

保存済みBeforeを再取得する必要はありません。PRの通常CIはAfter5ページのみ監査します。

```sh
node scripts/audit-lighthouse.mjs --stage=after --enforce
```

圧縮後のlocalhostでもLCP差が残る場合、同じLighthouse条件で観測済みのimmutable Cloudflare previewを測定します。

```sh
node scripts/audit-lighthouse.mjs --stage=after-preview --preview-origin=https://DEPLOYMENT.cyberknock.pages.dev --enforce
```

GitHub workflow_dispatchにも`audit_stage`と`preview_origin`を追加しました。PreviewはHTTPSのCyber Knock Pages配下のoriginだけを許可し、ユーザー情報・query・hash・任意ポートを拒否します。PreviewのSEOスコアはレポートに残し、Cloudflareの意図的な`X-Robots-Tag: noindex`で不合格になり得るため閾値gateから除外します。SEO以外のpreview指標と、通常Afterの全指標は従来の閾値で判定します。

修正後のデータは別CI artifactに保持し、この初回フォルダは変更しません。初回との差には監査環境の圧縮追加とRootによるCSS生成範囲の変更が含まれるため、差分のすべてをデザインだけの効果と説明しません。2.5秒付近の不安定な結果が残る場合に限り、対象ページの反復測定で変動幅を確認します。

この文書の時点では、圧縮後のLighthouse値とCloudflare previewのLighthouse値はまだ未取得です。
