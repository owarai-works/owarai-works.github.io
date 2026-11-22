import json, sys, re, colorsys
from PIL import Image
import numpy as np
pre = sys.argv[1]
items = json.load(open(pre + '.json'))
bg = np.asarray(Image.open(pre + '_bg.png').convert('RGB')).astype(float) / 255
def lum(c):
    c = np.where(c <= .03928, c / 12.92, ((c + .055) / 1.055) ** 2.4)
    return .2126 * c[..., 0] + .7152 * c[..., 1] + .0722 * c[..., 2]
def parse(s):
    m = re.findall(r'[\d.]+', s); return np.array([float(m[0]), float(m[1]), float(m[2])]) / 255, (float(m[3]) if len(m) > 3 else 1)
bad = []
for it in items:
    if it['stroke']: continue
    x0, y0 = int(max(0, it['x'])), int(max(0, it['y'])); x1, y1 = int(min(bg.shape[1], it['x'] + it['w'])), int(min(bg.shape[0], it['y'] + it['h']))
    if x1 - x0 < 2 or y1 - y0 < 2: continue
    reg = bg[y0:y1, x0:x1].reshape(-1, 3)
    col, a = parse(it['c'])
    if a < .5: continue
    Lt = lum(col)
    Lb = lum(reg)
    # 字のまわりの地のうち、いちばん字に近い明るさの1割（読みにくい所）でくらべる
    cr = (np.maximum(Lt, Lb) + .05) / (np.minimum(Lt, Lb) + .05)
    worst = np.percentile(cr, 10)
    med = np.median(cr)
    hasShadow = it['sh'] not in ('none', '')
    h1, s1, v1 = colorsys.rgb_to_hsv(*col)
    mb = np.median(reg, axis=0); h2, s2, v2 = colorsys.rgb_to_hsv(*mb)
    warm = lambda h, s: s > .35 and (h < .14 or h > .9)
    ww = warm(h1, s1) and warm(h2, s2) and med < 4.5
    if (med < 3.2 and not (hasShadow and med > 1.8)) or ww or (worst < 1.6 and not hasShadow):
        bad.append((round(med, 2), round(worst, 2), 'WW' if ww else '', it['sel'], it['t'], int(it['y'])))
bad.sort()
for b in bad: print(*b, sep=' | ')
print('total', len(items), 'bad', len(bad))
