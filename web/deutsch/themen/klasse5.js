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
      `Für welches Substantiv soll das Pronomen stehen? <b>${r.s.teile[r.s.idx]}</b>: ${r.s.plural ? 'Mehrzahl' : GENUS[r.s.n.art]}, ${FNAME[r.s.fall]}.`,
      `Das Pronomen muss in Geschlecht, Zahl und Fall passen: <b>${r.p}</b>.`,
      `<b>${r.s.teile[r.s.idx]}</b> → <b>${r.p}</b><br>${r.neuT.join(' ')}.`);
  }
  const pronLoesung = (r) => `${fallText(r.s, (t) => `<u>${t}</u>`)}<br>→ ${r.neuT.map((t, i) => (i === r.s.idx ? `<b class="vb">${t}</b>` : t)).join(' ')}.<br>„${r.s.teile[r.s.idx]}“: ${r.s.plural ? 'Mehrzahl' : GENUS[r.s.n.art]}, ${FNAME[r.s.fall]} (${r.s.frage}) → <b>${r.p}</b>.`;
  const TIPP_PRON = 'Ein Personalpronomen steht <b>für</b> ein Substantiv. Es richtet sich nach dem Geschlecht (der → er, die → sie, das → es), nach der Zahl und nach dem Fall (Wem? → ihm, ihr, ihnen · Wen? → ihn, sie, es).';
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
      hint: 'Das Pronomen hat dasselbe Geschlecht wie sein Substantiv: <b>er</b> → der, <b>sie</b> → die, <b>es</b> → das.',
      solution: `<b>${ziel[3]}</b> steht für „<b>${ziel[0]} ${ziel[1]}</b>“, denn ${ziel[3].toLowerCase()} passt nur zu „${ziel[0]}“.<br>${ziel[0] === 'der' ? 'Der' : ziel[0] === 'die' ? 'Die' : 'Das'} ${ziel[1]} ${rest}.`,
      ex: zz('pronBezug', [`${ziel[3]} ${rest}.`], 0, [gross(ziel[0]) + ' ' + ziel[1], ` ${rest}.`], 0, `<b>${ziel[3]}</b>: Welches Substantiv hat dieses Geschlecht?`, `${ziel[3].toLowerCase()} → <b>${ziel[0]}</b>: Das passt nur zu „${ziel[0]} ${ziel[1]}“.`, `<b>${ziel[3]}</b> steht für „<b>${ziel[0]} ${ziel[1]}</b>“.`),
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
  // Jedes Wort trägt seine Wortart: N Substantiv, V Verb, A Adjektiv, D Artikel, P Pronomen, x andere (kommt später)
  const WA = { N: 'Substantiv', V: 'Verb', A: 'Adjektiv', D: 'Artikel', P: 'Pronomen' };
  const WAPL = { N: 'Substantive', V: 'Verben', A: 'Adjektive', D: 'Artikel', P: 'Pronomen' };
  const WAPROBE = {
    N: 'Substantive schreibt man groß, und ein Artikel passt davor.',
    V: 'Verben sagen, was jemand tut oder was geschieht. Sie ändern sich mit der Person (ich …, du …).',
    A: 'Adjektive sagen, wie etwas ist. Man kann sie steigern (klein, kleiner, am kleinsten).',
    D: 'Artikel begleiten ein Substantiv: der, die, das, ein, eine (auch dem, den, des, einen …).',
    P: 'Pronomen stehen für ein Substantiv (ich, er, uns …) oder zeigen, wem etwas gehört (mein, unser …).',
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
      hint: 'Mach die Proben: Passt ein Artikel davor (Substantiv)? Ändert es sich mit der Person (Verb)? Kann man es steigern (Adjektiv)? Begleitet es ein Substantiv (Artikel)? Steht es für ein Substantiv (Pronomen)?',
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

  D.daten = { V, SUBJ, HILF, ZEITEN, ZNAME, ZDEUTSCH, satz, text, bauplan, subjFuer, praesens, praeteritum,
    N, GENUS, substSatz, markSatz, WA, WAPL, WAPROBE, FAELLE, FNAME, FFRAGE, ARTIKEL, pluralBau, pluralSatz, gruppe, fallSatz };
  D.arten = { // für Tests
    'd5-substantive': { artikelWahl, mehrzahl, einzahl, einOderMehr, substAntippen },
    'd5-faelle': { fallBestimmen, fallArtikel, fallBilden, fallAntippen },
    'd5-pronomen': { pronWahl, pronTippen, possessiv, pronBezug, pronAntippen },
    'd5-adjektive': { adjKomp, adjSup, adjStufe, adjSatz, alsWie },
    'd5-verbformen': { persForm, persWahl, partizip, imperativ, formArt },
    'd5-wortarten': { waBestimmen, waAntippen, waWort },
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
        { id: 'd5-pronomen', title: 'Pronomen', icon: '👉', gen: pronomen },
        { id: 'd5-adjektive', title: 'Adjektive steigern', icon: '📶', gen: adjektive },
        { id: 'd5-verbformen', title: 'Verbformen: Person, Partizip, Aufforderung', icon: '🧩', gen: verbformen },
        { id: 'd5-zeitformen', title: 'Zeitformen', icon: '⏳', gen: zeitformen },
        { id: 'd5-wortarten', title: 'Wortarten erkennen', icon: '🔎', gen: wortarten },
      ] },
    ],
  };
})();
