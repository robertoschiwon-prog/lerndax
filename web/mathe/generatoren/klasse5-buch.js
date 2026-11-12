/* MaDax (Mathe) – Klasse 5, Abgleich mit dem Schulbuch (Lambacher Schweizer 5, Ausgabe Sachsen)
 *
 * Drei Themen, zu denen es im Buch eigene Lerneinheiten gibt und die in MaDax noch fehlten:
 *   Kap. I, 1–2:  Große Zahlen & Zahlenstrahl (ordnen, Stellenwerttafel, Zahlenstrahl)
 *   Kap. II, 3–6: Brüche am Zahlenstrahl (ablesen, vergleichen, Bruch als Quotient)
 *   Kap. IV, 1:   Senkrecht & parallel
 * Außerdem bringt diese Datei alle Themen in die Reihenfolge des Schulbuchs (ganz unten).
 * Wird NACH klasse5.js und klasse5-luecken.js geladen.
 */
(function () {
  const M = window.Mathelix;
  const U = M.util;
  const { R, pick, shuffle, gcd, fmt, fr } = U;

  // =====================================================
  // Große Zahlen & Zahlenstrahl
  // =====================================================
  const STELLEN = ['Einer', 'Zehner', 'Hunderter', 'Tausender', 'Zehntausender', 'Hunderttausender', 'Millionen', 'Zehnmillionen', 'Hundertmillionen'];
  M.STELLEN = STELLEN;
  // Zahlwort bis 999 999 999
  const EINER = ['', 'ein', 'zwei', 'drei', 'vier', 'fünf', 'sechs', 'sieben', 'acht', 'neun', 'zehn', 'elf', 'zwölf', 'dreizehn', 'vierzehn', 'fünfzehn', 'sechzehn', 'siebzehn', 'achtzehn', 'neunzehn'];
  const ZEHNER = ['', '', 'zwanzig', 'dreißig', 'vierzig', 'fünfzig', 'sechzig', 'siebzig', 'achtzig', 'neunzig'];
  function bis999(n) {
    const h = Math.floor(n / 100), r = n % 100;
    let s = h ? EINER[h] + 'hundert' : '';
    if (r < 20) s += EINER[r];
    else s += (r % 10 ? EINER[r % 10] + 'und' : '') + ZEHNER[Math.floor(r / 10)];
    return s;
  }
  function zahlwort(n) {
    const mio = Math.floor(n / 1e6), tsd = Math.floor(n / 1000) % 1000, rest = n % 1000;
    const teile = [];
    if (mio) teile.push(mio === 1 ? 'eine Million' : bis999(mio) + ' Millionen');
    let klein = '';
    if (tsd) klein += bis999(tsd) + 'tausend';
    if (rest) klein += rest === 1 ? 'eins' : bis999(rest);
    if (klein) teile.push(klein);
    return teile.join(' ');
  }
  M.zahlwort = zahlwort;
  // Zahlenstrahl mit 10 Schritten: beschriftet sind nur Anfang und Ende
  function strahlBild(a, step, k) {
    const X = (i) => 22 + i * 25.6, y = 60;
    let g = `<line class="axis" x1="10" y1="${y}" x2="292" y2="${y}"/><path class="arrh" d="M292 ${y - 4} l8 4 l-8 4z"/>`;
    for (let i = 0; i <= 10; i++) g += `<line class="axis" x1="${X(i)}" y1="${y - (i % 5 === 0 ? 9 : 6)}" x2="${X(i)}" y2="${y + (i % 5 === 0 ? 9 : 6)}"/>`;
    g += `<text class="tick b" x="${X(0)}" y="${y + 26}" text-anchor="middle">${fmt(a)}</text><text class="tick b" x="${X(10)}" y="${y + 26}" text-anchor="middle">${fmt(a + 10 * step)}</text>`;
    g += `<path class="strahlpf" d="M${X(k)} ${y - 34} v20"/><path class="arrh" style="fill:var(--c1)" d="M${X(k) - 5} ${y - 16} h10 l-5 8z"/><text class="tick b" x="${X(k)}" y="${y - 40}" text-anchor="middle" style="fill:var(--c1)">?</text>`;
    return `<svg viewBox="0 0 304 96">${g}</svg>`;
  }
  M.strahlBild = strahlBild;
  function zahlen() {
    const v = R(1, 9);
    if (v <= 2) {
      const step = pick([2, 5, 10, 20, 50, 100, 200, 500, 1000, 10000]);
      const a = R(0, 40) * step * (R(0, 1) ? 10 : 5), k = pick([1, 2, 3, 4, 6, 7, 8, 9]);
      return {
        prompt: 'Welche Zahl gehört an die markierte Stelle des Zahlenstrahls?',
        figure: strahlBild(a, step, k),
        fields: [{ answer: a + k * step }],
        hint: 'Wie groß ist ein Schritt? Rechne den Unterschied der beiden beschrifteten Zahlen aus und teile ihn durch die Anzahl der Schritte (10).',
        solution: `Von ${fmt(a)} bis ${fmt(a + 10 * step)} sind es ${fmt(10 * step)}, verteilt auf 10 Schritte: Ein Schritt ist <b>${fmt(step)}</b>.<br>${k} Schritte: ${fmt(a)} + ${k} · ${fmt(step)} = <b>${fmt(a + k * step)}</b>`,
        ex: { mode: 'strahl', a, step, k },
      };
    }
    const len = R(5, 8);
    let n;
    do n = R(10 ** (len - 1), 10 ** len - 1); while (new Set(String(n)).size < Math.min(len, 6) || String(n).includes('0'));
    if (v <= 4) {
      // Stellenwert einer Ziffer (alle Ziffern verschieden bei kurzen Zahlen, sonst nach der Stelle fragen)
      const i = R(2, len - 1), ziffer = Math.floor(n / 10 ** i) % 10;
      if (v === 3) {
        return {
          prompt: `Welche Ziffer steht in <b>${fmt(n)}</b> an der <b>${STELLEN[i]}stelle</b>?`,
          fields: [{ answer: ziffer }],
          hint: 'Zähle die Stellen von rechts: Einer, Zehner, Hunderter, Tausender, Zehntausender, Hunderttausender, Millionen …',
          solution: `Von rechts gezählt ist die ${STELLEN[i]}stelle die ${i + 1}. Stelle. Dort steht die <b>${ziffer}</b>.<br><small>Sie ist ${fmt(ziffer * 10 ** i)} wert.</small>`,
          answerText: String(ziffer),
          ex: { mode: 'stelle', n, i },
        };
      }
      const wert = ziffer * 10 ** i;
      const opts = shuffle([wert, ziffer * 10 ** (i - 1), ziffer * 10 ** (i + 1)]);
      return {
        prompt: `Welchen Wert hat die Ziffer <b>${ziffer}</b> an der ${i + 1}. Stelle von rechts in der Zahl <b>${fmt(n)}</b>?`,
        choices: opts.map(fmt),
        correct: opts.indexOf(wert),
        hint: 'Trage die Zahl in Gedanken in die Stellenwerttafel ein. An welcher Stelle steht die Ziffer?',
        solution: `Die ${ziffer} steht an der <b>${STELLEN[i]}stelle</b>. Sie ist ${ziffer} · ${fmt(10 ** i)} = <b>${fmt(wert)}</b> wert.`,
        ex: { mode: 'stelle', n, i },
      };
    }
    if (v === 5) {
      // Zahlwort → Zahl (mit Nullen in der Mitte, das ist die typische Hürde)
      const mio = R(0, 1) ? R(1, 9) : 0, tsd = pick([R(1, 9), R(1, 9) * 10, R(11, 99), R(1, 9) * 100 + R(1, 9)]), rest = pick([0, R(1, 9), R(1, 9) * 10, R(1, 9) * 100, R(11, 99)]);
      const m = mio * 1e6 + tsd * 1000 + rest;
      return {
        prompt: `Schreibe als Zahl:<br><b>${zahlwort(m)}</b>`,
        fields: [{ answer: m }],
        hint: 'Schreibe in Dreiergruppen: Millionen | Tausender | Rest. Fehlt in einer Gruppe etwas, füllst du mit Nullen auf.',
        solution: `In Dreiergruppen: ${mio ? mio + ' | ' : ''}${mio ? String(tsd).padStart(3, '0') : tsd} | ${String(rest).padStart(3, '0')}<br>→ <b>${fmt(m)}</b>`,
        ex: { mode: 'wort', n: m },
      };
    }
    if (v === 6) {
      const basis = pick([R(2, 9) * 10 ** R(3, 6), R(11, 99) * 10 ** R(2, 4), R(1000, 899999)]);
      const art = pick(['Vorgänger', 'Nachfolger']);
      const m = art === 'Vorgänger' ? basis : pick([basis - 1, R(1, 9) * 10 ** R(3, 5) + 999, basis + 9]);
      const ans = art === 'Vorgänger' ? m - 1 : m + 1;
      return {
        prompt: `Wie heißt der <b>${art}</b> von <b>${fmt(m)}</b>?`,
        fields: [{ answer: ans }],
        hint: art === 'Vorgänger' ? 'Der Vorgänger ist um 1 kleiner. Achtung bei vielen Nullen: Dann ändern sich mehrere Stellen.' : 'Der Nachfolger ist um 1 größer. Achtung bei vielen Neunen: Dann ändern sich mehrere Stellen.',
        solution: `${fmt(m)} ${art === 'Vorgänger' ? '− 1' : '+ 1'} = <b>${fmt(ans)}</b>`,
        ex: { mode: 'nachbar', n: m, ans, art },
      };
    }
    if (v === 7) {
      // Ordnen: Zahlen, die sich an einer hohen Stelle unterscheiden oder verschieden lang sind
      const b = R(100, 999);
      const drei = shuffle([b * 1000 + R(100, 999), b * 1000 + R(10, 99), (b + 1) * 100 + R(10, 99), b * 10000 + R(0, 999)]).slice(0, 3);
      if (new Set(drei).size < 3) return zahlen();
      const art = pick(['kleinste', 'größte']);
      const ziel = art === 'kleinste' ? Math.min(...drei) : Math.max(...drei);
      return {
        prompt: `Tippe die <b>${art}</b> Zahl ein:<br><b>${drei.map(fmt).join(' &nbsp;·&nbsp; ')}</b>`,
        fields: [{ answer: ziel }],
        hint: 'Erst die Anzahl der Stellen vergleichen: Mehr Stellen heißt größer. Bei gleich vielen Stellen von links Ziffer für Ziffer vergleichen.',
        solution: `Stellen zählen: ${drei.map((z) => `${fmt(z)} hat ${String(z).length}`).join(', ')}.${drei.filter((z) => String(z).length === String(ziel).length).length > 1 ? '<br>Bei gleich vielen Stellen von links Ziffer für Ziffer vergleichen: Die erste Stelle, an der sie sich unterscheiden, entscheidet.' : ''}<br>Die ${art} Zahl ist <b>${fmt(ziel)}</b>.`,
        ex: { mode: 'ordnen', zahlen: drei, art },
      };
    }
    if (v === 8) {
      const [wort, nullen] = pick([['Tausend', 3], ['Zehntausend', 4], ['Hunderttausend', 5], ['eine Million', 6], ['zehn Millionen', 7], ['hundert Millionen', 8], ['eine Milliarde', 9]]);
      return {
        prompt: `Wie viele <b>Nullen</b> hat die Zahl <b>${wort}</b>?`,
        fields: [{ answer: nullen, suffix: 'Nullen' }],
        hint: 'Tausend hat 3 Nullen, eine Million 6, eine Milliarde 9. Dazwischen kommt mit jeder Stufe (zehn-, hundert-) eine Null dazu.',
        solution: `${wort[0].toUpperCase() + wort.slice(1)} = ${fmt(10 ** nullen)} → <b>${nullen} Nullen</b><br><small>Als Zehnerpotenz: 10<sup>${nullen}</sup>. Die Hochzahl zählt die Nullen.</small>`,
        answerText: String(nullen),
        ex: { mode: 'nullen', wort, nullen },
      };
    }
    // Kurzschreibweise der Stellenwerttafel → Zahl (mit leeren Spalten)
    const KURZ = ['E', 'Z', 'H', 'T', 'ZT', 'HT', 'M'];
    const top = R(4, 6);
    const spalten = [top, ...shuffle([0, 1, 2, 3, 4, 5].filter((x) => x < top)).slice(0, R(1, 2))].sort((x, y) => y - x);
    const zif = spalten.map(() => R(1, 9));
    const m = spalten.reduce((sum, sp, j) => sum + zif[j] * 10 ** sp, 0);
    return {
      prompt: `Welche Zahl ist das?<br><b>${spalten.map((sp, j) => zif[j] + ' ' + KURZ[sp]).join(' + ')}</b><br><small>E Einer, Z Zehner, H Hunderter, T Tausender, ZT Zehntausender, HT Hunderttausender, M Millionen</small>`,
      fields: [{ answer: m }],
      hint: 'Trage die Ziffern in die Stellenwerttafel ein. Jede leere Spalte bekommt eine 0.',
      solution: `${spalten.map((sp, j) => `${zif[j]} ${KURZ[sp]} = ${fmt(zif[j] * 10 ** sp)}`).join('<br>')}<br>Leere Spalten bekommen eine 0 → <b>${fmt(m)}</b>`,
      ex: { mode: 'tafel', n: m },
    };
  }

  // =====================================================
  // Brüche am Zahlenstrahl (ablesen, vergleichen, Bruch als Quotient)
  // =====================================================
  function bruchStrahlBild(n, d, max, zeigeWert) {
    const W = 264, X = (v) => 20 + (v / max) * W, y = 56;
    let g = `<line class="axis" x1="12" y1="${y}" x2="296" y2="${y}"/><path class="arrh" d="M294 ${y - 4} l8 4 l-8 4z"/>`;
    for (let i = 0; i <= max * d; i++) g += `<line class="axis" x1="${X(i / d)}" y1="${y - (i % d === 0 ? 10 : 6)}" x2="${X(i / d)}" y2="${y + (i % d === 0 ? 10 : 6)}"/>`;
    for (let i = 0; i <= max; i++) g += `<text class="tick b" x="${X(i)}" y="${y + 27}" text-anchor="middle">${i}</text>`;
    g += `<path class="strahlpf" d="M${X(n / d)} ${y - 34} v20"/><path class="arrh" style="fill:var(--c1)" d="M${X(n / d) - 5} ${y - 16} h10 l-5 8z"/><text class="tick b" x="${X(n / d)}" y="${y - 40}" text-anchor="middle" style="fill:var(--c1)">${zeigeWert || '?'}</text>`;
    return `<svg viewBox="0 0 306 92">${g}</svg>`;
  }
  M.bruchStrahlBild = bruchStrahlBild;
  const kgv = (a, b) => (a * b) / gcd(a, b);
  function bruchstrahl() {
    const v = R(1, 8);
    if (v <= 3) {
      const d = pick([2, 3, 4, 5, 6, 8, 10]), max = d >= 8 ? 1 : pick([1, 2, 2, 3]);
      let n;
      do n = R(1, max * d - 1); while (n % d === 0);
      return {
        prompt: `Welcher Bruch gehört an die markierte Stelle?${n > d ? ' <small>(Der Bruch ist größer als 1.)</small>' : ''}`,
        figure: bruchStrahlBild(n, d, max),
        layout: 'frac',
        fields: [{ answer: n, label: 'Zähler' }, { answer: d, label: 'Nenner' }],
        check([a, b]) { return { ok: !!b && a * d === b * n }; },
        hint: 'In wie viele gleiche Teile ist die Strecke von 0 bis 1 geteilt? Das ist der Nenner. Zähle dann die Schritte von 0 bis zum Pfeil: Das ist der Zähler.',
        solution: `Von 0 bis 1 sind es <b>${d} gleiche Teile</b> → Nenner ${d}.<br>Bis zum Pfeil sind es <b>${n} Schritte</b> → Zähler ${n}.<br>→ ${fr(n, d)}${gcd(n, d) > 1 ? ` (gekürzt ${fr(n / gcd(n, d), d / gcd(n, d))})` : ''}${n > d ? `<br><small>Das ist ein unechter Bruch: ${Math.floor(n / d)} Ganze und ${fr(n % d, d)}.</small>` : ''}`,
        answerText: fr(n, d),
        ex: { mode: 'strahl', n, d, max },
      };
    }
    if (v <= 6) {
      // Vergleichen: gleicher Nenner, gleicher Zähler, gleich groß, oder über Erweitern
      const art = pick(['nenner', 'zaehler', 'gleich', 'erweitern', 'erweitern']);
      let a, b;
      if (art === 'nenner') { const d = R(5, 12); let x = R(1, d - 1), y; do y = R(1, d - 1); while (y === x); a = [x, d]; b = [y, d]; }
      else if (art === 'zaehler') { const z = R(1, 5); let x = R(z + 1, 12), y; do y = R(z + 1, 12); while (y === x); a = [z, x]; b = [z, y]; }
      else if (art === 'gleich') { const d = pick([2, 3, 4, 5]), z = R(1, d - 1), k = R(2, 4); a = [z, d]; b = [z * k, d * k]; if (R(0, 1)) [a, b] = [b, a]; }
      else { do { a = [R(1, 5), pick([2, 3, 4, 5, 6])]; b = [R(1, 7), pick([3, 4, 6, 8, 10])]; } while (a[0] >= a[1] || b[0] >= b[1] || a[1] === b[1] || a[0] * b[1] === b[0] * a[1] || kgv(a[1], b[1]) > 24); }
      const l = a[0] * b[1], r = b[0] * a[1];
      const zeichen = l < r ? '<' : l > r ? '>' : '=';
      const h = kgv(a[1], b[1]);
      const grund = art === 'nenner' ? `Gleicher Nenner: Die Teile sind gleich groß. ${a[0]} Teile sind ${a[0] < b[0] ? 'weniger' : 'mehr'} als ${b[0]} Teile.`
        : art === 'zaehler' ? `Gleicher Zähler: gleich viele Teile, aber bei Nenner ${a[1]} sind die Teile ${a[1] > b[1] ? 'kleiner' : 'größer'} als bei Nenner ${b[1]} (je mehr Teile, desto kleiner jedes Stück).`
          : art === 'gleich' ? `${a[1] < b[1] ? `${fr(a[0], a[1])} erweitert mit ${b[1] / a[1]} ergibt ${fr(b[0], b[1])}` : `${fr(a[0], a[1])} gekürzt mit ${a[1] / b[1]} ergibt ${fr(b[0], b[1])}`}: Beide Brüche sind gleich groß.`
            : `Gleichnamig machen (Nenner ${h}): ${fr(a[0], a[1])} = ${fr((a[0] * h) / a[1], h)} und ${fr(b[0], b[1])} = ${fr((b[0] * h) / b[1], h)}.`;
      return {
        prompt: `Welches Zeichen gehört in die Lücke?<br>${fr(a[0], a[1])} &nbsp;▢&nbsp; ${fr(b[0], b[1])}`,
        choices: ['<', '=', '>'],
        correct: ['<', '=', '>'].indexOf(zeichen),
        hint: art === 'nenner' ? 'Die Nenner sind gleich. Dann entscheidet der Zähler.' : art === 'zaehler' ? 'Die Zähler sind gleich. Überlege: Sind Fünftel größer oder kleiner als Achtel?' : 'Bringe beide Brüche auf denselben Nenner (erweitern oder kürzen) und vergleiche dann die Zähler.',
        solution: `${grund}<br>→ ${fr(a[0], a[1])} <b>${zeichen}</b> ${fr(b[0], b[1])}`,
        ex: { mode: 'vgl', a, b },
      };
    }
    // Bruch als Quotient
    let n, d;
    do { n = R(2, 7); d = R(3, 9); } while (n >= d || gcd(n, d) !== 1);
    if (v === 7) {
      const ding = pick([['Pizzen', 'einer Pizza'], ['Äpfel', 'eines Apfels'], ['Tafeln Schokolade', 'einer Tafel'], ['Liter Saft', 'eines Liters']]);
      return {
        prompt: `<b>${n} ${ding[0]}</b> werden gerecht an <b>${d} Kinder</b> verteilt. Welchen Bruchteil ${ding[1]} bekommt jedes Kind?`,
        layout: 'frac',
        fields: [{ answer: n, label: 'Zähler' }, { answer: d, label: 'Nenner' }],
        check([a, b]) { return { ok: !!b && a * d === b * n }; },
        hint: `Teile zuerst nur ein Stück an ${d} Kinder auf: Jedes bekommt ${fr(1, d)}. Das passiert mit jedem der ${n} Stücke.`,
        solution: `Von jedem Stück bekommt jedes Kind ${fr(1, d)}. Bei ${n} Stücken sind das ${n} · ${fr(1, d)} = ${fr(n, d)}<br><b>${n} : ${d} = ${fr(n, d)}</b><br><small>Der Bruchstrich bedeutet „geteilt durch“.</small>`,
        answerText: fr(n, d),
        ex: { mode: 'quot', n, d },
      };
    }
    return {
      prompt: `Schreibe die Divisionsaufgabe <b>${n} : ${d}</b> als Bruch.`,
      layout: 'frac',
      fields: [{ answer: n, label: 'Zähler' }, { answer: d, label: 'Nenner' }],
      check([a, b]) { return { ok: !!b && a * d === b * n }; },
      hint: 'Der Bruchstrich bedeutet „geteilt durch“. Was oben steht, wird geteilt.',
      solution: `Die Zahl, die geteilt wird, kommt nach oben, der Teiler nach unten:<br><b>${n} : ${d} = ${fr(n, d)}</b>`,
      answerText: fr(n, d),
      ex: { mode: 'quot', n, d },
    };
  }

  // =====================================================
  // Senkrecht & parallel
  // =====================================================
  const GS = 24, GOX = 22, GOY = 206;
  const gx = (x) => GOX + x * GS, gy = (y) => GOY - y * GS;
  M.lageGitter = { gx, gy, GS, GOX, GOY };
  function kaestchen(extra) {
    let g = '';
    for (let i = 0; i <= 10; i++) g += `<line class="grid" x1="${gx(i)}" y1="${gy(0)}" x2="${gx(i)}" y2="${gy(8)}"/>`;
    for (let j = 0; j <= 8; j++) g += `<line class="grid" x1="${gx(0)}" y1="${gy(j)}" x2="${gx(10)}" y2="${gy(j)}"/>`;
    return `<svg viewBox="0 0 284 220">${g}${extra}</svg>`;
  }
  const RICHT = [[1, 0], [0, 1], [1, 1], [1, -1], [2, 1], [1, 2], [2, -1], [1, -2], [3, 1], [1, 3]];
  const senk = ([a, b]) => (b > 0 || (b === 0 && a < 0) ? [b, -a] : [-b, a]); // Vierteldrehung, so normiert, dass dx ≥ 0
  const norm = ([a, b]) => (a < 0 || (a === 0 && b < 0) ? [-a, -b] : [a, b]);
  // Strecke mit Richtung d, die ganz im Gitter liegt: [x1, y1, x2, y2]
  function strecke(d) {
    for (let t = 0; t < 200; t++) {
      const m = Math.max(2, Math.min(Math.floor(9 / Math.max(1, Math.abs(d[0]))), Math.floor(7 / Math.max(1, Math.abs(d[1]))), R(3, 7)));
      const x = R(0, 10), y = R(0, 8), x2 = x + m * d[0], y2 = y + m * d[1];
      if (x2 >= 0 && x2 <= 10 && y2 >= 0 && y2 <= 8) return [x, y, x2, y2];
    }
    return [1, 1, 1 + d[0], 1 + d[1]];
  }
  const aufLinie = (s, p) => (p[0] - s[0]) * (s[3] - s[1]) === (p[1] - s[1]) * (s[2] - s[0]);
  const FARBE = ['var(--c2)', 'var(--c1)', 'var(--c3)', 'var(--c4)'];
  const linie = (s, name, i) => `<line x1="${gx(s[0])}" y1="${gy(s[1])}" x2="${gx(s[2])}" y2="${gy(s[3])}" style="stroke:${FARBE[i]};stroke-width:3.5;stroke-linecap:round"/><text class="tick b" x="${gx(s[2]) + 6}" y="${gy(s[3]) - 5}" style="fill:${FARBE[i]};font-size:15px">${name}</text>`;
  const lage = (d1, d2) => (d1[0] * d2[1] === d1[1] * d2[0] ? 'parallel' : d1[0] * d2[0] + d1[1] * d2[1] === 0 ? 'senkrecht' : 'weder');
  const muster = ([a, b]) => (a === 0 ? `${Math.abs(b)} nach oben` : b === 0 ? `${a} nach rechts` : `${a} nach rechts und ${Math.abs(b)} nach ${b > 0 ? 'oben' : 'unten'}`);
  M.lageMuster = muster; M.lageSenk = senk; M.lageArt = lage;
  function zweite(d1, art, s1) {
    for (let t = 0; t < 300; t++) {
      const d2 = art === 'parallel' ? d1 : art === 'senkrecht' ? senk(d1) : norm(pick(RICHT));
      if (lage(d1, d2) !== art) continue;
      const s2 = strecke(d2);
      if (art === 'parallel' && aufLinie(s1, [s2[0], s2[1]])) continue; // nicht dieselbe Gerade
      return [d2, s2];
    }
    return null;
  }
  function senkParallel() {
    const v = R(1, 7);
    if (v <= 3) {
      const art = pick(['parallel', 'senkrecht', 'weder']);
      const d1 = norm(pick(RICHT)), s1 = strecke(d1), z = zweite(d1, art, s1);
      if (!z) return senkParallel();
      const [d2, s2] = z;
      const opts = ['parallel', 'senkrecht', 'weder parallel noch senkrecht'];
      return {
        prompt: 'Wie liegen die Geraden <b style="color:var(--c2)">g</b> und <b style="color:var(--c1)">h</b> zueinander?',
        figure: kaestchen(linie(s1, 'g', 0) + linie(s2, 'h', 1)),
        choices: opts,
        correct: ['parallel', 'senkrecht', 'weder'].indexOf(art),
        hint: 'Beschreibe jede Gerade mit Kästchen-Schritten: wie viele nach rechts, wie viele nach oben oder unten? Parallele Geraden haben dasselbe Schrittmuster.',
        solution: `g: ${muster(d1)}. &nbsp; h: ${muster(d2)}.<br>${art === 'parallel' ? 'Dasselbe Schrittmuster: Die Geraden laufen immer im gleichen Abstand nebeneinander her.' : art === 'senkrecht' ? d1[0] * d1[1] === 0 ? 'Eine Gerade läuft genau waagerecht, die andere genau senkrecht dazu. Die Geraden bilden einen rechten Winkel.' : 'Die Zahlen sind vertauscht und eine Richtung ist umgekehrt: Das ist eine Vierteldrehung. Die Geraden bilden einen rechten Winkel.' : 'Die Schrittmuster sind verschieden, aber auch nicht um eine Vierteldrehung verdreht.'}<br>→ <b>${opts[['parallel', 'senkrecht', 'weder'].indexOf(art)]}</b>`,
        ex: { mode: 'paar', s1, s2, d1, d2, art },
      };
    }
    if (v <= 5) {
      // Welche Gerade ist parallel bzw. senkrecht zu g?
      const art = pick(['parallel', 'senkrecht']);
      const d1 = norm(pick(RICHT.slice(2))), s1 = strecke(d1);
      const richtig = zweite(d1, art, s1), f1 = zweite(d1, 'weder', s1), f2 = zweite(d1, 'weder', s1);
      if (!richtig || !f1 || !f2 || lage(f1[0], f2[0]) === 'parallel') return senkParallel();
      const order = shuffle([richtig, f1, f2]);
      const namen = ['a', 'b', 'c'];
      return {
        prompt: `Welche Gerade ist <b>${art}</b> zu <b style="color:var(--c2)">g</b>?`,
        figure: kaestchen(linie(s1, 'g', 0) + order.map((o, i) => linie(o[1], namen[i], i + 1)).join('')),
        choices: namen,
        correct: order.indexOf(richtig),
        hint: art === 'parallel' ? 'Suche die Gerade mit demselben Schrittmuster wie g (gleich viele Kästchen nach rechts und nach oben oder unten).' : 'Senkrecht heißt: rechter Winkel. Dreh das Schrittmuster von g um eine Vierteldrehung: Die beiden Zahlen tauschen die Plätze.',
        solution: `g: ${muster(d1)}.<br>${order.map((o, i) => `${namen[i]}: ${muster(o[0])}`).join(' · ')}<br>→ <b>${namen[order.indexOf(richtig)]}</b> ist ${art} zu g.`,
        ex: { mode: 'paar', s1, s2: richtig[1], d1, d2: richtig[0], art },
      };
    }
    // Abstand eines Punktes von einer Geraden (waagerecht oder senkrecht)
    const waag = R(0, 1) === 1;
    const k = waag ? R(1, 7) : R(1, 9);
    let px, py;
    do { px = R(1, 9); py = R(1, 7); } while (waag ? py === k : px === k);
    const ab = waag ? Math.abs(py - k) : Math.abs(px - k);
    const s = waag ? [0, k, 10, k] : [k, 0, k, 8];
    if (v === 6) {
      return {
        prompt: 'Wie groß ist der <b>Abstand</b> des Punktes <b>P</b> von der Geraden <b style="color:var(--c2)">g</b>? (in Kästchen)',
        figure: kaestchen(linie(s, 'g', 0) + `<circle class="pt" cx="${gx(px)}" cy="${gy(py)}" r="6"/><text class="ptl" x="${gx(px) + 8}" y="${gy(py) - 8}">P</text>`),
        fields: [{ answer: ab, suffix: 'Kästchen' }],
        hint: 'Der Abstand ist der kürzeste Weg von P zur Geraden. Der kürzeste Weg trifft die Gerade immer senkrecht.',
        solution: `Der kürzeste Weg von P zu g verläuft <b>senkrecht</b> zu g. Er ist <b>${ab} Kästchen</b> lang.<br><small>Jeder schräge Weg wäre länger.</small>`,
        ex: { mode: 'abstand', px, py, waag, k },
      };
    }
    const fragen = [
      ['Zwei Geraden, die beide senkrecht zu derselben dritten Geraden sind, sind zueinander …', 'parallel', 'Beide stehen im rechten Winkel auf der dritten Geraden, also laufen sie in dieselbe Richtung.'],
      ['Die Gerade a ist parallel zu b, und b ist parallel zu c. Dann sind a und c zueinander …', 'parallel', 'Alle drei haben dieselbe Richtung.'],
      ['Die Gerade a ist parallel zu b, und c ist senkrecht zu a. Dann sind b und c zueinander …', 'senkrecht', 'b hat dieselbe Richtung wie a. Was auf a senkrecht steht, steht auch auf b senkrecht.'],
      ['Die gegenüberliegenden Seiten eines Rechtecks sind zueinander …', 'parallel', 'Gegenüberliegende Seiten eines Rechtecks haben überall denselben Abstand.'],
      ['Zwei benachbarte Seiten eines Rechtecks sind zueinander …', 'senkrecht', 'Ein Rechteck hat vier rechte Winkel.'],
    ];
    const f = pick(fragen);
    const opts = ['parallel', 'senkrecht', 'weder parallel noch senkrecht'];
    const d1 = [1, 0], s1 = [1, 2, 9, 2];
    return {
      prompt: f[0],
      choices: opts,
      correct: opts.indexOf(f[1]),
      hint: 'Zeichne es dir auf Kästchenpapier oder nimm drei Stifte als Geraden.',
      solution: `${f[2]}<br>→ <b>${f[1]}</b>`,
      ex: { mode: 'paar', s1, s2: f[1] === 'parallel' ? [1, 5, 9, 5] : [5, 0, 5, 7], d1, d2: f[1] === 'parallel' ? [1, 0] : [0, 1], art: f[1] },
    };
  }

  // =====================================================
  // Einhängen und Reihenfolge wie im Schulbuch
  // =====================================================
  const lb = (nr) => M.grades[5].lbs.find((l) => l.nr === nr);
  lb(1).topics.push({ id: 'k5-zahlen', title: 'Große Zahlen & Zahlenstrahl', icon: '1M', gen: zahlen });
  lb(2).topics.push({ id: 'k5-bruchstrahl', title: 'Brüche am Zahlenstrahl', icon: '½', gen: bruchstrahl });
  lb(3).topics.push({ id: 'k5-lage', title: 'Senkrecht & parallel', icon: '∥', gen: senkParallel });
  // Reihenfolge nach Lambacher Schweizer 5 Sachsen (Kapitel und Lerneinheit stehen in faecher/mathe/lehrplan/schulbuch-abgleich.md)
  const FOLGE = {
    1: ['k5-zahlen', 'k5-runden', 'k5-ueberschlag', 'k5-schriftlich', 'k5-gleichung', 'k5-vorrang', 'k5-gesetze', 'k5-vorteil', 'k5-potenz', 'k5-teilbar', 'k5-prim', 'k5-division', 'k5-text'],
    2: ['k5-anteil', 'k5-kuerzen', 'k5-erweitern', 'k5-bruchstrahl', 'k5-gemischt', 'k5-umwandeln', 'k5-vergleich', 'k5-dezrunden', 'k5-dezimal', 'k5-mittel'],
    3: ['k5-lage', 'k5-koord', 'k5-winkelart', 'k5-winkelpaar', 'k5-symmetrie'],
    4: ['k5-rechteck', 'k5-netze', 'k5-quader'],
    5: ['k5-einheit', 'k5-fahrplan', 'k5-sach', 'k5-fermi'],
  };
  for (const nr in FOLGE) {
    const pos = (id) => { const i = FOLGE[nr].indexOf(id); return i < 0 ? 99 : i; };
    lb(+nr).topics.sort((a, b) => pos(a.id) - pos(b.id));
  }
})();
