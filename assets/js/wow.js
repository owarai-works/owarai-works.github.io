/* =========================================================
   トップを「超やりたくなる」ページにする仕かけ（11-22 ユーザー）
   1 開演の演出（毎回・約2.5秒・タップで飛ばせる）：幕が開く → シスターズ3人が飛び出す → 「なんでやねん！」のハンコ → 紙吹雪 → AI SCORE 0→98点
   2 お試しで1問（#try）：お題の絵＋3つの答えから選ぶ → シスターズが採点（見本の点数）→ アプリへ
   3 シスターズが話しかける：話題が画面に入るたびに、横からシスターズがカットイン（BGM が ON なら声も）
   4 残り時間：週間ランキングのリセット（毎週月曜0時・日本時間）まで あと○日○時間○分
   5 数字のカウントアップ：数字の欄が画面に入るたびに、0から勢いよく数えて「ポン」とはねる
   ========================================================= */
(() => {
  if (window.__owWow) return; window.__owWow = true;
  const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const bgmOn = () => !window.owBgm || (owBgm.isOn && owBgm.isOn());
  const voice = (k, v) => { if (!bgmOn()) return; try { const a = new Audio(`assets/vo/${k}_${v}.mp3`); a.volume = .8; a.play().catch(() => {}); } catch (e) {} };
  const sfx = n => { try { window.owSfx && owSfx(n); } catch (e) {} };

  /* ---------- 1 開演の演出 ---------- */
  function opening(){
    if (document.body.dataset.page !== "home" || $(".wow-open")) return;
    const ov = document.createElement("div"); ov.className = "wow-open"; ov.setAttribute("aria-hidden", "true");
    ov.innerHTML = `<i class="wo-rays"></i><i class="wo-cur l"></i><i class="wo-cur r"></i>
      <div class="wo-sis"><img class="s1" src="assets/img/st_aoi.webp" alt=""><img class="s2" src="assets/img/st_momoe.webp" alt=""><img class="s3" src="assets/img/st_kineko.webp" alt=""></div>
      <div class="wo-stamp"><b>なんでやねん！</b></div>
      <div class="wo-score"><small>AI SCORE</small><b><i>0</i>点</b></div>
      <canvas class="wo-cf"></canvas><p class="wo-skip">タップでスキップ</p>`;
    document.body.append(ov); document.documentElement.classList.add("wow-lock");
    let done = false; const end = () => { if (done) return; done = true; ov.classList.add("out"); document.documentElement.classList.remove("wow-lock"); setTimeout(() => ov.remove(), 500); };
    ov.addEventListener("click", end); setTimeout(end, reduce ? 900 : 2900);
    if (reduce) { ov.classList.add("go", "stamp", "score"); $(".wo-score i", ov).textContent = 98; return; }
    requestAnimationFrame(() => ov.classList.add("go"));
    setTimeout(() => { ov.classList.add("stamp"); sfx("click"); confetti($(".wo-cf", ov)); }, 900);
    setTimeout(() => { ov.classList.add("score"); const el = $(".wo-score i", ov), t0 = performance.now();
      const f = t => { const k = Math.min(1, (t - t0) / 800); el.textContent = Math.round(98 * (1 - (1 - k) ** 3)); if (k < 1) requestAnimationFrame(f); }; requestAnimationFrame(f); }, 1300);
  }
  function confetti(cv){
    const ctx = cv.getContext("2d"), W = cv.width = innerWidth, H = cv.height = innerHeight, C = ["#ffc61a", "#ff3b2f", "#ff7fb0", "#2f6fd6", "#fff"];
    const P = Array.from({length: 140}, () => ({x: W / 2, y: H * .42, vx: (Math.random() - .5) * 16, vy: -Math.random() * 15 - 4, r: Math.random() * 7 + 4, c: C[Math.random() * 5 | 0], a: Math.random() * 6, va: (Math.random() - .5) * .4}));
    const t0 = performance.now(); const f = t => { ctx.clearRect(0, 0, W, H); P.forEach(p => { p.vy += .45; p.x += p.vx; p.y += p.vy; p.a += p.va; ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.a); ctx.fillStyle = p.c; ctx.fillRect(-p.r / 2, -p.r / 4, p.r, p.r / 2); ctx.restore(); });
      if (t - t0 < 2200 && cv.isConnected) requestAnimationFrame(f); }; requestAnimationFrame(f);
  }

  /* ---------- 2 お試しで1問 ---------- */
  const TRY = {pic: "assets/img/odai/sushi.webp", odai: "回転寿司に来てみたら……", ans: [
    {t: "すみません、サーモンの隣の人ください", s: 98, k: "kineko", f: "laugh", v: "high1", c: "ちょっと待って、お腹よじれる〜！満点級やん！"},
    {t: "皿が全部、自分の顔だった", s: 82, k: "momoe", f: "smile", v: "pass1", c: "ふふっ、こわいけどおもしろいわぁ〜"},
    {t: "寿司が回ってない", s: 41, k: "aoi", f: "angry", v: "fail1", c: "それはただの寿司屋や！もうひとひねり！"}]};
  function tryMount(){
    const box = $("#try-box"); if (!box || box.dataset.on) return; box.dataset.on = "1";
    const draw = () => { box.innerHTML = `<figure class="try-pic"><img src="${TRY.pic}" alt="お題の絵"><figcaption>${TRY.odai}</figcaption></figure>
      <p class="try-q">あなたなら、どう答える？<small>1つ選んでタップ！</small></p>
      <div class="try-ans">${TRY.ans.map((a, i) => `<button type="button" data-i="${i}">${a.t}</button>`).join("")}</div>`;
      $$(".try-ans button", box).forEach(b => b.onclick = () => judge(+b.dataset.i)); };
    const judge = i => { const a = TRY.ans[i]; sfx("click"); window.owTrack && owTrack("try_answer", {i});
      box.innerHTML = `<div class="try-res"><img class="try-face" src="assets/img/ex/${a.k}_${a.f}0.webp" alt=""><div class="try-sc"><small>AI SCORE</small><b><i>0</i>点</b></div>
        <p class="try-ct">「${a.t}」</p><p class="try-cm">${a.c}</p>
        <p class="try-go">本物のゲームでは、<b>自分の言葉</b>で答えて、<b>AIが本気で採点</b>！</p>
        <div class="try-btns"><span data-store="lg"></span><button type="button" class="btn ghost try-again">もう1回えらぶ</button></div></div>`;
      if (window.owHydrate) owHydrate(box);
      const el = $(".try-sc i", box), t0 = performance.now(); const f = t => { const k = Math.min(1, (t - t0) / 900); el.textContent = Math.round(a.s * (1 - (1 - k) ** 3)); if (k < 1) requestAnimationFrame(f); else $(".try-sc", box).classList.add("pop"); }; requestAnimationFrame(f);
      voice(a.k, a.v); if (a.s >= 90) confettiIn(box);
      $(".try-again", box).onclick = draw; };
    draw();
  }
  function confettiIn(el){ const cv = document.createElement("canvas"); cv.className = "try-cf"; el.append(cv); const r = el.getBoundingClientRect();
    const ctx = cv.getContext("2d"), W = cv.width = r.width, H = cv.height = r.height, C = ["#ffc61a", "#ff3b2f", "#ff7fb0", "#2f6fd6"];
    const P = Array.from({length: 70}, () => ({x: W / 2, y: H * .3, vx: (Math.random() - .5) * 12, vy: -Math.random() * 10 - 3, r: Math.random() * 6 + 3, c: C[Math.random() * 4 | 0]}));
    const t0 = performance.now(); const f = t => { ctx.clearRect(0, 0, W, H); P.forEach(p => { p.vy += .4; p.x += p.vx; p.y += p.vy; ctx.fillStyle = p.c; ctx.fillRect(p.x, p.y, p.r, p.r / 2); }); if (t - t0 < 1800) requestAnimationFrame(f); else cv.remove(); }; requestAnimationFrame(f); }

  /* ---------- 3 シスターズのカットイン ---------- */
  const CUT = {news: ["kineko", "smile", "intro", "最新情報、見ていってな〜！"], fit: ["momoe", "smile", "pass1", "1つでも当てはまったら、もう仲間やね〜"],
    facts: ["kineko", "laugh", "high1", "数字で見ても、ボリュームすごいやろ！"], point: ["aoi", "smile", "attack", "ここがアツい！見逃したらあかんで"],
    try: ["kineko", "surprise", "special", "ほら、1問だけ答えてみて！"], odai: ["momoe", "laugh", "high1", "お題は12種類！毎日ちがうよ〜"],
    gassen: ["aoi", "angry", "attack", "お題合戦、受けて立つで！"], ranking: ["kineko", "laugh", "win", "ランキング1位、狙ってこ！"], minigame: ["momoe", "smile", "pass1", "ミニゲームでひと休みしよ〜"]};
  let cutT = 0, lastCut = 0;
  function cutIn(id){
    const c = CUT[id]; if (!c || Date.now() - lastCut < 1800) return; lastCut = Date.now();
    let el = $(".wow-cut"); if (!el) { el = document.createElement("div"); el.className = "wow-cut"; el.setAttribute("aria-hidden", "true"); document.body.append(el); }
    const side = ["aoi", "momoe"].includes(c[0]) ? "r" : "l";
    el.className = `wow-cut ${side} k-${c[0]}`; el.innerHTML = `<img src="assets/img/ex/${c[0]}_${c[1]}0.webp" alt=""><p>${c[3]}</p>`;
    void el.offsetWidth; el.classList.add("on"); voice(c[0], c[2]);
    clearTimeout(cutT); cutT = setTimeout(() => el.classList.remove("on"), 2300);
  }
  let cutIO = null;
  function cutWatch(){
    if (document.body.dataset.page !== "home") return; cutIO && cutIO.disconnect();
    cutIO = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting && e.intersectionRatio > .55) cutIn(e.target.id); }), {threshold: [.55]});
    Object.keys(CUT).forEach(id => { const s = document.getElementById(id); if (s) cutIO.observe(s); });
  }

  /* ---------- 4 残り時間（週間ランキングのリセットまで） ---------- */
  function nextMonday(){ const now = Date.now(), j = new Date(now + 9 * 36e5), d = j.getUTCDay(), add = ((8 - d) % 7) || 7;
    return Date.UTC(j.getUTCFullYear(), j.getUTCMonth(), j.getUTCDate() + add) - 9 * 36e5; }
  function countdown(){
    $$("[data-reset]").forEach(el => { const ms = Math.max(0, nextMonday() - Date.now()), d = Math.floor(ms / 864e5), h = Math.floor(ms / 36e5) % 24, m = Math.floor(ms / 6e4) % 60, s = Math.floor(ms / 1e3) % 60;
      el.innerHTML = `週間ランキング リセットまで <b>${d}</b>日<b>${String(h).padStart(2, "0")}</b>時間<b>${String(m).padStart(2, "0")}</b>分<b>${String(s).padStart(2, "0")}</b>秒`; });
  }

  /* ---------- 5 数字のカウントアップ（毎回） ---------- */
  let numIO = null;
  function numWatch(){
    numIO && numIO.disconnect();
    numIO = new IntersectionObserver(es => es.forEach(e => { if (!e.isIntersecting) return; const el = e.target, n = +el.dataset.count, t0 = performance.now(); el.classList.remove("pop");
      const f = t => { const k = Math.min(1, (t - t0) / 1200); el.textContent = Math.round(n * (1 - (1 - k) ** 4)); if (k < 1) requestAnimationFrame(f); else el.classList.add("pop"); }; requestAnimationFrame(f); }), {threshold: .6});
    $$(".facts [data-count]").forEach(el => numIO.observe(el));
  }

  const init = () => { opening(); tryMount(); cutWatch(); numWatch(); countdown(); };
  init(); setInterval(countdown, 1000);
  addEventListener("ow:page", () => { tryMount(); cutWatch(); numWatch(); countdown(); });
})();
