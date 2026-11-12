# Prüft die Bilder aller Aufgaben (normal und Knobeln): Liegt jede Beschriftung im Bild? Überdecken sich zwei
# Beschriftungen? Läuft eine farbige Linie mitten durch eine Beschriftung?
#  Aufruf: python3 tests/bild_audit.py [Aufgaben je Thema, Standard 150] [Themen mit Komma, Standard alle]
import asyncio, pathlib, sys, os, json
from playwright.async_api import async_playwright
HERE = pathlib.Path(__file__).resolve().parent; ROOT = HERE.parent
CHROME = {'executable_path': '/usr/bin/google-chrome'} if os.path.exists('/usr/bin/google-chrome') else {}
URL = (ROOT/'web').as_uri()+'/mathe/index.html'
N = int(sys.argv[1]) if len(sys.argv) > 1 else 150
NUR = sys.argv[2].split(',') if len(sys.argv) > 2 else None
JS = """([n, nur]) => {
  const box = document.createElement('div'); box.className = 'fig'; box.style.cssText = 'width:330px;position:absolute;left:0;top:0;background:#fff'; document.body.appendChild(box);
  const out = {}; const add = (id, art, bsp) => { const k = id + ' | ' + art; (out[k] = out[k] || { n: 0, bsp }).n++; };
  const plain = (h) => String(h).replace(/<[^>]+>/g, ' ').replace(/\\s+/g, ' ').trim().slice(0, 70);
  for (const lb of window.Mathelix.grades[5].lbs) for (const t of lb.topics) {
    if (nur && !nur.includes(t.id)) continue;
    for (const gen of [t.gen, t.knobel]) { if (!gen) continue;
      for (let i = 0; i < n; i++) {
        const a = gen(); if (!a.figure) continue;
        box.innerHTML = a.figure; const svg = box.querySelector('svg'); if (!svg) continue;
        const vb = svg.viewBox.baseVal, texts = [...svg.querySelectorAll('text')].filter((x) => x.textContent.trim());
        const bb = texts.map((x) => { const b = x.getBBox(); const m = x.getCTM(), s = svg.getCTM(); const f = (px, py) => { const p = svg.createSVGPoint(); p.x = px; p.y = py; return p.matrixTransform(s.inverse().multiply(m)); }; const p1 = f(b.x, b.y), p2 = f(b.x + b.width, b.y + b.height); return { x: Math.min(p1.x, p2.x), y: Math.min(p1.y, p2.y), w: Math.abs(p2.x - p1.x), h: Math.abs(p2.y - p1.y), t: x.textContent.trim() }; });
        bb.forEach((b) => { if (b.x < vb.x - 1 || b.y < vb.y - 1 || b.x + b.w > vb.x + vb.width + 1 || b.y + b.h > vb.y + vb.height + 1) add(t.id, 'Text außerhalb: „' + b.t.replace(/\\d+/g, '#') + '“', plain(a.prompt)); });
        for (let p = 0; p < bb.length; p++) for (let q = p + 1; q < bb.length; q++) { const A = bb[p], B = bb[q]; const ix = Math.min(A.x + A.w, B.x + B.w) - Math.max(A.x, B.x), iy = Math.min(A.y + A.h, B.y + B.h) - Math.max(A.y, B.y); if (ix > 0 && iy > 0 && ix * iy > 0.25 * Math.min(A.w * A.h, B.w * B.h)) add(t.id, 'Texte überdecken sich', plain(a.prompt) + ' [' + A.t + ' / ' + B.t + ']'); }
        // farbige Linien (keine Gitter-, Achsen-, Skalen- oder Hilfslinien), die durch die Mitte einer Beschriftung laufen
        const lines = [...svg.querySelectorAll('line')].filter((l) => !/grid|axis|geot|dash|tzl|symax/.test(l.getAttribute('class') || '') && parseFloat(getComputedStyle(l).strokeWidth) >= 2.5);
        bb.forEach((b, bi) => { const cx = b.x + b.w / 2, cy = b.y + b.h / 2; lines.forEach((l) => { if (l.compareDocumentPosition(texts[bi]) & Node.DOCUMENT_POSITION_PRECEDING) { const x1 = l.x1.baseVal.value, y1 = l.y1.baseVal.value, x2 = l.x2.baseVal.value, y2 = l.y2.baseVal.value; const vx = x2 - x1, vy = y2 - y1, l2 = vx * vx + vy * vy; const tt = l2 ? Math.max(0, Math.min(1, ((cx - x1) * vx + (cy - y1) * vy) / l2)) : 0; if (Math.hypot(cx - x1 - tt * vx, cy - y1 - tt * vy) < Math.min(b.w, b.h) / 2) add(t.id, 'Linie über Text „' + b.t.replace(/\\d+/g, '#') + '“', plain(a.prompt)); } }); });
      } }
  }
  box.remove(); return out; }"""
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(args=['--no-sandbox'], **CHROME)
        pg = await b.new_page(viewport={'width': 390, 'height': 844})
        await pg.goto(URL); await pg.wait_for_timeout(300)
        out = await pg.evaluate(JS, [N, NUR])
        for k in sorted(out): print(f"{out[k]['n']:5d}  {k}   z. B. {out[k]['bsp']}")
        print('bild-audit: aufgaben je thema', N, '| auffälligkeiten', len(out))
        await b.close()
asyncio.run(main())
