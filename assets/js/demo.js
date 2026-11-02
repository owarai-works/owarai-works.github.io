/* =========================================================
   体験コーナー（AIは使わない・4つから選ぶ四択で遊べる）
   ・お題合戦：葵（CPU）と3本先取。点数が高い方が1本（同点はあなた）
   ・大喜利：文字のお題に、いちばん面白い答えを選ぶ
   ・漫画セリフ：漫画のコマの吹き出しに入るセリフを選ぶ
   点数：100＝爆笑 / 70＝ウケた / 40＝ふつう / 10＝スベった
   お題合戦の絵と選択肢はゲームの四択と同じもの。大喜利・漫画セリフの選択肢はホームページ用に書いたもの。
   ========================================================= */
window.owDemoMount = () => {
  const root = document.getElementById("demo"); if (!root || root.dataset.on) return; root.dataset.on = "1";
  const PIC = [
    ["fire", "現場に到着した消防車ですが……", [["消す前にまず自分な", 100], ["火事場の火事", 70], ["消防車が燃えてます", 40], ["今日はいい天気ですね", 10]]],
    ["cat", "金魚鉢をのぞいてみると……", [["金魚「家賃払えよ」", 100], ["猫の水泳教室", 70], ["猫が金魚鉢に入ってる", 40], ["おはようございます", 10]]],
    ["umbrella", "今日は快晴。", [["俺専用の梅雨", 100], ["傘「中は雨です」", 70], ["傘の中だけ雨", 40], ["明日は休みだ", 10]]],
    ["sumo", "静かにしなければいけない図書館で", [["本も静かにできへん", 100], ["しーっ、の衝撃", 70], ["図書館で四股", 40], ["今日のおかずは何", 10]]],
    ["ramen", "こだわりのラーメン屋", [["湯切りでお客も切れとる", 100], ["スープより汗", 70], ["湯切りがすごい", 40], ["ゲームしたい", 10]]],
    ["mensetsu", "就職の面接で……", [["ニワトリも御社の面接官ですか", 100], ["三人で一人分", 70], ["面接官が同じ顔", 40], ["眠たい", 10]]],
    ["sushi", "回転寿司に来てみたら……", [["すみません、サーモンの隣の人ください", 100], ["新ネタ・会社員", 70], ["人が流れてきた", 40], ["電車遅れてる", 10]]],
    ["obake", "お化け屋敷に入ってみたら", [["こっちが成仏しそう", 100], ["お化けの退職願", 70], ["お化けが倒れてる", 40], ["テレビ見よう", 10]]],
    ["karaoke", "会社の飲み会のあとのカラオケ", [["大根、音程外れてへんか？", 100], ["十八番は大根おろし", 70], ["大根を持って歌ってる", 40], ["コンビニ行ってくる", 10]]],
    ["zoo", "休日の動物園で……", [["サル「人間、今日もかわいいな」", 100], ["飼育員はどっち", 70], ["動物が見物してる", 40], ["駅まで歩こう", 10]]]
  ];
  const OG = [
    ["こんな歯医者は嫌だ。どんな歯医者？", [["「痛かったら右手を挙げてください」と言いながら両手を押さえる", 100], ["待合室のBGMがドリルの音", 70], ["治療がすごく痛い", 40], ["駅から近い", 10]]],
    ["こんなコンビニは嫌だ。どんなコンビニ？", [["温めますか？と聞いて店員が抱きしめてくる", 100], ["レジ袋が有料どころか分割払い", 70], ["品ぞろえが少ない", 40], ["夜もあいている", 10]]],
    ["こんなタクシーは嫌だ。どんなタクシー？", [["「お客さん、どちらまで？」が人生相談の意味", 100], ["メーターが運転手の心拍数", 70], ["運転が荒い", 40], ["車が黄色い", 10]]],
    ["こんな忍者は嫌だ。どんな忍者？", [["名刺に「忍者」と書いてある", 100], ["分身の術で全員遅刻", 70], ["足音がうるさい", 40], ["黒い服を着ている", 10]]],
    ["こんな天気予報は嫌だ。どんな天気予報？", [["「明日の天気は、あなた次第です」", 100], ["降水確率「たぶん」", 70], ["よく外れる", 40], ["朝にやっている", 10]]],
    ["こんな回転寿司は嫌だ。どんな回転寿司？", [["大将も一緒に回っている", 100], ["レーンが速すぎて皿が飛んでくる", 70], ["ネタが小さい", 40], ["お茶が熱い", 10]]],
    ["こんなヒーローは嫌だ。どんなヒーロー？", [["変身に役所の手続きがいる", 100], ["必殺技の名前を毎回忘れる", 70], ["あまり強くない", 40], ["マントをつけている", 10]]]
  ];
  const MG = [
    ["food", "ラーメンをひと口食べた男。吹き出しのセリフは？", [85, 21], [["大将、これ…去年の味や", 100], ["スープが熱すぎて記憶が飛んだ", 70], ["うまい！", 40], ["今日は月曜日", 10]]],
    ["wed", "結婚式の誓いの場面。花嫁の吹き出しのセリフは？", [88, 17], [["誓います…たぶん", 100], ["その前に、指輪の値段を", 70], ["はい、誓います", 40], ["お腹すいた", 10]]],
    ["train", "満員電車で寄りかかられたサラリーマン。吹き出しのセリフは？", [14, 25], [["よだれの家賃、払ってもらいます", 100], ["僕の肩、ベッドちゃうで", 70], ["重いです", 40], ["次の駅で降ります", 10]]],
    ["biyou", "美容院で鏡を見た客。吹き出しのセリフは？", [79, 26], [["これ、髪型ちゃう。警報や", 100], ["ウニ注文してないです", 70], ["思ってたのとちがう", 40], ["お腹すいた", 10]]],
    ["dentist", "歯医者さんが口の中を見て固まった。吹き出しのセリフは？", [79, 23], [["…奥に先客がいます", 100], ["これは歯医者より考古学者ですね", 70], ["虫歯がありますね", 40], ["今日は晴れですね", 10]]],
    ["mensetsu", "面接で立ち上がった就活生。吹き出しのセリフは？", [44, 17], [["御社、ぼくが買います！", 100], ["長所は、立ち上がりが早いところです", 70], ["よろしくお願いします！", 40], ["トイレ行ってきます", 10]]],
    ["kokuhaku", "告白された女子。吹き出しのセリフは？", [67, 15], [["その手紙、宛先がお母さんよ", 100], ["審査の結果は後日郵送します", 70], ["ごめんなさい", 40], ["夕日がきれい", 10]]],
    ["sushi", "寿司屋の大将が一貫を出した。吹き出しのセリフは？", [39, 19], [["お客さん、それ握り返さんでええ", 100], ["本日のおすすめ、わしの親指です", 70], ["へい、マグロお待ち", 40], ["いい天気ですね", 10]]],
    ["obake", "お化け屋敷のお化けが空振り。吹き出しのセリフは？", [58, 13], [["ちょっと、ポイントカードあります？", 100], ["その袋の中身のほうが怖いわ", 70], ["びっくりしない", 40], ["今日は特売日", 10]]]
  ];
  const JUDGE = {100: ["kineko", "爆笑！", "最高やん！お腹いたいわ〜！"], 70: ["momoe", "ウケた！", "ええやん、センスあるなぁ〜"], 40: ["aoi", "ふつう", "うーん、見たまんまやな"], 10: ["aoi", "スベった", "それ、ただの感想や！"]};
  const RANK = n => n >= 280 ? ["お笑いマスター級", "kineko"] : n >= 200 ? ["若手の星", "momoe"] : n >= 120 ? ["見習い芸人", "aoi"] : ["まずは修行から", "aoi"];
  const shuf = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const esc = s => String(s).replace(/[&<>"]/g, c => ({"&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;"}[c]));
  const sfx = n => window.owSfx && owSfx(n);
  const face = k => `assets/img/face_${k}.webp`;
  let mode = "gassen", timer = 0;

  root.innerHTML = `<div class="dm-tabs" role="tablist" aria-label="体験するモード">
      <button type="button" role="tab" data-m="gassen" aria-selected="true"><b>お題合戦</b><small>葵と3本先取</small></button>
      <button type="button" role="tab" data-m="oogiri" aria-selected="false"><b>大喜利</b><small>3問チャレンジ</small></button>
      <button type="button" role="tab" data-m="manga" aria-selected="false"><b>漫画セリフ</b><small>3問チャレンジ</small></button>
    </div><div class="dm-stage" role="tabpanel" aria-live="polite"></div>`;
  const stage = root.querySelector(".dm-stage");
  root.querySelector(".dm-tabs").addEventListener("click", e => { const b = e.target.closest("button"); if (!b || b.dataset.m === mode) return; mode = b.dataset.m;
    root.querySelectorAll(".dm-tabs button").forEach(x => x.setAttribute("aria-selected", x === b)); start(); });

  const choicesHTML = list => `<div class="dm-ch">${list.map((c, i) => `<button type="button" data-i="${i}"><i>${"ABCD"[i]}</i><span>${esc(c[0])}</span></button>`).join("")}</div>`;
  const judgeHTML = p => { const [k, w, t] = JUDGE[p]; return `<div class="dm-judge s${p}"><img src="${face(k)}" alt=""><div><b>${p}点・${w}</b><small>${t}</small></div></div>`; };
  const clear = () => clearInterval(timer);
  const share = t => `<a class="btn sm dm-share" target="_blank" rel="noopener" href="https://twitter.com/intent/tweet?text=${encodeURIComponent(t + "\n#お笑い道場なんでやねん #大喜利")}&url=${encodeURIComponent("https://owarai-works.github.io/")}">𝕏 結果をポストする</a>`;
  /* 結果は絵の上に重ねて出す（下に足すと画面がのびるため） */
  const place = res => { const pic = stage.querySelector(".dm-pic,.dm-card"); res.style.top = (pic ? pic.offsetTop : 60) + "px"; res.classList.add("on"); };

  /* ---------- 大喜利・漫画セリフ：3問で合計点 ---------- */
  function solo(kind){
    clear(); const qs = shuf(kind === "manga" ? MG : OG).slice(0, 3); let n = 0, total = 0;
    const ask = () => {
      const q = qs[n], list = shuf(kind === "manga" ? q[3] : q[1]);
      stage.innerHTML = `<div class="dm-head"><span class="dm-q">第${n + 1}問 / 3</span><span class="dm-sc">合計 <b>${total}</b> 点</span></div>
        ${kind === "manga" ? `<figure class="dm-pic manga"><img src="assets/img/demo/mg_${q[0]}.webp" alt="漫画のコマ"><span class="dm-bub" style="left:${q[2][0]}%;top:${q[2][1]}%"></span></figure><p class="dm-odai">${esc(q[1])}</p>`
          : `<div class="dm-card"><em>大喜利</em><p>${esc(q[0])}</p></div>`}
        <p class="dm-guide">いちばん面白いと思う答えを選んでな！<small>（ゲームではキーボードで自由に入力できるで）</small></p>${choicesHTML(list)}<div class="dm-res"></div>`;
      stage.querySelectorAll(".dm-ch button").forEach(b => b.onclick = () => {
        const c = list[+b.dataset.i], p = c[1]; total += p; sfx(p >= 70 ? "slap" : "pon");
        stage.querySelectorAll(".dm-ch button").forEach((x, i) => { x.disabled = true; x.classList.add("p" + list[i][1]); if (x === b) x.classList.add("me"); x.insertAdjacentHTML("beforeend", `<em>${list[i][1]}点</em>`); });
        const bub = stage.querySelector(".dm-bub"); if (bub) { bub.textContent = c[0]; bub.classList.add("on"); }
        stage.querySelector(".dm-sc b").textContent = total;
        const res = stage.querySelector(".dm-res");
        res.innerHTML = judgeHTML(p) + `<button type="button" class="btn sm dm-next">${n < 2 ? "次のお題へ" : "結果を見る"} <span class="arw" aria-hidden="true">→</span></button>`;
        res.querySelector(".dm-next").onclick = () => { n++; if (n < 3) ask(); else end(); };
        place(res);
      });
    };
    const end = () => { const [r, k] = RANK(total); sfx("slap");
      stage.innerHTML = `<div class="dm-end"><img src="${face(k)}" alt=""><p class="dm-end-t">${kind === "manga" ? "漫画セリフ" : "大喜利"}の結果</p><p class="dm-end-s"><b>${total}</b>点 / 300点</p><p class="dm-end-r">${r}</p>
        <p class="dm-end-c">ゲームでは、<b>自分で考えた答え</b>をAIが100点満点で採点！<br>お題は11種類・数百問。あなたのセンスを全国にぶつけよう。</p>
        <div class="dm-end-b"><button type="button" class="btn sm dm-again">もう一回</button>${share(`「お笑い道場なんでやねん」の${kind === "manga" ? "漫画セリフ" : "大喜利"}体験で${total}点！判定は「${r}」でした😂 あなたは何点？`)}<a class="btn ghost sm" href="game.html">ゲーム紹介を見る</a></div></div>`;
      stage.querySelector(".dm-again").onclick = () => solo(kind); };
    ask();
  }

  /* ---------- お題合戦：葵と3本先取 ---------- */
  function gassen(){
    clear(); const pool = shuf(PIC); let me = 0, cpu = 0, r = 0;
    const cpuPick = () => { const x = Math.random(); return x < .22 ? 100 : x < .55 ? 70 : x < .85 ? 40 : 10; };
    const head = () => `<div class="dm-vs"><div class="me"><img src="assets/img/face_kineko.webp" alt=""><b>あなた</b><span class="dm-pts">${"●".repeat(me)}${"○".repeat(3 - me)}</span></div><em>VS</em><div class="op"><img src="${face("aoi")}" alt=""><b>葵（CPU）</b><span class="dm-pts">${"●".repeat(cpu)}${"○".repeat(3 - cpu)}</span></div></div>`;
    const round = () => {
      const q = pool[r % pool.length], list = shuf(q[2]); r++; let left = 15, done = false;
      stage.innerHTML = head() + `<div class="dm-round">第${r}本 <small>3本先取</small><span class="dm-time"><b>${left}</b>秒</span></div>
        <figure class="dm-pic"><img src="assets/img/demo/sc_${q[0]}.webp" alt="お題の絵"><figcaption>${esc(q[1])}</figcaption></figure>
        <p class="dm-guide">ボケで答えろ！面白いと思う答えを選んでな<small>（ゲームではキーボードで自由に入力できるで）</small></p>${choicesHTML(list)}<div class="dm-res"></div>`;
      sfx("hyoshigi");
      const tEl = stage.querySelector(".dm-time b");
      const decide = i => { if (done) return; done = true; clear();
        const myP = i < 0 ? 0 : list[i][1]; let op = cpuPick(); if (op === myP) op = [100, 70, 40, 10].filter(x => x !== myP)[Math.floor(Math.random() * 3)];  /* 葵はあなたとちがう答えを出す */
        const opT = list.find(c => c[1] === op)[0], win = myP > op;
        if (win) me++; else cpu++; sfx(win ? "slap" : "pon");
        stage.querySelectorAll(".dm-ch button").forEach((x, j) => { x.disabled = true; x.classList.add("p" + list[j][1]); if (j === i) x.classList.add("me"); if (list[j][1] === op) x.classList.add("op"); x.insertAdjacentHTML("beforeend", `<em>${list[j][1]}点</em>`); });
        stage.querySelector(".dm-vs").outerHTML = head();
        const res = stage.querySelector(".dm-res"), over = me >= 3 || cpu >= 3;
        res.innerHTML = `<div class="dm-duel ${win ? "win" : "lose"}"><div><small>あなた</small><b>${myP}点</b><span>${i < 0 ? "時間切れ" : esc(list[i][0])}</span></div><div><small>葵</small><b>${op}点</b><span>${esc(opT)}</span></div></div>
          <p class="dm-call">${win ? "あなたに1本！" : "葵に1本…"}</p>
          <button type="button" class="btn sm dm-next">${over ? "結果を見る" : "次の勝負へ"} <span class="arw" aria-hidden="true">→</span></button>`;
        res.querySelector(".dm-next").onclick = () => over ? end() : round();
        place(res);
      };
      stage.querySelectorAll(".dm-ch button").forEach(b => b.onclick = () => decide(+b.dataset.i));
      timer = setInterval(() => { left--; if (tEl.isConnected) tEl.textContent = left; if (left <= 5) tEl.parentElement.classList.add("hurry"); if (left <= 0) decide(-1); }, 1000);
    };
    const end = () => { const win = me >= 3; sfx("slap");
      stage.innerHTML = `<div class="dm-end ${win ? "win" : ""}"><img src="${face(win ? "kineko" : "aoi")}" alt=""><p class="dm-end-t">お題合戦</p><p class="dm-end-s"><b>${win ? "勝利！" : "敗北…"}</b></p><p class="dm-end-r">${me} 本 − ${cpu} 本</p>
        <p class="dm-end-c">${win ? "やるやん！その笑いのセンス、本番で試してみ？" : "葵「まだまだやな。本番で待ってるで」"}<br>ゲームでは<b>自分で考えた答え</b>で、全国のライバルと<b>ランクマッチ</b>！</p>
        <div class="dm-end-b"><button type="button" class="btn sm dm-again">もう一回</button>${share(`「お笑い道場なんでやねん」のお題合戦で、葵に${me}本−${cpu}本で${win ? "勝利！🏆" : "敗北…😭"} あなたは勝てる？`)}<a class="btn ghost sm" href="game.html#gassen">お題合戦をくわしく</a></div></div>`;
      stage.querySelector(".dm-again").onclick = gassen; };
    stage.innerHTML = head() + `<div class="dm-start"><p class="dm-big">いざ尋常に、<b>勝負！</b></p><p>同じお題で、葵と<b>3本先取</b>の笑いの勝負。<br>1本15秒。点数が高い方が1本！</p><button type="button" class="btn dm-go">勝負をはじめる <span class="arw" aria-hidden="true">→</span></button></div>`;
    stage.querySelector(".dm-go").onclick = round;
  }
  const start = () => mode === "gassen" ? gassen() : solo(mode);
  start();
};
owDemoMount();
