/* MaDax (Mathe) – Klasse 5: Knobel-Aufgaben
 *
 * Schwerere, freiwillige Aufgaben zu den Themen. Gleicher Stoff (Lehrplan Sachsen Klasse 5), aber mehr Schritte,
 * rückwärts denken oder mehrere Ideen verbinden. Sie zählen nicht für die Sterne.
 * Jedes Thema bekommt eine Funktion topic.knobel(), die wie topic.gen() ein Aufgabenobjekt liefert
 * (prompt, fields oder choices + correct, hint, solution). Knobel-Aufgaben haben keine eigene Animation (kein ex).
 * Wird NACH allen anderen Generatoren geladen.
 */
(function () {
  const M = window.Mathelix;
  const U = M.util;
  const { R, pick, shuffle, gcd, fmt, fr } = U;
  const sup = (n) => `<sup>${n}</sup>`;
  const themen = () => M.grades[5].lbs.flatMap((l) => l.topics);
  // K('k5-…', variante1, variante2, …): Die Varianten kommen der Reihe nach gemischt dran (keine direkt doppelt).
  function K(id, ...varianten) {
    const t = themen().find((x) => x.id === id);
    if (!t) return;
    let stapel = [];
    t.knobel = () => { if (!stapel.length) stapel = shuffle(varianten); return stapel.pop()(); };
  }
  const istPrim = (n) => { if (n < 2) return false; for (let i = 2; i * i <= n; i++) if (n % i === 0) return false; return true; };
  const teiler = (n) => { const t = []; for (let i = 1; i <= n; i++) if (n % i === 0) t.push(i); return t; };
  const zerlege = (n) => { const f = []; for (let p = 2; n > 1; p++) while (n % p === 0) { f.push(p); n /= p; } return f; };
  const wahl = (prompt, opts, richtig, hint, solution) => { const o = shuffle(opts); return { prompt, choices: o, correct: o.indexOf(richtig), hint, solution }; };

  // =====================================================
  // LB 1 – Natürliche Zahlen
  // =====================================================
  K('k5-vorrang',
    () => { // Klammern setzen
      for (;;) {
        const a = R(2, 9), b = R(2, 9), c = R(3, 9), d = R(1, c - 1);
        const terme = [[`${a} + ${b} · ${c} − ${d}`, a + b * c - d], [`(${a} + ${b}) · ${c} − ${d}`, (a + b) * c - d], [`${a} + ${b} · (${c} − ${d})`, a + b * (c - d)], [`(${a} + ${b}) · (${c} − ${d})`, (a + b) * (c - d)]];
        if (new Set(terme.map((t) => t[1])).size < 4) continue;
        const ziel = pick(terme.slice(1));
        return wahl(`Wo müssen Klammern stehen, damit das Ergebnis <b>${ziel[1]}</b> herauskommt?<br><b>${a} + ${b} · ${c} − ${d}</b>`, terme.map((t) => t[0] + (t === terme[0] ? ' (keine Klammern)' : '')), ziel[0],
          'Rechne jede Möglichkeit aus. Klammern zuerst, dann Punkt vor Strich.',
          terme.map((t) => `${t[0]} = ${t === ziel ? '<b>' + t[1] + '</b>' : t[1]}`).join('<br>'));
      }
    },
    () => { // Klammern, Potenz, Punkt vor Strich in einem Term
      const x = R(2, 4), a = R(1, 4), b = R(2, 5), y = R(2, 6), c = R(8, 15), d = R(2, 7);
      const s = a + b, erg = x * s * s - y * (c - d);
      if (erg <= 0) return themen().find((t) => t.id === 'k5-vorrang').knobel();
      return {
        prompt: `Berechne: <b>${x} · (${a} + ${b})${sup(2)} − ${y} · (${c} − ${d})</b>`,
        fields: [{ answer: erg }],
        hint: 'Reihenfolge: erst die Klammern, dann die Potenz, dann Punktrechnung, zum Schluss Strichrechnung.',
        solution: `Klammern: ${x} · ${s}${sup(2)} − ${y} · ${c - d}<br>Potenz: ${x} · ${s * s} − ${y} · ${c - d}<br>Punkt: ${x * s * s} − ${y * (c - d)}<br>Strich: <b>${erg}</b>`,
      };
    },
    () => { // Lücke im Term
      const p = R(3, 9), q = R(2, 12), m = R(4, 12), wert = m * p + q;
      let u, v, w;
      do { u = R(3, 9); v = Math.floor(wert / u); w = wert - u * v; } while (u === p || w === q);
      const rechts = w ? `${u} · ${v} + ${w}` : `${u} · ${v}`;
      return {
        prompt: `Welche Zahl gehört in die Lücke?<br><b>▢ · ${p} + ${q} = ${rechts}</b>`,
        fields: [{ answer: m }],
        hint: 'Rechne zuerst die rechte Seite aus. Dann rückwärts: erst das Plus rückgängig machen, dann das Mal.',
        solution: `Rechte Seite: ${rechts} = ${wert}<br>▢ · ${p} + ${q} = ${wert} → ▢ · ${p} = ${wert - q} → ▢ = ${wert - q} : ${p} = <b>${m}</b>`,
      };
    });

  K('k5-gesetze',
    () => { // Lücke im Verteilungsgesetz
      const a = R(6, 19), b = R(11, 89), c = 100 - b;
      return {
        prompt: `Welche Zahl gehört in die Lücke?<br><b>${a} · ${b} + ${a} · ▢ = ${a} · 100</b>`,
        fields: [{ answer: c }],
        hint: `Klammere ${a} aus: ${a} · (${b} + ▢). Was muss in der Klammer herauskommen?`,
        solution: `${a} · ${b} + ${a} · ▢ = ${a} · (${b} + ▢). Die Klammer muss 100 ergeben: ▢ = 100 − ${b} = <b>${c}</b>`,
      };
    },
    () => { // Welcher Term ist NICHT gleich?
      const a = R(3, 9), b = pick([20, 30, 40, 50]), c = R(2, 8);
      const falsch = `${a} · ${b} − ${c}`;
      return wahl(`Drei Rechnungen haben dasselbe Ergebnis wie <b>${a} · (${b} − ${c})</b>. Welche <b>nicht</b>?`,
        [`${a} · ${b} − ${a} · ${c}`, `(${b} − ${c}) · ${a}`, `${b} · ${a} − ${c} · ${a}`, falsch], falsch,
        'Beim Ausmultiplizieren muss die Zahl vor der Klammer mit <b>beiden</b> Zahlen in der Klammer malgenommen werden.',
        `${a} · (${b} − ${c}) = ${a} · ${b} − ${a} · ${c} = ${a * b} − ${a * c} = ${a * (b - c)}<br>Bei <b>${falsch}</b> wurde die ${c} nicht mit ${a} malgenommen: Das ergibt ${a * b - c}.`);
    },
    () => { // Minusklammer
      const a = R(40, 90), b = R(15, 35), c = R(3, 12);
      const richtig = `${a} − ${b} + ${c}`;
      return wahl(`Welche Rechnung hat denselben Wert wie <b>${a} − (${b} − ${c})</b>?`,
        [richtig, `${a} − ${b} − ${c}`, `${a} − ${b + c}`], richtig,
        'Rechne die Klammer aus und überlege: Wird am Ende mehr oder weniger abgezogen als ' + b + '?',
        `${a} − (${b} − ${c}) = ${a} − ${b - c} = ${a - b + c}<br>Es wird ${c} <b>weniger</b> abgezogen als ${b}. Also: ${a} − ${b} + ${c} = <b>${a - b + c}</b>`);
    },
    () => { // Lücke: a · (b + ▢) = …
      const a = R(3, 9), b = R(5, 20), x = R(2, 9);
      return {
        prompt: `Welche Zahl gehört in die Lücke?<br><b>${a} · (${b} + ▢) = ${a * b} + ${a * x}</b>`,
        fields: [{ answer: x }],
        hint: `Multipliziere die Klammer aus: ${a} · ${b} + ${a} · ▢. Vergleiche mit der rechten Seite.`,
        solution: `${a} · (${b} + ▢) = ${a} · ${b} + ${a} · ▢ = ${a * b} + ${a} · ▢<br>Also ${a} · ▢ = ${a * x} → ▢ = <b>${x}</b>`,
      };
    });

  K('k5-vorteil',
    () => { // fünf Faktoren
      const k = R(3, 49), fakt = shuffle(pick([[5, 2, 5, 2], [25, 4, 5, 2], [4, 5, 5, 5]]).concat([k]));
      const glatt = fakt.reduce((p, f) => p * f, 1) / k;
      return {
        prompt: `Rechne geschickt: <b>${fakt.join(' · ')}</b>`,
        fields: [{ answer: glatt * k }],
        hint: 'Stelle so um, dass glatte Zahlen entstehen: 5 · 2 = 10, 25 · 4 = 100.',
        solution: `Alle Faktoren außer ${k} zusammen ergeben ${fmt(glatt)}.<br>${fmt(glatt)} · ${k} = <b>${fmt(glatt * k)}</b>`,
      };
    },
    () => { // fünf Summanden mit zwei Hunderter-Paaren
      const a = R(11, 89), b = R(11, 89), e = R(12, 88);
      if (a === b || a + b === 100) return themen().find((t) => t.id === 'k5-vorteil').knobel();
      const z = shuffle([a, 100 - a, b, 100 - b, e]);
      return {
        prompt: `Rechne geschickt: <b>${z.join(' + ')}</b>`,
        fields: [{ answer: 200 + e }],
        hint: 'Suche Paare, die zusammen 100 ergeben. Es gibt zwei davon.',
        solution: `${a} + ${100 - a} = 100 und ${b} + ${100 - b} = 100.<br>100 + 100 + ${e} = <b>${200 + e}</b>`,
      };
    },
    () => { // Summe 1 + 2 + … + n
      const n = pick([20, 30, 40, 50, 60]);
      return {
        prompt: `Rechne geschickt: <b>1 + 2 + 3 + … + ${n - 1} + ${n}</b>`,
        fields: [{ answer: (n * (n + 1)) / 2 }],
        hint: `Bilde Paare von außen nach innen: 1 + ${n}, 2 + ${n - 1}, 3 + ${n - 2} … Wie viele Paare sind es, und was ergibt jedes?`,
        solution: `Paare von außen nach innen: 1 + ${n} = ${n + 1}, 2 + ${n - 1} = ${n + 1}, …<br>Es sind ${n / 2} Paare: ${n / 2} · ${n + 1} = <b>${fmt((n * (n + 1)) / 2)}</b><br><small>Diesen Trick findest du auch bei „Entdecken“ (der kleine Gauß).</small>`,
      };
    },
    () => { // Faktor zerlegen: 25 · 36 = 25 · 4 · 9
      const [g, t, glatt] = pick([[25, 4, 100], [125, 8, 1000], [5, 2, 10], [50, 2, 100]]), k = R(3, 12), z = t * k;
      return {
        prompt: `Rechne geschickt: <b>${g} · ${z}</b>`,
        fields: [{ answer: g * z }],
        hint: `Zerlege ${z} in ${t} · ${k}. Dann kannst du zuerst ${g} · ${t} rechnen.`,
        solution: `${g} · ${z} = ${g} · ${t} · ${k} = ${fmt(glatt)} · ${k} = <b>${fmt(g * z)}</b>`,
      };
    });

  K('k5-potenz',
    () => { // a^b oder b^a?
      const [a, b] = pick([[2, 5], [2, 3], [3, 4], [2, 6], [2, 4], [3, 5], [2, 7], [4, 5], [2, 10]]);
      const l = a ** b, r = b ** a;
      const opts = [`${a}${sup(b)} ist größer`, `${b}${sup(a)} ist größer`, 'beide sind gleich groß'];
      const o = l > r ? 0 : l < r ? 1 : 2;
      return {
        prompt: `Was ist größer: <b>${a}${sup(b)}</b> oder <b>${b}${sup(a)}</b>?`,
        choices: opts, correct: o,
        hint: 'Nicht raten: Rechne beide Potenzen aus. Der Exponent sagt, wie oft die Basis als Faktor steht.',
        solution: `${a}${sup(b)} = ${Array(b).fill(a).join(' · ')} = ${fmt(l)}<br>${b}${sup(a)} = ${Array(a).fill(b).join(' · ')} = ${fmt(r)}<br>→ <b>${opts[o]}</b>`,
      };
    },
    () => { // Exponent gesucht
      const b = pick([2, 2, 3, 5, 10]), e = b === 2 ? R(5, 10) : b === 3 ? R(3, 5) : b === 5 ? R(3, 4) : R(3, 6);
      return {
        prompt: `Welcher Exponent gehört in die Lücke?<br><b>${b}<sup>▢</sup> = ${fmt(b ** e)}</b>`,
        fields: [{ answer: e }],
        hint: `Multipliziere ${b} so oft mit sich selbst, bis ${fmt(b ** e)} herauskommt, und zähle mit.`,
        solution: `${[...Array(e)].map((_, i) => `${b}${sup(i + 1)} = ${fmt(b ** (i + 1))}`).join(', ')}<br>→ Exponent <b>${e}</b>`,
      };
    },
    () => { // drei Potenzen verrechnen
      for (;;) {
        const p = [[3, 4], [4, 3], [2, 5], [5, 2], [2, 6], [6, 2], [3, 3], [7, 2], [2, 4], [10, 2]], [x, y, z] = shuffle(p);
        const erg = x[0] ** x[1] - y[0] ** y[1] + z[0] ** z[1];
        if (x[0] ** x[1] <= y[0] ** y[1]) continue;
        return {
          prompt: `Berechne: <b>${x[0]}${sup(x[1])} − ${y[0]}${sup(y[1])} + ${z[0]}${sup(z[1])}</b>`,
          fields: [{ answer: erg }],
          hint: 'Potenzen kommen vor Punkt- und Strichrechnung: Rechne erst alle drei Potenzen aus.',
          solution: `${x[0] ** x[1]} − ${y[0] ** y[1]} + ${z[0] ** z[1]} = <b>${erg}</b>`,
        };
      }
    },
    () => { // Quadratzahl im Bereich
      const n = R(11, 20), lo = n * n - R(4, 15), hi = n * n + R(4, 15);
      return {
        prompt: `Zwischen <b>${lo}</b> und <b>${hi}</b> liegt genau eine Quadratzahl. Welche?`,
        fields: [{ answer: n * n }],
        hint: 'Probiere Quadratzahlen in der Nähe: 10² = 100, 15² = 225, 20² = 400. Taste dich heran.',
        solution: `${n - 1}${sup(2)} = ${(n - 1) ** 2} ist zu klein, ${n + 1}${sup(2)} = ${(n + 1) ** 2} ist zu groß.<br>${n}${sup(2)} = <b>${n * n}</b> passt.`,
      };
    });

  K('k5-teilbar',
    () => { // Wie viele Ziffern passen?
      for (;;) {
        const d = pick([3, 4, 6, 9]), a = R(1, 9), b = R(0, 9), mitte = d !== 4 && R(0, 1) === 1;
        const zahl = (x) => (mitte ? a * 100 + x * 10 + b : a * 100 + b * 10 + x);
        const pass = [...Array(10)].map((_, x) => x).filter((x) => zahl(x) % d === 0);
        if (!pass.length) continue;
        const bild = mitte ? `${a}▢${b}` : `${a}${b}▢`;
        return {
          prompt: `In der Zahl <b>${bild}</b> fehlt eine Ziffer. Wie viele verschiedene Ziffern (0 bis 9) kannst du einsetzen, damit die Zahl durch <b>${d}</b> teilbar ist?`,
          fields: [{ answer: pass.length }],
          hint: d === 4 ? 'Durch 4 teilbar: Die letzten beiden Ziffern müssen eine Zahl bilden, die durch 4 teilbar ist.' : d === 6 ? 'Durch 6 teilbar heißt: gerade <b>und</b> Quersumme durch 3 teilbar.' : `Durch ${d} teilbar: Die Quersumme muss durch ${d} teilbar sein.`,
          solution: `Es passen: ${pass.map((x) => `<b>${x}</b> (${zahl(x)})`).join(', ')}<br>→ <b>${pass.length}</b> ${pass.length === 1 ? 'Ziffer' : 'Ziffern'}`,
          answerText: String(pass.length),
        };
      }
    },
    () => { // gemeinsames Vielfaches im Alltag
      const [a, b, v] = pick([[4, 6, 12], [6, 8, 24], [6, 9, 18], [8, 12, 24], [10, 15, 30], [4, 10, 20], [6, 10, 30], [9, 12, 36]]);
      const [text, einheit] = pick([
        [`Zwei Lampen blinken gerade gleichzeitig. Die eine blinkt alle <b>${a} Sekunden</b>, die andere alle <b>${b} Sekunden</b>.`, 'Sekunden'],
        [`Zwei Busse fahren gerade gleichzeitig an der Haltestelle ab. Der eine fährt alle <b>${a} Minuten</b>, der andere alle <b>${b} Minuten</b>.`, 'Minuten'],
        [`Zwei Glocken läuten gerade gleichzeitig. Die eine läutet alle <b>${a} Minuten</b>, die andere alle <b>${b} Minuten</b>.`, 'Minuten']]);
      return {
        prompt: `${text} Nach wie vielen ${einheit} passiert das zum ersten Mal wieder gleichzeitig?`,
        fields: [{ answer: v, suffix: einheit }],
        hint: `Schreibe die Vielfachen von ${a} und von ${b} auf. Welche Zahl kommt als erste in beiden Reihen vor?`,
        solution: `Vielfache von ${a}: ${[...Array(Math.round(v / a))].map((_, i) => (i + 1) * a).join(', ')}<br>Vielfache von ${b}: ${[...Array(Math.round(v / b))].map((_, i) => (i + 1) * b).join(', ')}<br>Das erste gemeinsame Vielfache ist <b>${v}</b>.`,
      };
    },
    () => { // Anzahl der Teiler
      const n = pick([12, 18, 20, 24, 28, 30, 36, 40, 42, 45, 48, 60]), t = teiler(n);
      return {
        prompt: `Wie viele Teiler hat die Zahl <b>${n}</b>? (1 und ${n} zählen mit.)`,
        fields: [{ answer: t.length }],
        hint: 'Suche Teiler immer als Paare: 1 und die Zahl selbst, 2 und die Hälfte … So vergisst du keinen.',
        solution: `Teilerpaare: ${t.slice(0, Math.ceil(t.length / 2)).map((x) => (x * x === n ? `${x} · ${x}` : `${x} · ${n / x}`)).join(', ')}<br>Teiler: ${t.join(', ')} → <b>${t.length}</b> Teiler`,
        answerText: String(t.length),
      };
    },
    () => { // nächste Zahl, die durch 2, 3 und 5 teilbar ist
      const [ds, v] = pick([[[2, 3, 5], 30], [[3, 4], 12], [[2, 9], 18], [[4, 5], 20], [[3, 10], 30]]), start = R(4, 30) * v + R(1, v - 1), ziel = Math.ceil(start / v) * v;
      return {
        prompt: `Welches ist die kleinste Zahl, die größer als <b>${start}</b> ist und durch <b>${ds.join(ds.length > 2 ? ', ' : ' und ').replace(/, (\d+)$/, ' und $1')}</b> teilbar ist?`,
        fields: [{ answer: ziel }],
        hint: `Eine Zahl, die durch ${ds.join(' und ')} teilbar ist, ist auch durch ${v} teilbar. Suche das nächste Vielfache von ${v}.`,
        solution: `Durch ${ds.join(' und ')} teilbar heißt: Vielfaches von ${v}.<br>${Math.floor(start / v)} · ${v} = ${Math.floor(start / v) * v} ist zu klein, ${ziel / v} · ${v} = <b>${ziel}</b> passt.`,
      };
    });

  K('k5-prim',
    () => { // nächste Primzahl
      const n = R(24, 96), auf = R(0, 1) === 1;
      let p = n;
      do p += auf ? 1 : -1; while (!istPrim(p));
      return {
        prompt: auf ? `Welches ist die kleinste Primzahl, die <b>größer als ${n}</b> ist?` : `Welches ist die größte Primzahl, die <b>kleiner als ${n}</b> ist?`,
        fields: [{ answer: p }],
        hint: 'Gehe Zahl für Zahl weiter. Gerade Zahlen und Zahlen mit 5 am Ende fallen sofort weg. Prüfe den Rest auf Teilbarkeit durch 3 und 7.',
        solution: `${[...Array(Math.abs(p - n) - 1)].map((_, i) => { const z = n + (auf ? i + 1 : -i - 1), f = zerlege(z); return `${z} = ${f.join(' · ')}`; }).join(', ')}${Math.abs(p - n) > 2 ? ' sind keine Primzahlen.<br>' : Math.abs(p - n) === 2 ? ' ist keine Primzahl.<br>' : ''}<b>${p}</b> hat nur die Teiler 1 und ${p}.`,
      };
    },
    () => { // der Hochstapler
      const fies = pick([51, 57, 87, 91, 119, 133]), echte = shuffle([53, 59, 61, 67, 71, 73, 79, 83, 89, 97, 101, 103, 107]).slice(0, 3);
      return wahl('Drei dieser Zahlen sind Primzahlen. Eine tut nur so. Welche ist <b>keine</b> Primzahl?', [fies, ...echte].map(String), String(fies),
        'Prüfe die Teilbarkeit durch 3 (Quersumme) und durch 7.',
        `<b>${fies}</b> = ${zerlege(fies).join(' · ')}. Die anderen drei haben keine Teiler außer 1 und sich selbst.`);
    },
    () => { // große Primfaktorzerlegung
      for (;;) {
        const f = shuffle([2, 2, 2, 3, 3, 5, 5, 7, 11]).slice(0, R(4, 5)).sort((a, b) => a - b), n = f.reduce((p, x) => p * x, 1);
        if (n < 150 || n > 1500) continue;
        return {
          prompt: `Zerlege <b>${fmt(n)}</b> in Primfaktoren.`,
          fields: [{ answer: f, type: 'factors', placeholder: 'z. B. 2·3·3' }],
          hint: 'Teile immer wieder durch die kleinste Primzahl, die passt: erst 2, dann 3, dann 5, dann 7 …',
          solution: `${fmt(n)} = <b>${f.join(' · ')}</b>`,
          answerText: f.join(' · '),
        };
      }
    },
    () => { // Summe zweier Primzahlen
      const n = pick([16, 18, 20, 22, 24, 26, 28, 30, 32, 34, 36, 40]);
      const paare = []; for (let p = 2; p <= n / 2; p++) if (istPrim(p) && istPrim(n - p)) paare.push([p, n - p]);
      return {
        prompt: `Schreibe <b>${n}</b> als Summe von zwei Primzahlen.`,
        fields: [{ answer: paare[0][0], label: '1. Primzahl' }, { answer: paare[0][1], label: '2. Primzahl', prefix: '+' }],
        check([a, b]) { return { ok: a + b === n && istPrim(a) && istPrim(b), note: a + b === n && !(istPrim(a) && istPrim(b)) ? 'Die Summe stimmt, aber beide Zahlen müssen Primzahlen sein.' : '' }; },
        hint: `Gehe die Primzahlen durch (2, 3, 5, 7, 11, 13 …) und prüfe jedes Mal, ob der Rest bis ${n} auch eine Primzahl ist.`,
        solution: `Es gibt ${paare.length === 1 ? 'eine Möglichkeit' : paare.length + ' Möglichkeiten'}: ${paare.map((p) => `<b>${p[0]} + ${p[1]}</b>`).join(', ')}`,
        answerText: paare.map((p) => `${p[0]} + ${p[1]}`).join(' oder '),
      };
    });

  K('k5-division',
    () => { // vierstellig durch einstellig mit Rest
      const d = R(3, 9), q = R(205, 1890), r = R(1, d - 1), n = q * d + r;
      return {
        prompt: `Dividiere schriftlich: <b>${fmt(n)} : ${d}</b>`,
        fields: [{ answer: q, label: 'Ergebnis' }, { answer: r, label: 'Rest' }],
        hint: 'Arbeite Stelle für Stelle von links. Mache am Ende die Probe: Ergebnis mal Teiler plus Rest.',
        solution: `${fmt(n)} : ${d} = <b>${fmt(q)} Rest ${r}</b><br>Probe: ${fmt(q)} · ${d} = ${fmt(q * d)}, und ${fmt(q * d)} + ${r} = ${fmt(n)}`,
        answerText: `${fmt(q)} Rest ${r}`,
      };
    },
    () => { // Aufrunden im Sachzusammenhang
      const d = pick([4, 6, 8, 9]), n = R(13, 40) * d + R(1, d - 1);
      const [text, ding] = pick([[`In ein Boot passen ${d} Personen. ${n} Personen wollen über den See`, 'Boote'], [`In einen Karton passen ${d} Flaschen. ${n} Flaschen sollen verpackt werden`, 'Kartons'], [`An einen Tisch passen ${d} Gäste. Es kommen ${n} Gäste`, 'Tische']]);
      return {
        prompt: `${text}. Wie viele ${ding} braucht man <b>mindestens</b>?`,
        fields: [{ answer: Math.ceil(n / d), suffix: ding }],
        hint: 'Dividiere. Aber Achtung: Was passiert mit dem Rest? Der braucht auch noch einen Platz.',
        solution: `${n} : ${d} = ${Math.floor(n / d)} Rest ${n % d}.<br>${Math.floor(n / d)} ${ding} sind voll, für die restlichen ${n % d} kommt noch 1 dazu: <b>${Math.ceil(n / d)} ${ding}</b>`,
      };
    },
    () => { // Welche Reste sind möglich / größter Rest
      const d = R(4, 9), q = R(12, 60);
      return {
        prompt: `Eine Zahl wird durch <b>${d}</b> geteilt. Das Ergebnis ist <b>${q}</b>, und der Rest ist so groß wie möglich. Wie heißt die Zahl?`,
        fields: [{ answer: q * d + d - 1 }],
        hint: `Der Rest ist immer kleiner als der Teiler. Der größte mögliche Rest bei : ${d} ist also ${d - 1}.`,
        solution: `Größter Rest bei : ${d} ist ${d - 1}.<br>${q} · ${d} + ${d - 1} = ${q * d} + ${d - 1} = <b>${q * d + d - 1}</b>`,
      };
    },
    () => { // fehlende Ziffer
      const d = R(3, 9), q = R(112, 299), n = q * d, s = String(n), i = R(0, s.length - 1);
      const andere = [...Array(10)].map((_, x) => x).filter((x) => x !== +s[i] && !(i === 0 && x === 0) && +(s.slice(0, i) + x + s.slice(i + 1)) % d === 0);
      if (andere.length) return themen().find((t) => t.id === 'k5-division').knobel();
      return {
        prompt: `Die Division geht ohne Rest auf. Welche Ziffer fehlt?<br><b>${s.slice(0, i)}▢${s.slice(i + 1)} : ${d} = ${q}</b>`,
        fields: [{ answer: +s[i] }],
        hint: 'Rechne rückwärts: Ergebnis mal Teiler ergibt die Zahl, die geteilt wurde.',
        solution: `Probe rückwärts: ${q} · ${d} = ${n}. Es fehlt die Ziffer <b>${s[i]}</b>.`,
        answerText: s[i],
      };
    });

  K('k5-text',
    () => { // Zahlenrätsel rückwärts
      const x = R(4, 15), m = R(3, 9), a = R(5, 30), minus = R(0, 1) === 1 && x * m > a + 5;
      const erg = minus ? x * m - a : x * m + a;
      return {
        prompt: `Ich denke mir eine Zahl. Ich multipliziere sie mit <b>${m}</b>, ${minus ? 'subtrahiere' : 'addiere'} dann <b>${a}</b> und erhalte <b>${erg}</b>. Wie heißt meine Zahl?`,
        fields: [{ answer: x }],
        hint: 'Rechne rückwärts und kehre jeden Schritt um: aus Plus wird Minus, aus Mal wird Geteilt. Beginne mit dem letzten Schritt.',
        solution: `Rückwärts: ${erg} ${minus ? '+' : '−'} ${a} = ${x * m}, dann ${x * m} : ${m} = <b>${x}</b><br><small>Probe: ${x} · ${m} ${minus ? '−' : '+'} ${a} = ${erg}</small>`,
      };
    },
    () => { // Summe und Unterschied
      const kl = R(8, 40), d = R(2, 15) * 2, gr = kl + d;
      return {
        prompt: `Zwei Zahlen ergeben zusammen <b>${gr + kl}</b>. Die eine ist um <b>${d}</b> größer als die andere. Wie heißt die <b>größere</b> Zahl?`,
        fields: [{ answer: gr }],
        hint: `Nimm den Unterschied ${d} erst einmal weg. Dann sind beide Zahlen gleich groß und du kannst halbieren.`,
        solution: `${gr + kl} − ${d} = ${2 * kl}. Die Hälfte ist ${kl}: Das ist die kleinere Zahl.<br>Die größere: ${kl} + ${d} = <b>${gr}</b><br><small>Probe: ${gr} + ${kl} = ${gr + kl}</small>`,
      };
    },
    () => { // Köpfe und Beine
      const k = R(2, 8), h = R(2, 9), [vier, zwei] = pick([['Kaninchen', 'Hühner'], ['Schafe', 'Gänse'], ['Hunde', 'Enten']]);
      return {
        prompt: `Auf einem Hof leben ${zwei} und ${vier}. Zusammen haben sie <b>${k + h} Köpfe</b> und <b>${4 * k + 2 * h} Beine</b>. Wie viele <b>${vier}</b> sind es?`,
        fields: [{ answer: k, suffix: vier }],
        hint: `Stell dir vor, alle ${k + h} Tiere hätten nur 2 Beine. Wie viele Beine fehlen dann? Jedes Tier mit vier Beinen bringt 2 Beine extra mit.`,
        solution: `Wären alle Tiere Zweibeiner: ${k + h} · 2 = ${2 * (k + h)} Beine. Es sind aber ${4 * k + 2 * h}, also ${2 * k} mehr.<br>Jeder Vierbeiner bringt 2 Beine extra: ${2 * k} : 2 = <b>${k} ${vier}</b><br><small>Probe: ${k} · 4 + ${h} · 2 = ${4 * k + 2 * h}</small>`,
      };
    },
    () => { // Text in einen Term übersetzen
      const a = R(6, 15), b = R(4, 9), c = R(12, 30), d = R(8, 25);
      const art = pick([0, 1]);
      const erg = art === 0 ? a * b - (c + d) : (c + d) * b - a;
      if (erg <= 0) return themen().find((t) => t.id === 'k5-text').knobel();
      return {
        prompt: art === 0 ? `Subtrahiere vom Produkt der Zahlen <b>${a}</b> und <b>${b}</b> die Summe der Zahlen <b>${c}</b> und <b>${d}</b>.` : `Multipliziere die Summe der Zahlen <b>${c}</b> und <b>${d}</b> mit <b>${b}</b> und subtrahiere dann <b>${a}</b>.`,
        fields: [{ answer: erg }],
        hint: 'Übersetze Stück für Stück: Produkt heißt mal, Summe heißt plus. Schreibe erst den Term auf, dann rechne.',
        solution: art === 0 ? `Term: ${a} · ${b} − (${c} + ${d}) = ${a * b} − ${c + d} = <b>${erg}</b>` : `Term: (${c} + ${d}) · ${b} − ${a} = ${c + d} · ${b} − ${a} = ${(c + d) * b} − ${a} = <b>${erg}</b>`,
      };
    });

  // =====================================================
  // Hilfen für die übrigen Themen
  // =====================================================
  const selbst = (id) => themen().find((t) => t.id === id).knobel();
  const zahl = (prompt, answer, hint, solution, suffix) => ({ prompt, fields: [suffix ? { answer, suffix } : { answer }], hint, solution });
  const bruch = (prompt, n, d, hint, solution, genau) => ({
    prompt, layout: 'frac', fields: [{ answer: n, label: 'Zähler' }, { answer: d, label: 'Nenner' }],
    check([a, b]) { return genau ? { ok: a === n && b === d, note: b && a * d === b * n ? 'Der Wert stimmt, aber der Bruch ist noch nicht vollständig gekürzt.' : '' } : { ok: !!b && a * d === b * n }; },
    hint, solution, answerText: fr(n, d),
  });
  const punkt = (prompt, x, y, hint, solution) => ({ prompt, layout: 'coord', fields: [{ answer: x, label: 'x' }, { answer: y, label: 'y' }], hint, solution, answerText: `P(${x} | ${y})` });
  const hm = (min) => `${String(Math.floor(min / 60) % 24).padStart(2, '0')}:${String(min % 60).padStart(2, '0')}`;
  const uhr = (prompt, min, hint, solution) => ({ prompt, layout: 'time', fields: [{ answer: Math.floor(min / 60) % 24, label: 'Std.' }, { answer: min % 60, label: 'Min.' }], hint, solution, answerText: hm(min) + ' Uhr' });
  const euro = (cent) => `${fmt(Math.floor(cent / 100))},${String(cent % 100).padStart(2, '0')} €`;
  const kuerze = (n, d) => { const g = gcd(n, d); return [n / g, d / g]; };

  // =====================================================
  // LB 1 – weitere Themen
  // =====================================================
  K('k5-zahlen',
    () => { // größte / kleinste Zahl aus Ziffern (führende Null!)
      const zif = shuffle([0, ...shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]).slice(0, R(3, 4))]), gross = R(0, 1) === 1;
      const auf = [...zif].sort((a, b) => a - b), ab = [...auf].reverse();
      const klein = [auf[1], auf[0], ...auf.slice(2)];
      const erg = +(gross ? ab : klein).join('');
      return zahl(`Bilde aus den Ziffern <b>${zif.join(', ')}</b> die <b>${gross ? 'größte' : 'kleinste'}</b> ${zif.length}-stellige Zahl. Jede Ziffer kommt genau einmal vor.`, erg,
        gross ? 'Die größte Ziffer gehört an die Stelle, die am meisten wert ist: ganz nach links.' : 'Die kleinste Ziffer gehört nach links. Aber Achtung: Eine Zahl darf nicht mit 0 beginnen.',
        gross ? `Ziffern von groß nach klein: <b>${fmt(erg)}</b>` : `Die 0 darf nicht vorn stehen. Also zuerst die kleinste andere Ziffer (${auf[1]}), dann die 0, dann der Rest aufsteigend: <b>${fmt(erg)}</b>`);
    },
    () => { // Mitte zwischen zwei Zahlen
      const st = pick([1000, 5000, 10000, 50000]), a = R(2, 60) * st, d = pick([2, 4, 6, 10]) * st;
      return zahl(`Welche Zahl liegt auf dem Zahlenstrahl <b>genau in der Mitte</b> zwischen ${fmt(a)} und ${fmt(a + d)}?`, a + d / 2,
        'Wie groß ist der Abstand der beiden Zahlen? Gehe von der kleineren Zahl die Hälfte davon weiter.',
        `Abstand: ${fmt(a + d)} − ${fmt(a)} = ${fmt(d)}. Die Hälfte ist ${fmt(d / 2)}.<br>${fmt(a)} + ${fmt(d / 2)} = <b>${fmt(a + d / 2)}</b>`);
    },
    () => { // Wie viele Zahlen?
      const art = R(0, 2);
      if (art === 0) { const n = R(2, 5); return zahl(`Wie viele <b>${n}-stellige</b> Zahlen gibt es?`, 9 * 10 ** (n - 1), `Welches ist die kleinste, welches die größte ${n}-stellige Zahl?`, `Kleinste: ${fmt(10 ** (n - 1))}, größte: ${fmt(10 ** n - 1)}.<br>${fmt(10 ** n - 1)} − ${fmt(10 ** (n - 1))} + 1 = <b>${fmt(9 * 10 ** (n - 1))}</b><br><small>Plus 1, weil beide Enden mitzählen.</small>`); }
      const a = R(3, 90) * 100 - R(1, 9), b = a + R(12, 40);
      if (art === 1) return zahl(`Wie viele natürliche Zahlen liegen <b>zwischen</b> ${fmt(a)} und ${fmt(b)}? (Die beiden Zahlen selbst zählen nicht mit.)`, b - a - 1, 'Probiere es erst mit kleinen Zahlen aus: Zwischen 3 und 7 liegen 4, 5, 6. Das sind 7 − 3 − 1.', `${fmt(b)} − ${fmt(a)} − 1 = <b>${b - a - 1}</b>`);
      return zahl(`Du zählst von ${fmt(a)} bis ${fmt(b)} und sagst jede Zahl. Wie viele Zahlen sagst du?`, b - a + 1, 'Probiere es erst mit kleinen Zahlen aus: Von 3 bis 7 sind es 3, 4, 5, 6, 7. Das sind 7 − 3 + 1.', `${fmt(b)} − ${fmt(a)} + 1 = <b>${b - a + 1}</b><br><small>Plus 1, weil Anfang und Ende mitzählen.</small>`);
    },
    () => { // größte / kleinste Zahl mit verschiedenen Ziffern
      const n = R(4, 7), gross = R(0, 1) === 1;
      const erg = gross ? +'9876543'.slice(0, n) : +'1023456'.slice(0, n);
      return zahl(`Wie heißt die <b>${gross ? 'größte' : 'kleinste'}</b> ${n}-stellige Zahl, in der keine Ziffer doppelt vorkommt?`, erg,
        gross ? 'Beginne links mit der größten Ziffer und nimm dann immer die nächstkleinere.' : 'Links soll die Zahl so klein wie möglich sein. Sie darf aber nicht mit 0 beginnen.',
        gross ? `9, dann 8, dann 7 …: <b>${fmt(erg)}</b>` : `Vorn die 1 (0 geht nicht), dann die 0, dann 2, 3 …: <b>${fmt(erg)}</b>`);
    });

  K('k5-runden',
    () => { // kleinste / größte Zahl zu einem Rundungsergebnis
      const [p, name] = pick([[10, 'Zehner'], [100, 'Hunderter'], [1000, 'Tausender']]), r = R(12, 98) * p, klein = R(0, 1) === 1;
      return zahl(`Eine natürliche Zahl wurde auf <b>${name}</b> gerundet. Das Ergebnis ist <b>${fmt(r)}</b>. Wie heißt die <b>${klein ? 'kleinste' : 'größte'}</b> Zahl, die es gewesen sein kann?`, klein ? r - p / 2 : r + p / 2 - 1,
        `Ab der Ziffer 5 wird aufgerundet, bis 4 wird abgerundet. ${klein ? 'Welche Zahl wird gerade noch aufgerundet?' : 'Welche Zahl wird gerade noch abgerundet?'}`,
        klein ? `Aufgerundet wird ab der Hälfte: ${fmt(r)} − ${fmt(p / 2)} = <b>${fmt(r - p / 2)}</b><br><small>${fmt(r - p / 2 - 1)} würde schon auf ${fmt(r - p)} abgerundet.</small>` : `Abgerundet wird bis kurz vor der Hälfte: ${fmt(r)} + ${fmt(p / 2)} − 1 = <b>${fmt(r + p / 2 - 1)}</b><br><small>${fmt(r + p / 2)} würde schon auf ${fmt(r + p)} aufgerundet.</small>`);
    },
    () => { // Rundung mit Übertrag über mehrere Stellen
      const [p, name] = pick([[10, 'Zehner'], [100, 'Hunderter']]), basis = R(1, 9) * 10000 * (p === 10 ? 1 : 1) + (p === 10 ? 9990 : 9900), n = basis + R(p / 2, p - 1);
      return zahl(`Runde <b>${fmt(n)}</b> auf <b>${name}</b>.`, Math.round(n / p) * p,
        'Es wird aufgerundet. Aber an der Rundungsstelle steht schon eine 9: Dann gibt es einen Übertrag nach links, vielleicht sogar mehrmals.',
        `Aufrunden: Die 9 wird zur 10, der Übertrag wandert weiter nach links.<br>→ <b>${fmt(Math.round(n / p) * p)}</b>`);
    },
    () => { // Wie viele Zahlen runden auf …?
      const [p, name] = pick([[10, 'Zehner'], [100, 'Hunderter'], [1000, 'Tausender']]), r = R(3, 60) * p;
      return zahl(`Wie viele verschiedene natürliche Zahlen ergeben auf <b>${name}</b> gerundet <b>${fmt(r)}</b>?`, p,
        'Finde die kleinste und die größte Zahl, die auf dieses Ergebnis gerundet wird. Dann zähle, wie viele es von der einen bis zur anderen sind.',
        `Kleinste: ${fmt(r - p / 2)}, größte: ${fmt(r + p / 2 - 1)}.<br>${fmt(r + p / 2 - 1)} − ${fmt(r - p / 2)} + 1 = <b>${fmt(p)}</b> Zahlen`);
    },
    () => { // zweimal runden ist nicht dasselbe
      const h = R(11, 88) * 100, n = h + R(45, 49);
      return wahl(`Mia rundet <b>${fmt(n)}</b> erst auf Zehner und das Ergebnis dann auf Hunderter. Tom rundet ${fmt(n)} direkt auf Hunderter. Wer hat richtig auf Hunderter gerundet?`,
        [`Tom: ${fmt(h)}`, `Mia: ${fmt(h + 100)}`, 'Beide haben dasselbe Ergebnis'], `Tom: ${fmt(h)}`,
        'Rechne beide Wege nach. Beim Runden schaut man immer auf die ursprüngliche Zahl.',
        `Tom: ${fmt(n)} hat an der Zehnerstelle eine 4 → abrunden auf <b>${fmt(h)}</b>. Das ist richtig.<br>Mia: erst ${fmt(n)} → ${fmt(h + 50)}, dann ${fmt(h + 50)} → ${fmt(h + 100)}. Durch das doppelte Runden wird ihr Ergebnis falsch.`);
    });

  K('k5-ueberschlag',
    () => { // genau ein Produkt über der Grenze
      for (;;) {
        const grenze = pick([1000, 2000, 5000, 10000]);
        const mk = () => { const a = R(12, 98), b = R(12, 198); return [a, b, a * b]; };
        const alle = [mk(), mk(), mk(), mk()];
        const drueber = alle.filter((x) => x[2] > grenze * 1.15), nah = alle.filter((x) => x[2] > grenze * 0.87 && x[2] <= grenze * 1.15);
        if (drueber.length !== 1 || nah.length || new Set(alle.map((x) => x[0] + '·' + x[1])).size < 4) continue;
        return wahl(`Nur eine dieser Rechnungen hat ein Ergebnis <b>über ${fmt(grenze)}</b>. Welche? Überschlage im Kopf.`, alle.map((x) => `${x[0]} · ${x[1]}`), `${drueber[0][0]} · ${drueber[0][1]}`,
          'Runde beide Faktoren auf eine Zahl, mit der du leicht rechnen kannst, zum Beispiel auf Zehner.',
          alle.map((x) => { const ra = Math.round(x[0] / 10) * 10, rb = Math.round(x[1] / 10) * 10; return `${x[0]} · ${x[1]} ≈ ${ra} · ${rb} = ${fmt(ra * rb)}${x === drueber[0] ? ' ← <b>über ' + fmt(grenze) + '</b>' : ''}`; }).join('<br>'));
      }
    },
    () => { // In welchem Bereich liegt das Produkt?
      const a = R(21, 89), b = R(21, 89), p = a * b, st = 1000, lo = Math.floor(p / st) * st;
      const est = Math.round(a / 10) * 10 * Math.round(b / 10) * 10;
      if (p - lo < 120 || lo + st - p < 120 || est <= lo || est >= lo + st) return selbst('k5-ueberschlag');
      const ber = (x) => `zwischen ${fmt(x)} und ${fmt(x + st)}`;
      return wahl(`In welchem Bereich liegt <b>${a} · ${b}</b>? Überschlage.`, [lo - st, lo, lo + st, lo + 2 * st].filter((x) => x >= 0).map(ber), ber(lo),
        'Runde einmal beide Faktoren ab und einmal beide auf. Das Ergebnis liegt dazwischen. Ein genauerer Überschlag hilft beim Entscheiden.',
        `Überschlag: ${Math.round(a / 10) * 10} · ${Math.round(b / 10) * 10} = ${fmt(Math.round(a / 10) * 10 * Math.round(b / 10) * 10)}.<br>Genau: ${a} · ${b} = ${fmt(p)} → <b>${ber(lo)}</b>`);
    },
    () => { // Reicht das Geld? Fünf Preise
      for (;;) {
        const preise = [...Array(5)].map(() => R(1, 8) * 100 + pick([19, 29, 45, 49, 79, 89, 95, 99])), summe = preise.reduce((x, y) => x + y, 0);
        const schein = pick([2000, 3000, 5000]), diff = schein - summe;
        if (Math.abs(diff) < 60 || Math.abs(diff) > 400) continue;
        const ja = diff > 0, rund = preise.map((x) => Math.round(x / 100)), rs = rund.reduce((x, y) => x + y, 0) * 100;
        if (rs === schein || (rs < schein) !== ja) continue;
        return wahl(`Im Korb liegen fünf Sachen: <b>${preise.map(euro).join(' · ')}</b>. Reichen <b>${schein / 100} €</b>? Überschlage.`, ['Ja, das reicht', 'Nein, das reicht nicht'], ja ? 'Ja, das reicht' : 'Nein, das reicht nicht',
          'Runde jeden Preis auf ganze Euro und addiere.',
          `Gerundet: ${rund.join(' + ')} = ${rund.reduce((x, y) => x + y, 0)} €. Genau sind es ${euro(summe)}.<br>→ <b>${ja ? 'Ja, das reicht' : 'Nein, das reicht nicht'}</b>${ja ? ` (${euro(diff)} bleiben übrig)` : ` (es fehlen ${euro(-diff)})`}`);
      }
    });

  K('k5-schriftlich',
    () => { // fehlende Ziffer in einer Addition
      const a = R(123, 689), b = R(123, 289), s1 = String(a), i = R(0, 2);
      return { prompt: `Welche Ziffer fehlt?<br><b>${s1.slice(0, i)}▢${s1.slice(i + 1)} + ${b} = ${a + b}</b>`, fields: [{ answer: +s1[i] }],
        hint: 'Rechne rückwärts: Summe minus die bekannte Zahl ergibt die Zahl mit der Lücke.', solution: `${a + b} − ${b} = ${a}. Es fehlt die Ziffer <b>${s1[i]}</b>.`, answerText: s1[i] };
    },
    () => { // drei Summanden
      const a = R(1200, 8900), b = R(250, 990), c = R(1500, 6900);
      return zahl(`Rechne schriftlich: <b>${fmt(a)} + ${b} + ${fmt(c)}</b>`, a + b + c, 'Schreibe alle drei Zahlen stellengerecht untereinander. Der Übertrag kann jetzt auch 2 sein.', `${fmt(a)} + ${b} + ${fmt(c)} = <b>${fmt(a + b + c)}</b>`);
    },
    () => { // dreistellig mal zweistellig
      const a = R(123, 489), b = R(23, 78);
      return zahl(`Rechne schriftlich: <b>${a} · ${b}</b>`, a * b, `Rechne zuerst ${a} · ${Math.floor(b / 10)} (eine Stelle weiter links aufschreiben!), dann ${a} · ${b % 10}, und addiere.`, `${a} · ${Math.floor(b / 10) * 10} = ${fmt(a * Math.floor(b / 10) * 10)}<br>${a} · ${b % 10} = ${fmt(a * (b % 10))}<br>Zusammen: <b>${fmt(a * b)}</b>`);
    },
    () => { // Ergänzen zu 10 000
      const a = R(1234, 4890), b = R(1234, 3890), ziel = 10000;
      return zahl(`Wie viel fehlt von <b>${fmt(a)} + ${fmt(b)}</b> bis ${fmt(ziel)}?`, ziel - a - b, 'Zwei Schritte: erst die Summe ausrechnen, dann von 10 000 abziehen.', `${fmt(a)} + ${fmt(b)} = ${fmt(a + b)}<br>${fmt(ziel)} − ${fmt(a + b)} = <b>${fmt(ziel - a - b)}</b>`);
    });

  K('k5-gleichung',
    () => { const x = R(3, 15), a = R(2, 9), b = R(3, 25); return zahl(`Löse: <b>${a} · x + ${b} = ${a * x + b}</b>`, x, 'Rechne rückwärts: erst das Plus rückgängig machen, dann das Mal.', `${a * x + b} − ${b} = ${a * x}, dann ${a * x} : ${a} → x = <b>${x}</b><br><small>Probe: ${a} · ${x} + ${b} = ${a * x + b}</small>`); },
    () => { const q = R(4, 12), d = R(3, 9), b = R(2, q - 1), x = q * d; return zahl(`Löse: <b>x : ${d} − ${b} = ${q - b}</b>`, x, 'Rechne rückwärts: erst das Minus rückgängig machen (also plus), dann das Geteilt (also mal).', `${q - b} + ${b} = ${q}, dann ${q} · ${d} → x = <b>${x}</b><br><small>Probe: ${x} : ${d} − ${b} = ${q - b}</small>`); },
    () => { const x = R(2, 14), a = R(3, 8), b = R(2, 9); return zahl(`Löse: <b>${a} · (x + ${b}) = ${a * (x + b)}</b>`, x, `Was muss in der Klammer herauskommen, damit ${a} mal die Klammer ${a * (x + b)} ergibt?`, `Die Klammer muss ${a * (x + b)} : ${a} = ${x + b} sein.<br>x + ${b} = ${x + b} → x = <b>${x}</b>`); },
    () => { const a = R(4, 9), g = R(30, 95), x = Math.floor((g - 1) / a); return zahl(`Welches ist die <b>größte</b> natürliche Zahl x, für die gilt: <b>${a} · x &lt; ${g}</b>?`, x, `Probiere: Welche Zahl mal ${a} bleibt gerade noch unter ${g}?`, `${a} · ${x} = ${a * x} ist kleiner als ${g}. ${a} · ${x + 1} = ${a * (x + 1)} ist schon ${a * (x + 1) === g ? 'genau ' + g + ', also nicht mehr kleiner' : 'zu groß'}.<br>→ x = <b>${x}</b>`); },
    () => { const x = R(4, 20), b = R(3, 15); return zahl(`Auf einer Waage liegen links <b>drei gleiche Kugeln und ${b} g</b>. Rechts liegen <b>eine Kugel und ${2 * x + b} g</b>. Die Waage ist im Gleichgewicht. Wie schwer ist eine Kugel?`, x, 'Nimm auf beiden Seiten dasselbe weg: erst eine Kugel, dann ' + b + ' g. Die Waage bleibt im Gleichgewicht.', `Auf beiden Seiten eine Kugel und ${b} g wegnehmen: Links bleiben 2 Kugeln, rechts ${2 * x} g.<br>Eine Kugel wiegt ${2 * x} : 2 = <b>${x} g</b>`, 'g'); });

  // =====================================================
  // LB 2 – Brüche und Dezimalzahlen
  // =====================================================
  K('k5-anteil',
    () => { let n, d; do { d = R(3, 8); n = R(2, d - 1); } while (gcd(n, d) > 1); const t = R(3, 12); return zahl(`${fr(n, d)} einer Zahl sind <b>${n * t}</b>. Wie heißt die Zahl?`, d * t, `Finde erst heraus, wie viel ${fr(1, d)} ist: Teile ${n * t} durch ${n}.`, `${fr(n, d)} sind ${n * t}, also ist ${fr(1, d)} = ${n * t} : ${n} = ${t}.<br>Das Ganze sind ${d} solche Teile: ${d} · ${t} = <b>${d * t}</b>`); },
    () => { const d1 = pick([3, 4, 5]), n1 = R(2, d1 - 1), g1 = d1 * R(4, 12), d2 = pick([2, 3, 6]), n2 = d2 === 2 ? 1 : R(1, d2 - 1), g2 = d2 * R(3, 10); const a = (g1 / d1) * n1, b = (g2 / d2) * n2; return zahl(`Berechne: ${fr(n1, d1)} von ${g1} <b>plus</b> ${fr(n2, d2)} von ${g2}`, a + b, 'Rechne beide Anteile einzeln aus (erst teilen, dann malnehmen) und addiere.', `${fr(n1, d1)} von ${g1}: ${g1} : ${d1} · ${n1} = ${a}<br>${fr(n2, d2)} von ${g2}: ${g2} : ${d2} · ${n2} = ${b}<br>${a} + ${b} = <b>${a + b}</b>`); },
    () => { const d = pick([3, 4, 5, 8]), n = R(1, d - 1), t = pick([2, 4, 6]), g = d * t * R(1, 3), aus = (g / d) * n, rest = g - aus; return zahl(`Lena hat <b>${g} €</b> gespart. Sie gibt ${fr(n, d)} davon für ein Spiel aus. Vom Rest gibt sie die Hälfte für ein Buch aus. Wie viel Geld hat sie dann noch?`, rest / 2, 'Drei Schritte: Anteil für das Spiel ausrechnen, abziehen, den Rest halbieren.', `Spiel: ${g} : ${d} · ${n} = ${aus} €. Rest: ${g} − ${aus} = ${rest} €.<br>Die Hälfte davon bleibt übrig: ${rest} : 2 = <b>${fmt(rest / 2)} €</b>`, '€'); },
    () => { const [teil, ganz, was] = pick([[15, 60, 'Welcher Bruchteil einer Stunde sind 15 Minuten'], [45, 60, 'Welcher Bruchteil einer Stunde sind 45 Minuten'], [40, 60, 'Welcher Bruchteil einer Stunde sind 40 Minuten'], [250, 1000, 'Welcher Bruchteil eines Kilogramms sind 250 g'], [600, 1000, 'Welcher Bruchteil eines Kilometers sind 600 m'], [8, 24, 'Welcher Bruchteil eines Tages sind 8 Stunden'], [18, 24, 'Welcher Bruchteil eines Tages sind 18 Stunden'], [35, 100, 'Welcher Bruchteil eines Euros sind 35 Cent']]); const [n, d] = kuerze(teil, ganz); return bruch(`${was}? Kürze vollständig.`, n, d, `Schreibe zuerst ${teil} von ${ganz} als Bruch und kürze dann.`, `${fr(teil, ganz)} gekürzt mit ${teil / n}: ${fr(n, d)}`, true); });

  K('k5-kuerzen',
    () => { for (;;) { const [n, d] = kuerze(R(2, 11), R(3, 13)), k = pick([12, 14, 15, 18, 21, 24, 28, 36]); if (n >= d || d === 1) continue; return bruch(`Kürze vollständig: ${fr(n * k, d * k)}`, n, d, 'Kürze in mehreren Schritten: erst durch 2 oder 3, dann schauen, ob es noch weiter geht.', `Zähler und Nenner sind beide durch ${k} teilbar:<br>${fr(n * k, d * k)} = ${fr(n, d)}`, true); } },
    () => { for (;;) { const [n, d] = kuerze(R(1, 7), R(2, 9)), k = pick([6, 8, 12, 15, 16, 18, 24]); if (n >= d) continue; return zahl(`Der Bruch ${fr(n * k, d * k)} wurde in einem Schritt zu ${fr(n, d)} gekürzt. <b>Mit welcher Zahl</b> wurde gekürzt?`, k, 'Teile den alten Zähler durch den neuen Zähler.', `${n * k} : ${n} = ${k} und ${d * k} : ${d} = ${k}. Es wurde mit <b>${k}</b> gekürzt.`); } },
    () => { const fest = pick([[9, 16], [8, 15], [14, 25], [15, 28], [21, 32], [25, 36]]), andere = shuffle([[9, 15], [14, 21], [15, 25], [21, 28], [27, 36], [16, 28], [22, 33], [26, 39]]).slice(0, 3); return wahl('Drei dieser Brüche kann man kürzen. Welchen <b>nicht</b>?', [fest, ...andere].map((b) => fr(b[0], b[1])), fr(fest[0], fest[1]), 'Suche für jeden Bruch eine Zahl, die Zähler und Nenner teilt. Bei einem gibt es keine (außer 1).', `${andere.map((b) => `${fr(b[0], b[1])} geht durch ${gcd(b[0], b[1])}`).join(', ')}.<br>${fr(fest[0], fest[1])} hat keinen gemeinsamen Teiler: ${fest[0]} = ${zerlege(fest[0]).join(' · ')}, ${fest[1]} = ${zerlege(fest[1]).join(' · ')}.`); });

  K('k5-erweitern',
    () => { const [n, d] = pick([[3, 4], [2, 5], [7, 10], [3, 20], [9, 25], [1, 4], [4, 5], [11, 50], [7, 20]]); return zahl(`Erweitere so, dass der Nenner 100 wird:<br>${fr(n, d)} = ${fr('▢', 100)}<br>Welche Zahl steht im Zähler?`, (n * 100) / d, `Mit welcher Zahl muss man ${d} malnehmen, um 100 zu bekommen? Nimm den Zähler mit derselben Zahl mal.`, `${d} · ${100 / d} = 100, also auch ${n} · ${100 / d} = <b>${(n * 100) / d}</b><br><small>${fr(n, d)} = ${fr((n * 100) / d, 100)} = ${(n * 100) / d} %</small>`); },
    () => { let n, d; do { d = R(3, 7); n = R(1, d - 1); } while (gcd(n, d) > 1); const k1 = R(2, 5), k2 = R(6, 9); return { prompt: `Fülle beide Lücken:<br>${fr(n, d)} = ${fr('▢', d * k1)} = ${fr(n * k2, '▢')}`, fields: [{ answer: n * k1, label: '1. Lücke (Zähler)' }, { answer: d * k2, label: '2. Lücke (Nenner)' }], hint: 'Finde bei jedem Bruch heraus, mit welcher Zahl erweitert wurde. Zähler und Nenner werden immer mit derselben Zahl malgenommen.', solution: `1. Bruch: Nenner ${d} · ${k1} = ${d * k1}, also Zähler ${n} · ${k1} = <b>${n * k1}</b><br>2. Bruch: Zähler ${n} · ${k2} = ${n * k2}, also Nenner ${d} · ${k2} = <b>${d * k2}</b>`, answerText: `${n * k1} und ${d * k2}` }; },
    () => { const [a, b, v] = pick([[4, 6, 12], [6, 8, 24], [3, 4, 12], [6, 9, 18], [4, 10, 20], [8, 12, 24], [5, 6, 30], [10, 15, 30], [3, 8, 24]]); const n1 = R(1, a - 1), n2 = R(1, b - 1); return zahl(`Die Brüche ${fr(n1, a)} und ${fr(n2, b)} sollen denselben Nenner bekommen. Welches ist der <b>kleinste</b> Nenner, der für beide passt?`, v, `Suche die kleinste Zahl, die sowohl in der ${a}er-Reihe als auch in der ${b}er-Reihe vorkommt.`, `Vielfache von ${a}: ${[...Array(v / a)].map((_, i) => (i + 1) * a).join(', ')}<br>Vielfache von ${b}: ${[...Array(v / b)].map((_, i) => (i + 1) * b).join(', ')}<br>Kleinster gemeinsamer Nenner: <b>${v}</b><br><small>${fr(n1, a)} = ${fr((n1 * v) / a, v)} und ${fr(n2, b)} = ${fr((n2 * v) / b, v)}</small>`); });

  K('k5-bruchstrahl',
    () => { const d = pick([4, 5, 6, 8, 10]), a = R(1, d - 2), b = a + pick([1, 3]); if (b >= d + 3) return selbst('k5-bruchstrahl'); const [n, dd] = kuerze(a + b, 2 * d); return bruch(`Welcher Bruch liegt auf dem Zahlenstrahl <b>genau in der Mitte</b> zwischen ${fr(a, d)} und ${fr(b, d)}?`, n, dd, `Teile feiner: Erweitere beide Brüche mit 2. Dann liegt zwischen ihnen ${b - a === 1 ? 'genau ein' : 'ein mittlerer'} Bruch mit dem Nenner ${2 * d}.`, `Erweitert mit 2: ${fr(2 * a, 2 * d)} und ${fr(2 * b, 2 * d)}. Genau dazwischen liegt ${fr(a + b, 2 * d)}${n !== a + b ? ` = ${fr(n, dd)}` : ''}`); },
    () => { const br = shuffle([[1, 2], [2, 3], [3, 4], [3, 5], [5, 6], [7, 12], [5, 12], [1, 3], [1, 4], [5, 8], [3, 8], [7, 10], [9, 10]]).slice(0, 4), art = pick(['kleinste', 'größte']); const sort = [...br].sort((x, y) => x[0] / x[1] - y[0] / y[1]), ziel = art === 'kleinste' ? sort[0] : sort[3]; const h = br.reduce((v, b) => (v * b[1]) / gcd(v, b[1]), 1); return wahl(`Welcher Bruch ist der <b>${art}</b>?`, br.map((b) => fr(b[0], b[1])), fr(ziel[0], ziel[1]), 'Vergleiche jeden Bruch mit einem Halben. Wenn das nicht reicht: auf einen gemeinsamen Nenner bringen.', `Gemeinsamer Nenner ${h}: ${sort.map((b) => `${fr(b[0], b[1])} = ${fr((b[0] * h) / b[1], h)}`).join(', ')}<br>→ Der ${art} Bruch ist ${fr(ziel[0], ziel[1])}`); },
    () => { const ds = shuffle([3, 4, 5, 6, 8, 10, 12, 20]).slice(0, 4), max = Math.max(...ds); return wahl('Welcher Bruch liegt <b>am nächsten bei 1</b>?', ds.map((d) => fr(d - 1, d)), fr(max - 1, max), 'Jedem dieser Brüche fehlt genau ein Teil bis zum Ganzen. Bei welchem ist das fehlende Teil am kleinsten?', `Bis zur 1 fehlt jeweils ein Teil: ${ds.sort((a, b) => a - b).map((d) => fr(1, d)).join(', ')}.<br>Am kleinsten ist ${fr(1, max)}. Also liegt ${fr(max - 1, max)} am nächsten bei 1.`); },
    () => { const [a, b, mitte, falsch] = pick([[[1, 3], [1, 2], [5, 12], [[1, 4], [2, 3], [7, 12]]], [[1, 2], [3, 4], [5, 8], [[3, 8], [7, 8], [1, 4]]], [[1, 4], [1, 2], [3, 8], [[1, 8], [5, 8], [3, 4]]], [[2, 3], [1, 1], [5, 6], [[1, 2], [7, 6], [3, 5]]], [[1, 5], [2, 5], [3, 10], [[1, 10], [1, 2], [3, 5]]]]); return wahl(`Welcher Bruch liegt <b>zwischen</b> ${fr(a[0], a[1])} und ${b[1] === 1 ? '1' : fr(b[0], b[1])}?`, [mitte, ...falsch].map((x) => fr(x[0], x[1])), fr(mitte[0], mitte[1]), `Bringe die Brüche auf den Nenner ${mitte[1]} und vergleiche die Zähler.`, `Mit dem Nenner ${mitte[1]}: ${fr(a[0], a[1])} = ${fr((a[0] * mitte[1]) / a[1], mitte[1])} und ${b[1] === 1 ? '1' : fr(b[0], b[1])} = ${fr((b[0] * mitte[1]) / b[1], mitte[1])}.<br>Dazwischen liegt ${fr(mitte[0], mitte[1])}`); });

  K('k5-gemischt',
    () => { const d = pick([2, 3, 4, 5, 8]), w = R(3, 9), r = pick([1, 2, 3, 4, 5, 7].filter((x) => x < d && gcd(x, d) === 1)); return zahl(`Wie viele ${['', '', 'Halbe', 'Drittel', 'Viertel', 'Fünftel', '', '', 'Achtel'][d]} sind <b>${w} ${fr(r, d)}</b>?`, w * d + r, `Ein Ganzes hat ${d} solche Teile. Rechne erst die Ganzen um, dann kommen die restlichen Teile dazu.`, `${w} Ganze sind ${w} · ${d} = ${w * d} Teile. Dazu ${r}: <b>${w * d + r}</b><br><small>${w} ${fr(r, d)} = ${fr(w * d + r, d)}</small>`); },
    () => { const [l, glas, d] = pick([[4, 'Viertelliter', 4], [3, 'halben Liter', 2], [2, 'Achtelliter', 8], [5, 'Viertelliter', 4]]), r = pick([1, 3, 5, 7].filter((x) => x < d)), teile = l * d + r; return zahl(`In einer Kanne sind <b>${l} ${fr(r, d)} Liter</b> Saft. Wie viele Gläser mit je einem <b>${glas}</b> kann man damit füllen?`, teile, `Wie viele solche Gläser füllt ein Liter? Rechne dann für ${l} Liter und zähle den Rest dazu.`, `Ein Liter füllt ${d} Gläser. ${l} Liter füllen ${l} · ${d} = ${l * d} Gläser, die ${fr(r, d)} Liter noch ${r}.<br>→ <b>${teile} Gläser</b>`, 'Gläser'); },
    () => { const w = R(2, 5); const kand = shuffle([[`${w} ${fr(1, 3)}`, w + 1 / 3, [1, 3]], [fr(3 * w + 2, 3), w + 2 / 3, [2, 3]], [`${w} ${fr(2, 5)}`, w + 0.4, [2, 5]], [fr(4 * w + 1, 4), w + 0.25, [1, 4]], [fr(2 * w + 1, 2), w + 0.5, [1, 2]], [`${w} ${fr(3, 4)}`, w + 0.75, [3, 4]]]).slice(0, 4); const max = kand.reduce((a, b) => (b[1] > a[1] ? b : a)); return wahl('Welche Zahl ist die <b>größte</b>?', kand.map((k) => k[0]), max[0], 'Wandle die unechten Brüche in gemischte Zahlen um. Dann haben alle gleich viele Ganze, und du vergleichst nur noch die Bruchteile.', `Als gemischte Zahlen: ${kand.map((k) => `${w} ${fr(k[2][0], k[2][1])}`).join(', ')}.<br>Alle haben ${w} Ganze, also entscheiden die Bruchteile: ${fr(max[2][0], max[2][1])} ist am größten.<br>→ <b>${max[0]}</b>`); },
    () => { const d = R(4, 9), n = R(5, 12) * d + R(1, d - 1); return zahl(`Zwischen welchen ganzen Zahlen liegt ${fr(n, d)}? Tippe die <b>kleinere</b> der beiden ein.`, Math.floor(n / d), `Rechne ${n} : ${d} mit Rest.`, `${n} : ${d} = ${Math.floor(n / d)} Rest ${n % d}, also ${fr(n, d)} = ${Math.floor(n / d)} ${fr(n % d, d)}.<br>Das liegt zwischen <b>${Math.floor(n / d)}</b> und ${Math.floor(n / d) + 1}.`); });

  K('k5-umwandeln',
    () => { const [n, d] = pick([[7, 20], [9, 25], [3, 8], [13, 20], [17, 50], [5, 8], [11, 25], [7, 8], [19, 20], [3, 40]]), p = (n * 100) / d; return zahl(`Wie viel Prozent sind ${fr(n, d)}?`, p, d === 8 || d === 40 ? 'Rechne zuerst die Dezimalzahl aus (Zähler durch Nenner) und rücke dann das Komma um zwei Stellen.' : 'Erweitere auf den Nenner 100. Der Zähler ist dann die Prozentzahl.', d === 8 || d === 40 ? `${n} : ${d} = ${fmt(n / d)} → <b>${fmt(p)} %</b>` : `${fr(n, d)} = ${fr(p, 100)} = <b>${p} %</b>`, '%'); },
    () => { const p = pick([45, 35, 24, 65, 16, 85, 12, 48, 55, 72, 4, 8]), [n, d] = kuerze(p, 100); return bruch(`Schreibe <b>${p} %</b> als vollständig gekürzten Bruch.`, n, d, 'Prozent heißt Hundertstel. Schreibe den Bruch mit dem Nenner 100 und kürze, so weit es geht.', `${p} % = ${fr(p, 100)}, gekürzt mit ${p / n}: ${fr(n, d)}`, true); },
    () => { const kand = shuffle([['0,6', 0.6], [fr(5, 8), 0.625], ['58 %', 0.58], [fr(3, 5) + ' ', 0.6001], ['0,65', 0.65], [fr(2, 3), 0.6667], ['62 %', 0.62], [fr(13, 20), 0.6501]]).filter((k, i, arr) => arr.findIndex((x) => Math.abs(x[1] - k[1]) < 0.002) === i).slice(0, 3); const max = kand.reduce((a, b) => (b[1] > a[1] ? b : a)); return wahl('Welche Zahl ist die <b>größte</b>?', kand.map((k) => k[0].trim()), max[0].trim(), 'Schreibe alle drei als Dezimalzahl. Dann kannst du Stelle für Stelle vergleichen.', `Als Dezimalzahlen: ${kand.map((k) => `${k[0].trim()} ≈ ${fmt(Math.round(k[1] * 1000) / 1000)}`).join(', ')}<br>→ Am größten ist <b>${max[0].trim()}</b>`); },
    () => { const [dez, n, d] = pick([['0,125', 1, 8], ['0,375', 3, 8], ['0,04', 1, 25], ['0,45', 9, 20], ['0,875', 7, 8], ['0,16', 4, 25], ['0,025', 1, 40], ['1,25', 5, 4]]); const st = dez.split(',')[1].length; return bruch(`Schreibe <b>${dez}</b> als vollständig gekürzten Bruch.`, n, d, `${dez} hat ${st} Stellen nach dem Komma. Schreibe zuerst mit dem Nenner ${10 ** st} und kürze dann.`, `${dez} = ${fr(Math.round(+dez.replace(',', '.') * 10 ** st), 10 ** st)}, vollständig gekürzt: ${fr(n, d)}`, true); });

  K('k5-vergleich',
    () => { const st = pick([10, 100]), a = R(1, 9 * st) / st, b = U.round6(a + pick([1, 1, 5]) / st), m = U.round6((a + b) / 2); return zahl(`Welche Zahl liegt <b>genau in der Mitte</b> zwischen ${fmt(a)} und ${fmt(b)}?`, m, 'Hänge an beide Zahlen eine Null an. Das ändert den Wert nicht, aber jetzt siehst du die Zahlen dazwischen.', `Abstand: ${fmt(U.round6(b - a))}. Die Hälfte davon: ${fmt(U.round6((b - a) / 2))}.<br>${fmt(a)} + ${fmt(U.round6((b - a) / 2))} = <b>${fmt(m)}</b>`); },
    () => { const z = R(1, 8), kand = shuffle([[`0,${z}`, z / 10], [`0,${z}9`, z / 10 + 0.09], [`0,${z}09`, z / 10 + 0.009], [`0,${z + 1}`, (z + 1) / 10], [`0,${z}1`, z / 10 + 0.01], [`0,${z}99`, z / 10 + 0.099]]).slice(0, 4), art = pick(['kleinste', 'größte']); const ziel = kand.reduce((a, b) => ((art === 'größte' ? b[1] > a[1] : b[1] < a[1]) ? b : a)); return wahl(`Welche Zahl ist die <b>${art}</b>?`, kand.map((k) => k[0]), ziel[0], 'Schreibe alle Zahlen mit drei Nachkommastellen (Nullen anhängen). Dann vergleiche von links.', `Mit drei Nachkommastellen: ${[...kand].sort((a, b) => a[1] - b[1]).map((k) => k[0].padEnd(5, '0')).join(' &lt; ')}<br>→ Die ${art} Zahl ist <b>${ziel[0]}</b>`); },
    () => { const a = R(1, 8), st = pick([2, 3]), erste = `0,${a}${'0'.repeat(st - 2)}1`, letzte = `0,${a}${'9'.repeat(st - 1)}`; return zahl(`Wie viele Zahlen mit <b>${st === 2 ? 'zwei' : 'drei'} Nachkommastellen</b> liegen zwischen 0,${a} und 0,${a + 1}? (Eine davon ist zum Beispiel ${erste}.)`, 10 ** (st - 1) - 1, `Schreibe 0,${a} als 0,${a}${'0'.repeat(st - 1)} und 0,${a + 1} als 0,${a + 1}${'0'.repeat(st - 1)}. Welche Zahlen liegen dazwischen?`, `Die erste ist ${erste}, die letzte ${letzte}: Das sind <b>${10 ** (st - 1) - 1}</b> Zahlen.`); });

  K('k5-dezrunden',
    () => { const z = R(1, 9) * 10 + R(1, 8), klein = R(0, 1) === 1, r = z / 10; return zahl(`Eine Zahl mit zwei Nachkommastellen wurde auf <b>Zehntel</b> gerundet. Das Ergebnis ist <b>${fmt(r)}</b>. Wie heißt die <b>${klein ? 'kleinste' : 'größte'}</b> Zahl, die es gewesen sein kann?`, U.round6(klein ? r - 0.05 : r + 0.04), 'Ab der Ziffer 5 wird aufgerundet, bis 4 wird abgerundet. Welche Hundertstel-Ziffer ist gerade noch erlaubt?', klein ? `Gerade noch aufgerundet wird <b>${fmt(U.round6(r - 0.05))}</b> (Hundertstel-Ziffer 5).` : `Gerade noch abgerundet wird <b>${fmt(U.round6(r + 0.04))}</b> (Hundertstel-Ziffer 4).`); },
    () => { const g = R(1, 20), [x, stelle, p] = pick([[g + 0.96, 'Zehntel', 10], [g + 0.97, 'Zehntel', 10], [g + 0.995, 'Hundertstel', 100], [g + 0.998, 'Hundertstel', 100], [g + 0.95, 'Zehntel', 10]]); return zahl(`Runde <b>${fmt(U.round6(x))}</b> auf <b>${stelle}</b>.`, g + 1, 'Es wird aufgerundet. An der Rundungsstelle steht aber eine 9: Dann gibt es einen Übertrag nach links.', `Aufrunden: Aus der 9 wird 10, der Übertrag geht bis zu den Einern.<br>→ <b>${g + 1},${'0'.repeat(p === 10 ? 1 : 2)}</b> (das ist ${g + 1})`); },
    () => { const g = R(1, 9), z = R(1, 8), x = U.round6(g + z / 10 + 0.04 + R(45, 49) / 10000); return wahl(`Runde <b>${fmt(x)}</b> auf <b>Hundertstel</b>.`, [`${g},${z}4`, `${g},${z}5`, `${g},${z + 1}`], `${g},${z}4`, 'Schau nur auf die eine Ziffer direkt hinter der Rundungsstelle (die Tausendstel). Die Ziffern dahinter spielen keine Rolle.', `An der Tausendstelstelle steht eine 4: abrunden → <b>${g},${z}4</b><br><small>Falle: Wer erst die letzte Stelle rundet und dann noch einmal, kommt fälschlich auf ${g},${z}5.</small>`); });

  K('k5-dezimal',
    () => { const a = R(125, 875) / 100, ziel = pick([10, 20]); return zahl(`Welche Zahl gehört in die Lücke?<br><b>▢ + ${fmt(a)} = ${ziel}</b>`, U.round6(ziel - a), 'Rechne rückwärts: Ziehe die bekannte Zahl vom Ergebnis ab. Schreibe das Ergebnis mit zwei Nullen hinter dem Komma.', `${ziel},00 − ${fmt(a)} = <b>${fmt(U.round6(ziel - a))}</b>`); },
    () => { const a = R(2, 9), x = R(105, 495) / 100, b = R(2, 5), y = R(11, 39) / 10; return zahl(`Berechne: <b>${a} · ${fmt(x)} + ${b} · ${fmt(y)}</b>`, U.round6(a * x + b * y), 'Punkt vor Strich: erst die beiden Produkte ausrechnen, dann addieren. Komma unter Komma!', `${a} · ${fmt(x)} = ${fmt(U.round6(a * x))}<br>${b} · ${fmt(y)} = ${fmt(U.round6(b * y))}<br>Zusammen: <b>${fmt(U.round6(a * x + b * y))}</b>`); },
    () => { const x = R(12, 98) / 100, erg = U.round6((x * 100 * 1000) / 10 / 100); return zahl(`Rechne der Reihe nach: <b>${fmt(x)} · 100 : 10 · 1000 : 100</b>`, erg, 'Bei mal 10, 100, 1000 rücken die Ziffern nach links, bei geteilt nach rechts. Zähle die Stellen zusammen: Wie viele bleiben am Ende übrig?', `Nach links: 2 + 3 = 5 Stellen. Nach rechts: 1 + 2 = 3 Stellen. Bleiben 2 Stellen nach links, also · 100:<br>${fmt(x)} · 100 = <b>${fmt(erg)}</b>`); },
    () => { const z = R(12, 98) / 10, p = pick([100, 1000]); return zahl(`Welche Zahl gehört in die Lücke?<br><b>▢ · ${fmt(p)} = ${fmt(z)}</b>`, U.round6(z / p), `Rechne rückwärts: ${fmt(z)} : ${fmt(p)}. Die Ziffern rücken nach rechts, vorn füllst du mit Nullen auf.`, `${fmt(z)} : ${fmt(p)} = <b>${fmt(U.round6(z / p))}</b>`); });

  K('k5-mittel',
    () => { const n = pick([4, 5]), m = R(8, 20), w = [...Array(n - 1)].map(() => m + R(-5, 5)), x = n * m - w.reduce((a, b) => a + b, 0); if (x <= 0) return selbst('k5-mittel'); return zahl(`Der Durchschnitt von ${n} Zahlen ist <b>${m}</b>. ${n === 4 ? 'Drei' : 'Vier'} der Zahlen sind <b>${w.join(', ')}</b>. Wie heißt die fehlende Zahl?`, x, `Wenn der Durchschnitt ${m} ist, müssen alle ${n} Zahlen zusammen ${n} · ${m} ergeben.`, `Summe aller Zahlen: ${n} · ${m} = ${n * m}.<br>Bekannt: ${w.join(' + ')} = ${w.reduce((a, b) => a + b, 0)}.<br>Fehlend: ${n * m} − ${w.reduce((a, b) => a + b, 0)} = <b>${x}</b>`); },
    () => { const n = pick([3, 4]), m = R(6, 15), d = pick([1, 2, 3]), neu = m + d * (n + 1); return zahl(`Der Durchschnitt von ${n} Zahlen ist <b>${m}</b>. Jetzt kommt die Zahl <b>${neu}</b> dazu. Wie groß ist der neue Durchschnitt?`, m + d, `Die ${n} Zahlen ergeben zusammen ${n} · ${m}. Addiere die neue Zahl und teile durch ${n + 1}.`, `Alte Summe: ${n} · ${m} = ${n * m}. Neue Summe: ${n * m} + ${neu} = ${n * m + neu}.<br>${n * m + neu} : ${n + 1} = <b>${m + d}</b>`); },
    () => { const m = R(21, 49) / 10, ab = shuffle([-0.6, -0.2, 0.3, 0.5, 0, -0.4, 0.4]).slice(0, 3), w = [...ab, -ab.reduce((a, b) => a + b, 0)].map((x) => U.round6(m + x)); return zahl(`Vier Sprünge beim Weitsprung: <b>${w.map((x) => fmt(x) + ' m').join(', ')}</b>. Wie weit ist der Durchschnitt?`, m, 'Addiere alle vier Weiten (Komma unter Komma) und teile durch 4.', `Summe: ${w.map(fmt).join(' + ')} = ${fmt(U.round6(4 * m))}<br>${fmt(U.round6(4 * m))} : 4 = <b>${fmt(m)} m</b>`, 'm'); },
    () => { const m = R(2, 4), n = 5, ziel = pick([2, 3]), noten = [...Array(4)].map(() => R(1, 4)), x = n * ziel - noten.reduce((a, b) => a + b, 0); if (x < 1 || x > 6) return selbst('k5-mittel'); return zahl(`Paul hat in vier Tests die Noten <b>${noten.join(', ')}</b>. Welche Note braucht er im fünften Test, damit sein Durchschnitt genau <b>${ziel},0</b> ist?`, x, `Für den Durchschnitt ${ziel} müssen alle fünf Noten zusammen 5 · ${ziel} ergeben.`, `Nötige Summe: 5 · ${ziel} = ${5 * ziel}. Bisher: ${noten.join(' + ')} = ${noten.reduce((a, b) => a + b, 0)}.<br>${5 * ziel} − ${noten.reduce((a, b) => a + b, 0)} = Note <b>${x}</b>`); });

  // =====================================================
  // LB 3 – Geometrie
  // =====================================================
  K('k5-lage',
    () => { const [text, erg, grund] = pick([
      ['Die Gerade g ist parallel zu h. Die Gerade h ist senkrecht zu k. Die Gerade k ist parallel zu m. Wie liegen <b>g und m</b> zueinander?', 'senkrecht', 'g läuft wie h, m läuft wie k. Weil h und k senkrecht zueinander sind, sind es auch g und m.'],
      ['Die Gerade g ist senkrecht zu h. Die Gerade h ist senkrecht zu k. Die Gerade k ist senkrecht zu m. Wie liegen <b>g und m</b> zueinander?', 'senkrecht', 'g und k sind beide senkrecht zu h, also parallel. m ist senkrecht zu k, also auch senkrecht zu g.'],
      ['Die Gerade g ist senkrecht zu h. Die Gerade h ist senkrecht zu k. Wie liegen <b>g und k</b> zueinander?', 'parallel', 'Beide stehen senkrecht auf h. Dann laufen sie in dieselbe Richtung.'],
      ['Die Gerade g ist parallel zu h. Die Gerade k schneidet g, aber nicht im rechten Winkel. Wie liegen <b>k und h</b> zueinander?', 'weder parallel noch senkrecht', 'h läuft wie g. Also schneidet k auch h, und zwar unter demselben schiefen Winkel.']]);
      return wahl(text, ['parallel', 'senkrecht', 'weder parallel noch senkrecht'], erg, 'Zeichne die Geraden der Reihe nach auf Kästchenpapier. Beginne mit einer waagerechten Geraden.', `${grund}<br>→ <b>${erg}</b>`); },
    () => { const [text, erg, grund] = pick([
      ['Wie viele Kanten eines Würfels sind <b>parallel</b> zu einer bestimmten Kante? (Die Kante selbst zählt nicht mit.)', 3, 'Ein Würfel hat 12 Kanten in drei Richtungen, je 4 Kanten pro Richtung. Zu einer Kante sind also die 3 anderen ihrer Richtung parallel.'],
      ['Wie viele Kanten eines Würfels <b>treffen</b> eine bestimmte Kante und stehen <b>senkrecht</b> auf ihr?', 4, 'An jedem der beiden Enden der Kante stoßen zwei weitere Kanten im rechten Winkel an: 2 + 2 = 4.'],
      ['Wie viele Paare paralleler Seiten hat ein regelmäßiges <b>Achteck</b>?', 4, 'Im regelmäßigen Achteck liegt jeder Seite genau eine parallele Seite gegenüber: 8 Seiten bilden 4 Paare.'],
      ['Ein Rechteck wird durch eine Linie von Ecke zu Ecke (Diagonale) geteilt. Wie viele <b>rechte Winkel</b> haben die beiden Dreiecke zusammen?', 2, 'Jedes der beiden Dreiecke behält genau eine Ecke des Rechtecks, die nicht zerschnitten wird. Die anderen beiden Ecken werden von der Diagonale geteilt.'],
      ['Wie viele Paare paralleler Seiten hat ein regelmäßiges <b>Fünfeck</b>?', 0, 'Bei einer ungeraden Zahl von Seiten liegt jeder Seite eine Ecke gegenüber, keine Seite. Es gibt keine parallelen Seiten.']]);
      return { prompt: text, fields: [{ answer: erg }], hint: 'Mach dir eine Skizze oder nimm einen Würfel (zum Beispiel einen Spielwürfel) in die Hand.', solution: `${grund}<br>→ <b>${erg}</b>`, answerText: String(erg) }; },
    () => { const a = R(2, 5), b = R(2, 5), c = R(2, 6); return zahl(`Drei parallele Geraden g, h und k liegen untereinander. Der Abstand von g zu h ist <b>${a} cm</b>, der Abstand von h zu k ist <b>${b} cm</b>. Ein Punkt P liegt <b>${c} cm</b> unter k. Wie groß ist der Abstand von P zur Geraden g?`, a + b + c, 'Abstände werden senkrecht gemessen. Hier liegen alle Strecken auf einer senkrechten Linie hintereinander.', `${a} cm + ${b} cm + ${c} cm = <b>${a + b + c} cm</b>`, 'cm'); });

  K('k5-koord',
    () => { const x1 = R(0, 4), y1 = R(0, 4), w = R(2, 5), h = R(2, 5); return punkt(`Ein Rechteck hat die Eckpunkte A(${x1} | ${y1}), B(${x1 + w} | ${y1}) und C(${x1 + w} | ${y1 + h}). Seine Seiten sind parallel zu den Achsen. Welche Koordinaten hat der vierte Eckpunkt <b>P</b>?`, x1, y1 + h, 'Der vierte Punkt liegt genau über A und auf derselben Höhe wie C.', `P liegt über A, hat also denselben x-Wert: ${x1}. P liegt auf der Höhe von C, hat also denselben y-Wert: ${y1 + h}.<br>→ <b>P(${x1} | ${y1 + h})</b>`); },
    () => { const x1 = R(0, 5), y1 = R(0, 5), dx = R(1, 3) * 2, dy = R(0, 3) * 2; return punkt(`Welcher Punkt <b>P</b> liegt genau in der Mitte der Strecke von A(${x1} | ${y1}) nach B(${x1 + dx} | ${y1 + dy})?`, x1 + dx / 2, y1 + dy / 2, 'Gehe von A aus die Hälfte des Weges: die halbe Strecke nach rechts und die halbe Strecke nach oben.', `Von A nach B: ${dx} nach rechts, ${dy} nach oben. Die Hälfte: ${dx / 2} nach rechts, ${dy / 2} nach oben.<br>→ <b>P(${x1 + dx / 2} | ${y1 + dy / 2})</b>`); },
    () => { const x1 = R(0, 3), y1 = R(0, 3), ux = R(3, 5), vx = R(1, 2), vy = R(2, 4); return punkt(`ABCP ist ein Parallelogramm mit A(${x1} | ${y1}), B(${x1 + ux} | ${y1}) und C(${x1 + ux + vx} | ${y1 + vy}). Welche Koordinaten hat der vierte Eckpunkt <b>P</b>?`, x1 + vx, y1 + vy, 'Der Weg von B nach C ist derselbe wie der Weg von A nach P (gegenüberliegende Seiten sind parallel und gleich lang).', `Von B nach C: ${vx} nach rechts, ${vy} nach oben. Denselben Weg von A aus gehen:<br>→ <b>P(${x1 + vx} | ${y1 + vy})</b>`); },
    () => { const x1 = R(0, 4), y1 = R(0, 4), w = R(2, 6), h = R(2, 5); return zahl(`Ein Rechteck hat die Eckpunkte A(${x1} | ${y1}), B(${x1 + w} | ${y1}), C(${x1 + w} | ${y1 + h}) und D(${x1} | ${y1 + h}). Eine Einheit ist 1 cm. Wie groß ist sein <b>Umfang</b>?`, 2 * (w + h), 'Lies die Seitenlängen aus den Koordinaten ab: Unterschied der x-Werte und Unterschied der y-Werte.', `Breite: ${x1 + w} − ${x1} = ${w} cm. Höhe: ${y1 + h} − ${y1} = ${h} cm.<br>Umfang: 2 · (${w} + ${h}) = <b>${2 * (w + h)} cm</b>`, 'cm'); });

  K('k5-winkelart',
    () => { const h = R(1, 11), w = h <= 6 ? h * 30 : (12 - h) * 30; return zahl(`Es ist genau <b>${h} Uhr</b>. Wie groß ist der kleinere Winkel zwischen dem Stunden- und dem Minutenzeiger?`, w, 'Das Zifferblatt hat 12 Stunden. Von einer Stundenzahl zur nächsten sind es 360° : 12.', `Zwischen zwei benachbarten Stundenzahlen liegen 30°. Zwischen der 12 und der ${h} liegen ${h <= 6 ? h : 12 - h} solche Schritte: <b>${w}°</b>`, '°'); },
    () => { const ri = ['Norden', 'Nordosten', 'Osten', 'Südosten', 'Süden', 'Südwesten', 'Westen', 'Nordwesten'], a = R(0, 7), k = R(1, 7); return zahl(`Du schaust nach <b>${ri[a]}</b> und drehst dich im Uhrzeigersinn (rechts herum), bis du nach <b>${ri[(a + k) % 8]}</b> schaust. Um wie viel Grad hast du dich gedreht?`, k * 45, 'Eine volle Drehung hat 360°. Von einer Haupthimmelsrichtung zur nächsten (zum Beispiel Norden nach Osten) sind es 90°, bis zur Zwischenrichtung 45°.', `Von ${ri[a]} nach ${ri[(a + k) % 8]} ${k === 1 ? 'ist es ein Schritt von 45°' : `sind es ${k} Schritte von je 45°: ${k} · 45°`} = <b>${k * 45}°</b>`, '°'); },
    () => { const w = pick([35, 50, 70, 95, 100, 125, 60, 85, 110]), f = pick([2, 3]), erg = w * f; const art = erg < 90 ? 'spitzer Winkel' : erg === 90 ? 'rechter Winkel' : erg < 180 ? 'stumpfer Winkel' : erg === 180 ? 'gestreckter Winkel' : 'überstumpfer Winkel'; return wahl(`Ein Winkel ist <b>${f === 2 ? 'doppelt' : 'dreimal'} so groß</b> wie ein Winkel von ${w}°. Welche Winkelart ist das?`, ['spitzer Winkel', 'rechter Winkel', 'stumpfer Winkel', 'gestreckter Winkel', 'überstumpfer Winkel'].filter((x) => x === art || ['spitzer Winkel', 'stumpfer Winkel', 'überstumpfer Winkel', 'gestreckter Winkel'].includes(x)).slice(0, 4), art, 'Rechne den Winkel zuerst aus. Grenzen: 90° (rechter Winkel) und 180° (gestreckter Winkel).', `${f} · ${w}° = ${erg}°. Das ist ${erg < 90 ? 'kleiner als 90°' : erg < 180 ? 'zwischen 90° und 180°' : erg === 180 ? 'genau 180°' : 'größer als 180°'}: <b>${art}</b>`); },
    () => { const [n, d] = pick([[1, 4], [3, 4], [1, 3], [2, 3], [1, 8], [3, 8], [5, 6], [1, 12], [5, 12]]); return zahl(`Wie viel Grad hat ${fr(n, d)} einer vollen Drehung?`, (360 / d) * n, 'Eine volle Drehung hat 360°. Teile erst durch den Nenner, nimm dann mit dem Zähler mal.', `360° : ${d} = ${360 / d}°, dann ${360 / d}° · ${n} = <b>${(360 / d) * n}°</b>`, '°'); });

  K('k5-winkelmessen',
    () => { const min = pick([5, 10, 15, 20, 25, 35, 40, 50]); return zahl(`Um wie viel Grad dreht sich der <b>Minutenzeiger</b> einer Uhr in <b>${min} Minuten</b>?`, min * 6, 'In 60 Minuten macht der Minutenzeiger eine volle Drehung (360°). Wie viel Grad sind das pro Minute?', `360° : 60 = 6° pro Minute. ${min} · 6° = <b>${min * 6}°</b>`, '°'); },
    () => { const [t, text] = pick([[60, '1 Stunde'], [120, '2 Stunden'], [20, '20 Minuten'], [30, 'einer halben Stunde'], [90, 'anderthalb Stunden'], [40, '40 Minuten'], [180, '3 Stunden']]); return zahl(`Um wie viel Grad dreht sich der <b>Stundenzeiger</b> einer Uhr in <b>${text}</b>?`, t / 2, 'Der Stundenzeiger braucht für eine volle Drehung (360°) 12 Stunden. Wie viel Grad schafft er in einer Stunde?', `360° : 12 = 30° pro Stunde, also 1° in 2 Minuten.<br>In ${text.replace('einer halben', 'einer halben')}: <b>${t / 2}°</b>`, '°'); },
    () => { const voll = R(0, 1) === 1, n = voll ? 4 : 3, ziel = voll ? 360 : 180; let w; do w = [...Array(n - 1)].map(() => R(5, voll ? 26 : 15) * 5); while (w.reduce((a, b) => a + b, 0) >= ziel - 15); const x = ziel - w.reduce((a, b) => a + b, 0); return zahl(`${n === 3 ? 'Drei' : 'Vier'} Winkel liegen nebeneinander und bilden zusammen einen <b>${voll ? 'Vollwinkel' : 'gestreckten Winkel'}</b>. ${n === 3 ? 'Zwei' : 'Drei'} davon sind <b>${w.map((x2) => x2 + '°').join(', ')}</b> groß. Wie groß ist der letzte?`, x, `Ein ${voll ? 'Vollwinkel hat 360°' : 'gestreckter Winkel hat 180°'}. Ziehe die bekannten Winkel ab.`, `${ziel}° − ${w.join('° − ')}° = <b>${x}°</b>`, '°'); },
    () => { const w = R(5, 16) * 10; return zahl(`Ein Winkel von <b>${w}°</b> wird halbiert. Eine der beiden Hälften wird noch einmal halbiert. Wie groß ist der kleinste Winkel, der dabei entsteht?`, w / 4, 'Zweimal halbieren heißt: durch 4 teilen.', `${w}° : 2 = ${w / 2}°, dann ${w / 2}° : 2 = <b>${fmt(w / 4)}°</b>`, '°'); });

  K('k5-winkelpaar',
    () => { const f = pick([2, 3, 4, 5, 8]), kl = 180 / (f + 1); return zahl(`Ein Winkel ist <b>${f === 2 ? 'doppelt' : f + '-mal'} so groß</b> wie sein Nebenwinkel. Wie groß ist der <b>größere</b> der beiden Winkel?`, kl * f, `Nebenwinkel ergeben zusammen 180°. Stell dir den kleineren als ein Teil vor: Dann sind es zusammen ${f + 1} gleiche Teile.`, `Zusammen ${f + 1} Teile = 180°, ein Teil = ${kl}°.<br>Der größere Winkel: ${f} · ${kl}° = <b>${kl * f}°</b>`, '°'); },
    () => { const a = R(4, 16) * 5; return zahl(`Zwei Geraden schneiden sich. Einer der vier Winkel ist <b>${a}°</b> groß. Wie groß sind die beiden <b>stumpfen</b> Winkel zusammen?`, 2 * (180 - a), 'Der Nebenwinkel ist stumpf. Sein Scheitelwinkel gegenüber ist genauso groß.', `Nebenwinkel: 180° − ${a}° = ${180 - a}°. Der Scheitelwinkel gegenüber ist gleich groß.<br>${180 - a}° + ${180 - a}° = <b>${2 * (180 - a)}°</b>`, '°'); },
    () => { const a = R(7, 29) * 5; if (a === 90) return selbst('k5-winkelpaar'); return zahl(`Die Geraden g und h sind parallel und werden von einer dritten Geraden geschnitten. An g entsteht der Winkel α = <b>${a}°</b>. β ist der Stufenwinkel von α an der Geraden h. Wie groß ist der <b>Nebenwinkel von β</b>?`, 180 - a, 'Zwei Schritte: Stufenwinkel an parallelen Geraden sind gleich groß. Nebenwinkel ergeben zusammen 180°.', `β = α = ${a}° (Stufenwinkel).<br>Nebenwinkel von β: 180° − ${a}° = <b>${180 - a}°</b>`, '°'); },
    () => { const d = R(1, 8) * 20, gr = (180 + d) / 2; return zahl(`Zwei Nebenwinkel unterscheiden sich um <b>${d}°</b>. Wie groß ist der <b>größere</b>?`, gr, `Zusammen sind es 180°. Nimm den Unterschied ${d}° erst weg, teile den Rest gerecht auf, und gib den Unterschied dem größeren Winkel zurück.`, `180° − ${d}° = ${180 - d}°, die Hälfte ist ${(180 - d) / 2}° (der kleinere Winkel).<br>Der größere: ${(180 - d) / 2}° + ${d}° = <b>${gr}°</b>`, '°'); });

  K('k5-symmetrie',
    () => { const art = R(0, 2);
      if (art === 0) { const r = pick(['H', 'I']), f = shuffle(['A', 'T', 'M', 'N', 'S', 'F', 'E', 'Z']).slice(0, 3); return wahl('Welcher dieser Großbuchstaben (in einfacher Druckschrift) hat <b>genau zwei</b> Symmetrieachsen?', [r, ...f], r, 'Prüfe bei jedem Buchstaben zwei Faltlinien: eine senkrechte und eine waagerechte.', `<b>${r}</b> kann man senkrecht <b>und</b> waagerecht falten. Die anderen haben höchstens eine Symmetrieachse.`); }
      if (art === 1) { const r = pick(['N', 'S', 'Z']), f = shuffle(['A', 'T', 'M', 'E', 'B', 'F', 'L', 'U']).slice(0, 3); return wahl('Welcher dieser Großbuchstaben hat <b>keine</b> Symmetrieachse, sieht aber nach einer <b>halben Drehung</b> wieder genauso aus (punktsymmetrisch)?', [r, ...f], r, 'Stell dir vor, du drehst das Blatt auf den Kopf. Welcher Buchstabe sieht dann unverändert aus?', `<b>${r}</b> lässt sich nicht deckungsgleich falten, aber nach einer halben Drehung (180°) liegt er wieder genau auf sich selbst.`); }
      const r = pick(['F', 'G', 'J', 'L', 'P', 'R']), f = shuffle(['A', 'H', 'M', 'T', 'N', 'S', 'Z', 'I']).slice(0, 3); return wahl('Welcher dieser Großbuchstaben ist <b>weder</b> achsensymmetrisch <b>noch</b> punktsymmetrisch?', [r, ...f], r, 'Prüfe bei jedem Buchstaben: falten (senkrecht oder waagerecht) und auf den Kopf drehen.', `<b>${r}</b> hat keine Faltlinie und sieht auf dem Kopf anders aus. Die anderen haben eine Symmetrieachse oder sind punktsymmetrisch.`); },
    () => { const n = pick([5, 6, 8, 10]), name = { 5: 'Fünfeck', 6: 'Sechseck', 8: 'Achteck', 10: 'Zehneck' }[n]; return zahl(`Wie viele Symmetrieachsen hat ein regelmäßiges <b>${name}</b>?`, n, n % 2 ? 'Jede Achse geht durch eine Ecke und die Mitte der gegenüberliegenden Seite.' : 'Es gibt zwei Sorten von Achsen: von Ecke zu Ecke und von Seitenmitte zu Seitenmitte.', n % 2 ? `Durch jede der ${n} Ecken geht genau eine Achse: <b>${n}</b>` : `${n / 2} Achsen von Ecke zu Ecke und ${n / 2} von Seitenmitte zu Seitenmitte: <b>${n}</b><br><small>Ein regelmäßiges Vieleck hat immer so viele Symmetrieachsen wie Ecken.</small>`); },
    () => { const x = R(0, 3), y = R(0, 3), sx = R(x + 1, 5), sy = R(y + 1, 5); return punkt(`Der Punkt A(${x} | ${y}) wird zuerst an der senkrechten Geraden durch x = ${sx} gespiegelt. Der Bildpunkt wird dann an der waagerechten Geraden durch y = ${sy} gespiegelt. Wo liegt der Punkt <b>P</b> am Ende?`, 2 * sx - x, 2 * sy - y, 'Beim Spiegeln ist der Bildpunkt genauso weit von der Geraden entfernt wie der Punkt, nur auf der anderen Seite. Die erste Spiegelung ändert nur x, die zweite nur y.', `1. Spiegelung: A ist ${sx - x} links von der Geraden, der Bildpunkt ${sx - x} rechts davon: x = ${2 * sx - x}.<br>2. Spiegelung: ${sy - y} unter der Geraden wird zu ${sy - y} darüber: y = ${2 * sy - y}.<br>→ <b>P(${2 * sx - x} | ${2 * sy - y})</b>`); },
    () => { const x = R(0, 4), y = R(0, 3), a = R(2, 5), b = R(1, 4), c = R(1, a - 1), d = R(1, 4); return punkt(`Der Punkt A(${x} | ${y}) wird zweimal verschoben: erst um ${a} nach rechts und ${b} nach oben, dann um ${c} nach links und ${d} nach oben. Wo liegt der Punkt <b>P</b> am Ende?`, x + a - c, y + b + d, 'Fasse beide Verschiebungen zu einer zusammen: Wie weit geht es insgesamt nach rechts, wie weit nach oben?', `Insgesamt: ${a} − ${c} = ${a - c} nach rechts, ${b} + ${d} = ${b + d} nach oben.<br>→ <b>P(${x + a - c} | ${y + b + d})</b>`); });

  // =====================================================
  // LB 4 – Rechtecke und Quader
  // =====================================================
  K('k5-rechteck',
    () => { const a = R(4, 12), b = R(3, 9); return zahl(`Ein Rechteck hat den Flächeninhalt <b>${a * b} cm²</b>. Eine Seite ist <b>${a} cm</b> lang. Wie groß ist der <b>Umfang</b>?`, 2 * (a + b), 'Zwei Schritte: erst die fehlende Seite ausrechnen (Fläche durch Seite), dann den Umfang.', `Fehlende Seite: ${a * b} : ${a} = ${b} cm.<br>Umfang: 2 · (${a} + ${b}) = <b>${2 * (a + b)} cm</b>`, 'cm'); },
    () => { const s = R(4, 15); return zahl(`Ein Quadrat hat den Umfang <b>${4 * s} cm</b>. Wie groß ist sein <b>Flächeninhalt</b>?`, s * s, 'Alle vier Seiten sind gleich lang. Rechne erst die Seitenlänge aus.', `Seite: ${4 * s} : 4 = ${s} cm.<br>Fläche: ${s} · ${s} = <b>${s * s} cm²</b>`, 'cm²'); },
    () => { const b = R(6, 10), a = b + R(2, 5), c = R(2, 4), d = R(2, 4), flaeche = R(0, 1) === 1; return zahl(`Aus einem Rechteck mit ${a} cm und ${b} cm Seitenlänge wird an einer <b>Ecke</b> ein kleines Rechteck mit ${c} cm und ${d} cm herausgeschnitten. Wie groß ist ${flaeche ? 'der <b>Flächeninhalt</b>' : 'der <b>Umfang</b>'} der Figur, die übrig bleibt?`, flaeche ? a * b - c * d : 2 * (a + b), flaeche ? 'Großes Rechteck minus kleines Rechteck.' : 'Zeichne die Figur auf. Die beiden neuen Kanten in der Ecke sind genauso lang wie die Stücke, die außen weggefallen sind.', flaeche ? `${a} · ${b} − ${c} · ${d} = ${a * b} − ${c * d} = <b>${a * b - c * d} cm²</b>` : `Außen fallen ${c} cm und ${d} cm weg, innen kommen ${c} cm und ${d} cm dazu. Der Umfang bleibt gleich:<br>2 · (${a} + ${b}) = <b>${2 * (a + b)} cm</b>`, flaeche ? 'cm²' : 'cm'); },
    () => { const b = R(3, 9), f = pick([2, 3]); return zahl(`Ein Rechteck hat den Umfang <b>${2 * (b + f * b)} cm</b>. Es ist <b>${f === 2 ? 'doppelt' : 'dreimal'} so lang wie breit</b>. Wie groß ist sein Flächeninhalt?`, f * b * b, `Der halbe Umfang ist Länge plus Breite. Das sind ${f + 1} gleiche Teile (${f} für die Länge, 1 für die Breite).`, `Halber Umfang: ${b + f * b} cm = ${f + 1} Teile, ein Teil = ${b} cm.<br>Breite ${b} cm, Länge ${f * b} cm. Fläche: ${f * b} · ${b} = <b>${f * b * b} cm²</b>`, 'cm²'); });

  K('k5-netze',
    () => { const oben = R(1, 6); let vorn; do vorn = R(1, 6); while (vorn === oben || vorn === 7 - oben); const art = R(0, 1); return art ? zahl(`Bei einem Spielwürfel ergeben gegenüberliegende Seiten zusammen immer 7. Oben liegt die <b>${oben}</b>. Wie groß ist die <b>Summe der vier Seitenflächen</b> ringsherum?`, 14, 'Alle sechs Zahlen zusammen ergeben 1 + 2 + 3 + 4 + 5 + 6. Oben und unten zusammen sind 7.', `Alle Augen: 21. Oben und unten zusammen: ${oben} + ${7 - oben} = 7.<br>21 − 7 = <b>14</b><br><small>Das ist bei jedem Wurf so.</small>`) : zahl(`Bei einem Spielwürfel ergeben gegenüberliegende Seiten zusammen immer 7. Oben liegt die <b>${oben}</b>, vorn die <b>${vorn}</b>. Wie groß ist die Summe der Zahlen <b>unten und hinten</b>?`, 14 - oben - vorn, 'Unten liegt die Zahl gegenüber von oben, hinten die Zahl gegenüber von vorn.', `Unten: 7 − ${oben} = ${7 - oben}. Hinten: 7 − ${vorn} = ${7 - vorn}.<br>${7 - oben} + ${7 - vorn} = <b>${14 - oben - vorn}</b>`); },
    () => { const a = R(3, 9), b = R(2, 7), c = R(2, 6); return zahl(`Aus Draht soll das Kantenmodell eines Quaders mit den Kantenlängen <b>${a} cm, ${b} cm und ${c} cm</b> gebaut werden. Wie viel Draht braucht man insgesamt?`, 4 * (a + b + c), 'Ein Quader hat 12 Kanten: Jede der drei Längen kommt 4-mal vor.', `4 · ${a} + 4 · ${b} + 4 · ${c} = 4 · ${a + b + c} = <b>${4 * (a + b + c)} cm</b>`, 'cm'); },
    () => { const [frage, erg, grund] = pick([['genau <b>drei</b> rote Flächen', 8, 'Das sind die Würfel an den 8 Ecken.'], ['genau <b>zwei</b> rote Flächen', 12, 'Das sind die Würfel in der Mitte jeder der 12 Kanten.'], ['genau <b>eine</b> rote Fläche', 6, 'Das sind die Würfel in der Mitte jeder der 6 Flächen.'], ['<b>keine</b> rote Fläche', 1, 'Das ist nur der eine Würfel ganz im Inneren.']]); return { prompt: `Ein großer Würfel wird aus 3 · 3 · 3 = 27 kleinen Würfeln zusammengesetzt und außen rot angemalt. Wie viele der kleinen Würfel haben ${frage}?`, fields: [{ answer: erg }], hint: 'Unterscheide: Würfel an den Ecken, Würfel in der Mitte einer Kante, Würfel in der Mitte einer Fläche und der Würfel ganz innen.', solution: `${grund}<br>→ <b>${erg}</b><br><small>Alle zusammen: 8 + 12 + 6 + 1 = 27.</small>`, answerText: String(erg) }; },
    () => { const k = pick([3, 4]), n = R(8, k ** 3 - 6); return zahl(`Ein Bauwerk besteht aus <b>${n}</b> gleich großen Würfeln. Wie viele Würfel fehlen noch, um daraus einen großen Würfel mit <b>${k} Würfeln Kantenlänge</b> zu bauen?`, k ** 3 - n, `Wie viele kleine Würfel hat der große Würfel? ${k} Schichten mit je ${k} · ${k} Würfeln.`, `Großer Würfel: ${k} · ${k} · ${k} = ${k ** 3} Würfel.<br>${k ** 3} − ${n} = <b>${k ** 3 - n}</b>`); });

  K('k5-quader',
    () => { const a = R(3, 9), b = R(2, 8), c = R(2, 7); return zahl(`Ein Quader hat das Volumen <b>${a * b * c} cm³</b>. Er ist <b>${a} cm</b> lang und <b>${b} cm</b> breit. Wie hoch ist er?`, c, 'Rechne zuerst die Grundfläche aus (Länge mal Breite). Das Volumen ist Grundfläche mal Höhe.', `Grundfläche: ${a} · ${b} = ${a * b} cm².<br>Höhe: ${a * b * c} : ${a * b} = <b>${c} cm</b>`, 'cm'); },
    () => { const a = pick([4, 5, 6, 8]), b = pick([2, 3, 5]), h = R(2, 5), liter = a * b * h; return zahl(`Ein Aquarium ist innen <b>${a} dm</b> lang und <b>${b} dm</b> breit. Es werden <b>${liter} Liter</b> Wasser eingefüllt. Wie hoch steht das Wasser?`, h, '1 Liter ist genau 1 dm³. Rechne die Grundfläche aus und überlege, wie hoch das Wasser stehen muss.', `${liter} Liter = ${liter} dm³. Grundfläche: ${a} · ${b} = ${a * b} dm².<br>Höhe: ${liter} : ${a * b} = <b>${h} dm</b>`, 'dm'); },
    () => { const s = R(2, 9); return zahl(`Ein Würfel hat den Oberflächeninhalt <b>${6 * s * s} cm²</b>. Wie groß ist sein <b>Volumen</b>?`, s ** 3, 'Ein Würfel hat 6 gleich große Quadrate als Flächen. Wie groß ist eine davon? Wie lang ist dann eine Kante?', `Eine Fläche: ${6 * s * s} : 6 = ${s * s} cm², also Kantenlänge ${s} cm (denn ${s} · ${s} = ${s * s}).<br>Volumen: ${s} · ${s} · ${s} = <b>${s ** 3} cm³</b>`, 'cm³'); },
    () => { const f = pick([2, 3]), vol = R(0, 1) === 1; return zahl(`Bei einem Quader werden <b>alle Kanten ${f === 2 ? 'verdoppelt' : 'verdreifacht'}</b>. Wievielmal so groß wird ${vol ? 'sein <b>Volumen</b>' : 'sein <b>Oberflächeninhalt</b>'}?`, vol ? f ** 3 : f * f, 'Probiere es mit einem kleinen Quader aus, zum Beispiel mit den Kanten 1 cm, 2 cm und 3 cm.', vol ? `Länge, Breite und Höhe werden jeweils ${f}-mal so groß: ${f} · ${f} · ${f} = <b>${f ** 3}-mal</b> so viel Volumen.` : `Jede Fläche wird in beiden Richtungen ${f}-mal so groß: ${f} · ${f} = <b>${f * f}-mal</b> so viel Oberfläche.`, '-mal'); });

  // =====================================================
  // LB 5 – Mathematik im Alltag
  // =====================================================
  K('k5-einheit',
    () => { const km = R(1, 4), m1 = R(1, 19) * 50, m2 = R(11, 95) * 10; return zahl(`Rechne in Meter um und addiere: <b>${km} km ${m1} m + ${m2} m</b>`, km * 1000 + m1 + m2, '1 km = 1000 m. Rechne erst alles in Meter um.', `${km} km ${m1} m = ${fmt(km * 1000 + m1)} m.<br>${fmt(km * 1000 + m1)} m + ${m2} m = <b>${fmt(km * 1000 + m1 + m2)} m</b>`, 'm'); },
    () => { const [text, erg, weg] = pick([['Wie viele <b>Sekunden</b> hat ein Tag?', 86400, '24 h · 60 = 1440 min, dann 1440 · 60 = 86 400 s'], ['Wie viele <b>Minuten</b> hat eine Woche?', 10080, '7 · 24 h = 168 h, dann 168 · 60 = 10 080 min'], ['Wie viele <b>Stunden</b> hat der Monat November (30 Tage)?', 720, '30 · 24 h = 720 h'], ['Wie viele <b>Sekunden</b> hat eine Schulstunde von 45 Minuten?', 2700, '45 · 60 s = 2700 s'], ['Wie viele <b>Minuten</b> sind zweieinhalb Tage?', 3600, '2,5 · 24 h = 60 h, dann 60 · 60 = 3600 min']]); return zahl(text, erg, 'Rechne in Schritten um: Tage in Stunden (· 24), Stunden in Minuten (· 60), Minuten in Sekunden (· 60).', `${weg}<br>→ <b>${fmt(erg)}</b>`); },
    () => { const [text, erg, weg, suf] = pick([['3,5 m² in cm²', 35000, '1 m² = 100 dm² = 10 000 cm². 3,5 · 10 000', 'cm²'], ['0,25 Liter in cm³', 250, '1 Liter = 1 dm³ = 1000 cm³. 0,25 · 1000', 'cm³'], ['2 m³ in Liter', 2000, '1 m³ = 1000 dm³ = 1000 Liter. 2 · 1000', 'l'], ['45 000 cm² in m²', 4.5, '10 000 cm² = 1 m². 45 000 : 10 000', 'm²'], ['0,06 km in cm', 6000, '0,06 km = 60 m, und 60 · 100', 'cm'], ['750 000 mm² in dm²', 75, '100 mm² = 1 cm², 100 cm² = 1 dm². 750 000 : 10 000', 'dm²']]); return zahl(`Rechne um: <b>${text}</b>`, erg, 'Bei Flächen ist die Umrechnungszahl 100, bei Rauminhalten 1000. Gehe Schritt für Schritt von Einheit zu Einheit.', `${weg} = <b>${fmt(erg)} ${suf}</b>`, suf); },
    () => { const sets = [['g', [['1500 g', 1500], ['1,4 kg', 1400], ['0,0016 t', 1600]]], ['m', [['2,5 km', 2500], ['2450 m', 2450], ['26 000 dm', 2600]]], ['min', [['90 min', 90], ['1,4 h', 84], ['5520 s', 92]]], ['ml', [['0,7 l', 700], ['650 ml', 650], ['720 cm³', 720]]], ['g', [[fr(3, 4) + ' kg', 750], ['700 g', 700], ['0,8 kg', 800]]]]; const [einheit, s] = pick(sets), max = s.reduce((a, b) => (b[1] > a[1] ? b : a)); return wahl('Welche Angabe ist die <b>größte</b>?', s.map((x) => x[0]), max[0], 'Rechne alle drei Angaben in dieselbe Einheit um.', `In ${einheit} umgerechnet: ${s.map((x) => `${x[0]} = ${fmt(x[1])} ${einheit}`).join(', ')}<br>→ Am größten: <b>${max[0]}</b>`); });

  K('k5-fahrplan',
    () => { const ab = 21 * 60 + R(5, 170), dauer = R(380, 560); return zahl(`Ein Nachtzug fährt um <b>${hm(ab)} Uhr</b> ab und kommt am nächsten Morgen um <b>${hm(ab + dauer)} Uhr</b> an. Wie viele <b>Minuten</b> ist er unterwegs?`, dauer, 'Rechne in zwei Teilen: erst bis Mitternacht (24:00 Uhr), dann von 0:00 Uhr bis zur Ankunft.', `Bis Mitternacht: ${24 * 60 - ab} min. Nach Mitternacht: ${Math.floor((ab + dauer - 1440) / 60)} h ${(ab + dauer) % 60} min = ${ab + dauer - 1440} min.<br>${24 * 60 - ab} + ${ab + dauer - 1440} = <b>${dauer} min</b>`, 'min'); },
    () => { const an = R(11, 19) * 60 + R(2, 28), dauer = R(95, 215); return uhr(`Ein Zug braucht <b>${Math.floor(dauer / 60)} h ${dauer % 60} min</b> und soll um <b>${hm(an)} Uhr</b> ankommen. Wann muss er abfahren?`, an - dauer, 'Rechne rückwärts: erst die vollen Stunden abziehen, dann die Minuten. Wenn die Minuten nicht reichen, geht es über die volle Stunde zurück.', `${hm(an)} Uhr minus ${Math.floor(dauer / 60)} h = ${hm(an - Math.floor(dauer / 60) * 60)} Uhr.<br>Dann noch ${dauer % 60} min zurück: <b>${hm(an - dauer)} Uhr</b>`); },
    () => { const ab = R(7, 12) * 60 + R(3, 55), f1 = R(35, 85), warten = R(8, 25), f2 = R(50, 130); return uhr(`Abfahrt um <b>${hm(ab)} Uhr</b>. Die erste Fahrt dauert <b>${f1} min</b>. Dann <b>${warten} min</b> umsteigen. Die zweite Fahrt dauert <b>${Math.floor(f2 / 60) ? Math.floor(f2 / 60) + ' h ' : ''}${f2 % 60} min</b>. Wann kommst du an?`, ab + f1 + warten + f2, 'Addiere erst alle Zeiten in Minuten und rechne dann in Stunden und Minuten um.', `${f1} + ${warten} + ${f2} = ${f1 + warten + f2} min = ${Math.floor((f1 + warten + f2) / 60)} h ${(f1 + warten + f2) % 60} min.<br>${hm(ab)} Uhr + ${Math.floor((f1 + warten + f2) / 60)} h ${(f1 + warten + f2) % 60} min = <b>${hm(ab + f1 + warten + f2)} Uhr</b>`); },
    () => { const start = 8 * 60 + pick([0, 10, 15, 30]), st = R(3, 5), pause = pick([10, 15, 20]); return uhr(`Der Unterricht beginnt um <b>${hm(start)} Uhr</b>. Es gibt <b>${st} Stunden</b> zu je 45 Minuten. Zwischen zwei Stunden ist jeweils <b>${pause} Minuten</b> Pause. Wann endet die letzte Stunde?`, start + st * 45 + (st - 1) * pause, `Achtung bei den Pausen: Zwischen ${st} Stunden liegen nur ${st - 1} Pausen.`, `${st} · 45 min = ${st * 45} min. Pausen: ${st - 1} · ${pause} min = ${(st - 1) * pause} min. Zusammen ${st * 45 + (st - 1) * pause} min = ${Math.floor((st * 45 + (st - 1) * pause) / 60)} h ${(st * 45 + (st - 1) * pause) % 60} min.<br>→ <b>${hm(start + st * 45 + (st - 1) * pause)} Uhr</b>`); });

  K('k5-sach',
    () => { const h = R(5, 12) * 10, n1 = R(2, 4), s = R(8, 19) * 10, n2 = R(2, 3), ges = n1 * h + n2 * s; return zahl(`${n1} Hefte und ${n2} Stifte kosten zusammen <b>${euro(ges)}</b>. Ein Heft kostet <b>${euro(h)}</b>. Wie viel kostet ein Stift?`, s / 100, 'Rechne erst aus, was die Hefte zusammen kosten. Der Rest ist für die Stifte.', `Hefte: ${n1} · ${euro(h)} = ${euro(n1 * h)}. Für die Stifte bleiben ${euro(ges)} − ${euro(n1 * h)} = ${euro(n2 * s)}.<br>Ein Stift: ${euro(n2 * s)} : ${n2} = <b>${euro(s)}</b>`, '€'); },
    () => { const einzel = R(7, 12) * 10, pack = 6 * einzel - R(3, 9) * 10, n = pick([12, 18, 24]); return zahl(`Eine Flasche Saft kostet einzeln <b>${euro(einzel)}</b>. Der Sechserpack kostet <b>${euro(pack)}</b>. Wie viel <b>spart</b> man, wenn man ${n} Flaschen in Sechserpacks statt einzeln kauft?`, ((n * einzel) - (n / 6) * pack) / 100, 'Rechne beide Wege aus: alle Flaschen einzeln und alle in Packs. Vergleiche.', `Einzeln: ${n} · ${euro(einzel)} = ${euro(n * einzel)}.<br>In Packs: ${n / 6} · ${euro(pack)} = ${euro((n / 6) * pack)}.<br>Ersparnis: <b>${euro(n * einzel - (n / 6) * pack)}</b>`, '€'); },
    () => { const ziel = R(40, 120) * 100 + 99, hat = R(8, 30) * 100, woche = pick([250, 350, 400, 450, 500]), n = Math.ceil((ziel - hat) / woche); return zahl(`Ein Spiel kostet <b>${euro(ziel)}</b>. Du hast schon <b>${euro(hat)}</b> und sparst jede Woche <b>${euro(woche)}</b>. Nach wie vielen Wochen kannst du es frühestens kaufen?`, n, 'Wie viel fehlt noch? Teile durch den Betrag pro Woche. Bleibt ein Rest, brauchst du eine Woche mehr.', `Es fehlen ${euro(ziel)} − ${euro(hat)} = ${euro(ziel - hat)}.<br>Nach ${n - 1} Wochen hast du erst ${euro(hat + (n - 1) * woche)}, nach <b>${n} Wochen</b> ${euro(hat + n * woche)}. Das reicht.`, 'Wochen'); },
    () => { const p = [R(2, 9) * 100 + 49, R(1, 5) * 100 + 99, R(3, 8) * 100 + 25], n = [R(2, 3), R(2, 4), 1], summe = p.reduce((s, x, i) => s + x * n[i], 0), schein = Math.ceil(summe / 1000) * 1000 + (summe % 1000 > 900 ? 1000 : 0); return zahl(`Du kaufst ${n[0]} Packungen Käse zu je ${euro(p[0])}, ${n[1]} Brote zu je ${euro(p[1])} und eine Melone für ${euro(p[2])}. Du zahlst mit <b>${schein / 100} €</b>. Wie viel Geld bekommst du zurück?`, (schein - summe) / 100, 'Rechne erst jede Zeile aus (Anzahl mal Preis), addiere alles und ziehe die Summe vom Schein ab.', `${n[0]} · ${euro(p[0])} = ${euro(n[0] * p[0])}<br>${n[1]} · ${euro(p[1])} = ${euro(n[1] * p[1])}<br>Zusammen mit der Melone: ${euro(summe)}.<br>Rückgeld: ${schein / 100} € − ${euro(summe)} = <b>${euro(schein - summe)}</b>`, '€'); });

  K('k5-fermi',
    () => { const s = pick([60, 70, 80, 90]); return zahl(`Dein Herz schlägt etwa <b>${s}-mal pro Minute</b>. Wie oft schlägt es an einem ganzen Tag?`, s * 1440, 'Rechne in Schritten: Schläge pro Stunde (· 60), dann pro Tag (· 24).', `Pro Stunde: ${s} · 60 = ${fmt(s * 60)}.<br>Pro Tag: ${fmt(s * 60)} · 24 = <b>${fmt(s * 1440)}</b>`); },
    () => { const t = pick([10, 20]), sek = pick([1, 2]); return zahl(`Ein Wasserhahn tropft: <b>${sek === 1 ? 'jede Sekunde ein Tropfen' : 'alle 2 Sekunden ein Tropfen'}</b>. ${t} Tropfen sind 1 Milliliter. Wie viele <b>Milliliter</b> Wasser gehen an einem Tag verloren? (Ein Tag hat 86 400 Sekunden.)`, 86400 / sek / t, 'Wie viele Tropfen fallen an einem Tag? Teile dann durch die Zahl der Tropfen pro Milliliter.', `Tropfen pro Tag: 86 400 : ${sek} = ${fmt(86400 / sek)}.<br>${fmt(86400 / sek)} : ${t} = <b>${fmt(86400 / sek / t)} ml</b><br><small>Das sind ${fmt(86400 / sek / t / 1000)} Liter, jeden Tag.</small>`, 'ml'); },
    () => { const cm = pick([50, 60, 65, 70]), n = pick([4000, 6000, 8000, 10000]); return zahl(`Ein Schritt ist etwa <b>${cm} cm</b> lang. Wie viele <b>Kilometer</b> sind <b>${fmt(n)} Schritte</b>?`, (cm * n) / 100000, 'Rechne erst in Zentimetern, dann in Meter (: 100) und in Kilometer (: 1000) um.', `${fmt(n)} · ${cm} cm = ${fmt(n * cm)} cm = ${fmt((n * cm) / 100)} m = <b>${fmt((cm * n) / 100000)} km</b>`, 'km'); },
    () => { const n = pick([500, 1000, 2500, 5000]); return zahl(`Ein Blatt Papier ist etwa <b>0,1 mm</b> dick. Wie viele <b>Zentimeter</b> hoch ist ein Stapel aus <b>${fmt(n)} Blättern</b>?`, n / 100, '10 Blätter sind zusammen 1 mm dick. Rechne erst in Millimetern, dann in Zentimeter um.', `${fmt(n)} · 0,1 mm = ${fmt(n / 10)} mm = <b>${fmt(n / 100)} cm</b>`, 'cm'); });

  M.knobelThemen = () => themen().filter((t) => t.knobel).map((t) => t.id);
})();
