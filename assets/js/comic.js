/* =========================================================
   11-22 ユーザー「今すぐ読むを押したら、ゲームのように自動コマ送り＋フルボイス＋音楽で見せる。
   そのあいだはホームページの歌・BGMを止め、閉じたら再開」
   第1話の4ページ（assets/img/cm_e01_p1〜4.webp・688×1024）を、コマごとに大きく映す。
   コマの位置と声の時間は assets/comic/e01.json（ゲームの COMIC_KOMA[1] から）。
   [x, y, 幅, 高さ, [[声の始まりの秒, 長さ], …]]。声は assets/comic/k01.mp3、音楽は assets/comic/bgm01.mp3
   ========================================================= */
(() => {
  if (window.__owComic) return; window.__owComic = true;
  const PW = 688, PH = 1024, PAGES = [1, 2, 3, 4].map(n => `assets/img/cm_e01_p${n}.webp`);
  const $ = (s, r = document) => r.querySelector(s);
  let data = null, ov = null, voice = null, bgm = null, timer = 0, idx = 0, list = [], paused = false, bgmWas = false;

  const flat = () => { list = []; data.forEach((pg, p) => pg.forEach((k, i) => list.push({p, i, n: pg.length, r: k.slice(0, 4), v: k[4] || [], fx: k[5] || "", cam: k[6] || "", sf: k[7] || []}))); };

  /* ---------- 11-22 ユーザー「ゲームの漫画コーナーと同じエフェクトと効果音」 ----------
     コマのデータ（e01.json）の5番目＝エフェクトの字（z ずっこけ・k ビシッ・i ドーン・s ショック・a 怒り・w 勝利・u びっくり・d あせり・r 雷・t ブルブル・g 光・l 笑い・f 回想）、
     6番目＝カメラ（p 顔に寄る・t 縦長を足もとから）、7番目＝オノマトペの効果音（don・doki・pan・bachi・zuko など）。音はゲームと同じ作り（一部は assets/comic/se の音） */
  let AC = null, SB = {};
  const ac = () => { if (!AC) { const C = window.AudioContext || window.webkitAudioContext; if (!C) return null; AC = new C(); } if (AC.state !== "running") AC.resume().catch(() => {}); return AC; };
  const vol = () => .55;
  const tone = (f, d, type = "sine", g = .3, at = 0, f2 = 0) => { const a = ac(); if (!a) return; const t = a.currentTime + at, o = a.createOscillator(), v = a.createGain(); o.type = type; o.frequency.setValueAtTime(f, t); if (f2) o.frequency.exponentialRampToValueAtTime(Math.max(20, f2), t + d); v.gain.setValueAtTime(g * vol(), t); v.gain.exponentialRampToValueAtTime(.001, t + d); o.connect(v); v.connect(a.destination); o.start(t); o.stop(t + d + .02); };
  const noise = (d, f = 1000, q = 1, g = .3, at = 0, type = "bandpass") => { const a = ac(); if (!a) return; const t = a.currentTime + at, n = Math.floor(a.sampleRate * d), b = a.createBuffer(1, n, a.sampleRate), c = b.getChannelData(0); for (let i = 0; i < n; i++) c[i] = (Math.random() * 2 - 1) * (1 - i / n);
    const s = a.createBufferSource(), fl = a.createBiquadFilter(), v = a.createGain(); s.buffer = b; fl.type = type; fl.frequency.value = f; fl.Q.value = q; v.gain.value = g * vol(); s.connect(fl); fl.connect(v); v.connect(a.destination); s.start(t); };
  const file = (n, v = 1) => { const a = ac(); if (!a) return; if (!SB[n]) SB[n] = fetch(`assets/comic/se/${n}.mp3`).then(r => r.arrayBuffer()).then(x => new Promise((ok, ng) => a.decodeAudioData(x, ok, ng))).catch(() => { delete SB[n]; return null; });
    SB[n].then(b => { if (!b || !ov.classList.contains("open")) return; const s = a.createBufferSource(), g = a.createGain(); s.buffer = b; g.gain.value = v * vol(); s.connect(g); g.connect(a.destination); s.start(); }); };
  let lastLaugh = 0;
  const SND = {don: () => { file("taiko"); tone(70, .6, "sine", .5, 0, 38); }, pan: () => { tone(1400, .05, "square", .25); tone(900, .08, "square", .2, .03); noise(.06, 3000, 1, .45); }, bishi: () => { noise(.13, 4200, .8, .5, 0, "highpass"); tone(1900, .09, "triangle", .2, 0, 600); },
    zuko: () => { tone(620, .5, "triangle", .26, 0, 110); noise(.18, 420, 1, .5, .48); }, gaan: () => { tone(98, 1.3, "sawtooth", .16); tone(104, 1.3, "sawtooth", .14); tone(147, 1.3, "square", .07); },
    doki: () => file("heart1"), bachi: () => { noise(.7, 1800, 4, .22); noise(.7, 150, 1, .3, 0, "lowpass"); }, dash: () => [0, .08, .16, .24, .32, .4].forEach(d => noise(.05, 900, 2, .35, d)),
    pin: () => [0, .15, .3, .45].forEach(d => tone(2000, .08, "square", .1, d)), clap: () => file("clap", .55), laugh: () => { if (Date.now() - lastLaugh < 3500) return; lastLaugh = Date.now(); file("laugh" + (1 + Math.floor(Math.random() * 4)), .5); },
    crow: () => { tone(760, .22, "sawtooth", .1, 0, 520); tone(760, .22, "sawtooth", .1, .3, 520); }, tiny: () => noise(.05, 2500, 2, .3), kira: () => file("kira1"), rumble: () => { file("taiko", .7); noise(.9, 110, 1, .55, 0, "lowpass"); },
    turn: () => { noise(.09, 2600, .6, .2); noise(.05, 5200, 1, .1, .05, "highpass"); }};
  const snd = k => { try { (SND[k] || (() => {}))(); } catch (e) {} };
  const re = (el, c) => { el.classList.remove(c); void el.offsetWidth; el.classList.add(c); };
  const part = (cls, x, y, st = {}) => { const fxL = $(".cmp-fxl", ov); if (!fxL) return; const e = document.createElement("i"); e.className = "kp " + cls; e.style.left = x + "px"; e.style.top = y + "px"; Object.entries(st).forEach(([k, v]) => k.startsWith("--") ? e.style.setProperty(k, v) : (e.style[k] = v)); fxL.append(e); setTimeout(() => e.remove(), 2600); };
  let fxT = [];
  const later = (ms, f) => fxT.push(setTimeout(f, ms));
  function fx(k, pageTurn){
    fxT.forEach(clearTimeout); fxT = [];
    const el = $(".cmp-k", ov), fl = $(".cmp-fl", ov), sl = $(".cmp-sl", ov), tint = $(".cmp-tint", ov);
    tint.className = "cmp-tint"; el.style.filter = ""; el.classList.remove("zin");
    if (pageTurn) { re($(".cmp-turn", ov), "on"); snd("turn"); }
    const has = c => k.fx.includes(c), W = el.clientWidth, Hh = el.clientHeight, noSf = !k.sf.some(Boolean);
    if (has("f")) el.style.filter = "sepia(.85) contrast(.95) brightness(1.03)";
    if (k.cam === "p") later(560, () => el.classList.add("zin"));
    later(480, () => {
      k.sf.forEach((n, i) => later(i * 260, () => n && snd(n)));
      if (has("z")) { re(el, "shz"); if (noSf) snd("zuko"); }
      if (has("k")) { re(fl, "on"); re(el, "shk"); if (noSf) snd("bishi"); }
      if (has("i")) { re(fl, "on"); re(el, "shi"); if (noSf) snd("don"); }
      if (has("s")) { tint.classList.add("s"); re(el, "sht"); if (noSf) snd("gaan"); }
      if (has("a")) { tint.classList.add("a"); for (let i = 0; i < 2; i++) part("kp-ag", W * (.15 + .6 * Math.random()), Hh * (.08 + .25 * Math.random()), {animationDelay: i * .25 + "s"}); }
      if (has("w")) { snd("kira"); if (!has("l")) snd("clap"); for (let i = 0; i < 10; i++) part("kp-st", W * Math.random(), Hh * Math.random(), {animationDelay: Math.random() * .6 + "s"});
        for (let i = 0; i < 26; i++) part("kp-cf", W * Math.random(), -20, {animationDelay: Math.random() * .7 + "s", "--c": ["#ff5d8f", "#ffd34d", "#5ec8ff", "#7be0a8", "#c58bff"][i % 5], "--fall": Hh + 40 + "px"}); }
      if (has("u")) { re(sl, "on"); re(el, "shu"); }
      if (has("d")) for (let i = 0; i < 3; i++) part("kp-sw", W * (.2 + .6 * Math.random()), Hh * (.1 + .3 * Math.random()), {animationDelay: i * .3 + "s"});
      if (has("r")) { fl.classList.add("dk"); re(fl, "on"); later(400, () => fl.classList.remove("dk")); part("kp-bolt", W * (.1 + .7 * Math.random()), 0); snd("rumble"); }
      if (has("t")) re(el, "sht");
      if (has("g")) { snd("clap"); for (let i = 0; i < 16; i++) part("kp-cf", W * Math.random(), -20, {animationDelay: .5 + Math.random() * .8 + "s", "--c": ["#ff5d8f", "#ffd34d", "#5ec8ff", "#7be0a8", "#c58bff"][i % 5], "--fall": Hh + 40 + "px"}); }
      if (has("l")) { re(el, "shl"); if (!k.sf.some(n => n === "laugh" || n === "clap")) snd("laugh"); }
    });
  }
  const clear = () => { clearTimeout(timer); timer = 0; };

  function build(){
    ov = document.createElement("div"); ov.className = "cmp"; ov.setAttribute("role", "dialog"); ov.setAttribute("aria-modal", "true"); ov.setAttribute("aria-label", "漫画 第1話「跡継ぎ宣言」");
    ov.innerHTML = `<div class="cmp-top"><b>第1話「跡継ぎ宣言」</b><span class="cmp-pg"></span><button type="button" class="cmp-x" aria-label="閉じる">×</button></div>
      <div class="cmp-stage"><div class="cmp-kw"><div class="cmp-k" role="img" aria-label="漫画のコマ"></div><i class="cmp-tint"></i><i class="cmp-sl"></i><i class="cmp-fl"></i><i class="cmp-turn"></i><div class="cmp-fxl"></div></div></div>
      <p class="cmp-cap" aria-live="polite"></p>
      <div class="cmp-bar"><button type="button" class="cmp-prev" aria-label="次のコマ">‹</button><button type="button" class="cmp-pause" aria-label="一時停止">❚❚</button><button type="button" class="cmp-next" aria-label="前のコマ">›</button></div>
      <div class="cmp-end" hidden><b>このあと、どうなる──！？</b><p>第2話「朝ごはん戦争」から先は、アプリで読めます。<br>全30話、<b>フルボイス・自動コマ送り</b>で！</p><div class="cmp-store"></div><button type="button" class="cmp-again">▶ もう一度見る</button></div>`;
    document.body.append(ov);
    if (window.storeHTML) $(".cmp-store", ov).innerHTML = storeHTML("lg");
    $(".cmp-x", ov).onclick = close;
    ov.addEventListener("click", e => { if (e.target === ov) close(); });
    /* 11-22 ユーザー「左を押したら進む」：漫画は右から左へ読むので、左＝次・右＝前 */
    $(".cmp-prev", ov).onclick = () => go(idx + 1);
    $(".cmp-next", ov).onclick = () => go(Math.max(0, idx - 1));
    $(".cmp-stage", ov).onclick = () => go(idx + 1);
    $(".cmp-pause", ov).onclick = () => { paused = !paused; $(".cmp-pause", ov).textContent = paused ? "▶" : "❚❚"; $(".cmp-pause", ov).setAttribute("aria-label", paused ? "再生" : "一時停止");
      if (paused) { clear(); voice.pause(); bgm.pause(); } else { bgm.play().catch(() => {}); go(idx); } };
    $(".cmp-again", ov).onclick = () => go(0);
    addEventListener("keydown", e => { if (!ov.classList.contains("open")) return; if (e.key === "Escape") close(); else if (e.key === "ArrowLeft") go(idx + 1); else if (e.key === "ArrowRight") go(Math.max(0, idx - 1)); });
    addEventListener("resize", () => { if (ov.classList.contains("open") && list[idx]) frame(list[idx], true); });
  }

  /* コマを画面いっぱいに映す（ページの絵を大きくして、そのコマの所だけ見せる） */
  function frame(k, now){
    const st = $(".cmp-stage", ov), el = $(".cmp-k", ov), [x, y, w, h] = k.r;
    const mw = st.clientWidth, mh = st.clientHeight, s = Math.min(mw / w, mh / h);
    if (now) el.style.transition = "none";
    el.style.backgroundImage = `url(${PAGES[k.p]})`;
    el.style.width = Math.round(w * s) + "px"; el.style.height = Math.round(h * s) + "px";
    el.style.backgroundSize = `${PW * s}px ${PH * s}px`; el.style.backgroundPosition = `${-x * s}px ${-y * s}px`;
    if (now) { void el.offsetWidth; el.style.transition = ""; }
    $(".cmp-pg", ov).textContent = `${k.p + 1} / 4ページ`;
  }

  function go(i){
    clear(); if (!list.length) return;
    $(".cmp-end", ov).hidden = true; $(".cmp-stage", ov).hidden = false; $(".cmp-bar", ov).hidden = false;
    if (i >= list.length) return finish();
    const prevP = list[idx] ? list[idx].p : -1; idx = i; const k = list[i]; frame(k, false); if (!paused) fx(k, i > 0 && k.p !== prevP);
    if (paused) return;
    const segs = k.v;
    if (!segs.length) { voice.pause(); timer = setTimeout(() => go(idx + 1), k.cam === "t" ? 3300 : 1700); return; }
    const t0 = segs[0][0], t1 = segs[segs.length - 1][0] + segs[segs.length - 1][1];
    try { voice.currentTime = t0; } catch (e) {}
    voice.play().catch(() => {});
    timer = setTimeout(() => { voice.pause(); timer = setTimeout(() => go(idx + 1), 650); }, (t1 - t0) * 1000 + 120);
  }

  function finish(){ clear(); voice.pause(); $(".cmp-stage", ov).hidden = true; $(".cmp-bar", ov).hidden = true; $(".cmp-end", ov).hidden = false; window.owTrack && owTrack("comic_end", {ep: 1}); }

  async function open(){
    ac();  /* 押したその場で効果音を出せるように */
    if (!ov) build();
    /* ホームページの歌・BGMを止める（閉じたら再開） */
    try { bgmWas = !!(window.owBgm && owBgm.hush && owBgm.hush()); } catch (e) { bgmWas = false; }
    /* iPhone：押したその場で音を出せるようにしておく */
    if (!voice) { voice = new Audio("assets/comic/k01.mp3"); voice.preload = "auto"; bgm = new Audio("assets/comic/bgm01.mp3"); bgm.loop = true; bgm.preload = "auto"; }
    const vol = window.owVol ? owVol() : .5;
    voice.volume = 1; bgm.volume = Math.max(.05, Math.min(.45, vol * .6));
    voice.currentTime = 0; voice.play().catch(() => {});  /* 11-22 ユーザー「最初のナレーションが聞こえない」：前は音を出せるようにするため鳴らしてすぐ止めていて、その「止める」が1コマ目の声を止めていた。最初の声は0秒からなので、そのまま鳴らす */ bgm.currentTime = 0; bgm.play().catch(() => {});
    ov.classList.add("open"); document.documentElement.classList.add("cmp-lock"); paused = false; $(".cmp-pause", ov).textContent = "❚❚";
    $(".cmp-x", ov).focus(); window.owTrack && owTrack("comic_play", {ep: 1});
    if (!data) { try { data = await (await fetch("assets/comic/e01.json")).json(); flat(); } catch (e) { return; } }
    /* 11-22 ユーザー「コマが映る直前に一瞬まっ白になる」：ページの絵を先に全部読みこんでおく（読みこむ前の白が見えていた） */
    if (!window.__owCmImgs) window.__owCmImgs = Promise.all(PAGES.map(src => new Promise(r => { const im = new Image(); im.onload = im.onerror = () => (im.decode ? im.decode().catch(() => {}) : Promise.resolve()).then(r); im.src = src; (window.__owCmKeep = window.__owCmKeep || []).push(im); })));
    await Promise.race([window.__owCmImgs, new Promise(r => setTimeout(r, 4000))]);
    if (voice.readyState < 1) await new Promise(r => { voice.addEventListener("loadedmetadata", r, {once: true}); setTimeout(r, 3000); });
    frame(list[0], true); go(0);
  }

  function close(){
    if (!ov) return; clear(); fxT.forEach(clearTimeout); fxT = []; voice && voice.pause(); bgm && bgm.pause();
    ov.classList.remove("open"); document.documentElement.classList.remove("cmp-lock");
    if (bgmWas && window.owBgm) { bgmWas = false; try { owBgm.resume(); } catch (e) {} }
  }

  document.addEventListener("click", e => { const b = e.target.closest && e.target.closest("[data-comic-play]"); if (!b) return; e.preventDefault(); e.stopPropagation(); open(); }, true);
})();
