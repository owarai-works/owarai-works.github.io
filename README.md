# お笑い道場 なんでやねん 公式ホームページ

GitHub Pages でそのまま公開できる、ふつうの HTML のホームページです（作るための道具はいりません）。

## 引き継ぎ（2026-11-04 時点）
- **公開先**：https://owarai-works.github.io/ （公開リポジトリ `owarai-works/owarai-works.github.io` の main。GitHub Pages）。
- **元のファイル**：ゲームのリポジトリ `owarai-works/owarai-dojo` のブランチ `claude/determined-ride-5ngwy8` の `homepage/`。直したら homepage/ にコミット → 公開リポジトリに `cp -r homepage/. ../owarai-works.github.io/` して push（両方に入れる）。
  - 公開リポジトリだけにあるもの：`assets/data/ranking.json`（毎日19時の自動更新が書く。homepage/ には置かない）。
- **今は「準備中」**：`assets/js/prep.js` の `PREP = true`。全ページ「ただいま準備中！」の幕・検索に出さない（noindex）。運営が中身を見る：`?preview=nandeyanen`（そのタブのあいだだけ）。**公開するとき**は「準備中の幕（公開前）」の手順。
- **毎回の決まり（ユーザーの希望）**：返事は日本語・初心者向け。更新したら返事の最後に毎回ホームページのリンク。幅390px・320px・パソコンで確かめる（Playwright＋`python3 -m http.server`）。直したら HTML の `?v=` を新しくする（古いファイルが残らないように）：`for f in *.html; do sed -i -E "s#(assets/(js|css)/[a-z0-9-]+\.(js|css))\?v=[0-9]+\"#\1?v=$(date +%m%d%H%M)\"#g" $f; done`
- **デザインの決まり**：明るい爆笑お笑い（クリーム・黄・朱・太い黒ふち）。文字は重ねない・影やふち取りで読みにくくしない（読ませる文は Noto Sans JP）。芸名は出さない。殿堂はイラストのあるお題だけ。運営者名は「ライトルーム お笑い運営部」。黒田・紫音はキャラ紹介に出さない。
- **スケジュールのタスク**：「お笑い道場 番付・殿堂の更新」（trig_01RQjzWrXThVZFmS3oGexnFB、毎日19時 日本時間）。ゲームのデータベースを読むだけ → `tools/build_ranking.py` → ranking.json を push。
  - **⚠ 直すこと**：11-03 の実行は「push が 403（このリポジトリがタスクのセッションに入っていない）」で失敗していた。タスクの設定（claude.ai/code の Scheduled tasks）で、リポジトリ `owarai-works/owarai-works.github.io` を追加する必要がある。
- **アクセス解析**：Google アナリティクス `G-VZ29R3E1TW`（全ページの head）。Search Console は登録済み（アナリティクスのタグで確認）。公開したらサイトマップ `sitemap.xml` を送る。

### まだのこと・決めてもらうこと
1. **ゲームの更新の反映**（ゲームは版1219。ホームページは版1074ごろの内容）：①ミニゲームが16→**15種類**（早押しパネル f25 がなくなった）→「16」の文字と画面を直す（index・game・fun2 の実況・faq-bot・pm バッジ・facts の data-count）②道場破り→「**格闘王への道**」の紹介 ③段位アイコン・称号プレート（img/ic/dan_sheet・ttl_sheet）④対戦画面の写真を撮り直し ⑦タイトルの絵（img/kv.jpg）が新しい。ユーザーの答え待ち。
2. **X の自動投稿**：お笑い道場の公式 X アカウントをユーザーが作る → X の開発者キー4つ（環境の Network secrets：`X_API_KEY`・`X_API_SECRET`・`X_ACCESS_TOKEN`・`X_ACCESS_SECRET`、`api.x.com` を許可）。投稿の種類・時間・下書きにするかはユーザーの答え待ち。
3. **Google ログインの会員登録**（Firebase）：①〜⑥の案を出した。ユーザーの答え待ち。
4. 問い合わせのメールアドレス（`SITE.contact`）・App Store の URL（`SITE.appStoreUrl`）は、決まったら入れる。

## ページ
| ファイル | 中身 |
|---|---|
| index.html | HOME（メイン画面・こんな人ほどハマる・あそぶ・お題合戦・番付と殿堂・3つの売り・お題・ミニゲーム・お知らせ・みどころ・キャラ・ムービー） |
| news.html / article.html | お知らせの一覧 / 1つずつの記事（`article.html?id=記事のid`） |
| game.html | ゲーム紹介（お題合戦・遊び方・お題・番付・対戦・お笑いへの道・ミニゲーム・漫画など） |
| characters.html | キャラクター紹介（気猫・葵・百萌。絵は晴れ着・アイドル・メイド、ボイス、つつくと反応） |
| banzuke.html | お題合戦ランクマッチ 番付（週間・月間・永世の上位50。記録がないあいだは見本） |
| hall.html | みんなの殿堂（イラストのお題だけ・30件。記録がないあいだは見本） |
| play.html | あそぶ（ハリセン連打・今日のお題・タイプ診断・ツッコミタイミング・おみくじ） |
| support.html | よくある質問・質問ボット・お問い合わせ（App Store の「サポートURL」） |
| privacy.html / terms.html | プライバシーポリシー（App Store の URL）／利用規約 |
| 404.html | ページが見つからないとき |

## よく書きかえる所
- **お知らせを足す**：`assets/js/news-data.js` のいちばん上に1つ足す。
- **問い合わせのメール・運営の名前・App Store のURL**：`assets/js/site.js` のいちばん上の `SITE`。
  - `contact` を入れると、プライバシーポリシー・利用規約・サポートのページに出ます（空のあいだは「準備中」）。
  - `appStoreUrl` を入れると、「App Store 準備中」のボタンが本物のリンクに変わります。
- **効果音**：`assets/js/sfx.js`（押すとハリセン・拍子木・ポン、マウスを乗せるとポコッ。BGM を OFF にすると鳴らない）
- **BGM**：`assets/bgm/title.mp3`（ゲームのメニュー画面の曲「開演のテーマ」）。右下のボタンで ON/OFF。はじめから ON（ブラウザの決まりで、最初に画面をタップしたときに流れ始める）。音量は右下の🔊のつまみ（はじめはゲームと同じ 0.5。開いて3秒で閉じる。`ow-bgm-vol` に保存）。ゲームと同じく、頭とおしりの無音を切って終わりの1.2秒を次の頭と重ねてループ（`XF`）。

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
- SEO：各ページの title・description・OGP・canonical・構造化データ（JSON-LD）、`sitemap.xml`・`robots.txt`。

## 見てるだけで楽しい演出（`assets/js/fun.js`）
- 背景に2頭身のシスターズと小物（`assets/img/fun/`、元の素材シートは `docs/homepage/gen/sheet/`）がふわふわ降る。
- 何もないところを押すと「なんでやねん！」とハリセンの衝撃。画面上の「笑いメーター」。ときどきシスターズがひょっこり顔を出して体験コーナーへさそう。スマホは「30秒で体験する」ボタン。
- ミニゲーム16種類の画面は `assets/img/mg/`（ゲームを動かして撮影）。

## アクセス解析
- Google アナリティクス（測定 ID `G-VZ29R3E1TW`）を全ページの `<head>` に入れた。見るのは https://analytics.google.com （あなたの Google アカウントだけ）。
- 送っているイベント：`demo_open`・`demo_start`・`demo_finish`（体験コーナー）、`share`（結果のポスト）、`store_click`（App Store）、`movie_play`、`bot_ask`（質問ボット）、`peek_click`・`cta_demo_click`、`gate_open`、`collab_click`、`bgm_toggle`、`button_click`。
- Search Console の確認タグは、もらったら各ページの `<head>` に入れる。

## 準備中の幕（公開前）
- `assets/js/prep.js` の `PREP = true` のあいだは、どのページも「ただいま準備中！」だけが出る。BGM も流さない。
- 運営だけ中身を見る：`https://owarai-works.github.io/?preview=nandeyanen` で開く（そのタブを閉じるまで幕なし。タブを閉じたら、また準備中の幕が出る）。
- 準備中は全ページ `<meta name="robots" content="noindex,nofollow">`（検索に出さない）。
- **公開するとき**：`PREP = false` にして、robots を元に戻す（index.html・game.html・characters.html・news.html・support.html・privacy.html・terms.html は `index,follow,max-image-preview:large`、article.html と 404.html は `noindex,follow`）。

## 番付・殿堂（ゲームと連動・毎日自動更新）
- 表示：トップの「ゲームと連動！番付と殿堂」（`assets/js/ranking.js`）が `assets/data/ranking.json` を読む。芸名は出さない（ユーザーの希望）。
- `assets/data/ranking.json` は **公開リポジトリ owarai-works.github.io にだけ**ある（毎日の自動更新が書く）。homepage/ からコピーするときに上書きしないよう、homepage/ には置かない。
- 作り方：ゲームのデータベース（公開先 https://claude.ai/artifact/W4qyooRmevxFq3XxpyfxM3 ）を ArtifactData で読んで out_dir に保存 → `python3 -I tools/build_ranking.py <dump> assets/data/ranking.json`。
  - boards（limit 1000・全部）・hall（score の降順に300件）・news/ban。
- 毎日19時ごろ、スケジュールのタスク「お笑い道場 番付・殿堂の更新」が自動でやる。
- 専用ページ：`banzuke.html`（お題合戦ランクマッチ 番付・上位50・横綱/大関/関脇/小結/前頭/十両）、`hall.html`（みんなの殿堂・30件・種類でしぼれる）。
- 本物の記録がないあいだは、`ranking.js` の中の見本（「見本」と表示）を出す。本物が入ると自動で入れかわる。
- 殿堂は**イラストのあるお題だけ**（ユーザーの希望。build_ranking.py で絵のない行は外す）。
- 殿堂のお題の絵：ゲームのお題の絵600枚を `assets/img/odai/`（480px・webp）に入れた。`tools/odai_pics.json` がお題のid（sid）→ファイル名。`build_ranking.py` が殿堂の行に `pic` を付ける。ゲームに絵のお題を足したら、ここにも足す。

## あそぶ（`play.html`・`assets/js/play.js`）
- A ハリセン連打（10秒・番付・自己ベストは端末に保存）／B 今日のお題（`assets/data/daily.json`＝ゲームの絵のお題100問と四択の上位2つ。日付で毎日かわる）／C お笑いタイプ診断（5問）／D ツッコミ・タイミング（3本）／E 笑い運おみくじ（1日1回）。結果は X にポストできる。
- トップに「今日のお題」と4つの入口。
- F：キャラ紹介で大きな絵をつつくと、表情（`assets/img/ex/`）とボイスで反応（`fun.js` の owCharaPoke）。
- G：隠し要素。トップのロゴ（メイン画面・下の欄）を続けて5回押すと、シスターズの漫才（`fun.js`）。

## 装飾・演出（`assets/js/fun2.js`）
- 1 欄が出るたびに客席の笑い声（合成・BGMがONのときだけ）と「ワハハ」／2 画面左下でシスターズが欄に合わせて実況／4 時間帯（朝・昼・夕・夜・夜中）で背景と提灯、夜中は百萌が居眠り／5 季節の飾り（春＝桜・夏＝花火・秋＝紅葉・冬＝雪、正月・ハロウィン・クリスマスはロゴの横に印）／6 ページを移るときの幕（site.js の go から owCurtainClose/Open）／8 1分20秒見た人へのお礼と紙吹雪（見はじめて20秒でメニューの下に横いっぱいの帯が出て60秒カウントダウン。3人×3種類＝9種類からランダム・1回の訪問で1度）。
