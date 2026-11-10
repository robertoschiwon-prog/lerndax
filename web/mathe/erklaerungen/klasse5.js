/* Mathelix – Erklär-Animationen
 *
 * Jede Erklärung: { title, viewBox, create(api) → { reset(), play() } }
 *   reset(): baut die Startszene neu auf
 *   play():  async – spielt die Animation ab (api.wait / api.tw / api.say)
 * Regler und Auswahl-Chips legt create() über api.slider / api.chips an.
 */
(function () {
  const M = (window.Mathelix = window.Mathelix || {});
  const U = M.util;
  const fr = U.fr, fmt = U.fmt, R = U.R, pick = U.pick;
  const EX = (M.explainers = M.explainers || {});
  const NS = 'http://www.w3.org/2000/svg';
  const rad = (d) => (d * Math.PI) / 180;
  const pt = (cx, cy, r, a) => [cx + r * Math.cos(rad(a)), cy - r * Math.sin(rad(a))];
  const lerp = (a, b, t) => a + (b - a) * t;

  function el(tag, a, parent) {
    const e = document.createElementNS(NS, tag);
    for (const k in a || {}) {
      if (k === 'text') e.textContent = a[k];
      else e.setAttribute(k, a[k]);
    }
    if (parent) parent.appendChild(e);
    return e;
  }
  function arcD(cx, cy, r, a0, a1, closed) {
    if (a1 - a0 >= 359.99) a1 = a0 + 359.99;
    const p0 = pt(cx, cy, r, a0), p1 = pt(cx, cy, r, a1);
    const large = a1 - a0 > 180 ? 1 : 0;
    const arc = `A ${r} ${r} 0 ${large} 0 ${p1[0].toFixed(2)} ${p1[1].toFixed(2)}`;
    return closed
      ? `M ${cx} ${cy} L ${p0[0].toFixed(2)} ${p0[1].toFixed(2)} ${arc} Z`
      : `M ${p0[0].toFixed(2)} ${p0[1].toFixed(2)} ${arc}`;
  }
  const reg = (ids, def) => [].concat(ids).forEach((id) => (EX[id] = def));
  // Legt einen Markierungs-Kasten genau um die gezeichneten Elemente (gemessen, nicht geschätzt)
  function fitBox(rect, elems, padX, padY) {
    try {
      const bs = elems.map((e) => e.getBBox()).filter((b) => b.width || b.height);
      if (!bs.length) return;
      const x0 = Math.min(...bs.map((b) => b.x)), y0 = Math.min(...bs.map((b) => b.y));
      const x1 = Math.max(...bs.map((b) => b.x + b.width)), y1 = Math.max(...bs.map((b) => b.y + b.height));
      rect.setAttribute('x', x0 - padX); rect.setAttribute('y', y0 - padY);
      rect.setAttribute('width', x1 - x0 + 2 * padX); rect.setAttribute('height', y1 - y0 + 2 * padY);
    } catch (e) { /* ohne Darstellung (z. B. Test ohne Layout): Kasten bleibt, wo er ist */ }
  }
  M.exUtil = { el, arcD, pt };

  // =====================================================
  // Runden – Zahlenstrahl
  // =====================================================
  reg('k5-runden', {
    title: 'Runden am Zahlenstrahl',
    viewBox: '0 0 360 170',
    create(api) {
      let B, n;
      const X = (v) => 30 + (v - B) * 10;
      const pickN = () => { B = 10 * R(3, 90); n = B + 10 + R(1, 9); };
      pickN();
      let g;
      function scene() {
        api.clear();
        g = {};
        el('line', { x1: 24, y1: 100, x2: 340, y2: 100, class: 'ray' }, api.svg);
        for (let v = B; v <= B + 30; v++) {
          const big = v % 10 === 0, mid = v % 5 === 0;
          el('line', { x1: X(v), y1: 100 - (big ? 12 : mid ? 8 : 5), x2: X(v), y2: 100 + (big ? 12 : mid ? 8 : 5), class: 'tk' }, api.svg);
          if (big) el('text', { x: X(v), y: 132, class: 'ex-t', 'text-anchor': 'middle', text: v }, api.svg);
        }
        g.lo = el('circle', { cx: X(B + 10), cy: 100, r: 16, class: 'hl2', opacity: 0 }, api.svg);
        g.hi = el('circle', { cx: X(B + 20), cy: 100, r: 16, class: 'hl2', opacity: 0 }, api.svg);
        g.mid = el('g', { opacity: 0 }, api.svg);
        el('line', { x1: X(B + 15), y1: 72, x2: X(B + 15), y2: 116, class: 'dash' }, g.mid);
        el('text', { x: X(B + 15), y: 150, class: 'ex-s', 'text-anchor': 'middle', text: 'Mitte ' + (B + 15) }, g.mid);
        g.dist = el('g', {}, api.svg);
        g.m = el('g', { opacity: 0 }, api.svg);
        el('line', { x1: 0, y1: 60, x2: 0, y2: 100, class: 'stem' }, g.m);
        el('circle', { cx: 0, cy: 100, r: 7, class: 'mk' }, g.m);
        g.ml = el('text', { x: 0, y: 52, class: 'ex-b f1', 'text-anchor': 'middle', text: n }, g.m);
        g.m.setAttribute('transform', `translate(${X(n)},0)`);
      }
      function dist(v, show) {
        g.dist.innerHTML = '';
        if (!show) return;
        const d1 = v - (B + 10), d2 = B + 20 - v;
        el('path', { d: `M ${X(B + 10)} 88 Q ${(X(B + 10) + X(v)) / 2} 70 ${X(v)} 88`, class: d1 < d2 ? 'arcG' : 'arcN' }, g.dist);
        el('path', { d: `M ${X(v)} 88 Q ${(X(v) + X(B + 20)) / 2} 70 ${X(B + 20)} 88`, class: d2 <= d1 ? 'arcG' : 'arcN' }, g.dist);
        el('text', { x: (X(B + 10) + X(v)) / 2, y: 74, class: 'ex-s', 'text-anchor': 'middle', text: d1 }, g.dist);
        el('text', { x: (X(v) + X(B + 20)) / 2, y: 74, class: 'ex-s', 'text-anchor': 'middle', text: d2 }, g.dist);
      }
      function verdict(v) {
        const up = v - B - 10 >= 5;
        return `<b>${v}</b> liegt näher an <b>${up ? B + 20 : B + 10}</b>${v === B + 15 ? ' (genau in der Mitte: dann rundet man <b>auf</b>)' : ''} → ${up ? 'aufrunden' : 'abrunden'}: ${v} ≈ <b>${up ? B + 20 : B + 10}</b>`;
      }
      const sl = api.slider({ label: 'Zahl verschieben', min: 1, max: 19, value: n - B - 10, onInput(val) {
        n = B + 10 + val; scene();
        g.m.setAttribute('opacity', 1); g.lo.setAttribute('opacity', 1); g.hi.setAttribute('opacity', 1); g.mid.setAttribute('opacity', 1);
        dist(n, true);
        api.say(verdict(n));
      } });
      api.chips([{ label: 'Neue Zahl', onClick() { pickN(); sl.value = n - B - 10; api.replay(); } }]);
      return {
        reset: scene,
        async play() {
          api.say(`Wo liegt <b>${n}</b> auf dem Zahlenstrahl?`);
          await api.tw(700, (t) => { g.m.setAttribute('opacity', t); g.m.setAttribute('transform', `translate(${X(n)},${(1 - t) * -30})`); });
          await api.wait(900);
          api.say(`Die beiden Nachbar-Zehner sind <b>${B + 10}</b> und <b>${B + 20}</b>.`);
          await api.tw(500, (t) => { g.lo.setAttribute('opacity', t); g.hi.setAttribute('opacity', t); });
          await api.wait(1200);
          api.say(`Genau in der Mitte liegt <b>${B + 15}</b>.`);
          await api.tw(500, (t) => g.mid.setAttribute('opacity', t));
          await api.wait(1200);
          api.say(`Abstände zählen: zu ${B + 10} sind es ${n - B - 10}, zu ${B + 20} sind es ${B + 20 - n}.`);
          dist(n, true);
          await api.wait(1800);
          const target = n - B - 10 >= 5 ? B + 20 : B + 10;
          api.say(verdict(n));
          await api.tw(900, (t) => { g.m.setAttribute('transform', `translate(${lerp(X(n), X(target), t)},${-Math.sin(t * Math.PI) * 18})`); g.ml.textContent = t < 0.98 ? n : '≈ ' + target; });
        },
      };
    },
  });

  // =====================================================
  // Dividieren – Bonbons in Tüten (Rest) und schriftlich Stelle für Stelle
  //   ctx: { mode:'div', n, d, pre, post }
  // =====================================================
  // Schritte der schriftlichen Division: [{ col, p, q, prod, r }]
  function divSteps(n, d) {
    const dg = String(n).split('').map(Number), out = [];
    let i = 0, p = dg[0];
    while (p < d && i < dg.length - 1) { i++; p = p * 10 + dg[i]; }
    for (;;) {
      const q = Math.floor(p / d), prod = q * d, r = p - prod;
      out.push({ col: i, p, q, prod, r });
      if (i === dg.length - 1) break;
      i++; p = r * 10 + dg[i];
    }
    return out;
  }
  reg('k5-division', {
    title: 'Dividieren: teilen und schriftlich rechnen',
    viewBox: '0 0 360 280',
    create(api, ctx) {
      ctx = ctx || {};
      let task = null;
      if (ctx.mode === 'div' && (ctx.pre || ctx.post)) {
        task = { n: ctx.n, d: ctx.d };
        if (ctx.pre) {
          const len = String(ctx.n).length;
          let n, d;
          do { d = R(3, 9); n = R(10 ** (len - 1), 10 ** len - 1); } while (n === ctx.n);
          task = { n, d };
        }
      }
      let mode = task ? 'schrift' : 'alle';
      let bd, bq, br, bn, dots;
      const pickB = () => { bd = R(3, 5); bq = R(2, 5); br = R(1, bd - 1); bn = bq * bd + br; };
      pickB();
      let sn, sd;
      const pickS = () => { sd = R(3, 9); sn = R(1000, 9999); };
      if (task) { sn = task.n; sd = task.d; } else pickS();

      function bonbonScene() {
        api.clear();
        dots = [];
        for (let i = 0; i < bn; i++) {
          const x = 30 + (i % 6) * 22 + R(-4, 4), y = 40 + Math.floor(i / 6) * 22 + R(-4, 4);
          dots.push(el('circle', { cx: x, cy: y, r: 8, class: 'candy', opacity: 0 }, api.svg));
        }
        el('text', { x: 85, y: 22, class: 'ex-s', 'text-anchor': 'middle', text: bn + ' Bonbons' }, api.svg);
      }
      async function bonbon() {
        bonbonScene();
        api.say(`<b>${bn}</b> Bonbons sollen in Tüten mit je <b>${bd}</b> Stück.`);
        for (const c of dots) { c.setAttribute('opacity', 1); await api.wait(45); }
        await api.wait(700);
        for (let gI = 0; gI < bq; gI++) {
          const y = 34 + gI * 36, x0 = 190;
          const box = el('rect', { x: x0 - 14, y: y - 15, width: bd * 24 + 6, height: 30, rx: 8, class: 'bag', opacity: 0 }, api.svg);
          el('text', { x: x0 + bd * 24, y: y + 5, class: 'ex-s', text: 'Tüte ' + (gI + 1) }, api.svg);
          api.svg.insertBefore(box, dots[0]);
          await api.tw(250, (t) => box.setAttribute('opacity', t));
          api.say(`Tüte ${gI + 1}: ${bd} Bonbons hinein.`);
          const grp = dots.slice(gI * bd, gI * bd + bd);
          const from = grp.map((c) => [+c.getAttribute('cx'), +c.getAttribute('cy')]);
          await api.tw(550, (t) => grp.forEach((c, k) => { c.setAttribute('cx', lerp(from[k][0], x0 + k * 24, t)); c.setAttribute('cy', lerp(from[k][1], y, t)); }));
        }
        const rest = dots.slice(bq * bd);
        const from = rest.map((c) => [+c.getAttribute('cx'), +c.getAttribute('cy')]);
        const yR = 34 + bq * 36 + 10;
        api.say(`Es bleiben <b>${br}</b> übrig. Für eine volle Tüte reicht das nicht.`);
        rest.forEach((c) => c.setAttribute('class', 'candy rest'));
        await api.tw(600, (t) => rest.forEach((c, k) => { c.setAttribute('cx', lerp(from[k][0], 190 + k * 24, t)); c.setAttribute('cy', lerp(from[k][1], yR, t)); }));
        el('text', { x: 190 + br * 24, y: yR + 5, class: 'ex-s f1', text: 'Rest' }, api.svg);
        await api.wait(1400);
        api.say(`<b>${bn} : ${bd} = ${bq} Rest ${br}</b><br>Probe: ${bq} · ${bd} + ${br} = ${bq * bd} + ${br} = ${bn} ✓`);
        await api.wait(2600);
      }

      // ---------- schriftlich ----------
      const CW = 17, RH = 23, Y0 = 46;
      let X0;
      const X = (col) => X0 + col * CW;
      const D = (x, y, t, cls) => el('text', { x, y, class: 'divd' + (cls ? ' ' + cls : ''), 'text-anchor': 'middle', text: t }, api.svg);
      function schriftScene() {
        api.clear();
        const L = String(sn).length;
        X0 = 180 - ((2 * L + String(sd).length + 7.2) * CW) / 2 + CW / 2;
        String(sn).split('').forEach((c, i) => D(X(i), Y0, c));
        const xs = X(L - 1) + CW;
        el('text', { x: xs, y: Y0, class: 'divd', text: `: ${sd} =` }, api.svg);
      }
      async function schrift() {
        schriftScene();
        const n = sn, d = sd, L = String(n).length;
        const steps = divSteps(n, d);
        const qx0 = X(L - 1) + CW * (String(d).length + 4.2);
        let qn = 0;
        const putQ = (digit) => { D(qx0 + qn * CW, Y0, String(digit), 'f2'); qn++; };
        const hl = el('rect', { x: 0, y: Y0 - 18, width: 0, height: 24, rx: 5, class: 'hl2', opacity: 0 }, api.svg);
        api.svg.insertBefore(hl, api.svg.firstChild);
        // Ziffernhöhe einmal messen, damit die Markierung genau sitzt
        let dTop = -16, dH = 20;
        try { const probe = D(X(0), Y0, '0'); const bb = probe.getBBox(); if (bb.height) { dTop = bb.y - Y0; dH = bb.height; } probe.remove(); } catch (e) {}
        const hlCols = (c0, c1, y) => { hl.setAttribute('x', X(c0) - CW / 2 - 1); hl.setAttribute('width', (c1 - c0 + 1) * CW + 2); hl.setAttribute('y', y + dTop - 3); hl.setAttribute('height', dH + 6); hl.setAttribute('opacity', 1); };
        api.say(`<b>${fmt(n)} : ${d}</b> schriftlich: Wir teilen <b>Stelle für Stelle</b> von links.`);
        await api.wait(1800);
        let rowY = Y0;
        let first = true;
        for (let s = 0; s < steps.length; s++) {
          const st = steps[s], pLen = String(st.p).length;
          hlCols(st.col - pLen + 1, st.col, rowY);
          if (first && st.col > 0) api.say(`${String(n)[0]} ist kleiner als ${d}, also nehmen wir gleich <b>${st.p}</b>.`);
          else api.say(`Wie oft passt ${d} in <b>${st.p}</b>?`);
          first = false;
          await api.wait(1600);
          putQ(st.q);
          if (st.q === 0) {
            api.say(`${d} passt <b>nicht</b> in ${st.p} → eine <b>0</b> ins Ergebnis!`);
            await api.wait(1800);
          } else {
            api.say(`<b>${st.q}</b>-mal, denn ${st.q} · ${d} = ${st.prod}. Die ${st.q} kommt ins Ergebnis.`);
            await api.wait(1600);
            const py = rowY + RH, pStr = String(st.prod);
            D(X(st.col - pStr.length), py, '−');
            pStr.split('').forEach((c, k) => D(X(st.col - pStr.length + 1 + k), py, c));
            el('line', { x1: X(st.col - pStr.length) - CW / 2, y1: py + 6, x2: X(st.col) + CW / 2, y2: py + 6, class: 'tk' }, api.svg);
            await api.wait(900);
            rowY = py + RH;
            const rStr = String(st.r);
            const lastStep = s === steps.length - 1;
            if (st.r > 0 || lastStep) rStr.split('').forEach((c, k) => D(X(st.col - rStr.length + 1 + k), rowY, c, lastStep ? 'f1' : ''));
            api.say(`${st.p} − ${st.prod} = <b>${st.r}</b>${lastStep ? '' : ' bleibt übrig.'}`);
            await api.wait(1400);
          }
          if (s < steps.length - 1) {
            const nc = st.col + 1, digit = String(n)[nc];
            const fly = D(X(nc), Y0, digit, 'f1');
            api.say(`Nächste Ziffer <b>${digit}</b> herunterholen.`);
            await api.tw(700, (t) => fly.setAttribute('y', lerp(Y0, rowY, t)));
            fly.setAttribute('class', 'divd');
            await api.wait(500);
          }
        }
        hl.setAttribute('opacity', 0);
        const q = Math.floor(n / d), r = n % d;
        if (r) el('text', { x: qx0 + qn * CW + 4, y: Y0, class: 'divd f1', text: `R ${r}` }, api.svg);
        api.say(`Fertig: <b>${fmt(n)} : ${d} = ${fmt(q)}${r ? ` Rest ${r}` : ''}</b><br><small>Probe: ${fmt(q)} · ${d}${r ? ` + ${r}` : ''} = ${fmt(n)} ✓</small>`);
        await api.wait(3200);
      }

      api.chips([
        { label: 'Bonbons: Was ist ein Rest?', onClick() { mode = 'bonbon'; pickB(); api.replay(); } },
        { label: 'Schriftlich rechnen', onClick() { mode = 'schrift'; api.replay(); } },
        { label: 'Neue Aufgabe', onClick() { task = null; pickB(); pickS(); api.replay(); } },
      ]);
      return {
        reset() {
          api.sub(!task ? '' : ctx.post ? 'Lösung zu deiner Aufgabe, Schritt für Schritt' : 'Ein ähnliches Beispiel – deine Aufgabe löst du danach selbst');
          if (mode === 'bonbon' || mode === 'alle') bonbonScene(); else schriftScene();
        },
        async play() {
          if (mode === 'bonbon' || mode === 'alle') await bonbon();
          if (mode === 'alle') { api.say('Und jetzt mit großen Zahlen: <b>schriftlich</b>.'); await api.wait(1600); }
          if (mode === 'schrift' || mode === 'alle') await schrift();
        },
      };
    },
  });

  // =====================================================
  // Teilbarkeit – Regeln sichtbar machen & Teiler-Paare
  //   ctx: { mode:'teil', n, d } | { mode:'teiler', n }, dazu pre/post
  // =====================================================
  reg('k5-teilbar', {
    title: 'Teilbarkeit: Regeln und Teiler',
    viewBox: '0 0 360 240',
    create(api, ctx) {
      ctx = ctx || {};
      const TEILER_N = [12, 16, 18, 20, 24, 28, 30, 32, 36, 40, 42, 45, 48, 50, 54, 56, 60, 64, 72];
      let task = null;
      if ((ctx.mode === 'teil' || ctx.mode === 'teiler') && (ctx.pre || ctx.post)) {
        task = Object.assign({}, ctx);
        if (ctx.pre) {
          if (ctx.mode === 'teiler') { let n; do n = pick(TEILER_N); while (n === ctx.n); task.n = n; }
          else { const len = String(ctx.n).length; let n; do n = R(10 ** (len - 1), 10 ** len - 1); while (n === ctx.n); task.n = n; }
        }
      }
      let mode = task ? task.mode : 'teil', n, d;
      const newDemo = (dd) => { d = dd || pick([3, 9, 3, 4, 6]); n = d * R(Math.ceil(1000 / d), Math.floor(99999 / d)); if (Math.random() < 0.4) n += R(1, d - 1); };
      if (task) { n = task.n; d = task.d; } else newDemo(3);
      const qs = (v) => String(v).split('').reduce((a, c) => a + +c, 0);
      let boxes = [];
      function digits(y) {
        const ds = String(n).split(''), w = 34, x0 = 180 - (ds.length * w) / 2;
        boxes = ds.map((c, i) => {
          const g = el('g', {}, api.svg);
          const r = el('rect', { x: x0 + i * w + 2, y: y - 26, width: w - 4, height: 38, rx: 8, class: 'vnum' }, g);
          el('text', { x: x0 + i * w + w / 2, y: y, class: 'ex-b', 'text-anchor': 'middle', text: c }, g);
          return { g, r, x: x0 + i * w + w / 2, y, c: +c };
        });
      }
      const mark = (list) => list.forEach((b) => b.r.setAttribute('class', 'vnum vhotr'));
      const verdict = (ok, y) => {
        const t = el('text', { x: 180, y: y || 222, class: 'ex-b ' + (ok ? 'fok' : 'fbad'), 'text-anchor': 'middle', text: `${ok ? '✓' : '✗'} ${fmt(n)} ist ${ok ? '' : 'nicht '}durch ${d} teilbar` }, api.svg);
        return t;
      };
      async function quer(dd) {
        const s = qs(n);
        api.say(`Durch <b>${dd}</b> teilbar? Dafür brauchen wir die <b>Quersumme</b>: alle Ziffern zusammenzählen.`);
        await api.wait(1800);
        mark(boxes);
        const row = el('text', { x: 180, y: 140, class: 'vexpr', 'text-anchor': 'middle' }, api.svg);
        let txt = '';
        for (let i = 0; i < boxes.length; i++) {
          txt += (i ? ' + ' : '') + boxes[i].c;
          row.textContent = txt;
          await api.wait(380);
        }
        row.textContent = `${txt} = ${s}`;
        api.say(`Quersumme: <b>${s}</b>`);
        await api.wait(1500);
        const ok = s % dd === 0;
        el('text', { x: 180, y: 180, class: 'ex-b', 'text-anchor': 'middle', text: `${s} ist ${ok ? '' : 'nicht '}durch ${dd} teilbar${ok ? ` (${s} = ${dd} · ${s / dd})` : ''}` }, api.svg);
        api.say(`Ist die Quersumme durch ${dd} teilbar, dann auch die ganze Zahl. ${s} ist ${ok ? '' : '<b>nicht</b> '}durch ${dd} teilbar.`);
        await api.wait(2000);
        return ok;
      }
      async function ende(k, dd) {
        const last = boxes.slice(-k), v = +last.map((b) => b.c).join('');
        api.say(k === 1
          ? `Durch <b>${dd}</b> teilbar? Dafür reicht ein Blick auf die <b>letzte Ziffer</b>.`
          : `Durch <b>4</b> teilbar? Dafür reichen die <b>letzten zwei Ziffern</b>. <small>(Jede volle Hundert ist durch 4 teilbar.)</small>`);
        await api.wait(1800);
        mark(last);
        await api.wait(900);
        const ok = v % dd === 0;
        const why = dd === 2 ? `Letzte Ziffer ${v}: ${ok ? 'gerade' : 'ungerade'}`
          : dd === 5 ? `Letzte Ziffer ${v}: ${ok ? '0 oder 5' : 'weder 0 noch 5'}`
            : dd === 10 ? `Letzte Ziffer ${v}: ${ok ? 'eine 0' : 'keine 0'}`
              : `${v} ist ${ok ? `durch 4 teilbar (${v} = 4 · ${v / 4})` : 'nicht durch 4 teilbar'}`;
        el('text', { x: 180, y: 150, class: 'ex-b', 'text-anchor': 'middle', text: why }, api.svg);
        api.say(`${why}.`);
        await api.wait(2000);
        return ok;
      }
      async function teil() {
        api.clear();
        el('text', { x: 180, y: 20, class: 'ex-s f6', 'text-anchor': 'middle', text: `IST ${fmt(n)} DURCH ${d} TEILBAR?` }, api.svg);
        digits(76);
        let ok;
        if (d === 3 || d === 9) ok = await quer(d);
        else if (d === 2 || d === 5 || d === 10) ok = await ende(1, d);
        else if (d === 4) ok = await ende(2, d);
        else {
          api.say('Durch <b>6</b> teilbar heißt: durch <b>2</b> und durch <b>3</b> teilbar. Wir prüfen beides.');
          await api.wait(2200);
          const ok2 = boxes[boxes.length - 1].c % 2 === 0;
          mark([boxes[boxes.length - 1]]);
          el('text', { x: 180, y: 130, class: 'ex-b ' + (ok2 ? 'fok' : 'fbad'), 'text-anchor': 'middle', text: `durch 2: ${ok2 ? '✓' : '✗'} (letzte Ziffer ${boxes[boxes.length - 1].c})` }, api.svg);
          api.say(`Durch 2: letzte Ziffer ${boxes[boxes.length - 1].c} → ${ok2 ? 'ja' : 'nein'}.`);
          await api.wait(1800);
          const s = qs(n), ok3 = s % 3 === 0;
          mark(boxes);
          el('text', { x: 180, y: 165, class: 'ex-b ' + (ok3 ? 'fok' : 'fbad'), 'text-anchor': 'middle', text: `durch 3: ${ok3 ? '✓' : '✗'} (Quersumme ${s})` }, api.svg);
          api.say(`Durch 3: Quersumme ${String(n).split('').join(' + ')} = ${s} → ${ok3 ? 'ja' : 'nein'}.`);
          await api.wait(2000);
          ok = ok2 && ok3;
        }
        verdict(ok);
        api.say(`<b>${ok ? 'Ja' : 'Nein'}</b>, ${fmt(n)} ist ${ok ? '' : '<b>nicht</b> '}durch ${d} teilbar.${ok ? ` <small>${fmt(n)} : ${d} = ${fmt(n / d)}</small>` : ''}`);
        await api.wait(2600);
      }
      async function teiler() {
        api.clear();
        el('text', { x: 180, y: 20, class: 'ex-s f6', 'text-anchor': 'middle', text: `TEILER VON ${n}: IMMER PAARWEISE` }, api.svg);
        api.say(`Teiler findet man am besten <b>paarweise</b>: Welche zwei Zahlen ergeben malgenommen <b>${n}</b>?`);
        await api.wait(2000);
        const pairs = [];
        for (let i = 1; i * i <= n; i++) if (n % i === 0) pairs.push([i, n / i]);
        const sp = Math.min(30, 150 / pairs.length);
        for (let k = 0; k < pairs.length; k++) {
          const [a, b] = pairs[k], y = 52 + k * sp;
          const t = el('text', { x: 180, y, class: 'vexpr', 'text-anchor': 'middle', style: `font-size:${Math.min(22, sp * 0.8)}px`, opacity: 0 }, api.svg);
          t.innerHTML = `<tspan class="f2">${a}</tspan> · <tspan class="f1">${b}</tspan> = ${n}`;
          api.say(a === b ? `${a} · ${a} = ${n}: Hier treffen sich die Paare, ${a} zählt nur einmal.` : `${a} · ${b} = ${n}: also sind <b>${a}</b> und <b>${b}</b> Teiler.`);
          await api.tw(350, (tt) => t.setAttribute('opacity', tt));
          await api.wait(a === b ? 1800 : 1100);
        }
        const all = [...pairs.map((p) => p[0]), ...pairs.map((p) => p[1]).reverse()].filter((v, i, arr) => arr.indexOf(v) === i);
        el('text', { x: 180, y: 222, class: 'ex-b', 'text-anchor': 'middle' }, api.svg).innerHTML = `T<tspan dy="5" font-size="12">${n}</tspan><tspan dy="-5"> = {${all.join(', ')}}</tspan>`;
        api.say(`<b>${n}</b> hat <b>${all.length} Teiler</b>. <small>Man kann aufhören, sobald die linke Zahl größer wäre als die rechte.</small>`);
        await api.wait(3000);
      }
      api.chips([
        { label: 'Quersumme (3, 9)', onClick() { task = null; mode = 'teil'; newDemo(pick([3, 9])); api.replay(); } },
        { label: 'Endziffern (2, 4, 5, 10)', onClick() { task = null; mode = 'teil'; newDemo(pick([2, 4, 5, 10, 4])); api.replay(); } },
        { label: 'Durch 6', onClick() { task = null; mode = 'teil'; newDemo(6); api.replay(); } },
        { label: 'Teiler-Paare', onClick() { task = null; mode = 'teiler'; n = pick(TEILER_N); api.replay(); } },
      ]);
      return {
        reset() {
          api.sub(!task ? '' : ctx.post ? 'Lösung zu deiner Aufgabe' : 'Ein ähnliches Beispiel – deine Aufgabe löst du danach selbst');
          api.clear();
          if (mode === 'teil') { el('text', { x: 180, y: 20, class: 'ex-s f6', 'text-anchor': 'middle', text: `IST ${fmt(n)} DURCH ${d} TEILBAR?` }, api.svg); digits(76); }
        },
        async play() { if (mode === 'teiler') await teiler(); else await teil(); },
      };
    },
  });

  // =====================================================
  // Primzahlen – Plättchen-Rechtecke  &  Faktorbaum mit Probierschritten
  //   ctx: { mode:'prime'|'tree', n, pre, post }
  //   pre  = vor dem Antworten → ähnliches Beispiel (verrät nichts)
  //   post = nach dem Antworten → genau die Zahl aus der Aufgabe
  // =====================================================
  const isPrime = (v) => { if (v < 2) return false; for (let i = 2; i * i <= v; i++) if (v % i === 0) return false; return true; };
  const factorsOf = (v) => { const f = []; for (let p = 2; v > 1; p++) while (v % p === 0) { f.push(p); v /= p; } return f; };
  const TREE_EX = [60, 84, 90, 126, 150, 132, 140, 98, 66, 70, 105, 156];
  reg('k5-prim', {
    title: 'Primzahlen',
    viewBox: '0 0 360 230',
    create(api, ctx) {
      ctx = ctx || {};
      let mode = ctx.mode || 'prime', n;
      function exampleFor(m) {
        if (ctx.post && m === ctx.mode) return ctx.n;
        if (m === 'tree') { let v; do v = pick(TREE_EX); while (v === ctx.n); return v; }
        if (!ctx.pre && !ctx.post) return 21;
        let v; const wantPrime = Math.random() < 0.5;
        do v = R(11, 60); while (v === ctx.n || isPrime(v) !== wantPrime);
        return v;
      }
      function sub() {
        api.sub(ctx.post && mode === ctx.mode ? `Lösung zu deiner Aufgabe: <b>${n}</b>` : ctx.pre ? 'Ein ähnliches Beispiel – deine Aufgabe löst du danach selbst' : '');
      }
      n = exampleFor(mode);

      // ---------- Modus 1: Rechtecke legen ----------
      let tiles = [], gaps = [];
      function layout(rows) {
        const cols = Math.ceil(n / rows);
        const size = Math.min(26, 310 / cols, 150 / rows);
        const x0 = 180 - (cols * size) / 2, y0 = 40 + (150 - rows * size) / 2;
        return { cols, size, pos: (i) => [x0 + (i % cols) * size, y0 + Math.floor(i / cols) * size], x0, y0 };
      }
      function place(L, t, from) {
        tiles.forEach((r, i) => {
          const [x, y] = L.pos(i), f = from ? from[i] : [x, y, L.size];
          r.setAttribute('x', lerp(f[0], x, t)); r.setAttribute('y', lerp(f[1], y, t));
          const sz = lerp(f[2], L.size, t) * 0.84;
          r.setAttribute('width', sz); r.setAttribute('height', sz);
        });
      }
      const snap = () => tiles.map((r) => [+r.getAttribute('x'), +r.getAttribute('y'), +r.getAttribute('width') / 0.84]);
      function scenePrime() {
        api.svg.setAttribute('viewBox', '0 0 360 230');
        api.clear(); tiles = []; gaps = [];
        el('text', { x: 180, y: 24, class: 'ex-b', 'text-anchor': 'middle', text: `${n} Plättchen` }, api.svg);
        for (let i = 0; i < n; i++) tiles.push(el('rect', { rx: 3, class: 'tile' }, api.svg));
        place(n <= 24 ? layout(1) : layout(Math.ceil(n / 12)), 1);
      }
      async function playPrime() {
        api.say(`Eine <b>Primzahl</b> hat <b>genau zwei Teiler</b>: 1 und sich selbst. (Die 1 ist keine Primzahl, sie hat nur einen Teiler.)<br>Wir testen das mit <b>${n} Plättchen</b>: Lassen sie sich zu einem Rechteck legen?`);
        await api.wait(3600);
        let found = 0, r;
        for (r = 2; r * r <= n; r++) {
          gaps.forEach((g) => g.remove()); gaps = [];
          tiles.forEach((t) => t.setAttribute('class', 'tile'));
          const L = layout(r), from = snap();
          api.say(`Versuch: <b>${r} Reihen</b> …`);
          await api.tw(650, (t) => place(L, t, from));
          const rest = n % r;
          if (rest === 0) {
            tiles.forEach((t) => t.setAttribute('class', 'tile ok'));
            api.say(`<b>${r} Reihen</b> à ${n / r}: ein volles Rechteck! ✓<br>${n} : ${r} = ${n / r} geht auf, also ist <b>${r}</b> ein Teiler von ${n}.`);
            found = r;
            break;
          }
          const missing = r - rest;
          for (let k = 0; k < missing; k++) {
            const [x, y] = L.pos(n + k);
            gaps.push(el('rect', { x, y, width: L.size * 0.84, height: L.size * 0.84, rx: 3, class: 'gap' }, api.svg));
          }
          api.say(`<b>${r} Reihen</b>: es entsteht eine Lücke ✗<br>${n} : ${r} = ${Math.floor(n / r)} Rest ${rest}, geht nicht auf.`);
          await api.wait(1700);
        }
        if (found) {
          await api.wait(2600);
          api.say(`<span class="exbig f1">${n} ist keine Primzahl</span><br>Sie lässt sich als Rechteck legen: <b>${n} = ${found} · ${n / found}</b>. Sie hat also mehr Teiler als nur 1 und ${n}.`);
          return;
        }
        await api.wait(1200);
        gaps.forEach((g) => g.remove()); gaps = [];
        api.say(`Mehr als ${r - 1} Reihen brauchen wir nicht zu probieren: Dann hätte das Rechteck weniger Spalten als Reihen, und das hätten wir schon gefunden.`);
        await api.wait(3600);
        const one = { cols: n, size: Math.min(26, 330 / n), pos: (i) => [180 - (n * Math.min(26, 330 / n)) / 2 + i * Math.min(26, 330 / n), 105] };
        const from = snap();
        await api.tw(800, (t) => place(one, t, from));
        tiles.forEach((t) => t.setAttribute('class', 'tile prime'));
        api.say(`<span class="exbig f3">${n} ist eine Primzahl</span><br>Kein Rechteck möglich, nur eine einzige lange Reihe (1 · ${n}). Die einzigen Teiler sind <b>1</b> und <b>${n}</b>.`);
      }

      // ---------- Modus 2: Faktorbaum mit Probierschritten ----------
      function sceneTree() {
        const f = factorsOf(n);
        let lines = 1;
        { let v = n, from = 2; for (const p of f) { if (isPrime(v)) break; for (let q = from; q < p; q++) if (isPrime(q)) lines++; lines++; v /= p; from = p; } }
        const h = Math.max(60 + (f.length - 1) * 50 + 60, 40 + lines * 22 + 50);
        api.svg.setAttribute('viewBox', `0 0 360 ${h}`);
        api.clear();
        el('line', { x1: 196, y1: 14, x2: 196, y2: h - 50, class: 'sep' }, api.svg);
        el('text', { x: 208, y: 26, class: 'ex-s f6', text: 'Rechenweg' }, api.svg);
        return h;
      }
      function node(x, y, v, prime) {
        const g = el('g', { opacity: 0 }, api.svg);
        if (prime) el('circle', { cx: x, cy: y, r: 16, class: 'pr' }, g);
        el('text', { x, y: y + 6, class: 'ex-b', 'text-anchor': 'middle', text: v }, g);
        return g;
      }
      async function playTree() {
        const h = sceneTree();
        const f = factorsOf(n);
        let x = 56, y = 34, v = n, from = 2, ly = 50;
        const line = async (txt, cls) => {
          const t = el('text', { x: 208, y: ly, class: 'ex-s ' + (cls || ''), text: txt, opacity: 0 }, api.svg);
          ly += 22;
          await api.tw(250, (k) => t.setAttribute('opacity', k));
        };
        const root = node(x, y, n, isPrime(n));
        api.say(`Wir zerlegen <b>${n}</b> in Primfaktoren. Regel: Teile immer durch die <b>kleinste Primzahl, die aufgeht</b> (2, 3, 5, 7, 11 …).`);
        await api.tw(400, (t) => root.setAttribute('opacity', t));
        await api.wait(3000);
        for (let i = 0; i < f.length; i++) {
          if (isPrime(v)) break;
          const p = f[i];
          for (let q = from; q < p; q++) {
            if (!isPrime(q)) continue;
            api.say(`Geht <b>${v}</b> durch ${q}? ${v} : ${q} = ${Math.floor(v / q)} Rest ${v % q}. <b>Nein.</b>`);
            await line(`${v} : ${q}  ✗`, 'f1');
            await api.wait(1500);
          }
          const rest = v / p;
          api.say(`Geht <b>${v}</b> durch ${p}? ${v} : ${p} = ${rest}. <b>Ja!</b><br>Die ${p} ist eine Primzahl, sie kommt grün umkreist in den Baum.`);
          await line(`${v} : ${p} = ${rest}  ✓`, 'f3');
          const l1 = el('line', { x1: x, y1: y + 12, x2: x, y2: y + 12, class: 'br' }, api.svg);
          const l2 = el('line', { x1: x, y1: y + 12, x2: x, y2: y + 12, class: 'br' }, api.svg);
          await api.tw(400, (t) => { l1.setAttribute('x2', x - 28 * t); l1.setAttribute('y2', y + 12 + 20 * t); l2.setAttribute('x2', x + 28 * t); l2.setAttribute('y2', y + 12 + 20 * t); });
          const a = node(x - 28, y + 50, p, true), b = node(x + 28, y + 50, rest, isPrime(rest));
          await api.tw(400, (t) => { a.setAttribute('opacity', t); b.setAttribute('opacity', t); });
          await api.wait(2400);
          x += 28; y += 50; v = rest; from = p;
        }
        api.say(`<b>${v}</b> ist selbst eine Primzahl (grün), weiter geht es nicht.`);
        await line(`${v} ist Primzahl  ✓`, 'f3');
        await api.wait(2000);
        const sum = el('text', { x: 180, y: h - 18, class: 'ex-b f3', 'text-anchor': 'middle', text: `${n} = ${f.join(' · ')}`, opacity: 0 }, api.svg);
        await api.tw(500, (t) => sum.setAttribute('opacity', t));
        api.say(`Alle grünen Zahlen zusammen ergeben die Lösung:<br><span class="exbig f3">${n} = ${f.join(' · ')}</span><br><small>Probe: ${f.join(' · ')} = ${n} ✓</small>`);
      }

      api.chips([
        { label: 'Was ist eine Primzahl?', onClick() { mode = 'prime'; n = exampleFor(mode); sub(); api.replay(); } },
        { label: 'Faktorbaum', onClick() { mode = 'tree'; n = exampleFor(mode); sub(); api.replay(); } },
        { label: 'Andere Zahl', onClick() {
          if (mode === 'tree') { let v; do v = pick(TREE_EX); while (v === n); n = v; }
          else { let v; do v = R(11, 60); while (v === n); n = v; }
          api.sub(''); api.replay();
        } },
      ]);
      sub();
      return {
        reset() { mode === 'prime' ? scenePrime() : sceneTree(); },
        play() { return mode === 'prime' ? playPrime() : playTree(); },
      };
    },
  });

  // =====================================================
  // Potenzen – Basis/Exponent, Verdoppeln, Zehnerpotenzen, Sonderfälle, Quadratzahlen
  // =====================================================
  reg('k5-potenz', {
    title: 'Potenzen: wie oft malnehmen?',
    viewBox: '0 0 360 230',
    create(api, ctx) {
      // Teile: grund · zwei · zehn · sonder · quad; 'alle' spielt sie nacheinander
      //   ctx: { mode:'pow', b, e } | { mode:'zehn', k, a? } | { mode:'quad', n }, dazu pre/post
      ctx = ctx || {};
      const POWS = [[2, 3], [2, 4], [2, 5], [2, 6], [3, 3], [3, 4], [4, 3], [5, 3], [3, 2], [2, 7]];
      let task = null;
      if (ctx.mode && (ctx.pre || ctx.post)) {
        task = Object.assign({}, ctx);
        if (ctx.pre) {
          if (ctx.mode === 'pow') { let p; do p = pick(POWS); while (p[0] === ctx.b && p[1] === ctx.e); task.b = p[0]; task.e = p[1]; }
          else if (ctx.mode === 'zehn') { let k; do k = R(2, 6); while (k === ctx.k); task.k = k; if (ctx.a) task.a = R(2, 9); }
          else { let n; do n = R(11, 20); while (n === ctx.n); task.n = n; }
        }
      }
      let mode = task ? { pow: 'grund', zehn: 'zehn', quad: 'quad' }[task.mode] : 'alle';
      const T = (x, y, cls, anchor) => el('text', { x, y, class: cls || 'ex-b', 'text-anchor': anchor || 'middle' }, api.svg);
      // Hochzahl: hochstellen und danach zurück auf die Grundlinie. Das leere Zeichen (\u200B) ist nötig,
      // weil Browser ein leeres <tspan> ignorieren – sonst bliebe der Rest der Zeile hochgestellt.
      const sup = (e, size) => `<tspan dy="${-size * 0.45}" font-size="${Math.round(size * 0.6)}">${e}</tspan><tspan dy="${size * 0.45}">\u200B</tspan>`;
      const pw = (b, e, size) => `${b}${sup(e, size)}`;
      const title = (t) => el('text', { x: 180, y: 18, class: 'ex-s f6', 'text-anchor': 'middle', text: t }, api.svg);

      const supTxt = (e) => String(e).split('').map((c) => '⁰¹²³⁴⁵⁶⁷⁸⁹'[+c]).join('');
      async function grund(B = 2, E = 5) {
        api.clear();
        title('BASIS UND EXPONENT');
        const big = T(180, 68, 'vexpr potbig');
        big.innerHTML = pw(B, E, 46);
        big.setAttribute('opacity', 0);
        api.say(`Was bedeutet <b>${B}${supTxt(E)}</b>, gesprochen „${B} hoch ${E}“?`);
        await api.tw(600, (t) => big.setAttribute('opacity', t));
        await api.wait(1400);
        const lb = el('g', { opacity: 0 }, api.svg);
        el('line', { x1: 120, y1: 74, x2: 158, y2: 60, class: 'tk' }, lb);
        el('text', { x: 116, y: 80, class: 'ex-s f2', 'text-anchor': 'end', text: 'Basis' }, lb);
        const le = el('g', { opacity: 0 }, api.svg);
        el('line', { x1: 240, y1: 30, x2: 200, y2: 36, class: 'tk' }, le);
        el('text', { x: 244, y: 34, class: 'ex-s f1', 'text-anchor': 'start', text: 'Exponent' }, le);
        api.say(`Die <b class="f2">Basis</b> ${B} ist die Zahl, die malgenommen wird.`);
        await api.tw(500, (t) => lb.setAttribute('opacity', t));
        await api.wait(1800);
        api.say(`Der <b class="f1">Exponent</b> ${E} sagt, <b>wie oft</b> sie als Faktor vorkommt.`);
        await api.tw(500, (t) => le.setAttribute('opacity', t));
        await api.wait(1800);
        const n = E, gap = Math.min(58, 300 / n), w = Math.min(40, gap - 12), x0 = 180 - ((n - 1) * gap) / 2;
        const ZAHL = ['', 'ein', 'zwei', 'drei', 'vier', 'fünf', 'sechs', 'sieben', 'acht', 'neun', 'zehn'];
        for (let i = 0; i < n; i++) {
          const g = el('g', { opacity: 0 }, api.svg);
          el('rect', { x: x0 + i * gap - w / 2, y: 98, width: w, height: 40, rx: 9, class: 'vnum' }, g);
          el('text', { x: x0 + i * gap, y: 125, class: 'ex-b', 'text-anchor': 'middle', text: B }, g);
          el('text', { x: x0 + i * gap, y: 156, class: 'ex-s f1', 'text-anchor': 'middle', text: `${i + 1}.` }, g);
          if (i > 0) el('text', { x: x0 + i * gap - gap / 2, y: 124, class: 'ex-b', 'text-anchor': 'middle', text: '·' }, g);
          api.say(`${i + 1}-mal die ${B}${i === n - 1 ? `: ${n === 1 ? 'nur ein Faktor!' : (ZAHL[n] || n) + ' Faktoren!'}` : ' …'}`);
          await api.tw(350, (t) => g.setAttribute('opacity', t));
          await api.wait(n > 6 ? 250 : 450);
        }
        await api.wait(700);
        const run = T(180, 192, 'vexpr');
        let p = B;
        for (let i = 1; i < n; i++) {
          run.textContent = `${fmt(p)} · ${B} = ${fmt(p * B)}`;
          api.say(`Schritt für Schritt: <b>${fmt(p)} · ${B} = ${fmt(p * B)}</b>`);
          p *= B;
          await api.wait(n > 6 ? 700 : 1000);
        }
        run.innerHTML = `${pw(B, E, 22)} = ${n <= 6 ? Array(n).fill(B).join(' · ') + ' = ' : ''}<tspan class="f3">${fmt(B ** E)}</tspan>`;
        if (E > 1 && B > 1 && B * E !== B ** E) {
          const no = T(180, 222, 'ex-b fbad');
          no.textContent = `✗ nicht ${B} · ${E} = ${B * E}`;
          api.say(`<b>${B}${supTxt(E)} = ${fmt(B ** E)}</b>, und <b>nicht</b> ${B} · ${E} = ${B * E}! <small>Der Exponent zählt die Faktoren, er wird nicht malgenommen.</small>`);
        } else if (E === 1) api.say(`<b>${B}¹ = ${B}</b>: nur ein Faktor, also die Zahl selbst.`);
        else if (B === 1) api.say(`<b>1${supTxt(E)} = 1</b>: 1 mal 1 bleibt immer 1.`);
        else api.say(`<b>${B}${supTxt(E)} = ${fmt(B ** E)}</b>. <small>Der Exponent zählt die Faktoren.</small>`);
        await api.wait(3200);
      }

      function drawPow2(k) {
        api.clear();
        title('2 HOCH n: IMMER VERDOPPELN');
        const rows = 2 ** Math.floor(k / 2), cols = 2 ** Math.ceil(k / 2);
        const s = Math.min(26, 300 / cols, 168 / rows), x0 = 180 - (cols * s) / 2, y0 = 26 + (168 - rows * s) / 2;
        for (let i = 0; i < rows; i++) for (let j = 0; j < cols; j++) {
          const isNew = k > 0 && (k % 2 === 1 ? j >= cols / 2 : i >= rows / 2);
          el('rect', { x: x0 + j * s + 1, y: y0 + i * s + 1, width: s - 2, height: s - 2, rx: Math.min(4, s / 4), class: isNew ? 'blk mv' : 'blk' }, api.svg);
        }
        const t = T(180, 222, 'vexpr');
        t.innerHTML = k === 0 ? 'Start: 1 Kästchen' : `${pw(2, k, 22)} = ${k <= 6 ? Array(k).fill(2).join(' · ') + ' = ' : ''}${2 ** k}`;
      }
      async function zwei() {
        drawPow2(0);
        api.say('Wir starten mit <b>einem</b> Kästchen und verdoppeln immer wieder, also immer „mal 2“.');
        await api.wait(1800);
        for (let k = 1; k <= 8; k++) {
          drawPow2(k);
          api.say(`${k}-mal verdoppelt: <b>${2 ** k}</b> Kästchen${k === 1 ? '' : ` <small>(orange: die neue Hälfte)</small>`}`);
          await api.wait(k < 4 ? 1600 : 1200);
        }
        api.say('So schnell wachsen Potenzen: <b>2⁸ = 256</b>. <small>Nach 10-mal Verdoppeln sind es schon 1 024!</small>');
        await api.wait(2800);
      }

      async function zehn(hl = 0, A = 0) {
        api.clear();
        title('ZEHNERPOTENZEN');
        const K = Math.max(6, hl), rowsN = K + (A ? 1 : 0), sp = Math.min(30, 186 / rowsN), fs = Math.round(Math.min(22, sp * 0.72));
        api.say('Bei der Basis <b>10</b> wird es ganz einfach …');
        await api.wait(1400);
        for (let k = 1; k <= K; k++) {
          const y = 22 + k * sp;
          const row = el('g', { opacity: 0 }, api.svg);
          const box = k === hl ? el('rect', { x: 30, y: y - sp * 0.78, width: 310, height: sp * 0.98, rx: 8, class: 'hl2' }, row) : null;
          const t = el('text', { x: 40, y, class: 'vexpr', 'text-anchor': 'start', style: `font-size:${fs}px` }, row);
          t.innerHTML = `${pw(10, k, fs)} = 1<tspan class="f1">${'0'.repeat(k)}</tspan>`;
          const lbl = el('text', { x: 334, y: y - 2, class: 'ex-s f6', 'text-anchor': 'end', text: `${k} ${k === 1 ? 'Null' : 'Nullen'}` }, row);
          if (box) fitBox(box, [t, lbl], 8, 1);
          api.say(`10<sup>${k}</sup> = ${k === 1 ? '10' : Array(k).fill(10).join(' · ')}${k > 1 ? ` = ${fmt(10 ** k)}` : ''}`);
          await api.tw(400, (tt) => row.setAttribute('opacity', tt));
          await api.wait(hl ? 650 : k < 3 ? 1300 : 900);
        }
        if (hl) {
          api.say(`Deine Zehnerpotenz: <b>10${supTxt(hl)}</b> = 1 mit <b>${hl} Nullen</b> = ${fmt(10 ** hl)}.`);
          await api.wait(2400);
          if (A) {
            const y = 22 + (K + 1) * sp;
            const t = el('text', { x: 40, y, class: 'vexpr', 'text-anchor': 'start', style: `font-size:${fs}px` }, api.svg);
            t.innerHTML = `${A} · ${pw(10, hl, fs)} = ${A}<tspan class="f1">${'0'.repeat(hl)}</tspan>`;
            api.say(`Und <b>${A} · 10${supTxt(hl)}</b>: Hinter die ${A} kommen ${hl} Nullen, also <b>${fmt(A * 10 ** hl)}</b>.`);
            await api.wait(3000);
          }
          return;
        }
        api.say('Der <b>Exponent</b> sagt, wie viele <b class="f1">Nullen</b> hinter der 1 stehen. <small>10⁶ = 1 000 000, eine Million.</small>');
        await api.wait(3000);
      }

      async function sonder() {
        api.clear();
        title('ZWEI SONDERFÄLLE');
        const a = R(3, 9);
        const l1 = T(180, 80, 'vexpr'), l2 = T(180, 160, 'vexpr');
        l1.innerHTML = `${pw(a, 1, 22)} = <tspan class="f3">${a}</tspan>`;
        l1.setAttribute('opacity', 0); l2.setAttribute('opacity', 0);
        const c1 = el('text', { x: 180, y: 104, class: 'ex-s f6', 'text-anchor': 'middle', text: 'nur ein Faktor: die Zahl selbst' }, api.svg);
        c1.setAttribute('opacity', 0);
        api.say(`<b>Hoch 1</b>: Die ${a} kommt nur <b>einmal</b> vor, da gibt es nichts malzunehmen.`);
        await api.tw(500, (t) => { l1.setAttribute('opacity', t); c1.setAttribute('opacity', t); });
        await api.wait(2400);
        l2.innerHTML = `${pw(1, 5, 22)} = 1 · 1 · 1 · 1 · 1 = <tspan class="f3">1</tspan>`;
        const c2 = el('text', { x: 180, y: 184, class: 'ex-s f6', 'text-anchor': 'middle', text: '1 mal 1 bleibt immer 1' }, api.svg);
        c2.setAttribute('opacity', 0);
        api.say('<b>Basis 1</b>: Egal wie oft man 1 mit 1 malnimmt, es bleibt <b>1</b>.');
        await api.tw(500, (t) => { l2.setAttribute('opacity', t); c2.setAttribute('opacity', t); });
        await api.wait(2800);
      }

      function drawSq(k, fresh) {
        api.clear();
        title('QUADRATZAHLEN: DER SONDERFALL „HOCH 2“');
        const s = Math.min(18, 170 / k), x0 = 180 - (k * s) / 2, y0 = 28;
        for (let i = 0; i < k; i++) for (let j = 0; j < k; j++) {
          const isNew = fresh && (i === k - 1 || j === k - 1);
          el('circle', { cx: x0 + j * s + s / 2, cy: y0 + i * s + s / 2, r: s * 0.36, class: isNew ? 'dotN' : 'dotO' }, api.svg);
        }
        const t = T(180, 222, 'vexpr');
        t.innerHTML = `${pw(k, 2, 22)} = ${k} · ${k} = ${k * k}`;
      }
      async function quad(upTo = 0) {
        api.say('Bei <b>hoch 2</b> kommt die Zahl zweimal als Faktor vor. Das kann man als <b>Quadrat</b> legen:');
        const last = upTo || 8;
        for (let k = 1; k <= last; k++) { sl.value = k; drawSq(k, true); await api.wait(k < 4 ? 1000 : last > 10 ? 350 : 700); }
        if (upTo) {
          api.say(`<b>${upTo}² = ${upTo} · ${upTo} = ${upTo * upTo}</b>: ${upTo} Reihen mit je ${upTo} Punkten.`);
          await api.wait(2600);
          return;
        }
        api.say('<b>n² = n · n</b> ist die Anzahl der Punkte im Quadrat. Darum heißt „hoch 2“ auch „zum Quadrat“. <small>Probier den Regler bis 20!</small>');
        await api.wait(2400);
      }

      const sl = api.slider({ label: 'Quadrat: Seitenlänge', min: 1, max: 20, value: 1, onInput(v) { drawSq(v, false); api.say(`<b>${v}² = ${v} · ${v} = ${v * v}</b>`); } });
      const showSl = (on) => { sl.parentElement.style.display = on ? '' : 'none'; };
      const go = (m) => { mode = m; task = null; showSl(m === 'quad'); api.replay(); };
      api.chips([
        { label: 'Alles', onClick() { go('alle'); } },
        { label: 'Basis & Exponent', onClick() { go('grund'); } },
        { label: '2 hoch n', onClick() { go('zwei'); } },
        { label: 'Zehnerpotenzen', onClick() { go('zehn'); } },
        { label: 'hoch 1 · Basis 1', onClick() { go('sonder'); } },
        { label: 'Quadratzahlen', onClick() { go('quad'); } },
      ]);
      showSl(false);
      return {
        reset() {
          showSl(mode === 'quad');
          api.sub(!task ? '' : ctx.post ? 'Lösung zu deiner Aufgabe' : 'Ein ähnliches Beispiel – deine Aufgabe löst du danach selbst');
          if (mode === 'quad') drawSq(1, false);
          else if (mode === 'alle' || mode === 'grund') { api.clear(); const b = T(180, 120, 'vexpr potbig'); b.innerHTML = task && mode === 'grund' ? pw(task.b, task.e, 46) : pw(2, 5, 46); }
          else if (mode === 'zwei') drawPow2(0);
          else api.clear();
        },
        async play() {
          if (mode === 'alle') {
            await grund(); await zwei(); await zehn(); await sonder();
            showSl(true); await quad();
            api.say('<b>Merke:</b> Der Exponent zählt, <b>wie oft</b> die Basis malgenommen wird. <small>2⁵ = 32 · 10³ = 1 000 · 7¹ = 7 · 1⁵ = 1 · 4² = 16</small>');
            return;
          }
          if (task) {
            if (mode === 'grund') return grund(task.b, task.e);
            if (mode === 'zehn') return zehn(task.k, task.a || 0);
            if (mode === 'quad') return quad(task.n);
          }
          await { grund: () => grund(), zwei, zehn: () => zehn(), sonder, quad: () => quad() }[mode]();
        },
      };
    },
  });

  // =====================================================
  // Anteile – Bonbons gerecht aufteilen
  // =====================================================
  reg('k5-anteil', {
    title: 'Anteile berechnen',
    viewBox: '0 0 360 230',
    create(api) {
      let d, k, z, items;
      const pickN = () => { d = R(3, 5); k = R(2, 5); z = R(1, d - 1); };
      pickN();
      api.chips([{ label: 'Neue Aufgabe', onClick() { pickN(); api.replay(); } }]);
      return {
        reset() {
          api.clear(); items = [];
          const tot = d * k;
          for (let i = 0; i < tot; i++) items.push(el('circle', { cx: 40 + (i % 10) * 28, cy: 30 + Math.floor(i / 10) * 28, r: 10, class: 'candy', opacity: 0 }, api.svg));
        },
        async play() {
          const tot = d * k, colW = 300 / d;
          api.say(`Wie viel sind ${fr(z, d)} von <b>${tot}</b>?`);
          for (const c of items) { c.setAttribute('opacity', 1); await api.wait(35); }
          await api.wait(900);
          api.say(`Der Nenner ${d} sagt: in <b>${d} gleich große Teile</b> aufteilen.`);
          const frames = [];
          for (let gI = 0; gI < d; gI++) frames.push(api.svg.insertBefore(el('rect', { x: 30 + gI * colW + 4, y: 90, width: colW - 8, height: k * 26 + 14, rx: 10, class: 'bag', opacity: 0 }), items[0]));
          await api.tw(400, (t) => frames.forEach((f) => f.setAttribute('opacity', t)));
          const from = items.map((c) => [+c.getAttribute('cx'), +c.getAttribute('cy')]);
          await api.tw(1100, (t) => items.forEach((c, i) => {
            const gI = i % d, row = Math.floor(i / d);
            c.setAttribute('cx', lerp(from[i][0], 30 + gI * colW + colW / 2, t));
            c.setAttribute('cy', lerp(from[i][1], 104 + row * 26, t));
          }));
          api.say(`${tot} : ${d} = <b>${k}</b>. Ein Teil (${fr(1, d)}) sind ${k}.`);
          await api.wait(1800);
          api.say(`Der Zähler ${z} sagt: <b>${z} Teile</b> davon nehmen.`);
          items.forEach((c, i) => { if (i % d < z) c.setAttribute('class', 'candy take'); });
          frames.forEach((f, gI) => { if (gI < z) f.setAttribute('class', 'bag take'); });
          await api.wait(1500);
          api.say(`${fr(z, d)} von ${tot} = ${z} · ${k} = <b>${z * k}</b>`);
        },
      };
    },
  });

  // =====================================================
  // Erweitern & Kürzen – feiner unterteilen
  // =====================================================
  reg(['k5-erweitern', 'k5-kuerzen'], {
    title: 'Erweitern & Kürzen',
    viewBox: '0 0 360 190',
    create(api) {
      let p, q, k = 1, hl = [];
      const pickN = () => { q = R(2, 5); p = R(1, q - 1); };
      pickN();
      const x0 = 50, y0 = 20, W = 260, H = 130;
      function scene() {
        api.clear(); hl = [];
        for (let i = 0; i < q; i++) el('rect', { x: x0 + (i * W) / q, y: y0, width: W / q, height: H, class: i < p ? 'cellOn' : 'cellOff' }, api.svg);
        for (let i = 1; i < q; i++) el('line', { x1: x0 + (i * W) / q, y1: y0, x2: x0 + (i * W) / q, y2: y0 + H, class: 'div' }, api.svg);
        el('rect', { x: x0, y: y0, width: W, height: H, class: 'frame' }, api.svg);
        for (let j = 1; j < 6; j++) hl.push(el('line', { x1: x0, y1: y0, x2: x0, y2: y0, class: 'div2', opacity: 0 }, api.svg));
        setK(k, 1);
      }
      function setK(kk, t) {
        hl.forEach((l, j) => {
          if (j + 1 < kk) { const y = y0 + ((j + 1) * H) / kk; l.setAttribute('y1', y); l.setAttribute('y2', y); l.setAttribute('x2', x0 + W * t); l.setAttribute('opacity', 1); }
          else l.setAttribute('opacity', 0);
        });
      }
      const say = (kk) => api.say(`${fr(p, q)} = ${fr(p * kk, q * kk)}` + (kk > 1 ? `  → mit <b>${kk}</b> erweitert. Gleiche Fläche, nur feiner unterteilt!` : '  → Ausgangsbruch'));
      const sl = api.slider({ label: 'Erweitern mit', min: 1, max: 6, value: 1, onInput(v) { k = v; scene(); say(v); } });
      api.chips([{ label: 'Anderer Bruch', onClick() { pickN(); k = 1; sl.value = 1; api.replay(); } }]);
      return {
        reset() { k = 1; sl.value = 1; scene(); },
        async play() {
          api.say(`Die blaue Fläche ist ${fr(p, q)} vom Rechteck.`);
          await api.wait(1600);
          for (const kk of [2, 3, 4]) {
            k = kk; sl.value = kk;
            scene(); setK(kk, 0);
            await api.tw(700, (t) => setK(kk, t));
            say(kk);
            await api.wait(1900);
          }
          api.say(`Erweitern: Zähler <b>und</b> Nenner mit derselben Zahl malnehmen.<br>Kürzen ist der Rückweg: Linien weg, durch dieselbe Zahl teilen: ${fr(p * 4, q * 4)} = ${fr(p, q)}`);
          await api.wait(1200);
          await api.tw(900, (t) => setK(4, 1 - t));
          k = 1; sl.value = 1;
        },
      };
    },
  });

  // =====================================================
  // Bruch · Dezimal · Prozent – Hundertertafel
  // =====================================================
  //   ctx: { mode:'hund', p, q, ask:'prozent'|'dezimal'|'bruch' }, dazu pre/post
  reg('k5-umwandeln', {
    title: 'Die Hundertertafel',
    viewBox: '0 0 360 200',
    create(api, ctx) {
      ctx = ctx || {};
      const list = [[1, 2], [1, 4], [3, 4], [1, 5], [2, 5], [3, 10], [1, 20], [7, 20], [2, 25], [1, 8]];
      let f = [3, 4], cells, half;
      const isTask = () => ctx.post && f[0] === ctx.p && f[1] === ctx.q;
      if (ctx.mode === 'hund' && ctx.post) f = [ctx.p, ctx.q];
      else if (ctx.mode === 'hund' && ctx.pre) {
        // ähnliches Beispiel: anderer Bruch; bei Achteln wieder ein Achtel (halbes Kästchen)
        const pool = list.filter(([a, b]) => !(a === ctx.p && b === ctx.q) && ((b === 8) === (ctx.q === 8)));
        f = pick(pool.length ? pool : [[3, 4]]);
      }
      api.chips(list.map(([a, b]) => ({ label: `${a}/${b}`, onClick() { f = [a, b]; api.replay(); } })));
      return {
        reset() {
          api.clear(); cells = [];
          for (let i = 0; i < 100; i++) cells.push(el('rect', { x: 90 + (i % 10) * 18, y: 10 + Math.floor(i / 10) * 18, width: 16, height: 16, rx: 3, class: 'hc' }, api.svg));
          half = null;
          api.sub(isTask() ? 'Lösung zu deiner Aufgabe' : ctx.pre && ctx.mode === 'hund' ? 'Ein ähnliches Beispiel – deine Aufgabe löst du danach selbst' : '');
        },
        async play() {
          const [a, b] = f, h = (100 * a) / b, k = 100 / b, full = Math.floor(h);
          api.say(`Die Tafel hat 100 Kästchen. Wie viele sind ${fr(a, b)} davon?`);
          await api.wait(1400);
          api.say(Number.isInteger(k)
            ? `Ein ${fr(1, b)} der Tafel: 100 : ${b} = <b>${k}</b> Kästchen.`
            : `Ein ${fr(1, b)} der Tafel: 100 : ${b} = <b>${fmt(k)}</b> Kästchen (also auch halbe Kästchen).`);
          await api.wait(1600);
          api.say(`${fr(a, b)} sind ${a}-mal so viel: ${a} · ${fmt(k)} = <b>${fmt(h)}</b> Kästchen`);
          let shown = 0;
          await api.tw(Math.max(700, h * 22), (t) => { const m = Math.min(full, Math.round(t * h)); for (; shown < m; shown++) cells[shown].setAttribute('class', 'hc on'); }, (t) => t);
          if (h > full) {
            const c = cells[full];
            half = el('rect', { x: +c.getAttribute('x'), y: +c.getAttribute('y'), width: 8, height: 16, rx: 2, class: 'hc on' }, api.svg);
          }
          await api.wait(1000);
          // Zeile 1: auf 100 (bzw. 1000) erweitern, Zeile 2: Dezimalzahl und Prozent
          let line1 = '', from = fr(a, b);
          if (Number.isInteger(k) && b !== 100) { line1 = `Erweitern mit ${k}: ${fr(a, b)} = ${fr(`${a} · ${k}`, `${b} · ${k}`)} = ${fr(h, 100)}<br>`; from = fr(h, 100); }
          else if (!Number.isInteger(k)) { line1 = `Auf 1000 erweitern: ${fr(a, b)} = ${fr(a * (1000 / b), 1000)}<br>`; from = fr(a * (1000 / b), 1000); }
          api.say(`${line1}${from} = <b>${fmt(h / 100)}</b> = <b>${fmt(h)} %</b><br><small>„Prozent“ heißt „von Hundert“: ${fmt(h)} von 100 Kästchen.</small>`);
        },
      };
    },
  });

  // =====================================================
  // Dezimalzahlen · 10 – Stellenwerttafel
  // =====================================================
  reg('k5-dezimal', {
    title: 'Mal 10 – das Komma bleibt, die Ziffern wandern',
    viewBox: '0 0 360 150',
    create(api) {
      const heads = ['T', 'H', 'Z', 'E', 'z', 'h', 't'];
      const colX = (e) => 30 + (3 - e) * 44 + 22 + (e < 0 ? 10 : 0); // e: 3..-3
      let digits; // {e: ziffer}
      const starts = ['3,47', '12,5', '0,86', '4,06', '25,3', '7,125'];
      const setNum = (s) => { digits = {}; const [i, d = ''] = s.split(','); i.split('').reverse().forEach((c, k) => (digits[k] = +c)); d.split('').forEach((c, k) => (digits[-(k + 1)] = +c)); };
      setNum(pick(starts));
      let texts = {};
      const val = () => Object.entries(digits).reduce((s, [e, v]) => s + v * 10 ** e, 0);
      function fill() {
        const es = Object.keys(digits).map(Number);
        const lo = Math.min(0, ...es), hi = Math.max(0, ...es);
        for (let e = lo; e <= hi; e++) if (!(e in digits)) digits[e] = 0;
        // führende Nullen links vom E und Endnullen rechts vom Komma entfernen
        for (let e = hi; e > 0 && digits[e] === 0; e--) delete digits[e];
        for (let e = Math.min(...Object.keys(digits).map(Number)); e < 0 && digits[e] === 0; e++) delete digits[e];
      }
      function scene() {
        api.clear(); texts = {};
        heads.forEach((h, i) => {
          const e = 3 - i;
          el('rect', { x: colX(e) - 22, y: 10, width: 44, height: 110, class: e >= 0 ? 'col' : 'col dec' }, api.svg);
          el('text', { x: colX(e), y: 30, class: 'ex-s', 'text-anchor': 'middle', text: h }, api.svg);
        });
        el('circle', { cx: colX(0) + 27, cy: 92, r: 5, class: 'comma' }, api.svg);
        for (const e in digits) texts[e] = el('text', { x: colX(+e), y: 90, class: 'dig', 'text-anchor': 'middle', text: digits[e] }, api.svg);
        api.say(`Zahl: <b>${fmt(val())}</b>`);
      }
      async function shift(k) {
        const keys = Object.keys(digits).map(Number);
        if (keys.some((e) => e + k > 3 || e + k < -3)) { api.say('Das passt nicht mehr in die Tafel. Probier eine andere Richtung!'); return; }
        const before = fmt(val());
        await api.tw(800, (t) => keys.forEach((e) => texts[e].setAttribute('x', lerp(colX(e), colX(e + k), t))));
        const nd = {}; keys.forEach((e) => (nd[e + k] = digits[e])); digits = nd;
        fill(); scene();
        const op = k > 0 ? '·' : ':', p = 10 ** Math.abs(k);
        api.say(`${before} ${op} ${fmt(p)} = <b>${fmt(val())}</b><br>Jede Ziffer rückt ${Math.abs(k)} Stelle${Math.abs(k) > 1 ? 'n' : ''} nach <b>${k > 0 ? 'links' : 'rechts'}</b>, das Komma bleibt stehen.`);
      }
      const run = (k) => { api.stop(); api.run(() => shift(k)); };
      api.chips([
        { label: '· 10', onClick: () => run(1) }, { label: '· 100', onClick: () => run(2) },
        { label: ': 10', onClick: () => run(-1) }, { label: ': 100', onClick: () => run(-2) },
        { label: 'Neue Zahl', onClick() { setNum(pick(starts)); api.stop(); scene(); } },
      ]);
      return {
        reset: scene,
        async play() {
          await api.wait(1200);
          await shift(1);
          await api.wait(2400);
          await shift(-2);
          await api.wait(2400);
          api.say('Jetzt du: Tippe unten auf <b>· 10</b>, <b>: 10</b> …');
        },
      };
    },
  });

  // =====================================================
  // Arithmetisches Mittel – Türme ausgleichen
  // =====================================================
  reg('k5-mittel', {
    title: 'Der Mittelwert macht alles gerecht',
    viewBox: '0 0 360 240',
    create(api) {
      let vals, m, stacks;
      const S = 22, base = 205;
      const bx = (i) => 60 + i * 72;
      const pickN = () => {
        const n = 4; m = R(3, 5);
        for (;;) { vals = Array.from({ length: n }, () => R(1, 8)); const s = vals.reduce((a, b) => a + b, 0) - vals[3]; const last = m * n - s; if (last >= 1 && last <= 8 && Math.max(...vals.slice(0, 3), last) - Math.min(...vals.slice(0, 3), last) >= 3) { vals[3] = last; break; } }
      };
      pickN();
      api.chips([{ label: 'Neue Werte', onClick() { pickN(); api.replay(); } }]);
      const yOf = (h) => base - (h + 1) * S;
      return {
        reset() {
          api.clear(); stacks = [];
          el('line', { x1: 30, y1: base, x2: 340, y2: base, class: 'ray' }, api.svg);
          vals.forEach((v, i) => {
            el('text', { x: bx(i) + S / 2, y: base + 22, class: 'ex-s', 'text-anchor': 'middle', text: 'Spiel ' + (i + 1) }, api.svg);
            stacks.push(Array.from({ length: v }, (_, h) => el('rect', { x: bx(i), y: yOf(h), width: S, height: S - 2, rx: 4, class: 'blk', opacity: 0 }, api.svg)));
          });
        },
        async play() {
          api.say(`Tore in 4 Spielen: <b>${vals.join(', ')}</b>`);
          for (let h = 0; h < 8; h++) { stacks.forEach((s) => s[h] && s[h].setAttribute('opacity', 1)); await api.wait(110); }
          await api.wait(1000);
          api.say('Wir verteilen die Tore gerecht: von hohen Türmen zu niedrigen.');
          await api.wait(1000);
          for (;;) {
            const hi = stacks.reduce((b, s, i) => (s.length > stacks[b].length ? i : b), 0);
            const lo = stacks.reduce((b, s, i) => (s.length < stacks[b].length ? i : b), 0);
            if (stacks[hi].length <= m) break;
            const blk = stacks[hi].pop();
            blk.setAttribute('class', 'blk mv');
            const fx = bx(hi), fy = +blk.getAttribute('y'), tx = bx(lo), ty = yOf(stacks[lo].length);
            await api.tw(650, (t) => { blk.setAttribute('x', lerp(fx, tx, t)); blk.setAttribute('y', lerp(fy, ty, t) - Math.sin(t * Math.PI) * 40); });
            stacks[lo].push(blk);
          }
          const ln = el('line', { x1: 40, y1: base - m * S, x2: 330, y2: base - m * S, class: 'mean', opacity: 0 }, api.svg);
          await api.tw(400, (t) => ln.setAttribute('opacity', t));
          api.say(`Jetzt sind alle Türme gleich hoch: <b>${m}</b>. Das ist der Mittelwert!<br>Rechnung: (${vals.join(' + ')}) : 4 = ${m * 4} : 4 = <b>${m}</b>`);
        },
      };
    },
  });

  // =====================================================
  // Koordinatensystem – erst laufen, dann springen
  // =====================================================
  reg('k5-koord', {
    title: 'Erst laufen, dann springen',
    viewBox: '0 0 360 250',
    create(api) {
      let px, py, fox, trail;
      const s = 32, ox = 40, oy = 220;
      const pickN = () => { px = R(1, 8); py = R(1, 6); };
      pickN();
      api.chips([{ label: 'Neuer Punkt', onClick() { pickN(); api.replay(); } }]);
      return {
        reset() {
          api.clear();
          for (let i = 0; i <= 9; i++) el('line', { x1: ox + i * s, y1: oy, x2: ox + i * s, y2: oy - 6 * s, class: 'grid' }, api.svg);
          for (let j = 0; j <= 6; j++) el('line', { x1: ox, y1: oy - j * s, x2: ox + 9 * s, y2: oy - j * s, class: 'grid' }, api.svg);
          el('line', { x1: ox, y1: oy, x2: ox + 9 * s + 8, y2: oy, class: 'axis' }, api.svg);
          el('line', { x1: ox, y1: oy, x2: ox, y2: oy - 6 * s - 8, class: 'axis' }, api.svg);
          for (let i = 0; i <= 9; i++) el('text', { x: ox + i * s, y: oy + 16, class: 'tick', 'text-anchor': 'middle', text: i }, api.svg);
          for (let j = 1; j <= 6; j++) el('text', { x: ox - 9, y: oy - j * s + 4, class: 'tick', 'text-anchor': 'end', text: j }, api.svg);
          trail = el('polyline', { points: `${ox},${oy}`, class: 'trail' }, api.svg);
          fox = el('text', { x: ox, y: oy, 'text-anchor': 'middle', class: 'fox', text: '🦊' }, api.svg);
        },
        async play() {
          const pts = [[ox, oy]];
          const put = (x, y) => { fox.setAttribute('x', x); fox.setAttribute('y', y - 4); };
          put(ox, oy);
          api.say('Der Fuchs startet im Ursprung <b>(0 | 0)</b>.');
          await api.wait(1200);
          for (let i = 1; i <= px; i++) {
            api.say(`Erst <b>laufen</b> nach rechts: ${i}`);
            const x0 = ox + (i - 1) * s;
            await api.tw(320, (t) => { put(x0 + s * t, oy); trail.setAttribute('points', pts.concat([[x0 + s * t, oy]]).map((p) => p.join(',')).join(' ')); });
            pts.push([ox + i * s, oy]);
          }
          await api.wait(500);
          for (let j = 1; j <= py; j++) {
            api.say(`… dann <b>springen</b> nach oben: ${j}`);
            const y0 = oy - (j - 1) * s, X = ox + px * s;
            await api.tw(360, (t) => { put(X + Math.sin(t * Math.PI) * 6, y0 - s * t); trail.setAttribute('points', pts.concat([[X, y0 - s * t]]).map((p) => p.join(',')).join(' ')); });
            pts.push([X, oy - j * s]);
          }
          const P = el('circle', { cx: ox + px * s, cy: oy - py * s, r: 7, class: 'pt' }, api.svg);
          P.parentNode.insertBefore(P, fox);
          const fx0 = ox + px * s, fy0 = oy - py * s;
          await api.tw(400, (t) => put(fx0 + 22 * t, fy0 - 6 * t));
          api.say(`Angekommen: <b>P(${px} | ${py})</b><br>Zuerst steht der x-Wert (rechts), dann der y-Wert (hoch).`);
        },
      };
    },
  });

  // =====================================================
  // Winkelarten – der drehende Strahl
  // =====================================================
  const TYPES = (a) =>
    a === 0 ? ['Nullwinkel', 'f6'] : a < 90 ? ['spitzer Winkel', 'f2'] : a === 90 ? ['rechter Winkel', 'f3'] : a < 180 ? ['stumpfer Winkel', 'f4'] :
    a === 180 ? ['gestreckter Winkel', 'f5'] : a < 360 ? ['überstumpfer Winkel', 'f1'] : ['Vollwinkel', 'f3'];
  reg('k5-winkelart', {
    title: 'Winkelarten',
    viewBox: '0 0 360 250',
    create(api) {
      const cx = 180, cy = 128, L = 110;
      let w, ray, lab, sq;
      function scene() {
        api.clear();
        w = el('path', { class: 'wA' }, api.svg);
        sq = el('path', { class: 'wA', opacity: 0 }, api.svg);
        el('line', { x1: cx, y1: cy, x2: cx + L, y2: cy, class: 'ray' }, api.svg);
        ray = el('line', { x1: cx, y1: cy, x2: cx + L, y2: cy, class: 'ray' }, api.svg);
        el('circle', { cx, cy, r: 4, class: 'dot' }, api.svg);
        lab = el('text', { class: 'ex-b', 'text-anchor': 'middle' }, api.svg);
        draw(0);
      }
      function draw(a) {
        a = Math.round(a);
        const p = pt(cx, cy, L, a);
        ray.setAttribute('x2', p[0]); ray.setAttribute('y2', p[1]);
        const right = a === 90;
        w.setAttribute('d', a > 0 && !right ? arcD(cx, cy, 34, 0, a, true) : '');
        sq.setAttribute('opacity', right ? 1 : 0);
        if (right) { const q1 = pt(cx, cy, 24, 0), q2 = pt(cx, cy, 24 * Math.SQRT2, 45), q3 = pt(cx, cy, 24, 90); sq.setAttribute('d', `M ${cx} ${cy} L ${q1} L ${q2} L ${q3} Z`); }
        const lp = pt(cx, cy, 58, a / 2 || 0);
        lab.setAttribute('x', lp[0]); lab.setAttribute('y', lp[1] + 6); lab.textContent = a + '°';
        const [name, col] = TYPES(a);
        api.say(`<span class="exbig ${col}">${name}</span><br>${a === 0 ? 'Beide Schenkel liegen aufeinander.' : a < 90 ? 'kleiner als 90°' : a === 90 ? 'genau 90° – wie eine Zimmerecke' : a < 180 ? 'zwischen 90° und 180°' : a === 180 ? 'genau 180° – eine gerade Linie' : a < 360 ? 'zwischen 180° und 360°' : 'eine ganze Umdrehung: 360°'}`);
      }
      const sl = api.slider({ label: 'Winkel drehen', min: 0, max: 360, value: 0, onInput(v) { draw(v); } });
      return {
        reset: scene,
        async play() {
          const seg = async (a0, a1, ms) => api.tw(ms, (t) => { const a = lerp(a0, a1, t); sl.value = Math.round(a); draw(a); }, (t) => t);
          await seg(0, 60, 1400); await api.wait(1000);
          await seg(60, 90, 700); await api.wait(1500);
          await seg(90, 140, 1000); await api.wait(1000);
          await seg(140, 180, 800); await api.wait(1500);
          await seg(180, 290, 1800); await api.wait(1000);
          await seg(290, 360, 1200); await api.wait(1200);
          await seg(360, 45, 1500);
        },
      };
    },
  });

  // =====================================================
  // Winkel an Geraden – Neben-, Scheitel-, Stufen-, Wechselwinkel
  // =====================================================
  reg('k5-winkelpaar', {
    title: 'Winkel an Geraden',
    viewBox: '0 0 360 230',
    create(api) {
      let mode = 'a', alpha = 60;
      const cx = 180, cy = 115;
      function sceneA(a) {
        api.clear();
        const rg = [[0, a], [a, 180], [180, 180 + a], [180 + a, 360]];
        rg.forEach((r, i) => el('path', { d: arcD(cx, cy, 30, r[0], r[1], true), class: i % 2 ? 'wB' : 'wA' }, api.svg));
        el('line', { x1: 20, y1: cy, x2: 340, y2: cy, class: 'ray' }, api.svg);
        const p0 = pt(cx, cy, 200, a), p1 = pt(cx, cy, 200, a + 180);
        el('line', { x1: p0[0], y1: p0[1], x2: p1[0], y2: p1[1], class: 'ray' }, api.svg);
        const names = ['α', 'β', 'α′', 'β′'];
        rg.forEach((r, i) => { const lp = pt(cx, cy, 52, (r[0] + r[1]) / 2); el('text', { x: lp[0], y: lp[1] + 5, class: i % 2 ? 'blbl' : 'albl', 'text-anchor': 'middle', text: `${names[i]}=${i % 2 ? 180 - a : a}°` }, api.svg); });
        api.say(`<b class="cA">α</b> und <b class="cB">β</b> sind <b>Nebenwinkel</b>: ${a}° + ${180 - a}° = <b>180°</b><br><b class="cA">α</b> und <b class="cA">α′</b> liegen sich gegenüber: <b>Scheitelwinkel</b>, immer gleich groß.`);
      }
      const yT = 70, yB = 165;
      let copy;
      function sceneB() {
        api.clear();
        const a = 62, cot = 1 / Math.tan(rad(a));
        const xT = 180 + ((yB - yT) / 2) * cot, xB = 180 - ((yB - yT) / 2) * cot;
        el('line', { x1: 20, y1: yT, x2: 340, y2: yT, class: 'ray' }, api.svg);
        el('line', { x1: 20, y1: yB, x2: 340, y2: yB, class: 'ray' }, api.svg);
        el('text', { x: 336, y: yT - 7, class: 'tick b', 'text-anchor': 'end', text: 'g' }, api.svg);
        el('text', { x: 336, y: yB - 7, class: 'tick b', 'text-anchor': 'end', text: 'h' }, api.svg);
        const p0 = pt(xT, yT, 160, a), p1 = pt(xT, yT, 260, a + 180);
        el('line', { x1: p0[0], y1: p0[1], x2: p1[0], y2: p1[1], class: 'ray' }, api.svg);
        el('path', { d: arcD(xT, yT, 30, 0, a, true), class: 'wA' }, api.svg);
        const lp = pt(xT, yT, 48, a / 2);
        el('text', { x: lp[0], y: lp[1] + 5, class: 'albl', 'text-anchor': 'middle', text: 'α' }, api.svg);
        copy = el('g', { opacity: 0 }, api.svg);
        el('path', { d: arcD(xT, yT, 30, 0, a, true), class: 'wB' }, copy);
        const lp2 = pt(xT, yT, 48, a / 2);
        copy.lab = el('text', { x: lp2[0], y: lp2[1] + 5, class: 'blbl', 'text-anchor': 'middle', text: 'α' }, copy);
        return { xT, xB, a };
      }
      const sl = api.slider({ label: 'Gerade drehen', min: 20, max: 160, value: alpha, onInput(v) { if (mode !== 'a') return; alpha = v; sceneA(v); } });
      const sliderRow = sl.closest('.exslider');
      api.chips([
        { label: 'Neben- & Scheitelwinkel', onClick() { mode = 'a'; sliderRow.style.display = ''; api.replay(); } },
        { label: 'Stufen- & Wechselwinkel', onClick() { mode = 'b'; sliderRow.style.display = 'none'; api.replay(); } },
      ]);
      return {
        reset() { mode === 'a' ? sceneA(alpha) : sceneB(); },
        async play() {
          if (mode === 'a') {
            await api.wait(2500);
            const seg = (a0, a1, ms) => api.tw(ms, (t) => { alpha = Math.round(lerp(a0, a1, t)); sl.value = alpha; sceneA(alpha); });
            await seg(alpha, 130, 2200); await api.wait(1800);
            await seg(130, 35, 2200); await api.wait(1800);
            await seg(35, 60, 900);
            return;
          }
          const { xT, xB } = sceneB();
          api.say('g und h sind parallel. Oben siehst du den Winkel <b class="cA">α</b>.');
          await api.wait(1800);
          api.say('Wir schieben eine Kopie an der schrägen Geraden entlang nach unten …');
          copy.setAttribute('opacity', 1);
          await api.tw(1600, (t) => copy.setAttribute('transform', `translate(${(xB - xT) * t},${(yB - yT) * t})`));
          api.say('… sie passt genau! Das ist der <b>Stufenwinkel</b>. Stufenwinkel an Parallelen sind gleich groß.');
          await api.wait(2600);
          api.say('Jetzt drehen wir die Kopie um 180° um den Schnittpunkt …');
          await api.tw(1500, (t) => copy.setAttribute('transform', `translate(${xB - xT},${yB - yT}) rotate(${180 * t} ${xT} ${yT})`));
          copy.lab.setAttribute('transform', `rotate(180 ${copy.lab.getAttribute('x')} ${+copy.lab.getAttribute('y') - 5})`);
          api.say('Das ist der <b>Wechselwinkel</b>: auch er ist genau so groß wie <b class="cA">α</b>.');
        },
      };
    },
  });

  // =====================================================
  // Rechteck – Fläche auslegen, Umfang ablaufen
  // =====================================================
  reg('k5-rechteck', {
    title: 'Fläche und Umfang',
    viewBox: '0 0 360 200',
    create(api) {
      let a, b, mode = 'A';
      const s = 34;
      const pickN = () => { a = R(4, 8); b = R(2, 4); };
      pickN();
      const x0 = () => 180 - (a * s) / 2, y0 = 26;
      api.chips([
        { label: 'Flächeninhalt', onClick() { mode = 'A'; api.replay(); } },
        { label: 'Umfang', onClick() { mode = 'U'; api.replay(); } },
        { label: 'Neues Rechteck', onClick() { pickN(); api.replay(); } },
      ]);
      return {
        reset() {
          api.clear();
          api.svg.setAttribute('viewBox', `0 0 360 ${y0 + b * s + 50}`);
          el('rect', { x: x0(), y: y0, width: a * s, height: b * s, class: 'shape' }, api.svg);
          el('text', { x: 180, y: y0 + b * s + 24, class: 'ex-s', 'text-anchor': 'middle', text: `a = ${a} cm` }, api.svg);
          el('text', { x: x0() + a * s + 8, y: y0 + (b * s) / 2 + 5, class: 'ex-s', text: `b = ${b} cm` }, api.svg);
        },
        async play() {
          if (mode === 'A') {
            api.say(`Wie viele <b>1-cm²-Kästchen</b> passen hinein?`);
            await api.wait(1000);
            let c = 0;
            for (let r = 0; r < b; r++) {
              for (let k = 0; k < a; k++) {
                c++;
                const sq = el('rect', { x: x0() + k * s + 2, y: y0 + r * s + 2, width: s - 4, height: s - 4, rx: 4, class: 'unit' }, api.svg);
                el('text', { x: x0() + k * s + s / 2, y: y0 + r * s + s / 2 + 5, class: 'ex-s', 'text-anchor': 'middle', text: c }, api.svg);
                sq.setAttribute('opacity', 1);
                await api.wait(r === 0 ? 260 : 90);
              }
              api.say(`${r + 1} Reihe${r ? 'n' : ''} mit je ${a} Kästchen = ${(r + 1) * a}`);
              await api.wait(700);
            }
            api.say(`${b} Reihen · ${a} Kästchen: <b>A = a · b = ${a} · ${b} = ${a * b} cm²</b>`);
          } else {
            const X = x0(), Y = y0, W = a * s, H = b * s;
            const path = [[X, Y], [X + W, Y], [X + W, Y + H], [X, Y + H], [X, Y]];
            const sides = [a, b, a, b];
            const dot = el('circle', { cx: X, cy: Y, r: 8, class: 'mk' }, api.svg);
            const line = el('polyline', { points: `${X},${Y}`, class: 'trail2' }, api.svg);
            const done = [[X, Y]];
            let sum = [];
            api.say('Der Umfang ist der Weg einmal ganz außen herum.');
            await api.wait(1200);
            for (let i = 0; i < 4; i++) {
              const [fx, fy] = path[i], [tx, ty] = path[i + 1];
              await api.tw(900, (t) => { const x = lerp(fx, tx, t), y = lerp(fy, ty, t); dot.setAttribute('cx', x); dot.setAttribute('cy', y); line.setAttribute('points', done.concat([[x, y]]).map((p) => p.join(',')).join(' ')); });
              done.push([tx, ty]); sum.push(sides[i]);
              api.say(`${sum.join(' cm + ')} cm = <b>${sum.reduce((p, q) => p + q, 0)} cm</b>`);
              await api.wait(500);
            }
            api.say(`<b>u = 2 · a + 2 · b = 2 · ${a} + 2 · ${b} = ${2 * (a + b)} cm</b>`);
          }
        },
      };
    },
  });

  // =====================================================
  // Quader – Würfel stapeln
  // =====================================================
  reg('k5-quader', {
    title: 'Volumen: Würfel stapeln',
    viewBox: '0 0 360 230',
    create(api) {
      let a, b, c;
      const pickN = () => { a = R(2, 4); b = R(2, 3); c = R(2, 3); };
      pickN();
      const s = 26, cs = Math.cos(rad(30)) * s, sn = 0.5 * s;
      const P = (x, y, z) => [180 + (x - y) * cs, 120 + (x + y) * sn - z * s - 10];
      const poly = (pts, cls, g) => el('polygon', { points: pts.map((p) => P(...p).map((v) => v.toFixed(1)).join(',')).join(' '), class: cls }, g);
      function cube(i, j, k, g) {
        const cg = el('g', { opacity: 0 }, g);
        poly([[i, j, k + 1], [i + 1, j, k + 1], [i + 1, j + 1, k + 1], [i, j + 1, k + 1]], 'cT', cg);
        poly([[i + 1, j, k], [i + 1, j + 1, k], [i + 1, j + 1, k + 1], [i + 1, j, k + 1]], 'cR', cg);
        poly([[i, j + 1, k], [i + 1, j + 1, k], [i + 1, j + 1, k + 1], [i, j + 1, k + 1]], 'cL', cg);
        return cg;
      }
      api.chips([{ label: 'Neuer Quader', onClick() { pickN(); api.replay(); } }]);
      return {
        reset() { api.clear(); },
        async play() {
          api.say(`Ein Quader: ${a} cm lang, ${b} cm breit, ${c} cm hoch. Jeder Würfel ist <b>1 cm³</b>.`);
          await api.wait(1500);
          let n = 0;
          for (let k = 0; k < c; k++) {
            const order = [];
            for (let i = 0; i < a; i++) for (let j = 0; j < b; j++) order.push([i, j]);
            order.sort((p, q) => p[0] + p[1] - (q[0] + q[1]));
            for (const [i, j] of order) {
              const cg = cube(i, j, k, api.svg);
              n++;
              await api.tw(k === 0 ? 220 : 90, (t) => { cg.setAttribute('opacity', t); cg.setAttribute('transform', `translate(0,${(1 - t) * -14})`); });
            }
            api.say(k === 0
              ? `1. Schicht: ${a} · ${b} = <b>${a * b} Würfel</b>`
              : `${k + 1} Schichten · ${a * b} Würfel = <b>${n} Würfel</b>`);
            await api.wait(1300);
          }
          const la = P(a / 2, b, 0), lb = P(a, b / 2, 0), lc = P(a, 0, c / 2);
          el('text', { x: la[0] - 18, y: la[1] + 20, class: 'ex-s', 'text-anchor': 'middle', text: `a = ${a}` }, api.svg);
          el('text', { x: lb[0] + 20, y: lb[1] + 18, class: 'ex-s', text: `b = ${b}` }, api.svg);
          el('text', { x: lc[0] + 14, y: lc[1], class: 'ex-s', text: `c = ${c}` }, api.svg);
          api.say(`<b>V = a · b · c = ${a} · ${b} · ${c} = ${a * b * c} cm³</b><br>Länge mal Breite gibt die Schicht, mal Höhe die Anzahl Schichten.`);
        },
      };
    },
  });

  // =====================================================
  // Gleichungen – die Waage
  // =====================================================
  reg('k5-gleichung', {
    title: 'Gleichungen sind Waagen',
    viewBox: '0 0 360 230',
    create(api) {
      let a, xv, beam, L, Rr;
      const pickN = () => { a = R(2, 4); xv = R(2, 5); };
      pickN();
      const cx = 180, cy = 70;
      function weight(g, i, x0, yb, per) {
        const col = i % per, row = Math.floor(i / per);
        const r = el('rect', { x: x0 + col * 21, y: yb - 20 - row * 21, width: 19, height: 19, rx: 4, class: 'wt' }, g);
        el('text', { x: x0 + col * 21 + 9.5, y: yb - 6 - row * 21, class: 'ex-xs', 'text-anchor': 'middle', text: '1' }, g);
        return r;
      }
      api.chips([{ label: 'Neue Gleichung', onClick() { pickN(); api.replay(); } }]);
      return {
        reset() {
          api.clear();
          el('polygon', { points: `${cx},${cy} ${cx - 22},${cy + 130} ${cx + 22},${cy + 130}`, class: 'stand' }, api.svg);
          el('line', { x1: cx - 70, y1: cy + 130, x2: cx + 70, y2: cy + 130, class: 'ray' }, api.svg);
          beam = el('g', {}, api.svg);
          el('line', { x1: cx - 120, y1: cy, x2: cx + 120, y2: cy, class: 'beam' }, beam);
          el('circle', { cx, cy, r: 6, class: 'dot' }, beam);
          const pan = (x) => { el('line', { x1: x, y1: cy, x2: x, y2: cy + 70, class: 'rope' }, beam); el('path', { d: `M ${x - 56} ${cy + 70} L ${x + 56} ${cy + 70} L ${x + 44} ${cy + 80} L ${x - 44} ${cy + 80} Z`, class: 'pan' }, beam); };
          pan(cx - 120); pan(cx + 120);
          L = el('g', {}, beam); Rr = el('g', {}, beam);
          const box = el('g', {}, L);
          el('rect', { x: cx - 172, y: cy + 36, width: 34, height: 34, rx: 6, class: 'xbox' }, box);
          el('text', { x: cx - 155, y: cy + 59, class: 'ex-b', 'text-anchor': 'middle', fill: '#fff', text: 'x' }, box);
          L.ws = Array.from({ length: a }, (_, i) => weight(L, i, cx - 134, cy + 70, 3));
          Rr.ws = Array.from({ length: a + xv }, (_, i) => weight(Rr, i, cx + 78, cy + 70, 4));
        },
        async play() {
          api.say(`Die Waage ist im Gleichgewicht: <b>x + ${a} = ${a + xv}</b>`);
          await api.wait(2000);
          api.say(`Wir nehmen links <b>${a}</b> weg …`);
          const lw = [...L.querySelectorAll('rect.wt, text.ex-xs')];
          await api.tw(700, (t) => { lw.forEach((e) => e.setAttribute('opacity', 1 - t)); beam.setAttribute('transform', `rotate(${8 * t} ${cx} ${cy})`); });
          api.say(`… jetzt kippt sie! Also auch rechts <b>${a}</b> wegnehmen.`);
          await api.wait(1400);
          const rw = [...Rr.querySelectorAll('rect.wt, text.ex-xs')].filter((e, i) => i >= 2 * xv);
          await api.tw(800, (t) => { rw.forEach((e) => e.setAttribute('opacity', 1 - t)); beam.setAttribute('transform', `rotate(${8 * (1 - t)} ${cx} ${cy})`); });
          api.say(`Wieder im Gleichgewicht: <b>x = ${a + xv} − ${a} = ${xv}</b><br>Was du auf einer Seite machst, machst du auch auf der anderen.`);
        },
      };
    },
  });

  // =====================================================
  // Fahrplan – Zeitstrahl mit Sprüngen
  // =====================================================
  reg('k5-fahrplan', {
    title: 'Zeitspannen mit Sprüngen',
    viewBox: '0 0 360 170',
    create(api) {
      let t0, dur;
      const pickN = () => { t0 = R(6, 19) * 60 + R(31, 55); dur = R(20, 60); };
      pickN();
      const hm = (t) => `${String(Math.floor(t / 60) % 24).padStart(2, '0')}:${String(t % 60).padStart(2, '0')}`;
      api.chips([{ label: 'Neue Fahrt', onClick() { pickN(); api.replay(); } }]);
      return {
        reset() { api.clear(); },
        async play() {
          const full = Math.ceil(t0 / 60) * 60, j1 = full - t0, j2 = dur - j1, end = t0 + dur;
          const k = 290 / dur, X = (t) => 35 + (t - t0) * k, y = 110;
          el('line', { x1: 25, y1: y, x2: 340, y2: y, class: 'ray' }, api.svg);
          for (let t = Math.ceil(t0 / 5) * 5; t <= end; t += 5) el('line', { x1: X(t), y1: y - (t % 60 ? 4 : 10), x2: X(t), y2: y + (t % 60 ? 4 : 10), class: 'tk' }, api.svg);
          const lab = (t, c) => el('text', { x: X(t), y: y + 30, class: 'ex-s ' + (c || ''), 'text-anchor': 'middle', text: hm(t) }, api.svg);
          lab(t0, 'f2');
          api.say(`Abfahrt um <b>${hm(t0)} Uhr</b>, Fahrzeit <b>${dur} min</b>.`);
          await api.wait(1500);
          const jump = async (a, b, txt) => {
            const p = el('path', { d: `M ${X(a)} ${y} Q ${(X(a) + X(b)) / 2} ${y - 70} ${X(b)} ${y}`, class: 'jump' }, api.svg);
            const L = p.getTotalLength();
            p.style.strokeDasharray = L; p.style.strokeDashoffset = L;
            await api.tw(900, (t) => (p.style.strokeDashoffset = L * (1 - t)));
            el('text', { x: (X(a) + X(b)) / 2, y: y - 42, class: 'ex-b f1', 'text-anchor': 'middle', text: txt }, api.svg);
          };
          api.say(`Erst bis zur vollen Stunde: ${hm(t0)} → ${hm(full)} sind <b>${j1} min</b>.`);
          await jump(t0, full, `+${j1}`); lab(full);
          await api.wait(1700);
          api.say(`Bleiben noch ${dur} − ${j1} = <b>${j2} min</b>.`);
          await jump(full, end, `+${j2}`); lab(end, 'f3');
          await api.wait(1200);
          api.say(`Ankunft: <b>${hm(end)} Uhr</b><br>Trick: Immer erst bis zur vollen Stunde springen!`);
        },
      };
    },
  });

  // =====================================================
  // Einheiten – Zoom ins Lineal
  // =====================================================
  reg('k5-einheit', {
    title: 'Zoom ins Maßband',
    viewBox: '0 0 360 150',
    create(api) {
      const steps = [['1 m', 'dm'], ['1 dm', 'cm'], ['1 cm', 'mm']];
      let g;
      function bar(big, small) {
        g = el('g', {}, api.svg);
        el('rect', { x: 30, y: 50, width: 300, height: 34, rx: 4, class: 'rul' }, g);
        for (let i = 0; i <= 10; i++) el('line', { x1: 30 + i * 30, y1: 50, x2: 30 + i * 30, y2: i % 5 ? 64 : 72, class: 'tk' }, g);
        for (let i = 0; i < 10; i++) el('text', { x: 45 + i * 30, y: 100, class: 'ex-xs', 'text-anchor': 'middle', text: `1 ${small}` }, g);
        el('text', { x: 180, y: 36, class: 'ex-b', 'text-anchor': 'middle', text: `${big} = 10 ${small}` }, g);
        return g;
      }
      return {
        reset() { api.clear(); },
        async play() {
          for (let s = 0; s < 3; s++) {
            api.clear();
            const gg = bar(...steps[s]);
            await api.tw(500, (t) => gg.setAttribute('opacity', t));
            api.say(`<b>${steps[s][0]} = 10 ${steps[s][1]}</b>`);
            await api.wait(1700);
            if (s < 2) {
              api.say(`Wir zoomen in <b>1 ${steps[s][1]}</b> hinein …`);
              const hl = el('rect', { x: 60, y: 46, width: 30, height: 42, rx: 4, class: 'zoom' }, api.svg);
              await api.wait(500);
              await api.tw(1100, (t) => { hl.setAttribute('x', lerp(60, 30, t)); hl.setAttribute('width', lerp(30, 300, t)); gg.setAttribute('opacity', 1 - t); });
            }
          }
          api.say('<b>1 m = 10 dm = 100 cm = 1000 mm</b><br>Bei Längen ist jede Stufe <b>10-mal</b> so klein. (Bei Flächen 100-mal, bei Volumen 1000-mal!)');
        },
      };
    },
  });

  // =====================================================
  // Bonus: Was ist π? – das abrollende Rad
  // =====================================================
  reg('pi', {
    title: 'Was ist π? Das abrollende Rad',
    viewBox: '0 0 360 200',
    bonus: 'Vorschau Klasse 9',
    create(api) {
      const r = 34, d = 2 * r, x0 = 42, gy = 160;
      let wheel, rimLeft, spokes, P, roll, ticks;
      function draw(th) {
        const cx = x0 + r * th, cy = gy - r;
        wheel.setAttribute('transform', `translate(${cx},${cy})`);
        spokes.setAttribute('transform', `rotate(${(th * 180) / Math.PI})`);
        const span = 360 - (th * 180) / Math.PI;
        rimLeft.setAttribute('d', span > 0.5 ? arcD(0, 0, r, -90, -90 + span, false) : '');
        const pp = pt(0, 0, r, -90 - (th * 180) / Math.PI);
        P.setAttribute('cx', pp[0]); P.setAttribute('cy', pp[1]);
        roll.setAttribute('x2', x0 + r * th);
      }
      return {
        reset() {
          api.clear();
          el('line', { x1: 10, y1: gy, x2: 350, y2: gy, class: 'ray' }, api.svg);
          ticks = el('g', { opacity: 0 }, api.svg);
          for (let k = 0; k <= 3; k++) {
            el('line', { x1: x0 + k * d, y1: gy - 8, x2: x0 + k * d, y2: gy + 8, class: 'tk' }, ticks);
            if (k) el('text', { x: x0 + k * d, y: gy + 26, class: 'ex-s f2', 'text-anchor': 'middle', text: k + ' d' }, ticks);
            if (k) el('line', { x1: x0 + (k - 1) * d + 2, y1: gy + 8, x2: x0 + k * d - 2, y2: gy + 8, class: 'dseg' }, ticks);
          }
          roll = el('line', { x1: x0, y1: gy, x2: x0, y2: gy, class: 'unroll' }, api.svg);
          wheel = el('g', {}, api.svg);
          el('circle', { cx: 0, cy: 0, r, class: 'rimBase' }, wheel);
          rimLeft = el('path', { class: 'rim' }, wheel);
          spokes = el('g', {}, wheel);
          el('line', { x1: -r, y1: 0, x2: r, y2: 0, class: 'diam' }, spokes);
          el('line', { x1: 0, y1: -r, x2: 0, y2: r, class: 'spoke' }, spokes);
          el('circle', { cx: 0, cy: 0, r: 3.5, class: 'dot' }, wheel);
          P = el('circle', { r: 5.5, class: 'pt' }, wheel);
          draw(0);
        },
        async play() {
          api.say('Ein Rad mit dem Durchmesser <b class="cB2">d</b> (blaue Linie). Wie lang ist sein Rand, der <b class="cB">Umfang</b>?');
          await api.wait(2800);
          api.say('Zum Vergleich tragen wir den Durchmesser dreimal auf dem Boden ab.');
          await api.tw(700, (t) => ticks.setAttribute('opacity', t));
          await api.wait(1600);
          api.say('Jetzt rollen wir das Rad genau <b>eine Umdrehung</b> ab. Der orange Rand legt sich auf den Boden …');
          await api.wait(1200);
          await api.tw(5000, (t) => draw(t * 2 * Math.PI), (t) => t);
          const endX = x0 + Math.PI * d;
          el('line', { x1: endX, y1: gy - 14, x2: endX, y2: gy + 14, class: 'piMark' }, api.svg);
          el('text', { x: endX, y: gy - 22 - 2 * r, class: 'ex-b f1', 'text-anchor': 'middle', text: 'π · d' }, api.svg);
          api.say('Der Umfang ist <b>etwas mehr als 3 Durchmesser</b>, genau <b>3,14159…</b> mal so lang.<br>Diese Zahl heißt <b>π (Pi)</b>: <b>u = π · d</b>, und das gilt für <i>jeden</i> Kreis!');
        },
      };
    },
  });

  // =====================================================
  // Vorrangregeln – der Rechenbaum
  //   ctx: { mode:'tree', e:'40 − 3 · (2 + 3)', pre, post }
  //   pre = ähnliche Rechnung mit anderen Zahlen, post = genau die Rechnung der Aufgabe
  // =====================================================
  const PREC = { '+': 1, '−': 1, '·': 2, ':': 2, '^': 3 };
  const calc = (op, a, b) => (op === '+' ? a + b : op === '−' ? a - b : op === '·' ? a * b : op === ':' ? a / b : a ** b);
  const needPar = (ch, pOp, right) => !!ch.op && (PREC[ch.op] < PREC[pOp] || (right && PREC[ch.op] === PREC[pOp] && (pOp === '−' || pOp === ':')));
  // Liest Rechnungen wie „5 + 3² · (12 − 4) : 2“ als Baum { op, l, r } bzw. { v }
  function parseExpr(str) {
    const toks = str.match(/\d+|[+−·:()²]/g) || [];
    let i = 0;
    const peek = () => toks[i], next = () => toks[i++];
    function primary() {
      let n;
      if (peek() === '(') { next(); n = sum(); next(); } else n = { v: +next() };
      while (peek() === '²') { next(); n = { op: '^', l: n, r: { v: 2 } }; }
      return n;
    }
    function prod() { let n = primary(); while (peek() === '·' || peek() === ':') { const op = next(); n = { op, l: n, r: primary() }; } return n; }
    function sum() { let n = prod(); while (peek() === '+' || peek() === '−') { const op = next(); n = { op, l: n, r: prod() }; } return n; }
    return sum();
  }
  // Wert, oder NaN wenn ein Zwischenergebnis negativ, nicht ganzzahlig oder zu groß ist
  function treeVal(n) {
    if (!n.op) return n.v;
    const a = treeVal(n.l), b = treeVal(n.r), v = calc(n.op, a, b);
    return Number.isInteger(v) && v >= 0 && v <= 2000 ? v : NaN;
  }
  // Ähnliche Rechnung: gleicher Aufbau, andere Zahlen (für „Beispiel vorher“)
  function similarExpr(str) {
    for (let k = 0; k < 400; k++) {
      const s = str.replace(/\d+/g, (m) => { const v = +m; return String(v <= 12 ? R(2, 9) : R(Math.max(10, v - 25), v + 25)); });
      if (s !== str && !Number.isNaN(treeVal(parseExpr(s)))) return s;
    }
    return null;
  }
  reg('k5-vorrang', {
    title: 'Der Rechenbaum: wer gehört zu wem?',
    viewBox: '0 0 360 275',
    create(api, ctx) {
      ctx = ctx || {};
      const taskE = ctx.e ? (ctx.post ? ctx.e : ctx.pre ? similarExpr(ctx.e) : null) : null;
      let mode = taskE ? 'task' : 'punkt', a, b, c, root, exprT, edgesG, nodesG, startE = '';
      const N = (v) => ({ v });
      const O = (op, l, r) => ({ op, l, r });
      const pickN = () => { a = R(2, 9); do b = R(2, 9); while (b === a); do c = R(2, 9); while (c === a || c === b); };
      pickN();
      function build() {
        if (mode === 'task') return parseExpr(taskE);
        if (mode === 'punkt') return O('+', N(a), O('·', N(b), N(c)));
        if (mode === 'klammer') return O('·', O('+', N(a), N(b)), N(c));
        const bb = R(2, 4), cc = R(2, 5), dd = R(2, 5), aa = bb * (cc + dd) + R(3, 25);
        return O('−', N(aa), O('·', N(bb), O('+', N(cc), N(dd))));
      }
      const value = (n) => (n.op ? calc(n.op, value(n.l), value(n.r)) : n.v);
      const plain = (n, p, right) => {
        if (!n.op) return String(n.v);
        if (n.op === '^') return `${plain(n.l, '^', false)}²`;
        const s = `${plain(n.l, n.op, false)} ${n.op} ${plain(n.r, n.op, true)}`;
        return p && needPar(n, p, right) ? `(${s})` : s;
      };
      function segs(n, hot, inHot, p, right) {
        const h = inHot || n === hot;
        if (!n.op) return [[String(n.v), h]];
        let out = n.op === '^'
          ? [...segs(n.l, hot, h, '^', false), ['²', h]]
          : [...segs(n.l, hot, h, n.op, false), [` ${n.op} `, h], ...segs(n.r, hot, h, n.op, true)];
        if (p && needPar(n, p, right)) out = [['(', h], ...out, [')', h]];
        return out;
      }
      function showExpr(hot) {
        exprT.innerHTML = '';
        for (const [t, h] of segs(root, hot, false, null, false)) {
          const s = el('tspan', { text: t }, exprT);
          if (h) s.setAttribute('class', 'f1');
        }
      }
      function layout() {
        const leaves = [];
        (function walk(n, dep) {
          n.dep = dep;
          if (!n.op) { leaves.push(n); return; }
          walk(n.l, dep + 1); walk(n.r, dep + 1);
        })(root, 0);
        const maxDep = Math.max(...leaves.map((l) => l.dep));
        const dy = maxDep > 3 ? 44 : 56;
        const step = leaves.length > 1 ? Math.min(110, 290 / (leaves.length - 1)) : 0;
        const x0 = 180 - (step * (leaves.length - 1)) / 2;
        leaves.forEach((n, i) => (n.x = x0 + i * step));
        (function px(n) { n.y = 92 + n.dep * dy; if (n.op) { px(n.l); px(n.r); n.x = (n.l.x + n.r.x) / 2; } })(root);
      }
      function drawLeaf(n, res) {
        n.g.innerHTML = '';
        const w = String(n.v).length > 2 ? 52 : 44;
        el('rect', { x: -w / 2, y: -17, width: w, height: 34, rx: 9, class: res ? 'vnum vres' : 'vnum' }, n.g);
        el('text', { x: 0, y: 7, class: 'ex-b', 'text-anchor': 'middle', text: n.v }, n.g);
      }
      function draw() {
        edgesG.innerHTML = ''; nodesG.innerHTML = '';
        (function d(n) {
          if (n.op) {
            n.el = el('line', { x1: n.x, y1: n.y, x2: n.l.x, y2: n.l.y, class: 'vedge' }, edgesG);
            n.er = el('line', { x1: n.x, y1: n.y, x2: n.r.x, y2: n.r.y, class: 'vedge' }, edgesG);
            d(n.l); d(n.r);
          }
          n.g = el('g', { transform: `translate(${n.x},${n.y})` }, nodesG);
          if (n.op) {
            n.c = el('circle', { r: 19, class: 'vop' }, n.g);
            if (n.op === '^') el('text', { x: 0, y: 4, class: 'ex-xs', fill: 'var(--ink)', style: 'fill:var(--ink)', 'text-anchor': 'middle', text: 'hoch' }, n.g);
            else el('text', { x: 0, y: 7, class: 'ex-b', 'text-anchor': 'middle', text: n.op }, n.g);
          } else drawLeaf(n, false);
        })(root);
      }
      function order() { const o = []; (function w(n) { if (n.op) { w(n.l); w(n.r); o.push(n); } })(root); return o; }
      function parentOf(t) { let p = null; (function w(n) { if (n.op) { if (n.l === t || n.r === t) p = n; w(n.l); w(n.r); } })(root); return p; }
      function reason(n) {
        const p = parentOf(n);
        if (p && needPar(n, p.op, p.r === n)) return '<b>Klammer zuerst</b>';
        if (n.op === '^') return '<b>Hochzahl zuerst</b>';
        if (PREC[n.op] === 2 && order().some((m) => m !== n && PREC[m.op] === 1)) return '<b>Punkt vor Strich</b>';
        if (!p) return 'Zum Schluss';
        return 'Von links nach rechts';
      }
      const chips = api.chips([
        { label: 'a + b · c', onClick() { mode = 'punkt'; api.replay(); } },
        { label: '(a + b) · c', onClick() { mode = 'klammer'; api.replay(); } },
        { label: 'Längere Rechnung', onClick() { mode = 'lang'; api.replay(); } },
        { label: 'Neue Zahlen', onClick() { pickN(); if (mode === 'task') mode = 'punkt'; api.replay(); } },
      ]);
      const relabel = () => { const bs = chips.querySelectorAll('button'); bs[0].textContent = `${a} + ${b} · ${c}`; bs[1].textContent = `(${a} + ${b}) · ${c}`; };
      const sub = () => api.sub(mode !== 'task' ? '' : ctx.post ? 'Lösung zu deiner Aufgabe als Rechenbaum' : 'Ein ähnliches Beispiel – deine Aufgabe löst du danach selbst');
      return {
        reset() {
          api.clear();
          relabel(); sub();
          root = build();
          exprT = el('text', { x: 180, y: 40, class: 'vexpr', 'text-anchor': 'middle' }, api.svg);
          edgesG = el('g', {}, api.svg); nodesG = el('g', {}, api.svg);
          layout(); draw(); showExpr(null); startE = plain(root);
          edgesG.setAttribute('opacity', 0); nodesG.setAttribute('opacity', 0);
        },
        async play() {
          const total = value(root);
          if (mode === 'punkt') api.say(`Wer gehört zu wem? Bei <b>${plain(root)}</b> hält das <b>Mal</b> die ${b} und die ${c} fester zusammen als das Plus.`);
          else if (mode === 'klammer') api.say(`Die <b>Klammer</b> packt ${a} und ${b} zu einem Paket zusammen.`);
          else if (mode === 'task') api.say(`Wer gehört bei <b>${plain(root)}</b> zu wem? Der Baum zeigt es.`);
          else api.say('Eine längere Rechnung. Der Baum zeigt, was zusammengehört.');
          await api.tw(800, (t) => { edgesG.setAttribute('opacity', t); nodesG.setAttribute('opacity', t); });
          await api.wait(2200);
          api.say('Gerechnet wird <b>von unten nach oben</b>: Immer zwei Zahlen werden zu einer.');
          await api.wait(2000);
          const log = [];
          for (const n of order()) {
            const x = value(n.l), y = value(n.r), v = calc(n.op, x, y);
            n.c.setAttribute('class', 'vop vhot');
            showExpr(n);
            const calcTxt = `${n.op === '^' ? `${x}² = ${x} · ${x}` : `${x} ${n.op} ${y}`} = ${v}`;
            log.push([reason(n).replace(/<[^>]+>/g, ''), calcTxt]);
            api.say(`${reason(n)}: <b>${calcTxt}</b>`);
            await api.wait(1500);
            const kids = [n.l, n.r];
            await api.tw(800, (t) => {
              kids.forEach((k) => { k.g.setAttribute('transform', `translate(${lerp(k.x, n.x, t)},${lerp(k.y, n.y, t)})`); k.g.setAttribute('opacity', 1 - t); });
              n.el.setAttribute('opacity', 1 - t); n.er.setAttribute('opacity', 1 - t);
            });
            kids.forEach((k) => k.g.remove()); n.el.remove(); n.er.remove();
            delete n.op; n.v = v; drawLeaf(n, true);
            showExpr(null);
            await api.wait(900);
          }
          // Rechenweg stehen lassen
          exprT.textContent = startE;
          const sp = Math.min(26, 120 / log.length);
          log.forEach(([why, txt], i) => {
            const t = el('text', { x: 180, y: 142 + i * sp, class: 'ex-s', 'text-anchor': 'middle' }, api.svg);
            t.innerHTML = `<tspan class="f6">${i + 1}. ${why}:</tspan> <tspan style="font-size:16px">${txt}</tspan>`;
          });
          if (mode === 'punkt') api.say(`Ergebnis: <b>${total}</b>. <small>Punkt vor Strich! Wer zuerst ${a} + ${b} rechnet, bekommt ${(a + b) * c}, und das ist falsch.</small>`);
          else if (mode === 'klammer') api.say(`Ergebnis: <b>${total}</b>. <small>Ohne Klammer wäre es ${a} + ${b * c} = ${a + b * c}. Die Klammer ändert, wer zusammengehört!</small>`);
          else if (mode === 'task') api.say(`Ergebnis: <b>${total}</b>. <small>Reihenfolge: Klammer, Hochzahl, Punkt, Strich. Sonst von links nach rechts.</small>`);
          else api.say(`Ergebnis: <b>${total}</b>. <small>Klammer zuerst, dann Punkt vor Strich, zum Schluss das Minus.</small>`);
        },
      };
    },
  });

  // =====================================================
  // Rechengesetze – Punkte drehen, Streifen umklammern, Rechteck teilen
  // =====================================================
  reg('k5-gesetze', {
    title: 'Drei Rechengesetze zum Anschauen',
    viewBox: '0 0 360 250',
    create(api) {
      let mode = 'alle';
      const T = (x, y, text, cls, parent) => el('text', { x, y, class: cls || 'ex-b', 'text-anchor': 'middle', text }, parent || api.svg);
      async function kommutativ() {
        api.clear();
        const r = R(2, 4), c = R(r + 1, 6), s = 24, cx = 180, cy = 112;
        el('text', { x: 180, y: 26, class: 'ex-s f6', 'text-anchor': 'middle', text: 'KOMMUTATIVGESETZ (Vertauschungsgesetz)' }, api.svg);
        const g = el('g', { opacity: 0 }, api.svg);
        for (let i = 0; i < r; i++) for (let j = 0; j < c; j++)
          el('circle', { cx: cx + (j - (c - 1) / 2) * s, cy: cy + (i - (r - 1) / 2) * s, r: 8, class: 'dotO' }, g);
        const lab = T(180, 232, '', 'vexpr');
        api.say(`<b>${r}</b> Reihen mit je <b>${c}</b> Punkten.`);
        await api.tw(600, (t) => g.setAttribute('opacity', t));
        lab.textContent = `${r} · ${c} = ${r * c}`;
        await api.wait(1800);
        api.say('Jetzt drehen wir das Bild um eine Vierteldrehung …');
        await api.tw(1400, (t) => g.setAttribute('transform', `rotate(${90 * t} ${cx} ${cy})`));
        lab.textContent = `${c} · ${r} = ${r * c}`;
        api.say(`… jetzt sind es <b>${c}</b> Reihen mit je <b>${r}</b> Punkten. Aber es sind <b>dieselben</b> Punkte! <small>Beim Mal (und beim Plus) darf man die Zahlen vertauschen.</small>`);
        await api.wait(3200);
      }
      async function assoziativ() {
        api.clear();
        const a = R(2, 5), b = R(2, 6), c = R(2, 5), u = Math.min(26, 260 / (a + b + c));
        const x0 = 180 - ((a + b + c) * u) / 2, y = 92, h = 34;
        el('text', { x: 180, y: 26, class: 'ex-s f6', 'text-anchor': 'middle', text: 'ASSOZIATIVGESETZ (Verbindungsgesetz)' }, api.svg);
        const ex = T(180, 66, `(${a} + ${b}) + ${c}`, 'vexpr');
        const xs = [x0, x0 + a * u, x0 + (a + b) * u, x0 + (a + b + c) * u];
        [a, b, c].forEach((v, i) => {
          el('rect', { x: xs[i], y, width: v * u, height: h, rx: 4, class: ['blk', 'blk mv', 'blk g3'][i] }, api.svg);
          T((xs[i] + xs[i + 1]) / 2, y + 23, v, 'ex-b wtxt');
        });
        const br = el('path', { d: '', class: 'brk' }, api.svg);
        const bl = T(0, 168, '', 'ex-b');
        const tot = T(180, 222, '', 'vexpr');
        const setBr = (p, q) => { br.setAttribute('d', `M ${p} 136 v 10 H ${q} v -10`); bl.setAttribute('x', (p + q) / 2); };
        setBr(xs[0], xs[2]);
        bl.textContent = `${a} + ${b} = ${a + b}`;
        api.say(`Erst <b>${a} + ${b}</b> zusammenfassen, dann ${c} dazu.`);
        await api.wait(1800);
        tot.textContent = `${a + b} + ${c} = ${a + b + c}`;
        await api.wait(1800);
        api.say('Jetzt verschieben wir die Klammer …');
        ex.textContent = `${a} + (${b} + ${c})`; tot.textContent = '';
        await api.tw(1000, (t) => setBr(lerp(xs[0], xs[1], t), lerp(xs[2], xs[3], t)));
        bl.textContent = `${b} + ${c} = ${b + c}`;
        await api.wait(1200);
        tot.textContent = `${a} + ${b + c} = ${a + b + c}`;
        api.say(`Wieder <b>${a + b + c}</b>, der Streifen ist ja derselbe! <small>Bei Plus und Mal darf man die Klammer verschieben.</small>`);
        await api.wait(3200);
      }
      async function distributiv() {
        api.clear();
        const f = R(3, 6), x = pick([10, 20]), y = R(2, 6), u = x === 20 ? 10 : 14;
        const w1 = x * u, w2 = y * u, h = f * u, x0 = 180 - (w1 + w2 + 20) / 2, y0 = 104;
        el('text', { x: 180, y: 26, class: 'ex-s f6', 'text-anchor': 'middle', text: 'DISTRIBUTIVGESETZ (Verteilungsgesetz)' }, api.svg);
        const ex = T(180, 62, `${f} · (${x} + ${y})`, 'vexpr');
        const L = el('rect', { x: x0, y: y0, width: w1, height: h, class: 'blk' }, api.svg);
        const Rg = el('g', {}, api.svg);
        const Rr = el('rect', { x: x0 + w1, y: y0, width: w2, height: h, class: 'blk' }, Rg);
        T(x0 - 14, y0 + h / 2 + 6, f, 'ex-b');
        T(x0 + w1 / 2, y0 - 8, x, 'ex-s');
        const ty = T(x0 + w1 + w2 / 2, y0 - 8, y, 'ex-s', Rg);
        const l1 = T(x0 + w1 / 2, y0 + h + 24, '', 'ex-s'), l2 = T(x0 + w1 + 20 + w2 / 2, y0 + h + 24, '', 'ex-s');
        const tot = T(180, 236, '', 'vexpr');
        api.say(`Ein Rechteck: <b>${f}</b> hoch und <b>${x} + ${y}</b> breit. Fläche: ${f} · (${x} + ${y}).`);
        await api.wait(2400);
        api.say('Wir schneiden es an der Stelle ' + x + ' durch …');
        Rr.setAttribute('class', 'blk mv');
        await api.tw(900, (t) => Rg.setAttribute('transform', `translate(${20 * t},0)`));
        l1.textContent = `${f} · ${x} = ${f * x}`; l2.textContent = `${f} · ${y} = ${f * y}`;
        ex.textContent = `${f} · ${x} + ${f} · ${y}`;
        api.say(`Zwei Rechtecke: ${f} · ${x} und ${f} · ${y}. Die <b>${f}</b> wird auf beide Teile <b>verteilt</b>.`);
        await api.wait(2200);
        tot.textContent = `${f * x} + ${f * y} = ${f * (x + y)}`;
        api.say(`Zusammen <b>${f * (x + y)}</b>, genauso viel wie ${f} · ${x + y}. <small>So rechnet man z. B. ${f} · ${x + y} im Kopf!</small>`);
        void ty; void L;
        await api.wait(3200);
      }
      api.chips([
        { label: 'Alle drei', onClick() { mode = 'alle'; api.replay(); } },
        { label: 'Kommutativ', onClick() { mode = 'kom'; api.replay(); } },
        { label: 'Assoziativ', onClick() { mode = 'ass'; api.replay(); } },
        { label: 'Distributiv', onClick() { mode = 'dis'; api.replay(); } },
      ]);
      return {
        reset() { api.clear(); },
        async play() {
          if (mode === 'alle' || mode === 'kom') await kommutativ();
          if (mode === 'alle' || mode === 'ass') await assoziativ();
          if (mode === 'alle' || mode === 'dis') await distributiv();
          if (mode === 'alle') api.say('<b>Kommutativ</b>: vertauschen · <b>Assoziativ</b>: Klammer verschieben · <b>Distributiv</b>: verteilen. <small>Die ersten beiden gelten nur für Plus und Mal!</small>');
        },
      };
    },
  });
})();
