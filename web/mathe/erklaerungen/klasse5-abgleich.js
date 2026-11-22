/* MaDax (Mathe) – Erklär-Animationen zu den Themen aus generatoren/klasse5-abgleich.js
 * (Fachbegriffe und Zahlenmauern, Brüche vergleichen, Prozente, Flächen- und Volumeneinheiten in der Stellenwerttafel)
 *
 * Aufbau wie in klasse5.js: { title, viewBox, create(api, ctx) → { reset(), play() } }
 * ctx ist das ex-Objekt der Aufgabe plus pre:true (ähnliches Beispiel) oder post:true (genau die Aufgabe).
 * Darstellung wie im Buch: Rechteckstreifen beim Vergleichen (S. 68), Hundertertafel bei Prozent (S. 72),
 * Stellenwerttafel mit zwei bzw. drei Spalten je Einheit (S. 176 und 198).
 */
(function () {
  const M = window.Mathelix;
  const U = M.util, EX = M.explainers;
  const { el } = M.exUtil;
  const { fmt, R, pick, fr, gcd } = U;
  const reg = (id, def) => (EX[id] = def);
  const lerp = (a, b, t) => a + (b - a) * t;
  const show = (e, t) => e.setAttribute('opacity', t);
  const themen = () => M.grades[5].lbs.flatMap((l) => l.topics);
  function aehnlich(id, ctx, gleich) {
    const gen = themen().find((t) => t.id === id).gen;
    for (let i = 0; i < 400; i++) {
      const e = gen().ex;
      if (e && e.mode === ctx.mode && (!gleich || gleich(e)) && JSON.stringify(e) !== JSON.stringify(Object.assign({}, ctx, { pre: undefined, post: undefined }))) return e;
    }
    return ctx;
  }
  const subText = (ctx) => (ctx.post ? 'Lösung zu deiner Aufgabe' : ctx.pre ? 'Ein ähnliches Beispiel – deine Aufgabe löst du danach selbst' : '');
  const wahl = (id, ctx, frei, gleich) => (ctx.mode && ctx.post ? ctx : ctx.mode && ctx.pre ? aehnlich(id, ctx, gleich) : frei());
  const zh = (z) => (z === '<' ? '&lt;' : z === '>' ? '&gt;' : '=');
  const bruchText = (n, d) => `${n}/${d}`;

  // =====================================================
  // Fachbegriffe und Zahlenmauern
  // =====================================================
  reg('k5-fachbegriffe', {
    title: 'Jede Zahl hat einen Namen',
    titleFor: (ctx) => (ctx && ctx.mode === 'mauer' ? 'Zahlenmauern: Stein auf Stein' : 'Jede Zahl hat einen Namen'),
    viewBox: '0 0 360 210',
    create(api, ctx) {
      ctx = ctx || {};
      const OPS = M.FACHBEGRIFFE;
      let c = wahl('k5-fachbegriffe', ctx, () => aehnlich('k5-fachbegriffe', { mode: 'fb' }, (e) => !e.worte && !e.rueck), (e) => !!e.worte === !!ctx.worte && !!e.rueck === !!ctx.rueck && (ctx.mode !== 'mauer' || e.art === ctx.art));
      if (!ctx.mode) api.chips([
        { label: 'Fachbegriffe', onClick() { api.stop(); c = aehnlich('k5-fachbegriffe', { mode: 'fb' }, (e) => !e.worte && !e.rueck); api.replay(); } },
        { label: 'Additionsmauer', onClick() { api.stop(); c = aehnlich('k5-fachbegriffe', { mode: 'mauer' }, (e) => e.art === '+'); api.replay(); } },
        { label: 'Multiplikationsmauer', onClick() { api.stop(); c = aehnlich('k5-fachbegriffe', { mode: 'mauer' }, (e) => e.art === '·'); api.replay(); } },
      ]);
      let g;
      const XS = [62, 180, 298];
      function fbSzene() {
        const O = OPS[c.op];
        g = { zeilen: [], zahl: [], name: [] };
        // oben die Rechnung, darunter die Namen
        c.z.forEach((v, i) => {
          const versteckt = (c.rueck && i === c.k) || (c.worte && i === 2);
          g.zahl.push(el('text', { x: XS[i], y: 44, class: 'ex-b', 'text-anchor': 'middle', style: 'font-size:24px', text: versteckt ? '?' : fmt(v) }, api.svg));
          g.name.push(el('text', { x: XS[i], y: 70, class: 'ex-s f2', 'text-anchor': 'middle', text: O.teile[i], opacity: 0 }, api.svg));
        });
        el('text', { x: 121, y: 44, class: 'ex-b', 'text-anchor': 'middle', style: 'font-size:24px', text: c.op }, api.svg);
        el('text', { x: 239, y: 44, class: 'ex-b', 'text-anchor': 'middle', style: 'font-size:24px', text: '=' }, api.svg);
        // unten alle vier Grundrechenarten
        Object.keys(OPS).forEach((op, r) => {
          const P = OPS[op], y = 92 + r * 28, grp = el('g', { opacity: 0 }, api.svg);
          grp.box = el('rect', { x: 10, y, width: 340, height: 24, rx: 7, class: 'bag' }, grp);
          el('text', { x: 20, y: y + 17, class: 'ex-s', text: `${P.art}:` }, grp);
          el('text', { x: 112, y: y + 17, class: 'ex-s', style: 'font-size:12px', text: `${P.teile[0]} ${op} ${P.teile[1]} = ${P.teile[2]}` }, grp);
          grp.op = op;
          g.zeilen.push(grp);
        });
      }
      const MW = 84, MH = 36;
      const mx = (r, i) => 54 + r * (MW / 2) + i * MW, my = (r) => 150 - r * MH;
      function mauerSzene() {
        g = { reihen: M.zahlenmauer(c.art, c.unten), stein: [] };
        g.reihen.forEach((reihe, r) => { g.stein[r] = reihe.map((v, i) => {
          const leer = c.fehlt[0] === r && c.fehlt[1] === i;
          const rect = el('rect', { x: mx(r, i), y: my(r), width: MW, height: MH, rx: 4, class: leer ? 'tz hi' : 'tz' }, api.svg);
          const text = el('text', { x: mx(r, i) + MW / 2, y: my(r) + 25, class: 'ex-b', 'text-anchor': 'middle', text: leer ? '?' : fmt(v) }, api.svg);
          return { rect, text, v };
        }); });
        el('text', { x: 180, y: 204, class: 'ex-s f6', 'text-anchor': 'middle', text: c.art === '+' ? 'Jeder Stein = Summe der zwei Steine darunter' : 'Jeder Stein = Produkt der zwei Steine darunter' }, api.svg);
      }
      return {
        reset() { api.clear(); api.sub(subText(ctx)); if (c.mode === 'mauer') mauerSzene(); else fbSzene(); },
        async play() {
          if (c.mode === 'mauer') {
            const [r, i] = c.fehlt, z = g.stein, art = c.art, ziel = z[r][i];
            api.say(`In einer <b>${art === '+' ? 'Additionsmauer' : 'Multiplikationsmauer'}</b> ist jeder Stein ${art === '+' ? 'die <b>Summe</b>' : 'das <b>Produkt</b>'} der beiden Steine direkt darunter.`);
            await api.wait(3400);
            if (r >= 1) {
              const [a, b] = [z[r - 1][i], z[r - 1][i + 1]];
              a.rect.setAttribute('class', 'tz hi'); b.rect.setAttribute('class', 'tz hi');
              api.say(`Unter dem leeren Stein stehen <b>${fmt(a.v)}</b> und <b>${fmt(b.v)}</b>.`);
              await api.wait(2400);
              ziel.text.textContent = fmt(ziel.v); ziel.text.setAttribute('class', 'ex-b f1');
              api.say(`${fmt(a.v)} ${art} ${fmt(b.v)} = <b>${fmt(ziel.v)}</b>`);
            } else {
              const ob = z[1][i === 0 ? 0 : 1], nb = z[0][1];
              ob.rect.setAttribute('class', 'tz hi'); nb.rect.setAttribute('class', 'tz hi');
              api.say(`Der Stein darüber ist ${fmt(ob.v)}. Er entsteht aus dem leeren Stein und der ${fmt(nb.v)}: ${fmt(ob.v)} = ▢ ${art} ${fmt(nb.v)}`);
              await api.wait(3600);
              ziel.text.textContent = fmt(ziel.v); ziel.text.setAttribute('class', 'ex-b f1');
              api.say(`Umkehraufgabe: ${fmt(ob.v)} ${art === '+' ? '−' : ':'} ${fmt(nb.v)} = <b>${fmt(ziel.v)}</b>`);
            }
            await api.wait(2600);
            api.say(`Der leere Stein ist <b>${fmt(ziel.v)}</b>.<br><small>Probe: ${art === '+' ? 'Summe' : 'Produkt'} der beiden Steine darunter muss den Stein darüber ergeben.</small>`);
            return;
          }
          const O = OPS[c.op];
          api.say('Für jede Grundrechenart gibt es <b>Fachbegriffe</b>: Jede Zahl in der Rechnung hat einen Namen.');
          for (const z of g.zeilen) { await api.tw(350, (t) => show(z, t)); await api.wait(250); }
          await api.wait(1800);
          const zeile = g.zeilen.find((z) => z.op === c.op);
          zeile.box.setAttribute('class', 'bag take');
          api.say(`Oben steht eine <b>${O.art}</b>, eine ${O.strich ? 'Strichrechnung' : 'Punktrechnung'}.`);
          await api.wait(2600);
          for (const n of g.name) { await api.tw(300, (t) => show(n, t)); }
          await api.wait(1400);
          if (c.worte) {
            api.say(`„Bilde ${O.wort} aus ${fmt(c.z[0])} und ${fmt(c.z[1])}“ heißt: Rechne ${fmt(c.z[0])} ${c.op} ${fmt(c.z[1])}. Die erste Zahl kommt zuerst.`);
            await api.wait(3400);
            g.zahl[2].textContent = fmt(c.z[2]); g.zahl[2].setAttribute('class', 'ex-b f1');
            api.say(`${O.teile[2]}: ${fmt(c.z[0])} ${c.op} ${fmt(c.z[1])} = <b>${fmt(c.z[2])}</b>`);
            return;
          }
          if (c.rueck) {
            const k = c.k, umk = c.op === '+' ? ['−', 2, 0] : c.op === '·' ? [':', 2, 0] : c.op === '−' ? (k === 0 ? ['+', 1, 2] : ['−', 0, 2]) : (k === 0 ? ['·', 1, 2] : [':', 0, 2]);
            g.name[k].setAttribute('class', 'ex-s f1');
            api.say(`Gesucht ist ${k === 2 ? 'das Ergebnis' : `der <b>${O.teile[k]}</b>`}. Das hilft die <b>Umkehraufgabe</b>.`);
            await api.wait(2800);
            g.zahl[k].textContent = fmt(c.z[k]); g.zahl[k].setAttribute('class', 'ex-b f1');
            api.say(`Umkehraufgabe: ${fmt(c.z[umk[1]])} ${umk[0]} ${fmt(c.z[umk[2]])} = <b>${fmt(c.z[k])}</b><br><small>Probe: ${fmt(c.z[0])} ${c.op} ${fmt(c.z[1])} = ${fmt(c.z[2])} ✓</small>`);
            return;
          }
          if (c.k >= 0 && ctx.mode) {
            g.zahl[c.k].setAttribute('class', 'ex-b f1'); g.name[c.k].setAttribute('class', 'ex-s f1');
            api.say(`Die ${fmt(c.z[c.k])} ist ${c.k === 2 ? (c.op === '·' ? 'das' : c.op === ':' ? 'der' : 'die') : c.op === '−' || c.op === ':' ? 'der' : 'ein'} <b>${O.teile[c.k]}</b>.`);
            return;
          }
          api.say(`${O.teile[0]} ${c.op} ${O.teile[1]} = ${O.teile[2]}.<br><small>Tipp: Das Ergebnis heißt bei Plus Summe, bei Minus Differenz, bei Mal Produkt und bei Geteilt Quotient.</small>`);
        },
      };
    },
  });

  // =====================================================
  // Brüche vergleichen: Rechteckstreifen, dann gemeinsamer Nenner
  // =====================================================
  const artVon = (e) => (e.a[1] === e.b[1] ? 'nenner' : e.a[0] === e.b[0] ? 'zaehler' : 'hn');
  reg('k5-bruchvergleich', {
    title: 'Brüche vergleichen: Welcher Streifen ist länger?',
    viewBox: '0 0 360 170',
    create(api, ctx) {
      ctx = ctx || {};
      const neu = (art) => aehnlich('k5-bruchvergleich', { mode: 'vgl' }, (e) => artVon(e) === art && e.a[1] <= 12 && e.b[1] <= 12);
      let c = wahl('k5-bruchvergleich', ctx, () => neu('hn'), (e) => artVon(e) === artVon(ctx));
      if (!ctx.mode) api.chips([['gleicher Nenner', 'nenner'], ['gleicher Zähler', 'zaehler'], ['verschiedene Nenner', 'hn']].map(([label, art]) => ({ label, onClick() { api.stop(); c = neu(art); api.replay(); } })));
      let g;
      function streifen(y, n, d, cls, name) {
        const o = { y };
        el('text', { x: 24, y: y + 19, class: 'ex-b', 'text-anchor': 'middle', text: name }, api.svg);
        el('rect', { x: 50, y, width: 280, height: 28, rx: 5, class: 'tz' }, api.svg);
        o.fill = el('rect', { x: 50, y, width: 0, height: 28, rx: 5, class: cls }, api.svg);
        for (let i = 1; i < d; i++) el('line', { x1: 50 + (280 * i) / d, y1: y, x2: 50 + (280 * i) / d, y2: y + 28, class: 'tzl' }, api.svg);
        o.fein = el('g', { opacity: 0 }, api.svg);
        return o;
      }
      return {
        reset() {
          api.clear(); api.sub(subText(ctx)); g = {};
          g.a = streifen(22, c.a[0], c.a[1], 'barA', bruchText(...c.a));
          g.b = streifen(74, c.b[0], c.b[1], 'barB', bruchText(...c.b));
          g.marke = el('g', { opacity: 0 }, api.svg);
          [c.a, c.b].forEach((b) => el('line', { x1: 50 + (280 * b[0]) / b[1], y1: 14, x2: 50 + (280 * b[0]) / b[1], y2: 110, class: 'dash' }, g.marke));
          g.info = el('text', { x: 180, y: 150, class: 'ex-b f1', 'text-anchor': 'middle', text: '' }, api.svg);
        },
        async play() {
          const [a, b] = [c.a, c.b], art = artVon(c);
          api.say(`Beide Streifen sind gleich lang: Jeder ist <b>ein Ganzes</b>. Oben ist er in ${a[1]} gleiche Teile geteilt, unten in ${b[1]}.`);
          await api.wait(3400);
          await api.tw(900, (t) => { g.a.fill.setAttribute('width', (280 * a[0] * t) / a[1]); g.b.fill.setAttribute('width', (280 * b[0] * t) / b[1]); });
          api.say(`Oben färben wir ${a[0]} von ${a[1]} Teilen, unten ${b[0]} von ${b[1]}. Welcher Streifen reicht weiter?`);
          await api.wait(3000);
          show(g.marke, 1);
          const l = a[0] * b[1], r = b[0] * a[1], z = l < r ? '<' : l > r ? '>' : '=';
          if (art === 'nenner') api.say(`<b>Gleicher Nenner:</b> Alle Teile sind gleich groß. Dann ist der Bruch mit dem <b>größeren Zähler</b> größer.`);
          else if (art === 'zaehler') api.say(`<b>Gleicher Zähler:</b> Gleich viele Teile. Aber ${bruchText(1, Math.min(a[1], b[1]))} ist größer als ${bruchText(1, Math.max(a[1], b[1]))}: Der Bruch mit dem <b>kleineren Nenner</b> ist größer.`);
          else {
            const h = (a[1] * b[1]) / gcd(a[1], b[1]);
            await api.wait(1400);
            for (const s of [g.a, g.b]) { for (let i = 1; i < h; i++) el('line', { x1: 50 + (280 * i) / h, y1: s.y, x2: 50 + (280 * i) / h, y2: s.y + 28, class: 'tzl fein' }, s.fein); show(s.fein, 1); }
            api.say(`Verschiedene Nenner: Wir teilen beide Streifen gleich fein. Der <b>gemeinsame Nenner</b> ist ${h}, das kleinste gemeinsame Vielfache von ${a[1]} und ${b[1]}.<br>${fr(a[0], a[1])} = ${fr((a[0] * h) / a[1], h)} und ${fr(b[0], b[1])} = ${fr((b[0] * h) / b[1], h)}`);
          }
          await api.wait(4400);
          g.info.textContent = `${bruchText(...a)} ${z} ${bruchText(...b)}`;
          api.say(`${z === '=' ? 'Beide Streifen enden an derselben Stelle: Die Brüche sind <b>gleich groß</b>.' : `Der ${z === '>' ? 'obere' : 'untere'} Streifen reicht weiter.`}<br>${fr(a[0], a[1])} <b>${zh(z)}</b> ${fr(b[0], b[1])}`);
        },
      };
    },
  });

  // =====================================================
  // Prozente an der Hundertertafel (ohne Dezimalzahlen, wie in Kapitel II)
  // =====================================================
  reg('k5-prozent', {
    title: 'Prozent heißt „von Hundert“',
    viewBox: '0 0 360 190',
    create(api, ctx) {
      ctx = ctx || {};
      const LISTE = [[1, 2], [1, 4], [3, 4], [1, 5], [2, 5], [3, 10], [7, 20], [6, 25], [9, 50], [3, 5]];
      let c = wahl('k5-prozent', ctx, () => ({ mode: 'proz', p: 3, q: 4 }));
      if (!ctx.mode) api.chips(LISTE.map(([p, q]) => ({ label: bruchText(p, q), onClick() { api.stop(); c = { mode: 'proz', p, q }; api.replay(); } })));
      let g;
      const S = 16, X0 = 16, Y0 = 12;
      return {
        reset() {
          api.clear(); api.sub(subText(ctx)); g = { zellen: [] };
          for (let i = 0; i < 100; i++) g.zellen.push(el('rect', { x: X0 + (i % 10) * S, y: Y0 + Math.floor(i / 10) * S, width: S - 1.5, height: S - 1.5, rx: 2, class: 'tz' }, api.svg));
          g.t1 = el('text', { x: 268, y: 60, class: 'ex-b', 'text-anchor': 'middle', text: '' }, api.svg);
          g.t2 = el('text', { x: 268, y: 100, class: 'ex-b f2', 'text-anchor': 'middle', text: '' }, api.svg);
          g.t3 = el('text', { x: 268, y: 140, class: 'ex-b f1', 'text-anchor': 'middle', style: 'font-size:26px', text: '' }, api.svg);
        },
        async play() {
          const { p, q } = c, k = 100 / q, h = p * k;
          api.say('Die Tafel hat <b>100 Kästchen</b>. Ein Kästchen ist ein Hundertstel: 1/100 = <b>1 %</b>.');
          g.zellen[0].setAttribute('class', 'tz hi');
          await api.wait(3000);
          g.zellen[0].setAttribute('class', 'tz');
          if (c.rueck) { // Richtung Prozent → gekürzter Bruch (seit v124); vorher lief die Animation auch hier vom Bruch zum Prozent
            g.t1.textContent = `${h} %`;
            api.say(`<b>${h} %</b> heißt: ${h} von 100 Kästchen. Als Bruch sind das ${fr(h, 100)}.`);
            await api.tw(900, (t) => { const bis = Math.round(t * h); for (let i = 0; i < bis; i++) g.zellen[i].setAttribute('class', 'tz hi'); });
            g.t2.textContent = `= ${h}/100`;
            await api.wait(3200);
            api.say(`Jetzt kürzen: Zähler und Nenner durch <b>${k}</b> teilen. Im Bild heißt das: Immer ${k} Kästchen bilden ein Päckchen.`);
            for (let j = 0; j < q; j++) { for (let i = j * k; i < (j + 1) * k; i++) g.zellen[i].setAttribute('opacity', j % 2 ? 0.5 : 1); if (j < p) await api.wait(350); }
            await api.wait(3200);
            g.t3.textContent = `= ${p}/${q}`;
            api.say(`Die ganze Tafel hat ${q} Päckchen, gefärbt ${p === 1 ? 'ist' : 'sind'} ${p}. Also ${h} % = ${fr(h, 100)} = <b>${fr(p, q)}</b><br><small>Gekürzt mit ${k}. Weiter kürzen geht nicht.</small>`);
            return;
          }
          g.t1.textContent = `${p}/${q}`;
          api.say(`${fr(p, q)} in Prozent: Erweitere auf den <b>Nenner 100</b>. Dafür nimmst du Zähler und Nenner mal ${k} (denn ${q} · ${k} = 100).`);
          await api.wait(3800);
          g.t2.textContent = `= ${h}/100`;
          const NAME = { 2: 'Halbes', 4: 'Viertel', 5: 'Fünftel', 10: 'Zehntel', 20: 'Zwanzigstel', 25: 'Fünfundzwanzigstel', 50: 'Fünfzigstel' };
          api.say(`${q === 2 ? 'Ein Halbes sind' : `Ein ${NAME[q] || q + '-tel'} sind`} ${k} Kästchen. ${p} davon ${p === 1 ? 'ist' : 'sind'} ${p} · ${k} = <b>${h}</b> Kästchen.`);
          for (let j = 0; j < p; j++) {
            const von = j * k;
            await api.tw(Math.min(900, 120 + k * 12), (t) => { const bis = von + Math.round(t * k); for (let i = von; i < bis; i++) g.zellen[i].setAttribute('class', 'tz hi'); });
            await api.wait(250);
          }
          await api.wait(1600);
          g.t3.textContent = `= ${h} %`;
          api.say(`${fr(p, q)} = ${fr(h, 100)} = <b>${h} %</b><br><small>„Prozent“ heißt „von Hundert“: ${h} von 100 Kästchen.</small>`);
        },
      };
    },
  });

  // =====================================================
  // Flächen- und Volumeneinheiten in der Stellenwerttafel
  // =====================================================
  function einheitenErklaerung(art) {
    const id = art === 'f' ? 'k5-flaecheneinheit' : 'k5-volumeneinheit';
    return {
      title: art === 'f' ? 'Flächeneinheiten in der Stellenwerttafel' : 'Volumeneinheiten in der Stellenwerttafel',
      titleFor: (ctx) => (ctx && ctx.mode === 'bild' ? (art === 'f' ? 'Welche Flächeneinheit passt?' : 'Wie viel passt hinein?') : art === 'f' ? 'Flächeneinheiten in der Stellenwerttafel' : 'Volumeneinheiten in der Stellenwerttafel'),
      viewBox: '0 0 360 200',
      create(api, ctx) {
        ctx = ctx || {};
        const T = M.EINHEITEN_TAFEL[art], k = art === 'f' ? 2 : 3, f = art === 'f' ? 100 : 1000, n = T.length, cols = n * k, cw = 340 / cols;
        const X = (col) => 10 + col * cw, E = (i) => i * k + k - 1;
        const kopf = (i) => (art === 'v' && i === 1 ? 'dm³ | l' : art === 'v' && i === 2 ? 'cm³ | ml' : T[i][0]);
        const frei = () => aehnlich(id, { mode: 'tafel' }, (e) => !e.summe && !e.vgl);
        let c = wahl(id, ctx, frei, (e) => !!e.summe === !!ctx.summe && !!e.vgl === !!ctx.vgl);
        if (!ctx.mode) api.chips([{ label: 'Neues Beispiel', onClick() { api.stop(); c = frei(); api.replay(); } }]);
        let g;
        function tafel() {
          g = { zellen: [], text: [] };
          for (let i = 0; i < n; i++) {
            el('rect', { x: X(i * k) + 1, y: 8, width: k * cw - 2, height: 22, rx: 5, class: 'tzk g' + (i % 4) }, api.svg);
            el('text', { x: X(i * k) + (k * cw) / 2, y: 23, class: 'ex-xs', 'text-anchor': 'middle', style: 'font-size:11px', text: kopf(i) }, api.svg);
            (k === 2 ? ['Z', 'E'] : ['H', 'Z', 'E']).forEach((b, j) => el('text', { x: X(i * k + j) + cw / 2, y: 44, class: 'ex-s f6', 'text-anchor': 'middle', style: 'font-size:10px', text: b }, api.svg));
          }
          for (let col = 0; col < cols; col++) {
            g.zellen.push(el('rect', { x: X(col) + 1, y: 50, width: cw - 2, height: 30, rx: 4, class: 'tz' }, api.svg));
            g.text.push(el('text', { x: X(col) + cw / 2, y: 72, class: 'ex-b', 'text-anchor': 'middle', text: '' }, api.svg));
          }
          g.komma = el('text', { x: 0, y: 84, class: 'ex-b f1', 'text-anchor': 'middle', style: 'font-size:26px', text: ',', opacity: 0 }, api.svg);
          g.zeile1 = el('text', { x: 180, y: 120, class: 'ex-b', 'text-anchor': 'middle', text: '' }, api.svg);
          g.zeile2 = el('text', { x: 180, y: 154, class: 'ex-b f1', 'text-anchor': 'middle', text: '' }, api.svg);
        }
        function bild() {
          g = {};
          if (art === 'f') {
            const BSP = ['Land', 'Acker', 'Fußballfeld', 'Zimmer', 'Heftseite', 'Briefmarke', 'Nadelkopf'];
            const w = 340 / n;
            g.box = T.map((u, i) => {
              const r = el('rect', { x: 10 + i * w + 2, y: 40, width: w - 4, height: 34, rx: 7, class: 'bag' }, api.svg);
              el('text', { x: 10 + i * w + w / 2, y: 63, class: 'ex-b', 'text-anchor': 'middle', style: 'font-size:15px', text: u[0] }, api.svg);
              el('text', { x: 10 + i * w + w / 2, y: 92, class: 'ex-s f6', 'text-anchor': 'middle', style: 'font-size:9.5px', text: BSP[i] }, api.svg);
              return r;
            });
            el('text', { x: 180, y: 24, class: 'ex-s', 'text-anchor': 'middle', text: 'groß ←                                   → klein' }, api.svg);
          } else {
            const LISTE = [['einem Wassertropfen', '0,05 ml'], ['einem Teelöffel', '5 ml'], ['einer Milchtüte', '1 l'], ['einem Putzeimer', '10 l'], ['einer Badewanne', '150 l'], ['einem Müllcontainer', '1000 l']];
            g.box = LISTE.map(([o, w], i) => {
              const y = 10 + i * 26, r = el('rect', { x: 40, y, width: 280, height: 22, rx: 6, class: 'bag' }, api.svg);
              el('text', { x: 52, y: y + 16, class: 'ex-s', text: o.replace(/^einem |^einer /, '') }, api.svg);
              el('text', { x: 308, y: y + 16, class: 'ex-s', 'text-anchor': 'end', text: w }, api.svg);
              r.obj = o; return r;
            });
          }
        }
        return {
          reset() { api.clear(); api.sub(subText(ctx)); if (c.mode === 'bild') bild(); else tafel(); },
          async play() {
            if (c.mode === 'bild') {
              if (art === 'f') {
                api.say('Die Flächeneinheiten von groß nach klein. Von einer Einheit zur nächsten ist die Umrechnungszahl <b>100</b>.');
                await api.wait(3600);
                g.box[c.k].setAttribute('class', 'bag take');
                api.say(`Bei ${c.obj} passt <b>${T[c.k][0]}</b>.<br><small>1 a ist ein Quadrat mit 10 m Seitenlänge, 1 ha eins mit 100 m.</small>`);
              } else {
                api.say('Wie viel passt hinein? Ein paar Werte zum Merken:');
                await api.wait(2400);
                const b = g.box.find((r) => r.obj === c.obj);
                if (b) b.setAttribute('class', 'bag take');
                api.say(`Bei ${c.obj}: etwa <b>${c.wert}</b>.<br><small>1 l = 1 dm³, 1 ml = 1 cm³.</small>`);
              }
              return;
            }
            const nachName = c.nachName, eNach = E(c.nach);
            if (c.summe) {
              api.say(`Rechne immer mit Größen in <b>derselben Einheit</b>. Erst alles in ${nachName} umrechnen, dann addieren.`);
              await api.wait(3200);
              const teile = c.teile.map(([w, i]) => (i === c.nach ? w : w * (T[i][1] / T[c.nach][1])));
              g.zeile1.textContent = c.teile.map(([w, i]) => `${fmt(w)} ${i === c.nach ? nachName : c.namen[0]}`).join(' + ');
              await api.wait(2400);
              g.zeile2.textContent = teile.map((w) => `${fmt(w)}`).join(' + ') + ` = ${fmt(c.erg)} ${nachName}`;
              api.say(`1 ${c.namen[0]} = ${fmt(f)} ${nachName}.<br>${teile.map(fmt).join(' + ')} = <b>${fmt(c.erg)} ${nachName}</b>`);
              return;
            }
            // Wert in der kleinsten Einheit (ganze Zahl), Ziffern in die Spalten
            const N = Math.round(c.teile.reduce((s, [w, i]) => s + w * T[i][1], 0));
            const ziff = String(N).padStart(cols, '0');
            const lead = cols - String(N).length;
            let last = cols - 1; while (last > 0 && ziff[last] === '0') last--;
            const eVon = E(Math.max(...c.teile.map(([, i]) => i)));
            const srcEnd = Math.max(eVon, last);
            api.say(`In der Stellenwerttafel hat jede Einheit <b>${k === 2 ? 'zwei' : 'drei'} Spalten</b>, weil die Umrechnungszahl ${fmt(f)} ist.`);
            await api.wait(3200);
            g.zeile1.textContent = c.von;
            api.say(`Trage <b>${c.von}</b> ein: Die Einer jeder Maßzahl stehen in der E-Spalte ihrer Einheit.`);
            for (let col = lead; col <= srcEnd; col++) { g.text[col].textContent = ziff[col]; await api.wait(260); }
            await api.wait(2000);
            g.zellen[eNach].setAttribute('class', 'tz hi');
            api.say(`Gesucht ist die Angabe in <b>${nachName}</b>: Wir lesen bis zur <b>E-Spalte von ${nachName}</b> ab.`);
            await api.wait(2800);
            const von = Math.min(lead, eNach), bis = Math.max(srcEnd, eNach);
            let auf = false;
            for (let col = von; col <= bis; col++) if (!g.text[col].textContent) { g.text[col].textContent = '0'; g.text[col].setAttribute('class', 'ex-b f1'); auf = true; await api.wait(200); }
            if (auf) { api.say('Leere Stellen bis dorthin füllen wir mit <b>Nullen</b> auf.'); await api.wait(2400); }
            if (last > eNach) {
              g.komma.setAttribute('x', X(eNach + 1)); show(g.komma, 1);
              api.say(`Was rechts von der E-Spalte von ${nachName} steht, kommt <b>hinter das Komma</b>.`);
              await api.wait(2600);
            }
            g.zeile2.textContent = `= ${fmt(c.erg)} ${nachName}`;
            api.say(`${c.von} = <b>${fmt(c.erg)} ${nachName}</b>${c.vgl ? `<br>${fmt(c.erg)} ${nachName} ${zh(c.vgl.zeichen)} ${fmt(c.vgl.wert)} ${nachName}, also <b>${c.von} ${zh(c.vgl.zeichen)} ${fmt(c.vgl.wert)} ${nachName}</b>` : ''}`);
          },
        };
      },
    };
  }
  reg('k5-flaecheneinheit', einheitenErklaerung('f'));
  reg('k5-volumeneinheit', einheitenErklaerung('v'));
})();
