# Cyber Knock

Cyber Knock公式サイトのソース。スポーツAI・動画分析、Web／モバイルプロダクト開発、AI品質改善、開発顧問、自治体・競技団体の実証支援を紹介する。

公開サイト: [https://cyberknock.pages.dev/](https://cyberknock.pages.dev/)

Next.jsの静的出力をCloudflare Pagesへ配信し、問い合わせだけをCloudflare Pages Functionで処理する構成。開発・テスト・buildのコマンドに本番公開処理は含まれない。**本番への公開、mainへのマージは明示的な承認を得てから行う。**

## 1. 構成

一次資料: [package.json](package.json)、[next.config.mjs](next.config.mjs)、[問い合わせFunction](functions/contact.js)。

| 項目 | 現行構成 |
|---|---|
| フロントエンド | Next.js 15.5.28、React 19.2.6、TypeScript、App Router |
| 配信 | `output: 'export'` による `out/` の静的ファイル |
| URL | `trailingSlash: false`。既存の5つの主要URLを維持 |
| 画像 | `images.unoptimized: true`。実アプリ素材を静的配信 |
| UI | 共通CSSとTailwind、必要な箇所だけのクライアントコンポーネント |
| 問い合わせ | `functions/contact.js` → `POST /contact` → 既存Slack通知先 |
| 行動計測 | 既存 `window.gtag` がある場合だけ、許可リスト内の9イベントを送信 |
| CI | [.github/workflows/quality.yml](.github/workflows/quality.yml)。型検査、テスト、静的build、Lighthouse |

| パス | 主な用途 |
|---|---|
| [app/page.tsx](app/page.tsx) | トップ、サービス、事業者情報、問い合わせ |
| [app/sports-dx](app/sports-dx/page.tsx) | 自治体・団体向け実証支援 |
| [app/cases/ai-sports-trainer](app/cases/ai-sports-trainer/page.tsx) | 自社アプリの開発・運用事例 |
| [app/security](app/security/page.tsx) | AI・動画データの取り扱い |
| [app/privacy-policy](app/privacy-policy/page.tsx) | プライバシーポリシー |
| [app/globals.css](app/globals.css) | 公開ページのデザイントークン・共通スタイル |
| [lib/site.ts](lib/site.ts) | サービス内容、製品・ストアの参照先 |
| [components/contact-form.tsx](components/contact-form.tsx) | フォームの状態、入力チェック、エラー・成功表示 |
| [lib/analytics.ts](lib/analytics.ts) | イベント名・属性の許可リストとURL情報の除外 |
| [components/site-analytics.tsx](components/site-analytics.tsx) | 指定リンクのクリックと事例ページの表示計測 |
| [functions/contact.js](functions/contact.js) | サーバー入力検証・通知処理 |
| [scripts/serve-qa.mjs](scripts/serve-qa.mjs) | 外部通知を行わないローカルQAサーバー |
| [scripts/audit-lighthouse.mjs](scripts/audit-lighthouse.mjs) | 主要5ページのMobileラボ監査 |
| [tests/contact.test.mjs](tests/contact.test.mjs)、[tests/analytics.test.mjs](tests/analytics.test.mjs) | API・PII除外などの自動テスト |

## 2. 開発を始める

CIと同じNode.js 22系を使用する。テストはNodeの `--experimental-strip-types` オプションを使用するため、CI相当の環境に揃える。

完全なGit checkoutで、コミット済みの `package-lock.json` を用いてインストールする。

```sh
npm ci --legacy-peer-deps
npm run dev
```

開発画面は通常 `http://localhost:3000`。必要なら `npm run dev -- --port 3001` のようにポートを指定する。

`next dev` はPages Functionを実行しない。開発画面からの `/contact` 成功・失敗確認には、次節の静的build＋ローカルQAサーバーを使う。Nextの開発サーバーで画面が出ることと、Cloudflareの問い合わせが動くことを混同しない。

依存関係を変更しない作業でlockfileを作り直さない。既存の `pnpm-lock.yaml` もあるが、この品質CIのインストール手順はnpmと `package-lock.json` を基準にしている。作業用の部分スナップショットにlockfileがない場合は、元リポジトリの完全なcheckoutを使う。

## 3. コマンドと検証の範囲

| コマンド | 内容・注意 |
|---|---|
| `npm run dev` | Next開発サーバー。Pages Functionは動作しない。 |
| `npm run typecheck` | `tsc --noEmit` による型検査。 |
| `npm test` | NodeのテストランナーでAPI・計測テストを実行。通知fetchはstubに差し替える。 |
| `npm run build` | 本番用静的出力を `out/` へ生成。本番公開はしない。 |
| `npm run check` | 型検査→テスト→静的buildを順に実行。 |
| `npm run qa` | 生成済み `out/` を4173番で配信。問い合わせはモック成功。先にbuildが必要。 |
| `npm run lint` | 既存の `next lint` スクリプト。現在のcheck／CI品質ゲートには含まれない。 |
| `npm start` | 既存の `next start` スクリプト。静的exportのプレビュー用途には使わず、QAサーバーを使用する。 |

`next.config.mjs` ではTypeScriptのbuild errorを無視しない。一方、`eslint.ignoreDuringBuilds` は有効なため、build成功をESLint合格と扱わない。

API12件・計測6件の計18テストを用意している。入力・同意・形式・文字数、JSONとbody上限、Origin、honeypot、通知のplain_text、通知先設定不足、上流失敗、許可イベント、URL由来PIIの除外等を確認する。これらはブラウザE2E、実機、実通知到達、GA4管理画面への到達を自動的に証明するテストではない。

検証結果は対象commitと実行条件を添えて記録する。型検査・テスト・buildが通っていても、Lighthouseや手動操作が未達なら別項目として残す。

## 4. 通知を送らずにフォームを確認する

最初に `npm run build`。その後、必要なモードを起動する。

```sh
node scripts/serve-qa.mjs --port=4173 --contact=success
```

別の状態は別ポートで確認できる。

```sh
node scripts/serve-qa.mjs --port=4174 --contact=failure
```

```sh
node scripts/serve-qa.mjs --port=4175 --contact=slow
```

| モード | 動作 | 主な確認 |
|---|---|---|
| `success` | 注入した通知fetchが成功を返す | 成功メッセージ、成功見出しへのfocus、次の事例導線 |
| `failure` | 注入した通知fetchが失敗を返し、Functionが失敗応答を返す | 入力保持、エラー通知、再試行 |
| `slow` | 2秒後にモック成功 | 送信中の表示、入力・ボタンのdisabled、連打抑制 |

接続先は `http://127.0.0.1:ポート番号`。サーバーはloopbackにのみbindする。静的ファイルの既定ルートは `out/` で、必要な場合は `--root` で別の出力ディレクトリを指定できる。

このサーバーは実際のFunctionの検証ロジックを読み込むが、通知処理のfetchを必ずモックに差し替える。実環境の通知用変数を読み込まず、外部通知を送らない。モード省略時はfailureだが、`npm run qa` は明示的にsuccessを指定している。

画面では少なくとも次を確認する。

1. 空欄送信で氏名・メール・相談内容・同意のエラーが分かり、最初の不正項目へfocusが移る。
2. 任意の会社・予算・テーマを未入力のまま進められる。
3. `/?service=sports-dx#contact` 等の許可テーマが選択され、未許可値は採用されない。
4. 送信中に連打できず、失敗時に入力が残り、成功時には完了状態へ移る。
5. プライバシー確認が別タブで開き、元フォームの入力を保持できる。
6. キーボードとモバイル幅でエラー・focus・成功案内を見失わない。

実際の氏名・メール・機密情報をテストに使わない。mock成功は、CloudflareでのFunction配信や本物の通知先への到達確認を意味しない。

### ローカルのイベント表示

実際のUI操作から計測関数へ渡る引数を確認する場合だけ、`--analytics=mock`を付ける。

```sh
node scripts/serve-qa.mjs --port=4173 --contact=success --analytics=mock
```

`failure`・`slow`にも同じオプションを組み合わせられる。サーバーがHTMLのhead先頭にメモリ内のgtag stubを追加し、Nextの初期イベントも記録する。表示パネルはDOMContentLoadedおよびページload後に本文の末尾へ追加される。固定表示ではなく、フォームやCTAを覆わない。

ページ末尾の「ローカル検証用イベント（外部送信なし）」を開くと、`gtag`へ渡った引数をJSONテキストで確認できる。件数と個別イベントは次のDOM属性でも読める。

| DOM | 確認できるもの |
|---|---|
| `#qa-analytics[data-event-count]` | このページで記録したgtag呼び出し件数 |
| `#qa-analytics-count` | 表示されている件数 |
| `#qa-analytics-log > li[data-event-name]` | イベント名 |
| `#qa-analytics-log > li[data-event-index]` | 1から始まる発生順 |
| 各項目内の`pre` | イベント名・属性を含む元の引数配列 |

ログ側は属性を再フィルタせず、アプリが渡した引数を`textContent`で表示する。もしPII除外に誤りがあれば、このローカル記録でも分かるため、合成テストデータだけを使う。外部への計測送信、cookie・storageへの保存、サーバーへのログ転送は行わず、ページ再読み込みで消える。SPA内遷移では同じページの記録が続くが、別文書への移動後までログを保持する機能はない。

このオプションは既定で無効。`out/`や本番用アプリコードを書き換えず、Lighthouseもオプション無指定のため追加DOMは含まれない。モックで確認できるのはUIからgtagに渡るイベントであり、GA4への送信、DebugViewでの受信、利用者の識別・集計の検証ではない。

## 5. 問い合わせAPIと環境設定

### 入力と処理

`POST /contact` はJSONを受け付ける。名前・メール・相談内容・privacy同意が必須、会社・テーマ・予算は任意。フロントとサーバーの双方で検証し、許可された選択肢だけを採用する。

- 名前100文字、メール254文字、会社200文字、相談内容5,000文字。bodyは実際の読み込み中にも24,000バイトで制限。
- メールはtrim・NFKC正規化を行い、ドメインを小文字に揃える。
- Origin不一致、ブラウザのcross-site送信、不正なContent-Typeを拒否。
- 非表示honeypotに入力がある場合は通知を行わず成功応答。
- 既存の通知先へ固定のfallback文と `plain_text` のblockを送信。本文をコードやSlackメンションとして解釈させない。
- 通知処理のタイムアウトは8秒、ブラウザ側は12秒。
- 入力値・通知先の秘密・上流例外の詳細をレスポンスやアプリのログへ出さない。
- 永続保存キュー、永続的な再送重複防止、Turnstile、Cloudflareレート制限はこのコードでは実装していない。Originとhoneypotをその代替と説明しない。

| 状態 | 主なHTTP応答 |
|---|---|
| 正常／honeypot破棄 | 200 |
| JSON・入力・同意の不備 | 400 |
| Origin・cross-site不一致 | 403 |
| POST以外 | 405 |
| body超過 | 413 |
| Content-Type不適合 | 415 |
| 通知先エラー・通信失敗 | 502 |
| 通知先設定不足 | 503 |

UIは429も扱うが、Function自身がレート制限を実施して429を返す設計ではない。

### 環境変数名

値はREADME・ソース・PR・検証ログへ記載しない。

| 名前 | 設定する場所・目的 |
|---|---|
| `SLACK_WEBHOOK_URL` | Cloudflare Pages Functionの環境別のsecret。既存通知先を維持。フロント公開変数にしない。 |
| `NEXT_TELEMETRY_DISABLED` | CIで使用するNextのテレメトリー設定。サイトの問い合わせ・GAイベントとは別。 |
| `CHROME_PATH` | Lighthouseが利用するChrome実行ファイルの指定。CIでは検出した実行ファイルから設定。 |
| `GITHUB_SHA / GITHUB_RUN_ID / GITHUB_REPOSITORY / GITHUB_STEP_SUMMARY` | GitHub Actionsが提供する測定記録用のコンテキスト。通常、開発者が秘密情報として設定する項目ではない。 |

GA4のIDを読む環境変数は現行コードにない。環境変数を追加するだけでGA4収集が始まる実装ではない。計測接続は [運用計画](docs/redesign-20261102/MEASUREMENT-PLAN.md) に従って別途確認する。

ローカルモックとCIには本物の通知secretを渡す必要がない。CloudflareのPreviewとProductionで設定を混同しない。**実通知先への到達は現在未検証**であり、実送信を行う場合は、内容・宛先・受信者の了承がある検証として実施し、営業問い合わせとは分ける。

## 6. Cloudflare Pagesへの反映

このリポジトリの想定は、Nextのbuild出力 `out/` と、ルートの `functions/` を同じCloudflare Pagesのリリースへ含める構成。静的ファイルだけを別のホスティングへコピーしても `/contact` は実装されない。

Cloudflare側で実際のプロジェクト設定を確認する項目:

- 対象リポジトリ・Production branch・Preview branch。
- buildの作業ディレクトリがリポジトリルートであること。
- build commandが `npm run build` 相当、出力ディレクトリが `out` であること。
- Nodeと依存解決がCIと整合していること。
- 対象リリースに `functions/contact.js` が含まれること。
- 環境別のsecret、プレビューのアクセス設定、既存のキャッシュやルーティング設定。

このREADMEは未取得のCloudflareダッシュボード設定を確定情報として記載するものではない。既存設定を確認してから変更する。現在、リポジトリ内の品質workflowにdeploy処理は含まれないが、Git連携によるPages側の自動配信は別の設定である。branchへのpushがpreviewを、mainへの変更が本番配信を起動する可能性を確認する。

### 公開手順

1. 変更内容、未コミット差分、既存ルールを確認し、作業branchで修正する。
2. `npm run check` と必要なブラウザ・Lighthouse検証を完了し、結果を保存する。
3. プレビューで主要5ページ、CTA、同一originのFunction配信、環境設定を確認する。実通知はモックと区別する。
4. 承認対象のcommit、プレビュー、未達項目、公開範囲を提示し、**本番公開／mainマージの明示的な承認を得る**。
5. 承認されたリリースへ静的ファイルとFunctionを一緒に反映する。
6. 公開したcommitと時刻を記録し、実際の表示・リンク・フォーム配信・計測設定を確認する。必要な復旧は既存Pages運用の既知の正常リリースを基準に判断する。

旧フォームはprivacy値を送らないため、新Functionだけを先行配信すると400になる。新UIと新Functionを同じリリースに含め、古いHTML／JavaScriptとの混在やキャッシュを確認する。

本番承認前に、mainへのpush、PRのmerge、production deployを検証コマンドの一部として実行しない。

## 7. LighthouseとCI

品質workflowはPRと手動起動に対応する。変更パスの条件があるため、ドキュメントだけの変更では自動起動しない場合がある。必要な再検証は手動起動で行う。

ローカルでは、Chromeとnpxが利用できる環境でbuild後に実行する。

```sh
npm run check
node scripts/audit-lighthouse.mjs --enforce
```

このスクリプトは自分で4173番のQAサーバーを起動する。**先に4173番で動いているQAサーバーを止める。** 別のサイトを誤測定しないため、ポートが使用中ならエラーにする。

固定版Lighthouse 12.8.2を用い、公開サイトとローカル静的buildの主要5ページずつを順に測定する。出力先は `docs/redesign-20261102/lighthouse/`。HTML・JSON・ログ・集計・条件を保存し、CIではartifactへアップロードする。フォーム、通知、分析用エンドポイントを遮断し、フォーム送信や分析API取得を行わない。

目標はMobileでPerformance 90以上、Accessibility／Best Practices／SEO 95以上、ラボLCP 2.5秒以下、CLS 0.1以下。`--enforce` は変更後の未達を失敗扱いにする。詳細はスクリプトと各artifactの条件を参照する。

公開前を「before」、ローカルbuildを「after」として測るため、CDN・HTTPS・ネットワーク・キャッシュ条件は一致しない。各ページ1回のラボ測定で、実ユーザーINPや75パーセンタイルのCore Web Vitals達成を証明しない。自動Accessibility scoreだけでWCAG 2.2 AA完全適合を宣言しない。

本番を更新した後の再実行は、公開サイト側も更新後になる。変更前の測定artifactを保存し、ラベルだけを根拠に旧サイトとの比較としない。

## 8. スタイルと素材を変更するとき

公開ページのトークン・共通スタイルは [app/globals.css](app/globals.css) に置く。ヘッダー、フッター、ボタン、フォームの共通クラスを使い、ページごとに別の見た目を増やさない。

[Tailwind設定](tailwind.config.ts) は `components/*.{ts,tsx}` の直下だけを走査する。公開ページで使わない既存 `components/ui/` から不要なCSSが生成されることを避けるためであり、UIコンポーネント自体は削除していない。将来 `components/ui/` を利用する場合は、**使うファイルと、その依存先のスタイルを持つファイルをcontentへ明示的に追加**し、静的buildで必要なCSSが含まれるか確認する。

- 主要情報をスクロールアニメーション発火まで非表示にしない。
- `prefers-reduced-motion`、明確なfocus、見出し・ランドマーク、フォームラベルを維持する。
- 320px以上の配置、実機操作、文字拡大を変更範囲に応じて確認する。
- 実UI、概念図、撮影時点の例を区別する。確認していない精度・利用者数・売上・顧客・受賞歴を追加しない。
- 外部の画像・人物・顧客ロゴを追加するときは利用権と出典を確認する。
- 既存のcanonical、確認用メタデータ、公開URL、ストアURL、データ取り扱いの約束を無断で変えない。
- PIIを計測属性、URL、ログ、PRのスクリーンショットへ含めない。

## 9. 計測の扱い

現在は計測用コードを接続できる状態であり、GA4の収集開始・管理画面の受信確認は未実施。全ページの閲覧分母を取得する仕組みも、この9イベントとは別途必要になる。

`source` はフォームの設置場所で、全相談がトップに集まる現在はhome。流入元・広告・直前のCTAではない。テーマは固定のservice値だけを扱い、個人情報やraw URLを送らない。previewでもイベント内URLは固定の本番URLになるため、将来のタグ導入時は環境別に収集を制御する。

運用、9イベントの正確な契約、営業ステージ、分母、重複・コホート、PIIを含めないCRMとの集計、5名の理解度テストは [MEASUREMENT-PLAN.md](docs/redesign-20261102/MEASUREMENT-PLAN.md) を参照。

## 10. 調査・検証資料

各資料の対象commit・取得環境・未検証事項を合わせて読む。過去のレポートを、現在のcommitの合格証拠として自動的に流用しない。

| 資料 | 内容 |
|---|---|
| [BASELINE.md](docs/redesign-20261102/BASELINE.md) | 変更前診断、優先度、採用コンセプト、素材 |
| [BENCHMARKS.md](docs/redesign-20261102/BENCHMARKS.md) | 公式の受賞確認とBtoBベンチマーク |
| [REVIEW-BEFORE.md](docs/redesign-20261102/REVIEW-BEFORE.md) | 25画面・DOMに基づく変更前の補助評価 |
| [REVIEW-1-CODE.md](docs/redesign-20261102/REVIEW-1-CODE.md) | 初回コードレビュー |
| [REVIEW-1-VISUAL.md](docs/redesign-20261102/REVIEW-1-VISUAL.md) | 初回画面レビュー |
| [STATIC-QA.md](docs/redesign-20261102/STATIC-QA.md) | 配色・意味構造・SEO等の静的検証 |
| [BROWSER-CHECKS.md](docs/redesign-20261102/BROWSER-CHECKS.md) | 実ブラウザの操作・導線検証と制約 |
| [contact-and-analytics.md](docs/redesign-2026-11-02/contact-and-analytics.md) | フォーム・API・計測の実装と18テストの記録 |
| [MEASUREMENT-PLAN.md](docs/redesign-20261102/MEASUREMENT-PLAN.md) | 公開後の計測・有効相談・商談・受注の運用計画 |

Lighthouseの最新結果は、対象CI runのartifactと生成されたsummaryを確認する。実通知、GA4収集、実ユーザーの理解度、実機Safari／Androidや支援技術の確認など、未検証のものは実施したと記載しない。
