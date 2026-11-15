/* MaDax (Mathe) – Klasse 5: Themen aus dem Abgleich mit dem Schulbuch (Lambacher Schweizer 5 Sachsen, Fotos vom 15.11.2026)
 *
 * Fünf Lerneinheiten des Buchs, die in MaDax noch kein eigenes Thema hatten:
 *   Kap. I, 3:  Fachbegriffe (Summand … Quotient, Aufgaben in Worten, Zahlenmauern)    Buch S. 15–18
 *   Kap. II, 3: Brüche vergleichen (gleicher Nenner, gleicher Zähler, gemeinsamer Nenner) Buch S. 68–71
 *   Kap. II, 4: Prozente (Bruch ↔ Prozent, Anteile in Prozent)                         Buch S. 72–75
 *   Kap. V, 2:  Flächeneinheiten (km², ha, a, m², dm², cm², mm²; Umrechnungszahl 100)      Buch S. 174–177
 *   Kap. V, 8:  Volumeneinheiten (m³, dm³ = l, cm³ = ml, mm³; Umrechnungszahl 1000)        Buch S. 197–200
 * Begriffe und Rechenwege wie im Buch, alles in eigenen Worten, keine Aufgaben aus dem Buch.
 * Wird NACH klasse5-luecken.js und VOR klasse5-buch.js geladen; klasse5-buch.js ordnet die Themen in die Kapitel ein.
 */
(function () {
  const M = window.Mathelix;
  const U = M.util;
  const { R, pick, shuffle, gcd, fmt, fr, round6 } = U;
  const kgv = (a, b) => (a * b) / gcd(a, b);
  const wahl = (prompt, opts, richtig, rest) => { const o = shuffle(opts); return Object.assign({ prompt, choices: o, correct: o.indexOf(richtig) }, rest); };
  const ZEICHEN = ['<', '=', '>'];
  const zeichen = (l, r) => (l < r ? '<' : l > r ? '>' : '=');
  const zh = (z) => (z === '<' ? '&lt;' : z === '>' ? '&gt;' : '='); // Zeichen sicher im HTML

  // =====================================================
  // Fachbegriffe (Kap. I, 3 „Grundrechenarten, Gleichungen“)
  // =====================================================
  const OPS = {
    '+': { art: 'Addition', teile: ['Summand', 'Summand', 'Summe'], wort: 'die Summe', strich: true },
    '−': { art: 'Subtraktion', teile: ['Minuend', 'Subtrahend', 'Differenz'], wort: 'die Differenz', strich: true },
    '·': { art: 'Multiplikation', teile: ['Faktor', 'Faktor', 'Produkt'], wort: 'das Produkt', strich: false },
    ':': { art: 'Division', teile: ['Dividend', 'Divisor', 'Quotient'], wort: 'den Quotienten', strich: false },
  };
  M.FACHBEGRIFFE = OPS;
  const ALLE_NAMEN = ['Summand', 'Summe', 'Minuend', 'Subtrahend', 'Differenz', 'Faktor', 'Produkt', 'Dividend', 'Divisor', 'Quotient'];
  function rechnung(op) {
    for (;;) {
      let z;
      if (op === '+') { const a = R(12, 95), b = R(12, 95); z = [a, b, a + b]; }
      else if (op === '−') { const a = R(40, 160), b = R(11, a - 6); z = [a, b, a - b]; }
      else if (op === '·') { const a = R(3, 12), b = R(3, 12); z = [a, b, a * b]; }
      else { const b = R(3, 12), c = R(3, 15); z = [b * c, b, c]; }
      if (new Set(z).size === 3) return z;
    }
  }
  const gl = (op, z) => `${fmt(z[0])} ${op} ${fmt(z[1])} = ${fmt(z[2])}`;
  // Zahlenmauer: unten drei Steine, darüber zwei, oben einer
  function mauer(art, unten) {
    const f = art === '+' ? (a, b) => a + b : (a, b) => a * b;
    const mitte = [f(unten[0], unten[1]), f(unten[1], unten[2])];
    return [unten, mitte, [f(mitte[0], mitte[1])]];
  }
  M.zahlenmauer = mauer;
  function mauerBild(reihen, fehlt) {
    const w = 84, h = 38;
    const x0 = (r, i) => 24 + r * (w / 2) + i * w, y0 = (r) => 112 - r * h;
    let g = '';
    reihen.forEach((reihe, r) => reihe.forEach((v, i) => {
      const leer = fehlt[0] === r && fehlt[1] === i;
      g += `<rect class="netz${leer ? ' on' : ''}" x="${x0(r, i)}" y="${y0(r)}" width="${w}" height="${h}"/><text class="netzt" x="${x0(r, i) + w / 2}" y="${y0(r) + 25}" text-anchor="middle">${leer ? '?' : fmt(v)}</text>`;
    }));
    return `<svg viewBox="0 0 300 160">${g}</svg>`;
  }
  function fachbegriffe() {
    const v = R(1, 10);
    const op = pick(['+', '−', '·', ':']), O = OPS[op];
    if (v <= 3) {
      const z = rechnung(op), k = R(0, 2), name = O.teile[k];
      const andere = shuffle(ALLE_NAMEN.filter((n) => !O.teile.includes(n)));
      const opts = [...new Set(O.teile)].concat(andere).slice(0, 4);
      return wahl(`In der Rechnung <b>${gl(op, z)}</b>: Wie heißt die Zahl <b>${fmt(z[k])}</b>?`, opts, name, {
        hint: `Das ist eine ${O.art}. Ihre Teile heißen ${O.teile[0]} ${op} ${O.teile[1]} = ${O.teile[2]}.`,
        solution: `${O.art}: ${O.teile[0]} ${op} ${O.teile[1]} = ${O.teile[2]}<br>${fmt(z[0])} ${op} ${fmt(z[1])} = ${fmt(z[2])}<br>→ Die ${fmt(z[k])} ist ${k === 2 ? (op === '−' || op === '+' ? 'die' : op === '·' ? 'das' : 'der') : op === '−' || op === ':' ? 'der' : 'ein'} <b>${name}</b>.`,
        ex: { mode: 'fb', op, z, k },
      });
    }
    if (v <= 5) {
      const z = rechnung(op);
      return {
        prompt: `Bilde ${O.wort} aus <b>${fmt(z[0])}</b> und <b>${fmt(z[1])}</b>.`,
        fields: [{ answer: z[2] }],
        hint: `${O.wort[0].toUpperCase() + O.wort.slice(1)} ist das Ergebnis einer ${O.art}. Die erste Zahl kommt zuerst: ${fmt(z[0])} ${op} ${fmt(z[1])}.`,
        solution: `${O.teile[2]} → ${O.art}<br>${fmt(z[0])} ${op} ${fmt(z[1])} = <b>${fmt(z[2])}</b>`,
        ex: { mode: 'fb', op, z, k: 2, worte: true },
      };
    }
    if (v <= 7) {
      const z = rechnung(op);
      // gesucht: k (0 oder 1), gegeben: die anderen beiden
      const k = op === '+' || op === '·' ? 1 : R(0, 1);
      const geg = [0, 1, 2].filter((i) => i !== k);
      const nenn = (i) => (op === '+' || op === '·') && i < 2 ? (i === 0 ? `ein ${O.teile[i]}` : `der andere ${O.teile[i]}`) : `${i === 2 ? (op === '·' ? 'das' : op === ':' ? 'der' : 'die') : op === '−' || op === ':' ? 'der' : 'ein'} ${O.teile[i]}`;
      const umkehr = op === '+' ? `${fmt(z[2])} − ${fmt(z[0])}` : op === '·' ? `${fmt(z[2])} : ${fmt(z[0])}` : op === '−' ? (k === 0 ? `${fmt(z[1])} + ${fmt(z[2])}` : `${fmt(z[0])} − ${fmt(z[2])}`) : (k === 0 ? `${fmt(z[1])} · ${fmt(z[2])}` : `${fmt(z[0])} : ${fmt(z[2])}`);
      const cap = (s) => s[0].toUpperCase() + s.slice(1);
      return {
        prompt: `${cap(nenn(geg[1]))} ist <b>${fmt(z[geg[1]])}</b>, ${nenn(geg[0])} ist <b>${fmt(z[geg[0]])}</b>. Wie groß ist ${nenn(k)}?`,
        fields: [{ answer: z[k] }],
        hint: `Schreibe die ${O.art} mit einer Lücke auf: ${k === 0 ? '▢' : fmt(z[0])} ${op} ${k === 1 ? '▢' : fmt(z[1])} = ${fmt(z[2])}. Dann hilft die Umkehraufgabe.`,
        solution: `${k === 0 ? '▢' : fmt(z[0])} ${op} ${k === 1 ? '▢' : fmt(z[1])} = ${fmt(z[2])}<br>Umkehraufgabe: ${umkehr} = <b>${fmt(z[k])}</b>`,
        ex: { mode: 'fb', op, z, k, rueck: true },
      };
    }
    if (v <= 9) {
      const art = R(0, 2) ? '+' : '·';
      const unten = art === '+' ? [R(4, 45), R(4, 45), R(4, 45)] : [R(1, 5), R(2, 5), R(1, 5)];
      const reihen = mauer(art, unten);
      const fehlt = v === 8 ? [2, 0] : pick([[1, 0], [1, 1], [0, 0], [0, 2]]);
      const ans = reihen[fehlt[0]][fehlt[1]];
      const name = art === '+' ? 'Additionsmauer' : 'Multiplikationsmauer';
      let weg;
      if (fehlt[0] >= 1) {
        const [a, b] = fehlt[0] === 2 ? reihen[1] : [unten[fehlt[1]], unten[fehlt[1] + 1]];
        weg = `Der Stein ist ${art === '+' ? 'die Summe' : 'das Produkt'} der beiden Steine darunter: ${fmt(a)} ${art} ${fmt(b)} = <b>${fmt(ans)}</b>`;
      } else {
        const ob = reihen[1][fehlt[1] === 0 ? 0 : 1], nb = unten[1];
        weg = `Darüber steht ${fmt(ob)} = ▢ ${art} ${fmt(nb)}.<br>Umkehraufgabe: ${fmt(ob)} ${art === '+' ? '−' : ':'} ${fmt(nb)} = <b>${fmt(ans)}</b>`;
      }
      return {
        prompt: `Welche Zahl gehört in den leeren Stein dieser <b>${name}</b>?`,
        figure: mauerBild(reihen, fehlt),
        fields: [{ answer: ans }],
        hint: art === '+' ? 'In einer Additionsmauer ist jeder Stein die Summe der beiden Steine darunter.' : 'In einer Multiplikationsmauer ist jeder Stein das Produkt der beiden Steine darunter.',
        solution: weg,
        ex: { mode: 'mauer', art, unten, fehlt },
      };
    }
    const name = pick(O.teile);
    return wahl(`Zu welcher Rechenart gehört der Fachbegriff <b>${name}</b>?`, ['Addition', 'Subtraktion', 'Multiplikation', 'Division'], O.art, {
      hint: 'Denke an die Rechnungen: Summand + Summand = Summe, Minuend − Subtrahend = Differenz, Faktor · Faktor = Produkt, Dividend : Divisor = Quotient.',
      solution: `${O.teile[0]} ${op} ${O.teile[1]} = ${O.teile[2]}<br>→ <b>${O.art}</b> (${O.strich ? 'eine Strichrechnung' : 'eine Punktrechnung'})`,
      ex: { mode: 'fb', op, z: rechnung(op), k: O.teile.indexOf(name) },
    });
  }

  // =====================================================
  // Brüche vergleichen (Kap. II, 3)
  // =====================================================
  const kurz = ([n, d]) => { const k = gcd(n, d); return [n / k, d / k]; };
  function vergleichsPaar(art) {
    for (;;) {
      if (art === 'nenner') { const d = R(5, 12); const x = R(1, d - 1), y = R(1, d - 1); if (x !== y) return [[x, d], [y, d]]; }
      else if (art === 'zaehler') { const z = R(1, 5); const x = R(z + 1, 12), y = R(z + 1, 12); if (x !== y) return [[z, x], [z, y]]; }
      else {
        const d1 = pick([2, 3, 4, 5, 6, 8, 9, 10, 12]), d2 = pick([3, 4, 5, 6, 8, 10, 12]);
        const a = [R(1, d1 - 1), d1], b = [R(1, d2 - 1), d2];
        if (d1 === d2 || a[0] === b[0] || kgv(d1, d2) > 36) continue;
        if (art === 'gleich') { if (a[0] * d2 === b[0] * d1) return [a, b]; continue; }
        if (a[0] * d2 !== b[0] * d1) return [a, b];
      }
    }
  }
  function begruendung(a, b) {
    const h = kgv(a[1], b[1]);
    if (a[1] === b[1]) return `Gleicher Nenner: Die Teile sind gleich groß. Es entscheidet der Zähler: ${a[0]} ${zh(zeichen(a[0], b[0]))} ${b[0]}.`;
    if (a[0] === b[0]) return `Gleicher Zähler: gleich viele Teile. Bei ${fr(1, a[1])} und ${fr(1, b[1])} ist das Teil mit dem <b>kleineren Nenner größer</b>.`;
    const va = [], vb = [];
    for (let k = 1; va.length < 6 && k * a[1] <= h; k++) va.push(k * a[1]);
    for (let k = 1; vb.length < 6 && k * b[1] <= h; k++) vb.push(k * b[1]);
    return `Gemeinsamer Nenner: Vielfache von ${a[1]}: ${va.join(', ')} · Vielfache von ${b[1]}: ${vb.join(', ')} → kleinstes gemeinsames Vielfaches <b>${h}</b>.<br>Erweitern: ${fr(a[0], a[1])} = ${fr(a[0] * h / a[1], h)} und ${fr(b[0], b[1])} = ${fr(b[0] * h / b[1], h)}. Jetzt entscheidet der Zähler.`;
  }
  function bruchvergleich() {
    const v = R(1, 10);
    if (v <= 7) {
      const art = v <= 2 ? 'nenner' : v <= 4 ? 'zaehler' : v === 7 && R(0, 2) === 0 ? 'gleich' : 'hn';
      const [a, b] = vergleichsPaar(art);
      const z = zeichen(a[0] * b[1], b[0] * a[1]);
      return {
        prompt: `Welches Zeichen gehört in die Lücke?<br>${fr(a[0], a[1])} &nbsp;▢&nbsp; ${fr(b[0], b[1])}`,
        choices: ZEICHEN, correct: ZEICHEN.indexOf(z),
        hint: art === 'nenner' ? 'Die Nenner sind gleich. Dann entscheidet der Zähler.' : art === 'zaehler' ? 'Die Zähler sind gleich. Was ist größer: ein Fünftel oder ein Achtel?' : 'Erweitere beide Brüche auf einen gemeinsamen Nenner (ein gemeinsames Vielfaches der beiden Nenner).',
        solution: `${begruendung(a, b)}<br>→ ${fr(a[0], a[1])} <b>${zh(z)}</b> ${fr(b[0], b[1])}`,
        ex: { mode: 'vgl', a, b },
      };
    }
    if (v === 8) {
      const [a, b] = vergleichsPaar('hn'), h = kgv(a[1], b[1]);
      return {
        prompt: `Welches ist der <b>kleinste gemeinsame Nenner</b> von ${fr(a[0], a[1])} und ${fr(b[0], b[1])}?`,
        fields: [{ answer: h }],
        hint: `Schreibe die Vielfachen von ${a[1]} und von ${b[1]} auf. Die kleinste Zahl, die in beiden Reihen vorkommt, ist der gesuchte Nenner.`,
        solution: `${begruendung(a, b)}<br>→ <b>${h}</b>`,
        ex: { mode: 'vgl', a, b },
      };
    }
    if (v === 9) {
      let drei;
      do drei = [vergleichsPaar('hn')[0], vergleichsPaar('hn')[1], vergleichsPaar('nenner')[0]].map(kurz);
      while (new Set(drei.map(([n, d]) => n / d)).size < 3 || drei.some(([, d]) => d > 12) || kgv(kgv(drei[0][1], drei[1][1]), drei[2][1]) > 60);
      const art = pick(['größte', 'kleinste']);
      const sort = drei.slice().sort((p, q) => p[0] / p[1] - q[0] / q[1]);
      const ziel = art === 'größte' ? sort[2] : sort[0], nachbar = art === 'größte' ? sort[1] : sort[1];
      const h = kgv(kgv(drei[0][1], drei[1][1]), drei[2][1]);
      const opts = drei.map((p) => fr(p[0], p[1]));
      return wahl(`Welcher Bruch ist der <b>${art}</b>?`, opts, fr(ziel[0], ziel[1]), {
        hint: 'Bringe alle drei Brüche auf einen gemeinsamen Nenner. Dann vergleichst du nur noch die Zähler.',
        solution: `Gemeinsamer Nenner ${h}: ${drei.map((p) => `${fr(p[0], p[1])} = ${fr(p[0] * h / p[1], h)}`).join(', ')}<br>→ Der ${art} Bruch ist <b>${fr(ziel[0], ziel[1])}</b>.`,
        ex: { mode: 'vgl', a: ziel, b: nachbar },
      });
    }
    // Anteile vergleichen (Sachaufgabe)
    for (;;) {
      const [g1, n1] = [R(2, 6), pick([8, 10, 12, 15, 16, 20])], [g2, n2] = [R(2, 6), pick([8, 10, 12, 15, 16, 20])];
      if (g1 * n2 === g2 * n1 || n1 === n2) continue;
      const a = kurz([g1, n1]), b = kurz([g2, n2]);
      if (kgv(a[1], b[1]) > 60) continue;
      const [beh, was, wie, gen] = pick([['Lostrommel', 'Losen', 'Gewinnlose', 'der Gewinnlose'], ['Tüte', 'Bonbons', 'rot', 'der roten Bonbons'], ['Kiste', 'Äpfeln', 'faul', 'der faulen Äpfel']]);
      const richtig = g1 * n2 > g2 * n1 ? 'in der linken' : 'in der rechten';
      return wahl(`In der linken ${beh} sind <b>${g1} von ${n1}</b> ${was} ${wie}, in der rechten <b>${g2} von ${n2}</b>. In welcher ${beh} ist der <b>Anteil</b> ${gen} größer?`, ['in der linken', 'in der rechten', 'in beiden gleich'], richtig, {
        hint: 'Schreibe beide Anteile als Bruch und kürze. Dann vergleichst du die Brüche.',
        solution: `Links: ${fr(g1, n1)}${a[1] !== n1 ? ` = ${fr(a[0], a[1])}` : ''}, rechts: ${fr(g2, n2)}${b[1] !== n2 ? ` = ${fr(b[0], b[1])}` : ''}<br>${begruendung(a, b)}<br>→ Der Anteil ist <b>${richtig}</b> ${beh} größer.`,
        ex: { mode: 'vgl', a, b },
      });
    }
  }

  // =====================================================
  // Prozente (Kap. II, 4): Bruch ↔ Prozent, ohne Dezimalzahlen (die kommen erst in Kapitel III)
  // =====================================================
  function hundertBruch() {
    for (;;) {
      const q = pick([2, 4, 5, 10, 20, 25, 50, 4, 5, 20, 25]), p = R(1, q - 1);
      if (gcd(p, q) === 1) return [p, q];
    }
  }
  const proz = (p, q) => (100 * p) / q;
  const exP = (p, q) => ({ mode: 'proz', p, q });
  function aufHundert(p, q) { return q === 100 ? `${fr(p, q)}` : `${fr(p, q)} = ${fr(`${p} · ${100 / q}`, `${q} · ${100 / q}`)} = ${fr(proz(p, q), 100)}`; }
  const GITTER = { 10: [2, 5], 20: [4, 5], 25: [5, 5], 50: [5, 10], 100: [10, 10] };
  function gitterBild(n, m) {
    const [rows, cols] = GITTER[n], s = Math.min(20, 240 / cols, 150 / rows), x0 = 150 - (cols * s) / 2, y0 = 8;
    let g = '';
    for (let i = 0; i < n; i++) g += `<rect x="${x0 + (i % cols) * s}" y="${y0 + Math.floor(i / cols) * s}" width="${s}" height="${s}" class="${i < m ? 'cellOn' : 'cellOff'}" stroke="#1d1b3a" stroke-width="1.5"/>`;
    return `<svg viewBox="0 0 300 ${rows * s + 16}">${g}</svg>`;
  }
  function prozent() {
    const v = R(1, 9);
    if (v <= 2) {
      const [p, q] = hundertBruch(), k = pick([1, 1, 2, 3, 4]);
      const P = p * k, Q = q * k;
      const gekuerzt = Q !== q && 100 % Q !== 0;
      return {
        prompt: `Schreibe in Prozent: ${fr(P, Q)}`,
        fields: [{ answer: proz(p, q), suffix: '%' }],
        hint: gekuerzt ? `Der Nenner ${Q} passt nicht zu 100. Kürze zuerst, dann erweitere auf den Nenner 100.` : 'Prozent heißt „von Hundert“. Bringe den Bruch auf den Nenner 100.',
        solution: `${gekuerzt ? `Erst kürzen: ${fr(P, Q)} = ${fr(p, q)}<br>` : ''}${Q === 100 ? fr(P, Q) : Q !== q && !gekuerzt ? `${fr(P, Q)} = ${fr(proz(p, q), 100)}` : aufHundert(p, q)} = <b>${fmt(proz(p, q))} %</b>`,
        ex: exP(p, q),
      };
    }
    if (v <= 4) {
      const [p, q] = hundertBruch(), pc = proz(p, q);
      return {
        prompt: `Schreibe als <b>vollständig gekürzten</b> Bruch: <b>${fmt(pc)} %</b>`,
        layout: 'frac',
        fields: [{ answer: p, label: 'Zähler' }, { answer: q, label: 'Nenner' }],
        check([a, b]) {
          if (!b || a * q !== b * p) return { ok: false };
          if (gcd(a, b) !== 1) return { ok: false, note: 'Der Bruch stimmt, ist aber noch nicht <b>vollständig</b> gekürzt.' };
          return { ok: true };
        },
        hint: `${fmt(pc)} % bedeutet ${fmt(pc)} Hundertstel. Schreibe ${fr(fmt(pc), 100)} und kürze so weit wie möglich.`,
        solution: `${fmt(pc)} % = ${fr(fmt(pc), 100)} = <b>${fr(p, q)}</b><br><small>gekürzt mit ${100 / q}</small>`,
        answerText: fr(p, q),
        ex: exP(p, q),
      };
    }
    if (v === 5) {
      const n = pick([10, 20, 25, 50, 100]); let m;
      do m = R(1, n - 1); while (n === 100 && m % 5 && R(0, 1));
      const k = gcd(m, n), [p, q] = [m / k, n / k];
      return {
        prompt: 'Wie viel <b>Prozent</b> der Fläche sind gefärbt?',
        figure: gitterBild(n, m),
        fields: [{ answer: proz(m, n), suffix: '%' }],
        hint: `Zähle die gefärbten Kästchen und alle Kästchen. Schreibe den Anteil als Bruch und erweitere auf den Nenner 100.`,
        solution: `${m} von ${n} Kästchen: ${fr(m, n)}${n !== 100 ? ` = ${fr(proz(m, n), 100)}` : ''} = <b>${fmt(proz(m, n))} %</b>`,
        ex: exP(p, q),
      };
    }
    if (v <= 7) {
      if (R(0, 1)) {
        const [wort, q] = pick([['jedes zweite', 2], ['jedes vierte', 4], ['jedes fünfte', 5], ['jedes zehnte', 10], ['jedes zwanzigste', 20], ['jedes fünfundzwanzigste', 25]]);
        const ding = pick(['Kind isst gern Spinat', 'Los gewinnt', 'Kind fährt mit dem Rad zur Schule', 'Haus hat einen Garten']);
        return {
          prompt: `<b>${wort[0].toUpperCase() + wort.slice(1)}</b> ${ding}. Wie viel <b>Prozent</b> sind das?`,
          fields: [{ answer: 100 / q, suffix: '%' }],
          hint: `„${wort}“ heißt: 1 von ${q}. Schreibe das als Bruch und erweitere auf den Nenner 100.`,
          solution: `1 von ${q}: ${aufHundert(1, q)} = <b>${fmt(100 / q)} %</b>`,
          ex: exP(1, q),
        };
      }
      const n = pick([20, 25, 50, 10, 4, 5]), m = R(2, n - 1), k = gcd(m, n);
      const [dat, verb, rest] = pick([['Kindern', 'haben', 'ein Haustier'], ['Befragten', 'mögen', 'Mathe am liebsten'], ['Bäumen', 'sind', 'Buchen'], ['Fahrrädern', 'sind', 'rot']]);
      return {
        prompt: `Von <b>${n} ${dat}</b> ${verb} <b>${m}</b> ${rest}. Wie viel <b>Prozent</b> sind das?`,
        fields: [{ answer: proz(m, n), suffix: '%' }],
        hint: `Schreibe den Anteil als Bruch: ${m} von ${n} ist ${fr(m, n)}. Erweitere dann auf den Nenner 100.`,
        solution: `${fr(m, n)} = ${fr(proz(m, n), 100)} = <b>${fmt(proz(m, n))} %</b>`,
        ex: exP(m / k, n / k),
      };
    }
    // Vergleich zweier Anteile über Prozent
    for (;;) {
      const n1 = pick([20, 25, 50, 10]), n2 = pick([20, 25, 50, 10]), m1 = R(1, n1 - 1), m2 = R(1, n2 - 1);
      if (n1 === n2 || m1 * n2 === m2 * n1) continue;
      const p1 = proz(m1, n1), p2 = proz(m2, n2), richtig = p1 > p2 ? 'in der 5a' : 'in der 5b';
      const gr = p1 > p2 ? [m1, n1] : [m2, n2], k = gcd(gr[0], gr[1]);
      return wahl(`In der 5a lesen <b>${m1} von ${n1}</b> Kindern gern Comics, in der 5b <b>${m2} von ${n2}</b>. In welcher Klasse ist der <b>Anteil</b> größer?`, ['in der 5a', 'in der 5b', 'in beiden gleich'], richtig, {
        hint: 'Rechne beide Anteile in Prozent um. Dann kannst du sie direkt vergleichen.',
        solution: `5a: ${fr(m1, n1)} = ${fr(p1, 100)} = ${fmt(p1)} %<br>5b: ${fr(m2, n2)} = ${fr(p2, 100)} = ${fmt(p2)} %<br>→ Der Anteil ist <b>${richtig}</b> größer.`,
        ex: exP(gr[0] / k, gr[1] / k),
      });
    }
  }

  // =====================================================
  // Flächen- und Volumeneinheiten (Kap. V, 2 und 8)
  // Werte werden in der kleinsten Einheit (mm² bzw. mm³) als ganze Zahl gerechnet, damit nichts ungenau wird.
  // =====================================================
  const FL = [['km²', 1e12], ['ha', 1e10], ['a', 1e8], ['m²', 1e6], ['dm²', 1e4], ['cm²', 100], ['mm²', 1]];
  const VO = [['m³', 1e9], ['dm³', 1e6], ['cm³', 1e3], ['mm³', 1]];
  M.EINHEITEN_TAFEL = { f: FL, v: VO };
  // Anzeige-Name (Liter heißen im Buch l und ml)
  const nameV = (i, liter) => (liter && i === 1 ? 'l' : liter && i === 2 ? 'ml' : VO[i][0]);
  const sinnvollF = [['einer Briefmarke', 5], ['einem Kinderzimmer', 3], ['dem Land Sachsen', 0], ['einem Acker', 1], ['einem Fußballfeld', 2], ['einer Tischtennisplatte', 3], ['einem Stecknadelkopf', 6], ['einem Bundesland', 0], ['einem Wald', 1], ['einem Handy-Bildschirm', 5]];
  const sinnvollV = [['einem Teelöffel', '5 ml'], ['einer Milchtüte', '1 l'], ['einem Putzeimer', '10 l'], ['einer Badewanne', '150 l'], ['einem Müllcontainer', '1000 l'], ['einem Wassertropfen', '0,05 ml']];
  function einheitAufgabe(art) {
    const T = art === 'f' ? FL : VO, f = art === 'f' ? 100 : 1000, n = T.length;
    const nm = (i, liter) => (art === 'f' ? T[i][0] : nameV(i, liter));
    const v = R(1, 10);
    const tafel = (teile, nach, extra) => Object.assign({ mode: 'tafel', art, teile, nach }, extra || {});
    const gross = (wert, i) => round6(wert * T[i][1]); // in kleinster Einheit
    if (v <= 4) {
      // eine Stufe: in die nächstkleinere (v ≤ 2) oder nächstgrößere Einheit
      const runter = v <= 2, i = R(0, n - 2), liter = art === 'v' && i === 1 && R(0, 1);
      const B = R(0, 2) ? R(2, 99) : R(12, 99) / 10, S = round6(B * f);
      const [von, vi, nach, ni] = runter ? [B, i, S, i + 1] : [S, i + 1, B, i];
      return {
        prompt: `Gib in <b>${nm(ni, liter)}</b> an: <b>${fmt(von)} ${nm(vi, liter)}</b>`,
        fields: [{ answer: nach, suffix: nm(ni, liter) }],
        hint: `1 ${nm(i, liter)} = ${fmt(f)} ${nm(i + 1, liter)}. ${runter ? `In die nächstkleinere Einheit: Maßzahl mal ${fmt(f)}.` : `In die nächstgrößere Einheit: Maßzahl durch ${fmt(f)}.`}`,
        solution: `1 ${nm(i, liter)} = ${fmt(f)} ${nm(i + 1, liter)}<br>${fmt(von)} ${runter ? '·' : ':'} ${fmt(f)} = ${fmt(nach)}<br>→ <b>${fmt(von)} ${nm(vi, liter)} = ${fmt(nach)} ${nm(ni, liter)}</b>`,
        ex: tafel([[von, vi]], ni, { von: `${fmt(von)} ${nm(vi, liter)}`, nachName: nm(ni, liter), erg: nach }),
      };
    }
    if (v === 5) {
      if (art === 'v') {
        // Liter und Milliliter, Kubikmeter in Liter
        const [von, vi, vn, nach, ni, nn] = pick([
          (() => { const B = R(2, 12); return [B, 1, 'l', B * 1000, 2, 'ml']; })(),
          (() => { const B = R(11, 95) * 50; return [B, 2, 'ml', B / 1000, 1, 'l']; })(),
          (() => { const B = R(2, 9); return [B, 0, 'm³', B * 1000, 1, 'l']; })(),
          (() => { const B = R(12, 90) * 10; return [B, 2, 'cm³', B, 2, 'ml']; })(),
          (() => { const B = R(3, 40); return [B, 1, 'dm³', B, 1, 'l']; })(),
        ]);
        return {
          prompt: `Gib in <b>${nn}</b> an: <b>${fmt(von)} ${vn}</b>`,
          fields: [{ answer: nach, suffix: nn }],
          hint: 'Merke: 1 dm³ = 1 l und 1 cm³ = 1 ml. Zwischen benachbarten Einheiten ist die Umrechnungszahl 1000.',
          solution: `${vi === ni ? `1 ${vn} = 1 ${nn}` : `${vn === 'm³' ? '1 m³ = 1000 dm³ = 1000 l' : '1 l = 1000 ml'}`}<br>→ <b>${fmt(von)} ${vn} = ${fmt(nach)} ${nn}</b>`,
          ex: tafel([[von, vi]], ni, { von: `${fmt(von)} ${vn}`, nachName: nn, erg: nach }),
        };
      }
      // Fläche: zwei Stufen
      const i = R(0, n - 3), B = R(2, 9), runter = R(0, 1), S = B * f * f;
      const [von, vi, nach, ni] = runter ? [B, i, S, i + 2] : [S, i + 2, B, i];
      return {
        prompt: `Gib in <b>${nm(ni)}</b> an: <b>${fmt(von)} ${nm(vi)}</b>`,
        fields: [{ answer: nach, suffix: nm(ni) }],
        hint: `Das sind zwei Stufen: ${nm(i)} → ${nm(i + 1)} → ${nm(i + 2)}. Jede Stufe hat die Umrechnungszahl 100.`,
        solution: `${runter ? `${fmt(B)} ${nm(i)} = ${fmt(B * f)} ${nm(i + 1)} = <b>${fmt(S)} ${nm(i + 2)}</b>` : `${fmt(S)} ${nm(i + 2)} = ${fmt(B * f)} ${nm(i + 1)} = <b>${fmt(B)} ${nm(i)}</b>`}`,
        ex: tafel([[von, vi]], ni, { von: `${fmt(von)} ${nm(vi)}`, nachName: nm(ni), erg: nach }),
      };
    }
    if (v === 6) {
      // gemischte Schreibweise in die kleinere Einheit
      const i = R(0, n - 2), liter = art === 'v' && i === 1 && R(0, 1);
      const B = R(1, 15), r = R(1, f - 1), erg = B * f + r;
      return {
        prompt: `Gib in <b>${nm(i + 1, liter)}</b> an: <b>${B} ${nm(i, liter)} ${r} ${nm(i + 1, liter)}</b>`,
        fields: [{ answer: erg, suffix: nm(i + 1, liter) }],
        hint: `Rechne nur den ersten Teil um: ${B} ${nm(i, liter)} = ${fmt(B * f)} ${nm(i + 1, liter)}. Dann zählst du ${r} ${nm(i + 1, liter)} dazu.`,
        solution: `${B} ${nm(i, liter)} ${r} ${nm(i + 1, liter)} = ${fmt(B * f)} ${nm(i + 1, liter)} + ${r} ${nm(i + 1, liter)} = <b>${fmt(erg)} ${nm(i + 1, liter)}</b>`,
        ex: tafel([[B, i], [r, i + 1]], i + 1, { von: `${B} ${nm(i, liter)} ${r} ${nm(i + 1, liter)}`, nachName: nm(i + 1, liter), erg }),
      };
    }
    if (v === 7) {
      // rechnen: erst alles in dieselbe Einheit
      const i = R(art === 'f' ? 1 : 0, n - 2), liter = art === 'v' && i === 1;
      const a = R(2, 9), b = R(1, 9), c = R(11, Math.min(f - 1, 450)), d = R(11, Math.min(f - 1, 450));
      const erg = (a + b) * f + c + d;
      const teile = [[a, i], [b, i], [c, i + 1], [d, i + 1]];
      return {
        prompt: `Berechne und gib das Ergebnis in <b>${nm(i + 1, liter)}</b> an:<br><b>${a} ${nm(i, liter)} + ${b} ${nm(i, liter)} + ${c} ${nm(i + 1, liter)} + ${d} ${nm(i + 1, liter)}</b>`,
        fields: [{ answer: erg, suffix: nm(i + 1, liter) }],
        hint: 'Rechne immer mit Größen in derselben Einheit. Schreibe zuerst alle Angaben in der kleineren Einheit.',
        solution: `${fmt(a * f)} ${nm(i + 1, liter)} + ${fmt(b * f)} ${nm(i + 1, liter)} + ${c} ${nm(i + 1, liter)} + ${d} ${nm(i + 1, liter)} = <b>${fmt(erg)} ${nm(i + 1, liter)}</b>`,
        ex: tafel(teile, i + 1, { von: teile.map(([w, j]) => `${w} ${nm(j, liter)}`).join(' + '), nachName: nm(i + 1, liter), namen: [nm(i, liter), nm(i + 1, liter)], erg, summe: true }),
      };
    }
    if (v === 8) {
      // vergleichen
      const i = R(0, n - 2), liter = art === 'v' && i === 1 && R(0, 1);
      const B = R(2, 9), S = B * f + pick([-1, 1, 0]) * R(1, 9) * (f / 10);
      const z = zeichen(B * f, S);
      return {
        prompt: `Welches Zeichen gehört in die Lücke?<br><b>${B} ${nm(i, liter)} &nbsp;▢&nbsp; ${fmt(S)} ${nm(i + 1, liter)}</b>`,
        choices: ZEICHEN, correct: ZEICHEN.indexOf(z),
        hint: 'Gib beide Größen in derselben Einheit an. Dann vergleichst du nur noch die Maßzahlen.',
        solution: `${B} ${nm(i, liter)} = ${fmt(B * f)} ${nm(i + 1, liter)}<br>${fmt(B * f)} ${nm(i + 1, liter)} ${zh(z)} ${fmt(S)} ${nm(i + 1, liter)}<br>→ <b>${B} ${nm(i, liter)} ${zh(z)} ${fmt(S)} ${nm(i + 1, liter)}</b>`,
        ex: tafel([[B, i]], i + 1, { von: `${B} ${nm(i, liter)}`, nachName: nm(i + 1, liter), erg: B * f, vgl: { wert: S, zeichen: z } }),
      };
    }
    if (v === 9 && art === 'f') {
      // zwei Stufen nach oben/unten mit Komma, z. B. 2,5 ha in m²
      const i = R(0, n - 3), B = R(12, 95) / 10, S = round6(B * f * f);
      return {
        prompt: `Gib in <b>${nm(i + 2)}</b> an: <b>${fmt(B)} ${nm(i)}</b>`,
        fields: [{ answer: S, suffix: nm(i + 2) }],
        hint: `Zwei Stufen, also zweimal mal 100 (das ist mal 10 000). Das Komma rückt dabei 4 Stellen nach rechts.`,
        solution: `${fmt(B)} ${nm(i)} = ${fmt(round6(B * f))} ${nm(i + 1)} = <b>${fmt(S)} ${nm(i + 2)}</b>`,
        ex: tafel([[B, i]], i + 2, { von: `${fmt(B)} ${nm(i)}`, nachName: nm(i + 2), erg: S }),
      };
    }
    // Welche Einheit / welches Volumen passt?
    if (art === 'f') {
      const [obj, k] = pick(sinnvollF);
      const fern = shuffle(FL.map((_, j) => j).filter((j) => Math.abs(j - k) >= 2)).slice(0, 3);
      return wahl(`In welcher Einheit gibt man den Flächeninhalt von <b>${obj}</b> sinnvoll an?`, [FL[k][0], ...fern.map((j) => FL[j][0])], FL[k][0], {
        hint: 'Stell dir die Fläche vor: Passt sie auf ein Blatt Papier, in ein Zimmer, auf ein Feld oder ist sie so groß wie ein Land?',
        solution: `Bei ${obj} passt <b>${FL[k][0]}</b>.<br><small>Merkhilfe: 1 m² ist ein Quadrat mit 1 m Seitenlänge, 1 a eins mit 10 m, 1 ha eins mit 100 m, 1 km² eins mit 1 km.</small>`,
        ex: { mode: 'bild', art, k, obj },
      });
    }
    const [obj, wert] = pick(sinnvollV);
    const andere = shuffle(sinnvollV.filter(([o]) => o !== obj)).slice(0, 3).map(([, w]) => w);
    return wahl(`Welche Angabe passt zum Volumen von <b>${obj}</b>?`, [wert, ...andere], wert, {
      hint: 'Denke an bekannte Gefäße: Eine Milchtüte fasst 1 Liter, ein Eimer etwa 10 Liter.',
      solution: `Bei ${obj}: etwa <b>${wert}</b>.<br><small>1 l = 1 dm³ (ein Würfel mit 10 cm Kante), 1 ml = 1 cm³ (etwa ein Zuckerwürfel).</small>`,
      ex: { mode: 'bild', art, wert, obj },
    });
  }
  const flaecheneinheit = () => einheitAufgabe('f');
  const volumeneinheit = () => einheitAufgabe('v');

  // „Größenangaben in Kommaschreibweise“ (Kap. III, 3) behält Länge, Masse und Zeit; Flächen und Volumen haben jetzt eigene Themen.
  // Neu dort: Geld (€ und ct) wie im Buch S. 90 und 98.
  const thema = (id) => M.grades[5].lbs.flatMap((l) => l.topics).find((t) => t.id === id);
  const euroText = (ct) => `${Math.floor(ct / 100)},${String(ct % 100).padStart(2, '0')}`;
  {
    const t = thema('k5-einheit'), alt = t.gen;
    t.gen = () => {
      if (R(1, 6) === 1) {
        const ct = R(105, 9895), euro = ct / 100, runter = R(0, 1);
        return runter ? {
          prompt: `Gib in <b>ct</b> an: <b>${euroText(ct)} €</b>`,
          fields: [{ answer: ct, suffix: 'ct' }],
          hint: '1 € = 100 ct. Beim Umrechnen in Cent: mal 100, das Komma rückt zwei Stellen nach rechts.',
          solution: `1 € = 100 ct<br>${euroText(ct)} · 100 = <b>${fmt(ct)} ct</b>`,
          ex: { mode: 'einh', lad: [['ct', 1], ['€', 100]], i: 0, toSmall: true, from: euro, to: ct },
        } : {
          prompt: `Gib in <b>€</b> an: <b>${fmt(ct)} ct</b>`,
          fields: [{ answer: euro, suffix: '€' }],
          hint: '100 ct = 1 €. In Euro: durch 100, das Komma rückt zwei Stellen nach links.',
          solution: `100 ct = 1 €<br>${fmt(ct)} : 100 = <b>${euroText(ct)} €</b>`,
          answerText: `${euroText(ct)} €`,
          ex: { mode: 'einh', lad: [['ct', 1], ['€', 100]], i: 0, toSmall: false, from: ct, to: euro },
        };
      }
      for (;;) { const a = alt(); if (!a.ex || !a.ex.lad || !/[²³]|^ml$|^l$/.test(a.ex.lad[0][0])) return a; }
    };
  }

  // =====================================================
  // Einhängen (klasse5-buch.js ordnet sie danach in die Kapitel ein)
  // =====================================================
  const lb1 = M.grades[5].lbs[0].topics;
  lb1.push({ id: 'k5-fachbegriffe', title: 'Fachbegriffe', icon: 'Σ', gen: fachbegriffe });
  lb1.push({ id: 'k5-bruchvergleich', title: 'Brüche vergleichen', icon: '<', gen: bruchvergleich });
  lb1.push({ id: 'k5-prozent', title: 'Prozente', icon: '%', gen: prozent });
  lb1.push({ id: 'k5-flaecheneinheit', title: 'Flächen\u00ADeinheiten', icon: 'm²', gen: flaecheneinheit });
  lb1.push({ id: 'k5-volumeneinheit', title: 'Volumen\u00ADeinheiten', icon: 'm³', gen: volumeneinheit });
})();
