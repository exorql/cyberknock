# 有効なLighthouse基準値 — 日本語フォント確認後

## 判定

**このcycle4を、日本語を正しく描画した変更前・変更後の主要なラボ比較記録として採用します。** `font-environment.txt`でNoto Sans CJK JPの利用可能性を確認し、Before/After全10ページのfirstview画像を実際に目視して日本語を読めることを確認しました。

改善後の全5ページはPerformance 99 / Accessibility 100 / Best Practices 100 / SEO 100です。LCPは1.784〜2.173秒、CLSは全0、個別監査エラーは全0で、設定したLighthouseとラボLCP/CLSの閾値を全ページで満たしました。CIも成功しました。

これは単回のラボ計測です。公開Cloudflareとlocalhostの配信経路が異なるため、本番速度の改善率を測定した実験ではありません。実ユーザーINP、75パーセンタイルCWV、WCAG完全適合、コンバージョン改善は未検証です。

## 1. 証拠と測定条件

| 項目 | 記録 |
| --- | --- |
| GitHub Actions | https://github.com/exorql/cyberknock/actions/runs/41416034210 |
| Job / artifact | `125179990120` / `13128071071` |
| 実装HEAD | `f1b4d4e59a6665d0f593b541e16c9bc49e2ea00b` |
| CIでcheckoutした仮マージSHA | `ae65cd4dd14d255c923b31fa350f33c8f4d05739` |
| 測定時刻 | 2026-11-02 08:52:08〜08:54:14 UTC / 17:52〜17:54 JST |
| Runner | Ubuntu 26.04、Node 22.23.4、Chrome 156.0.8078.47 |
| Lighthouse | 公式CLI 12.8.2を固定 |
| Mobile viewport | 412×823 CSS px、DPR 1.75 |
| モデル | simulate、CPU slowdown 4、RTT 150 ms、throughput 1,638.4 Kbps。詳細はJSONのconfigSettings |
| 実行回数 | Before/After各5ページ、各1回、before→afterの対で順次実行 |
| Before | `https://cyberknock.pages.dev`、変更前の公開Cloudflare HTTPS/CDN |
| After | `http://127.0.0.1:4173`、本番static out、HTTP/1.1・gzip・no-store |
| 日本語フォント | `fonts-noto-cjk 1:20240730+repack1-1build1`、Noto Sans CJK JP |
| Fontconfig | `2.17.1-3ubuntu1` |
| Build / tests | 型検査成功、18テスト成功、本番静的build成功 |
| 副作用 | 実問い合わせ送信0、Slack配信0、GA API呼び出し0 |

Chrome/Lighthouse/モバイル条件とフォントは同一run内で揃えています。CDN、HTTPS、キャッシュ、配信距離は一致していません。Cloudflare previewのnoindexをSEO比較に混ぜないため、Afterはlocalhostで測定しました。

元ZIP `reports.zip`のSHA-256は`2353f7a3f3710e2fd15bcb03e0e3bb7a572b8726d899c7641f9cafa0e27b627b`です。JSON・HTML・CLIログは`before/`と`after/`、実行全体のログは`job.log`、設定・数値は`summary.json`、フォントは`font-environment.txt`へ保存しました。

## 2. 主要ページの比較

P = Performance、A = Accessibility、BP = Best Practices。LCPはラボ値です。

| ページ | Before P / A / BP / SEO | After P / A / BP / SEO | Before LCP | After LCP | After TBT | After CLS |
| --- | --- | --- | ---: | ---: | ---: | ---: |
| トップ `/` | 93 / 93 / 100 / 100 | **99 / 100 / 100 / 100** | 3.124 s | **2.121 s** | 42 ms | 0 |
| スポーツDX `/sports-dx` | 95 / 96 / 100 / 100 | **99 / 100 / 100 / 100** | 2.921 s | **1.814 s** | 68 ms | 0 |
| 事例 `/cases/ai-sports-trainer` | 95 / 96 / 100 / 100 | **99 / 100 / 100 / 100** | 2.905 s | **2.173 s** | 44.5 ms | 0 |
| データ `/security` | 95 / 95 / 100 / 100 | **99 / 100 / 100 / 100** | 2.907 s | **1.786 s** | 76 ms | 0 |
| プライバシー `/privacy-policy` | 100 / 90 / 96 / 82 | **99 / 100 / 100 / 100** | 1.013 s | **1.784 s** | 78 ms | 0 |

BeforeのCLSも全0です。全指標が一律に改善したわけではありません。旧プライバシーは共通デザインのない簡素な文書でLCPが短く、改善後は統一したヘッダー・目次・文書レイアウト等を含みます。改善後のLCPは2.5秒の設定閾値内で、A/BP/SEOの欠落を解消しています。

AfterのFCPはトップ1,063.2 ms、スポーツDX905.2 ms、事例758.7 ms、データ759.9 ms、プライバシー756.4 ms。トップのSpeed Indexは1,063.2 msです。

## 3. 数値に対応する修正と検証

### アクセシビリティ・SEO

Beforeのトップ・スポーツDX・事例・データでは`color-contrast`が失敗し、トップには`link-in-text-block`の失敗もありました。旧プライバシーには`document-title`、`html-has-lang`、`meta-description`の欠落とconsole errorがありました。Afterではこれらの自動監査失敗は0です。

A100は自動監査の結果です。キーボード、フォームの全状態、スクリーンリーダー、拡大、実機Safari/Androidの検証記録と組み合わせる必要があります。静的なコントラスト計算・ランドマーク確認は`../STATIC-QA.md`に記録しています。

### 配信とCSS

監査サーバーはgzipを明示的に使用し、初回の非圧縮配信の測定問題を解消しました。実装側では未使用UI群をTailwind生成対象から除き、主要CSSを縮小しています。トップのCSSは37,398 bytesを8,777 bytesで配信し、補助CSSは4,658 bytesを1,571 bytesで配信しています。これらの圧縮を本番と完全に同じCDN挙動だとは扱いません。

### 実アプリ画像

Rootの実装で320/480/640wの候補とsizesを追加した結果、Mobile監査は`pitching-score-320.webp`（12,900 bytes）、`pitching-feedback-320.webp`（16,322 bytes）を実際に取得しました。以前の640w画像はそれぞれ37,472 / 46,688 bytesでした。画面の内容を架空の画像に置換せず、配信画素数を適切に減らせています。

トップの全転送は200,115 bytesです。cycle3の254,649 bytesから削減しています。ただしcycle3は日本語欠字の環境であったため、両runのLCP差を画像変更だけの因果効果とは説明しません。

日本語を描画した今回のトップLCP対象は`p.hero-description`です。以前の欠字環境でLCPだったスマートフォン画像とは対象が異なります。render delayの比率だけを用いて「画像decodeが唯一の原因だった」と結論づけていません。

## 4. スクリーンショット

Lighthouseの埋め込み画像をデコードして保存しました。画像生成・文字修正・再圧縮はしていません。

| ファイル種類 | 保存先 | 画面情報 |
| --- | --- | --- |
| Firstview JPEG | `before/mobile-lighthouse-*.jpg`、`after/mobile-lighthouse-*.jpg` | 412×823pxのviewportを250×498pxへ縮小したLighthouse画像 |
| 全ページWebP | `before/mobile-lighthouse-full-*.webp`、`after/mobile-lighthouse-full-*.webp` | 幅412pxの全ページ原寸画像。高さは各ページによる |
| Metadata | `screenshots-metadata.json` | 元レポート・撮影時刻・viewport・DPR・画像実寸 |

before/after各5ページのfirstview計10枚を目視し、日本語が描画されていることを確認しました。全ページWebPは独立した別担当の視覚レビューにも共有しました。

これらはLighthouseナビゲーション時の実ブラウザ画像です。メニューを開いた状態やフォーム成功・失敗を手動操作した画像ではなく、375/390/768/1024/1440pxの個別レスポンシブ検証の代替には数えません。

## 5. 過去runとの扱い

- `lighthouse-cycle2/`：非圧縮localhostと日本語フォント欠落があった初回。実測と診断経緯として保存し、主要baselineには使いません。
- `lighthouse-cycle3/`：gzip/CSS縮小後。日本語フォント欠落を画像から検出したrun。診断経緯として保存します。
- **`lighthouse-cycle4/`：日本語描画を確認した有効なBefore/After比較。主要baselineはこのrunです。**

不利な数値や失敗した測定を削除していません。gzip、CSS生成範囲、画像サイズ、日本語フォントの問題を具体的に修正して再計測しました。同じコードを合格点が出るまで繰り返す手法ではありません。

有効baselineを保存したため、CIの通常PR実行はAfter5ページのみへ戻しました。手動`workflow_dispatch`では必要な場合にbefore/all/previewを選べます。PreviewのSEOはnoindexの可能性を別扱いにし、レポートには残します。

## 6. 残る未検証事項

- 実ユーザーLCP/INP/CLSの75パーセンタイル。今回のnavigation監査ではINPを取得していません。
- 本番配信後の同一環境による比較、地域・回線・端末別の変動。公開前のCVR改善は断定しません。
- iOS Safari / Android Chromeの実機、VoiceOver/NVDA/TalkBack、拡大・reflow・text spacingの完全な手動確認。
- 実通知の到達。送信処理はモックによる検証で、第三者へ実問い合わせを送っていません。
- 3回以上の中央値。今回は各1回で全主要ラボ閾値を十分に満たしたため、必然性のない追加測定は実施していません。

今回の結果は、このcommitのラボ品質ゲートが合格したことを示します。デザイン賞、総合サイト品質90点、WCAG 2.2 AA完全適合、事業成果の保証とは区別します。
