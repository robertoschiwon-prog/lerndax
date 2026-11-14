/* GeoDax (Geografie) – Erklär-Animationen Klasse 5
 *
 * Gemeinsame Bild-Modi (karte, reihe, faecher, bild) und die Anmeldung der Themen stehen in plattform/erklaer.js.
 * Hier nur die Modi, die es nur in Geografie gibt:
 *   massstab  Strecke auf der Karte Zentimeter für Zentimeter, darunter die Strecke in Wirklichkeit
 *   tagnacht  Die Erde dreht sich (von oben gesehen); der Ort wandert durch Mitternacht, Morgen, Mittag, Abend
 *   jahr      Die Erde läuft um die Sonne, die Achse bleibt schräg; Sommer und Winter auf der Nordhalbkugel
 *   gezeiten  Wasserstand über einen Tag: zweimal Hochwasser, zweimal Niedrigwasser
 *   steigung  Feuchte Luft steigt am Gebirge auf, Wolken, Regen auf der Seite zum Wind
 *   tal       Die vier Talformen nebeneinander, die gesuchte leuchtet
 */
(function () {
  const D = window.GeoDax;
  const { el, lerp, block, fade, F } = LernDaxErklaer(D, { sand: '#e2f0f4', braun: '#0e7f91', bild: { hoch: 190, breit: 340, schrift: 1, H: 300 } });
  const { BLAU, ORANGE, GRUEN } = F;
  const T = 'var(--ink)';
  const txt = (p, x, y, t, fs, farbe, anker, extra) => el('text', Object.assign({ x, y, 'text-anchor': anker || 'middle', class: 'ex-b', text: t, style: `font-size:${fs || 13}px;fill:${farbe || T}` }, extra || {}), p);
  const tausend = (z) => String(z).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  const zahl = (v) => String(v).replace('.', ',');
  const bildEin = (p, roh, x, y, w, h) => { const g = el('g', { opacity: 0 }, p); g.innerHTML = roh.replace(/^<svg([^>]*)>/, (m, a) => `<svg${a.replace(/ (style|role|aria-label)="[^"]*"/g, '')} x="${x}" y="${y}" width="${w}" height="${h}">`); return g; };

  Object.assign(D.bild, {
    // ---------------------------------------------------------------- Maßstab
    async massstab(api, x) {
      const m = x.m, n = Math.min(x.cm, 12), proCm = m >= 100000 ? `${zahl(m / 100000)} km` : `${zahl(m / 100)} m`;
      const W = Math.min(64, 240 / n), X0 = 100 + (240 - n * W) / 2;
      api.say(`Maßstab <b>1 : ${tausend(m)}</b>: Alles ist ${tausend(m)}-mal kleiner als in Wirklichkeit.`);
      txt(api.svg, 180, 30, `1 : ${tausend(m)}`, 22, BLAU);
      await api.wait(1600);
      txt(api.svg, 8, 98, 'Karte', 12, '#6f6a7c', 'start');
      txt(api.svg, 8, 168, 'Wirklichkeit', 12, '#6f6a7c', 'start');
      const k1 = el('rect', { x: X0, y: 88, width: n * W, height: 12, fill: 'none', stroke: T, 'stroke-width': 1.5 }, api.svg); void k1;
      for (let i = 0; i < n; i++) {
        const seg = el('rect', { x: X0 + i * W, y: 88, width: W, height: 12, fill: i % 2 ? '#fff' : BLAU, opacity: 0 }, api.svg);
        const pf = el('line', { x1: X0 + i * W + W / 2, y1: 104, x2: X0 + i * W + W / 2, y2: 104, stroke: '#c9c2b4', 'stroke-width': 1.5, 'stroke-dasharray': '3 3' }, api.svg);
        await api.tw(i === 0 ? 500 : 160, (t) => { seg.setAttribute('opacity', t); pf.setAttribute('y2', lerp(104, 160, t)); });
        if (i === 0) {
          txt(api.svg, X0 + W / 2, 82, '1 cm', 13, BLAU);
          txt(api.svg, X0 + W / 2, 182, proCm, 13, GRUEN);
          api.say(`1 cm auf der Karte sind ${tausend(m)} cm in Wirklichkeit, also <b>${proCm}</b>.`);
          await api.wait(2200);
        }
      }
      el('line', { x1: X0, y1: 164, x2: X0 + n * W, y2: 164, stroke: GRUEN, 'stroke-width': 4, 'stroke-linecap': 'round' }, api.svg);
      await api.wait(500);
      const ergebnis = x.cm === 1 ? `1 cm ≙ ${proCm}` : `${x.cm} · ${proCm} = ${zahl(x.wert)} ${x.einheit}`;
      const e = txt(api.svg, 180, 220, x.rueck ? `${zahl(x.wert)} ${x.einheit} : ${proCm} = ${x.cm} cm` : ergebnis, 17, GRUEN, 'middle', { opacity: 0 });
      await fade(api, e, 450);
      api.say(x.rueck ? `Rückwärts: Wie oft passt ${proCm} in ${zahl(x.wert)} ${x.einheit}? <b>${x.cm}-mal</b>, also ${x.cm} cm.` : `Für jeden Zentimeter auf der Karte kommen ${proCm} dazu: <b>${zahl(x.wert)} ${x.einheit}</b>.`);
    },

    // ---------------------------------------------------------------- Tag und Nacht
    async tagnacht(api, x) {
      const cx = 140, cy = 112, r = 64, NAMEN = ['Mitternacht', 'Sonnenaufgang', 'Mittag', 'Sonnenuntergang'], WINKEL = [180, 90, 0, 270];
      el('path', { d: `M${cx} ${cy - r} A${r} ${r} 0 0 1 ${cx} ${cy + r}Z`, fill: '#cfe6ff' }, api.svg);
      el('path', { d: `M${cx} ${cy - r} A${r} ${r} 0 0 0 ${cx} ${cy + r}Z`, fill: '#3a3f6e' }, api.svg);
      el('circle', { cx, cy, r, fill: 'none', stroke: T, 'stroke-width': 2 }, api.svg);
      el('circle', { cx: 318, cy: cy, r: 20, fill: '#ffcf4a' }, api.svg);
      for (let i = 0; i < 4; i++) el('line', { x1: 290, y1: cy - 48 + i * 32, x2: 232, y2: cy - 48 + i * 32, stroke: '#ffcf4a', 'stroke-width': 3 }, api.svg);
      txt(api.svg, 318, cy + 40, 'Sonne', 13, '#8a6d00');
      txt(api.svg, cx + 36, 34, 'Tag', 15, '#5a6e8a');
      txt(api.svg, cx - 36, 34, 'Nacht', 15, '#3a3f6e');
      api.say('Wir schauen von oben auf den Nordpol. Die Sonne beleuchtet immer nur die rechte Hälfte.');
      await api.wait(2400);
      const p = el('circle', { r: 7, fill: '#d0443a', stroke: '#fff', 'stroke-width': 2 }, api.svg);
      const lab = txt(api.svg, cx, cy + r + 30, '', 17, '#d0443a');
      const setz = (w) => { const a = w * Math.PI / 180; p.setAttribute('cx', cx + Math.cos(a) * r * 0.8); p.setAttribute('cy', cy + Math.sin(a) * r * 0.8); };
      setz(180);
      api.say('Die Erde dreht sich in 24 Stunden einmal um sich selbst, von oben gesehen gegen den Uhrzeigersinn.');
      // eine ganze Drehung: 180 → 90 → 0 → −90 → −180 (Bildschirmwinkel nimmt ab = gegen den Uhrzeigersinn)
      for (let i = 0; i < 4; i++) {
        const w0 = 180 - i * 90;
        lab.textContent = NAMEN[i];
        await api.wait(900);
        await api.tw(1300, (t) => setz(w0 - 90 * t));
      }
      const w = WINKEL[x.k] - (WINKEL[x.k] > 180 ? 360 : 0);
      await api.tw(800, (t) => setz(lerp(180, w, t)));
      lab.textContent = NAMEN[x.k];
      api.say(x.merk);
    },

    // ---------------------------------------------------------------- Jahreszeiten
    async jahr(api, x) {
      const sx = 180, sy = 112, rx = 130, ry = 52, neig = 23.5 * Math.PI / 180;
      el('ellipse', { cx: sx, cy: sy, rx, ry, fill: 'none', stroke: '#c9c2b4', 'stroke-width': 1.5, 'stroke-dasharray': '5 4' }, api.svg);
      el('circle', { cx: sx, cy: sy, r: 24, fill: '#ffcf4a' }, api.svg);
      api.say('Die Erde läuft in einem Jahr um die Sonne. Ihre Achse steht schräg, und zwar immer in dieselbe Richtung.');
      const g = el('g', {}, api.svg);
      const tag = el('path', { fill: '#cfe6ff' }, g);
      const erde = el('circle', { r: 20, fill: 'none', stroke: T, 'stroke-width': 2 }, g);
      const achse = el('line', { stroke: '#d0443a', 'stroke-width': 3 }, g);
      const nTxt = txt(g, 0, 0, 'N', 12, '#d0443a');
      const setz = (w) => {
        const ex = sx + Math.cos(w) * rx, ey = sy + Math.sin(w) * ry, zs = Math.atan2(sy - ey, sx - ex);
        const a1 = zs - Math.PI / 2, a2 = zs + Math.PI / 2, P = (a) => `${(ex + Math.cos(a) * 20).toFixed(1)} ${(ey + Math.sin(a) * 20).toFixed(1)}`;
        tag.setAttribute('d', `M${P(a1)} A20 20 0 0 1 ${P(a2)}Z`);
        erde.setAttribute('cx', ex); erde.setAttribute('cy', ey);
        const dx = Math.sin(neig) * 30, dy = Math.cos(neig) * 30;
        achse.setAttribute('x1', ex - dx); achse.setAttribute('y1', ey + dy); achse.setAttribute('x2', ex + dx); achse.setAttribute('y2', ey - dy);
        nTxt.setAttribute('x', ex + dx + 7); nTxt.setAttribute('y', ey - dy);
      };
      setz(Math.PI);
      await api.wait(2000);
      const links = txt(api.svg, 70, 200, 'Juni: Sommer', 14, ORANGE), rechts = txt(api.svg, 285, 200, 'Dezember: Winter', 14, BLAU);
      links.setAttribute('opacity', 0); rechts.setAttribute('opacity', 0);
      api.say('Links: Der Nordpol ist zur Sonne geneigt. Die Strahlen treffen uns steil, die Tage sind lang: <b>Sommer</b>.');
      await fade(api, links, 400);
      await api.wait(2600);
      await api.tw(2600, (t) => setz(Math.PI + Math.PI * t));
      api.say('Ein halbes Jahr später: Die Achse zeigt noch genauso, aber jetzt von der Sonne weg. Flache Strahlen, kurze Tage: <b>Winter</b>.');
      await fade(api, rechts, 400);
      await api.wait(2600);
      await api.tw(2600, (t) => setz(Math.PI * t));
      if (x.k === 0) await api.tw(1300, (t) => setz(Math.PI * t));
      api.say(x.merk);
    },

    // ---------------------------------------------------------------- Gezeiten
    async gezeiten(api, x) {
      const X0 = 30, X1 = 340, Y = 100, A = 44, P = 745; // Minuten von Hochwasser zu Hochwasser
      const start = x.start, phase = x.hoch ? 0 : P / 2;
      const X = (min) => X0 + (min / 1440) * (X1 - X0), H = (min) => Y - A * Math.cos(((min - start + phase) / P) * 2 * Math.PI);
      el('line', { x1: X0, y1: Y + A + 44, x2: X1, y2: Y + A + 44, stroke: T, 'stroke-width': 1.5 }, api.svg);
      for (let h = 0; h <= 24; h += 6) { el('line', { x1: X(h * 60), y1: Y + A + 40, x2: X(h * 60), y2: Y + A + 48, stroke: T, 'stroke-width': 1.5 }, api.svg); txt(api.svg, Math.max(22, Math.min(340, X(h * 60))), Y + A + 64, `${h} Uhr`, 12, '#6f6a7c'); }
      el('line', { x1: X0, y1: Y, x2: X1, y2: Y, stroke: '#d9d2c3', 'stroke-width': 1, 'stroke-dasharray': '4 4' }, api.svg);
      api.say('So steigt und fällt das Wasser an der Nordsee an einem Tag.');
      const linie = el('path', { fill: 'none', stroke: '#2a6fb0', 'stroke-width': 3 }, api.svg);
      await api.tw(2600, (t) => { let d = ''; for (let m = 0; m <= 1440 * t; m += 10) d += `${d ? 'L' : 'M'}${X(m).toFixed(1)} ${H(m).toFixed(1)}`; linie.setAttribute('d', d); });
      // Hoch- und Niedrigwasser beschriften
      for (let m = 0; m <= 1440; m += 5) {
        const a = H(m - 5), b = H(m), c = H(m + 5);
        if ((b < a && b <= c) || (b > a && b >= c)) txt(api.svg, Math.max(46, Math.min(314, X(m))), b < Y ? b - 9 : b + 20, b < Y ? 'Hochwasser' : 'Niedrigwasser', 12, b < Y ? '#2a6fb0' : '#6f6a7c');
      }
      await api.wait(1200);
      api.say('Steigt das Wasser, ist <b>Flut</b>. Fällt es, ist <b>Ebbe</b>. Von Hochwasser zu Niedrigwasser vergehen gut 6 Stunden.');
      const m1 = start, m2 = start + 372;
      const p1 = el('circle', { cx: X(m1), cy: H(m1), r: 6, fill: ORANGE }, api.svg); void p1;
      await api.wait(1600);
      const p2 = el('circle', { cx: X(m1), cy: H(m1), r: 6, fill: GRUEN }, api.svg);
      await api.tw(1600, (t) => { const m = lerp(m1, m2, t); p2.setAttribute('cx', X(((m % 1440) + 1440) % 1440)); p2.setAttribute('cy', H(m)); });
      api.say(x.merk);
    },

    // ---------------------------------------------------------------- Steigungsregen
    async steigung(api, x) {
      const sk = 1.2, g = el('g', { transform: `translate(0,40) scale(${sk},${sk * 0.95})` }, api.svg);
      el('path', { d: 'M0 128 L60 128 L60 140 L0 140Z', fill: '#9cc8f0' }, g);
      el('path', { d: D.bergPfad, fill: '#b9a27a', stroke: '#2b2540', 'stroke-width': 1.2 }, g);
      txt(api.svg, 36, 186, 'Meer', 13, '#2a6fb0');
      txt(api.svg, 8, 28, 'Luv (zum Wind)', 14, BLAU, 'start');
      txt(api.svg, 352, 28, 'Lee (vom Wind weg)', 14, ORANGE, 'end');
      api.say('Der Wind bringt feuchte Luft vom Meer.');
      const luft = el('circle', { r: 9, fill: '#bfe3ff', stroke: '#2a6fb0', 'stroke-width': 1.5 }, api.svg);
      // Weg der Luft (Bildkoordinaten)
      const weg = [[10, 150], [80, 150], [140, 132], [170, 98], [190, 72], [216, 82], [250, 118], [300, 156], [350, 160]];
      const auf = (t) => { const s = t * (weg.length - 1), i = Math.min(weg.length - 2, Math.floor(s)), f = s - i; return [lerp(weg[i][0], weg[i + 1][0], f), lerp(weg[i][1], weg[i + 1][1], f)]; };
      await api.tw(1400, (t) => { const [a, b] = auf(t * 0.25); luft.setAttribute('cx', a); luft.setAttribute('cy', b); });
      api.say('Am Gebirge muss die Luft <b>aufsteigen</b>. Oben ist es kälter: Die Luft kühlt ab.');
      await api.tw(1600, (t) => { const [a, b] = auf(0.25 + t * 0.25); luft.setAttribute('cx', a); luft.setAttribute('cy', b); luft.setAttribute('fill', `rgb(${Math.round(lerp(191, 235, t))},${Math.round(lerp(227, 240, t))},255)`); });
      api.say('Kalte Luft kann weniger Wasser halten. Es bilden sich <b>Wolken</b>, und es regnet.');
      const wolken = el('g', { opacity: 0 }, api.svg);
      [[120, 70], [150, 56], [178, 50]].forEach(([a, b]) => { el('ellipse', { cx: a, cy: b, rx: 22, ry: 11, fill: '#d6dbe4', stroke: '#8a93a6', 'stroke-width': 1 }, wolken); });
      await fade(api, wolken, 500);
      const regen = el('g', { opacity: 0 }, api.svg);
      for (let i = 0; i < 12; i++) { const a = 104 + i * 7, b = 80 + (i % 3) * 4; el('line', { x1: a, y1: b, x2: a - 4, y2: b + 22, stroke: '#2a6fb0', 'stroke-width': 1.6 }, regen); }
      await fade(api, regen, 500);
      await api.wait(1800);
      api.say('Hinter dem Gipfel sinkt die Luft ab, wird wärmer und trockener. Dort regnet es <b>weniger</b>.');
      await api.tw(1800, (t) => { const [a, b] = auf(0.5 + t * 0.5); luft.setAttribute('cx', a); luft.setAttribute('cy', b); });
      await api.wait(1200);
      api.say(x.merk || '<b>Luv</b>: viel Regen (Steigungsregen). <b>Lee</b>: trockener.');
    },

    // ---------------------------------------------------------------- Talformen
    async tal(api, x) {
      const NAMEN = ['Klamm', 'Kerbtal', 'Sohlental', 'Muldental'], WIE = ['eng, senkrecht', 'V-Form', 'flacher Boden', 'breit, sanft'];
      api.say('Vier Talformen im Querschnitt: vom engsten zum breitesten.');
      for (let i = 0; i < 4; i++) {
        const xx = 8 + i * 88, g = bildEin(api.svg, D.talBild(i), xx, 40, 82, 49);
        el('rect', { x: xx, y: 40, width: 82, height: 49, rx: 4, fill: 'none', stroke: i === x.k ? BLAU : '#c9c2b4', 'stroke-width': i === x.k ? 3 : 1.2 }, g);
        txt(g, xx + 41, 110, NAMEN[i], 13, i === x.k ? BLAU : T);
        txt(g, xx + 41, 126, WIE[i], 10, '#6f6a7c');
        await fade(api, g, 400);
        await api.wait(800);
      }
      await api.wait(600);
      const g = bildEin(api.svg, D.talBild(x.k), 110, 140, 140, 84);
      el('rect', { x: 110, y: 140, width: 140, height: 84, rx: 5, fill: 'none', stroke: BLAU, 'stroke-width': 2.5 }, g);
      await fade(api, g, 500);
      api.say(x.merk);
    },
  });

  D.erklaereThemen();
})();
