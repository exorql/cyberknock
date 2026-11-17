# B2B技術デモの素材・出自

**ローカル制作物は完成済み。素材の権限確認はユーザーが2026-11-16に完了。本番公開承認は別途。**

## 同一分析の素材
Mac miniから受領した`output/material-handoff/cyberknock-b2b-ai-demo-va_78f6aa6f-20261116/`が正本。Windows上で`Verify-Package.ps1`を実行し、対象33ファイルのSHA-256/サイズを検証（パッケージ全体は34ファイル、PASS）。

- `assets/analyzed-source/pitching.mp4` — Pexels ID 5182923由来の投球動画（720×1280 / 30fps）。
- `assets/app-output/pose.mp4` — アプリ実出力（320×568 / 20fps）。ローカルMediaPipeによる再推定とは異なる。
- `assets/app-output/images/` — 同一分析のアプリ実画面6点。実スコアは73点・B。
- Request ID：`va_78f6aa6f`、Training ID：`jJswFzGSGlwQqXh1gcvS`。
- 元映像は独自撮影ではなくPexels由来。旧制作の同意・商用許諾を今回の法人向け公開許可に流用しない。

詳細ハッシュと真正性の根拠はパッケージの`integrity.json`、`manifest.json`、`binding-verification.json`、`rights-review.md`および`output/ASSET_EVIDENCE.md`を参照。

## 別画面・ブランド素材
`npm run assets:sync`で以下の正本をコピーし、SHA-256を確認する。

| 作業用パス（Git管理外） | 同じリポジトリの正本 |
|---|---|
| `assets/01-analysis.jpg` | `public/images/cases/01-analysis.jpg` |
| `assets/03-training.png` | `public/images/cases/03-training.png` |
| `assets/pitching-feedback.webp` | `public/images/product/pitching-feedback.webp` |
| `assets/corporate-icon.svg` | `app/icon.svg` |

これらは別の画面の参考例であり、同一の投球レポートと誤認させない。

## Gitと公開の境界
`assets/verified/`、`assets/fonts/`、`output/`はGit管理外。解析正本やレンダリング結果、フォントをGitに加えない。Pexels一般ライセンスは商用利用・加工を条件付きで認めるが、肖像・推薦表現など個別の権利判断は別途必要。法人サイト公開・本番反映は未実施。
