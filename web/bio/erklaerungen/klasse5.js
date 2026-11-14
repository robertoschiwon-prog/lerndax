/* BioDax (Biologie) – Erklär-Animationen Klasse 5
 *
 * Aufbau wie in GeDax: { title, viewBox, create(api, ctx) → { reset(), play() } }
 *   ctx: das ex-Objekt der Aufgabe plus pre:true (ähnliches Beispiel) oder post:true (genau die Aufgabe);
 *        leer, wenn die Erklärung ohne Aufgabe geöffnet wird (dann ein zufälliges Beispiel des Themas).
 * Bild-Modi (ex.mode):
 *   karte     Merkzettel: Frage klein, Antwort groß, darunter kurz das Warum (optional mit Bild); nach der Aufgabe kein Knopf (nach: false)
 *   reihe     Schritte nacheinander, nummeriert (optional mit kleinen Bildern; hell = gesuchter Schritt)
 *   faecher   Spalten (Kategorien); Kärtchen fliegen in ihr Fach, das gesuchte ist blau
 */
(function () {
  const D = (window.BioDax = window.BioDax || {});
  const U = D.util;
  const EX = (D.explainers = D.explainers || {});
  const NS = 'http://www.w3.org/2000/svg';
  const lerp = (a, b, t) => a + (b - a) * t;
  const BLAU = '#1f55d6', ORANGE = '#c2410c', GRUEN = '#0a7d57', GRAU = '#9a94a8', HELLBLAU = '#dfe9ff', SAND = '#e3f1dc', BRAUN = '#2f7d32';
  const VB_W = 360;
  function el(tag, a, parent) {
    const e = document.createElementNS(NS, tag);
    for (const k in a || {}) { if (k === 'text') e.textContent = a[k]; else e.setAttribute(k, a[k]); }
    if (parent) parent.appendChild(e);
    return e;
  }
  D.exUtil = { el };
  const nurText = (s) => String(s).replace(/<[^>]+>/g, '');
  // Text in Zeilen mit höchstens n Zeichen (an Wortgrenzen)
  function umbruch(text, n) {
    const w = nurText(text).split(/\s+/).filter(Boolean), z = [];
    let cur = '';
    for (const x of w) { if (cur && (cur + ' ' + x).length > n) { z.push(cur); cur = x; } else cur = cur ? cur + ' ' + x : x; }
    if (cur) z.push(cur);
    return z;
  }
  // Mehrzeiliger Text; jede Zeile wird notfalls kleiner, bis sie in maxW passt
  function block(p, x, y, zeilen, fs, maxW, attr) {
    const g = el('g', {}, p), ts = [];
    zeilen.forEach((z, i) => {
      const t = el('text', Object.assign({ x, y: y + i * (fs + 4), 'text-anchor': 'middle', class: 'ex-b', text: z, style: `font-size:${fs}px` }, attr || {}), g);
      try { for (let f = fs; f >= 8 && t.getBBox().width > maxW; f -= 0.5) t.setAttribute('style', `font-size:${f}px`); } catch (e) {}
      ts.push(t);
    });
    return { g, ts, h: zeilen.length * (fs + 4) };
  }
  const fade = (api, e, ms) => api.tw(ms || 350, (t) => e.setAttribute('opacity', t));

  const BILD = {
    // ---------------------------------------------------------------- Karte: Frage und Antworten
    async karte(api, x) {
      // Merkzettel: kein Wiederholen der Antwortmöglichkeiten. Bild (wenn es eins gibt), Frage klein, Antwort groß, darunter kurz das Warum.
      const mitBild = !!x.svg && D.bilder && D.bilder[x.svg];
      let y = 30;
      if (mitBild) {
        const g = el('g', { opacity: 0 }, api.svg);
        const roh = D.bilder[x.svg]();
        const vb = (roh.match(/viewBox="([^"]+)"/) || [0, '0 0 200 120'])[1].split(' ').map(Number), bh = Math.min(104, 172 * vb[3] / vb[2]), bw = bh * vb[2] / vb[3];
        g.innerHTML = roh.replace(/^<svg([^>]*)>/, (m, a) => `<svg${a.replace(/ (style|role|aria-label)="[^"]*"/g, '')} x="${180 - bw / 2}" y="4" width="${bw}" height="${bh}">`);
        el('rect', { x: 180 - bw / 2, y: 4, width: bw, height: bh, rx: 6, fill: 'none', stroke: 'var(--ink)', 'stroke-width': 2 }, g);
        await fade(api, g, 450);
        y = 4 + bh + 20;
      }
      const antwort = nurText(x.opts[x.ok]);
      const warum = nurText(String(x.merk || '').replace(/^[\s\S]*<\/b>[:.]?\s*/, ''));
      const qz = umbruch(String(x.q).replace('…', '___'), 44).slice(0, 4), az = umbruch(antwort, 27).slice(0, 5), wz = warum && warum !== antwort ? umbruch(warum, 37).slice(0, 8) : [];
      const hoehe = (k) => qz.length * (13 * k + 4) + 8 + az.length * (20 * k + 4) + (wz.length ? 12 + wz.length * (15 * k + 4) : 0);
      let k = 1; while (k > 0.55 && hoehe(k) > 236 - y) k -= 0.03;
      if (!mitBild) y = Math.max(26, (240 - hoehe(k)) / 2 + 10);
      const q = block(api.svg, 180, y, qz, 13 * k, 340, { opacity: 0 });
      q.ts.forEach((t) => { t.style.fill = '#6f6a7c'; t.style.fontWeight = '600'; });
      api.say(x.pre ? 'Ein Beispiel aus diesem Thema:' : 'Kurz erklärt:');
      await api.tw(350, (t) => q.ts.forEach((e) => e.setAttribute('opacity', t)));
      await api.wait(900);
      y += q.h + 8;
      const a = block(api.svg, 180, y, az, 20 * k, 340, { opacity: 0 });
      a.ts.forEach((t) => { t.style.fill = GRUEN; });
      await api.tw(450, (t) => a.ts.forEach((e) => e.setAttribute('opacity', t)));
      y += a.h + 12;
      if (wz.length) {
        await api.wait(500);
        el('path', { d: `M 130 ${y - 14} H 230`, stroke: '#d9d2c3', 'stroke-width': 2, 'stroke-linecap': 'round' }, api.svg);
        const w = block(api.svg, 180, y, wz, 15 * k, 344, { opacity: 0 });
        w.ts.forEach((t) => { t.style.fontWeight = '600'; });
        await api.tw(450, (t) => w.ts.forEach((e) => e.setAttribute('opacity', t)));
      }
      api.say('');
    },

    // ---------------------------------------------------------------- Schritte nacheinander
    async reihe(api, x) {
      const n = x.items.length, step = Math.min(50, 218 / n), y0 = 22 + (218 - step * n) / 2;
      api.say(x.s1 || 'Schritt für Schritt:');
      await api.wait(1200);
      for (let i = 0; i < n; i++) {
        const y = y0 + i * step, g = el('g', { opacity: 0 }, api.svg);
        if (i > 0) el('path', { d: `M 30 ${y - step + 30} L 30 ${y - 4}`, stroke: '#c9c2b4', 'stroke-width': 2.5 }, g);
        el('circle', { cx: 30, cy: y + 12, r: 13, fill: i === x.hell ? BLAU : BRAUN }, g);
        el('text', { x: 30, y: y + 17, 'text-anchor': 'middle', class: 'ex-b', text: i + 1, style: 'font-size:14px;fill:#fff' }, g);
        let tx = 52;
        if (x.bilder && x.bilder[i] && D.bilder[x.bilder[i]]) {
          const bh = Math.min(30, step - 6), bw = bh * 200 / 120, b = el('g', {}, g);
          b.innerHTML = D.bilder[x.bilder[i]]().replace(/^<svg([^>]*)>/, (m, a) => `<svg${a.replace(/ (style|role|aria-label)="[^"]*"/g, '')} x="50" y="${y + 12 - bh / 2}" width="${bw}" height="${bh}">`);
          el('rect', { x: 50, y: y + 12 - bh / 2, width: bw, height: bh, rx: 3, fill: 'none', stroke: i === x.hell ? BLAU : '#9a94a8', 'stroke-width': i === x.hell ? 2.5 : 1 }, g);
          tx = 56 + bw;
        }
        const z = umbruch(x.items[i], x.bilder ? 34 : 40).slice(0, 2), t = el('text', { x: tx, y: y + (z.length === 1 ? 17 : 10), class: 'ex-b', style: `font-size:${n > 5 ? 12 : 13.5}px${i === x.hell ? ';fill:' + BLAU : ''}` }, g);
        z.forEach((zz, k) => { const s = el('tspan', { x: tx, dy: k ? (n > 5 ? 13 : 16) : 0, text: zz }, t); void s; });
        try { for (let f = n > 5 ? 12 : 13.5; f >= 8 && t.getBBox().width > 348 - tx; f -= 0.5) t.setAttribute('style', `font-size:${f}px${i === x.hell ? ';fill:' + BLAU : ''}`); } catch (e) {}
        await api.tw(350, (k) => { g.setAttribute('opacity', k); g.setAttribute('transform', `translate(${(1 - k) * 16},0)`); });
        await api.wait(700);
      }
      api.say(x.merk);
    },

    // ---------------------------------------------------------------- Fächer: sortieren
    async faecher(api, x) {
      const n = x.kats.length, W = 340 / n, X0 = 10, zch = Math.max(10, Math.floor((W - 12) / 6.2));
      x.kats.forEach((k, i) => {
        el('rect', { x: X0 + i * W + 3, y: 8, width: W - 6, height: 30, rx: 8, fill: SAND, stroke: 'var(--ink)', 'stroke-width': 1.5 }, api.svg);
        block(api.svg, X0 + i * W + W / 2, 28, [k], 12.5, W - 12);
        el('rect', { x: X0 + i * W + 3, y: 44, width: W - 6, height: 192, rx: 8, fill: 'none', stroke: '#d9d2c3', 'stroke-width': 1.5, 'stroke-dasharray': '5 4' }, api.svg);
      });
      api.say(x.art === 'passtNicht' ? 'Welches Kärtchen landet in einem anderen Fach?' : 'Jedes Kärtchen gehört in ein Fach.');
      await api.wait(1500);
      const stapel = x.kats.map(() => 50), proFach = x.kats.map((_, k) => x.items.filter((it) => it[1] === k).length);
      // zuerst die anderen, zuletzt das gesuchte Kärtchen
      const reihenfolge = x.items.slice(1).concat([x.items[0]]);
      for (const [text, k] of reihenfolge) {
        const ziel = x.items[0][0] === text;
        const zeilen = umbruch(text, zch), platz = (180 - (proFach[k] - 1) * 6) / proFach[k];
        const lh = Math.max(9, Math.min(13, (platz - 8) / zeilen.length)), h = zeilen.length * lh + 8;
        const g = el('g', {}, api.svg);
        el('rect', { x: -(W - 14) / 2, y: 0, width: W - 14, height: h, rx: 6, fill: ziel ? HELLBLAU : 'var(--card)', stroke: ziel ? BLAU : 'var(--ink)', 'stroke-width': ziel ? 2.5 : 1.5 }, g);
        const t = el('text', { x: 0, y: 4 + lh * 0.8, 'text-anchor': 'middle', class: 'ex-s', style: `font-size:${lh - 2.5}px;fill:${ziel ? BLAU : 'var(--ink)'}` }, g);
        zeilen.forEach((z, i) => el('tspan', { x: 0, dy: i ? lh : 0, text: z }, t));
        try { for (let f = lh - 2.5; f >= 6.5 && t.getBBox().width > W - 20; f -= 0.5) t.setAttribute('style', `font-size:${f}px;fill:${ziel ? BLAU : 'var(--ink)'}`); } catch (e) {}
        const zx = X0 + k * W + W / 2, zy = stapel[k];
        stapel[k] += h + 6;
        await api.tw(ziel ? 900 : 600, (t) => g.setAttribute('transform', `translate(${lerp(180, zx, t)},${lerp(110, zy, t) - Math.sin(t * Math.PI) * 20})`));
        await api.wait(ziel ? 600 : 300);
      }
      api.say(x.merk);
    },

    // ---------------------------------------------------------------- nur ein Bild
    async bild(api, x) {
      const g = el('g', { opacity: 0 }, api.svg);
      g.innerHTML = x.svg.replace(/^<svg([^>]*)>/, (m, a) => `<svg${a.replace(/ (style|role|aria-label)="[^"]*"/g, '')} x="60" y="10" width="240" height="144">`);
      await fade(api, g, 500);
      api.say(x.s1); await api.wait(2400);
      api.say(x.merk);
    },
  };
  D.bild = BILD;

  // Jedes Thema: Erklärung = ein Beispiel aus dem Thema (frei), ein ähnliches Beispiel (vorher) oder genau die Aufgabe (nachher)
  function thema(id, title) {
    EX[id] = {
      title, viewBox: '0 0 360 240',
      create(api, ctx) {
        ctx = ctx || {};
        const task = !!ctx.mode && (ctx.pre || ctx.post);
        // 'Welche Aussage stimmt?' hat nichts zu erklären: solche Beispiele werden nicht gezeigt
        const arten = D.arten[id], gut = (e) => !(e.mode === 'karte' && e.art === 'aussage');
        const zufall = () => { let e; for (let i = 0; i < 40; i++) { e = arten[U.pick(Object.keys(arten))]().ex; if (gut(e)) break; } return e; };
        let x = task ? (ctx.post ? ctx : (arten[ctx.art] && gut(ctx) ? arten[ctx.art]().ex : zufall())) : zufall();
        if (!task) api.chips([{ label: 'Anderes Beispiel', onClick() { x = zufall(); api.replay(); } }]);
        return {
          reset() { api.clear(); api.sub(!task ? '' : ctx.post ? 'Lösung zu deiner Aufgabe' : 'Ein ähnliches Beispiel – deine Aufgabe löst du danach selbst'); },
          play() { return BILD[x.mode](api, x); },
        };
      },
    };
  }
  D.grades[5].lbs.flatMap((l) => l.topics).map((t) => [t.id, t.title]).forEach(([id, t]) => thema(id, t));
})();
