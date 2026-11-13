/* EnDax (Englisch) – Themen und Aufgaben Klasse 5 (Lehrplan Gymnasium Sachsen, Klassenstufen 5/6)
 *
 * Aufbau wie in DeDax: Jeder Generator liefert bei jedem Aufruf eine neue Aufgabe
 *   { prompt, hint, solution, answerText?, ex? } und dazu eine der Antwortformen
 *   choices/correct   Auswahl
 *   fields            Eingabefelder; type:'text' = Wort eintippen (answer: Wort oder Liste erlaubter Wörter)
 *   layout:'satz'     Felder stehen als Lücken in einem Satz (prefix/suffix sind die Satzteile)
 *   tap               Wörter antippen: { tokens:[…], correct:[Index …] }
 * Erklärt wird auf Deutsch, nur die Übungssätze sind englisch. Britische Schreibweise.
 * Alle Sätze sind selbst geschrieben (nichts aus dem Schulbuch) und stehen in festen Listen, damit es zu jedem
 * Satz eine Aufnahme gibt: audio/k5/<slug>.mp3 (erzeugt mit tests/endax_audio.py, Stimme „af_bella“).
 * Regel: Jede Lücke hat genau eine richtige Lösung. Kein falsches Angebot darf einen richtigen Satz ergeben.
 */
(function () {
  const D = (window.EnDax = window.EnDax || {});
  const U = (D.util = D.util || {});
  const R = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
  const pick = (arr) => arr[R(0, arr.length - 1)];
  const shuffle = (arr) => { const a = arr.slice(); for (let i = a.length - 1; i > 0; i--) { const j = R(0, i); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  Object.assign(U, { R, pick, shuffle, fmt: (x) => String(x) });
  U.wahl = (liste) => { let r = Math.random() * liste.reduce((s, x) => s + x[0], 0); for (const [w, f] of liste) { r -= w; if (r <= 0) return f(); } return liste[0][1](); };
  // Dateiname der Aufnahme zu einem englischen Text (gleiche Regel in tests/endax_audio.py)
  U.slug = (t) => String(t).toLowerCase().replace(/[’']/g, '-').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  // Lautsprecher-Knopf: spielt die Aufnahme zu diesem Text (die App sucht sie über data-say)
  U.say = (t) => `<button type="button" class="say" data-say="${U.slug(t)}" aria-label="Anhören: ${String(t).replace(/"/g, '')}">🔊</button>`;
  const en = (t) => `<span class="bsp" lang="en">${t}</span>`;

  // =====================================================
  // to be: am, is, are
  // =====================================================
  // Gruppe: 0 = I (am), 1 = he/she/it (is), 2 = you/we/they (are)
  const FORM = ['am', 'is', 'are'];
  const KURZ = { I: 'I’m', You: 'You’re', He: 'He’s', She: 'She’s', It: 'It’s', We: 'We’re', They: 'They’re' };
  const PRON_DE = { I: 'ich', You: 'du', He: 'er', She: 'sie (eine)', It: 'es', We: 'wir', They: 'sie (mehrere)' };
  const GRUPPE_TEXT = ['Zu <b>I</b> gehört immer <b>am</b>.', 'Bei <b>he, she, it</b> (eine Person oder Sache) steht <b>is</b>.', 'Bei <b>you, we, they</b> (und bei mehreren) steht <b>are</b>.'];
  // [Subjekt, Gruppe, Rest, Deutsch, Pronomen (nur wenn das Subjekt kein Pronomen ist)]
  const BE = [
    ['I', 0, 'ten years old', 'Ich bin zehn Jahre alt.'],
    ['I', 0, 'in the kitchen', 'Ich bin in der Küche.'],
    ['I', 0, 'from Germany', 'Ich bin aus Deutschland.'],
    ['I', 0, 'hungry', 'Ich bin hungrig.'],
    ['You', 2, 'my best friend', 'Du bist mein bester Freund.'],
    ['You', 2, 'late', 'Du bist spät dran.'],
    ['You', 2, 'very funny', 'Du bist sehr lustig.'],
    ['He', 1, 'my brother', 'Er ist mein Bruder.'],
    ['He', 1, 'eleven', 'Er ist elf.'],
    ['He', 1, 'in the garden', 'Er ist im Garten.'],
    ['She', 1, 'my sister', 'Sie ist meine Schwester.'],
    ['She', 1, 'at school', 'Sie ist in der Schule.'],
    ['She', 1, 'a good singer', 'Sie ist eine gute Sängerin.'],
    ['It', 1, 'cold today', 'Es ist heute kalt.'],
    ['It', 1, 'a big dog', 'Es ist ein großer Hund.'],
    ['It', 1, 'on the table', 'Es ist auf dem Tisch.'],
    ['We', 2, 'in the garden', 'Wir sind im Garten.'],
    ['We', 2, 'friends', 'Wir sind Freunde.'],
    ['We', 2, 'in class five', 'Wir sind in Klasse fünf.'],
    ['They', 2, 'at home', 'Sie sind zu Hause.'],
    ['They', 2, 'my parents', 'Sie sind meine Eltern.'],
    ['They', 2, 'very nice', 'Sie sind sehr nett.'],
    ['My mum', 1, 'a teacher', 'Meine Mama ist Lehrerin.', 'she'],
    ['The cat', 1, 'under the bed', 'Die Katze ist unter dem Bett.', 'it'],
    ['Ben', 1, 'my friend', 'Ben ist mein Freund.', 'he'],
    ['The book', 1, 'new', 'Das Buch ist neu.', 'it'],
    ['My room', 1, 'small', 'Mein Zimmer ist klein.', 'it'],
    ['Lisa', 1, 'twelve', 'Lisa ist zwölf.', 'she'],
    ['Tom and Lisa', 2, 'friends', 'Tom und Lisa sind Freunde.', 'they'],
    ['The dogs', 2, 'in the park', 'Die Hunde sind im Park.', 'they'],
    ['My shoes', 2, 'dirty', 'Meine Schuhe sind schmutzig.', 'they'],
    ['The children', 2, 'happy', 'Die Kinder sind glücklich.', 'they'],
    ['My grandparents', 2, 'old', 'Meine Großeltern sind alt.', 'they'],
    ['Ben and I', 2, 'in the same class', 'Ben und ich sind in derselben Klasse.', 'we'],
  ].map(([subj, g, rest, de, pron]) => ({ subj, g, form: FORM[g], rest, de, pron: pron || '', text: `${subj} ${FORM[g]} ${rest}.` }));
  const PRONS = BE.filter((s) => !s.pron);   // Sätze mit Pronomen als Subjekt
  const kurzText = (s) => `${KURZ[s.subj]} ${s.rest}.`;
  const markiert = (s) => `<span lang="en">${s.subj} <b class="vb">${s.form}</b> ${s.rest}.</span>`;
  // Warum diese Form? (ein Satz für Lösungsweg und Animation)
  function warum(s) {
    if (!s.pron) return GRUPPE_TEXT[s.g];
    const viele = s.g === 2;
    return `<b>${s.subj}</b> ${viele ? 'sind mehrere' : 'ist eine Person oder Sache'}: Dafür kannst du <b>${s.pron}</b> sagen. ${viele ? `Bei mehreren steht <b>are</b>.` : `Bei he, she, it steht <b>is</b>.`}`;
  }
  const loesung = (s) => `${markiert(s)} ${U.say(s.text)}<br>${warum(s)}<br><small>Auf Deutsch: ${s.de}</small>`;
  const TIPP = 'Schau auf das <b>erste Wort</b>: Wer ist gemeint? <b>I</b> → am · <b>he, she, it</b> (einer, eine, eins) → is · <b>you, we, they</b> (und mehrere) → are.';
  const EX = (s, mode) => ({ mode: mode || 'form', subj: s.subj, g: s.g, form: s.form, rest: s.rest, pron: s.pron, de: s.de });

  // A: Form auswählen
  function beLuecke() {
    const s = pick(BE);
    return {
      prompt: `Was gehört in die Lücke?${en(`${s.subj} ___ ${s.rest}.`)}`,
      choices: FORM.slice(), correct: s.g,
      hint: TIPP, solution: loesung(s), ex: EX(s),
    };
  }
  // B: Form eintippen
  function beTippen() {
    const s = pick(BE);
    return {
      prompt: 'Setze die richtige Form von <b>to be</b> ein: <b>am</b>, <b>is</b> oder <b>are</b>.',
      layout: 'satz',
      fields: [{ type: 'text', ci: true, answer: s.form, prefix: s.subj, suffix: s.rest + '.', label: 'am, is oder are' }],
      hint: TIPP, solution: loesung(s), ex: EX(s),
    };
  }
  // C: richtigen Satz finden
  function beSatz() {
    const s = pick(BE);
    const saetze = shuffle(FORM.map((f) => `${s.subj} ${f} ${s.rest}.`));
    return {
      prompt: 'Nur ein Satz ist richtig. Welcher?',
      choices: saetze.map((t) => `<span lang="en">${t}</span>`), correct: saetze.indexOf(s.text),
      hint: TIPP, solution: loesung(s), ex: EX(s),
    };
  }
  // D: passendes Pronomen zur Form (nur ein Angebot passt)
  function beWer() {
    const s = pick(PRONS);
    const andere = shuffle(PRONS.filter((x) => x.g !== s.g).map((x) => x.subj).filter((x, i, a) => a.indexOf(x) === i));
    // zwei falsche Angebote aus den anderen Gruppen, möglichst aus beiden
    const f1 = andere[0], f2 = andere.find((x) => PRONS.find((p) => p.subj === x).g !== PRONS.find((p) => p.subj === f1).g) || andere[1];
    const ch = shuffle([s.subj, f1, f2]);
    return {
      prompt: `Wer passt an den Anfang?${en(`___ ${s.form} ${s.rest}.`)}`,
      choices: ch.map((c) => `<span lang="en">${c}</span>`), correct: ch.indexOf(s.subj),
      hint: 'Schau auf die Form von <b>to be</b>: <b>am</b> gibt es nur mit I. <b>is</b> steht bei he, she, it. <b>are</b> steht bei you, we, they.',
      solution: `${markiert(s)} ${U.say(s.text)}<br>${GRUPPE_TEXT[s.g]} Die anderen beiden brauchen eine andere Form.<br><small>Auf Deutsch: ${s.de}</small>`,
      ex: EX(s),
    };
  }
  // E: Kurzform eintippen
  function beKurz() {
    const s = pick(PRONS), k = KURZ[s.subj];
    return {
      prompt: `Schreibe die <b>Kurzform</b> von <b lang="en">${s.subj} ${s.form}</b>.${en(`${s.subj} ${s.form} ${s.rest}.`)}`,
      fields: [{ type: 'text', ci: true, answer: [k, k.replace('’', "'")], label: 'Kurzform' }],
      answerText: k,
      hint: 'Bei der Kurzform rücken die beiden Wörter zusammen. Der <b>erste Buchstabe</b> von am, is oder are fällt weg, an seine Stelle kommt ein <b>Apostroph</b> (’). Beispiel: we are → we’re.',
      solution: `<span lang="en">${s.subj} ${s.form}</span> → <b class="vb" lang="en">${k}</b><br>Das <b>${s.form[0]}</b> von „${s.form}“ fällt weg, dafür steht der Apostroph.<br><span lang="en">${kurzText(s)}</span> ${U.say(kurzText(s))}<br><small>So spricht man meistens. Auf Deutsch: ${s.de}</small>`,
      ex: EX(s, 'kurz'),
    };
  }
  // F: Langform eintippen
  function beLang() {
    const s = pick(PRONS), k = KURZ[s.subj], lang = `${s.subj} ${s.form}`;
    return {
      prompt: `Schreibe die <b>Langform</b> (zwei Wörter) von <b lang="en">${k}</b>.${en(kurzText(s))}`,
      fields: [{ type: 'text', ci: true, answer: lang, label: 'Langform' }],
      hint: 'Der Apostroph (’) zeigt: Hier fehlt ein Buchstabe. Welche Form von to be gehört zu diesem Wort: am, is oder are?',
      solution: `<b class="vb" lang="en">${k}</b> → <span lang="en">${s.subj} <b class="vb">${s.form}</b></span><br>${GRUPPE_TEXT[s.g]}<br>${markiert(s)} ${U.say(s.text)}<br><small>Auf Deutsch: ${s.de}</small>`,
      ex: EX(s, 'lang'),
    };
  }
  // G: vom Deutschen ins Englische (Pronomen + Form)
  function beDeutsch() {
    const s = pick(PRONS);
    const DEFORM = { I: 'ich bin', You: 'du bist', He: 'er ist', She: 'sie ist (eine Person)', It: 'es ist', We: 'wir sind', They: 'sie sind (mehrere)' };
    const richtig = `${s.subj} ${s.form}`;
    const falsch = shuffle(FORM.filter((f) => f !== s.form)).map((f) => `${s.subj} ${f}`);
    const ch = shuffle([richtig, ...falsch]);
    return {
      prompt: `Wie heißt <b>${DEFORM[s.subj]}</b> auf Englisch?`,
      choices: ch.map((c) => `<span lang="en">${c}</span>`), correct: ch.indexOf(richtig),
      hint: `„${PRON_DE[s.subj]}“ heißt <b lang="en">${s.subj === 'I' ? 'I' : s.subj.toLowerCase()}</b>. ${TIPP}`,
      solution: `${DEFORM[s.subj]} = <b class="vb" lang="en">${richtig}</b><br>${GRUPPE_TEXT[s.g]}<br>Ein Beispiel: ${markiert(s)} ${U.say(s.text)}<br><small>Auf Deutsch: ${s.de}</small>`,
      ex: EX(s),
    };
  }
  // H: Form im Satz antippen (mit Anhören)
  function beAntippen() {
    const s = pick(BE);
    const tokens = s.text.split(' ');
    const i = s.subj.split(' ').length;
    return {
      prompt: `Tippe die Form von <b>to be</b> an. ${U.say(s.text)}`,
      tap: { tokens, correct: [i], one: true },
      answerText: s.form,
      hint: 'Die Formen von to be heißen <b>am</b>, <b>is</b> und <b>are</b>. Auf Deutsch: bin, bist, ist, sind, seid.',
      solution: `${loesung(s)}`, ex: EX(s),
    };
  }
  const tobe = () => U.wahl([[22, beLuecke], [22, beTippen], [14, beSatz], [12, beWer], [10, beKurz], [8, beLang], [7, beDeutsch], [5, beAntippen]]);

  // =====================================================
  // Personalpronomen: I, you, he, she, it, we, they
  // =====================================================
  const PRON_ART = { m: 'ein Junge oder Mann', f: 'ein Mädchen oder eine Frau', n: 'eine Sache', p: 'mehrere', w: 'mehrere, und ich bin dabei', y: 'mehrere, und du bist dabei' };
  const PRON_VON = { m: 'He', f: 'She', n: 'It', p: 'They', w: 'We', y: 'You' };
  const PRON_WORT = { I: 'ich', You: 'du oder ihr', He: 'er', She: 'sie (eine)', It: 'es', We: 'wir', They: 'sie (mehrere)' };
  // [Subjekt, Art, Form von to be, Rest, Deutsch]
  const PS = [
    ['Tom', 'm', 'is', 'in the garden', 'Tom ist im Garten.'],
    ['My dad', 'm', 'is', 'a good cook', 'Mein Papa ist ein guter Koch.'],
    ['Mr Brown', 'm', 'is', 'our teacher', 'Herr Brown ist unser Lehrer.'],
    ['My brother', 'm', 'is', 'twelve', 'Mein Bruder ist zwölf.'],
    ['Lisa', 'f', 'is', 'at school', 'Lisa ist in der Schule.'],
    ['My mum', 'f', 'is', 'very nice', 'Meine Mama ist sehr nett.'],
    ['Mrs Green', 'f', 'is', 'from London', 'Frau Green ist aus London.'],
    ['My sister', 'f', 'is', 'in the kitchen', 'Meine Schwester ist in der Küche.'],
    ['The book', 'n', 'is', 'very old', 'Das Buch ist sehr alt.'],
    ['My bike', 'n', 'is', 'new', 'Mein Fahrrad ist neu.'],
    ['The ball', 'n', 'is', 'under the table', 'Der Ball ist unter dem Tisch.'],
    ['Our house', 'n', 'is', 'small', 'Unser Haus ist klein.'],
    ['Tom and Lisa', 'p', 'are', 'at home', 'Tom und Lisa sind zu Hause.'],
    ['The children', 'p', 'are', 'in the park', 'Die Kinder sind im Park.'],
    ['My parents', 'p', 'are', 'at work', 'Meine Eltern sind bei der Arbeit.'],
    ['The books', 'p', 'are', 'on the table', 'Die Bücher sind auf dem Tisch.'],
    ['My shoes', 'p', 'are', 'under the bed', 'Meine Schuhe sind unter dem Bett.'],
    ['Tom and I', 'w', 'are', 'friends', 'Tom und ich sind Freunde.'],
    ['My sister and I', 'w', 'are', 'in the garden', 'Meine Schwester und ich sind im Garten.'],
    ['My friends and I', 'w', 'are', 'at school', 'Meine Freunde und ich sind in der Schule.'],
    ['You and Ben', 'y', 'are', 'late', 'Du und Ben, ihr seid spät dran.'],
    ['You and your sister', 'y', 'are', 'very funny', 'Du und deine Schwester, ihr seid sehr lustig.'],
  ].map(([subj, art, be, rest, de]) => ({ subj, art, be, rest, de, pron: PRON_VON[art], text: `${subj} ${be} ${rest}.`, neu: `${PRON_VON[art]} ${be} ${rest}.` }));
  const ALLE_PRON = ['I', 'You', 'He', 'She', 'It', 'We', 'They'];
  const pronWarum = (s) => `<b>${s.subj}</b>: Das ${s.art === 'm' || s.art === 'f' || s.art === 'n' ? 'ist' : 'sind'} ${PRON_ART[s.art]}. Dafür steht <b lang="en">${s.pron.toLowerCase()}</b>, auf Deutsch: ${PRON_WORT[s.pron]}.`;
  const pronLoesung = (s) => `<span lang="en"><b>${s.subj}</b> ${s.be} ${s.rest}.</span> → <span lang="en"><b class="vb">${s.pron}</b> ${s.be} ${s.rest}.</span> ${U.say(s.neu)}<br>${pronWarum(s)}<br><small>Auf Deutsch: ${s.de}</small>`;
  const PRON_TIPP = 'Frag dich: Wer oder was ist das? <b>Ein</b> Junge oder Mann → he · <b>ein</b> Mädchen oder eine Frau → she · <b>eine</b> Sache → it · <b>mehrere</b> → they · mehrere <b>mit mir</b> → we · mehrere <b>mit dir</b> → you.';
  const PEX = (s, mode) => ({ mode: mode || 'satz', subj: s.subj, art: s.art, be: s.be, rest: s.rest, pron: s.pron, de: s.de });

  // A: Pronomen für das markierte Subjekt auswählen
  function pronWahl() {
    const s = pick(PS);
    const ch = shuffle([s.pron, ...shuffle(ALLE_PRON.filter((x) => x !== s.pron && x !== 'I')).slice(0, 3)]);
    return {
      prompt: `Welches Wort kann für den <b>fett</b> gedruckten Teil stehen?${en(`<b>${s.subj}</b> ${s.be} ${s.rest}.`)}`,
      choices: ch.map((c) => `<span lang="en">${c}</span>`), correct: ch.indexOf(s.pron),
      hint: PRON_TIPP, solution: pronLoesung(s), ex: PEX(s),
    };
  }
  // B: Pronomen eintippen
  function pronTippen() {
    const s = pick(PS);
    return {
      prompt: `Ersetze <b lang="en">${s.subj}</b> durch ein Pronomen (he, she, it, we, you, they).${en(`${s.subj} ${s.be} ${s.rest}.`)}`,
      layout: 'satz',
      fields: [{ type: 'text', ci: true, answer: s.pron, suffix: `${s.be} ${s.rest}.`, label: 'Pronomen' }],
      hint: PRON_TIPP, solution: pronLoesung(s), ex: PEX(s),
    };
  }
  // C: Für wen kann das Pronomen stehen?
  function pronWer() {
    const art = pick(['m', 'f', 'n', 'p', 'w']);
    const s = pick(PS.filter((x) => x.art === art));
    const andere = shuffle(['m', 'f', 'n', 'p', 'w', 'y'].filter((a) => a !== art)).slice(0, 3).map((a) => pick(PS.filter((x) => x.art === a)));
    const ch = shuffle([s, ...andere]);
    return {
      prompt: `Für wen oder was kann <b lang="en">${s.pron.toLowerCase()}</b> stehen?`,
      choices: ch.map((c) => `<span lang="en">${c.subj}</span>`), correct: ch.indexOf(s),
      hint: `<b lang="en">${s.pron.toLowerCase()}</b> heißt auf Deutsch: ${PRON_WORT[s.pron]}. ${PRON_TIPP}`,
      solution: pronLoesung(s), ex: PEX(s),
    };
  }
  // D: Deutsch → Englisch
  const DE_EN = [['ich', 'I'], ['du', 'You'], ['er', 'He'], ['sie (ein Mädchen oder eine Frau)', 'She'], ['es', 'It'], ['wir', 'We'], ['ihr', 'You'], ['sie (mehrere)', 'They']];
  const klein = (p) => (p === 'I' ? 'I' : p.toLowerCase());
  function pronDeutsch() {
    const [de, p] = pick(DE_EN);
    const ch = shuffle([p, ...shuffle(ALLE_PRON.filter((x) => x !== p)).slice(0, 3)]);
    return {
      prompt: `Wie heißt <b>${de}</b> auf Englisch?`,
      choices: ch.map((c) => `<span lang="en">${klein(c)}</span>`), correct: ch.indexOf(p),
      hint: 'Die sieben Wörter heißen: I (ich) · you (du, ihr) · he (er) · she (sie, eine) · it (es) · we (wir) · they (sie, mehrere).',
      solution: `${de} = <b class="vb" lang="en">${klein(p)}</b>${p === 'You' ? '<br>Das englische <b>you</b> heißt beides: du und ihr.' : ''}${p === 'I' ? '<br><b>I</b> schreibt man immer groß.' : ''}`,
      ex: { mode: 'wort', pron: p },
    };
  }
  // E: Englisch → Deutsch
  function pronEnglisch() {
    const p = pick(ALLE_PRON);
    const ch = shuffle([p, ...shuffle(ALLE_PRON.filter((x) => x !== p)).slice(0, 3)]);
    return {
      prompt: `Was bedeutet <b lang="en">${klein(p)}</b>?`,
      choices: ch.map((c) => PRON_WORT[c]), correct: ch.indexOf(p),
      hint: 'Die sieben Wörter heißen: I (ich) · you (du, ihr) · he (er) · she (sie, eine) · it (es) · we (wir) · they (sie, mehrere).',
      solution: `<b class="vb" lang="en">${klein(p)}</b> = ${PRON_WORT[p]}${p === 'You' ? '<br>Das englische <b>you</b> heißt beides: du und ihr.' : ''}`,
      ex: { mode: 'wort', pron: p },
    };
  }
  // F: I schreibt man immer groß
  function pronIch() {
    const s = pick([...BE.filter((x) => x.subj === 'I').map((x) => x.text), ...PS.filter((x) => x.art === 'w').map((x) => x.text), 'Ben and I are in the same class.']);
    const mitI = s.startsWith('I ');
    const falsch = mitI ? [s.replace(/^I /, 'i '), s.replace(/^I am /, 'I Am ')] : [s.replace(' I ', ' i '), s.replace(' I ', ' Me ')];
    const ch = shuffle([s, ...falsch]);
    return {
      prompt: 'Welcher Satz ist richtig geschrieben?',
      choices: ch.map((c) => `<span lang="en">${c}</span>`), correct: ch.indexOf(s),
      hint: 'Achte auf das Wort für „ich“.',
      solution: `<span lang="en">${s.replace(/\bI\b/, '<b class="vb">I</b>')}</span> ${U.say(s)}<br><b>I</b> (ich) schreibt man immer groß, auch mitten im Satz. Alle anderen Pronomen schreibt man klein, außer am Satzanfang.`,
      ex: { mode: 'ich', text: s },
    };
  }
  const pronomen = () => U.wahl([[26, pronWahl], [26, pronTippen], [16, pronWer], [12, pronDeutsch], [12, pronEnglisch], [8, pronIch]]);

  // =====================================================
  // to be: verneinen und fragen
  // =====================================================
  const NEG = { am: ['am not'], is: ['isn’t', 'isn\'t', 'is not'], are: ['aren’t', 'aren\'t', 'are not'] };
  const gross = (t) => t[0].toUpperCase() + t.slice(1);
  const subjKlein = (t) => (/^(My|The|He|She|It|We|They|You)\b/.test(t) ? t[0].toLowerCase() + t.slice(1) : t);
  const negText = (s) => (s.g === 0 ? `I’m not ${s.rest}.` : `${s.subj} ${NEG[s.form][0]} ${s.rest}.`);
  const frageText = (s) => `${gross(s.form)} ${subjKlein(s.subj)} ${s.rest}?`;
  // Fragen: ohne „I“ und ohne Sätze mit „my …“ hinter dem Verb (die Frage klänge seltsam)
  const FQ = BE.filter((s) => s.g !== 0 && !/\bmy\b/.test(s.rest));
  // Kurzantworten: nur he, she, it, they (bei you und we wechselt die Person in der Antwort)
  const pronVon = (s) => s.pron || s.subj.toLowerCase();
  const KA = FQ.filter((s) => ['he', 'she', 'it', 'they'].includes(pronVon(s)));
  const jaText = (s) => `Yes, ${pronVon(s)} ${s.form}.`;
  const neinText = (s) => `No, ${pronVon(s)} ${NEG[s.form][0]}.`;
  const NEG_TIPP = 'Zum Verneinen kommt <b>not</b> hinter am, is oder are: is not, are not, am not. Kurz: <b>isn’t</b>, <b>aren’t</b>. Nur bei I heißt es <b>I’m not</b>.';
  const FRAGE_TIPP = 'Bei der Frage tauschen die ersten beiden Teile die Plätze: Erst kommt <b>Am, Is</b> oder <b>Are</b>, dann die Person.';
  const NEX = (s, mode, ja) => ({ mode, subj: s.subj, g: s.g, form: s.form, rest: s.rest, pron: pronVon(s), ja: !!ja });
  const negLoesung = (s) => (s.g === 0
    ? `<span lang="en">I <b class="vb">am not</b> ${s.rest}.</span><br>Kurz: <span lang="en"><b class="vb">I’m not</b> ${s.rest}.</span> ${U.say(negText(s))}<br><b>not</b> kommt hinter am. „amn’t“ gibt es nicht.`
    : `<span lang="en">${s.subj} <b class="vb">${s.form} not</b> ${s.rest}.</span><br>Kurz: <span lang="en">${s.subj} <b class="vb">${NEG[s.form][0]}</b> ${s.rest}.</span> ${U.say(negText(s))}<br><b>not</b> kommt hinter ${s.form}. Beide Formen sind richtig, beim Sprechen nimmt man meist die kurze.`);

  // A: verneinten Satz auswählen
  function negWahl() {
    const s = pick(BE);
    const richtig = negText(s);
    const falsch = s.g === 0
      ? [`I amn’t ${s.rest}.`, `I not am ${s.rest}.`]
      : [`${s.subj} not ${s.form} ${s.rest}.`, `${s.subj} ${NEG[s.form === 'is' ? 'are' : 'is'][0]} ${s.rest}.`];
    const ch = shuffle([richtig, ...falsch]);
    return {
      prompt: `Verneine den Satz. Welcher Satz ist richtig?${en(s.text)}`,
      choices: ch.map((c) => `<span lang="en">${c}</span>`), correct: ch.indexOf(richtig),
      hint: NEG_TIPP, solution: negLoesung(s), ex: NEX(s, 'neg'),
    };
  }
  // B: verneinte Form eintippen
  function negTippen() {
    const s = pick(BE);
    return {
      prompt: `Verneine den Satz: Setze die <b>verneinte</b> Form von to be ein.${en(s.text)}`,
      layout: 'satz',
      fields: [{ type: 'text', ci: true, answer: NEG[s.form], prefix: s.subj, suffix: s.rest + '.', label: 'verneinte Form' }],
      answerText: s.g === 0 ? 'am not' : `${NEG[s.form][0]} (oder: ${s.form} not)`,
      hint: NEG_TIPP, solution: negLoesung(s), ex: NEX(s, 'neg'),
    };
  }
  const frageLoesung = (s) => `<span lang="en">${s.subj} <b>${s.form}</b> ${s.rest}.</span> → <span lang="en"><b class="vb">${gross(s.form)}</b> ${subjKlein(s.subj)} ${s.rest}?</span> ${U.say(frageText(s))}<br>${FRAGE_TIPP} Am Ende steht ein Fragezeichen.`;
  // C: richtige Frage auswählen
  function frageWahl() {
    const s = pick(FQ);
    const richtig = frageText(s);
    const ch = shuffle([richtig, `${gross(s.form === 'is' ? 'are' : 'is')} ${subjKlein(s.subj)} ${s.rest}?`, `${gross(s.form)} ${s.rest} ${subjKlein(s.subj)}?`]);
    return {
      prompt: `Mache aus dem Satz eine Frage. Welche ist richtig?${en(s.text)}`,
      choices: ch.map((c) => `<span lang="en">${c}</span>`), correct: ch.indexOf(richtig),
      hint: FRAGE_TIPP, solution: frageLoesung(s), ex: NEX(s, 'frage'),
    };
  }
  // D: Frage eintippen
  function frageTippen() {
    const s = pick(FQ);
    return {
      prompt: `Mache aus dem Satz eine Frage und schreibe sie auf.${en(s.text)}`,
      fields: [{ type: 'text', ci: true, answer: frageText(s), label: 'Frage' }],
      hint: FRAGE_TIPP, solution: frageLoesung(s), ex: NEX(s, 'frage'),
    };
  }
  const kurzLoesung = (s, ja) => `<span lang="en">${frageText(s)}</span><br><span lang="en"><b class="vb">${ja ? jaText(s) : neinText(s)}</b></span> ${U.say(ja ? jaText(s) : neinText(s))}<br>${s.pron ? `Für <b>${s.subj}</b> steht in der Antwort <b>${s.pron}</b>. ` : ''}Die Form von to be aus der Frage kommt in der Antwort wieder. ${ja ? 'Nach <b>Yes</b> gibt es keine Kurzform.' : 'Nach <b>No</b> wird verneint: ' + NEG[s.form][0] + '.'}`;
  const KURZ_TIPP = 'Die Kurzantwort hat drei Teile: Yes oder No, dann das Pronomen (he, she, it, they), dann dieselbe Form von to be wie in der Frage.';
  // E: Kurzantwort auswählen
  function kurzWahl() {
    const s = pick(KA), ja = Math.random() < 0.5, pr = pronVon(s), anders = s.form === 'is' ? 'are' : 'is';
    const richtig = ja ? jaText(s) : neinText(s);
    const falsch = ja
      ? [`Yes, ${pr}${s.form === 'is' ? '’s' : '’re'}.`, `Yes, ${pr} ${anders}.`]
      : [`No, ${pr} not.`, `No, ${pr} ${NEG[anders][0]}.`];
    const ch = shuffle([richtig, ...falsch]);
    return {
      prompt: `Antworte kurz mit <b>${ja ? 'Ja' : 'Nein'}</b>.${en(frageText(s))}`,
      choices: ch.map((c) => `<span lang="en">${c}</span>`), correct: ch.indexOf(richtig),
      hint: KURZ_TIPP, solution: kurzLoesung(s, ja), ex: NEX(s, 'kurz', ja),
    };
  }
  // F: Kurzantwort ergänzen
  function kurzTippen() {
    const s = pick(KA), ja = Math.random() < 0.5, pr = pronVon(s);
    return {
      prompt: `Ergänze die Kurzantwort.${en(frageText(s))}`,
      layout: 'satz',
      fields: [{ type: 'text', ci: true, answer: ja ? s.form : NEG[s.form], prefix: `${ja ? 'Yes' : 'No'}, ${pr}`, suffix: '.', label: 'Form von to be' }],
      answerText: ja ? s.form : NEG[s.form][0],
      hint: KURZ_TIPP, solution: kurzLoesung(s, ja), ex: NEX(s, 'kurz', ja),
    };
  }
  const beNeg = () => U.wahl([[18, negWahl], [20, negTippen], [18, frageWahl], [14, frageTippen], [15, kurzWahl], [15, kurzTippen]]);

  D.daten = { FORM, KURZ, BE, PRONS, GRUPPE_TEXT, warum, kurzText, PS, PRON_ART, PRON_WORT, ALLE_PRON, NEG, FQ, KA, negText, frageText, jaText, neinText, subjKlein, gross };
  // alle Texte, zu denen es eine Aufnahme geben muss (für tests/endax_audio.py und den Test)
  D.audioTexte = () => {
    const t = new Set();
    BE.forEach((s) => { t.add(s.text); t.add(negText(s)); });
    PRONS.forEach((s) => t.add(kurzText(s)));
    PS.forEach((s) => { t.add(s.neu); if (s.art === 'w') t.add(s.text); });
    t.add('Ben and I are in the same class.');
    FQ.forEach((s) => t.add(frageText(s)));
    KA.forEach((s) => { t.add(jaText(s)); t.add(neinText(s)); });
    return [...t];
  };
  D.arten = {
    'e5-be': { beLuecke, beTippen, beSatz, beWer, beKurz, beLang, beDeutsch, beAntippen },
    'e5-pron': { pronWahl, pronTippen, pronWer, pronDeutsch, pronEnglisch, pronIch },
    'e5-be-neg': { negWahl, negTippen, frageWahl, frageTippen, kurzWahl, kurzTippen },
  };

  // =====================================================
  // Lernbereiche Klasse 5 (Themenplan: faecher/englisch/themenplan.md)
  // =====================================================
  D.grades = D.grades || {};
  D.grades[5] = {
    lbs: [
      { id: 'e5-bausteine', nr: 1, title: 'Erste Bausteine', topics: [
        { id: 'e5-be', title: 'to be: am, is, are', icon: '🧩', gen: tobe },
        { id: 'e5-pron', title: 'I, you, he, she, it, we, they', icon: '🧑', gen: pronomen },
        { id: 'e5-be-neg', title: 'to be: verneinen und fragen', icon: '❓', gen: beNeg },
      ] },
    ],
  };
})();
