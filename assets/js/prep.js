/* =========================================================
   公開前の「準備中」の幕
   ・PREP を false にすると、ふつうに公開される
   ・運営の人だけ中身を見る：アドレスの最後に ?preview=nandeyanen を付けて開く（その端末では次から幕なし）
     もとに戻す（幕を出す）：?preview=off
   ※ 中身のファイルは公開リポジトリにあるので、くわしい人は見られる。かんたんな目かくし。
   ========================================================= */
(() => {
  const PREP = true, KEY = "nandeyanen";
  try {
    const q = new URLSearchParams(location.search).get("preview");
    if (q === KEY) localStorage.setItem("ow-preview", "1");
    if (q === "off") localStorage.removeItem("ow-preview");
    if (!PREP || localStorage.getItem("ow-preview") === "1") return;
  } catch (e) { if (!PREP) return; }
  const H = document.documentElement; H.classList.add("prep");
  const st = document.createElement("style");
  st.textContent = `html.prep,html.prep body{overflow:hidden!important;height:100%}
html.prep body > *:not(.prep-wall){display:none!important}
.prep-wall{position:fixed;inset:0;z-index:2147483000;display:grid;place-items:center;padding:20px;overflow:hidden;
 background:repeating-linear-gradient(90deg,rgba(0,0,0,.28) 0 8px,transparent 8px 26px,rgba(255,255,255,.06) 26px 30px,transparent 30px 40px),linear-gradient(180deg,#c3161f,#6a0810 90%);font-family:"Dela Gothic One","Zen Kaku Gothic New",sans-serif;color:#fff;text-align:center}
.prep-wall::before{content:"";position:absolute;inset:-30%;background:repeating-conic-gradient(rgba(255,216,77,.16) 0 5deg,transparent 5deg 13deg);animation:prepSpin 50s linear infinite}
@keyframes prepSpin{to{transform:rotate(360deg)}}
.prep-in{position:relative;display:flex;flex-direction:column;align-items:center;gap:14px}
.prep-in img.logo{width:min(78vw,440px);filter:drop-shadow(6px 6px 0 #1c1012)}
.prep-in h1{margin:0;padding:10px 26px;background:#ffc61a;color:#1c1012;border:4px solid #1c1012;border-radius:16px;box-shadow:7px 7px 0 #1c1012;font-weight:400;font-size:clamp(28px,6vw,48px);letter-spacing:.08em;transform:rotate(-3deg)}
.prep-in p{margin:6px 0 0;font-family:"Zen Kaku Gothic New",sans-serif;font-weight:900;font-size:clamp(14px,2.4vw,18px);line-height:1.8;text-shadow:0 2px 0 rgba(0,0,0,.4)}
.prep-sis{display:flex;gap:4px;align-items:flex-end;margin-top:6px}
.prep-sis img{width:clamp(70px,16vw,120px);animation:prepHop 1.4s ease-in-out infinite alternate;filter:drop-shadow(3px 3px 0 rgba(0,0,0,.35))}
.prep-sis img:nth-child(2){animation-delay:-.45s}.prep-sis img:nth-child(3){animation-delay:-.9s}
@keyframes prepHop{to{transform:translateY(-10px) rotate(3deg)}}`;
  document.head.append(st);
  const wall = () => { if (document.querySelector(".prep-wall")) return;
    const w = document.createElement("div"); w.className = "prep-wall"; w.setAttribute("role", "main");
    w.innerHTML = `<div class="prep-in"><img class="logo" src="assets/img/logo.webp" alt="ボケて！ツッコんで！お笑い道場なんでやねん！"><h1>ただいま準備中！</h1>
      <div class="prep-sis" aria-hidden="true"><img src="assets/img/fun/k_jump.webp" alt=""><img src="assets/img/fun/a_smug.webp" alt=""><img src="assets/img/fun/m_wave.webp" alt=""></div>
      <p>公式ホームページは、ただいま開演の準備中です。<br>幕が上がるまで、もうしばらくお待ちください！</p></div>`;
    document.body.append(w); };
  if (document.body) wall(); else document.addEventListener("DOMContentLoaded", wall);
  window.OW_PREP = true;
})();
