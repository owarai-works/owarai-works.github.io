/* =========================================================
   お問い合わせボット（葵が答える）
   ・今は「よくある質問」から一番近い答えを探して返す（お金はかからない）
   ・あとで本物のAIにするときは、site.js の SITE.aiEndpoint に
     サーバーのURLを入れる。よくある質問で答えられないときだけ、
     そこへ {q, history} を POST し、{answer} を受け取って表示する。
   ・答えを足すときは、下の FAQ に { q, k, a } を1つ足す。
       q＝質問の見出し / k＝ひっかける言葉（ひらがな・カタカナどちらでも可）/ a＝答え（HTML可）
   ========================================================= */
(() => {
  if (window.__owFaq) return; window.__owFaq = true;  /* 2回読みこまれても1回だけ動く（BGMが2つ鳴らないように） */
  const FAQ = [
    {q: "お題合戦ってなに？", k: ["お題合戦", "おだいがっせん", "合戦", "がっせん", "点数勝負", "本先取", "目玉"], a: "<b>お題合戦</b>はこのゲームの一番の目玉や！2人に同じお題が出て、30秒以内に答える。AIの点数が高い方が1本取って、先に決めた本数を取ったら勝ちや。<b>ランクマッチ対応</b>で、友達やCPUとも対戦できるで。<a href=\"game.html#gassen\">くわしくはこちら</a>"},
    {q: "どんなゲーム？", k: ["どんなゲーム", "ゲーム内容", "なにができる", "何ができる", "遊び方", "あそびかた", "概要", "どういう"], a: "お題にボケたりツッコんだりして、<b>AIが100点満点で採点</b>するお笑いゲームやで！<br>大喜利対戦、お笑いへの道、ランクマッチ、番付など、遊び方がいっぱいあるで。くわしくは <a href=\"game.html\">ゲーム紹介</a> を見てな。"},
    {q: "お金はかかる？無料？", k: ["無料", "むりょう", "ただ", "お金", "料金", "値段", "課金", "有料", "いくら"], a: "基本は<b>無料</b>で遊べるで。アプリ版では、コインなどをアプリ内で買えるようにする予定や。買わんでも、ログインボーナスやごほうびでコインはたまるで。"},
    {q: "iPhoneアプリはいつ出る？", k: ["アプリ", "iphone", "アイフォン", "appstore", "app store", "いつ", "配信", "リリース", "ダウンロード"], a: "今、App Store での配信に向けて準備中や！決まったら <a href=\"news.html\">お知らせ</a> で発表するから、ちょっと待っててな。"},
    {q: "Androidで遊べる？", k: ["android", "アンドロイド", "グーグルプレイ", "googleplay", "スマホ"], a: "まずは iPhone アプリの準備を進めてるで。Android 版は、決まったらお知らせするな。"},
    {q: "声で答えられない（マイク）", k: ["マイク", "声", "こえ", "音声", "しゃべ", "話せない", "認識"], a: "声で答えるには<b>マイクの許可</b>がいるで。端末の設定でマイクを許可してな。LINE や Instagram の中のブラウザやと使えへんことがあるから、そのときは Safari などで開くか、文字入力・四択で遊んでな。"},
    {q: "採点に時間がかかる", k: ["採点", "遅い", "おそい", "時間がかか", "待た", "進まない", "固まる", "フリーズ"], a: "採点はネットを使ってAIがやってるから、混んでると時間がかかることがあるねん。電波のええ所で、もう一回ためしてみてな。"},
    {q: "点数がおかしい・同じ答えで点がちがう", k: ["点数", "てんすう", "おかしい", "低い", "ひくい", "ちがう", "変わる", "不公平", "納得"], a: "点数はAIの判定やから、同じ答えでも点数が変わることがあるねん。かんにんな！何回も挑戦して、AIを笑わせてな。"},
    {q: "記録が消えた", k: ["消えた", "きえた", "なくなった", "データ", "引き継", "ひきつぎ", "機種変", "セーブ", "リセット"], a: "記録が消えてしもたんやね…。わかる範囲で調べるから、<b>芸名</b>と<b>いつごろ消えたか</b>を添えて、下のお問い合わせ先に連絡してな。"},
    {q: "番付（ランキング）について", k: ["番付", "ばんづけ", "ランキング", "順位", "載らない", "のらない", "反映"], a: "番付は<b>週間・月間・永世</b>があって、チャレンジ・エンドレス・お笑いへの道・格闘・皆勤の部門ごとに分かれてるで。週間は毎週、月間は毎月入れかわるから、いつからでも1位を目指せるで！"},
    {q: "ランクマッチ・対戦のしかた", k: ["ランクマッチ", "対戦", "たいせん", "バトル", "格闘", "かくとう", "勝負", "マッチング"], a: "タイトル画面の<b>格闘モード</b>から、CPU戦・道場破り・ランクマッチ・友達と勝負が選べるで。同じお題で答えて、ウケた一言で相手の体力をけずるんや！"},
    {q: "友達と対戦したい", k: ["友達", "ともだち", "フレンド", "招待", "しょうたい", "line", "ライン"], a: "格闘モードの「<b>友達と勝負</b>」から、LINE などで招待リンクを送れるで。ルールも決められるし、スタンプで会話もできるで。"},
    {q: "お笑いへの道とは？", k: ["お笑いへの道", "道", "マス", "ステージ", "ボス", "エリア", "すごろく"], a: "マスを進んでステージをクリアしていく修行の旅や！5ステージ目には中ボス、エリアの最後にはボスが待ってるで。ライフがなくなっても、道場で修行したらまた挑戦できるで。"},
    {q: "お題の種類は？", k: ["お題", "おだい", "種類", "大喜利", "あるある", "ギャグ", "あだ名", "しばり", "漫画セリフ", "インタビュー"], a: "お題は<b>11種類</b>あるで！ボケ・ツッコミ・MIX・大喜利・あるある・突撃インタビュー・あだ名つけ・一発ギャグ・しばりボケ・漫画セリフ・全部。<a href=\"game.html#odai\">お題の一覧</a> も見てな。"},
    {q: "漫画は読める？", k: ["漫画", "まんが", "マンガ", "ストーリー", "読めない", "何話"], a: "オリジナル漫画（30話・随時更新）が読めるで。お笑いへの道でマスを制覇すると、1話ずつもらえるんや。"},
    {q: "コインの使い道", k: ["コイン", "こいん", "アイテム", "使い道", "ためる", "増やす"], a: "コインは、アイテムや漫画、ライフの回復などに使えるで。ログインボーナスやステージのごほうびでもらえるで。"},
    {q: "コラボイベントについて", k: ["コラボ", "イベント", "堕天使", "期間限定", "天使"], a: "今は「<b>希望の堕天使</b>」とのコラボを開催中や！全30ステージのコラボの道で、最後のボスを倒すとギャラリーが開くで。"},
    {q: "キャラクターについて", k: ["キャラ", "きねこ", "気猫", "あおい", "葵", "ももえ", "百萌", "シスターズ", "声優", "誰"], a: "うちら<b>お笑いシスターズ</b>は、気猫・葵（うち）・百萌の3人や！<a href=\"characters.html\">キャラクター紹介</a> で、アイドルやメイドの姿も見てってな。"},
    {q: "不適切な人を通報したい", k: ["通報", "つうほう", "迷惑", "荒らし", "悪口", "不適切", "下ネタ", "嫌がらせ", "いやがらせ"], a: "番付などの一覧で、その人の<b>芸名をタップ</b>すると通報できるで。通報した人は、あんたの画面に出えへんようになる。運営が確認して対応するからな。"},
    {q: "芸名を変えたい", k: ["芸名", "名前", "なまえ", "ニックネーム", "変更", "かえたい"], a: "芸名はタイトル画面の入力欄から変えられるで。ただ、番付の確定した記録はそのときの芸名で残るし、短い期間に何回も変えられへん決まりがあるで。"},
    {q: "データを消したい・退会したい", k: ["退会", "削除", "さくじょ", "消したい", "アカウント", "個人情報"], a: "番付・殿堂などのデータを消したいときは、<b>芸名</b>を添えて下のお問い合わせ先に連絡してな。本人確認のあと消すで。くわしくは <a href=\"privacy.html\">プライバシーポリシー</a> を見てな。"},
    {q: "返金してほしい", k: ["返金", "へんきん", "払い戻", "間違えて買", "まちがえて買", "購入", "課金トラブル"], a: "アプリ内での購入の返金は、<b>Apple のルール</b>で受け付けてるで。購入に困ったことがあったら、購入日と内容を添えて、下のお問い合わせ先に連絡してな。"},
    {q: "不具合（バグ）を見つけた", k: ["バグ", "不具合", "ふぐあい", "動かない", "うごかない", "エラー", "落ちる", "表示がおかしい", "おかしい画面"], a: "教えてくれてありがとう！<b>機種・OSのバージョン・起きた画面・やったこと</b>を添えて、下のお問い合わせ先に送ってな。直すときの大事なヒントになるで。"},
    {q: "BGMや音を消したい", k: ["音", "bgm", "うるさい", "ミュート", "音量", "効果音", "曲"], a: "ゲームではオプションの「BGM」「効果音」で切りかえられるで。このホームページの曲は、右下の <b>BGM</b> ボタンで ON/OFF できるで。"},
    {q: "子どもでも遊べる？", k: ["子ども", "こども", "子供", "小学生", "中学生", "年齢", "何歳"], a: "だれでも遊べるで！13歳未満の人は、おうちの人といっしょに規約を読んで、OKをもらってから遊んでな。芸名や答えに本名や学校名は書いたらあかんで。"},
    {q: "取材・コラボの依頼", k: ["取材", "しゅざい", "コラボ依頼", "依頼", "ビジネス", "提携", "メディア", "掲載"], a: "取材やコラボのご相談は、下のお問い合わせ先にメールで連絡してください。運営から返事します。"}
  ];
  const kata2hira = s => s.replace(/[ァ-ヶ]/g, c => String.fromCharCode(c.charCodeAt(0) - 0x60));
  const norm = s => kata2hira(String(s).normalize("NFKC").toLowerCase()).replace(/[\s、。，．・！？!?「」『』（）()\-ー〜~]/g, "");
  const grams = s => { const g = new Set(); for (let i = 0; i < s.length - 1; i++) g.add(s.slice(i, i + 2)); return g; };
  FAQ.forEach(f => { f.nk = f.k.map(norm); f.g = grams(norm(f.q + f.k.join(""))); });
  const find = text => {
    const t = norm(text), tg = grams(t); let best = null, bs = 0;
    for (const f of FAQ) {
      let s = 0; f.nk.forEach(k => { if (k && t.includes(k)) s += 2 + Math.min(k.length, 6) * .5; });
      let hit = 0; tg.forEach(x => { if (f.g.has(x)) hit++; }); s += tg.size ? hit / tg.size * 3 : 0;
      if (s > bs) { bs = s; best = f; }
    }
    return bs >= 2.6 ? best : null;
  };

  const contactHTML = () => window.SITE && SITE.contact ? `<a href="mailto:${SITE.contact}">${SITE.contact}</a>` : "（メールアドレスは準備中です）";
  const FALLBACK = () => `ごめんな、その質問はうちには分からへんかった…。<br>運営の人が答えるから、<b>お問い合わせ先</b>に送ってな。<br>メール：${contactHTML()}<br><small>芸名・機種・くわしい内容を書いてくれると早いで。</small>`;
  const GREET = "まいど！サポート担当の<b>水野葵</b>や。<br>ゲームのことで困ったら、なんでも聞いてな。下のボタンを押すか、質問を書いてな！";
  const CHIPS = ["お題合戦ってなに？", "どんなゲーム？", "iPhoneアプリはいつ出る？", "声で答えられない（マイク）", "記録が消えた", "ランクマッチ・対戦のしかた", "不適切な人を通報したい"];

  const css = `
.fb-open{position:fixed;left:14px;bottom:14px;z-index:61;display:flex;align-items:center;gap:8px;padding:5px 16px 5px 5px;border-radius:999px;background:#fff;border:3px solid var(--ink);box-shadow:3px 3px 0 var(--ink);font-weight:900;font-size:14px;color:var(--ink);transition:transform .25s}
.fb-open:hover{transform:translate(-1px,-2px)}
.fb-open img{width:38px;height:38px;border-radius:50%;border:2px solid var(--ink);background:#dbe9ff}
.fb-open small{display:block;font-size:10px;color:var(--shu);line-height:1}
.fb{position:fixed;left:14px;bottom:14px;z-index:90;width:min(380px,calc(100vw - 28px));height:min(580px,calc(100svh - 90px));display:flex;flex-direction:column;background:#fff;border:3px solid var(--ink);border-radius:18px;box-shadow:7px 7px 0 var(--ink);overflow:hidden;transform-origin:left bottom;transform:scale(.6);opacity:0;pointer-events:none;transition:transform .3s var(--ease),opacity .25s}
.fb.open{transform:none;opacity:1;pointer-events:auto}
.fb-hd{display:flex;align-items:center;gap:10px;padding:10px 12px;background:linear-gradient(135deg,#2f7fe0,#16b3c8);color:#fff;border-bottom:3px solid var(--ink)}
.fb-hd img{width:42px;height:42px;border-radius:50%;border:2px solid #fff;background:#dbe9ff}
.fb-hd b{display:block;font-family:var(--f-disp);font-weight:400;font-size:17px;letter-spacing:.04em;text-shadow:2px 2px 0 var(--ink)}
.fb-hd small{font-size:11px;opacity:.95}
.fb-x{margin-left:auto;width:34px;height:34px;border-radius:50%;background:#fff;color:var(--ink);border:2px solid var(--ink);font-size:18px;line-height:1}
.fb-log{flex:1;overflow-y:auto;padding:14px 12px;display:flex;flex-direction:column;gap:10px;background:radial-gradient(circle,rgba(47,127,224,.08) 1.5px,transparent 2px) 0 0/16px 16px,#f6f9ff}
.fb-m{max-width:86%;padding:10px 13px;border-radius:14px;font-size:14px;line-height:1.7;border:2px solid var(--ink);word-break:break-word}
.fb-m a{color:var(--shu-d);text-decoration:underline}
.fb-m.bot{align-self:flex-start;background:#fff;border-top-left-radius:4px;box-shadow:2px 2px 0 var(--ink)}
.fb-m.me{align-self:flex-end;background:var(--gold);border-top-right-radius:4px;box-shadow:2px 2px 0 var(--ink)}
.fb-m.typing{color:var(--muted)}
.fb-chips{display:flex;flex-wrap:wrap;gap:6px;align-self:flex-start;max-width:100%}
.fb-chips button{padding:5px 11px;border-radius:999px;border:2px solid var(--ink);background:#fff;font-size:12px;font-weight:700;color:var(--ink)}
.fb-chips button:hover{background:var(--gold)}
.fb-f{display:flex;gap:8px;padding:10px;border-top:3px solid var(--ink);background:#fff}
.fb-f input{flex:1;min-width:0;padding:10px 12px;border:2px solid var(--ink);border-radius:10px;font:inherit;font-size:16px}
.fb-f button{padding:0 16px;border-radius:10px;border:2px solid var(--ink);background:var(--shu);color:#fff;font-weight:900;box-shadow:2px 2px 0 var(--ink)}
.fb-note{padding:0 12px 8px;font-size:10px;color:var(--muted);background:#fff}
.fb-inline{position:relative;left:auto;bottom:auto;width:100%;height:560px;transform:none;opacity:1;pointer-events:auto;z-index:1}
body[data-page="support"] .fb-open{display:none}
@media (max-width:520px){.fb-open span{display:none}.fb-open{padding:4px}.fb-open img{width:38px;height:38px}}
`;
  const st = document.createElement("style"); st.textContent = css; document.head.append(st);

  const build = inline => {
    const el = document.createElement("section");
    el.className = "fb" + (inline ? " fb-inline" : ""); el.setAttribute("aria-label", "お問い合わせボット");
    el.innerHTML = `<header class="fb-hd"><img src="assets/img/face_aoi.webp" alt=""><div><b>サポート担当 葵</b><small>よくある質問に すぐ答えるで</small></div>${inline ? "" : '<button class="fb-x" type="button" aria-label="閉じる">×</button>'}</header>
      <div class="fb-log" aria-live="polite"></div>
      <form class="fb-f"><input type="text" maxlength="200" placeholder="質問を書いてな（例：アプリはいつ？）" aria-label="質問"><button type="submit">送る</button></form>
      <p class="fb-note">自動で答えています。答えがちがうときは、お問い合わせ先に送ってください。</p>`;
    const log = el.querySelector(".fb-log"), form = el.querySelector("form"), input = form.querySelector("input");
    const history = [];
    const add = (html, who) => { const m = document.createElement("div"); m.className = "fb-m " + who; m.innerHTML = html; log.append(m); log.scrollTop = log.scrollHeight; return m; };
    const chips = list => { const c = document.createElement("div"); c.className = "fb-chips"; list.forEach(q => { const b = document.createElement("button"); b.type = "button"; b.textContent = q; b.onclick = () => ask(q); c.append(b); }); log.append(c); log.scrollTop = log.scrollHeight; };
    const esc = s => s.replace(/[&<>"]/g, c => ({"&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;"}[c]));
    async function ask(q){
      q = q.trim(); if (!q) return;
      add(esc(q), "me"); history.push({role: "user", text: q});
      const t = add("…", "bot typing");
      await new Promise(r => setTimeout(r, 450));
      const f = find(q); let ans = f ? f.a : null; window.owTrack && owTrack("bot_ask", {answered: !!f, topic: f ? f.q : "unknown"});
      if (!ans && window.SITE && SITE.aiEndpoint) {
        try { const r = await fetch(SITE.aiEndpoint, {method: "POST", headers: {"Content-Type": "application/json"}, body: JSON.stringify({q, history: history.slice(-8)})}); const j = await r.json(); if (j && j.answer) ans = esc(j.answer).replace(/\n/g, "<br>"); } catch (e) {}
      }
      t.classList.remove("typing"); t.innerHTML = ans || FALLBACK(); history.push({role: "bot", text: t.textContent});
      log.scrollTop = log.scrollHeight;
      if (!f) chips(CHIPS.slice(0, 4));
    }
    form.onsubmit = e => { e.preventDefault(); const q = input.value; input.value = ""; ask(q); };
    add(GREET, "bot"); chips(CHIPS);
    return el;
  };

  /* サポートのページは、ページの中にも出す（ページを入れかえたときも site.js から呼ぶ） */
  window.owFaqMount = () => { const spot = document.querySelector("[data-faq-bot]"); if (spot) spot.replaceWith(build(true)); };
  owFaqMount();
  const box = build(false); document.body.append(box);
  const op = document.createElement("button"); op.className = "fb-open"; op.type = "button";
  op.innerHTML = `<img src="assets/img/face_aoi.webp" alt=""><span><small>なんでも聞いてな</small>質問する</span>`; op.setAttribute("aria-label", "質問する（サポート担当 葵）");
  document.body.append(op);
  op.onclick = () => { box.classList.add("open"); op.hidden = true; setTimeout(() => box.querySelector("input").focus(), 300); };
  box.querySelector(".fb-x").onclick = () => { box.classList.remove("open"); op.hidden = false; };
})();
