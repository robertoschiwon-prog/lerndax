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
  // Nomen: Geschlecht und Mehrzahl
  // =====================================================
  //   ctx: { mode:'genus'|'plural', art, sg, pl } oder { mode:'satz', tokens, correct } (Nomen im Satz finden), dazu pre/post
  const GFARBE = { der: '#1f55d6', die: '#c62f4b', das: '#0a7d57' };
  const ORANGE = '#c2410c';
  EX['d5-substantive'] = {
    title: 'Nomen: Geschlecht und Mehrzahl',
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
          if (SZ) { // Nomen im Satz finden: jedes groß geschriebene Wort prüfen
            const tx = el('text', { x: 180, y: 60, 'text-anchor': 'middle', class: 'ex-b' }, api.svg);
            const ts = SZ.tokens.map((w, i) => el('tspan', { text: (i ? ' ' : '') + w }, tx));
            try { for (let fs = 18; fs >= 10 && tx.getBBox().width > 340; fs--) tx.setAttribute('style', `font-size:${fs}px`); } catch (e) {}
            const probe = el('text', { x: 180, y: 120, 'text-anchor': 'middle', class: 'ex-s', text: '', style: 'font-size:15px' }, api.svg);
            api.say('Nomen schreibt man <b>groß</b>. Probe: Passt ein Artikel (der, die, das) davor?');
            await api.wait(2200);
            const liste = SZ.correct.map((i) => SZ.tokens[i].replace('.', ''));
            if (!SZ.correct.includes(0)) {
              ts[0].setAttribute('fill', '#6b6680'); probe.textContent = `„${SZ.tokens[0]}“: nur groß wegen des Satzanfangs`;
              api.say(`Vorsicht: <b>${SZ.tokens[0]}</b> ist kein Nomen. Es ist nur groß, weil der Satz damit anfängt.`);
              await api.wait(2600);
            }
            for (const i of SZ.correct) {
              const w = SZ.tokens[i].replace('.', ''), nn = T.N.find((x) => x.sg === w || x.pl === w);
              ts[i].setAttribute('fill', BLAU); probe.textContent = nn ? (nn.sg === w ? `${nn.art} ${w} ✓` : `die ${w} ✓`) : `${w} ✓`;
              await api.wait(1300);
            }
            probe.textContent = '';
            api.say(`Nomen: <b>${liste.join(', ')}</b>. Vor jedes passt ein Artikel.`);
            return;
          }
          // links: Einzahl
          const k1 = kreis(92, 38);
          const sg = el('text', { x: 92, y: 84, 'text-anchor': 'middle', class: 'ex-b', opacity: 0 }, api.svg);
          el('tspan', { text: n.art, fill: GFARBE[n.art] }, sg); el('tspan', { text: ' ' + n.sg }, sg);
          zeig(k1); await zeig(sg);
          api.say(`<b>${n.art} ${n.sg}</b>: Jedes Nomen hat ein Geschlecht (Genus). Der Artikel zeigt es.`);
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
          api.say('Ein Nomen kann in vier Fällen stehen. Jeden Fall findest du mit einer <b>Frage</b>.');
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
    // Rechtschreibung als Weiche (seit v121): zwei Fragen nacheinander, eine Kugel läuft den Weg des Wortes bis zur Schreibweise.
    //   x: { wort, lauf:[von,bis] (die Buchstaben, um die es geht), laenger?, fragen:[{f, aus:[Antwort, Ergebnis], weiter}, {f, wahl:[[Antwort, Ergebnis] ×2]}],
    //        weg:[0] (gleich fertig) oder [1, 0|1], zeichen:[[Schritt, von, bis, 'kurz'|'lang'|'unter']], sag:[Text je Schritt], merk }
    async weiche(api, x) {
      const t = el('text', { x: 180, y: 36, 'text-anchor': 'middle', class: 'vexpr' }, api.svg);
      [[0, x.lauf[0]], x.lauf, [x.lauf[1], x.wort.length]].forEach(([a, b], k) => { if (b > a) { const ts = el('tspan', { text: x.wort.slice(a, b) }, t); if (k === 1) ts.setAttribute('fill', BLAU); } });
      if (x.klein) fit(t, 336, 18); // ganzer Satz statt eines Wortes
      const pos = (a, b) => { try { return [t.getStartPositionOfChar(a).x, t.getEndPositionOfChar(b - 1).x]; } catch (e) { return [172, 188]; } };
      const zeichne = (schritt) => (x.zeichen || []).filter((z) => z[0] === schritt).forEach(([, a, b, art]) => {
        const [x1, x2] = pos(a, b), m = (x1 + x2) / 2;
        if (art === 'kurz') el('circle', { cx: m, cy: 46, r: 3.5, fill: ORANGE }, api.svg);
        else if (art === 'lang') el('line', { x1: x1 + 1, y1: 46, x2: x2 - 1, y2: 46, stroke: ORANGE, 'stroke-width': 3.5, 'stroke-linecap': 'round' }, api.svg);
        else el('path', { d: `M ${x1} 43 v 5 H ${x2} v -5`, fill: 'none', stroke: BLAU, 'stroke-width': 2 }, api.svg);
      });
      if (x.klein) { const [u1, u2] = pos(x.lauf[0], x.lauf[1]); el('line', { x1: u1, y1: 43, x2: u2, y2: 43, stroke: BLAU, 'stroke-width': 3, 'stroke-linecap': 'round' }, api.svg); }
      const frage = (y, text) => el('text', { x: 180, y, 'text-anchor': 'middle', class: 'ex-s', text, style: 'font-weight:800;font-size:13.5px', opacity: 0 }, api.svg);
      const pille = (x0, y, w, text) => {
        const g = el('g', { opacity: 0 }, api.svg);
        const r = el('rect', { x: x0, y, width: w, height: 28, rx: 14, fill: '#fff', stroke: 'var(--soft)', 'stroke-width': 1.5 }, g);
        el('text', { x: x0 + w / 2, y: y + 18.5, 'text-anchor': 'middle', class: 'ex-s', text, style: 'font-size:12.5px;font-weight:700' }, g);
        return { g, r, cx: x0 + w / 2, cy: y + 14, links: x0 };
      };
      // je Frage eine Reihe: p[0] = Ausgang (fertig), p[1] = weiter zur nächsten Frage; in der letzten Reihe zwei Ausgänge
      const Y = (k) => 72 + 68 * k;
      const reihen = x.fragen.map((f, k) => ({
        q: frage(Y(k), f.f), ende: !!f.wahl,
        p: f.wahl ? [pille(20, Y(k) + 12, 150, `${f.wahl[0][0]} → ${f.wahl[0][1]}`), pille(190, Y(k) + 12, 150, `${f.wahl[1][0]} → ${f.wahl[1][1]}`)]
          : [pille(206, Y(k) + 12, 130, `${f.aus[0]} → ${f.aus[1]}`), pille(24, Y(k) + 12, 130, `${f.weiter} ↓`)],
      }));
      const kugel = el('circle', { cx: 180, cy: 54, r: 7, fill: 'var(--c1)', stroke: 'var(--ink)', 'stroke-width': 2, opacity: 0 }, api.svg);
      let ort = [180, 54];
      const lauf = async (zx, zy) => { const [ax, ay] = ort; await api.tw(800, (k) => { kugel.setAttribute('cx', lerp(ax, zx, k)); kugel.setAttribute('cy', lerp(ay, zy, k)); }); ort = [zx, zy]; };
      const treffer = (p) => { p.r.setAttribute('fill', '#dff5ea'); p.r.setAttribute('stroke', 'var(--ok)'); p.r.setAttribute('stroke-width', 2.5); };
      const zeig = (...es) => api.tw(400, (k) => es.forEach((e) => e.setAttribute('opacity', Math.max(+e.getAttribute('opacity') || 0, k))));
      await api.wait(700);
      if (x.laenger) { const ende = pos(0, x.wort.length)[1]; const l = el('text', { x: ende + 10, y: 36, class: 'ex-b', text: `→ ${x.laenger}`, opacity: 0, style: `fill:${ORANGE}` }, api.svg); await zeig(l); }
      // der ganze Weg ist von Anfang an blass zu sehen; die Frage, die gerade dran ist, wird kräftig
      await api.tw(400, (k) => reihen.forEach((r) => [r.q, r.p[0].g, r.p[1].g].forEach((e) => e.setAttribute('opacity', 0.3 * k))));
      for (let k = 0; k < x.weg.length; k++) {
        const r = reihen[k], wahl = x.weg[k], ziel = r.p[wahl];
        await zeig(r.q, r.p[0].g, r.p[1].g, kugel);
        api.say(`<b>${x.fragen[k].f}</b>`); await api.wait(2200);
        zeichne(k);
        api.say(x.sag[k]);
        await lauf(ziel.links + 14, ziel.cy);
        r.p[1 - wahl].g.setAttribute('opacity', 0.3);
        if (r.ende || wahl === 0) { treffer(ziel); kugel.setAttribute('opacity', 0); await api.wait(3300); break; }
        ziel.r.setAttribute('stroke', 'var(--c1)'); ziel.r.setAttribute('stroke-width', 2.5);
        await api.wait(2800);
      }
      api.say(x.merk);
    },
    // Lange Vokale als Schubladen (seit v121): Das Wort fällt in die Schublade seiner Schreibweise; dazu Wörter, die genauso geschrieben werden.
    //   x: { wort, stelle:[von,bis] (der lange Vokal), typ:'e'|'h'|'dd'|'ie'|'i', danach (Buchstabe nach dem Vokal), freunde:[Wörter], merk }
    async laden(api, x) {
      const t = el('text', { x: 180, y: 34, 'text-anchor': 'middle', class: 'vexpr' }, api.svg);
      [[0, x.stelle[0]], x.stelle, [x.stelle[1], x.wort.length]].forEach(([a, b], k) => { if (b > a) { const ts = el('tspan', { text: x.wort.slice(a, b) }, t); if (k === 1) ts.setAttribute('fill', BLAU); } });
      const pos = (a, b) => { try { return [t.getStartPositionOfChar(a).x, t.getEndPositionOfChar(b - 1).x]; } catch (e) { return [172, 188]; } };
      const SP = [['e', 'einfach', 'die meisten'], ['h', 'mit h', 'vor l, m, n, r'], ['dd', 'doppelt', 'nur wenige'], ['ie', 'ie', 'langes i']];
      const k0 = Math.max(0, SP.findIndex((s) => s[0] === (x.typ === 'i' ? 'e' : x.typ)));
      const laden = SP.map((s, k) => {
        const g = el('g', { opacity: 0 }, api.svg), x0 = 7 + k * 87.5;
        const r = el('rect', { x: x0, y: 58, width: 83, height: 142, rx: 9, fill: '#fff', stroke: 'var(--soft)', 'stroke-width': 1.5 }, g);
        el('path', { d: `M ${x0} 98 H ${x0 + 83}`, stroke: 'var(--soft)', 'stroke-width': 1.5 }, g);
        el('text', { x: x0 + 41.5, y: 76, 'text-anchor': 'middle', class: 'ex-s', text: s[1], style: 'font-weight:800;font-size:13.5px' }, g);
        el('text', { x: x0 + 41.5, y: 91, 'text-anchor': 'middle', class: 'ex-s f6', text: s[2], style: 'font-size:10.5px' }, g);
        return { g, r, cx: x0 + 41.5 };
      });
      await api.wait(600);
      const [v1, v2] = pos(x.stelle[0], x.stelle[1]);
      el('line', { x1: v1 + 1, y1: 44, x2: v2 - 1, y2: 44, stroke: ORANGE, 'stroke-width': 3.5, 'stroke-linecap': 'round' }, api.svg);
      api.say(`Sprich <b>${x.wort}</b> langsam: Der Vokal klingt <b>lang</b>. Dafür gibt es vier Schreibweisen, für jede eine Schublade.`);
      await api.tw(600, (k) => laden.forEach((l) => l.g.setAttribute('opacity', k)));
      await api.wait(3000);
      if (x.typ === 'h') {
        const [n1, n2] = pos(x.stelle[1], x.stelle[1] + 1);
        el('circle', { cx: (n1 + n2) / 2, cy: 27, r: 12, fill: 'none', stroke: ORANGE, 'stroke-width': 2 }, api.svg);
        api.say(`Hinter dem Vokal steht ein stummes <b>h</b>. Danach folgt <b>${x.danach}</b>: Ein Dehnungs-h gibt es nur vor l, m, n oder r.`);
      } else if (x.typ === 'dd') api.say('Der Vokal steht <b>doppelt</b>. Das gibt es nur bei wenigen Wörtern mit aa, ee oder oo.');
      else if (x.typ === 'ie') api.say('Es ist ein langes i. Das schreibt man fast immer <b>ie</b>.');
      else if (x.typ === 'i') api.say('Achtung, Ausnahme: Dieses lange i steht <b>ohne e</b>. Es gehört in die Schublade „einfach“.');
      else api.say('Kein h dahinter, kein doppelter Vokal: Der lange Vokal steht <b>einfach</b> da, wie bei den meisten Wörtern.');
      await api.wait(3200);
      const ziel = laden[k0], fs = x.wort.length > 7 ? 13 : 15;
      const karte = el('text', { x: 180, y: 34, 'text-anchor': 'middle', class: 'ex-b', text: x.wort, style: `font-size:${fs}px;fill:${BLAU}` }, api.svg);
      await api.tw(800, (k) => { karte.setAttribute('x', lerp(180, ziel.cx, k)); karte.setAttribute('y', lerp(34, 118, k)); });
      ziel.r.setAttribute('stroke', 'var(--ok)'); ziel.r.setAttribute('stroke-width', 2.5); ziel.r.setAttribute('fill', '#f1fbf6');
      laden.forEach((l, k) => { if (k !== k0) l.g.setAttribute('opacity', 0.4); });
      await api.wait(1400);
      if (x.freunde && x.freunde.length) {
        const fr = x.freunde.map((w, i) => el('text', { x: ziel.cx, y: 140 + i * 19, 'text-anchor': 'middle', class: 'ex-s', text: w, style: `font-size:${w.length > 8 ? 11.5 : 13}px`, opacity: 0 }, api.svg));
        api.say(`In dieselbe Schublade gehören zum Beispiel <b>${x.freunde.join(', ')}</b>. ${x.typ === 'e' || x.typ === 'ie' ? 'So werden die meisten geschrieben.' : 'Merke dir diese Wörter zusammen.'}`);
        for (const f of fr) await api.tw(350, (k) => f.setAttribute('opacity', k));
        await api.wait(3400);
      }
      api.say(x.merk);
    },
    // Artikelprobe (seit v122): Das Kärtchen „der · die · das“ fliegt vor das Wort. Passt es, ist es ein Nomen und wird groß.
    //   x: { tokens, gross:{i: Großform}, ziele:[{ i, ok, artikel?, sag?, ohneChip? }], anfang?, signal?, merk }
    async artikelprobe(api, x) {
      const z = zeile(api, x.tokens, 74, true, true);
      const ort = (i) => { try { const e = z.ts[i], a = /^\s/.test(e.textContent) ? 1 : 0, p1 = e.getStartPositionOfChar(a), p2 = e.getEndPositionOfChar(e.getNumberOfChars() - 1); return { x1: p1.x, x2: p2.x, y: p1.y }; } catch (e) { return { x1: 150, x2: 210, y: 74 }; } };
      const unten = (o) => z.br > 0 && o.y > 70; // Wort in der zweiten Zeile: Kärtchen darunter statt darüber
      const grossMach = (i) => { const e = z.ts[i]; e.textContent = e.textContent.replace(x.tokens[i], x.gross[i]); e.setAttribute('fill', BLAU); };
      const chip = el('g', { opacity: 0 }, api.svg);
      el('rect', { x: -50, y: -12, width: 100, height: 24, rx: 12, fill: '#fff', stroke: ORANGE, 'stroke-width': 2 }, chip);
      const ct = el('text', { x: 0, y: 4.5, 'text-anchor': 'middle', class: 'ex-s', text: 'der · die · das', style: 'font-size:12.5px;font-weight:800' }, chip);
      let c = [180, 22]; const setz = (px, py) => chip.setAttribute('transform', `translate(${px} ${py})`); setz(...c);
      const flieg = async (px, py) => { const [ax, ay] = c; await api.tw(650, (k) => setz(lerp(ax, px, k), lerp(ay, py, k))); c = [px, py]; };
      if (x.signal >= 0) z.ts[x.signal].setAttribute('fill', ORANGE);
      await api.wait(600);
      if (x.anfang) { grossMach(0); api.say(`Das <b>erste Wort</b> im Satz schreibt man immer groß: <b>${x.gross[0]}</b>.`); await api.wait(2800); }
      const mitChip = x.ziele.some((zl) => !zl.ohneChip);
      if (mitChip) { await api.tw(350, (k) => chip.setAttribute('opacity', k)); api.say('Die <b>Artikelprobe</b>: Passt <b>der, die oder das</b> direkt vor das Wort? Dann ist es ein Nomen.'); await api.wait(3000); }
      for (const zl of x.ziele) {
        const o = ort(zl.i), m = Math.max(54, Math.min(306, (o.x1 + o.x2) / 2)), u = unten(o);
        if (!zl.ohneChip) { ct.textContent = zl.artikel || 'der · die · das'; await flieg(m, u ? o.y + 24 : o.y - 31); }
        const wort = (zl.ok ? x.gross[zl.i] : x.tokens[zl.i]).replace(/[.,!?]$/, '');
        if (zl.ok) grossMach(zl.i); else z.ts[zl.i].setAttribute('fill', ORANGE);
        el('text', { x: zl.ohneChip ? (o.x1 + o.x2) / 2 : m + 60 > 350 ? m - 60 : m + 60, y: zl.ohneChip ? o.y - 22 : (u ? o.y + 29 : o.y - 26), 'text-anchor': 'middle', class: 'ex-b ' + (zl.ok ? 'fok' : 'fbad'), text: zl.ok ? '✓' : '✗', style: 'font-size:16px' }, api.svg).setAttribute('data-urteil', '1');
        api.say(zl.sag || (zl.artikel ? `<b>${zl.artikel} ${wort}</b>: Der Artikel passt. Ein Nomen, also <b>groß</b>.` : `Vor „${wort}“ passt ein Artikel. Ein Nomen, also <b>groß</b>.`));
        await api.wait(2600);
        if (x.ziele.length > 1) api.svg.querySelectorAll('[data-urteil]').forEach((e) => e.remove());
      }
      if (x.ziele.length > 1) await api.tw(300, (k) => chip.setAttribute('opacity', 1 - k));
      api.say(x.merk);
    },
    // Wörtliche Rede (seit v122): Sprechblase um das Gesagte, Begleitsatz unterstrichen, dann erscheint jedes Zeichen einzeln mit seinem Grund.
    //   x: { tokens, correct (Stellen der Satzzeichen), vorn, wer, verb, rede, z, merk }
    async rede(api, x) {
      const t = el('text', { x: 180, y: 62, 'text-anchor': 'middle', class: 'ex-b', 'xml:space': 'preserve', style: 'white-space:pre' }, api.svg);
      const ts = x.tokens.map((w, i) => { const e = el('tspan', { text: w.replace(/^ /, '\u00a0\u00a0') }, t); if (x.correct.includes(i)) { e.setAttribute('fill', ORANGE); e.setAttribute('fill-opacity', 0); } return e; }); // geschütztes Leerzeichen, sonst rückt die Rede an den Doppelpunkt
      fit(t, 330, 19);
      const iAuf = x.tokens.indexOf('„'), iZu = x.tokens.indexOf('“'), iRede = iAuf + 1, iBegl = x.vorn ? 0 : 5;
      const rand = (i, ende) => { try { const e = ts[i], n = e.getNumberOfChars(), a = /^\s/.test(e.textContent) && n > 1 ? 1 : 0; return ende ? e.getEndPositionOfChar(n - 1).x : e.getStartPositionOfChar(a).x; } catch (e) { return ende ? 300 : 60; } };
      const zeig = async (...is) => { await api.tw(380, (k) => is.forEach((i) => ts[i].setAttribute('fill-opacity', k))); };
      api.say('Zwei Fragen: <b>Was</b> wird gesagt? Und <b>wer</b> sagt es?'); await api.wait(2400);
      const b1 = rand(iAuf, false) - 3, b2 = rand(iZu, true) + 4;
      const blase = el('rect', { x: b1, y: 41, width: b2 - b1, height: 31, rx: 13, fill: '#e6efff', stroke: BLAU, 'stroke-width': 1.5, opacity: 0 }, api.svg);
      api.svg.insertBefore(blase, t);
      const zipfel = el('path', { d: x.vorn ? `M ${b1 + 16} 71 l -9 11 l 17 -11 z` : `M ${b2 - 16} 71 l 9 11 l -17 -11 z`, fill: '#e6efff', stroke: BLAU, 'stroke-width': 1.5, opacity: 0 }, api.svg);
      api.svg.insertBefore(zipfel, blase);
      ts[iRede].setAttribute('fill', BLAU);
      const lr = el('text', { x: (b1 + b2) / 2, y: 100, 'text-anchor': 'middle', class: 'ex-s', text: 'wörtliche Rede', style: `font-size:12px;font-weight:700;fill:${BLAU}`, opacity: 0 }, api.svg);
      await api.tw(450, (k) => [blase, zipfel, lr].forEach((e) => e.setAttribute('opacity', k)));
      api.say(`<b>„${x.rede}“</b>: Das wird gesagt. Es ist die <b>wörtliche Rede</b>.`); await api.wait(3000);
      const g1 = rand(iBegl, false), g2 = rand(iBegl, true);
      const strich = el('line', { x1: g1, y1: 69, x2: g1, y2: 69, stroke: ORANGE, 'stroke-width': 3.5, 'stroke-linecap': 'round' }, api.svg);
      await api.tw(450, (k) => strich.setAttribute('x2', lerp(g1, g2, k)));
      el('text', { x: (g1 + g2) / 2, y: 100, 'text-anchor': 'middle', class: 'ex-s', text: 'Begleitsatz', style: `font-size:12px;font-weight:700;fill:${ORANGE}` }, api.svg);
      api.say(`<b>„${x.tokens[iBegl].trim()}“</b> sagt, wer spricht. Das ist der <b>Begleitsatz</b>. Er steht hier <b>${x.vorn ? 'vorn' : 'hinten'}</b>.`); await api.wait(3400);
      if (x.vorn) { await zeig(1); api.say('Begleitsatz vorn: Ein <b>Doppelpunkt</b> kündigt die Rede an.'); await api.wait(2800); }
      await zeig(iAuf, iZu); api.say('<b>Anführungszeichen</b> stehen vor und hinter dem, was gesagt wird: unten auf, oben zu.'); await api.wait(3200);
      if (x.vorn) { await zeig(5); api.say(`Das Satzzeichen der Rede (${x.z}) steht <b>vor</b> dem letzten Anführungszeichen.`); await api.wait(3200); }
      else {
        if (x.z === '.') api.say('Der <b>Punkt</b> der Rede fällt weg, wenn der Begleitsatz folgt.'); else { await zeig(2); api.say(`Das ${x.z === '?' ? 'Fragezeichen' : 'Ausrufezeichen'} der Rede bleibt stehen, vor dem letzten Anführungszeichen.`); }
        await api.wait(3000);
        await zeig(4); api.say('Begleitsatz hinten: Nach der Rede steht ein <b>Komma</b>.'); await api.wait(2800);
        await zeig(6); api.say('Der Punkt steht ganz am Ende des Satzes.'); await api.wait(2400);
      }
      api.say(x.merk);
    },
    // Bauplan (seit v122): Wo steht die Personalform des Verbs? 2. Stelle, ganz vorn oder am Ende: daran erkennt man Satzart und Nebensatz.
    //   x: { tokens, verb (Stelle), neben? (Nebensatz), merk }
    async verbplatz(api, x) {
      const z = zeile(api, x.tokens, 58, true, false);
      const ort = (i) => { try { const e = z.ts[i], a = /^\s/.test(e.textContent) ? 1 : 0, p1 = e.getStartPositionOfChar(a), p2 = e.getEndPositionOfChar(e.getNumberOfChars() - 1); return { x1: p1.x, x2: p2.x, y: p1.y }; } catch (e) { return { x1: 100 + i * 30, x2: 126 + i * 30, y: 58 }; } };
      const typ = x.neben ? 2 : x.verb === 0 ? 1 : 0, wort = (i) => x.tokens[i].replace(/[.,!?]$/, '');
      const ueber = (x1, x2, text, f) => { el('path', { d: `M ${x1} 41 v -5 H ${x2} v 5`, fill: 'none', stroke: f, 'stroke-width': 2 }, api.svg); el('text', { x: (x1 + x2) / 2, y: 30, 'text-anchor': 'middle', class: 'ex-s', text, style: `font-size:12px;font-weight:800;fill:${f}` }, api.svg); };
      const PLAN = [
        { teile: [['1', 0, 26], ['Verb', 1, 40], ['…', 0, 40]], text: 'Verb an 2. Stelle', wo: 'Aussagesatz · W-Frage · Hauptsatz' },
        { teile: [['Verb', 1, 40], ['…', 0, 66]], text: 'Verb ganz vorn', wo: 'Frage ohne Fragewort · Aufforderung' },
        { teile: [['weil', 2, 34], ['…', 0, 32], ['Verb', 1, 40]], text: 'Verb am Ende', wo: 'Nebensatz (nach weil, wenn, dass …)' },
      ];
      const plaene = PLAN.map((p, k) => {
        const g = el('g', { opacity: 0 }, api.svg), y = 86 + k * 34; let px = 14;
        const r = el('rect', { x: 8, y: y - 5, width: 344, height: 30, rx: 9, fill: 'none', stroke: 'none', 'stroke-width': 2.5 }, g);
        p.teile.forEach(([txt, art, w]) => { el('rect', { x: px, y, width: w, height: 20, rx: 5, fill: art === 1 ? ORANGE : art === 2 ? BLAU : '#fff', stroke: art ? 'none' : 'var(--soft)', 'stroke-width': 1.5 }, g); el('text', { x: px + w / 2, y: y + 14, 'text-anchor': 'middle', class: 'ex-s', text: txt, style: `font-size:11px;font-weight:800;fill:${art ? '#fff' : 'var(--ink)'}` }, g); px += w + 3; });
        el('text', { x: 134, y: y + 8, class: 'ex-s', text: p.text, style: 'font-size:12px;font-weight:800' }, g);
        el('text', { x: 134, y: y + 21, class: 'ex-s f6', text: p.wo, style: 'font-size:10.5px' }, g);
        return { g, r };
      });
      api.say('Suche die <b>Personalform des Verbs</b>. Wo steht sie im Satz?'); await api.wait(2400);
      const ov = ort(x.verb); z.ts[x.verb].setAttribute('fill', ORANGE);
      await api.wait(900);
      if (typ === 0) {
        ueber(ort(0).x1, ort(x.verb - 1).x2, '1. Stelle', 'var(--ink)'); ueber(ov.x1, ov.x2, '2.', ORANGE);
        api.say(`Davor steht <b>ein</b> Satzglied: „${x.tokens.slice(0, x.verb).join(' ')}“. Das Verb „${wort(x.verb)}“ steht also an <b>2. Stelle</b>.`);
      } else if (typ === 1) { ueber(ov.x1, ov.x2, 'vorn', ORANGE); api.say(`Das Verb „${wort(x.verb)}“ steht <b>ganz vorn</b>.`); }
      else { z.ts[0].setAttribute('fill', BLAU); const o0 = ort(0); ueber(o0.x1, o0.x2, 'Einleitewort', BLAU); ueber(ov.x1, ov.x2, 'Ende', ORANGE); api.say(`Der Satz beginnt mit dem Einleitewort „${wort(0)}“. Das Verb „${wort(x.verb)}“ steht <b>ganz am Ende</b>.`); }
      await api.wait(3400);
      await api.tw(500, (k) => plaene.forEach((p, i) => p.g.setAttribute('opacity', (i === typ ? 1 : 0.4) * k)));
      plaene[typ].r.setAttribute('stroke', 'var(--ok)'); plaene[typ].r.setAttribute('fill', '#f1fbf6');
      api.say(`Deutsche Sätze haben drei Baupläne. Dieser Satz passt zum ${['ersten', 'zweiten', 'dritten'][typ]}: <b>${PLAN[typ].text}</b>.`); await api.wait(3800);
      api.say(x.merk);
    },
    // Wo? oder Wohin? (seit v122): links bleibt die Kugel liegen (Dativ), rechts kommt sie neu an (Akkusativ).
    //   x: { teile:[vor, nach] (Satz um den Artikel herum), artikel, frage:'wo'|'wohin', merk }
    async wowohin(api, x) {
      const t = el('text', { x: 180, y: 30, 'text-anchor': 'middle', class: 'ex-b' }, api.svg);
      el('tspan', { text: x.teile[0] }, t); el('tspan', { text: x.artikel, fill: BLAU }, t); el('tspan', { text: x.teile[1] || '' }, t);
      fit(t, 336, 18);
      const feld = (x0, titel, unter, fall) => {
        const g = el('g', { opacity: 0 }, api.svg);
        const r = el('rect', { x: x0, y: 46, width: 160, height: 108, rx: 12, fill: '#fff', stroke: 'var(--soft)', 'stroke-width': 1.5 }, g);
        el('text', { x: x0 + 80, y: 66, 'text-anchor': 'middle', class: 'ex-b', text: titel, style: 'font-size:16px' }, g);
        el('rect', { x: x0 + 86, y: 112, width: 52, height: 7, rx: 3, fill: 'var(--ink)' }, g); // der Platz (ein Brett)
        el('text', { x: x0 + 80, y: 135, 'text-anchor': 'middle', class: 'ex-s', text: unter, style: 'font-size:11.5px' }, g);
        el('text', { x: x0 + 80, y: 148, 'text-anchor': 'middle', class: 'ex-s', text: fall, style: 'font-size:11.5px;font-weight:800' }, g);
        return { g, r, x0 };
      };
      const wo = feld(14, 'Wo?', 'bleibt, wo es ist', 'Dativ: dem, der'), wohin = feld(186, 'Wohin?', 'kommt neu an', 'Akkusativ: den, die, das');
      const k1 = el('circle', { cx: wo.x0 + 112, cy: 103, r: 9, fill: ORANGE, stroke: 'var(--ink)', 'stroke-width': 2 }, wo.g);
      el('path', { d: `M ${wohin.x0 + 30} 100 Q ${wohin.x0 + 70} 62 ${wohin.x0 + 104} 94`, fill: 'none', stroke: 'var(--soft)', 'stroke-width': 2, 'stroke-dasharray': '4 4' }, wohin.g);
      const k2 = el('circle', { cx: wohin.x0 + 30, cy: 100, r: 9, fill: ORANGE, stroke: 'var(--ink)', 'stroke-width': 2 }, wohin.g);
      const flug = (k) => { const a = [wohin.x0 + 30, 100], c = [wohin.x0 + 70, 62], b = [wohin.x0 + 112, 103], u = 1 - k; k2.setAttribute('cx', u * u * a[0] + 2 * u * k * c[0] + k * k * b[0]); k2.setAttribute('cy', u * u * a[1] + 2 * u * k * c[1] + k * k * b[1]); };
      await api.wait(500);
      api.say('Nach auf, in, an, unter, neben … gibt es zwei Fälle. Frag nach dem Ort: <b>Wo?</b> oder <b>Wohin?</b>');
      await api.tw(500, (k) => [wo.g, wohin.g].forEach((g) => g.setAttribute('opacity', k)));
      await api.wait(1200);
      await api.tw(900, flug); await api.wait(500); await api.tw(500, (k) => k1.setAttribute('cy', 103 - 5 * Math.sin(k * Math.PI)));
      await api.wait(2000);
      const ja = x.frage === 'wo' ? wo : wohin, nein = x.frage === 'wo' ? wohin : wo;
      ja.r.setAttribute('stroke', 'var(--ok)'); ja.r.setAttribute('stroke-width', 2.5); ja.r.setAttribute('fill', '#f1fbf6'); nein.g.setAttribute('opacity', 0.4);
      api.say(x.frage === 'wo'
        ? `Hier passt <b>Wo?</b> Nichts kommt an einen neuen Platz, es bleibt, wo es ist. Dann steht der <b>Dativ</b>: <b>${x.artikel}</b>.`
        : `Hier passt <b>Wohin?</b> Etwas kommt an einen neuen Platz. Dann steht der <b>Akkusativ</b>: <b>${x.artikel}</b>.`);
      if (x.frage !== 'wo') { flug(0); await api.tw(900, flug); }
      await api.wait(3800);
      api.say(x.merk);
    },
    // Präposition und Fall (seit v122): zwei Körbe, die gefragte Präposition leuchtet in ihrem Korb.
    //   x: { w (Präposition), f:'D'|'A', bsp, merk }
    async prfall(api, x) {
      const KORB = { D: ['aus', 'bei', 'mit', 'nach', 'seit', 'von', 'zu'], A: ['durch', 'für', 'gegen', 'ohne', 'um'] };
      if (!KORB[x.f].includes(x.w)) KORB[x.f].push(x.w);
      const t = zeile(api, x.bsp.split(' '), 32, true, false); t.ts[0].setAttribute('fill', ORANGE);
      const chips = {};
      const korb = (x0, f, titel, art) => {
        const g = el('g', { opacity: 0 }, api.svg);
        const r = el('rect', { x: x0, y: 50, width: 162, height: 104, rx: 12, fill: '#fff', stroke: 'var(--soft)', 'stroke-width': 1.5 }, g);
        el('text', { x: x0 + 81, y: 68, 'text-anchor': 'middle', class: 'ex-s', text: titel, style: 'font-size:13px;font-weight:800' }, g);
        el('text', { x: x0 + 81, y: 82, 'text-anchor': 'middle', class: 'ex-s f6', text: art, style: 'font-size:10.5px' }, g);
        let cx = x0 + 8, cy = 90;
        KORB[f].forEach((w) => { const br = w.length * 7 + 14; if (cx + br > x0 + 156) { cx = x0 + 8; cy += 21; } const c = el('rect', { x: cx, y: cy, width: br, height: 17, rx: 8.5, fill: 'var(--tint)', stroke: 'none', 'stroke-width': 2 }, g); const ct = el('text', { x: cx + br / 2, y: cy + 12.5, 'text-anchor': 'middle', class: 'ex-s', text: w, style: 'font-size:11.5px;font-weight:700' }, g); if (f === x.f && w === x.w) chips.ziel = { c, ct }; cx += br + 4; });
        return { g, r };
      };
      const d = korb(12, 'D', 'immer Dativ', 'dem · der · dem · den'), a = korb(186, 'A', 'immer Akkusativ', 'den · die · das · die');
      await api.wait(500);
      api.say(`Nach <b>${x.w}</b> steht immer derselbe Fall. Diese Präpositionen sortiert man in zwei Körbe.`);
      await api.tw(500, (k) => [d.g, a.g].forEach((g) => g.setAttribute('opacity', k)));
      await api.wait(3000);
      const ja = x.f === 'D' ? d : a, nein = x.f === 'D' ? a : d;
      chips.ziel.c.setAttribute('fill', ORANGE); chips.ziel.ct.setAttribute('style', 'font-size:11.5px;font-weight:800;fill:#fff');
      ja.r.setAttribute('stroke', 'var(--ok)'); ja.r.setAttribute('stroke-width', 2.5); nein.g.setAttribute('opacity', 0.4);
      if (t.ts[1]) t.ts[1].setAttribute('fill', BLAU);
      api.say(`<b>${x.w}</b> liegt im Korb „immer ${x.f === 'D' ? 'Dativ' : 'Akkusativ'}“, zusammen mit ${KORB[x.f].filter((w) => w !== x.w).join(', ')}. Am besten lernst du jeden Korb als Reihe auswendig.`);
      await api.wait(4200);
      api.say(x.merk);
    },
    // Konjugationstafel (seit v123): alle Personen, Stamm dunkel und Endung orange, die gefragte Zeile leuchtet.
    //   x: { inf, stamm, pers:[6], formen:[6], p, merk }
    async konjtafel(api, x) {
      const END = [['e'], ['est', 'st', 't'], ['et', 't'], ['en', 'n'], ['et', 't'], ['en', 'n']];
      const teil = (f, k) => { // Stamm und Endung trennen; bei Vokalwechsel passt der Stamm der Grundform nicht
        if (f.startsWith(x.stamm) && f.length > x.stamm.length) return [x.stamm, f.slice(x.stamm.length), false];
        if (f === x.stamm) return [f, '', false];
        const zisch = /[sßzx]$/.test(x.stamm), e = (k === 1 && zisch ? ['t'] : END[k]).find((q) => f.endsWith(q) && f.length > q.length) || '';
        return [f.slice(0, f.length - e.length), e, true];
      };
      el('text', { x: 180, y: 24, 'text-anchor': 'middle', class: 'ex-b', text: x.inf, style: 'font-size:17px' }, api.svg);
      el('line', { x1: 180, y1: 38, x2: 180, y2: 128, class: 'dash' }, api.svg);
      const zeilen = x.formen.map((f, k) => {
        const [st, en, anders] = teil(f, k), sp = k < 3 ? 0 : 1, y = 58 + (k % 3) * 30, x0 = 14 + sp * 178;
        const g = el('g', { opacity: 0 }, api.svg);
        const r = el('rect', { x: x0 - 4, y: y - 18, width: 162, height: 26, rx: 8, fill: 'none', stroke: 'none', 'stroke-width': 2.5 }, g);
        el('text', { x: x0 + 2, y, class: 'ex-s', text: x.pers[k], style: 'font-size:12px' }, g);
        const t = el('text', { x: x0 + 70, y, class: 'ex-b', style: 'font-size:17px' }, g);
        el('tspan', { text: st, fill: anders ? BLAU : 'var(--ink)' }, t); el('tspan', { text: en, fill: ORANGE }, t);
        return { g, r, st, en, anders };
      });
      api.say(`Die Grundform <b>${x.inf}</b> besteht aus dem Stamm <b>${x.stamm}</b> und der Endung. Für jede Person hängt eine andere Endung am Stamm.`);
      for (const z of zeilen) await api.tw(260, (k) => z.g.setAttribute('opacity', k));
      await api.wait(3200);
      const anders = zeilen.some((z) => z.anders);
      api.say(`Die Endungen (orange) sind bei fast allen Verben gleich: <b>-e, -st, -t, -en, -t, -en</b>.${anders ? ' Achtung, hier ändert sich bei „du“ und „er/sie/es“ auch der Stamm (blau).' : ''}`);
      await api.wait(4000);
      const z = zeilen[x.p]; z.r.setAttribute('stroke', 'var(--ok)'); z.r.setAttribute('fill', '#f1fbf6');
      zeilen.forEach((q, k) => { if (k !== x.p) q.g.setAttribute('opacity', 0.45); });
      api.say(`Gesucht: <b>${x.pers[x.p]} ${x.formen[x.p]}</b>${z.en ? `, Endung <b>-${z.en}</b>` : ''}.`);
      await api.wait(3000);
      api.say(x.merk);
    },
    // Wort-Bausteine (seit v123): Die Teile stehen erst einzeln mit Pluszeichen da, dann rücken sie zu einem Wort zusammen.
    //   x: { oben?, teile:[{ allein, im, label, farbe? }], s1, s2, merk }
    async bauteile(api, x) {
      if (x.oben) el('text', { x: 180, y: 22, 'text-anchor': 'middle', class: 'ex-s f6', text: x.oben, style: 'font-size:13px' }, api.svg);
      const B = 12.5, br = (t) => Math.max(34, t.length * B + 18);
      const weit = x.teile.map((t) => br(t.allein.length >= t.im.length ? t.allein : t.im)), luecke = 30;
      const ges = (lk) => weit.reduce((a, b) => a + b, 0) + lk * (x.teile.length - 1);
      const f = Math.min(1, 336 / ges(luecke)); // sehr lange Wörter: alles etwas kleiner
      const g0 = el('g', { transform: `translate(${180 * (1 - f)} ${58 * (1 - f)}) scale(${f})` }, api.svg);
      const xs = (lk) => { let px = 180 - ges(lk) / 2; return weit.map((w) => { const r = px; px += w + lk; return r; }); };
      const a0 = xs(luecke), a1 = xs(0);
      const bl = x.teile.map((t, k) => {
        const g = el('g', { opacity: 0, transform: `translate(${a0[k]} 0)` }, g0);
        const r = el('rect', { x: 0, y: 38, width: weit[k], height: 40, rx: 9, fill: t.farbe ? '#fff1ea' : '#fff', stroke: t.farbe ? ORANGE : 'var(--ink)', 'stroke-width': 2.5 }, g);
        const tx = el('text', { x: weit[k] / 2, y: 65, 'text-anchor': 'middle', class: 'ex-b', text: t.allein, style: 'font-size:21px' }, g);
        el('text', { x: weit[k] / 2, y: 96 + (k % 2) * 15, 'text-anchor': 'middle', class: 'ex-s', text: t.label, style: `font-size:11.5px;font-weight:700;fill:${t.farbe ? ORANGE : 'var(--ink)'}` }, g);
        return { g, r, tx };
      });
      const plus = a0.slice(1).map((px) => el('text', { x: px - luecke / 2, y: 65, 'text-anchor': 'middle', class: 'ex-b', text: '+', opacity: 0, style: 'font-size:20px' }, g0));
      for (const b of bl) await api.tw(300, (k) => b.g.setAttribute('opacity', k));
      await api.tw(300, (k) => plus.forEach((e) => e.setAttribute('opacity', k)));
      api.say(x.s1); await api.wait(3600);
      await api.tw(300, (k) => plus.forEach((e) => e.setAttribute('opacity', 1 - k)));
      await api.tw(800, (k) => bl.forEach((b, i) => b.g.setAttribute('transform', `translate(${lerp(a0[i], a1[i], k)} 0)`)));
      let gewechselt = false;
      bl.forEach((b, i) => {
        const t = x.teile[i], alt = t.allein.replace(/^-|-$/g, '');
        b.tx.textContent = '';
        [...t.im].forEach((c, n) => { const neu = alt[n] !== c; if (neu) gewechselt = true; el('tspan', { text: c, fill: neu ? BLAU : 'var(--ink)' }, b.tx); });
      });
      const kurz = x.teile.find((t) => { const alt = t.allein.replace(/^-|-$/g, ''); return alt.length > t.im.length && alt.toLowerCase().startsWith(t.im.toLowerCase()); });
      api.say(x.s2 + (kurz ? ` Von „${kurz.allein}“ bleibt nur der Stamm „${kurz.im.toLowerCase()}“.` : '') + (gewechselt ? ' Achte auf den blauen Buchstaben: Groß und klein richten sich nach dem neuen Wort.' : '')); await api.wait(4200);
      api.say(x.merk);
    },
    // Attribut (seit v123): Pfeil vom Attribut zu seinem Nomen, dann die Weglassprobe (das Attribut verblasst, der Satz bleibt richtig).
    //   x: { tokens, attr:[Stellen], merk }  Das Nomen steht direkt hinter dem Attribut.
    async attribut(api, x) {
      const z = zeile(api, x.tokens, 80, true, true);
      const ort = (i) => { try { const e = z.ts[i], a = /^\s/.test(e.textContent) ? 1 : 0, p1 = e.getStartPositionOfChar(a), p2 = e.getEndPositionOfChar(e.getNumberOfChars() - 1); return { x1: p1.x, x2: p2.x, y: p1.y }; } catch (e) { return { x1: 100 + i * 40, x2: 136 + i * 40, y: 80 }; } };
      const sauber = (i) => x.tokens[i].replace(/[.,!?]$/, '');
      await api.wait(500);
      for (const a of x.attr) {
        z.ts[a].setAttribute('fill', ORANGE); z.ts[a + 1].setAttribute('fill', BLAU);
        const o1 = ort(a), o2 = ort(a + 1);
        if (Math.abs(o1.y - o2.y) < 2) { // Bogen nur, wenn beide in derselben Zeile stehen
          const u = z.br > 0 && o1.y > 80 ? -1 : 1; // zweite Zeile: Bogen unter den Wörtern, sonst läge er auf der ersten Zeile
          const m1 = (o1.x1 + o1.x2) / 2, m2 = (o2.x1 + o2.x2) / 2, yb = u > 0 ? o1.y - 17 : o1.y + 7;
          el('path', { d: `M ${m1} ${yb} Q ${(m1 + m2) / 2} ${yb - 18 * u} ${m2} ${yb}`, fill: 'none', stroke: ORANGE, 'stroke-width': 2.5, 'stroke-linecap': 'round' }, api.svg);
          el('path', { d: `M ${m2} ${yb + u} l -9 ${-3 * u} l 6 ${-6 * u} z`, fill: ORANGE }, api.svg);
        }
        api.say(`<b>${sauber(a)}</b> steht direkt vor dem Nomen <b>${sauber(a + 1)}</b> und beschreibt es genauer: Es sagt, welche Eigenschaft gemeint ist.`);
        await api.wait(3600);
      }
      await api.tw(600, (k) => x.attr.forEach((a) => z.ts[a].setAttribute('fill-opacity', 1 - 0.8 * k)));
      const ohne = x.tokens.filter((w, i) => !x.attr.includes(i)).join(' ');
      api.say(`<b>Weglassprobe:</b> Ohne ${x.attr.length > 1 ? 'die Attribute' : 'das Attribut'} bleibt der Satz richtig: „${ohne}“ Er ist nur weniger genau.`);
      await api.wait(4200);
      await api.tw(400, (k) => x.attr.forEach((a) => z.ts[a].setAttribute('fill-opacity', 0.2 + 0.8 * k)));
      api.say(x.merk);
    },
    // Adverb und seine Frage (seit v123): vier Fragen-Felder mit Beispielen, das Adverb wandert in sein Feld.
    //   x: { tokens, i, wort, f:'wann'|'wo'|'wie'|'warum', fragen:{…}, beispiele:{…}, merk }
    async advfrage(api, x) {
      const z = zeile(api, x.tokens, 30, true, false);
      z.ts[x.i].setAttribute('fill', ORANGE);
      const keys = Object.keys(x.fragen);
      const felder = keys.map((k, n) => {
        const g = el('g', { opacity: 0 }, api.svg), x0 = 10 + (n % 2) * 174, y0 = 48 + Math.floor(n / 2) * 52;
        const r = el('rect', { x: x0, y: y0, width: 166, height: 46, rx: 10, fill: '#fff', stroke: 'var(--soft)', 'stroke-width': 1.5 }, g);
        el('text', { x: x0 + 10, y: y0 + 19, class: 'ex-b', text: x.fragen[k], style: 'font-size:15px' }, g);
        const bsp = x.beispiele[k].filter((w) => w !== x.wort.toLowerCase()).slice(0, 3).join(', ');
        el('text', { x: x0 + 10, y: y0 + 36, class: 'ex-s f6', text: bsp, style: 'font-size:11.5px' }, g);
        return { g, r, x0, y0 };
      });
      await api.wait(400);
      api.say('Adverbien sagen genauer, wie etwas geschieht. Jedes antwortet auf eine von <b>vier Fragen</b>.');
      await api.tw(500, (k) => felder.forEach((f) => f.g.setAttribute('opacity', k)));
      await api.wait(3000);
      const n = keys.indexOf(x.f), ziel = felder[n];
      const karte = el('text', { x: 180, y: 30, 'text-anchor': 'middle', class: 'ex-b', text: x.wort.toLowerCase(), style: `font-size:15px;fill:${ORANGE}`, opacity: 0 }, api.svg);
      let sx = 180; try { const e = z.ts[x.i]; sx = (e.getStartPositionOfChar(0).x + e.getEndPositionOfChar(e.getNumberOfChars() - 1).x) / 2; } catch (e) {}
      karte.setAttribute('opacity', 1);
      await api.tw(800, (k) => { karte.setAttribute('x', lerp(sx, ziel.x0 + 124, k)); karte.setAttribute('y', lerp(30, ziel.y0 + 20, k)); });
      ziel.r.setAttribute('stroke', 'var(--ok)'); ziel.r.setAttribute('stroke-width', 2.5); ziel.r.setAttribute('fill', '#f1fbf6');
      felder.forEach((f, k) => { if (k !== n) f.g.setAttribute('opacity', 0.4); });
      api.say(`Frag mit dem Satz nach: <b>${x.fragen[x.f]}</b> Antwort: <b>${x.wort.toLowerCase()}</b>. Adverbien bekommen nie eine Endung.`);
      await api.wait(3800);
      api.say(x.merk);
    },
    // ein Bild (SVG-Text aus der Aufgabe) in die Mitte, dann die Erklärung
    async bild(api, x) {
      const g = el('g', { opacity: 0 }, api.svg);
      g.innerHTML = x.svg.replace(/^<svg([^>]*)>/, (m, a) => `<svg${a.replace(/ (width|height|style|preserveAspectRatio)="[^"]*"/g, '')} x="76" y="4" width="208" height="117" preserveAspectRatio="xMidYMid slice">`);
      el('rect', { x: 76, y: 4, width: 208, height: 117, rx: 6, fill: 'none', stroke: 'var(--ink)', 'stroke-width': 2.5 }, api.svg);
      await api.tw(500, (t) => g.setAttribute('opacity', t));
      api.say(x.s1); await api.wait(2400);
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
      const ks = {}, tt = [];
      x.tokens.forEach((w, i) => {
        const e = el('tspan', { text: (i && i !== br ? sep : '') + w }, t); tt.push(e);
        if (i === br) { e.setAttribute('x', 180); e.setAttribute('dy', 26); }
        if (x.gaps.includes(i)) ks[i] = el('tspan', { text: mark, fill: ORANGE, 'fill-opacity': 0 }, t);
      });
      if (br > 0) t.setAttribute('y', 53);
      if (!x.dicht) fit(t, 336, 19); else { try { for (let fs = 26; fs >= 12 && t.getBBox().width > 336; fs--) t.setAttribute('style', `font-size:${fs}px`); } catch (e) {} }
      const fertig = () => api.say(x.merk || `<b>${x.tokens.map((w, i) => w + (x.gaps.includes(i) ? ',' : '')).join(' ')}</b>`);
      const kommas = async () => { for (const i of x.gaps) { await api.tw(350, (k) => ks[i].setAttribute('fill-opacity', k)); await api.wait(700); } };
      if (!x.bild) { api.say(x.s1); await api.wait(x.dicht ? 2200 : 3200); await kommas(); return fertig(); }
      // ---- mit Bild (seit v121): erst den Satzbau zeigen, dann erscheinen die Kommas an den Nahtstellen
      const b = x.bild, GRUEN = '#0f8a5f';
      const wort = (i) => x.tokens[i].replace(/[.,!?]$/, ''), worte = ([a, z]) => x.tokens.slice(a, z + 1).map((w) => w.replace(/[.,!?]$/, '')).join(' ');
      const ort = (i) => { try { const e = tt[i], a = /^\s/.test(e.textContent) ? 1 : 0, p1 = e.getStartPositionOfChar(a), p2 = e.getEndPositionOfChar(e.getNumberOfChars() - 1); return { x1: p1.x, x2: p2.x, y: p1.y }; } catch (e) { return { x1: 20 + i * 30, x2: 44 + i * 30, y: 66 }; } };
      const farbe = (von, bis, f) => { for (let i = von; i <= bis; i++) tt[i].setAttribute('fill', f); };
      const strich = async ([von, bis], f) => { // Unterstreichung über einen Wortbereich, auch über zwei Zeilen
        const zeilen = {}; for (let i = von; i <= bis; i++) { const o = ort(i); (zeilen[o.y] = zeilen[o.y] || []).push(o); }
        const ls = Object.keys(zeilen).map((y) => el('line', { x1: Math.min(...zeilen[y].map((o) => o.x1)), y1: +y + 7, x2: Math.min(...zeilen[y].map((o) => o.x1)), y2: +y + 7, stroke: f, 'stroke-width': 3.5, 'stroke-linecap': 'round', 'data-x2': Math.max(...zeilen[y].map((o) => o.x2)) }, api.svg));
        await api.tw(500, (k) => ls.forEach((l) => l.setAttribute('x2', lerp(+l.getAttribute('x1'), +l.getAttribute('data-x2'), k))));
      };
      const unten = (br > 0 ? 79 : 66) + 34; let lx = 0;
      const legende = (f, text) => { if (!lx) lx = 78; el('line', { x1: lx, y1: unten - 4, x2: lx + 18, y2: unten - 4, stroke: f, 'stroke-width': 3.5, 'stroke-linecap': 'round' }, api.svg); el('text', { x: lx + 24, y: unten, class: 'ex-s', text, style: 'font-size:12px;font-weight:700' }, api.svg); lx += 104; };
      await api.wait(500);
      if (b.typ === 'aufz') {
        api.say(`Hier wird etwas <b>aufgezählt</b>. Suche die Teile der Aufzählung.`); await api.wait(2200);
        for (const tl of b.teile) { farbe(tl[0], tl[1], BLAU); await strich(tl, BLAU); await api.wait(450); }
        api.say(`Die Aufzählung hat <b>${b.teile.length} Teile</b>: ${b.teile.map(worte).join(' · ')}.`); await api.wait(3000);
        await kommas();
        api.say('Zwischen den Teilen steht ein <b>Komma</b>.'); await api.wait(2400);
        tt[b.und].setAttribute('fill', ORANGE);
        api.say('Vor <b>und</b> steht keins: Das „und“ verbindet die letzten beiden Teile schon.'); await api.wait(3400);
      } else if (b.typ === 'gef') {
        api.say('Suche zuerst die <b>beiden Verben</b>. Zwei Verben mit Personalform: Das sind zwei Sätze in einem.'); await api.wait(1400);
        tt[b.hsVerb].setAttribute('fill', BLAU); tt[b.nsVerb].setAttribute('fill', ORANGE); await api.wait(3000);
        tt[b.einleit].setAttribute('fill', ORANGE); await strich(b.ns, ORANGE); legende(BLAU, 'Hauptsatz'); legende(ORANGE, 'Nebensatz');
        api.say(`Das Einleitewort <b>${wort(b.einleit).toLowerCase()}</b> beginnt den <b>Nebensatz</b>. Sein Verb „${wort(b.nsVerb)}“ steht ganz am Ende.`); await api.wait(3800);
        await strich(b.hs, BLAU);
        api.say(b.nsVorn ? `Der Rest ist der <b>Hauptsatz</b>. Weil der Nebensatz vorn steht, beginnt er gleich mit dem Verb „${wort(b.hsVerb)}“.` : `Der Rest ist der <b>Hauptsatz</b>. Sein Verb „${wort(b.hsVerb)}“ steht an 2. Stelle.`); await api.wait(3600);
        await kommas();
        api.say('Wo Hauptsatz und Nebensatz aneinanderstoßen, steht das <b>Komma</b>.'); await api.wait(3200);
      } else if (b.typ === 'reihe') {
        api.say('Suche die beiden Teile des Satzes.'); await api.wait(1200);
        await strich(b.s1, BLAU); await strich([b.bind + 1, b.s2[1]], GRUEN); legende(BLAU, '1. Hauptsatz'); legende(GRUEN, '2. Hauptsatz');
        api.say(`Das sind <b>zwei Hauptsätze</b>. Jeder könnte allein stehen: „${worte(b.s1)}.“ und „${worte([b.bind + 1, b.s2[1]]).replace(/^./, (c) => c.toUpperCase())}.“`); await api.wait(4200);
        tt[b.bind].setAttribute('fill', ORANGE);
        api.say(`Das Bindewort <b>${wort(b.bind)}</b> verbindet sie zu einer Satzreihe.`); await api.wait(2600);
        await kommas();
        api.say(`Vor <b>${wort(b.bind)}</b> steht das <b>Komma</b>: Dort endet der erste Hauptsatz.`); await api.wait(3200);
      } else if (b.typ === 'appo') {
        farbe(b.von, b.bis, ORANGE); await strich([b.von, b.bis], ORANGE);
        api.say(`„${worte([b.von, b.bis])}“ erklärt das Nomen davor genauer: „${wort(b.von - 1)}“. So ein Einschub heißt <b>Beisatz</b> (Apposition).`); await api.wait(4000);
        await kommas();
        api.say(x.gaps.length > 1 ? 'Der Beisatz wird <b>vorn und hinten</b> mit einem Komma abgetrennt.' : 'Der Beisatz wird mit einem <b>Komma</b> abgetrennt. Am Satzende ersetzt der Punkt das zweite Komma.'); await api.wait(3200);
        await api.tw(500, (k) => { for (let i = b.von; i <= b.bis; i++) tt[i].setAttribute('fill-opacity', 1 - 0.75 * k); });
        const ohne = x.tokens.filter((w, i) => i < b.von || i > b.bis).map((w) => w.replace(/[.,!?]$/, '')).join(' ');
        api.say(`Probe: Lass den Beisatz weg. Es bleibt ein ganzer Satz: <b>${ohne}.</b>`); await api.wait(4200);
        await api.tw(400, (k) => { for (let i = b.von; i <= b.bis; i++) tt[i].setAttribute('fill-opacity', 0.25 + 0.75 * k); });
      }
      fertig();
    },
    // Silbenbögen (seit v121): unter jeder Silbe ein Bogen, in jeder Silbe leuchtet der Vokal (ein Klang je Silbe)
    //   x: { wort, teile:[Silben], merk }
    async silben(api, x) {
      const t = el('text', { x: 180, y: 56, 'text-anchor': 'middle', class: 'ex-b', text: x.wort, style: 'font-size:30px;letter-spacing:2px' }, api.svg);
      try { for (let fs = 30; fs >= 14 && t.getBBox().width > 330; fs--) t.setAttribute('style', `font-size:${fs}px;letter-spacing:2px`); } catch (e) {}
      const pos = (a, z) => { try { return [t.getStartPositionOfChar(a).x, t.getEndPositionOfChar(z - 1).x]; } catch (e) { return [120 + a * 16, 120 + z * 16]; } };
      api.say('Sprich das Wort langsam und <b>klatsche</b> zu jeder Silbe. Jeder Bogen ist ein Klatscher.'); await api.wait(2600);
      let a = 0; const kerne = [];
      for (let i = 0; i < x.teile.length; i++) {
        const s = x.teile[i], z = a + s.length, [x1, x2] = pos(a, z);
        const bogen = el('path', { d: `M ${x1 + 1} 66 Q ${(x1 + x2) / 2} ${66 + Math.min(22, 8 + (x2 - x1) / 4)} ${x2 - 3} 66`, fill: 'none', stroke: BLAU, 'stroke-width': 3, 'stroke-linecap': 'round', opacity: 0 }, api.svg);
        const nr = el('text', { x: (x1 + x2) / 2, y: 104, 'text-anchor': 'middle', class: 'ex-s', text: i + 1, style: 'font-weight:800', opacity: 0 }, api.svg);
        const m = s.match(/ie|au|ei|eu|äu|aa|ee|oo|[aeiouäöüy]/i);
        if (m) { const [k1, k2] = pos(a + m.index, a + m.index + m[0].length); kerne.push(el('line', { x1: k1 + 1, y1: 26, x2: k2 - 3, y2: 26, stroke: ORANGE, 'stroke-width': 4, 'stroke-linecap': 'round', opacity: 0 }, api.svg)); }
        await api.tw(380, (k) => { bogen.setAttribute('opacity', k); nr.setAttribute('opacity', k); });
        await api.wait(650); a = z;
      }
      api.say(`<b>${x.teile.join('-')}</b>: ${x.teile.length} ${x.teile.length === 1 ? 'Silbe' : 'Silben'}. ${x.teile.length > 1 ? 'Getrennt wird dort, wo zwei Bögen aneinanderstoßen.' : 'Einsilbige Wörter trennt man nicht.'}`); await api.wait(3200);
      await api.tw(500, (k) => kerne.forEach((l) => l.setAttribute('opacity', k)));
      api.say('In jeder Silbe steckt <b>genau ein Vokal-Klang</b> (orange): ein Vokal, ein Umlaut oder ein Zwielaut wie au, ei, ie. So kannst du die Silben auch zählen.'); await api.wait(4200);
      api.say(x.merk);
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
  // Bausteine mit eigener Bildhöhe (sonst gilt die Höhe des Themas)
  const HOEHE = { weiche: (x) => 122 + 68 * (x.fragen.length - 1), laden: 208, artikelprobe: 124, rede: 112, verbplatz: 190, wowohin: 162, prfall: 162, konjtafel: 138, bauteile: 124, attribut: 132, advfrage: 158 };
  // quelle: Thema, aus dem die Beispiele kommen, wenn die Erklärung kein eigenes Thema ist (über ex.via erreichbar)
  function thema(id, title, viewBox, quelle) {
    EX[id] = {
      title, viewBox,
      create(api, ctx) {
        ctx = ctx || {};
        const task = !!ctx.mode && (ctx.pre || ctx.post);
        const arten = D.arten[quelle || id], zufall = () => arten[U.pick(Object.keys(arten))]().ex;
        const eine = (art) => (arten[art] || Object.values(D.arten).map((a) => a[art]).find(Boolean))().ex;
        let x = task ? (ctx.post ? ctx : eine(ctx.art)) : zufall();
        if (!task) api.chips([{ label: 'Anderes Beispiel', onClick() { x = zufall(); api.replay(); } }]);
        return {
          reset() { api.clear(); const h = HOEHE[x.mode]; api.svg.setAttribute('viewBox', h ? `0 0 360 ${typeof h === 'function' ? h(x) : h}` : viewBox); api.sub(!task ? '' : ctx.post ? 'Lösung zu deiner Aufgabe' : 'Ein ähnliches Beispiel – deine Aufgabe löst du danach selbst'); },
          play() { return BILD[x.mode](api, x); },
        };
      },
    };
  }
  thema('d5-artikelprobe', 'Die Artikelprobe', '0 0 360 124', 'd5-gross');
  thema('d5-pronomen', 'Pronomen: kleine Wörter für große', '0 0 360 150');
  thema('d5-adjektive', 'Adjektive steigern', '0 0 360 180');
  thema('d5-praep', 'Präpositionen: wie Dinge zueinander stehen', '0 0 360 150');
  thema('d5-adverb', 'Adverbien: wann, wo, wie, warum', '0 0 360 120');
  thema('d5-konj', 'Konjunktionen: Bindewörter', '0 0 360 120');
  thema('d5-verbformen', 'Verbformen: ein Verb, viele Formen', '0 0 360 150');
  thema('d5-wortarten', 'Wortarten erkennen', '0 0 360 156');
  thema('d5-satzglieder', 'Satzglieder: der Satz als Zug', '0 0 360 100');
  thema('d5-subjekt', 'Subjekt und Prädikat', '0 0 360 150');
  thema('d5-adverbial', 'Adverbiale Bestimmungen', '0 0 360 100');
  thema('d5-objekte', 'Objekte: Wem? Wen oder was?', '0 0 360 100');
  thema('d5-attribute', 'Attribute: genauer beschreiben', '0 0 360 120');
  thema('d5-nebensatz', 'Hauptsatz und Nebensatz', '0 0 360 150');
  thema('d5-satzreihe', 'Satzreihe: zwei Hauptsätze', '0 0 360 124');
  thema('d5-satzarten', 'Satzarten', '0 0 360 120');
  thema('d5-komma', 'Das Komma', '0 0 360 124');
  thema('d5-rede', 'Wörtliche Rede', '0 0 360 120');
  thema('d5-lang', 'Lange Vokale: vier Schubladen', '0 0 360 208');
  thema('d5-kurz', 'Kurz oder lang? Doppelt oder einfach?', '0 0 360 190');
  thema('d5-ableiten', 'Verlängern und Ableiten', '0 0 360 150');
  thema('d5-slaute', 's, ss oder ß?', '0 0 360 190');
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
  thema('d5-theater', 'Theaterszenen', '0 0 360 150');
  thema('d5-kamera', 'Film: Einstellungsgrößen und Perspektiven', '0 0 360 125');
  thema('d5-sachtext', 'Sachtexte und Schaubilder lesen', '0 0 360 150');
  // Aufgabenarten, deren Animation nur den Satz aus der Aufgabe mit markierter Lösung wiederholt (Durchsicht 21.11.2026, v120):
  // nach der Aufgabe kein Knopf „Lösung als Animation“; Antwort und Warum stehen schon unter „So geht’s“.
  // Geblieben sind Animationen, die etwas zeigen: Fälle, Steigern, Satzglieder, Zeitformen, Reim, Schaubild und die Ausnahmen unten.
  const WIEDERHOLT = { marken: 1, liste: 1, komma: 1, zz: 1, bild: 1, satz: 1, wa: 1 };
  const ZEIGT_ETWAS = { 'd5-gedicht|marken': 1, 'd5-wortfamilie|liste': 1, 'd5-nebensatz|zz': 1, 'd5-zusammen|zz': 1, 'd5-ableiten|zz': 1, 'd5-subjekt|zz': 1, 'd5-pronomen|zz': 1 };
  // Komma-Aufgaben mit Satzbau-Bild (ex.bild, seit v121) behalten den Knopf
  D.ohneAnimation = (themaId, ex) => !!WIEDERHOLT[ex.mode] && !ex.bild && !ZEIGT_ETWAS[themaId + '|' + ex.mode];
})();
