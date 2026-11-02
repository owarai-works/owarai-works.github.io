/* =========================================================
   見てるだけで楽しい演出
   1) 背景に2頭身のシスターズと小物がふわふわ降る（文字の裏・押せない）
   2) 何もないところをクリック／タップ → 「なんでやねん！」とハリセンの衝撃
   3) 画面の上に「笑いメーター」（読み進めるほどたまる。MAXで「爆笑！」）
   4) ときどき画面のはしからシスターズがひょっこり顔を出して、お題合戦やミニゲームへさそう
   5) スマホ：ヒーローを過ぎたら下に「お題合戦を見る」ボタン
   ・動きを減らす設定の人には、1〜4を出さない
   ========================================================= */
(() => {
  if (window.__owFun) return; window.__owFun = true;  /* 2回読みこまれても1回だけ動く（BGMが2つ鳴らないように） */
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const P = "assets/img/fun/";
  const CHIBI = ["k_mic", "k_jump", "k_roll", "a_hari", "a_smug", "a_shock", "m_fan", "m_sleep", "m_wave"];
  const PROPS = ["harisen", "zabuton", "mic", "sensu", "coin", "sakura", "crown", "popper", "lantern"];
  const sfx = n => window.owSfx && owSfx(n);
  const rnd = (a, b) => a + Math.random() * (b - a);
  const pick = a => a[Math.floor(Math.random() * a.length)];

  const css = `
.fun-sky{position:fixed;inset:0;z-index:-1;pointer-events:none;overflow:hidden}
.fun-f{position:absolute;top:-180px;will-change:transform;animation:funFall linear forwards}
.fun-f img{display:block;width:100%;height:auto;animation:funSway ease-in-out infinite alternate;filter:drop-shadow(3px 4px 0 rgba(28,16,18,.25))}
@keyframes funFall{to{transform:translateY(calc(100vh + 360px))}}
@keyframes funSway{from{transform:rotate(-14deg) translateX(-14px)}to{transform:rotate(14deg) translateX(14px)}}
.fun-boom{position:fixed;z-index:95;pointer-events:none;transform:translate(-50%,-50%)}
.fun-boom b{display:block;white-space:nowrap;font-family:var(--f-disp);font-weight:400;font-size:clamp(22px,3vw,34px);color:var(--gold);-webkit-text-stroke:2.5px var(--ink);paint-order:stroke fill;text-shadow:4px 4px 0 var(--shu);animation:funBoom .9s cubic-bezier(.2,1.6,.4,1) forwards}
.fun-boom i{position:absolute;left:50%;top:50%;width:150px;height:150px;margin:-75px;border-radius:50%;background:repeating-conic-gradient(var(--gold) 0 8deg,transparent 8deg 22deg);mask:radial-gradient(circle,transparent 25%,#000 30%,transparent 70%);-webkit-mask:radial-gradient(circle,transparent 25%,#000 30%,transparent 70%);animation:funRing .6s ease-out forwards;z-index:-1}
.fun-boom img{position:absolute;left:50%;top:50%;width:64px;margin:-32px;animation:funHari .5s ease-out forwards}
@keyframes funBoom{0%{transform:scale(.2) rotate(-20deg);opacity:0}25%{transform:scale(1.15) rotate(-6deg);opacity:1}70%{transform:scale(1) rotate(-6deg);opacity:1}100%{transform:translateY(-40px) scale(.9) rotate(-6deg);opacity:0}}
@keyframes funRing{from{transform:scale(.3);opacity:1}to{transform:scale(1.4);opacity:0}}
@keyframes funHari{0%{transform:translate(60px,-60px) rotate(60deg);opacity:1}40%{transform:translate(0,0) rotate(-20deg);opacity:1}100%{transform:translate(-10px,10px) rotate(-30deg);opacity:0}}
.fun-meter{position:fixed;left:0;right:0;top:0;z-index:55;height:6px;background:rgba(28,16,18,.08);pointer-events:none}
.fun-meter i{position:absolute;inset:0 auto 0 0;width:var(--p,0%);background:linear-gradient(90deg,var(--gold),var(--shu),var(--sakura-d));box-shadow:0 0 10px rgba(255,59,47,.6)}
.fun-meter img{position:absolute;top:-4px;left:var(--p,0%);width:30px;transform:translateX(-50%);transition:transform .2s}
.fun-meter.max img{animation:funHop .5s ease-in-out infinite alternate}
.fun-meter span{position:absolute;right:6px;top:8px;padding:1px 8px;border:2px solid var(--ink);border-radius:999px;background:var(--shu);color:#fff;font-weight:900;font-size:11px;opacity:0;transform:scale(.6);transition:all .3s}
.fun-meter.max span{opacity:1;transform:none}
@keyframes funHop{to{transform:translate(-50%,-6px) rotate(10deg)}}
.fun-peek{position:fixed;z-index:58;bottom:84px;display:flex;align-items:flex-end;gap:6px;cursor:pointer;transition:transform .6s cubic-bezier(.2,1.4,.4,1)}
.fun-peek.l{left:0;transform:translateX(-110%)}.fun-peek.r{right:0;flex-direction:row-reverse;transform:translateX(110%)}
.fun-peek.on{transform:none}
.fun-peek img{width:92px;filter:drop-shadow(3px 3px 0 rgba(28,16,18,.4))}
.fun-peek p{max-width:190px;margin-bottom:56px;padding:8px 12px;background:#fff;border:3px solid var(--ink);border-radius:14px;box-shadow:3px 3px 0 var(--ink);font-weight:900;font-size:13px;line-height:1.45;color:var(--ink)}
.fun-peek p b{color:var(--shu)}
.fun-peek button{position:absolute;top:-6px;width:24px;height:24px;border-radius:50%;background:var(--ink);color:#fff;font-size:13px;line-height:1}
.fun-peek.l button{right:-6px}.fun-peek.r button{left:-6px}
.fun-cta{position:fixed;left:50%;bottom:14px;z-index:59;display:none;transform:translate(-50%,140%);transition:transform .45s cubic-bezier(.2,1.4,.4,1);padding:10px 18px;border-radius:999px;background:var(--shu);color:#fff;border:3px solid var(--ink);box-shadow:4px 4px 0 var(--ink);font-weight:900;font-size:14px;white-space:nowrap}
.fun-cta.on{transform:translate(-50%,0)}
.fun-cta small{display:block;font-size:10px;color:#ffe0d8;line-height:1}
@media (max-width:760px){.fun-cta{display:block}.fun-peek{bottom:74px}.fun-peek img{width:76px}.fun-peek p{font-size:12px;max-width:160px;margin-bottom:46px}}
`;
  const st = document.createElement("style"); st.textContent = css; document.head.append(st);

  /* ---------- 1) 降ってくる ---------- */
  if (!reduce) {
    const sky = document.createElement("div"); sky.className = "fun-sky"; sky.setAttribute("aria-hidden", "true"); document.body.prepend(sky);
    const small = () => innerWidth < 760;
    const drop = (first) => {
      if (document.hidden || sky.childElementCount > (small() ? 7 : 14)) return;
      const chibi = Math.random() < .55, n = chibi ? pick(CHIBI) : pick(PROPS);
      const w = chibi ? rnd(small() ? 54 : 70, small() ? 84 : 120) : rnd(small() ? 30 : 38, small() ? 46 : 62);
      const d = document.createElement("div"); d.className = "fun-f";
      const dur = rnd(14, 24);
      d.style.cssText = `left:${rnd(-4, 96)}vw;width:${w}px;animation-duration:${dur}s;${first ? `animation-delay:-${rnd(0, dur)}s;` : ""}opacity:${chibi ? .9 : .75}`;
      d.innerHTML = `<img src="${P}${n}.webp" alt="" style="animation-duration:${rnd(1.6, 3.2)}s;animation-delay:-${rnd(0, 3)}s">`;
      d.addEventListener("animationend", e => { if (e.target === d) d.remove(); });
      sky.append(d);
    };
    for (let i = 0; i < (small() ? 5 : 9); i++) drop(true);
    setInterval(() => drop(false), 1700);
  }

  /* ---------- 2) 何もないところを押すと「なんでやねん！」 ---------- */
  const LINES = ["なんでやねん！", "もうええわ！", "どないやねん！", "ちゃうちゃう！", "知らんけど！", "爆笑！", "ええやん！", "ボケかい！"];
  let lastBoom = 0;
  addEventListener("click", e => {
    if (reduce) return;
    if (e.target.closest("a,button,input,textarea,select,summary,label,video,.demo,.fb,.fb-inline,.cs,.modal,.og-gate,.curtain,.sp-menu,.hd,[role=tab]")) return;
    if (getSelection && String(getSelection()).length) return;
    const now = performance.now(); if (now - lastBoom < 250) return; lastBoom = now;
    const b = document.createElement("div"); b.className = "fun-boom"; b.style.left = e.clientX + "px"; b.style.top = e.clientY + "px";
    b.innerHTML = `<i></i><img src="${P}harisen.webp" alt=""><b>${pick(LINES)}</b>`;
    document.body.append(b); sfx("slap"); setTimeout(() => b.remove(), 1000);
  });

  /* ---------- 3) 笑いメーター ---------- */
  if (!reduce) {
    const m = document.createElement("div"); m.className = "fun-meter"; m.setAttribute("aria-hidden", "true");
    m.innerHTML = `<i></i><img src="${P}k_jump.webp" alt=""><span>爆笑MAX！</span>`; document.body.append(m);
    const on = () => { const h = document.documentElement.scrollHeight - innerHeight, p = h > 0 ? Math.min(1, scrollY / h) : 0; m.style.setProperty("--p", (p * 100).toFixed(1) + "%"); m.classList.toggle("max", p > .985); };
    addEventListener("scroll", () => requestAnimationFrame(on), {passive: true}); addEventListener("ow:page", on); on();
  }

  /* ---------- 4) ひょっこり顔を出す ---------- */
  const PEEK = [
    ["k_jump", "一番の目玉は<b>お題合戦</b>！見ていってな！", "#gassen"],
    ["a_smug", "うちのツッコミ、<b>お題合戦</b>で受けて立つで。", "#gassen"],
    ["m_wave", "ミニゲームも<b>16種類</b>あるで〜", "#minigame"],
    ["k_mic", "<b>ランクマッチ</b>で日本一、目指そうや！", "game.html#gassen"],
    ["m_fan", "わたしたちの<b>アイドル姿</b>も見てってな〜", "characters.html"]
  ];
  if (!reduce) {
    let pi = Math.floor(Math.random() * PEEK.length), shown = 0, closed = false;
    try { closed = sessionStorage.getItem("ow-peek-off") === "1"; } catch (e) {}
    const peek = () => {
      if (closed || document.hidden || shown >= 4 || document.querySelector(".fun-peek,.fb.open,.og-gate,.curtain:not(.done),.menu-open")) return;
      const [img, txt, href] = PEEK[pi++ % PEEK.length], side = Math.random() < .5 ? "l" : "r";
      if (href[0] === "#" && !document.querySelector(href)) return;
      const el = document.createElement("div"); el.className = "fun-peek " + side; el.setAttribute("role", "status");
      el.innerHTML = `<img src="${P}${img}.webp" alt=""><p>${txt}</p><button type="button" aria-label="とじる">×</button>`;
      document.body.append(el); shown++;
      requestAnimationFrame(() => requestAnimationFrame(() => el.classList.add("on"))); sfx("pon");
      const bye = () => { el.classList.remove("on"); setTimeout(() => el.remove(), 600); };
      el.querySelector("button").onclick = e => { e.stopPropagation(); closed = true; try { sessionStorage.setItem("ow-peek-off", "1"); } catch (x) {} bye(); };
      el.onclick = () => { bye(); window.owTrack && owTrack("peek_click", {to: href}); if (href[0] === "#") document.querySelector(href).scrollIntoView({behavior: "smooth"}); else { const a = document.createElement("a"); a.href = href; document.body.append(a); a.click(); a.remove(); } };
      setTimeout(bye, 7000);
    };
    setTimeout(peek, 14000); setInterval(peek, 32000);
  }

  /* ---------- 5) スマホの「30秒で体験」ボタン ---------- */
  const cta = document.createElement("a"); cta.className = "fun-cta"; cta.href = "#gassen";
  cta.innerHTML = `<small>一番の目玉</small>▶ お題合戦を見る`; document.body.append(cta);
  cta.addEventListener("click", e => { window.owTrack && owTrack("cta_demo_click"); const t = document.getElementById("gassen"); if (t) { e.preventDefault(); t.scrollIntoView({behavior: "smooth"}); } else { e.preventDefault(); const a = document.createElement("a"); a.href = "game.html#gassen"; document.body.append(a); a.click(); a.remove(); } });
  const ctaOn = () => { const hero = document.querySelector(".hero"), demo = document.getElementById("gassen");
    const past = hero ? hero.getBoundingClientRect().bottom < 0 : scrollY > 400;
    const inDemo = demo && (() => { const r = demo.getBoundingClientRect(); return r.top < innerHeight && r.bottom > 0; })();
    cta.classList.toggle("on", past && !inDemo && !document.querySelector(".fb.open")); };
  addEventListener("scroll", () => requestAnimationFrame(ctaOn), {passive: true}); addEventListener("ow:page", ctaOn); ctaOn();
})();

/* ---------- F：キャラ紹介で、キャラをつつくと表情が変わってしゃべる ---------- */
window.owCharaPoke = () => {
  const fr = document.querySelector(".cs-frame"); if (!fr || fr.dataset.poke) return; fr.dataset.poke = "1";
  const LINES = {kineko: [["laugh", "high1", "くすぐったいって〜！"], ["surprise", "fail1", "わっ！びっくりしたやん！"], ["smile", "pass1", "もっとつついてええで♪"], ["angry", "attack", "つつきすぎやー！"]],
    aoi: [["angry", "attack", "なにすんねん！"], ["smile", "pass1", "…まあ、ええけど"], ["surprise", "fail1", "ちょ、急につつくなや"], ["laugh", "high1", "あはは、しつこいなぁ"]],
    momoe: [["smile", "pass1", "なぁに〜？"], ["laugh", "high1", "ふふっ、くすぐったい〜"], ["surprise", "fail1", "はわわっ"], ["angry", "attack", "も〜、いじわる〜"]]};
  let n = 0, au = null;
  fr.style.cursor = "pointer"; fr.title = "つついてみて！";
  const hint = document.createElement("p"); hint.className = "poke-hint"; hint.textContent = "👆 キャラをつついてみて！"; fr.parentElement.append(hint);
  fr.addEventListener("click", e => {
    const tab = document.querySelector('.cs-tab[aria-selected="true"]'), k = tab ? tab.id.replace("tab-", "") : "kineko", L = LINES[k]; if (!L) return;
    const [ex, vo, txt] = L[n++ % L.length]; hint.remove();
    try { if (au) au.pause(); au = new Audio(`assets/vo/${k}_${vo}.mp3`); au.play().catch(() => {}); } catch (x) {}
    window.owSfx && owSfx("pon"); window.owTrack && owTrack("chara_poke", {chara: k});
    fr.parentElement.querySelectorAll(".poke").forEach(x => x.remove());
    const r = fr.getBoundingClientRect(), b = document.createElement("div"); b.className = "poke";
    b.style.left = Math.min(Math.max(e.clientX - r.left, 70), r.width - 70) + "px"; b.style.top = Math.max(e.clientY - r.top - 20, 80) + "px";
    b.innerHTML = `<img src="assets/img/ex/${k}_${ex}0.webp" alt=""><p>${txt}</p>`;
    fr.parentElement.append(b); fr.classList.remove("poked"); void fr.offsetWidth; fr.classList.add("poked");
    setTimeout(() => b.remove(), 2200);
  });
};
owCharaPoke();

/* ---------- G：隠し要素（ロゴを5回つづけて押すと、シスターズ総出で漫才） ---------- */
(() => {
  if (window.__owEgg) return; window.__owEgg = true;
  let c = 0, t = 0;
  document.addEventListener("click", e => {
    const lg = e.target.closest(".hd-logo,.hero-logo,.ft-logo img"); if (!lg) return;
    const now = Date.now(); c = now - t < 900 ? c + 1 : 1; t = now;
    if (c < 5) { if (c >= 3) { e.preventDefault(); window.owSfx && owSfx("pop"); } return; }
    e.preventDefault(); c = 0; window.owTrack && owTrack("easter_egg");
    const S = [["kineko", "laugh", "intro", "どうも〜！お笑いシスターズです！"], ["aoi", "smile", "intro", "ロゴを5回も押すとか、ヒマなんか？"], ["momoe", "laugh", "intro", "見つけてくれて、ありがとう〜"], ["kineko", "surprise", "high1", "隠しネタ見つけた人は、もう笑いのプロやで！"], ["aoi", "angry", "attack", "なんでやねん！"], ["momoe", "smile", "win", "もうええわ〜。ありがとうございました〜"]];
    const ov = document.createElement("div"); ov.className = "egg"; ov.setAttribute("role", "dialog"); ov.setAttribute("aria-label", "隠しネタ");
    ov.innerHTML = `<div class="egg-st"><p class="egg-t">✨ 隠しネタ発見！ ✨</p><div class="egg-row">${["kineko", "aoi", "momoe"].map(k => `<img data-k="${k}" src="assets/img/ex/${k}_smile0.webp" alt="">`).join("")}</div><p class="egg-say"></p><button type="button" class="btn sm egg-x">とじる</button></div>`;
    document.body.append(ov); window.owSfx && owSfx("slap");
    let i = 0, au = null, tm = 0;
    const step = () => { if (!ov.isConnected) return; if (i >= S.length) return;
      const [k, ex, vo, txt] = S[i++]; ov.querySelectorAll("img").forEach(im => im.classList.toggle("on", im.dataset.k === k));
      const im = ov.querySelector(`img[data-k="${k}"]`); im.src = `assets/img/ex/${k}_${ex}0.webp`;
      ov.querySelector(".egg-say").innerHTML = `<b>${({kineko: "気猫", aoi: "葵", momoe: "百萌"})[k]}</b>「${txt}」`;
      if (k === "aoi" && ex === "angry") window.owSfx && owSfx("slap");
      try { if (au) au.pause(); au = new Audio(`assets/vo/${k}_${vo}.mp3`); au.play().catch(() => {}); } catch (x) {}
      tm = setTimeout(step, 2300); };
    const close = () => { clearTimeout(tm); if (au) au.pause(); ov.remove(); };
    ov.querySelector(".egg-x").onclick = close; ov.onclick = x => { if (x.target === ov) close(); };
    step();
  }, true);
})();
