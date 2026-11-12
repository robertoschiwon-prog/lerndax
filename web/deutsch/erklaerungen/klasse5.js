/* DeDax (Deutsch) – Erklär-Animationen Klasse 5
 *
 * Aufbau wie in MaDax: { title, titleFor?(ctx), viewBox, create(api, ctx) → { reset(), play() } }
 *   ctx: das ex-Objekt der Aufgabe plus pre:true (ähnliches Beispiel) oder post:true (genau die Aufgabe);
 *        leer, wenn die Erklärung ohne Aufgabe geöffnet wird.
 */
(function () {
  const D = (window.DeDax = window.DeDax || {});
  const U = D.util, T = D.daten;
  const EX = (D.explainers = D.explainers || {});
  const NS = 'http://www.w3.org/2000/svg';
  const lerp = (a, b, t) => a + (b - a) * t;
  function el(tag, a, parent) {
    const e = document.createElementNS(NS, tag);
    for (const k in a || {}) { if (k === 'text') e.textContent = a[k]; else e.setAttribute(k, a[k]); }
    if (parent) parent.appendChild(e);
    return e;
  }
  D.exUtil = { el };

  // =====================================================
  // Zeitformen am Zeitstrahl
  // =====================================================
  //   ctx: { mode:'zeit'|'bilden'|'grundform'|'hilf', zeit, subj, v1, rest, v2, inf, aux }, dazu pre/post
  const POS = { plusquamperfekt: 55, praeteritum: 152, perfekt: 152, praesens: 240, futur: 312 };
  const LY = { plusquamperfekt: 150, praeteritum: 150, perfekt: 136, praesens: 150, futur: 150 };
  const WANN = { 55: 'noch früher', 152: 'früher', 240: 'jetzt', 312: 'später' };
  const SINN = {
    praesens: 'Es passiert <b>jetzt</b> (oder immer wieder).',
    praeteritum: 'Es ist <b>vorbei</b>. So schreibt und erzählt man Geschichten.',
    perfekt: 'Es ist <b>vorbei</b>. So erzählt man meistens beim Sprechen.',
    plusquamperfekt: 'Es war <b>schon vorher</b> passiert, noch vor etwas anderem in der Vergangenheit.',
    futur: 'Es kommt <b>erst noch</b>.',
  };
  const BLAU = '#1f55d6', LINE = 175;

  EX['d5-zeitformen'] = {
    title: 'Zeitformen am Zeitstrahl',
    titleFor: (ctx) => (ctx && ctx.zeit ? `${T.ZNAME[ctx.zeit]}: so erkennst du es` : 'Zeitformen am Zeitstrahl'),
    viewBox: '0 0 360 210',
    create(api, ctx) {
      ctx = ctx || {};
      const task = !!ctx.zeit;
      let verb, subj, saetze, satzEl, klammer, punkt, marken = {};
      const neu = () => { verb = U.pick(T.V); subj = U.pick(T.SUBJ.filter((s) => [0, 2, 3, 5].includes(s.p))); };
      if (!task) { neu(); api.chips([{ label: 'Anderes Verb', onClick() { neu(); api.replay(); } }]); }
      let S0 = null; // der Satz im Aufgaben-Modus
      if (task && ctx.post) S0 = ctx;
      if (task && ctx.pre) { // ähnliches Beispiel: gleiche Zeitform, anderes Verb
        const v = U.pick(T.V.filter((x) => x.inf !== ctx.inf)), su = T.subjFuer(ctx.zeit);
        S0 = T.satz(v, su, ctx.zeit);
      }

      function zeigeSatz(s, farbig) {
        if (satzEl) satzEl.remove();
        if (klammer) { klammer.remove(); klammer = null; }
        satzEl = el('text', { x: 180, y: 46, 'text-anchor': 'middle', class: 'ex-b' }, api.svg);
        const teil = (t, verbteil) => { const ts = el('tspan', { text: t }, satzEl); if (verbteil && farbig) ts.setAttribute('fill', BLAU); return ts; };
        teil(s.subj + ' '); teil(s.v1, true); teil(' ' + s.rest); if (s.v2) { teil(' '); teil(s.v2, true); } teil('.');
        // lange Sätze kleiner schreiben, damit nichts aus dem Bild ragt
        try { for (let fs = 18; fs >= 11 && satzEl.getBBox().width > 336; fs--) satzEl.setAttribute('style', `font-size:${fs}px`); } catch (e) {}
        return satzEl;
      }
      // Satzklammer: Bügel unter dem Satz von einem Verbteil zum anderen
      function zeigeKlammer(s) {
        if (!s.v2) return;
        try {
          const a = (s.subj + ' ').length, b = a + s.v1.length, c = (s.subj + ' ' + s.v1 + ' ' + s.rest + ' ').length, d = c + s.v2.length;
          const x1 = (satzEl.getStartPositionOfChar(a).x + satzEl.getEndPositionOfChar(b - 1).x) / 2;
          const x2 = (satzEl.getStartPositionOfChar(c).x + satzEl.getEndPositionOfChar(d - 1).x) / 2;
          klammer = el('path', { d: `M ${x1} 54 v 9 H ${x2} v -9`, fill: 'none', stroke: BLAU, 'stroke-width': 2.5, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, api.svg);
        } catch (e) {}
      }
      function strahl() {
        el('line', { x1: 14, y1: LINE, x2: 340, y2: LINE, class: 'ray' }, api.svg);
        el('path', { d: `M 334 ${LINE - 6} L 344 ${LINE} L 334 ${LINE + 6}`, fill: 'none', class: 'ray' }, api.svg);
        Object.keys(WANN).forEach((x) => {
          el('line', { x1: x, y1: LINE - 5, x2: x, y2: LINE + 5, class: 'ray' }, api.svg);
          el('text', { x, y: LINE + 22, 'text-anchor': 'middle', class: 'ex-s', text: WANN[x], style: +x === 240 ? 'font-size:15px' : 'fill:#6b6680' }, api.svg);
        });
      }
      async function setze(zeit) {
        const x = POS[zeit];
        if (punkt) punkt.remove();
        punkt = el('circle', { cx: 180, cy: 70, r: 8, fill: 'var(--c1)', stroke: 'var(--ink)', 'stroke-width': 2 }, api.svg);
        await api.tw(700, (t) => { punkt.setAttribute('cx', lerp(180, x, t)); punkt.setAttribute('cy', lerp(70, LINE, t)); });
        if (!marken[zeit]) marken[zeit] = el('text', { x, y: LY[zeit], 'text-anchor': 'middle', class: 'ex-s', text: T.ZNAME[zeit], style: `font-size:12px;fill:${BLAU}` }, api.svg);
      }

      return {
        reset() {
          api.clear(); satzEl = klammer = punkt = null; marken = {};
          api.sub(!task ? '' : ctx.post ? 'Lösung zu deiner Aufgabe' : 'Ein ähnliches Beispiel – deine Aufgabe löst du danach selbst');
          strahl();
          if (task) zeigeSatz(S0, false);
          else { saetze = T.ZEITEN.map((z) => T.satz(verb, subj, z)); zeigeSatz(saetze[0], false); }
        },
        async play() {
          if (task) {
            const s = S0, name = T.ZNAME[s.zeit];
            if (ctx.mode === 'bilden') api.say(`Gesucht: <b>${s.inf}</b> im <b>${name}</b>.`);
            else api.say('Schritt 1: Suche alle <b>Verbteile</b>.');
            await api.wait(1400);
            zeigeSatz(s, true); zeigeKlammer(s);
            api.say(s.v2
              ? `Zwei Verbteile: <b>${s.v1}</b> an 2. Stelle und <b>${s.v2}</b> am Satzende. Sie umklammern den Rest.`
              : `Ein Verbteil: <b>${s.v1}</b>. Er steht an 2. Stelle.`);
            await api.wait(2600);
            api.say(`So ist es gebaut: ${T.bauplan(s)}`);
            await api.wait(2800);
            await setze(s.zeit);
            const extra = ctx.mode === 'grundform' ? `<br>Grundform: <b>${s.inf}</b> (${s.v2 || s.v1} kommt von ${s.inf}).`
              : ctx.mode === 'hilf' ? `<br>„${s.inf}“ bildet das Perfekt mit <b>${s.aux}</b>.` : '';
            api.say(`Das ist das <b>${name}</b>. ${SINN[s.zeit]}<br>${s.subj} <b>${s.v1}</b> ${s.rest}${s.v2 ? ` <b>${s.v2}</b>` : ''}.${extra}`);
            return;
          }
          api.say(`Ein Verb, fünf Zeitformen: <b>${verb.inf}</b>. Der Zeitstrahl zeigt, <b>wann</b> etwas passiert.`);
          await api.wait(2200);
          for (const z of ['praesens', 'praeteritum', 'perfekt', 'plusquamperfekt', 'futur']) {
            const s = saetze[T.ZEITEN.indexOf(z)];
            zeigeSatz(s, true); zeigeKlammer(s);
            api.say(`<b>${T.ZNAME[z]}</b>: ${SINN[z]}<br>${T.bauplan(s)}`);
            await api.wait(500);
            await setze(z);
            await api.wait(2600);
          }
          api.say('Merke: <b>Ein</b> Verbteil → Präsens oder Präteritum. <b>Zwei</b> Verbteile → Perfekt (hat, ist), Plusquamperfekt (hatte, war) oder Futur I (wird).');
        },
      };
    },
  };

  // =====================================================
  // Substantive: Geschlecht und Mehrzahl
  // =====================================================
  //   ctx: { mode:'genus'|'plural', art, sg, pl } oder { mode:'satz', tokens, correct } (Substantive im Satz finden), dazu pre/post
  const GFARBE = { der: '#1f55d6', die: '#c62f4b', das: '#0a7d57' };
  const ORANGE = '#c2410c';
  EX['d5-substantive'] = {
    title: 'Substantive: Geschlecht und Mehrzahl',
    viewBox: '0 0 360 190',
    create(api, ctx) {
      ctx = ctx || {};
      const task = !!(ctx.sg || ctx.mode === 'satz') && (ctx.pre || ctx.post);
      const SZ = ctx.mode === 'satz' && task ? (ctx.post ? ctx : T.substSatz(ctx.tokens.join(' '))) : null;
      let n;
      const neu = () => { n = U.pick(T.N.filter((x) => !n || x.sg !== n.sg)); };
      if (task && ctx.post) n = T.N.find((x) => x.sg === ctx.sg);
      else if (task) n = U.pick(T.N.filter((x) => x.art === ctx.art && x.sg !== ctx.sg && (x.sg === x.pl) === (ctx.sg === ctx.pl)));
      else { neu(); api.chips([{ label: 'Anderes Wort', onClick() { neu(); api.replay(); } }]); }
      const kreis = (x, y) => el('circle', { cx: x, cy: y, r: 9, fill: 'var(--c3)', stroke: 'var(--ink)', 'stroke-width': 2, opacity: 0 }, api.svg);
      const zeig = (e) => api.tw(350, (t) => e.setAttribute('opacity', t));
      return {
        reset() {
          api.clear();
          api.sub(!task ? '' : ctx.post ? 'Lösung zu deiner Aufgabe' : 'Ein ähnliches Beispiel – deine Aufgabe löst du danach selbst');
        },
        async play() {
          if (SZ) { // Substantive im Satz finden: jedes groß geschriebene Wort prüfen
            const tx = el('text', { x: 180, y: 60, 'text-anchor': 'middle', class: 'ex-b' }, api.svg);
            const ts = SZ.tokens.map((w, i) => el('tspan', { text: (i ? ' ' : '') + w }, tx));
            try { for (let fs = 18; fs >= 10 && tx.getBBox().width > 340; fs--) tx.setAttribute('style', `font-size:${fs}px`); } catch (e) {}
            const probe = el('text', { x: 180, y: 120, 'text-anchor': 'middle', class: 'ex-s', text: '', style: 'font-size:15px' }, api.svg);
            api.say('Substantive schreibt man <b>groß</b>. Probe: Passt ein Artikel (der, die, das) davor?');
            await api.wait(2200);
            const liste = SZ.correct.map((i) => SZ.tokens[i].replace('.', ''));
            if (!SZ.correct.includes(0)) {
              ts[0].setAttribute('fill', '#6b6680'); probe.textContent = `„${SZ.tokens[0]}“: nur groß wegen des Satzanfangs`;
              api.say(`Vorsicht: <b>${SZ.tokens[0]}</b> ist kein Substantiv. Es ist nur groß, weil der Satz damit anfängt.`);
              await api.wait(2600);
            }
            for (const i of SZ.correct) {
              const w = SZ.tokens[i].replace('.', ''), nn = T.N.find((x) => x.sg === w || x.pl === w);
              ts[i].setAttribute('fill', BLAU); probe.textContent = nn ? (nn.sg === w ? `${nn.art} ${w} ✓` : `die ${w} ✓`) : `${w} ✓`;
              await api.wait(1300);
            }
            probe.textContent = '';
            api.say(`Substantive: <b>${liste.join(', ')}</b>. Vor jedes passt ein Artikel.`);
            return;
          }
          // links: Einzahl
          const k1 = kreis(92, 38);
          const sg = el('text', { x: 92, y: 84, 'text-anchor': 'middle', class: 'ex-b', opacity: 0 }, api.svg);
          el('tspan', { text: n.art, fill: GFARBE[n.art] }, sg); el('tspan', { text: ' ' + n.sg }, sg);
          zeig(k1); await zeig(sg);
          api.say(`<b>${n.art} ${n.sg}</b>: Jedes Substantiv hat ein Geschlecht (Genus). Der Artikel zeigt es.`);
          await api.wait(2200);
          const g = el('text', { x: 92, y: 108, 'text-anchor': 'middle', class: 'ex-s', text: T.GENUS[n.art], style: `font-size:12px;fill:${GFARBE[n.art]}`, opacity: 0 }, api.svg);
          await zeig(g);
          api.say(`<b>${n.art}</b> → ${T.GENUS[n.art]}. Zur Erinnerung: der = männlich, die = weiblich, das = sächlich.`);
          await api.wait(2600);
          // Pfeil und Mehrzahl
          const pf = el('path', { d: 'M 160 78 H 196 M 188 71 L 197 78 L 188 85', fill: 'none', class: 'ray', opacity: 0 }, api.svg);
          await zeig(pf);
          const ks = [246, 270, 294].map((x) => kreis(x, 38));
          const pl = el('text', { x: 270, y: 84, 'text-anchor': 'middle', class: 'ex-b', opacity: 0 }, api.svg);
          el('tspan', { text: 'die ' }, pl);
          [...n.pl].forEach((c, i) => { const neuB = i >= n.sg.length || c !== n.sg[i]; const ts = el('tspan', { text: c }, pl); if (neuB) ts.setAttribute('fill', ORANGE); });
          ks.forEach(zeig); await zeig(pl);
          try { for (let fs = 20; fs >= 12 && pl.getBBox().width > 170; fs--) pl.setAttribute('style', `font-size:${fs}px`); } catch (e) {}
          el('text', { x: 92, y: 140, 'text-anchor': 'middle', class: 'ex-s', text: 'Einzahl (Singular)', style: 'font-size:12px;fill:#6b6680' }, api.svg);
          el('text', { x: 270, y: 140, 'text-anchor': 'middle', class: 'ex-s', text: 'Mehrzahl (Plural)', style: 'font-size:12px;fill:#6b6680' }, api.svg);
          api.say(`Eines oder mehrere? Das ist die Zahl (Numerus). In der Mehrzahl heißt der Artikel immer <b>die</b>.`);
          await api.wait(2600);
          api.say(`<b>${n.art} ${n.sg}</b> → <b>die ${n.pl}</b><br>${T.pluralSatz(n)}`);
        },
      };
    },
  };

  // =====================================================
  // Die vier Fälle: vier Fragen
  // =====================================================
  //   ctx: { mode:'fall', fall, teile:[…], idx, frage, form, art:'der'|'die'|'das'|'pl' }, dazu pre/post
  const FREI = [
    { teile: ['Die Schwester', 'des Lehrers', 'zeigt', 'dem Kind', 'das Bild'], i: [0, 1, 3, 4], q: ['Wer zeigt dem Kind das Bild?', 'Wessen Schwester ist es?', 'Wem zeigt sie das Bild?', 'Wen oder was zeigt sie?'] },
    { teile: ['Der Hund', 'des Bruders', 'bringt', 'der Freundin', 'den Ball'], i: [0, 1, 3, 4], q: ['Wer bringt der Freundin den Ball?', 'Wessen Hund ist es?', 'Wem bringt er den Ball?', 'Wen oder was bringt er?'] },
    { teile: ['Die Freundin', 'der Schwester', 'leiht', 'dem Bruder', 'das Fahrrad'], i: [0, 1, 3, 4], q: ['Wer leiht dem Bruder das Fahrrad?', 'Wessen Freundin ist es?', 'Wem leiht sie das Fahrrad?', 'Wen oder was leiht sie?'] },
  ];
  EX['d5-faelle'] = {
    title: 'Vier Fragen, vier Fälle',
    titleFor: (ctx) => (ctx && ctx.fall ? `${T.FNAME[ctx.fall]}: die passende Frage` : 'Vier Fragen, vier Fälle'),
    viewBox: '0 0 360 200',
    create(api, ctx) {
      ctx = ctx || {};
      const task = !!ctx.fall;
      let S = null, frei = U.pick(FREI), satzEl, teilEls, frageEl, zeilen;
      if (task && ctx.post) S = ctx;
      if (task && ctx.pre) { const s = T.fallSatz(ctx.fall); S = { fall: s.fall, teile: s.teile, idx: s.idx, frage: s.frage, form: s.formen[0], art: s.plural ? 'pl' : s.n.art }; }
      if (!task) api.chips([{ label: 'Anderer Satz', onClick() { frei = U.pick(FREI.filter((x) => x !== frei)); api.replay(); } }]);
      const Y = (i) => 112 + i * 24;
      function aufbau(teile) {
        satzEl = el('text', { x: 180, y: 36, 'text-anchor': 'middle', class: 'ex-b' }, api.svg);
        teilEls = teile.map((t, i) => el('tspan', { text: (i ? ' ' : '') + t + (i === teile.length - 1 ? '.' : '') }, satzEl));
        try { for (let fs = 18; fs >= 10 && satzEl.getBBox().width > 340; fs--) satzEl.setAttribute('style', `font-size:${fs}px`); } catch (e) {}
        frageEl = el('text', { x: 180, y: 70, 'text-anchor': 'middle', class: 'ex-s', text: '', style: `font-size:15px;fill:${BLAU}` }, api.svg);
        zeilen = T.FAELLE.map((f, i) => ({
          bg: el('rect', { x: 10, y: Y(i) - 16, width: 340, height: 22, rx: 7, fill: '#dfe9ff', opacity: 0 }, api.svg),
          name: el('text', { x: 20, y: Y(i), class: 'ex-s', text: T.FNAME[f], style: 'font-size:13px' }, api.svg),
          frage: el('text', { x: 118, y: Y(i), class: 'ex-s', text: T.FFRAGE[f], style: 'font-size:13px;fill:#6b6680' }, api.svg),
          form: el('text', { x: 340, y: Y(i), 'text-anchor': 'end', class: 'ex-s', text: task && S.art ? T.ARTIKEL[S.art][i] : '', style: 'font-size:13px' }, api.svg),
        }));
      }
      async function zeige(fallIdx, teilIdx, frage, form) {
        teilEls.forEach((t) => t.removeAttribute('fill'));
        zeilen.forEach((z) => z.bg.setAttribute('opacity', 0));
        frageEl.textContent = frage;
        await api.wait(900);
        teilEls[teilIdx].setAttribute('fill', BLAU);
        await api.tw(350, (t) => zeilen[fallIdx].bg.setAttribute('opacity', t));
        if (form !== undefined) zeilen[fallIdx].form.textContent = form;
      }
      return {
        reset() {
          api.clear();
          api.sub(!task ? '' : ctx.post ? 'Lösung zu deiner Aufgabe' : 'Ein ähnliches Beispiel – deine Aufgabe löst du danach selbst');
          aufbau(task ? S.teile : frei.teile);
        },
        async play() {
          if (task) {
            const i = T.FAELLE.indexOf(S.fall);
            api.say('Den Fall findest du mit einer <b>Frage</b>. Stelle sie mit dem ganzen Satz.');
            await api.wait(2000);
            await zeige(i, S.idx, S.frage);
            api.say(`<b>${S.frage}</b> → <b>${S.form}</b>`);
            await api.wait(2400);
            api.say(`Frage: <b>${S.frage}</b> → <b>${S.form}</b>. Das ist der <b>${T.FNAME[S.fall]}</b>. In der Tabelle siehst du, wie der Artikel sich in den vier Fällen ändert.`);
            return;
          }
          api.say('Ein Substantiv kann in vier Fällen stehen. Jeden Fall findest du mit einer <b>Frage</b>.');
          await api.wait(2200);
          for (let k = 0; k < 4; k++) {
            await zeige(k, frei.i[k], frei.q[k], frei.teile[frei.i[k]]);
            api.say(`<b>${frei.q[k]}</b> → <b>${frei.teile[frei.i[k]]}</b>: ${T.FNAME[T.FAELLE[k]]}.`);
            await api.wait(2600);
          }
          api.say('Merke: Wer oder was? → Nominativ · Wessen? → Genitiv · Wem? → Dativ · Wen oder was? → Akkusativ.');
        },
      };
    },
  };

  // =====================================================
  // Gemeinsame Bilder für Pronomen, Adjektive, Verbformen, Wortarten
  // =====================================================
  // Jede Aufgabe bringt in ex mit, was gezeigt wird (mode) und aus welcher Aufgabenart sie stammt (art).
  // „Ähnliches Beispiel“ = dieselbe Aufgabenart erzeugt eine neue Aufgabe; frei = irgendeine Aufgabe des Themas.
  const WFARBE = { N: '#1f55d6', V: '#c62f4b', A: '#0a7d57', D: '#c2410c', P: '#7c3aed' };
  const fit = (t, maxW, von) => { try { for (let fs = von; fs >= 10 && t.getBBox().width > maxW; fs--) t.setAttribute('style', `font-size:${fs}px`); } catch (e) {} };
  // umbruch: lange Sätze stehen in zwei Zeilen (Trennung an einer Wortgrenze nahe der Mitte)
  function zeile(api, teile, y, sep, umbruch) {
    const t = el('text', { x: 180, y, 'text-anchor': 'middle', class: 'ex-b' }, api.svg);
    const lang = teile.join(' ').length;
    let br = -1;
    if (umbruch && sep && lang > 30 && teile.length > 3) { let c = 0; for (let i = 0; i < teile.length; i++) { c += teile[i].length + 1; if (c >= lang / 2) { br = i + 1; break; } } if (br >= teile.length) br = -1; }
    const ts = teile.map((w, i) => { const e = el('tspan', { text: (sep && i && i !== br ? ' ' : '') + w }, t); if (i === br) { e.setAttribute('x', 180); e.setAttribute('dy', 26); } return e; });
    if (br > 0) t.setAttribute('y', y - 13);
    fit(t, 336, 19);
    return { t, ts, br };
  }
  // längerer Text: mehrere Zeilen mit höchstens 40 Zeichen, kleinere Schrift
  function absatz(api, tokens) {
    const t = el('text', { x: 180, y: 30, 'text-anchor': 'middle', class: 'ex-b', style: 'font-size:13.5px' }, api.svg);
    let c = 0;
    const ts = tokens.map((w, i) => { const neu = i > 0 && c + w.length + 1 > 40; const e = el('tspan', { text: (i && !neu ? ' ' : '') + w }, t); if (neu) { e.setAttribute('x', 180); e.setAttribute('dy', 21); c = 0; } c += w.length + 1; return e; });
    return { t, ts };
  }
  const ohneU = (w) => w.toLowerCase().replace(/ä/g, 'a').replace(/ö/g, 'o').replace(/ü/g, 'u');
  const mitteX = (t, teile, idx, sep) => { // Mitte eines Teils in x (für Pfeile)
    try { let a = 0; for (let i = 0; i < idx; i++) a += teile[i].length + (sep && i ? 1 : 0); if (sep && idx) a += 1;
      return (t.getStartPositionOfChar(a).x + t.getEndPositionOfChar(a + teile[idx].length - 1).x) / 2; } catch (e) { return 180; }
  };
  const BILD = {
    // zwei Zeilen: oben der Ausgangssatz, unten das Ergebnis, ein Pfeil verbindet die markierten Teile
    async zz(api, x) {
      const a = zeile(api, x.z1, 50);
      api.say(x.s1); await api.wait(1200);
      a.ts[x.i1].setAttribute('fill', BLAU); await api.wait(1800);
      const b = zeile(api, x.z2, 124); b.t.setAttribute('opacity', 0);
      const x1 = mitteX(a.t, x.z1, x.i1), x2 = mitteX(b.t, x.z2, x.i2);
      const pf = el('path', { d: `M ${x1} 60 C ${x1} 84, ${x2} 80, ${x2} 100 M ${x2 - 6} 93 L ${x2} 101 L ${x2 + 6} 93`, fill: 'none', stroke: BLAU, 'stroke-width': 2.5, 'stroke-linecap': 'round', opacity: 0 }, api.svg);
      await api.tw(400, (t) => pf.setAttribute('opacity', t));
      b.ts[x.i2].setAttribute('fill', BLAU);
      await api.tw(400, (t) => b.t.setAttribute('opacity', t));
      api.say(x.s2); await api.wait(2600);
      api.say(x.merk);
    },
    // Wörter im Satz nacheinander markieren
    async marken(api, x) {
      const a = x.klein ? absatz(api, x.tokens) : zeile(api, x.tokens, 66, !x.dicht, true);
      api.say(x.s1); await api.wait(2600);
      for (const i of x.correct) { a.ts[i].setAttribute('fill', x.dicht ? ORANGE : BLAU); await api.wait(x.dicht ? 700 : 1100); }
      api.say(x.merk || `${x.was}: <b>${x.correct.map((i) => x.tokens[i].replace(/[.,!?]/g, '')).join(', ')}</b>.`);
    },
    // Kommas erscheinen nacheinander an ihren Stellen
    async komma(api, x) {
      // dicht: ohne Leerzeichen (Buchstaben eines Worts), mark: Zeichen, das erscheint (Komma oder Trennstrich)
      const sep = x.dicht ? '' : ' ', mark = x.mark || ',';
      const t = el('text', { x: 180, y: 66, 'text-anchor': 'middle', class: 'ex-b' }, api.svg);
      if (x.dicht) t.setAttribute('style', 'font-size:26px');
      const lang = x.tokens.join(sep).length; let br = -1;
      if (!x.dicht && lang > 30) { let c = 0; for (let i = 0; i < x.tokens.length; i++) { c += x.tokens[i].length + 1; if (c >= lang / 2) { br = i + 1; break; } } if (br >= x.tokens.length) br = -1; }
      const ks = {};
      x.tokens.forEach((w, i) => {
        const e = el('tspan', { text: (i && i !== br ? sep : '') + w }, t);
        if (i === br) { e.setAttribute('x', 180); e.setAttribute('dy', 26); }
        if (x.gaps.includes(i)) ks[i] = el('tspan', { text: mark, fill: ORANGE, 'fill-opacity': 0 }, t);
      });
      if (br > 0) t.setAttribute('y', 53);
      if (!x.dicht) fit(t, 336, 19); else { try { for (let fs = 26; fs >= 12 && t.getBBox().width > 336; fs--) t.setAttribute('style', `font-size:${fs}px`); } catch (e) {} }
      api.say(x.s1); await api.wait(x.dicht ? 2200 : 3200);
      for (const i of x.gaps) { await api.tw(350, (k) => ks[i].setAttribute('fill-opacity', k)); await api.wait(900); }
      api.say(x.merk || `<b>${x.tokens.map((w, i) => w + (x.gaps.includes(i) ? ',' : '')).join(' ')}</b>`);
    },
    // Satzglieder als Wagen: markieren, benennen und (bei um) umstellen
    async glieder(api, x) {
      const n = x.teile.length, pad = 14, luecke = 6;
      let fs = 16, ws = [];
      const mess = el('text', { x: 0, y: -50, class: 'ex-b' }, api.svg);
      for (; fs >= 9; fs--) {
        mess.setAttribute('style', `font-size:${fs}px`);
        ws = x.teile.map((t) => { mess.textContent = t; try { return mess.getBBox().width + pad; } catch (e) { return t.length * fs * 0.6 + pad; } });
        if (ws.reduce((a, b) => a + b, 0) + luecke * (n - 1) <= 344) break;
      }
      mess.remove();
      const gesamt = ws.reduce((a, b) => a + b, 0) + luecke * (n - 1);
      const xs = (order) => { const pos = []; let cx = 180 - gesamt / 2; order.forEach((k) => { pos[k] = cx; cx += ws[k] + luecke; }); return pos; };
      let pos = xs(x.teile.map((_, k) => k));
      const wagen = x.teile.map((t, k) => {
        const g = el('g', { transform: `translate(${pos[k]},0)` }, api.svg);
        const r = el('rect', { x: 0, y: 28, width: ws[k], height: 34, rx: 9, fill: x.rollen[k] === 'P' ? '#ffe3d6' : 'var(--card)', stroke: 'var(--ink)', 'stroke-width': 2 }, g);
        el('text', { x: ws[k] / 2, y: 50, 'text-anchor': 'middle', class: 'ex-b', text: t, style: `font-size:${fs}px` }, g);
        const lab = el('text', { x: ws[k] / 2, y: 80, 'text-anchor': 'middle', class: 'ex-s', text: '', style: 'font-size:10.5px;fill:#6b6680' }, g);
        return { g, r, lab };
      });
      api.say(x.s1); await api.wait(2400);
      if (x.um) {
        const ziel = xs(x.um), start = pos.slice();
        await api.tw(1100, (t) => wagen.forEach((w, k) => w.g.setAttribute('transform', `translate(${lerp(start[k], ziel[k], t)},${Math.sin(t * Math.PI) * (k === x.um[0] ? -14 : k === x.um[1] ? 0 : 14)})`)));
        pos = ziel;
        api.say('Ganze Wagen tauschen die Plätze. Der helle Wagen ist das <b>Prädikat</b>: Es bleibt an 2. Stelle.');
        await api.wait(2800);
      }
      const zeig = x.idx && x.idx.length ? x.idx : x.teile.map((_, k) => k);
      for (const k of zeig) {
        if (x.idx && x.idx.length) { wagen[k].r.setAttribute('stroke', BLAU); wagen[k].r.setAttribute('fill', '#dfe9ff'); wagen[k].lab.setAttribute('style', `font-size:11.5px;fill:${BLAU}`); }
        const name = x.rollen[k] === 'x' ? '' : T.ROLLE[x.rollen[k]];
        wagen[k].lab.textContent = name;
        // Beschriftung bleibt im Bild, auch unter schmalen Wagen am Rand
        const halb = name.length * 3.4 + 3, mitte = Math.max(halb, Math.min(360 - halb, pos[k] + ws[k] / 2));
        wagen[k].lab.setAttribute('x', mitte - pos[k]);
        await api.wait(x.idx && x.idx.length ? 900 : 350);
      }
      api.say(x.merk);
    },
    // Wörter oder kurze Sätze untereinander: Wortstamm farbig, ein Wort ausgegraut (raus) oder hervorgehoben (hell)
    async liste(api, x) {
      const n = x.woerter.length, schritt = n > 3 ? 27 : 32, y0 = (x.klein ? 30 : 36);
      const zeilen = x.woerter.map((w, i) => {
        const t = el('text', { x: 180, y: y0 + i * schritt, 'text-anchor': 'middle', class: 'ex-b', style: `font-size:${x.klein ? 14 : 19}px`, opacity: 0 }, api.svg);
        const k = x.stamm ? ohneU(w).indexOf(x.stamm) : -1;
        if (k >= 0) { el('tspan', { text: w.slice(0, k) }, t); el('tspan', { text: w.slice(k, k + x.stamm.length), fill: BLAU }, t); el('tspan', { text: w.slice(k + x.stamm.length) }, t); } else t.textContent = w;
        try { for (let fs = x.klein ? 14 : 19; fs >= 9 && t.getBBox().width > 336; fs--) t.setAttribute('style', `font-size:${fs}px`); } catch (e) {}
        return t;
      });
      api.say(x.s1);
      for (const t of zeilen) { await api.tw(300, (k) => t.setAttribute('opacity', k)); await api.wait(450); }
      await api.wait(1400);
      if (x.raus >= 0) { zeilen[x.raus].style.fill = '#9a94a8'; zeilen[x.raus].setAttribute('text-decoration', 'line-through'); }
      if (x.hell >= 0 && x.hell !== undefined) zeilen[x.hell].style.fill = BLAU;
      api.say(x.merk);
    },
    // Reimschema: gleiche Reime in gleicher Farbe, rechts die Buchstaben
    async reim(api, x) {
      const farbe = { a: BLAU, b: ORANGE };
      const zs = x.zeilen.map((z, i) => {
        const w = z.split(' '), letzter = w.pop();
        const t = el('text', { x: 16, y: 34 + i * 27, class: 'ex-b', style: 'font-size:14px' }, api.svg);
        el('tspan', { text: w.join(' ') + ' ' }, t);
        const e = el('tspan', { text: letzter }, t);
        try { for (let fs = 14; fs >= 9 && t.getBBox().width > 296; fs--) t.setAttribute('style', `font-size:${fs}px`); } catch (err) {}
        const b = el('text', { x: 338, y: 34 + i * 27, 'text-anchor': 'middle', class: 'ex-b', text: '', style: 'font-size:17px' }, api.svg);
        return { e, b };
      });
      api.say('Schau auf das <b>letzte Wort</b> jedes Verses. Gleiche Reime bekommen denselben Buchstaben.');
      await api.wait(2600);
      for (let i = 0; i < 4; i++) { zs[i].e.setAttribute('fill', farbe[x.schema[i]]); zs[i].b.textContent = x.schema[i]; zs[i].b.style.fill = farbe[x.schema[i]]; await api.wait(1000); }
      api.say(x.merk);
    },
    // Schaubild: Balken wachsen, die gefragten werden hervorgehoben und beschriftet
    async balken(api, x) {
      const h = 100, top = 16, y = (v) => top + h - (v / 12) * h;
      for (let v = 0; v <= 12; v += 2) { el('line', { x1: 40, y1: y(v), x2: 330, y2: y(v), stroke: '#d9d2c3', 'stroke-width': 1 }, api.svg); el('text', { x: 32, y: y(v) + 4, 'text-anchor': 'end', class: 'ex-s', text: v, style: 'font-size:10px;fill:#6b6680' }, api.svg); }
      const bs = x.namen.map((n, i) => {
        const bx = 62 + i * 68;
        el('text', { x: bx + 18, y: top + h + 16, 'text-anchor': 'middle', class: 'ex-s', text: n, style: 'font-size:11.5px' }, api.svg);
        return { r: el('rect', { x: bx, y: y(0), width: 36, height: 0, rx: 3, fill: '#e9e3d6', stroke: 'var(--ink)', 'stroke-width': 1.5 }, api.svg), bx };
      });
      api.say('Jeder Balken zeigt eine Zahl. Je höher der Balken, desto mehr Kinder.');
      await api.tw(700, (t) => bs.forEach((b, i) => { b.r.setAttribute('height', (x.werte[i] / 12) * h * t); b.r.setAttribute('y', y(x.werte[i] * t)); }));
      await api.wait(1500);
      for (const i of x.idx) { bs[i].r.setAttribute('fill', 'var(--c2)'); el('text', { x: bs[i].bx + 18, y: y(x.werte[i]) - 5, 'text-anchor': 'middle', class: 'ex-b', text: x.werte[i], style: 'font-size:14px' }, api.svg); await api.wait(700); }
      api.say(x.merk);
    },
    // Wortarten: Zielwörter in der Farbe ihrer Wortart, unten die Legende
    async wa(api, x) {
      // einzelne Wörter (liste) stehen mit Abstand nebeneinander, ein Satz steht als Zeile
      const a = x.liste
        ? { ts: x.w.map((w, i) => el('text', { x: 54 + i * 84, y: 56, 'text-anchor': 'middle', class: 'ex-b', text: w, style: 'font-size:15px' }, api.svg)) }
        : zeile(api, x.w.map((w, i) => (i === x.w.length - 1 ? w + '.' : w)), 56, true);
      const lx = [14, 92, 138, 206, 264];
      Object.keys(T.WA).forEach((k, i) => {
        el('circle', { cx: lx[i], cy: 136, r: 5, fill: WFARBE[k] }, api.svg);
        el('text', { x: lx[i] + 9, y: 140, class: 'ex-s', text: T.WA[k], style: `font-size:10.5px;fill:${k === x.ziel ? WFARBE[k] : '#6b6680'}` }, api.svg);
      });
      api.say(`Gesucht: <b>${x.idx.length > 1 || !x.liste && x.art === 'waAntippen' ? T.WAPL[x.ziel] : T.WA[x.ziel]}</b>. ${T.WAPROBE[x.ziel]}`);
      await api.wait(3000);
      for (const i of x.idx) { a.ts[i].style.fill = WFARBE[x.ziel]; await api.wait(1100); }
      const ws = x.idx.map((i) => x.w[i]);
      api.say(x.art === 'waAntippen' ? `${T.WAPL[x.ziel]}: <b>${ws.join(', ')}</b>.` : `<b>${ws[0]}</b> ist ein <b>${T.WA[x.ziel]}</b>.`);
    },
    // Steigern: drei Türme wachsen
    async steigern(api, x) {
      const formen = [x.pos, x.komp, 'am ' + x.sup], namen = ['Grundstufe', 'Vergleichsstufe', 'Höchststufe'], h = [34, 62, 92], xs = [66, 180, 294];
      api.say(`Adjektive kann man <b>steigern</b>: drei Stufen, wie drei Türme.`);
      for (let i = 0; i < 3; i++) {
        const r = el('rect', { x: xs[i] - 22, y: 132, width: 44, height: 0, rx: 5, fill: i === x.stufe ? 'var(--c2)' : '#e9e3d6', stroke: 'var(--ink)', 'stroke-width': 2 }, api.svg);
        await api.tw(500, (t) => { r.setAttribute('height', h[i] * t); r.setAttribute('y', 132 - h[i] * t); });
        const f = el('text', { x: xs[i], y: 154, 'text-anchor': 'middle', class: 'ex-b', text: formen[i], style: 'font-size:15px' }, api.svg);
        if (i === x.stufe) f.setAttribute('fill', BLAU);
        fit(f, 108, 15);
        el('text', { x: xs[i], y: 172, 'text-anchor': 'middle', class: 'ex-s', text: namen[i], style: 'font-size:11px;fill:#6b6680' }, api.svg);
        api.say([`<b>${x.pos}</b>: Grundstufe. So steht das Wort im Wörterbuch.`, `<b>${x.komp}</b>: Vergleichsstufe. Zwei werden verglichen.`, `<b>am ${x.sup}</b>: Höchststufe. Mehr geht nicht.`][i]);
        await api.wait(1900);
      }
      api.say(`${x.pos} · ${x.komp} · am ${x.sup}<br>${['Grundstufe', 'Vergleichsstufe', 'Höchststufe'][x.stufe]}: <b>${formen[x.stufe]}</b>`);
    },
    // als oder wie: zwei Türme, gleich oder verschieden hoch
    async alswie(api, x) {
      const h = x.gleich ? [70, 70] : [92, 58], xs = [120, 240];
      const t = el('text', { x: 180, y: 28, 'text-anchor': 'middle', class: 'ex-b', text: x.satz.replace(` ${x.wort} `, ' … ') }, api.svg); fit(t, 336, 18);
      for (let i = 0; i < 2; i++) {
        const r = el('rect', { x: xs[i] - 24, y: 140, width: 48, height: 0, rx: 5, fill: i ? '#e9e3d6' : 'var(--c2)', stroke: 'var(--ink)', 'stroke-width': 2 }, api.svg);
        el('text', { x: xs[i], y: 160, 'text-anchor': 'middle', class: 'ex-s', text: [x.n1, x.n2][i], style: 'font-size:13px' }, api.svg);
        await api.tw(500, (k) => { r.setAttribute('height', h[i] * k); r.setAttribute('y', 140 - h[i] * k); });
      }
      api.say(x.gleich ? 'Die beiden sind <b>gleich</b>. Das Adjektiv bleibt in der Grundstufe.' : 'Die beiden sind <b>verschieden</b>. Das Adjektiv steht in der Vergleichsstufe.');
      await api.wait(2400);
      const linie = el('line', { x1: 84, y1: 140 - h[0], x2: 276, y2: 140 - h[0], stroke: BLAU, 'stroke-width': 2, 'stroke-dasharray': '5 5' }, api.svg);
      t.textContent = x.satz; fit(t, 336, 18);
      api.say(x.gleich ? `gleich → <b>so ${x.pos} wie</b><br>${x.satz}` : `verschieden → <b>${x.komp} als</b><br>${x.satz}`);
    },
  };
  function thema(id, title, viewBox) {
    EX[id] = {
      title, viewBox,
      create(api, ctx) {
        ctx = ctx || {};
        const task = !!ctx.mode && (ctx.pre || ctx.post);
        const arten = D.arten[id], zufall = () => arten[U.pick(Object.keys(arten))]().ex;
        let x = task ? (ctx.post ? ctx : arten[ctx.art]().ex) : zufall();
        if (!task) api.chips([{ label: 'Anderes Beispiel', onClick() { x = zufall(); api.replay(); } }]);
        return {
          reset() { api.clear(); api.sub(!task ? '' : ctx.post ? 'Lösung zu deiner Aufgabe' : 'Ein ähnliches Beispiel – deine Aufgabe löst du danach selbst'); },
          play() { return BILD[x.mode](api, x); },
        };
      },
    };
  }
  thema('d5-pronomen', 'Pronomen: kleine Wörter für große', '0 0 360 150');
  thema('d5-adjektive', 'Adjektive steigern', '0 0 360 180');
  thema('d5-verbformen', 'Verbformen: ein Verb, viele Formen', '0 0 360 150');
  thema('d5-wortarten', 'Wortarten erkennen', '0 0 360 156');
  thema('d5-satzglieder', 'Satzglieder: der Satz als Zug', '0 0 360 100');
  thema('d5-subjekt', 'Subjekt und Prädikat', '0 0 360 150');
  thema('d5-objekte', 'Objekte: Wem? Wen oder was?', '0 0 360 100');
  thema('d5-attribute', 'Attribute: genauer beschreiben', '0 0 360 120');
  thema('d5-nebensatz', 'Hauptsatz und Nebensatz', '0 0 360 150');
  thema('d5-satzarten', 'Satzarten', '0 0 360 120');
  thema('d5-komma', 'Das Komma', '0 0 360 120');
  thema('d5-rede', 'Wörtliche Rede', '0 0 360 120');
  thema('d5-lang', 'Lange Vokale', '0 0 360 150');
  thema('d5-kurz', 'Kurz oder lang? Doppelt oder einfach?', '0 0 360 150');
  thema('d5-ableiten', 'Verlängern und Ableiten', '0 0 360 150');
  thema('d5-slaute', 's, ss oder ß?', '0 0 360 150');
  thema('d5-gross', 'Groß oder klein?', '0 0 360 150');
  thema('d5-silben', 'Silben', '0 0 360 120');
  thema('d5-zusammen', 'Zusammengesetzte Wörter', '0 0 360 150');
  thema('d5-ableitung', 'Vorsilben und Nachsilben', '0 0 360 150');
  thema('d5-wortfamilie', 'Wortfamilien: ein Stamm, viele Wörter', '0 0 360 150');
  thema('d5-wortfeld', 'Wortfelder: das treffende Wort', '0 0 360 150');
  thema('d5-maerchen', 'Märchen oder Sage?', '0 0 360 150');
  thema('d5-gedicht', 'Vers, Strophe, Reim', '0 0 360 140');
  thema('d5-bilder', 'Sprachliche Bilder', '0 0 360 120');
  thema('d5-textsorten', 'Erzählen, Beschreiben, Berichten', '0 0 360 150');
  thema('d5-sachtext', 'Sachtexte und Schaubilder lesen', '0 0 360 150');
})();
