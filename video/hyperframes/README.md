# Cyber Knock｜HyperFrames 法人向けAI技術デモ

**25秒の動画は完成済み。素材の権限はユーザー確認済み（2026-11-16）。法人LPへの組み込みはローカルブランチで実装・検証済みで、本番公開承認は別途必要です。**

## 生成済みファイル
`output/delivery/`

- `cyberknock-b2b-ai-demo-25s-web.mp4` — Web掲載候補、3.49MB、H.264・faststart
- `cyberknock-b2b-ai-demo-25s-master.mp4` — 高品質マスター
- `cyberknock-b2b-ai-demo-25s-poster.webp` — Webポスター
- `cyberknock-b2b-ai-demo-25s.ja.vtt` — 日本語字幕、5キュー

技術・視覚QAは`output/QA.md`、素材証跡は`output/ASSET_EVIDENCE.md`、法人LP組み込みは`output/HANDOFF.md`を参照。

## Windowsで編集・再制作する方法

```powershell
cd D:\develop\cyberknock\cyber-knock\video\hyperframes
. .\scripts\local-env.ps1
npm.cmd run assets:sync
node scripts/build-demo.mjs
hf check --json
hf render --quality delivery -o output/delivery/new-review-master.mp4
```

初回のみ`scripts/local-env.example.ps1`を`scripts/local-env.ps1`（Git管理外）へコピーし、Node・FFmpeg・HyperFrames CLIのパスをこの端末に合わせて書き換える。

`scripts/build-demo.mjs`は編集可能な5シーン・字幕・検証済み媒体の作業用コピーを再作成し、`scripts/refine-motion.mjs`を最後に適用します。新しい分析を実行しません。CLI・Node・FFmpegの場所は端末ごとの`scripts/local-env.ps1`で定義します。CLIが更新された場合は互換性を確認し、無断でバージョンを切り替えないでください。

### 編集ソース
- `index.html`、`styles.css`、`compositions/*.html`
- `scripts/build-demo.mjs`、`scripts/refine-motion.mjs`
- `SPEC.md`、`ASSETS.md`

### 入力
- Mac miniから移送された正本素材パッケージ：`output/material-handoff/cyberknock-b2b-ai-demo-va_78f6aa6f-20261116`
- 同一Request ID`va_78f6aa6f`の検証：`Verify-Package.ps1`、`manifest.json`
- 別アプリ画面の原本：同一リポジトリ`public/images/`から`npm run assets:sync`

`output/`内の媒体・QA・プレビューはGit管理外。生成中の画像・レンダリングキャッシュは再生成できるが、原本・マスター・Web版・字幕・ポスター・QA証跡は保持する。ローカル日本語フォント、解析動画や実顧客由来の素材をGitに追加しない。

## LP組み込みと本番公開
- 2026-11-16：素材（Pexels 5182923由来の投球映像、同一分析`va_78f6aa6f`のアプリ実出力Pose・結果画面）の権限確認はユーザーが完了。
- Web用MP4・WebPポスター・WebVTTの3ファイルのみを`public/videos/`へ配置し、`components/development/demo-video-player.tsx`の`verifiedCorporateDemoVideo`から参照（作業ブランチ`feat/b2b-demo-video-lp`）。マスター・素材パッケージは公開しない。
- 検証記録：`docs/growth/b2b-demo-video-20261116/`。
- **本番公開承認は未取得。** 承認前にPush・PR・デプロイ・メール送信を行わない。差し替え時は`output/delivery/`から3ファイルを再コピーし、SHA-256を照合する。
