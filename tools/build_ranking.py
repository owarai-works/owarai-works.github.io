#!/usr/bin/env python3
"""ゲームのデータベースの写し（ArtifactData の out_dir）から、ホームページ用の assets/data/ranking.json を作る。
使い方: python3 -I tools/build_ranking.py <dump_dir> <出力ファイル>
  dump_dir/rank/*.json   … rank コレクション（1人1つ。v=2 の s.<キー> に {a: 永世, m: {年月: [数,…]}, d: {日付: [数,…]}, w: {週の月曜: [数,…]}}）
  dump_dir/boards/*.json … boards コレクション（hall_week・hall_cal_YYYY-MM）
  dump_dir/hall/*.json   … hall コレクション（score の高い順に最大300件）＝殿堂の永世
  dump_dir/gpres/*.json  … 笑神グランプリの終わった回の結果（TOP100）
  dump_dir/news/ban.json・bdhide.json・gp.json … 利用停止・かくした記録・笑神GPのお題の一覧
芸名は出さない（ユーザーの希望）。利用停止の人・かくした記録・消したネタ・禁止の言葉をふくむネタ・通報3件以上のネタは出さない。
ランキング（11-22 ユーザー）：お題合戦のレート・1先の鬼の連勝・笑神グランプリ。並べ方はゲームの bpRows と同じ。
"""
import json, sys, os, glob, datetime

dump, out = sys.argv[1], sys.argv[2]
def load(p):
    try:
        with open(p, encoding="utf-8") as f: return json.load(f)
    except Exception: return None
def doc(p):
    d = load(p) or {}
    return d.get("data", d) if isinstance(d, dict) else {}
def board(i): return doc(os.path.join(dump, "boards", i + ".json")).get("rows") or []

JST = datetime.timezone(datetime.timedelta(hours=9))
now = datetime.datetime.now(JST)
today = now.strftime("%Y-%m-%d"); mk = now.strftime("%Y-%m")
monday = (now - datetime.timedelta(days=now.weekday())).date()
week_days = [(monday + datetime.timedelta(days=i)).isoformat() for i in range(7)]
ban = doc(os.path.join(dump, "news", "ban.json"))
ban_u = set((ban.get("u") or {}).keys()) if isinstance(ban.get("u"), dict) else set(ban.get("u") or [])
ban_t = set(ban.get("t") or [])
ban_w = [w for w in (ban.get("w") or []) if isinstance(w, str) and w]
hide = doc(os.path.join(dump, "news", "bdhide.json")).get("h") or {}
def hidden(uid, k): h = hide.get(uid) or {}; return bool(h.get("*") or h.get(k))
def bad_text(*ts): return any(w in (t or "") for t in ts for w in ban_w)

# ---------- 一人ずつの記録（rank/<uid>） ----------
people = []
for p in glob.glob(os.path.join(dump, "rank", "*.json")):
    d = load(p) or {}; v = d.get("data", d)
    if not isinstance(v, dict) or v.get("v") != 2 or not isinstance(v.get("s"), dict) or v.get("sample"): continue
    people.append((d.get("id") or os.path.basename(p)[:-5], v))
def num(x):
    try: return float(x[0]) if isinstance(x, list) and x else 0
    except Exception: return 0
def value(e, k, per):
    """ゲームの bpRows と同じ数え方。rkrate：週＝今週上がった分・月＝今月いちばん高いレート・永世＝いまのレート。oni：その期間の最高連勝。"""
    if per == "all": return float(e.get("a") or 0)
    if k == "rkrate":
        return num((e.get("m") or {}).get(mk)) if per == "month" else num((e.get("w") or {}).get(week_days[0]))
    D = {d: y for d, y in (e.get("d") or {}).items() if d <= today}  # 未来の日付は数えない
    if per == "month":
        best = num((e.get("m") or {}).get(mk))
        return max([best] + [num(y) for d, y in D.items() if d.startswith(mk)])
    return max([0] + [num(D.get(d)) for d in week_days])
ONI_TTL = [[0, "子鬼"], [3, "黄鬼"], [5, "青鬼"], [7, "赤鬼"], [10, "紫鬼"], [15, "黒鬼"], [20, "夜叉"], [30, "羅刹"], [40, "修羅"], [50, "覇鬼"], [75, "鬼神"], [100, "閻魔"]]
def oni_ttl(n): return [t for th, t in ONI_TTL if n >= th][-1]
def board_of(k, per, n=50):
    rows = []
    for uid, v in people:
        e = v["s"].get(k)
        if not isinstance(e, dict) or uid in ban_u or hidden(uid, k): continue
        x = value(e, k, per)
        if x > 0: rows.append((x, float(e.get("at") or 0)))
    rows.sort(key=lambda r: (-r[0], r[1]))
    res, last, rk = [], None, 0
    for i, (x, _) in enumerate(rows[:n]):
        if x != last: rk = i + 1; last = x
        o = {"rank": rk, "v": int(round(x))}
        if k == "oni": o["ttl"] = oni_ttl(o["v"])
        res.append(o)
    return res
PER = ["week", "month", "all"]
rate = {p: board_of("rkrate", p) for p in PER}
oni = {p: board_of("oni", p) for p in PER}

# ---------- 笑神グランプリ（いちばん新しい、終わった回） ----------
PICS = json.load(open(os.path.join(os.path.dirname(os.path.abspath(__file__)), "odai_pics.json"), encoding="utf-8"))
gp_list = [o for o in (doc(os.path.join(dump, "news", "gp.json")).get("list") or []) if isinstance(o, dict) and not o.get("del") and int(o.get("no") or 0) > 0]
gp_list.sort(key=lambda o: int(o["no"]))
disp = {int(o["no"]): i + 1 for i, o in enumerate(gp_list)}  # 画面の「第○回」（消した回をとばした番号）
gp = None
for o in sorted(gp_list, key=lambda o: -int(o["no"])):
    r = doc(os.path.join(dump, "gpres", str(o["no"]) + ".json"))
    rows = [v for v in (r.get("rows") or []) if isinstance(v, dict) and v.get("text") and (v.get("ok") or (v.get("repn") or 0) < 3)
            and v.get("uid") not in ban_u and v.get("id") not in ban_t and not bad_text(v.get("text")) and not v.get("del")]
    if not rows: continue
    pic = PICS.get(str(o.get("sid") or ""))
    gp = {"no": disp.get(int(o["no"]), int(o["no"])), "odai": str(o.get("t") or "")[:80], "kind": o.get("k") or "t", "pic": ("assets/img/odai/" + pic) if pic else "",
          "n": int(r.get("n") or 0), "end": int(o.get("end") or 0),
          "rows": [{"rank": i + 1, "text": str(v.get("text") or "")[:40], "likes": int(v.get("likes") or 0), "av": round((v.get("rsum") or 0) / v["rn"], 1) if v.get("rn") else 0} for i, v in enumerate(rows[:10])]}
    break

# ---------- 殿堂（80点以上）。並びはゲームと同じ：点数 → みんなの評価の平均 → いいね → 新しい方 ----------
def ok(v):
    if not v or not v.get("text") or v.get("id") in ban_t or v.get("uid") in ban_u: return False
    if (v.get("repn") or 0) >= 3 or (v.get("score") or 0) < 80: return False
    return not bad_text(v.get("text"), v.get("ctx"))
def key(v):
    rn = v.get("rn") or 0
    return (-(v.get("score") or 0), -((v.get("rsum") or 0) / rn if rn else 0), -(v.get("likes") or 0), -(v.get("at") or 0))
def slim(v):
    pic = PICS.get(str(v.get("sid") or ""))
    return {"pic": ("assets/img/odai/" + pic) if pic else "", "odai": str(v.get("ctx") or "")[:60], "text": str(v.get("text") or "")[:60], "score": v.get("score") or 0, "likes": v.get("likes") or 0, "kind": v.get("kind") or "", "at": v.get("at") or 0}
def hall_list(rows): return [x for x in (slim(v) for v in sorted(filter(ok, rows), key=key)) if x["pic"]][:30]  # 殿堂はイラストのあるお題だけ（ユーザーの希望）
hall_all = []
for p in glob.glob(os.path.join(dump, "hall", "*.json")):
    d = load(p) or {}; v = d.get("data", d); v["id"] = d.get("id", os.path.basename(p)[:-5]); hall_all.append(v)
hall = {"week": hall_list(board("hall_week")), "month": hall_list(board(f"hall_cal_{mk}")), "all": hall_list(hall_all)}

res = {"updated": now.strftime("%Y-%m-%d %H:%M"), "month": now.strftime("%Y年%-m月"), "week": f"{monday.month}/{monday.day}〜",
       "rate": rate, "oni": oni, "gp": gp, "hall": hall}
os.makedirs(os.path.dirname(out) or ".", exist_ok=True)
with open(out, "w", encoding="utf-8") as f: json.dump(res, f, ensure_ascii=False, indent=1)
print("ok rate", {k: len(v) for k, v in rate.items()}, "oni", {k: len(v) for k, v in oni.items()}, "gp", (gp or {}).get("no"), "hall", {k: len(v) for k, v in hall.items()})
