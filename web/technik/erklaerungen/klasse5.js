/* TecDax (Technik/Computer) – Erklär-Animationen Klasse 5/6
 *
 * Gemeinsame Bild-Modi (karte, reihe, faecher, bild) und die Anmeldung der Themen stehen in plattform/erklaer.js.
 * Hier die Modi, die es nur in TecDax gibt:
 *   zahnrad    Die Räder drehen sich wirklich: Richtung Rad für Rad, Umdrehungen zählen (Übersetzung)
 *   getriebe   Riemen, Kette, Reibrad, Zahnräder, Kurbel, Nocken, Zahnstange in Bewegung
 *   riemen     wie getriebe, mit der Drehrichtung der Aufgabe
 *   eva        Ein Punkt wandert durch Eingabe → Verarbeitung → Ausgabe
 *   baum       Ordnerbaum: Der Pfad wird Ordner für Ordner nachgefahren und aufgeschrieben
 *   mail, url  Adresse wird in ihre Teile zerlegt und beschriftet
 *   lineal     Vom Nullpunkt an der Bezugskante bis zum Anriss zählen
 *   bemassung  Die gefragte Strecke leuchtet in der Zeichnung auf
 *   ansicht    Blickrichtung zeigen, die Ansicht klappt heraus
 *   tabelle    Menge · Einzelpreis, dann die Summe
 *   linien     Die vier Linienarten leuchten nacheinander in der Zeichnung auf
 *   morse      Die Lampe blinkt kurz und lang, Buchstabe für Buchstabe
 */
(function () {
  const D = window.TecDax;
  const { el, lerp, block, fade, F } = LernDaxErklaer(D, { sand: '#e6e9f0', braun: '#5b6378', bild: { hoch: 150, breit: 330, schrift: 0.9, H: 280 } });
  const { BLAU, ORANGE, GRUEN } = F;
  const T = 'var(--ink)', ROT = '#d0443a', GRAU = '#6f6a7c';
  const txt = (p, x, y, t, fs, farbe, anker, extra) => el('text', Object.assign({ x, y, 'text-anchor': anker || 'middle', class: 'ex-b', text: t, style: `font-size:${fs || 13}px;fill:${farbe || T}` }, extra || {}), p);
  const lin = (t) => t;
  const vb = (roh) => (roh.match(/viewBox="([^"]+)"/) || [0, '0 0 200 120'])[1].split(' ').map(Number);
  // Zeichnung so groß wie möglich in ein Rechteck setzen
  const passe = (roh, x, y, w, h) => { const [, , bw, bh] = vb(roh), s = Math.min(w / bw, h / bh); return { x: x + (w - bw * s) / 2, y: y + (h - bh * s) / 2, w: bw * s, h: bh * s, s }; };
  const setz = (g, roh, p) => { g.innerHTML = D.einbetten(roh, p.x, p.y, p.w, p.h); };
  const UHR = (d) => (d > 0 ? 'im Uhrzeigersinn' : 'gegen den Uhrzeigersinn');

  Object.assign(D.bild, {
    // ---------------------------------------------------------------- Zahnräder in Bewegung
    async zahnrad(api, x) {
      const H = x.frage === 'richtung' ? 130 : 150, o = { z: x.z, namen: x.namen, zaehne: x.frage !== 'richtung', H };
      api.svg.setAttribute('viewBox', '0 0 360 250');
      const g = el('g', {}, api.svg), p = passe(D.zeichne.zahnraeder(o), 4, 4, 352, 196);
      let w = 0, hell = -1;
      const zeichne = () => setz(g, D.zeichne.zahnraeder(Object.assign({}, o, { t: w, hell })), p);
      zeichne();
      const dir = x.dir || 1;
      if (x.frage === 'richtung') {
        api.say(`Rad A dreht sich <b>${UHR(dir)}</b>.`);
        await api.tw(2200, (t) => { w = dir * t * Math.PI * 0.7; zeichne(); }, lin);
        let w0 = w;
        for (let i = 1; i <= x.k; i++) {
          hell = i;
          const d = i % 2 ? -dir : dir;
          api.say(`Rad ${x.namen[i - 1]} schiebt Rad <b>${x.namen[i]}</b> an: Es dreht sich andersherum, also <b>${UHR(d)}</b>.`);
          await api.tw(2600, (t) => { w = w0 + dir * t * Math.PI * 0.8; zeichne(); }, lin);
          w0 = w;
        }
        const erg = x.k % 2 ? -dir : dir, z = el('text', { x: 180, y: 232, 'text-anchor': 'middle', class: 'ex-b', style: `font-size:16px;fill:${GRUEN}`, opacity: 0 }, api.svg);
        z.textContent = `Rad ${x.namen[x.k]}: ${UHR(erg)}`;
        await fade(api, z, 400);
        api.say(`Merke: Jedes Rad dreht anders herum als sein Nachbar. ${x.k % 2 ? 'Ungerade' : 'Gerade'} viele Schritte von A aus: ${x.k % 2 ? 'Gegenrichtung' : 'dieselbe Richtung wie A'}.`);
        return;
      }
      // Übersetzung: A dreht n1-mal, B zählt mit
      const n1 = x.n1 || 1, n2 = x.n2 || (n1 * x.z[0]) / x.z[1];
      const za = txt(api.svg, 90, 230, 'A: 0', 16, ORANGE), zb = txt(api.svg, 270, 230, 'B: 0', 16, BLAU);
      api.say(`Rad A hat ${x.z[0]} Zähne, Rad B hat ${x.z[1]}. Wir drehen A ${n1}-mal und zählen mit.`);
      await api.wait(1800);
      const dauer = Math.min(9000, 2600 * n1);
      await api.tw(dauer, (t) => {
        w = t * n1 * 2 * Math.PI; zeichne();
        za.textContent = `A: ${Math.floor(t * n1 + 1e-6)}`;
        zb.textContent = `B: ${Math.floor(t * n1 * x.z[0] / x.z[1] + 1e-6)}`;
      }, lin);
      za.textContent = `A: ${n1}`; zb.textContent = `B: ${String(Math.round(n2 * 100) / 100).replace('.', ',')}`;
      await api.wait(600);
      api.say(`An B wandern ${n1} · ${x.z[0]} = ${n1 * x.z[0]} Zähne vorbei. B braucht ${x.z[1]} für eine Runde: ${n1 * x.z[0]} : ${x.z[1]} = <b>${String(Math.round(n2 * 100) / 100).replace('.', ',')}</b> Umdrehungen. ${x.z[0] > x.z[1] ? 'Groß treibt klein: ins Schnelle.' : 'Klein treibt groß: ins Langsame, dafür kräftiger.'}`);
    },

    // ---------------------------------------------------------------- Getriebe in Bewegung
    async getriebe(api, x) {
      api.svg.setAttribute('viewBox', '0 0 360 240');
      const g = el('g', {}, api.svg), dir = x.dir || 1;
      const bild = (t) => ({
        offen: () => D.zeichne.riemen({ r: [30, 20], t: dir * t, pfeil: dir }),
        gekreuzt: () => D.zeichne.riemen({ r: [26, 26], gekreuzt: true, t: dir * t, pfeil: dir }),
        kette: () => D.zeichne.riemen({ r: [32, 16], kette: true, t: dir * t, pfeil: dir }),
        reibrad: () => D.zeichne.reibrad(t),
        zahnrad: () => D.zeichne.zahnraeder({ z: [24, 12], t }),
        kurbel: () => D.zeichne.kurbel(t),
        nocken: () => D.zeichne.nocken(t),
        zahnstange: () => D.zeichne.zahnstange(1.4 * Math.sin(t / 2)),
      }[x.typ] || (() => D.zeichne.zahnraeder({ z: [24, 12], t })))();
      const p = passe(bild(0), 6, 6, 348, 200);
      setz(g, bild(0), p);
      const namen = D.GETRIEBE || {}, merk = x.merk || (namen[x.typ] ? `<b>${namen[x.typ][1]}</b>: ${namen[x.typ][2]}` : '');
      api.say(x.art === 'riemenRichtung' ? `Scheibe A dreht sich <b>${UHR(dir)}</b>. Schau auf die roten Punkte.` : 'Schau genau hin, wie sich die Teile bewegen.');
      await api.tw(5200, (t) => setz(g, bild(t * 4 * Math.PI), p), lin);
      if (x.art === 'riemenRichtung') {
        const erg = x.typ === 'gekreuzt' ? -dir : dir;
        api.say(x.typ === 'gekreuzt' ? `Der gekreuzte Riemen kehrt die Richtung um: B dreht sich <b>${UHR(erg)}</b>.` : `${x.typ === 'kette' ? 'Die Kette' : 'Der Riemen'} nimmt B in dieselbe Richtung mit: <b>${UHR(erg)}</b>.`);
        await api.tw(3000, (t) => setz(g, bild(4 * Math.PI + t * 2 * Math.PI), p), lin);
        return;
      }
      api.say(merk);
      await api.tw(3600, (t) => setz(g, bild(4 * Math.PI + t * 3 * Math.PI), p), lin);
    },
    async riemen(api, x) { return D.bild.getriebe(api, Object.assign({}, x, { art: 'riemenRichtung' })); },

    // ---------------------------------------------------------------- EVA
    async eva(api, x) {
      const K = [['Eingabe', '#ffe0b2', ORANGE], ['Verarbeitung', '#dfe9ff', BLAU], ['Ausgabe', '#d9f2e6', GRUEN]];
      txt(api.svg, 180, 26, x.geraet, 17, T);
      const box = K.map(([n, f, s], i) => {
        const bx = 8 + i * 120;
        el('rect', { x: bx, y: 48, width: 104, height: 52, rx: 10, fill: f, stroke: s, 'stroke-width': 2 }, api.svg);
        txt(api.svg, bx + 52, 80, n, 14, s);
        if (i < 2) el('path', { d: `M${bx + 106} 74 h 10 m -5 -5 l 5 5 l -5 5`, stroke: T, 'stroke-width': 2, fill: 'none' }, api.svg);
        return bx + 52;
      });
      const punkt = el('circle', { cx: box[0], cy: 120, r: 7, fill: ROT }, api.svg);
      api.say(`Auch ${{ Taschenrechner: 'der', Supermarktkasse: 'die', Navi: 'das', Handy: 'das', Computerspiel: 'das' }[x.geraet] || 'das Gerät'} ${x.geraet} arbeitet nach dem EVA-Prinzip.`);
      await api.wait(1400);
      for (let i = 0; i < 3; i++) {
        if (i) await api.tw(900, (t) => punkt.setAttribute('cx', lerp(box[i - 1], box[i], t)));
        const z = block(api.svg, box[i], 146, D.exUtil.umbruch(x.schritte[i], 15).slice(0, 4), 12.5, 112, { opacity: 0 });
        z.ts.forEach((e) => { e.style.fill = K[i][2]; });
        await api.tw(400, (t) => z.ts.forEach((e) => e.setAttribute('opacity', t)));
        api.say(`<b>${K[i][0]}</b>: ${x.schritte[i]}`);
        await api.wait(1600);
      }
      api.say(x.merk || 'Erst kommt etwas hinein (Eingabe), dann wird es verarbeitet, dann kommt ein Ergebnis heraus (Ausgabe).');
    },

    // ---------------------------------------------------------------- Ordnerbaum und Pfad
    async baum(api, x) {
      const zeilen = [];
      (function lauf(k, tiefe) { zeilen.push({ k, tiefe }); (k.kinder || []).forEach((c) => lauf(c, tiefe + 1)); })(x.wurzel, 0);
      const roh = D.zeichne.ordnerbaum({ wurzel: x.wurzel }), [, , bw, bh] = vb(roh), H = 250;
      api.svg.setAttribute('viewBox', `0 0 360 ${H}`);
      const p = passe(roh, 0, 2, 210, H - 50), s = p.s, g = el('g', {}, api.svg);
      setz(g, roh, p);
      void bw; void bh;
      const marker = el('g', {}, api.svg);
      const schritte = x.pfad.concat(x.ziel), pfadT = txt(api.svg, 180, H - 14, '', 15, BLAU);
      api.say(`Wir suchen den Weg zur Datei <b>${x.ziel}</b>. Er beginnt immer beim Laufwerk.`);
      await api.wait(1400);
      let ab = 0, teile = [];
      for (const name of schritte) {
        const i = zeilen.findIndex((z, j) => j >= ab && z.k.name === name);
        ab = i + 1;
        const y = p.y + (12 + i * 15 - 5) * s, xx = p.x + (12 + zeilen[i].tiefe * 16 - 3) * s;
        const r = el('rect', { x: xx, y, width: (name.length * 5.4 + 30) * s, height: 14 * s, rx: 3, fill: 'none', stroke: ROT, 'stroke-width': 2, opacity: 0 }, marker);
        await fade(api, r, 300);
        teile.push(name);
        pfadT.textContent = teile.join('\\');
        try { for (let f = 15; f >= 9 && pfadT.getBBox().width > 350; f -= 0.5) pfadT.setAttribute('style', `font-size:${f}px;fill:${BLAU}`); } catch (e) {}
        const rechts = txt(api.svg, 286, 24 + teile.length * 22, teile.length === 1 ? `Laufwerk ${name}` : name === x.ziel ? `Datei ${name}` : `Ordner ${name}`, 12, name === x.ziel ? GRUEN : T);
        void rechts;
        await api.wait(900);
      }
      api.say(`Der Pfad: <b>${teile.join('\\')}</b>. Das Zeichen \\ trennt die Ordner.`);
    },

    // ---------------------------------------------------------------- E-Mail-Adresse
    async mail(api, x) {
      const adr = `${x.name}@${x.anb}`, fs = Math.min(20, 330 / (adr.length * 0.58));
      const ganz = txt(api.svg, 180, 60, adr, fs, T);
      api.say('Eine E-Mail-Adresse hat immer drei Teile.');
      await api.wait(1600);
      let bb = { x: 20, width: 320 };
      try { bb = ganz.getBBox(); } catch (e) {}
      const proZ = bb.width / adr.length, x0 = bb.x, nb = x.name.length * proZ;
      ganz.setAttribute('opacity', 0);
      const t1 = txt(api.svg, x0, 60, x.name, fs, BLAU, 'start'), t2 = txt(api.svg, x0 + nb, 60, '@', fs, ROT, 'start'), t3 = txt(api.svg, x0 + nb + proZ * 1.05, 60, x.anb, fs, GRUEN, 'start');
      void t1; void t2; void t3;
      const lab = (xx, y, a, b, farbe) => { const gg = el('g', { opacity: 0 }, api.svg); el('path', { d: `M${xx} 68 V ${y - 16}`, stroke: farbe, 'stroke-width': 1.5 }, gg); txt(gg, Math.max(60, Math.min(300, xx)), y, a, 13, farbe); txt(gg, Math.max(60, Math.min(300, xx)), y + 16, b, 11, GRAU); return gg; };
      const l1 = lab(x0 + nb / 2, 104, 'Benutzername', 'wer', BLAU), l2 = lab(x0 + nb + proZ * 0.5, 150, '@ (gesprochen „ät“)', 'heißt „bei“', ROT), l3 = lab(x0 + nb + proZ + (x.anb.length * proZ) / 2, 104, 'Anbieter', 'wo das Postfach liegt', GRUEN);
      await fade(api, l1, 400); api.say(`Vor dem @: der <b>Benutzername</b> ${x.name}.`); await api.wait(1800);
      await fade(api, l2, 400); api.say('Das @ heißt „bei“.'); await api.wait(1500);
      await fade(api, l3, 400); api.say(`Hinter dem @: der <b>Anbieter</b> ${x.anb}. Dort liegt das Postfach.`); await api.wait(1800);
      // Weg der Mail
      const brief = el('g', { opacity: 0 }, api.svg);
      el('rect', { x: -11, y: -7, width: 22, height: 14, rx: 2, fill: '#fff', stroke: T, 'stroke-width': 1.5 }, brief); el('path', { d: 'M-11 -7 L0 2 L11 -7', fill: 'none', stroke: T, 'stroke-width': 1.2 }, brief);
      [[40, 'Du'], [180, 'Mailserver'], [320, 'Postfach']].forEach(([xx, n]) => { el('rect', { x: xx - 36, y: 196, width: 72, height: 26, rx: 6, fill: '#eef1f6', stroke: '#9a94a8' }, api.svg); txt(api.svg, xx, 214, n, 12, T); });
      api.say('Beim Senden geht die Mail zum Mailserver des Anbieters und landet im Postfach.');
      brief.setAttribute('opacity', 1);
      await api.tw(1400, (t) => brief.setAttribute('transform', `translate(${lerp(40, 180, t)} ${182 - Math.sin(t * Math.PI) * 16})`));
      await api.tw(1400, (t) => brief.setAttribute('transform', `translate(${lerp(180, 320, t)} ${182 - Math.sin(t * Math.PI) * 16})`));
      api.say(x.frage === 2 ? `Richtig geschrieben: <b>${adr}</b>: ein @, keine Leerzeichen, hinten eine Endung.` : x.frage === 1 ? `Der Anbieter steht hinter dem @: <b>${x.anb}</b>.` : `Der Benutzername steht vor dem @: <b>${x.name}</b>.`);
    },

    // ---------------------------------------------------------------- Internetadresse
    async url(api, x) {
      const teile = [[`${x.prot}://`, ROT, x.prot === 'https' ? 'verschlüsselt' : 'nicht verschlüsselt'], [x.dom.replace(/\.[a-z]+$/, ''), BLAU, 'Name der Webseite'], [`.${x.dom.split('.').pop()}`, GRUEN, 'Endung (oft das Land)'], [`/${x.pf}`, ORANGE, 'Seite darauf']];
      const ganz = teile.map((t) => t[0]).join(''), fs = Math.min(19, 340 / (ganz.length * 0.56));
      const t0 = txt(api.svg, 180, 60, ganz, fs, T);
      api.say('Eine Internetadresse hat mehrere Teile.');
      await api.wait(1500);
      let bb = { x: 10, width: 340 };
      try { bb = t0.getBBox(); } catch (e) {}
      const pz = bb.width / ganz.length;
      t0.setAttribute('opacity', 0);
      let xx = bb.x;
      for (let i = 0; i < teile.length; i++) {
        const [s, farbe, n] = teile[i], mitte = xx + (s.length * pz) / 2;
        txt(api.svg, xx, 60, s, fs, farbe, 'start');
        const y = 96 + (i % 2) * 52, gg = el('g', { opacity: 0 }, api.svg);
        el('path', { d: `M${mitte} 68 V ${y - 14}`, stroke: farbe, 'stroke-width': 1.5 }, gg);
        txt(gg, Math.max(56, Math.min(304, mitte)), y, n, 12.5, farbe);
        await fade(api, gg, 350);
        api.say(`<b>${s}</b>: ${n}`);
        await api.wait(1500);
        xx += s.length * pz;
      }
      api.say(x.frage === 0 ? `Die Endung <b>.${x.dom.split('.').pop()}</b> verrät oft das Land.` : x.frage === 1 ? `Hinter dem Namen führt <b>/${x.pf}</b> zu einer bestimmten Seite.` : '<b>https</b>: Das s heißt sicher, die Verbindung ist verschlüsselt.');
    },

    // ---------------------------------------------------------------- Stahlmaßstab
    async lineal(api, x) {
      const roh = D.zeichne.lineal(null), g = el('g', {}, api.svg), p = passe(roh, 0, 4, 360, 200);
      setz(g, roh, p);
      const k = 220 / 64 * p.s, X0 = p.x + 12 * p.s, yL = p.y + 62 * p.s;
      api.say('Der Stahlmaßstab liegt genau an der <b>Bezugskante</b>: Dort ist die 0.');
      await api.wait(1800);
      const zehn = Math.floor(x.mm / 10) * 10, balken = el('rect', { x: X0, y: yL + 2, width: 0, height: 10, fill: BLAU, opacity: 0.55 }, api.svg);
      if (zehn) {
        api.say(`Bis zur großen Zahl <b>${zehn}</b> sind es ${zehn} mm.`);
        await api.tw(1400, (t) => balken.setAttribute('width', zehn * k * t));
        await api.wait(900);
      }
      const rest = x.mm - zehn;
      if (rest) {
        api.say(`Dann noch ${rest} kleine Striche, jeder 1 mm.`);
        const b2 = el('rect', { x: X0 + zehn * k, y: yL + 2, width: 0, height: 10, fill: ORANGE, opacity: 0.7 }, api.svg);
        await api.tw(300 * rest + 400, (t) => b2.setAttribute('width', rest * k * t), lin);
      }
      el('path', { d: `M${X0 + x.mm * k} ${yL} V ${yL + 42 * p.s}`, stroke: ROT, 'stroke-width': 2.5 }, api.svg);
      const e = txt(api.svg, 180, 228, `${zehn ? zehn + ' mm' : ''}${zehn && rest ? ' + ' : ''}${rest ? rest + ' mm' : ''} = ${x.mm} mm`, 17, GRUEN, 'middle', { opacity: 0 });
      await fade(api, e, 400);
      api.say(`Der Anriss liegt <b>${x.mm} mm</b> von der Bezugskante entfernt.`);
    },

    // ---------------------------------------------------------------- Bemaßung
    async bemassung(api, x) {
      const o = x.o, roh = D.zeichne.bemassung(o), g = el('g', { opacity: 0 }, api.svg), p = passe(roh, 0, 0, 360, 210);
      setz(g, roh, p);
      await fade(api, g, 500);
      api.say('Alle Maße in Millimetern. Jede Maßlinie zeigt, welche Strecke gemessen ist.');
      await api.wait(1800);
      const k = Math.min(140 / o.l, 82 / o.b), X0 = 44, Y0 = 18, w = o.l * k, h = o.b * k, lx = X0 + o.x * k, ly = Y0 + h - o.y * k, lr = o.d * k / 2;
      const P = (a, b) => [p.x + a * p.s, p.y + b * p.s];
      const strecke = [[[X0, Y0 + h], [X0 + w, Y0 + h]], [[X0, Y0], [X0, Y0 + h]], [[lx - lr, ly], [lx + lr, ly]], [[X0, ly], [lx, ly]], [[lx, ly], [X0 + w, ly]]][x.frage];
      const [a, b] = [P(...strecke[0]), P(...strecke[1])];
      const linie = el('line', { x1: a[0], y1: a[1], x2: a[0], y2: a[1], stroke: ROT, 'stroke-width': 4, 'stroke-linecap': 'round' }, api.svg);
      await api.tw(1200, (t) => { linie.setAttribute('x2', lerp(a[0], b[0], t)); linie.setAttribute('y2', lerp(a[1], b[1], t)); });
      const wert = [o.l, o.b, o.d, o.x, o.l - o.x][x.frage];
      const e = txt(api.svg, 180, 232, x.frage === 4 ? `${o.l} − ${o.x} = ${wert} mm` : x.frage === 2 ? `⌀ ${wert} mm` : `${wert} mm`, 17, GRUEN, 'middle', { opacity: 0 });
      await fade(api, e, 400);
      api.say([`Die Länge steht an der unteren Maßlinie: <b>${o.l} mm</b>.`, `Die Breite steht links, von rechts zu lesen: <b>${o.b} mm</b>.`, `⌀ heißt Durchmesser: <b>${o.d} mm</b>.`, `Von der linken Kante bis zur Mittellinie des Lochs: <b>${o.x} mm</b>.`, `Diese Strecke ist nicht bemaßt. Ganze Länge minus Abstand von links: ${o.l} − ${o.x} = <b>${wert} mm</b>.`][x.frage]);
    },

    // ---------------------------------------------------------------- Ansichten
    async ansicht(api, x) {
      api.svg.setAttribute('viewBox', '0 0 360 250');
      const kroh = D.zeichne.koerper(x.h, { s: 30, pfeil: false }), kp = passe(kroh, 4, 30, 200, 190), g = el('g', {}, api.svg);
      setz(g, kroh, kp);
      api.say('So sieht der Körper schräg von vorn aus.');
      await api.wait(1600);
      const pfeile = { vorn: [kp.x + kp.w * 0.4, kp.y + kp.h + 14, kp.x + kp.w * 0.4, kp.y + kp.h - 6], oben: [kp.x + kp.w * 0.45, kp.y - 22, kp.x + kp.w * 0.45, kp.y + 6], links: [kp.x - 4, kp.y + kp.h * 0.62, kp.x + 22, kp.y + kp.h * 0.62] };
      const [x1, y1, x2, y2] = pfeile[x.gesucht], ang = Math.atan2(y2 - y1, x2 - x1);
      el('line', { x1, y1, x2, y2, stroke: ROT, 'stroke-width': 3 }, api.svg);
      el('path', { d: `M${x2} ${y2} l${-9 * Math.cos(ang - 0.45)} ${-9 * Math.sin(ang - 0.45)} l${9 * Math.cos(ang - 0.45) - 9 * Math.cos(ang + 0.45)} ${9 * Math.sin(ang - 0.45) - 9 * Math.sin(ang + 0.45)}z`, fill: ROT }, api.svg);
      api.say(`Für die <b>${D.ANSICHT[x.gesucht]}</b> schauen wir in Richtung des roten Pfeils.`);
      await api.wait(1800);
      const v = D.zeichne.ansicht(x.h, x.gesucht, { s: 24 }), ag = el('g', { opacity: 0 }, api.svg);
      ag.innerHTML = `<g transform="translate(${296 - v.w / 2} ${118 - v.h / 2})">${v.s}</g>`;
      txt(api.svg, 296, Math.min(240, 118 + v.h / 2 + 22), D.ANSICHT[x.gesucht], 12.5, BLAU);
      await api.tw(700, (t) => { ag.setAttribute('opacity', t); ag.setAttribute('transform', `translate(${(1 - t) * -40} 0)`); });
      api.say(`Man sieht nur, was in Blickrichtung vorn liegt. Kanten entstehen dort, wo Stufen sind: die <b>${D.ANSICHT[x.gesucht]}</b>.`);
    },

    // ---------------------------------------------------------------- Kostenaufstellung
    async tabelle(api, x) {
      const z = x.zeilen, zh = Math.min(30, 150 / (z.length + 1)), Y0 = 22;
      const sp = [14, 132, 186, 270];
      ['Teil', 'Menge', 'Einzelpreis', 'Preis'].forEach((k, i) => txt(api.svg, sp[i], Y0 + 6, k, 12, GRAU, 'start'));
      const eur = (v) => D.util.euro(v);
      z.forEach((r, j) => { const y = Y0 + (j + 1) * zh + 6; txt(api.svg, sp[0], y, r[0], 13, T, 'start'); txt(api.svg, sp[1], y, String(r[1]), 13, T, 'start'); txt(api.svg, sp[2], y, eur(r[2]), 13, T, 'start'); });
      api.say(`Kostenaufstellung ${x.name}: Preis = Menge · Einzelpreis.`);
      await api.wait(1400);
      const zeige = async (j) => {
        const y = Y0 + (j + 1) * zh + 6, r = z[j], hl = el('rect', { x: 6, y: y - zh * 0.7, width: 348, height: zh * 0.95, rx: 4, fill: '#fff3c4', opacity: 0 }, api.svg);
        api.svg.insertBefore(hl, api.svg.firstChild);
        await fade(api, hl, 250);
        const t = txt(api.svg, sp[3], y, eur(r[3]), 13, GRUEN, 'start', { opacity: 0 });
        api.say(`${r[0]}: ${r[1]} · ${eur(r[2])} = <b>${eur(r[3])}</b>`);
        await fade(api, t, 300);
        await api.wait(x.i === j ? 1800 : 900);
      };
      if (x.i >= 0) { await zeige(x.i); return; }
      for (let j = 0; j < z.length; j++) await zeige(j);
      const y = Y0 + (z.length + 1) * zh + 14;
      el('path', { d: `M${sp[3] - 6} ${y - zh * 0.75} H 352`, stroke: T, 'stroke-width': 1.5 }, api.svg);
      const s = txt(api.svg, sp[3], y + 4, eur(x.sum), 15, GRUEN, 'start', { opacity: 0 });
      txt(api.svg, sp[2], y + 4, 'Summe', 13, T, 'start');
      await fade(api, s, 400);
      api.say(`Alle Preise zusammen: <b>${eur(x.sum)}</b>.`);
    },

    // ---------------------------------------------------------------- Linienarten
    async linien(api, x) {
      const g = el('g', {}, api.svg), p = passe(D.zeichne.linien(''), 0, 0, 360, 200);
      setz(g, D.zeichne.linien(''), p);
      api.say('In dieser Zeichnung stecken vier Linienarten.');
      await api.wait(1600);
      const L = D.LINIEN, lab = txt(api.svg, 180, 228, '', 15, ROT);
      for (const [id, name, zweck] of L) {
        if (id === x.hell) continue;
        setz(g, D.zeichne.linien(id), p); lab.textContent = name;
        api.say(`<b>${name}</b>: ${zweck}.`);
        await api.wait(2000);
      }
      const [id, name, zweck] = L.find((l) => l[0] === x.hell) || L[0];
      setz(g, D.zeichne.linien(id), p); lab.textContent = name; lab.style.fill = GRUEN;
      api.say(`Und die gesuchte: <b>${name}</b> für ${zweck}.`);
    },

    // ---------------------------------------------------------------- Morsen
    async morse(api, x) {
      const lampe = el('circle', { cx: 180, cy: 70, r: 34, fill: '#3a3550', stroke: T, 'stroke-width': 2 }, api.svg);
      const code = txt(api.svg, 180, 160, '', 22, T), buch = txt(api.svg, 180, 205, '', 26, BLAU);
      api.say('Kurz und lang: Daraus bestehen alle Buchstaben.');
      await api.wait(1200);
      let geschrieben = '';
      for (const b of x.w) {
        const c = D.MORSE[b];
        code.textContent = '';
        for (const s of c) {
          lampe.setAttribute('fill', '#ffd166');
          code.textContent += s + ' ';
          await api.wait(s === '·' ? 260 : 780);
          lampe.setAttribute('fill', '#3a3550');
          await api.wait(260);
        }
        geschrieben += b; buch.textContent = geschrieben;
        api.say(`<b>${b}</b> = ${c}`);
        await api.wait(900);
      }
      api.say(`${x.w.split('').map((b) => `${b} ${D.MORSE[b]}`).join(' · ')}: <b>${x.w}</b>`);
    },
  });

  D.erklaereThemen();
})();
