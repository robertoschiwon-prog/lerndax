/* MaDax (Mathe) – Erklär-Animationen zu den Themen aus generatoren/klasse5-buch.js
 * (Große Zahlen & Zahlenstrahl, Brüche am Zahlenstrahl, Senkrecht & parallel)
 *
 * Aufbau wie in klasse5.js: { title, viewBox, create(api, ctx) → { reset(), play() } }
 * ctx ist das ex-Objekt der Aufgabe plus pre:true (ähnliches Beispiel) oder post:true (genau die Aufgabe).
 */
(function () {
  const M = window.Mathelix;
  const U = M.util, EX = M.explainers;
  const { el } = M.exUtil;
  const { fmt, R, pick, fr, gcd } = U;
  const reg = (id, def) => (EX[id] = def);
  const lerp = (a, b, t) => a + (b - a) * t;
  const themen = () => M.grades[5].lbs.flatMap((l) => l.topics);
  function aehnlich(id, ctx, gleich) {
    const gen = themen().find((t) => t.id === id).gen;
    for (let i = 0; i < 400; i++) {
      const e = gen().ex;
      if (e && e.mode === ctx.mode && (!gleich || gleich(e))) return e;
    }
    return ctx;
  }
  const subText = (ctx) => (ctx.post ? 'Lösung zu deiner Aufgabe' : ctx.pre ? 'Ein ähnliches Beispiel – deine Aufgabe löst du danach selbst' : '');
  const show = (e, t) => e.setAttribute('opacity', t);
  // Welche Aufgabe wird gezeigt? post: genau die Aufgabe, pre: eine ähnliche, sonst: frei
  const wahl = (id, ctx, frei, gleich) => (ctx.mode && ctx.post ? ctx : ctx.mode && ctx.pre ? aehnlich(id, ctx, gleich) : frei());

  // =====================================================
  // Große Zahlen & Zahlenstrahl
  // =====================================================
  const KURZ = ['E', 'Z', 'H', 'T', 'ZT', 'HT', 'M', 'ZM', 'HM', 'Md'];
  reg('k5-zahlen', {
    title: 'Große Zahlen: Jede Stelle hat ihren Wert',
    titleFor: (ctx) => (ctx && ctx.mode === 'strahl' ? 'Zahlenstrahl: Wie groß ist ein Schritt?' : 'Große Zahlen: Jede Stelle hat ihren Wert'),
    viewBox: '0 0 360 170',
    create(api, ctx) {
      ctx = ctx || {};
      const frei = () => ({ mode: 'stelle', n: aehnlich('k5-zahlen', { mode: 'stelle' }, (e) => e.n > 99999).n, i: 3 });
      let c = wahl('k5-zahlen', ctx, frei, (e) => (ctx.mode !== 'nachbar' || e.art === ctx.art) && (ctx.mode !== 'ordnen' || e.art === ctx.art));
      let cells, info;
      // Stellenwerttafel: rows = Zahlen (untereinander), Spalte 0 = Einer
      function tafel(rows) {
        const cols = Math.max(7, ...rows.map((z) => String(z).length));
        const cw = Math.min(36, 330 / cols), X = (col) => 345 - (col + 1) * cw;
        for (let col = 0; col < cols; col++) {
          el('rect', { x: X(col) + 1, y: 8, width: cw - 2, height: 22, rx: 5, class: 'tzk g' + Math.floor(col / 3) }, api.svg);
          el('text', { x: X(col) + cw / 2, y: 23, class: 'ex-xs', 'text-anchor': 'middle', text: KURZ[col] }, api.svg);
        }
        cells = rows.map((z, r) => {
          const s = String(z), zeile = [];
          for (let col = 0; col < cols; col++) {
            const y = 36 + r * 32;
            const rect = el('rect', { x: X(col) + 1, y, width: cw - 2, height: 28, rx: 5, class: 'tz' }, api.svg);
            const ch = s[s.length - 1 - col];
            const text = el('text', { x: X(col) + cw / 2, y: y + 21, class: 'ex-b', 'text-anchor': 'middle', opacity: 0, text: ch === undefined ? '' : ch }, api.svg);
            zeile.push({ rect, text, ch });
          }
          return zeile;
        });
        info = el('text', { x: 180, y: 160, class: 'ex-b f1', 'text-anchor': 'middle', text: '' }, api.svg);
      }
      const hi = (r, col, an = true) => cells[r][col] && cells[r][col].rect.setAttribute('class', an ? 'tz hi' : 'tz');
      async function trage(r, schnell) {
        const z = cells[r];
        for (let col = 0; col < z.length; col++) if (z[col].ch !== undefined) { show(z[col].text, 1); if (!schnell) await api.wait(170); }
      }
      // Zahlenstrahl
      let sx, punkt, zaehl;
      function strahl() {
        const X = (i) => 30 + i * 30, y = 92; sx = X;
        el('line', { x1: 14, y1: y, x2: 344, y2: y, class: 'axis' }, api.svg);
        el('path', { d: `M344 ${y - 4} l8 4 l-8 4z`, class: 'arrh' }, api.svg);
        for (let i = 0; i <= 10; i++) el('line', { x1: X(i), y1: y - (i % 5 === 0 ? 10 : 6), x2: X(i), y2: y + (i % 5 === 0 ? 10 : 6), class: 'axis' }, api.svg);
        el('text', { x: X(0), y: y + 28, class: 'ex-s', 'text-anchor': 'middle', text: fmt(c.a) }, api.svg);
        el('text', { x: X(10), y: y + 28, class: 'ex-s', 'text-anchor': 'middle', text: fmt(c.a + 10 * c.step) }, api.svg);
        el('path', { d: `M${X(c.k)} ${y - 40} v24`, class: 'strahlpf' }, api.svg);
        el('text', { x: X(c.k), y: y - 46, class: 'ex-b f1', 'text-anchor': 'middle', text: '?' }, api.svg).id = 'zsFrage';
        punkt = el('circle', { cx: X(0), cy: y, r: 7, class: 'pt', opacity: 0 }, api.svg);
        zaehl = el('text', { x: 180, y: 160, class: 'ex-b f1', 'text-anchor': 'middle', text: '' }, api.svg);
      }
      if (!ctx.mode) {
        const sl = api.slider({ label: 'Stelle', min: 0, max: String(c.n).length - 1, value: c.i, onInput(v) { c.i = v; cells[0].forEach((_, col) => hi(0, col, col === v)); zeigStelle(); } });
        api.chips([{ label: 'Neue Zahl', onClick() { c = frei(); sl.max = String(c.n).length - 1; sl.value = c.i; api.replay(); } }]);
      }
      function zeigStelle() {
        const z = Math.floor(c.n / 10 ** c.i) % 10;
        info.textContent = `${z} · ${fmt(10 ** c.i)} = ${fmt(z * 10 ** c.i)}`;
        api.say(`An der <b>${M.STELLEN[c.i]}stelle</b> steht die <b>${z}</b>. Sie ist ${z} · ${fmt(10 ** c.i)} = <b>${fmt(z * 10 ** c.i)}</b> wert.`);
      }
      return {
        reset() {
          api.clear(); api.sub(subText(ctx));
          if (c.mode === 'strahl') strahl();
          else tafel(c.mode === 'ordnen' ? c.zahlen : c.mode === 'nachbar' ? [c.n, c.ans] : c.mode === 'nullen' ? [10 ** c.nullen] : [c.n]);
        },
        async play() {
          if (c.mode === 'strahl') {
            api.say(`Beschriftet sind nur <b>${fmt(c.a)}</b> und <b>${fmt(c.a + 10 * c.step)}</b>. Dazwischen liegen <b>10 gleiche Schritte</b>.`);
            await api.wait(3400);
            zaehl.textContent = `${fmt(10 * c.step)} : 10 = ${fmt(c.step)}`;
            api.say(`Der Unterschied ist ${fmt(10 * c.step)}. Geteilt durch 10 Schritte: Ein Schritt ist <b>${fmt(c.step)}</b>.`);
            await api.wait(3400);
            show(punkt, 1);
            api.say(`Jetzt hüpfen wir von ${fmt(c.a)} los und zählen in ${fmt(c.step)}er-Schritten.`);
            await api.wait(1800);
            for (let i = 1; i <= c.k; i++) {
              await api.tw(420, (t) => { punkt.setAttribute('cx', lerp(sx(i - 1), sx(i), t)); punkt.setAttribute('cy', 92 - 16 * Math.sin(Math.PI * t)); });
              zaehl.textContent = fmt(c.a + i * c.step);
              await api.wait(260);
            }
            const f = api.svg.querySelector('#zsFrage'); if (f) f.textContent = fmt(c.a + c.k * c.step);
            api.say(`${c.k} Schritte: ${fmt(c.a)} + ${c.k} · ${fmt(c.step)} = <b>${fmt(c.a + c.k * c.step)}</b>`);
            return;
          }
          if (c.mode === 'stelle') {
            api.say(`Wir tragen <b>${fmt(c.n)}</b> in die Stellenwerttafel ein. Ganz rechts stehen die Einer, nach links wird jede Stelle <b>zehnmal so viel</b> wert.`);
            await trage(0);
            await api.wait(2600);
            hi(0, c.i); zeigStelle();
            return;
          }
          if (c.mode === 'nullen') {
            api.say(`<b>${c.wort[0].toUpperCase() + c.wort.slice(1)}</b>: Wir schreiben eine 1 und zählen die Nullen dahinter.`);
            show(cells[0][c.nullen].text, 1);
            await api.wait(2400);
            for (let k = 1; k <= c.nullen; k++) { show(cells[0][c.nullen - k].text, 1); hi(0, c.nullen - k); info.textContent = `${k} ${k === 1 ? 'Null' : 'Nullen'}`; await api.wait(480); }
            api.say(`${fmt(10 ** c.nullen)} hat <b>${c.nullen} Nullen</b>. Als Zehnerpotenz: 10<sup>${c.nullen}</sup>. Die Hochzahl zählt die Nullen.`);
            return;
          }
          if (c.mode === 'wort' || c.mode === 'tafel') {
            api.say(c.mode === 'wort' ? `<b>${M.zahlwort(c.n)}</b><br>Wir schreiben in Dreiergruppen: Millionen, Tausender, Rest.` : 'Jede Ziffer kommt in ihre Spalte der Stellenwerttafel.');
            await api.wait(3200);
            const z = cells[0];
            for (let col = z.length - 1; col >= 0; col--) if (z[col].ch !== undefined && z[col].ch !== '0') { show(z[col].text, 1); await api.wait(520); }
            api.say('Die Spalten dazwischen dürfen nicht leer bleiben: Dort schreiben wir eine <b>0</b>. Sonst rutschen die anderen Ziffern an die falsche Stelle.');
            await api.wait(1400);
            for (let col = z.length - 1; col >= 0; col--) if (z[col].ch === '0') { show(z[col].text, 1); hi(0, col); await api.wait(420); }
            await api.wait(1600);
            info.textContent = fmt(c.n);
            api.say(`Zusammen gelesen: <b>${fmt(c.n)}</b>`);
            return;
          }
          if (c.mode === 'nachbar') {
            const vor = c.art === 'Vorgänger';
            api.say(`Der <b>${c.art}</b> ist um 1 ${vor ? 'kleiner' : 'größer'}. Oben steht ${fmt(c.n)}.`);
            await trage(0);
            await api.wait(2200);
            await trage(1, true);
            let anders = 0;
            cells[0].forEach((z, col) => { if (z.ch !== cells[1][col].ch) { hi(1, col); anders++; } });
            info.textContent = `${fmt(c.n)} ${vor ? '−' : '+'} 1 = ${fmt(c.ans)}`;
            api.say(anders > 1 ? `Hier ändern sich <b>${anders} Stellen</b> auf einmal: ${vor ? 'Aus den Nullen werden Neunen, weil wir von der nächsten Stelle eins wegnehmen müssen.' : 'Aus den Neunen werden Nullen, und die nächste Stelle wird um eins größer.'}<br>${c.art}: <b>${fmt(c.ans)}</b>` : `Nur die letzte Stelle ändert sich.<br>${c.art}: <b>${fmt(c.ans)}</b>`);
            return;
          }
          // ordnen
          const zs = c.zahlen, ziel = c.art === 'kleinste' ? Math.min(...zs) : Math.max(...zs);
          api.say('Wir schreiben die Zahlen stellengerecht untereinander: Einer unter Einer, Tausender unter Tausender.');
          for (let r = 0; r < zs.length; r++) await trage(r, true);
          await api.wait(3200);
          const len = (z) => String(z).length, L = len(ziel);
          const gleichLang = zs.filter((z) => len(z) === L);
          api.say(`Zuerst die Stellen zählen: ${zs.map((z) => `${fmt(z)} hat ${len(z)}`).join(', ')}. ${c.art === 'kleinste' ? 'Weniger Stellen heißt kleiner.' : 'Mehr Stellen heißt größer.'}`);
          zs.forEach((z, r) => { if (len(z) === L) hi(r, L - 1); });
          await api.wait(3800);
          if (gleichLang.length > 1) {
            let col = L - 1;
            while (col > 0 && new Set(gleichLang.map((z) => String(z)[L - 1 - col])).size === 1) col--;
            zs.forEach((z, r) => { hi(r, L - 1, false); if (len(z) === L) hi(r, col); });
            api.say(`Zwei Zahlen haben gleich viele Stellen. Dann vergleichen wir von links. Die erste Stelle, an der sie sich unterscheiden, ist die <b>${M.STELLEN[col]}stelle</b>: Sie entscheidet.`);
            await api.wait(3800);
          }
          info.textContent = fmt(ziel);
          api.say(`Die ${c.art} Zahl ist <b>${fmt(ziel)}</b>.`);
        },
      };
    },
  });

  // =====================================================
  // Brüche am Zahlenstrahl: ablesen, vergleichen, Bruch als Quotient
  // =====================================================
  reg('k5-bruchstrahl', {
    title: 'Brüche am Zahlenstrahl',
    titleFor: (ctx) => (ctx && ctx.mode === 'vgl' ? 'Brüche vergleichen: Welcher Streifen ist länger?' : ctx && ctx.mode === 'quot' ? 'Der Bruchstrich bedeutet „geteilt durch“' : 'Brüche am Zahlenstrahl'),
    viewBox: '0 0 360 170',
    create(api, ctx) {
      ctx = ctx || {};
      const frei = () => ({ mode: 'strahl', n: 3, d: 4, max: 2 });
      let c = wahl('k5-bruchstrahl', ctx, frei, (e) => ctx.mode !== 'vgl' || (e.a[1] === e.b[1]) === (ctx.a[1] === ctx.b[1]));
      let g;
      const X0 = 30, W = 300;
      function strahl(mitTeilung) {
        api.clear();
        const y = 92, X = (v) => X0 + (v / c.max) * W;
        g = { X, y };
        el('line', { x1: 14, y1: y, x2: 344, y2: y, class: 'axis' }, api.svg);
        el('path', { d: `M344 ${y - 4} l8 4 l-8 4z`, class: 'arrh' }, api.svg);
        for (let i = 0; i <= c.max; i++) {
          el('line', { x1: X(i), y1: y - 11, x2: X(i), y2: y + 11, class: 'axis' }, api.svg);
          el('text', { x: X(i), y: y + 30, class: 'ex-b', 'text-anchor': 'middle', text: i }, api.svg);
        }
        g.teil = el('g', { opacity: mitTeilung ? 1 : 0 }, api.svg);
        for (let i = 1; i < c.max * c.d; i++) if (i % c.d) el('line', { x1: X(i / c.d), y1: y - 6, x2: X(i / c.d), y2: y + 6, class: 'axis' }, g.teil);
        g.band = el('rect', { x: X(0), y: y - 4, width: 0, height: 8, rx: 3, class: 'barA' }, api.svg);
        g.pf = el('path', { d: `M${X(c.n / c.d)} ${y - 40} v24`, class: 'strahlpf' }, api.svg);
        g.lab = el('text', { x: X(c.n / c.d), y: y - 46, class: 'ex-b f1', 'text-anchor': 'middle', text: '?' }, api.svg);
        g.punkt = el('circle', { cx: X(0), cy: y, r: 7, class: 'pt', opacity: 0 }, api.svg);
        g.info = el('text', { x: 180, y: 160, class: 'ex-b f1', 'text-anchor': 'middle', text: '' }, api.svg);
      }
      const bruchText = (n, d) => `${n}/${d}`;
      function setze() {
        g.pf.setAttribute('d', `M${g.X(c.n / c.d)} ${g.y - 40} v24`); g.lab.setAttribute('x', g.X(c.n / c.d)); g.lab.textContent = bruchText(c.n, c.d);
        g.band.setAttribute('width', g.X(c.n / c.d) - g.X(0));
        const k = gcd(c.n, c.d), w = Math.floor(c.n / c.d);
        api.say(`${c.n} Schritte, jeder ist ${fr(1, c.d)}: ${fr(c.n, c.d)}${c.n % c.d === 0 ? ` = <b>${w}</b> (genau ${w === 1 ? 'ein Ganzes' : w + ' Ganze'})` : (k > 1 ? ` = ${fr(c.n / k, c.d / k)}` : '') + (c.n > c.d ? ` = ${w} ${fr((c.n % c.d) / k, c.d / k)}` : '')}`);
      }
      // Streifen für Vergleich
      function streifen(y, n, d, cls, name) {
        const o = { y, n, d };
        el('text', { x: 22, y: y + 19, class: 'ex-b', 'text-anchor': 'middle', text: name }, api.svg);
        el('rect', { x: 50, y, width: 280, height: 28, rx: 5, class: 'tz' }, api.svg);
        o.fill = el('rect', { x: 50, y, width: 0, height: 28, rx: 5, class: cls }, api.svg);
        o.lin = el('g', {}, api.svg);
        o.fein = el('g', { opacity: 0 }, api.svg);
        for (let i = 1; i < d; i++) el('line', { x1: 50 + (280 * i) / d, y1: y, x2: 50 + (280 * i) / d, y2: y + 28, class: 'tzl' }, o.lin);
        return o;
      }
      if (!ctx.mode) {
        const sl = api.slider({ label: 'Schritte (Zähler)', min: 1, max: c.max * c.d, value: c.n, onInput(v) { c.n = v; setze(); } });
        api.chips([2, 3, 4, 5, 8].map((d) => ({ label: `Nenner ${d}`, onClick() { c = { mode: 'strahl', d, n: Math.min(c.n, 2 * d), max: 2 }; sl.max = 2 * d; sl.value = c.n; api.replay(); } })));
      }
      return {
        reset() {
          api.sub(subText(ctx));
          if (c.mode === 'strahl') return strahl(false);
          api.clear(); g = {};
          if (c.mode === 'vgl') {
            g.a = streifen(22, c.a[0], c.a[1], 'barA', bruchText(...c.a));
            g.b = streifen(74, c.b[0], c.b[1], 'barB', bruchText(...c.b));
            g.marke = el('g', { opacity: 0 }, api.svg);
            [c.a, c.b].forEach((b) => el('line', { x1: 50 + (280 * b[0]) / b[1], y1: 14, x2: 50 + (280 * b[0]) / b[1], y2: 110, class: 'dash' }, g.marke));
            g.info = el('text', { x: 180, y: 150, class: 'ex-b f1', 'text-anchor': 'middle', text: '' }, api.svg);
          } else {
            // quot: n Ganze, jedes in d Teile
            const h = Math.min(16, 100 / c.n);
            g.reihen = [];
            for (let r = 0; r < c.n; r++) {
              const y = 10 + r * (h + 3), teile = [];
              for (let j = 0; j < c.d; j++) teile.push(el('rect', { x: 40 + (j * 200) / c.d, y, width: 200 / c.d - 1.5, height: h, rx: 3, class: 'tz' }, api.svg));
              g.reihen.push(teile);
            }
            el('text', { x: 300, y: 60, class: 'ex-s', 'text-anchor': 'middle', text: `${c.n} Ganze` }, api.svg);
            el('text', { x: 300, y: 78, class: 'ex-s f6', 'text-anchor': 'middle', text: `${c.d} Kinder` }, api.svg);
            g.info = el('text', { x: 180, y: 160, class: 'ex-b f1', 'text-anchor': 'middle', text: '' }, api.svg);
          }
        },
        async play() {
          if (c.mode === 'strahl') {
            api.say('Auf dem Zahlenstrahl stehen zuerst nur die ganzen Zahlen. Wo liegt der Pfeil?');
            await api.wait(2800);
            show(g.teil, 1);
            api.say(`Die Strecke von 0 bis 1 ist in <b>${c.d} gleiche Teile</b> geteilt. Ein Schritt ist also ${fr(1, c.d)}. Das ist der <b>Nenner</b>.`);
            await api.wait(3800);
            show(g.punkt, 1);
            for (let i = 1; i <= c.n; i++) {
              await api.tw(400, (t) => { g.punkt.setAttribute('cx', lerp(g.X((i - 1) / c.d), g.X(i / c.d), t)); g.punkt.setAttribute('cy', g.y - 14 * Math.sin(Math.PI * t)); g.band.setAttribute('width', lerp(g.X((i - 1) / c.d), g.X(i / c.d), t) - g.X(0)); });
              g.info.textContent = `${i} ${i === 1 ? 'Schritt' : 'Schritte'}`;
              await api.wait(240);
            }
            g.lab.textContent = bruchText(c.n, c.d);
            g.info.textContent = `${c.n} Schritte von je 1/${c.d}`;
            const k = gcd(c.n, c.d);
            api.say(`Vom Anfang bis zum Pfeil sind es <b>${c.n} Schritte</b>. Das ist der <b>Zähler</b>.<br>→ ${fr(c.n, c.d)}${k > 1 ? ` (gekürzt ${fr(c.n / k, c.d / k)})` : ''}${c.n > c.d ? `<br><small>Der Pfeil liegt hinter der 1: Der Bruch ist größer als ein Ganzes.</small>` : ''}`);
            return;
          }
          if (c.mode === 'vgl') {
            const [a, b] = [c.a, c.b];
            api.say(`Beide Streifen sind gleich lang: Jeder ist <b>ein Ganzes</b>. Oben teilen wir in ${a[1]} Teile, unten in ${b[1]} Teile.`);
            await api.wait(3400);
            await api.tw(900, (t) => { g.a.fill.setAttribute('width', (280 * a[0] * t) / a[1]); g.b.fill.setAttribute('width', (280 * b[0] * t) / b[1]); });
            api.say(`Oben färben wir ${a[0]} von ${a[1]} Teilen, unten ${b[0]} von ${b[1]}. Welcher gefärbte Streifen reicht weiter nach rechts?`);
            await api.wait(3200);
            show(g.marke, 1);
            const l = a[0] * b[1], r = b[0] * a[1], zeichen = l < r ? '<' : l > r ? '>' : '=';
            const h = (a[1] * b[1]) / gcd(a[1], b[1]);
            if (a[1] !== b[1] && a[0] !== b[0] && h <= 24) {
              await api.wait(1600);
              for (const s of [g.a, g.b]) { for (let i = 1; i < h; i++) el('line', { x1: 50 + (280 * i) / h, y1: s.y, x2: 50 + (280 * i) / h, y2: s.y + 28, class: 'tzl fein' }, s.fein); show(s.fein, 1); }
              api.say(`Zum Nachrechnen teilen wir beide Streifen gleich fein, in <b>${h} Teile</b> (gleichnamig machen):<br>${fr(a[0], a[1])} = ${fr((a[0] * h) / a[1], h)} und ${fr(b[0], b[1])} = ${fr((b[0] * h) / b[1], h)}`);
              await api.wait(4600);
            } else await api.wait(1800);
            g.info.textContent = `${bruchText(...a)} ${zeichen} ${bruchText(...b)}`;
            api.say(`${zeichen === '=' ? 'Beide Streifen enden an derselben Stelle: Die Brüche sind <b>gleich groß</b>.' : `Der ${zeichen === '>' ? 'obere' : 'untere'} Streifen reicht weiter.`}<br>${fr(a[0], a[1])} <b>${zeichen}</b> ${fr(b[0], b[1])}${a[1] === b[1] ? '<br><small>Gleicher Nenner: Der größere Zähler gewinnt.</small>' : a[0] === b[0] ? '<br><small>Gleicher Zähler: Der kleinere Nenner gewinnt, denn seine Teile sind größer.</small>' : ''}`);
            return;
          }
          // quot
          api.say(`<b>${c.n} : ${c.d}</b> heißt: ${c.n} Ganze gerecht an ${c.d} Kinder verteilen. Wir teilen <b>jedes</b> Ganze in ${c.d} gleiche Teile.`);
          await api.wait(3800);
          for (const reihe of g.reihen) { reihe[0].setAttribute('class', 'tz hi'); await api.wait(380); }
          g.info.textContent = `${c.n} · 1/${c.d} = ${c.n}/${c.d}`;
          api.say(`Das erste Kind nimmt sich von jedem Ganzen ein Teil: ${c.n} Teile, jedes ist ${fr(1, c.d)}. Das sind zusammen ${fr(c.n, c.d)}.`);
          await api.wait(4200);
          api.say(`Jedes Kind bekommt gleich viel. Also gilt:<br><b>${c.n} : ${c.d} = ${fr(c.n, c.d)}</b><br><small>Der Bruchstrich bedeutet „geteilt durch“.</small>`);
        },
      };
    },
  });

  // =====================================================
  // Senkrecht & parallel
  // =====================================================
  reg('k5-lage', {
    title: 'Senkrecht und parallel: das Schrittmuster',
    titleFor: (ctx) => (ctx && ctx.mode === 'abstand' ? 'Abstand: der kürzeste Weg zur Geraden' : 'Senkrecht und parallel: das Schrittmuster'),
    viewBox: '0 0 284 220',
    create(api, ctx) {
      ctx = ctx || {};
      const { gx, gy } = M.lageGitter;
      const frei = (art) => aehnlich('k5-lage', { mode: 'paar' }, (e) => e.art === (art || 'parallel') && e.s1[0] !== e.s1[2] && e.s1[1] !== e.s1[3] && !(e.d1[0] === 1 && e.d1[1] === 0 && e.s1[0] === 1 && e.s1[2] === 9));
      let c = wahl('k5-lage', ctx, () => frei(), (e) => (ctx.mode !== 'paar' || e.art === ctx.art) && (ctx.mode !== 'abstand' || !!e.zwei === !!ctx.zwei) && (ctx.mode !== 'figur' || e.frage === ctx.frage));
      let g;
      const FARBE = ['var(--c2)', 'var(--c1)'];
      const strich = (s, i, name) => {
        el('line', { x1: gx(s[0]), y1: gy(s[1]), x2: gx(s[2]), y2: gy(s[3]), style: `stroke:${FARBE[i]};stroke-width:3.5;stroke-linecap:round` }, api.svg);
        el('text', { x: gx(s[2]) + 6, y: Math.max(16, gy(s[3]) - 5), class: 'ex-b', style: `fill:${FARBE[i]}`, text: name }, api.svg);
      };
      // Schritt-Dreieck: von (x, y) erst dx nach rechts, dann dy nach oben/unten
      function treppe(s, d, i) {
        const [x, y] = [s[0], s[1]];
        const grp = el('g', { opacity: 0 }, api.svg);
        if (d[0]) el('line', { x1: gx(x), y1: gy(y), x2: gx(x + d[0]), y2: gy(y), style: `stroke:${FARBE[i]};stroke-width:2;stroke-dasharray:4 3` }, grp);
        if (d[1]) el('line', { x1: gx(x + d[0]), y1: gy(y), x2: gx(x + d[0]), y2: gy(y + d[1]), style: `stroke:${FARBE[i]};stroke-width:2;stroke-dasharray:4 3` }, grp);
        if (d[0]) el('text', { x: gx(x + d[0] / 2), y: gy(y) + (d[1] > 0 ? 14 : -5), class: 'ex-s', 'text-anchor': 'middle', style: `fill:${FARBE[i]}`, text: d[0] }, grp);
        if (d[1]) el('text', { x: gx(x + d[0]) + 5, y: gy(y + d[1] / 2) + 4, class: 'ex-s', style: `fill:${FARBE[i]}`, text: Math.abs(d[1]) }, grp);
        return grp;
      }
      if (!ctx.mode) api.chips([['parallel', 'parallel'], ['senkrecht', 'senkrecht'], ['weder', 'weder noch']].map(([art, label]) => ({ label, onClick() { c = frei(art); api.replay(); } })));
      return {
        reset() {
          api.clear(); api.sub(subText(ctx)); g = {};
          for (let i = 0; i <= 10; i++) el('line', { x1: gx(i), y1: gy(0), x2: gx(i), y2: gy(8), class: 'grid' }, api.svg);
          for (let j = 0; j <= 8; j++) el('line', { x1: gx(0), y1: gy(j), x2: gx(10), y2: gy(j), class: 'grid' }, api.svg);
          if (c.mode === 'figur') {
            const P = c.pts.map((p) => [gx(p[0]), gy(p[1])]);
            el('polygon', { points: P.map((p) => p.join(',')).join(' '), style: 'fill:#d9e6ff;stroke:var(--c2);stroke-width:3;stroke-linejoin:round' }, api.svg);
            g.P = P; g.mark = el('g', {}, api.svg);
            g.info = el('text', { x: 142, y: 214, class: 'ex-b f1', 'text-anchor': 'middle', text: '' }, api.svg);
            return;
          }
          if (c.mode === 'abstand') {
            const s = c.waag ? [0, c.k, 10, c.k] : [c.k, 0, c.k, 8];
            strich(s, 0, 'g');
            if (c.zwei !== undefined) strich(c.waag ? [0, c.zwei, 10, c.zwei] : [c.zwei, 0, c.zwei, 8], 1, 'h');
            const fuss = c.waag ? [c.px, c.k] : [c.k, c.py];
            g.fuss = fuss;
            // zwei schräge Wege und der senkrechte
            const lim = c.waag ? 10 : 8;
            const neben = [-3, 3].map((o) => { const v = (c.waag ? c.px : c.py) + o; return Math.max(0, Math.min(lim, v)); });
            g.schraeg = neben.map((v) => el('line', { x1: gx(c.px), y1: gy(c.py), x2: gx(c.waag ? v : c.k), y2: gy(c.waag ? c.k : v), class: 'dash', opacity: 0 }, api.svg));
            g.lot = el('line', { x1: gx(c.px), y1: gy(c.py), x2: gx(c.px), y2: gy(c.py), style: 'stroke:var(--c1);stroke-width:3.5;stroke-linecap:round' }, api.svg);
            const q = 9, sx = c.waag ? 1 : Math.sign(c.px - c.k), sy = c.waag ? Math.sign(c.py - c.k) : 1;
            g.winkel = el('path', { d: `M${gx(fuss[0]) + q * sx} ${gy(fuss[1])} v${-q * sy} h${-q * sx}`, style: 'fill:none;stroke:var(--ink);stroke-width:1.6', opacity: 0 }, api.svg);
            el('circle', { cx: gx(c.px), cy: gy(c.py), r: 6, class: 'pt' }, api.svg);
            if (c.zwei === undefined) el('text', { x: gx(c.px) + 8, y: gy(c.py) - 8, class: 'ptl', text: 'P' }, api.svg);
            return;
          }
          strich(c.s1, 0, 'g'); strich(c.s2, 1, 'h');
          g.t1 = treppe(c.s1, c.d1, 0); g.t2 = treppe(c.s2, c.d2, 1);
        },
        async play() {
          if (c.mode === 'figur') {
            const info = M.figurInfo(c.pts), n = c.pts.length, P = g.P;
            const seite = (i, farbe) => el('line', { x1: P[i][0], y1: P[i][1], x2: P[(i + 1) % n][0], y2: P[(i + 1) % n][1], style: `stroke:${farbe};stroke-width:6;stroke-linecap:round` }, g.mark);
            const mu = (d) => M.lageMuster(d[0] < 0 || (d[0] === 0 && d[1] < 0) ? [-d[0], -d[1]] : d);
            if (c.frage === 'par') {
              api.say('Zwei Seiten sind <b>parallel</b>, wenn sie dasselbe Schrittmuster haben. Wir prüfen die Seiten der Reihe nach.');
              await api.wait(3600);
              if (!info.paare.length) { api.say('Jede Seite läuft in eine andere Richtung. Keine zwei Seiten haben dasselbe Schrittmuster.<br>→ <b>0</b> Paare paralleler Seiten'); g.info.textContent = '0 Paare'; return; }
              let k = 0;
              for (const [i, j] of info.paare) {
                g.mark.innerHTML = ''; seite(i, 'var(--c1)'); seite(j, 'var(--c1)'); k++;
                g.info.textContent = `${k} ${k === 1 ? 'Paar' : 'Paare'}`;
                api.say(`Diese beiden Seiten haben dasselbe Schrittmuster (${mu(info.seiten[i])}): Sie sind parallel. Das ist Paar Nummer <b>${k}</b>.`);
                await api.wait(3400);
              }
              g.mark.innerHTML = '';
              const farben = ['var(--c1)', 'var(--c3)', 'var(--c4)'];
              info.paare.forEach(([i, j], q) => { seite(i, farben[q % 3]); seite(j, farben[q % 3]); });
              api.say(`Gleiche Farbe heißt parallel.<br>→ <b>${k}</b> ${k === 1 ? 'Paar paralleler Seiten' : 'Paare paralleler Seiten'}`);
              return;
            }
            api.say('Ein <b>rechter Winkel</b> sieht aus wie die Ecke eines Kästchens: Die beiden Seiten stehen senkrecht aufeinander. Wir prüfen jede Ecke.');
            await api.wait(3600);
            let k = 0;
            for (const i of info.rechte) {
              const a = [P[(i + n - 1) % n][0] - P[i][0], P[(i + n - 1) % n][1] - P[i][1]], b = [P[(i + 1) % n][0] - P[i][0], P[(i + 1) % n][1] - P[i][1]];
              const la = Math.hypot(...a), lb = Math.hypot(...b), q = 11;
              const u = [(a[0] / la) * q, (a[1] / la) * q], w = [(b[0] / lb) * q, (b[1] / lb) * q];
              el('path', { d: `M${P[i][0] + u[0]} ${P[i][1] + u[1]} l${w[0]} ${w[1]} l${-u[0]} ${-u[1]}`, style: 'fill:none;stroke:var(--c1);stroke-width:2.6' }, g.mark);
              el('circle', { cx: P[i][0] + (u[0] + w[0]) / 2, cy: P[i][1] + (u[1] + w[1]) / 2, r: 1.6, style: 'fill:var(--c1)' }, g.mark);
              k++; g.info.textContent = `${k} ${k === 1 ? 'rechter Winkel' : 'rechte Winkel'}`;
              await api.wait(900);
            }
            if (!k) g.info.textContent = '0 rechte Winkel';
            api.say(k ? `An ${k === 1 ? 'dieser Ecke' : 'diesen ' + k + ' Ecken'} stehen die Seiten senkrecht aufeinander. Die anderen Ecken sind spitz oder stumpf.<br>→ <b>${k}</b> ${k === 1 ? 'rechter Winkel' : 'rechte Winkel'}`.replace('Die anderen Ecken sind spitz oder stumpf.', k === n ? 'Das gilt für alle Ecken.' : 'Die anderen Ecken sind spitz oder stumpf.') : 'An keiner Ecke stehen die Seiten senkrecht aufeinander: Alle Ecken sind spitz oder stumpf.<br>→ <b>0</b> rechte Winkel');
            return;
          }
          if (c.mode === 'abstand') {
            const ab = c.waag ? Math.abs(c.py - c.k) : Math.abs(c.px - c.k);
            if (c.zwei !== undefined) {
              api.say('Der Abstand zweier paralleler Geraden wird <b>senkrecht</b> zu ihnen gemessen. Wir starten an einem Punkt auf h.');
              await api.wait(3200);
              await api.tw(800, (t) => { g.lot.setAttribute('x2', lerp(gx(c.px), gx(g.fuss[0]), t)); g.lot.setAttribute('y2', lerp(gy(c.py), gy(g.fuss[1]), t)); });
              show(g.winkel, 1);
              api.say(`Der senkrechte Weg von h zu g ist <b>${ab} Kästchen</b> lang.<br><small>Weil die Geraden parallel sind, ist der Abstand an jeder Stelle gleich.</small>`);
              return;
            }
            api.say('Von P führen viele Wege zur Geraden g. Welcher ist der kürzeste?');
            await api.wait(2600);
            g.schraeg.forEach((l) => show(l, 1));
            api.say('Schräge Wege sind Umwege: Sie sind immer länger.');
            await api.wait(2800);
            await api.tw(800, (t) => { g.lot.setAttribute('x2', lerp(gx(c.px), gx(g.fuss[0]), t)); g.lot.setAttribute('y2', lerp(gy(c.py), gy(g.fuss[1]), t)); });
            show(g.winkel, 1);
            api.say(`Der kürzeste Weg trifft die Gerade <b>senkrecht</b>, also im rechten Winkel. Seine Länge heißt <b>Abstand</b>.<br>Hier: <b>${ab} Kästchen</b>`);
            return;
          }
          const mu = M.lageMuster;
          api.say('Auf Kästchenpapier kannst du jede Gerade mit einem <b>Schrittmuster</b> beschreiben: so viele Kästchen nach rechts, so viele nach oben oder unten.');
          await api.wait(4200);
          show(g.t1, 1);
          api.say(`<b style="color:var(--c2)">g</b>: ${mu(c.d1)}.`);
          await api.wait(2800);
          show(g.t2, 1);
          api.say(`<b style="color:var(--c2)">g</b>: ${mu(c.d1)}.<br><b style="color:var(--c1)">h</b>: ${mu(c.d2)}.`);
          await api.wait(3600);
          const gerade = c.d1[0] * c.d1[1] === 0;
          api.say(c.art === 'parallel' ? 'Beide Geraden haben <b>dasselbe Schrittmuster</b>. Sie laufen in dieselbe Richtung und haben überall denselben Abstand. Sie schneiden sich nie.<br>→ <b>parallel</b> (g ∥ h)'
            : c.art === 'senkrecht' ? `${gerade ? 'Eine Gerade läuft genau waagerecht, die andere genau senkrecht nach oben.' : 'Die beiden Zahlen haben die <b>Plätze getauscht</b>, und eine Richtung ist umgekehrt. Das ist genau eine Vierteldrehung.'} Die Geraden bilden einen <b>rechten Winkel</b>.<br>→ <b>senkrecht</b> (g ⊥ h)`
              : 'Die Schrittmuster sind verschieden, und es ist auch keine Vierteldrehung. Die Geraden schneiden sich irgendwo, aber nicht im rechten Winkel.<br>→ <b>weder parallel noch senkrecht</b>');
        },
      };
    },
  });

  // =====================================================
  // Winkel messen mit dem Geodreieck
  // =====================================================
  reg('k5-winkelmessen', {
    title: 'Winkel messen mit dem Geodreieck',
    titleFor: (ctx) => (ctx && ctx.art === 'ueber' ? 'Überstumpfe Winkel: Rest zum vollen Kreis' : ctx && ctx.art === 'schaetz' ? 'Winkel schätzen und nachmessen' : 'Winkel messen mit dem Geodreieck'),
    viewBox: '0 0 340 196',
    create(api, ctx) {
      ctx = ctx || {};
      const frei = () => ({ mode: 'geo', th: 55, links: false, art: 'lesen' });
      let c = wahl('k5-winkelmessen', ctx, frei, (e) => e.art === ctx.art && e.th !== ctx.th);
      const GEO = M.GEO, gpt = M.geoPt;
      let g;
      const bogen = (von, bis, r) => { let d = ''; const n = Math.max(2, Math.ceil(Math.abs(bis - von) / 4)); for (let i = 0; i <= n; i++) { const [x, y] = gpt(von + ((bis - von) * i) / n, r); d += (i ? 'L' : 'M') + x.toFixed(1) + ' ' + y.toFixed(1); } return d; };
      const art = (th) => (th < 90 ? 'spitz' : th === 90 ? 'ein rechter Winkel' : 'stumpf');
      function lies() {
        api.say(`Der blaue Schenkel liegt ${c.links ? 'links' : 'rechts'}: Wir lesen die <b>${c.links ? 'innere' : 'äußere'}</b> Skala. Der orange Schenkel zeigt auf <b>${c.th}°</b>. Der Winkel ist ${art(c.th)}.`);
      }
      if (!ctx.mode) {
        api.slider({ label: 'Winkel', min: 2, max: 34, value: c.th / 5, onInput(v) { c.th = v * 5; zeichne(true); lies(); } });
        api.chips([{ label: 'Seite wechseln', onClick() { c.links = !c.links; api.replay(); } }]);
      }
      function zeichne(mitGeo) {
        api.clear(); g = {};
        if (c.art === 'ueber') {
          // eigenes Bild: Scheitel in der Mitte
          const cx = 170, cy = 104, r = 78, P = (grad, rr) => [cx + rr * Math.cos((grad * Math.PI) / 180), cy - rr * Math.sin((grad * Math.PI) / 180)];
          const kreis = (von, bis, rr) => { let d = ''; const n = Math.ceil((bis - von) / 4); for (let i = 0; i <= n; i++) { const [x, y] = P(von + ((bis - von) * i) / n, rr); d += (i ? 'L' : 'M') + x.toFixed(1) + ' ' + y.toFixed(1); } return d; };
          g.kreis = kreis;
          el('line', { x1: cx, y1: cy, x2: P(0, r)[0], y2: P(0, r)[1], class: 'ray', style: 'stroke:var(--c2)' }, api.svg);
          el('line', { x1: cx, y1: cy, x2: P(c.th, r)[0], y2: P(c.th, r)[1], class: 'ray', style: 'stroke:var(--c1)' }, api.svg);
          g.klein = el('path', { d: kreis(0, c.th, 30), style: 'fill:none;stroke:var(--c3);stroke-width:3', opacity: 0 }, api.svg);
          g.gross = el('path', { d: '', style: 'fill:none;stroke:var(--c1);stroke-width:3' }, api.svg);
          const m = P(c.th / 2, 48), m2 = P(c.th + (360 - c.th) / 2, 62);
          g.tk = el('text', { x: m[0], y: m[1] + 5, class: 'ex-s f3', 'text-anchor': 'middle', opacity: 0, text: c.th + '°' }, api.svg);
          g.tg = el('text', { x: m2[0], y: m2[1] + 5, class: 'ex-b f1', 'text-anchor': 'middle', text: '?' }, api.svg);
          g.info = el('text', { x: 170, y: 190, class: 'ex-b f1', 'text-anchor': 'middle', text: '' }, api.svg);
          return;
        }
        g.recht = el('line', { x1: GEO.cx, y1: GEO.cy, x2: GEO.cx, y2: GEO.cy - 150, class: 'dash', opacity: 0 }, api.svg);
        g.schenkel = el('g', {}, api.svg);
        g.schenkel.innerHTML = M.winkelSchenkel(c.th, c.links, !mitGeo);
        g.geo = el('g', { opacity: mitGeo ? 1 : 0 }, api.svg);
        g.geo.innerHTML = M.geoDreieck();
        g.sweep = el('path', { d: '', style: 'fill:none;stroke:var(--c1);stroke-width:5;stroke-linecap:round;opacity:.75' }, api.svg);
        g.info = el('text', { x: c.links ? 332 : 8, y: 20, class: 'ex-b f1', 'text-anchor': c.links ? 'end' : 'start', text: mitGeo ? c.th + '°' : '' }, api.svg);
      }
      return {
        reset() { api.sub(subText(ctx)); zeichne(false); },
        async play() {
          if (c.art === 'ueber') {
            api.say('Ein <b>überstumpfer</b> Winkel ist größer als 180°. Das Geodreieck reicht aber nur bis 180°.');
            await api.wait(3400);
            show(g.klein, 1); show(g.tk, 1);
            api.say(`Der Trick: Wir messen den Winkel auf der <b>anderen Seite</b>. Er ist ${c.th}° groß.`);
            await api.wait(3400);
            await api.tw(1400, (t) => { g.gross.setAttribute('d', g.kreis(c.th, c.th + (360 - c.th) * t, 40)); });
            g.tg.textContent = 360 - c.th + '°';
            g.info.textContent = `360° − ${c.th}° = ${360 - c.th}°`;
            api.say(`Beide Winkel zusammen sind ein voller Kreis, also 360°.<br>360° − ${c.th}° = <b>${360 - c.th}°</b>`);
            return;
          }
          const a0 = c.links ? 180 : 0, a1 = c.links ? 180 - c.th : c.th;
          if (c.art === 'schaetz') {
            show(g.recht, 1);
            api.say(`Erst schätzen: Die gestrichelte Linie zeigt einen rechten Winkel (90°). Unser Winkel ist <b>${c.th < 90 ? 'kleiner' : 'größer'}</b>, also ${art(c.th)}.`);
            await api.wait(4000);
            api.say('Jetzt messen wir nach.');
            await api.wait(1400);
          } else if (c.art === 'zwei') {
            api.say(`Am Schenkel stehen immer zwei Zahlen: ${Math.min(c.th, 180 - c.th)} und ${Math.max(c.th, 180 - c.th)}. Zusammen ergeben sie 180. Welche gilt?`);
            await api.wait(3600);
          }
          api.say('Geodreieck anlegen: Der <b>Nullpunkt</b> (Mitte der langen Kante) kommt genau auf den Scheitel. Die lange Kante liegt auf dem blauen Schenkel.');
          await api.tw(900, (t) => { show(g.geo, t); g.geo.setAttribute('transform', `translate(0 ${-36 * (1 - t)})`); });
          g.schenkel.innerHTML = M.winkelSchenkel(c.th, c.links, false);
          show(g.recht, 0);
          await api.wait(3400);
          api.say(`Wir zählen vom blauen Schenkel aus. Er liegt ${c.links ? 'links' : 'rechts'}, dort beginnt die <b>${c.links ? 'innere' : 'äußere'} Skala</b> mit 0.`);
          await api.wait(3000);
          await api.tw(1500, (t) => { g.sweep.setAttribute('d', bogen(a0, a0 + (a1 - a0) * t, 95)); g.info.textContent = Math.round((c.th * t) / 5) * 5 + '°'; });
          g.info.textContent = c.th + '°';
          api.say(`Der orange Schenkel zeigt auf dieser Skala auf <b>${c.th}°</b>.<br><small>Probe: Der Winkel ist ${art(c.th)}${c.th === 90 ? '' : `, also ${c.th < 90 ? 'kleiner' : 'größer'} als 90°`}. Das passt zu ${c.th}°${c.th === 90 ? '' : ` und nicht zu ${180 - c.th}°`}.</small>`);
        },
      };
    },
  });
})();
