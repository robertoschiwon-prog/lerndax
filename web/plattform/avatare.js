/* LernDax – Avatare (Plattform, für alle Fächer)
 * 12 eigene Figuren im Stil des Dachses, dazu eine Hintergrundfarbe.
 * Gespeichert als Text "figur:farbe", z. B. "fuchs:blau".
 *
 *   LernDaxAvatare.html(wert, px, extra, deco) → HTML für einen runden Avatar (deco = Ausstattung aus dem Laden)
 *   LernDaxAvatare.ich(px)             → der eigene Avatar mit allem, was angezogen ist
 *   LernDaxAvatare.picker(wert, fertig) → Auswahl-Fenster öffnen
 */
(function () {
  const INK = '#1c1a33';
  // Auge: weiß, Pupille leicht nach vorn, kleiner Glanzpunkt
  const eye = (x, y, r = 4.4) =>
    `<circle cx="${x}" cy="${y}" r="${r}" fill="#fff"/><circle cx="${x + r * 0.18}" cy="${y + r * 0.15}" r="${r * 0.58}" fill="${INK}"/><circle cx="${x + r * 0.42}" cy="${y - r * 0.2}" r="${r * 0.2}" fill="#fff"/>`;
  const eyes = (y, dx = 11, r) => eye(50 - dx, y, r) + eye(50 + dx, y, r);
  const smile = (y, w = 6, c = INK) => `<path d="M${50 - w} ${y} Q50 ${y + w * 0.7} ${50 + w} ${y}" stroke="${c}" stroke-width="2.2" fill="none" stroke-linecap="round"/>`;

  const FIGUREN = [
    { id: 'fuchs', kopf: 26, auge: [50, 12], kinn: 90, name: 'Fuchs', svg:
      `<path d="M22 14 L42 36 L16 46 Z" fill="#e8742a"/><path d="M78 14 L58 36 L84 46 Z" fill="#e8742a"/>
       <path d="M25 22 L37 36 L22 41 Z" fill="${INK}" opacity=".75"/><path d="M75 22 L63 36 L78 41 Z" fill="${INK}" opacity=".75"/>
       <path d="M50 90 C42 84 22 64 17 47 C14 34 30 26 50 26 C70 26 86 34 83 47 C78 64 58 84 50 90 Z" fill="#ff8a3d"/>
       <path d="M50 90 C44 84 31 70 26 58 C35 62 43 61 50 67 C57 61 65 62 74 58 C69 70 56 84 50 90 Z" fill="#fff8ee"/>
       ${eyes(50, 12)}<ellipse cx="50" cy="83" rx="5.5" ry="4" fill="${INK}"/>` },
    { id: 'eule', kopf: 25, auge: [50, 13], kinn: 91, name: 'Eule', svg:
      `<path d="M22 22 L34 34 L20 40 Z" fill="#6f4f36"/><path d="M78 22 L66 34 L80 40 Z" fill="#6f4f36"/>
       <ellipse cx="50" cy="58" rx="33" ry="33" fill="#8d6748"/>
       <ellipse cx="50" cy="72" rx="20" ry="17" fill="#d9b98f"/>
       <path d="M42 70 q3 3 6 0 M52 70 q3 3 6 0 M47 77 q3 3 6 0" stroke="#a7825b" stroke-width="1.6" fill="none"/>
       <circle cx="37" cy="50" r="12" fill="#f3e3c6"/><circle cx="63" cy="50" r="12" fill="#f3e3c6"/>
       ${eye(37, 50, 7.5)}${eye(63, 50, 7.5)}
       <path d="M45 60 L55 60 L50 69 Z" fill="#ff9f43"/>` },
    { id: 'pinguin', kopf: 20, auge: [54, 11], kinn: 90, name: 'Pinguin', svg:
      `<ellipse cx="50" cy="55" rx="34" ry="35" fill="#2a2d45"/>
       <path d="M50 88 C30 88 20 74 21 60 C22 50 30 42 39 44 C44 45 47 48 50 52 C53 48 56 45 61 44 C70 42 78 50 79 60 C80 74 70 88 50 88 Z" fill="#fff8ee"/>
       ${eyes(54, 11)}
       <path d="M42 63 Q50 58 58 63 Q50 72 42 63 Z" fill="#ff9f43"/>
       <circle cx="30" cy="66" r="4" fill="#ffb3c7" opacity=".7"/><circle cx="70" cy="66" r="4" fill="#ffb3c7" opacity=".7"/>` },
    { id: 'katze', kopf: 28, auge: [55, 12], kinn: 88, name: 'Katze', svg:
      `<path d="M18 20 L42 34 L20 50 Z" fill="#8f96ad"/><path d="M82 20 L58 34 L80 50 Z" fill="#8f96ad"/>
       <path d="M23 28 L36 35 L24 44 Z" fill="#ffb3c7"/><path d="M77 28 L64 35 L76 44 Z" fill="#ffb3c7"/>
       <ellipse cx="50" cy="58" rx="34" ry="30" fill="#a3aac1"/>
       <path d="M50 30 L46 42 L54 42 Z M38 31 L38 39 M62 31 L62 39" stroke="#7d849b" stroke-width="2.4" fill="#7d849b" stroke-linecap="round"/>
       ${eyes(55, 12)}
       <path d="M46 66 L54 66 L50 71 Z" fill="#ff8fab"/>${smile(73, 5)}
       <path d="M22 64 L36 66 M22 72 L36 70 M78 64 L64 66 M78 72 L64 70" stroke="${INK}" stroke-width="1.4" stroke-linecap="round" opacity=".55"/>` },
    { id: 'hund', kopf: 24, auge: [48, 11], kinn: 88, name: 'Hund', svg:
      `<ellipse cx="50" cy="56" rx="31" ry="32" fill="#c98b55"/>
       <ellipse cx="20" cy="52" rx="10" ry="21" transform="rotate(14 20 52)" fill="#7a4e2c"/>
       <ellipse cx="80" cy="52" rx="10" ry="21" transform="rotate(-14 80 52)" fill="#7a4e2c"/>
       <ellipse cx="62" cy="44" rx="9" ry="8" fill="#fff4e4"/>
       ${eyes(48, 11)}
       <ellipse cx="50" cy="72" rx="16" ry="13" fill="#fff4e4"/>
       <ellipse cx="50" cy="66" rx="6.5" ry="4.8" fill="${INK}"/>
       <path d="M50 70 L50 74" stroke="${INK}" stroke-width="2"/>${smile(74, 6)}
       <path d="M47 77 Q50 85 53 77 Z" fill="#ff7b9c"/>` },
    { id: 'igel', kopf: 14, auge: [60, 12], kinn: 90, name: 'Igel', svg:
      `<path d="M10 64 L16 48 L8 40 L20 34 L16 22 L30 24 L32 10 L44 18 L50 6 L56 18 L68 10 L70 24 L84 22 L80 34 L92 40 L84 48 L90 64 Z" fill="#5e4632"/>
       <path d="M18 64 C18 44 32 34 50 34 C68 34 82 44 82 64 C82 80 68 90 50 90 C32 90 18 80 18 64 Z" fill="#f2dcb8"/>
       ${eyes(60, 12)}
       <circle cx="50" cy="73" r="5" fill="${INK}"/>${smile(78, 7)}
       <circle cx="30" cy="72" r="4" fill="#ffb3a7" opacity=".8"/><circle cx="70" cy="72" r="4" fill="#ffb3a7" opacity=".8"/>` },
    { id: 'waschbaer', kopf: 26, auge: [52, 13], kinn: 88, name: 'Waschbär', svg:
      `<circle cx="24" cy="30" r="10" fill="#7f8494"/><circle cx="76" cy="30" r="10" fill="#7f8494"/>
       <circle cx="24" cy="30" r="5" fill="${INK}"/><circle cx="76" cy="30" r="5" fill="${INK}"/>
       <ellipse cx="50" cy="57" rx="35" ry="31" fill="#a2a7b6"/>
       <path d="M16 52 C26 40 40 44 50 52 C60 44 74 40 84 52 C78 64 62 62 50 58 C38 62 22 64 16 52 Z" fill="#2a2d45"/>
       <path d="M30 40 Q38 36 44 42 M70 40 Q62 36 56 42" stroke="#fff" stroke-width="3" fill="none" stroke-linecap="round"/>
       ${eyes(52, 13)}
       <path d="M32 72 C38 64 62 64 68 72 C64 84 36 84 32 72 Z" fill="#f3f0ea"/>
       <ellipse cx="50" cy="70" rx="5.5" ry="4" fill="${INK}"/>${smile(76, 5)}` },
    { id: 'drache', kopf: 24, auge: [48, 13], kinn: 84, name: 'Drache', svg:
      `<path d="M30 30 L24 10 L38 26 Z" fill="#ffd166"/><path d="M70 30 L76 10 L62 26 Z" fill="#ffd166"/>
       <path d="M44 22 L50 12 L56 22 Z" fill="#2c9e5c"/>
       <ellipse cx="50" cy="54" rx="33" ry="30" fill="#3dbb6a"/>
       <ellipse cx="50" cy="74" rx="24" ry="15" fill="#8be0a4"/>
       <circle cx="43" cy="70" r="2.2" fill="#1f6b3e"/><circle cx="57" cy="70" r="2.2" fill="#1f6b3e"/>
       ${eyes(48, 13, 5)}
       <path d="M36 79 Q50 86 64 79" stroke="#1f6b3e" stroke-width="2.2" fill="none" stroke-linecap="round"/>
       <path d="M44 81 L46 86 L48 81 Z M52 81 L54 86 L56 81 Z" fill="#fff"/>` },
    { id: 'roboter', kopf: 22, auge: [49, 12], kinn: 84, name: 'Roboter', svg:
      `<line x1="50" y1="22" x2="50" y2="10" stroke="#7f8494" stroke-width="3"/><circle cx="50" cy="9" r="5" fill="#ff6b6b"/>
       <rect x="12" y="44" width="8" height="18" rx="3" fill="#7f8494"/><rect x="80" y="44" width="8" height="18" rx="3" fill="#7f8494"/>
       <rect x="18" y="22" width="64" height="62" rx="16" fill="#b8c4d6"/>
       <rect x="26" y="34" width="48" height="36" rx="10" fill="#2a2d45"/>
       <rect x="33" y="43" width="10" height="12" rx="4" fill="#58e1ff"/><rect x="57" y="43" width="10" height="12" rx="4" fill="#58e1ff"/>
       <path d="M40 61 Q50 67 60 61" stroke="#58e1ff" stroke-width="2.6" fill="none" stroke-linecap="round"/>
       <circle cx="26" cy="77" r="2.4" fill="#7f8494"/><circle cx="74" cy="77" r="2.4" fill="#7f8494"/>` },
    { id: 'krake', kopf: 16, auge: [52, 12], kinn: 76, name: 'Krake', svg:
      `<path d="M22 66 C14 78 18 90 26 86 C30 84 28 76 34 72 M38 72 C34 84 36 94 44 92 C48 90 46 80 48 74 M52 74 C54 82 52 92 58 92 C66 92 64 82 62 72 M66 72 C72 76 70 84 74 86 C82 90 86 78 78 66" stroke="#7b4fe0" stroke-width="9" fill="none" stroke-linecap="round"/>
       <path d="M16 56 C16 30 32 16 50 16 C68 16 84 30 84 56 C84 70 70 76 50 76 C30 76 16 70 16 56 Z" fill="#8b5cf6"/>
       <circle cx="34" cy="30" r="4" fill="#a98bff"/><circle cx="62" cy="26" r="3" fill="#a98bff"/><circle cx="70" cy="38" r="2.5" fill="#a98bff"/>
       ${eyes(52, 12, 5)}${smile(64, 6)}
       <circle cx="28" cy="62" r="4" fill="#ffb3c7" opacity=".7"/><circle cx="72" cy="62" r="4" fill="#ffb3c7" opacity=".7"/>` },
    { id: 'faultier', kopf: 23, auge: [55, 15], kinn: 89, name: 'Faultier', svg:
      `<ellipse cx="50" cy="56" rx="35" ry="33" fill="#8a6b50"/>
       <ellipse cx="50" cy="60" rx="28" ry="25" fill="#e8d5b5"/>
       <path d="M24 56 C28 46 40 48 44 54 C42 62 30 66 24 56 Z" fill="#5b4330"/>
       <path d="M76 56 C72 46 60 48 56 54 C58 62 70 66 76 56 Z" fill="#5b4330"/>
       ${eye(35, 55, 4)}${eye(65, 55, 4)}
       <ellipse cx="50" cy="66" rx="5" ry="3.6" fill="${INK}"/>${smile(73, 7)}
       <path d="M30 30 Q40 24 50 28 Q60 24 70 30" stroke="#6e523b" stroke-width="3" fill="none" stroke-linecap="round"/>` },
    { id: 'axolotl', kopf: 30, auge: [54, 14], kinn: 86, name: 'Axolotl', svg:
      `<g stroke="#ff6fa8" stroke-width="5" stroke-linecap="round" fill="none">
         <path d="M20 46 L6 36"/><path d="M18 56 L4 56"/><path d="M20 66 L6 76"/>
         <path d="M80 46 L94 36"/><path d="M82 56 L96 56"/><path d="M80 66 L94 76"/></g>
       <ellipse cx="50" cy="58" rx="34" ry="28" fill="#ffa8cb"/>
       <circle cx="36" cy="54" r="4" fill="${INK}"/><circle cx="64" cy="54" r="4" fill="${INK}"/>
       <circle cx="37.3" cy="52.7" r="1.3" fill="#fff"/><circle cx="65.3" cy="52.7" r="1.3" fill="#fff"/>
       <path d="M34 68 Q50 78 66 68" stroke="${INK}" stroke-width="2.4" fill="none" stroke-linecap="round"/>
       <circle cx="28" cy="64" r="4" fill="#ff7fb0" opacity=".7"/><circle cx="72" cy="64" r="4" fill="#ff7fb0" opacity=".7"/>` },
  ];

  const FARBEN = [
    { id: 'orange', name: 'Orange', c: '#ff6b3d' }, { id: 'blau', name: 'Blau', c: '#3d7bff' },
    { id: 'gruen', name: 'Grün', c: '#14a06c' }, { id: 'lila', name: 'Lila', c: '#8b5cf6' },
    { id: 'gelb', name: 'Gelb', c: '#ffc53d' }, { id: 'pink', name: 'Pink', c: '#ff5fa2' },
    { id: 'tuerkis', name: 'Türkis', c: '#18b6c4' }, { id: 'nacht', name: 'Nacht', c: '#2a2d45' },
  ];
  const STANDARD = 'fuchs:blau';

  // ---------- Ausstattung aus dem Laden (seit lerndax-v114) ----------
  // Hut, Brille, Halsschmuck und Hintergrund. Gezeichnet in Avatar-Koordinaten (0–100); die Figur liegt in
  // translate(9 11) scale(.82), daher rechnet A() Figuren-Koordinaten um. Preise und Besitz: plattform/belohnung.js
  const A = (y) => 11 + 0.82 * y;
  const O = 'stroke="#1c1a33" stroke-width="1.6" stroke-linejoin="round"';
  const STERN = (x, y, r, f) => { let d = ''; for (let i = 0; i < 10; i++) { const w = -Math.PI / 2 + (i * Math.PI) / 5, q = i % 2 ? r * 0.45 : r; d += (i ? 'L' : 'M') + (x + q * Math.cos(w)).toFixed(1) + ' ' + (y + q * Math.sin(w)).toFixed(1); } return `<path d="${d}Z" fill="${f}"/>`; };
  const DECO = [
    // Hüte: Ursprung = Mitte der Kopf-Oberkante, nach oben negativ
    { id: 'partyhut', slot: 'hut', hoehe: 35, name: 'Partyhut', svg: () => `<path d="M-13 0 L0 -30 L13 0 Z" fill="#ff5fa2" ${O}/><path d="M-9.5 -8 L9.5 -8 M-5.5 -18 L5.5 -18" stroke="#ffd166" stroke-width="3"/><circle cx="0" cy="-31" r="4" fill="#ffd166" ${O}/>` },
    { id: 'bommel', slot: 'hut', hoehe: 30, name: 'Bommelmütze', svg: () => `<path d="M-18 0 C-18 -27 18 -27 18 0 Z" fill="#3d7bff" ${O}/><rect x="-19" y="-5" width="38" height="8" rx="3" fill="#fff8ee" ${O}/><circle cx="0" cy="-24" r="6" fill="#fff8ee" ${O}/>` },
    { id: 'cap', slot: 'hut', hoehe: 22, name: 'Basecap', svg: () => `<path d="M-3 -1 H27 Q29 4 22 5 H-3 Z" fill="#c8361e" ${O}/><path d="M-17 1 C-17 -23 17 -23 17 1 Z" fill="#ff6b3d" ${O}/><circle cx="0" cy="-17" r="2.4" fill="#c8361e"/>` },
    { id: 'zylinder', slot: 'hut', hoehe: 31, name: 'Zylinder', svg: () => `<rect x="-13" y="-31" width="26" height="29" rx="2" fill="#2a2d45" ${O}/><rect x="-13" y="-11" width="26" height="5" fill="#ff5fa2"/><rect x="-21" y="-4" width="42" height="6" rx="3" fill="#2a2d45" ${O}/>` },
    { id: 'zauberhut', slot: 'hut', hoehe: 42, name: 'Zauberhut', svg: () => `<path d="M-15 -2 Q-3 -22 5 -42 Q9 -20 15 -2 Z" fill="#6b4cd6" ${O}/><ellipse cx="0" cy="-1" rx="23" ry="5" fill="#6b4cd6" ${O}/>${STERN(-2, -14, 4, '#ffd166')}${STERN(5, -27, 3, '#ffd166')}` },
    { id: 'doktorhut', slot: 'hut', hoehe: 21, name: 'Doktorhut', svg: () => `<path d="M-14 1 L-14 -8 Q0 -13 14 -8 L14 1 Z" fill="#2a2d45" ${O}/><path d="M-25 -12 L0 -21 L25 -12 L0 -3 Z" fill="#2a2d45" ${O}/><path d="M0 -12 L19 -7 L19 4" stroke="#ffc53d" stroke-width="2.4" fill="none"/><circle cx="19" cy="5" r="2.6" fill="#ffc53d"/>` },
    { id: 'piratenhut', slot: 'hut', hoehe: 29, name: 'Piratenhut', svg: () => `<path d="M-27 -3 Q-21 -29 0 -27 Q21 -29 27 -3 Q0 -12 -27 -3 Z" fill="#2a2d45" ${O}/><circle cx="0" cy="-17" r="4.6" fill="#fff8ee"/><path d="M-6 -9 L6 -13 M-6 -13 L6 -9" stroke="#fff8ee" stroke-width="2"/>` },
    { id: 'koenigskrone', slot: 'hut', hoehe: 25, name: 'Königskrone', svg: () => `<path d="M-18 1 L-18 -18 L-9 -8 L0 -25 L9 -8 L18 -18 L18 1 Z" fill="#ffc53d" ${O}/><circle cx="0" cy="-8" r="3" fill="#ff5fa2"/><circle cx="-10" cy="-4" r="2.2" fill="#3d7bff"/><circle cx="10" cy="-4" r="2.2" fill="#14a06c"/>` },
    // Brillen: Ursprung = Mitte zwischen den Augen, d = halber Augenabstand
    { id: 'rundbrille', slot: 'brille', name: 'Runde Brille', svg: (d, r) => `<circle cx="${-d}" cy="0" r="${r}" fill="#fff" fill-opacity=".18" stroke="#1c1a33" stroke-width="2.2"/><circle cx="${d}" cy="0" r="${r}" fill="#fff" fill-opacity=".18" stroke="#1c1a33" stroke-width="2.2"/><path d="M${-d + r} 0 Q0 -3 ${d - r} 0 M${-d - r} -1 L${-d - r - 6} -3 M${d + r} -1 L${d + r + 6} -3" stroke="#1c1a33" stroke-width="2.2" fill="none"/>` },
    { id: 'sonnenbrille', slot: 'brille', name: 'Sonnenbrille', svg: (d, r) => `<rect x="${-d - r - 1}" y="${-r + 1}" width="${2 * r + 2}" height="${2 * r - 2}" rx="${r * 0.6}" fill="#1c1a33"/><rect x="${d - r - 1}" y="${-r + 1}" width="${2 * r + 2}" height="${2 * r - 2}" rx="${r * 0.6}" fill="#1c1a33"/><path d="M${-d + r} -1 L${d - r} -1" stroke="#1c1a33" stroke-width="2.4"/><path d="M${-d - r * 0.4} ${-r * 0.3} l3 -2 M${d - r * 0.4} ${-r * 0.3} l3 -2" stroke="#fff" stroke-width="1.6" stroke-linecap="round"/>` },
    { id: 'sternbrille', slot: 'brille', name: 'Sternbrille', svg: (d, r) => `${STERN(-d, 0, r * 1.35, '#ff5fa2')}${STERN(d, 0, r * 1.35, '#ff5fa2')}<path d="M${-d + r} 0 L${d - r} 0" stroke="#1c1a33" stroke-width="2.2"/>` },
    { id: 'taucherbrille', slot: 'brille', name: 'Taucherbrille', svg: (d, r) => `<path d="M${-d - r - 9} -1 L${d + r + 9} -1" stroke="#ff6b3d" stroke-width="3.5"/><rect x="${-d - r - 2}" y="${-r - 1}" width="${2 * (d + r + 2)}" height="${2 * r + 2}" rx="${r}" fill="#58e1ff" fill-opacity=".45" stroke="#ff6b3d" stroke-width="3"/>` },
    { id: 'maske', slot: 'brille', name: 'Heldenmaske', svg: (d, r) => `<path fill-rule="evenodd" d="M${-d - r - 7} -2 Q${-d} ${-r - 6} 0 -3 Q${d} ${-r - 6} ${d + r + 7} -2 Q${d + r + 4} ${r + 5} 0 ${r * 0.6} Q${-d - r - 4} ${r + 5} ${-d - r - 7} -2 Z M${-d - r * 0.8} 0 a${r * 0.8} ${r * 0.7} 0 1 0 ${r * 1.6} 0 a${r * 0.8} ${r * 0.7} 0 1 0 ${-r * 1.6} 0 Z M${d - r * 0.8} 0 a${r * 0.8} ${r * 0.7} 0 1 0 ${r * 1.6} 0 a${r * 0.8} ${r * 0.7} 0 1 0 ${-r * 1.6} 0 Z" fill="#e5383b"/>` },
    // Halsschmuck: Ursprung = Mitte des Kinns
    { id: 'fliege', slot: 'hals', name: 'Fliege', svg: () => `<path d="M0 3 L-13 -4 L-13 10 Z M0 3 L13 -4 L13 10 Z" fill="#e5383b" ${O}/><circle cx="0" cy="3" r="3.4" fill="#b02225" ${O}/>` },
    { id: 'halstuch', slot: 'hals', name: 'Halstuch', svg: () => `<path d="M-20 -2 Q0 6 20 -2 L0 16 Z" fill="#14a06c" ${O}/><circle cx="-6" cy="3" r="1.6" fill="#fff"/><circle cx="5" cy="6" r="1.6" fill="#fff"/><circle cx="0" cy="11" r="1.4" fill="#fff"/>` },
    { id: 'schal', slot: 'hals', name: 'Schal', svg: () => `<path d="M-24 -4 Q0 7 24 -4 L24 4 Q0 15 -24 4 Z" fill="#ffc53d" ${O}/><path d="M8 6 L16 20 L9 22 L3 8 Z" fill="#ffc53d" ${O}/><path d="M-14 1 L-14 9 M-4 3 L-4 11 M6 3 L6 10" stroke="#ff6b3d" stroke-width="2.4"/>` },
    { id: 'kette', slot: 'hals', name: 'Perlenkette', svg: () => [...Array(9)].map((_, i) => { const x = -16 + i * 4; return `<circle cx="${x}" cy="${(4 - (x * x) / 70).toFixed(1)}" r="2.6" fill="#fff8ee" stroke="#1c1a33" stroke-width=".9"/>`; }).join('') + `<circle cx="0" cy="8" r="3.6" fill="#ff5fa2" stroke="#1c1a33" stroke-width=".9"/>` },
    { id: 'medaille', slot: 'hals', name: 'Goldmedaille', svg: () => `<path d="M-12 -6 L-2 9 M12 -6 L2 9" stroke="#3d7bff" stroke-width="4.5"/><circle cx="0" cy="13" r="7" fill="#ffc53d" ${O}/>${STERN(0, 13, 4, '#fff8ee')}` },
    // Hintergründe: ersetzen die einfarbige Fläche
    { id: 'streifen', slot: 'bg', name: 'Streifen', svg: (c) => `<rect width="100" height="100" fill="${c}"/>${[...Array(7)].map((_, i) => `<path d="M${i * 30 - 60} 0 L${i * 30 - 10} 0 L${i * 30 + 40} 100 L${i * 30 - 10} 100 Z" fill="#fff" opacity=".22" transform="translate(${-i * 15} 0)"/>`).join('')}` },
    { id: 'punkte', slot: 'bg', name: 'Punkte', svg: (c) => `<rect width="100" height="100" fill="${c}"/>${[...Array(25)].map((_, i) => `<circle cx="${(i % 5) * 22 + (Math.floor(i / 5) % 2 ? 11 : 0) + 4}" cy="${Math.floor(i / 5) * 22 + 6}" r="4.5" fill="#fff" opacity=".3"/>`).join('')}` },
    { id: 'schach', slot: 'bg', name: 'Schachbrett', svg: (c) => `<rect width="100" height="100" fill="${c}"/>${[...Array(25)].map((_, i) => ((i % 5) + Math.floor(i / 5)) % 2 ? '' : `<rect x="${(i % 5) * 20}" y="${Math.floor(i / 5) * 20}" width="20" height="20" fill="#fff" opacity=".28"/>`).join('')}` },
    { id: 'regenbogen', slot: 'bg', name: 'Regenbogen', svg: () => `<rect width="100" height="100" fill="#bfe7ff"/>${['#ff6b6b', '#ffa94d', '#ffd43b', '#69db7c', '#4dabf7', '#9775fa'].map((f, i) => `<circle cx="50" cy="100" r="${70 - i * 8}" fill="${f}"/>`).join('')}<circle cx="50" cy="100" r="22" fill="#bfe7ff"/>` },
    { id: 'nachthimmel', slot: 'bg', name: 'Nachthimmel', svg: () => `<rect width="100" height="100" fill="#1d2a5a"/><circle cx="78" cy="22" r="9" fill="#fff3bf"/><circle cx="82" cy="19" r="8" fill="#1d2a5a"/>${[[14, 18], [30, 8], [22, 40], [88, 52], [10, 70], [70, 8], [92, 82]].map(([x, y], i) => STERN(x, y, i % 2 ? 2.4 : 3.2, '#fff3bf')).join('')}` },
    { id: 'weltall', slot: 'bg', name: 'Weltall', svg: () => `<rect width="100" height="100" fill="#120f2e"/><circle cx="18" cy="24" r="10" fill="#ff8a3d"/><ellipse cx="18" cy="24" rx="17" ry="4" fill="none" stroke="#ffd166" stroke-width="2.2" transform="rotate(-18 18 24)"/><circle cx="84" cy="74" r="6" fill="#58e1ff"/>${[[60, 10], [90, 30], [8, 60], [40, 6], [74, 92], [12, 90]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="1.4" fill="#fff"/>`).join('')}` },
    { id: 'unterwasser', slot: 'bg', name: 'Unterwasser', svg: () => `<rect width="100" height="100" fill="#1c7ed6"/><rect y="60" width="100" height="40" fill="#1971c2"/><path d="M0 92 Q12 84 24 92 T48 92 T72 92 T100 92 V100 H0 Z" fill="#f2d49b"/>${[[16, 30, 3], [22, 18, 2], [84, 40, 3.5], [80, 24, 2.2], [12, 56, 2]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="none" stroke="#d0ebff" stroke-width="1.4"/>`).join('')}` },
  ];
  const SLOTS = [['hut', 'Hüte'], ['brille', 'Brillen'], ['hals', 'Halsschmuck'], ['bg', 'Hintergründe']];
  function decoSvg(fig, col, deco) {
    deco = deco || {};
    const item = (slot) => DECO.find((x) => x.id === deco[slot] && x.slot === slot);
    const bg = item('bg'), hut = item('hut'), br = item('brille'), hals = item('hals');
    const d = 0.82 * fig.auge[1], r = Math.min(d * 0.64, 8.5), s = Math.min(1, 1 / Math.max(1, 13 / fig.auge[1]));
    return {
      unten: bg ? bg.svg(col.c) : `<circle cx="50" cy="50" r="50" fill="${col.c}"/>`,
      oben: (hals ? `<g transform="translate(50 ${A(fig.kinn)})">${hals.svg()}</g>` : '')
        + (br ? `<g transform="translate(50 ${A(fig.auge[0])})">${br.svg(d, r * s)}</g>` : '')
        + (hut ? `<g transform="translate(50 ${Math.max(A(fig.kopf) + 2, hut.hoehe * 0.86 + 5).toFixed(1)}) scale(.86)">${hut.svg()}</g>` : ''),
    };
  }

  function parse(v) {
    const [f, c] = String(v || STANDARD).split(':');
    return { fig: FIGUREN.find((x) => x.id === f) || FIGUREN[0], col: FARBEN.find((x) => x.id === c) || FARBEN[1] };
  }
  // deco: { hut, brille, hals, bg } aus dem Laden (fehlt = ohne Ausstattung)
  function svg(v, deco) {
    const { fig, col } = parse(v), D = decoSvg(fig, col, deco);
    return `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${fig.name}">${D.unten}<g transform="translate(9 11) scale(.82)">${fig.svg}</g>${D.oben}</svg>`;
  }
  function html(v, px, extra, deco) {
    return `<span class="ldx-ava${extra ? ' ' + extra : ''}" style="width:${px}px;height:${px}px">${svg(v, deco)}</span>`;
  }
  // Der eigene Avatar mit allem, was gerade angezogen ist
  const getragen = () => (window.LernDaxBelohnung ? window.LernDaxBelohnung.getragen() : {});
  function ich(px, extra) { return html(get() || STANDARD, px, extra, getragen()); }

  // ---------- Auswahl-Fenster ----------
  let styled = false;
  function style() {
    if (styled) return; styled = true;
    const s = document.createElement('style');
    s.textContent = `
.ldx-ava{display:inline-block;flex:0 0 auto;border-radius:50%;border:2px solid #1c1a33;box-shadow:2px 2px 0 #1c1a33;overflow:hidden;background:#fff;line-height:0}
.ldx-ava svg{width:100%;height:100%;display:block}
.ldx-ov{position:fixed;inset:0;z-index:50;background:rgba(28,26,51,.5);display:grid;place-items:end center;padding:0}
@media (min-width:600px){.ldx-ov{place-items:center;padding:20px}}
.ldx-sheet{width:100%;max-width:520px;max-height:94vh;overflow:auto;background:#fbf6ee;border:2px solid #1c1a33;border-radius:22px 22px 0 0;padding:16px 16px calc(18px + env(safe-area-inset-bottom));font-family:Nunito,system-ui,sans-serif;color:#1c1a33;animation:ldxup .22s ease-out}
@media (min-width:600px){.ldx-sheet{border-radius:22px}}
@keyframes ldxup{from{transform:translateY(30px);opacity:0}to{transform:none;opacity:1}}
.ldx-sheet.still{animation:none}
.ldx-sheet h2{font:800 22px "Bricolage Grotesque",Nunito,system-ui,sans-serif;margin:0 0 4px}
.ldx-sheet p{margin:0 0 12px;color:#6b6680;font-weight:700;font-size:15px}
.ldx-prev{display:flex;align-items:center;gap:14px;margin:4px 0 14px}
.ldx-prev b{font:800 20px "Bricolage Grotesque",Nunito,system-ui,sans-serif}
.ldx-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-bottom:14px}
.ldx-fig{background:#fff;border:2px solid #1c1a33;border-radius:16px;padding:6px 4px 4px;display:flex;flex-direction:column;align-items:center;gap:2px;font:800 12px Nunito,system-ui,sans-serif;cursor:pointer;color:#1c1a33}
.ldx-fig svg{width:100%;max-width:72px;height:auto}
.ldx-fig.on{background:#fff1e6;box-shadow:0 0 0 3px #ff6b3d}
.ldx-cols{display:flex;flex-wrap:wrap;gap:8px;margin:2px 0 16px}
.ldx-col{width:38px;height:38px;border-radius:50%;border:2px solid #1c1a33;cursor:pointer}
.ldx-col.on{box-shadow:0 0 0 3px #fbf6ee,0 0 0 6px #1c1a33}
.ldx-done{width:100%;border:2px solid #1c1a33;border-radius:14px;box-shadow:3px 3px 0 #1c1a33;background:#ff6b3d;color:#1c1a33;font:800 18px Nunito,system-ui,sans-serif;padding:13px;cursor:pointer}
.ldx-done:active{transform:translate(3px,3px);box-shadow:none}
.ldx-lbl{font-weight:800;font-size:13px;color:#6b6680;margin:0 0 6px}`;
    document.head.appendChild(s);
  }
  function picker(current, done, opts) {
    style();
    opts = opts || {};
    let { fig, col } = parse(current);
    const ov = document.createElement('div');
    ov.className = 'ldx-ov';
    let first = true;
    const draw = () => {
      const v = fig.id + ':' + col.id;
      const y = ov.firstChild ? ov.firstChild.scrollTop : 0;
      ov.innerHTML = `<div class="ldx-sheet${first ? '' : ' still'}" role="dialog" aria-label="Avatar aussuchen">
        <h2>${opts.title || 'Such dir deinen Avatar aus!'}</h2>
        <p>${opts.text || 'Du kannst ihn jederzeit wieder ändern.'}</p>
        <div class="ldx-prev">${html(v, 72, '', getragen())}<b>${fig.name}</b></div>
        <div class="ldx-lbl">Figur</div>
        <div class="ldx-grid">${FIGUREN.map((f) => `<button class="ldx-fig${f.id === fig.id ? ' on' : ''}" data-fig="${f.id}">${svg(f.id + ':' + col.id)}${f.name}</button>`).join('')}</div>
        <div class="ldx-lbl">Farbe</div>
        <div class="ldx-cols">${FARBEN.map((c) => `<button class="ldx-col${c.id === col.id ? ' on' : ''}" data-col="${c.id}" title="${c.name}" aria-label="${c.name}" style="background:${c.c}"></button>`).join('')}</div>
        <button class="ldx-done">Fertig</button></div>`;
      ov.firstChild.scrollTop = y; first = false;
    };
    draw();
    ov.addEventListener('click', (e) => {
      const b = e.target.closest('button');
      if (e.target === ov) { ov.remove(); return; }
      if (!b) return;
      if (b.dataset.fig) { fig = FIGUREN.find((x) => x.id === b.dataset.fig); draw(); }
      else if (b.dataset.col) { col = FARBEN.find((x) => x.id === b.dataset.col); draw(); }
      else if (b.classList.contains('ldx-done')) { ov.remove(); done(fig.id + ':' + col.id); }
    });
    document.body.appendChild(ov);
  }

  // ---------- Speichern (auf dem Gerät, mit dem Profil synchronisiert) ----------
  const KEY = 'lerndax.avatar';
  const get = () => { try { return localStorage.getItem(KEY) || ''; } catch (e) { return ''; } };
  const set = (v) => { try { localStorage.setItem(KEY, v); } catch (e) {} };

  window.LernDaxAvatare = { FIGUREN, FARBEN, STANDARD, DECO, SLOTS, parse, svg, html, ich, picker, get, set, style };
})();
