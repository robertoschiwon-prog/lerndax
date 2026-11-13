/* EnDax (Englisch) – Themen und Aufgaben Klasse 5 (Lehrplan Gymnasium Sachsen, Klassenstufen 5/6)
 *
 * Aufbau wie in DeDax: Jeder Generator liefert bei jedem Aufruf eine neue Aufgabe
 *   { prompt, hint, solution, answerText?, ex? } und dazu eine der Antwortformen
 *   choices/correct   Auswahl
 *   fields            Eingabefelder; type:'text' = Wort eintippen (answer: Wort oder Liste erlaubter Wörter)
 *   layout:'satz'     Felder stehen als Lücken in einem Satz (prefix/suffix sind die Satzteile)
 *   tap               Wörter antippen: { tokens:[…], correct:[Index …] }
 *   order             Wörter in Reihenfolge bringen: U.ordne([Teile in richtiger Reihenfolge], Satzzeichen)
 * Erklärt wird auf Deutsch, nur die Übungssätze sind englisch. Britische Schreibweise.
 * Alle Sätze sind selbst geschrieben (nichts aus dem Schulbuch) und stehen in festen Listen, damit es zu jedem
 * Satz eine Aufnahme gibt. Die Aufnahmen liegen in Sammeldateien je Thema (audio/us/, audio/gb/), erzeugt mit
 * tests/endax_audio.py aus der Liste D.audioThemen().
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
  // Alle Texte, zu denen es eine Aufnahme geben muss, nach Themen geordnet (für tests/endax_audio.py und den Test).
  // Jedes Thema bekommt eine Sammeldatei; ein Text, der in mehreren Themen vorkommt, liegt beim ersten.
  D.audioThemen = () => ({
    'e5-be': [...BE.map((s) => s.text), ...PRONS.map(kurzText)],
    'e5-pron': [...PS.map((s) => s.neu), ...PS.filter((s) => s.art === 'w').map((s) => s.text), 'Ben and I are in the same class.'],
    'e5-be-neg': [...BE.map(negText), ...FQ.map(frageText), ...KA.map(jaText), ...KA.map(neinText)],
  });
  D.audioTexte = () => [...new Set(Object.values(D.audioThemen()).flat())];
  D.arten = {
    'e5-be': { beLuecke, beTippen, beSatz, beWer, beKurz, beLang, beDeutsch, beAntippen },
    'e5-pron': { pronWahl, pronTippen, pronWer, pronDeutsch, pronEnglisch, pronIch },
    'e5-be-neg': { negWahl, negTippen, frageWahl, frageTippen, kurzWahl, kurzTippen },
  };

  // =====================================================
  // have got / has got
  // =====================================================
  // Gruppe: 0 = I, you, we, they (have got), 1 = he, she, it (has got)
  const HAVE = ['have', 'has'];
  const HKURZ = { I: 'I’ve', You: 'You’ve', He: 'He’s', She: 'She’s', It: 'It’s', We: 'We’ve', They: 'They’ve' };
  const HNEG = { have: ['haven’t', 'haven\'t', 'have not'], has: ['hasn’t', 'hasn\'t', 'has not'] };
  const HGRUPPE = ['Bei <b>I, you, we, they</b> (und bei mehreren) heißt es <b>have got</b>.', 'Bei <b>he, she, it</b> (eine Person oder Sache) heißt es <b>has got</b>.'];
  // [Subjekt, Gruppe, was man hat, Deutsch, Pronomen (nur wenn das Subjekt kein Pronomen ist)]
  const HG = [
    ['I', 0, 'a new bike', 'Ich habe ein neues Fahrrad.'],
    ['I', 0, 'two sisters', 'Ich habe zwei Schwestern.'],
    ['You', 0, 'a nice room', 'Du hast ein schönes Zimmer.'],
    ['You', 0, 'my pen', 'Du hast meinen Stift.'],
    ['He', 1, 'a brother', 'Er hat einen Bruder.'],
    ['He', 1, 'a red cap', 'Er hat eine rote Mütze.'],
    ['She', 1, 'a cat', 'Sie hat eine Katze.'],
    ['She', 1, 'long hair', 'Sie hat lange Haare.'],
    ['It', 1, 'four legs', 'Es hat vier Beine.'],
    ['It', 1, 'a long tail', 'Es hat einen langen Schwanz.'],
    ['We', 0, 'a big garden', 'Wir haben einen großen Garten.'],
    ['We', 0, 'a new teacher', 'Wir haben einen neuen Lehrer.'],
    ['They', 0, 'three dogs', 'Sie haben drei Hunde.'],
    ['They', 0, 'a small house', 'Sie haben ein kleines Haus.'],
    ['My dad', 1, 'a car', 'Mein Papa hat ein Auto.', 'he'],
    ['Lisa', 1, 'a blue bag', 'Lisa hat eine blaue Tasche.', 'she'],
    ['The dog', 1, 'a ball', 'Der Hund hat einen Ball.', 'it'],
    ['Tom and Lisa', 0, 'a rabbit', 'Tom und Lisa haben ein Kaninchen.', 'they'],
    ['My friends', 0, 'new bikes', 'Meine Freunde haben neue Fahrräder.', 'they'],
    ['My sister and I', 0, 'a dog', 'Meine Schwester und ich haben einen Hund.', 'we'],
  ].map(([subj, g, obj, de, pron]) => ({ subj, g, form: HAVE[g], obj, de, pron: pron || '', text: `${subj} ${HAVE[g]} got ${obj}.` }));
  const HPRON = HG.filter((s) => !s.pron);
  const hKurz = (s) => `${HKURZ[s.subj]} got ${s.obj}.`;
  const hNeg = (s) => `${s.subj} ${HNEG[s.form][0]} got ${s.obj}.`;
  const hFrage = (s) => `${gross(s.form)} ${subjKlein(s.subj)} got ${s.obj}?`;
  const HQ = HG.filter((s) => s.subj !== 'I' && !/ I$/.test(s.subj));   // Fragen ohne „I“
  const hPron = (s) => s.pron || s.subj.toLowerCase();
  const HKA = HQ.filter((s) => ['he', 'she', 'it', 'they'].includes(hPron(s)));
  const hJa = (s) => `Yes, ${hPron(s)} ${s.form}.`;
  const hNein = (s) => `No, ${hPron(s)} ${HNEG[s.form][0]}.`;
  const hMark = (s) => `<span lang="en">${s.subj} <b class="vb">${s.form} got</b> ${s.obj}.</span>`;
  function hWarum(s) {
    if (!s.pron) return HGRUPPE[s.g];
    return `<b>${s.subj}</b> ${s.g === 0 ? 'sind mehrere' : 'ist eine Person oder Sache'}: Dafür kannst du <b>${s.pron}</b> sagen. ${s.g === 0 ? 'Bei mehreren heißt es <b>have got</b>.' : 'Bei he, she, it heißt es <b>has got</b>.'}`;
  }
  const hLoesung = (s) => `${hMark(s)} ${U.say(s.text)}<br>${hWarum(s)}<br><small>Auf Deutsch: ${s.de}</small>`;
  const H_TIPP = '<b>have got</b> heißt <b>haben</b> (besitzen). Schau auf das erste Wort: <b>he, she, it</b> (einer, eine, eins) → <b>has</b> got. Alle anderen → <b>have</b> got.';
  const HEX = (s, mode, ja) => ({ mode: mode || 'form', subj: s.subj, g: s.g, form: s.form, obj: s.obj, pron: s.pron, de: s.de, ja: !!ja });

  // A: have oder has auswählen
  function hgLuecke() {
    const s = pick(HG);
    return {
      prompt: `Was gehört in die Lücke?${en(`${s.subj} ___ got ${s.obj}.`)}`,
      choices: ['have', 'has', 'haves'], correct: s.g,
      hint: H_TIPP, solution: hLoesung(s), ex: HEX(s),
    };
  }
  // B: have oder has eintippen
  function hgTippen() {
    const s = pick(HG);
    return {
      prompt: 'Setze ein: <b>have</b> oder <b>has</b>.',
      layout: 'satz',
      fields: [{ type: 'text', ci: true, answer: s.form, prefix: s.subj, suffix: `got ${s.obj}.`, label: 'have oder has' }],
      hint: H_TIPP, solution: hLoesung(s), ex: HEX(s),
    };
  }
  // C: richtigen Satz finden (auch: got gehört direkt hinter have/has)
  function hgSatz() {
    const s = pick(HG);
    const ch = shuffle([s.text, `${s.subj} ${HAVE[1 - s.g]} got ${s.obj}.`, `${s.subj} ${s.form} ${s.obj} got.`]);
    return {
      prompt: 'Nur ein Satz ist richtig. Welcher?',
      choices: ch.map((c) => `<span lang="en">${c}</span>`), correct: ch.indexOf(s.text),
      hint: `${H_TIPP} Und: <b>got</b> steht direkt hinter have oder has, nicht am Satzende.`,
      solution: `${hLoesung(s)}<br>Anders als im Deutschen wandert nichts ans Satzende: have und got bleiben zusammen.`, ex: HEX(s),
    };
  }
  // D: Kurzform
  function hgKurz() {
    const s = pick(HPRON), k = HKURZ[s.subj];
    return {
      prompt: `Schreibe die <b>Kurzform</b> von <b lang="en">${s.subj} ${s.form}</b>.${en(s.text)}`,
      fields: [{ type: 'text', ci: true, answer: [k, k.replace('’', "'")], label: 'Kurzform' }],
      answerText: k,
      hint: 'Aus have wird <b>’ve</b>, aus has wird <b>’s</b>. Der Apostroph steht für die Buchstaben, die wegfallen. Beispiel: we have → we’ve.',
      solution: `<span lang="en">${s.subj} ${s.form}</span> → <b class="vb" lang="en">${k}</b><br><span lang="en">${hKurz(s)}</span> ${U.say(hKurz(s))}${s.g === 1 ? `<br>Achtung: <b lang="en">${k}</b> kann „${s.subj.toLowerCase()} is“ oder „${s.subj.toLowerCase()} has“ heißen. Steht <b>got</b> dahinter, ist es has.` : ''}<br><small>Auf Deutsch: ${s.de}</small>`,
      ex: HEX(s, 'kf'),
    };
  }
  const hNegLoesung = (s) => `<span lang="en">${s.subj} <b class="vb">${s.form} not</b> got ${s.obj}.</span><br>Kurz: <span lang="en">${s.subj} <b class="vb">${HNEG[s.form][0]}</b> got ${s.obj}.</span> ${U.say(hNeg(s))}<br><b>not</b> kommt zwischen ${s.form} und got. Beide Formen sind richtig, beim Sprechen nimmt man meist die kurze.`;
  const HNEG_TIPP = 'Zum Verneinen kommt <b>not</b> zwischen have/has und got: have not got, has not got. Kurz: <b>haven’t got</b>, <b>hasn’t got</b>.';
  // E: verneinen
  function hgNeg() {
    const s = pick(HG);
    return {
      prompt: `Verneine den Satz: Setze die <b>verneinte</b> Form ein.${en(s.text)}`,
      layout: 'satz',
      fields: [{ type: 'text', ci: true, answer: HNEG[s.form], prefix: s.subj, suffix: `got ${s.obj}.`, label: 'verneinte Form' }],
      answerText: `${HNEG[s.form][0]} (oder: ${s.form} not)`,
      hint: HNEG_TIPP, solution: hNegLoesung(s), ex: HEX(s, 'neg'),
    };
  }
  const HFRAGE_TIPP = 'Bei der Frage tauschen have/has und die Person die Plätze: Erst <b>Have</b> oder <b>Has</b>, dann die Person, dann <b>got</b>.';
  const hFrageLoesung = (s) => `<span lang="en">${s.subj} <b>${s.form}</b> got ${s.obj}.</span> → <span lang="en"><b class="vb">${gross(s.form)}</b> ${subjKlein(s.subj)} got ${s.obj}?</span> ${U.say(hFrage(s))}<br>${HFRAGE_TIPP}`;
  // F: richtige Frage auswählen
  function hgFrageWahl() {
    const s = pick(HQ);
    const richtig = hFrage(s);
    const ch = shuffle([richtig, `${gross(HAVE[1 - s.g])} ${subjKlein(s.subj)} got ${s.obj}?`, `${gross(s.form)} got ${subjKlein(s.subj)} ${s.obj}?`]);
    return {
      prompt: `Mache aus dem Satz eine Frage. Welche ist richtig?${en(s.text)}`,
      choices: ch.map((c) => `<span lang="en">${c}</span>`), correct: ch.indexOf(richtig),
      hint: HFRAGE_TIPP, solution: hFrageLoesung(s), ex: HEX(s, 'frage'),
    };
  }
  // G: Frage eintippen
  function hgFrageTippen() {
    const s = pick(HQ);
    return {
      prompt: `Mache aus dem Satz eine Frage und schreibe sie auf.${en(s.text)}`,
      fields: [{ type: 'text', ci: true, answer: hFrage(s), label: 'Frage' }],
      hint: HFRAGE_TIPP, solution: hFrageLoesung(s), ex: HEX(s, 'frage'),
    };
  }
  // H: Kurzantwort
  function hgAntwort() {
    const s = pick(HKA), ja = Math.random() < 0.5, pr = hPron(s), anders = HAVE[1 - s.g];
    const richtig = ja ? hJa(s) : hNein(s);
    const falsch = ja ? [`Yes, ${pr} ${anders}.`, `Yes, ${pr}${s.g === 1 ? '’s' : '’ve'}.`] : [`No, ${pr} ${HNEG[anders][0]}.`, `No, ${pr} not ${s.form}.`];
    const ch = shuffle([richtig, ...falsch]);
    return {
      prompt: `Antworte kurz mit <b>${ja ? 'Ja' : 'Nein'}</b>.${en(hFrage(s))}`,
      choices: ch.map((c) => `<span lang="en">${c}</span>`), correct: ch.indexOf(richtig),
      hint: 'Die Kurzantwort hat drei Teile: Yes oder No, dann das Pronomen (he, she, it, they), dann have oder has wie in der Frage. Das Wort got fällt weg.',
      solution: `<span lang="en">${hFrage(s)}</span><br><span lang="en"><b class="vb">${richtig}</b></span> ${U.say(richtig)}<br>${s.pron ? `Für <b>${s.subj}</b> steht in der Antwort <b>${s.pron}</b>. ` : ''}In der Kurzantwort steht nur ${s.form}, ohne got. ${ja ? 'Nach <b>Yes</b> gibt es keine Kurzform.' : `Nach <b>No</b> wird verneint: ${HNEG[s.form][0]}.`}`,
      ex: HEX(s, 'kurz', ja),
    };
  }
  const haveGot = () => U.wahl([[20, hgLuecke], [20, hgTippen], [12, hgSatz], [8, hgKurz], [14, hgNeg], [10, hgFrageWahl], [8, hgFrageTippen], [8, hgAntwort]]);

  // =====================================================
  // a oder an
  // =====================================================
  // [Wort, Artikel, Deutsch, besonderer Hinweis zum Anfangslaut]
  const AAN = [
    ['book', 'a', 'ein Buch'], ['dog', 'a', 'ein Hund'], ['cat', 'a', 'eine Katze'], ['pen', 'a', 'ein Stift'],
    ['table', 'a', 'ein Tisch'], ['bike', 'a', 'ein Fahrrad'], ['teacher', 'a', 'ein Lehrer'], ['friend', 'a', 'ein Freund'],
    ['banana', 'a', 'eine Banane'], ['horse', 'a', 'ein Pferd'], ['house', 'a', 'ein Haus'],
    ['uniform', 'a', 'eine Uniform', 'Man schreibt u, aber man spricht am Anfang „ju“. Das j ist kein Vokal-Laut.'],
    ['big apple', 'a', 'ein großer Apfel'], ['red umbrella', 'a', 'ein roter Regenschirm'], ['new idea', 'a', 'eine neue Idee'], ['small egg', 'a', 'ein kleines Ei'],
    ['apple', 'an', 'ein Apfel'], ['egg', 'an', 'ein Ei'], ['orange', 'an', 'eine Orange'], ['umbrella', 'an', 'ein Regenschirm'],
    ['ice cream', 'an', 'ein Eis'], ['elephant', 'an', 'ein Elefant'], ['idea', 'an', 'eine Idee'],
    ['hour', 'an', 'eine Stunde', 'Man schreibt h, aber man spricht es nicht. Man hört am Anfang „au“, also einen Vokal-Laut.'],
    ['uncle', 'an', 'ein Onkel'], ['aunt', 'an', 'eine Tante'], ['animal', 'an', 'ein Tier'], ['exercise book', 'an', 'ein Heft'],
    ['old car', 'an', 'ein altes Auto'], ['English book', 'an', 'ein Englischbuch'], ['easy question', 'an', 'eine leichte Frage'],
  ].map(([wort, art, de, laut]) => ({ wort, art, de, laut: laut || '', text: `${art} ${wort}` }));
  const A_TIPP = 'Sprich das Wort leise. Hörst du am Anfang einen <b>Vokal</b> (a, e, i, o, u)? Dann <b>an</b>. Sonst <b>a</b>. Es zählt, was du <b>hörst</b>, nicht, was du schreibst.';
  const aWarum = (w) => (w.laut ? w.laut + ` Deshalb: <b>${w.art}</b>.`
    : w.art === 'an' ? `<b>${w.wort}</b> beginnt mit <b>${w.wort[0].toLowerCase()}</b>, einem Vokal (Selbstlaut). Mit <b>an</b> lässt es sich leichter sprechen.`
      : `<b>${w.wort}</b> beginnt mit <b>${w.wort[0].toLowerCase()}</b>, einem Konsonanten (Mitlaut). Deshalb <b>a</b>.`);
  const aLoesung = (w) => `<span lang="en"><b class="vb">${w.art}</b> ${w.wort}</span> ${U.say(w.text)}<br>${aWarum(w)}${/ /.test(w.wort) && !w.laut ? ' Es zählt das Wort direkt hinter a oder an.' : ''}<br><small>Auf Deutsch: ${w.de}</small>`;
  const AEX = (w) => ({ wort: w.wort, art: w.art, de: w.de, laut: w.laut });
  // A: a oder an auswählen
  function aanWahl() {
    const w = pick(AAN);
    return { prompt: `<b>a</b> oder <b>an</b>?${en(`___ ${w.wort}`)}`, choices: ['a', 'an'], correct: w.art === 'a' ? 0 : 1, hint: A_TIPP, solution: aLoesung(w), ex: AEX(w) };
  }
  // B: eintippen
  function aanTippen() {
    const w = pick(AAN);
    return {
      prompt: 'Setze ein: <b>a</b> oder <b>an</b>.', layout: 'satz',
      fields: [{ type: 'text', ci: true, answer: w.art, suffix: w.wort, label: 'a oder an' }],
      hint: A_TIPP, solution: aLoesung(w), ex: AEX(w),
    };
  }
  // C: im Satz
  function aanSatz() {
    const w = pick(AAN), rahmen = pick([['This is', '.'], ['It is', '.'], ['Look, there is', '!']]);
    return {
      prompt: 'Setze ein: <b>a</b> oder <b>an</b>.', layout: 'satz',
      fields: [{ type: 'text', ci: true, answer: w.art, prefix: rahmen[0], suffix: w.wort + rahmen[1], label: 'a oder an' }],
      hint: A_TIPP, solution: aLoesung(w), ex: AEX(w),
    };
  }
  // D: Welches Wort braucht an (oder a)?
  function aanWelches() {
    const art = pick(['a', 'an']);
    const w = pick(AAN.filter((x) => x.art === art));
    const ch = shuffle([w, ...shuffle(AAN.filter((x) => x.art !== art)).slice(0, 2)]);
    return {
      prompt: `Vor welches Wort gehört <b>${art}</b>?`,
      choices: ch.map((c) => `<span lang="en">${c.wort}</span>`), correct: ch.indexOf(w),
      hint: A_TIPP,
      solution: `${aLoesung(w)}<br>Die anderen beiden: ${ch.filter((c) => c !== w).map((c) => `<span lang="en">${c.text}</span>`).join(', ')}.`, ex: AEX(w),
    };
  }
  // E: die beiden Sonderfälle verstehen
  function aanWarum() {
    const w = pick(AAN.filter((x) => x.laut));
    const richtig = w.wort === 'hour' ? 'Das h wird nicht gesprochen. Man hört zuerst einen Vokal-Laut.' : 'Man spricht am Anfang „ju“. Das ist kein Vokal-Laut.';
    const falsch = w.wort === 'hour'
      ? ['Vor h steht immer an.', 'Das ist eine Ausnahme ohne Grund.']
      : ['Vor u steht immer a.', 'Das ist eine Ausnahme ohne Grund.'];
    const ch = shuffle([richtig, ...falsch]);
    return {
      prompt: `Es heißt <b lang="en">${w.text}</b>. Warum?`,
      choices: ch, correct: ch.indexOf(richtig),
      hint: 'Sprich das Wort leise und achte auf den allerersten Laut, den du hörst.',
      solution: `${aLoesung(w)}<br>${w.wort === 'hour' ? 'Zum Vergleich: <span lang="en">a house, a horse</span>. Dort hört man das h.' : 'Zum Vergleich: <span lang="en">an umbrella, an uncle</span>. Dort hört man am Anfang „a“.'}`, ex: AEX(w),
    };
  }
  const aOderAn = () => U.wahl([[30, aanWahl], [22, aanTippen], [22, aanSatz], [18, aanWelches], [8, aanWarum]]);

  Object.assign(D.daten, { HAVE, HKURZ, HNEG, HGRUPPE, HG, HPRON, HQ, HKA, hKurz, hNeg, hFrage, hJa, hNein, hPron, AAN });
  const themenBisher = D.audioThemen;
  D.audioThemen = () => Object.assign(themenBisher(), {
    'e5-have': [...HG.map((s) => s.text), ...HPRON.map(hKurz), ...HG.map(hNeg), ...HQ.map(hFrage), ...HKA.map(hJa), ...HKA.map(hNein)],
    'e5-a-an': AAN.map((w) => w.text),
  });
  Object.assign(D.arten, {
    'e5-have': { hgLuecke, hgTippen, hgSatz, hgKurz, hgNeg, hgFrageWahl, hgFrageTippen, hgAntwort },
    'e5-a-an': { aanWahl, aanTippen, aanSatz, aanWelches, aanWarum },
  });

  // =====================================================
  // Mehrzahl (Plural)
  // =====================================================
  const PL_REGEL = {
    s: 'Meistens hängt man einfach <b>-s</b> an.',
    es: 'Nach einem Zischlaut (s, ss, sh, ch, x) hängt man <b>-es</b> an.',
    ies: 'Konsonant + y: Aus dem y wird <b>-ies</b>.',
    ys: 'Vokal + y: Das y bleibt, man hängt nur <b>-s</b> an.',
    irr: 'Das Wort hat eine eigene Mehrzahl, die man lernen muss.',
    ves: 'Aus f oder fe am Ende wird <b>-ves</b>.',
    oes: 'Bei diesem Wort auf o hängt man <b>-es</b> an.',
  };
  // [Einzahl, Mehrzahl, Deutsch, Regel, zwei falsche Mehrzahlen]
  const PL = [
    ['book', 'books', 'Buch', 's', ['bookes', 'booken']], ['dog', 'dogs', 'Hund', 's', ['doges', 'dogen']],
    ['cat', 'cats', 'Katze', 's', ['cates', 'caten']], ['bag', 'bags', 'Tasche', 's', ['bages', 'bagen']],
    ['chair', 'chairs', 'Stuhl', 's', ['chaires', 'chairen']], ['girl', 'girls', 'Mädchen', 's', ['girles', 'girlen']],
    ['apple', 'apples', 'Apfel', 's', ['applees', 'applen']], ['friend', 'friends', 'Freund', 's', ['friendes', 'frienden']],
    ['table', 'tables', 'Tisch', 's', ['tablees', 'tablen']], ['house', 'houses', 'Haus', 's', ['housees', 'housen']],
    ['box', 'boxes', 'Kiste', 'es', ['boxs', 'boxies']], ['glass', 'glasses', 'Glas', 'es', ['glass', 'glassies']],
    ['dish', 'dishes', 'Schüssel', 'es', ['dishs', 'dishies']], ['watch', 'watches', 'Armbanduhr', 'es', ['watchs', 'watchies']],
    ['sandwich', 'sandwiches', 'belegtes Brot', 'es', ['sandwichs', 'sandwichies']], ['class', 'classes', 'Klasse', 'es', ['class', 'classies']],
    ['fox', 'foxes', 'Fuchs', 'es', ['foxs', 'foxies']], ['bus', 'buses', 'Bus', 'es', ['buss', 'busies']],
    ['baby', 'babies', 'Baby', 'ies', ['babys', 'babyes']], ['family', 'families', 'Familie', 'ies', ['familys', 'familyes']],
    ['city', 'cities', 'Stadt', 'ies', ['citys', 'cityes']], ['story', 'stories', 'Geschichte', 'ies', ['storys', 'storyes']],
    ['party', 'parties', 'Party', 'ies', ['partys', 'partyes']], ['hobby', 'hobbies', 'Hobby', 'ies', ['hobbys', 'hobbyes']],
    ['boy', 'boys', 'Junge', 'ys', ['boies', 'boyes']], ['day', 'days', 'Tag', 'ys', ['daies', 'dayes']],
    ['key', 'keys', 'Schlüssel', 'ys', ['keies', 'keyes']], ['toy', 'toys', 'Spielzeug', 'ys', ['toies', 'toyes']],
    ['man', 'men', 'Mann', 'irr', ['mans', 'mens']], ['woman', 'women', 'Frau', 'irr', ['womans', 'womens']],
    ['child', 'children', 'Kind', 'irr', ['childs', 'childrens']], ['foot', 'feet', 'Fuß', 'irr', ['foots', 'feets']],
    ['tooth', 'teeth', 'Zahn', 'irr', ['tooths', 'teeths']], ['mouse', 'mice', 'Maus', 'irr', ['mouses', 'mices']],
    ['sheep', 'sheep', 'Schaf', 'irr', ['sheeps', 'sheepes']],
    ['knife', 'knives', 'Messer', 'ves', ['knifes', 'knifs']], ['leaf', 'leaves', 'Blatt', 'ves', ['leafs', 'leafes']],
    ['wolf', 'wolves', 'Wolf', 'ves', ['wolfs', 'wolfes']], ['shelf', 'shelves', 'Regal', 'ves', ['shelfs', 'shelfes']],
    ['tomato', 'tomatoes', 'Tomate', 'oes', ['tomatos', 'tomatoies']], ['potato', 'potatoes', 'Kartoffel', 'oes', ['potatos', 'potatoies']],
  ].map(([sg, pl, de, regel, falsch]) => ({ sg, pl, de, regel, falsch, text: `one ${sg}, two ${pl}` }));
  const istVokal = (c) => 'aeiou'.includes(c);
  function plWarum(w) {
    const e = w.sg.slice(-1), v = w.sg.slice(-2, -1);
    switch (w.regel) {
      case 's': return `Hier gilt die einfache Regel: <b>-s</b> anhängen.`;
      case 'es': return `<b>${w.sg}</b> endet auf einen Zischlaut (${/(ss|sh|ch)$/.test(w.sg) ? w.sg.slice(-2) : e}). „${w.sg}s“ könnte man kaum sprechen, deshalb <b>-es</b>.`;
      case 'ies': return `<b>${w.sg}</b> endet auf Konsonant + y (${v} + y). Aus dem y wird <b>-ies</b>.`;
      case 'ys': return `<b>${w.sg}</b> endet auf Vokal + y (${v} + y). Das y bleibt, es kommt nur <b>-s</b> dazu.`;
      case 'irr': return w.sg === w.pl ? `<b>${w.sg}</b> bleibt in der Mehrzahl gleich. Das muss man sich merken.` : `<b>${w.sg}</b> hat eine eigene Mehrzahl: <b>${w.pl}</b>. Die muss man lernen.`;
      case 'ves': return `<b>${w.sg}</b> endet auf ${w.sg.endsWith('fe') ? 'fe' : 'f'}. Daraus wird <b>-ves</b>.`;
      default: return `<b>${w.sg}</b> endet auf o. Bei diesem Wort kommt <b>-es</b> dazu.`;
    }
  }
  const plLoesung = (w) => `<span lang="en">one ${w.sg} → two <b class="vb">${w.pl}</b></span> ${U.say(w.text)}<br>${plWarum(w)}<br><small>${w.sg} = ${w.de}</small>`;
  const PL_TIPP = 'Schau auf das <b>Ende</b> des Wortes. Meistens kommt -s dazu. Nach einem Zischlaut (s, ss, sh, ch, x) -es. Konsonant + y wird zu -ies. Ein paar Wörter haben eine eigene Mehrzahl (man → men).';
  const PLEX = (w, mode) => ({ mode: mode || 'pl', sg: w.sg, pl: w.pl, de: w.de, regel: w.regel });
  // A: Mehrzahl eintippen
  function plTippen() {
    const w = pick(PL);
    return {
      prompt: `Schreibe die <b>Mehrzahl</b>.${en(`one ${w.sg}`)}`, layout: 'satz',
      fields: [{ type: 'text', ci: true, answer: w.pl, prefix: 'two', label: 'Mehrzahl' }],
      hint: PL_TIPP, solution: plLoesung(w), ex: PLEX(w),
    };
  }
  // B: richtige Mehrzahl auswählen
  function plWahl() {
    const w = pick(PL);
    const ch = shuffle([w.pl, ...w.falsch]);
    return {
      prompt: `Wie heißt die <b>Mehrzahl</b> von <b lang="en">${w.sg}</b>?`,
      choices: ch.map((c) => `<span lang="en">two ${c}</span>`), correct: ch.indexOf(w.pl),
      hint: PL_TIPP, solution: plLoesung(w), ex: PLEX(w),
    };
  }
  // C: von der Mehrzahl zurück zur Einzahl
  function plEinzahl() {
    const w = pick(PL.filter((x) => x.regel !== 's'));
    return {
      prompt: `Schreibe die <b>Einzahl</b>.${en(`two ${w.pl}`)}`, layout: 'satz',
      fields: [{ type: 'text', ci: true, answer: w.sg, prefix: 'one', label: 'Einzahl' }],
      hint: 'Geh den Weg rückwärts: -ies wird wieder zu y, -ves wieder zu f oder fe, -es fällt weg. Bei men, children, feet, teeth, mice musst du das Wort kennen.',
      solution: `<span lang="en">two ${w.pl} → one <b class="vb">${w.sg}</b></span> ${U.say(w.text)}<br>${plWarum(w)}<br><small>${w.sg} = ${w.de}</small>`, ex: PLEX(w, 'sg'),
    };
  }
  // D: Welche Regel steckt dahinter?
  function plRegel() {
    const w = pick(PL);
    // -s und „Vokal + y → -s“ nie zusammen anbieten (beide wären richtig)
    const andere = shuffle(Object.keys(PL_REGEL).filter((r) => r !== w.regel && !(w.regel === 'ys' && r === 's') && !(w.regel === 's' && r === 'ys'))).slice(0, 2);
    const ch = shuffle([w.regel, ...andere]);
    return {
      prompt: `Welche Regel passt?${en(`one ${w.sg} → two ${w.pl}`)}`,
      choices: ch.map((r) => PL_REGEL[r]), correct: ch.indexOf(w.regel),
      hint: 'Vergleiche Einzahl und Mehrzahl: Was ist am Ende dazugekommen, was hat sich verändert?',
      solution: plLoesung(w), ex: PLEX(w),
    };
  }
  // E: Welches Wort folgt der Regel?
  function plWelches() {
    const [regel, frage, gegen] = pick([
      ['es', 'Welches Wort bekommt in der Mehrzahl <b>-es</b>?', ['s', 'ys']],
      ['ies', 'Bei welchem Wort wird aus dem y ein <b>-ies</b>?', ['ys']],
      ['irr', 'Welches Wort hat eine <b>eigene</b> Mehrzahl (ohne -s)?', ['s', 'es', 'ys']],
      ['ves', 'Bei welchem Wort wird das f zu <b>-ves</b>?', ['s', 'ys', 'es']],
    ]);
    const w = pick(PL.filter((x) => x.regel === regel));
    const ch = shuffle([w, ...shuffle(PL.filter((x) => gegen.includes(x.regel) && x.sg !== 'house')).slice(0, 2)]);
    return {
      prompt: frage,
      choices: ch.map((c) => `<span lang="en">${c.sg}</span>`), correct: ch.indexOf(w),
      hint: PL_TIPP,
      solution: `${plLoesung(w)}<br>Die anderen beiden: ${ch.filter((c) => c !== w).map((c) => `<span lang="en">${c.sg} → ${c.pl}</span>`).join(', ')}.`, ex: PLEX(w),
    };
  }
  const mehrzahl = () => U.wahl([[30, plTippen], [22, plWahl], [16, plEinzahl], [16, plRegel], [16, plWelches]]);
  Object.assign(D.daten, { PL, PL_REGEL, plWarum });
  const themenVorPlural = D.audioThemen;
  D.audioThemen = () => Object.assign(themenVorPlural(), { 'e5-plural': PL.map((w) => w.text) });
  Object.assign(D.arten, { 'e5-plural': { plTippen, plWahl, plEinzahl, plRegel, plWelches } });

  // =====================================================
  // there is / there are
  // =====================================================
  const TFORM = ['is', 'are'];
  const TNEG = { is: ['isn’t', 'isn\'t', 'is not'], are: ['aren’t', 'aren\'t', 'are not'] };
  // [Gruppe (0 = eins, 1 = mehrere), was, wo, Deutsch, Anzahl fürs Bild (0 = viele)]
  const TH = [
    [0, 'a cat', 'in the garden', 'Im Garten ist eine Katze.', 1],
    [0, 'a book', 'on the table', 'Auf dem Tisch liegt ein Buch.', 1],
    [0, 'an apple', 'in my bag', 'In meiner Tasche ist ein Apfel.', 1],
    [0, 'a park', 'near my house', 'In der Nähe meines Hauses gibt es einen Park.', 1],
    [0, 'a dog', 'under the table', 'Unter dem Tisch ist ein Hund.', 1],
    [0, 'a new girl', 'in our class', 'In unserer Klasse gibt es ein neues Mädchen.', 1],
    [0, 'a ball', 'behind the door', 'Hinter der Tür liegt ein Ball.', 1],
    [0, 'a big tree', 'in front of the school', 'Vor der Schule steht ein großer Baum.', 1],
    [1, 'two cats', 'in the garden', 'Im Garten sind zwei Katzen.', 2],
    [1, 'three books', 'on the table', 'Auf dem Tisch liegen drei Bücher.', 3],
    [1, 'many children', 'in the park', 'Im Park sind viele Kinder.', 0],
    [1, 'four chairs', 'in the kitchen', 'In der Küche stehen vier Stühle.', 4],
    [1, 'two boys', 'in the car', 'Im Auto sind zwei Jungen.', 2],
    [1, 'five apples', 'in my bag', 'In meiner Tasche sind fünf Äpfel.', 5],
    [1, 'twenty desks', 'in our classroom', 'In unserem Klassenzimmer stehen zwanzig Tische.', 0],
    [1, 'some pens', 'in the box', 'In der Kiste sind ein paar Stifte.', 0],
  ].map(([g, was, wo, de, n]) => ({ g, form: TFORM[g], was, wo, de, n, text: `There ${TFORM[g]} ${was} ${wo}.` }));
  const TH1 = TH.filter((s) => s.g === 0);
  const TQ = TH.filter((s) => !s.was.startsWith('some'));   // Fragen: ohne „some“ (in Fragen stünde „any“)
  const thKurz = (s) => `There’s ${s.was} ${s.wo}.`;
  const thNeg = (s) => `There ${TNEG[s.form][0]} ${s.was} ${s.wo}.`;
  const thFrage = (s) => `${gross(s.form)} there ${s.was} ${s.wo}?`;
  const thJa = (s) => `Yes, there ${s.form}.`;
  const thNein = (s) => `No, there ${TNEG[s.form][0]}.`;
  const thWarum = (s) => (s.g === 0
    ? `<b>${s.was}</b>: Das ist <b>eins</b>. Deshalb <b>there is</b>.`
    : `<b>${s.was}</b>: Das sind <b>mehrere</b>. Deshalb <b>there are</b>.`);
  const thLoesung = (s) => `<span lang="en">There <b class="vb">${s.form}</b> ${s.was} ${s.wo}.</span> ${U.say(s.text)}<br>${thWarum(s)}<br><small>Auf Deutsch: ${s.de}</small>`;
  const TH_TIPP = '<b>there is</b> und <b>there are</b> sagen, dass es irgendwo etwas gibt. Schau auf das, was <b>danach</b> kommt: <b>eins</b> → there is · <b>mehrere</b> → there are.';
  const TEX = (s, mode, ja) => ({ mode: mode || 'form', g: s.g, form: s.form, was: s.was, wo: s.wo, de: s.de, n: s.n, ja: !!ja });
  // A: is oder are auswählen
  function thLuecke() {
    const s = pick(TH);
    return { prompt: `Was gehört in die Lücke?${en(`There ___ ${s.was} ${s.wo}.`)}`, choices: ['is', 'are', 'am'], correct: s.g, hint: TH_TIPP, solution: thLoesung(s), ex: TEX(s) };
  }
  // B: eintippen
  function thTippen() {
    const s = pick(TH);
    return {
      prompt: 'Setze ein: <b>is</b> oder <b>are</b>.', layout: 'satz',
      fields: [{ type: 'text', ci: true, answer: s.form, prefix: 'There', suffix: `${s.was} ${s.wo}.`, label: 'is oder are' }],
      hint: TH_TIPP, solution: thLoesung(s), ex: TEX(s),
    };
  }
  // C: richtigen Satz finden
  function thSatz() {
    const s = pick(TH);
    const ch = shuffle([s.text, `There ${TFORM[1 - s.g]} ${s.was} ${s.wo}.`, `There ${s.was} ${s.form} ${s.wo}.`]);
    return {
      prompt: 'Nur ein Satz ist richtig. Welcher?',
      choices: ch.map((c) => `<span lang="en">${c}</span>`), correct: ch.indexOf(s.text),
      hint: `${TH_TIPP} Die Reihenfolge ist immer: There + is/are + was + wo.`, solution: thLoesung(s), ex: TEX(s),
    };
  }
  // D: Kurzform (nur bei there is)
  function thKurzform() {
    const s = pick(TH1);
    return {
      prompt: `Schreibe die <b>Kurzform</b> von <b lang="en">There is</b>.${en(s.text)}`,
      fields: [{ type: 'text', ci: true, answer: ['There’s', 'There\'s'], label: 'Kurzform' }], answerText: 'There’s',
      hint: 'is wird zu <b>’s</b>: Das i fällt weg, dafür steht der Apostroph. Wie bei he is → he’s.',
      solution: `<span lang="en">There is</span> → <b class="vb" lang="en">There’s</b><br><span lang="en">${thKurz(s)}</span> ${U.say(thKurz(s))}<br>Für „there are“ schreibt man keine Kurzform.<br><small>Auf Deutsch: ${s.de}</small>`,
      ex: TEX(s, 'kf'),
    };
  }
  // E: verneinen (mit a/an)
  function thVerneinen() {
    const s = pick(TH1);
    return {
      prompt: `Verneine den Satz: Setze die <b>verneinte</b> Form ein.${en(s.text)}`, layout: 'satz',
      fields: [{ type: 'text', ci: true, answer: TNEG.is, prefix: 'There', suffix: `${s.was} ${s.wo}.`, label: 'verneinte Form' }],
      answerText: 'isn’t (oder: is not)',
      hint: 'Wie bei to be: <b>not</b> kommt hinter is. Kurz: <b>isn’t</b>.',
      solution: `<span lang="en">There <b class="vb">is not</b> ${s.was} ${s.wo}.</span><br>Kurz: <span lang="en">There <b class="vb">isn’t</b> ${s.was} ${s.wo}.</span> ${U.say(thNeg(s))}<br><b>not</b> kommt hinter is. Beide Formen sind richtig.`,
      ex: TEX(s, 'neg'),
    };
  }
  const TFRAGE_TIPP = 'Bei der Frage tauschen <b>there</b> und <b>is/are</b> die Plätze: Is there …? Are there …?';
  const thFrageLoesung = (s) => `<span lang="en">There <b>${s.form}</b> ${s.was} ${s.wo}.</span> → <span lang="en"><b class="vb">${gross(s.form)} there</b> ${s.was} ${s.wo}?</span> ${U.say(thFrage(s))}<br>${TFRAGE_TIPP}`;
  // F: richtige Frage auswählen
  function thFrageWahl() {
    const s = pick(TQ), richtig = thFrage(s);
    const ch = shuffle([richtig, `${gross(TFORM[1 - s.g])} there ${s.was} ${s.wo}?`, `${gross(s.form)} there ${s.form} ${s.was} ${s.wo}?`]);
    return {
      prompt: `Mache aus dem Satz eine Frage. Welche ist richtig?${en(s.text)}`,
      choices: ch.map((c) => `<span lang="en">${c}</span>`), correct: ch.indexOf(richtig),
      hint: TFRAGE_TIPP, solution: thFrageLoesung(s), ex: TEX(s, 'frage'),
    };
  }
  // G: Frage eintippen
  function thFrageTippen() {
    const s = pick(TQ);
    return {
      prompt: `Mache aus dem Satz eine Frage und schreibe sie auf.${en(s.text)}`,
      fields: [{ type: 'text', ci: true, answer: thFrage(s), label: 'Frage' }],
      hint: TFRAGE_TIPP, solution: thFrageLoesung(s), ex: TEX(s, 'frage'),
    };
  }
  // H: Kurzantwort
  function thAntwort() {
    const s = pick(TQ), ja = Math.random() < 0.5, anders = TFORM[1 - s.g];
    const richtig = ja ? thJa(s) : thNein(s);
    const falsch = ja ? [`Yes, there ${anders}.`, `Yes, ${s.g === 0 ? 'it is' : 'they are'}.`] : [`No, there ${TNEG[anders][0]}.`, `No, ${s.g === 0 ? 'it isn’t' : 'they aren’t'}.`];
    const ch = shuffle([richtig, ...falsch]);
    return {
      prompt: `Antworte kurz mit <b>${ja ? 'Ja' : 'Nein'}</b>.${en(thFrage(s))}`,
      choices: ch.map((c) => `<span lang="en">${c}</span>`), correct: ch.indexOf(richtig),
      hint: 'Die Kurzantwort nimmt die beiden Wörter vom Anfang der Frage: Is there …? → Yes, there is. Are there …? → Yes, there are.',
      solution: `<span lang="en">${thFrage(s)}</span><br><span lang="en"><b class="vb">${richtig}</b></span> ${U.say(richtig)}<br>In der Antwort steht wieder <b>there</b>, nicht it oder they. Die Form (${s.form}) ist dieselbe wie in der Frage.${ja ? '' : ` Nach No wird verneint: ${TNEG[s.form][0]}.`}`,
      ex: TEX(s, 'kurz', ja),
    };
  }
  const thereIs = () => U.wahl([[22, thLuecke], [22, thTippen], [12, thSatz], [6, thKurzform], [10, thVerneinen], [10, thFrageWahl], [8, thFrageTippen], [10, thAntwort]]);

  // =====================================================
  // this, that, these, those
  // =====================================================
  // [Einzahl, Mehrzahl, Eigenschaft, dieser/diese/dieses, der/die/das, deutsches Wort, deutsche Mehrzahl, deutsche Eigenschaft]
  const DING = [
    ['book', 'books', 'new', 'Dieses', 'Das', 'Buch', 'Bücher', 'neu'],
    ['pen', 'pens', 'red', 'Dieser', 'Der', 'Stift', 'Stifte', 'rot'],
    ['apple', 'apples', 'big', 'Dieser', 'Der', 'Apfel', 'Äpfel', 'groß'],
    ['dog', 'dogs', 'nice', 'Dieser', 'Der', 'Hund', 'Hunde', 'lieb'],
    ['chair', 'chairs', 'old', 'Dieser', 'Der', 'Stuhl', 'Stühle', 'alt'],
    ['bag', 'bags', 'small', 'Diese', 'Die', 'Tasche', 'Taschen', 'klein'],
    ['car', 'cars', 'fast', 'Dieses', 'Das', 'Auto', 'Autos', 'schnell'],
    ['shoe', 'shoes', 'dirty', 'Dieser', 'Der', 'Schuh', 'Schuhe', 'schmutzig'],
    ['key', 'keys', 'old', 'Dieser', 'Der', 'Schlüssel', 'Schlüssel', 'alt'],
    ['box', 'boxes', 'heavy', 'Diese', 'Die', 'Kiste', 'Kisten', 'schwer'],
  ];
  // Die vier Wörter: [Wort, mehrere?, weit weg?]
  const DEMO = [['This', 0, 0], ['That', 0, 1], ['These', 1, 0], ['Those', 1, 1]];
  const DS = [];
  DING.forEach(([sg, pl, adj, dies, art, deSg, dePl, deAdj]) => DEMO.forEach(([wort, viele, fern]) => DS.push({
    wort, viele, fern, ding: viele ? pl : sg, sg, pl, adj, ort: fern ? 'over there' : 'here', be: viele ? 'are' : 'is',
    text: `${wort} ${viele ? pl : sg} ${fern ? 'over there' : 'here'} ${viele ? 'are' : 'is'} ${adj}.`,
    de: viele ? `${fern ? 'Die' : 'Diese'} ${dePl} ${fern ? 'da drüben' : 'hier'} sind ${deAdj}.` : `${fern ? art : dies} ${deSg} ${fern ? 'da drüben' : 'hier'} ist ${deAdj}.`,
  })));
  const DEMO_TEXT = { This: 'eins, nah', That: 'eins, weit weg', These: 'mehrere, nah', Those: 'mehrere, weit weg' };
  const dWarum = (s) => `<b>${s.ding}</b>: ${s.viele ? 'mehrere' : 'eins'}. <b>${s.ort}</b>: ${s.fern ? 'weit weg' : 'nah'}. Dazu passt <b>${s.wort.toLowerCase()}</b>.`;
  const dLoesung = (s) => `<span lang="en"><b class="vb">${s.wort}</b> ${s.ding} ${s.ort} ${s.be} ${s.adj}.</span> ${U.say(s.text)}<br>${dWarum(s)}<br><small>Auf Deutsch: ${s.de}</small>`;
  const D_TIPP = 'Stell dir zwei Fragen. <b>Eins oder mehrere?</b> Und: <b>nah</b> (here) oder <b>weit weg</b> (over there)? this = eins, nah · that = eins, weit weg · these = mehrere, nah · those = mehrere, weit weg.';
  const DEX = (s, mode) => ({ mode: mode || 'wort', wort: s.wort, viele: s.viele, fern: s.fern, ding: s.ding, ort: s.ort, be: s.be, adj: s.adj, de: s.de });
  const DW = DEMO.map((d) => d[0]);
  // A: passendes Wort auswählen
  function dWahl() {
    const s = pick(DS), ch = shuffle(DW);
    return { prompt: `Was gehört in die Lücke?${en(`___ ${s.ding} ${s.ort} ${s.be} ${s.adj}.`)}`, choices: ch.map((c) => `<span lang="en">${c}</span>`), correct: ch.indexOf(s.wort), hint: D_TIPP, solution: dLoesung(s), ex: DEX(s) };
  }
  // B: eintippen
  function dTippen() {
    const s = pick(DS);
    return {
      prompt: 'Setze ein: <b>this</b>, <b>that</b>, <b>these</b> oder <b>those</b>.', layout: 'satz',
      fields: [{ type: 'text', ci: true, answer: s.wort, suffix: `${s.ding} ${s.ort} ${s.be} ${s.adj}.`, label: 'this, that, these oder those' }],
      hint: D_TIPP, solution: dLoesung(s), ex: DEX(s),
    };
  }
  // C: die Bedeutung der vier Wörter
  function dBedeutung() {
    const [wort] = pick(DEMO), richtung = Math.random() < 0.5;
    const s = pick(DS.filter((x) => x.wort === wort));
    if (richtung) {
      const ch = shuffle(DW);
      return { prompt: `Welches Wort bedeutet: <b>${DEMO_TEXT[wort]}</b>?`, choices: ch.map((c) => `<span lang="en">${c.toLowerCase()}</span>`), correct: ch.indexOf(wort), hint: D_TIPP, solution: `<b class="vb" lang="en">${wort.toLowerCase()}</b> = ${DEMO_TEXT[wort]}<br>Ein Beispiel: <span lang="en">${s.text}</span> ${U.say(s.text)}<br><small>${s.de}</small>`, ex: DEX(s) };
    }
    const ch = shuffle(DW);
    return { prompt: `Was bedeutet <b lang="en">${wort.toLowerCase()}</b>?`, choices: ch.map((c) => DEMO_TEXT[c]), correct: ch.indexOf(wort), hint: D_TIPP, solution: `<b class="vb" lang="en">${wort.toLowerCase()}</b> = ${DEMO_TEXT[wort]}<br>Ein Beispiel: <span lang="en">${s.text}</span> ${U.say(s.text)}<br><small>${s.de}</small>`, ex: DEX(s) };
  }
  // D: is oder are hinter this/that/these/those
  function dIsAre() {
    const s = pick(DS);
    return {
      prompt: 'Setze ein: <b>is</b> oder <b>are</b>.', layout: 'satz',
      fields: [{ type: 'text', ci: true, answer: s.be, prefix: `${s.wort} ${s.ding} ${s.ort}`, suffix: `${s.adj}.`, label: 'is oder are' }],
      hint: '<b>this</b> und <b>that</b> stehen für <b>eins</b>: is. <b>these</b> und <b>those</b> stehen für <b>mehrere</b>: are.',
      solution: `<span lang="en">${s.wort} ${s.ding} ${s.ort} <b class="vb">${s.be}</b> ${s.adj}.</span> ${U.say(s.text)}<br><b>${s.wort.toLowerCase()}</b> steht für ${s.viele ? 'mehrere, deshalb <b>are</b>' : 'eins, deshalb <b>is</b>'}.<br><small>Auf Deutsch: ${s.de}</small>`,
      ex: DEX(s, 'be'),
    };
  }
  // E: von eins zu mehreren und zurück (this ↔ these, that ↔ those)
  function dWechsel() {
    const s = pick(DS), z = DS.find((x) => x.sg === s.sg && x.fern === s.fern && x.viele !== s.viele);
    return {
      prompt: `Aus ${s.viele ? 'mehreren wird eins' : 'einem werden mehrere'}. Welches Wort gehört jetzt an den Anfang?${en(s.text)}`, layout: 'satz',
      fields: [{ type: 'text', ci: true, answer: z.wort, suffix: `${z.ding} ${z.ort} ${z.be} ${z.adj}.`, label: 'this, that, these oder those' }],
      hint: 'Nah bleibt nah, weit weg bleibt weit weg. Es wechselt nur eins ↔ mehrere: this ↔ these, that ↔ those.',
      solution: `<span lang="en">${s.text}</span> → ${dLoesung(z)}`, ex: DEX(z),
    };
  }
  const dieseJene = () => U.wahl([[28, dWahl], [24, dTippen], [16, dBedeutung], [16, dIsAre], [16, dWechsel]]);

  Object.assign(D.daten, { TFORM, TNEG, TH, TH1, TQ, thKurz, thNeg, thFrage, thJa, thNein, DS, DEMO, DEMO_TEXT });
  const themenVorThere = D.audioThemen;
  D.audioThemen = () => Object.assign(themenVorThere(), {
    'e5-there': [...TH.map((s) => s.text), ...TH1.map(thKurz), ...TH1.map(thNeg), ...TQ.map(thFrage), 'Yes, there is.', 'No, there isn’t.', 'Yes, there are.', 'No, there aren’t.'],
    'e5-this': DS.map((s) => s.text),
  });
  Object.assign(D.arten, {
    'e5-there': { thLuecke, thTippen, thSatz, thKurzform, thVerneinen, thFrageWahl, thFrageTippen, thAntwort },
    'e5-this': { dWahl, dTippen, dBedeutung, dIsAre, dWechsel },
  });

  // =====================================================
  // my, your, his, her, its, our, their
  // =====================================================
  const POSS = { I: 'My', You: 'Your', He: 'His', She: 'Her', It: 'Its', We: 'Our', They: 'Their' };
  const POSS_DE = { My: 'mein, meine', Your: 'dein, deine (auch: euer, eure)', His: 'sein, seine (von einem Jungen oder Mann)', Her: 'ihr, ihre (von einem Mädchen oder einer Frau)', Its: 'sein, ihr (von einem Tier oder einer Sache)', Our: 'unser, unsere', Their: 'ihr, ihre (von mehreren)' };
  const ALLE_POSS = Object.values(POSS);
  // [Besitzer, Pronomen dafür, have/has, was, das Ding, Rest des zweiten Satzes, Deutsch für den zweiten Satz]
  const PO = [
    ['I', 'I', 'have', 'a dog', 'dog', 'is black', 'Mein Hund ist schwarz.'],
    ['I', 'I', 'have', 'a sister', 'sister', 'is ten', 'Meine Schwester ist zehn.'],
    ['You', 'You', 'have', 'a nice bike', 'bike', 'is fast', 'Dein Fahrrad ist schnell.'],
    ['You', 'You', 'have', 'a brother', 'brother', 'is funny', 'Dein Bruder ist lustig.'],
    ['Tom', 'He', 'has', 'a cat', 'cat', 'is small', 'Seine Katze ist klein.'],
    ['He', 'He', 'has', 'a new bag', 'bag', 'is blue', 'Seine Tasche ist blau.'],
    ['My dad', 'He', 'has', 'a bike', 'bike', 'is very old', 'Sein Fahrrad ist sehr alt.'],
    ['Lisa', 'She', 'has', 'a rabbit', 'rabbit', 'is white', 'Ihr Kaninchen ist weiß.'],
    ['She', 'She', 'has', 'two brothers', 'brothers', 'are at school', 'Ihre Brüder sind in der Schule.'],
    ['My sister', 'She', 'has', 'a friend', 'friend', 'is from London', 'Ihre Freundin ist aus London.'],
    ['The dog', 'It', 'has', 'a ball', 'ball', 'is red', 'Sein Ball ist rot.'],
    ['The cat', 'It', 'has', 'a new bed', 'bed', 'is soft', 'Ihr Bett ist weich.'],
    ['The school', 'It', 'has', 'a garden', 'garden', 'is big', 'Ihr Garten ist groß.'],
    ['We', 'We', 'have', 'a new teacher', 'teacher', 'is nice', 'Unser Lehrer ist nett.'],
    ['We', 'We', 'have', 'a car', 'car', 'is old', 'Unser Auto ist alt.'],
    ['Tom and Lisa', 'They', 'have', 'a house', 'house', 'is small', 'Ihr Haus ist klein.'],
    ['They', 'They', 'have', 'three dogs', 'dogs', 'are in the garden', 'Ihre Hunde sind im Garten.'],
    ['My parents', 'They', 'have', 'a shop', 'shop', 'is near the school', 'Ihr Laden ist in der Nähe der Schule.'],
  ].map(([wer, pron, hv, was, ding, rest, de]) => ({ wer, pron, poss: POSS[pron], ding, rest, de,
    satz1: `${wer} ${hv} got ${was}.`, satz2: `${POSS[pron]} ${ding} ${rest}.`, text: `${wer} ${hv} got ${was}. ${POSS[pron]} ${ding} ${rest}.` }));
  const poWarum = (s) => `${s.wer === s.pron ? `Es gehört zu <b>${klein(s.pron)}</b>.` : `<b>${s.wer}</b>: Dafür kannst du <b>${klein(s.pron)}</b> sagen.`} Zu ${klein(s.pron)} gehört <b>${s.poss.toLowerCase()}</b>.`;
  const poLoesung = (s) => `<span lang="en">${s.satz1} <b class="vb">${s.poss}</b> ${s.ding} ${s.rest}.</span> ${U.say(s.text)}<br>${poWarum(s)}<br><small>Auf Deutsch: ${s.de}</small>`;
  const PO_TIPP = 'Frag: <b>Wem</b> gehört es? I → my · you → your · he → his · she → her · it → its · we → our · they → their. Es kommt auf den <b>Besitzer</b> an, nicht auf das Ding.';
  const POEX = (s, mode) => ({ mode: mode || 'satz', wer: s.wer, pron: s.pron, poss: s.poss, ding: s.ding, rest: s.rest, satz1: s.satz1, de: s.de });
  // A: auswählen
  function poWahl() {
    const s = pick(PO);
    const ch = shuffle([s.poss, ...shuffle(ALLE_POSS.filter((x) => x !== s.poss)).slice(0, 3)]);
    return { prompt: `Was gehört in die Lücke?${en(`${s.satz1} ___ ${s.ding} ${s.rest}.`)}`, choices: ch.map((c) => `<span lang="en">${c}</span>`), correct: ch.indexOf(s.poss), hint: PO_TIPP, solution: poLoesung(s), ex: POEX(s) };
  }
  // B: eintippen
  function poTippen() {
    const s = pick(PO);
    return {
      prompt: `Wem gehört es? Setze das passende Wort ein.${en(s.satz1)}`, layout: 'satz',
      fields: [{ type: 'text', ci: true, answer: s.poss, suffix: `${s.ding} ${s.rest}.`, label: 'my, your, his, her, its, our oder their' }],
      hint: PO_TIPP, solution: poLoesung(s), ex: POEX(s),
    };
  }
  // C: die Paare (I – my, she – her …) in beide Richtungen
  function poPaar() {
    const pron = pick(Object.keys(POSS)), hin = Math.random() < 0.5;
    const s = pick(PO.filter((x) => x.pron === pron));
    if (hin) {
      const ch = shuffle([POSS[pron], ...shuffle(ALLE_POSS.filter((x) => x !== POSS[pron])).slice(0, 3)]);
      return { prompt: `Welches Wort gehört zu <b lang="en">${klein(pron)}</b>?`, choices: ch.map((c) => `<span lang="en">${c.toLowerCase()}</span>`), correct: ch.indexOf(POSS[pron]), hint: PO_TIPP, solution: `${klein(pron)} → <b class="vb" lang="en">${POSS[pron].toLowerCase()}</b> (${POSS_DE[POSS[pron]]})<br>Ein Beispiel: <span lang="en">${s.text}</span> ${U.say(s.text)}`, ex: POEX(s, 'paar') };
    }
    const ps = Object.keys(POSS), ch = shuffle([pron, ...shuffle(ps.filter((x) => x !== pron)).slice(0, 3)]);
    return { prompt: `Zu welchem Wort gehört <b lang="en">${POSS[pron].toLowerCase()}</b>?`, choices: ch.map((c) => `<span lang="en">${klein(c)}</span>`), correct: ch.indexOf(pron), hint: PO_TIPP, solution: `<b class="vb" lang="en">${POSS[pron].toLowerCase()}</b> gehört zu ${klein(pron)} (${POSS_DE[POSS[pron]]})<br>Ein Beispiel: <span lang="en">${s.text}</span> ${U.say(s.text)}`, ex: POEX(s, 'paar') };
  }
  // D: his oder her? Es zählt der Besitzer, nicht das Ding (im Deutschen verwirrt „seine Schwester“ / „ihr Bruder“)
  function poHisHer() {
    const [wer, poss, ding, de] = pick([
      ['Tom', 'His', 'sister', 'seine Schwester'], ['Tom', 'His', 'mum', 'seine Mama'], ['Ben', 'His', 'aunt', 'seine Tante'],
      ['Lisa', 'Her', 'brother', 'ihr Bruder'], ['Lisa', 'Her', 'dad', 'ihr Papa'], ['Emma', 'Her', 'uncle', 'ihr Onkel'],
    ]);
    return {
      prompt: `<b>his</b> oder <b>her</b>?${en(`This is ${wer}. And this is ___ ${ding}.`)}`,
      choices: ['his', 'her'], correct: poss === 'His' ? 0 : 1,
      hint: 'Schau auf den <b>Besitzer</b>: Ist es ein Junge oder Mann → his. Ein Mädchen oder eine Frau → her. Wer oder was dahinter steht, ist egal.',
      solution: `<span lang="en">This is ${wer}. And this is <b class="vb">${poss.toLowerCase()}</b> ${ding}.</span> ${U.say(`This is ${wer}. And this is ${poss.toLowerCase()} ${ding}.`)}<br><b>${wer}</b> ist ${poss === 'His' ? 'ein Junge: <b>his</b>' : 'ein Mädchen: <b>her</b>'}. Dass ${ding} ${poss === 'His' ? 'weiblich' : 'männlich'} ist, spielt keine Rolle.<br><small>Auf Deutsch: ${de}</small>`,
      ex: { mode: 'hisher', wer, poss, ding, de },
    };
  }
  const HISHER = [['Tom', 'his', 'sister'], ['Tom', 'his', 'mum'], ['Ben', 'his', 'aunt'], ['Lisa', 'her', 'brother'], ['Lisa', 'her', 'dad'], ['Emma', 'her', 'uncle']].map(([w, p, d]) => `This is ${w}. And this is ${p} ${d}.`);
  // E: its oder it’s?
  function poIts() {
    const mitBesitz = Math.random() < 0.5;
    if (mitBesitz) {
      const s = pick(PO.filter((x) => x.pron === 'It'));
      return {
        prompt: `<b>Its</b> oder <b>It’s</b>?${en(`${s.satz1} ___ ${s.ding} ${s.rest}.`)}`, choices: ['Its', 'It’s'], correct: 0,
        hint: 'Mach die Probe: Kannst du <b>It is</b> einsetzen? Dann It’s (mit Apostroph). Wenn nicht, ist es <b>Its</b> und zeigt, wem etwas gehört.',
        solution: `${poLoesung(s)}<br>Probe: „It is ${s.ding} …“ ergibt keinen Sinn. Also <b>Its</b> ohne Apostroph.`, ex: POEX(s, 'its'),
      };
    }
    const b = pick(PRONS.filter((x) => x.subj === 'It'));
    return {
      prompt: `<b>Its</b> oder <b>It’s</b>?${en(`___ ${b.rest}.`)}`, choices: ['Its', 'It’s'], correct: 1,
      hint: 'Mach die Probe: Kannst du <b>It is</b> einsetzen? Dann It’s (mit Apostroph). Wenn nicht, ist es <b>Its</b> und zeigt, wem etwas gehört.',
      solution: `<span lang="en"><b class="vb">It’s</b> ${b.rest}.</span> ${U.say(kurzText(b))}<br>Probe: „It is ${b.rest}“ passt. <b>It’s</b> ist die Kurzform von It is.<br><small>Auf Deutsch: ${b.de}</small>`,
      ex: { mode: 'itis', rest: b.rest, de: b.de },
    };
  }
  const possessiv = () => U.wahl([[28, poWahl], [26, poTippen], [18, poPaar], [16, poHisHer], [12, poIts]]);

  // =====================================================
  // Wem gehört es? ’s und of
  // =====================================================
  // Personen und Tiere: [Besitzer, Ding, Deutsch]
  const GP = [
    ['Ben', 'bike', 'Bens Fahrrad'], ['Lisa', 'bag', 'Lisas Tasche'], ['Tom', 'dog', 'Toms Hund'], ['Mr Brown', 'garden', 'der Garten von Herrn Brown'],
    ['my mum', 'car', 'das Auto meiner Mama'], ['my brother', 'room', 'das Zimmer meines Bruders'], ['my friend', 'house', 'das Haus meines Freundes'],
    ['the teacher', 'desk', 'der Tisch des Lehrers'], ['the dog', 'ball', 'der Ball des Hundes'], ['the cat', 'bed', 'das Bett der Katze'],
  ].map(([wer, ding, de]) => ({ wer, ding, de, text: `${wer}’s ${ding}` }));
  // eins oder mehrere Besitzer: [Einzahl, Mehrzahl, Ding, deutsch eins, deutsch mehrere]
  const GM = [
    ['the girl', 'the girls', 'room', 'das Zimmer des Mädchens', 'das Zimmer der Mädchen'],
    ['the boy', 'the boys', 'ball', 'der Ball des Jungen', 'der Ball der Jungen'],
    ['my friend', 'my friends', 'house', 'das Haus meines Freundes', 'das Haus meiner Freunde'],
    ['the teacher', 'the teachers', 'room', 'das Zimmer des Lehrers', 'das Zimmer der Lehrer'],
    ['my sister', 'my sisters', 'cat', 'die Katze meiner Schwester', 'die Katze meiner Schwestern'],
  ].map(([sg, pl, ding, de1, de2]) => ({ sg, pl, ding, de1, de2, eins: `${sg}’s ${ding}`, viele: `${pl}’ ${ding}` }));
  // Sachen: [Teil, Sache, Deutsch]
  const GO = [
    ['the door', 'the house', 'die Tür des Hauses'], ['the name', 'the street', 'der Name der Straße'], ['the end', 'the film', 'das Ende des Films'],
    ['the colour', 'the car', 'die Farbe des Autos'], ['the roof', 'the school', 'das Dach der Schule'], ['the first page', 'the book', 'die erste Seite des Buches'],
  ].map(([teil, sache, de]) => ({ teil, sache, de, text: `${teil} of ${sache}` }));
  const apo = (t) => [t, t.replace(/’/g, "'")];
  const G_TIPP = 'Gehört etwas einer <b>Person</b> oder einem <b>Tier</b>, hängst du <b>’s</b> an den Besitzer: Ben’s bike. Im Englischen steht immer ein Apostroph (anders als im Deutschen: Bens Fahrrad).';
  // A: mit ’s schreiben
  function gTippen() {
    const g = pick(GP);
    return {
      prompt: `Wem gehört es? Schreibe es mit <b>’s</b>.<br>Besitzer: <b lang="en">${g.wer}</b> · Ding: <b lang="en">${g.ding}</b>`,
      fields: [{ type: 'text', ci: true, answer: apo(g.text), label: 'mit ’s' }], answerText: g.text,
      hint: G_TIPP,
      solution: `<span lang="en">${g.wer}<b class="vb">’s</b> ${g.ding}</span> ${U.say(g.text)}<br>Erst der Besitzer mit <b>’s</b>, dann das Ding. Ohne the davor und ohne of.<br><small>Auf Deutsch: ${g.de}</small>`,
      ex: { mode: 's', wer: g.wer, ding: g.ding, de: g.de },
    };
  }
  // B: richtige Schreibweise auswählen
  function gWahl() {
    const g = pick(GP);
    const ch = shuffle([g.text, `${g.wer}s ${g.ding}`, `${g.wer} ${g.ding}’s`]);
    return {
      prompt: `Welche Schreibweise ist richtig? (${g.de})`,
      choices: ch.map((c) => `<span lang="en">${c}</span>`), correct: ch.indexOf(g.text),
      hint: G_TIPP,
      solution: `<span lang="en">${g.wer}<b class="vb">’s</b> ${g.ding}</span> ${U.say(g.text)}<br>Der Apostroph und das s hängen am <b>Besitzer</b>. Im Englischen darf der Apostroph nicht fehlen.<br><small>Auf Deutsch: ${g.de}</small>`,
      ex: { mode: 's', wer: g.wer, ding: g.ding, de: g.de },
    };
  }
  // C: ein Besitzer oder mehrere? (’s oder s’)
  function gWieViele() {
    const g = pick(GM), viele = Math.random() < 0.5;
    return {
      prompt: `Wie viele Besitzer sind es?${en(viele ? g.viele : g.eins)}`,
      choices: ['einer', 'mehrere'], correct: viele ? 1 : 0,
      hint: 'Schau, wo der Apostroph steht. <b>Vor</b> dem s (girl’s): ein Besitzer. <b>Hinter</b> dem s (girls’): mehrere Besitzer.',
      solution: `<span lang="en"><b class="vb">${viele ? g.viele : g.eins}</b></span> ${U.say(viele ? g.viele : g.eins)}<br>${viele ? `Das Wort heißt schon <b>${g.pl.split(' ').pop()}</b> (Mehrzahl mit s). Dann kommt nur noch der Apostroph dahinter.` : `<b>${g.sg.split(' ').pop()}</b> ist Einzahl. Dann kommt <b>’s</b> dazu.`} Beim Sprechen hört man den Unterschied nicht.<br><small>Auf Deutsch: ${viele ? g.de2 : g.de1}</small>`,
      ex: { mode: 'viele', sg: g.sg, pl: g.pl, ding: g.ding, viele, de: viele ? g.de2 : g.de1 },
    };
  }
  // D: den Apostroph richtig setzen
  function gApostroph() {
    const g = pick(GM), viele = Math.random() < 0.5, richtig = viele ? g.viele : g.eins;
    const ch = shuffle([g.eins, g.viele, `${g.pl} ${g.ding}`]);
    return {
      prompt: `Wie schreibt man das auf Englisch?<br><b>${viele ? g.de2 : g.de1}</b>`,
      choices: ch.map((c) => `<span lang="en">${c}</span>`), correct: ch.indexOf(richtig),
      hint: 'Ein Besitzer: <b>’s</b> anhängen (girl’s). Mehrere Besitzer, deren Wort schon auf s endet: nur den Apostroph <b>hinter</b> das s (girls’).',
      solution: `<span lang="en"><b class="vb">${richtig}</b></span> ${U.say(richtig)}<br>${viele ? `Mehrere: <b>${g.pl}</b> endet schon auf s, also nur noch der Apostroph dahinter.` : `Einer: <b>${g.sg}</b> + <b>’s</b>.`} Ohne Apostroph ist es immer falsch.`,
      ex: { mode: 'viele', sg: g.sg, pl: g.pl, ding: g.ding, viele, de: viele ? g.de2 : g.de1 },
    };
  }
  // E: bei Sachen nimmt man of
  function gOfWahl() {
    const o = pick(GO);
    const ch = shuffle([o.sache, ...shuffle(GP).slice(0, 2).map((g) => g.wer)]);
    return {
      prompt: 'Bei Personen und Tieren nimmt man ’s. Bei welchem Besitzer nimmt man stattdessen <b>of</b>?',
      choices: ch.map((c) => `<span lang="en">${c}</span>`), correct: ch.indexOf(o.sache),
      hint: 'Was davon ist eine <b>Sache</b> und keine Person und kein Tier?',
      solution: `<b lang="en">${o.sache}</b> ist eine Sache. Dann heißt es: <span lang="en">${o.teil} <b class="vb">of</b> ${o.sache}</span> ${U.say(o.text)}<br><small>Auf Deutsch: ${o.de}</small>`,
      ex: { mode: 'of', teil: o.teil, sache: o.sache, de: o.de },
    };
  }
  // F: mit of schreiben
  function gOfTippen() {
    const o = pick(GO);
    return {
      prompt: `Verbinde die beiden Teile mit <b>of</b> und schreibe alles auf.<br>Teil: <b lang="en">${o.teil}</b> · Sache: <b lang="en">${o.sache}</b>`,
      fields: [{ type: 'text', ci: true, answer: o.text, label: 'mit of' }],
      hint: 'Bei Sachen steht zuerst der Teil, dann das kleine Wort <b>of</b> (von), dann die Sache. Kein ’s.',
      solution: `<span lang="en">${o.teil} <b class="vb">of</b> ${o.sache}</span> ${U.say(o.text)}<br><b>${o.sache}</b> ist eine Sache, deshalb <b>of</b> und kein ’s.<br><small>Auf Deutsch: ${o.de}</small>`,
      ex: { mode: 'of', teil: o.teil, sache: o.sache, de: o.de },
    };
  }
  const genitiv = () => U.wahl([[26, gTippen], [18, gWahl], [14, gWieViele], [16, gApostroph], [12, gOfWahl], [14, gOfTippen]]);

  Object.assign(D.daten, { POSS, POSS_DE, PO, GP, GM, GO });
  const themenVorPoss = D.audioThemen;
  D.audioThemen = () => Object.assign(themenVorPoss(), {
    'e5-poss': [...PO.map((s) => s.text), ...HISHER],
    'e5-gen': [...GP.map((g) => g.text), ...GM.flatMap((g) => [g.eins, g.viele]), ...GO.map((o) => o.text)],
  });
  Object.assign(D.arten, {
    'e5-poss': { poWahl, poTippen, poPaar, poHisHer, poIts },
    'e5-gen': { gTippen, gWahl, gWieViele, gApostroph, gOfWahl, gOfTippen },
  });

  // =====================================================
  // Aufforderungen (Imperativ)
  // =====================================================
  // [Aufforderung (klein geschrieben), Deutsch, Deutsch verneint]
  const IMP = [
    ['open the window', 'Mach das Fenster auf.', 'Mach das Fenster nicht auf.'],
    ['close the door', 'Mach die Tür zu.', 'Mach die Tür nicht zu.'],
    ['sit down', 'Setz dich hin.', 'Setz dich nicht hin.'],
    ['stand up', 'Steh auf.', 'Steh nicht auf.'],
    ['come here', 'Komm her.', 'Komm nicht her.'],
    ['write on the board', 'Schreib an die Tafel.', 'Schreib nicht an die Tafel.'],
    ['open your book', 'Schlag dein Buch auf.', 'Schlag dein Buch nicht auf.'],
    ['talk to Ben', 'Sprich mit Ben.', 'Sprich nicht mit Ben.'],
    ['touch the dog', 'Fass den Hund an.', 'Fass den Hund nicht an.'],
    ['eat the cake', 'Iss den Kuchen.', 'Iss den Kuchen nicht.'],
    ['go into the garden', 'Geh in den Garten.', 'Geh nicht in den Garten.'],
    ['take my pen', 'Nimm meinen Stift.', 'Nimm meinen Stift nicht.'],
  ].map(([p, de, deNeg]) => ({ p, de, deNeg, verb: p.split(' ')[0], rest: p.split(' ').slice(1).join(' '), pos: `${gross(p)}.`, neg: `Don’t ${p}.` }));
  // Aufforderungen mit be: [Satz, Deutsch, verneint?]
  const IMPBE = [['Be quiet.', 'Sei leise.', 0], ['Be careful.', 'Sei vorsichtig.', 0], ['Don’t be late.', 'Komm nicht zu spät.', 1], ['Don’t be sad.', 'Sei nicht traurig.', 1]]
    .map(([text, de, neg]) => ({ text, de, neg, rest: text.replace(/^(Don’t be|Be) /, '').replace('.', '') }));
  const IMP_TIPP = 'Eine Aufforderung beginnt direkt mit dem <b>Verb</b>, ohne you: Open the window. Soll jemand etwas <b>nicht</b> tun, kommt <b>Don’t</b> davor: Don’t open the window.';
  const DONT = ['Don’t', 'Don\'t', 'Do not'];
  // A: verneinen (Don’t eintippen)
  function impNeg() {
    const s = pick(IMP);
    return {
      prompt: `Jetzt soll man es <b>nicht</b> tun. Was gehört an den Anfang?${en(s.pos)}`, layout: 'satz',
      fields: [{ type: 'text', ci: true, answer: DONT, suffix: `${s.p}.`, label: 'ein Wort' }], answerText: 'Don’t (oder: Do not)',
      hint: IMP_TIPP,
      solution: `<span lang="en">${s.pos}</span> → <span lang="en"><b class="vb">Don’t</b> ${s.p}.</span> ${U.say(s.neg)}<br><b>Don’t</b> ist kurz für Do not. Danach steht das Verb klein und unverändert.<br><small>Auf Deutsch: ${s.deNeg}</small>`,
      ex: { mode: 'neg', p: s.p, de: s.deNeg },
    };
  }
  // B: richtigen verneinten Satz auswählen
  function impNegWahl() {
    const s = pick(IMP);
    const ch = shuffle([s.neg, `Not ${s.p}.`, `Doesn’t ${s.p}.`]);
    return {
      prompt: `Wie sagst du auf Englisch: <b>${s.deNeg}</b>`,
      choices: ch.map((c) => `<span lang="en">${c}</span>`), correct: ch.indexOf(s.neg),
      hint: IMP_TIPP,
      solution: `<span lang="en"><b class="vb">Don’t</b> ${s.p}.</span> ${U.say(s.neg)}<br>Bei Aufforderungen heißt es immer <b>Don’t</b>, egal zu wem man spricht.<br><small>Auf Deutsch: ${s.deNeg}</small>`,
      ex: { mode: 'neg', p: s.p, de: s.deNeg },
    };
  }
  // C: richtige Aufforderung auswählen (ohne you, ohne -s, ohne to)
  function impWahl() {
    const s = pick(IMP);
    const ch = shuffle([s.pos, `${gross(mitS(s.verb))}${s.rest ? ' ' + s.rest : ''}.`, `To ${s.p}.`]);
    return {
      prompt: `Wie sagst du auf Englisch: <b>${s.de}</b>`,
      choices: ch.map((c) => `<span lang="en">${c}</span>`), correct: ch.indexOf(s.pos),
      hint: IMP_TIPP,
      solution: `<span lang="en"><b class="vb">${gross(s.verb)}</b>${s.rest ? ' ' + s.rest : ''}.</span> ${U.say(s.pos)}<br>Die Aufforderung ist einfach das Verb in der Grundform: ohne you, ohne -s, ohne to.<br><small>Auf Deutsch: ${s.de}</small>`,
      ex: { mode: 'pos', p: s.p, de: s.de },
    };
  }
  // D: das Verb eintippen
  function impVerb() {
    const s = pick(IMP.filter((x) => x.rest));
    return {
      prompt: `Wie heißt die Aufforderung? <b>${s.de}</b>`, layout: 'satz',
      fields: [{ type: 'text', ci: true, answer: gross(s.verb), suffix: `${s.rest}.`, label: 'Verb' }],
      hint: `Das gesuchte Verb heißt in der Grundform <b lang="en">${s.verb}</b>. Was musst du daran ändern?`,
      solution: `<span lang="en"><b class="vb">${gross(s.verb)}</b> ${s.rest}.</span> ${U.say(s.pos)}<br>Nichts ändern: Die Aufforderung ist die Grundform. Nur der Satzanfang wird großgeschrieben.<br><small>Auf Deutsch: ${s.de}</small>`,
      ex: { mode: 'pos', p: s.p, de: s.de },
    };
  }
  // E: verstehen: Was bedeutet die Aufforderung?
  function impVerstehen() {
    const s = pick(IMP), neg = Math.random() < 0.6, t = pick(IMP.filter((x) => x !== s));
    const richtig = neg ? s.deNeg : s.de;
    const ch = shuffle([richtig, neg ? s.de : s.deNeg, neg ? t.deNeg : t.de]);
    return {
      prompt: `Was bedeutet das? ${U.say(neg ? s.neg : s.pos)}${en(neg ? s.neg : s.pos)}`,
      choices: ch, correct: ch.indexOf(richtig),
      hint: 'Steht <b>Don’t</b> am Anfang? Dann soll man es <b>nicht</b> tun.',
      solution: `<span lang="en"><b class="vb">${neg ? s.neg : s.pos}</b></span> ${U.say(neg ? s.neg : s.pos)}<br>= ${richtig}${neg ? '<br><b>Don’t</b> am Anfang heißt: Tu das nicht.' : ''}`,
      ex: { mode: neg ? 'neg' : 'pos', p: s.p, de: richtig },
    };
  }
  // F: Aufforderungen mit be
  function impBe() {
    const s = pick(IMPBE);
    return {
      prompt: `Was gehört in die Lücke? (${s.de})${en(s.neg ? `Don’t ___ ${s.rest}.` : `___ ${s.rest}.`)}`,
      choices: s.neg ? ['be', 'are', 'is'] : ['Be', 'Are', 'Is'], correct: 0,
      hint: 'Die Aufforderung ist immer die <b>Grundform</b> des Verbs. Die Grundform von am, is, are heißt <b>be</b>.',
      solution: `<span lang="en">${s.text.replace(/\b(be|Be)\b/, '<b class="vb">$1</b>')}</span> ${U.say(s.text)}<br>Die Grundform von am, is, are ist <b>be</b>. Deshalb: Be quiet. Don’t be late.<br><small>Auf Deutsch: ${s.de}</small>`,
      ex: { mode: 'be', text: s.text, neg: s.neg, rest: s.rest, de: s.de },
    };
  }
  const imperativ = () => U.wahl([[22, impNeg], [16, impNegWahl], [18, impWahl], [18, impVerb], [16, impVerstehen], [10, impBe]]);

  // =====================================================
  // can und must
  // =====================================================
  // [Subjekt, was, Deutsch, Pronomen für die Kurzantwort]
  const CAN = [
    ['I', 'swim', 'Ich kann schwimmen.', ''], ['You', 'sing well', 'Du kannst gut singen.', ''],
    ['He', 'play the guitar', 'Er kann Gitarre spielen.', 'he'], ['She', 'ride a horse', 'Sie kann reiten.', 'she'],
    ['We', 'speak English', 'Wir können Englisch sprechen.', ''], ['They', 'run fast', 'Sie können schnell rennen.', 'they'],
    ['Tom', 'cook', 'Tom kann kochen.', 'he'], ['Lisa', 'ride a bike', 'Lisa kann Fahrrad fahren.', 'she'],
    ['My dog', 'jump high', 'Mein Hund kann hoch springen.', 'it'], ['My sister', 'draw', 'Meine Schwester kann zeichnen.', 'she'],
  ].map(([subj, vp, de, pr]) => ({ subj, vp, de, pr, wort: 'can', text: `${subj} can ${vp}.`, neg: `${subj} can’t ${vp}.`, frage: `Can ${subjKlein(subj)} ${vp}?` }));
  const MUST = [
    ['I', 'do my homework', 'Ich muss meine Hausaufgaben machen.'], ['You', 'be quiet', 'Du musst leise sein.'],
    ['He', 'tidy his room', 'Er muss sein Zimmer aufräumen.'], ['She', 'go to bed', 'Sie muss ins Bett gehen.'],
    ['We', 'wait here', 'Wir müssen hier warten.'], ['They', 'help their mum', 'Sie müssen ihrer Mama helfen.'],
    ['Tom', 'feed the dog', 'Tom muss den Hund füttern.'],
  ].map(([subj, vp, de]) => ({ subj, vp, de, wort: 'must', text: `${subj} must ${vp}.` }));
  const MUSTNT = [
    ['You', 'run in the classroom', 'Du darfst im Klassenzimmer nicht rennen.'], ['We', 'be late', 'Wir dürfen nicht zu spät kommen.'],
    ['He', 'touch the dog', 'Er darf den Hund nicht anfassen.'], ['They', 'eat in the library', 'Sie dürfen in der Bücherei nicht essen.'],
    ['You', 'talk in the test', 'Du darfst im Test nicht reden.'], ['I', 'forget my book', 'Ich darf mein Buch nicht vergessen.'],
  ].map(([subj, vp, de]) => ({ subj, vp, de, wort: 'mustn’t', text: `${subj} mustn’t ${vp}.` }));
  const CMM = [...CAN, ...MUST, ...MUSTNT];
  const CAN_KA = CAN.filter((s) => s.pr);
  const CAN_DE = { can: 'können', must: 'müssen', 'mustn’t': 'nicht dürfen' };
  const cMark = (s) => `<span lang="en">${s.subj} <b class="vb">${s.wort}</b> ${s.vp}.</span>`;
  const CAN_TIPP = '<b>can</b> (können) und <b>must</b> (müssen) sind bei allen Personen gleich: kein -s bei he, she, it. Dahinter steht das Verb in der <b>Grundform</b>, ohne to.';
  const CEX = (s, mode, ja) => ({ mode, subj: s.subj, vp: s.vp, wort: s.wort, de: s.de, pr: s.pr || '', ja: !!ja });
  const verbVon = (vp) => vp.split(' ')[0];
  const mitS = (v) => (/(s|sh|ch|x|o)$/.test(v) ? v + 'es' : /[^aeiou]y$/.test(v) ? v.slice(0, -1) + 'ies' : v + 's');
  // A: can / must ohne -s
  function canForm() {
    const s = pick([...CAN, ...MUST].filter((x) => !['I', 'You', 'We', 'They'].includes(x.subj)));
    const ch = shuffle([s.wort, s.wort + 's', `${s.wort} to`]);
    return {
      prompt: `Was gehört in die Lücke? (${s.de})${en(`${s.subj} ___ ${s.vp}.`)}`,
      choices: ch.map((c) => `<span lang="en">${c}</span>`), correct: ch.indexOf(s.wort),
      hint: CAN_TIPP,
      solution: `${cMark(s)} ${U.say(s.text)}<br><b>${s.wort}</b> bekommt nie ein -s, auch nicht bei he, she, it. Und es steht kein to dahinter.<br><small>Auf Deutsch: ${s.de}</small>`,
      ex: CEX(s, 'form'),
    };
  }
  // B: das Verb dahinter in der Grundform
  function canVerb() {
    const s = pick([...CAN, ...MUST].filter((x) => !['I', 'You', 'We', 'They'].includes(x.subj) && verbVon(x.vp) !== 'be'));
    const v = verbVon(s.vp), rest = s.vp.split(' ').slice(1).join(' ');
    const ch = shuffle([v, mitS(v), `to ${v}`]);
    return {
      prompt: `Was gehört in die Lücke? (${s.de})${en(`${s.subj} ${s.wort} ___${rest ? ' ' + rest : ''}.`)}`,
      choices: ch.map((c) => `<span lang="en">${c}</span>`), correct: ch.indexOf(v),
      hint: CAN_TIPP,
      solution: `<span lang="en">${s.subj} ${s.wort} <b class="vb">${v}</b>${rest ? ' ' + rest : ''}.</span> ${U.say(s.text)}<br>Hinter ${s.wort} steht das Verb in der <b>Grundform</b>: ohne -s und ohne to.<br><small>Auf Deutsch: ${s.de}</small>`,
      ex: CEX(s, 'verb'),
    };
  }
  // C: can verneinen
  function canNeg() {
    const s = pick(CAN);
    return {
      prompt: `Verneine den Satz: Setze die <b>verneinte</b> Form von can ein.${en(s.text)}`, layout: 'satz',
      fields: [{ type: 'text', ci: true, answer: ['can’t', 'can\'t', 'cannot'], prefix: s.subj, suffix: `${s.vp}.`, label: 'verneinte Form' }],
      answerText: 'can’t (oder: cannot)',
      hint: 'Aus can wird <b>can’t</b>. Ausgeschrieben heißt es <b>cannot</b>, in einem Wort.',
      solution: `<span lang="en">${s.subj} <b class="vb">can’t</b> ${s.vp}.</span> ${U.say(s.neg)}<br><b>can’t</b> ist kurz für <b>cannot</b> (ein Wort). Das Verb dahinter bleibt unverändert.`,
      ex: CEX(s, 'neg'),
    };
  }
  // D: Frage mit can
  function canFrage() {
    const s = pick(CAN), tippen = Math.random() < 0.45;
    const lo = `<span lang="en">${s.subj} <b>can</b> ${s.vp}.</span> → <span lang="en"><b class="vb">Can</b> ${subjKlein(s.subj)} ${s.vp}?</span> ${U.say(s.frage)}<br>Bei der Frage tauschen can und die Person die Plätze. Es braucht kein do oder does.`;
    if (tippen) return {
      prompt: `Mache aus dem Satz eine Frage und schreibe sie auf.${en(s.text)}`,
      fields: [{ type: 'text', ci: true, answer: s.frage, label: 'Frage' }],
      hint: 'Wie bei to be: Die ersten beiden Teile tauschen die Plätze. Erst <b>Can</b>, dann die Person.', solution: lo, ex: CEX(s, 'frage'),
    };
    const v = verbVon(s.vp), rest = s.vp.split(' ').slice(1).join(' ');
    const ch = shuffle([s.frage, `Does ${subjKlein(s.subj)} can ${s.vp}?`, `Can ${subjKlein(s.subj)} ${mitS(v)}${rest ? ' ' + rest : ''}?`]);
    return {
      prompt: `Mache aus dem Satz eine Frage. Welche ist richtig?${en(s.text)}`,
      choices: ch.map((c) => `<span lang="en">${c}</span>`), correct: ch.indexOf(s.frage),
      hint: 'Wie bei to be: Die ersten beiden Teile tauschen die Plätze. Erst <b>Can</b>, dann die Person.', solution: lo, ex: CEX(s, 'frage'),
    };
  }
  // E: Kurzantwort
  function canAntwort() {
    const s = pick(CAN_KA), ja = Math.random() < 0.5;
    const richtig = ja ? `Yes, ${s.pr} can.` : `No, ${s.pr} can’t.`;
    const falsch = ja ? [`Yes, ${s.pr} cans.`, `Yes, ${s.pr} ${s.pr === 'they' ? 'do' : 'does'}.`] : [`No, ${s.pr} not can.`, `No, ${s.pr} ${s.pr === 'they' ? 'don’t' : 'doesn’t'}.`];
    const ch = shuffle([richtig, ...falsch]);
    return {
      prompt: `Antworte kurz mit <b>${ja ? 'Ja' : 'Nein'}</b>.${en(s.frage)}`,
      choices: ch.map((c) => `<span lang="en">${c}</span>`), correct: ch.indexOf(richtig),
      hint: 'Die Kurzantwort nimmt das Wort <b>can</b> aus der Frage wieder auf: Yes, … can. / No, … can’t.',
      solution: `<span lang="en">${s.frage}</span><br><span lang="en"><b class="vb">${richtig}</b></span> ${U.say(richtig)}<br>${s.subj.toLowerCase() !== s.pr ? `Für <b>${s.subj}</b> steht in der Antwort <b>${s.pr}</b>. ` : ''}In der Antwort steht wieder can, nicht do oder does.`,
      ex: CEX(s, 'kurz', ja),
    };
  }
  // F: can, must oder mustn’t? (nach der deutschen Bedeutung)
  function canWelches() {
    const s = pick(CMM);
    return {
      prompt: `Welches Wort passt? <b>${s.de}</b>${en(`${s.subj} ___ ${s.vp}.`)}`,
      choices: ['can', 'must', 'mustn’t'], correct: ['can', 'must', 'mustn’t'].indexOf(s.wort),
      hint: '<b>can</b> = können · <b>must</b> = müssen · <b>mustn’t</b> = nicht dürfen.',
      solution: `${cMark(s)} ${U.say(s.text)}<br><b>${s.wort}</b> heißt <b>${CAN_DE[s.wort]}</b>.<br><small>Auf Deutsch: ${s.de}</small>`,
      ex: CEX(s, 'wort'),
    };
  }
  // G: mustn’t heißt „nicht dürfen“ (nicht „nicht müssen“)
  function canMustnt() {
    const s = pick(MUSTNT);
    const darf = s.de, muss = s.de.replace(/darfst/, 'musst').replace(/dürfen/, 'müssen').replace(/darf/, 'muss'), kann = s.de.replace(/darfst/, 'kannst').replace(/dürfen/, 'können').replace(/darf/, 'kann');
    const ch = shuffle([darf, muss, kann]);
    return {
      prompt: `Was bedeutet das?${en(s.text)}`,
      choices: ch, correct: ch.indexOf(darf),
      hint: 'Vorsicht, <b>mustn’t</b> sieht aus wie „muss nicht“, bedeutet aber etwas Strengeres: ein Verbot.',
      solution: `${cMark(s)} ${U.say(s.text)}<br>= ${darf}<br><b>mustn’t</b> ist ein <b>Verbot</b>: nicht dürfen. Es heißt nicht „nicht müssen“.`,
      ex: CEX(s, 'wort'),
    };
  }
  const canMust = () => U.wahl([[16, canForm], [16, canVerb], [14, canNeg], [14, canFrage], [10, canAntwort], [18, canWelches], [12, canMustnt]]);

  Object.assign(D.daten, { IMP, IMPBE, CAN, MUST, MUSTNT, CMM, CAN_KA, CAN_DE });
  const themenVorImp = D.audioThemen;
  D.audioThemen = () => Object.assign(themenVorImp(), {
    'e5-imp': [...IMP.flatMap((s) => [s.pos, s.neg]), ...IMPBE.map((s) => s.text)],
    'e5-can': [...CAN.flatMap((s) => [s.text, s.neg, s.frage]), ...MUST.map((s) => s.text), ...MUSTNT.map((s) => s.text),
      ...['he', 'she', 'it', 'they'].flatMap((p) => [`Yes, ${p} can.`, `No, ${p} can’t.`])],
  });
  Object.assign(D.arten, {
    'e5-imp': { impNeg, impNegWahl, impWahl, impVerb, impVerstehen, impBe },
    'e5-can': { canForm, canVerb, canNeg, canFrage, canAntwort, canWelches, canMustnt },
  });

  // =====================================================
  // Bereich 2: present simple (Aussage, Verneinung, Frage)
  // =====================================================
  // Wörter in Reihenfolge bringen: teile in richtiger Reihenfolge → gemischt (nie schon richtig sortiert)
  U.ordne = (teile, end, auch) => {
    let w = teile.slice();
    for (let k = 0; k < 20 && w.join(' ') === teile.join(' '); k++) w = shuffle(teile);
    return { words: w, answer: [teile.join(' '), ...(auch || [])], end: end || '.' };
  };
  // he/she/it-Form: have → has, do → does, go → goes, sonst wie bei der Mehrzahl (-s, -es, -ies); „get up“ → „gets up“
  const sForm = (v) => { const [a, ...r] = v.split(' '); const f = a === 'have' ? 'has' : mitS(a); return [f, ...r].join(' '); };
  const sFalsch = (v) => { const [a, ...r] = v.split(' '); const f = a === 'have' ? 'haves' : /(s|sh|ch|x|o)$/.test(a) ? a + 's' : /[^aeiou]y$/.test(a) ? a + 's' : a + 'es'; return [f, ...r].join(' '); };
  // [Subjekt, Gruppe (0 = I/you/we/they, 1 = he/she/it), Verb in der Grundform, Rest, Deutsch, Pronomen]
  const PSS = [
    ['I', 0, 'play', 'football on Saturdays', 'Ich spiele samstags Fußball.'],
    ['I', 0, 'get up', 'at seven o’clock', 'Ich stehe um sieben Uhr auf.'],
    ['You', 0, 'like', 'pizza', 'Du magst Pizza.'],
    ['We', 0, 'live', 'in Dresden', 'Wir wohnen in Dresden.'],
    ['We', 0, 'have', 'lunch at school', 'Wir essen in der Schule zu Mittag.'],
    ['They', 0, 'go', 'to school by bus', 'Sie fahren mit dem Bus zur Schule.', 'they'],
    ['My friends', 0, 'watch', 'TV in the evening', 'Meine Freunde sehen abends fern.', 'they'],
    ['Tom and Lisa', 0, 'walk', 'to school', 'Tom und Lisa gehen zu Fuß zur Schule.', 'they'],
    ['He', 1, 'play', 'the piano', 'Er spielt Klavier.', 'he'],
    ['He', 1, 'do', 'his homework after school', 'Er macht nach der Schule seine Hausaufgaben.', 'he'],
    ['She', 1, 'like', 'dogs', 'Sie mag Hunde.', 'she'],
    ['She', 1, 'go', 'to bed at nine', 'Sie geht um neun ins Bett.', 'she'],
    ['She', 1, 'carry', 'her bag to school', 'Sie trägt ihre Tasche zur Schule.', 'she'],
    ['It', 1, 'rain', 'a lot in England', 'In England regnet es viel.', 'it'],
    ['Tom', 1, 'live', 'in London', 'Tom wohnt in London.', 'he'],
    ['Lisa', 1, 'tidy', 'her room on Fridays', 'Lisa räumt freitags ihr Zimmer auf.', 'she'],
    ['My brother', 1, 'watch', 'football on TV', 'Mein Bruder schaut Fußball im Fernsehen.', 'he'],
    ['My mum', 1, 'have', 'breakfast at six', 'Meine Mama frühstückt um sechs.', 'she'],
    ['My dad', 1, 'wash', 'the car on Sundays', 'Mein Papa wäscht sonntags das Auto.', 'he'],
    ['The dog', 1, 'sleep', 'in the kitchen', 'Der Hund schläft in der Küche.', 'it'],
  ].map(([subj, g, base, rest, de, pr]) => {
    const form = g ? sForm(base) : base, dn = g ? 'doesn’t' : 'don’t', dd = g ? 'Does' : 'Do';
    return { subj, g, base, form, rest, de, pr: pr || '', dn, dd, text: `${subj} ${form} ${rest}.`, neg: `${subj} ${dn} ${base} ${rest}.`, frage: `${dd} ${subjKlein(subj)} ${base} ${rest}?` };
  });
  const PS1 = PSS.filter((s) => s.g === 1), PS0 = PSS.filter((s) => s.g === 0);
  const PSQ = PSS.filter((s) => s.subj !== 'I');       // Fragen ohne „I“
  const PSKA = PSQ.filter((s) => s.pr);                 // Kurzantworten: he, she, it, they
  const VERBEN = [...new Set(PSS.map((s) => s.base))];
  const sRegel = (v) => { const a = v.split(' ')[0];
    return a === 'have' ? 'have ist unregelmäßig: <b>has</b>.' : a === 'do' || a === 'go' ? `Nach o kommt <b>-es</b>: ${sForm(a)}.` : /(s|sh|ch|x)$/.test(a) ? `Nach einem Zischlaut (${a.slice(-2).replace(/^[^sc]/, '')}) kommt <b>-es</b>: ${sForm(a)}.`
      : /[^aeiou]y$/.test(a) ? `Konsonant + y: Aus y wird <b>-ies</b>: ${sForm(a)}.` : `Einfach <b>-s</b> anhängen: ${sForm(a)}.`; };
  const psMark = (s) => `<span lang="en">${s.subj} <b class="vb">${s.form}</b> ${s.rest}.</span>`;
  const psWarum = (s) => (s.g === 0
    ? `${s.pr && s.subj.toLowerCase() !== s.pr ? `<b>${s.subj}</b> sind mehrere (they). ` : ''}Bei I, you, we, they bleibt das Verb, wie es ist: <b>${s.base}</b>.`
    : `${s.subj.toLowerCase() !== s.pr ? `<b>${s.subj}</b> ist eine Person oder Sache (${s.pr}). ` : ''}Bei he, she, it bekommt das Verb ein <b>s</b>. ${sRegel(s.base)}`);
  const psLoesung = (s) => `${psMark(s)} ${U.say(s.text)}<br>${psWarum(s)}<br><small>Auf Deutsch: ${s.de}</small>`;
  const PS_TIPP = 'Das present simple sagt, was jemand <b>regelmäßig</b> tut. Merksatz: <b>he, she, it – das s muss mit</b>. Bei I, you, we, they bleibt das Verb ohne s.';
  const PSEX = (s, mode, ja) => ({ mode: mode || 'form', subj: s.subj, g: s.g, base: s.base, form: s.form, rest: s.rest, de: s.de, pr: s.pr, ja: !!ja });
  // A: Form auswählen
  function psLuecke() {
    const s = pick(PSS);
    const be = s.g ? 'is' : s.subj === 'I' ? 'am' : 'are', einfach = sForm(s.base) === s.base.replace(/^(\S+)/, '$1s');
    const ch = shuffle([s.base, sForm(s.base), einfach ? `${be} ${s.base}` : sFalsch(s.base)]);
    return { prompt: `Was gehört in die Lücke?${en(`${s.subj} ___ ${s.rest}.`)}`, choices: ch.map((c) => `<span lang="en">${c}</span>`), correct: ch.indexOf(s.form), hint: PS_TIPP, solution: psLoesung(s), ex: PSEX(s) };
  }
  // B: Form eintippen
  function psTippen() {
    const s = pick(PSS);
    return {
      prompt: `Setze das Verb <b lang="en">${s.base}</b> in der richtigen Form ein.`, layout: 'satz',
      fields: [{ type: 'text', ci: true, answer: s.form, prefix: s.subj, suffix: `${s.rest}.`, label: 'Verb' }],
      hint: PS_TIPP, solution: psLoesung(s), ex: PSEX(s),
    };
  }
  // C: die he/she/it-Form eines Verbs
  function psSForm() {
    const v = pick(VERBEN), s = PS1.find((x) => x.base === v) || pick(PS1);
    return {
      prompt: `Wie heißt die Form für <b>he, she, it</b>?${en(`I ${v} → he …`)}`,
      fields: [{ type: 'text', ci: true, answer: sForm(v), label: 'he/she/it-Form' }],
      hint: 'Meistens kommt nur -s dazu. Nach Zischlaut (s, sh, ch, x) und nach o: -es. Konsonant + y wird zu -ies. Und have wird zu has.',
      solution: `<span lang="en">I ${v} → he <b class="vb">${sForm(v)}</b></span><br>${sRegel(v)}${s.base === v ? `<br>Ein Beispiel: ${psMark(s)} ${U.say(s.text)}` : ''}`,
      ex: { mode: 'sform', base: v },
    };
  }
  // D: Wer passt zur Verbform?
  function psWer() {
    const s = pick(PSS.filter((x) => ['I', 'You', 'We', 'They', 'He', 'She', 'It'].includes(x.subj)));
    const gegen = shuffle((s.g ? ['I', 'You', 'We', 'They'] : ['He', 'She']).filter((x) => x !== s.subj)).slice(0, 2);
    const ch = shuffle([s.subj, ...gegen]);
    return {
      prompt: `Wer passt an den Anfang?${en(`___ ${s.form} ${s.rest}.`)}`,
      choices: ch.map((c) => `<span lang="en">${c}</span>`), correct: ch.indexOf(s.subj),
      hint: 'Schau auf das Verb: Hat es ein <b>s</b> am Ende? Dann passt nur he, she oder it. Ohne s: I, you, we oder they.',
      solution: `${psMark(s)} ${U.say(s.text)}<br>${s.g ? `<b>${s.form}</b> hat das s: Das passt nur zu he, she, it.` : `<b>${s.form}</b> hat kein s: Das passt zu I, you, we, they, aber nicht zu he oder she.`}<br><small>Auf Deutsch: ${s.de}</small>`,
      ex: PSEX(s),
    };
  }
  // E: Wörter ordnen (wer – tut – was)
  function psOrdnen() {
    const s = pick(PSS);
    return {
      prompt: `Bilde den Satz: <b>${s.de}</b>`,
      order: U.ordne([s.subj, s.form, s.rest]),
      hint: 'Im englischen Satz steht zuerst, <b>wer</b> etwas tut, dann das <b>Verb</b>, dann der Rest. Das Verb steht nie am Ende.',
      solution: `${psMark(s)} ${U.say(s.text)}<br>Die Reihenfolge ist fest: wer – tut – was. ${psWarum(s)}`,
      ex: PSEX(s),
    };
  }
  const presentSimple = () => U.wahl([[26, psLuecke], [26, psTippen], [18, psSForm], [16, psWer], [14, psOrdnen]]);

  // ----- verneinen: don’t / doesn’t -----
  const DN = { 'don’t': ['don’t', 'don\'t', 'do not'], 'doesn’t': ['doesn’t', 'doesn\'t', 'does not'] };
  const pnWarum = (s) => (s.g
    ? `Bei he, she, it heißt es <b>doesn’t</b>. Das s steckt jetzt in doe<b>s</b>n’t, deshalb steht das Verb wieder in der Grundform: <b>${s.base}</b> (nicht ${s.form}).`
    : `Bei I, you, we, they heißt es <b>don’t</b>. Das Verb bleibt in der Grundform: <b>${s.base}</b>.`);
  const pnLoesung = (s) => `<span lang="en">${s.subj} <b class="vb">${s.dn} ${s.base}</b> ${s.rest}.</span> ${U.say(s.neg)}<br>${pnWarum(s)}`;
  const PN_TIPP = 'Verneint wird mit <b>don’t</b> (I, you, we, they) oder <b>doesn’t</b> (he, she, it). Dahinter steht das Verb in der <b>Grundform</b>, ohne s.';
  function pnWahl() {
    const s = pick(PSS), ch = shuffle(['don’t', 'doesn’t', s.g ? 'isn’t' : 'aren’t']);
    return { prompt: `Verneine den Satz. Was gehört in die Lücke?${en(s.text)}${en(`${s.subj} ___ ${s.base} ${s.rest}.`)}`, choices: ch.map((c) => `<span lang="en">${c}</span>`), correct: ch.indexOf(s.dn), hint: PN_TIPP, solution: pnLoesung(s), ex: PSEX(s, 'neg') };
  }
  function pnTippen() {
    const s = pick(PSS);
    return {
      prompt: `Verneine den Satz: <b>don’t</b> oder <b>doesn’t</b>?${en(s.text)}`, layout: 'satz',
      fields: [{ type: 'text', ci: true, answer: DN[s.dn], prefix: s.subj, suffix: `${s.base} ${s.rest}.`, label: 'don’t oder doesn’t' }], answerText: s.dn,
      hint: PN_TIPP, solution: pnLoesung(s), ex: PSEX(s, 'neg'),
    };
  }
  // das Verb hinter doesn’t verliert sein s
  function pnVerb() {
    const s = pick(PS1), ch = shuffle([s.base, s.form, `${s.base.split(' ')[0]}ing`.replace(/eing$/, 'ing').replace(/^(get)ing$/, 'getting') + (s.base.includes(' ') ? ' ' + s.base.split(' ').slice(1).join(' ') : '')]);
    return {
      prompt: `Verneine den Satz. Was gehört in die Lücke?${en(s.text)}${en(`${s.subj} doesn’t ___ ${s.rest}.`)}`,
      choices: ch.map((c) => `<span lang="en">${c}</span>`), correct: ch.indexOf(s.base),
      hint: 'Das s gibt es in jedem Satz nur <b>einmal</b>. Es steckt schon in doe<b>s</b>n’t.', solution: pnLoesung(s), ex: PSEX(s, 'neg'),
    };
  }
  function pnSatz() {
    const s = pick(PS1), ch = shuffle([s.neg, `${s.subj} doesn’t ${s.form} ${s.rest}.`, `${s.subj} don’t ${s.base} ${s.rest}.`]);
    return { prompt: `Verneine den Satz. Welcher Satz ist richtig?${en(s.text)}`, choices: ch.map((c) => `<span lang="en">${c}</span>`), correct: ch.indexOf(s.neg), hint: PN_TIPP, solution: pnLoesung(s), ex: PSEX(s, 'neg') };
  }
  function pnOrdnen() {
    const s = pick(PSS);
    return {
      prompt: `Bilde den verneinten Satz.${en(s.text)}`,
      order: U.ordne([s.subj, s.dn, s.base, s.rest]),
      hint: 'Reihenfolge: wer – don’t/doesn’t – Verb – Rest.', solution: pnLoesung(s), ex: PSEX(s, 'neg'),
    };
  }
  const psNeg = () => U.wahl([[22, pnWahl], [24, pnTippen], [20, pnVerb], [18, pnSatz], [16, pnOrdnen]]);

  // ----- fragen: Do / Does -----
  const pfWarum = (s) => (s.g
    ? `Bei he, she, it beginnt die Frage mit <b>Does</b>. Das s steckt in Doe<b>s</b>, deshalb steht das Verb in der Grundform: <b>${s.base}</b>.`
    : `Bei you, we, they beginnt die Frage mit <b>Do</b>. Das Verb bleibt in der Grundform: <b>${s.base}</b>.`);
  const pfLoesung = (s) => `<span lang="en">${s.text}</span> → <span lang="en"><b class="vb">${s.dd}</b> ${subjKlein(s.subj)} <b class="vb">${s.base}</b> ${s.rest}?</span> ${U.say(s.frage)}<br>${pfWarum(s)} Anders als im Deutschen rückt das Verb selbst nicht nach vorn.`;
  const PF_TIPP = 'Fragen im present simple beginnen mit <b>Do</b> (you, we, they) oder <b>Does</b> (he, she, it). Danach: wer – Verb in der Grundform – Rest.';
  function pfWahl() {
    const s = pick(PSQ), ch = shuffle(['Do', 'Does', s.g ? 'Is' : 'Are']);
    return { prompt: `Mache aus dem Satz eine Frage. Was gehört an den Anfang?${en(s.text)}${en(`___ ${subjKlein(s.subj)} ${s.base} ${s.rest}?`)}`, choices: ch.map((c) => `<span lang="en">${c}</span>`), correct: ch.indexOf(s.dd), hint: PF_TIPP, solution: pfLoesung(s), ex: PSEX(s, 'frage') };
  }
  function pfTippen() {
    const s = pick(PSQ);
    return {
      prompt: `Mache aus dem Satz eine Frage: <b>Do</b> oder <b>Does</b>?${en(s.text)}`, layout: 'satz',
      fields: [{ type: 'text', ci: true, answer: s.dd, suffix: `${subjKlein(s.subj)} ${s.base} ${s.rest}?`, label: 'Do oder Does' }],
      hint: PF_TIPP, solution: pfLoesung(s), ex: PSEX(s, 'frage'),
    };
  }
  function pfSatz() {
    const s = pick(PSQ.filter((x) => x.g === 1));
    const ch = shuffle([s.frage, `Does ${subjKlein(s.subj)} ${s.form} ${s.rest}?`, `${gross(s.form)} ${subjKlein(s.subj)} ${s.rest}?`]);
    return { prompt: `Mache aus dem Satz eine Frage. Welche ist richtig?${en(s.text)}`, choices: ch.map((c) => `<span lang="en">${c}</span>`), correct: ch.indexOf(s.frage), hint: PF_TIPP, solution: pfLoesung(s), ex: PSEX(s, 'frage') };
  }
  function pfOrdnen() {
    const s = pick(PSQ);
    return {
      prompt: `Bilde die Frage zu diesem Satz.${en(s.text)}`,
      order: U.ordne([s.dd, subjKlein(s.subj), s.base, s.rest], '?'),
      hint: 'Reihenfolge: Do/Does – wer – Verb – Rest.', solution: pfLoesung(s), ex: PSEX(s, 'frage'),
    };
  }
  function pfAntwort() {
    const s = pick(PSKA), ja = Math.random() < 0.5, d = s.g ? 'does' : 'do', dn = s.dn;
    const richtig = ja ? `Yes, ${s.pr} ${d}.` : `No, ${s.pr} ${dn}.`;
    const be = s.pr === 'they' ? 'are' : 'is';
    const falsch = ja ? [`Yes, ${s.pr} ${s.g ? 'do' : 'does'}.`, `Yes, ${s.pr} ${be}.`] : [`No, ${s.pr} ${s.g ? 'don’t' : 'doesn’t'}.`, `No, ${s.pr} ${be}n’t.`];
    const ch = shuffle([richtig, ...falsch]);
    return {
      prompt: `Antworte kurz mit <b>${ja ? 'Ja' : 'Nein'}</b>.${en(s.frage)}`,
      choices: ch.map((c) => `<span lang="en">${c}</span>`), correct: ch.indexOf(richtig),
      hint: 'Die Kurzantwort nimmt <b>do</b> oder <b>does</b> aus der Frage wieder auf, nicht das Verb: Yes, she does. / No, she doesn’t.',
      solution: `<span lang="en">${s.frage}</span><br><span lang="en"><b class="vb">${richtig}</b></span> ${U.say(richtig)}<br>${s.subj.toLowerCase() !== s.pr ? `Für <b>${s.subj}</b> steht in der Antwort <b>${s.pr}</b>. ` : ''}In der Kurzantwort steht ${ja ? d : dn}, nicht das Verb ${s.base}.`,
      ex: PSEX(s, 'kurz', ja),
    };
  }
  const psFrage = () => U.wahl([[22, pfWahl], [22, pfTippen], [18, pfSatz], [18, pfOrdnen], [20, pfAntwort]]);

  Object.assign(D.daten, { PSS, PS0, PS1, PSQ, PSKA, VERBEN, sForm, sRegel });
  const themenVorPS = D.audioThemen;
  D.audioThemen = () => Object.assign(themenVorPS(), {
    'e5-ps': PSS.map((s) => s.text),
    'e5-ps-neg': PSS.map((s) => s.neg),
    'e5-ps-frage': [...PSQ.map((s) => s.frage), ...['he', 'she', 'it'].flatMap((p) => [`Yes, ${p} does.`, `No, ${p} doesn’t.`]), 'Yes, they do.', 'No, they don’t.'],
  });
  Object.assign(D.arten, {
    'e5-ps': { psLuecke, psTippen, psSForm, psWer, psOrdnen },
    'e5-ps-neg': { pnWahl, pnTippen, pnVerb, pnSatz, pnOrdnen },
    'e5-ps-frage': { pfWahl, pfTippen, pfSatz, pfOrdnen, pfAntwort },
  });

  // =====================================================
  // Fragewörter: who, what, where, when, why, how
  // =====================================================
  const FW_DE = { Who: 'wer', What: 'was', Where: 'wo', When: 'wann', Why: 'warum', How: 'wie', 'How old': 'wie alt', 'How many': 'wie viele' };
  const FW_ART = { Who: 'eine Person', What: 'eine Sache', Where: 'ein Ort', When: 'eine Zeit', Why: 'ein Grund (because …)', How: 'die Art und Weise', 'How old': 'ein Alter', 'How many': 'eine Anzahl' };
  // [Fragewort, Rest der Frage in Teilen (für „Wörter ordnen“), Antwort, Deutsch]
  const FW = [
    ['Where', ['do', 'you', 'live'], 'In Dresden.', 'Wo wohnst du?'],
    ['Where', ['is', 'my bag'], 'Under the table.', 'Wo ist meine Tasche?'],
    ['When', ['does', 'school', 'start'], 'At eight o’clock.', 'Wann beginnt die Schule?'],
    ['When', ['is', 'your birthday'], 'In May.', 'Wann hast du Geburtstag?'],
    ['What', ['is', 'your name'], 'My name is Tom.', 'Wie heißt du? (wörtlich: Was ist dein Name?)'],
    ['What', ['do', 'you', 'eat', 'for breakfast'], 'Toast and jam.', 'Was isst du zum Frühstück?'],
    ['Who', ['is', 'your teacher'], 'Mr Brown.', 'Wer ist dein Lehrer?'],
    ['Who', ['lives', 'in this house'], 'My grandparents.', 'Wer wohnt in diesem Haus?'],
    ['Why', ['are', 'you', 'late'], 'Because my bike is broken.', 'Warum bist du zu spät?'],
    ['Why', ['is', 'she', 'happy'], 'Because it is her birthday.', 'Warum ist sie glücklich?'],
    ['How', ['are', 'you'], 'I’m fine, thank you.', 'Wie geht es dir?'],
    ['How', ['do', 'you', 'go', 'to school'], 'By bus.', 'Wie kommst du zur Schule?'],
    ['How old', ['are', 'you'], 'I’m eleven.', 'Wie alt bist du?'],
    ['How many', ['brothers', 'have', 'you', 'got'], 'Two.', 'Wie viele Brüder hast du?'],
  ].map(([wort, teile, antwort, de]) => ({ wort, teile, antwort, de, rest: teile.join(' '), frage: `${wort} ${teile.join(' ')}?`, text: `${wort} ${teile.join(' ')}? ${antwort}` }));
  const FW6 = ['Who', 'What', 'Where', 'When', 'Why', 'How'];
  const fwLoesung = (q) => `<span lang="en"><b class="vb">${q.wort}</b> ${q.rest}? – ${q.antwort}</span> ${U.say(q.text)}<br>Die Antwort nennt <b>${FW_ART[q.wort]}</b>. Danach fragt <b>${q.wort.toLowerCase()}</b> (${FW_DE[q.wort]}).<br><small>Auf Deutsch: ${q.de}</small>`;
  const FW_TIPP = 'Schau auf die <b>Antwort</b>: Nennt sie eine Person (who), eine Sache (what), einen Ort (where), eine Zeit (when), einen Grund (why) oder die Art und Weise (how)? Achtung: <b>who</b> heißt wer, <b>where</b> heißt wo.';
  const FEX = (q) => ({ mode: 'frage', wort: q.wort, rest: q.rest, antwort: q.antwort, de: q.de });
  const fwAngebote = (q) => shuffle([q.wort, ...shuffle([...FW6, ...(q.wort.includes(' ') ? ['How old', 'How many'] : [])].filter((w) => w !== q.wort && !(q.wort.startsWith('How ') && w === 'How'))).slice(0, 3)]);
  // A: Fragewort auswählen
  function fwWahl() {
    const q = pick(FW), ch = fwAngebote(q);
    return { prompt: `Welches Fragewort passt zur Antwort?${en(`___ ${q.rest}? – ${q.antwort}`)}`, choices: ch.map((c) => `<span lang="en">${c}</span>`), correct: ch.indexOf(q.wort), hint: FW_TIPP, solution: fwLoesung(q), ex: FEX(q) };
  }
  // B: Fragewort eintippen
  function fwTippen() {
    const q = pick(FW);
    return {
      prompt: `Welches Fragewort fehlt? Die Antwort lautet: <b lang="en">${q.antwort}</b>`, layout: 'satz',
      fields: [{ type: 'text', ci: true, answer: q.wort, suffix: `${q.rest}?`, label: 'Fragewort' }],
      hint: FW_TIPP, solution: fwLoesung(q), ex: FEX(q),
    };
  }
  // C: Bedeutung (wer = who, wo = where …)
  function fwBedeutung() {
    const w = pick(FW6), hin = Math.random() < 0.5, q = pick(FW.filter((x) => x.wort === w));
    const ch = shuffle([w, ...shuffle(FW6.filter((x) => x !== w)).slice(0, 3)]);
    const lo = `<b class="vb" lang="en">${w.toLowerCase()}</b> = ${FW_DE[w]}${w === 'Who' || w === 'Where' ? '<br>Vorsicht, die beiden werden oft verwechselt: <b>who</b> = wer, <b>where</b> = wo.' : ''}<br>Ein Beispiel: <span lang="en">${q.text}</span> ${U.say(q.text)}`;
    return hin
      ? { prompt: `Wie heißt <b>${FW_DE[w]}</b> auf Englisch?`, choices: ch.map((c) => `<span lang="en">${c.toLowerCase()}</span>`), correct: ch.indexOf(w), hint: 'who = wer · what = was · where = wo · when = wann · why = warum · how = wie', solution: lo, ex: { mode: 'wort', wort: w } }
      : { prompt: `Was bedeutet <b lang="en">${w.toLowerCase()}</b>?`, choices: ch.map((c) => FW_DE[c]), correct: ch.indexOf(w), hint: 'who = wer · what = was · where = wo · when = wann · why = warum · how = wie', solution: lo, ex: { mode: 'wort', wort: w } };
  }
  // D: passende Antwort zur Frage
  function fwAntwort() {
    const q = pick(FW);
    const andere = shuffle(FW.filter((x) => x.wort !== q.wort && x.wort.split(' ')[0] !== q.wort.split(' ')[0])).filter((x, i, a) => a.findIndex((y) => y.wort === x.wort) === i).slice(0, 2);
    const ch = shuffle([q, ...andere]);
    return {
      prompt: `Welche Antwort passt?${en(q.frage)}`,
      choices: ch.map((c) => `<span lang="en">${c.antwort}</span>`), correct: ch.indexOf(q),
      hint: `<b lang="en">${q.wort}</b> heißt <b>${FW_DE[q.wort]}</b>. Gesucht ist also ${FW_ART[q.wort]}.`,
      solution: fwLoesung(q), ex: FEX(q),
    };
  }
  // E: Frage ordnen
  function fwOrdnen() {
    const q = pick(FW.filter((x) => x.teile.length >= 2));
    return {
      prompt: `Bilde die Frage: <b>${q.de}</b>`,
      order: U.ordne([q.wort, ...q.teile], '?'),
      hint: 'Das <b>Fragewort</b> steht ganz vorn. Danach geht es weiter wie bei einer Frage ohne Fragewort: do/does oder is/are, dann die Person.',
      solution: fwLoesung(q), ex: FEX(q),
    };
  }
  const fragewoerter = () => U.wahl([[26, fwWahl], [20, fwTippen], [20, fwBedeutung], [18, fwAntwort], [16, fwOrdnen]]);

  // =====================================================
  // Satzbau: wer – tut – was – wo – wann
  // =====================================================
  // [wer, tut, was, wo, wann, Deutsch]
  const SB = [
    ['I', 'play', 'football', 'in the park', 'on Saturdays', 'Ich spiele samstags im Park Fußball.'],
    ['We', 'eat', 'lunch', 'at school', 'at one o’clock', 'Wir essen um ein Uhr in der Schule zu Mittag.'],
    ['Tom', 'reads', 'a book', 'in his room', 'every evening', 'Tom liest jeden Abend in seinem Zimmer ein Buch.'],
    ['She', 'does', 'her homework', 'in the kitchen', 'after school', 'Sie macht nach der Schule in der Küche ihre Hausaufgaben.'],
    ['My dad', 'washes', 'the car', 'in the garden', 'on Sundays', 'Mein Papa wäscht sonntags im Garten das Auto.'],
    ['They', 'watch', 'TV', 'at home', 'in the evening', 'Sie sehen abends zu Hause fern.'],
    ['Lisa', 'meets', 'her friends', 'in town', 'on Fridays', 'Lisa trifft freitags in der Stadt ihre Freunde.'],
    ['He', 'rides', 'his bike', 'to school', 'every day', 'Er fährt jeden Tag mit dem Fahrrad zur Schule.'],
    ['My sister', 'plays', 'the piano', 'at home', 'every afternoon', 'Meine Schwester spielt jeden Nachmittag zu Hause Klavier.'],
    ['We', 'visit', 'our grandparents', 'in Berlin', 'in the summer', 'Wir besuchen im Sommer unsere Großeltern in Berlin.'],
  ].map(([wer, tut, was, wo, wann, de]) => ({ wer, tut, was, wo, wann, de, teile: [wer, tut, was, wo, wann], text: `${wer} ${tut} ${was} ${wo} ${wann}.`, kurz: `${wer} ${tut} ${was}.` }));
  const SB_FRAGE = ['Wer?', 'Tut?', 'Was?', 'Wo?', 'Wann?'];
  const sbFarbig = (s) => `<span lang="en">${s.wer} <b class="vb">${s.tut}</b> ${s.was} ${s.wo} ${s.wann}.</span>`;
  const SB_TIPP = 'Der englische Satz hat eine feste Reihenfolge: <b>wer – tut – was – wo – wann</b>. Verb und „was“ bleiben immer zusammen. Der Ort steht vor der Zeit.';
  const sbLoesung = (s) => `${sbFarbig(s)} ${U.say(s.text)}<br>wer: <b>${s.wer}</b> · tut: <b>${s.tut}</b> · was: <b>${s.was}</b> · wo: <b>${s.wo}</b> · wann: <b>${s.wann}</b><br><small>Auf Deutsch: ${s.de}</small>`;
  const SEX = (s, mode) => ({ mode: mode || 'voll', teile: s.teile, de: s.de });
  const zeitVorn = (s) => `${s.wann} ${s.wer} ${s.tut} ${s.was} ${s.wo}`;
  // A: ganzer Satz mit fünf Teilen
  function sbOrdnen() {
    const s = pick(SB);
    return {
      prompt: `Bilde den Satz: <b>${s.de}</b>`,
      order: U.ordne(s.teile, '.', [zeitVorn(s)]),
      hint: SB_TIPP,
      solution: `${sbLoesung(s)}<br>Auch richtig: Die Zeit darf ganz nach vorn (<span lang="en">${gross(s.wann)} ${subjKlein(s.wer)} ${s.tut} …</span>).`,
      ex: SEX(s),
    };
  }
  // B: kurzer Satz (wer – tut – was – wo)
  function sbOrdnenKurz() {
    const s = pick(SB);
    return {
      prompt: 'Bringe die Teile in die richtige Reihenfolge.',
      order: U.ordne([s.wer, s.tut, s.was, s.wo]),
      hint: SB_TIPP,
      solution: `<span lang="en">${s.wer} <b class="vb">${s.tut}</b> ${s.was} ${s.wo}.</span><br>wer – tut – was – wo. Das Verb steht direkt hinter „wer“, und „was“ folgt gleich danach.`,
      ex: SEX(s, 'kurz'),
    };
  }
  // C: richtigen Satz erkennen (deutsche Wortstellung als Falle)
  function sbWahl() {
    const s = pick(SB);
    const ch = shuffle([s.text, `${s.wer} ${s.tut} ${s.wann} ${s.was} ${s.wo}.`, `${s.wer} ${s.was} ${s.tut} ${s.wo} ${s.wann}.`]);
    return {
      prompt: 'Nur ein Satz hat die richtige Reihenfolge. Welcher?',
      choices: ch.map((c) => `<span lang="en">${c}</span>`), correct: ch.indexOf(s.text),
      hint: SB_TIPP,
      solution: `${sbLoesung(s)}<br>Im Deutschen darf zwischen Verb und „was“ etwas stehen (Ich spiele <i>samstags</i> Fußball). Im Englischen nicht.`,
      ex: SEX(s),
    };
  }
  // D: Ort vor Zeit
  function sbOrtZeit() {
    const s = pick(SB);
    const ch = shuffle([`${s.wo} ${s.wann}`, `${s.wann} ${s.wo}`]);
    return {
      prompt: `Wie geht der Satz weiter?${en(`${s.wer} ${s.tut} ${s.was} …`)}`,
      choices: ch.map((c) => `<span lang="en">… ${c}.</span>`), correct: ch.indexOf(`${s.wo} ${s.wann}`),
      hint: 'Am Satzende gilt: erst der <b>Ort</b> (wo?), dann die <b>Zeit</b> (wann?).',
      solution: `${sbLoesung(s)}<br>Merke: <b>Ort vor Zeit</b>.`, ex: SEX(s),
    };
  }
  // E: Satzteile erkennen
  function sbTeil() {
    const s = pick(SB), k = pick([1, 2, 3, 4]);
    const frage = ['', 'Welcher Teil ist das <b>Verb</b> (was jemand tut)?', 'Welcher Teil sagt, <b>was</b> (wen oder was)?', 'Welcher Teil sagt, <b>wo</b> (oder wohin)?', 'Welcher Teil sagt, <b>wann</b>?'][k];
    return {
      prompt: `${frage} Tippe ihn an. ${U.say(s.text)}`,
      tap: { tokens: s.teile.map((t, i) => (i === 4 ? t + '.' : t)), correct: [k], one: true },
      answerText: s.teile[k],
      hint: SB_TIPP, solution: sbLoesung(s), ex: SEX(s),
    };
  }
  const satzbau = () => U.wahl([[26, sbOrdnen], [18, sbOrdnenKurz], [20, sbWahl], [18, sbOrtZeit], [18, sbTeil]]);

  // =====================================================
  // Wie oft? always, usually, often, sometimes, never
  // =====================================================
  const OFT_DE = { always: 'immer', usually: 'meistens', often: 'oft', sometimes: 'manchmal', never: 'nie' };
  const OFT = ['never', 'sometimes', 'often', 'usually', 'always'];
  // mit Vollverb: [wer, wie oft, Verb, Rest, Deutsch]   ·   mit to be: [wer, be, wie oft, Rest, Deutsch]
  const OV = [
    ['I', 'always', 'get up', 'at seven', 'Ich stehe immer um sieben auf.'],
    ['She', 'often', 'plays', 'football', 'Sie spielt oft Fußball.'],
    ['We', 'sometimes', 'go', 'to the cinema', 'Wir gehen manchmal ins Kino.'],
    ['He', 'never', 'eats', 'fish', 'Er isst nie Fisch.'],
    ['They', 'usually', 'walk', 'to school', 'Sie gehen meistens zu Fuß zur Schule.'],
    ['My dad', 'often', 'cooks', 'dinner', 'Mein Papa kocht oft das Abendessen.'],
    ['Tom', 'never', 'watches', 'TV in the morning', 'Tom sieht morgens nie fern.'],
    ['I', 'sometimes', 'help', 'my mum', 'Ich helfe manchmal meiner Mama.'],
  ].map(([wer, adv, verb, rest, de]) => ({ be: false, wer, adv, verb, rest, de, vor: [wer], nach: [verb, rest], text: `${wer} ${adv} ${verb} ${rest}.`, falsch: `${wer} ${verb} ${adv} ${rest}.` }));
  const OB = [
    ['She', 'is', 'always', 'late', 'Sie ist immer zu spät.'],
    ['I', 'am', 'never', 'tired in the morning', 'Ich bin morgens nie müde.'],
    ['They', 'are', 'often', 'at home', 'Sie sind oft zu Hause.'],
    ['He', 'is', 'sometimes', 'sad', 'Er ist manchmal traurig.'],
    ['We', 'are', 'usually', 'happy', 'Wir sind meistens fröhlich.'],
  ].map(([wer, verb, adv, rest, de]) => ({ be: true, wer, adv, verb, rest, de, vor: [wer, verb], nach: [rest], text: `${wer} ${verb} ${adv} ${rest}.`, falsch: `${wer} ${adv} ${verb} ${rest}.` }));
  const OALL = [...OV, ...OB];
  const oftWarum = (s) => (s.be
    ? `Bei <b>am, is, are</b> steht das Wort <b>dahinter</b>: ${s.wer} ${s.verb} <b>${s.adv}</b> …`
    : `Das Wort steht <b>vor</b> dem Verb: ${s.wer} <b>${s.adv}</b> ${s.verb} … Zwischen Verb und Rest darf es nicht stehen.`);
  const oftLoesung = (s) => `<span lang="en">${s.be ? `${s.wer} ${s.verb} <b class="vb">${s.adv}</b> ${s.rest}.` : `${s.wer} <b class="vb">${s.adv}</b> ${s.verb} ${s.rest}.`}</span> ${U.say(s.text)}<br>${oftWarum(s)}<br><small>Auf Deutsch: ${s.de}</small>`;
  const OFT_TIPP = 'Wörter wie always, often, never stehen <b>vor dem Verb</b> (I often play …). Nur bei <b>am, is, are</b> stehen sie <b>dahinter</b> (She is often …).';
  const OEX = (s, mode) => ({ mode: mode || 'stelle', be: s.be, wer: s.wer, adv: s.adv, verb: s.verb, rest: s.rest, de: s.de });
  // A: die richtige Stelle antippen
  function oftStelle() {
    const s = pick(OALL), tokens = [...s.vor, ...s.nach].flatMap((t) => t.split(' '));
    tokens[tokens.length - 1] += '.';
    return {
      prompt: `An welche Stelle gehört <b lang="en">${s.adv}</b> (${OFT_DE[s.adv]})? Tippe die Lücke an.`,
      tap: { tokens, correct: [s.vor.join(' ').split(' ').length - 1], gaps: true, one: true, mark: '▾', eng: tokens.length > 5 },
      answerText: s.text,
      hint: OFT_TIPP, solution: oftLoesung(s), ex: OEX(s),
    };
  }
  // B: Satz ordnen
  function oftOrdnen() {
    const s = pick(OALL), teile = s.be ? [s.wer, s.verb, s.adv, s.rest] : [s.wer, s.adv, s.verb, s.rest];
    const frei = ['sometimes', 'usually', 'often'].includes(s.adv);
    return {
      prompt: `Bilde den Satz: <b>${s.de}</b>`,
      order: U.ordne(teile, '.', frei ? [`${s.adv} ${s.wer} ${s.verb} ${s.rest}`, `${s.wer} ${s.verb} ${s.rest} ${s.adv}`] : []),
      hint: OFT_TIPP, solution: oftLoesung(s), ex: OEX(s),
    };
  }
  // C: richtigen Satz erkennen
  function oftWahl() {
    const s = pick(OALL), ch = shuffle([s.text, s.falsch]);
    return {
      prompt: 'Welcher Satz ist richtig?',
      choices: ch.map((c) => `<span lang="en">${c}</span>`), correct: ch.indexOf(s.text),
      hint: OFT_TIPP, solution: oftLoesung(s), ex: OEX(s),
    };
  }
  // D: Bedeutung
  function oftBedeutung() {
    const w = pick(OFT), hin = Math.random() < 0.5, s = pick(OALL.filter((x) => x.adv === w));
    const ch = shuffle([w, ...shuffle(OFT.filter((x) => x !== w)).slice(0, 3)]);
    const lo = `<b class="vb" lang="en">${w}</b> = ${OFT_DE[w]}<br>Ein Beispiel: <span lang="en">${s.text}</span> ${U.say(s.text)}<br><small>${s.de}</small>`;
    return hin
      ? { prompt: `Wie heißt <b>${OFT_DE[w]}</b> auf Englisch?`, choices: ch.map((c) => `<span lang="en">${c}</span>`), correct: ch.indexOf(w), hint: 'Von nie bis immer: never · sometimes · often · usually · always.', solution: lo, ex: { mode: 'wort', adv: w } }
      : { prompt: `Was bedeutet <b lang="en">${w}</b>?`, choices: ch.map((c) => OFT_DE[c]), correct: ch.indexOf(w), hint: 'Von nie bis immer: never · sometimes · often · usually · always.', solution: lo, ex: { mode: 'wort', adv: w } };
  }
  // E: Was passiert häufiger?
  function oftMehr() {
    const [a, b] = shuffle(OFT).slice(0, 2), mehr = OFT.indexOf(a) > OFT.indexOf(b) ? a : b;
    const ch = [a, b];
    return {
      prompt: 'Welches Wort bedeutet: <b>häufiger</b>?',
      choices: ch.map((c) => `<span lang="en">${c}</span>`), correct: ch.indexOf(mehr),
      hint: 'Von nie bis immer: never · sometimes · often · usually · always.',
      solution: `<b class="vb" lang="en">${mehr}</b> (${OFT_DE[mehr]}) ist häufiger als <span lang="en">${mehr === a ? b : a}</span> (${OFT_DE[mehr === a ? b : a]}).<br>Die Reihe von nie bis immer: never · sometimes · often · usually · always.`,
      ex: { mode: 'wort', adv: mehr },
    };
  }
  const wieOft = () => U.wahl([[26, oftStelle], [22, oftOrdnen], [20, oftWahl], [18, oftBedeutung], [14, oftMehr]]);

  Object.assign(D.daten, { FW, FW6, FW_DE, FW_ART, SB, SB_FRAGE, OFT, OFT_DE, OV, OB, OALL });
  const themenVorFW = D.audioThemen;
  D.audioThemen = () => Object.assign(themenVorFW(), {
    'e5-fragewort': FW.map((q) => q.text),
    'e5-satzbau': SB.map((s) => s.text),
    'e5-oft': OALL.map((s) => s.text),
  });
  Object.assign(D.arten, {
    'e5-fragewort': { fwWahl, fwTippen, fwBedeutung, fwAntwort, fwOrdnen },
    'e5-satzbau': { sbOrdnen, sbOrdnenKurz, sbWahl, sbOrtZeit, sbTeil },
    'e5-oft': { oftStelle, oftOrdnen, oftWahl, oftBedeutung, oftMehr },
  });

  // =====================================================
  // present progressive: am/is/are + -ing
  // =====================================================
  // [Subjekt, am/is/are, Grundform, -ing-Form, Rest, Signalwort, Deutsch, Pronomen]
  const PP = [
    ['I', 'am', 'read', 'reading', 'a book', 'now', 'Ich lese gerade ein Buch.'],
    ['I', 'am', 'do', 'doing', 'my homework', 'at the moment', 'Ich mache gerade meine Hausaufgaben.'],
    ['You', 'are', 'listen', 'listening', 'to music', 'now', 'Du hörst gerade Musik.'],
    ['He', 'is', 'play', 'playing', 'football', 'at the moment', 'Er spielt gerade Fußball.', 'he'],
    ['She', 'is', 'make', 'making', 'a cake', 'now', 'Sie backt gerade einen Kuchen.', 'she'],
    ['She', 'is', 'ride', 'riding', 'her bike', 'right now', 'Sie fährt gerade Fahrrad.', 'she'],
    ['We', 'are', 'watch', 'watching', 'a film', 'at the moment', 'Wir schauen gerade einen Film.'],
    ['We', 'are', 'have', 'having', 'lunch', 'now', 'Wir essen gerade zu Mittag.'],
    ['They', 'are', 'swim', 'swimming', 'in the lake', 'right now', 'Sie schwimmen gerade im See.', 'they'],
    ['Tom', 'is', 'write', 'writing', 'an email', 'now', 'Tom schreibt gerade eine E-Mail.', 'he'],
    ['Lisa', 'is', 'sit', 'sitting', 'on the sofa', 'at the moment', 'Lisa sitzt gerade auf dem Sofa.', 'she'],
    ['My brother', 'is', 'sleep', 'sleeping', 'in his room', 'now', 'Mein Bruder schläft gerade in seinem Zimmer.', 'he'],
    ['The dog', 'is', 'run', 'running', 'in the garden', 'right now', 'Der Hund rennt gerade im Garten.', 'it'],
    ['My parents', 'are', 'cook', 'cooking', 'dinner', 'at the moment', 'Meine Eltern kochen gerade das Abendessen.', 'they'],
    ['The children', 'are', 'dance', 'dancing', 'in the kitchen', 'now', 'Die Kinder tanzen gerade in der Küche.', 'they'],
  ].map(([subj, be, base, ing, rest, sig, de, pr]) => {
    const nb = be === 'is' ? 'isn’t' : 'aren’t';
    return { subj, be, base, ing, rest, sig, de, pr: pr || '', g: be === 'am' ? 0 : be === 'is' ? 1 : 2,
      text: `${subj} ${be} ${ing} ${rest} ${sig}.`,
      neg: be === 'am' ? `I’m not ${ing} ${rest} ${sig}.` : `${subj} ${nb} ${ing} ${rest} ${sig}.`,
      frage: `${gross(be)} ${subjKlein(subj)} ${ing} ${rest} ${sig}?` };
  });
  const PPQ = PP.filter((s) => s.subj !== 'I');
  const INGS = [...new Map(PP.map((s) => [s.base, s.ing])).entries()];
  const ingRegel = (base, ing) => (ing === base + 'ing' ? `Einfach <b>-ing</b> anhängen: ${ing}.`
    : base.endsWith('e') && ing === base.slice(0, -1) + 'ing' ? `Das <b>e</b> am Ende fällt weg: ${base} → ${ing}.`
      : `Kurzer Vokal und ein Konsonant am Ende: Der letzte Buchstabe wird <b>verdoppelt</b>: ${base} → ${ing}.`);
  const ppMark = (s) => `<span lang="en">${s.subj} <b class="vb">${s.be} ${s.ing}</b> ${s.rest} ${s.sig}.</span>`;
  const ppLoesung = (s) => `${ppMark(s)} ${U.say(s.text)}<br>Was <b>gerade jetzt</b> passiert, sagt man mit <b>${s.be}</b> + Verb + <b>-ing</b>. ${GRUPPE_TEXT[s.g]} ${ingRegel(s.base, s.ing)}<br><small>Auf Deutsch: ${s.de}</small>`;
  const PP_TIPP = 'Was <b>gerade jetzt</b> passiert: <b>am, is</b> oder <b>are</b> + Verb mit <b>-ing</b>. Signalwörter: now, at the moment, right now.';
  const PPEX = (s, mode) => ({ mode: mode || 'form', subj: s.subj, be: s.be, base: s.base, ing: s.ing, rest: s.rest, sig: s.sig, de: s.de, g: s.g });
  // A: am, is oder are
  function ppBe() {
    const s = pick(PP);
    return { prompt: `Was gehört in die Lücke?${en(`${s.subj} ___ ${s.ing} ${s.rest} ${s.sig}.`)}`, choices: FORM.slice(), correct: s.g, hint: PP_TIPP, solution: ppLoesung(s), ex: PPEX(s) };
  }
  // B: die -ing-Form im Satz
  function ppIng() {
    const s = pick(PP);
    return {
      prompt: `Setze das Verb <b lang="en">${s.base}</b> in der -ing-Form ein.`, layout: 'satz',
      fields: [{ type: 'text', ci: true, answer: s.ing, prefix: `${s.subj} ${s.be}`, suffix: `${s.rest} ${s.sig}.`, label: '-ing-Form' }],
      hint: 'Meistens hängst du nur -ing an. Ein <b>e</b> am Ende fällt weg (make → making). Nach kurzem Vokal wird der letzte Konsonant verdoppelt (sit → sitting).',
      solution: ppLoesung(s), ex: PPEX(s),
    };
  }
  // C: nur die -ing-Form
  function ppIngForm() {
    const [base, ing] = pick(INGS), s = PP.find((x) => x.base === base);
    const falsch = ing === base + 'ing' ? [base + 'eing', base + base.slice(-1) + 'ing'] : base.endsWith('e') ? [base + 'ing', base.slice(0, -1) + base.slice(-2, -1) + 'ing'] : [base + 'ing', base + 'eing'];
    const ch = shuffle([ing, ...falsch]);
    return {
      prompt: `Wie schreibt man die <b>-ing-Form</b> von <b lang="en">${base}</b>?`,
      choices: ch.map((c) => `<span lang="en">${c}</span>`), correct: ch.indexOf(ing),
      hint: 'Meistens hängst du nur -ing an. Ein <b>e</b> am Ende fällt weg (make → making). Nach kurzem Vokal wird der letzte Konsonant verdoppelt (sit → sitting).',
      solution: `<span lang="en">${base} → <b class="vb">${ing}</b></span><br>${ingRegel(base, ing)}<br>Ein Beispiel: ${ppMark(s)} ${U.say(s.text)}`,
      ex: { mode: 'ing', base, ing },
    };
  }
  // D: beide Teile eintippen
  function ppBeides() {
    const s = pick(PP);
    return {
      prompt: `Was passiert gerade? Setze <b lang="en">${s.base}</b> in der richtigen Form ein (zwei Wörter).`, layout: 'satz',
      fields: [{ type: 'text', ci: true, answer: s.be, prefix: s.subj, label: 'am, is oder are' }, { type: 'text', ci: true, answer: s.ing, suffix: `${s.rest} ${s.sig}.`, label: '-ing-Form' }],
      hint: PP_TIPP, solution: ppLoesung(s), ex: PPEX(s),
    };
  }
  // E: Satz ordnen
  function ppOrdnen() {
    const s = pick(PP);
    return {
      prompt: `Bilde den Satz: <b>${s.de}</b>`,
      order: U.ordne([s.subj, s.be, s.ing, s.rest, s.sig], '.', [`${s.sig} ${s.subj} ${s.be} ${s.ing} ${s.rest}`]),
      hint: 'Reihenfolge: wer – am/is/are – Verb mit -ing – Rest – Signalwort.', solution: ppLoesung(s), ex: PPEX(s),
    };
  }
  // F: verneinen
  function ppNeg() {
    const s = pick(PP), richtig = s.neg;
    const ch = shuffle([richtig, s.be === 'am' ? `I don’t ${s.ing} ${s.rest} ${s.sig}.` : `${s.subj} ${s.be === 'is' ? 'doesn’t' : 'don’t'} ${s.ing} ${s.rest} ${s.sig}.`, `${s.subj} not ${s.be} ${s.ing} ${s.rest} ${s.sig}.`]);
    return {
      prompt: `Verneine den Satz. Welcher Satz ist richtig?${en(s.text)}`,
      choices: ch.map((c) => `<span lang="en">${c}</span>`), correct: ch.indexOf(richtig),
      hint: 'Hier steckt schon <b>am, is</b> oder <b>are</b> im Satz. Verneint wird deshalb wie bei to be: mit <b>not</b> dahinter (isn’t, aren’t, I’m not). Kein don’t.',
      solution: `<span lang="en"><b class="vb">${richtig}</b></span> ${U.say(richtig)}<br>Verneint wird wie bei to be: <b>not</b> kommt hinter ${s.be}. don’t und doesn’t braucht man hier nicht.`,
      ex: PPEX(s, 'neg'),
    };
  }
  // G: Frage ordnen
  function ppFrage() {
    const s = pick(PPQ);
    return {
      prompt: `Bilde die Frage zu diesem Satz.${en(s.text)}`,
      order: U.ordne([gross(s.be), subjKlein(s.subj), s.ing, s.rest, s.sig], '?'),
      hint: 'Wie bei to be: <b>Is</b> oder <b>Are</b> rückt nach vorn, dann die Person, dann das Verb mit -ing.',
      solution: `<span lang="en">${s.text}</span> → <span lang="en"><b class="vb">${gross(s.be)}</b> ${subjKlein(s.subj)} ${s.ing} ${s.rest} ${s.sig}?</span> ${U.say(s.frage)}<br>${gross(s.be)} und die Person tauschen die Plätze. Kein do oder does.`,
      ex: PPEX(s, 'frage'),
    };
  }
  const progressive = () => U.wahl([[18, ppBe], [18, ppIng], [14, ppIngForm], [16, ppBeides], [12, ppOrdnen], [11, ppNeg], [11, ppFrage]]);

  // =====================================================
  // simple oder progressive?
  // =====================================================
  // [Subjekt, Gruppe für das s, am/is/are, Grundform, -ing-Form, Rest, Signal „immer wieder“, Signal „gerade jetzt“, Deutsch immer wieder, Deutsch gerade]
  const SP = [
    ['Tom', 1, 'is', 'play', 'playing', 'football', 'every Saturday', 'now', 'Tom spielt jeden Samstag Fußball.', 'Tom spielt gerade Fußball.'],
    ['She', 1, 'is', 'read', 'reading', 'a book', 'every evening', 'at the moment', 'Sie liest jeden Abend ein Buch.', 'Sie liest gerade ein Buch.'],
    ['We', 0, 'are', 'watch', 'watching', 'TV', 'on Sundays', 'right now', 'Wir sehen sonntags fern.', 'Wir sehen gerade fern.'],
    ['I', 0, 'am', 'do', 'doing', 'my homework', 'after school', 'now', 'Ich mache nach der Schule meine Hausaufgaben.', 'Ich mache gerade meine Hausaufgaben.'],
    ['They', 0, 'are', 'swim', 'swimming', 'in the lake', 'every summer', 'at the moment', 'Sie schwimmen jeden Sommer im See.', 'Sie schwimmen gerade im See.'],
    ['My mum', 1, 'is', 'make', 'making', 'a cake', 'on Fridays', 'now', 'Meine Mama backt freitags einen Kuchen.', 'Meine Mama backt gerade einen Kuchen.'],
    ['He', 1, 'is', 'ride', 'riding', 'his bike', 'every day', 'at the moment', 'Er fährt jeden Tag Fahrrad.', 'Er fährt gerade Fahrrad.'],
    ['The children', 0, 'are', 'dance', 'dancing', 'in the kitchen', 'on Saturdays', 'right now', 'Die Kinder tanzen samstags in der Küche.', 'Die Kinder tanzen gerade in der Küche.'],
    ['Lisa', 1, 'is', 'write', 'writing', 'an email', 'every week', 'now', 'Lisa schreibt jede Woche eine E-Mail.', 'Lisa schreibt gerade eine E-Mail.'],
    ['My dad', 1, 'is', 'cook', 'cooking', 'dinner', 'on Sundays', 'at the moment', 'Mein Papa kocht sonntags das Abendessen.', 'Mein Papa kocht gerade das Abendessen.'],
  ].map(([subj, g, be, base, ing, rest, sigS, sigP, deS, deP]) => {
    const sf = g ? sForm(base) : base;
    return { subj, g, be, base, ing, rest, sigS, sigP, deS, deP, sf, prog: `${be} ${ing}`,
      textS: `${subj} ${sf} ${rest} ${sigS}.`, textP: `${subj} ${be} ${ing} ${rest} ${sigP}.` };
  });
  const SIG_S = ['every day', 'every week', 'on Mondays', 'always', 'often', 'usually', 'sometimes', 'never'];
  const SIG_P = ['now', 'right now', 'at the moment', 'Look!', 'Listen!'];
  const spVar = (s, prog) => ({ prog, form: prog ? s.prog : s.sf, sig: prog ? s.sigP : s.sigS, text: prog ? s.textP : s.textS, de: prog ? s.deP : s.deS });
  const spWarum = (s, v) => (v.prog
    ? `<b>${v.sig}</b> zeigt: Es passiert <b>gerade jetzt</b>. Dann heißt es ${s.be} + -ing: <b>${s.prog}</b>.`
    : `<b>${v.sig}</b> zeigt: Es passiert <b>immer wieder</b>. Dann steht das einfache Verb: <b>${s.sf}</b>${s.g ? ' (mit s bei he, she, it)' : ''}.`);
  const spLoesung = (s, v) => `<span lang="en">${s.subj} <b class="vb">${v.form}</b> ${s.rest} ${v.sig}.</span> ${U.say(v.text)}<br>${spWarum(s, v)}<br><small>Auf Deutsch: ${v.de}</small>`;
  const SP_TIPP = 'Passiert es <b>immer wieder</b> (every day, on Mondays, often, never)? Dann das einfache Verb: plays. Passiert es <b>gerade jetzt</b> (now, at the moment, Look!)? Dann is + -ing: is playing.';
  const SPEX = (s, v) => ({ mode: 'satz', subj: s.subj, rest: s.rest, form: v.form, sig: v.sig, prog: v.prog, de: v.de, andere: v.prog ? s.sf : s.prog });
  // A: richtige Form auswählen
  function spWahl() {
    const s = pick(SP), v = spVar(s, Math.random() < 0.5), ch = shuffle([s.sf, s.prog, s.ing]);
    return { prompt: `Was gehört in die Lücke?${en(`${s.subj} ___ ${s.rest} ${v.sig}.`)}`, choices: ch.map((c) => `<span lang="en">${c}</span>`), correct: ch.indexOf(v.form), hint: SP_TIPP, solution: spLoesung(s, v), ex: SPEX(s, v) };
  }
  // B: Form eintippen
  function spTippen() {
    const s = pick(SP), v = spVar(s, Math.random() < 0.5);
    return {
      prompt: `Setze <b lang="en">${s.base}</b> in der richtigen Form ein. Achte auf das Signalwort.`, layout: 'satz',
      fields: [{ type: 'text', ci: true, answer: v.form, prefix: s.subj, suffix: `${s.rest} ${v.sig}.`, label: 'Verbform' }],
      hint: SP_TIPP, solution: spLoesung(s, v), ex: SPEX(s, v),
    };
  }
  // C: passendes Signalwort
  function spSignal() {
    const s = pick(SP), v = spVar(s, Math.random() < 0.5), ch = shuffle([s.sigS, s.sigP]);
    return {
      prompt: `Wie geht der Satz weiter?${en(`${s.subj} ${v.form} ${s.rest} …`)}`,
      choices: ch.map((c) => `<span lang="en">… ${c}.</span>`), correct: ch.indexOf(v.sig),
      hint: 'Schau auf das Verb: <b>is/are + -ing</b> heißt „gerade jetzt“. Das einfache Verb heißt „immer wieder“.',
      solution: spLoesung(s, v), ex: SPEX(s, v),
    };
  }
  // D: Signalwörter sortieren
  function spSortieren() {
    const prog = Math.random() < 0.5, w = pick(prog ? SIG_P : SIG_S);
    return {
      prompt: `Zu welcher Zeitform gehört das Signalwort <b lang="en">${w}</b>?`,
      choices: ['present simple (immer wieder)', 'present progressive (gerade jetzt)'], correct: prog ? 1 : 0,
      hint: 'Sagt das Wort „regelmäßig, immer wieder“ oder „in diesem Moment“?',
      solution: `<b class="vb" lang="en">${w}</b> gehört zum <b>${prog ? 'present progressive' : 'present simple'}</b>.<br>Immer wieder: <span lang="en">${SIG_S.join(', ')}</span>.<br>Gerade jetzt: <span lang="en">${SIG_P.join(', ')}</span>.`,
      ex: { mode: 'signal', wort: w, prog },
    };
  }
  // E: Was bedeutet der Satz?
  function spBedeutung() {
    const s = pick(SP), prog = Math.random() < 0.5;
    const satz = prog ? `${s.subj} ${s.prog} ${s.rest}.` : `${s.subj} ${s.sf} ${s.rest}.`;
    return {
      prompt: `Was sagt dieser Satz?${en(satz)}`,
      choices: ['Das passiert gerade jetzt, in diesem Moment.', 'Das passiert regelmäßig, immer wieder.'], correct: prog ? 0 : 1,
      hint: 'Schau auf das Verb: <b>is/are + -ing</b> heißt „gerade jetzt“. Das einfache Verb heißt „immer wieder“.',
      solution: `<span lang="en">${s.subj} <b class="vb">${prog ? s.prog : s.sf}</b> ${s.rest}.</span><br>${prog ? `<b>${s.prog}</b> (${s.be} + -ing): Es passiert gerade jetzt.` : `<b>${s.sf}</b> (einfaches Verb): Es passiert regelmäßig.`}<br>Zum Vergleich: ${`<span lang="en">${s.textS}</span> ${U.say(s.textS)}`} · ${`<span lang="en">${s.textP}</span> ${U.say(s.textP)}`}`,
      ex: SPEX(s, spVar(s, prog)),
    };
  }
  const simpleProg = () => U.wahl([[26, spWahl], [22, spTippen], [18, spSignal], [18, spSortieren], [16, spBedeutung]]);

  // =====================================================
  // me, you, him, her, it, us, them
  // =====================================================
  const OBJ = { I: 'me', You: 'you', He: 'him', She: 'her', It: 'it', We: 'us', They: 'them' };
  const OBJ_DE = { me: 'mich, mir', you: 'dich, dir (auch: euch)', him: 'ihn, ihm', her: 'sie, ihr (eine)', it: 'es', us: 'uns', them: 'sie, ihnen (mehrere)' };
  const ALLE_OBJ = ['me', 'him', 'her', 'it', 'us', 'them'];
  // [Satzanfang, wen oder was, Pronomen, Satzzeichen, Deutsch]
  const OS = [
    ['I like', 'Ben', 'him', '.', 'Ich mag ihn.'], ['I like', 'Lisa', 'her', '.', 'Ich mag sie.'],
    ['We help', 'our parents', 'them', '.', 'Wir helfen ihnen.'], ['She loves', 'her bike', 'it', '.', 'Sie liebt es.'],
    ['Can you see', 'Tom and me', 'us', '?', 'Kannst du uns sehen?'], ['Tom knows', 'my sister', 'her', '.', 'Tom kennt sie.'],
    ['I often meet', 'my friends', 'them', '.', 'Ich treffe sie oft.'], ['Please help', 'my brother', 'him', '.', 'Bitte hilf ihm.'],
    ['Look at', 'the birds', 'them', '.', 'Schau sie an.'], ['I can’t find', 'my book', 'it', '.', 'Ich kann es nicht finden.'],
    ['Listen to', 'Mrs Green', 'her', '.', 'Hör ihr zu.'], ['The teacher likes', 'Ben and me', 'us', '.', 'Der Lehrer mag uns.'],
    ['Do you know', 'Mr Brown', 'him', '?', 'Kennst du ihn?'], ['We visit', 'our grandparents', 'them', '.', 'Wir besuchen sie.'],
  ].map(([vor, wen, pron, end, de]) => ({ vor, wen, pron, end, de, alt: `${vor} ${wen}${end}`, text: `${vor} ${pron}${end}` }));
  const OBJ_ART = { him: 'ein Junge oder Mann', her: 'ein Mädchen oder eine Frau', it: 'eine Sache', them: 'mehrere', us: 'mehrere, und ich bin dabei' };
  const obLoesung = (s) => `<span lang="en">${s.vor} <b>${s.wen}</b>${s.end}</span> → <span lang="en">${s.vor} <b class="vb">${s.pron}</b>${s.end}</span> ${U.say(s.text)}<br><b>${s.wen}</b>: ${OBJ_ART[s.pron]}. Hinter dem Verb heißt es dann <b>${s.pron}</b>.<br><small>Auf Deutsch: ${s.de}</small>`;
  const OB_TIPP = 'Steht das Pronomen <b>hinter</b> dem Verb oder hinter einem kleinen Wort wie to, at, for, with? Dann brauchst du die zweite Form: I → me · he → him · she → her · we → us · they → them. Nur you und it bleiben gleich.';
  // A: ersetzen (Auswahl)
  function obWahl() {
    const s = pick(OS), ch = shuffle([s.pron, ...shuffle(ALLE_OBJ.filter((x) => x !== s.pron)).slice(0, 3)]);
    return { prompt: `Welches Wort kann für den <b>fett</b> gedruckten Teil stehen?${en(`${s.vor} <b>${s.wen}</b>${s.end}`)}`, choices: ch.map((c) => `<span lang="en">${c}</span>`), correct: ch.indexOf(s.pron), hint: OB_TIPP, solution: obLoesung(s), ex: { mode: 'satz', vor: s.vor, wen: s.wen, pron: s.pron, end: s.end, de: s.de } };
  }
  // B: ersetzen (tippen)
  function obTippen() {
    const s = pick(OS);
    return {
      prompt: `Ersetze <b lang="en">${s.wen}</b> durch ein Pronomen.${en(s.alt)}`, layout: 'satz',
      fields: [{ type: 'text', ci: true, answer: s.pron, prefix: s.vor, suffix: s.end, label: 'Pronomen' }],
      hint: OB_TIPP, solution: obLoesung(s), ex: { mode: 'satz', vor: s.vor, wen: s.wen, pron: s.pron, end: s.end, de: s.de },
    };
  }
  // C: die Paare I – me, he – him …
  function obPaar() {
    const p = pick(['I', 'He', 'She', 'We', 'They']), hin = Math.random() < 0.5, o = OBJ[p];
    if (hin) {
      const ch = shuffle([o, ...shuffle(ALLE_OBJ.filter((x) => x !== o)).slice(0, 3)]);
      return { prompt: `Welche Form gehört zu <b lang="en">${klein(p)}</b>, wenn sie hinter dem Verb steht?`, choices: ch.map((c) => `<span lang="en">${c}</span>`), correct: ch.indexOf(o), hint: OB_TIPP, solution: `${klein(p)} → <b class="vb" lang="en">${o}</b> (${OBJ_DE[o]})<br>Vorn im Satz: <span lang="en">${p} …</span> Hinter dem Verb: <span lang="en">… ${o}.</span>`, ex: { mode: 'paar', pron: p } };
    }
    const ps = ['I', 'He', 'She', 'We', 'They'], ch = shuffle(ps).slice(0, 4); if (!ch.includes(p)) ch[0] = p;
    const c2 = shuffle(ch);
    return { prompt: `Zu welchem Wort gehört <b lang="en">${o}</b>?`, choices: c2.map((c) => `<span lang="en">${klein(c)}</span>`), correct: c2.indexOf(p), hint: OB_TIPP, solution: `<b class="vb" lang="en">${o}</b> gehört zu ${klein(p)} (${OBJ_DE[o]})<br>Vorn im Satz: <span lang="en">${p} …</span> Hinter dem Verb: <span lang="en">… ${o}.</span>`, ex: { mode: 'paar', pron: p } };
  }
  // D: vorn oder hinten? (I oder me, he oder him …)
  const OSO = [
    ['___ am tired.', 'I', 'Me', 0, 'Ich bin müde.'], ['Can you help ___?', 'me', 'I', 1, 'Kannst du mir helfen?'],
    ['___ lives in London.', 'He', 'Him', 0, 'Er wohnt in London.'], ['I know ___.', 'him', 'he', 1, 'Ich kenne ihn.'],
    ['___ is my sister.', 'She', 'Her', 0, 'Sie ist meine Schwester.'], ['This present is for ___.', 'her', 'she', 1, 'Dieses Geschenk ist für sie.'],
    ['___ are friends.', 'We', 'Us', 0, 'Wir sind Freunde.'], ['Come with ___.', 'us', 'we', 1, 'Komm mit uns.'],
    ['___ play football.', 'They', 'Them', 0, 'Sie spielen Fußball.'], ['I like ___.', 'them', 'they', 1, 'Ich mag sie.'],
  ].map(([satz, richtig, falsch, hinten, de]) => ({ satz, richtig, falsch, hinten, de, text: satz.replace('___', richtig) }));
  function obVornHinten() {
    const s = pick(OSO), ch = shuffle([s.richtig, s.falsch]);
    return {
      prompt: `Was gehört in die Lücke?${en(s.satz)}`,
      choices: ch.map((c) => `<span lang="en">${c}</span>`), correct: ch.indexOf(s.richtig),
      hint: '<b>Vorn</b> im Satz (wer tut etwas?) stehen I, he, she, we, they. <b>Hinter</b> dem Verb oder hinter to, at, for, with stehen me, him, her, us, them.',
      solution: `<span lang="en">${s.satz.replace('___', `<b class="vb">${s.richtig}</b>`)}</span> ${U.say(s.text)}<br>${s.hinten ? `Die Lücke steht <b>hinten</b>: Dort braucht man <b>${s.richtig}</b>, nicht ${s.falsch}.` : `Die Lücke steht <b>vorn</b>: Wer tut etwas? Dort braucht man <b>${s.richtig}</b>, nicht ${s.falsch}.`}<br><small>Auf Deutsch: ${s.de}</small>`,
      ex: { mode: 'vh', satz: s.satz, richtig: s.richtig, hinten: s.hinten, de: s.de },
    };
  }
  // E: Deutsch → Englisch
  function obDeutsch() {
    const [de, o] = pick([['mich', 'me'], ['mir', 'me'], ['ihn', 'him'], ['ihm', 'him'], ['uns', 'us'], ['sie (ein Mädchen)', 'her'], ['sie (mehrere)', 'them'], ['ihnen', 'them']]);
    const ch = shuffle([o, ...shuffle(ALLE_OBJ.filter((x) => x !== o && x !== 'it')).slice(0, 3)]);
    return {
      prompt: `Wie heißt <b>${de}</b> auf Englisch?`,
      choices: ch.map((c) => `<span lang="en">${c}</span>`), correct: ch.indexOf(o),
      hint: 'me = mich, mir · him = ihn, ihm · her = sie, ihr · us = uns · them = sie, ihnen.',
      solution: `${de} = <b class="vb" lang="en">${o}</b><br>Das Englische macht hier keinen Unterschied: <b>${o}</b> heißt ${OBJ_DE[o]}.`,
      ex: { mode: 'paar', pron: Object.keys(OBJ).find((k) => OBJ[k] === o) },
    };
  }
  const objektPron = () => U.wahl([[26, obWahl], [22, obTippen], [16, obPaar], [22, obVornHinten], [14, obDeutsch]]);

  Object.assign(D.daten, { PP, PPQ, INGS, ingRegel, SP, SIG_S, SIG_P, OBJ, OBJ_DE, OS, OSO, OBJ_ART });
  const themenVorPP = D.audioThemen;
  D.audioThemen = () => Object.assign(themenVorPP(), {
    'e5-pp': [...PP.map((s) => s.text), ...PP.map((s) => s.neg), ...PPQ.map((s) => s.frage)],
    'e5-sp': SP.flatMap((s) => [s.textS, s.textP]),
    'e5-obj': [...OS.map((s) => s.text), ...OSO.map((s) => s.text)],
  });
  Object.assign(D.arten, {
    'e5-pp': { ppBe, ppIng, ppIngForm, ppBeides, ppOrdnen, ppNeg, ppFrage },
    'e5-sp': { spWahl, spTippen, spSignal, spSortieren, spBedeutung },
    'e5-obj': { obWahl, obTippen, obPaar, obVornHinten, obDeutsch },
  });

  // =====================================================
  // some und any
  // =====================================================
  // [Aussage, Verneinung, Frage, Deutsch dreimal]
  const SA = [
    ['There is ___ milk in the fridge.', 'There isn’t ___ milk in the fridge.', 'Is there ___ milk in the fridge?', 'Im Kühlschrank ist etwas Milch.', 'Im Kühlschrank ist keine Milch.', 'Ist Milch im Kühlschrank?'],
    ['I have got ___ apples.', 'I haven’t got ___ apples.', 'Have you got ___ apples?', 'Ich habe ein paar Äpfel.', 'Ich habe keine Äpfel.', 'Hast du Äpfel?'],
    ['We need ___ eggs.', 'We don’t need ___ eggs.', 'Do we need ___ eggs?', 'Wir brauchen ein paar Eier.', 'Wir brauchen keine Eier.', 'Brauchen wir Eier?'],
    ['There are ___ books on the table.', 'There aren’t ___ books on the table.', 'Are there ___ books on the table?', 'Auf dem Tisch liegen ein paar Bücher.', 'Auf dem Tisch liegen keine Bücher.', 'Liegen Bücher auf dem Tisch?'],
    ['She has got ___ money.', 'She hasn’t got ___ money.', 'Has she got ___ money?', 'Sie hat etwas Geld.', 'Sie hat kein Geld.', 'Hat sie Geld?'],
    ['Tom wants ___ water.', 'Tom doesn’t want ___ water.', 'Does Tom want ___ water?', 'Tom möchte etwas Wasser.', 'Tom möchte kein Wasser.', 'Möchte Tom Wasser?'],
    ['They have got ___ friends in London.', 'They haven’t got ___ friends in London.', 'Have they got ___ friends in London?', 'Sie haben ein paar Freunde in London.', 'Sie haben keine Freunde in London.', 'Haben sie Freunde in London?'],
    ['There is ___ juice in the bottle.', 'There isn’t ___ juice in the bottle.', 'Is there ___ juice in the bottle?', 'In der Flasche ist etwas Saft.', 'In der Flasche ist kein Saft.', 'Ist Saft in der Flasche?'],
    ['I can see ___ birds in the garden.', 'I can’t see ___ birds in the garden.', 'Can you see ___ birds in the garden?', 'Ich sehe ein paar Vögel im Garten.', 'Ich sehe keine Vögel im Garten.', 'Siehst du Vögel im Garten?'],
  ].map((z, t) => ['+', '-', '?'].map((art, k) => ({ t, art, satz: z[k], form: k ? 'any' : 'some', de: z[k + 3], text: z[k].replace('___', k ? 'any' : 'some') })));
  const SAS = SA.flat();
  const SA_ART = { '+': 'Das ist eine <b>Aussage</b>: Etwas ist da.', '-': 'Der Satz ist <b>verneint</b> (not oder n’t).', '?': 'Das ist eine <b>Frage</b>.' };
  const saMark = (x) => `<span lang="en">${x.satz.replace('___', `<b class="vb">${x.form}</b>`)}</span>`;
  const saLoesung = (x) => `${saMark(x)} ${U.say(x.text)}<br>${SA_ART[x.art]} Dann steht <b>${x.form}</b>.<br><small>Auf Deutsch: ${x.de}</small>`;
  const SA_TIPP = '<b>some</b> steht in Aussagen: Es ist etwas da. <b>any</b> steht in Verneinungen (not, n’t) und in Fragen.';
  const SAEX = (x) => ({ satz: x.satz, art: x.art, form: x.form, de: x.de });
  // A: some oder any (Auswahl)
  function saWahl() {
    const x = pick(SAS);
    return { prompt: `Was gehört in die Lücke?${en(x.satz)}`, choices: ['some', 'any'].map((c) => `<span lang="en">${c}</span>`), correct: x.form === 'some' ? 0 : 1, hint: SA_TIPP, solution: saLoesung(x), ex: SAEX(x) };
  }
  // B: eintippen
  function saTippen() {
    const x = pick(SAS), [a, b] = x.satz.split('___');
    return { prompt: '<b>some</b> oder <b>any</b>? Tippe das passende Wort ein.', layout: 'satz', fields: [{ type: 'text', ci: true, answer: x.form, prefix: a.trim(), suffix: b.trim(), label: 'some oder any' }], hint: SA_TIPP, solution: saLoesung(x), ex: SAEX(x) };
  }
  // C: Welcher Satz ist richtig?
  function saRichtig() {
    const x = pick(SAS), falsch = x.satz.replace('___', x.form === 'some' ? 'any' : 'some'), ch = shuffle([x.text, falsch]);
    return { prompt: 'Welcher Satz ist richtig?', choices: ch.map((c) => `<span lang="en">${c}</span>`), correct: ch.indexOf(x.text), hint: SA_TIPP, solution: saLoesung(x), ex: SAEX(x) };
  }
  // D: umbauen – aus der Aussage wird eine Verneinung oder Frage
  function saUmbau() {
    const z = pick(SA), x = z[pick([1, 2])], [a, b] = x.satz.split('___');
    return {
      prompt: `Mach aus dem Satz eine <b>${x.art === '-' ? 'Verneinung' : 'Frage'}</b>. Welches Wort fehlt?${en(z[0].text)}`, layout: 'satz',
      fields: [{ type: 'text', ci: true, answer: 'any', prefix: a.trim(), suffix: b.trim(), label: 'some oder any' }],
      hint: 'In der Aussage steht some. Was wird daraus, wenn der Satz verneint ist oder eine Frage wird?',
      solution: `<span lang="en">${z[0].text}</span> → ${saMark(x)} ${U.say(x.text)}<br>Aus <b>some</b> wird <b>any</b>: ${SA_ART[x.art]}<br><small>Auf Deutsch: ${x.de}</small>`, ex: SAEX(x),
    };
  }
  // E: Was bedeutet der Satz?
  function saBedeutung() {
    const z = pick(SA), x = z[pick([0, 1])], ch = shuffle([z[0].de, z[1].de]);
    return {
      prompt: `Was bedeutet der Satz?${en(x.text)}`, choices: ch, correct: ch.indexOf(x.de),
      hint: '<b>some</b> heißt „etwas“ oder „ein paar“. <b>not … any</b> heißt „kein, keine“.',
      solution: `${saMark(x)} ${U.say(x.text)}<br>${x.art === '+' ? '<b>some</b> heißt „etwas“ oder „ein paar“.' : '<b>not … any</b> heißt „kein“ oder „keine“.'}<br><small>Auf Deutsch: ${x.de}</small>`, ex: SAEX(x),
    };
  }
  const someAny = () => U.wahl([[26, saWahl], [24, saTippen], [16, saRichtig], [20, saUmbau], [14, saBedeutung]]);

  // =====================================================
  // much, many, a lot of
  // =====================================================
  // z: zählbar (true) oder nicht (false)
  const MQ = [
    ['apples', true, 'How ___ apples have you got?', 'Wie viele Äpfel hast du?'], ['books', true, 'How ___ books are on the table?', 'Wie viele Bücher liegen auf dem Tisch?'],
    ['friends', true, 'How ___ friends has Tom got?', 'Wie viele Freunde hat Tom?'], ['eggs', true, 'How ___ eggs do we need?', 'Wie viele Eier brauchen wir?'],
    ['pets', true, 'How ___ pets have you got?', 'Wie viele Haustiere hast du?'], ['pencils', true, 'How ___ pencils are in your bag?', 'Wie viele Bleistifte sind in deiner Tasche?'],
    ['children', true, 'How ___ children are in your class?', 'Wie viele Kinder sind in deiner Klasse?'], ['bananas', true, 'How ___ bananas do you want?', 'Wie viele Bananen möchtest du?'],
    ['water', false, 'How ___ water do you drink?', 'Wie viel Wasser trinkst du?'], ['milk', false, 'How ___ milk is in the fridge?', 'Wie viel Milch ist im Kühlschrank?'],
    ['money', false, 'How ___ money have you got?', 'Wie viel Geld hast du?'], ['time', false, 'How ___ time have we got?', 'Wie viel Zeit haben wir?'],
    ['homework', false, 'How ___ homework have you got?', 'Wie viele Hausaufgaben hast du?'], ['juice', false, 'How ___ juice do you want?', 'Wie viel Saft möchtest du?'],
    ['bread', false, 'How ___ bread do we need?', 'Wie viel Brot brauchen wir?'], ['cheese', false, 'How ___ cheese is on the pizza?', 'Wie viel Käse ist auf der Pizza?'],
  ];
  const MN = [
    ['eggs', true, 'There aren’t ___ eggs in the fridge.', 'Im Kühlschrank sind nicht viele Eier.'], ['friends', true, 'I haven’t got ___ friends in London.', 'Ich habe nicht viele Freunde in London.'],
    ['books', true, 'We haven’t got ___ books.', 'Wir haben nicht viele Bücher.'], ['children', true, 'There aren’t ___ children in the park.', 'Im Park sind nicht viele Kinder.'],
    ['milk', false, 'There isn’t ___ milk in the fridge.', 'Im Kühlschrank ist nicht viel Milch.'], ['time', false, 'I haven’t got ___ time.', 'Ich habe nicht viel Zeit.'],
    ['money', false, 'We haven’t got ___ money.', 'Wir haben nicht viel Geld.'], ['water', false, 'There isn’t ___ water in the bottle.', 'In der Flasche ist nicht viel Wasser.'],
  ];
  const ML = [
    ['friends', true, 'She has got ___ friends.', 'Sie hat viele Freunde.'], ['books', true, 'There are ___ books in my room.', 'In meinem Zimmer sind viele Bücher.'],
    ['bananas', true, 'Tom eats ___ bananas.', 'Tom isst viele Bananen.'], ['homework', false, 'We have got ___ homework.', 'Wir haben viele Hausaufgaben.'],
    ['water', false, 'There is ___ water in the lake.', 'Im See ist viel Wasser.'], ['tea', false, 'My dad drinks ___ tea.', 'Mein Papa trinkt viel Tee.'],
  ];
  const mm = (liste, lot) => liste.map(([wort, z, satz, de]) => { const form = lot ? 'a lot of' : z ? 'many' : 'much'; return { wort, z, satz, de, form, lot: !!lot, text: satz.replace('___', form) }; });
  const MMQ = mm(MQ), MMN = mm(MN), MML = mm(ML, true), MMS = [...MMQ, ...MMN];
  const MM_Z = [...new Map([...MQ, ...MN, ...ML, ['chairs', true], ['sandwiches', true], ['sugar', false], ['rice', false], ['butter', false]].map((x) => [x[0], x[1]])).entries()];
  const mmWarum = (x) => (x.z ? `<b>${x.wort}</b> kann man <b>zählen</b> (one, two, three …).` : `<b>${x.wort}</b> kann man <b>nicht zählen</b>. Es hat keine Mehrzahl.`);
  const mmMark = (x) => `<span lang="en">${x.satz.replace('___', `<b class="vb">${x.form}</b>`)}</span>`;
  const mmLoesung = (x) => `${mmMark(x)} ${U.say(x.text)}<br>${mmWarum(x)} ${x.lot ? '<b>a lot of</b> passt zu beidem.' : `Dann heißt es <b>${x.form}</b>.`}<br><small>Auf Deutsch: ${x.de}</small>`;
  const MM_TIPP = 'Kann man es <b>zählen</b> (one apple, two apples)? Dann <b>many</b>. Kann man es <b>nicht zählen</b> (water, money, time)? Dann <b>much</b>.';
  const MMEX = (x) => ({ mode: 'satz', satz: x.satz, wort: x.wort, z: x.z, form: x.form, de: x.de, art: x.lot ? 'l' : x.satz.startsWith('How') ? 'q' : 'n' });
  const mmCh = ['much', 'many'].map((c) => `<span lang="en">${c}</span>`);
  // A: How much oder How many
  function mmHow() {
    const x = pick(MMQ);
    return { prompt: `Was gehört in die Lücke?${en(x.satz)}`, choices: mmCh, correct: x.z ? 1 : 0, hint: MM_TIPP, solution: mmLoesung(x), ex: MMEX(x) };
  }
  // B: eintippen
  function mmTippen() {
    const x = pick(MMS), [a, b] = x.satz.split('___');
    return { prompt: '<b>much</b> oder <b>many</b>? Tippe das passende Wort ein.', layout: 'satz', fields: [{ type: 'text', ci: true, answer: x.form, prefix: a.trim(), suffix: b.trim(), label: 'much oder many' }], hint: MM_TIPP, solution: mmLoesung(x), ex: MMEX(x) };
  }
  // C: zählbar oder nicht?
  function mmZaehlbar() {
    const [wort, z] = pick(MM_Z);
    return {
      prompt: `Kann man das zählen? <b lang="en">${wort}</b>`, choices: ['zählbar: Dazu passt many.', 'nicht zählbar: Dazu passt much.'], correct: z ? 0 : 1,
      hint: 'Probiere es mit Zahlen: Kannst du „two …“ davor sagen? Dann ist es zählbar.',
      solution: `${mmWarum({ wort, z })}<br>Deshalb: <b class="vb" lang="en">${z ? 'many' : 'much'} ${wort}</b>.`, ex: { mode: 'wort', wort, z },
    };
  }
  // D: verneinte Sätze
  function mmNeg() {
    const x = pick(MMN);
    return { prompt: `Was gehört in die Lücke?${en(x.satz)}`, choices: mmCh, correct: x.z ? 1 : 0, hint: MM_TIPP, solution: mmLoesung(x), ex: MMEX(x) };
  }
  // E: a lot of passt zu beidem
  function mmLot() {
    const x = pick(MML), falsch = x.z ? 'much' : 'many', ch = shuffle(['a lot of', falsch]);
    return {
      prompt: `Was gehört in die Lücke?${en(x.satz)}`, choices: ch.map((c) => `<span lang="en">${c}</span>`), correct: ch.indexOf('a lot of'),
      hint: '<b>a lot of</b> heißt „viel, viele“ und passt immer. much passt nur zu Dingen, die man nicht zählt, many nur zu Dingen, die man zählt.',
      solution: `${mmMark(x)} ${U.say(x.text)}<br>${mmWarum(x)} Deshalb passt <b>${falsch}</b> hier nicht. <b>a lot of</b> passt zu beidem.<br><small>Auf Deutsch: ${x.de}</small>`, ex: MMEX(x),
    };
  }
  const muchMany = () => U.wahl([[24, mmHow], [24, mmTippen], [20, mmZaehlbar], [18, mmNeg], [14, mmLot]]);

  Object.assign(D.daten, { SA, SAS, SA_ART, MMQ, MMN, MML, MMS, MM_Z });
  const themenVorSome = D.audioThemen;
  D.audioThemen = () => Object.assign(themenVorSome(), {
    'e5-some': SAS.map((x) => x.text),
    'e5-much': [...MMQ, ...MMN, ...MML].map((x) => x.text),
  });
  Object.assign(D.arten, {
    'e5-some': { saWahl, saTippen, saRichtig, saUmbau, saBedeutung },
    'e5-much': { mmHow, mmTippen, mmZaehlbar, mmNeg, mmLot },
  });

  // =====================================================
  // Wo? in, on, under, next to, behind, in front of, between – mit Bild
  // =====================================================
  // Bild: Kiste und Tisch schräg von vorn, das Tier liegt je nach Wort vor oder hinter den Dingen.
  const KISTE = (dx, offen) => {
    const P = (pts) => pts.map(([x, y]) => `${x + dx},${y}`).join(' ');
    const S = 'stroke="#7a5426" stroke-width="2" stroke-linejoin="round"';
    const oben = offen
      ? `<polygon points="${P([[140, 112], [220, 112], [244, 96], [164, 96]])}" fill="#5a3b18" ${S}/><polygon points="${P([[164, 96], [244, 96], [252, 80], [172, 80]])}" fill="#e8bd80" ${S}/><polygon points="${P([[140, 112], [164, 96], [146, 86], [122, 102]])}" fill="#e8bd80" ${S}/>`
      : `<polygon points="${P([[140, 112], [220, 112], [244, 96], [164, 96]])}" fill="#e8bd80" ${S}/><line x1="${152 + dx}" y1="104" x2="${232 + dx}" y2="104" stroke="#b9884a" stroke-width="4"/>`;
    const vorn = `<rect x="${140 + dx}" y="112" width="80" height="58" fill="#d8a464" ${S}/><polygon points="${P([[220, 112], [244, 96], [244, 154], [220, 170]])}" fill="#b9884a" ${S}/>${offen ? `<polygon points="${P([[140, 112], [220, 112], [226, 124], [134, 124]])}" fill="#e8bd80" ${S}/>` : ''}`;
    return { oben, vorn };
  };
  const TISCH_HINTEN = '<rect x="268" y="92" width="7" height="66" fill="#8a5a2c"/><rect x="146" y="92" width="7" height="58" fill="#8a5a2c"/>';
  const TISCH_VORN = '<polygon points="120,100 260,100 280,86 140,86" fill="#b67c40" stroke="#6e4520" stroke-width="2" stroke-linejoin="round"/><rect x="120" y="100" width="140" height="8" fill="#8a5a2c" stroke="#6e4520" stroke-width="2"/><rect x="124" y="108" width="8" height="62" fill="#8a5a2c"/><rect x="248" y="108" width="8" height="62" fill="#8a5a2c"/>';
  const TIER = {
    cat: { en: 'the cat', de: 'Die Katze', farbe: '#f08a2c', dunkel: '#c46a1a', ohren: 'M-17 -38 l1 -12 l8 7z M-6 -42 l6 -9 l3 10z' },
    dog: { en: 'the dog', de: 'Der Hund', farbe: '#a8754a', dunkel: '#7a5230', ohren: 'M-19 -38 q-4 4 -2 14 q5 -2 7 -10z M2 -38 q4 4 2 14 q-5 -2 -7 -10z' },
  };
  const tierSvg = (t, x, y, sk, flip) => {
    const a = TIER[t];
    return `<g transform="translate(${x} ${y}) scale(${flip ? -sk : sk} ${sk})"><path d="M14 -4 q24 2 18 -24" stroke="${a.dunkel}" stroke-width="5" fill="none" stroke-linecap="round"/><ellipse cx="4" cy="-14" rx="15" ry="14" fill="${a.farbe}"/><path d="${a.ohren}" fill="${t === 'dog' ? a.dunkel : a.farbe}"/><circle cx="-8" cy="-32" r="11" fill="${a.farbe}"/><circle cx="-12" cy="-33" r="1.7" fill="#222"/><circle cx="-4" cy="-33" r="1.7" fill="#222"/><ellipse cx="-8" cy="-28" rx="2" ry="1.4" fill="#222"/><ellipse cx="-5" cy="-1" rx="5" ry="3" fill="${a.dunkel}"/></g>`;
  };
  // Szene: hinten (vor dem Tier gezeichnet), vorn (darüber), wo das Tier sitzt
  const ORT_SZENE = {
    'in|box': () => { const k = KISTE(0, true); return { hinten: k.oben, vorn: k.vorn, pos: [188, 107, 0.85] }; },
    'on|box': () => { const k = KISTE(0); return { hinten: k.oben + k.vorn, vorn: '', pos: [192, 106, 0.85] }; },
    'on|table': () => ({ hinten: TISCH_HINTEN + TISCH_VORN, vorn: '', pos: [200, 96, 0.85] }),
    'under|table': () => ({ hinten: TISCH_HINTEN, vorn: TISCH_VORN, pos: [196, 166, 0.85] }),
    'next to|box': () => { const k = KISTE(-30); return { hinten: k.oben + k.vorn, vorn: '', pos: [270, 170, 1] }; },
    'next to|table': () => ({ hinten: TISCH_HINTEN + TISCH_VORN, vorn: '', pos: [312, 170, 0.95] }),
    'behind|box': () => { const k = KISTE(0); return { hinten: '', vorn: k.oben + k.vorn, pos: [252, 140, 0.95, true] }; },
    'in front of|box': () => { const k = KISTE(0); return { hinten: k.oben + k.vorn, vorn: '', pos: [182, 196, 1.05] }; },
    'between|boxes': () => { const a = KISTE(-104), b = KISTE(78); return { hinten: a.oben + a.vorn + b.oben + b.vorn, vorn: '', pos: [178, 170, 1] }; },
  };
  const BODEN = '<polygon points="0,150 360,150 360,210 0,210" fill="#f4efe4"/><line x1="0" y1="150" x2="360" y2="150" stroke="#e2dacb" stroke-width="2"/>';
  const ortBild = (o, tier) => {
    const sz = ORT_SZENE[`${o.prep}|${o.ding}`](), [x, y, sk, flip] = sz.pos;
    return `<svg viewBox="0 30 360 180" role="img" aria-label="Bild">${BODEN}${sz.hinten}${tierSvg(tier, x, y, sk, flip)}${sz.vorn}</svg>`;
  };
  // [Wort, Ding, englischer Ort, deutscher Ort]
  const ORTE = [
    ['in', 'box', 'the box', 'in der Kiste'], ['on', 'box', 'the box', 'auf der Kiste'], ['on', 'table', 'the table', 'auf dem Tisch'],
    ['under', 'table', 'the table', 'unter dem Tisch'], ['next to', 'box', 'the box', 'neben der Kiste'], ['next to', 'table', 'the table', 'neben dem Tisch'],
    ['behind', 'box', 'the box', 'hinter der Kiste'], ['in front of', 'box', 'the box', 'vor der Kiste'], ['between', 'boxes', 'the two boxes', 'zwischen den beiden Kisten'],
  ].map(([prep, ding, wo, deWo]) => ({ prep, ding, wo, deWo }));
  const PREPS = ['in', 'on', 'under', 'next to', 'behind', 'in front of', 'between'];
  const PREP_DE = { in: 'in', on: 'auf', under: 'unter', 'next to': 'neben', behind: 'hinter', 'in front of': 'vor', between: 'zwischen' };
  // Wörter, die bei einem Bild leicht auch passen könnten, kommen nicht als falsche Antwort vor
  const ORT_NICHT = { behind: ['next to'], 'in front of': ['next to'], between: ['next to', 'in'], 'next to': ['behind', 'in front of'], in: ['between'], on: ['between'], under: ['between'] };
  const ORT_SAETZE = Object.keys(TIER).flatMap((t) => ORTE.map((o) => ({ ...o, tier: t, text: `${gross(TIER[t].en)} is ${o.prep} ${o.wo}.`, de: `${TIER[t].de} ist ${o.deWo}.` })));
  const ortErkl = { in: 'Das Tier ist <b>drin</b>.', on: 'Das Tier sitzt <b>oben drauf</b>.', under: 'Das Tier ist <b>darunter</b>.', 'next to': 'Das Tier sitzt <b>daneben</b>.', behind: 'Das Tier ist <b>dahinter</b>: Die Kiste verdeckt einen Teil.', 'in front of': 'Das Tier sitzt <b>davor</b>: Es verdeckt einen Teil der Kiste.', between: 'Das Tier sitzt <b>in der Mitte</b> zwischen zwei Dingen.' };
  const ortLoesung = (o) => `<span lang="en">${gross(TIER[o.tier].en)} is <b class="vb">${o.prep}</b> ${o.wo}.</span> ${U.say(o.text)}<br>${ortErkl[o.prep]} <b>${o.prep}</b> heißt <b>${PREP_DE[o.prep]}</b>.<br><small>Auf Deutsch: ${o.de}</small>`;
  const ORT_TIPP = 'in = in · on = auf · under = unter · next to = neben · behind = hinter · in front of = vor · between = zwischen';
  const ORTEX = (o) => ({ mode: 'bild', prep: o.prep, ding: o.ding, tier: o.tier });
  const ortAndere = (o, n) => shuffle(PREPS.filter((p) => p !== o.prep && !(ORT_NICHT[o.prep] || []).includes(p) && (o.ding === 'boxes' || p !== 'between'))).slice(0, n);
  // A: Bild ansehen, Wort auswählen
  function ortWahl() {
    const o = pick(ORT_SAETZE), ch = shuffle([o.prep, ...ortAndere(o, 3)]);
    return { prompt: `Wo ist ${o.tier === 'cat' ? 'die Katze' : 'der Hund'}? Was gehört in die Lücke?${en(`${gross(TIER[o.tier].en)} is ___ ${o.wo}.`)}`, figure: ortBild(o, o.tier), choices: ch.map((c) => `<span lang="en">${c}</span>`), correct: ch.indexOf(o.prep), hint: ORT_TIPP, solution: ortLoesung(o), ex: ORTEX(o) };
  }
  // B: Bild ansehen, Wort eintippen
  function ortTippen() {
    const o = pick(ORT_SAETZE);
    return {
      prompt: 'Schau dir das Bild an. Welches Wort fehlt?', figure: ortBild(o, o.tier), layout: 'satz',
      fields: [{ type: 'text', ci: true, answer: o.prep, prefix: `${gross(TIER[o.tier].en)} is`, suffix: `${o.wo}.`, label: 'Wo?' }],
      hint: ORT_TIPP, solution: ortLoesung(o), ex: ORTEX(o),
    };
  }
  // C: Welcher Satz passt zum Bild?
  function ortSatz() {
    const o = pick(ORT_SAETZE), andere = ortAndere(o, 6).filter((p) => o.ding !== 'table' || ['on', 'under', 'next to'].includes(p)).slice(0, 2);
    const satz = (p) => `${gross(TIER[o.tier].en)} is ${p} ${o.wo}.`, ch = shuffle([o.prep, ...andere]);
    return { prompt: 'Welcher Satz passt zum Bild?', figure: ortBild(o, o.tier), choices: ch.map((p) => `<span lang="en">${satz(p)}</span>`), correct: ch.indexOf(o.prep), hint: ORT_TIPP, solution: ortLoesung(o), ex: ORTEX(o) };
  }
  // D: Deutsch → Englisch
  function ortDeutsch() {
    const p = pick(PREPS.filter((x) => x !== 'in')), ch = shuffle([p, ...shuffle(PREPS.filter((x) => x !== p)).slice(0, 3)]);
    const o = { ...pick(ORTE.filter((x) => x.prep === p)), tier: pick(['cat', 'dog']) };
    o.text = `${gross(TIER[o.tier].en)} is ${o.prep} ${o.wo}.`; o.de = `${TIER[o.tier].de} ist ${o.deWo}.`;
    return {
      prompt: `Wo ist etwas? Wie heißt <b>„${PREP_DE[p]}“</b> auf Englisch?`, choices: ch.map((c) => `<span lang="en">${c}</span>`), correct: ch.indexOf(p),
      hint: ORT_TIPP, solution: `${PREP_DE[p]} = <b class="vb" lang="en">${p}</b><br>Beispiel: ${ortLoesung(o).split('<br>')[0]}<br><small>${o.de}</small>`, ex: ORTEX(o),
    };
  }
  const praepOrt = () => U.wahl([[30, ortWahl], [28, ortTippen], [24, ortSatz], [18, ortDeutsch]]);

  // =====================================================
  // Wann? at, on, in
  // =====================================================
  // [at/on/in, Ausdruck, Satz mit ___, Deutsch, Art]
  const ZEIT = [
    ['at', 'seven o’clock', 'I get up ___ seven o’clock.', 'Ich stehe um sieben Uhr auf.', 'uhr'],
    ['at', 'half past four', 'The film starts ___ half past four.', 'Der Film beginnt um halb fünf.', 'uhr'],
    ['at', 'eight o’clock', 'We have breakfast ___ eight o’clock.', 'Wir frühstücken um acht Uhr.', 'uhr'],
    ['at', 'ten o’clock', 'The shop opens ___ ten o’clock.', 'Der Laden öffnet um zehn Uhr.', 'uhr'],
    ['at', 'night', 'Owls fly ___ night.', 'Eulen fliegen nachts.', 'fest'],
    ['at', 'midnight', 'The party ends ___ midnight.', 'Die Party endet um Mitternacht.', 'fest'],
    ['on', 'Monday', 'We have English ___ Monday.', 'Wir haben am Montag Englisch.', 'tag'],
    ['on', 'Friday', 'I play football ___ Friday.', 'Ich spiele am Freitag Fußball.', 'tag'],
    ['on', 'Sunday', 'My grandma visits us ___ Sunday.', 'Meine Oma besucht uns am Sonntag.', 'tag'],
    ['on', 'my birthday', 'I get presents ___ my birthday.', 'An meinem Geburtstag bekomme ich Geschenke.', 'tag'],
    ['on', 'Saturday morning', 'We go shopping ___ Saturday morning.', 'Wir gehen am Samstagmorgen einkaufen.', 'tagzeit'],
    ['on', 'Christmas Day', 'We sing songs ___ Christmas Day.', 'Am ersten Weihnachtstag singen wir Lieder.', 'tag'],
    ['in', 'July', 'My birthday is ___ July.', 'Mein Geburtstag ist im Juli.', 'monat'],
    ['in', 'December', 'It often snows ___ December.', 'Im Dezember schneit es oft.', 'monat'],
    ['in', 'summer', 'We go swimming ___ summer.', 'Im Sommer gehen wir schwimmen.', 'jahr'],
    ['in', 'winter', 'It is cold ___ winter.', 'Im Winter ist es kalt.', 'jahr'],
    ['in', 'the morning', 'I go to school ___ the morning.', 'Ich gehe am Morgen zur Schule.', 'tageszeit'],
    ['in', 'the afternoon', 'We play outside ___ the afternoon.', 'Am Nachmittag spielen wir draußen.', 'tageszeit'],
    ['in', 'the evening', 'I read a book ___ the evening.', 'Am Abend lese ich ein Buch.', 'tageszeit'],
  ].map(([prep, wann, satz, de, art]) => ({ prep, wann, satz, de, art, text: satz.replace('___', prep) }));
  const ZEIT_ART = {
    uhr: 'eine <b>Uhrzeit</b>', fest: 'ein fester Ausdruck (at night, at midnight)', tag: 'ein <b>Tag</b>',
    tagzeit: 'ein <b>Tag</b> mit Tageszeit. Steht der Tag dabei, gewinnt on', monat: 'ein <b>Monat</b>', jahr: 'eine <b>Jahreszeit</b>', tageszeit: 'eine <b>Tageszeit</b>',
  };
  const zMark = (z) => `<span lang="en">${z.satz.replace('___', `<b class="vb">${z.prep}</b>`)}</span>`;
  const zWarum = (z) => `<b>${z.wann}</b> ist ${ZEIT_ART[z.art]}: <b>${z.prep}</b>.`;
  const zLoesung = (z) => `${zMark(z)} ${U.say(z.text)}<br>${zWarum(z)}<br><small>Auf Deutsch: ${z.de}</small>`;
  const Z_TIPP = '<b>at</b> + Uhrzeit (at seven o’clock) · <b>on</b> + Tag (on Monday, on my birthday) · <b>in</b> + Monat, Jahreszeit, Tageszeit (in July, in summer, in the morning). Ausnahme: at night.';
  const ZEX = (z, mode) => ({ mode: mode || 'satz', prep: z.prep, wann: z.wann, satz: z.satz, art: z.art, de: z.de });
  const zCh = ['at', 'on', 'in'].map((c) => `<span lang="en">${c}</span>`);
  function zWahl() { const z = pick(ZEIT); return { prompt: `Was gehört in die Lücke?${en(z.satz)}`, choices: zCh, correct: ['at', 'on', 'in'].indexOf(z.prep), hint: Z_TIPP, solution: zLoesung(z), ex: ZEX(z) }; }
  function zTippen() {
    const z = pick(ZEIT), [a, b] = z.satz.split('___');
    return { prompt: '<b>at</b>, <b>on</b> oder <b>in</b>? Tippe das passende Wort ein.', layout: 'satz', fields: [{ type: 'text', ci: true, answer: z.prep, prefix: a.trim(), suffix: b.trim(), label: 'at, on oder in' }], hint: Z_TIPP, solution: zLoesung(z), ex: ZEX(z) };
  }
  function zKurz() {
    const z = pick(ZEIT);
    return { prompt: `Welches Wort gehört davor?${en(`___ ${z.wann}`)}`, choices: zCh, correct: ['at', 'on', 'in'].indexOf(z.prep), hint: Z_TIPP, solution: `<span lang="en"><b class="vb">${z.prep}</b> ${z.wann}</span><br>${zWarum(z)}<br>Im Satz: ${zMark(z)} ${U.say(z.text)}`, ex: ZEX(z, 'kurz') };
  }
  function zRichtig() {
    const z = pick(ZEIT), ch = shuffle(['at', 'on', 'in']);
    return { prompt: `Wie sagt man das auf Englisch? <b>${z.de}</b>`, choices: ch.map((p) => `<span lang="en">${z.satz.replace('___', p)}</span>`), correct: ch.indexOf(z.prep), hint: Z_TIPP, solution: zLoesung(z), ex: ZEX(z) };
  }
  const praepZeit = () => U.wahl([[28, zWahl], [26, zTippen], [24, zKurz], [22, zRichtig]]);

  Object.assign(D.daten, { ORTE, PREPS, PREP_DE, ORT_SZENE, ORT_SAETZE, ortErkl, tierSvg, BODEN, TIER, ZEIT, ZEIT_ART });
  const themenVorOrt = D.audioThemen;
  D.audioThemen = () => Object.assign(themenVorOrt(), {
    'e5-ort': ORT_SAETZE.map((o) => o.text),
    'e5-zeit': ZEIT.map((z) => z.text),
  });
  Object.assign(D.arten, {
    'e5-ort': { ortWahl, ortTippen, ortSatz, ortDeutsch },
    'e5-zeit': { zWahl, zTippen, zKurz, zRichtig },
  });

  // =====================================================
  // Zahlen, Ordnungszahlen, Datum, Uhrzeit
  // =====================================================
  const EINS = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
  const ZEHN = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
  const zahlWort = (n) => (n < 20 ? EINS[n] : n === 100 ? 'one hundred' : ZEHN[Math.floor(n / 10)] + (n % 10 ? '-' + EINS[n % 10] : ''));
  const ORD1 = ['', 'first', 'second', 'third', 'fourth', 'fifth', 'sixth', 'seventh', 'eighth', 'ninth', 'tenth', 'eleventh', 'twelfth', 'thirteenth', 'fourteenth', 'fifteenth', 'sixteenth', 'seventeenth', 'eighteenth', 'nineteenth'];
  const ordWort = (n) => (n < 20 ? ORD1[n] : n % 10 === 0 ? ZEHN[n / 10].slice(0, -1) + 'ieth' : ZEHN[Math.floor(n / 10)] + '-' + ORD1[n % 10]);
  const ordEnde = (n) => (n % 100 >= 11 && n % 100 <= 13 ? 'th' : ['th', 'st', 'nd', 'rd'][n % 10] || 'th');
  const ORD_BESONDERS = { 1: 'first', 2: 'second', 3: 'third', 5: 'fifth (v statt ve)', 8: 'eighth (nur ein t)', 9: 'ninth (ohne e)', 12: 'twelfth (f statt ve)' };
  const ordRegel = (n) => {
    const e = n % 10, w = ordWort(n);
    if (n >= 20 && n % 10 === 0) return `Bei den Zehnern wird aus -ty ein <b>-tieth</b>: ${w}.`;
    if (n > 20 && ORD_BESONDERS[e]) return `Nur der letzte Teil wird zur Ordnungszahl: ${ZEHN[Math.floor(n / 10)]}-<b>${ORD1[e]}</b>.`;
    if (ORD_BESONDERS[n]) return `<b>${ORD_BESONDERS[n]}</b> ist eine Ausnahme. Merke: first, second, third, dann fast immer <b>-th</b>.`;
    return `Meistens hängt man <b>-th</b> an: ${w}.`;
  };
  const MONATE = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const MONATE_DE = ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'];
  // feste Daten mit Aufnahme (Tag, Monat 1–12)
  const DATEN = [[1, 1], [3, 5], [12, 5], [21, 3], [2, 2], [14, 7], [5, 10], [8, 8], [9, 9], [20, 6], [22, 4], [31, 12], [23, 11], [30, 1], [11, 9], [15, 3], [24, 12], [13, 6]]
    .map(([t, m]) => ({ t, m, kurz: `${t}${ordEnde(t)} ${MONATE[m - 1]}`, text: `the ${ordWort(t)} of ${MONATE[m - 1]}`, de: `${t}. ${MONATE_DE[m - 1]}` }));
  // Uhrzeiten: Minute 0, 15, 30, 45
  const UHR_ART = { 0: 'o’clock', 15: 'quarter past', 30: 'half past', 45: 'quarter to' };
  const STUNDE = (h) => EINS[((h - 1) % 12) + 1];
  const uhrText = (h, m) => (m === 0 ? `It’s ${STUNDE(h)} o’clock.` : m === 45 ? `It’s quarter to ${STUNDE(h + 1)}.` : `It’s ${UHR_ART[m]} ${STUNDE(h)}.`);
  const UHR_DE = (h, m) => { const w = ['zwölf', 'eins', 'zwei', 'drei', 'vier', 'fünf', 'sechs', 'sieben', 'acht', 'neun', 'zehn', 'elf', 'zwölf']; const s = (k) => w[k % 12]; return m === 0 ? `Es ist ${h % 12 === 1 ? 'ein' : s(h)} Uhr.` : m === 15 ? `Es ist Viertel nach ${s(h)}.` : m === 30 ? `Es ist halb ${s(h + 1)}.` : `Es ist Viertel vor ${s(h + 1)}.`; };
  const UHREN = [];
  for (let h = 1; h <= 12; h++) for (const m of [0, 15, 30, 45]) UHREN.push({ h, m, text: uhrText(h, m), de: UHR_DE(h, m), digi: `${h}:${String(m).padStart(2, '0')}` });
  const uhrBild = (h, m) => {
    const cx = 180, cy = 104, r = 78, rad = (g) => (g - 90) * Math.PI / 180;
    const zeiger = (g, l, w, c) => `<line x1="${cx}" y1="${cy}" x2="${(cx + l * Math.cos(rad(g))).toFixed(1)}" y2="${(cy + l * Math.sin(rad(g))).toFixed(1)}" stroke="${c}" stroke-width="${w}" stroke-linecap="round"/>`;
    let ziff = '';
    for (let k = 1; k <= 12; k++) ziff += `<text x="${(cx + 62 * Math.cos(rad(k * 30))).toFixed(1)}" y="${(cy + 62 * Math.sin(rad(k * 30)) + 6).toFixed(1)}" text-anchor="middle" style="font:800 17px Nunito,system-ui,sans-serif;fill:#2b2440">${k}</text>`;
    let striche = '';
    for (let k = 0; k < 60; k++) { const a = rad(k * 6), i = k % 5 ? 74 : 70; striche += `<line x1="${(cx + i * Math.cos(a)).toFixed(1)}" y1="${(cy + i * Math.sin(a)).toFixed(1)}" x2="${(cx + 77 * Math.cos(a)).toFixed(1)}" y2="${(cy + 77 * Math.sin(a)).toFixed(1)}" stroke="#2b2440" stroke-width="${k % 5 ? 1 : 2.5}"/>`; }
    return `<svg viewBox="0 18 360 172" role="img" aria-label="Uhr"><circle cx="${cx}" cy="${cy}" r="${r + 4}" fill="#fff" stroke="#2b2440" stroke-width="4"/>${striche}${ziff}${zeiger((h % 12) * 30 + m / 2, 40, 7, '#2b2440')}${zeiger(m * 6, 62, 4, '#1f55d6')}<circle cx="${cx}" cy="${cy}" r="5" fill="#2b2440"/></svg>`;
  };
  const Z_HOER = [[13, 30], [14, 40], [15, 50], [16, 60], [17, 70], [18, 80], [19, 90]];
  const zahlErkl = (n) => (n < 13 ? `<b>${zahlWort(n)}</b> muss man auswendig wissen.`
    : n < 20 ? `13 bis 19 enden auf <b>-teen</b>: ${zahlWort(n)}.`
      : n === 100 ? '100 heißt <b>one hundred</b>.'
        : n % 10 ? `Erst die Zehner, dann ein <b>Bindestrich</b>, dann die Einer: ${ZEHN[Math.floor(n / 10)]}-${EINS[n % 10]}. Anders als im Deutschen kommen die Zehner zuerst.` : `Die Zehner enden auf <b>-ty</b>: ${zahlWort(n)}.`);
  const zahlZiel = () => pick([R(13, 19), R(20, 99), R(20, 99), R(20, 99), R(0, 12), pick([30, 40, 50, 80, 100])]);
  const ZAHL_TIPP = 'Zehner zuerst, dann Bindestrich, dann die Einer: 47 = forty-seven. Achtung: forty ohne u, fifteen und fifty mit f.';
  // A: Zahl als Wort eintippen
  function zahlTippen() {
    const n = zahlZiel(), w = zahlWort(n);
    return {
      prompt: `Schreibe die Zahl als englisches Wort: <b>${n}</b>`, fields: [{ type: 'text', ci: true, answer: n === 100 ? [w, 'a hundred'] : n > 20 && n % 10 ? [w, w.replace('-', ' ')] : w, label: 'Zahlwort' }],
      hint: ZAHL_TIPP, solution: `${n} = <b class="vb" lang="en">${w}</b> ${U.say(w)}<br>${zahlErkl(n)}`, ex: { mode: 'zahl', n },
    };
  }
  // B: richtiges Zahlwort wählen
  function zahlWahl() {
    const n = R(21, 99), z = Math.floor(n / 10), e = n % 10;
    const w = zahlWort(n), falsch = [];
    if (e && e !== z && e > 1) falsch.push(zahlWort(e * 10 + z));
    if (z === 4) falsch.push('fourty-' + EINS[e]);
    if (z === 5) falsch.push('fivety-' + EINS[e]);
    falsch.push(`${EINS[e]}-and-${ZEHN[z]}`, `${ZEHN[z]}-${EINS[e + 1 > 9 ? 1 : e + 1]}`);
    const ch = shuffle([w, ...[...new Set(falsch)].filter((x) => x !== w && !x.includes('zero')).slice(0, 3)]);
    if (!e) return zahlTippen();
    return { prompt: `Wie heißt die Zahl <b>${n}</b> auf Englisch?`, choices: ch.map((c) => `<span lang="en">${c}</span>`), correct: ch.indexOf(w), hint: ZAHL_TIPP, solution: `${n} = <b class="vb" lang="en">${w}</b> ${U.say(w)}<br>${zahlErkl(n)}`, ex: { mode: 'zahl', n } };
  }
  // C: hören – teen oder ty?
  function zahlHoeren() {
    const paar = pick(Z_HOER), n = pick(paar), ch = shuffle([paar[0], paar[1], paar[0] - 10]);
    return {
      prompt: `Hör genau hin: Welche Zahl ist das? ${U.say(zahlWort(n))}`, choices: ch.map(String), correct: ch.indexOf(n),
      hint: '<b>-teen</b> (13 bis 19) klingt lang und betont am Ende: thir<b>teen</b>. <b>-ty</b> (30, 40 …) ist kurz und vorn betont: <b>thir</b>ty.',
      solution: `<b class="vb">${n}</b> = <span lang="en">${zahlWort(n)}</span> ${U.say(zahlWort(n))}<br>${n < 20 ? `-teen heißt „plus zehn“: ${n} = ${n - 10} + 10.` : `-ty heißt „mal zehn“: ${n} = ${n / 10} · 10.`}`,
      ex: { mode: 'hoeren', n, paar },
    };
  }
  // D: Ordnungszahl
  function ordTippen() {
    const n = pick([1, 2, 3, 4, 5, 8, 9, 12, 13, 20, 21, 22, 23, 30, 31, R(6, 19), R(24, 29)]), w = ordWort(n);
    return {
      prompt: `Schreibe die Ordnungszahl als Wort: <b>${n}${ordEnde(n)}</b> (der ${n}.)`, fields: [{ type: 'text', ci: true, answer: n > 20 && n % 10 ? [w, w.replace('-', ' ')] : w, label: 'Ordnungszahl' }],
      hint: 'first, second, third – danach meistens <b>-th</b>: fourth, sixth … Achtung: fifth, eighth, ninth, twelfth, twentieth.',
      solution: `${n}${ordEnde(n)} = <b class="vb" lang="en">${w}</b> ${U.say(w)}<br>${ordRegel(n)}`, ex: { mode: 'ord', n },
    };
  }
  function ordWahl() {
    const n = pick([1, 2, 3, 5, 8, 9, 12, 20, 21, 22, 23, 31]), w = ordWort(n);
    const falsch = { 1: ['oneth', 'firsth'], 2: ['twoth', 'secondth'], 3: ['threeth', 'thirth'], 5: ['fiveth', 'fivth'], 8: ['eightth', 'eighteth'], 9: ['nineth', 'ninthe'], 12: ['twelveth', 'twelvth'], 20: ['twentyth', 'twentith'], 21: ['twenty-oneth', 'twenty-firsth'], 22: ['twenty-twoth', 'twenty-secondth'], 23: ['twenty-threeth', 'twenty-thirdth'], 31: ['thirty-oneth', 'thirtieth-first'] }[n];
    const ch = shuffle([w, ...falsch]);
    return { prompt: `Wie schreibt man <b>${n}${ordEnde(n)}</b> als Wort?`, choices: ch.map((c) => `<span lang="en">${c}</span>`), correct: ch.indexOf(w), hint: 'first, second, third – danach meistens <b>-th</b>. Achtung: fifth, eighth, ninth, twelfth, twentieth.', solution: `${n}${ordEnde(n)} = <b class="vb" lang="en">${w}</b> ${U.say(w)}<br>${ordRegel(n)}`, ex: { mode: 'ord', n } };
  }
  // E: Datum sagen
  function datumWahl() {
    const d = pick(DATEN), w = ordWort(d.t), mon = MONATE[d.m - 1];
    const ch = shuffle([d.text, `the ${zahlWort(d.t)} of ${mon}`, `the ${w} of ${MONATE[(d.m + (d.m === 3 ? 1 : 2)) % 12]}`]);
    return {
      prompt: `Wie sagt man dieses Datum? <b>${d.de}</b> (geschrieben: <span lang="en">${d.kurz}</span>)`, choices: ch.map((c) => `<span lang="en">${c}</span>`), correct: ch.indexOf(d.text),
      hint: 'Beim Datum sagt man die <b>Ordnungszahl</b>: the third of May. Monate schreibt man groß.',
      solution: `<span lang="en">${d.kurz}</span> sagt man: <b class="vb" lang="en">${d.text}</b> ${U.say(d.text)}<br>Tag als Ordnungszahl (${w}), dann <b>of</b>, dann der Monat (${mon} = ${MONATE_DE[d.m - 1]}).`,
      ex: { mode: 'datum', t: d.t, m: d.m },
    };
  }
  function monatTippen() {
    const m = R(1, 12), mon = MONATE[m - 1];
    return { prompt: `Wie heißt der Monat <b>${MONATE_DE[m - 1]}</b> auf Englisch?`, fields: [{ type: 'text', ci: true, answer: mon, label: 'Monat' }], hint: 'Viele Monate sehen fast aus wie im Deutschen. Achtung: March, May, June, July, October, December.', solution: `${MONATE_DE[m - 1]} = <b class="vb" lang="en">${mon}</b> ${U.say(mon)}<br>Monate schreibt man im Englischen immer <b>groß</b>.`, ex: { mode: 'datum', t: pick(DATEN.filter((d) => d.m === m).map((d) => d.t).concat([R(1, 28)])), m, monat: true } };
  }
  // F: Uhr lesen
  const UHR_TIPP = '<b>o’clock</b> = volle Stunde · <b>quarter past</b> = Viertel nach · <b>half past</b> = halb (aber: half past four = halb fünf!) · <b>quarter to</b> = Viertel vor';
  const uhrLoesung = (u) => `<b class="vb" lang="en">${u.text}</b> ${U.say(u.text)}<br>${u.m === 30 ? `Achtung: <b>half past ${STUNDE(u.h)}</b> heißt „halb ${['zwölf', 'eins', 'zwei', 'drei', 'vier', 'fünf', 'sechs', 'sieben', 'acht', 'neun', 'zehn', 'elf', 'zwölf'][(u.h + 1) % 12]}“: eine halbe Stunde <b>nach</b> ${u.h}.` : u.m === 0 ? 'Der lange Zeiger steht oben auf der 12: volle Stunde.' : u.m === 15 ? 'Der lange Zeiger steht auf der 3: eine Viertelstunde <b>nach</b> (past).' : 'Der lange Zeiger steht auf der 9: eine Viertelstunde <b>vor</b> (to) der nächsten Stunde.'}<br><small>${u.de}</small>`;
  function uhrWahl() {
    const u = pick(UHREN), andere = shuffle(UHREN.filter((x) => x !== u && (x.h === u.h || x.m === u.m || (x.m === 30 && u.m === 30)))).slice(0, 2);
    if (u.m === 30) andere[0] = { text: `It’s half past ${STUNDE(u.h + 1)}.` };
    const ch = shuffle([u.text, ...[...new Set(andere.map((x) => x.text))].filter((t) => t !== u.text)]);
    return { prompt: 'Wie spät ist es?', figure: uhrBild(u.h, u.m), choices: ch.map((c) => `<span lang="en">${c}</span>`), correct: ch.indexOf(u.text), hint: UHR_TIPP, solution: uhrLoesung(u), ex: { mode: 'uhr', h: u.h, m: u.m } };
  }
  function uhrDigital() {
    const u = pick(UHREN.filter((x) => x.m)), ch = shuffle(['quarter past', 'half past', 'quarter to']);
    const satz = (a) => (a === 'quarter to' ? `It’s quarter to ${STUNDE(u.h + 1)}.` : `It’s ${a} ${STUNDE(u.h)}.`);
    return { prompt: `Es ist <b>${u.digi}</b> Uhr. Wie sagt man das?`, choices: ch.map((a) => `<span lang="en">${satz(a)}</span>`), correct: ch.indexOf(UHR_ART[u.m]), hint: UHR_TIPP, solution: uhrLoesung(u), ex: { mode: 'uhr', h: u.h, m: u.m } };
  }
  const zahlenZeit = () => U.wahl([[14, zahlTippen], [12, zahlWahl], [12, zahlHoeren], [10, ordTippen], [8, ordWahl], [10, datumWahl], [6, monatTippen], [16, uhrWahl], [12, uhrDigital]]);

  Object.assign(D.daten, { EINS, ZEHN, zahlWort, ordWort, ordEnde, ordRegel, zahlErkl, MONATE, MONATE_DE, DATEN, UHREN, uhrBild, uhrText, STUNDE, UHR_ART });
  const themenVorZahl = D.audioThemen;
  D.audioThemen = () => Object.assign(themenVorZahl(), {
    'e5-zahl': [...Array.from({ length: 101 }, (_, n) => zahlWort(n)), ...Array.from({ length: 31 }, (_, n) => ordWort(n + 1)), ...MONATE, ...DATEN.map((d) => d.text), ...UHREN.map((u) => u.text)],
  });
  Object.assign(D.arten, { 'e5-zahl': { zahlTippen, zahlWahl, zahlHoeren, ordTippen, ordWahl, datumWahl, monatTippen, uhrWahl, uhrDigital } });

  // =====================================================
  // was und were
  // =====================================================
  // [Subjekt, was/were, Rest, Zeitangabe, Deutsch]
  const WAS = [
    ['I', 'was', 'at home', 'yesterday', 'Ich war gestern zu Hause.'],
    ['You', 'were', 'at school', 'yesterday', 'Du warst gestern in der Schule.'],
    ['He', 'was', 'ill', 'last week', 'Er war letzte Woche krank.'],
    ['She', 'was', 'in London', 'last year', 'Sie war letztes Jahr in London.'],
    ['It', 'was', 'cold', 'yesterday', 'Es war gestern kalt.'],
    ['We', 'were', 'at the zoo', 'on Saturday', 'Wir waren am Samstag im Zoo.'],
    ['They', 'were', 'happy', 'yesterday', 'Sie waren gestern glücklich.'],
    ['Tom', 'was', 'late', 'this morning', 'Tom war heute Morgen zu spät.'],
    ['My parents', 'were', 'at work', 'yesterday', 'Meine Eltern waren gestern bei der Arbeit.'],
    ['The film', 'was', 'great', 'last night', 'Der Film war gestern Abend toll.'],
    ['The children', 'were', 'in the garden', 'an hour ago', 'Die Kinder waren vor einer Stunde im Garten.'],
    ['Lisa and Ben', 'were', 'at the party', 'last Friday', 'Lisa und Ben waren letzten Freitag auf der Party.'],
    ['My cat', 'was', 'in the kitchen', 'five minutes ago', 'Meine Katze war vor fünf Minuten in der Küche.'],
  ].map(([subj, form, rest, zeit, de]) => ({
    subj, form, rest, zeit, de, g: form === 'was' ? 0 : 1, jetzt: subj === 'I' ? 'am' : form === 'was' ? 'is' : 'are',
    text: `${subj} ${form} ${rest} ${zeit}.`, neg: `${subj} ${form}n’t ${rest} ${zeit}.`, frage: `${gross(form)} ${subjKlein(subj)} ${rest} ${zeit}?`,
  }));
  const WASQ = WAS.filter((s) => s.subj !== 'I');
  const WAS_GRUPPE = ['<b>was</b> steht bei <b>I, he, she, it</b> und bei einer Person oder Sache.', '<b>were</b> steht bei <b>you, we, they</b> und bei mehreren.'];
  const wasLoesung = (s) => `<span lang="en">${s.subj} <b class="vb">${s.form}</b> ${s.rest} ${s.zeit}.</span> ${U.say(s.text)}<br>${WAS_GRUPPE[s.g]} Heute hieße es ${s.jetzt}, gestern ${s.form}.<br><small>Auf Deutsch: ${s.de}</small>`;
  const WAS_TIPP = 'Vergangenheit von to be: am und is werden zu <b>was</b>, are wird zu <b>were</b>.';
  const WASEX = (s, mode) => ({ mode: mode || 'form', subj: s.subj, form: s.form, rest: s.rest, zeit: s.zeit, g: s.g, jetzt: s.jetzt, de: s.de });
  function wasWahl() { const s = pick(WAS); return { prompt: `Was gehört in die Lücke?${en(`${s.subj} ___ ${s.rest} ${s.zeit}.`)}`, choices: ['was', 'were'].map((c) => `<span lang="en">${c}</span>`), correct: s.g, hint: WAS_TIPP, solution: wasLoesung(s), ex: WASEX(s) }; }
  function wasTippen() {
    const s = pick(WAS);
    return { prompt: '<b>was</b> oder <b>were</b>? Tippe das passende Wort ein.', layout: 'satz', fields: [{ type: 'text', ci: true, answer: s.form, prefix: s.subj, suffix: `${s.rest} ${s.zeit}.`, label: 'was oder were' }], hint: WAS_TIPP, solution: wasLoesung(s), ex: WASEX(s) };
  }
  function wasUmbau() {
    const s = pick(WAS);
    return {
      prompt: `Heute: <span lang="en">${s.subj} ${s.jetzt} ${s.rest}.</span> Und in der Vergangenheit?`, layout: 'satz',
      fields: [{ type: 'text', ci: true, answer: s.form, prefix: s.subj, suffix: `${s.rest} ${s.zeit}.`, label: 'Vergangenheit' }],
      hint: WAS_TIPP, solution: `<span lang="en">${s.subj} ${s.jetzt} …</span> → ${wasLoesung(s)}`, ex: WASEX(s, 'umbau'),
    };
  }
  function wasNeg() {
    const s = pick(WAS), ch = shuffle([s.neg, `${s.subj} didn’t ${s.form === 'was' ? 'was' : 'were'} ${s.rest} ${s.zeit}.`, `${s.subj} ${s.form === 'was' ? 'weren’t' : 'wasn’t'} ${s.rest} ${s.zeit}.`]);
    return {
      prompt: `Verneine den Satz. Welcher Satz ist richtig?${en(s.text)}`, choices: ch.map((c) => `<span lang="en">${c}</span>`), correct: ch.indexOf(s.neg),
      hint: 'Wie bei am, is, are: <b>not</b> kommt direkt dahinter. was not = <b>wasn’t</b>, were not = <b>weren’t</b>. Kein didn’t.',
      solution: `<span lang="en"><b class="vb">${s.neg}</b></span> ${U.say(s.neg)}<br><b>${s.form} not</b> wird kurz zu <b>${s.form}n’t</b>. didn’t braucht man bei was und were nicht.`, ex: WASEX(s, 'neg'),
    };
  }
  function wasFrage() {
    const s = pick(WASQ);
    return { prompt: `Bilde die Frage zu diesem Satz.${en(s.text)}`, order: U.ordne([gross(s.form), subjKlein(s.subj), s.rest, s.zeit], '?'), hint: '<b>Was</b> oder <b>Were</b> rückt nach vorn, dann kommt die Person.', solution: `<span lang="en"><b class="vb">${s.frage}</b></span> ${U.say(s.frage)}<br>${gross(s.form)} und ${subjKlein(s.subj)} tauschen die Plätze. Kein did.`, ex: WASEX(s, 'frage') };
  }
  const wasWere = () => U.wahl([[24, wasWahl], [22, wasTippen], [20, wasUmbau], [17, wasNeg], [17, wasFrage]]);

  // =====================================================
  // past simple: regelmäßige Verben (-ed)
  // =====================================================
  // [Grundform, Vergangenheit, Regel]
  const ED = [
    ['play', 'played', 'ed'], ['watch', 'watched', 'ed'], ['help', 'helped', 'ed'], ['visit', 'visited', 'ed'], ['cook', 'cooked', 'ed'],
    ['clean', 'cleaned', 'ed'], ['listen', 'listened', 'ed'], ['walk', 'walked', 'ed'], ['open', 'opened', 'ed'], ['want', 'wanted', 'ed'],
    ['dance', 'danced', 'd'], ['like', 'liked', 'd'], ['live', 'lived', 'd'], ['smile', 'smiled', 'd'], ['close', 'closed', 'd'],
    ['carry', 'carried', 'ied'], ['study', 'studied', 'ied'], ['cry', 'cried', 'ied'], ['tidy', 'tidied', 'ied'],
    ['stop', 'stopped', 'dopp'], ['plan', 'planned', 'dopp'], ['drop', 'dropped', 'dopp'], ['chat', 'chatted', 'dopp'],
  ].map(([base, past, regel]) => ({ base, past, regel }));
  const ED_REGEL = {
    ed: (v) => `Einfach <b>-ed</b> anhängen: ${v.base} → ${v.past}.${v.base.endsWith('y') ? ' Vor dem y steht ein Vokal, deshalb bleibt das y.' : ''}`,
    d: (v) => `Das Verb endet schon auf <b>e</b>: nur <b>-d</b> anhängen: ${v.base} → ${v.past}.`,
    ied: (v) => `Konsonant + <b>y</b> am Ende: aus y wird <b>i</b>, dann -ed: ${v.base} → ${v.past}.`,
    dopp: (v) => `Kurzer Vokal und ein Konsonant am Ende: der letzte Buchstabe wird <b>verdoppelt</b>: ${v.base} → ${v.past}.`,
  };
  const edV = (b) => ED.find((v) => v.base === b);
  // [Subjekt, Grundform, Rest, Zeitangabe, Deutsch, Gegenwart mit Signalwort]
  const EDS = [
    ['I', 'play', 'football', 'yesterday', 'Ich habe gestern Fußball gespielt.', 'every day'],
    ['We', 'visit', 'our grandma', 'last Sunday', 'Wir haben letzten Sonntag unsere Oma besucht.', 'every Sunday'],
    ['She', 'watch', 'a film', 'last night', 'Sie hat gestern Abend einen Film geschaut.', 'every evening'],
    ['Tom', 'help', 'his dad', 'yesterday', 'Tom hat gestern seinem Papa geholfen.', 'every day'],
    ['My mum', 'cook', 'pasta', 'on Friday', 'Meine Mama hat am Freitag Nudeln gekocht.', 'on Fridays'],
    ['They', 'dance', 'at the party', 'last Saturday', 'Sie haben letzten Samstag auf der Party getanzt.', 'on Saturdays'],
    ['I', 'tidy', 'my room', 'yesterday', 'Ich habe gestern mein Zimmer aufgeräumt.', 'every week'],
    ['Lisa', 'study', 'for the test', 'last week', 'Lisa hat letzte Woche für den Test gelernt.', 'every week'],
    ['The bus', 'stop', 'at the school', 'ten minutes ago', 'Der Bus hielt vor zehn Minuten an der Schule.', 'every morning'],
    ['We', 'live', 'in Berlin', 'in 2020', 'Wir haben 2020 in Berlin gewohnt.', 'now'],
    ['He', 'carry', 'the bags', 'yesterday', 'Er hat gestern die Taschen getragen.', 'every day'],
    ['You', 'listen', 'to music', 'last night', 'Du hast gestern Abend Musik gehört.', 'every evening'],
    ['My friends', 'chat', 'for hours', 'yesterday', 'Meine Freunde haben gestern stundenlang geplaudert.', 'every day'],
    ['I', 'walk', 'to school', 'this morning', 'Ich bin heute Morgen zur Schule gelaufen.', 'every morning'],
  ].map(([subj, base, rest, zeit, de, oft]) => {
    const v = edV(base), g3 = !['I', 'We', 'They', 'You', 'My friends'].includes(subj);
    return { subj, base, past: v.past, regel: v.regel, rest, zeit, de, oft, text: `${subj} ${v.past} ${rest} ${zeit}.`, neg: `${subj} didn’t ${base} ${rest} ${zeit}.`,
      jetzt: base === 'live' ? `${subj} live${g3 ? 's' : ''} in Dresden now.` : `${subj} ${g3 ? sForm(base) : base} ${rest} ${oft}.` };
  });
  const ED_TIPP = 'Regelmäßige Verben: <b>-ed</b> anhängen (played). Endet das Verb auf e: nur -d (danced). Konsonant + y: -ied (carried). Kurzer Vokal + Konsonant: verdoppeln (stopped).';
  const edLoesung = (s) => `<span lang="en">${s.subj} <b class="vb">${s.past}</b> ${s.rest} ${s.zeit}.</span> ${U.say(s.text)}<br><b>${s.zeit}</b> zeigt: Es ist vorbei. ${ED_REGEL[s.regel](s)} Bei allen Personen gleich, auch bei he, she, it.<br><small>Auf Deutsch: ${s.de}</small>`;
  const EDEX = (s, mode) => ({ mode: mode || 'satz', subj: s.subj, base: s.base, past: s.past, regel: s.regel, rest: s.rest, zeit: s.zeit, de: s.de });
  function edForm() {
    const v = pick(ED);
    return { prompt: `Schreibe die Vergangenheit (past simple) von <b lang="en">${v.base}</b>.`, fields: [{ type: 'text', ci: true, answer: v.past, label: 'past simple' }], hint: ED_TIPP, solution: `<span lang="en">${v.base} → <b class="vb">${v.past}</b></span> ${U.say(`${v.base}, ${v.past}`)}<br>${ED_REGEL[v.regel](v)}`, ex: { mode: 'form', base: v.base, past: v.past, regel: v.regel } };
  }
  function edWahl() {
    const v = pick(ED.filter((x) => x.regel !== 'ed' || x.base.endsWith('y'))), b = v.base;
    const kand = { ed: [b.slice(0, -1) + 'ied', b + 'd'], d: [b + 'ed', b.slice(0, -1) + 'd'], ied: [b + 'ed', b + 'd'], dopp: [b + 'ed', b + 'd'] }[v.regel];
    const ch = shuffle([v.past, ...kand]);
    return { prompt: `Wie schreibt man die Vergangenheit von <b lang="en">${b}</b>?`, choices: ch.map((c) => `<span lang="en">${c}</span>`), correct: ch.indexOf(v.past), hint: ED_TIPP, solution: `<span lang="en">${b} → <b class="vb">${v.past}</b></span> ${U.say(`${b}, ${v.past}`)}<br>${ED_REGEL[v.regel](v)}`, ex: { mode: 'form', base: b, past: v.past, regel: v.regel } };
  }
  function edSatz() {
    const s = pick(EDS);
    return { prompt: `Setze <b lang="en">${s.base}</b> in die Vergangenheit.`, layout: 'satz', fields: [{ type: 'text', ci: true, answer: s.past, prefix: s.subj, suffix: `${s.rest} ${s.zeit}.`, label: 'past simple' }], hint: ED_TIPP, solution: edLoesung(s), ex: EDEX(s) };
  }
  function edUmbau() {
    const s = pick(EDS), ch = shuffle([s.past, s.base, sForm(s.base)].filter((x, i, a) => a.indexOf(x) === i));
    return { prompt: `Sonst: <span lang="en">${s.jetzt}</span><br>Und was war <b lang="en">${s.zeit}</b>?${en(`${s.subj} ___ ${s.rest} ${s.zeit}.`)}`, choices: ch.map((c) => `<span lang="en">${c}</span>`), correct: ch.indexOf(s.past), hint: `<b>${s.zeit}</b> zeigt: Es ist vorbei. Dann steht das Verb im past simple.`, solution: edLoesung(s), ex: EDEX(s) };
  }
  function edNeg() {
    const s = pick(EDS), ch = shuffle([s.neg, `${s.subj} didn’t ${s.past} ${s.rest} ${s.zeit}.`, `${s.subj} not ${s.past} ${s.rest} ${s.zeit}.`]);
    return {
      prompt: `Verneine den Satz. Welcher Satz ist richtig?${en(s.text)}`, choices: ch.map((c) => `<span lang="en">${c}</span>`), correct: ch.indexOf(s.neg),
      hint: 'Verneint wird mit <b>didn’t</b>. Dahinter steht das Verb in der <b>Grundform</b>, ohne -ed.',
      solution: `<span lang="en"><b class="vb">${s.neg}</b></span> ${U.say(s.neg)}<br><b>didn’t</b> zeigt schon die Vergangenheit. Deshalb fällt das -ed weg: didn’t <b>${s.base}</b>, nicht didn’t ${s.past}.`, ex: EDEX(s, 'neg'),
    };
  }
  const pastEd = () => U.wahl([[20, edForm], [18, edWahl], [24, edSatz], [20, edUmbau], [18, edNeg]]);

  // =====================================================
  // past simple: unregelmäßige Verben
  // =====================================================
  // [Grundform, Vergangenheit, 3. Form (als falsches Angebot), Deutsch]
  const IRR = [
    ['go', 'went', 'gone', 'gehen'], ['come', 'came', 'comed', 'kommen'], ['see', 'saw', 'seen', 'sehen'], ['have', 'had', 'haved', 'haben'],
    ['get', 'got', 'getted', 'bekommen'], ['eat', 'ate', 'eaten', 'essen'], ['drink', 'drank', 'drunk', 'trinken'], ['make', 'made', 'maked', 'machen'],
    ['take', 'took', 'taken', 'nehmen'], ['write', 'wrote', 'written', 'schreiben'], ['buy', 'bought', 'buyed', 'kaufen'], ['say', 'said', 'sayed', 'sagen'],
    ['do', 'did', 'done', 'tun, machen'], ['give', 'gave', 'given', 'geben'], ['find', 'found', 'finded', 'finden'], ['swim', 'swam', 'swum', 'schwimmen'],
    ['run', 'ran', 'runned', 'rennen'], ['sit', 'sat', 'sitted', 'sitzen'], ['meet', 'met', 'meeted', 'treffen'], ['sing', 'sang', 'sung', 'singen'],
    ['ride', 'rode', 'ridden', 'reiten, fahren'], ['read', 'read', 'readed', 'lesen'],
  ].map(([base, past, p3, de]) => ({ base, past, p3, de }));
  const irrV = (b) => IRR.find((v) => v.base === b);
  const IRRS = [
    ['I', 'go', 'to the cinema', 'yesterday', 'Ich bin gestern ins Kino gegangen.'],
    ['We', 'see', 'a big ship', 'last summer', 'Wir haben letzten Sommer ein großes Schiff gesehen.'],
    ['She', 'have', 'a cold', 'last week', 'Sie hatte letzte Woche eine Erkältung.'],
    ['Tom', 'eat', 'three pancakes', 'this morning', 'Tom hat heute Morgen drei Pfannkuchen gegessen.'],
    ['They', 'come', 'home late', 'last night', 'Sie sind gestern Abend spät nach Hause gekommen.'],
    ['My dad', 'buy', 'a new bike', 'on Saturday', 'Mein Papa hat am Samstag ein neues Fahrrad gekauft.'],
    ['I', 'write', 'a letter', 'yesterday', 'Ich habe gestern einen Brief geschrieben.'],
    ['Lisa', 'get', 'a present', 'on her birthday', 'Lisa hat an ihrem Geburtstag ein Geschenk bekommen.'],
    ['We', 'swim', 'in the lake', 'last summer', 'Wir sind letzten Sommer im See geschwommen.'],
    ['He', 'make', 'a cake', 'yesterday', 'Er hat gestern einen Kuchen gebacken.'],
    ['The dog', 'run', 'into the garden', 'five minutes ago', 'Der Hund ist vor fünf Minuten in den Garten gerannt.'],
    ['I', 'meet', 'my friends', 'after school', 'Ich habe nach der Schule meine Freunde getroffen.'],
    ['You', 'take', 'my pencil', 'yesterday', 'Du hast gestern meinen Bleistift genommen.'],
    ['My grandma', 'give', 'me a book', 'last Christmas', 'Meine Oma hat mir letztes Weihnachten ein Buch geschenkt.'],
    ['We', 'do', 'our homework', 'in the afternoon', 'Wir haben am Nachmittag unsere Hausaufgaben gemacht.'],
    ['Ben', 'find', 'a coin', 'in the park', 'Ben hat im Park eine Münze gefunden.'],
  ].map(([subj, base, rest, zeit, de]) => { const v = irrV(base); return { subj, base, past: v.past, p3: v.p3, rest, zeit, de, text: `${subj} ${v.past} ${rest} ${zeit}.`, neg: `${subj} didn’t ${base} ${rest} ${zeit}.` }; });
  const IRR_TIPP = 'Unregelmäßige Verben bekommen kein -ed. Ihre Vergangenheit muss man auswendig lernen: go → went, see → saw, have → had.';
  const irrLoesung = (s) => `<span lang="en">${s.subj} <b class="vb">${s.past}</b> ${s.rest} ${s.zeit}.</span> ${U.say(s.text)}<br><b>${s.base}</b> ist unregelmäßig: ${s.base} → <b>${s.past}</b>. Bei allen Personen gleich.<br><small>Auf Deutsch: ${s.de}</small>`;
  const IREX = (s, mode) => ({ mode: mode || 'satz', subj: s.subj, base: s.base, past: s.past, rest: s.rest, zeit: s.zeit, de: s.de });
  const irrFormLoesung = (v) => `<span lang="en">${v.base} → <b class="vb">${v.past}</b></span> ${v.base === 'read' ? '' : U.say(`${v.base}, ${v.past}`)}<br>${v.base} (${v.de}) ist <b>unregelmäßig</b>: kein -ed, die Form lernt man auswendig.${v.base === 'read' ? ' Geschrieben wie die Grundform, aber gesprochen wie „red“.' : ''}`;
  function irrForm() {
    const v = pick(IRR);
    return { prompt: `Schreibe die Vergangenheit (past simple) von <b lang="en">${v.base}</b> (${v.de}).`, fields: [{ type: 'text', ci: true, answer: v.past, label: 'past simple' }], hint: IRR_TIPP, solution: irrFormLoesung(v), ex: { mode: 'form', base: v.base, past: v.past, de: v.de } };
  }
  function irrWahl() {
    const v = pick(IRR.filter((x) => x.base !== 'read')), falsch = [v.p3, v.base.endsWith('e') ? v.base + 'd' : v.base + 'ed'].filter((x) => x !== v.past);
    const ch = shuffle([v.past, ...[...new Set(falsch)]]);
    return { prompt: `Wie heißt die Vergangenheit von <b lang="en">${v.base}</b>?`, choices: ch.map((c) => `<span lang="en">${c}</span>`), correct: ch.indexOf(v.past), hint: IRR_TIPP, solution: irrFormLoesung(v), ex: { mode: 'form', base: v.base, past: v.past, de: v.de } };
  }
  function irrZurueck() {
    const v = pick(IRR.filter((x) => x.base !== 'read')), ch = shuffle([v, ...shuffle(IRR.filter((x) => x !== v && x.base !== 'read')).slice(0, 3)]);
    return { prompt: `<b lang="en">${v.past}</b> ist die Vergangenheit von …`, choices: ch.map((x) => `<span lang="en">${x.base}</span>`), correct: ch.indexOf(v), hint: IRR_TIPP, solution: irrFormLoesung(v), ex: { mode: 'form', base: v.base, past: v.past, de: v.de } };
  }
  function irrSatz() {
    const s = pick(IRRS);
    return { prompt: `Setze <b lang="en">${s.base}</b> in die Vergangenheit.`, layout: 'satz', fields: [{ type: 'text', ci: true, answer: s.past, prefix: s.subj, suffix: `${s.rest} ${s.zeit}.`, label: 'past simple' }], hint: IRR_TIPP, solution: irrLoesung(s), ex: IREX(s) };
  }
  function irrNeg() {
    const s = pick(IRRS), ch = shuffle([s.neg, `${s.subj} didn’t ${s.past} ${s.rest} ${s.zeit}.`, `${s.subj} not ${s.past} ${s.rest} ${s.zeit}.`]);
    return {
      prompt: `Verneine den Satz. Welcher Satz ist richtig?${en(s.text)}`, choices: ch.map((c) => `<span lang="en">${c}</span>`), correct: ch.indexOf(s.neg),
      hint: 'Verneint wird mit <b>didn’t</b>. Dahinter steht die <b>Grundform</b>: didn’t go, nicht didn’t went.',
      solution: `<span lang="en"><b class="vb">${s.neg}</b></span> ${U.say(s.neg)}<br><b>didn’t</b> zeigt schon die Vergangenheit. Deshalb steht dahinter die Grundform: didn’t <b>${s.base}</b>, nicht didn’t ${s.past}.`, ex: IREX(s, 'neg'),
    };
  }
  const pastIrr = () => U.wahl([[20, irrForm], [18, irrWahl], [14, irrZurueck], [28, irrSatz], [20, irrNeg]]);

  Object.assign(D.daten, { WAS, WASQ, WAS_GRUPPE, ED, ED_REGEL, EDS, IRR, IRRS });
  const themenVorWas = D.audioThemen;
  D.audioThemen = () => Object.assign(themenVorWas(), {
    'e5-was': [...WAS.map((s) => s.text), ...WAS.map((s) => s.neg), ...WASQ.map((s) => s.frage)],
    'e5-ed': [...ED.map((v) => `${v.base}, ${v.past}`), ...EDS.map((s) => s.text), ...EDS.map((s) => s.neg)],
    'e5-irr': [...IRR.filter((v) => v.base !== 'read').map((v) => `${v.base}, ${v.past}`), ...IRRS.map((s) => s.text), ...IRRS.map((s) => s.neg)],
  });
  Object.assign(D.arten, {
    'e5-was': { wasWahl, wasTippen, wasUmbau, wasNeg, wasFrage },
    'e5-ed': { edForm, edWahl, edSatz, edUmbau, edNeg },
    'e5-irr': { irrForm, irrWahl, irrZurueck, irrSatz, irrNeg },
  });

  // =====================================================
  // Wörter: Wortfelder mit festen Listen (Roberto 13.11.: erst feste Listen)
  // =====================================================
  // Wort: [englisch, deutsch, { alt: weitere richtige Schreibweisen, g: Gruppe (nie zusammen als Auswahl),
  //        bild: Emoji für die Bild-Aufgabe, farbe: Farbfleck, kein: nie als „passt nicht dazu“ in einem anderen Feld }]
  // Satz: [Satz mit ___, richtig, [drei Wörter, die sicher nicht passen], Deutsch]
  const WF = {};
  const wfFeld = (id, kurz, woerter, saetze, tipp) => {
    WF[id] = { id, kurz, tipp, W: woerter.map(([en, de, x]) => Object.assign({ en, de }, x || {})), S: saetze.map(([satz, richtig, falsch, de]) => ({ satz, richtig, falsch, de, text: satz.replace('___', richtig) })) };
  };
  wfFeld('e5-w-familie', 'Familie', [
    ['mother', 'Mutter', { alt: ['mum', 'mom'], g: 'm' }], ['father', 'Vater', { alt: ['dad'], g: 'v' }], ['mum', 'Mama', { alt: ['mom', 'mummy', 'mother'], g: 'm' }], ['dad', 'Papa', { alt: ['daddy', 'father'], g: 'v' }],
    ['parents', 'Eltern'], ['sister', 'Schwester'], ['brother', 'Bruder'], ['grandma', 'Oma', { alt: ['granny', 'grandmother'] }], ['grandpa', 'Opa', { alt: ['grandad', 'granddad', 'grandfather'] }],
    ['grandparents', 'Großeltern'], ['aunt', 'Tante'], ['uncle', 'Onkel'], ['cousin', 'Cousin oder Cousine'], ['son', 'Sohn'], ['daughter', 'Tochter'], ['baby', 'Baby', { bild: '👶' }], ['family', 'Familie'], ['twins', 'Zwillinge'],
  ], [
    ['My mother’s sister is my ___.', 'aunt', ['uncle', 'cousin', 'grandpa'], 'Die Schwester meiner Mutter ist meine Tante.'],
    ['My father’s brother is my ___.', 'uncle', ['aunt', 'sister', 'grandma'], 'Der Bruder meines Vaters ist mein Onkel.'],
    ['My mum’s mother is my ___.', 'grandma', ['aunt', 'sister', 'daughter'], 'Die Mutter meiner Mama ist meine Oma.'],
    ['My aunt’s son is my ___.', 'cousin', ['uncle', 'grandpa', 'father'], 'Der Sohn meiner Tante ist mein Cousin.'],
    ['Ben and I have the same parents. Ben is my ___.', 'brother', ['uncle', 'aunt', 'grandma'], 'Ben und ich haben dieselben Eltern. Ben ist mein Bruder.'],
    ['My grandma and my grandpa are my ___.', 'grandparents', ['parents', 'children', 'cousins'], 'Meine Oma und mein Opa sind meine Großeltern.'],
    ['Lisa and Anna were born on the same day. They are ___.', 'twins', ['parents', 'grandparents', 'uncles'], 'Lisa und Anna sind am selben Tag geboren. Sie sind Zwillinge.'],
  ], 'Familienwörter: mother, father, sister, brother, grandma, grandpa, aunt, uncle, cousin.');
  wfFeld('e5-w-haus', 'Haus und Wohnung', [
    ['house', 'Haus', { bild: '🏠' }], ['flat', 'Wohnung', { alt: ['apartment'] }], ['room', 'Zimmer'], ['kitchen', 'Küche'], ['bathroom', 'Badezimmer'], ['bedroom', 'Schlafzimmer'],
    ['living room', 'Wohnzimmer', { alt: ['sitting room', 'lounge'] }], ['garden', 'Garten', { alt: ['yard'] }], ['stairs', 'Treppe'], ['door', 'Tür', { bild: '🚪' }], ['window', 'Fenster'],
    ['bed', 'Bett', { bild: '🛏️' }], ['sofa', 'Sofa', { alt: ['couch'], bild: '🛋️' }], ['chair', 'Stuhl', { bild: '🪑' }], ['lamp', 'Lampe'], ['shelf', 'Regal'], ['fridge', 'Kühlschrank'],
    ['cupboard', 'Schrank', { alt: ['wardrobe'] }], ['toilet', 'Toilette', { bild: '🚽' }],
  ], [
    ['We cook in the ___.', 'kitchen', ['bedroom', 'bathroom', 'garden'], 'Wir kochen in der Küche.'],
    ['I sleep in my ___.', 'bed', ['fridge', 'stairs', 'shelf'], 'Ich schlafe in meinem Bett.'],
    ['The milk is in the ___.', 'fridge', ['sofa', 'bed', 'lamp'], 'Die Milch ist im Kühlschrank.'],
    ['I have a shower in the ___.', 'bathroom', ['kitchen', 'living room', 'garden'], 'Ich dusche im Badezimmer.'],
    ['We watch TV in the ___.', 'living room', ['bathroom', 'fridge', 'stairs'], 'Wir sehen im Wohnzimmer fern.'],
    ['Close the ___, please. It’s cold.', 'window', ['sofa', 'lamp', 'bed'], 'Mach bitte das Fenster zu. Es ist kalt.'],
    ['We play football in the ___.', 'garden', ['fridge', 'bathroom', 'shelf'], 'Wir spielen im Garten Fußball.'],
  ], 'Zimmer: kitchen, bathroom, bedroom, living room. Möbel: bed, sofa, chair, shelf, cupboard.');
  wfFeld('e5-w-schule', 'Schule', [
    ['school', 'Schule', { bild: '🏫' }], ['classroom', 'Klassenzimmer'], ['teacher', 'Lehrer oder Lehrerin'], ['pupil', 'Schüler oder Schülerin', { alt: ['student'] }],
    ['pen', 'Kuli oder Füller'], ['pencil', 'Bleistift', { bild: '✏️' }], ['rubber', 'Radiergummi', { alt: ['eraser'] }], ['ruler', 'Lineal', { bild: '📏' }],
    ['pencil case', 'Federmappe'], ['schoolbag', 'Schultasche', { alt: ['school bag', 'backpack', 'rucksack'], bild: '🎒' }], ['exercise book', 'Heft'], ['book', 'Buch', { bild: '📕' }],
    ['board', 'Tafel'], ['homework', 'Hausaufgaben'], ['lesson', 'Unterrichtsstunde'], ['break', 'Pause'], ['subject', 'Schulfach'], ['timetable', 'Stundenplan'], ['scissors', 'Schere', { bild: '✂️' }], ['glue', 'Kleber'],
  ], [
    ['I write with a ___.', 'pen', ['ruler', 'rubber', 'schoolbag'], 'Ich schreibe mit einem Kuli.'],
    ['I draw lines with a ___.', 'ruler', ['rubber', 'glue', 'pencil case'], 'Ich ziehe Linien mit einem Lineal.'],
    ['Oh no, a mistake! Can I have your ___, please?', 'rubber', ['ruler', 'scissors', 'glue'], 'Oh nein, ein Fehler! Kann ich bitte deinen Radiergummi haben?'],
    ['The teacher writes on the ___.', 'board', ['rubber', 'ruler', 'homework'], 'Die Lehrerin schreibt an die Tafel.'],
    ['My pens and pencils are in my ___.', 'pencil case', ['board', 'timetable', 'lesson'], 'Meine Stifte sind in meiner Federmappe.'],
    ['I cut paper with ___.', 'scissors', ['glue', 'a rubber', 'a ruler'], 'Ich schneide Papier mit einer Schere.'],
    ['Look at the ___. What lesson is next?', 'timetable', ['rubber', 'scissors', 'glue'], 'Schau auf den Stundenplan. Welche Stunde kommt als Nächstes?'],
  ], 'In der Federmappe: pen, pencil, rubber, ruler. Im Klassenzimmer: board, teacher, timetable.');
  wfFeld('e5-w-tag', 'Tagesablauf', [
    ['wake up', 'aufwachen'], ['get up', 'aufstehen'], ['have a shower', 'duschen', { alt: ['take a shower', 'shower'] }], ['have a bath', 'baden', { alt: ['take a bath'] }],
    ['brush my teeth', 'mir die Zähne putzen', { alt: ['brush your teeth', 'brush teeth', 'clean my teeth'] }], ['get dressed', 'mich anziehen'], ['have breakfast', 'frühstücken'],
    ['go to school', 'zur Schule gehen'], ['have lunch', 'zu Mittag essen'], ['come home', 'nach Hause kommen'], ['do my homework', 'meine Hausaufgaben machen', { alt: ['do your homework', 'do homework'] }],
    ['tidy my room', 'mein Zimmer aufräumen', { alt: ['tidy your room', 'tidy up my room'] }], ['have dinner', 'zu Abend essen'], ['go to bed', 'ins Bett gehen'],
  ], [
    ['After dinner I ___. Good night!', 'go to bed', ['get up', 'have breakfast', 'go to school'], 'Nach dem Abendessen gehe ich ins Bett. Gute Nacht!'],
    ['I take my toothbrush and ___.', 'brush my teeth', ['get dressed', 'have lunch', 'go to school'], 'Ich nehme meine Zahnbürste und putze mir die Zähne.'],
    ['In the morning I eat toast and drink milk. I ___.', 'have breakfast', ['have dinner', 'go to bed', 'have a shower'], 'Am Morgen esse ich Toast und trinke Milch. Ich frühstücke.'],
    ['School ends at one o’clock. Then I ___.', 'come home', ['get up', 'have breakfast', 'go to bed'], 'Die Schule endet um eins. Dann komme ich nach Hause.'],
    ['My alarm clock rings. I ___.', 'wake up', ['go to bed', 'have dinner', 'do my homework'], 'Mein Wecker klingelt. Ich wache auf.'],
    ['I put on my T-shirt and my jeans. I ___.', 'get dressed', ['have a shower', 'go to bed', 'brush my teeth'], 'Ich ziehe mein T-Shirt und meine Jeans an. Ich ziehe mich an.'],
    ['My room is a mess. I must ___.', 'tidy my room', ['have lunch', 'wake up', 'come home'], 'Mein Zimmer ist unordentlich. Ich muss mein Zimmer aufräumen.'],
  ], 'Viele Ausdrücke beginnen mit have: have breakfast, have lunch, have dinner, have a shower. Zu „mir“ und „mein“ gehört my: brush my teeth.');
  wfFeld('e5-w-kleidung', 'Kleidung', [
    ['T-shirt', 'T-Shirt', { alt: ['tshirt', 't shirt', 'tee shirt', 'tee-shirt'], bild: '👕' }], ['shirt', 'Hemd'], ['trousers', 'Hose', { alt: ['pants'] }], ['jeans', 'Jeans', { bild: '👖' }],
    ['skirt', 'Rock'], ['dress', 'Kleid', { bild: '👗' }], ['jumper', 'Pullover', { alt: ['sweater', 'pullover'] }], ['jacket', 'Jacke'], ['coat', 'Mantel', { bild: '🧥' }],
    ['shoes', 'Schuhe'], ['trainers', 'Turnschuhe', { alt: ['sneakers'], bild: '👟' }], ['boots', 'Stiefel', { bild: '👢' }], ['socks', 'Socken', { bild: '🧦' }], ['hat', 'Mütze oder Hut'],
    ['cap', 'Basecap', { alt: ['baseball cap'], bild: '🧢' }], ['scarf', 'Schal', { bild: '🧣' }], ['gloves', 'Handschuhe', { bild: '🧤' }], ['shorts', 'kurze Hose', { bild: '🩳' }], ['pyjamas', 'Schlafanzug', { alt: ['pajamas'] }],
  ], [
    ['I wear ___ on my hands.', 'gloves', ['socks', 'a scarf', 'a skirt'], 'An den Händen trage ich Handschuhe.'],
    ['I wear ___ on my feet.', 'shoes', ['gloves', 'a hat', 'a skirt'], 'An den Füßen trage ich Schuhe.'],
    ['I wear a ___ on my head.', 'hat', ['skirt', 'dress', 'glove'], 'Auf dem Kopf trage ich eine Mütze.'],
    ['At night I wear my ___.', 'pyjamas', ['trainers', 'scarf', 'coat'], 'Nachts trage ich meinen Schlafanzug.'],
    ['For sport I wear my ___.', 'trainers', ['pyjamas', 'dress', 'coat'], 'Beim Sport trage ich meine Turnschuhe.'],
    ['It’s hot. I wear ___ and a T-shirt.', 'shorts', ['gloves', 'boots', 'coats'], 'Es ist heiß. Ich trage eine kurze Hose und ein T-Shirt.'],
  ], 'Achtung: trousers, jeans, shorts und pyjamas sind im Englischen immer Mehrzahl. Pullover heißt jumper.');
  wfFeld('e5-w-freizeit', 'Freizeit', [
    ['play football', 'Fußball spielen', { bild: '⚽' }], ['play tennis', 'Tennis spielen', { bild: '🎾' }], ['play the piano', 'Klavier spielen', { bild: '🎹' }], ['play the guitar', 'Gitarre spielen', { bild: '🎸' }],
    ['play computer games', 'Computerspiele spielen', { alt: ['play video games'], bild: '🎮' }], ['ride a bike', 'Fahrrad fahren', { alt: ['ride my bike', 'cycle'], bild: '🚲' }],
    ['swim', 'schwimmen', { bild: '🏊' }], ['dance', 'tanzen', { bild: '💃' }], ['sing', 'singen', { bild: '🎤' }], ['draw', 'zeichnen'], ['paint', 'malen', { bild: '🎨' }],
    ['read books', 'Bücher lesen', { bild: '📚' }], ['listen to music', 'Musik hören', { bild: '🎧' }], ['watch films', 'Filme schauen', { alt: ['watch movies'] }],
    ['go shopping', 'einkaufen gehen', { bild: '🛍️' }], ['meet friends', 'Freunde treffen', { alt: ['meet my friends'] }], ['take photos', 'Fotos machen', { alt: ['take pictures'], bild: '📷' }], ['cook', 'kochen', { bild: '🍳', kein: true }],
  ], [
    ['I ___ in the pool.', 'swim', ['ride a bike', 'play the piano', 'read books'], 'Ich schwimme im Schwimmbecken.'],
    ['I put on my headphones and ___.', 'listen to music', ['ride a bike', 'swim', 'play football'], 'Ich setze meine Kopfhörer auf und höre Musik.'],
    ['Let’s go to the park and ___ with a ball.', 'play football', ['play the piano', 'read books', 'swim'], 'Lass uns in den Park gehen und mit einem Ball Fußball spielen.'],
    ['I ___ in the library.', 'read books', ['swim', 'ride a bike', 'play football'], 'Ich lese Bücher in der Bücherei.'],
    ['I need my camera to ___.', 'take photos', ['swim', 'sing', 'cook'], 'Ich brauche meine Kamera, um Fotos zu machen.'],
    ['I put on my helmet and ___.', 'ride a bike', ['read books', 'sing', 'play the piano'], 'Ich setze meinen Helm auf und fahre Fahrrad.'],
    ['I need a pencil and paper to ___.', 'draw', ['swim', 'dance', 'sing'], 'Ich brauche einen Bleistift und Papier, um zu zeichnen.'],
  ], 'Sport ohne the: play football, play tennis. Instrumente mit the: play the piano, play the guitar.');
  wfFeld('e5-w-tiere', 'Tiere', [
    ['dog', 'Hund', { bild: '🐶' }], ['cat', 'Katze', { bild: '🐱' }], ['rabbit', 'Kaninchen', { alt: ['bunny'], bild: '🐰' }], ['hamster', 'Hamster', { bild: '🐹' }], ['guinea pig', 'Meerschweinchen'],
    ['bird', 'Vogel', { bild: '🐦' }], ['fish', 'Fisch', { bild: '🐟', kein: true }], ['horse', 'Pferd', { bild: '🐴' }], ['mouse', 'Maus', { bild: '🐭' }], ['cow', 'Kuh', { bild: '🐮' }],
    ['pig', 'Schwein', { bild: '🐷' }], ['sheep', 'Schaf', { bild: '🐑' }], ['duck', 'Ente', { bild: '🦆', kein: true }], ['chicken', 'Huhn', { alt: ['hen'], bild: '🐔', kein: true }],
    ['tortoise', 'Schildkröte', { alt: ['turtle'], bild: '🐢' }], ['snake', 'Schlange', { bild: '🐍' }], ['frog', 'Frosch', { bild: '🐸' }], ['elephant', 'Elefant', { bild: '🐘' }], ['lion', 'Löwe', { bild: '🦁' }], ['monkey', 'Affe', { bild: '🐵' }],
  ], [
    ['A ___ says ‘Woof!’', 'dog', ['cat', 'cow', 'duck'], 'Ein Hund macht „Wuff!“'],
    ['A ___ says ‘Moo!’', 'cow', ['dog', 'sheep', 'frog'], 'Eine Kuh macht „Muh!“'],
    ['A ___ can swim, but it can’t walk.', 'fish', ['horse', 'dog', 'cat'], 'Ein Fisch kann schwimmen, aber nicht laufen.'],
    ['The ___ is very big and grey. It has a long nose.', 'elephant', ['mouse', 'frog', 'rabbit'], 'Der Elefant ist sehr groß und grau. Er hat eine lange Nase.'],
    ['A ___ is very small and likes cheese.', 'mouse', ['horse', 'elephant', 'cow'], 'Eine Maus ist sehr klein und mag Käse.'],
    ['You can ride a ___.', 'horse', ['frog', 'fish', 'snake'], 'Man kann auf einem Pferd reiten.'],
    ['A ___ is green and can jump.', 'frog', ['pig', 'cow', 'elephant'], 'Ein Frosch ist grün und kann springen.'],
  ], 'Haustiere (pets): dog, cat, rabbit, hamster, guinea pig. Auf dem Bauernhof: cow, pig, sheep, horse, chicken.');
  wfFeld('e5-w-koerper', 'Körper', [
    ['head', 'Kopf'], ['hair', 'Haare'], ['face', 'Gesicht'], ['eye', 'Auge', { bild: '👁️' }], ['ear', 'Ohr', { bild: '👂' }], ['nose', 'Nase', { bild: '👃' }], ['mouth', 'Mund', { bild: '👄' }],
    ['tooth', 'Zahn', { bild: '🦷' }], ['teeth', 'Zähne'], ['neck', 'Hals'], ['arm', 'Arm', { bild: '💪' }], ['hand', 'Hand', { bild: '✋' }], ['finger', 'Finger'], ['leg', 'Bein', { bild: '🦵' }],
    ['knee', 'Knie'], ['foot', 'Fuß', { bild: '🦶' }], ['feet', 'Füße'], ['back', 'Rücken'], ['tummy', 'Bauch', { alt: ['stomach', 'belly'] }], ['toe', 'Zeh'],
  ], [
    ['I see with my ___.', 'eyes', ['ears', 'feet', 'hands'], 'Ich sehe mit meinen Augen.'],
    ['I hear with my ___.', 'ears', ['eyes', 'knees', 'teeth'], 'Ich höre mit meinen Ohren.'],
    ['I eat with my ___.', 'mouth', ['nose', 'ear', 'knee'], 'Ich esse mit meinem Mund.'],
    ['I smell with my ___.', 'nose', ['ear', 'hand', 'foot'], 'Ich rieche mit meiner Nase.'],
    ['I brush my ___ every morning.', 'teeth', ['knees', 'feet', 'shoulders'], 'Ich putze jeden Morgen meine Zähne.'],
    ['I write with my ___.', 'hand', ['foot', 'nose', 'ear'], 'Ich schreibe mit meiner Hand.'],
    ['I have ten ___ on my hands.', 'fingers', ['toes', 'eyes', 'ears'], 'An meinen Händen habe ich zehn Finger.'],
  ], 'Achtung Mehrzahl: one tooth – two teeth, one foot – two feet. Haare heißt hair (ohne s).');
  wfFeld('e5-w-essen', 'Essen und Trinken', [
    ['bread', 'Brot', { bild: '🍞' }], ['butter', 'Butter', { bild: '🧈' }], ['cheese', 'Käse', { bild: '🧀' }], ['egg', 'Ei', { bild: '🥚' }], ['apple', 'Apfel', { bild: '🍎' }],
    ['banana', 'Banane', { bild: '🍌' }], ['pear', 'Birne', { bild: '🍐' }], ['strawberry', 'Erdbeere', { bild: '🍓' }], ['carrot', 'Karotte', { bild: '🥕' }], ['potato', 'Kartoffel', { bild: '🥔' }],
    ['tomato', 'Tomate', { bild: '🍅' }], ['rice', 'Reis', { bild: '🍚' }], ['pasta', 'Nudeln', { alt: ['noodles'], bild: '🍝' }], ['pizza', 'Pizza', { bild: '🍕' }], ['cake', 'Kuchen', { bild: '🍰' }],
    ['biscuit', 'Keks', { alt: ['cookie'], bild: '🍪' }], ['chocolate', 'Schokolade', { bild: '🍫' }], ['ice cream', 'Eis', { alt: ['ice-cream'], bild: '🍦' }], ['milk', 'Milch', { bild: '🥛' }],
    ['water', 'Wasser'], ['juice', 'Saft'], ['tea', 'Tee', { bild: '🍵' }], ['sandwich', 'Sandwich', { bild: '🥪' }], ['soup', 'Suppe'],
  ], [
    ['I drink ___ with my breakfast.', 'milk', ['cheese', 'bread', 'pasta'], 'Zum Frühstück trinke ich Milch.'],
    ['I need ___ for my sandwich.', 'bread', ['water', 'ice cream', 'tea'], 'Für mein Sandwich brauche ich Brot.'],
    ['Rabbits love ___.', 'carrots', ['sausages', 'chocolate', 'tea'], 'Kaninchen lieben Karotten.'],
    ['On my birthday I have a big ___ with candles.', 'cake', ['egg', 'soup', 'potato'], 'An meinem Geburtstag habe ich einen großen Kuchen mit Kerzen.'],
    ['It’s hot. Let’s have some ___!', 'ice cream', ['soup', 'bread', 'potatoes'], 'Es ist heiß. Lass uns ein Eis essen!'],
    ['Chickens lay ___.', 'eggs', ['apples', 'bread', 'cheese'], 'Hühner legen Eier.'],
    ['I’m thirsty. Can I have some ___, please?', 'water', ['bread', 'cheese', 'rice'], 'Ich habe Durst. Kann ich bitte etwas Wasser haben?'],
  ], 'Obst (fruit): apple, banana, pear, strawberry. Gemüse (vegetables): carrot, potato, tomato. Getränke: milk, water, juice, tea.');
  wfFeld('e5-w-farben', 'Farben', [
    ['red', 'rot', { farbe: '#e53935' }], ['blue', 'blau', { farbe: '#1e5bd8' }], ['green', 'grün', { farbe: '#2e9d4a' }], ['yellow', 'gelb', { farbe: '#f7d02c' }], ['orange', 'orange', { farbe: '#f28c28' }],
    ['black', 'schwarz', { farbe: '#1a1a1a' }], ['white', 'weiß', { farbe: '#ffffff' }], ['brown', 'braun', { farbe: '#8b5a2b' }], ['grey', 'grau', { alt: ['gray'], farbe: '#9e9e9e' }],
    ['pink', 'rosa', { farbe: '#f48fb1' }], ['purple', 'lila', { farbe: '#8e44ad' }], ['colour', 'Farbe', { alt: ['color'] }],
  ], [
    ['The sky is ___.', 'blue', ['green', 'pink', 'orange'], 'Der Himmel ist blau.'],
    ['Grass is ___.', 'green', ['blue', 'pink', 'purple'], 'Gras ist grün.'],
    ['Snow is ___.', 'white', ['black', 'red', 'green'], 'Schnee ist weiß.'],
    ['Bananas are ___.', 'yellow', ['blue', 'purple', 'pink'], 'Bananen sind gelb.'],
    ['Black and white make ___.', 'grey', ['green', 'yellow', 'pink'], 'Schwarz und Weiß ergibt Grau.'],
    ['Red and yellow make ___.', 'orange', ['green', 'purple', 'grey'], 'Rot und Gelb ergibt Orange.'],
    ['Blue and yellow make ___.', 'green', ['orange', 'pink', 'brown'], 'Blau und Gelb ergibt Grün.'],
    ['Red and white make ___.', 'pink', ['green', 'blue', 'black'], 'Rot und Weiß ergibt Rosa.'],
  ], 'Achtung: rosa heißt pink, lila heißt purple. Grau schreibt man britisch grey, amerikanisch gray.');
  wfFeld('e5-w-zeit', 'Tage und Jahreszeiten', [
    ['Monday', 'Montag'], ['Tuesday', 'Dienstag'], ['Wednesday', 'Mittwoch'], ['Thursday', 'Donnerstag'], ['Friday', 'Freitag'], ['Saturday', 'Samstag'], ['Sunday', 'Sonntag'],
    ['spring', 'Frühling'], ['summer', 'Sommer'], ['autumn', 'Herbst', { alt: ['fall'] }], ['winter', 'Winter'], ['today', 'heute'], ['tomorrow', 'morgen (der nächste Tag)'], ['yesterday', 'gestern'],
    ['day', 'Tag'], ['week', 'Woche'], ['weekend', 'Wochenende'], ['month', 'Monat'], ['year', 'Jahr'],
  ], [
    ['The day after Monday is ___.', 'Tuesday', ['Thursday', 'Sunday', 'Friday'], 'Der Tag nach Montag ist Dienstag.'],
    ['The day before Friday is ___.', 'Thursday', ['Tuesday', 'Saturday', 'Monday'], 'Der Tag vor Freitag ist Donnerstag.'],
    ['Saturday and Sunday are the ___.', 'weekend', ['week', 'month', 'year'], 'Samstag und Sonntag sind das Wochenende.'],
    ['In ___ it is hot and we go swimming.', 'summer', ['winter', 'autumn', 'spring'], 'Im Sommer ist es heiß, und wir gehen schwimmen.'],
    ['In ___ it is cold and it snows.', 'winter', ['summer', 'spring', 'autumn'], 'Im Winter ist es kalt, und es schneit.'],
    ['A week has seven ___.', 'days', ['months', 'years', 'weekends'], 'Eine Woche hat sieben Tage.'],
    ['A year has twelve ___.', 'months', ['days', 'weeks', 'weekends'], 'Ein Jahr hat zwölf Monate.'],
    ['Yesterday was Monday, so today is ___.', 'Tuesday', ['Sunday', 'Wednesday', 'Monday'], 'Gestern war Montag, also ist heute Dienstag.'],
  ], 'Wochentage schreibt man im Englischen immer groß: Monday, Tuesday … Achtung: Wednesday spricht man „Wens-day“.');
  // Paare, die sich beim „passt nicht dazu“ zu nah sind
  // Tagesablauf nur mit Tieren und Farben mischen: die Ausdrücke passen sonst halb zu Haus, Schule, Essen, Kleidung, Körper …
  const WF_NAH = new Set(['e5-w-haus|e5-w-schule', 'e5-w-freizeit|e5-w-schule', 'e5-w-essen|e5-w-haus',
    ...['e5-w-familie', 'e5-w-haus', 'e5-w-schule', 'e5-w-kleidung', 'e5-w-freizeit', 'e5-w-koerper', 'e5-w-essen', 'e5-w-zeit'].map((x) => [x, 'e5-w-tag'].sort().join('|'))]);
  const wfAndere = (F, w, n, nur) => shuffle(F.W.filter((x) => x !== w && (!w.g || x.g !== w.g) && x.de !== w.de && (!nur || nur(x)))).slice(0, n);
  const wfBild = (w) => (w.bild
    ? `<svg viewBox="0 0 360 130" role="img" aria-label="Bild"><text x="180" y="104" text-anchor="middle" style="font-size:92px">${w.bild}</text></svg>`
    : `<svg viewBox="0 0 360 130" role="img" aria-label="Farbe"><path d="M180 14c30 0 40 18 62 20s30 30 18 52-38 34-80 32-72-6-80-34 12-30 22-46 28-24 58-24z" fill="${w.farbe}" stroke="#2b2440" stroke-width="3"/></svg>`);
  const wfLoesung = (F, w) => {
    const s = F.S.find((x) => x.richtig === w.en);
    return `<b class="vb" lang="en">${w.en}</b> ${U.say(w.en)} = <b>${w.de}</b>${w.alt ? `<br><small>Auch richtig: <span lang="en">${w.alt.join(', ')}</span></small>` : ''}${s ? `<br>Im Satz: <span lang="en">${s.text}</span> ${U.say(s.text)}<br><small>${s.de}</small>` : ''}`;
  };
  const WFT = {
    wDeEn(F) { const w = pick(F.W), ch = shuffle([w, ...wfAndere(F, w, 3)]); return { prompt: `Wie heißt <b>${w.de}</b> auf Englisch?`, choices: ch.map((x) => `<span lang="en">${x.en}</span>`), correct: ch.indexOf(w), hint: F.tipp, solution: wfLoesung(F, w), ex: { mode: 'wort', en: w.en } }; },
    wEnDe(F) { const w = pick(F.W), ch = shuffle([w, ...wfAndere(F, w, 3)]); return { prompt: `Was heißt das auf Deutsch?${en(w.en)}`, choices: ch.map((x) => x.de), correct: ch.indexOf(w), hint: F.tipp, solution: wfLoesung(F, w), ex: { mode: 'wort', en: w.en } }; },
    wTippen(F) { const w = pick(F.W); return { prompt: `Wie heißt <b>${w.de}</b> auf Englisch? Tippe es ein.`, fields: [{ type: 'text', ci: true, answer: [w.en, ...(w.alt || [])], label: 'auf Englisch' }], hint: F.tipp, solution: wfLoesung(F, w), ex: { mode: 'wort', en: w.en } }; },
    wHoeren(F) { const w = pick(F.W), ch = shuffle([w, ...wfAndere(F, w, 3)]); return { prompt: `Hör genau hin: Was bedeutet das? ${U.say(w.en)}`, choices: ch.map((x) => x.de), correct: ch.indexOf(w), hint: 'Tippe auf den Lautsprecher und hör dir das Wort an. Du kannst es so oft hören, wie du willst.', solution: wfLoesung(F, w), ex: { mode: 'wort', en: w.en } }; },
    wBild(F) {
      const hat = (x) => x.bild || x.farbe, w = pick(F.W.filter(hat)), ch = shuffle([w, ...wfAndere(F, w, 3, hat)]);
      return { prompt: w.farbe ? 'Welche Farbe ist das?' : 'Was ist das? Wähle das englische Wort.', figure: wfBild(w), choices: ch.map((x) => `<span lang="en">${x.en}</span>`), correct: ch.indexOf(w), hint: F.tipp, solution: wfLoesung(F, w), ex: { mode: 'wort', en: w.en } };
    },
    wSatz(F) {
      const s = pick(F.S), ch = shuffle([s.richtig, ...s.falsch]);
      return { prompt: `Welches Wort passt in die Lücke?${en(s.satz)}`, choices: ch.map((c) => `<span lang="en">${c}</span>`), correct: ch.indexOf(s.richtig), hint: F.tipp, solution: `<span lang="en">${s.satz.replace('___', `<b class="vb">${s.richtig}</b>`)}</span> ${U.say(s.text)}<br><small>Auf Deutsch: ${s.de}</small>`, ex: { mode: 'satz', i: F.S.indexOf(s) } };
    },
    wRaus(F) {
      const B = pick(Object.values(WF).filter((G) => G !== F && !WF_NAH.has([F.id, G.id].sort().join('|'))));
      const drei = [];
      for (const w of shuffle(F.W)) if (drei.length < 3 && !drei.some((x) => x.g && x.g === w.g)) drei.push(w);
      const r = pick(B.W.filter((x) => !x.kein)), ch = shuffle([...drei, r]);
      return {
        prompt: 'Welches Wort passt nicht zu den anderen?', choices: ch.map((x) => `<span lang="en">${x.en}</span>`), correct: ch.indexOf(r),
        hint: 'Übersetze jedes Wort im Kopf. Drei gehören zum selben Thema.',
        solution: `<b class="vb" lang="en">${r.en}</b> (${r.de}) gehört zum Thema <b>${B.kurz}</b>.<br>Die anderen gehören zum Thema <b>${F.kurz}</b>: ${drei.map((x) => `<span lang="en">${x.en}</span> (${x.de})`).join(', ')}.`,
        ex: { mode: 'raus', en: ch.map((x) => x.en), raus: r.en, rausFeld: B.id },
      };
    },
  };
  const wfMitBild = (F) => F.W.filter((x) => x.bild || x.farbe).length >= 4;
  const wfGen = (id) => () => {
    const F = WF[id];
    return U.wahl([[15, () => WFT.wDeEn(F)], [12, () => WFT.wEnDe(F)], [20, () => WFT.wTippen(F)], [12, () => WFT.wHoeren(F)], ...(wfMitBild(F) ? [[15, () => WFT.wBild(F)]] : []), [16, () => WFT.wSatz(F)], [10, () => WFT.wRaus(F)]]);
  };
  Object.assign(D.daten, { WF, WF_NAH });
  const themenVorWort = D.audioThemen;
  D.audioThemen = () => Object.assign(themenVorWort(), Object.fromEntries(Object.values(WF).map((F) => [F.id, [...F.W.map((w) => w.en), ...F.S.map((x) => x.text)]])));
  for (const id of Object.keys(WF)) D.arten[id] = Object.fromEntries(Object.keys(WFT).filter((k) => k !== 'wBild' || wfMitBild(WF[id])).map((k) => [k, () => WFT[k](WF[id])]));

  // =====================================================
  // Im Alltag: Gespräche, Einkaufen, Weg, Lesen
  // =====================================================
  // Paar: [Frage oder Satz, passende Antwort, [zwei Antworten, die sicher nicht passen], Deutsch]
  // Situation: [Situation auf Deutsch, richtiger Satz, [zwei falsche Sätze]]
  // Lücke: [Satz mit ___, Antwort (oder Liste), Deutsch]
  const AL = {};
  const alFeld = (id, kurz, paare, sit, luecken, tipp) => {
    AL[id] = {
      id, kurz, tipp,
      P: paare.map(([frage, antwort, falsch, de]) => ({ frage, antwort, falsch, de })),
      S: sit.map(([de, richtig, falsch]) => ({ de, richtig, falsch })),
      L: luecken.map(([satz, antwort, de]) => { const a = [].concat(antwort); return { satz, antwort: a, de, text: satz.replace('___', a[0]) }; }),
    };
  };
  alFeld('e5-a-hallo', 'Hallo und Tschüss', [
    ['Hello! What’s your name?', 'My name is Max.', ['I’m eleven.', 'I’m from Germany.'], 'Hallo! Wie heißt du? – Ich heiße Max.'],
    ['How are you?', 'I’m fine, thanks.', ['I’m Max.', 'I’m from Germany.'], 'Wie geht es dir? – Gut, danke.'],
    ['How old are you?', 'I’m eleven.', ['I’m fine, thanks.', 'It’s Monday.'], 'Wie alt bist du? – Ich bin elf.'],
    ['Where are you from?', 'I’m from Germany.', ['I’m eleven.', 'I’m fine, thanks.'], 'Woher kommst du? – Ich komme aus Deutschland.'],
    ['Where do you live?', 'I live in Dresden.', ['I’m eleven.', 'My name is Max.'], 'Wo wohnst du? – Ich wohne in Dresden.'],
    ['Nice to meet you.', 'Nice to meet you too.', ['I’m eleven.', 'It’s Monday.'], 'Schön, dich kennenzulernen. – Ich freue mich auch.'],
    ['Thank you!', 'You’re welcome.', ['I’m from Germany.', 'How old are you?'], 'Danke! – Gern geschehen.'],
    ['Goodbye!', 'Bye! See you tomorrow.', ['Hello! How are you?', 'I’m eleven.'], 'Auf Wiedersehen! – Tschüss! Bis morgen.'],
    ['When is your birthday?', 'It’s in May.', ['I’m fine, thanks.', 'I live in Dresden.'], 'Wann hast du Geburtstag? – Im Mai.'],
    ['Have you got any pets?', 'Yes, I’ve got a dog.', ['Yes, I am.', 'I’m eleven.'], 'Hast du Haustiere? – Ja, ich habe einen Hund.'],
    ['What’s your favourite colour?', 'My favourite colour is blue.', ['I’m from Germany.', 'It’s in May.'], 'Was ist deine Lieblingsfarbe? – Meine Lieblingsfarbe ist Blau.'],
    ['Sorry!', 'That’s OK.', ['You’re welcome.', 'Nice to meet you.'], 'Entschuldigung! – Schon gut.'],
  ], [
    ['Du begrüßt jemanden.', 'Hello!', ['Goodbye!', 'Sorry!']],
    ['Du bedankst dich.', 'Thank you!', ['Please.', 'Sorry!']],
    ['Du hast jemanden aus Versehen angerempelt.', 'Sorry!', ['Thank you!', 'You’re welcome.']],
    ['Du willst wissen, wie alt jemand ist.', 'How old are you?', ['How are you?', 'Who are you?']],
    ['Du willst wissen, wie es jemandem geht.', 'How are you?', ['How old are you?', 'Where are you?']],
    ['Du verabschiedest dich abends vor dem Schlafen.', 'Good night!', ['Good morning!', 'Hello!']],
    ['Du willst wissen, woher jemand kommt.', 'Where are you from?', ['Where are you?', 'What are you?']],
    ['Du stellst deine Freundin Lisa vor.', 'This is my friend Lisa.', ['My name is Lisa.', 'Lisa, how are you?']],
  ], [
    ['My ___ is Max.', 'name', 'Ich heiße Max.'],
    ['Nice to ___ you.', 'meet', 'Schön, dich kennenzulernen.'],
    ['I’m ___ Germany.', 'from', 'Ich komme aus Deutschland.'],
    ['How ___ are you? – I’m eleven.', 'old', 'Wie alt bist du? – Ich bin elf.'],
    ['Thank you! – You’re ___.', 'welcome', 'Danke! – Gern geschehen.'],
    ['I’m fine, ___.', ['thanks', 'thank you'], 'Mir geht es gut, danke.'],
  ], 'Wer bist du? My name is … · Wie alt? I’m eleven. · Woher? I’m from … · Danke: Thank you! – You’re welcome.');
  alFeld('e5-a-klasse', 'Im Unterricht', [
    ['Have you got your homework?', 'Sorry, I haven’t got it.', ['Yes, I’m eleven.', 'Nice to meet you.'], 'Hast du deine Hausaufgaben? – Entschuldigung, ich habe sie nicht.'],
    ['What’s the answer, Max?', 'Sorry, I don’t know.', ['You’re welcome.', 'Goodbye!'], 'Was ist die Antwort, Max? – Entschuldigung, ich weiß es nicht.'],
    ['Can I borrow your ruler, please?', 'Yes, here you are.', ['I’m fine, thanks.', 'It’s in May.'], 'Kann ich mir dein Lineal ausleihen? – Ja, hier bitte.'],
    ['Why are you late?', 'Sorry, I missed the bus.', ['I’m eleven.', 'Nice to meet you.'], 'Warum kommst du zu spät? – Entschuldigung, ich habe den Bus verpasst.'],
    ['Do you understand?', 'Yes, I do.', ['Yes, I am.', 'Yes, please.'], 'Verstehst du das? – Ja.'],
    ['Can I open the window, please?', 'Yes, of course.', ['I’m from Germany.', 'You’re welcome.'], 'Kann ich das Fenster öffnen? – Ja, natürlich.'],
  ], [
    ['Du hast etwas nicht verstanden.', 'Sorry, I don’t understand.', ['Sorry, I’m late.', 'Can I open the window, please?']],
    ['Du kommst zu spät in den Unterricht.', 'Sorry, I’m late.', ['Sorry, I don’t understand.', 'Can I go to the toilet, please?']],
    ['Die Lehrerin soll es noch einmal sagen.', 'Can you say that again, please?', ['Can you open the window, please?', 'Can I have a pen, please?']],
    ['Du willst wissen, was „Tafel“ auf Englisch heißt.', 'What’s ‘Tafel’ in English?', ['What’s the time?', 'Where is the board?']],
    ['Du musst auf die Toilette.', 'Can I go to the toilet, please?', ['Can I open the window, please?', 'Can you say that again, please?']],
    ['Es ist heiß im Raum. Du willst das Fenster öffnen.', 'Can I open the window, please?', ['Can I go to the toilet, please?', 'Can you say that again, please?']],
    ['Du weißt die Antwort nicht.', 'Sorry, I don’t know.', ['Sorry, I’m late.', 'Can I open the window, please?']],
    ['Du willst wissen, wie man ein Wort schreibt.', 'How do you spell that?', ['How old are you?', 'What’s the time?']],
  ], [
    ['Can you say that ___, please?', 'again', 'Kannst du das bitte noch einmal sagen?'],
    ['Sorry, I don’t ___.', ['understand', 'know'], 'Entschuldigung, ich verstehe es nicht.'],
    ['Can I ___ the window, please?', ['open', 'close'], 'Kann ich bitte das Fenster öffnen?'],
    ['How do you ___ that?', ['spell', 'say', 'write'], 'Wie schreibt man das?'],
    ['Sorry, I’m ___.', ['late', 'sorry'], 'Entschuldigung, ich bin zu spät.'],
  ], 'Wichtige Sätze: Sorry, I don’t understand. · Can you say that again, please? · How do you spell that? · Can I …, please?');
  // Anweisungen der Lehrerin: [englisch, deutsch]
  const ANW = [
    ['Open your books, please.', 'Öffnet eure Bücher.'], ['Close your books, please.', 'Schließt eure Bücher.'], ['Listen, please.', 'Hört zu.'],
    ['Work with a partner.', 'Arbeitet mit einem Partner.'], ['Write it down, please.', 'Schreibt es auf.'], ['Sit down, please.', 'Setzt euch hin.'],
    ['Stand up, please.', 'Steht auf.'], ['Be quiet, please.', 'Seid bitte leise.'], ['Look at the board.', 'Schaut an die Tafel.'], ['Read the text.', 'Lest den Text.'],
  ].map(([e, de]) => ({ e, de }));
  alFeld('e5-a-laden', 'Einkaufen', [
    ['Can I help you?', 'Yes, I’d like a sandwich, please.', ['No, I’m eleven.', 'Yes, I’m fine.'], 'Kann ich dir helfen? – Ja, ich hätte gern ein Sandwich.'],
    ['How much is the apple juice?', 'It’s one pound twenty.', ['It’s on the table.', 'It’s Monday.'], 'Wie viel kostet der Apfelsaft? – Ein Pfund zwanzig.'],
    ['Anything else?', 'No, thanks. That’s all.', ['Yes, I’m Max.', 'Nice to meet you.'], 'Sonst noch etwas? – Nein, danke. Das ist alles.'],
    ['That’s three pounds fifty, please.', 'Here you are.', ['How are you?', 'Nice to meet you.'], 'Das macht drei Pfund fünfzig. – Hier, bitte.'],
    ['Have you got any bananas?', 'Yes, they’re over there.', ['Yes, I’m fine.', 'No, I’m eleven.'], 'Haben Sie Bananen? – Ja, dort drüben.'],
    ['Here’s your change.', 'Thank you. Goodbye!', ['How old are you?', 'I’m from Germany.'], 'Hier ist dein Wechselgeld. – Danke. Auf Wiedersehen!'],
  ], [
    ['Du willst wissen, was etwas kostet.', 'How much is it?', ['How many are there?', 'How old is it?']],
    ['Du möchtest ein Eis kaufen.', 'I’d like an ice cream, please.', ['I like ice cream.', 'Where is the ice cream?']],
    ['Du gibst dem Verkäufer das Geld.', 'Here you are.', ['You’re welcome.', 'How much is it?']],
    ['Du brauchst nichts mehr.', 'That’s all, thanks.', ['Anything else?', 'Can I help you?']],
    ['Du suchst Äpfel und fragst den Verkäufer.', 'Have you got any apples?', ['Have you got an apple tree?', 'Do you like apples?']],
  ], [
    ['How ___ is it?', 'much', 'Wie viel kostet es?'],
    ['I’d ___ a sandwich, please.', 'like', 'Ich hätte gern ein Sandwich.'],
    ['Here you ___.', 'are', 'Hier, bitte.'],
    ['Anything ___?', 'else', 'Sonst noch etwas?'],
    ['No, thanks. That’s ___.', 'all', 'Nein, danke. Das ist alles.'],
  ], 'Fragen: How much is it? · Bestellen: I’d like …, please. · Geld geben: Here you are. · £ = pound, p = pence.');
  // Preise: [Pfund, Pence]
  const PREISE = [[1, 20], [2, 50], [3, 50], [5, 0], [2, 99], [0, 80], [10, 40], [4, 75], [1, 5], [6, 30], [0, 50], [12, 0]].map(([l, p]) => {
    const w = (n) => zahlWort(n);
    const text = l === 0 ? `${w(p)} pence` : p === 0 ? `${w(l)} pound${l === 1 ? '' : 's'}` : `${w(l)} pound${l === 1 ? '' : 's'} ${w(p)}`;
    return { l, p, zeichen: l === 0 ? `${p}p` : `£${l}.${String(p).padStart(2, '0')}`, text, satz: `It’s ${text}.` };
  });
  alFeld('e5-a-weg', 'Nach dem Weg fragen', [
    ['Excuse me, where is the station?', 'Go straight on. It’s on the left.', ['I’m eleven.', 'It’s three pounds.'], 'Entschuldigung, wo ist der Bahnhof? – Geh geradeaus. Er ist links.'],
    ['Is it far?', 'No, it’s only five minutes.', ['Yes, I’m fine.', 'No, I’m from Germany.'], 'Ist es weit? – Nein, nur fünf Minuten.'],
    ['Thank you for your help!', 'You’re welcome.', ['Turn left.', 'How much is it?'], 'Danke für deine Hilfe! – Gern geschehen.'],
    ['Excuse me, how do I get to the park?', 'Take the first street on the right.', ['It’s in May.', 'Yes, I’ve got a dog.'], 'Entschuldigung, wie komme ich zum Park? – Nimm die erste Straße rechts.'],
  ], [
    ['Du suchst den Bahnhof und fragst jemanden.', 'Excuse me, where is the station?', ['Excuse me, how much is the station?', 'Excuse me, when is the station?']],
    ['Du willst wissen, ob es weit ist.', 'Is it far?', ['Is it big?', 'Is it new?']],
    ['Du bedankst dich für die Hilfe.', 'Thank you for your help!', ['You’re welcome.', 'Excuse me!']],
  ], [
    ['Turn ___ at the bank.', ['left', 'right'], 'Bieg an der Bank ab.'],
    ['Go ___ on.', 'straight', 'Geh geradeaus.'],
    ['___ me, where is the park?', 'Excuse', 'Entschuldigung, wo ist der Park?'],
    ['Take the ___ street on the right.', ['first', 'second', 'third'], 'Nimm die erste Straße rechts.'],
  ], 'straight on = geradeaus · turn left = links abbiegen · turn right = rechts abbiegen · the first street on the left = die erste Straße links.');
  // Wege auf der Karte: Weg vom Start (unten) zum Ziel
  const WEGE = [
    { k: 'gerade', satz: 'Go straight on.', de: 'Geh geradeaus.', pfad: [[180, 200], [180, 30]] },
    { k: 'l1', satz: 'Take the first street on the left.', de: 'Nimm die erste Straße links.', pfad: [[180, 200], [180, 140], [40, 140]] },
    { k: 'r1', satz: 'Take the first street on the right.', de: 'Nimm die erste Straße rechts.', pfad: [[180, 200], [180, 140], [320, 140]] },
    { k: 'l2', satz: 'Take the second street on the left.', de: 'Nimm die zweite Straße links.', pfad: [[180, 200], [180, 70], [40, 70]] },
    { k: 'r2', satz: 'Take the second street on the right.', de: 'Nimm die zweite Straße rechts.', pfad: [[180, 200], [180, 70], [320, 70]] },
  ];
  const wegKarte = (w) => {
    const strasse = 'stroke="#d9d2c3" stroke-width="26" stroke-linecap="square"';
    const pfad = w ? `<polyline points="${w.pfad.map((p) => p.join(',')).join(' ')}" fill="none" stroke="#1f55d6" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="2 12"/>` : '';
    const z = w ? w.pfad[w.pfad.length - 1] : null;
    return `<svg viewBox="0 10 360 205" role="img" aria-label="Karte"><rect x="0" y="10" width="360" height="205" fill="#eef5e6"/><line x1="180" y1="14" x2="180" y2="212" ${strasse}/><line x1="20" y1="140" x2="340" y2="140" ${strasse}/><line x1="20" y1="70" x2="340" y2="70" ${strasse}/>${pfad}<circle cx="180" cy="200" r="9" fill="#2b2440"/><text x="198" y="205" style="font:800 13px Nunito,system-ui,sans-serif;fill:#2b2440">du</text>${z ? `<path d="M${z[0]} ${z[1] - 14}l4 9h10l-8 6 3 10-9-6-9 6 3-10-8-6h10z" fill="#f2a516" stroke="#2b2440" stroke-width="1.5"/>` : ''}</svg>`;
  };
  // Lesetexte: [Titel, Text, Fragen: [Frage, richtig, [falsch, falsch], Beleg-Satz] oder Stimmt-das: [Satz, true/false, Beleg]]
  const LT = [
    { titel: 'Hi, I’m Emma', text: 'Hi! My name is Emma and I’m eleven years old. I live in Bristol with my mum, my dad and my little brother Sam. Sam is six. We’ve got a cat called Tiger. My favourite subject at school is art. After school I often play the piano. On Saturdays I go swimming with my friend Mia.',
      fragen: [['How old is Emma?', 'She’s eleven.', ['She’s six.', 'She’s twelve.'], 'My name is Emma and I’m eleven years old.'],
        ['Who is Sam?', 'Emma’s brother', ['Emma’s dad', 'Emma’s friend'], 'I live in Bristol with my mum, my dad and my little brother Sam.'],
        ['What is Tiger?', 'a cat', ['a dog', 'a rabbit'], 'We’ve got a cat called Tiger.'],
        ['What does Emma do on Saturdays?', 'She goes swimming.', ['She plays the piano.', 'She goes to school.'], 'On Saturdays I go swimming with my friend Mia.']],
      stimmt: [['Emma’s favourite subject is maths.', false, 'My favourite subject at school is art.'], ['Emma lives in Bristol.', true, 'I live in Bristol with my mum, my dad and my little brother Sam.']] },
    { titel: 'Tom’s day', text: 'Tom gets up at seven o’clock. He has breakfast with his sister. Then he goes to school by bus. School starts at eight. At one o’clock Tom has lunch at school. In the afternoon he plays football with his friends. In the evening he does his homework and watches TV. He goes to bed at nine.',
      fragen: [['When does Tom get up?', 'at seven o’clock', ['at eight o’clock', 'at nine o’clock'], 'Tom gets up at seven o’clock.'],
        ['How does Tom go to school?', 'by bus', ['by bike', 'by car'], 'Then he goes to school by bus.'],
        ['What does Tom do in the afternoon?', 'He plays football.', ['He does his homework.', 'He watches TV.'], 'In the afternoon he plays football with his friends.'],
        ['When does Tom go to bed?', 'at nine', ['at seven', 'at one'], 'He goes to bed at nine.']],
      stimmt: [['Tom has breakfast with his brother.', false, 'He has breakfast with his sister.'], ['School starts at eight.', true, 'School starts at eight.']] },
    { titel: 'A day at the zoo', text: 'Last Sunday Lena and her grandpa went to the zoo. It was sunny and warm. First they saw the lions. Then they watched the monkeys. The monkeys were very funny! At twelve o’clock they had sandwiches and apple juice. In the afternoon it started to rain, so they went home. Lena was tired but happy.',
      fragen: [['Who went to the zoo?', 'Lena and her grandpa', ['Lena and her mum', 'Lena and her friends'], 'Last Sunday Lena and her grandpa went to the zoo.'],
        ['What did they see first?', 'the lions', ['the monkeys', 'the elephants'], 'First they saw the lions.'],
        ['What did they have for lunch?', 'sandwiches', ['pizza', 'ice cream'], 'At twelve o’clock they had sandwiches and apple juice.'],
        ['Why did they go home?', 'It started to rain.', ['Lena was ill.', 'The zoo closed.'], 'In the afternoon it started to rain, so they went home.']],
      stimmt: [['The monkeys were funny.', true, 'The monkeys were very funny!'], ['It was cold in the morning.', false, 'It was sunny and warm.']] },
    { titel: 'My room', text: 'This is my room. My bed is next to the window. There is a big shelf behind the door. My books are on the shelf. My desk is between the bed and the cupboard. Under my desk there is a box with my old toys. On the wall there is a poster of my favourite football team. I love my room!',
      fragen: [['Where is the bed?', 'next to the window', ['behind the door', 'under the desk'], 'My bed is next to the window.'],
        ['Where are the books?', 'on the shelf', ['in the box', 'under the bed'], 'My books are on the shelf.'],
        ['What is under the desk?', 'a box with old toys', ['a poster', 'the books'], 'Under my desk there is a box with my old toys.']],
      stimmt: [['The shelf is behind the door.', true, 'There is a big shelf behind the door.'], ['The desk is next to the window.', false, 'My desk is between the bed and the cupboard.']] },
    { titel: 'At the market', text: 'On Saturday mornings Mr Brown goes to the market. He buys apples, carrots and potatoes. The apples are one pound twenty a kilo. Today he also wants some cheese, but there isn’t any cheese. So he buys some eggs. He pays five pounds and goes home.',
      fragen: [['When does Mr Brown go to the market?', 'on Saturday mornings', ['on Sunday evenings', 'every day'], 'On Saturday mornings Mr Brown goes to the market.'],
        ['What isn’t there today?', 'cheese', ['eggs', 'apples'], 'Today he also wants some cheese, but there isn’t any cheese.'],
        ['How much does he pay?', 'five pounds', ['one pound twenty', 'ten pounds'], 'He pays five pounds and goes home.']],
      stimmt: [['Mr Brown buys some eggs.', true, 'So he buys some eggs.'], ['The apples are two pounds a kilo.', false, 'The apples are one pound twenty a kilo.']] },
  ];
  const AL_ART = { 'e5-a-hallo': 'Hallo', 'e5-a-klasse': 'Unterricht', 'e5-a-laden': 'Einkaufen', 'e5-a-weg': 'Weg' };
  const alPaarLoesung = (x) => `<span lang="en">${x.frage}</span> ${U.say(x.frage)}<br>→ <b class="vb" lang="en">${x.antwort}</b> ${U.say(x.antwort)}<br><small>Auf Deutsch: ${x.de}</small>`;
  const ALT = {
    aAntwort(F) { const x = pick(F.P), ch = shuffle([x.antwort, ...x.falsch]); return { prompt: `Was passt als Antwort?${en(x.frage)}`, choices: ch.map((c) => `<span lang="en">${c}</span>`), correct: ch.indexOf(x.antwort), hint: F.tipp, solution: alPaarLoesung(x), ex: { mode: 'dialog', i: F.P.indexOf(x) } }; },
    aHoeren(F) { const x = pick(F.P), ch = shuffle([x.antwort, ...x.falsch]); return { prompt: `Hör zu: Was antwortest du? ${U.say(x.frage)}`, choices: ch.map((c) => `<span lang="en">${c}</span>`), correct: ch.indexOf(x.antwort), hint: 'Tippe auf den Lautsprecher. Du kannst die Frage so oft hören, wie du willst.', solution: alPaarLoesung(x), ex: { mode: 'dialog', i: F.P.indexOf(x) } }; },
    aSituation(F) { const x = pick(F.S), ch = shuffle([x.richtig, ...x.falsch]); return { prompt: `${x.de} Was sagst du?`, choices: ch.map((c) => `<span lang="en">${c}</span>`), correct: ch.indexOf(x.richtig), hint: F.tipp, solution: `<b class="vb" lang="en">${x.richtig}</b> ${U.say(x.richtig)}<br><small>${x.de}</small>`, ex: { mode: 'situation', i: F.S.indexOf(x) } }; },
    aLuecke(F) {
      const x = pick(F.L), [a, b] = x.satz.split('___');
      return { prompt: 'Welches Wort fehlt?', layout: 'satz', fields: [{ type: 'text', ci: true, answer: x.antwort, prefix: a.trim(), suffix: b.trim(), label: 'fehlendes Wort' }], hint: F.tipp, solution: `<span lang="en">${x.satz.replace('___', `<b class="vb">${x.antwort[0]}</b>`)}</span> ${U.say(x.text)}<br><small>Auf Deutsch: ${x.de}</small>`, ex: { mode: 'luecke', i: F.L.indexOf(x) } };
    },
  };
  // besondere Aufgaben
  function anweisung() {
    const x = pick(ANW), ch = shuffle([x, ...shuffle(ANW.filter((y) => y !== x)).slice(0, 2)]);
    return { prompt: `Die Lehrerin sagt: ${en(x.e)} Was sollst du tun?`, choices: ch.map((y) => y.de), correct: ch.indexOf(x), hint: 'open = öffnen · close = schließen · listen = zuhören · write = schreiben · read = lesen · stand up = aufstehen · sit down = sich hinsetzen', solution: `<b class="vb" lang="en">${x.e}</b> ${U.say(x.e)}<br>= ${x.de}`, ex: { mode: 'anweisung', e: x.e } };
  }
  function preisLesen() {
    const x = pick(PREISE), andere = shuffle(PREISE.filter((y) => y !== x && y.zeichen !== x.zeichen)).slice(0, 2), ch = shuffle([x, ...andere]);
    return { prompt: `Was kostet es? Wie sagt man den Preis?`, figure: `<svg viewBox="0 0 360 120" role="img" aria-label="Preisschild"><path d="M90 20h170l40 40-40 40H90z" fill="#fff6d6" stroke="#2b2440" stroke-width="3" stroke-linejoin="round"/><circle cx="270" cy="60" r="7" fill="none" stroke="#2b2440" stroke-width="3"/><text x="170" y="76" text-anchor="middle" style="font:800 44px Nunito,system-ui,sans-serif;fill:#2b2440">${x.zeichen}</text></svg>`, choices: ch.map((y) => `<span lang="en">${y.text}</span>`), correct: ch.indexOf(x), hint: '£ heißt pound (Mehrzahl pounds), p heißt pence. £2.50 sagt man „two pounds fifty“.', solution: `${x.zeichen} = <b class="vb" lang="en">${x.text}</b> ${U.say(x.satz)}<br>Erst die Pfund (pounds), dann die Pence. Das Wort „pence“ lässt man nach den Pfund meist weg.`, ex: { mode: 'preis', zeichen: x.zeichen } };
  }
  function preisHoeren() {
    const x = pick(PREISE.filter((y) => y.l > 0 && y.p >= 10)), falsch = [`£${x.p}.${String(x.l).padStart(2, '0')}`, `£${x.l + 1}.${String(x.p).padStart(2, '0')}`];
    const ch = shuffle([x.zeichen, ...[...new Set(falsch)].filter((f) => f !== x.zeichen)]);
    return { prompt: `Hör zu: Was kostet es? ${U.say(x.satz)}`, choices: ch, correct: ch.indexOf(x.zeichen), hint: 'Erst kommen die Pfund (pounds), dann die Pence. Achte auf -teen und -ty: fifteen = 15, fifty = 50.', solution: `<b class="vb" lang="en">${x.satz}</b> ${U.say(x.satz)}<br>= ${x.zeichen}`, ex: { mode: 'preis', zeichen: x.zeichen } };
  }
  function wegBild() {
    const w = pick(WEGE), ch = shuffle([w, ...shuffle(WEGE.filter((y) => y !== w)).slice(0, 2)]);
    return { prompt: 'Wie kommst du zum Stern? Welcher Satz passt?', figure: wegKarte(w), choices: ch.map((y) => `<span lang="en">${y.satz}</span>`), correct: ch.indexOf(w), hint: 'Du gehst von unten los. first = die erste Straße, second = die zweite. left = links, right = rechts.', solution: `<b class="vb" lang="en">${w.satz}</b> ${U.say(w.satz)}<br>${w.de}`, ex: { mode: 'weg', k: w.k } };
  }
  function wegHoeren() {
    const w = pick(WEGE), ch = shuffle([w, ...shuffle(WEGE.filter((y) => y !== w)).slice(0, 2)]);
    return { prompt: `Hör zu: Wo ist das Ziel? ${U.say(w.satz)}`, choices: ch.map((y) => y.de), correct: ch.indexOf(w), hint: 'first = erste, second = zweite, left = links, right = rechts, straight on = geradeaus.', solution: `<b class="vb" lang="en">${w.satz}</b> ${U.say(w.satz)}<br>= ${w.de}`, ex: { mode: 'weg', k: w.k } };
  }
  // Lesen
  const LESE = LT.flatMap((t, ti) => [
    ...t.fragen.map(([frage, richtig, falsch, beleg], qi) => ({ ti, qi, art: 'frage', frage, richtig, falsch, beleg })),
    ...t.stimmt.map(([satz, wahr, beleg], si) => ({ ti, qi: 100 + si, art: 'stimmt', frage: satz, richtig: wahr ? 'Ja, das stimmt.' : 'Nein, das stimmt nicht.', falsch: [wahr ? 'Nein, das stimmt nicht.' : 'Ja, das stimmt.'], beleg, wahr })),
  ]);
  function lesen() {
    const x = pick(LESE), t = LT[x.ti], ch = x.art === 'stimmt' ? ['Ja, das stimmt.', 'Nein, das stimmt nicht.'] : shuffle([x.richtig, ...x.falsch]);
    return {
      prompt: `Lies den Text <b>„${t.titel}“</b> ${U.say(t.text)} ${x.art === 'stimmt' ? `Stimmt das? <b lang="en">${x.frage}</b>` : `<b lang="en">${x.frage}</b>`}<div class="bsp" lang="en" style="font-size:.92em;line-height:1.45;margin-top:8px">${t.text}</div>`,
      choices: ch.map((c) => (x.art === 'stimmt' ? c : `<span lang="en">${c}</span>`)), correct: ch.indexOf(x.richtig),
      hint: 'Suche im Text nach den Wörtern aus der Frage. Die Antwort steht meist im selben Satz.',
      solution: `Im Text steht: <b lang="en">${x.beleg}</b><br>${x.art === 'stimmt' ? `Deshalb: <b>${x.richtig}</b>` : `Antwort: <b class="vb" lang="en">${x.richtig}</b>`}<br><small>Den ganzen Text kannst du dir anhören: ${U.say(t.text)}</small>`,
      ex: { mode: 'lesen', ti: x.ti, qi: x.qi },
    };
  }
  const alGen = (id, extra) => () => { const F = AL[id]; return U.wahl([[22, () => ALT.aAntwort(F)], [14, () => ALT.aHoeren(F)], [22, () => ALT.aSituation(F)], [18, () => ALT.aLuecke(F)], ...extra]); };
  Object.assign(D.daten, { AL, ANW, PREISE, WEGE, wegKarte, LT, LESE });
  const themenVorAlltag = D.audioThemen;
  D.audioThemen = () => Object.assign(themenVorAlltag(),
    Object.fromEntries(Object.values(AL).map((F) => [F.id, [...F.P.flatMap((x) => [x.frage, x.antwort]), ...F.S.map((x) => x.richtig), ...F.L.map((x) => x.text),
      ...(F.id === 'e5-a-klasse' ? ANW.map((x) => x.e) : []), ...(F.id === 'e5-a-laden' ? PREISE.map((x) => x.satz) : []), ...(F.id === 'e5-a-weg' ? WEGE.map((x) => x.satz) : [])]])),
    { 'e5-a-lesen': LT.map((t) => t.text) });
  for (const id of Object.keys(AL)) D.arten[id] = Object.fromEntries(Object.keys(ALT).map((k) => [k, () => ALT[k](AL[id])]));
  Object.assign(D.arten['e5-a-klasse'], { anweisung });
  Object.assign(D.arten['e5-a-laden'], { preisLesen, preisHoeren });
  Object.assign(D.arten['e5-a-weg'], { wegBild, wegHoeren });
  D.arten['e5-a-lesen'] = { lesen };

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
        { id: 'e5-have', title: 'have got und has got', icon: '🎒', gen: haveGot },
        { id: 'e5-a-an', title: 'a oder an', icon: '🍎', gen: aOderAn },
        { id: 'e5-plural', title: 'Mehrzahl: one box, two boxes', icon: '📦', gen: mehrzahl },
        { id: 'e5-there', title: 'there is und there are', icon: '👀', gen: thereIs },
        { id: 'e5-this', title: 'this, that, these, those', icon: '👉', gen: dieseJene },
        { id: 'e5-poss', title: 'my, your, his, her …', icon: '🎁', gen: possessiv },
        { id: 'e5-gen', title: 'Wem gehört es? ’s und of', icon: '🏷️', gen: genitiv },
        { id: 'e5-imp', title: 'Aufforderungen: Open … / Don’t …', icon: '📣', gen: imperativ },
        { id: 'e5-can', title: 'can und must', icon: '💪', gen: canMust },
      ] },
      { id: 'e5-gegenwart', nr: 2, title: 'Sätze in der Gegenwart', topics: [
        { id: 'e5-ps', title: 'present simple: he, she, it – das s muss mit', icon: '🔁', gen: presentSimple },
        { id: 'e5-ps-neg', title: 'present simple: don’t und doesn’t', icon: '🚫', gen: psNeg },
        { id: 'e5-ps-frage', title: 'present simple: Fragen mit do und does', icon: '❔', gen: psFrage },
        { id: 'e5-fragewort', title: 'Fragewörter: who, what, where …', icon: '🔎', gen: fragewoerter },
        { id: 'e5-satzbau', title: 'Satzbau: wer – tut – was – wo – wann', icon: '🧱', gen: satzbau },
        { id: 'e5-oft', title: 'Wie oft? always, often, never', icon: '📅', gen: wieOft },
        { id: 'e5-pp', title: 'present progressive: is playing', icon: '⏱️', gen: progressive },
        { id: 'e5-sp', title: 'simple oder progressive?', icon: '⚖️', gen: simpleProg },
        { id: 'e5-obj', title: 'me, him, her, us, them', icon: '🎯', gen: objektPron },
      ] },
      { id: 'e5-mengen', nr: 3, title: 'Mengen, Ort und Zeit', topics: [
        { id: 'e5-some', title: 'some und any', icon: '🥛', gen: someAny },
        { id: 'e5-much', title: 'much, many, a lot of', icon: '🧮', gen: muchMany },
        { id: 'e5-ort', title: 'Wo? in, on, under, next to …', icon: '🐈', gen: praepOrt },
        { id: 'e5-zeit', title: 'Wann? at, on, in', icon: '🕖', gen: praepZeit },
        { id: 'e5-zahl', title: 'Zahlen, Datum und Uhrzeit', icon: '🔢', gen: zahlenZeit },
      ] },
      { id: 'e5-vergangen', nr: 4, title: 'Was war gestern?', topics: [
        { id: 'e5-was', title: 'was und were', icon: '⏪', gen: wasWere },
        { id: 'e5-ed', title: 'past simple: played, danced, stopped', icon: '📆', gen: pastEd },
        { id: 'e5-irr', title: 'past simple: went, saw, had', icon: '🌀', gen: pastIrr },
      ] },
      { id: 'e5-woerter', nr: 5, title: 'Wörter', topics: [
        { id: 'e5-w-familie', title: 'Familie: mother, father …', icon: '👪', gen: wfGen('e5-w-familie') },
        { id: 'e5-w-haus', title: 'Haus: kitchen, bedroom …', icon: '🏠', gen: wfGen('e5-w-haus') },
        { id: 'e5-w-schule', title: 'Schule: pen, ruler …', icon: '🏫', gen: wfGen('e5-w-schule') },
        { id: 'e5-w-tag', title: 'Mein Tag: get up, go to bed …', icon: '⏰', gen: wfGen('e5-w-tag') },
        { id: 'e5-w-kleidung', title: 'Kleidung: T-shirt, jeans …', icon: '👕', gen: wfGen('e5-w-kleidung') },
        { id: 'e5-w-freizeit', title: 'Freizeit: swim, dance …', icon: '⚽', gen: wfGen('e5-w-freizeit') },
        { id: 'e5-w-tiere', title: 'Tiere: dog, cat …', icon: '🐶', gen: wfGen('e5-w-tiere') },
        { id: 'e5-w-koerper', title: 'Körper: head, hand …', icon: '✋', gen: wfGen('e5-w-koerper') },
        { id: 'e5-w-essen', title: 'Essen und Trinken: bread, milk …', icon: '🍎', gen: wfGen('e5-w-essen') },
        { id: 'e5-w-farben', title: 'Farben: red, blue …', icon: '🎨', gen: wfGen('e5-w-farben') },
        { id: 'e5-w-zeit', title: 'Tage und Jahreszeiten: Monday, summer …', icon: '🗓️', gen: wfGen('e5-w-zeit') },
      ] },
      { id: 'e5-alltag', nr: 6, title: 'Im Alltag', topics: [
        { id: 'e5-a-hallo', title: 'Hallo! How are you?', icon: '👋', gen: alGen('e5-a-hallo', []) },
        { id: 'e5-a-klasse', title: 'Im Unterricht: Sorry, I don’t understand', icon: '🙋', gen: alGen('e5-a-klasse', [[18, anweisung]]) },
        { id: 'e5-a-laden', title: 'Einkaufen: How much is it?', icon: '🛒', gen: alGen('e5-a-laden', [[16, preisLesen], [12, preisHoeren]]) },
        { id: 'e5-a-weg', title: 'Nach dem Weg fragen', icon: '🧭', gen: alGen('e5-a-weg', [[22, wegBild], [12, wegHoeren]]) },
        { id: 'e5-a-lesen', title: 'Lesen: kurze Texte', icon: '📖', gen: lesen },
      ] },
    ],
  };
})();
