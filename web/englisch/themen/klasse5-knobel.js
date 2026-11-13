/* EnDax (Englisch) – Klasse 5: Knobel-Aufgaben
 *
 * Schwerere, freiwillige Aufgaben zu den Themen (frei ab zwei Sternen, zählen nicht für die Sterne, keine eigene Animation).
 * Jedes Thema bekommt topic.knobel(), das wie topic.gen() eine Aufgabe liefert. Wird NACH themen/klasse5.js geladen.
 * Knobeln heißt hier: Fehler finden, zwei Regeln in einem Satz, Ausnahmen, längere Sätze ordnen, kleine Rätsel.
 * Regel wie überall: genau eine richtige Lösung; wo mehrere Schreibweisen richtig sind, stehen alle in der Antwortliste.
 * Alle Sätze sind selbst geschrieben. Keine Aufnahmen (kein Lautsprecher) in Knobel-Aufgaben.
 */
(function () {
  const D = window.EnDax;
  const U = D.util, { R, pick, shuffle } = U;
  const themen = () => D.grades[5].lbs.flatMap((l) => l.topics);
  const VAR = {};
  function K(id, ...varianten) {
    const t = themen().find((x) => x.id === id);
    if (!t) return;
    let stapel = [];
    VAR[id] = varianten;
    t.knobel = () => { if (!stapel.length) stapel = shuffle(varianten); return stapel.pop()(); };
  }
  const reihum = (liste) => { let s = []; return () => { if (!s.length) s = shuffle(liste); return s.pop(); }; };
  const en = (t) => `<span class="bsp" lang="en">${t}</span>`;
  const E = (t) => `<span lang="en">${t}</span>`;
  const wahl = (prompt, richtig, falsch, hint, solution, deutsch) => { const o = shuffle([richtig, ...falsch]); return { prompt, choices: o.map((c) => (deutsch ? c : E(c))), correct: o.indexOf(richtig), hint, solution }; };
  // 'My brother and I *is at home.' → das Wort mit * ist falsch und wird angetippt
  const fehler = (roh, richtig, warum) => {
    const w = roh.split(' '), i = w.findIndex((x) => x[0] === '*'), tokens = w.map((x) => x.replace('*', ''));
    const korr = tokens.map((x, k) => (k === i ? (richtig ? `<b class="vb">${x.replace(/^[A-Za-z’']+/, richtig)}</b>` : null) : x)).filter((x) => x !== null).join(' ');
    return { prompt: 'In diesem Satz ist <b>ein Wort falsch</b>. Tippe es an.', tap: { tokens, correct: [i], one: true }, hint: 'Lies den Satz Wort für Wort. Wer tut etwas? Passt jedes Wort dazu?', solution: `Falsch: <b>${tokens[i]}</b>. Richtig: <span lang="en">${korr}</span><br>${warum}` };
  };
  const fehlerK = (liste) => { const n = reihum(liste); return () => { const [roh, richtig, warum] = n(); return fehler(roh, richtig, warum); }; };
  // Satz mit ein oder zwei Lücken ___; antworten: Liste je Lücke (jede Lücke: String oder Liste)
  const luecken = (prompt, satz, antworten, hint, solution) => {
    const teile = satz.split('___'), fields = [];
    for (let k = 0; k < teile.length - 1; k++) fields.push({ type: 'text', ci: true, answer: [].concat(antworten[k]), prefix: k === 0 ? teile[0].trim() : '', suffix: teile[k + 1].trim(), label: teile.length > 2 ? `Lücke ${k + 1}` : 'Lücke' });
    return { prompt: `${prompt}`, layout: 'satz', fields, hint, solution };
  };
  const voll = (satz, antworten) => { let k = 0; return satz.replace(/___/g, () => `<b class="vb">${[].concat(antworten[k++])[0]}</b>`); };
  const lueckenK = (prompt, liste, hint) => { const n = reihum(liste); return () => { const [satz, antw, warum, de] = n(); return luecken(`${prompt}${de ? `<br><small>${de}</small>` : ''}`, satz, antw, hint, `<span lang="en">${voll(satz, antw)}</span><br>${warum}`); }; };
  const wahlK = (prompt, liste, hint) => { const n = reihum(liste); return () => { const [satz, richtig, falsch, warum] = n(); return wahl(`${prompt}${satz ? en(satz) : ''}`, richtig, falsch, hint, `<b class="vb" lang="en">${richtig}</b><br>${warum}`); }; };
  const ordneK = (prompt, liste, hint) => { const n = reihum(liste); return () => { const [teile, end, auch, de, warum] = n(); return { prompt: `${prompt}${de ? ` <b>${de}</b>` : ''}`, order: U.ordne(teile, end, auch), hint, solution: `<span lang="en"><b class="vb">${teile.join(' ')}${end}</b></span><br>${warum}` }; }; };

  // =====================================================
  // Bereich 1 – Erste Bausteine
  // =====================================================
  K('e5-be',
    fehlerK([['My brother and I *is at home.', 'are', 'My brother and I sind zwei Personen (wir). Dazu gehört <b>are</b>.'],
      ['The children *is in the park.', 'are', '<b>children</b> ist die Mehrzahl von child. Dazu gehört <b>are</b>.'],
      ['Lisa and her dog *is happy.', 'are', 'Lisa und ihr Hund sind zwei. Dazu gehört <b>are</b>.'],
      ['The book on the table *are mine.', 'is', 'Wer ist gemeint? <b>The book</b>, ein Buch. Dazu gehört <b>is</b>. Der Tisch gehört nur zur Ortsangabe.'],
      ['Tom’s shoes *is new.', 'are', 'Es geht um die <b>shoes</b>, mehrere Schuhe. Dazu gehört <b>are</b>.'],
      ['My cat *are very old.', 'is', 'my cat ist eine Katze (it). Dazu gehört <b>is</b>.']]),
    lueckenK('Setze <b>am, is</b> oder <b>are</b> ein.', [
      ['Ben ___ eleven and his sisters ___ nine.', ['is', 'are'], 'Ben ist einer: is. His sisters sind mehrere: are.'],
      ['___ you and your sister twins?', ['Are'], 'you and your sister sind zwei Personen: <b>Are</b>.'],
      ['Where ___ my keys? And where ___ my phone?', ['are', 'is'], 'my keys sind mehrere: are. my phone ist eins: is.'],
      ['I ___ in class 5 and my friends ___ in class 6.', ['am', 'are'], 'I: am. my friends: are.']], 'Suche zuerst, <b>wer</b> gemeint ist: eine Person oder Sache (is), mehrere (are) oder I (am).'));

  K('e5-pron',
    wahlK('Welches Wort ersetzt den <b>fett gedruckten</b> Teil?', [
      ['<b>My sister and I</b> are at school.', 'We', ['They', 'She', 'I'], 'Ich und noch jemand: das sind <b>wir</b>, also <b>we</b>.'],
      ['<b>You and Lisa</b> are late.', 'You', ['They', 'We', 'She'], 'Du und Lisa, das seid <b>ihr</b>. Ihr heißt auf Englisch auch <b>you</b>.'],
      ['<b>Mr and Mrs Brown</b> are our neighbours.', 'They', ['He', 'We', 'She'], 'Zwei Personen, ohne mich: <b>they</b>.'],
      ['<b>My dad’s car</b> is red.', 'It', ['He', 'They', 'She'], 'Gemeint ist das Auto, eine Sache: <b>it</b>. Papa wird nur genannt, weil es seins ist.'],
      ['<b>The dog and the cat</b> are friends.', 'They', ['It', 'We', 'He'], 'Zwei Tiere, also mehrere: <b>they</b>.']], 'Wer ist gemeint? Eine Person, eine Sache, mehrere – und bin ich dabei?'),
    fehlerK([['*Him is my brother.', 'He', 'Vorn im Satz (wer?) steht <b>he</b>. him steht hinter dem Verb.'],
      ['*Them are my friends.', 'They', 'Vorn im Satz steht <b>they</b>.'],
      ['*Us are in class 5.', 'We', 'Vorn im Satz steht <b>we</b>.'],
      ['*Her likes music.', 'She', 'Vorn im Satz steht <b>she</b>.']]));

  K('e5-be-neg',
    lueckenK('Ergänze die Kurzantwort.', [
      ['Are you and Tom friends? – Yes, ___.', ['we are'], 'Gefragt wird nach dir und Tom, also antwortest du mit <b>we</b>.'],
      ['Is your mum a doctor? – No, ___.', [['she isn’t', 'she’s not', 'she is not']], 'Deine Mama: <b>she</b>. Verneint: she isn’t.'],
      ['Are the books new? – Yes, ___.', ['they are'], 'Die Bücher: <b>they</b>.'],
      ['Is the cat in the garden? – No, ___.', [['it isn’t', 'it’s not', 'it is not']], 'Die Katze: <b>it</b>.'],
      ['Is Mr Brown your teacher? – Yes, ___.', ['he is'], 'Mr Brown: <b>he</b>. In der Ja-Antwort keine Kurzform.']], 'In der Antwort steht ein Pronomen (he, she, it, we, they …), nicht der Name.'),
    wahlK('Welche Antwort ist richtig?', [
      ['Are you hungry?', 'Yes, I am.', ['Yes, I’m.', 'Yes, am I.'], 'Am Ende einer Ja-Antwort steht <b>nie</b> eine Kurzform: Yes, I am. (nicht: Yes, I’m.)'],
      ['Is it cold today?', 'Yes, it is.', ['Yes, it’s.', 'Yes, is it.'], 'Am Ende steht die Langform: Yes, it <b>is</b>.'],
      ['Are they at home?', 'No, they aren’t.', ['No, they not.', 'No, aren’t they.'], 'Bei Nein darf die Kurzform stehen: No, they aren’t.']], 'Kurzantwort: Yes/No, Pronomen, am/is/are. Bei Ja keine Kurzform am Ende.'));

  K('e5-have',
    lueckenK('Setze die richtige Form von <b>have got</b> ein.', [
      ['My sister ___ got two cats, but I ___ got any pets.', ['has', ['haven’t', 'have not']], 'my sister (she): has. I verneint: haven’t.'],
      ['Tom ___ got a bike, but he ___ got a helmet.', ['has', ['hasn’t', 'has not']], 'Tom (he): has, verneint hasn’t.'],
      ['___ your parents got a car? – Yes, they ___.', ['Have', 'have'], 'your parents (they): Have … ? – Yes, they have.'],
      ['___ Lisa got a brother? – No, she ___.', ['Has', ['hasn’t', 'has not']], 'Lisa (she): Has … ? – No, she hasn’t.']], 'he, she, it: has. I, you, we, they: have.'),
    fehlerK([['*Have your brother got a bike?', 'Has', 'your brother ist he. Die Frage beginnt also mit <b>Has</b>.'],
      ['She *haven’t got a pen.', 'hasn’t', 'she: <b>hasn’t</b>.'],
      ['My parents *has got a new car.', 'have', 'my parents sind mehrere: <b>have</b>.'],
      ['Has Tom got a dog? – Yes, he *have.', 'has', 'In der Kurzantwort bleibt es bei he: <b>has</b>.']]));

  K('e5-a-an',
    wahlK('<b>a</b> oder <b>an</b>? Achtung, es zählt der Laut!', [
      ['___ hour', 'an', ['a'], 'Das h in hour spricht man nicht: Das Wort beginnt mit „au“, also <b>an</b>.'],
      ['___ university', 'a', ['an'], 'university spricht man „ju-ni-…“: ein j-Laut, also <b>a</b>.'],
      ['___ uniform', 'a', ['an'], 'uniform beginnt mit „ju“: <b>a</b>.'],
      ['___ honest boy', 'an', ['a'], 'Das h in honest ist stumm (gesprochen „onnest“), also <b>an</b>.'],
      ['___ old horse', 'an', ['a'], 'Es zählt das Wort direkt dahinter: old beginnt mit einem Vokal, also <b>an</b>.'],
      ['___ big apple', 'a', ['an'], 'Direkt dahinter steht big, nicht apple. big beginnt mit b, also <b>a</b>.'],
      ['___ useful book', 'a', ['an'], 'useful beginnt mit „ju“: <b>a</b>.']], 'Sprich das Wort direkt hinter der Lücke laut. Klingt es vorn wie a, e, i, o, u? Dann an.'),
    lueckenK('Setze <b>a</b> oder <b>an</b> ein.', [
      ['I have got ___ apple and ___ banana.', ['an', 'a'], 'apple beginnt mit einem Vokal-Laut: an. banana mit b: a.'],
      ['She has got ___ old bike and ___ new helmet.', ['an', 'a'], 'old: an. new: a.'],
      ['It takes ___ hour to get to ___ university.', ['an', 'a'], 'hour (h stumm): an. university („ju“): a.'],
      ['That’s ___ easy question and ___ good answer.', ['an', 'a'], 'easy: an. good: a.']], 'Es zählt der erste Laut des Wortes direkt hinter der Lücke.'));

  const PL = reihum([['child', 'children'], ['mouse', 'mice'], ['sheep', 'sheep'], ['knife', 'knives'], ['tooth', 'teeth'], ['foot', 'feet'], ['woman', 'women'], ['man', 'men'],
    ['person', 'people'], ['leaf', 'leaves'], ['wolf', 'wolves'], ['potato', 'potatoes'], ['tomato', 'tomatoes'], ['boy', 'boys'], ['baby', 'babies'], ['day', 'days'], ['fish', 'fish']]);
  K('e5-plural',
    () => { const [e, m] = PL(); return luecken(`Schreibe die Mehrzahl von <b lang="en">${e}</b>. Achtung, Ausnahme möglich!`, `one ${e}, two ___`, [m], 'Viele Wörter sind unregelmäßig: child → children, mouse → mice, foot → feet. Bei Vokal + y bleibt das y: boy → boys.', `<span lang="en">one ${e}, two <b class="vb">${m}</b></span><br>${m === e ? 'Dieses Wort bleibt in der Mehrzahl <b>gleich</b>.' : /ves$/.test(m) ? 'Aus f oder fe wird <b>ves</b>.' : /oes$/.test(m) ? 'Bei potato und tomato hängt man <b>-es</b> an.' : /ies$/.test(m) ? 'Konsonant + y: aus y wird <b>ies</b>.' : m === e + 's' ? 'Vor dem y steht ein Vokal, deshalb bleibt das y: einfach <b>-s</b>.' : 'Diese Mehrzahl ist unregelmäßig. Man muss sie lernen.'}`); },
    fehlerK([['I have got two *childs.', 'children', 'Die Mehrzahl von child ist <b>children</b>.'],
      ['There are three *mouses in the kitchen.', 'mice', 'Die Mehrzahl von mouse ist <b>mice</b>.'],
      ['Look at the *sheeps on the hill!', 'sheep', 'sheep bleibt in der Mehrzahl gleich: <b>sheep</b>.'],
      ['The *babys are sleeping.', 'babies', 'Konsonant + y: <b>babies</b>.'],
      ['Two *knifes are on the table.', 'knives', 'Aus fe wird ves: <b>knives</b>.'],
      ['I brush my *tooths every morning.', 'teeth', 'Die Mehrzahl von tooth ist <b>teeth</b>.']]));

  K('e5-there',
    lueckenK('Setze <b>is</b> oder <b>are</b> ein.', [
      ['There ___ a lot of children in the park.', ['are'], 'children ist Mehrzahl: there <b>are</b>.'],
      ['There ___ some milk in the fridge.', ['is'], 'milk kann man nicht zählen: there <b>is</b>.'],
      ['How many people ___ there in your family?', ['are'], 'people ist Mehrzahl: <b>are</b> there.'],
      ['___ there any juice in the bottle?', ['Is'], 'juice kann man nicht zählen: <b>Is</b> there …?'],
      ['There ___ two pencils and a pen on my desk.', ['are'], 'Direkt dahinter stehen two pencils, also Mehrzahl: <b>are</b>.']], 'Schau auf das, was direkt danach kommt: eins oder nicht zählbar → is, mehrere → are.'),
    wahlK('Welcher Satz ist richtig?', [
      ['', 'There are three cats in the garden.', ['There is three cats in the garden.', 'It are three cats in the garden.'], 'Drei Katzen: there <b>are</b>. „Es gibt“ heißt there is/are, nicht it.'],
      ['', 'Is there a bank near here?', ['Are there a bank near here?', 'Is it a bank near here?'], 'Eine Bank: <b>Is there</b> …?'],
      ['', 'There isn’t any bread.', ['There aren’t any bread.', 'It isn’t any bread.'], 'bread kann man nicht zählen: there <b>isn’t</b>.']], 'Es gibt = there is / there are. Mehrere → are.'));

  K('e5-this',
    lueckenK('Setze <b>this, that, these</b> oder <b>those</b> ein.', [
      ['___ shoes here are mine, but ___ shoes over there are Tom’s.', ['These', 'those'], 'Hier und mehrere: these. Dort und mehrere: those.'],
      ['Look at ___ birds up in the sky!', ['those'], 'Weit weg und mehrere: <b>those</b>.'],
      ['___ book in my hand is great.', ['This'], 'Nah (in meiner Hand) und eins: <b>This</b>.'],
      ['Who is ___ man over there?', ['that'], 'Weit weg und einer: <b>that</b>.']], 'nah: this (eins), these (mehrere) · weit weg: that (eins), those (mehrere)'),
    fehlerK([['*This shoes are new.', 'These', 'shoes sind mehrere: <b>These</b>.'],
      ['*That trees over there are very tall.', 'Those', 'trees sind mehrere und weit weg: <b>Those</b>.'],
      ['*These is my bag.', 'This', 'is zeigt: eins. Also <b>This</b>.'],
      ['Can you see *those car over there?', 'that', 'car ist eins und weit weg: <b>that</b>.']]));

  K('e5-poss',
    wahlK('Was gehört in die Lücke?', [
      ['Lisa and Tom love ___ dog.', 'their', ['his', 'her', 'there'], 'Der Hund gehört Lisa und Tom (they): <b>their</b>. there klingt gleich, heißt aber „dort“.'],
      ['I’ve got a cat. ___ name is Tiger.', 'Its', ['It’s', 'His', 'Her'], 'Der Name gehört der Katze (it): <b>Its</b>. It’s heißt „it is“.'],
      ['The bird is sitting in ___ nest.', 'its', ['it’s', 'their', 'our'], 'Das Nest gehört dem Vogel (it): <b>its</b>.'],
      ['___ cold today. Put on your jacket!', 'It’s', ['Its', 'It', 'Is'], 'Gemeint ist „it is cold“: <b>It’s</b>.'],
      ['Mr Brown and I are neighbours. ___ houses are next to each other.', 'Our', ['Their', 'His', 'Your'], 'Mr Brown und ich, das sind wir: <b>Our</b>.']], 'Wem gehört es? it → its (ohne Apostroph!). it’s = it is.'),
    fehlerK([['Tom and Anna are washing *there car.', 'their', 'Gemeint ist „ihr Auto“: <b>their</b>. there heißt „dort“.'],
      ['The dog is playing with *it’s ball.', 'its', 'Der Ball gehört dem Hund: <b>its</b> (ohne Apostroph).'],
      ['Lisa is looking for *his phone.', 'her', 'Das Handy gehört Lisa (she): <b>her</b>.'],
      ['We love *us new teacher.', 'our', 'Zu we gehört <b>our</b>.']]));

  K('e5-gen',
    wahlK('Wie sagt man das auf Englisch?', [
      ['', 'my brothers’ bikes', ['my brother’s bikes', 'my brothers bikes'], 'Mehrere Brüder (brothers) mit s: Der Apostroph kommt <b>hinter</b> das s.'],
      ['', 'the children’s toys', ['the childrens’ toys', 'the childrens toys'], 'children hat kein s am Ende. Deshalb wie im Singular: <b>children’s</b>.'],
      ['', 'my sister’s room', ['my sisters’ room', 'my sisters room'], 'Eine Schwester: <b>sister’s</b>.'],
      ['', 'my parents’ car', ['my parent’s car', 'my parents car'], 'Eltern sind mehrere (parents): <b>parents’</b>.']], 'Ein Besitzer: ’s. Mehrere Besitzer mit s am Ende: nur ’ dahinter. Mehrzahl ohne s (children): ’s.'),
    () => { const [de, r, f, w] = pick([['Die Fahrräder meiner Brüder', 'my brothers’ bikes', ['my brother’s bikes', 'my brothers bikes'], 'mehrere Brüder → brothers’'], ['Das Zimmer meiner Schwester', 'my sister’s room', ['my sisters’ room', 'my sisters room'], 'eine Schwester → sister’s'], ['Die Spielsachen der Kinder', 'the children’s toys', ['the childrens’ toys', 'the childs’ toys'], 'children ohne s → children’s'], ['Das Auto meiner Eltern', 'my parents’ car', ['my parent’s car', 'my parents car'], 'Eltern (mehrere) → parents’']]);
      return wahl(`Wie heißt das auf Englisch? <b>${de}</b>`, r, f, 'Achte darauf, ob es ein Besitzer ist oder mehrere.', `<b class="vb" lang="en">${r}</b><br>${w}`); });

  K('e5-imp',
    fehlerK([['*Doesn’t touch that!', 'Don’t', 'Verbote beginnen immer mit <b>Don’t</b>, auch wenn man mit einer Person spricht.'],
      ['Please *opens the window.', 'open', 'Bei Aufforderungen steht die Grundform: <b>open</b>, ohne s.'],
      ['*Not shout in the classroom, please!', 'Don’t', 'Ein Verbot beginnt mit <b>Don’t</b>.'],
      ['Don’t *running in the corridor!', 'run', 'Hinter Don’t steht die Grundform: <b>run</b>.']]),
    wahlK('Was sagst du?', [
      ['Dein Freund ist im Kino zu laut.', 'Be quiet, please!', ['You quiet, please!', 'Don’t be quiet, please!'], 'Aufforderung mit be: <b>Be quiet, please!</b>'],
      ['Deine Schwester soll nicht traurig sein.', 'Don’t be sad!', ['Not be sad!', 'Be not sad!'], 'Verbot mit be: <b>Don’t be</b> sad!'],
      ['Ein Kind soll sich hinsetzen.', 'Sit down, please.', ['Sits down, please.', 'You sit down please?'], 'Grundform am Anfang: <b>Sit down</b>, please.']], 'Aufforderung: Grundform am Anfang. Verbot: Don’t + Grundform. Auch bei be.'));

  K('e5-can',
    fehlerK([['She can *swims very well.', 'swim', 'Hinter can steht immer die Grundform: <b>swim</b>.'],
      ['He *cans play the piano.', 'can', 'can bekommt nie ein s: he <b>can</b>.'],
      ['I must *to go now.', '', 'Hinter must steht die Grundform ohne to: I must go now. Das Wort <b>to</b> muss weg.'],
      ['She *musts tidy her room.', 'must', 'must bekommt nie ein s: she <b>must</b>.']]),
    lueckenK('Setze <b>can</b> oder <b>can’t</b> ein.', [
      ['Fish ___ swim, but they ___ walk.', ['can', ['can’t', 'cannot', 'can not']], 'Fische können schwimmen (can), aber nicht laufen (can’t).'],
      ['Birds ___ fly, but penguins ___.', ['can', ['can’t', 'cannot', 'can not']], 'Pinguine sind Vögel, können aber nicht fliegen.'],
      ['My baby sister ___ walk yet. She is only six months old.', [['can’t', 'cannot', 'can not']], 'Ein Baby mit sechs Monaten kann noch nicht laufen: <b>can’t</b>.']], 'Überlege: Geht das oder geht das nicht?'));

  // =====================================================
  // Bereich 2 – Gegenwart
  // =====================================================
  K('e5-ps',
    fehlerK([['My dad *work in a bank.', 'works', 'my dad = he: <b>works</b>.'],
      ['Tom and Lisa *plays tennis.', 'play', 'Tom und Lisa sind zwei (they): <b>play</b>, ohne s.'],
      ['She *gos to school by bus.', 'goes', 'go bekommt <b>-es</b>: goes.'],
      ['The baby *crys a lot.', 'cries', 'Konsonant + y: <b>cries</b>.'],
      ['He *watchs TV every evening.', 'watches', 'Nach ch kommt <b>-es</b>: watches.'],
      ['My parents *likes pizza.', 'like', 'my parents = they: <b>like</b>.']]),
    lueckenK('Setze das Verb in der richtigen Form ein.', [
      ['She ___ (fly) to London every summer.', ['flies'], 'Konsonant + y: <b>flies</b>.'],
      ['My uncle ___ (fix) old bikes.', ['fixes'], 'Nach x kommt -es: <b>fixes</b>.'],
      ['My mum ___ (do) yoga on Mondays.', ['does'], 'do wird zu <b>does</b>.'],
      ['Tom ___ (have) a big family.', ['has'], 'have wird zu <b>has</b>.'],
      ['Lisa ___ (play) the guitar.', ['plays'], 'Vokal + y: einfach -s: <b>plays</b>.'],
      ['He ___ (try) very hard.', ['tries'], 'Konsonant + y: <b>tries</b>.']], 'he, she, it: -s. Nach s, sh, ch, x, o: -es. Konsonant + y: -ies.'));

  K('e5-ps-neg',
    fehlerK([['She *don’t like fish.', 'doesn’t', 'she: <b>doesn’t</b>.'],
      ['He doesn’t *plays football.', 'play', 'Hinter doesn’t steht die Grundform: <b>play</b>. Das s steckt schon in does.'],
      ['We *doesn’t live in Berlin.', 'don’t', 'we: <b>don’t</b>.'],
      ['My cat doesn’t *likes water.', 'like', 'Hinter doesn’t: Grundform <b>like</b>.']]),
    lueckenK('Verneine den Satz. Schreibe die beiden fehlenden Wörter.', [
      ['Tom likes apples. → Tom ___ ___ apples.', [['doesn’t', 'does not'], 'like'], 'Tom (he): doesn’t + Grundform like.'],
      ['My sister plays tennis. → My sister ___ ___ tennis.', [['doesn’t', 'does not'], 'play'], 'my sister (she): doesn’t + play.'],
      ['We go to school on Sundays. → We ___ ___ to school on Sundays.', [['don’t', 'do not'], 'go'], 'we: don’t + go.'],
      ['The bus stops here. → The bus ___ ___ here.', [['doesn’t', 'does not'], 'stop'], 'the bus (it): doesn’t + stop.']], 'he, she, it: doesn’t + Grundform. Sonst: don’t + Grundform.'));

  K('e5-ps-frage',
    ordneK('Bilde die Frage:', [
      [['Where', 'does', 'your sister', 'live'], '?', [], 'Wo wohnt deine Schwester?', 'Fragewort – does – wer – Grundform.'],
      [['What time', 'do', 'your parents', 'get up'], '?', [], 'Wann stehen deine Eltern auf?', 'your parents (they): do.'],
      [['Does', 'your dog', 'like', 'cats'], '?', [], 'Mag dein Hund Katzen?', 'your dog (it): Does.'],
      [['How', 'do', 'you', 'go', 'to school'], '?', [], 'Wie kommst du zur Schule?', 'you: do.']], 'Fragewort – do/does – Person – Verb in der Grundform – Rest.'),
    fehlerK([['*Does your parents work in Dresden?', 'Do', 'your parents = they: <b>Do</b>.'],
      ['Does she *likes music?', 'like', 'Hinter does steht die Grundform: <b>like</b>.'],
      ['*Do Tom play the guitar?', 'Does', 'Tom = he: <b>Does</b>.'],
      ['Where *does you live?', 'do', 'you: <b>do</b>.']]));

  K('e5-fragewort',
    wahlK('Welches Fragewort passt zur Antwort?', [
      ['___ shoes are these? – They’re Tom’s.', 'Whose', ['Who', 'Which', 'What'], 'Gefragt wird, <b>wem</b> sie gehören: Whose.'],
      ['___ do you go to school? – By bus.', 'How', ['Where', 'When', 'What'], 'By bus sagt, <b>wie</b>: How.'],
      ['___ brothers have you got? – Two.', 'How many', ['How much', 'How old', 'What'], 'Brüder kann man zählen: <b>How many</b>.'],
      ['___ is the juice? – It’s one pound.', 'How much', ['How many', 'What', 'Which'], 'Nach dem Preis fragt man mit <b>How much</b>.'],
      ['___ are you sad? – Because my cat is ill.', 'Why', ['What', 'How', 'Who'], 'Because antwortet auf <b>Why</b>.'],
      ['___ is your birthday? – In May.', 'When', ['Where', 'What', 'How'], 'In May ist eine Zeit: <b>When</b>.']], 'Schau dir die Antwort genau an: Person, Ort, Zeit, Grund, Menge, Besitzer?'),
    wahlK('Mit welcher Frage fragt man nach dem <b>fett gedruckten</b> Teil?', [
      ['Tom lives <b>in London</b>.', 'Where does Tom live?', ['Who lives in London?', 'When does Tom live?'], 'in London ist ein Ort: <b>Where</b>.'],
      ['<b>Lisa</b> plays the piano.', 'Who plays the piano?', ['What does Lisa play?', 'Who does Lisa play?'], 'Gefragt wird nach der Person vorn im Satz: <b>Who plays</b> …? (ohne does)'],
      ['Lisa plays <b>the piano</b>.', 'What does Lisa play?', ['Who plays the piano?', 'What plays Lisa?'], 'Gefragt wird nach dem Ding: <b>What does Lisa play?</b>'],
      ['The film starts <b>at eight</b>.', 'When does the film start?', ['Where does the film start?', 'When the film starts?'], 'at eight ist eine Zeit: <b>When does</b> … start?']], 'Wer tut etwas (Who …?) – was, wo, wann (Fragewort + do/does).'));

  K('e5-satzbau',
    ordneK('Bringe die Satzteile in die richtige Reihenfolge:', [
      [['My sister', 'plays', 'tennis', 'in the park', 'every Saturday'], '.', ['Every Saturday my sister plays tennis in the park'], 'Meine Schwester spielt jeden Samstag im Park Tennis.', 'wer – tut – was – wo – wann.'],
      [['We', 'often', 'watch', 'films', 'at home'], '.', [], 'Wir schauen oft zu Hause Filme.', 'often steht vor dem Verb.'],
      [['Tom', 'doesn’t', 'like', 'vegetables'], '.', [], 'Tom mag kein Gemüse.', 'wer – doesn’t – Grundform – was.'],
      [['I', 'meet', 'my friends', 'at the station', 'at four'], '.', ['At four I meet my friends at the station'], 'Ich treffe meine Freunde um vier am Bahnhof.', 'Ort (at the station) vor Zeit (at four).']], 'wer – tut – was – wo – wann. Die Zeit darf auch ganz vorn stehen.'),
    wahlK('Welcher Satz ist richtig?', [
      ['', 'I play football every day.', ['I play every day football.', 'Every day play I football.'], 'Das „was“ (football) bleibt direkt beim Verb. Die Zeit kommt ans Ende.'],
      ['', 'She reads a book in bed.', ['She reads in bed a book.', 'In bed reads she a book.'], 'Erst was (a book), dann wo (in bed).'],
      ['', 'Yesterday we went to the zoo.', ['Yesterday went we to the zoo.', 'We went yesterday to the zoo.'], 'Auch wenn die Zeit vorn steht, bleibt es: wer – tut. Anders als im Deutschen!']], 'Im Englischen kommt fast immer zuerst wer, dann das Verb.'));

  K('e5-oft',
    wahlK('Welcher Satz ist richtig?', [
      ['', 'She is always late.', ['She always is late.', 'Always she is late.'], 'Bei am, is, are steht always <b>dahinter</b>.'],
      ['', 'We never eat meat.', ['We eat never meat.', 'We eat meat never.'], 'Bei anderen Verben steht never <b>davor</b>.'],
      ['', 'Tom is often tired.', ['Tom often is tired.', 'Often Tom tired is.'], 'Hinter is: is often.'],
      ['', 'My dad usually cooks on Sundays.', ['My dad cooks usually on Sundays.', 'My dad usually is cooks on Sundays.'], 'Vor dem Verb cooks: usually cooks.']], 'Vor dem Verb – aber hinter am, is, are.'),
    ordneK('Bringe die Wörter in die richtige Reihenfolge:', [
      [['I', 'am', 'never', 'bored'], '.', [], 'Mir ist nie langweilig.', 'Hinter am: am never.'],
      [['My cat', 'sometimes', 'sleeps', 'on my bed'], '.', [], 'Meine Katze schläft manchmal auf meinem Bett.', 'Vor dem Verb: sometimes sleeps.'],
      [['We', 'are', 'always', 'happy', 'on Fridays'], '.', [], 'Freitags sind wir immer fröhlich.', 'Hinter are: are always.']], 'always, often, never … vor dem Verb, aber hinter am, is, are.'));

  K('e5-pp',
    () => { const [b, i] = pick([['lie', 'lying'], ['swim', 'swimming'], ['write', 'writing'], ['run', 'running'], ['come', 'coming'], ['get', 'getting'], ['begin', 'beginning'], ['see', 'seeing'], ['ski', 'skiing'], ['shop', 'shopping'], ['travel', ['travelling', 'traveling']]]);
      const i0 = [].concat(i)[0];
      return luecken(`Schreibe die <b>-ing-Form</b> von <b lang="en">${b}</b>. Achtung, Sonderfälle!`, `${b} → ___`, [i], 'Stummes e fällt weg (write → writing). Kurzer Vokal + Konsonant: verdoppeln (run → running). ie wird zu y (lie → lying).', `<span lang="en">${b} → <b class="vb">${i0}</b></span><br>${b === 'lie' ? 'Aus <b>ie</b> wird <b>y</b>, dann -ing: lying.' : b === 'see' || b === 'ski' ? 'Hier fällt nichts weg: einfach <b>-ing</b>.' : b === 'travel' ? 'Britisch mit ll (travelling), amerikanisch mit einem l (traveling). Beides ist richtig.' : /(.)\1ing$/.test(i0) ? 'Kurzer Vokal und ein Konsonant am Ende: <b>verdoppeln</b>.' : 'Das stumme <b>e</b> fällt weg.'}`); },
    fehlerK([['She is *swim in the pool now.', 'swimming', 'Gerade jetzt: is + <b>-ing</b>: swimming.'],
      ['They *is playing football.', 'are', 'they: <b>are</b> playing.'],
      ['Listen! The baby *crying.', 'is crying', 'Es fehlt is: The baby <b>is crying</b>.'],
      ['I *writeing a letter at the moment.', 'am writing', 'Zwei Fehler in einem Wort: Es fehlt am, und das e fällt weg: <b>am writing</b>.']]));

  K('e5-sp',
    lueckenK('Setze die Verben in der richtigen Form ein.', [
      ['Tom usually ___ (walk) to school, but today he ___ (take) the bus.', ['walks', 'is taking'], 'usually: immer wieder → walks. today: gerade jetzt → is taking.'],
      ['My dad usually ___ (cook) dinner, but tonight my mum ___ (cook).', ['cooks', 'is cooking'], 'usually → cooks. tonight, ausnahmsweise jetzt → is cooking.'],
      ['Lisa ___ (play) the piano every day. Listen! She ___ (play) now.', ['plays', 'is playing'], 'every day → plays. Listen! … now → is playing.'],
      ['We usually ___ (go) to bed at nine, but tonight we ___ (watch) a film.', ['go', 'are watching'], 'usually → go. tonight (jetzt gerade) → are watching.']], 'Immer wieder (usually, every day): einfache Form. Gerade jetzt (now, today, Listen!): am/is/are + -ing.'),
    wahlK('Welcher Satz ist richtig?', [
      ['', 'Look! It is snowing.', ['Look! It snows.', 'Look! It snowing.'], 'Look! zeigt: gerade jetzt → <b>is snowing</b>.'],
      ['', 'We go swimming every Sunday.', ['We are going swimming every Sunday.', 'We goes swimming every Sunday.'], 'every Sunday: immer wieder → <b>go</b>.'],
      ['', 'My brother is sleeping right now.', ['My brother sleeps right now.', 'My brother sleeping right now.'], 'right now: gerade jetzt → <b>is sleeping</b>.']], 'Signalwörter beachten!'));

  K('e5-obj',
    wahlK('Was gehört in die Lücke?', [
      ['Lisa and I are friends. She often helps ___.', 'me', ['I', 'my', 'mine'], 'Hinter dem Verb: <b>me</b>.'],
      ['Where are my keys? I can’t find ___.', 'them', ['they', 'it', 'their'], 'keys sind mehrere, hinter dem Verb: <b>them</b>.'],
      ['Tom is very nice. Do you know ___?', 'him', ['he', 'his', 'them'], 'Tom, hinter dem Verb: <b>him</b>.'],
      ['We need help. Can you help ___?', 'us', ['we', 'our', 'them'], 'wir, hinter dem Verb: <b>us</b>.'],
      ['Is that your new bike? I like ___!', 'it', ['him', 'its', 'them'], 'das Fahrrad, eine Sache: <b>it</b>.']], 'Hinter dem Verb: me, you, him, her, it, us, them.'),
    fehlerK([['Can you help *I, please?', 'me', 'Hinter help: <b>me</b>.'],
      ['I see *they every day.', 'them', 'Hinter see: <b>them</b>.'],
      ['She likes *we very much.', 'us', 'Hinter likes: <b>us</b>.'],
      ['*Him is my best friend.', 'He', 'Vorn im Satz (wer?): <b>He</b>.']]));

  // =====================================================
  // Bereich 3 – Mengen, Ort und Zeit
  // =====================================================
  K('e5-some',
    wahlK('<b>some</b> oder <b>any</b>? Achtung, Ausnahme!', [
      ['Would you like ___ tea?', 'some', ['any'], 'Ausnahme: Bei <b>Angeboten</b> (Would you like …?) steht <b>some</b>, obwohl es eine Frage ist.'],
      ['Can I have ___ water, please?', 'some', ['any'], 'Ausnahme: Bei <b>Bitten</b> (Can I have …?) steht <b>some</b>.'],
      ['There isn’t ___ cheese in the fridge.', 'any', ['some'], 'Verneint: <b>any</b>.'],
      ['Have you got ___ brothers or sisters?', 'any', ['some'], 'Normale Frage: <b>any</b>.']], 'Normal: some in Aussagen, any in Verneinungen und Fragen. Aber: Angebote und Bitten mit some!'),
    fehlerK([['I haven’t got *some money.', 'any', 'Verneint: <b>any</b>.'],
      ['We don’t need *some eggs.', 'any', 'Verneint: <b>any</b>.'],
      ['There aren’t *some apples left.', 'any', 'Verneint: <b>any</b>.']]));

  K('e5-much',
    wahlK('<b>much</b> oder <b>many</b>?', [
      ['How ___ people live in your house?', 'many', ['much'], 'people (Menschen) kann man zählen: <b>many</b>.'],
      ['How ___ homework have you got?', 'much', ['many'], 'homework kann man im Englischen nicht zählen: <b>much</b>. (Im Deutschen sagt man Hausaufgaben in der Mehrzahl!)'],
      ['How ___ hours do you sleep?', 'many', ['much'], 'hours kann man zählen: <b>many</b>.'],
      ['We haven’t got ___ time.', 'much', ['many'], 'time kann man nicht zählen: <b>much</b>.'],
      ['How ___ sandwiches do you want?', 'many', ['much'], 'Sandwiches kann man zählen: <b>many</b>.']], 'Zählbar (one, two …) → many. Nicht zählbar → much.'),
    fehlerK([['How *much apples do you want?', 'many', 'apples kann man zählen: <b>many</b>.'],
      ['I don’t have *many time.', 'much', 'time kann man nicht zählen: <b>much</b>.'],
      ['How *much children are in your class?', 'many', 'children kann man zählen: <b>many</b>.'],
      ['There isn’t *many water in the bottle.', 'much', 'water kann man nicht zählen: <b>much</b>.']]));

  K('e5-ort',
    wahlK('Denk um die Ecke!', [
      ['The cat is in front of the box. So the box is ___ the cat.', 'behind', ['in front of', 'next to', 'under'], 'Steht die Katze vor der Kiste, ist die Kiste <b>hinter</b> der Katze.'],
      ['The ball is behind the tree. So the tree is ___ the ball.', 'in front of', ['behind', 'on', 'between'], 'Andersherum: Der Baum ist <b>vor</b> dem Ball.'],
      ['Tom is next to Lisa. So Lisa is ___ Tom.', 'next to', ['behind', 'in front of', 'between'], 'next to gilt in beide Richtungen.']], 'Stell dir das Bild vor und dreh es um.'),
    wahlK('Lies genau und denk nach.', [
      ['Lisa sits between Tom and Anna. Tom sits on the left. Who sits on the right?', 'Anna', ['Lisa', 'Tom'], 'Links Tom, in der Mitte Lisa (between), rechts also <b>Anna</b>.'],
      ['The book is on the box. The box is under the table. What is directly under the book?', 'the box', ['the table', 'the floor'], 'Das Buch liegt <b>auf der Kiste</b>. Direkt darunter ist also die Kiste.'],
      ['Ben is in front of Tom. Tom is in front of Lisa. Who is at the back?', 'Lisa', ['Ben', 'Tom'], 'Die Reihe von vorn: Ben, Tom, Lisa. Ganz hinten steht also <b>Lisa</b>.']], 'Male dir eine kleine Skizze.'));

  K('e5-zeit',
    wahlK('<b>at, on</b> oder <b>in</b>?', [
      ['___ Saturday morning', 'on', ['in', 'at'], 'Steht ein Tag dabei, gewinnt <b>on</b>: on Saturday morning.'],
      ['___ the morning', 'in', ['on', 'at'], 'Tageszeit ohne Tag: <b>in</b> the morning.'],
      ['___ night', 'at', ['in', 'on'], 'Ausnahme: <b>at</b> night.'],
      ['___ 3rd May', 'on', ['in', 'at'], 'Ein Datum ist ein Tag: <b>on</b>.'],
      ['___ 2025', 'in', ['on', 'at'], 'Jahre: <b>in</b>.'],
      ['___ Christmas Day', 'on', ['in', 'at'], 'Christmas Day ist ein Tag: <b>on</b>.']], 'at: Uhrzeit, night · on: Tage und Daten · in: Monate, Jahre, Jahreszeiten, Tageszeiten.'),
    lueckenK('Setze <b>at, on</b> oder <b>in</b> ein.', [
      ['I get up ___ seven o’clock ___ Mondays.', ['at', 'on'], 'Uhrzeit: at. Wochentag: on.'],
      ['My birthday is ___ 14th July, so it’s ___ summer.', ['on', 'in'], 'Datum: on. Jahreszeit: in.'],
      ['We go skiing ___ winter, usually ___ February.', ['in', 'in'], 'Jahreszeit: in. Monat: in.'],
      ['The film starts ___ half past eight ___ the evening.', ['at', 'in'], 'Uhrzeit: at. Tageszeit: in.']], 'at: Uhrzeit · on: Tag · in: Monat, Jahreszeit, Tageszeit.'));

  const W = D.daten.zahlWort, O = D.daten.ordWort;
  K('e5-zahl',
    () => { const a = R(11, 39), b = R(11, 99 - a); return luecken(`Rechne und schreibe das Ergebnis als englisches Wort: <b lang="en">${W(a)} + ${W(b)}</b>`, '___', [[W(a + b), W(a + b).replace('-', ' ')]], 'Übersetze erst die Zahlen in Ziffern, rechne, und schreibe das Ergebnis wieder als Wort.', `${a} + ${b} = ${a + b} = <b class="vb" lang="en">${W(a + b)}</b>`); },
    wahlK('Denk nach!', [
      ['It’s quarter to nine. The bus comes in thirty minutes. When does the bus come?', 'at quarter past nine', ['at half past nine', 'at quarter to ten'], 'quarter to nine = 8:45. Dreißig Minuten später: 9:15 = <b>quarter past nine</b>.'],
      ['Today is the thirtieth of April. What is the date tomorrow?', 'the first of May', ['the thirty-first of April', 'the first of April'], 'Der April hat nur 30 Tage. Morgen ist also der <b>first of May</b>.'],
      ['School starts at eight o’clock. Lisa is fifteen minutes late. When does she come?', 'at quarter past eight', ['at quarter to eight', 'at half past eight'], '8:00 + 15 Minuten = <b>quarter past eight</b>.'],
      ['It’s half past four. What time was it one hour ago?', 'half past three', ['half past five', 'half past four'], 'half past four = 4:30. Eine Stunde vorher: 3:30 = <b>half past three</b>.']], 'Schreibe dir die Uhrzeit in Ziffern auf. Achtung: half past four = halb fünf.'),
    () => { const n = pick([1, 2, 3, 5, 8, 9, 12, 20, 21, 22, 23, 30, 31]); return luecken(`Schreibe als Wort: <b>der ${n}.</b> (${n}${D.daten.ordEnde(n)})`, '___', [[O(n), O(n).replace('-', ' ')]], 'first, second, third – danach -th. Achtung: fifth, eighth, ninth, twelfth, twentieth.', `${n}${D.daten.ordEnde(n)} = <b class="vb" lang="en">${O(n)}</b>`); });

  // =====================================================
  // Bereich 4 – Vergangenheit
  // =====================================================
  K('e5-was',
    fehlerK([['We *was at the zoo yesterday.', 'were', 'we: <b>were</b>.'],
      ['*Were your sister at home?', 'Was', 'your sister = she: <b>Was</b>.'],
      ['I *were very tired last night.', 'was', 'I: <b>was</b>.'],
      ['The films *was great.', 'were', 'films sind mehrere: <b>were</b>.'],
      ['My parents *was in Italy last summer.', 'were', 'my parents = they: <b>were</b>.']]),
    lueckenK('Ergänze die Kurzantwort.', [
      ['Was it cold yesterday? – Yes, it ___.', ['was'], 'it: was.'],
      ['Were you at school on Monday? – No, I ___.', [['wasn’t', 'was not']], 'I: wasn’t.'],
      ['Were your friends at the party? – Yes, they ___.', ['were'], 'they: were.'],
      ['Was Tom ill? – No, he ___.', [['wasn’t', 'was not']], 'he: wasn’t.']], 'I, he, she, it: was. you, we, they: were.'));

  K('e5-ed',
    fehlerK([['Yesterday I *play football.', 'played', 'Yesterday zeigt: vorbei → <b>played</b>.'],
      ['She *studyed for the test.', 'studied', 'Konsonant + y: <b>studied</b>.'],
      ['We *stoped at the shop.', 'stopped', 'Kurzer Vokal + Konsonant: verdoppeln → <b>stopped</b>.'],
      ['He didn’t *watched TV.', 'watch', 'Hinter didn’t steht die Grundform: <b>watch</b>.'],
      ['They *staied at home.', 'stayed', 'Vokal + y: Das y bleibt → <b>stayed</b>.']]),
    () => { const [b, p] = pick([['carry', 'carried'], ['plan', 'planned'], ['like', 'liked'], ['cry', 'cried'], ['stay', 'stayed'], ['enjoy', 'enjoyed'], ['drop', 'dropped'], ['hurry', 'hurried'], ['play', 'played'], ['shop', 'shopped']]);
      return luecken(`Schreibe die Vergangenheit von <b lang="en">${b}</b>. Achtung bei der Schreibweise!`, `${b} → ___`, [p], 'Konsonant + y → ied. Vokal + y → yed. Kurzer Vokal + Konsonant → verdoppeln. e am Ende → nur d.', `<span lang="en">${b} → <b class="vb">${p}</b></span><br>${/ied$/.test(p) ? 'Vor dem y steht ein Konsonant: aus y wird <b>i</b>.' : /yed$/.test(p) ? 'Vor dem y steht ein Vokal: Das y <b>bleibt</b>.' : /(.)\1ed$/.test(p) ? 'Kurzer Vokal und ein Konsonant: <b>verdoppeln</b>.' : 'Endet auf e: nur <b>d</b>.'}`); });

  K('e5-irr',
    lueckenK('Setze beide Verben in die Vergangenheit. Achtung: eins ist regelmäßig, eins nicht!', [
      ['Yesterday I ___ (go) to the park and ___ (play) football.', ['went', 'played'], 'go → went (unregelmäßig), play → played.'],
      ['Last week we ___ (visit) our grandma and ___ (eat) a big cake.', ['visited', 'ate'], 'visit → visited, eat → ate.'],
      ['On Saturday Tom ___ (buy) a book and ___ (read) it in one day.', ['bought', 'read'], 'buy → bought, read → read (gleich geschrieben, gesprochen „red“).'],
      ['Yesterday Lisa ___ (get) up late and ___ (miss) the bus.', ['got', 'missed'], 'get → got, miss → missed.'],
      ['Last summer we ___ (swim) in the sea and ___ (see) dolphins.', ['swam', 'saw'], 'swim → swam, see → saw. Beide unregelmäßig!']], 'Unregelmäßige Verben musst du kennen: go – went, eat – ate, see – saw, buy – bought …'),
    fehlerK([['I *goed to school by bike.', 'went', 'go ist unregelmäßig: <b>went</b>.'],
      ['She *buyed a new dress.', 'bought', 'buy → <b>bought</b>.'],
      ['We *seed a great film.', 'saw', 'see → <b>saw</b>.'],
      ['He *eated two apples.', 'ate', 'eat → <b>ate</b>.'],
      ['They *maked a cake for me.', 'made', 'make → <b>made</b>.']]));

  // =====================================================
  // Bereich 5 – Wörter: Buchstabensalat und Lückensätze ohne Auswahl
  // =====================================================
  const WF = D.daten.WF;
  const mische = (w) => { let s = w; for (let k = 0; k < 30 && s === w; k++) s = shuffle([...w]).join(''); return s; };
  for (const id of Object.keys(WF)) {
    const F = WF[id], einz = F.W.filter((w) => /^[A-Za-z]{4,}$/.test(w.en));
    const salat = () => { const w = pick(einz), m = mische(w.en.toLowerCase()); return luecken(`Buchstabensalat! Welches Wort steckt darin? <b lang="en" style="letter-spacing:.15em">${m.toUpperCase()}</b><br><small>Tipp auf Deutsch: ${w.de}</small>`, '___', [w.en], 'Sortiere die Buchstaben im Kopf. Der deutsche Tipp verrät dir, welches Wort gesucht ist.', `${m.toUpperCase()} → <b class="vb" lang="en">${w.en}</b> = ${w.de}`); };
    const satz = () => { const s = pick(F.S); return luecken(`Ergänze das fehlende Wort. Es beginnt mit <b lang="en">${s.richtig[0]}</b>.<br><small>${s.de}</small>`, s.satz, [s.richtig], 'Der deutsche Satz verrät dir das Wort.', `<span lang="en">${s.satz.replace('___', `<b class="vb">${s.richtig}</b>`)}</span>`); };
    if (einz.length >= 4) K(id, salat, satz); else K(id, satz);
  }

  D.knobelThemen = () => themen().filter((t) => t.knobel).map((t) => t.id);
  D.knobelVarianten = VAR;
})();
