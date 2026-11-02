/* =========================================================
   ゲームと連動した番付・殿堂（assets/data/ranking.json を読む。毎日19時ごろ自動で更新）
   ・芸名は出さない（順位と勝利数だけ／殿堂はお題と回答だけ）
   ========================================================= */
window.owRankMount = () => {
  const root = document.getElementById("rankbox"); if (!root || root.dataset.on) return; root.dataset.on = "1";
  const P = [["week", "週間"], ["month", "月間"], ["all", "永世"]];
  const esc = s => String(s).replace(/[&<>"]/g, c => ({"&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;"}[c]));
  const medal = r => r === 1 ? "🥇" : r === 2 ? "🥈" : r === 3 ? "🥉" : r;
  let D = null, gp = "week", hp = "week";
  const tabs = (cur, k) => `<div class="rk-tabs" role="tablist">${P.map(([p, n]) => `<button type="button" role="tab" data-${k}="${p}" aria-selected="${p === cur}">${n}</button>`).join("")}</div>`;
  const draw = () => {
    const g = D ? D.gassen[gp] || [] : [], h = D ? D.hall[hp] || [] : [];
    root.innerHTML = `<div class="rk-grid">
      <div class="rk-card rk-g"><h3><span>お題合戦ランクマッチ</span><small>勝利数の番付 TOP10</small></h3>${tabs(gp, "g")}
        ${g.length ? `<ol class="rk-list">${g.map(r => `<li class="r${r.rank}"><b>${medal(r.rank)}</b><span>${r.rank}位の芸人</span><em>${r.wins}<small>勝</small></em></li>`).join("")}</ol>`
          : `<p class="rk-empty">まだ番付に載った人はいません。<br><b>1位第1号</b>は、あなたかも！</p>`}
      </div>
      <div class="rk-card rk-h"><h3><span>みんなの殿堂</span><small>AIが80点以上をつけた名回答 TOP30</small></h3>${tabs(hp, "h")}
        ${h.length ? `<ol class="rk-hall">${h.map((v, i) => `<li><i>${i + 1}</i><div>${v.odai ? `<small>お題：${esc(v.odai)}</small>` : ""}<p>「${esc(v.text)}」</p><span><b>${v.score}点</b>${v.likes ? `・ええやん ${v.likes}` : ""}</span></div></li>`).join("")}</ol>`
          : `<p class="rk-empty">殿堂入りの名回答は、まだありません。<br>AIに<b>80点以上</b>をつけさせたら、ここに載るかも！</p>`}
      </div></div>
      <p class="rk-up">${D ? `${esc(D.updated)} 更新（毎日19時ごろ）` : "準備中"}・芸名は表示していません</p>`;
    root.querySelectorAll("[data-g]").forEach(b => b.onclick = () => { gp = b.dataset.g; draw(); });
    root.querySelectorAll("[data-h]").forEach(b => b.onclick = () => { hp = b.dataset.h; draw(); });
  };
  draw();
  fetch("assets/data/ranking.json?t=" + Math.floor(Date.now() / 6e5)).then(r => r.ok ? r.json() : null).then(d => { if (d) { D = d; draw(); } }).catch(() => {});
};
owRankMount();
