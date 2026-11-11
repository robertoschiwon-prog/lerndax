/* MaDax (Mathe) – Entdecken
 * Visuelle Beweise und Staunen-Momente. Dunkle Bühne, leuchtende Farben.
 * Jede Entdeckung: { title, viewBox, dark:true, discover:{icon, q, tag}, create(api) → {reset, play} }
 */
(function () {
  const M = window.Mathelix;
  const U = M.util;
  const { el, arcD, pt } = M.exUtil;
  const EX = M.explainers;
  const fr = U.fr, R = U.R;
  const lerp = (a, b, t) => a + (b - a) * t;
  const clamp = (v) => Math.max(0, Math.min(1, v));
  const reg = (id, def) => (EX[id] = Object.assign({ dark: true }, def));
  const norm = (d) => { d = ((d % 360) + 360) % 360; return d > 180 ? d - 360 : d; };
  const pts = (arr) => arr.map((p) => p.map((v) => v.toFixed(1)).join(',')).join(' ');

  // =====================================================
  // 1 + 2 + … + 100 – der Trick des kleinen Gauß
  // =====================================================
  reg('gauss', {
    title: 'Der Trick des kleinen Gauß',
    viewBox: '0 0 360 244',
    discover: { icon: '∑', q: 'Wie rechnete Gauß 1 + 2 + … + 100 in wenigen Minuten aus?', tag: 'Klasse 5' },
    create(api) {
      let n = 8, G, cols, yel;
      api.chips([4, 6, 8, 10].map((k) => ({ label: `1 bis ${k}`, onClick() { n = k; api.replay(); } })));
      const setY = (dx, rot) => yel.setAttribute('transform', `translate(${dx},0) rotate(${rot} ${G.cx} ${G.cy})`);
      return {
        reset() {
          api.clear();
          const s = Math.min(17, 150 / (n + 1)), x0 = 30, base = 205;
          G = { s, x0, base, cx: x0 + (n * s) / 2, cy: base - ((n + 1) * s) / 2, dx: n * s + 34 };
          cols = [];
          for (let k = 1; k <= n; k++) {
            const g = el('g', { opacity: 0 }, api.svg);
            for (let h = 0; h < k; h++) el('rect', { x: x0 + (k - 1) * s + 1, y: base - (h + 1) * s + 1, width: s - 2, height: s - 2, rx: 2, class: 'k-blue' }, g);
            el('text', { x: x0 + (k - 1) * s + s / 2, y: base + 14, class: 'k-dim', 'text-anchor': 'middle', text: k }, g);
            cols.push(g);
          }
          yel = el('g', { opacity: 0 }, api.svg);
          for (let k = 1; k <= n; k++) for (let h = k; h <= n; h++) el('rect', { x: x0 + (k - 1) * s + 1, y: base - (h + 1) * s + 1, width: s - 2, height: s - 2, rx: 2, class: 'k-yel' }, yel);
          setY(0, 180);
        },
        async play() {
          api.say('Ein Lehrer wollte Ruhe haben: „Rechnet <b>1 + 2 + 3 + … + 100</b> aus!“<br>Der 9-jährige <b>Carl Friedrich Gauß</b> war nach wenigen Minuten fertig. Wie hat er das gemacht?');
          await api.wait(4500);
          api.say(`Wir probieren es kleiner: <b>1 + 2 + … + ${n}</b>. Jede Zahl ist eine Säule – zusammen eine Treppe.`);
          for (const c of cols) await api.tw(260, (t) => c.setAttribute('opacity', t));
          await api.wait(2000);
          api.say('Jetzt kommt der Trick: Wir machen eine <b class="ky">Kopie</b> der Treppe …');
          await api.tw(500, (t) => yel.setAttribute('opacity', t));
          await api.tw(1200, (t) => setY(G.dx * t, 180));
          await api.wait(600);
          api.say('… und stellen sie auf den Kopf.');
          await api.tw(1400, (t) => setY(G.dx, 180 * (1 - t)));
          await api.wait(800);
          api.say('Jetzt schieben wir beide Treppen zusammen …');
          await api.tw(1300, (t) => setY(G.dx * (1 - t), 0));
          const { s, x0, base } = G;
          const lab = el('g', { opacity: 0 }, api.svg);
          el('text', { x: x0 + (n * s) / 2, y: base + 30, class: 'k-txt', 'text-anchor': 'middle', text: `${n} breit` }, lab);
          el('text', { x: x0 + n * s + 8, y: base - ((n + 1) * s) / 2 + 5, class: 'k-txt', text: `${n + 1} hoch` }, lab);
          await api.tw(500, (t) => lab.setAttribute('opacity', t));
          api.say(`Ein Rechteck! <b>${n}</b> breit und <b>${n + 1}</b> hoch: ${n} · ${n + 1} = <b>${n * (n + 1)}</b> Kästchen.`);
          await api.wait(3500);
          api.say(`Unsere blaue Treppe ist genau die Hälfte davon: ${n * (n + 1)} : 2 = <b>${(n * (n + 1)) / 2}</b><br>Also: 1 + 2 + … + ${n} = ${(n * (n + 1)) / 2}`);
          await api.wait(4500);
          api.say('Und bis 100? Das Rechteck wäre 100 breit und 101 hoch:<br><span class="exbig f1">100 · 101 : 2 = 5050</span><br><small>Gauß sah: 1+100, 2+99, 3+98 … ergibt immer 101, und davon gibt es 50 Paare.</small>');
        },
      };
    },
  });

  // =====================================================
  // Ungerade Zahlen ergeben Quadratzahlen
  // =====================================================
  reg('odd', {
    title: 'Ungerade Zahlen bauen Quadrate',
    viewBox: '0 0 360 215',
    discover: { icon: '■', q: 'Was kommt heraus, wenn man 1 + 3 + 5 + 7 + … rechnet?', tag: 'Klasse 5' },
    create(api) {
      let n = 6, layers;
      const COL = ['k-blue', 'k-yel', 'k-green', 'k-red', 'k-purple', 'k-orange', 'k-blue', 'k-yel'];
      api.chips([4, 6, 8].map((k) => ({ label: `${k} Schritte`, onClick() { n = k; api.replay(); } })));
      let G;
      return {
        reset() {
          api.clear();
          const s = Math.min(21, 150 / n), x0 = 180 - (n * s) / 2, y0 = 14;
          G = { s, x0, y0 };
          layers = [];
          for (let k = 1; k <= n; k++) {
            const cells = [];
            for (let i = 0; i < k - 1; i++) cells.push([i, k - 1]);
            cells.push([k - 1, k - 1]);
            for (let j = k - 2; j >= 0; j--) cells.push([k - 1, j]);
            const rowX = 180 - ((2 * k - 1) * s) / 2, rowY = 190;
            const rects = cells.map((c, i) => el('rect', { x: rowX + i * s + 1, y: rowY, width: s - 2, height: s - 2, rx: 2, class: COL[(k - 1) % COL.length], opacity: 0 }, api.svg));
            layers.push({ cells, rects, rowX, rowY });
          }
        },
        async play() {
          api.say('<b>1, 3, 5, 7, 9 …</b> sind die ungeraden Zahlen. Was passiert, wenn man sie nacheinander addiert?');
          await api.wait(3200);
          const { s, x0, y0 } = G;
          let sum = 0;
          for (let k = 1; k <= n; k++) {
            const L = layers[k - 1];
            const odd = 2 * k - 1;
            api.say(`Neu dazu: <b>${odd}</b> Kästchen in einer Reihe …`);
            await api.tw(350, (t) => L.rects.forEach((r) => r.setAttribute('opacity', t)));
            await api.wait(k < 3 ? 900 : 400);
            await api.tw(k < 4 ? 1100 : 750, (t) => L.rects.forEach((r, i) => {
              const [cx, cy] = L.cells[i];
              r.setAttribute('x', lerp(L.rowX + i * s, x0 + cx * s, t) + 1);
              r.setAttribute('y', lerp(L.rowY, y0 + cy * s, t) + 1);
            }));
            sum += odd;
            const terms = Array.from({ length: k }, (_, i) => 2 * i + 1);
            api.say(`${terms.length > 5 ? '1 + 3 + 5 + … + ' + odd : terms.join(' + ')} = <b>${sum}</b> = ${k} · ${k} = <b>${k}²</b>`);
            await api.wait(k < 4 ? 2400 : 1600);
          }
          api.say(`Jede ungerade Zahl ist ein <b>Winkel</b>, der das Quadrat um eins größer macht. Darum gilt immer:<br><span class="exbig f1">1 + 3 + 5 + … = Quadratzahl</span>`);
        },
      };
    },
  });

  // =====================================================
  // 1/2 + 1/4 + 1/8 + … = 1
  // =====================================================
  reg('halves', {
    title: 'Unendlich viele Brüche ergeben 1',
    viewBox: '0 0 360 225',
    discover: { icon: '½', q: 'Kann man unendlich viele Zahlen addieren und trotzdem nur 1 erhalten?', tag: 'Klasse 5 · Brüche' },
    create(api) {
      const S = 205, X = 78, Y = 10;
      const COL = ['k-blue', 'k-yel', 'k-green', 'k-red', 'k-purple', 'k-orange'];
      return {
        reset() {
          api.clear();
          el('rect', { x: X, y: Y, width: S, height: S, class: 'k-frame' }, api.svg);
        },
        async play() {
          api.say('Das ganze Quadrat ist <b>1</b>. Wir färben die Hälfte …');
          await api.wait(2400);
          let x = X, y = Y, w = S, h = S;
          const terms = [];
          for (let i = 0; i < 13; i++) {
            let p;
            if (i % 2 === 0) { p = [x, y, w / 2, h]; x += w / 2; w /= 2; }
            else { p = [x, y + h / 2, w, h / 2]; h /= 2; }
            const g = el('g', { opacity: 0 }, api.svg);
            el('rect', { x: p[0] + 1, y: p[1] + 1, width: Math.max(0.5, p[2] - 2), height: Math.max(0.5, p[3] - 2), rx: 2, class: COL[i % COL.length] }, g);
            const d = 2 ** (i + 1);
            const fs = Math.min(p[2], p[3]) * 0.32;
            if (fs >= 9) el('text', { x: p[0] + p[2] / 2, y: p[1] + p[3] / 2 + fs * 0.35, class: 'k-on', 'text-anchor': 'middle', 'font-size': fs.toFixed(1), text: `1/${d}` }, g);
            await api.tw(i < 4 ? 700 : 300, (t) => g.setAttribute('opacity', t));
            terms.push(fr(1, d));
            const shown = terms.length > 4 ? terms.slice(0, 3).join(' + ') + ' + … + ' + terms[terms.length - 1] : terms.join(' + ');
            api.say(`${shown} = ${fr(d - 1, d)}<br>Es fehlt nur noch ${fr(1, d)} – davon nehmen wir wieder die Hälfte …`);
            await api.wait(i < 4 ? 2400 : i < 7 ? 1100 : 500);
          }
          api.say(`Der Rest wird immer kleiner. Macht man <b>unendlich</b> weiter, bleibt nichts übrig:<br><span class="exbig f1">${fr(1, 2)} + ${fr(1, 4)} + ${fr(1, 8)} + … = 1</span><br><small>Unendlich viele Zahlen – und zusammen genau 1!</small>`);
        },
      };
    },
  });

  // =====================================================
  // Das Sieb des Eratosthenes
  // =====================================================
  reg('sieve', {
    title: 'Das Sieb des Eratosthenes',
    viewBox: '0 0 360 312',
    discover: { icon: '⁂', q: 'Wie fängt man alle Primzahlen bis 100 mit einem Sieb?', tag: 'Klasse 5 · Primzahlen' },
    create(api) {
      let cells;
      const s = 30, x0 = 30, y0 = 6;
      return {
        reset() {
          api.clear(); cells = {};
          for (let v = 1; v <= 100; v++) {
            const c = (v - 1) % 10, r = Math.floor((v - 1) / 10);
            const g = el('g', {}, api.svg);
            const rect = el('rect', { x: x0 + c * s + 1.5, y: y0 + r * s + 1.5, width: s - 3, height: s - 3, rx: 5, class: 'k-cell' }, g);
            const text = el('text', { x: x0 + c * s + s / 2, y: y0 + r * s + s / 2 + 5, class: 'k-num', 'text-anchor': 'middle', text: v }, g);
            cells[v] = { g, rect, text, out: false };
          }
        },
        async play() {
          const out = (v, cls) => { const c = cells[v]; if (c.out) return; c.out = true; c.rect.setAttribute('class', 'k-cell ' + cls); c.text.setAttribute('opacity', 0.35); };
          api.say('Alle Zahlen von <b>1 bis 100</b>. Wir sieben die Primzahlen heraus – Schritt für Schritt.');
          await api.wait(2600);
          api.say('Die <b>1</b> ist keine Primzahl: Sie hat nur einen einzigen Teiler.');
          out(1, 'x0');
          await api.wait(2000);
          const COLS = { 2: 'x2', 3: 'x3', 5: 'x5', 7: 'x7' };
          for (const p of [2, 3, 5, 7]) {
            cells[p].rect.setAttribute('class', 'k-cell pr ' + COLS[p]);
            api.say(`Die <b>${p}</b> ist eine Primzahl – sie bleibt.<br>Aber alle Vielfachen von ${p} (${2 * p}, ${3 * p}, ${4 * p} …) sind durch ${p} teilbar: <b>raus damit!</b>`);
            await api.wait(2600);
            for (let m = 2 * p; m <= 100; m += p) {
              if (!cells[m].out) { out(m, COLS[p]); await api.wait(p === 2 ? 45 : 90); }
            }
            await api.wait(1200);
          }
          api.say('Und die 11? <b>11 · 11 = 121</b> ist schon größer als 100. Alle kleineren Vielfachen von 11 (22, 33, …) sind längst weg!');
          await api.wait(3800);
          let count = 0;
          for (let v = 2; v <= 100; v++) if (!cells[v].out || [2, 3, 5, 7].includes(v)) { cells[v].rect.setAttribute('class', 'k-cell pr glow'); count++; }
          api.say(`Übrig bleiben genau die <b>${count} Primzahlen</b> bis 100.<br><small>Diesen Trick hat sich der Grieche Eratosthenes vor über 2000 Jahren ausgedacht.</small>`);
        },
      };
    },
  });

  // =====================================================
  // Reis auf dem Schachbrett – die Macht des Verdoppelns
  // =====================================================
  reg('chess', {
    title: 'Reis auf dem Schachbrett',
    viewBox: '0 0 360 272',
    discover: { icon: '♜', q: 'Wie viel Reis passt aufs Schachbrett, wenn man jedes Feld verdoppelt?', tag: 'Klasse 5 · Potenzen' },
    create(api) {
      let cells;
      const s = 32, x0 = 52, y0 = 6;
      const big = (k) => (2n ** BigInt(k - 1)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
      return {
        reset() {
          api.clear(); cells = [];
          for (let k = 1; k <= 64; k++) {
            const c = (k - 1) % 8, r = Math.floor((k - 1) / 8);
            cells.push(el('rect', { x: x0 + c * s, y: y0 + r * s, width: s, height: s, class: (c + r) % 2 ? 'k-sq1' : 'k-sq0' }, api.svg));
          }
          el('rect', { x: x0, y: y0, width: 8 * s, height: 8 * s, class: 'k-frame' }, api.svg);
        },
        async play() {
          api.say('Eine alte Legende: Der Erfinder des Schachspiels wünschte sich vom König <b>Reis</b>. 1 Korn aufs erste Feld, 2 aufs zweite, 4 aufs dritte – <b>immer doppelt so viele</b>.');
          await api.wait(5000);
          api.say('Der König lachte: „So wenig?“ Schauen wir mal …');
          await api.wait(2200);
          const notes = {
            11: 'Feld 11: <b>1 024</b> Körner – eine Handvoll.',
            21: 'Feld 21: über <b>1 Million</b> Körner – ein schwerer Sack, etwa 25 kg!',
            31: 'Feld 31: über <b>1 Milliarde</b> Körner – ein ganzer Lastwagen voll.',
            41: 'Feld 41: über <b>1 Billion</b> Körner – ein riesiges Frachtschiff voll.',
          };
          for (let k = 1; k <= 64; k++) {
            const c = (k - 1) % 8, r = Math.floor((k - 1) / 8);
            const x = x0 + c * s, y = y0 + r * s;
            const g = el('g', { opacity: 0 }, api.svg);
            const heat = Math.min(1, (k - 1) / 63);
            el('rect', { x: x + 1, y: y + 1, width: s - 2, height: s - 2, rx: 3, fill: `hsl(${48 - heat * 40}, 100%, ${30 + heat * 32}%)`, 'fill-opacity': 0.35 + heat * 0.6 }, g);
            if (k <= 6) {
              const nGr = 2 ** (k - 1), per = Math.ceil(Math.sqrt(nGr)), d = (s - 6) / per;
              for (let i = 0; i < nGr; i++) el('ellipse', { cx: x + 3 + d * ((i % per) + 0.5), cy: y + 3 + d * (Math.floor(i / per) + 0.5), rx: Math.max(1, d * 0.32), ry: Math.max(0.7, d * 0.2), class: 'k-grain' }, g);
            } else if (k <= 20) {
              const txt = String(2 ** (k - 1));
              el('text', { x: x + s / 2, y: y + s / 2 + 3, 'font-size': txt.length > 5 ? 7 : txt.length > 3 ? 8.5 : 11, class: 'k-on', 'text-anchor': 'middle', text: txt }, g);
            }
            await api.tw(k <= 6 ? 500 : k <= 20 ? 220 : 90, (t) => g.setAttribute('opacity', t));
            if (k <= 8) api.say(`Feld ${k}: <b>${big(k)}</b> Korn${k > 1 ? 'körner' : ''}`.replace('Kornkörner', 'Körner'));
            else if (notes[k]) { api.say(notes[k]); await api.wait(2600); }
            else if (k > 41) api.say(`Feld ${k}: <b>${big(k)}</b> Körner`);
            if (k <= 8) await api.wait(700);
          }
          api.say(`Auf dem <b>letzten Feld</b> lägen <b>${big(64)}</b> Körner – über 9 Trillionen!<br>Das ist mehr Reis, als die ganze Welt in <b>vielen hundert Jahren</b> erntet. So mächtig ist Verdoppeln: <b>2<sup>63</sup></b>`);
        },
      };
    },
  });

  // =====================================================
  // Winkelsumme im Dreieck
  // =====================================================
  reg('triangle', {
    title: 'Warum hat jedes Dreieck 180°?',
    viewBox: '0 0 360 238',
    discover: { icon: '△', q: 'Warum ergeben die drei Winkel jedes Dreiecks zusammen 180°?', tag: 'Vorschau Klasse 6' },
    create(api) {
      let V, pieces;
      const pick3 = () => { V = [{ x: R(30, 70), y: 140 }, { x: R(290, 330), y: 140 }, { x: R(100, 260), y: R(12, 34) }]; };
      pick3();
      api.chips([{ label: 'Anderes Dreieck', onClick() { pick3(); api.replay(); } }]);
      const dir = (P, Q) => (Math.atan2(-(Q.y - P.y), Q.x - P.x) * 180) / Math.PI;
      const COLS = ['k-wblue', 'k-wyel', 'k-wgreen'], NAMES = ['α', 'β', 'γ'], LC = ['k-lblue', 'k-lyel', 'k-lgreen'];
      return {
        reset() {
          api.clear();
          pieces = V.map((P, i) => {
            const A = V[(i + 1) % 3], B = V[(i + 2) % 3];
            let a0 = dir(P, A), a1 = dir(P, B), d = (a1 - a0 + 360) % 360;
            if (d > 180) { a0 = a1; d = 360 - d; }
            return { P, a0, d };
          });
          el('polygon', { points: pts(V.map((p) => [p.x, p.y])), class: 'k-tri', opacity: 0 }, api.svg).id = 'tri';
          pieces.forEach((pc, i) => {
            pc.g = el('g', { opacity: 0 }, api.svg);
            el('path', { d: arcD(pc.P.x, pc.P.y, 42, pc.a0, pc.a0 + pc.d, true), class: COLS[i] }, pc.g);
            const lp = pt(pc.P.x, pc.P.y, 27, pc.a0 + pc.d / 2);
            pc.lp = lp;
            pc.lab = el('text', { x: lp[0], y: lp[1] + 5, class: LC[i], 'text-anchor': 'middle', text: NAMES[i] }, pc.g);
          });
        },
        async play() {
          const tri = api.svg.querySelector('#tri');
          const deg = pieces.map((p) => Math.round(p.d));
          deg[2] = 180 - deg[0] - deg[1];
          api.say('Ein Dreieck mit drei Winkeln: <b class="kb">α</b>, <b class="ky">β</b> und <b class="kg">γ</b>.');
          await api.tw(600, (t) => tri.setAttribute('opacity', t));
          for (const pc of pieces) await api.tw(400, (t) => pc.g.setAttribute('opacity', t));
          await api.wait(2400);
          api.say('Wir „reißen“ die drei Ecken ab und legen sie an einer geraden Linie nebeneinander …');
          const T = { x: 180, y: 226 };
          const line = el('line', { x1: 180, y1: T.y, x2: 180, y2: T.y, class: 'k-line' }, api.svg);
          await api.tw(700, (t) => { line.setAttribute('x1', 180 - 140 * t); line.setAttribute('x2', 180 + 140 * t); });
          let start = 0;
          for (const pc of pieces) {
            const rot = norm(start - pc.a0), dx = T.x - pc.P.x, dy = T.y - pc.P.y;
            await api.tw(1500, (t) => {
              pc.g.setAttribute('transform', `translate(${dx * t},${dy * t}) rotate(${-rot * t} ${pc.P.x} ${pc.P.y})`);
              pc.lab.setAttribute('transform', `rotate(${rot * t} ${pc.lp[0]} ${pc.lp[1]})`);
            });
            start += pc.d;
            await api.wait(500);
          }
          api.say(`Die drei Ecken füllen genau eine <b>gerade Linie</b> – einen gestreckten Winkel!<br><span class="exbig f1">${deg[0]}° + ${deg[1]}° + ${deg[2]}° = 180°</span><br><small>Probier ein anderes Dreieck: Es klappt immer.</small>`);
        },
      };
    },
  });

  // =====================================================
  // Die Sonnenblume und der goldene Winkel
  // =====================================================
  reg('sunflower', {
    title: 'Das Geheimnis der Sonnenblume',
    viewBox: '0 0 360 300',
    discover: { icon: '✿', q: 'Welche Mathematik steckt in einer Sonnenblume?', tag: 'Mathe in der Natur' },
    create(api) {
      const N = 340, cx = 180, cy = 150, c = 7.4;
      let seeds = [], theta = 137.5, count = 0;
      function draw() {
        seeds.forEach((sd, i) => {
          if (i >= count) { sd.setAttribute('opacity', 0); return; }
          const a = (i * theta * Math.PI) / 180, r = c * Math.sqrt(i);
          sd.setAttribute('cx', (cx + r * Math.cos(a)).toFixed(1));
          sd.setAttribute('cy', (cy - r * Math.sin(a)).toFixed(1));
          sd.setAttribute('opacity', 1);
        });
      }
      const angTxt = () => `${theta.toFixed(1).replace('.', ',')}°`;
      const sl = api.slider({ label: 'Drehwinkel pro Kern', min: 900, max: 1800, value: 1375, onInput(v) {
        theta = v / 10; count = N; draw();
        api.say(`Drehwinkel: <b>${angTxt()}</b>${Math.abs(theta - 137.5) < 0.15 ? ' – der goldene Winkel: perfekt dicht!' : ''}`);
      } });
      return {
        reset() {
          api.clear(); seeds = [];
          for (let i = 0; i < N; i++) seeds.push(el('circle', { r: (2 + (i / N) * 2.6).toFixed(2), fill: `hsl(${44 - (i / N) * 26}, 100%, ${62 - (i / N) * 10}%)`, opacity: 0 }, api.svg));
          theta = 137.5; sl.value = 1375; count = 0; draw();
        },
        async play() {
          api.say('Eine Sonnenblume setzt jeden neuen Kern ein Stück <b>weitergedreht</b> neben den vorigen – immer um denselben Winkel.');
          await api.wait(3000);
          await api.tw(5000, (t) => { count = Math.round(t * N); draw(); }, (t) => t);
          api.say('Bei <b>137,5°</b> (dem „goldenen Winkel“) liegen die Kerne perfekt dicht – ohne Lücken. So passen die meisten Kerne hinein!');
          await api.wait(4000);
          api.say('Was wäre bei einem anderen Winkel? Wir drehen ein bisschen …');
          const sweep = (a, b, ms) => api.tw(ms, (t) => { theta = lerp(a, b, t); sl.value = Math.round(theta * 10); draw(); });
          await sweep(137.5, 135, 2500);
          api.say('<b>135°</b>: Plötzlich entstehen gerade Strahlen mit großen Lücken – Platzverschwendung!');
          await api.wait(3200);
          await sweep(135, 120, 2500);
          api.say('<b>120°</b> ist genau ⅓ Umdrehung: nur noch drei Arme!');
          await api.wait(3000);
          await sweep(120, 137.5, 3000);
          api.say('Zurück beim goldenen Winkel. Zählst du die Spiralen einer echten Sonnenblume, findest du oft <b>34</b> und <b>55</b> – <b>Fibonacci-Zahlen</b> (1, 1, 2, 3, 5, 8, 13, 21, 34, 55 …).<br><small>Probier den Regler aus!</small>');
        },
      };
    },
  });

  // =====================================================
  // Kreisfläche: aus der Pizza wird ein Rechteck
  // =====================================================
  reg('pizza', {
    title: 'Aus der Pizza wird ein Rechteck',
    viewBox: '0 0 360 232',
    discover: { icon: '◔', q: 'Warum ist die Fläche eines Kreises π · r²?', tag: 'Vorschau Klasse 9' },
    create(api) {
      let N = 16, secs;
      const r = 55, C = { x: 180, y: 76 }, Ybot = 214;
      api.chips([8, 16, 32].map((k) => ({ label: `${k} Stücke`, onClick() { N = k; api.replay(); } })));
      return {
        reset() {
          api.clear(); secs = [];
          const w = 360 / N;
          for (let i = 0; i < N; i++) {
            const mid = (i + 0.5) * w, upper = mid < 180;
            const g = el('g', {}, api.svg);
            el('path', { d: arcD(C.x, C.y, r, i * w, (i + 1) * w, true), class: upper ? 'k-pz1' : 'k-pz2' }, g);
            secs.push({ g, mid, upper });
          }
          const rad = el('g', { id: 'rad' }, api.svg);
          el('line', { x1: C.x, y1: C.y, x2: C.x + r, y2: C.y, class: 'k-line2' }, rad);
          el('text', { x: C.x + r / 2, y: C.y - 6, class: 'k-txt', 'text-anchor': 'middle', text: 'r' }, rad);
        },
        async play() {
          api.say(`Wie groß ist die Fläche eines Kreises mit Radius <b>r</b>? Wir schneiden ihn wie eine Pizza in <b>${N} Stücke</b>.`);
          await api.wait(3200);
          api.say('Der Rand ist zusammen π · 2 · r lang. Die <b class="kb">obere Hälfte</b> und die <b class="ky">untere Hälfte</b> haben je <b>π · r</b> Rand.');
          await api.wait(3800);
          api.svg.querySelector('#rad').setAttribute('opacity', 0);
          api.say('Jetzt legen wir die Stücke abwechselnd nebeneinander: unten nach oben, oben nach unten …');
          const L = (2 * Math.PI * r) / N, X0 = 180 - (Math.PI * r) / 2 - L / 4;
          const lo = secs.filter((s) => !s.upper).sort((a, b) => b.mid - a.mid);
          const up = secs.filter((s) => s.upper).sort((a, b) => a.mid - b.mid);
          const targets = [];
          lo.forEach((s, k) => targets.push({ s, x: X0 + (k + 0.5) * L, y: Ybot - r, rot: norm(-90 - s.mid) }));
          up.forEach((s, k) => targets.push({ s, x: X0 + (k + 1) * L, y: Ybot, rot: norm(90 - s.mid) }));
          const spread = 1.2;
          await api.tw(4200, (t) => targets.forEach((tg, i) => {
            const lt = clamp(t * (1 + spread) - (i / targets.length) * spread);
            const e = lt < 0.5 ? 2 * lt * lt : 1 - Math.pow(-2 * lt + 2, 2) / 2;
            tg.s.g.setAttribute('transform', `translate(${(tg.x - C.x) * e},${(tg.y - C.y) * e}) rotate(${-tg.rot * e} ${C.x} ${C.y})`);
          }), (t) => t);
          const W = Math.PI * r, xl = X0 + L / 4;
          const box = el('g', { opacity: 0 }, api.svg);
          el('rect', { x: xl, y: Ybot - r, width: W, height: r, class: 'k-dash' }, box);
          el('text', { x: xl + W / 2, y: Ybot - r - 8, class: 'k-txt', 'text-anchor': 'middle', text: 'π · r  (halber Rand)' }, box);
          el('text', { x: xl - 8, y: Ybot - r / 2 + 5, class: 'k-txt', 'text-anchor': 'end', text: 'r' }, box);
          await api.tw(600, (t) => box.setAttribute('opacity', t));
          api.say(`Fast ein <b>Rechteck</b>! Breite: π · r, Höhe: r.<br><span class="exbig f1">A = π · r · r = π · r²</span><br><small>${N < 32 ? 'Mit mehr Stücken wird es immer genauer ein Rechteck – probier 32!' : 'Je mehr Stücke, desto genauer: Bei unendlich vielen ist es exakt ein Rechteck.'}</small>`);
        },
      };
    },
  });

  // =====================================================
  // Satz des Pythagoras – Umlegebeweis
  // =====================================================
  reg('pythagoras', {
    title: 'Der Satz des Pythagoras',
    viewBox: '0 0 360 205',
    discover: { icon: 'c²', q: 'Der berühmteste Satz der Mathematik – in einem Bild bewiesen', tag: 'Vorschau Klasse 9' },
    create(api) {
      const a = 62, b = 104, S = a + b, x0 = 97, y0 = 22;
      const P = (x, y) => ({ x: x0 + x, y: y0 + y });
      // Dreiecke: R = rechter Winkel, A = Ende der Kathete a, B = Ende der Kathete b
      const T = [
        { R: P(0, 0), A: P(a, 0), B: P(0, b) },
        { R: P(S, 0), A: P(S, a), B: P(a, 0) },
        { R: P(S, S), A: P(b, S), B: P(S, a) },
        { R: P(0, S), A: P(0, b), B: P(b, S) },
      ];
      const Utgt = [
        { R: P(0, a), A: P(a, a), B: P(0, S) },
        { R: P(S, 0), A: P(S, a), B: P(a, 0) },
        { R: P(a, a), A: P(a, 0), B: P(S, a) },
        { R: P(a, S), A: P(0, S), B: P(a, a) },
      ];
      const ang = (p, q) => (Math.atan2(q.y - p.y, q.x - p.x) * 180) / Math.PI;
      let tris, cSq, aSq, bSq;
      return {
        reset() {
          api.clear();
          el('rect', { x: x0, y: y0, width: S, height: S, class: 'k-frame' }, api.svg);
          cSq = el('g', { opacity: 0 }, api.svg);
          el('polygon', { points: pts([[x0 + a, y0], [x0 + S, y0 + a], [x0 + b, y0 + S], [x0, y0 + b]]), class: 'k-sqc' }, cSq);
          el('text', { x: x0 + S / 2, y: y0 + S / 2 + 8, class: 'k-big', 'text-anchor': 'middle', text: 'c²' }, cSq);
          aSq = el('g', { opacity: 0 }, api.svg);
          el('rect', { x: x0, y: y0, width: a, height: a, class: 'k-sqa' }, aSq);
          el('text', { x: x0 + a / 2, y: y0 + a / 2 + 8, class: 'k-big', 'text-anchor': 'middle', text: 'a²' }, aSq);
          bSq = el('g', { opacity: 0 }, api.svg);
          el('rect', { x: x0 + a, y: y0 + a, width: b, height: b, class: 'k-sqb' }, bSq);
          el('text', { x: x0 + a + b / 2, y: y0 + a + b / 2 + 8, class: 'k-big', 'text-anchor': 'middle', text: 'b²' }, bSq);
          tris = T.map((t) => {
            const g = el('g', { opacity: 0 }, api.svg);
            el('polygon', { points: pts([[t.R.x, t.R.y], [t.A.x, t.A.y], [t.B.x, t.B.y]]), class: 'k-trip' }, g);
            return g;
          });
          const lab = el('g', { id: 'lab', opacity: 0 }, api.svg);
          el('text', { x: x0 + a / 2, y: y0 - 6, class: 'k-txt', 'text-anchor': 'middle', text: 'a' }, lab);
          el('text', { x: x0 + a + b / 2, y: y0 - 6, class: 'k-txt', 'text-anchor': 'middle', text: 'b' }, lab);
          el('text', { x: x0 - 8, y: y0 + b / 2 + 5, class: 'k-txt', 'text-anchor': 'end', text: 'b' }, lab);
          el('text', { x: x0 - 8, y: y0 + b + a / 2 + 5, class: 'k-txt', 'text-anchor': 'end', text: 'a' }, lab);
          const cl = pt(x0 + a / 2, y0 + b / 2, 0, 0);
          el('text', { x: cl[0] + 10, y: cl[1] + 4, class: 'k-txt', text: 'c' }, lab);
        },
        async play() {
          api.say('Ein <b>rechtwinkliges Dreieck</b>: zwei kurze Seiten <b>a</b> und <b>b</b>, die lange Seite heißt <b>c</b>.');
          await api.tw(600, (t) => { tris[0].setAttribute('opacity', t); api.svg.querySelector('#lab').setAttribute('opacity', t); });
          await api.wait(3000);
          api.say('Wir legen <b>vier gleiche Dreiecke</b> in ein großes Quadrat mit der Seite a + b …');
          for (let i = 1; i < 4; i++) await api.tw(500, (t) => tris[i].setAttribute('opacity', t));
          await api.wait(1000);
          api.svg.querySelector('#lab').setAttribute('opacity', 0);
          await api.tw(700, (t) => cSq.setAttribute('opacity', t));
          api.say('In der Mitte bleibt ein <b class="ky">schräges Quadrat</b> frei. Seine Seiten sind alle c lang – seine Fläche ist <b>c²</b>.');
          await api.wait(4000);
          api.say('Jetzt schieben wir drei Dreiecke um. Das große Quadrat bleibt gleich groß …');
          await api.tw(500, (t) => cSq.setAttribute('opacity', 1 - t));
          for (const i of [0, 3, 2]) {
            const s = T[i], u = Utgt[i];
            const th = norm(ang(u.R, u.A) - ang(s.R, s.A));
            await api.tw(1500, (t) => {
              const rx = lerp(s.R.x, u.R.x, t), ry = lerp(s.R.y, u.R.y, t);
              tris[i].setAttribute('transform', `translate(${rx},${ry}) rotate(${th * t}) translate(${-s.R.x},${-s.R.y})`);
            });
            await api.wait(300);
          }
          await api.tw(800, (t) => { aSq.setAttribute('opacity', t); bSq.setAttribute('opacity', t); });
          api.say('Jetzt sind <b>zwei Quadrate</b> frei: <b class="kg">a²</b> und <b class="kr">b²</b>.');
          await api.wait(3500);
          api.say('Die vier Dreiecke bedecken vorher und nachher gleich viel. Also ist auch der freie Platz gleich groß:<br><span class="exbig f1">a² + b² = c²</span><br><small>Das ist der Satz des Pythagoras – über 2500 Jahre alt.</small>');
        },
      };
    },
  });

  // =====================================================
  // Gedankenlesen mit 5 Karten – Binärzahlen
  // =====================================================
  reg('mindread', {
    title: 'Ich kann Gedanken lesen!',
    viewBox: '0 0 360 262',
    discover: { icon: '🔮', q: 'Denk dir eine Zahl – kann die App sie erraten?', tag: 'Zahlenzauber · Binärzahlen' },
    create(api) {
      let answer = null, waiting = false, yes = [], thumbs = [];
      const VAL = [16, 8, 4, 2, 1];
      const cardNums = (k) => Array.from({ length: 31 }, (_, i) => i + 1).filter((v) => v & (1 << k));
      const chips = api.chips([
        { label: '✓ Ja, steht drauf', onClick() { if (waiting) answer = true; } },
        { label: '✗ Nein', onClick() { if (waiting) answer = false; } },
      ]);
      const btns = [...chips.querySelectorAll('button')];
      btns.forEach((b) => b.classList.add('exchip-big'));
      const setAsk = (on) => { waiting = on; btns.forEach((b) => (b.disabled = !on)); chips.classList.toggle('asking', on); };
      setAsk(false);
      async function ask() {
        answer = null; setAsk(true);
        while (answer === null) await api.wait(80);
        setAsk(false);
        return answer;
      }
      function card(k, x, y, w, h) {
        const g = el('g', { opacity: 0 }, api.svg);
        el('rect', { x, y, width: w, height: h, rx: 12, class: 'k-card' }, g);
        el('text', { x: x + w / 2, y: y + 20, class: 'k-dim', 'text-anchor': 'middle', 'font-size': 11, text: `KARTE ${k + 1}` }, g);
        cardNums(k).forEach((v, i) => {
          el('text', { x: x + w / 2 + ((i % 4) - 1.5) * (w / 4.6), y: y + 46 + Math.floor(i / 4) * ((h - 56) / 4), class: i === 0 ? 'k-cardnum first' : 'k-cardnum', 'text-anchor': 'middle', text: v }, g);
        });
        return g;
      }
      return {
        reset() {
          api.clear(); yes = []; thumbs = []; setAsk(false);
          for (let k = 0; k < 5; k++) {
            const g = el('g', {}, api.svg);
            el('rect', { x: 22 + k * 64, y: 6, width: 56, height: 30, rx: 7, class: 'k-thumb' }, g);
            thumbs.push(el('text', { x: 50 + k * 64, y: 26, class: 'k-dim', 'text-anchor': 'middle', 'font-size': 12, text: `Karte ${k + 1}` }, g));
          }
        },
        async play() {
          api.say('Denk dir eine Zahl von <b>1 bis 31</b> – aber verrate sie nicht!<br>Ich zeige dir 5 Karten. Sag mir nur, ob deine Zahl darauf steht.');
          await api.wait(4200);
          for (let k = 0; k < 5; k++) {
            const c = card(k, 70, 48, 220, 200);
            await api.tw(400, (t) => { c.setAttribute('opacity', t); c.setAttribute('transform', `translate(${(1 - t) * 30},0)`); });
            api.say(`<b>Karte ${k + 1}:</b> Steht deine Zahl auf dieser Karte?`);
            const a = await ask();
            yes.push(a);
            thumbs[k].textContent = a ? '✓' : '✗';
            thumbs[k].setAttribute('class', a ? 'k-ok' : 'k-no');
            thumbs[k].setAttribute('font-size', 18);
            await api.tw(300, (t) => c.setAttribute('opacity', 1 - t));
            c.remove();
          }
          const n = yes.reduce((s, a, k) => s + (a ? 1 << k : 0), 0);
          if (!n) { api.say('Bei keiner Karte? Dann hast du an die <b>0</b> gedacht – die war nicht erlaubt! 😉 Probier es nochmal.'); return; }
          api.say('Ich konzentriere mich …');
          await api.wait(1600);
          const big = el('text', { x: 180, y: 140, class: 'k-huge', 'text-anchor': 'middle', text: n, opacity: 0 }, api.svg);
          await api.tw(700, (t) => { big.setAttribute('opacity', t); big.setAttribute('transform', `translate(180,140) scale(${0.6 + 0.4 * t}) translate(-180,-140)`); });
          api.say(`Deine Zahl ist <span class="exbig f1">${n}</span>!<br>Wie das geht? Schau genau hin …`);
          await api.wait(4000);
          await api.tw(500, (t) => big.setAttribute('opacity', 1 - t));
          api.say('Die <b>erste Zahl</b> jeder Karte ist 1, 2, 4, 8 oder 16 – immer das Doppelte. Ich addiere einfach die ersten Zahlen der Karten mit <b>„Ja“</b>!');
          const used = [];
          for (let k = 4; k >= 0; k--) {
            const x = 40 + (4 - k) * 64, on = yes[k];
            const g = el('g', { opacity: 0 }, api.svg);
            el('rect', { x, y: 80, width: 56, height: 56, rx: 10, class: on ? 'k-bit on' : 'k-bit' }, g);
            el('text', { x: x + 28, y: 116, class: on ? 'k-bitv on' : 'k-bitv', 'text-anchor': 'middle', text: VAL[4 - k] }, g);
            el('text', { x: x + 28, y: 170, class: on ? 'k-big1' : 'k-big0', 'text-anchor': 'middle', text: on ? '1' : '0' }, g);
            el('text', { x: x + 28, y: 190, class: 'k-dim', 'text-anchor': 'middle', text: on ? 'Ja' : 'Nein' }, g);
            await api.tw(350, (t) => g.setAttribute('opacity', t));
            if (on) used.push(1 << k);
          }
          api.say(`${n} = <b>${used.join(' + ')}</b><br>Jede Zahl bis 31 lässt sich auf genau eine Art aus 16, 8, 4, 2 und 1 zusammensetzen – wie mit Münzen.`);
          await api.wait(5000);
          const bin = yes.slice().reverse().map((a) => (a ? 1 : 0)).join('');
          const bt = el('text', { x: 180, y: 232, class: 'k-txt', 'text-anchor': 'middle', 'font-size': 20, text: `${n} = ${bin} (binär)`, opacity: 0 }, api.svg);
          await api.tw(500, (t) => bt.setAttribute('opacity', t));
          api.say(`Schreibt man <b>1 für Ja</b> und <b>0 für Nein</b>, erhält man <b>${bin}</b>. Das ist die <b>Binärzahl</b> von ${n}.<br><small>Genau so speichern Computer und Handys alle Zahlen – nur mit 0 und 1! Probier den Trick an deinen Eltern aus.</small>`);
        },
      };
    },
  });

  // =====================================================
  // Galton-Brett – Zufall erzeugt Ordnung
  // =====================================================
  reg('galton', {
    title: 'Das Galton-Brett',
    viewBox: '0 0 360 312',
    discover: { icon: '⋰', q: 'Kann reiner Zufall ein ordentliches Muster erzeugen?', tag: 'Zufall · Vorschau Klasse 8' },
    create(api) {
      const ROWS = 10, dx = 27, dy = 16, top = 34, cx = 180, base = 302, H = 96;
      let counts, bars, total, layer;
      const pegX = (i, j) => cx + (j - i / 2) * dx;
      const binX = (k) => cx + (k - ROWS / 2) * dx;
      const binom = (n, k) => { let r = 1; for (let i = 1; i <= k; i++) r = (r * (n - k + i)) / i; return r; };
      function drawBars() {
        const mx = Math.max(12, ...counts);
        bars.forEach((b, k) => { const h = (counts[k] / mx) * H; b.setAttribute('y', base - h); b.setAttribute('height', h); });
      }
      function path() {
        const p = [[cx, top - 22]]; let k = 0;
        for (let i = 0; i < ROWS; i++) { p.push([pegX(i, k), top + i * dy - 6]); if (Math.random() < 0.5) k++; }
        p.push([binX(k), top + ROWS * dy + 4]); p.push([binX(k), base - 4]);
        return { p, k };
      }
      const posAt = (p, t) => {
        const f = t * (p.length - 1), i = Math.min(p.length - 2, Math.floor(f)), u = f - i;
        return [lerp(p[i][0], p[i + 1][0], u), lerp(p[i][1], p[i + 1][1], u) - (i > 0 && i < p.length - 2 ? Math.sin(u * Math.PI) * 5 : 0)];
      };
      async function drop(ms, trail) {
        const { p, k } = path();
        const ball = el('circle', { r: 4, class: 'k-ball' }, layer);
        let tr = null;
        if (trail) tr = el('polyline', { class: 'k-trail', points: '' }, layer);
        const seen = [];
        await api.tw(ms, (t) => {
          const [x, y] = posAt(p, t);
          ball.setAttribute('cx', x); ball.setAttribute('cy', y);
          if (tr) { seen.push(`${x.toFixed(1)},${y.toFixed(1)}`); tr.setAttribute('points', seen.join(' ')); }
        }, (t) => t);
        ball.remove();
        if (tr) setTimeout(() => tr.remove(), 900);
        counts[k]++; total++; drawBars();
        return k;
      }
      return {
        reset() {
          api.clear(); counts = Array(ROWS + 1).fill(0); total = 0;
          for (let i = 0; i < ROWS; i++) for (let j = 0; j <= i; j++) el('circle', { cx: pegX(i, j), cy: top + i * dy, r: 2.6, class: 'k-peg' }, api.svg);
          for (let k = 0; k <= ROWS + 1; k++) el('line', { x1: binX(k) - dx / 2, y1: base - H - 4, x2: binX(k) - dx / 2, y2: base, class: 'k-binline' }, api.svg);
          el('line', { x1: binX(0) - dx / 2, y1: base, x2: binX(ROWS) + dx / 2, y2: base, class: 'k-line' }, api.svg);
          bars = counts.map((_, k) => el('rect', { x: binX(k) - dx / 2 + 2, y: base, width: dx - 4, height: 0, rx: 2, class: 'k-bar' }, api.svg));
          layer = el('g', {}, api.svg);
        },
        async play() {
          api.say('Kugeln fallen durch <b>10 Reihen Nägel</b>. An jedem Nagel springt die Kugel zufällig nach <b>links oder rechts</b> – wie bei einem Münzwurf.');
          await api.wait(3800);
          for (let i = 0; i < 5; i++) {
            const k = await drop(2600, true);
            api.say(`Diese Kugel ist ${k}-mal nach rechts und ${ROWS - k}-mal nach links gesprungen → Fach ${k + 1}.`);
            await api.wait(600);
          }
          api.say('Niemand kann vorhersagen, wo <b>eine</b> Kugel landet. Aber was passiert bei <b>vielen</b> Kugeln?');
          await api.wait(2600);
          const fly = [];
          for (let i = 0; i < 80; i++) { fly.push(drop(1300, false).catch(() => {})); await api.wait(55); }
          await api.wait(1500);
          api.say('Und jetzt ganz viele …');
          for (let step = 0; step < 40; step++) {
            for (let i = 0; i < 25; i++) { let k = 0; for (let r = 0; r < ROWS; r++) if (Math.random() < 0.5) k++; counts[k]++; total++; }
            drawBars();
            await api.wait(70);
          }
          api.say(`<b>${total} Kugeln</b>: In der Mitte landen die meisten, außen fast keine. Es entsteht eine <b>Glockenkurve</b>!`);
          await api.wait(3500);
          const mx = Math.max(12, ...counts);
          const curve = el('polyline', { class: 'k-curve', opacity: 0, points: counts.map((_, k) => `${binX(k)},${base - ((total * binom(ROWS, k)) / 1024 / mx) * H}`).join(' ') }, api.svg);
          await api.tw(700, (t) => curve.setAttribute('opacity', t));
          api.say('Warum? Ganz außen landet eine Kugel nur, wenn sie <b>10-mal hintereinander</b> gleich springt – dafür gibt es nur <b>1 Weg</b>. In die Mitte führen <b>252 verschiedene Wege</b>!<br><small>Diese Wege zählt das Pascalsche Dreieck – schau es dir an!</small>');
        },
      };
    },
  });

  // =====================================================
  // Pascalsches Dreieck → Sierpinski-Fraktal
  // =====================================================
  reg('pascal', {
    title: 'Das Pascalsche Dreieck',
    viewBox: '0 0 360 300',
    discover: { icon: '▲', q: 'Welches geheime Muster versteckt sich in einem Zahlendreieck?', tag: 'Muster · Fraktale' },
    create(api) {
      let N = 32;
      api.chips([16, 32, 64].map((k) => ({ label: `${k} Reihen`, onClick() { N = k; api.replay(); } })));
      return {
        reset() { api.clear(); },
        async play() {
          const rowsA = 7, sx = 40, sy = 34, ty = 26;
          const C = [];
          const X = (n, k) => 180 + (k - n / 2) * sx, Y = (n) => ty + n * sy;
          const nodes = [];
          api.say('Oben steht eine <b>1</b>. Jede neue Zahl ist die <b>Summe der zwei Zahlen darüber</b>. Am Rand steht immer 1.');
          for (let n = 0; n < rowsA; n++) {
            C[n] = [];
            for (let k = 0; k <= n; k++) {
              C[n][k] = k === 0 || k === n ? 1 : C[n - 1][k - 1] + C[n - 1][k];
              const g = el('g', { opacity: 0 }, api.svg);
              el('circle', { cx: X(n, k), cy: Y(n), r: 15, class: 'k-pc' }, g);
              el('text', { x: X(n, k), y: Y(n) + 5, class: 'k-pn', 'text-anchor': 'middle', text: C[n][k] }, g);
              nodes.push(g);
              if (n >= 2 && k > 0 && k < n && n <= 4) {
                const l1 = el('line', { x1: X(n - 1, k - 1), y1: Y(n - 1) + 15, x2: X(n, k), y2: Y(n) - 15, class: 'k-add' }, api.svg);
                const l2 = el('line', { x1: X(n - 1, k), y1: Y(n - 1) + 15, x2: X(n, k), y2: Y(n) - 15, class: 'k-add' }, api.svg);
                nodes.push(l1, l2);
                api.say(`${C[n - 1][k - 1]} + ${C[n - 1][k]} = <b>${C[n][k]}</b>`);
                await api.tw(500, (t) => g.setAttribute('opacity', t));
                await api.wait(1300);
              } else await api.tw(n < 2 ? 450 : 220, (t) => g.setAttribute('opacity', t));
            }
            if (n === 1) await api.wait(1200);
          }
          api.say('So geht es immer weiter … Jetzt färben wir alle <b class="ky">ungeraden</b> Zahlen gelb ein.');
          await api.wait(2500);
          let idx = 0;
          for (let n = 0; n < rowsA; n++) for (let k = 0; k <= n; k++) {
            while (nodes[idx] && nodes[idx].tagName !== 'g') idx++;
            const circ = nodes[idx].querySelector('circle'); idx++;
            if (C[n][k] % 2) circ.setAttribute('class', 'k-pc odd');
          }
          await api.wait(3500);
          api.say(`Und jetzt machen wir das Dreieck viel größer: <b>${N} Reihen</b> …`);
          await api.tw(700, (t) => nodes.forEach((g) => g.setAttribute('opacity', 1 - t)));
          api.clear();
          const W = 330, sp = W / N, hh = sp * 0.866, r = sp * 0.46, y0 = 12;
          for (let n = 0; n < N; n++) {
            const row = el('g', { opacity: 0 }, api.svg);
            for (let k = 0; k <= n; k++) {
              const odd = (k & n) === k;
              el('circle', { cx: (180 + (k - n / 2) * sp).toFixed(2), cy: (y0 + n * hh + r).toFixed(2), r: r.toFixed(2), class: odd ? 'k-sp odd' : 'k-sp' }, row);
            }
            await api.tw(N > 32 ? 40 : 90, (t) => row.setAttribute('opacity', t));
          }
          api.say('Ein Muster aus <b>Dreiecken in Dreiecken in Dreiecken</b> … So etwas heißt <b>Fraktal</b>. Dieses hier ist das <b>Sierpinski-Dreieck</b>.<br><small>Probier 64 Reihen – das Muster wiederholt sich immer weiter!</small>');
        },
      };
    },
  });

  // =====================================================
  // Wie hoch ist der Baum? – Schatten und ähnliche Dreiecke
  // =====================================================
  reg('tree', {
    title: 'Wie hoch ist der Baum?',
    viewBox: '0 0 360 262',
    discover: { icon: '🌳', q: 'Wie misst man einen Baum, ohne hinaufzuklettern?', tag: 'Mathe in der Welt' },
    create(api) {
      let s, f;
      const pickN = () => { s = U.pick([0.5, 0.6, 0.8, 1, 1.2]); f = R(5, 9); };
      pickN();
      api.chips([{ label: 'Anderer Baum', onClick() { pickN(); api.replay(); } }]);
      const g0 = 238;
      let G;
      return {
        reset() {
          api.clear();
          const k = Math.min(170 / f, 232 / (s * (f + 1)));
          const xt = 62, xs = xt + s * f * k + 34;
          G = { k, xt, xs };
          el('circle', { cx: 330, cy: 26, r: 14, class: 'k-sun' }, api.svg);
          for (let i = 0; i < 8; i++) { const a = (i * Math.PI) / 4; el('line', { x1: 330 + Math.cos(a) * 19, y1: 26 + Math.sin(a) * 19, x2: 330 + Math.cos(a) * 25, y2: 26 + Math.sin(a) * 25, class: 'k-sunray' }, api.svg); }
          el('line', { x1: 8, y1: g0, x2: 352, y2: g0, class: 'k-ground' }, api.svg);
          const tree = el('g', { id: 'treeG' }, api.svg);
          const H = f * k;
          el('rect', { x: xt - 4, y: g0 - H * 0.45, width: 8, height: H * 0.45, class: 'k-trunk' }, tree);
          el('ellipse', { cx: xt, cy: g0 - H * 0.62, rx: Math.max(14, H * 0.2), ry: H * 0.38, class: 'k-crown' }, tree);
        },
        async play() {
          const { k, xt, xs } = G, H = f * k;
          const fm = (v) => U.fmt(Math.round(v * 100) / 100);
          api.say('Wie hoch ist dieser Baum? Hinaufklettern und messen ist keine gute Idee …<br>Aber die <b>Sonne</b> hilft uns!');
          await api.wait(3800);
          const shT = el('line', { x1: xt, y1: g0, x2: xt, y2: g0, class: 'k-shadow' }, api.svg);
          await api.tw(1000, (t) => shT.setAttribute('x2', xt + s * f * k * t));
          const lT = el('text', { x: xt + (s * f * k) / 2, y: g0 + 17, class: 'k-txt', 'text-anchor': 'middle', text: `Schatten: ${fm(s * f)} m` }, api.svg);
          api.say(`Der Baum wirft einen Schatten. Den können wir am Boden messen: <b>${fm(s * f)} m</b>.`);
          await api.wait(3200);
          const stick = el('line', { x1: xs, y1: g0, x2: xs, y2: g0, class: 'k-stick' }, api.svg);
          await api.tw(600, (t) => stick.setAttribute('y2', g0 - k * t));
          const shS = el('line', { x1: xs, y1: g0, x2: xs, y2: g0, class: 'k-shadow' }, api.svg);
          await api.tw(500, (t) => shS.setAttribute('x2', xs + s * k * t));
          el('text', { x: xs - 6, y: g0 - k / 2 + 4, class: 'k-txt', 'text-anchor': 'end', text: '1 m' }, api.svg);
          el('text', { x: xs + (s * k) / 2 + 4, y: g0 + 17, class: 'k-txt', 'text-anchor': 'middle', text: `${fm(s)} m` }, api.svg);
          api.say(`Daneben stellen wir einen Stock, genau <b>1 m</b> hoch. Sein Schatten ist <b>${fm(s)} m</b> lang.`);
          await api.wait(3600);
          const rT = el('line', { x1: xt, y1: g0 - H, x2: xt, y2: g0 - H, class: 'k-ray' }, api.svg);
          const rS = el('line', { x1: xs, y1: g0 - k, x2: xs, y2: g0 - k, class: 'k-ray' }, api.svg);
          await api.tw(900, (t) => { rT.setAttribute('x2', xt + s * f * k * t); rT.setAttribute('y2', g0 - H + H * t); rS.setAttribute('x2', xs + s * k * t); rS.setAttribute('y2', g0 - k + k * t); });
          const triB = el('polygon', { points: pts([[xt, g0], [xt, g0 - H], [xt + s * f * k, g0]]), class: 'k-wyel', opacity: 0 }, api.svg);
          const triS = el('polygon', { points: pts([[xs, g0], [xs, g0 - k], [xs + s * k, g0]]), class: 'k-wblue', opacity: 0 }, api.svg);
          await api.tw(600, (t) => { triB.setAttribute('opacity', 0.55 * t); triS.setAttribute('opacity', 0.8 * t); });
          api.say('Die Sonnenstrahlen fallen überall im <b>gleichen Winkel</b>. So entstehen zwei Dreiecke mit <b>genau der gleichen Form</b> – ein kleines und ein großes.');
          await api.wait(4200);
          api.say(`Der Baumschatten ist ${fm(s * f)} : ${fm(s)} = <b>${f}-mal</b> so lang wie der Stockschatten. Wir vergrößern das kleine Dreieck ${f}-mal …`);
          const copy = el('polygon', { points: pts([[xs, g0], [xs, g0 - k], [xs + s * k, g0]]), class: 'k-copy', 'vector-effect': 'non-scaling-stroke' }, api.svg);
          await api.tw(2200, (t) => copy.setAttribute('transform', `translate(${lerp(xs, xt, t)},${g0}) scale(${lerp(1, f, t)}) translate(${-xs},${-g0})`));
          await api.wait(600);
          el('text', { x: xt + 10, y: g0 - H / 2, class: 'k-txt', 'font-size': 18, text: `${f} m` }, api.svg);
          api.say(`Es passt genau auf den Baum! Also ist der Baum auch <b>${f}-mal</b> so hoch wie der Stock:<br><span class="exbig f1">${f} · 1 m = ${f} m</span><br><small>So soll Thales von Milet vor über 2500 Jahren die Höhe der Pyramiden gemessen haben.</small>`);
        },
      };
    },
  });

  // π-Rad ebenfalls in die Entdecken-Sammlung (dunkle Bühne)
  if (EX.pi) Object.assign(EX.pi, { dark: true, discover: { icon: 'π', q: 'Was ist π? Das Geheimnis des abrollenden Rads', tag: 'Vorschau Klasse 9' } });

  // ---------- Symbole der Entdecken-Kacheln: selbst gezeichnet, überall gleich groß (statt Schriftzeichen und Emojis) ----------
  const DI = {
    mindread: '<circle cx="12" cy="10" r="7.2"/><path d="M8.3 17.2 7 21h10l-1.3-3.8"/><path d="M12 5.6l1.1 3.3 3.3 1.1-3.3 1.1L12 14.4l-1.1-3.3-3.3-1.1 3.3-1.1z" fill="currentColor" stroke="none"/>',
    gauss: '<rect x="2.5" y="17" width="3.6" height="4.5" rx=".8" fill="currentColor" stroke="none"/><rect x="7.6" y="13" width="3.6" height="8.5" rx=".8" fill="currentColor" stroke="none"/><rect x="12.7" y="9" width="3.6" height="12.5" rx=".8" fill="currentColor" stroke="none"/><rect x="17.8" y="5" width="3.6" height="16.5" rx=".8" fill="currentColor" stroke="none"/><path d="M3 9.5 9.5 3" stroke-width="1.6"/><path d="M6 3h3.5v3.5" stroke-width="1.6"/>',
    odd: '<rect x="3" y="3" width="18" height="18" rx="1.5"/><path d="M3 9h12v12M3 15h6v6"/><rect x="3" y="15" width="6" height="6" fill="currentColor" stroke="none"/>',
    halves: '<rect x="3" y="3" width="9" height="18" fill="currentColor" stroke="none" opacity=".45"/><rect x="3" y="3" width="18" height="18" rx="1.5"/><path d="M12 3v18M12 12h9M16.5 3v9M16.5 7.5H21"/>',
    sieve: '<path d="M2.5 8h19"/><path d="M4.5 8a7.5 7.5 0 0 0 15 0"/><circle cx="9.0" cy="11.0" r="0.95" fill="currentColor" stroke="none"/><circle cx="12.0" cy="11.0" r="0.95" fill="currentColor" stroke="none"/><circle cx="15.0" cy="11.0" r="0.95" fill="currentColor" stroke="none"/><circle cx="10.5" cy="13.6" r="0.95" fill="currentColor" stroke="none"/><circle cx="13.5" cy="13.6" r="0.95" fill="currentColor" stroke="none"/><circle cx="8.5" cy="19.5" r="1.15" fill="currentColor" stroke="none"/><circle cx="12.0" cy="21.0" r="1.15" fill="currentColor" stroke="none"/><circle cx="15.5" cy="19.5" r="1.15" fill="currentColor" stroke="none"/>',
    chess: '<rect x="3" y="3" width="18" height="18" rx="1.5"/><rect x="3" y="3" width="6" height="6" fill="currentColor" stroke="none"/><rect x="15" y="3" width="6" height="6" fill="currentColor" stroke="none"/><rect x="9" y="9" width="6" height="6" fill="currentColor" stroke="none"/><rect x="3" y="15" width="6" height="6" fill="currentColor" stroke="none"/><rect x="15" y="15" width="6" height="6" fill="currentColor" stroke="none"/>',
    galton: '<circle cx="12.0" cy="3.5" r="1.25" fill="currentColor" stroke="none"/><circle cx="9.0" cy="7.5" r="1.25" fill="currentColor" stroke="none"/><circle cx="15.0" cy="7.5" r="1.25" fill="currentColor" stroke="none"/><circle cx="6.0" cy="11.5" r="1.25" fill="currentColor" stroke="none"/><circle cx="12.0" cy="11.5" r="1.25" fill="currentColor" stroke="none"/><circle cx="18.0" cy="11.5" r="1.25" fill="currentColor" stroke="none"/><rect x="4.3" y="18" width="3.4" height="3.5" rx=".7" fill="currentColor" stroke="none"/><rect x="10.3" y="14.8" width="3.4" height="6.7" rx=".7" fill="currentColor" stroke="none"/><rect x="16.3" y="18" width="3.4" height="3.5" rx=".7" fill="currentColor" stroke="none"/>',
    pascal: '<circle cx="12.0" cy="4.2" r="2.1" fill="currentColor" stroke="none"/><circle cx="9.4" cy="9.2" r="2.1" fill="currentColor" stroke="none"/><circle cx="14.6" cy="9.2" r="2.1" fill="currentColor" stroke="none"/><circle cx="6.8" cy="14.2" r="2.1" fill="currentColor" stroke="none"/><circle cx="12.0" cy="14.2" r="1.6" stroke-width="1.5"/><circle cx="17.2" cy="14.2" r="2.1" fill="currentColor" stroke="none"/><circle cx="4.2" cy="19.2" r="2.1" fill="currentColor" stroke="none"/><circle cx="9.4" cy="19.2" r="2.1" fill="currentColor" stroke="none"/><circle cx="14.6" cy="19.2" r="2.1" fill="currentColor" stroke="none"/><circle cx="19.8" cy="19.2" r="2.1" fill="currentColor" stroke="none"/>',
    tree: '<path d="M2 21h20"/><circle cx="16.5" cy="8" r="5" fill="currentColor" stroke="none"/><path d="M16.5 12v9" stroke-width="2.4"/><path d="M4 21 15.5 4.5" stroke-width="1.5" stroke-dasharray="1.5 2.6"/><circle cx="4" cy="21" r="1.5" fill="currentColor" stroke="none"/>',
    triangle: '<path d="M3 20h18L9 4.5z"/><path d="M7.6 20a4.6 4.6 0 0 0-1.7-3.5M16.6 20a4.4 4.4 0 0 1 1.7-3.4M7.1 8a4 4 0 0 0 4.9.4" stroke-width="1.6"/>',
    sunflower: '<circle cx="12.0" cy="12.0" r="1.0" fill="currentColor" stroke="none"/><circle cx="10.6" cy="13.3" r="1.0" fill="currentColor" stroke="none"/><circle cx="12.2" cy="9.3" r="1.0" fill="currentColor" stroke="none"/><circle cx="14.1" cy="14.7" r="1.0" fill="currentColor" stroke="none"/><circle cx="8.2" cy="11.3" r="1.0" fill="currentColor" stroke="none"/><circle cx="15.7" cy="9.7" r="1.0" fill="currentColor" stroke="none"/><circle cx="10.8" cy="16.6" r="1.0" fill="currentColor" stroke="none"/><circle cx="9.6" cy="7.4" r="1.0" fill="currentColor" stroke="none"/><circle cx="17.2" cy="13.9" r="1.0" fill="currentColor" stroke="none"/><circle cx="6.6" cy="14.2" r="1.0" fill="currentColor" stroke="none"/><circle cx="14.6" cy="6.4" r="1.0" fill="currentColor" stroke="none"/><circle cx="13.9" cy="18.2" r="1.0" fill="currentColor" stroke="none"/><circle cx="6.1" cy="8.6" r="1.0" fill="currentColor" stroke="none"/><circle cx="18.9" cy="10.5" r="1.0" fill="currentColor" stroke="none"/><circle cx="7.8" cy="18.0" r="1.0" fill="currentColor" stroke="none"/><circle cx="11.0" cy="4.5" r="1.0" fill="currentColor" stroke="none"/><circle cx="18.0" cy="17.0" r="1.0" fill="currentColor" stroke="none"/><circle cx="4.0" cy="12.4" r="1.0" fill="currentColor" stroke="none"/><circle cx="17.9" cy="6.2" r="1.0" fill="currentColor" stroke="none"/><circle cx="11.6" cy="20.5" r="1.0" fill="currentColor" stroke="none"/><circle cx="6.4" cy="5.3" r="1.0" fill="currentColor" stroke="none"/>',
    pi: '<path d="M3.5 8c1.2-1.6 2.7-2.2 4.8-2.2h12.2" stroke-width="2.4"/><path d="M9.3 6.2c0 6-.6 9.6-3.3 12.3M15.6 6.2v9c0 2.6 1.6 3.9 4.2 3" stroke-width="2.4"/>',
    pizza: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3v18M5.64 5.64l12.72 12.72M18.36 5.64 5.64 18.36" stroke-width="1.5"/><path d="M12 12h9a9 9 0 0 0-2.64-6.36z" fill="currentColor" stroke="none"/>',
    pythagoras: '<path d="M9 9.5V14h6z" fill="currentColor" stroke="none"/><path d="M9 9.5H4.5V14H9zM9 14v6h6v-6zM9 9.5l4.5-6 6 4.5-4.5 6z" stroke-width="1.6"/>',
  };
  for (const id in DI) if (EX[id] && EX[id].discover) EX[id].discover.icon = `<svg viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${DI[id]}</svg>`;
})();
