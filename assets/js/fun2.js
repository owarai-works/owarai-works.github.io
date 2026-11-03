/* =========================================================
   装飾・演出（ユーザーが選んだ 1・2・4・5・6・8）
   1 新しい欄が出るたびに客席の笑い声と「ワハハ」
   2 画面の下のすみで、シスターズが欄に合わせて実況
   4 時間帯で変わる寄席（朝・昼・夕・夜・夜中）
   5 季節の飾り（春＝桜・夏＝花火・秋＝紅葉・冬＝雪／正月・ハロウィン・クリスマス）
   6 ページを移るときに赤い幕が閉じて開く（site.js の go から呼ぶ）
   8 1分20秒見てくれた人へ、シスターズからごほうび（20秒で帯が出て60秒カウントダウン・9種類からランダム）
   ・「動きを減らす」設定の人には動きを出さない／笑い声は BGM が ON のときだけ
   ========================================================= */
(() => {
  if (window.__owFun2) return; window.__owFun2 = true;
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const bgmOn = () => !window.owBgm || owBgm.isOn();
  const pick = a => a[Math.floor(Math.random() * a.length)];
  const now = () => new Date(Date.now() + 9 * 3600e3);  /* 日本時間 */

  const css = `
.lol{position:absolute;z-index:6;pointer-events:none;font-family:var(--f-disp);font-weight:400;color:var(--shu);-webkit-text-stroke:2px #fff;paint-order:stroke fill;text-shadow:3px 3px 0 var(--ink);white-space:nowrap;animation:lolUp 1.4s cubic-bezier(.2,1.4,.4,1) forwards}
@keyframes lolUp{0%{transform:translateY(20px) scale(.3) rotate(var(--r));opacity:0}25%{transform:translateY(0) scale(1.15) rotate(var(--r));opacity:1}75%{opacity:1}100%{transform:translateY(-50px) scale(1) rotate(var(--r));opacity:0}}
.jk{position:fixed;left:12px;bottom:74px;z-index:57;display:flex;align-items:flex-end;gap:6px;pointer-events:none;transform:translateY(130%);transition:transform .45s cubic-bezier(.2,1.4,.4,1)}
.jk.on{transform:none}
.jk img{width:74px;filter:drop-shadow(3px 3px 0 rgba(28,16,18,.35));animation:jkBob 1.6s ease-in-out infinite alternate}
@keyframes jkBob{to{transform:translateY(-5px) rotate(2deg)}}
.jk p{max-width:210px;margin-bottom:40px;padding:7px 11px;background:#fff;border:3px solid var(--ink);border-radius:14px;box-shadow:3px 3px 0 var(--ink);font-weight:900;font-size:13px;line-height:1.45;color:var(--ink)}
@media (max-width:760px){.jk{bottom:64px;left:6px}.jk img{width:58px}.jk p{font-size:12px;max-width:170px;margin-bottom:30px}}
html.tod-night body::after,html.tod-late body::after{background:radial-gradient(900px 600px at 85% -5%,rgba(255,198,26,.18),transparent 60%),linear-gradient(180deg,rgba(40,20,60,.10),rgba(40,20,60,.16))}
html.tod-evening body::after{background:radial-gradient(900px 600px at 85% -5%,rgba(255,120,60,.32),transparent 60%),radial-gradient(800px 500px at -5% 40%,rgba(255,127,176,.2),transparent 60%)}
html.tod-morning body::after{background:radial-gradient(900px 600px at 15% -5%,rgba(160,220,255,.35),transparent 60%),radial-gradient(800px 500px at 100% 40%,rgba(255,232,150,.25),transparent 60%)}
html.tod-night .hero-bg img,html.tod-late .hero-bg img{filter:brightness(.82) saturate(1.1)}
.lanterns{position:absolute;left:0;right:0;top:calc(var(--hd) - 6px);z-index:2;display:flex;justify-content:space-around;pointer-events:none}
.lanterns i{width:34px;height:46px;border-radius:45%;background:radial-gradient(circle at 50% 40%,#ffd36b,#ff5a2e 55%,#b3140c);border:2px solid #4a1206;box-shadow:0 0 22px rgba(255,140,40,.9);animation:lnSway 3s ease-in-out infinite alternate;transform-origin:50% -20px}
.lanterns i:nth-child(2n){animation-delay:-1.5s}
@keyframes lnSway{from{transform:rotate(-5deg)}to{transform:rotate(5deg)}}
@media (max-width:760px){.lanterns i{width:24px;height:32px}.lanterns i:nth-child(n+5){display:none}}
.tod-badge{position:fixed;right:12px;top:calc(var(--hd) + 10px);z-index:44;padding:4px 12px;background:#fff;border:2px solid var(--ink);border-radius:999px;box-shadow:2px 2px 0 var(--ink);font-weight:900;font-size:12px;pointer-events:none;opacity:0;transform:translateY(-10px);transition:all .5s}
.tod-badge.on{opacity:1;transform:none}
.season-fx{position:fixed;inset:0;z-index:-1;pointer-events:none;overflow:hidden}
.season-fx i{position:absolute;top:-40px;animation:sFall linear forwards}
@keyframes sFall{to{transform:translate(var(--dx),calc(100vh + 80px)) rotate(var(--rot))}}
.season-fx .fw{position:absolute;width:6px;height:6px;border-radius:50%;animation:fwBoom 1.4s ease-out forwards}
@keyframes fwBoom{0%{box-shadow:0 0 0 0 currentColor;opacity:1;transform:scale(.4)}100%{opacity:0;transform:scale(1)}}
.ev-badge{position:absolute;left:calc(100% - 18px);top:-6px;font-size:22px;line-height:1;transform:rotate(12deg);filter:drop-shadow(1px 1px 0 #fff)}
.hd-logo{position:relative}
.pg-curtain{position:fixed;inset:0;z-index:110;pointer-events:none}
.pg-curtain::before,.pg-curtain::after{content:"";position:absolute;top:0;bottom:0;width:50.5%;background:repeating-linear-gradient(90deg,rgba(0,0,0,.28) 0 8px,transparent 8px 26px,rgba(255,255,255,.06) 26px 30px,transparent 30px 40px),linear-gradient(180deg,#c3161f,#6a0810 90%);transition:transform .38s cubic-bezier(.7,0,.3,1)}
.pg-curtain::before{left:0;transform:translateX(-101%);border-right:3px solid var(--gold-d)}
.pg-curtain::after{right:0;transform:translateX(101%);border-left:3px solid var(--gold-d)}
.pg-curtain.close::before,.pg-curtain.close::after{transform:none}
.thx{position:fixed;inset:0;z-index:100;display:grid;place-items:center;padding:16px;background:rgba(28,16,18,.55);animation:ogIn .3s ease}
.thx-in{position:relative;width:min(100%,400px);padding:22px 18px 18px;text-align:center;background:#fff;border:4px solid var(--ink);border-radius:22px;box-shadow:8px 8px 0 var(--shu);animation:pop .5s var(--ease)}
.thx-in img{width:140px;margin:-80px auto 4px;filter:drop-shadow(4px 4px 0 rgba(28,16,18,.4))}
.thx-in p{font-weight:900;line-height:1.7}.thx-in p b{color:var(--shu)}
.thx-in .btn{margin-top:12px}
.thx-cf{position:fixed;top:-20px;width:10px;height:14px;z-index:101;pointer-events:none;animation:sFall linear forwards}
`;
  const st = document.createElement("style"); st.textContent = css; document.head.append(st);

  /* ---------- 笑い声（合成：手拍子のような笑いのかたまり） ---------- */
  let ac = null;
  const laugh = (big) => {
    if (!bgmOn()) return; const AC = window.AudioContext || window.webkitAudioContext; if (!AC) return;
    try { ac = ac || new AC(); if (ac.state !== "running") return;
      const n = big ? 26 : 12, master = ac.createGain(); master.gain.value = big ? .16 : .1; master.connect(ac.destination);
      for (let i = 0; i < n; i++) { const t = ac.currentTime + Math.random() * (big ? 1.2 : .7), o = ac.createOscillator(), g = ac.createGain(), f = 180 + Math.random() * 260;
        o.type = "triangle"; o.frequency.setValueAtTime(f * 1.25, t); o.frequency.exponentialRampToValueAtTime(f, t + .12);
        g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(.5, t + .02); g.gain.exponentialRampToValueAtTime(.001, t + .16);
        o.connect(g); g.connect(master); o.start(t); o.stop(t + .2); }
    } catch (e) {}
  };
  addEventListener("pointerdown", () => { try { if (ac && ac.state !== "running") ac.resume(); } catch (e) {} }, {passive: true});

  /* ---------- 1 欄が出るたびに「ワハハ」 ---------- */
  const WORDS = ["ワハハ！", "ドッ！", "あはは！", "クスッ", "爆笑！", "なんでやねん！", "ウケる〜！"];
  const BIG = new Set(["gassen", "point", "play"]);
  const lolIO = !reduce && new IntersectionObserver(es => es.forEach(e => { if (!e.isIntersecting) return; lolIO.unobserve(e.target);
    const sec = e.target, big = BIG.has(sec.id), n = big ? 6 : 3;
    for (let i = 0; i < n; i++) { const w = document.createElement("span"); w.className = "lol";
      w.textContent = pick(WORDS); w.style.cssText = `left:${8 + Math.random() * 78}%;top:${10 + Math.random() * 40}px;font-size:${big ? 22 + Math.random() * 16 : 16 + Math.random() * 10}px;--r:${(Math.random() * 24 - 12).toFixed(0)}deg;animation-delay:${(i * .12).toFixed(2)}s`;
      if (getComputedStyle(sec).position === "static") sec.style.position = "relative";
      sec.append(w); setTimeout(() => w.remove(), 2200); }
    laugh(big); }), {threshold: .35});
  const watchLol = () => { if (!lolIO) return; document.querySelectorAll("main > section.sec:not([data-lol])").forEach(s => { s.dataset.lol = 1; lolIO.observe(s); }); };

  /* ---------- 2 シスターズの実況 ---------- */
  const JK = {fit: ["m_wave", "当てはまったら、もう<b>仲間</b>やね〜"], gassen: ["a_smug", "ここが<b>一番アツい</b>とこやで！"], play: ["k_jump", "ハリセン連打、<b>横綱</b>めざしてや！"], ranking: ["a_hari", "番付の<b>横綱</b>は、うちがもらう！"],
    point: ["k_mic", "大喜利対戦、<b>激アツ</b>やで〜！"], odai: ["k_mic", "お題は<b>11種類</b>！毎日ちがうで"], minigame: ["m_sleep", "ミニゲームは<b>寝てても</b>勝てるで〜…zzz"], news: ["m_fan", "最新情報、<b>チェック</b>してな〜"],
    about: ["a_smug", "AIの採点、<b>甘くない</b>で"], chara: ["k_jump", "うちらの<b>アイドル姿</b>も見てな！"], movie: ["m_wave", "ムービー、<b>見てって</b>な〜"], cta: ["k_roll", "配信まで<b>もうちょい</b>待っててや！"],
    how: ["a_smug", "遊び方は<b>かんたん</b>やで"], banzuke: ["a_hari", "<b>横綱</b>めざして勝負や！"], taisen: ["a_hari", "格闘モード、<b>手加減なし</b>やで"], road: ["k_jump", "お笑いへの道、<b>いっしょに</b>行こ！"], manga: ["m_fan", "漫画も<b>30話</b>あるで〜"]};
  const jk = document.createElement("div"); jk.className = "jk"; jk.setAttribute("aria-hidden", "true"); jk.innerHTML = `<img alt=""><p></p>`; document.body.append(jk);
  let jkCur = "", jkT = 0;
  const jkIO = !reduce && new IntersectionObserver(es => es.forEach(e => { if (!e.isIntersecting) return; const k = e.target.id; if (!JK[k] || k === jkCur) return; jkCur = k;
    if (document.querySelector(".fun-peek,.fb.open,.og-gate,.thx")) return;
    const [img, txt] = JK[k]; jk.classList.remove("on");
    setTimeout(() => { jk.querySelector("img").src = `assets/img/fun/${img}.webp`; jk.querySelector("p").innerHTML = txt; jk.classList.add("on"); clearTimeout(jkT); jkT = setTimeout(() => jk.classList.remove("on"), 4200); }, 260);
  }), {threshold: .45});
  const watchJk = () => { if (!jkIO) return; document.querySelectorAll("main section[id]:not([data-jk])").forEach(s => { s.dataset.jk = 1; jkIO.observe(s); }); };

  /* ---------- 4 時間帯 ---------- */
  const tod = () => { const h = now().getUTCHours(); return h < 4 ? "late" : h < 10 ? "morning" : h < 16 ? "day" : h < 19 ? "evening" : "night"; };
  const TOD_TXT = {late: "🌙 夜ふかし寄席　百萌はおねむ…", morning: "☀️ 朝の寄席　今日も一日わろてこ！", day: "🎪 昼の部、開演中！", evening: "🌇 夕方の寄席、にぎわってきたで", night: "🏮 夜の部、提灯に灯りがともったで"};
  const applyTod = () => { const t = tod(); document.documentElement.classList.remove("tod-late", "tod-morning", "tod-day", "tod-evening", "tod-night"); document.documentElement.classList.add("tod-" + t);
    const hero = document.querySelector(".hero"); if (hero && (t === "night" || t === "late") && !hero.querySelector(".lanterns")) { const l = document.createElement("div"); l.className = "lanterns"; l.setAttribute("aria-hidden", "true"); l.innerHTML = "<i></i>".repeat(8); hero.append(l); }
    if (t === "late") document.querySelectorAll(".sis.m img").forEach(im => { im.dataset.orig = im.dataset.orig || im.src; im.src = "assets/img/fun/m_sleep.webp"; im.style.objectFit = "contain"; });
    if (!sessionStorage.getItem("ow-tod")) { try { sessionStorage.setItem("ow-tod", "1"); } catch (e) {} const b = document.createElement("div"); b.className = "tod-badge"; b.textContent = TOD_TXT[t]; document.body.append(b); setTimeout(() => b.classList.add("on"), 1800); setTimeout(() => { b.classList.remove("on"); setTimeout(() => b.remove(), 600); }, 6500); } };

  /* ---------- 5 季節の飾り ---------- */
  const season = () => { const d = now(), m = d.getUTCMonth() + 1, day = d.getUTCDate();
    if (m === 1 && day <= 7) return "newyear"; if (m === 10 && day >= 25) return "halloween"; if (m === 12 && day >= 18 && day <= 25) return "xmas";
    return m >= 3 && m <= 5 ? "spring" : m >= 6 && m <= 8 ? "summer" : m >= 9 && m <= 11 ? "autumn" : "winter"; };
  const leaf = c => `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40"><path fill="${c}" stroke="#7a2a0a" stroke-width="1" d="M20 2l4 9 8-4-3 9 9 1-8 6 4 8-9-3-1 10-4-8-4 8-1-10-9 3 4-8-8-6 9-1-3-9 8 4z"/><path d="M20 22v16" stroke="#7a2a0a" stroke-width="2"/></svg>`)}`;
  const applySeason = () => { if (reduce || document.querySelector(".season-fx")) return; const s = season(), box = document.createElement("div"); box.className = "season-fx"; box.setAttribute("aria-hidden", "true"); document.body.prepend(box);
    const BADGE = {newyear: "🎍", halloween: "🎃", xmas: "🎄", spring: "🌸", summer: "🎐", autumn: "🍁", winter: "⛄"};
    const lg = document.querySelector(".hd-logo"); if (lg && !lg.querySelector(".ev-badge")) { const b = document.createElement("span"); b.className = "ev-badge"; b.textContent = BADGE[s]; lg.append(b); }
    const small = innerWidth < 760;
    const one = first => { if (document.hidden || box.childElementCount > (small ? 10 : 18)) return; const i = document.createElement("i"), dur = 9 + Math.random() * 8;
      let html = "", sz = 14 + Math.random() * 14;
      if (s === "autumn" || s === "halloween") { i.style.width = sz + "px"; i.style.height = sz + "px"; i.style.background = `url("${leaf(pick(["#e8542a", "#f08a24", "#d6362a", "#e9b02a"]))}") center/contain no-repeat`; }
      else if (s === "winter" || s === "xmas") { sz = 4 + Math.random() * 7; i.style.cssText = `width:${sz}px;height:${sz}px;border-radius:50%;background:#fff;box-shadow:0 0 4px rgba(120,160,220,.8)`; }
      else if (s === "spring") { i.style.width = sz + "px"; i.style.height = sz + "px"; i.style.background = `url(assets/img/fun/sakura.webp) center/contain no-repeat`; }
      else if (s === "newyear") { i.style.width = sz + "px"; i.style.height = sz + "px"; i.style.background = `url(assets/img/fun/coin.webp) center/contain no-repeat`; }
      else return;
      i.style.left = Math.random() * 100 + "vw"; i.style.setProperty("--dx", (Math.random() * 160 - 80) + "px"); i.style.setProperty("--rot", (Math.random() * 720 - 360) + "deg");
      i.style.animationDuration = dur + "s"; if (first) i.style.animationDelay = -Math.random() * dur + "s";
      i.addEventListener("animationend", () => i.remove()); box.append(i); };
    if (s === "summer") { setInterval(() => { if (document.hidden || box.childElementCount > 6) return; const f = document.createElement("i"); f.className = "fw"; const c = pick(["#ff5a45", "#ffd84d", "#4fc3ff", "#ff7fb0", "#7cff7c"]);
      f.style.cssText = `left:${10 + Math.random() * 80}vw;top:${8 + Math.random() * 35}vh;color:${c};box-shadow:${Array.from({length: 14}, (_, k) => { const a = k / 14 * Math.PI * 2; return `${Math.cos(a) * 46}px ${Math.sin(a) * 46}px 0 1px ${c}`; }).join(",")}`;
      f.addEventListener("animationend", () => f.remove()); box.append(f); }, 2600); return; }
    for (let k = 0; k < (small ? 6 : 10); k++) one(true); setInterval(() => one(false), 1500); };

  /* ---------- 6 ページを移るときの幕 ---------- */
  const cur = document.createElement("div"); cur.className = "pg-curtain"; cur.setAttribute("aria-hidden", "true"); document.body.append(cur);
  window.owCurtainClose = () => new Promise(r => { if (reduce) return r(); cur.classList.add("close"); window.owSfx && owSfx("pon"); setTimeout(r, 400); });
  /* 動きなしで、すぐ幕を閉じた状態にする（スマホのメニューの幕からつなぐ） */
  window.owCurtainSet = () => { if (reduce) return; cur.classList.add("instant", "close"); void cur.offsetWidth; requestAnimationFrame(() => cur.classList.toggle("instant", false)); };
  window.owCurtainOpen = () => { if (reduce) return; setTimeout(() => cur.classList.remove("close"), 60); };

  /* ---------- 8 長く見てくれた人へ：見はじめて20秒でカウントダウン（60秒）が出て、1分20秒でお礼 ----------
     お礼は 3人×3種類＝9種類から、ランダムで1つ（絵・ことば・声・ボタン） */
  const THX = [
    {k: "kineko", n: "気猫", img: "k_jump", vo: "win", t: "まだ見てくれてるん？<br><b>ほんまにありがとう！</b><br>あなたはもう、立派な<b>お笑い道場の門下生</b>や！", b: "どういたしまして"},
    {k: "kineko", n: "気猫", img: "k_mic", vo: "high1", t: "ここまで見てくれたあなたに、<br><b>拍手〜！</b>👏<br>今日の主役は、<b>あなた</b>やで！", b: "照れるやん"},
    {k: "kineko", n: "気猫", img: "k_roll", vo: "pass1", t: "うれしすぎて<b>転げ回ってもうた</b>〜！<br>そのしぶとさ、<b>芸人向き</b>やで！", b: "起き上がって"},
    {k: "aoi", n: "葵", img: "a_smug", vo: "win", t: "…ここまで見るとか、<br><b>あんた、ほんまもんの笑い好き</b>やな。<br>気に入ったで。", b: "ありがとう"},
    {k: "aoi", n: "葵", img: "a_hari", vo: "attack", t: "そんなに見てくれるなら、<br><b>お題合戦</b>で勝負しよか！<br>うちのツッコミ、<b>受けてみ</b>！", b: "受けて立つ！"},
    {k: "aoi", n: "葵", img: "a_shock", vo: "high1", t: "えっ、まだおったん！？<br><b>びっくりしたわ！</b><br>…でも、<b>ほんまにうれしい</b>。", b: "まだいるで"},
    {k: "momoe", n: "百萌", img: "m_wave", vo: "win", t: "ずっと見てくれて、<br><b>ありがとう〜</b>💕<br>また<b>遊びに来て</b>な〜", b: "また来るね"},
    {k: "momoe", n: "百萌", img: "m_fan", vo: "high1", t: "がんばって見てくれたから、<br><b>桜の扇子</b>であおいであげる〜<br>そよそよ〜🌸", b: "すずしい〜"},
    {k: "momoe", n: "百萌", img: "m_sleep", vo: "pass1", t: "…すや…はっ！<br>ずっと見ててくれたん？<br><b>寝てる間もありがとう</b>〜", b: "おはよう"}
  ];
  (() => { let shown = false; try { shown = sessionStorage.getItem("ow-thx") === "1"; } catch (e) {} if (shown) return;
    const R = pick(THX), START = 20, END = 80;  /* 20秒で帯が出て、80秒（1分20秒）でお礼 */
    let sec = 0, cd = null;
    const iv = setInterval(() => { if (document.hidden || document.querySelector(".og-gate,.prep-wall,.fb.open,.egg")) return; ++sec;
      if (sec >= START && sec < END) { if (!cd) { cd = document.createElement("div"); cd.className = "thx-cd"; cd.setAttribute("aria-live", "off"); cd.innerHTML = `<img src="assets/img/fun/${R.img}.webp" alt=""><span>${R.n}から おしらせまで あと</span><b></b><span>秒</span><img src="assets/img/fun/${R.img}.webp" alt="">`; document.body.append(cd); requestAnimationFrame(() => cd.classList.add("on")); }
        cd.querySelector("b").textContent = END - sec; return; }
      if (sec < END) return; clearInterval(iv); if (cd) cd.remove();
      try { sessionStorage.setItem("ow-thx", "1"); } catch (e) {}
      const ov = document.createElement("div"); ov.className = "thx thx-" + R.k; ov.setAttribute("role", "dialog"); ov.setAttribute("aria-label", R.n + "からのおしらせ");
      ov.innerHTML = `<div class="thx-in"><img src="assets/img/fun/${R.img}.webp" alt=""><small class="thx-who">${R.n}より</small><p>${R.t}</p><button type="button" class="btn sm">${R.b}</button></div>`;
      document.body.append(ov); window.owSfx && owSfx("slap"); laugh(true); window.owTrack && owTrack("thx_reward", {chara: R.k, img: R.img});
      try { const a = new Audio(`assets/vo/${R.k}_${R.vo}.mp3`); if (bgmOn()) a.play().catch(() => {}); } catch (e) {}
      if (!reduce) for (let k = 0; k < 40; k++) { const c = document.createElement("i"); c.className = "thx-cf"; c.style.cssText = `left:${Math.random() * 100}vw;background:${pick(["#ffc61a", "#ff3b2f", "#ff7fb0", "#2f7fe0", "#46d96b"])};--dx:${Math.random() * 120 - 60}px;--rot:${Math.random() * 900}deg;animation-duration:${2.5 + Math.random() * 2}s;animation-delay:${Math.random() * .8}s`; c.addEventListener("animationend", () => c.remove()); document.body.append(c); }
      const close = () => ov.remove(); ov.querySelector(".btn").onclick = () => { close(); if (R.img === "a_hari") { const t = document.getElementById("gassen"); if (t) t.scrollIntoView({behavior: "smooth"}); } }; ov.onclick = e => { if (e.target === ov) close(); };
    }, 1000); })();

  const all = () => { watchLol(); watchJk(); applyTod(); };
  all(); applySeason();
  addEventListener("ow:page", () => { jkCur = ""; all(); });
})();
