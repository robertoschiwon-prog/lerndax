/* GeDax (Geschichte) – Erklär-Animationen Klasse 5
 *
 * Gemeinsame Bild-Modi (karte, reihe, faecher, bild) und die Anmeldung der Themen stehen seit lerndax-v103 in
 * plattform/erklaer.js. Hier nur die Modi, die es nur in Geschichte gibt:
 *   strahl    Zeitstrahl mit Ereignissen; optional ein Jahrhundert-Block (block) oder ein Bogen mit Abstand (bogen)
 *   pyramide  Stufen von oben nach unten (Gesellschaft Ägyptens, Gruppen in Sparta), gesuchte Stufen leuchten
 */
(function () {
  const D = window.GeDax;
  const { el, lerp, nurText, umbruch, block, fade, F } = LernDaxErklaer(D, { sand: '#f3e6cc', braun: '#a0522d' });
  const { BLAU, ORANGE, HELLBLAU, SAND, BRAUN } = F;
  Object.assign(D.bild, {
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
  });
  D.erklaereThemen();
})();
