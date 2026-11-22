/* =========================================================
   11-22 ユーザー「どのページにも、ダウンロードして遊びたくなるキャッチコピーを盛りだくさんに（例：日本一が明らかになる！日本一を決めろ！）」
   ・ページの上（見出しの下）に、大きなキャッチコピーの帯（3秒ごとに切りかわる）
   ・話題と話題のあいだに、流れる文字の帯（2つおき）
   使う心理：挑戦（日本一を決めろ）・自分ごと（あなたの一言）・いま（今週・今日）・損したくない（リセット・限定）・みんなやってる（全国のライバル）・手軽（基本無料・30秒）
   ========================================================= */
(() => {
  if (window.__owCatch) return; window.__owCatch = true;
  const COPY = {
    home: ["日本一おもしろいのは誰だ！", "日本一が、いま明らかになる！", "あなたの一言で、全国を笑わせろ！", "笑いのセンス、AIが100点満点でジャッジ！", "スキマ時間が、爆笑タイムに変わる！"],
    news: ["最新情報を見逃すな！", "今週のイベントで差をつけろ！", "限定コラボは、今だけ！", "アップデートで、笑いがもっとアツくなる！"],
    game: ["日本一を決めろ！お題合戦！", "あなたの一言、何点？", "30秒で、笑いのガチンコ勝負！", "ボケて、ツッコんで、頂点へ！", "まずは1問。気づけば、やめられない！"],
    chara: ["シスターズが、あなたの挑戦を待っている！", "推しのシスターズと、笑いの修行へ！", "3人を笑わせたら、あなたが主役！"],
    banzuke: ["日本一が明らかになる！", "今週の1位は、あなたかもしれない！", "全国のライバルに、笑いで勝て！", "リセット前に、ランキングに名前を刻め！", "レート1500から、頂点へ駆け上がれ！"],
    hall: ["伝説の名回答、殿堂入りを狙え！", "あなたのボケが、永遠に残る！", "AIが認めた80点超えの名作たち！", "次の殿堂入りは、あなたの一言！"],
    support: ["困ったら、葵がすぐ答えるで！", "安心して、笑いの修行を始めよう！"]
  };
  const STRIP = ["日本一を決めろ！", "基本無料", "全国ランクマッチ", "AIが100点満点で採点", "1問30秒", "今週の1位はあなたかも", "お題は12種類", "毎週リセット", "笑いのガチンコ勝負"];
  const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
  let timer = 0;
  function mount(){
    const pg = document.body.dataset.page || "", list = COPY[pg]; if (!list) return;
    clearInterval(timer);
    /* ① 大きなキャッチコピーの帯 */
    if (!$(".cc-big")) {
      const at = pg === "home" ? $("main>section.hero") : $("main>header.ph"); if (!at) return;
      const el = document.createElement("div"); el.className = "cc-big"; el.setAttribute("role", "note"); el.setAttribute("aria-label", "キャッチコピー");
      el.innerHTML = `<div class="cc-in"><span class="cc-sp" aria-hidden="true">★</span><p class="cc-t">${list[0]}</p><span class="cc-sp" aria-hidden="true">★</span></div>`;
      at.after(el);
      let i = 0; const t = $(".cc-t", el);
      timer = setInterval(() => { if (!el.isConnected) return clearInterval(timer); i = (i + 1) % list.length; t.classList.remove("in"); void t.offsetWidth; t.textContent = list[i]; t.classList.add("in"); }, 3200);
    }
    /* ② 話題のあいだの流れる帯（2つおき・トップは1画面ずつ止まるので入れない） */
    if (pg !== "home" && !$(".cc-strip")) {
      const secs = $$("main>section.sec").filter(s => !s.hidden);
      secs.forEach((s, k) => { if (k === 0 || k % 2) return;
        const d = document.createElement("div"); d.className = "cc-strip" + (k % 4 ? " alt" : ""); d.setAttribute("aria-hidden", "true");
        const words = [...STRIP.slice(k % STRIP.length), ...STRIP.slice(0, k % STRIP.length)];
        const line = words.map(w => `<b>${w}</b><i>◆</i>`).join("");
        d.innerHTML = `<div class="cc-run"><span>${line}</span><span>${line}</span></div>`; s.before(d); });
    }
  }
  mount(); addEventListener("ow:page", () => { $$(".cc-big,.cc-strip").forEach(e => e.remove()); mount(); });
})();
