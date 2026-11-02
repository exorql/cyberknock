# Lighthouse 再測定 — 圧縮配信・CSS削減後

## 採用上の重要な制約

**このrunでは、日本語フォントのないUbuntu runnerで測定していたことが、抽出した実スクリーンショットから判明しました。日本語が欠字の四角で描画されています。サイトの日本語UIを正しく再現していないため、このrunの画像を視覚品質の合格根拠にしません。文字幅・折り返し・LCP対象の代表性にも制約があり、最終の性能判定には日本語フォント導入後の再測定が必要です。**

元の結果は変更せず保持しています。フォント問題は本番サイトへの変更ではなく、CI runnerのシステムフォントを整えることで修正します。Ubuntu公式の`fonts-noto-cjk`パッケージを導入し、`fc-match`で日本語sans-serifが`Noto Sans CJK JP`へ解決することを確認する処理を追加しました。次回はBefore/Afterの両方を同じ日本語フォント条件で取得し直します。

## 1. 証拠と条件

- Run: https://github.com/exorql/cyberknock/actions/runs/41415096280
- Job: `125176903249` / artifact: `13126739502`
- 対象HEAD: `78e44adba97a1407129b3ce2766b7f8341c161f3`
- PR仮マージSHA: `c610340f9b445aaa6fa906570f29ef4dff0ce586`
- 2026-11-02 08:44:10〜08:45:16 UTC（17:44〜17:45 JST）。
- Ubuntu 26.04 runner image `20261025.179.1`、Node 22.23.4、Chrome 156.0.8078.47、Lighthouse 12.8.2。
- Mobile viewport 412×823 CSS px / DPR 1.75 / simulate / CPU 4× / Lighthouse default mobile network。
- ローカル静的outをHTTP/1.1・gzip・no-storeで配信。After5ページを逐次1回ずつ。Beforeはcycle2の保存値を再利用しており、このrunでは取得していません。
- 型検査・18テスト・本番build成功。5ナビゲーション測定完了、個別auditErrorsは全0。
- 問い合わせ実送信、Slack配信、GA API呼び出しなし。
- ZIP SHA-256: `6779b4307b083a15432de271a49b3393955fc0d9d7a3e9cb3eaff85b80ab4fc9`。

同ディレクトリのJSON・HTML・CLIログ、`summary.json`、`summary.md`、`job.log`、`server.log`、`reports.zip`が一次証拠です。

## 2. 取得したラボ値

| ページ | P / A / BP / SEO | LCP | FCP | TBT | CLS | 設定閾値との比較 |
| --- | --- | ---: | ---: | ---: | ---: | --- |
| `/` | 89 / 100 / 100 / 100 | 2.543 s | 1.396 s | 321 ms | 0 | P90、LCP2.5秒に未達 |
| `/sports-dx` | 100 / 100 / 100 / 100 | 1.750 s | 0.755 s | 45 ms | 0 | 数値上は範囲内 |
| `/cases/ai-sports-trainer` | 98 / 100 / 100 / 100 | 2.293 s | 0.755 s | 31.5 ms | 0 | 数値上は範囲内 |
| `/security` | 100 / 100 / 100 / 100 | 1.556 s | 0.762 s | 47 ms | 0 | 数値上は範囲内 |
| `/privacy-policy` | 100 / 100 / 100 / 100 | 1.770 s | 0.758 s | 62 ms | 0 | 数値上は範囲内 |

ここで「数値上は範囲内」とした4ページも、日本語の正しい描画を含む最終合格判定は保留です。INPや実ユーザー75パーセンタイルは引き続き未取得です。

## 3. 圧縮配信とCSS削減の確認

トップのHTML resource sizeは94,900 bytes、転送は18,949 bytesになりました。主要CSSは82,242→36,936 bytes、転送は8,703 bytesです。補助CSSを含むCSS転送は10,274 bytes、ページ全転送は254,649 bytesでした。

`uses-text-compression`と`unused-css-rules`はトップで推定削減0となり、初回の非圧縮配信・未使用CSSの主な問題が解消したことを確認しました。`render-blocking-resources`もFCP/LCPの推定節約0です。CSSをさらに分割することを、現時点の優先修正にはしていません。

初回との違いには監査サーバーのgzip追加と、実際のTailwind content範囲縮小の両方が含まれます。すべての差をサイト実装だけの改善量として扱いません。

## 4. トップP89の内訳と修正判断

| 指標 | 実測 | metric score | Performance内の重み |
| --- | ---: | ---: | ---: |
| FCP | 1,396.3 ms | 0.97 | 10 |
| Speed Index | 2,607.2 ms | 0.97 | 10 |
| LCP | 2,543.3 ms | 0.89 | 25 |
| TBT | 321 ms | 0.76 | 30 |
| CLS | 0 | 1.00 | 25 |

最も大きな減点はTBTです。main-thread-workの集計は約2.09秒で、Style & Layout 526.8 ms、Script Evaluation 475.4 ms、HTML/CSS解析355.3 ms、Rendering 177.6 ms、Other 525.1 msでした。長いタスクは文書本体334/307 ms、webpack chunk211 msなどです。未使用JS推定20,517 bytesはReactの共通chunkであり、不要な外部ウィジェットを除けば済むという診断ではありません。

LCP対象は`pitching-feedback.webp`の実アプリ画像で、表示bounding boxは155×287 CSS px、top664px。`loading=eager`、`fetchpriority=high`、初期HTMLからの発見は合格しています。シミュレートされたLCPのrender delayは82%です。ただし、この集約値だけで画像decodeが唯一の原因とは判断できません。

640px幅の画像46,688 bytesを、LighthouseのDPR1.75では約271 device px相当の表示領域へ配信しています。Root担当が320/480/640wの`srcset`と実際のCSS表示幅に対応する`sizes`を追加する方針です。既存の実UI画像の内容は変更せず、必要な画素数と転送を減らす具体的な改善です。大きな事例画像は維持します。

`decoding=sync`は他の描画を待たせる可能性があり、LCP短縮の保証はありません。そのためprimary画像は`auto`を提案しました。問い合わせフォームのhydration遅延は、操作性へ影響するため今回の第一手にはしていません。[web.dev: Image performance](https://web.dev/learn/performance/image-performance)、[MDN: decoding](https://developer.mozilla.org/en-US/docs/Web/API/HTMLImageElement/decoding)、[web.dev: Optimize LCP](https://web.dev/articles/optimize-lcp)

このrunのbenchmarkIndexはトップ2,456.5、後続ページ2,931.5〜3,016.5で、runner実行時の変動もありました。ただし、同じコードを良い点数が出るまで再実行する対応はしていません。画像サイズと日本語フォントという具体的な修正後に再測定します。

## 5. スクリーンショットの扱い

5レポートの`audits.final-screenshot.details.data`から、埋め込みJPEGをそのまま抽出しました。再圧縮・画像補正はしていません。

- `after/mobile-lighthouse-home.jpg`
- `after/mobile-lighthouse-sports-dx.jpg`
- `after/mobile-lighthouse-case-study.jpg`
- `after/mobile-lighthouse-security.jpg`
- `after/mobile-lighthouse-privacy-policy.jpg`

画像の実寸は全て250×498pxです。監査viewport412×823pxの縮小画像で、375/390px幅を手動検証したスクリーンショットには数えません。`screenshots-metadata.json`にviewport、DPR、画像実寸、時刻、元LHR、フォント欠落の制約を記録しました。

さらにLHRトップレベルの`fullPageScreenshot.screenshot.data`から、412px幅の原寸全ページWebPを`after/mobile-lighthouse-full-*.webp`へ抽出しました。トップは412×10846pxです。対応する`full-page-screenshots-metadata.json`も保存しました。これらも画像加工はしていませんが、同じフォント欠落の制約を持ちます。

5枚を実際に目視し、全ページの日本語が欠字表示であることを確認しました。これにより、JSONの点数だけでは発見できない測定環境の問題を検出しました。次runではfont-environment.txtとJPEGの両方を確認するまで、描画が適切だったと扱いません。

## 6. 次回の受け入れ条件

1. `fc-match`がNoto Sans CJK JPを返し、スクリーンショットで日本語を読める。
2. Before/Afterを同じフォント・Lighthouse・モバイル設定で各5ページ測定し、従来の不完全なbaselineは別フォルダに保持する。
3. トップで適切なsrcset候補が取得され、FCP/TBT/LCPに悪化がないかを確認する。
4. 全ページのP/A/BP/SEO、LCP、CLSと個別auditErrorsを確認する。
5. 実ユーザーCWV、OS/ブラウザ実機、手動アクセシビリティとの違いを維持する。

公式Ubuntuパッケージ情報: https://packages.ubuntu.com/search?keywords=fonts-noto-cjk 。CI imageは26.04で、同配布に日本語を含むCJK regular/boldパッケージが存在することを確認済みです。
