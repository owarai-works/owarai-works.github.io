/* =========================================================
   お笑い道場 なんでやねん 公式サイト  共通の動き
   ========================================================= */
/* ★ここだけ書きかえれば、全ページに反映されます */
/* アクセス解析のイベントを送る（Google アナリティクス） */
window.owTrack = (name, params = {}) => { try { window.gtag && gtag("event", name, params); } catch (e) {} };
window.SITE = {
  operator: "ライトルーム お笑い運営部",
  contact: "",            /* 問い合わせのメールアドレス。空のあいだは「準備中」と出ます */
  appStoreUrl: "",        /* App Store のページができたら URL を入れると、ボタンがリンクになります */
  aiEndpoint: "",         /* 本物のAIで答えるサーバーのURL（あとで足す）。空のあいだは、よくある質問だけで答える */
  year: "2026"
};

(() => {
  const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const page = document.body.dataset.page || "";
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- App Store ボタン ---------- */
  const appleSvg = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><rect x="6" y="2.5" width="12" height="19" rx="3"/><path d="M10.5 5h3"/><circle cx="12" cy="18" r="1"/></svg>`;
  const storeHTML = (lg = "") => {
    const ready = !!SITE.appStoreUrl;
    const inner = `${appleSvg}<span><small>${ready ? "Download on the" : "iPhoneアプリ"}</small><b>App Store${ready ? "" : "<em>準備中</em>"}</b></span>`;
    return ready ? `<a class="store ${lg}" href="${SITE.appStoreUrl}" target="_blank" rel="noopener">${inner}</a>` : `<span class="store ${lg}" role="note" aria-label="App Store 配信準備中">${inner}</span>`;
  };
  window.storeHTML = storeHTML;

  /* ---------- ヘッダーと下の欄 ---------- */
  const NAV = [["index.html", "HOME", "ホーム", "home"], ["news.html", "NEWS", "お知らせ", "news"], ["game.html", "GAME", "ゲーム紹介", "game"], ["banzuke.html", "RANKING", "ランキング", "banzuke"], ["hall.html", "HALL", "殿堂", "hall"], ["characters.html", "CHARACTER", "キャラクター", "chara"], ["support.html", "SUPPORT", "サポート", "support"]];
  const navA = NAV.map(([h, en, jp, k]) => `<a href="${h}"${k === page ? ' aria-current="page"' : ""}><b>${en}</b><small>${jp}</small></a>`).join("");
  const hd = document.createElement("header");
  hd.className = "hd" + (page === "home" ? "" : " always");
  hd.innerHTML = `<div class="hd-in">
      <a class="hd-logo" href="index.html" aria-label="お笑い道場 なんでやねん ホーム"><img src="assets/img/logo.webp" alt="お笑い道場 なんでやねん" width="900" height="515"></a>
      <nav class="hd-nav" aria-label="メインメニュー">${navA}</nav>
      <div class="hd-cta">${storeHTML()}</div>
      <button class="hd-menu" type="button" aria-label="メニューを開く" aria-expanded="false"><i></i><i></i><i></i></button>
    </div>`;
  document.body.prepend(hd);
  const sp = document.createElement("div");
  sp.className = "sp-menu"; sp.id = "spmenu";
  sp.innerHTML = `<nav aria-label="メニュー">${navA}${storeHTML()}</nav>`;
  hd.after(sp);
  const mb = $(".hd-menu", hd);
  const setMenu = on => { document.documentElement.classList.toggle("menu-open", on); document.body.classList.toggle("menu-open", on); mb.setAttribute("aria-expanded", on); mb.setAttribute("aria-label", on ? "メニューを閉じる" : "メニューを開く"); };
  mb.addEventListener("click", () => setMenu(!document.body.classList.contains("menu-open")));
  $$("a", sp).forEach(a => a.addEventListener("click", () => setMenu(false)));
  addEventListener("keydown", e => { if (e.key === "Escape") { setMenu(false); closeModal(); } });

  const ft = document.createElement("footer");
  ft.className = "ft";
  ft.innerHTML = `<div class="wrap">
      <div class="ft-top">
        <div class="ft-logo"><img src="assets/img/logo.webp" alt="お笑い道場 なんでやねん" width="900" height="515" loading="lazy"><p>AIが採点する、スマホで遊べるお笑いゲーム。ボケて、ツッコんで、日本一のお笑いマスターを目指そう。</p></div>
        <nav class="ft-nav" aria-label="サイトの案内">
          <a href="index.html">ホーム</a><a href="news.html">お知らせ</a><a href="game.html">ゲーム紹介</a>
          <a href="characters.html">キャラクター</a><a href="support.html">サポート</a><a href="terms.html">利用規約</a>
          <a href="banzuke.html">お題合戦 番付</a><a href="hall.html">みんなの殿堂</a><a href="privacy.html">プライバシーポリシー</a>
        </nav>
      </div>
      <div class="ft-bottom">
        <p class="note">このホームページに出てくるキャラクター・絵・文章は、すべて本ゲームのオリジナルです。無断での転載・利用はご遠慮ください。</p>
        <p>© ${SITE.year} ${SITE.operator}</p>
      </div>
    </div>`;
  document.body.append(ft);

  /* 問い合わせ先 */
  $$("[data-contact]").forEach(el => {
    if (SITE.contact) el.innerHTML = `<a class="contact-mail" href="mailto:${SITE.contact}">${SITE.contact}</a>`;
    else el.textContent = "（メールアドレスは準備中です。決まりしだい、ここに載せます）";
  });
  $$("[data-operator]").forEach(el => el.textContent = SITE.operator);
  $$("[data-store]").forEach(el => el.outerHTML = storeHTML(el.dataset.store || ""));

  /* ---------- スクロールでヘッダーを濃く ---------- */
  const onScroll = () => hd.classList.toggle("solid", scrollY > 40);
  addEventListener("scroll", onScroll, {passive: true}); onScroll();

  /* ---------- 出てくる動き ---------- */
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), {rootMargin: "0px 0px -8% 0px"});
  window.watchReveal = (root = document) => $$(".rv:not(.in)", root).forEach(el => io.observe(el));
  watchReveal();

  /* ---------- 動画の小窓 ---------- */
  let modal = null;
  window.openMovie = src => {
    if (!modal) {
      modal = document.createElement("div"); modal.className = "modal"; modal.setAttribute("role", "dialog"); modal.setAttribute("aria-modal", "true"); modal.setAttribute("aria-label", "ムービー");
      modal.innerHTML = `<div class="modal-box"><button class="modal-x" type="button" aria-label="閉じる">×</button><video controls playsinline></video></div>`;
      document.body.append(modal);
      modal.addEventListener("click", e => { if (e.target === modal || e.target.closest(".modal-x")) closeModal(); });
    }
    owTrack("movie_play", {movie: src});
    const v = $("video", modal); v.src = src; modal.classList.add("open"); v.play().catch(() => {}); $(".modal-x", modal).focus();
  };
  function closeModal(){ if (!modal) return; modal.classList.remove("open"); const v = $("video", modal); v.pause(); }
  $$("[data-movie]").forEach(b => b.addEventListener("click", () => openMovie(b.dataset.movie)));

  /* ---------- 桜と紙吹雪 ---------- */
  window.petals = (cv, opt = {}) => {
    if (!cv || reduce) return;
    const ctx = cv.getContext("2d"), N = opt.n || 46, P = [];
    let W = 0, H = 0, dpr = 1, run = true, raf = 0;
    const fit = () => { dpr = Math.min(2, devicePixelRatio || 1); W = cv.clientWidth; H = cv.clientHeight; cv.width = W * dpr; cv.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0); };
    const mk = (y) => { const gold = Math.random() < (opt.gold ?? .35); return {x: Math.random() * W, y: y ?? Math.random() * H, s: gold ? 3 + Math.random() * 4 : 6 + Math.random() * 7, vy: .35 + Math.random() * .8, vx: -.3 + Math.random() * .9, r: Math.random() * 6.3, vr: -.03 + Math.random() * .06, fl: Math.random() * 6.3, gold, hue: Math.random()}; };
    fit(); for (let i = 0; i < N; i++) P.push(mk());
    addEventListener("resize", fit);
    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      for (const p of P) {
        p.y += p.vy; p.x += p.vx + Math.sin(p.fl) * .35; p.r += p.vr; p.fl += .02;
        if (p.y > H + 20 || p.x > W + 20 || p.x < -20) Object.assign(p, mk(-20));
        ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.r);
        const sq = Math.abs(Math.cos(p.fl * 1.6));
        if (p.gold) { ctx.fillStyle = p.hue > .5 ? "rgba(255,221,128,.9)" : "rgba(242,180,60,.85)"; ctx.fillRect(-p.s / 2, -p.s * sq / 2, p.s, p.s * sq * 1.4); }
        else { ctx.scale(1, .55 + sq * .45); ctx.fillStyle = p.hue > .5 ? "rgba(255,183,206,.85)" : "rgba(255,150,186,.75)"; ctx.beginPath(); ctx.moveTo(0, -p.s); ctx.bezierCurveTo(p.s * .9, -p.s * .6, p.s * .7, p.s * .7, 0, p.s); ctx.bezierCurveTo(-p.s * .7, p.s * .7, -p.s * .9, -p.s * .6, 0, -p.s); ctx.fill(); }
        ctx.restore();
      }
      if (run) raf = requestAnimationFrame(draw);
    };
    const vis = new IntersectionObserver(([e]) => { const on = e.isIntersecting && !document.hidden; if (on && !run) { run = true; draw(); } else if (!on) { run = false; cancelAnimationFrame(raf); } });
    vis.observe(cv); document.addEventListener("visibilitychange", () => { if (document.hidden) { run = false; cancelAnimationFrame(raf); } else if (!run) { run = true; draw(); } });
    draw();
  };
  $$("canvas[data-petals]").forEach(c => petals(c, {n: +c.dataset.petals || 46}));

  /* ---------- BGM（ゲームのメニュー画面の曲「開演のテーマ」） ----------
     ゲームと同じしくみ（Web Audio）：頭とおしりの無音を切り、終わりの XF 秒を次の頭と重ねて（クロスフェード）切れ目なくループ。
     2MBの全体が読みこめるまでは、最初の14秒だけの小さな版（title_head.mp3）を先に鳴らし、用意できたら同じ位置からつなぎかえる */
  (() => {
    const KEY = "ow-bgm", POS = "ow-bgm-pos", VOL = .11, XF = 1.2;  /* VOL＝音量（0〜1）、XF＝つなぎ目を重ねる秒数 */
    const FULL = "assets/bgm/title.mp3", HEAD = "assets/bgm/title_head.mp3";
    const get = (s, k) => { try { return s.getItem(k); } catch (e) { return null; } };
    const set = (s, k, v) => { try { s.setItem(k, v); } catch (e) {} };
    const AC = window.AudioContext || window.webkitAudioContext;
    const btn = document.createElement("button");
    btn.className = "bgm"; btn.type = "button";
    btn.innerHTML = `<span class="bgm-disc" aria-hidden="true"></span><span class="bgm-bars" aria-hidden="true"><i></i><i></i><i></i><i></i></span><span class="bgm-txt"><small>BGM</small><b>OFF</b></span>`;
    document.body.append(btn);
    let on = get(localStorage, KEY) !== "0";  /* はじめから ON（OFF にした人だけ OFF） */
    let ac = null, bus = null, voices = [], timer = 0, gen = 0, playing = false, full = null, head = null, cur = null;
    const tip = txt => { if (btn.querySelector(".bgm-tip")) return; const t = document.createElement("span"); t.className = "bgm-tip"; t.textContent = txt; btn.append(t); setTimeout(() => t.remove(), 6000); };
    const noTip = () => { const t = btn.querySelector(".bgm-tip"); if (t) t.remove(); };
    const paint = () => { btn.classList.toggle("on", on); btn.querySelector("b").textContent = on ? "ON" : "OFF"; btn.setAttribute("aria-pressed", on); btn.setAttribute("aria-label", on ? "BGMを止める" : "BGMを流す"); };
    /* 頭の無音（小さなノイズも）とおしりの無音を切る（ゲームの trimTrack と同じ） */
    const trim = buf => {
      const chs = [...Array(buf.numberOfChannels)].map((_, i) => buf.getChannelData(i)), n = buf.length, sr = buf.sampleRate, W = Math.round(sr * .05);
      const rms = i => { let q = 0, m = 0; for (const c of chs) for (let j = i; j < Math.min(n, i + W); j += 4) { q += c[j] * c[j]; m++; } return Math.sqrt(q / Math.max(1, m)); };
      let s = 0, e = n - 1;
      while (s < n - W && s < sr * 8 && !(rms(s) > .02 && rms(s + W) > .02)) s += Math.round(W / 5);
      if (s >= sr * 8) s = 0;
      while (s > 0 && chs.some(c => Math.abs(c[s]) >= .03)) s--;
      s = Math.max(0, s - Math.round(sr * .01));
      while (e > s && chs.every(c => Math.abs(c[e]) < .01)) e--;
      return {buf, start: s / sr, end: (e + 1) / sr};
    };
    const load = src => fetch(src).then(r => { if (!r.ok) throw 0; return r.arrayBuffer(); }).then(a => new Promise((res, rej) => ac.decodeAudioData(a, res, rej))).then(trim);
    /* 1回分を鳴らし、終わる XF 秒前に次の1回を重ねて始める */
    const voice = (tr, when, fadeIn, g0, off = 0, loop = true) => {
      const len = tr.end - tr.start - off, g = ac.createGain(), n = ac.createBufferSource();
      n.buffer = tr.buf; n.connect(g); g.connect(bus);
      if (fadeIn) { g.gain.setValueAtTime(0, when); g.gain.linearRampToValueAtTime(1, when + fadeIn); } else g.gain.setValueAtTime(1, when);
      const endAt = when + len;
      g.gain.setValueAtTime(1, Math.max(when + (fadeIn || 0), endAt - XF)); g.gain.linearRampToValueAtTime(0, endAt);
      n.start(when, tr.start + off, len); n.stop(endAt + .05);
      const v = {n, g, tr, t0: when, off}; voices.push(v); n.onended = () => { voices = voices.filter(x => x !== v); };
      cur = v;
      if (loop) { clearTimeout(timer); timer = setTimeout(() => { if (g0 === gen && playing) voice(tr, endAt - XF, XF, g0); }, Math.max(0, (endAt - XF - ac.currentTime - 1.5) * 1000)); }
      return v;
    };
    const stopVoices = (t = .08) => { const now = ac.currentTime; voices.forEach(v => { try { v.g.gain.cancelScheduledValues(now); v.g.gain.setValueAtTime(v.g.gain.value, now); v.g.gain.linearRampToValueAtTime(0, now + t); v.n.stop(now + t + .02); } catch (e) {} }); };
    const posNow = () => { if (!cur || !ac) return 0; const L = cur.tr.end - cur.tr.start; return Math.max(0, cur.off + (ac.currentTime - cur.t0)) % L; };
    const ramp = (to, s = .9) => { if (!bus) return; const now = ac.currentTime; bus.gain.cancelScheduledValues(now); bus.gain.setValueAtTime(bus.gain.value, now); bus.gain.linearRampToValueAtTime(to, now + s); };
    /* iPhone 用：タップの中で、音のない音を一瞬鳴らして音を出せる状態にする */
    const unlock = () => { try { const b = ac.createBuffer(1, 1, 22050), s = ac.createBufferSource(); s.buffer = b; s.connect(ac.destination); s.start(0); } catch (e) {} };
    const play = async () => {
      if (!AC) return false;
      if (!ac) { ac = new AC(); bus = ac.createGain(); bus.gain.value = 0; bus.connect(ac.destination); }
      unlock();
      /* タップ前の resume() は返事がずっと来ないことがあるので、0.3秒で見切る */
      if (ac.state !== "running") await Promise.race([ac.resume().catch(() => {}), new Promise(r => setTimeout(r, 300))]);
      if (ac.state !== "running") return false;  /* ブラウザに止められた */
      if (playing) return true;
      playing = true; const g0 = ++gen; ramp(VOL, 1.2); noTip(); btn.classList.remove("wait"); paint();
      const startAt = +get(sessionStorage, POS) || 0;  /* ほかのページから来たら、続きから */
      if (!full) full = load(FULL).catch(e => { full = null; throw e; });
      if (!head && !startAt) head = load(HEAD).catch(() => null);
      let w = null; try { w = await Promise.race([full.then(t => ({f: t})), ...(head ? [head.then(t => t ? {h: t} : new Promise(() => {}))] : [])]); } catch (e) { playing = false; return false; }
      if (g0 !== gen) return true;
      if (w.f) { const L = w.f.end - w.f.start; voice(w.f, ac.currentTime + .02, .6, g0, startAt % L); return true; }
      /* 先に小さな版を鳴らし、全体が来たら同じ位置からつなぎかえる */
      const h = w.h, t0 = ac.currentTime + .02; voice(h, t0, .4, g0, 0, false);
      full.then(t => { if (g0 !== gen || !playing) return; const now = ac.currentTime, el = now + .06 - t0;
        const off = el < h.end - h.start - XF ? Math.max(0, h.start + el - t.start) : 0;
        stopVoices(.08); voice(t, now + .06, off ? .05 : .4, g0, off); }).catch(() => {});
      return true;
    };
    const stop = () => { if (!playing) return; playing = false; gen++; clearTimeout(timer); ramp(0, .4); setTimeout(() => { if (!playing) stopVoices(.05); }, 450); };
    /* ブラウザに止められたら、画面をタップ（クリック・キー）するたびに試し、鳴ったらやめる。
       スマホは「指をはなした時（touchend・click）」でないと音を出せないので、いろいろな合図で試す */
    const EV = ["click", "touchend", "pointerup", "mousedown", "keydown"];
    const offWait = () => EV.forEach(t => removeEventListener(t, tryTap, true));
    function tryTap(e){ if (e && e.target && e.target.closest && e.target.closest(".bgm")) return;  /* BGM ボタンそのものは click で扱う */
      if (!on || playing) return offWait(); play().then(ok => { if (ok) offWait(); }); }
    const start = () => {
      EV.forEach(t => addEventListener(t, tryTap, true));  /* 先に待っておく（鳴ったら外す） */
      play().then(ok => { if (ok) { offWait(); btn.classList.remove("wait"); return; }
        /* ブラウザに止められた（タップ前は音を出せない決まり）：ボタンを「タップで再生」に。
           この訪問で最初の1回だけ、どのページでも「タップでBGMスタート」の幕を出す（トップは開演の幕があるので出さない） */
        btn.classList.add("wait"); btn.querySelector("b").textContent = "TAP";
        let seen = false; try { seen = sessionStorage.getItem("ow-curtain") === "1"; } catch (e) {}
        if (!seen && !document.getElementById("curtain")) gate();
        setTimeout(() => { if (on && !playing) tip("♪ どこかをタップすると曲が流れます"); }, 1500); });
    };
    function gate(){
      try { sessionStorage.setItem("ow-curtain", "1"); } catch (e) {}
      const g = document.createElement("div"); g.className = "og-gate"; g.setAttribute("role", "dialog"); g.setAttribute("aria-label", "BGMを流す");
      g.innerHTML = `<div class="og-box"><img src="assets/img/logo.webp" alt=""><button type="button" class="og-go">♪ タップで開演！</button><button type="button" class="og-mute">音なしで見る</button></div>`;
      document.body.append(g);
      const close = snd => { if (snd) { play().then(ok => { if (ok) offWait(); }); } else { on = false; set(localStorage, KEY, "0"); paint(); offWait(); } g.classList.add("out"); setTimeout(() => g.remove(), 450); };
      g.querySelector(".og-go").onclick = () => close(true);
      g.querySelector(".og-mute").onclick = e => { e.stopPropagation(); close(false); };
      g.onclick = e => { if (e.target === g) close(true); };
    }
    /* トップの「タップで開演」の幕から使う */
    window.owBgm = {isOn: () => on, play: () => { if (on) play().then(ok => { if (ok) offWait(); }); }, off: () => { if (!on) return; on = false; set(localStorage, KEY, "0"); paint(); stop(); offWait(); }};
    btn.addEventListener("click", e => {
      e.stopPropagation(); noTip();
      if (on && !playing) { play(); return; }  /* ON なのにまだ鳴っていない（ブラウザに止められた）ときは、流すだけ */
      on = !on; set(localStorage, KEY, on ? "1" : "0"); paint(); owTrack("bgm_toggle", {on});
      if (on) start(); else stop();
    });
    addEventListener("pagehide", () => { set(sessionStorage, POS, playing ? posNow() : 0); });
    /* 動画を見るあいだは小さく */
    document.addEventListener("play", e => { if (e.target.tagName === "VIDEO" && !e.target.muted && playing) ramp(VOL * .15, .4); }, true);
    document.addEventListener("pause", e => { if (e.target.tagName === "VIDEO" && !e.target.muted && playing) ramp(VOL, .6); }, true);
    paint();
    if (window.OW_PREP) return;  /* 準備中の幕のあいだは曲を流さない */
    if (on) start();
    else if (get(sessionStorage, "ow-bgm-tip") !== "1") { set(sessionStorage, "ow-bgm-tip", "1"); tip("♪ ゲームの曲を流せます"); }
  })();

  /* ---------- お知らせ ---------- */
  const esc = s => String(s).replace(/[&<>"]/g, c => ({"&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;"}[c]));
  window.newsItemHTML = (n, i = 0) => `<a class="news-item rv d${Math.min(i, 4)}" href="article.html?id=${encodeURIComponent(n.id)}"><time datetime="${n.date.replace(/\./g, "-")}">${n.date}</time><span class="tag ${n.tag}">${NEWS_TAG[n.tag] || "お知らせ"}</span><h3>${esc(n.title)}</h3><span class="go" aria-hidden="true">→</span></a>`;
  $$("[data-news-latest]").forEach(el => { el.innerHTML = (window.NEWS || []).slice(0, +el.dataset.newsLatest || 3).map(newsItemHTML).join(""); watchReveal(el); });
  /* ---------- ページを移っても BGM を止めない：リンクを押したら、ページを読み直さずに中身（main）だけ入れかえる ---------- */
  window.owHydrate = (root = document) => {
    $$("[data-contact]", root).forEach(el => { el.innerHTML = SITE.contact ? `<a class="contact-mail" href="mailto:${SITE.contact}">${SITE.contact}</a>` : "（メールアドレスは準備中です。決まりしだい、ここに載せます）"; });
    $$("[data-operator]", root).forEach(el => el.textContent = SITE.operator);
    $$("[data-store]", root).forEach(el => el.outerHTML = storeHTML(el.dataset.store || ""));
    $$("[data-movie]", root).forEach(b => b.addEventListener("click", () => openMovie(b.dataset.movie)));
    $$("canvas[data-petals]", root).forEach(c => petals(c, {n: +c.dataset.petals || 46}));
    $$("[data-news-latest]", root).forEach(el => { el.innerHTML = (window.NEWS || []).slice(0, +el.dataset.newsLatest || 3).map(newsItemHTML).join(""); });
    watchReveal(root);
  };
  const loaded = new Set();
  const loadScript = src => (loaded.has(src) || $$("script[src]").some(x => x.src === src)) ? Promise.resolve() : new Promise(r => { const t = document.createElement("script"); t.src = src; t.onload = t.onerror = () => { loaded.add(src); r(); }; document.body.append(t); });
  const loadCss = href => $$('link[rel="stylesheet"]').some(l => l.href === href) ? Promise.resolve() : new Promise(r => { const l = document.createElement("link"); l.rel = "stylesheet"; l.href = href; l.onload = l.onerror = r; document.head.append(l); });
  let navBusy = false;
  async function go(url, push = true){
    if (navBusy) return; navBusy = true;
    try {
      const r = await fetch(url, {credentials: "same-origin"}); if (!r.ok) throw 0;
      const doc = new DOMParser().parseFromString(await r.text(), "text/html"), nm = doc.querySelector("main"); if (!nm) throw 0;
      await Promise.all([...doc.querySelectorAll('link[rel="stylesheet"]')].map(l => loadCss(new URL(l.getAttribute("href"), url).href)));
      if (push) history.pushState({ow: 1}, "", url);
      document.title = doc.title;
      const dsc = doc.querySelector('meta[name="description"]'), cur = document.querySelector('meta[name="description"]'); if (dsc && cur) cur.content = dsc.content;
      const pg = doc.body.dataset.page || ""; document.body.dataset.page = pg;
      hd.className = "hd" + (pg === "home" ? "" : " always"); onScroll();
      $$(".hd-nav a, .sp-menu nav a").forEach(a => { const k = (NAV.find(n => n[0] === a.getAttribute("href")) || [])[3]; if (k === pg) a.setAttribute("aria-current", "page"); else a.removeAttribute("aria-current"); });
      const c = document.getElementById("curtain"); if (c) c.remove();
      document.documentElement.style.overflow = "";
      const om = document.querySelector("main"), m = document.importNode(nm, true); om.replaceWith(m);
      setMenu(false);
      const u = new URL(url, location.href);
      if (u.hash && document.getElementById(u.hash.slice(1))) document.getElementById(u.hash.slice(1)).scrollIntoView(); else scrollTo(0, 0);
      for (const t of doc.querySelectorAll("script[src]")) await loadScript(new URL(t.getAttribute("src"), url).href);
      owHydrate(m);
      for (const t of doc.querySelectorAll("script:not([src]):not([type])")) { if (t.textContent.includes("幕あけ")) continue; try { new Function(t.textContent)(); } catch (e) { console.error(e); } }
      window.owFaqMount && owFaqMount(); window.owRankMount && owRankMount();
      dispatchEvent(new Event("ow:page"));
    } catch (e) { location.href = url; }
    navBusy = false;
  }
  document.addEventListener("click", e => {
    if (e.defaultPrevented || e.button || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    const a = e.target.closest("a[href]"); if (!a || a.target || a.hasAttribute("download")) return;
    const u = new URL(a.href, location.href); if (u.origin !== location.origin) return;
    if (!/(\.html|\/)$/.test(u.pathname)) return;
    if (u.pathname === location.pathname && u.search === location.search) return;  /* 同じページの中（#〜）はふつうに動く */
    e.preventDefault(); go(u.href);
  });
  addEventListener("popstate", () => go(location.href, false));
})();
/* 数字のカウントアップ（data-count） */
(() => { const io = new IntersectionObserver(es => es.forEach(e => { if (!e.isIntersecting) return; io.unobserve(e.target); const el = e.target, n = +el.dataset.count, t0 = performance.now();
  const f = t => { const k = Math.min(1, (t - t0) / 1100); el.textContent = Math.round(n * (1 - (1 - k) ** 3)); if (k < 1) requestAnimationFrame(f); }; requestAnimationFrame(f); }), {threshold: .6});
  const scan = () => document.querySelectorAll("[data-count]:not([data-cw])").forEach(el => { el.dataset.cw = 1; io.observe(el); });
  scan(); addEventListener("ow:page", scan); })();
/* App Store ボタン（準備中）やお題合戦のボタンを押した数 */
document.addEventListener("click", e => { const t = e.target.closest(".store,.og-go,.gate-go,.hero-co,.btn"); if (!t || t.matches(".dm-go,.dm-next,.dm-again,.dm-share")) return;
  owTrack(t.matches(".store") ? "store_click" : t.matches(".og-go,.gate-go") ? "gate_open" : t.matches(".hero-co") ? "collab_click" : "button_click", {label: (t.textContent || "").trim().slice(0, 40)}); });
