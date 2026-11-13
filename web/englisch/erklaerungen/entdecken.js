/* EnDax (Englisch) – Entdecken
 * Englisch zum Staunen. Dunkle Bühne wie in MaDax und DeDax.
 * Jede Entdeckung: { title, viewBox, dark:true, discover:{icon, q, tag}, create(api) → {reset, play} }
 * Daten (Wörter mit Aufnahme) stehen in themen/klasse5.js unter D.daten.ENT.
 * Fakten geprüft (Stand 13.11.2026): Pfund seit 15.2.1971 = 100 Pence (vorher 240), £ vom lateinischen „libra“;
 * Schuljahre in England (Year 6 = 10–11 Jahre, Year 7 = erstes Jahr der weiterführenden Schule).
 */
(function () {
  const D = window.EnDax, U = D.util, T = D.daten, EX = D.explainers, { el } = D.exUtil;
  const lerp = (a, b, t) => a + (b - a) * t;
  const reg = (id, def) => (EX[id] = Object.assign({ dark: true }, def));
  const W = '#ece9f7', BLAU = '#58c4dd', GELB = '#ffd166', GRUEN = '#83d483', ROT = '#ff6b6b', ORANGE = '#ff9f43', DIM = '#8a8fb5', FELD = '#1f2240', RAND = '#3a3e66';
  const txt = (p, x, y, text, size, fill, anchor) => el('text', { x, y, 'text-anchor': anchor || 'middle', class: 'k-txt', text, style: `font-size:${size || 14}px;fill:${fill || W}` }, p);
  const box = (p, x, y, w, h, fill, stroke) => el('rect', { x, y, width: w, height: h, rx: 10, fill: fill || FELD, stroke: stroke || RAND, 'stroke-width': 1.5 }, p);
  const zeig = (api, e, ms) => api.tw(ms || 350, (t) => e.setAttribute('opacity', t));

  // =====================================================
  // a oder an? Es zählt der Laut, nicht der Buchstabe
  // =====================================================
  reg('en-an', {
    title: 'an hour, aber a house?',
    viewBox: '0 0 360 210',
    discover: { icon: '👂', q: 'Warum sagt man „an hour“, aber „a house“?', tag: 'Hören' },
    create(api) {
      const L = T.ENT.an;
      return {
        reset() { api.clear(); },
        async play() {
          api.say('Du hast gelernt: <b>an</b> vor a, e, i, o, u. Aber dann das hier: <b>an hour</b>, obwohl hour mit h anfängt!');
          await api.wait(4200);
          for (let k = 0; k < L.length; k++) {
            const [wort, art, warum] = L[k], x = k % 2 ? 266 : 94;
            const g = el('g', { opacity: 0 }, api.svg);
            box(g, x - 80, Math.floor(k / 2) * 52 + 14, 160, 42, FELD, art === 'an' ? ORANGE : BLAU);
            txt(g, x, Math.floor(k / 2) * 52 + 42, wort, 19, art === 'an' ? ORANGE : BLAU);
            await zeig(api, g, 400);
            api.say(`<b>${wort}</b> ${U.say(wort)}<br>${warum}`);
            await api.wait(3200);
          }
          txt(api.svg, 180, 186, 'Es zählt, wie das Wort klingt.', 15, GELB);
          api.say('Das Geheimnis: Es zählt nicht der <b>Buchstabe</b>, sondern der erste <b>Laut</b>. Klingt das Wort vorn wie a, e, i, o, u, sagt man <b>an</b>. Das macht das Sprechen leichter: „an egg“ geht flüssiger als „a egg“.<br><small>Hör dir die Wörter an und sprich sie nach.</small>');
        },
      };
    },
  });

  // =====================================================
  // Falsche Freunde
  // =====================================================
  reg('en-freunde', {
    title: 'Falsche Freunde',
    viewBox: '0 0 360 210',
    discover: { icon: '🎁', q: 'Warum ist ein „gift“ etwas Schönes?', tag: 'Falsche Freunde' },
    create(api) {
      let start = 0;
      api.chips([{ label: 'Andere Wörter', onClick() { start = (start + 3) % T.ENT.freunde.length; api.replay(); } }]);
      return {
        reset() { api.clear(); },
        async play() {
          api.say('Manche englischen Wörter sehen aus wie deutsche Wörter, bedeuten aber etwas ganz anderes. Man nennt sie <b>falsche Freunde</b>.');
          await api.wait(4200);
          const liste = [0, 1, 2].map((i) => T.ENT.freunde[(start + i) % T.ENT.freunde.length]);
          for (let i = 0; i < liste.length; i++) {
            const [en, falsch, richtig, satz] = liste[i], y = 18 + i * 62;
            box(api.svg, 14, y, 332, 54);
            txt(api.svg, 74, y + 34, en, 22, GELB);
            const f = txt(api.svg, 230, y + 24, `nicht: ${falsch}`, 14, ROT);
            const linie = el('line', { x1: 168, y1: y + 19, x2: 168, y2: y + 19, stroke: ROT, 'stroke-width': 2.5 }, api.svg);
            api.say(`<b>${en}</b> ${U.say(en)} sieht aus wie „${falsch}“ …`);
            await api.wait(2400);
            let b = 120; try { b = f.getComputedTextLength(); } catch (e) {}
            await api.tw(500, (t) => linie.setAttribute('x2', 230 - b / 2 + (b) * t));
            linie.setAttribute('x1', 230 - b / 2);
            const r = txt(api.svg, 230, y + 44, `sondern: ${richtig}`, 15, GRUEN);
            r.setAttribute('opacity', 0); await zeig(api, r, 400);
            api.say(`<b>${en}</b> heißt <b>${richtig}</b>!<br>${satz} ${U.say(satz)}`);
            await api.wait(4200);
          }
          api.say('Gut zu wissen: Ein <b>gift</b> bekommst du gern, denn es ist ein Geschenk. Und dein Handy heißt auf Englisch <b>mobile phone</b> (amerikanisch: cell phone).');
        },
      };
    },
  });

  // =====================================================
  // British oder American English?
  // =====================================================
  reg('en-britam', {
    title: 'British oder American English?',
    viewBox: '0 0 360 210',
    discover: { icon: '🌍', q: 'Warum sagen Amerikaner „cookie“ und Briten „biscuit“?', tag: 'Länder' },
    create(api) {
      let start = 0;
      api.chips([{ label: 'Andere Wörter', onClick() { start = (start + 4) % T.ENT.britam.length; api.replay(); } }]);
      return {
        reset() {
          api.clear();
          box(api.svg, 14, 12, 160, 30, '#2a1e4a', '#c8102e'); txt(api.svg, 94, 32, 'British English', 14, W);
          box(api.svg, 186, 12, 160, 30, '#1b2a4a', '#3c78d8'); txt(api.svg, 266, 32, 'American English', 14, W);
        },
        async play() {
          api.say('Englisch spricht man in vielen Ländern, zum Beispiel in Großbritannien und in den USA. Vor rund 400 Jahren sind Engländer nach Amerika ausgewandert. Seitdem haben sich manche Wörter auseinanderentwickelt.');
          await api.wait(5200);
          const liste = [0, 1, 2, 3].map((i) => T.ENT.britam[(start + i) % T.ENT.britam.length]);
          for (let i = 0; i < liste.length; i++) {
            const [gb, us, de] = liste[i], y = 70 + i * 34;
            const a = txt(api.svg, 94, y, gb, 18, GELB), b = txt(api.svg, 266, y, us, 18, BLAU), c = txt(api.svg, 180, y + 13, de, 10, DIM);
            [a, b, c].forEach((e) => e.setAttribute('opacity', 0));
            await zeig(api, a, 300); await zeig(api, b, 300); await zeig(api, c, 300);
            api.say(`${de}: britisch <b>${gb}</b> ${U.say(gb)}, amerikanisch <b>${us}</b> ${U.say(us)}`);
            await api.wait(3000);
          }
          api.say('Verstanden wird beides. Auch die Schreibweise unterscheidet sich manchmal: britisch <b>colour</b>, amerikanisch <b>color</b>.<br><small>Tipp: Stell oben auf der EnDax-Startseite die Aussprache um. Dann hörst du dieselben Wörter britisch oder amerikanisch.</small>');
        },
      };
    },
  });

  // =====================================================
  // Pfund und Pence
  // =====================================================
  reg('en-pfund', {
    title: 'Pfund und Pence',
    viewBox: '0 0 360 210',
    discover: { icon: '💷', q: 'Warum hat das britische Pfund das Zeichen £?', tag: 'Geld' },
    create(api) {
      const MUENZEN = [[50, 30, '#c0c4cc'], [20, 25, '#c0c4cc'], [20, 25, '#c0c4cc'], [5, 17, '#c0c4cc'], [2, 21, '#c98a4b'], [2, 21, '#c98a4b'], [1, 17, '#c98a4b']];
      return {
        reset() { api.clear(); },
        async play() {
          const L = txt(api.svg, 180, 92, '£', 96, GELB);
          L.setAttribute('opacity', 0); await zeig(api, L, 600);
          api.say('In Großbritannien bezahlt man mit dem <b>Pfund</b>, englisch <b>pound</b>. Sein Zeichen £ ist ein verschnörkeltes <b>L</b>.');
          await api.wait(4000);
          txt(api.svg, 180, 128, 'L wie libra', 18, BLAU);
          api.say('Das L kommt von <b>libra</b>, dem lateinischen Wort für Pfund. Früher war ein Pfund wirklich ein Gewicht: ein Pfund Silber.');
          await api.wait(4600);
          api.clear();
          txt(api.svg, 180, 26, '100 pence = 1 pound', 18, GELB);
          api.say(`Ein Pfund hat <b>100 pence</b>. Zusammen ergeben diese Münzen genau ein Pfund: ${U.say('one hundred pence')}`);
          let x = 12, summe = 0, rAlt = 0;
          for (const [w, r0, farbe] of MUENZEN) {
            const r = r0 * 0.85;
            x += rAlt + r + 8; rAlt = r;
            const g = el('g', { opacity: 0 }, api.svg);
            el(w === 50 || w === 20 ? 'polygon' : 'circle', w === 50 || w === 20
              ? { points: Array.from({ length: 7 }, (_, k) => { const a = -Math.PI / 2 + k * 2 * Math.PI / 7; return `${(x + r * Math.cos(a)).toFixed(1)},${(96 + r * Math.sin(a)).toFixed(1)}`; }).join(' '), fill: farbe, stroke: '#ece9f7', 'stroke-width': 1.5 }
              : { cx: x, cy: 96, r, fill: farbe, stroke: '#ece9f7', 'stroke-width': 1.5 }, g);
            txt(g, x, 101, `${w}p`, Math.max(10, r * 0.55), '#141628');
            await zeig(api, g, 300);
            summe += w;
            await api.wait(250);
          }
          txt(api.svg, 180, 160, `50 + 20 + 20 + 5 + 2 + 2 + 1 = ${summe} pence = £1`, 14, GRUEN);
          await api.wait(3800);
          api.say(`Kleiner Trick beim Sprechen: Statt pence sagt man oft nur „p“, gesprochen wie das deutsche Wort „Pi“: fifty p. Und bis 1971 war es viel schwieriger: Da hatte ein Pfund <b>240</b> Pence!<br>${U.say('one pound')} £1 = one pound`);
        },
      };
    },
  });

  // =====================================================
  // Schule in England
  // =====================================================
  reg('en-schule', {
    title: 'Schule in England',
    viewBox: '0 0 360 210',
    discover: { icon: '🏫', q: 'In welche Klasse würdest du in England gehen?', tag: 'Schule' },
    create(api) {
      const X = (alter) => 30 + (alter - 4) * 25;
      return {
        reset() { api.clear(); },
        async play() {
          api.say('In England fängt die Schule früher an als bei uns: Die meisten Kinder kommen schon mit <b>4 Jahren</b> in die erste Klasse, die heißt <b>Reception</b>.');
          el('line', { x1: X(4), y1: 186, x2: X(16), y2: 186, stroke: DIM, 'stroke-width': 2 }, api.svg);
          for (let a = 4; a <= 16; a += 2) txt(api.svg, X(a), 202, String(a), 11, DIM);
          txt(api.svg, 2, 190, 'Alter', 10, DIM, 'start');
          txt(api.svg, 14, 40, 'England', 13, W, 'start');
          txt(api.svg, 14, 120, 'Sachsen', 13, W, 'start');
          const balken = (a0, a1, y, label, farbe) => { const g = el('g', { opacity: 0 }, api.svg); el('rect', { x: X(a0), y, width: X(a1) - X(a0) - 2, height: 30, rx: 6, fill: farbe }, g); txt(g, (X(a0) + X(a1)) / 2, y + 20, label, 12, '#141628'); return g; };
          await zeig(api, balken(4, 11, 48, 'Primary School', BLAU), 500);
          await api.wait(3000);
          await zeig(api, balken(11, 16, 48, 'Secondary', GELB), 500);
          api.say('Mit 11 wechseln alle Kinder auf die <b>Secondary School</b>. Die Klassen zählt man in Jahren: <b>Year 1</b>, <b>Year 2</b> … bis <b>Year 11</b>.');
          await api.wait(4400);
          await zeig(api, balken(6, 10, 128, 'Grundschule', GRUEN), 500);
          await zeig(api, balken(10, 16, 128, 'Gymnasium', ORANGE), 500);
          api.say('Bei uns geht man mit 6 in die Grundschule und mit 10 aufs Gymnasium.');
          await api.wait(3200);
          const m = el('line', { x1: X(10.5), y1: 40, x2: X(10.5), y2: 176, stroke: ROT, 'stroke-width': 3, 'stroke-dasharray': '6 5' }, api.svg);
          m.setAttribute('opacity', 0); await zeig(api, m, 400);
          txt(api.svg, X(10.5) + 8, 104, 'du', 14, ROT, 'start');
          api.say('Du bist in Klasse 5. In England wärst du in <b>Year 6</b>, dem letzten Jahr der Grundschule.<br><small>Und noch etwas ist anders: Fast alle Schulen haben eine <b>school uniform</b>, die Schule geht meist bis etwa halb vier, und mittags isst man zusammen in der Schule.</small>');
        },
      };
    },
  });

  // =====================================================
  // Stumme Buchstaben
  // =====================================================
  reg('en-stumm', {
    title: 'Stumme Buchstaben',
    viewBox: '0 0 360 210',
    discover: { icon: '🤫', q: 'Warum schreibt man „knight“ mit k, wenn man es nicht spricht?', tag: 'Schreiben' },
    create(api) {
      return {
        reset() { api.clear(); },
        async play() {
          api.say('In manchen englischen Wörtern stehen Buchstaben, die man nicht spricht. Hör mal: <b>knight</b> (Ritter) klingt wie „nait“.');
          await api.wait(3600);
          const L = T.ENT.stumm;
          for (let i = 0; i < L.length; i++) {
            const [wort, stumm, de] = L[i], y = 30 + i * 34;
            const t = el('text', { x: 148, y, 'text-anchor': 'end', class: 'k-txt', style: 'font-size:20px' }, api.svg);
            const k = wort.toLowerCase().indexOf(stumm);
            [[wort.slice(0, k), W], [wort[k], ROT], [wort.slice(k + 1), W]].forEach(([s, c]) => { if (s) el('tspan', { text: s, style: `fill:${c}` }, t); });
            const d = txt(api.svg, 160, y, `→ ${de}`, 13, GRUEN, 'start');
            t.setAttribute('opacity', 0); d.setAttribute('opacity', 0);
            await zeig(api, t, 300); await zeig(api, d, 300);
            api.say(`<b>${wort}</b> ${U.say(wort)}: Das <b>${stumm}</b> hört man nicht. Verwandt mit dem deutschen „${de}“.`);
            await api.wait(3400);
          }
          api.say('Früher hat man diese Buchstaben <b>mitgesprochen</b>, wie heute noch im Deutschen: Knecht, Knie, Lamm. Vor ein paar hundert Jahren haben die Engländer aufgehört, sie auszusprechen. Die Schreibweise ist aber geblieben.<br><small>Die Wörter verraten also, dass Englisch und Deutsch verwandte Sprachen sind.</small>');
        },
      };
    },
  });
})();
