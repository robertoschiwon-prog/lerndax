/* GeoDax (Geografie) – Entdecken
 * Geografie zum Staunen. Dunkle Bühne, leuchtende Farben (wie in den anderen Fächern).
 * Jede Entdeckung: { title, viewBox, dark:true, discover:{icon, q, tag}, create(api) → {reset, play} }
 * Zahlen nachgeschlagen (faecher/geo/fakten.md): Durchmesser von Erde, Mond und Sonne, Abstände, Fläche von Grönland und Afrika.
 */
(function () {
  const D = window.GeoDax, EX = D.explainers, { el } = D.exUtil;
  const lerp = (a, b, t) => a + (b - a) * t;
  const reg = (id, def) => (EX[id] = Object.assign({ dark: true }, def));
  const W = '#ece9f7', BLAU = '#58c4dd', GELB = '#ffd166', GRUEN = '#83d483', ROT = '#ff6b6b', ORANGE = '#ff9f43', DIM = '#8a8fb5', FELD = '#1f2240';
  const txt = (p, x, y, text, size, fill, anchor) => el('text', { x, y, 'text-anchor': anchor || 'middle', class: 'k-txt', text, style: `font-size:${size || 14}px;fill:${fill || W}` }, p);
  const zeig = (api, e, ms) => api.tw(ms || 350, (t) => e.setAttribute('opacity', t));

  // =====================================================
  // Warum gibt es Jahreszeiten?
  // =====================================================
  reg('geo-jahreszeiten', {
    title: 'Warum gibt es Jahreszeiten?',
    viewBox: '0 0 360 230',
    discover: { icon: '☀️', q: 'Im Sommer ist die Sonne nicht näher als im Winter. Warum ist es dann wärmer?', tag: 'Erde' },
    create(api) {
      // Mittagshöhe der Sonne über Dresden (51° N): 90° − 51° ± 23,4°; Tageslänge gerundet
      const M = [['21. Dezember', 15.5, 'knapp 8 Stunden'], ['21. März', 39, 'etwa 12 Stunden'], ['21. Juni', 62.5, 'rund 16 ½ Stunden'], ['23. September', 39, 'etwa 12 Stunden']];
      let g;
      const zeige = async (k, schnell) => {
        g.innerHTML = '';
        const [datum, h, tag] = M[k], a = h * Math.PI / 180, bx = 180, by = 170, breit = 34;
        el('rect', { x: 0, y: by, width: 360, height: 60, fill: '#2a3d2a' }, g);
        txt(g, 30, by + 16, 'Dresden', 11, DIM, 'start');
        // Lichtbündel gleicher Breite trifft unter dem Winkel h auf den Boden
        const fleck = breit / Math.sin(a), dx = Math.cos(a), dy = Math.sin(a), L = 150;
        const p1 = [bx - fleck / 2, by], p2 = [bx + fleck / 2, by];
        const q1 = [p1[0] + dx * L, p1[1] - dy * L], q2 = [p2[0] + dx * L, p2[1] - dy * L];
        const strahl = el('path', { d: `M${q1} L${p1} L${p2} L${q2}Z`, fill: 'rgba(255,209,102,.35)', stroke: GELB, 'stroke-width': 1.5, opacity: 0 }, g);
        const boden = el('line', { x1: p1[0], y1: by, x2: p2[0], y2: by, stroke: GELB, 'stroke-width': 6, opacity: 0 }, g);
        el('circle', { cx: Math.min(340, (q1[0] + q2[0]) / 2), cy: Math.max(16, (q1[1] + q2[1]) / 2), r: 13, fill: GELB }, g);
        el('path', { d: `M${bx + 50} ${by} A50 50 0 0 0 ${bx + 50 * Math.cos(a)} ${by - 50 * Math.sin(a)}`, fill: 'none', stroke: W, 'stroke-width': 1.2 }, g);
        txt(g, bx + 62, by - 8, `${String(h).replace('.', ',')}°`, 12, W, 'start');
        txt(g, 16, 24, datum, 16, GELB, 'start');
        txt(g, 16, 44, `Tag: ${tag}`, 12, W, 'start');
        await zeig(api, strahl, schnell ? 200 : 600); await zeig(api, boden, schnell ? 150 : 400);
        txt(g, bx, by + 38, `beleuchtete Fläche: ${fleck < 50 ? 'klein, Licht konzentriert' : fleck < 70 ? 'mittel' : 'groß, Licht verteilt'}`, 11.5, fleck < 50 ? ORANGE : BLAU);
      };
      return {
        reset() { api.clear(); g = el('g', {}, api.svg); api.chips(M.map((m, k) => ({ label: m[0].replace('21. ', '').replace('23. ', ''), onClick() { zeige(k, true); api.say(k === 2 ? 'Juni: Die Sonne steht hoch. Das Licht fällt steil auf eine kleine Fläche und wärmt sie stark. Und die Sonne scheint lange.' : k === 0 ? 'Dezember: Die Sonne steht tief. Dasselbe Licht verteilt sich auf eine große Fläche und wärmt kaum. Und die Tage sind kurz.' : 'Frühling und Herbst: Die Sonne steht halb so hoch wie im Juni, Tag und Nacht sind etwa gleich lang.'); } }))); },
        async play() {
          api.say('Viele denken: Im Sommer ist die Erde näher an der Sonne. Stimmt nicht! Anfang Januar ist sie sogar am nächsten. Schau dir an, wie die Mittagssonne auf Dresden scheint.');
          await api.wait(4500);
          await zeige(0);
          api.say('Im <b>Dezember</b> steht die Sonne mittags nur gut 15° hoch. Das Lichtbündel trifft schräg auf und verteilt sich auf eine große Fläche.');
          await api.wait(4800);
          await zeige(2);
          api.say('Im <b>Juni</b> steht sie über 60° hoch. Dasselbe Licht trifft steil auf eine kleine Fläche: Jeder Fleck bekommt viel mehr Wärme. Dazu scheint sie doppelt so lange.');
          await api.wait(5200);
          api.say('Der Grund ist die <b>schräge Erdachse</b>: Im Juni ist unsere Nordhalbkugel zur Sonne geneigt, im Dezember von ihr weg. Tippe auf die Monate unten und vergleiche selbst.');
        },
      };
    },
  });

  // =====================================================
  // Karten schummeln: Grönland schrumpft
  // =====================================================
  reg('geo-groenland', {
    title: 'Karten schummeln ein bisschen',
    viewBox: '0 0 360 230',
    discover: { icon: '🧊', q: 'Auf vielen Weltkarten ist Grönland so groß wie Afrika. Stimmt das?', tag: 'Karten' },
    create(api) {
      const K = window.GeoKarte.daten, S = 50, X = (lon) => 180 + (lon * Math.PI / 180) * S;
      const mY = (lat) => Math.log(Math.tan(Math.PI / 4 + Math.max(-60, Math.min(82, lat)) * Math.PI / 360));
      const Y = (lat) => 14 + (2.66 - mY(lat)) * S;
      const pfad = (ring, f) => { let d = ''; for (let i = 0; i < ring.length; i += 2) { const [x, y] = f(ring[i], ring[i + 1]); d += (i ? 'L' : 'M') + x.toFixed(1) + ' ' + y.toFixed(1); } return d + 'Z'; };
      // Grönland in echter Größe an den Äquator verschieben (gleiche Kilometer in alle Richtungen)
      const L0 = -42, B0 = 72, ZIEL = [-30, 2];
      const echt = (lon, lat) => [ZIEL[0] + (lon - L0) * Math.cos(lat * Math.PI / 180), ZIEL[1] + (lat - B0)];
      let g, gr;
      return {
        reset() {
          api.clear(); g = el('g', {}, api.svg);
          for (const [name, ringe] of Object.entries(K.welt)) {
            if (name === 'Antarktis') continue;
            for (const r of ringe) el('path', { d: pfad(r, (lo, la) => [X(lo), Y(la)]), fill: name === 'Afrika' ? '#3d6b4a' : '#33385e', stroke: '#4a5080', 'stroke-width': 0.6 }, g);
          }
          gr = el('g', {}, g);
        },
        async play() {
          api.say('Das ist eine Weltkarte, wie sie oft im Internet und an Wänden hängt (die Mercator-Karte). Schau auf <b>Grönland</b> oben und <b>Afrika</b> in der Mitte.');
          const ringe = K.groenland.map((r) => ({ r, p: el('path', { fill: '#7fd3ef', stroke: BLAU, 'stroke-width': 1 }, gr) }));
          const setz = (t) => ringe.forEach(({ r, p }) => p.setAttribute('d', pfad(r, (lo, la) => { const [a, b] = echt(lo, la); return [lerp(X(lo), X(a), t), lerp(Y(la), Y(b), t)]; })));
          setz(0);
          const tg = txt(g, X(-42), Y(78), 'Grönland', 11, '#0b1d33'), ta = txt(g, X(20), Y(5), 'Afrika', 12, W);
          await api.wait(5200);
          api.say('Sieht fast gleich groß aus, oder? Eine Kugel lässt sich aber nicht glatt auf Papier drücken. Diese Karte zieht alles in Richtung der Pole immer mehr in die Breite und Höhe.');
          await api.wait(5200);
          tg.remove();
          api.say('Jetzt schieben wir Grönland zum Äquator, wo die Karte nicht verzerrt. Dabei behält es seine echten Kilometer.');
          await api.tw(3600, (t) => setz(t * t * (3 - 2 * t)));
          txt(g, X(-30), Y(-14), 'Grönland in echt', 11, BLAU);
          await api.wait(1200);
          api.say('Grönland ist rund <b>2,2 Millionen km²</b> groß, Afrika rund <b>30 Millionen km²</b>: Afrika ist etwa <b>14-mal</b> so groß! Darum zeigt der Globus die Welt am ehrlichsten.');
          void ta;
        },
      };
    },
  });

  // =====================================================
  // Wenn die Erde ein Fußball wäre
  // =====================================================
  reg('geo-fussball', {
    title: 'Wenn die Erde ein Fußball wäre',
    viewBox: '0 0 360 230',
    discover: { icon: '⚽', q: 'Die Erde schrumpft auf Fußballgröße. Wie weit weg wären dann Mond und Sonne?', tag: 'Weltall' },
    create(api) {
      let g;
      return {
        reset() { api.clear(); g = el('g', {}, api.svg); for (let i = 0; i < 40; i++) el('circle', { cx: (i * 97) % 360, cy: (i * 53) % 230, r: 0.8, fill: DIM }, g); },
        async play() {
          api.say('Die Erde ist fast <b>12 750 km</b> dick. Das kann sich niemand vorstellen. Also machen wir sie so klein wie einen Fußball: 22 cm.');
          const erde = el('circle', { cx: 60, cy: 120, r: 0, fill: '#3b7dd8', stroke: '#9fd0ff', 'stroke-width': 2 }, g);
          await api.tw(900, (t) => erde.setAttribute('r', 30 * t));
          txt(g, 60, 172, 'Erde: 22 cm', 12, BLAU);
          await api.wait(4200);
          api.say('Der Mond ist etwa ein Viertel so dick: so groß wie ein kleiner <b>Apfel (6 cm)</b>.');
          const mond = el('circle', { cx: 120, cy: 120, r: 8, fill: '#cfcfd6', opacity: 0 }, g);
          await zeig(api, mond, 500);
          await api.wait(3200);
          api.say('Und wie weit weg? Nicht eine Handbreit, sondern etwa <b>6,6 Meter</b>: einmal quer durchs Klassenzimmer!');
          const lin = el('line', { x1: 92, y1: 120, x2: 92, y2: 120, stroke: DIM, 'stroke-width': 1.5, 'stroke-dasharray': '4 4' }, g);
          await api.tw(1800, (t) => { mond.setAttribute('cx', lerp(120, 300, t)); lin.setAttribute('x2', lerp(92, 290, t)); });
          txt(g, 196, 110, '6,6 m', 14, W);
          txt(g, 300, 145, 'Mond', 12, '#cfcfd6');
          await api.wait(4000);
          api.say('Die Sonne wäre eine Kugel von <b>24 Metern</b>, so hoch wie ein Haus mit acht Stockwerken.');
          const sonne = el('circle', { cx: 1110, cy: 120, r: 760, fill: GELB, opacity: 0 }, g);
          await zeig(api, sonne, 900);
          await api.wait(3800);
          api.say('Und sie wäre <b>2,6 Kilometer</b> entfernt. Zwischen Fußball und Sonne: fast nur leerer Raum. Das Licht braucht für den echten Weg trotzdem nur gut 8 Minuten.');
        },
      };
    },
  });

  // =====================================================
  // Zwei Flutberge
  // =====================================================
  reg('geo-flutberge', {
    title: 'Zwei Flutberge',
    viewBox: '0 0 360 230',
    discover: { icon: '🌊', q: 'Der Mond kommt einmal am Tag vorbei. Warum gibt es dann zweimal Flut?', tag: 'Küste' },
    create(api) {
      const cx = 130, cy = 115, R = 52;
      let g;
      return {
        reset() { api.clear(); g = el('g', {}, api.svg); },
        async play() {
          api.say('Wir schauen von oben auf den Nordpol. Rechts steht der Mond. Er zieht mit seiner Schwerkraft am Wasser der Ozeane.');
          el('circle', { cx: 320, cy: cy, r: 13, fill: '#cfcfd6' }, g); txt(g, 320, cy + 30, 'Mond', 11, '#cfcfd6');
          const wasser = el('ellipse', { cx, cy, rx: R + 2, ry: R + 2, fill: 'rgba(88,196,221,.45)', stroke: BLAU, 'stroke-width': 1.5 }, g);
          el('circle', { cx, cy, r: R - 6, fill: '#3d6b4a' }, g);
          await api.wait(3800);
          api.say('Auf der Seite zum Mond zieht er am stärksten: Das Wasser wölbt sich zu einem <b>Flutberg</b>.');
          await api.tw(1500, (t) => wasser.setAttribute('rx', R + 2 + 16 * t));
          api.say('Auf der anderen Seite zieht er am schwächsten. Dort bleibt das Wasser gleichsam zurück: ein <b>zweiter Flutberg</b>. Dazwischen ist das Wasser niedrig.');
          txt(g, cx + R + 26, cy - 14, 'Flut', 11, BLAU); txt(g, cx - R - 26, cy - 14, 'Flut', 11, BLAU);
          txt(g, cx, cy - R - 10, 'Ebbe', 11, DIM); txt(g, cx, cy + R + 20, 'Ebbe', 11, DIM);
          await api.wait(5200);
          api.say('Die Erde dreht sich unter den Flutbergen hindurch. Ein Ort an der Küste (rot) kommt an einem Tag durch <b>beide</b> Flutberge.');
          const p = el('circle', { r: 5, fill: ROT, stroke: '#fff', 'stroke-width': 1.5 }, g);
          const zaehl = txt(g, 300, 30, '', 13, W);
          let fluten = 0, warNah = false;
          await api.tw(7000, (t) => {
            const w = Math.PI - t * 2 * Math.PI; // gegen den Uhrzeigersinn
            p.setAttribute('cx', cx + Math.cos(w) * (R - 10)); p.setAttribute('cy', cy + Math.sin(w) * (R - 10));
            const nah = Math.abs(Math.sin(w)) < 0.15;
            if (nah && !warNah && t > 0.02) { fluten++; zaehl.textContent = `Flut Nr. ${fluten}`; }
            warNah = nah;
          });
          api.say('Zweimal Flut, zweimal Ebbe. Weil der Mond in der Zwischenzeit weiterwandert, dauert eine Runde 24 Stunden und 50 Minuten. Darum kommt die Flut jeden Tag etwa <b>50 Minuten später</b>.');
        },
      };
    },
  });

  // =====================================================
  // Ein Fluss gräbt ein Tal
  // =====================================================
  reg('geo-tal', {
    title: 'Ein Fluss gräbt ein Tal',
    viewBox: '0 0 360 230',
    discover: { icon: '🏞', q: 'Wie schafft ein kleiner Bach ein riesiges Tal?', tag: 'Flüsse' },
    create(api) {
      // Querschnitte mit gleich vielen Punkten, damit sie ineinander übergehen
      const P = {
        flach: [[0, 60], [100, 60], [160, 60], [176, 62], [184, 62], [200, 60], [260, 60], [360, 60]],
        kerb: [[0, 60], [100, 60], [150, 110], [176, 158], [184, 158], [210, 110], [260, 60], [360, 60]],
        sohle: [[0, 60], [80, 60], [118, 130], [150, 168], [210, 168], [242, 130], [280, 60], [360, 60]],
        mulde: [[0, 70], [50, 74], [100, 108], [140, 156], [220, 156], [260, 108], [310, 74], [360, 70]],
      };
      let g, land, fluss;
      const form = (a, b, t) => a.map((p, i) => [lerp(p[0], b[i][0], t), lerp(p[1], b[i][1], t)]);
      const setz = (pk) => {
        land.setAttribute('d', 'M' + pk.map((p) => p.join(' ')).join(' L') + ' L360 230 L0 230Z');
        const y = pk[3][1], a = pk[3][0], b = pk[4][0];
        fluss.setAttribute('d', `M${a - 2} ${y - 3} L${b + 2} ${y - 3} L${b} ${y} L${a} ${y}Z`);
      };
      return {
        reset() { api.clear(); g = el('g', {}, api.svg); land = el('path', { fill: '#6b5a3e', stroke: '#c9a86a', 'stroke-width': 1.5 }, g); fluss = el('path', { fill: BLAU }, g); setz(P.flach); },
        async play() {
          api.say('Ein Bach fließt über eine Hochfläche im Gebirge. Wir schauen von vorn auf einen Schnitt durch das Gelände.');
          const jahre = txt(g, 350, 24, 'heute', 13, GELB, 'end');
          await api.wait(3800);
          api.say('Das Wasser ist schnell. Es reißt Sand und Steine mit und schleift damit den Boden ab: Es gräbt sich in die Tiefe. Die Hänge rutschen nach. Ein <b>Kerbtal</b> entsteht, wie ein V.');
          await api.tw(4200, (t) => { setz(form(P.flach, P.kerb, t)); jahre.textContent = 'viel später'; });
          await api.wait(2200);
          api.say('Später pendelt der Fluss hin und her, gräbt an den Seiten und lagert in der Mitte Kies und Sand ab: ein <b>Sohlental</b> mit flachem Boden.');
          await api.tw(3600, (t) => { setz(form(P.kerb, P.sohle, t)); jahre.textContent = 'noch viel später'; });
          await api.wait(2200);
          api.say('Regen, Frost und Pflanzen tragen die Hänge immer weiter ab. Sie werden flach: ein <b>Muldental</b>.');
          await api.tw(3600, (t) => { setz(form(P.sohle, P.mulde, t)); jahre.textContent = 'nach sehr, sehr langer Zeit'; });
          await api.wait(1500);
          api.say('Ganz langsam, Körnchen für Körnchen. Die Steine im Fluss werden dabei immer runder. Für ein großes Tal braucht ein Fluss Hunderttausende von Jahren.');
        },
      };
    },
  });
})();
