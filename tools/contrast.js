// node contrast.js url out_prefix w h … 字の色と、その下の地（字を消して撮った写真）の色をくらべる材料を出す
const {chromium} = require('playwright');
const fs = require('fs');
(async () => {
  const [url, out, w, h] = process.argv.slice(2);
  const b = await chromium.launch(); const p = await b.newPage({viewport: {width: +w, height: +h}, deviceScaleFactor: 1});
  await p.addInitScript(() => { try { sessionStorage.setItem('ow-preview', '1'); sessionStorage.setItem('ow-curtain', '1'); } catch (e) {} });
  await p.goto(url, {waitUntil: 'networkidle'}); await p.waitForTimeout(1200);
  await p.addStyleTag({content: '.og-gate,.thx-ban,.jk,.faqb,.mcta,.fun-cta,.bgm,.bgm-tip,.bgm-vol,#curtain,.pg-curtain,.fun-drop,.fall,.fun-peek,.hd,.subnav,.fb,.fun-laugh{display:none!important} .rv{opacity:1!important;transform:none!important} *{animation:none!important;transition:none!important}'});
  // 遅れて読む絵を全部読む
  await p.evaluate(async () => { document.querySelectorAll('img[loading=lazy]').forEach(i => i.loading = 'eager'); for (let y = 0; y < document.body.scrollHeight; y += 700) { scrollTo(0, y); await new Promise(r => setTimeout(r, 60)); } scrollTo(0, 0); });
  await p.waitForTimeout(1500);
  const items = await p.evaluate(() => {
    const out = []; const W = document.createTreeWalker(document.querySelector('main') || document.body, NodeFilter.SHOW_TEXT);
    const seen = new Set();
    while (W.nextNode()) { const t = W.currentNode.textContent.trim(); if (t.length < 2) continue; const e = W.currentNode.parentElement; if (seen.has(e)) continue; seen.add(e);
      const cs = getComputedStyle(e); if (cs.display === 'none' || cs.visibility === 'hidden' || parseFloat(cs.opacity) === 0 || e.closest('[aria-hidden=true],[hidden]')) continue;
      const rg = document.createRange(); rg.selectNodeContents(e); const R = rg.getBoundingClientRect(); if (R.width < 4 || R.height < 4) continue;
      const stroke = cs.webkitTextStrokeWidth && parseFloat(cs.webkitTextStrokeWidth) > 0;
      out.push({t: t.slice(0, 24), c: cs.color, sh: cs.textShadow, stroke, x: R.left + scrollX, y: R.top + scrollY, w: R.width, h: R.height, sel: e.tagName.toLowerCase() + '.' + String(e.className).split(' ')[0] + ' < ' + String(e.parentElement.className).split(' ')[0] + ' #' + ((e.closest('section[id]') || {}).id || '')});
    }
    return out; });
  fs.writeFileSync(out + '.json', JSON.stringify(items));
  await p.addStyleTag({content: '*{color:transparent!important;text-shadow:none!important;-webkit-text-stroke:0!important} *::before,*::after{color:transparent!important}'});
  await p.waitForTimeout(300);
  await p.screenshot({path: out + '_bg.png', fullPage: true});
  await b.close();
})();
