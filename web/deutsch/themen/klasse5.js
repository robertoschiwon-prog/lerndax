/* DeDax (Deutsch) – Themen und Aufgaben Klasse 5 (Lehrplan Gymnasium Sachsen)
 *
 * Aufbau wie in MaDax: Jeder Generator liefert bei jedem Aufruf eine neue Aufgabe
 *   { prompt, hint, solution, answerText?, ex? } und dazu eine der Antwortformen
 *   choices/correct   Auswahl
 *   fields            Eingabefelder; type:'text' = Wort eintippen (answer: Wort oder Liste erlaubter Wörter)
 *   layout:'satz'     Felder stehen als Lücken in einem Satz (prefix/suffix sind die Satzteile)
 *   tap               Wörter antippen: { tokens:[…], correct:[Index …], one?, gaps? }
 * Aufgaben entstehen aus geprüften Wort- und Satzlisten (selbst geschrieben, nichts aus dem Schulbuch).
 * Keine echten Namen: nur neutrale Vornamen.
 */
(function () {
  const D = (window.DeDax = window.DeDax || {});
  const U = (D.util = D.util || {});
  const R = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
  const pick = (arr) => arr[R(0, arr.length - 1)];
  const shuffle = (arr) => { const a = arr.slice(); for (let i = a.length - 1; i > 0; i--) { const j = R(0, i); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  Object.assign(U, { R, pick, shuffle, fmt: (x) => String(x) });
  // gewichtete Auswahl einer Aufgabenart: [[Gewicht, Funktion], …]
  U.wahl = (liste) => { let r = Math.random() * liste.reduce((s, x) => s + x[0], 0); for (const [w, f] of liste) { r -= w; if (r <= 0) return f(); } return liste[0][1](); };

  // =====================================================
  // Verben (für Zeitformen und später Personalformen, Partizip, Imperativ)
  // =====================================================
  // [Grundform, du, er/sie/es, Präteritum (ich/er), Partizip II, Hilfsverb (h/s), Ergänzung, Art]
  // Art: s = schwach (regelmäßig), st = stark, g = gemischt
  const V = [
    ['spielen', 'spielst', 'spielt', 'spielte', 'gespielt', 'h', 'im Garten', 's'],
    ['lachen', 'lachst', 'lacht', 'lachte', 'gelacht', 'h', 'über den Witz', 's'],
    ['kaufen', 'kaufst', 'kauft', 'kaufte', 'gekauft', 'h', 'ein Eis', 's'],
    ['malen', 'malst', 'malt', 'malte', 'gemalt', 'h', 'ein Bild', 's'],
    ['suchen', 'suchst', 'sucht', 'suchte', 'gesucht', 'h', 'den Schlüssel', 's'],
    ['kochen', 'kochst', 'kocht', 'kochte', 'gekocht', 'h', 'eine Suppe', 's'],
    ['bauen', 'baust', 'baut', 'baute', 'gebaut', 'h', 'eine Hütte', 's'],
    ['hören', 'hörst', 'hört', 'hörte', 'gehört', 'h', 'ein Geräusch', 's'],
    ['lernen', 'lernst', 'lernt', 'lernte', 'gelernt', 'h', 'ein Gedicht', 's'],
    ['fragen', 'fragst', 'fragt', 'fragte', 'gefragt', 'h', 'nach dem Weg', 's'],
    ['arbeiten', 'arbeitest', 'arbeitet', 'arbeitete', 'gearbeitet', 'h', 'im Garten', 's'],
    ['warten', 'wartest', 'wartet', 'wartete', 'gewartet', 'h', 'auf den Bus', 's'],
    ['reisen', 'reist', 'reist', 'reiste', 'gereist', 's', 'nach Italien', 's'],
    ['wandern', 'wanderst', 'wandert', 'wanderte', 'gewandert', 's', 'durch den Wald', 's'],
    ['klettern', 'kletterst', 'klettert', 'kletterte', 'geklettert', 's', 'auf den Baum', 's'],
    ['laufen', 'läufst', 'läuft', 'lief', 'gelaufen', 's', 'durch den Park', 'st'],
    ['gehen', 'gehst', 'geht', 'ging', 'gegangen', 's', 'in die Schule', 'st'],
    ['kommen', 'kommst', 'kommt', 'kam', 'gekommen', 's', 'nach Hause', 'st'],
    ['fahren', 'fährst', 'fährt', 'fuhr', 'gefahren', 's', 'mit dem Rad', 'st'],
    ['fliegen', 'fliegst', 'fliegt', 'flog', 'geflogen', 's', 'nach Spanien', 'st'],
    ['springen', 'springst', 'springt', 'sprang', 'gesprungen', 's', 'über den Bach', 'st'],
    ['fallen', 'fällst', 'fällt', 'fiel', 'gefallen', 's', 'in den Schnee', 'st'],
    ['bleiben', 'bleibst', 'bleibt', 'blieb', 'geblieben', 's', 'zu Hause', 'st'],
    ['lesen', 'liest', 'liest', 'las', 'gelesen', 'h', 'ein Buch', 'st'],
    ['schreiben', 'schreibst', 'schreibt', 'schrieb', 'geschrieben', 'h', 'einen Brief', 'st'],
    ['essen', 'isst', 'isst', 'aß', 'gegessen', 'h', 'einen Apfel', 'st'],
    ['trinken', 'trinkst', 'trinkt', 'trank', 'getrunken', 'h', 'ein Glas Wasser', 'st'],
    ['sehen', 'siehst', 'sieht', 'sah', 'gesehen', 'h', 'einen Fuchs', 'st'],
    ['finden', 'findest', 'findet', 'fand', 'gefunden', 'h', 'eine Muschel', 'st'],
    ['singen', 'singst', 'singt', 'sang', 'gesungen', 'h', 'ein Lied', 'st'],
    ['helfen', 'hilfst', 'hilft', 'half', 'geholfen', 'h', 'beim Aufräumen', 'st'],
    ['schlafen', 'schläfst', 'schläft', 'schlief', 'geschlafen', 'h', 'im Zelt', 'st'],
    ['tragen', 'trägst', 'trägt', 'trug', 'getragen', 'h', 'den Korb', 'st'],
    ['nehmen', 'nimmst', 'nimmt', 'nahm', 'genommen', 'h', 'den Bus', 'st'],
    ['rufen', 'rufst', 'ruft', 'rief', 'gerufen', 'h', 'um Hilfe', 'st'],
    ['werfen', 'wirfst', 'wirft', 'warf', 'geworfen', 'h', 'den Ball', 'st'],
    ['bringen', 'bringst', 'bringt', 'brachte', 'gebracht', 'h', 'die Post', 'g'],
    ['denken', 'denkst', 'denkt', 'dachte', 'gedacht', 'h', 'an die Ferien', 'g'],
    ['rennen', 'rennst', 'rennt', 'rannte', 'gerannt', 's', 'zum Bus', 'g'],
  ].map(([inf, du, er, praet, part, aux, rest, art]) => ({ inf, du, er, praet, part, aux: aux === 's' ? 'sein' : 'haben', rest, art }));

  // Personen: 0 ich, 1 du, 2 er/sie/es, 3 wir, 4 ihr, 5 sie (Mehrzahl)
  const HILF = {
    haben: { praes: ['habe', 'hast', 'hat', 'haben', 'habt', 'haben'], praet: ['hatte', 'hattest', 'hatte', 'hatten', 'hattet', 'hatten'] },
    sein: { praes: ['bin', 'bist', 'ist', 'sind', 'seid', 'sind'], praet: ['war', 'warst', 'war', 'waren', 'wart', 'waren'] },
    werden: { praes: ['werde', 'wirst', 'wird', 'werden', 'werdet', 'werden'] },
  };
  const stamm = (v) => (/(er|el)n$/.test(v.inf) ? v.inf.slice(0, -1) : v.inf.slice(0, -2));
  function praesens(v, p) {
    const s = stamm(v);
    return [s + 'e', v.du, v.er, v.inf, s + (/[td]$/.test(s) ? 'et' : 't'), v.inf][p];
  }
  // Präteritum: nur ich, er/sie/es, wir, sie (Mehrzahl). „du“ und „ihr“ lassen wir weg (du lasest? ihr fandet?).
  function praeteritum(v, p) {
    const schwach = /te$/.test(v.praet);
    return { 0: v.praet, 2: v.praet, 3: v.praet + (schwach ? 'n' : 'en'), 5: v.praet + (schwach ? 'n' : 'en') }[p];
  }
  const SUBJ = [
    { t: 'Ich', p: 0 }, { t: 'Du', p: 1 }, { t: 'Er', p: 2 }, { t: 'Sie', p: 2 }, { t: 'Wir', p: 3 }, { t: 'Ihr', p: 4 },
    { t: 'Lina', p: 2 }, { t: 'Emil', p: 2 }, { t: 'Mein Bruder', p: 2 }, { t: 'Die Lehrerin', p: 2 }, { t: 'Unser Nachbar', p: 2 }, { t: 'Das Mädchen', p: 2 },
    { t: 'Die Kinder', p: 5 }, { t: 'Meine Eltern', p: 5 }, { t: 'Mia und Ben', p: 5 }, { t: 'Die Nachbarn', p: 5 },
  ];
  const ZEITEN = ['praesens', 'praeteritum', 'perfekt', 'plusquamperfekt', 'futur'];
  const ZNAME = { praesens: 'Präsens', praeteritum: 'Präteritum', perfekt: 'Perfekt', plusquamperfekt: 'Plusquamperfekt', futur: 'Futur I' };
  const ZDEUTSCH = { praesens: 'Gegenwart', praeteritum: 'Vergangenheit', perfekt: 'vollendete Gegenwart', plusquamperfekt: 'Vorvergangenheit', futur: 'Zukunft' };

  // Baut einen Satz: { subj, v1 (Personalform an 2. Stelle), rest, v2 (Verbteil am Satzende oder ''), zeit, inf }
  function satz(v, s, zeit) {
    const p = s.p;
    let v1, v2 = '';
    if (zeit === 'praesens') v1 = praesens(v, p);
    else if (zeit === 'praeteritum') v1 = praeteritum(v, p);
    else if (zeit === 'perfekt') { v1 = HILF[v.aux].praes[p]; v2 = v.part; }
    else if (zeit === 'plusquamperfekt') { v1 = HILF[v.aux].praet[p]; v2 = v.part; }
    else { v1 = HILF.werden.praes[p]; v2 = v.inf; }
    return { subj: s.t, v1, rest: v.rest, v2, zeit, inf: v.inf, aux: v.aux, art: v.art };
  }
  const subjFuer = (zeit) => pick(SUBJ.filter((s) => zeit !== 'praeteritum' || [0, 2, 3, 5].includes(s.p)));
  const text = (s) => `${s.subj} ${s.v1} ${s.rest}${s.v2 ? ' ' + s.v2 : ''}.`;
  // Satz mit farbig markierten Verbteilen (für Lösungswege)
  const markiert = (s) => `${s.subj} <b class="vb">${s.v1}</b> ${s.rest}${s.v2 ? ` <b class="vb">${s.v2}</b>` : ''}.`;
  const zufallSatz = (zeit, filter) => { zeit = zeit || pick(ZEITEN); return satz(pick(filter ? V.filter(filter) : V), subjFuer(zeit), zeit); };
  // So ist die Zeitform gebaut (ein Satz für Lösungswege und Animation)
  function bauplan(s) {
    const h = s.aux;
    return {
      praesens: `Nur <b>ein</b> Verb in der Gegenwartsform: <b>${s.v1}</b>.`,
      praeteritum: `Nur <b>ein</b> Verb in der Vergangenheitsform: <b>${s.v1}</b> (Grundform: ${s.inf}).`,
      perfekt: `<b>${s.v1}</b> (Gegenwartsform von „${h}“) + Partizip <b>${s.v2}</b>.`,
      plusquamperfekt: `<b>${s.v1}</b> (Vergangenheitsform von „${h}“) + Partizip <b>${s.v2}</b>.`,
      futur: `<b>${s.v1}</b> (Form von „werden“) + Grundform <b>${s.v2}</b>.`,
    }[s.zeit];
  }
  const EX = (s, mode) => ({ mode: mode || 'zeit', zeit: s.zeit, subj: s.subj, v1: s.v1, rest: s.rest, v2: s.v2, inf: s.inf, aux: s.aux });
  const TIPP_ERKENNEN = 'Suche zuerst <b>alle Verbteile</b>. Steht nur ein Verb da: Präsens oder Präteritum. Mit <i>haben</i> oder <i>sein</i> + Partizip: Perfekt (hat, ist …) oder Plusquamperfekt (hatte, war …). Mit <i>werden</i> + Grundform: Futur I.';
  const warumHilf = (v) => (v.inf === 'bleiben' ? '„bleiben“ ist eine Ausnahme: Es nimmt <b>sein</b>, obwohl sich nichts bewegt.'
    : v.aux === 'sein' ? `„${v.inf}“ beschreibt eine Bewegung von einem Ort zum anderen. Solche Verben nehmen <b>sein</b>.`
    : `Die meisten Verben nehmen <b>haben</b>, auch „${v.inf}“.`);

  // ---------- Aufgabenarten ----------
  // A: Zeitform bestimmen
  function erkennen() {
    const s = zufallSatz();
    return {
      prompt: `In welcher Zeitform steht der Satz?<br><span class="bsp">${text(s)}</span>`,
      choices: ZEITEN.map((z) => ZNAME[z]), correct: ZEITEN.indexOf(s.zeit),
      hint: TIPP_ERKENNEN,
      solution: `${markiert(s)}<br>${bauplan(s)}<br>Das ist das <b>${ZNAME[s.zeit]}</b> (${ZDEUTSCH[s.zeit]}).`,
      ex: EX(s),
    };
  }
  // B: Verbform eintippen (Präsens oder Präteritum)
  function einsetzen() {
    const zeit = pick(['praeteritum', 'praeteritum', 'praesens']);
    // im Präsens die spannenden Fälle: du / er mit Vokalwechsel oder -est/-et
    const s = zeit === 'praesens' ? satz(pick(V.filter((v) => v.art === 'st' || /[td]en$/.test(v.inf))), pick(SUBJ.filter((x) => x.p === 1 || x.p === 2)), zeit) : zufallSatz(zeit);
    const v = V.find((x) => x.inf === s.inf);
    return {
      prompt: `Setze <b>${s.inf}</b> ins <b>${ZNAME[zeit]}</b>.`,
      layout: 'satz',
      fields: [{ type: 'text', answer: s.v1, prefix: s.subj, suffix: s.rest + '.', label: `${s.inf} im ${ZNAME[zeit]}` }],
      hint: zeit === 'praesens'
        ? `Präsens heißt Gegenwart: Es passiert jetzt. Sprich den Satz leise: „${s.subj} … ${s.rest}.“ Bei manchen Verben ändert sich bei <i>du</i> und <i>er/sie/es</i> der Vokal (ich fahre, du f<b>ä</b>hrst).`
        : (v.art === 's'
          ? 'Präteritum heißt Vergangenheit. Regelmäßige Verben bekommen ein <b>-te</b>: ich spiel<b>te</b>, wir spiel<b>ten</b>.'
          : 'Präteritum heißt Vergangenheit. Dieses Verb ist unregelmäßig: Der Vokal im Wort ändert sich (wie bei singen → sang). Sprich es dir vor: „Gestern …“'),
      solution: `${markiert(s)}<br>${zeit === 'praesens' ? `Gegenwart von „${s.inf}“ zu „${s.subj}“: <b>${s.v1}</b>.` : `${s.inf} → <b>${v.praet}</b>${s.v1 !== v.praet ? ` → mit „${s.subj}“: <b>${s.v1}</b>` : ''}. ${v.art === 's' ? 'Regelmäßig mit -te.' : v.art === 'g' ? 'Der Vokal ändert sich, und es kommt -te dazu.' : 'Unregelmäßig: Der Vokal ändert sich, es gibt kein -te.'}`}`,
      ex: EX(s, 'bilden'),
    };
  }
  // C: zweiteilige Zeitform bilden (Perfekt, Plusquamperfekt, Futur I)
  function bilden() {
    const zeit = pick(['perfekt', 'perfekt', 'plusquamperfekt', 'futur']);
    const s = zufallSatz(zeit);
    const v = V.find((x) => x.inf === s.inf);
    return {
      prompt: `Bilde das <b>${ZNAME[zeit]}</b> von <b>${s.inf}</b>.`,
      layout: 'satz',
      fields: [
        { type: 'text', answer: s.v1, prefix: s.subj, label: zeit === 'futur' ? 'Form von werden' : 'Hilfsverb' },
        { type: 'text', answer: s.v2, prefix: s.rest, suffix: '.', label: zeit === 'futur' ? 'Grundform' : 'Partizip' },
      ],
      hint: {
        perfekt: 'Perfekt = Gegenwartsform von <b>haben</b> oder <b>sein</b> (an 2. Stelle) + <b>Partizip</b> am Satzende (ge…t oder ge…en).',
        plusquamperfekt: 'Plusquamperfekt = <b>hatte</b> oder <b>war</b> in der passenden Form (an 2. Stelle) + <b>Partizip</b> am Satzende.',
        futur: 'Futur I = Form von <b>werden</b> (an 2. Stelle) + <b>Grundform</b> des Verbs am Satzende.',
      }[zeit],
      solution: `${markiert(s)}<br>${bauplan(s)}${zeit === 'futur' ? '' : '<br>' + warumHilf(v)}`,
      ex: EX(s, 'bilden'),
    };
  }
  // D: alle Verbteile antippen
  function antippen() {
    const s = zufallSatz(pick(['perfekt', 'plusquamperfekt', 'futur', 'perfekt', 'praeteritum']));
    const tokens = [...s.subj.split(' '), s.v1, ...s.rest.split(' ')];
    const correct = [s.subj.split(' ').length];
    if (s.v2) { tokens.push(s.v2 + '.'); correct.push(tokens.length - 1); } else tokens[tokens.length - 1] += '.';
    return {
      prompt: 'Tippe <b>alle Verbteile</b> an. Manchmal ist es einer, manchmal sind es zwei.',
      tap: { tokens, correct },
      answerText: s.v2 ? `${s.v1} … ${s.v2}` : s.v1,
      hint: 'Die Personalform des Verbs steht im Aussagesatz immer an <b>2. Stelle</b>. Gehört noch ein Verbteil dazu, steht er ganz am <b>Satzende</b>.',
      solution: `${markiert(s)}<br>${s.v2 ? `Die zwei Verbteile umklammern den Rest des Satzes. ${bauplan(s)} Das ist das <b>${ZNAME[s.zeit]}</b>.` : `Hier gibt es nur einen Verbteil. Das ist das <b>${ZNAME[s.zeit]}</b>.`}`,
      ex: EX(s),
    };
  }
  // E: haben oder sein?
  function hilfsverb() {
    const v = pick(V);
    const s = satz(v, pick(SUBJ), 'perfekt');
    return {
      prompt: `Mit welchem Hilfsverb bildet <b>${v.inf}</b> das Perfekt?`,
      choices: ['haben', 'sein'], correct: v.aux === 'sein' ? 1 : 0,
      hint: 'Bilde einen Satz: „Ich … gestern …“. Was klingt richtig?',
      solution: `${markiert(s)}<br>${warumHilf(v)}`,
      ex: EX(s, 'hilf'),
    };
  }
  // F: Grundform finden
  function grundform() {
    const v = pick(V.filter((x) => x.art !== 's'));
    const zeit = pick(['praeteritum', 'perfekt']);
    const s = satz(v, subjFuer(zeit), zeit);
    return {
      prompt: `Wie heißt die <b>Grundform</b> (der Infinitiv) des Verbs?<br><span class="bsp">${text(s)}</span>`,
      fields: [{ type: 'text', answer: v.inf, ci: true, label: 'Grundform' }],
      hint: 'Die Grundform steht im Wörterbuch und endet auf <b>-en</b> oder <b>-n</b>. Frage dich: Was tun sie? „Sie wollen …“',
      solution: `${markiert(s)}<br>${zeit === 'perfekt' ? `Das Partizip „${v.part}“` : `Die Form „${s.v1}“`} gehört zur Grundform <b>${v.inf}</b>.`,
      ex: EX(s, 'grundform'),
    };
  }
  // G: Welcher Satz steht in der gesuchten Zeitform?
  function welcherSatz() {
    const v = pick(V), su = pick(SUBJ.filter((x) => [0, 2, 3, 5].includes(x.p)));
    const zeiten = shuffle(ZEITEN).slice(0, 4);
    const ziel = zeiten[R(0, 3)];
    const s = satz(v, su, ziel);
    return {
      prompt: `Welcher Satz steht im <b>${ZNAME[ziel]}</b>?`,
      choices: zeiten.map((z) => text(satz(v, su, z))), correct: zeiten.indexOf(ziel),
      hint: TIPP_ERKENNEN,
      solution: `${markiert(s)}<br>${bauplan(s)}<br>Die anderen: ${zeiten.filter((z) => z !== ziel).map((z) => `„${text(satz(v, su, z))}“ = ${ZNAME[z]}`).join(', ')}.`,
      ex: EX(s),
    };
  }
  const zeitformen = () => U.wahl([[20, erkennen], [25, einsetzen], [20, bilden], [12, antippen], [8, hilfsverb], [8, grundform], [7, welcherSatz]]);

  D.daten = { V, SUBJ, HILF, ZEITEN, ZNAME, ZDEUTSCH, satz, text, bauplan, subjFuer, praesens, praeteritum };
  D.arten = { 'd5-zeitformen': { erkennen, einsetzen, bilden, antippen, hilfsverb, grundform, welcherSatz } }; // für Tests

  // =====================================================
  // Lernbereiche Klasse 5 (Themenplan: faecher/deutsch/themenplan.md)
  // =====================================================
  D.grades = D.grades || {};
  D.grades[5] = {
    lbs: [
      { id: 'd5-wortarten', nr: 1, title: 'Wortarten', topics: [
        { id: 'd5-zeitformen', title: 'Zeitformen', icon: '⏳', gen: zeitformen },
      ] },
    ],
  };
})();
