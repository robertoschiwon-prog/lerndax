/* BioDax (Biologie) – Entdecken
 * Biologie zum Staunen. Dunkle Bühne, leuchtende Farben (wie in MaDax, DeDax und GeDax).
 * Jede Entdeckung: { title, viewBox, dark:true, discover:{icon, q, tag}, create(api) → {reset, play} }
 * Fakten nachgeschlagen am 14.11.2026 (siehe faecher/bio/fakten.md).
 */
(function () {
  const D = window.BioDax, EX = D.explainers, { el } = D.exUtil;
  const lerp = (a, b, t) => a + (b - a) * t;
  const reg = (id, def) => (EX[id] = Object.assign({ dark: true }, def));
  const W = '#ece9f7', BLAU = '#58c4dd', GELB = '#ffd166', GRUEN = '#83d483', ROT = '#ff6b6b', ORANGE = '#ff9f43', DIM = '#8a8fb5', FELD = '#1f2240';
  const txt = (p, x, y, text, size, fill, anchor) => el('text', { x, y, 'text-anchor': anchor || 'middle', class: 'k-txt', text, style: `font-size:${size || 14}px;fill:${fill || W}` }, p);
  const zeig = (api, e, ms) => api.tw(ms || 350, (t) => e.setAttribute('opacity', t));
  // Ein Bild aus D.bilder auf die Bühne setzen (Breite w, Verhältnis 200:120)
  function bild(p, name, x, y, w, rahmen) {
    const g = el('g', { opacity: 0 }, p), h = w * 0.6;
    g.innerHTML = D.bilder[name]().replace(/^<svg([^>]*)>/, (m, a) => `<svg${a.replace(/ (style|role|aria-label)="[^"]*"/g, '')} x="${x}" y="${y}" width="${w}" height="${h}">`);
    el('rect', { x, y, width: w, height: h, rx: 5, fill: 'none', stroke: rahmen || '#3a3e66', 'stroke-width': 2 }, g);
    return g;
  }

  // =====================================================
  // Vom Laich zum Frosch im Zeitraffer
  // =====================================================
  reg('bio-zeitraffer', {
    title: 'Vom Laich zum Frosch im Zeitraffer',
    viewBox: '0 0 360 230',
    discover: { icon: '🐸', q: 'Drei Monate in einer Minute: Wie wird aus einem Ei ein Frosch?', tag: 'Lurche' },
    create(api) {
      const S = [
        ['laich', 'März', 'Der Grasfrosch laicht. Jedes Ei steckt in einer Hülle aus Gallerte, die im Wasser aufquillt.'],
        ['quappe1', 'nach 1 bis 3 Wochen', 'Die Kaulquappe schlüpft. Außen am Kopf sitzen <b>Kiemen</b>: Sie atmet wie ein Fisch.'],
        ['quappe2', 'ein paar Wochen später', 'Die Kiemen liegen jetzt innen. Mit dem <b>Ruderschwanz</b> schwimmt sie umher und raspelt Algen ab.'],
        ['quappe3', 'etwa im Mai', 'Zuerst wachsen die <b>Hinterbeine</b>.'],
        ['quappe4', 'ein paar Wochen später', 'Dann brechen die <b>Vorderbeine</b> durch. Die Lunge ist fertig: Die Kaulquappe holt jetzt Luft an der Oberfläche.'],
        ['jungfrosch', 'etwa im Juni', 'Der Schwanz ist aufgebraucht. Ein winziger <b>Jungfrosch</b> geht an Land.'],
      ];
      let g;
      return {
        reset() { api.clear(); g = el('g', {}, api.svg); },
        async play() {
          api.say('Aus einem Ei ohne Beine und Lunge wird ein Tier, das an Land springt. Das dauert beim Grasfrosch ungefähr <b>drei Monate</b>. Wir schauen im Zeitraffer zu.');
          el('line', { x1: 24, y1: 206, x2: 336, y2: 206, stroke: '#3a3e66', 'stroke-width': 4, 'stroke-linecap': 'round' }, g);
          const lauf = el('line', { x1: 24, y1: 206, x2: 24, y2: 206, stroke: GRUEN, 'stroke-width': 4, 'stroke-linecap': 'round' }, g);
          await api.wait(3200);
          let alt = null, altT = null;
          for (let i = 0; i < S.length; i++) {
            const x = 24 + (312 * i) / (S.length - 1);
            el('circle', { cx: x, cy: 206, r: 6, fill: GRUEN, stroke: '#12142a', 'stroke-width': 2 }, g);
            const b = bild(g, S[i][0], 75, 22, 210, GRUEN), t = txt(g, 180, 172, S[i][1], 15, GELB);
            t.setAttribute('opacity', 0);
            await api.tw(500, (k) => { b.setAttribute('opacity', k); t.setAttribute('opacity', k); if (alt) { alt.setAttribute('opacity', 1 - k); altT.setAttribute('opacity', 1 - k); } lauf.setAttribute('x2', lerp(+lauf.getAttribute('x2'), x, k)); });
            if (alt) { alt.remove(); altT.remove(); }
            alt = b; altT = t;
            api.say(S[i][2]);
            await api.wait(3600);
          }
          api.say('Kiemen weg, Lunge da. Schwanz weg, Beine da. Pflanzenfresser wird Jäger. Diese Verwandlung heißt <b>Metamorphose</b>. Von über tausend Eiern eines Weibchens schaffen es nur wenige bis hierher.');
        },
      };
    },
  });

  // =====================================================
  // Der Axolotl: ein Lurch, der nie erwachsen wird
  // =====================================================
  reg('bio-axolotl', {
    title: 'Der Axolotl bleibt für immer Kind',
    viewBox: '0 0 360 230',
    discover: { icon: '🦎', q: 'Welcher Lurch behält sein Leben lang die Kiemen einer Larve?', tag: 'Lurche' },
    create(api) {
      let g;
      const axolotl = (p) => {
        const a = el('g', { opacity: 0 }, p), K = '#f4b6c8';
        el('path', { d: 'M40 120 C80 96 120 92 170 96 C220 98 262 104 286 112 C300 116 300 128 286 132 C262 138 220 142 170 142 C120 144 80 140 40 120Z', fill: K }, a);
        el('path', { d: 'M40 120 C60 100 100 84 150 92 C110 100 70 110 40 120Z', fill: '#f8cbd8' }, a);
        [[250, 108, 236, 82], [258, 106, 256, 78], [266, 108, 278, 82]].forEach(([x1, y1, x2, y2]) => el('path', { d: `M${x1} ${y1} L${x2} ${y2}`, stroke: ROT, 'stroke-width': 6, 'stroke-linecap': 'round' }, a));
        [[250, 134, 236, 158], [258, 136, 258, 162], [266, 134, 278, 158]].forEach(([x1, y1, x2, y2]) => el('path', { d: `M${x1} ${y1} L${x2} ${y2}`, stroke: ROT, 'stroke-width': 6, 'stroke-linecap': 'round' }, a));
        el('path', { d: 'M130 140 L122 162 L112 164 M200 140 L206 162 L216 164', stroke: K, 'stroke-width': 7, fill: 'none', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, a);
        el('circle', { cx: 284, cy: 116, r: 3, fill: '#222' }, a);
        el('path', { d: 'M288 126 q6 2 8 -2', stroke: '#c9788f', 'stroke-width': 2, fill: 'none' }, a);
        return a;
      };
      return {
        reset() { api.clear(); g = el('g', {}, api.svg); },
        async play() {
          api.say('Du weißt: Eine Kaulquappe hat Kiemen und lebt im Wasser. Dann verwandelt sie sich und geht an Land. Aber einer macht da nicht mit …');
          await api.wait(3600);
          const a = axolotl(g); await zeig(api, a, 700);
          txt(g, 180, 40, 'Der Axolotl', 20, GELB);
          api.say('Der <b>Axolotl</b> ist ein Schwanzlurch aus Mexiko. Er behält sein Leben lang die <b>Kiemen-Büschel</b> außen am Kopf und bleibt im Wasser.');
          await api.wait(4400);
          const p1 = el('g', { opacity: 0 }, g);
          el('path', { d: 'M256 78 L256 60', stroke: BLAU, 'stroke-width': 2 }, p1); txt(p1, 256, 54, 'Außenkiemen', 12, BLAU);
          await zeig(api, p1);
          api.say('Er sieht also aus wie eine riesige Larve, bis zu 25 Zentimeter lang. Trotzdem wird er erwachsen: Er kann Eier legen und sich fortpflanzen, <b>ohne sich je zu verwandeln</b>.');
          await api.wait(5200);
          const p2 = el('g', { opacity: 0 }, g);
          txt(p2, 180, 196, 'Larve für immer, und trotzdem Eltern', 14, GRUEN);
          await zeig(api, p2);
          api.say('Und noch etwas kann er: Verliert er ein Bein, <b>wächst es vollständig nach</b>, mit Knochen, Muskeln und Nerven. Deshalb erforschen ihn Wissenschaftler auf der ganzen Welt.');
          await api.wait(5200);
          api.say('In der Natur lebt der Axolotl nur noch in wenigen Gewässern bei <b>Mexiko-Stadt</b> und ist vom Aussterben bedroht. In Aquarien und Laboren gibt es viel mehr Tiere als in Freiheit.');
        },
      };
    },
  });

  // =====================================================
  // Gleiche Knochen, andere Form
  // =====================================================
  reg('bio-knochen', {
    title: 'Ein Bauplan für alle',
    viewBox: '0 0 360 230',
    discover: { icon: '🦴', q: 'Was haben dein Arm, ein Fledermausflügel und eine Walflosse gemeinsam?', tag: 'Säugetiere' },
    create(api) {
      const T = [['armMensch', 'Mensch: greifen'], ['armMaulwurf', 'Maulwurf: graben'], ['armFledermaus', 'Fledermaus: fliegen'], ['armWal', 'Wal: schwimmen'], ['armPferd', 'Pferd: laufen']];
      let g;
      return {
        reset() { api.clear(); g = el('g', {}, api.svg); },
        async play() {
          api.say('Fass dir an den Arm: oben <b>ein</b> Knochen, im Unterarm <b>zwei</b>, dann viele kleine in der Hand. Jetzt schauen wir bei anderen Säugetieren nach.');
          const leg = el('g', { opacity: 0 }, g);
          [['#d0443a', 'Oberarm', 60], ['#3d7bff', 'Unterarm', 180], ['#e3a81e', 'Hand', 300]].forEach(([f, n, x]) => { el('rect', { x: x - 44, y: 204, width: 14, height: 14, rx: 3, fill: f }, leg); txt(leg, x - 24, 216, n, 12, W, 'start'); });
          await zeig(api, leg); await api.wait(3600);
          let alt = null, altT = null;
          for (const [name, label] of T) {
            const b = bild(g, name, 70, 20, 220, GELB), t = txt(g, 180, 178, label, 16, GELB);
            t.setAttribute('opacity', 0);
            await api.tw(450, (k) => { b.setAttribute('opacity', k); t.setAttribute('opacity', k); if (alt) { alt.setAttribute('opacity', 1 - k); altT.setAttribute('opacity', 1 - k); } });
            if (alt) { alt.remove(); altT.remove(); }
            alt = b; altT = t;
            api.say({ armMensch: 'Dein Arm: gebaut zum Greifen. Der Daumen steht den Fingern gegenüber.', armMaulwurf: 'Der <b>Maulwurf</b>: dieselben Knochen, aber kurz und dick. Die Hand ist eine Schaufel.', armFledermaus: 'Die <b>Fledermaus</b>: Die Fingerknochen sind riesig lang und spannen die Flughaut.', armWal: 'Der <b>Wal</b>: Arm und Hand stecken in einer Flosse. Von außen sieht man keine Finger.', armPferd: 'Das <b>Pferd</b>: Von der Hand ist nur ein einziger Finger übrig. Sein „Fingernagel“ ist der Huf.' }[name]);
            await api.wait(4000);
          }
          api.say('Fünf Tiere, fünf Aufgaben, aber immer <b>derselbe Bauplan</b>. Das ist kein Zufall: Alle Säugetiere stammen von gemeinsamen Vorfahren ab. Auch Vögel, Kriechtiere und Lurche haben diese Knochen.');
        },
      };
    },
  });

  // =====================================================
  // Sehen mit den Ohren: die Echo-Ortung der Fledermaus
  // =====================================================
  reg('bio-echo', {
    title: 'Sehen mit den Ohren',
    viewBox: '0 0 360 230',
    discover: { icon: '🦇', q: 'Wie fängt die Fledermaus in völliger Dunkelheit eine Mücke?', tag: 'Säugetiere' },
    create(api) {
      let g;
      const fleder = (p, x, y) => { const f = el('g', {}, p);
        el('path', { d: `M${x} ${y} l-34 -18 l8 16 l-12 4 l14 8 l-6 12 l30 -10 l30 10 l-6 -12 l14 -8 l-12 -4 l8 -16Z`, fill: '#6b5b7a' }, f);
        el('ellipse', { cx: x, cy: y + 2, rx: 8, ry: 11, fill: '#8a7a9a' }, f); el('path', { d: `M${x - 6} ${y - 8} l-2 -9 l6 5 M${x + 6} ${y - 8} l2 -9 l-6 5`, fill: '#8a7a9a' }, f); return f; };
      const welle = async (x0, x1, y, farbe, dauer) => {
        const ws = [0, 1, 2].map(() => el('path', { d: '', stroke: farbe, 'stroke-width': 2.5, fill: 'none', opacity: 0 }, g)), d = x1 > x0 ? 1 : -1;
        await api.tw(dauer, (t) => ws.forEach((w, i) => { const x = lerp(x0, x1, Math.max(0, t - i * 0.08) / (1 - i * 0.08) || 0), r = 10 + i * 2; w.setAttribute('d', `M${x} ${y - r} Q${x + d * 9} ${y} ${x} ${y + r}`); w.setAttribute('opacity', t < 0.97 ? 0.9 - i * 0.25 : 0); }));
        ws.forEach((w) => w.remove());
      };
      return {
        reset() { api.clear(); g = el('g', {}, api.svg); },
        async play() {
          el('circle', { cx: 320, cy: 30, r: 13, fill: '#f2e6a0' }, g);
          fleder(g, 70, 100);
          const m = el('g', {}, g); el('ellipse', { cx: 290, cy: 100, rx: 6, ry: 3.5, fill: GELB }, m); el('path', { d: 'M286 98 l-5 -8 M292 98 l5 -8', stroke: W, 'stroke-width': 1.5 }, m);
          api.say('Es ist stockdunkel. Die Fledermaus fliegt trotzdem sicher und fängt Mücken im Flug. Sie hat gute Augen, aber die helfen jetzt wenig.');
          await api.wait(4000);
          api.say('Sie <b>ruft</b>: kurze, sehr hohe Töne, viel höher, als wir hören können. Das ist <b>Ultraschall</b>.');
          await welle(92, 280, 100, BLAU, 1500); await api.wait(600);
          api.say('Der Schall trifft die Mücke und wird zurückgeworfen: ein <b>Echo</b>.');
          await welle(280, 96, 100, ORANGE, 1500); await api.wait(1400);
          const t1 = txt(g, 180, 150, 'Ruf hin, Echo zurück', 14, W), t2 = txt(g, 180, 172, 'kurze Pause = Beute ist nah', 14, GRUEN), t3 = txt(g, 180, 194, 'lange Pause = Beute ist weit weg', 14, DIM);
          [t2, t3].forEach((t) => t.setAttribute('opacity', 0));
          api.say('Die Fledermaus <b>misst die Zeit</b> zwischen Ruf und Echo. Schall legt in einer Sekunde etwa 340 Meter zurück. Kommt das Echo sofort, ist die Mücke ganz nah.');
          await zeig(api, t2); await api.wait(2400); await zeig(api, t3); await api.wait(3200);
          api.say('Je näher sie kommt, desto schneller ruft sie: am Ende über hundertmal in der Sekunde.');
          for (let i = 0; i < 4; i++) { await welle(92, 280, 100, BLAU, 520 - i * 90); await welle(280, 96, 100, ORANGE, 520 - i * 90); }
          void t1;
          api.say('Aus den Echos entsteht in ihrem Kopf ein „Hörbild“ der Umgebung. Delfine orten ihre Beute im trüben Wasser übrigens genauso. Und der Mensch hat sich das abgeschaut: beim <b>Echolot</b> der Schiffe.');
        },
      };
    },
  });

  // =====================================================
  // Der Urvogel (Wahlbereich: Kriechtiere vergangener Zeiten)
  // =====================================================
  reg('bio-urvogel', {
    title: 'Der Urvogel: halb Echse, halb Vogel',
    viewBox: '0 0 360 230',
    discover: { icon: '🦕', q: 'Welches Tier hatte Federn und Flügel, aber auch Zähne und Krallen?', tag: 'Saurier' },
    create(api) {
      let g;
      const zeile = (y, text, farbe, seite) => { const r = el('g', { opacity: 0 }, g); el('circle', { cx: seite ? 172 : 26, cy: y - 4, r: 4, fill: farbe }, r); txt(r, seite ? 182 : 36, y, text, 12.5, W, 'start'); return r; };
      return {
        reset() { api.clear(); g = el('g', {}, api.svg); },
        async play() {
          api.say('Im Jahr <b>1861</b> fanden Arbeiter in einem Steinbruch bei <b>Solnhofen</b> in Bayern ein seltsames Fossil: ein Skelett, um das herum Abdrücke von <b>Federn</b> zu sehen waren.');
          const v = el('g', { opacity: 0 }, g);
          el('path', { d: 'M150 70 C190 40 250 44 300 30 C280 60 250 78 210 86 C230 92 250 96 264 108 C230 108 200 104 176 96Z', fill: '#7a8fb5' }, v);
          el('path', { d: 'M176 96 C150 110 110 118 60 140 L56 134 C100 112 140 96 164 82Z', fill: '#8a7a5a' }, v);
          el('path', { d: 'M60 140 l-22 14 M62 132 l-26 6 M70 128 l-28 -2', stroke: '#7a8fb5', 'stroke-width': 5, 'stroke-linecap': 'round' }, v);
          el('path', { d: 'M150 70 C140 56 128 50 112 50 L96 56 L112 60 C124 62 134 70 144 82Z', fill: '#8a7a5a' }, v);
          el('path', { d: 'M100 56 l3 5 l3 -4 l3 5 l3 -4', stroke: '#fff', 'stroke-width': 1.5, fill: 'none' }, v);
          el('circle', { cx: 118, cy: 54, r: 2.2, fill: '#111' }, v);
          el('path', { d: 'M236 62 l10 -12 M242 66 l12 -8 M246 72 l12 -4', stroke: '#e8d9b8', 'stroke-width': 2.5, 'stroke-linecap': 'round' }, v);
          el('path', { d: 'M180 98 l-6 26 l-8 4 M196 100 l2 26 l8 4', stroke: '#8a7a5a', 'stroke-width': 5, fill: 'none', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, v);
          await zeig(api, v, 800); await api.wait(4200);
          api.say('Man nannte das Tier <b>Archaeopteryx</b>, den Urvogel. Er lebte vor etwa <b>150 Millionen Jahren</b>, mitten in der Zeit der Dinosaurier, und war etwa so groß wie eine Taube.');
          await api.wait(4600);
          txt(g, 26, 160, 'wie ein Vogel', 13, BLAU, 'start'); txt(g, 172, 160, 'wie ein Kriechtier', 13, ORANGE, 'start');
          const L = [zeile(180, 'Federn', BLAU), zeile(198, 'Flügel', BLAU)], Rr = [zeile(180, 'Zähne im Kiefer', ORANGE, 1), zeile(198, 'Krallen an den Flügeln', ORANGE, 1), zeile(216, 'langer Schwanz mit Wirbeln', ORANGE, 1)];
          api.say('Wie ein <b>Vogel</b> hatte er Federn und Flügel.');
          for (const r of L) { await zeig(api, r); await api.wait(900); }
          await api.wait(1400);
          api.say('Aber wie ein <b>Kriechtier</b> hatte er Zähne, Krallen an den Fingern und einen langen Schwanz aus vielen Wirbeln. Heutige Vögel haben nichts davon.');
          for (const r of Rr) { await zeig(api, r); await api.wait(900); }
          await api.wait(3600);
          api.say('Der Urvogel zeigt: <b>Vögel stammen von Kriechtieren ab</b>, genauer von kleinen Raubsauriern. Die Dinosaurier sind also gar nicht ganz ausgestorben. Die Amsel im Garten ist ihre Verwandte.');
        },
      };
    },
  });
})();
