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
  // Substantive (für Geschlecht, Mehrzahl, die vier Fälle)
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
  // Wortgruppe „Artikel + Substantiv“ im Fall f (0 Nominativ … 3 Akkusativ); gibt alle richtigen Schreibweisen zurück
  function gruppe(n, f, plural) {
    if (plural) { const w = f === 2 && !/[ns]$/.test(n.pl) ? n.pl + 'n' : n.pl; return [`${ARTIKEL.pl[f]} ${w}`]; }
    const a = ARTIKEL[n.art][f];
    return f === 1 ? n.gen.map((g) => `${a} ${g}`) : [`${a} ${n.sg}`];
  }

  // ---------- Thema: Substantive – Geschlecht und Mehrzahl ----------
  const EXN = (n, mode) => ({ mode, art: n.art, sg: n.sg, pl: n.pl });
  function artikelWahl() {
    const n = pick(N);
    return {
      prompt: `Welcher Artikel gehört zu <b>${n.sg}</b>?`,
      choices: ['der', 'die', 'das'], correct: ['der', 'die', 'das'].indexOf(n.art),
      hint: 'Sprich das Wort mit allen drei Artikeln. Was klingt richtig? Ein paar Endungen helfen: <b>-ung, -heit, -keit, -in</b> → die, <b>-chen</b> → das.',
      solution: `<b>${n.art} ${n.sg}</b>: Das Substantiv ist ${GENUS[n.art]}. Das Geschlecht (Genus) lernt man am besten gleich mit dem Wort.`,
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
  // Sätze zum Antippen: Substantive sind mit * markiert
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
      prompt: 'Tippe <b>alle Substantive</b> an.',
      tap: { tokens, correct }, answerText: liste.join(', '),
      hint: 'Substantive schreibt man <b>groß</b>, und man kann einen Artikel davorsetzen (der, die, das). Vorsicht: Das erste Wort im Satz ist immer groß.',
      solution: `Substantive: <b>${liste.join(', ')}</b>.${correct[0] === 0 ? '' : ` „${tokens[0]}“ ist nur groß, weil es am Satzanfang steht.`} Probe: Vor ein Substantiv passt ein Artikel.`,
      ex: { mode: 'satz', tokens, correct },
    };
  }
  const substantive = () => U.wahl([[28, artikelWahl], [34, mehrzahl], [16, einzahl], [10, einOderMehr], [12, substAntippen]]);

  // ---------- Thema: Die vier Fälle ----------
  // Satzmuster je Fall: vor = Text vor der Wortgruppe, nach = Text danach, q = Frage, typ = für welche Substantive (P, T, D)
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
      solution: `${fallLoesung(s)}${s.fall === 'genitiv' && !s.plural && s.n.art !== 'die' ? '<br>Im Genitiv bekommen männliche und sächliche Substantive ein <b>-s</b> oder <b>-es</b>.' : ''}${s.fall === 'dativ' && s.plural && s.formen[0].split(' ')[1] !== s.n.pl ? '<br>Im Dativ der Mehrzahl kommt ein <b>-n</b> ans Wort.' : ''}`,
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

  D.daten = { V, SUBJ, HILF, ZEITEN, ZNAME, ZDEUTSCH, satz, text, bauplan, subjFuer, praesens, praeteritum,
    N, GENUS, substSatz, FAELLE, FNAME, FFRAGE, ARTIKEL, pluralBau, pluralSatz, gruppe, fallSatz };
  D.arten = { // für Tests
    'd5-substantive': { artikelWahl, mehrzahl, einzahl, einOderMehr, substAntippen },
    'd5-faelle': { fallBestimmen, fallArtikel, fallBilden, fallAntippen },
    'd5-zeitformen': { erkennen, einsetzen, bilden, antippen, hilfsverb, grundform, welcherSatz },
  };

  // =====================================================
  // Lernbereiche Klasse 5 (Themenplan: faecher/deutsch/themenplan.md)
  // =====================================================
  D.grades = D.grades || {};
  D.grades[5] = {
    lbs: [
      { id: 'd5-wortarten', nr: 1, title: 'Wortarten', topics: [
        { id: 'd5-substantive', title: 'Substantive: Geschlecht und Mehrzahl', icon: '🏷', gen: substantive },
        { id: 'd5-faelle', title: 'Die vier Fälle', icon: '❓', gen: faelle },
        { id: 'd5-zeitformen', title: 'Zeitformen', icon: '⏳', gen: zeitformen },
      ] },
    ],
  };
})();
