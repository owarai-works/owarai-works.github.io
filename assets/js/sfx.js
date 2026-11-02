/* =========================================================
   ボタンの効果音（ゲームと同じ作り方：その場で音を合成するので、音のファイルはいらない）
   ・押したとき：ボタンは「ハリセン」、リンクは「拍子木」、タブ・小さいボタンは「ポン」
   ・マウスを乗せたとき（パソコンだけ）：「ポコッ」と軽く。乗せるたびに少しずつ音が上がる
   ・右下の BGM を OFF にすると、効果音も鳴らない
   ・ブラウザの決まりで、最初に1回どこかを押すまでは鳴らない
   ========================================================= */
(() => {
  const AC = window.AudioContext || window.webkitAudioContext; if (!AC) return;
  let ac = null, master = null, NB = null, ready = false;
  const on = () => !window.owBgm || owBgm.isOn();
  const init = () => { if (ac) return; ac = new AC(); master = ac.createGain(); master.gain.value = .55; master.connect(ac.destination); };
  const wake = () => { init(); if (ac.state !== "running") ac.resume().catch(() => {}); ready = ac.state === "running" || ready; };
  ["pointerdown", "touchend", "keydown", "click"].forEach(t => addEventListener(t, () => { wake(); ready = true; }, {capture: true, passive: true}));
  const tone = (f, dur, type = "sine", vol = .3, at = 0, slideTo = 0) => { const t = ac.currentTime + at, o = ac.createOscillator(), g = ac.createGain();
    o.type = type; o.frequency.setValueAtTime(f, t); if (slideTo) o.frequency.exponentialRampToValueAtTime(slideTo, t + dur);
    g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(.0001, t + dur); o.connect(g); g.connect(master); o.start(t); o.stop(t + dur + .02); };
  const noise = (dur, freq, q = 1, vol = .5, at = 0, type = "bandpass") => { if (!NB) { NB = ac.createBuffer(1, ac.sampleRate * 1.2, ac.sampleRate); const d = NB.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1; }
    const t = ac.currentTime + at, s = ac.createBufferSource(), f = ac.createBiquadFilter(), g = ac.createGain();
    s.buffer = NB; f.type = type; f.frequency.value = freq; f.Q.value = q; g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(.0001, t + dur);
    s.connect(f); f.connect(g); g.connect(master); s.start(t, Math.random() * .5); s.stop(t + dur + .02); };
  const S = {
    slap(){ noise(.13, 2300, .7, .8); noise(.05, 6500, 1.2, .5, 0, "highpass"); tone(190, .14, "sine", .6, 0, 55); },   /* ハリセン */
    hyoshigi(){ tone(1900, .09, "triangle", .4); tone(2850, .05, "sine", .2); noise(.04, 3200, 2, .35); },                /* 拍子木 */
    pon(){ tone(660, .08, "sine", .35, 0, 990); noise(.015, 4000, 2, .1); },                                               /* ポン */
    pop(i = 0){ const P = [0, 2, 4, 7, 9], f = 523.25 * 2 ** ((P[i % 5] + 12 * (Math.floor(i / 5) % 2)) / 12);            /* ポコッ（五音音階で上がる） */
      tone(f * .6, .07, "sine", .22, 0, f * 1.08); tone(f * 2, .1, "sine", .05, .012); noise(.012, 5200, 2, .04); }
  };
  window.owSfx = n => { if (!on() || !ac || ac.state !== "running") return; try { S[n] && S[n](); } catch (e) {} };
  const BTN = ".btn,.store,.gate-go,.play-pv,.movie-box,.fb-open,.fb-f button,.cs-nav button,.hd-menu,.pt,.fcard,.sis,.pickup,.news-item,.links3 a";
  const SMALL = ".cs-tab,.cs-th,.nf button,.subnav a,.fb-chips button,.hd-nav a,.ft-nav a,.faq summary,.cs-card,.od,.odai-mini li,.pm,.gs-feat li,.vsc,.bzc,.rival,.art-pager a";
  const kindOf = el => el.closest(".bgm,.cs-vo") ? null : el.closest(BTN) ? "slap" : el.closest(SMALL) ? "pon" : el.closest("a[href],button") ? "hyoshigi" : null;
  addEventListener("pointerdown", e => { if (e.button > 0) return; const k = kindOf(e.target); if (k) setTimeout(() => owSfx(k), 0); }, true);
  /* マウスを乗せたとき（触る画面では鳴らさない） */
  if (matchMedia("(hover: hover) and (pointer: fine)").matches) {
    let last = null, n = 0, tm = 0;
    addEventListener("pointerover", e => { if (!ready) return; const el = e.target.closest(BTN + "," + SMALL + ",.cs-vo,.bgm"); if (!el || el === last) return; last = el;
      const now = performance.now(); if (now - tm < 70) return; tm = now; owSfx("pop"); n = (n + 1) % 10; window.owSfxN = n; }, true);
    addEventListener("pointerout", e => { if (last && !last.contains(e.relatedTarget)) last = null; }, true);
    const pop = S.pop; S.pop = () => pop(window.owSfxN || 0);
  }
})();
