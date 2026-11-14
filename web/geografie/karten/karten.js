/* GeoDax – Karten aus echten Kartendaten (Natural Earth, gemeinfrei; Daten in karten/daten.js)
 *
 * Jede Funktion liefert ein <svg> als Text. Optionen (alle frei):
 *   hell:    Name oder Liste von Namen, die farbig hervorgehoben werden
 *   nummern: { Name: Nummer } Nummern auf Flächen (mit Zeiger, wo die Fläche klein ist)
 *   wahl:    { Name: Index } Flächen zum Antippen (data-wahl, wirkt wie der Antwortknopf mit diesem Index)
 *   namen:   true = alle Namen zeigen, oder Liste der Namen
 *   fluesse: Liste von Flussnamen; flussHell: ein Fluss in kräftigem Blau; flussNr: { Fluss: Nummer }
 *   orte:    [[Name, Länge, Breite, { nr, hell, ohneName, art: 'stadt'|'berg'|'insel'|'gebiet' }], …]
 *   gradnetz (Welt): true oder { hell: ['aequator', 'nullmeridian', 'breiten', 'laengen', 'wendekreise', 'polarkreise'] }
 *   meere (Welt): { Ozean: Nummer } oder true für Namen
 * Projektion: Welt nach Robinson, Mitteleuropa und Deutschland flächentreu genug (Länge × cos der Mitte).
 */
(function () {
  const K = window.GeoDaxKartendaten;
  const TINTE = '#2b2540', LAND = '#efe8d6', LAND2 = '#e2dac4', WASSER = '#cfe6f6', RAND = '#8f8571', HELL = '#ffcf4a', HELLRAND = '#b8860b', BLAU = '#1f55d6', FLUSS = '#4a90d9';
  const r1 = (v) => Math.round(v * 10) / 10;
  const liste = (x) => (x === undefined || x === null ? [] : [].concat(x));
  // hoch: größte Höhe auf dem Handy (hohe Karten wie Deutschland dürfen höher sein als andere Bilder)
  const S = (w, h, inhalt, label, hoch) => `<svg viewBox="0 0 ${w} ${h}" role="img" aria-label="${label || 'Karte'}" style="max-width:100%;height:auto${hoch ? `;max-height:${hoch}px` : ''}">${inhalt}</svg>`;
  // Z: Größe von Schrift, Nummern und Zeichen je Karte, damit sie auf dem Handy gut lesbar sind
  let Z = 1, BW = 9999, BH = 9999;   // BW, BH: Breite und Höhe der Karte, damit Nummern nicht über den Rand ragen
  const txt = (x, y, t, o) => { o = o || {}; const fs = (o.fs || 9) * Z; return `<text x="${r1(x)}" y="${r1(y)}" text-anchor="${o.anker || 'middle'}" style="font:${o.w || 800} ${fs}px Nunito,sans-serif;fill:${o.farbe || TINTE};paint-order:stroke;stroke:${o.halo || 'rgba(255,255,255,.85)'};stroke-width:${r1((o.halob || 2.6) * Z)}px;stroke-linejoin:round">${t}</text>`; };
  const marke = (x, y, n, o) => { o = o || {}; const r = r1((o.r || 7.5) * Z); return `<circle cx="${r1(x)}" cy="${r1(y)}" r="${r}" fill="${o.fill || '#fff'}" stroke="${o.stroke || TINTE}" stroke-width="1.5"/><text x="${r1(x)}" y="${r1(y + r * 0.45)}" text-anchor="middle" style="font:800 ${r1(r * 1.3)}px Nunito,sans-serif;fill:${o.farbe || TINTE}">${n}</text>`; };

  // ---------------------------------------------------------------- Projektionen
  // Robinson (Tabelle nach Robinson 1974), Ergebnis in Einheiten, x −1…1 ungefähr
  const ROB = [[1, 0], [0.9986, 0.062], [0.9954, 0.124], [0.99, 0.186], [0.9822, 0.248], [0.973, 0.31], [0.96, 0.372], [0.9427, 0.434], [0.9216, 0.4958], [0.8962, 0.5571], [0.8679, 0.6176], [0.835, 0.6769], [0.7986, 0.7346], [0.7597, 0.7903], [0.7186, 0.8435], [0.6732, 0.8936], [0.6213, 0.9394], [0.5722, 0.9761], [0.5322, 1]];
  function robinson(lon, lat) {
    const a = Math.min(90, Math.abs(lat)) / 5, i = Math.min(17, Math.floor(a)), t = a - i;
    const p = ROB[i][0] + (ROB[i + 1][0] - ROB[i][0]) * t, d = ROB[i][1] + (ROB[i + 1][1] - ROB[i][1]) * t;
    return [0.8487 * p * lon * Math.PI / 180, 1.3523 * d * Math.sign(lat)];
  }
  const mercator = (lon, lat) => [lon * Math.PI / 180, Math.log(Math.tan(Math.PI / 4 + Math.max(-84, Math.min(84, lat)) * Math.PI / 360))];

  // Ring [lon,lat,…] → Pfad mit Projektion f (liefert [x,y] in Bildpunkten)
  function pfad(ring, f, zu) {
    let d = '';
    for (let i = 0; i < ring.length; i += 2) { const [x, y] = f(ring[i], ring[i + 1]); d += (i ? 'L' : 'M') + r1(x) + ' ' + r1(y); }
    return d + (zu === false ? '' : 'Z');
  }
  // Schwerpunkt der größten Fläche (für Beschriftungen)
  function mitte(ringe, f) {
    let best = null, bestA = -1;
    for (const r of ringe) {
      const p = []; for (let i = 0; i < r.length; i += 2) p.push(f(r[i], r[i + 1]));
      let A = 0, cx = 0, cy = 0;
      for (let i = 0; i < p.length - 1; i++) { const c = p[i][0] * p[i + 1][1] - p[i + 1][0] * p[i][1]; A += c; cx += (p[i][0] + p[i + 1][0]) * c; cy += (p[i][1] + p[i + 1][1]) * c; }
      if (Math.abs(A) > bestA) { bestA = Math.abs(A); best = A ? [cx / (3 * A), cy / (3 * A)] : p[0]; }
    }
    return best;
  }

  // ---------------------------------------------------------------- Flächenkarte (gemeinsam)
  function flaechen(sammlung, f, o, extra) {
    const hell = liste(o.hell), wahl = o.wahl || {}, nr = o.nummern || {};
    const namen = o.namen === true ? Object.keys(sammlung) : liste(o.namen);
    const zuletzt = extra.zuletzt || [];
    const reihe = Object.keys(sammlung).sort((a, b) => (zuletzt.indexOf(a) - zuletzt.indexOf(b)));
    let s = '';
    for (const n of reihe) {
      const istHell = hell.includes(n), grau = extra.grau && extra.grau(n);
      const fill = istHell ? (o.hellFarbe || HELL) : grau ? LAND2 : (extra.fuell ? extra.fuell(n) : LAND);
      const d = sammlung[n].map((r) => pfad(r, f)).join('');
      s += `<path d="${d}" fill="${fill}" stroke="${istHell ? HELLRAND : RAND}" stroke-width="${istHell ? 1.4 : 0.7}" stroke-linejoin="round"${n in wahl ? ` data-wahl="${wahl[n]}"` : ''}><title>${n in wahl || nr[n] ? '' : n}</title></path>`;
    }
    return { s, namen, nr };
  }
  function beschriftung(sammlung, f, namen, nr, versatz, fs) {
    let s = '';
    const ziel = (n) => (versatz[n] && versatz[n].ziel ? f(...versatz[n].ziel) : mitte(sammlung[n], f));
    for (const n of Object.keys(nr)) {
      if (!sammlung[n]) continue;
      const z = ziel(n), v = versatz[n] && versatz[n].nr ? f(...versatz[n].nr) : null;
      if (v) s += `<line x1="${r1(v[0])}" y1="${r1(v[1])}" x2="${r1(z[0])}" y2="${r1(z[1])}" stroke="${TINTE}" stroke-width="1"/><circle cx="${r1(z[0])}" cy="${r1(z[1])}" r="1.6" fill="${TINTE}"/>`;
      s += marke(...(v || z), nr[n]);
    }
    for (const n of namen) {
      if (!sammlung[n] || nr[n] !== undefined) continue;
      const z = versatz[n] && versatz[n].name ? f(...versatz[n].name) : ziel(n);
      s += txt(z[0], z[1] + 3, n, { fs: fs || 8.5 });
    }
    return s;
  }
  function orteZeichnen(orte, f) {
    let s = '';
    for (const [name, lon, lat, o0] of orte || []) {
      const o = o0 || {}, [x, y] = f(lon, lat), art = o.art || 'stadt';
      const farbe = o.hell ? BLAU : TINTE;
      if (art === 'berg') s += `<path d="M${r1(x - 5 * Z)} ${r1(y + 3.5 * Z)} L${r1(x)} ${r1(y - 4.5 * Z)} L${r1(x + 5 * Z)} ${r1(y + 3.5 * Z)}Z" fill="${o.hell ? BLAU : '#7a5a3a'}" stroke="#fff" stroke-width="1"/>`;
      else if (art === 'gebiet') s += `<circle cx="${r1(x)}" cy="${r1(y)}" r="${r1((o.r || 9) * Z)}" fill="${o.hell ? 'rgba(31,85,214,.25)' : 'rgba(43,37,64,.12)'}" stroke="${farbe}" stroke-width="1.2" stroke-dasharray="2.5 2"/>`;
      else if (art === 'insel') s += `<circle cx="${r1(x)}" cy="${r1(y)}" r="${r1(5.5 * Z)}" fill="none" stroke="${farbe}" stroke-width="1.6"/>`;
      else if (art === 'hauptstadt') s += `<rect x="${r1(x - 3 * Z)}" y="${r1(y - 3 * Z)}" width="${r1(6 * Z)}" height="${r1(6 * Z)}" fill="${o.hell ? BLAU : '#d0443a'}" stroke="#fff" stroke-width="1"/>`;
      else s += `<circle cx="${r1(x)}" cy="${r1(y)}" r="${r1((o.hell ? 3.6 : 2.8) * Z)}" fill="${o.hell ? BLAU : TINTE}" stroke="#fff" stroke-width="1"/>`;
      if (o.nr !== undefined) { let [dx, dy] = (o.nrVersatz || [10, -9]).map((v) => v * Z); const rr = 7 * Z + 1; if (x + dx + rr > BW) dx = -dx; if (x + dx - rr < 0) dx = -dx; if (y + dy - rr < 0) dy = -dy; if (y + dy + rr > BH) dy = -dy; s += `<line x1="${r1(x)}" y1="${r1(y)}" x2="${r1(x + dx)}" y2="${r1(y + dy)}" stroke="${TINTE}" stroke-width=".9"/>` + marke(x + dx, y + dy, o.nr, { r: 7 }); }
      else if (!o.ohneName) { let [dx, dy, anker] = o.lage || [6, 3, 'start']; const breit = name.length * (o.fs || 8) * Z * 0.58; if (anker === 'start' && x + dx * Z + breit > BW - 2) { dx = -dx; anker = 'end'; } else if (anker === 'end' && x + dx * Z - breit < 2) { dx = -dx; anker = 'start'; } s += txt(x + dx * Z, y + dy * Z, name, { fs: o.fs || 8, anker, farbe, w: art === 'gebiet' ? 700 : 800 }); }
    }
    return s;
  }
  function fluesseZeichnen(o, f) {
    const fl = liste(o.fluesse), hell = liste(o.flussHell), nr = o.flussNr || {};
    let s = '', marken = '';
    for (const n of fl) {
      if (!K.fluesse[n]) continue;
      const istHell = hell.includes(n), w = istHell ? 2.6 : ['Rhein', 'Elbe', 'Donau', 'Oder', 'Weser'].includes(n) ? 1.4 : 1;
      s += K.fluesse[n].map((l) => `<path d="${pfad(l, f, false)}" fill="none" stroke="${istHell ? BLAU : FLUSS}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`).join('');
      if (nr[n] !== undefined) {
        const l = K.fluesse[n].reduce((a, b) => (b.length > a.length ? b : a)), k = Math.floor(l.length / 4) * 2, [x, y] = f(l[k], l[k + 1]);
        marken += marke(x, y, nr[n], { r: 6.5, stroke: BLAU, farbe: BLAU });
      }
    }
    return s + marken;
  }

  // ---------------------------------------------------------------- Weltkarte
  const MEERE = { 'Pazifischer Ozean': [[-128, -14], [150, 24]], 'Atlantischer Ozean': [[-35, 15]], 'Indischer Ozean': [[78, -22]], 'Nordpolarmeer': [[30, 80]], 'Südpolarmeer': [[60, -58]] };
  const KONT_MITTE = { Nordamerika: [-102, 46], Südamerika: [-60, -12], Europa: [17, 52], Afrika: [20, 6], Asien: [92, 46], Australien: [134, -24], Antarktis: [20, -80] };
  function welt(o) {
    o = o || {}; Z = 1.5;
    const W = 360, H = 183; BW = W; BH = H; const sx = W / 2 / (0.8487 * Math.PI) * 0.985, f = (lon, lat) => { const [x, y] = robinson(lon, lat); return [W / 2 + x * sx, H / 2 - y * sx * 1.0]; };
    let s = `<rect width="${W}" height="${H}" fill="#fff"/>`;
    // Umriss der Erde (Hintergrund Wasser)
    const um = []; for (let la = -90; la <= 90; la += 5) um.push(f(-180, la)); for (let la = 90; la >= -90; la -= 5) um.push(f(180, la));
    s += `<path d="M${um.map((p) => r1(p[0]) + ' ' + r1(p[1])).join('L')}Z" fill="${WASSER}" stroke="#9cc4e4" stroke-width="1"/>`;
    // Gradnetz
    if (o.gradnetz) {
      const g = o.gradnetz === true ? {} : o.gradnetz, hl = liste(g.hell);
      const linie = (pts, hell, farbe) => `<path d="M${pts.map((p) => r1(p[0]) + ' ' + r1(p[1])).join('L')}" fill="none" stroke="${hell ? farbe || '#d0443a' : '#7fa9cc'}" stroke-width="${hell ? 1.8 : 0.6}"${hell ? '' : ' stroke-dasharray="2 2"'}/>`;
      for (let la = -60; la <= 60; la += 30) { const p = []; for (let lo = -180; lo <= 180; lo += 10) p.push(f(lo, la)); s += linie(p, (la === 0 && hl.includes('aequator')) || (la !== 0 && hl.includes('breiten'))); }
      for (let lo = -180; lo <= 180; lo += 30) { const p = []; for (let la = -90; la <= 90; la += 5) p.push(f(lo, la)); s += linie(p, (lo === 0 && hl.includes('nullmeridian')) || (lo !== 0 && hl.includes('laengen')), lo === 0 ? '#0a7d57' : null); }
      if (hl.includes('wendekreise')) [23.44, -23.44].forEach((la) => { const p = []; for (let lo = -180; lo <= 180; lo += 10) p.push(f(lo, la)); s += linie(p, true, '#c2410c'); });
      if (hl.includes('polarkreise')) [66.56, -66.56].forEach((la) => { const p = []; for (let lo = -180; lo <= 180; lo += 10) p.push(f(lo, la)); s += linie(p, true, '#6a3fb5'); });
    }
    const fl = flaechen(K.welt, f, o, {});
    s += fl.s;
    const vers = {}; for (const k in KONT_MITTE) vers[k] = { ziel: KONT_MITTE[k] };
    s += beschriftung(K.welt, f, fl.namen, fl.nr, vers, 8.5);
    // Meere
    if (o.meere) {
      for (const [m, punkte] of Object.entries(MEERE)) {
        const n = o.meere === true ? null : o.meere[m];
        if (o.meere !== true && n === undefined) continue;
        punkte.forEach(([lo, la]) => {
          const [x, y] = f(lo, la), name = typeof n === 'string' && n.length > 2 ? n : n === undefined || n === null ? m : null;
          if (name === null) { s += marke(x, y, n, { stroke: BLAU, farbe: BLAU }); return; }
          const halb = name.length * 7.5 * Z * 0.29 + 3;   // Namen nicht über den Kartenrand
          s += txt(Math.max(halb, Math.min(W - halb, x)), y, name, { fs: 7.5, farbe: '#2b5c8a', w: 700 });
        });
      }
    }
    if (o.gradnetz && o.gradnetz.namen) {
      const [x1, y1] = f(-112, 0), [x2, y2] = f(0, -86);
      s += txt(x1 + 2, y1 - 3, 'Äquator', { fs: 7, anker: 'start', farbe: '#d0443a' }) + txt(x2 + 3, y2 + 2, 'Nullmeridian', { fs: 7, anker: 'start', farbe: '#0a7d57' });
    }
    s += orteZeichnen(o.orte, f);
    if (o.nord) s += kompass(W - 20, 22);
    return S(W, H, s, o.label || 'Weltkarte');
  }

  // ---------------------------------------------------------------- Mitteleuropa: Deutschland und Nachbarn
  const EU_VERSATZ = { Luxemburg: { nr: [3.2, 48.6], name: [3.6, 49.2] }, Liechtenstein: {}, Belgien: { name: [4.6, 50.6] }, Niederlande: { name: [5.6, 52.4] }, Dänemark: { ziel: [9.3, 56.0] }, Schweiz: { ziel: [8.1, 46.8] }, Österreich: { ziel: [14.3, 47.6] }, Tschechien: { ziel: [15.4, 49.8] }, Polen: { ziel: [18.0, 52.6] }, Frankreich: { ziel: [4.0, 47.0] }, Deutschland: { ziel: [10.3, 51.0] }, Italien: { ziel: [10.6, 45.6] }, Schweden: { ziel: [14.0, 56.8] } };
  function europa(o) {
    o = o || {}; Z = 1.4;
    const lon0 = 11, c = Math.cos(51 * Math.PI / 180), X0 = 1.6, X1 = 20.6, Y0 = 57.2, Y1 = 45.2, W = 340, sx = W / ((X1 - X0) * c), H = Math.round((Y0 - Y1) * sx); BW = W; BH = H;
    const f = (lon, lat) => [(lon - X0) * c * sx, (Y0 - lat) * sx];
    let s = `<rect width="${W}" height="${H}" fill="${WASSER}"/>`;
    const nachbarn = ['Deutschland', 'Dänemark', 'Niederlande', 'Belgien', 'Luxemburg', 'Frankreich', 'Schweiz', 'Österreich', 'Tschechien', 'Polen'];
    const fl = flaechen(K.europa, f, o, { grau: (n) => !nachbarn.includes(n), zuletzt: ['Luxemburg', 'Liechtenstein'] });
    s += fl.s + fluesseZeichnen(o, f);
    s += beschriftung(K.europa, f, fl.namen.filter((n) => nachbarn.includes(n) || o.namen !== true), fl.nr, EU_VERSATZ, 8.5);
    if (o.meere !== false) { s += txt(...f(5.2, 55.6), 'Nordsee', { fs: 8, farbe: '#2b5c8a', w: 700 }) + txt(...f(17.2, 55.3), 'Ostsee', { fs: 8, farbe: '#2b5c8a', w: 700 }); }
    s += orteZeichnen(o.orte, f);
    if (o.nord) s += kompass(W - 22, 24);
    return S(W, H, s, o.label || 'Deutschland und seine Nachbarn', 300);
  }

  // ---------------------------------------------------------------- Deutschland: Bundesländer
  const DE_VERSATZ = {
    Berlin: { nr: [14.6, 52.95], name: [13.4, 52.75] }, Hamburg: { nr: [10.6, 54.2], name: [10.0, 53.75] }, Bremen: { nr: [7.4, 53.85], name: [8.8, 53.3] }, Saarland: { nr: [6.0, 49.0], name: [6.95, 49.2] },
    Brandenburg: { ziel: [13.3, 52.05] }, Niedersachsen: { ziel: [9.6, 52.6] }, 'Schleswig-Holstein': { ziel: [9.7, 54.3] }, 'Mecklenburg-Vorpommern': { ziel: [12.6, 53.75], name: [12.5, 53.75] },
    'Sachsen-Anhalt': { ziel: [11.65, 51.95] }, 'Rheinland-Pfalz': { ziel: [7.4, 49.95] }, 'Nordrhein-Westfalen': { ziel: [7.6, 51.5] },
  };
  const DE = { X0: 5.6, X1: 15.3, Y0: 55.15, Y1: 47.15 };
  // ausschnitt: [West, Ost, Nord, Süd] in Grad zeigt nur einen Teil (zum Beispiel die Küste), dann in voller Breite
  function deBox(o) {
    const A = o.ausschnitt ? { X0: o.ausschnitt[0], X1: o.ausschnitt[1], Y0: o.ausschnitt[2], Y1: o.ausschnitt[3] } : DE;
    const c = Math.cos(51.2 * Math.PI / 180), W = o.ausschnitt ? 340 : 250, sx = W / ((A.X1 - A.X0) * c), H = Math.round((A.Y0 - A.Y1) * sx);
    return { W, H, f: (lon, lat) => [(lon - A.X0) * c * sx, (A.Y0 - lat) * sx] };
  }
  function deutschland(o) {
    o = o || {}; Z = o.ausschnitt ? 1.45 : 1.3;
    const { W, H, f } = deBox(o); BW = W; BH = H;
    let s = `<rect width="${W}" height="${H}" fill="${o.ohneMeer ? '#fff' : WASSER}"/>`;
    // Nachbarn grau im Hintergrund
    for (const [n, ringe] of Object.entries(K.europa)) if (n !== 'Deutschland') s += `<path d="${ringe.map((r) => pfad(r, f)).join('')}" fill="${LAND2}" stroke="#c9bfa8" stroke-width=".6"/>`;
    const fl = flaechen(K.laender, f, o, { zuletzt: ['Berlin', 'Hamburg', 'Bremen'], fuell: o.fuell });
    s += fl.s;
    s += K.seen.map((r) => `<path d="${pfad(r, f)}" fill="${WASSER}" stroke="#9cc4e4" stroke-width=".5"/>`).join('');
    s += fluesseZeichnen(o, f);
    s += beschriftung(K.laender, f, fl.namen, fl.nr, DE_VERSATZ, o.fs || 6.8);
    s += orteZeichnen(o.orte, f);
    if (o.nord) s += kompass(W - 19, 22);
    if (o.massstab) s += massstabsleiste(f, 51, 8, 100, H - 12);
    return S(W, H, s, o.label || 'Deutschland', 330);
  }

  // ---------------------------------------------------------------- Sachsen mit Nachbarn
  const SN_VERSATZ = { Sachsen: { ziel: [13.35, 51.2] }, Polen: { ziel: [14.95, 51.62] }, Tschechien: { ziel: [13.6, 50.25] }, Bayern: { ziel: [11.75, 50.15] }, Thüringen: { ziel: [11.7, 50.85] }, 'Sachsen-Anhalt': { ziel: [11.75, 51.75] }, Brandenburg: { ziel: [13.6, 51.75] } };
  function sachsen(o) {
    o = o || {}; Z = 1.45;
    const X0 = 11.3, X1 = 15.35, Y0 = 51.9, Y1 = 50.05, c = Math.cos(51 * Math.PI / 180), W = 340, sx = W / ((X1 - X0) * c), H = Math.round((Y0 - Y1) * sx); BW = W; BH = H;
    const f = (lon, lat) => [(lon - X0) * c * sx, (Y0 - lat) * sx];
    let s = `<rect width="${W}" height="${H}" fill="${LAND2}"/>`;
    const fl = flaechen(K.sachsen, f, Object.assign({}, o), { grau: (n) => n !== 'Sachsen' });
    s += fl.s + fluesseZeichnen(o, f);
    s += beschriftung(K.sachsen, f, fl.namen, fl.nr, SN_VERSATZ, 8.5);
    s += orteZeichnen(o.orte, f);
    if (o.nord) s += kompass(W - 22, 26);
    if (o.massstab) s += massstabsleiste(f, 51, 12, 50, H - 10);
    return S(W, H, s, o.label || 'Sachsen');
  }

  // ---------------------------------------------------------------- Kleinteile
  function kompass(x, y) {
    return `<g transform="translate(${x} ${y}) scale(${Z})"><circle r="13" fill="rgba(255,255,255,.9)" stroke="${TINTE}" stroke-width="1"/><path d="M0 -2.5 L3 5 L0 6.5 L-3 5Z" fill="#d0443a"/><path d="M0 11 L3 5 L0 3.5 L-3 5Z" fill="${TINTE}"/><text y="-4" text-anchor="middle" style="font:800 8.5px Nunito,sans-serif;fill:#d0443a">N</text></g>`;
  }
  // Maßstabsleiste: km Länge an der Breite lat, links bei Länge lon0
  function massstabsleiste(f, lat, lon0, km, y) {
    const dlon = km / (111.32 * Math.cos(lat * Math.PI / 180)), [xa] = f(lon0, lat), [xb] = f(lon0 + dlon, lat), w = xb - xa;
    return `<g><rect x="${r1(xa)}" y="${r1(y)}" width="${r1(w / 2)}" height="3.5" fill="${TINTE}"/><rect x="${r1(xa + w / 2)}" y="${r1(y)}" width="${r1(w / 2)}" height="3.5" fill="#fff" stroke="${TINTE}" stroke-width=".8"/>`
      + txt(xa, y - 3, '0', { fs: 7.5, w: 700 }) + txt(xa + w, y - 3, `${km} km`, { fs: 7.5, w: 700 }) + '</g>';
  }

  window.GeoKarte = { welt, europa, deutschland, sachsen, robinson, mercator, pfad, mitte, marke, txt, kompass, daten: K, farben: { TINTE, LAND, LAND2, WASSER, RAND, HELL, BLAU, FLUSS } };
})();
