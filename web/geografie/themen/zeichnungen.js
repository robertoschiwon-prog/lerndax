/* GeoDax – schematische Zeichnungen (keine Landschaften, keine Tiere: dafür gibt es Fotos und Karten)
 *   D.tagNachtBild(k)   Erde von oben über dem Nordpol, Sonne rechts; k = 0 Mitternacht, 1 Sonnenaufgang, 2 Mittag, 3 Sonnenuntergang
 *   D.jahrBild(k)       Sonne in der Mitte, Erde links (k = 0, Sommer auf der Nordhalbkugel) oder rechts (k = 1, Winter)
 *   D.steigungBild()    Gebirge im Querschnitt, Wind von links
 *   D.talBild(k)        Talquerschnitt; k = 0 Klamm, 1 Kerbtal, 2 Sohlental, 3 Muldental
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
    s += tx(cx + 22, cy + 3, 'Nordpol', 7, T, 'middle', 700);
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
})();
