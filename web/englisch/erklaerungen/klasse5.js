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

  // =====================================================
  // Mehrzahl: auf das Wortende kommt es an
  // =====================================================
  //   ctx: { mode:'pl'|'sg', sg, pl, de, regel }
  EX['e5-plural'] = {
    title: 'Mehrzahl: one box, two boxes',
    titleFor: (ctx) => (ctx && ctx.sg ? `Warum „${ctx.pl}“?` : 'Mehrzahl: one box, two boxes'),
    viewBox: '0 0 360 210',
    create(api, ctx) {
      ctx = ctx || {};
      const task = !!ctx.sg;
      let W0 = null, frei = [], oben = null, unten = null;
      if (task) W0 = ctx.post ? ctx : U.pick(T.PL.filter((w) => w.regel === ctx.regel && w.sg !== ctx.sg));
      const neuFrei = () => { frei = ['s', 'es', 'ies', 'irr'].map((r) => U.pick(T.PL.filter((w) => w.regel === r && w.sg !== w.pl))); };
      if (!task) { neuFrei(); api.chips([{ label: 'Andere Beispiele', onClick() { neuFrei(); api.replay(); } }]); }
      // gemeinsamer Anfang von Einzahl und Mehrzahl
      const gleich = (w) => { let n = 0; while (n < w.sg.length && w.sg[n] === w.pl[n]) n++; return n; };
      // Wie viele Buchstaben am Ende der Einzahl entscheiden?
      function ende(w) {
        if (w.regel === 'es') return /(ss|sh|ch)$/.test(w.sg) ? 2 : 1;
        if (w.regel === 'ies' || w.regel === 'ys') return 2;
        if (w.regel === 'ves') return w.sg.endsWith('fe') ? 2 : 1;
        if (w.regel === 'oes') return 1;
        if (w.regel === 'irr') return w.sg.length - gleich(w);
        return 0;
      }
      const weg = () => { if (oben) oben.remove(); if (unten) unten.remove(); oben = unten = null; };
      function zeigeEinzahl(w, markiert) {
        if (oben) oben.remove();
        const n = markiert ? ende(w) : 0;
        oben = tzeile(api, [['one ', '#8b8577'], [w.sg.slice(0, w.sg.length - n)], [n ? w.sg.slice(-n) : '', ORANGE]], 78, 30);
      }
      function zeigeMehrzahl(w) {
        if (unten) unten.remove();
        const n = gleich(w);
        unten = tzeile(api, [['two ', '#8b8577'], [w.pl.slice(0, n)], [w.pl.slice(n), BLAU]], 138, 30);
      }
      async function zeige(w, pause) {
        weg();
        zeigeEinzahl(w, false);
        api.say(`Ein ${w.de}: <b>one ${w.sg}</b>. Und wenn es zwei sind? Schau auf das <b>Ende</b> des Wortes.`);
        await api.wait(pause);
        zeigeEinzahl(w, true);
        api.say(T.PL_REGEL[w.regel]);
        await api.wait(pause);
        zeigeMehrzahl(w);
        return `one <b>${w.sg}</b> → two <b>${w.pl}</b>. ${T.plWarum(w)} ${U.say(w.text)}`;
      }
      return {
        reset() {
          api.clear(); oben = unten = null;
          api.sub(!task ? '' : ctx.post ? 'Lösung zu deiner Aufgabe' : 'Ein ähnliches Beispiel – deine Aufgabe löst du danach selbst');
          if (task) zeigeEinzahl(W0, false); else oben = tzeile(api, [['one', '#8b8577'], [' → '], ['two', BLAU]], 100, 30);
        },
        async play() {
          if (task) { api.say(await zeige(W0, 2600)); return; }
          api.say('Für die Mehrzahl hängt man im Englischen meistens nur ein <b>-s</b> an. Manchmal verlangt das Wortende etwas anderes.');
          await api.wait(3200);
          for (const w of frei) { api.say(await zeige(w, 2200)); await api.wait(3200); }
          weg();
          oben = tzeile(api, [['-s', BLAU], [' · '], ['-es', BLAU], [' · '], ['-ies', BLAU]], 100, 30);
          api.say('Merke: meistens <b>-s</b>. Nach Zischlaut <b>-es</b>. Konsonant + y wird <b>-ies</b>. Und ein paar Wörter wie man → men lernt man einzeln.');
        },
      };
    },
  };

  // =====================================================
  // there is / there are: eins oder mehrere?
  // =====================================================
  //   ctx: { mode:'form'|'kf'|'neg'|'frage'|'kurz', g, form, was, wo, de, n, ja }
  EX['e5-there'] = {
    title: 'there is und there are',
    titleFor: (ctx) => ({ form: ctx && ctx.form ? `Warum „there ${ctx.form}“?` : '', kf: 'Kurzform: so geht’s', neg: 'Verneinen: so geht’s', frage: 'Fragen: so geht’s', kurz: 'Kurzantwort: so geht’s' }[(ctx && ctx.mode) || ''] || 'there is und there are'),
    viewBox: '0 0 360 210',
    create(api, ctx) {
      ctx = ctx || {};
      const mode = ctx.mode || 'frei';
      let S0 = null, frei = [], Z = null, punkte = null;
      if (mode !== 'frei') {
        if (ctx.post) S0 = ctx;
        else {
          const pool = (mode === 'kf' || mode === 'neg' ? T.TH1 : mode === 'frage' || mode === 'kurz' ? T.TQ : T.TH).filter((s) => s.g === ctx.g && (s.was !== ctx.was || s.wo !== ctx.wo));
          S0 = Object.assign({}, U.pick(pool), { ja: ctx.ja });
        }
      }
      const neuFrei = () => { frei = [0, 1].map((g) => U.pick(T.TQ.filter((s) => s.g === g))); };
      if (mode === 'frei') { neuFrei(); api.chips([{ label: 'Andere Beispiele', onClick() { neuFrei(); api.replay(); } }]); }
      const kn = (s) => T.TNEG[s.form][0];
      const neu = (teile, y) => { if (Z) Z.g.remove(); Z = zeile(api, teile, y || 46); return Z; };
      const aussage = (s) => neu([{ t: 'There' }, { t: s.form, c: BLAU }, { t: s.was }, { t: s.wo + '.' }]);
      // so viele Punkte, wie Dinge da sind (0 = viele)
      function zeigePunkte(s) {
        if (punkte) punkte.remove();
        punkte = el('g', {}, api.svg);
        const n = s.n || 7, r = 11, gap = 30, x0 = 180 - ((n - 1) * gap) / 2;
        for (let k = 0; k < n; k++) el('circle', { cx: x0 + k * gap, cy: 150, r, fill: s.g === 0 ? '#dfe9ff' : '#ffe2d6', stroke: 'var(--ink)', 'stroke-width': 2 }, punkte);
        el('text', { x: 180, y: 192, 'text-anchor': 'middle', class: 'ex-s', text: s.g === 0 ? 'eins → there is' : (s.n ? 'mehrere' : 'viele') + ' → there are', style: 'font-size:14px' }, punkte);
      }
      async function form(s, pause) {
        neu([{ t: 'There' }, { t: '___' }, { t: s.was, c: ORANGE }, { t: s.wo + '.' }]);
        api.say(`Schau auf das, was <b>hinter</b> der Lücke steht: <b>${s.was}</b>. Wie viele sind das?`);
        await api.wait(pause);
        zeigePunkte(s);
        api.say(s.g === 0 ? `<b>${s.was}</b>: Das ist <b>eins</b>. Deshalb <b>there is</b>.` : `<b>${s.was}</b>: Das sind <b>mehrere</b>. Deshalb <b>there are</b>.`);
        await api.wait(pause);
        neu([{ t: 'There' }, { t: s.form, c: BLAU }, { t: s.was, c: ORANGE }, { t: s.wo + '.' }]);
      }
      async function fragen(s) {
        const a = aussage(s);
        api.say(`Bei der Frage <b>tauschen</b> there und ${s.form} die Plätze.`);
        await api.wait(2400);
        const b = zeile(api, [{ t: T.gross(s.form), c: BLAU }, { t: 'there' }, { t: s.was }, { t: s.wo + '?' }], 46);
        await gleite(api, a, b, [[a.els[0], b.els[1]], [a.els[1], b.els[0]], [a.els[2], b.els[2]], [a.els[3], b.els[3]]], 1100);
        Z = b;
      }
      function antwort(s, ja, y) {
        zeile(api, ja ? [{ t: 'Yes,' }, { t: 'there' }, { t: s.form + '.', c: BLAU }] : [{ t: 'No,' }, { t: 'there' }, { t: kn(s) + '.', c: BLAU }], y);
        return ja ? `<b>${T.thJa(s)}</b> In der Antwort steht wieder there und dieselbe Form (${s.form}). ${U.say(T.thJa(s))}`
          : `<b>${T.thNein(s)}</b> In der Antwort steht wieder there. Nach No wird verneint: ${kn(s)}. ${U.say(T.thNein(s))}`;
      }
      return {
        reset() {
          api.clear(); Z = null; punkte = null;
          api.sub(mode === 'frei' ? '' : ctx.post ? 'Lösung zu deiner Aufgabe' : 'Ein ähnliches Beispiel – deine Aufgabe löst du danach selbst');
          const s = S0 || frei[0];
          if (mode === 'frei') neu([{ t: 'there is', c: BLAU }, { t: '= es gibt' }]);
          else if (mode === 'form') neu([{ t: 'There' }, { t: '___' }, { t: s.was }, { t: s.wo + '.' }]);
          else if (mode === 'kurz') neu([{ t: T.gross(s.form), c: BLAU }, { t: 'there' }, { t: s.was }, { t: s.wo + '?' }]);
          else aussage(s);
        },
        async play() {
          const s = S0;
          if (mode === 'form') {
            api.say('<b>there is</b> und <b>there are</b> heißen: Da ist etwas, es gibt etwas.');
            await api.wait(2400);
            await form(s, 2600);
            api.say(`Also: There <b>${s.form}</b> ${s.was} ${s.wo}. ${U.say(`There ${s.form} ${s.was} ${s.wo}.`)}<br><small>${s.de}</small>`);
            return;
          }
          if (mode === 'kf') {
            api.say('Beim Sprechen rücken <b>There</b> und <b>is</b> zusammen.');
            await api.wait(2400);
            zeile(api, [{ t: 'There’s', c: BLAU }, { t: s.was }, { t: s.wo + '.' }], 92);
            api.say(`There is → <b>There’s</b>. Das i fällt weg, dafür steht der Apostroph. ${U.say(T.thKurz(s))}<br><small>${s.de}</small>`);
            return;
          }
          if (mode === 'neg') {
            const a = aussage(s);
            api.say('Zum Verneinen brauchst du nur ein Wort: <b>not</b>.');
            await api.wait(2200);
            const b = zeile(api, [{ t: 'There' }, { t: 'is', c: BLAU }, { t: 'not', c: ORANGE }, { t: s.was }, { t: s.wo + '.' }], 46);
            await gleite(api, a, b, [[a.els[0], b.els[0]], [a.els[1], b.els[1]], [a.els[2], b.els[3]], [a.els[3], b.els[4]]]);
            Z = b;
            api.say('<b>not</b> kommt direkt hinter <b>is</b>.');
            await api.wait(2400);
            zeile(api, [{ t: 'There' }, { t: 'isn’t', c: BLAU }, { t: s.was }, { t: s.wo + '.' }], 92);
            api.say(`Beim Sprechen: is not → <b>isn’t</b>. ${U.say(T.thNeg(s))}`);
            return;
          }
          if (mode === 'frage') {
            await fragen(s);
            api.say(`<b>${T.thFrage(s)}</b> Erst ${T.gross(s.form)}, dann there. ${U.say(T.thFrage(s))}`);
            return;
          }
          if (mode === 'kurz') {
            api.say(`Die Kurzantwort nimmt die beiden Wörter vom Anfang der Frage: <b>${T.gross(s.form)} there</b> …`);
            await api.wait(2800);
            api.say(antwort(s, s.ja, 92));
            return;
          }
          api.say('<b>there is</b> und <b>there are</b> heißen: Da ist etwas, es gibt etwas. Welches passt, hängt davon ab, <b>wie viele</b> es sind.');
          await api.wait(3400);
          for (const f of frei) {
            await form(f, 2200);
            api.say(`There <b>${f.form}</b> ${f.was} ${f.wo}. ${U.say(f.text)}<br><small>${f.de}</small>`);
            await api.wait(3000);
          }
          if (punkte) punkte.remove();
          const f = frei[1];
          await fragen(f);
          api.say(`Frage: <b>${T.thFrage(f)}</b> ${U.say(T.thFrage(f))}`);
          await api.wait(2800);
          api.say(antwort(f, true, 92) + '<br>Merke: eins → <b>there is</b>, mehrere → <b>there are</b>.');
        },
      };
    },
  };

  // =====================================================
  // this, that, these, those: zwei Fragen, vier Felder
  // =====================================================
  //   ctx: { mode:'wort'|'be', wort, viele, fern, ding, ort, be, adj, de }
  EX['e5-this'] = {
    title: 'this, that, these, those',
    titleFor: (ctx) => (ctx && ctx.wort ? (ctx.mode === 'be' ? `Warum „${ctx.be}“?` : `Warum „${ctx.wort.toLowerCase()}“?`) : 'this, that, these, those'),
    viewBox: '0 0 360 210',
    create(api, ctx) {
      ctx = ctx || {};
      const task = !!ctx.wort;
      let S0 = null, frei = [], Z = null, felder = {}, kopf = {};
      if (task) S0 = ctx.post ? ctx : U.pick(T.DS.filter((s) => s.wort === ctx.wort && s.ding !== ctx.ding));
      const neuFrei = () => { frei = T.DEMO.map(([w]) => U.pick(T.DS.filter((s) => s.wort === w))); };
      if (!task) { neuFrei(); api.chips([{ label: 'Andere Beispiele', onClick() { neuFrei(); api.replay(); } }]); }
      const X = [112, 232], Y = [84, 142], FW = 112, FH = 50;
      function gitter() {
        felder = {}; kopf = {};
        ['eins', 'mehrere'].forEach((t, i) => { kopf['s' + i] = el('text', { x: X[i] + FW / 2, y: 74, 'text-anchor': 'middle', class: 'ex-s', text: t, style: 'font-size:13px' }, api.svg); });
        [['nah', 'here'], ['weit weg', 'over there']].forEach(([t, e], i) => {
          kopf['z' + i] = el('text', { x: 100, y: Y[i] + 22, 'text-anchor': 'end', class: 'ex-s', text: t, style: 'font-size:13px' }, api.svg);
          el('text', { x: 100, y: Y[i] + 38, 'text-anchor': 'end', class: 'ex-s', text: e, style: `font-size:11px;fill:${ORANGE}` }, api.svg);
        });
        T.DEMO.forEach(([w, viele, fern]) => {
          const r = el('rect', { x: X[viele], y: Y[fern], width: FW, height: FH, rx: 10, fill: '#fff', stroke: 'var(--ink)', 'stroke-width': 2 }, api.svg);
          el('text', { x: X[viele] + FW / 2, y: Y[fern] + 32, 'text-anchor': 'middle', class: 'ex-b', text: w.toLowerCase(), style: `fill:${BLAU};font-size:20px` }, api.svg);
          felder[w] = r;
        });
      }
      const leuchte = (test) => T.DEMO.forEach(([w, viele, fern]) => felder[w].setAttribute('fill', test(w, viele, fern) ? '#dfe9ff' : '#fff'));
      const satz = (teile) => { if (Z) Z.g.remove(); Z = zeile(api, teile, 40, 18); };
      async function zeige(s, pause) {
        leuchte(() => false);
        satz([{ t: '___' }, { t: s.ding, c: ORANGE }, { t: s.ort }, { t: s.be }, { t: s.adj + '.' }]);
        api.say(`Erste Frage: eins oder mehrere? <b>${s.ding}</b>: ${s.viele ? 'mehrere' : 'eins'}.`);
        leuchte((w, viele) => viele === s.viele);
        await api.wait(pause);
        satz([{ t: '___' }, { t: s.ding }, { t: s.ort, c: ORANGE }, { t: s.be }, { t: s.adj + '.' }]);
        api.say(`Zweite Frage: nah oder weit weg? <b>${s.ort}</b>: ${s.fern ? 'weit weg' : 'nah'}.`);
        leuchte((w) => w === s.wort);
        await api.wait(pause);
        satz([{ t: s.wort, c: BLAU }, { t: s.ding }, { t: s.ort }, { t: s.be }, { t: s.adj + '.' }]);
      }
      return {
        reset() {
          api.clear(); Z = null;
          api.sub(!task ? '' : ctx.post ? 'Lösung zu deiner Aufgabe' : 'Ein ähnliches Beispiel – deine Aufgabe löst du danach selbst');
          gitter();
          if (task && S0.mode !== 'be' && ctx.mode !== 'be') satz([{ t: '___' }, { t: S0.ding }, { t: S0.ort }, { t: S0.be }, { t: S0.adj + '.' }]);
          else if (task) satz([{ t: S0.wort }, { t: S0.ding }, { t: S0.ort }, { t: '___' }, { t: S0.adj + '.' }]);
          else satz([{ t: 'Welches Wort?', c: BLAU }]);
        },
        async play() {
          if (task && ctx.mode === 'be') {
            const s = S0;
            leuchte((w) => w === s.wort);
            api.say(`<b>${s.wort.toLowerCase()}</b> steht in der Spalte „${s.viele ? 'mehrere' : 'eins'}“.`);
            await api.wait(2600);
            satz([{ t: s.wort, c: ORANGE }, { t: s.ding }, { t: s.ort }, { t: s.be, c: BLAU }, { t: s.adj + '.' }]);
            api.say(`${s.viele ? 'Bei mehreren heißt es <b>are</b>' : 'Bei einem heißt es <b>is</b>'}: ${s.wort} ${s.ding} ${s.ort} <b>${s.be}</b> ${s.adj}. ${U.say(`${s.wort} ${s.ding} ${s.ort} ${s.be} ${s.adj}.`)}<br><small>${s.de}</small>`);
            return;
          }
          if (task) {
            const s = S0;
            await zeige(s, 2800);
            api.say(`Also: <b>${s.wort}</b> ${s.ding} ${s.ort} ${s.be} ${s.adj}. ${U.say(`${s.wort} ${s.ding} ${s.ort} ${s.be} ${s.adj}.`)}<br><small>${s.de}</small>`);
            return;
          }
          api.say('Vier Wörter zum Zeigen. Du brauchst nur <b>zwei Fragen</b>: Eins oder mehrere? Nah oder weit weg?');
          await api.wait(3200);
          for (const s of frei) {
            await zeige(s, 1900);
            api.say(`<b>${s.wort}</b> ${s.ding} ${s.ort} ${s.be} ${s.adj}. ${U.say(s.text)}<br><small>${s.de}</small>`);
            await api.wait(2600);
          }
          leuchte(() => false);
          satz([{ t: 'this → these', c: BLAU }, { t: '·' }, { t: 'that → those', c: BLAU }]);
          api.say('Merke: <b>this</b> und <b>these</b> sind nah (here), <b>that</b> und <b>those</b> sind weit weg (over there).');
        },
      };
    },
  };

  // =====================================================
  // my, your, his, her …: zu jedem Pronomen gehört ein Wort
  // =====================================================
  //   ctx: { mode:'satz'|'paar'|'its', wer, pron, poss, ding, rest, satz1, de } | { mode:'hisher', wer, poss, ding, de } | { mode:'itis', rest, de }
  const PKARTEN = ['I', 'You', 'He', 'She', 'It', 'We', 'They'];
  EX['e5-poss'] = {
    title: 'my, your, his, her …',
    titleFor: (ctx) => (ctx && ctx.mode === 'itis' ? 'Its oder It’s?' : ctx && ctx.poss ? `Warum „${ctx.poss.toLowerCase()}“?` : 'my, your, his, her …'),
    viewBox: '0 0 360 210',
    create(api, ctx) {
      ctx = ctx || {};
      const mode = ctx.mode || 'frei';
      let S0 = null, frei = [], Z1 = null, Z2 = null, karten = {};
      const satzModus = mode === 'satz' || mode === 'paar' || mode === 'its';
      if (satzModus) S0 = ctx.post ? ctx : U.pick(T.PO.filter((s) => s.pron === ctx.pron && (s.wer !== ctx.wer || s.ding !== ctx.ding)));
      const neuFrei = () => { frei = ['He', 'She', 'They'].map((p) => U.pick(T.PO.filter((s) => s.pron === p && s.wer !== p))); };
      if (mode === 'frei') { neuFrei(); api.chips([{ label: 'Andere Beispiele', onClick() { neuFrei(); api.replay(); } }]); }
      const KW = 44, KX = 8, KY = 108, KH = 90;
      function kaertchen() {
        karten = {};
        PKARTEN.forEach((p, i) => {
          const x = KX + i * (KW + 6);
          const r = el('rect', { x, y: KY, width: KW, height: KH, rx: 9, fill: '#fff', stroke: 'var(--ink)', 'stroke-width': 2 }, api.svg);
          el('text', { x: x + KW / 2, y: KY + 24, 'text-anchor': 'middle', class: 'ex-s', text: p === 'I' ? 'I' : p.toLowerCase(), style: 'font-size:13px' }, api.svg);
          el('path', { d: `M${x + KW / 2} ${KY + 32}v14m-4 -5l4 5l4 -5`, fill: 'none', stroke: '#8b8577', 'stroke-width': 2, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, api.svg);
          el('text', { x: x + KW / 2, y: KY + 72, 'text-anchor': 'middle', class: 'ex-b', text: T.POSS[p].toLowerCase(), style: `fill:${BLAU};font-size:${T.POSS[p].length > 4 ? 14 : 16}px` }, api.svg);
          karten[p] = r;
        });
      }
      const leuchte = (p) => PKARTEN.forEach((k) => karten[k].setAttribute('fill', k === p ? '#dfe9ff' : '#fff'));
      const z1 = (teile) => { if (Z1) Z1.g.remove(); Z1 = zeile(api, teile, 36, 17); };
      const z2 = (teile) => { if (Z2) Z2.g.remove(); Z2 = zeile(api, teile, 72, 19); };
      const teile1 = (s, markiert) => { const rest = s.satz1.slice(s.wer.length + 1); return [{ t: s.wer, c: markiert ? ORANGE : '' }, { t: rest }]; };
      async function zeige(s, pause) {
        leuchte('');
        z1(teile1(s, true)); z2([{ t: '___' }, { t: s.ding }, { t: s.rest + '.' }]);
        api.say(s.wer === s.pron ? `Wem gehört es? <b>${s.wer}</b>.` : `Wem gehört es? <b>${s.wer}</b>. Dafür kannst du <b>${s.pron.toLowerCase()}</b> sagen.`);
        await api.wait(pause);
        leuchte(s.pron);
        api.say(`Zu <b>${s.pron === 'I' ? 'I' : s.pron.toLowerCase()}</b> gehört <b>${s.poss.toLowerCase()}</b>.`);
        await api.wait(pause);
        z2([{ t: s.poss, c: BLAU }, { t: s.ding }, { t: s.rest + '.' }]);
      }
      return {
        reset() {
          api.clear(); Z1 = Z2 = null;
          api.sub(mode === 'frei' ? '' : ctx.post ? 'Lösung zu deiner Aufgabe' : satzModus ? 'Ein ähnliches Beispiel – deine Aufgabe löst du danach selbst' : '');
          kaertchen();
          if (satzModus) { z1(teile1(S0, false)); z2([{ t: '___' }, { t: S0.ding }, { t: S0.rest + '.' }]); }
          else if (mode === 'hisher') { z1([{ t: `This is ${ctx.wer}.` }]); z2([{ t: 'And this is' }, { t: '___' }, { t: ctx.ding + '.' }]); }
          else if (mode === 'itis') z2([{ t: '___' }, { t: ctx.rest + '.' }]);
          else z2([{ t: 'Wem gehört es?', c: BLAU }]);
        },
        async play() {
          if (satzModus) {
            const s = S0;
            await zeige(s, 2600);
            api.say(`Also: <b>${s.poss}</b> ${s.ding} ${s.rest}. ${U.say(`${s.satz1} ${s.poss} ${s.ding} ${s.rest}.`)}${mode === 'its' ? '<br><b>Its</b> ohne Apostroph zeigt, wem etwas gehört. It’s mit Apostroph heißt „It is“.' : ''}<br><small>${s.de}</small>`);
            return;
          }
          if (mode === 'hisher') {
            const p = ctx.poss === 'His' ? 'He' : 'She';
            z1([{ t: 'This is' }, { t: ctx.wer + '.', c: ORANGE }]);
            api.say(`Schau auf den <b>Besitzer</b>: <b>${ctx.wer}</b> ist ${p === 'He' ? 'ein Junge' : 'ein Mädchen'}, also ${p.toLowerCase()}.`);
            await api.wait(2800);
            leuchte(p);
            api.say(`Zu ${p.toLowerCase()} gehört <b>${ctx.poss.toLowerCase()}</b>. Wer danach kommt (${ctx.ding}), ist egal.`);
            await api.wait(2800);
            z2([{ t: 'And this is' }, { t: ctx.poss.toLowerCase(), c: BLAU }, { t: ctx.ding + '.' }]);
            api.say(`This is ${ctx.wer}. And this is <b>${ctx.poss.toLowerCase()}</b> ${ctx.ding}. ${U.say(`This is ${ctx.wer}. And this is ${ctx.poss.toLowerCase()} ${ctx.ding}.`)}<br><small>${ctx.de}</small>`);
            return;
          }
          if (mode === 'itis') {
            api.say('Mach die Probe: Passt <b>It is</b> in die Lücke?');
            await api.wait(2400);
            z1([{ t: 'It is', c: ORANGE }, { t: ctx.rest + '.' }]);
            api.say(`„It is ${ctx.rest}.“ Das passt. Dann ist es die Kurzform mit Apostroph.`);
            await api.wait(2800);
            z2([{ t: 'It’s', c: BLAU }, { t: ctx.rest + '.' }]);
            api.say(`<b>It’s</b> ${ctx.rest}. It’s = It is. Das Wort <b>its</b> ohne Apostroph zeigt dagegen, wem etwas gehört. ${U.say(`It’s ${ctx.rest}.`)}<br><small>${ctx.de}</small>`);
            return;
          }
          api.say('Zu jedem Pronomen gehört ein Wort, das sagt, <b>wem</b> etwas gehört.');
          await api.wait(3000);
          for (const s of frei) {
            await zeige(s, 2000);
            api.say(`<b>${s.poss}</b> ${s.ding} ${s.rest}. ${U.say(s.text)}<br><small>${s.de}</small>`);
            await api.wait(2800);
          }
          leuchte('');
          api.say('Merke: Es kommt auf den <b>Besitzer</b> an. Und das Wort bleibt immer gleich: my dog, my dogs, my sister.');
        },
      };
    },
  };

  // =====================================================
  // Wem gehört es? ’s und of
  // =====================================================
  //   ctx: { mode:'s', wer, ding, de } | { mode:'viele', sg, pl, ding, viele, de } | { mode:'of', teil, sache, de }
  EX['e5-gen'] = {
    title: 'Wem gehört es? ’s und of',
    titleFor: (ctx) => (ctx && ctx.mode === 'of' ? 'Warum „of“?' : ctx && ctx.mode === 'viele' ? 'Apostroph: vor oder hinter dem s?' : ctx && ctx.mode === 's' ? 'So geht ’s' : 'Wem gehört es? ’s und of'),
    viewBox: '0 0 360 210',
    create(api, ctx) {
      ctx = ctx || {};
      const mode = ctx.mode || 'frei';
      let C0 = null, frei = null, Z = [];
      if (mode === 's') C0 = ctx.post ? ctx : U.pick(T.GP.filter((g) => g.wer !== ctx.wer));
      if (mode === 'viele') C0 = ctx.post ? ctx : Object.assign({}, U.pick(T.GM.filter((g) => g.sg !== ctx.sg)), { viele: ctx.viele });
      if (mode === 'of') C0 = ctx.post ? ctx : U.pick(T.GO.filter((o) => o.sache !== ctx.sache));
      const neuFrei = () => { frei = { s: U.pick(T.GP), m: U.pick(T.GM), o: U.pick(T.GO) }; };
      if (mode === 'frei') { neuFrei(); api.chips([{ label: 'Andere Beispiele', onClick() { neuFrei(); api.replay(); } }]); }
      const weg = () => { Z.forEach((z) => z.remove()); Z = []; };
      const zeig = (teile, y, fs) => { const t = tzeile(api, teile, y, fs || 28); Z.push(t); return t; };
      async function mitS(g) {
        weg();
        zeig([[g.wer, ORANGE], ['   ·   ', '#8b8577'], [g.ding]], 70);
        api.say(`Der Besitzer ist <b>${g.wer}</b>, eine Person oder ein Tier. Das Ding ist <b>${g.ding}</b>.`);
        await api.wait(2800);
        zeig([[g.wer], ['’s', BLAU], [' ' + g.ding]], 130);
        return `An den Besitzer kommt <b>’s</b>, dann folgt das Ding: <b>${g.wer}’s ${g.ding}</b>. ${U.say(`${g.wer}’s ${g.ding}`)}<br><small>${g.de}</small>`;
      }
      async function einsOderViele(g, viele) {
        weg();
        const wort = (viele ? g.pl : g.sg);
        zeig([[wort, ORANGE]], 60);
        api.say(viele ? `<b>${g.pl}</b>: Das sind mehrere. Das Wort endet schon auf s.` : `<b>${g.sg}</b>: Das ist einer oder eine.`);
        await api.wait(2800);
        zeig(viele ? [[g.pl], ['’', BLAU], [' ' + g.ding]] : [[g.sg], ['’s', BLAU], [' ' + g.ding]], 110);
        zeig([[viele ? 'Apostroph hinter dem s' : 'Apostroph vor dem s', '#8b8577']], 160, 15);
        const text = viele ? `${g.pl}’ ${g.ding}` : `${g.sg}’s ${g.ding}`;
        return viele
          ? `Bei mehreren kommt nur der Apostroph <b>hinter</b> das s: <b>${text}</b>. ${U.say(text)}<br><small>${viele === true || viele ? (g.de2 || g.de) : ''}</small>`
          : `Bei einem Besitzer kommt <b>’s</b> dazu: <b>${text}</b>. ${U.say(text)}<br><small>${g.de1 || g.de}</small>`;
      }
      async function mitOf(o) {
        weg();
        zeig([[o.teil], ['   ·   ', '#8b8577'], [o.sache, ORANGE]], 70, 24);
        api.say(`<b>${o.sache}</b> ist eine <b>Sache</b>, keine Person und kein Tier.`);
        await api.wait(2800);
        zeig([[o.teil + ' '], ['of', BLAU], [' ' + o.sache]], 130, 24);
        return `Bei Sachen verbindet <b>of</b> die beiden Teile: <b>${o.teil} of ${o.sache}</b>. ${U.say(`${o.teil} of ${o.sache}`)}<br><small>${o.de}</small>`;
      }
      return {
        reset() {
          api.clear(); Z = [];
          api.sub(mode === 'frei' ? '' : ctx.post ? 'Lösung zu deiner Aufgabe' : 'Ein ähnliches Beispiel – deine Aufgabe löst du danach selbst');
          if (mode === 's') zeig([[C0.wer], ['   ·   ', '#8b8577'], [C0.ding]], 70);
          else if (mode === 'viele') zeig([[C0.viele ? C0.pl : C0.sg]], 60);
          else if (mode === 'of') zeig([[C0.teil], ['   ·   ', '#8b8577'], [C0.sache]], 70, 24);
          else zeig([['’s', BLAU], [' oder '], ['of', BLAU], ['?']], 100);
        },
        async play() {
          if (mode === 's') { api.say(await mitS(C0)); return; }
          if (mode === 'viele') { api.say(await einsOderViele(C0, C0.viele)); return; }
          if (mode === 'of') { api.say(await mitOf(C0)); return; }
          api.say('Wem gehört etwas? Im Englischen zeigt das ein <b>’s</b> am Besitzer. Der Apostroph gehört immer dazu.');
          await api.wait(3200);
          api.say(await mitS(frei.s)); await api.wait(3400);
          api.say(await einsOderViele(frei.m, true)); await api.wait(3600);
          api.say(await mitOf(frei.o)); await api.wait(3400);
          weg();
          zeig([['Person: ', '#8b8577'], ['’s', BLAU], ['  ·  Sache: ', '#8b8577'], ['of', BLAU]], 100, 22);
          api.say('Merke: Personen und Tiere bekommen <b>’s</b> (Ben’s bike). Bei Sachen nimmt man <b>of</b> (the door of the house).');
        },
      };
    },
  };

  // =====================================================
  // Aufforderungen: das Verb steht vorn
  // =====================================================
  //   ctx: { mode:'pos'|'neg', p, de } | { mode:'be', text, neg, rest, de }
  EX['e5-imp'] = {
    title: 'Aufforderungen: Open … / Don’t …',
    titleFor: (ctx) => (ctx && ctx.mode === 'neg' ? 'Warum „Don’t“?' : ctx && ctx.mode === 'be' ? 'Warum „be“?' : ctx && ctx.mode === 'pos' ? 'So geht eine Aufforderung' : 'Aufforderungen: Open … / Don’t …'),
    viewBox: '0 0 360 210',
    create(api, ctx) {
      ctx = ctx || {};
      const mode = ctx.mode || 'frei';
      let S0 = null, frei = null, Z = null;
      const von = (p) => T.IMP.find((x) => x.p === p);
      if (mode === 'pos' || mode === 'neg') S0 = ctx.post ? von(ctx.p) : U.pick(T.IMP.filter((x) => x.p !== ctx.p));
      if (mode === 'be') S0 = ctx.post ? ctx : U.pick(T.IMPBE.filter((x) => x.neg === ctx.neg && x.text !== ctx.text));
      const neuFrei = () => { frei = U.pick(T.IMP); };
      if (mode === 'frei') { neuFrei(); api.chips([{ label: 'Anderes Beispiel', onClick() { neuFrei(); api.replay(); } }]); }
      const teil = (s) => (s.rest ? [{ t: T.gross(s.verb), c: BLAU }, { t: s.rest + '.' }] : [{ t: T.gross(s.verb) + '.', c: BLAU }]);
      async function bitte(s, y) {
        // erst der Aussagesatz mit you, dann fällt you weg
        const a = zeile(api, [{ t: 'You', c: '#b8b2a6' }, { t: s.verb, c: BLAU }, ...(s.rest ? [{ t: s.rest + '.' }] : [])], y);
        api.say(`Ein gewöhnlicher Satz hat eine Person vorn: You ${s.p}.`);
        await api.wait(2600);
        a.g.remove();
        Z = zeile(api, teil(s), y);
        api.say('Bei einer <b>Aufforderung</b> fällt die Person weg. Der Satz beginnt mit dem <b>Verb</b> in der Grundform.');
        await api.wait(2800);
      }
      async function verbiete(s, y) {
        const a = Z || zeile(api, teil(s), y);
        const b = zeile(api, [{ t: 'Don’t', c: ORANGE }, { t: s.verb, c: BLAU }, ...(s.rest ? [{ t: s.rest + '.' }] : [])], y);
        if (!s.rest) { a.g.remove(); } else await gleite(api, a, b, [[a.els[0], b.els[1]], [a.els[1], b.els[2]]]);
        b.g.setAttribute('opacity', 1); Z = b;
        api.say('Soll jemand etwas <b>nicht</b> tun, kommt <b>Don’t</b> davor. Das Verb wird jetzt klein geschrieben, sonst ändert sich nichts.');
        await api.wait(3000);
      }
      return {
        reset() {
          api.clear(); Z = null;
          api.sub(mode === 'frei' ? '' : ctx.post ? 'Lösung zu deiner Aufgabe' : 'Ein ähnliches Beispiel – deine Aufgabe löst du danach selbst');
          if (mode === 'be') zeile(api, S0.neg ? [{ t: 'Don’t' }, { t: '___' }, { t: S0.rest + '.' }] : [{ t: '___' }, { t: S0.rest + '.' }], 90);
          else zeile(api, [{ t: 'You', c: '#b8b2a6' }, { t: (S0 || frei).p + '.' }], 90);
        },
        async play() {
          api.clear(); Z = null;
          if (mode === 'pos') {
            const s = S0;
            await bitte(s, 90);
            api.say(`<b>${s.pos}</b> Kein you, kein -s, kein to. ${U.say(s.pos)}<br><small>${s.de}</small>`);
            return;
          }
          if (mode === 'neg') {
            const s = S0;
            Z = zeile(api, teil(s), 90);
            api.say(`Die Aufforderung heißt: <b>${s.pos}</b>`);
            await api.wait(2200);
            await verbiete(s, 90);
            api.say(`<b>Don’t</b> ${s.p}. Don’t ist kurz für Do not. ${U.say(s.neg)}<br><small>${s.deNeg}</small>`);
            return;
          }
          if (mode === 'be') {
            const s = S0;
            zeile(api, [{ t: 'am · is · are', c: '#8b8577' }], 60, 18);
            api.say('Eine Aufforderung braucht die <b>Grundform</b> des Verbs. Wie heißt die Grundform von am, is, are?');
            await api.wait(3000);
            zeile(api, s.neg ? [{ t: 'Don’t', c: ORANGE }, { t: 'be', c: BLAU }, { t: s.rest + '.' }] : [{ t: 'Be', c: BLAU }, { t: s.rest + '.' }], 120);
            api.say(`Die Grundform heißt <b>be</b>: <b>${s.text}</b> ${U.say(s.text)}<br><small>${s.de}</small>`);
            return;
          }
          const s = frei;
          api.say('Mit einer Aufforderung sagst du jemandem, was er tun soll.');
          await api.wait(2400);
          await bitte(s, 90);
          api.say(`<b>${s.pos}</b> ${U.say(s.pos)}<br><small>${s.de}</small>`);
          await api.wait(3000);
          await verbiete(s, 90);
          api.say(`<b>${s.neg}</b> ${U.say(s.neg)}<br><small>${s.deNeg}</small><br>Merke: Verb nach vorn. Für „nicht“ kommt Don’t davor.`);
        },
      };
    },
  };

  // =====================================================
  // can und must: drei Schilder
  // =====================================================
  //   ctx: { mode:'form'|'verb'|'neg'|'frage'|'kurz'|'wort', subj, vp, wort, de, pr, ja }
  const SCHILD = [{ w: 'can', de: 'können', x: 14 }, { w: 'must', de: 'müssen', x: 126 }, { w: 'mustn’t', de: 'nicht dürfen', x: 238 }];
  EX['e5-can'] = {
    title: 'can und must',
    titleFor: (ctx) => ({ form: ctx && ctx.wort ? `Warum „${ctx.wort}“ ohne s?` : '', verb: 'Das Verb dahinter', neg: 'Verneinen: so geht’s', frage: 'Fragen: so geht’s', kurz: 'Kurzantwort: so geht’s', wort: ctx && ctx.wort ? `Warum „${ctx.wort}“?` : '' }[(ctx && ctx.mode) || ''] || 'can und must'),
    viewBox: '0 0 360 210',
    create(api, ctx) {
      ctx = ctx || {};
      const mode = ctx.mode || 'frei';
      let S0 = null, frei = null, Z = null, sch = {};
      if (mode !== 'frei') {
        if (ctx.post) S0 = ctx;
        else {
          const pool = (mode === 'kurz' ? T.CAN_KA : mode === 'neg' || mode === 'frage' ? T.CAN : mode === 'wort' ? T.CMM.filter((s) => s.wort === ctx.wort)
            : [...T.CAN, ...T.MUST].filter((s) => s.wort === ctx.wort && !['I', 'You', 'We', 'They'].includes(s.subj) && s.vp.split(' ')[0] !== 'be'))
            .filter((s) => s.subj !== ctx.subj || s.vp !== ctx.vp);
          S0 = Object.assign({}, U.pick(pool), { ja: ctx.ja });
        }
      }
      const neuFrei = () => { frei = [U.pick(T.CAN), U.pick(T.MUST), U.pick(T.MUSTNT)]; };
      if (mode === 'frei') { neuFrei(); api.chips([{ label: 'Andere Beispiele', onClick() { neuFrei(); api.replay(); } }]); }
      function schilder() {
        sch = {};
        SCHILD.forEach((f) => {
          const r = el('rect', { x: f.x, y: 122, width: 108, height: 74, rx: 12, fill: '#fff', stroke: 'var(--ink)', 'stroke-width': 2 }, api.svg);
          el('text', { x: f.x + 54, y: 154, 'text-anchor': 'middle', class: 'ex-b', text: f.w, style: `fill:${BLAU};font-size:21px` }, api.svg);
          el('text', { x: f.x + 54, y: 180, 'text-anchor': 'middle', class: 'ex-s', text: f.de, style: 'font-size:13px' }, api.svg);
          sch[f.w] = r;
        });
      }
      const leuchte = (w) => SCHILD.forEach((f) => sch[f.w].setAttribute('fill', f.w === w ? '#dfe9ff' : '#fff'));
      const neu = (teile, y) => { if (Z) Z.g.remove(); Z = zeile(api, teile, y || 46); return Z; };
      const voll = (s) => neu([{ t: s.subj }, { t: s.wort, c: BLAU }, { t: s.vp + '.' }]);
      return {
        reset() {
          api.clear(); Z = null; schilder();
          api.sub(mode === 'frei' ? '' : ctx.post ? 'Lösung zu deiner Aufgabe' : 'Ein ähnliches Beispiel – deine Aufgabe löst du danach selbst');
          const s = S0 || frei[0];
          if (mode === 'kurz') neu([{ t: 'Can', c: BLAU }, { t: T.subjKlein(s.subj) }, { t: s.vp + '?' }]);
          else if (mode === 'neg' || mode === 'frage') voll(s);
          else if (mode === 'frei') neu([{ t: 'can · must · mustn’t', c: BLAU }]);
          else neu([{ t: s.subj }, { t: '___' }, { t: s.vp + '.' }]);
        },
        async play() {
          const s = S0;
          if (mode === 'form' || mode === 'verb') {
            const v = s.vp.split(' ')[0], rest = s.vp.split(' ').slice(1).join(' ');
            leuchte(s.wort);
            api.say(`<b>${s.wort}</b> ist ein besonderes Verb: Es sieht bei allen Personen gleich aus. <b>Kein -s</b>, auch nicht bei he, she, it.`);
            await api.wait(3200);
            neu([{ t: s.subj }, { t: s.wort, c: BLAU }, { t: v, c: ORANGE }, ...(rest ? [{ t: rest + '.' }] : [])]);
            api.say(`Dahinter steht das Verb in der <b>Grundform</b>: <b>${v}</b>. Ohne -s und ohne to.`);
            await api.wait(3000);
            api.say(`Also: ${s.subj} <b>${s.wort}</b> <b>${v}</b>${rest ? ' ' + rest : ''}. ${U.say(`${s.subj} ${s.wort} ${s.vp}.`)}<br><small>${s.de}</small>`);
            return;
          }
          if (mode === 'neg') {
            leuchte('can');
            api.say('Zum Verneinen hängt man <b>not</b> direkt an can: <b>cannot</b>, in einem Wort.');
            await api.wait(2800);
            neu([{ t: s.subj }, { t: 'cannot', c: BLAU }, { t: s.vp + '.' }]);
            await api.wait(2000);
            zeile(api, [{ t: s.subj }, { t: 'can’t', c: BLAU }, { t: s.vp + '.' }], 92);
            api.say(`Beim Sprechen sagt man meist kurz <b>can’t</b>: ${s.subj} can’t ${s.vp}. ${U.say(`${s.subj} can’t ${s.vp}.`)}`);
            return;
          }
          if (mode === 'frage') {
            const a = voll(s);
            api.say('Bei der Frage <b>tauschen</b> can und die Person die Plätze. Mehr braucht es nicht.');
            await api.wait(2600);
            const b = zeile(api, [{ t: 'Can', c: BLAU }, { t: T.subjKlein(s.subj) }, { t: s.vp + '?' }], 46);
            await gleite(api, a, b, [[a.els[0], b.els[1]], [a.els[1], b.els[0]], [a.els[2], b.els[2]]], 1100);
            Z = b;
            api.say(`<b>Can ${T.subjKlein(s.subj)} ${s.vp}?</b> Kein do, kein does. ${U.say(`Can ${T.subjKlein(s.subj)} ${s.vp}?`)}`);
            return;
          }
          if (mode === 'kurz') {
            leuchte('can');
            api.say(`Die Kurzantwort nimmt <b>can</b> aus der Frage wieder auf${s.subj.toLowerCase() !== s.pr ? ` (für ${s.subj}: <b>${s.pr}</b>)` : ''}.`);
            await api.wait(2800);
            const t = s.ja ? `Yes, ${s.pr} can.` : `No, ${s.pr} can’t.`;
            zeile(api, s.ja ? [{ t: 'Yes,' }, { t: s.pr }, { t: 'can.', c: BLAU }] : [{ t: 'No,' }, { t: s.pr }, { t: 'can’t.', c: BLAU }], 92);
            api.say(`<b>${t}</b> In der Antwort steht can, nicht do oder does. ${U.say(t)}`);
            return;
          }
          if (mode === 'wort') {
            api.say(`Was soll der Satz sagen? <b>${s.de}</b>`);
            await api.wait(2800);
            leuchte(s.wort);
            api.say(`Dazu passt <b>${s.wort}</b> = ${T.CAN_DE[s.wort]}.${s.wort === 'mustn’t' ? ' Achtung: mustn’t ist ein Verbot, es heißt nicht „nicht müssen“.' : ''}`);
            await api.wait(3000);
            voll(s);
            api.say(`${s.subj} <b>${s.wort}</b> ${s.vp}. ${U.say(`${s.subj} ${s.wort} ${s.vp}.`)}<br><small>${s.de}</small>`);
            return;
          }
          api.say('Drei kleine Wörter sagen, was jemand <b>kann</b>, <b>muss</b> oder <b>nicht darf</b>.');
          await api.wait(3000);
          for (const f of frei) {
            leuchte(f.wort); voll(f);
            api.say(`<b>${f.wort}</b> = ${T.CAN_DE[f.wort]}: ${f.subj} <b>${f.wort}</b> ${f.vp}. ${U.say(f.text)}<br><small>${f.de}</small>`);
            await api.wait(3600);
          }
          leuchte('');
          api.say('Merke: Alle drei bleiben bei jeder Person gleich (kein -s). Dahinter steht die Grundform. Und <b>mustn’t</b> heißt „nicht dürfen“.');
        },
      };
    },
  };

  // =====================================================
  // present simple: das s gibt es nur einmal
  // =====================================================
  //   ctx: { mode:'form'|'neg'|'frage'|'kurz', subj, g, base, form, rest, de, pr, ja } | { mode:'sform', base }
  const PSFACH = [{ x: 14, w: 160, wer: 'I · you · we · they' }, { x: 186, w: 160, wer: 'he · she · it' }];
  function psErklaerung(titel, grund) {
    return {
      title: titel,
      titleFor: (ctx) => ({ form: ctx && ctx.form ? `Warum „${ctx.form}“?` : '', sform: 'Die Form für he, she, it', neg: 'Verneinen: so geht’s', frage: 'Fragen: so geht’s', kurz: 'Kurzantwort: so geht’s' }[(ctx && ctx.mode) || ''] || titel),
      viewBox: '0 0 360 210',
      create(api, ctx) {
        ctx = ctx || {};
        const mode = ctx.mode || 'frei';
        let S0 = null, frei = null, Z = [], kaesten = [];
        if (mode === 'sform') S0 = { base: ctx.post ? ctx.base : U.pick(T.VERBEN.filter((v) => v !== ctx.base)) };
        else if (mode !== 'frei') {
          if (ctx.post) S0 = ctx;
          else {
            const pool = (mode === 'kurz' ? T.PSKA : mode === 'frage' ? T.PSQ : T.PSS).filter((s) => s.g === ctx.g && (s.subj !== ctx.subj || s.base !== ctx.base));
            S0 = Object.assign({}, U.pick(pool), { ja: ctx.ja });
          }
        }
        const neuFrei = () => { frei = U.pick(T.PSKA.filter((s) => s.g === 1)); };
        if (mode === 'frei') { neuFrei(); api.chips([{ label: 'Anderes Beispiel', onClick() { neuFrei(); api.replay(); } }]); }
        const weg = () => { Z.forEach((z) => z.remove()); Z = []; };
        const zeig = (teile, y, fs) => { const t = tzeile(api, teile, y, fs || 21); Z.push(t); return t; };
        // Verb so zerlegen, dass die Endung (s, es, ies) einzeln gefärbt werden kann
        const endung = (base, form) => { const a = base.split(' ')[0], f = form.split(' ')[0], rest = form.split(' ').slice(1).join(' '); let n = 0; while (n < a.length && a[n] === f[n]) n++; return [f.slice(0, n), f.slice(n), rest ? ' ' + rest : '']; };
        const mitEndung = (s) => { const [st, en, r] = endung(s.base, s.form); return [[s.subj + ' '], [st], [en, ORANGE], [r + ' ' + s.rest + '.']]; };
        function faecher(v) {
          kaesten = PSFACH.map((f, k) => {
            const r = el('rect', { x: f.x, y: 122, width: f.w, height: 76, rx: 12, fill: '#fff', stroke: 'var(--ink)', 'stroke-width': 2 }, api.svg);
            el('text', { x: f.x + f.w / 2, y: 146, 'text-anchor': 'middle', class: 'ex-s', text: f.wer, style: 'font-size:13px' }, api.svg);
            el('line', { x1: f.x + 14, y1: 156, x2: f.x + f.w - 14, y2: 156, stroke: '#cfc8ba', 'stroke-width': 2 }, api.svg);
            el('text', { x: f.x + f.w / 2, y: 184, 'text-anchor': 'middle', class: 'ex-b', text: k ? T.sForm(v) : v, style: `fill:${BLAU};font-size:21px` }, api.svg);
            return r;
          });
        }
        const leuchte = (g) => kaesten.forEach((k, i) => k.setAttribute('fill', i === g ? '#dfe9ff' : '#fff'));
        async function aussage(s, y) {
          zeig(mitEndung(s), y);
          api.say(s.g ? `Der Satz heißt: ${s.subj} <b>${s.form}</b> ${s.rest}. Das Verb trägt das <b>s</b> für he, she, it.` : `Der Satz heißt: ${s.subj} <b>${s.form}</b> ${s.rest}.`);
          await api.wait(2800);
        }
        async function verneinen(s) {
          await aussage(s, 56);
          zeig(s.g ? [[s.subj + ' '], ['doe', BLAU], ['s', ORANGE], ['n’t', BLAU], [' ' + s.base + ' ' + s.rest + '.']] : [[s.subj + ' '], ['don’t', BLAU], [' ' + s.base + ' ' + s.rest + '.']], 104);
          return s.g
            ? `Zum Verneinen kommt <b>doesn’t</b> vor das Verb. Das s gibt es nur <b>einmal</b>: Es steckt jetzt in doe<b>s</b>n’t, das Verb steht wieder in der Grundform (<b>${s.base}</b>). ${U.say(`${s.subj} doesn’t ${s.base} ${s.rest}.`)}`
            : `Zum Verneinen kommt <b>don’t</b> vor das Verb. Das Verb bleibt in der Grundform (<b>${s.base}</b>). ${U.say(`${s.subj} don’t ${s.base} ${s.rest}.`)}`;
        }
        async function fragen(s, y1, y2) {
          await aussage(s, y1);
          zeig(s.g ? [['Doe', BLAU], ['s', ORANGE], [' ' + T.subjKlein(s.subj) + ' ' + s.base + ' ' + s.rest + '?']] : [['Do', BLAU], [' ' + T.subjKlein(s.subj) + ' ' + s.base + ' ' + s.rest + '?']], y2);
          return s.g
            ? `Die Frage beginnt mit <b>Does</b>. Auch hier wandert das s zu Doe<b>s</b>, das Verb steht in der Grundform (<b>${s.base}</b>). ${U.say(`Does ${T.subjKlein(s.subj)} ${s.base} ${s.rest}?`)}`
            : `Die Frage beginnt mit <b>Do</b>, dann kommen Person und Verb in der Grundform (<b>${s.base}</b>). ${U.say(`Do ${T.subjKlein(s.subj)} ${s.base} ${s.rest}?`)}`;
        }
        function antwort(s, ja, y) {
          const d = s.g ? 'does' : 'do', dn = s.g ? 'doesn’t' : 'don’t', t = ja ? `Yes, ${s.pr} ${d}.` : `No, ${s.pr} ${dn}.`;
          zeig(ja ? [['Yes, ' + s.pr + ' '], [d + '.', BLAU]] : [['No, ' + s.pr + ' '], [dn + '.', BLAU]], y);
          return `<b>${t}</b> Die Kurzantwort nimmt ${d} aus der Frage wieder auf, nicht das Verb ${s.base}. ${U.say(t)}`;
        }
        return {
          reset() {
            api.clear(); Z = []; kaesten = [];
            api.sub(mode === 'frei' ? '' : ctx.post ? 'Lösung zu deiner Aufgabe' : 'Ein ähnliches Beispiel – deine Aufgabe löst du danach selbst');
            const s = S0 || frei;
            if (mode === 'form') { faecher(s.base); zeig([[s.subj + ' ___ ' + s.rest + '.']], 50); }
            else if (mode === 'sform') zeig([['I ' + s.base + ' → he …']], 80, 24);
            else if (mode === 'kurz') zeig([[s.g ? 'Does' : 'Do', BLAU], [' ' + T.subjKlein(s.subj) + ' ' + s.base + ' ' + s.rest + '?']], 56);
            else zeig([[s.subj + ' ' + s.form + ' ' + s.rest + '.']], 56);
          },
          async play() {
            const s = S0;
            if (mode === 'form') {
              api.say(s.pr && s.subj.toLowerCase() !== s.pr ? `Wer tut es? <b>${s.subj}</b>. Dafür kannst du <b>${s.pr}</b> sagen.` : `Wer tut es? <b>${s.subj}</b>.`);
              await api.wait(2600);
              leuchte(s.g);
              api.say(s.g ? 'Bei <b>he, she, it</b> bekommt das Verb ein <b>s</b>. Merksatz: he, she, it – das s muss mit.' : 'Bei <b>I, you, we, they</b> bleibt das Verb, wie es ist.');
              await api.wait(3000);
              weg(); zeig(s.g ? mitEndung(s) : [[s.subj + ' '], [s.form, BLAU], [' ' + s.rest + '.']], 50);
              api.say(`Also: ${s.subj} <b>${s.form}</b> ${s.rest}. ${s.g ? T.sRegel(s.base) : ''} ${U.say(`${s.subj} ${s.form} ${s.rest}.`)}<br><small>${s.de}</small>`);
              return;
            }
            if (mode === 'sform') {
              const v = s.base, [st, en, r] = endung(v, T.sForm(v));
              api.say(`Für he, she, it braucht <b>${v}</b> ein s. Schau auf das <b>Ende</b> des Verbs.`);
              await api.wait(2800);
              weg(); zeig([['I ' + v + ' → he '], [st], [en, ORANGE], [r]], 80, 24);
              api.say(`I ${v} → he <b>${T.sForm(v)}</b>. ${T.sRegel(v)}`);
              return;
            }
            if (mode === 'neg') { weg(); api.say(await verneinen(s)); return; }
            if (mode === 'frage') { weg(); api.say(await fragen(s, 56, 104)); return; }
            if (mode === 'kurz') {
              api.say(`Die Frage beginnt mit <b>${s.g ? 'Does' : 'Do'}</b>. Genau dieses Wort kommt in der Antwort wieder${s.subj.toLowerCase() !== s.pr ? ` (und für ${s.subj}: <b>${s.pr}</b>)` : ''}.`);
              await api.wait(3000);
              api.say(antwort(s, s.ja, 104));
              return;
            }
            const f = frei;
            api.say(grund);
            await api.wait(3200);
            weg(); api.say(await verneinen(f)); await api.wait(4200);
            weg(); api.say(await fragen(f, 44, 84)); await api.wait(4000);
            api.say(antwort(f, true, 124) + '<br>Merke: Das s gibt es in jedem Satz nur einmal: likes, doesn’t like, Does … like?');
          },
        };
      },
    };
  }
  EX['e5-ps'] = psErklaerung('present simple: he, she, it – das s muss mit', 'Das present simple sagt, was jemand <b>regelmäßig</b> tut. Bei he, she, it bekommt das Verb ein <b>s</b>.');
  EX['e5-ps-neg'] = psErklaerung('present simple: don’t und doesn’t', 'Verneint wird mit <b>don’t</b> oder <b>doesn’t</b>. Dahinter steht das Verb in der Grundform.');
  EX['e5-ps-frage'] = psErklaerung('present simple: Fragen mit do und does', 'Fragen beginnen mit <b>Do</b> oder <b>Does</b>. Dahinter stehen die Person und das Verb in der Grundform.');

  // =====================================================
  // Fragewörter: sechs Karten
  // =====================================================
  //   ctx: { mode:'frage', wort, rest, antwort, de } | { mode:'wort', wort }
  EX['e5-fragewort'] = {
    title: 'Fragewörter: who, what, where …',
    titleFor: (ctx) => (ctx && ctx.wort ? `Warum „${ctx.wort.toLowerCase()}“?` : 'Fragewörter: who, what, where …'),
    viewBox: '0 0 360 210',
    create(api, ctx) {
      ctx = ctx || {};
      const mode = ctx.mode || 'frei';
      let Q0 = null, frei = [], Z = [], karten = {};
      if (mode === 'frage') Q0 = ctx.post ? ctx : U.pick(T.FW.filter((q) => q.wort === ctx.wort && q.rest !== ctx.rest)) || U.pick(T.FW.filter((q) => q.rest !== ctx.rest));
      const neuFrei = () => { frei = U.shuffle(T.FW6).slice(0, 3).map((w) => U.pick(T.FW.filter((q) => q.wort === w))); };
      if (mode === 'frei') { neuFrei(); api.chips([{ label: 'Andere Beispiele', onClick() { neuFrei(); api.replay(); } }]); }
      const weg = () => { Z.forEach((z) => z.remove()); Z = []; };
      const zeig = (teile, y, fs) => { const t = tzeile(api, teile, y, fs || 19); Z.push(t); return t; };
      function kartenZeichnen() {
        karten = {};
        T.FW6.forEach((w, i) => {
          const x = 14 + (i % 3) * 112, y = 92 + Math.floor(i / 3) * 56;
          const r = el('rect', { x, y, width: 108, height: 50, rx: 10, fill: '#fff', stroke: 'var(--ink)', 'stroke-width': 2 }, api.svg);
          el('text', { x: x + 54, y: y + 23, 'text-anchor': 'middle', class: 'ex-b', text: w.toLowerCase(), style: `fill:${BLAU};font-size:18px` }, api.svg);
          el('text', { x: x + 54, y: y + 41, 'text-anchor': 'middle', class: 'ex-s', text: T.FW_DE[w], style: 'font-size:12px' }, api.svg);
          karten[w] = r;
        });
      }
      const leuchte = (w) => T.FW6.forEach((k) => karten[k].setAttribute('fill', w && k === w.split(' ')[0] ? '#dfe9ff' : '#fff'));
      async function zeige(q, pause) {
        weg(); leuchte('');
        zeig([['– ' + q.antwort, ORANGE]], 66, 18);
        api.say(`Die Antwort heißt: <b>${q.antwort}</b> Was nennt sie?`);
        await api.wait(pause);
        leuchte(q.wort);
        api.say(`Sie nennt <b>${T.FW_ART[q.wort]}</b>. Danach fragt <b>${q.wort.toLowerCase()}</b> (${T.FW_DE[q.wort]}).`);
        await api.wait(pause);
        zeig([[q.wort, BLAU], [' ' + q.rest + '?']], 36);
      }
      return {
        reset() {
          api.clear(); Z = []; kartenZeichnen();
          api.sub(mode === 'frei' ? '' : ctx.post ? 'Lösung zu deiner Aufgabe' : mode === 'wort' ? 'Das Wort aus deiner Aufgabe' : 'Ein ähnliches Beispiel – deine Aufgabe löst du danach selbst');
          if (mode === 'frage') { zeig([['___ ' + Q0.rest + '?']], 36); zeig([['– ' + Q0.antwort]], 66, 18); }
          else zeig([['Wonach wird gefragt?', BLAU]], 50);
        },
        async play() {
          if (mode === 'frage') {
            const q = Q0;
            await zeige(q, 2800);
            api.say(`<b>${q.wort}</b> ${q.rest}? – ${q.antwort} ${U.say(`${q.wort} ${q.rest}? ${q.antwort}`)}<br><small>${q.de}</small>`);
            return;
          }
          if (mode === 'wort') {
            leuchte(ctx.wort);
            weg(); zeig([[ctx.wort.toLowerCase(), BLAU], [' = ' + T.FW_DE[ctx.wort]]], 50, 24);
            api.say(`<b>${ctx.wort.toLowerCase()}</b> heißt <b>${T.FW_DE[ctx.wort]}</b> und fragt nach: ${T.FW_ART[ctx.wort]}.${ctx.wort === 'Who' || ctx.wort === 'Where' ? ' Vorsicht: <b>who</b> = wer, <b>where</b> = wo.' : ''}`);
            return;
          }
          api.say('Mit einem Fragewort fragst du nach etwas Bestimmtem. Es steht immer ganz <b>vorn</b>.');
          await api.wait(3000);
          for (const q of frei) {
            await zeige(q, 2100);
            api.say(`<b>${q.wort}</b> ${q.rest}? – ${q.antwort} ${U.say(q.text)}<br><small>${q.de}</small>`);
            await api.wait(3000);
          }
          leuchte('');
          api.say('Merke: <b>who</b> = wer, <b>where</b> = wo. Diese beiden werden am häufigsten verwechselt.');
        },
      };
    },
  };

  // =====================================================
  // Satzbau: fünf Plätze
  // =====================================================
  //   ctx: { mode:'voll'|'kurz', teile:[wer, tut, was, wo, wann], de }
  EX['e5-satzbau'] = {
    title: 'Satzbau: wer – tut – was – wo – wann',
    titleFor: () => 'Satzbau: wer – tut – was – wo – wann',
    viewBox: '0 0 360 210',
    create(api, ctx) {
      ctx = ctx || {};
      const task = !!ctx.teile;
      let S0 = null, zeilen = [];
      const nimm = () => U.pick(T.SB.filter((s) => !task || s.teile.join() !== ctx.teile.join()));
      if (task && ctx.post) S0 = { teile: ctx.teile, de: ctx.de }; else S0 = nimm();
      if (!task) api.chips([{ label: 'Anderes Beispiel', onClick() { S0 = nimm(); api.replay(); } }]);
      const n = () => (task && ctx.mode === 'kurz' ? 4 : 5);
      const FARBE = ['#c2410c', BLAU, '#0d6b49', '#7c3aed', '#b45309'];
      function plaetze() {
        zeilen = [];
        for (let k = 0; k < n(); k++) {
          const y = 16 + k * 37;
          el('rect', { x: 14, y, width: 332, height: 31, rx: 9, fill: '#fff', stroke: '#cfc8ba', 'stroke-width': 2 }, api.svg);
          el('text', { x: 28, y: y + 21, class: 'ex-s', text: T.SB_FRAGE[k], style: `font-size:13px;fill:${FARBE[k]}` }, api.svg);
          zeilen.push(el('text', { x: 100, y: y + 22, class: 'ex-b', text: '', style: `font-size:17px;fill:${k === 1 ? BLAU : 'var(--ink)'}` }, api.svg));
        }
      }
      return {
        reset() {
          api.clear(); plaetze();
          api.sub(!task ? '' : ctx.post ? 'Lösung zu deiner Aufgabe' : 'Ein ähnliches Beispiel – deine Aufgabe löst du danach selbst');
        },
        async play() {
          const s = S0, t = s.teile.slice(0, n());
          api.say('Der englische Satz hat feste Plätze. Stell die Fragen der Reihe nach.');
          await api.wait(2400);
          const text = ['<b>Wer</b> tut etwas?', 'Was <b>tut</b> er oder sie? Das Verb kommt gleich an zweiter Stelle.', '<b>Was</b> (wen oder was)? Das bleibt direkt beim Verb.', '<b>Wo</b> (oder wohin)? Der Ort kommt vor der Zeit.', '<b>Wann</b>? Die Zeit steht am Ende.'];
          for (let k = 0; k < t.length; k++) {
            zeilen[k].textContent = t[k];
            api.say(`${text[k]} → <b>${t[k]}</b>`);
            await api.wait(2300);
          }
          const satz = `${t.join(' ')}.`;
          api.say(`<b>${satz}</b> ${t.length === 5 ? U.say(satz) : ''}<br><small>${t.length === 5 ? s.de : 'wer – tut – was – wo'}</small>`);
        },
      };
    },
  };

  // =====================================================
  // Wie oft? Eine Leiter von nie bis immer
  // =====================================================
  //   ctx: { mode:'stelle', be, wer, adv, verb, rest, de } | { mode:'wort', adv }
  EX['e5-oft'] = {
    title: 'Wie oft? always, often, never',
    titleFor: (ctx) => (ctx && ctx.mode === 'stelle' ? `Wohin gehört „${ctx.adv}“?` : 'Wie oft? always, often, never'),
    viewBox: '0 0 360 210',
    create(api, ctx) {
      ctx = ctx || {};
      const mode = ctx.mode || 'frei';
      let S0 = null, frei = [], Z = null, marken = {};
      if (mode === 'stelle') S0 = ctx.post ? ctx : U.pick(T.OALL.filter((s) => s.be === ctx.be && (s.wer !== ctx.wer || s.rest !== ctx.rest)));
      const neuFrei = () => { frei = [U.pick(T.OV), U.pick(T.OB)]; };
      if (mode === 'frei') { neuFrei(); api.chips([{ label: 'Andere Beispiele', onClick() { neuFrei(); api.replay(); } }]); }
      function leiter() {
        marken = {};
        el('line', { x1: 30, y1: 150, x2: 330, y2: 150, stroke: 'var(--ink)', 'stroke-width': 3, 'stroke-linecap': 'round' }, api.svg);
        T.OFT.forEach((w, i) => {
          const x = 30 + i * 75;
          const c = el('circle', { cx: x, cy: 150, r: 9, fill: '#fff', stroke: 'var(--ink)', 'stroke-width': 2 }, api.svg);
          el('text', { x, y: 132, 'text-anchor': 'middle', class: 'ex-b', text: w, style: `font-size:13px;fill:${BLAU}` }, api.svg);
          el('text', { x, y: 178, 'text-anchor': 'middle', class: 'ex-s', text: T.OFT_DE[w], style: 'font-size:11px' }, api.svg);
          marken[w] = c;
        });
        el('text', { x: 30, y: 200, 'text-anchor': 'middle', class: 'ex-s', text: '0 %', style: 'font-size:10px' }, api.svg);
        el('text', { x: 330, y: 200, 'text-anchor': 'middle', class: 'ex-s', text: '100 %', style: 'font-size:10px' }, api.svg);
      }
      const leuchte = (w) => T.OFT.forEach((k) => marken[k].setAttribute('fill', k === w ? ORANGE : '#fff'));
      const satz = (teile) => { if (Z) Z.g.remove(); Z = zeile(api, teile, 60, 19); };
      async function zeige(s, pause) {
        leuchte(s.adv);
        satz(s.be ? [{ t: s.wer }, { t: s.verb, c: BLAU }, { t: s.rest + '.' }] : [{ t: s.wer }, { t: s.verb, c: BLAU }, { t: s.rest + '.' }]);
        api.say(`<b>${s.adv}</b> heißt <b>${T.OFT_DE[s.adv]}</b>. Wohin damit im Satz? Suche zuerst das Verb: <b>${s.verb}</b>.`);
        await api.wait(pause);
        const a = Z;
        const b = zeile(api, s.be ? [{ t: s.wer }, { t: s.verb, c: BLAU }, { t: s.adv, c: ORANGE }, { t: s.rest + '.' }] : [{ t: s.wer }, { t: s.adv, c: ORANGE }, { t: s.verb, c: BLAU }, { t: s.rest + '.' }], 60, 19);
        await gleite(api, a, b, s.be ? [[a.els[0], b.els[0]], [a.els[1], b.els[1]], [a.els[2], b.els[3]]] : [[a.els[0], b.els[0]], [a.els[1], b.els[2]], [a.els[2], b.els[3]]]);
        Z = b;
        return s.be
          ? `Bei <b>am, is, are</b> steht es <b>dahinter</b>: ${s.wer} ${s.verb} <b>${s.adv}</b> ${s.rest}. ${U.say(`${s.wer} ${s.verb} ${s.adv} ${s.rest}.`)}<br><small>${s.de}</small>`
          : `Es steht <b>vor</b> dem Verb: ${s.wer} <b>${s.adv}</b> ${s.verb} ${s.rest}. ${U.say(`${s.wer} ${s.adv} ${s.verb} ${s.rest}.`)}<br><small>${s.de}</small>`;
      }
      return {
        reset() {
          api.clear(); Z = null; leiter();
          api.sub(mode === 'frei' ? '' : ctx.post ? 'Lösung zu deiner Aufgabe' : mode === 'wort' ? 'Das Wort aus deiner Aufgabe' : 'Ein ähnliches Beispiel – deine Aufgabe löst du danach selbst');
          if (mode === 'stelle') satz([{ t: S0.wer }, { t: S0.verb }, { t: S0.rest + '.' }]);
          else satz([{ t: 'Wie oft?', c: BLAU }]);
        },
        async play() {
          if (mode === 'stelle') { api.say(await zeige(S0, 3000)); return; }
          if (mode === 'wort') {
            leuchte(ctx.adv);
            satz([{ t: ctx.adv, c: BLAU }, { t: '=' }, { t: T.OFT_DE[ctx.adv] }]);
            api.say(`<b>${ctx.adv}</b> heißt <b>${T.OFT_DE[ctx.adv]}</b>. Die Leiter geht von nie (never) bis immer (always).`);
            return;
          }
          api.say('Fünf Wörter sagen, <b>wie oft</b> etwas passiert: von nie bis immer.');
          await api.wait(3000);
          for (const s of frei) { api.say(await zeige(s, 2400)); await api.wait(3600); }
          leuchte('');
          api.say('Merke: <b>vor</b> dem Verb (I often play), aber <b>hinter</b> am, is, are (She is often late).');
        },
      };
    },
  };
})();
