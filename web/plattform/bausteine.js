/* LernDax – gemeinsame Bausteine für Wissensaufgaben (GeDax, BioDax, GeoDax …)
 *
 * Seit lerndax-v103 an einer Stelle statt in jedem Fach kopiert. Ein Fach ruft am Anfang seiner basis-Datei auf:
 *   const U = LernDaxBausteine(D, { passtNicht: 'Text der Frage', gw: { … }, ordnenEx: (e, idx, teile) => ex | null,
 *                                   ordnenZusatz: (e, i) => ' (Jahr)' });
 * Danach stehen in D.util (= U): R, pick, shuffle, fmt, wahl, reihum, nurText, mische und die Bausteine
 *   auswahl  { f: Frage, a: richtig, x: [falsche …], w: warum, svg?: Bildname, h?: Tipp }
 *   tippen   { f: 'Satz mit ___', a: 'Wort' oder ['Wort', 'andere Schreibweise'], w }
 *   ordnen   { t: Aufgabe, items: [in richtiger Reihenfolge], w: Merksatz, bilder?: [Bildnamen], ex?: eigene Erklärung (mode …) }
 *   sortiere { kats: [...], items: [[Begriff, Kategorie, warum?], ...], f: (Begriff) => Frage, h }
 *   passtNicht (aus derselben Sammlung wie sortiere), aussage { w: [wahre], f: [falsche] }
 *   beschriften { svg: Bildname, teile: [...], was: { Teil: Erklärung } }   (Bild mit Nummern)
 *   erkennen { arten: [[Bildname, Name, Merkmal], ...], f?: Frage }          (Foto erkennen)
 *   baue(id, { h, F, T, O, S, A, B, E, extra }, gewichte) → Generator des Themas
 * Bilder kommen aus D.bilder (Name → Funktion, die ein <svg> liefert).
 * Regel wie überall in LernDax: Jede Aufgabe hat genau eine richtige Lösung.
 *
 * Außerdem: LernDaxBausteine.fotoBild(zeichnung, f) legt ein freies Foto von Wikimedia Commons über eine Zeichnung
 * (Fotograf und Lizenz stehen im Bild; ohne Netz bleibt die Zeichnung stehen). Felder von f siehe unten.
 */
(function () {
  function LernDaxBausteine(D, opt) {
    opt = opt || {};
    const U = (D.util = D.util || {});
    const R = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
    const pick = (arr) => arr[R(0, arr.length - 1)];
    const shuffle = (arr) => { const a = arr.slice(); for (let i = a.length - 1; i > 0; i--) { const j = R(0, i); [a[i], a[j]] = [a[j], a[i]]; } return a; };
    const wahl = (liste) => { let r = Math.random() * liste.reduce((s, x) => s + x[0], 0); for (const [w, f] of liste) { r -= w; if (r <= 0) return f(); } return liste[0][1](); };
    // Liste gemischt der Reihe nach durchgehen (Wiederholungen kommen spät)
    const reihum = (liste) => { let s = []; return () => { if (!s.length) s = shuffle(liste); return s.pop(); }; };
    const nurText = (s) => String(s).replace(/<[^>]+>/g, '');
    // Mischen, aber nie in der richtigen Reihenfolge lassen
    const mische = (teile) => { let w = teile.slice(); for (let k = 0; k < 30 && w.join('|') === teile.join('|'); k++) w = shuffle(teile); return w; };
    Object.assign(U, { R, pick, shuffle, fmt: (x) => String(x), wahl, reihum, nurText, mische });
    const bild = (name) => D.bilder[name]();

    function auswahl(art, e, hint) {
      const ch = shuffle([e.a, ...shuffle(e.x).slice(0, 3)]);
      const t = { prompt: e.f, choices: ch, correct: ch.indexOf(e.a), hint: e.h || hint, solution: `<b>${e.a}</b><br>${e.w}`,
        ex: { mode: 'karte', nach: false, art, q: nurText(e.f), opts: ch, ok: ch.indexOf(e.a), svg: e.svg || '', merk: `<b>${e.a}</b>: ${e.w}` } };
      if (e.svg) t.figure = bild(e.svg);
      return t;
    }
    function tippen(art, e, hint) {
      const [vor, nach] = e.f.split('___'), a = [].concat(e.a);
      const t = { prompt: e.p || 'Ergänze das fehlende Wort.', layout: 'satz', fields: [{ type: 'text', answer: a, prefix: vor.trim(), suffix: (nach || '').trim(), label: 'Lücke', ci: true }],
        hint: e.h || hint, solution: `${e.f.replace('___', `<b>${a[0]}</b>`)}<br>${e.w}`,
        ex: { mode: 'karte', nach: false, art, q: e.f.replace('___', '…'), opts: [a[0]], ok: 0, svg: e.svg || '', merk: `<b>${a[0]}</b>: ${e.w}` } };
      if (e.svg) t.figure = bild(e.svg);
      return t;
    }
    // n = wie viele Teile (zufällige Auswahl in richtiger Reihenfolge)
    function ordnen(art, e, hint, n) {
      let idx = e.items.map((_, i) => i);
      if (n && n < idx.length) idx = shuffle(idx).slice(0, n).sort((a, b) => a - b);
      const teile = idx.map((i) => e.items[i]);
      const loes = teile.map((x, k) => `${k + 1}. ${x}${opt.ordnenZusatz ? opt.ordnenZusatz(e, idx[k]) : ''}`).join('<br>');
      const ex = (opt.ordnenEx && opt.ordnenEx(art, e, idx, teile)) || (e.ex && Object.assign({ art }, e.ex))
        || { mode: 'reihe', art, items: teile, bilder: e.bilder ? idx.map((i) => e.bilder[i]) : null, s1: e.s1 || 'Schritt für Schritt:', merk: e.w || `Die richtige Reihenfolge: ${teile.join(' → ')}` };
      const t = { prompt: e.t, order: { words: mische(teile), answer: teile.join(' '), end: '' }, hint: e.h || hint, solution: `${loes}${e.w ? '<br>' + e.w : ''}`, ex };
      if (e.svg) t.figure = bild(e.svg);
      return t;
    }
    function sortiere(art, def) {
      const it = pick(def.items), andere = shuffle(def.items.filter((x) => x !== it && x[0] !== it[0])).slice(0, 3);
      return { prompt: def.f(it[0]), choices: def.kats.slice(), correct: it[1], hint: def.h,
        solution: `<b>${it[0]}</b> → <b>${def.kats[it[1]]}</b>${it[2] ? '<br>' + it[2] : ''}`,
        ex: { mode: 'faecher', art, kats: def.kats, items: [[it[0], it[1]], ...andere.map((x) => [x[0], x[1]])], merk: `${it[0]} → <b>${def.kats[it[1]]}</b>${it[2] ? '. ' + it[2] : ''}` } };
    }
    // Was passt nicht? Drei aus einer Gruppe, einer aus einer anderen
    function passtNicht(art, def) {
      const gr = def.kats.map((_, k) => k).filter((k) => def.items.filter((x) => x[1] === k).length >= 3), k = pick(gr);
      const drin = shuffle(def.items.filter((x) => x[1] === k)).slice(0, 3), raus = pick(def.items.filter((x) => x[1] !== k));
      const ch = shuffle([...drin, raus].map((x) => x[0]));
      return { prompt: def.nicht || opt.passtNicht || 'Drei gehören zusammen. Was <b>passt nicht</b> dazu?', choices: ch, correct: ch.indexOf(raus[0]), hint: def.h,
        solution: `<b>${raus[0]}</b> gehört zu „${def.kats[raus[1]]}“. Die anderen gehören zu „${def.kats[k]}“.`,
        ex: { mode: 'faecher', art, kats: def.kats, items: [[raus[0], raus[1]], ...drin.map((x) => [x[0], x[1]])], merk: `<b>${raus[0]}</b> passt nicht: ${def.kats[raus[1]]}. Die anderen: ${def.kats[k]}.` } };
    }
    function aussage(art, def, hint, falschGesucht) {
      const ok = falschGesucht ? pick(def.f) : pick(def.w), rest = shuffle(falschGesucht ? def.w : def.f).slice(0, 2), ch = shuffle([ok, ...rest]);
      return { prompt: falschGesucht ? 'Welche Aussage ist <b>falsch</b>?' : 'Welche Aussage <b>stimmt</b>?', choices: ch, correct: ch.indexOf(ok), hint,
        solution: falschGesucht ? `Falsch ist: <b>${ok}</b>` : `Richtig ist: <b>${ok}</b>`,
        ex: { mode: 'karte', nach: false, art, q: falschGesucht ? 'Welche Aussage ist falsch?' : 'Welche Aussage stimmt?', opts: ch, ok: ch.indexOf(ok), svg: '', merk: `${falschGesucht ? 'Falsch' : 'Richtig'}: <b>${ok}</b>` } };
    }
    // Bild mit Nummern, gefragt ist der Name eines Teils
    function beschriften(art, def, hint) {
      const i = R(0, def.teile.length - 1), a = def.teile[i];
      const ch = shuffle([a, ...shuffle(def.teile.filter((x) => x !== a)).slice(0, 3)]);
      const w = (def.was && def.was[a]) || '';
      const f = def.f || `Schau dir das Bild an. Wie heißt der Teil mit der <b>Nummer ${i + 1}</b>?`;
      return { prompt: typeof f === 'function' ? f(i + 1) : f, figure: bild(def.svg), choices: ch, correct: ch.indexOf(a), hint: def.h || hint,
        solution: `Nummer ${i + 1} ist: <b>${a}</b>${w ? '<br>' + w : ''}`,
        ex: { mode: 'karte', nach: false, art, q: nurText(typeof f === 'function' ? f(i + 1) : `Wie heißt der Teil mit der Nummer ${i + 1}?`), opts: ch, ok: ch.indexOf(a), svg: def.svg, merk: `Nummer ${i + 1}: <b>${a}</b>${w ? '. ' + w : ''}` } };
    }
    // Am Bild erkennen
    function erkennen(art, def, hint) {
      const e = pick(def.arten), ch = shuffle([e[1], ...shuffle(def.arten.filter((x) => x[1] !== e[1]).map((x) => x[1])).slice(0, 3)]);
      const f = def.f || 'Welches Tier ist das?';
      return { prompt: f, figure: bild(e[0]), choices: ch, correct: ch.indexOf(e[1]), hint: def.h || hint,
        solution: `<b>${e[1]}</b><br>${e[2]}`,
        ex: { mode: 'karte', nach: false, art, q: nurText(f), opts: ch, ok: ch.indexOf(e[1]), svg: e[0], merk: `<b>${e[1]}</b>: ${e[2]}` } };
    }
    // Ein Thema aus einer Sammlung bauen. gw = Gewichte der Aufgabenarten
    D.arten = D.arten || {};
    D.banken = D.banken || {};
    const GW = Object.assign({ frage: 34, tippen: 14, ordnen: 14, sortieren: 16, passtNicht: 8, aussage: 12, beschriften: 18, erkennen: 18 }, opt.gw || {});
    function baue(id, b, gw) {
      const a = {};
      if (b.F) { const r = reihum(b.F); a.frage = () => auswahl('frage', r(), b.h); }
      if (b.T) { const r = reihum(b.T); a.tippen = () => tippen('tippen', r(), b.h); }
      if (b.O) { const r = reihum(b.O); a.ordnen = () => { const e = r(); return ordnen('ordnen', e, b.h, e.n); }; }
      if (b.S) { a.sortieren = () => sortiere('sortieren', b.S); if (b.S.kats.some((_, k) => b.S.items.filter((x) => x[1] === k).length >= 3)) a.passtNicht = () => passtNicht('passtNicht', b.S); }
      if (b.A) a.aussage = () => aussage('aussage', b.A, b.h);
      if (b.B) a.beschriften = () => beschriften('beschriften', b.B, b.h);
      if (b.E) a.erkennen = () => erkennen('erkennen', b.E, b.h);
      Object.assign(a, b.extra || {});
      D.arten[id] = a;
      const g = Object.assign({}, GW, gw || {});
      const liste = Object.keys(a).map((k) => [g[k] ?? 15, a[k]]).filter((x) => x[0] > 0);
      D.banken[id] = b;
      return () => wahl(liste);
    }
    Object.assign(U, { auswahl, tippen, ordnen, sortiere, passtNicht, aussage, beschriften, erkennen, baue });
    D.gen = D.gen || {};   // hier legen die Themen-Dateien ihre Generatoren ab
    return U;
  }

  // =====================================================
  // Freie Fotos von Wikimedia Commons
  // =====================================================
  const TINTE = '#2b2540';
  const fotoUrl = (datei, breite) => `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(datei.replace(/ /g, '_'))}?width=${breite || 640}`;
  // Nummern-Marke mit Zeiger: von (x,y) zur Stelle (tx,ty)
  const nr = (n, x, y, tx, ty) => `<line x1="${x}" y1="${y}" x2="${tx}" y2="${ty}" stroke="${TINTE}" stroke-width="1.2"/><circle cx="${tx}" cy="${ty}" r="1.8" fill="${TINTE}"/><circle cx="${x}" cy="${y}" r="8" fill="#fff" stroke="${TINTE}" stroke-width="1.5"/><text x="${x}" y="${y + 4}" text-anchor="middle" style="font:800 11px Nunito,sans-serif;fill:${TINTE}">${n}</text>`;
  // für Fotos: weißer Rand um die Linie, damit sie auch auf dunklem Grund sichtbar ist
  const nrF = (n, x, y, tx, ty) => `<line x1="${x}" y1="${y}" x2="${tx}" y2="${ty}" stroke="#fff" stroke-width="3" stroke-linecap="round"/>` + nr(n, x, y, tx, ty).replace(/r="1.8"/, 'r="1.8" stroke="#fff" stroke-width="0.8"');
  const r1 = (v) => +v.toFixed(1);
  // Foto über die Zeichnung legen. f = { datei, von, liz, px: Pixelgröße, aus: Ausschnitt [x0, y0, x1, y1] (Anteile),
  // ganz: ganzen Ausschnitt zeigen (Rand in bg), sonst füllen; dreh: um 90° nach links drehen; vb: eigene Bildgröße;
  // nr: Nummern [[x, y, zielX, zielY], …]; extra: eigenes SVG darüber; pos: Ausrichtung ohne px; breite: geladene Breite }.
  // Alles außer dem Foto selbst wird erst sichtbar, wenn das Foto geladen ist. Ohne Netz bleibt die Zeichnung stehen.
  function fotoBild(zeichnung, f) {
    const roh = zeichnung();
    const vbAlt = (roh.match(/viewBox="([^"]+)"/) || [0, '0 0 200 120'])[1];
    const [W, H] = f.vb || vbAlt.split(' ').slice(2).map(Number);
    let inhalt = roh.replace(/^<svg[^>]*>/, '').replace(/<\/svg>$/, '');
    if (f.vb) inhalt = `<svg x="0" y="0" width="${W}" height="${H}" viewBox="${vbAlt}">${inhalt}</svg>`;
    let img;
    if (f.px) {
      let [pw, ph] = f.px, [x0, y0, x1, y1] = f.aus || [0, 0, 1, 1];
      if (f.dreh) { [x0, y0, x1, y1] = [y0, 1 - x1, y1, 1 - x0]; [pw, ph] = [ph, pw]; }
      const cw = (x1 - x0) * pw, ch = (y1 - y0) * ph, s = (f.ganz ? Math.min : Math.max)(W / cw, H / ch);
      const iw = pw * s, ih = ph * s, ix = W / 2 - (x0 + x1) / 2 * pw * s, iy = H / 2 - (y0 + y1) / 2 * ph * s;
      const dw = Math.min(W, cw * s), dh = Math.min(H, ch * s), dx = (W - dw) / 2, dy = (H - dh) / 2;
      const bild = f.dreh
        ? `<image href="${fotoUrl(f.datei, f.breite)}" width="${r1(ih)}" height="${r1(iw)}" preserveAspectRatio="none" transform="translate(${r1(ix - dx)} ${r1(iy - dy + ih)}) rotate(-90)" onload="LADEN"/>`
        : `<image href="${fotoUrl(f.datei, f.breite)}" x="${r1(ix - dx)}" y="${r1(iy - dy)}" width="${r1(iw)}" height="${r1(ih)}" preserveAspectRatio="none" onload="LADEN"/>`;
      img = `<svg x="${r1(dx)}" y="${r1(dy)}" width="${r1(dw)}" height="${r1(dh)}" overflow="hidden">${bild}</svg>`;
    } else {
      img = `<image href="${fotoUrl(f.datei, f.breite)}" x="0" y="0" width="${W}" height="${H}" preserveAspectRatio="${f.pos || 'xMidYMid'} slice" onload="LADEN"/>`;
    }
    img = img.replace('LADEN', "this.closest('.foto').querySelectorAll('.fz').forEach(function(e){e.setAttribute('visibility','visible')})");
    const nachweis = f.nachweis || `${f.art || 'Foto'}: ${f.von}, ${f.liz}, Wikimedia Commons`, fs = Math.max(3.6, Math.min(5.6, W / 36, (W - 4) / (nachweis.length * 0.5)));
    return `<svg viewBox="0 0 ${W} ${H}"${(roh.match(/^<svg[^>]*?( role="img".*?)>/) || [0, ''])[1]}>${inhalt}<g class="foto">`
      + `<g class="fz" visibility="hidden"><rect width="${W}" height="${H}" fill="${f.bg || '#fff'}"/></g>${img}`
      + `<g class="fz" visibility="hidden">${f.extra || ''}${(f.nr || []).map((m, i) => nrF(i + 1, m[0], m[1], m[2], m[3])).join('')}`
      + `<rect x="0" y="${H - fs * 1.6}" width="${W}" height="${fs * 1.6}" fill="rgba(255,255,255,.78)"/><text x="2" y="${r1(H - fs * 0.45)}" style="font:600 ${r1(fs)}px Nunito,sans-serif;fill:#2b2540">${nachweis}</text></g></g></svg>`;
  }
  LernDaxBausteine.fotoUrl = fotoUrl;
  LernDaxBausteine.fotoBild = fotoBild;
  LernDaxBausteine.nr = nr;
  LernDaxBausteine.nrF = nrF;
  window.LernDaxBausteine = LernDaxBausteine;
})();
