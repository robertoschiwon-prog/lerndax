/* EnDax (Englisch) – Erklär-Animationen Klasse 5
 *
 * Aufbau wie in MaDax und DeDax: { title, titleFor?(ctx), viewBox, create(api, ctx) → { reset(), play() } }
 *   ctx: das ex-Objekt der Aufgabe plus pre:true (ähnliches Beispiel) oder post:true (genau die Aufgabe);
 *        leer, wenn die Erklärung ohne Aufgabe geöffnet wird.
 */
(function () {
  const D = (window.EnDax = window.EnDax || {});
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
  const BLAU = '#1f55d6';

  // =====================================================
  // to be: drei Fächer – am, is, are
  // =====================================================
  //   ctx: { mode:'form'|'kurz'|'lang', subj, g, form, rest, pron, de }, dazu pre/post
  const FACH = [
    { x: 14, wer: 'I', form: 'am' },
    { x: 126, wer: 'he · she · it', form: 'is' },
    { x: 238, wer: 'you · we · they', form: 'are' },
  ];
  const FW = 108, FY = 112, FH = 84;

  EX['e5-be'] = {
    title: 'to be: am, is, are',
    titleFor: (ctx) => (ctx && ctx.mode === 'kurz' ? 'Kurzform: so geht’s' : ctx && ctx.mode === 'lang' ? 'Langform: so geht’s' : ctx && ctx.form ? `Warum „${ctx.form}“?` : 'to be: am, is, are'),
    viewBox: '0 0 360 210',
    create(api, ctx) {
      ctx = ctx || {};
      const task = !!ctx.form;
      let S0 = null, satzEl = null, kaesten = [], frei = null;
      const andere = (liste) => U.pick(liste.filter((s) => s.subj !== ctx.subj || s.rest !== ctx.rest));
      if (task && ctx.post) S0 = ctx;
      if (task && ctx.pre) { // ähnliches Beispiel: gleiche Gruppe, anderer Satz
        const pool = (ctx.mode === 'form' ? T.BE : T.PRONS).filter((s) => s.g === ctx.g);
        S0 = Object.assign({}, andere(pool), { mode: ctx.mode });
      }
      const neuFrei = () => { frei = [0, 1, 2].map((g) => U.pick(T.BE.filter((s) => s.g === g && !s.pron))); };
      if (!task) { neuFrei(); api.chips([{ label: 'Andere Beispiele', onClick() { neuFrei(); api.replay(); } }]); }

      // Satz oben: teile = [[Text, Art]], Art: 'wer' (Subjekt), 'form' (blau), '' (normal)
      function zeigeSatz(teile, wer) {
        if (satzEl) satzEl.remove();
        satzEl = el('text', { x: 180, y: 44, 'text-anchor': 'middle', class: 'ex-b' }, api.svg);
        teile.forEach(([t, art]) => {
          const ts = el('tspan', { text: t }, satzEl);
          if (art === 'form') ts.setAttribute('style', `fill:${BLAU}`);
          if (art === 'wer' && wer) ts.setAttribute('style', 'fill:#c2410c');
        });
        try { for (let fs = 20; fs >= 11 && satzEl.getBBox().width > 336; fs--) satzEl.setAttribute('style', `font-size:${fs}px`); } catch (e) {}
      }
      const luecke = (s, wer) => zeigeSatz([[s.subj, 'wer'], [' ___ ' + s.rest + '.', '']], wer);
      const voll = (s, wer) => zeigeSatz([[s.subj, 'wer'], [' ', ''], [s.form, 'form'], [' ' + s.rest + '.', '']], wer);
      const kurz = (s, blau) => zeigeSatz([[T.KURZ[s.subj], blau ? 'form' : ''], [' ' + s.rest + '.', '']], false);

      function faecher() {
        kaesten = FACH.map((f) => {
          const r = el('rect', { x: f.x, y: FY, width: FW, height: FH, rx: 12, fill: '#fff', stroke: 'var(--ink)', 'stroke-width': 2 }, api.svg);
          el('text', { x: f.x + FW / 2, y: FY + 26, 'text-anchor': 'middle', class: 'ex-s', text: f.wer, style: 'font-size:13px' }, api.svg);
          el('line', { x1: f.x + 14, y1: FY + 38, x2: f.x + FW - 14, y2: FY + 38, stroke: '#cfc8ba', 'stroke-width': 2 }, api.svg);
          const t = el('text', { x: f.x + FW / 2, y: FY + 68, 'text-anchor': 'middle', class: 'ex-b', text: f.form, style: `fill:${BLAU};font-size:24px` }, api.svg);
          return { r, t };
        });
      }
      const leuchte = (g) => kaesten.forEach((k, i) => k.r.setAttribute('fill', i === g ? '#dfe9ff' : '#fff'));
      // die Form fliegt aus ihrem Fach hinauf in den Satz
      async function fliege(g) {
        const f = FACH[g];
        const m = el('text', { x: f.x + FW / 2, y: FY + 68, 'text-anchor': 'middle', class: 'ex-b', text: f.form, style: `fill:${BLAU};font-size:24px` }, api.svg);
        await api.tw(800, (t) => { m.setAttribute('x', lerp(f.x + FW / 2, 180, t)); m.setAttribute('y', lerp(FY + 68, 52, t)); m.setAttribute('opacity', 1 - t * 0.6); });
        m.remove();
      }
      const wer = (s) => (s.pron
        ? `<b>${s.subj}</b> ${s.g === 2 ? 'sind mehrere' : 'ist eine Person oder Sache'}. Dafür kannst du <b>${s.pron}</b> sagen.`
        : `Schau auf das erste Wort: <b>${s.subj}</b>.`);

      return {
        reset() {
          api.clear(); satzEl = null;
          api.sub(!task ? '' : ctx.post ? 'Lösung zu deiner Aufgabe' : 'Ein ähnliches Beispiel – deine Aufgabe löst du danach selbst');
          faecher();
          if (!task) zeigeSatz([['to be', 'form'], [' = sein', '']], false);
          else if (S0.mode === 'lang') kurz(S0, false);
          else luecke(S0, false);
        },
        async play() {
          if (task) {
            const s = S0, k = T.KURZ[s.subj], ganz = `${s.subj} ${s.form} ${s.rest}.`;
            if (s.mode === 'lang') {
              api.say(`Der Apostroph in <b>${k}</b> zeigt: Hier fehlt ein Buchstabe. Welche Form von to be steckt darin?`);
              await api.wait(2600);
              kurz(s, true);
            } else {
              api.say('Am, is oder are? Das entscheidet das Wort davor: <b>Wer</b> ist gemeint?');
              await api.wait(2200);
              luecke(s, true);
            }
            api.say(wer(s));
            await api.wait(s.pron ? 3000 : 1800);
            leuchte(s.g);
            api.say(T.GRUPPE_TEXT[s.g]);
            await api.wait(2400);
            await fliege(s.g);
            voll(s, true);
            if (s.mode === 'kurz') {
              api.say(`Lang: <b>${s.subj} ${s.form}</b> ${s.rest}.`);
              await api.wait(2000);
              kurz(s, true);
              api.say(`Kurzform: ${s.subj} ${s.form} → <b>${k}</b>. Das ${s.form[0]} von „${s.form}“ fällt weg, dafür steht der Apostroph. ${U.say(T.kurzText(s))}<br><small>${s.de}</small>`);
            } else if (s.mode === 'lang') {
              api.say(`${k} = <b>${s.subj} ${s.form}</b>. Der Apostroph steht für das ${s.form[0]} von „${s.form}“. ${U.say(ganz)}<br><small>${s.de}</small>`);
            } else {
              api.say(`Also: ${s.subj} <b>${s.form}</b> ${s.rest}. ${U.say(ganz)}<br><small>${s.de}</small>`);
            }
            return;
          }
          api.say('<b>to be</b> heißt <b>sein</b>. Im Deutschen gibt es viele Formen: bin, bist, ist, sind, seid. Im Englischen nur <b>drei</b>.');
          await api.wait(3200);
          for (const g of [0, 1, 2]) {
            const s = frei[g];
            leuchte(g);
            api.say(T.GRUPPE_TEXT[g]);
            luecke(s, true);
            await api.wait(2400);
            await fliege(g);
            voll(s, true);
            api.say(`${s.subj} <b>${s.form}</b> ${s.rest}. ${U.say(s.text)}<br><small>${s.de}</small>`);
            await api.wait(2800);
          }
          leuchte(-1);
          zeigeSatz([['I ', ''], ['am', 'form'], [' · she ', ''], ['is', 'form'], [' · we ', ''], ['are', 'form']], false);
          api.say('Merke dir die drei Fächer: <b>I am</b> · he, she, it <b>is</b> · you, we, they <b>are</b>. Ein Name oder ein Ding zählt wie he, she, it. Mehrere zählen wie they.');
        },
      };
    },
  };
})();
