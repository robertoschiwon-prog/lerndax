/* GeDax (Geschichte) – Entdecken
 * Geschichte zum Staunen. Dunkle Bühne, leuchtende Farben (wie in MaDax und DeDax).
 * Jede Entdeckung: { title, viewBox, dark:true, discover:{icon, q, tag}, create(api) → {reset, play} }
 * Fakten nachgeschlagen am 13.11.2026 (siehe faecher/geschichte/fakten.md).
 */
(function () {
  const D = window.GeDax, EX = D.explainers, { el } = D.exUtil;
  const lerp = (a, b, t) => a + (b - a) * t;
  const reg = (id, def) => (EX[id] = Object.assign({ dark: true }, def));
  const W = '#ece9f7', BLAU = '#58c4dd', GELB = '#ffd166', GRUEN = '#83d483', ROT = '#ff6b6b', ORANGE = '#ff9f43', DIM = '#8a8fb5', FELD = '#1f2240';
  const txt = (p, x, y, text, size, fill, anchor) => el('text', { x, y, 'text-anchor': anchor || 'middle', class: 'k-txt', text, style: `font-size:${size || 14}px;fill:${fill || W}` }, p);
  const zeig = (api, e, ms) => api.tw(ms || 350, (t) => e.setAttribute('opacity', t));

  // =====================================================
  // Die Erdgeschichte als ein einziger Tag
  // =====================================================
  reg('ge-erdtag', {
    title: 'Die Erdgeschichte an einem Tag',
    viewBox: '0 0 360 230',
    discover: { icon: '🕛', q: 'Wenn die ganze Erdgeschichte ein Tag wäre: Wann kämen die Menschen?', tag: 'Zeit' },
    create(api) {
      // Erde: etwa 4,6 Milliarden Jahre. Ein Tag hat 86.400 Sekunden.
      const ALTER = 4.6e9, SEK = (vor) => 86400 * (1 - vor / ALTER);
      const uhr = (s) => { const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), x = Math.floor(s % 60); return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(x).padStart(2, '0')}`; };
      let g;
      return {
        reset() { api.clear(); g = el('g', {}, api.svg); },
        async play() {
          const balken = (von, bis, y, label) => {
            const b = el('g', { opacity: 0 }, g);
            el('rect', { x: 20, y, width: 320, height: 16, rx: 4, fill: FELD, stroke: '#3a3e66' }, b);
            txt(b, 20, y - 6, label[0], 10, DIM, 'start'); txt(b, 340, y - 6, label[1], 10, DIM, 'end');
            return { b, X: (s) => 20 + ((s - von) / (bis - von)) * 320 };
          };
          const marke = (B, s, y, text, farbe, oben) => {
            const m = el('g', { opacity: 0 }, g), x = B.X(s);
            el('line', { x1: x, y1: y - 2, x2: x, y2: y + 18, stroke: farbe, 'stroke-width': 3 }, m);
            txt(m, Math.max(112, Math.min(248, x)), oben ? y - 18 : y + 32, text, 10.5, farbe);
            return m;
          };
          api.say('Die Erde ist etwa <b>4,6 Milliarden</b> Jahre alt. Stell dir vor, diese ganze Zeit wäre <b>ein einziger Tag</b>: von Mitternacht bis Mitternacht.');
          const A = balken(0, 86400, 40, ['0 Uhr: die Erde entsteht', '24 Uhr: heute']);
          await zeig(api, A.b, 600); await api.wait(3200);
          const leben = marke(A, SEK(3.8e9), 40, `${uhr(SEK(3.8e9)).slice(0, 5)} Uhr: erste Lebewesen`, GRUEN);
          await zeig(api, leben); api.say('Gegen <b>4 Uhr morgens</b> gibt es die ersten winzigen Lebewesen im Meer.'); await api.wait(3200);
          const dino = marke(A, SEK(66e6), 40, `${uhr(SEK(66e6)).slice(0, 5)}: Dinos sterben aus`, ORANGE, true);
          await zeig(api, dino); api.say('Die Dinosaurier sterben vor 66 Millionen Jahren aus. Auf unserer Uhr: erst um <b>23:39 Uhr</b>!'); await api.wait(3800);
          api.say('Und die Menschen? Wir müssen in die <b>letzte Minute</b> hineinzoomen …'); await api.wait(2400);
          const B = balken(86340, 86400, 112, ['23:59:00', '24:00:00']);
          const lupe = el('path', { d: `M ${A.X(86340)} 56 L 20 108 M ${A.X(86400)} 56 L 340 108`, stroke: BLAU, 'stroke-width': 1.5, 'stroke-dasharray': '4 4', opacity: 0 }, g);
          await zeig(api, lupe); await zeig(api, B.b, 500); await api.wait(1200);
          const hab = marke(B, SEK(2.5e6), 112, `${uhr(SEK(2.5e6))}: erste Menschen (Homo habilis)`, GELB);
          await zeig(api, hab); api.say(`Die ersten Menschen (Homo habilis, vor etwa 2,5 Millionen Jahren): um <b>${uhr(SEK(2.5e6))}</b>. Noch 47 Sekunden bis Mitternacht.`); await api.wait(4200);
          const sap = marke(B, SEK(3e5), 112, `${uhr(SEK(3e5))}: Homo sapiens`, BLAU, true);
          await zeig(api, sap); api.say('Der <b>Homo sapiens</b> (vor etwa 300.000 Jahren) kommt erst <b>knapp 6 Sekunden</b> vor Mitternacht.'); await api.wait(4200);
          const r = el('g', { opacity: 0 }, g);
          txt(r, 180, 186, 'Pyramiden, Ötzi, Griechen, Römer, wir:', 13, W);
          txt(r, 180, 206, 'alles in der letzten Zehntelsekunde!', 15, GELB);
          await zeig(api, r, 500);
          api.say('Die Cheops-Pyramide ist 4600 Jahre alt: auf unserer Uhr nicht einmal <b>eine Zehntelsekunde</b>. Alles, was im Geschichtsbuch steht, passiert in einem Wimpernschlag am Ende des Tages.');
        },
      };
    },
  });

  // =====================================================
  // 7000 Jahre alte Brunnen in Sachsen und die Jahresringe
  // =====================================================
  reg('ge-brunnen', {
    title: 'Sachsens Steinzeit-Brunnen und die Jahresringe',
    viewBox: '0 0 360 230',
    discover: { icon: '🪵', q: 'Wie kann ein Stück Holz verraten, in welchem Jahr ein Baum gefällt wurde?', tag: 'Sachsen' },
    create(api) {
      // Breite der Jahresringe: gute Jahre breit, schlechte Jahre schmal (ausgedacht, nur zum Zeigen)
      const MUSTER = [3, 3, 1, 1, 3, 2, 1, 3, 3, 1, 2, 3, 1, 1, 2, 3, 3, 1, 2, 2, 3, 1, 3, 2];
      let g;
      return {
        reset() { api.clear(); g = el('g', {}, api.svg); },
        async play() {
          api.say('Bei Leipzig fanden Archäologen beim Bau des Flughafens einen Brunnen aus der Jungsteinzeit: über <b>7000 Jahre</b> alt, aus Eichenholz, 7 Meter tief.');
          // Brunnenkasten im Boden
          const br = el('g', { opacity: 0 }, g);
          el('rect', { x: 0, y: 30, width: 150, height: 190, fill: '#3b2a1a' }, br);
          el('rect', { x: 0, y: 140, width: 150, height: 80, fill: '#24476b', opacity: 0.7 }, br);
          txt(br, 75, 214, 'Grundwasser', 10, '#9cc8ff');
          for (let i = 0; i < 7; i++) el('rect', { x: 50, y: 40 + i * 24, width: 50, height: 21, rx: 2, fill: '#a0703c', stroke: '#6b4a24' }, br);
          await zeig(api, br, 600); await api.wait(4000);
          api.say('Warum ist das Holz nicht verfault? Unten im <b>Grundwasser</b> fehlt die Luft. Ohne Luft können Pilze und Kleinstlebewesen das Holz nicht zersetzen.');
          await api.wait(4600);
          // Baumscheibe mit wachsenden Ringen
          api.say('Jetzt der Trick: Ein Baum bekommt jedes Jahr <b>einen Ring</b>. In guten Jahren wächst er viel (breiter Ring), in trockenen Jahren wenig (schmaler Ring).');
          const cx = 255, cy = 92;
          el('circle', { cx, cy, r: 2, fill: '#c98a3a' }, g);
          let rr = 2;
          for (let i = 0; i < 18; i++) {
            const w = MUSTER[i] * 1.6 + 0.6, c = el('circle', { cx, cy, r: rr, fill: 'none', stroke: i % 2 ? '#c98a3a' : '#e3b778', 'stroke-width': w }, g);
            g.insertBefore(c, g.firstChild.nextSibling);
            const ziel = rr + w;
            await api.tw(120, (t) => c.setAttribute('r', lerp(rr, ziel - w / 2, t)));
            rr = ziel;
          }
          await api.wait(2200);
          // Strichcode
          api.say('Breit, breit, schmal, schmal … Die Ringe ergeben ein <b>Muster</b> wie ein Strichcode. Alle Eichen einer Gegend haben im selben Jahr ein ähnliches Muster.');
          const code = (y, start, n, farbe) => { const c = el('g', { opacity: 0 }, g); let x = 165; for (let i = start; i < start + n; i++) { el('rect', { x, y, width: MUSTER[i] * 2.2 + 1, height: 18, fill: farbe }, c); x += 7.5; } return c; };
          const bekannt = code(176, 0, 24, DIM); txt(bekannt, 255, 170, 'Muster bekannter Eichen, Jahr für Jahr', 9.5, DIM);
          await zeig(api, bekannt, 500); await api.wait(2200);
          const fund = code(204, 6, 10, GELB); txt(fund, 165, 200, 'Brunnenholz', 9.5, GELB, 'start');
          await zeig(api, fund, 400);
          await api.tw(1200, (t) => fund.setAttribute('transform', `translate(${lerp(-60, 45, t)},0)`));
          await api.wait(800);
          const pass = el('rect', { x: 165 + 45 - 2, y: 172, width: 10 * 7.5 + 4, height: 54, rx: 4, fill: 'none', stroke: GRUEN, 'stroke-width': 2.5, opacity: 0 }, g);
          await zeig(api, pass);
          api.say('Das Muster des Brunnenholzes passt genau an eine Stelle. So weiß man das Jahr, in dem der Baum gefällt wurde: <b>auf das Jahr genau</b>, auch nach über 7000 Jahren. Diese Methode heißt <b>Dendrochronologie</b> (Baumring-Zeitbestimmung).');
        },
      };
    },
  });

  // =====================================================
  // Die Uhr im Kohlenstoff (Radiokarbon)
  // =====================================================
  reg('ge-c14', {
    title: 'Die Uhr in jedem Lebewesen',
    viewBox: '0 0 360 230',
    discover: { icon: '⏳', q: 'Woher wissen Forscher, dass Ötzi etwa 5300 Jahre alt ist?', tag: 'Methode' },
    create(api) {
      let g, punkte = [];
      return {
        reset() {
          api.clear(); g = el('g', {}, api.svg); punkte = [];
          for (let i = 0; i < 64; i++) punkte.push(el('circle', { cx: 40 + (i % 16) * 18, cy: 54 + Math.floor(i / 16) * 18, r: 6, fill: GELB }, g));
        },
        async play() {
          api.say('Jedes Lebewesen nimmt winzige Teilchen einer besonderen Sorte Kohlenstoff auf, man nennt sie <b>C-14</b>. Hier: 64 gelbe Punkte.');
          await api.wait(3600);
          api.say('Solange es lebt, bleibt die Menge gleich. Nach dem Tod kommt nichts mehr nach, und die Teilchen <b>zerfallen</b> langsam.');
          await api.wait(3600);
          const zeile = txt(g, 180, 150, '', 15, W), jahre = txt(g, 180, 176, '', 13, DIM);
          let rest = shuffle(punkte.slice());
          const schritt = async (n, text, j) => {
            const weg = rest.slice(0, n); rest = rest.slice(n);
            await api.tw(700, (t) => weg.forEach((p) => p.setAttribute('opacity', 1 - t * 0.85)));
            zeile.textContent = text; jahre.textContent = j;
          };
          await schritt(32, 'noch 32 von 64: die Hälfte', 'nach 5730 Jahren');
          api.say('Nach <b>5730 Jahren</b> ist die Hälfte zerfallen. Diese Zeit heißt <b>Halbwertszeit</b>.'); await api.wait(3800);
          await schritt(16, 'noch 16 von 64: ein Viertel', 'nach 2 × 5730 = 11.460 Jahren');
          api.say('Nach weiteren 5730 Jahren ist von dem Rest wieder die Hälfte weg: ein Viertel bleibt.'); await api.wait(3800);
          await schritt(8, 'noch 8 von 64: ein Achtel', 'nach 3 × 5730 = 17.190 Jahren');
          api.say('Und so weiter. Wie bei einer Uhr: Wer misst, wie viel noch übrig ist, weiß, wie lange der Tod her ist.'); await api.wait(3800);
          const r = el('g', { opacity: 0 }, g);
          txt(r, 180, 204, 'Ötzi: etwas mehr als die Hälfte übrig → etwa 5300 Jahre', 12, GRUEN);
          txt(r, 180, 222, 'Holzkohle aus Lascaux: etwa ein Achtel → etwa 17.000 Jahre', 12, BLAU);
          await zeig(api, r, 500);
          api.say('So wurde zum Beispiel Ötzi datiert. Die Methode heißt <b>Radiokarbon-Methode</b> (C-14-Methode). Sie funktioniert nur bei Dingen, die einmal gelebt haben: Knochen, Holz, Leder, Pflanzen. Nicht bei Steinen!');
        },
      };
    },
  });
  const shuffle = (a) => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };

  // =====================================================
  // Der wandernde Kalender der Ägypter
  // =====================================================
  reg('ge-kalender', {
    title: 'Der Kalender, der wanderte',
    viewBox: '0 0 360 230',
    discover: { icon: '📅', q: 'Warum gibt es das Schaltjahr? Die alten Ägypter hatten noch keins.', tag: 'Ägypten' },
    create(api) {
      let g;
      return {
        reset() { api.clear(); g = el('g', {}, api.svg); },
        async play() {
          api.say('Die Ägypter teilten das Jahr in <b>12 Monate zu je 30 Tagen</b>. Das sind 360 Tage. Dazu kamen <b>5 Festtage</b>: zusammen 365.');
          const cx = 110, cy = 112, R0 = 78;
          for (let i = 0; i < 12; i++) {
            const a0 = (i / 12.17) * Math.PI * 2 - Math.PI / 2, a1 = ((i + 1) / 12.17) * Math.PI * 2 - Math.PI / 2 - 0.02;
            const p = el('path', { d: `M ${cx + R0 * Math.cos(a0)} ${cy + R0 * Math.sin(a0)} A ${R0} ${R0} 0 0 1 ${cx + R0 * Math.cos(a1)} ${cy + R0 * Math.sin(a1)}`, stroke: i < 4 ? BLAU : i < 8 ? GRUEN : GELB, 'stroke-width': 18, fill: 'none', opacity: 0 }, g);
            await api.tw(120, (t) => p.setAttribute('opacity', t));
          }
          const a0 = (12 / 12.17) * Math.PI * 2 - Math.PI / 2, a1 = Math.PI * 1.5 - 0.01;
          el('path', { d: `M ${cx + R0 * Math.cos(a0)} ${cy + R0 * Math.sin(a0)} A ${R0} ${R0} 0 0 1 ${cx + R0 * Math.cos(a1)} ${cy + R0 * Math.sin(a1)}`, stroke: ROT, 'stroke-width': 18, fill: 'none' }, g);
          txt(g, cx, cy - 4, '365', 26, W); txt(g, cx, cy + 16, 'Tage', 12, DIM);
          const leg = el('g', {}, g);
          [['Überschwemmung', BLAU], ['Aussaat', GRUEN], ['Ernte', GELB], ['5 Festtage', ROT]].forEach(([t, f], i) => { el('rect', { x: 216, y: 40 + i * 22, width: 12, height: 12, rx: 2, fill: f }, leg); txt(leg, 234, 50 + i * 22, t, 12, W, 'start'); });
          await api.wait(4200);
          api.say('Aber die Erde braucht für eine Runde um die Sonne <b>365 Tage und etwa 6 Stunden</b>: einen Vierteltag mehr.');
          await api.wait(4000);
          const zeiger = el('g', {}, g), nil = el('circle', { cx: cx, cy: cy - R0, r: 8, fill: '#9cc8ff', stroke: '#fff', 'stroke-width': 2 }, zeiger);
          txt(g, 288, 150, 'Die Nilflut kommt …', 11, DIM);
          const jahrT = txt(g, 288, 172, '', 13, W), tagT = txt(g, 288, 192, '', 12, '#9cc8ff');
          api.say('Darum kam die Nilflut jedes Jahr ein Vierteltag später im Kalender. Nach 4 Jahren ein ganzer Tag, nach 120 Jahren ein ganzer Monat!');
          const stationen = [[4, 1], [40, 10], [120, 30], [730, 182], [1460, 365]];
          for (const [jahre, tage] of stationen) {
            const w = -Math.PI / 2 + (tage / 365) * Math.PI * 2;
            await api.tw(900, () => {});
            nil.setAttribute('cx', cx + R0 * Math.cos(w)); nil.setAttribute('cy', cy + R0 * Math.sin(w));
            jahrT.textContent = `nach ${jahre} Jahren`; tagT.textContent = tage === 365 ? 'wieder am alten Platz' : `${tage} Tage später`;
            await api.wait(1700);
          }
          api.say('Erst nach etwa <b>1460 Jahren</b> passte es wieder. Die Lösung kam später: <b>Julius Cäsar</b> führte 45 v. Chr. alle vier Jahre einen Extratag ein: das <b>Schaltjahr</b>. Darum gibt es den 29. Februar.');
        },
      };
    },
  });

  // =====================================================
  // Alexander der Große: von Makedonien bis Indien (Wahlbereich)
  // =====================================================
  reg('ge-alexander', {
    title: 'Alexander der Große',
    viewBox: '0 0 360 230',
    discover: { icon: '🐎', q: 'Ein König zieht mit 22 Jahren los und kommt bis nach Indien. Darf man ihn „den Großen“ nennen?', tag: 'Wahlbereich' },
    create(api) {
      // Skizze, nicht maßstabsgetreu: Orte grob von West nach Ost
      const ORTE = [
        { n: 'Pella (Makedonien)', x: 40, y: 58, j: '356 v. Chr.: geboren', s: 'Alexander wird <b>356 v. Chr.</b> in Pella geboren, als Sohn des Königs von Makedonien. Sein Lehrer ist der berühmte Gelehrte Aristoteles.' },
        { n: 'Kleinasien', x: 95, y: 84, j: '334 v. Chr.: Aufbruch', s: 'Mit 20 wird er König (336 v. Chr.). <b>334 v. Chr.</b> zieht er mit seinem Heer nach Asien, gegen das riesige Perserreich.' },
        { n: 'Issos', x: 140, y: 102, j: '333 v. Chr.: Sieg über die Perser', s: '<b>333 v. Chr.</b> besiegt er den persischen König bei Issos.' },
        { n: 'Alexandria (Ägypten)', x: 110, y: 170, j: '331 v. Chr.: Stadt gegründet', s: 'Ägypten ergibt sich ohne Kampf. <b>331 v. Chr.</b> gründet er Alexandria. Die Stadt wird berühmt für ihren Leuchtturm und ihre riesige Bibliothek.' },
        { n: 'Babylon', x: 200, y: 124, j: '331 v. Chr.: Herr über Persien', s: 'Er schlägt die Perser noch einmal und zieht in Babylon ein.' },
        { n: 'Indien', x: 318, y: 120, j: '326 v. Chr.: am Indus', s: 'Er kämpft sich bis nach <b>Indien</b> vor. Dort weigern sich seine erschöpften Soldaten weiterzuziehen.' },
        { n: 'Babylon', x: 200, y: 124, j: '323 v. Chr.: Tod mit 32', s: '<b>323 v. Chr.</b> stirbt er in Babylon an einem Fieber, mit nur <b>32 Jahren</b>. Sein Reich zerfällt bald danach.' },
      ];
      let g;
      return {
        reset() {
          api.clear(); g = el('g', {}, api.svg);
          el('path', { d: 'M 0 140 C 40 130 60 150 90 140 C 120 130 150 150 170 160 L 170 230 L 0 230 Z', fill: '#1d3a5c', opacity: 0.7 }, g);
          txt(g, 60, 214, 'Mittelmeer', 10, '#9cc8ff');
          txt(g, 352, 222, 'Skizze, nicht maßstabsgetreu', 8.5, DIM, 'end');
        },
        async play() {
          const weg = el('path', { d: '', stroke: GELB, 'stroke-width': 3, fill: 'none', 'stroke-dasharray': '6 4' }, g);
          let d = '';
          const besucht = new Set();
          for (let i = 0; i < ORTE.length; i++) {
            const o = ORTE[i], v = ORTE[i - 1];
            if (v) {
              const seg = el('line', { x1: v.x, y1: v.y, x2: v.x, y2: v.y, stroke: GELB, 'stroke-width': 3 }, g);
              await api.tw(900, (t) => { seg.setAttribute('x2', lerp(v.x, o.x, t)); seg.setAttribute('y2', lerp(v.y, o.y, t)); });
              seg.remove(); d += ` L ${o.x} ${o.y}`;
            } else d = `M ${o.x} ${o.y}`;
            weg.setAttribute('d', d);
            if (!besucht.has(o.n)) {
              besucht.add(o.n);
              el('circle', { cx: o.x, cy: o.y, r: 5, fill: i === 0 ? GRUEN : ORANGE }, g);
              txt(g, Math.max(62, Math.min(306, o.x)), o.y - 10, o.n, 10, W);
            }
            const j = txt(g, 180, 22 + (i % 2) * 0, '', 13, GELB);
            j.textContent = o.j;
            api.say(o.s);
            await api.wait(4200);
            j.remove();
          }
          const r = el('g', { opacity: 0 }, g);
          txt(r, 180, 24, 'Zu Recht „der Große“?', 15, GELB);
          await zeig(api, r, 400);
          api.say('Für „groß“ spricht: ein riesiges Reich (etwa 5 Millionen km²), neue Städte, griechische Sprache und Kultur bis nach Asien. Dagegen spricht: Zehntausende Tote und zerstörte Städte, etwa der Palast von Persepolis. Den Beinamen gaben ihm erst spätere Generationen. Was meinst du?');
        },
      };
    },
  });
})();
