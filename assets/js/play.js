/* =========================================================
   ホームページで遊べるもの（AIは使わない）
   A ハリセン連打チャレンジ  B 今日のお題  C お笑いタイプ診断
   D ツッコミ・タイミング    E 今日の笑い運おみくじ
   それぞれ <div data-play="mash|daily|type|timing|omikuji"> に入る
   ========================================================= */
window.owPlayMount = () => {
  const esc = s => String(s).replace(/[&<>"]/g, c => ({"&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;"}[c]));
  const sfx = n => window.owSfx && owSfx(n);
  const track = (n, p) => window.owTrack && owTrack(n, p);
  const voice = (k, v) => { try { const a = new Audio(`assets/vo/${k}_${v}.mp3`); a.volume = .9; a.play().catch(() => {}); } catch (e) {} };
  const URL0 = "https://owarai-works.github.io/";
  const share = (t, ev) => `<a class="btn sm pl-share" target="_blank" rel="noopener" data-ev="${ev}" href="https://twitter.com/intent/tweet?text=${encodeURIComponent(t + "\n#お笑い道場なんでやねん")}&url=${encodeURIComponent(URL0)}">𝕏 ポストする</a>`;
  const bindShare = el => el.querySelectorAll(".pl-share").forEach(a => a.addEventListener("click", () => track("share", {method: "x", content_type: a.dataset.ev})));
  const jstDay = () => { const d = new Date(Date.now() + 9 * 3600e3); return d.toISOString().slice(0, 10); };
  const hash = s => { let h = 2166136261; for (const c of s) { h ^= c.charCodeAt(0); h = Math.imul(h, 16777619); } return h >>> 0; };
  const get = k => { try { return localStorage.getItem(k); } catch (e) { return null; } };
  const set = (k, v) => { try { localStorage.setItem(k, v); } catch (e) {} };

  document.querySelectorAll("[data-play]:not([data-on])").forEach(el => { el.dataset.on = "1"; const t = el.dataset.play;

    /* ---------- A：ハリセン連打 ---------- */
    if (t === "mash") {
      const RANK = n => n >= 90 ? ["横綱", "kineko", "high1"] : n >= 75 ? ["大関", "kineko", "win"] : n >= 60 ? ["関脇", "momoe", "high1"] : n >= 45 ? ["小結", "momoe", "pass1"] : n >= 30 ? ["前頭", "aoi", "pass1"] : ["見習い", "aoi", "fail1"];
      const best = () => +get("ow-mash-best") || 0;
      const idle = () => { el.innerHTML = `<div class="ms"><p class="ms-best">自己ベスト <b>${best()}</b> 回</p><button type="button" class="ms-btn" aria-label="ハリセンをたたく"><img src="assets/img/fun/harisen.webp" alt=""><span>タップで<br>スタート！</span></button><p class="ms-hint">10秒間、ハリセンを連打！<br>パソコンはスペースキーでもOK</p></div>`; el.querySelector(".ms-btn").onclick = go; };
      const go = () => { let n = 0, left = 10, on = true; track("play_start", {game: "mash"});
        el.innerHTML = `<div class="ms run"><div class="ms-top"><span class="ms-time"><b>10.0</b>秒</span><span class="ms-n"><b>0</b>回</span></div><button type="button" class="ms-btn" aria-label="ハリセンをたたく"><img src="assets/img/fun/harisen.webp" alt=""></button><div class="ms-bar"><i></i></div></div>`;
        const b = el.querySelector(".ms-btn"), nb = el.querySelector(".ms-n b"), tb = el.querySelector(".ms-time b"), bar = el.querySelector(".ms-bar i"), t0 = performance.now();
        const hit = e => { if (!on) return; if (e) e.preventDefault(); n++; nb.textContent = n; sfx(n % 5 ? "pon" : "slap"); b.classList.remove("hit"); void b.offsetWidth; b.classList.add("hit");
          const s = document.createElement("i"); s.className = "ms-pop"; s.textContent = ["パン!", "バシッ!", "なんで!", "やねん!"][n % 4]; s.style.left = (20 + Math.random() * 60) + "%"; b.append(s); setTimeout(() => s.remove(), 600); };
        b.addEventListener("pointerdown", hit);
        const key = e => { if (e.code === "Space" && el.getBoundingClientRect().top < innerHeight) hit(e); }; addEventListener("keydown", key);
        const tick = () => { const s = Math.max(0, 10 - (performance.now() - t0) / 1000); tb.textContent = s.toFixed(1); bar.style.width = (s * 10) + "%"; if (s > 0 && el.isConnected) requestAnimationFrame(tick); else end(); };
        const end = () => { if (!on) return; on = false; removeEventListener("keydown", key); const [r, k, v] = RANK(n), nb2 = n > best(); if (nb2) set("ow-mash-best", n); voice(k, v); track("play_finish", {game: "mash", score: n});
          el.innerHTML = `<div class="ms done"><img class="pl-face" src="assets/img/ex/${k}_laugh0.webp" alt=""><p class="pl-res"><b>${n}</b>回</p><p class="pl-rank">番付：<b>${r}</b>${nb2 ? `<em>自己ベスト更新！</em>` : ""}</p><div class="pl-btns"><button type="button" class="btn sm ms-again">もう一回</button>${share(`ハリセン連打チャレンジで10秒間に${n}回！番付は「${r}」でした👏 あなたは何回たたける？`, "mash")}</div></div>`;
          el.querySelector(".ms-again").onclick = go; bindShare(el); };
        requestAnimationFrame(tick); };
      idle();
    }

    /* ---------- B：今日のお題 ---------- */
    if (t === "daily") {
      fetch("assets/data/daily.json").then(r => r.json()).then(L => {
        const day = jstDay(), q = L[hash(day) % L.length], [id, odai, ans] = q;
        el.innerHTML = `<div class="dl"><p class="dl-day">${day.replace(/-/g, ".")} の お題</p><figure class="dl-pic"><img src="assets/img/odai/${esc(id)}.webp" alt="今日のお題の絵"><figcaption>${esc(odai)}</figcaption></figure>
          <p class="dl-q">この絵に、ひとことボケてみよう！<small>頭の中で考えてから、下のボタンを押してな</small></p>
          <button type="button" class="btn dl-open">シスターズの答えを見る</button><div class="dl-ans" hidden></div><p class="dl-next">お題は毎日0時に変わります</p></div>`;
        el.querySelector(".dl-open").onclick = e => { e.currentTarget.remove(); sfx("slap"); voice("kineko", "pass1"); track("play_finish", {game: "daily"});
          const a = el.querySelector(".dl-ans"); a.hidden = false;
          a.innerHTML = `<div class="dl-a"><img src="assets/img/ex/kineko_laugh0.webp" alt=""><p><small>気猫</small>「${esc(ans[0])}」</p></div><div class="dl-a b"><img src="assets/img/ex/aoi_smile0.webp" alt=""><p><small>葵</small>「${esc(ans[1])}」</p></div>
            <p class="dl-c">あなたの答えのほうがおもろかった？<br>ゲームでは<b>あなたの答えをAIが100点満点で採点</b>するで！</p><div class="pl-btns">${share(`今日のお題「${odai}」…みんなならどうボケる？`, "daily")}</div>`; bindShare(a); };
      }).catch(() => { el.textContent = "お題を読みこめませんでした。"; });
    }

    /* ---------- C：お笑いタイプ診断 ---------- */
    if (t === "type") {
      const Q = [["友達がすべった！あなたは？", ["すかさずかぶせてボケる", "「なんでやねん！」とツッコむ", "気づかずにこにこしている"]],
        ["好きなお笑いは？", ["一発ギャグ・コント", "しゃべくり漫才", "ほっこりする天然ネタ"]],
        ["飲み会でのあなたは？", ["盛り上げ役・マイクを離さない", "みんなの話をまとめる司会役", "いつのまにか寝ている"]],
        ["大喜利のお題を見たら？", ["とりあえず勢いで答える", "ひねった答えを考える", "思ったことをそのまま言う"]],
        ["よく言われるのは？", ["元気だね！", "するどいね！", "マイペースだね！"]]];
      const T = [["kineko", "ボケ型", "気猫タイプ", "#f4b400", "場の空気を一瞬で明るくする、生まれながらの盛り上げ役！勢いのあるボケで笑いをとるタイプ。", "intro"],
        ["aoi", "ツッコミ型", "葵タイプ", "#2f7fe0", "どんなボケも見のがさない、するどいツッコミの職人！言葉えらびのセンスで笑いを生むタイプ。", "intro"],
        ["momoe", "天然型", "百萌タイプ", "#e8558f", "本人はまじめなのに、なぜか笑いが起きる天然の才能！ほんわかした空気で人を笑顔にするタイプ。", "intro"]];
      const start = () => { const sc = [0, 0, 0]; let i = 0; track("play_start", {game: "type"});
        const ask = () => { const [q, ops] = Q[i];
          el.innerHTML = `<div class="ty"><p class="ty-n">Q${i + 1} / ${Q.length}</p><div class="ty-bar"><i style="width:${i / Q.length * 100}%"></i></div><p class="ty-q">${q}</p><div class="ty-ops">${ops.map((o, j) => `<button type="button" data-j="${j}">${o}</button>`).join("")}</div></div>`;
          el.querySelectorAll("[data-j]").forEach(b => b.onclick = () => { sc[+b.dataset.j]++; sfx("pon"); i++; i < Q.length ? ask() : res(); }); };
        const res = () => { const m = Math.max(...sc), k = sc.indexOf(m), [ch, ty, nm, col, txt, v] = T[k]; voice(ch, v); sfx("slap"); track("play_finish", {game: "type", result: ch});
          el.innerHTML = `<div class="ty done" style="--tc:${col}"><p class="ty-lead">あなたのお笑いタイプは…</p><img class="ty-face" src="assets/img/st_${ch}.webp" alt=""><p class="ty-type"><b>${ty}</b><span>${nm}</span></p><p class="ty-txt">${txt}</p>
            <div class="pl-btns"><button type="button" class="btn sm ty-again">もう一回</button>${share(`お笑いタイプ診断の結果は「${ty}（${nm}）」でした！あなたは何タイプ？`, "type")}<a class="btn ghost sm" href="characters.html#${ch}">${nm.replace("タイプ", "")}を見る</a></div></div>`;
          el.querySelector(".ty-again").onclick = start; bindShare(el); };
        ask(); };
      el.innerHTML = `<div class="ty"><p class="ty-q">5つの質問で、あなたの<b>お笑いタイプ</b>を診断！</p><div class="ty-faces"><img src="assets/img/face_kineko.webp" alt=""><img src="assets/img/face_aoi.webp" alt=""><img src="assets/img/face_momoe.webp" alt=""></div><button type="button" class="btn ty-go">診断スタート</button></div>`;
      el.querySelector(".ty-go").onclick = start;
    }

    /* ---------- D：ツッコミ・タイミング ---------- */
    if (t === "timing") {
      const BOKE = [["今日は雨やから、", "傘のかわりに天ぷら持ってきたわ"], ["最近ジム通ってんねん。", "見学専門やけど"], ["うちの猫、", "毎朝わたしを起こして家賃の話してくるねん"], ["新幹線で来たで。", "ホームまで"], ["ダイエット始めた！", "お菓子の袋を小さくした"], ["料理得意やねん。", "注文するのが"]];
      const start = () => { let r = 0, tot = 0; track("play_start", {game: "timing"});
        const round = () => { const [a, b] = BOKE[(Math.random() * BOKE.length) | 0];
          el.innerHTML = `<div class="tm"><p class="tm-r">${r + 1} / 3 本目</p><div class="tm-stage"><img class="tm-f" src="assets/img/ex/kineko_smile0.webp" alt=""><p class="tm-b"><span>${esc(a)}</span><span class="tm-b2">${esc(b)}</span></p></div><div class="tm-bar"><i class="tm-zone"></i><i class="tm-cur"></i></div><button type="button" class="btn tm-go">なんでやねん！</button><p class="tm-res" aria-live="polite"></p><p class="tm-hint">ボケを言い切った<b>直後</b>（緑のところ）で押せ！</p></div>`;
          const cur = el.querySelector(".tm-cur"), b2 = el.querySelector(".tm-b2"), f = el.querySelector(".tm-f"), dur = 2600, z0 = .62, z1 = .78, t0 = performance.now(); let done = false, raf;
          const tick = () => { const p = (performance.now() - t0) / dur; cur.style.left = Math.min(100, p * 100) + "%"; if (p > .25) b2.classList.add("on"); if (p >= 1) return hit(1.2); raf = requestAnimationFrame(tick); };
          const hit = p => { if (done) return; done = true; cancelAnimationFrame(raf); p = p ?? (performance.now() - t0) / dur;
            const c = (z0 + z1) / 2, sc = p >= z0 && p <= z1 ? Math.round(100 - Math.abs(p - c) / ((z1 - z0) / 2) * 20) : p < z0 ? Math.max(0, Math.round(60 - (z0 - p) * 200)) : Math.max(0, Math.round(60 - (p - z1) * 250));
            tot += sc; const good = sc >= 80; sfx(good ? "slap" : "pon"); f.src = `assets/img/ex/kineko_${good ? "laugh" : "surprise"}0.webp`;
            const msg = p < z0 ? "早すぎ！まだボケ途中や！" : p > z1 ? (p >= 1.2 ? "ツッコミ忘れてるで！" : "遅い！間が空いてもうた…") : sc >= 95 ? "完ぺきなタイミング！" : "ええタイミング！";
            const rs = el.querySelector(".tm-res"); rs.className = "tm-res" + (good ? " good" : ""); rs.innerHTML = `<b>${sc}</b>点　${msg}`;
            const btn = el.querySelector(".tm-go"); btn.textContent = r < 2 ? "次のボケ" : "結果を見る"; btn.classList.add("tm-next");  /* ボタンは同じ場所のまま、文字だけ変える */
            btn.onclick = () => { r++; r < 3 ? round() : end(); }; };
          el.querySelector(".tm-go").onclick = () => { if (!done) hit(); }; requestAnimationFrame(tick); };
        const end = () => { const r = tot >= 270 ? "ツッコミの神" : tot >= 220 ? "一流ツッコミ" : tot >= 150 ? "なかなかの相方" : "ツッコミ見習い"; voice("aoi", tot >= 220 ? "high1" : "pass1"); track("play_finish", {game: "timing", score: tot});
          el.innerHTML = `<div class="tm done"><img class="pl-face" src="assets/img/ex/aoi_${tot >= 220 ? "laugh" : "smile"}0.webp" alt=""><p class="pl-res"><b>${tot}</b>点 / 300</p><p class="pl-rank"><b>${r}</b></p><div class="pl-btns"><button type="button" class="btn sm tm-again">もう一回</button>${share(`ツッコミ・タイミングで${tot}点！「${r}」でした🪭`, "timing")}</div></div>`;
          el.querySelector(".tm-again").onclick = start; bindShare(el); };
        round(); };
      el.innerHTML = `<div class="tm"><p class="ty-q">気猫のボケに、<b>ベストなタイミング</b>でツッコめ！</p><img class="pl-face" src="assets/img/ex/kineko_smile0.webp" alt=""><button type="button" class="btn tm-start">スタート</button></div>`;
      el.querySelector(".tm-start").onclick = start;
    }

    /* ---------- E：今日の笑い運おみくじ ---------- */
    if (t === "omikuji") {
      const R = [["大吉", "kineko", "laugh", "high1", "今日は何を言ってもウケる日！思いきってボケてみよう。", "ハリセン"], ["中吉", "momoe", "smile", "pass1", "ほんわかした一言が、思わぬ笑いを生むかも。", "桜の扇子"], ["小吉", "aoi", "smile", "pass1", "ツッコミがさえる日。友達のボケを見のがすな！", "座布団"], ["吉", "kineko", "smile", "intro", "いつもどおりが一番おもろい。自然体でいこう。", "マイク"], ["末吉", "momoe", "surprise", "fail1", "あとから効いてくる笑い運。夜にいいことあるかも。", "提灯"], ["大スベり", "aoi", "angry", "fail1", "今日はスベっても気にしない！スベった数だけ強くなる。", "小判"]];
      const key = "ow-omikuji", day = jstDay(), saved = (get(key) || "").split("|");
      const show = (i, fresh) => { const [n, ch, ex, v, txt, item] = R[i]; if (fresh) { voice(ch, v); sfx("slap"); }
        el.innerHTML = `<div class="om done"><div class="om-paper"><p class="om-day">${day.replace(/-/g, ".")}</p><p class="om-n">${n}</p><img src="assets/img/ex/${ch}_${ex}0.webp" alt=""><p class="om-t">${txt}</p><p class="om-i">ラッキーアイテム：<b>${item}</b></p></div><div class="pl-btns">${share(`今日の笑い運は「${n}」でした！${txt}`, "omikuji")}</div><p class="dl-next">おみくじは1日1回。明日また引いてな！</p></div>`; bindShare(el); };
      if (saved[0] === day) show(+saved[1], false);
      else { el.innerHTML = `<div class="om"><button type="button" class="om-box" aria-label="おみくじを引く"><span>笑</span><b>おみくじ</b></button><p class="ms-hint">押して、今日の笑い運を占おう（1日1回）</p></div>`;
        el.querySelector(".om-box").onclick = e => { const bx = e.currentTarget; bx.classList.add("shake"); sfx("pon"); track("play_finish", {game: "omikuji"});
          setTimeout(() => { const w = [8, 18, 22, 26, 16, 10], s = w.reduce((a, b) => a + b); let x = Math.random() * s, i = 0; while ((x -= w[i]) > 0) i++; set(key, day + "|" + i); show(i, true); }, 900); }; }
    }
  });
};
owPlayMount();
