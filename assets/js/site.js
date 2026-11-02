/* =========================================================
   お笑い道場 なんでやねん 公式サイト  共通の動き
   ========================================================= */
/* ★ここだけ書きかえれば、全ページに反映されます */
window.SITE = {
  operator: "お笑い道場 運営",
  contact: "",            /* 問い合わせのメールアドレス。空のあいだは「準備中」と出ます */
  appStoreUrl: "",        /* App Store のページができたら URL を入れると、ボタンがリンクになります */
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
  const NAV = [["index.html", "HOME", "ホーム", "home"], ["news.html", "NEWS", "お知らせ", "news"], ["game.html", "GAME", "ゲーム紹介", "game"], ["characters.html", "CHARACTER", "キャラクター", "chara"], ["support.html", "SUPPORT", "サポート", "support"]];
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
          <a href="privacy.html">プライバシーポリシー</a>
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

  /* ---------- BGM（ゲームのメニュー画面の曲「開演のテーマ」） ---------- */
  (() => {
    const KEY = "ow-bgm", POS = "ow-bgm-pos";
    const get = (s, k) => { try { return s.getItem(k); } catch (e) { return null; } };
    const set = (s, k, v) => { try { s.setItem(k, v); } catch (e) {} };
    const au = new Audio("assets/bgm/title.mp3"); au.loop = true; au.preload = "none"; au.volume = 0;
    const btn = document.createElement("button");
    btn.className = "bgm"; btn.type = "button";
    btn.innerHTML = `<span class="bgm-disc" aria-hidden="true"></span><span class="bgm-bars" aria-hidden="true"><i></i><i></i><i></i><i></i></span><span class="bgm-txt"><small>BGM</small><b>OFF</b></span>`;
    document.body.append(btn);
    const VOL = .22;  /* BGM の音量（0〜1） */
    let on = get(localStorage, KEY) !== "0", fadeT = 0;  /* はじめから ON（OFF にした人だけ OFF） */
    const fade = (to, ms = 900, done) => { clearInterval(fadeT); const from = au.volume, t0 = performance.now(); fadeT = setInterval(() => { const k = Math.min(1, (performance.now() - t0) / ms); au.volume = from + (to - from) * k; if (k >= 1) { clearInterval(fadeT); done && done(); } }, 30); };
    const paint = () => { btn.classList.toggle("on", on); btn.querySelector("b").textContent = on ? "ON" : "OFF"; btn.setAttribute("aria-pressed", on); btn.setAttribute("aria-label", on ? "BGMを止める" : "BGMを流す"); };
    const play = () => { const p = +get(sessionStorage, POS) || 0; if (p && !au.currentTime) { try { au.currentTime = p; } catch (e) {} } return au.play().then(() => { fade(VOL); const t = btn.querySelector(".bgm-tip"); if (t) t.remove(); }); };
    const start = () => play().catch(() => {
      /* ブラウザに止められたら、最初のタップで流す */
      const once = e => { if (e.target.closest && e.target.closest(".bgm")) return;  /* BGM ボタンそのものは click で扱う */
        ["pointerdown", "keydown", "touchend"].forEach(t => removeEventListener(t, once, true)); if (on && au.paused) play().catch(() => {}); };
      ["pointerdown", "keydown", "touchend"].forEach(t => addEventListener(t, once, true));
    });
    btn.addEventListener("click", e => {
      e.stopPropagation();
      if (on && au.paused) { au.preload = "auto"; play().catch(() => {}); return; }  /* ON なのにまだ鳴っていない（ブラウザに止められた）ときは、流すだけ */
      on = !on; set(localStorage, KEY, on ? "1" : "0"); paint();
      const tip = btn.querySelector(".bgm-tip"); if (tip) tip.remove();
      if (on) { au.preload = "auto"; start(); } else fade(0, 400, () => au.pause());
    });
    addEventListener("pagehide", () => { if (!au.paused) set(sessionStorage, POS, au.currentTime); });
    /* 動画を見るあいだは小さく */
    document.addEventListener("play", e => { if (e.target.tagName === "VIDEO" && !e.target.muted && on) fade(.06, 400); }, true);
    document.addEventListener("pause", e => { if (e.target.tagName === "VIDEO" && !e.target.muted && on && !au.paused) fade(VOL, 600); }, true);
    paint();
    if (on) { au.preload = "auto"; start(); setTimeout(() => { if (on && au.paused && !btn.querySelector(".bgm-tip")) { const t = document.createElement("span"); t.className = "bgm-tip"; t.textContent = "♪ タップで曲が流れます"; btn.append(t); setTimeout(() => t.remove(), 6000); } }, 2600); }
    else if (get(sessionStorage, "ow-bgm-tip") !== "1") { set(sessionStorage, "ow-bgm-tip", "1"); const t = document.createElement("span"); t.className = "bgm-tip"; t.textContent = "♪ ゲームの曲を流せます"; btn.append(t); setTimeout(() => t.remove(), 7000); }
  })();

  /* ---------- お知らせ ---------- */
  const esc = s => String(s).replace(/[&<>"]/g, c => ({"&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;"}[c]));
  window.newsItemHTML = (n, i = 0) => `<a class="news-item rv d${Math.min(i, 4)}" href="article.html?id=${encodeURIComponent(n.id)}"><time datetime="${n.date.replace(/\./g, "-")}">${n.date}</time><span class="tag ${n.tag}">${NEWS_TAG[n.tag] || "お知らせ"}</span><h3>${esc(n.title)}</h3><span class="go" aria-hidden="true">→</span></a>`;
  $$("[data-news-latest]").forEach(el => { el.innerHTML = (window.NEWS || []).slice(0, +el.dataset.newsLatest || 3).map(newsItemHTML).join(""); watchReveal(el); });
})();
