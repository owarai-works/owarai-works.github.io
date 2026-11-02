#!/usr/bin/env python3
"""ゲームのデータベースの写し（ArtifactData の out_dir）から、ホームページ用の assets/data/ranking.json を作る。
使い方: python3 -I tools/build_ranking.py <dump_dir> <出力ファイル>
  dump_dir/boards/*.json … boards コレクション（pvppoint_all・pvppoint_cal_YYYY-MM・pvppoint_d_YYYY-MM-DD・hall_week・hall_cal_YYYY-MM）
  dump_dir/hall/*.json   … hall コレクション（score の高い順に最大300件）＝殿堂の永世
  dump_dir/news/ban.json … 運営の利用停止・消したネタ・禁止の言葉
芸名は出さない（ユーザーの希望）。利用停止の人・消したネタ・禁止の言葉をふくむネタ・通報3件以上のネタは出さない。
"""
import json, sys, os, glob, datetime

dump, out = sys.argv[1], sys.argv[2]
def load(p):
    try:
        with open(p, encoding="utf-8") as f: return json.load(f)
    except Exception: return None
def board(i):
    d = load(os.path.join(dump, "boards", i + ".json")) or {}
    d = d.get("data", d)
    return d.get("rows") or []

JST = datetime.timezone(datetime.timedelta(hours=9))
now = datetime.datetime.now(JST)
ban = load(os.path.join(dump, "news", "ban.json")) or {}
ban = ban.get("data", ban)
ban_u = set((ban.get("u") or {}).keys()) if isinstance(ban.get("u"), dict) else set(ban.get("u") or [])
ban_t = set(ban.get("t") or [])
ban_w = [w for w in (ban.get("w") or []) if isinstance(w, str) and w]

def rank_rows(rows, n=10):
    rows = [r for r in rows if r.get("id") not in ban_u and not r.get("sample") and (r.get("sc") or 0) > 0]
    rows.sort(key=lambda r: -(r.get("sc") or 0))
    out, last, rk = [], None, 0
    for i, r in enumerate(rows[:n]):
        if r.get("sc") != last: rk = i + 1; last = r.get("sc")
        out.append({"rank": rk, "wins": r.get("sc") or 0})
    return out

# お題合戦ランクマッチ（勝利数）：週間＝直近7日の日ごとの表の合計、月間＝今月、永世＝全期間
K = "pvppoint"
week = {}
for i in range(7):
    day = (now - datetime.timedelta(days=i)).strftime("%Y-%m-%d")
    for r in board(f"{K}_d_{day}"):
        if not r.get("id"): continue
        w = week.setdefault(r["id"], {"id": r["id"], "sc": 0}); w["sc"] += r.get("sc") or 0
ranking = {"week": rank_rows(list(week.values())), "month": rank_rows(board(f"{K}_cal_{now.strftime('%Y-%m')}")), "all": rank_rows(board(f"{K}_all"))}

# 殿堂（80点以上）。並びはゲームと同じ：点数 → みんなの評価の平均 → いいね → 新しい方
def ok(v):
    if not v or not v.get("text") or v.get("id") in ban_t or v.get("uid") in ban_u: return False
    if (v.get("repn") or 0) >= 3 or (v.get("score") or 0) < 80: return False
    return not any(w in v.get("text", "") or w in (v.get("ctx") or "") for w in ban_w)
def key(v):
    rn = v.get("rn") or 0
    return (-(v.get("score") or 0), -((v.get("rsum") or 0) / rn if rn else 0), -(v.get("likes") or 0), -(v.get("at") or 0))
def slim(v):
    return {"odai": str(v.get("ctx") or "")[:60], "text": str(v.get("text") or "")[:60], "score": v.get("score") or 0, "likes": v.get("likes") or 0, "kind": v.get("kind") or "", "at": v.get("at") or 0}
def hall_list(rows): return [slim(v) for v in sorted(filter(ok, rows), key=key)[:30]]
hall_all = []
for p in glob.glob(os.path.join(dump, "hall", "*.json")):
    d = load(p) or {}; v = d.get("data", d); v["id"] = d.get("id", os.path.basename(p)[:-5]); hall_all.append(v)
hall = {"week": hall_list(board("hall_week")), "month": hall_list(board(f"hall_cal_{now.strftime('%Y-%m')}")), "all": hall_list(hall_all)}

res = {"updated": now.strftime("%Y-%m-%d %H:%M"), "month": now.strftime("%Y年%-m月"), "gassen": ranking, "hall": hall}
os.makedirs(os.path.dirname(out) or ".", exist_ok=True)
with open(out, "w", encoding="utf-8") as f: json.dump(res, f, ensure_ascii=False, indent=1)
print("ok", {k: len(v) for k, v in ranking.items()}, {k: len(v) for k, v in hall.items()})
