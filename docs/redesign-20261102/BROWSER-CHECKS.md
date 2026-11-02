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

## 未検証

iOS Safari実機、Android Chrome実機、Firefox、スクリーンリーダー実機、実ユーザーデータ/INP、対象顧客の理解度テストは未検証。Chromiumの幅変更を実機検証として扱わない。
