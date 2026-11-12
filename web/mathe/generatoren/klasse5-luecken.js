/* MaDax (Mathe) – Klasse 5, Ergänzung: Themen, die im ersten Wurf noch fehlten (Lehrplan Gymnasium Sachsen)
 *
 *   LB 1: Überschlagen · Schriftlich rechnen
 *   LB 2: Dezimalzahlen runden · Gemischte Zahlen
 *   LB 3: Symmetrie & Spiegeln (Achsen, Spiegeln, Punktspiegelung, Verschieben, Drehen)
 *   LB 4: Netze & Schrägbilder (Würfelnetze, Quadernetze, Schrägbild, Baupläne)
 *   LB 5: Schätzen wie Fermi
 *
 * Aufbau der Aufgaben wie in klasse5.js beschrieben. Diese Datei wird NACH klasse5.js geladen und
 * hängt ihre Themen in die Lernbereiche ein (siehe ganz unten).
 */
(function () {
  const M = window.Mathelix;
  const U = M.util;
  const { R, pick, shuffle, gcd, fmt, fr } = U;
  const NAMEN = ['Lina', 'Emil', 'Mia', 'Paul', 'Ida', 'Ben', 'Lea', 'Noah'];
  // Zahl mit fester Anzahl Nachkommastellen in deutscher Schreibweise: 3,40
  const fix = (v, dec) => v.toFixed(dec).replace('.', ',');
  const euro = (cents) => `${Math.floor(cents / 100)},${String(cents % 100).padStart(2, '0')} €`;

  // =====================================================
  // LB 1 – Überschlagen
  // =====================================================
  const STELLE = { 10: 'Zehner', 100: 'Hunderter', 1000: 'Tausender' };
  const rnd = (n, p) => Math.round(n / p) * p;
  // Wie gut ist der Überschlag? (Beim Malnehmen kann er deutlich abweichen, die Größenordnung stimmt trotzdem.)
  const nah = (est, exact) => (Math.abs(est - exact) <= 0.1 * exact ? 'Der Überschlag liegt nah dran.' : 'Der Überschlag trifft die Größenordnung. Genauer muss er nicht sein.');
  U.ueberNah = nah;
  function ueberschlag() {
    const v = R(1, 6);
    if (v <= 3) {
      // Runden und im Kopf rechnen
      const op = pick(['+', '+', '−', '·']);
      let a, b, pa, pb;
      if (op === '·') {
        pa = pick([10, 100]); pb = 10;
        do { a = pa === 10 ? R(12, 98) : R(120, 980); b = R(12, 89); } while (a % pa === 0 || b % 10 === 0 || rnd(b, 10) === 0);
      } else {
        pa = pb = pick([100, 1000]);
        do { a = R(pa * 2, pa * 9 + pa - 1); b = R(pa, pa * 8); } while (a % pa === 0 || b % pb === 0 || (op === '−' && rnd(a, pa) <= rnd(b, pb)));
      }
      const ra = rnd(a, pa), rb = rnd(b, pb);
      const est = op === '+' ? ra + rb : op === '−' ? ra - rb : ra * rb;
      const exact = op === '+' ? a + b : op === '−' ? a - b : a * b;
      const wie = pa === pb ? `beide Zahlen auf <b>${STELLE[pa]}</b>` : `die erste Zahl auf <b>${STELLE[pa]}</b> und die zweite auf <b>${STELLE[pb]}</b>`;
      return {
        prompt: `Überschlage: <b>${fmt(a)} ${op} ${fmt(b)}</b><br>Runde ${wie} und rechne im Kopf.`,
        fields: [{ answer: est, prefix: '≈' }],
        hint: 'Erst runden, dann mit den glatten Zahlen rechnen. Das Ergebnis ist nur ungefähr richtig, und genau das soll es sein.',
        solution: `${fmt(a)} ≈ ${fmt(ra)} und ${fmt(b)} ≈ ${fmt(rb)}<br>${fmt(ra)} ${op} ${fmt(rb)} = <b>${fmt(est)}</b><br><small>Genau gerechnet: ${fmt(exact)}. ${nah(est, exact)}</small>`,
        answerText: `≈ ${fmt(est)}`,
        ex: { mode: 'ueber', a, b, op, ra, rb, est, exact },
      };
    }
    if (v <= 5) {
      // Welches Ergebnis kann stimmen? Die falschen haben einen Stellenfehler.
      const op = pick(['·', '·', '+']);
      let a, b, exact, ra, rb, est;
      if (op === '·') {
        do { a = R(102, 898); b = R(12, 89); } while (a % 100 === 0 || b % 10 === 0);
        exact = a * b; ra = rnd(a, 100); rb = rnd(b, 10); est = ra * rb;
      } else {
        do { a = R(1200, 8900); b = R(1200, 8900); } while (a % 1000 === 0 || b % 1000 === 0);
        exact = a + b; ra = rnd(a, 1000); rb = rnd(b, 1000); est = ra + rb;
      }
      const falsch = op === '·' ? [Math.round(exact / 10), exact * 10] : [exact - R(3, 4) * 1000, exact + R(4, 6) * 1000];
      const opts = shuffle([exact, ...falsch]);
      return {
        prompt: `Ohne genau zu rechnen: Welches Ergebnis kann stimmen?<br><b>${fmt(a)} ${op} ${fmt(b)}</b>`,
        choices: opts.map(fmt),
        correct: opts.indexOf(exact),
        hint: 'Mach einen Überschlag mit gerundeten Zahlen. Nur ein Ergebnis liegt in der Nähe.',
        solution: `Überschlag: ${fmt(ra)} ${op} ${fmt(rb)} = ${fmt(est)}<br>In der Nähe von ${fmt(est)} liegt nur <b>${fmt(exact)}</b>.<br><small>So findest du Rechenfehler: Weicht dein Ergebnis stark vom Überschlag ab, stimmt etwas nicht.</small>`,
        ex: { mode: 'ueber', a, b, op, ra, rb, est, exact },
      };
    }
    // Reicht das Geld?
    for (;;) {
      const n = R(3, 4);
      const preise = Array.from({ length: n }, () => R(2, 9) * 100 + pick([19, 29, 45, 49, 59, 79, 89, 95, 99]));
      const summe = preise.reduce((s, p) => s + p, 0);
      const ueber = preise.reduce((s, p) => s + Math.round(p / 100), 0);
      const geld = pick([10, 15, 20, 25, 30]);
      // klare Fälle: Überschlag und genaue Summe liegen deutlich auf derselben Seite
      if (Math.abs(ueber - geld) < 2 || (ueber < geld) !== (summe < geld * 100) || Math.abs(summe - geld * 100) < 150) continue;
      const reicht = summe <= geld * 100;
      const name = pick(NAMEN);
      return {
        prompt: `${name} hat <b>${geld} €</b> dabei und möchte Sachen für <b>${preise.map(euro).join(', ')}</b> kaufen. Reicht das Geld? Überschlage.`,
        choices: ['Ja, das reicht', 'Nein, das reicht nicht'],
        correct: reicht ? 0 : 1,
        hint: 'Runde jeden Preis auf ganze Euro und zähle zusammen.',
        solution: `Gerundet: ${preise.map((p) => Math.round(p / 100)).join(' + ')} = <b>${ueber} €</b><br>Das ist ${reicht ? 'weniger' : 'mehr'} als ${geld} € → Das Geld reicht <b>${reicht ? '' : 'nicht'}</b>.<br><small>Genau: ${euro(summe)}</small>`,
        ex: { mode: 'ueber', geld: true, preise, ueber, summe, budget: geld },
      };
    }
  }

  // =====================================================
  // LB 1 – Schriftlich rechnen (plus, minus, mal)
  // =====================================================
  // Zahlen stellengerecht untereinander
  const roh = (n) => String(n); // im Stapel ohne Tausender-Lücken, damit die Stellen genau untereinander stehen
  const stapel = (zeilen) => `<span class="schr">${zeilen.map((z) => `<span>${z}</span>`).join('')}</span>`;
  // Schritte der schriftlichen Addition, von rechts nach links
  function addSchritte(nums) {
    const len = Math.max(...nums.map((n) => String(n).length));
    const out = []; let carry = 0;
    for (let i = 0; i < len || carry; i++) {
      const ds = nums.map((n) => Math.floor(n / 10 ** i) % 10);
      const s = ds.reduce((a, b) => a + b, 0) + carry;
      out.push({ i, ds, carryIn: carry, sum: s, digit: s % 10, carry: Math.floor(s / 10) });
      carry = Math.floor(s / 10);
    }
    return out;
  }
  const STELLEN = ['Einer', 'Zehner', 'Hunderter', 'Tausender', 'Zehntausender', 'Hunderttausender'];
  U.addSchritte = addSchritte;
  function schriftlich() {
    const v = R(1, 6);
    if (v <= 2) {
      const k = pick([2, 2, 3]);
      const nums = Array.from({ length: k }, (_, i) => (i === 0 ? R(1200, 48000) : R(180, 9800)));
      const sum = nums.reduce((a, b) => a + b, 0);
      const st = addSchritte(nums);
      const txt = st.filter((s) => s.i < 3 || s.carry).slice(0, 3).map((s) => `${STELLEN[s.i]}: ${s.ds.filter((d, j) => String(nums[j]).length > s.i).join(' + ')}${s.carryIn ? ' + ' + s.carryIn : ''} = ${s.sum} → schreibe <b>${s.digit}</b>${s.carry ? ', merke ' + s.carry : ''}`).join('<br>');
      return {
        prompt: `Rechne schriftlich:${stapel(nums.map((n, i) => (i === nums.length - 1 ? '+ ' : '') + roh(n)))}`,
        fields: [{ answer: sum }],
        hint: 'Schreibe die Zahlen stellengerecht untereinander: Einer unter Einer. Beginne rechts und notiere jeden Übertrag.',
        solution: `${txt}<br>… und so weiter bis zur vordersten Stelle.<br>${nums.map(fmt).join(' + ')} = <b>${fmt(sum)}</b>`,
        ex: { mode: 'schr', op: '+', nums },
      };
    }
    if (v <= 4) {
      const a = R(2100, 90000), b = R(150, Math.min(a - 100, 38000));
      const d = a - b;
      return {
        prompt: `Rechne schriftlich:${stapel([roh(a), '− ' + roh(b)])}`,
        fields: [{ answer: d }],
        hint: 'Stellengerecht untereinander schreiben und rechts beginnen. Reicht es an einer Stelle nicht, brauchst du einen Übertrag. Mach am Ende die Probe mit Plus.',
        solution: `${fmt(a)} − ${fmt(b)} = <b>${fmt(d)}</b><br>Probe mit Plus: ${fmt(d)} + ${fmt(b)} = ${fmt(a)} ✓`,
        ex: { mode: 'schr', op: '−', a, b },
      };
    }
    if (v === 5) {
      const a = R(123, 4980), b = R(3, 9);
      const ds = String(a).split('').reverse().map(Number);
      let c = 0;
      const txt = ds.map((z, i) => { const p = z * b + c; const line = `${b} · ${z}${c ? ' + ' + c : ''} = ${p} → schreibe <b>${i === ds.length - 1 ? p : p % 10}</b>${i < ds.length - 1 && p >= 10 ? ', merke ' + Math.floor(p / 10) : ''}`; c = Math.floor(p / 10); return line; }).join('<br>');
      return {
        prompt: `Rechne schriftlich: <b>${fmt(a)} · ${b}</b>`,
        fields: [{ answer: a * b }],
        hint: `Multipliziere ${b} nacheinander mit jeder Ziffer, rechts beginnend. Überträge merken und dazuzählen.`,
        solution: `Von rechts nach links:<br>${txt}<br>${fmt(a)} · ${b} = <b>${fmt(a * b)}</b>`,
        ex: { mode: 'schr', op: '·', a, b },
      };
    }
    let a, b;
    do { a = R(112, 980); b = R(12, 79); } while (b % 10 === 0);
    const z = Math.floor(b / 10) * 10, e = b % 10;
    return {
      prompt: `Rechne schriftlich: <b>${fmt(a)} · ${b}</b>`,
      fields: [{ answer: a * b }],
      hint: `Zerlege ${b} in ${z} und ${e}: erst ${fmt(a)} · ${z}, dann ${fmt(a)} · ${e}, dann beides zusammenzählen.`,
      solution: `${fmt(a)} · ${z} = ${fmt(a * z)}<br>${fmt(a)} · ${e} = ${fmt(a * e)}<br>${fmt(a * z)} + ${fmt(a * e)} = <b>${fmt(a * b)}</b>`,
      ex: { mode: 'schr', op: '··', a, b },
    };
  }

  // =====================================================
  // LB 2 – Dezimalzahlen runden
  // =====================================================
  // Gerechnet wird in Tausendsteln (ganze Zahlen), damit nichts ungenau wird.
  function dezRunden() {
    const [P, name, dec] = pick([[1000, 'Einer', 0], [100, 'Zehntel', 1], [100, 'Zehntel', 1], [10, 'Hundertstel', 2], [10, 'Hundertstel', 2]]);
    let N;
    do N = R(1, 49) * 1000 + R(1, 999); while (N % P === 0 || (P === 100 && N % 10 !== 0 && R(0, 1)));
    const ans = Math.round(N / P) * P;
    const stellen = N % 10 ? 3 : N % 100 ? 2 : 1;
    const zahl = fix(N / 1000, stellen);
    const digit = Math.floor(N / (P / 10)) % 10;
    const kontext = pick([null, null, ['kg', 'Ein Paket wiegt'], ['m', 'Ein Sprung ist'], ['l', 'In der Kanne sind'], ['s', 'Die Laufzeit beträgt']]);
    const wort = name === 'Einer' ? 'Einer (auf eine ganze Zahl)' : name;
    return {
      prompt: kontext ? `${kontext[1]} <b>${zahl} ${kontext[0]}</b>. Runde auf <b>${wort}</b>.` : `Runde <b>${zahl}</b> auf <b>${wort}</b>.`,
      fields: [{ answer: ans / 1000, suffix: kontext ? kontext[0] : '' }],
      hint: `Schau auf die Ziffer <b>rechts neben</b> der ${name}stelle: 0–4 → abrunden, 5–9 → aufrunden. Alles dahinter fällt weg.`,
      solution: `Die Ziffer rechts neben der ${name}stelle ist <b>${digit}</b> → ${digit >= 5 ? 'aufrunden' : 'abrunden'}.<br>${zahl} ≈ <b>${fix(ans / 1000, dec)}</b>`,
      answerText: fix(ans / 1000, dec) + (kontext ? ' ' + kontext[0] : ''),
      ex: { mode: 'rund', n: N, p: P, scale: 1000, name },
    };
  }

  // =====================================================
  // LB 2 – Gemischte Zahlen
  // =====================================================
  function gemischt() {
    const v = R(1, 6);
    let d, w, r;
    do { d = pick([2, 3, 4, 5, 6, 8]); w = R(1, 4); r = R(1, d - 1); } while (gcd(r, d) !== 1);
    const n = w * d + r;
    const gem = `${w} ${fr(r, d)}`;
    if (v <= 2) {
      return {
        prompt: `Schreibe ${fr(n, d)} als <b>gemischte Zahl</b>.`,
        fields: [{ answer: w, label: 'Ganze' }, { answer: r, label: `Zähler (Nenner bleibt ${d})` }],
        hint: `Wie oft passt ${d} in ${n}? So viele Ganze sind es. Der Rest bleibt als Bruch stehen.`,
        solution: `${n} : ${d} = ${w} Rest ${r}<br>${fr(n, d)} = <b>${gem}</b>`,
        answerText: gem,
        ex: { mode: 'gem', n, d },
      };
    }
    if (v <= 4) {
      return {
        prompt: `Schreibe <b>${gem}</b> als einen einzigen Bruch.`,
        layout: 'frac',
        fields: [{ answer: n, label: 'Zähler' }, { answer: d, label: 'Nenner' }],
        check([a, b]) {
          if (!b || a * d !== b * n) return { ok: false };
          return { ok: true };
        },
        hint: `Ein Ganzes sind ${fr(d, d)}. Rechne ${w} · ${d} und zähle ${r} dazu.`,
        solution: `${w} ${w === 1 ? "Ganzes" : "Ganze"} = ${w} · ${d} = ${w * d} Teile, dazu ${r} → ${w * d + r} Teile<br><b>${gem} = ${fr(n, d)}</b>`,
        answerText: fr(n, d),
        ex: { mode: 'gem', n, d, back: true },
      };
    }
    if (v === 5) {
      const opts = [[w - 1, w], [w, w + 1], [w + 1, w + 2]];
      return {
        prompt: `Zwischen welchen ganzen Zahlen liegt ${fr(n, d)}?`,
        choices: opts.map(([a, b]) => `zwischen ${a} und ${b}`),
        correct: 1,
        hint: `Wie viele Ganze stecken in ${fr(n, d)}? Teile ${n} durch ${d}.`,
        solution: `${n} : ${d} = ${w} Rest ${r} → ${fr(n, d)} = ${gem}<br>Das liegt <b>zwischen ${w} und ${w + 1}</b>.`,
        ex: { mode: 'gem', n, d },
      };
    }
    const ding = pick([['Pizza', 'Pizzen', 'Stücke', 'ganze'], ['Tafel Schokolade', 'Tafeln Schokolade', 'Stücke', 'ganze'], ['Kuchen', 'Kuchen', 'Stücke', 'ganzer']]);
    const ganz = w === 1 ? `1 ${ding[3]} ${ding[0]}` : `${w} ganze ${ding[1]}`, rest = r === 1 ? '1 Stück' : `${r} ${ding[2]}`;
    return {
      prompt: `Jede ${ding[0] === 'Kuchen' ? 'Kuchen' : ding[0]} wird in <b>${d} gleiche ${ding[2]}</b> geteilt. Auf dem Tisch liegen <b>${n} ${ding[2]}</b>. Wie viele ganze ${ding[1]} sind das, und wie viele ${ding[2]} bleiben übrig?`
        .replace('Jede Kuchen', 'Jeder Kuchen'),
      fields: [{ answer: w, label: `ganze ${ding[1]}` }, { answer: r, label: `${ding[2]} übrig` }],
      hint: `Immer ${d} ${ding[2]} ergeben ein Ganzes. Wie oft passt ${d} in ${n}?`,
      solution: `${n} : ${d} = ${w} Rest ${r}<br><b>${ganz}</b> und <b>${rest}</b> übrig, also ${fr(n, d)} = ${gem}.`,
      answerText: `${w} ganze, ${r} übrig`,
      ex: { mode: 'gem', n, d },
    };
  }

  // =====================================================
  // LB 3 – Symmetrie & Spiegeln
  // =====================================================
  // Figuren: Eckpunkte um den Mittelpunkt (0|0), Symmetrieachsen als Winkel einer Geraden durch (0|0),
  // punkt: punktsymmetrisch zum Mittelpunkt?
  const reg = (n, r, start) => Array.from({ length: n }, (_, i) => { const a = ((start + (360 / n) * i) * Math.PI) / 180; return [Math.round(r * Math.cos(a) * 10) / 10, Math.round(-r * Math.sin(a) * 10) / 10]; });
  const stern = (() => { const o = reg(5, 44, 90), i = reg(5, 18, 126); return o.flatMap((p, k) => [p, i[k]]); })();
  const FIGUREN = {
    rechteck: { name: 'Rechteck', pts: [[-44, -26], [44, -26], [44, 26], [-44, 26]], achsen: [0, 90], punkt: true },
    quadrat: { name: 'Quadrat', pts: [[-36, -36], [36, -36], [36, 36], [-36, 36]], achsen: [0, 45, 90, 135], punkt: true },
    gleichseitig: { name: 'gleichseitiges Dreieck', pts: reg(3, 44, 90), achsen: [90, 30, 150], punkt: false },
    gleichschenklig: { name: 'gleichschenkliges Dreieck', pts: [[0, -42], [26, 36], [-26, 36]], achsen: [90], punkt: false },
    dreieck: { name: 'Dreieck', pts: [[-40, 30], [44, 30], [-12, -34]], achsen: [], punkt: false },
    drachen: { name: 'Drachenviereck', pts: [[0, -42], [28, -12], [0, 42], [-28, -12]], achsen: [90], punkt: false },
    raute: { name: 'Raute', pts: [[0, -34], [46, 0], [0, 34], [-46, 0]], achsen: [0, 90], punkt: true },
    parallelogramm: { name: 'Parallelogramm', pts: [[-24, -26], [48, -26], [24, 26], [-48, 26]], achsen: [], punkt: true },
    trapez: { name: 'gleichschenkliges Trapez', pts: [[-22, -26], [22, -26], [44, 26], [-44, 26]], achsen: [90], punkt: false },
    fuenfeck: { name: 'regelmäßiges Fünfeck', pts: reg(5, 42, 90), achsen: [90, 162, 54, 126, 18], punkt: false },
    sechseck: { name: 'regelmäßiges Sechseck', pts: reg(6, 42, 0), achsen: [0, 30, 60, 90, 120, 150], punkt: true },
    stern: { name: 'Stern mit fünf Zacken', pts: stern, achsen: [90, 162, 54, 126, 18], punkt: false },
    kreuz: { name: 'Kreuz', pts: [[-14, -42], [14, -42], [14, -14], [42, -14], [42, 14], [14, 14], [14, 42], [-14, 42], [-14, 14], [-42, 14], [-42, -14], [-14, -14]], achsen: [0, 45, 90, 135], punkt: true },
    pfeil: { name: 'Pfeil', pts: [[-44, -12], [6, -12], [6, -32], [44, 0], [6, 32], [6, 12], [-44, 12]], achsen: [0], punkt: false },
    zform: { name: 'Z-Form', pts: [[-40, -34], [12, -34], [12, 10], [40, 10], [40, 34], [-12, 34], [-12, -10], [-40, -10]], achsen: [], punkt: true },
    lform: { name: 'L-Form', pts: [[-30, -40], [-4, -40], [-4, 16], [34, 16], [34, 40], [-30, 40]], achsen: [], punkt: false },
  };
  M.symFiguren = FIGUREN;
  const figurBild = (id, achsen) => {
    const f = FIGUREN[id];
    const ax = (achsen ? f.achsen : []).map((w) => { const a = (w * Math.PI) / 180, c = Math.cos(a) * 62, s = -Math.sin(a) * 62; return `<line x1="${(100 - c).toFixed(1)}" y1="${(70 - s).toFixed(1)}" x2="${(100 + c).toFixed(1)}" y2="${(70 + s).toFixed(1)}" class="symax"/>`; }).join('');
    return `<svg viewBox="0 0 200 140"><polygon class="symfig" points="${f.pts.map(([x, y]) => `${100 + x},${70 + y}`).join(' ')}"/>${ax}</svg>`;
  };
  M.symBild = figurBild;
  // Koordinatengitter (1. Quadrant, wie im Thema Koordinatensystem) mit Extras
  const KS = 24, KOX = 34, KOY = 222;
  const kx = (x) => KOX + x * KS, ky = (y) => KOY - y * KS;
  function gitter(pts, extra) {
    let g = '';
    for (let i = 0; i <= 10; i++) g += `<line class="grid" x1="${kx(i)}" y1="${KOY}" x2="${kx(i)}" y2="${ky(8)}"/>`;
    for (let j = 0; j <= 8; j++) g += `<line class="grid" x1="${KOX}" y1="${ky(j)}" x2="${kx(10)}" y2="${ky(j)}"/>`;
    let ax = `<line class="axis" x1="${KOX}" y1="${KOY}" x2="${kx(10) + 12}" y2="${KOY}"/><line class="axis" x1="${KOX}" y1="${KOY}" x2="${KOX}" y2="${ky(8) - 12}"/>`;
    for (let i = 0; i <= 10; i++) ax += `<text class="tick" x="${kx(i)}" y="${KOY + 16}" text-anchor="middle">${i}</text>`;
    for (let j = 1; j <= 8; j++) ax += `<text class="tick" x="${KOX - 9}" y="${ky(j) + 4}" text-anchor="end">${j}</text>`;
    ax += `<text class="tick b" x="${kx(10) + 14}" y="${KOY + 16}">x</text><text class="tick b" x="${KOX + 8}" y="${ky(8) - 4}">y</text>`;
    const pnt = pts.map(([x, y, name, cls]) => `<circle class="pt${cls ? ' ' + cls : ''}" cx="${kx(x)}" cy="${ky(y)}" r="6"/><text class="ptl" x="${kx(x) + 8}" y="${ky(y) + (x === 0 && y >= 7 ? 20 : -8)}">${name}</text>`).join(''); // oben links steht schon das y der Achse
    return `<svg viewBox="0 0 300 245">${g}${ax}${extra || ''}${pnt}</svg>`;
  }
  const spiegelLinie = (achse, k) => (achse === 'v'
    ? `<line class="symax" x1="${kx(k)}" y1="${KOY + 4}" x2="${kx(k)}" y2="${ky(8) - 6}"/><text class="tick b" x="${kx(k) + 5}" y="${ky(8) - 2}" style="fill:var(--c3)">g</text>`
    : `<line class="symax" x1="${KOX - 4}" y1="${ky(k)}" x2="${kx(10) + 6}" y2="${ky(k)}"/><text class="tick b" x="${kx(10) - 4}" y="${ky(k) - 6}" style="fill:var(--c3)">g</text>`);
  // Drehung um Z: Vierteldrehung nach links/rechts oder halbe Drehung
  const drehe90 = (x, y, zx, zy, art) => (art === 'links' ? [zx - (y - zy), zy + (x - zx)] : art === 'rechts' ? [zx + (y - zy), zy - (x - zx)] : [2 * zx - x, 2 * zy - y]);
  M.drehe90 = drehe90;
  const richt = (dx, dy) => [dx ? `${Math.abs(dx)} nach ${dx > 0 ? 'rechts' : 'links'}` : '', dy ? `${Math.abs(dy)} nach ${dy > 0 ? 'oben' : 'unten'}` : ''].filter(Boolean).join(' und ');
  M.richt = richt;
  function drehung() {
    const art = pick(['links', 'links', 'rechts', 'halb']);
    let x, y, zx, zy, nx, ny;
    do { x = R(0, 10); y = R(0, 8); zx = R(2, 8); zy = R(2, 6); [nx, ny] = drehe90(x, y, zx, zy, art); } while (nx < 0 || nx > 10 || ny < 0 || ny > 8 || x === zx || y === zy);
    const wort = art === 'halb' ? 'eine <b>halbe Drehung (180°)</b>' : `eine <b>Vierteldrehung (90°) nach ${art}</b>`;
    const zusatz = art === 'links' ? ' (gegen den Uhrzeigersinn)' : art === 'rechts' ? ' (im Uhrzeigersinn)' : '';
    return {
      prompt: `Der Punkt <b>P(${x} | ${y})</b> wird um <b>Z(${zx} | ${zy})</b> gedreht: ${wort}${zusatz}. Welche Koordinaten hat <b>P′</b>?`,
      figure: gitter([[x, y, 'P'], [zx, zy, 'Z', 'z']]),
      layout: 'coord',
      fields: [{ answer: nx, label: 'x' }, { answer: ny, label: 'y' }],
      hint: art === 'halb' ? 'Eine halbe Drehung bringt P genau auf die andere Seite von Z: denselben Weg von Z aus noch einmal weitergehen.' : 'Merke dir den Weg von Z zu P (rechts/links und oben/unten). Dreh dein Heft in Gedanken um eine Vierteldrehung: Aus „nach rechts“ wird „nach oben“ oder „nach unten“.',
      solution: `Weg von Z zu P: ${richt(x - zx, y - zy)}.<br>Nach der Drehung: ${richt(nx - zx, ny - zy)}.<br>→ <b>P′(${nx} | ${ny})</b><br><small>Beim Drehen bleibt der Abstand zu Z gleich.</small>`,
      answerText: `P′(${nx} | ${ny})`,
      ex: { mode: 'dreh', x, y, zx, zy, art },
    };
  }
  function symmetrie() {
    if (R(1, 9) === 9) return drehung();
    const v = R(1, 8);
    if (v <= 2) {
      const id = pick(Object.keys(FIGUREN));
      const f = FIGUREN[id], n = f.achsen.length;
      return {
        prompt: `Wie viele <b>Symmetrieachsen</b> hat diese Figur (${f.name})?`,
        figure: figurBild(id),
        fields: [{ answer: n }],
        hint: 'Stell dir vor, du faltest die Figur. An einer Symmetrieachse liegen beide Hälften genau aufeinander.',
        solution: n ? `Die Figur hat <b>${n} ${n === 1 ? 'Symmetrieachse' : 'Symmetrieachsen'}</b>. ${n === 1 ? 'An ihr' : 'An jeder'} kannst du sie so falten, dass beide Hälften genau aufeinander liegen.` : `Die Figur hat <b>keine</b> Symmetrieachse: Wie du sie auch faltest, die Hälften passen nie aufeinander.${f.punkt ? ' Sie ist aber punktsymmetrisch: Eine halbe Drehung bringt sie auf sich selbst.' : ''}`,
        answerText: String(n),
        ex: { mode: 'achsen', id },
      };
    }
    if (v === 3) {
      const id = pick(Object.keys(FIGUREN));
      const f = FIGUREN[id], a = f.achsen.length > 0, p = f.punkt;
      const opts = ['nur achsensymmetrisch', 'nur punktsymmetrisch', 'beides', 'keins von beiden'];
      return {
        prompt: `Welche Symmetrie hat diese Figur (${f.name})?`,
        figure: figurBild(id),
        choices: opts,
        correct: a && p ? 2 : a ? 0 : p ? 1 : 3,
        hint: 'Achsensymmetrisch: Man kann sie so falten, dass beide Hälften aufeinander liegen. Punktsymmetrisch: Nach einer halben Drehung sieht sie genauso aus.',
        solution: `${a ? `Achsensymmetrisch: ja, mit ${f.achsen.length} ${f.achsen.length === 1 ? 'Achse' : 'Achsen'}.` : 'Achsensymmetrisch: nein, es gibt keine Faltlinie.'}<br>${p ? 'Punktsymmetrisch: ja, eine halbe Drehung um den Mittelpunkt bringt sie auf sich selbst.' : 'Punktsymmetrisch: nein, nach einer halben Drehung sieht sie anders aus.'}<br>→ <b>${opts[a && p ? 2 : a ? 0 : p ? 1 : 3]}</b>`,
        ex: { mode: 'achsen', id, punkt: true },
      };
    }
    if (v <= 6) {
      // Spiegeln an einer Geraden parallel zu einer Achse
      const achse = pick(['v', 'v', 'h']);
      let x, y, k, nx, ny;
      do {
        x = R(0, 10); y = R(0, 8); k = achse === 'v' ? R(2, 8) : R(2, 6);
        nx = achse === 'v' ? 2 * k - x : x; ny = achse === 'h' ? 2 * k - y : y;
      } while (nx < 0 || nx > 10 || ny < 0 || ny > 8 || (achse === 'v' ? x === k : y === k));
      const abst = achse === 'v' ? Math.abs(x - k) : Math.abs(y - k);
      return {
        prompt: `Der Punkt <b>P(${x} | ${y})</b> wird an der Geraden <b style="color:var(--c3)">g</b> gespiegelt. Welche Koordinaten hat der Bildpunkt <b>P′</b>?`,
        figure: gitter([[x, y, 'P']], spiegelLinie(achse, k)),
        layout: 'coord',
        fields: [{ answer: nx, label: 'x' }, { answer: ny, label: 'y' }],
        hint: 'Zähle die Kästchen von P bis zur Geraden g. Genauso weit geht es auf der anderen Seite weiter, immer senkrecht zu g.',
        solution: `P ist <b>${abst} Kästchen</b> von g entfernt. Auf der anderen Seite geht es ${abst} Kästchen weiter.<br>${achse === 'v' ? 'Der y-Wert bleibt gleich' : 'Der x-Wert bleibt gleich'} → <b>P′(${nx} | ${ny})</b>`,
        answerText: `P′(${nx} | ${ny})`,
        ex: { mode: 'spiegel', x, y, achse, k },
      };
    }
    if (v === 7) {
      // Punktspiegelung an Z
      let x, y, zx, zy, nx, ny;
      do { x = R(0, 10); y = R(0, 8); zx = R(2, 8); zy = R(2, 6); nx = 2 * zx - x; ny = 2 * zy - y; } while (nx < 0 || nx > 10 || ny < 0 || ny > 8 || (x === zx && y === zy) || x === zx || y === zy);
      return {
        prompt: `Der Punkt <b>P(${x} | ${y})</b> wird am Punkt <b>Z(${zx} | ${zy})</b> gespiegelt (Punktspiegelung). Welche Koordinaten hat <b>P′</b>?`,
        figure: gitter([[x, y, 'P'], [zx, zy, 'Z', 'z']]),
        layout: 'coord',
        fields: [{ answer: nx, label: 'x' }, { answer: ny, label: 'y' }],
        hint: 'Geh von P zu Z und merke dir den Weg (wie viele Kästchen nach rechts oder links, wie viele nach oben oder unten). Von Z aus gehst du denselben Weg noch einmal.',
        solution: `Von P nach Z: ${Math.abs(zx - x)} nach ${zx > x ? 'rechts' : 'links'}, ${Math.abs(zy - y)} nach ${zy > y ? 'oben' : 'unten'}.<br>Denselben Weg von Z aus noch einmal → <b>P′(${nx} | ${ny})</b><br><small>Z liegt genau in der Mitte zwischen P und P′.</small>`,
        answerText: `P′(${nx} | ${ny})`,
        ex: { mode: 'punkt', x, y, zx, zy },
      };
    }
    // Verschiebung rückwärts: Wie wurde verschoben?
    let x, y, dx, dy;
    do { x = R(0, 9); y = R(0, 7); dx = R(-6, 6); dy = R(-5, 5); } while (!dx || !dy || x + dx < 0 || x + dx > 10 || y + dy < 0 || y + dy > 8);
    return {
      prompt: `Der Punkt <b>A(${x} | ${y})</b> wird nach <b>A′(${x + dx} | ${y + dy})</b> verschoben. Um wie viele Kästchen geht es nach <b>${dx > 0 ? 'rechts' : 'links'}</b> und nach <b>${dy > 0 ? 'oben' : 'unten'}</b>?`,
      figure: gitter([[x, y, 'A'], [x + dx, y + dy, 'A′', 'z']]),
      fields: [{ answer: Math.abs(dx), label: `nach ${dx > 0 ? 'rechts' : 'links'}` }, { answer: Math.abs(dy), label: `nach ${dy > 0 ? 'oben' : 'unten'}` }],
      hint: 'Vergleiche die x-Werte (rechts/links) und die y-Werte (oben/unten) der beiden Punkte.',
      solution: `x: von ${x} nach ${x + dx} sind <b>${Math.abs(dx)}</b> nach ${dx > 0 ? 'rechts' : 'links'}.<br>y: von ${y} nach ${y + dy} sind <b>${Math.abs(dy)}</b> nach ${dy > 0 ? 'oben' : 'unten'}.<br><small>Bei einer Verschiebung wandert jeder Punkt der Figur genau gleich weit in dieselbe Richtung.</small>`,
      answerText: `${Math.abs(dx)} nach ${dx > 0 ? 'rechts' : 'links'}, ${Math.abs(dy)} nach ${dy > 0 ? 'oben' : 'unten'}`,
      ex: { mode: 'schieb', x, y, dx, dy },
    };
  }

  // =====================================================
  // LB 4 – Würfelnetze & Baupläne
  // =====================================================
  const netz = (s) => s.split('/').flatMap((row, r) => row.split('').map((c, i) => (c === '1' ? [r, i] : null)).filter(Boolean));
  const NETZE_JA = ['1000/1111/1000', '1000/1111/0100', '1000/1111/0010', '1000/1111/0001', '0100/1111/0100', '0100/1111/0010',
    '1100/0111/0100', '1100/0111/0010', '1100/0111/0001', '11100/00111', '1100/0110/0011'].map(netz);
  const NETZE_NEIN = ['111111', '111/111', '11111/00100', '11111/10000', '1001/1111', '1010/1111', '1100/1111', '0110/1111', '1110/0111', '1111/0011'].map(netz);
  // Würfel über das Netz „abrollen“: Jede Zelle bekommt die Würfelseite, auf der sie landet (0–5; gegenüber: 0/1, 2/3, 4/5)
  function falten(cells) {
    const key = (r, c) => r + ',' + c, has = new Set(cells.map(([r, c]) => key(r, c)));
    const face = {}; // key → Seite
    const start = cells[0];
    const queue = [[start[0], start[1], [0, 1, 2, 3, 4, 5]]]; // [oben, unten, nord, süd, ost, west]
    face[key(start[0], start[1])] = 1;
    while (queue.length) {
      const [r, c, o] = queue.shift();
      const [Uu, D, N, S, E, W] = o;
      const moves = [[0, 1, [W, E, N, S, Uu, D]], [0, -1, [E, W, N, S, D, Uu]], [-1, 0, [S, N, Uu, D, E, W]], [1, 0, [N, S, D, Uu, E, W]]];
      for (const [dr, dc, no] of moves) {
        const k = key(r + dr, c + dc);
        if (has.has(k) && !(k in face)) { face[k] = no[1]; queue.push([r + dr, c + dc, no]); }
      }
    }
    return cells.map(([r, c]) => face[key(r, c)]);
  }
  M.netzFalten = falten;
  const istNetz = (cells) => new Set(falten(cells)).size === 6;
  // Netz zufällig drehen und spiegeln, dann an die linke obere Ecke schieben
  function drehe(cells) {
    let cs = cells.map(([r, c]) => [r, c]);
    for (let i = R(0, 3); i > 0; i--) cs = cs.map(([r, c]) => [c, -r]);
    if (R(0, 1)) cs = cs.map(([r, c]) => [r, -c]);
    const mr = Math.min(...cs.map((p) => p[0])), mc = Math.min(...cs.map((p) => p[1]));
    return cs.map(([r, c]) => [r - mr, c - mc]).sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  }
  function netzBild(cells, labels, mark) {
    const rows = Math.max(...cells.map((p) => p[0])) + 1, cols = Math.max(...cells.map((p) => p[1])) + 1;
    const s = Math.min(38, Math.floor(260 / cols), Math.floor(170 / rows));
    const ox = (300 - cols * s) / 2, oy = (190 - rows * s) / 2;
    return `<svg viewBox="0 0 300 190">${cells.map(([r, c], i) => `<rect class="netz${mark && mark.includes(i) ? ' on' : ''}" x="${ox + c * s}" y="${oy + r * s}" width="${s}" height="${s}"/>${labels ? `<text class="netzt" x="${ox + c * s + s / 2}" y="${oy + r * s + s / 2 + 6}" text-anchor="middle">${labels[i]}</text>` : ''}`).join('')}</svg>`;
  }
  M.netzBild = netzBild;
  // Würfelgebäude als Bauplan (Zahlen = Höhe) und als Schrägbild
  function bauBild(h) {
    const rows = h.length, cols = h[0].length, s = 26;
    let plan = '';
    h.forEach((row, r) => row.forEach((v, c) => { plan += `<rect class="netz" x="${14 + c * s}" y="${56 + r * s}" width="${s}" height="${s}"/><text class="netzt" x="${14 + c * s + s / 2}" y="${56 + r * s + s / 2 + 6}" text-anchor="middle">${v}</text>`; }));
    plan += `<text class="tick b" x="12" y="30">Bauplan</text><text class="tick" x="12" y="46">(von oben)</text><text class="tick" x="${14 + (cols * s) / 2}" y="${56 + rows * s + 16}" text-anchor="middle">vorn</text>`;
    // Schrägbild: von hinten nach vorn, von links nach rechts, von unten nach oben zeichnen
    const a = 20, dx = 10, dy = 8, bx = 150, by = 150;
    let iso = '';
    for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) for (let z = 0; z < h[r][c]; z++) {
      const x = bx + c * a + (rows - 1 - r) * dx, y = by - z * a - (rows - 1 - r) * dy;
      iso += `<polygon class="wf" points="${x},${y} ${x + a},${y} ${x + a},${y - a} ${x},${y - a}"/>`
        + `<polygon class="wt" points="${x},${y - a} ${x + a},${y - a} ${x + a + dx},${y - a - dy} ${x + dx},${y - a - dy}"/>`
        + `<polygon class="ws" points="${x + a},${y} ${x + a + dx},${y - dy} ${x + a + dx},${y - a - dy} ${x + a},${y - a}"/>`;
    }
    return `<svg viewBox="0 0 300 190">${plan}${iso}</svg>`;
  }
  M.bauBild = bauBild;
  // Quadernetz: Mittelstreifen links–vorn–rechts–hinten, Deckel über und Boden unter „vorn“
  function qnetzFlaechen(a, b, c) {
    const s = Math.min(16, 236 / (2 * a + 2 * c), 150 / (b + 2 * c));
    const ox = (300 - (2 * a + 2 * c) * s) / 2 + 20, oy = (190 - (b + 2 * c) * s) / 2 + 6;
    const F = [
      { id: 'links', x: 0, y: c, w: c, h: b }, { id: 'vorn', x: c, y: c, w: a, h: b }, { id: 'rechts', x: c + a, y: c, w: c, h: b }, { id: 'hinten', x: 2 * c + a, y: c, w: a, h: b },
      { id: 'oben', x: c, y: 0, w: a, h: c }, { id: 'unten', x: c, y: c + b, w: a, h: c },
    ].map((f) => ({ ...f, px: ox + f.x * s, py: oy + f.y * s, pw: f.w * s, ph: f.h * s }));
    return { F, s, ox, oy };
  }
  M.qnetzFlaechen = qnetzFlaechen;
  function qnetzBild(a, b, c, mark) {
    const { F, s, ox, oy } = qnetzFlaechen(a, b, c);
    const fl = F.map((f) => `<rect class="netz${f.id === mark ? ' on' : ''}" x="${f.px}" y="${f.py}" width="${f.pw}" height="${f.ph}"/>`).join('');
    // Maße an drei Kanten: a über dem Deckel, c links am Deckel, b links am Mittelstreifen
    const m = `<text class="tick b" x="${ox + (c + a / 2) * s}" y="${oy - 5}" text-anchor="middle">${a} cm</text>`
      + `<text class="tick b" x="${ox + c * s - 5}" y="${oy + (c / 2) * s + 4}" text-anchor="end">${c} cm</text>`
      + `<text class="tick b" x="${ox - 5}" y="${oy + (c + b / 2) * s + 4}" text-anchor="end">${b} cm</text>`;
    return `<svg viewBox="0 0 300 190">${fl}${m}</svg>`;
  }
  function qnetz() {
    let a, b, c;
    do { a = R(3, 7); b = R(2, 6); c = R(2, 4); } while (a === b || b === c || a === c);
    if (R(0, 1)) {
      const id = pick(['vorn', 'links', 'oben', 'hinten', 'rechts', 'unten']);
      const [w, h] = id === 'vorn' || id === 'hinten' ? [a, b] : id === 'links' || id === 'rechts' ? [c, b] : [a, c];
      return {
        prompt: 'Das ist das <b>Netz eines Quaders</b>. Wie groß ist die <b>gelb markierte Fläche</b>?',
        figure: qnetzBild(a, b, c, id),
        fields: [{ answer: w * h, suffix: 'cm²' }],
        hint: 'Suche die beiden Seitenlängen der gelben Fläche. Kanten, die beim Falten aufeinandertreffen, sind gleich lang.',
        solution: `Die gelbe Fläche ist <b>${w} cm</b> und <b>${h} cm</b> lang.<br>${w} · ${h} = <b>${w * h} cm²</b><br><small>Im Quadernetz kommt jede Fläche zweimal vor: Die gegenüberliegende ist genauso groß.</small>`,
        ex: { mode: 'qnetz', a, b, c, id },
      };
    }
    const O = 2 * (a * b + c * b + a * c);
    return {
      prompt: 'Das ist das <b>Netz eines Quaders</b>. Wie viel Papier braucht man für das <b>ganze Netz</b>?',
      figure: qnetzBild(a, b, c),
      fields: [{ answer: O, suffix: 'cm²' }],
      hint: 'Das Netz hat 6 Rechtecke, je zwei sind gleich groß. Berechne die drei verschiedenen Flächen und nimm jede doppelt.',
      solution: `Drei verschiedene Flächen: ${a} · ${b} = ${a * b}, ${c} · ${b} = ${c * b}, ${a} · ${c} = ${a * c}<br>Jede kommt zweimal vor: 2 · (${a * b} + ${c * b} + ${a * c}) = <b>${O} cm²</b><br><small>Das ist die Oberfläche des Quaders.</small>`,
      ex: { mode: 'qnetz', a, b, c },
    };
  }
  // Schrägbild: vorn in echter Größe, Kanten nach hinten unter 45° und halb so lang
  function schraegBild(a, b, c, text) {
    const s = Math.min(22, 150 / (a + c * 0.36), 120 / (b + c * 0.36));
    const dx = c * s * 0.5 * Math.SQRT1_2, dy = dx;
    // die Beschriftung rechts („2,5 cm gezeichnet“) muss ins Bild passen: notfalls rückt der Quader nach links
    const rechts = text ? String(text[2]).length * 7.2 + 14 : 0;
    const x0 = Math.max(text ? String(text[1]).length * 7.2 + 10 : 4, Math.min((300 - (a * s + dx)) / 2, 300 - (a * s + dx / 2 + 8) - rechts)), y0 = (190 + (b * s + dy)) / 2 - 4;
    const P = (x, y, z) => `${(x0 + x * s + (z ? dx : 0)).toFixed(1)},${(y0 - y * s - (z ? dy : 0)).toFixed(1)}`;
    const L = (p, q, cls) => { const [x1, y1] = p.split(','), [x2, y2] = q.split(','); return `<line class="${cls}" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"/>`; };
    let g = `<polygon class="wt" points="${P(0, b, 0)} ${P(a, b, 0)} ${P(a, b, 1)} ${P(0, b, 1)}"/><polygon class="ws" points="${P(a, 0, 0)} ${P(a, 0, 1)} ${P(a, b, 1)} ${P(a, b, 0)}"/><polygon class="wf" points="${P(0, 0, 0)} ${P(a, 0, 0)} ${P(a, b, 0)} ${P(0, b, 0)}"/>`;
    g += L(P(0, 0, 0), P(0, 0, 1), 'dash') + L(P(0, 0, 1), P(a, 0, 1), 'dash') + L(P(0, 0, 1), P(0, b, 1), 'dash');
    if (text) g += `<text class="tick b" x="${x0 + (a * s) / 2}" y="${y0 + 16}" text-anchor="middle">${text[0]}</text><text class="tick b" x="${x0 - 6}" y="${y0 - (b * s) / 2 + 4}" text-anchor="end">${text[1]}</text><text class="tick b" x="${x0 + a * s + dx / 2 + 8}" y="${y0 - dy / 2 + 6}">${text[2]}</text>`;
    return `<svg viewBox="0 0 300 190">${g}</svg>`;
  }
  M.schraegBild = schraegBild;
  function schraeg() {
    const v = R(1, 4);
    const a = R(3, 7), b = R(2, 5), c = pick([2, 3, 4, 5, 6, 8]);
    if (v === 1) {
      return {
        prompt: `Ein Quader ist <b>${a} cm breit</b>, <b>${b} cm hoch</b> und <b>${c} cm tief</b>. Im <b>Schrägbild</b> zeichnest du die Kanten nach hinten schräg und nur <b>halb so lang</b>. Wie lang zeichnest du die schräge Kante?`,
        figure: schraegBild(a, b, c, [`${a} cm`, `${b} cm`, '?']),
        fields: [{ answer: c / 2, suffix: 'cm' }],
        hint: 'Breite und Höhe zeichnest du in echter Länge. Nur die Tiefe wird halbiert.',
        solution: `Die Tiefe wird halbiert: ${c} cm : 2 = <b>${fmt(c / 2)} cm</b><br><small>Breite (${a} cm) und Höhe (${b} cm) bleiben, wie sie sind. So wirkt das Bild räumlich.</small>`,
        ex: { mode: 'schraeg', a, b, c },
      };
    }
    if (v === 2) {
      return {
        prompt: `In einem <b>Schrägbild</b> ist die schräge Kante nach hinten <b>${fmt(c / 2)} cm</b> lang gezeichnet. Wie tief ist der Quader <b>in Wirklichkeit</b>?`,
        figure: schraegBild(a, b, c, [`${a} cm`, `${b} cm`, `${fmt(c / 2)} cm gezeichnet`]),
        fields: [{ answer: c, suffix: 'cm' }],
        hint: 'Im Schrägbild werden Kanten nach hinten nur halb so lang gezeichnet. Die echte Länge ist also doppelt so groß.',
        solution: `Gezeichnet ist die halbe Länge, also: ${fmt(c / 2)} cm · 2 = <b>${c} cm</b>`,
        ex: { mode: 'schraeg', a, b, c },
      };
    }
    if (v === 3) {
      const frage = pick([['in echter Länge', 8, 'Die 4 Kanten vorn und die 4 Kanten hinten: 4 + 4 = <b>8</b>. Nur die 4 Kanten nach hinten sind verkürzt.'], ['verkürzt (halb so lang)', 4, 'Nur die <b>4</b> Kanten, die nach hinten laufen. Die 8 Kanten vorn und hinten haben ihre echte Länge.'], ['gestrichelt, weil man sie nicht sieht', 3, 'Die <b>3</b> Kanten, die an der hinteren unteren linken Ecke zusammenlaufen, sind verdeckt.']]);
      return {
        prompt: `Ein Quader hat 12 Kanten. Wie viele davon zeichnest du im <b>Schrägbild</b> <b>${frage[0]}</b>?`,
        figure: schraegBild(a, b, c),
        fields: [{ answer: frage[1], suffix: 'Kanten' }],
        hint: 'Zähle im Bild nach: vorn, hinten und die Kanten, die nach hinten laufen.',
        solution: frage[2],
        ex: { mode: 'schraeg', a, b, c },
      };
    }
    return {
      prompt: 'Wie viele <b>Ecken</b>, <b>Kanten</b> und <b>Flächen</b> hat ein Quader?',
      figure: schraegBild(a, b, c),
      fields: [{ answer: 8, label: 'Ecken' }, { answer: 12, label: 'Kanten' }, { answer: 6, label: 'Flächen' }],
      hint: 'Zähle im Schrägbild. Vergiss die gestrichelten Kanten und die verdeckte Ecke nicht.',
      solution: '<b>8 Ecken</b> (4 vorn, 4 hinten), <b>12 Kanten</b> (4 vorn, 4 hinten, 4 nach hinten) und <b>6 Flächen</b> (vorn/hinten, links/rechts, oben/unten).',
      answerText: '8 Ecken, 12 Kanten, 6 Flächen',
      ex: { mode: 'schraeg', a, b, c },
    };
  }
  function netze() {
    const art = R(1, 11);
    if (art >= 10) return schraeg();
    if (art >= 8) return qnetz();
    const v = R(1, 7);
    if (v <= 3) {
      const ja = R(0, 1) === 1;
      const cells = drehe(pick(ja ? NETZE_JA : NETZE_NEIN));
      const seiten = falten(cells);
      let grund = '';
      if (!ja) {
        const doppelt = seiten.find((s, i) => seiten.indexOf(s) !== i);
        const idx = seiten.map((s, i) => (s === doppelt ? i : -1)).filter((i) => i >= 0);
        grund = `Beim Falten landen ${idx.length} Quadrate auf derselben Würfelseite, dafür bleibt eine Seite offen.`;
        return {
          prompt: 'Kann man aus dieser Figur einen <b>Würfel</b> falten?',
          figure: netzBild(cells),
          choices: ['Ja, das ist ein Würfelnetz', 'Nein, das klappt nicht'],
          correct: 1,
          hint: 'Ein Würfel hat 6 Seiten. Falte in Gedanken: Dabei darf kein Quadrat auf einem anderen landen.',
          solution: `<b>Nein.</b> ${grund}<br><small>Merke: Vier Quadrate, die einen 2 × 2-Block bilden, oder fünf in einer Reihe gehen nie.</small>`,
          ex: { mode: 'netz', cells },
        };
      }
      return {
        prompt: 'Kann man aus dieser Figur einen <b>Würfel</b> falten?',
        figure: netzBild(cells),
        choices: ['Ja, das ist ein Würfelnetz', 'Nein, das klappt nicht'],
        correct: 0,
        hint: 'Ein Würfel hat 6 Seiten. Falte in Gedanken: Dabei darf kein Quadrat auf einem anderen landen.',
        solution: '<b>Ja.</b> Beim Falten landet jedes der 6 Quadrate auf einer anderen Würfelseite: Boden, Deckel und vier Seitenwände.',
        ex: { mode: 'netz', cells },
      };
    }
    if (v <= 5) {
      const cells = drehe(pick(NETZE_JA));
      const seiten = falten(cells);
      const labels = shuffle(['A', 'B', 'C', 'D', 'E', 'F']);
      const i = R(0, 5);
      const j = seiten.findIndex((s) => s === (seiten[i] ^ 1));
      const andere = shuffle([0, 1, 2, 3, 4, 5].filter((k) => k !== i && k !== j)).slice(0, 3);
      const opts = shuffle([j, ...andere]);
      return {
        prompt: `Das Netz wird zu einem Würfel gefaltet. Welche Fläche liegt dann <b>gegenüber</b> von <b>${labels[i]}</b>?`,
        figure: netzBild(cells, labels, [i]),
        choices: opts.map((k) => labels[k]),
        correct: opts.indexOf(j),
        hint: 'Flächen, die im Netz direkt aneinander stoßen, sind am Würfel Nachbarn und nie gegenüber. In einer geraden Reihe liegt immer die übernächste Fläche gegenüber.',
        solution: `Gegenüber von ${labels[i]} liegt <b>${labels[j]}</b>.<br><small>In einer geraden Reihe ist die übernächste Fläche die gegenüberliegende. Alle Flächen, die ${labels[i]} berühren, werden zu Nachbarn.</small>`,
        ex: { mode: 'gegen', cells, labels, i, j },
      };
    }
    // Würfelgebäude nach Bauplan
    const rows = 3, cols = 3;
    let h;
    do h = Array.from({ length: rows }, () => Array.from({ length: cols }, () => pick([0, 1, 1, 2, 2, 3]))); while (h.flat().filter(Boolean).length < 5);
    const summe = h.flat().reduce((a, b) => a + b, 0);
    if (v === 6) {
      return {
        prompt: 'Ein Würfelgebäude wird nach diesem <b>Bauplan</b> gebaut. Die Zahlen sagen, wie viele Würfel übereinander stehen. Wie viele Würfel braucht man <b>insgesamt</b>?',
        figure: bauBild(h),
        fields: [{ answer: summe, suffix: 'Würfel' }],
        hint: 'Zähle alle Zahlen im Bauplan zusammen. Im Schrägbild sind manche Würfel verdeckt!',
        solution: `${h.map((row) => row.join(' + ')).join(' + ')} = <b>${summe} Würfel</b><br><small>Im Schrägbild sieht man nicht alle: Hinter hohen Türmen sind Würfel versteckt. Der Bauplan zeigt sie alle.</small>`,
        ex: { mode: 'bau', h },
      };
    }
    const vorn = h[0].map((_, c) => Math.max(...h.map((row) => row[c])));
    const sicht = vorn.reduce((a, b) => a + b, 0);
    return {
      prompt: 'Du schaust genau <b>von vorn</b> auf dieses Würfelgebäude. Wie viele <b>Würfelflächen</b> (Quadrate) siehst du?',
      figure: bauBild(h),
      fields: [{ answer: sicht, suffix: 'Quadrate' }],
      hint: 'Von vorn zählt in jeder Spalte nur der höchste Turm. Alles Niedrigere davor oder dahinter verschwindet in der Ansicht.',
      solution: `Höchster Turm je Spalte (von links): ${vorn.join(', ')}<br>${vorn.join(' + ')} = <b>${sicht} Quadrate</b><br><small>Die Ansicht von vorn zeigt nur, wie hoch jede Spalte ist, nicht wie tief das Gebäude ist.</small>`,
      ex: { mode: 'bau', h, vorn: true },
    };
  }

  // =====================================================
  // LB 5 – Schätzen wie Fermi
  // =====================================================
  // Jede Frage: bekannte Größen, geschätzte Größen, Rechnung mit runden Zahlen, Größenordnung
  const FERMI = [
    () => ({ frage: 'Wie oft schlägt dein Herz ungefähr an <b>einem Tag</b>?', weiss: 'Ein Tag hat 24 Stunden, eine Stunde 60 Minuten.', schaetz: 'Das Herz schlägt etwa 70-mal pro Minute.', rechnung: ['70 · 60 = 4 200 Schläge pro Stunde', '4 200 · 24 ≈ 4 000 · 25 = 100 000'], erg: 100000, einheit: 'Schläge' }),
    () => { const km = R(1, 3); return { frage: `Dein Schulweg ist <b>${km} km</b> lang. Wie viele Schritte brauchst du ungefähr?`, weiss: `${km} km sind ${fmt(km * 1000)} m.`, schaetz: 'Ein Schritt ist etwa 60 bis 70 cm lang. Für 1 m braucht man also rund 1,5 Schritte.', rechnung: [`1 km ≈ 1 500 Schritte`, `${km} · 1 500 = ${fmt(km * 1500)}`], erg: km * 1500, einheit: 'Schritte' }; },
    () => ({ frage: 'Wie viele <b>Stunden</b> hat ein Jahr ungefähr?', weiss: 'Ein Jahr hat 365 Tage, ein Tag 24 Stunden.', schaetz: 'Zum Rechnen runden: 365 ≈ 400 ist zu grob, besser 365 ≈ 360.', rechnung: ['360 · 24 ≈ 360 · 25 = 9 000'], erg: 9000, einheit: 'Stunden' }),
    () => { const a = R(10, 12); return { frage: `Wie viele <b>Tage</b> hast du ungefähr schon gelebt, wenn du ${a} Jahre alt wirst?`, weiss: 'Ein Jahr hat 365 Tage.', schaetz: `Zum Rechnen runden: 365 ≈ 400.`, rechnung: [`${a} · 400 = ${fmt(a * 400)}`, `Das ist etwas zu viel, also rund ${fmt(Math.round((a * 365) / 1000) * 1000)}`], erg: Math.round((a * 365) / 1000) * 1000, einheit: 'Tage' }; },
    () => ({ frage: 'Wie viele <b>Liter</b> trinkt ein Mensch ungefähr in einem Jahr?', weiss: 'Ein Jahr hat 365 Tage.', schaetz: 'Man trinkt etwa 1,5 bis 2 Liter am Tag.', rechnung: ['2 · 365 ≈ 2 · 350 = 700'], erg: 700, einheit: 'Liter' }),
    () => ({ frage: 'Wie viele <b>Schulstunden</b> hast du ungefähr in einem Schuljahr?', weiss: 'Ein Schuljahr hat etwa 38 Schulwochen.', schaetz: 'In Klasse 5 sind es etwa 30 Stunden pro Woche.', rechnung: ['30 · 38 ≈ 30 · 40 = 1 200'], erg: 1200, einheit: 'Schulstunden' }),
    () => ({ frage: 'Wie viele <b>Sekunden</b> hat ein Tag ungefähr?', weiss: '1 Minute = 60 s, 1 Stunde = 60 min, 1 Tag = 24 h.', schaetz: 'Hier muss man nichts schätzen, nur geschickt runden.', rechnung: ['60 · 60 = 3 600 Sekunden pro Stunde', '3 600 · 24 ≈ 3 600 · 25 = 90 000'], erg: 90000, einheit: 'Sekunden' }),
    () => ({ frage: 'Wie viele <b>1-Liter-Flaschen</b> Wasser passen ungefähr in eine volle Badewanne?', weiss: '1 Liter füllt einen Würfel mit 10 cm Kantenlänge.', schaetz: 'Eine Wanne ist innen etwa 150 cm lang, 50 cm breit und 20 cm hoch gefüllt.', rechnung: ['15 · 5 · 2 Würfel mit 10 cm Kante', '15 · 5 · 2 = 150'], erg: 150, einheit: 'Flaschen' }),
    () => ({ frage: 'Wie viele <b>Reiskörner</b> sind ungefähr in einer 1-kg-Packung?', weiss: '1 kg = 1 000 g.', schaetz: 'Etwa 50 Reiskörner wiegen zusammen 1 g.', rechnung: ['1 000 · 50 = 50 000'], erg: 50000, einheit: 'Körner' }),
    () => ({ frage: 'Wie oft atmest du ungefähr an <b>einem Tag</b>?', weiss: 'Ein Tag hat 24 · 60 = 1 440 Minuten, also rund 1 500.', schaetz: 'In Ruhe atmet man etwa 15-mal pro Minute.', rechnung: ['1 500 · 15 ≈ 1 500 · 10 + 1 500 · 5', '15 000 + 7 500 ≈ 20 000'], erg: 20000, einheit: 'Atemzüge' }),
    () => ({ frage: 'Ein Stapel mit 500 Blatt Papier ist 5 cm hoch. Wie hoch wäre ein Stapel mit <b>1 Million Blatt</b>?', weiss: '500 Blatt sind 5 cm hoch, also 100 Blatt 1 cm.', schaetz: 'Nichts zu schätzen: 1 000 000 Blatt sind 10 000-mal 100 Blatt.', rechnung: ['10 000 · 1 cm = 10 000 cm', '10 000 cm = 100 m'], erg: 100, einheit: 'm', opts: ['etwa 10 m', 'etwa 100 m', 'etwa 1 km'] }),
    () => { const n = pick([25, 28, 30]); return { frage: `Alle <b>${n} Kinder</b> deiner Klasse stellen sich mit ausgestreckten Armen in eine Reihe. Wie lang ist die Reihe ungefähr?`, weiss: `Es sind ${n} Kinder.`, schaetz: 'Die Spannweite der Arme ist etwa so groß wie das Kind: rund 1,5 m.', rechnung: [`${n} · 1,5 m = ${fmt(n * 1.5)} m`, `rund ${Math.round((n * 1.5) / 10) * 10} m`], erg: Math.round((n * 1.5) / 10) * 10, einheit: 'm', opts: [`etwa ${Math.round((n * 1.5) / 10)} m`, `etwa ${Math.round((n * 1.5) / 10) * 10} m`, `etwa ${Math.round((n * 1.5) / 10) * 100} m`] }; },
  ];
  function fermi() {
    const f = pick(FERMI)();
    // Tausender-Lücken dürfen nicht umbrechen
    const nb = (t) => t.replace(/(?<!\d)(\d) (\d{3})(?! ?\d)/g, '$1$2').replace(/(\d) (?=\d{3})/g, '$1\u202F'); // vierstellige Zahlen ohne Lücke, wie überall in der App
    ['frage', 'weiss', 'schaetz'].forEach((k) => (f[k] = nb(f[k]))); f.rechnung = f.rechnung.map(nb);
    const opts = f.opts || [`etwa ${fmt(f.erg / 10)}`, `etwa ${fmt(f.erg)}`, `etwa ${fmt(f.erg * 10)}`];
    const order = shuffle([0, 1, 2]);
    return {
      prompt: `${f.frage}<br><small>Schätze die Größenordnung. Es kommt nicht auf die genaue Zahl an.</small>`,
      choices: order.map((i) => opts[i]),
      correct: order.indexOf(1),
      hint: `${f.schaetz} Rechne mit runden Zahlen.`,
      solution: `<b>Was weiß ich?</b> ${f.weiss}<br><b>Was schätze ich?</b> ${f.schaetz}<br><b>Rechnen mit runden Zahlen:</b> ${f.rechnung.join(' → ')}<br>→ <b>${opts[1]}${f.opts ? '' : ' ' + f.einheit}</b>`,
      ex: { mode: 'fermi', frage: f.frage, weiss: f.weiss, schaetz: f.schaetz, rechnung: f.rechnung, antwort: opts[1] + (f.opts ? '' : ' ' + f.einheit) },
    };
  }

  // =====================================================
  // In die Lernbereiche einhängen
  // =====================================================
  const lb = (nr) => M.grades[5].lbs.find((l) => l.nr === nr).topics;
  const nach = (nr, id, topic) => { const t = lb(nr); const i = t.findIndex((x) => x.id === id); t.splice(i < 0 ? t.length : i + 1, 0, topic); };
  nach(1, 'k5-runden', { id: 'k5-ueberschlag', title: 'Überschlagen', icon: '≈', gen: ueberschlag });
  nach(1, 'k5-ueberschlag', { id: 'k5-schriftlich', title: 'Schriftlich rechnen', icon: '+', gen: schriftlich });
  nach(2, 'k5-erweitern', { id: 'k5-gemischt', title: 'Gemischte Zahlen', icon: '1½', gen: gemischt });
  nach(2, 'k5-dezimal', { id: 'k5-dezrunden', title: 'Dezimalzahlen runden', icon: '≈', gen: dezRunden });
  nach(3, 'k5-winkelpaar', { id: 'k5-symmetrie', title: 'Symmetrie & Spiegeln', icon: '⇆', gen: symmetrie });
  nach(4, 'k5-quader', { id: 'k5-netze', title: 'Netze & Schrägbilder', icon: '▦', gen: netze });
  nach(5, 'k5-sach', { id: 'k5-fermi', title: 'Schätzen wie Fermi', icon: '?', gen: fermi });
  M.netzTest = { NETZE_JA, NETZE_NEIN, istNetz };
})();
