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
    // „Sie“ allein fehlt mit Absicht: Es kann eine Person oder mehrere meinen (sie trinkt / sie trinken).
    { t: 'Ich', p: 0 }, { t: 'Du', p: 1 }, { t: 'Er', p: 2 }, { t: 'Wir', p: 3 }, { t: 'Ihr', p: 4 },
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


  // =====================================================
  // Nomen (für Geschlecht, Mehrzahl, die vier Fälle)
  // =====================================================
  // [Artikel, Einzahl, Genitiv (nur der/das; „(e)“ = mit und ohne e richtig), Mehrzahl, Art: P Person, T Tier, sonst Ding]
  const N = [
    ['der', 'Hund', 'Hund(e)s', 'Hunde', 'T'], ['der', 'Baum', 'Baum(e)s', 'Bäume'], ['der', 'Stuhl', 'Stuhl(e)s', 'Stühle'],
    ['der', 'Tisch', 'Tisch(e)s', 'Tische'], ['der', 'Ball', 'Ball(e)s', 'Bälle'], ['der', 'Apfel', 'Apfels', 'Äpfel'],
    ['der', 'Vogel', 'Vogels', 'Vögel', 'T'], ['der', 'Garten', 'Gartens', 'Gärten'], ['der', 'Lehrer', 'Lehrers', 'Lehrer', 'P'],
    ['der', 'Bruder', 'Bruders', 'Brüder', 'P'], ['der', 'Fluss', 'Flusses', 'Flüsse'], ['der', 'Wald', 'Wald(e)s', 'Wälder'],
    ['der', 'Zug', 'Zug(e)s', 'Züge'], ['der', 'Brief', 'Brief(e)s', 'Briefe'], ['der', 'Koffer', 'Koffers', 'Koffer'],
    ['der', 'Schlüssel', 'Schlüssels', 'Schlüssel'], ['der', 'Berg', 'Berg(e)s', 'Berge'], ['der', 'Löffel', 'Löffels', 'Löffel'],
    ['der', 'Mantel', 'Mantels', 'Mäntel'], ['der', 'Freund', 'Freund(e)s', 'Freunde', 'P'],
    ['die', 'Katze', '', 'Katzen', 'T'], ['die', 'Blume', '', 'Blumen'], ['die', 'Tasche', '', 'Taschen'], ['die', 'Lampe', '', 'Lampen'],
    ['die', 'Schule', '', 'Schulen'], ['die', 'Straße', '', 'Straßen'], ['die', 'Maus', '', 'Mäuse', 'T'], ['die', 'Hand', '', 'Hände'],
    ['die', 'Stadt', '', 'Städte'], ['die', 'Nacht', '', 'Nächte'], ['die', 'Tür', '', 'Türen'], ['die', 'Uhr', '', 'Uhren'],
    ['die', 'Gabel', '', 'Gabeln'], ['die', 'Schwester', '', 'Schwestern', 'P'], ['die', 'Wolke', '', 'Wolken'], ['die', 'Brücke', '', 'Brücken'],
    ['die', 'Wand', '', 'Wände'], ['die', 'Nuss', '', 'Nüsse'], ['die', 'Zeitung', '', 'Zeitungen'], ['die', 'Lehrerin', '', 'Lehrerinnen', 'P'],
    ['die', 'Freundin', '', 'Freundinnen', 'P'],
    ['das', 'Haus', 'Hauses', 'Häuser'], ['das', 'Buch', 'Buch(e)s', 'Bücher'], ['das', 'Kind', 'Kind(e)s', 'Kinder', 'P'],
    ['das', 'Bild', 'Bild(e)s', 'Bilder'], ['das', 'Fenster', 'Fensters', 'Fenster'], ['das', 'Mädchen', 'Mädchens', 'Mädchen', 'P'],
    ['das', 'Auto', 'Autos', 'Autos'], ['das', 'Heft', 'Heft(e)s', 'Hefte'], ['das', 'Pferd', 'Pferd(e)s', 'Pferde', 'T'],
    ['das', 'Schiff', 'Schiff(e)s', 'Schiffe'], ['das', 'Tier', 'Tier(e)s', 'Tiere', 'T'], ['das', 'Dorf', 'Dorf(e)s', 'Dörfer'],
    ['das', 'Blatt', 'Blatt(e)s', 'Blätter'], ['das', 'Zimmer', 'Zimmers', 'Zimmer'], ['das', 'Fahrrad', 'Fahrrad(e)s', 'Fahrräder'],
    ['das', 'Kleid', 'Kleid(e)s', 'Kleider'], ['das', 'Schaf', 'Schaf(e)s', 'Schafe', 'T'], ['das', 'Spiel', 'Spiel(e)s', 'Spiele'],
    ['das', 'Glas', 'Glases', 'Gläser'],
  ].map(([art, sg, gen, pl, typ]) => ({ art, sg, pl, typ: typ || 'D',
    gen: gen ? (gen.includes('(e)') ? [gen.replace('(e)', 'e'), gen.replace('(e)', '')] : [gen]) : [sg] }));
  const GENUS = { der: 'männlich (maskulin)', die: 'weiblich (feminin)', das: 'sächlich (neutral)' };
  const FAELLE = ['nominativ', 'genitiv', 'dativ', 'akkusativ'];
  const FNAME = { nominativ: 'Nominativ', genitiv: 'Genitiv', dativ: 'Dativ', akkusativ: 'Akkusativ' };
  const FFRAGE = { nominativ: 'Wer oder was?', genitiv: 'Wessen?', dativ: 'Wem?', akkusativ: 'Wen oder was?' };
  const ARTIKEL = { der: ['der', 'des', 'dem', 'den'], die: ['die', 'der', 'der', 'die'], das: ['das', 'des', 'dem', 'das'], pl: ['die', 'der', 'den', 'die'] };
  const ohneUml = (w) => w.replace(/ä/g, 'a').replace(/ö/g, 'o').replace(/ü/g, 'u').replace(/Ä/g, 'A').replace(/Ö/g, 'O').replace(/Ü/g, 'U');
  const gross = (t) => t.charAt(0).toUpperCase() + t.slice(1);
  // Was ändert sich in der Mehrzahl? → { umlaut: 'a → ä' | '', endung: '-e' | '' }
  function pluralBau(n) {
    const um = n.pl !== ohneUml(n.pl) && n.sg === ohneUml(n.sg);
    let umlaut = '';
    if (um) { for (let i = 0; i < n.pl.length; i++) if (n.pl[i] !== ohneUml(n.pl[i])) { umlaut = `${ohneUml(n.pl[i]).toLowerCase()} → ${n.pl[i].toLowerCase()}`; break; } }
    const endung = n.pl.length > n.sg.length ? '-' + n.pl.slice(n.sg.length) : '';
    return { umlaut, endung };
  }
  function pluralSatz(n) {
    const b = pluralBau(n);
    if (!b.umlaut && !b.endung) return 'Das Wort bleibt gleich. Nur der Artikel zeigt die Mehrzahl.';
    return [b.umlaut ? `Umlaut: <b>${b.umlaut}</b>` : '', b.endung ? `Endung <b>${b.endung}</b>` : ''].filter(Boolean).join(', ') + '.';
  }
  // Wortgruppe „Artikel + Nomen“ im Fall f (0 Nominativ … 3 Akkusativ); gibt alle richtigen Schreibweisen zurück
  function gruppe(n, f, plural) {
    if (plural) { const w = f === 2 && !/[ns]$/.test(n.pl) ? n.pl + 'n' : n.pl; return [`${ARTIKEL.pl[f]} ${w}`]; }
    const a = ARTIKEL[n.art][f];
    return f === 1 ? n.gen.map((g) => `${a} ${g}`) : [`${a} ${n.sg}`];
  }

  // ---------- Thema: Nomen – Geschlecht und Mehrzahl ----------
  const EXN = (n, mode) => ({ mode, art: n.art, sg: n.sg, pl: n.pl });
  function artikelWahl() {
    const n = pick(N);
    return {
      prompt: `Welcher Artikel gehört zu <b>${n.sg}</b>?`,
      choices: ['der', 'die', 'das'], correct: ['der', 'die', 'das'].indexOf(n.art),
      hint: 'Sprich das Wort mit allen drei Artikeln. Was klingt richtig? Ein paar Endungen helfen: <b>-ung, -heit, -keit, -in</b> → die, <b>-chen</b> → das.',
      solution: `<b>${n.art} ${n.sg}</b>: Das Nomen ist ${GENUS[n.art]}. Das Geschlecht (Genus) lernt man am besten gleich mit dem Wort.`,
      ex: EXN(n, 'genus'),
    };
  }
  function mehrzahl() {
    const n = pick(N);
    return {
      prompt: 'Wie heißt die <b>Mehrzahl</b> (Plural)?', layout: 'satz',
      fields: [{ type: 'text', answer: n.pl, prefix: `${n.art} ${n.sg} → die`, label: 'Mehrzahl' }],
      hint: 'Sprich: „ein …, viele …“. Achte auf zwei Dinge: Bekommt das Wort eine <b>Endung</b>? Wird aus a, o, u ein <b>Umlaut</b> (ä, ö, ü)?',
      solution: `${n.art} ${n.sg} → <b>die ${n.pl}</b><br>${pluralSatz(n)}`,
      ex: EXN(n, 'plural'),
    };
  }
  function einzahl() {
    const n = pick(N.filter((x) => x.sg !== x.pl));
    return {
      prompt: 'Wie heißt die <b>Einzahl</b> (Singular)?', layout: 'satz',
      fields: [{ type: 'text', answer: n.sg, prefix: `die ${n.pl} → ${n.art}`, label: 'Einzahl' }],
      hint: 'Sprich: „viele …, aber nur ein …“. Ein Umlaut (ä, ö, ü) kann wieder zu a, o, u werden.',
      solution: `die ${n.pl} → <b>${n.art} ${n.sg}</b><br>Von der Einzahl zur Mehrzahl: ${pluralSatz(n)}`,
      ex: EXN(n, 'plural'),
    };
  }
  function einOderMehr() {
    const gleich = Math.random() < 0.6;
    const n = pick(N.filter((x) => (x.sg === x.pl) === gleich && (gleich || x.art === 'die')));
    const plural = Math.random() < 0.5;
    const wort = plural ? `die ${n.pl}` : `${n.art} ${n.sg}`;
    return {
      prompt: `Einzahl oder Mehrzahl?<br><span class="bsp">${wort}</span>`,
      choices: ['Einzahl (Singular)', 'Mehrzahl (Plural)'], correct: plural ? 1 : 0,
      hint: 'Schau auf den <b>Artikel</b> und auf die <b>Endung</b>. In der Mehrzahl heißt der Artikel immer „die“.',
      solution: gleich
        ? `<b>${wort}</b> ist ${plural ? 'Mehrzahl' : 'Einzahl'}. Das Wort sieht in Einzahl und Mehrzahl gleich aus: ${n.art} ${n.sg}, die ${n.pl}. Hier verrät es nur der Artikel.`
        : `<b>${wort}</b> ist ${plural ? 'Mehrzahl' : 'Einzahl'}: ${n.art} ${n.sg}, die ${n.pl}. Der Artikel „die“ steht hier in beiden Fällen, also entscheidet die Endung.`,
      ex: EXN(n, 'plural'),
    };
  }
  // Sätze zum Antippen: Nomen sind mit * markiert
  const SATZ_SUBST = [
    'Heute sucht der *Lehrer den *Schlüssel im *Garten.', 'Morgens fährt der *Zug über die *Brücke.', 'Leise schleicht die *Katze durch das *Zimmer.',
    'Abends liest die *Schwester ein dickes *Buch.', 'Schnell rollt der *Ball über die *Straße.', 'Dort hängt ein altes *Bild an der *Wand.',
    'Später schreibt der *Bruder einen langen *Brief.', 'Oft sitzt der *Vogel auf dem *Baum vor dem *Fenster.', 'Vorsichtig trägt das *Mädchen die *Gläser in die *Küche.',
    'Draußen ziehen dunkle *Wolken über die *Stadt.', 'Gestern fand der *Hund einen *Löffel im *Garten.', 'Nachts leuchtet die *Lampe über dem *Tisch.',
    'Fröhlich packt die *Freundin ihren *Koffer.', 'Im *Wald sammelt das *Kind bunte *Blätter.',
  ];
  const substSatz = (ausser) => {
    const roh = pick(SATZ_SUBST.filter((x) => x.replace(/\*/g, '') !== ausser)).split(' ');
    return { tokens: roh.map((w) => w.replace('*', '')), correct: roh.map((w, i) => (w[0] === '*' ? i : -1)).filter((i) => i >= 0) };
  };
  function substAntippen() {
    const { tokens, correct } = substSatz();
    const liste = correct.map((i) => tokens[i].replace('.', ''));
    return {
      prompt: 'Tippe <b>alle Nomen</b> an.',
      tap: { tokens, correct }, answerText: liste.join(', '),
      hint: 'Nomen schreibt man <b>groß</b>, und man kann einen Artikel davorsetzen (der, die, das). Vorsicht: Das erste Wort im Satz ist immer groß.',
      solution: `Nomen: <b>${liste.join(', ')}</b>.${correct[0] === 0 ? '' : ` „${tokens[0]}“ ist nur groß, weil es am Satzanfang steht.`} Probe: Vor ein Nomen passt ein Artikel.`,
      ex: { mode: 'satz', tokens, correct },
    };
  }
  const substantive = () => U.wahl([[28, artikelWahl], [34, mehrzahl], [16, einzahl], [10, einOderMehr], [12, substAntippen]]);

  // ---------- Thema: Die vier Fälle ----------
  // Satzmuster je Fall: vor = Text vor der Wortgruppe, nach = Text danach, q = Frage, typ = für welche Nomen (P, T, D)
  const MUSTER = {
    nominativ: [
      { vor: 'Dort', verb: ['ist', 'sind'], nach: '', q: (pl) => `Wer oder was ${pl ? 'sind' : 'ist'} dort?`, typ: 'PTD', nachVerb: true },
      { vor: '', verb: ['gefällt', 'gefallen'], nach: 'mir', q: () => 'Wer oder was gefällt mir?', typ: 'PTD', vorne: true },
    ],
    akkusativ: [
      { vor: 'Lina sieht', nach: '', q: () => 'Wen oder was sieht Lina?', typ: 'PTD' },
      { vor: 'Emil sucht', nach: '', q: () => 'Wen oder was sucht Emil?', typ: 'PTD' },
      { vor: 'Wir malen', nach: '', q: () => 'Wen oder was malen wir?', typ: 'PTD' },
    ],
    dativ: [
      { vor: 'Lina hilft', nach: '', q: () => 'Wem hilft Lina?', typ: 'PT' },
      { vor: 'Emil dankt', nach: '', q: () => 'Wem dankt Emil?', typ: 'P' },
      { vor: 'Das Buch gehört', nach: '', q: () => 'Wem gehört das Buch?', typ: 'P' },
      { vor: 'Mia gibt', nach: 'Wasser', q: () => 'Wem gibt Mia Wasser?', typ: 'T' },
      { vor: 'Wir folgen', nach: '', q: () => 'Wem folgen wir?', typ: 'PT' },
    ],
    genitiv: [
      { vor: 'Die Farbe', nach: 'gefällt mir', q: () => 'Wessen Farbe gefällt mir?', typ: 'D' },
      { vor: 'Der Name', nach: 'ist kurz', q: () => 'Wessen Name ist kurz?', typ: 'PT' },
      { vor: 'Das ist ein Foto', nach: '', q: () => 'Wessen Foto ist das?', typ: 'PTD' },
    ],
  };
  // Baut einen Satz um eine Wortgruppe: { teile:[…], idx (Stelle der Wortgruppe), fall, frage, formen (alle richtigen), n, plural }
  function fallSatz(fall, plural) {
    fall = fall || pick(FAELLE);
    plural = plural === undefined ? Math.random() < 0.25 : plural;
    const m = pick(MUSTER[fall]);
    const n = pick(N.filter((x) => m.typ.includes(x.typ)));
    const f = FAELLE.indexOf(fall);
    const formen = gruppe(n, f, plural);
    let teile, idx;
    if (m.vorne) { teile = [gross(formen[0]), m.verb[plural ? 1 : 0], m.nach]; idx = 0; }
    else if (m.nachVerb) { teile = [m.vor, m.verb[plural ? 1 : 0], formen[0]]; idx = 2; }
    else { teile = [m.vor, formen[0]]; idx = 1; if (m.nach) teile.push(m.nach); }
    return { teile, idx, fall, frage: m.q(plural), formen: m.vorne ? formen.map(gross) : formen, n, plural, grund: plural ? `die ${n.pl}` : `${n.art} ${n.sg}` };
  }
  const fallText = (s, mark) => s.teile.map((t, i) => (i === s.idx && mark ? mark(t) : t)).join(' ') + '.';
  const reihe = (s) => { const a = ARTIKEL[s.plural ? 'pl' : s.n.art]; return FAELLE.map((f, i) => `${FNAME[f]}: ${a[i]}`).join(' · '); };
  const fallLoesung = (s) => `${fallText(s, (t) => `<b class="vb">${t}</b>`)}<br>Frage: <b>${s.frage}</b> → ${s.formen[0]}. Das ist der <b>${FNAME[s.fall]}</b>.<br><small>${reihe(s)}</small>`;
  const EXF = (s) => ({ mode: 'fall', fall: s.fall, teile: s.teile, idx: s.idx, frage: s.frage, form: s.formen[0], art: s.plural ? 'pl' : s.n.art });
  const TIPP_FALL = 'Frage nach der Wortgruppe: <b>Wer oder was?</b> → Nominativ · <b>Wessen?</b> → Genitiv · <b>Wem?</b> → Dativ · <b>Wen oder was?</b> → Akkusativ.';

  function fallBestimmen() {
    const s = fallSatz();
    const nachFrage = Math.random() < 0.4;
    return {
      prompt: `${nachFrage ? 'Mit welcher <b>Frage</b> findest du die markierte Wortgruppe?' : 'In welchem <b>Fall</b> steht die markierte Wortgruppe?'}<br><span class="bsp">${fallText(s, (t) => `<u>${t}</u>`)}</span>`,
      choices: FAELLE.map((f) => (nachFrage ? FFRAGE[f] : FNAME[f])), correct: FAELLE.indexOf(s.fall),
      hint: nachFrage ? 'Stelle die Frage mit dem ganzen Satz und antworte mit der markierten Wortgruppe. Welche Frage passt?' : TIPP_FALL,
      solution: fallLoesung(s), ex: EXF(s),
    };
  }
  function fallArtikel() {
    // nur eindeutige Lücken: Wort steht nicht am Satzanfang, und Einzahl und Mehrzahl sehen verschieden aus
    // (sonst wären bei „Lina sieht ___ Lehrer“ sowohl „den“ als auch „die“ richtig)
    let s; do { s = fallSatz(undefined, false); } while (s.idx === 0 || s.n.sg === s.n.pl);
    const f = FAELLE.indexOf(s.fall), art = ARTIKEL[s.n.art][f];
    const wort = s.formen[0].split(' ')[1];
    const alle = ['der', 'die', 'das', 'des', 'dem', 'den'];
    return {
      prompt: `Welcher Artikel passt in die Lücke?<br><span class="bsp">${fallText(s, () => '___ ' + wort)}</span>`,
      choices: alle, correct: alle.indexOf(art),
      hint: `Das Wort heißt in der Grundform „${s.grund}“. Frage nach der Lücke: „${s.frage}“ Die Frage verrät den Fall.`,
      solution: fallLoesung(s), ex: EXF(s),
    };
  }
  function fallBilden() {
    const s = fallSatz(pick(['genitiv', 'dativ', 'akkusativ', 'dativ', 'genitiv']));
    const vor = s.teile.slice(0, s.idx).join(' '), nach = s.teile.slice(s.idx + 1).join(' ');
    return {
      prompt: `Setze <b>${s.grund}</b> in den richtigen Fall.`, layout: 'satz',
      fields: [{ type: 'text', answer: s.formen, prefix: vor, suffix: (nach ? nach : '') + '.', label: 'Wortgruppe im richtigen Fall' }],
      hint: `Frage nach der Lücke: „${s.frage}“ Die Frage verrät den Fall. Dann ändert sich der Artikel, manchmal auch das Wortende.`,
      solution: `${fallLoesung(s)}${s.fall === 'genitiv' && !s.plural && s.n.art !== 'die' ? '<br>Im Genitiv bekommen männliche und sächliche Nomen ein <b>-s</b> oder <b>-es</b>.' : ''}${s.fall === 'dativ' && s.plural && s.formen[0].split(' ')[1] !== s.n.pl ? '<br>Im Dativ der Mehrzahl kommt ein <b>-n</b> ans Wort.' : ''}`,
      ex: EXF(s),
    };
  }
  // Satz mit Subjekt, Dativ- und Akkusativobjekt: das gesuchte Satzglied antippen
  function fallAntippen() {
    const wer = pick(N.filter((x) => x.typ === 'P'));
    const wem = pick(N.filter((x) => x.typ !== 'D' && x !== wer));
    const was = pick(N.filter((x) => x.typ === 'D' && ['Ball', 'Brief', 'Schlüssel', 'Apfel', 'Löffel', 'Blume', 'Tasche', 'Lampe', 'Uhr', 'Zeitung', 'Buch', 'Bild', 'Heft', 'Spiel', 'Glas', 'Fahrrad'].includes(x.sg)));
    const verb = pick(wem.typ === 'T' ? ['bringt', 'zeigt', 'gibt'] : ['bringt', 'zeigt', 'gibt', 'schenkt', 'leiht']);
    const ziel = pick(['dativ', 'akkusativ', 'dativ', 'akkusativ', 'nominativ']);
    const teile = [gross(gruppe(wer, 0)[0]), verb, gruppe(wem, 2)[0], gruppe(was, 3)[0]];
    const idx = { nominativ: 0, dativ: 2, akkusativ: 3 }[ziel];
    const frage = { nominativ: `Wer ${verb} etwas?`, dativ: `Wem ${verb} ${teile[0].toLowerCase().startsWith('d') ? teile[0].charAt(0).toLowerCase() + teile[0].slice(1) : teile[0]} etwas?`, akkusativ: `Wen oder was ${verb} ${teile[0].charAt(0).toLowerCase() + teile[0].slice(1)}?` }[ziel];
    const s = { teile, idx, fall: ziel, frage, formen: [teile[idx]], n: [wer, null, wem, was][idx], plural: false };
    return {
      prompt: `Tippe die Wortgruppe im <b>${FNAME[ziel]}</b> an.`,
      tap: { tokens: teile.map((t, i) => (i === teile.length - 1 ? t + '.' : t)), correct: [idx], one: true }, answerText: teile[idx],
      hint: TIPP_FALL,
      solution: fallLoesung(s), ex: EXF(s),
    };
  }
  const faelle = () => U.wahl([[32, fallBestimmen], [22, fallArtikel], [28, fallBilden], [18, fallAntippen]]);


  // ---------- Thema: Personal- und Possessivpronomen ----------
  const PERS = { nominativ: { der: 'er', die: 'sie', das: 'es', pl: 'sie' }, akkusativ: { der: 'ihn', die: 'sie', das: 'es', pl: 'sie' }, dativ: { der: 'ihm', die: 'ihr', das: 'ihm', pl: 'ihnen' } };
  const PWAHL = { nominativ: ['er', 'sie', 'es'], akkusativ: ['ihn', 'sie', 'es', 'ihm'], dativ: ['ihm', 'ihr', 'ihnen', 'ihn'] };
  // Satz, in dem eine Wortgruppe durch ein Personalpronomen ersetzt wird („das Mädchen“ fehlt: es / sie wäre strittig)
  function pronSatz() {
    let s; do { s = fallSatz(pick(['nominativ', 'akkusativ', 'dativ', 'akkusativ', 'dativ'])); } while (s.n.sg === 'Mädchen');
    const vorn = s.idx === 0;
    let p = PERS[s.fall][s.plural ? 'pl' : s.n.art];
    const zeig = vorn ? gross(p) : p;
    const neuT = s.teile.map((t, i) => (i === s.idx ? zeig : t));
    return { s, p: zeig, wahl: PWAHL[s.fall].map((x) => (vorn ? gross(x) : x)), neuT };
  }
  const zz = (art, z1, i1, z2, i2, s1, s2, merk) => ({ mode: 'zz', art, z1, i1, z2, i2, s1, s2, merk });
  const mitLeer = (teile) => teile.map((t, i) => (i ? ' ' : '') + t).concat('.');
  function pronEx(art, r) {
    return zz(art, mitLeer(r.s.teile), r.s.idx, mitLeer(r.neuT), r.s.idx,
      `Für welches Nomen soll das Pronomen stehen? <b>${r.s.teile[r.s.idx]}</b>: ${r.s.plural ? 'Mehrzahl' : GENUS[r.s.n.art]}, ${FNAME[r.s.fall]}.`,
      `Das Pronomen muss in Geschlecht, Zahl und Fall passen: <b>${r.p}</b>.`,
      `<b>${r.s.teile[r.s.idx]}</b> → <b>${r.p}</b><br>${r.neuT.join(' ')}.`);
  }
  const pronLoesung = (r) => `${fallText(r.s, (t) => `<u>${t}</u>`)}<br>→ ${r.neuT.map((t, i) => (i === r.s.idx ? `<b class="vb">${t}</b>` : t)).join(' ')}.<br>„${r.s.teile[r.s.idx]}“: ${r.s.plural ? 'Mehrzahl' : GENUS[r.s.n.art]}, ${FNAME[r.s.fall]} (${r.s.frage}) → <b>${r.p}</b>.`;
  const TIPP_PRON = 'Ein Personalpronomen steht <b>für</b> ein Nomen. Es richtet sich nach dem Geschlecht (der → er, die → sie, das → es), nach der Zahl und nach dem Fall (Wem? → ihm, ihr, ihnen · Wen? → ihn, sie, es).';
  function pronWahl() {
    const r = pronSatz();
    return {
      prompt: `Welches Pronomen kann die markierte Wortgruppe ersetzen?<br><span class="bsp">${fallText(r.s, (t) => `<u>${t}</u>`)}</span>`,
      choices: r.wahl, correct: r.wahl.indexOf(r.p), hint: TIPP_PRON, solution: pronLoesung(r), ex: pronEx('pronWahl', r),
    };
  }
  function pronTippen() {
    const r = pronSatz();
    const vor = r.s.teile.slice(0, r.s.idx).join(' '), nach = r.s.teile.slice(r.s.idx + 1).join(' ');
    return {
      prompt: `Ersetze „<b>${r.s.teile[r.s.idx]}</b>“ durch ein Pronomen.<br><span class="bsp">${fallText(r.s)}</span>`, layout: 'satz',
      fields: [{ type: 'text', answer: r.p, ci: true, prefix: vor, suffix: nach + '.', label: 'Pronomen' }],
      hint: TIPP_PRON, solution: pronLoesung(r), ex: pronEx('pronTippen', r),
    };
  }
  const BESITZER = [{ s: 'Ich habe', p: 'mein' }, { s: 'Du hast', p: 'dein' }, { s: 'Emil hat', p: 'sein' }, { s: 'Lina hat', p: 'ihr' }, { s: 'Wir haben', p: 'unser' }, { s: 'Ihr habt', p: 'euer' }, { s: 'Mia und Ben haben', p: 'ihr' }];
  const BESITZ = ['Hund', 'Ball', 'Koffer', 'Schlüssel', 'Mantel', 'Katze', 'Tasche', 'Lampe', 'Uhr', 'Buch', 'Heft', 'Fahrrad', 'Pferd', 'Auto', 'Spiel', 'Zimmer', 'Kleid'];
  const possForm = (p, art) => (art === 'die' ? (p === 'euer' ? 'eure' : p + 'e') : p);
  function possessiv() {
    const o = pick(BESITZER), wort = pick(BESITZ), n = N.find((x) => x.sg === wort);
    const ein = { der: 'einen', die: 'eine', das: 'ein' }[n.art];
    const staemme = shuffle(['mein', 'dein', 'sein', 'ihr', 'unser', 'euer'].filter((x) => x !== o.p)).slice(0, 3).concat(o.p);
    const wahl = shuffle(staemme).map((x) => possForm(x, n.art));
    const ok = possForm(o.p, n.art);
    const s1 = `${o.s} ${ein} ${n.sg}.`;
    return {
      prompt: `Welches Pronomen passt in die Lücke?<br><span class="bsp">${s1} Das ist ___ ${n.sg}.</span>`,
      choices: wahl, correct: wahl.indexOf(ok),
      hint: 'Ein Possessivpronomen zeigt, <b>wem</b> etwas gehört. Schau in den ersten Satz: Wer hat es? ich → mein, du → dein, er → sein, sie → ihr, wir → unser, ihr → euer.',
      solution: `${s1} Das ist <b class="vb">${ok}</b> ${n.sg}.<br>${o.s.replace(/ (habe|hast|hat|haben|habt)$/, '')} → <b>${o.p}</b>${n.art === 'die' ? `. Vor „die ${n.sg}“ kommt ein -e dazu: <b>${ok}</b>` : ''}.`,
      ex: zz('possessiv', [s1], 0, ['Das ist ', ok, ' ' + n.sg + '.'], 1, 'Wem gehört es? Das steht im ersten Satz.', `${o.s.replace(/ (habe|hast|hat|haben|habt)$/, '')} → <b>${o.p}</b>. Das Possessivpronomen zeigt den Besitzer.`, `Das ist <b>${ok}</b> ${n.sg}.`),
    };
  }
  // Wofür steht das Pronomen? Drei Dinge mit drei verschiedenen Geschlechtern
  function pronBezug() {
    const m = pick(['Tisch', 'Stuhl', 'Koffer', 'Ball']), f = pick(['Lampe', 'Tasche', 'Uhr', 'Blume']), n = pick(['Buch', 'Bild', 'Heft', 'Fahrrad', 'Spiel', 'Glas']);
    const dinge = shuffle([['der', m, 'ein', 'Er'], ['die', f, 'eine', 'Sie'], ['das', n, 'ein', 'Es']]);
    const ziel = pick(dinge), rest = pick(['ist neu', 'gehört mir', 'ist ein Geschenk', 'ist schon alt']);
    const s1 = `Im Zimmer sind ${dinge[0][2]} ${dinge[0][1]}, ${dinge[1][2]} ${dinge[1][1]} und ${dinge[2][2]} ${dinge[2][1]}.`;
    const wahl = dinge.map((d) => `${d[0]} ${d[1]}`);
    return {
      prompt: `Wofür steht das markierte Pronomen?<br><span class="bsp">${s1} <u>${ziel[3]}</u> ${rest}.</span>`,
      choices: wahl, correct: dinge.indexOf(ziel),
      hint: 'Das Pronomen hat dasselbe Geschlecht wie sein Nomen: <b>er</b> → der, <b>sie</b> → die, <b>es</b> → das.',
      solution: `<b>${ziel[3]}</b> steht für „<b>${ziel[0]} ${ziel[1]}</b>“, denn ${ziel[3].toLowerCase()} passt nur zu „${ziel[0]}“.<br>${ziel[0] === 'der' ? 'Der' : ziel[0] === 'die' ? 'Die' : 'Das'} ${ziel[1]} ${rest}.`,
      ex: zz('pronBezug', [`${ziel[3]} ${rest}.`], 0, [gross(ziel[0]) + ' ' + ziel[1], ` ${rest}.`], 0, `<b>${ziel[3]}</b>: Welches Nomen hat dieses Geschlecht?`, `${ziel[3].toLowerCase()} → <b>${ziel[0]}</b>: Das passt nur zu „${ziel[0]} ${ziel[1]}“.`, `<b>${ziel[3]}</b> steht für „<b>${ziel[0]} ${ziel[1]}</b>“.`),
    };
  }
  // Sätze zum Antippen: Pronomen sind mit * markiert
  const SATZ_PRON = [
    '*Ich zeige *dir *meinen Hund.', '*Wir besuchen *unsere Freundin.', 'Gibst *du *mir *dein Heft?', '*Ihr habt *euer Spiel vergessen.',
    '*Er dankt *ihr für *ihre Hilfe.', '*Wir zeigen *euch *unser Zimmer.', 'Emil ruft *seinen Bruder, doch *er hört *ihn nicht.',
    'Lina sucht *ihre Tasche, aber *sie findet *sie nicht.', 'Die Kinder holen *ihre Fahrräder und putzen *sie.', 'Morgen bringe *ich *euch *eure Bücher.',
    'Der Lehrer gibt *uns *unsere Hefte zurück.', 'Hast *du *deinen Schlüssel gefunden?',
  ];
  function markSatz(liste, ausser) {
    const roh = pick(liste.filter((x) => x.replace(/\*/g, '') !== ausser)).split(' ');
    return { tokens: roh.map((w) => w.replace('*', '')), correct: roh.map((w, i) => (w[0] === '*' ? i : -1)).filter((i) => i >= 0) };
  }
  function pronAntippen() {
    const { tokens, correct } = markSatz(SATZ_PRON);
    const liste = correct.map((i) => cleanW(tokens[i]));
    return {
      prompt: 'Tippe <b>alle Pronomen</b> an (Personal- und Possessivpronomen).',
      tap: { tokens, correct }, answerText: liste.join(', '),
      hint: 'Personalpronomen stehen <b>für</b> jemanden oder etwas: ich, du, er, sie, es, wir, ihr, mir, dir, ihn, ihm, uns, euch … Possessivpronomen zeigen, <b>wem</b> etwas gehört: mein, dein, sein, ihr, unser, euer.',
      solution: `Pronomen: <b>${liste.join(', ')}</b>.`,
      ex: { mode: 'marken', art: 'pronAntippen', tokens, correct, was: 'Pronomen', s1: 'Pronomen stehen für jemanden oder etwas (ich, dir, ihn …) oder zeigen, wem etwas gehört (mein, dein, sein …).' },
    };
  }
  const cleanW = (w) => w.replace(/[.,!?]/g, '');
  const pronomen = () => U.wahl([[26, pronWahl], [22, pronTippen], [22, possessiv], [14, pronBezug], [16, pronAntippen]]);

  // ---------- Thema: Adjektive steigern, als und wie ----------
  // [Grundstufe, Vergleichsstufe, Höchststufe (nach „am“), passt zu Personen?]
  const ADJ = [
    ['klein', 'kleiner', 'kleinsten', 1], ['schnell', 'schneller', 'schnellsten', 1], ['schön', 'schöner', 'schönsten'], ['leicht', 'leichter', 'leichtesten'],
    ['laut', 'lauter', 'lautesten', 1], ['weit', 'weiter', 'weitesten'], ['alt', 'älter', 'ältesten', 1], ['kalt', 'kälter', 'kältesten'],
    ['warm', 'wärmer', 'wärmsten'], ['lang', 'länger', 'längsten'], ['kurz', 'kürzer', 'kürzesten'], ['stark', 'stärker', 'stärksten', 1],
    ['jung', 'jünger', 'jüngsten', 1], ['groß', 'größer', 'größten', 1], ['hoch', 'höher', 'höchsten'], ['nah', 'näher', 'nächsten'],
    ['gut', 'besser', 'besten'], ['viel', 'mehr', 'meisten'], ['gern', 'lieber', 'liebsten'], ['teuer', 'teurer', 'teuersten'],
    ['dunkel', 'dunkler', 'dunkelsten'], ['schwer', 'schwerer', 'schwersten'], ['hell', 'heller', 'hellsten'], ['dick', 'dicker', 'dicksten'],
    ['breit', 'breiter', 'breitesten'], ['hart', 'härter', 'härtesten'], ['klug', 'klüger', 'klügsten', 1], ['süß', 'süßer', 'süßesten'],
    ['heiß', 'heißer', 'heißesten'], ['leise', 'leiser', 'leisesten', 1], ['müde', 'müder', 'müdesten', 1], ['langsam', 'langsamer', 'langsamsten', 1],
    ['arm', 'ärmer', 'ärmsten'], ['scharf', 'schärfer', 'schärfsten'],
  ].map(([pos, komp, sup, pers]) => ({ pos, komp, sup, pers: !!pers }));
  const STUFEN = ['Grundstufe (Positiv)', 'Vergleichsstufe (Komparativ)', 'Höchststufe (Superlativ)'];
  const adjReihe = (a, i) => [a.pos, a.komp, 'am ' + a.sup].map((x, k) => (k === i ? `<b class="vb">${x}</b>` : x)).join(' · ');
  const adjBesonders = (a) => (['gut', 'viel', 'gern', 'hoch', 'nah'].includes(a.pos) ? ' Dieses Adjektiv ist unregelmäßig, die Formen muss man sich merken.' : a.komp !== ohneUml(a.komp) && a.pos === ohneUml(a.pos) ? ' Beim Steigern wird hier der Vokal zum Umlaut.' : '');
  const EXA = (art, a, stufe) => ({ mode: 'steigern', art, pos: a.pos, komp: a.komp, sup: a.sup, stufe });
  const NAMEN = ['Lina', 'Emil', 'Mia', 'Ben', 'Nora', 'Paul'];
  function adjKomp() {
    const a = pick(ADJ);
    return {
      prompt: 'Wie heißt die <b>Vergleichsstufe</b> (Komparativ)?', layout: 'satz',
      fields: [{ type: 'text', answer: a.komp, ci: true, prefix: `${a.pos} →`, suffix: `→ am ${a.sup}`, label: 'Vergleichsstufe' }],
      hint: 'Die Vergleichsstufe endet auf <b>-er</b>: klein → klein<b>er</b>. Oft wird a, o, u zum Umlaut: alt → <b>ä</b>lter.',
      solution: `${adjReihe(a, 1)}.${adjBesonders(a)}`, ex: EXA('adjKomp', a, 1),
    };
  }
  function adjSup() {
    const a = pick(ADJ);
    return {
      prompt: 'Wie heißt die <b>Höchststufe</b> (Superlativ)?', layout: 'satz',
      fields: [{ type: 'text', answer: a.sup, ci: true, prefix: `${a.pos} → ${a.komp} → am`, label: 'Höchststufe' }],
      hint: 'Die Höchststufe bildet man mit <b>am</b> und der Endung <b>-sten</b> oder <b>-esten</b>: klein → am klein<b>sten</b>, laut → am laut<b>esten</b>.',
      solution: `${adjReihe(a, 2)}.${adjBesonders(a)}`, ex: EXA('adjSup', a, 2),
    };
  }
  function adjStufe() {
    const a = pick(ADJ), i = R(0, 2);
    const form = [a.pos, a.komp, 'am ' + a.sup][i];
    return {
      prompt: `In welcher Stufe steht das Adjektiv?<br><span class="bsp">${form}</span>`,
      choices: STUFEN, correct: i,
      hint: 'Grundstufe: so steht es im Wörterbuch. Vergleichsstufe: Endung <b>-er</b>, man vergleicht zwei. Höchststufe: mit <b>am</b> und <b>-sten</b>, mehr geht nicht.',
      solution: `${adjReihe(a, i)}<br><b>${form}</b> ist die ${STUFEN[i]}.${i === 0 && /er$/.test(a.pos) ? ' Vorsicht: Das -er gehört hier zum Wort, es ist keine Steigerung.' : ''}`,
      ex: EXA('adjStufe', a, i),
    };
  }
  function adjSatz() {
    const a = pick(ADJ.filter((x) => x.pers)), [n1, n2] = shuffle(NAMEN);
    const sup = Math.random() < 0.45;
    return {
      prompt: `Setze <b>${a.pos}</b> in die passende Stufe.`, layout: 'satz',
      fields: [sup ? { type: 'text', answer: a.sup, ci: true, prefix: `Von allen Kindern ist ${n1} am`, suffix: '.', label: 'Höchststufe' }
        : { type: 'text', answer: a.komp, ci: true, prefix: `${n1} ist`, suffix: `als ${n2}.`, label: 'Vergleichsstufe' }],
      hint: sup ? '„Von allen … am …“: Niemand übertrifft das. Das ist die Höchststufe mit <b>-sten</b>.' : 'Nach der Lücke steht <b>als</b>: Zwei werden verglichen und sind verschieden. Das ist die Vergleichsstufe mit <b>-er</b>.',
      solution: `${sup ? `Von allen Kindern ist ${n1} am <b class="vb">${a.sup}</b>.` : `${n1} ist <b class="vb">${a.komp}</b> als ${n2}.`}<br>${adjReihe(a, sup ? 2 : 1)}`,
      ex: EXA('adjSatz', a, sup ? 2 : 1),
    };
  }
  function alsWie() {
    const a = pick(ADJ.filter((x) => x.pers)), [n1, n2] = shuffle(NAMEN);
    const gleich = Math.random() < 0.5, so = pick(['so', 'genauso']);
    const satzA = gleich ? `${n1} ist ${so} ${a.pos} ___ ${n2}.` : `${n1} ist ${a.komp} ___ ${n2}.`;
    const w = gleich ? 'wie' : 'als';
    return {
      prompt: `<b>als</b> oder <b>wie</b>?<br><span class="bsp">${satzA}</span>`,
      choices: ['als', 'wie'], correct: gleich ? 1 : 0,
      hint: 'Sind die beiden <b>gleich</b> oder <b>verschieden</b>? Schau auf das Adjektiv: Grundstufe mit „so“ oder Vergleichsstufe mit -er?',
      solution: `${satzA.replace('___', `<b class="vb">${w}</b>`)}<br>${gleich ? `Beide sind gleich: <b>so … wie</b> mit der Grundstufe (${a.pos}).` : `Die beiden sind verschieden: Vergleichsstufe (${a.komp}) + <b>als</b>.`}`,
      ex: { mode: 'alswie', art: 'alsWie', gleich, n1, n2, pos: a.pos, komp: a.komp, satz: satzA.replace('___', w), wort: w },
    };
  }
  const adjektive = () => U.wahl([[24, adjKomp], [22, adjSup], [16, adjStufe], [20, adjSatz], [18, alsWie]]);

  // ---------- Thema: Verbformen – Personalform, Partizip, Aufforderung ----------
  const PW = ['ich', 'du', 'er/sie/es', 'wir', 'ihr'];
  const alleFormen = (v) => [0, 1, 2, 3, 4].map((p) => praesens(v, p));
  const endung = (v, form) => { const st = stamm(v); return form.startsWith(st) ? form.slice(st.length) : ''; };
  function persForm() {
    const v = pick(V), p = pick([0, 1, 1, 2, 2, 3, 4]);
    const f = praesens(v, p);
    const ans = p === 0 && /ern$/.test(v.inf) ? [f, f.replace(/ere$/, 're')] : f;
    const wechsel = (p === 1 || p === 2) && !f.startsWith(stamm(v));
    return {
      prompt: `Wie heißt die Personalform von <b>${v.inf}</b> im Präsens?`, layout: 'satz',
      fields: [{ type: 'text', answer: ans, ci: true, prefix: PW[p], label: 'Personalform' }],
      hint: 'Die Endung richtet sich nach der Person: ich -<b>e</b>, du -<b>st</b>, er/sie/es -<b>t</b>, wir -<b>en</b>, ihr -<b>t</b>. Bei manchen Verben ändert sich bei <i>du</i> und <i>er/sie/es</i> auch der Vokal.',
      solution: `${v.inf}: ${[0, 1, 2, 3, 4].map((q) => (q === p ? `<b class="vb">${PW[q]} ${praesens(v, q)}</b>` : `${PW[q]} ${praesens(v, q)}`)).join(' · ')}${wechsel ? '<br>Hier ändert sich bei „du“ und „er/sie/es“ der Vokal im Wort.' : ''}`,
      ex: zz('persForm', ['Grundform: ', v.inf], 1, [PW[p] + ' ', f], 1, `Die Grundform <b>${v.inf}</b> endet auf -en. Für jede Person bekommt das Verb eine eigene Endung.`, `${PW[p]} → ${endung(v, f) ? `Endung <b>-${endung(v, f)}</b>` : 'eine eigene Form'}${wechsel ? ', und der Vokal ändert sich' : ''}.`, `${v.inf} → <b>${PW[p]} ${f}</b>`),
    };
  }
  function persWahl() {
    // nur Formen, die zu genau einer Person passen (nicht „ihr spielt“ / „er spielt“)
    let v, f, p; do { v = pick(V); f = alleFormen(v); p = R(0, 4); } while (f.filter((x) => x === f[p]).length !== 1);
    return {
      prompt: `Welches Pronomen passt zu dieser Verbform?<br><span class="bsp">___ ${f[p]}</span>`,
      choices: PW, correct: p,
      hint: 'Schau auf die <b>Endung</b>: -e → ich, -st → du, -en → wir. Bei -t hilft der Vokal: er <b>läuft</b>, aber ihr <b>lauft</b>.',
      solution: `<b class="vb">${PW[p]} ${f[p]}</b><br>${v.inf}: ${[0, 1, 2, 3, 4].map((q) => `${PW[q]} ${f[q]}`).join(' · ')}`,
      ex: zz('persWahl', ['___ ', f[p]], 1, [PW[p], ' ' + f[p]], 0, `Schau auf die Endung von <b>${f[p]}</b> und vergleiche mit den anderen Formen von „${v.inf}“.`, `Nur zu einer Person passt genau diese Form: <b>${PW[p]}</b>.`, `<b>${PW[p]} ${f[p]}</b>`),
    };
  }
  function partizip() {
    const v = pick(V), h = v.aux === 'sein' ? 'bin' : 'habe';
    return {
      prompt: `Wie heißt das <b>Partizip</b> von <b>${v.inf}</b>?`, layout: 'satz',
      fields: [{ type: 'text', answer: v.part, ci: true, prefix: `ich ${h}`, label: 'Partizip' }],
      hint: 'Das Partizip brauchst du für das Perfekt: „Ich habe …“ oder „Ich bin …“. Es beginnt meistens mit <b>ge-</b> und endet auf <b>-t</b> (regelmäßig) oder <b>-en</b> (unregelmäßig).',
      solution: `${v.inf} → ich ${h} <b class="vb">${v.part}</b><br>${v.art === 's' ? 'Regelmäßig: ge- + Stamm + -t.' : v.art === 'g' ? 'Der Vokal ändert sich, die Endung ist -t.' : 'Unregelmäßig: Endung -en, oft mit anderem Vokal.'}`,
      ex: zz('partizip', ['Grundform: ', v.inf], 1, [`ich ${h} `, v.part], 1, 'Das Partizip steht im Perfekt am Satzende. Bauplan: <b>ge-</b> + Stamm + <b>-t</b> oder <b>-en</b>.', v.art === 's' ? `„${v.inf}“ ist regelmäßig: Endung <b>-t</b>.` : `„${v.inf}“ ist unregelmäßig. Diese Form muss man sich merken.`, `${v.inf} → ich ${h} <b>${v.part}</b>`),
    };
  }
  // Aufforderung (Imperativ): [Grundform, richtige Formen für eine Person, Rest des Satzes]
  const IMP = [
    ['kommen', ['Komm', 'Komme'], 'bitte her'], ['gehen', ['Geh', 'Gehe'], 'bitte zur Tür'], ['lesen', ['Lies'], 'bitte den Text'],
    ['schreiben', ['Schreib', 'Schreibe'], 'bitte deinen Namen'], ['essen', ['Iss'], 'bitte dein Brot'], ['trinken', ['Trink', 'Trinke'], 'bitte genug Wasser'],
    ['helfen', ['Hilf'], 'mir bitte'], ['nehmen', ['Nimm'], 'dir einen Apfel'], ['werfen', ['Wirf'], 'den Ball zu mir'], ['sehen', ['Sieh', 'Siehe'], 'mal nach oben'],
    ['warten', ['Warte'], 'bitte auf mich'], ['arbeiten', ['Arbeite'], 'bitte leise'], ['laufen', ['Lauf', 'Laufe'], 'schnell zum Tor'],
    ['fahren', ['Fahr', 'Fahre'], 'bitte langsam'], ['schlafen', ['Schlaf', 'Schlafe'], 'gut'], ['tragen', ['Trag', 'Trage'], 'bitte den Korb'],
    ['bleiben', ['Bleib', 'Bleibe'], 'bitte hier'], ['singen', ['Sing', 'Singe'], 'bitte lauter'], ['spielen', ['Spiel', 'Spiele'], 'mit uns'],
    ['fragen', ['Frag', 'Frage'], 'bitte deine Lehrerin'], ['suchen', ['Such', 'Suche'], 'bitte den Schlüssel'], ['lernen', ['Lern', 'Lerne'], 'das Gedicht'],
    ['malen', ['Mal', 'Male'], 'ein Bild für mich'], ['bringen', ['Bring', 'Bringe'], 'mir bitte das Heft'], ['denken', ['Denk', 'Denke'], 'an deine Jacke'],
    ['rennen', ['Renn', 'Renne'], 'nicht so schnell'], ['springen', ['Spring', 'Springe'], 'über den Bach'],
  ];
  function imperativ() {
    let [inf, formen, rest] = pick(IMP);
    const v = V.find((x) => x.inf === inf);
    const mehrere = Math.random() < 0.35 && !/\b(dir|dein|deine|deinen)\b/.test(rest);
    const ans = mehrere ? [gross(praesens(v, 4))] : formen;
    return {
      prompt: `Bilde die <b>Aufforderung</b> (Imperativ) von <b>${inf}</b>. Du sprichst mit <b>${mehrere ? 'mehreren Personen' : 'einer Person'}</b>.`, layout: 'satz',
      fields: [{ type: 'text', answer: ans, ci: true, suffix: rest + '!', label: 'Aufforderung' }],
      hint: mehrere ? 'Bei mehreren Personen nimmst du die <b>ihr-Form</b> und lässt „ihr“ weg: ihr kommt → Kommt!' : 'Bei einer Person: Nimm die <b>du-Form</b> und lass „du“ und die Endung -st weg: du kommst → Komm! Der Umlaut verschwindet: du fährst → Fahr!',
      solution: `<b class="vb">${ans[0]}</b> ${rest}!<br>${mehrere ? `ihr ${praesens(v, 4)} → <b>${ans[0]}</b> (ohne „ihr“).` : (ohneUml(v.du.replace(/st$/, '')) === ans[0].toLowerCase()
        ? `du ${v.du} → <b>${ans[0]}</b> (ohne „du“ und ohne -st${v.du !== ohneUml(v.du) && inf === ohneUml(inf) ? ', ohne Umlaut' : ''}).${ans.length > 1 ? ` Auch richtig: ${ans[1]}.` : ''}`
        : `du ${v.du} → <b>${ans[0]}</b>. Der Vokal ist wie in der du-Form. Diese Form merkt man sich am besten.`)}`,
      ex: zz('imperativ', [mehrere ? 'ihr ' : 'du ', mehrere ? praesens(v, 4) : v.du, ' ' + rest], 1, [ans[0], ' ' + rest + '!'], 0, mehrere ? `Starte mit der ihr-Form: <b>ihr ${praesens(v, 4)}</b>.` : `Starte mit der du-Form: <b>du ${v.du}</b>.`, mehrere ? 'Lass „ihr“ weg. Fertig ist die Aufforderung.' : 'Lass „du“ und die Endung -st weg (ein Umlaut verschwindet auch).', `<b>${ans[0]}</b> ${rest}!`),
    };
  }
  const FORMART = ['Personalform', 'Grundform (Infinitiv)', 'Partizip'];
  function formArt() {
    const zeit = pick(['praesens', 'praeteritum', 'perfekt', 'futur', 'perfekt', 'futur', 'plusquamperfekt']);
    const s = zufallSatz(zeit);
    const hinten = s.v2 && Math.random() < 0.6;
    const wort = hinten ? s.v2 : s.v1;
    const art = !hinten ? 0 : zeit === 'futur' ? 1 : 2;
    const teile = [s.subj + ' ', s.v1, ' ' + s.rest + (s.v2 ? ' ' : ''), s.v2 || '', '.'];
    const mark = teile.map((t, i) => (i === (hinten ? 3 : 1) ? `<u>${t}</u>` : t)).join('');
    const warum = ['Die Personalform passt zur Person (zum Subjekt) und steht an 2. Stelle. Sie ändert sich, wenn die Person wechselt.', 'Die Grundform endet auf -en und ändert sich nie, egal welche Person.', 'Das Partizip (ge…t / ge…en) ändert sich auch nicht mit der Person. Es steht am Satzende.'][art];
    return {
      prompt: `Welche Verbform ist das markierte Wort?<br><span class="bsp">${mark}</span>`,
      choices: FORMART, correct: art,
      hint: 'Probe: Ersetze das Subjekt durch „ich“. Ändert sich das markierte Wort? Dann ist es die <b>Personalform</b>. Bleibt es gleich, ist es Grundform (-en) oder Partizip (ge-).',
      solution: `${mark}<br><b>${wort}</b> ist ${art === 0 ? 'die' : art === 1 ? 'die' : 'das'} <b>${FORMART[art]}</b>. ${warum}`,
      ex: zz('formArt', teile, hinten ? 3 : 1, [FORMART[art] + ': ', wort], 1, 'Probe: Wechsle die Person. Welches Verbwort ändert sich?', warum, `<b>${wort}</b>: ${FORMART[art]}`),
    };
  }
  const verbformen = () => U.wahl([[26, persForm], [14, persWahl], [22, partizip], [22, imperativ], [16, formArt]]);

  // ---------- Thema: Wortarten erkennen ----------
  // Jedes Wort trägt seine Wortart: N Nomen, V Verb, A Adjektiv, D Artikel, P Pronomen, x andere (kommt später)
  const WA = { N: 'Nomen', V: 'Verb', A: 'Adjektiv', D: 'Artikel', P: 'Pronomen' };
  const WAPL = { N: 'Nomen', V: 'Verben', A: 'Adjektive', D: 'Artikel', P: 'Pronomen' };
  const WAPROBE = {
    N: 'Nomen schreibt man groß, und ein Artikel passt davor.',
    V: 'Verben sagen, was jemand tut oder was geschieht. Sie ändern sich mit der Person (ich …, du …).',
    A: 'Adjektive sagen, wie etwas ist. Man kann sie steigern (klein, kleiner, am kleinsten).',
    D: 'Artikel begleiten ein Nomen: der, die, das, ein, eine (auch dem, den, des, einen …).',
    P: 'Pronomen stehen für ein Nomen (ich, er, uns …) oder zeigen, wem etwas gehört (mein, unser …).',
  };
  const SATZ_WA = [
    'Der|D kleine|A Hund|N schläft|V im|x Garten|N', 'Wir|P suchen|V den|D roten|A Ball|N', 'Die|D alte|A Lampe|N steht|V auf|x dem|D Tisch|N',
    'Er|P liest|V ein|D spannendes|A Buch|N', 'Das|D Mädchen|N trägt|V einen|D schweren|A Koffer|N', 'Ich|P male|V meiner|P Schwester|N ein|D buntes|A Bild|N',
    'Der|D Zug|N fährt|V über|x die|D lange|A Brücke|N', 'Du|P bist|V heute|x sehr|x müde|A', 'Unser|P Nachbar|N kauft|V frische|A Äpfel|N',
    'Die|D Kinder|N bauen|V eine|D große|A Hütte|N', 'Ihr|P habt|V den|D Schlüssel|N gefunden|V', 'Das|D Wasser|N im|x See|N ist|V kalt|A',
    'Mein|P Bruder|N schreibt|V dir|P einen|D langen|A Brief|N', 'Die|D Katze|N ist|V klein|A und|x schnell|A', 'Wir|P sehen|V einen|D hohen|A Berg|N',
    'Der|D Lehrer|N erklärt|V uns|P die|D schwere|A Aufgabe|N',
  ].map((z) => { const t = z.split(' ').map((w) => w.split('|')); return { w: t.map((x) => x[0]), tag: t.map((x) => x[1]) }; });
  const waTokens = (z) => z.w.map((w, i) => (i === z.w.length - 1 ? w + '.' : w));
  function waBestimmen() {
    const z = pick(SATZ_WA), i = pick(z.tag.map((t, k) => (t !== 'x' ? k : -1)).filter((k) => k >= 0));
    const arten = Object.keys(WA);
    return {
      prompt: `Welche Wortart hat das markierte Wort?<br><span class="bsp">${z.w.map((w, k) => (k === i ? `<u>${w}</u>` : w)).join(' ')}.</span>`,
      choices: arten.map((a) => WA[a]), correct: arten.indexOf(z.tag[i]),
      hint: 'Mach die Proben: Passt ein Artikel davor (Nomen)? Ändert es sich mit der Person (Verb)? Kann man es steigern (Adjektiv)? Begleitet es ein Nomen (Artikel)? Steht es für ein Nomen (Pronomen)?',
      solution: `<b>${z.w[i]}</b> ist ein <b>${WA[z.tag[i]]}</b>. ${WAPROBE[z.tag[i]]}`,
      ex: { mode: 'wa', art: 'waBestimmen', w: z.w, tag: z.tag, ziel: z.tag[i], idx: [i] },
    };
  }
  function waAntippen() {
    const z = pick(SATZ_WA), ziel = pick([...new Set(z.tag.filter((t) => t !== 'x'))]);
    const correct = z.tag.map((t, k) => (t === ziel ? k : -1)).filter((k) => k >= 0);
    return {
      prompt: `Tippe <b>alle ${WAPL[ziel]}</b> an.`,
      tap: { tokens: waTokens(z), correct }, answerText: correct.map((k) => z.w[k]).join(', '),
      hint: WAPROBE[ziel],
      solution: `${WAPL[ziel]}: <b>${correct.map((k) => z.w[k]).join(', ')}</b>. ${WAPROBE[ziel]}`,
      ex: { mode: 'wa', art: 'waAntippen', w: z.w, tag: z.tag, ziel, idx: correct },
    };
  }
  function waWort() {
    const ziel = pick(['N', 'V', 'A', 'P']);
    const quelle = { N: () => pick(N).sg, V: () => pick(V).inf, A: () => pick(ADJ.filter((a) => !['viel', 'gern'].includes(a.pos))).pos, P: () => pick(['ich', 'du', 'wir', 'ihr', 'mein', 'dein', 'unser', 'ihm', 'uns', 'euch']) };
    const tags = shuffle(['N', 'V', 'A', 'P']);
    const w = tags.map((t) => quelle[t]());
    return {
      prompt: `Welches Wort ist ein <b>${WA[ziel]}</b>?`,
      choices: w, correct: tags.indexOf(ziel),
      hint: WAPROBE[ziel],
      solution: `<b>${w[tags.indexOf(ziel)]}</b> ist ein ${WA[ziel]}. ${WAPROBE[ziel]}<br>Die anderen: ${tags.map((t, k) => (t === ziel ? '' : `${w[k]} (${WA[t]})`)).filter(Boolean).join(', ')}.`,
      ex: { mode: 'wa', art: 'waWort', w, tag: tags, ziel, idx: [tags.indexOf(ziel)], liste: true },
    };
  }
  const wortarten = () => U.wahl([[40, waBestimmen], [36, waAntippen], [24, waWort]]);


  // ---------- Thema: Präpositionen (Deutschbuch Kap. 9, S. 206; Sprachtraining Kap. 1) ----------
  // Sätze: Präpositionen mit * markiert (keine verschmolzenen Formen wie im, zum)
  const PRS = ['Die Katze schläft *unter dem Tisch', 'Lina wartet *vor der Tür', 'Das Bild hängt *über dem Sofa', 'Wir gehen *durch den Park',
    'Emil spielt *mit seinem Hund', 'Das Geschenk ist *für meine Oma', '*Nach der Schule gehen wir *in den Garten', 'Der Ball rollt *hinter das Auto',
    'Mia sitzt *zwischen ihren Freunden', '*Seit dem Sommer hat Ben einen Hund', 'Die Schuhe stehen *neben dem Bett', 'Wir laufen *um den See',
    'Paul kommt *ohne seine Jacke', '*Bei Regen bleiben wir *in der Hütte', 'Das Heft liegt *auf dem Tisch', 'Nora fährt *mit dem Rad *zu ihrer Oma'];
  const prSatz = () => { const w = pick(PRS).split(' '); const correct = w.map((x, i) => (x[0] === '*' ? i : -1)).filter((i) => i >= 0); const tokens = w.map((x, i) => x.replace('*', '') + (i === w.length - 1 ? '.' : '')); return { tokens, correct, woerter: correct.map((i) => tokens[i].replace('.', '')) }; };
  const PR_TIPP = 'Präpositionen sind kleine Wörter wie <b>auf, unter, mit, für, durch, nach</b>. Sie stehen vor einem Nomen (oder Pronomen) und zeigen, wie Dinge zueinander stehen: wo, wohin, wann, womit.';
  // [Präposition, Fall, Beispiel]
  const PRFALL = [['mit', 'D', 'mit dem Bus'], ['nach', 'D', 'nach der Schule'], ['bei', 'D', 'bei meiner Oma'], ['seit', 'D', 'seit dem Sommer'], ['von', 'D', 'von meinem Freund'],
    ['zu', 'D', 'zu meiner Freundin'], ['aus', 'D', 'aus dem Haus'], ['für', 'A', 'für meinen Bruder'], ['durch', 'A', 'durch den Wald'], ['ohne', 'A', 'ohne den Schirm'],
    ['gegen', 'A', 'gegen die Wand'], ['um', 'A', 'um den Tisch']];
  const PRFNAME = { D: 'Dativ (Wem?)', A: 'Akkusativ (Wen oder was?)' };
  // Wechselpräpositionen: [Satz mit ___, richtig, falsch, wo/wohin]
  const PRW = [['Das Buch liegt auf ___ Tisch.', 'dem', 'den', 'wo'], ['Ich lege das Buch auf ___ Tisch.', 'den', 'dem', 'wohin'],
    ['Die Vase steht auf ___ Fensterbank.', 'der', 'die', 'wo'], ['Mama stellt die Vase auf ___ Fensterbank.', 'die', 'der', 'wohin'],
    ['Der Hund sitzt neben ___ Sofa.', 'dem', 'das', 'wo'], ['Der Hund setzt sich neben ___ Sofa.', 'das', 'dem', 'wohin'],
    ['Das Bild hängt an ___ Wand.', 'der', 'die', 'wo'], ['Mia hängt das Bild an ___ Wand.', 'die', 'der', 'wohin'],
    ['Die Schuhe stehen unter ___ Bett.', 'dem', 'das', 'wo'], ['Ben stellt die Schuhe unter ___ Bett.', 'das', 'dem', 'wohin'],
    ['Die Katze liegt vor ___ Ofen.', 'dem', 'den', 'wo'], ['Die Katze legt sich vor ___ Ofen.', 'den', 'dem', 'wohin']];
  // passende Präposition: [Satz mit ___, richtig, [falsch], Hinweis]
  const PRORT = [['Der Ball liegt ___ dem Schrank.', 'hinter', ['auf', 'neben'], 'Man sieht ihn nicht, der Schrank verdeckt ihn.'],
    ['Die Lampe hängt ___ dem Tisch.', 'über', ['unter', 'neben'], 'Sie ist oben, der Tisch ist unten.'],
    ['Der Hund schläft ___ dem Tisch.', 'unter', ['auf', 'über'], 'Der Tisch ist sein Dach.'],
    ['Mia sitzt ___ Lina und Ben.', 'zwischen', ['über', 'unter'], 'Lina sitzt links von ihr, Ben rechts.'],
    ['Wir gehen ___ den Wald.', 'durch', ['unter', 'über'], 'Wir kommen auf der anderen Seite wieder heraus.'],
    ['Ich trinke den Tee ___ Zucker.', 'ohne', ['für', 'durch'], 'Ich mag ihn nicht süß.'],
    ['Das Geschenk ist ___ dich.', 'für', ['mit', 'ohne'], 'Du bekommst es.'],
    ['Wir fahren ___ dem Zug nach Berlin.', 'mit', ['ohne', 'gegen'], 'Der Zug bringt uns hin.']];
  function prAntippen() {
    const x = prSatz();
    return {
      prompt: `Tippe ${x.correct.length > 1 ? '<b>alle Präpositionen</b>' : 'die <b>Präposition</b>'} an.`,
      tap: { tokens: x.tokens, correct: x.correct }, answerText: x.woerter.join(', '),
      hint: PR_TIPP,
      solution: `${x.tokens.map((t, k) => (x.correct.includes(k) ? `<b class="vb">${t}</b>` : t)).join(' ')}<br>Präposition${x.correct.length > 1 ? 'en' : ''}: <b>${x.woerter.join(', ')}</b>. Sie ${x.correct.length > 1 ? 'stehen' : 'steht'} vor einem Nomen und ${x.correct.length > 1 ? 'zeigen' : 'zeigt'}, wie die Dinge zueinander stehen.`,
      ex: { mode: 'marken', art: 'prAntippen', tokens: x.tokens, correct: x.correct, was: 'Präpositionen', s1: 'Präpositionen stehen vor einem Nomen: <b>unter</b> dem Tisch, <b>mit</b> dem Bus.' },
    };
  }
  function prFall() {
    const [w, f, bsp] = pick(PRFALL), ch = ['D', 'A'];
    const t = bsp.split(' ');
    return {
      prompt: `Welchen Fall verlangt die Präposition <b>${w}</b>?<br><span class="bsp">${w} ___ ${t.slice(2).join(' ')}</span>`,
      choices: ch.map((x) => PRFNAME[x]), correct: ch.indexOf(f),
      hint: 'Merke: <b>mit, nach, bei, seit, von, zu, aus</b> → Dativ. <b>für, durch, gegen, ohne, um</b> → Akkusativ.',
      solution: `<b>${bsp}</b>: Nach „${w}“ steht der <b>${f === 'D' ? 'Dativ' : 'Akkusativ'}</b>.<br>Merke: mit, nach, bei, seit, von, zu, aus → Dativ. für, durch, gegen, ohne, um → Akkusativ.`,
      ex: { mode: 'marken', art: 'prFall', tokens: t, correct: [0, 1], was: `${w} + ${f === 'D' ? 'Dativ' : 'Akkusativ'}`, s1: `Nach „${w}“ steht immer derselbe Fall.`, merk: `<b>${bsp}</b>: ${w} + <b>${f === 'D' ? 'Dativ' : 'Akkusativ'}</b>.` },
    };
  }
  function prWechsel() {
    const [satz, ok, falsch, frage] = pick(PRW), ch = shuffle([ok, falsch]);
    const voll = satz.replace('___', ok);
    return {
      prompt: `Welcher Artikel passt?<br><span class="bsp">${satz}</span>`,
      choices: ch, correct: ch.indexOf(ok),
      hint: 'Frage: <b>Wo</b> ist etwas? Dann Dativ (dem, der). <b>Wohin</b> kommt etwas? Dann Akkusativ (den, die, das).',
      solution: `<b>${voll}</b><br>Frage: <b>${frage === 'wo' ? 'Wo' : 'Wohin'}?</b> ${frage === 'wo' ? 'Es bleibt an seinem Platz: Dativ.' : 'Es kommt an einen neuen Platz: Akkusativ.'}`,
      ex: zz('prWechsel', [satz], 0, [voll], 0, `Frage: <b>Wo</b> oder <b>Wohin</b>?`, frage === 'wo' ? '<b>Wo?</b> Es bleibt, wo es ist: Dativ.' : '<b>Wohin?</b> Es kommt an einen neuen Platz: Akkusativ.', `<b>${voll}</b>`),
    };
  }
  function prPasst() {
    const [satz, ok, falsch, hinweis] = pick(PRORT), ch = shuffle([ok, ...falsch]);
    const voll = satz.replace('___', ok);
    return {
      prompt: `Welche Präposition passt? <i>${hinweis}</i><br><span class="bsp">${satz}</span>`,
      choices: ch, correct: ch.indexOf(ok),
      hint: 'Stell dir das Bild vor: Wo genau ist das Ding? Oben, unten, dahinter, dazwischen?',
      solution: `<b>${voll}</b><br>${hinweis} Deshalb: <b>${ok}</b>.`,
      ex: { mode: 'marken', art: 'prPasst', tokens: voll.split(' '), correct: [voll.split(' ').indexOf(ok)], was: 'Präposition', s1: hinweis, merk: `<b>${voll}</b>` },
    };
  }
  const praepositionen = () => U.wahl([[30, prAntippen], [22, prFall], [26, prWechsel], [22, prPasst]]);

  // ---------- Thema: Adverbien (Deutschbuch Kap. 9, S. 207) ----------
  const ADVF = { wann: 'Wann?', wo: 'Wo?', wie: 'Wie?', warum: 'Warum?' };
  const ADVW = { wann: ['heute', 'morgen', 'gestern', 'bald', 'jetzt', 'oft', 'abends'], wo: ['hier', 'dort', 'draußen', 'drinnen', 'oben', 'unten'], wie: ['gern', 'allein', 'zusammen'], warum: ['deshalb', 'darum'] };
  // [Satz mit *Adverb, Frage]
  const ADVS = [['Wir spielen *heute Fußball', 'wann'], ['Das Fahrrad steht *draußen', 'wo'], ['Lina liest *gern Comics', 'wie'], ['Es regnet. *Deshalb bleiben wir zu Hause', 'warum'],
    ['*Morgen fahren wir ans Meer', 'wann'], ['Mein Zimmer ist *oben', 'wo'], ['Ben kommt *bald nach Hause', 'wann'], ['Wir machen die Hausaufgaben *zusammen', 'wie'],
    ['Ich war *gestern im Kino', 'wann'], ['Mia wartet *dort auf den Bus', 'wo'], ['Paul war krank. *Darum fehlte er', 'warum'], ['Opa trinkt *abends Tee', 'wann'],
    ['Emil geht *allein zur Schule', 'wie'], ['Wir essen *drinnen', 'wo']];
  const advSatz = () => { const [roh, f] = pick(ADVS); const w = roh.split(' '); const i = w.findIndex((x) => x[0] === '*'); const tokens = w.map((x, k) => x.replace('*', '') + (k === w.length - 1 ? '.' : '')); return { tokens, i, wort: tokens[i].replace('.', ''), f }; };
  const ADV_TIPP = 'Adverbien sagen genauer, <b>wann</b> (heute, bald), <b>wo</b> (draußen, oben), <b>wie</b> (gern, allein) oder <b>warum</b> (deshalb) etwas geschieht. Sie bekommen nie eine Endung.';
  const ADJ_VGL = ['schnell', 'groß', 'rot', 'müde', 'laut', 'schön', 'klein', 'alt'];
  function advAntippen() {
    const x = advSatz();
    return {
      prompt: 'Tippe das <b>Adverb</b> an.', tap: { tokens: x.tokens, correct: [x.i], one: true }, answerText: x.wort,
      hint: ADV_TIPP,
      solution: `${x.tokens.map((t, k) => (k === x.i ? `<b class="vb">${t}</b>` : t)).join(' ')}<br><b>${x.wort}</b> ist ein Adverb. Es antwortet auf die Frage <b>${ADVF[x.f]}</b>`,
      ex: { mode: 'marken', art: 'advAntippen', tokens: x.tokens, correct: [x.i], was: 'Adverb', s1: `Frage: Wann? Wo? Wie? Warum?`, merk: `Adverb: <b>${x.wort}</b>. Frage: ${ADVF[x.f]}` },
    };
  }
  function advFrage() {
    const x = advSatz(), arten = Object.keys(ADVF);
    return {
      prompt: `Auf welche Frage antwortet das Adverb <b>${x.wort}</b>?<br><span class="bsp">${x.tokens.join(' ')}</span>`,
      choices: arten.map((a) => ADVF[a]), correct: arten.indexOf(x.f), hint: ADV_TIPP,
      solution: `${x.tokens.map((t, k) => (k === x.i ? `<b class="vb">${t}</b>` : t)).join(' ')}<br><b>${x.wort}</b> antwortet auf <b>${ADVF[x.f]}</b>`,
      ex: { mode: 'marken', art: 'advFrage', tokens: x.tokens, correct: [x.i], was: 'Adverb', s1: 'Frage: Wann? Wo? Wie? Warum?', merk: `<b>${x.wort}</b>: ${ADVF[x.f]}` },
    };
  }
  function advLuecke() {
    const x = advSatz(), andere = Object.keys(ADVW).filter((f) => f !== x.f), falsch = shuffle(andere).slice(0, 2).map((f) => pick(ADVW[f]));
    const ch = shuffle([x.wort.toLowerCase(), ...falsch]);
    const luecke = x.tokens.map((t, k) => (k === x.i ? '___' + (t.endsWith('.') ? '.' : '') : t)).join(' ');
    const passt = (w) => (x.i === 0 || /\.$/.test(x.tokens[x.i - 1]) ? w.charAt(0).toUpperCase() + w.slice(1) : w);
    return {
      prompt: `Welches Adverb passt? Frage: <b>${ADVF[x.f]}</b><br><span class="bsp">${luecke}</span>`,
      choices: ch.map(passt), correct: ch.indexOf(x.wort.toLowerCase()), hint: ADV_TIPP,
      solution: `${x.tokens.map((t, k) => (k === x.i ? `<b class="vb">${t}</b>` : t)).join(' ')}<br>Gefragt ist <b>${ADVF[x.f]}</b> → <b>${x.wort}</b>.`,
      ex: { mode: 'marken', art: 'advLuecke', tokens: x.tokens, correct: [x.i], was: 'Adverb', s1: `Gesucht: ein Adverb für die Frage <b>${ADVF[x.f]}</b>`, merk: `${ADVF[x.f]} → <b>${x.wort}</b>` },
    };
  }
  function advOderAdj() {
    const adv = Math.random() < 0.5, w = adv ? pick(Object.values(ADVW).flat()) : pick(ADJ_VGL);
    return {
      prompt: `Adverb oder Adjektiv?<br><span class="bsp">${w}</span>`, choices: ['Adverb', 'Adjektiv'], correct: adv ? 0 : 1,
      hint: 'Probe: Kann das Wort mit einer Endung vor einem Nomen stehen (der <b>schnelle</b> Hund) und kann man es steigern (schneller)? Dann ist es ein Adjektiv. Ein Adverb bleibt immer gleich.',
      solution: adv ? `<b>${w}</b> ist ein <b>Adverb</b>: Es bekommt nie eine Endung und lässt sich nicht steigern. Mit Endung vor einem Nomen geht es nicht.` : `<b>${w}</b> ist ein <b>Adjektiv</b>: der ${w}e Hund, ${w}er. Adjektive kann man vor ein Nomen stellen und steigern.`,
      ex: { mode: 'marken', art: 'advOderAdj', tokens: adv ? [w] : ['der', w + 'e', 'Hund'], correct: adv ? [0] : [1], was: adv ? 'Adverb' : 'Adjektiv', s1: 'Probe: Passt das Wort mit Endung vor ein Nomen?', merk: adv ? `<b>${w}</b>: Adverb, ohne Endung.` : `<b>der ${w}e Hund</b>: Adjektiv.` },
    };
  }
  const adverbien = () => U.wahl([[32, advAntippen], [24, advFrage], [24, advLuecke], [20, advOderAdj]]);

  // ---------- Thema: Konjunktionen (Deutschbuch Kap. 9, Wortarten unterscheiden) ----------
  const KJS = ['Lina liest *und Ben malt.', 'Willst du Tee *oder Saft?', 'Ich bin müde, *aber ich lese noch.', 'Wir bleiben drinnen, *weil es regnet.', 'Mia hofft, *dass die Sonne scheint.',
    '*Wenn es schneit, bauen wir einen Schneemann.', 'Emil spielt draußen, *obwohl es kalt ist.', 'Paul lacht, *denn der Witz ist lustig.', 'Wir warten, *bis der Bus kommt.',
    'Ich putze die Zähne, *bevor ich ins Bett gehe.', 'Äpfel *und Birnen liegen im Korb.'];
  const KJ_NEBEN = ['und', 'oder', 'aber', 'denn'], KJ_UNTER = ['weil', 'dass', 'wenn', 'obwohl', 'bis', 'bevor'];
  const KJ_TIPP = 'Konjunktionen sind Bindewörter: Sie <b>verbinden</b> Wörter oder Sätze (und, oder, aber, denn, weil, dass, wenn, obwohl).';
  // [Satz mit ___, richtig, [falsch, falsch]]: Die Stellung des Verbs schließt die falschen Angebote aus.
  const KJL = [['Ich nehme einen Schirm mit, ___ es regnet.', 'weil', ['aber', 'oder']], ['Wir spielen draußen, ___ es kalt ist.', 'obwohl', ['und', 'denn']],
    ['Ich rufe dich an, ___ ich zu Hause bin.', 'wenn', ['aber', 'oder']], ['Lina weiß, ___ morgen Ferien sind.', 'dass', ['und', 'denn']],
    ['Möchtest du Tee ___ Saft?', 'oder', ['weil', 'dass']], ['Ich bin müde, ___ ich lese noch ein Kapitel.', 'aber', ['weil', 'dass']],
    ['Ben ist froh, ___ er hat eine Eins.', 'denn', ['weil', 'obwohl']]];
  function kjAntippen() {
    const roh = pick(KJS).split(' '), i = roh.findIndex((x) => x[0] === '*'), tokens = roh.map((x) => x.replace('*', '')), w = tokens[i].replace(/[.,?]/g, '');
    return {
      prompt: 'Tippe die <b>Konjunktion</b> an.', tap: { tokens, correct: [i], one: true }, answerText: w, hint: KJ_TIPP,
      solution: `${tokens.map((t, k) => (k === i ? `<b class="vb">${t}</b>` : t)).join(' ')}<br><b>${w}</b> ist eine Konjunktion: Es verbindet ${KJ_NEBEN.includes(w.toLowerCase()) ? 'zwei Wörter oder Hauptsätze' : 'einen Hauptsatz mit einem Nebensatz'}.`,
      ex: { mode: 'marken', art: 'kjAntippen', tokens, correct: [i], was: 'Konjunktion', s1: 'Welches Wort verbindet die Teile?', merk: `Konjunktion: <b>${w}</b>` },
    };
  }
  function kjLuecke() {
    const [satz, ok, falsch] = pick(KJL), ch = shuffle([ok, ...falsch]), voll = satz.replace('___', ok);
    return {
      prompt: `Welche Konjunktion passt?<br><span class="bsp">${satz}</span>`, choices: ch, correct: ch.indexOf(ok),
      hint: 'Achte auf das Verb im zweiten Teil: Steht es am <b>Ende</b>, passt nur weil, dass, wenn, obwohl. Steht es an <b>2. Stelle</b>, passt und, oder, aber, denn. Dann entscheidet der Sinn.',
      solution: `<b>${voll}</b><br>${KJ_UNTER.includes(ok) ? `„${ok}“ leitet einen Nebensatz ein: Das Verb steht am Ende.` : `„${ok}“ verbindet gleichrangige Teile: Das Verb bleibt an seinem Platz.`}`,
      ex: { mode: 'marken', art: 'kjLuecke', tokens: voll.split(' '), correct: [voll.split(' ').indexOf(ok)], was: 'Konjunktion', s1: 'Wo steht das Verb im zweiten Teil?', merk: `<b>${voll}</b>` },
    };
  }
  function kjWortart() {
    const art = pick(['K', 'P', 'A']), w = art === 'K' ? pick([...KJ_NEBEN, ...KJ_UNTER]) : art === 'P' ? pick(['mit', 'auf', 'für', 'unter', 'durch', 'nach']) : pick(['heute', 'dort', 'gern', 'oft', 'draußen']);
    const ch = ['Konjunktion', 'Präposition', 'Adverb'], idx = { K: 0, P: 1, A: 2 }[art];
    const warum = { K: 'Sie verbindet Wörter oder Sätze.', P: 'Sie steht vor einem Nomen und zeigt eine Beziehung (mit dem Bus).', A: 'Es sagt, wann, wo, wie oder warum.' }[art];
    return {
      prompt: `Welche Wortart ist <b>${w}</b>?`, choices: ch, correct: idx,
      hint: 'Konjunktion: verbindet (und, weil). Präposition: steht vor einem Nomen (mit dem Rad). Adverb: sagt wann, wo, wie, warum (heute, dort).',
      solution: `<b>${w}</b> ist ${art === 'A' ? 'ein' : 'eine'} <b>${ch[idx]}</b>. ${warum} Alle drei bleiben immer gleich, sie haben keine Endungen.`,
      ex: { mode: 'marken', art: 'kjWortart', tokens: [w], correct: [0], was: ch[idx], s1: 'Verbindet es, steht es vor einem Nomen, oder sagt es wann, wo, wie?', merk: `<b>${w}</b>: ${ch[idx]}. ${warum}` },
    };
  }
  function kjArt() {
    const neben = Math.random() < 0.5, w = neben ? pick(KJ_NEBEN) : pick(KJ_UNTER);
    return {
      prompt: `Was macht die Konjunktion <b>${w}</b>, wenn sie zwei Sätze verbindet?`, choices: ['Sie verbindet zwei Hauptsätze. Das Verb bleibt an 2. Stelle.', 'Sie leitet einen Nebensatz ein. Das Verb steht am Ende.'], correct: neben ? 0 : 1,
      hint: 'Bilde einen Satz mit dem Wort. Steht das Verb danach an 2. Stelle oder ganz am Ende?',
      solution: neben ? `<b>${w}</b> verbindet zwei Hauptsätze, zum Beispiel: ${({ und: 'Lina liest, und Ben malt.', oder: 'Wir gehen ins Kino, oder wir bleiben zu Hause.', aber: 'Ich bin müde, aber ich lese noch.', denn: 'Ich bleibe zu Hause, denn es regnet.' })[w]}` : `<b>${w}</b> leitet einen Nebensatz ein, das Verb wandert ans Ende: ${({ weil: 'Ich bleibe zu Hause, weil es regnet.', dass: 'Ich weiß, dass es regnet.', wenn: 'Ich bleibe zu Hause, wenn es regnet.', obwohl: 'Ich gehe raus, obwohl es regnet.', bis: 'Ich warte, bis der Regen aufhört.', bevor: 'Ich gehe heim, bevor es dunkel wird.' })[w]}`,
      ex: { mode: 'marken', art: 'kjArt', tokens: [w], correct: [0], was: neben ? 'verbindet Hauptsätze' : 'leitet einen Nebensatz ein', s1: 'Wo steht das Verb danach?', merk: neben ? `<b>${w}</b>: Hauptsatz + Hauptsatz.` : `<b>${w}</b>: Nebensatz, Verb am Ende.` },
    };
  }
  const konjunktionen = () => U.wahl([[30, kjAntippen], [28, kjLuecke], [22, kjWortart], [20, kjArt]]);

  // =====================================================
  // Bereich 2: Satzbau und Satzzeichen
  // =====================================================
  // Sätze, in Satzglieder geteilt. Rolle: S Subjekt, P Prädikat, D Dativobjekt, A Akkusativobjekt, x weiteres Satzglied
  const ROLLE = { S: 'Subjekt', P: 'Prädikat', D: 'Dativobjekt', A: 'Akkusativobjekt', x: 'weiteres Satzglied', t: 'Zeit', l: 'Ort', m: 'Art und Weise', k: 'Grund' };
  const RFRAGE = { S: 'Wer oder was?', P: 'Was tut jemand? Was geschieht?', D: 'Wem?', A: 'Wen oder was?' };
  const SG = [
    'Der Lehrer|S zeigt|P den Kindern|D das Bild|A', 'Am Abend|x liest|P die Schwester|S ein Buch|A', 'Emil|S schenkt|P seiner Freundin|D eine Blume|A',
    'Im Garten|x spielen|P die Kinder|S', 'Der Kater|S fängt|P eine Maus|A', 'Heute|x hilft|P Lina|S dem Nachbarn|D', 'Der Hund|S folgt|P dem Mädchen|D',
    'Nach der Schule|x besucht|P Mia|S ihre Oma|A', 'Der Bäcker|S gibt|P dem Kind|D ein Brötchen|A', 'Unser Nachbar|S repariert|P das Fahrrad|A',
    'Morgen|x schreibt|P die Klasse|S einen Test|A', 'Die Kinder|S danken|P der Lehrerin|D', 'Ben|S leiht|P seinem Bruder|D den Roller|A',
    'Auf dem Hof|x füttert|P der Bauer|S die Hühner|A', 'Die Mutter|S erzählt|P den Kindern|D eine Geschichte|A', 'Am Wochenende|x baut|P Paul|S ein Vogelhaus|A',
    'Der Wind|S schüttelt|P die Bäume|A', 'Das Pferd|S gehört|P dem Bauern|D',
  ].map((z) => { const t = z.split(/\|(\w) ?/).filter((x) => x !== ''); const g = [], r = []; for (let i = 0; i < t.length; i += 2) { g.push(t[i]); r.push(t[i + 1]); } return { g, r }; });
  const EIGEN = ['Emil', 'Lina', 'Mia', 'Ben', 'Paul', 'Nora'];
  const klein = (t) => (EIGEN.includes(t.split(' ')[0]) ? t : t.charAt(0).toLowerCase() + t.slice(1));
  const sgText = (z, mark, i) => z.g.map((t, k) => (k === i && mark ? mark(t) : t)).join(' ') + '.';
  // Reihenfolge umstellen: order = Liste von Satzglied-Nummern
  const umgestellt = (z, order) => gross(order.map((k) => klein(z.g[k])).join(' ')) + '.';
  const glTokens = (z) => z.g.map((t, i) => (i === z.g.length - 1 ? t + '.' : t));
  const exGl = (art, z, idx, s1, merk, um) => ({ mode: 'glieder', art, teile: z.g, rollen: z.r, idx, s1, merk, um });

  // ---------- Thema: Satzglieder und Umstellprobe ----------
  function sgTrennen() {
    const z = pick(SG);
    const tokens = [], correct = [];
    z.g.forEach((t, k) => { t.split(' ').forEach((w) => tokens.push(w)); if (k < z.g.length - 1) correct.push(tokens.length - 1); });
    tokens[tokens.length - 1] += '.';
    return {
      prompt: 'Trenne den Satz in seine <b>Satzglieder</b>: Tippe alle Grenzen an.',
      tap: { tokens, correct, gaps: true, mark: '|' }, answerText: z.g.join(' | '),
      hint: 'Mach die <b>Umstellprobe</b>: Stelle den Satz um. Wörter, die dabei immer zusammenbleiben, bilden ein Satzglied.',
      solution: `<b>${z.g.join(' | ')}</b>.<br>Das sind ${z.g.length} Satzglieder. Umgestellt: ${umgestellt(z, probe(z))} Die Wörter eines Satzglieds bleiben zusammen.`,
      ex: exGl('sgTrennen', z, [], 'Umstellprobe: Was beim Umstellen zusammenbleibt, ist ein Satzglied.', `<b>${z.g.join(' | ')}</b>: ${z.g.length} Satzglieder.`, probe(z)),
    };
  }
  // eine richtige Umstellung: anderes Satzglied nach vorn, Prädikat bleibt an 2. Stelle
  function probe(z) {
    const p = z.r.indexOf('P');
    const vorn = z.r.indexOf('x') === 0 ? z.r.indexOf('S') : (z.r.indexOf('D') >= 0 ? z.r.indexOf('D') : z.r.indexOf('A'));
    return [vorn, p, ...z.g.map((_, k) => k).filter((k) => k !== vorn && k !== p)];
  }
  function sgZaehlen() {
    const z = pick(SG);
    return {
      prompt: `Wie viele <b>Satzglieder</b> hat der Satz?<br><span class="bsp">${sgText(z)}</span>`,
      choices: ['2', '3', '4', '5'], correct: z.g.length - 2,
      hint: 'Stelle den Satz um. Zähle dann die Teile, die du verschieben kannst. Das Verb (Prädikat) zählt als ein Satzglied mit.',
      solution: `<b>${z.g.join(' | ')}</b>.<br>Das sind <b>${z.g.length}</b> Satzglieder.`,
      ex: exGl('sgZaehlen', z, [], 'Umstellprobe: Was beim Umstellen zusammenbleibt, ist ein Satzglied.', `<b>${z.g.join(' | ')}</b>: <b>${z.g.length}</b> Satzglieder.`, probe(z)),
    };
  }
  function sgUmstellen() {
    const z = pick(SG), ok = probe(z), p = z.r.indexOf('P');
    const rest = z.g.map((_, k) => k).filter((k) => k !== ok[0] && k !== p);
    // falsch, weil das Verb nicht an 2. Stelle steht. Bei Sätzen mit Orts- oder Zeitangabe rückt das Verb ans Ende
    // der ursprünglichen Reihenfolge („Im Garten die Kinder spielen“); „Die Kinder im Garten spielen“ wäre nämlich richtig.
    const verbDritte = z.r.includes('x')
      ? gross([...z.g.filter((_, k) => k !== p), z.g[p]].join(' ')) + '.'
      : gross([klein(z.g[ok[0]]), ...rest.slice(0, 1).map((k) => klein(z.g[k])), z.g[p], ...rest.slice(1).map((k) => klein(z.g[k]))].join(' ')) + '.';
    const mehr = z.g.map((t, k) => k).filter((k) => z.g[k].includes(' ') && k !== 0);
    const gk = pick(mehr.length ? mehr : [0]), w = z.g[gk].split(' ');
    const zerrissen = gross([w[0], z.g[p], ...z.g.map((t, k) => (k === p ? null : k === gk ? w.slice(1).join(' ') : klein(t))).filter((t) => t !== null)].join(' ')) + '.';
    const richtig = umgestellt(z, ok);
    const wahl = shuffle([richtig, verbDritte, zerrissen]);
    return {
      prompt: `Welche Umstellung ist richtig?<br><span class="bsp">${sgText(z)}</span>`,
      choices: wahl, correct: wahl.indexOf(richtig),
      hint: 'Zwei Regeln der Umstellprobe: Die Wörter eines Satzglieds bleiben <b>zusammen</b>. Und die Personalform des Verbs bleibt an <b>2. Stelle</b>.',
      solution: `<b>${richtig}</b><br>„${verbDritte}“ ist falsch: Das Verb steht nicht mehr an 2. Stelle.<br>„${zerrissen}“ ist falsch: Ein Satzglied wurde auseinandergerissen.`,
      ex: exGl('sgUmstellen', z, [], 'Beim Umstellen wandern ganze Satzglieder. Das Prädikat bleibt an 2. Stelle.', `Richtig umgestellt: <b>${richtig}</b>`, ok),
    };
  }
  const satzglieder = () => U.wahl([[42, sgTrennen], [22, sgZaehlen], [36, sgUmstellen]]);

  // ---------- Thema: Subjekt und Prädikat ----------
  function glAntippen(art, rollen, mitFrage) {
    const z = pick(SG.filter((x) => rollen.some((r) => x.r.includes(r))));
    const r = pick(rollen.filter((x) => z.r.includes(x))), i = z.r.indexOf(r);
    const warum = { S: 'Das Subjekt sagt, wer oder was etwas tut.', P: 'Das Prädikat ist das Verb. Es sagt, was geschieht, und steht an 2. Stelle.', D: 'Das Dativobjekt antwortet auf „Wem?“.', A: 'Das Akkusativobjekt antwortet auf „Wen oder was?“.' }[r];
    return {
      prompt: `Tippe das <b>${ROLLE[r]}</b> an.`,
      tap: { tokens: glTokens(z), correct: [i], one: true }, answerText: z.g[i],
      hint: `Frage: <b>${RFRAGE[r]}</b>`,
      solution: `${sgText(z, (t) => `<b class="vb">${t}</b>`, i)}<br>${RFRAGE[r]} → <b>${z.g[i]}</b>. ${warum}`,
      ex: exGl(art, z, [i], `Frage: <b>${RFRAGE[r]}</b>`, `${RFRAGE[r]} → <b>${z.g[i]}</b>: ${ROLLE[r]}.`),
    };
  }
  function glBestimmen(art, rollen, nachFrage) {
    const z = pick(SG.filter((x) => rollen.some((r) => x.r.includes(r))));
    const r = pick(rollen.filter((x) => z.r.includes(x))), i = z.r.indexOf(r);
    const alle = ['S', 'P', 'D', 'A'];
    return {
      prompt: `${nachFrage ? 'Mit welcher <b>Frage</b> findest du das markierte Satzglied?' : 'Welches <b>Satzglied</b> ist markiert?'}<br><span class="bsp">${sgText(z, (t) => `<u>${t}</u>`, i)}</span>`,
      choices: alle.map((k) => (nachFrage ? RFRAGE[k] : ROLLE[k])), correct: alle.indexOf(r),
      hint: 'Subjekt: Wer oder was? · Prädikat: Was tut jemand? (das Verb) · Dativobjekt: Wem? · Akkusativobjekt: Wen oder was?',
      solution: `${sgText(z, (t) => `<b class="vb">${t}</b>`, i)}<br>${RFRAGE[r]} → <b>${z.g[i]}</b>. Das ist das <b>${ROLLE[r]}</b>.`,
      ex: exGl(art, z, [i], `Frage: <b>${RFRAGE[r]}</b>`, `${RFRAGE[r]} → <b>${z.g[i]}</b>: ${ROLLE[r]}.`),
    };
  }
  const spAntippen = () => glAntippen('spAntippen', ['S', 'P']);
  const spBestimmen = () => glBestimmen('spBestimmen', ['S', 'P'], Math.random() < 0.5);
  // Subjekt und Prädikat passen zusammen (Kongruenz)
  function kongruenz() {
    const v = pick(V.filter((x) => x.du !== x.er)), su = pick(SUBJ.filter((x) => [1, 2, 3, 5].includes(x.p)));
    const formen = shuffle([v.du, v.er, v.inf]), ok = praesens(v, su.p);
    return {
      prompt: `Welche Verbform passt zum Subjekt?<br><span class="bsp">${su.t} ___ ${v.rest}.</span>`,
      choices: formen, correct: formen.indexOf(ok),
      hint: 'Subjekt und Prädikat müssen zusammenpassen: Ist das Subjekt <b>eine</b> Person oder Sache oder sind es <b>mehrere</b>? Ersetze es zur Probe durch er, sie oder du.',
      solution: `${su.t} <b class="vb">${ok}</b> ${v.rest}.<br>Das Subjekt „${su.t}“ ${su.p === 5 || su.p === 3 ? 'steht in der Mehrzahl' : su.p === 1 ? 'ist die 2. Person (du)' : 'steht in der Einzahl'}, also heißt das Prädikat <b>${ok}</b>.`,
      ex: zz('kongruenz', [su.t, ' ___ ' + v.rest + '.'], 0, [su.t + ' ', ok, ' ' + v.rest + '.'], 1, `Schau auf das Subjekt: <b>${su.t}</b>. Einzahl oder Mehrzahl? Welche Person?`, 'Das Prädikat richtet sich nach dem Subjekt. Beide passen in Person und Zahl zusammen.', `${su.t} <b>${ok}</b> ${v.rest}.`),
    };
  }
  const subjektPraedikat = () => U.wahl([[38, spAntippen], [30, spBestimmen], [32, kongruenz]]);

  // ---------- Thema: Dativ- und Akkusativobjekt ----------
  const objAntippen = () => glAntippen('objAntippen', ['D', 'A']);
  const objBestimmen = () => glBestimmen('objBestimmen', ['D', 'A', 'S'], false);
  const objFrage = () => glBestimmen('objFrage', ['D', 'A'], true);
  const objekte = () => U.wahl([[40, objAntippen], [32, objBestimmen], [28, objFrage]]);

  // ---------- Thema: Attribute ----------
  // Attribute (vorangestellte Adjektive und Partizipien) sind mit * markiert
  const SATZ_ATTR = [
    'Der *kleine Hund bringt den *roten Ball.', 'Die *alte Katze schläft auf dem *weichen Kissen.', 'Das *lachende Kind winkt der *netten Nachbarin.',
    'Der *neue Lehrer liest eine *spannende Geschichte.', 'Die *fröhlichen Kinder bauen eine *große Hütte.', 'Der *bellende Hund jagt die *schnelle Katze.',
    'Lina trägt einen *schweren Koffer.', 'Emil findet einen *glänzenden Stein.', 'Die *müde Lehrerin trinkt einen *heißen Tee.', 'Im Garten blühen *bunte Blumen.',
    'Der *alte Baum verliert seine *gelben Blätter.', 'Mia füttert das *hungrige Pferd.', 'Das *spielende Mädchen wirft den *kleinen Ball.', 'Der Zug fährt über die *lange Brücke.',
  ];
  const TIPP_ATTR = 'Ein Attribut beschreibt ein Nomen genauer und steht direkt davor. <b>Weglassprobe:</b> Lässt du es weg, bleibt der Satz trotzdem richtig.';
  function attrAntippen() {
    const { tokens, correct } = markSatz(SATZ_ATTR);
    const liste = correct.map((i) => tokens[i]);
    const ohne = tokens.filter((_, i) => !correct.includes(i)).join(' ');
    return {
      prompt: 'Tippe <b>alle Attribute</b> an.', tap: { tokens, correct }, answerText: liste.join(', '),
      hint: TIPP_ATTR,
      solution: `Attribute: <b>${liste.join(', ')}</b>.<br>Weglassprobe: „${ohne}“ Der Satz stimmt immer noch.`,
      ex: { mode: 'marken', art: 'attrAntippen', tokens, correct, was: 'Attribute', s1: 'Ein Attribut steht vor einem Nomen und beschreibt es genauer. Ohne Attribut bleibt der Satz richtig.' },
    };
  }
  function attrWeglassen() {
    const { tokens, correct } = markSatz(SATZ_ATTR);
    const a = pick(correct);
    // falsche Antworten: nur Wörter, die sicher nicht fehlen dürfen (Satzanfang, Verb, Präposition).
    // Artikel sind keine guten falschen Antworten: „Sie trinkt heißen Tee“ ist auch ohne Artikel richtig.
    const FEST = ['bringt', 'schläft', 'winkt', 'liest', 'bauen', 'jagt', 'trägt', 'findet', 'trinkt', 'blühen', 'verliert', 'füttert', 'wirft', 'fährt', 'auf', 'über'];
    const andere = shuffle(tokens.map((w, i) => i).filter((i) => !correct.includes(i) && (i === 0 || FEST.includes(tokens[i])))).slice(0, 3);
    const wahlIdx = shuffle([a, ...andere]);
    const ohne = tokens.filter((_, i) => i !== a).join(' ');
    return {
      prompt: `Welches Wort kann man <b>weglassen</b>, ohne dass der Satz falsch wird?<br><span class="bsp">${tokens.join(' ')}</span>`,
      choices: wahlIdx.map((i) => cleanW(tokens[i])), correct: wahlIdx.indexOf(a),
      hint: TIPP_ATTR,
      solution: `<b>${tokens[a]}</b> ist ein Attribut. Ohne es heißt der Satz: „${gross(ohne)}“ Das ist immer noch ein richtiger Satz.`,
      ex: { mode: 'marken', art: 'attrWeglassen', tokens, correct: [a], was: 'Attribut', s1: 'Weglassprobe: Welches Wort darf fehlen, ohne dass der Satz falsch wird?' },
    };
  }
  function attrBezug() {
    let m; do { m = markSatz(SATZ_ATTR); } while (m.tokens.filter((w, i) => i > 0 && /^[A-ZÄÖÜ]/.test(w)).length + (EIGEN.includes(m.tokens[0]) ? 1 : 0) < 2);
    const { tokens, correct } = m, a = pick(correct);
    const subst = tokens.map((w, i) => i).filter((i) => (i > 0 && /^[A-ZÄÖÜ]/.test(tokens[i])) || (i === 0 && EIGEN.includes(tokens[0])));
    return {
      prompt: `Welches Nomen beschreibt das markierte Attribut genauer?<br><span class="bsp">${tokens.map((w, i) => (i === a ? `<u>${w}</u>` : w)).join(' ')}</span>`,
      choices: subst.map((i) => cleanW(tokens[i])), correct: subst.indexOf(a + 1),
      hint: 'Ein Attribut steht direkt <b>vor</b> seinem Nomen. Frage: „Was für ein …?“',
      solution: `<b>${tokens[a]} ${cleanW(tokens[a + 1])}</b>: Das Attribut „${tokens[a]}“ steht direkt vor „${cleanW(tokens[a + 1])}“ und beschreibt es genauer.`,
      ex: { mode: 'marken', art: 'attrBezug', tokens, correct: [a, a + 1], was: 'Attribut und Nomen', s1: 'Ein Attribut steht direkt vor seinem Nomen. Frage: Was für ein …?' },
    };
  }
  const attribute = () => U.wahl([[40, attrAntippen], [32, attrWeglassen], [28, attrBezug]]);

  // ---------- Thema: Hauptsatz und Nebensatz ----------
  // [Subjekt, Verb, Rest] des Hauptsatzes, Einleitewort, [Subjekt, Rest, Verb] des Nebensatzes
  const GEF = [
    [['Lina', 'bleibt', 'zu Hause'], 'weil', ['sie', 'krank', 'ist']], [['Emil', 'jubelt', 'laut'], 'weil', ['die Ferien', '', 'beginnen']],
    [['Wir', 'gehen', 'ins Schwimmbad'], 'wenn', ['die Sonne', '', 'scheint']], [['Mia', 'nimmt', 'einen Schirm mit'], 'weil', ['es', '', 'regnet']],
    [['Der Hund', 'bellt', 'laut'], 'wenn', ['jemand', '', 'klingelt']], [['Ben', 'weiß', ''], 'dass', ['der Bus', 'bald', 'kommt']],
    [['Die Kinder', 'spielen', 'draußen'], 'obwohl', ['es', 'kalt', 'ist']], [['Paul', 'macht', 'das Licht an'], 'weil', ['es', 'dunkel', 'wird']],
    [['Ich', 'rufe', 'dich an'], 'wenn', ['ich', 'zu Hause', 'bin']], [['Nora', 'hofft', ''], 'dass', ['ihre Freundin', '', 'kommt']],
    [['Der Lehrer', 'wartet', ''], 'bis', ['alle Kinder', '', 'sitzen']], [['Emil', 'liest', 'noch'], 'obwohl', ['er', 'müde', 'ist']],
    [['Die Katze', 'schnurrt', ''], 'wenn', ['Mia', 'sie', 'streichelt']], [['Wir', 'bleiben', 'drinnen'], 'weil', ['der Wind', 'stark', 'weht']],
  ].map(([hs, k, ns]) => ({ hs, k, ns }));
  const j = (a) => a.filter(Boolean).join(' ');
  // Wörter des ganzen Satzgefüges; nsVorn: Nebensatz zuerst (dann dreht sich der Hauptsatz um)
  function gefuege(nsVorn) {
    const g = pick(GEF.filter((x) => !nsVorn || x.k !== 'dass' && x.k !== 'bis'));
    const hs = j(g.hs).split(' '), ns = [g.k, ...j(g.ns).split(' ')];
    const hsUm = [g.hs[1], ...klein(g.hs[0]).split(' '), ...(g.hs[2] ? g.hs[2].split(' ') : [])];
    const w = nsVorn ? [gross(ns[0]), ...ns.slice(1), ...hsUm] : [...hs, ...ns];
    const komma = nsVorn ? ns.length - 1 : hs.length - 1;
    const hsVerb = nsVorn ? ns.length : g.hs[0].split(' ').length, nsVerb = nsVorn ? ns.length - 1 : w.length - 1;
    const mitKomma = w.map((x, i) => x + (i === komma ? ',' : '') + (i === w.length - 1 ? '.' : ''));
    return { g, w, komma, hsVerb, nsVerb, mitKomma, nsVorn, hsT: nsVorn ? hsUm.join(' ') : hs.join(' '), nsT: ns.join(' ') };
  }
  const REGEL_NS = 'Im <b>Nebensatz</b> steht die Personalform des Verbs am <b>Ende</b>. Im <b>Hauptsatz</b> steht sie an 2. Stelle (oder ganz vorn, wenn der Nebensatz zuerst kommt).';
  function nsVerb() {
    const x = gefuege(Math.random() < 0.3), imNS = Math.random() < 0.6;
    const i = imNS ? x.nsVerb : x.hsVerb;
    return {
      prompt: `Tippe die <b>Personalform des Verbs</b> im <b>${imNS ? 'Nebensatz' : 'Hauptsatz'}</b> an.`,
      tap: { tokens: x.mitKomma, correct: [i], one: true }, answerText: x.w[i],
      hint: `Finde zuerst den Nebensatz: Er beginnt mit einem Einleitewort wie <i>weil, wenn, dass, obwohl, bis</i>. ${REGEL_NS}`,
      solution: `${x.mitKomma.map((t, k) => (k === i ? `<b class="vb">${t}</b>` : t)).join(' ')}<br>Nebensatz: „${x.nsT}“. Hauptsatz: „${x.hsT}“. ${REGEL_NS}`,
      ex: { mode: 'marken', art: 'nsVerb', tokens: x.mitKomma, correct: [i], was: `Personalform im ${imNS ? 'Nebensatz' : 'Hauptsatz'}`, s1: REGEL_NS },
    };
  }
  function nsBau() {
    const g = pick(GEF.filter((x) => x.ns[1]));
    const ok = `${g.k} ${j(g.ns)}`, f1 = `${g.k} ${g.ns[0]} ${g.ns[2]} ${g.ns[1]}`, f2 = `${g.k} ${g.ns[2]} ${g.ns[0]} ${g.ns[1]}`;
    const wahl = shuffle([ok, f1, f2]);
    return {
      prompt: `Welcher Nebensatz ist richtig gebaut?<br><span class="bsp">${j(g.hs)}, …</span>`,
      choices: wahl.map((t) => '… ' + t + '.'), correct: wahl.indexOf(ok),
      hint: 'Im Nebensatz wandert die Personalform des Verbs ganz ans <b>Ende</b>.',
      solution: `${j(g.hs)}, <b class="vb">${ok}</b>.<br>Im Nebensatz steht das Verb am Ende: … ${g.ns[1]} <b>${g.ns[2]}</b>.`,
      ex: zz('nsBau', [`${g.ns[0]} `, g.ns[2], ` ${g.ns[1]}.`], 1, [`${g.k} ${g.ns[0]} ${g.ns[1]} `, g.ns[2], '.'], 1, `Als Hauptsatz steht das Verb an 2. Stelle: ${gross(g.ns[0])} <b>${g.ns[2]}</b> ${g.ns[1]}.`, `Mit „${g.k}“ wird daraus ein Nebensatz. Das Verb wandert ans Ende.`, `… <b>${ok}</b>.`),
    };
  }
  function hsOderNs() {
    const ns = Math.random() < 0.5, g = pick(GEF.filter((x) => ns || x.hs[2]));
    const t = ns ? `${g.k} ${j(g.ns)}` : j(g.hs);
    return {
      prompt: `Hauptsatz oder Nebensatz?<br><span class="bsp">${t}</span>`,
      choices: ['Hauptsatz', 'Nebensatz'], correct: ns ? 1 : 0,
      hint: 'Kann der Satz <b>allein</b> stehen? Dann ist es ein Hauptsatz. Ein Nebensatz beginnt mit einem Einleitewort (weil, wenn, dass …), und sein Verb steht am Ende.',
      solution: ns ? `„${t}“ ist ein <b>Nebensatz</b>: Er beginnt mit „${g.k}“, das Verb „${g.ns[2]}“ steht am Ende, und allein ergibt er keinen vollständigen Satz.` : `„${t}“ ist ein <b>Hauptsatz</b>: Er kann allein stehen, und das Verb „${g.hs[1]}“ steht an 2. Stelle.`,
      ex: { mode: 'marken', art: 'hsOderNs', tokens: t.split(' '), correct: ns ? [0, t.split(' ').length - 1] : [g.hs[0].split(' ').length], was: ns ? 'Nebensatz: Einleitewort und Verb am Ende' : 'Hauptsatz: Verb an 2. Stelle', s1: 'Schau auf das Verb: Wo steht die Personalform? Und beginnt der Satz mit einem Einleitewort?' },
    };
  }
  const nebensatz = () => U.wahl([[42, nsVerb], [30, nsBau], [28, hsOderNs]]);

  // ---------- Thema: Satzarten ----------
  // Personalform des Verbs ist mit * markiert
  const SARTEN = {
    aussage: ['Der Bus *kommt um acht', 'Wir *haben heute Sport', 'Die Katze *liegt auf dem Sofa', 'Morgen *schreiben wir einen Test', 'Lina *hat einen neuen Roller', 'Im Winter *wird es früh dunkel', 'Emil *spielt gern Fußball', 'Das Buch *gehört meiner Schwester'],
    frage: ['*Kommst du heute mit ins Kino', 'Wo *liegt mein Heft', 'Wann *beginnt der Film', '*Hast du den Hund gefüttert', 'Warum *lachst du', 'Wie spät *ist es', '*Darf ich das Fenster öffnen', 'Wer *hat die Tür zugemacht'],
    aufforderung: ['*Komm bitte sofort her', '*Pass auf', '*Gib mir bitte den Stift', '*Hört gut zu', '*Räum bitte dein Zimmer auf', '*Sei leise', '*Lauf schneller', '*Macht bitte die Tür zu'],
  };
  const SNAME = { aussage: 'Aussagesatz', frage: 'Fragesatz', aufforderung: 'Aufforderungssatz' };
  const SZEICHEN = { aussage: '.', frage: '?', aufforderung: '!' };
  const SWARUM = {
    aussage: 'Ein Aussagesatz teilt etwas mit. Das Verb steht an 2. Stelle, am Ende steht ein Punkt.',
    frage: 'Ein Fragesatz will etwas wissen. Er beginnt mit einem Fragewort (dann steht das Verb an 2. Stelle) oder gleich mit dem Verb. Am Ende steht ein Fragezeichen.',
    aufforderung: 'Ein Aufforderungssatz sagt jemandem, was er tun soll. Das Verb steht ganz vorn, am Ende steht meistens ein Ausrufezeichen.',
  };
  function sartSatz(art) {
    art = art || pick(Object.keys(SARTEN));
    const roh = pick(SARTEN[art]).split(' ');
    const verb = roh.findIndex((w) => w[0] === '*');
    const w = roh.map((x) => x.replace('*', ''));
    return { art, w, verb, text: w.join(' ') + SZEICHEN[art], tokens: w.map((x, i) => (i === w.length - 1 ? x + SZEICHEN[art] : x)) };
  }
  const exSart = (name, x) => ({ mode: 'marken', art: name, tokens: x.tokens, correct: [x.verb], was: `${SNAME[x.art]}, Verb`, s1: SWARUM[x.art] });
  function sartBestimmen() {
    const x = sartSatz(), arten = Object.keys(SARTEN);
    return {
      prompt: `Welche Satzart ist das?<br><span class="bsp">${x.text}</span>`,
      choices: arten.map((a) => SNAME[a]), correct: arten.indexOf(x.art),
      hint: 'Was will der Satz? Etwas <b>mitteilen</b>, etwas <b>wissen</b> oder jemanden zu etwas <b>auffordern</b>? Schau auch, wo das Verb steht.',
      solution: `„${x.text}“ ist ein <b>${SNAME[x.art]}</b>. ${SWARUM[x.art]}`, ex: exSart('sartBestimmen', x),
    };
  }
  function sartWelcher() {
    const arten = shuffle(Object.keys(SARTEN)), ziel = pick(arten);
    const xs = arten.map((a) => sartSatz(a));
    return {
      prompt: `Welcher Satz ist ein <b>${SNAME[ziel]}</b>?`,
      choices: xs.map((x) => x.text), correct: arten.indexOf(ziel),
      hint: 'Aussagesatz: teilt etwas mit. Fragesatz: will etwas wissen. Aufforderungssatz: sagt jemandem, was er tun soll.',
      solution: `<b>${xs[arten.indexOf(ziel)].text}</b><br>${SWARUM[ziel]}`, ex: exSart('sartWelcher', xs[arten.indexOf(ziel)]),
    };
  }
  function sartZeichen() {
    const x = sartSatz(pick(['aussage', 'frage']));
    return {
      prompt: `Punkt oder Fragezeichen?<br><span class="bsp">${x.w.join(' ')} ___</span>`,
      choices: ['. (Punkt)', '? (Fragezeichen)'], correct: x.art === 'frage' ? 1 : 0,
      hint: 'Will der Satz etwas wissen? Achte auf den Anfang: Ein Fragewort (wo, wann, warum …) oder das Verb ganz vorn zeigen eine Frage.',
      solution: `<b>${x.text}</b><br>${SWARUM[x.art]}`, ex: exSart('sartZeichen', x),
    };
  }
  function sartVerb() {
    const x = sartSatz();
    return {
      prompt: 'Tippe die <b>Personalform des Verbs</b> an.',
      tap: { tokens: x.tokens, correct: [x.verb], one: true }, answerText: x.w[x.verb],
      hint: 'Im Aussagesatz steht das Verb an 2. Stelle. In der Aufforderung und in Fragen ohne Fragewort steht es ganz vorn.',
      solution: `${x.tokens.map((t, k) => (k === x.verb ? `<b class="vb">${t}</b>` : t)).join(' ')}<br>${SNAME[x.art]}: Das Verb „${x.w[x.verb]}“ steht ${x.verb === 0 ? 'ganz vorn' : 'an 2. Stelle'}. ${SWARUM[x.art]}`,
      ex: exSart('sartVerb', x),
    };
  }
  const satzarten = () => U.wahl([[32, sartBestimmen], [22, sartWelcher], [14, sartZeichen], [32, sartVerb]]);

  // ---------- Thema: Komma bei Aufzählung und Satzgefüge ----------
  const AUFZ = [
    ['Im Korb liegen', ['Äpfel', 'Birnen', 'Pflaumen', 'Nüsse', 'Trauben']], ['Lina packt', ['Hefte', 'Stifte', 'Bücher', 'ein Lineal', 'eine Schere']],
    ['Im Zoo sehen wir', ['Löwen', 'Affen', 'Zebras', 'Giraffen', 'Elefanten']], ['Emil mag', ['Pizza', 'Nudeln', 'Pfannkuchen', 'Eis']],
    ['Auf dem Tisch stehen', ['Teller', 'Tassen', 'Gläser', 'Schüsseln']], ['Der Hund ist', ['klein', 'frech', 'schnell', 'verspielt']],
    ['Wir brauchen', ['Mehl', 'Eier', 'Zucker', 'Butter', 'Milch']], ['Im Garten wachsen', ['Tomaten', 'Gurken', 'Bohnen', 'Kürbisse']],
  ];
  function aufzaehlung() {
    const [vor, alle] = pick(AUFZ), n = R(3, 4), it = shuffle(alle).slice(0, n);
    const w = vor.split(' '), komma = [];
    it.forEach((x, i) => { if (i === n - 1) w.push('und'); x.split(' ').forEach((y) => w.push(y)); if (i < n - 2) komma.push(w.length - 1); });
    const mit = (ks) => w.map((x, i) => x + (ks.includes(i) ? ',' : '')).join(' ') + '.';
    return { w, komma, mit, richtig: mit(komma), vorUnd: w.indexOf('und') - 1 };
  }
  const REGEL_AUFZ = 'Bei einer <b>Aufzählung</b> steht zwischen den Teilen ein Komma. Vor <b>und</b> steht kein Komma: Das „und“ ersetzt es.';
  const exKomma = (art, w, komma, s1) => ({ mode: 'komma', art, tokens: w.map((x, i) => (i === w.length - 1 ? x + '.' : x)), gaps: komma, s1 });
  function kommaAufz() {
    const a = aufzaehlung();
    return {
      prompt: 'Setze die fehlenden <b>Kommas</b>: Tippe die Stellen an.',
      tap: { tokens: a.w.map((x, i) => (i === a.w.length - 1 ? x + '.' : x)), correct: a.komma, gaps: true }, answerText: a.richtig,
      hint: REGEL_AUFZ, solution: `<b>${a.richtig}</b><br>${REGEL_AUFZ}`, ex: exKomma('kommaAufz', a.w, a.komma, REGEL_AUFZ),
    };
  }
  function kommaWahl() {
    const a = aufzaehlung();
    const f1 = a.mit([...a.komma, a.vorUnd]), f2 = a.mit(a.komma.slice(1));
    const wahl = shuffle([a.richtig, f1, f2]);
    return {
      prompt: 'In welchem Satz stehen die Kommas richtig?',
      choices: wahl, correct: wahl.indexOf(a.richtig),
      hint: REGEL_AUFZ,
      solution: `<b>${a.richtig}</b><br>${REGEL_AUFZ}`, ex: exKomma('kommaWahl', a.w, a.komma, REGEL_AUFZ),
    };
  }
  const REGEL_GEF = 'Zwischen <b>Hauptsatz</b> und <b>Nebensatz</b> steht immer ein Komma. Der Nebensatz beginnt mit einem Einleitewort (weil, wenn, dass, obwohl, bis), sein Verb steht am Ende.';
  function kommaGef() {
    const x = gefuege(Math.random() < 0.35);
    return {
      prompt: 'Setze das fehlende <b>Komma</b>: Tippe die Stelle an.',
      tap: { tokens: x.w.map((t, i) => (i === x.w.length - 1 ? t + '.' : t)), correct: [x.komma], gaps: true, one: true }, answerText: x.mitKomma.join(' '),
      hint: 'Wo endet der eine Satz und wo beginnt der andere? Suche das Einleitewort (weil, wenn, dass, obwohl, bis) und die beiden Verben.',
      solution: `<b>${x.mitKomma.join(' ')}</b><br>${REGEL_GEF}`, ex: exKomma('kommaGef', x.w, [x.komma], REGEL_GEF),
    };
  }
  // Apposition (Beisatz): Kommas mit (,) markiert (Deutschbuch Kap. 4, S. 112)
  const APPO = ['Herr Meier(,) unser Nachbar(,) hat einen großen Hund.', 'Lina(,) meine beste Freundin(,) wohnt in Dresden.', 'Bello(,) der Hund von Ben(,) bellt jeden Morgen.',
    'Frau Klein(,) unsere Lehrerin(,) liest uns eine Geschichte vor.', 'Dresden(,) die Hauptstadt von Sachsen(,) liegt an der Elbe.', 'Wir besuchen Oma Inge(,) die Mutter meines Vaters.',
    'Emil(,) mein kleiner Bruder(,) spielt gern Fußball.', 'Der Elbradweg(,) ein langer Radweg(,) führt an der Elbe entlang.'];
  const REGEL_APPO = 'Eine <b>Apposition</b> (Beisatz) steht hinter einem Nomen und erklärt es genauer: „Lina, <b>meine beste Freundin</b>, …“. Sie wird mit <b>Kommas</b> abgetrennt, vorn und hinten. Am Satzende ersetzt der Punkt das zweite Komma.';
  function kommaAppo() {
    const roh = pick(APPO).split(' '), w = roh.map((x) => x.replace('(,)', '').replace(/\.$/, '')), ks = roh.map((x, i) => (x.includes('(,)') ? i : -1)).filter((i) => i >= 0);
    const voll = w.map((x, i) => x + (ks.includes(i) ? ',' : '')).join(' ') + '.';
    return {
      prompt: 'Setze die fehlenden <b>Kommas</b>: Tippe die Stellen an.',
      tap: { tokens: w.map((t, i) => (i === w.length - 1 ? t + '.' : t)), correct: ks, gaps: true }, answerText: voll,
      hint: 'Steckt im Satz ein Einschub, der ein Nomen genauer erklärt (meine Freundin, unser Nachbar)? Den trennt man mit Kommas ab.',
      solution: `<b>${voll}</b><br>${REGEL_APPO}`, ex: exKomma('kommaAppo', w, ks, REGEL_APPO),
    };
  }
  const komma = () => U.wahl([[28, kommaAufz], [18, kommaWahl], [34, kommaGef], [20, kommaAppo]]);

  // ---------- Thema: Adverbiale Bestimmungen (Deutschbuch Kap. 9, S. 228) ----------
  // Rollen: t Zeit (Wann?), l Ort (Wo? Wohin?), m Art und Weise (Wie?), k Grund (Warum?)
  const ABF = { t: 'Wann?', l: 'Wo? Wohin?', m: 'Wie?', k: 'Warum?' };
  const ABN = { t: 'adverbiale Bestimmung der Zeit', l: 'adverbiale Bestimmung des Ortes', m: 'adverbiale Bestimmung der Art und Weise', k: 'adverbiale Bestimmung des Grundes' };
  const AB = [
    'Am Morgen|t fährt|P Lina|S zur Schule|l', 'Wegen des Regens|k bleiben|P wir|S zu Hause|l', 'Der Hund|S schläft|P im Körbchen|l',
    'Emil|S rennt|P schnell|m nach Hause|l', 'Nach dem Essen|t spielen|P die Kinder|S im Garten|l', 'Aus Angst|k bellt|P der Hund|S laut|m',
    'Morgen|t schreiben|P wir|S einen Test|A', 'Mia|S singt|P fröhlich|m ein Lied|A', 'Im Sommer|t baden|P wir|S im See|l',
    'Wegen der Hitze|k trinkt|P Ben|S viel Wasser|A', 'Oma|S strickt|P am Abend|t einen Schal|A', 'Vor Freude|k hüpft|P Nora|S durch das Zimmer|l',
    'Heute|t gehen|P wir|S ins Kino|l', 'Leise|m öffnet|P Mia|S die Tür|A', 'Wegen der Kälte|k trägt|P Paul|S eine Mütze|A', 'Im Winter|t schneit|P es|S oft|t',
  ].map((z) => { const t = z.split(/\|(\w) ?/).filter((x) => x !== ''); const g = [], r = []; for (let i = 0; i < t.length; i += 2) { g.push(t[i]); r.push(t[i + 1]); } return { g, r }; })
    .filter((z) => z.r.filter((r) => r === 't').length < 2);
  const AB_TIPP = 'Adverbiale Bestimmungen sind Satzglieder, die genauer sagen, <b>wann</b> (Zeit), <b>wo/wohin</b> (Ort), <b>wie</b> (Art und Weise) oder <b>warum</b> (Grund) etwas geschieht.';
  const abZiel = () => { const z = pick(AB), idx = z.r.map((r, i) => (ABF[r] ? i : -1)).filter((i) => i >= 0), i = pick(idx); return { z, i, r: z.r[i] }; };
  function abBestimmen() {
    const { z, i, r } = abZiel(), arten = Object.keys(ABF);
    return {
      prompt: `Welche adverbiale Bestimmung ist markiert?<br><span class="bsp">${sgText(z, (t) => `<u>${t}</u>`, i)}</span>`,
      choices: arten.map((a) => `${ROLLE[a]} (${ABF[a]})`), correct: arten.indexOf(r), hint: AB_TIPP,
      solution: `${sgText(z, (t) => `<b class="vb">${t}</b>`, i)}<br>${ABF[r]} → <b>${z.g[i]}</b>: ${ABN[r]}.`,
      ex: exGl('abBestimmen', z, [i], `Frage: <b>${ABF[r]}</b>`, `${ABF[r]} → <b>${z.g[i]}</b>: ${ABN[r]}.`),
    };
  }
  function abAntippen() {
    const { z, i, r } = abZiel();
    return {
      prompt: `Tippe die <b>${ABN[r]}</b> an.`, tap: { tokens: glTokens(z), correct: [i], one: true }, answerText: z.g[i],
      hint: `Frage: <b>${ABF[r]}</b>`,
      solution: `${sgText(z, (t) => `<b class="vb">${t}</b>`, i)}<br>${ABF[r]} → <b>${z.g[i]}</b>.`,
      ex: exGl('abAntippen', z, [i], `Frage: <b>${ABF[r]}</b>`, `${ABF[r]} → <b>${z.g[i]}</b>: ${ABN[r]}.`),
    };
  }
  function abFrage() {
    const { z, i, r } = abZiel(), arten = Object.keys(ABF);
    return {
      prompt: `Mit welcher Frage findest du das markierte Satzglied?<br><span class="bsp">${sgText(z, (t) => `<u>${t}</u>`, i)}</span>`,
      choices: arten.map((a) => ABF[a]), correct: arten.indexOf(r), hint: AB_TIPP,
      solution: `${sgText(z, (t) => `<b class="vb">${t}</b>`, i)}<br><b>${ABF[r]}</b> → ${z.g[i]}. Das ist die ${ABN[r]}.`,
      ex: exGl('abFrage', z, [i], `Frage: <b>${ABF[r]}</b>`, `${ABF[r]} → <b>${z.g[i]}</b>: ${ABN[r]}.`),
    };
  }
  const adverbiale = () => U.wahl([[36, abBestimmen], [36, abAntippen], [28, abFrage]]);

  // ---------- Thema: Satzreihe; weil, da, denn (Deutschbuch Kap. 9, S. 231; Kap. 2, S. 49) ----------
  // Begründungen: [Hauptsatz, Subjekt, Rest, Verb]
  const BEG = [['Ich bleibe zu Hause', 'ich', 'krank', 'bin'], ['Wir gehen nicht raus', 'es', 'stark', 'regnet'], ['Lina freut sich', 'sie', 'morgen Geburtstag', 'hat'],
    ['Emil ist müde', 'er', 'lange gelesen', 'hat'], ['Der Hund bellt', 'er', 'Hunger', 'hat'], ['Wir ziehen Jacken an', 'es', 'kalt', 'ist'],
    ['Paul lacht', 'der Film', 'lustig', 'ist'], ['Nora übt jeden Tag', 'sie', 'bald ein Konzert', 'hat']];
  const vEnde = (b) => `${b[1]} ${b[2]} ${b[3]}`, vZwei = (b) => `${b[1]} ${b[3]} ${b[2]}`;
  const BEG_REGEL = 'Nach <b>weil</b> und <b>da</b> beginnt ein Nebensatz: Das Verb steht am <b>Ende</b>. Nach <b>denn</b> kommt ein Hauptsatz: Das Verb steht an <b>2. Stelle</b>.';
  function begSatz() {
    const b = pick(BEG), k = pick(['weil', 'da', 'denn']), ende = k !== 'denn';
    const ok = `${b[0]}, ${k} ${ende ? vEnde(b) : vZwei(b)}.`, falsch = `${b[0]}, ${k} ${ende ? vZwei(b) : vEnde(b)}.`;
    const ch = shuffle([ok, falsch]), w = ok.replace('.', '').split(' '), vi = w.lastIndexOf(b[3]);
    return {
      prompt: `Welcher Satz ist richtig gebaut? Achte auf <b>${k}</b>.`, choices: ch, correct: ch.indexOf(ok), hint: BEG_REGEL,
      solution: `<b>${ok}</b><br>${ende ? `Nach „${k}“ steht das Verb „${b[3]}“ am Ende.` : `Nach „denn“ steht das Verb „${b[3]}“ an 2. Stelle, wie in einem Hauptsatz.`}`,
      ex: { mode: 'marken', art: 'begSatz', tokens: ok.split(' '), correct: [w.indexOf(k), vi], was: `${k} und das Verb`, s1: BEG_REGEL, merk: `<b>${ok}</b>` },
    };
  }
  function begWort() {
    const b = pick(BEG), ende = Math.random() < 0.5, k = ende ? pick(['weil', 'da']) : 'denn', ch = shuffle([ende ? k : pick(['weil', 'da']), 'denn']);
    const rest = ende ? vEnde(b) : vZwei(b), ok = `${b[0]}, ${k} ${rest}.`;
    return {
      prompt: `Welches Wort passt?<br><span class="bsp">${b[0]}, ___ ${rest}.</span>`, choices: ch, correct: ch.indexOf(k), hint: BEG_REGEL,
      solution: `<b>${ok}</b><br>${ende ? `Das Verb „${b[3]}“ steht am Ende. Dazu passt „${k}“.` : `Das Verb „${b[3]}“ steht an 2. Stelle. Dazu passt nur „denn“.`}`,
      ex: { mode: 'marken', art: 'begWort', tokens: ok.split(' '), correct: [ok.split(' ').indexOf(k), ok.replace('.', '').split(' ').lastIndexOf(b[3])], was: `${k} und das Verb`, s1: 'Schau zuerst, wo das Verb steht: am Ende oder an 2. Stelle?', merk: `<b>${ok}</b>` },
    };
  }
  // Satzreihen: [Hauptsatz 1, Verbindungswort, Hauptsatz 2]
  const REIHE = [['Lina mag Katzen', 'aber', 'ihr Bruder mag Hunde'], ['Wir wollten grillen', 'aber', 'es hat geregnet'], ['Emil geht früh ins Bett', 'denn', 'er ist müde'],
    ['Mia trägt eine Mütze', 'denn', 'es ist kalt'], ['Ben übt Gitarre', 'doch', 'die Nachbarn finden es zu laut'], ['Der Bus kam spät', 'aber', 'wir haben den Film nicht verpasst'],
    ['Paul hat Hunger', 'denn', 'er hat nicht gefrühstückt'], ['Nora wollte schwimmen', 'doch', 'das Wasser war zu kalt']];
  const REIHE_REGEL = 'In einer <b>Satzreihe</b> stehen zwei Hauptsätze nebeneinander. Vor <b>aber, denn, doch</b> steht immer ein Komma. (Vor „und“ und „oder“ darf man es weglassen.)';
  function reiheKomma() {
    const [a, k, b] = pick(REIHE), w = [...a.split(' '), k, ...b.split(' ')], komma = a.split(' ').length - 1;
    const voll = w.map((x, i) => x + (i === komma ? ',' : '')).join(' ') + '.';
    return {
      prompt: 'Setze das fehlende <b>Komma</b>: Tippe die Stelle an.',
      tap: { tokens: w.map((t, i) => (i === w.length - 1 ? t + '.' : t)), correct: [komma], gaps: true, one: true }, answerText: voll,
      hint: 'Wo endet der erste Satz? Vor dem Verbindungswort (aber, denn, doch) steht ein Komma.',
      solution: `<b>${voll}</b><br>${REIHE_REGEL}`, ex: exKomma('reiheKomma', w, [komma], REIHE_REGEL),
    };
  }
  function reiheOderGefuege() {
    const reihe = Math.random() < 0.5;
    let t, toks, mark;
    if (reihe) { const [a, k, b] = pick(REIHE); t = `${a}, ${k} ${b}.`; toks = t.split(' '); mark = [toks.indexOf(k)]; }
    else { const x = gefuege(false); t = x.mitKomma.join(' '); toks = x.mitKomma; mark = [x.nsVerb]; }
    return {
      prompt: `Satzreihe oder Satzgefüge?<br><span class="bsp">${t}</span>`, choices: ['Satzreihe (Hauptsatz + Hauptsatz)', 'Satzgefüge (Hauptsatz + Nebensatz)'], correct: reihe ? 0 : 1,
      hint: 'Schau auf das Verb im zweiten Teil: An 2. Stelle? Dann ist es ein Hauptsatz (Satzreihe). Ganz am Ende? Dann ist es ein Nebensatz (Satzgefüge).',
      solution: reihe ? `<b>Satzreihe</b>: Beide Teile sind Hauptsätze. Das Verb steht jeweils an 2. Stelle.` : `<b>Satzgefüge</b>: Der zweite Teil ist ein Nebensatz. Sein Verb steht am Ende.`,
      ex: { mode: 'marken', art: 'reiheOderGefuege', tokens: toks, correct: mark, was: reihe ? 'Satzreihe' : 'Satzgefüge', s1: 'Wo steht das Verb im zweiten Teil?', merk: reihe ? '<b>Satzreihe</b>: Hauptsatz + Hauptsatz.' : '<b>Satzgefüge</b>: Hauptsatz + Nebensatz, das Verb steht am Ende.' },
    };
  }
  const satzreihe = () => U.wahl([[30, begSatz], [24, begWort], [24, reiheKomma], [22, reiheOderGefuege]]);

  // ---------- Thema: Wörtliche Rede ----------
  // [Wer, Verb des Sagens, was gesagt wird, Schlusszeichen]
  const REDE = [
    ['Lina', 'sagt', 'Ich komme gleich', '.'], ['Emil', 'fragt', 'Wo ist mein Ball', '?'], ['Die Lehrerin', 'ruft', 'Kommt bitte herein', '!'],
    ['Mia', 'flüstert', 'Das ist ein Geheimnis', '.'], ['Ben', 'fragt', 'Darf ich mitspielen', '?'], ['Der Trainer', 'ruft', 'Lauft schneller', '!'],
    ['Nora', 'antwortet', 'Ich habe keine Zeit', '.'], ['Paul', 'fragt', 'Wann fängt der Film an', '?'], ['Die Mutter', 'sagt', 'Das Essen ist fertig', '.'],
    ['Der Vater', 'ruft', 'Pass auf', '!'], ['Mia', 'meint', 'Morgen wird es regnen', '.'], ['Emil', 'ruft', 'Ich habe gewonnen', '!'],
  ].map(([wer, verb, rede, z]) => ({ wer, verb, rede, z }));
  const redeVorn = (r) => `${r.wer} ${r.verb}: „${r.rede}${r.z}“`;
  const redeHinten = (r) => `„${r.rede}${r.z === '.' ? '' : r.z}“, ${r.verb} ${klein(r.wer)}.`;
  const REGEL_VORN = 'Begleitsatz <b>vorn</b>: Danach steht ein <b>Doppelpunkt</b>. Die wörtliche Rede steht in Anführungszeichen, ihr Schlusszeichen steht <b>vor</b> dem letzten Anführungszeichen.';
  const REGEL_HINTEN = 'Begleitsatz <b>hinten</b>: Nach der wörtlichen Rede steht ein <b>Komma</b>. Ein Punkt in der Rede fällt weg, Fragezeichen und Ausrufezeichen bleiben. Der Punkt steht ganz am Ende.';
  // zerlegt den richtigen Satz in Stücke und merkt sich, welche Stücke Satzzeichen sind (für die Animation)
  function redeTeile(r, vorn) {
    const t = vorn ? [`${r.wer} ${r.verb}`, ':', ' ', '„', r.rede, r.z, '“'] : ['„', r.rede, r.z === '.' ? '' : r.z, '“', ',', ` ${r.verb} ${klein(r.wer)}`, '.'];
    return { tokens: t, correct: t.map((x, i) => (/^[:„“,.?!]$/.test(x) ? i : -1)).filter((i) => i >= 0) };
  }
  const exRede = (art, r, vorn) => Object.assign({ mode: 'marken', art, dicht: true, was: 'Richtig', s1: vorn ? REGEL_VORN : REGEL_HINTEN, merk: `<b>${vorn ? redeVorn(r) : redeHinten(r)}</b>` }, redeTeile(r, vorn));
  function redeRichtig() {
    const r = pick(REDE), vorn = Math.random() < 0.5;
    const ok = vorn ? redeVorn(r) : redeHinten(r);
    const falsch = vorn
      ? [`${r.wer} ${r.verb} „${r.rede}${r.z}“`, `${r.wer} ${r.verb}: „${r.rede}“${r.z}`, `${r.wer} ${r.verb}: ${r.rede}${r.z}`]
      : [r.z === '.' ? `„${r.rede}.“, ${r.verb} ${klein(r.wer)}.` : `„${r.rede}“, ${r.verb} ${klein(r.wer)}${r.z}`, `„${r.rede}${r.z === '.' ? '' : r.z}“ ${r.verb} ${klein(r.wer)}.`, `„${r.rede}${r.z === '.' ? '' : r.z}, ${r.verb} ${klein(r.wer)}.“`];
    const wahl = shuffle([ok, ...shuffle(falsch).slice(0, 2)]);
    return {
      prompt: 'Welcher Satz ist richtig geschrieben?',
      choices: wahl, correct: wahl.indexOf(ok),
      hint: vorn ? REGEL_VORN : REGEL_HINTEN,
      solution: `<b>${ok}</b><br>${vorn ? REGEL_VORN : REGEL_HINTEN}`, ex: exRede('redeRichtig', r, vorn),
    };
  }
  function redeZeichen() {
    const r = pick(REDE), vorn = Math.random() < 0.5;
    const ZW = [': (Doppelpunkt)', ', (Komma)', '. (Punkt)', '? (Fragezeichen)'];
    let text, z;
    if (vorn && r.z !== '!' && Math.random() < 0.4) { text = `${r.wer} ${r.verb}: „${r.rede}<u>▢</u>“`; z = r.z === '.' ? 2 : 3; }
    else if (vorn) { text = `${r.wer} ${r.verb}<u>▢</u> „${r.rede}${r.z}“`; z = 0; }
    else { text = `„${r.rede}${r.z === '.' ? '' : r.z}“<u>▢</u> ${r.verb} ${klein(r.wer)}.`; z = 1; }
    return {
      prompt: `Welches Satzzeichen fehlt an der markierten Stelle?<br><span class="bsp">${text}</span>`,
      choices: ZW, correct: z,
      hint: vorn ? REGEL_VORN : REGEL_HINTEN,
      solution: `<b>${vorn ? redeVorn(r) : redeHinten(r)}</b><br>${vorn ? REGEL_VORN : REGEL_HINTEN}`, ex: exRede('redeZeichen', r, vorn),
    };
  }
  function redeTeil() {
    const r = pick(REDE), vorn = Math.random() < 0.5, begleit = Math.random() < 0.5;
    const tokens = vorn ? [`${r.wer} ${r.verb}:`, `„${r.rede}${r.z}“`] : [`„${r.rede}${r.z === '.' ? '' : r.z}“,`, `${r.verb} ${klein(r.wer)}.`];
    const i = begleit === vorn ? 0 : 1;
    return {
      prompt: `Tippe ${begleit ? 'den <b>Begleitsatz</b>' : 'die <b>wörtliche Rede</b>'} an.`,
      tap: { tokens, correct: [i], one: true }, answerText: begleit ? `${r.wer} ${r.verb}` : r.rede,
      hint: 'Die <b>wörtliche Rede</b> ist das, was jemand genau sagt. Sie steht in Anführungszeichen. Der <b>Begleitsatz</b> sagt, wer spricht.',
      solution: `Wörtliche Rede: <b>„${r.rede}${r.z}“</b><br>Begleitsatz: <b>${r.wer} ${r.verb}</b>. Er sagt, wer spricht.`,
      ex: Object.assign(exRede('redeTeil', r, vorn), { merk: `Begleitsatz: <b>${r.wer} ${r.verb}</b> · wörtliche Rede: <b>${r.rede}</b>` }),
    };
  }
  const rede = () => U.wahl([[44, redeRichtig], [32, redeZeichen], [24, redeTeil]]);


  // =====================================================
  // Bereich 3: Rechtschreibung
  // =====================================================
  // Lückenwörter: 'F[eh]ler|e,ee' = richtige Buchstaben in Klammern, danach die falschen Angebote.
  // Jedes Wort ist geprüft: Mit keinem falschen Angebot entsteht ein anderes richtiges Wort
  // (deshalb fehlen z. B. Meer/mehr, Hütte/Hüte, Gäste/Geste, reißen/reisen).
  const lw = (z, extra) => { const m = z.match(/^(.*)\[(.+)\](.*?)\|(.*)$/); const f = m[4].split('|'); return Object.assign({ vor: m[1], ein: m[2], nach: m[3], falsch: f[0].split(','), mehr: f.slice(1), wort: m[1] + m[2] + m[3] }, extra); };
  const liste = (txt, extra) => txt.split(' ; ').map((z) => lw(z.trim(), extra));
  const luecke = (w) => `${w.vor}▢${w.nach}`;
  const exLw = (art, w, s1, s2) => zz(art, [w.vor, '▢', w.nach], 1, [w.vor, w.ein, w.nach], 1, s1, s2, `<b>${w.wort}</b><br>${s2}`);
  function lwWahl(art, w, frage, hint, warum, s1) {
    const wahl = shuffle([w.ein, ...w.falsch]);
    return { prompt: `${frage}<br><span class="bsp gross">${luecke(w)}</span>`, choices: wahl, correct: wahl.indexOf(w.ein), hint, solution: `<b>${w.vor}<span class="vb">${w.ein}</span>${w.nach}</b><br>${warum}`, ex: exLw(art, w, s1, warum) };
  }
  function lwTippen(art, w, hint, warum, s1) {
    // Die Auswahl steht dabei: Ohne sie könnten in die Lücke auch andere Wörter passen (T▢r: Tür, Tor, Tier …)
    const angebot = [w.ein, ...w.falsch].sort((a, b) => a.length - b.length || a.localeCompare(b, 'de')).map((x) => `<b>${x}</b>`).join(', ').replace(/, (?!.*, )/, ' oder ');
    return { prompt: `Schreibe das ganze Wort richtig: mit ${angebot}?<br><span class="bsp gross">${luecke(w)}</span>`, fields: [{ type: 'text', answer: w.wort, label: 'Wort' }], hint, solution: `<b>${w.vor}<span class="vb">${w.ein}</span>${w.nach}</b><br>${warum}`, ex: exLw(art, w, s1, warum) };
  }

  // ---------- Thema: Lange Vokale ----------
  const LANG = [
    ...liste('F[eh]ler|e,ee ; f[ah]ren|a,aa ; Z[ah]l|a,aa ; St[uh]l|u ; w[oh]nen|o,oo ; S[oh]n|o,oo ; B[ah]n|a,aa ; n[eh]men|e,ee ; J[ah]r|a,aa ; K[oh]le|o,oo ; Z[ah]n|a,aa ; H[öh]le|ö ; k[üh]l|ü ; f[üh]len|ü ; z[äh]len|ä', { typ: 'h' }),
    ...liste('T[ee]|e,eh ; H[aa]r|a,ah ; Schn[ee]|e,eh ; B[ee]t|e,eh ; S[aa]l|a,ah ; M[oo]s|o,oh ; Kl[ee]|e,eh ; B[ee]re|e,eh ; Id[ee]|e,eh', { typ: 'dd' }),
    ...liste('T[a]l|ah,aa ; Sch[u]le|uh ; T[ü]r|üh ; H[u]t|uh ; sch[ö]n|öh ; B[ä]r|äh ; N[a]me|ah,aa ; T[o]r|oh,oo ; Bl[u]me|uh ; Kr[o]ne|oh,oo ; R[e]gen|eh,ee ; H[a]se|ah,aa ; T[o]n|oh,oo ; Sp[u]r|uh ; T[a]g|ah,aa', { typ: 'e' }),
    ...liste('B[ie]ne|i,ih ; Sp[ie]l|i,ih ; T[ie]r|i,ih ; Br[ie]f|i,ih ; W[ie]se|i,ih ; l[ie]b|i,ih ; v[ie]l|i,ih ; S[ie]b|i,ih ; Z[ie]l|i,ih ; R[ie]se|i,ih ; fl[ie]gen|i,ih ; v[ie]r|i,ih ; D[ie]b|i,ih ; Zw[ie]bel|i,ih', { typ: 'ie' }),
    ...liste('T[i]ger|ie,ih ; K[i]no|ie,ih ; Krokod[i]l|ie,ih ; w[i]r|ie,ih ; m[i]r|ie,ih ; d[i]r|ie,ih', { typ: 'i' }),
  ];
  const LANGART = { h: 'mit Dehnungs-h', dd: 'mit doppeltem Vokal', e: 'mit einfachem Vokal', ie: 'mit ie', i: 'mit einfachem Vokal' };
  const LANGWARUM = {
    h: 'Ein <b>Dehnungs-h</b> zeigt den langen Vokal. Es steht oft vor l, m, n oder r. Diese Wörter muss man sich merken.',
    dd: 'Hier wird der lange Vokal <b>verdoppelt</b>. Das gibt es nur bei wenigen Wörtern mit aa, ee, oo. Das sind Merkwörter.',
    e: 'Die meisten langen Vokale schreibt man <b>einfach</b>, ohne h und ohne Verdopplung.',
    ie: 'Das lange i schreibt man fast immer <b>ie</b>.',
    i: 'Ausnahme: Hier schreibt man das lange i nur mit <b>i</b>. Das ist ein Merkwort.',
  };
  const TIPP_LANG = 'Der Vokal klingt lang. Dafür gibt es drei Schreibweisen: einfach (T<b>a</b>l), mit Dehnungs-h (Z<b>ah</b>l) oder doppelt (H<b>aa</b>r). Das lange i heißt meistens <b>ie</b>. Die meisten Wörter haben den einfachen Vokal.';
  const S1_LANG = 'Der Vokal klingt lang. Wie wird er hier geschrieben?';
  const langLuecke = () => { const w = pick(LANG); return lwWahl('langLuecke', w, 'Der Vokal ist <b>lang</b>. Was gehört in die Lücke?', TIPP_LANG, LANGWARUM[w.typ], S1_LANG); };
  const langTippen = () => { const w = pick(LANG); return lwTippen('langTippen', w, TIPP_LANG, LANGWARUM[w.typ], S1_LANG); };
  function langArt() {
    const w = pick(LANG.filter((x) => x.typ !== 'i')), arten = ['e', 'h', 'dd', 'ie'];
    return {
      prompt: `Wie wird der lange Vokal hier geschrieben?<br><span class="bsp gross">${w.wort}</span>`,
      choices: arten.map((a) => LANGART[a]), correct: arten.indexOf(w.typ),
      hint: 'Suche den langen Vokal. Steht ein <b>h</b> dahinter? Steht er <b>doppelt</b>? Oder ist es ein <b>ie</b>?',
      solution: `<b>${w.vor}<span class="vb">${w.ein}</span>${w.nach}</b>: ${LANGART[w.typ]}.<br>${LANGWARUM[w.typ]}`,
      ex: zz('langArt', [w.vor, w.ein, w.nach], 1, [LANGART[w.typ] + ': ', w.ein], 1, 'Suche den langen Vokal im Wort.', LANGWARUM[w.typ], `<b>${w.wort}</b>: ${LANGART[w.typ]}`),
    };
  }
  const langeVokale = () => U.wahl([[45, langLuecke], [25, langArt], [30, langTippen]]);

  // ---------- Thema: Kurze Vokale und Doppelkonsonanten ----------
  const KURZ = [
    ...liste('Ro[ll]e|l ; So[nn]e|n ; Ka[nn]e|n ; Wa[ss]er|s ; Mu[tt]er|t ; Bu[tt]er|t ; Hi[mm]el|m ; So[mm]er|m ; Te[ll]er|l ; Ko[ff]er|f ; Schi[ff]|f ; Ba[ll]|l ; schne[ll]|l ; dü[nn]|n ; Pu[pp]e|p ; Su[pp]e|p ; Tre[pp]e|p ; Kla[ss]e|s ; Lö[ff]el|f ; Zi[mm]er|m ; ko[mm]en|m ; re[nn]en|n ; fa[ll]en|l ; Ta[ss]e|s ; Bri[ll]e|l ; Wo[ll]e|l ; Ta[nn]e|n ; Pfa[nn]e|n', { typ: 'dop', kurz: true }),
    ...liste('Blu[m]e|mm ; Schu[l]e|ll ; Na[m]e|mm ; Ta[f]el|ff ; Ne[b]el|bb ; Ga[b]el|bb ; Vo[g]el|gg ; Re[g]en|gg ; Ki[n]o|nn ; Be[s]en|ss ; Ho[s]e|ss ; Do[s]e|ss ; Le[b]en|bb ; Fa[d]en|dd ; Ku[g]el|gg ; Hu[t]|tt ; ro[t]|tt ; gu[t]|tt ; Ta[l]|ll ; Pla[n]|nn ; Zu[g]|gg', { typ: 'lang', kurz: false }),
    ...liste('Wa[l]d|ll ; Hu[n]d|nn ; Ki[n]d|nn ; Bi[l]d|ll ; Wo[l]ke|ll ; La[m]pe|mm ; Ta[n]te|nn ; Wi[n]ter|nn ; Ki[s]te|ss ; Fe[n]ster|nn ; Ha[n]d|nn ; Gu[r]ke|rr ; Bi[r]ne|rr ; He[f]t|ff ; Lu[f]t|ff ; ka[l]t|ll ; Fe[l]d|ll ; Ge[l]d|ll ; bu[n]t|nn', { typ: 'zwei', kurz: true }),
    ...liste('Ja[ck]e|k ; Brü[ck]e|k ; De[ck]e|k ; Zu[ck]er|k ; ba[ck]en|k ; di[ck]|k ; Ro[ck]|k ; Stü[ck]|k ; E[ck]e|k ; Glü[ck]|k', { typ: 'ck', kurz: true }),
    ...liste('Wol[k]e|ck ; Gur[k]e|ck ; dan[k]en|ck ; Ban[k]|ck ; Schran[k]|ck ; trin[k]en|ck ; Bir[k]e|ck ; star[k]|ck ; On[k]el|ck', { typ: 'k' }),
    ...liste('Ka[tz]e|z ; Mü[tz]e|z ; si[tz]en|z ; Bli[tz]|z ; Pla[tz]|z ; Sa[tz]|z ; Ne[tz]|z ; pu[tz]en|z ; Hi[tz]e|z ; Spi[tz]e|z', { typ: 'tz', kurz: true }),
    ...liste('Ker[z]e|tz ; Pil[z]|tz ; tan[z]en|tz ; Wur[z]el|tz ; Hol[z]|tz ; Sal[z]|tz ; kur[z]|tz ; Schnau[z]e|tz ; Wei[z]en|tz', { typ: 'z' }),
  ];
  const KURZWARUM = {
    dop: 'Der Vokal davor ist <b>kurz</b>, und man hört danach nur einen Konsonanten. Dann wird er <b>verdoppelt</b>.',
    lang: 'Der Vokal davor ist <b>lang</b>. Nach einem langen Vokal wird nicht verdoppelt.',
    zwei: 'Der Vokal ist zwar kurz, aber danach folgen schon <b>zwei verschiedene</b> Konsonanten. Dann wird nicht verdoppelt.',
    ck: 'Der Vokal davor ist <b>kurz</b>. Statt „kk“ schreibt man <b>ck</b>.',
    k: 'Nach <b>l, n, r</b> (und nach langem Vokal) steht nie ck, nur <b>k</b>.',
    tz: 'Der Vokal davor ist <b>kurz</b>. Statt „zz“ schreibt man <b>tz</b>.',
    z: 'Nach <b>l, n, r</b> und nach au, ei, eu steht nie tz, nur <b>z</b>.',
  };
  const TIPP_KURZ = 'Sprich das Wort deutlich: Ist der betonte Vokal <b>kurz</b> oder <b>lang</b>? Nach kurzem Vokal folgen zwei Konsonanten. Hörst du nur einen, wird er verdoppelt (ck statt kk, tz statt zz). Merke: Nach l, n, r steht nie tz und nie ck.';
  const S1_KURZ = 'Sprich das Wort: Ist der betonte Vokal kurz oder lang? Und wie viele Konsonanten folgen?';
  const kurzLuecke = () => { const w = pick(KURZ); return lwWahl('kurzLuecke', w, 'Was gehört in die Lücke?', TIPP_KURZ, KURZWARUM[w.typ], S1_KURZ); };
  const kurzTippen = () => { const w = pick(KURZ); return lwTippen('kurzTippen', w, TIPP_KURZ, KURZWARUM[w.typ], S1_KURZ); };
  function kurzLang() {
    const w = pick(KURZ.filter((x) => x.kurz !== undefined));
    return {
      prompt: `Ist der betonte Vokal <b>kurz</b> oder <b>lang</b>?<br><span class="bsp gross">${w.wort}</span>`,
      choices: ['kurz', 'lang'], correct: w.kurz ? 0 : 1,
      hint: 'Sprich das Wort laut und dehne den Vokal. Klingt es noch richtig? Schau auch, was danach kommt: zwei Konsonanten (auch ck, tz) zeigen einen kurzen Vokal.',
      solution: `<b>${w.wort}</b>: Der Vokal ist <b>${w.kurz ? 'kurz' : 'lang'}</b>.<br>${KURZWARUM[w.typ]}`,
      ex: zz('kurzLang', [w.vor, w.ein, w.nach], 1, [`${w.kurz ? 'kurzer' : 'langer'} Vokal: `, w.wort], 1, 'Schau auf die Konsonanten nach dem betonten Vokal.', KURZWARUM[w.typ], `<b>${w.wort}</b>: Der Vokal ist <b>${w.kurz ? 'kurz' : 'lang'}</b>.`),
    };
  }
  function kurzWarum() {
    const w = pick(KURZ.filter((x) => x.typ === 'lang' || x.typ === 'zwei'));
    return {
      prompt: `Warum wird der Konsonant hier <b>nicht</b> verdoppelt?<br><span class="bsp gross">${w.wort}</span>`,
      choices: ['Der Vokal davor ist lang.', 'Nach dem kurzen Vokal folgen schon zwei verschiedene Konsonanten.'], correct: w.typ === 'lang' ? 0 : 1,
      hint: 'Sprich das Wort: Ist der betonte Vokal lang oder kurz? Zähle dann die Konsonanten, die danach kommen.',
      solution: `<b>${w.wort}</b><br>${KURZWARUM[w.typ]}`,
      ex: zz('kurzWarum', [w.vor, w.ein, w.nach], 1, [w.wort], 0, 'Verdoppelt wird nur nach kurzem Vokal, wenn danach nur ein Konsonant zu hören ist.', KURZWARUM[w.typ], `<b>${w.wort}</b>: nicht verdoppelt.`),
    };
  }
  const kurzeVokale = () => U.wahl([[42, kurzLuecke], [18, kurzLang], [25, kurzTippen], [15, kurzWarum]]);

  // ---------- Thema: Verlängern und Ableiten ----------
  // Auslaut: 'Ber[g]|k|Berge' = richtiger Buchstabe, falscher, verlängertes Wort
  const AUSL = [
    ...liste('Ber[g]|k|Berge ; Kor[b]|p|Körbe ; Wal[d]|t|Wälder ; Kin[d]|t|Kinder ; Ta[g]|k|Tage ; Zu[g]|k|Züge ; We[g]|k|Wege ; Die[b]|p|Diebe ; Sta[b]|p|Stäbe ; Sie[b]|p|Siebe ; Ran[d]|t|Ränder ; Stran[d]|t|Strände ; Han[d]|t|Hände ; Pfer[d]|t|Pferde ; Bil[d]|t|Bilder ; Fel[d]|t|Felder ; Aben[d]|t|Abende ; Flu[g]|k|Flüge ; Zwer[g]|k|Zwerge ; Kru[g]|k|Krüge ; Hu[t]|d|Hüte ; Bro[t]|d|Brote ; Zel[t]|d|Zelte ; Wel[t]|d|Welten ; Schran[k]|g|Schränke ; Geschen[k]|g|Geschenke ; Vol[k]|g|Völker', { adj: false }),
    ...liste('gel[b]|p|gelbe ; lie[b]|p|liebe ; frem[d]|t|fremde ; run[d]|t|runde ; klu[g]|k|kluge ; kal[t]|d|kalte ; al[t]|d|alte ; lau[t]|d|laute ; star[k]|g|starke', { adj: true }),
  ];
  // Umlaut: 'H[äu]ser|eu|Haus' = mit verwandtem Wort; ohne drittes Feld gibt es kein verwandtes Wort mit a/au
  const UML = [
    ...liste('H[äu]ser|eu|Haus ; B[äu]me|eu|Baum ; Tr[äu]me|eu|Traum ; M[äu]se|eu|Maus ; l[äu]ft|eu|laufen ; R[äu]ber|eu|rauben ; K[äu]fer|eu|kaufen ; Geb[äu]de|eu|bauen ; tr[äu]men|eu|Traum ; H[ä]nde|e|Hand ; W[ä]lder|e|Wald ; k[ä]lter|e|kalt ; Gl[ä]ser|e|Glas ; St[ä]dte|e|Stadt ; L[ä]nder|e|Land ; B[ä]nder|e|Band ; Z[ä]hne|e|Zahn ; N[ä]chte|e|Nacht ; st[ä]rker|e|stark ; l[ä]nger|e|lang ; Bl[ä]tter|e|Blatt ; R[ä]der|e|Rad ; K[ä]mme|e|Kamm ; tr[ä]gt|e|tragen ; f[ä]hrt|e|fahren ; schl[ä]ft|e|schlafen', {}),
    ...liste('Fr[eu]nd|äu ; n[eu]|äu ; F[eu]er|äu ; t[eu]er|äu ; B[eu]le|äu ; Z[eu]gnis|äu ; Fr[eu]de|äu ; Kr[eu]z|äu ; F[e]ld|ä ; W[e]lt|ä ; G[e]ld|ä ; H[e]ft|ä ; B[e]tt|ä ; N[e]tz|ä ; schn[e]ll|ä ; F[e]nster|ä ; M[e]nsch|ä ; St[e]rn|ä ; B[e]rg|ä ; H[e]rz|ä ; T[e]ller|ä ; Z[e]lt|ä', {}),
  ];
  const auslWarum = (w) => `Verlängere das Wort: <b>${w.wort}</b> → <b>${w.mehr[0]}</b>. Jetzt hörst du das <b>${w.ein}</b> deutlich.`;
  const umlWarum = (w) => (w.mehr.length ? `Verwandtes Wort: <b>${w.mehr[0]}</b>. Aus ${/u/.test(w.ein) ? 'au wird äu' : 'a wird ä'}, also <b>${w.wort}</b> mit <b>${w.ein}</b>.` : `Es gibt kein verwandtes Wort mit ${/u/.test(w.ein) ? 'au' : 'a'}. Also schreibt man <b>${w.ein}</b>.`);
  const TIPP_AUSL = 'Am Wortende klingen b, d, g wie p, t, k. <b>Verlängere</b> das Wort, dann hörst du den richtigen Buchstaben: ein Hun?, viele Hun<b>d</b>e.';
  const TIPP_UML = '<b>ä</b> oder <b>e</b>, <b>äu</b> oder <b>eu</b>? Suche ein verwandtes Wort mit <b>a</b> oder <b>au</b>. Gibt es eins, schreibst du ä oder äu. Gibt es keins, schreibst du e oder eu.';
  const auslLuecke = () => { const w = pick(AUSL); return lwWahl('auslLuecke', w, 'Welcher Buchstabe gehört ans Wortende?', TIPP_AUSL, auslWarum(w), 'Am Wortende hört man b, d, g nicht genau. Verlängere das Wort!'); };
  const auslTippen = () => { const w = pick(AUSL); return lwTippen('auslTippen', w, TIPP_AUSL, auslWarum(w), 'Am Wortende hört man b, d, g nicht genau. Verlängere das Wort!'); };
  const umlLuecke = () => { const w = pick(UML); return lwWahl('umlLuecke', w, 'Was gehört in die Lücke?', TIPP_UML, umlWarum(w), 'Suche ein verwandtes Wort mit a oder au.'); };
  function verlaengern() {
    const w = pick(AUSL);
    return {
      prompt: 'Verlängere das Wort.', layout: 'satz',
      fields: [{ type: 'text', answer: w.mehr[0], prefix: w.adj ? `${w.wort} → die` : `ein ${w.wort}, viele`, suffix: w.adj ? 'Maus' : '', label: 'verlängertes Wort' }],
      hint: w.adj ? 'Setze das Adjektiv vor ein Nomen: „die … Maus“. Dann bekommt es eine Endung.' : 'Bilde die Mehrzahl: „ein …, viele …“.',
      solution: `<b>${w.wort}</b> → <b class="vb">${w.mehr[0]}</b><br>Beim Verlängern hörst du das <b>${w.ein}</b> deutlich. Deshalb schreibt man auch „${w.wort}“ mit ${w.ein}.`,
      ex: zz('verlaengern', [w.vor, w.ein], 1, [w.adj ? 'die ' : 'viele ', w.mehr[0]], 1, 'Am Wortende hört man b, d, g nicht genau. Verlängere das Wort!', `Jetzt steht der Buchstabe nicht mehr am Ende, und du hörst das <b>${w.ein}</b>.`, `${w.wort} → <b>${w.mehr[0]}</b>`),
    };
  }
  function stamm_() {
    const w = pick(UML.filter((x) => x.mehr.length));
    const andere = shuffle(UML.filter((x) => x.mehr.length && x.mehr[0] !== w.mehr[0]).map((x) => x.mehr[0]).filter((x, i, a) => a.indexOf(x) === i)).slice(0, 2);
    const wahl = shuffle([w.mehr[0], ...andere]);
    return {
      prompt: `Welches verwandte Wort erklärt das <b>${w.ein}</b>?<br><span class="bsp gross">${w.wort}</span>`,
      choices: wahl, correct: wahl.indexOf(w.mehr[0]),
      hint: 'Verwandte Wörter haben denselben Wortstamm. Suche das Wort, das fast gleich aussieht, nur mit a oder au.',
      solution: umlWarum(w),
      ex: zz('stamm_', [w.mehr[0]], 0, [w.vor, w.ein, w.nach], 1, `Das verwandte Wort ist <b>${w.mehr[0]}</b>.`, `Aus ${/u/.test(w.ein) ? 'au wird äu' : 'a wird ä'}.`, `${w.mehr[0]} → <b>${w.wort}</b>`),
    };
  }
  const ableiten = () => U.wahl([[26, auslLuecke], [26, umlLuecke], [18, verlaengern], [14, auslTippen], [16, stamm_]]);

  // ---------- Thema: s-Laute ----------
  const SL = [
    ...liste('Wa[ss]er|ß,s ; Ta[ss]e|ß,s ; Kla[ss]e|ß,s ; Flu[ss]|ß,s ; Ku[ss]|ß,s ; Schlo[ss]|ß,s ; Nu[ss]|ß,s ; na[ss]|ß,s ; me[ss]en|ß,s ; e[ss]en|ß,s ; kü[ss]en|ß,s ; mü[ss]en|ß,s ; Schlü[ss]el|ß,s ; Me[ss]er|ß,s ; Ri[ss]|ß,s ; Pa[ss]|ß,s ; Fa[ss]|ß,s ; wi[ss]en|ß,s ; Ka[ss]e|ß,s', { typ: 'ss' }),
    ...liste('Stra[ß]e|ss,s ; Fu[ß]|ss,s ; gro[ß]|ss,s ; hei[ß]|ss,s ; wei[ß]|ss,s ; sü[ß]|ss,s ; flei[ß]ig|ss,s ; drau[ß]en|ss,s ; Sto[ß]|ss,s ; au[ß]en|ss,s ; bei[ß]en|ss,s ; schlie[ß]en|ss,s ; gie[ß]en|ss,s ; hei[ß]en|ss,s ; So[ß]e|ss,s ; Fü[ß]e|ss,s', { typ: 'ß' }),
    ...liste('Be[s]en|ss,ß ; Ho[s]e|ss,ß ; Do[s]e|ss,ß ; Wie[s]e|ss,ß ; Rie[s]e|ss,ß ; le[s]en|ss,ß ; Hau[s]|ss,ß|Häuser ; Mau[s]|ss,ß|Mäuse ; Gra[s]|ss,ß|Gräser ; Gla[s]|ss,ß|Gläser ; Prei[s]|ss,ß|Preise ; Krei[s]|ss,ß|Kreise ; Mu[s]ik|ss,ß ; Va[s]e|ss,ß ; Kä[s]e|ss,ß ; Gan[s]|ss,ß|Gänse ; Hal[s]|ss,ß|Hälse ; lei[s]e|ss,ß ; bö[s]e|ss,ß ; Pau[s]e|ss,ß', { typ: 's' }),
  ];
  const SREGEL = { ss: 'Der Vokal davor ist kurz.', 'ß': 'Davor steht ein langer Vokal oder au, ei, eu, ie, und das s zischt.', s: 'Das s summt weich (oder es summt, wenn man das Wort verlängert).' };
  const slWarum = (w) => ({
    ss: 'Der Vokal vor dem s-Laut ist <b>kurz</b>. Dann schreibt man <b>ss</b>.',
    'ß': 'Vor dem s-Laut steht ein <b>langer Vokal</b> oder ein Zwielaut (au, ei, eu, ie), und das s <b>zischt</b>. Dann schreibt man <b>ß</b>.',
    s: w.mehr.length ? `Verlängere: <b>${w.wort}</b> → <b>${w.mehr[0]}</b>. Dort <b>summt</b> das s weich. Also schreibt man einfaches <b>s</b>.` : 'Das s <b>summt</b> weich wie eine Biene. Dann schreibt man einfaches <b>s</b>.',
  }[w.typ]);
  const TIPP_SL = 'Sprich das Wort. <b>Summt</b> das s weich (wie eine Biene)? Dann einfaches s. <b>Zischt</b> es: nach kurzem Vokal <b>ss</b>, nach langem Vokal oder au, ei, eu, ie <b>ß</b>. Am Wortende hilft Verlängern.';
  const S1_SL = 'Summt das s oder zischt es? Und ist der Vokal davor kurz oder lang?';
  const slLuecke = () => { const w = pick(SL); return lwWahl('slLuecke', w, '<b>s</b>, <b>ss</b> oder <b>ß</b>?', TIPP_SL, slWarum(w), S1_SL); };
  const slTippen = () => { const w = pick(SL); return lwTippen('slTippen', w, TIPP_SL, slWarum(w), S1_SL); };
  function slRegel() {
    const w = pick(SL), typen = ['ss', 'ß', 's'];
    return {
      prompt: `Warum schreibt man dieses Wort mit <b>${w.ein}</b>?<br><span class="bsp gross">${w.wort}</span>`,
      choices: typen.map((t) => SREGEL[t]), correct: typen.indexOf(w.typ),
      hint: TIPP_SL, solution: `<b>${w.vor}<span class="vb">${w.ein}</span>${w.nach}</b><br>${slWarum(w)}`,
      ex: zz('slRegel', [w.vor, w.ein, w.nach], 1, [w.wort], 0, S1_SL, slWarum(w), `<b>${w.wort}</b> mit <b>${w.ein}</b>`),
    };
  }
  const sLaute = () => U.wahl([[48, slLuecke], [22, slRegel], [30, slTippen]]);

  // ---------- Thema: Groß- und Kleinschreibung ----------
  const REGEL_GROSS = 'Groß schreibt man den <b>Satzanfang</b> und alle <b>Nomen</b>. Probe: Vor ein Nomen passt ein Artikel (der, die, das), auch mit Adjektiv dazwischen (der kleine Hund).';
  function grossAntippen() {
    const z = pick(SATZ_WA);
    const correct = z.tag.map((t, k) => (k === 0 || t === 'N' ? k : -1)).filter((k) => k >= 0);
    const tokens = z.w.map((w, i) => w.toLowerCase() + (i === z.w.length - 1 ? '.' : ''));
    return {
      prompt: 'Hier ist alles kleingeschrieben. Tippe alle Wörter an, die man <b>groß</b> schreiben muss.',
      tap: { tokens, correct }, answerText: correct.map((k) => z.w[k]).join(', '),
      hint: REGEL_GROSS,
      solution: `<b>${z.w.join(' ')}.</b><br>${z.w[0]}: Satzanfang. ${correct.slice(1).map((k) => z.w[k]).join(', ')}: Nomen.`,
      ex: { mode: 'marken', art: 'grossAntippen', tokens, correct, was: 'Groß', s1: REGEL_GROSS, merk: `<b>${z.w.join(' ')}.</b><br>Groß: ${correct.map((k) => z.w[k]).join(', ')}` },
    };
  }
  function grossWort() {
    const z = pick(SATZ_WA), i = pick(z.tag.map((t, k) => (k > 0 && ['N', 'A', 'V'].includes(t) ? k : -1)).filter((k) => k >= 0));
    const vor = z.w.slice(0, i).join(' '), nach = z.w.slice(i + 1).join(' ');
    const ist = z.tag[i] === 'N';
    return {
      prompt: `Groß oder klein? Schreibe das Wort <b>${z.w[i].toUpperCase()}</b> richtig in die Lücke.`, layout: 'satz',
      fields: [{ type: 'text', answer: z.w[i], prefix: vor, suffix: (nach ? nach : '') + '.', label: 'Wort' }],
      hint: REGEL_GROSS,
      solution: `${vor} <b class="vb">${z.w[i]}</b>${nach ? ' ' + nach : ''}.<br>„${z.w[i]}“ ist ein ${WA[z.tag[i]]}${ist ? ', also <b>groß</b>. Probe: Ein Artikel passt davor.' : ', also <b>klein</b>.'}`,
      ex: zz('grossWort', [z.w[i].toUpperCase()], 0, [vor + ' ', z.w[i], (nach ? ' ' + nach : '') + '.'], 1, `Welche Wortart ist das? ${ist ? 'Passt ein Artikel davor?' : 'Passt ein Artikel davor? Hier nicht.'}`, `„${z.w[i]}“ ist ein ${WA[z.tag[i]]}: ${ist ? 'groß' : 'klein'}.`, `${vor} <b>${z.w[i]}</b>${nach ? ' ' + nach : ''}.`),
    };
  }
  // Aus Verben werden Nomen: das Laufen, beim Spielen
  const NOMV = ['laufen', 'schwimmen', 'lesen', 'singen', 'malen', 'spielen', 'tanzen', 'lachen', 'schreiben', 'rechnen'];
  const NOMS = [['Das', 'macht mir Spaß', 'das'], ['Beim', 'vergesse ich die Zeit', 'beim (= bei dem)'], ['Zum', 'brauche ich Ruhe', 'zum (= zu dem)']];
  const NOMK = [['Wir', 'jeden Tag'], ['Die Kinder', 'gern'], ['Heute wollen wir', '']];
  function grossVerb() {
    const v = pick(NOMV), subst = Math.random() < 0.55;
    const [vor, nach, wort] = subst ? pick(NOMS) : pick(NOMK);
    const gr = gross(v), wahl = shuffle([gr, v]);
    return {
      prompt: `Welche Schreibweise ist richtig?<br><span class="bsp">${vor} ___ ${nach}${nach ? '' : ''}.</span>`.replace(' .', '.'),
      choices: wahl, correct: wahl.indexOf(subst ? gr : v),
      hint: 'Auch ein Verb kann zum Nomen werden. Das erkennst du am <b>Artikel</b> davor: das, beim (= bei dem), zum (= zu dem). Dann schreibt man es groß.',
      solution: `${vor} <b class="vb">${subst ? gr : v}</b>${nach ? ' ' + nach : ''}.<br>${subst ? `Vor dem Wort steht „${wort}“. Das Verb ist hier ein Nomen, also <b>groß</b>.` : 'Hier sagt das Wort, was jemand tut. Es ist ein Verb, also <b>klein</b>.'}`,
      ex: zz('grossVerb', [vor + ' ', '___', nach ? ' ' + nach + '.' : '.'], 1, [vor + ' ', subst ? gr : v, nach ? ' ' + nach + '.' : '.'], 1, 'Steht ein Artikel davor (das, beim, zum)?', subst ? `„${wort}“ macht das Verb zum Nomen: groß.` : 'Kein Artikel davor: Es bleibt ein Verb, also klein.', `${vor} <b>${subst ? gr : v}</b>${nach ? ' ' + nach : ''}.`),
    };
  }
  function grossWelches() {
    const n = pick(N.filter((x) => /(ung|in|er|el|e|en|chen)$/.test(x.sg) && x.sg.length > 4)).sg;
    const v = pick(V), a = pick(ADJ.filter((x) => !['viel', 'gern', 'arm', 'laut', 'gut', 'hoch', 'dunkel'].includes(x.pos))).pos, p = pick(['wir', 'euch', 'unser', 'dein', 'ihm', 'mir']);
    const w = shuffle([n.toLowerCase(), v.du, a, p]);
    return {
      prompt: 'Welches Wort muss man <b>groß</b> schreiben?',
      choices: w, correct: w.indexOf(n.toLowerCase()),
      hint: 'Mach die Artikelprobe: Vor welches Wort passt „der“, „die“ oder „das“?',
      solution: `<b>${n}</b> ist ein Nomen: ${N.find((x) => x.sg === n).art} ${n}. Die anderen Wörter sind Verb, Adjektiv und Pronomen. Die schreibt man klein.`,
      ex: zz('grossWelches', [n.toLowerCase()], 0, [N.find((x) => x.sg === n).art + ' ', n], 1, 'Artikelprobe: Vor welches Wort passt der, die oder das?', 'Passt ein Artikel davor, ist es ein Nomen: groß.', `<b>${n}</b>`),
    };
  }
  // Anredewörter im Brief (Deutschbuch Kap. 1, S. 28): Sie, Ihnen, Ihr immer groß; du, dich, dein darf man groß oder klein schreiben
  const ANREDE = [['Liebe Frau Klein, vielen Dank für ___ Hilfe.', 'Ihre', 'ihre'], ['Lieber Herr Meier, ich wünsche ___ schöne Ferien.', 'Ihnen', 'ihnen'],
    ['Sehr geehrte Frau Lang, haben ___ meinen Brief bekommen?', 'Sie', 'sie'], ['Liebe Frau Klein, ich freue mich auf ___ Besuch.', 'Ihren', 'ihren'],
    ['Lieber Herr Schulz, darf ich ___ etwas fragen?', 'Sie', 'sie'], ['Liebe Frau Klein, ich danke ___ für das Buch.', 'Ihnen', 'ihnen']];
  const REGEL_ANREDE = 'Im Brief an Erwachsene, die man siezt, schreibt man <b>Sie, Ihnen, Ihr</b> immer <b>groß</b>. Die Anrede an Freunde (du, dich, dein, euch) darf man im Brief groß oder klein schreiben.';
  function grossAnrede() {
    if (Math.random() < 0.2) {
      const [satz, w] = pick([['Liebe Oma, ich danke ___ für das Geschenk.', 'dir'], ['Lieber Ben, wie geht es ___?', 'dir'], ['Liebe Lina, ich habe ___ ein Foto geschickt.', 'dir']]);
      const ch = ['nur klein: ' + w, 'nur groß: ' + gross(w), 'beides ist richtig'];
      return { prompt: `Wie schreibt man die Anrede im Brief an eine vertraute Person?<br><span class="bsp">${satz}</span>`, choices: ch, correct: 2, hint: REGEL_ANREDE,
        solution: `<b>Beides ist richtig</b>: ${satz.replace('___', w)} oder ${satz.replace('___', gross(w))}<br>${REGEL_ANREDE}`,
        ex: zz('grossAnrede', [satz], 0, [satz.replace('___', `${w} / ${gross(w)}`)], 0, 'Der Brief geht an jemanden, den du duzt.', 'du, dir, dein: groß oder klein, beides ist richtig.', `<b>${w}</b> oder <b>${gross(w)}</b>`) };
    }
    const [satz, ok, falsch] = pick(ANREDE), ch = shuffle([ok, falsch]), voll = satz.replace('___', ok);
    return {
      prompt: `Du schreibst einen Brief an eine Person, die du <b>siezt</b>. Welches Wort passt?<br><span class="bsp">${satz}</span>`, choices: ch, correct: ch.indexOf(ok), hint: REGEL_ANREDE,
      solution: `<b>${voll}</b><br>Die Person wird gesiezt. Deshalb schreibt man <b>${ok}</b> groß.`,
      ex: zz('grossAnrede', [satz], 0, [voll], 0, 'Der Brief geht an jemanden, den du siezt.', `Die Anrede <b>${ok}</b> schreibt man dann immer groß.`, `<b>${voll}</b>`),
    };
  }
  const grossKlein = () => U.wahl([[30, grossAntippen], [22, grossWort], [20, grossVerb], [14, grossWelches], [14, grossAnrede]]);

  // ---------- Thema: Silben und Worttrennung ----------
  const SILB = ['Was-ser', 'Som-mer', 'Scho-ko-la-de', 'El-tern', 'Fens-ter', 'Kat-ze', 'Zu-cker', 'Brü-cke', 'Ja-cke', 'Kin-der', 'Blu-me', 'Gar-ten', 'Schu-le', 'Leh-re-rin', 'Ap-fel', 'Vo-gel', 'Mut-ter', 'Son-ne', 'Tel-ler', 'Him-mel', 'Ta-sche', 'Fla-sche', 'Kü-che', 'la-chen', 'ko-chen', 'Tep-pich', 'Kar-tof-fel', 'To-ma-te', 'Ba-na-ne', 'Kis-te', 'Schwes-ter', 'Haus-tür', 'Fuß-ball', 'Schul-hof', 'Hand-tuch', 'Ba-de-wan-ne', 'Re-gen-bo-gen', 'Was-ser-fla-sche', 'Früh-stück', 'Ge-burts-tag', 'Fahr-rad', 'Com-pu-ter', 'Fe-ri-en', 'Kro-ko-dil', 'Pa-pa-gei', 'Schmet-ter-ling', 'Erd-bee-re', 'Wol-ke', 'Lam-pe', 'Win-ter', 'Mon-tag', 'Diens-tag', 'Mitt-woch', 'Don-ners-tag', 'Frei-tag', 'Sams-tag', 'Sonn-tag', 'sin-gen', 'Fin-ger', 'Stra-ße', 'Fü-ße', 'Leh-rer', 'fah-ren', 'Bäu-me', 'Häu-ser', 'Feu-er', 'Mau-er', 'sit-zen', 'Müt-ze', 'Städ-te', 'Som-mer-fe-ri-en'];
  const EINSILBER = ['Pferd', 'Strumpf', 'Herbst', 'Tisch', 'Schrank', 'Stuhl'];
  const REGEL_SILB = 'Sprich das Wort langsam und klatsche dazu: Jede Silbe hat einen Vokal (oder au, ei, eu, ie). Getrennt wird zwischen den Silben. <b>ch, sch, ck</b> bleiben zusammen. Von mehreren Konsonanten kommt nur der letzte in die nächste Zeile (Fens-ter, Kat-ze).';
  const silbInfo = (t) => { const teile = t.split('-'), wort = teile.join(''); const grenzen = []; let c = 0; teile.slice(0, -1).forEach((x) => { c += x.length; grenzen.push(c - 1); }); return { teile, wort, grenzen, t }; };
  const exSilb = (art, x) => ({ mode: 'komma', art, dicht: true, mark: '-', tokens: [...x.wort], gaps: x.grenzen, s1: 'Sprich das Wort in Silben. Jede Silbe hat einen Vokal.', merk: `<b>${x.t}</b>: ${x.teile.length} ${x.teile.length === 1 ? 'Silbe' : 'Silben'}` });
  function silbTrennen() {
    const x = silbInfo(pick(SILB.filter((t) => t.replace(/-/g, '').length <= 9)));
    return {
      prompt: 'Trenne das Wort in <b>Silben</b>: Tippe die Trennstellen an.',
      tap: { tokens: [...x.wort], correct: x.grenzen, gaps: true, mark: '-', eng: true }, answerText: x.t,
      hint: REGEL_SILB, solution: `<b>${x.t}</b><br>${REGEL_SILB}`, ex: exSilb('silbTrennen', x),
    };
  }
  function silbZahl() {
    const x = silbInfo(Math.random() < 0.15 ? pick(EINSILBER) : pick(SILB));
    return {
      prompt: `Wie viele <b>Silben</b> hat das Wort?<br><span class="bsp gross">${x.wort}</span>`,
      choices: ['1', '2', '3', '4', '5'], correct: x.teile.length - 1,
      hint: 'Klatsche das Wort. Oder zähle die Vokale: Jede Silbe hat genau einen Vokal. au, ei, eu, ie, äu zählen als einer.',
      solution: `<b>${x.t}</b>: ${x.teile.length} ${x.teile.length === 1 ? 'Silbe. Einsilbige Wörter kann man nicht trennen.' : 'Silben.'}`,
      ex: exSilb('silbZahl', x),
    };
  }
  function silbWahl() {
    const x = silbInfo(pick(SILB));
    const verschieb = (g, k, d) => { const n = g.slice(); n[k] += d; return n; };
    const schreib = (g) => [...x.wort].map((c, i) => c + (g.includes(i) ? '-' : '')).join('');
    const f1 = schreib(verschieb(x.grenzen, 0, 1)), f2 = schreib(verschieb(x.grenzen, x.grenzen.length - 1, -1));
    const wahl = shuffle([x.t, ...[f1, f2].filter((f, i, a) => f !== x.t && a.indexOf(f) === i && !/^-|--|-$/.test(f))]);
    return {
      prompt: 'Welche Trennung ist richtig?', choices: wahl, correct: wahl.indexOf(x.t),
      hint: REGEL_SILB, solution: `<b>${x.t}</b><br>${REGEL_SILB}`, ex: exSilb('silbWahl', x),
    };
  }
  function silbTippen() {
    const x = silbInfo(pick(SILB));
    return {
      prompt: `Schreibe das Wort mit <b>Trennstrichen</b> (Beispiel: Blu-me).<br><span class="bsp gross">${x.wort}</span>`,
      fields: [{ type: 'text', answer: x.t, ci: true, label: 'Wort mit Trennstrichen' }],
      hint: REGEL_SILB, solution: `<b>${x.t}</b><br>${REGEL_SILB}`, ex: exSilb('silbTippen', x),
    };
  }
  // h, das die Silben trennt (Deutschbuch Kap. 10, S. 249): [falsch, richtig, Verlängerung]
  const SILBH = [['sie siet', 'sie sieht', 'se-hen'], ['er get', 'er geht', 'ge-hen'], ['die Ku', 'die Kuh', 'Kü-he'], ['der Schu', 'der Schuh', 'Schu-he'],
    ['es dret sich', 'es dreht sich', 'dre-hen'], ['das Re', 'das Reh', 'Re-he'], ['sie nät', 'sie näht', 'nä-hen'], ['sie stet', 'sie steht', 'ste-hen'], ['der Flo', 'der Floh', 'Flö-he'], ['er ru', 'er ruht', 'ru-hen']]
    .map(([f, r, v]) => [f.replace('er ru', 'er rut'), r, v]);
  function silbH() {
    const [f, r, v] = pick(SILBH), ch = shuffle([r, f]), x = silbInfo(v);
    return {
      prompt: 'Welches Wort ist richtig geschrieben?', choices: ch, correct: ch.indexOf(r),
      hint: 'Verlängere das Wort und sprich es in Silben: Hörst du zwischen zwei Silben ein h?',
      solution: `<b>${r}</b><br>Verlängert: <b>${v}</b>. Das <b>h</b> trennt die beiden Silben. Es bleibt auch in der kurzen Form stehen.`,
      ex: Object.assign(exSilb('silbH', x), { s1: 'Verlängere das Wort und sprich es in Silben.', merk: `<b>${v}</b>: Das h trennt die Silben. Deshalb: <b>${r}</b>.` }),
    };
  }
  // offene Silbe (endet mit Vokal: Vokal lang) oder geschlossene Silbe (endet mit Konsonant: Vokal kurz)
  const SILBOG = ['Ro-se', 'Blu-me', 'Schu-le', 'Vo-gel', 'Ha-se', 'Na-se', 'Ta-fel', 'Ho-se', 'Le-ben', 'Son-ne', 'Kat-ze', 'Mut-ter', 'Was-ser', 'Hal-le', 'Kis-te', 'Wol-ke', 'Pup-pe', 'Bril-le'];
  function silbOffen() {
    const x = silbInfo(pick(SILBOG)), erste = x.teile[0], offen = /[aeiouäöü]$/.test(erste);
    return {
      prompt: `Ist die erste Silbe <b>offen</b> oder <b>geschlossen</b>?<br><span class="bsp gross">${x.t}</span>`,
      choices: ['offen: endet mit einem Vokal, der Vokal ist lang', 'geschlossen: endet mit einem Konsonanten, der Vokal ist kurz'], correct: offen ? 0 : 1,
      hint: 'Schau auf den letzten Buchstaben der ersten Silbe. Ein Vokal (a, e, i, o, u, ä, ö, ü)? Dann ist sie offen.',
      solution: `<b>${x.t}</b>: Die erste Silbe „${erste}“ endet mit ${offen ? `dem Vokal <b>${erste.slice(-1)}</b>. Sie ist <b>offen</b>, der Vokal wird lang gesprochen.` : `dem Konsonanten <b>${erste.slice(-1)}</b>. Sie ist <b>geschlossen</b>, der Vokal wird kurz gesprochen.`}`,
      ex: Object.assign(exSilb('silbOffen', x), { merk: `<b>${x.t}</b>: „${erste}“ ist ${offen ? 'offen, der Vokal ist lang' : 'geschlossen, der Vokal ist kurz'}.` }),
    };
  }
  const silben = () => U.wahl([[28, silbTrennen], [16, silbZahl], [20, silbWahl], [14, silbTippen], [11, silbH], [11, silbOffen]]);


  // =====================================================
  // Bereich 4: Wörter bauen und Wortschatz
  // =====================================================
  // ---------- Thema: Zusammengesetzte Wörter ----------
  // [Artikel 1, Wort 1, Artikel 2, Wort 2, zusammengesetztes Wort, Fugenzeichen (wenn vorhanden)]
  const ZUS = [
    ['das', 'Haus', 'die', 'Tür', 'Haustür'], ['der', 'Apfel', 'der', 'Baum', 'Apfelbaum'], ['der', 'Fuß', 'der', 'Ball', 'Fußball'], ['die', 'Hand', 'das', 'Tuch', 'Handtuch'],
    ['der', 'Regen', 'der', 'Bogen', 'Regenbogen'], ['das', 'Wasser', 'die', 'Flasche', 'Wasserflasche'], ['der', 'Garten', 'der', 'Zaun', 'Gartenzaun'], ['der', 'Tisch', 'die', 'Lampe', 'Tischlampe'],
    ['der', 'Brief', 'der', 'Kasten', 'Briefkasten'], ['das', 'Fenster', 'die', 'Bank', 'Fensterbank'], ['der', 'Schnee', 'der', 'Mann', 'Schneemann'], ['der', 'Zahn', 'die', 'Bürste', 'Zahnbürste'],
    ['das', 'Auto', 'die', 'Bahn', 'Autobahn'], ['der', 'Vogel', 'das', 'Nest', 'Vogelnest'], ['der', 'Kopf', 'das', 'Kissen', 'Kopfkissen'], ['das', 'Haus', 'der', 'Schuh', 'Hausschuh'],
    ['der', 'Ball', 'das', 'Spiel', 'Ballspiel'], ['der', 'Stuhl', 'das', 'Bein', 'Stuhlbein'], ['der', 'Tee', 'die', 'Kanne', 'Teekanne'], ['die', 'Nuss', 'die', 'Schale', 'Nussschale'],
    ['die', 'Wand', 'die', 'Uhr', 'Wanduhr'], ['das', 'Glas', 'die', 'Tür', 'Glastür'], ['das', 'Gras', 'der', 'Halm', 'Grashalm'], ['das', 'Buch', 'die', 'Seite', 'Buchseite'],
    ['die', 'Sonne', 'der', 'Schein', 'Sonnenschein', 'n'], ['der', 'Hund', 'die', 'Hütte', 'Hundehütte', 'e'], ['die', 'Geburt', 'der', 'Tag', 'Geburtstag', 's'], ['die', 'Blume', 'der', 'Topf', 'Blumentopf', 'n'],
    ['die', 'Straße', 'die', 'Bahn', 'Straßenbahn', 'n'], ['die', 'Katze', 'das', 'Futter', 'Katzenfutter', 'n'], ['die', 'Tasche', 'die', 'Lampe', 'Taschenlampe', 'n'], ['das', 'Kind', 'das', 'Zimmer', 'Kinderzimmer', 'er'], ['das', 'Bild', 'das', 'Buch', 'Bilderbuch', 'er'],
  ].map(([a1, w1, a2, w2, wort, fuge]) => ({ a1, w1, a2, w2, wort, fuge: fuge || '' }));
  const REGEL_ZUS = 'Das <b>letzte</b> Wort ist das Grundwort. Es sagt, was die Sache ist, und bestimmt den <b>Artikel</b>. Das Wort davor beschreibt sie genauer.';
  const exZus = (art, z) => zz(art, [`${z.a1} ${z.w1}`, ' + ', `${z.a2} ${z.w2}`], 2, [z.a2 + ' ', z.wort], 1, `Zwei Wörter werden zu einem. ${z.fuge ? `Dazwischen kommt hier ein <b>${z.fuge}</b>.` : ''}`, REGEL_ZUS, `${z.w1} + ${z.w2} = <b>${z.a2} ${z.wort}</b>`);
  function zusArtikel() {
    const z = pick(ZUS.filter((x) => x.a1 !== x.a2));
    return {
      prompt: `Welcher Artikel gehört zum zusammengesetzten Wort?<br><span class="bsp">${z.a1} ${z.w1} + ${z.a2} ${z.w2} = ___ ${z.wort}</span>`,
      choices: ['der', 'die', 'das'], correct: ['der', 'die', 'das'].indexOf(z.a2),
      hint: 'Welches der beiden Wörter steht <b>hinten</b>? Sein Artikel gilt für das ganze Wort.',
      solution: `<b>${z.a2} ${z.wort}</b><br>${REGEL_ZUS} Hier: ${z.a2} ${z.w2} → ${z.a2} ${z.wort}.`, ex: exZus('zusArtikel', z),
    };
  }
  function zusBauen() {
    const z = pick(ZUS);
    return {
      prompt: 'Setze die beiden Wörter zu <b>einem</b> Wort zusammen.', layout: 'satz',
      fields: [{ type: 'text', answer: z.wort, prefix: `${z.a1} ${z.w1} + ${z.a2} ${z.w2} = ${z.a2}`, label: 'zusammengesetztes Wort' }],
      hint: 'Schreibe beide Wörter ohne Lücke hintereinander. Nur der Anfang ist groß. Manchmal kommt ein Buchstabe dazwischen, damit es sich gut spricht (Sonne<b>n</b>schein).',
      solution: `<b>${z.a2} ${z.wort}</b>${z.fuge ? `<br>Zwischen die Wörter kommt hier ein <b>${z.fuge}</b>: ${z.w1} + ${z.fuge} + ${z.w2.toLowerCase()}.` : ''}<br>${REGEL_ZUS}`, ex: exZus('zusBauen', z),
    };
  }
  function zusBedeutung() {
    const z = pick(ZUS), wahl = shuffle([z.w2, z.w1]);
    return {
      prompt: `Welches Wort ist das <b>Grundwort</b>? Es sagt, was die Sache ist.<br><span class="bsp gross">${z.wort}</span>`,
      choices: wahl, correct: wahl.indexOf(z.w2),
      hint: 'Schau auf das <b>letzte</b> Wort im zusammengesetzten Wort.',
      solution: `Das Grundwort ist <b>${z.w2}</b>: ${z.a2} ${z.wort} ist eine Art ${z.w2}. „${z.w1}“ beschreibt nur genauer, was für ${z.a2 === 'die' ? 'eine' : 'ein'} ${z.w2}.<br>${REGEL_ZUS}`, ex: exZus('zusBedeutung', z),
    };
  }
  function zusTrennen() {
    const z = pick(ZUS.filter((x) => !x.fuge && x.wort.length <= 10));
    return {
      prompt: 'Aus welchen zwei Wörtern besteht das Wort? Tippe die Stelle an, wo sie zusammenstoßen.',
      tap: { tokens: [...z.wort], correct: [z.w1.length - 1], gaps: true, mark: '|', eng: true, one: true }, answerText: `${z.w1} + ${z.w2}`,
      hint: 'Suche zwei Wörter, die du kennst. Jedes muss allein einen Sinn ergeben.',
      solution: `<b>${z.w1} + ${z.w2}</b> = ${z.a2} ${z.wort}<br>${REGEL_ZUS}`,
      ex: { mode: 'komma', art: 'zusTrennen', dicht: true, mark: '|', tokens: [...z.wort], gaps: [z.w1.length - 1], s1: 'Suche zwei Wörter, die du kennst.', merk: `<b>${z.w1} + ${z.w2}</b> = ${z.a2} ${z.wort}` },
    };
  }
  const zusammen = () => U.wahl([[28, zusArtikel], [30, zusBauen], [17, zusBedeutung], [25, zusTrennen]]);

  // ---------- Thema: Vorsilben und Nachsilben ----------
  // [Satz mit Lücke vor dem Verbteil, richtige Vorsilbe, zwei falsche (ergeben kein Wort), fertiges Wort]
  const VORS = [
    ['Lina hat sich im Wald ___laufen.', 'ver', ['zer', 'be'], 'verlaufen'], ['Das Glas ist ___brochen.', 'zer', ['be', 'ent'], 'zerbrochen'],
    ['Mia will das Bild bunt ___malen.', 'be', ['zer', 'ent'], 'bemalen'], ['Kolumbus hat Amerika ___deckt.', 'ent', ['zer', 'miss'], 'entdeckt'],
    ['Opa will uns ein Märchen ___zählen.', 'er', ['zer', 'ent'], 'erzählen'], ['Ich habe meinen Schlüssel ___gessen.', 'ver', ['zer', 'be'], 'vergessen'],
    ['Am Sonntag ___suchen wir Oma.', 'be', ['zer', 'ent'], 'besuchen'], ['Wer hat das Telefon ___funden?', 'er', ['zer', 'ent'], 'erfunden'],
    ['Der Hund hat das Kissen ___rissen.', 'zer', ['be', 'er'], 'zerrissen'], ['Der Bäcker ___kauft Brot.', 'ver', ['zer', 'ent'], 'verkauft'],
    ['Der Vogel ist aus dem Käfig ___kommen.', 'ent', ['zer', 'miss'], 'entkommen'], ['Ich habe dich leider ___verstanden.', 'miss', ['zer', 'ent'], 'missverstanden'],
    ['Zum Geburtstag ___kommt Ben ein Fahrrad.', 'be', ['zer', 'er'], 'bekommt'],
  ].map(([satz_, ok, falsch, wort]) => ({ satz: satz_, ok, falsch, wort }));
  // Nachsilben: [Ausgangswort, Nachsilbe, neues Wort, neue Wortart (N/A), falsche Nachsilben (ergeben kein Wort), regelmäßig zusammengesetzt?]
  const NACHS = [
    ['frei', 'heit', 'Freiheit', 'N', ['ung', 'nis'], 1], ['krank', 'heit', 'Krankheit', 'N', ['ung', 'nis'], 1], ['schön', 'heit', 'Schönheit', 'N', ['ung', 'nis'], 1], ['klug', 'heit', 'Klugheit', 'N', ['ung', 'nis'], 1],
    ['gesund', 'heit', 'Gesundheit', 'N', ['nis', 'schaft'], 1], ['fröhlich', 'keit', 'Fröhlichkeit', 'N', ['ung', 'nis'], 1], ['sauber', 'keit', 'Sauberkeit', 'N', ['ung', 'nis'], 1], ['ehrlich', 'keit', 'Ehrlichkeit', 'N', ['ung', 'nis'], 1],
    ['wohnen', 'ung', 'Wohnung', 'N', ['heit', 'keit'], 0], ['üben', 'ung', 'Übung', 'N', ['heit', 'keit'], 0], ['zeichnen', 'ung', 'Zeichnung', 'N', ['heit', 'keit'], 0], ['rechnen', 'ung', 'Rechnung', 'N', ['heit', 'keit'], 0],
    ['heizen', 'ung', 'Heizung', 'N', ['heit', 'keit'], 0], ['lösen', 'ung', 'Lösung', 'N', ['heit', 'keit'], 0], ['Freund', 'schaft', 'Freundschaft', 'N', ['ung', 'heit'], 1], ['Mann', 'schaft', 'Mannschaft', 'N', ['ung', 'keit'], 1],
    ['Nachbar', 'schaft', 'Nachbarschaft', 'N', ['ung', 'heit'], 1], ['geheim', 'nis', 'Geheimnis', 'N', ['ung', 'schaft'], 1],
    ['Wind', 'ig', 'windig', 'A', ['lich', 'bar'], 1], ['Mut', 'ig', 'mutig', 'A', ['lich', 'bar'], 1], ['Lust', 'ig', 'lustig', 'A', ['lich', 'sam'], 1], ['Glück', 'lich', 'glücklich', 'A', ['ig', 'bar'], 1],
    ['Freund', 'lich', 'freundlich', 'A', ['ig', 'bar'], 1], ['Herz', 'lich', 'herzlich', 'A', ['bar', 'sam'], 1], ['Tier', 'isch', 'tierisch', 'A', ['ig', 'bar'], 1], ['Neid', 'isch', 'neidisch', 'A', ['bar', 'sam'], 1],
    ['essen', 'bar', 'essbar', 'A', ['lich', 'sam'], 0], ['lesen', 'bar', 'lesbar', 'A', ['ig', 'sam'], 0], ['hören', 'bar', 'hörbar', 'A', ['lich', 'sam'], 0], ['trinken', 'bar', 'trinkbar', 'A', ['ig', 'sam'], 0],
    ['sparen', 'sam', 'sparsam', 'A', ['ig', 'lich'], 0], ['Fehler', 'los', 'fehlerlos', 'A', ['ig', 'bar'], 1],
  ].map(([basis, nach, wort, wa, falsch, reg]) => ({ basis, nach, wort, wa, falsch, reg: !!reg }));
  const NREGEL = { N: 'Die Nachsilben <b>-ung, -heit, -keit, -nis, -schaft</b> machen ein <b>Nomen</b>. Das schreibt man groß.', A: 'Die Nachsilben <b>-ig, -lich, -isch, -bar, -sam, -los</b> machen ein <b>Adjektiv</b>. Das schreibt man klein.' };
  function vorsilbe() {
    const v = pick(VORS), wahl = shuffle([v.ok, ...v.falsch]);
    return {
      prompt: `Welche Vorsilbe passt?<br><span class="bsp">${v.satz}</span>`,
      choices: wahl.map((x) => x + '-'), correct: wahl.indexOf(v.ok),
      hint: 'Setze jede Vorsilbe ein und lies den Satz. Nur mit einer entsteht ein Wort, das es gibt und das in den Satz passt.',
      solution: `${v.satz.replace('___', `<b class="vb">${v.ok}</b>`)}<br>Eine Vorsilbe verändert die Bedeutung des Verbs: <b>${v.wort}</b>.`,
      ex: zz('vorsilbe', v.satz.split('___'), 1, [v.satz.split('___')[0], v.ok, v.satz.split('___')[1]], 1, 'Eine Vorsilbe steht vor dem Wortstamm und verändert die Bedeutung.', `Nur <b>${v.ok}-</b> ergibt hier ein sinnvolles Wort.`, `<b>${v.wort}</b>`),
    };
  }
  const exNach = (art, n) => zz(art, [n.basis, ' + ', '-' + n.nach], 2, [n.wort.slice(0, n.wort.length - n.nach.length), n.nach], 1, 'Eine Nachsilbe hängt man hinten an. Sie kann die Wortart ändern.', NREGEL[n.wa], `${n.basis} + -${n.nach} = <b>${n.wort}</b> (${WA[n.wa]})`);
  function nachWortart() {
    const n = pick(NACHS);
    return {
      prompt: `Welche Wortart ist das neue Wort?<br><span class="bsp">${n.basis} + -${n.nach} = ${n.wort}</span>`,
      choices: ['Nomen', 'Adjektiv', 'Verb'], correct: n.wa === 'N' ? 0 : 1,
      hint: 'Schau auf die Nachsilbe und auf den Anfangsbuchstaben: groß oder klein?',
      solution: `<b>${n.wort}</b> ist ein ${WA[n.wa]}.<br>${NREGEL[n.wa]}`, ex: exNach('nachWortart', n),
    };
  }
  function nachBauen() {
    const n = pick(NACHS.filter((x) => x.reg));
    return {
      prompt: 'Hänge die Nachsilbe an. Achte auf <b>groß</b> oder <b>klein</b>.', layout: 'satz',
      fields: [{ type: 'text', answer: n.wort, prefix: `${n.basis} + -${n.nach} =`, label: 'neues Wort' }],
      hint: `${NREGEL.N} ${NREGEL.A}`,
      solution: `${n.basis} + -${n.nach} = <b class="vb">${n.wort}</b><br>${NREGEL[n.wa]}`, ex: exNach('nachBauen', n),
    };
  }
  function nachWahl() {
    const n = pick(NACHS), wahl = shuffle([n.nach, ...n.falsch]);
    const stamm_n = n.wort.slice(0, n.wort.length - n.nach.length);
    return {
      prompt: `Welche Nachsilbe macht aus <b>${n.basis}</b> ein <b>${WA[n.wa]}</b>?`,
      choices: wahl.map((x) => '-' + x), correct: wahl.indexOf(n.nach),
      hint: 'Hänge jede Nachsilbe an und sprich das Wort. Welches Wort gibt es?',
      solution: `${n.basis} + -${n.nach} = <b class="vb">${n.wort}</b><br>${NREGEL[n.wa]}`, ex: exNach('nachWahl', n),
    };
  }
  const ableitung = () => U.wahl([[38, vorsilbe], [20, nachWortart], [22, nachBauen], [20, nachWahl]]);

  // ---------- Thema: Wortfamilien ----------
  // [Wortstamm, Wörter der Familie, ähnlich aussehende Wörter, die NICHT verwandt sind]
  const FAM = [
    ['fahr', ['fahren', 'Fahrer', 'Fahrrad', 'Fahrt', 'Abfahrt', 'Fahrzeug'], ['Farbe', 'Fahne', 'fast']], ['spiel', ['spielen', 'Spiel', 'Spieler', 'Spielplatz', 'verspielt', 'Spielzeug'], ['Spiegel', 'Spinne', 'spitz']],
    ['lauf', ['laufen', 'Läufer', 'Wettlauf', 'verlaufen', 'Laufschuh'], ['Laub', 'laut', 'Laus']], ['back', ['backen', 'Bäcker', 'Bäckerei', 'Gebäck', 'Backofen'], ['Bach', 'Bank', 'packen']],
    ['lehr', ['lehren', 'Lehrer', 'Lehrerin', 'Lehrbuch'], ['leer', 'Lehm', 'Leder']], ['les', ['lesen', 'Leser', 'Lesebuch', 'vorlesen', 'lesbar'], ['leise', 'Leiste', 'Lust']],
    ['wohn', ['wohnen', 'Wohnung', 'Wohnzimmer', 'bewohnen', 'Bewohner'], ['Wolle', 'Woche', 'Wolke']], ['mal', ['malen', 'Maler', 'Malerei', 'bemalen', 'Malkasten'], ['Mantel', 'Maus', 'schmal']],
    ['flieg', ['fliegen', 'Flieger', 'Fliege', 'wegfliegen'], ['fliehen', 'Fleiß', 'Flöte']], ['freund', ['Freund', 'Freundin', 'freundlich', 'Freundschaft', 'befreunden'], ['Freude', 'fremd', 'Frieden']],
    ['zahl', ['Zahl', 'zählen', 'bezahlen', 'zahlreich', 'Anzahl'], ['Zahn', 'zahm', 'Saal']], ['haus', ['Haus', 'Häuser', 'häuslich', 'Haustür', 'Hausaufgabe'], ['Hase', 'Haut', 'Haufen']],
    ['schlaf', ['schlafen', 'Schlaf', 'schläfrig', 'Schlafzimmer', 'verschlafen'], ['schlau', 'Schlange', 'Schaf']],
  ].map(([st, fam, fremd]) => ({ st, fam, fremd }));
  const REGEL_FAM = 'Wörter einer <b>Wortfamilie</b> haben denselben <b>Wortstamm</b>. Manchmal wird aus a, o, u ein Umlaut (backen → Bäcker). Verwandte Wörter schreibt man im Stamm gleich.';
  const exFam = (art, f, woerter, raus) => ({ mode: 'liste', art, woerter, stamm: f.st, raus, s1: `Der Wortstamm ist <b>${f.st}</b>. Steckt er in jedem Wort?`, merk: raus >= 0 ? `<b>${woerter[raus]}</b> gehört nicht dazu: kein Wortstamm „${f.st}“.` : `Wortstamm <b>${f.st}</b>: ${woerter.join(', ')}` });
  function famNicht() {
    const f = pick(FAM), w = shuffle([...shuffle(f.fam).slice(0, 3), pick(f.fremd)]);
    const i = w.findIndex((x) => f.fremd.includes(x));
    return {
      prompt: 'Welches Wort gehört <b>nicht</b> zur Wortfamilie?', choices: w, correct: i,
      hint: 'Suche den Teil, der in fast allen Wörtern gleich ist. Das ist der Wortstamm. Ein Wort sieht nur ähnlich aus.',
      solution: `<b>${w[i]}</b> gehört nicht dazu. Die anderen haben den Wortstamm <b>${f.st}</b>: ${w.filter((x, k) => k !== i).join(', ')}.<br>${REGEL_FAM}`,
      ex: exFam('famNicht', f, w, i),
    };
  }
  function famDazu() {
    const f = pick(FAM), kern = f.fam[0], ok = pick(f.fam.slice(1));
    const w = shuffle([ok, ...shuffle(f.fremd).slice(0, 2)]);
    return {
      prompt: `Welches Wort gehört zur Wortfamilie von <b>${kern}</b>?`, choices: w, correct: w.indexOf(ok),
      hint: 'Verwandte Wörter haben denselben Wortstamm. Ähnlich klingen reicht nicht.',
      solution: `<b>${ok}</b> gehört zu „${kern}“: Beide haben den Wortstamm <b>${f.st}</b>.<br>${REGEL_FAM}`,
      ex: exFam('famDazu', f, [kern, ok], -1),
    };
  }
  function famStamm() {
    const f = pick(FAM), w = shuffle(f.fam).slice(0, 3);
    const wahl = shuffle([f.st, f.st.slice(0, 2), f.st + 'en']);
    return {
      prompt: `Welcher <b>Wortstamm</b> steckt in allen drei Wörtern?<br><span class="bsp">${w.join(' · ')}</span>`,
      choices: wahl, correct: wahl.indexOf(f.st),
      hint: 'Der Wortstamm ist der Teil, der in allen Wörtern vorkommt (ein Umlaut zählt mit: a und ä). Er soll so lang wie möglich sein, aber ohne Endung.',
      solution: `Der Wortstamm ist <b>${f.st}</b>: ${w.join(', ')}.<br>${REGEL_FAM}`,
      ex: exFam('famStamm', f, w, -1),
    };
  }
  const wortfamilie = () => U.wahl([[40, famNicht], [35, famDazu], [25, famStamm]]);

  // ---------- Thema: Wortfelder ----------
  const FELD = { sagen: ['flüstern', 'rufen', 'schreien', 'murmeln', 'fragen', 'antworten', 'erzählen', 'brüllen', 'stottern'], gehen: ['rennen', 'schleichen', 'schlendern', 'humpeln', 'stapfen', 'marschieren', 'trödeln', 'hüpfen'], sehen: ['schauen', 'blicken', 'beobachten', 'starren', 'betrachten', 'spähen'], essen: ['naschen', 'schlingen', 'knabbern', 'futtern', 'speisen'] };
  // [Satz mit Lücke, treffendes Wort, zwei unpassende, Wortfeld, Hinweis im Satz]
  const TREFF = [
    ['Der Dieb ___ leise um das Haus.', 'schleicht', ['stampft', 'marschiert'], 'gehen', 'leise'], ['Mit dem verletzten Fuß ___ Ben nach Hause.', 'humpelt', ['rennt', 'hüpft'], 'gehen', 'verletzter Fuß'],
    ['Wir haben es eilig und ___ zum Bus.', 'rennen', ['schlendern', 'trödeln'], 'gehen', 'eilig'], ['Am Sonntag ___ wir gemütlich durch den Park.', 'schlendern', ['rennen', 'rasen'], 'gehen', 'gemütlich'],
    ['Die Soldaten ___ im Gleichschritt.', 'marschieren', ['schleichen', 'humpeln'], 'gehen', 'im Gleichschritt'], ['Das Kind ___ fröhlich von Stein zu Stein.', 'hüpft', ['schleicht', 'humpelt'], 'gehen', 'von Stein zu Stein'],
    ['Durch den tiefen Schnee ___ wir mühsam.', 'stapfen', ['hüpfen', 'rasen'], 'gehen', 'tiefer Schnee, mühsam'],
    ['Im Kino ___ Mia mir etwas ins Ohr.', 'flüstert', ['brüllt', 'ruft'], 'sagen', 'im Kino, ins Ohr'], ['Der Trainer ___ laut über den ganzen Platz.', 'brüllt', ['flüstert', 'murmelt'], 'sagen', 'laut'],
    ['„Wie spät ist es?“, ___ Lina.', 'fragt', ['antwortet', 'befiehlt'], 'sagen', 'Fragezeichen'], ['Opa ___ uns jeden Abend eine Geschichte.', 'erzählt', ['fragt', 'schreit'], 'sagen', 'eine Geschichte'],
    ['Unverständlich ___ er etwas in seinen Bart.', 'murmelt', ['brüllt', 'ruft'], 'sagen', 'unverständlich'],
    ['Durch das Fernglas ___ wir die Vögel.', 'beobachten', ['übersehen', 'überhören'], 'sehen', 'Fernglas'], ['Vor Schreck ___ er mit großen Augen auf die Tür.', 'starrt', ['blinzelt', 'zwinkert'], 'sehen', 'vor Schreck, große Augen'],
    ['Heimlich ___ Mia ein Stück Schokolade.', 'nascht', ['speist', 'frühstückt'], 'essen', 'heimlich, Schokolade'], ['Der hungrige Hund ___ sein Futter in Sekunden hinunter.', 'schlingt', ['knabbert', 'nascht'], 'essen', 'hungrig, in Sekunden'],
    ['Das Kaninchen ___ an einer Möhre.', 'knabbert', ['schlingt', 'speist'], 'essen', 'an einer Möhre'],
  ].map(([satz_, ok, falsch, feld, grund]) => ({ satz: satz_, ok, falsch, feld, grund }));
  const STARK = [
    ['Welches Wort ist am <b>lautesten</b>?', ['flüstern', 'sagen', 'rufen', 'brüllen'], 3], ['Welches Wort ist am <b>leisesten</b>?', ['flüstern', 'rufen', 'schreien', 'sagen'], 0],
    ['Womit kommt man am <b>schnellsten</b> voran?', ['schlendern', 'gehen', 'rennen', 'humpeln'], 2], ['Welches Wort bedeutet <b>sehr klein</b>?', ['winzig', 'riesig', 'mächtig', 'breit'], 0],
    ['Welches Wort bedeutet <b>sehr groß</b>?', ['winzig', 'riesig', 'zierlich', 'schmal'], 1], ['Welches Wort passt für <b>genau und lange hinsehen</b>?', ['blinzeln', 'beobachten', 'übersehen', 'zwinkern'], 1],
  ];
  const REGEL_FELD = 'Wörter mit ähnlicher Bedeutung bilden ein <b>Wortfeld</b>. Mit dem treffenden Wort wird ein Text genauer und lebendiger als mit „sagen“ oder „gehen“.';
  function feldTreffend() {
    const t = pick(TREFF), wahl = shuffle([t.ok, ...t.falsch]);
    return {
      prompt: `Welches Wort passt am besten?<br><span class="bsp">${t.satz}</span>`, choices: wahl, correct: wahl.indexOf(t.ok),
      hint: 'Lies den Satz genau: Ein Wort darin verrät, <b>wie</b> etwas geschieht.',
      solution: `${t.satz.replace('___', `<b class="vb">${t.ok}</b>`)}<br>Der Hinweis im Satz: „${t.grund}“. Dazu passt nur <b>${t.ok}</b>.`,
      ex: zz('feldTreffend', t.satz.split('___'), 1, [t.satz.split('___')[0], t.ok, t.satz.split('___')[1]], 1, `Der Hinweis im Satz: „${t.grund}“.`, REGEL_FELD, `<b>${t.ok}</b> (Wortfeld „${t.feld}“)`),
    };
  }
  function feldNicht() {
    const namen = Object.keys(FELD), a = pick(namen), b = pick(namen.filter((x) => x !== a));
    const fremd = pick(FELD[b]), w = shuffle([...shuffle(FELD[a]).slice(0, 3), fremd]);
    return {
      prompt: `Welches Wort passt <b>nicht</b> ins Wortfeld „${a}“?`, choices: w, correct: w.indexOf(fremd),
      hint: `Frage bei jedem Wort: Ist das eine Art zu ${a}?`,
      solution: `<b>${fremd}</b> passt nicht: Es gehört zum Wortfeld „${b}“. Die anderen sind Arten zu ${a}.<br>${REGEL_FELD}`,
      ex: { mode: 'liste', art: 'feldNicht', woerter: w, stamm: '', raus: w.indexOf(fremd), s1: `Wortfeld „${a}“: Ist jedes Wort eine Art zu ${a}?`, merk: `<b>${fremd}</b> gehört zum Wortfeld „${b}“, nicht zu „${a}“.` },
    };
  }
  function feldWelches() {
    const namen = Object.keys(FELD), a = pick(namen), w = pick(FELD[a]);
    return {
      prompt: `Zu welchem Wortfeld gehört <b>${w}</b>?`, choices: namen, correct: namen.indexOf(a),
      hint: 'Ein Wortfeld sammelt Wörter mit ähnlicher Bedeutung. Wofür könntest du das Wort einsetzen?',
      solution: `<b>${w}</b> ist eine Art zu <b>${a}</b>.<br>${REGEL_FELD}`,
      ex: { mode: 'liste', art: 'feldWelches', woerter: [a, w], stamm: '', raus: -1, s1: `Was bedeutet „${w}“?`, merk: `<b>${w}</b> gehört zum Wortfeld „<b>${a}</b>“.` },
    };
  }
  function feldStark() {
    const [frage, woerter, ok] = pick(STARK), w = shuffle(woerter);
    return {
      prompt: frage, choices: w, correct: w.indexOf(woerter[ok]),
      hint: 'Stell dir jedes Wort vor: Wie laut, wie schnell, wie groß ist das?',
      solution: `<b>${woerter[ok]}</b>.<br>${REGEL_FELD}`,
      ex: { mode: 'liste', art: 'feldStark', woerter: w, stamm: '', raus: -1, hell: w.indexOf(woerter[ok]), s1: frage, merk: `<b>${woerter[ok]}</b>` },
    };
  }
  const wortfeld = () => U.wahl([[45, feldTreffend], [20, feldNicht], [20, feldWelches], [15, feldStark]]);

  // =====================================================
  // Bereich 5: Texte verstehen (alle Texte selbst geschrieben)
  // =====================================================
  // ---------- Thema: Märchen und Sage ----------
  // Erkennungswörter sind mit * markiert. Orte und Namen in den Sagen sind erfunden.
  const MS = [
    ['M', '*Es *war *einmal ein armer Müller, der hatte *drei Söhne. Eines Tages begegnete der jüngste im Wald einem *sprechenden Fuchs.'],
    ['M', '*Vor *langer *Zeit lebte in einem *fernen Land eine Königin. Eine *Fee schenkte ihr einen Spiegel, der jede Frage beantwortete.'],
    ['M', 'Hinter den *sieben Bergen wohnte ein Schneider. Wer *drei Rätsel löste, sollte die *Prinzessin heiraten.'],
    ['M', '*Es *war *einmal ein Mädchen, das fand im Wald einen *goldenen Schlüssel. Eine alte *Hexe wollte ihn ihr abnehmen.'],
    ['S', 'Bei dem Dorf *Lindenau steht ein großer Felsen am Fluss. Die Leute *erzählen, ein Riese habe ihn vor *800 *Jahren im Zorn dorthin geworfen.'],
    ['S', 'Auf der Burg *Falkenstein soll um das Jahr *1350 ein Ritter gelebt haben. Seit jener Zeit, so *erzählt man, hört man dort um Mitternacht seine Schritte.'],
    ['S', 'Der *Teufelssee im Hochwald hat seinen Namen von einer alten Geschichte. Dort *soll im Jahr *1502 ein Fuhrmann mit dem Teufel gewettet haben.'],
    ['S', 'In der Stadt *Altenbrück zeigt man noch heute einen Stein mit einem Hufabdruck. Er *soll von dem Pferd stammen, mit dem ein Graf im Jahr *1420 über den Fluss sprang.'],
  ].map(([typ, roh]) => { const w = roh.split(' '); return { typ, tokens: w.map((x) => x.replace('*', '')), mark: w.map((x, i) => (x[0] === '*' ? i : -1)).filter((i) => i >= 0), text: roh.replace(/\*/g, '') }; });
  const MERKM = { M: ['Es beginnt oft mit „Es war einmal“.', 'Ort und Zeit bleiben unbestimmt.', 'Tiere können sprechen.', 'Am Ende siegt das Gute.', 'Die Zahlen 3, 7 und 12 kommen oft vor.', 'Es treten Feen, Hexen und Zauberer auf.'], S: ['Es wird ein bestimmter Ort genannt.', 'Oft wird eine Jahreszahl oder eine bekannte Person genannt.', 'Die Geschichte hat einen wahren Kern.', 'Sie erklärt, wie ein Ort oder ein Name entstanden sein soll.'] };
  const MSNAME = { M: 'Märchen', S: 'Sage' };
  const MSWARUM = { M: 'Ein <b>Märchen</b> spielt irgendwo und irgendwann. Es gibt Zauberei, sprechende Tiere, die Zahlen 3 und 7, und am Ende siegt das Gute.', S: 'Eine <b>Sage</b> nennt einen bestimmten Ort, oft auch eine Zeit oder Person. Sie hat einen wahren Kern und erklärt etwas Besonderes, zum Beispiel einen Felsen oder einen Namen.' };
  function msErkennen() {
    const x = pick(MS);
    return {
      prompt: `Märchen oder Sage?<br><span class="bsp text">${x.text}</span>`, choices: ['Märchen', 'Sage'], correct: x.typ === 'M' ? 0 : 1,
      hint: 'Wird ein <b>bestimmter Ort</b> oder eine <b>Jahreszahl</b> genannt? Oder spielt es „irgendwo, vor langer Zeit“, mit Zauberwesen?',
      solution: `Das ist ein Ausschnitt aus einer <b>${MSNAME[x.typ] === 'Sage' ? 'Sage' : 'einem Märchen'}</b>`.replace('aus einer <b>einem Märchen', 'aus einem <b>Märchen') + `. Daran erkennst du es: ${x.mark.map((i) => x.tokens[i].replace(/[.,]/g, '')).join(', ')}.<br>${MSWARUM[x.typ]}`,
      ex: { mode: 'marken', art: 'msErkennen', tokens: x.tokens, correct: x.mark, was: 'Erkennungswörter', klein: true, s1: MSWARUM[x.typ], merk: `<b>${MSNAME[x.typ]}</b>. Erkennungswörter: ${x.mark.map((i) => x.tokens[i].replace(/[.,]/g, '')).join(', ')}` },
    };
  }
  function msMerkmal() {
    const typ = pick(['M', 'S']), anders = typ === 'M' ? 'S' : 'M';
    const ok = pick(MERKM[typ]), w = shuffle([ok, ...shuffle(MERKM[anders]).slice(0, 2)]);
    return {
      prompt: `Welches Merkmal gehört zu${typ === 'M' ? 'm <b>Märchen</b>' : 'r <b>Sage</b>'}?`, choices: w, correct: w.indexOf(ok),
      hint: 'Märchen: irgendwo, irgendwann, mit Zauberei. Sage: bestimmter Ort, wahrer Kern.',
      solution: `<b>${ok}</b><br>${MSWARUM[typ]}`,
      ex: { mode: 'liste', art: 'msMerkmal', woerter: [MSNAME[typ], ...MERKM[typ].slice(0, 3).map((m) => m.replace(/\.$/, ''))], stamm: '', raus: -1, hell: 0, klein: true, s1: `Typisch für ${typ === 'M' ? 'das Märchen' : 'die Sage'}:`, merk: `${MSNAME[typ]}: <b>${ok}</b>` },
    };
  }
  const MSFEST = [
    ['Welcher Satz ist ein typischer <b>Märchen-Anfang</b>?', ['Es war einmal ein König, der hatte drei Töchter.', 'Sehr geehrte Damen und Herren,', 'Gestern um 15 Uhr stießen zwei Autos zusammen.'], 'Viele Märchen beginnen mit einer festen Formel wie „Es war einmal“.'],
    ['Welcher Satz ist ein typischer <b>Märchen-Schluss</b>?', ['Und wenn sie nicht gestorben sind, dann leben sie noch heute.', 'Mit freundlichen Grüßen', 'Fortsetzung folgt.'], 'Viele Märchen enden mit einer festen Formel, und es geht gut aus.'],
    ['Ein Märchen wurde lange nur weitererzählt, niemand kennt den Erfinder. Wie nennt man es?', ['Volksmärchen', 'Kunstmärchen', 'Sage'], 'Volksmärchen wurden mündlich überliefert und später gesammelt, zum Beispiel von den Brüdern Grimm.'],
    ['Ein Dichter wie Hans Christian Andersen hat sich ein Märchen ausgedacht. Wie nennt man es?', ['Kunstmärchen', 'Volksmärchen', 'Sage'], 'Bei einem Kunstmärchen kennt man den Verfasser.'],
  ];
  function msFest() {
    const [frage, woerter, warum] = pick(MSFEST), w = shuffle(woerter);
    return { prompt: frage, choices: w, correct: w.indexOf(woerter[0]), hint: 'Denke an die Märchen, die du kennst: Wie fangen sie an, wie hören sie auf, und wer hat sie erzählt?', solution: `<b>${woerter[0]}</b><br>${warum}`,
      ex: { mode: 'liste', art: 'msFest', woerter: w, stamm: '', raus: -1, hell: w.indexOf(woerter[0]), klein: true, s1: frage.replace(/<[^>]+>/g, ''), merk: `<b>${woerter[0]}</b><br>${warum}` } };
  }
  const maerchen = () => U.wahl([[45, msErkennen], [35, msMerkmal], [20, msFest]]);

  // ---------- Thema: Gedichte ----------
  const GED = [
    ['aabb', ['Der Igel raschelt durch das Laub,', 'er sucht nach Futter unterm Staub.', 'Bald rollt er sich zur Kugel ein', 'und schläft bis in den Frühling rein.']],
    ['aabb', ['Im Winter fällt der erste Schnee,', 'er deckt die Wiese und den See.', 'Die Kinder holen Schlitten raus', 'und sausen jubelnd um das Haus.']],
    ['abab', ['Die Sonne steigt am Morgen auf,', 'der Nebel zieht vom Feld,', 'die Vögel singen froh darauf', 'und wecken alle Welt.']],
    ['abab', ['Ein Drachen tanzt im Wind,', 'er steigt und fällt und dreht,', 'ihm winkt ein kleines Kind,', 'das staunend unten steht.']],
    ['abba', ['Am Abend wird es still im Haus,', 'die Katze schnurrt auf ihrem Kissen,', 'kein Mensch will jetzt noch etwas wissen,', 'und leise geht das Licht dann aus.']],
    ['abba', ['Der Herbst malt alle Blätter bunt,', 'sie tanzen durch die Gassen,', 'der Wind will sie nicht lassen', 'und treibt sie um den Brunnen rund.']],
  ].map(([schema, zeilen]) => ({ schema, zeilen, enden: zeilen.map((z) => z.replace(/[.,]$/, '').split(' ').pop()) }));
  const REIMNAME = { aabb: 'Paarreim (aabb)', abab: 'Kreuzreim (abab)', abba: 'umarmender Reim (abba)' };
  const REIMWARUM = { aabb: 'Beim <b>Paarreim</b> reimen sich zwei Verse direkt hintereinander: a a b b.', abab: 'Beim <b>Kreuzreim</b> reimt sich immer der übernächste Vers: a b a b.', abba: 'Beim <b>umarmenden Reim</b> umschließt ein Reimpaar das andere: a b b a.' };
  const vers = (g) => `<span class="bsp vers">${g.zeilen.join('<br>')}</span>`;
  const exReim = (art, g) => ({ mode: 'reim', art, zeilen: g.zeilen, schema: g.schema, merk: `${g.enden[0]} (a) · ${g.enden[1]} (${g.schema[1]}) · ${g.enden[2]} (${g.schema[2]}) · ${g.enden[3]} (${g.schema[3]})<br><b>${REIMNAME[g.schema]}</b>` });
  function gedSchema() {
    const g = pick(GED), s = ['aabb', 'abab', 'abba'];
    return {
      prompt: `Welches <b>Reimschema</b> hat die Strophe?${vers(g)}`, choices: s.map((x) => REIMNAME[x]), correct: s.indexOf(g.schema),
      hint: 'Schau auf das <b>letzte Wort</b> jedes Verses. Gib dem ersten Reim den Buchstaben a, dem nächsten neuen Reim b.',
      solution: `${g.enden.map((e, i) => `${e} (${g.schema[i]})`).join(' · ')}<br>${REIMWARUM[g.schema]}`, ex: exReim('gedSchema', g),
    };
  }
  function gedReimwort() {
    const g = pick(GED), i = R(0, 3), partner = [0, 1, 2, 3].find((k) => k !== i && g.schema[k] === g.schema[i]);
    const w = shuffle([0, 1, 2, 3].filter((k) => k !== i));
    return {
      prompt: `Welches Wort reimt sich auf <b>${g.enden[i]}</b>?${vers(g)}`, choices: w.map((k) => g.enden[k]), correct: w.indexOf(partner),
      hint: 'Sprich die Wörter am Versende laut. Zwei Wörter reimen sich, wenn sie ab dem letzten betonten Vokal gleich klingen.',
      solution: `<b>${g.enden[i]}</b> reimt sich auf <b>${g.enden[partner]}</b>.<br>${REIMWARUM[g.schema]}`, ex: exReim('gedReimwort', g),
    };
  }
  const GEDFEST = [
    ['Wie nennt man eine <b>Zeile</b> in einem Gedicht?', ['Vers', 'Strophe', 'Reim'], 'Eine Zeile im Gedicht heißt Vers.'],
    ['Wie nennt man einen <b>Abschnitt</b> aus mehreren Versen?', ['Strophe', 'Vers', 'Kapitel'], 'Mehrere Verse bilden zusammen eine Strophe.'],
    ['Wie nennt man es, wenn zwei Wörter am Ende <b>gleich klingen</b> (Haus – Maus)?', ['Reim', 'Vers', 'Strophe'], 'Gleichklang am Wortende heißt Reim.'],
    ['Wer ist das <b>lyrische Ich</b>?', ['die Stimme, die im Gedicht „ich“ sagt', 'immer der Dichter selbst', 'der Leser des Gedichts'], 'Das lyrische Ich ist die Stimme im Gedicht. Es muss nicht der Dichter sein.'],
  ];
  function gedFest() {
    const g = pick(GED), [frage, woerter, warum] = pick(GEDFEST), w = shuffle(woerter);
    return { prompt: frage, choices: w, correct: w.indexOf(woerter[0]), hint: 'Vers = Zeile · Strophe = Abschnitt · Reim = Gleichklang.', solution: `<b>${woerter[0]}</b><br>${warum}`, ex: exReim('gedFest', g) };
  }
  function gedZaehlen() {
    const g = pick(GED);
    return { prompt: `Wie viele <b>Verse</b> hat diese Strophe?${vers(g)}`, choices: ['1', '2', '4', '8'], correct: 2, hint: 'Ein Vers ist eine Zeile im Gedicht.', solution: 'Die Strophe hat <b>4</b> Verse. Jede Zeile ist ein Vers, alle vier zusammen bilden eine Strophe.', ex: exReim('gedZaehlen', g) };
  }
  // Versmaß (Deutschbuch Kap. 5, S. 118): Silben mit Leerzeichen, betonte Silben mit * markiert
  const METRUM = [
    ['Der *Ha-se *hop-pelt *ü-bers *Feld', 'J'], ['Ein *Vo-gel *singt im *Ap-fel-*baum', 'J'], ['Am *Him-mel *zieht ein *Flug-zeug *hin', 'J'], ['Die *Kat-ze *schläft auf *mei-nem *Bett', 'J'],
    ['Der *I-gel *ra-schelt *durch das *Laub', 'J'], ['Im *Win-ter *fällt der *ers-te *Schnee', 'J'],
    ['*Son-ne, *Mond und *Ster-ne *leuch-ten', 'T'], ['*Wind und *Wel-len *spie-len *heu-te', 'T'], ['*Kat-zen *schlei-chen *durch die *Gas-sen', 'T'],
    ['*Kin-der *la-chen, *Hun-de *bel-len', 'T'], ['*Bun-te *Dra-chen *flie-gen *hoch', 'T'], ['*Mor-gens *kräht der *Hahn im *Hof', 'T'],
  ].map(([roh, typ]) => {
    const silben = roh.split(' ').flatMap((w) => w.split('-'));
    const tokens = silben.map((x) => x.replace('*', '')), betont = silben.map((x, i) => (x[0] === '*' ? i : -1)).filter((i) => i >= 0);
    return { satz: roh.replace(/[*-]/g, ''), tokens, betont, typ, muster: tokens.map((_, i) => (betont.includes(i) ? 'X' : 'x')).join(' ') };
  });
  const MNAME = { J: 'Jambus (unbetont – betont: x X)', T: 'Trochäus (betont – unbetont: X x)' };
  function gedMetrum() {
    const m = pick(METRUM), ch = ['J', 'T'];
    const silbig = m.tokens.map((t, i) => (m.betont.includes(i) ? `<b>${t.toUpperCase()}</b>` : t)).join(' · ');
    return {
      prompt: `Welches <b>Versmaß</b> hat der Vers? Sprich ihn laut und klopfe mit.<br><span class="bsp">${m.satz}</span>`,
      choices: ch.map((x) => MNAME[x]), correct: ch.indexOf(m.typ),
      hint: 'Sprich den Vers langsam und klopfe bei jeder betonten Silbe auf den Tisch. Beginnt er mit einer <b>unbetonten</b> Silbe (der, ein, am)? Dann Jambus. Beginnt er <b>betont</b>? Dann Trochäus.',
      solution: `${silbig}<br>Muster: <b>${m.muster}</b> → <b>${m.typ === 'J' ? 'Jambus' : 'Trochäus'}</b>. ${m.typ === 'J' ? 'Unbetont und betont wechseln sich ab, der Vers beginnt unbetont.' : 'Betont und unbetont wechseln sich ab, der Vers beginnt betont.'}`,
      ex: { mode: 'marken', art: 'gedMetrum', tokens: m.tokens, correct: m.betont, was: 'Betonte Silben', s1: 'Sprich den Vers langsam. Welche Silben sind betont?', merk: `Muster <b>${m.muster}</b>: ${m.typ === 'J' ? 'Jambus' : 'Trochäus'}.` },
    };
  }
  const gedicht = () => U.wahl([[36, gedSchema], [28, gedReimwort], [14, gedFest], [6, gedZaehlen], [16, gedMetrum]]);

  // ---------- Thema: Sprachliche Bilder ----------
  // [Satz (Bildwort mit *), Bedeutung, zwei falsche Deutungen, Art: P Personifikation, V Vergleich, B anderes Bild]
  const BILDER = [
    ['Der Wind *flüstert in den Bäumen.', 'Der Wind weht leise.', ['Der Wind kann sprechen.', 'Jemand flüstert im Wald.'], 'P'], ['Die Sonne *lacht.', 'Die Sonne scheint hell.', ['Die Sonne macht ein Geräusch.', 'Jemand lacht in der Sonne.'], 'P'],
    ['Er ist stark *wie ein Bär.', 'Er ist sehr stark.', ['Er ist ein Bär.', 'Er hat ein Fell.'], 'V'], ['Sie hat ein Herz aus *Gold.', 'Sie ist sehr gutherzig.', ['Ihr Herz ist aus Metall.', 'Sie besitzt viel Schmuck.'], 'B'],
    ['Die Zeit vergeht im *Flug.', 'Die Zeit vergeht sehr schnell.', ['Die Zeit kann fliegen.', 'Wir sitzen im Flugzeug.'], 'B'], ['Der Himmel *weint.', 'Es regnet.', ['Jemand weint draußen.', 'Der Himmel hat Augen.'], 'P'],
    ['Er schläft *wie ein Murmeltier.', 'Er schläft tief und lange.', ['Er schläft in einer Höhle.', 'Er ist ein Tier.'], 'V'], ['Die Blätter *tanzen im Wind.', 'Die Blätter bewegen sich im Wind hin und her.', ['Die Blätter hören Musik.', 'Kinder tanzen im Laub.'], 'P'],
    ['Der Bach *murmelt.', 'Der Bach plätschert leise.', ['Der Bach spricht undeutlich.', 'Jemand murmelt am Bach.'], 'P'], ['Sie ist flink *wie ein Wiesel.', 'Sie ist sehr schnell.', ['Sie ist ein kleines Tier.', 'Sie wohnt im Wald.'], 'V'],
    ['Der Nebel *verschluckt das Dorf.', 'Im Nebel sieht man das Dorf nicht mehr.', ['Der Nebel hat einen Mund.', 'Das Dorf ist zerstört.'], 'P'], ['Seine Augen leuchten *wie Sterne.', 'Seine Augen strahlen vor Freude.', ['Seine Augen sind Lampen.', 'Es ist gerade Nacht.'], 'V'],
    ['Mein Bruder ist ein *Faultier.', 'Mein Bruder ist sehr faul.', ['Mein Bruder ist ein Tier.', 'Mein Bruder hängt gern in Bäumen.'], 'B'],
    ['Lina ist eine *Leseratte.', 'Lina liest sehr gern.', ['Lina ist eine Ratte.', 'Lina hat Angst vor Ratten.'], 'B'],
    ['Die Klasse ist heute ein *Bienenstock.', 'In der Klasse ist es laut und unruhig.', ['In der Klasse wohnen Bienen.', 'Die Klasse sammelt Honig.'], 'B'],
  ].map(([roh, sinn, falsch, typ]) => { const w = roh.split(' '); return { tokens: w.map((x) => x.replace('*', '')), mark: w.findIndex((x) => x[0] === '*'), text: roh.replace('*', ''), sinn, falsch, typ }; });
  const BWARUM = { P: 'Das ist eine <b>Personifikation</b>: Etwas, das kein Mensch ist (Wind, Sonne, Bach), handelt wie ein Mensch.', V: 'Das ist ein <b>Vergleich</b>: Mit „wie“ wird etwas mit etwas anderem verglichen.', B: 'Das ist eine <b>Metapher</b>: ein Vergleich ohne „wie“. Die Wörter sind nicht wörtlich gemeint, sie malen ein Bild im Kopf (stark wie ein Bär → Er ist ein Bär).' };
  const exBild = (art, b) => ({ mode: 'marken', art, tokens: b.tokens, correct: [b.mark], was: 'Bildwort', s1: BWARUM[b.typ], merk: `„${b.text}“ bedeutet: <b>${b.sinn}</b>` });
  function bildSinn() {
    const b = pick(BILDER), w = shuffle([b.sinn, ...b.falsch]);
    return { prompt: `Was ist gemeint?<br><span class="bsp">${b.text}</span>`, choices: w, correct: w.indexOf(b.sinn), hint: 'Ein sprachliches Bild ist <b>nicht wörtlich</b> gemeint. Stell dir das Bild vor: Was will es zeigen?', solution: `<b>${b.sinn}</b><br>${BWARUM[b.typ]}`, ex: exBild('bildSinn', b) };
  }
  function bildArt() {
    const b = pick(BILDER);
    return { prompt: `Welches sprachliche Bild ist das?<br><span class="bsp">${b.text}</span>`, choices: ['Vergleich (mit „wie“)', 'Personifikation', 'Metapher (Vergleich ohne „wie“)'], correct: { V: 0, P: 1, B: 2 }[b.typ], hint: 'Steht ein „wie“ im Satz? Dann Vergleich. Tut ein Ding oder die Natur etwas Menschliches? Dann Personifikation. Wird etwas einfach „gleichgesetzt“ (Er ist ein Bär)? Dann Metapher.', solution: `${BWARUM[b.typ]}<br>Gemeint ist: ${b.sinn}`, ex: exBild('bildArt', b) };
  }
  function bildWort() {
    const b = pick(BILDER.filter((x) => x.typ === 'P'));
    return { prompt: 'Tippe das Wort an, das etwas <b>Menschliches</b> ausdrückt.', tap: { tokens: b.tokens, correct: [b.mark], one: true }, answerText: b.tokens[b.mark].replace('.', ''), hint: 'Welches Wort beschreibt etwas, das eigentlich nur Menschen tun?', solution: `<b>${b.tokens[b.mark].replace('.', '')}</b>: Das können eigentlich nur Menschen.<br>${BWARUM.P} Gemeint ist: ${b.sinn}`, ex: Object.assign(exBild('bildWort', b), { merk: `<b>${b.tokens[b.mark].replace('.', '')}</b>: Das können eigentlich nur Menschen. Gemeint ist: ${b.sinn}` }) };
  }
  const bilder = () => U.wahl([[50, bildSinn], [28, bildArt], [22, bildWort]]);

  // ---------- Thema: Theaterszenen (Deutschbuch Kap. 6) ----------
  // Szenen: Teile; Regieanweisungen stehen in Klammern
  const SZENEN = [
    ['LINA:', '(flüstert)', 'Hörst du das?', 'BEN:', 'Nein.', '(Er schaut sich um.)', 'Was denn?'],
    ['MIA:', '(stampft mit dem Fuß auf)', 'Das ist mein Ball!', 'PAUL:', '(lacht)', 'Dann hol ihn dir doch!'],
    ['OMA:', 'Wer hat den Kuchen gegessen?', 'EMIL:', '(wischt sich schnell den Mund ab)', 'Ich nicht!'],
    ['NORA:', '(öffnet langsam die Tür)', 'Hallo? Ist da jemand?', 'OPA:', '(lacht)', 'Nur ich und der Hund!'],
    ['LEHRERIN:', 'Wo sind deine Hausaufgaben?', 'BEN:', '(kratzt sich am Kopf)', 'Die hat mein Hund gefressen.'],
  ];
  const MONO = [['EMIL', '(allein in seinem Zimmer)', 'Morgen ist der große Test. Ich habe noch gar nichts gelernt. Was mache ich nur? Ich fange gleich an, ganz bestimmt!'],
    ['LINA', '(steht allein am Fenster)', 'Wo bleibt sie nur? Sie wollte doch um drei Uhr kommen. Hoffentlich ist nichts passiert.']];
  const THFEST = [
    ['Wie nennt man ein <b>Gespräch zwischen zwei oder mehr Figuren</b>?', ['Dialog', 'Monolog', 'Regieanweisung'], 'Sprechen mehrere Figuren miteinander, ist es ein Dialog.'],
    ['Wie nennt man es, wenn <b>eine Figur allein</b> spricht?', ['Monolog', 'Dialog', 'Szene'], 'Spricht eine Figur allein (oft über ihre Gedanken), ist es ein Monolog.'],
    ['Was ist eine <b>Regieanweisung</b>?', ['ein Hinweis, wie gespielt wird; er wird nicht gesprochen', 'ein Satz, den eine Figur laut sagt', 'der Name des Theaterstücks'], 'Regieanweisungen stehen meist in Klammern und schräg gedruckt. Sie sagen, was die Figur tut oder wie sie spricht.'],
    ['Wie nennt man einen <b>Gegenstand</b>, den man auf der Bühne braucht (z. B. einen Ball)?', ['Requisite', 'Kulisse', 'Regieanweisung'], 'Gegenstände, mit denen gespielt wird, heißen Requisiten. Die Kulisse ist der Hintergrund.'],
    ['Wie nennt man einen <b>kurzen Abschnitt</b> eines Theaterstücks?', ['Szene', 'Strophe', 'Kapitel'], 'Ein Theaterstück besteht aus Szenen. Eine Strophe gehört zum Gedicht.'],
  ];
  // Mimik (Gesicht), Gestik (Hände, Arme, Körper), Stimme
  const MGS = [['runzelt die Stirn', 'Mimik'], ['lächelt', 'Mimik'], ['reißt die Augen weit auf', 'Mimik'], ['zeigt mit dem Finger auf Ben', 'Gestik'], ['verschränkt die Arme', 'Gestik'],
    ['winkt mit beiden Händen', 'Gestik'], ['flüstert', 'Stimme'], ['ruft laut', 'Stimme'], ['spricht mit zitternder Stimme', 'Stimme']];
  const MGS_WARUM = { Mimik: '<b>Mimik</b> ist alles, was das Gesicht zeigt.', Gestik: '<b>Gestik</b> sind Bewegungen mit Händen, Armen und Körper.', Stimme: 'Mit der <b>Stimme</b> zeigt man, wie etwas gesagt wird: laut, leise, zitternd …' };
  function thRegie() {
    const z = pick(SZENEN), correct = z.map((t, i) => (t[0] === '(' ? i : -1)).filter((i) => i >= 0);
    return {
      prompt: 'Tippe <b>alle Regieanweisungen</b> an.', tap: { tokens: z, correct }, answerText: correct.map((i) => z[i]).join(', '),
      hint: 'Regieanweisungen werden nicht gesprochen. Sie stehen in Klammern und sagen, was eine Figur tut oder wie sie spricht.',
      solution: `${z.map((t, i) => (correct.includes(i) ? `<b class="vb">${t}</b>` : t)).join(' ')}<br>Die Teile in Klammern sind Regieanweisungen: Sie werden gespielt, nicht gesprochen.`,
      ex: { mode: 'marken', art: 'thRegie', tokens: z, correct, klein: true, was: 'Regieanweisungen', s1: 'Was wird gesprochen, was wird gespielt?', merk: `Regieanweisungen: <b>${correct.map((i) => z[i]).join(', ')}</b>` },
    };
  }
  function thMonoDia() {
    const mono = Math.random() < 0.4;
    const text = mono ? (() => { const [w, r, t] = pick(MONO); return `${w}: ${r} ${t}`; })() : pick(SZENEN).join(' ');
    return {
      prompt: `Monolog oder Dialog?<br><span class="bsp">${text}</span>`, choices: ['Monolog', 'Dialog'], correct: mono ? 0 : 1,
      hint: 'Zähle, wie viele Figuren sprechen. Ihre Namen stehen in Großbuchstaben vor dem Text.',
      solution: mono ? 'Nur eine Figur spricht, allein mit ihren Gedanken: ein <b>Monolog</b>.' : 'Mehrere Figuren sprechen miteinander: ein <b>Dialog</b>.',
      ex: { mode: 'marken', art: 'thMonoDia', tokens: text.split(' '), correct: text.split(' ').map((t, i) => (/^[A-ZÄÖÜ]{2,}:$/.test(t) ? i : -1)).filter((i) => i >= 0), klein: true, was: 'Sprecher', s1: 'Wer spricht? Die Namen stehen in Großbuchstaben.', merk: mono ? '<b>Monolog</b>: eine Figur spricht.' : '<b>Dialog</b>: mehrere Figuren sprechen.' },
    };
  }
  function thFest() {
    const [frage, w, warum] = pick(THFEST), ch = shuffle(w);
    return { prompt: frage, choices: ch, correct: ch.indexOf(w[0]), hint: 'Dialog: mehrere sprechen. Monolog: einer spricht allein. Regieanweisung: wie gespielt wird.', solution: `<b>${w[0]}</b><br>${warum}`,
      ex: { mode: 'marken', art: 'thFest', tokens: [w[0]], correct: [0], was: 'Fachwort', s1: frage.replace(/<\/?b>/g, ''), merk: `<b>${w[0]}</b>: ${warum}` } };
  }
  function thMgs() {
    const [was, art] = pick(MGS), ch = ['Mimik', 'Gestik', 'Stimme'], fig = pick(['Lina', 'Emil', 'Mia', 'Paul']);
    return {
      prompt: `In der Regieanweisung steht: <i>(${fig} ${was})</i><br>Womit spielt ${fig} das?`, choices: ch, correct: ch.indexOf(art),
      hint: 'Mimik: Gesicht. Gestik: Hände, Arme, Körper. Stimme: wie etwas gesagt wird.',
      solution: `<b>${art}</b>: ${MGS_WARUM[art]}`, ex: { mode: 'marken', art: 'thMgs', tokens: `(${fig} ${was})`.split(' '), correct: was.split(' ').map((_, k) => k + 1), klein: true, was: art, s1: 'Gesicht, Hände oder Stimme?', merk: `<b>${art}</b>: ${MGS_WARUM[art]}` },
    };
  }
  const theater = () => U.wahl([[30, thRegie], [24, thMonoDia], [22, thFest], [24, thMgs]]);

  // ---------- Thema: Kamera – Einstellungsgrößen und Perspektiven (Deutschbuch Kap. 7) ----------
  // Ein Bild (Haus, Baum, Kind) und verschiedene Ausschnitte daraus
  const KSZENE = '<rect x="0" y="0" width="320" height="180" fill="#cfe6ff"/><circle cx="280" cy="30" r="14" fill="#ffd34d"/><rect x="0" y="140" width="320" height="40" fill="#8fce79"/>'
    + '<rect x="18" y="80" width="70" height="60" fill="#f2c79a" stroke="#6b4a2b" stroke-width="2"/><path d="M12 82 L53 48 L94 82z" fill="#c4553b" stroke="#6b4a2b" stroke-width="2"/><rect x="45" y="108" width="16" height="32" fill="#7a4b2a"/><rect x="26" y="92" width="14" height="12" fill="#bfe3ff" stroke="#6b4a2b"/>'
    + '<rect x="252" y="92" width="10" height="48" fill="#7a4b2a"/><circle cx="257" cy="80" r="26" fill="#3f9b45"/>'
    + '<path d="M152 140 L156 116 M168 140 L164 116" stroke="#2b3a67" stroke-width="5" stroke-linecap="round"/><rect x="148" y="92" width="24" height="27" rx="5" fill="#e4572e"/>'
    + '<path d="M150 98 L139 114 M170 98 L181 112" stroke="#f1c27d" stroke-width="4.5" stroke-linecap="round"/><circle cx="160" cy="80" r="10.5" fill="#f1c27d"/><path d="M149.5 78 Q150 67 160 67 Q170 67 170.5 78 Q165 72 160 73 Q154 72 149.5 78z" fill="#5a3a1a"/>'
    + '<circle cx="156.3" cy="80" r="1.4" fill="#222"/><circle cx="163.7" cy="80" r="1.4" fill="#222"/><circle cx="156.8" cy="79.5" r="0.45" fill="#fff"/><path d="M156 84.5 Q160 87.5 164 84.5" stroke="#9b3b2b" stroke-width="1" fill="none" stroke-linecap="round"/>';
  const KGR = [
    ['Totale', '0 0 320 180', 'Man sieht den ganzen Ort: Haus, Baum und das Kind ganz klein.', 'zeigt, wo die Szene spielt (Überblick)'],
    ['Halbtotale', '88 62 144 81', 'Man sieht das Kind von Kopf bis Fuß und ein Stück der Umgebung.', 'zeigt eine Person ganz, mit ihrer Bewegung'],
    ['Nahaufnahme', '131 66 58 32.6', 'Man sieht Kopf und Oberkörper.', 'zeigt eine Person beim Sprechen'],
    ['Großaufnahme', '143 67 34 19.125', 'Man sieht nur das Gesicht.', 'zeigt Gefühle im Gesicht'],
    ['Detailaufnahme', '153.5 77.5 6 3.4', 'Man sieht nur einen kleinen Teil: hier ein Auge.', 'lenkt den Blick auf eine Kleinigkeit'],
  ];
  const kBild = (vb) => `<svg viewBox="${vb}" width="320" height="180" preserveAspectRatio="xMidYMid slice" role="img" aria-label="Bildausschnitt" style="max-width:100%;height:auto;border:3px solid #2b2440;border-radius:8px">${KSZENE}</svg>`;
  // Perspektive: Seitenansicht mit Kind und Kamera
  const KAM = (x, y, rot) => `<g transform="translate(${x},${y}) rotate(${rot})"><rect x="-16" y="-10" width="26" height="20" rx="3" fill="#2b2440"/><path d="M10 -6 L22 -12 L22 12 L10 6z" fill="#2b2440"/><circle cx="-6" cy="-14" r="5" fill="#2b2440"/><circle cx="6" cy="-14" r="5" fill="#2b2440"/></g>`;
  const KP = [
    ['Vogelperspektive', 'von oben', [60, 30, 38], 'Die Figur wirkt <b>klein</b> und schwach, man hat einen guten Überblick.'],
    ['Froschperspektive', 'von unten', [62, 146, -38], 'Die Figur wirkt <b>groß</b>, stark oder sogar bedrohlich.'],
    ['Normalsicht', 'auf Augenhöhe', [50, 82, 0], 'Wir sehen die Figur wie im Alltag, auf gleicher Höhe.'],
  ];
  const kpBild = (p) => `<svg viewBox="0 0 320 180" role="img" aria-label="Kamera und Kind" style="max-width:100%;height:auto"><rect x="0" y="0" width="320" height="180" fill="#eef5ff"/><rect x="0" y="160" width="320" height="20" fill="#8fce79"/>`
    + `<path d="M${p[2][0] + 22 * Math.cos(p[2][2] * Math.PI / 180)} ${p[2][1] + 22 * Math.sin(p[2][2] * Math.PI / 180)} L200 84" stroke="#e4572e" stroke-width="2.5" stroke-dasharray="6 5"/>`
    + `<path d="M193 160 L197 125 M207 160 L203 125" stroke="#2b3a67" stroke-width="6" stroke-linecap="round"/><rect x="188" y="98" width="24" height="30" rx="5" fill="#e4572e"/><circle cx="200" cy="84" r="12" fill="#f1c27d"/>`
    + `${KAM(...p[2])}</svg>`;
  function kamGroesse() {
    const i = R(0, KGR.length - 1), andere = shuffle(KGR.map((_, k) => k).filter((k) => Math.abs(k - i) >= 2)).slice(0, 2), ch = shuffle([i, ...andere]);
    return {
      prompt: 'Welche <b>Einstellungsgröße</b> zeigt das Bild?', figure: kBild(KGR[i][1]), choices: ch.map((k) => KGR[k][0]), correct: ch.indexOf(i),
      hint: 'Wie viel sieht man? Den ganzen Ort (Totale), die ganze Person (Halbtotale), Kopf und Oberkörper (Nah), nur das Gesicht (Groß) oder nur ein kleines Stück (Detail)?',
      solution: `<b>${KGR[i][0]}</b>: ${KGR[i][2]} Sie ${KGR[i][3]}.`,
      ex: { mode: 'bild', art: 'kamGroesse', svg: kBild(KGR[i][1]), s1: 'Wie viel ist im Bild zu sehen?', merk: `<b>${KGR[i][0]}</b>: ${KGR[i][2]}` },
    };
  }
  function kamWozu() {
    const i = R(0, KGR.length - 1), andere = shuffle(KGR.map((_, k) => k).filter((k) => Math.abs(k - i) >= 2)).slice(0, 2), ch = shuffle([i, ...andere]);
    return {
      prompt: `Welche Einstellungsgröße passt? Sie soll <b>${KGR[i][3].replace(/^zeigt/, 'zeigen').replace(/^lenkt/, 'lenken')}</b>.`, choices: ch.map((k) => KGR[k][0]), correct: ch.indexOf(i),
      hint: 'Je näher die Kamera ist, desto weniger Umgebung und desto mehr Gefühl sieht man.',
      solution: `<b>${KGR[i][0]}</b>: ${KGR[i][2]} Sie ${KGR[i][3]}.`,
      ex: { mode: 'bild', art: 'kamWozu', svg: kBild(KGR[i][1]), s1: `Gesucht: ${KGR[i][3]}.`, merk: `<b>${KGR[i][0]}</b>: ${KGR[i][2]}` },
    };
  }
  function kamPersp() {
    const p = pick(KP), ch = KP.map((x) => x[0]);
    return {
      prompt: 'Aus welcher <b>Perspektive</b> filmt die Kamera das Kind?', figure: kpBild(p), choices: ch, correct: ch.indexOf(p[0]),
      hint: 'Schau, wo die Kamera steht: oben (wie ein Vogel), unten (wie ein Frosch) oder auf Augenhöhe?',
      solution: `<b>${p[0]}</b>: Die Kamera filmt ${p[1]}. ${p[3]}`,
      ex: { mode: 'bild', art: 'kamPersp', svg: kpBild(p), s1: 'Wo steht die Kamera?', merk: `<b>${p[0]}</b> (${p[1]}): ${p[3]}` },
    };
  }
  function kamWirkung() {
    const p = pick(KP.slice(0, 2)), ch = shuffle([KP[0][3], KP[1][3]].map((t) => t.replace(/<\/?b>/g, '')));
    const ok = p[3].replace(/<\/?b>/g, '');
    return {
      prompt: `Ein Film zeigt eine Figur in der <b>${p[0]}</b> (${p[1]}). Wie wirkt die Figur?`, choices: ch, correct: ch.indexOf(ok),
      hint: 'Stell dir vor, du schaust von oben auf jemanden herab oder du stehst unten und schaust zu jemandem hoch.',
      solution: `<b>${p[0]}</b>: ${p[3]}`,
      ex: { mode: 'bild', art: 'kamWirkung', svg: kpBild(p), s1: `Die Kamera filmt ${p[1]}.`, merk: `<b>${p[0]}</b>: ${p[3]}` },
    };
  }
  const kamera = () => U.wahl([[32, kamGroesse], [20, kamWozu], [28, kamPersp], [20, kamWirkung]]);

  // ---------- Thema: Erzählen, Beschreiben, Berichten ----------
  const TS = [
    ['E', '*Plötzlich knackte es hinter mir im Gebüsch. Mein *Herz *klopfte bis zum Hals, und ich wagte kaum zu atmen.'],
    ['E', '*„Wo bleibt ihr denn?“, rief Mia *aufgeregt. Da sahen wir es auch: Im Schnee führten *riesige Spuren zum Schuppen.'],
    ['E', 'Endlich stand ich ganz oben auf dem Turm. Meine *Knie *zitterten, aber ich war *stolz wie noch nie.'],
    ['B', 'Am *Montag, dem 3. Mai, stießen um *7:40 *Uhr vor der Schule zwei Radfahrer zusammen. Ein Schüler wurde leicht am Knie verletzt.'],
    ['B', 'Am *Samstag fand in der *Turnhalle das Sportfest statt. *120 Kinder nahmen teil, die Klasse 5b gewann den Staffellauf.'],
    ['B', 'Am *12. *Juni besuchte die Klasse 5a die Feuerwehr. Um *9 *Uhr begann die Führung, sie dauerte zwei Stunden.'],
    ['S', 'Der Rucksack ist *dunkelblau und etwa *40 *Zentimeter hoch. *Vorn befindet sich eine kleine Tasche mit einem roten Reißverschluss.'],
    ['S', '*Zuerst faltet man das Blatt in der Mitte. *Danach knickt man die beiden oberen Ecken zur Mittellinie.'],
    ['S', 'Das Fahrrad hat einen *grünen Rahmen und *schwarze Griffe. *Am *Lenker ist eine silberne Klingel befestigt.'],
  ].map(([typ, roh]) => { const w = roh.split(' '); return { typ, tokens: w.map((x) => x.replace('*', '')), mark: w.map((x, i) => (x[0] === '*' ? i : -1)).filter((i) => i >= 0), text: roh.replace(/\*/g, '') }; });
  const TSNAME = { E: 'Erzählung', B: 'Bericht', S: 'Beschreibung' };
  const TSWARUM = { E: 'Eine <b>Erzählung</b> will unterhalten: Sie ist spannend, zeigt Gefühle und Gedanken und nutzt oft wörtliche Rede.', B: 'Ein <b>Bericht</b> informiert sachlich: Er beantwortet die W-Fragen (Wer? Was? Wann? Wo?), steht im Präteritum und kommt ohne Gefühle aus.', S: 'Eine <b>Beschreibung</b> ist genau und sachlich und steht im Präsens: Sie nennt Farbe, Form und Größe oder die Schritte der Reihe nach.' };
  const TSMERK = { E: ['ist spannend und zeigt Gefühle', 'nutzt oft wörtliche Rede', 'hat Einleitung, Höhepunkt und Schluss'], B: ['beantwortet die W-Fragen: Wer? Was? Wann? Wo?', 'ist sachlich und steht im Präteritum', 'nennt genaue Zeiten und Orte, aber keine Gefühle'], S: ['nennt Farbe, Form und Größe eines Gegenstands', 'steht im Präsens und ist sachlich', 'erklärt Schritt für Schritt, wie etwas geht'] };
  function tsErkennen() {
    const x = pick(TS), a = ['E', 'B', 'S'];
    return { prompt: `Welche Textsorte ist das?<br><span class="bsp text">${x.text}</span>`, choices: a.map((k) => TSNAME[k]), correct: a.indexOf(x.typ), hint: 'Will der Text <b>unterhalten</b> (spannend, mit Gefühlen), sachlich über ein Ereignis <b>informieren</b> (wann, wo, wer) oder etwas <b>genau beschreiben</b>?', solution: `Das ist ${x.typ === 'B' ? 'ein' : 'eine'} <b>${TSNAME[x.typ]}</b>. Daran erkennst du es: ${x.mark.map((i) => x.tokens[i].replace(/^[„“]+|[.,:„“?!]+$/g, '')).filter(Boolean).join(', ')}.<br>${TSWARUM[x.typ]}`,
      ex: { mode: 'marken', art: 'tsErkennen', tokens: x.tokens, correct: x.mark, was: 'Erkennungswörter', klein: true, s1: TSWARUM[x.typ], merk: `<b>${TSNAME[x.typ]}</b>. ${TSWARUM[x.typ]}` } };
  }
  function tsMerkmal() {
    const a = ['E', 'B', 'S'], typ = pick(a), m = pick(TSMERK[typ]);
    return { prompt: `Zu welcher Textsorte passt das?<br><span class="bsp">Dieser Text ${m}.</span>`, choices: a.map((k) => TSNAME[k]), correct: a.indexOf(typ), hint: 'Erzählung: unterhalten. Bericht: sachlich informieren, was passiert ist. Beschreibung: genau zeigen, wie etwas aussieht oder geht.', solution: `<b>${TSNAME[typ]}</b><br>${TSWARUM[typ]}`,
      ex: { mode: 'liste', art: 'tsMerkmal', woerter: [TSNAME[typ], ...TSMERK[typ]], stamm: '', raus: -1, hell: 0, klein: true, s1: `Typisch für ${typ === 'B' ? 'den Bericht' : 'die ' + TSNAME[typ]}:`, merk: `<b>${TSNAME[typ]}</b>: ${m}` } };
  }
  const ABLAUF = [['einen Brief verschicken', ['den Brief schreiben', 'den Brief in den Umschlag stecken', 'den Umschlag in den Briefkasten werfen']], ['Zähne putzen', ['Zahnpasta auf die Bürste geben', 'die Zähne gründlich putzen', 'den Mund ausspülen']], ['einen Kuchen backen', ['den Teig rühren', 'den Teig in die Form füllen', 'die Form in den Ofen schieben']], ['eine Blume pflanzen', ['ein Loch graben', 'die Pflanze einsetzen', 'die Pflanze angießen']], ['einen Fahrradreifen flicken', ['das Loch suchen', 'den Flicken aufkleben', 'den Reifen aufpumpen']]];
  function tsReihe() {
    const [was, schritte] = pick(ABLAUF), k = R(0, 2), w = shuffle(schritte);
    const wort = ['zuerst', 'danach', 'zum Schluss'][k];
    return { prompt: `Du beschreibst, wie man ${was} kann. Welcher Schritt kommt <b>${wort}</b>?`, choices: w.map(gross), correct: w.indexOf(schritte[k]), hint: 'Stell dir vor, du machst es wirklich. Was geht nur, wenn etwas anderes schon erledigt ist?', solution: `Zuerst: ${schritte[0]}. Danach: ${schritte[1]}. Zum Schluss: ${schritte[2]}.<br>Bei einer Vorgangsbeschreibung muss die <b>Reihenfolge</b> stimmen. Wörter wie zuerst, danach, zum Schluss helfen.`,
      ex: { mode: 'liste', art: 'tsReihe', woerter: schritte.map((s, i) => `${i + 1}. ${s}`), stamm: '', raus: -1, hell: k, klein: true, s1: 'Eine Vorgangsbeschreibung nennt die Schritte der Reihe nach.', merk: `${gross(wort)}: <b>${schritte[k]}</b>` } };
  }
  const WFR = [['Am Montag, dem 3. Mai, stießen um 7:40 Uhr vor der Schule zwei Radfahrer zusammen.', [['um 7:40 Uhr', 'Wann?'], ['vor der Schule', 'Wo?'], ['zwei Radfahrer', 'Wer?']]], ['Am Samstag gewann die Klasse 5b in der Turnhalle den Staffellauf.', [['Am Samstag', 'Wann?'], ['in der Turnhalle', 'Wo?'], ['die Klasse 5b', 'Wer?']]], ['Am 12. Juni besuchte die Klasse 5a die Feuerwehr in der Bergstraße.', [['Am 12. Juni', 'Wann?'], ['in der Bergstraße', 'Wo?'], ['die Klasse 5a', 'Wer?']]]];
  function tsWFrage() {
    const [satz_, teile] = pick(WFR), [teil, frage] = pick(teile), f = ['Wer?', 'Wann?', 'Wo?', 'Warum?'];
    const tok = satz_.split(' '), tt = teil.split(' ');
    const start = tok.findIndex((_, i) => tt.every((w, k) => (tok[i + k] || '').replace(/[.,]/g, '') === w.replace(/[.,]/g, '')));
    return { prompt: `Welche W-Frage beantwortet der markierte Teil?<br><span class="bsp text">${satz_.replace(teil, `<u>${teil}</u>`)}</span>`, choices: f, correct: f.indexOf(frage), hint: 'Stelle die Frage und antworte mit dem markierten Teil. Passt das?', solution: `<b>${frage}</b> → ${teil}.<br>${TSWARUM.B}`,
      ex: { mode: 'marken', art: 'tsWFrage', tokens: tok, correct: tt.map((_, k) => start + k), was: frage, klein: true, s1: 'Ein Bericht beantwortet die W-Fragen: Wer? Was? Wann? Wo?', merk: `<b>${frage}</b> → ${teil}` } };
  }
  const textsorten = () => U.wahl([[36, tsErkennen], [24, tsMerkmal], [20, tsReihe], [20, tsWFrage]]);

  // ---------- Thema: Sachtexte, Tabellen und Schaubilder ----------
  // [Überschrift, Text, Fragen: [Frage, richtige Antwort, zwei falsche, Belegsatz-Nummer]]
  const SACH = [
    ['Der Dachs', ['Der Dachs lebt in Wäldern und baut unter der Erde große Höhlen, die man Bau nennt.', 'Tagsüber schläft er, erst in der Dämmerung geht er auf Futtersuche.', 'Er frisst Regenwürmer, Käfer, Beeren und Wurzeln.', 'Im Winter hält er Winterruhe und zehrt von seinem Fettpolster.'],
      [['Wann geht der Dachs auf Futtersuche?', 'in der Dämmerung', ['am Mittag', 'nur im Winter'], 1], ['Wie nennt man die Höhle des Dachses?', 'Bau', ['Nest', 'Stall'], 0], ['Was frisst der Dachs laut Text <b>nicht</b>?', 'Fische', ['Regenwürmer', 'Beeren'], 2], ['Wovon lebt der Dachs im Winter?', 'von seinem Fettpolster', ['von Vorräten im Bau', 'von Fischen'], 3]],
      ['Der Dachs, ein heimlicher Waldbewohner', 'Tiere im Zoo', 'Wie man Höhlen baut']],
    ['Die Elbe', ['Die Elbe entspringt im Riesengebirge in Tschechien.', 'Sie fließt durch Dresden, Magdeburg und Hamburg und mündet in die Nordsee.', 'Der Fluss ist etwa 1100 Kilometer lang.', 'In Dresden fahren auf der Elbe alte Raddampfer mit Ausflugsgästen.'],
      [['Wo entspringt die Elbe?', 'im Riesengebirge', ['in der Nordsee', 'in Hamburg'], 0], ['In welches Meer mündet die Elbe?', 'in die Nordsee', ['in die Ostsee', 'ins Mittelmeer'], 1], ['Wie lang ist die Elbe ungefähr?', '1100 Kilometer', ['110 Kilometer', '11 000 Kilometer'], 2], ['Welche Schiffe nennt der Text?', 'Raddampfer', ['Segelschiffe', 'Fischerboote'], 3]],
      ['Die Elbe: von der Quelle bis zum Meer', 'Urlaub an der Nordsee', 'Die Geschichte der Dampfmaschine']],
    ['Honigbienen', ['Honigbienen leben in einem Volk mit vielen tausend Tieren zusammen.', 'Die Arbeiterinnen sammeln Nektar und Blütenstaub.', 'Dabei bestäuben sie die Blüten, sodass Früchte wachsen können.', 'Aus dem Nektar machen die Bienen Honig, ihren Vorrat für den Winter.'],
      [['Wer sammelt Nektar und Blütenstaub?', 'die Arbeiterinnen', ['die Königin', 'der Imker'], 1], ['Wozu brauchen die Bienen den Honig?', 'als Vorrat für den Winter', ['als Futter für Vögel', 'zum Bauen der Waben'], 3], ['Was geschieht beim Sammeln mit den Blüten?', 'Sie werden bestäubt.', ['Sie welken sofort.', 'Sie werden gefressen.'], 2], ['Wie leben Honigbienen?', 'in einem großen Volk', ['allein', 'zu zweit'], 0]],
      ['Fleißige Bienen und ihr Honig', 'Gefährliche Insekten', 'Blumen im Garten']],
    ['Papier', ['Papier wird aus Holzfasern hergestellt.', 'Dazu wird Holz zerkleinert und mit Wasser zu einem Brei verrührt.', 'Der Brei wird auf einem Sieb verteilt, gepresst und getrocknet.', 'Aus Altpapier kann man neues Papier machen, das spart Holz und Wasser.'],
      [['Woraus wird Papier laut Text hergestellt?', 'aus Holzfasern', ['aus Sand', 'aus Wolle'], 0], ['Was geschieht mit dem Holz zuerst?', 'Es wird zerkleinert.', ['Es wird gepresst.', 'Es wird getrocknet.'], 1], ['Warum ist es gut, Altpapier zu sammeln?', 'Das spart Holz und Wasser.', ['Das Papier wird bunter.', 'Das Papier hält länger.'], 3], ['Worauf wird der Brei verteilt?', 'auf einem Sieb', ['auf einem Tisch', 'in einer Flasche'], 2]],
      ['Wie Papier entsteht', 'Bäume im Herbst', 'Warum Bücher teuer sind']],
  ].map(([titel, saetze, fragen, ueber]) => ({ titel, saetze, fragen, ueber }));
  const sachBox = (t) => `<span class="bsp text">${t.saetze.join(' ')}</span>`;
  function sachFrage() {
    const t = pick(SACH), [frage, ok, falsch, beleg] = pick(t.fragen), w = shuffle([ok, ...falsch]);
    const tok = t.saetze[beleg].split(' ');
    return { prompt: `${sachBox(t)}${frage}`, choices: w, correct: w.indexOf(ok), hint: 'Lies den Text noch einmal langsam. Suche den Satz, in dem die Antwort steht.', solution: `<b>${ok}</b><br>Das steht hier: „${t.saetze[beleg]}“`,
      ex: { mode: 'marken', art: 'sachFrage', tokens: tok, correct: [], was: 'Antwort', klein: true, s1: 'Suche im Text den Satz, der zur Frage passt.', merk: `„${t.saetze[beleg]}“<br>Antwort: <b>${ok}</b>` } };
  }
  function sachTitel() {
    const t = pick(SACH), w = shuffle(t.ueber);
    return { prompt: `${sachBox(t)}Welche <b>Überschrift</b> passt am besten?`, choices: w, correct: w.indexOf(t.ueber[0]), hint: 'Worum geht es in <b>allen</b> Sätzen? Die Überschrift nennt das Thema des ganzen Textes.', solution: `<b>${t.ueber[0]}</b><br>Die Überschrift fasst zusammen, worum es im ganzen Text geht.`,
      ex: { mode: 'liste', art: 'sachTitel', woerter: w, stamm: '', raus: -1, hell: w.indexOf(t.ueber[0]), klein: true, s1: 'Die Überschrift nennt das Thema des ganzen Textes.', merk: `<b>${t.ueber[0]}</b>` } };
  }
  // Tabellen und Schaubilder: Umfragen mit erfundenen Zahlen
  const UMFR = [['Lieblingstiere der Klasse 5a', ['Hund', 'Katze', 'Pferd', 'Hase'], 'Tier'], ['So kommen die Kinder zur Schule', ['zu Fuß', 'Fahrrad', 'Bus', 'Auto'], 'Schulweg'], ['Lieblingssport der Klasse 5b', ['Fußball', 'Schwimmen', 'Turnen', 'Tanzen'], 'Sport'], ['Lieblingsobst der Klasse 5c', ['Apfel', 'Banane', 'Erdbeere', 'Kirsche'], 'Obst']];
  function umfrage() { const [titel, namen, kopf] = pick(UMFR); const werte = shuffle([2, 3, 4, 5, 6, 7, 8, 9, 10, 11]).slice(0, 4); return { titel, namen, kopf, werte }; }
  const tabelle = (u) => `<span class="bsp"><b>${u.titel}</b><table class="tbl"><tr><th>${u.kopf}</th>${u.namen.map((n) => `<td>${n}</td>`).join('')}</tr><tr><th>Kinder</th>${u.werte.map((v) => `<td>${v}</td>`).join('')}</tr></table></span>`;
  function schaubild(u) {
    const h = 96, top = 8, y = (v) => top + h - (v / 12) * h;
    let g = '';
    for (let v = 0; v <= 12; v++) g += `<line x1="26" y1="${y(v)}" x2="296" y2="${y(v)}" stroke="${v % 2 ? '#ebe6da' : '#cfc8ba'}" stroke-width="1"/>${v % 2 ? '' : `<text x="20" y="${y(v) + 4}" text-anchor="end" font-size="10" font-weight="700" fill="#6b6680">${v}</text>`}`;
    u.namen.forEach((n, i) => { const x = 44 + i * 64; g += `<rect x="${x}" y="${y(u.werte[i])}" width="34" height="${(u.werte[i] / 12) * h}" rx="3" fill="#3d7bff" stroke="#1d1b2e" stroke-width="1.5"/><text x="${x + 17}" y="${top + h + 15}" text-anchor="middle" font-size="11" font-weight="800" fill="#1d1b2e">${n}</text>`; });
    return `<span class="bsp"><b>${u.titel}</b><svg viewBox="0 0 300 126" width="100%" role="img" aria-label="Schaubild">${g}</svg></span>`;
  }
  function datenAufgabe(art, zeig) {
    const u = umfrage(), k = R(0, 3), typ = pick(zeig === schaubild ? ['max', 'min', 'wert', 'mehr'] : ['max', 'min', 'wert', 'summe', 'mehr']);
    const exB = (idx, merk) => ({ mode: 'balken', art, namen: u.namen, werte: u.werte, idx, merk });
    const tipp = zeig === schaubild ? 'Jeder Balken gehört zu einem Namen. Seine Höhe liest du links an den Zahlen ab. Jede Linie ist ein Kind mehr, beschriftet ist jede zweite.' : 'Suche die Spalte mit dem passenden Namen. Die Zahl darunter gehört dazu.';
    if (typ === 'max' || typ === 'min') {
      const ziel = typ === 'max' ? Math.max(...u.werte) : Math.min(...u.werte), i = u.werte.indexOf(ziel);
      return { prompt: `${zeig(u)}Was wurde am <b>${typ === 'max' ? 'häufigsten' : 'seltensten'}</b> genannt?`, choices: u.namen, correct: i, hint: tipp, solution: `<b>${u.namen[i]}</b> mit ${ziel} Kindern. Das ist der ${typ === 'max' ? 'größte' : 'kleinste'} Wert.`, ex: exB([i], `<b>${u.namen[i]}</b>: ${ziel} Kinder, der ${typ === 'max' ? 'größte' : 'kleinste'} Wert.`) };
    }
    if (typ === 'wert') return { prompt: `${zeig(u)}Wie viele Kinder nannten <b>${u.namen[k]}</b>?`, fields: [{ answer: u.werte[k], label: 'Anzahl', suffix: 'Kinder' }], hint: tipp, solution: `<b>${u.werte[k]}</b> Kinder nannten ${u.namen[k]}.`, ex: exB([k], `${u.namen[k]}: <b>${u.werte[k]}</b> Kinder`) };
    if (typ === 'summe') { const sum = u.werte.reduce((a, b) => a + b, 0); return { prompt: `${zeig(u)}Wie viele Kinder wurden <b>insgesamt</b> befragt?`, fields: [{ answer: sum, label: 'Anzahl', suffix: 'Kinder' }], hint: 'Zähle alle vier Zahlen zusammen.', solution: `${u.werte.join(' + ')} = <b>${sum}</b> Kinder.`, ex: exB([0, 1, 2, 3], `${u.werte.join(' + ')} = <b>${sum}</b> Kinder`) }; }
    const a = u.werte.indexOf(Math.max(...u.werte)), b = u.werte.indexOf(Math.min(...u.werte)), d = u.werte[a] - u.werte[b];
    return { prompt: `${zeig(u)}Wie viele Kinder <b>mehr</b> nannten ${u.namen[a]} als ${u.namen[b]}?`, fields: [{ answer: d, label: 'Unterschied', suffix: 'Kinder' }], hint: 'Lies beide Zahlen ab und rechne den Unterschied aus.', solution: `${u.werte[a]} − ${u.werte[b]} = <b>${d}</b> Kinder.`, ex: exB([a, b], `${u.namen[a]} ${u.werte[a]}, ${u.namen[b]} ${u.werte[b]}: Unterschied <b>${d}</b>`) };
  }
  const sachTabelle = () => datenAufgabe('sachTabelle', tabelle);
  const sachBild = () => datenAufgabe('sachBild', schaubild);
  const sachtext = () => U.wahl([[34, sachFrage], [14, sachTitel], [26, sachTabelle], [26, sachBild]]);

  D.daten = { LANG, KURZ, AUSL, UML, SL, SILB, V, SUBJ, HILF, ZEITEN, ZNAME, ZDEUTSCH, satz, text, bauplan, subjFuer, praesens, praeteritum,
    N, GENUS, substSatz, markSatz, WA, WAPL, WAPROBE, ROLLE, RFRAGE, FAELLE, FNAME, FFRAGE, ARTIKEL, pluralBau, pluralSatz, gruppe, fallSatz };
  D.arten = { // für Tests
    'd5-substantive': { artikelWahl, mehrzahl, einzahl, einOderMehr, substAntippen },
    'd5-faelle': { fallBestimmen, fallArtikel, fallBilden, fallAntippen },
    'd5-pronomen': { pronWahl, pronTippen, possessiv, pronBezug, pronAntippen },
    'd5-adjektive': { adjKomp, adjSup, adjStufe, adjSatz, alsWie },
    'd5-verbformen': { persForm, persWahl, partizip, imperativ, formArt },
    'd5-wortarten': { waBestimmen, waAntippen, waWort },
    'd5-satzglieder': { sgTrennen, sgZaehlen, sgUmstellen },
    'd5-subjekt': { spAntippen, spBestimmen, kongruenz },
    'd5-objekte': { objAntippen, objBestimmen, objFrage },
    'd5-attribute': { attrAntippen, attrWeglassen, attrBezug },
    'd5-nebensatz': { nsVerb, nsBau, hsOderNs },
    'd5-satzarten': { sartBestimmen, sartWelcher, sartZeichen, sartVerb },
    'd5-komma': { kommaAufz, kommaWahl, kommaGef, kommaAppo },
    'd5-rede': { redeRichtig, redeZeichen, redeTeil },
    'd5-lang': { langLuecke, langArt, langTippen },
    'd5-kurz': { kurzLuecke, kurzLang, kurzTippen, kurzWarum },
    'd5-ableiten': { auslLuecke, umlLuecke, verlaengern, auslTippen, stamm_ },
    'd5-slaute': { slLuecke, slRegel, slTippen },
    'd5-gross': { grossAntippen, grossWort, grossVerb, grossWelches, grossAnrede },
    'd5-silben': { silbTrennen, silbZahl, silbWahl, silbTippen, silbH, silbOffen },
    'd5-zusammen': { zusArtikel, zusBauen, zusBedeutung, zusTrennen },
    'd5-ableitung': { vorsilbe, nachWortart, nachBauen, nachWahl },
    'd5-wortfamilie': { famNicht, famDazu, famStamm },
    'd5-wortfeld': { feldTreffend, feldNicht, feldWelches, feldStark },
    'd5-maerchen': { msErkennen, msMerkmal, msFest },
    'd5-gedicht': { gedSchema, gedReimwort, gedFest, gedZaehlen, gedMetrum },
    'd5-bilder': { bildSinn, bildArt, bildWort },
    'd5-textsorten': { tsErkennen, tsMerkmal, tsReihe, tsWFrage },
    'd5-sachtext': { sachFrage, sachTitel, sachTabelle, sachBild },
    'd5-zeitformen': { erkennen, einsetzen, bilden, antippen, hilfsverb, grundform, welcherSatz },
    'd5-praep': { prAntippen, prFall, prWechsel, prPasst },
    'd5-adverb': { advAntippen, advFrage, advLuecke, advOderAdj },
    'd5-adverbial': { abBestimmen, abAntippen, abFrage },
    'd5-satzreihe': { begSatz, begWort, reiheKomma, reiheOderGefuege },
    'd5-theater': { thRegie, thMonoDia, thFest, thMgs },
    'd5-konj': { kjAntippen, kjLuecke, kjWortart, kjArt },
    'd5-kamera': { kamGroesse, kamWozu, kamPersp, kamWirkung },
  };

  // =====================================================
  // Lernbereiche Klasse 5 (Themenplan: faecher/deutsch/themenplan.md)
  // =====================================================
  D.grades = D.grades || {};
  D.grades[5] = {
    lbs: [
      { id: 'd5-wortarten', nr: 1, title: 'Wortarten', topics: [
        { id: 'd5-substantive', title: 'Nomen: Geschlecht und Mehrzahl', icon: '🏷', gen: substantive },
        { id: 'd5-faelle', title: 'Die vier Fälle', icon: '❓', gen: faelle },
        { id: 'd5-pronomen', title: 'Pronomen', icon: '👉', gen: pronomen },
        { id: 'd5-adjektive', title: 'Adjektive steigern', icon: '📶', gen: adjektive },
        { id: 'd5-praep', title: 'Präpositionen: auf, unter, mit …', icon: '📍', gen: praepositionen },
        { id: 'd5-adverb', title: 'Adverbien: heute, dort, gern …', icon: '🕰', gen: adverbien },
        { id: 'd5-konj', title: 'Konjunktionen: und, aber, weil …', icon: '🔗', gen: konjunktionen },
        { id: 'd5-verbformen', title: 'Verbformen: Person, Partizip, Aufforderung', icon: '🧩', gen: verbformen },
        { id: 'd5-zeitformen', title: 'Zeitformen', icon: '⏳', gen: zeitformen },
        { id: 'd5-wortarten', title: 'Wortarten erkennen', icon: '🔎', gen: wortarten },
      ] },
      { id: 'd5-satz', nr: 2, title: 'Satzbau und Satzzeichen', topics: [
        { id: 'd5-satzglieder', title: 'Satzglieder und Umstellprobe', icon: '🚃', gen: satzglieder },
        { id: 'd5-subjekt', title: 'Subjekt und Prädikat', icon: '👤', gen: subjektPraedikat },
        { id: 'd5-objekte', title: 'Dativ- und Akkusativobjekt', icon: '🎁', gen: objekte },
        { id: 'd5-adverbial', title: 'Adverbiale Bestimmungen: wann, wo, wie, warum', icon: '🧭', gen: adverbiale },
        { id: 'd5-attribute', title: 'Attribute', icon: '🎨', gen: attribute },
        { id: 'd5-nebensatz', title: 'Hauptsatz und Nebensatz', icon: '🔗', gen: nebensatz },
        { id: 'd5-satzreihe', title: 'Satzreihe: aber, denn – und weil, da', icon: '⛓', gen: satzreihe },
        { id: 'd5-satzarten', title: 'Satzarten und Satzschlusszeichen', icon: '❔', gen: satzarten },
        { id: 'd5-komma', title: 'Komma: Aufzählung, Satzgefüge, Apposition', icon: '❜', gen: komma },
        { id: 'd5-rede', title: 'Wörtliche Rede', icon: '💬', gen: rede },
      ] },
      { id: 'd5-recht', nr: 3, title: 'Rechtschreibung', topics: [
        { id: 'd5-lang', title: 'Lange Vokale', icon: '➖', gen: langeVokale },
        { id: 'd5-kurz', title: 'Kurze Vokale und Doppelkonsonanten', icon: '✌', gen: kurzeVokale },
        { id: 'd5-ableiten', title: 'Verlängern und Ableiten', icon: '🔧', gen: ableiten },
        { id: 'd5-slaute', title: 's-Laute: s, ss, ß', icon: 'ß', gen: sLaute },
        { id: 'd5-gross', title: 'Groß- und Kleinschreibung', icon: 'Aa', gen: grossKlein },
        { id: 'd5-silben', title: 'Silben und Worttrennung', icon: '✂', gen: silben },
      ] },
      { id: 'd5-wort', nr: 4, title: 'Wörter bauen und Wortschatz', topics: [
        { id: 'd5-zusammen', title: 'Zusammengesetzte Wörter', icon: '🧩', gen: zusammen },
        { id: 'd5-ableitung', title: 'Vorsilben und Nachsilben', icon: '➕', gen: ableitung },
        { id: 'd5-wortfamilie', title: 'Wortfamilien', icon: '🌳', gen: wortfamilie },
        { id: 'd5-wortfeld', title: 'Wortfelder', icon: '☁', gen: wortfeld },
      ] },
      { id: 'd5-text', nr: 5, title: 'Texte und Medien verstehen', topics: [
        { id: 'd5-maerchen', title: 'Märchen und Sage', icon: '👑', gen: maerchen },
        { id: 'd5-gedicht', title: 'Gedichte: Vers, Strophe, Reim, Versmaß', icon: '🎵', gen: gedicht },
        { id: 'd5-bilder', title: 'Sprachliche Bilder', icon: '🖼', gen: bilder },
        { id: 'd5-textsorten', title: 'Erzählen, Beschreiben, Berichten', icon: '📝', gen: textsorten },
        { id: 'd5-sachtext', title: 'Sachtexte, Tabellen, Schaubilder', icon: '📊', gen: sachtext },
        { id: 'd5-theater', title: 'Theaterszenen: Dialog, Monolog, Regieanweisung', icon: '🎭', gen: theater },
        { id: 'd5-kamera', title: 'Film: Einstellungsgrößen und Perspektiven', icon: '🎥', gen: kamera },
      ] },
    ],
  };
})();
