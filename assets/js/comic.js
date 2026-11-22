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

  const flat = () => { list = []; data.forEach((pg, p) => pg.forEach((k, i) => list.push({p, i, n: pg.length, r: k.slice(0, 4), v: k[4] || []}))); };
  const clear = () => { clearTimeout(timer); timer = 0; };

  function build(){
    ov = document.createElement("div"); ov.className = "cmp"; ov.setAttribute("role", "dialog"); ov.setAttribute("aria-modal", "true"); ov.setAttribute("aria-label", "漫画 第1話「跡継ぎ宣言」");
    ov.innerHTML = `<div class="cmp-top"><b>第1話「跡継ぎ宣言」</b><span class="cmp-pg"></span><button type="button" class="cmp-x" aria-label="閉じる">×</button></div>
      <div class="cmp-stage"><div class="cmp-k" role="img" aria-label="漫画のコマ"></div></div>
      <p class="cmp-cap" aria-live="polite"></p>
      <div class="cmp-bar"><button type="button" class="cmp-prev" aria-label="前のコマ">‹</button><button type="button" class="cmp-pause" aria-label="一時停止">❚❚</button><button type="button" class="cmp-next" aria-label="次のコマ">›</button></div>
      <div class="cmp-end" hidden><b>このあと、どうなる──！？</b><p>第2話「朝ごはん戦争」から先は、アプリで読めます。<br>全30話、<b>フルボイス・自動コマ送り</b>で！</p><div class="cmp-store"></div><button type="button" class="cmp-again">▶ もう一度見る</button></div>`;
    document.body.append(ov);
    if (window.storeHTML) $(".cmp-store", ov).innerHTML = storeHTML("lg");
    $(".cmp-x", ov).onclick = close;
    ov.addEventListener("click", e => { if (e.target === ov) close(); });
    $(".cmp-next", ov).onclick = () => go(idx + 1);
    $(".cmp-prev", ov).onclick = () => go(Math.max(0, idx - 1));
    $(".cmp-stage", ov).onclick = () => go(idx + 1);
    $(".cmp-pause", ov).onclick = () => { paused = !paused; $(".cmp-pause", ov).textContent = paused ? "▶" : "❚❚"; $(".cmp-pause", ov).setAttribute("aria-label", paused ? "再生" : "一時停止");
      if (paused) { clear(); voice.pause(); bgm.pause(); } else { bgm.play().catch(() => {}); go(idx); } };
    $(".cmp-again", ov).onclick = () => go(0);
    addEventListener("keydown", e => { if (!ov.classList.contains("open")) return; if (e.key === "Escape") close(); else if (e.key === "ArrowRight") go(idx + 1); else if (e.key === "ArrowLeft") go(Math.max(0, idx - 1)); });
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
    idx = i; const k = list[i]; frame(k, false);
    if (paused) return;
    const segs = k.v;
    if (!segs.length) { voice.pause(); timer = setTimeout(() => go(idx + 1), 1700); return; }
    const t0 = segs[0][0], t1 = segs[segs.length - 1][0] + segs[segs.length - 1][1];
    try { voice.currentTime = t0; } catch (e) {}
    voice.play().catch(() => {});
    timer = setTimeout(() => { voice.pause(); timer = setTimeout(() => go(idx + 1), 650); }, (t1 - t0) * 1000 + 120);
  }

  function finish(){ clear(); voice.pause(); $(".cmp-stage", ov).hidden = true; $(".cmp-bar", ov).hidden = true; $(".cmp-end", ov).hidden = false; window.owTrack && owTrack("comic_end", {ep: 1}); }

  async function open(){
    if (!ov) build();
    /* ホームページの歌・BGMを止める（閉じたら再開） */
    try { bgmWas = !!(window.owBgm && owBgm.hush && owBgm.hush()); } catch (e) { bgmWas = false; }
    /* iPhone：押したその場で音を出せるようにしておく */
    if (!voice) { voice = new Audio("assets/comic/k01.mp3"); voice.preload = "auto"; bgm = new Audio("assets/comic/bgm01.mp3"); bgm.loop = true; bgm.preload = "auto"; }
    const vol = window.owVol ? owVol() : .5;
    voice.volume = 1; bgm.volume = Math.max(.05, Math.min(.45, vol * .6));
    voice.play().then(() => voice.pause()).catch(() => {}); bgm.currentTime = 0; bgm.play().catch(() => {});
    ov.classList.add("open"); document.documentElement.classList.add("cmp-lock"); paused = false; $(".cmp-pause", ov).textContent = "❚❚";
    $(".cmp-x", ov).focus(); window.owTrack && owTrack("comic_play", {ep: 1});
    if (!data) { try { data = await (await fetch("assets/comic/e01.json")).json(); flat(); } catch (e) { return; } }
    if (voice.readyState < 1) await new Promise(r => { voice.addEventListener("loadedmetadata", r, {once: true}); setTimeout(r, 3000); });
    frame(list[0], true); go(0);
  }

  function close(){
    if (!ov) return; clear(); voice && voice.pause(); bgm && bgm.pause();
    ov.classList.remove("open"); document.documentElement.classList.remove("cmp-lock");
    if (bgmWas && window.owBgm) { bgmWas = false; try { owBgm.resume(); } catch (e) {} }
  }

  document.addEventListener("click", e => { const b = e.target.closest && e.target.closest("[data-comic-play]"); if (!b) return; e.preventDefault(); e.stopPropagation(); open(); }, true);
})();
