/* GeoDax (Geografie) – Grundlage für Klasse 5: Bausteine, Karten, Fotos und eigene Aufgabenarten
 * (Lehrplan Gymnasium Sachsen, Fassung 2019 – für Geographie gibt es keine Fassung 2025;
 *  Schulbuch TERRA Geographie 5 Sachsen nur zum Abgleich von Reihenfolge, Begriffen und Seitenzahlen)
 *
 * Aufgaben wie in GeDax und BioDax: Jeder Generator liefert bei jedem Aufruf eine neue Aufgabe
 *   { prompt, hint, solution, figure?, ex } mit choices/correct, fields oder order.
 * Die gemeinsamen Bausteine (auswahl, tippen, ordnen, sortiere, aussage, erkennen, baue …) stehen in plattform/bausteine.js.
 * Neu in GeoDax:
 *   Karten aus echten Kartendaten (karten/karten.js): Fläche antippen, Fläche benennen, Orte und Flüsse finden
 *   Maßstab rechnen, Diagramme lesen, Himmelsrichtungen auf der Karte
 * Bilder: Karten aus Natural-Earth-Daten (gemeinfrei) und freie Fotos von Wikimedia Commons (Fotograf und Lizenz im Bild
 * und in bildnachweis.html). Keine Bilder aus dem Schulbuch, keine gezeichneten Tiere oder Landschaften.
 * Zahlen und Namen sind nachgeschlagen (Quellen in faecher/geo/fakten.md). Jede Aufgabe hat genau eine richtige Lösung.
 */
(function () {
  const D = (window.GeoDax = window.GeoDax || {});
  const U = LernDaxBausteine(D, { passtNicht: 'Drei gehören zusammen. Was <b>passt nicht</b> dazu?' });
  const { R, pick, shuffle, nurText } = U;
  const GK = window.GeoKarte;
  const BILDER = (D.bilder = {});

  // =====================================================
  // Karten als Bilder. Jede Karte bekommt einen Namen, damit die Erklärung (Merkzettel) sie wieder zeigen kann.
  // =====================================================
  let kz = 0;
  const KARTEN = {};
  function karte(art, o) {
    const sig = art + JSON.stringify(o || {});
    if (!KARTEN[sig]) { KARTEN[sig] = 'karte' + ++kz; BILDER[KARTEN[sig]] = () => GK[art](o || {}); }
    return KARTEN[sig];
  }
  D.karte = karte;

  // =====================================================
  // Orte (Länge, Breite) – nachgeschlagen, gerundet
  // =====================================================
  const LAENDER = {
    'Baden-Württemberg': ['Stuttgart', 9.18, 48.78], Bayern: ['München', 11.58, 48.14], Berlin: ['Berlin', 13.4, 52.52], Brandenburg: ['Potsdam', 13.06, 52.4],
    Bremen: ['Bremen', 8.8, 53.08], Hamburg: ['Hamburg', 9.99, 53.55], Hessen: ['Wiesbaden', 8.24, 50.08], 'Mecklenburg-Vorpommern': ['Schwerin', 11.41, 53.63],
    Niedersachsen: ['Hannover', 9.73, 52.37], 'Nordrhein-Westfalen': ['Düsseldorf', 6.78, 51.23], 'Rheinland-Pfalz': ['Mainz', 8.27, 50.0], Saarland: ['Saarbrücken', 7.0, 49.23],
    Sachsen: ['Dresden', 13.74, 51.05], 'Sachsen-Anhalt': ['Magdeburg', 11.63, 52.13], 'Schleswig-Holstein': ['Kiel', 10.14, 54.32], Thüringen: ['Erfurt', 11.03, 50.98],
  };
  const STADTSTAATEN = ['Berlin', 'Hamburg', 'Bremen'];
  const NACHBARN = ['Dänemark', 'Niederlande', 'Belgien', 'Luxemburg', 'Frankreich', 'Schweiz', 'Österreich', 'Tschechien', 'Polen'];
  const NACHBAR_LAGE = { Dänemark: 'im Norden', Polen: 'im Osten', Tschechien: 'im Osten (Südosten)', Österreich: 'im Süden (Südosten)', Schweiz: 'im Süden', Frankreich: 'im Westen (Südwesten)', Luxemburg: 'im Westen', Belgien: 'im Westen', Niederlande: 'im Westen (Nordwesten)' };
  const KONTINENTE = ['Nordamerika', 'Südamerika', 'Europa', 'Afrika', 'Asien', 'Australien', 'Antarktis'];
  // Fläche in Mio. km² (gerundet, Reihenfolge in allen Quellen gleich)
  const KONT_GROESSE = { Asien: 44, Afrika: 30, Nordamerika: 25, Südamerika: 18, Antarktis: 14, Europa: 10, Australien: 9 };
  const SN_ORTE = { Dresden: [13.74, 51.05], Leipzig: [12.37, 51.34], Chemnitz: [12.92, 50.83], Zwickau: [12.49, 50.72], Plauen: [12.14, 50.5], Görlitz: [14.99, 51.15], Bautzen: [14.42, 51.18], Freiberg: [13.34, 50.92], Meißen: [13.47, 51.16], Pirna: [13.94, 50.96], Torgau: [13.0, 51.56], Hoyerswerda: [14.25, 51.44] };
  const DE_STAEDTE = { Berlin: [13.4, 52.52], Hamburg: [9.99, 53.55], München: [11.58, 48.14], Köln: [6.96, 50.94], Frankfurt: [8.68, 50.11], Stuttgart: [9.18, 48.78], Düsseldorf: [6.78, 51.23], Leipzig: [12.37, 51.34], Dresden: [13.74, 51.05], Hannover: [9.73, 52.37], Nürnberg: [11.08, 49.45], Bremen: [8.8, 53.08], Rostock: [12.1, 54.09], Kiel: [10.14, 54.32], Magdeburg: [11.63, 52.13], Erfurt: [11.03, 50.98], Freiburg: [7.85, 47.99], Flensburg: [9.44, 54.79], Passau: [13.46, 48.57], Aachen: [6.08, 50.78], Görlitz: [14.99, 51.15], Saarbrücken: [7.0, 49.23] };
  Object.assign(D, { LAENDER, STADTSTAATEN, NACHBARN, NACHBAR_LAGE, KONTINENTE, KONT_GROESSE, SN_ORTE, DE_STAEDTE });

  // =====================================================
  // Karten-Aufgaben
  // =====================================================
  const TIPP_KARTE = '<br><small>Tippe auf die Karte oder auf die Nummer.</small>';
  // Fläche antippen: vier Flächen mit Nummern, eine ist gesucht. def = { art, namen, frage(Name), opts, merk(Name), pool? }
  function flaecheTippen(art, def) {
    const ziel = pick(def.namen), andere = shuffle((def.pool || def.namen).filter((n) => n !== ziel)).slice(0, 3), alle = shuffle([ziel, ...andere]);
    const nummern = {}, wahl = {};
    alle.forEach((n, i) => { nummern[n] = i + 1; wahl[n] = i; });
    const o = Object.assign({}, def.opts || {}, { nummern, wahl });
    const loes = karte(def.art, Object.assign({}, def.opts || {}, { hell: ziel, namen: [ziel] }));
    const k = alle.indexOf(ziel), merk = def.merk ? def.merk(ziel) : '';
    return { prompt: def.frage(ziel) + TIPP_KARTE, figure: GK[def.art](o), choices: ['1', '2', '3', '4'], correct: k, hint: def.h,
      solution: `Nummer ${k + 1} ist <b>${ziel}</b>.${merk ? '<br>' + merk : ''}`,
      ex: { mode: 'karte', nach: false, art, q: nurText(def.frage(ziel)), opts: [ziel], ok: 0, svg: loes, merk: `<b>${ziel}</b>: ${merk || 'auf der Karte gelb.'}` } };
  }
  // Fläche benennen: eine Fläche ist gelb, wie heißt sie?
  function flaecheNennen(art, def) {
    const ziel = pick(def.namen), ch = shuffle([ziel, ...shuffle((def.pool || def.namen).filter((n) => n !== ziel)).slice(0, 3)]);
    const merk = def.merk ? def.merk(ziel) : '';
    return { prompt: def.frage ? def.frage(ziel) : 'Wie heißt die <b>gelbe</b> Fläche?', figure: GK[def.art](Object.assign({}, def.opts || {}, { hell: ziel })), choices: ch, correct: ch.indexOf(ziel), hint: def.h,
      solution: `Gelb ist <b>${ziel}</b>.${merk ? '<br>' + merk : ''}`,
      ex: { mode: 'karte', nach: false, art, q: nurText(def.frage ? def.frage(ziel) : 'Wie heißt die gelbe Fläche?'), opts: [ziel], ok: 0, svg: karte(def.art, Object.assign({}, def.opts || {}, { hell: ziel, namen: [ziel] })), merk: `<b>${ziel}</b>: ${merk || 'Merke dir die Lage.'}` } };
  }
  // Orte finden: vier Orte mit Nummern auf der Karte. def = { art, orte: { Name: [lon, lat] }, frage, opts, ortArt, merk }
  function ortTippen(art, def) {
    const namen = Object.keys(def.orte), ziel = pick(def.namen || namen);
    // die vier Orte sollen nicht zu dicht beieinander liegen (sonst überdecken sich die Nummern)
    const min = def.abstand || { welt: 14, europa: 1.2, deutschland: 0.75, sachsen: 0.3 }[def.art] || 0.5;
    const weit = (a, b) => Math.hypot((def.orte[a][0] - def.orte[b][0]) * 0.63, def.orte[a][1] - def.orte[b][1]) >= min;
    let andere = [];
    for (const n of shuffle(namen.filter((x) => x !== ziel))) { if (andere.length < 3 && weit(n, ziel) && andere.every((m) => weit(n, m))) andere.push(n); }
    for (const n of shuffle(namen.filter((x) => x !== ziel && !andere.includes(x)))) { if (andere.length < 3) andere.push(n); }
    const alle = shuffle([ziel, ...andere]);
    const orte = alle.map((n, i) => [n, ...def.orte[n], { nr: i + 1, art: def.ortArt || 'stadt', nrVersatz: def.versatz && def.versatz[n] }]);
    const k = alle.indexOf(ziel), merk = def.merk ? def.merk(ziel) : '';
    return { prompt: def.frage(ziel), figure: GK[def.art](Object.assign({}, def.opts || {}, { orte })), choices: ['1', '2', '3', '4'], correct: k, hint: def.h,
      solution: `Nummer ${k + 1} ist <b>${ziel}</b>.${merk ? '<br>' + merk : ''}`,
      ex: { mode: 'karte', nach: false, art, q: nurText(def.frage(ziel)), opts: [ziel], ok: 0, svg: karte(def.art, Object.assign({}, def.opts || {}, { orte: [[ziel, ...def.orte[ziel], { hell: true, art: def.ortArt || 'stadt' }]] })), merk: `<b>${ziel}</b>: ${merk || 'auf der Karte blau.'}` } };
  }
  // Ort benennen: ein Ort ist blau markiert
  function ortNennen(art, def) {
    const namen = Object.keys(def.orte), ziel = pick(def.namen || namen), ch = shuffle([ziel, ...shuffle(namen.filter((n) => n !== ziel)).slice(0, 3)]);
    const o = Object.assign({}, def.opts || {}, { orte: [[ziel, ...def.orte[ziel], { hell: true, ohneName: true, art: def.ortArt || 'stadt' }]] });
    const merk = def.merk ? def.merk(ziel) : '';
    return { prompt: def.frage ? def.frage(ziel) : 'Welcher Ort ist <b>blau</b> markiert?', figure: GK[def.art](o), choices: ch, correct: ch.indexOf(ziel), hint: def.h,
      solution: `Blau markiert ist <b>${ziel}</b>.${merk ? '<br>' + merk : ''}`,
      ex: { mode: 'karte', nach: false, art, q: nurText(def.frage ? def.frage(ziel) : 'Welcher Ort ist blau markiert?'), opts: [ziel], ok: 0, svg: karte(def.art, Object.assign({}, def.opts || {}, { orte: [[ziel, ...def.orte[ziel], { hell: true, art: def.ortArt || 'stadt' }]] })), merk: `<b>${ziel}</b>: ${merk || 'Merke dir die Lage.'}` } };
  }
  // Fluss benennen: ein Fluss ist kräftig blau
  const artikel = (f) => (['Rhein', 'Main', 'Neckar', 'Inn'].includes(f) ? 'der' : 'die');
  D.artikel = artikel;
  function flussNennen(art, def) {
    const ziel = pick(def.namen), ch = shuffle([ziel, ...shuffle((def.pool || def.namen).filter((n) => n !== ziel)).slice(0, 3)]);
    const o = Object.assign({}, def.opts || {}, { fluesse: def.fluesse || def.namen, flussHell: ziel });
    const merk = def.merk ? def.merk(ziel) : '';
    return { prompt: 'Wie heißt der <b>kräftig blaue</b> Fluss?', figure: GK[def.art](o), choices: ch, correct: ch.indexOf(ziel), hint: def.h,
      solution: `Das ist ${artikel(ziel)} <b>${ziel}</b>.${merk ? '<br>' + merk : ''}`,
      ex: { mode: 'karte', nach: false, art, q: 'Wie heißt der kräftig blaue Fluss?', opts: [ziel], ok: 0, svg: karte(def.art, o), merk: `<b>${ziel}</b>: ${merk || 'Merke dir den Verlauf.'}` } };
  }

  // Himmelsrichtung zwischen zwei Orten (nur eindeutige Fälle: höchstens 13° neben der Hauptrichtung)
  const RICHT = ['Osten', 'Nordosten', 'Norden', 'Nordwesten', 'Westen', 'Südwesten', 'Süden', 'Südosten'];
  function richtung(a, b) {
    const dx = (b[0] - a[0]) * Math.cos((a[1] + b[1]) / 2 * Math.PI / 180), dy = b[1] - a[1];
    let w = Math.atan2(dy, dx) * 180 / Math.PI; if (w < 0) w += 360;
    const k = Math.round(w / 45) % 8, abw = Math.abs(w - k * 45 - (k === 0 && w > 300 ? 360 : 0));
    return { r: RICHT[k], eindeutig: abw <= 13 && Math.hypot(dx, dy) > 0.6 };
  }
  function himmelsrichtung(art, def) {
    const namen = Object.keys(def.orte);
    let a, b, r;
    for (let i = 0; i < 200; i++) { a = pick(namen); b = pick(namen); if (a === b) continue; r = richtung(def.orte[a], def.orte[b]); if (r.eindeutig) break; }
    const ch = shuffle([r.r, ...shuffle(RICHT.filter((x) => x !== r.r)).slice(0, 3)]);
    const orte = [[a, ...def.orte[a], { hell: true }], [b, ...def.orte[b]]];
    const fig = GK[def.art](Object.assign({}, def.opts || {}, { orte, nord: true }));
    return { prompt: `Von <b>${a}</b> aus gesehen: In welcher Himmelsrichtung liegt <b>${b}</b>?`, figure: fig, choices: ch, correct: ch.indexOf(r.r), hint: 'Norden ist auf Karten oben, Süden unten, Osten rechts, Westen links.',
      solution: `${b} liegt von ${a} aus im <b>${r.r}</b>.`,
      ex: { mode: 'karte', nach: false, art, q: `Von ${a} aus: Wo liegt ${b}?`, opts: [`im ${r.r}`], ok: 0, svg: karte(def.art, Object.assign({}, def.opts || {}, { orte, nord: true })), merk: `<b>im ${r.r}</b>: Auf der Karte ist oben Norden, rechts Osten.` } };
  }
  Object.assign(U, { flaecheTippen, flaecheNennen, ortTippen, ortNennen, flussNennen, himmelsrichtung, richtung });

  // =====================================================
  // Maßstab: Karte ↔ Wirklichkeit
  // =====================================================
  const MASS = [10000, 20000, 25000, 50000, 100000, 200000, 250000, 500000, 1000000];
  const tausend = (z) => String(z).replace(/\B(?=(\d{3})+(?!\d))/g, '\u00a0');   // geschütztes Leerzeichen: die Zahl bricht nicht um
  // Wie viel in Wirklichkeit ist 1 cm auf der Karte? (Text)
  const cmText = (m) => (m >= 100000 ? `${String(m / 100000).replace('.', ',')}\u00a0km` : `${m / 100}\u00a0m`);
  function massstabRechnen(art, schwer) {
    const m = pick(schwer ? MASS : MASS.filter((x) => [25000, 50000, 100000, 200000, 500000, 1000000].includes(x)));
    const cm = R(2, schwer ? 15 : 9), echtM = cm * m / 100, km = echtM >= 1000;
    const wert = km ? echtM / 1000 : echtM, einheit = km ? 'km' : 'm';
    const t = { prompt: `Der Maßstab einer Karte ist <b>1 : ${tausend(m)}</b>. Auf der Karte misst du <b>${cm} cm</b>. Wie weit ist das in Wirklichkeit?`,
      fields: [{ answer: wert, suffix: einheit, label: 'Wirklichkeit' }], hint: `1 : ${tausend(m)} heißt: 1 cm auf der Karte sind ${tausend(m)} cm in Wirklichkeit, also ${cmText(m)}.`,
      solution: `1 cm ≙ ${cmText(m)}, also ${cm} · ${cmText(m)} = <b>${String(wert).replace('.', ',')} ${einheit}</b>.`,
      ex: { mode: 'massstab', art, m, cm, wert, einheit } };
    return t;
  }
  // Rückwärts: Wie viele cm auf der Karte?
  function massstabRueck(art) {
    const m = pick([25000, 50000, 100000, 200000, 500000, 1000000]), cm = R(2, 10), echtM = cm * m / 100, km = echtM >= 1000, wert = km ? echtM / 1000 : echtM, einheit = km ? 'km' : 'm';
    return { prompt: `Maßstab <b>1 : ${tausend(m)}</b>. Zwei Orte sind in Wirklichkeit <b>${String(wert).replace('.', ',')} ${einheit}</b> voneinander entfernt. Wie viele Zentimeter sind das auf der Karte?`,
      fields: [{ answer: cm, suffix: 'cm', label: 'auf der Karte' }], hint: `1 cm auf der Karte sind ${cmText(m)} in Wirklichkeit. Wie oft passt ${cmText(m)} in ${String(wert).replace('.', ',')} ${einheit}?`,
      solution: `1 cm ≙ ${cmText(m)}. ${String(wert).replace('.', ',')} ${einheit} : ${cmText(m)} = <b>${cm} cm</b>.`,
      ex: { mode: 'massstab', art, m, cm, wert, einheit, rueck: true } };
  }
  // Was bedeutet der Maßstab? (1 cm ≙ …)
  function massstabBedeutung(art) {
    const m = pick([10000, 25000, 50000, 100000, 200000, 500000, 1000000]), ok = cmText(m);
    const falsch = shuffle(MASS.filter((x) => x !== m).map(cmText)).slice(0, 3);
    const ch = shuffle([ok, ...falsch]);
    return { prompt: `Maßstab <b>1 : ${tausend(m)}</b>. Wie weit sind <b>1 cm</b> auf der Karte in Wirklichkeit?`, choices: ch, correct: ch.indexOf(ok), hint: '100 cm sind 1 m, 100 000 cm sind 1 km.',
      solution: `1 cm ≙ ${tausend(m)} cm = <b>${ok}</b>.`, ex: { mode: 'massstab', art, m, cm: 1, wert: m >= 100000 ? m / 100000 : m / 100, einheit: m >= 100000 ? 'km' : 'm' } };
  }
  Object.assign(U, { massstabRechnen, massstabRueck, massstabBedeutung, tausend });

  // =====================================================
  // Diagramme lesen (Säulendiagramm aus nachgeschlagenen Zahlen)
  // =====================================================
  const DIAGRAMME = [
    { titel: 'Höchste Berge (in m)', einheit: 'm', daten: [['Zugspitze', 2962], ['Feldberg', 1493], ['Fichtelberg', 1215], ['Brocken', 1141]], schritt: 500 },
    { titel: 'Flüsse: Länge in Deutschland (in km)', einheit: 'km', daten: [['Rhein', 865], ['Elbe', 727], ['Donau', 647]], schritt: 200 },
    { titel: 'Einwohner sächsischer Großstädte 2023 (in Tausend)', einheit: 'Tausend', daten: [['Leipzig', 620], ['Dresden', 566], ['Chemnitz', 251]], schritt: 100 },
    { titel: 'Nutzung der Fläche Deutschlands 2024 (in %)', einheit: '%', daten: [['Landwirtschaft', 50, 'Landwirt-|schaft'], ['Wald', 30], ['Siedlung und Verkehr', 15, 'Siedlung|und Verkehr'], ['Wasser', 2]], schritt: 10 },
    { titel: 'Größe der Kontinente (in Mio. km²)', einheit: 'Mio. km²', daten: [['Asien', 44], ['Afrika', 30], ['Nordamerika', 25, 'Nord-|amerika'], ['Südamerika', 18, 'Süd-|amerika'], ['Europa', 10]], schritt: 10 },
    { titel: 'Einwohner der größten Städte Deutschlands (in Mio.)', einheit: 'Mio.', daten: [['Berlin', 3.7], ['Hamburg', 1.9], ['München', 1.6]], schritt: 1 },
  ];
  function saeulen(d, hell) {
    const n = d.daten.length, W = 300, H = 196, X0 = 44, Y0 = 150, top = 34, max = Math.ceil(Math.max(...d.daten.map((x) => x[1])) / d.schritt) * d.schritt;
    const feld = (W - X0 - 10) / n, bw = Math.min(46, feld - 10), F = 'Nunito,sans-serif', T = '#2b2540';
    let s = `<rect width="${W}" height="${H}" fill="#fff"/><text x="${W / 2}" y="14" text-anchor="middle" style="font:800 12px ${F};fill:${T}">${d.titel.split(' (')[0]}</text><text x="${W / 2}" y="27" text-anchor="middle" style="font:700 10px ${F};fill:#5d5870">${d.titel.includes(' (') ? d.titel.split(' (')[1].replace(')', '') : ''}</text>`;
    for (let v = 0; v <= max; v += d.schritt) { const y = Y0 - (v / max) * (Y0 - top); s += `<line x1="${X0}" y1="${y}" x2="${W - 8}" y2="${y}" stroke="#e3ddd0" stroke-width="1"/><text x="${X0 - 5}" y="${y + 3.5}" text-anchor="end" style="font:700 10.5px ${F};fill:#5d5870">${String(v).replace('.', ',')}</text>`; }
    d.daten.forEach(([name, v, zeilen], i) => {
      const xm = X0 + 5 + feld * (i + 0.5), h = (v / max) * (Y0 - top);
      s += `<rect x="${xm - bw / 2}" y="${Y0 - h}" width="${bw}" height="${h}" rx="2" fill="${name === hell ? '#1f55d6' : '#0e9fb5'}"/>`;
      // lange Namen stehen in zwei Zeilen (in den Daten mit | getrennt), damit sich die Beschriftungen nicht überdecken
      const teile = zeilen ? zeilen.split('|') : [name];
      teile.slice(0, 2).forEach((t, k) => { s += `<text x="${xm}" y="${Y0 + 14 + k * 12}" text-anchor="middle" style="font:700 10.5px ${F};fill:${T}">${t}</text>`; });
    });
    s += `<line x1="${X0}" y1="${Y0}" x2="${W - 8}" y2="${Y0}" stroke="${T}" stroke-width="1.2"/><line x1="${X0}" y1="${top - 6}" x2="${X0}" y2="${Y0}" stroke="${T}" stroke-width="1.2"/>`;
    return `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Säulendiagramm" style="max-width:100%;height:auto">${s}</svg>`;
  }
  D.saeulen = saeulen; D.DIAGRAMME = DIAGRAMME;
  const zahl = (v) => String(v).replace('.', ',');
  function diagramm(art) {
    const d = pick(DIAGRAMME), sort = d.daten.slice().sort((a, b) => b[1] - a[1]);
    const typ = R(0, 3);
    const key = 'diag' + DIAGRAMME.indexOf(d);
    if (!BILDER[key]) BILDER[key] = () => saeulen(d);
    if (typ === 0) {
      const gross = R(0, 1) === 0, ziel = gross ? sort[0] : sort[sort.length - 1], ch = shuffle(d.daten.map((x) => x[0])).slice(0, 4);
      if (!ch.includes(ziel[0])) ch[0] = ziel[0];
      const c = shuffle(ch);
      return { prompt: `Lies das Diagramm: Wo ist der Wert am <b>${gross ? 'größten' : 'kleinsten'}</b>?`, figure: saeulen(d), choices: c, correct: c.indexOf(ziel[0]), hint: `Vergleiche die Höhe der Säulen.`,
        solution: `Die ${gross ? 'höchste' : 'niedrigste'} Säule gehört zu <b>${ziel[0]}</b> (${zahl(ziel[1])} ${d.einheit}).`,
        ex: { mode: 'karte', nach: false, art, q: `${d.titel}: am ${gross ? 'größten' : 'kleinsten'}?`, opts: [ziel[0]], ok: 0, svg: key, merk: `<b>${ziel[0]}</b>: Die ${gross ? 'höchste' : 'niedrigste'} Säule zeigt den ${gross ? 'größten' : 'kleinsten'} Wert.` } };
    }
    if (typ === 1) {
      const z = pick(d.daten), ok = `etwa ${zahl(z[1])} ${d.einheit}`;
      const falsch = shuffle(d.daten.filter((x) => x[1] !== z[1]).map((x) => `etwa ${zahl(x[1])} ${d.einheit}`).concat([`etwa ${zahl(Math.round(z[1] * 2 * 10) / 10)} ${d.einheit}`, `etwa ${zahl(Math.round(z[1] / 2 * 10) / 10)} ${d.einheit}`])).filter((x) => x !== ok);
      const c = shuffle([ok, ...[...new Set(falsch)].slice(0, 3)]);
      return { prompt: `Lies im Diagramm ab: Welchen Wert hat <b>${z[0]}</b>?`, figure: saeulen(d, z[0]), choices: c, correct: c.indexOf(ok), hint: 'Gehe vom oberen Rand der Säule waagerecht nach links zur Achse.',
        solution: `${z[0]}: <b>${ok}</b>.`, ex: { mode: 'karte', nach: false, art, q: `${d.titel}: ${z[0]}?`, opts: [ok], ok: 0, svg: key, merk: `<b>${ok}</b>: Lies am oberen Rand der Säule waagerecht zur Achse.` } };
    }
    if (typ === 2) {
      return U.ordnen(art, { t: `Ordne nach dem Diagramm „${d.titel.replace(/ \(.*\)/, '')}“: der größte Wert zuerst.`, items: sort.map((x) => x[0]), w: sort.map((x) => `${x[0]} (${zahl(x[1])} ${d.einheit})`).join(' > '), svg: key });
    }
    // Unterschied
    const [a, b] = shuffle(d.daten).slice(0, 2).sort((x, y) => y[1] - x[1]), diff = Math.round((a[1] - b[1]) * 10) / 10;
    return { prompt: `Lies das Diagramm: Um wie viel ist der Wert von <b>${a[0]}</b> größer als der von <b>${b[0]}</b>?`, figure: saeulen(d), fields: [{ answer: diff, suffix: d.einheit, label: 'Unterschied' }],
      hint: 'Lies beide Werte ab und rechne: großer Wert minus kleiner Wert.', solution: `${zahl(a[1])} − ${zahl(b[1])} = <b>${zahl(diff)} ${d.einheit}</b>.`,
      ex: { mode: 'karte', nach: false, art, q: `Unterschied ${a[0]} und ${b[0]}?`, opts: [`${zahl(diff)} ${d.einheit}`], ok: 0, svg: key, merk: `<b>${zahl(a[1])} − ${zahl(b[1])} = ${zahl(diff)}</b>: großer Wert minus kleiner Wert.` } };
  }
  U.diagramm = diagramm;

  // =====================================================
  // Fotos (Wikimedia Commons). Ohne Netz erscheint statt des Fotos eine Karte mit dem Namen.
  // =====================================================
  const platzhalter = (name) => () => `<svg viewBox="0 0 200 120" role="img" aria-label="${name}" style="max-width:100%;height:auto"><rect width="200" height="120" fill="#eef3f6"/><text x="100" y="58" text-anchor="middle" style="font:700 10px Nunito,sans-serif;fill:#6f6a7c">Foto: ${name}</text><text x="100" y="74" text-anchor="middle" style="font:600 8px Nunito,sans-serif;fill:#9a94a8">(lädt, wenn Internet da ist)</text></svg>`;
  D.fotos = D.fotos || {};
  // Die Fotos selbst stehen in themen/fotos.js (FOTOS). Hier: als Bilder anmelden.
  D.fotosAnmelden = function () {
    Object.entries(D.fotos).forEach(([name, f]) => { BILDER[name] = f.datei ? () => LernDaxBausteine.fotoBild(platzhalter(f.titel || name), f) : platzhalter(f.titel || name); });
  };
})();
