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

  // Wörter nebeneinander als einzelne Textstücke (damit sie sich bewegen können), zusammen zentriert.
  //   teile: [{ t:'She', c:'#farbe'? }] → { g, els } (jedes el kennt _x)
  function zeile(api, teile, y, fs) {
    fs = fs || 20;
    const g = el('g', {}, api.svg);
    const els = teile.map((p) => el('text', { y, class: 'ex-b', text: p.t, style: `font-size:${fs}px;${p.c ? `fill:${p.c}` : ''}` }, g));
    const gap = fs * 0.3;
    let ws = [];
    try { ws = els.map((e) => e.getComputedTextLength()); } catch (e) { ws = teile.map((p) => p.t.length * fs * 0.55); }
    const total = ws.reduce((a, b) => a + b, 0) + gap * (els.length - 1);
    if (total > 336 && fs > 11) { g.remove(); return zeile(api, teile, y, fs - 1); }
    let x = 180 - total / 2;
    els.forEach((e, i) => { e.setAttribute('x', x); e._x = x; x += ws[i] + gap; });
    return { g, els, fs };
  }
  // von einer Zeile zur nächsten gleiten: paare = [[altes el, neues el]], neue Zeile wird danach sichtbar
  async function gleite(api, alt, neu, paare, ms) {
    neu.g.setAttribute('opacity', 0);
    await api.tw(ms || 800, (t) => paare.forEach(([a, b]) => a.setAttribute('x', lerp(a._x, b._x, t))));
    alt.g.remove(); neu.g.setAttribute('opacity', 1);
  }
  const ORANGE = '#c2410c';

  // =====================================================
  // Personalpronomen: sieben Kärtchen
  // =====================================================
  //   ctx: { mode:'satz', subj, art, be, rest, pron, de } | { mode:'wort', pron } | { mode:'ich', text }
  const KARTEN = [['I', 'ich', 1], ['You', 'du, ihr', 2], ['He', 'er', 1], ['She', 'sie', 1], ['It', 'es', 1], ['We', 'wir', 3], ['They', 'sie', 3]];
  EX['e5-pron'] = {
    title: 'I, you, he, she, it, we, they',
    titleFor: (ctx) => (ctx && ctx.mode === 'satz' ? `Warum „${ctx.pron.toLowerCase()}“?` : ctx && ctx.mode === 'ich' ? 'I schreibt man groß' : 'I, you, he, she, it, we, they'),
    viewBox: '0 0 360 210',
    create(api, ctx) {
      ctx = ctx || {};
      const mode = ctx.mode || 'frei';
      let S0 = null, Z = null, karten = {}, frei = [];
      if (mode === 'satz') S0 = ctx.post ? ctx : U.pick(T.PS.filter((s) => s.art === ctx.art && s.subj !== ctx.subj));
      const neuFrei = () => { frei = ['m', 'f', 'n', 'p', 'w'].map((a) => U.pick(T.PS.filter((s) => s.art === a))); };
      if (mode === 'frei') { neuFrei(); api.chips([{ label: 'Andere Beispiele', onClick() { neuFrei(); api.replay(); } }]); }
      const KW = 44, KX = 8, KY = 118, KH = 78;
      function kaertchen() {
        karten = {};
        KARTEN.forEach(([p, de, n], i) => {
          const x = KX + i * (KW + 6);
          const r = el('rect', { x, y: KY, width: KW, height: KH, rx: 9, fill: '#fff', stroke: 'var(--ink)', 'stroke-width': 2 }, api.svg);
          for (let k = 0; k < n; k++) el('circle', { cx: x + KW / 2 + (k - (n - 1) / 2) * 9, cy: KY + 14, r: 3.2, fill: 'var(--ink)' }, api.svg);
          el('text', { x: x + KW / 2, y: KY + 44, 'text-anchor': 'middle', class: 'ex-b', text: p === 'I' ? 'I' : p.toLowerCase(), style: `fill:${BLAU};font-size:17px` }, api.svg);
          el('text', { x: x + KW / 2, y: KY + 64, 'text-anchor': 'middle', class: 'ex-s', text: de, style: 'font-size:10.5px' }, api.svg);
          karten[p] = r;
        });
      }
      const leuchte = (p) => Object.keys(karten).forEach((k) => karten[k].setAttribute('fill', k === p ? '#dfe9ff' : '#fff'));
      const satz = (teile) => { if (Z) Z.g.remove(); Z = zeile(api, teile, 52); };
      async function zeigeSatz(s, pause) {
        satz([{ t: s.subj, c: ORANGE }, { t: s.be }, { t: s.rest + '.' }]);
        api.say(`Wer oder was ist <b>${s.subj}</b>? Das ${'mfn'.includes(s.art) ? 'ist' : 'sind'} ${T.PRON_ART[s.art]}.`);
        await api.wait(pause);
        leuchte(s.pron);
        api.say(`Dafür steht <b>${s.pron.toLowerCase()}</b>, auf Deutsch: ${T.PRON_WORT[s.pron]}.`);
        await api.wait(pause);
        satz([{ t: s.pron, c: BLAU }, { t: s.be }, { t: s.rest + '.' }]);
      }
      return {
        reset() {
          api.clear(); Z = null;
          api.sub(mode === 'frei' ? '' : ctx.post ? 'Lösung zu deiner Aufgabe' : mode === 'satz' ? 'Ein ähnliches Beispiel – deine Aufgabe löst du danach selbst' : '');
          kaertchen();
          if (mode === 'satz') satz([{ t: S0.subj }, { t: S0.be }, { t: S0.rest + '.' }]);
          else if (mode === 'ich') satz([{ t: ctx.text }]);
          else satz([{ t: 'Wer?', c: BLAU }]);
        },
        async play() {
          if (mode === 'satz') {
            const s = S0;
            api.say('Ein Pronomen steht <b>für</b> eine Person oder Sache, damit man den Namen nicht immer wiederholen muss.');
            await api.wait(2600);
            await zeigeSatz(s, 2400);
            api.say(`Also: <b>${s.pron}</b> ${s.be} ${s.rest}. ${U.say(s.neu)}<br><small>${s.de}</small>`);
            return;
          }
          if (mode === 'wort') {
            const p = ctx.pron;
            leuchte(p);
            satz([{ t: p === 'I' ? 'I' : p.toLowerCase(), c: BLAU }, { t: '=' }, { t: T.PRON_WORT[p] }]);
            api.say(`<b>${p === 'I' ? 'I' : p.toLowerCase()}</b> heißt auf Deutsch: ${T.PRON_WORT[p]}. Die Punkte zeigen: einer oder mehrere.${p === 'You' ? ' <b>you</b> heißt beides, du und ihr.' : ''}${p === 'I' ? ' <b>I</b> schreibt man immer groß.' : ''}`);
            return;
          }
          if (mode === 'ich') {
            leuchte('I');
            api.say('Alle Pronomen schreibt man klein, außer am Satzanfang. Nur eines nicht:');
            await api.wait(2400);
            const teile = ctx.text.split(/\bI\b/);
            satz([teile[0].trim() ? { t: teile[0].trim() } : null, { t: 'I', c: BLAU }, { t: teile[1].trim() }].filter(Boolean));
            api.say(`<b>I</b> (ich) schreibt man <b>immer groß</b>, auch mitten im Satz. ${U.say(ctx.text)}`);
            return;
          }
          api.say('Sieben kleine Wörter stehen für Personen und Sachen. Die Punkte zeigen: <b>einer</b> oder <b>mehrere</b>.');
          await api.wait(3000);
          for (const s of frei) {
            await zeigeSatz(s, 2000);
            api.say(`<b>${s.pron}</b> ${s.be} ${s.rest}. ${U.say(s.neu)}<br><small>${s.de}</small>`);
            await api.wait(2400);
          }
          leuchte('');
          satz([{ t: 'he · she · it', c: BLAU }, { t: '→ einer, eine, eins' }]);
          api.say('Merke: <b>he</b> für einen Jungen oder Mann, <b>she</b> für ein Mädchen oder eine Frau, <b>it</b> für eine Sache. <b>they</b> für mehrere, <b>we</b>, wenn du selbst dabei bist.');
        },
      };
    },
  };

  // =====================================================
  // to be: verneinen und fragen
  // =====================================================
  //   ctx: { mode:'neg'|'frage'|'kurz', subj, g, form, rest, pron, ja }
  EX['e5-be-neg'] = {
    title: 'to be: verneinen und fragen',
    titleFor: (ctx) => (ctx && ctx.mode === 'neg' ? 'Verneinen: so geht’s' : ctx && ctx.mode === 'frage' ? 'Fragen: so geht’s' : ctx && ctx.mode === 'kurz' ? 'Kurzantwort: so geht’s' : 'to be: verneinen und fragen'),
    viewBox: '0 0 360 210',
    create(api, ctx) {
      ctx = ctx || {};
      const mode = ctx.mode || 'frei';
      const voll = (s) => Object.assign({}, s, { pron: s.pron || s.subj.toLowerCase() });
      let S0 = null, frei = null;
      if (mode !== 'frei') {
        if (ctx.post) S0 = ctx;
        else {
          const pool = (mode === 'neg' ? T.BE : mode === 'frage' ? T.FQ : T.KA).filter((s) => s.g === ctx.g && (s.subj !== ctx.subj || s.rest !== ctx.rest));
          S0 = Object.assign(voll(U.pick(pool)), { ja: ctx.ja });
        }
      }
      const neuFrei = () => { frei = voll(U.pick(T.KA)); };
      if (mode === 'frei') { neuFrei(); api.chips([{ label: 'Anderes Beispiel', onClick() { neuFrei(); api.replay(); } }]); }
      const kn = (s) => T.NEG[s.form][0];
      const aussage = (s, y) => zeile(api, [{ t: s.subj }, { t: s.form, c: BLAU }, { t: s.rest + '.' }], y);

      async function verneinen(s, y) {
        let a = aussage(s, y);
        api.say('Zum Verneinen brauchst du nur ein Wort: <b>not</b>.');
        await api.wait(2200);
        const b = zeile(api, [{ t: s.subj }, { t: s.form, c: BLAU }, { t: 'not', c: ORANGE }, { t: s.rest + '.' }], y);
        await gleite(api, a, b, [[a.els[0], b.els[0]], [a.els[1], b.els[1]], [a.els[2], b.els[3]]]);
        api.say(`<b>not</b> kommt direkt hinter <b>${s.form}</b>: ${s.subj} ${s.form} not ${s.rest}.`);
        await api.wait(2600);
        const kurz = s.g === 0 ? [{ t: 'I’m', c: BLAU }, { t: 'not', c: ORANGE }, { t: s.rest + '.' }] : [{ t: s.subj }, { t: kn(s), c: BLAU }, { t: s.rest + '.' }];
        zeile(api, kurz, y + 44);
        return s.g === 0
          ? `Beim Sprechen kürzt man: I am not → <b>I’m not</b>. „amn’t“ gibt es nicht. Zum Eintragen in die Lücke: <b>am not</b>. ${U.say(T.negText(s))}`
          : `Beim Sprechen rücken ${s.form} und not zusammen: ${s.form} not → <b>${kn(s)}</b>. Das o fällt weg, dafür steht der Apostroph. ${U.say(T.negText(s))}`;
      }
      async function fragen(s, y) {
        const a = aussage(s, y);
        api.say('Bei einer Frage mit to be <b>tauschen</b> die ersten beiden Teile die Plätze.');
        await api.wait(2400);
        const b = zeile(api, [{ t: T.gross(s.form), c: BLAU }, { t: T.subjKlein(s.subj) }, { t: s.rest + '?' }], y);
        await gleite(api, a, b, [[a.els[0], b.els[1]], [a.els[1], b.els[0]], [a.els[2], b.els[2]]], 1100);
        return b;
      }
      async function antworten(s, ja, y) {
        api.say(`Die Kurzantwort nimmt zwei Dinge aus der Frage: das Pronomen${s.pron !== s.subj.toLowerCase() ? ` (für ${s.subj}: <b>${s.pron}</b>)` : ''} und die Form <b>${s.form}</b>.`);
        await api.wait(3000);
        zeile(api, ja ? [{ t: 'Yes,' }, { t: s.pron }, { t: s.form + '.', c: BLAU }] : [{ t: 'No,' }, { t: s.pron }, { t: kn(s) + '.', c: BLAU }], y);
        return ja
          ? `<b>${T.jaText(s)}</b> Die Form ist <b>${s.form}</b>, wie in der Frage. Nach Yes gibt es keine Kurzform. ${U.say(T.jaText(s))}`
          : `<b>${T.neinText(s)}</b> Nach No wird verneint: ${s.form} not, kurz <b>${kn(s)}</b>. ${U.say(T.neinText(s))}`;
      }
      return {
        reset() {
          api.clear();
          api.sub(mode === 'frei' ? '' : ctx.post ? 'Lösung zu deiner Aufgabe' : 'Ein ähnliches Beispiel – deine Aufgabe löst du danach selbst');
          const s = S0 || frei;
          if (mode === 'kurz') zeile(api, [{ t: T.gross(s.form), c: BLAU }, { t: T.subjKlein(s.subj) }, { t: s.rest + '?' }], 60);
          else aussage(s, 60);
        },
        async play() {
          api.clear();
          if (mode === 'neg') { api.say(await verneinen(S0, 60)); return; }
          if (mode === 'frage') {
            await fragen(S0, 70);
            api.say(`<b>${T.frageText(S0)}</b> Erst ${T.gross(S0.form)}, dann die Person. Am Ende steht ein Fragezeichen. ${U.say(T.frageText(S0))}`);
            return;
          }
          if (mode === 'kurz') {
            zeile(api, [{ t: T.gross(S0.form), c: BLAU }, { t: T.subjKlein(S0.subj) }, { t: S0.rest + '?' }], 60);
            api.say(await antworten(S0, S0.ja, 110));
            return;
          }
          const s = frei;
          api.say(await verneinen(s, 44));
          await api.wait(3600);
          api.clear();
          await fragen(s, 50);
          api.say(`<b>${T.frageText(s)}</b> ${U.say(T.frageText(s))}`);
          await api.wait(2600);
          api.say(await antworten(s, true, 96));
          await api.wait(3200);
          zeile(api, [{ t: 'No,' }, { t: s.pron }, { t: kn(s) + '.', c: BLAU }], 138);
          api.say(`Oder: <b>${T.neinText(s)}</b> ${U.say(T.neinText(s))}<br>Merke: <b>not</b> hinter am, is, are. Bei der Frage Plätze tauschen.`);
        },
      };
    },
  };

  // eine Zeile aus farbigen Stücken ohne Abstand dazwischen: teile = [[Text, Farbe?]]
  function tzeile(api, teile, y, fs) {
    const t = el('text', { x: 180, y, 'text-anchor': 'middle', class: 'ex-b', style: `font-size:${fs || 20}px` }, api.svg);
    teile.forEach(([txt, c]) => { const ts = el('tspan', { text: txt }, t); if (c) ts.setAttribute('style', `fill:${c}`); });
    try { for (let f = fs || 20; f >= 11 && t.getBBox().width > 336; f--) t.setAttribute('style', `font-size:${f}px`); } catch (e) {}
    return t;
  }

  // =====================================================
  // have got / has got: zwei Fächer
  // =====================================================
  //   ctx: { mode:'form'|'kf'|'neg'|'frage'|'kurz', subj, g, form, obj, pron, de, ja }
  const HFACH = [{ x: 14, w: 160, wer: 'I · you · we · they', form: 'have got' }, { x: 186, w: 160, wer: 'he · she · it', form: 'has got' }];
  EX['e5-have'] = {
    title: 'have got und has got',
    titleFor: (ctx) => ({ form: ctx && ctx.form ? `Warum „${ctx.form} got“?` : '', kf: 'Kurzform: so geht’s', neg: 'Verneinen: so geht’s', frage: 'Fragen: so geht’s', kurz: 'Kurzantwort: so geht’s' }[(ctx && ctx.mode) || ''] || 'have got und has got'),
    viewBox: '0 0 360 210',
    create(api, ctx) {
      ctx = ctx || {};
      const mode = ctx.mode || 'frei';
      const voll = (s) => Object.assign({}, s, { pron: s.pron || s.subj.toLowerCase() });
      let S0 = null, frei = null, kaesten = [], Z = null;
      if (mode !== 'frei') {
        if (ctx.post) S0 = voll(ctx);
        else {
          const pool = (mode === 'kf' ? T.HPRON : mode === 'frage' ? T.HQ : mode === 'kurz' ? T.HKA : T.HG).filter((s) => s.g === ctx.g && (s.subj !== ctx.subj || s.obj !== ctx.obj));
          S0 = Object.assign(voll(U.pick(pool)), { ja: ctx.ja });
        }
      }
      const neuFrei = () => { frei = [0, 1].map((g) => voll(U.pick(T.HKA.filter((s) => s.g === g)))); };
      if (mode === 'frei') { neuFrei(); api.chips([{ label: 'Andere Beispiele', onClick() { neuFrei(); api.replay(); } }]); }
      const kn = (s) => T.HNEG[s.form][0];
      function faecher() {
        kaesten = HFACH.map((f) => {
          const r = el('rect', { x: f.x, y: 122, width: f.w, height: 76, rx: 12, fill: '#fff', stroke: 'var(--ink)', 'stroke-width': 2 }, api.svg);
          el('text', { x: f.x + f.w / 2, y: 146, 'text-anchor': 'middle', class: 'ex-s', text: f.wer, style: 'font-size:13px' }, api.svg);
          el('line', { x1: f.x + 14, y1: 156, x2: f.x + f.w - 14, y2: 156, stroke: '#cfc8ba', 'stroke-width': 2 }, api.svg);
          el('text', { x: f.x + f.w / 2, y: 184, 'text-anchor': 'middle', class: 'ex-b', text: f.form, style: `fill:${BLAU};font-size:22px` }, api.svg);
          return r;
        });
      }
      const leuchte = (g) => kaesten.forEach((k, i) => k.setAttribute('fill', i === g ? '#dfe9ff' : '#fff'));
      const neu = (teile, y) => { if (Z) Z.g.remove(); Z = zeile(api, teile, y || 50); return Z; };
      const aussage = (s, y) => neu([{ t: s.subj }, { t: s.form, c: BLAU }, { t: 'got' }, { t: s.obj + '.' }], y);
      async function form(s) {
        neu([{ t: s.subj, c: ORANGE }, { t: '___' }, { t: 'got' }, { t: s.obj + '.' }]);
        api.say(s.pron !== s.subj.toLowerCase()
          ? `<b>${s.subj}</b> ${s.g === 0 ? 'sind mehrere' : 'ist eine Person oder Sache'}. Dafür kannst du <b>${s.pron}</b> sagen.`
          : `Schau auf das erste Wort: <b>${s.subj}</b>.`);
        await api.wait(2400);
        leuchte(s.g);
        api.say(T.HGRUPPE[s.g]);
        await api.wait(2600);
        neu([{ t: s.subj, c: ORANGE }, { t: s.form, c: BLAU }, { t: 'got' }, { t: s.obj + '.' }]);
      }
      async function verneinen(s) {
        const a = aussage(s);
        api.say('Zum Verneinen brauchst du nur ein Wort: <b>not</b>.');
        await api.wait(2200);
        const b = zeile(api, [{ t: s.subj }, { t: s.form, c: BLAU }, { t: 'not', c: ORANGE }, { t: 'got' }, { t: s.obj + '.' }], 50);
        await gleite(api, a, b, [[a.els[0], b.els[0]], [a.els[1], b.els[1]], [a.els[2], b.els[3]], [a.els[3], b.els[4]]]);
        Z = b;
        api.say(`<b>not</b> kommt zwischen <b>${s.form}</b> und <b>got</b>: ${s.form} not got.`);
        await api.wait(2600);
        zeile(api, [{ t: s.subj }, { t: kn(s), c: BLAU }, { t: 'got' }, { t: s.obj + '.' }], 92);
        return `Beim Sprechen rücken ${s.form} und not zusammen: ${s.form} not → <b>${kn(s)}</b>. ${U.say(T.hNeg(s))}`;
      }
      async function fragen(s) {
        const a = aussage(s);
        api.say(`Bei der Frage <b>tauschen</b> ${s.form} und die Person die Plätze. <b>got</b> bleibt, wo es ist.`);
        await api.wait(2600);
        const b = zeile(api, [{ t: T.gross(s.form), c: BLAU }, { t: T.subjKlein(s.subj) }, { t: 'got' }, { t: s.obj + '?' }], 50);
        await gleite(api, a, b, [[a.els[0], b.els[1]], [a.els[1], b.els[0]], [a.els[2], b.els[2]], [a.els[3], b.els[3]]], 1100);
        Z = b;
      }
      function antwort(s, ja, y) {
        zeile(api, ja ? [{ t: 'Yes,' }, { t: s.pron }, { t: s.form + '.', c: BLAU }] : [{ t: 'No,' }, { t: s.pron }, { t: kn(s) + '.', c: BLAU }], y);
        return ja
          ? `<b>${T.hJa(s)}</b> In der Kurzantwort steht nur ${s.form}, ohne got. Nach Yes gibt es keine Kurzform. ${U.say(T.hJa(s))}`
          : `<b>${T.hNein(s)}</b> In der Kurzantwort steht nur ${kn(s)}, ohne got. ${U.say(T.hNein(s))}`;
      }
      return {
        reset() {
          api.clear(); Z = null;
          api.sub(mode === 'frei' ? '' : ctx.post ? 'Lösung zu deiner Aufgabe' : 'Ein ähnliches Beispiel – deine Aufgabe löst du danach selbst');
          faecher();
          const s = S0 || frei[0];
          if (mode === 'form') neu([{ t: s.subj }, { t: '___' }, { t: 'got' }, { t: s.obj + '.' }]);
          else if (mode === 'kurz') neu([{ t: T.gross(s.form), c: BLAU }, { t: T.subjKlein(s.subj) }, { t: 'got' }, { t: s.obj + '?' }]);
          else if (mode === 'frei') neu([{ t: 'have got', c: BLAU }, { t: '= haben' }]);
          else aussage(s);
        },
        async play() {
          const s = S0;
          if (mode === 'form') {
            api.say('<b>have got</b> heißt <b>haben</b>. Ob have oder has, entscheidet das Wort davor.');
            await api.wait(2400);
            await form(s);
            api.say(`Also: ${s.subj} <b>${s.form}</b> got ${s.obj}. ${U.say(T.HG.find((x) => x.subj === s.subj && x.obj === s.obj).text)}<br><small>${s.de}</small>`);
            return;
          }
          if (mode === 'kf') {
            const k = T.HKURZ[s.subj];
            leuchte(s.g);
            api.say(`Beim Sprechen rücken <b>${s.subj}</b> und <b>${s.form}</b> zusammen.`);
            await api.wait(2400);
            zeile(api, [{ t: k, c: BLAU }, { t: 'got' }, { t: s.obj + '.' }], 92);
            api.say(`${s.subj} ${s.form} → <b>${k}</b>. Der Apostroph steht für die Buchstaben, die wegfallen. ${U.say(T.hKurz(s))}${s.g === 1 ? `<br>Mit got dahinter heißt ${k} immer „${s.subj.toLowerCase()} has“.` : ''}`);
            return;
          }
          if (mode === 'neg') { api.clear(); Z = null; api.say(await verneinen(s)); return; }
          if (mode === 'frage') {
            api.clear(); Z = null;
            await fragen(s);
            api.say(`<b>${T.hFrage(s)}</b> Erst ${T.gross(s.form)}, dann die Person, dann got. ${U.say(T.hFrage(s))}`);
            return;
          }
          if (mode === 'kurz') {
            api.say(`Die Kurzantwort nimmt zwei Dinge aus der Frage: das Pronomen${s.pron !== s.subj.toLowerCase() ? ` (für ${s.subj}: <b>${s.pron}</b>)` : ''} und <b>${s.form}</b>.`);
            await api.wait(3000);
            api.say(antwort(s, s.ja, 92));
            return;
          }
          api.say('<b>have got</b> heißt <b>haben</b>. Es gibt nur zwei Formen: have got und has got.');
          await api.wait(3000);
          for (const f of frei) {
            await form(f);
            api.say(`${f.subj} <b>${f.form}</b> got ${f.obj}. ${U.say(T.HG.find((x) => x.subj === f.subj && x.obj === f.obj).text)}<br><small>${f.de}</small>`);
            await api.wait(2800);
          }
          leuchte(-1);
          const f = frei[1];
          await fragen(f);
          api.say(`Frage: <b>${T.hFrage(f)}</b> ${U.say(T.hFrage(f))}`);
          await api.wait(2800);
          api.say(antwort(f, true, 92) + '<br>Merke: he, she, it → <b>has</b> got. Alle anderen → <b>have</b> got.');
        },
      };
    },
  };

  // =====================================================
  // a oder an: das n ist eine kleine Brücke
  // =====================================================
  //   ctx: { wort, art, de, laut }
  EX['e5-a-an'] = {
    title: 'a oder an',
    titleFor: (ctx) => (ctx && ctx.wort ? `Warum „${ctx.art}“?` : 'a oder an'),
    viewBox: '0 0 360 210',
    create(api, ctx) {
      ctx = ctx || {};
      const task = !!ctx.wort;
      let W0 = null, frei = [], Z = null, deko = [];
      if (task) W0 = ctx.post ? ctx : U.pick(T.AAN.filter((w) => w.art === ctx.art && w.wort !== ctx.wort && !w.laut));
      const neuFrei = () => { frei = [U.pick(T.AAN.filter((w) => w.art === 'an' && !w.laut)), U.pick(T.AAN.filter((w) => w.art === 'a' && !w.laut && !/ /.test(w.wort))), T.AAN.find((w) => w.wort === 'hour')]; };
      if (!task) { neuFrei(); api.chips([{ label: 'Andere Beispiele', onClick() { neuFrei(); api.replay(); } }]); }
      const weg = () => { if (Z) Z.remove(); Z = null; deko.forEach((d) => d.remove()); deko = []; };
      const zeig = (teile) => { if (Z) Z.remove(); Z = tzeile(api, teile, 96, 34); };
      const teileVon = (w, art, farbeArt) => [[art + ' ', farbeArt], [w.wort[0], w.laut && w.wort === 'hour' ? '#b8b2a6' : ORANGE], [w.wort.slice(1)]];
      async function zeige(w) {
        weg();
        zeig(teileVon(w, '?', '#8b8577'));
        api.say(`Sprich das Wort leise: <b>${w.wort}</b>. Was hörst du ganz am Anfang?`);
        await api.wait(2400);
        if (w.laut) { api.say(w.laut); await api.wait(4200); }
        if (w.art === 'an') {
          zeig(teileVon(w, 'a', BLAU));
          deko.push(el('path', { d: 'M150 112 l6 8 l6 -8 l6 8 l6 -8', fill: 'none', stroke: '#d1432e', 'stroke-width': 3, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', transform: 'translate(0,14)' }, api.svg));
          api.say(w.laut ? '„a“ und noch ein Vokal direkt dahinter: Das holpert beim Sprechen.' : `<b>${w.wort}</b> beginnt mit einem Vokal. „a ${w.wort}“: Zwei Vokale stoßen zusammen, das holpert beim Sprechen.`);
          await api.wait(3000);
          deko.forEach((d) => d.remove()); deko = [];
          zeig(teileVon(w, 'an', BLAU));
          deko.push(el('path', { d: 'M96 124 q84 26 168 0', fill: 'none', stroke: BLAU, 'stroke-width': 3, 'stroke-linecap': 'round' }, api.svg));
          return `Das <b>n</b> ist eine kleine Brücke zwischen den Vokalen: <b>an ${w.wort}</b>. ${U.say(w.text)}<br><small>${w.de}</small>`;
        }
        zeig(teileVon(w, 'a', BLAU));
        return `${w.laut ? '' : `<b>${w.wort}</b> beginnt mit einem Konsonanten. `}„a ${w.wort}“ lässt sich gut sprechen, es braucht keine Brücke: <b>a ${w.wort}</b>. ${U.say(w.text)}<br><small>${w.de}</small>`;
      }
      return {
        reset() {
          api.clear(); Z = null; deko = [];
          api.sub(!task ? '' : ctx.post ? 'Lösung zu deiner Aufgabe' : 'Ein ähnliches Beispiel – deine Aufgabe löst du danach selbst');
          if (task) zeig(teileVon(W0, '?', '#8b8577')); else zeig([['a', BLAU], [' oder '], ['an', BLAU], ['?']]);
        },
        async play() {
          if (task) { api.say(await zeige(W0)); return; }
          api.say('<b>a</b> und <b>an</b> heißen beide <b>ein</b> oder <b>eine</b>. Welches passt, entscheidet dein <b>Ohr</b>.');
          await api.wait(3000);
          for (const w of frei) { api.say(await zeige(w)); await api.wait(3400); }
          weg();
          zeig([['a', BLAU], [' + Konsonant · '], ['an', BLAU], [' + Vokal']]);
          api.say('Merke: Hörst du am Anfang einen Vokal (a, e, i, o, u), nimm <b>an</b>. Sonst <b>a</b>. Es zählt, was du hörst.');
        },
      };
    },
  };
})();
