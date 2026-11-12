/* DeDax (Deutsch) – Entdecken
 * Sprache zum Staunen. Dunkle Bühne, leuchtende Farben (wie in MaDax).
 * Jede Entdeckung: { title, viewBox, dark:true, discover:{icon, q, tag}, create(api) → {reset, play} }
 * Fakten sind geprüft (Stand 12.11.2026); Schreibweisen im Dialekt sind Lautschrift nach Gehör.
 */
(function () {
  const D = window.DeDax, U = D.util, EX = D.explainers, { el } = D.exUtil;
  const lerp = (a, b, t) => a + (b - a) * t;
  const reg = (id, def) => (EX[id] = Object.assign({ dark: true }, def));
  const W = '#ece9f7', BLAU = '#58c4dd', GELB = '#ffd166', GRUEN = '#83d483', ROT = '#ff6b6b', ORANGE = '#ff9f43', DIM = '#8a8fb5', FELD = '#1f2240';
  const txt = (p, x, y, text, size, fill, anchor) => el('text', { x, y, 'text-anchor': anchor || 'middle', class: 'k-txt', text, style: `font-size:${size || 14}px;fill:${fill || W}` }, p);
  const zeig = (api, e, ms) => api.tw(ms || 350, (t) => e.setAttribute('opacity', t));
  // Buchstaben-Kachel: Gruppe mit Rechteck und Buchstabe, Mittelpunkt bei (0,0)
  function kachel(p, x, y, s, ch, fill, schrift) {
    const g = el('g', { transform: `translate(${x},${y})` }, p);
    const r = el('rect', { x: -s / 2 + 1, y: -s / 2 + 1, width: s - 2, height: s - 2, rx: 5, fill: fill || FELD, stroke: '#3a3e66', 'stroke-width': 1.5 }, g);
    const t = el('text', { x: 0, y: s * 0.19, 'text-anchor': 'middle', class: 'k-txt', text: ch, style: `font-size:${Math.round(s * 0.56)}px;fill:${schrift || W}` }, g);
    return { g, r, t, x, y };
  }
  const reihe = (p, wort, y, s, fill, schrift) => { const x0 = 180 - ((wort.length - 1) * s) / 2; return [...wort].map((c, i) => kachel(p, x0 + i * s, y, s, c, fill, schrift)); };

  // =====================================================
  // Geheimschrift: die Cäsar-Verschiebung
  // =====================================================
  reg('caesar', {
    title: 'Cäsars Geheimschrift',
    viewBox: '0 0 360 226',
    discover: { icon: '🔐', q: 'Wie schrieb Julius Cäsar vor 2000 Jahren geheime Briefe?', tag: 'Geheimschrift' },
    create(api) {
      const ABC = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', B = 13, X0 = 11;
      const WORTE = ['HALLO', 'DACHS', 'GEHEIM', 'SCHATZ'];
      let k = 3, wort = WORTE[0], unten, klar, licht;
      api.chips([...[1, 3, 5].map((n) => ({ label: `um ${n} verschieben`, onClick() { k = n; api.replay(); } })), { label: 'Anderes Wort', onClick() { wort = WORTE[(WORTE.indexOf(wort) + 1) % WORTE.length]; api.replay(); } }]);
      const geheim = (c) => ABC[(ABC.indexOf(c) + k) % 26];
      return {
        reset() {
          api.clear();
          txt(api.svg, X0, 20, 'Klartext', 10, DIM, 'start'); txt(api.svg, X0, 78, 'Geheimschrift', 10, DIM, 'start');
          [...ABC].forEach((c, i) => { el('rect', { x: X0 + i * B, y: 26, width: B - 1, height: 18, rx: 2, fill: FELD }, api.svg); txt(api.svg, X0 + i * B + 6, 39, c, 10, W); });
          unten = el('g', {}, api.svg);
          [...ABC, ...ABC.slice(0, k)].forEach((c, i) => { el('rect', { x: X0 + i * B, y: 48, width: B - 1, height: 18, rx: 2, fill: '#3b3413', opacity: i < 26 ? 1 : 0, class: i < 26 ? (i < k ? 'weg' : '') : 'neu' }, unten); el('text', { x: X0 + i * B + 6, y: 61, 'text-anchor': 'middle', class: `k-txt ${i < 26 ? (i < k ? 'weg' : '') : 'neu'}`, text: c, style: `font-size:10px;fill:${GELB}`, opacity: i < 26 ? 1 : 0 }, unten); });
          licht = el('rect', { x: X0, y: 24, width: B - 1, height: 44, rx: 3, fill: 'none', stroke: BLAU, 'stroke-width': 2, opacity: 0 }, api.svg);
          klar = reihe(api.svg, wort, 118, 34);
        },
        async play() {
          api.say('Der römische Feldherr <b>Julius Cäsar</b> wollte nicht, dass Feinde seine Briefe lesen. Seine Idee: Er <b>verschob</b> das Alphabet.');
          await api.wait(4200);
          api.say(`Die untere Reihe rutscht um <b>${k}</b> ${k === 1 ? 'Stelle' : 'Stellen'} nach links. Was vorn herausfällt, kommt hinten wieder an.`);
          await api.tw(1500, (t) => { unten.setAttribute('transform', `translate(${-k * B * t},0)`); unten.querySelectorAll('.weg').forEach((e) => e.setAttribute('opacity', 1 - t)); unten.querySelectorAll('.neu').forEach((e) => e.setAttribute('opacity', t)); });
          await api.wait(1800);
          api.say(`Jetzt verschlüsseln wir <b>${wort}</b>: Suche jeden Buchstaben oben und nimm den, der darunter steht.`);
          await api.wait(1500);
          const s = 34, x0 = 180 - ((wort.length - 1) * s) / 2;
          for (let i = 0; i < wort.length; i++) {
            const c = wort[i], col = ABC.indexOf(c);
            licht.setAttribute('x', X0 + col * B - 0.5); licht.setAttribute('opacity', 1);
            klar[i].r.setAttribute('stroke', BLAU);
            await api.wait(650);
            const g = kachel(api.svg, X0 + col * B + 6, 57, s, geheim(c), '#3b3413', GELB);
            await api.tw(520, (t) => g.g.setAttribute('transform', `translate(${lerp(X0 + col * B + 6, x0 + i * s, t)},${lerp(57, 170, t)}) scale(${lerp(0.4, 1, t)})`));
            klar[i].r.setAttribute('stroke', '#3a3e66');
          }
          licht.setAttribute('opacity', 0);
          const g = [...wort].map(geheim).join('');
          api.say(`Aus <b>${wort}</b> wird <b class="ky">${g}</b>. Wer die Zahl ${k} kennt, schiebt einfach zurück und kann alles lesen.`);
          await api.wait(4500);
          api.say('So knackt man den Code auch ohne die Zahl: Im Deutschen ist <b>E</b> der häufigste Buchstabe. Das Zeichen, das im Geheimtext am häufigsten vorkommt, ist also wahrscheinlich ein E.<br><small>Schreib einem Freund eine Nachricht und verrate ihm nur die Zahl!</small>');
        },
      };
    },
  });

  // =====================================================
  // Palindrome: Wörter, die rückwärts gleich bleiben
  // =====================================================
  reg('palindrom', {
    title: 'Rückwärts-Wörter',
    viewBox: '0 0 360 200',
    discover: { icon: '⇄', q: 'Welche Wörter kann man auch rückwärts lesen?', tag: 'Wortspiel' },
    create(api) {
      const WORTE = ['OTTO', 'ANNA', 'RENTNER', 'REITTIER', 'LAGERREGAL'];
      let wort = WORTE[2];
      api.chips(WORTE.map((w) => ({ label: w.charAt(0) + w.slice(1).toLowerCase(), onClick() { wort = w; api.replay(); } })));
      async function dreh(w, y, farbe) {
        const s = Math.min(34, 320 / w.length), ks = reihe(api.svg, w, y, s);
        await api.wait(900);
        const n = w.length;
        await api.tw(1700, (t) => ks.forEach((k, i) => { const ziel = ks[n - 1 - i].x; k.g.setAttribute('transform', `translate(${lerp(k.x, ziel, t)},${y - Math.sin(t * Math.PI) * (i < n / 2 ? 26 : -26)})`); }));
        const neu = [...w].reverse().join('');
        ks.forEach((k) => { k.r.setAttribute('stroke', neu === w ? GRUEN : ROT); k.r.setAttribute('stroke-width', 2.5); });
        return neu;
      }
      return {
        reset() { api.clear(); },
        async play() {
          api.say(`Lies <b>${wort.charAt(0) + wort.slice(1).toLowerCase()}</b> von hinten nach vorn. Die Buchstaben tauschen die Plätze …`);
          const neu = await dreh(wort, 62, GRUEN);
          txt(api.svg, 180, 104, `rückwärts: ${neu}`, 13, GRUEN);
          api.say(`… und es steht wieder <b>${neu}</b> da! Solche Wörter heißen <b>Palindrome</b>.`);
          await api.wait(3600);
          api.say('Bei den meisten Wörtern klappt das nicht:');
          const n2 = await dreh('HUND', 150, ROT);
          txt(api.svg, 300, 155, `→ ${n2}?`, 13, ROT);
          await api.wait(2600);
          api.say('Es gibt sogar ganze Palindrom-Sätze: <b>„Ein Esel lese nie.“</b><br>Lies ihn Buchstabe für Buchstabe rückwärts!<br><small>Noch mehr: Uhu, Kajak, Radar, Ebbe. Findest du ein eigenes?</small>');
        },
      };
    },
  });

  // =====================================================
  // Woher kommen Familiennamen?
  // =====================================================
  reg('namen', {
    title: 'Woher kommen die Familiennamen?',
    viewBox: '0 0 360 216',
    discover: { icon: 'Aa', q: 'Warum heißen so viele Menschen Müller, Schmidt oder Schneider?', tag: 'Namen' },
    create(api) {
      const GR = {
        Beruf: ['Viele Namen nennen den <b>Beruf</b>, den jemand vor Hunderten von Jahren hatte.', [['Müller', 'mahlte Korn in der Mühle'], ['Schmidt', 'der Schmied am Amboss'], ['Schneider', 'nähte Kleider'], ['Fischer', 'fing Fische'], ['Weber', 'webte Stoffe']]],
        Aussehen: ['Manche Namen beschreiben, wie jemand <b>aussah</b>.', [['Klein', 'war nicht sehr groß'], ['Lang', 'war besonders groß'], ['Schwarz', 'hatte dunkle Haare'], ['Krause', 'hatte lockiges Haar'], ['Braun', 'braune Haare oder Augen']]],
        Herkunft: ['Andere Namen sagen, <b>woher</b> jemand kam.', [['Bayer', 'kam aus Bayern'], ['Böhm', 'kam aus Böhmen'], ['Frank', 'kam aus Franken'], ['Hesse', 'kam aus Hessen'], ['Schwab', 'kam aus Schwaben']]],
        Vater: ['Und manche nennen einfach den <b>Vater</b>.', [['Peters', 'Sohn von Peter'], ['Hansen', 'Sohn von Hans'], ['Jansen', 'Sohn von Jan'], ['Friedrichs', 'Sohn von Friedrich'], ['Martens', 'Sohn von Martin']]],
      };
      let gruppe = 'Beruf';
      api.chips(Object.keys(GR).map((g) => ({ label: g, onClick() { gruppe = g; api.replay(); } })));
      return {
        reset() { api.clear(); },
        async play() {
          const [satz, liste] = GR[gruppe];
          if (gruppe === 'Beruf') {
            api.say('Vor etwa 800 Jahren hatten die Menschen nur einen <b>Vornamen</b>. Als die Städte wuchsen, gab es plötzlich zu viele Hans und Anna. Welcher Hans war gemeint?');
            const h = [70, 180, 290].map((x) => txt(api.svg, x, 60, 'Hans', 20, W));
            await api.wait(4200);
            ['der Müller', 'der Schmied', 'der Lange'].forEach((z, i) => txt(api.svg, [70, 180, 290][i], 84, z, 12, GELB));
            api.say('Also bekam jeder einen <b>Beinamen</b>: Hans der Müller, Hans der Schmied, Hans der Lange. Daraus wurden die Familiennamen.');
            await api.wait(4600);
            api.clear();
          }
          api.say(satz);
          for (let i = 0; i < liste.length; i++) {
            const y = 34 + i * 38;
            const a = txt(api.svg, 24, y, liste[i][0], 20, GELB, 'start'); a.setAttribute('opacity', 0);
            const p = el('path', { d: `M 150 ${y - 6} H 176 M 170 ${y - 11} L 177 ${y - 6} L 170 ${y - 1}`, fill: 'none', stroke: DIM, 'stroke-width': 2, 'stroke-linecap': 'round', opacity: 0 }, api.svg);
            const b = txt(api.svg, 188, y, liste[i][1], 13, W, 'start'); b.setAttribute('opacity', 0);
            await zeig(api, a); zeig(api, p); await zeig(api, b);
            await api.wait(1500);
          }
          api.say(gruppe === 'Beruf' ? '<b>Müller</b> ist heute der häufigste Familienname in Deutschland. Früher gab es eben in fast jedem Dorf eine Mühle.<br><small>Tippe unten auf Aussehen, Herkunft oder Vater. Und was bedeutet dein Name?</small>' : `${satz}<br><small>Was könnte dein Familienname bedeuten? Frag zu Hause nach!</small>`);
        },
      };
    },
  });

  // =====================================================
  // Wörter auf Wanderschaft
  // =====================================================
  reg('wandern', {
    title: 'Wörter auf Wanderschaft',
    viewBox: '0 0 360 216',
    discover: { icon: '🧭', q: 'Welche deutschen Wörter kommen eigentlich aus anderen Sprachen?', tag: 'Wortgeschichte' },
    create(api) {
      const REIN = [['Latein', 'fenestra', 'Fenster'], ['Latein', 'murus', 'Mauer'], ['Englisch', 'cakes', 'Keks'], ['Arabisch', 'sukkar', 'Zucker'], ['Türkisch', 'yoğurt', 'Joghurt']];
      const RAUS = [['Englisch', 'kindergarten', 'Kindergarten'], ['Englisch', 'rucksack', 'Rucksack'], ['Russisch', 'buterbrod', 'Butterbrot'], ['Japanisch', 'arubaito', 'Arbeit'], ['Französisch', 'vasistas', 'Was ist das?']];
      let raus = false;
      api.chips([{ label: 'Wörter kommen an', onClick() { raus = false; api.replay(); } }, { label: 'Deutsche Wörter reisen', onClick() { raus = true; api.replay(); } }]);
      return {
        reset() { api.clear(); txt(api.svg, 24, 18, raus ? 'Deutsch' : 'andere Sprache', 10, DIM, 'start'); txt(api.svg, 336, 18, raus ? 'andere Sprache' : 'Deutsch', 10, DIM, 'end'); },
        async play() {
          const liste = raus ? RAUS : REIN;
          api.say(raus ? 'Auch <b>deutsche Wörter</b> sind um die Welt gewandert. Andere Sprachen haben sie einfach übernommen.' : 'Viele Wörter, die ganz deutsch klingen, sind vor langer Zeit <b>eingewandert</b>. Händler, Soldaten und Reisende haben sie mitgebracht.');
          await api.wait(3600);
          for (let i = 0; i < liste.length; i++) {
            const [spr, fremd, de] = liste[i], y = 46 + i * 36;
            const links = raus ? de : fremd, rechts = raus ? fremd : de;
            const a = txt(api.svg, 24, y, links, 16, raus ? GELB : BLAU, 'start'); a.setAttribute('opacity', 0);
            const s = txt(api.svg, raus ? 336 : 24, y + 13, spr, 9, DIM, raus ? 'end' : 'start'); s.setAttribute('opacity', 0);
            await zeig(api, a); zeig(api, s);
            const p = el('circle', { cx: 150, cy: y - 5, r: 4, fill: ORANGE }, api.svg);
            const spur = el('line', { x1: 150, y1: y - 5, x2: 150, y2: y - 5, stroke: '#3a3e66', 'stroke-width': 2, 'stroke-dasharray': '3 4' }, api.svg);
            await api.tw(800, (t) => { p.setAttribute('cx', lerp(150, 212, t)); spur.setAttribute('x2', lerp(150, 212, t)); });
            p.remove();
            const b = txt(api.svg, 336, y, rechts, 16, raus ? BLAU : GELB, 'end'); b.setAttribute('opacity', 0);
            await zeig(api, b);
            await api.wait(1200);
          }
          api.say(raus
            ? 'In Japan heißt ein Nebenjob <b>arubaito</b> (von „Arbeit“). Und das kleine Klappfenster heißt in Frankreich <b>vasistas</b>: Man erzählt, es komme von der Frage „Was ist das?“.<br><small>Tippe auf „Wörter kommen an“ für die andere Richtung.</small>'
            : 'Die Römer brachten das Bauen mit Stein nach Deutschland und gleich die Wörter dazu: <b>Fenster</b>, <b>Mauer</b>, auch Ziegel und Keller. Sprachen leihen sich ständig Wörter aus.<br><small>Tippe auf „Deutsche Wörter reisen“ für die andere Richtung.</small>');
        },
      };
    },
  });

  // =====================================================
  // Sächsisch und Hochdeutsch
  // =====================================================
  reg('saechsisch', {
    title: 'Sächsisch: die Weichen besiegen die Harten',
    viewBox: '0 0 360 210',
    discover: { icon: 'nu', q: 'Was macht Sächsisch so weich? Und was ist eine Bemme?', tag: 'Dialekt' },
    create(api) {
      const WORTE = ['KOFFER', 'TANTE', 'PAPIER', 'KAPUTT'];
      const WEICH = { K: 'G', T: 'D', P: 'B' };
      const VOK = [['nu', 'ja'], ['Bemme', 'belegtes Brot'], ['Plinsen', 'Eierkuchen'], ['Mutschekiebchen', 'Marienkäfer'], ['Hitsche', 'Fußbank']];
      let wort = WORTE[0];
      api.chips(WORTE.map((w) => ({ label: w.charAt(0) + w.slice(1).toLowerCase(), onClick() { wort = w; api.replay(); } })));
      return {
        reset() { api.clear(); },
        async play() {
          api.say('Ein <b>Dialekt</b> ist die Sprache einer Gegend. Rund um Dresden spricht man <b>Sächsisch</b>. Sein Geheimnis: Harte Laute werden weich.');
          const ks = reihe(api.svg, wort, 52, 38);
          txt(api.svg, 180, 22, 'Hochdeutsch', 10, DIM);
          await api.wait(3800);
          api.say('Aus <b>k</b> wird g, aus <b>t</b> wird d, aus <b>p</b> wird b. Die Sachsen sagen dazu: „Die Weichen besiegen die Harten.“');
          let neu = '';
          for (let i = 0; i < wort.length; i++) {
            const c = wort[i], w = WEICH[c];
            neu += w || c;
            if (!w) continue;
            ks[i].r.setAttribute('stroke', ROT);
            await api.wait(500);
            await api.tw(300, (t) => ks[i].g.setAttribute('transform', `translate(${ks[i].x},52) scale(${1 - t},1)`));
            ks[i].t.textContent = w; ks[i].t.style.fill = '#141628'; ks[i].r.setAttribute('fill', GELB); ks[i].r.setAttribute('stroke', GELB);
            await api.tw(300, (t) => ks[i].g.setAttribute('transform', `translate(${ks[i].x},52) scale(${t},1)`));
            await api.wait(350);
          }
          txt(api.svg, 180, 92, `auf Sächsisch klingt es wie: ${neu.charAt(0) + neu.slice(1).toLowerCase()}`, 12, GELB);
          await api.wait(3200);
          api.say('Dazu kommen eigene Wörter, die man anderswo nicht kennt:');
          for (let i = 0; i < VOK.length; i++) {
            const y = 118 + i * 19;
            const a = txt(api.svg, 170, y, VOK[i][0], 14, GELB, 'end'); a.setAttribute('opacity', 0);
            const b = txt(api.svg, 190, y, '= ' + VOK[i][1], 12, W, 'start'); b.setAttribute('opacity', 0);
            await zeig(api, a, 250); await zeig(api, b, 250); await api.wait(900);
          }
          api.say('Dialekt klingt nach Zuhause. <b>Hochdeutsch</b> verstehen dafür alle, von der Nordsee bis zu den Alpen. Darum schreibt man in der Schule Hochdeutsch.<br><small>Kennst du noch ein sächsisches Wort? Frag deine Großeltern!</small>');
        },
      };
    },
  });

  // =====================================================
  // Das längste Wort
  // =====================================================
  reg('langwort', {
    title: 'Wie lang kann ein Wort werden?',
    viewBox: '0 0 360 200',
    discover: { icon: '…', q: 'Wie baut man ein Wort mit über 40 Buchstaben?', tag: 'Zusammengesetzte Wörter' },
    create(api) {
      // [Baustein, Artikel des Worts bis hierher, Erklärung]
      const TEILE = [['Donau', 'die', 'ein Fluss'], ['dampf', 'der', 'Dampf über der Donau'], ['schiff', 'das', 'ein Schiff mit Dampfmaschine'], ['fahrt', 'die', 'eine Fahrt mit diesem Schiff'], ['sgesellschaft', 'die', 'eine Firma für solche Fahrten'], ['skapitän', 'der', 'der Kapitän dieser Firma'], ['smütze', 'die', 'und seine Mütze!']];
      const FARBEN = [BLAU, GELB, GRUEN, ORANGE, '#b18cff', ROT, BLAU];
      let zeile, zahl, art;
      const mal = (n) => {
        while (zeile.firstChild) zeile.removeChild(zeile.firstChild);
        // ab dem fünften Baustein in zwei Zeilen, sonst wird die Schrift zu klein
        TEILE.slice(0, n).forEach((t, i) => { const e = el('tspan', { text: t[0], fill: FARBEN[i] }, zeile); if (i === 4 && n > 4) { e.setAttribute('x', 180); e.setAttribute('dy', 30); } });
        zeile.setAttribute('y', n > 4 ? 86 : 100);
        let fs = 30; zeile.setAttribute('style', `font-size:${fs}px`);
        try { while (fs > 7 && zeile.getBBox().width > 336) { fs -= 0.5; zeile.setAttribute('style', `font-size:${fs}px`); } } catch (e) {}
        const w = TEILE.slice(0, n).map((t) => t[0]).join('');
        zahl.textContent = `${w.length} Buchstaben`; art.textContent = TEILE[n - 1][1];
        return w;
      };
      return {
        reset() {
          api.clear();
          art = txt(api.svg, 180, 52, '', 16, DIM);
          zeile = el('text', { x: 180, y: 100, 'text-anchor': 'middle', class: 'k-txt' }, api.svg);
          zahl = txt(api.svg, 180, 150, '', 16, W);
        },
        async play() {
          api.say('Im Deutschen darf man Wörter <b>aneinanderhängen</b>, so lange man will. Wir starten mit einem Fluss.');
          for (let n = 1; n <= TEILE.length; n++) {
            const w = mal(n);
            if (n > 1) api.say(`<b>${TEILE[n - 1][1]} ${w}</b>: ${TEILE[n - 1][2]}`);
            await api.wait(n === 1 ? 2600 : 2700);
          }
          const w = TEILE.map((t) => t[0]).join('');
          api.say(`<b>${w.length} Buchstaben</b>, und es ist immer noch <b>ein</b> Wort! Schau auf den Artikel: Er hat sich jedes Mal geändert. Das <b>letzte</b> Wort bestimmt ihn, und es sagt, was die Sache ist: eine Mütze.<br><small>Erfinde selbst ein Riesenwort!</small>`);
        },
      };
    },
  });
})();
