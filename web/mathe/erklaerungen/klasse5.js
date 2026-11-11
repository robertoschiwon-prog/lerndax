/* MaDax (Mathe) – Erklär-Animationen
 *
 * Jede Erklärung: { title, titleFor?(ctx), viewBox, create(api, ctx) → { reset(), play() } }
 *   ctx: das ex-Objekt der Aufgabe plus pre:true (ähnliches Beispiel zeigen) oder post:true (genau die Aufgabe);
 *        leer, wenn die Erklärung ohne Aufgabe geöffnet wird
 *   reset(): baut die Startszene neu auf
 *   play():  async – spielt die Animation ab (api.wait / api.tw / api.say)
 * Regler und Auswahl-Chips legt create() über api.slider / api.chips an.
 */
(function () {
  const M = (window.Mathelix = window.Mathelix || {});
  const U = M.util;
  const fr = U.fr, fmt = U.fmt, R = U.R, pick = U.pick, round6 = U.round6;
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
  //   ctx: { mode:'rund', n, p (10, 100, 1000 …), name ('Zehner' …) }, dazu pre/post
  const PLACE = { 10: 'Zehner', 100: 'Hunderter', 1000: 'Tausender', 10000: 'Zehntausender', 100000: 'Hunderttausender' };
  reg('k5-runden', {
    title: 'Runden am Zahlenstrahl',
    viewBox: '0 0 360 170',
    create(api, ctx) {
      ctx = ctx || {};
      // Gerechnet wird in „Einheiten“ u = p/10: ein Strich auf dem Zahlenstrahl ist u.
      // Dezimalzahlen: ctx.scale = 1000 → alle Zahlen sind ganze Tausendstel und werden geteilt angezeigt
      const sc = ctx.scale || (ctx.dez ? 1000 : 1);
      const NAME = sc === 1000 ? { 1000: 'Einer', 100: 'Zehntel', 10: 'Hundertstel' } : PLACE;
      const F = (v) => fmt(v / sc);
      let B, n, u = 1, p = 10, name = 'Zehner';
      const X = (v) => 30 + (v - B) * 10; // v in Einheiten
      const isTask = ctx.mode === 'rund' && ctx.post;
      function setN(num, place) {
        p = place; u = p / 10; name = ctx.name || NAME[p] || 'Zehner'; n = num;
        B = Math.floor(n / p) * 10 - 10; // linker Rand: ein Block vor dem unteren Nachbarn
      }
      const pickN = () => (sc === 1000 ? setN(100 * R(11, 98) + 10 * R(1, 9), 100) : setN(10 * R(4, 91) + R(1, 9), 10));
      if (isTask) setN(ctx.n, ctx.p);
      else if (ctx.mode === 'rund' && ctx.pre) {
        // ähnliches Beispiel: gleiche Stelle, ähnlich große Zahl
        const len = String(ctx.n).length; let m;
        do m = R(10 ** (len - 1), 10 ** len - 1); while (m === ctx.n || m % ctx.p === 0);
        setN(m, ctx.p);
      } else pickN();
      // Nachbarn immer aus der aktuellen Zahl berechnen (auch wenn der Regler sie in den nächsten Abschnitt schiebt)
      const lo = () => Math.floor(n / p) * p, hi = () => lo() + p;
      let g;
      function scene() {
        api.clear();
        g = {};
        api.sub(isTask ? 'Lösung zu deiner Aufgabe' : ctx.pre && ctx.mode === 'rund' ? 'Ein ähnliches Beispiel – deine Aufgabe löst du danach selbst' : '');
        el('line', { x1: 24, y1: 100, x2: 340, y2: 100, class: 'ray' }, api.svg);
        for (let v = B; v <= B + 30; v++) {
          const big = v % 10 === 0, mid = v % 5 === 0;
          el('line', { x1: X(v), y1: 100 - (big ? 12 : mid ? 8 : 5), x2: X(v), y2: 100 + (big ? 12 : mid ? 8 : 5), class: 'tk' }, api.svg);
          if (big) el('text', { x: X(v), y: 132, class: 'ex-t', 'text-anchor': 'middle', text: F(v * u) }, api.svg);
        }
        g.lo = el('circle', { cx: X(lo() / u), cy: 100, r: 16, class: 'hl2', opacity: 0 }, api.svg);
        g.hi = el('circle', { cx: X(hi() / u), cy: 100, r: 16, class: 'hl2', opacity: 0 }, api.svg);
        g.mid = el('g', { opacity: 0 }, api.svg);
        el('line', { x1: X(lo() / u + 5), y1: 72, x2: X(lo() / u + 5), y2: 116, class: 'dash' }, g.mid);
        el('text', { x: X(lo() / u + 5), y: 150, class: 'ex-s', 'text-anchor': 'middle', text: 'Mitte ' + F((lo() + hi()) / 2) }, g.mid);
        g.dist = el('g', {}, api.svg);
        g.m = el('g', { opacity: 0 }, api.svg);
        el('line', { x1: 0, y1: 60, x2: 0, y2: 100, class: 'stem' }, g.m);
        el('circle', { cx: 0, cy: 100, r: 7, class: 'mk' }, g.m);
        g.ml = el('text', { x: 0, y: 52, class: 'ex-b f1', 'text-anchor': 'middle', text: F(n) }, g.m);
        g.m.setAttribute('transform', `translate(${X(n / u)},0)`);
      }
      function dist(show) {
        g.dist.innerHTML = '';
        if (!show) return;
        const d1 = n - lo(), d2 = hi() - n, xv = X(n / u);
        el('path', { d: `M ${X(lo() / u)} 88 Q ${(X(lo() / u) + xv) / 2} 70 ${xv} 88`, class: d1 < d2 ? 'arcG' : 'arcN' }, g.dist);
        el('path', { d: `M ${xv} 88 Q ${(xv + X(hi() / u)) / 2} 70 ${X(hi() / u)} 88`, class: d2 <= d1 ? 'arcG' : 'arcN' }, g.dist);
        el('text', { x: (X(lo() / u) + xv) / 2, y: 74, class: 'ex-s', 'text-anchor': 'middle', text: F(d1) }, g.dist);
        el('text', { x: (xv + X(hi() / u)) / 2, y: 74, class: 'ex-s', 'text-anchor': 'middle', text: F(d2) }, g.dist);
      }
      const up = () => n - lo() >= p / 2;
      const digit = () => Math.floor(n / u) % 10;
      function verdict() {
        const t = up() ? hi() : lo();
        return `<b>${F(n)}</b> liegt näher an <b>${F(t)}</b>${n - lo() === p / 2 ? ' (genau in der Mitte: dann rundet man <b>auf</b>)' : ''} → ${up() ? 'aufrunden' : 'abrunden'}: ${F(n)} ≈ <b>${F(t)}</b>`
          + `<br><small>Kurz: Die Ziffer rechts neben der ${name}stelle ist <b>${digit()}</b> → ${digit() >= 5 ? '5 bis 9: aufrunden' : '0 bis 4: abrunden'}.</small>`;
      }
      const sl = api.slider({ label: 'Zahl verschieben', min: 1, max: 19, value: Math.round(n / u) - B - 10, onInput(val) {
        n = (B + 10 + val) * u; scene();
        g.m.setAttribute('opacity', 1); g.lo.setAttribute('opacity', 1); g.hi.setAttribute('opacity', 1); g.mid.setAttribute('opacity', 1);
        dist(true);
        api.say(verdict());
      } });
      api.chips([{ label: 'Neue Zahl', onClick() { pickN(); sl.value = Math.round(n / u) - B - 10; api.replay(); } }]);
      return {
        reset: scene,
        async play() {
          api.say(`Runde <b>${F(n)}</b> auf ${name}. Wo liegt die Zahl auf dem Zahlenstrahl?${u > 1 ? `<br><small>Ein kleiner Strich bedeutet hier ${F(u)}.</small>` : ''}`);
          await api.tw(700, (t) => { g.m.setAttribute('opacity', t); g.m.setAttribute('transform', `translate(${X(n / u)},${(1 - t) * -30})`); });
          await api.wait(1200);
          api.say(`Die beiden Nachbar-${name} sind <b>${F(lo())}</b> und <b>${F(hi())}</b>.`);
          await api.tw(500, (t) => { g.lo.setAttribute('opacity', t); g.hi.setAttribute('opacity', t); });
          await api.wait(1400);
          api.say(`Genau in der Mitte liegt <b>${F((lo() + hi()) / 2)}</b>.`);
          await api.tw(500, (t) => g.mid.setAttribute('opacity', t));
          await api.wait(1200);
          api.say(`Abstände: zu ${F(lo())} sind es ${F(n - lo())}, zu ${F(hi())} sind es ${F(hi() - n)}.`);
          dist(true);
          await api.wait(1800);
          const target = up() ? hi() : lo();
          api.say(verdict());
          await api.tw(900, (t) => { g.m.setAttribute('transform', `translate(${lerp(X(n / u), X(target / u), t)},${-Math.sin(t * Math.PI) * 18})`); g.ml.textContent = t < 0.98 ? F(n) : '≈ ' + F(target); });
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
  // „Mach die Probe“: rückwärts rechnen (Ergebnis mal Teiler, plus Rest) und mit der Ausgangszahl vergleichen
  //   ctx: { mode:'probe', n, d, q (behauptetes Ergebnis), r, qTrue }
  function probeErklaerung(api, ctx) {
    let { n, d, q, r } = ctx;
    if (ctx.pre) { d = R(3, 9); const qT = R(102, 999); r = ctx.r ? R(1, d - 1) : 0; n = d * qT + r; q = ctx.find || Math.random() < 0.5 ? qT : qT + pick([-10, -1, 1, 10]); }
    const back = q * d + r, ok = back === n;
    const T = (y, text, cls) => el('text', { x: 180, y, class: cls || 'ex-b', 'text-anchor': 'middle', text }, api.svg);
    return {
      reset() {
        api.clear();
        api.sub(ctx.post ? 'Lösung zu deiner Aufgabe' : 'Ein ähnliches Beispiel – deine Aufgabe löst du danach selbst');
        T(40, ctx.find ? `? : ${d} = ${fmt(q)}${r ? ` Rest ${r}` : ''}` : `${fmt(n)} : ${d} = ${fmt(q)}${r ? ` Rest ${r}` : ''} ?`, 'vexpr');
      },
      async play() {
        api.say(ctx.find
          ? `Die gesuchte Zahl finden wir <b>rückwärts</b>, wie bei der Probe: Ergebnis <b>mal ${d}</b>${r ? ', dann den <b>Rest dazu</b>' : ''}.`
          : `Die <b>Probe</b> rechnet rückwärts: Ergebnis <b>mal ${d}</b>${r ? ', dann den <b>Rest dazu</b>' : ''}. Kommt wieder ${fmt(n)} heraus, stimmt die Rechnung.`);
        await api.wait(3400);
        const ds = String(q).split('').map(Number), parts = ds.map((c, i) => c * 10 ** (ds.length - 1 - i)).filter((v) => v);
        T(86, `${fmt(q)} · ${d}`);
        api.say(`${fmt(q)} · ${d} rechnen wir in Teilen: ${parts.map((p) => `${p} · ${d}`).join(' + ')}`);
        await api.wait(2800);
        T(116, `= ${parts.map((p) => fmt(p * d)).join(' + ')}`);
        await api.wait(2200);
        T(146, `= ${fmt(q * d)}`, 'ex-b f2');
        api.say(`Zusammen: ${fmt(q)} · ${d} = <b>${fmt(q * d)}</b>`);
        await api.wait(2200);
        if (r) {
          T(182, `${fmt(q * d)} + ${r} = ${fmt(back)}`, 'ex-b f2');
          api.say(`Jetzt den Rest dazu: ${fmt(q * d)} + ${r} = <b>${fmt(back)}</b>`);
          await api.wait(2200);
        }
        if (ctx.find) {
          T(r ? 232 : 200, `${fmt(n)} : ${d} = ${fmt(q)}${r ? ` Rest ${r}` : ''} ✓`, 'vexpr');
          api.say(`Die gesuchte Zahl ist <b>${fmt(n)}</b>.<br><small>Teilen und Malnehmen heben sich gegenseitig auf.</small>`);
          return;
        }
        T(r ? 232 : 200, ok ? `${fmt(back)} = ${fmt(n)} ✓` : `${fmt(back)} ≠ ${fmt(n)} ✗`, 'vexpr');
        api.say(ok
          ? `Die Probe ergibt genau <b>${fmt(n)}</b>: <b>Stimmt!</b>`
          : `Die Probe ergibt ${fmt(back)}, es müsste aber ${fmt(n)} sein: <b>Stimmt nicht!</b>${ctx.post && ctx.qTrue ? `<br><small>Richtig ist ${fmt(n)} : ${d} = ${fmt(ctx.qTrue)}${r ? ` Rest ${r}` : ''}.</small>` : ''}`);
      },
    };
  }
  reg('k5-division', {
    title: 'Dividieren: teilen und schriftlich rechnen',
    titleFor: (ctx) => (ctx && ctx.mode === 'probe' ? (ctx.find ? 'Rückwärts rechnen: Welche Zahl wurde geteilt?' : 'Die Probe: rückwärts rechnen') : 'Dividieren: teilen und schriftlich rechnen'),
    viewBox: '0 0 360 280',
    create(api, ctx) {
      ctx = ctx || {};
      if (ctx.mode === 'probe' && (ctx.pre || ctx.post)) return probeErklaerung(api, ctx);
      let task = null;
      if (ctx.mode === 'div' && (ctx.pre || ctx.post)) {
        task = { n: ctx.n, d: ctx.d };
        if (ctx.pre) {
          const len = String(ctx.n).length;
          let n, d;
          // zweistelliger Teiler in der Aufgabe → auch im Beispiel zweistellig (und ohne Rest, wie in der Aufgabe)
          if (ctx.d > 9) do { d = pick([10, 20, 25]); n = d * R(8, 45); } while (n === ctx.n || d === ctx.d);
          else do { d = R(3, 9); n = R(10 ** (len - 1), 10 ** len - 1); } while (n === ctx.n);
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
        api.say(`Es ${br === 1 ? 'bleibt' : 'bleiben'} <b>${br}</b> übrig. Für eine volle Tüte reicht das nicht.`);
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
  // Vielfache – gleich große Sprünge auf dem Zahlenstrahl
  //   ctx: { mode:'vielf', kind:'nte'|'groesser'|'welche', d, k?, g?, opts? }, dazu pre/post
  // =====================================================
  function vielfache(api, ctx) {
    const isTask = !!ctx.post;
    let { kind, d, k, g, opts } = ctx;
    if (ctx.pre) { // gleiche Art, andere Zahlen
      let d2; do d2 = R(3, 12); while (d2 === d); d = d2;
      if (kind === 'nte') k = R(4, 10);
      if (kind === 'groesser') g = R(3, 9) * 10 + R(0, 9);
      if (kind === 'welche') { const right = d * R(5, 12); opts = [right, right + R(1, d - 1), right - R(1, d - 1), right + d + R(1, d - 1)].filter((v, i, a) => a.indexOf(v) === i).sort((x, y) => x - y); }
    }
    // wie weit der Zahlenstrahl gehen muss
    const goal = kind === 'nte' ? k * d : kind === 'groesser' ? (Math.floor(g / d) + 1) * d : Math.max(...opts);
    const jumps = Math.ceil(goal / d) + (kind === 'welche' ? 0 : 0);
    const maxV = Math.max(goal, jumps * d), X = (v) => 24 + (v / maxV) * 312, y = 150;
    let marks;
    return {
      reset() {
        api.clear(); marks = [];
        api.sub(isTask ? 'Lösung zu deiner Aufgabe' : ctx.pre ? 'Ein ähnliches Beispiel – deine Aufgabe löst du danach selbst' : '');
        el('line', { x1: 18, y1: y, x2: 342, y2: y, class: 'ray' }, api.svg);
        el('line', { x1: X(0), y1: y - 8, x2: X(0), y2: y + 8, class: 'tk' }, api.svg);
        el('text', { x: X(0), y: y + 26, class: 'ex-s', 'text-anchor': 'middle', text: '0' }, api.svg);
        if (kind === 'groesser') {
          el('line', { x1: X(g), y1: y - 40, x2: X(g), y2: y + 12, class: 'dash' }, api.svg);
          el('text', { x: X(g), y: y - 46, class: 'ex-s f1', 'text-anchor': 'middle', text: g }, api.svg);
        }
        if (kind === 'welche') opts.forEach((v, i) => marks.push([v, el('text', { x: X(v), y: y + 46 + (i % 2) * 18, class: 'ex-s f6', 'text-anchor': 'middle', text: v }, api.svg), el('line', { x1: X(v), y1: y + 32 + (i % 2) * 18, x2: X(v), y2: y + 4, class: 'dash' }, api.svg)])); // abwechselnd hoch/tief, damit nichts überlappt
      },
      async play() {
        const q = kind === 'nte' ? `Das <b>${k}. Vielfache</b> von ${d}` : kind === 'groesser' ? `Das kleinste Vielfache von ${d}, das <b>größer als ${g}</b> ist` : `Welche Zahl ist ein Vielfaches von ${d}?`;
        api.say(`${q}${kind === 'welche' ? '' : '?'}<br><small>Vielfache von ${d} erreicht man mit lauter ${d}er-Sprüngen ab 0.</small>`);
        await api.wait(2200);
        const fast = jumps > 12;
        for (let i = 1; i <= jumps; i++) {
          const a = (i - 1) * d, b = i * d;
          const pth = el('path', { d: `M ${X(a)} ${y} Q ${(X(a) + X(b)) / 2} ${y - Math.min(50, (X(b) - X(a)) * 0.8)} ${X(b)} ${y}`, class: 'jump' }, api.svg);
          const L = pth.getTotalLength ? pth.getTotalLength() : 50;
          pth.style.strokeDasharray = L; pth.style.strokeDashoffset = L;
          await api.tw(fast ? 160 : 380, (t) => (pth.style.strokeDashoffset = L * (1 - t)));
          el('line', { x1: X(b), y1: y - 6, x2: X(b), y2: y + 6, class: 'tk' }, api.svg);
          if (!fast || i % 2 === 0 || i === jumps) el('text', { x: X(b), y: y + 26, class: 'ex-s', 'text-anchor': 'middle', style: jumps > 8 ? 'font-size:10px' : '', text: b }, api.svg);
          if (kind === 'nte') api.say(`${i}. Sprung: ${i} · ${d} = <b>${b}</b>`);
          if (kind === 'groesser' && b > g && a <= g) api.say(a === g ? `${a} ist genau ${g}, also <b>nicht</b> größer. Erst <b>${b}</b> ist größer!` : `${a} ist noch nicht größer als ${g}, aber <b>${b}</b> ist es!`);
        }
        await api.wait(900);
        if (kind === 'nte') api.say(`Das ${k}. Vielfache von ${d} ist <b>${k} · ${d} = ${k * d}</b>.`);
        else if (kind === 'groesser') api.say(`Das kleinste Vielfache von ${d}, das größer als ${g} ist: <b>${goal}</b>.<br><small>Rechnung: ${g} : ${d} = ${Math.floor(g / d)} Rest ${g % d}, also ${Math.floor(g / d) + 1} · ${d} = ${goal}.</small>`);
        else {
          const hit = opts.find((v) => v % d === 0);
          marks.forEach(([v, t, l]) => { const ok = v % d === 0; t.setAttribute('class', 'ex-s ' + (ok ? 'f3' : 'f6')); l.setAttribute('class', ok ? 'stem' : 'dash'); });
          api.say(`Nur <b>${hit}</b> wird von einem Sprung getroffen: ${hit} = ${hit / d} · ${d}.<br><small>Die anderen liegen zwischen zwei Sprüngen, beim Teilen durch ${d} bleibt ein Rest.</small>`);
        }
      },
    };
  }

  // =====================================================
  // Teilbarkeit – Regeln sichtbar machen & Teiler-Paare
  //   ctx: { mode:'teil', n, d } | { mode:'teiler', n }, dazu pre/post
  // =====================================================
  reg('k5-teilbar', {
    title: 'Teilbarkeit: Regeln und Teiler',
    titleFor: (ctx) => (ctx && ctx.mode === 'vielf' ? 'Vielfache: Sprünge auf dem Zahlenstrahl' : 'Teilbarkeit: Regeln und Teiler'),
    viewBox: '0 0 360 240',
    create(api, ctx) {
      ctx = ctx || {};
      if (ctx.mode === 'vielf') return vielfache(api, ctx);
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
        api.say('Als Reihenzahl probieren wir nur die <b>Primzahlen 2, 3, 5 und 7</b>.<br><small>4, 6 oder 8 Reihen brauchen wir nicht: Ginge das auf, dann ginge es auch schon mit 2 Reihen.</small>');
        await api.wait(3600);
        let found = 0, r;
        for (r = 2; r * r <= n; r++) {
          if (!isPrime(r)) continue;
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
        api.say('Noch mehr Reihen brauchen wir nicht zu probieren: Dann hätte das Rechteck weniger Spalten als Reihen, und das hätten wir schon gefunden.');
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
  // Zwei Potenzen vergleichen: beide als Malaufgabe schreiben und ausrechnen
  //   ctx: { mode:'vgl', b1, e1, b2, e2, alt }, dazu pre/post
  function potVgl(api, ctx) {
    const { b1, e1, b2, e2 } = ctx, A = b1 ** e1, B = b2 ** e2;
    const supTxt = (e) => String(e).split('').map((c) => '⁰¹²³⁴⁵⁶⁷⁸⁹'[+c]).join('');
    const prodTxt = (b, e) => (e <= 6 ? Array(e).fill(b).join(' · ') : `${b} · ${b} · … · ${b} (${e}-mal)`);
    let L, Rr, Lv, Rv, mid;
    return {
      reset() {
        api.clear();
        api.sub(ctx.post ? 'Lösung zu deiner Aufgabe' : ctx.pre ? 'Ein ähnliches Beispiel – deine Aufgabe löst du danach selbst' : '');
        const T = (x, y, t, cls) => el('text', { x, y, class: cls || 'ex-b', 'text-anchor': 'middle', text: t }, api.svg);
        T(95, 50, `${b1}${supTxt(e1)}`, 'vexpr'); T(265, 50, `${b2}${supTxt(e2)}`, 'vexpr');
        el('line', { x1: 180, y1: 30, x2: 180, y2: 200, class: 'dash' }, api.svg);
        L = T(95, 100, '', 'ex-s'); Rr = T(265, 100, '', 'ex-s');
        Lv = T(95, 150, '', 'vexpr'); Rv = T(265, 150, '', 'vexpr'); mid = T(180, 156, '', 'vexpr');
      },
      async play() {
        api.say(`Was ist größer: <b>${b1}${supTxt(e1)}</b> oder <b>${b2}${supTxt(e2)}</b>? Die Zahlen sind dieselben, nur vertauscht. Ausrechnen hilft!`);
        await api.wait(2400);
        L.textContent = prodTxt(b1, e1); api.say(`${b1}${supTxt(e1)}: Die ${b1} kommt <b>${e1}-mal</b> als Faktor vor.`); await api.wait(2000);
        Lv.textContent = `= ${fmt(A)}`; await api.wait(1400);
        Rr.textContent = prodTxt(b2, e2); api.say(`${b2}${supTxt(e2)}: Die ${b2} kommt <b>${e2}-mal</b> als Faktor vor.`); await api.wait(2000);
        Rv.textContent = `= ${fmt(B)}`; await api.wait(1400);
        mid.textContent = A > B ? '>' : A < B ? '<' : '=';
        api.say(A === B ? `Beide ergeben <b>${fmt(A)}</b>: gleich groß! <small>(Das ist ein seltener Zufall.)</small>` : `${fmt(Math.max(A, B))} ist größer als ${fmt(Math.min(A, B))}: <b>${A > B ? `${b1}${supTxt(e1)}` : `${b2}${supTxt(e2)}`}</b> ist größer.<br><small>Vertauschen ist bei Potenzen <b>nicht</b> erlaubt.</small>`);
      },
    };
  }

  reg('k5-potenz', {
    title: 'Potenzen: wie oft malnehmen?',
    viewBox: '0 0 360 230',
    create(api, ctx) {
      if (ctx && ctx.mode === 'vgl') return potVgl(api, ctx.pre && ctx.alt ? Object.assign({}, ctx.alt, { pre: true }) : ctx);
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
            api.say('<b>Merke:</b> Der Exponent zählt, <b>wie oft</b> die Basis als Faktor vorkommt. <small>2⁵ = 32 · 10³ = 1 000 · 7¹ = 7 · 1⁵ = 1 · 4² = 16</small>');
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

  // Untertitel für Beispiel vorher / Lösung nachher (gemeinsam für alle Erklärungen)
  const subFor = (api, ctx, mode, isTask) => api.sub(isTask ? 'Lösung zu deiner Aufgabe' : ctx && ctx.pre && ctx.mode === mode ? 'Ein ähnliches Beispiel – deine Aufgabe löst du danach selbst' : '');

  // =====================================================
  // Anteile – Bonbons gerecht aufteilen
  //   ctx: { mode:'anteil', z, d, k, unit, unitVon, back? (vom Teil zum Ganzen) } · { mode:'bild', z, d } (Anteil am Streifen ablesen), dazu pre/post
  // =====================================================
  // Anteil am Streifen ablesen: Teile zählen (Nenner), gefärbte Teile zählen (Zähler)
  function anteilBild(api, ctx) {
    let z = ctx.z, d = ctx.d, cells = [];
    if (!ctx.post) do { d = R(3, 10); z = R(1, d - 1); } while (U.gcd(z, d) !== 1 || (d === ctx.d && z === ctx.z));
    const w = 300 / d, y = 70, h = 60;
    return {
      reset() {
        api.clear(); subFor(api, ctx, 'bild', !!ctx.post);
        cells = Array.from({ length: d }, (_, i) => el('rect', { x: 30 + i * w, y, width: w, height: h, class: 'cellOff' }, api.svg));
        for (let i = 1; i < d; i++) el('line', { x1: 30 + i * w, y1: y, x2: 30 + i * w, y2: y + h, class: 'div' }, api.svg);
        el('rect', { x: 30, y, width: 300, height: h, class: 'frame' }, api.svg);
      },
      async play() {
        api.say('In wie viele <b>gleich große Teile</b> ist der Streifen geteilt? Wir zählen.');
        await api.wait(1800);
        for (let i = 0; i < d; i++) { el('text', { x: 30 + i * w + w / 2, y: y + h + 22, class: 'ex-s', 'text-anchor': 'middle', text: i + 1 }, api.svg); await api.wait(260); }
        api.say(`<b>${d}</b> Teile: Das ist der <b>Nenner</b> (unten).`);
        await api.wait(2400);
        api.say('Wie viele davon sind gefärbt?');
        for (let i = 0; i < z; i++) { cells[i].setAttribute('class', 'cellOn'); el('text', { x: 30 + i * w + w / 2, y: y - 10, class: 'ex-b f2', 'text-anchor': 'middle', text: i + 1 }, api.svg); await api.wait(450); }
        await api.wait(900);
        api.say(`<b>${z}</b> ${z === 1 ? 'Teil ist' : 'Teile sind'} gefärbt: Das ist der <b>Zähler</b> (oben).<br>Gefärbt ${z === 1 ? 'ist' : 'sind'} also <b>${fr(z, d)}</b> des Streifens.`);
      },
    };
  }
  reg('k5-anteil', {
    title: 'Anteile berechnen',
    titleFor: (ctx) => (ctx && ctx.mode === 'bild' ? 'Anteil ablesen: Teile zählen' : ctx && ctx.back ? 'Vom Teil zum Ganzen' : 'Anteile berechnen'),
    viewBox: '0 0 360 230',
    create(api, ctx) {
      ctx = ctx || {};
      if (ctx.mode === 'bild' && (ctx.pre || ctx.post)) return anteilBild(api, ctx);
      let d, k, z, unit = '', unitVon = '', items;
      const isTask = ctx.mode === 'anteil' && ctx.post;
      const back = ctx.mode === 'anteil' && !!ctx.back; // vom Teil auf das Ganze schließen
      const pickN = () => { d = R(3, 5); k = R(2, 5); z = R(1, d - 1); unit = unitVon = ''; };
      if (isTask) ({ d, k, z } = ctx), (unit = ctx.unit || ''), (unitVon = ctx.unitVon || '');
      else if (ctx.mode === 'anteil' && ctx.pre) {
        do { d = R(2, 10); z = back && ctx.z === 1 ? 1 : R(1, d - 1); k = R(2, Math.min(12, Math.max(3, ctx.k))); } while (d === ctx.d && z === ctx.z && k === ctx.k);
        unit = ctx.unit || ''; unitVon = ctx.unitVon || '';
      } else pickN();
      api.chips([{ label: 'Neue Aufgabe', onClick() { pickN(); api.replay(); } }]);
      // Maße passend zur Anzahl: bis zu 10 Teile mit je bis zu 12 Bonbons
      const geo = () => {
        const tot = d * k, perRow = Math.min(tot, Math.ceil(Math.sqrt(tot * 1.8))), sp = Math.min(28, 300 / perRow);
        const colW = 300 / d, rs = Math.min(26, 170 / k), r = Math.max(3, Math.min(10, sp / 2 - 2, colW / 2 - 4, rs / 2 - 2));
        return { tot, perRow, sp, colW, rs, r };
      };
      return {
        reset() {
          api.clear(); items = [];
          subFor(api, ctx, 'anteil', isTask);
          const G = geo();
          for (let i = 0; i < G.tot; i++) items.push(el('circle', { cx: 30 + G.sp / 2 + (i % G.perRow) * G.sp, cy: 30 + Math.floor(i / G.perRow) * G.sp, r: G.r, class: 'candy', opacity: 0 }, api.svg));
        },
        async play() {
          const G = geo(), tot = G.tot;
          if (back) {
            const frames = [];
            for (let gI = 0; gI < d; gI++) frames.push(api.svg.insertBefore(el('rect', { x: 30 + gI * G.colW + 3, y: 18, width: G.colW - 6, height: k * G.rs + 12, rx: Math.min(10, G.colW / 4), class: gI < z ? 'bag take' : 'bag' }), items[0]));
            items.forEach((c, i) => { c.setAttribute('cx', 30 + (i % d) * G.colW + G.colW / 2); c.setAttribute('cy', 24 + G.rs / 2 + Math.floor(i / d) * G.rs); if (i % d < z) { c.setAttribute('class', 'candy take'); c.setAttribute('opacity', 1); } });
            api.say(`${fr(z, d)} einer Zahl ${z * k === 1 ? 'ist' : 'sind'} <b>${z * k}</b>. Das Ganze hat <b>${d}</b> gleich große Teile, ${z === 1 ? 'einen davon kennen wir' : `${z} davon kennen wir`}.`);
            await api.wait(3600);
            api.say(z === 1 ? `Ein Teil ist also <b>${k}</b>.` : `${z} Teile sind ${z * k}. Ein Teil ist ${z * k} : ${z} = <b>${k}</b>.`);
            await api.wait(2800);
            api.say(`In jedem der ${d} Teile stecken ${k} …`);
            await api.tw(1000, (t) => items.forEach((c, i) => { if (i % d >= z) c.setAttribute('opacity', t); }));
            await api.wait(800);
            api.say(`Das Ganze: ${d} · ${k} = <b>${d * k}</b><br><small>Erst einen Teil ausrechnen, dann mit dem Nenner malnehmen.</small>`);
            return;
          }
          api.say(`Wie viel sind ${fr(z, d)} von <b>${tot}${unitVon}</b>?${unit ? `<br><small>Jeder Punkt steht für 1${unit === ' Kinder' ? ' Kind' : unit}.</small>` : ''}`);
          for (const c of items) { c.setAttribute('opacity', 1); await api.wait(Math.max(8, 35 - tot / 4)); }
          await api.wait(900);
          api.say(`Der Nenner ${d} sagt: in <b>${d} gleich große Teile</b> aufteilen.`);
          const frames = [];
          for (let gI = 0; gI < d; gI++) frames.push(api.svg.insertBefore(el('rect', { x: 30 + gI * G.colW + 3, y: 18, width: G.colW - 6, height: k * G.rs + 12, rx: Math.min(10, G.colW / 4), class: 'bag', opacity: 0 }), items[0]));
          await api.tw(400, (t) => frames.forEach((f) => f.setAttribute('opacity', t)));
          const from = items.map((c) => [+c.getAttribute('cx'), +c.getAttribute('cy')]);
          await api.tw(1100, (t) => items.forEach((c, i) => {
            const gI = i % d, row = Math.floor(i / d);
            c.setAttribute('cx', lerp(from[i][0], 30 + gI * G.colW + G.colW / 2, t));
            c.setAttribute('cy', lerp(from[i][1], 24 + G.rs / 2 + row * G.rs, t));
          }));
          api.say(`${tot} : ${d} = <b>${k}</b>. Ein Teil (${fr(1, d)}) sind ${k}${unit}.`);
          await api.wait(1800);
          api.say(`Der Zähler ${z} sagt: <b>${z} ${z === 1 ? 'Teil' : 'Teile'}</b> davon nehmen.`);
          items.forEach((c, i) => { if (i % d < z) c.setAttribute('class', 'candy take'); });
          frames.forEach((f, gI) => { if (gI < z) f.setAttribute('class', 'bag take'); });
          await api.wait(1500);
          api.say(`${fr(z, d)} von ${tot}${unitVon} = ${z} · ${k}${unit} = <b>${z * k}${unit}</b><br><small>Erst durch den Nenner teilen, dann mit dem Zähler malnehmen.</small>`);
        },
      };
    },
  });

  // =====================================================
  // Erweitern & Kürzen – feiner unterteilen / zusammenfassen
  //   ctx: { mode:'erw', p, q, k } | { mode:'kuerz', p, q, k } (p/q ist der gekürzte Bruch), dazu pre/post
  //   Unechte Brüche (z. B. 5/2) werden mit mehreren Rechtecken gezeigt.
  // =====================================================
  function bruchErklaerung(kind) {
    return {
      title: kind === 'kuerz' ? 'Kürzen: Kästchen zusammenfassen' : 'Erweitern: feiner unterteilen',
      viewBox: '0 0 360 190',
      create(api, ctx) {
        ctx = ctx || {};
        let p, q, kT = 3, k = 1, hl = [];
        const isTask = ctx.mode === kind && ctx.post;
        const pickN = () => { q = R(2, 5); p = R(1, q - 1); kT = kind === 'kuerz' ? R(2, 4) : 3; };
        if (isTask) ({ p, q } = ctx), (kT = ctx.k);
        else if (ctx.mode === kind && ctx.pre) {
          do { q = R(2, 6); p = R(1, q - 1); } while (U.gcd(p, q) !== 1 || (p === ctx.p && q === ctx.q));
          kT = R(2, 5);
        } else pickN();
        const m = () => Math.max(1, Math.ceil(p / q)); // Anzahl Rechtecke (unechte Brüche)
        const y0 = 20, H = 130;
        const geo = () => { const gap = 10, W = (300 - (m() - 1) * gap) / m(); return { gap, W, x: (i) => 30 + i * (W + gap) }; };
        function scene() {
          api.clear(); hl = [];
          const G = geo();
          for (let r = 0; r < m(); r++) {
            for (let i = 0; i < q; i++) el('rect', { x: G.x(r) + (i * G.W) / q, y: y0, width: G.W / q, height: H, class: r * q + i < p ? 'cellOn' : 'cellOff' }, api.svg);
            for (let i = 1; i < q; i++) el('line', { x1: G.x(r) + (i * G.W) / q, y1: y0, x2: G.x(r) + (i * G.W) / q, y2: y0 + H, class: 'div' }, api.svg);
            el('rect', { x: G.x(r), y: y0, width: G.W, height: H, class: 'frame' }, api.svg);
          }
          for (let j = 1; j < 12; j++) hl.push(Array.from({ length: m() }, (_, r) => el('line', { x1: G.x(r), y1: y0, x2: G.x(r), y2: y0, class: 'div2', opacity: 0 }, api.svg)));
          setK(k, 1);
          subFor(api, ctx, kind, isTask);
        }
        function setK(kk, t) {
          const G = geo();
          hl.forEach((ls, j) => ls.forEach((l, r) => {
            if (j + 1 < kk) { const y = y0 + ((j + 1) * H) / kk; l.setAttribute('y1', y); l.setAttribute('y2', y); l.setAttribute('x1', G.x(r)); l.setAttribute('x2', G.x(r) + G.W * t); l.setAttribute('opacity', 1); }
            else l.setAttribute('opacity', 0);
          }));
        }
        const ganz = () => (m() > 1 ? `<br><small>Ein Rechteck ist ein Ganzes. ${fr(p, q)} ist mehr als ein Ganzes, darum ${m()} Rechtecke.</small>` : '');
        const sl = api.slider({ label: kind === 'kuerz' ? 'Unterteilen in' : 'Erweitern mit', min: 1, max: Math.max(6, kT), value: 1, onInput(v) { k = v; scene(); api.say(`${fr(p, q)} = ${fr(p * v, q * v)}`); } });
        api.chips([{ label: 'Anderer Bruch', onClick() { pickN(); k = 1; sl.value = 1; api.replay(); } }]);
        async function playErw() {
          k = 1; scene();
          api.say(`Die blaue Fläche ist ${fr(p, q)}.${ganz()}`);
          await api.wait(1800);
          const list = isTask ? [kT] : ctx.pre ? [2, kT] : [2, 3, 4];
          for (const kk of list) {
            k = kk; sl.value = kk; scene(); setK(kk, 0);
            await api.tw(800, (t) => setK(kk, t));
            api.say(`Jedes Stück wird in <b>${kk}</b> Teile geschnitten:<br>${fr(p, q)} = ${fr(`${p} · ${kk}`, `${q} · ${kk}`)} = ${fr(p * kk, q * kk)}`);
            await api.wait(2200);
          }
          api.say(`${fr(p, q)} = <b>${fr(p * k, q * k)}</b>: gleiche Fläche, nur feiner unterteilt.<br><small>Erweitern: Zähler <b>und</b> Nenner mit derselben Zahl malnehmen.</small>`);
        }
        async function playKuerz() {
          k = kT; sl.value = kT; scene();
          const n = p * kT, dd = q * kT;
          api.say(p <= q ? `${fr(n, dd)}: ${n} von ${dd} gleich großen Kästchen sind blau.` : `${fr(n, dd)}: Ein Ganzes hat ${dd} Kästchen. Blau sind ${n} Kästchen, also mehr als ein Ganzes.${ganz()}`);
          await api.wait(2200);
          api.say(`Zähler und Nenner sind beide durch <b>${kT}</b> teilbar. Je ${kT} Kästchen übereinander fassen wir zusammen …`);
          await api.wait(1600);
          await api.tw(1000, (t) => setK(kT, 1 - t));
          k = 1;
          api.say(`${fr(n, dd)} = ${fr(`${n} : ${kT}`, `${dd} : ${kT}`)} = <b>${fr(p, q)}</b>: dieselbe Fläche mit weniger, größeren Stücken.`);
          await api.wait(2400);
          api.say(`Vollständig gekürzt heißt: Zähler und Nenner haben keinen gemeinsamen Teiler mehr (außer 1).<br><small>Am schnellsten geht es mit dem größten gemeinsamen Teiler (ggT), hier ${kT}.${[4, 6, 8, 9].includes(kT) ? ` Schrittweise geht auch: erst durch ${kT % 2 ? 3 : 2}, dann durch ${kT / (kT % 2 ? 3 : 2)}.` : ''}</small>`);
        }
        return {
          reset() { k = kind === 'kuerz' ? kT : 1; sl.value = k; scene(); },
          play: () => (kind === 'kuerz' ? playKuerz() : playErw()),
        };
      },
    };
  }
  reg('k5-erweitern', bruchErklaerung('erw'));
  reg('k5-kuerzen', bruchErklaerung('kuerz'));

  // =====================================================
  // Bruch · Dezimal · Prozent – Hundertertafel
  // =====================================================
  //   ctx: { mode:'hund', p, q, ask:'prozent'|'dezimal'|'pd' (Prozent → Dezimalzahl)|'dp' (Dezimalzahl → Prozent)|'bruch' (Dezimalzahl → Bruch) }, dazu pre/post
  reg('k5-umwandeln', {
    title: 'Die Hundertertafel',
    viewBox: '0 0 360 200',
    create(api, ctx) {
      ctx = ctx || {};
      const list = [[1, 2], [1, 4], [3, 4], [1, 5], [2, 5], [3, 10], [1, 20], [7, 20], [2, 25], [1, 8], [3, 8]];
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
          const fill = async () => {
            let shown = 0;
            await api.tw(Math.max(700, h * 22), (t) => { const m = Math.min(full, Math.round(t * h)); for (; shown < m; shown++) cells[shown].setAttribute('class', 'hc on'); }, (t) => t);
            if (h > full) { const c = cells[full]; half = el('rect', { x: +c.getAttribute('x'), y: +c.getAttribute('y'), width: 8, height: 16, rx: 2, class: 'hc on' }, api.svg); }
            await api.wait(1000);
          };
          const ask = ctx.mode === 'hund' && (ctx.pre || ctx.post) ? ctx.ask : '';
          if (ask === 'pd') { // Prozent → Dezimalzahl
            api.say(`<b>${fmt(h)} %</b> heißt: ${fmt(h)} von 100 Kästchen der Tafel.`);
            await api.wait(1800);
            await fill();
            api.say(Number.isInteger(h)
              ? `${fmt(h)} % = ${fr(h, 100)} = <b>${fmt(h / 100)}</b><br><small>Hundertstel stehen an der zweiten Stelle nach dem Komma.</small>`
              : `${fmt(h)} % = ${fr(fmt(h), 100)} = ${fr(Math.round(h * 10), 1000)} = <b>${fmt(h / 100)}</b><br><small>Das halbe Kästchen ist ein halbes Hundertstel, also 5 Tausendstel.</small>`);
            return;
          }
          if (ask === 'dp') { // Dezimalzahl → Prozent
            const dec = round6(a / b);
            api.say(`<b>${fmt(dec)}</b> in Prozent: Prozent heißt <b>Hundertstel</b>. Wie viele Hundertstel sind das?`);
            await api.wait(2600);
            api.say(`${fmt(dec)} = ${fr(fmt(h), 100)}, also ${fmt(h)} von 100 Kästchen.`);
            await fill();
            api.say(`${fmt(dec)} = ${fr(fmt(h), 100)} = <b>${fmt(h)} %</b><br><small>Kurz: mal 100 rechnen, die Ziffern rücken zwei Stellen nach links.</small>`);
            return;
          }
          if (ask === 'bruch') { // Dezimalzahl → gekürzter Bruch
            const dec = round6(a / b), st = (String(dec).split('.')[1] || '').length, den = 10 ** st, num = Math.round(dec * den), g = num / a;
            api.say(`<b>${fmt(dec)}</b> hat ${st === 1 ? 'eine Stelle' : st + ' Stellen'} nach dem Komma, das sind <b>${['Zehntel', 'Hundertstel', 'Tausendstel'][st - 1]}</b>: ${fmt(dec)} = ${fr(num, den)}`);
            await api.wait(2800);
            api.say(`Auf der Tafel sind das ${fmt(h)} von 100 Kästchen.`);
            await fill();
            api.say(g === 1
              ? `${fr(num, den)} lässt sich nicht weiter kürzen: <b>${fr(a, b)}</b>`
              : `Kürzen mit ${g}: ${fr(num, den)} = ${fr(`${num} : ${g}`, `${den} : ${g}`)} = <b>${fr(a, b)}</b><br><small>Vollständig gekürzt: Zähler und Nenner haben keinen gemeinsamen Teiler mehr.</small>`);
            return;
          }
          api.say(`Die Tafel hat 100 Kästchen. Wie viele sind ${fr(a, b)} davon?`);
          await api.wait(1400);
          api.say(Number.isInteger(k)
            ? `Ein ${fr(1, b)} der Tafel: 100 : ${b} = <b>${k}</b> Kästchen.`
            : `Ein ${fr(1, b)} der Tafel: 100 : ${b} = <b>${fmt(k)}</b> Kästchen (also auch halbe Kästchen).`);
          await api.wait(1600);
          api.say(a === 1 ? `${fr(a, b)} sind also <b>${fmt(h)}</b> Kästchen.` : `${fr(a, b)} sind ${a}-mal so viel: ${a} · ${fmt(k)} = <b>${fmt(h)}</b> Kästchen`);
          await fill();
          // Zeile 1: auf 100 (bzw. 1000) erweitern, Zeile 2: Dezimalzahl und Prozent
          let line1 = '', from = fr(a, b);
          if (Number.isInteger(k) && b !== 100) { line1 = `Erweitern mit ${k}: ${fr(a, b)} = ${fr(`${a} · ${k}`, `${b} · ${k}`)} = ${fr(h, 100)}<br>`; from = fr(h, 100); }
          else if (!Number.isInteger(k)) { line1 = `Auf 1000 erweitern: ${fr(a, b)} = ${fr(a * (1000 / b), 1000)}<br>`; from = fr(a * (1000 / b), 1000); }
          api.say(`${line1}${from} = ${ask === 'prozent' ? fmt(h / 100) : `<b>${fmt(h / 100)}</b>`} = ${ask === 'dezimal' ? `${fmt(h)} %` : `<b>${fmt(h)} %</b>`}<br><small>„Prozent“ heißt „von Hundert“: ${fmt(h)} von 100 Kästchen.</small>`);
        },
      };
    },
  });

  // =====================================================
  // Dezimalzahlen · 10 – Stellenwerttafel
  // =====================================================
  //   ctx: { mode:'zehn', a, k (±1…3) } · { mode:'add'|'sub', a, b (in Hundertsteln) } · { mode:'mul', a (Hundertstel), k }
  //        · { mode:'cmp', sA, sB (wie in der Aufgabe geschrieben), frac:[p,q]|null } (für „Zahlen vergleichen“)
  //        · { mode:'ord', nums:[drei Zahlen als Text], want:'max'|'min' } (ordnen)
  //        · { mode:'wechsel', pay, cost (in Cent) } (Wechselgeld ergänzen), dazu pre/post
  const STELLEN = { 7: 'ZM', 6: 'M', 5: 'HT', 4: 'ZT', 3: 'T', 2: 'H', 1: 'Z', 0: 'E', '-1': 'z', '-2': 'h', '-3': 't', '-4': 'zt', '-5': 'ht' };
  // Ziffern einer Zahl als {Stelle: Ziffer}, z. B. 3,47 → {0:3, -1:4, -2:7}
  function digitsOf(x, minDec) {
    const [i, d = ''] = fmt(x).replace(/\s| /g, '').replace('−', '').split(',');
    const out = {};
    i.split('').reverse().forEach((c, k) => (out[k] = +c));
    d.padEnd(minDec || 0, '0').split('').forEach((c, k) => (out[-(k + 1)] = +c));
    return out;
  }
  reg('k5-dezimal', {
    title: 'Dezimalzahlen',
    titleFor: (ctx) => (ctx && /add|sub/.test(ctx.mode) ? 'Komma unter Komma' : ctx && ctx.mode === 'mul' ? 'Mal rechnen mit Komma' : ctx && ctx.mode === 'cmp' ? 'Zahlen vergleichen in der Stellenwerttafel' : ctx && ctx.mode === 'ord' ? 'Zahlen ordnen in der Stellenwerttafel' : ctx && ctx.mode === 'wechsel' ? 'Wechselgeld: ergänzen bis zum Schein' : 'Mal 10 – das Komma bleibt, die Ziffern wandern'),
    viewBox: '0 0 360 150',
    create(api, ctx) {
      ctx = ctx || {};
      const mode = /^(zehn|add|sub|mul|cmp|ord|wechsel)$/.test(ctx.mode) ? ctx.mode : 'zehn';
      const isTask = !!ctx.post && mode === ctx.mode;
      const sub = () => subFor(api, ctx, ctx.mode, isTask);
      // ---------------- Stellenwerttafel: · 10, : 10 ----------------
      if (mode === 'zehn') {
        let EMAX = 3, EMIN = -3, digits, texts = {}, num, demoK;
        const starts = ['3,47', '12,5', '0,86', '4,06', '25,3', '7,15']; // Vorführung · 10, dann : 100 muss in die Tafel passen
        const setNum = (x) => { num = x; digits = digitsOf(x); };
        if (ctx.mode === 'zehn' && (ctx.post || ctx.pre)) {
          let x = ctx.a, k = ctx.k;
          if (ctx.pre) { // ähnliches Beispiel: andere Zahl, gleiche Rechenart
            do x = R(1, 9999) / 10 ** R(0, 2); while (x === ctx.a);
          }
          setNum(x); demoK = k;
          const r1 = Object.keys(digitsOf(x)).map(Number), r2 = Object.keys(digitsOf(round6(k > 0 ? x * 10 ** k : x / 10 ** -k))).map(Number);
          EMAX = Math.max(1, ...r1, ...r2); EMIN = Math.min(-1, ...r1, ...r2);
        } else setNum(+pick(starts).replace(',', '.'));
        const cols = () => EMAX - EMIN + 1, cw = () => Math.min(44, 300 / cols());
        const colX = (e) => 30 + (EMAX - e) * cw() + cw() / 2 + (e < 0 ? 6 : 0);
        const val = () => round6(Object.entries(digits).reduce((s, [e, v]) => s + v * 10 ** e, 0));
        function scene() {
          api.clear(); texts = {}; sub();
          for (let e = EMAX; e >= EMIN; e--) {
            el('rect', { x: colX(e) - cw() / 2, y: 10, width: cw(), height: 110, class: e >= 0 ? 'col' : 'col dec' }, api.svg);
            el('text', { x: colX(e), y: 30, class: 'ex-s', 'text-anchor': 'middle', text: STELLEN[e], style: cw() < 30 ? 'font-size:11px' : '' }, api.svg);
          }
          el('circle', { cx: colX(0) + cw() / 2 + 3, cy: 92, r: 4, class: 'comma' }, api.svg);
          for (const e in digits) texts[e] = el('text', { x: colX(+e), y: 90, class: 'dig', 'text-anchor': 'middle', text: digits[e], style: cw() < 36 ? `font-size:${Math.round(cw() * 0.75)}px` : '' }, api.svg);
          api.say(`Zahl: <b>${fmt(val())}</b>`);
        }
        async function shift(k) {
          const keys = Object.keys(digits).map(Number);
          if (keys.some((e) => e + k > EMAX || e + k < EMIN)) { api.say('Das passt nicht mehr in die Tafel. Probier eine andere Richtung!'); return; }
          const before = fmt(val());
          await api.tw(800, (t) => keys.forEach((e) => texts[e].setAttribute('x', lerp(colX(e), colX(e + k), t))));
          digits = digitsOf(round6(k > 0 ? val() * 10 ** k : val() / 10 ** -k));
          scene();
          const op = k > 0 ? '·' : ':', pw = 10 ** Math.abs(k);
          api.say(`${before} ${op} ${fmt(pw)} = <b>${fmt(val())}</b><br>Jede Ziffer rückt ${Math.abs(k)} Stelle${Math.abs(k) > 1 ? 'n' : ''} nach <b>${k > 0 ? 'links' : 'rechts'}</b>, das Komma bleibt stehen.${Object.keys(digits).some((e) => +e < 0) || k < 0 ? '' : '<br><small>Leere Stellen vor dem Komma werden mit 0 gefüllt.</small>'}`);
        }
        const run = (k) => { api.stop(); api.run(() => shift(k)); };
        api.chips([
          { label: '· 10', onClick: () => run(1) }, { label: '· 100', onClick: () => run(2) },
          { label: ': 10', onClick: () => run(-1) }, { label: ': 100', onClick: () => run(-2) },
          { label: 'Neue Zahl', onClick() { EMAX = 3; EMIN = -3; setNum(+pick(starts).replace(',', '.')); api.stop(); scene(); } },
        ]);
        return {
          reset() { if (demoK !== undefined) setNum(num); scene(); },
          async play() {
            await api.wait(1400);
            if (demoK !== undefined) {
              api.say(`${fmt(num)} ${demoK > 0 ? '·' : ':'} ${fmt(10 ** Math.abs(demoK))}: Die Ziffern rücken um <b>${Math.abs(demoK)}</b> Stelle${Math.abs(demoK) > 1 ? 'n' : ''} nach <b>${demoK > 0 ? 'links' : 'rechts'}</b>.<br><small>So viele Nullen hat ${fmt(10 ** Math.abs(demoK))}.</small>`);
              await api.wait(2400);
              await shift(demoK);
              return;
            }
            await shift(1);
            await api.wait(2400);
            await shift(-2);
            await api.wait(2400);
            api.say('Jetzt du: Tippe unten auf <b>· 10</b>, <b>: 10</b> …');
          },
        };
      }
      // ---------------- Zahlen vergleichen: Stelle für Stelle ----------------
      if (mode === 'wechsel') {
        // Wechselgeld: vom Preis in Sprüngen bis zum bezahlten Betrag ergänzen (Beträge in Cent)
        let pay = ctx.pay, cost = ctx.cost;
        if (!isTask) { pay = pick([5, 10, 20, 50]) * 100; do cost = R(Math.round((pay * 0.3) / 5), pay / 5 - 1) * 5; while (cost === ctx.cost || U.wechselSchritte(cost, pay).length < 2); } // Beispiel mit mindestens zwei Sprüngen
        const eu = (c) => `${Math.floor(c / 100)},${String(c % 100).padStart(2, '0')} €`;
        const st = U.wechselSchritte(cost, pay), pts = [cost].concat(st.map((s) => s[1]));
        const X = (i) => 50 + i * (260 / (pts.length - 1)), y = 108;
        const lab = (i, cls) => el('text', { x: X(i), y: y + 26, class: 'ex-s ' + (cls || ''), 'text-anchor': 'middle', text: eu(pts[i]) }, api.svg);
        return {
          reset() {
            api.clear(); sub();
            el('line', { x1: 20, y1: y, x2: 340, y2: y, class: 'ray' }, api.svg);
            pts.forEach((_, i) => el('line', { x1: X(i), y1: y - 7, x2: X(i), y2: y + 7, class: 'tk' }, api.svg));
            lab(0, 'f2'); lab(pts.length - 1, 'f3');
          },
          async play() {
            api.say(`Du kaufst für <b>${eu(cost)}</b> ein und gibst <b>${eu(pay)}</b>. An der Kasse wird <b>ergänzt</b>: vom Preis in Sprüngen bis zum bezahlten Betrag.`);
            await api.wait(3200);
            for (let i = 0; i < st.length; i++) {
              const [a, b] = st[i], d = b - a;
              api.say(st.length === 1 ? `Ein Sprung reicht: ${eu(a)} + <b>${eu(d)}</b> = ${eu(b)}`
                : b === pay ? `Und bis zum bezahlten Betrag: ${eu(a)} + <b>${eu(d)}</b> = ${eu(b)}`
                : b % 1000 === 0 && (i > 0 || a % 100 === 0) ? `${i ? "Weiter bis" : "Bis"} zum nächsten Zehner: ${eu(a)} + <b>${eu(d)}</b> = ${eu(b)}`
                : `Erst bis zum nächsten vollen Euro: ${eu(a)} + <b>${eu(d)}</b> = ${eu(b)}`);
              const p = el('path', { d: `M ${X(i)} ${y} Q ${(X(i) + X(i + 1)) / 2} ${y - 78} ${X(i + 1)} ${y}`, class: 'jump' }, api.svg);
              const L = p.getTotalLength ? p.getTotalLength() : 100;
              p.style.strokeDasharray = L; p.style.strokeDashoffset = L;
              await api.tw(900, (t) => (p.style.strokeDashoffset = L * (1 - t)));
              el('text', { x: (X(i) + X(i + 1)) / 2, y: y - 48, class: 'ex-s f1', 'text-anchor': 'middle', style: 'font-weight:800', text: `+${eu(d)}` }, api.svg);
              if (i < st.length - 1) lab(i + 1);
              await api.wait(2000);
            }
            api.say(`Wechselgeld: ${st.length > 1 ? `${st.map((s) => eu(s[1] - s[0])).join(' + ')} = ` : ''}<b>${eu(pay - cost)}</b><br><small>Probe: ${eu(cost)} + ${eu(pay - cost)} = ${eu(pay)} ✓ · Man kann auch schriftlich rechnen: ${eu(pay)} − ${eu(cost)}.</small>`);
          },
        };
      }
      if (mode === 'ord') {
        // Drei Zahlen der Größe nach ordnen; nums: Zahlen so, wie sie in der Aufgabe stehen; want: 'max' | 'min' | nichts
        let nums = ctx.nums;
        if (!isTask) {
          for (;;) {
            const base = R(1, 8) / 10 + R(1, 9) / 100, z = Math.floor(base * 10) / 10;
            nums = [base, pick([base + 0.005, z + 0.005, z]), pick([z + 0.1, base + 0.01, z + 0.09])].map((x) => fmt(round6(x)));
            if (new Set(nums).size === 3 && nums.join() !== (ctx.nums || []).join()) break;
          }
        }
        const decOf = (s) => (s.split(',')[1] || '').length, dec = Math.max(1, ...nums.map(decOf));
        const padS = (s) => { const [i, d = ''] = s.split(','); return `${i},${d.padEnd(dec, '0')}`; };
        const val = (s) => +s.replace(',', '.');
        const EMAX = Math.max(...nums.map((s) => s.split(',')[0].length - 1)), EMIN = -dec;
        const cw = Math.min(44, 300 / (EMAX - EMIN + 1));
        const colX = (e) => 180 - ((EMAX - EMIN + 1) * cw) / 2 + (EMAX - e) * cw + cw / 2 + (e < 0 ? 6 : 0);
        const rowY = (i) => 62 + i * 34;
        let rows = [], padT = [];
        function scene() {
          api.clear(); sub(); rows = []; padT = [];
          for (let e = EMAX; e >= EMIN; e--) {
            el('rect', { x: colX(e) - cw / 2, y: 6, width: cw, height: 138, class: e >= 0 ? 'col' : 'col dec' }, api.svg);
            el('text', { x: colX(e), y: 24, class: 'ex-s', 'text-anchor': 'middle', text: STELLEN[e] }, api.svg);
          }
          nums.forEach((s, i) => {
            const g = el('g', {}, api.svg), [ip, dp] = padS(s).split(',');
            el('circle', { cx: colX(0) + cw / 2 + 3, cy: rowY(i), r: 3.5, class: 'comma' }, g);
            ip.split('').reverse().forEach((c, k) => el('text', { x: colX(k), y: rowY(i), class: 'dig', 'text-anchor': 'middle', style: 'font-size:24px', text: c }, g));
            dp.split('').forEach((c, k) => { const t = el('text', { x: colX(-(k + 1)), y: rowY(i), class: 'dig', 'text-anchor': 'middle', style: 'font-size:24px', text: c }, g); if (k >= decOf(s)) { t.setAttribute('opacity', 0); padT.push(t); } });
            rows.push(g);
          });
        }
        return {
          reset: scene,
          async play() {
            api.say(`<b>${nums.join(' · ')}</b><br>Wir schreiben die Zahlen untereinander in die Stellenwerttafel: gleiche Stellen genau übereinander.`);
            await api.wait(3000);
            if (padT.length) {
              padT.forEach((t) => { t.setAttribute('opacity', 1); t.setAttribute('class', 'dig f2'); });
              api.say('Fehlende Stellen füllen wir mit <b>0</b> auf. Das ändert den Wert nicht.');
              await api.wait(2600);
            }
            const whole = (s) => String(+padS(s).replace(',', ''));
            api.say(`Jetzt haben alle gleich viele Stellen. Ohne Komma gelesen stehen da <b>${nums.map(whole).join(', ')}</b> ${['Zehntel', 'Hundertstel', 'Tausendstel', 'Zehntausendstel'][dec - 1]}. Die kann man leicht ordnen.`);
            await api.wait(3600);
            const order = nums.map((s, i) => i).sort((a, b) => val(nums[a]) - val(nums[b]));
            api.say('Die kleinste Zahl nach oben, die größte nach unten …');
            await api.tw(1100, (t) => order.forEach((src, dst) => rows[src].setAttribute('transform', `translate(0,${(rowY(dst) - rowY(src)) * t})`)));
            await api.wait(600);
            const sorted = order.map((i) => nums[i]);
            api.say(`Der Größe nach: <b>${sorted.join(' &lt; ')}</b>${ctx.want && isTask ? `<br>Die ${ctx.want === 'max' ? 'größte' : 'kleinste'} Zahl ist <b>${ctx.want === 'max' ? sorted[2] : sorted[0]}</b>.` : ''}`);
          },
        };
      }
      if (mode === 'cmp') {
        // sA, sB: die Zahlen so, wie sie in der Aufgabe stehen (z. B. „0,56“ und „0,560“)
        let sA = ctx.sA || (ctx.A !== undefined ? fmt(ctx.A) : ''), sB = ctx.sB || (ctx.B !== undefined ? fmt(ctx.B) : ''), frac = ctx.frac;
        if (ctx.pre || !ctx.post) { // ähnliches Beispiel
          const base = R(1, 9) / 10 + R(1, 9) / 100;
          sA = fmt(round6(base)); sB = fmt(round6(pick([base + 0.005, base - 0.005, Math.floor(base * 10) / 10 + 0.1, base + 0.01])));
          frac = null;
        }
        const decOf = (s) => (s.split(',')[1] || '').length, dec = Math.max(1, decOf(sA), decOf(sB));
        const dig = (s) => { const [i, d = ''] = s.split(','), out = {}; i.split('').reverse().forEach((c, k) => (out[k] = +c)); d.padEnd(dec, '0').split('').forEach((c, k) => (out[-(k + 1)] = +c)); return out; };
        const dA = dig(sA), dB = dig(sB);
        const EMAX = Math.max(0, ...Object.keys(dA).map(Number), ...Object.keys(dB).map(Number)), EMIN = -dec;
        const cw = Math.min(44, 300 / (EMAX - EMIN + 1));
        const colX = (e) => 180 - ((EMAX - EMIN + 1) * cw) / 2 + (EMAX - e) * cw + cw / 2 + (e < 0 ? 6 : 0);
        let marks = [], padT = [];
        function scene() {
          api.clear(); sub(); marks = []; padT = [];
          for (let e = EMAX; e >= EMIN; e--) {
            el('rect', { x: colX(e) - cw / 2, y: 6, width: cw, height: 136, class: e >= 0 ? 'col' : 'col dec' }, api.svg);
            el('text', { x: colX(e), y: 24, class: 'ex-s', 'text-anchor': 'middle', text: STELLEN[e] }, api.svg);
            marks[e] = el('rect', { x: colX(e) - cw / 2 + 2, y: 34, width: cw - 4, height: 100, rx: 6, class: 'hl2', opacity: 0 }, api.svg);
          }
          [[dA, 70, sA], [dB, 120, sB]].forEach(([d, y, s]) => {
            el('circle', { cx: colX(0) + cw / 2 + 3, cy: y, r: 3.5, class: 'comma' }, api.svg);
            for (const e in d) {
              const t = el('text', { x: colX(+e), y, class: 'dig', 'text-anchor': 'middle', style: 'font-size:26px', text: d[e] }, api.svg);
              if (+e < -decOf(s)) { t.setAttribute('opacity', 0); padT.push(t); } // aufgefüllte Null: erscheint erst in der Erklärung
            }
          });
        }
        return {
          reset: scene,
          async play() {
            if (frac) {
              api.say(`Zuerst den Bruch als Dezimalzahl schreiben: ${fr(frac[0], frac[1])} = <b>${sA}</b>`);
              await api.wait(2400);
            }
            api.say(`<b>${sA}</b> (oben) und <b>${sB}</b> (unten) stehen in der Stellenwerttafel: gleiche Stellen genau übereinander.`);
            await api.wait(2600);
            if (padT.length) {
              padT.forEach((t) => { t.setAttribute('opacity', 1); t.setAttribute('class', 'dig f2'); });
              api.say('Fehlende Stellen füllen wir mit <b>0</b> auf. Das ändert den Wert nicht.');
              await api.wait(2400);
            }
            for (let e = EMAX; e >= EMIN; e--) {
              const a = dA[e] || 0, b = dB[e] || 0;
              await api.tw(300, (t) => marks[e].setAttribute('opacity', t));
              if (a === b) { api.say(`${STELLEN[e]}: beide <b>${a}</b> → gleich, weiter zur nächsten Stelle.`); await api.wait(1300); marks[e].setAttribute('opacity', 0.25); continue; }
              api.say(`${STELLEN[e]}: <b>${a}</b> und <b>${b}</b> → hier entscheidet es sich!<br><b>${a > b ? (frac ? `${fr(frac[0], frac[1])} = ${sA}` : sA) : sB}</b> ist größer.`);
              return;
            }
            api.say(`Alle Stellen gleich: <b>Beide Zahlen sind gleich groß.</b><br><small>Nullen am Ende hinter dem Komma ändern nichts: ${sA.length < sB.length ? `${sA} = ${sB}` : sB.length < sA.length ? `${sB} = ${sA}` : '0,5 = 0,50'}.</small>`);
          },
        };
      }
      // ---------------- Schriftlich: Komma unter Komma (+, −) und mal einstellig ----------------
      let a, b, k;
      if (isTask) ({ a, b, k } = ctx);
      else if (ctx.pre) {
        if (mode === 'mul') { do a = R(105, 999); while (a % 10 === 0); k = R(2, 9); }
        else { a = R(105, 9999); b = R(11, 999); if (Math.random() < 0.5) b = Math.round(b / 10) * 10; if (mode === 'sub' && b > a) [a, b] = [b, a]; }
      }
      const res = mode === 'add' ? a + b : mode === 'sub' ? a - b : a * k;
      const f2 = (n) => { const t = fmt(n / 100); return t.includes(',') ? (t.split(',')[1].length < 2 ? t + '0' : t) : t + ',00'; }; // immer zwei Nachkommastellen (Geld)
      const D = (n) => digitsOf(n / 100, 2); // immer zwei Nachkommastellen
      const dA = D(a), dB = mode === 'mul' ? null : D(b), dR = D(res);
      const EMAX = Math.max(0, ...Object.keys(dR).map(Number), ...Object.keys(dA).map(Number)), EMIN = -2;
      const cw = 30, colX = (e) => 200 - (e - EMIN) * cw + (e < 0 ? 0 : -8);
      const commaX = colX(0) + cw / 2 - 2;
      let resT = {}, carryT = {}, padT = [];
      function scene() {
        api.clear(); sub(); resT = {}; carryT = {}; padT = [];
        const row = (d, y, show) => { for (const e in d) { const t = el('text', { x: colX(+e), y, class: 'ex-b', 'text-anchor': 'middle', style: 'font-size:24px', text: d[e] }, api.svg); if (show && show(+e)) padT.push(t); } };
        const decA = (String(a / 100).split('.')[1] || '').length;
        row(dA, 34, (e) => e < 0 && -e > decA);
        el('circle', { cx: commaX, cy: 34, r: 3, class: 'comma' }, api.svg);
        if (mode === 'mul') {
          el('text', { x: colX(EMIN) + 34, y: 34, class: 'ex-b', 'text-anchor': 'start', style: 'font-size:24px', text: `· ${k}` }, api.svg);
        } else {
          const decB = (String(b / 100).split('.')[1] || '').length;
          row(dB, 70, (e) => e < 0 && -e > decB);
          el('circle', { cx: commaX, cy: 70, r: 3, class: 'comma' }, api.svg);
          el('text', { x: colX(EMAX) - 26, y: 70, class: 'ex-b', 'text-anchor': 'middle', style: 'font-size:24px', text: mode === 'add' ? '+' : '−' }, api.svg);
        }
        const yl = mode === 'mul' ? 52 : 82;
        el('line', { x1: colX(EMAX) - 36, y1: yl, x2: colX(EMIN) + 18, y2: yl, class: 'ray' }, api.svg);
        padT.forEach((t) => t.setAttribute('class', 'ex-b f6'));
      }
      // Übertrag klein direkt über dem Strich in der nächsten Spalte (wie im Heft)
      const yRes = mode === 'mul' ? 84 : 112, yCarry = mode === 'mul' ? 49 : 79;
      const putRes = (e, v, cls) => (resT[e] = el('text', { x: colX(e), y: yRes, class: 'ex-b ' + (cls || 'f1'), 'text-anchor': 'middle', style: 'font-size:24px', text: v }, api.svg));
      const putCarry = (e, v) => { if (carryT[e]) carryT[e].remove(); if (v) carryT[e] = el('text', { x: colX(e) + 8, y: yCarry, class: 'ex-s f3', 'text-anchor': 'middle', style: 'font-size:11px', text: v }, api.svg); };
      return {
        reset: scene,
        async play() {
          if (mode === 'mul') {
            api.say(`${f2(a)} · ${k}: Erst <b>ohne Komma</b> rechnen, also ${a} · ${k}.`);
            await api.wait(2200);
            let c = 0; const ds = String(a).split('').reverse().map(Number);
            for (let i = 0; i < ds.length; i++) {
              const e = i + EMIN, v = ds[i] * k + c, w = v % 10;
              api.say(`${ds[i]} · ${k}${c ? ` + ${c}` : ''} = ${v} → <b>${w}</b> hinschreiben${v >= 10 ? `, <b>${Math.floor(v / 10)}</b> merken` : ''}.`);
              putRes(e, w); c = Math.floor(v / 10); putCarry(e + 1, c || '');
              await api.wait(1700);
            }
            if (c) { putRes(ds.length + EMIN, c); putCarry(ds.length + EMIN, ''); api.say(`Der Übertrag <b>${c}</b> kommt vorne dran: ${a} · ${k} = <b>${a * k}</b>`); await api.wait(1800); }
            api.say(`Jetzt das Komma: ${f2(a)} hat <b>zwei</b> Stellen nach dem Komma, also auch das Ergebnis.`);
            await api.wait(1800);
            el('circle', { cx: commaX, cy: yRes, r: 3, class: 'comma' }, api.svg);
            if (res < 100) putRes(0, 0);
            api.say(`${f2(a)} · ${k} = <b>${f2(res)}</b>${a >= 100 ? `<br><small>Überschlag: ungefähr ${Math.round(a / 100)} · ${k} = ${Math.round(a / 100) * k} ✓</small>` : ''}`);
            return;
          }
          api.say(`Komma unter Komma: Die Zahlen werden so untereinander geschrieben, dass gleiche Stellen übereinander stehen.`);
          await api.wait(2200);
          if (padT.length) { api.say('Fehlende Stellen hinten füllen wir mit <b>0</b> auf. Das ändert den Wert nicht.'); padT.forEach((t) => t.setAttribute('class', 'ex-b f2')); await api.wait(2000); }
          let c = 0;
          for (let e = EMIN; e <= EMAX; e++) {
            const x = dA[e] || 0, y = dB[e] || 0;
            if (e > 0 && !(e in dA) && !(e in dB) && !c) break;
            if (mode === 'add') {
              const v = x + y + c;
              api.say(`${STELLEN[e]}: ${x} + ${y}${c ? ` + ${c}` : ''} = ${v} → <b>${v % 10}</b>${v >= 10 ? `, <b>1</b> übertragen` : ''}`);
              putRes(e, v % 10); c = v >= 10 ? 1 : 0; putCarry(e + 1, c || '');
            } else {
              const yy = y + c;
              if (x >= yy) { api.say(`${STELLEN[e]}: ${x} − ${y}${c ? ` − ${c}` : ''} = <b>${x - yy}</b>`); putRes(e, x - yy); c = 0; }
              else { api.say(`${STELLEN[e]}: ${x} − ${y}${c ? ` − ${c}` : ''} geht nicht. Wir rechnen ${x + 10} − ${y}${c ? ` − ${c}` : ''} = <b>${x + 10 - yy}</b> und merken uns <b>1</b> für die nächste Stelle.`); putRes(e, x + 10 - yy); c = 1; }
              putCarry(e + 1, c || '');
            }
            await api.wait(1800);
            if (e === -1) { el('circle', { cx: commaX, cy: yRes, r: 3, class: 'comma' }, api.svg); }
          }
          // führende Nullen weg (z. B. 0,57 bleibt 0,57)
          Object.keys(resT).map(Number).filter((e) => e > 0 && Object.keys(resT).map(Number).every((f) => f <= e) && resT[e].textContent === '0').forEach((e) => resT[e].remove());
          api.say(`Das Komma steht im Ergebnis genau unter den anderen Kommas:<br>${fmt(a / 100)} ${mode === 'add' ? '+' : '−'} ${fmt(b / 100)} = <b>${fmt(res / 100)}</b>`);
        },
      };
    },
  });

  // =====================================================
  // Arithmetisches Mittel – Türme ausgleichen
  // =====================================================
  //   ctx: { mode:'mittel', vals, unit, what ('Tag'|'Kind'|'Spiel') }, dazu pre/post – dann Balken statt Klötze
  reg('k5-mittel', {
    title: 'Arithmetisches Mittel: alles gerecht verteilen',
    viewBox: '0 0 360 240',
    create(api, ctx) {
      ctx = ctx || {};
      if (ctx.mode === 'mittel') return mittelBalken(api, ctx);
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
          api.say(`Jetzt sind alle Türme gleich hoch: <b>${m}</b>. Das ist das <b>arithmetische Mittel</b> (kurz: der Mittelwert).<br>Rechnung: (${vals.join(' + ')}) : 4 = ${m * 4} : 4 = <b>${m}</b>`);
        },
      };
    },
  });

  function mittelBalken(api, ctx) {
    const isTask = !!ctx.post;
    let vals = ctx.vals.slice();
    if (ctx.pre) { // ähnliche Werte, gleicher Bereich
      const lo = Math.min(...vals), hi = Math.max(...vals), n = vals.length;
      for (;;) {
        vals = Array.from({ length: n }, () => R(lo, hi));
        const s = vals.reduce((x, y) => x + y, 0) - vals[n - 1], m0 = Math.round((s + vals[n - 1]) / n), last = m0 * n - s;
        if (last >= lo && last <= hi && vals.join() !== ctx.vals.join()) { vals[n - 1] = last; break; }
      }
    }
    const n = vals.length, sum = vals.reduce((x, y) => x + y, 0), m = sum / n, unit = ctx.unit || '';
    const vmax = Math.max(...vals), base = 200, Hmax = 150, sc = Hmax / vmax;
    const bw = Math.min(40, 260 / n - 12), bx = (i) => 50 + i * (280 / n) + (280 / n - bw) / 2;
    let bars = [], labs = [];
    return {
      reset() {
        api.clear(); subFor(api, ctx, 'mittel', isTask); bars = []; labs = [];
        el('line', { x1: 30, y1: base, x2: 340, y2: base, class: 'ray' }, api.svg);
        vals.forEach((v, i) => {
          bars.push(el('rect', { x: bx(i), y: base - v * sc, width: bw, height: v * sc, rx: 4, class: 'blk' }, api.svg));
          labs.push(el('text', { x: bx(i) + bw / 2, y: base - v * sc - 6, class: 'ex-s', 'text-anchor': 'middle', text: v }, api.svg));
          el('text', { x: bx(i) + bw / 2, y: base + 18, class: 'ex-s', 'text-anchor': 'middle', style: 'font-size:11px', text: `${ctx.what || 'Wert'} ${i + 1}` }, api.svg);
        });
      },
      async play() {
        api.say(`Die Werte: <b>${vals.join(', ')}</b>${unit ? ' ' + unit : ''}. Das arithmetische Mittel (der Mittelwert) ist die Höhe, auf der <b>alle gleich</b> wären.`);
        await api.wait(2400);
        api.say(`Erst alles zusammenzählen: ${vals.join(' + ')} = <b>${sum}</b>`);
        await api.wait(2400);
        api.say(`Dann gerecht auf ${n} verteilen: ${sum} : ${n} = <b>${fmt(m)}</b>`);
        const ln = el('line', { x1: 40, y1: base - m * sc, x2: 330, y2: base - m * sc, class: 'mean', opacity: 0 }, api.svg);
        await api.tw(500, (t) => ln.setAttribute('opacity', t));
        await api.wait(1200);
        api.say('Was über der Linie ist, füllt die Lücken unter der Linie auf …');
        await api.tw(1400, (t) => vals.forEach((v, i) => {
          const h = lerp(v, m, t) * sc;
          bars[i].setAttribute('y', base - h); bars[i].setAttribute('height', h);
          labs[i].setAttribute('y', base - h - 6); labs[i].textContent = t < 1 ? Math.round(lerp(v, m, t)) : fmt(m);
        }));
        api.say(`Alle Balken sind jetzt gleich hoch: <b>${fmt(m)}${unit ? ' ' + unit : ''}</b>. Das ist das arithmetische Mittel.<br><small>Summe aller Werte : Anzahl der Werte</small>`);
      },
    };
  }

  // =====================================================
  // Koordinatensystem – erst laufen, dann springen
  // =====================================================
  //   ctx: { mode:'koord', x, y }, dazu pre/post
  reg('k5-koord', {
    title: 'Erst laufen, dann springen',
    viewBox: '0 0 360 250',
    create(api, ctx) {
      ctx = ctx || {};
      const isTask = ctx.mode === 'koord' && ctx.post;
      let px, py, fox, trail;
      // mit Aufgabe: Gitter wie in der Aufgabe (x bis 10, y bis 8)
      const NX = ctx.mode === 'koord' ? 10 : 9, NY = ctx.mode === 'koord' ? 8 : 6;
      const s = Math.min(32, 290 / NX, 196 / NY), ox = 40, oy = 222;
      const pickN = () => { px = R(1, NX - 1); py = R(1, NY - 1); };
      // from: Startpunkt beim Verschieben (sonst startet der Fuchs im Ursprung)
      let from = null;
      if (isTask) { ({ x: px, y: py } = ctx); from = ctx.from || null; }
      else if (ctx.mode === 'koord' && ctx.pre && ctx.from) { do { from = [R(0, 5), R(0, 4)]; px = from[0] + R(1, 4); py = from[1] + R(1, 3); } while (px === ctx.x && py === ctx.y); }
      else if (ctx.mode === 'koord' && ctx.pre) { do pickN(); while (px === ctx.x && py === ctx.y); }
      else pickN();
      const sx = () => (from ? from[0] : 0), sy = () => (from ? from[1] : 0);
      api.chips([{ label: 'Neuer Punkt', onClick() { from = null; pickN(); api.replay(); } }]);
      return {
        reset() {
          api.clear(); subFor(api, ctx, 'koord', isTask);
          for (let i = 0; i <= NX; i++) el('line', { x1: ox + i * s, y1: oy, x2: ox + i * s, y2: oy - NY * s, class: 'grid' }, api.svg);
          for (let j = 0; j <= NY; j++) el('line', { x1: ox, y1: oy - j * s, x2: ox + NX * s, y2: oy - j * s, class: 'grid' }, api.svg);
          el('line', { x1: ox, y1: oy, x2: ox + NX * s + 8, y2: oy, class: 'axis' }, api.svg);
          el('line', { x1: ox, y1: oy, x2: ox, y2: oy - NY * s - 8, class: 'axis' }, api.svg);
          for (let i = 0; i <= NX; i++) el('text', { x: ox + i * s, y: oy + 16, class: 'tick', 'text-anchor': 'middle', text: i }, api.svg);
          for (let j = 1; j <= NY; j++) el('text', { x: ox - 9, y: oy - j * s + 4, class: 'tick', 'text-anchor': 'end', text: j }, api.svg);
          trail = el('polyline', { points: `${ox + sx() * s},${oy - sy() * s}`, class: 'trail' }, api.svg);
          if (from) el('circle', { cx: ox + sx() * s, cy: oy - sy() * s, r: 6, class: 'pt', opacity: 0.45 }, api.svg);
          fox = el('text', { x: ox + sx() * s, y: oy - sy() * s - 4, 'text-anchor': 'middle', class: 'fox', text: '🦊' }, api.svg);
        },
        async play() {
          const Y0 = oy - sy() * s;
          const pts = [[ox + sx() * s, Y0]];
          const put = (x, y) => { fox.setAttribute('x', x); fox.setAttribute('y', y - 4); };
          put(ox + sx() * s, Y0);
          api.say(from ? `Der Fuchs startet im Punkt <b>P(${from[0]} | ${from[1]})</b>. Er geht ${px - from[0]} nach rechts und ${py - from[1]} nach oben.` : 'Der Fuchs startet im Ursprung <b>(0 | 0)</b>.');
          await api.wait(from ? 2600 : 1200);
          if (!px) { api.say('x = 0: <b>kein</b> Schritt nach rechts, der Fuchs bleibt auf der y-Achse.'); await api.wait(1600); }
          for (let i = sx() + 1; i <= px; i++) {
            api.say(from ? `Nach rechts wächst der <b>x-Wert</b>: x = ${i}` : `Erst <b>laufen</b> nach rechts: ${i}`);
            const x0 = ox + (i - 1) * s;
            await api.tw(320, (t) => { put(x0 + s * t, Y0); trail.setAttribute('points', pts.concat([[x0 + s * t, Y0]]).map((p) => p.join(',')).join(' ')); });
            pts.push([ox + i * s, Y0]);
          }
          await api.wait(500);
          if (!py) { api.say('y = 0: <b>kein</b> Sprung nach oben, der Punkt liegt auf der x-Achse.'); await api.wait(1600); }
          for (let j = sy() + 1; j <= py; j++) {
            api.say(from ? `Nach oben wächst der <b>y-Wert</b>: y = ${j}` : `… dann <b>springen</b> nach oben: ${j}`);
            const y0 = oy - (j - 1) * s, X = ox + px * s;
            await api.tw(360, (t) => { put(X + Math.sin(t * Math.PI) * 6, y0 - s * t); trail.setAttribute('points', pts.concat([[X, y0 - s * t]]).map((p) => p.join(',')).join(' ')); });
            pts.push([X, oy - j * s]);
          }
          const P = el('circle', { cx: ox + px * s, cy: oy - py * s, r: 7, class: 'pt' }, api.svg);
          P.parentNode.insertBefore(P, fox);
          const fx0 = ox + px * s, fy0 = oy - py * s;
          await api.tw(400, (t) => put(fx0 + 22 * t, fy0 - 6 * t));
          api.say(from ? `Neuer Punkt: <b>P(${px} | ${py})</b><br>x: ${from[0]} + ${px - from[0]} = ${px} · y: ${from[1]} + ${py - from[1]} = ${py}`
            : `Angekommen: <b>${isTask && ctx.name ? `Punkt ${ctx.name} liegt bei (${px} | ${py})` : `P(${px} | ${py})`}</b><br>Zuerst steht der x-Wert (rechts), dann der y-Wert (hoch).`);
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
  //   ctx: { mode:'wart', a }, dazu pre/post
  reg('k5-winkelart', {
    title: 'Winkelarten',
    viewBox: '0 0 360 250',
    create(api, ctx) {
      ctx = ctx || {};
      const isTask = ctx.mode === 'wart' && ctx.post;
      let target = null;
      if (isTask) target = ctx.a;
      else if (ctx.mode === 'wart' && ctx.pre) { // ein Winkel einer anderen Art
        const pool = [R(10, 85), 90, R(95, 170), 180, R(195, 340)].filter((v) => TYPES(v)[0] !== TYPES(ctx.a)[0]);
        target = pick(pool);
      }
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
        reset() { scene(); subFor(api, ctx, 'wart', isTask); },
        async play() {
          const seg = async (a0, a1, ms) => api.tw(ms, (t) => { const a = lerp(a0, a1, t); sl.value = Math.round(a); draw(a); }, (t) => t);
          if (target !== null) {
            // Grenzen nacheinander zeigen, dann auf den Winkel der Aufgabe drehen
            api.say(`Wir drehen den Strahl auf <b>${target}°</b> …`);
            await api.wait(1000);
            const stops = [90, 180, 360].filter((v) => v < target);
            let cur = 0;
            for (const v of stops) { await seg(cur, v, 700); cur = v; await api.wait(900); }
            await seg(cur, target, 900);
            await api.wait(600);
            const [name] = TYPES(target);
            const lo = target < 90 ? 'kleiner als 90°' : target === 90 ? 'genau 90°' : target < 180 ? 'größer als 90°, aber kleiner als 180°' : target === 180 ? 'genau 180°' : 'größer als 180°, aber kleiner als 360°';
            api.say(`<span class="exbig ${TYPES(target)[1]}">${name}</span><br>${target}° ist ${lo}.<br><small>Merke die Grenzen: 90° (rechter Winkel) und 180° (gestreckter Winkel).</small>`);
            return;
          }
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
  //   ctx: { mode:'wpaar', parallel, rel, gv, av }, dazu pre/post
  reg('k5-winkelpaar', {
    title: 'Winkel an Geraden',
    viewBox: '0 0 360 230',
    create(api, ctx) {
      ctx = ctx || {};
      const isTask = ctx.mode === 'wpaar' && ctx.post;
      let t = null; // Aufgabe (oder ähnliches Beispiel)
      if (ctx.mode === 'wpaar' && (ctx.post || ctx.pre)) {
        t = Object.assign({}, ctx);
        if (ctx.pre) { let g; do g = R(35, 145); while ((g > 80 && g < 100) || g === ctx.gv); t.gv = g; t.av = /Scheitel|^Stufen|^Wechsel/.test(t.rel) ? g : 180 - g; }
      }
      const SAME = (r) => r === 'Nebenwinkel' || r === 'Scheitelwinkel';
      let mode = t && !SAME(t.rel) ? 'b' : 'a', alpha = t ? t.gv : 60;
      const cx = 180, cy = 115;
      // tk: Aufgabe (nur der gegebene Winkel und das gesuchte β werden beschriftet), tk.done: β mit Ergebnis
      function sceneA(a, tk) {
        api.clear();
        const rg = [[0, a], [a, 180], [180, 180 + a], [180 + a, 360]];
        const bi = tk ? (tk.rel === 'Scheitelwinkel' ? 2 : 1) : -1;
        rg.forEach((r, i) => { if (!tk || i === 0 || i === bi) el('path', { d: arcD(cx, cy, 30, r[0], r[1], true), class: (tk ? i === bi : i % 2) ? 'wB' : 'wA' }, api.svg); });
        el('line', { x1: 20, y1: cy, x2: 340, y2: cy, class: 'ray' }, api.svg);
        const p0 = pt(cx, cy, 200, a), p1 = pt(cx, cy, 200, a + 180);
        el('line', { x1: p0[0], y1: p0[1], x2: p1[0], y2: p1[1], class: 'ray' }, api.svg);
        const names = ['α', 'β', 'α′', 'β′'];
        if (tk) {
          rg.forEach((r, i) => { if (i !== 0 && i !== bi) return; const lp = pt(cx, cy, 56, (r[0] + r[1]) / 2); el('text', { x: lp[0], y: lp[1] + 5, class: i === bi ? 'blbl' : 'albl', 'text-anchor': 'middle', text: i === 0 ? `${a}°` : tk.done ? `β=${tk.av}°` : 'β=?' }, api.svg); });
          api.say(`Zwei Geraden schneiden sich. Gegeben ist der Winkel <b class="cA">${a}°</b>, gesucht ist <b class="cB">β</b>.`);
          return;
        }
        rg.forEach((r, i) => { const lp = pt(cx, cy, 52, (r[0] + r[1]) / 2); el('text', { x: lp[0], y: lp[1] + 5, class: i % 2 ? 'blbl' : 'albl', 'text-anchor': 'middle', text: `${names[i]}=${i % 2 ? 180 - a : a}°` }, api.svg); });
        api.say(`<b class="cA">α</b> und <b class="cB">β</b> sind <b>Nebenwinkel</b>: ${a}° + ${180 - a}° = <b>180°</b><br><b class="cA">α</b> und <b class="cA">α′</b> liegen sich gegenüber: <b>Scheitelwinkel</b>, immer gleich groß.`);
      }
      const yT = 70, yB = 165;
      let copy;
      function sceneB() {
        api.clear(); subFor(api, ctx, 'wpaar', isTask);
        const a = t ? t.gv : 62, cot = 1 / Math.tan(rad(a));
        const xT = 180 + ((yB - yT) / 2) * cot, xB = 180 - ((yB - yT) / 2) * cot;
        el('line', { x1: 20, y1: yT, x2: 340, y2: yT, class: 'ray' }, api.svg);
        el('line', { x1: 20, y1: yB, x2: 340, y2: yB, class: 'ray' }, api.svg);
        el('text', { x: 336, y: yT - 7, class: 'tick b', 'text-anchor': 'end', text: 'g' }, api.svg);
        el('text', { x: 336, y: yB - 7, class: 'tick b', 'text-anchor': 'end', text: 'h' }, api.svg);
        const p0 = pt(xT, yT, 160, a), p1 = pt(xT, yT, 260, a + 180);
        el('line', { x1: p0[0], y1: p0[1], x2: p1[0], y2: p1[1], class: 'ray' }, api.svg);
        el('path', { d: arcD(xT, yT, 30, 0, a, true), class: 'wA' }, api.svg);
        const lp = pt(xT, yT, 48, a / 2);
        el('text', { x: lp[0], y: lp[1] + 5, class: 'albl', 'text-anchor': 'middle', text: t ? `${a}°` : 'α' }, api.svg);
        copy = el('g', { opacity: 0 }, api.svg);
        el('path', { d: arcD(xT, yT, 30, 0, a, true), class: 'wB' }, copy);
        const lp2 = pt(xT, yT, 48, a / 2);
        copy.lab = el('text', { x: lp2[0], y: lp2[1] + 5, class: 'blbl', 'text-anchor': 'middle', text: t ? `${a}°` : 'α' }, copy);
        return { xT, xB, a };
      }
      const sl = api.slider({ label: 'Gerade drehen', min: 20, max: 160, value: alpha, onInput(v) { if (mode !== 'a') return; alpha = v; sceneA(v); } });
      const sliderRow = sl.closest('.exslider');
      if (!t) api.chips([
        { label: 'Neben- & Scheitelwinkel', onClick() { mode = 'a'; sliderRow.style.display = ''; api.replay(); } },
        { label: 'Stufen- & Wechselwinkel', onClick() { mode = 'b'; sliderRow.style.display = 'none'; api.replay(); } },
      ]);
      if (t) sliderRow.style.display = 'none'; // bei einer Aufgabe bleibt das Bild fest
      return {
        reset() { if (mode === 'a') { sceneA(alpha, t); subFor(api, ctx, 'wpaar', isTask); } else sceneB(); },
        async play() {
          if (mode === 'a' && t) {
            // gleiche Kreuzung: Nebenwinkel oder Scheitelwinkel
            sceneA(t.gv, t); subFor(api, ctx, 'wpaar', isTask);
            await api.wait(2600);
            api.say(`β liegt ${t.rel === 'Scheitelwinkel' ? 'dem gegebenen Winkel genau <b>gegenüber</b>: Das ist der <b>Scheitelwinkel</b>.' : 'direkt <b>neben</b> dem gegebenen Winkel, zusammen ergeben beide eine gerade Linie: Das ist ein <b>Nebenwinkel</b>.'}`);
            await api.wait(3000);
            sceneA(t.gv, Object.assign({}, t, { done: true }));
            api.say(`Gegeben ist ${t.gv}°. β ist ${t.rel === 'Scheitelwinkel' ? 'der <b>Scheitelwinkel</b> (gegenüber)' : 'ein <b>Nebenwinkel</b> (daneben, zusammen eine gerade Linie)'}.<br>${t.rel === 'Scheitelwinkel' ? `Scheitelwinkel sind gleich groß: β = <b>${t.av}°</b>` : `Nebenwinkel ergeben 180°: β = 180° − ${t.gv}° = <b>${t.av}°</b>`}`);
            return;
          }
          if (mode === 'a') {
            await api.wait(2500);
            const seg = (a0, a1, ms) => api.tw(ms, (t) => { alpha = Math.round(lerp(a0, a1, t)); sl.value = alpha; sceneA(alpha); });
            await seg(alpha, 130, 2200); await api.wait(1800);
            await seg(130, 35, 2200); await api.wait(1800);
            await seg(35, 60, 900);
            return;
          }
          const { xT, xB } = sceneB();
          if (t) {
            api.say(`g und h sind parallel. Oben ist der Winkel <b class="cA">${t.gv}°</b> gegeben.`);
            await api.wait(1800);
            api.say('Wir schieben eine Kopie an der schrägen Geraden entlang nach unten …');
            copy.setAttribute('opacity', 1);
            await api.tw(1600, (k) => copy.setAttribute('transform', `translate(${(xB - xT) * k},${(yB - yT) * k})`));
            api.say(`… sie passt genau: Der <b>Stufenwinkel</b> unten ist auch ${t.gv}°.`);
            await api.wait(2400);
            if (t.rel === 'Wechselwinkel') {
              api.say('Jetzt drehen wir die Kopie um 180° um den Schnittpunkt …');
              await api.tw(1500, (k) => copy.setAttribute('transform', `translate(${xB - xT},${yB - yT}) rotate(${180 * k} ${xT} ${yT})`));
              copy.lab.setAttribute('transform', `rotate(180 ${copy.lab.getAttribute('x')} ${+copy.lab.getAttribute('y') - 5})`);
              api.say(`β ist der <b>Wechselwinkel</b>: auch er ist genau so groß, β = <b>${t.av}°</b>.`);
            } else if (t.rel === 'Stufenwinkel') {
              api.say(`β ist dieser <b>Stufenwinkel</b>: β = <b>${t.av}°</b>.<br><small>Stufenwinkel an Parallelen sind gleich groß.</small>`);
            } else {
              api.say(`β liegt direkt <b>neben</b> diesem Stufenwinkel, zusammen ergeben sie eine gerade Linie.<br>β = 180° − ${t.gv}° = <b>${t.av}°</b>`);
            }
            return;
          }
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
  //   ctx: { mode:'rect', kind:'u'|'a'|'b', a, b, unit } · { mode:'rect', kind:'l', Wd, Hd, w, h }, dazu pre/post
  // =====================================================
  reg('k5-rechteck', {
    title: 'Fläche und Umfang',
    titleFor: (ctx) => (ctx && ctx.mode === 'rect' ? { u: 'Umfang: einmal außen herum', a: 'Flächeninhalt: Kästchen auslegen', b: 'Fehlende Seite: rückwärts rechnen', l: 'Zusammengesetzte Fläche' }[ctx.kind] : 'Fläche und Umfang'),
    viewBox: '0 0 360 200',
    create(api, ctx) {
      ctx = ctx || {};
      const isTask = ctx.mode === 'rect' && ctx.post;
      let a, b, unit = 'cm', mode = 'A', L = null, bLab = null;
      const pickN = () => { a = R(4, 8); b = R(2, 4); };
      if (ctx.mode === 'rect') {
        mode = { u: 'U', a: 'A', b: 'B', l: 'L' }[ctx.kind];
        if (isTask) { a = ctx.a; b = ctx.b; unit = ctx.unit || 'cm'; if (ctx.kind === 'l') L = ctx; }
        else { // ähnliches Beispiel
          unit = ctx.unit || 'cm';
          do { a = R(3, 12); b = R(2, 8); } while (a === ctx.a && b === ctx.b);
          if (ctx.kind === 'l') { const Wd = R(6, 12), Hd = R(5, 10); L = { Wd, Hd, w: R(2, Wd - 3), h: R(2, Hd - 3) }; }
        }
        if (L) { a = L.Wd; b = L.Hd; unit = 'cm'; }
      } else pickN();
      const s = Math.min(34, 240 / a, 140 / b);
      const x0 = () => 165 - (a * s) / 2, y0 = 26; // rechts Platz für die Beschriftung b = …
      const u1 = `1-${unit}²`;
      if (ctx.mode !== 'rect') api.chips([
        { label: 'Flächeninhalt', onClick() { mode = 'A'; api.replay(); } },
        { label: 'Umfang', onClick() { mode = 'U'; api.replay(); } },
        { label: 'Neues Rechteck', onClick() { pickN(); api.replay(); } },
      ]);
      async function fillRows(rows, cols, label) {
        // Kästchen auslegen: kleine Rechtecke einzeln, große Reihe für Reihe
        const single = rows * cols <= 60;
        for (let r = 0; r < rows; r++) {
          for (let k = 0; k < cols; k++) {
            el('rect', { x: x0() + k * s + 1.5, y: y0 + r * s + 1.5, width: s - 3, height: s - 3, rx: Math.min(4, s / 5), class: 'unit' }, api.svg);
            if (single && s > 20) el('text', { x: x0() + k * s + s / 2, y: y0 + r * s + s / 2 + 5, class: 'ex-s', 'text-anchor': 'middle', text: r * cols + k + 1 }, api.svg);
            if (single || r === 0) await api.wait(single ? (r === 0 ? 240 : 80) : 40);
          }
          if (single || r === 0 || r === rows - 1) api.say(label(r + 1));
          await api.wait(single ? 600 : r === 0 ? 1200 : 160);
        }
      }
      return {
        reset() {
          api.clear(); subFor(api, ctx, 'rect', isTask);
          api.svg.setAttribute('viewBox', `0 0 360 ${y0 + b * s + 50}`);
          if (mode === 'L') {
            const { w, h } = L, X = x0();
            const pts = [[X, y0], [X + (a - w) * s, y0], [X + (a - w) * s, y0 + h * s], [X + a * s, y0 + h * s], [X + a * s, y0 + b * s], [X, y0 + b * s]];
            L.missing = el('rect', { x: X + (a - w) * s, y: y0, width: w * s, height: h * s, class: 'unit', opacity: 0 }, api.svg);
            el('polygon', { points: pts.map((q) => q.join(',')).join(' '), class: 'shape' }, api.svg);
            el('text', { x: 180, y: y0 + b * s + 24, class: 'ex-s', 'text-anchor': 'middle', text: `${a} cm` }, api.svg);
            el('text', { x: X - 8, y: y0 + (b * s) / 2 + 5, class: 'ex-s', 'text-anchor': 'end', text: `${b} cm` }, api.svg);
            // wie in der Aufgabe: oben und rechts stehen die Längen der Figur (nicht die des fehlenden Stücks)
            el('text', { x: X + ((a - w) * s) / 2, y: y0 - 7, class: 'ex-s', 'text-anchor': 'middle', text: `${a - w} cm` }, api.svg);
            el('text', { x: X + a * s + 8, y: y0 + h * s + ((b - h) * s) / 2 + 5, class: 'ex-s', text: `${b - h} cm` }, api.svg);
            return;
          }
          el('rect', { x: x0(), y: y0, width: a * s, height: b * s, class: 'shape' }, api.svg);
          el('text', { x: 180, y: y0 + b * s + 24, class: 'ex-s', 'text-anchor': 'middle', text: `a = ${a} ${unit}` }, api.svg);
          bLab = el('text', { x: x0() + a * s + 8, y: y0 + (b * s) / 2 + 5, class: 'ex-s', text: mode === 'B' ? 'b = ?' : `b = ${b} ${unit}` }, api.svg);
        },
        async play() {
          if (mode === 'A') {
            api.say(`Wie viele <b>${u1}-Kästchen</b> passen hinein?`);
            await api.wait(1000);
            await fillRows(b, a, (r) => `${r} Reihe${r > 1 ? 'n' : ''} mit je ${a} Kästchen = ${r * a}`);
            api.say(`${b} Reihen · ${a} Kästchen: <b>A = a · b = ${a} · ${b} = ${a * b} ${unit}²</b>`);
          } else if (mode === 'B') {
            api.say(`Der Flächeninhalt ist <b>${a * b} ${unit}²</b>, also ${a * b} Kästchen. In eine Reihe passen <b>${a}</b> (Seite a).`);
            await api.wait(2200);
            await fillRows(b, a, (r) => `${r} Reihe${r > 1 ? 'n' : ''}: ${r * a} Kästchen${r * a === a * b ? ' – genau alle!' : ''}`);
            if (bLab) { bLab.textContent = `b = ${b} ${unit}`; bLab.setAttribute('class', 'ex-s f1'); }
            api.say(`Es werden <b>${b} Reihen</b>. Das ist die Seite b.<br><b>b = A : a = ${a * b} : ${a} = ${b} ${unit}</b>`);
          } else if (mode === 'L') {
            const { w, h } = L;
            api.say('Die Figur ist kein Rechteck. Trick: Wir ergänzen sie zu einem <b>großen Rechteck</b> …');
            await api.wait(1800);
            await api.tw(600, (k) => L.missing.setAttribute('opacity', k));
            api.say(`Wie groß ist das fehlende Stück?<br>Breite: ${a} − ${a - w} = <b>${w} cm</b> · Höhe: ${b} − ${b - h} = <b>${h} cm</b>`);
            el('text', { x: x0() + (a - w / 2) * s, y: y0 + (h * s) / 2 + 5, class: 'ex-s', 'text-anchor': 'middle', text: `${w}·${h}` }, api.svg);
            await api.wait(3400);
            api.say(`Großes Rechteck: ${a} · ${b} = <b>${a * b} cm²</b>. Das blaue Stück gehört nicht dazu: ${w} · ${h} = <b>${w * h} cm²</b>.`);
            await api.wait(2800);
            await api.tw(600, (k) => L.missing.setAttribute('opacity', 1 - 0.7 * k));
            api.say(`A = ${a * b} cm² − ${w * h} cm² = <b>${a * b - w * h} cm²</b><br><small>Man kann die Figur auch in zwei Rechtecke zerlegen und addieren.</small>`);
          } else {
            const X = x0(), Y = y0, W = a * s, H = b * s;
            const path = [[X, Y], [X + W, Y], [X + W, Y + H], [X, Y + H], [X, Y]];
            const sides = [a, b, a, b];
            const dot = el('circle', { cx: X, cy: Y, r: 8, class: 'mk' }, api.svg);
            const line = el('polyline', { points: `${X},${Y}`, class: 'trail2' }, api.svg);
            const done = [[X, Y]];
            const sum = [];
            api.say('Der Umfang ist der Weg einmal ganz außen herum.');
            await api.wait(1200);
            for (let i = 0; i < 4; i++) {
              const [fx, fy] = path[i], [tx, ty] = path[i + 1];
              await api.tw(900, (k) => { const x = lerp(fx, tx, k), y = lerp(fy, ty, k); dot.setAttribute('cx', x); dot.setAttribute('cy', y); line.setAttribute('points', done.concat([[x, y]]).map((q) => q.join(',')).join(' ')); });
              done.push([tx, ty]); sum.push(sides[i]);
              api.say(i === 0 ? `Erste Seite: <b>${sides[0]} ${unit}</b>` : `${sum.join(` ${unit} + `)} ${unit} = <b>${sum.reduce((q, r) => q + r, 0)} ${unit}</b>`);
              await api.wait(500);
            }
            api.say(`<b>u = 2 · a + 2 · b = 2 · ${a} + 2 · ${b} = ${2 * (a + b)} ${unit}</b>`);
          }
        },
      };
    },
  });

  // =====================================================
  // Quader – Würfel stapeln
  //   ctx: { mode:'quader', kind:'v'|'o'|'l', a, b, c (bei 'l' in cm, Vielfache von 10) }, dazu pre/post
  // =====================================================
  reg('k5-quader', {
    title: 'Volumen: Würfel stapeln',
    titleFor: (ctx) => (ctx && ctx.mode === 'quader' ? { v: 'Volumen: Würfel stapeln', o: 'Oberfläche: sechs Flächen', l: 'Liter: Würfel mit 1 dm Kantenlänge' }[ctx.kind] : 'Volumen: Würfel stapeln'),
    viewBox: '0 0 360 230',
    create(api, ctx) {
      ctx = ctx || {};
      const isTask = ctx.mode === 'quader' && ctx.post;
      const kind = ctx.mode === 'quader' ? ctx.kind : 'v';
      let a, b, c, cm = null; // cm: Originalmaße bei Litern
      const pickN = () => { a = R(2, 4); b = R(2, 3); c = R(2, 3); };
      if (ctx.mode === 'quader' && (isTask || ctx.pre)) {
        if (isTask) ({ a, b, c } = ctx);
        else if (kind === 'l') { a = R(2, 8) * 10; b = R(2, 6) * 10; c = R(2, 5) * 10; }
        else { do { a = R(2, 6); b = R(2, 4); c = R(2, 4); } while (a === ctx.a && b === ctx.b && c === ctx.c); }
        if (kind === 'l') { cm = [a, b, c]; a /= 10; b /= 10; c /= 10; }
      } else pickN();
      const s = Math.min(26, 300 / ((a + b) * Math.cos(rad(30))), 185 / ((a + b) * 0.5 + c));
      const cs = Math.cos(rad(30)) * s, sn = 0.5 * s;
      const cx = 180 + ((b - a) / 2) * cs, cy = 212 - (a + b) * sn;
      const P = (x, y, z) => [cx + (x - y) * cs, cy + (x + y) * sn - z * s];
      const poly = (pts, cls, g) => el('polygon', { points: pts.map((q) => P(...q).map((v) => v.toFixed(1)).join(',')).join(' '), class: cls }, g);
      function box(x0, y0, z0, x1, y1, z1, g) {
        const bg = el('g', { opacity: 0 }, g);
        poly([[x0, y0, z1], [x1, y0, z1], [x1, y1, z1], [x0, y1, z1]], 'cT', bg);
        poly([[x1, y0, z0], [x1, y1, z0], [x1, y1, z1], [x1, y0, z1]], 'cR', bg);
        poly([[x0, y1, z0], [x1, y1, z0], [x1, y1, z1], [x0, y1, z1]], 'cL', bg);
        return bg;
      }
      const grid = (g, z) => { // Würfelgitter auf einer Schicht (sichtbare Seiten)
        for (let i = 1; i < a; i++) { el('line', { x1: P(i, 0, z)[0], y1: P(i, 0, z)[1], x2: P(i, b, z)[0], y2: P(i, b, z)[1], class: 'tk', style: 'stroke-width:.8' }, g); el('line', { x1: P(i, b, z)[0], y1: P(i, b, z)[1], x2: P(i, b, z - 1)[0], y2: P(i, b, z - 1)[1], class: 'tk', style: 'stroke-width:.8' }, g); }
        for (let j = 1; j < b; j++) { el('line', { x1: P(0, j, z)[0], y1: P(0, j, z)[1], x2: P(a, j, z)[0], y2: P(a, j, z)[1], class: 'tk', style: 'stroke-width:.8' }, g); el('line', { x1: P(a, j, z)[0], y1: P(a, j, z)[1], x2: P(a, j, z - 1)[0], y2: P(a, j, z - 1)[1], class: 'tk', style: 'stroke-width:.8' }, g); }
      };
      const U = kind === 'l' ? 'dm' : 'cm';
      if (ctx.mode !== 'quader') api.chips([{ label: 'Neuer Quader', onClick() { pickN(); api.replay(); } }]);
      const labels = () => {
        const la = P(a / 2, b, 0), lb = P(a, b / 2, 0), lc = P(a, 0, c / 2);
        el('text', { x: la[0] - 18, y: la[1] + 20, class: 'ex-s', 'text-anchor': 'middle', text: `a = ${a}${kind !== 'v' || isTask ? ' ' + U : ''}` }, api.svg);
        el('text', { x: lb[0] + 16, y: lb[1] + 18, class: 'ex-s', text: `b = ${b}${kind !== 'v' || isTask ? ' ' + U : ''}` }, api.svg);
        el('text', { x: lc[0] + 12, y: lc[1], class: 'ex-s', text: `c = ${c}${kind !== 'v' || isTask ? ' ' + U : ''}` }, api.svg);
      };
      async function stack() {
        let n = 0;
        const single = a * b * c <= 48;
        for (let k = 0; k < c; k++) {
          if (single) {
            const order = [];
            for (let i = 0; i < a; i++) for (let j = 0; j < b; j++) order.push([i, j]);
            order.sort((p, q) => p[0] + p[1] - (q[0] + q[1]));
            for (const [i, j] of order) {
              const cg = box(i, j, k, i + 1, j + 1, k + 1, api.svg);
              n++;
              await api.tw(k === 0 ? 200 : 80, (t) => { cg.setAttribute('opacity', t); cg.setAttribute('transform', `translate(0,${(1 - t) * -14})`); });
            }
          } else { // ganze Schicht auf einmal, mit Würfelgitter
            const lg = box(0, 0, k, a, b, k + 1, api.svg); grid(lg, k + 1);
            n += a * b;
            await api.tw(k === 0 ? 700 : 260, (t) => { lg.setAttribute('opacity', t); lg.setAttribute('transform', `translate(0,${(1 - t) * -14})`); });
          }
          if (k === 0 || k === c - 1 || single) api.say(k === 0 ? `1. Schicht: ${a} · ${b} = <b>${a * b} Würfel</b>` : `${k + 1} Schichten · ${a * b} Würfel = <b>${n} Würfel</b>`);
          await api.wait(k === 0 ? 1500 : single ? 1000 : 200);
        }
      }
      return {
        reset() { api.clear(); subFor(api, ctx, 'quader', isTask); },
        async play() {
          if (kind === 'l') {
            api.say(`${cm[0]} cm = ${a} dm, ${cm[1]} cm = ${b} dm, ${cm[2]} cm = ${c} dm.<br><small>10 cm = 1 dm. Ein Würfel mit 1 dm Kantenlänge fasst genau <b>1 Liter</b>.</small>`);
            await api.wait(2800);
            await stack(); labels();
            api.say(`V = ${a} dm · ${b} dm · ${c} dm = <b>${a * b * c} dm³ = ${a * b * c} Liter</b><br><small>1 dm³ = 1 l</small>`);
            return;
          }
          if (kind === 'o') {
            const g = box(0, 0, 0, a, b, c, api.svg); g.setAttribute('opacity', 1); labels();
            const faces = [
              [[[0, 0, c], [a, 0, c], [a, b, c], [0, b, c]], `oben und unten: je ${a} · ${b} = <b>${a * b} cm²</b>`, a * b],
              [[[0, b, 0], [a, b, 0], [a, b, c], [0, b, c]], `vorne und hinten: je ${a} · ${c} = <b>${a * c} cm²</b>`, a * c],
              [[[a, 0, 0], [a, b, 0], [a, b, c], [a, 0, c]], `rechts und links: je ${b} · ${c} = <b>${b * c} cm²</b>`, b * c],
            ];
            api.say('Ein Quader hat <b>6 Flächen</b>. Je zwei gegenüberliegende sind gleich groß.');
            await api.wait(2400);
            const hl = [];
            for (const [pts, txt] of faces) {
              const f = poly(pts, 'zoom', api.svg); f.setAttribute('opacity', 0); hl.push(f);
              await api.tw(400, (t) => f.setAttribute('opacity', t));
              api.say(txt); await api.wait(2200);
              f.setAttribute('opacity', 0.25);
            }
            const sum = a * b + a * c + b * c;
            api.say(`A<sub>O</sub> = 2 · (${a * b} + ${a * c} + ${b * c}) = 2 · ${sum} = <b>${2 * sum} cm²</b><br><small>Jede Fläche gibt es zweimal, darum „2 ·“.</small>`);
            return;
          }
          api.say(`Ein Quader: ${a} cm lang, ${b} cm breit, ${c} cm hoch. Jeder Würfel ist <b>1 cm³</b>.`);
          await api.wait(1500);
          await stack(); labels();
          api.say(`<b>V = a · b · c = ${a} · ${b} · ${c} = ${a * b * c} cm³</b><br>Länge mal Breite gibt die Schicht, mal Höhe die Anzahl Schichten.`);
        },
      };
    },
  });

  // =====================================================
  // Gleichungen – die Waage
  // =====================================================
  //   ctx: { mode:'gl', op:'+'|'−'|'·'|':', a, c (rechte Seite), ans }, dazu pre/post
  //   Ohne Aufgabe: Waage (x + a = b). Mit Aufgabe: Pfeilbild mit Umkehraufgabe – das klappt auch mit großen Zahlen.
  const INV = { '+': '−', '−': '+', '·': ':', ':': '·' };
  const calcGl = (u, op, v) => (op === '+' ? u + v : op === '−' ? u - v : op === '·' ? u * v : u / v);
  reg('k5-gleichung', {
    title: 'Gleichungen sind Waagen',
    titleFor: (ctx) => (ctx && ctx.mode === 'gl' ? 'Gleichungen: rückwärts rechnen' : 'Gleichungen sind Waagen'),
    viewBox: '0 0 360 230',
    create(api, ctx) {
      ctx = ctx || {};
      if (ctx.mode === 'gl') return pfeilbild(api, ctx);
      return waage(api);
    },
  });
  function pfeilbild(api, ctx) {
    const isTask = !!ctx.post;
    let op = ctx.op, a = ctx.a, ans = ctx.ans;
    if (ctx.pre) { // gleiche Rechenart, andere Zahlen
      do {
        if (op === '+') { ans = R(5, 95); a = R(5, 95); }
        else if (op === '−') { ans = R(20, 150); a = R(5, ans - 1); }
        else if (op === '·') { ans = R(2, 15); a = R(2, 12); }
        else { a = R(2, 9); ans = a * R(2, 12); }
      } while (ans === ctx.ans);
    }
    const c = calcGl(ans, op, a);
    const eq = op === '·' ? `${a} · x = ${c}` : `x ${op} ${a} = ${c}`;
    const L = [80, 110], Rr = [280, 110];
    let boxL, valL;
    function arrow(top, cls, label) {
      const y = top ? 84 : 136, cy = top ? 30 : 190;
      const path = el('path', { d: `M ${L[0] + 30} ${y} Q 180 ${cy} ${Rr[0] - 30} ${y}`, class: cls }, api.svg);
      if (!top) path.setAttribute('d', `M ${Rr[0] - 30} ${y} Q 180 ${cy} ${L[0] + 30} ${y}`);
      const len = path.getTotalLength ? path.getTotalLength() : 300;
      path.style.strokeDasharray = len; path.style.strokeDashoffset = len;
      const end = top ? [Rr[0] - 30, y] : [L[0] + 30, y];
      const head = el('path', { d: top ? `M ${end[0]} ${end[1]} l -12 -2 l 6 -9 z` : `M ${end[0]} ${end[1]} l 12 2 l -6 9 z`, class: top ? 'arrowhead1' : 'arrowhead2', opacity: 0 }, api.svg);
      const lab = el('text', { x: 180, y: top ? 50 : 182, class: 'ex-b ' + (top ? 'f1' : 'f2'), 'text-anchor': 'middle', text: label, opacity: 0 }, api.svg);
      return { path, len, head, lab };
    }
    async function draw(ar) {
      await api.tw(900, (t) => (ar.path.style.strokeDashoffset = ar.len * (1 - t)));
      ar.head.setAttribute('opacity', 1); ar.lab.setAttribute('opacity', 1);
    }
    return {
      reset() {
        api.clear(); subFor(api, ctx, 'gl', isTask);
        boxL = el('rect', { x: L[0] - 30, y: L[1] - 26, width: 60, height: 52, rx: 12, class: 'xbox' }, api.svg);
        valL = el('text', { x: L[0], y: L[1] + 9, class: 'ex-b', 'text-anchor': 'middle', fill: '#fff', style: 'font-size:24px', text: 'x' }, api.svg);
        el('rect', { x: Rr[0] - 34, y: Rr[1] - 26, width: 68, height: 52, rx: 12, class: 'bag' }, api.svg);
        el('text', { x: Rr[0], y: Rr[1] + 9, class: 'ex-b', 'text-anchor': 'middle', style: 'font-size:24px', text: fmt(c) }, api.svg);
      },
      async play() {
        api.say(`<b>${eq}</b><br>Gesucht ist die Zahl x.`);
        await api.wait(1800);
        const opTxt = op === '·' ? `· ${a}` : `${op} ${a}`;
        api.say(`Die Gleichung als Pfeilbild: Mit x wird <b>${opTxt}</b> gerechnet, heraus kommt <b>${fmt(c)}</b>.${op === '·' ? `<br><small>${a} · x ist dasselbe wie x · ${a}.</small>` : ''}`);
        await draw(arrow(true, 'jump', opTxt));
        await api.wait(2000);
        const back = `${INV[op]} ${a}`;
        api.say(`Rückwärts rechnen mit der <b>Umkehraufgabe</b>: Aus ${op === '+' ? 'Plus wird Minus' : op === '−' ? 'Minus wird Plus' : op === '·' ? 'Mal wird Geteilt' : 'Geteilt wird Mal'}.`);
        await draw(arrow(false, 'jump2', back));
        await api.wait(1600);
        api.say(`x = ${fmt(c)} ${INV[op]} ${a} = <b>${fmt(ans)}</b>`);
        valL.textContent = fmt(ans);
        await api.tw(500, (t) => boxL.setAttribute('opacity', 0.6 + 0.4 * t));
        await api.wait(1800);
        api.say(`x = <b>${fmt(ans)}</b><br>Probe: ${op === '·' ? `${a} · ${fmt(ans)}` : `${fmt(ans)} ${op} ${a}`} = ${fmt(c)} ✓`);
      },
    };
  }
  function waage(api) {
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
  }

  // =====================================================
  // Fahrplan – Zeitstrahl mit Sprüngen
  // =====================================================
  //   ctx: { mode:'fahr', start (min), dur, ask:'an'|'dauer' }, dazu pre/post
  reg('k5-fahrplan', {
    title: 'Zeitspannen mit Sprüngen',
    viewBox: '0 0 360 170',
    create(api, ctx) {
      ctx = ctx || {};
      const isTask = ctx.mode === 'fahr' && ctx.post;
      const ask = ctx.mode === 'fahr' ? ctx.ask : 'an';
      let t0, dur;
      const pickN = () => { t0 = R(6, 19) * 60 + R(31, 55); dur = R(20, 60); };
      if (isTask) { t0 = ctx.start; dur = ctx.dur; }
      else if (ctx.mode === 'fahr' && ctx.pre) { do { t0 = R(6 * 60, 20 * 60 + 30); dur = R(12, 95); } while (t0 === ctx.start); }
      else pickN();
      const hm = (t) => `${String(Math.floor(t / 60) % 24).padStart(2, '0')}:${String(t % 60).padStart(2, '0')}`;
      if (ctx.mode !== 'fahr') api.chips([{ label: 'Neue Fahrt', onClick() { pickN(); api.replay(); } }]);
      return {
        reset() { api.clear(); subFor(api, ctx, 'fahr', isTask); },
        async play() {
          const end = t0 + dur;
          // Sprünge: bis zur vollen Stunde, ganze Stunden, Rest
          const pts = [t0];
          let cur = t0;
          const full = Math.floor(t0 / 60) * 60 + 60;
          if (full < end) { pts.push(full); cur = full; while (cur + 60 <= end) { cur += 60; pts.push(cur); } }
          if (cur < end) pts.push(end);
          const k = 290 / dur, X = (t) => 35 + (t - t0) * k, y = 110;
          el('line', { x1: 25, y1: y, x2: 340, y2: y, class: 'ray' }, api.svg);
          for (let t = Math.ceil(t0 / 5) * 5; t <= end; t += 5) el('line', { x1: X(t), y1: y - (t % 60 ? 4 : 10), x2: X(t), y2: y + (t % 60 ? 4 : 10), class: 'tk' }, api.svg);
          const lab = (t, c) => el('text', { x: X(t), y: y + 30, class: 'ex-s ' + (c || ''), 'text-anchor': 'middle', text: hm(t) }, api.svg);
          lab(t0, 'f2');
          if (ask === 'dauer') lab(end, 'f3');
          api.say(ask === 'dauer' ? `Abfahrt <b>${hm(t0)} Uhr</b>, Ankunft <b>${hm(end)} Uhr</b>. Wie lange dauert die Fahrt?` : `Abfahrt um <b>${hm(t0)} Uhr</b>, Fahrzeit <b>${dur} min</b>. Wann ist die Ankunft?`);
          await api.wait(1800);
          const jump = async (a, b2, txt) => {
            const p = el('path', { d: `M ${X(a)} ${y} Q ${(X(a) + X(b2)) / 2} ${y - 70} ${X(b2)} ${y}`, class: 'jump' }, api.svg);
            const L = p.getTotalLength ? p.getTotalLength() : 100;
            p.style.strokeDasharray = L; p.style.strokeDashoffset = L;
            await api.tw(900, (t) => (p.style.strokeDashoffset = L * (1 - t)));
            el('text', { x: (X(a) + X(b2)) / 2, y: y - 42, class: 'ex-b f1', 'text-anchor': 'middle', text: txt }, api.svg);
          };
          const parts = [];
          // Der Merksatz passt nur, wenn die Fahrt über eine volle Stunde hinausgeht
          const trick = pts.length > 2 ? '<br>Trick: Immer erst bis zur vollen Stunde springen!' : '<br><small>Geht die Fahrt über eine volle Stunde hinaus, springt man erst bis dorthin.</small>';
          for (let i = 1; i < pts.length; i++) {
            const a = pts[i - 1], b2 = pts[i], d = b2 - a;
            parts.push(d);
            if (i === 1 && b2 === full && full < end) api.say(`Erst bis zur vollen Stunde: ${hm(a)} → ${hm(b2)} sind <b>${d} min</b>.`);
            else if (d === 60) api.say(`Eine ganze Stunde: ${hm(a)} → ${hm(b2)} sind <b>60 min</b>.`);
            else if (pts.length === 2 && end === full) api.say(`Genau bis zur vollen Stunde: ${hm(a)} → ${hm(b2)} sind <b>${d} min</b>.`);
            else if (pts.length === 2) api.say(`Die volle Stunde wird nicht erreicht: ${hm(a)} → ${hm(b2)} sind <b>${d} min</b>.`);
            else api.say(ask === 'dauer' ? `Dann bis zur Ankunft: ${hm(a)} → ${hm(b2)} sind <b>${d} min</b>.` : `Bleiben noch ${dur} − ${parts.slice(0, -1).reduce((p, q) => p + q, 0)} = <b>${d} min</b>.`);
            await jump(a, b2, `+${d}`);
            if (b2 !== end || ask !== 'dauer') lab(b2, b2 === end ? 'f3' : '');
            await api.wait(1700);
          }
          api.say(ask === 'dauer'
            ? `Fahrzeit: ${parts.length > 1 ? `${parts.join(' + ')} = ` : ''}<b>${dur} min</b>${dur >= 60 ? ` (= ${Math.floor(dur / 60)} h ${dur % 60} min)` : ''}${trick}`
            : `Ankunft: <b>${hm(end)} Uhr</b>${trick}`);
        },
      };
    },
  });

  // =====================================================
  // Einheiten – Zoom ins Lineal
  // =====================================================
  //   ctx: { mode:'einh', lad:[[Einheit, Faktor] … klein→groß], i (kleine Einheit), toSmall, from, to }, dazu pre/post
  //   Ohne Aufgabe: Zoom ins Maßband und Chips für die Einheiten-Treppen.
  const TREPPEN = {
    'Länge': [['mm', 1], ['cm', 10], ['dm', 100], ['m', 1000], ['km', 1e6]],
    'Masse': [['g', 1], ['kg', 1000], ['t', 1e6]],
    'Zeit': [['s', 1], ['min', 60], ['h', 3600]],
    'Fläche': [['mm²', 1], ['cm²', 100], ['dm²', 1e4], ['m²', 1e6]],
    'Volumen': [['cm³', 1], ['dm³', 1000], ['m³', 1e6]],
    'Hohlmaß': [['ml', 1], ['l', 1000]],
  };
  reg('k5-einheit', {
    title: 'Zoom ins Maßband',
    titleFor: (ctx) => (ctx && ctx.mode === 'einh' ? 'Die Einheiten-Treppe' : 'Zoom ins Maßband'),
    viewBox: '0 0 360 170',
    create(api, ctx) {
      ctx = ctx || {};
      const isTask = ctx.mode === 'einh' && ctx.post;
      let lad = null, conv = null, show = 'zoom';
      if (ctx.mode === 'einh') {
        lad = ctx.lad; show = 'treppe';
        if (isTask) conv = ctx;
        else { // ähnliches Beispiel: gleiche Treppe, andere Zahl
          const i = R(0, lad.length - 2), ratio = lad[i + 1][1] / lad[i][1];
          const B = ratio === 60 ? R(2, 12) : Math.random() < 0.55 ? R(2, 99) : R(12, 999) / 10, S = round6(B * ratio);
          const toSmall = Math.random() < 0.55;
          conv = { i, toSmall, from: toSmall ? B : S, to: toSmall ? S : B };
        }
      }
      // Treppe: große Einheit oben links, kleine unten rechts
      function treppe(L) {
        api.clear(); subFor(api, ctx, 'einh', isTask);
        const units = L.slice().reverse(), n = units.length, w = Math.min(80, 300 / n), h = Math.min(30, 100 / n);
        const pos = units.map((u, k) => [30 + k * w, 22 + k * h]);
        units.forEach((u, k) => {
          const [x, y] = pos[k];
          el('rect', { x, y, width: w - 4, height: 26, rx: 6, class: 'bag' }, api.svg);
          el('text', { x: x + (w - 4) / 2, y: y + 18, class: 'ex-b', 'text-anchor': 'middle', style: 'font-size:15px', text: u[0] }, api.svg);
          if (k < n - 1) {
            const f = units[k][1] / units[k + 1][1];
            el('text', { x: x + w + 2, y: y + h - 2, class: 'ex-s f1', 'text-anchor': 'start', style: 'font-size:11px', text: `↘ · ${fmt(f)}` }, api.svg);
          }
        });
        el('text', { x: 30, y: 22 + n * h + 40, class: 'ex-s f6', 'text-anchor': 'start', style: 'font-size:11px', text: 'runter (kleinere Einheit): mal · rauf (größere Einheit): geteilt' }, api.svg);
        return { units, pos, w };
      }
      if (!ctx.mode) api.chips(Object.keys(TREPPEN).map((k) => ({ label: k, onClick() { api.stop(); lad = TREPPEN[k]; show = 'treppe'; conv = null; treppe(lad); api.say(`Die Treppe für <b>${k}</b>: Von einer Stufe zur nächsten ${k === 'Zeit' ? 'ist der Faktor 60' : k === 'Länge' ? 'ist der Faktor 10, nur zwischen m und km 1000' : k === 'Fläche' ? 'ist der Faktor 100' : 'ist der Faktor 1000'}.`); } })));
      const steps = [['1 m', 'dm'], ['1 dm', 'cm'], ['1 cm', 'mm']];
      function bar(big, small) {
        const g = el('g', {}, api.svg);
        el('rect', { x: 30, y: 50, width: 300, height: 34, rx: 4, class: 'rul' }, g);
        for (let i = 0; i <= 10; i++) el('line', { x1: 30 + i * 30, y1: 50, x2: 30 + i * 30, y2: i % 5 ? 64 : 72, class: 'tk' }, g);
        for (let i = 0; i < 10; i++) el('text', { x: 45 + i * 30, y: 100, class: 'ex-xs', 'text-anchor': 'middle', text: `1 ${small}` }, g);
        el('text', { x: 180, y: 36, class: 'ex-b', 'text-anchor': 'middle', text: `${big} = 10 ${small}` }, g);
        return g;
      }
      return {
        reset() { if (show === 'treppe' && lad) treppe(lad); else { api.clear(); api.sub(''); } },
        async play() {
          if (show === 'treppe' && conv) {
            const { units, pos, w } = treppe(lad);
            const big = lad[conv.i + 1], small = lad[conv.i], ratio = big[1] / small[1];
            const kBig = units.indexOf(big), kSmall = units.indexOf(small);
            const [fromK, toK] = conv.toSmall ? [kBig, kSmall] : [kSmall, kBig];
            const fromU = units[fromK][0], toU = units[toK][0];
            api.say(`Rechne um: <b>${fmt(conv.from)} ${fromU}</b> in <b>${toU}</b>.`);
            const ball = el('circle', { cx: pos[fromK][0] + (w - 4) / 2, cy: pos[fromK][1] - 8, r: 7, class: 'mk' }, api.svg);
            await api.wait(1800);
            api.say(conv.toSmall
              ? `Von ${fromU} nach ${toU} geht es eine Stufe <b>runter</b>: 1 ${big[0]} = ${fmt(ratio)} ${small[0]}. Also <b>mal ${fmt(ratio)}</b>.`
              : `Von ${fromU} nach ${toU} geht es eine Stufe <b>rauf</b>: 1 ${big[0]} = ${fmt(ratio)} ${small[0]}. Also <b>geteilt durch ${fmt(ratio)}</b>.`);
            const [x0, y0] = [pos[fromK][0] + (w - 4) / 2, pos[fromK][1] - 8], [x1, y1] = [pos[toK][0] + (w - 4) / 2, pos[toK][1] - 8];
            await api.tw(1100, (t) => { ball.setAttribute('cx', lerp(x0, x1, t)); ball.setAttribute('cy', lerp(y0, y1, t) - Math.sin(t * Math.PI) * 24); });
            await api.wait(1600);
            api.say(`${fmt(conv.from)} ${conv.toSmall ? '·' : ':'} ${fmt(ratio)} = <b>${fmt(conv.to)}</b><br><b>${fmt(conv.from)} ${fromU} = ${fmt(conv.to)} ${toU}</b>${ratio === 60 ? '<br><small>Achtung: Bei der Zeit ist der Faktor 60, nicht 10 oder 100!</small>' : ratio === 10 || ratio === 100 || ratio === 1000 ? `<br><small>${conv.toSmall ? 'Mal' : 'Geteilt durch'} ${fmt(ratio)}: Die Ziffern rücken ${String(ratio).length - 1} Stelle${ratio > 10 ? 'n' : ''} nach ${conv.toSmall ? 'links' : 'rechts'}.</small>` : ''}`);
            return;
          }
          if (show === 'treppe') { treppe(lad); return; }
          for (let st = 0; st < 3; st++) {
            api.clear();
            const gg = bar(...steps[st]);
            await api.tw(500, (t) => gg.setAttribute('opacity', t));
            api.say(`<b>${steps[st][0]} = 10 ${steps[st][1]}</b>`);
            await api.wait(1700);
            if (st < 2) {
              api.say(`Wir zoomen in <b>1 ${steps[st][1]}</b> hinein …`);
              const hl = el('rect', { x: 60, y: 46, width: 30, height: 42, rx: 4, class: 'zoom' }, api.svg);
              await api.wait(500);
              await api.tw(1100, (t) => { hl.setAttribute('x', lerp(60, 30, t)); hl.setAttribute('width', lerp(30, 300, t)); gg.setAttribute('opacity', 1 - t); });
            }
          }
          api.say('<b>1 m = 10 dm = 100 cm = 1000 mm</b><br>Zwischen m, dm, cm und mm ist jede Stufe <b>10-mal</b> so klein. Aber: <b>1 km = 1000 m</b>.<br><small>Tippe unten auf eine Größe, um ihre Einheiten-Treppe zu sehen.</small>');
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
        if (n.op === '^') return '<b>Potenz zuerst</b>';
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
          else if (mode === 'task') api.say(`Ergebnis: <b>${total}</b>. <small>Reihenfolge: Klammer, Potenz, Punkt, Strich. Sonst von links nach rechts.</small>`);
          else api.say(`Ergebnis: <b>${total}</b>. <small>Klammer zuerst, dann Punkt vor Strich, zum Schluss das Minus.</small>`);
        },
      };
    },
  });

  // =====================================================
  // Rechengesetze – Punkte drehen, Streifen umklammern, Rechteck teilen
  //   ctx: { mode:'ges', law:'kom'|'ass'|'dis', op, nums:[…] }        Gesetz an den Zahlen der Aufgabe
  //        { mode:'ges', law:'dis', f, x, y, minus, back }           back: ausklammern (rückwärts)
  //        { mode:'pruef', left, right, lv, rv, ok, rule }           „Stimmt das?“ – beide Seiten ausrechnen
  //        { mode:'tausch', tokens, order, pair, steps }             Vorteilhaft rechnen: umstellen und bündeln
  // =====================================================
  reg(['k5-gesetze', 'k5-vorteil'], {
    title: 'Drei Rechengesetze zum Anschauen',
    titleFor: (ctx) => (!ctx || !ctx.mode ? 'Drei Rechengesetze zum Anschauen' : ctx.mode === 'pruef' ? 'Nachrechnen: Stimmt das?' : ctx.mode === 'tausch' ? 'Geschickt rechnen' : { kom: 'Kommutativgesetz', ass: 'Assoziativgesetz', dis: 'Distributivgesetz' }[ctx.law] || 'Rechengesetze'),
    viewBox: '0 0 360 250',
    create(api, ctx) {
      ctx = ctx || {};
      // Beispiel vorher: Bei „Stimmt das?“ und „Geschickt rechnen“ bringt die Aufgabe ein ähnliches Beispiel mit (alt)
      if (ctx.pre && ctx.alt) ctx = Object.assign({}, ctx.alt, { pre: true });
      const isTask = !!ctx.post;
      const task = ctx.mode === 'ges' || ctx.mode === 'pruef' || ctx.mode === 'tausch';
      let mode = ctx.mode === 'ges' ? ctx.law : task ? ctx.mode : 'alle';
      const sub = () => (task ? api.sub(isTask ? 'Lösung zu deiner Aufgabe' : 'Ein ähnliches Beispiel – deine Aufgabe löst du danach selbst') : api.sub(''));
      // Beispiel vorher: gleiche Aufgabenart, kleine andere Zahlen
      const N = (i, lo, hi) => (task && isTask && ctx.nums ? ctx.nums[i] : R(lo, hi));
      const T = (x, y, text, cls, parent) => el('text', { x, y, class: cls || 'ex-b', 'text-anchor': 'middle', text }, parent || api.svg);
      const head = (t) => el('text', { x: 180, y: 26, class: 'ex-s f6', 'text-anchor': 'middle', text: t }, api.svg);

      async function kommutativ() {
        api.clear(); sub();
        const op = ctx.law === 'kom' && ctx.op ? ctx.op : '·';
        head('KOMMUTATIVGESETZ (Vertauschungsgesetz)');
        if (op === '+') {
          const a = N(0, 3, 9), b = N(1, 3, 9), u = Math.min(26, 280 / (a + b)), x0 = 180 - ((a + b) * u) / 2, y = 96;
          const gA = el('g', {}, api.svg), gB = el('g', {}, api.svg);
          el('rect', { x: x0, y, width: a * u, height: 36, rx: 4, class: 'blk' }, gA); T(x0 + (a * u) / 2, y + 24, a, 'ex-b wtxt', gA);
          el('rect', { x: x0 + a * u, y, width: b * u, height: 36, rx: 4, class: 'blk mv' }, gB); T(x0 + a * u + (b * u) / 2, y + 24, b, 'ex-b wtxt', gB);
          const lab = T(180, 200, `${a} + ${b} = ${a + b}`, 'vexpr');
          api.say(`Ein Streifen aus <b>${a}</b> und <b>${b}</b>: zusammen ${a + b} lang.`);
          await api.wait(2000);
          api.say('Jetzt tauschen die beiden Teile die Plätze …');
          await api.tw(1200, (t) => { gA.setAttribute('transform', `translate(${b * u * t},${-30 * Math.sin(t * Math.PI)})`); gB.setAttribute('transform', `translate(${-a * u * t},${30 * Math.sin(t * Math.PI)})`); });
          lab.textContent = `${b} + ${a} = ${a + b}`;
          api.say(`Der Streifen ist gleich lang geblieben: <b>${a} + ${b} = ${b} + ${a}</b><br><small>Beim Plus (und beim Mal) darf man die Zahlen vertauschen.</small>`);
          await api.wait(3200);
          return;
        }
        const r = N(0, 2, 4), c = N(1, r + 1, 6), cx = 180, cy = 112;
        const s = Math.min(24, 150 / Math.max(r, c)), dots = r * c <= 150;
        const g = el('g', { opacity: 0 }, api.svg);
        if (dots) for (let i = 0; i < r; i++) for (let j = 0; j < c; j++) el('circle', { cx: cx + (j - (c - 1) / 2) * s, cy: cy + (i - (r - 1) / 2) * s, r: Math.min(8, s / 2 - 2), class: 'dotO' }, g);
        else el('rect', { x: cx - (c * s) / 2, y: cy - (r * s) / 2, width: c * s, height: r * s, class: 'blk' }, g);
        const lab = T(180, 232, '', 'vexpr');
        api.say(`<b>${r}</b> Reihen mit je <b>${c}</b> ${dots ? 'Punkten' : 'Kästchen'}.`);
        await api.tw(600, (t) => g.setAttribute('opacity', t));
        lab.textContent = `${r} · ${c} = ${r * c}`;
        await api.wait(1800);
        api.say('Jetzt drehen wir das Bild um eine Vierteldrehung …');
        await api.tw(1400, (t) => g.setAttribute('transform', `rotate(${90 * t} ${cx} ${cy})`));
        lab.textContent = `${c} · ${r} = ${r * c}`;
        api.say(`… jetzt sind es <b>${c}</b> Reihen mit je <b>${r}</b>. Aber es ist <b>dasselbe</b> Bild! <small>Beim Mal (und beim Plus) darf man die Zahlen vertauschen.</small>`);
        await api.wait(3200);
      }
      async function assoziativ() {
        api.clear(); sub();
        const op = ctx.law === 'ass' && ctx.op ? ctx.op : '+';
        head('ASSOZIATIVGESETZ (Verbindungsgesetz)');
        const a = N(0, 2, 5), b = N(1, 2, 6), c = N(2, 2, 5);
        if (op === '·') {
          const ex = T(180, 70, `(${a} · ${b}) · ${c}`, 'vexpr'), l1 = T(180, 110, '', 'ex-b'), ex2 = T(180, 160, '', 'vexpr'), l2 = T(180, 200, '', 'ex-b');
          api.say(`Links zuerst die Klammer: ${a} · ${b} = ${a * b}.`);
          l1.textContent = `= ${a * b} · ${c} = ${a * b * c}`;
          await api.wait(2400);
          ex2.textContent = `${a} · (${b} · ${c})`;
          api.say(`Jetzt die Klammer verschoben: ${b} · ${c} = ${b * c}.`);
          l2.textContent = `= ${a} · ${b * c} = ${a * b * c}`;
          await api.wait(2400);
          api.say(`Beide Male <b>${a * b * c}</b>. <small>Bei Plus und Mal darf man die Klammer verschieben.</small>`);
          await api.wait(3000);
          return;
        }
        const u = Math.min(26, 280 / (a + b + c));
        const x0 = 180 - ((a + b + c) * u) / 2, y = 92, h = 34;
        const ex = T(180, 66, `(${a} + ${b}) + ${c}`, 'vexpr');
        const xs = [x0, x0 + a * u, x0 + (a + b) * u, x0 + (a + b + c) * u];
        [a, b, c].forEach((v, i) => {
          el('rect', { x: xs[i], y, width: v * u, height: h, rx: 4, class: ['blk', 'blk mv', 'blk g3'][i] }, api.svg);
          if (v * u > 14) T((xs[i] + xs[i + 1]) / 2, y + 23, v, 'ex-b wtxt');
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
        api.clear(); sub();
        let f, x, y, minus = false, back = false;
        if (ctx.law === 'dis' && isTask) ({ f, x, y } = ctx), (minus = !!ctx.minus), (back = !!ctx.back);
        else if (ctx.law === 'dis') { // ähnliches Beispiel, bei dem der Rechenvorteil genauso sichtbar wird wie in der Aufgabe
          minus = !!ctx.minus; back = !!ctx.back; f = R(3, 6);
          if (back) { do x = R(11, 89); while (x === ctx.x); y = 100 - x; } // Ausklammern lohnt sich: in der Klammer entsteht 100
          else if (ctx.x === 100) { x = 100; y = pick([1, 2]); do f = R(3, 19); while (f === ctx.f); } // nah an 100
          else { x = pick([20, 30]); y = R(2, 6); }
        }
        else { f = R(3, 6); x = pick([10, 20]); y = R(2, 6); }
        const o = minus ? '−' : '+';
        const W = minus ? x : x + y, u = Math.min(14, 250 / W), h = Math.max(24, Math.min(110, f * u * (W > 40 ? 3 : 1)));
        const w1 = (minus ? x - y : x) * u, w2 = y * u, x0 = 180 - (W * u + (minus ? 0 : 20)) / 2, y0 = 100;
        head('DISTRIBUTIVGESETZ (Verteilungsgesetz)');
        const sumTxt = `${f} · (${x} ${o} ${y})`, splitTxt = `${f} · ${x} ${o} ${f} · ${y}`;
        const ex = T(180, 62, back ? splitTxt : sumTxt, 'vexpr');
        el('rect', { x: x0, y: y0, width: w1, height: h, class: 'blk' }, api.svg);
        const Rg = el('g', {}, api.svg);
        const Rr = el('rect', { x: x0 + w1, y: y0, width: w2, height: h, class: minus ? 'blk mv' : 'blk' }, Rg);
        T(x0 - 14, y0 + h / 2 + 6, f, 'ex-b');
        T(x0 + (minus ? (w1 + w2) / 2 : w1 / 2), y0 - 8, minus ? x : x, 'ex-s');
        T(x0 + w1 + w2 / 2, y0 + h + 18, y, 'ex-s', Rg);
        const l1 = T(x0 + w1 / 2, y0 + h + 40, '', 'ex-s'), l2 = T(x0 + w1 + 20 + w2 / 2, y0 + h + 40, '', 'ex-s');
        const tot = T(180, 240, '', 'vexpr');
        if (minus) {
          api.say(`Ein Rechteck: <b>${f}</b> hoch und <b>${x}</b> breit. Davon schneiden wir ein Stück der Breite <b>${y}</b> ab.`);
          await api.wait(2600);
          await api.tw(900, (t) => { Rg.setAttribute('transform', `translate(${24 * t},0)`); Rr.setAttribute('opacity', 1 - 0.6 * t); });
          ex.textContent = back ? sumTxt : splitTxt;
          api.say(`Übrig bleibt ${f} · (${x} − ${y}). Das ist das ganze Rechteck ${f} · ${x} <b>minus</b> das Stück ${f} · ${y}.`);
          await api.wait(2600);
          tot.textContent = `${f * x} − ${f * y} = ${f * (x - y)}`;
          api.say(`<b>${f} · (${x} − ${y}) = ${f} · ${x} − ${f} · ${y}</b> = ${f * x} − ${f * y} = <b>${f * (x - y)}</b><br><small>Der Faktor ${f} wird auf beide Zahlen verteilt, auch bei Minus.</small>`);
          await api.wait(3000);
          return;
        }
        if (back) {
          Rg.setAttribute('transform', 'translate(20,0)');
          l1.textContent = `${f} · ${x}`; l2.textContent = `${f} · ${y}`;
          api.say(`Zwei Rechtecke, beide <b>${f}</b> hoch: ${f} · ${x} und ${f} · ${y}.`);
          await api.wait(2400);
          api.say('Gleich hoch? Dann schieben wir sie zu einem Rechteck zusammen …');
          await api.tw(900, (t) => Rg.setAttribute('transform', `translate(${20 * (1 - t)},0)`));
          l1.textContent = ''; l2.textContent = '';
          ex.textContent = sumTxt;
          api.say(`Ein Rechteck: ${f} hoch, ${x} + ${y} = <b>${x + y}</b> breit. Den Faktor ${f} haben wir <b>ausgeklammert</b>.`);
          await api.wait(2400);
          tot.textContent = `${f} · ${x + y} = ${fmt(f * (x + y))}`;
          api.say(`<b>${splitTxt} = ${sumTxt} = ${fmt(f * (x + y))}</b><br><small>Ausklammern lohnt sich, wenn in der Klammer eine glatte Zahl entsteht.</small>`);
          await api.wait(3000);
          return;
        }
        api.say(`Ein Rechteck: <b>${f}</b> hoch und <b>${x} + ${y}</b> breit. Fläche: ${sumTxt}.`);
        await api.wait(2400);
        api.say('Wir schneiden es an der Stelle ' + x + ' durch …');
        Rr.setAttribute('class', 'blk mv');
        await api.tw(900, (t) => Rg.setAttribute('transform', `translate(${20 * t},0)`));
        l1.textContent = `${f} · ${x} = ${f * x}`; l2.textContent = `${f} · ${y} = ${f * y}`;
        ex.textContent = splitTxt;
        api.say(`Zwei Rechtecke: ${f} · ${x} und ${f} · ${y}. Die <b>${f}</b> wird auf beide Teile <b>verteilt</b>.`);
        await api.wait(2200);
        tot.textContent = `${f * x} + ${f * y} = ${f * (x + y)}`;
        api.say(`Zusammen <b>${f * (x + y)}</b>, genauso viel wie ${f} · ${x + y}. <small>So rechnet man z. B. ${f} · ${x + y} im Kopf!</small>`);
        await api.wait(3200);
      }
      // „Stimmt das?“: beide Seiten ausrechnen
      async function pruef() {
        api.clear(); sub();
        let { left, right, lv, rv, ok, rule } = ctx;
        T(180, 40, 'Beide Seiten ausrechnen', 'ex-s f6');
        const L1 = T(95, 90, left, 'ex-b'), R1 = T(265, 90, right, 'ex-b');
        el('line', { x1: 180, y1: 60, x2: 180, y2: 200, class: 'dash' }, api.svg);
        const L2 = T(95, 140, '', 'vexpr'), R2 = T(265, 140, '', 'vexpr'), mid = T(180, 146, '', 'vexpr');
        void L1; void R1;
        api.say(`Stimmt <b>${left} = ${right}</b>? Wir rechnen beide Seiten aus.`);
        await api.wait(2200);
        L2.textContent = `= ${lv}`; api.say(`Links: ${left} = <b>${lv}</b>`); await api.wait(2000);
        const noR = typeof rv !== 'number'; // rechte Seite lässt sich mit natürlichen Zahlen nicht ausrechnen
        if (noR) { R2.setAttribute('class', 'ex-b f1'); R2.textContent = 'geht nicht'; api.say(`Rechts: ${right}? ${ctx.rno || 'Das geht mit natürlichen Zahlen nicht.'}`); await api.wait(3000); }
        else { R2.textContent = `= ${rv}`; api.say(`Rechts: ${right} = <b>${rv}</b>`); await api.wait(2000); }
        mid.textContent = ok ? '=' : '≠';
        api.say(`${ok ? `Beide Seiten ergeben ${lv}: <b>Stimmt!</b>` : noR ? `Links kommt ${lv} heraus, rechts lässt sich gar nicht ausrechnen: <b>Stimmt nicht!</b>` : `${lv} und ${rv} sind verschieden: <b>Stimmt nicht!</b>`}<br><small>${rule}</small>`);
      }
      // Vorteilhaft rechnen: Zahlen umstellen und passende Paare bündeln
      async function tausch() {
        api.clear(); sub();
        const { tokens, order } = ctx, steps = ctx.steps.slice();
        const n = tokens.length, gap = Math.min(52, 300 / n), xs = (i) => 180 + (i - (n - 1) / 2) * gap;
        const els = tokens.map((t, i) => T(xs(i), 100, t, 'vexpr'));
        api.say(`<b>${tokens.join(' ')}</b><br>Gibt es Zahlen, die zusammen eine glatte Zahl ergeben?`);
        await api.wait(2400);
        const moved = order && order.some((src, dst) => src !== dst);
        if (!moved) steps[0] = Object.assign({}, steps[0], { say: `<b>${tokens[0]} ${tokens[1]} ${tokens[2]}</b> stehen schon nebeneinander. Die rechnen wir zuerst.` });
        if (moved) {
          api.say('Bei nur Plus oder nur Mal darf man die Zahlen <b>vertauschen</b>. Wir stellen sie günstig um …');
          const from = tokens.map((_, i) => xs(i));
          await api.tw(1200, (t) => order.forEach((src, dst) => els[src].setAttribute('x', lerp(from[src], xs(dst), t))));
          await api.wait(1200);
        }
        const out = T(180, 170, '', 'vexpr');
        for (const st of steps) { out.textContent = st.line; api.say(st.say); await api.wait(2400); }
      }
      api.chips(task ? [] : [
        { label: 'Alle drei', onClick() { mode = 'alle'; api.replay(); } },
        { label: 'Kommutativ', onClick() { mode = 'kom'; api.replay(); } },
        { label: 'Assoziativ', onClick() { mode = 'ass'; api.replay(); } },
        { label: 'Distributiv', onClick() { mode = 'dis'; api.replay(); } },
      ]);
      return {
        reset() { api.clear(); sub(); },
        async play() {
          if (mode === 'pruef') return pruef();
          if (mode === 'tausch') return tausch();
          if (mode === 'alle' || mode === 'kom') await kommutativ();
          if (mode === 'alle' || mode === 'ass') await assoziativ();
          if (mode === 'alle' || mode === 'dis') await distributiv();
          if (ctx.mode === 'ges') {
            const NAME = { kom: ['Kommutativgesetz', 'Vertauschungsgesetz', 'Zahlen vertauschen'], ass: ['Assoziativgesetz', 'Verbindungsgesetz', 'Klammer verschieben'], dis: ['Distributivgesetz', 'Verteilungsgesetz', 'einen Faktor auf eine Summe verteilen (oder ausklammern)'] }[ctx.law];
            api.say(`→ Das ist das <b>${NAME[0]}</b> (${NAME[1]}): ${NAME[2]}.`);
          }
          if (mode === 'alle') api.say('<b>Kommutativ</b>: vertauschen · <b>Assoziativ</b>: Klammer verschieben · <b>Distributiv</b>: verteilen. <small>Die ersten beiden gelten nur für Plus und Mal!</small>');
        },
      };
    },
  });

  // =====================================================
  // Kacheln, deren Aufgaben die Erklärungen anderer Themen nutzen: eigene Erklärung für den ▶-Knopf
  // =====================================================
  reg('k5-vergleich', {
    title: 'Zahlen ordnen in der Stellenwerttafel',
    viewBox: '0 0 360 150',
    create: (api, ctx) => EX['k5-dezimal'].create(api, Object.assign({}, ctx, { mode: 'ord' })),
  });
  reg('k5-sach', {
    title: 'Wechselgeld: ergänzen bis zum Schein',
    viewBox: '0 0 360 150',
    create: (api, ctx) => EX['k5-dezimal'].create(api, Object.assign({}, ctx, { mode: 'wechsel' })),
  });
  reg('k5-text', {
    title: 'Textaufgaben: in vier Schritten',
    viewBox: '0 0 360 200',
    create(api) {
      let d, n, g = [];
      const pickN = () => { d = R(3, 9); n = R(150, 900); };
      pickN();
      api.chips([{ label: 'Neues Beispiel', onClick() { pickN(); api.replay(); } }]);
      const rows = ['Was ist gesucht?', 'Was ist gegeben?', 'Rechnung aufschreiben', 'Rechnen, antworten'];
      return {
        reset() {
          api.clear(); api.sub('');
          g = rows.map((t, i) => {
            const grp = el('g', { opacity: 0.3 }, api.svg), y = 12 + i * 46;
            el('rect', { x: 20, y, width: 320, height: 38, rx: 10, class: 'bag' }, grp);
            el('text', { x: 40, y: y + 25, class: 'ex-b f2', 'text-anchor': 'middle', text: i + 1 }, grp);
            el('text', { x: 58, y: y + 25, class: 'ex-s', style: 'font-weight:800', text: t }, grp);
            grp.out = el('text', { x: 330, y: y + 25, class: 'ex-s f1', 'text-anchor': 'end', style: 'font-weight:800', text: '' }, grp);
            return grp;
          });
        },
        async play() {
          const q = Math.floor(n / d), r = n % d;
          api.say(`Beispiel: <b>${fmt(n)} Fotos</b> kommen in ein Album. Auf jede Seite passen <b>${d}</b>. Wie viele Seiten werden voll, und wie viele Fotos bleiben übrig?`);
          await api.wait(4600);
          const step = async (i, out, txt, ms) => { await api.tw(300, (t) => g[i].setAttribute('opacity', 0.3 + 0.7 * t)); g[i].out.textContent = out; api.say(txt); if (ms) await api.wait(ms); };
          await step(0, 'volle Seiten, Rest', '<b>1. Was ist gesucht?</b> Lies die Frage genau: die Anzahl der vollen Seiten und die Fotos, die übrig bleiben.', 3800);
          await step(1, `${fmt(n)} und ${d}`, `<b>2. Was ist gegeben?</b> ${fmt(n)} Fotos, immer ${d} auf eine Seite. „Immer ${d}“ heißt: gleich große Gruppen bilden, also <b>teilen</b>.`, 4200);
          await step(2, `${fmt(n)} : ${d}`, `<b>3. Rechnung aufschreiben:</b> ${fmt(n)} : ${d}<br><small>Signalwörter helfen: „je“, „verteilen“ → teilen · „zusammen“, „insgesamt“ → plus oder mal · „übrig“, „zurück“ → minus oder Rest.</small>`, 5600);
          await step(3, `${fmt(q)} Rest ${r}`, `<b>4. Rechnen und antworten:</b> ${fmt(n)} : ${d} = ${fmt(q)} Rest ${r}.<br>Antwort: <b>${fmt(q)} Seiten</b> werden voll, <b>${r === 1 ? '1 Foto bleibt' : r + ' Fotos bleiben'}</b> übrig.<br><small>Zum Schluss prüfen: Passt die Antwort zur Frage? Probe: ${fmt(q)} · ${d} + ${r} = ${fmt(n)} ✓</small>`, 0);
        },
      };
    },
  });
})();
