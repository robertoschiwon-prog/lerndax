/* BioDax (Biologie) – Grundlage für Klasse 5: Hilfen, Bilder und Bausteine für Wissensaufgaben
 * (Lehrplan Gymnasium Sachsen, Fassung 2025; Schulbuch LINDER Biologie 5 Sachsen nur zum Abgleich von Reihenfolge und Begriffen)
 *
 * Aufbau wie in GeDax: Jeder Generator liefert bei jedem Aufruf eine neue Aufgabe
 *   { prompt, hint, solution, figure?, ex } und dazu eine der Antwortformen
 *   choices/correct   Auswahl
 *   fields            Eingabefeld (type:'text'); layout:'satz' = Lücke im Satz
 *   order             Teile in die richtige Reihenfolge bringen
 * ex beschreibt die Lösungs-Animation (Bild-Modi in erklaerungen/klasse5.js: karte, reihe, faecher).
 *
 * Alle Texte sind selbst geschrieben, alle Bilder selbst gezeichnet. Zahlen, Namen und Tierarten sind nachgeschlagen
 * (Quellen in faecher/bio/fakten.md). Regel wie überall in LernDax: Jede Aufgabe hat genau eine richtige Lösung.
 */
(function () {
  const D = (window.BioDax = window.BioDax || {});
  const U = (D.util = D.util || {});
  const R = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
  const pick = (arr) => arr[R(0, arr.length - 1)];
  const shuffle = (arr) => { const a = arr.slice(); for (let i = a.length - 1; i > 0; i--) { const j = R(0, i); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  Object.assign(U, { R, pick, shuffle, fmt: (x) => String(x) });
  U.wahl = (liste) => { let r = Math.random() * liste.reduce((s, x) => s + x[0], 0); for (const [w, f] of liste) { r -= w; if (r <= 0) return f(); } return liste[0][1](); };
  const reihum = (liste) => { let s = []; return () => { if (!s.length) s = shuffle(liste); return s.pop(); }; };
  const nurText = (s) => String(s).replace(/<[^>]+>/g, '');
  const mische = (teile) => { let w = teile.slice(); for (let k = 0; k < 30 && w.join('|') === teile.join('|'); k++) w = shuffle(teile); return w; };
  Object.assign(U, { reihum, nurText, mische });

  // =====================================================
  // Bilder (selbst gezeichnet, flach). Jede Funktion liefert ein <svg>.
  // =====================================================
  const S = (vb, inhalt, label) => `<svg viewBox="${vb}" role="img" aria-label="${label || 'Bild'}" style="max-width:100%;height:auto">${inhalt}</svg>`;
  const LAND = '#eef4e2', WASSER = '#d9eefb', TINTE = '#2b2540';
  const bg = (f, w, h) => `<rect width="${w || 200}" height="${h || 120}" fill="${f}"/>`;
  // Nummern-Marke mit Zeiger: von (x,y) zur Stelle (tx,ty)
  const nr = (n, x, y, tx, ty) => `<line x1="${x}" y1="${y}" x2="${tx}" y2="${ty}" stroke="${TINTE}" stroke-width="1.2"/><circle cx="${tx}" cy="${ty}" r="1.8" fill="${TINTE}"/><circle cx="${x}" cy="${y}" r="8" fill="#fff" stroke="${TINTE}" stroke-width="1.5"/><text x="${x}" y="${y + 4}" text-anchor="middle" style="font:800 11px Nunito,sans-serif;fill:${TINTE}">${n}</text>`;
  const marken = (liste) => liste.map((m, i) => nr(i + 1, m[0], m[1], m[2], m[3])).join('');
  const auge = (x, y, r, iris) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${iris || '#f2c14e'}"/><circle cx="${x}" cy="${y}" r="${r * 0.5}" fill="#1b1b1b"/>`;

  // ---------------------------------------------------- Frosch, Kröte, Unke (von der Seite, sitzend)
  // o: { k: Körperfarbe, b: Bauchfarbe, fl: Fleckenfarbe, haft, warzen, fleck (dunkler Fleck hinter dem Auge), streif, bauchfl: gefleckter Bauch, plump, blase }
  function frosch(o) {
    o = o || {};
    const k = o.k || '#6aa84f', b = o.b || '#e9e6c5', fl = o.fl || 'none', RAND = 'rgba(0,0,0,.3)', SCHATTEN = 'rgba(0,0,0,.16)';
    const pl = o.plump ? 9 : 0; // Kröten und Unken: höherer, runderer Rücken
    const koerper = `M36 86 C33 ${62 - pl} 58 ${42 - pl} 92 ${40 - pl} C112 ${38 - pl} 130 ${39 - pl * 0.5} 144 43 C160 47 173 55 174 62 C175 68 168 75 156 79 C150 87 132 96 100 97 C70 98 39 98 36 86Z`;
    const haft = (x, y) => (o.haft ? `<circle cx="${x}" cy="${y}" r="3" fill="${k}" stroke="${RAND}" stroke-width=".8"/>` : '');
    const flecken = fl === 'none' ? '' : [[70, 56, 6, 4], [90, 48, 7, 4], [110, 52, 5, 3.5], [100, 64, 6, 3.5], [124, 64, 4, 3], [58, 70, 4, 3], [80, 68, 4, 2.5], [46, 78, 5, 3], [40, 88, 4, 3], [56, 88, 4, 2.5]].map(([x, y, rx, ry], i) => `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="${fl}" transform="rotate(${-20 + i * 9} ${x} ${y})"/>`).join('');
    const warzen = o.warzen ? [[64, 50], [78, 42], [94, 46], [108, 40], [120, 50], [86, 56], [104, 58], [132, 60], [70, 64], [116, 66], [52, 62], [44, 76], [56, 82], [40, 88]].map(([x, y], i) => `<circle cx="${x}" cy="${y - pl * 0.6}" r="${2 + (i % 3) * 0.5}" fill="rgba(0,0,0,.2)"/><circle cx="${x - 0.7}" cy="${y - pl * 0.6 - 0.7}" r=".8" fill="rgba(255,255,255,.35)"/>`).join('') : '';
    const bauchfl = o.bauchfl ? [[72, 90, 6, 3], [90, 86, 5, 3.5], [106, 90, 7, 3.5], [124, 85, 5, 3], [138, 82, 4, 2.5], [158, 74, 4, 2.5], [82, 94, 4, 2]].map(([x, y, rx, ry], i) => `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="${o.bauchfl}" transform="rotate(${i * 17 - 30} ${x} ${y})"/>`).join('') : '';
    const boden = o.wasser
      ? bg(WASSER) + `<path d="M0 96 H200 V120 H0Z" fill="#b7dcf2"/><path d="M8 100 h22 M150 114 h30 M170 100 h18" stroke="#fff" stroke-width="1.5" stroke-linecap="round" opacity=".8"/><ellipse cx="98" cy="106" rx="84" ry="11" fill="#5d9e4a"/><path d="M98 106 L172 100" stroke="#4a843a" stroke-width="1.2"/><ellipse cx="98" cy="104.5" rx="84" ry="10" fill="none" stroke="#4a843a" stroke-width="1"/>`
      : bg(LAND) + `<path d="M0 102 H200 V120 H0Z" fill="#cfe0ae"/><path d="M10 104 l3 -12 l3 12 M20 104 l2 -8 l3 8 M178 104 l3 -13 l3 13 M166 104 l2 -7 l3 7 M96 112 l2 -6 l2 6" stroke="#9dbb6c" stroke-width="2" fill="none" stroke-linecap="round"/>`;
    return S('0 0 200 120', boden
      + `<ellipse cx="100" cy="103" rx="70" ry="5" fill="rgba(0,0,0,.12)"/>`
      // Hinterbein: Fuß mit Schwimmhaut, Unterschenkel, Oberschenkel (gefaltet zum Sprung)
      + `<path d="M28 100 L60 102 L84 99 L82 103 L88 105 L82 107 L86 111 L60 110 L28 107Z" fill="${k}" stroke="${RAND}" stroke-width="1"/><path d="M62 103 L82 101 M62 106 L84 105 M62 108 L82 109" stroke="${SCHATTEN}" stroke-width="1"/>${haft(85, 100)}${haft(89, 105)}${haft(87, 111)}`
      + `<path d="M76 84 C62 96 46 100 28 99 L28 106 C50 107 70 104 84 94Z" fill="${k}" stroke="${RAND}" stroke-width="1"/>`
      + `<path d="${koerper}" fill="${k}" stroke="${RAND}" stroke-width="1.2"/>`
      + `<path d="M50 92 C76 83 122 81 154 79 C148 88 130 96 100 97 C76 98 58 97 50 92Z" fill="${b}"/><path d="M152 79 C162 77 171 71 174 64 C173 72 166 78 156 80Z" fill="${b}"/>${bauchfl}`
      + (o.blase ? `<circle cx="162" cy="82" r="11" fill="#eef3ff" stroke="#9fb0d8" stroke-width="1.5"/><path d="M156 76 q5 -3 9 1" stroke="#fff" stroke-width="2" fill="none"/>` : '')
      + flecken + warzen
      + (o.streif ? `<path d="M46 ${68 - pl * 0.7} C74 ${46 - pl} 114 ${40 - pl} 140 ${44 - pl * 0.4}" stroke="${o.streif}" stroke-width="${o.plump ? 3 : 4}" fill="none" stroke-linecap="round"/>` : `<path d="M50 ${66 - pl * 0.7} C78 ${48 - pl} 112 ${45 - pl} 134 ${47 - pl * 0.5}" stroke="${SCHATTEN}" stroke-width="1.5" fill="none" stroke-linecap="round"/>`)
      + `<path d="M62 70 C42 60 24 76 34 92 C42 102 66 100 76 88 C80 80 72 74 62 70Z" fill="${k}" stroke="${RAND}" stroke-width="1.2"/>`
      + (fl === 'none' ? '' : `<path d="M40 74 l10 16 M52 68 l10 20 M64 72 l6 16" stroke="${fl}" stroke-width="3.5" stroke-linecap="round" opacity=".85"/>`)
      + (o.warzen ? [[46, 80], [58, 76], [54, 90], [66, 84]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="2" fill="rgba(0,0,0,.2)"/>`).join('') : '')
      // Schläfenfleck (Grasfrosch), Ohrdrüse (Kröten), Trommelfell
      + (o.fleck ? `<path d="M140 50 C130 48 118 54 114 64 C126 68 138 64 142 55Z" fill="${o.fleck}"/>` : '')
      + (o.plump ? `<ellipse cx="122" cy="${46 - pl * 0.3}" rx="10" ry="4.5" fill="rgba(0,0,0,.18)" transform="rotate(-8 122 46)"/>` : '')
      + `<circle cx="128" cy="59" r="5" fill="rgba(0,0,0,.14)" stroke="rgba(0,0,0,.28)" stroke-width="1"/>`
      // Vorderbein mit Fingern
      + `<path d="M132 82 L127 97 L142 106" stroke="${RAND}" stroke-width="9.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="M132 82 L127 97 L142 106" stroke="${k}" stroke-width="7.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`
      + `<path d="M142 106 l10 -3 M142 106 l11 2 M142 106 l7 6 M142 106 l-1 6" stroke="${k}" stroke-width="3" stroke-linecap="round"/>${haft(153, 103)}${haft(154, 108)}${haft(150, 113)}`
      // Kopf: Auge mit waagerechter Pupille, Nasenloch, Maulspalte
      + `<circle cx="147" cy="43" r="10" fill="${k}" stroke="${RAND}" stroke-width="1.2"/><circle cx="148" cy="43" r="6.5" fill="${o.iris || '#e9b93a'}" stroke="rgba(0,0,0,.4)" stroke-width=".8"/><ellipse cx="148" cy="43" rx="3.8" ry="2.5" fill="#1b1b1b"/><circle cx="146" cy="41" r="1.2" fill="#fff"/>`
      + `<circle cx="168" cy="57" r="1.3" fill="${TINTE}"/><path d="M174 63 C164 69 150 71 138 68" stroke="${TINTE}" stroke-width="1.4" fill="none" stroke-linecap="round"/>`, o.name || 'Froschlurch');
  }
  // ---------------------------------------------------- Molch und Salamander (von der Seite)
  // o: { k, b, punkte: Farbe der Flecken, kamm, bauchfl }
  function molch(o) {
    o = o || {};
    const k = o.k || '#8a6d3b', b = o.b || k, RAND = 'rgba(0,0,0,.3)';
    // Rumpf mit Kopf (rechts) und seitlich abgeflachtem Schwanz (links)
    const rumpf = 'M6 74 C24 66 44 60 70 56 C96 51 124 50 146 52 C156 50 168 50 178 54 C188 57 194 62 194 67 C194 73 186 78 174 78 C166 80 156 80 146 79 C122 82 96 83 72 81 C46 80 26 80 6 74Z';
    const punkte = o.punkte ? [[30, 70, 5, 3], [50, 63, 6, 3.5], [70, 60, 5, 4], [90, 57, 7, 3.5], [112, 56, 5, 4], [132, 57, 6, 3.5], [152, 58, 5, 3], [62, 72, 5, 3], [100, 70, 6, 3], [136, 70, 5, 3], [170, 58, 5, 3], [182, 66, 3.5, 2.5]].map(([x, y, rx, ry], i) => `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="${o.punkte}" transform="rotate(${i * 23 - 30} ${x} ${y})"/>`).join('') : '';
    const kamm = o.kamm ? `<path d="M8 72 L14 60 L20 66 L28 52 L36 60 L46 44 L56 54 L66 40 L78 50 L90 38 L102 47 L114 37 L126 47 L136 40 L144 50 L146 56 L8 76Z" fill="${o.kamm}" stroke="${RAND}" stroke-width="1"/>` : '';
    const saum = o.wasser && !o.kamm ? `<path d="M8 72 C30 58 60 50 100 46 C120 45 136 46 146 52 L146 56 L8 76Z" fill="${k}" opacity=".55"/>` : '';
    const bein = (x, hinten) => { const d = hinten ? -1 : 1; return `<path d="M${x} 76 L${x + d * 4} 90 L${x + d * 14} 96" stroke="${RAND}" stroke-width="7.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="M${x} 76 L${x + d * 4} 90 L${x + d * 14} 96" stroke="${k}" stroke-width="5.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="M${x + d * 14} 96 l${d * 8} -3 M${x + d * 14} 96 l${d * 9} 2 M${x + d * 14} 96 l${d * 5} 5 M${x + d * 14} 96 l${-d * 1} 6" stroke="${k}" stroke-width="2.4" stroke-linecap="round"/>`; };
    const boden = o.wasser
      ? bg(WASSER) + `<path d="M0 100 C40 94 80 104 120 98 C150 94 180 102 200 98 V120 H0Z" fill="#d9cba0"/><path d="M22 104 C24 80 16 60 24 34 M30 104 C34 86 30 70 36 52 M182 102 C178 82 186 66 180 44" stroke="#6aa84f" stroke-width="3.5" fill="none" stroke-linecap="round"/><circle cx="160" cy="22" r="3" fill="none" stroke="#fff" stroke-width="1.2"/><circle cx="168" cy="12" r="2" fill="none" stroke="#fff" stroke-width="1"/>`
      : bg(LAND) + `<path d="M0 100 H200 V120 H0Z" fill="#cfe0ae"/><path d="M0 100 C30 94 50 98 70 100Z M130 100 C150 92 180 94 200 100Z" fill="#b9cf94"/><path d="M12 102 l3 -11 l3 11 M184 102 l3 -12 l3 12" stroke="#9dbb6c" stroke-width="2" fill="none" stroke-linecap="round"/>`;
    return S('0 0 200 120', boden + `<ellipse cx="100" cy="100" rx="78" ry="4.5" fill="rgba(0,0,0,.1)"/>` + kamm + saum
      + bein(66, true) + bein(134, false)
      + `<path d="${rumpf}" fill="${k}" stroke="${RAND}" stroke-width="1.2"/>`
      + `<path d="M40 77 C70 78 120 78 150 76 C162 78 176 76 190 70 C188 76 178 78 174 78 C166 80 156 80 146 79 C122 82 96 83 72 81 C58 80.5 48 79.5 40 77Z" fill="${b}"/>`
      + (o.bauchfl ? [[62, 79.5], [80, 80.5], [98, 80.5], [116, 80], [134, 79.5], [152, 78.5], [170, 77.5]].map(([x, y], i) => `<circle cx="${x}" cy="${y}" r="${1.6 + (i % 2) * 0.5}" fill="${o.bauchfl}"/>`).join('') : '')
      + punkte
      + `<path d="M56 62 C86 55 120 54 146 56" stroke="rgba(0,0,0,.13)" stroke-width="1.5" fill="none" stroke-linecap="round"/>`
      + `<circle cx="178" cy="60" r="5.2" fill="${k}" stroke="${RAND}" stroke-width="1"/><circle cx="178.5" cy="60" r="3.6" fill="${o.punkte ? '#3a2a12' : '#e9b93a'}"/><circle cx="178.5" cy="60" r="2" fill="#1b1b1b"/><circle cx="177.5" cy="59" r=".8" fill="#fff"/>`
      + `<circle cx="191" cy="63" r="1" fill="${TINTE}"/><path d="M194 68 C188 72 180 73 172 71" stroke="${TINTE}" stroke-width="1.2" fill="none" stroke-linecap="round"/>`, o.name || 'Schwanzlurch');
  }
  // ---------------------------------------------------- Entwicklung des Frosches: Stufen 0..5
  function stufe(i) {
    const W = bg(WASSER) + `<path d="M0 104 C40 98 80 108 120 102 C150 98 180 106 200 102 V120 H0Z" fill="#d9cba0"/><path d="M18 106 C22 84 12 64 22 34 M28 106 C32 90 26 76 34 56 M182 104 C176 84 186 66 178 40 M172 104 C170 92 176 82 172 70" stroke="#6aa84f" stroke-width="3.5" fill="none" stroke-linecap="round"/><path d="M22 34 q10 2 8 12 q-10 0 -8 -12Z M178 40 q-10 2 -8 12 q10 0 8 -12Z" fill="#6aa84f"/>`;
    const Q = '#3b3530', G = '#5d7a3a', RAND = 'rgba(0,0,0,.3)';
    const augeK = (x, y, r) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#e9b93a"/><circle cx="${x}" cy="${y}" r="${r * 0.55}" fill="#111"/><circle cx="${x - r * 0.3}" cy="${y - r * 0.3}" r="${r * 0.2}" fill="#fff"/>`;
    // Ruderschwanz mit durchscheinendem Flossensaum; l = Länge
    const schwanz = (x, f, l) => `<path d="M${x} 52 C${x + l * 0.4} 36 ${x + l * 0.8} 48 ${x + l} 62 C${x + l * 0.8} 76 ${x + l * 0.4} 88 ${x} 74Z" fill="${f}" opacity=".35"/><path d="M${x - 4} 58 C${x + l * 0.4} 56 ${x + l * 0.8} 60 ${x + l} 62 C${x + l * 0.8} 65 ${x + l * 0.4} 70 ${x - 4} 70Z" fill="${f}"/>`;
    const bein = (d, f) => `<path d="${d}" stroke="${RAND}" stroke-width="7" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="${d}" stroke="${f}" stroke-width="5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
    if (i === 0) { // Laichballen: Eier in Gallerthüllen
      let s = '';
      [[70, 46], [92, 40], [114, 46], [58, 64], [81, 61], [104, 62], [127, 64], [70, 82], [93, 84], [116, 82], [138, 50], [47, 80], [139, 80]].forEach(([x, y], n) => { s += `<circle cx="${x}" cy="${y}" r="12" fill="#f6fcff" stroke="#9fc3da" stroke-width="1.2" opacity=".92"/><path d="M${x - 7} ${y - 5} q4 -5 9 -3" stroke="#fff" stroke-width="2" fill="none" stroke-linecap="round"/><circle cx="${x + (n % 3) - 1}" cy="${y + (n % 2)}" r="4.2" fill="${Q}"/>`; });
      return S('0 0 200 120', W + s, 'Laich');
    }
    if (i === 1) return S('0 0 200 120', W + schwanz(112, Q, 74) + `<ellipse cx="94" cy="64" rx="24" ry="14" fill="${Q}" stroke="${RAND}" stroke-width="1"/><path d="M74 56 q-10 -12 -18 -8 M72 60 q-12 -6 -20 0 M72 66 q-12 2 -18 10 M76 72 q-8 4 -10 12" stroke="#c0527a" stroke-width="2.6" fill="none" stroke-linecap="round"/><path d="M60 46 l-3 -3 M54 58 l-4 -1 M56 74 l-4 2" stroke="#c0527a" stroke-width="1.6" stroke-linecap="round"/>${augeK(82, 59, 3.2)}<path d="M72 68 q4 3 8 1" stroke="#8a8a8a" stroke-width="1.2" fill="none"/>`, 'Kaulquappe mit Außenkiemen');
    if (i === 2) return S('0 0 200 120', W + schwanz(108, Q, 84) + `<ellipse cx="84" cy="64" rx="30" ry="19" fill="${Q}" stroke="${RAND}" stroke-width="1"/><ellipse cx="88" cy="72" rx="20" ry="9" fill="#5a524a" opacity=".7"/>${augeK(66, 57, 3.6)}<path d="M55 68 q4 3 9 1" stroke="#9a9a9a" stroke-width="1.3" fill="none"/>`, 'Kaulquappe ohne Beine');
    if (i === 3) return S('0 0 200 120', W + schwanz(108, G, 84) + bein('M104 78 L120 86 L108 96 L98 98', G) + `<ellipse cx="84" cy="64" rx="30" ry="19" fill="${G}" stroke="${RAND}" stroke-width="1"/><ellipse cx="88" cy="73" rx="20" ry="8" fill="#e9e6c5" opacity=".75"/>${augeK(66, 57, 3.8)}<path d="M55 68 q4 3 9 1" stroke="${TINTE}" stroke-width="1.3" fill="none"/>`, 'Kaulquappe mit Hinterbeinen');
    if (i === 4) return S('0 0 200 120', W + schwanz(110, '#5a8f3a', 62) + bein('M106 78 L122 86 L110 96 L98 98', '#5a8f3a') + bein('M72 78 L66 92 L76 97', '#5a8f3a') + `<path d="M54 66 C54 50 70 44 90 46 C106 48 116 56 116 66 C116 78 102 84 84 84 C66 84 54 78 54 66Z" fill="#5a8f3a" stroke="${RAND}" stroke-width="1"/><path d="M60 74 C74 70 96 70 112 72 C106 80 96 84 84 84 C72 84 64 80 60 74Z" fill="#e9e6c5"/><circle cx="68" cy="50" r="6.5" fill="#5a8f3a" stroke="${RAND}" stroke-width="1"/>${augeK(68, 50, 4.2)}<path d="M54 66 q6 4 14 3" stroke="${TINTE}" stroke-width="1.3" fill="none" stroke-linecap="round"/>`, 'Kaulquappe mit vier Beinen');
    return frosch({ k: '#6aa84f', name: 'Jungfrosch' });
  }
  // ---------------------------------------------------- Fisch
  // o: { k, b, form: 'karpfen'|'hecht'|'forelle'|'aal', marken: Nummern an die Teile }
  function fisch(o) {
    o = o || {};
    const f = o.form || 'karpfen', RAND = 'rgba(0,0,0,.32)';
    const W = bg(WASSER) + `<path d="M0 108 C40 100 80 112 120 104 C150 98 180 108 200 104 V120 H0Z" fill="#d9cba0"/><path d="M14 108 C16 92 10 80 16 64 M22 108 C24 98 20 90 24 80 M188 106 C184 92 190 82 186 68" stroke="#6aa84f" stroke-width="3" fill="none" stroke-linecap="round"/><circle cx="186" cy="30" r="2.5" fill="none" stroke="#fff" stroke-width="1.1"/><circle cx="191" cy="20" r="1.6" fill="none" stroke="#fff" stroke-width="1"/>`;
    const augeF = (x, y, r) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#f1d27a" stroke="rgba(0,0,0,.45)" stroke-width=".8"/><circle cx="${x}" cy="${y}" r="${r * 0.52}" fill="#111"/><circle cx="${x - r * 0.3}" cy="${y - r * 0.3}" r="${r * 0.2}" fill="#fff"/>`;
    if (f === 'aal') {
      const weg = 'M12 72 C40 40 70 98 100 68 C124 44 150 80 178 58';
      return S('0 0 200 120', W + `<path d="${weg}" stroke="${RAND}" stroke-width="15" fill="none" stroke-linecap="round"/><path d="${weg}" stroke="#4d5c3c" stroke-width="13" fill="none" stroke-linecap="round"/>`
        + `<path d="M12 76 C40 46 70 104 100 74 C124 50 150 86 176 64" stroke="#d9d7a8" stroke-width="3.5" fill="none" stroke-linecap="round" opacity=".9"/>`
        + `<path d="M12 66 C40 33 70 91 100 61 C122 39 142 64 160 58" stroke="#38452c" stroke-width="2.5" fill="none" stroke-linecap="round"/>`
        + `<path d="M160 68 l7 9 l3 -9Z" fill="#38452c" stroke="${RAND}" stroke-width=".8"/>${augeF(176, 56, 2.6)}<path d="M184 60 l-7 2" stroke="${TINTE}" stroke-width="1.1" stroke-linecap="round"/>`, 'Aal');
    }
    const P = {
      karpfen: { k: '#b08a3c', b: '#ecdfa8', fl: '#9a7430', body: 'M26 62 C50 26 110 22 150 44 C166 52 176 58 178 62 C176 68 164 76 148 82 C108 98 50 94 26 62Z', rf: 'M70 34 C90 16 126 20 138 38 L130 40 C110 30 90 34 78 40Z', sf: 'M28 62 L4 40 C12 56 12 68 4 86Z', af: 'M70 88 L64 104 L88 92Z', bf: 'M100 90 L96 106 L116 92Z', brf: 'M136 72 L128 90 L148 78Z', kd: 'M146 48 C136 56 136 70 146 80 C156 78 164 72 170 66 C168 58 160 52 146 48Z', ax: 160, ay: 58, maul: 'M178 63 l-7 3' },
      hecht: { k: '#6b8a4a', b: '#e3ebc6', fl: '#58733c', body: 'M24 62 C50 46 120 44 160 52 C176 56 190 60 194 62 C188 66 176 70 160 72 C120 80 50 78 24 62Z', rf: 'M52 48 C60 34 78 34 84 46 L76 48Z', sf: 'M26 62 L4 44 C10 58 10 66 4 82Z', af: 'M54 76 L52 90 L74 78Z', bf: 'M104 76 L100 90 L118 78Z', brf: 'M148 68 L142 82 L158 72Z', kd: 'M150 53 C144 58 144 67 150 72 C158 71 164 68 168 65 C166 59 160 55 150 53Z', ax: 170, ay: 58, maul: 'M194 62 C186 65 178 66 170 65' },
      forelle: { k: '#8a9a6a', b: '#f2e9cc', fl: '#74845a', body: 'M24 62 C50 38 110 34 150 46 C168 52 180 58 184 62 C180 66 168 72 150 78 C110 90 50 86 24 62Z', rf: 'M88 38 C96 24 112 24 120 38 L112 40Z', sf: 'M26 62 L4 42 C10 56 10 68 4 84Z', af: 'M64 82 L60 96 L80 86Z', bf: 'M100 84 L96 98 L114 86Z', brf: 'M140 72 L134 88 L152 76Z', kd: 'M146 49 C138 56 138 68 146 76 C156 74 164 70 170 66 C168 58 160 52 146 49Z', ax: 162, ay: 58, maul: 'M184 62 C178 66 172 67 166 66' },
    }[f];
    const k = o.k || P.k, id = 'fk-' + f;
    const flosse = (d, strahlen) => `<path d="${d}" fill="${P.fl}" stroke="${RAND}" stroke-width="1"/><path d="${strahlen}" stroke="rgba(0,0,0,.22)" stroke-width=".9" fill="none"/>`;
    const str = {
      karpfen: { sf: 'M26 62 L8 46 M26 62 L8 54 M26 62 L9 62 M26 62 L8 70 M26 62 L8 80', rf: 'M82 38 L88 24 M92 34 L100 22 M104 32 L112 22 M116 33 L124 26 M126 36 L132 31', af: 'M72 90 L68 100 M76 91 L76 99 M80 91 L84 94', bf: 'M102 92 L100 102 M106 92 L108 98', brf: 'M136 74 L132 86 M138 75 L140 83' },
      hecht: { sf: 'M26 62 L8 48 M26 62 L8 56 M26 62 L9 62 M26 62 L8 70 M26 62 L8 78', rf: 'M60 46 L62 38 M68 46 L70 36 M76 46 L78 40', af: 'M58 78 L56 86 M64 78 L66 84', bf: 'M106 78 L104 86 M110 78 L112 82', brf: 'M148 70 L146 79 M152 71 L153 76' },
      forelle: { sf: 'M26 62 L8 46 M26 62 L8 54 M26 62 L9 62 M26 62 L8 70 M26 62 L8 80', rf: 'M96 38 L98 28 M104 37 L106 26 M112 38 L114 31', af: 'M66 84 L64 92 M72 85 L74 90', bf: 'M102 86 L100 94 M106 86 L108 91', brf: 'M140 74 L138 84 M144 75 L146 81' },
    }[f];
    let muster = '';
    if (f === 'karpfen') { for (let r = 0; r < 7; r++) for (let c = 0; c < 11; c++) { const x = 36 + c * 10 + (r % 2) * 5, y = 34 + r * 9; muster += `M${x} ${y} q6 4.5 0 9 `; } muster = `<path d="${muster}" stroke="rgba(0,0,0,.2)" stroke-width="1.1" fill="none"/>`; }
    if (f === 'forelle') muster = [[56, 58], [72, 50], [90, 46], [108, 46], [126, 50], [64, 66], [84, 60], [102, 58], [120, 60], [76, 72], [96, 70], [114, 68], [48, 62]].map(([x, y], i) => (i % 3 ? `<circle cx="${x}" cy="${y}" r="2.4" fill="#3b3530"/>` : `<circle cx="${x}" cy="${y}" r="3.4" fill="#d9e6f2"/><circle cx="${x}" cy="${y}" r="2.2" fill="#d0443a"/>`)).join('') + `<path d="M50 46 C54 40 60 40 62 46Z" fill="${P.fl}" stroke="${RAND}" stroke-width=".8"/>`;
    if (f === 'hecht') muster = [[44, 60], [60, 56], [78, 54], [96, 55], [114, 54], [132, 57], [52, 66], [70, 63], [88, 64], [106, 63], [124, 64], [140, 62]].map(([x, y], i) => `<ellipse cx="${x}" cy="${y}" rx="${5 - (i % 2)}" ry="2.4" fill="#e3ebc6" opacity=".85"/>`).join('');
    const barteln = f === 'karpfen' ? `<path d="M174 67 q5 7 0 12 M169 70 q3 7 -3 10" stroke="${P.fl}" stroke-width="2" fill="none" stroke-linecap="round"/>` : '';
    return S('0 0 200 120', W + `<clipPath id="${id}"><path d="${P.body}"/></clipPath>`
      + flosse(P.sf, str.sf) + flosse(P.rf, str.rf) + flosse(P.af, str.af) + flosse(P.bf, str.bf)
      + `<path d="${P.body}" fill="${k}"/>`
      + `<g clip-path="url(#${id})"><path d="M0 70 C60 78 130 76 200 62 V120 H0Z" fill="${P.b}" opacity=".9"/><path d="M0 20 H200 V40 C130 30 60 34 0 52Z" fill="rgba(0,0,0,.16)"/>${muster}<path d="${P.kd}" fill="rgba(0,0,0,.08)"/></g>`
      + `<path d="${P.body}" fill="none" stroke="${RAND}" stroke-width="1.3"/>`
      + barteln + flosse(P.brf, str.brf)
      + `<path d="${P.kd.split(' C').slice(0, 2).join(' C')}" stroke="${TINTE}" stroke-width="1.6" fill="none" stroke-linecap="round"/>`
      + (o.linie ? `<path d="M34 62 C70 57 110 57 142 61" stroke="${TINTE}" stroke-width="1.6" stroke-dasharray="1.5 3.5" stroke-linecap="round" fill="none"/>` : `<path d="M34 62 C70 57 110 57 142 61" stroke="rgba(0,0,0,.2)" stroke-width="1" fill="none"/>`)
      + augeF(P.ax, P.ay, 4.4) + `<path d="${P.maul}" stroke="${TINTE}" stroke-width="1.3" fill="none" stroke-linecap="round"/>`
      + (o.marken ? marken(o.marken) : ''), o.name || 'Fisch');
  }
  // Fisch mit Nummern: 1 Rückenflosse, 2 Schwanzflosse, 3 Afterflosse, 4 Bauchflosse, 5 Brustflosse, 6 Kiemendeckel
  const FISCH_TEILE = ['Rückenflosse', 'Schwanzflosse', 'Afterflosse', 'Bauchflosse', 'Brustflosse', 'Kiemendeckel'];
  const fischNr = () => fisch({ form: 'karpfen', marken: [[104, 10, 104, 28], [14, 22, 12, 52], [56, 110, 72, 96], [112, 110, 104, 98], [160, 104, 140, 82], [176, 28, 144, 60]] });

  // ---------------------------------------------------- Kriechtiere
  function echse(o) {
    o = o || {};
    const k = o.k || '#7a8f4a', RAND = 'rgba(0,0,0,.32)';
    // Körper: langer Schwanz (links), Rumpf, deutlich abgesetzter Kopf (rechts)
    const rumpf = 'M4 88 C28 82 48 74 74 68 C98 62 124 60 144 62 C152 58 164 57 174 59 C186 61 195 66 195 71 C195 76 186 80 174 80 C164 82 154 82 146 81 C124 84 100 84 78 82 C52 82 30 90 4 88Z';
    const bein = (x, hinten) => { const d = hinten ? -1 : 1; return `<path d="M${x} 78 L${x + d * 10} 86 L${x + d * 6} 96" stroke="${RAND}" stroke-width="7.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="M${x} 78 L${x + d * 10} 86 L${x + d * 6} 96" stroke="${k}" stroke-width="5.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="M${x + d * 6} 96 l${d * 10} -2 M${x + d * 6} 96 l${d * 11} 2 M${x + d * 6} 96 l${d * 8} 5 M${x + d * 6} 96 l${d * 2} 6 M${x + d * 6} 96 l${-d * 4} 4" stroke="${k}" stroke-width="2" stroke-linecap="round"/>`; };
    let schuppen = '';
    if (o.schuppen) { for (let r = 0; r < 3; r++) for (let c = 0; c < 17; c++) { const x = 30 + c * 7 + (r % 2) * 3.5, y = 66 + r * 5 + Math.max(0, (70 - x) * 0.22); schuppen += `M${x} ${y} q3.5 -3.5 7 0 `; } schuppen = `<path d="${schuppen}" stroke="rgba(0,0,0,.22)" stroke-width=".9" fill="none"/>`; }
    return S('0 0 200 120', bg(LAND) + `<path d="M0 98 H200 V120 H0Z" fill="#d8c9a0"/><path d="M118 100 C124 86 150 84 168 90 C180 94 186 98 190 100Z" fill="#b9b0a0" stroke="rgba(0,0,0,.2)" stroke-width="1"/><path d="M8 100 l3 -10 l3 10 M20 100 l2 -7 l3 7" stroke="#9dbb6c" stroke-width="2" fill="none" stroke-linecap="round"/>`
      + `<ellipse cx="96" cy="99" rx="76" ry="4" fill="rgba(0,0,0,.1)"/>` + bein(74, true) + bein(136, false)
      + `<clipPath id="ek"><path d="${rumpf}"/></clipPath><path d="${rumpf}" fill="${k}"/>`
      + `<g clip-path="url(#ek)"><path d="M0 79 C60 77 130 78 200 74 V100 H0Z" fill="${o.b || '#dfe3b4'}" opacity=".9"/>${schuppen}`
      + (o.muster ? `<path d="M10 85 C40 76 70 66 100 63 C124 61 140 62 150 63" stroke="#e9dfb4" stroke-width="2" fill="none" opacity=".8"/>` + [[44, 76], [58, 71], [72, 67], [86, 65], [100, 63.5], [114, 63], [128, 63], [142, 63.5]].map(([x, y]) => `<circle cx="${x}" cy="${y + 4}" r="3" fill="${o.muster}"/><circle cx="${x}" cy="${y + 4}" r="1.1" fill="#fff"/>`).join('') : '')
      + `</g><path d="${rumpf}" fill="none" stroke="${RAND}" stroke-width="1.2"/>`
      + `<circle cx="177" cy="66" r="3.6" fill="#e9b93a" stroke="rgba(0,0,0,.45)" stroke-width=".8"/><circle cx="177" cy="66" r="1.9" fill="#111"/><circle cx="176.2" cy="65.2" r=".7" fill="#fff"/>`
      + `<ellipse cx="164" cy="69" rx="2.2" ry="3" fill="rgba(0,0,0,.25)"/><circle cx="191" cy="68" r=".9" fill="${TINTE}"/><path d="M195 72 C188 75 180 76 170 75" stroke="${TINTE}" stroke-width="1.2" fill="none" stroke-linecap="round"/>`, o.name || 'Eidechse');
  }
  // art: 'ringelnatter' | 'kreuzotter' | 'blindschleiche'
  function schlange(art) {
    const k = { ringelnatter: '#6f7b7a', kreuzotter: '#b9a78a', blindschleiche: '#b08d57' }[art] || '#777', RAND = 'rgba(0,0,0,.32)';
    const weg = 'M14 88 C40 52 70 102 100 72 C124 48 150 86 172 62', breite = art === 'kreuzotter' ? 15 : art === 'blindschleiche' ? 11 : 12.5;
    let extra = `<path d="M15 92 C41 56 71 106 101 76 C124 53 149 89 170 67" stroke="${art === 'blindschleiche' ? '#7a5f36' : '#e4e0c8'}" stroke-width="${art === 'blindschleiche' ? 2 : 3}" fill="none" stroke-linecap="round" opacity=".85"/>`;
    if (art === 'kreuzotter') extra += `<path d="M18 84 l7 -13 l8 12 l8 -17 l8 14 l8 -5 l8 15 l8 -3 l8 -16 l8 -6 l8 10 l8 -17 l8 15 l8 -1 l8 13 l8 -11 l7 -9" stroke="#3b2f24" stroke-width="4.2" fill="none" stroke-linejoin="round" stroke-linecap="round"/>`;
    if (art === 'ringelnatter') extra += [[30, 72], [46, 70], [60, 84], [76, 88], [92, 80], [106, 66], [122, 62], [138, 72], [154, 74]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="1.7" fill="#2b2f2e"/>`).join('');
    if (art === 'blindschleiche') extra += `<path d="M14 85 C40 49 70 99 100 69 C124 45 150 83 172 59" stroke="#d8bb85" stroke-width="2" fill="none" stroke-linecap="round" opacity=".8"/>`;
    const kopf = art === 'blindschleiche' ? `<path d="M166 54 C176 50 188 54 190 60 C188 66 176 70 166 68Z" fill="${k}" stroke="${RAND}" stroke-width="1.1"/>`
      : art === 'kreuzotter' ? `<path d="M164 52 C172 46 186 48 194 56 C196 60 194 64 190 66 C182 70 170 70 164 68Z" fill="${k}" stroke="${RAND}" stroke-width="1.1"/><path d="M170 52 l8 5 l-8 5 M180 52 l-2 5" stroke="#3b2f24" stroke-width="2.4" fill="none" stroke-linejoin="round"/>`
        : `<path d="M164 54 C172 48 188 50 195 58 C194 64 184 69 164 68Z" fill="${k}" stroke="${RAND}" stroke-width="1.1"/>`;
    const mond = art === 'ringelnatter' ? `<path d="M163 53 q7 8 0 16 q-8 -8 0 -16Z" fill="#f2d24e" stroke="rgba(0,0,0,.3)" stroke-width=".6"/><path d="M157 55 q6 7 0 14" stroke="#1b1b1b" stroke-width="3" fill="none" stroke-linecap="round"/>` : '';
    const pupille = art === 'kreuzotter' ? `<circle cx="182" cy="57" r="2.8" fill="#c0392b" stroke="rgba(0,0,0,.4)" stroke-width=".6"/><ellipse cx="182" cy="57" rx=".8" ry="2.3" fill="#111"/>` : `<circle cx="182" cy="57" r="2.8" fill="#e9b93a" stroke="rgba(0,0,0,.4)" stroke-width=".6"/><circle cx="182" cy="57" r="1.5" fill="#111"/>`;
    const zunge = art === 'blindschleiche' ? '' : `<path d="M195 60 l6 0 l3 -3 M201 60 l3 3" stroke="#b03a48" stroke-width="1.2" fill="none" stroke-linecap="round"/>`;
    return S('0 0 200 120', bg(LAND) + `<path d="M0 98 H200 V120 H0Z" fill="#cfe0ae"/><path d="M6 100 l3 -11 l3 11 M186 100 l3 -10 l3 10 M120 106 l2 -6 l2 6" stroke="#9dbb6c" stroke-width="2" fill="none" stroke-linecap="round"/><ellipse cx="96" cy="97" rx="80" ry="4" fill="rgba(0,0,0,.1)"/>`
      + `<path d="${weg}" stroke="${RAND}" stroke-width="${breite + 2}" fill="none" stroke-linecap="round"/><path d="${weg}" stroke="${k}" stroke-width="${breite}" fill="none" stroke-linecap="round"/>` + extra + zunge + kopf + mond + pupille
      + `<path d="M194 61 C188 64 180 65 172 64" stroke="${TINTE}" stroke-width="1" fill="none" stroke-linecap="round"/>`, art);
  }
  // ---------------------------------------------------- Vögel
  // Singvogel auf einem Ast. o: { k: Körper, b: Brust/Bauch, kopf, wange, schnabel, ring }
  function vogel(o) {
    o = o || {};
    const k = o.k || '#555', b = o.b || k, kopf = o.kopf || k;
    return S('0 0 200 120', bg('#e6f1fb') + `<path d="M0 96 C60 90 140 100 200 92" stroke="#8a6a44" stroke-width="7" fill="none" stroke-linecap="round"/>`
      + `<path d="M40 70 L8 62 L10 76 L44 82Z" fill="${k}"/>`
      + `<ellipse cx="92" cy="66" rx="52" ry="26" fill="${k}" transform="rotate(-8 92 66)"/>`
      + `<path d="M70 76 C90 96 130 90 142 62 C120 74 96 78 70 76Z" fill="${b}"/>`
      + `<circle cx="140" cy="46" r="20" fill="${kopf}"/>`
      + (o.wange ? `<ellipse cx="138" cy="52" rx="10" ry="7" fill="${o.wange}"/>` : '')
      + (o.brust ? `<path d="M124 56 C132 74 148 70 152 56 C144 62 132 62 124 56Z" fill="${o.brust}"/>` : '')
      + `<path d="M158 42 L180 48 L158 52Z" fill="${o.schnabel || '#555'}"/>`
      + (o.ring ? `<circle cx="146" cy="42" r="5" fill="${o.ring}"/>` : '') + `<circle cx="146" cy="42" r="3" fill="#111"/>`
      + `<path d="M92 90 L90 98 M108 90 L110 98" stroke="#7a6a54" stroke-width="2.5"/>`, o.name || 'Vogel');
  }
  const ente = () => S('0 0 200 120', bg(WASSER) + `<path d="M24 78 C30 52 90 50 124 60 C132 40 150 34 160 46 C172 44 184 50 186 52 C178 56 168 58 162 58 C158 72 150 84 130 90 C90 96 40 96 24 78Z" fill="#b9a58c"/><path d="M24 78 L8 70 L22 66Z" fill="#3b3530"/><circle cx="150" cy="46" r="15" fill="#1f7a4d"/><path d="M134 58 C142 62 156 62 164 58" stroke="#fff" stroke-width="3" fill="none"/><path d="M162 44 L188 50 L164 54Z" fill="#e3c21e"/><path d="M70 66 C90 60 110 64 118 72 C100 78 82 76 70 66Z" fill="#5f6fb0"/><circle cx="154" cy="42" r="2.5" fill="#111"/><path d="M0 92 C40 86 80 98 120 90 C150 86 180 96 200 90 V120 H0Z" fill="#b7dcf2"/>`, 'Stockente');
  const eule = () => S('0 0 200 120', bg('#1f2240') + `<path d="M0 104 H200" stroke="#8a6a44" stroke-width="8"/><path d="M70 100 C60 60 70 30 100 26 C130 30 140 60 130 100Z" fill="#d9b77a"/><path d="M78 100 C74 76 82 66 100 66 C118 66 126 76 122 100Z" fill="#f6efe2"/><path d="M100 30 C72 22 66 48 80 62 C90 70 96 66 100 58 C104 66 110 70 120 62 C134 48 128 22 100 30Z" fill="#f6efe2" stroke="#b08d57" stroke-width="2"/><circle cx="88" cy="46" r="5" fill="#111"/><circle cx="112" cy="46" r="5" fill="#111"/><path d="M100 52 L96 62 L104 62Z" fill="#c9a24a"/><circle cx="170" cy="22" r="10" fill="#f2e6a0"/>`, 'Schleiereule');
  const bussard = () => S('0 0 200 120', bg('#e6f1fb') + `<path d="M100 62 C70 40 40 34 6 40 C30 50 44 60 60 72 C76 78 90 74 100 70 C110 74 124 78 140 72 C156 60 170 50 194 40 C160 34 130 40 100 62Z" fill="#7a5a3a"/><path d="M92 66 C92 50 108 50 108 66 L112 96 L88 96Z" fill="#8a6a44"/><path d="M88 96 L84 110 L116 110 L112 96Z" fill="#6b4f33"/><circle cx="100" cy="52" r="9" fill="#8a6a44"/><path d="M96 56 L100 66 L104 56Z" fill="#e3c21e"/><path d="M30 46 l10 8 M50 50 l8 10 M150 50 l-8 10 M170 46 l-10 8" stroke="#e8d9b8" stroke-width="3"/>`, 'Mäusebussard');
  const specht = () => S('0 0 200 120', bg('#e6f1fb') + `<rect x="120" y="0" width="46" height="120" fill="#8a6a44"/><path d="M130 10 v100 M146 0 v120 M156 20 v80" stroke="#6b4f33" stroke-width="2"/><path d="M118 40 C96 36 80 50 82 74 C84 88 96 96 116 100 L120 86 C108 80 104 70 108 58Z" fill="#1b1b1b"/><path d="M92 60 C96 54 104 54 108 60 L104 76 L92 72Z" fill="#fff"/><path d="M110 96 L118 112 L124 96Z" fill="#1b1b1b"/><path d="M98 90 C104 98 112 100 118 98 L116 88Z" fill="#d0443a"/><circle cx="108" cy="36" r="13" fill="#1b1b1b"/><path d="M100 36 C104 30 114 30 118 36 C114 42 104 42 100 36Z" fill="#fff"/><path d="M98 26 C104 22 112 22 116 26 L112 30 L102 30Z" fill="#d0443a"/><path d="M118 34 L134 38 L118 42Z" fill="#555"/><circle cx="112" cy="35" r="2" fill="#111"/><path d="M112 76 L122 72 M112 82 L122 84" stroke="#555" stroke-width="2.5"/>`, 'Buntspecht');
  // Schnabel: 'haken' | 'seih' | 'meissel' | 'kegel' | 'pinzette'
  function schnabel(art) {
    const kopf = `<circle cx="70" cy="60" r="34" fill="#9a8f7e"/><circle cx="82" cy="50" r="5" fill="#111"/>`;
    const s = {
      haken: `<path d="M100 44 C130 40 150 52 148 78 C140 66 124 64 100 72Z" fill="#e3c21e"/><path d="M148 78 L142 70" stroke="#3b3530" stroke-width="3"/>`,
      seih: `<path d="M100 48 C130 44 176 52 184 62 C176 72 130 74 100 72Z" fill="#e3c21e"/><path d="M104 62 H180" stroke="#8a6a1e" stroke-width="1.5"/><path d="M110 62 v5 M120 62 v5 M130 62 v5 M140 62 v5 M150 62 v5 M160 62 v5 M170 62 v5" stroke="#8a6a1e" stroke-width="1.5"/>`,
      meissel: `<path d="M100 50 L186 60 L100 70Z" fill="#555"/><path d="M100 60 H180" stroke="#222" stroke-width="1.5"/>`,
      kegel: `<path d="M100 42 L140 62 L100 80Z" fill="#c98a3a"/><path d="M100 62 H136" stroke="#7a4f1a" stroke-width="1.5"/>`,
      pinzette: `<path d="M102 54 L160 60 L102 66Z" fill="#555"/><path d="M102 60 H156" stroke="#222" stroke-width="1"/>`,
    }[art];
    return S('0 0 200 120', bg('#e6f1fb') + s + kopf, 'Schnabel');
  }
  // Feder mit Nummern: 1 Schaft, 2 Fahne, 3 Spule, 4 Federast (Wörter wie im Buch S. 94)
  const FEDER_TEILE = ['Schaft', 'Fahne', 'Spule', 'Federast'];
  const feder = () => {
    // Schaft als Bogen; Fahne aus vielen einzelnen Federästen, außen schmaler als innen, mit zwei kleinen Lücken
    const P = (t) => { const u = 1 - t; return [u * u * 20 + 2 * u * t * 92 + t * t * 186, u * u * 104 + 2 * u * t * 74 + t * t * 14]; };
    const T = (t) => { const x = 2 * (1 - t) * 72 + 2 * t * 94, y = 2 * (1 - t) * -30 + 2 * t * -60, l = Math.hypot(x, y); return [x / l, y / l]; };
    const T0 = 0.2, N = 46, oben = [], unten = []; let aeste = '';
    for (let i = 0; i <= N; i++) {
      const t = T0 + (1 - T0) * i / N, [x, y] = P(t), [tx, ty] = T(t), f = (t - T0) / (1 - T0);
      const w = Math.pow(Math.sin(Math.PI * Math.pow(f, 0.62)), 0.75), luecke = (i === 17 || i === 31) ? 0.72 : 1;
      const a = [x + (ty * 30 + tx * 13) * w * luecke, y + (-tx * 30 + ty * 13) * w * luecke], c = [x + (-ty * 17 + tx * 11) * w, y + (tx * 17 + ty * 11) * w];
      oben.push(a); unten.push(c);
      if (i % 1 === 0 && i < N) aeste += `M${x.toFixed(1)} ${y.toFixed(1)} Q${(x + ty * 12 * w).toFixed(1)} ${(y - tx * 12 * w).toFixed(1)} ${a[0].toFixed(1)} ${a[1].toFixed(1)} M${x.toFixed(1)} ${y.toFixed(1)} Q${(x - ty * 7 * w).toFixed(1)} ${(y + tx * 7 * w).toFixed(1)} ${c[0].toFixed(1)} ${c[1].toFixed(1)} `;
    }
    const rand = (l) => l.map((q) => `${q[0].toFixed(1)} ${q[1].toFixed(1)}`).join(' L');
    const [sx, sy] = P(T0), [ex, ey] = P(1);
    const flaum = [0, 1, 2, 3].map((i) => { const [x, y] = P(T0 - 0.012 + i * 0.022); return `M${x} ${y} q-9 -${5 + i * 2} -${14 - i} -${12 + i * 3} M${x} ${y} q-2 ${8 + i} -${10 - i} ${13 + i}`; }).join(' ');
    const [hx, hy] = P(T0 + 0.8 * 0.62), hi = oben[Math.round(N * 0.62)];
    return S('0 0 200 120', bg('#f6efe2')
      + `<path d="M${sx} ${sy} L${rand(oben)} L${ex} ${ey}Z" fill="#7f9cc4"/><path d="M${sx} ${sy} L${rand(unten)} L${ex} ${ey}Z" fill="#6884ad"/>`
      + `<path d="${aeste}" stroke="#3f5680" stroke-width=".7" fill="none" opacity=".75"/>`
      + `<path d="${flaum}" stroke="#a9b6c9" stroke-width="1.1" fill="none" stroke-linecap="round"/>`
      + `<path d="M20 104 Q92 74 186 14" stroke="#efe6cf" stroke-width="3.2" fill="none" stroke-linecap="round"/><path d="M20 104 Q92 74 186 14" stroke="#8a7a5c" stroke-width="1" fill="none" stroke-linecap="round" opacity=".7"/>`
      + `<path d="M${hx.toFixed(1)} ${hy.toFixed(1)} L${hi[0].toFixed(1)} ${hi[1].toFixed(1)}" stroke="#16223d" stroke-width="2"/>`
      + marken([[150, 96, P(0.55)[0], P(0.55)[1]], [176, 70, 150, 50], [16, 70, 34, 97], [84, 16, (hx + hi[0]) / 2, (hy + hi[1]) / 2]]), 'Feder');
  };
  // Hühnerei im Schnitt: 1 Kalkschale, 2 Eiklar, 3 Dotter, 4 Keimscheibe, 5 Hagelschnur, 6 Luftkammer
  const EI_TEILE = ['Kalkschale', 'Eiklar', 'Dotter', 'Keimscheibe', 'Hagelschnur', 'Luftkammer'];
  const ei = () => S('0 0 200 120', bg('#f6efe2') + `<ellipse cx="100" cy="62" rx="74" ry="50" fill="#e8d2b0" stroke="#b08d57" stroke-width="4"/><ellipse cx="100" cy="62" rx="68" ry="44" fill="#fbfaf0"/><path d="M160 40 C172 52 172 72 160 84 C156 70 156 54 160 40Z" fill="#dfe9f2" stroke="#a9b9c9"/><path d="M36 62 q10 -8 18 0 q10 8 18 0 M124 62 q8 -8 16 0 q8 8 16 0" stroke="#c9c2a8" stroke-width="3" fill="none"/><circle cx="98" cy="62" r="26" fill="#f2b632"/><ellipse cx="98" cy="42" rx="7" ry="3.5" fill="#fff7d6" stroke="#c98a1e"/>` + marken([[20, 16, 44, 30], [56, 106, 70, 84], [100, 108, 100, 80], [100, 8, 98, 40], [186, 104, 140, 64], [184, 16, 164, 52]]), 'Hühnerei');
  // ---------------------------------------------------- Säugetiere
  // Gebiss (Schädel von der Seite, schematisch): 'fleisch' | 'pflanze' | 'alles'
  function gebiss(art) {
    const sch = `<path d="M20 50 C40 20 120 16 170 40 L182 58 L40 60Z" fill="#efe4c8" stroke="#b5a57a" stroke-width="2"/><path d="M36 70 L176 68 L168 86 C120 100 60 98 30 84Z" fill="#efe4c8" stroke="#b5a57a" stroke-width="2"/><circle cx="70" cy="40" r="9" fill="#cfc3a0"/>`;
    const z = (pts, f) => `<path d="${pts}" fill="${f || '#fff'}" stroke="#8a7d5a" stroke-width="1.2"/>`;
    let zz = '';
    if (art === 'fleisch') zz = z('M142 58 l6 26 l7 -26Z') + z('M150 70 l5 -22 l6 22Z') + z('M168 58 l3 9 l4 -9Z') + z('M160 58 l3 8 l3 -8Z') + z('M152 58 l3 8 l3 -8Z') + z('M96 60 l6 12 l5 -10 l6 12 l6 -14Z') + z('M96 70 l6 -10 l6 8 l6 -10 l6 12Z') + z('M70 60 h18 v7 h-18Z') + z('M68 70 h18 v-6 h-18Z') ;
    if (art === 'pflanze') zz = `<path d="M150 58 h26 v5 h-26Z" fill="#c9a24a" stroke="#8a7d5a"/>` + z('M152 70 h6 v-9 h-6Z') + z('M160 70 h6 v-9 h-6Z') + z('M168 70 h6 v-8 h-6Z') + [50, 64, 78, 92, 106].map((x) => z(`M${x} 60 h12 v8 h-12Z`) + z(`M${x} 70 h12 v-7 h-12Z`) + `<path d="M${x + 3} 68 v-5 M${x + 8} 68 v-5" stroke="#8a7d5a" stroke-width=".8"/>`).join('');
    if (art === 'alles') zz = z('M160 58 h6 v8 h-6Z') + z('M168 58 h6 v8 h-6Z') + z('M160 70 h6 v-8 h-6Z') + z('M168 70 h6 v-8 h-6Z') + z('M146 58 l4 14 l4 -14Z') + z('M146 72 l-4 -4 l10 -10Z') + [56, 72, 88, 104].map((x) => z(`M${x} 60 h13 v7 q-3 3 -6 0 q-3 3 -7 0Z`) + z(`M${x} 70 h13 v-6 q-3 -3 -6 0 q-3 -3 -7 0Z`)).join('') + z('M124 60 l4 7 l4 -7Z') + z('M134 60 l4 7 l4 -7Z');
    return S('0 0 200 120', bg('#f6efe2') + sch + zz, 'Gebiss');
  }
  // Vordergliedmaße mit gleichen Farben für gleiche Knochen: Oberarm rot, Unterarm blau, Hand gelb. art: 'mensch'|'maulwurf'|'fledermaus'|'wal'|'pferd'
  function gliedmasse(art) {
    const ROT = '#d0443a', BLAU = '#3d7bff', GELB = '#e3a81e';
    const k = (d, f, w) => `<path d="${d}" stroke="${f}" stroke-width="${w || 8}" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
    const g = {
      mensch: k('M40 24 L84 54', ROT, 9) + k('M84 54 L132 70 M84 58 L132 78', BLAU, 5) + k('M136 72 L150 70 M136 74 L160 78 M136 76 L160 84 M136 78 L156 90 M134 80 L148 94', GELB, 4),
      maulwurf: k('M60 40 L84 58', ROT, 13) + k('M84 58 L108 62', BLAU, 12) + `<path d="M108 44 C140 40 156 56 150 80 C140 84 118 82 106 76Z" fill="${GELB}"/>` + k('M140 44 L158 34 M148 52 L170 48 M152 62 L174 64 M150 72 L170 80 M142 80 L156 94', '#8a6a1e', 4),
      fledermaus: `<path d="M34 30 L70 60 L96 34 L176 20 L164 60 L176 96 L120 70 L96 100 L70 60Z" fill="#cdbfb0" opacity=".7"/>` + k('M34 30 L70 60', ROT, 6) + k('M70 60 L96 34', BLAU, 5) + k('M96 34 L176 20 M96 34 L164 60 M96 34 L176 96 M96 34 L120 70 M96 34 L104 24', GELB, 3),
      wal: `<path d="M40 34 C80 20 150 40 170 80 C140 96 80 90 50 66Z" fill="#9fb6c9" opacity=".8"/>` + k('M52 42 L74 52', ROT, 11) + k('M74 50 L100 56 M74 56 L98 64', BLAU, 6) + k('M102 58 L150 74 M102 60 L146 80 M102 62 L136 84 M100 64 L124 84', GELB, 3.5),
      pferd: k('M70 14 L96 38', ROT, 10) + k('M96 38 L96 70', BLAU, 8) + k('M96 72 L96 100', GELB, 6) + `<path d="M86 100 h20 l4 12 h-28Z" fill="#3b3530"/>`,
    }[art];
    return S('0 0 200 120', bg('#f6efe2') + g, 'Vordergliedmaße');
  }
  // Skelett des Menschen mit Nummern (Wörter wie im Buch S. 153): 1 Schädel, 2 Wirbelsäule, 3 Brustkorb, 4 Hüftknochen, 5 Oberarmknochen, 6 Oberschenkelknochen, 7 Schlüsselbein, 8 Kniescheibe
  const SKELETT_TEILE = ['Schädel', 'Wirbelsäule', 'Brustkorb', 'Hüftknochen', 'Oberarmknochen', 'Oberschenkelknochen', 'Schlüsselbein', 'Kniescheibe'];
  const skelett = () => { const K = '#fbf6e6', L = '#8a7d5a'; const b = (d, w) => `<path d="${d}" stroke="${L}" stroke-width="${(w || 5) + 2}" fill="none" stroke-linecap="round"/><path d="${d}" stroke="${K}" stroke-width="${w || 5}" fill="none" stroke-linecap="round"/>`;
    return S('0 0 200 170', bg('#e9eef6', 200, 170) + b('M100 34 V96', 5) + `<ellipse cx="100" cy="20" rx="13" ry="15" fill="${K}" stroke="${L}" stroke-width="2"/><circle cx="95" cy="19" r="3" fill="${L}"/><circle cx="105" cy="19" r="3" fill="${L}"/>` + [44, 52, 60, 68].map((y) => `<path d="M100 ${y} C84 ${y - 4} 78 ${y + 4} 82 ${y + 8} M100 ${y} C116 ${y - 4} 122 ${y + 4} 118 ${y + 8}" stroke="${L}" stroke-width="2.5" fill="none"/>`).join('') + `<path d="M82 96 C86 88 114 88 118 96 C116 108 84 108 82 96Z" fill="${K}" stroke="${L}" stroke-width="2"/>` + b('M80 40 H120', 4) + b('M80 40 L70 72') + b('M70 72 L66 100', 4) + b('M120 40 L130 72') + b('M130 72 L134 100', 4) + b('M90 104 L86 136', 6) + b('M86 136 L84 164', 5) + b('M110 104 L114 136', 6) + b('M114 136 L116 164', 5)
      + `<circle cx="86" cy="136" r="4.5" fill="${K}" stroke="${L}" stroke-width="1.5"/><circle cx="114" cy="136" r="4.5" fill="${K}" stroke="${L}" stroke-width="1.5"/>`
      + marken([[150, 12, 112, 18], [36, 86, 100, 84], [162, 62, 120, 60], [158, 106, 114, 100], [40, 50, 74, 56], [44, 126, 88, 120], [166, 36, 112, 40], [156, 142, 118, 137]]), 'Skelett des Menschen'); };

  const BILDER = {
    // Lurche
    wasserfrosch: () => frosch({ k: '#5fa644', fl: '#2f6b2a', streif: '#b9e08a', wasser: true, name: 'Wasserfrosch' }),
    grasfrosch: () => frosch({ k: '#a67c4a', fl: '#5a3e22', fleck: '#3b2a18', name: 'Grasfrosch' }),
    laubfrosch: () => frosch({ k: '#63c23a', b: '#f4f2dc', haft: true, name: 'Laubfrosch' }),
    erdkroete: () => frosch({ k: '#8a6a44', b: '#cdbf9f', warzen: true, plump: true, name: 'Erdkröte' }),
    kreuzkroete: () => frosch({ k: '#7f8a52', b: '#d6d0a8', warzen: true, plump: true, streif: '#efe6a0', name: 'Kreuzkröte' }),
    rotbauchunke: () => frosch({ k: '#3b3a36', b: '#e2572c', bauchfl: '#22201c', warzen: true, plump: true, name: 'Rotbauchunke' }),
    gelbbauchunke: () => frosch({ k: '#7a7566', b: '#f2cf2e', bauchfl: '#3b3a36', warzen: true, plump: true, name: 'Gelbbauchunke' }),
    frosch: () => frosch({ k: '#5fa644', wasser: true }),
    feuersalamander: () => molch({ k: '#1c1b22', punkte: '#f2cf2e', name: 'Feuersalamander' }),
    teichmolch: () => molch({ k: '#9a7b4a', b: '#f0b24a', bauchfl: '#3b2a18', wasser: true, name: 'Teichmolch' }),
    bergmolch: () => molch({ k: '#4a6fa5', b: '#f07a1e', wasser: true, name: 'Bergmolch' }),
    kammmolch: () => molch({ k: '#2f2b28', b: '#f2a81e', bauchfl: '#1b1b1b', kamm: '#2f2b28', wasser: true, name: 'Kammmolch' }),
    laich: () => stufe(0), quappe1: () => stufe(1), quappe2: () => stufe(2), quappe3: () => stufe(3), quappe4: () => stufe(4), jungfrosch: () => stufe(5),
    // Fische
    karpfen: () => fisch({ form: 'karpfen' }), hecht: () => fisch({ form: 'hecht' }), forelle: () => fisch({ form: 'forelle' }), aal: () => fisch({ form: 'aal' }),
    fischNr, seitenlinie: () => fisch({ form: 'karpfen', linie: true }),
    // Kriechtiere
    zauneidechse: () => echse({ k: '#7a8f4a', muster: '#3b2f24', schuppen: true, name: 'Zauneidechse' }),
    ringelnatter: () => schlange('ringelnatter'), kreuzotter: () => schlange('kreuzotter'), blindschleiche: () => schlange('blindschleiche'),
    // Vögel
    amsel: () => vogel({ k: '#1b1b1b', schnabel: '#f0a81e', ring: '#f0a81e', name: 'Amsel (Männchen)' }),
    kohlmeise: () => vogel({ k: '#6f8a5a', b: '#f2d83a', kopf: '#1b1b1b', wange: '#fff', schnabel: '#333', name: 'Kohlmeise' }),
    rotkehlchen: () => vogel({ k: '#8a7a5a', b: '#efe9dc', brust: '#e2702c', schnabel: '#333', name: 'Rotkehlchen' }),
    sperling: () => vogel({ k: '#8a623a', b: '#cfc6b6', kopf: '#7a7f86', wange: '#e6e0d4', schnabel: '#3b3530', name: 'Haussperling' }),
    stockente: ente, schleiereule: eule, bussard, buntspecht: specht,
    schnabelHaken: () => schnabel('haken'), schnabelSeih: () => schnabel('seih'), schnabelMeissel: () => schnabel('meissel'), schnabelKegel: () => schnabel('kegel'), schnabelPinzette: () => schnabel('pinzette'),
    feder, ei,
    // Säugetiere
    gebissFleisch: () => gebiss('fleisch'), gebissPflanze: () => gebiss('pflanze'), gebissAlles: () => gebiss('alles'),
    armMensch: () => gliedmasse('mensch'), armMaulwurf: () => gliedmasse('maulwurf'), armFledermaus: () => gliedmasse('fledermaus'), armWal: () => gliedmasse('wal'), armPferd: () => gliedmasse('pferd'),
    skelett,
  };
  D.bilder = BILDER;
  D.teile = { fischNr: FISCH_TEILE, feder: FEDER_TEILE, ei: EI_TEILE, skelett: SKELETT_TEILE };

  // =====================================================
  // Bausteine für Wissensaufgaben (wie in GeDax)
  // =====================================================
  // Auswahl: { f: Frage, a: richtig, x: [falsche …], w: warum, svg?: Bildname, h?: Tipp }
  function auswahl(art, e, hint) {
    const ch = shuffle([e.a, ...shuffle(e.x).slice(0, 3)]);
    const t = { prompt: e.f, choices: ch, correct: ch.indexOf(e.a), hint: e.h || hint, solution: `<b>${e.a}</b><br>${e.w}`,
      ex: { mode: 'karte', nach: false, art, q: nurText(e.f), opts: ch, ok: ch.indexOf(e.a), svg: e.svg || '', merk: `<b>${e.a}</b>: ${e.w}` } };
    if (e.svg) t.figure = BILDER[e.svg]();
    return t;
  }
  // Lücke tippen: { f: 'Satz mit ___', a: 'Wort' oder ['Wort', 'andere Schreibweise'], w }
  function tippen(art, e, hint) {
    const [vor, nach] = e.f.split('___'), a = [].concat(e.a);
    const t = { prompt: e.p || 'Ergänze das fehlende Wort.', layout: 'satz', fields: [{ type: 'text', answer: a, prefix: vor.trim(), suffix: (nach || '').trim(), label: 'Lücke', ci: true }],
      hint: e.h || hint, solution: `${e.f.replace('___', `<b>${a[0]}</b>`)}<br>${e.w}`,
      ex: { mode: 'karte', nach: false, art, q: e.f.replace('___', '…'), opts: [a[0]], ok: 0, svg: e.svg || '', merk: `<b>${a[0]}</b>: ${e.w}` } };
    if (e.svg) t.figure = BILDER[e.svg]();
    return t;
  }
  // Reihenfolge: { t: Aufgabe, items: [in richtiger Reihenfolge], w: Merksatz, bilder?: [Bildnamen] }, n = wie viele Teile
  function ordnen(art, e, hint, n) {
    let idx = e.items.map((_, i) => i);
    if (n && n < idx.length) idx = shuffle(idx).slice(0, n).sort((a, b) => a - b);
    const teile = idx.map((i) => e.items[i]);
    const loes = teile.map((x, k) => `${k + 1}. ${x}`).join('<br>');
    return { prompt: e.t, order: { words: mische(teile), answer: teile.join(' '), end: '' }, hint: e.h || hint, solution: `${loes}${e.w ? '<br>' + e.w : ''}`,
      ex: { mode: 'reihe', art, items: teile, bilder: e.bilder ? idx.map((i) => e.bilder[i]) : null, s1: e.s1 || 'Schritt für Schritt:', merk: e.w || `Die richtige Reihenfolge: ${teile.join(' → ')}` } };
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
    return { prompt: def.nicht || 'Drei gehören zusammen. Was <b>passt nicht</b> dazu?', choices: ch, correct: ch.indexOf(raus[0]), hint: def.h,
      solution: `<b>${raus[0]}</b> gehört zu „${def.kats[raus[1]]}“. Die anderen gehören zu „${def.kats[k]}“.`,
      ex: { mode: 'faecher', art, kats: def.kats, items: [[raus[0], raus[1]], ...drin.map((x) => [x[0], x[1]])], merk: `<b>${raus[0]}</b> passt nicht: ${def.kats[raus[1]]}. Die anderen: ${def.kats[k]}.` } };
  }
  // Aussagen: { w: [wahre], f: [falsche] }
  function aussage(art, def, hint, falschGesucht) {
    const ok = falschGesucht ? pick(def.f) : pick(def.w), rest = shuffle(falschGesucht ? def.w : def.f).slice(0, 2), ch = shuffle([ok, ...rest]);
    return { prompt: falschGesucht ? 'Welche Aussage ist <b>falsch</b>?' : 'Welche Aussage <b>stimmt</b>?', choices: ch, correct: ch.indexOf(ok), hint,
      solution: falschGesucht ? `Falsch ist: <b>${ok}</b>` : `Richtig ist: <b>${ok}</b>`,
      ex: { mode: 'karte', nach: false, art, q: falschGesucht ? 'Welche Aussage ist falsch?' : 'Welche Aussage stimmt?', opts: ch, ok: ch.indexOf(ok), svg: '', merk: `${falschGesucht ? 'Falsch' : 'Richtig'}: <b>${ok}</b>` } };
  }
  // Bild beschriften: Bild mit Nummern, gefragt ist der Name eines Teils. def = { svg: Bildname, teile: [...], was: { Teil: Aufgabe } }
  function beschriften(art, def, hint) {
    const i = R(0, def.teile.length - 1), a = def.teile[i];
    const ch = shuffle([a, ...shuffle(def.teile.filter((x) => x !== a)).slice(0, 3)]);
    const w = (def.was && def.was[a]) || '';
    return { prompt: `Schau dir das Bild an. Wie heißt der Teil mit der <b>Nummer ${i + 1}</b>?`, figure: BILDER[def.svg](), choices: ch, correct: ch.indexOf(a), hint: def.h || hint,
      solution: `Nummer ${i + 1} ist: <b>${a}</b>${w ? '<br>' + w : ''}`,
      ex: { mode: 'karte', nach: false, art, q: `Wie heißt der Teil mit der Nummer ${i + 1}?`, opts: ch, ok: ch.indexOf(a), svg: def.svg, merk: `Nummer ${i + 1}: <b>${a}</b>${w ? '. ' + w : ''}` } };
  }
  // Tier am Bild erkennen: def = { arten: [[Bildname, Name, Merkmal], ...], f?: Frage }
  function erkennen(art, def, hint) {
    const e = pick(def.arten), ch = shuffle([e[1], ...shuffle(def.arten.filter((x) => x[1] !== e[1]).map((x) => x[1])).slice(0, 3)]);
    return { prompt: def.f || 'Welches Tier ist das?', figure: BILDER[e[0]](), choices: ch, correct: ch.indexOf(e[1]), hint: def.h || hint,
      solution: `<b>${e[1]}</b><br>${e[2]}`,
      ex: { mode: 'karte', nach: false, art, q: nurText(def.f || 'Welches Tier ist das?'), opts: ch, ok: ch.indexOf(e[1]), svg: e[0], merk: `<b>${e[1]}</b>: ${e[2]}` } };
  }
  // Ein Thema aus einer Sammlung bauen. b = { h: Tipp, F, T, O, S, A, B (beschriften), E (erkennen), extra: {art: fn} }, gw = Gewichte
  D.arten = {};
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
    gw = Object.assign({ frage: 34, tippen: 14, ordnen: 14, sortieren: 16, passtNicht: 8, aussage: 12, beschriften: 18, erkennen: 18 }, gw || {});
    const liste = Object.keys(a).map((k) => [gw[k] ?? 15, a[k]]).filter((x) => x[0] > 0);
    D.banken = D.banken || {}; D.banken[id] = b;
    return () => U.wahl(liste);
  }
  Object.assign(U, { auswahl, tippen, ordnen, sortiere, passtNicht, aussage, beschriften, erkennen, baue });
  D.gen = {};   // hier legen die Themen-Dateien ihre Generatoren ab
})();
