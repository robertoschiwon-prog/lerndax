/* TecDax (Technik/Computer) – Entdecken
 * Technik zum Staunen. Dunkle Bühne, leuchtende Farben (wie in den anderen Fächern).
 * Jede Entdeckung: { title, viewBox, dark:true, discover:{icon, q, tag}, create(api) → {reset, play} }
 *   tc-binaer   Zählen mit 0 und 1: vier Lampen zählen bis 15
 *   tc-pixel    Ein Bild aus lauter Zahlen: Pixel für Pixel
 *   tc-gaenge   Fahrradgänge ausprobieren: wie weit kommst du mit einer Pedalumdrehung?
 *   tc-morse    Morsen wie ein Funker
 *   tc-suche    Wie findet die Suchmaschine so schnell? (Kriechen, Register, Nachschlagen)
 */
(function () {
  const D = window.TecDax, EX = D.explainers, { el } = D.exUtil;
  const lerp = (a, b, t) => a + (b - a) * t;
  const reg = (id, def) => (EX[id] = Object.assign({ dark: true }, def));
  const W = '#ece9f7', BLAU = '#58c4dd', GELB = '#ffd166', GRUEN = '#83d483', ROT = '#ff6b6b', ORANGE = '#ff9f43', DIM = '#8a8fb5', FELD = '#1f2240';
  const txt = (p, x, y, text, size, fill, anchor) => el('text', { x, y, 'text-anchor': anchor || 'middle', class: 'k-txt', text, style: `font-size:${size || 14}px;fill:${fill || W}` }, p);
  const zeig = (api, e, ms) => api.tw(ms || 350, (t) => e.setAttribute('opacity', t));

  // =====================================================
  // Zählen mit 0 und 1
  // =====================================================
  reg('tc-binaer', {
    title: 'Zählen mit 0 und 1',
    viewBox: '0 0 360 230',
    discover: { icon: '💡', q: 'Ein Computer kennt nur „Strom an“ und „Strom aus“. Wie kann er damit bis 15 zählen, oder bis eine Million?', tag: 'Computer' },
    create(api) {
      const WERT = [8, 4, 2, 1];
      let lampen = [], ziffern = [], summe, an = [0, 0, 0, 0];
      const setze = (n) => {
        an = WERT.map((w) => (n & w ? 1 : 0));
        lampen.forEach((l, i) => { l.setAttribute('fill', an[i] ? GELB : FELD); l.setAttribute('stroke', an[i] ? GELB : DIM); });
        ziffern.forEach((z, i) => { z.textContent = an[i]; z.style.fill = an[i] ? GELB : DIM; });
        summe.textContent = `${WERT.filter((w, i) => an[i]).join(' + ') || '0'} = ${n}`;
      };
      return {
        reset() {
          api.clear(); lampen = []; ziffern = [];
          WERT.forEach((w, i) => {
            const x = 66 + i * 76;
            txt(api.svg, x, 34, w, 15, DIM);
            const l = el('circle', { cx: x, cy: 78, r: 24, fill: FELD, stroke: DIM, 'stroke-width': 2, style: 'cursor:pointer' }, api.svg);
            l.addEventListener('click', (e) => { e.stopPropagation(); api.stop(); const n = an.reduce((s, a, k) => s + (k === i ? 1 - a : a) * WERT[k], 0); setze(n); api.say('Tippe auf die Lampen und zähle selbst.'); });
            lampen.push(l);
            ziffern.push(txt(api.svg, x, 136, '0', 26, DIM));
          });
          summe = txt(api.svg, 180, 190, '', 20, GRUEN);
          setze(0);
        },
        async play() {
          api.say('Vier Lampen. Jede ist an (1) oder aus (0). Und jede hat einen Wert: 8, 4, 2, 1.');
          await api.wait(4200);
          for (let n = 0; n <= 15; n++) {
            setze(n);
            if (n === 1) api.say('Für die 1 leuchtet nur die rechte Lampe.');
            if (n === 2) api.say('Für die 2 die Lampe mit der 2. Die 1 geht wieder aus.');
            if (n === 3) api.say('3 = 2 + 1: zwei Lampen an.');
            if (n === 5) api.say('Jede Zahl ist eine eigene Mischung aus an und aus.');
            await api.wait(n < 4 ? 2200 : 900);
          }
          api.say('Mit 4 Lampen gibt es 16 Mischungen: 0 bis 15. Jede neue Lampe verdoppelt: Mit 8 Lampen sind es schon 256. So zählt jeder Computer: mit <b>Bits</b> (0 oder 1). 8 Bits heißen ein <b>Byte</b>. Tippe auf die Lampen!');
        },
      };
    },
  });

  // =====================================================
  // Ein Bild aus lauter Zahlen
  // =====================================================
  const DACHS = [
    '0011000011000', '0111100111100', '0111111111100', '1111111111110', '1101111110110', '1100111100110',
    '1111011011110', '0111111111100', '0011111111000', '0001111110000', '0000111100000', '0000011000000'];
  reg('tc-pixel', {
    title: 'Ein Bild aus lauter Zahlen',
    viewBox: '0 0 360 240',
    discover: { icon: '🟦', q: 'Wie speichert ein Handy ein Foto, wenn es doch nur Zahlen kennt?', tag: 'Computer' },
    create(api) {
      const NX = DACHS[0].length, NY = DACHS.length, S = 15, X0 = 196, Y0 = 26;
      let gZahl, gBild;
      return {
        reset() {
          api.clear();
          gZahl = el('g', {}, api.svg); gBild = el('g', {}, api.svg);
          DACHS.forEach((z, j) => txt(gZahl, 12, Y0 + 12 + j * S, z.split('').join(' '), 11.5, DIM, 'start'));
          for (let j = 0; j < NY; j++) for (let i = 0; i < NX; i++) el('rect', { x: X0 + i * 12, y: Y0 + j * S, width: 11, height: S - 1, fill: FELD, 'data-p': `${i},${j}` }, gBild);
        },
        async play() {
          api.say('Links: nur Nullen und Einsen. Rechts: ein leeres Gitter aus kleinen Kästchen, den <b>Pixeln</b>.');
          await api.wait(3600);
          api.say('Jede Zahl sagt einem Pixel, was es tun soll: 1 heißt hell, 0 heißt dunkel.');
          for (let j = 0; j < NY; j++) {
            const zeile = gZahl.children[j];
            zeile.style.fill = GELB;
            for (let i = 0; i < NX; i++) if (DACHS[j][i] === '1') gBild.querySelector(`[data-p="${i},${j}"]`).setAttribute('fill', '#cfd3e6');
            await api.wait(330);
            zeile.style.fill = DIM;
          }
          // Augen, Nase und Streifen einfärben: Farben sind auch nur Zahlen
          await api.wait(800);
          api.say('Für Farben speichert man drei Zahlen pro Pixel: wie viel <b>Rot</b>, <b>Grün</b> und <b>Blau</b>. Daraus mischt der Bildschirm jede Farbe.');
          const farbe = (i, j, f) => { const r = gBild.querySelector(`[data-p="${i},${j}"]`); if (r) r.setAttribute('fill', f); };
          [[2, 4], [3, 5], [9, 4], [10, 5], [4, 6], [5, 7], [8, 6], [7, 7]].forEach(([i, j]) => farbe(i, j, '#2b2540'));
          [[6, 8], [6, 9]].forEach(([i, j]) => farbe(i, j, '#2b2540'));
          [[5, 1], [6, 2], [7, 1], [6, 3]].forEach(([i, j]) => farbe(i, j, '#f5f5f5'));
          await api.wait(4200);
          api.say('Ein Handyfoto hat nicht 156, sondern rund 12 Millionen Pixel. Darum sieht man die Kästchen nur, wenn man ganz nah heranzoomt.');
          await api.tw(1600, (t) => { const k = lerp(1, 0.45, t); gBild.setAttribute('transform', `translate(${274 * (1 - k)} ${116 * (1 - k)}) scale(${k})`); });
          await api.wait(800);
          api.say('Mit 0 und 1 kann der Computer also auch Bilder speichern, Pixel für Pixel. Genauso Töne und Videos: alles nur Zahlen.');
        },
      };
    },
  });

  // =====================================================
  // Fahrradgänge
  // =====================================================
  reg('tc-gaenge', {
    title: 'Fahrradgänge ausprobieren',
    viewBox: '0 0 360 240',
    discover: { icon: '🚲', q: 'Warum ist der Berg im kleinen Gang so viel leichter, und warum kommst du dann kaum vorwärts?', tag: 'Getriebe' },
    create(api) {
      const VORN = 44, HINTEN = [32, 24, 18, 14, 11], UMFANG = 2.1;
      let g, info, weg, gang = 0;
      api.chips(HINTEN.map((z, k) => ({ label: `Gang ${k + 1}`, onClick() { api.stop(); const r = zeige(k, true); api.say(`Gang ${k + 1}: hinten ${z} Zähne. Pro Pedalumdrehung kommst du etwa <b>${String(Math.round(r.m * 10) / 10).replace('.', ',')} m</b> weit. ${k === 0 ? 'Leicht zu treten: gut für den Berg.' : k === 4 ? 'Schwer zu treten, aber schnell: gut bergab.' : ''}`); } })));
      const zeige = (k, schnell) => {
        gang = k;
        const z = HINTEN[k], n = VORN / z, m = n * UMFANG;
        g.innerHTML = '';
        // Kettenblatt und Ritzel (Größe nach Zähnen)
        const rv = 50, rh = rv * z / VORN, cy = 82;
        el('circle', { cx: 92, cy, r: rv, fill: 'none', stroke: W, 'stroke-width': 3 }, g);
        el('circle', { cx: 262, cy, r: rh, fill: 'none', stroke: ORANGE, 'stroke-width': 3 }, g);
        el('path', { d: `M92 ${cy - rv} L262 ${cy - rh} M92 ${cy + rv} L262 ${cy + rh}`, stroke: DIM, 'stroke-width': 2, 'stroke-dasharray': '4 3' }, g);
        txt(g, 92, cy + 5, `${VORN} Zähne`, 12, W); txt(g, 262, cy + rh + 18, `${z} Zähne`, 12, ORANGE);
        info.textContent = `1 Pedalumdrehung → Hinterrad ${String(Math.round(n * 10) / 10).replace('.', ',')}-mal`;
        const breite = Math.min(320, m * 34);
        weg.setAttribute('width', schnell ? breite : 0);
        return { breite, m, z };
      };
      return {
        reset() {
          api.clear();
          g = el('g', {}, api.svg);
          info = txt(api.svg, 180, 168, '', 15, GELB);
          el('rect', { x: 20, y: 186, width: 320, height: 14, fill: FELD }, api.svg);
          weg = el('rect', { x: 20, y: 186, width: 0, height: 14, fill: GRUEN }, api.svg);
          txt(api.svg, 20, 222, 'Weg pro Pedalumdrehung', 11.5, DIM, 'start');
          zeige(0, true);
        },
        async play() {
          api.say('Vorn das Kettenblatt mit 44 Zähnen, hinten ein Ritzel. Die Kette verbindet beide.');
          await api.wait(3600);
          for (let k = 0; k < HINTEN.length; k++) {
            const r = zeige(k);
            await api.tw(900, (t) => weg.setAttribute('width', r.breite * t));
            api.say(`Gang ${k + 1}: Ritzel mit ${r.z} Zähnen. Eine Pedalumdrehung bringt dich etwa <b>${String(Math.round(r.m * 10) / 10).replace('.', ',')} m</b> weit.`);
            await api.wait(2600);
          }
          api.say('Großes Ritzel hinten: wenig Weg pro Tritt, aber leicht. Kleines Ritzel: viel Weg, aber schwer. Das ist die <b>Übersetzung</b>. Probier die Gänge unten aus!');
        },
      };
    },
  });

  // =====================================================
  // Morsen wie ein Funker
  // =====================================================
  reg('tc-morse', {
    title: 'Morsen wie ein Funker',
    viewBox: '0 0 360 230',
    discover: { icon: '📡', q: 'Wie schickte man Nachrichten über das Meer, bevor es Telefon gab? Mit kurz und lang!', tag: 'Nachrichten' },
    create(api) {
      let lampe, code, wort;
      const sende = async (w) => {
        wort.textContent = ''; code.textContent = '';
        for (const b of w) {
          for (const s of D.MORSE[b]) {
            lampe.setAttribute('fill', GELB); code.textContent += s;
            await api.wait(s === '·' ? 220 : 660);
            lampe.setAttribute('fill', FELD);
            await api.wait(220);
          }
          code.textContent += ' '; wort.textContent += b;
          await api.wait(500);
        }
      };
      api.chips(['SOS', 'DACHS', 'HALLO', 'TC'].map((w) => ({ label: w, onClick() { api.stop(); api.run(async () => { api.say(`Wir morsen <b>${w}</b>.`); await sende(w); api.say(`${w}: ${w.split('').map((b) => D.MORSE[b]).join('  ')}`); }); } })));
      return {
        reset() {
          api.clear();
          lampe = el('circle', { cx: 180, cy: 64, r: 34, fill: FELD, stroke: DIM, 'stroke-width': 2 }, api.svg);
          code = txt(api.svg, 180, 140, '', 22, GELB); wort = txt(api.svg, 180, 190, '', 28, BLAU);
        },
        async play() {
          api.say('1844 schickte Samuel Morse eine der ersten Nachrichten über eine elektrische Telegrafenleitung. Seine Schrift kennt nur kurz und lang.');
          await api.wait(4600);
          api.say('Hör mit den Augen zu: Das ist der berühmteste Morseruf der Welt.');
          await sende('SOS');
          api.say('<b>SOS</b>: drei kurz, drei lang, drei kurz. So rufen Schiffe in Not um Hilfe. Der Ruf ist leicht zu senden und kaum zu verwechseln.');
          await api.wait(4200);
          api.say('Häufige Buchstaben bekamen kurze Zeichen: E ist nur ein Punkt, T ein Strich. So geht das Senden schneller. Tippe unten auf ein Wort.');
        },
      };
    },
  });

  // =====================================================
  // Wie findet die Suchmaschine so schnell?
  // =====================================================
  reg('tc-suche', {
    title: 'Wie findet die Suchmaschine so schnell?',
    viewBox: '0 0 360 240',
    discover: { icon: '🔎', q: 'Du tippst „Dachs Gewicht“ und nach einem Wimpernschlag kommen Treffer aus Milliarden Seiten. Wie geht das?', tag: 'Internet' },
    create(api) {
      const SEITEN = [[50, 40, 'A', ['Dachs', 'Wald']], [120, 70, 'B', ['Dachs', 'Gewicht']], [60, 120, 'C', ['Fuchs', 'Gewicht']], [150, 140, 'D', ['Dachs', 'Bau', 'Gewicht']], [30, 190, 'E', ['Wald', 'Bau']], [110, 200, 'F', ['Fuchs', 'Wald']]];
      const LINKS = [[0, 1], [1, 3], [0, 2], [2, 4], [3, 5], [4, 5], [1, 2]];
      let knoten = [], kanten = [], reg2;
      return {
        reset() {
          api.clear(); knoten = []; kanten = [];
          LINKS.forEach(([a, b]) => kanten.push(el('line', { x1: SEITEN[a][0], y1: SEITEN[a][1], x2: SEITEN[b][0], y2: SEITEN[b][1], stroke: DIM, 'stroke-width': 1.5, 'stroke-dasharray': '3 3' }, api.svg)));
          SEITEN.forEach(([x, y, n]) => { const g = el('g', {}, api.svg); el('rect', { x: x - 14, y: y - 12, width: 28, height: 24, rx: 4, fill: FELD, stroke: DIM, 'stroke-width': 1.5 }, g); txt(g, x, y + 5, n, 13, W); knoten.push(g); });
          reg2 = el('g', {}, api.svg);
        },
        async play() {
          api.say('Schon <b>bevor</b> du suchst, schicken Suchmaschinen kleine Programme los. Sie springen von Link zu Link durchs Netz und lesen jede Seite.');
          await api.wait(3200);
          for (const [i, k] of [0, 1, 3, 5, 4, 2].entries()) {
            knoten[k].querySelector('rect').setAttribute('stroke', GELB);
            if (i) { const l = LINKS.findIndex(([a, b]) => [a, b].includes(k)); if (l >= 0) kanten[l].setAttribute('stroke', GELB); }
            await api.wait(450);
          }
          api.say('Dann schreiben sie ein riesiges <b>Register</b>, wie hinten in einem Buch: zu jedem Wort die Seiten, auf denen es vorkommt.');
          const woerter = ['Dachs', 'Gewicht', 'Wald', 'Fuchs', 'Bau'], zeilen = {};
          woerter.forEach((w, i) => {
            const seiten = SEITEN.filter((s) => s[3].includes(w)).map((s) => s[2]);
            txt(reg2, 196, 44 + i * 26, w, 13, W, 'start');
            zeilen[w] = txt(reg2, 262, 44 + i * 26, seiten.join(' '), 13, BLAU, 'start');
          });
          await zeig(api, reg2, 600);
          await api.wait(3600);
          api.say('Jetzt suchst du <b>Dachs Gewicht</b>. Die Suchmaschine muss nicht das ganze Netz lesen. Sie schlägt nur zwei Zeilen im Register nach.');
          zeilen.Dachs.style.fill = GELB; zeilen.Gewicht.style.fill = GELB;
          await api.wait(3400);
          const treffer = txt(api.svg, 270, 196, 'Treffer: B und D', 16, GRUEN);
          treffer.setAttribute('opacity', 0); await zeig(api, treffer, 400);
          ['B', 'D'].forEach((n) => knoten[SEITEN.findIndex((s) => s[2] === n)].querySelector('rect').setAttribute('fill', '#2e6b3f'));
          api.say('Seiten, auf denen <b>beide</b> Wörter stehen: B und D. Dann sortiert sie die Treffer, zum Beispiel danach, wie viele andere Seiten auf sie verlinken.');
          await api.wait(4200);
          api.say('Das Register ist schon fertig, wenn du suchst. Darum geht es so schnell, auch bei Milliarden Seiten. Werbung oben ist bezahlt und als „Anzeige“ markiert.');
        },
      };
    },
  });
})();
