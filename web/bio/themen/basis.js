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
    const k = o.k || '#8a6d3b', b = o.b || k;
    const punkte = o.punkte ? [[40, 62], [58, 54], [76, 50], [94, 52], [112, 50], [130, 54], [150, 58], [66, 64], [104, 62], [22, 70], [164, 54]].map(([x, y], i) => `<ellipse cx="${x}" cy="${y}" rx="${i % 2 ? 5.5 : 4}" ry="${i % 2 ? 3.4 : 3}" fill="${o.punkte}"/>`).join('') : '';
    const kamm = o.kamm ? `<path d="M10 66 L16 54 L22 62 L30 48 L38 58 L48 42 L58 52 L68 38 L80 48 L92 36 L104 46 L116 36 L128 46 L138 40 L146 50 L146 60 L10 70Z" fill="${o.kamm}"/>` : '';
    const bein = (x) => `<path d="M${x} 72 L${x - 6} 90 L${x - 14} 92 M${x - 6} 90 L${x - 4} 96 M${x - 6} 90 L${x + 2} 94" stroke="${k}" stroke-width="6" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
    return S('0 0 200 120', bg(o.wasser ? WASSER : LAND) + `<path d="M0 98 H200 V120 H0Z" fill="${o.wasser ? '#b7dcf2' : '#cfe0ae'}"/>` + kamm
      + bein(70) + bein(128)
      + `<path d="M4 72 C30 60 50 56 80 54 C110 50 140 50 160 52 C178 52 192 58 192 64 C192 72 180 76 164 76 C140 78 110 80 80 78 C50 78 30 78 4 72Z" fill="${k}"/>`
      + `<path d="M40 76 C70 80 130 80 170 75 C150 82 110 84 80 82 C60 82 48 80 40 76Z" fill="${b}"/>`
      + (o.bauchfl ? [[70, 80], [96, 82], [122, 81], [146, 79]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="2" fill="${o.bauchfl}"/>`).join('') : '')
      + punkte + auge(176, 60, 4.5, o.punkte ? '#1b1b1b' : '#f2c14e'), o.name || 'Schwanzlurch');
  }
  // ---------------------------------------------------- Entwicklung des Frosches: Stufen 0..5
  function stufe(i) {
    const W = bg(WASSER) + `<path d="M0 104 H200 V120 H0Z" fill="#b7dcf2"/><path d="M20 120 C22 90 16 70 24 40 M180 120 C176 96 184 76 176 50" stroke="#6aa84f" stroke-width="4" fill="none"/>`;
    const Q = '#3b3530';
    if (i === 0) { // Laich
      let s = '';
      [[70, 50], [92, 44], [114, 50], [60, 68], [82, 64], [104, 66], [126, 68], [72, 84], [94, 86], [116, 84], [138, 56]].forEach(([x, y]) => { s += `<circle cx="${x}" cy="${y}" r="11" fill="#f4fbff" stroke="#a9c9de" stroke-width="1.2" opacity=".95"/><circle cx="${x}" cy="${y}" r="4" fill="${Q}"/>`; });
      return S('0 0 200 120', W + s, 'Laich');
    }
    if (i === 1) return S('0 0 200 120', W + `<path d="M112 62 C140 56 168 60 186 62 C168 66 140 68 112 66Z" fill="${Q}"/><ellipse cx="96" cy="64" rx="24" ry="14" fill="${Q}"/><path d="M76 54 L62 44 M74 58 L58 54 M74 64 L60 66 M76 70 L64 78" stroke="#b5486b" stroke-width="3" stroke-linecap="round"/><circle cx="84" cy="60" r="2.5" fill="#fff"/>`, 'Kaulquappe mit Außenkiemen');
    if (i === 2) return S('0 0 200 120', W + `<path d="M108 60 C140 46 170 54 190 62 C170 70 140 78 108 68Z" fill="${Q}" opacity=".8"/><ellipse cx="86" cy="64" rx="30" ry="19" fill="${Q}"/><circle cx="68" cy="58" r="3" fill="#fff"/>`, 'Kaulquappe ohne Beine');
    if (i === 3) return S('0 0 200 120', W + `<path d="M108 60 C140 46 170 54 190 62 C170 70 140 78 108 68Z" fill="${Q}" opacity=".8"/><path d="M104 76 L118 90 L106 98 M106 98 L98 100" stroke="#5a6b3a" stroke-width="6" fill="none" stroke-linecap="round" stroke-linejoin="round"/><ellipse cx="86" cy="64" rx="30" ry="19" fill="#5a6b3a"/><circle cx="68" cy="58" r="3" fill="#fff"/>`, 'Kaulquappe mit Hinterbeinen');
    if (i === 4) return S('0 0 200 120', W + `<path d="M108 60 C136 50 160 56 176 62 C160 68 136 74 108 68Z" fill="#5a6b3a" opacity=".85"/><path d="M104 76 L118 90 L106 98 M106 98 L98 100 M70 78 L64 94 L72 98" stroke="#5a8f3a" stroke-width="6" fill="none" stroke-linecap="round" stroke-linejoin="round"/><ellipse cx="86" cy="64" rx="30" ry="18" fill="#5a8f3a"/><circle cx="66" cy="54" r="5" fill="#5a8f3a"/><circle cx="66" cy="54" r="3" fill="#f2c14e"/><circle cx="66" cy="54" r="1.5" fill="#111"/>`, 'Kaulquappe mit vier Beinen');
    return frosch({ k: '#6aa84f', name: 'Jungfrosch' });
  }
  // ---------------------------------------------------- Fisch
  // o: { k, b, form: 'karpfen'|'hecht'|'forelle'|'aal', marken: Nummern an die Teile }
  function fisch(o) {
    o = o || {};
    const f = o.form || 'karpfen';
    const W = bg(WASSER) + `<path d="M0 108 C40 100 80 112 120 104 C150 98 180 108 200 104 V120 H0Z" fill="#c9b98f"/>`;
    if (f === 'aal') return S('0 0 200 120', W + `<path d="M12 70 C40 40 70 96 100 66 C124 44 150 78 176 58" stroke="#4a5a3a" stroke-width="13" fill="none" stroke-linecap="round"/><path d="M14 66 C40 34 70 90 100 60 C122 40 140 62 160 56" stroke="#3c4a30" stroke-width="3" fill="none"/>${auge(174, 56, 2.6)}<path d="M158 66 l8 8 l2 -8Z" fill="#3c4a30"/>`, 'Aal');
    const P = {
      karpfen: { k: '#b08a3c', b: '#e8d9a0', body: 'M26 62 C50 26 110 22 150 44 C166 52 176 58 178 62 C176 68 164 76 148 82 C108 98 50 94 26 62Z', rf: 'M70 34 C90 16 126 20 138 38 L130 40 C110 30 90 34 78 40Z', sf: 'M28 62 L4 40 C12 56 12 68 4 86Z', af: 'M70 88 L64 104 L88 92Z', bf: 'M100 90 L96 106 L116 92Z', brf: 'M136 72 L128 90 L148 78Z' },
      hecht: { k: '#6b8a4a', b: '#dfe7c0', body: 'M24 62 C50 46 120 44 160 52 C176 56 190 60 194 62 C188 66 176 70 160 72 C120 80 50 78 24 62Z', rf: 'M52 48 C60 34 78 34 84 46 L76 48Z', sf: 'M26 62 L4 44 C10 58 10 66 4 82Z', af: 'M54 76 L52 90 L74 78Z', bf: 'M104 76 L100 90 L118 78Z', brf: 'M148 68 L142 82 L158 72Z' },
      forelle: { k: '#8a9a6a', b: '#f0e6c8', body: 'M24 62 C50 38 110 34 150 46 C168 52 180 58 184 62 C180 66 168 72 150 78 C110 90 50 86 24 62Z', rf: 'M88 38 C96 24 112 24 120 38 L112 40Z', sf: 'M26 62 L4 42 C10 56 10 68 4 84Z', af: 'M64 82 L60 96 L80 86Z', bf: 'M100 84 L96 98 L114 86Z', brf: 'M140 72 L134 88 L152 76Z' },
    }[f];
    const k = o.k || P.k;
    let extra = '';
    if (f === 'karpfen') extra = `<path d="M174 68 q4 8 -2 12 M168 70 q2 8 -4 10" stroke="${k}" stroke-width="2" fill="none" stroke-linecap="round"/>` + [[60, 56], [76, 50], [92, 48], [108, 50], [70, 66], [86, 62], [102, 62], [118, 60], [80, 76], [96, 74], [112, 72]].map(([x, y]) => `<path d="M${x} ${y} q6 5 0 10" stroke="rgba(0,0,0,.25)" stroke-width="1.5" fill="none"/>`).join('');
    if (f === 'forelle') extra = [[60, 58], [78, 52], [96, 50], [114, 52], [70, 66], [90, 62], [108, 62], [126, 58]].map(([x, y], i) => `<circle cx="${x}" cy="${y}" r="2.6" fill="${i % 3 ? '#3b3530' : '#d0443a'}"/>`).join('') + `<path d="M50 46 C54 40 60 40 62 46Z" fill="${k}"/>`;
    if (f === 'hecht') extra = [[50, 60], [70, 56], [90, 58], [110, 56], [130, 60], [60, 66], [100, 66]].map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="5" ry="2.5" fill="#dfe7c0" opacity=".8"/>`).join('');
    const kiemen = f === 'hecht' ? 'M150 54 C144 60 144 66 150 72' : 'M146 50 C138 58 138 68 146 78';
    const ax = f === 'hecht' ? 170 : 160;
    return S('0 0 200 120', W + `<path d="${P.sf}" fill="${k}"/><path d="${P.rf}" fill="${k}"/><path d="${P.af}" fill="${k}"/><path d="${P.bf}" fill="${k}"/>`
      + `<path d="${P.body}" fill="${k}"/><path d="${P.body}" fill="${P.b}" clip-path="inset(55% 0 0 0)" opacity=".85"/>`
      + extra + `<path d="${P.brf}" fill="${k}" stroke="rgba(0,0,0,.25)"/>`
      + `<path d="${kiemen}" stroke="${TINTE}" stroke-width="1.8" fill="none"/>`
      + (o.linie ? `<path d="M34 62 C70 58 110 58 140 62" stroke="${TINTE}" stroke-width="1.2" stroke-dasharray="3 3" fill="none"/>` : '')
      + auge(ax, 58, 4) + (o.marken ? marken(o.marken) : ''), o.name || 'Fisch');
  }
  // Fisch mit Nummern: 1 Rückenflosse, 2 Schwanzflosse, 3 Afterflosse, 4 Bauchflosse, 5 Brustflosse, 6 Kiemendeckel
  const FISCH_TEILE = ['Rückenflosse', 'Schwanzflosse', 'Afterflosse', 'Bauchflosse', 'Brustflosse', 'Kiemendeckel'];
  const fischNr = () => fisch({ form: 'karpfen', marken: [[104, 10, 104, 28], [14, 22, 12, 52], [56, 110, 72, 96], [112, 110, 104, 98], [160, 104, 140, 82], [176, 28, 144, 60]] });

  // ---------------------------------------------------- Kriechtiere
  function echse(o) {
    o = o || {};
    const k = o.k || '#7a8f4a';
    const bein = (x, d) => `<path d="M${x} 74 L${x + d * 8} 88 L${x + d * 18} 90" stroke="${k}" stroke-width="5.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
    return S('0 0 200 120', bg(LAND) + `<path d="M0 96 H200 V120 H0Z" fill="#d8c9a0"/>` + bein(70, -1) + bein(120, 1)
      + `<path d="M4 84 C30 70 50 66 80 62 C110 58 140 58 160 60 C178 60 194 66 194 70 C194 76 180 80 162 80 C140 82 110 82 82 80 C50 80 28 86 4 84Z" fill="${k}"/>`
      + (o.muster ? [[50, 68], [66, 66], [82, 64], [98, 64], [114, 64], [130, 64], [146, 64]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="3" fill="${o.muster}"/><circle cx="${x}" cy="${y}" r="1.2" fill="#fff"/>`).join('') : '')
      + (o.schuppen ? `<path d="M40 74 q5 -5 10 0 q5 -5 10 0 q5 -5 10 0 q5 -5 10 0 q5 -5 10 0 q5 -5 10 0 q5 -5 10 0 q5 -5 10 0 q5 -5 10 0 q5 -5 10 0" stroke="rgba(0,0,0,.3)" fill="none"/>` : '')
      + auge(178, 66, 3.5), o.name || 'Eidechse');
  }
  // art: 'ringelnatter' | 'kreuzotter' | 'blindschleiche'
  function schlange(art) {
    const k = { ringelnatter: '#6f7b7a', kreuzotter: '#b9a78a', blindschleiche: '#b08d57' }[art] || '#777';
    const weg = 'M14 86 C40 50 70 100 100 70 C124 46 150 84 174 60';
    let extra = '';
    if (art === 'kreuzotter') extra = `<path d="M18 82 l8 -14 l8 14 l8 -18 l8 14 l8 -6 l8 16 l8 -4 l8 -16 l8 -6 l8 10 l8 -18 l8 16 l8 -2 l8 14 l8 -12 l8 -10 l8 2" stroke="#3b2f24" stroke-width="4" fill="none" stroke-linejoin="round"/>`;
    const kopf = art === 'blindschleiche' ? `<circle cx="176" cy="59" r="8" fill="${k}"/>` : art === 'kreuzotter' ? `<path d="M168 50 L190 52 L186 68 L168 70Z" fill="${k}"/>` : `<ellipse cx="180" cy="58" rx="12" ry="8.5" fill="${k}"/>`;
    const mond = art === 'ringelnatter' ? `<path d="M164 52 q6 8 0 18 q-7 -9 0 -18Z" fill="#f2d24e"/><path d="M158 54 q5 7 0 15" stroke="#1b1b1b" stroke-width="3" fill="none"/>` : '';
    return S('0 0 200 120', bg(LAND) + `<path d="M0 98 H200 V120 H0Z" fill="#cfe0ae"/><path d="${weg}" stroke="${k}" stroke-width="${art === 'kreuzotter' ? 16 : 13}" fill="none" stroke-linecap="round"/>` + extra + kopf + mond
      + auge(183, 56, 2.6, art === 'kreuzotter' ? '#c0392b' : '#f2c14e'), art);
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
