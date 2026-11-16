/* TecDax – eigene Zeichnungen (Schemazeichnungen; Geräte und Werkzeuge nur als Ersatz, bis das freie Foto geladen ist)
 * Jede Zeichnung ist eine Funktion, die ein <svg> liefert, und steht in D.bilder unter ihrem Namen.
 * Erzeugte Bilder (mit Zufall) sind Funktionen in D.zeichne:
 *   zahnraeder(o)  Räder nebeneinander: o.z = [Zähne …], o.namen, o.pfeil (Drehrichtung des ersten), o.hell (Index), o.dreh (Drehwinkel)
 *   riemen(o)      zwei Scheiben mit Riemen; o.gekreuzt, o.kette, o.r = [r1, r2]
 *   ordnerbaum(b)  Ordnerbaum aus { name, kinder: [...] } (Dateien haben einen Punkt im Namen); b.hell = Name
 *   bemassung(o)   Platte mit Loch, bemaßt: o = { l, b, x, y, d } in mm
 *   koerper(h)     Körper aus Würfeln (Höhen h[y][x]) schräg von vorn, mit Pfeil „von vorn“
 *   ansicht(h, art) Vorderansicht, Draufsicht oder Seitenansicht von links
 *   lineal(mm)     Stahlmaßstab an der Bezugskante, roter Anriss bei mm
 *   stueckliste(z) Tabelle: z = { kopf: [...], zeilen: [[...], ...], breiten: [...] }
 *   linien(hell)   kleine technische Zeichnung; hell = 'breit' | 'schmal' | 'strich' | 'strichpunkt' (rot)
 * Keine Bilder aus Büchern; alles selbst gezeichnet.
 */
(function () {
  const D = window.TecDax;
  const B = D.bilder;
  const T = '#2b2540', BLAU = '#1f55d6', ROT = '#d0443a', GRAU = '#9a94a8', HELL = '#eef1f6', METALL = '#b8c0cc', DUNKEL = '#5b6378', HOLZ = '#d9a86c', GELB = '#ffcf4a', GRUEN = '#0a7d57';
  const svg = (w, h, inhalt, name) => `<svg viewBox="0 0 ${w} ${h}" role="img" aria-label="${name}" style="max-width:100%;height:auto"><rect width="${w}" height="${h}" fill="#fff"/>${inhalt}</svg>`;
  const tx = (x, y, t, fs, farbe, anker, w) => `<text x="${x}" y="${y}" text-anchor="${anker || 'middle'}" style="font:${w || 800} ${fs || 9}px Nunito,sans-serif;fill:${farbe || T}">${t}</text>`;
  const nr = LernDaxBausteine.nr;
  const r1 = (v) => +v.toFixed(1);
  D.svg = svg; D.tx = tx;

  // =====================================================
  // Geräte am Computerarbeitsplatz (Ersatz für Fotos)
  // =====================================================
  B.tastatur = () => {
    let s = `<rect x="22" y="38" width="156" height="50" rx="6" fill="${HELL}" stroke="${T}" stroke-width="2"/>`;
    for (let r = 0; r < 4; r++) for (let c = 0; c < 13; c++) s += `<rect x="${29 + c * 11}" y="${44 + r * 10}" width="9" height="8" rx="1.5" fill="#fff" stroke="${GRAU}"/>`;
    s += `<rect x="62" y="84" width="76" height="0" stroke="${T}"/><rect x="62" y="80" width="0" height="0"/>`;
    return svg(200, 120, s, 'Gerät');
  };
  B.maus = () => svg(200, 120, `<path d="M100 12 C 100 30 80 26 80 40" fill="none" stroke="${T}" stroke-width="2"/><rect x="74" y="38" width="52" height="74" rx="26" fill="${HELL}" stroke="${T}" stroke-width="2"/><path d="M100 38 V 66 M74 64 H126" stroke="${T}" stroke-width="1.6"/><rect x="97" y="46" width="6" height="12" rx="3" fill="${DUNKEL}"/>`, 'Gerät');
  B.bildschirm = () => svg(200, 120, `<rect x="36" y="10" width="128" height="80" rx="4" fill="${T}"/><rect x="42" y="16" width="116" height="68" fill="#cfe6ff"/><path d="M92 90 L88 106 H112 L108 90Z" fill="${DUNKEL}"/><rect x="74" y="104" width="52" height="6" rx="2" fill="${DUNKEL}"/>`, 'Gerät');
  B.drucker = () => svg(200, 120, `<rect x="66" y="8" width="68" height="34" fill="#fff" stroke="${T}" stroke-width="1.5"/><path d="M74 18 H126 M74 26 H118" stroke="${GRAU}"/><rect x="40" y="38" width="120" height="50" rx="6" fill="${HELL}" stroke="${T}" stroke-width="2"/><rect x="58" y="84" width="84" height="22" fill="#fff" stroke="${T}" stroke-width="1.5"/><circle cx="146" cy="50" r="3" fill="${GRUEN}"/>`, 'Gerät');
  B.scanner = () => svg(200, 120, `<path d="M30 60 L44 18 H170 L160 60Z" fill="${HELL}" stroke="${T}" stroke-width="2"/><rect x="30" y="60" width="140" height="34" rx="4" fill="${HELL}" stroke="${T}" stroke-width="2"/><rect x="38" y="64" width="124" height="6" fill="#bfe3ff"/><rect x="88" y="62" width="6" height="10" fill="${BLAU}" opacity=".6"/>`, 'Gerät');
  B.lautsprecher = () => svg(200, 120, `<rect x="70" y="8" width="60" height="104" rx="6" fill="${DUNKEL}" stroke="${T}" stroke-width="2"/><circle cx="100" cy="34" r="13" fill="${T}" stroke="${METALL}" stroke-width="2"/><circle cx="100" cy="78" r="22" fill="${T}" stroke="${METALL}" stroke-width="2"/><circle cx="100" cy="78" r="7" fill="${METALL}"/>`, 'Gerät');
  B.mikrofon = () => svg(200, 120, `<rect x="88" y="8" width="24" height="44" rx="12" fill="${METALL}" stroke="${T}" stroke-width="2"/><path d="M90 20 H110 M90 28 H110 M90 36 H110" stroke="${T}" stroke-width="1"/><path d="M80 40 C80 66 120 66 120 40" fill="none" stroke="${T}" stroke-width="2.5"/><path d="M100 62 V 100" stroke="${T}" stroke-width="3"/><rect x="76" y="100" width="48" height="8" rx="3" fill="${DUNKEL}"/>`, 'Gerät');
  B.webcam = () => svg(200, 120, `<circle cx="100" cy="46" r="32" fill="${HELL}" stroke="${T}" stroke-width="2"/><circle cx="100" cy="46" r="15" fill="${T}"/><circle cx="100" cy="46" r="7" fill="#3a5fa0"/><circle cx="96" cy="42" r="2.5" fill="#fff"/><circle cx="124" cy="26" r="3" fill="${GRUEN}"/><path d="M84 76 L78 98 H122 L116 76" fill="${DUNKEL}"/>`, 'Gerät');
  B.usbstick = () => svg(200, 120, `<rect x="54" y="42" width="80" height="36" rx="8" fill="${BLAU}"/><rect x="134" y="48" width="30" height="24" fill="${METALL}" stroke="${T}" stroke-width="1.5"/><rect x="142" y="54" width="6" height="5" fill="${T}"/><rect x="152" y="54" width="6" height="5" fill="${T}"/><circle cx="66" cy="60" r="4" fill="#fff"/>`, 'Gerät');
  B.festplatte = () => svg(200, 120, `<rect x="44" y="14" width="112" height="92" rx="6" fill="${METALL}" stroke="${T}" stroke-width="2"/><circle cx="96" cy="58" r="34" fill="#dfe3ea" stroke="${T}" stroke-width="1.5"/><circle cx="96" cy="58" r="6" fill="${T}"/><path d="M142 92 L112 54" stroke="${T}" stroke-width="4" stroke-linecap="round"/><circle cx="142" cy="92" r="6" fill="${DUNKEL}"/>`, 'Gerät');
  B.rechner = () => svg(200, 120, `<rect x="70" y="6" width="60" height="108" rx="4" fill="${DUNKEL}" stroke="${T}" stroke-width="2"/><rect x="78" y="16" width="44" height="8" rx="2" fill="${T}"/><rect x="78" y="30" width="44" height="8" rx="2" fill="${T}"/><circle cx="100" cy="92" r="7" fill="none" stroke="${METALL}" stroke-width="2"/><path d="M100 86 V 92" stroke="${METALL}" stroke-width="2"/>`, 'Gerät');
  B.beamer = () => svg(200, 120, `<path d="M146 60 L198 30 V 96 Z" fill="${GELB}" opacity=".35"/><rect x="40" y="44" width="100" height="40" rx="8" fill="${HELL}" stroke="${T}" stroke-width="2"/><circle cx="124" cy="64" r="13" fill="${T}"/><circle cx="124" cy="64" r="6" fill="#9cc2ff"/><rect x="50" y="84" width="10" height="6" fill="${T}"/><rect x="118" y="84" width="10" height="6" fill="${T}"/>`, 'Gerät');
  B.touchscreen = () => svg(200, 120, `<rect x="56" y="8" width="88" height="104" rx="10" fill="${T}"/><rect x="62" y="16" width="76" height="86" rx="3" fill="#cfe6ff"/><circle cx="112" cy="58" r="10" fill="none" stroke="${BLAU}" stroke-width="2"/><path d="M118 70 C 120 84 130 94 140 98" fill="none" stroke="${HOLZ}" stroke-width="12" stroke-linecap="round"/>`, 'Gerät');

  // =====================================================
  // Werkzeuge und Maschinen der Werkstatt (Ersatz für Fotos)
  // =====================================================
  B.dekupiersaege = () => svg(200, 120, `<rect x="20" y="96" width="160" height="16" fill="${DUNKEL}"/><rect x="40" y="70" width="120" height="8" fill="${METALL}" stroke="${T}"/><path d="M150 96 V 20 H 96 V 34" fill="none" stroke="${DUNKEL}" stroke-width="12"/><path d="M96 34 V 92" stroke="${T}" stroke-width="1.6"/><rect x="132" y="78" width="40" height="18" fill="${DUNKEL}"/>`, 'Maschine');
  B.tischbohrmaschine = () => svg(200, 120, `<rect x="60" y="104" width="80" height="10" fill="${DUNKEL}"/><rect x="116" y="10" width="10" height="96" fill="${METALL}" stroke="${T}"/><rect x="66" y="12" width="66" height="30" rx="4" fill="${DUNKEL}"/><rect x="88" y="42" width="16" height="16" fill="${METALL}" stroke="${T}"/><path d="M96 58 V 82" stroke="${T}" stroke-width="3"/><rect x="72" y="84" width="54" height="6" fill="${METALL}" stroke="${T}"/><path d="M132 30 L152 46" stroke="${T}" stroke-width="3"/><circle cx="154" cy="48" r="4" fill="${T}"/>`, 'Maschine');
  B.akkuschrauber = () => svg(200, 120, `<path d="M40 30 H130 V 56 H96 L88 92 H66 L74 56 H40Z" fill="${GRUEN}" stroke="${T}" stroke-width="2"/><rect x="58" y="92" width="44" height="18" rx="3" fill="${T}"/><rect x="130" y="36" width="20" height="14" fill="${METALL}" stroke="${T}"/><path d="M150 43 H176" stroke="${T}" stroke-width="3"/><rect x="82" y="58" width="6" height="10" rx="2" fill="${T}"/>`, 'Maschine');
  B.naehmaschine = () => svg(200, 120, `<rect x="20" y="92" width="160" height="16" rx="3" fill="${DUNKEL}"/><path d="M150 92 V 26 H 60 V 46" fill="none" stroke="${HELL}" stroke-width="18"/><path d="M150 92 V 26 H 60 V 46" fill="none" stroke="${T}" stroke-width="1.6" opacity=".3"/><rect x="50" y="44" width="20" height="24" fill="${HELL}" stroke="${T}"/><path d="M60 68 V 88" stroke="${T}" stroke-width="1.6"/><circle cx="168" cy="50" r="14" fill="${METALL}" stroke="${T}" stroke-width="1.5"/>`, 'Maschine');
  B.laubsaege = () => svg(200, 120, `<path d="M30 20 H150 V 96" fill="none" stroke="${METALL}" stroke-width="6"/><path d="M30 20 V 100" stroke="${T}" stroke-width="1"/><path d="M30 20 V 96 M150 96 H 30" stroke="${T}" stroke-width="0.8"/><rect x="142" y="94" width="16" height="22" rx="4" fill="${HOLZ}" stroke="${T}"/><path d="M30 20 L30 96" stroke="${T}" stroke-width="1.2" stroke-dasharray="2 1"/>`, 'Werkzeug');
  B.feile = () => { let s = `<rect x="20" y="52" width="120" height="16" fill="${METALL}" stroke="${T}" stroke-width="1.5"/>`; for (let i = 0; i < 24; i++) s += `<path d="M${24 + i * 5} 54 l4 12" stroke="${T}" stroke-width="0.7"/>`; return svg(200, 120, s + `<path d="M140 56 L150 58 V 62 L140 64Z" fill="${METALL}"/><rect x="150" y="50" width="34" height="20" rx="8" fill="${HOLZ}" stroke="${T}"/>`, 'Werkzeug'); };
  B.schraubzwinge = () => svg(200, 120, `<rect x="56" y="10" width="10" height="100" fill="${METALL}" stroke="${T}"/><rect x="56" y="10" width="76" height="12" fill="${METALL}" stroke="${T}"/><rect x="56" y="82" width="70" height="12" fill="${METALL}" stroke="${T}"/><path d="M118 22 V 62" stroke="${T}" stroke-width="3"/><rect x="108" y="62" width="20" height="6" fill="${T}"/><rect x="110" y="94" width="16" height="22" rx="4" fill="${HOLZ}" stroke="${T}"/>`, 'Werkzeug');
  B.anschlagwinkel = () => svg(200, 120, `<path d="M50 16 H70 V 86 H170 V 104 H50Z" fill="${METALL}" stroke="${T}" stroke-width="1.5"/><rect x="40" y="10" width="40" height="70" fill="${HOLZ}" stroke="${T}" stroke-width="1.5" opacity=".9"/>`, 'Werkzeug');
  B.reissnadel = () => svg(200, 120, `<path d="M20 60 L120 56 V 64Z" fill="${METALL}" stroke="${T}"/><rect x="120" y="50" width="62" height="20" rx="6" fill="${DUNKEL}"/>`, 'Werkzeug');
  B.stahlmassstab = () => { let s = `<rect x="10" y="44" width="180" height="26" fill="${METALL}" stroke="${T}" stroke-width="1.5"/>`; for (let i = 0; i <= 34; i++) s += `<path d="M${14 + i * 5} 44 v${i % 10 === 0 ? 12 : i % 5 === 0 ? 9 : 5}" stroke="${T}" stroke-width="0.8"/>`; return svg(200, 120, s, 'Werkzeug'); };
  B.hammer = () => svg(200, 120, `<rect x="40" y="56" width="130" height="12" rx="4" fill="${HOLZ}" stroke="${T}"/><rect x="24" y="30" width="26" height="62" rx="3" fill="${METALL}" stroke="${T}" stroke-width="1.5"/>`, 'Werkzeug');
  B.schraubendreher = () => svg(200, 120, `<rect x="20" y="48" width="64" height="24" rx="10" fill="${ROT}" stroke="${T}"/><rect x="84" y="56" width="84" height="8" fill="${METALL}" stroke="${T}"/><path d="M168 56 L182 58 V 62 L168 64Z" fill="${METALL}" stroke="${T}"/>`, 'Werkzeug');
  B.schutzbrille = () => svg(200, 120, `<path d="M30 46 C30 30 90 30 96 46 C104 30 170 30 170 46 V 70 C170 90 120 92 106 74 C100 66 100 66 94 74 C80 92 30 90 30 70Z" fill="#cfe6ff" stroke="${T}" stroke-width="2.5" opacity=".9"/><path d="M30 52 L10 46 M170 52 L190 46" stroke="${T}" stroke-width="4"/>`, 'Schutzausrüstung');
  B.biegegeraet = () => svg(200, 120, `<rect x="20" y="70" width="160" height="30" rx="4" fill="${DUNKEL}"/><rect x="20" y="62" width="76" height="8" fill="${METALL}"/><rect x="104" y="62" width="76" height="8" fill="${METALL}"/><path d="M96 66 H104" stroke="${ROT}" stroke-width="4"/><path d="M60 40 H140" stroke="${ROT}" stroke-width="1" opacity=".0"/><rect x="40" y="48" width="120" height="6" fill="#cfe6ff" stroke="${T}" opacity=".8"/>`, 'Maschine');
  B.zinnform = () => svg(200, 120, `<rect x="50" y="20" width="44" height="86" fill="${DUNKEL}" stroke="${T}"/><rect x="106" y="20" width="44" height="86" fill="${DUNKEL}" stroke="${T}"/><path d="M94 30 C 84 30 84 46 94 46 V 92 C 86 92 86 98 94 98" fill="${METALL}"/><path d="M90 6 C 100 14 98 18 96 22" stroke="${METALL}" stroke-width="4" fill="none"/>`, 'Form');

  // =====================================================
  // Bildschirm und Programme: Fenster, Browser, E-Mail
  // =====================================================
  B.oberflaeche = () => {
    let s = `<rect width="250" height="150" fill="#3b6ea5"/>`;
    // Fenster
    s += `<rect x="8" y="8" width="180" height="134" fill="#fff" stroke="${T}" stroke-width="1.5"/><rect x="8" y="8" width="180" height="16" fill="#dfe6f3" stroke="${T}" stroke-width="1"/>`;
    s += tx(14, 19.5, 'Brief.txt – Editor', 7.5, T, 'start', 700);
    s += `<rect x="150" y="10" width="11" height="12" fill="#fff" stroke="${GRAU}"/><path d="M152 17 h7" stroke="${T}"/><rect x="163" y="10" width="11" height="12" fill="#fff" stroke="${GRAU}"/><rect x="165.5" y="12.5" width="6" height="6" fill="none" stroke="${T}"/><rect x="176" y="10" width="11" height="12" fill="${ROT}"/><path d="M178.5 13 l6 6 M184.5 13 l-6 6" stroke="#fff" stroke-width="1.4"/>`;
    s += `<rect x="8" y="24" width="180" height="12" fill="#f5f6f9" stroke="${GRAU}" stroke-width=".6"/>` + tx(14, 32.5, 'Datei   Bearbeiten   Format   Ansicht   Hilfe', 6.6, T, 'start', 700);
    for (let i = 0; i < 7; i++) s += `<path d="M16 ${48 + i * 11} h${[140, 150, 120, 146, 90, 138, 60][i]}" stroke="${GRAU}" stroke-width="2.2"/>`;
    s += `<rect x="178" y="36" width="10" height="106" fill="#eef0f4" stroke="${GRAU}" stroke-width=".6"/><rect x="180" y="40" width="6" height="28" rx="3" fill="${GRAU}"/>`;
    // Mauszeiger
    s += `<path d="M112 92 l0 18 l5 -5 l4 8 l3 -1.5 l-4 -8 l7 0z" fill="#fff" stroke="${T}" stroke-width="1.2"/>`;
    // Symbol auf dem Schreibtisch
    s += `<path d="M206 40 h10 l3 4 h17 v20 h-30z" fill="${GELB}" stroke="${T}"/>` + tx(221, 76, 'Fotos', 7.5, '#fff', 'middle', 700);
    s = `<g transform="translate(0 18)">${s}${nr(2, 120, 52, 76, 30) + nr(3, 214, 18, 186, 16) + nr(4, 216, 110, 186, 90) + nr(5, 232, 96, 222, 66) + nr(6, 146, 128, 116, 104)}</g>`;
    s += nr(1, 110, 9, 80, 30);
    return svg(250, 168, `<rect width="250" height="18" fill="#fff"/>` + s, 'Fenster eines Programms mit Nummern');
  };
  B.browser = () => {
    let s = `<rect x="6" y="6" width="238" height="138" fill="#fff" stroke="${T}" stroke-width="1.5"/><rect x="6" y="6" width="238" height="16" fill="#dfe6f3"/>`;
    s += `<path d="M12 22 V 12 Q12 9 15 9 H70 Q73 9 73 12 V22" fill="#fff" stroke="${GRAU}"/>` + tx(18, 18.5, 'Dachse – Wikipedia', 6.5, T, 'start', 700);
    s += `<path d="M78 22 V 12 Q78 9 81 9 H128 Q131 9 131 12 V22" fill="#eef0f4" stroke="${GRAU}"/>` + tx(84, 18.5, 'Wetter Dresden', 6.5, GRAU, 'start', 700);
    s += `<rect x="6" y="22" width="238" height="18" fill="#f5f6f9"/><path d="M18 31 h-6 m3 -3 l-3 3 l3 3" stroke="${T}" stroke-width="1.4" fill="none"/><path d="M28 31 h6 m-3 -3 l3 3 l-3 3" stroke="${GRAU}" stroke-width="1.4" fill="none"/><path d="M48 27 a4 4 0 1 0 3 1.3" stroke="${T}" stroke-width="1.3" fill="none"/><path d="M51 25 v3.5 h-3.3" stroke="${T}" stroke-width="1.2" fill="none"/>`;
    s += `<rect x="60" y="25" width="176" height="12" rx="6" fill="#fff" stroke="${GRAU}"/>` + tx(68, 33.5, 'https://de.wikipedia.org/wiki/Dachse', 6.6, T, 'start', 600);
    s += tx(66, 60, 'Dachse', 12, T, 'start', 800);
    for (let i = 0; i < 4; i++) s += `<path d="M16 ${70 + i * 9} h${[200, 180, 210, 120][i]}" stroke="${GRAU}" stroke-width="2"/>`;
    s += tx(16, 116, 'Mehr über den Europäischen Dachs', 7.5, BLAU, 'start', 700) + `<path d="M16 118 h113" stroke="${BLAU}" stroke-width=".8"/>`;
    s = `<g transform="translate(0 18)">${s}${nr(2, 16, 54, 15, 31) + nr(3, 150, 56, 150, 37) + nr(4, 150, 134, 110, 116) + nr(5, 50, 54, 48, 32)}</g>`;
    s += nr(1, 90, 9, 50, 26);
    return svg(250, 168, `<rect width="250" height="18" fill="#fff"/>` + s, 'Browser mit Nummern');
  };
  B.mail = () => {
    let s = `<rect x="6" y="6" width="238" height="138" fill="#fff" stroke="${T}" stroke-width="1.5"/><rect x="6" y="6" width="238" height="14" fill="#dfe6f3"/>` + tx(12, 16, 'Neue Nachricht', 7.5, T, 'start', 800);
    const zeile = (y, a, b) => tx(14, y, a, 7, GRAU, 'start', 700) + tx(48, y, b, 7.2, T, 'start', 700) + `<path d="M12 ${y + 4} H238" stroke="#e3e0d8"/>`;
    s += zeile(32, 'An:', 'lena.berg@schule-beispiel.de') + zeile(46, 'Cc:', 'tom.kurz@schule-beispiel.de') + zeile(60, 'Betreff:', 'Stückliste für den Leuchter');
    s += `<rect x="14" y="68" width="74" height="13" rx="3" fill="#eef0f4" stroke="${GRAU}"/><path d="M19 77 l5 -5 a2 2 0 0 1 3 3 l-6 6 a3 3 0 0 1 -4 -4 l5 -5" fill="none" stroke="${T}" stroke-width=".9"/>` + tx(31, 77.5, 'stueckliste.docx', 6.3, T, 'start', 700);
    s += tx(14, 96, 'Hallo Lena,', 7.5, T, 'start', 600) + tx(14, 107, 'anbei die Stückliste. Kannst du sie prüfen?', 7.5, T, 'start', 600) + tx(14, 118, 'Viele Grüße, Max', 7.5, T, 'start', 600);
    s += `<rect x="186" y="122" width="50" height="16" rx="4" fill="${BLAU}"/>` + tx(211, 133, 'Senden', 7.5, '#fff', 'middle', 800);
    s += nr(1, 210, 28, 180, 31) + nr(2, 222, 44, 196, 45) + nr(3, 200, 62, 172, 58) + nr(4, 106, 84, 88, 75) + nr(5, 170, 140, 186, 130) + nr(6, 226, 96, 72, 96);
    return svg(250, 150, s, 'E-Mail-Fenster mit Nummern');
  };

  // =====================================================
  // Gesund am Computer: richtig sitzen (Seitenansicht)
  // =====================================================
  B.sitzen = () => {
    let s = `<path d="M0 140 H250" stroke="${T}" stroke-width="2"/>`;
    // Tisch und Bildschirm
    s += `<rect x="120" y="80" width="120" height="5" fill="${HOLZ}" stroke="${T}"/><path d="M230 85 V140" stroke="${T}" stroke-width="3"/>`;
    s += `<rect x="196" y="40" width="7" height="34" fill="${T}"/><path d="M199 74 V 80" stroke="${T}" stroke-width="3"/><rect x="190" y="78" width="20" height="3" fill="${T}"/>`;
    s += `<rect x="134" y="77" width="30" height="4" rx="1" fill="${DUNKEL}"/>`;
    // Stuhl
    s += `<rect x="58" y="96" width="50" height="6" rx="2" fill="${DUNKEL}"/><path d="M60 96 L54 52" stroke="${DUNKEL}" stroke-width="6" stroke-linecap="round"/><path d="M83 102 V 132 M68 138 L83 132 L98 138" stroke="${T}" stroke-width="3" fill="none"/>`;
    // Person
    s += `<circle cx="78" cy="40" r="11" fill="${HOLZ}" stroke="${T}"/><path d="M76 52 L74 94" stroke="${BLAU}" stroke-width="10" stroke-linecap="round"/>`;
    s += `<path d="M76 58 L84 80 L134 80" stroke="${HOLZ}" stroke-width="5" stroke-linecap="round" fill="none"/><path d="M76 94 L118 94 L118 136 L128 136" stroke="${DUNKEL}" stroke-width="7" stroke-linecap="round" stroke-linejoin="round" fill="none"/>`;
    // Blicklinie und Abstand
    s += `<path d="M86 40 L194 42" stroke="${GRAU}" stroke-dasharray="3 2"/><path d="M90 26 H194" stroke="${ROT}" stroke-width="1.2"/><path d="M90 23 v6 M194 23 v6" stroke="${ROT}"/>` + tx(142, 21, '50 – 70 cm', 7, ROT);
    s += nr(1, 142, 10, 142, 26) + nr(2, 228, 30, 202, 41) + nr(3, 108, 66, 110, 80) + nr(4, 150, 126, 126, 136) + nr(5, 36, 68, 56, 66);
    return svg(250, 150, s, 'So sitzt man richtig am Computer');
  };

  // =====================================================
  // Maschinen und ihre Funktionselemente
  // =====================================================
  // Bohrmaschine, aufgeschnitten: 1 Motor, 2 Zahnräder, 3 Bohrer, 4 Schalter, 5 Gehäuse
  B.bohrmaschine = () => {
    let s = `<path d="M40 30 H170 Q182 30 182 42 V 62 Q182 72 170 72 H120 L110 120 H80 L92 72 H40 Q30 72 30 62 V 40 Q30 30 40 30Z" fill="${HELL}" stroke="${T}" stroke-width="2"/>`;
    s += `<rect x="44" y="38" width="56" height="26" rx="4" fill="${METALL}" stroke="${T}"/>`;
    for (let i = 0; i < 6; i++) s += `<path d="M${50 + i * 9} 40 v22" stroke="#b07a3b" stroke-width="2.5"/>`;
    s += `<circle cx="120" cy="46" r="10" fill="#fff" stroke="${T}" stroke-dasharray="2 1.5"/><circle cx="143" cy="51" r="14" fill="#fff" stroke="${T}" stroke-dasharray="2 1.5"/>`;
    s += `<rect x="182" y="42" width="14" height="18" fill="${DUNKEL}"/><path d="M196 51 H238" stroke="${T}" stroke-width="3"/><path d="M200 51 l4 -3 4 6 4 -6 4 6 4 -6 4 6 4 -6 4 3" stroke="${T}" fill="none"/>`;
    s += `<rect x="96" y="76" width="8" height="14" rx="2" fill="${ROT}"/>`;
    s += nr(1, 72, 14, 72, 40) + nr(2, 132, 14, 138, 40) + nr(3, 226, 30, 222, 50) + nr(4, 130, 96, 104, 84) + nr(5, 40, 98, 66, 70);
    return svg(250, 130, s, 'Bohrmaschine, aufgeschnitten, mit Nummern');
  };
  // Fahrrad: 1 Pedale, 2 Kette, 3 Hinterrad, 4 Lenker und Bremse, 5 Rahmen
  B.fahrrad = () => {
    let s = `<circle cx="60" cy="84" r="34" fill="none" stroke="${T}" stroke-width="3"/><circle cx="190" cy="84" r="34" fill="none" stroke="${T}" stroke-width="3"/>`;
    s += `<path d="M60 84 L104 84 L90 40 L60 84 M104 84 L170 42 L90 40 M170 42 L190 84" fill="none" stroke="${BLAU}" stroke-width="4" stroke-linejoin="round"/>`;
    s += `<path d="M164 30 L170 42 M156 26 H176" stroke="${T}" stroke-width="3"/><path d="M84 36 H98" stroke="${T}" stroke-width="5" stroke-linecap="round"/>`;
    s += `<circle cx="104" cy="84" r="9" fill="none" stroke="${T}" stroke-width="2"/><circle cx="60" cy="84" r="5" fill="none" stroke="${T}" stroke-width="2"/><path d="M60 79 L104 75 M60 89 L104 93" stroke="${GRAU}" stroke-width="1.5" stroke-dasharray="2 1"/>`;
    s += `<path d="M104 84 L114 102 M110 102 h10" stroke="${T}" stroke-width="3"/>`;
    s += nr(1, 130, 116, 117, 102) + nr(2, 82, 112, 82, 92) + nr(3, 28, 30, 38, 58) + nr(4, 206, 20, 176, 26) + nr(5, 130, 50, 136, 63);
    return svg(250, 130, s, 'Fahrrad mit Nummern');
  };

  // =====================================================
  // Zahnräder (erzeugt): Räder nebeneinander, sie greifen ineinander
  // =====================================================
  function rad(cx, cy, z, m, farbe, dreh, name) {
    const r = z * m / 2, ra = r + m * 0.9, rf = r - m * 1.1, pts = [];
    for (let i = 0; i < z; i++) {
      const a = (i / z) * 2 * Math.PI + (dreh || 0), w = (2 * Math.PI) / z;
      const p = (rr, aa) => `${r1(cx + rr * Math.cos(aa))} ${r1(cy + rr * Math.sin(aa))}`;
      pts.push(`${i ? 'L' : 'M'}${p(rf, a)} L${p(ra, a + w * 0.18)} L${p(ra, a + w * 0.42)} L${p(rf, a + w * 0.6)} L${p(rf, a + w)}`);
    }
    let s = `<path d="${pts.join(' ')}Z" fill="${farbe}" stroke="${T}" stroke-width="1.2" stroke-linejoin="round"/>`;
    s += `<circle cx="${r1(cx)}" cy="${r1(cy)}" r="${r1(Math.max(3, r * 0.22))}" fill="#fff" stroke="${T}" stroke-width="1.2"/>`;
    // Markierung, damit man das Drehen sieht
    const am = (dreh || 0) + Math.PI / z * 0.6;
    s += `<circle cx="${r1(cx + r * 0.62 * Math.cos(am))}" cy="${r1(cy + r * 0.62 * Math.sin(am))}" r="${r1(Math.max(2, m * 0.7))}" fill="${T}" opacity=".55"/>`;
    if (name) s += tx(r1(cx), r1(cy + Math.max(3, r * 0.22) * 0.5 + 3.2), name, r1(Math.max(7, Math.min(11, r * 0.3))), T);
    return s;
  }
  D.rad = rad;
  // Drehpfeil um einen Kreis: richtung 1 = im Uhrzeigersinn, -1 = dagegen
  function drehpfeil(cx, cy, r, richtung, farbe) {
    const a0 = -Math.PI * 0.85, a1 = -Math.PI * 0.25, p = (a) => [r1(cx + r * Math.cos(a)), r1(cy + r * Math.sin(a))];
    const [x0, y0] = p(richtung > 0 ? a0 : a1), [x1, y1] = p(richtung > 0 ? a1 : a0);
    const tang = richtung > 0 ? a1 + Math.PI / 2 : a0 - Math.PI / 2, sp = (d, l) => `${r1(x1 + Math.cos(tang + d) * l)} ${r1(y1 + Math.sin(tang + d) * l)}`;
    return `<path d="M${x0} ${y0} A${r} ${r} 0 0 ${richtung > 0 ? 1 : 0} ${x1} ${y1}" fill="none" stroke="${farbe || ROT}" stroke-width="2.4"/><path d="M${x1} ${y1} L${sp(2.6, 8)} L${sp(-2.6, 8)}Z" fill="${farbe || ROT}"/>`;
  }
  D.drehpfeil = drehpfeil;
  // Lage der Räder: in einer Reihe, Mittelpunkte im Abstand r1 + r2 (sie berühren sich am Teilkreis)
  D.radLage = function (z, W, H) {
    const m0 = 1, sum = z.reduce((s, k) => s + k * m0, 0), m = Math.min((W - 24) / (sum + 2.4), (H - 30) / (Math.max(...z) + 2.4));
    let x = 12 + (W - 24 - sum * m) / 2;
    return { m, lage: z.map((k) => { const r = k * m / 2, cx = x + r; x += 2 * r; return { cx, cy: H / 2 + 4, r }; }) };
  };
  // Drehwinkel aller Räder, wenn das erste um t gedreht ist: Zahn trifft immer auf Lücke.
  // Lage im Zahn-Takt f = Bruchteil von (Winkel − a) / Teilung; Zahnmitte bei 0,3, Lückenmitte bei 0,8.
  // Beim Drehen bleibt f(Rad i−1, rechts) + f(Rad i, links) gleich; Zahn (0,3) + Lücke (0,8) = 1,1, also 0,1.
  D.radWinkel = function (z, t) {
    const frac = (x) => x - Math.floor(x), a = [t];
    for (let i = 1; i < z.length; i++) {
      const w0 = 2 * Math.PI / z[i - 1], w1 = 2 * Math.PI / z[i], f0 = frac((0 - a[i - 1]) / w0);
      a.push(Math.PI - w1 * frac(0.1 - f0));
    }
    return a;
  };
  D.zeichne = {};
  D.zeichne.zahnraeder = function (o) {
    const W = 240, H = o.H || 130, { m, lage } = D.radLage(o.z, W, H), FARBEN = ['#ffd27a', '#9cc2ff', '#b6e3b0', '#f6b3c8', '#d7c8ff'];
    let s = '';
    const winkel = D.radWinkel(o.z, o.t || 0);
    lage.forEach((l, i) => {
      s += rad(l.cx, l.cy, o.z[i], m, i === o.hell ? '#ff9f80' : FARBEN[i % FARBEN.length], winkel[i], o.namen ? o.namen[i] : '');
    });
    if (o.pfeil) s += drehpfeil(lage[0].cx, lage[0].cy, lage[0].r + m * 2.4, o.pfeil);
    if (o.zaehne) lage.forEach((l, i) => { s += tx(r1(l.cx), r1(Math.min(H - 3, l.cy + l.r + m * 2.2 + 9)), `${o.z[i]} Zähne`, 8, T, 'middle', 700); });
    return svg(W, H, s, 'Zahnräder');
  };

  // Riemen, gekreuzter Riemen oder Kette
  D.zeichne.riemen = function (o) {
    const [ra, rb] = o.r || [26, 26], ax = 60, bx = 180, y = 60, W = 240, H = 120;
    let s = '';
    if (o.gekreuzt) {
      // Innere Tangenten
      const d = bx - ax, b = Math.asin((ra + rb) / d);
      const p1 = [ax + ra * Math.sin(b), y - ra * Math.cos(b)], p2 = [bx - rb * Math.sin(b), y + rb * Math.cos(b)];
      const q1 = [ax + ra * Math.sin(b), y + ra * Math.cos(b)], q2 = [bx - rb * Math.sin(b), y - rb * Math.cos(b)];
      s += `<path d="M${p1.map(r1)} L${p2.map(r1)} M${q1.map(r1)} L${q2.map(r1)}" stroke="${T}" stroke-width="3"/>`;
    } else {
      const d = bx - ax, b = Math.asin((ra - rb) / d);
      const p1 = [ax - ra * Math.sin(b), y - ra * Math.cos(b)], p2 = [bx - rb * Math.sin(b), y - rb * Math.cos(b)];
      const q1 = [ax - ra * Math.sin(b), y + ra * Math.cos(b)], q2 = [bx - rb * Math.sin(b), y + rb * Math.cos(b)];
      s += `<path d="M${p1.map(r1)} L${p2.map(r1)} M${q2.map(r1)} L${q1.map(r1)}" stroke="${T}" stroke-width="3" ${o.kette ? `stroke-dasharray="4 2" stroke-dashoffset="${r1(-(o.t || 0) * ra)}"` : ''}/>`;
    }
    const t = o.t || 0, tb = o.gekreuzt ? -t * ra / rb : t * ra / rb;
    const marke = (cx, r, w) => `<circle cx="${r1(cx + r * 0.6 * Math.cos(w))}" cy="${r1(y + r * 0.6 * Math.sin(w))}" r="3.2" fill="${ROT}"/>`;
    const scheibe = (cx, r, z, w) => (o.kette ? rad(cx, y, z, r * 2 / z, '#d7dbe3', w) : `<circle cx="${cx}" cy="${y}" r="${r + 2}" fill="none" stroke="${T}" stroke-width="3"/><circle cx="${cx}" cy="${y}" r="${r}" fill="#d7dbe3" stroke="${T}"/><circle cx="${cx}" cy="${y}" r="4" fill="#fff" stroke="${T}"/>`) + marke(cx, r, w);
    s += scheibe(ax, ra, Math.round(ra / 1.4), t) + scheibe(bx, rb, Math.round(rb / 1.4), tb);
    if (o.pfeil) s += drehpfeil(ax, y, ra + 9, o.pfeil);
    if (o.namen) s += tx(ax, y + ra + 20, o.namen[0], 10) + tx(bx, y + rb + 20, o.namen[1], 10);
    return svg(W, H, s, o.kette ? 'Kettengetriebe' : 'Riemengetriebe');
  };
  B.riemenOffen = () => D.zeichne.riemen({ r: [30, 20] });
  B.riemenGekreuzt = () => D.zeichne.riemen({ r: [26, 26], gekreuzt: true });
  B.kette = () => D.zeichne.riemen({ r: [32, 16], kette: true });
  D.zeichne.reibrad = function (t) {
    t = t || 0;
    const m = (cx, r, w) => `<circle cx="${r1(cx + r * 0.55 * Math.cos(w))}" cy="${r1(60 + r * 0.55 * Math.sin(w))}" r="3.2" fill="${ROT}"/>`;
    return svg(240, 120, `<circle cx="96" cy="60" r="36" fill="#d7dbe3" stroke="${T}" stroke-width="2"/><circle cx="96" cy="60" r="34" fill="none" stroke="#5b5566" stroke-width="4"/><circle cx="96" cy="60" r="5" fill="#fff" stroke="${T}"/><circle cx="154" cy="60" r="22" fill="#d7dbe3" stroke="${T}" stroke-width="2"/><circle cx="154" cy="60" r="20" fill="none" stroke="#5b5566" stroke-width="4"/><circle cx="154" cy="60" r="4" fill="#fff" stroke="${T}"/>${m(96, 36, t)}${m(154, 22, -t * 36 / 22)}`, 'Reibradgetriebe');
  };
  B.reibrad = () => D.zeichne.reibrad(0);
  B.zahnradpaar = () => D.zeichne.zahnraeder({ z: [24, 12] });
  // Kurbel und Schubstange: aus Drehen wird Hin-und-Her
  D.zeichne.kurbel = function (w) {
    const cx = 60, cy = 64, r = 26, a = w === undefined ? -0.6 : w, px = cx + r * Math.cos(a), py = cy + r * Math.sin(a), L = 92;
    const sx = px + Math.sqrt(L * L - (py - cy) ** 2);
    let s = `<circle cx="${cx}" cy="${cy}" r="${r + 8}" fill="#d7dbe3" stroke="${T}" stroke-width="2"/><circle cx="${cx}" cy="${cy}" r="4" fill="#fff" stroke="${T}"/>`;
    s += `<path d="M${r1(px)} ${r1(py)} L${r1(sx)} ${cy}" stroke="${DUNKEL}" stroke-width="6" stroke-linecap="round"/><circle cx="${r1(px)}" cy="${r1(py)}" r="4" fill="${ROT}"/>`;
    s += `<rect x="128" y="${cy - 16}" width="104" height="32" fill="none" stroke="${T}" stroke-width="2"/><rect x="${r1(sx - 6)}" y="${cy - 13}" width="22" height="26" fill="${METALL}" stroke="${T}"/><circle cx="${r1(sx)}" cy="${cy}" r="3.5" fill="#fff" stroke="${T}"/>`;
    s += `<path d="M150 ${cy + 28} H 214" stroke="${ROT}" stroke-width="1.6"/><path d="M150 ${cy + 28} l6 -3 v6z M214 ${cy + 28} l-6 -3 v6z" fill="${ROT}"/>`;
    return svg(240, 120, s, 'Kurbel mit Schubstange');
  };
  B.kurbel = () => D.zeichne.kurbel();
  // Nocken (Kurvenscheibe) hebt einen Stößel
  D.zeichne.nocken = function (w) {
    const cx = 120, cy = 82, a = w || 0, pts = [];
    for (let i = 0; i <= 48; i++) { const t = (i / 48) * 2 * Math.PI, rr = 20 + 14 * Math.max(0, Math.cos(t)) ** 2; pts.push(`${i ? 'L' : 'M'}${r1(cx + rr * Math.cos(t + a))} ${r1(cy + rr * Math.sin(t + a))}`); }
    // Höhe des Stößels = größter Radius nach oben
    let top = 0; for (let i = 0; i < 360; i++) { const t = (i / 360) * 2 * Math.PI, rr = 20 + 14 * Math.max(0, Math.cos(t)) ** 2, y = rr * Math.sin(t + a); if (-y > top && Math.abs(rr * Math.cos(t + a)) < 3) top = -y; }
    const sy = cy - Math.max(20, top);
    let s = `<path d="${pts.join(' ')}Z" fill="#d7dbe3" stroke="${T}" stroke-width="2"/><circle cx="${cx}" cy="${cy}" r="4" fill="#fff" stroke="${T}"/>`;
    s += `<rect x="${cx - 5}" y="${r1(sy - 58)}" width="10" height="58" fill="${METALL}" stroke="${T}"/><rect x="${cx - 16}" y="20" width="8" height="40" fill="${DUNKEL}"/><rect x="${cx + 8}" y="20" width="8" height="40" fill="${DUNKEL}"/>`;
    s += `<path d="M${cx + 28} 24 V 52" stroke="${ROT}" stroke-width="1.6"/><path d="M${cx + 28} 24 l-3 6 h6z M${cx + 28} 52 l-3 -6 h6z" fill="${ROT}"/>`;
    return svg(240, 120, s, 'Nocken mit Stößel');
  };
  B.nocken = () => D.zeichne.nocken(0.4);
  // Zahnrad auf Zahnstange
  D.zeichne.zahnstange = function (w) {
    const z = 14, m = 4.2, cx = 120, r = z * m / 2, cy = 96 - r - 2, a = w || 0, verschub = -a * r;
    let s = rad(cx, cy, z, m, '#ffd27a', Math.PI / 2 - 0.3 * 2 * Math.PI / z + a), zs = '';
    for (let i = -14; i < 16; i++) { const x = cx + i * m * Math.PI + m * Math.PI / 2 + (verschub % (m * Math.PI)); zs += `L${r1(x - 3.4)} 98 L${r1(x - 1.6)} ${r1(96 - m * 0.9 + 1)} L${r1(x + 1.6)} ${r1(96 - m * 0.9 + 1)} L${r1(x + 3.4)} 98 `; }
    s += `<path d="M0 112 L0 98 ${zs} L240 98 L240 112Z" fill="${METALL}" stroke="${T}" stroke-width="1.2"/>`;
    s += `<path d="M150 116 H 210" stroke="${ROT}" stroke-width="1.6"/><path d="M150 116 l6 -3 v6z M210 116 l-6 -3 v6z" fill="${ROT}"/>`;
    return svg(240, 120, s, 'Zahnrad und Zahnstange');
  };
  B.zahnstange = () => D.zeichne.zahnstange();

  // Sinnbilder: vereinfachte Zeichnungen der Getriebe
  const achse = (x, y) => `<circle cx="${x}" cy="${y}" r="3" fill="#fff" stroke="${T}" stroke-width="1.4"/>`;
  B.sinnRiemen = () => svg(200, 100, `<circle cx="60" cy="50" r="24" fill="none" stroke="${T}" stroke-width="1.8"/><circle cx="148" cy="50" r="16" fill="none" stroke="${T}" stroke-width="1.8"/><path d="M60 26 L148 34 M60 74 L148 66" stroke="${T}" stroke-width="1.8"/>${achse(60, 50)}${achse(148, 50)}`, 'Sinnbild');
  B.sinnGekreuzt = () => svg(200, 100, `<circle cx="60" cy="50" r="20" fill="none" stroke="${T}" stroke-width="1.8"/><circle cx="148" cy="50" r="20" fill="none" stroke="${T}" stroke-width="1.8"/><path d="M60 30 L148 70 M60 70 L148 30" stroke="${T}" stroke-width="1.8"/>${achse(60, 50)}${achse(148, 50)}`, 'Sinnbild');
  B.sinnKette = () => svg(200, 100, `<circle cx="60" cy="50" r="24" fill="none" stroke="${T}" stroke-width="1.8"/><circle cx="148" cy="50" r="14" fill="none" stroke="${T}" stroke-width="1.8"/><path d="M60 26 L148 36 M60 74 L148 64" stroke="${T}" stroke-width="1.8" stroke-dasharray="7 2 1.5 2"/>${achse(60, 50)}${achse(148, 50)}`, 'Sinnbild');
  B.sinnZahnrad = () => svg(200, 100, `<circle cx="78" cy="50" r="30" fill="none" stroke="${T}" stroke-width="1.8"/><circle cx="78" cy="50" r="34" fill="none" stroke="${T}" stroke-width=".8" stroke-dasharray="3 2"/><circle cx="126" cy="50" r="18" fill="none" stroke="${T}" stroke-width="1.8"/><circle cx="126" cy="50" r="22" fill="none" stroke="${T}" stroke-width=".8" stroke-dasharray="3 2"/>${achse(78, 50)}${achse(126, 50)}`, 'Sinnbild');
  B.sinnZahnstange = () => svg(200, 100, `<circle cx="100" cy="42" r="24" fill="none" stroke="${T}" stroke-width="1.8"/><circle cx="100" cy="42" r="28" fill="none" stroke="${T}" stroke-width=".8" stroke-dasharray="3 2"/><path d="M20 70 H180" stroke="${T}" stroke-width="1.8"/><path d="M20 74 H180" stroke="${T}" stroke-width=".8" stroke-dasharray="3 2"/>${achse(100, 42)}`, 'Sinnbild');
  B.sinnKurbel = () => svg(200, 100, `<path d="M48 54 L72 34 L150 54" stroke="${T}" stroke-width="1.8" fill="none"/>${achse(48, 54)}${achse(72, 34)}<rect x="140" y="46" width="22" height="16" fill="none" stroke="${T}" stroke-width="1.8"/><path d="M128 66 H184 M128 42 H184" stroke="${T}" stroke-width="1"/><path d="M40 66 l8 -12 l8 12z" fill="none" stroke="${T}" stroke-width="1.4"/>`, 'Sinnbild');

  // =====================================================
  // Ordnerbaum (erzeugt)
  // =====================================================
  D.zeichne.ordnerbaum = function (b) {
    const zeilen = [];
    (function lauf(k, tiefe) { zeilen.push({ k, tiefe }); (k.kinder || []).forEach((c) => lauf(c, tiefe + 1)); })(b.wurzel, 0);
    const zh = 15, H = zeilen.length * zh + 12, W = Math.max(120, Math.ceil(Math.max(...zeilen.map((z) => 12 + z.tiefe * 16 + 25 + z.k.name.length * 5.6))));
    let s = '';
    zeilen.forEach((z, i) => {
      const x = 12 + z.tiefe * 16, y = 12 + i * zh, datei = /\./.test(z.k.name) && z.tiefe > 0, hell = b.hell === z.k.name;
      if (z.tiefe > 0) {
        // Linie zum Elternordner
        let j = i - 1; while (j >= 0 && zeilen[j].tiefe >= z.tiefe) j--;
        const px = 12 + zeilen[j].tiefe * 16 + 5, py = 12 + j * zh + 9;
        s += `<path d="M${px} ${py} V ${y + 5} H ${x - 1}" fill="none" stroke="${GRAU}" stroke-width="1"/>`;
      }
      if (z.tiefe === 0) s += `<rect x="${x - 1}" y="${y - 3}" width="13" height="10" rx="2" fill="${DUNKEL}"/><rect x="${x + 1}" y="${y + 4}" width="3" height="1.4" fill="${GRUEN}"/>`;
      else if (datei) s += `<path d="M${x} ${y - 3} h7 l3 3 v9 h-10z" fill="#fff" stroke="${T}" stroke-width="1"/>`;
      else s += `<path d="M${x - 1} ${y - 2} h5 l1.5 2 h6.5 v8 h-13z" fill="${GELB}" stroke="${T}" stroke-width="1"/>`;
      if (hell) s += `<rect x="${x + 14}" y="${y - 4}" width="${z.k.name.length * 5.4 + 8}" height="13" rx="3" fill="#ffe08a"/>`;
      s += tx(x + 17, y + 6, z.k.name, 8.5, hell ? T : T, 'start', datei ? 600 : 800);
    });
    return svg(W, H, s, 'Ordnerbaum');
  };

  // =====================================================
  // Technische Zeichnung: Linienarten
  // =====================================================
  // Platte mit Loch: Vorderansicht (links) und Seitenansicht von links (rechts)
  D.zeichne.linien = function (hell) {
    const c = (art) => (art === hell ? ROT : T);
    const breit = `stroke="${c('breit')}" stroke-width="2.2"`, schmal = `stroke="${c('schmal')}" stroke-width="0.9"`, strich = `stroke="${c('strich')}" stroke-width="0.9" stroke-dasharray="5 2.5"`, sp = `stroke="${c('strichpunkt')}" stroke-width="0.9" stroke-dasharray="12 2.5 1.5 2.5"`;
    let s = '';
    // Vorderansicht: Platte 110 x 70, Loch d = 26 bei (55, 35)
    s += `<rect x="24" y="24" width="110" height="70" fill="none" ${breit}/><circle cx="79" cy="59" r="13" fill="none" ${breit}/>`;
    s += `<path d="M59 59 H99 M79 39 V79" fill="none" ${sp}/>`;
    // Seitenansicht: Dicke 16
    s += `<rect x="168" y="24" width="16" height="70" fill="none" ${breit}/><path d="M168 46 H184 M168 72 H184" fill="none" ${strich}/><path d="M162 59 H190" fill="none" ${sp}/>`;
    // Maßlinien
    s += `<path d="M24 98 V 112 M134 98 V 112" fill="none" ${schmal}/><path d="M24 108 H134" fill="none" ${schmal}/><path d="M24 108 l7 -2 v4z M134 108 l-7 -2 v4z" fill="${c('schmal')}"/>`;
    s += tx(79, 105, '110', 8.5, c('schmal'), 'middle', 700);
    s += `<path d="M138 24 H152 M138 94 H152" fill="none" ${schmal}/><path d="M148 24 V94" fill="none" ${schmal}/><path d="M148 24 l-2 7 h4z M148 94 l-2 -7 h4z" fill="${c('schmal')}"/>`;
    s += `<text x="145" y="59" text-anchor="middle" transform="rotate(-90 145 59)" style="font:700 8.5px Nunito,sans-serif;fill:${c('schmal')}">70</text>`;
    return svg(220, 122, s, 'Technische Zeichnung einer Platte mit Loch');
  };
  B.linien = () => D.zeichne.linien('');
  ['breit', 'schmal', 'strich', 'strichpunkt'].forEach((h) => { B['linie_' + h] = () => D.zeichne.linien(h); });
  // Die vier Linien einzeln als Muster
  B.linienMuster = () => {
    const z = [['breit', `stroke-width="2.6"`], ['schmal', `stroke-width="1"`], ['strich', `stroke-width="1" stroke-dasharray="6 3"`], ['strichpunkt', `stroke-width="1" stroke-dasharray="14 3 2 3"`]];
    let s = '';
    z.forEach(([, a], i) => { s += tx(16, 26 + i * 26, String.fromCharCode(65 + i), 11) + `<path d="M34 ${22 + i * 26} H 190" stroke="${T}" ${a}/>`; });
    return svg(200, 112, s, 'Vier Linienarten A bis D');
  };

  // =====================================================
  // Bemaßung (erzeugt): Platte l x b mit Loch (Durchmesser d) bei x von links, y von unten
  // =====================================================
  D.zeichne.bemassung = function (o) {
    const W = 240, H = 150, k = Math.min(140 / o.l, 82 / o.b), X0 = 44, Y0 = 18, w = o.l * k, h = o.b * k;
    let s = `<rect x="${X0}" y="${Y0}" width="${r1(w)}" height="${r1(h)}" fill="#f7f4ee" stroke="${T}" stroke-width="2"/>`;
    const lx = X0 + o.x * k, ly = Y0 + h - o.y * k, lr = o.d * k / 2;
    s += `<circle cx="${r1(lx)}" cy="${r1(ly)}" r="${r1(lr)}" fill="#fff" stroke="${T}" stroke-width="2"/><path d="M${r1(lx - lr - 5)} ${r1(ly)} H${r1(lx + lr + 5)} M${r1(lx)} ${r1(ly - lr - 5)} V${r1(ly + lr + 5)}" stroke="${T}" stroke-width=".8" stroke-dasharray="8 2 1.5 2"/>`;
    const pf = (x, y, rich) => { const d = { r: [7, 2], l: [-7, 2], u: [2, 7], o: [2, -7] }[rich]; return rich === 'r' || rich === 'l' ? `<path d="M${r1(x)} ${r1(y)} l${d[0]} -2 v4z" fill="${T}"/>` : `<path d="M${r1(x)} ${r1(y)} l-2 ${d[1]} h4z" fill="${T}"/>`; };
    // Länge unten
    const yl = Y0 + h + 22;
    s += `<path d="M${X0} ${r1(Y0 + h + 3)} V ${r1(yl + 4)} M${r1(X0 + w)} ${r1(Y0 + h + 3)} V ${r1(yl + 4)} M${X0} ${r1(yl)} H ${r1(X0 + w)}" stroke="${T}" stroke-width=".9"/>` + pf(X0, yl, 'r') + pf(X0 + w, yl, 'l') + tx(r1(X0 + w / 2), r1(yl - 3), o.l, 9, T, 'middle', 700);
    // Abstand des Lochs von links (unten, zweite Reihe)
    const yx = Y0 + h + 10;
    s += `<path d="M${r1(lx)} ${r1(ly + lr + 6)} V ${r1(yx + 4)} M${X0} ${r1(yx)} H ${r1(lx)}" stroke="${T}" stroke-width=".9"/>` + pf(X0, yx, 'r') + pf(lx, yx, 'l') + tx(r1(X0 + (lx - X0) / 2), r1(yx - 3), o.x, 9, T, 'middle', 700);
    // Breite links
    const xb = X0 - 24;
    s += `<path d="M${X0 - 3} ${Y0} H ${xb - 4} M${X0 - 3} ${r1(Y0 + h)} H ${xb - 4} M${xb} ${Y0} V ${r1(Y0 + h)}" stroke="${T}" stroke-width=".9"/>` + pf(xb, Y0, 'u') + pf(xb, Y0 + h, 'o');
    s += `<text x="${xb - 3}" y="${r1(Y0 + h / 2)}" text-anchor="middle" transform="rotate(-90 ${xb - 3} ${r1(Y0 + h / 2)})" style="font:700 9px Nunito,sans-serif;fill:${T}">${o.b}</text>`;
    // Abstand des Lochs von unten (rechts)
    const xr = X0 + w + 14;
    s += `<path d="M${r1(lx + lr + 6)} ${r1(ly)} H ${xr + 4} M${r1(X0 + w + 3)} ${r1(Y0 + h)} H ${xr + 4} M${xr} ${r1(ly)} V ${r1(Y0 + h)}" stroke="${T}" stroke-width=".9"/>` + pf(xr, ly, 'u') + pf(xr, Y0 + h, 'o');
    s += `<text x="${xr + 10}" y="${r1(ly + (Y0 + h - ly) / 2)}" text-anchor="middle" transform="rotate(-90 ${xr + 10} ${r1(ly + (Y0 + h - ly) / 2)})" style="font:700 9px Nunito,sans-serif;fill:${T}">${o.y}</text>`;
    // Durchmesser mit Hinweislinie
    s += `<path d="M${r1(lx + lr * 0.7)} ${r1(ly - lr * 0.7)} L${r1(lx + lr + 18)} ${r1(ly - lr - 14)} H ${r1(lx + lr + 40)}" stroke="${T}" stroke-width=".9" fill="none"/>` + tx(r1(lx + lr + 29), r1(ly - lr - 17), `⌀${o.d}`, 9, T, 'middle', 700);
    return svg(W, H, s, 'Bemaßte Platte mit Loch');
  };

  // =====================================================
  // Körper aus Würfeln und seine Ansichten (erzeugt)
  // h[y][x]: Höhe des Stapels; y = 0 ist vorn
  // =====================================================
  D.zeichne.koerper = function (h, o) {
    o = o || {};
    const NX = h[0].length, NY = h.length, s0 = o.s || 24, d = s0 * 0.5, dx = d * Math.cos(Math.PI / 4), dy = d * Math.sin(Math.PI / 4);
    const X0 = o.x0 || 30, Y0 = o.y0 || 108;
    const P = (x, y, z) => [r1(X0 + x * s0 + y * dx), r1(Y0 - z * s0 - y * dy)];
    let s = '';
    for (let y = NY - 1; y >= 0; y--) for (let x = 0; x < NX; x++) for (let z = 0; z < h[y][x]; z++) {
      const f = [P(x, y, z), P(x + 1, y, z), P(x + 1, y, z + 1), P(x, y, z + 1)];
      const oben = [P(x, y, z + 1), P(x + 1, y, z + 1), P(x + 1, y + 1, z + 1), P(x, y + 1, z + 1)];
      const rechts = [P(x + 1, y, z), P(x + 1, y + 1, z), P(x + 1, y + 1, z + 1), P(x + 1, y, z + 1)];
      const poly = (pp, fill) => `<path d="M${pp.map((p) => p.join(' ')).join(' L')}Z" fill="${fill}" stroke="${T}" stroke-width="1.2" stroke-linejoin="round"/>`;
      s += poly(rechts, '#9fb0c8') + poly(oben, '#dfe6f3') + poly(f, '#c3cfe0');
    }
    if (o.pfeil !== false) {
      const mx = X0 + NX * s0 / 2;
      s += `<path d="M${r1(mx)} ${r1(Y0 + 28)} V ${r1(Y0 + 8)}" stroke="${ROT}" stroke-width="2"/><path d="M${r1(mx)} ${r1(Y0 + 6)} l-4 8 h8z" fill="${ROT}"/>` + tx(r1(mx + 8), r1(Y0 + 26), 'von vorn', 8, ROT, 'start', 800);
    }
    const W = Math.max(150, X0 + NX * s0 + NY * dx + 12), H = Y0 + 36;
    return svg(r1(W), r1(H), s, 'Körper aus Würfeln');
  };
  // Ansicht als Rasterbild: Zellen gefüllt, Kanten dort, wo sich die Tiefe (bzw. Höhe) ändert
  D.ansichtRaster = function (h, art) {
    const NX = h[0].length, NY = h.length, HZ = Math.max(...h.flat());
    if (art === 'vorn') { // Spalten x, Zeilen z (oben = hoch); Wert = vorderste Tiefe y
      return { b: NX, t: HZ, wert: (u, v) => { for (let y = 0; y < NY; y++) if (h[y][u] > v) return y; return -1; } };
    }
    if (art === 'oben') { // Spalten x, Zeilen: hinten oben, vorn unten (Draufsicht unter der Vorderansicht)
      return { b: NX, t: NY, wert: (u, v) => { const y = NY - 1 - v; return h[y][u] > 0 ? h[y][u] : -1; } };
    }
    // Seitenansicht von links: Spalten = Tiefe, vorn rechts; Wert = linkeste Spalte x
    return { b: NY, t: HZ, wert: (u, v) => { const y = NY - 1 - u; for (let x = 0; x < NX; x++) if (h[y][x] > v) return x; return -1; } };
  };
  D.zeichne.ansicht = function (h, art, o) {
    o = o || {};
    const r = D.ansichtRaster(h, art), s0 = o.s || 16, X0 = o.x || 6, Y0 = o.y || 6;
    let s = '';
    const zelle = (u, vv) => r.wert(u, r.t - 1 - vv); // vv: Zeile von oben
    for (let u = 0; u < r.b; u++) for (let vv = 0; vv < r.t; vv++) if (zelle(u, vv) >= 0) s += `<rect x="${X0 + u * s0}" y="${Y0 + vv * s0}" width="${s0}" height="${s0}" fill="#dfe6f3"/>`;
    // Kanten: zwischen Zellen mit verschiedenem Wert (oder leer)
    const w = (u, vv) => (u < 0 || vv < 0 || u >= r.b || vv >= r.t ? -1 : zelle(u, vv));
    for (let u = 0; u <= r.b; u++) for (let vv = 0; vv < r.t; vv++) if (w(u - 1, vv) !== w(u, vv)) s += `<path d="M${X0 + u * s0} ${Y0 + vv * s0} v${s0}" stroke="${T}" stroke-width="1.8" stroke-linecap="square"/>`;
    for (let vv = 0; vv <= r.t; vv++) for (let u = 0; u < r.b; u++) if (w(u, vv - 1) !== w(u, vv)) s += `<path d="M${X0 + u * s0} ${Y0 + vv * s0} h${s0}" stroke="${T}" stroke-width="1.8" stroke-linecap="square"/>`;
    return { s, w: r.b * s0 + 2 * X0, h: r.t * s0 + 2 * Y0, sig: Array.from({ length: r.b * r.t }, (_, i) => w(i % r.b, Math.floor(i / r.b)) >= 0 ? 1 : 0).join('') + '|' + r.b + 'x' + r.t + '|' + (() => { let k = ''; for (let u = 0; u <= r.b; u++) for (let vv = 0; vv < r.t; vv++) k += w(u - 1, vv) !== w(u, vv) ? 1 : 0; for (let vv = 0; vv <= r.t; vv++) for (let u = 0; u < r.b; u++) k += w(u, vv - 1) !== w(u, vv) ? 1 : 0; return k; })() };
  };

  // =====================================================
  // Stahlmaßstab an der Bezugskante, Anriss bei mm (erzeugt)
  // =====================================================
  D.zeichne.lineal = function (mm, o) {
    o = o || {};
    const MAX = o.max || 60, k = 220 / (MAX + 4), X0 = 12;
    let s = `<rect x="0" y="62" width="240" height="44" fill="${HOLZ}" opacity=".55"/><path d="M${X0} 56 V 110" stroke="${BLAU}" stroke-width="2.5"/>` + tx(X0 + 3, 120, 'Bezugskante', 8, BLAU, 'start', 800);
    s += `<rect x="${X0}" y="30" width="${r1((MAX + 2) * k)}" height="32" fill="${METALL}" stroke="${T}" stroke-width="1.2"/>`;
    for (let i = 0; i <= MAX; i++) {
      const x = r1(X0 + i * k), L = i % 10 === 0 ? 14 : i % 5 === 0 ? 10 : 6;
      s += `<path d="M${x} 62 v-${L}" stroke="${T}" stroke-width="${i % 10 === 0 ? 1.1 : 0.7}"/>`;
      if (i % 10 === 0) s += tx(x, 44, i, 9, T, 'middle', 800);
    }
    s += tx(r1(X0 + (MAX + 1.9) * k), 59, 'mm', 7, T, 'end', 700);
    if (mm !== undefined && mm !== null) { const x = r1(X0 + mm * k); s += `<path d="M${x} 62 V 104" stroke="${ROT}" stroke-width="1.8"/><path d="M${x} 66 l-4 -6 h8z" fill="${ROT}"/>`; }
    return svg(240, 126, s, 'Stahlmaßstab an der Bezugskante');
  };

  // =====================================================
  // Tabelle (Stückliste, Kostenaufstellung)
  // =====================================================
  D.zeichne.tabelle = function (z) {
    const br = z.breiten, W = br.reduce((a, b) => a + b, 0) + 4, zh = 16, H = (z.zeilen.length + 1) * zh + 4;
    let s = `<rect x="2" y="2" width="${W - 4}" height="${zh}" fill="#dfe6f3"/>`;
    let x = 2;
    z.kopf.forEach((k, i) => { s += tx(x + 4, 13, k, 7.5, T, 'start', 800); x += br[i]; });
    z.zeilen.forEach((zeile, j) => {
      let x = 2; const y = 2 + (j + 1) * zh;
      if (z.hell === j) s += `<rect x="2" y="${y}" width="${W - 4}" height="${zh}" fill="#fff3c4"/>`;
      zeile.forEach((c, i) => { s += tx(x + 4, y + 11.5, c, 7.8, c === '?' ? ROT : T, 'start', c === '?' ? 800 : 600); x += br[i]; });
    });
    for (let j = 0; j <= z.zeilen.length + 1; j++) s += `<path d="M2 ${2 + j * zh} H ${W - 2}" stroke="${GRAU}" stroke-width="${j === 0 || j === z.zeilen.length + 1 ? 1.2 : 0.6}"/>`;
    x = 2; for (let i = 0; i <= br.length; i++) { s += `<path d="M${x} 2 V ${H - 2}" stroke="${GRAU}" stroke-width="${i === 0 || i === br.length ? 1.2 : 0.6}"/>`; x += br[i] || 0; }
    return svg(W, H, s, z.name || 'Tabelle');
  };

  // Messschieber (Ersatz für Foto)
  B.messschieber = () => { let s = `<rect x="14" y="52" width="176" height="16" fill="${METALL}" stroke="${T}"/>`; for (let i = 0; i <= 30; i++) s += `<path d="M${40 + i * 5} 52 v${i % 10 === 0 ? 8 : 4}" stroke="${T}" stroke-width=".7"/>`;
    s += `<path d="M14 52 V 18 H 30 V 52" fill="${METALL}" stroke="${T}"/><path d="M58 52 V 22 H 74 V 52" fill="${METALL}" stroke="${T}"/><rect x="58" y="68" width="36" height="20" fill="${METALL}" stroke="${T}"/><path d="M22 68 V 92 H 30 V 68" fill="${METALL}" stroke="${T}"/>`;
    return svg(200, 120, s, 'Werkzeug'); };
  // Teile einer Bemaßung mit Nummern: 1 Maßlinie, 2 Maßhilfslinie, 3 Maßpfeil, 4 Maßzahl, 5 Körperkante, 6 Mittellinie
  B.massTeile = () => {
    let s = `<rect x="40" y="20" width="130" height="62" fill="#f7f4ee" stroke="${T}" stroke-width="2.2"/><circle cx="105" cy="51" r="13" fill="#fff" stroke="${T}" stroke-width="2.2"/>`;
    s += `<path d="M86 51 H124 M105 32 V70" stroke="${T}" stroke-width=".9" stroke-dasharray="9 2 1.5 2"/>`;
    s += `<path d="M40 85 V 112 M170 85 V 112 M40 108 H 170" stroke="${T}" stroke-width=".9"/><path d="M40 108 l8 -2.5 v5z M170 108 l-8 -2.5 v5z" fill="${T}"/>` + tx(105, 104, '130', 10, T, 'middle', 700);
    s += nr(1, 140, 128, 140, 108) + nr(2, 188, 96, 170, 100) + nr(3, 22, 122, 44, 108) + nr(4, 66, 126, 94, 104) + nr(5, 196, 30, 170, 36) + nr(6, 18, 40, 44, 51).replace('', '');
    return svg(220, 140, s, 'Teile einer Bemaßung mit Nummern');
  };
  // Sicherheitszeichen (vereinfacht)
  B.zeichenGebot = () => svg(200, 120, `<circle cx="100" cy="60" r="46" fill="#1f5fbf"/><path d="M70 58 C70 46 96 46 98 58 C104 46 130 46 130 58 V 66 C130 76 108 76 104 68 L100 64 L96 68 C92 76 70 76 70 66Z" fill="#fff"/>`, 'Zeichen');
  B.zeichenVerbot = () => svg(200, 120, `<circle cx="100" cy="60" r="46" fill="#fff" stroke="#d0443a" stroke-width="9"/><path d="M84 40 h32 v40 h-32z" fill="${T}"/><path d="M68 28 L132 92" stroke="#d0443a" stroke-width="9"/>`, 'Zeichen');
  B.zeichenWarn = () => svg(200, 120, `<path d="M100 10 L152 104 H48Z" fill="#ffcf00" stroke="${T}" stroke-width="5" stroke-linejoin="round"/><path d="M100 42 V 76" stroke="${T}" stroke-width="9" stroke-linecap="round"/><circle cx="100" cy="90" r="5" fill="${T}"/>`, 'Zeichen');
  B.zeichenRettung = () => svg(200, 120, `<rect x="50" y="14" width="100" height="92" rx="6" fill="#0a8a4a"/><path d="M90 34 h20 v16 h16 v20 h-16 v16 h-20 v-16 h-16 v-20 h16z" fill="#fff"/>`, 'Zeichen');

  // =====================================================
  // Abfall vermeiden: die fünf Stufen (umgedrehte Pyramide)
  // =====================================================
  B.abfallStufen = () => {
    const st = ['Vermeiden', 'Wiederverwenden', 'Recyceln', 'Verbrennen (Energie)', 'Ablagern (Deponie)'], FARBEN = ['#2e9e5b', '#7cc36b', '#ffd27a', '#ff9f43', '#d0443a'];
    let s = '';
    st.forEach((t, i) => { const w = 236 - i * 28, x = (250 - w) / 2, y = 8 + i * 22; s += `<path d="M${x} ${y} H ${x + w} L ${x + w - 14} ${y + 20} H ${x + 14}Z" fill="${FARBEN[i]}" stroke="#fff" stroke-width="1.5"/>` + tx(125, y + 14, t, 8.5, i === 4 ? '#fff' : T, 'middle', 800); });
    return svg(250, 120, s, 'Die fünf Stufen beim Umgang mit Abfall');
  };
})();
