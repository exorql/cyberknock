# Cyber Knock 法人LP — HyperFrames動画制作

このディレクトリは [Cyber Knockの法人向けLP](https://cyberknock.jp/ai-development) 用の20〜25秒技術デモを制作するための**編集ソース**です。現時点ではCLIの初期テンプレートであり、完成動画ではありません。

## Windowsでの再開

```powershell
cd D:\develop\cyberknock\cyber-knock\video\hyperframes
npm run assets:sync
npm run assets:check
npm run dev
npm run check
```

- 制作内容と素材の利用条件：`BRIEF.md`、`ASSETS.md`
- HyperFrames CLI：`0.9.54`に固定（初回移行時に動作確認）
- 画像原本：同一リポジトリの`public/images/`と`app/icon.svg`
- 画像のローカルコピー：`assets/`に必要なものだけ生成。Gitには追加しない
- 動画・ポスター・字幕・QA：`output/`に出力。承認前の成果物はGit管理・本番公開しない
- HyperFramesの調査キャッシュ：`evidence/`、`.hyperframes/`をGitから除外

`npm run check`は移行直後の未編集テンプレートでPASSしましたが、「静止画のためタイムラインに動きがない」という警告が1件あります。動画完成を意味するものではありません。

公開権限、投球動画と解析結果の一致、品質チェックが確認できた後に、公開用ファイルだけ`public/`へ移し、既存の`components/development/demo-video-player.tsx`の設定を切り替えます。
