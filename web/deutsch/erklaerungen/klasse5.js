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
})();
