/* =========================================================
   ゲームと連動した番付・殿堂（assets/data/ranking.json を読む。毎日19時ごろ自動で更新）
   ・芸名は出さない（順位と勝利数だけ／殿堂はお題と回答だけ）
   ・本物の記録がまだないときは「見本」と書いた見本を出す（本物が入ると自動で入れかわる）
   ・トップの小さな欄（#rankbox）・番付のページ（#banzuke-page）・殿堂のページ（#hall-page）
   ========================================================= */
(() => {
  const esc = s => String(s).replace(/[&<>"]/g, c => ({"&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;"}[c]));
  const P = [["week", "週間"], ["month", "月間"], ["all", "永世"]];
  const KIND = {b: "ボケ", t: "ツッコミ", m: "MIX", o: "大喜利", oogiri: "大喜利", a: "あるある", aruaru: "あるある", d: "あだ名", adana: "あだ名", h: "一発ギャグ", gag: "一発ギャグ", k: "しばり", shibari: "しばり", g: "漫画セリフ", manga: "漫画セリフ", s: "インタビュー", intv: "インタビュー"};
  const kindName = k => KIND[k] || (k && String(k).length < 8 ? k : "お題");

  /* ---------- 見本（本物の記録がないときだけ） ---------- */
  const SH = [
    ["o", "こんな歯医者は嫌だ。どんな歯医者？", "「痛かったら右手を」と言いながら右手を押さえてくる", 98, 41],
    ["b", "現場に到着した消防車ですが……", "消防車「先に自分の消火してもらっていいですか」", 97, 38, "fire"],
    ["o", "こんなコンビニは嫌だ。どんなコンビニ？", "「温めますか？」で店員が抱きしめてくる", 96, 35],
    ["g", "ラーメンをひと口食べた男。吹き出しのセリフは？", "大将、これ……去年の味や", 95, 33, "mg_food"],
    ["t", "プールで泳いでいる男性……", "スーツは水着ちゃうねん！", 95, 30],
    ["a", "DIYあるある", "完成したら棚より余ったネジの方が多い", 94, 29],
    ["o", "こんな忍者は嫌だ。どんな忍者？", "名刺に大きく「忍者」と書いてある", 94, 27],
    ["h", "「潜水艦」で一発ギャグ", "潜水艦！……ずっと息止めてたから、もう限界艦！", 93, 25],
    ["b", "回転寿司に来てみたら……", "すみません、サーモンの隣の人ください", 93, 24, "sushi"],
    ["g", "美容院で鏡を見た客。吹き出しのセリフは？", "これ、髪型ちゃう。警報や", 92, 22, "mg_biyou"],
    ["o", "こんなタクシーは嫌だ。どんなタクシー？", "メーターが運転手の心拍数", 92, 21],
    ["k", "しばり：8文字以内でボケろ", "ピザより箱が本体", 91, 20],
    ["d", "この人にあだ名をつけよう！", "おにぎり番長", 91, 19, "adana_001"],
    ["o", "こんな天気予報は嫌だ。どんな天気予報？", "「明日の天気は、あなた次第です」", 90, 18],
    ["t", "図書館で四股を踏む力士", "静かにの「し」が四股の「し」ちゃうねん！", 90, 17, "sumo"],
    ["b", "会社の飲み会のあとのカラオケ", "大根、音程外れてへんか？", 89, 16, "karaoke"],
    ["a", "満員電車あるある", "降りる駅で人の波に逆らうと、ほぼ鮭", 89, 15],
    ["o", "こんな結婚式は嫌だ。どんな結婚式？", "誓いのキスのかわりに、誓いの握手会", 88, 14],
    ["g", "面接で立ち上がった就活生。吹き出しのセリフは？", "御社、ぼくが買います！", 88, 13, "mg_mensetsu"],
    ["b", "休日の動物園で……", "サル「人間、今日もかわいいな」", 87, 12, "zoo"],
    ["o", "こんなヒーローは嫌だ。どんなヒーロー？", "変身するのに役所の手続きがいる", 87, 11],
    ["h", "「目覚まし」で一発ギャグ", "目覚まし！……鳴る前に、こっちが起きてもうた〜", 86, 10],
    ["t", "傘の中だけ雨が降っている", "その傘、天気予報より正確やな！", 86, 10, "umbrella"],
    ["o", "こんな遊園地は嫌だ。どんな遊園地？", "ジェットコースターの安全バーが紙", 85, 9],
    ["a", "引っ越しあるある", "最後に出てくる段ボール、だいたい中身がわからん", 85, 8],
    ["b", "お化け屋敷に入ってみたら", "お化けの方が「こっちが成仏しそう」", 84, 7, "obake"],
    ["g", "満員電車で寄りかかられたサラリーマン", "よだれの家賃、払ってもらいます", 84, 7, "mg_train"],
    ["o", "こんなサンタは嫌だ。どんなサンタ？", "プレゼントの代わりに請求書を置いていく", 83, 6],
    ["d", "この人にあだ名をつけよう！", "七色の仙人", 82, 5, "adana_008"],
    ["k", "しばり：語尾を「なんでやねん」に", "朝ごはん、夜に食べてもうた、なんでやねん", 81, 4]
  ];
  const sampleHall = () => { const all = SH.map(([kind, odai, text, score, likes, pic]) => ({kind, odai, text, score, likes, pic: pic ? "assets/img/odai/" + pic + ".webp" : ""}));
    return {all, month: all.filter((_, i) => i % 3 !== 2).slice(0, 20).map(v => ({...v, likes: Math.ceil(v.likes * .6)})), week: all.filter((_, i) => i % 3 === 0 || i % 5 === 1).slice(0, 12).map(v => ({...v, likes: Math.ceil(v.likes * .3)}))}; };
  const sampleRank = (top, n, step) => { const out = []; let w = top, rk = 1; for (let i = 0; i < n; i++) { if (i && (i * 7) % 5 !== 0) w = Math.max(1, w - Math.max(1, Math.round(step * (1 + (i % 3) * .4)))); else if (i) { /* 同じ勝ち数 */ } if (!i || w !== out[i - 1].wins) rk = i + 1; out.push({rank: rk, wins: w}); } return out; };
  const SAMPLE = {updated: "見本", gassen: {week: sampleRank(38, 30, 1), month: sampleRank(126, 50, 2), all: sampleRank(842, 50, 11)}, hall: sampleHall()};

  /* 読む（同じページの中では1回だけ） */
  let load = null;
  const getData = () => load || (load = fetch("assets/data/ranking.json?t=" + Math.floor(Date.now() / 6e5)).then(r => r.ok ? r.json() : null).catch(() => null).then(d => {
    const has = o => o && ["week", "month", "all"].some(p => (o[p] || []).length);
    return {d, g: has(d && d.gassen) ? d.gassen : SAMPLE.gassen, h: has(d && d.hall) ? d.hall : SAMPLE.hall, gS: !has(d && d.gassen), hS: !has(d && d.hall), up: d ? d.updated : ""};
  }));

  const TITLE = r => r === 1 ? "横綱" : r === 2 ? "大関" : r === 3 ? "関脇" : r === 4 ? "小結" : r <= 20 ? `前頭${r - 4}枚目` : "十両";
  const medal = r => r === 1 ? "🥇" : r === 2 ? "🥈" : r === 3 ? "🥉" : r;
  const tabs = (cur, k) => `<div class="rk-tabs" role="tablist">${P.map(([p, n]) => `<button type="button" role="tab" data-${k}="${p}" aria-selected="${p === cur}">${n}</button>`).join("")}</div>`;
  const sampleNote = s => s ? `<p class="rk-sample"><b>見本</b>まだ記録がないため、見本を表示しています。本物の記録が入ると自動で入れかわります。</p>` : "";
  const upLine = (x) => `<p class="rk-up">${x.up && x.up !== "見本" ? `${esc(x.up)} 更新（毎日19時ごろ）` : "毎日19時ごろ更新"}・芸名は表示していません</p>`;
  const AV = (r) => `<span class="bz-av r${Math.min(r, 4)}" aria-hidden="true"><svg viewBox="0 0 40 40"><circle cx="20" cy="15" r="8"/><path d="M5 38c1-9 7-14 15-14s14 5 15 14z"/></svg></span>`;
  const hallCard = (v, i, big) => `<li class="hc ${big ? "big" : ""} k-${esc(v.kind || "x")} ${v.pic ? "has-pic" : ""}"><span class="hc-no">${i + 1}</span>${v.pic ? `<figure class="hc-pic"><img src="${esc(v.pic)}" alt="お題の絵" loading="lazy"></figure>` : ""}<em class="hc-k">${esc(kindName(v.kind))}</em>${v.odai ? `<small class="hc-o">お題：${esc(v.odai)}</small>` : ""}<p class="hc-t">${esc(v.text)}</p><div class="hc-f"><span class="hc-like">♥ ええやん ${v.likes || 0}</span><b class="hc-sc"><i>${v.score}</i>点</b></div></li>`;

  /* ---------- トップの小さな欄 ---------- */
  window.owRankMount = () => {
    const root = document.getElementById("rankbox"); if (root && !root.dataset.on) { root.dataset.on = "1";
      let gp = "week", hp = "week";
      getData().then(x => { const draw = () => {
        const g = (x.g[gp] || []).slice(0, 10), h = (x.h[hp] || []).slice(0, 5);
        root.innerHTML = `<div class="rk-grid">
          <div class="rk-card rk-g"><h3><span>お題合戦ランクマッチ</span><small>勝利数の番付 TOP10</small></h3>${tabs(gp, "g")}${x.gS ? `<p class="rk-chip">見本</p>` : ""}
            <ol class="rk-list">${g.map(r => `<li class="r${r.rank}"><b>${medal(r.rank)}</b><span>${TITLE(r.rank)}</span><em>${r.wins}<small>勝</small></em></li>`).join("")}</ol>
            <a class="btn sm rk-more" href="banzuke.html">番付をすべて見る <span class="arw" aria-hidden="true">→</span></a></div>
          <div class="rk-card rk-h"><h3><span>みんなの殿堂</span><small>AIが80点以上をつけた名回答</small></h3>${tabs(hp, "h")}${x.hS ? `<p class="rk-chip">見本</p>` : ""}
            <ol class="rk-hall">${h.map((v, i) => `<li class="${v.pic ? "has-pic" : ""}"><i>${i + 1}</i>${v.pic ? `<img class="rk-pic" src="${esc(v.pic)}" alt="" loading="lazy">` : ""}<div><small>${esc(kindName(v.kind))}${v.odai ? "｜" + esc(v.odai) : ""}</small><p>「${esc(v.text)}」</p><span><b>${v.score}点</b>・ええやん ${v.likes || 0}</span></div></li>`).join("")}</ol>
            <a class="btn sm rk-more" href="hall.html">殿堂をすべて見る <span class="arw" aria-hidden="true">→</span></a></div></div>
          ${upLine(x)}`;
        root.querySelectorAll("[data-g]").forEach(b => b.onclick = () => { gp = b.dataset.g; draw(); });
        root.querySelectorAll("[data-h]").forEach(b => b.onclick = () => { hp = b.dataset.h; draw(); }); };
        draw(); });
    }

    /* ---------- 番付のページ ---------- */
    const bz = document.getElementById("banzuke-page"); if (bz && !bz.dataset.on) { bz.dataset.on = "1";
      let p = (location.hash.match(/week|month|all/) || ["week"])[0];
      getData().then(x => { const draw = () => {
        const rows = x.g[p] || [], top = rows.slice(0, 3), rest = rows.slice(3), max = rows.length ? rows[0].wins : 1;
        const pod = [top[1], top[0], top[2]].map((r, k) => r ? `<div class="pd pd${r.rank > 3 ? 3 : r.rank} ${k === 1 ? "c" : ""}"><span class="pd-crown" aria-hidden="true">${r.rank === 1 ? "👑" : ""}</span>${AV(r.rank)}<b class="pd-t">${TITLE(r.rank)}</b><em><i>${r.wins}</i>勝</em><div class="pd-base"><span>${r.rank}</span></div></div>` : `<div class="pd empty"></div>`).join("");
        bz.innerHTML = `${tabs(p, "p")}${sampleNote(x.gS)}
          <div class="bz-pod">${pod}</div>
          ${rest.length ? `<div class="bz-paper"><div class="bz-head"><span>番付</span><span>地位</span><span>勝利数</span></div><ol class="bz-list">${rest.map(r => `<li class="${r.rank <= 4 ? "san" : r.rank <= 20 ? "mae" : "ju"}"><b>${r.rank}</b><span class="bz-ti">${TITLE(r.rank)}</span><span class="bz-bar"><i style="width:${Math.max(4, r.wins / max * 100)}%"></i><em>${r.wins}勝</em></span></li>`).join("")}</ol></div>` : ""}
          ${!rows.length ? `<p class="rk-empty">この期間の番付は、まだありません。</p>` : ""}${upLine(x)}`;
        bz.querySelectorAll("[data-p]").forEach(b => b.onclick = () => { p = b.dataset.p; history.replaceState(null, "", "#" + p); draw(); });
        if (window.watchReveal) watchReveal(bz); };
        draw(); });
    }

    /* ---------- 殿堂のページ ---------- */
    const hl = document.getElementById("hall-page"); if (hl && !hl.dataset.on) { hl.dataset.on = "1";
      let p = (location.hash.match(/week|month|all/) || ["all"])[0], kf = "";
      getData().then(x => { const draw = () => {
        const all = x.h[p] || [], kinds = [...new Set(all.map(v => kindName(v.kind)))], list = kf ? all.filter(v => kindName(v.kind) === kf) : all;
        hl.innerHTML = `${tabs(p, "p")}${sampleNote(x.hS)}
          <div class="hl-filter" role="group" aria-label="お題の種類でしぼる"><button type="button" data-k="" aria-pressed="${!kf}">すべて</button>${kinds.map(k => `<button type="button" data-k="${esc(k)}" aria-pressed="${kf === k}">${esc(k)}</button>`).join("")}</div>
          ${list.length ? `<ol class="hl-top">${list.slice(0, 3).map((v, i) => hallCard(v, i, true)).join("")}</ol><ol class="hl-grid">${list.slice(3).map((v, i) => hallCard(v, i + 3)).join("")}</ol>` : `<p class="rk-empty">この期間の殿堂入りは、まだありません。</p>`}
          ${upLine(x)}`;
        hl.querySelectorAll("[data-p]").forEach(b => b.onclick = () => { p = b.dataset.p; kf = ""; history.replaceState(null, "", "#" + p); draw(); });
        hl.querySelectorAll("[data-k]").forEach(b => b.onclick = () => { kf = b.dataset.k; draw(); }); };
        draw(); });
    }
  };
  owRankMount();
})();
