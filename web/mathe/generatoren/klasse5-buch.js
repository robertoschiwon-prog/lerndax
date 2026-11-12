/* MaDax (Mathe) – Klasse 5, Abgleich mit dem Schulbuch (Lambacher Schweizer 5, Ausgabe Sachsen)
 *
 * Vier Themen, zu denen es im Buch eigene Lerneinheiten gibt und die in MaDax noch fehlten:
 *   Kap. I, 1–2:  Große Zahlen & Zahlenstrahl (ordnen, Stellenwerttafel, Zahlenstrahl)
 *   Kap. II, 3–6: Brüche am Zahlenstrahl (ablesen, vergleichen, Bruch als Quotient)
 *   Kap. IV, 1:   Senkrecht & parallel
 *   Kap. IV, 4:   Winkel messen (am Geodreieck ablesen, schätzen)
 * Dazu Aufgabenarten für vorhandene Themen: Geschickt rechnen mit Dezimalzahlen und Dezimalzahl : einstellige Zahl
 * (k5-dezimal), Koordinaten mit Halben (k5-koord), zusammengesetzte Körper (k5-quader).
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
    const v = R(1, 13);
    if (v === 9) {
      // Zwischen welchen ganzen Zahlen liegt der unechte Bruch?
      const d = pick([2, 3, 4, 5]);
      let n;
      do n = R(d + 1, 4 * d - 1); while (n % d === 0);
      const w = Math.floor(n / d);
      const opts = [0, 1, 2, 3].map((k) => `zwischen ${k} und ${k + 1}`);
      return {
        prompt: `Wo liegt ${fr(n, d)} auf dem Zahlenstrahl?`,
        choices: opts,
        correct: w,
        hint: `Wie viele Ganze stecken in ${n} Stücken, wenn ${d} Stücke ein Ganzes sind? Rechne ${n} : ${d} mit Rest.`,
        solution: `${n} : ${d} = ${w} Rest ${n % d}. Es sind also ${w} ${w === 1 ? 'Ganzes' : 'Ganze'} und noch ${fr(n % d, d)} dazu.<br>→ ${fr(n, d)} liegt <b>zwischen ${w} und ${w + 1}</b>.`,
        ex: { mode: 'strahl', n, d, max: Math.max(2, w + 1) },
      };
    }
    if (v === 10) {
      // Vergleich mit einem Halben
      let n, d;
      do { d = R(3, 12); n = R(1, d - 1); } while (R(0, 3) === 0 ? 2 * n !== d : 2 * n === d);
      const opts = ['kleiner als ein Halbes', 'genau ein Halbes', 'größer als ein Halbes'];
      const k = 2 * n < d ? 0 : 2 * n === d ? 1 : 2;
      return {
        prompt: `Ist ${fr(n, d)} kleiner als ${fr(1, 2)}, genau ${fr(1, 2)} oder größer als ${fr(1, 2)}?`,
        choices: opts,
        correct: k,
        hint: 'Ein Halbes heißt: Der Zähler ist genau halb so groß wie der Nenner. Verdopple den Zähler und vergleiche mit dem Nenner.',
        solution: `Zähler verdoppeln: 2 · ${n} = ${2 * n}. Das ist ${k === 0 ? 'kleiner als' : k === 1 ? 'genau' : 'größer als'} der Nenner ${d}.<br>→ ${fr(n, d)} ist <b>${opts[k]}</b>.${k !== 1 ? `<br><small>Zum Vergleich: ${fr(1, 2)} = ${d % 2 === 0 ? fr(d / 2, d) : fr(d, 2 * d) + ' und ' + fr(n, d) + ' = ' + fr(2 * n, 2 * d)}.</small>` : ''}`,
        ex: { mode: 'vgl', a: [n, d], b: [1, 2] },
      };
    }
    if (v === 11 || v === 12) {
      // Der größte / kleinste von drei Brüchen (gleicher Nenner oder gleicher Zähler)
      const art = pick(['nenner', 'zaehler', 'stamm']), was = pick(['größte', 'kleinste']);
      let br;
      if (art === 'nenner') { const d = R(6, 12); br = shuffle([...Array(d - 1)].map((_, i) => i + 1)).slice(0, 3).map((z) => [z, d]); }
      else { const z = art === 'stamm' ? 1 : R(2, 5); br = shuffle([...Array(11)].map((_, i) => i + 2).filter((x) => x > z)).slice(0, 3).map((d) => [z, d]); }
      const wert = (b) => b[0] / b[1];
      const sort = [...br].sort((x, y) => wert(x) - wert(y));
      const ziel = was === 'größte' ? sort[2] : sort[0], zweiter = was === 'größte' ? sort[1] : sort[1];
      return {
        prompt: `Welcher Bruch ist der <b>${was}</b>?`,
        choices: br.map((b) => fr(b[0], b[1])),
        correct: br.indexOf(ziel),
        hint: art === 'nenner' ? 'Die Nenner sind gleich, die Teile also gleich groß. Es kommt nur auf die Anzahl der Teile an.' : 'Die Zähler sind gleich. Überlege, wann die Teile größer sind: bei wenigen oder bei vielen Teilen?',
        solution: `${art === 'nenner' ? 'Gleicher Nenner: Die Teile sind gleich groß. Je mehr Teile (Zähler), desto größer der Bruch.' : 'Gleicher Zähler: gleich viele Teile. Je größer der Nenner, desto <b>kleiner</b> ist jedes Teil.'}<br>Der Größe nach: ${sort.map((b) => fr(b[0], b[1])).join(' &lt; ')}<br>→ Der ${was} Bruch ist ${fr(ziel[0], ziel[1])}`,
        ex: { mode: 'vgl', a: ziel, b: zweiter },
      };
    }
    if (v === 13) {
      // Division, bei der mehr als ein Ganzes herauskommt
      let n, d;
      do { d = R(2, 6); n = R(d + 1, 9); } while (gcd(n, d) !== 1);
      return {
        prompt: `<b>${n} Pfannkuchen</b> werden gerecht an <b>${d} Kinder</b> verteilt. Wie viel bekommt jedes Kind? Schreibe als Bruch.`,
        layout: 'frac',
        fields: [{ answer: n, label: 'Zähler' }, { answer: d, label: 'Nenner' }],
        check([a, b]) { return { ok: !!b && a * d === b * n }; },
        hint: `Teile jeden Pfannkuchen in ${d} gleiche Stücke. Von jedem Pfannkuchen bekommt jedes Kind ein Stück.`,
        solution: `Von jedem Pfannkuchen bekommt jedes Kind ${fr(1, d)}. Bei ${n} Pfannkuchen sind das ${fr(n, d)}<br><b>${n} : ${d} = ${fr(n, d)}</b><br><small>Das ist mehr als ein ganzer Pfannkuchen: ${Math.floor(n / d)} ${fr(n % d, d)}.</small>`,
        answerText: fr(n, d),
        ex: { mode: 'quot', n, d },
      };
    }
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
  const linie = (s, name, i) => `<line x1="${gx(s[0])}" y1="${gy(s[1])}" x2="${gx(s[2])}" y2="${gy(s[3])}" style="stroke:${FARBE[i]};stroke-width:3.5;stroke-linecap:round"/><text class="tick b" x="${gx(s[2]) + 6}" y="${Math.max(15, gy(s[3]) - 5)}" style="fill:${FARBE[i]};font-size:15px">${name}</text>`;
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
  const punktBild = (p, name, cls) => `<circle class="pt${cls || ''}" cx="${gx(p[0])}" cy="${gy(p[1])}" r="5.5"/><text class="ptl" x="${gx(p[0]) + 7}" y="${gy(p[1]) - 7}">${name}</text>`;
  const imGitter = (p) => p[0] >= 0 && p[0] <= 10 && p[1] >= 0 && p[1] <= 8;
  // Figuren für „parallele Seiten“ und „rechte Winkel“
  const FIGUREN = [
    ['Rechteck', [[1, 1], [8, 1], [8, 5], [1, 5]]],
    ['Quadrat', [[2, 1], [7, 1], [7, 6], [2, 6]]],
    ['Quadrat auf der Spitze', [[5, 1], [8, 4], [5, 7], [2, 4]]],
    ['Parallelogramm', [[1, 1], [6, 1], [9, 5], [4, 5]]],
    ['Trapez', [[1, 1], [9, 1], [7, 5], [3, 5]]],
    ['Trapez', [[1, 1], [8, 1], [5, 5], [1, 5]]],
    ['Dreieck', [[1, 1], [9, 1], [4, 6]]],
    ['Dreieck', [[1, 1], [8, 1], [1, 6]]],
    ['Drachenviereck', [[5, 0], [8, 5], [5, 7], [2, 5]]],
    ['Sechseck', [[3, 1], [7, 1], [9, 4], [7, 7], [3, 7], [1, 4]]],
  ];
  // Seiten als Richtungen; Paare paralleler Seiten; Ecken mit rechtem Winkel
  function figurInfo(pts) {
    const n = pts.length, seiten = pts.map((p, i) => [pts[(i + 1) % n][0] - p[0], pts[(i + 1) % n][1] - p[1]]);
    const paare = [], rechte = [];
    for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) if (seiten[i][0] * seiten[j][1] === seiten[i][1] * seiten[j][0]) paare.push([i, j]);
    for (let i = 0; i < n; i++) { const a = seiten[(i + n - 1) % n], b = seiten[i]; if (a[0] * b[0] + a[1] * b[1] === 0) rechte.push(i); }
    return { seiten, paare, rechte };
  }
  M.figurInfo = figurInfo;
  const figurBild = (pts) => kaestchen(`<polygon points="${pts.map((p) => gx(p[0]) + ',' + gy(p[1])).join(' ')}" style="fill:#d9e6ff;stroke:var(--c2);stroke-width:3;stroke-linejoin:round"/>`);
  function senkParallel() {
    const v = R(1, 12);
    if (v === 8 || v === 9) {
      // Parallele bzw. Senkrechte zu g durch P: Durch welchen Punkt verläuft sie?
      const art = v === 8 ? 'parallel' : 'senkrecht';
      for (let t = 0; t < 300; t++) {
        const d1 = norm(pick(RICHT.slice(2))), s1 = strecke(d1);
        const d2 = art === 'parallel' ? d1 : senk(d1);
        const P = [R(0, 10), R(0, 8)], k = pick([1, 2, 3]);
        const Q = [P[0] + k * d2[0], P[1] + k * d2[1]];
        if (d2[0] === 0 || !imGitter(Q) || aufLinie(s1, P) || aufLinie(s1, Q)) continue;
        const falsch = shuffle([[0, 1], [0, -1], [1, 0], [-1, 0], [1, 1], [-1, -1]]).map((o) => [Q[0] + o[0], Q[1] + o[1]])
          .filter((F) => imGitter(F) && (F[0] - P[0]) * d2[1] !== (F[1] - P[1]) * d2[0] && !aufLinie(s1, F)).slice(0, 2);
        if (falsch.length < 2) continue;
        const order = shuffle([Q, ...falsch]), namen = ['A', 'B', 'C'];
        return {
          prompt: `Zeichne in Gedanken die <b>${art === 'parallel' ? 'Parallele' : 'Senkrechte'}</b> zu <b style="color:var(--c2)">g</b> durch den Punkt <b>P</b>. Durch welchen Punkt verläuft sie?`,
          figure: kaestchen(linie(s1, 'g', 0) + order.map((o, i) => punktBild(o, namen[i], ' z')).join('') + punktBild(P, 'P')),
          choices: namen,
          correct: order.indexOf(Q),
          hint: art === 'parallel' ? 'Lies das Schrittmuster von g ab (Kästchen nach rechts, Kästchen nach oben oder unten). Gehe dasselbe Muster von P aus.' : 'Lies das Schrittmuster von g ab und drehe es um eine Vierteldrehung: Die beiden Zahlen tauschen die Plätze, eine Richtung kehrt sich um. Gehe dieses Muster von P aus.',
          solution: `g: ${muster(d1)}.<br>${art === 'parallel' ? 'Die Parallele hat dasselbe Schrittmuster.' : `Die Senkrechte hat das gedrehte Muster: ${muster(d2)}.`}<br>Von P aus ${k === 1 ? 'einmal' : k + '-mal'} dieses Muster gehen: Du landest bei <b>${namen[order.indexOf(Q)]}</b>.`,
          ex: { mode: 'paar', s1, s2: [P[0], P[1], Q[0], Q[1]], d1, d2, art },
        };
      }
    }
    if (v === 10) {
      // Abstand zweier paralleler Geraden
      const waag = R(0, 1) === 1, lim = waag ? 8 : 10;
      const k = R(0, lim - 2), k2 = R(k + 2, lim);
      const s = (q) => (waag ? [0, q, 10, q] : [q, 0, q, 8]);
      const px = waag ? R(2, 8) : k2, py = waag ? k2 : R(2, 6);
      return {
        prompt: 'Die Geraden <b style="color:var(--c2)">g</b> und <b style="color:var(--c1)">h</b> sind parallel. Wie groß ist ihr <b>Abstand</b>? (in Kästchen)',
        figure: kaestchen(linie(s(k), 'g', 0) + linie(s(k2), 'h', 1)),
        fields: [{ answer: k2 - k, suffix: 'Kästchen' }],
        hint: 'Der Abstand wird immer senkrecht zu den Geraden gemessen. Bei parallelen Geraden ist er überall gleich.',
        solution: `Senkrecht von h zu g gemessen sind es <b>${k2 - k} Kästchen</b>.<br><small>Parallele Geraden haben überall denselben Abstand. Es ist also egal, wo du misst.</small>`,
        ex: { mode: 'abstand', px, py, waag, k, zwei: k2 },
      };
    }
    if (v === 11 || v === 12) {
      const [name, pts] = pick(FIGUREN), info = figurInfo(pts), frage = v === 11 ? 'par' : 'recht';
      const ans = frage === 'par' ? info.paare.length : info.rechte.length;
      return {
        prompt: frage === 'par' ? `Wie viele <b>Paare paralleler Seiten</b> hat diese Figur (${name})?` : `Wie viele <b>rechte Winkel</b> hat diese Figur (${name})?`,
        figure: figurBild(pts),
        fields: [{ answer: ans }],
        hint: frage === 'par' ? 'Zwei Seiten sind parallel, wenn sie dasselbe Schrittmuster haben (gleich viele Kästchen zur Seite und nach oben). Gibt es keine, ist die Antwort 0.' : 'Ein rechter Winkel sieht aus wie die Ecke eines Kästchens oder eines Blatts Papier. Prüfe jede Ecke. Gibt es keinen, ist die Antwort 0.',
        solution: frage === 'par'
          ? `${ans === 0 ? 'Keine zwei Seiten haben dasselbe Schrittmuster.' : `${ans === 1 ? 'Ein Paar hat' : ans + ' Paare haben'} jeweils dasselbe Schrittmuster.`}<br>→ <b>${ans}</b> ${ans === 1 ? 'Paar paralleler Seiten' : 'Paare paralleler Seiten'}`
          : `${ans === 0 ? 'An keiner Ecke stehen die Seiten senkrecht aufeinander.' : `An ${ans === 1 ? 'einer Ecke' : ans + ' Ecken'} stehen die beiden Seiten senkrecht aufeinander.`}<br>→ <b>${ans}</b> ${ans === 1 ? 'rechter Winkel' : 'rechte Winkel'}`,
        answerText: String(ans),
        ex: { mode: 'figur', pts, frage },
      };
    }
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
  // Winkel messen (am Geodreieck ablesen, schätzen)
  // =====================================================
  // Das Bild zeigt einen vergrößerten Ausschnitt (viewBox 42 46 256 142): Die Spitzen des Geodreiecks sind abgeschnitten,
  // dafür sind die Zahlen der Skala auf dem Handy gut lesbar.
  // Geodreieck mit Scheitel in der Mitte der langen Kante. Äußere Skala: 0° rechts → 180° links, innere Skala umgekehrt.
  const GEO = { cx: 170, cy: 178, r: 160 };
  M.GEO = GEO;
  const gpt = (grad, r) => [GEO.cx + r * Math.cos((grad * Math.PI) / 180), GEO.cy - r * Math.sin((grad * Math.PI) / 180)];
  M.geoPt = gpt;
  function geoDreieck() {
    const { cx, cy, r } = GEO;
    let g = `<path class="geo" d="M${cx - r} ${cy} H${cx + r} L${cx} ${cy - r}z"/>`;
    for (let a = 0; a <= 180; a += 5) {
      const lang = a % 10 === 0, [x1, y1] = gpt(a, 95), [x2, y2] = gpt(a, lang ? 85 : 90);
      g += `<line class="geot" x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}"/>`;
      if (lang && a > 0 && a < 180) {
        const [xa, ya] = gpt(a, 103.5), [xi, yi] = gpt(a, 75);
        g += `<text class="geoa" x="${xa.toFixed(1)}" y="${(ya + 3).toFixed(1)}" text-anchor="middle">${a}</text><text class="geoi" x="${xi.toFixed(1)}" y="${(yi + 2.5).toFixed(1)}" text-anchor="middle">${180 - a}</text>`;
      }
    }
    g += `<line class="geot" x1="${cx}" y1="${cy}" x2="${cx}" y2="${cy - 60}"/><circle cx="${cx}" cy="${cy}" r="2.6" style="fill:var(--ink)"/>`;
    return g;
  }
  M.geoDreieck = geoDreieck;
  // Winkel mit Scheitel im Nullpunkt: th = Größe, links = erster Schenkel zeigt nach links
  function winkelSchenkel(th, links, mitBogen) {
    const { cx, cy } = GEO;
    const a0 = links ? 180 : 0, a1 = links ? 180 - th : th;
    const [x0, y0] = gpt(a0, 122), [x1, y1] = gpt(a1, 122);
    let g = `<line class="ray" x1="${cx}" y1="${cy}" x2="${x0.toFixed(1)}" y2="${y0.toFixed(1)}" style="stroke:var(--c2);stroke-width:5"/><line class="ray" x1="${cx}" y1="${cy}" x2="${x1.toFixed(1)}" y2="${y1.toFixed(1)}" style="stroke:var(--c1)"/>`;
    if (mitBogen) {
      const [bx0, by0] = gpt(Math.min(a0, a1), 26), [bx1, by1] = gpt(Math.max(a0, a1), 26), [tx, ty] = gpt((a0 + a1) / 2, th < 40 ? 44 : 15);
      g += `<path d="M${bx0.toFixed(1)} ${by0.toFixed(1)} A26 26 0 0 0 ${bx1.toFixed(1)} ${by1.toFixed(1)}" style="fill:none;stroke:var(--c1);stroke-width:2.2"/><text class="tick b" x="${tx.toFixed(1)}" y="${(ty + 4).toFixed(1)}" text-anchor="middle" style="fill:var(--c1)">α</text>`;
    }
    return g;
  }
  M.winkelSchenkel = winkelSchenkel;
  const geoBild = (th, links, mitGeo) => `<svg viewBox="42 46 256 142">${winkelSchenkel(th, links, !mitGeo)}${mitGeo ? geoDreieck() : ''}</svg>`;
  M.geoBild = geoBild;
  const winkelArt = (th) => (th < 90 ? 'spitz' : th === 90 ? 'ein rechter Winkel' : 'stumpf');
  function winkelMessen() {
    const v = R(1, 8);
    let th;
    do th = R(3, 33) * 5; while (th === 90 && v !== 4);
    const links = R(0, 1) === 1;
    if (v <= 4) {
      // Am Geodreieck ablesen (rechts: äußere Skala, links: innere Skala)
      return {
        prompt: 'Das Geodreieck liegt richtig an. Wie groß ist der Winkel?',
        figure: geoBild(th, links, true),
        fields: [{ answer: th, suffix: '°' }],
        hint: `Am orangen Schenkel stehen zwei Zahlen: ${th} und ${180 - th}. Nimm die Skala, die am <b>blauen</b> Schenkel mit 0 beginnt. Prüfe zum Schluss: Ist der Winkel spitz oder stumpf?`,
        solution: `Der blaue Schenkel liegt ${links ? 'links' : 'rechts'} auf der langen Kante. Dort beginnt die <b>${links ? 'innere' : 'äußere'} Skala</b> mit 0.<br>Auf dieser Skala zeigt der orange Schenkel auf <b>${th}°</b>.<br><small>Probe: Der Winkel ist ${winkelArt(th)}${th === 90 ? '' : `, also ${th < 90 ? 'kleiner' : 'größer'} als 90°`}. Das passt zu ${th}° und nicht zu ${180 - th}°.</small>`,
        ex: { mode: 'geo', th, links, art: 'lesen' },
      };
    }
    if (v <= 6) {
      // Schätzen ohne Geodreieck
      const opts = shuffle([th, ...shuffle([15, 30, 45, 60, 75, 90, 105, 120, 135, 150, 165].filter((o) => Math.abs(o - th) >= 25)).slice(0, 3)]);
      return {
        prompt: 'Schätze: Wie groß ist der Winkel α ungefähr?',
        figure: geoBild(th, links, false),
        choices: opts.map((o) => o + '°'),
        correct: opts.indexOf(th),
        hint: 'Vergleiche mit einem rechten Winkel (90°, wie eine Blattecke). Ist der Winkel kleiner oder größer? Ist er etwa halb so groß (45°)?',
        solution: `Der Winkel ist ${th < 90 ? 'kleiner' : 'größer'} als ein rechter Winkel (90°), also <b>${winkelArt(th)}</b>.${th < 90 ? (th < 45 ? ' Er ist sogar kleiner als ein halber rechter Winkel (45°).' : ' Er ist größer als ein halber rechter Winkel (45°).') : (th > 135 ? ' Er ist schon nah am gestreckten Winkel (180°).' : ' Er ist näher an 90° als an 180°.')}<br>→ ungefähr <b>${th}°</b>`,
        ex: { mode: 'geo', th, links, art: 'schaetz' },
      };
    }
    if (v === 7) {
      do th = R(3, 33) * 5; while (th === 90 || Math.abs(th - 90) < 10);
      const art = th < 90 ? 'spitz' : 'stumpf';
      return {
        prompt: `Lena misst einen Winkel. Am Schenkel stehen auf dem Geodreieck die Zahlen <b>${Math.min(th, 180 - th)}</b> und <b>${Math.max(th, 180 - th)}</b>. Sie sieht: Der Winkel ist <b>${art}</b>. Wie groß ist er?`,
        fields: [{ answer: th, suffix: '°' }],
        hint: 'Spitze Winkel sind kleiner als 90°, stumpfe Winkel sind größer als 90°.',
        solution: `Ein ${art}er Winkel ist ${th < 90 ? 'kleiner' : 'größer'} als 90°. Von den beiden Zahlen passt nur <b>${th}°</b>.<br><small>Die beiden Zahlen am Geodreieck ergeben zusammen immer 180°.</small>`,
        ex: { mode: 'geo', th, links, art: 'zwei' },
      };
    }
    // Überstumpfer Winkel
    do th = R(4, 32) * 5; while (th === 90);
    return {
      prompt: `Ein überstumpfer Winkel passt nicht aufs Geodreieck. Tom misst deshalb den Winkel auf der anderen Seite: <b>${th}°</b>. Wie groß ist der überstumpfe Winkel?`,
      fields: [{ answer: 360 - th, suffix: '°' }],
      hint: 'Beide Winkel zusammen ergeben einen vollen Kreis, also 360°.',
      solution: `Beide Winkel zusammen sind ein Vollwinkel: 360°.<br>360° − ${th}° = <b>${360 - th}°</b>`,
      ex: { mode: 'geo', th, links, art: 'ueber' },
    };
  }

  // =====================================================
  // Geschickt rechnen mit Dezimalzahlen (Buch Kap. III, 8) – als Aufgabenart in „Mit Dezimalzahlen rechnen“
  // =====================================================
  // Erklärung: die „Umstellen und bündeln“-Animation von „Geschickt rechnen“ (ex.via)
  function geschicktEx(parts, i1, i2, op, glatt, erg) {
    const tokens = []; parts.forEach((p, i) => { if (i) tokens.push(op); tokens.push(p); });
    const idx = [i1, i2, ...parts.map((_, j) => j).filter((j) => j !== i1 && j !== i2)];
    const nums = idx.map((j) => parts[j]);
    const order = []; idx.forEach((j, i) => { order[2 * i] = 2 * j; if (i) order[2 * i - 1] = 2 * i - 1; });
    return {
      mode: 'tausch', via: 'k5-vorteil', tokens, order,
      steps: [
        { line: nums.join(` ${op} `), say: `Umgestellt: <b>${nums[0]} ${op} ${nums[1]}</b> stehen jetzt nebeneinander.` },
        { line: `= ${glatt} ${op} ${nums[2]}`, say: `${nums[0]} ${op} ${nums[1]} = <b>${glatt}</b>. Das ist eine glatte Zahl, ganz ohne Komma!` },
        { line: `= ${erg}`, say: `${glatt} ${op} ${nums[2]} = <b>${erg}</b><br><small>Auch mit Kommazahlen gilt: erst die glatten Paare suchen.</small>` },
      ],
    };
  }
  function dezGeschickt() {
    if (R(0, 1)) {
      const [x, y, glatt] = pick([[2.5, 4, 10], [0.5, 2, 1], [0.25, 4, 1], [1.25, 8, 10], [0.2, 5, 1], [1.5, 2, 3], [0.5, 4, 2], [2.5, 2, 5]]);
      const k = glatt === 10 && R(0, 1) ? R(11, 99) / 10 : R(3, 29);
      const pos = shuffle([0, 1, 2]), parts = []; parts[pos[0]] = fmt(x); parts[pos[1]] = fmt(y); parts[pos[2]] = fmt(k);
      const erg = U.round6(glatt * k);
      return {
        prompt: `Rechne geschickt: <b>${parts.join(' · ')}</b>`,
        fields: [{ answer: erg }],
        hint: 'Welche zwei Zahlen ergeben malgenommen eine Zahl ohne Komma? Fange mit ihnen an.',
        solution: `Erst ${fmt(x)} · ${fmt(y)} = ${glatt} (Vertauschungsgesetz).<br>${glatt} · ${fmt(k)} = <b>${fmt(erg)}</b>`,
        ex: geschicktEx(parts, pos[0], pos[1], '·', String(glatt), fmt(erg)),
      };
    }
    const st = pick([10, 100]), ganz = pick([1, 5, 10, 10]);
    let a;
    do a = R(1, ganz * st - 1); while (a % st === 0);
    const c = ganz * st - a, b = R(11, 99);
    const A = a / st, C = c / st, B = b / 10, erg = U.round6(ganz + B);
    const pos = shuffle([0, 1, 2]), parts = []; parts[pos[0]] = fmt(A); parts[pos[1]] = fmt(C); parts[pos[2]] = fmt(B);
    return {
      prompt: `Rechne geschickt: <b>${parts.join(' + ')}</b>`,
      fields: [{ answer: erg }],
      hint: 'Suche zwei Zahlen, deren Nachkommastellen sich zu einer glatten Zahl ergänzen.',
      solution: `Erst ${fmt(A)} + ${fmt(C)} = ${ganz} (Vertauschungsgesetz).<br>${ganz} + ${fmt(B)} = <b>${fmt(erg)}</b>`,
      ex: geschicktEx(parts, pos[0], pos[1], '+', String(ganz), fmt(erg)),
    };
  }
  // Dezimalzahl durch einstellige Zahl teilen (Lehrplan LB 2: „z. B. 2,4 : 6“)
  function dezDiv() {
    const st = pick([10, 100]);
    let q, d, a; // weder Aufgabe noch Ergebnis enden auf 0: beide haben gleich viele Nachkommastellen
    do { d = R(2, 9); q = R(4, st === 10 ? 250 : 999); a = q * d; } while (q % 10 === 0 || a % 10 === 0);
    return {
      prompt: `Berechne: <b>${fmt(a / st)} : ${d}</b>`,
      fields: [{ answer: q / st }],
      hint: 'Rechne wie mit natürlichen Zahlen. Sobald du beim Teilen das Komma überschreitest, setzt du auch im Ergebnis das Komma.',
      solution: `Ohne Komma gerechnet: ${fmt(a)} : ${d} = ${fmt(q)}.<br>${fmt(a / st)} hat ${st === 10 ? 'eine Nachkommastelle' : 'zwei Nachkommastellen'}, das Ergebnis auch: <b>${fmt(q / st)}</b><br><small>Probe: ${fmt(q / st)} · ${d} = ${fmt(a / st)}</small>`,
      ex: { mode: 'div', a, st, d, q },
    };
  }
  const thema = (id) => M.grades[5].lbs.flatMap((l) => l.topics).find((x) => x.id === id);
  {
    const t = thema('k5-dezimal'), alt = t.gen;
    t.gen = () => {
      const r = R(1, 10);
      if (r <= 2) return dezDiv();
      if (r > 4) return alt();
      const a = dezGeschickt();
      a.ex.alt = dezGeschickt().ex; // „ähnliches Beispiel“ zeigt eine andere Aufgabe derselben Art
      return a;
    };
  }

  // =====================================================
  // Koordinaten mit Halben (Lehrplan LB 3: „Koordinaten auch als Brüche und Dezimalzahlen“)
  // =====================================================
  function koordBildHalb(x, y) {
    const sz = 24, ox = 34, oy = 222;
    let g = '';
    for (let i = 0; i <= 10; i++) g += `<line class="grid" x1="${ox + i * sz}" y1="${oy}" x2="${ox + i * sz}" y2="${oy - 8 * sz}"/>`;
    for (let j = 0; j <= 8; j++) g += `<line class="grid" x1="${ox}" y1="${oy - j * sz}" x2="${ox + 10 * sz}" y2="${oy - j * sz}"/>`;
    g += `<line class="axis" x1="${ox}" y1="${oy}" x2="${ox + 10 * sz + 12}" y2="${oy}"/><path class="arrh" d="M${ox + 10 * sz + 10} ${oy - 4} l8 4 l-8 4z"/><line class="axis" x1="${ox}" y1="${oy}" x2="${ox}" y2="${oy - 8 * sz - 12}"/><path class="arrh" d="M${ox - 4} ${oy - 8 * sz - 10} l4 -8 l4 8z"/>`;
    for (let i = 0; i <= 10; i++) g += `<text class="tick" x="${ox + i * sz}" y="${oy + 16}" text-anchor="middle">${i}</text>`;
    for (let j = 1; j <= 8; j++) g += `<text class="tick" x="${ox - 9}" y="${oy - j * sz + 4}" text-anchor="end">${j}</text>`;
    g += `<text class="tick b" x="${ox + 10 * sz + 4}" y="${oy + 18}">x</text><text class="tick b" x="${ox + 9}" y="${oy - 8 * sz - 8}">y</text>`;
    g += `<circle class="pt" cx="${ox + x * sz}" cy="${oy - y * sz}" r="6"/><text class="ptl" x="${ox + x * sz + 8}" y="${oy - y * sz - 8}">P</text>`;
    return `<svg viewBox="0 0 300 245">${g}</svg>`;
  }
  function koordHalb() {
    const welche = pick(['x', 'y', 'xy']);
    const x = R(1, 8) + (welche !== 'y' ? 0.5 : 0), y = R(1, 6) + (welche !== 'x' ? 0.5 : 0);
    return {
      prompt: 'Welche Koordinaten hat der Punkt <b>P</b>? Schau genau hin: Er liegt nicht auf einem Gitterpunkt.',
      figure: koordBildHalb(x, y),
      layout: 'coord',
      fields: [{ answer: x, label: 'x' }, { answer: y, label: 'y' }],
      hint: 'Liegt der Punkt genau in der Mitte zwischen zwei Gitterlinien, ist das ein halbes Kästchen: Schreibe dann ,5 (zum Beispiel 2,5).',
      solution: `Nach rechts: ${fmt(x)}${x % 1 ? ` (genau zwischen ${Math.floor(x)} und ${Math.floor(x) + 1})` : ''}. Nach oben: ${fmt(y)}${y % 1 ? ` (genau zwischen ${Math.floor(y)} und ${Math.floor(y) + 1})` : ''}.<br>→ <b>P(${fmt(x)} | ${fmt(y)})</b>`,
      answerText: `P(${fmt(x)} | ${fmt(y)})`,
      ex: { mode: 'halb', x, y },
    };
  }
  { const t = thema('k5-koord'), alt = t.gen; t.gen = () => (R(1, 6) === 1 ? koordHalb() : alt()); }

  // =====================================================
  // Zusammengesetzte Körper (Lehrplan LB 4: „aus Quadern zusammengesetzte Körper“)
  // =====================================================
  // Schrägbild zweier aufeinander gestellter Quader (Maße in Kästchen-Einheiten e)
  function quaderPfad(x, y, w, h, t) { // vordere linke untere Ecke (x, y); t = gezeichnete Tiefe
    const k = t * 0.5;
    return `<polygon class="wf" points="${x},${y} ${x + w},${y} ${x + w},${y - h} ${x},${y - h}"/><polygon class="wt" points="${x},${y - h} ${x + w},${y - h} ${x + w + k},${y - h - k} ${x + k},${y - h - k}"/><polygon class="ws" points="${x + w},${y} ${x + w + k},${y - k} ${x + w + k},${y - h - k} ${x + w},${y - h}"/>`;
  }
  function doppelBild(u, o) {
    const e = Math.min(16, 150 / (u[0] + u[1] * 0.5), 120 / (u[2] + o[2] + u[1] * 0.5));
    const x = 60, y = 172;
    let g = quaderPfad(x, y, u[0] * e, u[2] * e, u[1] * e) + quaderPfad(x, y - u[2] * e, o[0] * e, o[2] * e, o[1] * e);
    g += `<text class="tick b" x="${x + (u[0] * e) / 2}" y="${y + 16}" text-anchor="middle">${u[0]} cm</text><text class="tick b" x="${x - 6}" y="${y - (u[2] * e) / 2 + 4}" text-anchor="end">${u[2]} cm</text><text class="tick b" x="${x - 6}" y="${y - u[2] * e - (o[2] * e) / 2 + 4}" text-anchor="end">${o[2]} cm</text>`;
    g += `<text class="tick b" x="${x + u[0] * e + u[1] * e * 0.25 + 8}" y="${y - u[1] * e * 0.25 + 12}">${u[1]} cm</text>`;
    g += `<text class="tick b" x="${x + (o[0] * e) / 2}" y="${y - u[2] * e - 5}" text-anchor="middle" style="fill:#fff;paint-order:stroke;stroke:var(--ink);stroke-width:3px">${o[0]} cm</text>`;
    return `<svg viewBox="0 0 300 196">${g}</svg>`;
  }
  M.doppelBild = doppelBild;
  function zusammengesetzt() {
    const u = [R(5, 9), R(3, 5), R(2, 4)], o = [R(2, u[0] - 2), u[1], R(2, 4)];
    const v1 = u[0] * u[1] * u[2], v2 = o[0] * o[1] * o[2];
    return {
      prompt: `Der Körper besteht aus zwei Quadern. Beide sind <b>${u[1]} cm</b> tief. Der untere ist ${u[0]} cm lang und ${u[2]} cm hoch, der obere ${o[0]} cm lang und ${o[2]} cm hoch. Wie groß ist das <b>Volumen</b> des ganzen Körpers?`,
      figure: doppelBild(u, o),
      fields: [{ answer: v1 + v2, suffix: 'cm³' }],
      hint: 'Zerlege den Körper in die zwei Quader. Rechne jedes Volumen einzeln aus (Länge · Breite · Höhe) und addiere.',
      solution: `Unten: ${u[0]} · ${u[1]} · ${u[2]} = ${v1} cm³<br>Oben: ${o[0]} · ${o[1]} · ${o[2]} = ${v2} cm³<br>Zusammen: ${v1} + ${v2} = <b>${v1 + v2} cm³</b>`,
      ex: { mode: 'zus', u, o },
    };
  }
  { const t = thema('k5-quader'), alt = t.gen; t.gen = () => (R(1, 5) === 1 ? zusammengesetzt() : alt()); }

  // =====================================================
  // Einhängen und Reihenfolge wie im Schulbuch
  // =====================================================
  const lb = (nr) => M.grades[5].lbs.find((l) => l.nr === nr);
  lb(1).topics.push({ id: 'k5-zahlen', title: 'Große Zahlen & Zahlenstrahl', icon: '1M', gen: zahlen });
  lb(2).topics.push({ id: 'k5-bruchstrahl', title: 'Brüche am Zahlenstrahl', icon: '½', gen: bruchstrahl });
  lb(3).topics.push({ id: 'k5-lage', title: 'Senkrecht & parallel', icon: '∥', gen: senkParallel });
  lb(3).topics.push({ id: 'k5-winkelmessen', title: 'Winkel messen', icon: '∡', gen: winkelMessen });
  // Reihenfolge nach Lambacher Schweizer 5 Sachsen (Kapitel und Lerneinheit stehen in faecher/mathe/lehrplan/schulbuch-abgleich.md)
  const FOLGE = {
    1: ['k5-zahlen', 'k5-runden', 'k5-ueberschlag', 'k5-schriftlich', 'k5-gleichung', 'k5-vorrang', 'k5-gesetze', 'k5-vorteil', 'k5-potenz', 'k5-teilbar', 'k5-prim', 'k5-division', 'k5-text'],
    2: ['k5-anteil', 'k5-kuerzen', 'k5-erweitern', 'k5-bruchstrahl', 'k5-gemischt', 'k5-umwandeln', 'k5-vergleich', 'k5-dezrunden', 'k5-dezimal', 'k5-mittel'],
    3: ['k5-lage', 'k5-koord', 'k5-winkelart', 'k5-winkelmessen', 'k5-winkelpaar', 'k5-symmetrie'],
    4: ['k5-rechteck', 'k5-netze', 'k5-quader'],
    5: ['k5-einheit', 'k5-fahrplan', 'k5-sach', 'k5-fermi'],
  };
  for (const nr in FOLGE) {
    const pos = (id) => { const i = FOLGE[nr].indexOf(id); return i < 0 ? 99 : i; };
    lb(+nr).topics.sort((a, b) => pos(a.id) - pos(b.id));
  }
})();
