/* MaDax (Mathe) – Erklär-Animationen zu den Themen aus generatoren/klasse5-luecken.js
 *
 * Aufbau wie in klasse5.js: { title, viewBox, create(api, ctx) → { reset(), play() } }
 * ctx ist das ex-Objekt der Aufgabe plus pre:true (ähnliches Beispiel) oder post:true (genau die Aufgabe).
 */
(function () {
  const M = window.Mathelix;
  const U = M.util, EX = M.explainers;
  const { el, arcD } = M.exUtil;
  const { fmt, R, pick, fr } = U;
  const reg = (id, def) => (EX[id] = def);
  const lerp = (a, b, t) => a + (b - a) * t;
  const themen = () => M.grades[5].lbs.flatMap((l) => l.topics);
  // Ein ähnliches Beispiel: eine neue Aufgabe desselben Themas mit derselben Art (und anderen Zahlen)
  function aehnlich(id, ctx, gleich) {
    const gen = themen().find((t) => t.id === id).gen;
    for (let i = 0; i < 200; i++) {
      const e = gen().ex;
      if (e && e.mode === ctx.mode && (!gleich || gleich(e))) return e;
    }
    return ctx;
  }
  const subText = (ctx) => (ctx.post ? 'Lösung zu deiner Aufgabe' : ctx.pre ? 'Ein ähnliches Beispiel – deine Aufgabe löst du danach selbst' : '');
  const show = (e, t) => e.setAttribute('opacity', t);

  // =====================================================
  // Überschlagen: erst runden, dann rechnen, dann mit dem genauen Ergebnis vergleichen
  // =====================================================
  reg('k5-ueberschlag', {
    title: 'Überschlagen: erst runden, dann rechnen',
    viewBox: '0 0 360 170',
    create(api, ctx) {
      ctx = ctx || {};
      let c;
      const neu = () => { const a = R(21, 89) * 100 + R(11, 89), b = R(11, 79) * 100 + R(11, 89); c = { mode: 'ueber', a, b, op: '+', ra: Math.round(a / 1000) * 1000, rb: Math.round(b / 1000) * 1000 }; c.est = c.ra + c.rb; c.exact = a + b; };
      if (ctx.mode === 'ueber' && ctx.post) c = ctx;
      else if (ctx.mode === 'ueber' && ctx.pre) c = aehnlich('k5-ueberschlag', ctx, (e) => !!e.geld === !!ctx.geld && (e.geld || e.op === ctx.op));
      else { neu(); api.chips([{ label: 'Neue Zahlen', onClick() { neu(); api.replay(); } }]); }
      let g;
      return {
        reset() {
          api.clear(); api.sub(subText(ctx)); g = {};
          if (c.geld) {
            g.preise = c.preise.map((p, i) => {
              const x = 50 + i * (260 / (c.preise.length - 1 || 1));
              const t = el('text', { x, y: 40, class: 'ex-b', 'text-anchor': 'middle', text: `${Math.floor(p / 100)},${String(p % 100).padStart(2, '0')} €` }, api.svg);
              const r = el('text', { x, y: 78, class: 'ex-b f1', 'text-anchor': 'middle', opacity: 0, text: `${Math.round(p / 100)} €` }, api.svg);
              const pf = el('text', { x, y: 60, class: 'ex-s f6', 'text-anchor': 'middle', opacity: 0, text: '↓' }, api.svg);
              return { t, r, pf };
            });
          } else {
            g.oben = el('text', { x: 180, y: 38, class: 'ex-b', 'text-anchor': 'middle', text: `${fmt(c.a)} ${c.op} ${fmt(c.b)}` }, api.svg);
            g.pf = el('text', { x: 180, y: 62, class: 'ex-s f6', 'text-anchor': 'middle', opacity: 0, text: '↓ runden ↓' }, api.svg);
            g.unten = el('text', { x: 180, y: 88, class: 'ex-b f1', 'text-anchor': 'middle', opacity: 0, text: `${fmt(c.ra)} ${c.op} ${fmt(c.rb)}` }, api.svg);
          }
          // Vergleichsbalken
          g.bars = el('g', { opacity: 0 }, api.svg);
          const max = c.geld ? Math.max(c.summe / 100, c.ueber, c.budget) : Math.max(c.est, c.exact);
          const W = (v) => 230 * (v / max);
          const zeile = (y, name, v, cls, txt) => { el('text', { x: 22, y: y + 12, class: 'ex-s', text: name }, g.bars); el('rect', { x: 110, y, width: W(v), height: 14, rx: 4, class: cls }, g.bars); el('text', { x: 114, y: y + 12, class: 'ex-xs', text: txt }, g.bars); };
          if (c.geld) { zeile(104, 'Überschlag', c.ueber, 'barA', c.ueber + ' €'); zeile(124, 'genau', c.summe / 100, 'barB', fmt(c.summe / 100) + ' €'); zeile(144, 'Geld', c.budget, 'barC', c.budget + ' €'); }
          else { zeile(112, 'Überschlag', c.est, 'barA', fmt(c.est)); zeile(134, 'genau', c.exact, 'barB', fmt(c.exact)); }
        },
        async play() {
          if (c.geld) {
            api.say('Reicht das Geld? Dafür musst du nicht genau rechnen. Runde jeden Preis auf <b>ganze Euro</b>.');
            await api.wait(2600);
            for (const p of g.preise) { await api.tw(350, (t) => { show(p.r, t); show(p.pf, t); }); await api.wait(500); }
            api.say(`Zusammen: ${c.preise.map((p) => Math.round(p / 100)).join(' + ')} = <b>${c.ueber} €</b>`);
            await api.wait(2600);
            await api.tw(500, (t) => show(g.bars, t));
            api.say(`${c.ueber} € ist ${c.ueber <= c.budget ? 'weniger' : 'mehr'} als ${c.budget} € → Das Geld reicht <b>${c.summe <= c.budget * 100 ? '' : 'nicht'}</b>.<br><small>Genau gerechnet sind es ${fmt(c.summe / 100)} €. Der Überschlag hat für die Entscheidung gereicht.</small>`);
            return;
          }
          api.say(`<b>${fmt(c.a)} ${c.op} ${fmt(c.b)}</b> genau zu rechnen dauert. Für einen Überschlag machst du die Zahlen erst <b>glatt</b>.`);
          await api.wait(3000);
          await api.tw(400, (t) => show(g.pf, t));
          await api.tw(500, (t) => show(g.unten, t));
          api.say(`${fmt(c.a)} ≈ <b>${fmt(c.ra)}</b> und ${fmt(c.b)} ≈ <b>${fmt(c.rb)}</b>`);
          await api.wait(2800);
          g.unten.textContent = `${fmt(c.ra)} ${c.op} ${fmt(c.rb)} = ${fmt(c.est)}`;
          api.say(`Das geht im Kopf: ${fmt(c.ra)} ${c.op} ${fmt(c.rb)} = <b>${fmt(c.est)}</b>`);
          await api.wait(2800);
          await api.tw(500, (t) => show(g.bars, t));
          api.say(`Genau gerechnet kommt <b>${fmt(c.exact)}</b> heraus, überschlagen <b>${fmt(c.est)}</b>. ${U.ueberNah(c.est, c.exact)}<br><small>Überschlage vor jeder schriftlichen Rechnung. Weicht dein Ergebnis stark ab, hast du dich verrechnet.</small>`);
        },
      };
    },
  });

  // =====================================================
  // Schriftlich rechnen: Stelle für Stelle von rechts, mit Überträgen
  // =====================================================
  const STELLEN = ['Einer', 'Zehner', 'Hunderter', 'Tausender', 'Zehntausender', 'Hunderttausender', 'Million'];
  reg('k5-schriftlich', {
    title: 'Schriftlich rechnen: Stelle für Stelle',
    viewBox: '0 0 360 190',
    create(api, ctx) {
      ctx = ctx || {};
      let c;
      const neu = (op) => { c = op === '·' ? { mode: 'schr', op: '·', a: R(123, 987), b: R(3, 9) } : { mode: 'schr', op: '+', nums: [R(1200, 8900), R(180, 980)] }; };
      if (ctx.mode === 'schr' && ctx.post) c = ctx;
      else if (ctx.mode === 'schr' && ctx.pre) c = aehnlich('k5-schriftlich', ctx, (e) => e.op === ctx.op);
      else { neu('+'); api.chips([{ label: 'Plus', onClick() { neu('+'); api.replay(); } }, { label: 'Mal', onClick() { neu('·'); api.replay(); } }]); }
      const CW = 24, RX = 250; // Spaltenbreite, rechte Kante
      const X = (i) => RX - i * CW - CW / 2; // i = Stelle von rechts (0 = Einer)
      let g;
      // Zahl stellengerecht in eine Zeile schreiben
      const zahl = (n, y, cls, parent) => String(n).split('').reverse().map((z, i) => el('text', { x: X(i), y, class: cls || 'ex-b', 'text-anchor': 'middle', text: z }, parent || api.svg));
      function addSzene(nums, y0) {
        const len = String(nums.reduce((a, b) => a + b, 0)).length;
        nums.forEach((n, r) => zahl(n, y0 + r * 26));
        const yl = y0 + (nums.length - 1) * 26;
        el('text', { x: X(len) - 4, y: yl, class: 'ex-b', 'text-anchor': 'middle', text: '+' }, api.svg);
        el('line', { x1: X(len) - 18, y1: yl + 22, x2: RX + 4, y2: yl + 22, class: 'ray' }, api.svg);
        g.hl = el('rect', { x: 0, y: y0 - 22, width: CW, height: nums.length * 26 + 44, rx: 6, class: 'hl2', opacity: 0 }, api.svg);
        g.carryY = yl + 16; g.resY = yl + 48;
      }
      async function addSpiel(nums) {
        const st = U.addSchritte(nums);
        for (const s of st) {
          g.hl.setAttribute('x', X(s.i) - CW / 2); show(g.hl, 1);
          const teile = s.ds.filter((d, j) => String(nums[j]).length > s.i);
          api.say(`<b>${STELLEN[s.i]}:</b> ${teile.length ? teile.join(' + ') : '0'}${s.carryIn ? ' + ' + s.carryIn + ' (gemerkt)' : ''} = ${s.sum}${teile.length ? ` → schreibe <b>${s.digit}</b>${s.carry ? `, merke <b>${s.carry}</b>` : ''}` : ' → der Übertrag kommt nach vorn'}`);
          await api.wait(1500);
          const d = el('text', { x: X(s.i), y: g.resY, class: 'ex-b f1', 'text-anchor': 'middle', text: s.digit, opacity: 0 }, api.svg);
          await api.tw(300, (t) => show(d, t));
          if (s.carry) { const u = el('text', { x: X(s.i + 1), y: g.carryY, class: 'ex-xs', style: 'fill:var(--c2)', 'text-anchor': 'middle', text: s.carry, opacity: 0 }, api.svg); await api.tw(300, (t) => show(u, t)); }
          await api.wait(1300);
        }
        show(g.hl, 0);
      }
      return {
        reset() {
          api.clear(); api.sub(subText(ctx)); g = {};
          if (c.op === '+') addSzene(c.nums, 40);
          else if (c.op === '−') addSzene([c.a - c.b, c.b], 60);
          else if (c.op === '·') {
            g.fak = zahl(c.a, 50);
            el('text', { x: RX + 16, y: 50, class: 'ex-b', 'text-anchor': 'middle', text: '·' }, api.svg);
            g.b = el('text', { x: RX + 36, y: 50, class: 'ex-b f2', 'text-anchor': 'middle', text: c.b }, api.svg);
            el('line', { x1: X(String(c.a * c.b).length - 1) - 16, y1: 62, x2: RX + 48, y2: 62, class: 'ray' }, api.svg);
            g.hl = el('rect', { x: 0, y: 28, width: CW, height: 30, rx: 6, class: 'hl2', opacity: 0 }, api.svg);
          } else {
            const z = Math.floor(c.b / 10) * 10, e = c.b % 10;
            g.zeilen = [[`${fmt(c.a)} · ${c.b}`, 'ex-b'], [`${fmt(c.a)} · ${z} = ${fmt(c.a * z)}`, 'ex-b f2'], [`${fmt(c.a)} · ${e} = ${fmt(c.a * e)}`, 'ex-b f3'], [`${fmt(c.a * z)} + ${fmt(c.a * e)} = ${fmt(c.a * c.b)}`, 'ex-b f1']]
              .map(([t, cls], i) => el('text', { x: 180, y: 36 + i * 40, class: cls, 'text-anchor': 'middle', text: t, opacity: i ? 0 : 1 }, api.svg));
          }
        },
        async play() {
          if (c.op === '+') {
            api.say(`Die Zahlen stehen <b>stellengerecht</b> untereinander: Einer unter Einer, Zehner unter Zehner. Gerechnet wird <b>von rechts nach links</b>.`);
            await api.wait(3200);
            await addSpiel(c.nums);
            api.say(`Fertig: ${c.nums.map(fmt).join(' + ')} = <b>${fmt(c.nums.reduce((a, b) => a + b, 0))}</b><br><small>Mach vorher einen Überschlag. Dann merkst du sofort, ob das Ergebnis stimmen kann.</small>`);
          } else if (c.op === '−') {
            const d = c.a - c.b;
            api.say(`<b>${fmt(c.a)} − ${fmt(c.b)} = ${fmt(d)}</b>. Stimmt das? Die <b>Probe</b> geht mit Plus: Ergebnis + abgezogene Zahl muss wieder ${fmt(c.a)} ergeben.<br><small>Wie ihr in der Schule schriftlich minus rechnet (ergänzen oder entbündeln), übst du im Heft. Die Probe passt zu beiden Wegen.</small>`);
            await api.wait(5200);
            await addSpiel([d, c.b]);
            api.say(`${fmt(d)} + ${fmt(c.b)} = <b>${fmt(c.a)}</b> ✓ Die Probe stimmt, also ist <b>${fmt(c.a)} − ${fmt(c.b)} = ${fmt(d)}</b> richtig.`);
          } else if (c.op === '·') {
            api.say(`<b>${fmt(c.a)} · ${c.b}</b>: Multipliziere die <b>${c.b}</b> nacheinander mit jeder Ziffer, rechts beginnend.`);
            await api.wait(3000);
            const ds = String(c.a).split('').reverse().map(Number); let carry = 0;
            for (let i = 0; i < ds.length; i++) {
              const p = ds[i] * c.b + carry, last = i === ds.length - 1;
              g.hl.setAttribute('x', X(i) - CW / 2); show(g.hl, 1);
              api.say(`<b>${STELLEN[i]}:</b> ${c.b} · ${ds[i]}${carry ? ' + ' + carry + ' (gemerkt)' : ''} = ${p} → schreibe <b>${last ? p : p % 10}</b>${!last && p >= 10 ? `, merke <b>${Math.floor(p / 10)}</b>` : ''}`);
              await api.wait(1500);
              const out = last ? String(p).split('').reverse() : [String(p % 10)];
              for (let k = 0; k < out.length; k++) { const d = el('text', { x: X(i + k), y: 88, class: 'ex-b f1', 'text-anchor': 'middle', text: out[k], opacity: 0 }, api.svg); await api.tw(250, (t) => show(d, t)); }
              carry = Math.floor(p / 10);
              if (!last && carry) { const u = el('text', { x: X(i + 1), y: 110, class: 'ex-xs', style: 'fill:var(--c2)', 'text-anchor': 'middle', text: carry, opacity: 0 }, api.svg); await api.tw(250, (t) => show(u, t)); }
              await api.wait(1300);
            }
            show(g.hl, 0);
            api.say(`Fertig: ${fmt(c.a)} · ${c.b} = <b>${fmt(c.a * c.b)}</b>`);
          } else {
            const z = Math.floor(c.b / 10) * 10, e = c.b % 10;
            api.say(`<b>${fmt(c.a)} · ${c.b}</b>: Zerlege die ${c.b} in <b>${z}</b> und <b>${e}</b>. Dann sind es zwei leichtere Rechnungen.`);
            await api.wait(3400);
            await api.tw(400, (t) => show(g.zeilen[1], t));
            api.say(`Zuerst die Zehner: ${fmt(c.a)} · ${z} = <b>${fmt(c.a * z)}</b><br><small>Rechne ${fmt(c.a)} · ${z / 10} und hänge eine Null an.</small>`);
            await api.wait(3400);
            await api.tw(400, (t) => show(g.zeilen[2], t));
            api.say(`Dann die Einer: ${fmt(c.a)} · ${e} = <b>${fmt(c.a * e)}</b>`);
            await api.wait(3000);
            await api.tw(400, (t) => show(g.zeilen[3], t));
            api.say(`Beides zusammenzählen: ${fmt(c.a * z)} + ${fmt(c.a * e)} = <b>${fmt(c.a * c.b)}</b><br><small>Genau das passiert auch beim schriftlichen Multiplizieren: eine Zeile für die Zehner, eine für die Einer, dann addieren.</small>`);
          }
        },
      };
    },
  });

  // =====================================================
  // Dezimalzahlen runden: derselbe Zahlenstrahl wie beim Runden natürlicher Zahlen
  // =====================================================
  reg('k5-dezrunden', {
    title: 'Dezimalzahlen runden am Zahlenstrahl',
    viewBox: '0 0 360 170',
    create: (api, ctx) => EX['k5-runden'].create(api, ctx && ctx.mode === 'rund' ? ctx : { dez: true }),
  });

  // =====================================================
  // Gemischte Zahlen: Stücke zu Ganzen zusammenlegen
  // =====================================================
  reg('k5-gemischt', {
    title: 'Gemischte Zahlen: Stücke zu Ganzen legen',
    viewBox: '0 0 360 150',
    create(api, ctx) {
      ctx = ctx || {};
      let n, d;
      const neu = () => { d = pick([2, 3, 4, 5, 6]); n = R(d + 1, 4 * d - 1); if (n % d === 0) n++; };
      if (ctx.mode === 'gem' && ctx.post) { n = ctx.n; d = ctx.d; }
      else if (ctx.mode === 'gem' && ctx.pre) { const e = aehnlich('k5-gemischt', ctx, (x) => x.n !== ctx.n); n = e.n; d = e.d; }
      else neu();
      const CX = (i) => 44 + i * 68, CY = 62, RAD = 28;
      let st;
      function zeichne(k) {
        // k Stücke sind schon gelegt
        api.clear();
        const kreise = Math.ceil(n / d);
        for (let i = 0; i < kreise; i++) {
          el('circle', { cx: CX(i), cy: CY, r: RAD, class: 'gkreis' }, api.svg);
          for (let j = 0; j < d; j++) {
            const idx = i * d + j;
            if (idx < k) el('path', { d: arcD(CX(i), CY, RAD, 90 - (j + 1) * (360 / d), 90 - j * (360 / d), true), class: idx < Math.floor(k / d) * d ? 'wB' : 'wA' }, api.svg);
            else if (d > 1) { const a = ((90 - j * (360 / d)) * Math.PI) / 180; el('line', { x1: CX(i), y1: CY, x2: CX(i) + RAD * Math.cos(a), y2: CY - RAD * Math.sin(a), class: 'dash' }, api.svg); }
          }
          if (k >= (i + 1) * d) el('text', { x: CX(i), y: CY + RAD + 18, class: 'ex-s f1', 'text-anchor': 'middle', text: '1 Ganzes' }, api.svg);
        }
        st = el('text', { x: 180, y: 140, class: 'ex-b', 'text-anchor': 'middle', text: `${k} von ${n} Stücken gelegt` }, api.svg);
      }
      const ergebnis = () => `${fr(n, d)} = <b>${Math.floor(n / d)} ${fr(n % d, d)}</b>`;
      if (!ctx.mode) {
        const sl = api.slider({ label: 'Anzahl Stücke', min: d + 1, max: 5 * d - 1, value: n, onInput(v) { n = v % d === 0 ? v + 1 : v; zeichne(n); st.textContent = `${n} Stücke`; api.say(`${n} Stücke, jedes ist ${fr(1, d)}: ${ergebnis()}`); } });
        api.chips([{ label: 'Neues Beispiel', onClick() { neu(); sl.max = 5 * d - 1; sl.min = d + 1; sl.value = n; api.replay(); } }]);
      }
      return {
        reset() { api.sub(subText(ctx)); zeichne(0); },
        async play() {
          const w = Math.floor(n / d), r = n % d;
          if (ctx.back) {
            zeichne(n); st.textContent = `${w} Ganze und ${r} ${r === 1 ? 'Stück' : 'Stücke'}`;
            api.say(`<b>${w} ${fr(r, d)}</b> heißt: ${w} ${w === 1 ? 'Ganzes' : 'Ganze'} und dazu noch ${fr(r, d)}. Wie viele Stücke sind das zusammen?`);
            await api.wait(3600);
            api.say(`Jedes Ganze hat <b>${d} Stücke</b>. ${w} Ganze sind also ${w} · ${d} = <b>${w * d} Stücke</b>.`);
            await api.wait(3400);
            st.textContent = `${w * d} + ${r} = ${n} Stücke`;
            api.say(`Dazu kommen die ${r} einzelnen: ${w * d} + ${r} = <b>${n} Stücke</b>, jedes ist ${fr(1, d)}.<br>${w} ${fr(r, d)} = <b>${fr(n, d)}</b>`);
            return;
          }
          api.say(`${fr(n, d)} heißt: <b>${n} Stücke</b>, und jedes Stück ist ${fr(1, d)}. Wir legen sie zu Ganzen zusammen.`);
          await api.wait(3200);
          for (let k = 1; k <= n; k++) {
            zeichne(k);
            if (k % d === 0) { api.say(`${d} Stücke sind voll: das ist <b>1 Ganzes</b>.${k / d > 1 ? ` Schon ${k / d} Ganze.` : ''}`); await api.wait(1500); }
            else await api.wait(Math.max(160, 520 - n * 12));
          }
          st.textContent = `${w} ${w === 1 ? 'Ganzes' : 'Ganze'} und ${r} ${r === 1 ? 'Stück' : 'Stücke'}`;
          api.say(`${w} ${w === 1 ? 'Ganzes ist' : 'Ganze sind'} voll, ${r} ${r === 1 ? 'Stück bleibt' : 'Stücke bleiben'} übrig: ${ergebnis()}<br><small>Rechnung: ${n} : ${d} = ${w} Rest ${r}. Der Rest bleibt als Bruch stehen.</small>`);
        },
      };
    },
  });

  // =====================================================
  // Symmetrie & Spiegeln
  // =====================================================
  reg('k5-symmetrie', {
    title: 'Spiegeln: gleich weit auf die andere Seite',
    titleFor: (ctx) => (ctx && ctx.mode === 'achsen' ? 'Symmetrieachsen finden' : ctx && ctx.mode === 'punkt' ? 'Punktspiegelung: durch Z hindurch' : ctx && ctx.mode === 'schieb' ? 'Verschieben' : ctx && ctx.mode === 'dreh' ? 'Drehen um einen Punkt' : 'Spiegeln: gleich weit auf die andere Seite'),
    viewBox: '0 0 300 245',
    create(api, ctx) {
      ctx = ctx || {};
      let c;
      const neu = () => { let x, k; do { x = R(0, 10); k = R(2, 8); } while (x === k || 2 * k - x < 0 || 2 * k - x > 10); c = { mode: 'spiegel', x, y: R(1, 7), achse: 'v', k }; };
      if (ctx.mode && ctx.post) c = ctx;
      else if (ctx.mode && ctx.pre) c = aehnlich('k5-symmetrie', ctx, (e) => (ctx.mode === 'achsen' ? e.id !== ctx.id && !!e.punkt === !!ctx.punkt : true));
      else { neu(); api.chips([{ label: 'Neuer Punkt', onClick() { neu(); api.replay(); } }]); }
      const S = 24, OX = 34, OY = 222, kx = (x) => OX + x * S, ky = (y) => OY - y * S;
      let g;
      function gitter() {
        for (let i = 0; i <= 10; i++) el('line', { class: 'grid', x1: kx(i), y1: OY, x2: kx(i), y2: ky(8) }, api.svg);
        for (let j = 0; j <= 8; j++) el('line', { class: 'grid', x1: OX, y1: ky(j), x2: kx(10), y2: ky(j) }, api.svg);
        el('line', { class: 'axis', x1: OX, y1: OY, x2: kx(10) + 12, y2: OY }, api.svg); el('line', { class: 'axis', x1: OX, y1: OY, x2: OX, y2: ky(8) - 12 }, api.svg);
        for (let i = 0; i <= 10; i++) el('text', { class: 'tick', x: kx(i), y: OY + 16, 'text-anchor': 'middle', text: i }, api.svg);
        for (let j = 1; j <= 8; j++) el('text', { class: 'tick', x: OX - 9, y: ky(j) + 4, 'text-anchor': 'end', text: j }, api.svg);
      }
      const punkt = (x, y, name, cls, op) => { const q = el('g', { opacity: op === undefined ? 1 : op }, api.svg); el('circle', { class: 'pt' + (cls ? ' ' + cls : ''), cx: kx(x), cy: ky(y), r: 6 }, q); el('text', { class: 'ptl', x: kx(x) + 8, y: ky(y) - 8, text: name }, q); return q; };
      const weg = (x1, y1, x2, y2, cls) => el('line', { x1: kx(x1), y1: ky(y1), x2: kx(x1), y2: ky(y1), class: cls || 'arcG', 'data-x2': kx(x2), 'data-y2': ky(y2) }, api.svg);
      const zieh = (l, ms) => { const x1 = +l.getAttribute('x1'), y1 = +l.getAttribute('y1'), x2 = +l.getAttribute('data-x2'), y2 = +l.getAttribute('data-y2'); return api.tw(ms || 700, (t) => { l.setAttribute('x2', lerp(x1, x2, t)); l.setAttribute('y2', lerp(y1, y2, t)); }); };
      return {
        reset() {
          api.clear(); api.sub(subText(ctx)); g = {};
          if (c.mode === 'achsen') {
            const f = M.symFiguren[c.id];
            g.fig = el('polygon', { class: 'symfig', points: f.pts.map(([x, y]) => `${150 + x * 1.7},${120 + y * 1.7}`).join(' ') }, api.svg);
            g.geist = el('polygon', { class: 'symfig', style: 'fill:none;stroke-dasharray:4 4;stroke:var(--c2)', opacity: 0, points: g.fig.getAttribute('points') }, api.svg);
            g.ax = f.achsen.map((w) => { const a = (w * Math.PI) / 180, cx = Math.cos(a) * 112, sy = -Math.sin(a) * 112; return el('line', { class: 'symax', x1: 150 - cx, y1: 120 - sy, x2: 150 + cx, y2: 120 + sy, opacity: 0 }, api.svg); });
            g.z = el('circle', { cx: 150, cy: 120, r: 4, class: 'mk', opacity: 0 }, api.svg);
            return;
          }
          gitter();
          if (c.mode === 'spiegel') {
            g.linie = c.achse === 'v' ? el('line', { class: 'symax', x1: kx(c.k), y1: OY + 4, x2: kx(c.k), y2: ky(8) - 6 }, api.svg) : el('line', { class: 'symax', x1: OX - 4, y1: ky(c.k), x2: kx(10) + 6, y2: ky(c.k) }, api.svg);
            const fx = c.achse === 'v' ? c.k : c.x, fy = c.achse === 'h' ? c.k : c.y; // Fußpunkt auf g
            c.nx = c.achse === 'v' ? 2 * c.k - c.x : c.x; c.ny = c.achse === 'h' ? 2 * c.k - c.y : c.y;
            g.w1 = weg(c.x, c.y, fx, fy); g.w2 = weg(fx, fy, c.nx, c.ny);
            g.p = punkt(c.x, c.y, 'P'); g.q = punkt(c.nx, c.ny, 'P′', 'z', 0);
          } else if (c.mode === 'punkt') {
            c.nx = 2 * c.zx - c.x; c.ny = 2 * c.zy - c.y;
            g.w1 = weg(c.x, c.y, c.zx, c.zy); g.w2 = weg(c.zx, c.zy, c.nx, c.ny);
            g.p = punkt(c.x, c.y, 'P'); g.zp = punkt(c.zx, c.zy, 'Z', 'z'); g.q = punkt(c.nx, c.ny, 'P′', '', 0);
          } else if (c.mode === 'dreh') {
            [c.nx, c.ny] = M.drehe90(c.x, c.y, c.zx, c.zy, c.art);
            const arm = `${kx(c.zx)},${ky(c.zy)} ${kx(c.x)},${ky(c.zy)} ${kx(c.x)},${ky(c.y)}`;
            el('polyline', { points: arm, class: 'dash', style: 'fill:none' }, api.svg); // Ausgangslage bleibt als Schatten stehen
            g.arm = el('polyline', { points: arm, class: 'arcG', opacity: 0 }, api.svg);
            g.p = punkt(c.x, c.y, 'P'); g.zp = punkt(c.zx, c.zy, 'Z', 'z'); g.q = punkt(c.nx, c.ny, 'P′', '', 0);
          } else {
            g.w1 = weg(c.x, c.y, c.x + c.dx, c.y); g.w2 = weg(c.x + c.dx, c.y, c.x + c.dx, c.y + c.dy);
            g.p = punkt(c.x, c.y, 'A'); g.q = punkt(c.x + c.dx, c.y + c.dy, 'A′', 'z', 0);
          }
        },
        async play() {
          if (c.mode === 'achsen') {
            const f = M.symFiguren[c.id], n = f.achsen.length;
            api.say(`Eine <b>Symmetrieachse</b> ist eine Faltlinie: Faltest du dort, liegen beide Hälften genau aufeinander. Wir suchen alle Achsen (${f.name}).`);
            await api.wait(3800);
            for (let i = 0; i < n; i++) { await api.tw(500, (t) => show(g.ax[i], t)); api.say(`Achse ${i + 1}: Links und rechts davon sieht die Figur gleich aus, nur gespiegelt.`); await api.wait(1700); }
            api.say(n ? `Mehr gibt es nicht: Die Figur hat <b>${n} ${n === 1 ? 'Symmetrieachse' : 'Symmetrieachsen'}</b>.` : 'Egal wie man faltet: Die Hälften passen nie aufeinander. Die Figur hat <b>keine</b> Symmetrieachse, also 0.');
            await api.wait(2600);
            if (c.punkt || !n) {
              show(g.z, 1); show(g.geist, 1);
              api.say('Jetzt die <b>Punktsymmetrie</b>: Wir drehen die Figur eine halbe Drehung (180°) um ihren Mittelpunkt. Die gestrichelte Linie zeigt, wo sie vorher lag.');
              await api.wait(2600);
              await api.tw(1800, (t) => g.fig.setAttribute('transform', `rotate(${180 * t} 150 120)`));
              api.say(f.punkt ? 'Die gedrehte Figur liegt genau auf der gestrichelten: Sie ist <b>punktsymmetrisch</b>.' : 'Die gedrehte Figur passt nicht auf die gestrichelte: Sie ist <b>nicht punktsymmetrisch</b>.');
            }
            return;
          }
          if (c.mode === 'spiegel') {
            const ab = c.achse === 'v' ? Math.abs(c.x - c.k) : Math.abs(c.y - c.k);
            api.say(`Der Punkt <b>P(${c.x} | ${c.y})</b> soll an der grünen Geraden gespiegelt werden. Die Gerade ist der Spiegel.`);
            await api.wait(3000);
            await zieh(g.w1);
            api.say(`Geh von P <b>senkrecht</b> zur Geraden und zähle die Kästchen: <b>${ab}</b>.`);
            await api.wait(2800);
            await zieh(g.w2);
            api.say(`Auf der anderen Seite geht es <b>genauso weit</b> weiter: wieder ${ab} Kästchen.`);
            await api.wait(2400);
            await api.tw(400, (t) => show(g.q, t));
            api.say(`Dort liegt der Bildpunkt <b>P′(${c.nx} | ${c.ny})</b>. ${c.achse === 'v' ? 'Der y-Wert ist gleich geblieben.' : 'Der x-Wert ist gleich geblieben.'}<br><small>P und P′ sind gleich weit vom Spiegel entfernt, und ihre Verbindung steht senkrecht auf ihm.</small>`);
          } else if (c.mode === 'punkt') {
            const dx = c.zx - c.x, dy = c.zy - c.y;
            api.say(`Bei der <b>Punktspiegelung</b> ist der Spiegel kein Strich, sondern der Punkt <b>Z(${c.zx} | ${c.zy})</b>.`);
            await api.wait(3000);
            await zieh(g.w1);
            api.say(`Geh von P nach Z: <b>${Math.abs(dx)} nach ${dx > 0 ? 'rechts' : 'links'}</b> und <b>${Math.abs(dy)} nach ${dy > 0 ? 'oben' : 'unten'}</b>.`);
            await api.wait(3000);
            await zieh(g.w2);
            api.say('Von Z aus gehst du <b>denselben Weg noch einmal</b>, geradeaus weiter.');
            await api.wait(2400);
            await api.tw(400, (t) => show(g.q, t));
            api.say(`Dort liegt <b>P′(${c.nx} | ${c.ny})</b>.<br><small>Z liegt genau in der Mitte zwischen P und P′. Eine Punktspiegelung ist dasselbe wie eine halbe Drehung um Z.</small>`);
          } else if (c.mode === 'dreh') {
            const grad = c.art === 'halb' ? 180 : 90, svgGrad = c.art === 'links' ? -90 : c.art === 'rechts' ? 90 : 180;
            api.say(`Der Punkt P(${c.x} | ${c.y}) wird um <b>Z(${c.zx} | ${c.zy})</b> gedreht: ${grad}°${c.art === 'links' ? ' nach links (gegen den Uhrzeigersinn)' : c.art === 'rechts' ? ' nach rechts (im Uhrzeigersinn)' : ', eine halbe Drehung'}.`);
            await api.wait(3400);
            await api.tw(400, (t) => show(g.arm, t));
            api.say(`Merke dir den Weg von Z zu P wie einen Winkelhaken: <b>${M.richt(c.x - c.zx, c.y - c.zy)}</b>.`);
            await api.wait(3200);
            await api.tw(1800, (t) => g.arm.setAttribute('transform', `rotate(${svgGrad * t} ${kx(c.zx)} ${ky(c.zy)})`));
            api.say(`Der ganze Haken dreht sich um Z. Jetzt zeigt er: <b>${M.richt(c.nx - c.zx, c.ny - c.zy)}</b>.`);
            await api.wait(3000);
            await api.tw(400, (t) => show(g.q, t));
            api.say(`An seinem Ende liegt <b>P′(${c.nx} | ${c.ny})</b>.<br><small>Beim Drehen bleibt der Abstand zu Z gleich. ${c.art === 'halb' ? 'Eine halbe Drehung ist dasselbe wie eine Punktspiegelung an Z.' : 'Bei einer Vierteldrehung tauschen „rechts/links“ und „oben/unten“ die Rollen.'}</small>`);
          } else {
            api.say(`Der Punkt A(${c.x} | ${c.y}) wandert nach A′(${c.x + c.dx} | ${c.y + c.dy}). Wir zerlegen den Weg in <b>rechts/links</b> und <b>oben/unten</b>.`);
            await api.wait(3200);
            await zieh(g.w1);
            api.say(`x: von ${c.x} nach ${c.x + c.dx} → <b>${Math.abs(c.dx)} nach ${c.dx > 0 ? 'rechts' : 'links'}</b>`);
            await api.wait(2400);
            await zieh(g.w2);
            await api.tw(400, (t) => show(g.q, t));
            api.say(`y: von ${c.y} nach ${c.y + c.dy} → <b>${Math.abs(c.dy)} nach ${c.dy > 0 ? 'oben' : 'unten'}</b><br><small>Bei einer Verschiebung wandert jeder Punkt der Figur gleich weit in dieselbe Richtung.</small>`);
          }
        },
      };
    },
  });

  // =====================================================
  // Würfelnetze & Baupläne
  // =====================================================
  const PAAR = ['#ff9f6b', '#ff9f6b', '#7fb0ff', '#7fb0ff', '#7bd3a6', '#7bd3a6']; // gleiche Farbe = gegenüber
  reg('k5-netze', {
    title: 'Würfelnetz: in Gedanken falten',
    titleFor: (ctx) => (ctx && ctx.mode === 'bau' ? 'Würfelgebäude: Bauplan lesen' : ctx && ctx.mode === 'qnetz' ? 'Quadernetz: sechs Rechtecke' : ctx && ctx.mode === 'schraeg' ? 'Schrägbild: so wird ein Quader räumlich' : 'Würfelnetz: in Gedanken falten'),
    viewBox: '0 0 360 200',
    create(api, ctx) {
      ctx = ctx || {};
      let c;
      const neu = (m) => { c = aehnlich('k5-netze', { mode: m || 'netz' }); };
      if (ctx.mode && ctx.post) c = ctx;
      else if (ctx.mode && ctx.pre) c = aehnlich('k5-netze', ctx);
      else { neu(); api.chips([{ label: 'Würfelnetz', onClick() { neu('netz'); api.replay(); } }, { label: 'Quadernetz', onClick() { neu('qnetz'); api.replay(); } }, { label: 'Schrägbild', onClick() { neu('schraeg'); api.replay(); } }]); }
      let g;
      return {
        reset() {
          api.clear(); api.sub(subText(ctx)); g = {};
          if (c.mode === 'bau') {
            const s = 40, ox = 60, oy = 30;
            g.zellen = c.h.flatMap((row, r) => row.map((v, col) => { const q = el('g', {}, api.svg); const rect = el('rect', { class: 'netz', x: ox + col * s, y: oy + r * s, width: s, height: s }, q); el('text', { class: 'netzt', x: ox + col * s + s / 2, y: oy + r * s + s / 2 + 6, 'text-anchor': 'middle', text: v }, q); return { rect, v, r, col }; }));
            el('text', { class: 'ex-s f6', x: ox + 60, y: oy + 3 * s + 18, 'text-anchor': 'middle', text: 'vorn' }, api.svg);
            g.out = el('text', { class: 'ex-b f1', x: 270, y: 96, 'text-anchor': 'middle', text: '' }, api.svg);
            g.lbl = el('text', { class: 'ex-s', x: 270, y: 70, 'text-anchor': 'middle', text: c.vorn ? 'von vorn' : 'Würfel' }, api.svg);
            return;
          }
          if (c.mode === 'qnetz') {
            const { F, s, ox, oy } = M.qnetzFlaechen(c.a, c.b, c.c);
            const grp = el('g', { transform: 'translate(24 6)' }, api.svg);
            g.f = {};
            F.forEach((f) => { g.f[f.id] = el('rect', { class: 'netz', x: f.px, y: f.py, width: f.pw, height: f.ph }, grp); });
            el('text', { class: 'tick b', x: ox + (c.c + c.a / 2) * s, y: oy - 5, 'text-anchor': 'middle', text: c.a + ' cm' }, grp);
            el('text', { class: 'tick b', x: ox + c.c * s - 5, y: oy + (c.c / 2) * s + 4, 'text-anchor': 'end', text: c.c + ' cm' }, grp);
            el('text', { class: 'tick b', x: ox - 5, y: oy + (c.c + c.b / 2) * s + 4, 'text-anchor': 'end', text: c.b + ' cm' }, grp);
            return;
          }
          if (c.mode === 'schraeg') {
            const { a, b } = c, t = c.c;
            const s = Math.min(24, 170 / (a + t * 0.36), 130 / (b + t * 0.36)), dx = t * s * 0.5 * Math.SQRT1_2;
            const x0 = (360 - (a * s + dx)) / 2, y0 = (200 + (b * s + dx)) / 2 - 6;
            const P = (x, y, z) => [x0 + x * s + (z ? dx : 0), y0 - y * s - (z ? dx : 0)];
            const L = (p, q, cls) => el('line', { x1: p[0], y1: p[1], x2: q[0], y2: q[1], class: cls, opacity: 0 }, api.svg);
            g.vorn = el('polygon', { class: 'wf', opacity: 0, points: [P(0, 0, 0), P(a, 0, 0), P(a, b, 0), P(0, b, 0)].map((q) => q.join(',')).join(' ') }, api.svg);
            g.schraeg = [L(P(a, 0, 0), P(a, 0, 1), 'ray'), L(P(a, b, 0), P(a, b, 1), 'ray'), L(P(0, b, 0), P(0, b, 1), 'ray'), L(P(0, 0, 0), P(0, 0, 1), 'dash')];
            g.hinten = [L(P(0, b, 1), P(a, b, 1), 'ray'), L(P(a, 0, 1), P(a, b, 1), 'ray'), L(P(0, 0, 1), P(a, 0, 1), 'dash'), L(P(0, 0, 1), P(0, b, 1), 'dash')];
            g.txt = [el('text', { class: 'tick b', x: x0 + (a * s) / 2, y: y0 + 16, 'text-anchor': 'middle', text: a + ' cm', opacity: 0 }, api.svg), el('text', { class: 'tick b', x: x0 - 6, y: y0 - (b * s) / 2 + 4, 'text-anchor': 'end', text: b + ' cm', opacity: 0 }, api.svg), el('text', { class: 'tick b', x: x0 + a * s + dx / 2 + 8, y: y0 - dx / 2 + 6, text: fmt(t / 2) + ' cm', opacity: 0 }, api.svg)];
            return;
          }
          const rows = Math.max(...c.cells.map((p) => p[0])) + 1, cols = Math.max(...c.cells.map((p) => p[1])) + 1;
          const s = Math.min(42, Math.floor(320 / cols), Math.floor(180 / rows)), ox = (360 - cols * s) / 2, oy = (200 - rows * s) / 2;
          g.s = s;
          g.zellen = c.cells.map(([r, col], i) => { const rect = el('rect', { class: 'netz', x: ox + col * s, y: oy + r * s, width: s, height: s }, api.svg); const t = el('text', { class: 'netzt', x: ox + col * s + s / 2, y: oy + r * s + s / 2 + 6, 'text-anchor': 'middle', text: c.labels ? c.labels[i] : '' }, api.svg); return { rect, t }; });
        },
        async play() {
          if (c.mode === 'bau') {
            if (c.vorn) {
              api.say('Von vorn sieht man in jeder <b>Spalte</b> nur den höchsten Turm. Niedrigere Türme davor oder dahinter verschwinden in der Ansicht.');
              await api.wait(3600);
              let sum = 0;
              for (let col = 0; col < c.h[0].length; col++) {
                const spalte = g.zellen.filter((z) => z.col === col), max = Math.max(...spalte.map((z) => z.v));
                spalte.forEach((z) => z.rect.setAttribute('class', 'netz' + (z.v === max ? ' on' : '')));
                sum += max; g.out.textContent = sum;
                api.say(`Spalte ${col + 1}: höchster Turm <b>${max}</b>. Bisher ${sum} Quadrate.`);
                await api.wait(2000);
              }
              api.say(`Von vorn sieht man <b>${sum} Quadrate</b>.`);
              return;
            }
            api.say('Der <b>Bauplan</b> zeigt das Gebäude von oben. Jede Zahl sagt, wie viele Würfel dort übereinander stehen. Wir zählen alle zusammen.');
            await api.wait(3600);
            let sum = 0;
            for (const z of g.zellen) { z.rect.setAttribute('class', 'netz on'); sum += z.v; g.out.textContent = sum; await api.wait(420); }
            api.say(`Zusammen sind es <b>${sum} Würfel</b>.<br><small>Im Schrägbild sind manche versteckt, im Bauplan nicht. Darum ist der Bauplan zum Zählen sicherer.</small>`);
            return;
          }
          if (c.mode === 'qnetz') {
            const { a, b } = c, t = c.c;
            const paare = [['vorn', 'hinten', a, b, '#ff9f6b'], ['links', 'rechts', t, b, '#7fb0ff'], ['oben', 'unten', a, t, '#7bd3a6']];
            if (c.id) {
              const pr = paare.find((q) => q[0] === c.id || q[1] === c.id);
              g.f[c.id].setAttribute('class', 'netz on');
              api.say('Ein Quadernetz besteht aus <b>6 Rechtecken</b>. Welche Seitenlängen hat die gelbe Fläche? Kanten, die beim Falten aufeinandertreffen, sind gleich lang.');
              await api.wait(4200);
              api.say(`Die gelbe Fläche ist <b>${pr[2]} cm</b> und <b>${pr[3]} cm</b> lang: ${pr[2]} · ${pr[3]} = <b>${pr[2] * pr[3]} cm²</b>`);
              await api.wait(3200);
              g.f[pr[0] === c.id ? pr[1] : pr[0]].setAttribute('style', 'fill:#ffe1a8;opacity:.6');
              api.say(`Ihre Partnerin liegt am Quader genau gegenüber und ist genauso groß: auch <b>${pr[2] * pr[3]} cm²</b>.`);
              return;
            }
            api.say('Ein Quadernetz besteht aus <b>6 Rechtecken</b>. Immer zwei sind gleich groß: Sie liegen sich am Quader gegenüber.');
            await api.wait(3800);
            let sum = 0;
            for (const [p1, p2, w, h, farbe] of paare) {
              g.f[p1].setAttribute('style', `fill:${farbe}`); g.f[p2].setAttribute('style', `fill:${farbe}`);
              sum += 2 * w * h;
              api.say(`${p1[0].toUpperCase() + p1.slice(1)} und ${p2}: je ${w} · ${h} = ${w * h} cm², zusammen <b>${2 * w * h} cm²</b>.`);
              await api.wait(2800);
            }
            api.say(`Alles zusammen: ${paare.map((q) => 2 * q[2] * q[3]).join(' + ')} = <b>${sum} cm²</b>. Das ist die Oberfläche des Quaders.`);
            return;
          }
          if (c.mode === 'schraeg') {
            const { a, b } = c, t = c.c;
            api.say(`Ein Quader: ${a} cm breit, ${b} cm hoch, ${t} cm tief. Im <b>Schrägbild</b> soll er räumlich aussehen. Das geht in drei Schritten.`);
            await api.wait(3600);
            await api.tw(500, (k) => { show(g.vorn, k); show(g.txt[0], k); show(g.txt[1], k); });
            api.say(`<b>1.</b> Die Vorderfläche in <b>echter Größe</b>: ${a} cm breit und ${b} cm hoch.`);
            await api.wait(3000);
            for (const l of g.schraeg) await api.tw(300, (k) => show(l, k));
            show(g.txt[2], 1);
            api.say(`<b>2.</b> Von jeder Ecke eine Kante schräg nach hinten (auf Kästchenpapier diagonal), aber nur <b>halb so lang</b>: ${t} cm : 2 = <b>${fmt(t / 2)} cm</b>.`);
            await api.wait(4200);
            for (const l of g.hinten) await api.tw(300, (k) => show(l, k));
            api.say('<b>3.</b> Die vier Endpunkte verbinden: Das ist die Rückseite. Kanten, die man nicht sehen kann, werden <b>gestrichelt</b>.');
            await api.wait(3600);
            api.say(`Fertig. Von den 12 Kanten haben <b>8</b> ihre echte Länge (4 vorn, 4 hinten), <b>4</b> sind verkürzt und <b>3</b> gestrichelt.<br><small>Die schräge Kante ist ${fmt(t / 2)} cm lang gezeichnet, in Wirklichkeit sind es ${t} cm. Ein Quader hat 8 Ecken, 12 Kanten und 6 Flächen.</small>`);
            return;
          }
          const seiten = M.netzFalten(c.cells);
          const rolle = (sf) => (sf === 1 ? 'der <b>Boden</b>' : sf === 0 ? 'der <b>Deckel</b>' : 'eine <b>Seitenwand</b>');
          api.say('Wir falten in Gedanken. Ein Würfel hat <b>6 Seiten</b>: Boden, Deckel und vier Seitenwände. Jedes Quadrat muss eine andere Seite werden.');
          await api.wait(3800);
          const gesehen = {};
          let ok = true;
          for (let i = 0; i < c.cells.length; i++) {
            const sf = seiten[i], doppelt = sf in gesehen;
            g.zellen[i].rect.setAttribute('style', `fill:${doppelt ? '#ff8fa3' : PAAR[sf]}`);
            if (doppelt) {
              ok = false;
              g.zellen[gesehen[sf]].rect.setAttribute('style', 'fill:#ff8fa3');
              api.say('Halt: Dieses Quadrat landet beim Falten auf <b>derselben Würfelseite</b> wie ein anderes (beide rot). Zwei Quadrate übereinander, dafür bleibt eine Seite offen.');
              await api.wait(3600);
            } else {
              gesehen[sf] = i;
              api.say(i === 0 ? 'Dieses Quadrat bleibt liegen: Es ist <b>der Boden</b>.' : `Dieses Quadrat klappt hoch und wird ${rolle(sf)}.`);
              await api.wait(1500);
            }
          }
          if (!ok) { api.say('Das ist <b>kein Würfelnetz</b>: Beim Falten überdecken sich Quadrate.<br><small>Merke: Vier Quadrate im 2 × 2-Block oder fünf in einer Reihe gehen nie.</small>'); return; }
          if (c.mode === 'gegen') {
            g.zellen[c.i].rect.setAttribute('stroke-width', 5); g.zellen[c.j].rect.setAttribute('stroke-width', 5);
            api.say(`Gleiche Farbe heißt <b>gegenüber</b>. Gegenüber von <b>${c.labels[c.i]}</b> liegt <b>${c.labels[c.j]}</b>.<br><small>Flächen, die sich im Netz berühren, sind am Würfel Nachbarn. In einer geraden Reihe liegt die übernächste gegenüber.</small>`);
          } else api.say('Alle 6 Seiten kommen genau einmal vor: Das ist ein <b>Würfelnetz</b>.<br><small>Gleiche Farbe heißt: Diese beiden Flächen liegen sich am Würfel gegenüber.</small>');
        },
      };
    },
  });

  // =====================================================
  // Schätzen wie Fermi: in vier Schritten
  // =====================================================
  reg('k5-fermi', {
    title: 'Schätzen wie Fermi: in vier Schritten',
    viewBox: '0 0 360 200',
    create(api, ctx) {
      ctx = ctx || {};
      let c, g = [];
      const neu = () => { c = aehnlich('k5-fermi', { mode: 'fermi' }); };
      if (ctx.mode === 'fermi' && ctx.post) c = ctx;
      else if (ctx.mode === 'fermi' && ctx.pre) c = aehnlich('k5-fermi', ctx, (e) => e.frage !== ctx.frage);
      else { neu(); api.chips([{ label: 'Andere Frage', onClick() { neu(); api.replay(); } }]); }
      const rows = ['Was weiß ich sicher?', 'Was muss ich schätzen?', 'Mit runden Zahlen rechnen', 'Größenordnung nennen'];
      return {
        reset() {
          api.clear(); api.sub(subText(ctx));
          g = rows.map((t, i) => {
            const grp = el('g', { opacity: 0.3 }, api.svg), y = 12 + i * 46;
            el('rect', { x: 20, y, width: 320, height: 38, rx: 10, class: 'bag' }, grp);
            el('text', { x: 40, y: y + 25, class: 'ex-b f2', 'text-anchor': 'middle', text: i + 1 }, grp);
            el('text', { x: 58, y: y + 25, class: 'ex-s', style: 'font-weight:800', text: t }, grp);
            return grp;
          });
        },
        async play() {
          api.say(`${c.frage}<br><small>Solche Fragen heißen Fermi-Fragen, nach dem Physiker Enrico Fermi. Niemand kennt die genaue Antwort, aber man kann sie gut abschätzen.</small>`);
          await api.wait(5200);
          const step = async (i, txt, ms) => { await api.tw(300, (t) => g[i].setAttribute('opacity', 0.3 + 0.7 * t)); api.say(txt); await api.wait(ms); };
          await step(0, `<b>1. Was weiß ich sicher?</b> ${c.weiss}`, 4200);
          await step(1, `<b>2. Was muss ich schätzen?</b> ${c.schaetz}`, 4600);
          await step(2, `<b>3. Mit runden Zahlen rechnen:</b><br>${c.rechnung.join('<br>')}`, 5200);
          await api.tw(300, (t) => g[3].setAttribute('opacity', 0.3 + 0.7 * t));
          api.say(`<b>4. Größenordnung:</b> <b>${c.antwort}</b><br><small>Es kommt nicht auf die genaue Zahl an. Wichtig ist, ob es eher Hunderte, Tausende oder Hunderttausende sind.</small>`);
        },
      };
    },
  });
})();
