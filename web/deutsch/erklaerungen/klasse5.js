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
})();
