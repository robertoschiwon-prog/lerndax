/* GeDax (Geschichte) – Themen und Aufgaben Klasse 5 (Lehrplan Gymnasium Sachsen, Schulbuch ANNO 1 Sachsen)
 *
 * Aufbau wie in DeDax: Jeder Generator liefert bei jedem Aufruf eine neue Aufgabe
 *   { prompt, hint, solution, figure?, ex } und dazu eine der Antwortformen
 *   choices/correct   Auswahl
 *   fields            Eingabefelder (Zahl oder type:'text'); layout:'satz' = Lücke im Satz
 *   order             Teile in die richtige Reihenfolge bringen
 * ex beschreibt die Lösungs-Animation (Bild-Modi in erklaerungen/klasse5.js: karte, strahl, reihe, faecher, pyramide, bild).
 *
 * Alle Texte sind selbst geschrieben, nichts aus dem Schulbuch. Jahreszahlen und Namen sind nachgeschlagen
 * (Stand 13.11.2026, Quellen in faecher/geschichte/fakten.md). „um“ = ungefähr; die Forschung nennt oft etwas andere Zahlen.
 * Regel wie überall in LernDax: Jede Aufgabe hat genau eine richtige Lösung.
 */
(function () {
  const D = (window.GeDax = window.GeDax || {});
  const U = (D.util = D.util || {});
  const R = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
  const pick = (arr) => arr[R(0, arr.length - 1)];
  const shuffle = (arr) => { const a = arr.slice(); for (let i = a.length - 1; i > 0; i--) { const j = R(0, i); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  Object.assign(U, { R, pick, shuffle, fmt: (x) => String(x) });
  U.wahl = (liste) => { let r = Math.random() * liste.reduce((s, x) => s + x[0], 0); for (const [w, f] of liste) { r -= w; if (r <= 0) return f(); } return liste[0][1](); };
  // Liste gemischt der Reihe nach durchgehen (Wiederholungen kommen spät)
  const reihum = (liste) => { let s = []; return () => { if (!s.length) s = shuffle(liste); return s.pop(); }; };
  const nurText = (s) => String(s).replace(/<[^>]+>/g, '');
  // Jahr als Text: negativ = v. Chr.; kleine Jahre n. Chr. mit Zusatz
  const J = (j, um) => (um ? 'um ' : '') + (j < 0 ? `${-j} v. Chr.` : j < 1000 ? `${j} n. Chr.` : String(j));
  // Mischen, aber nie in der richtigen Reihenfolge lassen
  const mische = (teile) => { let w = teile.slice(); for (let k = 0; k < 30 && w.join('|') === teile.join('|'); k++) w = shuffle(teile); return w; };
  Object.assign(U, { reihum, nurText, J, mische });

  // =====================================================
  // Bilder (selbst gezeichnet, flach). Jede Funktion liefert ein <svg>.
  // =====================================================
  const S = (vb, inhalt, label) => `<svg viewBox="${vb}" role="img" aria-label="${label || 'Bild'}" style="max-width:100%;height:auto">${inhalt}</svg>`;
  const STEIN = '#9a8f7e', STEIN2 = '#7b705f', HOLZ = '#a0703c', KNOCHEN = '#efe4c8', BRONZE = '#c98a3a', TON = '#c46f3c', NIL = '#3b8fd1', FRUCHT = '#4f9a3a', WUESTE = '#e7c873';
  const BILDER = {
    faustkeil: () => S('0 0 200 120', `<rect width="200" height="120" fill="#f6efe2"/><path d="M100 12 C126 30 138 66 130 92 C124 108 76 108 70 92 C62 66 74 30 100 12Z" fill="${STEIN}"/><path d="M100 12 L94 40 L104 62 L96 88 M84 44 L100 54 M116 46 L104 60 M80 74 L96 80 M120 76 L104 84" stroke="${STEIN2}" stroke-width="3" fill="none" stroke-linecap="round"/>`, 'Faustkeil'),
    speer: () => S('0 0 200 120', `<rect width="200" height="120" fill="#f6efe2"/><path d="M14 92 L156 36" stroke="${HOLZ}" stroke-width="6" stroke-linecap="round"/><path d="M150 38 L186 22 L170 52 Z" fill="${STEIN}"/><path d="M146 36 L156 46" stroke="#5b3a1a" stroke-width="5"/>`, 'Speer mit Steinspitze'),
    nadel: () => S('0 0 200 120', `<rect width="200" height="120" fill="#f6efe2"/><path d="M24 70 L176 52" stroke="${KNOCHEN}" stroke-width="7" stroke-linecap="round"/><path d="M24 70 L176 52" stroke="#c9b98f" stroke-width="1.5"/><ellipse cx="38" cy="68.3" rx="5" ry="2.2" fill="#f6efe2" stroke="#b7a679" stroke-width="1"/><path d="M60 64 C90 40 120 96 150 56" stroke="#8a5a2b" stroke-width="2" fill="none" stroke-dasharray="4 3"/>`, 'Nähnadel aus Knochen'),
    bogen: () => S('0 0 200 120', `<rect width="200" height="120" fill="#f6efe2"/><path d="M60 10 C110 40 110 80 60 110" stroke="${HOLZ}" stroke-width="6" fill="none" stroke-linecap="round"/><path d="M60 10 L60 110" stroke="#6b5a45" stroke-width="1.5"/><path d="M40 60 L170 60" stroke="${HOLZ}" stroke-width="3.5"/><path d="M170 60 L156 52 L156 68 Z" fill="${STEIN}"/><path d="M40 60 L32 52 M40 60 L32 68 M46 60 L38 52 M46 60 L38 68" stroke="#c0392b" stroke-width="2.5"/>`, 'Pfeil und Bogen'),
    sichel: () => S('0 0 200 120', `<rect width="200" height="120" fill="#f6efe2"/><path d="M52 100 L82 64" stroke="${HOLZ}" stroke-width="10" stroke-linecap="round"/><path d="M80 66 C80 30 120 14 154 26 C126 26 100 44 92 70 Z" fill="${HOLZ}"/><path d="M90 62 L98 56 L104 60 L112 50 L118 52 L126 42 L132 42 L140 34" stroke="#d9d4c7" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" fill="none"/><path d="M150 96 L150 70 M158 96 L160 72 M166 96 L170 74" stroke="#c8a24a" stroke-width="2.5"/><circle cx="150" cy="68" r="3" fill="#c8a24a"/><circle cx="160" cy="70" r="3" fill="#c8a24a"/><circle cx="170" cy="72" r="3" fill="#c8a24a"/>`, 'Sichel mit Feuersteinklingen und Getreide'),
    topf: () => S('0 0 200 120', `<rect width="200" height="120" fill="#f6efe2"/><path d="M62 22 L138 22 C150 40 158 60 150 84 C142 104 58 104 50 84 C42 60 50 40 62 22Z" fill="${TON}"/><path d="M58 44 C80 34 100 54 120 44 C130 40 138 42 144 46 M54 64 C76 54 100 74 124 62 C134 58 142 60 148 64" stroke="#7a3a17" stroke-width="3" fill="none"/>`, 'Tongefäß mit Bandmuster'),
    beil: () => S('0 0 200 120', `<rect width="200" height="120" fill="#f6efe2"/><path d="M44 104 L150 22" stroke="${HOLZ}" stroke-width="10" stroke-linecap="round"/><path d="M118 34 L170 50 C176 60 172 72 162 74 L112 60 Z" fill="#5f6b73"/><path d="M164 52 C170 60 168 68 162 72" stroke="#c9d1d6" stroke-width="2.5" fill="none"/>`, 'geschliffenes Steinbeil mit Holzstiel'),
    mahlstein: () => S('0 0 200 120', `<rect width="200" height="120" fill="#f6efe2"/><path d="M20 96 C30 70 170 70 180 96 Z" fill="${STEIN}"/><rect x="70" y="56" width="66" height="22" rx="11" fill="${STEIN2}"/><circle cx="48" cy="86" r="2.5" fill="#e8d9a6"/><circle cx="56" cy="88" r="2.5" fill="#e8d9a6"/><circle cx="150" cy="86" r="2.5" fill="#e8d9a6"/><path d="M60 92 C80 88 120 88 140 92" stroke="#f3ead0" stroke-width="5" stroke-linecap="round"/>`, 'Mahlstein mit Läufer'),
    schwert: () => S('0 0 200 120', `<rect width="200" height="120" fill="#f6efe2"/><path d="M30 60 L150 52 L178 60 L150 68 Z" fill="${BRONZE}"/><path d="M40 60 L160 60" stroke="#a46a24" stroke-width="2"/><rect x="18" y="44" width="10" height="32" rx="3" fill="#8a5a1f"/><rect x="2" y="54" width="18" height="12" rx="4" fill="#8a5a1f"/>`, 'Schwert aus Bronze'),
    langhaus: () => S('0 0 200 120', `<rect width="200" height="120" fill="#dfeefa"/><rect y="96" width="200" height="24" fill="#9fcf7a"/><path d="M14 64 L100 22 L186 64 Z" fill="#c9a24a"/><path d="M14 64 L100 22 L186 64" stroke="#8a6a24" stroke-width="2" fill="none"/><rect x="26" y="64" width="148" height="34" fill="#d9b98a"/><path d="M40 64v34M58 64v34M76 64v34M124 64v34M142 64v34M160 64v34" stroke="#b8925a" stroke-width="2"/><rect x="92" y="72" width="18" height="26" fill="#6b4a2b"/><path d="M100 22 L100 10 M96 12 C100 6 104 10 100 4" stroke="#8a8a8a" stroke-width="2" fill="none"/>`, 'Langhaus der Jungsteinzeit'),
    papyrus: () => S('0 0 200 120', `<rect width="200" height="120" fill="#f6efe2"/><rect x="30" y="24" width="140" height="72" fill="#e9d79f"/><rect x="18" y="20" width="16" height="80" rx="8" fill="#d6bd73"/><rect x="166" y="20" width="16" height="80" rx="8" fill="#d6bd73"/><g fill="#3a2a14"><circle cx="54" cy="44" r="4"/><path d="M66 38h12v12H66z"/><path d="M86 50 Q92 36 98 50Z"/><path d="M108 40 l8 10 l8-10" stroke="#3a2a14" stroke-width="3" fill="none"/><path d="M134 38 v14 M130 44 h8" stroke="#3a2a14" stroke-width="3"/><path d="M48 66 h20 M76 62 q6 8 12 0 q6 -8 12 0 M110 60 v12 h10 M130 66 a6 6 0 1 0 12 0"  stroke="#3a2a14" stroke-width="3" fill="none"/></g><g fill="#b03a2e"><circle cx="150" cy="44" r="4"/></g>`, 'Papyrusrolle mit Schrift'),
    ostrakon: () => S('0 0 200 120', `<rect width="200" height="120" fill="#f6efe2"/><path d="M30 34 L150 18 L178 58 L150 104 L46 98 L22 70 Z" fill="${TON}"/><text x="98" y="58" text-anchor="middle" style="font:800 17px Georgia,serif;fill:#2a1a0e">ΘΕΜΙΣΤΟ</text><text x="98" y="80" text-anchor="middle" style="font:800 17px Georgia,serif;fill:#2a1a0e">ΚΛΗΣ</text>`, 'Tonscherbe mit eingeritztem Namen'),
    vase: () => S('0 0 200 120', `<rect width="200" height="120" fill="#f6efe2"/><path d="M84 8 h32 v8 c0 6 22 14 22 40 c0 30 -14 44 -22 52 h-32 c-8 -8 -22 -22 -22 -52 c0 -26 22 -34 22 -40Z" fill="#d9783a"/><path d="M84 18 c-14 0 -22 6 -24 20 M116 18 c14 0 22 6 24 20" stroke="#2a1a0e" stroke-width="4" fill="none"/><rect x="66" y="44" width="68" height="34" fill="#d9783a"/><g fill="#2a1a0e"><circle cx="86" cy="50" r="3.5"/><path d="M86 54 l-2 12 l-6 9 M84 66 l6 9 M85 57 l-8 4 M85 57 l9 -3"/><circle cx="112" cy="50" r="3.5"/><path d="M112 54 l-2 12 l-6 9 M110 66 l6 9 M111 57 l-8 4 M111 57 l9 -3" /></g><path d="M86 54 l-2 12 l-6 9 M84 66 l6 9 M85 57 l-8 4 M85 57 l9 -3 M112 54 l-2 12 l-6 9 M110 66 l6 9 M111 57 l-8 4 M111 57 l9 -3" stroke="#2a1a0e" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M66 44 h68 M66 80 h68" stroke="#2a1a0e" stroke-width="2"/>`, 'Vase mit schwarzen Figuren: zwei Läufer'),
    muenze: () => S('0 0 200 120', `<rect width="200" height="120" fill="#f6efe2"/><circle cx="100" cy="60" r="46" fill="#c9cdd1" stroke="#9aa0a6" stroke-width="3"/><ellipse cx="96" cy="66" rx="16" ry="22" fill="#7d858c"/><circle cx="90" cy="50" r="7" fill="#e9ecef"/><circle cx="104" cy="50" r="7" fill="#e9ecef"/><circle cx="90" cy="50" r="3" fill="#2a2a2a"/><circle cx="104" cy="50" r="3" fill="#2a2a2a"/><path d="M95 56 l2 5 l2 -5Z" fill="#c98a3a"/><path d="M118 38 c8 4 10 14 6 22" stroke="#6b8f3a" stroke-width="3" fill="none"/><text x="128" y="92" style="font:800 13px Georgia,serif;fill:#5a6168">ΑΘΕ</text>`, 'Silbermünze aus Athen mit Eule'),
    nilkarte: () => S('0 0 200 140', `<rect width="200" height="140" fill="${WUESTE}"/><rect width="200" height="22" fill="#7fb8e6"/><text x="100" y="15" text-anchor="middle" style="font:700 10px Nunito,sans-serif;fill:#1f4f7a">Mittelmeer</text><path d="M70 22 L100 46 L130 22 Z" fill="${FRUCHT}"/><path d="M92 46 C88 70 104 92 98 140 L112 140 C116 92 100 70 108 46 Z" fill="${FRUCHT}"/><path d="M100 46 C96 70 110 92 104 140" stroke="${NIL}" stroke-width="4" fill="none"/><path d="M100 46 L80 22 M100 46 L100 22 M100 46 L120 22" stroke="${NIL}" stroke-width="2.5"/><text x="150" y="40" text-anchor="middle" style="font:700 9px Nunito,sans-serif;fill:#5a4a1a">Unterägypten</text><text x="160" y="118" text-anchor="middle" style="font:700 9px Nunito,sans-serif;fill:#5a4a1a">Oberägypten</text><text x="40" y="96" text-anchor="middle" style="font:700 9px Nunito,sans-serif;fill:#8a6a2a">Wüste</text><path d="M120 128 l6 -10 l6 10" stroke="#5a4a1a" stroke-width="2" fill="none"/><text x="126" y="136" text-anchor="middle" style="font:700 7px Nunito,sans-serif;fill:#5a4a1a">Süden</text>`, 'Karte: der Nil fließt von Süden nach Norden ins Mittelmeer'),
  };
  D.bilder = BILDER;

  // =====================================================
  // Bausteine für Wissensaufgaben
  // =====================================================
  // Auswahl: { f: Frage, a: richtig, x: [falsche …], w: warum, svg?: Bildname, h?: Tipp }
  function auswahl(art, e, hint) {
    const ch = shuffle([e.a, ...shuffle(e.x).slice(0, 3)]);
    const t = { prompt: e.f, choices: ch, correct: ch.indexOf(e.a), hint: e.h || hint, solution: `<b>${e.a}</b><br>${e.w}`,
      ex: { mode: 'karte', art, q: nurText(e.f), opts: ch, ok: ch.indexOf(e.a), svg: e.svg || '', merk: `<b>${e.a}</b>: ${e.w}` } };
    if (e.svg) t.figure = BILDER[e.svg]();
    return t;
  }
  // Lücke tippen: { f: 'Satz mit ___', a: 'Wort' oder ['Wort', 'andere Schreibweise'], w }
  function tippen(art, e, hint) {
    const [vor, nach] = e.f.split('___'), a = [].concat(e.a);
    const t = { prompt: e.p || 'Ergänze das fehlende Wort.', layout: 'satz', fields: [{ type: 'text', answer: a, prefix: vor.trim(), suffix: (nach || '').trim(), label: 'Lücke', ci: true }],
      hint: e.h || hint, solution: `${e.f.replace('___', `<b>${a[0]}</b>`)}<br>${e.w}`,
      ex: { mode: 'karte', art, q: e.f.replace('___', '…'), opts: [a[0]], ok: 0, svg: e.svg || '', merk: `<b>${a[0]}</b>: ${e.w}` } };
    if (e.svg) t.figure = BILDER[e.svg]();
    return t;
  }
  // Reihenfolge: { t: Aufgabe, items: [in richtiger Reihenfolge], j?: [Jahre], w: Merksatz }, n = wie viele Teile
  function ordnen(art, e, hint, n) {
    let idx = e.items.map((_, i) => i);
    if (n && n < idx.length) idx = shuffle(idx).slice(0, n).sort((a, b) => a - b);
    const teile = idx.map((i) => e.items[i]);
    const um = (i) => (Array.isArray(e.um) ? !!e.um[i] : !!e.um);
    const loes = teile.map((x, k) => `${k + 1}. ${x}${e.j ? ` (${J(e.j[idx[k]], um(idx[k]))})` : ''}`).join('<br>');
    return { prompt: e.t, order: { words: mische(teile), answer: teile.join(' '), end: '' }, hint: e.h || hint, solution: `${loes}${e.w ? '<br>' + e.w : ''}`,
      ex: e.j ? { mode: 'strahl', art, punkte: idx.map((i) => ({ j: e.j[i], t: e.kurz ? e.kurz[i] : e.items[i], um: um(i) })), s1: e.s1 || 'Wir legen alles auf den Zeitstrahl: links das Älteste, rechts das Jüngste.', merk: e.w || 'Von links nach rechts: vom Ältesten zum Jüngsten.' }
        : { mode: 'reihe', art, items: teile, s1: e.s1 || 'Schritt für Schritt:', merk: e.w || `Die richtige Reihenfolge: ${teile.join(' → ')}` } };
  }
  // Sortieren: def = { kats: [...], items: [[Begriff, Kategorie, warum?], ...], f: (Begriff) => Frage, h }
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
    return { prompt: def.nicht || 'Drei Begriffe gehören zusammen. Welcher <b>passt nicht</b> dazu?', choices: ch, correct: ch.indexOf(raus[0]), hint: def.h,
      solution: `<b>${raus[0]}</b> gehört zu „${def.kats[raus[1]]}“. Die anderen gehören zu „${def.kats[k]}“.`,
      ex: { mode: 'faecher', art, kats: def.kats, items: [[raus[0], raus[1]], ...drin.map((x) => [x[0], x[1]])], merk: `<b>${raus[0]}</b> passt nicht: ${def.kats[raus[1]]}. Die anderen: ${def.kats[k]}.` } };
  }
  // Aussagen: { w: [wahre], f: [falsche] } → „Welche Aussage stimmt?“ oder „Welche Aussage ist falsch?“
  function aussage(art, def, hint, falschGesucht) {
    const ok = falschGesucht ? pick(def.f) : pick(def.w), rest = shuffle(falschGesucht ? def.w : def.f).slice(0, 2), ch = shuffle([ok, ...rest]);
    return { prompt: falschGesucht ? 'Welche Aussage ist <b>falsch</b>?' : 'Welche Aussage <b>stimmt</b>?', choices: ch, correct: ch.indexOf(ok), hint,
      solution: falschGesucht ? `Falsch ist: <b>${ok}</b>` : `Richtig ist: <b>${ok}</b>`,
      ex: { mode: 'karte', art, q: falschGesucht ? 'Welche Aussage ist falsch?' : 'Welche Aussage stimmt?', opts: ch, ok: ch.indexOf(ok), svg: '', merk: `${falschGesucht ? 'Falsch' : 'Richtig'}: <b>${ok}</b>` } };
  }
  // Ein Thema aus einer Sammlung bauen. b = { h: Tipp, F, T, O, S, A, extra: {art: fn} }, gw = Gewichte
  D.arten = {};
  function baue(id, b, gw) {
    const a = {};
    if (b.F) { const r = reihum(b.F); a.frage = () => auswahl('frage', r(), b.h); }
    if (b.T) { const r = reihum(b.T); a.tippen = () => tippen('tippen', r(), b.h); }
    if (b.O) { const r = reihum(b.O); a.ordnen = () => { const e = r(); return ordnen('ordnen', e, b.h, e.n); }; }
    if (b.S) { a.sortieren = () => sortiere('sortieren', b.S); a.passtNicht = () => passtNicht('passtNicht', b.S); }
    if (b.A) a.aussage = () => aussage('aussage', b.A, b.h);
    Object.assign(a, b.extra || {});
    D.arten[id] = a;
    gw = Object.assign({ frage: 34, tippen: 16, ordnen: 14, sortieren: 16, passtNicht: 8, aussage: 12 }, gw || {});
    const liste = Object.keys(a).map((k) => [gw[k] ?? 15, a[k]]).filter((x) => x[0] > 0);
    D.banken = D.banken || {}; D.banken[id] = b;
    return () => U.wahl(liste);
  }
  Object.assign(U, { auswahl, tippen, ordnen, sortiere, passtNicht, aussage, baue });

  // =====================================================
  // Bereich 0: Begegnungen mit Geschichte (ANNO 1, S. 6–11; Lehrplan LB 1)
  // =====================================================
  // Ereignisse für den Zeitstrahl (nachgeschlagen; „um“ = ungefähr)
  const EREIG = [
    { t: 'Ötzi lebt in den Alpen', j: -3300, um: true },
    { t: 'Ägypten wird ein Reich', j: -3000, um: true },
    { t: 'Bau der Cheops-Pyramide', j: -2580, um: true },
    { t: 'Himmelsscheibe von Nebra entsteht', j: -1600, um: true },
    { t: 'erste Olympische Spiele', j: -776 },
    { t: 'Kleisthenes stärkt die Demokratie in Athen', j: -507 },
    { t: 'Alexander der Große stirbt', j: -323 },
    { t: 'Alexander der Große wird geboren', j: -356 },
    { t: 'Ausbruch des Vesuv: Pompeji wird verschüttet', j: 79 },
    { t: 'letzte antike Olympische Spiele', j: 393 },
    { t: 'Dresden wird zum ersten Mal erwähnt', j: 1206 },
    { t: 'Stein von Rosette wird gefunden', j: 1799 },
    { t: 'Champollion entziffert die Hieroglyphen', j: 1822 },
    { t: 'erste Olympische Spiele der Neuzeit', j: 1896 },
    { t: 'Grab des Tutanchamun wird entdeckt', j: 1922 },
    { t: 'Höhle von Lascaux wird entdeckt', j: 1940 },
    { t: 'Ötzi wird gefunden', j: 1991 },
    { t: 'Himmelsscheibe von Nebra wird gefunden', j: 1999 },
  ];
  const HEUTE = 2026;
  const EJ = (e) => J(e.j, e.um);
  // 4 Ereignisse mit gut unterscheidbaren Jahren
  function vierEreignisse(n) {
    for (let k = 0; k < 50; k++) {
      const w = shuffle(EREIG).slice(0, n).sort((a, b) => a.j - b.j);
      if (w.every((e, i) => i === 0 || e.j - w[i - 1].j >= 20)) return w;
    }
    return [EREIG[0], EREIG[4], EREIG[8], EREIG[16]].slice(0, n);
  }
  const TIPP_STRAHL = 'Auf dem Zeitstrahl liegt links das Ältere, rechts das Jüngere. Bei „v. Chr.“ ist die <b>größere</b> Zahl <b>älter</b>: 500 v. Chr. war vor 300 v. Chr.';
  function zsOrdnen() {
    const w = vierEreignisse(4), teile = w.map((e) => `${e.t} (${EJ(e)})`);
    return { prompt: 'Ordne nach der Zeit: <b>das Älteste zuerst</b>.', order: { words: mische(teile), answer: teile.join(' '), end: '' }, hint: TIPP_STRAHL,
      solution: teile.map((x, k) => `${k + 1}. ${x}`).join('<br>'),
      ex: { mode: 'strahl', art: 'zsOrdnen', punkte: w.map((e) => ({ j: e.j, t: e.t, um: e.um })), s1: 'Wir legen alle Ereignisse auf den Zeitstrahl.', merk: 'Von links nach rechts: vom Ältesten zum Jüngsten.' } };
  }
  function zsFrueher() {
    let a, b;
    const art = R(0, 2);
    if (art === 0) { a = -R(2, 30) * 50; do { b = -R(2, 30) * 50; } while (b === a); }       // beide v. Chr.
    else if (art === 1) { a = -R(1, 20) * 50; b = R(1, 20) * 50; }                         // v. Chr. und n. Chr.
    else { a = R(2, 39) * 50; do { b = R(2, 39) * 50; } while (b === a); }                   // beide n. Chr.
    const ch = shuffle([a, b]), fr = Math.min(a, b), sp = Math.max(a, b);
    return { prompt: `Was war <b>früher</b>?`, choices: ch.map((j) => J(j)), correct: ch.indexOf(fr), hint: TIPP_STRAHL,
      solution: `<b>${J(fr)}</b> war früher als ${J(sp)}.${fr < 0 && sp < 0 ? ' Vor Christi Geburt zählt man rückwärts: Die größere Zahl liegt weiter zurück.' : ''}`,
      ex: { mode: 'strahl', art: 'zsFrueher', punkte: [{ j: fr, t: 'früher', hell: true }, { j: sp, t: 'später' }], s1: 'Wo liegen die beiden Jahre auf dem Zeitstrahl?', merk: `<b>${J(fr)}</b> liegt weiter links: Es war früher.` } };
  }
  // Ein Zeitstrahl mit Strichen; ein Pfeil zeigt auf ein Jahr
  function strahlBild(von, bis, schritt, ziel) {
    const x = (j) => 16 + ((j - von) / (bis - von)) * 288, n = (bis - von) / schritt;
    let s = `<rect width="320" height="96" fill="#fffdf9"/><path d="M10 60 H310" stroke="#2b2440" stroke-width="3"/><path d="M304 54 L314 60 L304 66" stroke="#2b2440" stroke-width="3" fill="none"/>`;
    for (let i = 0; i <= n; i++) {
      const j = von + i * schritt, gross = j === 0;
      s += `<path d="M${x(j)} ${gross ? 48 : 54} V${gross ? 72 : 66}" stroke="${gross ? '#c2410c' : '#2b2440'}" stroke-width="${gross ? 3 : 2}"/>`;
      if (i % 2 === 0 || gross) s += `<text x="${x(j)}" y="86" text-anchor="middle" style="font:700 10px Nunito,sans-serif;fill:${gross ? '#c2410c' : '#2b2440'}">${j === 0 ? 'Chr. Geb.' : Math.abs(j)}</text>`;
    }
    if (von < 0) s += `<text x="${x(von)}" y="40" style="font:700 10px Nunito,sans-serif;fill:#6b6680">v. Chr. ←</text>`;
    if (bis > 0 && von < 0) s += `<text x="${x(bis)}" y="40" text-anchor="end" style="font:700 10px Nunito,sans-serif;fill:#6b6680">→ n. Chr.</text>`;
    s += `<path d="M${x(ziel)} 14 V44 M${x(ziel) - 7} 36 L${x(ziel)} 46 L${x(ziel) + 7} 36" stroke="#1f55d6" stroke-width="3.5" fill="none" stroke-linecap="round"/>`;
    return S('0 0 320 96', s, 'Zeitstrahl mit Pfeil');
  }
  function zsPunkt() {
    const schritt = pick([100, 100, 200, 500]), von = -R(2, 5) * schritt, bis = von + 8 * schritt;
    let ziel; do { ziel = von + R(1, 7) * schritt; } while (ziel === 0);
    const falsch = shuffle([ziel + schritt, ziel - schritt, -ziel].filter((j) => j !== 0 && j !== ziel && j >= von && j <= bis)).slice(0, 3);
    for (const k of [2, -2, 3, -3]) if (falsch.length < 3 && ziel + k * schritt !== 0 && !falsch.includes(ziel + k * schritt)) falsch.push(ziel + k * schritt);
    const ch = shuffle([ziel, ...falsch.slice(0, 3)]);
    return { prompt: 'Auf welches Jahr zeigt der <b>blaue Pfeil</b>?', figure: strahlBild(von, bis, schritt, ziel), choices: ch.map((j) => J(j)), correct: ch.indexOf(ziel), hint: 'Suche zuerst Christi Geburt (rote Linie). Links davon zählt man rückwärts (v. Chr.), rechts vorwärts (n. Chr.).',
      solution: `Der Pfeil zeigt auf <b>${J(ziel)}</b>. Jeder Strich ist ${schritt} Jahre weiter.`,
      ex: { mode: 'strahl', art: 'zsPunkt', punkte: [{ j: ziel, t: 'Pfeil', hell: true }], von, bis, s1: `Ein Strich bedeutet ${schritt} Jahre. Wo ist der Pfeil?`, merk: `Der Pfeil zeigt auf <b>${J(ziel)}</b>.` } };
  }
  const ZS_F = [
    { f: 'Wie schreibt man das Jahr, das <b>300 Jahre vor</b> Christi Geburt liegt?', a: '300 v. Chr.', x: ['300 n. Chr.', '−300 n. Chr.', '1700 n. Chr.'], w: 'Vor Christi Geburt: „v. Chr.“ Man zählt vom Jahr 1 aus rückwärts.' },
    { f: 'Womit beginnt unsere Zeitrechnung?', a: 'mit der Geburt von Jesus Christus', x: ['mit dem Bau der Pyramiden', 'mit den ersten Olympischen Spielen', 'mit der Erfindung der Schrift'], w: 'Wir zählen die Jahre ab Christi Geburt. Davor: v. Chr., danach: n. Chr.' },
    { f: 'Gibt es das <b>Jahr 0</b>?', a: 'Nein, auf 1 v. Chr. folgt gleich 1 n. Chr.', x: ['Ja, es liegt genau zwischen v. Chr. und n. Chr.', 'Ja, es war das Jahr von Christi Geburt', 'Nur bei den Römern'], w: 'Unsere Zeitrechnung kennt kein Jahr 0. Das ist wichtig beim Rechnen!' },
    { f: 'Was bedeutet „<b>n. Chr.</b>“?', a: 'nach Christi Geburt', x: ['nicht christlich', 'neue Chronik', 'nach Chronos'], w: '„n. Chr.“ steht für „nach Christi Geburt“. Meist lässt man es weg: 2026 heißt 2026 n. Chr.' },
    { f: 'Ein Ereignis war im Jahr 120 v. Chr., ein anderes 80 v. Chr. Welches war <b>später</b>?', a: '80 v. Chr.', x: ['120 v. Chr.'], w: 'Vor Christi Geburt zählt man rückwärts: 80 v. Chr. liegt näher an Christi Geburt, also später.' },
  ];
  const zeitstrahl = baue('g5-zeitstrahl', { h: TIPP_STRAHL, F: ZS_F, extra: { zsOrdnen, zsFrueher, zsPunkt } }, { zsOrdnen: 30, zsFrueher: 26, zsPunkt: 24, frage: 20 });

  // ---------- Jahrhunderte und Jahrtausende ----------
  const jhVon = (j) => Math.ceil(Math.abs(j) / 100);
  const TIPP_JH = 'Das 1. Jahrhundert sind die Jahre 1 bis 100, das 2. Jahrhundert 101 bis 200 … Trick: Streiche die letzten zwei Ziffern weg und zähle 1 dazu (1453 → 14 + 1 = 15. Jahrhundert). Bei v. Chr. genauso, nur rückwärts.';
  const jhText = (n, v) => `${n}. Jahrhundert${v ? ' v. Chr.' : ''}`;
  function jhBlock(n, v) { return v ? [-(n * 100), -(n * 100 - 99)] : [n * 100 - 99, n * 100]; }
  function jhJahr() { // nie ein Jahr, das auf 00 endet (dort streiten sich die Leute)
    const v = Math.random() < 0.4; let j; do { j = v ? R(110, 3200) : R(110, 2025); } while (j % 100 === 0 || j % 100 === 1);
    return v ? -j : j;
  }
  function jhBestimmen() {
    const j = jhJahr(), n = jhVon(j), v = j < 0;
    return { prompt: `In welchem <b>Jahrhundert</b> liegt das Jahr <b>${J(j)}</b>?`, fields: [{ answer: n, label: 'Jahrhundert', suffix: v ? '. Jahrhundert v. Chr.' : '. Jahrhundert' }], hint: TIPP_JH,
      solution: `${Math.abs(j)}: die letzten zwei Ziffern weg → ${Math.floor(Math.abs(j) / 100)}, plus 1 → <b>${n}</b>. Das Jahr liegt im <b>${jhText(n, v)}</b>.`,
      ex: { mode: 'strahl', art: 'jhBestimmen', punkte: [{ j, t: J(j), hell: true }], block: jhBlock(n, v), blockText: jhText(n, v), s1: 'Jedes Jahrhundert ist ein Abschnitt von 100 Jahren.', merk: `${J(j)} liegt im <b>${n}</b>. Jahrhundert${v ? ' v. Chr.' : ''}.` } };
  }
  function jhSpanne() {
    const v = Math.random() < 0.35, n = v ? R(2, 30) : R(2, 21), [a, b] = jhBlock(n, v);
    const fmt = (x, y) => v ? `${-x} bis ${-y} v. Chr.` : `${x} bis ${y}`;
    const ok = fmt(a, b), w1 = v ? fmt(a + 100, b + 100) : fmt(a + 100, b + 100), w2 = v ? fmt(a - 100, b - 100) : fmt(a - 100, b - 100);
    const ch = shuffle([ok, w1, w2].filter((x, i, l) => l.indexOf(x) === i && !/(^|\s)-?0 /.test(x) && !/^0/.test(x)));
    return { prompt: `Welche Jahre gehören zum <b>${jhText(n, v)}</b>?`, choices: ch, correct: ch.indexOf(ok), hint: TIPP_JH,
      solution: `Das ${jhText(n, v)} umfasst die Jahre <b>${ok}</b>.`,
      ex: { mode: 'strahl', art: 'jhSpanne', punkte: [{ j: a, t: 'Anfang' }, { j: b, t: 'Ende' }], block: [a, b], blockText: jhText(n, v), s1: '100 Jahre bilden ein Jahrhundert.', merk: `${jhText(n, v)}: <b>${ok}</b>` } };
  }
  function jhWelches() {
    const v = Math.random() < 0.5, n = v ? R(2, 25) : R(3, 21);
    const im = () => { const [a] = jhBlock(n, v); return a + R(5, 94); };
    const ok = im(), f1 = ok + 100 * (Math.random() < 0.5 ? 1 : -1), f2 = ok + (f1 > ok ? -100 : 100) * 2;
    const ch = shuffle([ok, f1, f2].filter((x) => x !== 0 && Math.sign(x) === Math.sign(ok)));
    return { prompt: `Welches Jahr liegt im <b>${jhText(n, v)}</b>?`, choices: ch.map((j) => J(j)), correct: ch.indexOf(ok), hint: TIPP_JH,
      solution: `<b>${J(ok)}</b>: ${Math.floor(Math.abs(ok) / 100)} + 1 = ${n}.`,
      ex: { mode: 'strahl', art: 'jhWelches', punkte: [{ j: ok, t: J(ok), hell: true }], block: jhBlock(n, v), blockText: jhText(n, v), s1: `Das ${jhText(n, v)} auf dem Zeitstrahl:`, merk: `<b>${J(ok)}</b> liegt im ${jhText(n, v)}.` } };
  }
  const JH_F = [
    { f: 'In welchem Jahrhundert leben wir heute?', a: 'im 21. Jahrhundert', x: ['im 20. Jahrhundert', 'im 2. Jahrhundert', 'im 22. Jahrhundert'], w: 'Die Jahre 2001 bis 2100 sind das 21. Jahrhundert.' },
    { f: 'In welchem <b>Jahrtausend</b> leben wir heute?', a: 'im 3. Jahrtausend', x: ['im 2. Jahrtausend', 'im 20. Jahrtausend', 'im 21. Jahrtausend'], w: 'Ein Jahrtausend hat 1000 Jahre. Die Jahre 2001 bis 3000 sind das 3. Jahrtausend.' },
    { f: 'Wie viele Jahre hat ein <b>Jahrhundert</b>?', a: '100', x: ['10', '1000', '50'], w: 'Ein Jahrhundert sind 100 Jahre, ein Jahrtausend 1000 Jahre.' },
    { f: 'Wie viele Jahrhunderte hat ein <b>Jahrtausend</b>?', a: '10', x: ['100', '1000', '12'], w: '1000 Jahre : 100 Jahre = 10 Jahrhunderte.' },
  ];
  const jahrhundert = baue('g5-jh', { h: TIPP_JH, F: JH_F, extra: { jhBestimmen, jhSpanne, jhWelches } }, { jhBestimmen: 36, jhSpanne: 20, jhWelches: 26, frage: 18 });

  // ---------- Wie lange ist das her? ----------
  const TIPP_RECHNEN = 'Beide n. Chr. oder beide v. Chr.: große Zahl minus kleine Zahl. Über Christi Geburt hinweg: beide Zahlen <b>zusammenzählen</b> und dann <b>1 abziehen</b>, weil es kein Jahr 0 gibt.';
  function rNachChr() {
    const e = pick(EREIG.filter((x) => x.j > 1000));
    return { prompt: `${e.t}: im Jahr <b>${e.j}</b>. Wie viele Jahre ist das bis ${HEUTE} her?`, fields: [{ answer: HEUTE - e.j, label: 'Jahre', suffix: 'Jahre' }], hint: TIPP_RECHNEN,
      solution: `${HEUTE} − ${e.j} = <b>${HEUTE - e.j}</b> Jahre.`,
      ex: { mode: 'strahl', art: 'rNachChr', punkte: [{ j: e.j, t: e.t }, { j: HEUTE, t: 'heute' }], bogen: [e.j, HEUTE, `${HEUTE - e.j} Jahre`], s1: 'Beide Jahre liegen nach Christi Geburt.', merk: `${HEUTE} − ${e.j} = <b>${HEUTE - e.j}</b> Jahre.` } };
  }
  function rVorChr() { // beide v. Chr.
    let a, b; do { a = -R(8, 60) * 50; b = -R(2, 50) * 50 + R(0, 4) * 10; } while (b <= a || b === 0);
    const d = b - a;
    return { prompt: `Von <b>${J(a)}</b> bis <b>${J(b)}</b>: Wie viele Jahre sind das?`, fields: [{ answer: d, label: 'Jahre', suffix: 'Jahre' }], hint: TIPP_RECHNEN,
      solution: `Beide Jahre sind v. Chr.: ${-a} − ${-b} = <b>${d}</b> Jahre.`,
      ex: { mode: 'strahl', art: 'rVorChr', punkte: [{ j: a, t: J(a) }, { j: b, t: J(b) }], bogen: [a, b, `${d} Jahre`], s1: 'Beide Jahre liegen vor Christi Geburt: größere Zahl minus kleinere Zahl.', merk: `${-a} − ${-b} = <b>${d}</b> Jahre.` } };
  }
  function rUeber() { // über Christi Geburt hinweg
    const a = -R(1, 40) * 25, b = R(1, 80) * 25, d = -a + b - 1;
    return { prompt: `Von <b>${J(a)}</b> bis <b>${J(b)}</b>: Wie viele Jahre sind das?`, fields: [{ answer: d, label: 'Jahre', suffix: 'Jahre' }], hint: TIPP_RECHNEN,
      solution: `${-a} + ${b} = ${-a + b}. Es gibt kein Jahr 0, also 1 abziehen: <b>${d}</b> Jahre.`,
      ex: { mode: 'strahl', art: 'rUeber', punkte: [{ j: a, t: J(a) }, { j: b, t: J(b) }], bogen: [a, b, `${d} Jahre`], s1: 'Der Weg führt über Christi Geburt. Dort fehlt das Jahr 0.', merk: `${-a} + ${b} − 1 = <b>${d}</b> Jahre.` } };
  }
  function rHerVChr() { // Ereignis v. Chr. bis heute
    const e = pick(EREIG.filter((x) => x.j < 0 && !x.um)), d = -e.j + HEUTE - 1;
    return { prompt: `${e.t}: <b>${J(e.j)}</b>. Wie viele Jahre ist das bis ${HEUTE} her?`, fields: [{ answer: d, label: 'Jahre', suffix: 'Jahre' }], hint: TIPP_RECHNEN,
      solution: `${-e.j} + ${HEUTE} = ${-e.j + HEUTE}. Kein Jahr 0, also 1 abziehen: <b>${d}</b> Jahre.`,
      ex: { mode: 'strahl', art: 'rHerVChr', punkte: [{ j: e.j, t: e.t }, { j: HEUTE, t: 'heute' }], bogen: [e.j, HEUTE, `${d} Jahre`], s1: 'Über Christi Geburt hinweg: zusammenzählen, dann 1 abziehen.', merk: `${-e.j} + ${HEUTE} − 1 = <b>${d}</b> Jahre.` } };
  }
  function rVorJahren() { // „vor … Jahren“ in eine Jahreszahl umrechnen
    const L = [['Ötzi starb', 5300], ['Die Himmelsscheibe von Nebra entstand', 3600], ['Die Cheops-Pyramide wurde gebaut', 4600], ['In Sachsen bauten Bauern Holzbrunnen', 7000]];
    const [t, vor] = pick(L), jahr = Math.round((vor - HEUTE) / 100) * 100;
    const ok = `um ${jahr} v. Chr.`, ch = shuffle([ok, `um ${vor} v. Chr.`, `um ${jahr} n. Chr.`, `um ${vor + HEUTE - (vor + HEUTE) % 100} v. Chr.`]);
    return { prompt: `${t} vor etwa <b>${vor}</b> Jahren. In welcher Zeit war das ungefähr?`, choices: ch, correct: ch.indexOf(ok), hint: 'Zieh von der Zahl der Jahre die Jahre seit Christi Geburt ab (heute ' + HEUTE + '). Was übrig bleibt, liegt vor Christus.',
      solution: `${vor} − ${HEUTE} = ${vor - HEUTE}. Gerundet: <b>${ok}</b>.`,
      ex: { mode: 'strahl', art: 'rVorJahren', punkte: [{ j: -jahr, t: t, um: true, hell: true }, { j: HEUTE, t: 'heute' }], bogen: [-jahr, HEUTE, `etwa ${vor} Jahre`], s1: `${vor} Jahre zurück von heute:`, merk: `${vor} − ${HEUTE} = ${vor - HEUTE}, also <b>${ok}</b>.` } };
  }
  const rechnen = baue('g5-rechnen', { h: TIPP_RECHNEN, extra: { rNachChr, rVorChr, rUeber, rHerVChr, rVorJahren } }, { rNachChr: 16, rVorChr: 22, rUeber: 24, rHerVChr: 18, rVorJahren: 20 });

  // ---------- Die großen Zeitabschnitte ----------
  const EPO = ['Urgeschichte', 'Altertum', 'Mittelalter', 'Neuzeit'];
  const epochen = baue('g5-epochen', {
    h: 'Urgeschichte: Zeit ohne Schrift. Altertum: ab etwa 3000 v. Chr. (Ägypten, Griechen, Römer). Mittelalter: etwa 500 bis 1500 (Burgen, Ritter). Neuzeit: ab etwa 1500.',
    O: [{ t: 'Bringe die Zeitabschnitte in die richtige Reihenfolge: <b>der älteste zuerst</b>.', items: EPO, w: 'Urgeschichte → Altertum → Mittelalter → Neuzeit.', s1: 'Die vier großen Abschnitte, vom ältesten zum jüngsten:' }],
    S: { kats: EPO, f: (x) => `Zu welchem Zeitabschnitt gehört: <b>${x}</b>?`, h: 'Urgeschichte: ohne Schrift. Altertum: Ägypten, Griechen, Römer. Mittelalter: Burgen und Ritter. Neuzeit: ab etwa 1500.',
      items: [['Höhlenmalerei', 0, 'Die Menschen der Steinzeit hatten noch keine Schrift'], ['Faustkeil', 0, 'ein Werkzeug der Altsteinzeit'], ['Ötzi', 0, 'Er lebte vor etwa 5300 Jahren, ohne Schrift'], ['Jäger und Sammler', 0, 'so lebten die Menschen in der Altsteinzeit'],
        ['Bau der Pyramiden', 1, 'Ägypten ist eine Hochkultur des Altertums'], ['Olympische Spiele der Griechen', 1, 'seit 776 v. Chr.'], ['Demokratie in Athen', 1, 'um 500 v. Chr.'], ['Hieroglyphen', 1, 'die Schrift der alten Ägypter'],
        ['Ritterburgen', 2, 'Burgen und Ritter gehören zum Mittelalter'], ['Dresden wird zum ersten Mal erwähnt (1206)', 2, '1206 liegt zwischen 500 und 1500'], ['Mönche schreiben Bücher mit der Hand ab', 2, 'Klöster waren im Mittelalter wichtig'],
        ['erste Eisenbahn in Sachsen', 3, 'Eisenbahnen gibt es erst seit rund 200 Jahren'], ['erste Olympische Spiele der Neuzeit (1896)', 3, '1896 liegt nach 1500'], ['dein erster Schultag', 3, 'Wir leben heute in der Neuzeit']] },
    F: [
      { f: 'Womit <b>endet</b> die Urgeschichte?', a: 'mit der Erfindung der Schrift', x: ['mit dem Bau der ersten Burg', 'mit der Erfindung des Feuers', 'mit Christi Geburt'], w: 'Ab der Schrift gibt es Textquellen. Die Zeit davor heißt Urgeschichte (oder Ur- und Frühgeschichte).' },
      { f: 'Ungefähr wann beginnt das <b>Altertum</b>?', a: 'um 3000 v. Chr.', x: ['um 500 n. Chr.', 'um 1500 n. Chr.', 'um 30000 v. Chr.'], w: 'Um 3000 v. Chr. entstand in Ägypten und Mesopotamien die Schrift.' },
      { f: 'Ungefähr wann beginnt die <b>Neuzeit</b>?', a: 'um 1500', x: ['um 500', 'um 1900', 'um 3000 v. Chr.'], w: 'Um 1500 änderte sich viel: Buchdruck, Entdeckung Amerikas (1492), neue Ideen.' },
      { f: 'Ungefähr wann beginnt das <b>Mittelalter</b>?', a: 'um 500', x: ['um 1500', 'um 3000 v. Chr.', 'um 1900'], w: 'Um 500 n. Chr. endete das Weströmische Reich. Das Mittelalter dauerte bis etwa 1500.' },
      { f: 'Warum sind die Grenzen zwischen den Zeitabschnitten nur <b>ungefähr</b>?', a: 'Die Veränderungen geschahen langsam, nicht an einem Tag.', x: ['Weil niemand Jahreszahlen kennt.', 'Weil jedes Land eine andere Uhr hatte.', 'Weil die Menschen damals nicht zählen konnten.'], w: 'Historiker teilen die Zeit ein, um sich zu orientieren. Die Menschen damals wussten nicht, dass ein „Mittelalter“ beginnt.' },
    ],
  }, { ordnen: 18, sortieren: 40, passtNicht: 14, frage: 28 });

  // ---------- Woher wissen wir das? Quellen ----------
  const QART = ['Sachquelle', 'Bildquelle', 'Textquelle', 'mündliche Quelle'];
  const quellen = baue('g5-quellen', {
    h: 'Sachquelle: ein Gegenstand (Werkzeug, Münze, Gebäude). Bildquelle: ein Bild aus der Zeit. Textquelle: etwas Geschriebenes. Mündliche Quelle: jemand erzählt. Eine <b>Darstellung</b> ist später gemacht, zum Beispiel ein Schulbuchtext.',
    S: { kats: QART, f: (x) => `Welche Art von Quelle ist <b>${x}</b>?`, h: 'Ist es ein Gegenstand, ein Bild, ein Text oder eine Erzählung?',
      items: [['ein Faustkeil aus Stein', 0, 'ein Gegenstand'], ['eine alte Münze', 0, 'ein Gegenstand'], ['eine Mumie', 0, 'ein Fund, den man anfassen kann'], ['eine Tonscherbe', 0, 'ein Gegenstand'], ['die Reste eines Hauses', 0, 'auch Gebäude sind Sachquellen'], ['Ötzis Kupferbeil', 0, 'ein Gegenstand'],
        ['eine Höhlenmalerei', 1, 'ein Bild aus der Steinzeit'], ['ein Bild auf einer griechischen Vase', 1, 'ein Bild aus der Zeit'], ['eine Wandmalerei in einem Grab', 1, 'ein Bild aus der Zeit'], ['ein altes Foto', 1, 'ein Bild aus der Zeit'],
        ['ein Papyrus mit Hieroglyphen', 2, 'etwas Geschriebenes'], ['eine Inschrift auf einem Stein', 2, 'etwas Geschriebenes'], ['ein Brief von 1945', 2, 'etwas Geschriebenes'], ['ein altes Tagebuch', 2, 'etwas Geschriebenes'],
        ['Oma erzählt von ihrer Schulzeit', 3, 'jemand erzählt, was er erlebt hat'], ['ein Interview mit einer Zeitzeugin', 3, 'jemand erzählt, was er erlebt hat']] },
    F: [
      { f: 'Ein <b>Schulbuchtext über die Steinzeit</b>, geschrieben 2019. Was ist das?', a: 'eine Darstellung', x: ['eine Sachquelle', 'eine Bildquelle', 'eine Textquelle aus der Steinzeit'], w: 'Er ist viel später geschrieben worden. Eine Darstellung erklärt die Vergangenheit, sie stammt nicht aus ihr.' },
      { f: 'Eine <b>Zeichnung von heute</b>, wie ein Steinzeitdorf ausgesehen haben könnte. Was ist das?', a: 'eine Darstellung', x: ['eine Bildquelle aus der Steinzeit', 'eine Sachquelle', 'eine mündliche Quelle'], w: 'Solche Zeichnungen (Rekonstruktionen) sind später gemacht. Sie zeigen, was Forscher vermuten.' },
      { f: 'Ein <b>Film</b> über die Pyramiden, gedreht 2020. Was ist das?', a: 'eine Darstellung', x: ['eine Sachquelle', 'eine Textquelle', 'eine Bildquelle aus Ägypten'], w: 'Der Film ist heute gemacht. Er stellt die Vergangenheit dar.' },
      { f: 'Was ist eine <b>Quelle</b>?', a: 'alles, was aus der Vergangenheit übrig ist und uns etwas über sie verrät', x: ['nur alte Bücher', 'ein Text, den ein Forscher heute schreibt', 'nur Dinge, die im Museum stehen'], w: 'Quellen stammen aus der Zeit selbst: Gegenstände, Bilder, Texte, Erzählungen.' },
      { f: 'Ein <b>Faustkeil</b> wird gefunden. Was kann er uns <b>nicht</b> verraten?', a: 'wie sein Besitzer hieß', x: ['woraus er gemacht ist', 'wie er bearbeitet wurde', 'wie groß er ist'], w: 'Ein Gegenstand spricht nicht. Namen, Gedanken und Gefühle der Menschen erfahren wir aus ihm nicht. Das sind die Grenzen einer Quelle.', svg: 'faustkeil' },
      { f: 'Wer gräbt alte Dinge aus und untersucht sie?', a: 'eine Archäologin oder ein Archäologe', x: ['eine Astronomin oder ein Astronom', 'eine Architektin oder ein Architekt', 'ein Bürgermeister'], w: 'Archäologen suchen und untersuchen Funde aus der Vergangenheit.' },
      { f: 'Warum sagt man: Geschichte ist eine <b>Rekonstruktion</b>?', a: 'Forscher setzen aus vielen Quellen ein Bild der Vergangenheit zusammen.', x: ['Weil man die Vergangenheit filmen kann.', 'Weil alle alten Häuser wieder aufgebaut werden.', 'Weil Geschichte nur erfunden ist.'], w: 'Wie bei einem Puzzle mit fehlenden Teilen: Man setzt zusammen, was die Quellen verraten. Manches bleibt Vermutung.' },
      { f: 'Dein erster Schultag gehört zu deiner …', a: '„kleinen“ Geschichte (deinem eigenen Leben)', x: ['„großen“ Geschichte (Weltgeschichte)', 'Urgeschichte', 'Mittelalter-Geschichte'], w: 'Jeder Mensch hat eine eigene kleine Geschichte. Sie ist ein Teil der großen Geschichte aller Menschen.' },
    ],
    T: [
      { f: 'Forscher, die alte Funde ausgraben, heißen ___.', a: ['Archäologen', 'Archäologinnen', 'Archäologe', 'Archäologin'], w: 'Archäologen graben aus, Historiker werten Quellen aus und schreiben darüber.' },
      { f: 'Ein Gegenstand aus der Vergangenheit, zum Beispiel ein Werkzeug, ist eine ___.', a: ['Sachquelle', 'gegenständliche Quelle'], w: 'Gegenstände heißen Sachquellen oder gegenständliche Quellen.' },
      { f: 'Ein Schulbuchtext von heute über die Vergangenheit ist keine Quelle, sondern eine ___.', a: 'Darstellung', w: 'Darstellungen werden später gemacht und erklären die Vergangenheit.' },
    ],
    A: { w: ['Eine Quelle stammt aus der Zeit, über die sie etwas verrät.', 'Ein Gegenstand verrät nicht, was sein Besitzer dachte.', 'Auch Gebäude können Quellen sein.', 'Eine Rekonstruktionszeichnung ist eine Darstellung.'],
      f: ['Ein Schulbuchtext von heute ist eine Quelle aus der Steinzeit.', 'Eine Sachquelle ist immer ein Text.', 'Aus Quellen wissen wir alles ganz genau.', 'Mündliche Quellen gibt es aus der Steinzeit.'] },
  }, { sortieren: 34, frage: 30, tippen: 10, passtNicht: 10, aussage: 16 });

  // =====================================================
  // Bereich 01: Das Leben der Menschen in der Frühgeschichte (ANNO 1, S. 12–43; Lehrplan LB 2, erster Teil)
  // =====================================================
  const mensch = baue('g5-mensch', {
    h: 'Die ersten Menschen lebten in Afrika. Von dort zogen sie in die ganze Welt. Der heutige Mensch heißt Homo sapiens.',
    O: [{ t: 'Ordne nach der Zeit, wann sie zuerst auftraten: <b>die ältesten zuerst</b>.', items: ['Vormenschen wie „Lucy“', 'Homo habilis', 'Homo erectus', 'Homo sapiens'], n: 4,
      s1: 'Vom Vormenschen zum heutigen Menschen:', w: 'Lucy (vor etwa 3,2 Millionen Jahren) → Homo habilis (vor etwa 2,5 Millionen Jahren) → Homo erectus (vor etwa 2 Millionen Jahren) → Homo sapiens (vor etwa 300.000 Jahren).' }],
    F: [
      { f: 'Auf welchem Kontinent lebten die <b>ersten Menschen</b>?', a: 'Afrika', x: ['Europa', 'Asien', 'Amerika'], w: 'Alle Funde, die älter als zwei Millionen Jahre sind, stammen aus Afrika.' },
      { f: 'Wie heißt der <b>heutige Mensch</b> mit seinem wissenschaftlichen Namen?', a: 'Homo sapiens', x: ['Homo erectus', 'Homo habilis', 'Neandertaler'], w: '„Homo sapiens“ heißt „vernunftbegabter“ oder „weiser Mensch“. Das sind wir.' },
      { f: 'Seit ungefähr wann gibt es den <b>Homo sapiens</b>?', a: 'seit etwa 300.000 Jahren', x: ['seit etwa 3000 Jahren', 'seit etwa 30 Millionen Jahren', 'seit etwa 300 Jahren'], w: 'Die ältesten Knochen des Homo sapiens sind etwa 300.000 Jahre alt. Sie wurden in Afrika gefunden.' },
      { f: 'Was bedeutet „Homo <b>erectus</b>“?', a: 'aufrechter Mensch', x: ['geschickter Mensch', 'weiser Mensch', 'starker Mensch'], w: 'Homo erectus ging aufrecht. Er zog als einer der ersten aus Afrika nach Europa und Asien.' },
      { f: 'Was bedeutet „Homo <b>habilis</b>“?', a: 'geschickter Mensch', x: ['aufrechter Mensch', 'weiser Mensch', 'Mensch aus dem Tal'], w: 'Homo habilis stellte schon einfache Steinwerkzeuge her, darum „geschickt“.' },
      { f: 'Welcher Frühmensch stellte den <b>Faustkeil</b> her?', a: 'Homo erectus', x: ['Lucy', 'Homo sapiens im Mittelalter', 'die alten Ägypter'], w: 'Der Faustkeil war ein großer Fortschritt: ein Werkzeug für viele Aufgaben.', svg: 'faustkeil' },
      { f: 'Wo lebten die <b>Neandertaler</b>?', a: 'in Europa und Westasien', x: ['nur in Amerika', 'nur in Australien', 'in Ägypten am Nil'], w: 'Benannt sind sie nach dem Neandertal bei Düsseldorf, wo man ihre Knochen fand. Sie starben vor etwa 40.000 Jahren aus.' },
      { f: '„Lucy“ ist ein berühmter Fund. Was war Lucy?', a: 'ein Vormensch, etwa 3,2 Millionen Jahre alt', x: ['eine ägyptische Königin', 'eine Höhle in Frankreich', 'die erste Bäuerin in Sachsen'], w: 'Lucy wurde in Afrika gefunden. Sie konnte schon aufrecht gehen.' },
      { f: 'Ungefähr wann kam der <b>Homo sapiens nach Europa</b>?', a: 'vor etwa 45.000 Jahren', x: ['vor etwa 450 Jahren', 'vor etwa 4,5 Millionen Jahren', 'vor etwa 4500 Jahren'], w: 'Er traf dort auf die Neandertaler, die bald darauf ausstarben.' },
    ],
    T: [
      { f: 'Der heutige Mensch heißt Homo ___.', a: 'sapiens', w: 'Homo sapiens: der „vernunftbegabte Mensch“.' },
      { f: 'Die ersten Menschen lebten in ___.', a: 'Afrika', w: 'Von Afrika aus breiteten sich die Menschen über die Erde aus.' },
      { f: 'Homo erectus heißt übersetzt: der ___ Mensch.', a: 'aufrechte', w: 'erectus = aufgerichtet, aufrecht.' },
    ],
    A: { w: ['Die ersten Menschen lebten in Afrika.', 'Homo sapiens und Neandertaler lebten eine Zeit lang gleichzeitig.', 'Der Faustkeil ist ein Werkzeug des Homo erectus.'],
      f: ['Der Mensch stammt aus Europa.', 'Die Neandertaler leben heute noch.', 'Lucy war eine ägyptische Königin.', 'Homo sapiens gibt es erst seit 3000 Jahren.'] },
  }, { frage: 40, ordnen: 16, tippen: 18, aussage: 16 });

  const ALT_TIPP = 'In der Altsteinzeit lebten die Menschen als Jäger und Sammler. Sie zogen den Tieren hinterher und wohnten in Zelten oder unter Felsdächern. Es war Eiszeit.';
  const altstein = baue('g5-alt', {
    h: ALT_TIPP,
    F: [
      { f: 'Wie bekamen die Menschen der Altsteinzeit ihre Nahrung?', a: 'Sie jagten, fischten und sammelten Pflanzen.', x: ['Sie bauten Getreide an.', 'Sie hielten Kühe und Schweine.', 'Sie kauften sie auf dem Markt.'], w: 'Sie waren Jäger und Sammler. Ackerbau kam erst in der Jungsteinzeit.' },
      { f: 'Warum zogen die Menschen der Altsteinzeit immer weiter?', a: 'Sie folgten den Tierherden und suchten Pflanzen.', x: ['Sie suchten bessere Schulen.', 'Sie wollten neue Länder erobern.', 'Ihre Häuser waren zu klein.'], w: 'Wer von Jagd lebt, muss dorthin, wo die Tiere sind.' },
      { f: 'Wie nennt man Menschen <b>ohne festen Wohnort</b>?', a: 'Nomaden', x: ['Bauern', 'Bürger', 'Pharaonen'], w: 'Nomaden ziehen umher. Die Menschen der Altsteinzeit lebten so.' },
      { f: 'Wo wohnten die Menschen der Altsteinzeit meistens?', a: 'in Zelten aus Fellen oder unter Felsdächern', x: ['tief drinnen in dunklen Höhlen', 'in Langhäusern im Dorf', 'in Häusern aus Stein mit Ziegeldach'], w: 'Tief in den Höhlen war es kalt, dunkel und feucht. Dort malten sie, wohnten aber eher am Eingang oder in Zelten.' },
      { f: 'Wie heißt dieses Werkzeug?', a: 'Faustkeil', x: ['Sichel', 'Mahlstein', 'Pflug'], w: 'Mit dem Faustkeil konnte man schneiden, schaben, hacken und graben.', svg: 'faustkeil' },
      { f: 'Wofür brauchte man diese Nadel aus Knochen?', a: 'um Kleidung aus Fellen zu nähen', x: ['um Bilder zu malen', 'um Getreide zu ernten', 'um Feuer zu machen'], w: 'Mit Nadel und Tiersehnen nähten sie warme Kleidung. In der Eiszeit war das überlebenswichtig.', svg: 'nadel' },
      { f: 'Wozu diente dieser Speer?', a: 'zur Jagd', x: ['zum Pflügen', 'zum Nähen', 'zum Schreiben'], w: 'Mit Speeren jagten die Menschen große Tiere wie Rentiere oder Wildpferde.', svg: 'speer' },
      { f: 'Welches Tier lebte in der <b>Eiszeit</b> in Europa?', a: 'Mammut', x: ['Huhn', 'Hauskatze', 'Pfau'], w: 'Mammut, Rentier, Wollnashorn und Höhlenbär lebten in der Kälte der Eiszeit.' },
      { f: 'Wofür nutzten die Menschen ein erlegtes Tier?', a: 'für fast alles: Fleisch, Fell, Knochen und Sehnen', x: ['nur für das Fleisch', 'nur für das Fell', 'gar nicht, sie aßen nur Pflanzen'], w: 'Fleisch zum Essen, Fell für Kleidung und Zelte, Knochen für Werkzeuge, Sehnen als Fäden.' },
      { f: 'Warum war das <b>Feuer</b> so wichtig?', a: 'Es gab Wärme und Licht, schützte vor Tieren und man konnte Fleisch braten.', x: ['Man brauchte es zum Schmieden von Eisen.', 'Damit trieb man Mühlen an.', 'Damit beleuchtete man die Straßen.'], w: 'Feuer machte das Leben in der Kälte erst möglich.' },
      { f: 'Bis ungefähr wann dauerte die <b>Altsteinzeit</b>?', a: 'bis vor etwa 12.000 Jahren', x: ['bis vor etwa 120 Jahren', 'bis vor etwa 1200 Jahren', 'bis heute'], w: 'Mit dem Ende der Eiszeit endete auch die Altsteinzeit.' },
    ],
    T: [
      { f: 'Menschen ohne festen Wohnort nennt man ___.', a: ['Nomaden', 'Nomade'], w: 'Nomaden ziehen von Ort zu Ort.' },
      { f: 'Das wichtigste Werkzeug der frühen Altsteinzeit war der ___.', a: 'Faustkeil', w: 'Ein Stein, der so bearbeitet wurde, dass er gut in der Hand lag und scharfe Kanten hatte.', svg: 'faustkeil' },
      { f: 'Die Menschen der Altsteinzeit lebten als Jäger und ___.', a: 'Sammler', w: 'Sie jagten Tiere und sammelten Beeren, Nüsse, Wurzeln und Pilze.' },
    ],
    A: { w: ['Die Menschen der Altsteinzeit waren Jäger und Sammler.', 'Sie nähten Kleidung aus Fellen.', 'In der Altsteinzeit war es in Europa sehr kalt.'],
      f: ['In der Altsteinzeit gab es schon Dörfer mit Feldern.', 'Die Menschen der Altsteinzeit hielten Kühe im Stall.', 'In der Altsteinzeit schrieben die Menschen Briefe.', 'Die Menschen wohnten tief in dunklen Höhlen.'] },
  }, { frage: 46, tippen: 20, aussage: 18 });

  const hoehle = baue('g5-hoehle', {
    h: 'Höhlenbilder entstanden in der Eiszeit. Die Farben kamen aus der Natur: Ocker (gelb, rot), Holzkohle (schwarz), Kreide (weiß). Gemalt wurden vor allem Tiere.',
    S: { kats: ['Farbe', 'Malwerkzeug', 'Licht'], f: (x) => `Wofür brauchten die Höhlenmaler: <b>${x}</b>?`, h: 'Womit wird gemalt, was wird aufgetragen, und was macht die Höhle hell?',
      items: [['Ocker', 0, 'rote und gelbe Erdfarbe'], ['Holzkohle', 0, 'für schwarze Farbe'], ['Kreide', 0, 'für weiße Farbe'], ['Pinsel aus Tierhaaren', 1], ['ein Bausch aus Moos', 1], ['ein Röhrchen zum Pusten der Farbe', 1, 'so entstanden Umrisse von Händen'], ['die eigenen Finger', 1],
        ['eine Steinlampe mit Tierfett', 2, 'in der Höhle war es stockdunkel'], ['eine Fackel', 2]] },
    F: [
      { f: 'Woraus machten die Höhlenmaler <b>rote und gelbe</b> Farbe?', a: 'aus Ocker, einer farbigen Erde', x: ['aus Tomaten', 'aus Farbe aus dem Laden', 'aus Blut von Mammuts'], w: 'Ocker ist eine Erde mit Eisen darin. Man zerrieb sie zu Pulver.' },
      { f: 'Woraus machten sie <b>schwarze</b> Farbe?', a: 'aus Holzkohle', x: ['aus Ocker', 'aus Kreide', 'aus Tinte'], w: 'Verkohltes Holz aus dem Feuer färbt schwarz.' },
      { f: 'Wie nennt man <b>Farbpulver</b> aus Erde und Mineralien?', a: 'Pigment', x: ['Pinsel', 'Papyrus', 'Fresko'], w: 'Das Pigment wurde mit Wasser, Fett oder Spucke angerührt.' },
      { f: 'Wie machten die Maler in der dunklen Höhle <b>Licht</b>?', a: 'mit Lampen aus Stein, in denen Tierfett brannte', x: ['mit Taschenlampen', 'mit Kerzen aus Bienenwachs aus dem Laden', 'gar nicht, sie malten im Dunkeln'], w: 'Solche Steinlampen haben Archäologen in Höhlen gefunden.' },
      { f: 'Was malten die Menschen in den Höhlen <b>am häufigsten</b>?', a: 'Tiere wie Pferde, Bisons und Hirsche', x: ['Häuser und Straßen', 'Könige und Pharaonen', 'Blumen im Garten'], w: 'Menschen sind auf den Bildern selten. Meist sieht man die Tiere der Eiszeit.' },
      { f: 'In welchem Land liegt die Höhle von <b>Lascaux</b>?', a: 'Frankreich', x: ['Spanien', 'Ägypten', 'Griechenland'], w: 'Vier Jugendliche entdeckten sie 1940. Die Bilder sind etwa 17.000 Jahre alt.' },
      { f: 'In welchem Land liegt die Höhle von <b>Altamira</b>?', a: 'Spanien', x: ['Frankreich', 'Italien', 'Deutschland'], w: 'Altamira wurde 1879 als erste Höhle mit Bildern aus der Steinzeit entdeckt. Berühmt sind die farbigen Bisons.' },
      { f: 'Die Höhle von <b>Chauvet</b> (Frankreich) ist besonders, weil …', a: 'ihre Bilder zu den ältesten der Welt gehören (über 30.000 Jahre).', x: ['sie die jüngsten Bilder hat (100 Jahre).', 'dort Pyramiden stehen.', 'dort Hieroglyphen an den Wänden stehen.'], w: 'Sie wurde erst 1994 entdeckt und ist für Besucher geschlossen.' },
      { f: 'Warum malten die Menschen in den Höhlen? Was wissen wir sicher?', a: 'Man weiß es nicht genau. Es gibt nur Vermutungen.', x: ['Sie wollten ihre Höhle schön machen, das steht in einem Brief.', 'Es war eine Schulaufgabe.', 'Sie wollten die Bilder verkaufen.'], w: 'Die Maler haben nichts aufgeschrieben. Vielleicht ging es um Jagdglück oder Religion. Hier kommen die Quellen an ihre Grenzen.' },
      { f: 'Warum dürfen Besucher heute <b>nicht</b> in die echte Höhle von Lascaux?', a: 'Atem, Wärme und Licht der vielen Besucher schaden den Bildern.', x: ['Die Höhle ist eingestürzt.', 'Die Bilder sind gestohlen worden.', 'Dort wohnt ein Bär.'], w: 'Besucher sehen heute einen genauen Nachbau.' },
    ],
    T: [
      { f: 'Rote und gelbe Erdfarbe heißt ___.', a: 'Ocker', w: 'Die älteste Künstlerfarbe der Welt.' },
      { f: 'Farbpulver aus Mineralien nennt man ___.', a: ['Pigment', 'Pigmente'], w: 'Pigmente geben Farbe.' },
      { f: 'Die Höhle in Spanien mit den farbigen Bisons heißt ___.', a: 'Altamira', w: 'Entdeckt 1879.' },
      { f: 'Die Höhle in Frankreich, die 1940 von Jugendlichen entdeckt wurde, heißt ___.', a: 'Lascaux', w: 'Gesprochen: „Laskoh“.' },
      { f: 'Ein Bild an einer Felswand nennt man auch ___.', a: ['Felsbild', 'Felsbilder', 'Felsmalerei'], w: 'Höhlenmalerei, Felsbild, Felsmalerei: alles dasselbe.' },
      { f: 'Die Kunst in den Höhlen entstand während der ___, als Mammuts lebten.', a: 'Eiszeit', w: 'In der Eiszeit war es viel kälter als heute.' },
    ],
  }, { frage: 36, tippen: 24, sortieren: 22, passtNicht: 10 });

  const jung = baue('g5-jung', {
    h: 'In der Jungsteinzeit wurden die Menschen sesshaft: Sie bauten Getreide an, hielten Tiere, bauten Häuser und töpferten. Das begann im Vorderen Orient und kam um 5500 v. Chr. nach Mitteleuropa.',
    O: [{ t: 'Vom Feld zum Brot: Bringe die Arbeiten in die richtige Reihenfolge.', items: ['Feld anlegen und säen', 'Getreide mit der Sichel ernten', 'Körner auf dem Mahlstein mahlen', 'Fladenbrot backen'], s1: 'So kam das Brot auf den Tisch:', w: 'säen → ernten → mahlen → backen.' }],
    F: [
      { f: 'Was war die <b>größte Veränderung</b> in der Jungsteinzeit?', a: 'Die Menschen wurden sesshaft und lebten von Ackerbau und Viehzucht.', x: ['Die Menschen erfanden die Schrift.', 'Die Menschen bauten Pyramiden.', 'Die Menschen begannen zu jagen.'], w: 'Weil diese Veränderung so groß war, spricht man von der „Jungsteinzeitlichen Revolution“.' },
      { f: 'Wo begannen Menschen <b>zuerst</b> mit dem Ackerbau?', a: 'im Vorderen Orient', x: ['in Sachsen', 'in Amerika', 'in Skandinavien'], w: 'Vor rund 12.000 Jahren, in den fruchtbaren Gebieten des heutigen Vorderen Orients. Von dort breitete sich die neue Lebensweise aus.' },
      { f: 'Ungefähr wann kam die bäuerliche Lebensweise nach <b>Mitteleuropa</b>?', a: 'um 5500 v. Chr.', x: ['um 500 n. Chr.', 'um 1500 n. Chr.', 'um 55.000 v. Chr.'], w: 'Die ersten Bauern in Mitteleuropa nennt man nach ihren Gefäßen „Bandkeramiker“.' },
      { f: 'Welche Tiere hielten die ersten Bauern?', a: 'Schafe, Ziegen, Rinder und Schweine', x: ['Mammuts und Wollnashörner', 'Pferde für Autos', 'Löwen und Bären'], w: 'Aus wilden Tieren wurden über lange Zeit Haustiere.' },
      { f: 'Wie heißt dieses Gefäß nach seinem Muster?', a: 'Bandkeramik', x: ['Amphore', 'Kanope', 'Faustkeil'], w: 'Die Bänder sind eingeritzt. In Tongefäßen lagerte man Vorräte.', svg: 'topf' },
      { f: 'Wozu brauchten die Bauern dieses Werkzeug?', a: 'um Getreide zu ernten', x: ['um Tiere zu jagen', 'um Kleidung zu nähen', 'um Bilder zu malen'], w: 'Eine Sichel mit scharfen Klingen aus Feuerstein.', svg: 'sichel' },
      { f: 'Wozu diente dieses geschliffene Steinbeil?', a: 'um Bäume zu fällen und Holz zu bearbeiten', x: ['um Brot zu backen', 'um Fische zu fangen', 'um zu schreiben'], w: 'Für Häuser, Zäune und Brunnen brauchte man viel Holz.', svg: 'beil' },
      { f: 'Wie hießen die großen Häuser der ersten Bauern in Mitteleuropa?', a: 'Langhäuser', x: ['Pyramiden', 'Iglus', 'Burgen'], w: 'Sie waren oft über 20 Meter lang, mit Wänden aus Flechtwerk und Lehm.', svg: 'langhaus' },
      { f: 'Woraus machten die Bauern <b>Leinen</b> für Kleidung?', a: 'aus Flachs, den sie anbauten', x: ['aus Baumwolle aus Amerika', 'aus Plastik', 'aus Papyrus'], w: 'Aus den Fasern des Flachses spannen sie Fäden und webten Stoff.' },
      { f: 'In Sachsen fand man über 7000 Jahre alte <b>Brunnen</b>. Woraus waren sie gebaut?', a: 'aus Holz', x: ['aus Beton', 'aus Bronze', 'aus Marmor'], w: 'Im Grundwasser blieb das Holz erhalten. Einer der bekanntesten ist der Brunnen von Altscherbitz bei Leipzig.' },
      { f: 'Was war eine <b>Folge</b> davon, dass die Menschen Vorräte und Felder hatten?', a: 'Es gab Besitz, und darum auch Streit.', x: ['Niemand musste mehr arbeiten.', 'Alle wurden Jäger.', 'Die Menschen zogen wieder umher.'], w: 'Wer Vorräte und Land besitzt, muss sie schützen. Es entstanden Zäune und manchmal Kämpfe.' },
    ],
    T: [
      { f: 'Menschen, die an einem festen Ort wohnen, nennt man ___.', a: 'sesshaft', w: 'Gegenteil: Nomaden.' },
      { f: 'Die Gefäße der ersten Bauern hatten Bandmuster. Man nennt sie ___.', a: ['Bandkeramik', 'Bandkeramiken'], w: 'Keramik = gebrannter Ton.', svg: 'topf' },
      { f: 'Die großen Häuser der ersten Bauern heißen ___.', a: ['Langhäuser', 'Langhaus'], w: 'Unter einem Dach war Platz für eine große Familie und Vorräte.', svg: 'langhaus' },
      { f: 'Getreide wurde auf einem ___ zu Mehl gemahlen.', a: 'Mahlstein', w: 'Ein flacher Stein und ein kleiner Läufer zum Reiben.', svg: 'mahlstein' },
      { f: 'Getreide anbauen nennt man ___.', a: 'Ackerbau', w: 'Ackerbau und Viehzucht: die zwei Grundlagen der Bauern.' },
    ],
    A: { w: ['In der Jungsteinzeit hielten die Menschen Haustiere.', 'Die ersten Bauern lagerten Vorräte in Tongefäßen.', 'Ackerbau begann zuerst im Vorderen Orient.'],
      f: ['In der Jungsteinzeit benutzten die Bauern Pflüge aus Eisen.', 'Die Jungsteinzeit kam um 1500 n. Chr. nach Sachsen.', 'Die ersten Bauern lebten in Zelten und zogen den Herden nach.'] },
  }, { frage: 40, tippen: 22, ordnen: 12, aussage: 14 });

  const AJ = ['Altsteinzeit', 'Jungsteinzeit'];
  const altjung = baue('g5-altjung', {
    h: 'Altsteinzeit: Jäger und Sammler, umherziehen, Zelte, Faustkeil, Eiszeit. Jungsteinzeit: Bauern, sesshaft, Häuser, Felder, Haustiere, Töpfe.',
    S: { kats: AJ, f: (x) => `Alt- oder Jungsteinzeit? <b>${x}</b>`, h: 'Ziehen die Menschen umher (alt) oder bleiben sie an einem Ort (jung)?',
      items: [['Jäger und Sammler', 0], ['Nomaden', 0, 'sie ziehen umher'], ['Zelte aus Fellen', 0], ['Faustkeil', 0], ['Höhlenmalerei', 0, 'in der Eiszeit'], ['Mammutjagd', 0], ['den Tierherden folgen', 0],
        ['sesshaft', 1], ['Ackerbau', 1], ['Viehzucht', 1], ['Langhaus', 1], ['Tongefäße für Vorräte', 1], ['geschliffenes Steinbeil', 1], ['Stoff aus Flachs weben', 1], ['Dörfer', 1], ['Holzbrunnen', 1]] },
    O: [{ t: 'Bringe die Zeitalter in die richtige Reihenfolge: <b>das älteste zuerst</b>.', items: ['Altsteinzeit', 'Jungsteinzeit', 'Bronzezeit', 'Eisenzeit'], s1: 'Vom Stein zum Metall:', w: 'Altsteinzeit → Jungsteinzeit → Bronzezeit → Eisenzeit. Die Namen kommen vom wichtigsten Material für Werkzeuge.' }],
    F: [
      { f: 'Woher haben die Steinzeiten ihre Namen?', a: 'vom wichtigsten Material für Werkzeuge: Stein', x: ['von einem König namens Stein', 'von den Steinhäusern', 'von den Pyramiden'], w: 'Ähnlich bei Bronzezeit und Eisenzeit.' },
      { f: 'Worin unterscheiden sich die Steinwerkzeuge der Jungsteinzeit oft von denen der Altsteinzeit?', a: 'Sie wurden geschliffen und glatt poliert.', x: ['Sie waren aus Eisen.', 'Sie waren aus Plastik.', 'Sie wurden nur geschlagen, nie geschliffen.'], w: 'Geschliffene Steinbeile waren besonders gut zum Bäume fällen.' },
      { f: 'Warum spricht man von der „Jungsteinzeitlichen <b>Revolution</b>“?', a: 'Weil sich die Lebensweise der Menschen völlig veränderte.', x: ['Weil es einen Aufstand gegen einen König gab.', 'Weil alles an einem einzigen Tag passierte.', 'Weil die Steine plötzlich jünger wurden.'], w: 'Revolution heißt hier: große Umwälzung. Sie dauerte aber Tausende Jahre.' },
    ],
    A: { w: ['In der Altsteinzeit zogen die Menschen umher, in der Jungsteinzeit wurden sie sesshaft.', 'Tongefäße gehören zur Jungsteinzeit.', 'Auf die Jungsteinzeit folgte die Bronzezeit.'],
      f: ['In der Altsteinzeit lebten die Menschen in Langhäusern.', 'Auf die Altsteinzeit folgte gleich die Eisenzeit.', 'In der Jungsteinzeit lebten die Menschen nur von der Jagd.'] },
  }, { sortieren: 44, passtNicht: 20, ordnen: 12, frage: 12, aussage: 12 });

  const metall = baue('g5-metall', {
    h: 'Zuerst nutzten die Menschen Kupfer. Mischt man Kupfer mit Zinn, entsteht die härtere Bronze. Weil man Kupfer und Zinn selten am selben Ort findet, wurde Handel wichtig.',
    O: [{ t: 'Wie entsteht ein Gegenstand aus Bronze? Bringe die Schritte in die richtige Reihenfolge.', items: ['Erz im Bergwerk abbauen', 'Kupfer und Zinn im heißen Feuer schmelzen', 'flüssiges Metall in eine Form gießen', 'abkühlen lassen und blank schleifen'], s1: 'Vom Gestein zum Werkzeug:', w: 'abbauen → schmelzen → gießen → schleifen.' }],
    F: [
      { f: 'Woraus besteht <b>Bronze</b>?', a: 'aus Kupfer und Zinn', x: ['aus Eisen und Gold', 'aus Stein und Holz', 'aus Silber und Ton'], w: 'Etwa 9 Teile Kupfer und 1 Teil Zinn. Bronze ist härter als Kupfer.' },
      { f: 'Welches Metall benutzten die Menschen <b>zuerst</b>?', a: 'Kupfer', x: ['Eisen', 'Aluminium', 'Stahl'], w: 'Schon Ötzi hatte ein Beil mit einer Klinge aus Kupfer.' },
      { f: 'Warum war Bronze besser als reines Kupfer?', a: 'Bronze ist härter.', x: ['Bronze ist weicher.', 'Bronze rostet sofort.', 'Bronze ist durchsichtig.'], w: 'Härtere Klingen bleiben länger scharf.' },
      { f: 'Warum wurde in der Bronzezeit der <b>Handel</b> so wichtig?', a: 'Kupfer und Zinn findet man selten am selben Ort.', x: ['Weil es schon Geldscheine gab.', 'Weil niemand mehr arbeiten wollte.', 'Weil Bronze überall auf dem Boden lag.'], w: 'Händler brachten die Metalle oft über weite Strecken.' },
      { f: 'Welcher <b>neue Beruf</b> entstand mit den Metallen?', a: 'Bronzegießer oder Schmied', x: ['Lokführer', 'Programmierer', 'Pilot'], w: 'Metall zu bearbeiten ist schwierig. Spezialisten taten nur noch das: Es gab mehr verschiedene Berufe.' },
      { f: 'Ungefähr wann begann in Mitteleuropa die <b>Bronzezeit</b>?', a: 'um 2200 v. Chr.', x: ['um 2200 n. Chr.', 'um 22.000 v. Chr.', 'um 220 n. Chr.'], w: 'Die Bronzezeit dauerte bis etwa 800 v. Chr. Dann folgte die Eisenzeit.' },
      { f: 'Woraus ist dieses Schwert?', a: 'Bronze', x: ['Stein', 'Holz', 'Knochen'], w: 'Bronze glänzt goldbraun. Schwerter waren wertvoll und zeigten, wer reich war.', svg: 'schwert' },
      { f: 'Warum setzte sich später das <b>Eisen</b> durch?', a: 'Eisenerz findet man an viel mehr Orten.', x: ['Eisen ist leichter zu schmelzen als alles andere.', 'Eisen glänzt schöner als Gold.', 'Eisen wächst an Bäumen.'], w: 'Man braucht zwar ein heißeres Feuer, aber das Erz gibt es fast überall.' },
      { f: 'Wie veränderte das Metall das <b>Zusammenleben</b>?', a: 'Manche wurden durch Metall und Handel reich, es gab größere Unterschiede zwischen Arm und Reich.', x: ['Alle hatten plötzlich gleich viel.', 'Die Menschen wurden wieder Jäger.', 'Es gab keinen Streit mehr.'], w: 'In Gräbern reicher Menschen fand man viele wertvolle Beigaben aus Bronze und Gold.' },
    ],
    T: [
      { f: 'Bronze ist eine Mischung aus Kupfer und ___.', a: 'Zinn', w: 'Kupfer + Zinn = Bronze.' },
      { f: 'Nach der Bronzezeit kam die ___.', a: 'Eisenzeit', w: 'In Mitteleuropa ab etwa 800 v. Chr.' },
      { f: 'Das erste Metall, das Menschen nutzten, war ___.', a: 'Kupfer', w: 'Kupfer ist weich und leicht zu bearbeiten.' },
    ],
    A: { w: ['Bronze ist härter als Kupfer.', 'In der Bronzezeit gab es mehr Handel.', 'Bronze entsteht aus Kupfer und Zinn.'], f: ['Bronze ist aus Eisen und Gold.', 'Die Bronzezeit kam vor der Jungsteinzeit.', 'In der Bronzezeit brauchte niemand Händler.'] },
  }, { frage: 42, tippen: 18, ordnen: 14, aussage: 14 });

  const oetzi = baue('g5-oetzi', {
    h: 'Ötzi wurde 1991 in den Ötztaler Alpen im Eis gefunden. Er lebte vor etwa 5300 Jahren, am Ende der Jungsteinzeit, und hatte schon ein Beil aus Kupfer.',
    O: [{ t: 'Ordne nach der Zeit: <b>das Älteste zuerst</b>.', items: ['Ötzi stirbt in den Alpen', 'Bau der Cheops-Pyramide', 'Himmelsscheibe von Nebra entsteht', 'Ötzi wird gefunden'], j: [-3300, -2580, -1600, 1991], kurz: ['Ötzi stirbt', 'Cheops-Pyramide', 'Himmelsscheibe', 'Ötzi gefunden'], um: [1, 1, 1, 0], n: 4, w: 'Ötzi ist älter als die Pyramiden!' }],
    F: [
      { f: 'In welchem Jahr wurde Ötzi gefunden?', a: '1991', x: ['1891', '2011', '1951'], w: 'Am 19. September 1991 entdeckte ein Ehepaar aus Nürnberg beim Wandern die Leiche im Eis.' },
      { f: 'Wo wurde Ötzi gefunden?', a: 'in einem Gletscher in den Alpen', x: ['in einer Pyramide', 'in einem Moor in Sachsen', 'in einer Höhle in Spanien'], w: 'In den Ötztaler Alpen, auf über 3200 Metern Höhe, knapp auf der italienischen Seite der Grenze.' },
      { f: 'Wie alt ist Ötzi ungefähr?', a: 'etwa 5300 Jahre', x: ['etwa 530 Jahre', 'etwa 53.000 Jahre', 'etwa 300.000 Jahre'], w: 'Er lebte um 3300 v. Chr., am Ende der Jungsteinzeit.' },
      { f: 'Warum ist Ötzi so gut erhalten?', a: 'Das Eis des Gletschers hat ihn tiefgefroren.', x: ['Er wurde wie eine ägyptische Mumie einbalsamiert.', 'Er lag in einem Museum.', 'Er war aus Stein.'], w: 'Auch Kleidung und Ausrüstung aus Leder, Fell, Holz und Gras blieben erhalten. Das ist sehr selten.' },
      { f: 'Woraus war die Klinge von Ötzis <b>Beil</b>?', a: 'Kupfer', x: ['Eisen', 'Stein', 'Gold'], w: 'Das Kupferbeil war wertvoll. Es half auch, Ötzis Alter zu bestimmen.' },
      { f: 'Warum nennt man Ötzi einen „Wanderer zwischen den Zeiten“?', a: 'Er lebte in der Steinzeit, besaß aber schon ein Beil aus Metall.', x: ['Er konnte durch die Zeit reisen.', 'Er wanderte von Ägypten nach Griechenland.', 'Er lebte 1000 Jahre lang.'], w: 'Er steht am Übergang von der Steinzeit zur Metallzeit.' },
      { f: 'Woran starb Ötzi?', a: 'Er wurde von einem Pfeil in die Schulter getroffen.', x: ['Er erfror ganz friedlich.', 'Ein Mammut trampelte ihn nieder.', 'Er stürzte von einer Pyramide.'], w: 'Auf Röntgenbildern entdeckte man 2001 eine Pfeilspitze in seiner Schulter.' },
      { f: 'Wo liegt Ötzi heute?', a: 'in einem Museum in Bozen (Südtirol), in einer Kühlkammer', x: ['im Landesmuseum in Halle', 'im Britischen Museum in London', 'wieder im Gletscher'], w: 'Seit 1998 kann man ihn dort durch ein kleines Fenster sehen.' },
      { f: 'Was hatte Ötzi <b>nicht</b> dabei?', a: 'ein Schwert aus Eisen', x: ['ein Beil mit Kupferklinge', 'einen Bogen und Pfeile', 'einen Dolch aus Feuerstein'], w: 'Eisen kam erst über 2000 Jahre später nach Mitteleuropa.' },
      { f: 'Woher hat Ötzi seinen Namen?', a: 'von den Ötztaler Alpen, wo er gefunden wurde', x: ['von seinem echten Namen', 'von einem Forscher namens Ötzi', 'von einem Lied'], w: 'Wie er wirklich hieß, verrät uns keine Quelle.' },
      { f: 'Man fand auf Ötzis Haut viele Striche und Kreuze. Was sind sie?', a: 'Tätowierungen', x: ['Kratzer vom Eis', 'Bemalung von Forschern', 'Schriftzeichen'], w: 'Man zählte 61 Tätowierungen. Sie gehören zu den ältesten der Welt.' },
    ],
    T: [
      { f: 'Ötzi wurde im Jahr ___ gefunden.', a: '1991', w: 'Gefunden in den Ötztaler Alpen.' },
      { f: 'Ötzis Beil hatte eine Klinge aus ___.', a: 'Kupfer', w: 'Kupfer war das erste Metall der Menschen.' },
      { f: 'Ötzi liegt heute in einem Museum in ___.', a: 'Bozen', w: 'Bozen liegt in Südtirol, Italien.' },
    ],
    A: { w: ['Ötzi lebte vor etwa 5300 Jahren.', 'Ötzi wurde in den Alpen im Eis gefunden.', 'Ötzi besaß ein Beil aus Kupfer.'], f: ['Ötzi war ein ägyptischer Pharao.', 'Ötzi trug ein Schwert aus Eisen.', 'Ötzi wurde 1891 gefunden.', 'Ötzi lebte in der Römerzeit.'] },
  }, { frage: 46, tippen: 18, ordnen: 14, aussage: 14 });

  const nebra = baue('g5-nebra', {
    h: 'Die Himmelsscheibe ist aus Bronze mit Gold. Sie zeigt Sonne (oder Vollmond), Mondsichel und Sterne. Raubgräber fanden sie 1999 bei Nebra in Sachsen-Anhalt.',
    F: [
      { f: 'Woraus besteht die Himmelsscheibe von Nebra?', a: 'aus Bronze mit Gold', x: ['aus Stein mit Farbe', 'aus Eisen mit Silber', 'aus Ton mit Glas'], w: 'Die Scheibe ist etwa 32 Zentimeter groß und wiegt rund 2,3 Kilogramm.' },
      { f: 'Was ist auf der Scheibe zu sehen?', a: 'Sonne oder Vollmond, Mondsichel und Sterne', x: ['ein Pharao auf seinem Thron', 'eine Landkarte von Europa', 'Tiere aus der Eiszeit'], w: 'Sie gilt als die älteste bekannte Darstellung des Himmels mit echten Himmelserscheinungen.' },
      { f: 'Wo wurde die Himmelsscheibe gefunden?', a: 'auf dem Mittelberg bei Nebra in Sachsen-Anhalt', x: ['in einer Pyramide in Ägypten', 'in Dresden an der Elbe', 'in einer Höhle in Frankreich'], w: 'Nebra liegt nicht weit von Sachsen entfernt.' },
      { f: 'Wer hat die Scheibe 1999 ausgegraben?', a: 'Raubgräber mit einem Metallsuchgerät', x: ['Archäologen einer Universität', 'Schulkinder beim Ausflug', 'Ein Bauer beim Pflügen'], w: 'Sie gruben verboten und verkauften den Fund. 2002 stellte die Polizei die Scheibe in Basel sicher.' },
      { f: 'Wie alt ist die Himmelsscheibe ungefähr?', a: 'etwa 3600 Jahre', x: ['etwa 360 Jahre', 'etwa 36.000 Jahre', 'etwa 36 Jahre'], w: 'Sie stammt aus der Bronzezeit. Über das genaue Alter streiten Forscher.' },
      { f: 'Wo kann man die Himmelsscheibe heute sehen?', a: 'im Landesmuseum für Vorgeschichte in Halle (Saale)', x: ['im Museum in Bozen', 'im Britischen Museum in London', 'in der Pyramide von Gizeh'], w: 'Das Original liegt in Halle.' },
      { f: 'Warum schaden <b>Raubgräber</b> der Forschung?', a: 'Sie zerstören den Fundort, und wichtige Hinweise gehen verloren.', x: ['Sie graben zu langsam.', 'Sie bringen alles sofort ins Museum.', 'Sie schreiben zu viel auf.'], w: 'Wie und wo etwas im Boden lag, verrät viel über sein Alter und seine Bedeutung.' },
      { f: 'Wozu diente die Scheibe vermutlich?', a: 'als eine Art Kalender, um Sonne und Mond zu beobachten', x: ['als Teller für Festessen', 'als Schild im Kampf', 'als Spielzeug für Kinder'], w: 'Forscher vermuten: Mit ihr ließ sich bestimmen, wann man säen oder ernten sollte.' },
      { f: 'Was lag zusammen mit der Scheibe im Boden?', a: 'Schwerter, Beile und Armreifen aus Bronze', x: ['Münzen mit einer Eule', 'eine Mumie', 'Papyrusrollen'], w: 'Solche Beifunde helfen, das Alter zu bestimmen.' },
    ],
    T: [
      { f: 'Die Himmelsscheibe ist aus ___ mit Gold.', a: 'Bronze', w: 'Bronze: Kupfer + Zinn.' },
      { f: 'Die Himmelsscheibe wurde im Jahr ___ gefunden.', a: '1999', w: 'Gefunden auf dem Mittelberg bei Nebra.' },
      { f: 'Die Himmelsscheibe ist im Landesmuseum in ___ zu sehen.', a: ['Halle', 'Halle (Saale)', 'Halle an der Saale'], w: 'Halle liegt in Sachsen-Anhalt.' },
    ],
    A: { w: ['Die Himmelsscheibe stammt aus der Bronzezeit.', 'Raubgräber fanden die Scheibe.', 'Die Scheibe zeigt Sterne.'], f: ['Die Himmelsscheibe ist aus Eisen.', 'Die Himmelsscheibe wurde in Ägypten gefunden.', 'Archäologen haben die Scheibe 1999 sorgfältig ausgegraben.'] },
  }, { frage: 50, tippen: 26, aussage: 24 });

  // =====================================================
  // Bereich 02: Ägypten – eine frühe Hochkultur (ANNO 1, S. 44–83; Lehrplan LB 2, zweiter Teil)
  // =====================================================
  const nil = baue('g5-nil', {
    h: 'Ohne den Nil wäre Ägypten Wüste. Jedes Jahr trat er über die Ufer und ließ fruchtbaren Schlamm zurück. Der Nil fließt von Süden nach Norden ins Mittelmeer.',
    O: [{ t: 'Das Jahr am Nil: Bringe die Zeiten in die richtige Reihenfolge.', items: ['Überschwemmung (Achet)', 'Wasser geht zurück, Felder neu vermessen', 'Aussaat (Peret)', 'Ernte (Schemu)'], s1: 'So lief ein Jahr der Bauern am Nil:', w: 'Überschwemmung → Felder vermessen → Aussaat → Ernte. Dann kam wieder das Hochwasser.' }],
    F: [
      { f: 'Warum war die <b>Überschwemmung</b> des Nils gut für die Bauern?', a: 'Sie hinterließ fruchtbaren Schlamm auf den Feldern.', x: ['Sie spülte alle Häuser weg.', 'Sie brachte Fische in die Wüste.', 'Sie machte das Land zu Wüste.'], w: 'Der dunkle Schlamm war guter Dünger. Darum nannten die Ägypter ihr Land „Kemet“: das Schwarze Land.' },
      { f: 'In welche Richtung fließt der Nil?', a: 'von Süden nach Norden', x: ['von Norden nach Süden', 'von Westen nach Osten', 'im Kreis'], w: 'Er mündet im Norden ins Mittelmeer. Auf Karten fließt er also „nach oben“.', svg: 'nilkarte' },
      { f: 'Wo liegt <b>Unterägypten</b>?', a: 'im Norden, am Nildelta', x: ['im Süden', 'unter der Erde', 'in der Wüste im Westen'], w: 'Vorsicht, Falle: Der Nil fließt nach Norden. „Unten“ am Fluss ist also der Norden. Oberägypten liegt im Süden.', svg: 'nilkarte' },
      { f: 'Wie nannten die Ägypter die <b>Wüste</b>?', a: 'das Rote Land', x: ['das Schwarze Land', 'das Grüne Land', 'das Blaue Land'], w: 'Das fruchtbare Land am Nil hieß das Schwarze Land, die Wüste das Rote Land.' },
      { f: 'Warum stieg der Nil jedes Jahr im Sommer?', a: 'In den Bergen im Süden (Äthiopien) fiel viel Regen.', x: ['Weil in Ägypten viel Schnee schmolz.', 'Weil das Meer ins Land floss.', 'Weil der Pharao es befahl.'], w: 'Das Regenwasser floss den Nil hinab nach Ägypten.' },
      { f: 'Wie viele <b>Jahreszeiten</b> hatte das Jahr am Nil?', a: 'drei', x: ['vier', 'zwei', 'zwölf'], w: 'Überschwemmung (Achet), Aussaat (Peret) und Ernte (Schemu).' },
      { f: 'Wie viele Tage hatte der ägyptische Kalender?', a: '365', x: ['300', '400', '100'], w: '12 Monate mit je 30 Tagen, dazu 5 Extratage: 360 + 5 = 365.' },
      { f: 'Wozu bauten die Ägypter <b>Kanäle und Deiche</b>?', a: 'um das Wasser auf die Felder zu leiten und zu speichern', x: ['um Schiffe zu verstecken', 'um die Pyramiden zu kühlen', 'um Fische zu zählen'], w: 'So konnten sie mehr Land bewässern. Dafür mussten viele Menschen zusammenarbeiten.' },
      { f: 'Wozu diente ein <b>Nilometer</b>?', a: 'Er maß, wie hoch der Nil stieg.', x: ['Er maß die Länge des Nils.', 'Er zählte die Krokodile.', 'Er maß die Hitze.'], w: 'Am Wasserstand sah man, wie gut die Ernte wird. Danach richteten sich auch die Abgaben.' },
      { f: 'Was gäbe es in Ägypten <b>ohne</b> den Nil?', a: 'fast nur Wüste', x: ['dichten Urwald', 'viele Seen', 'Gletscher'], w: 'Es regnet in Ägypten fast nie. Alles Leben drängte sich am schmalen Streifen am Fluss.' },
    ],
    T: [
      { f: 'Der Nil fließt ins ___.', a: 'Mittelmeer', w: 'Vorher teilt er sich in viele Arme: das Nildelta.', svg: 'nilkarte' },
      { f: 'Die Zeit der Überschwemmung hieß ___.', a: 'Achet', w: 'Achet (Überschwemmung), Peret (Aussaat), Schemu (Ernte).' },
      { f: 'Die Ägypter nannten ihr fruchtbares Land Kemet, das ___ Land.', a: 'Schwarze', w: 'Nach dem dunklen Schlamm des Nils.' },
    ],
    A: { w: ['Der Nil fließt von Süden nach Norden.', 'Unterägypten liegt im Norden.', 'Die Überschwemmung brachte fruchtbaren Schlamm.'], f: ['Unterägypten liegt im Süden.', 'In Ägypten regnet es sehr viel.', 'Die Überschwemmung war für die Bauern nur schlecht.'] },
  }, { frage: 46, tippen: 16, ordnen: 16, aussage: 14 });

  const staat = baue('g5-staat', {
    h: 'Um 3000 v. Chr. wurden Ober- und Unterägypten ein Reich. An der Spitze stand der Pharao. Beamte zählten Vorräte, sammelten Abgaben und planten Bauten.',
    F: [
      { f: 'Ungefähr wann wurden Ober- und Unterägypten <b>ein Reich</b>?', a: 'um 3000 v. Chr.', x: ['um 3000 n. Chr.', 'um 300 v. Chr.', 'um 30.000 v. Chr.'], w: 'Ab dann regierte ein Pharao über ganz Ägypten.' },
      { f: 'Warum brauchten die Menschen am Nil einen <b>Staat</b>?', a: 'Kanäle, Deiche und Vorräte mussten für alle geplant werden.', x: ['Damit sie Fußball spielen konnten.', 'Weil sie keine Bauern mehr brauchten.', 'Damit niemand mehr arbeiten musste.'], w: 'Ein Dorf allein kann keinen langen Kanal bauen. Jemand musste die Arbeit vieler Menschen lenken.' },
      { f: 'Was bedeutet das Wort „<b>Pharao</b>“ ursprünglich?', a: '„großes Haus“', x: ['„Sohn des Nils“', '„König der Wüste“', '„Herr der Pyramiden“'], w: 'Zuerst meinte man damit den Palast, später den König selbst.' },
      { f: 'Als was sahen die Ägypter ihren <b>Pharao</b>?', a: 'als Gott auf Erden, Sohn des Sonnengottes', x: ['als gewählten Bürgermeister', 'als einfachen Bauern', 'als Fremden aus Griechenland'], w: 'Darum hatte er die höchste Macht: Er war Herrscher, oberster Priester, Richter und Heerführer.' },
      { f: 'Wer war der <b>höchste Beamte</b> nach dem Pharao?', a: 'der Wesir', x: ['der Schreiber', 'der Händler', 'der Bauer'], w: 'Der Wesir leitete die Verwaltung für den Pharao.' },
      { f: 'Was taten die <b>Beamten</b> des Pharaos?', a: 'Sie zählten Ernten, sammelten Abgaben und planten Bauten.', x: ['Sie jagten Mammuts.', 'Sie verkauften Autos.', 'Sie bauten allein die Pyramiden.'], w: 'Ohne Beamte, die schreiben und rechnen konnten, hätte der Staat nicht funktioniert.' },
      { f: 'Womit bezahlten die Bauern ihre <b>Abgaben</b>?', a: 'mit einem Teil ihrer Ernte', x: ['mit Geldscheinen', 'mit Kreditkarten', 'mit Goldmünzen aus Athen'], w: 'Das Getreide kam in große Speicher. In schlechten Jahren verteilte man es wieder.' },
      { f: 'Was zeigte die <b>Doppelkrone</b> des Pharaos?', a: 'dass er über Ober- und Unterägypten herrschte', x: ['dass er zwei Köpfe hatte', 'dass er zweimal gewählt wurde', 'dass er zwei Pyramiden besaß'], w: 'Die weiße Krone stand für Oberägypten, die rote für Unterägypten.' },
      { f: 'Welcher Pharao wurde durch sein fast unberührtes Grab mit der <b>goldenen Maske</b> berühmt?', a: 'Tutanchamun', x: ['Cheops', 'Alexander', 'Ötzi'], w: 'Howard Carter entdeckte sein Grab 1922 im Tal der Könige.' },
      { f: '<b>Hatschepsut</b> war etwas Besonderes, weil …', a: 'sie als Frau Pharao war.', x: ['sie die Pyramiden erfand.', 'sie die Hieroglyphen entzifferte.', 'sie aus Sparta kam.'], w: 'Nur wenige Frauen regierten als Pharao. Hatschepsut ließ einen berühmten Tempel bauen.' },
    ],
    T: [
      { f: 'Der König der Ägypter hieß ___.', a: 'Pharao', w: 'Er galt als Gott auf Erden.' },
      { f: 'Der höchste Beamte nach dem Pharao hieß ___.', a: 'Wesir', w: 'Er leitete die Verwaltung.' },
      { f: 'Die weiße Krone stand für Oberägypten, die rote für ___.', a: 'Unterägypten', w: 'Zusammen bilden sie die Doppelkrone.' },
    ],
    A: { w: ['Der Pharao galt als Gott.', 'Beamte zählten die Ernte.', 'Die Bauern gaben einen Teil ihrer Ernte ab.'], f: ['Die Ägypter wählten ihren Pharao alle vier Jahre.', 'Die Bauern zahlten mit Geldscheinen.', 'Ägypten hatte keine Beamten.'] },
  }, { frage: 50, tippen: 22, aussage: 18 });

  // ---------- Gesellschaftspyramide ----------
  const GP = ['Pharao', 'Wesir, Beamte, Priester', 'Schreiber', 'Handwerker, Händler', 'Bauern', 'Sklaven'];
  const GP_TIPP = 'Ganz oben der Pharao, dann Beamte und Priester, dann die Schreiber, dann Handwerker und Händler, dann die vielen Bauern. Ganz unten: Sklaven.';
  function gpHoeher() {
    let a, b; do { a = R(0, GP.length - 1); b = R(0, GP.length - 1); } while (a === b);
    const ch = [GP[a], GP[b]], ok = Math.min(a, b);
    return { prompt: 'Wer stand in der Gesellschaftspyramide <b>weiter oben</b>?', choices: ch, correct: ch.indexOf(GP[ok]), hint: GP_TIPP,
      solution: `<b>${GP[ok]}</b> stand weiter oben als ${GP[Math.max(a, b)]}.`,
      ex: { mode: 'pyramide', art: 'gpHoeher', stufen: GP, hell: [ok, Math.max(a, b)], merk: `<b>${GP[ok]}</b> steht weiter oben.` } };
  }
  function gpOrdnen() {
    const idx = shuffle([0, 1, 2, 3, 4, 5]).slice(0, 4).sort((a, b) => a - b), teile = idx.map((i) => GP[i]);
    return { prompt: 'Ordne die Gruppen wie in der Pyramide: <b>von oben nach unten</b>.', order: { words: mische(teile), answer: teile.join(' '), end: '' }, hint: GP_TIPP,
      solution: teile.map((x, k) => `${k + 1}. ${x}`).join('<br>'),
      ex: { mode: 'pyramide', art: 'gpOrdnen', stufen: GP, hell: idx, merk: `Von oben nach unten: <b>${teile.join(' → ')}</b>` } };
  }
  function gpWer() {
    const L = [[0, 'galt als Gott und hatte die höchste Macht'], [1, 'leitete die Verwaltung oder diente im Tempel'], [2, 'konnte lesen und schreiben und notierte die Ernte'], [3, 'stellte Schmuck, Töpfe oder Möbel her oder handelte damit'], [4, 'bestellte die Felder und gab einen Teil der Ernte ab'], [5, 'war unfrei und gehörte einem Herrn']];
    const [k, t] = pick(L), ch = shuffle([k, ...shuffle([0, 1, 2, 3, 4, 5].filter((x) => x !== k)).slice(0, 3)]);
    return { prompt: `Wer … <b>${t}</b>?`, choices: ch.map((i) => GP[i]), correct: ch.indexOf(k), hint: GP_TIPP, solution: `<b>${GP[k]}</b>: ${t}.`,
      ex: { mode: 'pyramide', art: 'gpWer', stufen: GP, hell: [k], merk: `<b>${GP[k]}</b> ${t}.` } };
  }
  const gesellschaft = baue('g5-gesellschaft', {
    h: GP_TIPP,
    F: [
      { f: 'Warum hat man die Gesellschaft Ägyptens als <b>Pyramide</b> gezeichnet?', a: 'Oben standen wenige Mächtige, unten sehr viele einfache Menschen.', x: ['Weil alle in Pyramiden wohnten.', 'Weil alle gleich viel zu sagen hatten.', 'Weil die Ägypter gern zeichneten.'], w: 'Die Breite einer Stufe zeigt: Wie viele Menschen gehörten dazu? Die Höhe zeigt: Wie viel Macht hatten sie?' },
      { f: 'Welche Gruppe war die <b>größte</b>?', a: 'die Bauern', x: ['die Pharaonen', 'die Priester', 'die Schreiber'], w: 'Die allermeisten Ägypter waren Bauern. Ihre Ernte ernährte alle anderen.' },
      { f: 'Warum hatten <b>Schreiber</b> ein gutes Leben?', a: 'Nur wenige konnten schreiben. Sie arbeiteten für den Staat und mussten keine schwere Arbeit tun.', x: ['Sie bekamen jeden Tag Gold.', 'Sie durften Pharao werden.', 'Sie mussten nie etwas tun.'], w: 'Schreiber war ein angesehener Beruf. Die Ausbildung dauerte viele Jahre.' },
      { f: 'Konnte ein Bauer in Ägypten leicht in eine höhere Gruppe aufsteigen?', a: 'Nein, fast immer blieb man in der Gruppe seiner Eltern.', x: ['Ja, jeder wurde einmal Pharao.', 'Ja, man wurde jedes Jahr neu eingeteilt.', 'Ja, durch ein Wettrennen.'], w: 'Nur selten gelang ein Aufstieg, etwa durch die Schreiberschule.' },
    ],
    extra: { gpHoeher, gpOrdnen, gpWer },
  }, { gpHoeher: 26, gpOrdnen: 22, gpWer: 30, frage: 22 });

  const schrift = baue('g5-schrift', {
    h: 'Die Schrift der Ägypter heißt Hieroglyphen. Sie entstand um 3000 v. Chr. Schreiber schrieben auf Papyrus. 1822 gelang es Champollion, sie zu entziffern.',
    F: [
      { f: 'Wie heißt die Schrift der alten Ägypter?', a: 'Hieroglyphen', x: ['Keilschrift', 'Runen', 'Druckbuchstaben'], w: 'Das Wort ist griechisch und bedeutet „heilige Zeichen“.' },
      { f: 'Woraus machten die Ägypter ihr „Papier“?', a: 'aus der Papyruspflanze', x: ['aus Baumrinde', 'aus Plastik', 'aus Tierhäuten von Mammuts'], w: 'Die Stängel wurden in Streifen geschnitten, kreuzweise gelegt und gepresst. Von „Papyrus“ kommt unser Wort „Papier“.', svg: 'papyrus' },
      { f: 'Wer konnte im alten Ägypten schreiben?', a: 'nur wenige, vor allem Schreiber und Priester', x: ['alle Kinder ab 6 Jahren', 'nur die Bauern', 'niemand'], w: 'Schreiben lernen dauerte viele Jahre. Wer es konnte, hatte einen angesehenen Beruf.' },
      { f: 'Was ist eine <b>Kartusche</b>?', a: 'ein Oval um den Namen eines Pharaos', x: ['ein Schreibstift', 'eine Krone', 'ein Grab'], w: 'Königsnamen wurden eingerahmt. Das half später beim Entziffern.' },
      { f: 'Wer hat die Hieroglyphen <b>entziffert</b>?', a: 'Jean-François Champollion', x: ['Howard Carter', 'Alexander der Große', 'Kleisthenes'], w: 'Der Franzose schaffte es 1822. Er fand heraus, dass viele Zeichen für Laute stehen.' },
      { f: 'Was half Champollion beim Entziffern?', a: 'der Stein von Rosette mit demselben Text in drei Schriften', x: ['ein Wörterbuch aus Ägypten', 'ein Brief des Pharaos an ihn', 'ein Film über Ägypten'], w: 'Auf dem Stein steht derselbe Text in Hieroglyphen, in Demotisch und in Griechisch. Griechisch konnte man lesen.' },
      { f: 'Wann wurde der <b>Stein von Rosette</b> gefunden?', a: '1799', x: ['1922', '1991', '776 v. Chr.'], w: 'Französische Soldaten fanden ihn im Nildelta. Heute steht er im Britischen Museum in London.' },
      { f: 'Stehen Hieroglyphen nur für ganze Wörter?', a: 'Nein, viele Zeichen stehen für Laute, andere für ganze Wörter.', x: ['Ja, jedes Zeichen ist ein ganzes Wort.', 'Ja, und es gibt genau 26 Zeichen.', 'Nein, sie sind nur Bilder ohne Bedeutung.'], w: 'Diese Mischung war lange das große Rätsel.' },
      { f: 'In welche Richtung liest man Hieroglyphen?', a: 'Dorthin, woher die Gesichter der Menschen und Tiere schauen: zum Zeilenanfang.', x: ['immer von links nach rechts', 'immer von unten nach oben', 'kreuz und quer'], w: 'Man konnte von rechts, von links oder von oben nach unten schreiben. Die Figuren zeigen den Anfang.' },
      { f: 'Ungefähr wann entstand die Schrift in Ägypten?', a: 'um 3000 v. Chr.', x: ['um 300 n. Chr.', 'um 30.000 v. Chr.', 'um 1822'], w: 'Ungefähr zur gleichen Zeit, als Ägypten ein Reich wurde.' },
      { f: 'Warum brauchte der Staat <b>Schrift</b>?', a: 'um Ernten, Abgaben und Vorräte aufzuschreiben', x: ['um Romane zu verkaufen', 'um im Internet zu schreiben', 'weil die Bauern Briefe schreiben wollten'], w: 'Beamte mussten sich viel merken. Mit Schrift ging nichts verloren.' },
    ],
    T: [
      { f: 'Die Schrift der Ägypter heißt ___.', a: ['Hieroglyphen', 'Hieroglyphe'], w: '„Heilige Zeichen“.' },
      { f: 'Geschrieben wurde auf ___ aus einer Pflanze vom Nil.', a: 'Papyrus', w: 'Daher kommt unser Wort „Papier“.', svg: 'papyrus' },
      { f: 'Wer im Auftrag des Staates schrieb, war ein ___.', a: 'Schreiber', w: 'Ein angesehener Beruf.' },
      { f: 'Die Hieroglyphen wurden im Jahr ___ entziffert.', a: '1822', w: 'Von Jean-François Champollion.' },
    ],
    A: { w: ['Hieroglyphen bedeutet „heilige Zeichen“.', 'Der Stein von Rosette hat drei Schriften.', 'Nur wenige Ägypter konnten schreiben.'], f: ['Alle Ägypter konnten lesen und schreiben.', 'Hieroglyphen haben genau 26 Zeichen.', 'Den Stein von Rosette fand man 1991.'] },
  }, { frage: 46, tippen: 22, aussage: 16 });

  const GOETTER_AG = [
    ['Re', 'Sonnengott', 'mit Falkenkopf und Sonnenscheibe'], ['Osiris', 'Herrscher im Totenreich', 'als Mumie mit Krone'], ['Isis', 'Göttin der Mütter und der Zauberkraft, Frau des Osiris', 'mit einem Thron auf dem Kopf'],
    ['Horus', 'Himmelsgott, Beschützer des Pharaos', 'mit Falkenkopf'], ['Anubis', 'Gott der Mumien und Gräber', 'mit dem Kopf eines Schakals'], ['Thot', 'Gott der Schrift und der Weisheit', 'mit dem Kopf eines Ibis (eines Vogels)'],
    ['Bastet', 'Göttin des Hauses und der Freude', 'als Katze'], ['Sobek', 'Gott des Wassers', 'mit dem Kopf eines Krokodils'], ['Hathor', 'Göttin der Liebe, der Musik und des Tanzes', 'mit Kuhhörnern'],
  ];
  function agGott() {
    const g = pick(GOETTER_AG), fragGott = Math.random() < 0.5, andere = shuffle(GOETTER_AG.filter((x) => x !== g)).slice(0, 3), ch = shuffle([g, ...andere]);
    if (fragGott) return { prompt: `Welcher Gott oder welche Göttin ist das? <b>${g[1]}</b>, dargestellt ${g[2]}.`, choices: ch.map((x) => x[0]), correct: ch.indexOf(g), hint: 'Viele Götter hatten einen Tierkopf. Das Tier verrät viel.', solution: `<b>${g[0]}</b>: ${g[1]}, ${g[2]}.`,
      ex: { mode: 'karte', art: 'agGott', q: `${g[1]}, ${g[2]}`, opts: ch.map((x) => x[0]), ok: ch.indexOf(g), svg: '', merk: `<b>${g[0]}</b>: ${g[1]}.` } };
    return { prompt: `Wofür war <b>${g[0]}</b> zuständig?`, choices: ch.map((x) => x[1]), correct: ch.indexOf(g), hint: 'Denk an das Tier, mit dem der Gott dargestellt wurde.', solution: `<b>${g[0]}</b> (${g[2]}): ${g[1]}.`,
      ex: { mode: 'karte', art: 'agGott', q: `Wofür war ${g[0]} zuständig?`, opts: ch.map((x) => x[1]), ok: ch.indexOf(g), svg: '', merk: `<b>${g[0]}</b>: ${g[1]}, ${g[2]}.` } };
  }
  const religionAg = baue('g5-religion-ag', {
    h: 'Die Ägypter glaubten an viele Götter. Viele hatten einen Tierkopf: Anubis den Schakal, Horus den Falken, Thot den Ibis. Re war der Sonnengott, Osiris herrschte im Totenreich.',
    F: [
      { f: 'Wie nennt man den Glauben an <b>viele</b> Götter?', a: 'Vielgötterglaube', x: ['Eingottglaube', 'Aberglaube', 'Ahnenkult'], w: 'Die Ägypter verehrten sehr viele Götter. Fremdwort: Polytheismus.' },
      { f: 'Wer durfte in das <b>Innerste</b> eines Tempels?', a: 'nur Priester und der Pharao', x: ['alle Ägypter', 'nur Kinder', 'nur Händler'], w: 'Der Tempel galt als Haus des Gottes. Das einfache Volk blieb draußen.' },
      { f: 'Welches Tier war der Göttin <b>Bastet</b> heilig?', a: 'die Katze', x: ['das Krokodil', 'der Schakal', 'der Falke'], w: 'Katzen wurden verehrt und manchmal sogar mumifiziert.' },
      { f: 'Welcher Gott wurde mit einem <b>Schakalkopf</b> dargestellt?', a: 'Anubis', x: ['Re', 'Horus', 'Osiris'], w: 'Anubis wachte über die Gräber und half bei der Mumifizierung.' },
      { f: 'Wer war der <b>Sonnengott</b>?', a: 'Re', x: ['Anubis', 'Sobek', 'Thot'], w: 'Man glaubte: Re fährt jeden Tag mit seinem Boot über den Himmel.' },
    ],
    extra: { agGott },
  }, { agGott: 60, frage: 40 });

  const jenseits = baue('g5-jenseits', {
    h: 'Die Ägypter glaubten an ein Leben nach dem Tod. Dafür musste der Körper erhalten bleiben: Er wurde zur Mumie. Im Totengericht wurde das Herz gewogen.',
    O: [{ t: 'Wie wurde eine Mumie gemacht? Bringe die Schritte in die richtige Reihenfolge.', items: ['Körper waschen', 'Gehirn und Organe entnehmen, das Herz bleibt', 'Körper etwa 40 Tage in Natronsalz trocknen', 'mit Leinen füllen und mit Ölen einreiben', 'in Leinenbinden wickeln, Maske aufsetzen'], n: 4, s1: 'Etwa 70 Tage dauerte es, bis eine Mumie fertig war:', w: 'waschen → Organe entnehmen → trocknen → füllen und einölen → einwickeln.' }],
    F: [
      { f: 'Warum machten die Ägypter aus Toten <b>Mumien</b>?', a: 'Sie glaubten, der Körper wird im Jenseits wieder gebraucht.', x: ['Damit man sie im Museum zeigen kann.', 'Weil es so vorgeschrieben war, um Platz zu sparen.', 'Damit die Toten nicht riechen.'], w: 'Der Körper sollte für das ewige Leben erhalten bleiben.' },
      { f: 'Welches Organ blieb im Körper?', a: 'das Herz', x: ['das Gehirn', 'der Magen', 'die Lunge'], w: 'Das Herz galt als Sitz des Verstandes. Es wurde im Totengericht gebraucht.' },
      { f: 'Womit wurde der Körper <b>getrocknet</b>?', a: 'mit Natronsalz', x: ['mit einem Föhn', 'mit Zucker', 'mit Sand aus dem Meer'], w: 'Das Salz entzog dem Körper das Wasser, etwa 40 Tage lang.' },
      { f: 'Wohin kamen die entnommenen Organe?', a: 'in Krüge, die man Kanopen nennt', x: ['in den Nil', 'in die Pyramidenspitze', 'zu den Tempelkatzen'], w: 'Die Kanopen wurden mit ins Grab gestellt.' },
      { f: 'Was geschah im <b>Totengericht</b>?', a: 'Das Herz wurde gegen eine Feder gewogen.', x: ['Der Tote musste eine Prüfung schreiben.', 'Der Pharao entschied über jeden Toten.', 'Die Familie stimmte ab.'], w: 'War das Herz leicht wie die Feder der Wahrheit, durfte der Tote ins Jenseits.' },
      { f: 'Wer führte im Totengericht die <b>Waage</b>?', a: 'Anubis', x: ['Bastet', 'Sobek', 'Hatschepsut'], w: 'Thot schrieb das Ergebnis auf, Osiris war der Richter.' },
      { f: 'Was gab man den Toten mit ins Grab?', a: 'Essen, Schmuck, Möbel und kleine Dienerfiguren', x: ['nichts', 'nur Geldscheine', 'ein Handy'], w: 'Alles, was man im Jenseits brauchen könnte. Die kleinen Figuren sollten dort für den Toten arbeiten.' },
      { f: 'Was ist das „<b>Totenbuch</b>“?', a: 'Sprüche auf Papyrus, die dem Toten den Weg ins Jenseits zeigen sollten', x: ['ein Buch mit allen Namen der Toten', 'ein Kochbuch für Mumien', 'ein Tagebuch des Pharaos'], w: 'Die Schriftrolle wurde mit ins Grab gelegt.' },
      { f: 'Wer entdeckte 1922 das Grab des Tutanchamun?', a: 'Howard Carter', x: ['Champollion', 'Ötzi', 'Herodot'], w: 'Das Grab im Tal der Könige war fast unberührt: voller Schätze und mit der berühmten Goldmaske.' },
    ],
    T: [
      { f: 'Ein einbalsamierter, getrockneter Körper heißt ___.', a: 'Mumie', w: 'Mumien halten Tausende Jahre.' },
      { f: 'Die Krüge für die Organe heißen ___.', a: ['Kanopen', 'Kanope'], w: 'Vier Krüge, oft mit Deckeln in Tierform.' },
      { f: 'Im Totengericht wurde das ___ gewogen.', a: 'Herz', w: 'Gegen die Feder der Wahrheit.' },
    ],
    A: { w: ['Das Herz blieb im Körper der Mumie.', 'Eine Mumie zu machen dauerte etwa 70 Tage.', 'Anubis war der Gott der Mumien.'], f: ['Das Gehirn wurde sorgfältig aufbewahrt.', 'Nur Katzen wurden mumifiziert, keine Menschen.', 'Die Ägypter glaubten, mit dem Tod sei alles vorbei.'] },
  }, { frage: 42, tippen: 18, ordnen: 22, aussage: 18 });

  const pyramiden = baue('g5-pyramiden', {
    h: 'Pyramiden waren Gräber der Pharaonen. Die größte ist die Cheops-Pyramide bei Gizeh (um 2580 v. Chr., ursprünglich etwa 146 Meter hoch, rund 2,3 Millionen Steinblöcke).',
    O: [{ t: 'Ordne nach der Zeit: <b>das Älteste zuerst</b>.', items: ['Stufenpyramide des Djoser', 'Cheops-Pyramide', 'erste Olympische Spiele', 'Grab des Tutanchamun entdeckt'], j: [-2650, -2580, -776, 1922], um: [1, 1, 0, 0], kurz: ['Stufenpyramide', 'Cheops-Pyramide', 'Olympische Spiele', 'Tutanchamun entdeckt'], n: 4, w: 'Die Pyramiden waren schon uralt, als in Griechenland die Olympischen Spiele begannen.' }],
    F: [
      { f: 'Wozu dienten die Pyramiden?', a: 'als Gräber für die Pharaonen', x: ['als Wohnhäuser', 'als Kornspeicher', 'als Sternwarten für Kinder'], w: 'Der Pharao sollte sicher ins Jenseits gelangen.' },
      { f: 'Wie hoch war die Cheops-Pyramide ursprünglich?', a: 'etwa 146 Meter', x: ['etwa 14 Meter', 'etwa 1460 Meter', 'etwa 46 Meter'], w: 'Heute ist sie etwa 139 Meter hoch, weil die Spitze und die glatte Verkleidung fehlen.' },
      { f: 'Wo stehen die drei großen Pyramiden?', a: 'bei Gizeh, nahe Kairo', x: ['in Athen', 'in Sparta', 'in Bozen'], w: 'Die Pyramiden von Cheops, Chephren und Mykerinos. Davor liegt die große Sphinx.' },
      { f: 'Wie viele Steinblöcke stecken ungefähr in der Cheops-Pyramide?', a: 'etwa 2,3 Millionen', x: ['etwa 2300', 'etwa 230', 'etwa 23 Milliarden'], w: 'Jeder Block wog meist um die 2,5 Tonnen, so viel wie zwei Autos.' },
      { f: 'Wie lange dauerte der Bau der Cheops-Pyramide ungefähr?', a: 'etwa 20 Jahre', x: ['etwa 2 Wochen', 'etwa 200 Jahre', 'etwa 2 Jahre'], w: 'Tausende Menschen arbeiteten gleichzeitig.' },
      { f: 'Wer baute die Pyramiden?', a: 'viele Arbeiter und Bauern, die versorgt und bezahlt wurden', x: ['Außerirdische', 'nur der Pharao selbst', 'Riesen'], w: 'Forscher fanden die Dörfer der Arbeiter. Viele Bauern halfen wohl während der Überschwemmung, wenn auf den Feldern nichts zu tun war.' },
      { f: 'Wie heißt die <b>älteste</b> große Pyramide?', a: 'die Stufenpyramide des Djoser', x: ['die Cheops-Pyramide', 'die Pyramide von Sparta', 'die Glaspyramide in Paris'], w: 'Sie wurde um 2650 v. Chr. in Sakkara gebaut, als Treppe zum Himmel.' },
      { f: 'Warum bauten spätere Pharaonen ihre Gräber versteckt im <b>Tal der Könige</b>?', a: 'Grabräuber hatten die Pyramiden ausgeraubt.', x: ['Weil die Steine ausgegangen waren.', 'Weil Pyramiden verboten wurden.', 'Weil das Tal näher am Meer lag.'], w: 'In Felsgräbern hoffte man, sicherer zu sein. Fast alle wurden trotzdem beraubt, außer dem Grab des Tutanchamun.' },
      { f: 'Wie lange war die Cheops-Pyramide das <b>höchste Bauwerk</b> der Welt?', a: 'fast 4000 Jahre lang', x: ['40 Jahre lang', '400 Jahre lang', 'nie'], w: 'Erst im Mittelalter wurde eine Kathedrale in England höher.' },
      { f: 'Wie transportierte man die schweren Steine vermutlich?', a: 'auf Holzschlitten, über Rampen und auf Booten über den Nil', x: ['mit Lastwagen', 'mit Kränen aus Stahl', 'mit der Eisenbahn'], w: 'Ganz genau weiß man es nicht. Über die Bauweise streiten Forscher bis heute.' },
    ],
    T: [
      { f: 'Die größte Pyramide ist die ___-Pyramide.', a: 'Cheops', w: 'Bei Gizeh, um 2580 v. Chr.' },
      { f: 'Die Pyramiden waren ___ für die Pharaonen.', a: ['Gräber', 'Grabmäler', 'Grabstätten'], w: 'Grabstätten für das Leben im Jenseits.' },
    ],
    A: { w: ['Die Pyramiden waren Gräber.', 'Die Cheops-Pyramide war ursprünglich etwa 146 Meter hoch.', 'Die Pyramiden von Gizeh sind über 4500 Jahre alt.'], f: ['Die Pyramiden wurden im Mittelalter gebaut.', 'In den Pyramiden wohnten Bauern.', 'Die Cheops-Pyramide wurde in zwei Wochen gebaut.'] },
  }, { frage: 46, tippen: 14, ordnen: 20, aussage: 20 });

  const hochkultur = baue('g5-hochkultur', {
    h: 'Merkmale einer Hochkultur: ein Staat mit Herrscher und Beamten, Schrift, große Bauwerke, Kalender, viele verschiedene Berufe, eine gemeinsame Religion.',
    S: { kats: ['Sachquelle', 'Bildquelle', 'Textquelle'], f: (x) => `Was für eine Quelle über Ägypten ist <b>${x}</b>?`, h: 'Gegenstand, Bild oder Text?',
      items: [['eine Mumie', 0], ['die Goldmaske des Tutanchamun', 0], ['eine Pyramide', 0, 'auch Bauwerke sind Sachquellen'], ['ein Krug aus einem Grab', 0], ['eine Wandmalerei in einem Grab', 1], ['ein gemaltes Bild auf einem Sarg', 1], ['ein Papyrus mit dem Totenbuch', 2], ['eine Inschrift in Hieroglyphen', 2], ['der Stein von Rosette', 2, 'darauf steht ein Text'], ['der Bericht des Griechen Herodot', 2, 'Herodot besuchte Ägypten um 450 v. Chr.']] },
    F: [
      { f: 'Was gehört <b>nicht</b> zu den Merkmalen einer Hochkultur?', a: 'Alle leben als Jäger und Sammler.', x: ['Es gibt eine Schrift.', 'Es gibt einen Staat mit Beamten.', 'Es gibt große Bauwerke.'], w: 'Hochkulturen haben Städte, Staat, Schrift und viele Berufe. Jäger und Sammler gab es in der Altsteinzeit.' },
      { f: 'Warum sind in Ägypten so viele Dinge <b>erhalten</b> geblieben?', a: 'In der trockenen Wüste verrottet wenig.', x: ['Weil es dort ständig regnet.', 'Weil die Ägypter alles in Plastik wickelten.', 'Weil dort nie jemand etwas ausgegraben hat.'], w: 'Selbst Holz, Stoff und Papyrus blieben Tausende Jahre erhalten.' },
      { f: 'Welche Quelle verrät am meisten über den <b>Alltag</b> der Ägypter?', a: 'bunte Wandmalereien in Gräbern', x: ['die Spitze einer Pyramide', 'ein Schulbuch von heute', 'ein Kinofilm'], w: 'Auf ihnen sieht man Bauern, Handwerker, Feste und Speisen.' },
      { f: 'Was bedeutet „<b>Arbeitsteilung</b>“?', a: 'Jeder hat seinen Beruf, und man tauscht, was man herstellt.', x: ['Alle machen alles selbst.', 'Niemand arbeitet.', 'Nur der Pharao arbeitet.'], w: 'Weil die Bauern genug ernteten, konnten andere Handwerker, Schreiber oder Priester sein.' },
      { f: 'Warum zogen viele Menschen in der Frühzeit an den Nil?', a: 'Das Land um sie herum wurde immer trockener.', x: ['Weil es am Nil Schnee gab.', 'Weil der Pharao sie einlud.', 'Weil dort schon Pyramiden standen.'], w: 'Die Sahara war vor Tausenden Jahren grüner. Als sie austrocknete, bot nur noch der Nil genug Wasser.' },
    ],
    A: { w: ['Ägypten hatte eine Schrift.', 'In Ägypten gab es Beamte.', 'Grabmalereien sind Bildquellen.'], f: ['In Ägypten gab es keinen Staat.', 'Eine Mumie ist eine Textquelle.', 'Alles über Ägypten wissen wir aus Kinofilmen.'] },
  }, { sortieren: 34, passtNicht: 12, frage: 38, aussage: 16 });

  // =====================================================
  // Bereich 03: Lebenswelt griechische Polis (ANNO 1, S. 84–131; Lehrplan LB 3)
  // =====================================================
  const land = baue('g5-land', {
    h: 'Griechenland hat viele Gebirge, wenig fruchtbares Land und überall Meer. Darum gab es viele kleine Stadtstaaten (Poleis). Ab etwa 750 v. Chr. gründeten Griechen Tochterstädte rund ums Mittelmeer.',
    F: [
      { f: 'Wie sieht die Landschaft Griechenlands aus?', a: 'viele Berge, wenig fruchtbares Land, überall Meer und Inseln', x: ['flach wie ein Tisch, mit riesigen Feldern', 'dichter Urwald', 'Wüste wie in Ägypten'], w: 'Darum lebten die Griechen eng mit dem Meer: als Fischer, Seefahrer und Händler.' },
      { f: 'Was ist eine <b>Polis</b>?', a: 'ein griechischer Stadtstaat', x: ['ein griechischer Gott', 'ein Tempel', 'ein Schiff'], w: 'Eine Stadt mit dem Land drumherum, mit eigenen Gesetzen. Mehrzahl: Poleis.' },
      { f: 'Warum gab es in Griechenland <b>viele kleine Staaten</b> statt eines großen Reichs?', a: 'Gebirge trennten die Täler und Inseln voneinander.', x: ['Weil die Griechen keine Könige mochten.', 'Weil der Nil das Land teilte.', 'Weil jede Familie ein Land wollte.'], w: 'Jede Polis regierte sich selbst, zum Beispiel Athen, Sparta oder Korinth.' },
      { f: 'Warum gründeten viele Griechen ab etwa 750 v. Chr. <b>Tochterstädte</b> (Kolonien)?', a: 'Es gab zu wenig Land und Nahrung für alle.', x: ['Weil sie Ägypten erobern wollten.', 'Weil sie vor den Römern flohen.', 'Weil ihre Städte überschwemmt wurden.'], w: 'Auch Handel und Streit waren Gründe. Die neuen Städte blieben mit der Heimat verbunden.' },
      { f: 'Welche heutige Stadt war früher die griechische Kolonie <b>Massalia</b>?', a: 'Marseille in Frankreich', x: ['Moskau', 'München', 'Madrid'], w: 'Griechen gründeten Städte von Spanien bis zum Schwarzen Meer.' },
      { f: 'Welche heutige Stadt hieß bei den Griechen <b>Neapolis</b> („neue Stadt“)?', a: 'Neapel in Italien', x: ['Nürnberg', 'New York', 'Nizza'], w: 'Auch in Süditalien und auf Sizilien gab es viele griechische Städte.' },
      { f: 'Wie hieß das heutige <b>Istanbul</b> bei den Griechen?', a: 'Byzantion', x: ['Sparta', 'Olympia', 'Alexandria'], w: 'Byzantion lag am Eingang zum Schwarzen Meer.' },
      { f: 'Was <b>verband</b> die Griechen, obwohl sie in vielen Staaten lebten?', a: 'Sprache, Götter und die Olympischen Spiele', x: ['ein gemeinsamer König', 'eine gemeinsame Armee', 'eine gemeinsame Hauptstadt'], w: 'Sie nannten sich alle „Hellenen“, auch in den fernen Kolonien.' },
      { f: 'Was bauten die Griechen vor allem an?', a: 'Oliven, Wein und etwas Getreide', x: ['Reis und Tee', 'Kartoffeln und Mais', 'Bananen und Kakao'], w: 'Ölbäume und Weinstöcke wachsen auch an trockenen Hängen. Getreide musste man oft dazukaufen.' },
      { f: 'Wie nannten die Griechen Menschen, die <b>kein Griechisch</b> sprachen?', a: 'Barbaren', x: ['Hellenen', 'Spartiaten', 'Pharaonen'], w: 'Ihre Sprache klang für Griechen wie „bar-bar“.' },
    ],
    T: [
      { f: 'Ein griechischer Stadtstaat heißt ___.', a: 'Polis', w: 'Mehrzahl: Poleis.' },
      { f: 'Die Griechen nannten sich selbst ___.', a: ['Hellenen', 'Hellene'], w: 'Griechenland heißt auf Griechisch bis heute „Hellas“.' },
      { f: 'Die Stadt Marseille hieß bei den Griechen ___.', a: 'Massalia', w: 'Eine der vielen Tochterstädte.' },
    ],
    A: { w: ['In Griechenland gab es viele Stadtstaaten.', 'Griechen gründeten Kolonien am Mittelmeer.', 'Die Griechen sprachen eine gemeinsame Sprache.'], f: ['Griechenland hatte nur einen einzigen großen König.', 'Griechenland ist ganz flach und fruchtbar.', 'Die Griechen bauten vor allem Reis an.'] },
  }, { frage: 50, tippen: 22, aussage: 18 });

  const olympia = baue('g5-olympia', {
    h: 'Die Olympischen Spiele fanden ab 776 v. Chr. alle vier Jahre in Olympia statt, zu Ehren des Zeus. Mitmachen durften nur freie griechische Männer. Der Sieger bekam einen Kranz aus Olivenzweigen.',
    S: { kats: ['nur damals', 'nur heute', 'damals und heute'], f: (x) => `Olympische Spiele: <b>${x}</b>. Gilt das damals, heute oder in beiden Zeiten?`, h: 'Damals: Fest für Zeus, nur griechische Männer, Kranz als Preis. Heute: Sportler aus aller Welt, Frauen und Männer, Medaillen.',
      items: [['Der Sieger bekommt einen Kranz aus Olivenzweigen.', 0], ['Die Spiele sind ein Fest für Zeus.', 0], ['Nur freie Männer aus Griechenland dürfen mitmachen.', 0], ['Wagenrennen mit vier Pferden', 0],
        ['Der Sieger bekommt eine Goldmedaille.', 1], ['Sportlerinnen und Sportler aus aller Welt treten an.', 1], ['Frauen dürfen mitmachen.', 1],
        ['Die Spiele finden alle vier Jahre statt.', 2], ['Es gibt einen Wettlauf.', 2], ['Es gibt Ringkämpfe.', 2]] },
    F: [
      { f: 'Wann fanden die ersten Olympischen Spiele statt?', a: '776 v. Chr.', x: ['1896 n. Chr.', '393 n. Chr.', '3000 v. Chr.'], w: 'Zuerst gab es nur einen einzigen Wettlauf über eine Stadionlänge (etwa 192 Meter).' },
      { f: 'Zu Ehren welches Gottes fanden die Spiele statt?', a: 'Zeus', x: ['Poseidon', 'Re', 'Anubis'], w: 'Im heiligen Bezirk von Olympia stand ein großer Tempel des Zeus.' },
      { f: 'Wie oft fanden die Spiele statt?', a: 'alle vier Jahre', x: ['jedes Jahr', 'alle zehn Jahre', 'nur einmal'], w: 'Die vier Jahre dazwischen nannte man eine „Olympiade“.' },
      { f: 'Was bekam ein Olympiasieger in Olympia?', a: 'einen Kranz aus Olivenzweigen', x: ['eine Goldmedaille', 'einen Pokal aus Silber', 'ein Pferd'], w: 'In seiner Heimatstadt wurde er danach oft reich beschenkt und geehrt.' },
      { f: 'Wer durfte an den Spielen <b>teilnehmen</b>?', a: 'nur freie griechische Männer', x: ['alle Menschen aus aller Welt', 'nur Frauen', 'nur Sklaven'], w: 'Frauen, Sklaven und Nicht-Griechen waren ausgeschlossen.' },
      { f: 'Was war der „<b>Olympische Friede</b>“?', a: 'Eine Waffenruhe, damit alle sicher nach Olympia reisen konnten', x: ['ein Vertrag mit Ägypten', 'der Name des Siegerkranzes', 'ein Tempel in Athen'], w: 'Während der Spiele sollten die Griechen nicht gegeneinander kämpfen.' },
      { f: 'Welcher Wettkampf war der <b>erste</b> der Olympischen Spiele?', a: 'der Stadionlauf', x: ['das Wagenrennen', 'der Marathon', 'Fußball'], w: 'Ein Sprint über eine Bahnlänge. Später kamen Ringen, Faustkampf, Fünfkampf und Wagenrennen dazu.' },
      { f: 'Wann <b>endeten</b> die antiken Olympischen Spiele?', a: '393 n. Chr.', x: ['776 v. Chr.', '1896 n. Chr.', '2026'], w: 'Der christliche Kaiser Theodosius verbot die alten Götterfeste.' },
      { f: 'Wann und wo fanden die ersten Olympischen Spiele der <b>Neuzeit</b> statt?', a: '1896 in Athen', x: ['776 v. Chr. in Olympia', '1972 in München', '393 in Rom'], w: 'Über 1500 Jahre nach dem Ende der antiken Spiele.' },
    ],
    T: [
      { f: 'Die Olympischen Spiele fanden zu Ehren des Gottes ___ statt.', a: 'Zeus', w: 'Zeus war der oberste Gott.' },
      { f: 'Die ersten Olympischen Spiele fanden ___ v. Chr. statt.', a: '776', w: 'Mit diesem Jahr begann auch eine griechische Zeitrechnung.' },
      { f: 'Die Spiele fanden alle ___ Jahre statt.', a: ['vier', '4'], w: 'Wie heute.' },
    ],
    A: { w: ['Die ersten Olympischen Spiele fanden 776 v. Chr. statt.', 'In Olympia durften keine Frauen mitkämpfen.', 'Die Spiele waren ein religiöses Fest.'], f: ['In Olympia gab es Goldmedaillen.', 'Schon damals kamen Sportler aus Amerika.', 'Die Spiele fanden jedes Jahr statt.'] },
  }, { frage: 42, tippen: 16, sortieren: 28, passtNicht: 0, aussage: 14 });

  const GOETTER_GR = [['Zeus', 'Göttervater, Herr über Himmel und Blitz'], ['Hera', 'Göttin der Ehe, Frau des Zeus'], ['Poseidon', 'Gott des Meeres, mit Dreizack'], ['Athene', 'Göttin der Weisheit, Schutzgöttin Athens'],
    ['Apollon', 'Gott des Lichts, der Musik und der Weissagung'], ['Artemis', 'Göttin der Jagd'], ['Aphrodite', 'Göttin der Liebe und Schönheit'], ['Ares', 'Gott des Krieges'], ['Hermes', 'Götterbote, Gott der Händler und Reisenden'],
    ['Hephaistos', 'Gott des Feuers und der Schmiede'], ['Demeter', 'Göttin der Felder und des Getreides'], ['Dionysos', 'Gott des Weins und des Theaters'], ['Hades', 'Herrscher der Unterwelt']];
  function grGott() {
    const g = pick(GOETTER_GR), andere = shuffle(GOETTER_GR.filter((x) => x !== g)).slice(0, 3), ch = shuffle([g, ...andere]), frag = Math.random() < 0.5;
    return frag
      ? { prompt: `Wer ist das: <b>${g[1]}</b>?`, choices: ch.map((x) => x[0]), correct: ch.indexOf(g), hint: 'Zeus: Blitz. Poseidon: Meer. Athene: Weisheit. Hermes: Bote.', solution: `<b>${g[0]}</b>: ${g[1]}.`,
        ex: { mode: 'karte', art: 'grGott', q: g[1], opts: ch.map((x) => x[0]), ok: ch.indexOf(g), svg: '', merk: `<b>${g[0]}</b>: ${g[1]}.` } }
      : { prompt: `Wofür war <b>${g[0]}</b> zuständig?`, choices: ch.map((x) => x[1]), correct: ch.indexOf(g), hint: 'Zeus: Blitz. Poseidon: Meer. Athene: Weisheit. Hermes: Bote.', solution: `<b>${g[0]}</b>: ${g[1]}.`,
        ex: { mode: 'karte', art: 'grGott', q: `Wofür war ${g[0]} zuständig?`, opts: ch.map((x) => x[1]), ok: ch.indexOf(g), svg: '', merk: `<b>${g[0]}</b>: ${g[1]}.` } };
  }
  const religionGr = baue('g5-religion-gr', {
    h: 'Die Griechen glaubten an viele Götter, die wie Menschen aussahen und fühlten. Die wichtigsten wohnten auf dem Berg Olymp. Zeus war der Göttervater.',
    F: [
      { f: 'Wo wohnten die wichtigsten griechischen Götter nach dem Glauben der Griechen?', a: 'auf dem Berg Olymp', x: ['am Nil', 'in Olympia im Stadion', 'unter dem Meer'], w: 'Der Olymp ist der höchste Berg Griechenlands. Nicht verwechseln mit Olympia, dem Ort der Spiele!' },
      { f: 'Wie stellten sich die Griechen ihre Götter vor?', a: 'wie Menschen, mit Gefühlen und Streit, aber unsterblich und mächtig', x: ['mit Tierköpfen wie in Ägypten', 'als unsichtbares Licht ohne Gestalt', 'als Steine'], w: 'Die Götter liebten, stritten und waren eifersüchtig, wie in vielen Sagen erzählt wird.' },
      { f: 'Welcher Göttin war der <b>Parthenon</b> auf der Akropolis in Athen geweiht?', a: 'Athene', x: ['Aphrodite', 'Hera', 'Artemis'], w: 'Athene war die Schutzgöttin Athens. Die Stadt trägt ihren Namen.' },
      { f: 'Was war das <b>Orakel von Delphi</b>?', a: 'ein Ort, an dem eine Priesterin im Namen Apollons Fragen beantwortete', x: ['ein großes Sportfest', 'ein Gericht in Sparta', 'eine Schule für Schreiber'], w: 'Selbst Stadtstaaten fragten dort um Rat, etwa bevor sie Kolonien gründeten.' },
      { f: 'Wie ehrten die Griechen ihre Götter?', a: 'mit Gebeten, Opfern, Festen und Tempeln', x: ['nur mit Pyramiden', 'gar nicht', 'mit Mumien'], w: 'Man brachte Tiere, Früchte oder Wein als Opfer, um die Götter freundlich zu stimmen.' },
      { f: 'Wie nennt man die alten Erzählungen über Götter und Helden?', a: 'Sagen oder Mythen', x: ['Märchen aus Ägypten', 'Gesetze', 'Zeitungsberichte'], w: 'Berühmt sind die Sagen von Herakles oder Odysseus.' },
    ],
    T: [
      { f: 'Die Götter wohnten auf dem Berg ___.', a: 'Olymp', w: 'Der höchste Berg Griechenlands.' },
      { f: 'Der Göttervater der Griechen hieß ___.', a: 'Zeus', w: 'Sein Zeichen war der Blitz.' },
      { f: 'Der Gott des Meeres hieß ___.', a: 'Poseidon', w: 'Mit seinem Dreizack.' },
    ],
    extra: { grGott },
  }, { grGott: 52, frage: 30, tippen: 18 });

  const quellenGr = baue('g5-quellen-gr', {
    h: 'Über die Griechen wissen wir viel aus Vasenbildern, Tempelruinen, Münzen, Inschriften, Scherben und Büchern griechischer Geschichtsschreiber wie Herodot.',
    S: { kats: ['Sachquelle', 'Bildquelle', 'Textquelle'], f: (x) => `Was für eine Quelle ist <b>${x}</b>?`, h: 'Gegenstand, Bild oder Text?',
      items: [['eine Silbermünze aus Athen', 0], ['die Ruine eines Tempels', 0], ['ein Helm aus Bronze', 0], ['ein Bild auf einer Vase', 1], ['ein Wandbild in einem Haus', 1], ['eine Inschrift mit einem Gesetz', 2], ['das Geschichtsbuch des Herodot', 2], ['ein Gedicht von Homer', 2]] },
    F: [
      { f: 'Was zeigt das Bild auf dieser Vase?', a: 'zwei Läufer bei einem Wettlauf', x: ['eine Mumie', 'eine Pyramide', 'ein Mammut'], w: 'Vasenbilder zeigen Alltag, Sport, Götter und Sagen. Sie sind wichtige Bildquellen.', svg: 'vase' },
      { f: 'Diese Scherbe trägt einen eingeritzten Namen. Wofür wurde sie benutzt?', a: 'für das Scherbengericht in Athen', x: ['als Teller beim Essen', 'als Geld', 'als Grabstein'], w: 'Auf solche Scherben schrieben Bürger den Namen eines Politikers, der verbannt werden sollte. Hier: Themistokles.', svg: 'ostrakon' },
      { f: 'Welche Stadt prägte diese Münze mit der <b>Eule</b>?', a: 'Athen', x: ['Sparta', 'Rom', 'Theben in Ägypten'], w: 'Die Eule war das Tier der Göttin Athene. Die Münzen waren aus Silber.', svg: 'muenze' },
      { f: 'Wer gilt als „<b>Vater der Geschichtsschreibung</b>“?', a: 'Herodot', x: ['Homer', 'Zeus', 'Champollion'], w: 'Herodot reiste um 450 v. Chr. weit herum, auch nach Ägypten, und schrieb auf, was er erfuhr.' },
      { f: 'Warum muss man mit den Geschichten von <b>Homer</b> vorsichtig sein?', a: 'Es sind Dichtungen: Wahres und Erfundenes sind vermischt.', x: ['Weil Homer nicht schreiben konnte.', 'Weil sie auf Latein sind.', 'Weil sie erst 2019 geschrieben wurden.'], w: 'Die Ilias und die Odyssee erzählen von Helden und Göttern. Sie sind wertvoll, aber kein Tatsachenbericht.' },
      { f: 'Über wen verraten die griechischen Texte <b>am wenigsten</b>?', a: 'über Frauen und Sklaven', x: ['über reiche Bürger', 'über Politiker', 'über Götter'], w: 'Geschrieben haben fast nur reiche Männer. Über andere Gruppen wissen wir darum wenig: eine Grenze der Quellen.' },
      { f: 'Ist eine bemalte Vase eine Sachquelle oder eine Bildquelle?', a: 'beides: Die Vase ist ein Gegenstand, das Bild darauf eine Bildquelle.', x: ['nur eine Textquelle', 'keine Quelle', 'eine mündliche Quelle'], w: 'Die Form verrät, wofür sie diente (Öl, Wein, Wasser). Das Bild verrät, was die Menschen taten.', svg: 'vase' },
    ],
    A: { w: ['Vasenbilder sind Bildquellen.', 'Herodot schrieb über Ägypten.', 'Über Sklaven wissen wir aus den Quellen wenig.'], f: ['Homer schrieb nur die reine Wahrheit auf.', 'Die Griechen hinterließen keine Texte.', 'Eine Münze ist eine Textquelle.'] },
  }, { sortieren: 30, passtNicht: 10, frage: 44, aussage: 16 });

  const wirtschaft = baue('g5-wirtschaft', {
    h: 'Athen lebte vom Handel übers Meer. Es verkaufte Olivenöl, Wein und Töpferwaren und kaufte Getreide und Holz. Der Hafen hieß Piräus, der Markt Agora.',
    S: { kats: ['Athen verkauft es', 'Athen kauft es ein'], f: (x) => `<b>${x}</b>: Hat Athen das eher verkauft oder eingekauft?`, h: 'Athen hatte viele Ölbäume, Weinberge und Töpfer, aber zu wenig Felder und Wald.',
      items: [['Olivenöl', 0], ['Wein', 0], ['bemalte Vasen', 0], ['Silbermünzen', 0], ['Getreide', 1, 'Attika hatte zu wenig Felder'], ['Holz für Schiffe', 1, 'die Wälder waren abgeholzt'], ['Sklaven', 1, 'viele kamen als Kriegsgefangene']] },
    F: [
      { f: 'Wie hieß der große <b>Hafen</b> Athens?', a: 'Piräus', x: ['Pnyx', 'Olymp', 'Gizeh'], w: 'Über den Piräus kam Getreide aus fernen Ländern, etwa vom Schwarzen Meer.' },
      { f: 'Wie hieß der <b>Marktplatz</b> in Athen?', a: 'Agora', x: ['Akropolis', 'Polis', 'Pnyx'], w: 'Auf der Agora kaufte man ein, traf Freunde und redete über Politik.' },
      { f: 'Woher hatte Athen das <b>Silber</b> für seine Münzen?', a: 'aus Bergwerken bei Laurion, in denen Sklaven arbeiteten', x: ['aus Ägypten als Geschenk', 'aus dem Meer gefischt', 'von den Bäumen'], w: 'Die Arbeit in den engen Stollen war hart und gefährlich.' },
      { f: 'Was zeigten die Silbermünzen Athens?', a: 'eine Eule', x: ['einen Pharao', 'eine Pyramide', 'ein Mammut'], w: 'Die Eule war das Tier der Göttin Athene.', svg: 'muenze' },
      { f: 'Warum musste Athen <b>Getreide</b> einführen?', a: 'In Attika gab es zu wenig fruchtbares Ackerland.', x: ['Weil die Athener kein Brot mochten.', 'Weil Getreide verboten war.', 'Weil es zu viel regnete.'], w: 'Darum waren Schiffe und Handel für Athen lebenswichtig.' },
      { f: 'Wer arbeitete in Athen oft in Werkstätten, Haushalten und Bergwerken?', a: 'Sklaven', x: ['Pharaonen', 'Götter', 'Spartiaten'], w: 'In Athen gab es sehr viele Sklaven. Sie hatten keine Rechte.' },
    ],
    T: [
      { f: 'Der Marktplatz in Athen hieß ___.', a: 'Agora', w: 'Mittelpunkt des Lebens in der Stadt.' },
      { f: 'Der Hafen Athens hieß ___.', a: ['Piräus', 'Piraeus'], w: 'Bis heute ein großer Hafen.' },
    ],
    A: { w: ['Athen verkaufte Olivenöl.', 'Athen musste Getreide einführen.', 'Auf der Agora wurde gehandelt.'], f: ['Athen lag weit weg vom Meer.', 'Athen hatte so viel Getreide, dass es welches verkaufte.', 'In Athen gab es keine Sklaven.'] },
  }, { sortieren: 30, passtNicht: 10, frage: 34, tippen: 12, aussage: 14 });

  const DEMO = ['durfte mitbestimmen', 'durfte nicht mitbestimmen'];
  const demokratie = baue('g5-demokratie', {
    h: 'Demokratie heißt Volksherrschaft. In Athen entschieden die erwachsenen männlichen Bürger in der Volksversammlung. Frauen, Sklaven und Fremde (Metöken) durften nicht mitbestimmen.',
    S: { kats: DEMO, f: (x) => `Durfte in Athen <b>${x}</b> in der Volksversammlung mitbestimmen?`, h: 'Nur erwachsene Männer mit athenischem Bürgerrecht. Arm oder reich war egal.',
      items: [['ein erwachsener Bürger Athens', 0], ['ein armer Bauer mit athenischem Bürgerrecht', 0, 'Arm oder reich war egal'], ['ein reicher Bürger Athens', 0],
        ['die Frau eines Bürgers', 1, 'Frauen hatten keine politischen Rechte'], ['ein Sklave', 1], ['ein zugezogener Händler aus Korinth (Metöke)', 1, 'Fremde hatten kein Bürgerrecht'], ['ein zehnjähriger Junge', 1, 'Kinder durften nicht abstimmen']] },
    O: [
      { t: 'So entstand in Athen ein Beschluss. Bringe die Schritte in die richtige Reihenfolge.', items: ['Der Rat der 500 bereitet einen Vorschlag vor.', 'Die Volksversammlung berät auf der Pnyx.', 'Die Bürger stimmen per Handzeichen ab.', 'Beamte setzen den Beschluss um.'], s1: 'Wie ein Flussdiagramm: Schritt für Schritt.', w: 'Rat → Volksversammlung → Abstimmung → Umsetzung.' },
      { t: 'So lief ein Scherbengericht ab. Bringe die Schritte in die richtige Reihenfolge.', items: ['Die Volksversammlung beschließt ein Scherbengericht.', 'Jeder Bürger ritzt einen Namen in eine Tonscherbe.', 'Die Scherben werden gezählt (mindestens 6000).', 'Wer am häufigsten genannt wird, muss für 10 Jahre fort.'], s1: 'Das Scherbengericht, Schritt für Schritt:', w: 'Beschluss → Namen ritzen → zählen → Verbannung.' },
    ],
    F: [
      { f: 'Was bedeutet „<b>Demokratie</b>“?', a: 'Volksherrschaft', x: ['Königsherrschaft', 'Herrschaft der Götter', 'Herrschaft der Reichen'], w: 'Griechisch: dēmos = Volk, kratein = herrschen.' },
      { f: 'Wer legte um <b>508/507 v. Chr.</b> den Grundstein für die Demokratie in Athen?', a: 'Kleisthenes', x: ['Alexander der Große', 'Zeus', 'Tutanchamun'], w: 'Er nahm dem Adel Macht und gab sie den Bürgern.' },
      { f: 'Wo traf sich die <b>Volksversammlung</b>?', a: 'auf dem Hügel Pnyx', x: ['auf dem Olymp', 'in Olympia', 'in einer Pyramide'], w: 'Dort hatten etwa 6000 Bürger Platz. Man traf sich rund 40-mal im Jahr.' },
      { f: 'Was geschah beim <b>Scherbengericht</b>?', a: 'Ein zu mächtiger Bürger konnte für 10 Jahre verbannt werden.', x: ['Kaputtes Geschirr wurde verkauft.', 'Ein Sportler wurde zum Sieger erklärt.', 'Ein Pharao wurde gewählt.'], w: 'So wollte man verhindern, dass einer allein die Macht an sich reißt.', svg: 'ostrakon' },
      { f: 'Wie viele Stimmen brauchte ein Scherbengericht mindestens?', a: '6000', x: ['60', '600', '60.000'], w: 'Etwa ein Fünftel aller Bürger musste mitmachen.' },
      { f: 'Warum zahlte Athen später ein <b>Tagegeld</b> (Diäten)?', a: 'Damit auch arme Bürger zur Versammlung kommen konnten statt zu arbeiten.', x: ['Damit die Reichen noch reicher werden.', 'Als Eintritt für die Olympischen Spiele.', 'Weil Sklaven abstimmen durften.'], w: 'Diese Idee setzte der Politiker Perikles durch. Heute bekommen Abgeordnete auch Diäten.' },
      { f: 'Wie wurden viele Ämter in Athen besetzt, zum Beispiel der Rat der 500?', a: 'durch das Los', x: ['durch Erbschaft', 'durch den Pharao', 'durch ein Wettrennen'], w: 'Das Los sollte allen Bürgern die gleiche Chance geben.' },
      { f: 'Was ist ein großer <b>Unterschied</b> zur Demokratie heute?', a: 'Heute dürfen auch Frauen wählen, damals nicht.', x: ['Damals durften alle Menschen wählen.', 'Heute gibt es keine Wahlen mehr.', 'Damals gab es schon das Internet zum Abstimmen.'], w: 'In Athen bestimmten nur die erwachsenen männlichen Bürger. Die Mehrheit der Menschen war ausgeschlossen.' },
      { f: 'Wo kannst <b>du</b> heute schon mitbestimmen?', a: 'zum Beispiel bei der Wahl der Klassensprecher', x: ['bei der Wahl des Pharaos', 'beim Scherbengericht', 'nirgends, erst mit 80 Jahren'], w: 'In Familie, Schule und Verein kann man mitreden, abstimmen und Verantwortung übernehmen.' },
    ],
    T: [
      { f: 'Demokratie bedeutet ___.', a: 'Volksherrschaft', w: 'Das Volk herrscht.' },
      { f: 'Die Volksversammlung tagte auf dem Hügel ___.', a: 'Pnyx', w: 'Ganz in der Nähe der Akropolis.' },
      { f: 'Beim Scherbengericht wurde ein Bürger für ___ Jahre verbannt.', a: ['zehn', '10'], w: 'Danach durfte er zurückkehren.' },
    ],
    A: { w: ['In Athen durften Frauen nicht abstimmen.', 'Das Scherbengericht konnte jemanden für zehn Jahre verbannen.', 'Auch arme Bürger durften in der Volksversammlung abstimmen.'], f: ['In Athen durften Sklaven abstimmen.', 'In Athen herrschte ein Pharao.', 'Nur die Reichen durften in die Volksversammlung.'] },
  }, { sortieren: 26, passtNicht: 10, ordnen: 16, frage: 30, tippen: 10, aussage: 12 });

  const athen = baue('g5-athen', {
    h: 'In Athen gingen Jungen zur Schule, Mädchen lernten zu Hause. Frauen kümmerten sich um Haus und Familie und hatten keine politischen Rechte. Sklaven arbeiteten überall mit.',
    S: { kats: ['Junge in Athen', 'Mädchen in Athen'], f: (x) => `<b>${x}</b>: Junge oder Mädchen?`, h: 'Jungen gingen zur Schule und zum Sport. Mädchen lernten zu Hause von der Mutter.',
      items: [['wird von einem Sklaven zur Schule begleitet', 0], ['lernt beim Lehrer Lesen, Schreiben und Rechnen', 0], ['lernt Musik und Gedichte', 0], ['trainiert im Gymnasion', 0],
        ['lernt zu Hause Spinnen und Weben', 1], ['lernt von der Mutter, einen Haushalt zu führen', 1], ['heiratet oft schon mit etwa 14 Jahren', 1], ['bleibt meist im Haus', 1]] },
    F: [
      { f: 'Was war ein <b>Paidagogos</b>?', a: 'ein Sklave, der einen Jungen zur Schule begleitete und auf ihn aufpasste', x: ['ein griechischer Gott', 'ein Sportler in Olympia', 'ein Händler auf der Agora'], w: 'Von diesem Wort kommt unser Wort „Pädagoge“ (Erzieher).' },
      { f: 'Welche Rechte hatten Frauen in Athen?', a: 'kaum welche: Sie durften nicht wählen und brauchten einen Mann als Vormund.', x: ['dieselben wie die Männer', 'mehr Rechte als die Männer', 'Sie regierten die Stadt.'], w: 'Ihr Platz war nach der Vorstellung der Athener das Haus.' },
      { f: 'Wer waren die <b>Metöken</b>?', a: 'freie Fremde, die in Athen lebten, aber kein Bürgerrecht hatten', x: ['die Könige Athens', 'die Priester der Athene', 'die Sklaven in den Bergwerken'], w: 'Sie arbeiteten oft als Händler oder Handwerker und zahlten Steuern.' },
      { f: 'Woher kamen die meisten <b>Sklaven</b>?', a: 'Es waren oft Kriegsgefangene oder gekaufte Menschen aus fremden Ländern.', x: ['Sie hatten sich freiwillig gemeldet.', 'Es waren alle Bürger über 60.', 'Sie kamen aus Sparta als Gäste.'], w: 'Sklaven galten als Besitz und konnten verkauft werden.' },
      { f: 'Wo trafen sich die Männer Athens, um zu reden und zu handeln?', a: 'auf der Agora', x: ['auf dem Olymp', 'im Frauengemach', 'in der Pyramide'], w: 'Der Marktplatz war der Treffpunkt der Stadt.' },
      { f: 'Für welchen Gott spielte man in Athen <b>Theater</b>?', a: 'Dionysos', x: ['Poseidon', 'Re', 'Hades'], w: 'Bei seinen Festen wurden Tragödien und Komödien aufgeführt.' },
    ],
    T: [
      { f: 'Ein Sklave, der Jungen zur Schule brachte, hieß ___.', a: ['Paidagogos', 'Pädagoge'], w: 'Daher kommt unser Wort „Pädagoge“.' },
      { f: 'Freie Fremde ohne Bürgerrecht hießen in Athen ___.', a: ['Metöken', 'Metöke'], w: 'Sie durften nicht mitbestimmen.' },
    ],
    A: { w: ['Mädchen lernten in Athen meist zu Hause.', 'Metöken hatten in Athen kein Bürgerrecht.', 'Sklaven galten als Besitz.'], f: ['In Athen gingen Mädchen und Jungen gemeinsam zur Schule.', 'Frauen stimmten in der Volksversammlung ab.', 'In Athen gab es keine Sklaven.'] },
  }, { sortieren: 30, passtNicht: 12, frage: 34, tippen: 10, aussage: 14 });

  const SP = ['Spartiaten', 'Periöken', 'Heloten'];
  function spPyramide() {
    const k = R(0, 2), t = ['wenige Vollbürger, alle Krieger, sie bestimmten allein', 'frei, Händler und Handwerker, aber ohne Mitbestimmung', 'die größte Gruppe: unfreie Bauern auf dem Land der Spartiaten'][k];
    const ch = SP.slice();
    return { prompt: `Welche Gruppe in Sparta ist gemeint? <b>${t}</b>`, choices: ch, correct: k, hint: 'Spartiaten: wenige Krieger mit allen Rechten. Periöken: frei, aber ohne Mitsprache. Heloten: Unfreie, die größte Gruppe.',
      solution: `<b>${SP[k]}</b>: ${t}.`, ex: { mode: 'pyramide', art: 'spPyramide', stufen: SP, hell: [k], merk: `<b>${SP[k]}</b>: ${t}.` } };
  }
  const sparta = baue('g5-sparta', {
    h: 'Sparta war ein Militärstaat auf der Halbinsel Peloponnes. Die wenigen Spartiaten waren Krieger und bestimmten allein. Periöken waren frei, aber ohne Mitsprache. Die Heloten waren unfrei und die größte Gruppe.',
    S: { kats: SP, f: (x) => `Welche Gruppe in Sparta: <b>${x}</b>?`, h: 'Spartiaten: Krieger mit allen Rechten. Periöken: frei, Händler und Handwerker. Heloten: Unfreie auf den Feldern.',
      items: [['die einzigen Vollbürger', 0], ['Jungen ab 7 Jahren werden zu Kriegern erzogen', 0], ['die kleinste Gruppe', 0], ['frei, aber ohne politische Rechte', 1], ['Händler und Handwerker in den Orten ringsum', 1], ['müssen im Krieg mitkämpfen, dürfen aber nicht mitbestimmen', 1],
        ['unfrei, bestellen die Felder der Spartiaten', 2], ['die größte Gruppe', 2], ['unterworfene Bewohner des Landes', 2]] },
    F: [
      { f: 'Wo lag Sparta?', a: 'auf der Halbinsel Peloponnes', x: ['auf der Insel Kreta', 'in Ägypten am Nil', 'neben Athen in Attika'], w: 'Sparta lag im Süden Griechenlands.' },
      { f: 'Ab welchem Alter wurden spartanische Jungen vom Staat erzogen?', a: 'ab 7 Jahren', x: ['ab 18 Jahren', 'ab 2 Jahren', 'nie'], w: 'Sie lebten in Gruppen, lernten Kämpfen und Gehorchen, bekamen wenig zu essen und mussten Kälte aushalten.' },
      { f: 'Was bedeutet heute „<b>spartanisch</b>“?', a: 'sehr einfach, ohne Luxus', x: ['sehr reich und prächtig', 'sehr laut', 'sehr klug'], w: 'Die Spartiaten lebten absichtlich einfach und hart.' },
      { f: 'Wie viele <b>Könige</b> hatte Sparta gleichzeitig?', a: 'zwei', x: ['einen', 'keinen', 'zehn'], w: 'Zwei Könige führten das Heer. Daneben gab es einen Ältestenrat und fünf Aufseher (Ephoren).' },
      { f: 'Was war für spartanische <b>Frauen</b> anders als für Frauen in Athen?', a: 'Sie trieben Sport und verwalteten Landgüter.', x: ['Sie durften nie aus dem Haus.', 'Sie wurden Krieger im Heer.', 'Sie regierten als Königinnen allein.'], w: 'Sie sollten gesund sein und starke Kinder bekommen. Sie hatten mehr Freiheiten als in anderen griechischen Städten.' },
      { f: 'Warum mussten die Spartiaten ständig Krieger sein?', a: 'Sie fürchteten einen Aufstand der vielen Heloten.', x: ['Weil sie gegen Ägypten kämpften.', 'Weil sie die Olympischen Spiele gewinnen mussten.', 'Weil sie keine Felder hatten.'], w: 'Die Heloten waren viel zahlreicher als die Spartiaten.' },
      { f: 'Was bedeutet „<b>lakonisch</b>“ antworten?', a: 'kurz und knapp', x: ['lang und ausführlich', 'auf Griechisch', 'singend'], w: 'Spartas Landschaft hieß Lakonien. Die Spartaner waren für kurze Antworten bekannt.' },
    ],
    T: [
      { f: 'Die unfreien Bauern in Sparta hießen ___.', a: ['Heloten', 'Helot'], w: 'Sie waren die größte Gruppe.' },
      { f: 'Die Vollbürger in Sparta hießen ___.', a: ['Spartiaten', 'Spartiat'], w: 'Sie waren alle Krieger.' },
      { f: 'Freie Bewohner ohne Mitbestimmung hießen in Sparta ___.', a: ['Periöken', 'Periöke'], w: '„Umwohner“: Sie lebten in den Orten rings um Sparta.' },
    ],
    A: { w: ['Sparta hatte zwei Könige.', 'Die Heloten waren die größte Gruppe in Sparta.', 'Spartanische Jungen wurden ab 7 Jahren zu Kriegern erzogen.'], f: ['In Sparta durften die Heloten abstimmen.', 'Sparta lag am Nil.', 'Die Spartiaten waren die größte Gruppe.'] },
    extra: { spPyramide },
  }, { sortieren: 22, passtNicht: 8, frage: 30, tippen: 12, aussage: 12, spPyramide: 16 });

  const vergleich = baue('g5-vergleich', {
    h: 'Athen: Demokratie, Handel übers Meer, Theater und Tempel. Sparta: zwei Könige, Militärstaat, harte Erziehung, Heloten.',
    S: { kats: ['Athen', 'Sparta'], f: (x) => `Athen oder Sparta? <b>${x}</b>`, h: 'Athen: Demokratie und Handel. Sparta: Krieger und Könige.',
      items: [['viele Bürger entscheiden in der Volksversammlung', 0], ['Scherbengericht', 0], ['großer Hafen und viel Handel', 0], ['Theater und prächtige Tempel', 0], ['Silbermünzen mit einer Eule', 0], ['Schutzgöttin Athene', 0],
        ['zwei Könige', 1], ['Jungen ab 7 Jahren werden zu Kriegern erzogen', 1], ['Heloten bestellen die Felder', 1], ['Frauen treiben Sport und verwalten Landgüter', 1], ['liegt auf der Halbinsel Peloponnes', 1], ['einfaches, hartes Leben für den Staat', 1]] },
    F: [
      { f: 'Wer gewann den langen <b>Krieg zwischen Athen und Sparta</b> (431 bis 404 v. Chr.)?', a: 'Sparta', x: ['Athen', 'Ägypten', 'niemand, er endete nie'], w: 'Man nennt ihn den Peloponnesischen Krieg. Danach erholte sich Athen nur langsam.' },
      { f: 'Gegen wen kämpften Athen und Sparta <b>gemeinsam</b>?', a: 'gegen die Perser', x: ['gegen die Ägypter', 'gegen die Römer', 'gegen die Olympioniken'], w: 'Um 490 und 480 v. Chr. wehrten die Griechen zusammen die Angriffe der Perser ab.' },
      { f: 'Was hatten Athen und Sparta <b>gemeinsam</b>?', a: 'Beide waren griechische Poleis mit denselben Göttern.', x: ['Beide hatten zwei Könige.', 'Beide waren Demokratien.', 'Beide lagen in Ägypten.'], w: 'Sie sprachen dieselbe Sprache und nahmen an den Olympischen Spielen teil.' },
    ],
    A: { w: ['Athen war eine Demokratie, Sparta hatte zwei Könige.', 'In Sparta trieben Frauen Sport.', 'Athen hatte einen großen Hafen.'], f: ['Sparta war berühmt für sein Theater und seinen Handel.', 'In Athen wurden alle Jungen ab 7 Jahren zu Kriegern erzogen.', 'Athen und Sparta waren nie Feinde.'] },
  }, { sortieren: 44, passtNicht: 18, frage: 20, aussage: 18 });

  // =====================================================
  // Längsschnitt: Mensch und Natur (ANNO 1, S. 132–137; Lehrplan LB 4)
  // =====================================================
  const natur = baue('g5-natur', {
    h: 'Steinzeit: Die Menschen waren ganz von der Natur abhängig. Ägypten: Die Menschen lebten mit dem Nil und nutzten ihn klug. Griechenland: Wälder wurden abgeholzt, die Böden wurden weggespült.',
    S: { kats: ['Steinzeit', 'Ägypten', 'Griechenland'], f: (x) => `Wohin gehört das? <b>${x}</b>`, h: 'Steinzeit: abhängig von Tieren und Klima. Ägypten: Leben mit dem Nil. Griechenland: Wald abgeholzt.',
      items: [['Die Menschen folgen den Tierherden.', 0], ['In der Eiszeit ist es bitterkalt.', 0], ['Ohne Jagdglück droht Hunger.', 0],
        ['Die Überschwemmung bringt fruchtbaren Schlamm.', 1], ['Kanäle leiten das Wasser auf die Felder.', 1], ['Der Kalender richtet sich nach dem Fluss.', 1],
        ['Wälder werden für Schiffe und Häuser abgeholzt.', 2], ['Regen spült die Erde von den kahlen Bergen.', 2], ['Ziegen fressen die jungen Bäume ab.', 2]] },
    F: [
      { f: 'Wie hingen die Menschen der <b>Altsteinzeit</b> von der Natur ab?', a: 'Sie konnten nur leben, wo es Tiere und Pflanzen gab, und mussten mit Kälte zurechtkommen.', x: ['Gar nicht, sie hatten Supermärkte.', 'Sie bauten Staudämme.', 'Sie lebten nur von Getreide aus Ägypten.'], w: 'Jäger und Sammler waren der Natur ganz ausgeliefert.' },
      { f: 'Wie nutzten die <b>Ägypter</b> die Natur klug?', a: 'Sie richteten ihr Leben nach dem Nil und speicherten sein Wasser in Kanälen und Becken.', x: ['Sie holzten alle Wälder ab.', 'Sie ignorierten den Fluss.', 'Sie lebten in der Wüste ohne Wasser.'], w: 'Sie veränderten die Natur, aber im Einklang mit dem Fluss.' },
      { f: 'Warum wurden die Berge Griechenlands <b>kahl</b>?', a: 'Die Menschen holzten die Wälder für Schiffe, Häuser und Brennholz ab.', x: ['Ein Vulkan verbrannte alles.', 'Die Götter nahmen die Bäume mit auf den Olymp.', 'Die Ägypter brachten die Bäume weg.'], w: 'Ohne Bäume spülte der Regen die Erde weg. Schon der griechische Gelehrte Platon klagte darüber.' },
      { f: 'Wann begannen Menschen, die Landschaft in Mitteleuropa <b>stark zu verändern</b>?', a: 'in der Jungsteinzeit, als sie Wald für Felder rodeten', x: ['erst im Jahr 2000', 'in der Altsteinzeit, als sie Mammuts jagten', 'nie'], w: 'Mit dem Ackerbau begann der Mensch, die Natur nach seinen Wünschen umzugestalten.' },
      { f: 'Was kann man aus dem Beispiel Griechenland für heute lernen?', a: 'Wer die Natur zerstört, schadet am Ende sich selbst.', x: ['Bäume sind unwichtig.', 'Man sollte alle Berge abtragen.', 'Die Natur repariert alles sofort von allein.'], w: 'Abgeholzte Hänge blieben oft für Jahrhunderte kahl.' },
    ],
    A: { w: ['Die Menschen der Steinzeit waren stark von der Natur abhängig.', 'In Griechenland wurden viele Wälder abgeholzt.', 'Die Ägypter richteten ihren Kalender nach dem Nil.'], f: ['Die Ägypter holzten alle Wälder am Nil ab, um Pyramiden zu bauen.', 'In der Steinzeit hatte das Wetter keinen Einfluss auf die Menschen.', 'Abgeholzte Berge in Griechenland waren nach einem Jahr wieder grün.'] },
  }, { sortieren: 40, passtNicht: 16, frage: 30, aussage: 14 });

  // =====================================================
  // Lernbereiche Klasse 5 = Kapitel von ANNO 1 (Themenplan: faecher/geschichte/themenplan.md)
  // =====================================================
  D.grades = D.grades || {};
  D.grades[5] = {
    lbs: [
      { id: 'g5-begegnung', nr: 1, title: 'Begegnungen mit Geschichte', topics: [
        { id: 'g5-quellen', title: 'Woher wissen wir das? Quellen', icon: '🔍', gen: quellen },
        { id: 'g5-zeitstrahl', title: 'Der Zeitstrahl: vor und nach Christus', icon: '📏', gen: zeitstrahl },
        { id: 'g5-jh', title: 'Jahrhunderte und Jahrtausende', icon: '💯', gen: jahrhundert },
        { id: 'g5-rechnen', title: 'Wie lange ist das her?', icon: '🧮', gen: rechnen },
        { id: 'g5-epochen', title: 'Die großen Zeitabschnitte', icon: '🗂', gen: epochen },
      ] },
      { id: 'g5-frueh', nr: 2, title: 'Das Leben der Menschen in der Frühgeschichte', topics: [
        { id: 'g5-mensch', title: 'Die Entwicklung zum Menschen', icon: '🚶', gen: mensch },
        { id: 'g5-alt', title: 'Leben in der Altsteinzeit', icon: '🦣', gen: altstein },
        { id: 'g5-hoehle', title: 'Höhlenmalerei', icon: '🎨', gen: hoehle },
        { id: 'g5-jung', title: 'Leben in der Jungsteinzeit', icon: '🌾', gen: jung },
        { id: 'g5-altjung', title: 'Alt- oder Jungsteinzeit?', icon: '⚖', gen: altjung },
        { id: 'g5-oetzi', title: 'Ötzi: Wanderer zwischen den Zeiten', icon: '🏔', gen: oetzi },
        { id: 'g5-metall', title: 'Kupfer, Bronze, Eisen und Handel', icon: '⚒', gen: metall },
        { id: 'g5-nebra', title: 'Die Himmelsscheibe von Nebra', icon: '🌙', gen: nebra },
      ] },
      { id: 'g5-aegypten', nr: 3, title: 'Ägypten – eine frühe Hochkultur', topics: [
        { id: 'g5-nil', title: 'Der Nil: Leben am Fluss', icon: '🌊', gen: nil },
        { id: 'g5-staat', title: 'Ein Staat entsteht: Pharao und Beamte', icon: '👑', gen: staat },
        { id: 'g5-schrift', title: 'Hieroglyphen, Papyrus und Schreiber', icon: '📜', gen: schrift },
        { id: 'g5-gesellschaft', title: 'Die Gesellschaftspyramide', icon: '🔺', gen: gesellschaft },
        { id: 'g5-religion-ag', title: 'Die Götter der Ägypter', icon: '☀', gen: religionAg },
        { id: 'g5-jenseits', title: 'Mumien und Jenseits', icon: '⚱', gen: jenseits },
        { id: 'g5-pyramiden', title: 'Die Pyramiden', icon: '🏜', gen: pyramiden },
        { id: 'g5-hochkultur', title: 'Hochkultur: Merkmale und Quellen', icon: '🏛', gen: hochkultur },
      ] },
      { id: 'g5-polis', nr: 4, title: 'Lebenswelt griechische Polis', topics: [
        { id: 'g5-land', title: 'Land, Meer und Kolonien', icon: '⛵', gen: land },
        { id: 'g5-olympia', title: 'Die Olympischen Spiele', icon: '🏅', gen: olympia },
        { id: 'g5-religion-gr', title: 'Die Götter der Griechen', icon: '⚡', gen: religionGr },
        { id: 'g5-quellen-gr', title: 'Woher wissen wir etwas über die Griechen?', icon: '🏺', gen: quellenGr },
        { id: 'g5-wirtschaft', title: 'Handel und Wirtschaft in Athen', icon: '🦉', gen: wirtschaft },
        { id: 'g5-demokratie', title: 'Demokratie in Athen', icon: '🗳', gen: demokratie },
        { id: 'g5-athen', title: 'Leben in Athen', icon: '🏠', gen: athen },
        { id: 'g5-sparta', title: 'Die Polis Sparta', icon: '🛡', gen: sparta },
        { id: 'g5-vergleich', title: 'Athen und Sparta im Vergleich', icon: '↔', gen: vergleich },
      ] },
      { id: 'g5-laengs', nr: 5, title: 'Längsschnitt: Mensch und Natur', topics: [
        { id: 'g5-natur', title: 'Mensch und Natur', icon: '🌳', gen: natur },
      ] },
    ],
  };
  D.daten = { EREIG, GP, SP, GOETTER_AG, GOETTER_GR, J, HEUTE };
})();
