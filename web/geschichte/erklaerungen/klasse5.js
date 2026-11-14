/* GeDax (Geschichte) – Erklär-Animationen Klasse 5
 *
 * Aufbau wie in DeDax: { title, viewBox, create(api, ctx) → { reset(), play() } }
 *   ctx: das ex-Objekt der Aufgabe plus pre:true (ähnliches Beispiel) oder post:true (genau die Aufgabe);
 *        leer, wenn die Erklärung ohne Aufgabe geöffnet wird (dann ein zufälliges Beispiel des Themas).
 * Bild-Modi (ex.mode):
 *   karte     Merkzettel: Frage klein, Antwort groß, darunter kurz das Warum (optional mit Bild); nach der Aufgabe kein Knopf (nach: false)
 *   strahl    Zeitstrahl mit Ereignissen; optional ein Jahrhundert-Block (block) oder ein Bogen mit Abstand (bogen)
 *   reihe     Schritte nacheinander, nummeriert
 *   faecher   Spalten (Kategorien); Kärtchen fliegen in ihr Fach, das gesuchte ist blau
 *   pyramide  Stufen von oben nach unten (Gesellschaft Ägyptens, Gruppen in Sparta), gesuchte Stufen leuchten
 */
(function () {
  const D = (window.GeDax = window.GeDax || {});
  const U = D.util;
  const EX = (D.explainers = D.explainers || {});
  const NS = 'http://www.w3.org/2000/svg';
  const lerp = (a, b, t) => a + (b - a) * t;
  const BLAU = '#1f55d6', ORANGE = '#c2410c', GRUEN = '#0a7d57', GRAU = '#9a94a8', HELLBLAU = '#dfe9ff', SAND = '#f3e6cc', BRAUN = '#a0522d';
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

    // ---------------------------------------------------------------- Zeitstrahl
    async strahl(api, x) {
      const P = x.punkte.slice().sort((a, b) => a.j - b.j);
      const js = P.map((p) => p.j).concat(x.block || [], x.bogen ? [x.bogen[0], x.bogen[1]] : []);
      let lo = x.von !== undefined ? x.von : Math.min(...js), hi = x.bis !== undefined ? x.bis : Math.max(...js);
      if (x.von === undefined) { const pad = Math.max(30, (hi - lo) * 0.14); lo -= pad; hi += pad; }
      if (lo < 0 && hi > 0) { /* Christi Geburt liegt im Bild */ } else if (hi <= 0) hi = Math.min(hi + (hi - lo) * 0.05, 0);
      const X0 = 22, X1 = 336, AY = 140;
      const X = (j) => X0 + ((j - lo) / (hi - lo)) * (X1 - X0);
      const fmt = (j) => (j < 0 ? `${-j}` : `${j}`);
      api.say(x.s1 || 'Der Zeitstrahl: links früher, rechts später.');
      const achse = el('line', { x1: X0 - 10, y1: AY, x2: X0 - 10, y2: AY, class: 'ray' }, api.svg);
      await api.tw(700, (t) => achse.setAttribute('x2', lerp(X0 - 10, X1 + 12, t)));
      el('path', { d: `M ${X1 + 6} ${AY - 6} L ${X1 + 14} ${AY} L ${X1 + 6} ${AY + 6}`, fill: 'none', class: 'ray' }, api.svg);
      // Striche
      const spanne = hi - lo, STEPS = [1, 2, 5, 10, 20, 25, 50, 100, 200, 250, 500, 1000, 2000, 2500, 5000, 10000, 20000, 50000];
      const step = STEPS.find((s) => spanne / s <= 6) || 100000;
      const striche = el('g', { opacity: 0 }, api.svg);
      for (let j = Math.ceil(lo / step) * step; j <= hi; j += step) {
        if (j === 0) continue;
        el('line', { x1: X(j), y1: AY - 5, x2: X(j), y2: AY + 5, class: 'ray', style: 'stroke-width:2' }, striche);
        el('text', { x: X(j), y: AY + 19, 'text-anchor': 'middle', class: 'ex-s', text: fmt(j), style: 'font-size:10px;fill:#6b6680' }, striche);
      }
      if (lo < 0 && hi > 0) {
        el('line', { x1: X(0), y1: AY - 14, x2: X(0), y2: AY + 14, stroke: ORANGE, 'stroke-width': 3 }, striche);
        el('text', { x: X(0), y: AY - 18, 'text-anchor': 'middle', class: 'ex-s', text: 'Christi Geburt', style: `font-size:10px;fill:${ORANGE}` }, striche);
        el('text', { x: X0, y: AY - 18, class: 'ex-s', text: 'v. Chr.', style: 'font-size:10px;fill:#6b6680' }, striche);
        el('text', { x: X1, y: AY - 18, 'text-anchor': 'end', class: 'ex-s', text: 'n. Chr.', style: 'font-size:10px;fill:#6b6680' }, striche);
      } else if (hi <= 0) el('text', { x: X1, y: AY - 18, 'text-anchor': 'end', class: 'ex-s', text: 'alle Jahre v. Chr.', style: 'font-size:10px;fill:#6b6680' }, striche);
      await fade(api, striche, 400);
      await api.wait(900);
      // Jahrhundert-Block
      if (x.block) {
        const a = Math.min(...x.block), b = Math.max(...x.block);
        const r = el('rect', { x: X(a), y: AY - 9, width: 0, height: 18, rx: 3, fill: '#ffd8b8', stroke: ORANGE, 'stroke-width': 1.5, opacity: 0.85 }, api.svg);
        api.svg.insertBefore(r, achse);
        await api.tw(700, (t) => r.setAttribute('width', Math.max(2, (X(b) - X(a)) * t)));
        block(api.svg, 180, 22, [x.blockText || ''], 15, 340, { fill: ORANGE });
        await api.wait(900);
      }
      // Ereignisse: Beschriftungen abwechselnd über und unter der Achse
      const reihen = x.bogen ? [194, 226, 194, 226] : [108, 184, 66, 222];
      for (let i = 0; i < P.length; i++) {
        const p = P[i], px = X(p.j), ry = reihen[i % reihen.length], oben = ry < AY;
        const g = el('g', { opacity: 0 }, api.svg);
        el('line', { x1: px, y1: AY, x2: px, y2: oben ? ry + 6 : ry - 26, stroke: p.hell ? BLAU : '#6b6680', 'stroke-width': 1.5, 'stroke-dasharray': '3 3' }, g);
        el('circle', { cx: px, cy: AY, r: p.hell ? 7 : 6, fill: p.hell ? BLAU : BRAUN, stroke: '#fff', 'stroke-width': 2 }, g);
        const lx = Math.max(62, Math.min(298, px));
        const jahr = (p.um ? 'um ' : '') + (p.j < 0 ? `${-p.j} v. Chr.` : p.j < 1000 ? `${p.j} n. Chr.` : `${p.j}`);
        const zeilen = umbruch(p.t, 20).slice(0, 2), zeigeJahr = nurText(p.t) !== jahr;
        // oben: Jahr über dem Text, Text endet bei ry. unten: Jahr bei ry − 14, Text ab ry.
        const tY = oben ? ry - (zeilen.length - 1) * 13 : ry;
        if (zeigeJahr) el('text', { x: lx, y: oben ? tY - 14 : ry - 14, 'text-anchor': 'middle', class: 'ex-b', text: jahr, style: `font-size:12px;fill:${p.hell ? BLAU : 'var(--ink)'}` }, g);
        block(g, lx, oben || zeigeJahr ? tY : ry - 8, zeilen, 10.5, 116, { class: 'ex-s', fill: p.hell ? BLAU : '#4a4560' });
        await fade(api, g, 300);
        await api.wait(P.length > 2 ? 650 : 900);
      }
      // Bogen für den Abstand
      if (x.bogen) {
        const a = X(x.bogen[0]), b = X(x.bogen[1]), m = (a + b) / 2, h = Math.min(70, Math.max(34, (b - a) * 0.4));
        const pf = el('path', { d: `M ${a} ${AY - 8} Q ${m} ${AY - 8 - h * 2} ${b} ${AY - 8}`, fill: 'none', stroke: BLAU, 'stroke-width': 3, 'stroke-linecap': 'round', 'stroke-dasharray': '600', 'stroke-dashoffset': '600' }, api.svg);
        await api.tw(900, (t) => pf.setAttribute('stroke-dashoffset', 600 * (1 - t)));
        block(api.svg, Math.max(70, Math.min(290, m)), AY - 14 - h, [x.bogen[2]], 15, 200, { fill: BLAU });
        if (lo < 0 && hi > 0 && x.bogen[0] < 0 && x.bogen[1] > 0) {
          el('text', { x: X(0), y: AY - 32, 'text-anchor': 'middle', class: 'ex-s', text: 'kein Jahr 0', style: `font-size:10px;fill:${ORANGE}` }, api.svg);
        }
        await api.wait(900);
      }
      api.say(x.merk);
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
        const z = umbruch(x.items[i], 40).slice(0, 2), t = el('text', { x: 52, y: y + (z.length === 1 ? 17 : 10), class: 'ex-b', style: 'font-size:13.5px' }, g);
        z.forEach((zz, k) => { const s = el('tspan', { x: 52, dy: k ? 16 : 0, text: zz }, t); void s; });
        try { for (let f = 13.5; f >= 9 && t.getBBox().width > 296; f -= 0.5) t.setAttribute('style', `font-size:${f}px`); } catch (e) {}
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

    // ---------------------------------------------------------------- Pyramide (Stufen)
    async pyramide(api, x) {
      const n = x.stufen.length, hh = Math.min(34, 220 / n - 4), gap = 4, y0 = 236 - n * (hh + gap);
      const breite = (i) => (n === 1 ? 300 : 96 + (i * (330 - 96)) / (n - 1));
      api.say(n > 3 ? 'Die Gesellschaft als Pyramide: oben wenige Mächtige, unten viele einfache Menschen.' : 'Oben wenige mit allen Rechten, unten viele ohne Rechte.');
      const st = [];
      for (let i = n - 1; i >= 0; i--) {
        const w = breite(i), y = y0 + i * (hh + gap), g = el('g', { opacity: 0 }, api.svg);
        const r = el('rect', { x: 180 - w / 2, y, width: w, height: hh, rx: 4, fill: SAND, stroke: BRAUN, 'stroke-width': 1.5 }, g);
        const t = block(g, 180, y + hh / 2 + 4.5, [x.stufen[i]], 12.5, w - 12);
        st[i] = { g, r, t };
        await api.tw(280, (k) => { g.setAttribute('opacity', k); g.setAttribute('transform', `translate(0,${(1 - k) * -10})`); });
      }
      await api.wait(1200);
      for (const i of x.hell || []) {
        st[i].r.setAttribute('fill', HELLBLAU); st[i].r.setAttribute('stroke', BLAU); st[i].r.setAttribute('stroke-width', 2.5);
        st[i].t.ts.forEach((e) => (e.style.fill = BLAU));
        await api.wait(700);
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
  [
    ['g5-quellen', 'Quellen: Was ist übrig geblieben?'], ['g5-zeitstrahl', 'Der Zeitstrahl'], ['g5-jh', 'Jahrhunderte: 100 Jahre am Stück'], ['g5-rechnen', 'Wie lange ist das her?'], ['g5-epochen', 'Die großen Zeitabschnitte'],
    ['g5-mensch', 'Vom Vormenschen zum Homo sapiens'], ['g5-alt', 'Leben in der Altsteinzeit'], ['g5-hoehle', 'Höhlenmalerei'], ['g5-jung', 'Die ersten Bauern'], ['g5-altjung', 'Alt- oder Jungsteinzeit?'],
    ['g5-oetzi', 'Ötzi'], ['g5-metall', 'Kupfer, Bronze, Eisen'], ['g5-nebra', 'Die Himmelsscheibe von Nebra'],
    ['g5-nil', 'Der Nil'], ['g5-staat', 'Pharao und Beamte'], ['g5-schrift', 'Hieroglyphen'], ['g5-gesellschaft', 'Die Gesellschaftspyramide'], ['g5-religion-ag', 'Die Götter Ägyptens'],
    ['g5-jenseits', 'Mumien und Jenseits'], ['g5-pyramiden', 'Die Pyramiden'], ['g5-hochkultur', 'Was ist eine Hochkultur?'],
    ['g5-land', 'Land, Meer und Poleis'], ['g5-olympia', 'Die Olympischen Spiele'], ['g5-religion-gr', 'Die Götter der Griechen'], ['g5-quellen-gr', 'Quellen über die Griechen'], ['g5-wirtschaft', 'Handel in Athen'],
    ['g5-demokratie', 'Demokratie in Athen'], ['g5-athen', 'Leben in Athen'], ['g5-sparta', 'Sparta'], ['g5-vergleich', 'Athen und Sparta'], ['g5-natur', 'Mensch und Natur'],
  ].forEach(([id, t]) => thema(id, t));
})();
