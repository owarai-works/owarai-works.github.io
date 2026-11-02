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
    ["b", "現場に到着した消防車ですが……", "消す前にまず自分な", 98, 42, "fire"],
    ["t", "金魚鉢をのぞいてみると……", "猫と金魚、住所交換すな！", 98, 40, "cat"],
    ["g", "ラーメンをひと口食べた男。吹き出しのセリフは？", "大将、これ……去年の味や", 97, 39, "mg_food"],
    ["b", "回転寿司に来てみたら……", "すみません、サーモンの隣の人ください", 97, 38, "sushi"],
    ["b", "休日の動物園で……", "サル「人間、今日もかわいいな」", 96, 36, "zoo"],
    ["t", "会社の飲み会のあとのカラオケ", "大根で歌うな、おろせ！", 96, 35, "karaoke"],
    ["b", "お化け屋敷に入ってみたら", "こっちが成仏しそう", 95, 34, "obake"],
    ["g", "美容院で鏡を見た客。吹き出しのセリフは？", "これ、髪型ちゃう。警報や", 95, 32, "mg_biyou"],
    ["b", "就職の面接で……", "ニワトリも御社の面接官ですか", 94, 31, "mensetsu"],
    ["t", "こだわりのラーメン屋", "湯切りでお客さんまで切るな！", 94, 30, "ramen"],
    ["b", "静かにしなければいけない図書館で", "本も静かにできへん", 93, 29, "sumo"],
    ["b", "今日は快晴。", "俺専用の梅雨", 93, 27, "umbrella"],
    ["g", "面接で立ち上がった就活生。吹き出しのセリフは？", "御社、ぼくが買います！", 92, 26, "mg_mensetsu"],
    ["t", "絶叫マシンに乗ったおばあちゃん", "急降下中に一目ずつ進めるな！", 92, 25, "coaster"],
    ["b", "朝の満員電車", "一番ちゃんと休んでる", 91, 23, "sloth"],
    ["b", "苦労して山頂にたどり着くと……", "肉まん温めますか？", 91, 22, "summit"],
    ["t", "公園で鳩にエサをあげるおじいさん", "パンくずのサイズ合ってへんやろ！", 90, 21, "dacho"],
    ["g", "満員電車で寄りかかられたサラリーマン。吹き出しのセリフは？", "よだれの家賃、払ってもらいます", 90, 19, "mg_train"],
    ["b", "今日は授業参観の日", "「お父さんそっくりね」", 89, 18, "sankan"],
    ["b", "引っ越し業者がやってきた", "荷造り、いらんかったな", 89, 17, "hikkoshi"],
    ["t", "駅のホームで電車を待っていると……", "通勤するな、南極に帰れ！", 88, 16, "eki"],
    ["b", "美容院で「おまかせで」と頼んだら……", "おまかせって言うたけど", 88, 14, "biyoin"],
    ["d", "この人にあだ名をつけよう！", "おにぎり番長", 87, 13, "adana_001"],
    ["b", "コンビニでお釣りをもらったら……", "お釣りは江戸時代でお願いします", 87, 12, "konbini"],
    ["t", "運動会の親子リレー", "親子リレーで宇宙行く気か！", 86, 10, "undokai"],
    ["b", "病院の待合室で……", "おとなしく笹で待ちましょう", 86, 9, "byoin"],
    ["b", "キャンプの朝、テントを開けたら……", "クマ「あと五分…」", 85, 8, "camp"],
    ["d", "この人にあだ名をつけよう！", "七色の仙人", 85, 6, "adana_008"],
    ["t", "スポーツジムで……", "うさぎと勝負する前に休め！", 84, 5, "gym"],
    ["b", "ボウリング場で……", "種まで全部スペア", 84, 4, "bowling"]
  ];
  const sampleHall = () => { const all = SH.filter(x => x[5]).map(([kind, odai, text, score, likes, pic]) => ({kind, odai, text, score, likes, pic: pic ? "assets/img/odai/" + pic + ".webp" : ""}));
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
