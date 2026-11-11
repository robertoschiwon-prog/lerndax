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
  const near = (a, b) => Math.abs(a - b) <= 1e-9 * Math.max(1, Math.abs(b));

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
  // Neutrale Vornamen für Textaufgaben (keine echten Namen: Trainingsseiten sind per Link öffentlich)
  const NAMEN = ['Lina', 'Emil', 'Mia', 'Paul', 'Ida', 'Ben', 'Lea', 'Noah'];
  // Geld immer mit zwei Stellen nach dem Komma: 5,60 €
  // Wechselgeld ergänzen: vom Preis zum nächsten vollen Euro, zum nächsten Zehner, zum bezahlten Betrag (alles in Cent)
  U.wechselSchritte = (cost, pay) => {
    const pts = [cost];
    let cur = cost;
    for (const step of [100, 1000]) { const nx = Math.ceil(cur / step) * step; if (nx > cur && nx < pay) { pts.push(nx); cur = nx; } }
    pts.push(pay);
    return pts.slice(1).map((p, i) => [pts[i], p]);
  };
  const euro = (cents) => `${fmt(Math.floor(cents / 100))},${String(cents % 100).padStart(2, '0')} €`;

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
      ex: { mode: 'rund', n, p },
    };
  }

  // Animation „Geschickt rechnen“: Zahlen umstellen und bündeln (tausch) bzw. Distributivgesetz
  function tauschEx(parts, first, second, op, glatt) {
    const tokens = []; parts.forEach((p, i) => { if (i) tokens.push(op); tokens.push(p); });
    // Indizes statt Werte merken (dieselbe Zahl kann zweimal vorkommen, z. B. 25 · 25 · 4)
    const used = [], idxOf = (p) => { const i = parts.findIndex((q, j) => q === p && !used.includes(j)); used.push(i); return i; };
    const idx = [idxOf(first), idxOf(second)]; parts.forEach((_, j) => { if (!idx.includes(j)) idx.push(j); });
    const nums = idx.map((j) => parts[j]);
    const order = []; idx.forEach((j, i) => { order[2 * i] = 2 * j; if (i) order[2 * i - 1] = 2 * i - 1; });
    const rest = nums.slice(2).join(` ${op} `);
    const val = op === '·' ? +glatt * +rest : +glatt + +rest;
    return {
      mode: 'tausch', tokens, order,
      steps: [
        { line: `${nums.join(` ${op} `)}`, say: `Umgestellt: <b>${first} ${op} ${second}</b> stehen jetzt nebeneinander.` },
        { line: `= ${glatt} ${op} ${rest}`, say: `${first} ${op} ${second} = <b>${glatt}</b>. Das ist eine glatte Zahl!` },
        { line: `= ${fmt(val)}`, say: `${glatt} ${op} ${rest} = <b>${fmt(val)}</b><br><small>Erst die glatten Paare suchen, dann ist der Rest ganz leicht.</small>` },
      ],
    };
  }
  function vorteilhaft() {
    const v = R(1, 5), t = vorteilFor(v), alt = vorteilFor(v);
    if (t.ex && alt.ex) t.ex.alt = alt.ex;
    return t;
  }
  function vorteilFor(v) {
    if (v === 1) {
      const k = R(12, 99);
      const parts = shuffle(['25', String(k), '4']);
      return {
        prompt: `Rechne geschickt: <b>${parts.join(' · ')}</b>`,
        fields: [{ answer: 100 * k }],
        hint: 'Welche zwei Zahlen ergeben malgenommen eine glatte Zahl?',
        solution: `Erst 25 · 4 = 100 (Vertauschungsgesetz).<br>100 · ${k} = <b>${fmt(100 * k)}</b>`,
        ex: tauschEx(parts, '25', '4', '·', '100'),
      };
    }
    if (v === 2) {
      const a = R(11, 89), c = 100 - a, b = R(12, 88);
      return {
        prompt: `Rechne geschickt: <b>${a} + ${b} + ${c}</b>`,
        fields: [{ answer: 100 + b }],
        hint: 'Suche zwei Zahlen, die zusammen 100 ergeben.',
        solution: `${a} + ${c} = 100, dann 100 + ${b} = <b>${100 + b}</b>`,
        ex: tauschEx([String(a), String(b), String(c)], String(a), String(c), '+', '100'),
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
        ex: { mode: 'ges', law: 'dis', f: k, x: 100, y: Math.abs(d), minus: d < 0 },
      };
    }
    if (v === 4) {
      const a = R(3, 19), b = R(11, 89), c = 100 - b;
      return {
        prompt: `Rechne geschickt: <b>${a} · ${b} + ${a} · ${c}</b>`,
        fields: [{ answer: 100 * a }],
        hint: 'Beide Produkte haben einen gemeinsamen Faktor. Klammere ihn aus.',
        solution: `${a} · ${b} + ${a} · ${c} = ${a} · (${b} + ${c}) = ${a} · 100 = <b>${fmt(100 * a)}</b> (Verteilungsgesetz)`,
        ex: { mode: 'ges', law: 'dis', f: a, x: b, y: c, back: true },
      };
    }
    const k = R(3, 49);
    const parts = shuffle(['125', String(k), '8']);
    return {
      prompt: `Rechne geschickt: <b>${parts.join(' · ')}</b>`,
      fields: [{ answer: 1000 * k }],
      hint: '125 · 8 ergibt eine sehr glatte Zahl.',
      solution: `125 · 8 = 1000, dann 1000 · ${k} = <b>${fmt(1000 * k)}</b>`,
      ex: tauschEx(parts, '125', '8', '·', '1000'),
    };
  }

  // ---------- Vorrangregeln ----------
  // Klammer zuerst · Potenz vor Punkt · Punkt vor Strich · sonst von links nach rechts
  const VR_HINT = 'Reihenfolge: <b>Klammer</b> zuerst, dann <b>Potenz</b>, dann <b>Punkt</b> (· und :), zuletzt <b>Strich</b> (+ und −). Sonst von links nach rechts.';
  // Gibt jeder Vorrang-Aufgabe den Rechenausdruck für den Rechenbaum mit (ex.e, ² als Zeichen).
  function vorrang() {
    const t = vorrang0();
    const plain = (h) => h.replace(/<sup>2<\/sup>/g, '²').replace(/<[^>]+>/g, '');
    let e = null;
    if (/^Welche Rechnung/.test(t.prompt)) e = plain(t.choices[t.correct]);
    else { const m = t.prompt.match(/<b>(.*?)<\/b>/); if (m) e = plain(m[1]); }
    if (e) t.ex = { mode: 'tree', e };
    return t;
  }
  function vorrang0() {
    const v = R(1, 11);
    if (v === 1) {
      const a = R(2, 60), b = R(2, 9), c = R(2, 12), p = b * c;
      return {
        prompt: `Berechne: <b>${a} + ${b} · ${c}</b>`,
        fields: [{ answer: a + p }],
        hint: 'Punkt vor Strich: Was musst du zuerst rechnen?',
        solution: `Punkt vor Strich: zuerst <b>${b} · ${c} = ${p}</b><br>${a} + ${p} = <b>${a + p}</b>`,
      };
    }
    if (v === 2) {
      const b = R(2, 9), c = R(2, 9), p = b * c, a = p + R(2, 60);
      return {
        prompt: `Berechne: <b>${a} − ${b} · ${c}</b>`,
        fields: [{ answer: a - p }],
        hint: 'Punkt vor Strich: Was musst du zuerst rechnen?',
        solution: `Punkt vor Strich: zuerst <b>${b} · ${c} = ${p}</b><br>${a} − ${p} = <b>${a - p}</b>`,
      };
    }
    if (v === 3) {
      const a = R(2, 9), b = R(2, 9), c = R(2, 9), d = R(2, 9);
      return {
        prompt: `Berechne: <b>${a} · ${b} + ${c} · ${d}</b>`,
        fields: [{ answer: a * b + c * d }],
        hint: 'Punkt vor Strich: Rechne beide Malaufgaben zuerst.',
        solution: `Punkt vor Strich: <b>${a} · ${b} = ${a * b}</b> und <b>${c} · ${d} = ${c * d}</b><br>${a * b} + ${c * d} = <b>${a * b + c * d}</b>`,
      };
    }
    if (v === 4) {
      const a = R(2, 30), b = R(2, 30), c = R(2, 9), s = a + b;
      return {
        prompt: `Berechne: <b>(${a} + ${b}) · ${c}</b>`,
        fields: [{ answer: s * c }],
        hint: 'Was in der Klammer steht, wird immer zuerst gerechnet.',
        solution: `Klammer zuerst: <b>${a} + ${b} = ${s}</b><br>${s} · ${c} = <b>${s * c}</b>`,
      };
    }
    if (v === 5) {
      const c = R(2, 9), q = R(2, 15), s = c * q, b = R(1, s - 1), a = s + b;
      // (a − b) : c mit Ergebnis q; a − b = s
      return {
        prompt: `Berechne: <b>(${a} − ${b}) : ${c}</b>`,
        fields: [{ answer: q }],
        hint: 'Was in der Klammer steht, wird immer zuerst gerechnet.',
        solution: `Klammer zuerst: <b>${a} − ${b} = ${s}</b><br>${s} : ${c} = <b>${q}</b>`,
      };
    }
    if (v === 6) {
      const b = R(2, 9), q = R(2, 12), a = b * q, c = R(2, 50);
      const front = Math.random() < 0.5;
      const expr = front ? `${c} + ${a} : ${b}` : `${a} : ${b} + ${c}`;
      return {
        prompt: `Berechne: <b>${expr}</b>`,
        fields: [{ answer: q + c }],
        hint: 'Geteilt ist auch eine Punktrechnung: Punkt vor Strich.',
        solution: `Punkt vor Strich: zuerst <b>${a} : ${b} = ${q}</b><br>${front ? `${c} + ${q}` : `${q} + ${c}`} = <b>${q + c}</b>`,
      };
    }
    if (v === 7) {
      // nur Strich oder nur Punkt: von links nach rechts
      if (Math.random() < 0.5) {
        const b = R(5, 40), a = b + R(5, 60), c = R(2, 30);
        return {
          prompt: `Berechne: <b>${a} − ${b} + ${c}</b>`,
          fields: [{ answer: a - b + c }],
          hint: 'Nur Plus und Minus: Rechne einfach von links nach rechts.',
          solution: `Nur Strichrechnung → von links nach rechts:<br><b>${a} − ${b} = ${a - b}</b>, dann ${a - b} + ${c} = <b>${a - b + c}</b><br><small>Achtung: ${b} + ${c} zuerst wäre falsch!</small>`,
        };
      }
      const b = R(2, 9), q = R(2, 12), a = b * q, c = R(2, 9);
      return {
        prompt: `Berechne: <b>${a} : ${b} · ${c}</b>`,
        fields: [{ answer: q * c }],
        hint: 'Nur Mal und Geteilt: Rechne einfach von links nach rechts.',
        solution: `Nur Punktrechnung → von links nach rechts:<br><b>${a} : ${b} = ${q}</b>, dann ${q} · ${c} = <b>${q * c}</b>`,
      };
    }
    if (v === 8) {
      // Potenz vor Punkt vor Strich
      const b = R(2, 9), sq = b * b;
      if (Math.random() < 0.5) {
        const a = R(2, 40), c = R(2, 5);
        return {
          prompt: `Berechne: <b>${a} + ${b}${sup(2)} · ${c}</b>`,
          fields: [{ answer: a + sq * c }],
          hint: 'Die Potenz kommt noch vor Punkt und Strich.',
          solution: `Potenz zuerst: <b>${b}${sup(2)} = ${sq}</b><br>Punkt vor Strich: <b>${sq} · ${c} = ${sq * c}</b><br>${a} + ${sq * c} = <b>${a + sq * c}</b>`,
        };
      }
      const a = R(1, 6), c = R(1, 6), s = a + c;
      return {
        prompt: `Berechne: <b>(${a} + ${c})${sup(2)}</b>`,
        fields: [{ answer: s * s }],
        hint: 'Erst die Klammer, dann quadrieren.',
        solution: `Klammer zuerst: <b>${a} + ${c} = ${s}</b><br>${s}${sup(2)} = ${s} · ${s} = <b>${s * s}</b><br><small>Nicht ${a}${sup(2)} + ${c}${sup(2)} = ${a * a + c * c}!</small>`,
      };
    }
    if (v === 9) {
      // längere Kette
      const b = R(2, 6), c = R(2, 6), d = R(2, 9);
      const a = b * (c + d) + R(1, 40);
      const k = c + d, m = b * k;
      return {
        prompt: `Berechne: <b>${a} − ${b} · (${c} + ${d})</b>`,
        fields: [{ answer: a - m }],
        hint: VR_HINT,
        solution: `1. Klammer: <b>${c} + ${d} = ${k}</b><br>2. Punkt vor Strich: <b>${b} · ${k} = ${m}</b><br>3. ${a} − ${m} = <b>${a - m}</b>`,
      };
    }
    if (v === 10) {
      // Was rechnest du zuerst? (a groß genug, damit kein Zwischenergebnis negativ wird)
      const a = R(12, 40), b = R(2, 9), c = R(2, 9), d = R(2, 9);
      const forms = [
        { e: `${a} + ${b} · ${c} − ${d}`, ch: [`${a} + ${b}`, `${b} · ${c}`, `${c} − ${d}`], k: 1, why: 'Punkt vor Strich.' },
        { e: `${a} · (${b} + ${c}) − ${d}`, ch: [`${a} · ${b}`, `${b} + ${c}`, `${c} − ${d}`], k: 1, why: 'Klammer zuerst.' },
        { e: `${a} − ${b} + ${c} · ${d}`, ch: [`${a} − ${b}`, `${b} + ${c}`, `${c} · ${d}`], k: 2, why: 'Punkt vor Strich.' },
        { e: `${a} + ${b} − ${c} + ${d}`, ch: [`${a} + ${b}`, `${b} − ${c}`, `${c} + ${d}`], k: 0, why: 'Nur Strichrechnung: von links nach rechts.' },
        { e: `${a} + ${b}² · ${c}`, ch: [`${a} + ${b}`, `${b}²`, `${b} · ${c}`], k: 1, why: 'Potenz vor Punkt vor Strich.' },
      ];
      const f = pick(forms);
      return {
        prompt: `Was rechnest du bei <b>${f.e.replace('²', sup(2))}</b> <i>zuerst</i>?`,
        choices: f.ch.map((c) => c.replace('²', sup(2))),
        correct: f.k,
        hint: VR_HINT,
        solution: `${f.why} Zuerst kommt <b>${f.ch[f.k].replace('²', sup(2))}</b>.`,
      };
    }
    // v === 11: Wo gehört die Klammer hin?
    const a = R(2, 9), b = R(2, 9), c = R(2, 9);
    const withB = (a + b) * c, noB = a + b * c;
    if (withB === noB) return vorrang0();
    const wantB = Math.random() < 0.5;
    const target = wantB ? withB : noB;
    return {
      prompt: `Welche Rechnung ergibt <b>${target}</b>?`,
      choices: [`(${a} + ${b}) · ${c}`, `${a} + ${b} · ${c}`],
      correct: wantB ? 0 : 1,
      hint: 'Rechne beide aus. Denk an Punkt vor Strich und Klammer zuerst.',
      solution: `(${a} + ${b}) · ${c} = ${a + b} · ${c} = ${withB}<br>${a} + ${b} · ${c} = ${a} + ${b * c} = ${noB}<br>→ <b>${wantB ? `(${a} + ${b}) · ${c}` : `${a} + ${b} · ${c}`}</b>`,
    };
  }

  // ---------- Rechengesetze ----------
  const GESETZE = [
    'Kommutativgesetz<br><small>Vertauschungsgesetz</small>',
    'Assoziativgesetz<br><small>Verbindungsgesetz</small>',
    'Distributivgesetz<br><small>Verteilungsgesetz</small>',
  ];
  const GESETZ_HINT = '<b>Kommutativ</b>: Zahlen vertauschen. <b>Assoziativ</b>: Klammern verschieben. <b>Distributiv</b>: einen Faktor auf eine Summe verteilen.';
  const GESETZ_KURZ = ['Kommutativgesetz (Vertauschungsgesetz)', 'Assoziativgesetz (Verbindungsgesetz)', 'Distributivgesetz (Verteilungsgesetz)'];
  function gesetze() {
    const v = R(1, 7);
    if (v <= 3) {
      // Welches Gesetz?
      const which = v - 1;
      const a = R(2, 40), b = R(2, 40), c = R(2, 20), op = pick(['+', '·']);
      const s = op === '·' ? [R(2, 12), R(2, 12), R(2, 12)] : [a, b, c];
      let eq, why, ex;
      if (which === 0) {
        ex = { mode: 'ges', law: 'kom', op, nums: [s[0], s[1]] };
        eq = `${s[0]} ${op} ${s[1]} = ${s[1]} ${op} ${s[0]}`;
        why = 'Die beiden Zahlen wurden <b>vertauscht</b>, das Ergebnis bleibt gleich.';
      } else if (which === 1) {
        ex = { mode: 'ges', law: 'ass', op, nums: s };
        eq = `(${s[0]} ${op} ${s[1]}) ${op} ${s[2]} = ${s[0]} ${op} (${s[1]} ${op} ${s[2]})`;
        why = 'Die Zahlen bleiben an ihrem Platz, nur die <b>Klammer wurde verschoben</b>.';
      } else {
        const f = R(2, 9), x = R(10, 40), y = R(2, 9), minus = Math.random() < 0.3, o = minus ? '−' : '+';
        const back = Math.random() < 0.5;
        eq = !back
          ? `${f} · (${x} ${o} ${y}) = ${f} · ${x} ${o} ${f} · ${y}`
          : `${f} · ${x} ${o} ${f} · ${y} = ${f} · (${x} ${o} ${y})`;
        ex = { mode: 'ges', law: 'dis', f, x, y, minus, back };
        why = `Der Faktor <b>${f}</b> wird auf beide Zahlen in der Klammer <b>verteilt</b> (oder umgekehrt ausgeklammert).`;
      }
      return {
        prompt: `Welches Rechengesetz wurde benutzt?<br><b>${eq}</b>`,
        choices: GESETZE,
        correct: which,
        hint: GESETZ_HINT,
        solution: `${why}<br>→ <b>${GESETZ_KURZ[which]}</b>`,
        answerText: GESETZ_KURZ[which],
        ex,
      };
    }
    if (v === 4) {
      // Lücke beim Distributivgesetz
      const f = R(3, 9), t = pick([20, 30, 40, 50, 60, 70, 80, 90]), e = R(1, 9), n = t + e;
      return {
        prompt: `Ergänze mit dem Distributivgesetz:`,
        fields: [{ answer: e, prefix: `${f} · ${n} = ${f} · ${t} + ${f} ·` }],
        hint: `Zerlege ${n} in ${t} + ?`,
        solution: `${n} = ${t} + ${e}, also ${f} · ${n} = ${f} · ${t} + ${f} · <b>${e}</b> = ${f * t} + ${f * e} = ${f * n}`,
        ex: { mode: 'ges', law: 'dis', f, x: t, y: e },
      };
    }
    if (v === 5) {
      // Lücke beim Kommutativ-/Assoziativgesetz
      const a = R(2, 30), b = R(2, 30), c = R(2, 30);
      if (Math.random() < 0.5)
        return {
          prompt: `Ergänze so, dass das <b>Assoziativgesetz</b> passt:`,
          fields: [{ answer: c, prefix: `(${a} + ${b}) + ${c} = ${a} + (${b} +`, suffix: ')' }],
          hint: 'Beim Assoziativgesetz bleiben alle Zahlen gleich, nur die Klammer wandert.',
          solution: `(${a} + ${b}) + ${c} = ${a} + (${b} + <b>${c}</b>)`,
          ex: { mode: 'ges', law: 'ass', op: '+', nums: [a, b, c] },
        };
      return {
        prompt: `Ergänze so, dass das <b>Kommutativgesetz</b> passt:`,
        fields: [{ answer: a, prefix: `${a} · ${b} = ${b} ·` }],
        hint: 'Beim Kommutativgesetz werden die Zahlen vertauscht.',
        solution: `${a} · ${b} = ${b} · <b>${a}</b>`,
        ex: { mode: 'ges', law: 'kom', op: '·', nums: [a, b] },
      };
    }
    if (v === 6) {
      // Gilt das Gesetz auch für Minus und Geteilt?
      const cases = [
        () => { const a = R(10, 30), b = R(2, 9); return { lv: a - b, rv: null, rno: `${b} ist kleiner als ${a}. Das geht mit natürlichen Zahlen nicht.`, e: `${a} − ${b} = ${b} − ${a}`, ok: false, why: `${a} − ${b} = ${a - b}, aber ${b} − ${a} geht mit natürlichen Zahlen gar nicht. Bei <b>Minus</b> darf man <b>nicht</b> vertauschen.` }; },
        () => { const b = R(2, 4), q = R(2, 5), a = b * q * 4; return { lv: a / b, rv: null, rno: `${b} ist kleiner als ${a}. Es kommt keine natürliche Zahl heraus.`, e: `${a} : ${b} = ${b} : ${a}`, ok: false, why: `${a} : ${b} = ${a / b}, aber ${b} : ${a} ist keine natürliche Zahl. Bei <b>Geteilt</b> darf man <b>nicht</b> vertauschen.` }; },
        () => { const a = R(20, 40), b = R(5, 9), c = R(2, 4); return { lv: a - b - c, rv: a - b + c, e: `(${a} − ${b}) − ${c} = ${a} − (${b} − ${c})`, ok: false, why: `Links: ${a - b} − ${c} = ${a - b - c}. Rechts: ${a} − ${b - c} = ${a - b + c}. Bei <b>Minus</b> darf man die Klammer <b>nicht</b> verschieben.` }; },
        () => { const c = 2, b = 4, a = 8 * R(2, 6); return { lv: a / b / c, rv: a / (b / c), e: `(${a} : ${b}) : ${c} = ${a} : (${b} : ${c})`, ok: false, why: `Links: ${a / b} : ${c} = ${a / b / c}. Rechts: ${a} : ${b / c} = ${a / (b / c)}. Bei <b>Geteilt</b> darf man die Klammer <b>nicht</b> verschieben.` }; },
        () => { const a = R(2, 12), b = R(2, 12); return { lv: a * b, rv: a * b, e: `${a} · ${b} = ${b} · ${a}`, ok: true, why: `Beide Seiten ergeben ${a * b}. Bei <b>Mal</b> darf man vertauschen (Kommutativgesetz).` }; },
        () => { const a = R(2, 30), b = R(2, 30), c = R(2, 30); return { lv: a + b + c, rv: a + b + c, e: `(${a} + ${b}) + ${c} = ${a} + (${b} + ${c})`, ok: true, why: `Beide Seiten ergeben ${a + b + c}. Bei <b>Plus</b> darf man die Klammer verschieben (Assoziativgesetz).` }; },
      ];
      const kf = pick(cases), k = kf(), k2 = kf();
      const RULE = 'Kommutativ- und Assoziativgesetz gelten nur für <b>Plus</b> und <b>Mal</b>.';
      const pr = (c) => { const [left, right] = c.e.split(' = '); return { mode: 'pruef', left, right, lv: c.lv, rv: c.rv, rno: c.rno, ok: c.ok, rule: RULE }; };
      return {
        ex: Object.assign(pr(k), { alt: pr(k2) }),
        prompt: `Stimmt das?<br><b>${k.e}</b>`,
        choices: ['Stimmt', 'Stimmt nicht'],
        correct: k.ok ? 0 : 1,
        hint: 'Kommutativ- und Assoziativgesetz gelten nur für <b>Plus</b> und <b>Mal</b>. Rechne zur Sicherheit beide Seiten aus.',
        solution: `${k.why}<br>→ <b>${k.ok ? 'Stimmt' : 'Stimmt nicht'}</b>`,
      };
    }
    // v === 7: Distributivgesetz rückwärts (ausklammern) mit Ergebnis
    const f = R(3, 9), x = R(11, 89), y = 100 - x;
    return {
      prompt: `Klammere aus und rechne: <b>${f} · ${x} + ${f} · ${y}</b>`,
      fields: [{ answer: f * 100 }],
      hint: `Beide Produkte haben den Faktor ${f}. Schreibe ${f} · (… + …).`,
      solution: `Distributivgesetz: ${f} · ${x} + ${f} · ${y} = ${f} · (${x} + ${y}) = ${f} · 100 = <b>${f * 100}</b>`,
      ex: { mode: 'ges', law: 'dis', f, x, y, back: true },
    };
  }

  function potenzen() {
    const v = R(1, 10);
    if (v === 1) {
      const n = R(11, 20);
      return {
        prompt: `Berechne: <b>${n}${sup(2)}</b>`,
        ex: { mode: 'quad', n },
        fields: [{ answer: n * n }],
        hint: `${n}${sup(2)} bedeutet ${n} · ${n}.`,
        solution: `${n} · ${n} = <b>${n * n}</b>`,
      };
    }
    if (v === 2) {
      const n = R(11, 20);
      return {
        prompt: `Welche natürliche Zahl ergibt quadriert <b>${n * n}</b>?`,
        ex: { mode: 'quad', n },
        fields: [{ answer: n }],
        hint: 'Probiere Zahlen zwischen 10 und 20. Schau auf die letzte Ziffer!',
        solution: `${n} · ${n} = ${n * n}, also <b>${n}</b>`,
      };
    }
    if (v === 3 || v === 4) {
      const k = R(2, 7);
      if (v === 3)
        return {
          prompt: `Schreibe als Zahl: <b>10${sup(k)}</b>`,
          ex: { mode: 'zehn', k },
          fields: [{ answer: 10 ** k }],
          hint: 'Der Exponent sagt dir, wie viele Nullen hinter der 1 stehen.',
          solution: `10${sup(k)} = 1 mit ${k} Nullen = <b>${fmt(10 ** k)}</b>`,
        };
      return {
        prompt: `Schreibe als Zehnerpotenz: <b>${fmt(10 ** k)}</b>`,
        ex: { mode: 'zehn', k },
        fields: [{ answer: k, prefix: '10 hoch' }],
        hint: 'Zähle die Nullen.',
        solution: `${fmt(10 ** k)} hat ${k} Nullen → <b>10${sup(k)}</b>`,
        answerText: `10${sup(k)}`,
      };
    }
    // allgemeine Potenzen: Basis 2–6, Ergebnis höchstens 1024
    const POW = [[2, 2], [2, 3], [2, 4], [2, 5], [2, 6], [2, 7], [2, 8], [2, 10], [3, 2], [3, 3], [3, 4], [3, 5], [4, 2], [4, 3], [4, 4], [5, 2], [5, 3], [5, 4], [6, 2], [6, 3], [1, 5], [1, 9], [7, 1], [9, 1]];
    const prod = (b, e) => Array(e).fill(b).join(' · ');
    if (v === 5 || v === 6) {
      const [b, e] = pick(POW);
      return {
        prompt: `Berechne: <b>${b}${sup(e)}</b>`,
        ex: { mode: 'pow', b, e },
        fields: [{ answer: b ** e }],
        hint: e === 1
          ? `Hoch 1 heißt: Die ${b} kommt nur <b>einmal</b> als Faktor vor.`
          : b === 1
            ? 'Die 1 kommt mehrmals als Faktor vor: 1 · 1 · 1 · …'
            : `Die Basis ${b} kommt <b>${e}-mal</b> als Faktor vor: ${prod(b, Math.min(e, 3))}${e > 3 ? ' · …' : ''}. Nicht ${b} · ${e}!`,
        solution: `${b}${sup(e)} = ${e > 1 ? prod(b, e) + ' = ' : ''}<b>${fmt(b ** e)}</b>${e === 1 ? ' (hoch 1: die Zahl selbst)' : b === 1 ? ' (1 mal 1 bleibt immer 1)' : ''}`,
      };
    }
    if (v === 7) {
      const [b, e] = pick(POW.filter(([b, e]) => b > 1 && e > 1));
      return {
        prompt: `Schreibe als Potenz: <b>${prod(b, e)}</b>`,
        ex: { mode: 'pow', b, e },
        fields: [{ answer: b, label: 'Basis' }, { answer: e, label: 'Exponent' }],
        hint: 'Die Basis ist die Zahl, die malgenommen wird. Der Exponent zählt, wie oft sie vorkommt.',
        solution: `Die ${b} kommt <b>${e}-mal</b> vor → <b>${b}${sup(e)}</b> (Basis ${b}, Exponent ${e})`,
        answerText: `${b}${sup(e)}`,
      };
    }
    if (v === 8) {
      // typischer Fehler: Basis · Exponent
      const [b, e] = pick(POW.filter(([b, e]) => b > 1 && e > 1 && b * e !== b ** e && b + e !== b ** e && e ** b !== b ** e));
      const opts = shuffle([b ** e, b * e, e ** b <= 2000 ? e ** b : b + e]);
      return {
        prompt: `Was ist <b>${b}${sup(e)}</b>?`,
        ex: { mode: 'pow', b, e },
        choices: opts.map(fmt),
        correct: opts.indexOf(b ** e),
        hint: `Der Exponent sagt, wie oft die ${b} als Faktor vorkommt.`,
        solution: `${b}${sup(e)} = ${prod(b, e)} = <b>${fmt(b ** e)}</b><br><small>Achtung: ${b} · ${e} = ${b * e} ist ein häufiger Fehler!</small>`,
      };
    }
    if (v === 9) {
      // Vergleichen
      const pairs = [[2, 5, 5, 2], [2, 4, 4, 2], [3, 4, 4, 3], [2, 6, 6, 2], [2, 3, 3, 2], [3, 2, 2, 3], [5, 3, 3, 5], [2, 10, 10, 2], [4, 3, 3, 4]];
      const [b1, e1, b2, e2] = pick(pairs);
      let alt; do alt = pick(pairs); while (alt[0] === b1 && alt[1] === e1);
      const A = b1 ** e1, B = b2 ** e2;
      const opts = [`${b1}${sup(e1)}`, `${b2}${sup(e2)}`, 'Beide gleich'];
      const k = A > B ? 0 : A < B ? 1 : 2;
      return {
        prompt: `Was ist größer: <b>${b1}${sup(e1)}</b> oder <b>${b2}${sup(e2)}</b>?`,
        choices: opts,
        correct: k,
        hint: 'Rechne beide Potenzen aus.',
        solution: `${b1}${sup(e1)} = ${fmt(A)} und ${b2}${sup(e2)} = ${fmt(B)} → <b>${opts[k]}</b>`,
        ex: { mode: 'vgl', b1, e1, b2, e2, alt: { mode: 'vgl', b1: alt[0], e1: alt[1], b2: alt[2], e2: alt[3] } },
      };
    }
    // v === 10: Zahl mal Zehnerpotenz oder Basis gesucht
    if (Math.random() < 0.5) {
      const a = R(2, 9), k = R(2, 6);
      return Math.random() < 0.5
        ? {
          prompt: `Berechne: <b>${a} · 10${sup(k)}</b>`,
          ex: { mode: 'zehn', k, a },
          fields: [{ answer: a * 10 ** k }],
          hint: `10${sup(k)} ist eine 1 mit ${k} Nullen.`,
          solution: `${a} · ${fmt(10 ** k)} = <b>${fmt(a * 10 ** k)}</b>`,
        }
        : {
          prompt: `Schreibe mit einer Zehnerpotenz: <b>${fmt(a * 10 ** k)}</b>`,
          ex: { mode: 'zehn', k, a },
          fields: [{ answer: k, prefix: `${a} · 10 hoch` }],
          hint: 'Zähle die Nullen hinter der ersten Ziffer.',
          solution: `${fmt(a * 10 ** k)} = ${a} · ${fmt(10 ** k)} = <b>${a} · 10${sup(k)}</b>`,
          answerText: `${a} · 10${sup(k)}`,
        };
    }
    const [b, e] = pick(POW.filter(([b, e]) => b > 1 && e >= 3));
    return {
      prompt: `Welche Zahl hoch ${e} ergibt <b>${fmt(b ** e)}</b>?`,
      ex: { mode: 'pow', b, e },
      fields: [{ answer: b, suffix: `<sup>${e}</sup> = ${fmt(b ** e)}` }],
      hint: 'Probiere kleine Zahlen: 2, 3, 4, 5 …',
      solution: `${prod(b, e)} = ${fmt(b ** e)} → <b>${b}</b>`,
    };
  }

  function division() {
    const v = R(1, 4);
    if (v === 1) {
      const d = R(2, 9), n = R(100, 999), q = Math.floor(n / d), r = n % d;
      return {
        prompt: `Dividiere schriftlich: <b>${n} : ${d}</b>`,
        ex: { mode: 'div', n, d },
        fields: [{ answer: q, label: 'Ergebnis' }, { answer: r, label: 'Rest' }],
        hint: 'Teile Stelle für Stelle von links. Bleibt am Ende nichts übrig, ist der Rest 0.',
        solution: `${n} : ${d} = <b>${q} Rest ${r}</b><br>Probe: ${d} · ${q} + ${r} = ${d * q} + ${r} = ${n} ✓`,
        answerText: `${q} Rest ${r}`,
      };
    }
    if (v === 2) {
      // größere Zahl (höchstens vierstellig), geht glatt auf (auch mit Null im Ergebnis)
      const d = R(3, 9);
      let q;
      do q = R(105, Math.floor(9999 / d)); while (Math.random() < 0.6 && !String(q).slice(1).includes('0'));
      const n = d * q;
      return {
        prompt: `Dividiere schriftlich: <b>${fmt(n)} : ${d}</b>`,
        ex: { mode: 'div', n, d },
        fields: [{ answer: q, label: 'Ergebnis' }],
        hint: `Teile Stelle für Stelle von links. Passt ${d} in eine Stelle nicht hinein, schreibst du eine <b>0</b> ins Ergebnis!`,
        solution: `${fmt(n)} : ${d} = <b>${fmt(q)}</b><br>Probe: ${d} · ${fmt(q)} = ${fmt(n)} ✓`,
      };
    }
    if (v === 3) {
      const d = R(3, 9), n = R(1000, 9999), q = Math.floor(n / d), r = n % d;
      return {
        prompt: `Dividiere schriftlich: <b>${fmt(n)} : ${d}</b>`,
        ex: { mode: 'div', n, d },
        fields: [{ answer: q, label: 'Ergebnis' }, { answer: r, label: 'Rest' }],
        hint: 'Teile Stelle für Stelle von links. Der Rest muss kleiner sein als die Zahl, durch die du teilst.',
        solution: `${fmt(n)} : ${d} = <b>${fmt(q)} Rest ${r}</b><br>Probe: ${d} · ${fmt(q)} + ${r} = ${fmt(d * q)} + ${r} = ${fmt(n)} ✓`,
        answerText: `${fmt(q)} Rest ${r}`,
      };
    }
    // v === 4: Probe – stimmt die Rechnung?
    const d = R(3, 9), q = R(102, 999), r = R(0, d - 1), n = d * q + r;
    const ok = Math.random() < 0.5;
    const shownQ = ok ? q : q + pick([-10, -1, 1, 10]);
    const shown = `${fmt(n)} : ${d} = ${fmt(shownQ)}${r ? ` Rest ${r}` : ''}`;
    const back = d * shownQ + r;
    return {
      prompt: `Mach die Probe: Stimmt <b>${shown}</b>?`,
      ex: { mode: 'probe', n, d, q: shownQ, r, qTrue: q },
      choices: ['Stimmt', 'Stimmt nicht'],
      correct: ok ? 0 : 1,
      hint: `Probe: Ergebnis mal ${d}${r ? ', plus Rest' : ''}. Kommt ${fmt(n)} heraus?`,
      solution: `Probe: ${d} · ${fmt(shownQ)}${r ? ` + ${r}` : ''} = ${fmt(back)} → ${ok ? `das ist ${fmt(n)}, <b>stimmt</b>` : `das ist nicht ${fmt(n)}, <b>stimmt nicht</b>. Richtig: ${fmt(q)}${r ? ` Rest ${r}` : ''}`}`,
    };
  }

  // Vielfache
  function vielfache() {
    const d = R(3, 12), v = R(1, 3);
    const V = (k) => d * k;
    const list = `V<sub>${d}</sub> = {${[1, 2, 3, 4, 5, 6].map(V).join(', ')}, …}`;
    if (v === 1) {
      const k = R(4, 10);
      return {
        prompt: `Was ist das <b>${k}. Vielfache</b> von <b>${d}</b>?`,
        fields: [{ answer: d * k }],
        hint: `Die Vielfachen von ${d} sind ${d}, ${2 * d}, ${3 * d}, … Das ${k}. ist ${k} · ${d}.`,
        solution: `${list}<br>Das ${k}. Vielfache ist ${k} · ${d} = <b>${d * k}</b>`,
        ex: { mode: 'vielf', kind: 'nte', d, k, via: 'k5-teilbar' },
      };
    }
    if (v === 2) {
      const g = R(3, 9) * 10 + R(0, 9), ans = (Math.floor(g / d) + 1) * d;
      return {
        prompt: `Welches ist das <b>kleinste Vielfache</b> von <b>${d}</b>, das <b>größer als ${g}</b> ist?`,
        fields: [{ answer: ans }],
        hint: `Wie oft passt ${d} in ${g}? Dann einmal mehr.`,
        solution: `${g} : ${d} = ${Math.floor(g / d)} Rest ${g % d}, also ist ${Math.floor(g / d)} · ${d} = ${Math.floor(g / d) * d} noch zu klein.<br>${Math.floor(g / d) + 1} · ${d} = <b>${ans}</b>`,
        ex: { mode: 'vielf', kind: 'groesser', d, g, via: 'k5-teilbar' },
      };
    }
    const right = d * R(5, 12);
    const wrong = shuffle([...new Set([right + R(1, d - 1), right - R(1, d - 1), right + d + R(1, d - 1)])].filter((x) => x % d !== 0)).slice(0, 3);
    const opts = shuffle([right, ...wrong]);
    return {
      prompt: `Welche Zahl ist ein <b>Vielfaches von ${d}</b>?`,
      choices: opts.map(String),
      correct: opts.indexOf(right),
      hint: `Ein Vielfaches von ${d} lässt sich ohne Rest durch ${d} teilen.`,
      solution: `${right} = ${right / d} · ${d} → <b>${right}</b> ist ein Vielfaches von ${d}.${wrong.length ? `<br><small>Die anderen haben beim Teilen durch ${d} einen Rest.</small>` : ''}`,
      ex: { mode: 'vielf', kind: 'welche', d, opts: [...opts].sort((p, q) => p - q), via: 'k5-teilbar' },
    };
  }

  // Textaufgaben quer durch Lernbereich 1 (Querbeet vor der Arbeit)
  function textaufgaben() {
    const v = R(1, 6);
    if (v === 1) {
      // Verteilen mit Rest
      const ctx = pick([
        ['Kronkorken', 'sammelt die Klasse', 'in einen Beutel', 'Beutel', 'Kronkorken'],
        ['Fotos', `hat ${pick(NAMEN)}`, 'auf eine Albumseite', 'Albumseiten', 'Foto'],
        ['Murmeln', 'hat die Schule für das Sportfest', 'in ein Säckchen', 'Säckchen', 'Murmel'],
        ['Kastanien', 'sammelt eine fünfte Klasse', 'in einen Korb', 'Körbe', 'Kastanie'],
      ]);
      const d = R(3, 9), n = R(150, 2000), q = Math.floor(n / d), r = n % d;
      return {
        prompt: `${fmt(n)} ${ctx[0]} ${ctx[1]}. Immer <b>${d}</b> kommen ${ctx[2]}. Wie viele <b>${ctx[3]}</b> werden voll, und wie viele ${ctx[0]} bleiben übrig?`,
        fields: [{ answer: q, label: `volle ${ctx[3]}` }, { answer: r, label: 'übrig' }],
        hint: `Rechne ${fmt(n)} : ${d}. Der Rest ist das, was übrig bleibt.`,
        solution: `${fmt(n)} : ${d} = ${fmt(q)} Rest ${r}<br>→ <b>${fmt(q)}</b> ${ctx[3]} voll, <b>${r}</b> ${r === 1 ? ctx[4] + ' bleibt' : ctx[0] + ' bleiben'} übrig.`,
        ex: { mode: 'div', n, d, via: 'k5-division' },
        answerText: `${fmt(q)} voll, ${r} übrig`,
      };
    }
    if (v === 2) {
      // Rechnung aufstellen: Punkt vor Strich
      // [Mehrzahl, Einzahl, Preis von … bis in €] – ganze Euro, ungefähr wie im Laden
      const k = pick([['Hefte', 'Heft', 1, 2], ['Comichefte', 'Comicheft', 3, 5], ['Sticker-Packungen', 'Packung', 2, 4], ['Kugeln Eis', 'Kugel', 2, 2]]);
      const a = R(2, 6), p = R(k[2], k[3]), x = pick([['einen Stift', R(2, 5)], ['ein Getränk', R(2, 3)], ['einen Block', R(3, 6)]]);
      const sum = a * p + x[1];
      const pay = Math.ceil(sum / 10) * 10 + (sum % 10 === 0 ? 10 : 0);
      if (Math.random() < 0.5)
        return {
          prompt: `Du kaufst <b>${a} ${k[0]}</b> zu je <b>${p} €</b> und dazu <b>${x[0]}</b> für <b>${x[1]} €</b>. Wie viel musst du bezahlen?`,
          fields: [{ answer: sum, suffix: '€' }],
          hint: 'Schreib zuerst eine Rechnung auf. Denk an Punkt vor Strich.',
          solution: `Rechnung: <b>${a} · ${p} + ${x[1]}</b><br>Punkt vor Strich: ${a} · ${p} = ${a * p}, dann ${a * p} + ${x[1]} = <b>${sum} €</b>`,
          ex: { mode: 'tree', e: `${a} · ${p} + ${x[1]}`, via: 'k5-vorrang' },
        };
      return {
        prompt: `Du kaufst <b>${a} ${k[0]}</b> zu je <b>${p} €</b> und <b>${x[0]}</b> für <b>${x[1]} €</b>. Du bezahlst mit <b>${pay} €</b>. Wie viel Geld bekommst du zurück?`,
        fields: [{ answer: pay - sum, suffix: '€' }],
        hint: 'Rechne erst aus, was alles zusammen kostet. Achtung: Klammer!',
        solution: `Rechnung: <b>${pay} − (${a} · ${p} + ${x[1]})</b><br>Klammer zuerst: ${a} · ${p} + ${x[1]} = ${sum}, dann ${pay} − ${sum} = <b>${pay - sum} €</b>`,
        ex: { mode: 'tree', e: `${pay} − (${a} · ${p} + ${x[1]})`, via: 'k5-vorrang' },
      };
    }
    if (v === 3) {
      // Gruppen bilden: Teiler
      const n = pick([12, 18, 20, 24, 28, 30, 32, 36]);
      const T = []; for (let i = 1; i <= n; i++) if (n % i === 0) T.push(i);
      const inner = T.filter((t) => t > 1 && t < n);
      return {
        prompt: `<b>${n} Kinder</b> sollen in <b>gleich große</b> Gruppen eingeteilt werden. Jede Gruppe soll mindestens 2 Kinder haben, und es soll mehr als eine Gruppe geben. Wie viele <b>verschiedene Gruppengrößen</b> sind möglich?`,
        fields: [{ answer: inner.length }],
        hint: `Gesucht sind die Teiler von ${n}, ohne 1 und ohne ${n}.`,
        solution: `T<sub>${n}</sub> = {${T.join(', ')}}. Ohne 1 und ${n} bleiben ${inner.join(', ')} → <b>${inner.length}</b> Möglichkeiten.`,
        ex: { mode: 'teiler', n, via: 'k5-teilbar' },
      };
    }
    if (v === 4) {
      // Potenzen: Verdoppeln
      const k = R(4, 9);
      const c = pick([
        [`Eine Seerose verdoppelt jeden Tag ihre Blätter. Am Anfang hat sie <b>1 Blatt</b>. Wie viele Blätter hat sie nach <b>${k} Tagen</b>?`, 'Blätter'],
        [`Ein Gerücht: Jede Stunde erzählt jeder, der es kennt, es einer weiteren Person. Am Anfang kennt es <b>1 Person</b>. Wie viele kennen es nach <b>${k} Stunden</b>?`, 'Personen'],
        [`Ein Blatt Papier wird <b>${k}-mal</b> in der Mitte gefaltet. Wie viele Lagen liegen dann übereinander?`, 'Lagen'],
      ]);
      return {
        prompt: c[0],
        fields: [{ answer: 2 ** k, suffix: c[1] }],
        hint: `Jedes Mal verdoppeln: 1, 2, 4, 8, … Das ist 2 hoch ${k}.`,
        solution: `${k}-mal verdoppeln = 2<sup>${k}</sup> = ${Array(k).fill(2).join(' · ')} = <b>${2 ** k}</b> ${c[1]}`,
        ex: { mode: 'pow', b: 2, e: k, via: 'k5-potenz' },
      };
    }
    if (v === 5) {
      // Würfel aus kleinen Würfeln
      const k = R(2, 6);
      return {
        prompt: `Ein großer Würfel wird aus kleinen Würfeln gebaut: <b>${k}</b> lang, <b>${k}</b> breit, <b>${k}</b> hoch. Wie viele kleine Würfel braucht man?`,
        fields: [{ answer: k ** 3 }],
        hint: `Eine Schicht hat ${k} · ${k} Würfel, und es gibt ${k} Schichten.`,
        solution: `${k} · ${k} · ${k} = ${k}<sup>3</sup> = <b>${k ** 3}</b> kleine Würfel`,
        ex: { mode: 'pow', b: k, e: 3, via: 'k5-potenz' },
      };
    }
    // v === 6: gleichmäßig verteilen ohne Rest? (Teilbarkeit + Division)
    const d = pick([3, 4, 6, 9]);
    const ok = Math.random() < 0.5;
    let n = d * R(20, 180); if (!ok) n += R(1, d - 1);
    return {
      prompt: `Beim Schulfest gibt es <b>${fmt(n)} Lose</b>. Sie sollen <b>gleichmäßig</b> auf <b>${d} Stände</b> verteilt werden, ohne dass eins übrig bleibt. Geht das?`,
      choices: ['Ja', 'Nein'],
      correct: ok ? 0 : 1,
      hint: `Prüfe mit der Teilbarkeitsregel für ${d}.`,
      solution: `${fmt(n)} : ${d} = ${ok ? fmt(n / d) : `${fmt(Math.floor(n / d))} Rest ${n % d}`} → <b>${ok ? 'Ja' : 'Nein'}</b>${ok ? `, jeder Stand bekommt ${fmt(n / d)} Lose.` : `, es blieben ${n % d} übrig.`}`,
      ex: { mode: 'teil', n, d, via: 'k5-teilbar' },
    };
  }

  // Teilermengen
  const divisors = (n) => { const t = []; for (let i = 1; i <= n; i++) if (n % i === 0) t.push(i); return t; };
  function teiler() {
    const n = pick([12, 16, 18, 20, 24, 28, 30, 32, 36, 40, 42, 45, 48, 50, 54, 56, 60, 64, 72]);
    const T = divisors(n);
    const list = `T<sub>${n}</sub> = {${T.join(', ')}}`;
    if (Math.random() < 0.5)
      return {
        prompt: `Wie viele Teiler hat <b>${n}</b>?`,
        ex: { mode: 'teiler', n },
        fields: [{ answer: T.length, suffix: 'Teiler' }],
        hint: 'Suche Teiler-Paare: 1 · ' + n + ', 2 · …, und vergiss die 1 und die Zahl selbst nicht.',
        solution: `${list} → <b>${T.length} Teiler</b>`,
      };
    const non = [];
    for (let i = 2; i < n && non.length < 12; i++) if (n % i && i <= 12) non.push(i);
    const wrong = pick(non);
    const opts = shuffle([wrong, ...shuffle(T.filter((t) => t > 1 && t < n)).slice(0, 3)]);
    return {
      prompt: `Welche Zahl ist <b>kein</b> Teiler von <b>${n}</b>?`,
      ex: { mode: 'teiler', n },
      choices: opts.map(String),
      correct: opts.indexOf(wrong),
      hint: 'Prüfe für jede Zahl: Geht die Division ohne Rest auf?',
      solution: `${list}<br>${n} : ${wrong} geht nicht auf → <b>${wrong}</b>`,
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
    // Mischung: Teilermengen 25 %, Vielfache 25 %, „Welche ist teilbar?“ (4 Auswahl) 20 %, Ja/Nein 30 %
    const roll = Math.random();
    if (roll < 0.25) return teiler();
    if (roll < 0.5) return vielfache();
    if (roll < 0.7) return teilbarAuswahl();
    const d = pick([2, 3, 4, 5, 6, 9, 10, 3, 4, 6]);
    const yes = Math.random() < 0.5;
    let n = d * R(Math.ceil(100 / d), Math.floor(99999 / d));
    if (!yes) n += R(1, d - 1);
    const ok = n % d === 0;
    let why;
    if (d === 3 || d === 9) why = `Quersumme: ${String(n).split('').join(' + ')} = ${qs(n)}. ${qs(n)} ist ${qs(n) % d === 0 ? '' : '<b>nicht</b> '}durch ${d} teilbar.`;
    else if (d === 4) why = `Die letzten zwei Ziffern sind ${String(n % 100).padStart(2, '0')}. ${n % 100} ist ${(n % 100) % 4 === 0 ? '' : '<b>nicht</b> '}durch 4 teilbar.`;
    else if (d === 6) why = `Durch 2: ${n % 2 === 0 ? 'ja' : 'nein'} (letzte Ziffer ${n % 10}). Durch 3: ${qs(n) % 3 === 0 ? 'ja' : 'nein'} (Quersumme ${qs(n)}).`;
    else why = `Die letzte Ziffer ist ${n % 10}.`;
    return {
      prompt: `Ist <b>${fmt(n)}</b> durch <b>${d}</b> teilbar?`,
      ex: { mode: 'teil', n, d },
      choices: ['Ja', 'Nein'],
      correct: ok ? 0 : 1,
      hint: TEILER_REGELN[d],
      solution: `${why}<br>→ <b>${ok ? 'Ja' : 'Nein'}</b>, ${fmt(n)} ist ${ok ? '' : 'nicht '}durch ${d} teilbar.`,
    };
  }

  // Welche von vier Zahlen ist durch d teilbar? (weniger Raten als Ja/Nein)
  function teilbarAuswahl() {
    const d = pick([3, 4, 6, 9, 3, 4, 6, 9, 2, 5]);
    const right = d * R(Math.ceil(100 / d), Math.floor(9999 / d));
    const wrong = new Set();
    while (wrong.size < 3) {
      const w = d * R(Math.ceil(100 / d), Math.floor(9999 / d)) + R(1, d - 1);
      if (w % d !== 0 && w <= 9999 && w !== right) wrong.add(w);
    }
    const opts = shuffle([right, ...wrong]);
    const check = (n) => (d === 3 || d === 9) ? `Quersumme ${qs(n)}`
      : d === 4 ? `letzte zwei Ziffern ${String(n % 100).padStart(2, '0')}`
        : d === 6 ? `${n % 2 === 0 ? 'gerade' : 'ungerade'}, Quersumme ${qs(n)}`
          : `letzte Ziffer ${n % 10}`;
    return {
      prompt: `Welche Zahl ist durch <b>${d}</b> teilbar?`,
      ex: { mode: 'teil', n: right, d, via: 'k5-teilbar' },
      choices: opts.map(fmt),
      correct: opts.indexOf(right),
      hint: TEILER_REGELN[d],
      solution: `${opts.map((n) => `${fmt(n)}: ${check(n)} → ${n === right ? '<b>ja</b>' : 'nein'}`).join('<br>')}<br>→ <b>${fmt(right)}</b> ist durch ${d} teilbar.`,
    };
  }

  function primzahlen() {
    if (Math.random() < 0.2) {
      // Welche ist eine Primzahl? (eine Primzahl, drei Nicht-Primzahlen, die nicht sofort auffallen)
      const primes = []; for (let i = 11; i < 100; i++) if (isPrime(i)) primes.push(i);
      const tricky = []; for (let i = 21; i < 100; i++) if (!isPrime(i) && i % 2 && i % 5) tricky.push(i); // 21, 27, 33, 39, 49, 51, 57, 63, 69, 77, 81, 87, 91, 93, 99
      const p = pick(primes);
      const wrong = shuffle(tricky).slice(0, 3);
      const opts = shuffle([p, ...wrong]);
      return {
        prompt: 'Welche Zahl ist eine <b>Primzahl</b>?',
        ex: { mode: 'prime', n: p },
        choices: opts.map(String),
        correct: opts.indexOf(p),
        hint: 'Prüfe jede Zahl: Ist sie durch 3 oder 7 teilbar? Gerade Zahlen und Zahlen mit 5 oder 0 am Ende sind hier schon aussortiert.',
        solution: `${wrong.map((n) => `${n} = ${factorize(n)[0]} · ${n / factorize(n)[0]}`).join('<br>')}<br>→ Nur <b>${p}</b> ist eine Primzahl: Teiler sind nur 1 und ${p}.`,
      };
    }
    if (Math.random() < 0.32) {
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
      hint: 'Teile immer wieder durch die kleinste Primzahl, die passt (2, 3, 5, 7 …). Du darfst auch als Potenz schreiben, z. B. 2^3·5.',
      solution: (() => {
        const cnt = {}; f.forEach((p) => { cnt[p] = (cnt[p] || 0) + 1; });
        const pot = Object.keys(cnt).map((p) => (cnt[p] > 1 ? `${p}${sup(cnt[p])}` : p)).join(' · ');
        const withPow = Object.values(cnt).some((c) => c > 1);
        return `${steps.join('<br>')}<br>→ ${n} = <b>${f.join(' · ')}</b>${withPow ? `<br>Kürzer als Potenz: ${n} = <b>${pot}</b>` : ''}`;
      })(),
      answerText: f.join(' · '),
    };
  }

  function gleichungen() {
    const v = R(1, 4);
    let prompt, ans, sol, a, op;
    if (v === 1) {
      ans = R(5, 95); a = R(5, 95); op = '+';
      prompt = `${x} + ${a} = ${ans + a}`;
      sol = `Umkehraufgabe: ${x} = ${ans + a} − ${a} = <b>${ans}</b>`;
    } else if (v === 2) {
      ans = R(20, 150); a = R(5, ans - 1); op = '−';
      prompt = `${x} − ${a} = ${ans - a}`;
      sol = `Umkehraufgabe: ${x} = ${ans - a} + ${a} = <b>${ans}</b>`;
    } else if (v === 3) {
      ans = R(2, 15); a = R(2, 12); op = '·';
      prompt = `${a} · ${x} = ${a * ans}`;
      sol = `Umkehraufgabe: ${x} = ${a * ans} : ${a} = <b>${ans}</b>`;
    } else {
      a = R(2, 9); const b = R(2, 12); ans = a * b; op = ':';
      prompt = `${x} : ${a} = ${b}`;
      sol = `Umkehraufgabe: ${x} = ${b} · ${a} = <b>${ans}</b>`;
    }
    return {
      prompt: `Löse die Gleichung: <b>${prompt}</b>`,
      fields: [{ answer: ans, prefix: `${x} =` }],
      hint: 'Welche Zahl musst du für x einsetzen? Denk an die Umkehraufgabe.',
      solution: `${sol}<br>Probe: setze ${ans} für ${x} ein ✓`,
      answerText: `x = ${ans}`,
      ex: { mode: 'gl', op, a, ans },
    };
  }

  // =====================================================
  // LB 2 – Gemeine Brüche und Dezimalzahlen
  // =====================================================
  function anteile() {
    const d = R(2, 10), z = R(1, d - 1);
    const k = R(2, 12), whole = d * k;
    // [Einheit im Ergebnis, Einheit nach „von“ (Dativ)]
    const [unit, unitVon] = pick([['', ''], ['', ''], [' €', ' €'], [' kg', ' kg'], [' m', ' m'], [' Kinder', ' Kindern']]);
    const TEIL = { 2: 'ein Halbes', 3: 'ein Drittel', 4: 'ein Viertel', 5: 'ein Fünftel', 6: 'ein Sechstel', 7: 'ein Siebtel', 8: 'ein Achtel', 9: 'ein Neuntel', 10: 'ein Zehntel' };
    return {
      prompt: `Berechne ${fr(z, d)} von <b>${whole}${unitVon}</b>.`,
      fields: [{ answer: z * k, suffix: unit.trim() }],
      hint: `Erst durch den Nenner teilen (${TEIL[d]}), dann mit dem Zähler malnehmen.`,
      solution: `${whole} : ${d} = ${k}<br>${k} · ${z} = <b>${z * k}${unit}</b>`,
      ex: { mode: 'anteil', z, d, k, unit, unitVon },
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
      ex: { mode: 'kuerz', p, q, k },
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
        ? `Womit wurde der Nenner ${q} malgenommen, um ${q * k} zu erhalten?`
        : `Womit wurde der Zähler ${p} malgenommen, um ${p * k} zu erhalten?`,
      solution: `Mit ${k} erweitert: ${fr(p, q)} = ${fr(`${p} · ${k}`, `${q} · ${k}`)} = <b>${fr(p * k, q * k)}</b>`,
      answerText: fr(p * k, q * k),
      ex: { mode: 'erw', p, q, k },
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
    const toHundred = 100 % q === 0 ? `${fr(p, q)} = ${fr(p * (100 / q), 100)}` : `${fr(p, q)} = ${fr(p * (1000 / q), 1000)}`; // Achtel: auf Tausendstel erweitern
    const exFor = (ask) => ({ mode: 'hund', p, q, ask });
    // Typischer Fehler: Nenner durch Zähler (z. B. 25 : 2 = 12,5 statt 2 : 25)
    const inv = (want, wrongVal) => ([v]) => {
      if (Number.isNaN(v)) return { ok: false, note: 'Gib bitte nur eine Zahl ein (Komma ist erlaubt).' };
      if (near(v, want)) return { ok: true };
      if ([].concat(wrongVal).some((w) => near(v, w))) return { ok: false, note: `Du hast wohl ${q} : ${p} gerechnet. Es ist umgekehrt: <b>Zähler durch Nenner</b>, also ${p} : ${q}.` };
      return { ok: false };
    };
    if (v === 1)
      return {
        prompt: `Schreibe als Dezimalzahl: ${fr(p, q)}`,
        ex: exFor('dezimal'),
        fields: [{ answer: dec }],
        check: inv(dec, round6(q / p)),
        hint: 'Erweitere auf Zehntel, Hundertstel oder Tausendstel, oder rechne Zähler : Nenner.',
        solution: `${toHundred} = <b>${fmt(dec)}</b>`,
      };
    if (v === 2)
      return {
        prompt: `Schreibe in Prozent: ${fr(p, q)}`,
        ex: exFor('prozent'),
        fields: [{ answer: pct, suffix: '%' }],
        check: inv(pct, [round6(q / p), round6((100 * q) / p)]),
        hint: 100 % q === 0 ? 'Prozent heißt „von Hundert“. Erweitere den Bruch auf den Nenner 100.' : 'Prozent heißt „von Hundert“. Bei Achteln klappt der Nenner 100 nicht: Erweitere auf Tausendstel (mit 125) und schreibe erst als Dezimalzahl.',
        solution: 100 % q === 0 ? `${toHundred} = <b>${fmt(pct)} %</b>` : `${toHundred} = ${fmt(dec)} = <b>${fmt(pct)} %</b>`,
      };
    if (v === 3)
      return {
        prompt: `Schreibe als Dezimalzahl: <b>${fmt(pct)} %</b>`,
        ex: exFor('pd'),
        fields: [{ answer: dec }],
        hint: `${fmt(pct)} % bedeutet ${fmt(pct)} Hundertstel.`,
        solution: Number.isInteger(pct) ? `${fmt(pct)} % = ${fr(fmt(pct), 100)} = <b>${fmt(dec)}</b>` : `${fmt(pct)} % = ${fr(fmt(pct), 100)} = ${fr(Math.round(pct * 10), 1000)} = <b>${fmt(dec)}</b>`,
      };
    return {
      prompt: `Schreibe als <b>vollständig gekürzten</b> Bruch: <b>${fmt(dec)}</b>`,
      ex: exFor('bruch'),
      layout: 'frac',
      fields: [{ answer: p, label: 'Zähler' }, { answer: q, label: 'Nenner' }],
      check([a, b]) {
        if (!b || a * q !== b * p) return { ok: false };
        if (gcd(a, b) !== 1) return { ok: false, note: 'Der Bruch ist richtig, aber noch nicht <b>vollständig</b> gekürzt. Da geht noch was!' };
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
        ex: { mode: v === 1 ? 'add' : 'sub', a, b },
      };
    }
    if (v === 3) {
      let a; do a = R(105, 2500); while (a % 10 === 0); // immer zwei Nachkommastellen (z. B. 3,47)
      const k = R(2, 9);
      return {
        prompt: `Berechne: <b>${fmt(a / 100)} · ${k}</b>`,
        fields: [{ answer: (a * k) / 100 }],
        hint: 'Rechne erst ohne Komma, dann setze das Komma: so viele Nachkommastellen wie im Faktor.',
        solution: `${a} · ${k} = ${a * k}, zwei Nachkommastellen → <b>${fmt((a * k) / 100)}</b>`,
        ex: { mode: 'mul', a, k },
      };
    }
    const e = R(1, 3), p = 10 ** e, mult = Math.random() < 0.5;
    const a = R(1, 99999) / 10 ** R(0, 2);
    const res = round6(mult ? a * p : a / p);
    return {
      prompt: `Berechne: <b>${fmt(a)} ${mult ? '·' : ':'} ${fmt(p)}</b>`,
      fields: [{ answer: res }],
      hint: `Bei ${mult ? '· ' : ': '}${fmt(p)} rücken alle Ziffern um ${e} Stelle${e > 1 ? 'n' : ''} nach ${mult ? 'links' : 'rechts'}. Das Komma bleibt stehen.`,
      solution: `Alle Ziffern rücken um ${e} Stelle${e > 1 ? 'n' : ''} nach ${mult ? 'links' : 'rechts'}, das Komma bleibt: <b>${fmt(res)}</b>`,
      ex: { mode: 'zehn', a, k: mult ? e : -e },
    };
  }

  function vergleichen() {
    let A, B, aTxt, bTxt, frac = null;
    if (Math.random() < 0.5) {
      const [p, q] = pick(NICE);
      A = p / q; aTxt = fr(p, q); frac = [p, q];
      const delta = pick([0, -0.05, 0.05, -0.1, 0.1, -0.01, 0.01, 0.15]);
      B = round6(Math.max(0.01, A + delta)); bTxt = `<b>${fmt(B)}</b>`;
    } else {
      const base = R(1, 9) / 10 + R(0, 9) / 100;
      A = round6(base);
      B = round6(pick([base + 0.005, base - 0.005, base * 10 / 10 + 0.01, Math.floor(base * 10) / 10 + 0.09, base]));
      if (B === A && Math.random() < 0.6) B = round6(A - 0.04);
      aTxt = `<b>${fmt(A)}</b>`; bTxt = `<b>${fmt(B)}</b>`;
      // Gleich große Zahlen nie identisch zeigen, sondern mit angehängter Null: 0,56 und 0,560
      if (B === A) bTxt = `<b>${fmt(B)}0</b>`;
    }
    const plain = (t) => t.replace(/<[^>]+>/g, '');
    // für die Animation: die Zahlen so, wie sie in der Aufgabe stehen (sA, sB), ggf. der Bruch zuerst
    const ex = { mode: 'cmp', A: round6(A), B: round6(B), sA: frac ? fmt(round6(A)) : plain(aTxt), sB: plain(bTxt), frac, via: 'k5-dezimal' };
    const decs = (s) => (s.split(',')[1] || '').length, nd = Math.max(1, decs(ex.sA), decs(ex.sB));
    const pad = (x) => { const [i, d = ''] = fmt(round6(x)).split(','); return `${i},${d.padEnd(nd, '0')}`; };
    if (Math.random() < 0.5) [A, B, aTxt, bTxt] = [B, A, bTxt, aTxt];
    const correct = Math.abs(A - B) < 1e-9 ? 2 : A > B ? 0 : 1;
    return {
      prompt: `Welche Zahl ist größer?`,
      choices: [aTxt, bTxt, 'Beide gleich groß'],
      correct,
      ex,
      hint: 'Schreibe beide Zahlen als Dezimalzahl mit gleich vielen Nachkommastellen und vergleiche Stelle für Stelle.',
      solution: `${[[aTxt, A], [bTxt, B]].filter(([t, x]) => plain(t) !== pad(x)).map(([t, x]) => `${t} = ${pad(x)}`).join(' und ') || 'Beide haben schon gleich viele Nachkommastellen'}.<br>Stelle für Stelle von links: ${pad(A)} ${correct === 2 ? '=' : correct === 0 ? '&gt;' : '&lt;'} ${pad(B)}<br>→ ${correct === 2 ? '<b>Beide sind gleich groß.</b>' : `<b>${correct === 0 ? aTxt : bTxt}</b> ist größer.`}`,
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
      prompt: `${ctx[0]} ${n} ${ctx[1]}: <b>${vals.join(';  ')}</b><br>Berechne das arithmetische Mittel (den Mittelwert).`,
      fields: [{ answer: mean, suffix: ctx[4] }],
      hint: 'Alle Werte addieren und dann durch die Anzahl der Werte teilen.',
      solution: `Summe: ${vals.join(' + ')} = ${sum}<br>${sum} : ${n} = <b>${mean} ${ctx[4]}</b>`,
      ex: { mode: 'mittel', vals, unit: ctx[4], what: { Tagen: 'Tag', Kindern: 'Kind', Spielen: 'Spiel' }[ctx[1]] },
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
      ex: { mode: 'koord', x: px, y: py },
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
    const t = pick([0, 0, 0, 0, 1, 2, 2, 2, 2, 3, 4, 4, 4, 4]); // rechter und gestreckter Winkel seltener: da gibt es nur eine Zahl
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
      ex: { mode: 'wart', a },
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
      ex: { mode: 'wpaar', parallel, rel, gv, av },
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
        ex: { mode: 'rect', kind: 'u', a, b, unit },
      };
    if (v === 2)
      return {
        prompt: 'Berechne den <b>Flächeninhalt</b> des Rechtecks.',
        figure: fig,
        fields: [{ answer: a * b, prefix: 'A =', suffix: unit + '²' }],
        hint: 'Flächeninhalt = Länge mal Breite: A = a · b',
        solution: `A = ${a} ${unit} · ${b} ${unit} = <b>${a * b} ${unit}²</b>`,
        ex: { mode: 'rect', kind: 'a', a, b, unit },
      };
    return {
      prompt: `Ein Rechteck hat den Flächeninhalt <b>A = ${a * b} ${unit}²</b> und die Seite <b>a = ${a} ${unit}</b>. Wie lang ist die Seite b?`,
      fields: [{ answer: b, prefix: 'b =', suffix: unit }],
      hint: 'A = a · b. Welche Zahl mal a ergibt A? Teile A durch a.',
      solution: `b = A : a = ${a * b} : ${a} = <b>${b} ${unit}</b>`,
      ex: { mode: 'rect', kind: 'b', a, b, unit },
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
      solution: `Großes Rechteck: ${Wd} · ${Hd} = ${Wd * Hd} cm²<br>Fehlendes Stück: breit ${Wd} − ${Wd - w} = ${w} cm, hoch ${Hd} − ${Hd - h} = ${h} cm, also ${w} · ${h} = ${w * h} cm²<br>A = ${Wd * Hd} − ${w * h} = <b>${A} cm²</b>`,
      ex: { mode: 'rect', kind: 'l', Wd, Hd, w, h },
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
        ex: { mode: 'quader', kind: 'v', a, b, c },
      };
    if (v === 2)
      return {
        prompt: 'Berechne den <b>Oberflächeninhalt</b> des Quaders.',
        figure: fig,
        fields: [{ answer: O, prefix: 'A<sub>O</sub> =', suffix: 'cm²' }],
        hint: 'Ein Quader hat 6 Flächen, je 2 gleich große: A<sub>O</sub> = 2 · (a·b + a·c + b·c)',
        solution: `A<sub>O</sub> = 2 · (${a}·${b} + ${a}·${c} + ${b}·${c}) = 2 · (${a * b} + ${a * c} + ${b * c}) = 2 · ${a * b + a * c + b * c} = <b>${O} cm²</b>`,
        ex: { mode: 'quader', kind: 'o', a, b, c },
      };
    const A = R(2, 8) * 10, B2 = R(2, 6) * 10, C2 = R(2, 5) * 10;
    const l = (A * B2 * C2) / 1000;
    return {
      prompt: `Ein Aquarium ist <b>${A} cm</b> lang, <b>${B2} cm</b> breit und <b>${C2} cm</b> hoch. Wie viele <b>Liter</b> passen hinein?`,
      fields: [{ answer: l, suffix: 'l' }],
      hint: 'Rechne in Dezimeter um (10 cm = 1 dm). 1 dm³ = 1 Liter.',
      solution: `${A} cm = ${A / 10} dm, ${B2} cm = ${B2 / 10} dm, ${C2} cm = ${C2 / 10} dm<br>V = ${A / 10} · ${B2 / 10} · ${C2 / 10} = ${fmt(l)} dm³ = <b>${fmt(l)} l</b>`,
      ex: { mode: 'quader', kind: 'l', a: A, b: B2, c: C2 },
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
      ex: { mode: 'einh', lad, i, toSmall, from: fromV, to: toV },
    };
  }

  const hm = (t) => `${String(Math.floor(t / 60) % 24).padStart(2, '0')}:${String(t % 60).padStart(2, '0')}`;
  function fahrplan() {
    const start = R(6 * 60, 20 * 60 + 30), dur = R(12, 95);
    const end = start + dur;
    const what = pick(['Der Bus', 'Die S-Bahn', 'Die Straßenbahn', 'Der Zug']);
    const dest = pick(['Neustadt', 'Pirna', 'Meißen', 'Radebeul', 'Freital', 'Bad Schandau']);
    if (Math.random() < 0.5)
      return {
        prompt: `${what} fährt um <b>${hm(start)} Uhr</b> ab und braucht <b>${dur} Minuten</b> bis ${dest}. Wann kommt ${what.split(' ')[0] === 'Der' ? 'er' : 'sie'} an?`,
        layout: 'time',
        fields: [{ answer: Math.floor(end / 60) % 24, label: 'Std.' }, { answer: end % 60, label: 'Min.' }],
        hint: 'Rechne zuerst bis zur nächsten vollen Stunde, dann den Rest dazu.',
        solution: (() => {
          const full = Math.floor(start / 60) * 60 + 60, toFull = full - start;
          if (dur < toFull) return `${hm(start)} + ${dur} min: Die volle Stunde wird nicht erreicht.<br>${start % 60} + ${dur} = ${end % 60} → Ankunft <b>${hm(end)} Uhr</b>`;
          if (dur === toFull) return `${hm(start)} + ${dur} min: genau bis zur vollen Stunde.<br>→ Ankunft <b>${hm(end)} Uhr</b>`;
          return `${hm(start)} + ${dur} min:<br>bis ${hm(full)} sind es ${toFull} min, dann noch ${dur - toFull} min.<br>→ Ankunft <b>${hm(end)} Uhr</b>`;
        })(),
        check([h, m]) {
          return { ok: h * 60 + m === end % 1440 || (h === 24 && m === end % 60 && end % 1440 < 60) };
        },
        answerText: `${hm(end)} Uhr`,
        ex: { mode: 'fahr', start, dur, ask: 'an' },
      };
    return {
      prompt: `${what} nach ${dest} fährt um <b>${hm(start)} Uhr</b> ab und kommt um <b>${hm(end)} Uhr</b> an. Wie lange dauert die Fahrt?`,
      fields: [{ answer: dur, suffix: 'min' }],
      hint: 'Zähle von der Abfahrt bis zur nächsten vollen Stunde, dann weiter bis zur Ankunft.',
      solution: (() => {
        const full = Math.floor(start / 60) * 60 + 60, toFull = full - start;
        if (end <= full) return `Von ${hm(start)} bis ${hm(end)}: ${end % 60 || 60} − ${start % 60} = <b>${dur} min</b>`;
        const hours = Math.floor((end - full) / 60), rest = end - full - hours * 60;
        return `Von ${hm(start)} bis ${hm(full)}: ${toFull} min${hours ? `<br>von ${hm(full)} bis ${hm(full + hours * 60)}: ${hours * 60} min` : ''}<br>von ${hm(full + hours * 60)} bis ${hm(end)}: ${rest} min<br>zusammen: ${toFull}${hours ? ` + ${hours * 60}` : ''} + ${rest} = <b>${dur} min</b>`;
      })(),
      ex: { mode: 'fahr', start, dur, ask: 'dauer' },
    };
  }

  function sachaufgaben() {
    const v = R(1, 3);
    if (v === 1) {
      // [Einzahl, Mehrzahl, Artikel, Preis von … bis in Cent] – Preise ungefähr wie im Laden
      const item = pick([
        ['Heft', 'Hefte', 'Ein', 50, 250], ['Brezel', 'Brezeln', 'Eine', 60, 150], ['Kugel Eis', 'Kugeln Eis', 'Eine', 120, 200],
        ['Sammelkarte', 'Sammelkarten', 'Eine', 40, 150], ['Apfel', 'Äpfel', 'Ein', 30, 90], ['Kinokarte', 'Kinokarten', 'Eine', 550, 950],
      ]);
      const price = R(item[3] / 5, item[4] / 5) * 5, n = R(2, 9);
      return {
        prompt: `${item[2]} ${item[0]} kostet <b>${euro(price)}</b>. Wie viel kosten <b>${n} ${item[1]}</b>?`,
        fields: [{ answer: (price * n) / 100, suffix: '€' }],
        hint: 'Rechne in Cent, wenn dir das leichter fällt: Preis in Cent mal Anzahl.',
        solution: `${price} ct · ${n} = ${price * n} ct = <b>${euro(price * n)}</b>`,
        answerText: euro(price * n),
        ex: { mode: 'mul', a: price, k: n, via: 'k5-dezimal' },
      };
    }
    if (v === 2) {
      const n = R(12, 28), per = R(8, 45);
      return {
        prompt: `Eine Klasse mit <b>${n} Kindern</b> fährt ins Schullandheim. Die Fahrt kostet zusammen <b>${fmt(n * per)} €</b>. Wie viel zahlt jedes Kind?`,
        fields: [{ answer: per, suffix: '€' }],
        hint: 'Gesamtkosten durch die Anzahl der Kinder teilen.',
        solution: `${fmt(n * per)} € : ${n} = <b>${per} €</b>`,
        ex: { mode: 'div', n: n * per, d: n, via: 'k5-division' },
      };
    }
    const pay = pick([5, 10, 20, 50]);
    const cost = R(Math.round(pay * 20 * 0.3), pay * 20 - 1) * 5;
    return {
      prompt: `Du kaufst für <b>${euro(cost)}</b> ein und bezahlst mit einem <b>${pay}-€-Schein</b>. Wie viel Wechselgeld bekommst du?`,
      fields: [{ answer: (pay * 100 - cost) / 100, suffix: '€' }],
      hint: 'Ergänze vom Preis bis zum bezahlten Betrag, oder rechne Schein − Preis.',
      solution: (() => {
        const st = U.wechselSchritte(cost, pay * 100);
        const erg = st.length > 1 ? `Ergänzen: ${st.map((s) => `${euro(s[0])} + <b>${euro(s[1] - s[0])}</b> = ${euro(s[1])}`).join('<br>')}<br>Zusammen: ${st.map((s) => euro(s[1] - s[0])).join(' + ')} = <b>${euro(pay * 100 - cost)}</b><br>` : '';
        return `${erg}${st.length > 1 ? 'Oder: ' : ''}${euro(pay * 100)} − ${euro(cost)} = <b>${euro(pay * 100 - cost)}</b>`;
      })(),
      answerText: euro(pay * 100 - cost),
      ex: { mode: 'wechsel', pay: pay * 100, cost, via: 'k5-dezimal' },
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
          { id: 'k5-vorrang', title: 'Vorrangregeln', icon: '( )', gen: vorrang },
          { id: 'k5-gesetze', title: 'Rechengesetze', icon: '⇄', gen: gesetze },
          { id: 'k5-vorteil', title: 'Geschickt rechnen', icon: '⚡', gen: vorteilhaft },
          { id: 'k5-potenz', title: 'Potenzen', icon: 'x²', gen: potenzen },
          { id: 'k5-division', title: 'Schriftlich dividieren', icon: '÷', gen: division },
          { id: 'k5-teilbar', title: 'Teiler & Vielfache', icon: '∣', gen: teilbarkeit },
          { id: 'k5-prim', title: 'Primzahlen & Primfaktoren', icon: 'P', gen: primzahlen },
          { id: 'k5-gleichung', title: 'Einfache Gleichungen', icon: 'x', gen: gleichungen },
          { id: 'k5-text', title: 'Textaufgaben', icon: '?', gen: textaufgaben },
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
