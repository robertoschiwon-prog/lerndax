/* GeoDax – schematische Zeichnungen (keine Landschaften, keine Tiere: dafür gibt es Fotos und Karten)
 *   D.tagNachtBild(k)   Erde von oben über dem Nordpol, Sonne rechts; k = 0 Mitternacht, 1 Sonnenaufgang, 2 Mittag, 3 Sonnenuntergang
 *   D.jahrBild(k)       Sonne in der Mitte, Erde links (k = 0, Sommer auf der Nordhalbkugel) oder rechts (k = 1, Winter)
 *   D.steigungBild()    Gebirge im Querschnitt, Wind von links
 *   D.talBild(k)        Talquerschnitt; k = 0 Klamm, 1 Kerbtal, 2 Sohlental, 3 Muldental
 *   D.planeten          die acht Planeten: Name, Durchmesser in km, Abstand zur Sonne in Mio. km (NASA), Farbe
 *   D.planetenReihe(o)  Reihenfolge von der Sonne aus (Größen und Abstände nur angedeutet)
 *                       o.frage = k: Planet k ohne Name, mit „?“; o.nummern = [k, …]: keine Namen, diese Planeten mit 1, 2, … zum Antippen
 *   D.planetenGroessen(o)  alle im selben Maßstab, Sonne als Rand; o.frage = k: Namen weg, Planet k markiert
 *   D.planetenAbstaende(o) Abstände im selben Maßstab, darunter der Anfang vergrößert; o.frage = k wie oben
 */
(function () {
  const D = window.GeoDax;
  const T = '#2b2540', BLAU = '#1f55d6', ROT = '#d0443a', GELB = '#ffcf4a', NACHT = '#3a3f6e', TAG = '#cfe6ff';
  const svg = (w, h, inhalt, name) => `<svg viewBox="0 0 ${w} ${h}" role="img" aria-label="${name}" style="max-width:100%;height:auto"><rect width="${w}" height="${h}" fill="#fff"/>${inhalt}</svg>`;
  const tx = (x, y, t, fs, farbe, anker, w) => `<text x="${x}" y="${y}" text-anchor="${anker || 'middle'}" style="font:${w || 800} ${fs || 9}px Nunito,sans-serif;fill:${farbe || T}">${t}</text>`;
  const pfeilspitze = (x, y, w) => { const a = w * Math.PI / 180, p = (d, s) => `${(x + Math.cos(a + d) * s).toFixed(1)} ${(y + Math.sin(a + d) * s).toFixed(1)}`; return `<path d="M${x} ${y} L${p(2.6, 7)} L${p(-2.6, 7)}Z" fill="${T}"/>`; };

  // Sonnenstrahlen von rechts
  const strahlen = (x, y0, y1, n) => Array.from({ length: n }, (_, i) => { const y = y0 + (i * (y1 - y0)) / (n - 1); return `<line x1="${x}" y1="${y}" x2="${x - 26}" y2="${y}" stroke="${GELB}" stroke-width="2.2"/>` + pfeilspitze(x - 30, y, 180); }).join('');

  D.tagNachtBild = function (k) {
    const cx = 92, cy = 70, r = 46, w = [180, 90, 0, 270][k] * Math.PI / 180;
    const px = cx + Math.cos(w) * r * 0.82, py = cy + Math.sin(w) * r * 0.82;
    let s = `<path d="M${cx} ${cy - r} A${r} ${r} 0 0 1 ${cx} ${cy + r}Z" fill="${TAG}"/><path d="M${cx} ${cy - r} A${r} ${r} 0 0 0 ${cx} ${cy + r}Z" fill="${NACHT}"/>`;
    s += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${T}" stroke-width="1.6"/><circle cx="${cx}" cy="${cy}" r="3" fill="${T}"/>`;
    s += tx(cx + 20, cy - 6, 'Nordpol', 7, T, 'middle', 700);
    // Drehrichtung: gegen den Uhrzeigersinn (von oben gesehen)
    const R2 = r + 10, a0 = 200 * Math.PI / 180, a1 = 250 * Math.PI / 180;
    s += `<path d="M${(cx + Math.cos(a0) * R2).toFixed(1)} ${(cy - Math.sin(a0) * R2).toFixed(1)} A${R2} ${R2} 0 0 0 ${(cx + Math.cos(a1) * R2).toFixed(1)} ${(cy - Math.sin(a1) * R2).toFixed(1)}" fill="none" stroke="${T}" stroke-width="1.6"/>`;
    s += pfeilspitze(+(cx + Math.cos(a1) * R2).toFixed(1), +(cy - Math.sin(a1) * R2).toFixed(1), 20);
    s += tx(cx - 50, cy + 60, 'Drehrichtung', 7.5, T, 'middle', 700);
    s += `<circle cx="${px.toFixed(1)}" cy="${py.toFixed(1)}" r="5" fill="${ROT}" stroke="#fff" stroke-width="1.5"/>`;
    s += strahlen(196, 34, 106, 4) + `<circle cx="214" cy="70" r="15" fill="${GELB}"/>` + tx(214, 98, 'Sonne', 8);
    s += tx(cx + 24, 18, 'Tag', 8, '#5a6e8a') + tx(cx - 24, 18, 'Nacht', 8, NACHT);
    return svg(232, 140, s, 'Erde von oben mit Tag- und Nachtseite');
  };

  D.jahrBild = function (k) {
    const sx = 120, sy = 62, ex = k === 0 ? 34 : 206, r = 17, neig = 23.5 * Math.PI / 180;
    let s = `<ellipse cx="${sx}" cy="${sy}" rx="86" ry="28" fill="none" stroke="#c9c2b4" stroke-width="1.2" stroke-dasharray="4 3"/>`;
    s += `<circle cx="${sx}" cy="${sy}" r="16" fill="${GELB}"/>` + tx(sx, sy + 30, 'Sonne', 8);
    // Erde: Tagseite zur Sonne
    const zurSonne = k === 0 ? 1 : -1;
    s += `<circle cx="${ex}" cy="${sy}" r="${r}" fill="${NACHT}"/><path d="M${ex} ${sy - r} A${r} ${r} 0 0 ${zurSonne > 0 ? 1 : 0} ${ex} ${sy + r}Z" fill="${TAG}"/><circle cx="${ex}" cy="${sy}" r="${r}" fill="none" stroke="${T}" stroke-width="1.4"/>`;
    // Achse: immer gleich schräg (oben nach rechts geneigt)
    const dx = Math.sin(neig) * (r + 9), dy = Math.cos(neig) * (r + 9);
    s += `<line x1="${(ex - dx).toFixed(1)}" y1="${(sy + dy).toFixed(1)}" x2="${(ex + dx).toFixed(1)}" y2="${(sy - dy).toFixed(1)}" stroke="${ROT}" stroke-width="2"/>`;
    s += tx(+(ex + dx).toFixed(1) + 2, +(sy - dy).toFixed(1) - 3, 'N', 8.5, ROT, 'start');
    // Äquator
    s += `<line x1="${(ex - Math.cos(neig) * r).toFixed(1)}" y1="${(sy - Math.sin(neig) * r).toFixed(1)}" x2="${(ex + Math.cos(neig) * r).toFixed(1)}" y2="${(sy + Math.sin(neig) * r).toFixed(1)}" stroke="${T}" stroke-width=".9" stroke-dasharray="2 2"/>`;
    s += `<circle cx="${ex}" cy="${sy + r + 12}" r="3" fill="${BLAU}"/>` + tx(ex, sy + r + 24, 'Erde hier', 7.5, BLAU);
    return svg(240, 124, s, 'Erde auf der Bahn um die Sonne');
  };

  const BERG = 'M0 128 L70 126 C110 120 130 80 150 50 C160 38 170 36 180 48 C200 76 220 112 260 122 L300 126 L300 140 L0 140Z';
  D.bergPfad = BERG;
  D.steigungBild = function () {
    let s = `<path d="M0 128 L60 128 L60 140 L0 140Z" fill="#9cc8f0"/>` + tx(30, 120, 'Meer', 8, '#2a6fb0');
    s += `<path d="${BERG}" fill="#b9a27a" stroke="${T}" stroke-width="1.2"/>`;
    s += `<path d="M10 70 L54 70" stroke="${T}" stroke-width="2"/>` + pfeilspitze(60, 70, 0) + tx(32, 62, 'Wind', 8.5);
    // aufsteigende Luft am Hang
    s += `<path d="M80 112 C100 104 116 82 130 58" fill="none" stroke="${BLAU}" stroke-width="1.8" stroke-dasharray="4 3"/>` + pfeilspitze(130, 58, -60);
    s += `<path d="M190 50 C206 70 226 96 252 108" fill="none" stroke="${BLAU}" stroke-width="1.8" stroke-dasharray="4 3"/>` + pfeilspitze(252, 108, 25);
    s += tx(84, 140 - 4, 'links', 8, '#fff') + tx(250, 140 - 4, 'rechts', 8, '#fff');
    return svg(300, 140, s, 'Gebirge im Querschnitt, Wind von links');
  };

  const TAELER = [
    'M0 30 L92 30 L96 96 L104 96 L108 30 L200 30 L200 120 L0 120Z', // Klamm
    'M0 30 L40 30 L96 96 L104 96 L160 30 L200 30 L200 120 L0 120Z', // Kerbtal
    'M0 30 L34 30 L60 90 L140 90 L166 30 L200 30 L200 120 L0 120Z', // Sohlental
    'M0 40 C40 42 60 86 100 88 C140 86 160 42 200 40 L200 120 L0 120Z', // Muldental
  ];
  const WASSER = [[95, 105, 92], [93, 107, 92], [92, 108, 86], [88, 112, 84]];
  D.talBild = function (k) {
    const [a, b, y] = WASSER[k];
    let s = `<path d="${TAELER[k]}" fill="#c9b48a" stroke="${T}" stroke-width="1.4"/>`;
    s += `<path d="M${a} ${y} L${b} ${y} L${(a + b) / 2 + 2} ${y + 6} L${(a + b) / 2 - 2} ${y + 6}Z" fill="#5aa0e6"/>`;
    return svg(200, 120, s, 'Querschnitt durch ein Tal');
  };

  // ===================================================== Planeten
  // Durchmesser (km) und mittlerer Abstand zur Sonne (Mio. km): NASA Planetary Fact Sheet
  const PL = D.planeten = [
    { n: 'Merkur', d: 4879, a: 57.9, f: '#9a948c' }, { n: 'Venus', d: 12104, a: 108.2, f: '#e3b563' },
    { n: 'Erde', d: 12756, a: 149.6, f: '#3f7fd9' }, { n: 'Mars', d: 6792, a: 228, f: '#c8553a' },
    { n: 'Jupiter', d: 142984, a: 778.5, f: '#d9a878' }, { n: 'Saturn', d: 120536, a: 1432, f: '#e2c98f', ring: 1 },
    { n: 'Uranus', d: 51118, a: 2867, f: '#8fd3d6' }, { n: 'Neptun', d: 49528, a: 4515, f: '#4a6fd0' },
  ];
  const ALL = '#0d0e22', HELL = '#fff', LEISE = '#b9bfe6';
  const r1 = (z) => +z.toFixed(2);
  // Echte Aufnahmen (NASA, gemeinfrei, Wikimedia Commons). f = [Mitte x, Mitte y, Radius] als Anteil der Bildbreite bzw. -höhe,
  // q = Höhe : Breite. Ausgemessen im eingebauten Browser. Ohne Netz bleibt die gezeichnete Kugel stehen.
  const FOTO = D.planetenFotos = {
    Sonne: { datei: "The Sun by the Atmospheric Imaging Assembly of NASA's Solar Dynamics Observatory - 20100819.jpg", f: [0.5, 0.4989, 0.405], q: 0.9545, b: 640, von: 'NASA/SDO' },
    Merkur: { datei: 'Mercury in true color.jpg', f: [0.495, 0.499, 0.459], q: 1, von: 'NASA/JHUAPL' },
    Venus: { datei: 'PIA23791-Venus-RealAndEnhancedContrastViews-20200608 (cropped).jpg', f: [0.513, 0.4995, 0.428], q: 1, von: 'NASA/JPL-Caltech' },
    Erde: { datei: 'The Earth seen from Apollo 17.jpg', f: [0.4985, 0.4965, 0.4445], q: 1.0007, von: 'NASA, Apollo 17' },
    Mars: { datei: 'Mars Valles Marineris.jpeg', f: [0.5, 0.494, 0.494], q: 1, von: 'NASA/USGS' },
    Jupiter: { datei: 'Jupiter and its shrunken Great Red Spot.jpg', f: [0.502, 0.498, 0.4535], q: 1, von: 'NASA, ESA, A. Simon' },
    Saturn: { datei: 'Saturn during Equinox.jpg', f: [0.4984, 0.5065, 0.168], q: 0.4844, ring: 1, b: 640, von: 'NASA/JPL/SSI' },
    Uranus: { datei: "Uranus as seen by NASA's Voyager 2 (remastered) - JPEG converted.jpg", f: [0.494, 0.496, 0.401], q: 1, von: 'NASA' },
    Neptun: { datei: 'Neptune Full.jpg', f: [0.4875, 0.4955, 0.42], q: 1, von: 'NASA' },
    Mond: { datei: 'Moon nearside LRO.jpg', f: [0.5, 0.5, 0.5], q: 1, von: 'NASA/GSFC/ASU' },
  };
  let clipNr = 0;
  const urlVon = (f) => (window.LernDaxBausteine && LernDaxBausteine.fotoUrl ? LernDaxBausteine.fotoUrl(f.datei, f.b || 320) : '');
  // Foto als Kugel (beim Saturn mit Ringen). ersatz: Zeichnung, die verschwindet, sobald das Foto geladen ist.
  // zoom > 1: Foto größer als die Kugel (nur die Mitte zu sehen), z. B. für einen winzigen Rand der riesigen Sonne,
  // der sonst nur aus dem dunklen Sonnenrand bestünde.
  D.planetFoto = function (name, x, y, r, ersatz, extra, zoom) {
    const f = FOTO[name], url = f && urlVon(f);
    if (!url) return `<g${extra || ''}>${ersatz}</g>`;
    const w = r / f.f[2] * (zoom || 1), h = w * f.q, id = 'gpl' + (++clipNr);
    const bild = `<image href="${url}" x="${r1(x - f.f[0] * w)}" y="${r1(y - f.f[1] * h)}" width="${r1(w)}" height="${r1(h)}" preserveAspectRatio="none"`
      + (f.ring ? ' style="mix-blend-mode:screen"' : ` clip-path="url(#${id})"`) + ` onload="this.parentNode.firstChild.setAttribute('visibility','hidden')"/>`;
    return `<g${extra || ''}><g>${ersatz}</g>${f.ring ? '' : `<clipPath id="${id}"><circle cx="${x}" cy="${y}" r="${r1(r - Math.min(r * 0.015, 0.8))}"/></clipPath>`}${bild}</g>`;
  };
  const sonne = (x, y, r) => D.planetFoto('Sonne', x, y, r, `<circle cx="${x}" cy="${y}" r="${r1(r)}" fill="${GELB}"/>`);
  const nachweis = (W) => tx(W - 6, 12, 'Fotos: NASA', 8, LEISE, 'end', 700);
  const zeichnung = (p, x, y, r) => (p.ring ? `<ellipse cx="${x}" cy="${y}" rx="${r1(r * 1.9)}" ry="${r1(r * 0.42)}" fill="none" stroke="#cdb98a" stroke-width="${r1(Math.max(1, r * 0.22))}"/>` : '')
    + `<circle cx="${x}" cy="${y}" r="${r1(r)}" fill="${p.f}"/>`
    + (p.ring ? `<path d="M${r1(x - r * 1.9)} ${y} A${r1(r * 1.9)} ${r1(r * 0.42)} 0 0 0 ${r1(x + r * 1.9)} ${y}" fill="none" stroke="#cdb98a" stroke-width="${r1(Math.max(1, r * 0.22))}"/>` : '');
  const kugel = (p, x, y, r, extra) => D.planetFoto(p.n, x, y, r, zeichnung(p, x, y, r), extra);
  const all = (w, h, inhalt, name) => `<svg viewBox="0 0 ${w} ${h}" role="img" aria-label="${name}" style="max-width:100%;height:auto"><rect width="${w}" height="${h}" rx="8" fill="${ALL}"/>${inhalt}${nachweis(w)}</svg>`;
  const marke = (x, y, r) => `<circle cx="${x}" cy="${y}" r="${r1(r)}" fill="none" stroke="#ff6b5e" stroke-width="2.2"/>`;
  const nummer = (x, y, i) => `<circle cx="${x}" cy="${y}" r="9" fill="${HELL}" stroke="${BLAU}" stroke-width="1.6"/>` + tx(x, y + 3.6, i, 11, BLAU);

  D.planetenReihe = function (o) {
    o = o || {};
    const W = 330, H = 138, Y = 62, nr = o.nummern || [];
    let s = sonne(-30, Y, 67) + `<text x="16" y="${Y + 4}" text-anchor="middle" style="font:800 10.5px Nunito,sans-serif;fill:#fff;paint-order:stroke;stroke:#5a2a00;stroke-width:2.5px">Sonne</text>`;
    PL.forEach((p, i) => {
      const x = 58 + i * 35.5, r = (3.2 + 2.3 * Math.sqrt(p.d / 12756)) * (p.ring ? 0.7 : 1), k = nr.indexOf(i);   // Saturn kleiner: seine echten Ringe sind breit
      const wahl = k >= 0 ? ` data-wahl="${k}"` : '';
      s += kugel(p, x, Y, r, wahl);
      if (k >= 0) s += `<g${wahl}><rect x="${x - 16}" y="${Y - 34}" width="32" height="80" fill="transparent"/>${nummer(x, Y + 30, k + 1)}</g>`;
      else if (o.frage === i) s += marke(x, Y, r + 5) + tx(x, Y + (i % 2 ? 36 : -24), '?', 16, '#ff8a7e');
      else if (!nr.length) s += tx(i === 7 ? Math.min(x, W - 22) : x, Y + (i % 2 ? 34 : -23), p.n, 11.5, HELL, 'middle', 700);
    });
    s += tx(W / 2, H - 9, 'Die Reihenfolge stimmt, Größen und Abstände nicht.', 9.5, LEISE, 'middle', 700);
    return all(W, H, s, 'Die acht Planeten in ihrer Reihenfolge von der Sonne aus');
  };

  D.planetenGroessen = function (o) {
    o = o || {};
    const W = 330, H = 152, Y = 54, M = 56 / 142984;           // Jupiter ist 56 Einheiten breit
    const X = [38, 56, 75, 94, 135, 224, 295, 317];   // Saturns Ringe brauchen Platz
    let s = sonne(19 - 1392000 * M / 2, Y, 1392000 * M / 2) + `<text transform="translate(12.5 ${Y}) rotate(-90)" text-anchor="middle" style="font:800 10.5px Nunito,sans-serif;fill:#fff;paint-order:stroke;stroke:#5a2a00;stroke-width:2.5px">Rand der Sonne</text>`;
    PL.forEach((p, i) => {
      const r = Math.max(1.2, p.d * M / 2), yN = i % 2 && (i < 4 || i === 7) ? 121 : 106;
      s += kugel(p, X[i], Y, r);
      if (o.frage === i) s += marke(X[i], Y, r + 4) + tx(X[i], 108, '?', 16, '#ff8a7e');
      else if (o.frage == null) {
        s += i === 7 ? tx(W - 5, yN, p.n, 11.5, HELL, 'end', 700) : tx(X[i], yN, p.n, 11.5, HELL, 'middle', 700);
        if (i < 4) s += `<line x1="${X[i]}" y1="${Y + r + 3}" x2="${X[i]}" y2="${yN - 11}" stroke="${LEISE}" stroke-width=".7"/>`;
      }
    });
    s += tx(W / 2, H - 9, 'Die Größen stimmen, die Abstände nicht.', 9.5, LEISE, 'middle', 700);
    return all(W, H, s, 'Die Sonne und die acht Planeten im selben Größenmaßstab');
  };

  D.planetenAbstaende = function (o) {
    o = o || {};
    const W = 330, H = 182, X0 = 16, Y1 = 40, Y2 = 122, M1 = 300 / 4515, M2 = 290 / 800, SCHUB = [-5, 0, 6, 0, 0, 0, 0, 0];
    const punkt = (p, x, y, i, oben, anker) => kugel(p, r1(x), y, i > 3 ? 5 : 3.8)
      + (o.frage === i ? marke(r1(x), y, 8) + tx(r1(x), oben ? y - 13 : y + 24, '?', 15, '#ff8a7e') : o.frage == null ? tx(r1(x + (y === Y2 ? SCHUB[i] : 0)), oben ? y - 11 : y + 20, p.n, 11.5, HELL, anker || 'middle', 700) : '');
    // oben: alle acht im selben Maßstab
    let s = `<line x1="${X0}" y1="${Y1}" x2="${W - 8}" y2="${Y1}" stroke="${LEISE}" stroke-width="1"/>` + sonne(X0 - 6, Y1, 9);
    PL.forEach((p, i) => { if (i > 3) s += punkt(p, X0 + p.a * M1, Y1, i, true, i === 7 ? 'end' : 'middle'); else s += `<circle cx="${r1(X0 + p.a * M1)}" cy="${Y1}" r="2" fill="${p.f}"/>`; });
    // Lupe: der Anfang bis zum Jupiter
    const xj = X0 + 800 * M1;
    s += `<path d="M${X0} ${Y1 + 7} L${X0} ${Y2 - 36} M${r1(xj)} ${Y1 + 7} L${W - 12} ${Y2 - 36}" stroke="${LEISE}" stroke-width=".8" stroke-dasharray="3 3" fill="none"/>`;
    s += tx(W / 2 - 20, Y2 - 40, 'der Anfang, vergrößert', 10, LEISE, 'middle', 700);
    s += `<line x1="${X0}" y1="${Y2}" x2="${W - 12}" y2="${Y2}" stroke="${LEISE}" stroke-width="1"/>` + sonne(X0 - 4, Y2, 11);
    // Asteroidengürtel zwischen Mars und Jupiter
    for (let i = 0; i < 26; i++) s += `<circle cx="${r1(X0 + (330 + (i * 37) % 160) * M2)}" cy="${r1(Y2 - 5 + (i * 7) % 11)}" r=".9" fill="${LEISE}"/>`;
    s += tx(X0 + 425 * M2, Y2 - 12, 'Asteroidengürtel', 10, LEISE, 'middle', 700);
    PL.forEach((p, i) => { if (i < 5) s += punkt(p, X0 + p.a * M2, Y2, i, i % 2 === 1, 'middle'); });
    s += tx(W / 2, H - 9, 'Die Abstände stimmen, die Größen nicht.', 9.5, LEISE, 'middle', 700);
    return all(W, H, s, 'Die Abstände der Planeten von der Sonne im selben Maßstab');
  };
})();
