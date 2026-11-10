/* Mathelix – Aufgabengeneratoren Klasse 5 (Lehrplan Gymnasium Sachsen)
 *
 * Jeder Generator liefert bei jedem Aufruf eine neue Aufgabe:
 * {
 *   prompt:   HTML-Text der Aufgabe
 *   figure:   optionales SVG
 *   fields:   Eingabefelder [{answer, type:'num'|'factors', label, prefix, suffix, fixed}]
 *   layout:   'row' (Standard) | 'frac' (Zähler über Nenner) | 'time' (hh:mm)
 *   choices / correct: für Auswahlaufgaben
 *   check(values): optional, eigene Prüfung → {ok, note}
 *   hint, solution: HTML
 *   answerText: wie die richtige Antwort angezeigt wird
 * }
 */
(function () {
  const M = (window.Mathelix = window.Mathelix || {});
  const U = (M.util = M.util || {});

  // ---------- Hilfsfunktionen ----------
  const R = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
  const pick = (arr) => arr[R(0, arr.length - 1)];
  const shuffle = (arr) => {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = R(0, i);
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };
  const gcd = (a, b) => (b ? gcd(b, a % b) : Math.abs(a));
  const round6 = (x) => Math.round(x * 1e6) / 1e6;

  // Deutsche Zahlschreibweise: Komma, schmale Leerzeichen ab 10 000
  function fmt(x) {
    x = round6(x);
    const neg = x < 0;
    let [i, d] = Math.abs(x).toString().split('.');
    if (i.length > 4) i = i.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    return (neg ? '−' : '') + i + (d ? ',' + d : '');
  }
  const fr = (n, d) => `<span class="fr"><span>${n}</span><span>${d}</span></span>`;
  const x = '<i class="var">x</i>';
  const qs = (n) => String(n).split('').reduce((s, c) => s + +c, 0);
  const isPrime = (n) => {
    if (n < 2) return false;
    for (let i = 2; i * i <= n; i++) if (n % i === 0) return false;
    return true;
  };
  const factorize = (n) => {
    const f = [];
    for (let p = 2; n > 1; p++) while (n % p === 0) { f.push(p); n /= p; }
    return f;
  };
  const sup = (n) => `<sup>${n}</sup>`;

  Object.assign(U, { R, pick, shuffle, gcd, fmt, fr, round6 });

  // ---------- SVG-Bausteine ----------
  const rad = (d) => (d * Math.PI) / 180;
  const pt = (cx, cy, r, a) => [cx + r * Math.cos(rad(a)), cy - r * Math.sin(rad(a))];
  const P = (p) => p.map((v) => v.toFixed(1)).join(' ');
  function wedge(cx, cy, r, a0, a1, cls) {
    const p0 = pt(cx, cy, r, a0), p1 = pt(cx, cy, r, a1);
    const large = a1 - a0 > 180 ? 1 : 0;
    return `<path class="${cls}" d="M ${cx} ${cy} L ${P(p0)} A ${r} ${r} 0 ${large} 0 ${P(p1)} Z"/>`;
  }
  function label(cx, cy, r, a, text, cls) {
    const p = pt(cx, cy, r, a);
    return `<text class="${cls}" x="${p[0].toFixed(1)}" y="${(p[1] + 5).toFixed(1)}" text-anchor="middle">${text}</text>`;
  }

  // =====================================================
  // LB 1 – Arbeiten mit natürlichen Zahlen
  // =====================================================
  function runden() {
    const places = [
      [10, 'Zehner'], [100, 'Hunderter'], [1000, 'Tausender'], [10000, 'Zehntausender'],
    ];
    const [p, name] = pick(places);
    const n = R(p * 3, Math.min(p * 1000, 9999999));
    const ans = Math.round(n / p) * p;
    const digit = Math.floor(n / (p / 10)) % 10;
    return {
      prompt: `Runde <b>${fmt(n)}</b> auf <b>${name}</b>.`,
      fields: [{ answer: ans }],
      hint: `Schau auf die Ziffer <b>rechts neben</b> der ${name}stelle: 0–4 → abrunden, 5–9 → aufrunden.`,
      solution: `Die Ziffer rechts neben der ${name}stelle ist <b>${digit}</b> → ${digit >= 5 ? 'aufrunden' : 'abrunden'}.<br>${fmt(n)} ≈ <b>${fmt(ans)}</b>`,
    };
  }

  function vorteilhaft() {
    const v = R(1, 5);
    if (v === 1) {
      const k = R(12, 99);
      const parts = shuffle(['25', String(k), '4']);
      return {
        prompt: `Rechne geschickt: <b>${parts.join(' · ')}</b>`,
        fields: [{ answer: 100 * k }],
        hint: 'Welche zwei Zahlen ergeben zusammen multipliziert eine glatte Zahl?',
        solution: `Erst 25 · 4 = 100 (Vertauschungsgesetz).<br>100 · ${k} = <b>${fmt(100 * k)}</b>`,
      };
    }
    if (v === 2) {
      const a = R(11, 89), c = 100 - a, b = R(12, 88);
      return {
        prompt: `Rechne geschickt: <b>${a} + ${b} + ${c}</b>`,
        fields: [{ answer: 100 + b }],
        hint: 'Suche zwei Zahlen, die zusammen 100 ergeben.',
        solution: `${a} + ${c} = 100, dann 100 + ${b} = <b>${100 + b}</b>`,
      };
    }
    if (v === 3) {
      const k = R(3, 19), m = pick([99, 98, 101, 102]);
      const d = m - 100;
      return {
        prompt: `Rechne geschickt: <b>${k} · ${m}</b>`,
        fields: [{ answer: k * m }],
        hint: `${m} liegt ganz nah an 100. Rechne mit 100 und korrigiere.`,
        solution: `${k} · ${m} = ${k} · 100 ${d < 0 ? '−' : '+'} ${k} · ${Math.abs(d)} = ${100 * k} ${d < 0 ? '−' : '+'} ${k * Math.abs(d)} = <b>${fmt(k * m)}</b>`,
      };
    }
    if (v === 4) {
      const a = R(3, 19), b = R(11, 89), c = 100 - b;
      return {
        prompt: `Rechne geschickt: <b>${a} · ${b} + ${a} · ${c}</b>`,
        fields: [{ answer: 100 * a }],
        hint: 'Beide Produkte haben einen gemeinsamen Faktor. Klammere ihn aus.',
        solution: `${a} · ${b} + ${a} · ${c} = ${a} · (${b} + ${c}) = ${a} · 100 = <b>${fmt(100 * a)}</b> (Verteilungsgesetz)`,
      };
    }
    const k = R(3, 49);
    const parts = shuffle(['125', String(k), '8']);
    return {
      prompt: `Rechne geschickt: <b>${parts.join(' · ')}</b>`,
      fields: [{ answer: 1000 * k }],
      hint: '125 · 8 ergibt eine sehr glatte Zahl.',
      solution: `125 · 8 = 1000, dann 1000 · ${k} = <b>${fmt(1000 * k)}</b>`,
    };
  }

  function potenzen() {
    const v = R(1, 4);
    if (v === 1) {
      const n = R(11, 20);
      return {
        prompt: `Berechne: <b>${n}${sup(2)}</b>`,
        fields: [{ answer: n * n }],
        hint: `${n}${sup(2)} bedeutet ${n} · ${n}.`,
        solution: `${n} · ${n} = <b>${n * n}</b>`,
      };
    }
    if (v === 2) {
      const n = R(11, 20);
      return {
        prompt: `Welche natürliche Zahl ergibt quadriert <b>${n * n}</b>?`,
        fields: [{ answer: n }],
        hint: 'Probiere Zahlen zwischen 10 und 20. Schau auf die letzte Ziffer!',
        solution: `${n} · ${n} = ${n * n}, also <b>${n}</b>`,
      };
    }
    const k = R(2, 7);
    if (v === 3)
      return {
        prompt: `Schreibe als Zahl: <b>10${sup(k)}</b>`,
        fields: [{ answer: 10 ** k }],
        hint: 'Der Exponent sagt dir, wie viele Nullen hinter der 1 stehen.',
        solution: `10${sup(k)} = 1 mit ${k} Nullen = <b>${fmt(10 ** k)}</b>`,
      };
    return {
      prompt: `Schreibe als Zehnerpotenz: <b>${fmt(10 ** k)}</b>`,
      fields: [{ answer: k, prefix: '10 hoch' }],
      hint: 'Zähle die Nullen.',
      solution: `${fmt(10 ** k)} hat ${k} Nullen → <b>10${sup(k)}</b>`,
      answerText: `10${sup(k)}`,
    };
  }

  function division() {
    const d = R(2, 9);
    const n = R(100, 999);
    const q = Math.floor(n / d), r = n % d;
    return {
      prompt: `Dividiere schriftlich: <b>${n} : ${d}</b>`,
      fields: [{ answer: q, label: 'Ergebnis' }, { answer: r, label: 'Rest' }],
      hint: 'Teile Stelle für Stelle von links. Bleibt am Ende nichts übrig, ist der Rest 0.',
      solution: `${n} : ${d} = <b>${q} Rest ${r}</b><br>Probe: ${d} · ${q} + ${r} = ${d * q} + ${r} = ${n} ✓`,
      answerText: `${q} Rest ${r}`,
    };
  }

  const TEILER_REGELN = {
    2: 'Eine Zahl ist durch 2 teilbar, wenn ihre letzte Ziffer gerade ist (0, 2, 4, 6, 8).',
    3: 'Eine Zahl ist durch 3 teilbar, wenn ihre Quersumme durch 3 teilbar ist.',
    4: 'Eine Zahl ist durch 4 teilbar, wenn die Zahl aus ihren letzten zwei Ziffern durch 4 teilbar ist.',
    5: 'Eine Zahl ist durch 5 teilbar, wenn ihre letzte Ziffer 0 oder 5 ist.',
    6: 'Eine Zahl ist durch 6 teilbar, wenn sie durch 2 <i>und</i> durch 3 teilbar ist.',
    9: 'Eine Zahl ist durch 9 teilbar, wenn ihre Quersumme durch 9 teilbar ist.',
    10: 'Eine Zahl ist durch 10 teilbar, wenn ihre letzte Ziffer 0 ist.',
  };
  function teilbarkeit() {
    const d = pick([2, 3, 4, 5, 6, 9, 10, 3, 4, 6]);
    const yes = Math.random() < 0.5;
    let n = d * R(Math.ceil(100 / d), Math.floor(99999 / d));
    if (!yes) n += R(1, d - 1);
    const ok = n % d === 0;
    let why;
    if (d === 3 || d === 9) why = `Quersumme: ${String(n).split('').join(' + ')} = ${qs(n)}. ${qs(n)} ist ${qs(n) % d === 0 ? '' : '<b>nicht</b> '}durch ${d} teilbar.`;
    else if (d === 4) why = `Die letzten zwei Ziffern bilden ${n % 100}. ${n % 100} ist ${(n % 100) % 4 === 0 ? '' : '<b>nicht</b> '}durch 4 teilbar.`;
    else if (d === 6) why = `Durch 2: ${n % 2 === 0 ? 'ja' : 'nein'} (letzte Ziffer ${n % 10}). Durch 3: ${qs(n) % 3 === 0 ? 'ja' : 'nein'} (Quersumme ${qs(n)}).`;
    else why = `Die letzte Ziffer ist ${n % 10}.`;
    return {
      prompt: `Ist <b>${fmt(n)}</b> durch <b>${d}</b> teilbar?`,
      choices: ['Ja', 'Nein'],
      correct: ok ? 0 : 1,
      hint: TEILER_REGELN[d],
      solution: `${why}<br>→ <b>${ok ? 'Ja' : 'Nein'}</b>, ${fmt(n)} ist ${ok ? '' : 'nicht '}durch ${d} teilbar.`,
    };
  }

  function primzahlen() {
    if (Math.random() < 0.45) {
      const prime = Math.random() < 0.5;
      let n;
      do n = R(11, 99); while (isPrime(n) !== prime || (!prime && (n % 2 === 0 || n % 5 === 0) && Math.random() < 0.7));
      const f = factorize(n);
      return {
        prompt: `Ist <b>${n}</b> eine Primzahl?`,
        ex: { mode: 'prime', n },
        choices: ['Ja', 'Nein'],
        correct: prime ? 0 : 1,
        hint: 'Eine Primzahl hat genau zwei Teiler: 1 und sich selbst. Prüfe die Teiler 2, 3, 5 und 7.',
        solution: prime
          ? `${n} ist durch keine der Zahlen 2, 3, 5, 7 teilbar → <b>Ja</b>, Primzahl.`
          : `${n} = ${f[0]} · ${n / f[0]} → <b>Nein</b>, keine Primzahl.`,
      };
    }
    let f, n;
    do {
      const cnt = R(2, 4);
      f = Array.from({ length: cnt }, () => pick([2, 2, 2, 3, 3, 3, 5, 5, 7, 11, 13])).sort((a, b) => a - b);
      n = f.reduce((a, b) => a * b, 1);
    } while (n < 12 || n > 400);
    let rest = n;
    const steps = f.map((p) => { const s = `${rest} : ${p} = ${rest / p}`; rest /= p; return s; });
    return {
      prompt: `Zerlege <b>${n}</b> in Primfaktoren.`,
      ex: { mode: 'tree', n },
      fields: [{ answer: f, type: 'factors', placeholder: 'z. B. 2·3·3' }],
      hint: 'Teile immer wieder durch die kleinste Primzahl, die passt (2, 3, 5, 7 …).',
      solution: `${steps.join('<br>')}<br>→ ${n} = <b>${f.join(' · ')}</b>`,
      answerText: f.join(' · '),
    };
  }

  function gleichungen() {
    const v = R(1, 4);
    let prompt, ans, sol;
    if (v === 1) {
      ans = R(5, 95); const a = R(5, 95);
      prompt = `${x} + ${a} = ${ans + a}`;
      sol = `Umkehraufgabe: ${x} = ${ans + a} − ${a} = <b>${ans}</b>`;
    } else if (v === 2) {
      ans = R(20, 150); const a = R(5, ans - 1);
      prompt = `${x} − ${a} = ${ans - a}`;
      sol = `Umkehraufgabe: ${x} = ${ans - a} + ${a} = <b>${ans}</b>`;
    } else if (v === 3) {
      ans = R(2, 15); const a = R(2, 12);
      prompt = `${a} · ${x} = ${a * ans}`;
      sol = `Umkehraufgabe: ${x} = ${a * ans} : ${a} = <b>${ans}</b>`;
    } else {
      const a = R(2, 9), b = R(2, 12); ans = a * b;
      prompt = `${x} : ${a} = ${b}`;
      sol = `Umkehraufgabe: ${x} = ${b} · ${a} = <b>${ans}</b>`;
    }
    return {
      prompt: `Löse die Gleichung: <b>${prompt}</b>`,
      fields: [{ answer: ans, prefix: `${x} =` }],
      hint: 'Welche Zahl musst du für x einsetzen? Denk an die Umkehraufgabe.',
      solution: `${sol}<br>Probe: setze ${ans} für ${x} ein ✓`,
      answerText: `x = ${ans}`,
    };
  }

  // =====================================================
  // LB 2 – Gemeine Brüche und Dezimalzahlen
  // =====================================================
  function anteile() {
    const d = R(2, 10), z = R(1, d - 1);
    const k = R(2, 12), whole = d * k;
    const unit = pick(['', '', ' €', ' kg', ' m', ' Kinder']);
    return {
      prompt: `Berechne ${fr(z, d)} von <b>${whole}${unit}</b>.`,
      fields: [{ answer: z * k, suffix: unit.trim() }],
      hint: `Erst durch den Nenner teilen (ein ${d}tel), dann mit dem Zähler malnehmen.`,
      solution: `${whole} : ${d} = ${k}<br>${k} · ${z} = <b>${z * k}${unit}</b>`,
    };
  }

  function kuerzen() {
    let p, q;
    do { q = R(2, 12); p = R(1, q + 4); } while (gcd(p, q) !== 1 || p === q);
    const k = R(2, 9);
    const n = p * k, d = q * k;
    return {
      prompt: `Kürze <b>vollständig</b>: ${fr(n, d)}`,
      layout: 'frac',
      fields: [{ answer: p, label: 'Zähler' }, { answer: q, label: 'Nenner' }],
      check([a, b]) {
        if (!b || a * q !== b * p) return { ok: false };
        if (gcd(a, b) !== 1) return { ok: false, note: 'Gleichwertig, aber noch nicht <b>vollständig</b> gekürzt. Da geht noch was!' };
        return { ok: true };
      },
      hint: `Suche den größten gemeinsamen Teiler von ${n} und ${d}.`,
      solution: `ggT(${n}, ${d}) = ${k}<br>${fr(n, d)} = ${fr(`${n} : ${k}`, `${d} : ${k}`)} = <b>${fr(p, q)}</b>`,
      answerText: fr(p, q),
    };
  }

  function erweitern() {
    let p, q;
    do { q = R(2, 9); p = R(1, q - 1); } while (gcd(p, q) !== 1);
    const k = R(2, 9);
    const askTop = Math.random() < 0.6;
    return {
      prompt: `Ergänze, sodass beide Brüche gleich groß sind:`,
      pre: `${fr(p, q)} =`,
      layout: 'frac',
      fields: askTop
        ? [{ answer: p * k, label: 'Zähler' }, { fixed: q * k }]
        : [{ fixed: p * k }, { answer: q * k, label: 'Nenner' }],
      hint: askTop
        ? `Womit wurde der Nenner ${q} multipliziert, um ${q * k} zu erhalten?`
        : `Womit wurde der Zähler ${p} multipliziert, um ${p * k} zu erhalten?`,
      solution: `Mit ${k} erweitert: ${fr(p, q)} = ${fr(`${p} · ${k}`, `${q} · ${k}`)} = <b>${fr(p * k, q * k)}</b>`,
      answerText: fr(p * k, q * k),
    };
  }

  const NICE = [
    [1, 2], [1, 4], [3, 4], [1, 5], [2, 5], [3, 5], [4, 5], [1, 10], [3, 10], [7, 10], [9, 10],
    [1, 20], [3, 20], [1, 25], [2, 25], [1, 50], [1, 8], [3, 8], [1, 100], [7, 20], [11, 20],
  ];
  function umwandeln() {
    const [p, q] = pick(NICE);
    const dec = round6(p / q), pct = round6((100 * p) / q);
    const v = R(1, 4);
    const toHundred = 100 % q === 0 ? `${fr(p, q)} = ${fr(p * (100 / q), 100)}` : `${p} : ${q}`;
    if (v === 1)
      return {
        prompt: `Schreibe als Dezimalzahl: ${fr(p, q)}`,
        fields: [{ answer: dec }],
        hint: 'Erweitere auf Zehntel, Hundertstel oder Tausendstel, oder rechne Zähler : Nenner.',
        solution: `${toHundred} = <b>${fmt(dec)}</b>`,
      };
    if (v === 2)
      return {
        prompt: `Schreibe in Prozent: ${fr(p, q)}`,
        fields: [{ answer: pct, suffix: '%' }],
        hint: 'Prozent heißt „von Hundert“. Erweitere den Bruch auf den Nenner 100.',
        solution: `${toHundred} = <b>${fmt(pct)} %</b>`,
      };
    if (v === 3)
      return {
        prompt: `Schreibe als Dezimalzahl: <b>${fmt(pct)} %</b>`,
        fields: [{ answer: dec }],
        hint: `${fmt(pct)} % bedeutet ${fmt(pct)} Hundertstel.`,
        solution: `${fmt(pct)} % = ${fr(fmt(pct), 100)} = <b>${fmt(dec)}</b>`,
      };
    return {
      prompt: `Schreibe als gekürzten Bruch: <b>${fmt(dec)}</b>`,
      layout: 'frac',
      fields: [{ answer: p, label: 'Zähler' }, { answer: q, label: 'Nenner' }],
      check([a, b]) {
        if (!b || a * q !== b * p) return { ok: false };
        if (gcd(a, b) !== 1) return { ok: true, note: `Stimmt! Noch schöner gekürzt: ${fr(p, q)}` };
        return { ok: true };
      },
      hint: 'Wie viele Stellen nach dem Komma? 1 Stelle → Zehntel, 2 → Hundertstel, 3 → Tausendstel. Dann kürzen.',
      solution: (() => {
        const k = (String(dec).split('.')[1] || '').length, den = 10 ** k;
        const num = Math.round(dec * den);
        return `${fmt(dec)} = ${fr(num, den)}${num === p ? '' : ` = <b>${fr(p, q)}</b>`}${num === p ? ' <b>(schon gekürzt)</b>' : ''}`;
      })(),
      answerText: fr(p, q),
    };
  }

  function dezimalrechnen() {
    const v = R(1, 4);
    if (v === 1 || v === 2) {
      let a = R(105, 9999), b = R(11, 999);
      if (Math.random() < 0.5) b = Math.round(b / 10) * 10;
      if (v === 2 && b > a) [a, b] = [b, a];
      const A = a / 100, B = b / 100, res = v === 1 ? (a + b) / 100 : (a - b) / 100;
      const op = v === 1 ? '+' : '−';
      return {
        prompt: `Berechne: <b>${fmt(A)} ${op} ${fmt(B)}</b>`,
        fields: [{ answer: res }],
        hint: 'Schreibe die Zahlen so untereinander, dass Komma unter Komma steht. Fehlende Stellen mit 0 auffüllen.',
        solution: `Komma unter Komma:<br><span class="mono">${fmt(A)} ${op} ${fmt(B)} = <b>${fmt(res)}</b></span>`,
      };
    }
    if (v === 3) {
      const a = R(105, 2500), k = R(2, 9);
      return {
        prompt: `Berechne: <b>${fmt(a / 100)} · ${k}</b>`,
        fields: [{ answer: (a * k) / 100 }],
        hint: 'Rechne erst ohne Komma, dann setze das Komma: so viele Nachkommastellen wie im Faktor.',
        solution: `${a} · ${k} = ${a * k}, zwei Nachkommastellen → <b>${fmt((a * k) / 100)}</b>`,
      };
    }
    const e = R(1, 3), p = 10 ** e, mult = Math.random() < 0.5;
    const a = R(1, 99999) / 10 ** R(0, 2);
    const res = round6(mult ? a * p : a / p);
    return {
      prompt: `Berechne: <b>${fmt(a)} ${mult ? '·' : ':'} ${fmt(p)}</b>`,
      fields: [{ answer: res }],
      hint: `Bei ${mult ? '· ' : ': '}${fmt(p)} rückt das Komma um ${e} Stelle${e > 1 ? 'n' : ''} nach ${mult ? 'rechts' : 'links'}.`,
      solution: `Komma um ${e} Stelle${e > 1 ? 'n' : ''} nach ${mult ? 'rechts' : 'links'}: <b>${fmt(res)}</b>`,
    };
  }

  function vergleichen() {
    let A, B, aTxt, bTxt;
    if (Math.random() < 0.5) {
      const [p, q] = pick(NICE);
      A = p / q; aTxt = fr(p, q);
      const delta = pick([0, -0.05, 0.05, -0.1, 0.1, -0.01, 0.01, 0.15]);
      B = round6(Math.max(0.01, A + delta)); bTxt = `<b>${fmt(B)}</b>`;
    } else {
      const base = R(1, 9) / 10 + R(0, 9) / 100;
      A = round6(base);
      B = round6(pick([base + 0.005, base - 0.005, base * 10 / 10 + 0.01, Math.floor(base * 10) / 10 + 0.09, base]));
      if (B === A && Math.random() < 0.6) B = round6(A - 0.04);
      aTxt = `<b>${fmt(A)}</b>`; bTxt = `<b>${fmt(B)}</b>`;
    }
    if (Math.random() < 0.5) [A, B, aTxt, bTxt] = [B, A, bTxt, aTxt];
    const correct = Math.abs(A - B) < 1e-9 ? 2 : A > B ? 0 : 1;
    return {
      prompt: `Welche Zahl ist größer?`,
      choices: [aTxt, bTxt, 'Beide gleich groß'],
      correct,
      hint: 'Schreibe beide Zahlen als Dezimalzahl mit gleich vielen Nachkommastellen und vergleiche Stelle für Stelle.',
      solution: `${aTxt} = ${fmt(A)} und ${bTxt} = ${fmt(B)}.<br>→ ${correct === 2 ? '<b>Beide sind gleich groß.</b>' : `<b>${correct === 0 ? aTxt : bTxt}</b> ist größer.`}`,
    };
  }

  function mittelwert() {
    const ctx = pick([
      ['Temperaturen in °C an', 'Tagen', 2, 24, '°C'],
      ['Punkte im Test von', 'Kindern', 8, 30, 'Punkte'],
      ['Tore pro Spiel in', 'Spielen', 0, 7, 'Tore'],
      ['Weitsprung-Weiten in cm von', 'Kindern', 210, 380, 'cm'],
    ]);
    const n = R(4, 6);
    let vals, mean;
    for (;;) {
      vals = Array.from({ length: n }, () => R(ctx[2], ctx[3]));
      const s = vals.reduce((a, b) => a + b, 0) - vals[n - 1];
      mean = Math.round((s + vals[n - 1]) / n);
      const last = mean * n - s;
      if (last >= ctx[2] && last <= ctx[3]) { vals[n - 1] = last; break; }
    }
    const sum = vals.reduce((a, b) => a + b, 0);
    return {
      prompt: `${ctx[0]} ${n} ${ctx[1]}: <b>${vals.join(';  ')}</b><br>Berechne das arithmetische Mittel.`,
      fields: [{ answer: mean, suffix: ctx[4] }],
      hint: 'Alle Werte addieren und dann durch die Anzahl der Werte teilen.',
      solution: `Summe: ${vals.join(' + ')} = ${sum}<br>${sum} : ${n} = <b>${mean} ${ctx[4]}</b>`,
    };
  }

  // =====================================================
  // LB 3 – Lagebeziehungen geometrischer Objekte
  // =====================================================
  function koordinaten() {
    const px = R(0, 10), py = R(0, 8);
    const s = 24, ox = 34, oy = 222;
    let g = '';
    for (let i = 0; i <= 10; i++) g += `<line class="grid" x1="${ox + i * s}" y1="${oy}" x2="${ox + i * s}" y2="${oy - 8 * s}"/>`;
    for (let j = 0; j <= 8; j++) g += `<line class="grid" x1="${ox}" y1="${oy - j * s}" x2="${ox + 10 * s}" y2="${oy - j * s}"/>`;
    let ax = `<line class="axis" x1="${ox}" y1="${oy}" x2="${ox + 10 * s + 12}" y2="${oy}" marker-end="url(#arr)"/><line class="axis" x1="${ox}" y1="${oy}" x2="${ox}" y2="${oy - 8 * s - 12}" marker-end="url(#arr)"/>`;
    for (let i = 0; i <= 10; i++) ax += `<text class="tick" x="${ox + i * s}" y="${oy + 16}" text-anchor="middle">${i}</text>`;
    for (let j = 1; j <= 8; j++) ax += `<text class="tick" x="${ox - 9}" y="${oy - j * s + 4}" text-anchor="end">${j}</text>`;
    ax += `<text class="tick b" x="${ox + 10 * s + 14}" y="${oy + 16}">x</text><text class="tick b" x="${ox + 8}" y="${oy - 8 * s - 4}">y</text>`;
    const cx = ox + px * s, cy = oy - py * s;
    const pnt = `<circle class="pt" cx="${cx}" cy="${cy}" r="6"/><text class="ptl" x="${cx + 8}" y="${cy - 8}">P</text>`;
    return {
      prompt: 'Welche Koordinaten hat der Punkt <b>P</b>?',
      figure: `<svg viewBox="0 0 300 245"><defs><marker id="arr" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0 L10 5 L0 10 z" class="arrh"/></marker></defs>${g}${ax}${pnt}</svg>`,
      layout: 'coord',
      fields: [{ answer: px, label: 'x' }, { answer: py, label: 'y' }],
      hint: 'Zuerst nach rechts (x-Wert), dann nach oben (y-Wert). Merke: „Erst laufen, dann springen“.',
      solution: `P liegt ${px} nach rechts und ${py} nach oben → <b>P(${px} | ${py})</b>`,
      answerText: `P(${px} | ${py})`,
    };
  }

  function winkelarten() {
    const types = [
      ['spitzer Winkel', () => R(10, 85)],
      ['rechter Winkel', () => 90],
      ['stumpfer Winkel', () => R(95, 170)],
      ['gestreckter Winkel', () => 180],
      ['überstumpfer Winkel', () => R(195, 340)],
    ];
    const t = R(0, types.length - 1);
    const a = types[t][1]();
    const cx = 150, cy = 105, L = 110;
    const p1 = pt(cx, cy, L, 0), p2 = pt(cx, cy, L, a);
    let mark;
    if (a === 90) {
      const q1 = pt(cx, cy, 22, 0), q2 = pt(cx, cy, 22 * Math.SQRT2, 45), q3 = pt(cx, cy, 22, 90);
      mark = `<path class="wA" d="M ${cx} ${cy} L ${P(q1)} L ${P(q2)} L ${P(q3)} Z"/><circle cx="${pt(cx, cy, 12, 45)[0]}" cy="${pt(cx, cy, 12, 45)[1]}" r="2.5" class="dot"/>`;
    } else mark = wedge(cx, cy, 30, 0, a, 'wA');
    const fig = `<svg viewBox="0 0 300 215">${mark}<line class="ray" x1="${cx}" y1="${cy}" x2="${P(p1).split(' ')[0]}" y2="${P(p1).split(' ')[1]}"/><line class="ray" x1="${cx}" y1="${cy}" x2="${P(p2).split(' ')[0]}" y2="${P(p2).split(' ')[1]}"/><circle cx="${cx}" cy="${cy}" r="3.5" class="dot"/>${label(cx, cy, 48, a / 2, 'α', 'albl')}</svg>`;
    return {
      prompt: `Der Winkel ist <b>α = ${a}°</b> groß. Welche Winkelart ist das?`,
      figure: fig,
      choices: types.map((tt) => tt[0]),
      correct: t,
      hint: 'spitz: unter 90° · recht: genau 90° · stumpf: zwischen 90° und 180° · gestreckt: genau 180° · überstumpf: zwischen 180° und 360°',
      solution: `${a}° ist ${a < 90 ? 'kleiner als 90°' : a === 90 ? 'genau 90°' : a < 180 ? 'zwischen 90° und 180°' : a === 180 ? 'genau 180°' : 'zwischen 180° und 360°'} → <b>${types[t][0]}</b>`,
    };
  }

  function winkelpaare() {
    let a;
    do a = R(35, 145); while (a > 80 && a < 100);
    const parallel = Math.random() < 0.6;
    const W = 300, H = parallel ? 230 : 190;
    const yT = parallel ? 75 : 95, yB = 160;
    const cot = Math.cos(rad(a)) / Math.sin(rad(a));
    const xT = parallel ? 150 + 42 * cot : 150, xB = 150 - 42 * cot;
    // Transversale
    const ext = 1.6 * H;
    const t0 = pt(xT, yT, ext, a), t1 = pt(xT, yT, ext, a + 180);
    // Winkelbereiche je Position (0 oben rechts, 1 oben links, 2 unten links, 3 unten rechts)
    const ranges = [[0, a], [a, 180], [180, a + 180], [a + 180, 360]];
    const given = { at: 'T', pos: 0 };
    let ask;
    if (parallel) {
      ask = pick([{ at: 'B', pos: 0 }, { at: 'B', pos: 2 }, { at: 'B', pos: 1 }, { at: 'B', pos: 3 }, { at: 'T', pos: 2 }]);
    } else ask = pick([{ at: 'T', pos: 1 }, { at: 'T', pos: 2 }, { at: 'T', pos: 3 }]);
    given.pos = R(0, 3);
    ask.pos = (ask.pos + given.pos) % 4;
    const val = (pos) => (pos % 2 === 0 ? a : 180 - a);
    const gv = val(given.pos), av = val(ask.pos);
    const C = (k) => (k === 'T' ? [xT, yT] : [xB, yB]);
    const [gx, gy] = C(given.at), [qx, qy] = C(ask.at);
    const gr = ranges[given.pos], ar = ranges[ask.pos];
    let lines = `<line class="ray" x1="10" y1="${yT}" x2="${W - 10}" y2="${yT}"/>`;
    if (parallel) lines += `<line class="ray" x1="10" y1="${yB}" x2="${W - 10}" y2="${yB}"/>`;
    lines += `<line class="ray" x1="${P(t0).split(' ')[0]}" y1="${P(t0).split(' ')[1]}" x2="${P(t1).split(' ')[0]}" y2="${P(t1).split(' ')[1]}"/>`;
    const figs =
      wedge(gx, gy, 26, gr[0], gr[1], 'wA') + wedge(qx, qy, 26, ar[0], ar[1], 'wB') + lines +
      label(gx, gy, 42, (gr[0] + gr[1]) / 2, gv + '°', 'albl') + label(qx, qy, 42, (ar[0] + ar[1]) / 2, 'β', 'blbl');
    const fig = `<svg viewBox="0 0 ${W} ${H}"><clipPath id="cp"><rect x="0" y="0" width="${W}" height="${H}"/></clipPath><g clip-path="url(#cp)">${figs}</g>${parallel ? `<text class="tick" x="${W - 14}" y="${yT - 6}" text-anchor="end">g</text><text class="tick" x="${W - 14}" y="${yB - 6}" text-anchor="end">h</text>` : ''}</svg>`;
    // Beziehung benennen
    const same = ask.at === given.at;
    const d = (ask.pos - given.pos + 4) % 4;
    let rel;
    if (same) rel = d === 2 ? 'Scheitelwinkel' : 'Nebenwinkel';
    else if (d === 0) rel = 'Stufenwinkel';
    else if (d === 2) rel = 'Wechselwinkel';
    else rel = 'Nebenwinkel des Stufenwinkels';
    const eq = gv === av;
    return {
      prompt: `${parallel ? 'Die Geraden g und h sind parallel. ' : ''}Wie groß ist der Winkel <b class="cB">β</b>?`,
      figure: fig,
      fields: [{ answer: av, prefix: 'β =', suffix: '°' }],
      hint: parallel
        ? 'Stufenwinkel und Wechselwinkel an Parallelen sind gleich groß. Nebenwinkel ergeben zusammen 180°.'
        : 'Scheitelwinkel sind gleich groß. Nebenwinkel ergeben zusammen 180°.',
      solution: `β ist ${rel === 'Nebenwinkel des Stufenwinkels' ? 'der' : 'ein'} <b>${rel}</b> zum ${gv}°-Winkel.<br>${eq ? `→ gleich groß: β = <b>${av}°</b>` : `→ β = 180° − ${gv}° = <b>${av}°</b>`}`,
      answerText: `β = ${av}°`,
    };
  }

  // =====================================================
  // LB 4 – Rechtecke und Quader
  // =====================================================
  function rechteck() {
    const v = R(1, 4);
    if (v === 4) return lform();
    const unit = pick(['cm', 'cm', 'm', 'mm']);
    const a = R(3, 25), b = R(2, 18);
    const sc = Math.min(180 / a, 120 / b, 14);
    const w = a * sc, h = b * sc, x0 = (300 - w) / 2 - 30, y0 = 20;
    const fig = `<svg viewBox="0 0 300 ${h + 60}"><rect class="shape" x="${x0}" y="${y0}" width="${w}" height="${h}"/><text class="dim" x="${x0 + w / 2}" y="${y0 + h + 22}" text-anchor="middle">a = ${a} ${unit}</text><text class="dim" x="${x0 + w + 8}" y="${y0 + h / 2 + 5}">b = ${b} ${unit}</text></svg>`;
    if (v === 1)
      return {
        prompt: 'Berechne den <b>Umfang</b> des Rechtecks.',
        figure: fig,
        fields: [{ answer: 2 * (a + b), prefix: 'u =', suffix: unit }],
        hint: 'Der Umfang ist die Länge aller vier Seiten zusammen: u = 2 · a + 2 · b',
        solution: `u = 2 · ${a} ${unit} + 2 · ${b} ${unit} = ${2 * a} ${unit} + ${2 * b} ${unit} = <b>${2 * (a + b)} ${unit}</b>`,
      };
    if (v === 2)
      return {
        prompt: 'Berechne den <b>Flächeninhalt</b> des Rechtecks.',
        figure: fig,
        fields: [{ answer: a * b, prefix: 'A =', suffix: unit + '²' }],
        hint: 'Flächeninhalt = Länge mal Breite: A = a · b',
        solution: `A = ${a} ${unit} · ${b} ${unit} = <b>${a * b} ${unit}²</b>`,
      };
    return {
      prompt: `Ein Rechteck hat den Flächeninhalt <b>A = ${a * b} ${unit}²</b> und die Seite <b>a = ${a} ${unit}</b>. Wie lang ist die Seite b?`,
      fields: [{ answer: b, prefix: 'b =', suffix: unit }],
      hint: 'A = a · b. Welche Zahl mal a ergibt A? Teile A durch a.',
      solution: `b = A : a = ${a * b} : ${a} = <b>${b} ${unit}</b>`,
    };
  }

  function lform() {
    const Wd = R(6, 12), Hd = R(5, 10), w = R(2, Wd - 3), h = R(2, Hd - 3);
    const s = Math.min(200 / Wd, 150 / Hd), x0 = (300 - Wd * s) / 2 - 10, y0 = 20;
    const pts = [
      [x0, y0], [x0 + (Wd - w) * s, y0], [x0 + (Wd - w) * s, y0 + h * s], [x0 + Wd * s, y0 + h * s], [x0 + Wd * s, y0 + Hd * s], [x0, y0 + Hd * s],
    ].map((p) => p.join(',')).join(' ');
    const fig = `<svg viewBox="0 0 300 ${Hd * s + 55}"><polygon class="shape" points="${pts}"/>
      <text class="dim" x="${x0 + (Wd * s) / 2}" y="${y0 + Hd * s + 22}" text-anchor="middle">${Wd} cm</text>
      <text class="dim" x="${x0 - 8}" y="${y0 + (Hd * s) / 2 + 5}" text-anchor="end">${Hd} cm</text>
      <text class="dim" x="${x0 + ((Wd - w) * s) / 2}" y="${y0 - 6}" text-anchor="middle">${Wd - w} cm</text>
      <text class="dim" x="${x0 + Wd * s + 8}" y="${y0 + h * s + ((Hd - h) * s) / 2 + 5}">${Hd - h} cm</text></svg>`;
    const A = Wd * Hd - w * h;
    return {
      prompt: 'Berechne den <b>Flächeninhalt</b> der Figur.',
      figure: fig,
      fields: [{ answer: A, prefix: 'A =', suffix: 'cm²' }],
      hint: 'Ergänze die Figur zu einem großen Rechteck und ziehe das fehlende Rechteck ab, oder zerlege sie in zwei Rechtecke.',
      solution: `Großes Rechteck: ${Wd} · ${Hd} = ${Wd * Hd} cm²<br>Fehlendes Stück: ${w} · ${h} = ${w * h} cm²<br>A = ${Wd * Hd} − ${w * h} = <b>${A} cm²</b>`,
    };
  }

  function quader() {
    const a = R(2, 12), b = R(2, 9), c = R(2, 10);
    const s = Math.min(150 / (a + b * 0.5), 140 / (c + b * 0.5), 18);
    const W = a * s, Hh = c * s, D = b * s * 0.5;
    const x0 = (300 - W - D) / 2, y0 = 20 + D;
    const F = [[x0, y0], [x0 + W, y0], [x0 + W, y0 + Hh], [x0, y0 + Hh]];
    const B = F.map(([px, py]) => [px + D, py - D]);
    const ln = (p, q, cls = 'edge') => `<line class="${cls}" x1="${p[0]}" y1="${p[1]}" x2="${q[0]}" y2="${q[1]}"/>`;
    const fig = `<svg viewBox="0 0 300 ${y0 + Hh + 40}">
      <polygon class="face" points="${[F[0], F[1], B[1], B[0]].map((p) => p.join(',')).join(' ')}"/>
      <polygon class="face2" points="${[F[1], F[2], B[2], B[1]].map((p) => p.join(',')).join(' ')}"/>
      ${ln(B[3], B[0], 'hid')}${ln(B[3], B[2], 'hid')}${ln(B[3], F[3], 'hid')}
      <rect class="shape" x="${x0}" y="${y0}" width="${W}" height="${Hh}"/>
      ${ln(F[0], B[0])}${ln(F[1], B[1])}${ln(F[2], B[2])}${ln(B[0], B[1])}${ln(B[1], B[2])}
      <text class="dim" x="${x0 + W / 2}" y="${y0 + Hh + 22}" text-anchor="middle">a = ${a} cm</text>
      <text class="dim" x="${F[2][0] + D / 2 + 8}" y="${F[2][1] - D / 2 + 14}">b = ${b} cm</text>
      <text class="dim" x="${x0 - 8}" y="${y0 + Hh / 2 + 5}" text-anchor="end">c = ${c} cm</text></svg>`;
    const V = a * b * c, O = 2 * (a * b + a * c + b * c);
    const v = R(1, 3);
    if (v === 1)
      return {
        prompt: 'Berechne das <b>Volumen</b> des Quaders.',
        figure: fig,
        fields: [{ answer: V, prefix: 'V =', suffix: 'cm³' }],
        hint: 'V = a · b · c (Länge · Breite · Höhe)',
        solution: `V = ${a} cm · ${b} cm · ${c} cm = <b>${V} cm³</b>`,
      };
    if (v === 2)
      return {
        prompt: 'Berechne den <b>Oberflächeninhalt</b> des Quaders.',
        figure: fig,
        fields: [{ answer: O, prefix: 'A<sub>O</sub> =', suffix: 'cm²' }],
        hint: 'Ein Quader hat 6 Flächen, je 2 gleich große: A<sub>O</sub> = 2 · (a·b + a·c + b·c)',
        solution: `A<sub>O</sub> = 2 · (${a}·${b} + ${a}·${c} + ${b}·${c}) = 2 · (${a * b} + ${a * c} + ${b * c}) = 2 · ${a * b + a * c + b * c} = <b>${O} cm²</b>`,
      };
    const A = R(2, 8) * 10, B2 = R(2, 6) * 10, C2 = R(2, 5) * 10;
    const l = (A * B2 * C2) / 1000;
    return {
      prompt: `Ein Aquarium ist <b>${A} cm</b> lang, <b>${B2} cm</b> breit und <b>${C2} cm</b> hoch. Wie viele <b>Liter</b> passen hinein?`,
      fields: [{ answer: l, suffix: 'l' }],
      hint: 'Rechne in Dezimeter um (10 cm = 1 dm). 1 dm³ = 1 Liter.',
      solution: `${A} cm = ${A / 10} dm, ${B2} cm = ${B2 / 10} dm, ${C2} cm = ${C2 / 10} dm<br>V = ${A / 10} · ${B2 / 10} · ${C2 / 10} = ${fmt(l)} dm³ = <b>${fmt(l)} l</b>`,
    };
  }

  // =====================================================
  // LB 5 – Vernetzung: Mathematik im Alltag
  // =====================================================
  const LADDERS = [
    [['mm', 1], ['cm', 10], ['dm', 100], ['m', 1000], ['km', 1e6]],
    [['g', 1], ['kg', 1000], ['t', 1e6]],
    [['s', 1], ['min', 60], ['h', 3600]],
    [['mm²', 1], ['cm²', 100], ['dm²', 1e4], ['m²', 1e6]],
    [['cm³', 1], ['dm³', 1000], ['m³', 1e6]],
    [['ml', 1], ['l', 1000]],
  ];
  function einheiten() {
    const lad = pick(LADDERS);
    const i = R(0, lad.length - 2);
    const big = lad[i + 1], small = lad[i];
    const ratio = big[1] / small[1];
    let B;
    if (ratio === 60) B = Math.random() < 0.6 ? R(2, 12) : R(1, 9) + 0.5;
    else B = Math.random() < 0.55 ? R(2, 99) : R(12, 999) / 10;
    const S = round6(B * ratio);
    const toSmall = Math.random() < 0.55;
    const [fromV, fromU, toV, toU] = toSmall ? [B, big[0], S, small[0]] : [S, small[0], B, big[0]];
    return {
      prompt: `Rechne um: <b>${fmt(fromV)} ${fromU}</b> = ? <b>${toU}</b>`,
      fields: [{ answer: toV, suffix: toU }],
      hint: `1 ${big[0]} = ${fmt(ratio)} ${small[0]}. ${toSmall ? 'In die kleinere Einheit: malnehmen.' : 'In die größere Einheit: teilen.'}`,
      solution: `1 ${big[0]} = ${fmt(ratio)} ${small[0]}<br>${fmt(fromV)} ${toSmall ? '·' : ':'} ${fmt(ratio)} = <b>${fmt(toV)} ${toU}</b>`,
    };
  }

  const hm = (t) => `${String(Math.floor(t / 60) % 24).padStart(2, '0')}:${String(t % 60).padStart(2, '0')}`;
  function fahrplan() {
    const start = R(6 * 60, 20 * 60 + 30), dur = R(12, 95);
    const end = start + dur;
    const what = pick(['Der Bus', 'Die S-Bahn', 'Die Straßenbahn', 'Der Zug']);
    const dest = pick(['Klotzsche', 'Neustadt', 'Pirna', 'Meißen', 'Radebeul', 'Freital']);
    if (Math.random() < 0.5)
      return {
        prompt: `${what} fährt um <b>${hm(start)} Uhr</b> ab und braucht <b>${dur} Minuten</b> bis ${dest}. Wann kommt ${what.split(' ')[0] === 'Der' ? 'er' : 'sie'} an?`,
        layout: 'time',
        fields: [{ answer: Math.floor(end / 60) % 24, label: 'Std.' }, { answer: end % 60, label: 'Min.' }],
        hint: 'Rechne zuerst bis zur nächsten vollen Stunde, dann den Rest dazu.',
        solution: `${hm(start)} + ${dur} min:<br>bis ${hm(Math.ceil((start + 1) / 60) * 60)} sind es ${Math.ceil((start + 1) / 60) * 60 - start} min, dann noch ${dur - (Math.ceil((start + 1) / 60) * 60 - start)} min.<br>→ Ankunft <b>${hm(end)} Uhr</b>`,
        check([h, m]) {
          return { ok: h * 60 + m === end % 1440 || (h === 24 && m === end % 60 && end % 1440 < 60) };
        },
        answerText: `${hm(end)} Uhr`,
      };
    return {
      prompt: `${what} nach ${dest} fährt um <b>${hm(start)} Uhr</b> ab und kommt um <b>${hm(end)} Uhr</b> an. Wie lange dauert die Fahrt?`,
      fields: [{ answer: dur, suffix: 'min' }],
      hint: 'Zähle von der Abfahrt bis zur nächsten vollen Stunde, dann weiter bis zur Ankunft.',
      solution: `Von ${hm(start)} bis ${hm(end)}: ${hm(end)} − ${hm(start)} = <b>${dur} min</b>`,
    };
  }

  function sachaufgaben() {
    const v = R(1, 3);
    if (v === 1) {
      const item = pick([['Heft', 'Hefte'], ['Brezel', 'Brezeln'], ['Kugel Eis', 'Kugeln Eis'], ['Sammelkarte', 'Sammelkarten'], ['Apfel', 'Äpfel']]);
      const price = R(9, 99) * 5, n = R(2, 9);
      return {
        prompt: `Ein${item[0] === 'Brezel' || item[0] === 'Kugel Eis' || item[0] === 'Sammelkarte' ? 'e' : ''} ${item[0]} kostet <b>${fmt(price / 100)} €</b>. Wie viel kosten <b>${n} ${item[1]}</b>?`,
        fields: [{ answer: (price * n) / 100, suffix: '€' }],
        hint: 'Rechne in Cent, wenn dir das leichter fällt: Preis in Cent mal Anzahl.',
        solution: `${price} ct · ${n} = ${price * n} ct = <b>${fmt((price * n) / 100)} €</b>`,
      };
    }
    if (v === 2) {
      const n = R(12, 28), per = R(8, 45);
      return {
        prompt: `Die Klasse 5b mit <b>${n} Kindern</b> fährt ins Schullandheim. Die Fahrt kostet zusammen <b>${fmt(n * per)} €</b>. Wie viel zahlt jedes Kind?`,
        fields: [{ answer: per, suffix: '€' }],
        hint: 'Gesamtkosten durch die Anzahl der Kinder teilen.',
        solution: `${fmt(n * per)} € : ${n} = <b>${per} €</b>`,
      };
    }
    const pay = pick([5, 10, 20, 50]);
    const cost = R(Math.round(pay * 20 * 0.3), pay * 20 - 1) * 5;
    return {
      prompt: `Du kaufst für <b>${fmt(cost / 100)} €</b> ein und bezahlst mit einem <b>${pay}-€-Schein</b>. Wie viel Wechselgeld bekommst du?`,
      fields: [{ answer: (pay * 100 - cost) / 100, suffix: '€' }],
      hint: 'Ergänze vom Preis bis zum bezahlten Betrag, oder rechne Schein − Preis.',
      solution: `${pay},00 € − ${fmt(cost / 100)} € = <b>${fmt((pay * 100 - cost) / 100)} €</b>`,
    };
  }

  // =====================================================
  // Struktur Klasse 5
  // =====================================================
  M.grades = M.grades || {};
  M.grades[5] = {
    title: 'Klasse 5',
    lbs: [
      {
        id: 'k5-lb1', nr: 1, title: 'Natürliche Zahlen', color: 'c1',
        topics: [
          { id: 'k5-runden', title: 'Runden', icon: '≈', gen: runden },
          { id: 'k5-vorteil', title: 'Geschickt rechnen', icon: '⚡', gen: vorteilhaft },
          { id: 'k5-potenz', title: 'Quadrat- & Zehnerpotenzen', icon: 'x²', gen: potenzen },
          { id: 'k5-division', title: 'Schriftlich dividieren', icon: '÷', gen: division },
          { id: 'k5-teilbar', title: 'Teilbarkeitsregeln', icon: '∣', gen: teilbarkeit },
          { id: 'k5-prim', title: 'Primzahlen & Primfaktoren', icon: 'P', gen: primzahlen },
          { id: 'k5-gleichung', title: 'Einfache Gleichungen', icon: 'x', gen: gleichungen },
        ],
      },
      {
        id: 'k5-lb2', nr: 2, title: 'Brüche & Dezimalzahlen', color: 'c2',
        topics: [
          { id: 'k5-anteil', title: 'Anteile berechnen', icon: '⅔', gen: anteile },
          { id: 'k5-kuerzen', title: 'Kürzen', icon: '↘', gen: kuerzen },
          { id: 'k5-erweitern', title: 'Erweitern', icon: '↗', gen: erweitern },
          { id: 'k5-umwandeln', title: 'Bruch · Dezimal · Prozent', icon: '%', gen: umwandeln },
          { id: 'k5-dezimal', title: 'Mit Dezimalzahlen rechnen', icon: '0,5', gen: dezimalrechnen },
          { id: 'k5-vergleich', title: 'Zahlen vergleichen', icon: '<', gen: vergleichen },
          { id: 'k5-mittel', title: 'Arithmetisches Mittel', icon: 'ø', gen: mittelwert },
        ],
      },
      {
        id: 'k5-lb3', nr: 3, title: 'Geometrie: Lage & Winkel', color: 'c3',
        topics: [
          { id: 'k5-koord', title: 'Koordinatensystem', icon: '⌖', gen: koordinaten },
          { id: 'k5-winkelart', title: 'Winkelarten', icon: '∠', gen: winkelarten },
          { id: 'k5-winkelpaar', title: 'Winkel an Geraden', icon: '✕', gen: winkelpaare },
        ],
      },
      {
        id: 'k5-lb4', nr: 4, title: 'Rechtecke & Quader', color: 'c4',
        topics: [
          { id: 'k5-rechteck', title: 'Umfang & Fläche', icon: '▭', gen: rechteck },
          { id: 'k5-quader', title: 'Volumen & Oberfläche', icon: '⬚', gen: quader },
        ],
      },
      {
        id: 'k5-lb5', nr: 5, title: 'Mathe im Alltag', color: 'c5',
        topics: [
          { id: 'k5-einheit', title: 'Einheiten umrechnen', icon: 'm', gen: einheiten },
          { id: 'k5-fahrplan', title: 'Fahrpläne & Zeit', icon: '⏱', gen: fahrplan },
          { id: 'k5-sach', title: 'Sachaufgaben mit Geld', icon: '€', gen: sachaufgaben },
        ],
      },
    ],
  };
})();
