# cyberknock.jp 独自ドメイン移行チェックリスト（2026-11-12）

## 変更の目的

Cyber Knockの法人向け公式サイトを `https://cyberknock.jp` に統一する。既存のCloudflare Pages配信 `cyberknock.pages.dev` と同じコンテンツ・問い合わせFunctionを使い、B2Cの `ai-sportstrainer.com` は変更しない。

2026-11-12のJPRS WHOISで `CYBERKNOCK.JP` の登録済み・Active、XServerネームサーバー5つを確認。取得日2026-11-12、有効期限2027-11-30。確認時にAレコードが解決できず、HTTPSサイトは未公開だった。

## Cloudflare Pagesへの接続（ダッシュボード操作）

1. ドメインのDNSに既存レコードがある場合は記録する。MX・TXT・SPF・DKIM等を使っている場合、Cloudflare側への移行前に取りこぼしがないか確認する。
2. Cloudflareアカウントで `cyberknock.jp` を新規ゾーンとして追加。Freeプランでも可。表示されたCloudflareのネームサーバー2件をそのまま控える（この文書に値は作り込まない）。
3. XServerアカウントのドメイン管理 `cyberknock.jp` → ネームサーバー設定で、先ほど表示された **自分のCloudflareアカウント固有の2件** に変更する。XServerの現在の `ns1.xserver.jp` などはそのまま使わない。
4. Cloudflareゾーンが Active になったら、Workers & Pages → `cyberknock` の既存Pagesプロジェクト → Custom domains → Set up a domain → `cyberknock.jp` を追加・有効化。必要なDNSレコードと証明書の状態を確認する。
5. `www.cyberknock.jp` を使う場合は別途Custom domainsとDNS・リダイレクトを設定し、canonicalは `https://cyberknock.jp` を優先する。設定未完了なら無理にwwwを案内しない。

## WHOISプライバシー

2026-11-12のWHOISで登録者名が表示されていた。XServerの「Whois代理公開」とは別の `.jp` 専用「Whois登録者情報非表示設定」を確認し、必要な場合に有効化する。登録内容は正確なまま維持する。

公式: https://www.xdomain.ne.jp/manual/man_domain_about_whois.php

## コードと公開ゲート

- 本PRにてmetadataBase、canonical、OG URL、JSON-LD、robots/sitemap URL、GA4の安全なpage_locationを `https://cyberknock.jp` に変更する。
- `npm run check`（型検査、全テスト、静的ビルド）と生成HTML 10ページ、robots/sitemapを検証する。
- 本番へのマージ・配信は明示承認後のみ。XServerで取得したことだけではサイトは自動的に公開されない。
- 実フォーム送信や外部メッセージは承認なく実施しない。

## 本番公開後の検証

1. `https://cyberknock.jp/`、`/ai-development`、`/sports-dx`、`/insights`、`/contact`相当の導線に問題がないか確認する（問い合わせはトップページ内 `/#contact`）。
2. `/robots.txt` と `/sitemap.xml` のHTTP 200、すべての `<loc>` の独自ドメイン一致、全ページのcanonical一致を検証する。
3. 証明書・モバイルでの表示・フォーカス・フォーム検証・Cloudflare Pages Functionの存在を確認。実通知到達は実送信の事前承認後に検証する。
4. Search Consoleで `sc-domain:cyberknock.jp` を確認（DNS TXTによる所有権確認）し、`https://cyberknock.jp/sitemap.xml` を送信する。新サイトのインデックスと検索流入を28日・56日後に評価する。
5. 旧 `harutowatanabe.com` は解約予定。期限まで維持できる場合は、Cloudflare側で旧ホストから同パスの `cyberknock.jp` への301転送を検討し、リダイレクトの循環を避ける。サイト共通の `_redirects` に無条件のホスト変換ルールは入れない。
6. `cyberknock.pages.dev` が公開状態でもcanonicalは `cyberknock.jp` に統一し、正式案内でPagesの配信URLを使わない。

## 制約

Cloudflareゾーン追加、XServerネームサーバー変更、GSC所有権確認は外部アカウントでの操作が必要。これらの管理画面が未確認の段階では、接続・公開済みと主張しない。
