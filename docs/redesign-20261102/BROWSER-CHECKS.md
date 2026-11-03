# ブラウザ検証記録

2026-11-02、Windows接続Chrome。初版Cloudflare preview `7853275e.cyberknock.pages.dev`、commit `d354f2654dfc69f2239fb98a2d4651509a5abee1`。

## サイクル1

- 5ページのdesktop/mobile実画面を保存。full-page撮影ではviewportが一時的に変わる挙動とlazy画像の未読込がある。最終的な横overflowと文字切れは、viewport指定後・撮影前のDOM寸法および通常のviewportスクリーンショットで判定する。full-pageは全体構成の参考資料。
- Heroの実アプリ画面が製品名を覆う問題を目視検出。製品名の領域を画像の位置指定から切り離す修正へ。
- モバイルの提供内容・対象者の補助文が小さい。12px以上へ、本文は15pxへ修正。
- スポーツDXの品質/相談の見出しが240pxの列で不自然に改行。左右の列幅を再設計。
- サブページh1がh2より細い。見出しウェイトを統一。
- 事例の画像3枚目を実際の練習メニューに対応させたことを確認。

## キーボード・主要導線（初版）

| 操作 | 観測した結果 |
|---|---|
| 最初のTab | 「本文へ移動する」へfocus。outline solid、画面内に表示 |
| スキップリンクEnter→Tab | Headerを飛ばし、main最初の「開発・AI活用を相談する」へfocus |
| メニューをEnterで開きTab | aria-expanded=true、最初の「支援内容」へfocus |
| メニューのEscape | メニュー非表示、aria-expanded=false、開閉ボタンへfocus復帰 |
| モバイルナビのスポーツDX | 対象ページへ遷移、メニューは閉じる |
| DXの「実証について相談する」 | home `?service=sports-dx#contact` へ遷移、相談テーマsports-dxが選択済み |
| 空欄フォームの送信 | name/email/message/privacyの4項目aria-invalid、4件の修正をrole=alertで通知、nameへfocus |

空欄検証はクライアントで止まり、実際の問い合わせ・通知は送信していない。サーバー成功/失敗は自動テストでは外部送信を差し替えて検証済み。ブラウザ上の成功/失敗/送信中の最終実画面は、この時点で未確認。

フォームエラー直後のスクリーンショットはブラウザ接続のtab更新とスクロール位置の不整合があり、最終focus可視性の合格証拠にしない。通常viewportで再確認する。

## 外部リンク

Apple App Store ID `6742685461`、Google Play package `com.harutowatanabe.mealier` は公式ストアページを読み取り、AIスポーツトレーナーの公開先であることを確認。`https://ai-sportstrainer.com/` の自社プロダクトサイトも表示を確認。購入/インストール/問い合わせはしていない。

## サイクル2 — 改訂版のDesktopとフォームfocus

Cloud Chrome、viewport `1363 × 936`、DPR 1。通常の本文領域は `clientWidth=1348`。スクリーンショットの出力寸法は1348×926となるものがあり、viewport／本文幅／画像実寸を区別する。

対象 `6a58ff2`、immutable preview `https://89e75b99.cyberknock.pages.dev/`。`cycle-2/` に実画面を保存。

- home・case・sports-dx・security・privacyの5ページで `scrollWidth=clientWidth=1348` を確認。これはこの幅・位置での観測であり、全幅の合格へ一般化しない。
- Heroの実績名を画像が覆う問題、下層h1の階層、DXの品質・相談見出しの改行が解消。
- caseの3枚のギャラリー画像へスクロールし、全て `complete=true` かつ `naturalWidth>0` を確認。撮影だけでlazy画像の欠損と判定しない。
- 空欄送信後、4件のエラー要約・個別エラーと、お名前欄の明瞭なfocus輪郭を画面内で確認。`cycle-2/form-validation-desktop.jpg`。この画像は初版の同じフォームをCloud Chromeで再確認したもので、成功送信は行っていない。
- securityの目次「外部AIサービスへの送信」で `#external-ai` へ移動。スクロール完了後の見出し上端203.55px、固定header下端83pxで遮蔽なし。共通目次・本文幅・相談への帰路を確認。
- コンソールにはブラウザ拡張のmetadata通信エラーがあった。サイトの例外と区別し、拡張由来エラーをサイト不具合として数えない。

## サイクル3 — 説明図と画像サイズの再確認

対象 `f1b4d4e`、immutable preview `https://542f8310.cyberknock.pages.dev/`。同じCloud Chrome条件。

- スポーツDXのHeroへ、3つの判断と想定成果物を示す概念図を追加。Desktop実画面で文字・枠の重なりはなく、「確認できたこと」と「残った課題」を同時に読める。
- homeで `scrollWidth=clientWidth=1348`。primary/secondary画像とも読込完了。
- DPR 1のDesktopで、両phone画像の `currentSrc` が320wのWebPへ切り替わることを確認。元の640wは事例ギャラリーと高密度表示用に保持する。
- 接続Chromeのviewport操作が応答しないため、幅別の最終確認は保留。Cloud ChromeのDesktopをMobile検証の代わりとして扱わない。

## 未検証

iOS Safari実機、Android Chrome実機、Firefox、スクリーンリーダー実機、実ユーザーデータ/INP、対象顧客の理解度テストは未検証。Chromiumの幅変更を実機検証として扱わない。

## 最終フォーム・計測・実画像の確認

2026-11-02 09:14–09:29 UTC、Cloud Chromeで以下を確認。

- DXの実績欄へ実スクロールし、画像 `pitching-score.webp` が `complete=true / naturalWidth=640` で表示。scrollY3370、画像上端406.83px、viewport1363×936、clientWidth=scrollWidth1348。`cycle-3/sports-dx-evidence-desktop.jpg`。LH全ページ撮影の未読込を実際の画像不良とは扱わない。
- 本番改善版f1b4d4eと同じフォームを、外部通知しないQA専用branchで実操作。必須4項目、不正email、任意予算、同意のクリック／Space、送信中disabled・aria-busy、失敗後の保持、成功h3のfocus、成功後の事例導線を確認。[詳しい検証範囲・画像・イベント](contact-qa/RESULTS.md)。
- 事例CTAから `?service=sports-ai#contact` へ移動し、sports-aiを選択済みで表示。事例クリック・事例表示・CTAのイベントも画面上のmockログで確認。GA4への実送信ではない。
- f1b4d4eの事例ギャラリー「動画分析の実画面を拡大」をクリック。新しいタブで `/images/cases/01-analysis.jpg` が開き、`complete=true / naturalWidth=333 / naturalHeight=720`、実画像の表示を確認。
- 接続先Chrome／Remote環境の長いタイムアウトが続いたため、最終指定幅の撮影をGitHub Actionsの固定版Lighthouseへ移した。実機ブラウザや手動操作の代わりとして扱わない。最終結果は幅別監査記録を参照。
