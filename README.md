# お笑い道場 なんでやねん 公式ホームページ

GitHub Pages でそのまま公開できる、ふつうの HTML のホームページです（作るための道具はいりません）。

## ページ
| ファイル | 中身 |
|---|---|
| index.html | HOME（メインビジュアル・お知らせ・みどころ・キャラ・ムービー） |
| news.html / article.html | お知らせの一覧 / 1つずつの記事（`article.html?id=記事のid`） |
| game.html | ゲーム紹介（遊び方・お題・番付・対戦・お笑いへの道・漫画など） |
| characters.html | キャラクター紹介（気猫・葵・百萌・黒田・紫音） |
| support.html | よくある質問・お問い合わせ（App Store の「サポートURL」に使う） |
| privacy.html | プライバシーポリシー（App Store の「プライバシーポリシーURL」に使う） |
| terms.html | 利用規約 |
| 404.html | ページが見つからないとき |

## よく書きかえる所
- **お知らせを足す**：`assets/js/news-data.js` のいちばん上に1つ足す。
- **問い合わせのメール・運営の名前・App Store のURL**：`assets/js/site.js` のいちばん上の `SITE`。
  - `contact` を入れると、プライバシーポリシー・利用規約・サポートのページに出ます（空のあいだは「準備中」）。
  - `appStoreUrl` を入れると、「App Store 準備中」のボタンが本物のリンクに変わります。
- **効果音**：`assets/js/sfx.js`（押すとハリセン・拍子木・ポン、マウスを乗せるとポコッ。BGM を OFF にすると鳴らない）
- **BGM**：`assets/bgm/title.mp3`（ゲームのメニュー画面の曲「開演のテーマ」）。右下のボタンで ON/OFF。はじめから ON（ブラウザの決まりで、最初に画面をタップしたときに流れ始める）。音量は `site.js` の `VOL`（今は 0.22）。ゲームと同じく、頭とおしりの無音を切って終わりの1.2秒を次の頭と重ねてループ（`XF`）。

## 絵・動画
- `assets/img/hero.webp`：パソコンのメイン画像（Higgsfield で作成。元は `docs/homepage/gen/hero_a.png`）
- `assets/vid/pv.mp4`：ムービー（Vidu Q4 で hero_a から作成）
- `assets/css/pop.css`：明るい「爆笑お笑い」テーマ（クリーム・黄色・朱、太い黒ふち＋ずらした影）。ほかのCSSのあとに読む
- `assets/vid/kv_sp.mp4`：スマホのメイン動画（ゲームのタイトル動画）
- そのほかは、ゲームの絵（`img/`）を小さくしたもの。ゲームの画面写真 `ss_*.webp` は Playwright で撮影。

## お問い合わせボット（葵）
- `assets/js/faq-bot.js`：よくある質問から一番近い答えを返す（お金はかからない）。全ページの左下に「質問する」ボタン、サポートのページには中に表示。
- 答えを足す：`faq-bot.js` の `FAQ` に `{q: 見出し, k: [ひっかける言葉], a: 答え}` を1つ足す。
- 本物のAIにする（あとで）：サーバー（例：Cloudflare Workers）で Claude API を呼ぶ口を作り、`site.js` の `SITE.aiEndpoint` にそのURLを入れる。よくある質問で答えられないときだけ `{q, history}` を POST し、`{answer}` を表示する。APIキーはサーバー側だけに置く（ページに書かない）。

## ページの切りかえ（BGM を止めない）
- `site.js` の最後：サイトの中のリンクを押すと、ページを読み直さずに `<main>` だけ入れかえる（BGM が続く）。新しいページを作ったら、`<main>` の中に中身、`<body data-page="…">` を付ける。ページ専用の `<script>`（src なし）は入れかえたあとに実行される。
- 体験コーナー：`assets/js/demo.js`（お題合戦・大喜利・漫画セリフの四択。AIは使わない）。
- SEO：各ページの title・description・OGP・canonical・構造化データ（JSON-LD）、`sitemap.xml`・`robots.txt`。

## 見てるだけで楽しい演出（`assets/js/fun.js`）
- 背景に2頭身のシスターズと小物（`assets/img/fun/`、元の素材シートは `docs/homepage/gen/sheet/`）がふわふわ降る。
- 何もないところを押すと「なんでやねん！」とハリセンの衝撃。画面上の「笑いメーター」。ときどきシスターズがひょっこり顔を出して体験コーナーへさそう。スマホは「30秒で体験する」ボタン。
- ミニゲーム16種類の画面は `assets/img/mg/`（ゲームを動かして撮影）。

## アクセス解析
- Google アナリティクス（測定 ID `G-VZ29R3E1TW`）を全ページの `<head>` に入れた。見るのは https://analytics.google.com （あなたの Google アカウントだけ）。
- 送っているイベント：`demo_open`・`demo_start`・`demo_finish`（体験コーナー）、`share`（結果のポスト）、`store_click`（App Store）、`movie_play`、`bot_ask`（質問ボット）、`peek_click`・`cta_demo_click`、`gate_open`、`collab_click`、`bgm_toggle`、`button_click`。
- Search Console の確認タグは、もらったら各ページの `<head>` に入れる。
