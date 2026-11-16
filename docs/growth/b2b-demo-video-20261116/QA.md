# 法人LP 25秒AI技術デモ動画｜組み込み・計測・QA記録（2026-11-16）

**状態：Draft PR #12でCloudflareプレビュー公開・配信検証済み／本番公開承認は未取得。** ブランチ`feat/b2b-demo-video-lp`。本番`main`へのマージ・本番デプロイは未実施。

## 1. 実装
| 項目 | 内容 |
|---|---|
| 配信ファイル | `public/videos/`に3点のみ：Web用MP4（3,488,870 B）、WebPポスター（61,766 B）、WebVTT（413 B）。SHA-256は`video/hyperframes/output/QA.md`と一致し、テストで固定 |
| 非公開 | マスターMP4・元投球動画・Pose動画・素材パッケージ・QA資料は`public/`に置かない（テストで検査） |
| プレイヤー | `components/development/demo-video.tsx`（クライアント）。初期表示は再生ボタン付きのポスターのみ。`<video>`はクリック／Enter後に生成し、その操作内で`play()`。自動再生なし |
| 初期転送の抑制 | ポスターは表示位置の手前320pxに来た時点で取得（IntersectionObserver）。MP4・VTTは再生操作まで0バイト |
| 操作 | ネイティブcontrols（再生・一時停止・シーク・全画面・CC）。フォーカス時Space／矢印キー。再生開始時に動画へフォーカス移動 |
| 字幕 | 日本語WebVTT5キュー。**既定はオフ**、CCボタンで表示（理由は§5） |
| 代替テキスト | 無音の映像のみコンテンツのため、5場面の内容を`<details>`「動画の内容をテキストで読む」で提供し、`aria-describedby`で関連付け |
| 失敗時 | `error`でポスター上に`role="alert"`の案内＋「もう一度読み込む」。フォーカスを再試行ボタンへ移動。下の3ステップ静止画へ誘導 |
| レイアウト | 16:9の`aspect-ratio`枠（最大880px）。スマホではフレームの余白を縮め、再生ボタンはアイコンのみ（ラベルは読み上げ用に保持） |
| 表記 | Pexels素材であること、73点・評価Bは同一投球の実分析でフォーム評価でありAIの認識精度ではないこと、15〜20秒は別の表示例であることを動画直下に明記 |
| 既存要素 | 3ステップ静止画・フッター導線・LP構成は維持 |

## 2. GA4イベント
既存の許可リスト方式（`lib/analytics.ts`）に追加。`window.gtag`がある場合のみ送信。URL・referrerは固定値で上書きし、フォーム内容は送らない。

| イベント | 発火条件 | パラメータ |
|---|---|---|
| `b2b_demo_video_start` | 実際にフレーム再生が始まった時（`playing`）。読み込み失敗では送らない | `video_id`=`cyberknock_b2b_ai_demo_25s`、`video_duration`=`25`、`placement`=`ai_development_proof`、`page_path`=`/ai-development` |
| `b2b_demo_video_50` | 再生開始後に50%到達 | 同上 |
| `b2b_demo_video_complete` | 90%到達または`ended` | 同上 |
| `b2b_demo_contact_click` | 動画直下CTA（`location=demo_video`）・デモ下部CTA（`location=demo_footer`） | 同上＋`location` |

- 重複防止：各マイルストーンは1ページビューで1回。リプレイ・巻き戻し・再試行で再送しない。一時停止中のシークでは送らない。順序は常にstart⊇50⊇complete。
- 二重集計防止：デモ下部CTAは従来の`cta_click`から`b2b_demo_contact_click`へ置き換え（1クリック1イベント）。**この1リンク分、`cta_click`(location=ai_development)の件数は導入前後で連続しない。**
- 問い合わせとの紐付け：動画を再生したページセッションでは`contact_form_start/submit/success`に`demo_video=started`を付与（メモリ内のみ、保存なし）。コンバージョンは従来通り`contact_form_success`1件のまま。
- 誤送信防止：`NODE_ENV!=="production"`またはlocalhost系ホストではGA4タグを読み込まない。

## 3. テスト結果
- `npm run check`（typecheck → test → build）：**PASS、テスト62件中62件成功**。新規`tests/b2b-demo-video.test.mjs`（6件）と`tests/development-hero.test.mjs`の更新を含む。
- `npm run lint`：ESLint未導入のため未実施（`next.config.mjs`でもビルド時lintは無効）。
- ビルド：`/ai-development`のページJS 1.23 kB→3.74 kB、First Load JS 112 kB→114 kB。初期HTMLに`<video>`なし。

## 4. パフォーマンス（Lighthouse 12.8.2、ローカル静的出力、gzip、各3回中央値）
| 条件 | 指標 | 導入前 | 導入後 |
|---|---|---:|---:|
| モバイル | Performance | 97 | 97 |
| モバイル | LCP | 2,482 ms | 2,487 ms |
| モバイル | CLS | 0 | 0 |
| モバイル | TBT | 76 ms | 37 ms |
| モバイル | 総転送量 | 291,330 B | 269,820 B |
| デスクトップ | Performance / LCP / CLS | 100 / 540 ms / 0 | 100 / 540 ms / 0 |
| デスクトップ | 総転送量 | 232,909 B | 237,994 B |
| 両方 | 動画関連の初期リクエスト | — | 0件 |

- 初版はネイティブ`loading="lazy"`のポスター（62 KB）が初期読み込みに入り、モバイルLCP中央値が2,560 msへ悪化した。IntersectionObserverでの遅延取得に変更し、導入前と同水準に戻した。
- モバイル総転送量の減少は、動画枠で下に押し下げられた`03-training.png`（27 KB）が初期の遅延読み込み範囲から外れたため。同条件の純増はJS・CSS・HTMLで5,085 B（gzip後、デスクトップの増分と同じ）。
- モバイルLCP（ヒーロー本文）は導入前から2.5秒の閾値付近にあり、動画由来ではない既存の課題。
- ローカル配信の実験室値であり、CDN・実回線・フィールドのCore Web Vitalsではない。生データ：`lighthouse/`。

## 5. ブラウザ実動作（デスクトップアプリ内蔵ブラウザ／Chromium、ローカルQAサーバー）
| 確認 | 結果 |
|---|---|
| PC 1366px：ポスター・再生 | 880×495pxで16:9表示。Enterで再生開始、動画へフォーカス、videoWidth 1920×1080 |
| スマホ 375px：表示・再生 | 297×167px、横スクロールなし。タップで再生。CTAのタップ領域44px |
| MP4配信 | `video/mp4`、Range要求に206 |
| 字幕 | 5キュー読込。7〜8秒時点で「動きを捉え、情報として構造化。」（4〜9秒の字幕）を表示し同期を確認 |
| キーボード | Spaceで再生／一時停止、矢印キーでシーク（一時停止中に位置変化を確認） |
| 読み込み失敗（`--media=fail`） | 案内と再試行ボタンを表示、フォーカスが再試行ボタンへ移動、start等のイベント0件 |
| 計測 | 再生→start／50／complete各1件、巻き戻し後の再生で再送なし、CTAで`b2b_demo_contact_click`1件のみ（`cta_click`なし）、合成データ送信で`contact_form_*`に`demo_video=started`。氏名・メールはイベントに含まれない |

QA中に見つけて修正した問題：①読み込み失敗でもstartが送られた（`play`→`playing`へ変更）、②失敗時にフォーカスが失われた、③字幕既定オンでPexels表記・スコア注記を覆った、④スマホで再生ラベルがポスターの見出しを覆った、⑤ポスターがモバイルLCPと競合した。

字幕を既定オフにした理由：字幕は画面内の大見出しと同一文言で、既定オンでは下部のPexels表記・評価注記・画面ラベルを覆う。無音動画のため聴覚情報の代替としての字幕は不要で、内容はテキスト代替でも提供している。既定オンが必要なら`<track>`に`default`を付けるだけで戻せる。

## 6. UI/UX評価（根拠付き・暫定）
| 項目 | 評価 | 根拠／未検証 |
|---|---:|---|
| 表示（PC・スマホ） | 95 | 内蔵ブラウザ2幅で確認。実機未確認 |
| 再生・操作 | 94 | 再生・一時停止・シーク・フォーカス確認。iOS Safari・Android Chrome実機未確認 |
| 字幕・テキスト代替 | 92 | 同期確認。既定オフは設計判断 |
| アクセシビリティ | 92 | Lighthouse a11y 100（初期状態）、ラベル・フォーカス移動・alert確認。スクリーンリーダー実機未確認 |
| エラー時 | 95 | 404模擬で確認 |
| パフォーマンス | 96 | LCP・CLS同等、初期の動画バイト0 |
| 計測 | 95 | モックgtagで発火・重複防止を確認。GA4受信（DebugView）未確認 |
| 問い合わせ導線 | 94 | 動画直下とデモ下部の2か所、#contactへ到達確認 |
| 事実表記 | 96 | 素材出自・スコアの意味・別画面であることを明記 |

**ローカル検証範囲の暫定値：94/100、各項目90以上、未解決の重大問題0件。** 実機・スクリーンリーダー・GA4受信が未検証のため、公開判定の合格としては認定しない。

## 7. 公開前の残課題
1. **本番公開承認：未取得。** [Draft PR #12](https://github.com/exorql/cyberknock/pull/12)は検証用のまま維持し、`main`へはマージしない。
2. **プレビューの配信検証：完了。** MP4のRange 206、VTTの`text/vtt`、ポスターの`image/webp`、不正Rangeの416、配信ファイルSHA-256一致を2026-11-16に確認。詳細は§8。
3. iPhone Safari・Android Chromeでタップ再生、インライン再生、CC切替、全画面を確認。VoiceOver／NVDAで読み上げを確認。
4. GA4：本番の測定ID設定を確認し、カスタムディメンション（`video_id`、`placement`、`page_path`、`video_duration`、`location`、`demo_video`）を登録。DebugViewで4イベントを受信確認。キーイベントは`contact_form_success`のまま、動画イベントをコンバージョンにしない。
5. レポート：`cta_click`(location=ai_development)の前後比較では`b2b_demo_contact_click`(location=demo_footer)を合算する。
6. 動画を差し替える時はファイル名を変える（例：`-v2`）。Cloudflareの既定キャッシュは4時間。
7. ESLint未導入（既存課題）。モバイルLCPは導入前から閾値付近（既存課題）。

## 8. Cloudflare Pagesプレビューの実測（2026-11-16）

- 対象：`https://feat-b2b-demo-video-lp.cyberknock.pages.dev/ai-development`。確認対象コードは`75b095d`（Range配信修正込み）。**プレビューは本番サイトではない。**
- LP：HTTP `200`、`X-Robots-Tag: noindex`。動画・ポスター・字幕の各公開パスに到達可能。
- MP4：`Content-Type: video/mp4`、`Accept-Ranges: bytes`。`Range: bytes=0-1`→`206`/`Content-Range: bytes 0-1/3488870`/2B。`Range: bytes=-1024`→`206`/`3487846-3488869/3488870`/1024B。範囲外の`Range: bytes=9999999-`→`416`/`Content-Range: bytes */3488870`。通常のHEADは`200`。
- MP4全体をCloudflareプレビューからGETしてSHA-256を比較。ローカル配信元・プレビューとも`6E6400B4578075D740A953F811ECD21A8EC341DB1D0E70702AF9593492331669`で完全一致。
- 字幕HEAD：`200`、`Content-Type: text/vtt; charset=utf-8`。ポスターHEAD：`200`、`Content-Type: image/webp`。
- Lighthouse 12.8.2／Windows Chrome／mobile simulate／1回ずつ／GA通信ブロック（2026-11-16 JST）。**プレビュー**：Performance `93`、Accessibility `100`、Best Practices `100`、LCP `2,807ms`、CLS `0`、TBT `174ms`。同じ手順での**公開中LP**：Performance `84`、Accessibility `100`、Best Practices `100`、LCP `4,025ms`、CLS `0`、TBT `23ms`。単回の実験室測定のため優劣確定・実ユーザーCWV判定には使わない。ローカル比較とCDN条件も異なる。
- GA4の安全対策：Cloudflare Pagesのプレビューも`NODE_ENV=production`となり得るため、開発モード/localhost除外だけでは不十分だった。`isProductionAnalyticsHost()`で`cyberknock.jp`と`www.cyberknock.jp`だけを起動許可する修正と回帰テストをこのブランチへ追加。プレビューから本番GA4への自動送信を防止する。GA4 DebugViewの実受信は未確認（別途適切な計測環境で行う）。
- 未実施：iPhone Safari・Android Chrome実機での再生/CC/全画面、VoiceOver/NVDA、GA4カスタムディメンションの管理画面登録および受信。これらを公開済みと解釈しない。
