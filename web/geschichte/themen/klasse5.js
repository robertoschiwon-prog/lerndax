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
  // Jahr als Text: negativ = v. Chr.; kleine Jahre n. Chr. mit Zusatz
  const J = (j, um) => (um ? 'um ' : '') + (j < 0 ? `${-j} v. Chr.` : j < 1000 ? `${j} n. Chr.` : String(j));
  // Gemeinsame Bausteine aus plattform/bausteine.js; Reihenfolgen mit Jahren (e.j) zeigen den Zeitstrahl
  const umV = (e, i) => (Array.isArray(e.um) ? !!e.um[i] : !!e.um);
  const U = LernDaxBausteine(D, {
    passtNicht: 'Drei Begriffe gehören zusammen. Welcher <b>passt nicht</b> dazu?',
    gw: { tippen: 16 },
    ordnenZusatz: (e, i) => (e.j ? ` (${J(e.j[i], umV(e, i))})` : ''),
    ordnenEx: (art, e, idx) => (e.j ? { mode: 'strahl', art, punkte: idx.map((i) => ({ j: e.j[i], t: e.kurz ? e.kurz[i] : e.items[i], um: umV(e, i) })), s1: e.s1 || 'Wir legen alles auf den Zeitstrahl: links das Älteste, rechts das Jüngste.', merk: e.w || 'Von links nach rechts: vom Ältesten zum Jüngsten.' } : null),
  });
  U.J = J;
  const { R, pick, shuffle, reihum, nurText, mische, baue } = U;

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
    { f: 'Statt „v. Chr.“ schreibt man manchmal „<b>v. u. Z.</b>“. Was heißt das?', a: 'vor (dem Beginn) unserer Zeitrechnung', x: ['vor unserer Zeitung', 'von uns zusammengezählt', 'vor unserem Zeitstrahl'], w: 'v. u. Z. und n. u. Z. meinen dasselbe wie v. Chr. und n. Chr., nur ohne Christus zu nennen.' },
    { f: '753 v. u. Z. ist dasselbe Jahr wie …', a: '753 v. Chr.', x: ['753 n. Chr.', '1273 n. Chr.', '247 v. Chr.'], w: '„v. u. Z.“ ist nur eine andere Abkürzung für „v. Chr.“.' },
  ];
  const zeitstrahl = baue('g5-zeitstrahl', { h: TIPP_STRAHL, F: ZS_F, extra: { zsOrdnen, zsFrueher, zsPunkt } }, { zsOrdnen: 30, zsFrueher: 26, zsPunkt: 24, frage: 20 });

  // ---------- Jahrhunderte und Jahrtausende ----------
  const jhVon = (j) => Math.floor(Math.abs(j) / 100) + 1;   // wie im Buch (S. 10–11): das 13. Jahrhundert sind die Jahre 1200 bis 1299
  const TIPP_JH = 'Das 1. Jahrhundert sind die Jahre unter 100, das 13. Jahrhundert die Jahre, die mit „12“ beginnen: 1200 bis 1299. Trick: Streiche die letzten zwei Ziffern weg und zähle 1 dazu (1453 → 14 + 1 = 15. Jahrhundert). Bei v. Chr. genauso, nur rückwärts.';
  const jhText = (n, v) => `${n}. Jahrhundert${v ? ' v. Chr.' : ''}`;
  function jhBlock(n, v) { const a = Math.max(1, (n - 1) * 100), b = n * 100 - 1; return v ? [-b, -a] : [a, b]; }
  function jhJahr() { // v. Chr. nie ein Jahr, das auf 00 endet (dazu sagt das Buch nichts)
    const v = Math.random() < 0.4; let j; do { j = v ? R(110, 3200) : R(110, 2025); } while (v && j % 100 === 0);
    return v ? -j : j;
  }
  function jhBestimmen() {
    const j = jhJahr(), n = jhVon(j), v = j < 0;
    return { prompt: `In welchem <b>Jahrhundert</b> liegt das Jahr <b>${J(j)}</b>?`, fields: [{ answer: n, label: 'Jahrhundert', suffix: v ? '. Jahrhundert v. Chr.' : '. Jahrhundert' }], hint: TIPP_JH,
      solution: `${Math.abs(j)}: die letzten zwei Ziffern weg → ${Math.floor(Math.abs(j) / 100)}, plus 1 → <b>${n}</b>. Das Jahr liegt im <b>${jhText(n, v)}</b>.`,
      ex: { mode: 'strahl', art: 'jhBestimmen', punkte: [{ j, t: J(j), hell: true }], block: jhBlock(n, v), blockText: jhText(n, v), s1: 'Jedes Jahrhundert ist ein Abschnitt von 100 Jahren.', merk: `${J(j)} liegt im <b>${n}</b>. Jahrhundert${v ? ' v. Chr.' : ''}.` } };
  }
  function jhSpanne() {
    const v = false, n = R(3, 21), [a, b] = jhBlock(n, v);   // nur n. Chr., so wie das Buch zählt (1200 bis 1299)
    const fmt = (x, y) => `${x} bis ${y}`;
    const ok = fmt(a, b), w1 = fmt(a + 1, b + 1), w2 = fmt(a + 100, b + 100);
    const ch = shuffle([ok, w1, w2]);
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
    { f: 'Welche Jahre gehören nach deinem Geschichtsbuch zum <b>1. Jahrhundert</b>?', a: 'alle Jahre unter 100', x: ['die Jahre 100 bis 199', 'die Jahre 1000 bis 1999', 'nur das Jahr 100'], w: 'Das 1. Jahrhundert umfasst die Jahreszahlen unter 100. Darum beginnt das 2. Jahrhundert mit 100.' },
    { f: 'Zu welchem Jahrhundert gehört das Jahr <b>1200</b>?', a: 'zum 13. Jahrhundert', x: ['zum 12. Jahrhundert', 'zum 2. Jahrhundert', 'zum 120. Jahrhundert'], w: 'Das 13. Jahrhundert sind alle Jahre, die mit „12“ beginnen: 1200 bis 1299.' },
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
  const EPO = ['Vorgeschichte', 'Altertum (Antike)', 'Mittelalter', 'Neuzeit'];   // „Vorgeschichte“ und „Antike“ wie im Buch (Fachbegriffe)
  const epochen = baue('g5-epochen', {
    h: 'Vorgeschichte: Zeit ohne Schrift, sie endet um 3000 v. Chr. Altertum (Antike): ab etwa 3000 v. Chr. (Ägypten, Griechen, Römer). Mittelalter: etwa 500 bis 1500 (Burgen, Ritter). Neuzeit: ab etwa 1500.',
    O: [{ t: 'Bringe die Zeitabschnitte in die richtige Reihenfolge: <b>der älteste zuerst</b>.', items: EPO, w: 'Vorgeschichte → Altertum → Mittelalter → Neuzeit.', s1: 'Die vier großen Abschnitte, vom ältesten zum jüngsten:' }],
    S: { kats: EPO, f: (x) => `Zu welchem Zeitabschnitt gehört: <b>${x}</b>?`, h: 'Vorgeschichte: ohne Schrift. Altertum: Ägypten, Griechen, Römer. Mittelalter: Burgen und Ritter. Neuzeit: ab etwa 1500.',
      items: [['Höhlenmalerei', 0, 'Die Menschen der Steinzeit hatten noch keine Schrift'], ['Faustkeil', 0, 'ein Werkzeug der Altsteinzeit'], ['Ötzi', 0, 'Er lebte vor etwa 5300 Jahren, ohne Schrift'], ['Jäger und Sammler', 0, 'so lebten die Menschen in der Altsteinzeit'],
        ['Bau der Pyramiden', 1, 'Ägypten ist eine Hochkultur des Altertums'], ['Olympische Spiele der Griechen', 1, 'seit 776 v. Chr.'], ['Demokratie in Athen', 1, 'um 500 v. Chr.'], ['Hieroglyphen', 1, 'die Schrift der alten Ägypter'],
        ['Ritterburgen', 2, 'Burgen und Ritter gehören zum Mittelalter'], ['Dresden wird zum ersten Mal erwähnt (1206)', 2, '1206 liegt zwischen 500 und 1500'], ['Mönche schreiben Bücher mit der Hand ab', 2, 'Klöster waren im Mittelalter wichtig'],
        ['erste Eisenbahn in Sachsen', 3, 'Eisenbahnen gibt es erst seit rund 200 Jahren'], ['erste Olympische Spiele der Neuzeit (1896)', 3, '1896 liegt nach 1500'], ['dein erster Schultag', 3, 'Wir leben heute in der Neuzeit']] },
    F: [
      { f: 'Womit <b>endet</b> die Vorgeschichte?', a: 'mit der Erfindung der Schrift', x: ['mit dem Bau der ersten Burg', 'mit der Erfindung des Feuers', 'mit Christi Geburt'], w: 'Um 3000 v. Chr. schrieben Sumerer und Ägypter die ersten Texte. Die Zeit davor heißt Vorgeschichte (auch Ur- und Frühgeschichte).' },
      { f: 'Ungefähr wann beginnt das <b>Altertum</b>?', a: 'um 3000 v. Chr.', x: ['um 500 n. Chr.', 'um 1500 n. Chr.', 'um 30000 v. Chr.'], w: 'Um 3000 v. Chr. entstand in Ägypten und Mesopotamien die Schrift.' },
      { f: 'Ungefähr wann beginnt die <b>Neuzeit</b>?', a: 'um 1500', x: ['um 500', 'um 1900', 'um 3000 v. Chr.'], w: 'Um 1500 änderte sich viel: Buchdruck, Entdeckung Amerikas (1492), neue Ideen.' },
      { f: 'Ungefähr wann beginnt das <b>Mittelalter</b>?', a: 'um 500', x: ['um 1500', 'um 3000 v. Chr.', 'um 1900'], w: 'Um 500 n. Chr. endete das Weströmische Reich. Das Mittelalter dauerte bis etwa 1500.' },
      { f: 'Warum sind die Grenzen zwischen den Zeitabschnitten nur <b>ungefähr</b>?', a: 'Die Veränderungen geschahen langsam, nicht an einem Tag.', x: ['Weil niemand Jahreszahlen kennt.', 'Weil jedes Land eine andere Uhr hatte.', 'Weil die Menschen damals nicht zählen konnten.'], w: 'Historiker teilen die Zeit ein, um sich zu orientieren. Die Menschen damals wussten nicht, dass ein „Mittelalter“ beginnt.' },
    ],
  }, { ordnen: 18, sortieren: 40, passtNicht: 14, frage: 28 });

  // ---------- Woher wissen wir das? Quellen ----------
  // Namen wie im Buch (S. 6–8): gegenständliche, bildliche, schriftliche Quellen und mündliche Überlieferung
  const QART = ['gegenständliche Quelle', 'bildliche Quelle', 'schriftliche Quelle', 'mündliche Überlieferung'];
  const quellen = baue('g5-quellen', {
    h: 'Gegenständliche Quelle: ein Ding (Werkzeug, Münze, Waffe, Gebäude). Bildliche Quelle: ein Bild aus der Zeit. Schriftliche Quelle: etwas Geschriebenes (Urkunde, Brief, Inschrift). Mündliche Überlieferung: wird von Generation zu Generation erzählt. Eine <b>Darstellung</b> ist später gemacht, zum Beispiel ein Schulbuchtext.',
    S: { kats: QART, f: (x) => `Welche Art von Quelle ist <b>${x}</b>?`, h: 'Ist es ein Gegenstand, ein Bild, ein Text oder eine Erzählung?',
      items: [['ein Faustkeil aus Stein', 0, 'ein Gegenstand'], ['eine alte Münze', 0, 'ein Gegenstand'], ['eine Mumie', 0, 'ein Fund, den man anfassen kann'], ['eine Tonscherbe', 0, 'ein Gegenstand'], ['die Reste eines Hauses', 0, 'auch Gebäude sind Sachquellen'], ['Ötzis Kupferbeil', 0, 'ein Gegenstand'],
        ['eine Höhlenmalerei', 1, 'ein Bild aus der Steinzeit'], ['ein Bild auf einer griechischen Vase', 1, 'ein Bild aus der Zeit'], ['eine Wandmalerei in einem Grab', 1, 'ein Bild aus der Zeit'], ['ein altes Foto', 1, 'ein Bild aus der Zeit'],
        ['ein Papyrus mit Hieroglyphen', 2, 'etwas Geschriebenes'], ['eine Inschrift auf einem Stein', 2, 'etwas Geschriebenes'], ['ein Brief von 1945', 2, 'etwas Geschriebenes'], ['ein altes Tagebuch', 2, 'etwas Geschriebenes'],
        ['Oma erzählt von ihrer Schulzeit', 3, 'jemand erzählt, was er erlebt hat'], ['ein Interview mit einer Zeitzeugin', 3, 'jemand erzählt, was er erlebt hat'], ['ein altes Lied, das Eltern ihren Kindern weitergeben', 3, 'von Generation zu Generation erzählt'],
        ['eine Urkunde', 2, 'etwas Geschriebenes'], ['ein Plakat', 1, 'ein Bild aus der Zeit'], ['eine Waffe', 0, 'ein Gegenstand']] },
    F: [
      { f: 'Ein <b>Schulbuchtext über die Steinzeit</b>, geschrieben 2019. Was ist das?', a: 'eine Darstellung', x: ['eine Sachquelle', 'eine Bildquelle', 'eine Textquelle aus der Steinzeit'], w: 'Er ist viel später geschrieben worden. Eine Darstellung erklärt die Vergangenheit, sie stammt nicht aus ihr.' },
      { f: 'Eine <b>Zeichnung von heute</b>, wie ein Steinzeitdorf ausgesehen haben könnte. Was ist das?', a: 'eine Darstellung', x: ['eine Bildquelle aus der Steinzeit', 'eine Sachquelle', 'eine mündliche Quelle'], w: 'Solche Zeichnungen (Rekonstruktionen) sind später gemacht. Sie zeigen, was Forscher vermuten.' },
      { f: 'Ein <b>Film</b> über die Pyramiden, gedreht 2020. Was ist das?', a: 'eine Darstellung', x: ['eine Sachquelle', 'eine Textquelle', 'eine Bildquelle aus Ägypten'], w: 'Der Film ist heute gemacht. Er stellt die Vergangenheit dar.' },
      { f: 'Was ist eine <b>Quelle</b>?', a: 'alles, was aus der Vergangenheit übrig ist und uns etwas über sie verrät', x: ['nur alte Bücher', 'ein Text, den ein Forscher heute schreibt', 'nur Dinge, die im Museum stehen'], w: 'Quellen stammen aus der Zeit selbst: Gegenstände, Bilder, Texte, Erzählungen.' },
      { f: 'Ein <b>Faustkeil</b> wird gefunden. Was kann er uns <b>nicht</b> verraten?', a: 'wie sein Besitzer hieß', x: ['woraus er gemacht ist', 'wie er bearbeitet wurde', 'wie groß er ist'], w: 'Ein Gegenstand spricht nicht. Namen, Gedanken und Gefühle der Menschen erfahren wir aus ihm nicht. Das sind die Grenzen einer Quelle.', svg: 'faustkeil' },
      { f: 'Wer gräbt alte Dinge aus und untersucht sie?', a: 'eine Archäologin oder ein Archäologe', x: ['eine Astronomin oder ein Astronom', 'eine Architektin oder ein Architekt', 'ein Bürgermeister'], w: 'Archäologen suchen und untersuchen Funde aus der Vergangenheit.' },
      { f: 'Warum sagt man: Geschichte ist eine <b>Rekonstruktion</b>?', a: 'Forscher setzen aus vielen Quellen ein Bild der Vergangenheit zusammen.', x: ['Weil man die Vergangenheit filmen kann.', 'Weil alle alten Häuser wieder aufgebaut werden.', 'Weil Geschichte nur erfunden ist.'], w: 'Wie bei einem Puzzle mit fehlenden Teilen: Man setzt zusammen, was die Quellen verraten. Manches bleibt Vermutung.' },
      { f: 'Wie heißt der Weg, auf dem eine Quelle bis zu uns gekommen ist?', a: 'Überlieferung', x: ['Übersetzung', 'Überschwemmung', 'Überschrift'], w: 'Manche Quellen liegen gut geschützt in einem <b>Archiv</b>, andere gehen verloren.' },
      { f: 'Was tut eine Historikerin <b>zuerst</b>, bevor sie Quellen sucht?', a: 'Sie stellt eine Frage an die Vergangenheit.', x: ['Sie schreibt das Buch.', 'Sie wirft alte Quellen weg.', 'Sie erfindet eine Geschichte.'], w: 'Frage stellen → Quellen suchen → Quellen auswerten → Ergebnis aufschreiben (Darstellung).' },
      { f: 'Zwei Forscher beschreiben dasselbe Ereignis verschieden. Wie nennt man ihre unterschiedliche Sichtweise?', a: 'Perspektive', x: ['Prospekt', 'Pyramide', 'Papyrus'], w: 'Jeder schaut mit eigenen Augen und Fragen. Neue Quellen können die Sicht auch ändern.' },
      { f: 'Dein erster Schultag gehört zu deiner …', a: '„kleinen“ Geschichte (deinem eigenen Leben)', x: ['„großen“ Geschichte (Weltgeschichte)', 'Urgeschichte', 'Mittelalter-Geschichte'], w: 'Jeder Mensch hat eine eigene kleine Geschichte. Sie ist ein Teil der großen Geschichte aller Menschen.' },
    ],
    T: [
      { f: 'Forscher, die alte Funde ausgraben, heißen ___.', a: ['Archäologen', 'Archäologinnen', 'Archäologe', 'Archäologin'], w: 'Archäologen graben aus, Historiker werten Quellen aus und schreiben darüber.' },
      { f: 'Ein Werkzeug aus der Vergangenheit ist eine ___ Quelle.', a: ['gegenständliche', 'Sachquelle'], w: 'Gegenstände heißen gegenständliche Quellen (man sagt auch Sachquellen).' },
      { f: 'Ein Brief aus der Vergangenheit ist eine ___ Quelle.', a: ['schriftliche', 'Textquelle'], w: 'Alles Geschriebene sind schriftliche Quellen.' },
      { f: 'Ein Ort, an dem alte Urkunden und Briefe sicher aufbewahrt werden, heißt ___.', a: ['Archiv', 'Archive'], w: 'Auch Familien haben oft ein kleines „Privatarchiv“: alte Fotos und Briefe.' },
      { f: 'Ein Schulbuchtext von heute über die Vergangenheit ist keine Quelle, sondern eine ___.', a: 'Darstellung', w: 'Darstellungen werden später gemacht und erklären die Vergangenheit.' },
    ],
    A: { w: ['Eine Quelle stammt aus der Zeit, über die sie etwas verrät.', 'Ein Gegenstand verrät nicht, was sein Besitzer dachte.', 'Auch Gebäude können Quellen sein.', 'Eine Rekonstruktionszeichnung ist eine Darstellung.'],
      f: ['Ein Schulbuchtext von heute ist eine Quelle aus der Steinzeit.', 'Eine gegenständliche Quelle ist immer ein Text.', 'Aus Quellen wissen wir alles ganz genau.', 'Mündliche Quellen gibt es aus der Steinzeit.'] },
  }, { sortieren: 34, frage: 30, tippen: 10, passtNicht: 10, aussage: 16 });

  // =====================================================
  // Bereich 01: Das Leben der Menschen in der Frühgeschichte (ANNO 1, S. 12–43; Lehrplan LB 2, erster Teil)
  // =====================================================
  const mensch = baue('g5-mensch', {
    h: 'Die ersten Menschen lebten in Afrika. Von dort zogen sie in die ganze Welt. Der heutige Mensch heißt Homo sapiens.',
    O: [{ t: 'Ordne nach der Zeit, wann sie zuerst auftraten: <b>die ältesten zuerst</b>.', items: ['Vormenschen wie „Lucy“', 'Homo habilis', 'Homo erectus', 'Homo sapiens'], n: 4,
      s1: 'Vom Vormenschen zum heutigen Menschen:', w: 'Lucy (vor etwa 3,2 Millionen Jahren) → Homo habilis (vor etwa 2,5 Millionen Jahren) → Homo erectus (vor etwa 2 Millionen Jahren) → Homo sapiens (vor über 150.000 Jahren).' },
      { t: 'Wo lebte der Jetztmensch (Homo sapiens) zuerst? Ordne nach der Zeit: <b>das Früheste zuerst</b>.', items: ['in Afrika', 'in Europa', 'in Australien (mit Booten über das Meer)', 'in Amerika'], s1: 'Von Afrika aus in die ganze Welt:', w: 'Afrika (vor über 150.000 Jahren) → Europa (vor etwa 40.000 Jahren). Australien erreichten Menschen nur mit Flößen oder Booten. Amerika kam zuletzt.' }],
    F: [
      { f: 'Auf welchem Kontinent lebten die <b>ersten Menschen</b>?', a: 'Afrika', x: ['Europa', 'Asien', 'Amerika'], w: 'Alle Funde, die älter als zwei Millionen Jahre sind, stammen aus Afrika.' },
      { f: 'Wie heißt der <b>heutige Mensch</b> mit seinem wissenschaftlichen Namen?', a: 'Homo sapiens', x: ['Homo erectus', 'Homo habilis', 'Neandertaler'], w: '„Homo sapiens“ heißt „vernunftbegabter“ oder „weiser Mensch“. Das sind wir.' },
      { f: 'Seit ungefähr wann gibt es den <b>Homo sapiens</b>, den Jetztmenschen?', a: 'seit über 150.000 Jahren', x: ['seit etwa 3000 Jahren', 'seit etwa 30 Millionen Jahren', 'seit etwa 300 Jahren'], w: 'Dein Buch nennt etwa 150.000 Jahre. Neuere Funde aus Marokko sind sogar rund 300.000 Jahre alt.' },
      { f: 'Was bedeutet „Homo <b>erectus</b>“?', a: 'aufgerichteter Mensch', x: ['begabter Mensch', 'weiser Mensch', 'starker Mensch'], w: 'Homo erectus lebte vor etwa 2 Millionen Jahren in Ostafrika und war schon so groß wie wir. Seine Spuren findet man fast auf der ganzen Welt.' },
      { f: 'Was bedeutet „Homo <b>habilis</b>“?', a: 'begabter (geschickter) Mensch', x: ['aufgerichteter Mensch', 'weiser Mensch', 'Mensch aus dem Tal'], w: 'Homo habilis stellte vor etwa 2,5 Millionen Jahren Werkzeuge bewusst her und trug sie mit sich. Ein Schimpanse nimmt nur zufällig einen Stock.' },
      { f: 'Welcher Frühmensch stellte den <b>Faustkeil</b> her?', a: 'Homo erectus', x: ['Lucy', 'Homo sapiens im Mittelalter', 'die alten Ägypter'], w: 'Der Faustkeil war ein großer Fortschritt: ein Werkzeug für viele Aufgaben.', svg: 'faustkeil' },
      { f: 'Wo lebten die <b>Neandertaler</b>?', a: 'in Europa und Westasien', x: ['nur in Amerika', 'nur in Australien', 'in Ägypten am Nil'], w: 'Benannt sind sie nach dem Neandertal bei Düsseldorf, wo J. C. Fuhlrott 1856 Knochen fand. Sie starben vor rund 40.000 Jahren aus.' },
      { f: 'Was zeigt, dass die Neandertaler <b>füreinander sorgten</b>?', a: 'Sie halfen Verletzten und bestatteten ihre Toten.', x: ['Sie bauten Krankenhäuser aus Stein.', 'Sie schrieben Briefe an Kranke.', 'Sie ließen Schwache sofort zurück.'], w: 'Man fand Knochen mit verheilten Brüchen und Gräber. Sie trugen auch Schmuck aus Bärenzähnen und konnten wohl sprechen.' },
      { f: 'Was macht den Menschen <b>besonders</b> (anders als Tiere)?', a: 'aufrechter Gang, Werkzeuge herstellen, Feuer nutzen, Sprache und Planen', x: ['nur dass er Fleisch isst', 'nur dass er in Gruppen lebt', 'nur dass er laufen kann'], w: 'Tiere haben einzelne dieser Fähigkeiten. Alle zusammen hat nur der Mensch.' },
      { f: 'Wie kamen die ersten Menschen nach <b>Australien</b>?', a: 'mit Flößen oder Booten über das Meer', x: ['zu Fuß über eine Brücke aus Eis', 'mit dem Flugzeug', 'gar nicht, sie lebten schon immer dort'], w: 'Zwischen den Inseln lagen tiefe Meeresrinnen. Darum sind das wohl die ältesten Hinweise auf Wasserfahrzeuge.' },
      { f: 'Eine Zeichnung von 1909 zeigt den Neandertaler gebückt und affenartig. Was weiß man heute?', a: 'Das war falsch: Er ging aufrecht und sah uns ziemlich ähnlich.', x: ['Die Zeichnung ist ganz richtig.', 'Neandertaler liefen auf allen vieren.', 'Neandertaler waren Riesen.'], w: 'Auch Rekonstruktionen sind Darstellungen. Mit neuen Funden ändert sich das Bild.' },
      { f: '„Lucy“ ist ein berühmter Fund. Was war Lucy?', a: 'ein Vormensch, etwa 3,2 Millionen Jahre alt', x: ['eine ägyptische Königin', 'eine Höhle in Frankreich', 'die erste Bäuerin in Sachsen'], w: 'Lucy wurde in Afrika gefunden. Sie konnte schon aufrecht gehen.' },
      { f: 'Ungefähr wann kam der <b>Homo sapiens nach Europa</b>?', a: 'vor etwa 40.000 Jahren', x: ['vor etwa 400 Jahren', 'vor etwa 4 Millionen Jahren', 'vor etwa 4000 Jahren'], w: 'Er traf dort auf die Neandertaler, die bald darauf ausstarben.' },
    ],
    T: [
      { f: 'Der heutige Mensch heißt Homo ___.', a: 'sapiens', w: 'Homo sapiens: der „vernunftbegabte Mensch“.' },
      { f: 'Die ersten Menschen lebten in ___.', a: 'Afrika', w: 'Von Afrika aus breiteten sich die Menschen über die Erde aus.' },
      { f: 'Homo erectus heißt übersetzt: der ___ Mensch.', a: ['aufgerichtete', 'aufrechte'], w: 'erectus = aufgerichtet.' },
      { f: 'Homo sapiens heißt übersetzt: der ___ Mensch.', a: ['weise', 'vernunftbegabte'], w: 'sapiens = weise. Das sind wir.' },
    ],
    A: { w: ['Die ersten Menschen lebten in Afrika.', 'Homo sapiens und Neandertaler lebten eine Zeit lang gleichzeitig.', 'Der Faustkeil ist ein Werkzeug des Homo erectus.'],
      f: ['Der Mensch stammt aus Europa.', 'Die Neandertaler leben heute noch.', 'Lucy war eine ägyptische Königin.', 'Homo sapiens gibt es erst seit 3000 Jahren.'] },
  }, { frage: 40, ordnen: 16, tippen: 18, aussage: 16 });

  const ALT_TIPP = 'In der Altsteinzeit (Paläolithikum) lebten die Menschen als Jäger und Sammler. Sie zogen den Tieren hinterher und wohnten in Zelten oder unter Felsüberhängen. Es war Eiszeit.';
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
      { f: 'Bis ungefähr wann dauerte die <b>Altsteinzeit</b>?', a: 'bis etwa 15.000 v. Chr.', x: ['bis etwa 1500 n. Chr.', 'bis etwa 150 v. Chr.', 'bis heute'], w: 'So steht es in den Fachbegriffen deines Buchs. Dann folgten Mittelsteinzeit und Jungsteinzeit.' },
      { f: 'Mit welcher Waffe traf ein Jäger am <b>weitesten</b>?', a: 'mit Pfeil und Bogen (bis etwa 50 m)', x: ['mit der Lanze (bis etwa 3 m)', 'mit dem Speer (bis etwa 15 m)', 'mit dem Faustkeil'], w: 'Lanze bis 3 m, Speer bis 15 m, Speerschleuder bis 30 m, Pfeil und Bogen bis 50 m. Je weiter, desto sicherer war die Jagd.', svg: 'bogen' },
      { f: 'Womit machten die Menschen <b>Feuer</b>?', a: 'Sie schlugen Feuerstein gegen Pyrit, die Funken fingen sie mit Zunderschwamm auf.', x: ['mit Streichhölzern', 'mit einer Lupe aus Glas', 'mit einem Feuerzeug aus Bronze'], w: 'Noch wichtiger war, ein Feuer nicht ausgehen zu lassen.' },
      { f: 'Man fand Muscheln aus dem Mittelmeer als Schmuck am Rhein. Was zeigt das?', a: 'Schon in der Altsteinzeit wurden Dinge über weite Strecken getauscht.', x: ['Am Rhein gab es ein Meer.', 'Die Muscheln sind von allein dorthin gewandert.', 'Es gab schon Schiffe auf dem Rhein.'], w: 'Auch Feuerstein aus Oberitalien fand man weit entfernt in Polen und Deutschland.' },
      { f: 'Wozu nutzten die Jäger ein <b>Rentier</b>?', a: 'Fleisch, Fell, Geweih, Knochen, Sehnen und sogar den Magen', x: ['nur zum Reiten', 'nur für das Fleisch', 'als Haustier im Stall'], w: 'Fast nichts wurde weggeworfen: Geweih und Knochen für Werkzeuge, Sehnen als Fäden, der Magen als Beutel.' },
      { f: 'Wer war für die Menschen der Altsteinzeit ein <b>Schamane</b>?', a: 'jemand, der mit den Geistern der Natur Kontakt aufnehmen sollte', x: ['der beste Jäger', 'ein Händler', 'der König der Horde'], w: 'Die Menschen glaubten an überirdische Kräfte. Man fand Masken aus Hirschschädeln und Amulette.' },
    ],
    T: [
      { f: 'Menschen ohne festen Wohnort nennt man ___.', a: ['Nomaden', 'Nomade'], w: 'Nomaden ziehen von Ort zu Ort.' },
      { f: 'Das Fachwort für Altsteinzeit ist ___.', a: 'Paläolithikum', w: 'Griechisch: palaios = alt, lithos = Stein. Jungsteinzeit heißt Neolithikum (neos = neu).' },
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
    h: 'In der Jungsteinzeit (Neolithikum) wurden die Menschen sesshaft: Sie bauten Getreide an, hielten Tiere, bauten Häuser und töpferten. Das begann vor etwa 11.000 Jahren im „Fruchtbaren Halbmond“ und kam später nach Mitteleuropa.',
    O: [{ t: 'Vom Feld zum Brot: Bringe die Arbeiten in die richtige Reihenfolge.', items: ['Feld anlegen und säen', 'Getreide mit der Sichel ernten', 'Körner auf dem Mahlstein mahlen', 'Fladenbrot backen'], s1: 'So kam das Brot auf den Tisch:', w: 'säen → ernten → mahlen → backen.' }],
    F: [
      { f: 'Was war die <b>größte Veränderung</b> in der Jungsteinzeit?', a: 'Die Menschen wurden sesshaft und lebten von Ackerbau und Viehzucht.', x: ['Die Menschen erfanden die Schrift.', 'Die Menschen bauten Pyramiden.', 'Die Menschen begannen zu jagen.'], w: 'Weil diese Veränderung so groß war, spricht man von der „Neolithischen Revolution“.' },
      { f: 'Wo begannen Menschen <b>zuerst</b> mit dem Ackerbau?', a: 'im „Fruchtbaren Halbmond“ im Vorderen Orient', x: ['in Sachsen', 'in Amerika', 'in Skandinavien'], w: 'Das Gebiet zwischen Mittelmeer und Persischem Golf (heute Syrien, Irak, Iran). Um 9000 v. Chr. bauten die Menschen dort Getreide und Hülsenfrüchte an.' },
      { f: 'Welches Tier war das <b>erste Haustier</b>?', a: 'der Hund', x: ['das Pferd', 'das Huhn', 'die Katze'], w: 'Den Hund zähmten Menschen schon vor etwa 14.000 Jahren. Später kamen Schaf, Ziege, Rind, Schwein und Pferd dazu.' },
      { f: 'Was heißt es, ein Tier zu <b>domestizieren</b>?', a: 'ein wildes Tier zähmen und als Haustier nutzen', x: ['ein Tier jagen', 'ein Tier malen', 'ein Tier in die Wildnis zurückbringen'], w: 'Aus Wildschafen und Wildziegen wurden so die ersten Nutztiere.' },
      { f: 'Welche Getreide bauten die ersten Bauern an?', a: 'Emmer, Einkorn und Gerste', x: ['Mais und Reis', 'Kartoffeln', 'Bananen'], w: 'Daraus machten sie Brot und Brei. Aus Lein gewannen sie Öl und Fasern.' },
      { f: 'Seit wann gibt es in Mitteleuropa den <b>Pflug</b>?', a: 'seit etwa 4500 v. Chr.', x: ['seit 1500 n. Chr.', 'seit der Altsteinzeit', 'seit 45 v. Chr.'], w: 'Der erste Pflug war aus Holz. Mit ihm wurde Getreide zum wichtigsten Nahrungsmittel.' },
      { f: 'Was heißt <b>Arbeitsteilung</b>?', a: 'Nicht jeder macht alles: Einige werden Töpfer, andere Bauern oder Weber.', x: ['Alle machen genau dasselbe.', 'Nur Kinder arbeiten.', 'Die Arbeit wird jeden Tag ausgelost.'], w: 'Weil es Vorräte gab, konnten sich Menschen auf ein Handwerk spezialisieren.' },
      { f: 'Mit welchen <b>W-Fragen</b> erschließt man einen Schulbuchtext?', a: 'Wer? Was? Wann? Wo? Wie? Warum? Wozu?', x: ['Nur: Wie spät ist es?', 'Wer hat das Buch gekauft?', 'Wie viele Seiten hat das Buch?'], w: 'Mit den sieben W-Fragen findest du das Wichtigste in einem Text.' },
      { f: 'Ungefähr wann kam die bäuerliche Lebensweise nach <b>Mitteleuropa</b>?', a: 'um 5500 v. Chr.', x: ['um 500 n. Chr.', 'um 1500 n. Chr.', 'um 55.000 v. Chr.'], w: 'Die ersten Bauern in Mitteleuropa nennt man nach ihren Gefäßen „Bandkeramiker“.' },
      { f: 'Welche Tiere hielten die ersten Bauern?', a: 'Schafe, Ziegen, Rinder und Schweine', x: ['Mammuts und Wollnashörner', 'Pferde für Autos', 'Löwen und Bären'], w: 'Aus wilden Tieren wurden über lange Zeit Haustiere.' },
      { f: 'Wie heißt dieses Gefäß nach seinem Muster?', a: 'Bandkeramik', x: ['Amphore', 'Kanope', 'Faustkeil'], w: 'Die Bänder sind eingeritzt. In Tongefäßen lagerte man Vorräte.', svg: 'topf' },
      { f: 'Wozu brauchten die Bauern dieses Werkzeug?', a: 'um Getreide zu ernten', x: ['um Tiere zu jagen', 'um Kleidung zu nähen', 'um Bilder zu malen'], w: 'Eine Sichel mit scharfen Klingen aus Feuerstein.', svg: 'sichel' },
      { f: 'Wozu diente dieses geschliffene Steinbeil?', a: 'um Bäume zu fällen und Holz zu bearbeiten', x: ['um Brot zu backen', 'um Fische zu fangen', 'um zu schreiben'], w: 'Für Häuser, Zäune und Brunnen brauchte man viel Holz.', svg: 'beil' },
      { f: 'Wie hießen die großen Häuser der ersten Bauern in Mitteleuropa?', a: 'Langhäuser', x: ['Pyramiden', 'Iglus', 'Burgen'], w: 'Sie waren oft über 20 Meter lang, mit Wänden aus Flechtwerk und Lehm.', svg: 'langhaus' },
      { f: 'Woraus machten die Bauern <b>Leinen</b> für Kleidung?', a: 'aus Lein (Flachs), den sie anbauten', x: ['aus Baumwolle aus Amerika', 'aus Plastik', 'aus Papyrus'], w: 'Aus den Fasern spannen sie Fäden und webten am Webstuhl Stoff. Aus den Samen gewannen sie Öl.' },
      { f: 'In Sachsen fand man über 7000 Jahre alte <b>Brunnen</b>. Woraus waren sie gebaut?', a: 'aus Holz', x: ['aus Beton', 'aus Bronze', 'aus Marmor'], w: 'Im Grundwasser blieb das Holz erhalten. Einer der bekanntesten ist der Brunnen von Altscherbitz bei Leipzig.' },
      { f: 'Was war eine <b>Folge</b> davon, dass die Menschen Vorräte und Felder hatten?', a: 'Es gab Besitz, und darum auch Streit.', x: ['Niemand musste mehr arbeiten.', 'Alle wurden Jäger.', 'Die Menschen zogen wieder umher.'], w: 'Wer Vorräte und Land besitzt, muss sie schützen. Es entstanden Zäune und manchmal Kämpfe.' },
    ],
    T: [
      { f: 'Menschen, die an einem festen Ort wohnen, nennt man ___.', a: 'sesshaft', w: 'Gegenteil: Nomaden.' },
      { f: 'Die Gefäße der ersten Bauern hatten Bandmuster. Man nennt sie ___.', a: ['Bandkeramik', 'Bandkeramiken'], w: 'Keramik = gebrannter Ton.', svg: 'topf' },
      { f: 'Die großen Häuser der ersten Bauern heißen ___.', a: ['Langhäuser', 'Langhaus'], w: 'Unter einem Dach war Platz für eine große Familie und Vorräte.', svg: 'langhaus' },
      { f: 'Getreide wurde auf einem ___ zu Mehl gemahlen.', a: 'Mahlstein', w: 'Ein flacher Stein und ein kleiner Läufer zum Reiben.', svg: 'mahlstein' },
      { f: 'Getreide anbauen nennt man ___.', a: 'Ackerbau', w: 'Ackerbau und Viehzucht: die zwei Grundlagen der Bauern.' },
      { f: 'Der große Wandel zum Bauernleben heißt Neolithische ___.', a: 'Revolution', w: 'Revolution heißt: grundlegender Wandel. Er dauerte aber Tausende Jahre.' },
    ],
    A: { w: ['In der Jungsteinzeit hielten die Menschen Haustiere.', 'Die ersten Bauern lagerten Vorräte in Tongefäßen.', 'Ackerbau begann zuerst im Fruchtbaren Halbmond.', 'Der Hund war das erste Haustier.'],
      f: ['In der Jungsteinzeit benutzten die Bauern Pflüge aus Eisen.', 'Die Jungsteinzeit kam um 1500 n. Chr. nach Sachsen.', 'Die ersten Bauern lebten in Zelten und zogen den Herden nach.'] },
  }, { frage: 40, tippen: 22, ordnen: 12, aussage: 14 });

  const AJ = ['Altsteinzeit', 'Jungsteinzeit'];
  const altjung = baue('g5-altjung', {
    h: 'Altsteinzeit: Jäger und Sammler, umherziehen, Zelte, Faustkeil, Eiszeit. Jungsteinzeit: Bauern, sesshaft, Häuser, Felder, Haustiere, Töpfe.',
    S: { kats: AJ, f: (x) => `Alt- oder Jungsteinzeit? <b>${x}</b>`, h: 'Ziehen die Menschen umher (alt) oder bleiben sie an einem Ort (jung)?',
      items: [['Jäger und Sammler', 0], ['Nomaden', 0, 'sie ziehen umher'], ['Zelte aus Fellen', 0], ['Faustkeil', 0], ['Höhlenmalerei', 0, 'in der Eiszeit'], ['Mammutjagd', 0], ['den Tierherden folgen', 0],
        ['sesshaft', 1], ['Ackerbau', 1], ['Viehzucht', 1], ['Langhaus', 1], ['Tongefäße für Vorräte', 1], ['geschliffenes Steinbeil', 1], ['Stoff aus Flachs weben', 1], ['Dörfer', 1], ['Holzbrunnen', 1]] },
    O: [{ t: 'Bringe die Zeitalter in die richtige Reihenfolge: <b>das älteste zuerst</b>.', items: ['Altsteinzeit', 'Mittelsteinzeit', 'Jungsteinzeit', 'Bronzezeit', 'Eisenzeit'], n: 4, s1: 'Vom Stein zum Metall:', w: 'Altsteinzeit → Mittelsteinzeit → Jungsteinzeit → Bronzezeit → Eisenzeit. Die Namen kommen vom wichtigsten Material für Werkzeuge.' }],
    F: [
      { f: 'Woher haben die Steinzeiten ihre Namen?', a: 'vom wichtigsten Material für Werkzeuge: Stein', x: ['von einem König namens Stein', 'von den Steinhäusern', 'von den Pyramiden'], w: 'Stein war das erste dauerhafte Material, aus dem Menschen Werkzeuge machten. Ähnlich bei Bronzezeit und Eisenzeit.' },
      { f: 'Wie heißen Alt- und Jungsteinzeit mit ihren <b>Fachwörtern</b>?', a: 'Paläolithikum und Neolithikum', x: ['Pharao und Pyramide', 'Polis und Poleis', 'Bronze und Eisen'], w: 'lithos = Stein, palaios = alt, neos = neu. Dazwischen liegt die Mittelsteinzeit (Mesolithikum).' },
      { f: 'Worin unterscheiden sich die Steinwerkzeuge der Jungsteinzeit oft von denen der Altsteinzeit?', a: 'Sie wurden geschliffen und glatt poliert.', x: ['Sie waren aus Eisen.', 'Sie waren aus Plastik.', 'Sie wurden nur geschlagen, nie geschliffen.'], w: 'Geschliffene Steinbeile waren besonders gut zum Bäume fällen.' },
      { f: 'Warum spricht man von der „Neolithischen <b>Revolution</b>“?', a: 'Weil sich die Lebensweise der Menschen völlig veränderte.', x: ['Weil es einen Aufstand gegen einen König gab.', 'Weil alles an einem einzigen Tag passierte.', 'Weil die Steine plötzlich jünger wurden.'], w: 'Revolution heißt hier: große Umwälzung. Sie dauerte aber Tausende Jahre.' },
    ],
    A: { w: ['In der Altsteinzeit zogen die Menschen umher, in der Jungsteinzeit wurden sie sesshaft.', 'Tongefäße gehören zur Jungsteinzeit.', 'Auf die Jungsteinzeit folgte die Bronzezeit.'],
      f: ['In der Altsteinzeit lebten die Menschen in Langhäusern.', 'Auf die Altsteinzeit folgte gleich die Eisenzeit.', 'In der Jungsteinzeit lebten die Menschen nur von der Jagd.'] },
  }, { sortieren: 44, passtNicht: 20, ordnen: 12, frage: 12, aussage: 12 });

  const metall = baue('g5-metall', {
    h: 'Zuerst nutzten die Menschen Kupfer. Mischt man Kupfer mit Zinn, entsteht die härtere Bronze. Weil man Kupfer und Zinn selten am selben Ort findet, wurde Handel wichtig.',
    O: [{ t: 'Wie entsteht ein Gegenstand aus Bronze? Bringe die Schritte in die richtige Reihenfolge.', items: ['Erz im Bergwerk abbauen', 'Kupfer und Zinn im heißen Feuer schmelzen', 'flüssiges Metall in eine Form gießen', 'abkühlen lassen und blank schleifen'], s1: 'Vom Gestein zum Werkzeug:', w: 'abbauen → schmelzen → gießen → schleifen.' }],
    F: [
      { f: 'Woraus besteht <b>Bronze</b>?', a: 'aus Kupfer und Zinn', x: ['aus Eisen und Gold', 'aus Stein und Holz', 'aus Silber und Ton'], w: '90 Prozent Kupfer und 10 Prozent Zinn. Bronze ist härter als Kupfer.' },
      { f: 'Welches Metall benutzten die Menschen <b>zuerst</b>?', a: 'Kupfer', x: ['Eisen', 'Aluminium', 'Stahl'], w: 'Schon Ötzi hatte ein Beil mit einer Klinge aus Kupfer.' },
      { f: 'Warum war Bronze besser als reines Kupfer?', a: 'Bronze ist härter.', x: ['Bronze ist weicher.', 'Bronze rostet sofort.', 'Bronze ist durchsichtig.'], w: 'Härtere Klingen bleiben länger scharf.' },
      { f: 'Warum wurde in der Bronzezeit der <b>Handel</b> so wichtig?', a: 'Kupfer und Zinn findet man selten am selben Ort.', x: ['Weil es schon Geldscheine gab.', 'Weil niemand mehr arbeiten wollte.', 'Weil Bronze überall auf dem Boden lag.'], w: 'Händler brachten die Metalle oft über weite Strecken.' },
      { f: 'Welcher <b>neue Beruf</b> entstand mit den Metallen?', a: 'Bronzegießer oder Schmied', x: ['Lokführer', 'Programmierer', 'Pilot'], w: 'Metall zu bearbeiten ist schwierig. Spezialisten taten nur noch das: Es gab mehr verschiedene Berufe.' },
      { f: 'Ungefähr wann begann in Mitteleuropa die <b>Bronzezeit</b>?', a: 'um 2000 v. Chr.', x: ['um 2000 n. Chr.', 'um 20.000 v. Chr.', 'um 200 n. Chr.'], w: 'In Ägypten, Kleinasien und im Zweistromland kannte man Bronze schon um 3000 v. Chr. Bis etwa 800 v. Chr. blieb sie der wichtigste Werkstoff.' },
      { f: 'Wie heiß muss es sein, damit Kupfer <b>flüssig</b> wird?', a: 'etwa 1100 Grad', x: ['etwa 100 Grad', 'etwa 40 Grad', 'etwa 11.000 Grad'], w: 'Im Ofen mit Holzkohle und einem Blasebalg wurde es so heiß. Zurück blieb die Schlacke.' },
      { f: 'Wer hatte mit dem Eisen eine <b>wichtige Stellung</b> im Dorf?', a: 'der Schmied', x: ['der Jäger', 'der Schreiber', 'der Hirte'], w: 'Eisen ist härter als Bronze. Aus ihm machte der Schmied Waffen und Pflüge für harte Böden.' },
      { f: 'Woraus ist dieses Schwert?', a: 'Bronze', x: ['Stein', 'Holz', 'Knochen'], w: 'Bronze glänzt goldbraun. Schwerter waren wertvoll und zeigten, wer reich war.', svg: 'schwert' },
      { f: 'Warum setzte sich später das <b>Eisen</b> durch?', a: 'Eisenerz findet man fast überall, und Eisen ist härter.', x: ['Eisen ist leichter zu schmelzen als alles andere.', 'Eisen glänzt schöner als Gold.', 'Eisen wächst an Bäumen.'], w: 'Das Erz wurde im Bergbau gewonnen und mit Holzkohle verhüttet.' },
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
      { f: 'Wo wurde Ötzi gefunden?', a: 'in einem Gletscher in den Alpen', x: ['in einer Pyramide', 'in einem Moor in Sachsen', 'in einer Höhle in Spanien'], w: 'In den Ötztaler Alpen, auf 3210 Metern Höhe, knapp auf der italienischen Seite der Grenze.' },
      { f: 'Wie alt wurde Ötzi ungefähr?', a: 'etwa 46 Jahre', x: ['etwa 16 Jahre', 'etwa 86 Jahre', 'etwa 146 Jahre'], w: 'Für seine Zeit war das schon ein hohes Alter. Seine Gelenke waren abgenutzt, er war etwa 1,60 m groß und wog um 50 kg.' },
      { f: 'Woran erkannten Forscher, dass Ötzi im <b>Frühjahr</b> starb?', a: 'an Blütenstaub (Pollen) in seinem Darm', x: ['an seinem Kalender', 'an seiner Sommerkleidung', 'an Schnee in seiner Tasche'], w: 'Bestimmte Pflanzen blühen nur im Frühjahr. Seine letzte Mahlzeit aß er höchstens eine Stunde vor dem Tod.' },
      { f: 'Wozu trug Ötzi ein Gefäß aus Birkenrinde?', a: 'um Glut für ein neues Feuer mitzunehmen', x: ['als Trinkbecher für Wein', 'als Helm', 'um Geld aufzubewahren'], w: 'So musste er nicht jedes Mal mühsam neues Feuer machen.' },
      { f: 'Was ist an Ötzis <b>Beil</b> einmalig?', a: 'Es ist das einzige vollständig erhaltene Beil aus so früher Zeit.', x: ['Es ist aus Gold.', 'Es ist das größte Beil der Welt.', 'Es hat einen Griff aus Plastik.'], w: 'Die Klinge ist aus gegossenem Kupfer, der Schaft aus Eibenholz.' },
      { f: 'Wie alt ist Ötzi ungefähr?', a: 'etwa 5300 Jahre', x: ['etwa 530 Jahre', 'etwa 53.000 Jahre', 'etwa 300.000 Jahre'], w: 'Er lebte um 3300 v. Chr., am Ende der Jungsteinzeit.' },
      { f: 'Warum ist Ötzi so gut erhalten?', a: 'Das Eis des Gletschers hat ihn tiefgefroren.', x: ['Er wurde wie eine ägyptische Mumie einbalsamiert.', 'Er lag in einem Museum.', 'Er war aus Stein.'], w: 'Auch Kleidung und Ausrüstung aus Leder, Fell, Holz und Gras blieben erhalten. Das ist sehr selten.' },
      { f: 'Woraus war die Klinge von Ötzis <b>Beil</b>?', a: 'Kupfer', x: ['Eisen', 'Stein', 'Gold'], w: 'Das Kupferbeil war wertvoll. Es half auch, Ötzis Alter zu bestimmen.' },
      { f: 'Warum nennt man Ötzi einen „Wanderer zwischen den Zeiten“?', a: 'Er lebte in der Steinzeit, besaß aber schon ein Beil aus Metall.', x: ['Er konnte durch die Zeit reisen.', 'Er wanderte von Ägypten nach Griechenland.', 'Er lebte 1000 Jahre lang.'], w: 'Er steht am Übergang von der Steinzeit zur Metallzeit.' },
      { f: 'Woran starb Ötzi?', a: 'Er wurde von einem Pfeil in die Schulter getroffen.', x: ['Er erfror ganz friedlich.', 'Ein Mammut trampelte ihn nieder.', 'Er stürzte von einer Pyramide.'], w: 'Auf Röntgenbildern entdeckte man 2001 eine Pfeilspitze in seiner linken Schulter. Eine Schnittwunde an der Hand zeigt: Er hatte vorher gekämpft.' },
      { f: 'Wo liegt Ötzi heute?', a: 'in einem Museum in Bozen (Südtirol), in einer Kühlkammer', x: ['im Landesmuseum in Halle', 'im Britischen Museum in London', 'wieder im Gletscher'], w: 'Seit 1998 kann man ihn dort durch ein kleines Fenster sehen.' },
      { f: 'Was hatte Ötzi <b>nicht</b> dabei?', a: 'ein Schwert aus Eisen', x: ['ein Beil mit Kupferklinge', 'einen Bogen und Pfeile', 'einen Dolch aus Feuerstein'], w: 'Eisen kam erst über 2000 Jahre später nach Mitteleuropa.' },
      { f: 'Woher hat Ötzi seinen Namen?', a: 'von den Ötztaler Alpen, wo er gefunden wurde', x: ['von seinem echten Namen', 'von einem Forscher namens Ötzi', 'von einem Lied'], w: 'Wie er wirklich hieß, verrät uns keine Quelle.' },
      { f: 'Man fand auf Ötzis Haut viele Striche und Kreuze. Was sind sie?', a: 'Tätowierungen', x: ['Kratzer vom Eis', 'Bemalung von Forschern', 'Schriftzeichen'], w: 'Es sind über 50. Viele liegen an Stellen, an denen man heute bei Schmerzen behandelt. Vielleicht eine frühe Schmerztherapie?' },
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
      { f: 'Woraus besteht die Himmelsscheibe von Nebra?', a: 'aus Bronze mit Gold', x: ['aus Stein mit Farbe', 'aus Eisen mit Silber', 'aus Ton mit Glas'], w: 'Die Scheibe ist etwa 32 Zentimeter groß, nur 2 bis 4 Millimeter dick und wiegt rund 2 Kilogramm.' },
      { f: 'Was bedeuten die goldenen <b>Bögen am Rand</b>?', a: 'den Horizont: wo die Sonne im Sommer und im Winter auf- und untergeht', x: ['zwei Regenbögen', 'die Ufer der Elbe', 'Mauern einer Burg'], w: 'Ein Bogen fehlt heute. Unten liegt ein weiterer gekrümmter Bogen: vielleicht ein „Sonnenschiff“.' },
      { f: 'Sieben Punkte liegen eng zusammen. Was zeigen sie vermutlich?', a: 'die Plejaden (das Siebengestirn)', x: ['sieben Planeten', 'die Tage einer Woche', 'sieben Könige'], w: 'Diesen Sternhaufen sieht man im Frühjahr und Herbst gut: wichtige Zeiten für Bauern.' },
      { f: 'Wo wurde in <b>Sachsen</b> mitgeprüft, ob die Scheibe echt ist?', a: 'an der Bergakademie Freiberg', x: ['an der Semperoper Dresden', 'im Leipziger Zoo', 'gar nicht'], w: 'Forscher untersuchten zum Beispiel, woher das Metall stammt.' },
      { f: 'Was ist auf der Scheibe zu sehen?', a: 'Sonne oder Vollmond, Mondsichel und Sterne', x: ['ein Pharao auf seinem Thron', 'eine Landkarte von Europa', 'Tiere aus der Eiszeit'], w: 'Sie gilt als die älteste bekannte Darstellung des Himmels mit echten Himmelserscheinungen.' },
      { f: 'Wo wurde die Himmelsscheibe gefunden?', a: 'auf dem Mittelberg bei Nebra in Sachsen-Anhalt', x: ['in einer Pyramide in Ägypten', 'in Dresden an der Elbe', 'in einer Höhle in Frankreich'], w: 'Nebra liegt nicht weit von Sachsen entfernt.' },
      { f: 'Wer hat die Scheibe 1999 ausgegraben?', a: 'Raubgräber mit einem Metallsuchgerät', x: ['Archäologen einer Universität', 'Schulkinder beim Ausflug', 'Ein Bauer beim Pflügen'], w: 'Sie gruben verboten und verkauften den Fund. 2002 stellte die Polizei in einem Hotel in der Schweiz eine Falle: Beamte gaben sich als Käufer aus.' },
      { f: 'Wie alt ist die Himmelsscheibe ungefähr?', a: 'etwa 3600 Jahre', x: ['etwa 360 Jahre', 'etwa 36.000 Jahre', 'etwa 36 Jahre'], w: 'Sie stammt aus der Bronzezeit. Über das genaue Alter streiten Forscher.' },
      { f: 'Wo kann man die Himmelsscheibe heute sehen?', a: 'im Landesmuseum für Vorgeschichte in Halle (Saale)', x: ['im Museum in Bozen', 'im Britischen Museum in London', 'in der Pyramide von Gizeh'], w: 'Das Original liegt in Halle. Nahe dem Fundort steht das Besucherzentrum „Arche Nebra“, auf dem Mittelberg ein Aussichtsturm.' },
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
      { f: 'Was gäbe es in Ägypten <b>ohne</b> den Nil?', a: 'fast nur Wüste', x: ['dichten Urwald', 'viele Seen', 'Gletscher'], w: 'Ägypten ist zu 95 Prozent Wüste. Der Grieche Herodot nannte das Land darum ein „Geschenk des Nils“.' },
      { f: 'Welche zwei Flüsse treffen sich zum Nil?', a: 'der Blaue Nil und der Weiße Nil', x: ['der Rote Nil und der Grüne Nil', 'Elbe und Moldau', 'Euphrat und Tigris'], w: 'Der Blaue Nil kommt aus dem Hochland von Äthiopien, der Weiße Nil aus dem Viktoriasee. Bei Khartum (Sudan) fließen sie zusammen.' },
      { f: 'In welchen Monaten war der Nil über die Ufer getreten?', a: 'etwa von Juli bis Oktober', x: ['von Dezember bis Februar', 'nur im April', 'das ganze Jahr'], w: 'Die Dörfer lagen darum etwas höher. Danach säten die Bauern in den Schlamm.' },
      { f: 'Woran erkannten die Ägypter, dass das <b>neue Jahr</b> begann?', a: 'am ersten Aufgang des Sterns Sirius, kurz bevor der Nil stieg', x: ['am ersten Schnee', 'am Geburtstag des Pharaos', 'an der ersten Ernte'], w: 'Aus der Beobachtung der Sterne entstand ihr Kalender.' },
      { f: 'Warum bringt der Nil heute <b>keinen Schlamm</b> mehr auf die Felder?', a: 'Der Assuan-Staudamm hält ihn im Stausee zurück.', x: ['Der Nil ist ausgetrocknet.', 'Der Pharao hat es verboten.', 'Es regnet zu viel.'], w: 'Den Damm baute man in den 1960er-Jahren. Heute düngen die Bauern mit Kunstdünger.' },
      { f: 'Wie lang ist der Nil ungefähr?', a: 'etwa 6800 Kilometer', x: ['etwa 68 Kilometer', 'etwa 680 Kilometer', 'etwa 68.000 Kilometer'], w: 'Er gehört zu den längsten Flüssen der Erde.' },
    ],
    T: [
      { f: 'Der Nil fließt ins ___.', a: 'Mittelmeer', w: 'Vorher teilt er sich in viele Arme: das Nildelta.', svg: 'nilkarte' },
      { f: 'Herodot nannte Ägypten ein „Geschenk des ___“.', a: ['Nils', 'Nil', 'Niles'], w: 'Ohne den Fluss gäbe es dort nur Wüste.' },
      { f: 'Die Zeit der Überschwemmung hieß ___.', a: 'Achet', w: 'Achet (Überschwemmung), Peret (Aussaat), Schemu (Ernte).' },
      { f: 'Die Ägypter nannten ihr fruchtbares Land Kemet, das ___ Land.', a: 'Schwarze', w: 'Nach dem dunklen Schlamm des Nils.' },
    ],
    A: { w: ['Der Nil fließt von Süden nach Norden.', 'Unterägypten liegt im Norden.', 'Die Überschwemmung brachte fruchtbaren Schlamm.'], f: ['Unterägypten liegt im Süden.', 'In Ägypten regnet es sehr viel.', 'Die Überschwemmung war für die Bauern nur schlecht.'] },
  }, { frage: 46, tippen: 16, ordnen: 16, aussage: 14 });

  const staat = baue('g5-staat', {
    h: 'Um 3100 v. Chr. vereinte König Narmer Ober- und Unterägypten zu einem Reich. An der Spitze stand der Pharao. Beamte zählten Vorräte, sammelten Abgaben und planten Bauten.',
    F: [
      { f: 'Ungefähr wann wurden Ober- und Unterägypten <b>ein Reich</b>?', a: 'um 3100 v. Chr.', x: ['um 3100 n. Chr.', 'um 310 v. Chr.', 'um 31.000 v. Chr.'], w: 'Der Oberägypter Narmer siegte und wurde der erste König von ganz Ägypten.' },
      { f: 'Wer war der <b>erste König</b> von ganz Ägypten?', a: 'Narmer', x: ['Tutanchamun', 'Ramses II.', 'Cheops'], w: 'Auf einer Schminkpalette aus Stein (um 3000 v. Chr.) sieht man ihn mit der Krone Oberägyptens, wie er einen Feind erschlägt.' },
      { f: 'Was war die wichtigste Aufgabe des Pharaos nach dem Glauben der Ägypter?', a: 'die Maat zu bewahren: Ordnung und Gerechtigkeit', x: ['möglichst viele Pyramiden zu besteigen', 'jeden Tag zu jagen', 'die Steuern abzuschaffen'], w: 'Er sollte das Chaos fernhalten. Dazu war er Gesetzgeber, Heerführer und Vermittler zwischen Menschen und Göttern.' },
      { f: 'Wie nennt man die Herrschaft eines <b>Einzelnen</b>, die in der Familie weitergegeben wird?', a: 'Monarchie', x: ['Demokratie', 'Polis', 'Hieroglyphe'], w: 'Das Wort ist griechisch und heißt Alleinherrschaft.' },
      { f: 'Wofür stand der <b>Krummstab</b> des Pharaos?', a: 'für seine Herrschaft, wie ein Hirte über seine Herde', x: ['für das Wandern', 'für die Jagd', 'für das Schreiben'], w: 'Zu seinen Zeichen gehörten auch die Geißel (ein Wedel), das Kopftuch, die Kobra an der Stirn und ein künstlicher Bart.' },
      { f: 'Ramses II. wurde fast 90 Jahre alt. Wie alt wurden die meisten Ägypter?', a: 'im Durchschnitt nicht älter als 35 Jahre', x: ['auch etwa 90 Jahre', 'über 100 Jahre', 'etwa 10 Jahre'], w: 'Ramses regierte so lange, dass viele Ägypter nie einen anderen Pharao erlebten.' },
      { f: 'Warum wurde der Tempel von <b>Abu Simbel</b> in den 1960er-Jahren zersägt?', a: 'Er wurde Stück für Stück 65 m höher wieder aufgebaut, damit der Assuan-Stausee ihn nicht überflutet.', x: ['Man wollte ihn verkaufen.', 'Er war eingestürzt.', 'Man suchte darin einen Schatz.'], w: 'Vor dem Felsentempel sitzen vier 20 m hohe Figuren von Ramses II.' },
      { f: 'Warum brauchten die Menschen am Nil einen <b>Staat</b>?', a: 'Kanäle, Deiche und Vorräte mussten für alle geplant werden.', x: ['Damit sie Fußball spielen konnten.', 'Weil sie keine Bauern mehr brauchten.', 'Damit niemand mehr arbeiten musste.'], w: 'Ein Dorf allein kann keinen langen Kanal bauen. Jemand musste die Arbeit vieler Menschen lenken.' },
      { f: 'Was bedeutet das Wort „<b>Pharao</b>“ ursprünglich?', a: '„großes Haus“', x: ['„Sohn des Nils“', '„König der Wüste“', '„Herr der Pyramiden“'], w: 'Zuerst meinte man damit den Palast, später den König selbst.' },
      { f: 'Als was sahen die Ägypter ihren <b>Pharao</b>?', a: 'als Mensch in einem göttlichen Amt: Sohn des Sonnengottes, Wiedergeburt des Horus', x: ['als gewählten Bürgermeister', 'als einfachen Bauern', 'als Fremden aus Griechenland'], w: 'Das Königsamt galt als göttlich, der König selbst blieb ein Mensch. Er herrschte unumschränkt.' },
      { f: 'Wer war der <b>höchste Beamte</b> nach dem Pharao?', a: 'der Wesir', x: ['der Schreiber', 'der Händler', 'der Bauer'], w: 'Der Wesir leitete die Verwaltung für den Pharao.' },
      { f: 'Was taten die <b>Beamten</b> des Pharaos?', a: 'Sie zählten Ernten, sammelten Abgaben und planten Bauten.', x: ['Sie jagten Mammuts.', 'Sie verkauften Autos.', 'Sie bauten allein die Pyramiden.'], w: 'Ohne Beamte, die schreiben und rechnen konnten, hätte der Staat nicht funktioniert.' },
      { f: 'Womit bezahlten die Bauern ihre <b>Abgaben</b>?', a: 'mit einem Teil ihrer Ernte', x: ['mit Geldscheinen', 'mit Kreditkarten', 'mit Goldmünzen aus Athen'], w: 'Das Getreide kam in große Speicher. In schlechten Jahren verteilte man es wieder.' },
      { f: 'Was zeigte die <b>Doppelkrone</b> des Pharaos?', a: 'dass er über Ober- und Unterägypten herrschte', x: ['dass er zwei Köpfe hatte', 'dass er zweimal gewählt wurde', 'dass er zwei Pyramiden besaß'], w: 'Die weiße Krone stand für Oberägypten, die rote für Unterägypten.' },
      { f: 'Welcher Pharao wurde durch sein fast unberührtes Grab mit der <b>goldenen Maske</b> berühmt?', a: 'Tutanchamun', x: ['Cheops', 'Alexander', 'Ötzi'], w: 'Howard Carter entdeckte sein Grab 1922 im Tal der Könige.' },
      { f: '<b>Hatschepsut</b> war etwas Besonderes, weil …', a: 'sie als Frau Pharao war.', x: ['sie die Pyramiden erfand.', 'sie die Hieroglyphen entzifferte.', 'sie aus Sparta kam.'], w: 'Zuerst regierte sie für ihren jungen Neffen Thutmosis III., dann selbst. Sie ließ sich wie ein Mann darstellen, mit Bart.' },
    ],
    T: [
      { f: 'Der König der Ägypter hieß ___.', a: 'Pharao', w: 'Er galt als Gott auf Erden.' },
      { f: 'Der höchste Beamte nach dem Pharao hieß ___.', a: 'Wesir', w: 'Er leitete die Verwaltung.' },
      { f: 'Die weiße Krone stand für Oberägypten, die rote für ___.', a: 'Unterägypten', w: 'Zusammen bilden sie die Doppelkrone. Die Wappenpflanze Oberägyptens war der Lotus, die Unterägyptens der Papyrus.' },
      { f: 'Die Ordnung und Gerechtigkeit, die der Pharao bewahren sollte, hieß ___.', a: 'Maat', w: 'Maat war auch eine Göttin mit einer Feder auf dem Kopf.' },
    ],
    A: { w: ['Der Pharao galt als Gott.', 'Beamte zählten die Ernte.', 'Die Bauern gaben einen Teil ihrer Ernte ab.'], f: ['Die Ägypter wählten ihren Pharao alle vier Jahre.', 'Die Bauern zahlten mit Geldscheinen.', 'Ägypten hatte keine Beamten.'] },
  }, { frage: 50, tippen: 22, aussage: 18 });

  // ---------- Gesellschaftspyramide ----------
  // Wie im Buch (S. 60–63, 81): Pharao, Beamte und Priester, Handwerker (Künstler, Soldaten), Bauern. Sklaven gab es in Ägypten kaum.
  const GP = ['Pharao', 'Wesir', 'Beamte (Schreiber) und Priester', 'Handwerker, Künstler, Soldaten', 'Bauern'];
  const GP_TIPP = 'Ganz oben der Pharao, dann der Wesir, dann Beamte (Schreiber) und Priester, dann Handwerker, Künstler und Soldaten, ganz unten die vielen Bauern.';
  function gpHoeher() {
    let a, b; do { a = R(0, GP.length - 1); b = R(0, GP.length - 1); } while (a === b);
    const ch = [GP[a], GP[b]], ok = Math.min(a, b);
    return { prompt: 'Wer stand in der Gesellschaftspyramide <b>weiter oben</b>?', choices: ch, correct: ch.indexOf(GP[ok]), hint: GP_TIPP,
      solution: `<b>${GP[ok]}</b> stand weiter oben als ${GP[Math.max(a, b)]}.`,
      ex: { mode: 'pyramide', art: 'gpHoeher', stufen: GP, hell: [ok, Math.max(a, b)], merk: `<b>${GP[ok]}</b> steht weiter oben.` } };
  }
  function gpOrdnen() {
    const idx = shuffle([0, 1, 2, 3, 4]).slice(0, 4).sort((a, b) => a - b), teile = idx.map((i) => GP[i]);
    return { prompt: 'Ordne die Gruppen wie in der Pyramide: <b>von oben nach unten</b>.', order: { words: mische(teile), answer: teile.join(' '), end: '' }, hint: GP_TIPP,
      solution: teile.map((x, k) => `${k + 1}. ${x}`).join('<br>'),
      ex: { mode: 'pyramide', art: 'gpOrdnen', stufen: GP, hell: idx, merk: `Von oben nach unten: <b>${teile.join(' → ')}</b>` } };
  }
  function gpWer() {
    const L = [[0, 'herrschte unumschränkt und hatte die höchste Macht'], [1, 'leitete als Regierungschef die Verwaltung für den König'], [2, 'konnte lesen und schreiben, trieb Steuern ein oder diente im Tempel'], [3, 'arbeitete in den Werkstätten von Tempel und König oder diente im Heer'], [4, 'bestellte die Felder und gab einen Teil der Ernte ab']];
    const [k, t] = pick(L), ch = shuffle([k, ...shuffle([0, 1, 2, 3, 4].filter((x) => x !== k)).slice(0, 3)]);
    return { prompt: `Wer … <b>${t}</b>?`, choices: ch.map((i) => GP[i]), correct: ch.indexOf(k), hint: GP_TIPP, solution: `<b>${GP[k]}</b>: ${t}.`,
      ex: { mode: 'pyramide', art: 'gpWer', stufen: GP, hell: [k], merk: `<b>${GP[k]}</b> ${t}.` } };
  }
  const gesellschaft = baue('g5-gesellschaft', {
    h: GP_TIPP,
    F: [
      { f: 'Warum hat man die Gesellschaft Ägyptens als <b>Pyramide</b> gezeichnet?', a: 'Oben standen wenige Mächtige, unten sehr viele einfache Menschen.', x: ['Weil alle in Pyramiden wohnten.', 'Weil alle gleich viel zu sagen hatten.', 'Weil die Ägypter gern zeichneten.'], w: 'Die Breite einer Stufe zeigt: Wie viele Menschen gehörten dazu? Die Höhe zeigt: Wie viel Macht hatten sie?' },
      { f: 'Welche Gruppe war die <b>größte</b>?', a: 'die Bauern', x: ['die Pharaonen', 'die Priester', 'die Schreiber'], w: 'Die allermeisten Ägypter waren Bauern. Ihre Ernte ernährte alle anderen.' },
      { f: 'Warum hatten <b>Schreiber</b> ein gutes Leben?', a: 'Nur wenige konnten schreiben. Sie arbeiteten für den Staat und mussten keine schwere Arbeit tun.', x: ['Sie bekamen jeden Tag Gold.', 'Sie mussten nie etwas tun.', 'Sie bekamen Geldscheine.'], w: 'Ein Schreiber war fast dasselbe wie ein Beamter. Bezahlt wurde mit Getreide und manchmal mit Land.' },
      { f: 'Konnte ein Bauer in Ägypten leicht in eine höhere Gruppe aufsteigen?', a: 'Nein, fast immer blieb man in der Gruppe seiner Eltern.', x: ['Ja, jeder wurde einmal Pharao.', 'Ja, man wurde jedes Jahr neu eingeteilt.', 'Ja, durch ein Wettrennen.'], w: 'Meist ergriff der Sohn den Beruf des Vaters. Nur selten gelang ein Aufstieg, etwa durch die Schreiberschule.' },
      { f: 'Gab es im alten Ägypten viele <b>Sklaven</b>?', a: 'Nein, kaum. Auch die Pyramiden bauten keine Sklaven.', x: ['Ja, die meisten Ägypter waren Sklaven.', 'Ja, nur Sklaven bauten die Pyramiden.', 'Ja, jeder Bauer hatte zehn Sklaven.'], w: 'Filme zeigen es oft falsch. Schwere Arbeit in Steinbrüchen machten Kriegsgefangene oder verurteilte Verbrecher.' },
      { f: 'Was passierte einem Bauern, der seine <b>Abgaben</b> nicht schaffte?', a: 'Er wurde oft mit Stockschlägen bestraft.', x: ['Er bekam einen Orden.', 'Er durfte Pharao werden.', 'Nichts, Abgaben waren freiwillig.'], w: 'Die meisten Bauern hatten ihr Land nur gepachtet, von König, Tempel oder hohen Beamten.' },
      { f: 'Was durften Frauen im alten Ägypten?', a: 'eigenen Besitz haben, erben und vor Gericht gehen', x: ['gar nichts außer kochen', 'nur mit dem Mann aus dem Haus', 'nicht arbeiten'], w: 'Ganz gleichgestellt waren sie nicht, aber sie hatten viele Rechte. Sie arbeiteten zum Beispiel als Hebammen, Weberinnen oder Priesterinnen.' },
      { f: 'Ein alter Text lobt den Beruf des Schreibers und macht alle anderen Berufe schlecht. Warum sollte man ihm nicht alles glauben?', a: 'Ein Vater wollte damit seinen Sohn überreden, Schreiber zu werden.', x: ['Weil er auf Griechisch ist.', 'Weil Schreiber nie gelebt haben.', 'Weil er erst gestern geschrieben wurde.'], w: 'Bei jeder Quelle fragt man: Was wollte der Verfasser erreichen? (Lehre des Cheti, um 1800 v. Chr.)' },
      { f: 'Wo arbeiteten die Bauern während der <b>Nilüberschwemmung</b>?', a: 'auf den großen Baustellen des Staates, etwa an Tempeln und Pyramiden', x: ['auf ihren Feldern unter Wasser', 'gar nicht, sie hatten Ferien in Griechenland', 'als Fischer auf dem Meer'], w: 'Monatelang standen die Felder unter Wasser.' },
    ],
    extra: { gpHoeher, gpOrdnen, gpWer },
  }, { gpHoeher: 26, gpOrdnen: 22, gpWer: 30, frage: 22 });

  const schrift = baue('g5-schrift', {
    h: 'Die Schrift der Ägypter heißt Hieroglyphen. Die ersten Schriftzeichen entstanden um 3400 v. Chr. Schreiber schrieben auf Papyrus. 1822 gelang es Champollion, sie zu entziffern.',
    F: [
      { f: 'Wie heißt die Schrift der alten Ägypter?', a: 'Hieroglyphen', x: ['Keilschrift', 'Runen', 'Druckbuchstaben'], w: 'Das Wort ist griechisch und bedeutet „heilige eingeritzte Zeichen“. Im Alltag schrieb man eine schnellere Schreibschrift auf Papyrus.' },
      { f: 'Woraus machten die Ägypter ihr „Papier“?', a: 'aus der Papyruspflanze', x: ['aus Baumrinde', 'aus Plastik', 'aus Tierhäuten von Mammuts'], w: 'Die Stängel wurden in Streifen geschnitten, kreuzweise gelegt und gepresst. Von „Papyrus“ kommt unser Wort „Papier“.', svg: 'papyrus' },
      { f: 'Wer konnte im alten Ägypten schreiben?', a: 'nur wenige, vor allem Schreiber und Priester', x: ['alle Kinder ab 6 Jahren', 'nur die Bauern', 'niemand'], w: 'Schreiben lernen dauerte viele Jahre. Wer es konnte, hatte einen angesehenen Beruf.' },
      { f: 'Was ist eine <b>Kartusche</b>?', a: 'ein Oval um den Namen eines Pharaos', x: ['ein Schreibstift', 'eine Krone', 'ein Grab'], w: 'Königsnamen wurden eingerahmt. Das half später beim Entziffern.' },
      { f: 'Wer hat die Hieroglyphen <b>entziffert</b>?', a: 'Jean-François Champollion', x: ['Howard Carter', 'Alexander der Große', 'Kleisthenes'], w: 'Der Franzose schaffte es 1822. Er fand heraus, dass viele Zeichen für Laute stehen.' },
      { f: 'Was half Champollion beim Entziffern?', a: 'der Stein von Rosette mit demselben Text in drei Schriften', x: ['ein Wörterbuch aus Ägypten', 'ein Brief des Pharaos an ihn', 'ein Film über Ägypten'], w: 'Auf dem Stein steht derselbe Text in Hieroglyphen, in Demotisch und in Griechisch. Griechisch konnte man lesen.' },
      { f: 'Wann wurde der <b>Stein von Rosette</b> gefunden?', a: '1799', x: ['1922', '1991', '776 v. Chr.'], w: 'Französische Soldaten fanden ihn im Nildelta. Heute steht er im Britischen Museum in London.' },
      { f: 'Stehen Hieroglyphen nur für ganze Wörter?', a: 'Nein, viele Zeichen stehen für Laute, andere für ganze Wörter.', x: ['Ja, jedes Zeichen ist ein ganzes Wort.', 'Ja, und es gibt genau 26 Zeichen.', 'Nein, sie sind nur Bilder ohne Bedeutung.'], w: 'Diese Mischung war lange das große Rätsel.' },
      { f: 'In welche Richtung liest man Hieroglyphen?', a: 'Dorthin, woher die Gesichter der Menschen und Tiere schauen: zum Zeilenanfang.', x: ['immer von links nach rechts', 'immer von unten nach oben', 'kreuz und quer'], w: 'Man konnte von rechts, von links oder von oben nach unten schreiben. Die Figuren zeigen den Anfang.' },
      { f: 'Ungefähr wann entstanden in Ägypten die <b>ersten Schriftzeichen</b>?', a: 'um 3400 v. Chr.', x: ['um 340 n. Chr.', 'um 34.000 v. Chr.', 'um 1822'], w: 'Noch bevor Ägypten ein Reich wurde.' },
      { f: 'Wie viele verschiedene Hieroglyphen gab es ungefähr?', a: 'über 700', x: ['26', 'genau 100', 'über 7 Millionen'], w: 'Darum brauchte man viele Jahre, um sie zu lernen.' },
      { f: 'Welche <b>Laute</b> schrieben die Ägypter mit ihren Lautzeichen?', a: 'nur die Konsonanten, die Vokale ergänzte man beim Lesen', x: ['nur die Vokale', 'alle Buchstaben wie wir', 'gar keine Laute'], w: 'Wie heute im Arabischen. Darum weiß man oft nicht genau, wie ein Name klang.' },
      { f: 'Wozu diente ein <b>Deutzeichen</b> am Ende eines Wortes?', a: 'Es zeigte, was gemeint ist, zum Beispiel „Mann“, „Frau“ oder „Wasser“.', x: ['Es zeigte das Ende des Buches.', 'Es war nur Schmuck.', 'Es stand für die Zahl zehn.'], w: 'Bildzeichen stehen für ein Ding, Lautzeichen für Laute, Deutzeichen erklären, was gemeint ist.' },
      { f: 'Gab es für Hieroglyphen eine <b>Rechtschreibung</b>?', a: 'Nein: Richtig war, was schön aussah.', x: ['Ja, mit strengen Regeln wie heute.', 'Ja, aber nur für Zahlen.', 'Ja, der Pharao prüfte jeden Text.'], w: 'Die Zeichen wurden so angeordnet, dass ein schönes Bild entstand.' },
      { f: 'Warum brauchte der Staat <b>Schrift</b>?', a: 'um Ernten, Abgaben und Vorräte aufzuschreiben', x: ['um Romane zu verkaufen', 'um im Internet zu schreiben', 'weil die Bauern Briefe schreiben wollten'], w: 'Beamte mussten sich viel merken. Mit Schrift ging nichts verloren.' },
    ],
    T: [
      { f: 'Die Schrift der Ägypter heißt ___.', a: ['Hieroglyphen', 'Hieroglyphe'], w: '„Heilige Zeichen“.' },
      { f: 'Geschrieben wurde auf ___ aus einer Pflanze vom Nil.', a: 'Papyrus', w: 'Daher kommt unser Wort „Papier“.', svg: 'papyrus' },
      { f: 'Wer im Auftrag des Staates schrieb, war ein ___.', a: 'Schreiber', w: 'Ein angesehener Beruf.' },
      { f: 'Die Hieroglyphen wurden im Jahr ___ entziffert.', a: '1822', w: 'Von Jean-François Champollion.' },
      { f: 'Das Oval um einen Königsnamen heißt ___.', a: ['Kartusche', 'Kartuschen'], w: 'Ein „Zierrahmen“. Mit den Namen Ptolemäus und Kleopatra fand Champollion die ersten Laute.' },
    ],
    A: { w: ['Hieroglyphen bedeutet „heilige Zeichen“.', 'Der Stein von Rosette hat drei Schriften.', 'Nur wenige Ägypter konnten schreiben.'], f: ['Alle Ägypter konnten lesen und schreiben.', 'Hieroglyphen haben genau 26 Zeichen.', 'Den Stein von Rosette fand man 1991.'] },
  }, { frage: 46, tippen: 22, aussage: 16 });

  const GOETTER_AG = [
    // die neun Götter aus dem Buch (S. 64–65)
    ['Re', 'Sonnengott', 'mit Falken- oder Widderkopf und Sonnenscheibe'], ['Osiris', 'Herrscher des Totenreichs und Richter im Totengericht', 'als Mumie mit Krummstab und Wedel'], ['Isis', 'mächtige Zauberin, Frau des Osiris', 'mit einem Thron-Zeichen auf dem Kopf'],
    ['Horus', 'Himmels- und Königsgott, der Pharao gilt als seine Wiedergeburt', 'mit Falkenkopf'], ['Anubis', 'Gott der Mumifizierung', 'mit dem Kopf eines Schakals'], ['Thot', 'Gott der Schreibkunst und der Weisheit', 'mit dem Kopf eines Ibis (eines Vogels)'],
    ['Maat', 'Göttin der Ordnung und Gerechtigkeit', 'als Frau mit einer Straußenfeder auf dem Kopf'], ['Amun', 'König der Götter, „der Verborgene“', 'als Mann mit hoher Federkrone'], ['Hathor', 'Muttergöttin, Göttin der Liebe und Fruchtbarkeit', 'mit Kuhhörnern oder als Kuh'],
  ];
  function agGott() {
    const g = pick(GOETTER_AG), fragGott = Math.random() < 0.5, andere = shuffle(GOETTER_AG.filter((x) => x !== g)).slice(0, 3), ch = shuffle([g, ...andere]);
    if (fragGott) return { prompt: `Welcher Gott oder welche Göttin ist das? <b>${g[1]}</b>, dargestellt ${g[2]}.`, choices: ch.map((x) => x[0]), correct: ch.indexOf(g), hint: 'Viele Götter hatten einen Tierkopf. Das Tier verrät viel.', solution: `<b>${g[0]}</b>: ${g[1]}, ${g[2]}.`,
      ex: { mode: 'karte', nach: false, art: 'agGott', q: `${g[1]}, ${g[2]}`, opts: ch.map((x) => x[0]), ok: ch.indexOf(g), svg: '', merk: `<b>${g[0]}</b>: ${g[1]}.` } };
    return { prompt: `Wofür war <b>${g[0]}</b> zuständig?`, choices: ch.map((x) => x[1]), correct: ch.indexOf(g), hint: 'Denk an das Tier, mit dem der Gott dargestellt wurde.', solution: `<b>${g[0]}</b> (${g[2]}): ${g[1]}.`,
      ex: { mode: 'karte', nach: false, art: 'agGott', q: `Wofür war ${g[0]} zuständig?`, opts: ch.map((x) => x[1]), ok: ch.indexOf(g), svg: '', merk: `<b>${g[0]}</b>: ${g[1]}, ${g[2]}.` } };
  }
  const religionAg = baue('g5-religion-ag', {
    h: 'Die Ägypter glaubten an viele Götter (Polytheismus). Viele hatten einen Tierkopf: Anubis den Schakal, Horus den Falken, Thot den Ibis. Re war der Sonnengott, Osiris herrschte im Totenreich, Amun war König der Götter.',
    O: [{ t: 'Ein Tempel von außen nach innen: Bringe die Teile in die richtige Reihenfolge.', items: ['das Tor (Pylon)', 'der große offene Hof', 'der Säulensaal', 'das Allerheiligste mit der Götterstatue'], s1: 'Je weiter hinein, desto dunkler und heiliger:', w: 'Pylon → Hof → Säulensaal → Allerheiligstes. Ins Allerheiligste durften nur der König und die höchsten Priester.' }],
    F: [
      { f: 'Wie nennt man den Glauben an <b>viele</b> Götter?', a: 'Polytheismus', x: ['Monotheismus', 'Monarchie', 'Demokratie'], w: 'poly = viel. Der Glaube an einen einzigen Gott heißt Monotheismus (monos = allein), wie im Judentum, Christentum und Islam.' },
      { f: 'Warum hatten so viele Götter ein <b>Tier</b> als Zeichen?', a: 'So erkannte man sie auf Bildern, auch wer nicht lesen konnte.', x: ['Weil die Ägypter keine Menschen malen konnten.', 'Weil Tiere die Götter waren und sonst nichts.', 'Weil es so im Gesetz stand.'], w: 'Die meisten Ägypter konnten nicht lesen. Die Bilder sprachen für sich.' },
      { f: 'Wofür hielten die Ägypter einen <b>Tempel</b>?', a: 'für das Wohnhaus eines Gottes', x: ['für eine Schule', 'für einen Marktplatz', 'für ein Grab der Bauern'], w: 'Das Volk durfte nicht hinein. Priester wuschen, salbten und kleideten die Götterstatue und brachten ihr Speisen.' },
      { f: 'Wie heißt die größte Tempelanlage Ägyptens, an der über 2000 Jahre gebaut wurde?', a: 'Karnak', x: ['Gizeh', 'Olympia', 'Sparta'], w: 'Sie war dem Gott Amun geweiht und gehört zu den größten religiösen Anlagen der Welt.' },
      { f: 'Waren die Priester in Ägypten nur für Gebete da?', a: 'Nein, sie waren zugleich Beamte, und die Tempel waren reich und mächtig.', x: ['Ja, sie beteten den ganzen Tag.', 'Ja, sie durften nie sprechen.', 'Es gab keine Priester.'], w: 'Tempel besaßen viel Land und bekamen Kriegsbeute. Viele Priester dienten nur einige Wochen im Jahr und durften heiraten.' },
      { f: 'Wer durfte in das <b>Innerste</b> eines Tempels?', a: 'nur Priester und der Pharao', x: ['alle Ägypter', 'nur Kinder', 'nur Händler'], w: 'Der Tempel galt als Haus des Gottes. Das einfache Volk blieb draußen.' },
      { f: 'Welcher Gott wurde mit einem <b>Schakalkopf</b> dargestellt?', a: 'Anubis', x: ['Re', 'Horus', 'Osiris'], w: 'Anubis wachte über die Gräber und half bei der Mumifizierung.' },
      { f: 'Wer war der <b>Sonnengott</b>?', a: 'Re', x: ['Anubis', 'Amun', 'Thot'], w: 'Man glaubte: Re fährt tagsüber mit seiner Barke über den Himmel und nachts durch die Unterwelt.' },
    ],
    T: [
      { f: 'Der Glaube an viele Götter heißt ___.', a: 'Polytheismus', w: 'poly = viel, Theismus = Gottesglaube.' },
      { f: 'Das Tor eines ägyptischen Tempels heißt ___.', a: 'Pylon', w: 'Zwei mächtige Türme mit einem Durchgang.' },
    ],
    extra: { agGott },
  }, { agGott: 44, frage: 34, ordnen: 10, tippen: 12 });

  const jenseits = baue('g5-jenseits', {
    h: 'Die Ägypter glaubten an ein Leben nach dem Tod. Dafür musste der Körper erhalten bleiben: Er wurde zur Mumie. Im Totengericht wurde das Herz gewogen.',
    O: [{ t: 'Wie wurde eine Mumie gemacht? Bringe die Schritte in die richtige Reihenfolge.', items: ['Körper waschen', 'Gehirn und Organe entnehmen, das Herz bleibt', 'Körper etwa 40 Tage in Natronsalz trocknen', 'mit Leinen füllen und mit Ölen einreiben', 'in Leinenbinden wickeln, Maske aufsetzen'], n: 4, s1: 'Etwa 70 Tage dauerte es, bis eine Mumie fertig war:', w: 'waschen → Organe entnehmen → trocknen → füllen und einölen → einwickeln.' }],
    F: [
      { f: 'Warum machten die Ägypter aus Toten <b>Mumien</b>?', a: 'Sie glaubten, der Körper wird im Jenseits wieder gebraucht.', x: ['Damit man sie im Museum zeigen kann.', 'Weil es so vorgeschrieben war, um Platz zu sparen.', 'Damit die Toten nicht riechen.'], w: 'Der Körper sollte für das ewige Leben erhalten bleiben.' },
      { f: 'Welches Organ blieb im Körper?', a: 'das Herz', x: ['das Gehirn', 'der Magen', 'die Lunge'], w: 'Das Herz steuerte nach Meinung der Ägypter Denken und Fühlen. Das Gehirn hielten sie für unwichtig und zogen es mit einem Haken durch die Nase heraus.' },
      { f: 'Wo lag nach dem Glauben der Ägypter das <b>Jenseits</b>?', a: 'im Westen, wo die Sonne untergeht', x: ['im Osten, wo die Sonne aufgeht', 'auf dem Olymp', 'unter dem Nil'], w: 'Darum liegen viele Gräber am Westufer des Nils. Das Paradies hieß „Gefilde der Seligen“.' },
      { f: 'Was geschah, wenn das Herz <b>schwerer</b> war als die Feder?', a: 'Ein Ungeheuer, die „Fresserin“, verschlang es: der endgültige Tod.', x: ['Der Tote durfte noch einmal wiegen.', 'Der Tote wurde Pharao.', 'Nichts, es war egal.'], w: 'War die Waage im Gleichgewicht, durfte der Tote mit Re durch die Unterwelt fahren.' },
      { f: 'Wozu legte man <b>Uschebtis</b> (kleine Figuren) ins Grab?', a: 'Sie sollten im Totenreich die Arbeit für den Toten machen.', x: ['als Spielzeug für Kinder', 'als Wächter gegen Räuber', 'als Geld'], w: 'Rief man sie, sollten sie antworten: „Hier bin ich!“' },
      { f: 'Wie nannten die Ägypter ein Grab?', a: '„Haus für die Ewigkeit“', x: ['„Haus der Spiele“', '„Haus des Nils“', '„Haus der Schreiber“'], w: 'Man begann oft schon in jungen Jahren, an seinem Grab zu bauen. Arme Menschen wurden in einfachen Gruben in der Wüste bestattet.' },
      { f: 'Womit wurde der Körper <b>getrocknet</b>?', a: 'mit einer Art Salz (Natron)', x: ['mit einem Föhn', 'mit Zucker', 'mit Sand aus dem Meer'], w: 'Das Salz entzog dem Körper das Wasser, etwa 40 Tage lang.' },
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
      { f: 'Im Totengericht wurde das ___ gewogen.', a: 'Herz', w: 'Gegen die Feder der Maat.' },
      { f: 'Die Seele eines Menschen, gemalt als Vogel mit Menschenkopf, hieß ___.', a: ['Ba'], w: 'Dazu gehörten auch der Körper und die Lebenskraft „Ka“. Nur zusammen gab es ewiges Leben.' },
    ],
    A: { w: ['Das Herz blieb im Körper der Mumie.', 'Eine Mumie zu machen dauerte etwa 70 Tage.', 'Anubis war der Gott der Mumien.'], f: ['Das Gehirn wurde sorgfältig aufbewahrt.', 'Nur Katzen wurden mumifiziert, keine Menschen.', 'Die Ägypter glaubten, mit dem Tod sei alles vorbei.'] },
  }, { frage: 42, tippen: 18, ordnen: 22, aussage: 18 });

  const pyramiden = baue('g5-pyramiden', {
    h: 'Pyramiden waren Gräber der Pharaonen. Die erste baute Imhotep um 2700 v. Chr. für Djoser. Die größte ist die Cheops-Pyramide bei Gizeh (ursprünglich 146 m hoch, über 2 Millionen Steinblöcke).',
    O: [{ t: 'Wie die Pharaonen die perfekte Form fanden: Bringe die Gräber in die richtige Reihenfolge.', items: ['Grube im Sand', 'Mastaba (rechteckiger Bau aus Ziegeln)', 'Stufenpyramide des Djoser', 'Pyramide mit glatten Seiten'], s1: 'Vom einfachen Grab zur Pyramide:', w: 'Grube → Mastaba → Stufenpyramide (Mastabas übereinander) → glatte Pyramide.' },
      { t: 'Ordne nach der Zeit: <b>das Älteste zuerst</b>.', items: ['Stufenpyramide des Djoser', 'Cheops-Pyramide', 'erste Olympische Spiele', 'Grab des Tutanchamun entdeckt'], j: [-2700, -2580, -776, 1922], um: [1, 1, 0, 0], kurz: ['Stufenpyramide', 'Cheops-Pyramide', 'Olympische Spiele', 'Tutanchamun entdeckt'], n: 4, w: 'Die Pyramiden waren schon uralt, als in Griechenland die Olympischen Spiele begannen.' }],
    F: [
      { f: 'Wozu dienten die Pyramiden?', a: 'als Gräber für die Pharaonen', x: ['als Wohnhäuser', 'als Kornspeicher', 'als Sternwarten für Kinder'], w: 'Der Pharao sollte sicher ins Jenseits gelangen.' },
      { f: 'Wie hoch war die Cheops-Pyramide ursprünglich?', a: 'etwa 146 Meter', x: ['etwa 14 Meter', 'etwa 1460 Meter', 'etwa 46 Meter'], w: 'Heute ist sie etwa 138 Meter hoch, weil die Spitze fehlt. Jede Seite ist etwa 230 Meter lang: Die Grundfläche ist größer als 7 Fußballfelder.' },
      { f: 'Wer war der Baumeister der ersten Pyramide?', a: 'Imhotep', x: ['Herodot', 'Champollion', 'Kleisthenes'], w: 'Er stapelte für Djoser sechs Mastabas übereinander: das erste große Steinbauwerk der Menschheit. Später verehrte man ihn sogar als Gott.' },
      { f: 'Welches Hilfsmittel kannten die Ägypter beim Pyramidenbau <b>nicht</b>?', a: 'das Rad', x: ['den Holzschlitten', 'die Rampe', 'das Boot'], w: 'Die Steine zogen sie auf Schlitten, viele kleine Rampen führten nach oben.' },
      { f: 'Wie schwer war einer der Granit-Balken über der Grabkammer des Cheops?', a: 'etwa 80 Tonnen', x: ['etwa 8 Kilogramm', 'etwa 800 Gramm', 'etwa 8000 Tonnen'], w: 'So viel wie etwa 16 afrikanische Elefanten.' },
      { f: 'Woran erinnerte die Form der Pyramide?', a: 'an eine Treppe oder Leiter zum Himmel', x: ['an einen Berg in Griechenland', 'an ein Zelt', 'an einen Fisch'], w: 'Man glaubte, der tote König steigt zu den Sternen auf.' },
      { f: 'Wo stehen die drei großen Pyramiden?', a: 'bei Gizeh, nahe Kairo', x: ['in Athen', 'in Sparta', 'in Bozen'], w: 'Die Pyramiden von Cheops, Chephren und Mykerinos. Davor liegt die große Sphinx.' },
      { f: 'Wie viele Steinblöcke stecken ungefähr in der Cheops-Pyramide?', a: 'über 2 Millionen', x: ['etwa 2000', 'etwa 200', 'über 20 Milliarden'], w: 'Jeder Block wog etwa 2,5 Tonnen, so viel wie zwei Autos.' },
      { f: 'Wie lange dauerte der Bau der Cheops-Pyramide ungefähr?', a: 'etwa 20 bis 30 Jahre', x: ['etwa 2 Wochen', 'etwa 200 Jahre', 'etwa 2 Jahre'], w: 'Genau aufgeschrieben ist es nicht. Etwa 25.000 Menschen waren beteiligt, in den Steinbrüchen, beim Transport, am Bau und bei der Versorgung.' },
      { f: 'Wer baute die Pyramiden?', a: 'Fachleute und Bauern, die versorgt wurden, keine Sklaven', x: ['Außerirdische', 'nur Sklaven', 'Riesen'], w: 'Bäcker und Köche versorgten die Arbeiter. Viele Bauern halfen während der Überschwemmung, wenn auf den Feldern nichts zu tun war.' },
      { f: 'Wie heißt die <b>älteste</b> große Pyramide?', a: 'die Stufenpyramide des Djoser', x: ['die Cheops-Pyramide', 'die Pyramide von Sparta', 'die Glaspyramide in Paris'], w: 'Sie wurde um 2700 v. Chr. in Sakkara gebaut, etwa 100 Jahre vor den Pyramiden von Gizeh. Sie ist 60 Meter hoch.' },
      { f: 'Warum bauten spätere Pharaonen ihre Gräber versteckt im <b>Tal der Könige</b>?', a: 'Grabräuber hatten die Pyramiden ausgeraubt.', x: ['Weil die Steine ausgegangen waren.', 'Weil Pyramiden verboten wurden.', 'Weil das Tal näher am Meer lag.'], w: 'In Felsgräbern hoffte man, sicherer zu sein. Fast alle wurden trotzdem beraubt, außer dem Grab des Tutanchamun.' },
      { f: 'Wie lange war die Cheops-Pyramide das <b>höchste Bauwerk</b> der Welt?', a: 'fast 4000 Jahre lang', x: ['40 Jahre lang', '400 Jahre lang', 'nie'], w: 'Erst im Mittelalter wurde eine Kathedrale in England höher.' },
      { f: 'Wie transportierte man die schweren Steine vermutlich?', a: 'auf Holzschlitten, über Rampen und auf Booten über den Nil', x: ['mit Lastwagen', 'mit Kränen aus Stahl', 'mit der Eisenbahn'], w: 'Ganz genau weiß man es nicht. Über die Bauweise streiten Forscher bis heute.' },
    ],
    T: [
      { f: 'Die größte Pyramide ist die ___-Pyramide.', a: 'Cheops', w: 'Bei Gizeh, um 2580 v. Chr.' },
      { f: 'Die Pyramiden waren ___ für die Pharaonen.', a: ['Gräber', 'Grabmäler', 'Grabstätten'], w: 'Grabstätten für das Leben im Jenseits.' },
      { f: 'Ein rechteckiges Grab aus Ziegeln, die Vorstufe der Pyramide, heißt ___.', a: ['Mastaba', 'Mastabas'], w: 'Mehrere Mastabas übereinander ergaben die Stufenpyramide.' },
    ],
    A: { w: ['Die Pyramiden waren Gräber.', 'Die Cheops-Pyramide war ursprünglich etwa 146 Meter hoch.', 'Die Pyramiden von Gizeh sind über 4500 Jahre alt.'], f: ['Die Pyramiden wurden im Mittelalter gebaut.', 'In den Pyramiden wohnten Bauern.', 'Die Cheops-Pyramide wurde in zwei Wochen gebaut.'] },
  }, { frage: 46, tippen: 14, ordnen: 20, aussage: 20 });

  const hochkultur = baue('g5-hochkultur', {
    h: 'Merkmale einer Hochkultur: ein Staat mit Herrscher und Beamten, Schrift, große Steinbauten, Kalender, Wissenschaft (Sternkunde, Geometrie), Arbeitsteilung mit vielen Berufen, eine streng gegliederte Gesellschaft.',
    S: { kats: ['Merkmal einer Hochkultur', 'kein Merkmal einer Hochkultur'], f: (x) => `<b>${x}</b>: Ist das ein Merkmal einer Hochkultur?`, h: 'Eine Hochkultur hat Staat, Schrift, Kalender, große Bauten und viele Berufe.',
      items: [['eine Schrift für Steuern, Wissen und Gesetze', 0], ['ein Staat mit Herrscher, Beamten und Heer', 0], ['ein Kalender', 0], ['große Bauwerke aus Stein', 0], ['viele verschiedene Berufe (Arbeitsteilung)', 0], ['Land vermessen mit Geometrie', 0, 'nach der Überschwemmung'],
        ['Alle leben als Jäger und Sammler.', 1], ['Alle ziehen den Tierherden nach.', 1], ['Jeder macht alles selbst.', 1], ['Es gibt keine Vorräte.', 1]] },
    F: [
      { f: 'Was gehört <b>nicht</b> zu den Merkmalen einer Hochkultur?', a: 'Alle leben als Jäger und Sammler.', x: ['Es gibt eine Schrift.', 'Es gibt einen Staat mit Beamten.', 'Es gibt große Bauwerke.'], w: 'Hochkulturen haben Städte, Staat, Schrift und viele Berufe. Jäger und Sammler gab es in der Altsteinzeit.' },
      { f: 'Warum mussten die Ägypter das Land mit <b>Geometrie</b> vermessen?', a: 'Die Überschwemmung spülte jedes Jahr die Grenzsteine der Felder weg.', x: ['Weil sie gern rechneten.', 'Weil der Nil die Felder vergrößerte.', 'Für die Olympischen Spiele.'], w: 'So entstand die Flächenmessung. Auch der Kalender und die Sternkunde wuchsen aus dem Leben am Nil.' },
      { f: 'Ab wann spricht man von der ägyptischen <b>Hochkultur</b>?', a: 'ab etwa 3000 v. Chr.', x: ['ab etwa 300 n. Chr.', 'ab etwa 30.000 v. Chr.', 'ab 1922'], w: 'Rund 3000 Jahre lang regierten Pharaonen. 30 v. Chr. wurde Ägypten eine Provinz der Römer.' },
      { f: 'Was ist der Unterschied zwischen <b>absoluter</b> und <b>relativer</b> Zeitangabe?', a: 'Absolut zählt man von einem festen Punkt (Christi Geburt), relativ zum Beispiel nach Regierungsjahren eines Königs.', x: ['Es gibt keinen Unterschied.', 'Absolut heißt ungefähr, relativ heißt genau.', 'Relativ gibt es nur bei den Griechen.'], w: 'In Ägypten begann mit jedem neuen König wieder „Jahr 1“. Darum sind ägyptische Jahreszahlen schwer umzurechnen.' },
      { f: 'Wann endete das Reich der Pharaonen?', a: '30 v. Chr., als Ägypten römische Provinz wurde', x: ['1922, als man Tutanchamun fand', '3000 v. Chr.', 'es besteht noch heute'], w: 'Die Pharaonen hatten rund 3000 Jahre lang regiert.' },
      { f: 'Was bedeutet „<b>Arbeitsteilung</b>“?', a: 'Jeder hat seinen Beruf, und man tauscht, was man herstellt.', x: ['Alle machen alles selbst.', 'Niemand arbeitet.', 'Nur der Pharao arbeitet.'], w: 'Weil die Bauern genug ernteten, konnten andere Handwerker, Schreiber oder Priester sein.' },
      { f: 'Warum zogen viele Menschen in der Frühzeit an den Nil?', a: 'Das Land um sie herum wurde immer trockener.', x: ['Weil es am Nil Schnee gab.', 'Weil der Pharao sie einlud.', 'Weil dort schon Pyramiden standen.'], w: 'Die Sahara war vor Tausenden Jahren grüner. Als sie austrocknete, bot nur noch der Nil genug Wasser.' },
    ],
    T: [{ f: 'Eine Kultur mit Staat, Schrift, großen Bauten und vielen Berufen nennt man ___.', a: ['Hochkultur', 'Hochkulturen'], w: 'In Ägypten ab etwa 3000 v. Chr.' }],
    A: { w: ['Ägypten hatte eine Schrift.', 'In Ägypten gab es Beamte.', 'Der Kalender der Ägypter richtete sich nach dem Nil.'], f: ['In Ägypten gab es keinen Staat.', 'Die Ägypter kannten keine Geometrie.', 'Ägypten wurde 1922 römische Provinz.'] },
  }, { sortieren: 30, passtNicht: 12, frage: 38, tippen: 8, aussage: 16 });

  // =====================================================
  // Bereich 03: Lebenswelt griechische Polis (ANNO 1, S. 84–131; Lehrplan LB 3)
  // =====================================================
  const land = baue('g5-land', {
    h: 'Griechenland hat viele Gebirge, wenig fruchtbares Land und überall Meer. Darum gab es viele kleine Stadtstaaten (Poleis). Ab etwa 750 v. Chr. gründeten Griechen Tochterstädte rund ums Mittelmeer.',
    F: [
      { f: 'Wie sieht die Landschaft Griechenlands aus?', a: 'viele Berge, wenig fruchtbares Land, überall Meer und Inseln', x: ['flach wie ein Tisch, mit riesigen Feldern', 'dichter Urwald', 'Wüste wie in Ägypten'], w: 'Darum lebten die Griechen eng mit dem Meer: als Fischer, Seefahrer und Händler.' },
      { f: 'Was ist eine <b>Polis</b>?', a: 'ein griechischer Stadtstaat', x: ['ein griechischer Gott', 'ein Tempel', 'ein Schiff'], w: 'Eine Stadt mit dem Umland, auf dem Ackerbau und Viehzucht betrieben wurden. Die Bürger waren stolz auf ihre Freiheit und ihr eigenes Recht. Mehrzahl: Poleis.' },
      { f: 'Wie viele Einwohner hatten die <b>meisten</b> Poleis?', a: 'etwa 3500', x: ['etwa 35', 'etwa 3,5 Millionen', 'etwa 350.000'], w: 'Rund 1100 Poleis sind bekannt. Die größte war Athen mit über 200.000 Einwohnern.' },
      { f: 'Warum war das Meer für fast jede Polis ein „<b>Tor zur Welt</b>“?', a: 'Über Land kam man wegen der Gebirge schlecht voran, übers Meer gut.', x: ['Weil im Meer Gold lag.', 'Weil die Griechen nicht laufen wollten.', 'Weil es keine Berge gab.'], w: 'So wurden die Griechen Seefahrer und Händler, bis nach Karthago und Persien.' },
      { f: 'Welches Klima hat Griechenland?', a: 'Mittelmeerklima: heiße Sommer, milde Winter ohne Frost', x: ['ewiges Eis', 'Regen das ganze Jahr', 'Wüstenklima ohne jeden Regen'], w: 'Trocken, aber nicht zu trocken: Landwirtschaft war möglich, vor allem in tiefen Lagen.' },
      { f: 'Von welchem Volk übernahmen die Griechen das <b>Alphabet</b>?', a: 'von den Phönikern', x: ['von den Ägyptern', 'von den Römern', 'von den Kelten'], w: 'Die Phöniker lebten an der Ostküste des Mittelmeers. Mit der Schrift konnten die Griechen Handel und Wissen aufschreiben.' },
      { f: 'Warum fragten die Bewohner der Insel Thera das <b>Orakel von Delphi</b>, bevor sie Kyrene gründeten?', a: 'Seit Jahren regnete es nicht, und sie suchten Rat bei Gott Apollon.', x: ['Sie wollten wissen, wer Olympia gewinnt.', 'Sie wollten ein Schiff kaufen.', 'Sie suchten einen König für Ägypten.'], w: 'Das Orakel riet, eine Kolonie in Libyen zu gründen. Herodot schrieb das fast 200 Jahre später auf.' },
      { f: 'Was gehört <b>zuerst</b> dazu, eine schriftliche Quelle zu erschließen?', a: 'die Quelle genau lesen und unbekannte Wörter klären', x: ['die Haltung des Autors beurteilen', 'die Quelle wegwerfen', 'eine Zeichnung malen'], w: 'Lesen → in Abschnitte teilen → Quelle vorstellen (Autor, Zeit, Textart) → Inhalt wiedergeben → Absicht des Autors prüfen.' },
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
      { f: 'Der Markt- und Versammlungsplatz einer Polis hieß ___.', a: 'Agora', w: 'Dazu kam oft ein Burgberg, die Akropolis.' },
    ],
    A: { w: ['In Griechenland gab es viele Stadtstaaten.', 'Griechen gründeten Kolonien am Mittelmeer.', 'Die Griechen sprachen eine gemeinsame Sprache.'], f: ['Griechenland hatte nur einen einzigen großen König.', 'Griechenland ist ganz flach und fruchtbar.', 'Die Griechen bauten vor allem Reis an.'] },
  }, { frage: 50, tippen: 22, aussage: 18 });

  const olympia = baue('g5-olympia', {
    h: 'Die Olympischen Spiele fanden ab 776 v. Chr. alle vier Jahre in Olympia statt, zu Ehren des Zeus. Mitmachen durften nur freie griechische Männer. Der Sieger bekam einen Kranz aus Zweigen.',
    S: { kats: ['nur damals', 'nur heute', 'damals und heute'], f: (x) => `Olympische Spiele: <b>${x}</b>. Gilt das damals, heute oder in beiden Zeiten?`, h: 'Damals: Fest für Zeus, nur griechische Männer, Kranz als Preis. Heute: Sportler aus aller Welt, Frauen und Männer, Medaillen.',
      items: [['Der Sieger bekommt einen Kranz aus Zweigen.', 0], ['Die Spiele sind ein Fest für Zeus.', 0], ['Nur freie Männer aus Griechenland dürfen mitmachen.', 0], ['Wagenrennen mit vier Pferden', 0],
        ['Der Sieger bekommt eine Goldmedaille.', 1], ['Sportlerinnen und Sportler aus aller Welt treten an.', 1], ['Frauen dürfen mitmachen.', 1],
        ['Die Spiele finden alle vier Jahre statt.', 2], ['Es gibt einen Wettlauf.', 2], ['Es gibt Ringkämpfe.', 2]] },
    F: [
      { f: 'Wann fanden die ersten Olympischen Spiele statt?', a: '776 v. Chr.', x: ['1896 n. Chr.', '393 n. Chr.', '3000 v. Chr.'], w: 'Zuerst gab es nur einen einzigen Wettlauf über eine Stadionlänge (etwa 192 Meter).' },
      { f: 'Zu Ehren welches Gottes fanden die Spiele statt?', a: 'Zeus', x: ['Poseidon', 'Re', 'Anubis'], w: 'Im heiligen Bezirk von Olympia stand ein großer Tempel des Zeus.' },
      { f: 'Wie oft fanden die Spiele statt?', a: 'alle vier Jahre', x: ['jedes Jahr', 'alle zehn Jahre', 'nur einmal'], w: 'Die vier Jahre dazwischen nannte man eine „Olympiade“.' },
      { f: 'Was bekam ein Olympiasieger in Olympia?', a: 'einen Kranz aus Zweigen', x: ['eine Goldmedaille', 'einen Pokal aus Silber', 'ein Pferd'], w: 'Auf einer alten Schale sieht man einen Zweig vom Ölbaum. Zu Hause wurde der Sieger reich beschenkt, bekam Vorrechte und manchmal ein wichtiges Amt.' },
      { f: 'Welche Sportarten gehörten zum <b>Fünfkampf</b>?', a: 'Diskus, Speer, Weitsprung, Lauf und Ringkampf', x: ['Schwimmen, Reiten, Fechten, Schießen, Laufen', 'Fußball, Handball, Basketball, Tennis, Golf', 'Ski, Rodeln, Eislauf, Biathlon, Bob'], w: 'Den Weitsprung machten die Athleten mit Sprunggewichten aus Stein in den Händen.' },
      { f: 'Was war der Höhepunkt der Spiele?', a: 'das große Opferfest für Zeus bei Vollmond', x: ['der Marathonlauf', 'ein Fußballspiel', 'die Wahl des Königs'], w: 'Ochsen wurden geschlachtet und auf einem meterhohen Altar verbrannt. Die Spiele waren eines der wichtigsten religiösen Feste Griechenlands.' },
      { f: 'Welche Statue in Olympia zählte zu den <b>sieben Weltwundern</b>?', a: 'die Statue des Zeus aus Gold und Elfenbein', x: ['der Leuchtturm von Olympia', 'die Statue eines Läufers aus Holz', 'die Sphinx'], w: 'Der Bildhauer Phidias schuf sie um 430 v. Chr.' },
      { f: 'Durften Frauen in Olympia gar keinen Wettlauf machen?', a: 'Doch: Junge Frauen liefen außerhalb der Spiele für die Göttin Hera.', x: ['Nein, nie und nirgends.', 'Doch, Frauen machten bei allen Wettkämpfen der Männer mit.', 'Doch, aber nur im Wagenrennen.'], w: 'Bei den Spielen der Männer durften sie nicht antreten.' },
      { f: 'Wer gründete die Olympischen Spiele der Neuzeit neu?', a: 'Pierre de Coubertin', x: ['Zeus', 'Herodot', 'Perikles'], w: 'Der Franzose gründete 1894 das Internationale Olympische Komitee. 1896 fanden die ersten Spiele in Athen statt.' },
      { f: 'Wie lang war der Kurzstreckenlauf, ein „Stadion“?', a: 'etwa 192 Meter', x: ['etwa 19 Meter', 'etwa 1920 Meter', 'etwa 42 Kilometer'], w: 'Vom Lauf hat das Stadion seinen Namen.' },
      { f: 'Wer durfte an den Spielen <b>teilnehmen</b>?', a: 'nur freie griechische Männer', x: ['alle Menschen aus aller Welt', 'nur Frauen', 'nur Sklaven'], w: 'Frauen, Sklaven und Nicht-Griechen waren ausgeschlossen.' },
      { f: 'Was war der „<b>Olympische Friede</b>“?', a: 'Eine Waffenruhe, damit alle sicher nach Olympia reisen konnten', x: ['ein Vertrag mit Ägypten', 'der Name des Siegerkranzes', 'ein Tempel in Athen'], w: 'Während der Spiele sollten die Griechen nicht gegeneinander kämpfen.' },
      { f: 'Welcher Wettkampf war der <b>erste</b> der Olympischen Spiele?', a: 'der Stadionlauf', x: ['das Wagenrennen', 'der Marathon', 'Fußball'], w: 'Ein Sprint über eine Bahnlänge. Später kamen Ringen, Faustkampf, Fünfkampf und Wagenrennen dazu.' },
      { f: 'Warum endeten die antiken Olympischen Spiele?', a: 'Mit dem Christentum wurden die alten Götterfeste verboten.', x: ['Weil niemand mehr laufen wollte.', 'Weil Olympia ins Meer fiel.', 'Weil die Ägypter sie verboten.'], w: 'Sie liefen auch unter den Römern weiter. Die letzten Spiele waren Ende des 4. Jahrhunderts n. Chr.' },
      { f: 'Wann und wo fanden die ersten Olympischen Spiele der <b>Neuzeit</b> statt?', a: '1896 in Athen', x: ['776 v. Chr. in Olympia', '1972 in München', '393 in Rom'], w: 'Über 1500 Jahre nach dem Ende der antiken Spiele.' },
    ],
    T: [
      { f: 'Die Olympischen Spiele fanden zu Ehren des Gottes ___ statt.', a: 'Zeus', w: 'Zeus war der oberste Gott.' },
      { f: 'Die ersten Olympischen Spiele fanden ___ v. Chr. statt.', a: '776', w: 'Seit diesem Jahr gibt es Siegerlisten. Die Griechen zählten auch die Zeit nach Olympiaden.' },
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
        ex: { mode: 'karte', nach: false, art: 'grGott', q: g[1], opts: ch.map((x) => x[0]), ok: ch.indexOf(g), svg: '', merk: `<b>${g[0]}</b>: ${g[1]}.` } }
      : { prompt: `Wofür war <b>${g[0]}</b> zuständig?`, choices: ch.map((x) => x[1]), correct: ch.indexOf(g), hint: 'Zeus: Blitz. Poseidon: Meer. Athene: Weisheit. Hermes: Bote.', solution: `<b>${g[0]}</b>: ${g[1]}.`,
        ex: { mode: 'karte', nach: false, art: 'grGott', q: `Wofür war ${g[0]} zuständig?`, opts: ch.map((x) => x[1]), ok: ch.indexOf(g), svg: '', merk: `<b>${g[0]}</b>: ${g[1]}.` } };
  }
  const religionGr = baue('g5-religion-gr', {
    h: 'Die Griechen glaubten an viele Götter, die wie Menschen aussahen und fühlten. Die wichtigsten wohnten auf dem Berg Olymp. Zeus war der Göttervater.',
    F: [
      { f: 'Wo wohnten die wichtigsten griechischen Götter nach dem Glauben der Griechen?', a: 'auf dem Berg Olymp', x: ['am Nil', 'in Olympia im Stadion', 'unter dem Meer'], w: 'Der Olymp ist der höchste Berg Griechenlands. Nicht verwechseln mit Olympia, dem Ort der Spiele!' },
      { f: 'Wie stellten sich die Griechen ihre Götter vor?', a: 'wie Menschen, mit Gefühlen und Streit, aber unsterblich und mächtig', x: ['mit Tierköpfen wie in Ägypten', 'als unsichtbares Licht ohne Gestalt', 'als Steine'], w: 'Die Götter liebten, stritten und waren eifersüchtig, wie in vielen Sagen erzählt wird.' },
      { f: 'Welcher Göttin war der <b>Parthenon</b> auf der Akropolis in Athen geweiht?', a: 'Athene', x: ['Aphrodite', 'Hera', 'Artemis'], w: 'Athene war die Schutzgöttin Athens. Die Stadt trägt ihren Namen.' },
      { f: 'Was war das <b>Orakel von Delphi</b>?', a: 'ein Ort, an dem eine Priesterin im Namen Apollons Fragen beantwortete', x: ['ein großes Sportfest', 'ein Gericht in Sparta', 'eine Schule für Schreiber'], w: 'Selbst Stadtstaaten fragten dort um Rat, etwa bevor sie Kolonien gründeten.' },
      { f: 'Wie ehrten die Griechen ihre Götter?', a: 'mit Gebeten, Opfern, Festen und Tempeln', x: ['nur mit Pyramiden', 'gar nicht', 'mit Mumien'], w: 'Priester schlachteten Tiere und verbrannten Teile davon auf dem Altar, den Rest aß man beim Festmahl.' },
      { f: 'Wie wurde man in Griechenland <b>Priester</b>?', a: 'Man wurde für ein Jahr gewählt.', x: ['Man wurde als Priester geboren, wie in Ägypten.', 'Der Pharao bestimmte es.', 'Nur Sklaven wurden Priester.'], w: 'Einen eigenen Priesterstand wie in Ägypten gab es nicht. Opfern durfte auch jeder Gläubige selbst.' },
      { f: 'Wie erklärten sich die Griechen ein <b>Gewitter</b>?', a: 'Zeus ist zornig.', x: ['Wolken stoßen zusammen.', 'Poseidon badet.', 'Gar nicht.'], w: 'Viele Götter erklärten vieles: Die Liebe war ein Werk der Aphrodite. In Quellen wohnten Nymphen, in Wäldern Satyrn.' },
      { f: 'Wo saß die Priesterin <b>Pythia</b> in Delphi?', a: 'auf einem hohen Dreifuß im Innenraum des Tempels', x: ['auf dem Olymp', 'im Stadion von Olympia', 'auf einem Schiff'], w: 'Man glaubte, Apollon spreche durch sie. Für gute Antworten schickten Städte reiche Geschenke nach Delphi.' },
      { f: 'Woher wissen wir etwas über die Religion der Griechen, obwohl es keine heilige Schrift gab?', a: 'aus Tempelruinen, Bildern auf Gefäßen und Texten', x: ['aus einem Brief von Zeus', 'aus Filmen', 'gar nicht'], w: 'Viele Quellen zusammen ergeben ein recht genaues Bild.' },
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
    S: { kats: ['gegenständliche Quelle', 'bildliche Quelle', 'schriftliche Quelle'], f: (x) => `Was für eine Quelle ist <b>${x}</b>?`, h: 'Gegenstand, Bild oder Text?',
      items: [['eine Silbermünze aus Athen', 0], ['die Ruine eines Tempels', 0], ['ein Helm aus Bronze', 0], ['ein Bild auf einer Vase', 1], ['ein Wandbild in einem Haus', 1], ['eine Inschrift mit einem Gesetz', 2], ['das Geschichtsbuch des Herodot', 2], ['ein Gedicht von Homer', 2]] },
    F: [
      { f: 'Was zeigt das Bild auf dieser Vase?', a: 'zwei Läufer bei einem Wettlauf', x: ['eine Mumie', 'eine Pyramide', 'ein Mammut'], w: 'Vasenbilder zeigen Alltag, Sport, Götter und Sagen. Sie sind wichtige Bildquellen.', svg: 'vase' },
      { f: 'Diese Scherbe trägt einen eingeritzten Namen. Wofür wurde sie benutzt?', a: 'für das Scherbengericht in Athen', x: ['als Teller beim Essen', 'als Geld', 'als Grabstein'], w: 'Auf solche Scherben schrieben Bürger den Namen eines Politikers, der verbannt werden sollte. Hier: Themistokles.', svg: 'ostrakon' },
      { f: 'Welche Stadt prägte diese Münze mit der <b>Eule</b>?', a: 'Athen', x: ['Sparta', 'Rom', 'Theben in Ägypten'], w: 'Die Eule war das Tier der Göttin Athene. Die Münzen waren aus Silber.', svg: 'muenze' },
      { f: 'Wer gilt als „<b>Vater der Geschichtsschreibung</b>“?', a: 'Herodot', x: ['Homer', 'Zeus', 'Champollion'], w: 'Herodot reiste um 450 v. Chr. weit herum, auch nach Ägypten, und schrieb auf, was er erfuhr.' },
      { f: 'Warum muss man mit den Geschichten von <b>Homer</b> vorsichtig sein?', a: 'Es sind Dichtungen: Wahres und Erfundenes sind vermischt.', x: ['Weil Homer nicht schreiben konnte.', 'Weil sie auf Latein sind.', 'Weil sie erst 2019 geschrieben wurden.'], w: 'Die Ilias und die Odyssee erzählen von Helden und Göttern. Sie sind wertvoll, aber kein Tatsachenbericht.' },
      { f: 'Über wen verraten die griechischen Texte <b>am wenigsten</b>?', a: 'über Frauen und Sklaven', x: ['über reiche Bürger', 'über Politiker', 'über Götter'], w: 'Geschrieben haben fast nur reiche Männer. Über andere Gruppen wissen wir darum wenig: eine Grenze der Quellen.' },
      { f: 'Ist eine bemalte Vase eine gegenständliche oder eine bildliche Quelle?', a: 'beides: Die Vase ist ein Gegenstand, das Bild darauf eine bildliche Quelle.', x: ['nur eine schriftliche Quelle', 'keine Quelle', 'eine mündliche Überlieferung'], w: 'Die Form verrät, wofür sie diente (Öl, Wein, Wasser). Das Bild verrät, was die Menschen taten. Töpfer und Maler setzten oft ihren Namen darauf.', svg: 'vase' },
      { f: 'Über welche Zeit gibt es kaum <b>schriftliche</b> Quellen der Griechen?', a: 'über die Frühzeit bis etwa 800 v. Chr.', x: ['über das 5. Jahrhundert v. Chr.', 'über die Olympischen Spiele', 'über Athen zur Zeit des Perikles'], w: 'Für diese Zeit sind die Forscher auf die Funde der Archäologen angewiesen.' },
      { f: 'Man fand eine Tonscherbe mit dem Namen <b>Aristeides</b> vom Scherbengericht. Was beweist sie?', a: 'dass es diesen Politiker wirklich gab', x: ['dass Aristeides Töpfer war', 'dass er Olympiasieger war', 'gar nichts'], w: 'Funde können bestätigen, was in Texten steht.', svg: 'ostrakon' },
      { f: 'Man findet griechische Vasen und Münzen in einem fernen Land. Was schließen Forscher daraus?', a: 'Es gab Handel zwischen den beiden Ländern.', x: ['Die Griechen wohnten dort alle.', 'Die Vasen sind dorthin geflogen.', 'Gar nichts.'], w: 'Ein versteckter Schatz aus vielen Münzen kann zeigen, dass Menschen in Not waren, etwa weil Feinde kamen.' },
      { f: 'Wer gilt als Begründer der <b>wissenschaftlichen</b> Geschichtsschreibung?', a: 'Thukydides', x: ['Homer', 'Zeus', 'Hippokrates'], w: 'Er schrieb über den Krieg zwischen Athen und Sparta. Hippokrates gilt als Begründer der wissenschaftlichen Medizin.' },
      { f: 'Warum schreiben Historiker oft „vermutlich“ oder „wahrscheinlich“?', a: 'Viele Quellen sind verloren, das Bild der Vergangenheit ist wie ein Puzzle mit Lücken.', x: ['Weil sie nicht schreiben können.', 'Weil alles erfunden ist.', 'Weil es so vorgeschrieben ist.'], w: 'Neue Funde können die Deutung ändern. Geschichte ist nie ganz „fertig“.' },
      { f: 'Womit beginnt man, wenn man ein <b>Vasenbild</b> untersucht?', a: 'Man beschreibt genau, was zu sehen ist.', x: ['Man beurteilt sofort, ob es schön ist.', 'Man schreibt den Preis auf.', 'Man malt es nach.'], w: 'Beschreiben → die Teile erklären → Maler und Zweck bestimmen → die Bedeutung zusammenfassen.' },
    ],
    T: [{ f: 'Der griechische Gott des Feuers und der Schmiede hieß ___.', a: 'Hephaistos', w: 'Auf einer berühmten Schale reicht er Thetis die Waffen für Achilles.' }],
    A: { w: ['Vasenbilder sind bildliche Quellen.', 'Herodot schrieb über Ägypten.', 'Über Sklaven wissen wir aus den Quellen wenig.'], f: ['Homer schrieb nur die reine Wahrheit auf.', 'Die Griechen hinterließen keine Texte.', 'Eine Münze ist eine schriftliche Quelle.'] },
  }, { sortieren: 26, passtNicht: 10, frage: 44, tippen: 6, aussage: 14 });

  const wirtschaft = baue('g5-wirtschaft', {
    h: 'Athen lebte vom Handel übers Meer. Es verkaufte Olivenöl, Wein und Töpferwaren und kaufte Getreide und Holz. Der Hafen hieß Piräus, der Markt Agora.',
    S: { kats: ['Athen verkauft es', 'Athen kauft es ein'], f: (x) => `<b>${x}</b>: Hat Athen das eher verkauft oder eingekauft?`, h: 'Athen hatte viele Ölbäume, Weinberge und Töpfer, aber zu wenig Felder und Wald.',
      items: [['Olivenöl', 0], ['Wein', 0], ['bemalte Vasen', 0], ['Silbermünzen', 0], ['Getreide', 1, 'Attika hatte zu wenig Felder'], ['Holz für Schiffe', 1, 'die Wälder waren abgeholzt'], ['Sklaven', 1, 'viele kamen als Kriegsgefangene']] },
    F: [
      { f: 'Wie hieß der große <b>Hafen</b> Athens?', a: 'Piräus', x: ['Pnyx', 'Olymp', 'Gizeh'], w: 'Über den Piräus kam Getreide aus fernen Ländern, etwa vom Schwarzen Meer.' },
      { f: 'Wie hieß der <b>Marktplatz</b> in Athen?', a: 'Agora', x: ['Akropolis', 'Polis', 'Pnyx'], w: 'Auf der Agora kaufte man ein, traf Freunde und redete über Politik.' },
      { f: 'Woher hatte Athen das <b>Silber</b> für seine Münzen?', a: 'aus Bergwerken bei Laurion, in denen Sklaven arbeiteten', x: ['aus Ägypten als Geschenk', 'aus dem Meer gefischt', 'von den Bäumen'], w: 'Im 5. Jahrhundert v. Chr. gab es dort über 2000 Schächte. Die Minen gehörten der ganzen Polis.' },
      { f: 'Was bedeutet „<b>Eulen nach Athen tragen</b>“?', a: 'etwas Überflüssiges tun', x: ['Tiere verkaufen', 'Geld verschenken', 'nachts reisen'], w: 'Athen hatte so viele Eulen-Münzen, dass niemand noch welche hinbringen musste.', svg: 'muenze' },
      { f: 'Wie groß war das Gebiet der Polis Athen (Attika) ungefähr?', a: 'etwa so groß wie das heutige Luxemburg', x: ['so groß wie ganz Europa', 'so groß wie ein Fußballfeld', 'so groß wie Afrika'], w: 'Eine kleine Fläche, aber mit Hafen, Silber und Marmor.' },
      { f: 'Welche Ware aus Attika war im ganzen Mittelmeerraum beliebt?', a: 'bemalte Töpferwaren (attische Vasen)', x: ['Papyrus', 'Bernstein', 'Eisenpflüge'], w: 'Man fand sie bis ans Schwarze Meer und in Schiffswracks auf dem Meeresgrund.', svg: 'vase' },
      { f: 'Seit wann gab es <b>Münzgeld</b>?', a: 'seit Anfang des 6. Jahrhunderts v. Chr., zuerst in Kleinasien', x: ['schon in der Altsteinzeit', 'erst seit 1900', 'seit dem Bau der Pyramiden'], w: 'Zuerst aus einer Goldmischung, später aus Silber. Mit dem Handel verbreitete es sich.' },
      { f: 'Was zeigten die Silbermünzen Athens?', a: 'eine Eule', x: ['einen Pharao', 'eine Pyramide', 'ein Mammut'], w: 'Die Eule war das Tier der Göttin Athene.', svg: 'muenze' },
      { f: 'Warum musste Athen <b>Getreide</b> einführen?', a: 'Die Bevölkerung wuchs, und Attika hatte zu wenig Ackerland.', x: ['Weil die Athener kein Brot mochten.', 'Weil Getreide verboten war.', 'Weil es zu viel regnete.'], w: 'Schon seit Ende des 7. Jahrhunderts v. Chr. Bezahlt wurde mit Silber und Handwerkswaren.' },
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
      { t: 'Wer herrschte in Athen? Bringe die Herrschaftsformen in die richtige Reihenfolge.', items: ['Monarchie: ein König', 'Aristokratie: reiche Adlige', 'Tyrannis: ein Alleinherrscher mit Gewalt', 'Demokratie: das Volk'], s1: 'Athens Weg zur Demokratie, wie in einem Flussdiagramm:', w: 'Monarchie → Aristokratie → (Solons Reformen 594 v. Chr.) → Tyrannis des Peisistratos → Demokratie nach Kleisthenes (508/507 v. Chr.).' },
      { t: 'So entstand in Athen ein Beschluss. Bringe die Schritte in die richtige Reihenfolge.', items: ['Der Rat der 500 bereitet einen Vorschlag vor.', 'Die Volksversammlung berät auf der Pnyx.', 'Die Bürger stimmen per Handzeichen ab.', 'Beamte setzen den Beschluss um.'], s1: 'Wie ein Flussdiagramm: Schritt für Schritt.', w: 'Rat → Volksversammlung → Abstimmung → Umsetzung.' },
      { t: 'So lief ein Scherbengericht ab. Bringe die Schritte in die richtige Reihenfolge.', items: ['Die Volksversammlung beschließt ein Scherbengericht.', 'Jeder Bürger ritzt einen Namen in eine Tonscherbe.', 'Die Scherben werden gezählt (mindestens 6000).', 'Wer am häufigsten genannt wird, muss für 10 Jahre fort.'], s1: 'Das Scherbengericht, Schritt für Schritt:', w: 'Beschluss → Namen ritzen → zählen → Verbannung.' },
    ],
    F: [
      { f: 'Was bedeutet „<b>Demokratie</b>“?', a: 'Volksherrschaft', x: ['Königsherrschaft', 'Herrschaft der Götter', 'Herrschaft der Reichen'], w: 'Griechisch: dēmos = Volk, kratein = herrschen.' },
      { f: 'Wer legte um <b>508/507 v. Chr.</b> den Grundstein für die Demokratie in Athen?', a: 'Kleisthenes', x: ['Alexander der Große', 'Zeus', 'Tutanchamun'], w: 'Er nahm dem Adel Macht und gab sie den Bürgern.' },
      { f: 'Wo traf sich die <b>Volksversammlung</b>?', a: 'auf dem Hügel Pnyx', x: ['auf dem Olymp', 'in Olympia', 'in einer Pyramide'], w: 'Dort hatten etwa 8000 Menschen Platz. Die Versammlung fand viermal im Monat statt.' },
      { f: 'Was bedeutet „<b>Aristokratie</b>“?', a: 'Herrschaft der Besten (reiche Adlige)', x: ['Herrschaft des Volkes', 'Herrschaft eines Königs', 'Herrschaft der Götter'], w: 'Die Aristokraten besaßen viel Land, Pferde und Waffen.' },
      { f: 'Warum verlangten die <b>Hopliten</b> mehr Mitsprache?', a: 'Sie verteidigten als Fußsoldaten die Polis und bezahlten ihre Rüstung selbst.', x: ['Weil sie reiche Könige waren.', 'Weil sie Olympia gewonnen hatten.', 'Weil sie Sklaven waren.'], w: 'Hopliten waren Bauern, Handwerker und Händler. Sie kämpften in einer geschlossenen Reihe, der Phalanx.' },
      { f: 'Was tat <b>Solon</b> 594 v. Chr. für die Bauern?', a: 'Er erließ ihnen die Schulden und verbot, Athener wegen Schulden zu Sklaven zu machen.', x: ['Er schenkte jedem ein Pferd.', 'Er machte alle zu Königen.', 'Er verteilte das ganze Land neu.'], w: 'Das Land teilte er nicht neu auf. Arm und Reich blieben, und es gab weiter Streit.' },
      { f: 'Wie teilte <b>Kleisthenes</b> die Bürger neu ein?', a: 'in 10 Phylen, jede mit Teilen aus Stadt, Binnenland und Küste', x: ['nach Reichtum in arm und reich', 'nach Haarfarbe', 'in Familien mit Königen'], w: 'So wurden Bürger aus verschiedenen Gegenden gemischt. Jede Phyle schickte 50 Männer in den Rat der 500.' },
      { f: 'Wie viele <b>Strategen</b> (Feldherren) gab es in Athen?', a: '10, einen für jede Phyle', x: ['einen', '500', '6000'], w: 'Sie wurden gewählt, nicht gelost, und konnten wiedergewählt werden. Perikles war so ein Stratege.' },
      { f: 'Wer durfte in Athen <b>nicht</b> mitbestimmen, obwohl er Steuern zahlte und in den Krieg zog?', a: 'die Metöken (zugezogene Fremde)', x: ['die Bürger', 'die Strategen', 'die Hopliten mit Bürgerrecht'], w: 'Etwa 30.000 Bürger durften abstimmen, aber über 200.000 Menschen nicht: Frauen, Kinder, Metöken und Sklaven.' },
      { f: 'Was ist der Unterschied zwischen der Demokratie in Athen und heute in Deutschland?', a: 'In Athen stimmten die Bürger selbst ab, heute wählen wir Abgeordnete, die für uns entscheiden.', x: ['Es gibt keinen Unterschied.', 'In Athen wählten sie Abgeordnete, heute stimmen alle selbst ab.', 'Heute gibt es keine Wahlen.'], w: 'Man nennt das direkte und indirekte (repräsentative) Demokratie.' },
      { f: 'Was geschah beim <b>Scherbengericht</b>?', a: 'Ein zu mächtiger Bürger konnte für 10 Jahre verbannt werden.', x: ['Kaputtes Geschirr wurde verkauft.', 'Ein Sportler wurde zum Sieger erklärt.', 'Ein Pharao wurde gewählt.'], w: 'So wollte man verhindern, dass einer allein die Macht an sich reißt.', svg: 'ostrakon' },
      { f: 'Wie viele Stimmen brauchte ein Scherbengericht mindestens?', a: '6000', x: ['60', '600', '60.000'], w: 'Der Verbannte behielt sein Eigentum und durfte nach 10 Jahren zurück. Griechisch heißt die Scherbe „Ostrakon“.' },
      { f: 'Warum zahlte Athen später ein <b>Tagegeld</b> (Diäten)?', a: 'Damit auch arme Bürger zur Versammlung kommen konnten statt zu arbeiten.', x: ['Damit die Reichen noch reicher werden.', 'Als Eintritt für die Olympischen Spiele.', 'Weil Sklaven abstimmen durften.'], w: 'Diese Idee setzte der Politiker Perikles durch. Heute bekommen Abgeordnete auch Diäten.' },
      { f: 'Wie wurden viele Ämter in Athen besetzt, zum Beispiel der Rat der 500?', a: 'durch das Los', x: ['durch Erbschaft', 'durch den Pharao', 'durch ein Wettrennen'], w: 'Das Los sollte allen Bürgern die gleiche Chance geben.' },
      { f: 'Was ist ein großer <b>Unterschied</b> zur Demokratie heute?', a: 'Heute dürfen auch Frauen wählen, damals nicht.', x: ['Damals durften alle Menschen wählen.', 'Heute gibt es keine Wahlen mehr.', 'Damals gab es schon das Internet zum Abstimmen.'], w: 'In Athen bestimmten nur die erwachsenen männlichen Bürger. Die Mehrheit der Menschen war ausgeschlossen.' },
      { f: 'Wo kannst <b>du</b> heute schon mitbestimmen?', a: 'zum Beispiel bei der Wahl der Klassensprecher', x: ['bei der Wahl des Pharaos', 'beim Scherbengericht', 'nirgends, erst mit 80 Jahren'], w: 'In Familie, Schule und Verein kann man mitreden, abstimmen und Verantwortung übernehmen.' },
    ],
    T: [
      { f: 'Demokratie bedeutet ___.', a: 'Volksherrschaft', w: 'Das Volk herrscht.' },
      { f: 'Die Volksversammlung tagte auf dem Hügel ___.', a: 'Pnyx', w: 'Ganz in der Nähe der Akropolis.' },
      { f: 'Beim Scherbengericht wurde ein Bürger für ___ Jahre verbannt.', a: ['zehn', '10'], w: 'Danach durfte er zurückkehren.' },
      { f: 'Der Rat, der die Volksversammlung vorbereitete, hieß der Rat der ___.', a: ['500', 'Fünfhundert', 'fünfhundert'], w: '50 Ratsherren aus jeder der 10 Phylen. Je 50 führten für 36 Tage die Geschäfte (die Prytanie).' },
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
      { f: 'Was war der <b>Oikos</b>?', a: 'die Hausgemeinschaft: Familie, Sklaven, Besitz und Hausgötter', x: ['der Marktplatz', 'ein Tempel der Athene', 'ein Kriegsschiff'], w: 'Von „Oikos“ kommt unser Wort „Ökonomie“ (Wirtschaft). Der Hausherr leitete den Oikos.' },
      { f: 'Warum hatten die Bürger Athens Zeit für die <b>Politik</b>?', a: 'Frauen und Sklaven erledigten viele Arbeiten des Alltags.', x: ['Weil niemand arbeiten musste.', 'Weil Maschinen alles machten.', 'Weil Politik nur einmal im Jahr war.'], w: 'Nur die erwachsenen Männer hatten volle Bürgerrechte.' },
      { f: 'Ab welchem Alter bekamen Jungen in Athen ungefähr <b>Unterricht</b>?', a: 'ab etwa 6 Jahren, wenn die Eltern ihn bezahlen konnten', x: ['ab 18 Jahren in einer staatlichen Schule', 'nie', 'ab 2 Jahren im Kindergarten'], w: 'Schule war Privatsache und kostete Geld. Gelernt wurden Lesen, Schreiben, Flöte, Lyra und Sport.' },
      { f: 'Was durften junge Männer in Athen mit <b>18 Jahren</b>?', a: 'mit in die Volksversammlung, mussten aber auch Militärdienst leisten', x: ['den Pharao wählen', 'nichts Neues', 'als Sklaven arbeiten'], w: 'Vorher begleiteten sie ihre Väter auf die öffentlichen Plätze.' },
      { f: 'Wie viele der rund 400.000 Menschen in Attika waren ungefähr <b>Sklaven</b>?', a: 'etwa 80.000', x: ['etwa 80', 'etwa 800', 'alle'], w: 'Die meisten waren Kriegsgefangene. Sie galten als Sache und Eigentum.' },
      { f: 'Wo hatten es Sklaven in Athen am <b>schwersten</b>?', a: 'in den Bergwerken und Steinbrüchen', x: ['als Lehrer in reichen Familien', 'als Amme im Haus', 'im Haushalt eines reichen Bürgers'], w: 'Dort mussten sogar Kinder schuften, viele starben früh. Hausklaven wurden meist besser behandelt.' },
    ],
    T: [
      { f: 'Ein Sklave, der Jungen zur Schule brachte, hieß ___.', a: ['Paidagogos', 'Pädagoge'], w: 'Daher kommt unser Wort „Pädagoge“.' },
      { f: 'Freie Fremde ohne Bürgerrecht hießen in Athen ___.', a: ['Metöken', 'Metöke'], w: 'Metöke heißt „Mitbewohner“. Sie durften nicht mitbestimmen.' },
      { f: 'Die griechische Hausgemeinschaft hieß ___.', a: 'Oikos', w: 'Daher kommt unser Wort Ökonomie.' },
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
    h: 'Sparta war ein Kriegerstaat auf der Halbinsel Peloponnes. Die wenigen Spartiaten waren Krieger und bestimmten allein. Periöken („Umwohner“) waren frei, aber ohne Mitsprache. Die Heloten („Gefangene“) waren unfrei und die größte Gruppe.',
    O: [{ t: 'Das Leben eines Spartiaten: Bringe es in die richtige Reihenfolge.', items: ['Älteste prüfen das Neugeborene', 'bei der Mutter aufwachsen', 'mit 7 Jahren in eine Gruppe (Agogé)', 'mit 30 Jahren Vollbürger'], s1: 'Von der Geburt bis zum Vollbürger:', w: 'Prüfung nach der Geburt → bei den Eltern → ab 7 Jahren Erziehung in Gruppen → erst mit 30 Jahren Vollbürger.' }],
    S: { kats: SP, f: (x) => `Welche Gruppe in Sparta: <b>${x}</b>?`, h: 'Spartiaten: Krieger mit allen Rechten. Periöken: frei, Händler und Handwerker. Heloten: Unfreie auf den Feldern.',
      items: [['die einzigen Vollbürger', 0], ['Jungen ab 7 Jahren werden zu Kriegern erzogen', 0], ['die kleinste Gruppe', 0], ['frei, aber ohne politische Rechte', 1], ['Händler und Handwerker in den Orten ringsum', 1], ['müssen im Krieg mitkämpfen, dürfen aber nicht mitbestimmen', 1],
        ['unfrei, bestellen die Felder der Spartiaten', 2], ['die größte Gruppe', 2], ['unterworfene Bewohner des Landes', 2]] },
    F: [
      { f: 'Wo lag Sparta?', a: 'auf der Halbinsel Peloponnes', x: ['auf der Insel Kreta', 'in Ägypten am Nil', 'neben Athen in Attika'], w: 'Sparta lag im Süden Griechenlands.' },
      { f: 'Ab welchem Alter wurden spartanische Jungen vom Staat erzogen?', a: 'ab 7 Jahren', x: ['ab 18 Jahren', 'ab 2 Jahren', 'nie'], w: 'Sie lebten in Gruppen, lernten Kämpfen und Gehorchen, bekamen wenig zu essen und mussten Kälte aushalten.' },
      { f: 'Was bedeutet heute „<b>spartanisch</b>“?', a: 'sehr einfach, ohne Luxus', x: ['sehr reich und prächtig', 'sehr laut', 'sehr klug'], w: 'Die Spartiaten lebten absichtlich einfach und hart.' },
      { f: 'Wie viele <b>Könige</b> hatte Sparta gleichzeitig?', a: 'zwei', x: ['einen', 'keinen', 'zehn'], w: 'Je einer aus den zwei mächtigsten Adelsfamilien. Sie führten das Heer und waren Priester des Zeus.' },
      { f: 'Wer gehörte zur <b>Gerusia</b>, dem Ältestenrat?', a: '28 Männer über 60 Jahre und die beiden Könige', x: ['alle Heloten', '500 Bürger, ausgelost', 'nur Frauen'], w: 'Die Geronten wurden auf Lebenszeit gewählt. Sie wählten die Anträge für die Volksversammlung aus und waren Richter.' },
      { f: 'Wie stimmte die Volksversammlung (<b>Apella</b>) in Sparta ab?', a: 'durch lautes Rufen: Wer lauter rief, gewann', x: ['mit Tonscherben', 'per Handzeichen nach langer Diskussion', 'gar nicht'], w: 'Dazu gehörten alle männlichen Vollbürger ab 30. Diskutieren durften sie nicht, nur Ja oder Nein rufen.' },
      { f: 'Was taten die fünf <b>Ephoren</b>?', a: 'Sie überwachten die Könige und das ganze Leben der Polis.', x: ['Sie bauten Schiffe.', 'Sie unterrichteten die Mädchen.', 'Sie waren Sklaven der Könige.'], w: 'Sie wurden für ein Jahr gewählt und durften nicht wiedergewählt werden.' },
      { f: 'Warum nennt man Spartas Verfassung eine <b>Mischung</b>?', a: 'Sie hatte etwas von Monarchie (Könige), Aristokratie (Älteste) und Demokratie (Volksversammlung).', x: ['Weil sie aus Ägypten kam.', 'Weil jeden Tag eine andere galt.', 'Weil sie nur für Frauen galt.'], w: 'Keine Form war rein: Die Könige wurden kontrolliert, und das Volk durfte nur abstimmen.' },
      { f: 'Was mussten spartanische Jungen manchmal tun, um satt zu werden?', a: 'Essen stehlen, ohne erwischt zu werden', x: ['Essen im Laden kaufen', 'beim Pharao betteln', 'gar nichts, es gab reichlich'], w: 'Wer erwischt wurde, bekam Schläge: für ungeschicktes Stehlen. So sollten sie listig und abgehärtet werden.' },
      { f: 'Was verlor ein Spartiat, der seinen Beitrag zur <b>Speisegemeinschaft</b> nicht mehr zahlen konnte?', a: 'seine Rechte als Vollbürger', x: ['seinen Namen', 'nichts', 'seine Zähne'], w: 'Die Männer aßen gemeinsam in Speisegemeinschaften (Syssitien). Anfang des 5. Jahrhunderts gab es nur etwa 8000 Vollbürger.' },
      { f: 'Welche Region eroberte Sparta, deren Bewohner zu Heloten wurden?', a: 'Messenien', x: ['Attika', 'Ägypten', 'Kreta'], w: 'Um 500 v. Chr. war Sparta die stärkste Militärmacht Griechenlands.' },
      { f: 'Was war für spartanische <b>Frauen</b> anders als für Frauen in Athen?', a: 'Sie trieben Sport, erbten und besaßen Land.', x: ['Sie durften nie aus dem Haus.', 'Sie wurden Krieger im Heer.', 'Sie regierten als Königinnen allein.'], w: 'Sie leiteten den Oikos und beaufsichtigten die Heloten. Politische Rechte hatten aber auch sie nicht.' },
      { f: 'Warum mussten die Spartiaten ständig Krieger sein?', a: 'Sie fürchteten einen Aufstand der vielen Heloten.', x: ['Weil sie gegen Ägypten kämpften.', 'Weil sie die Olympischen Spiele gewinnen mussten.', 'Weil sie keine Felder hatten.'], w: 'Jedes Jahr erklärten sie den Heloten aufs Neue den Krieg, um sie einzuschüchtern. Zugleich lebten sie von deren Arbeit.' },
      { f: 'Was bedeutet „<b>lakonisch</b>“ antworten?', a: 'kurz und knapp', x: ['lang und ausführlich', 'auf Griechisch', 'singend'], w: 'Spartas Landschaft hieß Lakonien. Die Spartaner waren für kurze Antworten bekannt.' },
    ],
    T: [
      { f: 'Die unfreien Bauern in Sparta hießen ___.', a: ['Heloten', 'Helot'], w: 'Sie waren die größte Gruppe.' },
      { f: 'Die Vollbürger in Sparta hießen ___.', a: ['Spartiaten', 'Spartiat'], w: 'Sie waren alle Krieger.' },
      { f: 'Freie Bewohner ohne Mitbestimmung hießen in Sparta ___.', a: ['Periöken', 'Periöke'], w: '„Umwohner“: Sie lebten in den Orten rings um Sparta, zahlten Steuern und stellten Soldaten.' },
      { f: 'Die harte Erziehung der spartanischen Kinder hieß ___.', a: ['Agogé', 'Agoge'], w: 'Davon erzählt der Grieche Plutarch.' },
      { f: 'Der Ältestenrat in Sparta hieß ___.', a: 'Gerusia', w: 'Geron = alter Mann.' },
    ],
    A: { w: ['Sparta hatte zwei Könige.', 'Die Heloten waren die größte Gruppe in Sparta.', 'Spartanische Jungen wurden ab 7 Jahren zu Kriegern erzogen.'], f: ['In Sparta durften die Heloten abstimmen.', 'Sparta lag am Nil.', 'Die Spartiaten waren die größte Gruppe.'] },
    extra: { spPyramide },
  }, { sortieren: 22, passtNicht: 8, frage: 30, tippen: 12, aussage: 12, spPyramide: 16 });

  const vergleich = baue('g5-vergleich', {
    h: 'Athen: Demokratie, Handel übers Meer, Theater und Tempel. Sparta: zwei Könige, Militärstaat, harte Erziehung, Heloten.',
    S: { kats: ['Athen', 'Sparta'], f: (x) => `Athen oder Sparta? <b>${x}</b>`, h: 'Athen: Demokratie und Handel. Sparta: Krieger und Könige.',
      items: [['viele Bürger entscheiden in der Volksversammlung', 0], ['Scherbengericht', 0], ['Rat der 500', 0], ['Jungen lernen Lesen, Schreiben und Musik, wenn die Eltern zahlen', 0], ['Gerusia und Ephoren', 1], ['Volksversammlung stimmt durch Rufen ab', 1], ['großer Hafen und viel Handel', 0], ['Theater und prächtige Tempel', 0], ['Silbermünzen mit einer Eule', 0], ['Schutzgöttin Athene', 0],
        ['zwei Könige', 1], ['Jungen ab 7 Jahren werden zu Kriegern erzogen', 1], ['Heloten bestellen die Felder', 1], ['Frauen treiben Sport und verwalten Landgüter', 1], ['liegt auf der Halbinsel Peloponnes', 1], ['einfaches, hartes Leben für den Staat', 1]] },
    F: [
      { f: 'Wer gewann den langen <b>Krieg zwischen Athen und Sparta</b> (431 bis 404 v. Chr.)?', a: 'Sparta', x: ['Athen', 'Ägypten', 'niemand, er endete nie'], w: 'Man nennt ihn den Peloponnesischen Krieg. Danach erholte sich Athen nur langsam.' },
      { f: 'Gegen wen kämpften Athen und Sparta <b>gemeinsam</b>?', a: 'gegen die Perser', x: ['gegen die Ägypter', 'gegen die Römer', 'gegen die Olympioniken'], w: 'In den Perserkriegen (500 bis 479 v. Chr.) besiegten sie gemeinsam die Heere der Großkönige Dareios und Xerxes.' },
      { f: 'Wie endete der Peloponnesische Krieg für <b>beide</b> Städte?', a: 'Beide waren geschwächt und verloren bald an Macht.', x: ['Beide wurden reicher als je zuvor.', 'Athen und Sparta wurden eine Stadt.', 'Beide wurden Teil Ägyptens.'], w: 'Davon profitierte später Makedonien.' },
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
  // Themen nach dem Buchabgleich (15.11.2026): Seiten, die GeDax noch fehlten. Alles in eigenen Worten.
  // =====================================================
  // ---------- S. 9: Von der kleinen zur großen Geschichte ----------
  const klein = baue('g5-klein', {
    h: 'Jeder Mensch hat seine eigene „kleine“ Geschichte: Lebenslauf, Familie, Stammbaum. Sie ist ein Teil der Geschichte des Ortes, der Region, des Landes und der Welt.',
    O: [{ t: 'Von klein nach groß: Bringe die Geschichten in die richtige Reihenfolge.', items: ['meine Geschichte', 'Ortsgeschichte (Dresden)', 'Regionalgeschichte (Sachsen)', 'Nationalgeschichte (Deutschland)', 'Weltgeschichte'], n: 4, s1: 'Jede kleine Geschichte steckt in einer größeren:', w: 'meine Geschichte → Ort → Region → Land → Welt.' }],
    S: { kats: ['meine eigene Geschichte', 'Geschichte des Ortes oder der Region', 'Weltgeschichte'], f: (x) => `Wozu gehört das? <b>${x}</b>`, h: 'Betrifft es dich, deinen Ort oder die ganze Welt?',
      items: [['mein erster Schultag', 0], ['die Geburt meiner Schwester', 0], ['Omas Umzug in unsere Stadt', 0], ['Dresden wird zum ersten Mal erwähnt', 1], ['die Gründung der Schule in meinem Stadtteil', 1], ['eine Hochwasser-Marke am Rathaus', 1], ['der Bau der Pyramiden', 2], ['die ersten Olympischen Spiele', 2], ['die Erfindung der Schrift', 2]] },
    F: [
      { f: 'Wie schreibt man einen <b>Lebenslauf</b> oft auf?', a: 'als Tabelle: Jahr und was passiert ist', x: ['als Gedicht', 'als Landkarte', 'in Hieroglyphen'], w: 'Ein tabellarischer Lebenslauf ordnet die wichtigsten Ereignisse nach der Zeit.' },
      { f: 'In welche Richtung wächst ein <b>Stammbaum</b> meistens?', a: 'von unten nach oben: die Kinder stehen über den Eltern', x: ['von oben nach unten wie Regen', 'von links nach rechts wie ein Text', 'im Kreis'], w: 'Wie ein Baum aus der Wurzel: unten die ältesten Vorfahren, oben die jüngsten.' },
      { f: 'Warum führten Herrscherfamilien ihren Stammbaum oft auf <b>Götter</b> oder alte Könige zurück?', a: 'um zu zeigen, dass sie zu Recht herrschen', x: ['weil sie gern malten', 'weil es Pflicht in der Schule war', 'weil Götter Nachnamen hatten'], w: 'Eine berühmte Abstammung sollte Würde und Macht beweisen.' },
      { f: 'Was gehört in die <b>Ortsgeschichte</b>?', a: 'was in deinem Wohnort früher passiert ist', x: ['nur was in Ägypten passiert ist', 'nur dein Geburtstag', 'nur die Zukunft'], w: 'Ortsgeschichte → Regionalgeschichte → Nationalgeschichte → Weltgeschichte.' },
      { f: 'Woher kann man etwas über die eigene <b>Familiengeschichte</b> erfahren?', a: 'aus alten Fotos, Briefen und Erzählungen der Großeltern', x: ['nur aus dem Fernsehen', 'gar nicht', 'aus dem Wetterbericht'], w: 'Das sind Quellen: bildliche, schriftliche und mündliche Überlieferung.' },
    ],
    T: [{ f: 'Eine Zeichnung der Vorfahren einer Familie heißt ___.', a: ['Stammbaum', 'Stammbäume'], w: 'Er zeigt, wer von wem abstammt.' }],
  }, { ordnen: 22, sortieren: 30, passtNicht: 10, frage: 28, tippen: 10 });

  // ---------- S. 10–11: Zeit messen und Kalender ----------
  const KAL = [['christlicher Kalender', 'Geburt Christi', 'Sonnenkalender'], ['muslimischer Kalender', 'Auszug Mohammeds aus Mekka (622 n. Chr.)', 'Mondkalender'], ['jüdischer Kalender', 'Erschaffung der Welt nach der Bibel (3761 v. Chr.)', 'Sonnen- und Mondkalender'], ['römischer Kalender', 'Gründung der Stadt Rom (753 v. Chr.)', 'Sonnenkalender']];
  function kalStart() {
    const k = R(0, KAL.length - 1), ch = shuffle(KAL.map((x) => x[1])), q = `Womit beginnt die Zählung im <b>${KAL[k][0]}</b>?`;
    return { prompt: q, choices: ch, correct: ch.indexOf(KAL[k][1]), hint: 'Jeder Kalender zählt ab einem wichtigen Ereignis.', solution: `<b>${KAL[k][1]}</b>.`,
      ex: { mode: 'karte', nach: false, art: 'kalStart', q: nurText(q), opts: ch, ok: ch.indexOf(KAL[k][1]), svg: '', merk: `${KAL[k][0]}: ab <b>${KAL[k][1]}</b>.` } };
  }
  const kalender = baue('g5-kalender', {
    h: 'Ein Mondmonat dauert von Vollmond zu Vollmond, etwa 29,5 Tage. Ein Mondjahr (12 Monate) hat etwa 354 Tage, ein Sonnenjahr etwa 365 Tage. Alle vier Jahre gibt es ein Schaltjahr mit 366 Tagen.',
    O: [{ t: 'Womit maßen die Menschen die Zeit? Ordne nach der Zeit: <b>das Älteste zuerst</b>.', items: ['Sonne und Mond beobachten', 'Sonnenuhr', 'mechanische Uhr (um 1400)', 'Armbanduhr und Handy'], s1: 'Vom Himmel bis zum Handy:', w: 'Erst beobachtete man den Himmel, dann baute man Sonnen- und Sanduhren, um 1400 mechanische Uhren.' }],
    F: [
      { f: 'Woher hat der <b>Monat</b> seinen Namen?', a: 'vom Mond', x: ['von einem König namens Monat', 'vom Montag', 'von der Sonne'], w: 'Von Vollmond zu Vollmond vergehen etwa 29,5 Tage.' },
      { f: 'Wie viele Tage hat ein <b>Mondjahr</b> mit 12 Monaten ungefähr?', a: 'etwa 354', x: ['genau 365', '100', 'etwa 500'], w: '12 × 29,5 = 354. Das Sonnenjahr ist etwa 11 Tage länger.' },
      { f: 'Wie viele Tage hat ein <b>Schaltjahr</b>?', a: '366', x: ['365', '354', '360'], w: 'Weil das Sonnenjahr etwas länger als 365 Tage dauert, gibt es alle vier Jahre einen Tag mehr: den 29. Februar.' },
      { f: 'Welcher Kalender richtet sich nach dem <b>Mond</b>?', a: 'der muslimische Kalender', x: ['der christliche Kalender', 'der Kalender an der Schule', 'kein Kalender'], w: 'Unser christlicher Kalender ist ein Sonnenkalender, der jüdische nutzt Sonne und Mond.' },
      { f: 'Die Römer zählten die Jahre „ab urbe condita“. Was heißt das?', a: 'ab Gründung der Stadt (Rom, 753 v. Chr.)', x: ['ab der Geburt Christi', 'ab den Olympischen Spielen', 'ab dem Bau der Pyramiden'], w: 'Jede Kultur wählte ein wichtiges Ereignis als Startpunkt.' },
      { f: 'Welche Uhr funktioniert <b>ohne Sonne</b> und ohne Strom?', a: 'die Sanduhr', x: ['die Sonnenuhr', 'die Funkuhr', 'keine'], w: 'Sand rinnt immer gleich schnell durch die enge Stelle.' },
      { f: 'Ab wann gibt es Uhren mit einem <b>Räderwerk</b> (mechanische Uhren)?', a: 'um 1400', x: ['um 3000 v. Chr.', 'um 1990', 'in der Steinzeit'], w: 'Später kamen Zifferblätter und Zeiger dazu.' },
    ],
    T: [
      { f: 'Ein Jahr mit 366 Tagen heißt ___.', a: ['Schaltjahr', 'Schaltjahre'], w: 'Alle vier Jahre.' },
      { f: 'Unser Kalender richtet sich nach der ___.', a: 'Sonne', w: 'Ein Sonnenjahr hat etwa 365 Tage.' },
    ],
    extra: { kalStart },
  }, { frage: 40, tippen: 14, ordnen: 14, kalStart: 24 });

  // ---------- S. 26–29: Felsbilder in der Sahara ----------
  const FELS = ['Wildtiere wie Giraffen und Nashörner (Jäger und Sammler)', 'Rinderherden und Dorfleben der Hirten', 'Reiter auf galoppierenden Pferden', 'Kamele (Dromedare)'];
  const felsbilder = baue('g5-felsbilder', {
    h: 'Im Ennedi-Gebirge im Tschad malten Menschen über Tausende Jahre Bilder an die Felsen. Sie zeigen, wie die Sahara langsam vom Grasland zur Wüste wurde.',
    O: [{ t: 'Felsbilder in der Sahara: Was wurde zuerst gemalt? Ordne <b>das Älteste zuerst</b>.', items: FELS, s1: 'Vier Zeiten auf den Felsen:', w: 'Wildtiere (8000–5000 v. Chr.) → Rinder (5000–1000 v. Chr.) → Pferde mit Reitern (ab 1000 v. Chr.) → Kamele (ab etwa Christi Geburt). Heute kommen manchmal Kritzeleien von Besuchern dazu.' }],
    S: { kats: ['Die Sahara war grün.', 'Die Sahara wurde zur Wüste.'], f: (x) => `Was zeigt dieses Felsbild? <b>${x}</b>`, h: 'Giraffen und Rinder brauchen Gras und Wasser. Kamele kommen auch in der Wüste zurecht.',
      items: [['Giraffen', 0], ['Nashörner', 0], ['Rinderherden mit Hirten', 0], ['Menschen mit runden Köpfen auf der Jagd', 0], ['Ziegen statt Rinder', 1, 'Ziegen brauchen weniger Wasser'], ['Kamele mit Reitern', 1, 'Kamele überstehen lange Durststrecken']] },
    F: [
      { f: 'Wo liegen die Felsbilder, von denen dein Buch erzählt?', a: 'im Ennedi-Gebirge im Tschad, in der Sahara', x: ['in der Höhle von Lascaux', 'am Nil in Kairo', 'in den Alpen bei Ötzi'], w: 'Ein Hochland aus Sandstein mit Wasserstellen, manchmal „Garten Eden der Sahara“ genannt.' },
      { f: 'Was verraten die Felsbilder über das <b>Klima</b>?', a: 'Die Sahara trocknete in 10.000 Jahren langsam aus.', x: ['Dort war es immer Wüste.', 'Es lag dort früher Schnee.', 'Sie verraten nichts.'], w: 'Erst Wildtiere, dann Rinder, dann Ziegen und Kamele: Die Tiere passen sich dem trockeneren Land an.' },
      { f: 'Wie helfen <b>Computer</b> beim Erforschen der Felsbilder?', a: 'Mit Fotos und Bildbearbeitung werden verblasste und übermalte Bilder sichtbar.', x: ['Computer malen die Bilder neu.', 'Gar nicht.', 'Computer graben die Felsen aus.'], w: 'So erkennt man auch, welches Bild über einem älteren liegt.' },
      { f: 'Woran erkennt man, welches Bild <b>älter</b> ist, wenn zwei übereinander gemalt sind?', a: 'Das untere Bild ist älter.', x: ['Das obere Bild ist älter.', 'Das buntere ist älter.', 'Das kann man nie wissen.'], w: 'Was später gemalt wurde, liegt darüber, wie bei Schichten im Boden.' },
      { f: 'Was zeigen die Felsbilder außer Tieren?', a: 'Alltag: Kleidung, Frisuren, Hütten, Tanz und Reiten', x: ['nur Zahlen', 'Pyramiden und Pharaonen', 'Landkarten von Europa'], w: 'Sie sind bildliche Quellen über Menschen, die nichts aufgeschrieben haben.' },
    ],
    T: [{ f: 'Die Felsbilder liegen im ___-Gebirge im Tschad.', a: 'Ennedi', w: 'Mitten in der Sahara.' }],
  }, { ordnen: 26, sortieren: 22, passtNicht: 8, frage: 34, tippen: 10 });

  // ---------- S. 32–35: Handel in der Bronzezeit, Beispiel Afrika ----------
  function karawaneRechnen() {
    const art = R(0, 2);
    if (art === 0) { const kruege = pick([40, 60, 80, 100, 120, 200]), esel = kruege / 4;
      return { prompt: `Ein Krug voll Wasser wog etwa <b>15 kg</b>, ein Esel trug etwa <b>60 kg</b>. Wie viele Esel brauchte man für <b>${kruege} Krüge</b>?`, fields: [{ answer: esel, label: 'Esel', suffix: 'Esel' }], hint: 'Rechne erst: Wie viele Krüge trägt ein Esel? 60 : 15 = …',
        solution: `60 : 15 = 4 Krüge je Esel. ${kruege} : 4 = <b>${esel}</b> Esel.`, ex: { mode: 'karte', nach: false, art: 'karawaneRechnen', q: `${kruege} Krüge, 4 Krüge je Esel`, opts: [`${esel} Esel`], ok: 0, svg: '', merk: `${kruege} : 4 = <b>${esel}</b> Esel.` } }; }
    if (art === 1) { const tage = pick([2, 3, 4, 5, 6]), km = tage * 25;
      return { prompt: `Eine Eselkarawane schaffte etwa <b>25 km am Tag</b>. Wie weit kam sie in <b>${tage} Tagen</b>?`, fields: [{ answer: km, label: 'km', suffix: 'km' }], hint: 'Kilometer pro Tag mal Anzahl der Tage.',
        solution: `${tage} × 25 = <b>${km}</b> km.`, ex: { mode: 'karte', nach: false, art: 'karawaneRechnen', q: `${tage} Tage zu je 25 km`, opts: [`${km} km`], ok: 0, svg: '', merk: `${tage} × 25 = <b>${km}</b> km.` } }; }
    const depots = pick([2, 3, 4, 5]), tage = depots * 3;
    return { prompt: `Alle <b>3 Tagesmärsche</b> lag ein Wasserlager. Die Karawane kam an <b>${depots}</b> Lagern vorbei, das letzte am Ziel. Wie viele Tage war sie unterwegs?`, fields: [{ answer: tage, label: 'Tage', suffix: 'Tage' }], hint: 'Für jedes Lager 3 Tage.',
      solution: `${depots} × 3 = <b>${tage}</b> Tage.`, ex: { mode: 'karte', nach: false, art: 'karawaneRechnen', q: `${depots} Lager, je 3 Tage`, opts: [`${tage} Tage`], ok: 0, svg: '', merk: `${depots} × 3 = <b>${tage}</b> Tage.` } };
  }
  const karawane = baue('g5-karawane', {
    h: 'Schon um 2100 v. Chr. zogen Eselkarawanen der Pharaonen von der Oase Dachla tief in die Libysche Wüste. Unterwegs lagen Tonkrüge mit Wasser als Vorrat: der Abu-Ballas-Weg.',
    O: [{ t: 'Wie der Abu-Ballas-Weg entdeckt wurde: Bringe es in die richtige Reihenfolge.', items: ['Pharaonen schicken Eselkarawanen durch die Wüste', 'Britische Forscher finden mit dem Auto viele Tonkrüge', 'Ein Prinz nennt den Ort „Vater der Tonkrüge“', 'Carlo Bergmann findet den ganzen Weg mit Wegzeichen'], s1: 'Von den Pharaonen bis heute:', w: 'um 2100 v. Chr. Karawanen → 1918 Fund der Krüge → Name „Abu Ballas“ → 1999/2000 Entdeckung des ganzen Weges.' }],
    F: [
      { f: 'Was bedeutet „<b>Abu Ballas</b>“?', a: '„Vater der Tonkrüge“', x: ['„Sohn des Nils“', '„Weg der Esel“', '„Großes Haus“'], w: 'Dort fand man über 100 alte Wasserkrüge.' },
      { f: 'Wozu dienten die vielen Tonkrüge mitten in der Wüste?', a: 'als Wasserlager für die Karawanen', x: ['als Grabbeigaben', 'als Spielzeug', 'als Wegweiser aus Gold'], w: 'Etwa alle drei Tagesmärsche lag ein solches Lager. Ein Esel hält etwa drei Tage ohne Wasser aus.' },
      { f: 'Welche Tiere trugen die Lasten der Karawanen?', a: 'Esel', x: ['Kamele', 'Pferde', 'Elefanten'], w: 'Kamele kamen erst viel später nach Ägypten, um 500 v. Chr.' },
      { f: 'Woran erkannte der Forscher den alten Weg?', a: 'an Wegzeichen aus Steinen und an Spuren von Eselhufen', x: ['an Straßenschildern', 'an einer alten Landkarte aus Papier', 'an Bahnschienen'], w: 'Steinhaufen und Türme zeigten den Weg über etwa 400 Kilometer.' },
      { f: 'Welche Waren holten die Ägypter aus dem Inneren Afrikas?', a: 'Luxuswaren wie Weihrauch, Elfenbein und Ebenholz', x: ['Kartoffeln und Mais', 'Autos', 'Papier aus China'], w: 'Für den Handel brauchte man feste Wege, Rastplätze und Vorräte.' },
      { f: 'Wer berichtete schon im 5. Jahrhundert v. Chr. von diesem Trick mit den Wasserkrügen?', a: 'der Grieche Herodot', x: ['Ötzi', 'Champollion', 'Tutanchamun'], w: 'So bestätigen sich ein alter Text und ein Fund gegenseitig.' },
    ],
    T: [{ f: 'Der Wüstenweg mit den Wasserkrügen heißt Abu-___-Weg.', a: 'Ballas', w: '„Vater der Tonkrüge“.' }],
    extra: { karawaneRechnen },
  }, { ordnen: 16, frage: 40, tippen: 10, karawaneRechnen: 34 });

  // ---------- S. 36–37: Die Kelten ----------
  const kelten = baue('g5-kelten', {
    h: 'Die Kelten waren viele Volksstämme zwischen Spanien und den Alpen. Ein Zentrum war Hallstatt in Österreich: Dort baute man Salz ab und handelte damit. Die Kelten schrieben nichts auf.',
    S: { kats: ['Das wissen wir aus Ausgrabungen.', 'Das wissen wir aus Texten anderer Völker.'], f: (x) => `Woher wissen wir: <b>${x}</b>?`, h: 'Die Kelten hatten keine eigene Schrift. Was sie dachten, schrieben Griechen und Römer auf.',
      items: [['Reiche Kelten bekamen Wagen und Schmuck mit ins Grab.', 0], ['In Hallstatt baute man Salz ab.', 0], ['Die Kelten wohnten in befestigten Siedlungen.', 0], ['Die Römer nannten die Kelten „Gallier“.', 1], ['Griechen gaben ihnen den Namen „Kelten“.', 1]] },
    F: [
      { f: 'Warum wissen wir von den Kelten nichts aus ihren <b>eigenen</b> Texten?', a: 'Sie hatten keine Schrift und erzählten ihr Wissen mündlich weiter.', x: ['Ihre Bücher sind alle verbrannt.', 'Sie schrieben nur auf Chinesisch.', 'Sie hatten verboten, über sie zu sprechen.'], w: 'Wir kennen sie aus Funden und aus Texten von Griechen und Römern.' },
      { f: 'Womit wurde <b>Hallstatt</b> reich?', a: 'mit Salz', x: ['mit Gold aus dem Meer', 'mit Papyrus', 'mit Erdöl'], w: 'Salz machte Essen haltbar und war sehr wertvoll. Dafür bekam man Gold, Bernstein, Glas und Bronze.' },
      { f: 'Was verraten <b>Grabbeigaben</b> über einen Menschen?', a: 'Je reicher die Beigaben, desto höher stand er in der Gemeinschaft.', x: ['Wie alt er seinen Hund werden ließ.', 'Welche Schule er besuchte.', 'Gar nichts.'], w: 'In Hallstatt fand man 1846 über 1000 Gräber, manche mit Wagen und Waffen.' },
      { f: 'Wie nannten die <b>Römer</b> die Kelten?', a: 'Gallier', x: ['Hellenen', 'Spartiaten', 'Pharaonen'], w: 'Die Griechen nannten sie „Kelten“.' },
      { f: 'Ungefähr wann lebten die Kelten in Mitteleuropa?', a: 'von etwa 800 v. Chr. bis Christi Geburt', x: ['von 1500 bis 1800 n. Chr.', 'in der Altsteinzeit', 'erst seit 1990'], w: 'Dann wurden sie von Römern und Germanen zurückgedrängt. Reste ihrer Sprache leben in Irland, Wales und der Bretagne weiter.' },
    ],
    T: [{ f: 'Das berühmte keltische Salzbergwerk liegt in ___ in Österreich.', a: 'Hallstatt', w: 'Nach dem Ort ist sogar eine Zeit benannt: die Hallstattzeit.' }],
  }, { sortieren: 26, frage: 44, tippen: 12, passtNicht: 0 });

  // ---------- S. 50–51: Klimawandel – die Sahara wird zur Wüste ----------
  const klima = baue('g5-klima', {
    h: 'Vor etwa 10.000 Jahren war die Sahara eine Savanne mit Gras und Tieren. Ab etwa 5300 v. Chr. regnete es immer weniger. Um 3500 v. Chr. war sie Wüste, und die Menschen zogen an den Nil.',
    O: [{ t: 'Die Sahara im Wandel: Bringe es in die richtige Reihenfolge.', items: ['Kaltzeit: Die Sahara ist trocken und leer.', 'Es wird feuchter: Gras, Tiere und Menschen kommen.', 'Es regnet immer weniger.', 'Die Sahara ist Wüste, die Menschen ziehen an den Nil.'], s1: 'Vom Grasland zur Wüste:', w: 'Kaltzeit (um 19.000 v. Chr.) → Savanne (ab etwa 8500 v. Chr.) → weniger Regen (ab 5300 v. Chr.) → Wüste (um 3500 v. Chr.).' }],
    F: [
      { f: 'Wie sah die Sahara vor etwa 10.000 Jahren aus?', a: 'wie eine Savanne mit Gras und wilden Tieren', x: ['genau wie heute', 'wie ein Gletscher', 'wie eine Großstadt'], w: 'Menschen jagten, fischten und sammelten dort und stellten Töpfe für Vorräte her.' },
      { f: 'Warum zogen die Menschen schließlich an den <b>Nil</b>?', a: 'Die Sahara trocknete aus, nur am Nil gab es genug Wasser.', x: ['Weil dort schon Pyramiden standen.', 'Weil es am Nil kälter war.', 'Weil der Pharao sie rief.'], w: 'So entstanden am Nil die ersten Bauerndörfer und später die Hochkultur.' },
      { f: 'Warum nennt man den Menschen einen „<b>Klimaanzeiger</b>“?', a: 'Er siedelt nur dort, wo es genug Wasser gibt.', x: ['Weil er das Wetter macht.', 'Weil er ein Thermometer trägt.', 'Weil er nie umzieht.'], w: 'Wo Menschen lebten, muss es Wasser gegeben haben.' },
      { f: 'Was waren früher Ursachen für einen <b>Klimawandel</b>?', a: 'natürliche Ursachen wie Vulkane, Meeresströmungen oder die Sonne', x: ['Autos und Fabriken', 'Handys', 'die Pyramiden'], w: 'Heute verändert vor allem der Mensch das Klima. Seit etwa 150 Jahren ist es auf der Erde um rund 1 Grad wärmer geworden.' },
      { f: 'Ungefähr wann war die Sahara zur <b>Wüste</b> geworden?', a: 'um 3500 v. Chr.', x: ['um 1900', 'um 350 n. Chr.', 'vor 35 Millionen Jahren'], w: 'Nur in Oasen gab es noch Wasser.' },
    ],
    A: { w: ['Die Sahara war früher grüner als heute.', 'Die Austrocknung trieb Menschen an den Nil.', 'Klima kann sich auch ohne Menschen ändern.'], f: ['Die Sahara war schon immer eine Wüste.', 'In der Sahara regnet es heute sehr viel.', 'Der Klimawandel betrifft nur Ägypten.'] },
  }, { ordnen: 22, frage: 52, aussage: 26 });

  // ---------- S. 78–80: Woher wissen wir etwas über die Ägypter? ----------
  const quellenAg = baue('g5-quellen-ag', {
    h: 'Über Ägypten wissen wir viel aus Gräbern, Tempeln, Papyrus und Inschriften. Aber Vorsicht: Die Ägypter stellten ihre Könige schöner und siegreicher dar, als sie waren.',
    S: { kats: ['gegenständliche Quelle', 'bildliche Quelle', 'schriftliche Quelle'], f: (x) => `Was für eine Quelle über Ägypten ist <b>${x}</b>?`, h: 'Gegenstand, Bild oder Text?',
      items: [['eine Mumie', 0], ['die Goldmaske des Tutanchamun', 0], ['eine Pyramide', 0, 'auch Bauwerke sind gegenständliche Quellen'], ['ein Krug aus einem Grab', 0], ['eine Wandmalerei in einem Grab', 1], ['ein Relief, das Ramses als Sieger zeigt', 1], ['ein Papyrus mit dem Totenbuch', 2], ['eine Steuerliste auf einem Kalksteinsplitter', 2], ['der Stein von Rosette', 2, 'darauf steht ein Text'], ['der Bericht des Griechen Herodot', 2, 'Herodot besuchte Ägypten um 450 v. Chr.']] },
    F: [
      { f: 'Wer entdeckte <b>1922</b> das Grab des Tutanchamun?', a: 'Howard Carter', x: ['Champollion', 'Herodot', 'Narmer'], w: 'Das Grab im Tal der Könige bei Luxor war fast unberührt.' },
      { f: 'Wie alt wurde Tutanchamun ungefähr?', a: 'etwa 20 Jahre', x: ['etwa 90 Jahre', 'etwa 5 Jahre', 'etwa 50 Jahre'], w: 'Woran er starb, weiß man bis heute nicht sicher: Unfall, Mord oder Krankheit?' },
      { f: 'Der Priester Manetho teilte die Pharaonen in 30 Gruppen ein. Wie heißen sie?', a: 'Dynastien (Königsfamilien)', x: ['Pyramiden', 'Phylen', 'Poleis'], w: 'Sein Buch ist verloren, nur Abschriften blieben. Seine Einteilung benutzt man aber bis heute.' },
      { f: 'Warum sind von ägyptischen <b>Häusern</b> kaum Reste da, von Tempeln aber viele?', a: 'Häuser waren aus Lehmziegeln, Tempel für die Ewigkeit aus Stein.', x: ['Häuser wurden alle gestohlen.', 'Es gab keine Häuser.', 'Tempel waren aus Holz.'], w: 'Ungebrannte Ziegel aus Nilschlamm zerfallen mit der Zeit.' },
      { f: 'Warum sollte man einem ägyptischen Bild von einem großen <b>Sieg</b> nicht einfach glauben?', a: 'Auch verlorene oder knappe Schlachten wurden als Triumph dargestellt.', x: ['Weil Bilder immer lügen.', 'Weil die Ägypter nicht malen konnten.', 'Weil es in Ägypten keine Kriege gab.'], w: 'Ramses II. entkam bei Kadesch nur knapp einer Niederlage, seine Tempel zeigen einen Sieg. Auch Statuen zeigen Könige immer jung und schön.' },
      { f: 'Warum fehlt Tutanchamun in einer alten <b>Königsliste</b>?', a: 'Man ließ Könige weg, die nicht ins gewünschte Bild passten.', x: ['Weil er nie gelebt hat.', 'Weil die Liste zu kurz war.', 'Weil er Grieche war.'], w: 'Er war ein Sohn des Echnaton, der die alten Götter abgeschafft hatte. Auch so eine Liste muss man kritisch lesen.' },
      { f: 'Worauf schrieben die Ägypter <b>im Alltag</b> schnelle Notizen, wenn Papyrus zu teuer war?', a: 'auf Kalksteinsplitter und Tonscherben', x: ['auf Papier aus dem Laden', 'auf Wachstafeln aus Sparta', 'auf Tafeln aus Glas'], w: 'Solche „Schreibblöcke“ verraten viel: Steuerlisten, Briefe, Berichte.' },
      { f: 'Woher weiß man heute, wie Tutanchamuns Gesicht wirklich aussah?', a: 'Forscher bauten es 2005 mithilfe von Röntgenbildern seiner Mumie nach.', x: ['von einem Foto aus der Zeit', 'aus einem Brief seiner Mutter', 'gar nicht'], w: 'Die Goldmaske zeigt ihn dagegen als idealen, schönen König.' },
    ],
    T: [{ f: 'Die Wissenschaft vom alten Ägypten heißt ___.', a: ['Ägyptologie'], w: 'Forscher dieses Fachs heißen Ägyptologen.' }],
    A: { w: ['Grabmalereien sind bildliche Quellen.', 'Ägyptische Bilder zeigen Könige oft schöner, als sie waren.', 'Tutanchamuns Grab wurde 1922 entdeckt.'], f: ['Eine Mumie ist eine schriftliche Quelle.', 'Ägyptische Königslisten sind immer vollständig.', 'Alles über Ägypten wissen wir aus Kinofilmen.'] },
  }, { sortieren: 28, passtNicht: 10, frage: 40, tippen: 8, aussage: 14 });

  // ---------- S. 124–128: Wahlbereich Alexander der Große und der Hellenismus ----------
  const alexander = baue('g5-alexander', {
    h: 'Alexander wurde mit 20 Jahren König von Makedonien (336 v. Chr.). Er eroberte das Perserreich, Ägypten und zog bis zum Indus. Er starb 323 v. Chr. mit 33 Jahren. Danach breitete sich die griechische Kultur bis nach Indien aus: der Hellenismus.',
    O: [{ t: 'Alexanders Leben: Ordne nach der Zeit: <b>das Früheste zuerst</b>.', items: ['Alexander wird König', 'Sieg bei Issos über den Perserkönig', 'Zug bis zum Fluss Indus', 'Tod in Babylon'], j: [-336, -333, -327, -323], kurz: ['König', 'Issos', 'Indus', 'Tod'], n: 4, w: 'Nur 13 Jahre zwischen Herrschaftsantritt und Tod.' }],
    F: [
      { f: 'Wer machte Makedonien zur stärksten Militärmacht Griechenlands?', a: 'König Philipp II., Alexanders Vater', x: ['Perikles', 'Leonidas', 'Ramses II.'], w: 'Sein Heer kämpfte in einer Phalanx mit sehr langen Lanzen, der Adel ritt als Reiterei.' },
      { f: 'Wie alt war Alexander, als er <b>König</b> wurde?', a: '20 Jahre', x: ['5 Jahre', '50 Jahre', '33 Jahre'], w: 'Sein Vater war 336 v. Chr. ermordet worden.' },
      { f: 'Was tat Alexander 334 v. Chr. am <b>Hellespont</b>?', a: 'Er warf einen Speer ans Ufer Asiens und erklärte das Land zu seinem Eigentum.', x: ['Er baute eine Pyramide.', 'Er gründete die Olympischen Spiele.', 'Er kehrte sofort um.'], w: 'Damit begann der Feldzug gegen die Perser.' },
      { f: 'Wo starb Alexander?', a: 'in Babylon, mit 33 Jahren, an einem Fieber', x: ['in Athen bei einem Wettlauf', 'in Sparta im Kampf', 'in Alexandria im Hafen'], w: 'Er hatte gerade einen Feldzug nach Arabien geplant.' },
      { f: 'Wie wollte Alexander Griechen und Perser <b>zusammenbringen</b>?', a: 'Er übernahm persische Bräuche, heiratete eine Perserin und gründete neue Städte.', x: ['Er verbot den Persern ihre Sprache.', 'Er schickte alle Perser nach Griechenland.', 'Gar nicht.'], w: 'In Ägypten ließ er sich sogar zum Pharao krönen. Das ging nicht immer ohne Streit.' },
      { f: 'Was passierte mit Alexanders Reich nach seinem Tod?', a: 'Seine Feldherren (Diadochen) kämpften darum, es zerfiel in mehrere Königreiche.', x: ['Sein Sohn regierte es 300 Jahre.', 'Es wurde eine Demokratie.', 'Es wurde sofort römisch.'], w: 'Diadoche heißt Nachfolger. Ein Reich davon war Ägypten unter den Ptolemäern.' },
      { f: 'Was ist der <b>Hellenismus</b>?', a: 'die Zeit, in der sich die griechische Kultur von Nordafrika bis Indien ausbreitete', x: ['ein ägyptischer Gott', 'eine Sportart in Olympia', 'eine Krankheit'], w: 'Von Alexanders Herrschaft bis 30 v. Chr., als die Römer Ägypten eroberten.' },
      { f: 'Welche Sprache verstand man im ganzen hellenistischen Gebiet, wie heute Englisch?', a: 'ein gemeinsames Griechisch (Koiné)', x: ['Latein', 'Deutsch', 'Hieroglyphen'], w: 'Koiné heißt „die gemeinsame“ Sprache.' },
      { f: 'Wofür war <b>Alexandria</b> in Ägypten berühmt?', a: 'für seine riesige Bibliothek und viele Forscher', x: ['für seine Pyramiden', 'für das Scherbengericht', 'für die Olympischen Spiele'], w: 'Dort lagen Hunderttausende Papyrusrollen. Vor der Stadt stand der Leuchtturm von Pharos.' },
      { f: 'Warum streiten Historiker über Alexander?', a: 'Die einen sehen einen grausamen Zerstörer, die anderen einen Wegbereiter der griechischen Kultur.', x: ['Weil niemand weiß, ob er gelebt hat.', 'Weil er nur Bücher schrieb.', 'Sie streiten nicht.'], w: 'Darstellungen von heute bewerten dieselbe Person verschieden. Ob er den Beinamen „der Große“ verdient, darfst du selbst beurteilen.' },
    ],
    T: [
      { f: 'Die Nachfolger Alexanders hießen ___.', a: ['Diadochen', 'Diadoche'], w: 'Sie teilten sein Reich unter sich auf.' },
      { f: 'Die Zeit nach Alexander, als sich die griechische Kultur ausbreitete, heißt ___.', a: 'Hellenismus', w: 'Hellas = Griechenland.' },
    ],
    A: { w: ['Alexander starb mit 33 Jahren.', 'Alexander ließ sich in Ägypten zum Pharao krönen.', 'Die Bibliothek von Alexandria war die größte ihrer Zeit.'], f: ['Alexander war König von Sparta.', 'Alexander regierte 50 Jahre lang.', 'Nach Alexanders Tod blieb sein Reich ganz.'] },
  }, { ordnen: 14, frage: 50, tippen: 16, aussage: 20 });

  // ---------- Längsschnitt: drei Teile wie im Buch (S. 132–137) ----------
  const naturSt = baue('g5-natur-st', {
    h: 'In der Altsteinzeit lebten die Menschen von dem, was die Natur ihnen gab. Dürre, Hochwasser oder Kälte bedeuteten Hunger. Sie veränderten die Natur aber nur wenig.',
    F: [
      { f: 'Was geschah, wenn die Jagdbeute <b>ausblieb</b>?', a: 'Die ganze Horde hungerte, Schwache und Kranke überlebten oft nicht.', x: ['Man kaufte Fleisch auf dem Markt.', 'Man aß Vorräte aus dem Kühlschrank.', 'Nichts, es gab genug Getreide.'], w: 'Jäger und Sammler waren der Natur ganz ausgeliefert.' },
      { f: 'Wie erklärten sich die Menschen Gewitter oder Kälteeinbrüche?', a: 'durch Geister der Natur, die man mit Ritualen besänftigen musste', x: ['mit dem Wetterbericht', 'mit Physik aus der Schule', 'gar nicht, es war ihnen egal'], w: 'Schamanen sollten Kontakt mit diesen Geistern aufnehmen.' },
      { f: 'Warum waren <b>Zelte</b> aus Fell und Ästen praktisch?', a: 'Man konnte sie schnell abbauen und mitnehmen.', x: ['Sie waren aus Stein und hielten ewig.', 'Sie hatten Heizungen.', 'Sie waren am schönsten.'], w: 'Ein „Haus“ zum Mitnehmen für Nomaden.' },
      { f: 'Warum schadeten die Menschen der Steinzeit der Natur <b>kaum</b>?', a: 'Sie waren wenige, zogen weiter und nutzten erlegte Tiere fast vollständig.', x: ['Sie hatten Naturschutzgesetze.', 'Sie lebten nur in Städten.', 'Sie aßen gar nichts.'], w: 'War ein Boden erschöpft, zog die Horde weiter, und die Erde erholte sich.' },
      { f: 'Womit begannen die Menschen, die Natur <b>stärker</b> zu verändern?', a: 'mit der Neolithischen Revolution: Sie rodeten Wälder für Felder und Weiden.', x: ['mit der Erfindung des Feuers', 'mit der Höhlenmalerei', 'erst im Jahr 2000'], w: 'In der Metallzeit kamen die ersten Bergwerke dazu.' },
    ],
    A: { w: ['Die Menschen der Altsteinzeit waren stark von der Natur abhängig.', 'Sie glaubten an Geister der Natur.', 'Ein Zelt konnte man mitnehmen.'], f: ['In der Altsteinzeit hatte das Wetter keinen Einfluss auf die Menschen.', 'Die Menschen der Altsteinzeit rodeten große Wälder für Felder.', 'Getötete Tiere wurden meist weggeworfen.'] },
  }, { frage: 64, aussage: 36 });
  const naturAg = baue('g5-natur-ag', {
    h: 'Das Leben am Nil richtete sich nach drei Jahreszeiten: Nilschwelle, Aussaat, Ernte. Die Ägypter passten sich der Natur an und nutzten sie klug. Blieb die Flut aus, kam Hunger.',
    O: [{ t: 'Die drei Jahreszeiten am Nil: Bringe sie in die richtige Reihenfolge.', items: ['Nilschwelle (Überschwemmung)', 'Bestellung der Felder (Aussaat)', 'Ernte'], s1: 'Der Fluss bestimmte den Takt:', w: 'Nilschwelle → Aussaat → Ernte, dann wieder von vorn. Daraus entstand der erste Sonnenkalender.' }],
    F: [
      { f: 'Wie war der erste ägyptische Sonnenkalender aufgebaut?', a: '12 Monate zu je 30 Tagen und 5 zusätzliche Tage', x: ['10 Monate zu je 36 Tagen', '7 Monate zu je 50 Tagen', '52 Wochen ohne Monate'], w: '12 × 30 + 5 = 365 Tage.' },
      { f: 'Was berichtet die <b>Hungersnotstele</b> bei Assuan?', a: 'von sieben Jahren Hunger, weil der Nil nicht stieg', x: ['von einem Sieg in Olympia', 'vom Bau der ersten Pyramide', 'von einer Reise nach Griechenland'], w: 'Sie spielt zur Zeit des Königs Djoser, wurde aber erst über 2000 Jahre später eingemeißelt.' },
      { f: 'Wozu diente ein <b>Schaduf</b>?', a: 'um Wasser mit einem Eimer an einem Hebel aus dem Fluss zu schöpfen', x: ['um Getreide zu mahlen', 'um Hieroglyphen zu schreiben', 'um Fische zu braten'], w: 'Solche einfachen Geräte nutzen manche Bauern bis heute.' },
      { f: 'Was machten die Ägypter alles aus der <b>Papyruspflanze</b>?', a: 'Matten, Seile, Sandalen, Boote und Schreibmaterial', x: ['nur Papier', 'Metall', 'Glas'], w: 'Unser Wort „Papier“ kommt vom griechischen „papyros“.' },
      { f: 'Wofür stand in der Religion der Gott <b>Seth</b>, der Osiris tötete?', a: 'für die lebensfeindliche Wüste', x: ['für den fruchtbaren Nil', 'für die Sonne', 'für das Meer bei Griechenland'], w: 'Osiris stand für das fruchtbare Land und den Sieg des Lebens über den Tod.' },
      { f: 'Woraus bauten die Ägypter ihre <b>Häuser</b>?', a: 'aus getrocknetem Nilschlamm in Ziegelform', x: ['aus Marmor', 'aus Eisen', 'aus Eis'], w: 'Der Fluss lieferte Nahrung, Baustoff und Schreibmaterial.' },
    ],
    T: [{ f: 'Die jährliche Überschwemmung des Nils heißt Nil___.', a: ['schwelle', 'flut'], w: 'Nilschwelle: Der Fluss schwillt an.' }],
  }, { ordnen: 18, frage: 62, tippen: 20 });
  const naturGr = baue('g5-natur-gr', {
    h: 'Die Griechen brauchten viel Holz für Schiffe, Häuser und Öfen. Wo Wälder fehlten, spülte der Regen die Erde weg bis auf den Fels: Verkarstung. Im Bergwerk von Laurion vergifteten Blei und Silberabbau Luft und Wasser.',
    O: [{ t: 'Wie eine Landschaft verkarstet: Bringe die Schritte in die richtige Reihenfolge.', items: ['Ein Berghang ist mit Wald bedeckt.', 'Die Bäume werden gefällt.', 'Regen spült die Erde weg.', 'Nur der nackte Fels bleibt.'], s1: 'Ohne Wurzeln hält nichts den Boden fest:', w: 'Wald → abholzen → Erde wird weggespült → kahler Fels (Verkarstung).' }],
    F: [
      { f: 'Wofür brauchten die Griechen so viel <b>Holz</b>?', a: 'für Schiffe und Kriegsflotten und als Brennstoff für Herde, Töpfer- und Schmelzöfen', x: ['nur für Zahnstocher', 'für Papier', 'gar nicht'], w: 'Holz war damals das einzige Brennmaterial.' },
      { f: 'Was bedeutet <b>Verkarstung</b>?', a: 'Ohne Wald spült der Regen die Erde weg, bis der Fels zum Vorschein kommt.', x: ['Ein Wald wächst neu.', 'Ein Fluss friert zu.', 'Eine Stadt wird gegründet.'], w: 'Solche kahlen Hänge prägen Griechenland bis heute.' },
      { f: 'Was haben neuere Forschungen über die alten Griechen herausgefunden?', a: 'Es gab Aufseher, die das Abholzen kontrollierten, und Wälder wuchsen auch nach.', x: ['Die Griechen haben gar keine Bäume gefällt.', 'Die Griechen haben alles in einem Jahr abgeholzt.', 'Die Griechen hatten keine Schiffe.'], w: 'Umweltschutz wie heute war das nicht, aber das Problem war bekannt. Darum steht hinter der Überschrift im Buch ein Fragezeichen.' },
      { f: 'Wie schadete das <b>Bergwerk von Laurion</b> der Natur?', a: 'Waschanlagen und Schmelzöfen verschmutzten Luft und Wasser mit giftigen Metallen.', x: ['Gar nicht, es war ganz sauber.', 'Es pflanzte zu viele Bäume.', 'Es machte den Boden fruchtbarer.'], w: 'Dort baute man Blei und Silber ab. Auch die Arbeiter wurden krank.' },
      { f: 'Wie erklärten sich die Griechen in den <b>Mythen</b> einen Blitz?', a: 'als Zeichen, dass Zeus wütend ist', x: ['als elektrische Entladung', 'als Feuerwerk der Händler', 'gar nicht'], w: 'Daneben gab es aber schon Forscher, die die Natur mit dem Verstand erklären wollten: Die Erde ist eine Kugel, die Welt besteht aus vier Elementen.' },
      { f: 'Aus welchen <b>vier Elementen</b> sollte die Welt nach griechischer Lehre bestehen?', a: 'Feuer, Wasser, Luft und Erde', x: ['Gold, Silber, Kupfer, Eisen', 'Sonne, Mond, Sterne, Wolken', 'Stein, Holz, Ton, Glas'], w: 'Eine frühe Naturwissenschaft.' },
      { f: 'Welches Tier wurde im östlichen Mittelmeerraum bis zur Zeit von Christi Geburt <b>ausgerottet</b>?', a: 'der Löwe', x: ['die Eule', 'das Pferd', 'die Ziege'], w: 'Die Griechen sahen in manchen Tieren gefährliche Gegner.' },
    ],
    T: [{ f: 'Wenn Regen die Erde von kahlen Bergen spült, nennt man das ___.', a: 'Verkarstung', w: 'Zurück bleibt nackter Kalkfels.' }],
  }, { ordnen: 18, frage: 62, tippen: 20 });

  // =====================================================
  // Lernbereiche Klasse 5 = Kapitel von ANNO 1 (Themenplan: faecher/geschichte/themenplan.md)
  // =====================================================
  D.grades = D.grades || {};
  D.grades[5] = {
    lbs: [
      { id: 'g5-begegnung', nr: 1, title: 'Begegnungen mit Geschichte', buch: 'S. 6–11', topics: [
        { id: 'g5-quellen', buch: 'S. 6–8', title: 'Woher wissen wir das? Quellen', icon: '🔍', gen: quellen },
        { id: 'g5-klein', buch: 'S. 9', title: 'Von der kleinen zur großen Geschichte', icon: '🌳', gen: klein },
        { id: 'g5-kalender', buch: 'S. 10–11', title: 'Zeit messen und Kalender', icon: '📅', gen: kalender },
        { id: 'g5-zeitstrahl', buch: 'S. 10–11', title: 'Der Zeitstrahl: vor und nach Christus', icon: '📏', gen: zeitstrahl },
        { id: 'g5-jh', buch: 'S. 10–11', title: 'Jahrhunderte und Jahrtausende', icon: '💯', gen: jahrhundert },
        { id: 'g5-rechnen', buch: 'S. 10–11', title: 'Wie lange ist das her?', icon: '🧮', gen: rechnen },
        { id: 'g5-epochen', buch: 'S. 138–141', title: 'Die großen Zeitabschnitte', icon: '🗂', gen: epochen },
      ] },
      { id: 'g5-frueh', nr: 2, title: 'Das Leben der Menschen in der Frühgeschichte', buch: 'S. 12–43', topics: [
        { id: 'g5-mensch', buch: 'S. 14–17', title: 'Die Entwicklung zum Menschen', icon: '🚶', gen: mensch },
        { id: 'g5-alt', buch: 'S. 18–21', title: 'Leben in der Altsteinzeit', icon: '🦣', gen: altstein },
        { id: 'g5-hoehle', title: 'Höhlenmalerei', icon: '🎨', gen: hoehle },
        { id: 'g5-jung', buch: 'S. 22–25', title: 'Leben in der Jungsteinzeit', icon: '🌾', gen: jung },
        { id: 'g5-altjung', buch: 'S. 20–25', title: 'Alt- oder Jungsteinzeit?', icon: '⚖', gen: altjung },
        { id: 'g5-felsbilder', buch: 'S. 26–29', title: 'Felsbilder in der Sahara', icon: '🦒', gen: felsbilder },
        { id: 'g5-oetzi', buch: 'S. 30–31', title: 'Ötzi: Wanderer zwischen den Zeiten', icon: '🏔', gen: oetzi },
        { id: 'g5-karawane', buch: 'S. 32–35', title: 'Handel in der Bronzezeit: der Abu-Ballas-Weg', icon: '🫏', gen: karawane },
        { id: 'g5-metall', buch: 'S. 36–37', title: 'Kupfer, Bronze, Eisen und Handel', icon: '⚒', gen: metall },
        { id: 'g5-kelten', buch: 'S. 36–37', title: 'Die Kelten', icon: '🧂', gen: kelten },
        { id: 'g5-nebra', buch: 'S. 38–39', title: 'Die Himmelsscheibe von Nebra', icon: '🌙', gen: nebra },
      ] },
      { id: 'g5-aegypten', nr: 3, title: 'Ägypten – eine frühe Hochkultur', buch: 'S. 44–83', topics: [
        { id: 'g5-nil', buch: 'S. 46–49', title: 'Der Nil: Leben am Fluss', icon: '🌊', gen: nil },
        { id: 'g5-klima', buch: 'S. 50–51', title: 'Klimawandel: Die Sahara wird zur Wüste', icon: '🏜', gen: klima },
        { id: 'g5-staat', buch: 'S. 52–57', title: 'Ein Staat entsteht: Pharao und Beamte', icon: '👑', gen: staat },
        { id: 'g5-schrift', buch: 'S. 58–59', title: 'Hieroglyphen, Papyrus und Schreiber', icon: '📜', gen: schrift },
        { id: 'g5-gesellschaft', buch: 'S. 60–63', title: 'Die Gesellschaft Ägyptens', icon: '🔺', gen: gesellschaft },
        { id: 'g5-religion-ag', buch: 'S. 64–67', title: 'Götter, Tempel und Priester', icon: '☀', gen: religionAg },
        { id: 'g5-jenseits', buch: 'S. 68–71', title: 'Mumien und Jenseits', icon: '⚱', gen: jenseits },
        { id: 'g5-pyramiden', buch: 'S. 72–75', title: 'Die Pyramiden', icon: '🔼', gen: pyramiden },
        { id: 'g5-hochkultur', buch: 'S. 76–77', title: 'Merkmale einer Hochkultur', icon: '🏛', gen: hochkultur },
        { id: 'g5-quellen-ag', buch: 'S. 78–80', title: 'Woher wissen wir etwas über Ägypten?', icon: '🔎', gen: quellenAg },
      ] },
      { id: 'g5-polis', nr: 4, title: 'Lebenswelt griechische Polis', buch: 'S. 84–131', topics: [
        { id: 'g5-land', buch: 'S. 86–91', title: 'Land, Polis und Kolonien', icon: '⛵', gen: land },
        { id: 'g5-olympia', buch: 'S. 92–95', title: 'Die Olympischen Spiele', icon: '🏅', gen: olympia },
        { id: 'g5-religion-gr', buch: 'S. 96–97', title: 'Die Götter der Griechen', icon: '⚡', gen: religionGr },
        { id: 'g5-quellen-gr', buch: 'S. 98–101, 104–105', title: 'Woher wissen wir etwas über die Griechen?', icon: '🏺', gen: quellenGr },
        { id: 'g5-wirtschaft', buch: 'S. 102–103', title: 'Handel und Wirtschaft in Athen', icon: '🦉', gen: wirtschaft },
        { id: 'g5-demokratie', buch: 'S. 106–111', title: 'Demokratie in Athen', icon: '🗳', gen: demokratie },
        { id: 'g5-athen', buch: 'S. 112–115', title: 'Leben in Athen', icon: '🏠', gen: athen },
        { id: 'g5-sparta', buch: 'S. 116–122', title: 'Die Polis Sparta', icon: '🛡', gen: sparta },
        { id: 'g5-vergleich', buch: 'S. 123', title: 'Athen und Sparta im Vergleich', icon: '↔', gen: vergleich },
        { id: 'g5-alexander', buch: 'S. 124–128', title: 'Wahlbereich: Alexander der Große und der Hellenismus', icon: '🐎', gen: alexander },
      ] },
      { id: 'g5-laengs', nr: 5, title: 'Längsschnitt: Mensch und Natur', buch: 'S. 132–137', topics: [
        { id: 'g5-natur-st', buch: 'S. 132–133', title: 'Steinzeit: abhängig von der Natur', icon: '🔥', gen: naturSt },
        { id: 'g5-natur-ag', buch: 'S. 134–135', title: 'Ägypten: Leben mit der Natur', icon: '🌾', gen: naturAg },
        { id: 'g5-natur-gr', buch: 'S. 136–137', title: 'Griechenland: Naturzerstörung in der Antike?', icon: '🪓', gen: naturGr },
        { id: 'g5-natur', buch: 'S. 132–137', title: 'Mensch und Natur: drei Zeiten im Vergleich', icon: '🌳', gen: natur },
      ] },
    ],
  };
  D.daten = { EREIG, GP, SP, GOETTER_AG, GOETTER_GR, J, HEUTE };
})();
