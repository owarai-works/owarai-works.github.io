/* =========================================================
   11-22 ユーザー「NEWS から漫画まで、シスターズのミニキャラがあちこちランダムに動き回る（気猫3・葵3・百萌3）」
   トップだけ。#news の上から #comic の下までの広さに、9人を置き、ときどき別の場所へテクテク歩く。
   字や押すところのじゃまをしないよう、押せない（pointer-events:none）
   ========================================================= */
(() => {
  if (window.__owRoam) return; window.__owRoam = true;
  const P = "assets/img/fun/", SIS = ["k_jump", "k_mic", "k_roll", "a_hari", "a_shock", "a_smug", "m_fan", "m_sleep", "m_wave"];
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const rnd = (a, b) => a + Math.random() * (b - a);
  let box = null, kids = [], timers = [];
  const area = () => { const a = document.getElementById("news"), b = document.getElementById("comic"), m = document.querySelector("main"); if (!a || !b || !m) return null;
    const off = el => { let y = 0; for (let e = el; e && e !== m; e = e.offsetParent) y += e.offsetTop; return y; };  /* パソコンは全体を1.25倍にしているので、画面の位置ではなくページの中の位置で測る */
    const top = off(a), bot = off(b) + b.offsetHeight; return {top, h: Math.max(200, bot - top)}; };
  function place(){ const r = area(); if (!r || !box) return; box.style.top = r.top + "px"; box.style.height = r.h + "px"; }
  function walk(k, first){
    const W = box.clientWidth, H = box.clientHeight, s = k.w;
    const x = rnd(0, Math.max(0, W - s)), y = rnd(0, Math.max(0, H - s * 1.2));
    const dx = x - k.x, dy = y - k.y, d = Math.hypot(dx, dy), t = first ? 0 : Math.min(14, Math.max(4, d / rnd(60, 110)));
    k.el.style.transitionDuration = t + "s"; k.el.classList.toggle("flip", dx < 0); k.el.classList.toggle("go", t > 0);
    k.el.style.transform = `translate(${x}px,${y}px)`; k.x = x; k.y = y;
    timers.push(setTimeout(() => { k.el.classList.remove("go"); timers.push(setTimeout(() => walk(k), rnd(800, 3500))); }, t * 1000));
  }
  function mount(){
    unmount(); if (reduce || document.body.dataset.page !== "home" || !document.getElementById("comic")) return;
    const m = document.querySelector("main"); if (getComputedStyle(m).position === "static") m.style.position = "relative";
    box = document.createElement("div"); box.className = "roam"; box.setAttribute("aria-hidden", "true"); m.append(box); place();
    const sm = innerWidth < 760;
    kids = SIS.map(n => { const w = Math.round(rnd(sm ? 48 : 70, sm ? 62 : 96)); const el = document.createElement("i"); el.className = "roam-k"; el.style.width = w + "px";
      el.innerHTML = `<img src="${P}${n}.webp" alt="" loading="lazy">`; box.append(el); return {el, w, x: 0, y: 0}; });
    kids.forEach(k => { walk(k, true); timers.push(setTimeout(() => walk(k), rnd(300, 2500))); });
  }
  function unmount(){ timers.forEach(clearTimeout); timers = []; if (box) box.remove(); box = null; kids = []; }
  addEventListener("resize", () => { clearTimeout(window.__owRoamR); window.__owRoamR = setTimeout(place, 300); });
  addEventListener("load", () => { place(); setTimeout(place, 1500); });
  addEventListener("ow:page", () => setTimeout(mount, 300));
  if (document.readyState === "loading") addEventListener("DOMContentLoaded", mount); else mount();
  setTimeout(place, 3000);
})();
