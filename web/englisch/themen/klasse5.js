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
      ] },
    ],
  };
})();
