/* GeDax (Geschichte) – Klasse 5: Knobel-Aufgaben
 *
 * Schwerere, freiwillige Aufgaben zu den Themen: ohne Auswahl tippen, die falsche Aussage finden, fünf statt vier
 * Möglichkeiten, längere Reihen, Rechnen mit zwei Schritten. Sie zählen nicht für die Sterne und haben keine Animation.
 * Wird NACH themen/klasse5.js geladen. Wie überall: genau eine richtige Lösung; wo mehrere Schreibweisen gehen,
 * stehen alle in der Antwortliste. Jahreszahlen wie in themen/klasse5.js (nachgeschlagen).
 */
(function () {
  const D = window.GeDax, U = D.util;
  const { R, pick, shuffle } = U;
  const themen = () => D.grades[5].lbs.flatMap((l) => l.topics);
  const VAR = {};
  function K(id, ...varianten) {
    const t = themen().find((x) => x.id === id);
    if (!t || !varianten.length) return;
    let stapel = [];
    VAR[id] = varianten;
    t.knobel = () => { if (!stapel.length) stapel = shuffle(varianten); return stapel.pop()(); };
  }
  const tipp = (prompt, answer, hint, solution, label) => ({ prompt: prompt + '<br><i>Ohne Auswahl: Tippe die Antwort.</i>', fields: [{ type: 'text', answer: [].concat(answer), label: label || 'Antwort', ci: true }], hint, solution });
  const zahl = (prompt, answer, hint, solution, suffix) => ({ prompt, fields: [{ answer, label: 'Zahl', suffix }], hint, solution });
  // Was passt nicht? Vier aus einer Gruppe, eine aus einer anderen
  function passt5(def) {
    const gr = def.kats.map((_, k) => k).filter((k) => def.items.filter((x) => x[1] === k).length >= 4);
    if (!gr.length) return U.passtNicht('k', def);
    const k = pick(gr), drin = shuffle(def.items.filter((x) => x[1] === k)).slice(0, 4), raus = pick(def.items.filter((x) => x[1] !== k));
    const ch = shuffle([...drin, raus].map((x) => x[0]));
    return { prompt: 'Vier gehören zusammen. Was <b>passt nicht</b>?', choices: ch, correct: ch.indexOf(raus[0]), hint: def.h,
      solution: `<b>${raus[0]}</b> gehört zu „${def.kats[raus[1]]}“, die anderen zu „${def.kats[k]}“.` };
  }
  // Aus der Sammlung eines Themas: falsche Aussage finden, 5er-Auswahl, ganze Reihe ordnen
  function ausSammlung(id) {
    const b = D.banken[id] || {}, v = [];
    if (b.A) v.push(() => U.aussage('k', b.A, b.h, true));
    if (b.S) v.push(() => passt5(b.S));
    if (b.O) v.push(() => { const e = pick(b.O); return U.ordnen('k', e, b.h); });
    return v;
  }
  // Getippte Antworten je Thema: [Frage, [richtige Schreibweisen], Erklärung]
  const T = {
    'g5-quellen': [['Wie nennt man einen Text, der heute über die Vergangenheit geschrieben wird?', ['Darstellung'], 'Eine Darstellung entsteht später als die Zeit, über die sie berichtet.'],
      ['Ein Fund im Boden, den man anfassen kann, ist eine …', ['Sachquelle', 'gegenständliche Quelle'], 'Gegenstände sind Sachquellen.']],
    'g5-zeitstrahl': [['Auf das Jahr 1 v. Chr. folgt das Jahr …', ['1 n. Chr.', '1 n.Chr.', '1'], 'Ein Jahr 0 gibt es nicht.']],
    'g5-jh': [['In welchem Jahrhundert liegt 776 v. Chr.? (nur die Zahl)', ['8'], '7 + 1 = 8: das 8. Jahrhundert v. Chr.'], ['In welchem Jahrhundert liegt das Jahr 1206? (nur die Zahl)', ['13'], '12 + 1 = 13: das 13. Jahrhundert.']],
    'g5-epochen': [['Wie heißt der Zeitabschnitt zwischen Altertum und Neuzeit?', ['Mittelalter'], 'Etwa 500 bis 1500.']],
    'g5-mensch': [['Wie heißt der Frühmensch, dessen Name „aufrechter Mensch“ bedeutet? (Homo …)', ['erectus', 'Homo erectus'], 'erectus = aufrecht.'], ['Nach welchem Tal bei Düsseldorf ist eine Menschenform benannt?', ['Neandertal', 'Neanderthal'], 'Dort fand man 1856 Knochen des Neandertalers.']],
    'g5-alt': [['Wie nennt man Menschen, die den Tierherden hinterherziehen?', ['Nomaden', 'Nomade'], 'Sie haben keinen festen Wohnort.']],
    'g5-hoehle': [['Wie heißt die Höhle in Spanien mit den farbigen Bisons?', ['Altamira'], 'Entdeckt 1879.'], ['Wie heißt die französische Höhle, die 1994 entdeckt wurde und über 30.000 Jahre alte Bilder hat?', ['Chauvet', 'Chauvet-Höhle'], 'Benannt nach einem ihrer Entdecker.']],
    'g5-jung': [['Wie nennt man die große Veränderung zu Ackerbau und Viehzucht? (Jungsteinzeitliche …)', ['Revolution'], 'Die Jungsteinzeitliche (Neolithische) Revolution.'], ['Aus welcher Pflanze machten die ersten Bauern Leinen?', ['Flachs', 'Lein'], 'Aus den Fasern des Flachses.']],
    'g5-altjung': [['Welches Zeitalter folgt auf die Jungsteinzeit?', ['Bronzezeit', 'Kupferzeit'], 'Manche Forscher setzen dazwischen noch eine Kupferzeit.']],
    'g5-oetzi': [['In welcher Stadt liegt Ötzi heute im Museum?', ['Bozen', 'Bolzano'], 'Im Südtiroler Archäologiemuseum.'], ['Aus welchem Metall war die Klinge von Ötzis Beil?', ['Kupfer'], 'Ein frühes Metallwerkzeug.']],
    'g5-metall': [['Kupfer und welches Metall ergeben zusammen Bronze?', ['Zinn'], 'Etwa 9 Teile Kupfer, 1 Teil Zinn.']],
    'g5-nebra': [['Wie heißt das Sternbild auf der Himmelsscheibe? (auch Siebengestirn genannt)', ['Plejaden'], 'Die Plejaden sind ein Sternhaufen.'], ['In welchem Bundesland wurde die Himmelsscheibe gefunden?', ['Sachsen-Anhalt'], 'Auf dem Mittelberg bei Nebra.']],
    'g5-nil': [['Wie hieß die Jahreszeit der Ernte am Nil?', ['Schemu'], 'Achet, Peret, Schemu.'], ['In welches Meer mündet der Nil?', ['Mittelmeer'], 'Über ein großes Delta.']],
    'g5-staat': [['Wie hieß der höchste Beamte nach dem Pharao?', ['Wesir'], 'Er leitete die Verwaltung.'], ['Welche Pharaonin ließ einen berühmten Tempel bauen und regierte als Frau?', ['Hatschepsut'], 'Eine der wenigen Frauen auf dem Thron.']],
    'g5-schrift': [['Wie hieß der Franzose, der 1822 die Hieroglyphen entzifferte?', ['Champollion', 'Jean-François Champollion'], 'Mithilfe des Steins von Rosette.'], ['Wie nennt man das Oval um einen Königsnamen?', ['Kartusche'], 'Es half beim Entziffern.']],
    'g5-gesellschaft': [['Wer stand in der Gesellschaftspyramide ganz oben?', ['Pharao', 'der Pharao'], 'Er galt als Gott auf Erden.']],
    'g5-religion-ag': [['Welcher Gott hatte einen Schakalkopf?', ['Anubis'], 'Der Gott der Mumien.'], ['Welcher Gott war der Gott der Schreiber, mit dem Kopf eines Ibis?', ['Thot', 'Thoth'], 'Thot schrieb auch im Totengericht mit.']],
    'g5-jenseits': [['Wie heißen die Krüge, in denen die Organe einer Mumie lagen?', ['Kanopen', 'Kanope'], 'Meist vier Stück.'], ['Welches Organ blieb in der Mumie?', ['Herz', 'das Herz'], 'Es wurde im Totengericht gewogen.']],
    'g5-pyramiden': [['Wie heißt der Pharao der größten Pyramide von Gizeh?', ['Cheops', 'Chufu'], 'Ägyptisch: Chufu.'], ['Wie heißt der Pharao der ältesten großen Pyramide, einer Stufenpyramide?', ['Djoser'], 'In Sakkara, um 2650 v. Chr.']],
    'g5-hochkultur': [['Welcher griechische Reisende schrieb um 450 v. Chr. über Ägypten?', ['Herodot'], 'Er gilt als Vater der Geschichtsschreibung.']],
    'g5-land': [['Wie heißt die Mehrzahl von „Polis“?', ['Poleis'], 'Eine Polis, viele Poleis.'], ['Wie hieß das heutige Istanbul bei den Griechen?', ['Byzantion', 'Byzanz'], 'Später hieß es Konstantinopel.']],
    'g5-olympia': [['Welcher Kaiser verbot 393 n. Chr. die Olympischen Spiele?', ['Theodosius', 'Theodosius I.'], 'Ein christlicher römischer Kaiser.'], ['In welcher Stadt fanden 1896 die ersten Spiele der Neuzeit statt?', ['Athen'], 'Über 1500 Jahre nach dem Ende der antiken Spiele.']],
    'g5-religion-gr': [['Wie heißt der Tempel der Athene auf der Akropolis?', ['Parthenon'], 'Er steht bis heute, als Ruine.'], ['Welcher Gott herrschte über die Unterwelt?', ['Hades'], 'Ein Bruder des Zeus.']],
    'g5-quellen-gr': [['Welches Tier zeigten die Silbermünzen Athens?', ['Eule', 'die Eule'], 'Das Tier der Athene.']],
    'g5-wirtschaft': [['Wie hieß der Marktplatz in Athen?', ['Agora'], 'Treffpunkt der Stadt.']],
    'g5-demokratie': [['Wer stärkte um 508/507 v. Chr. die Demokratie in Athen?', ['Kleisthenes'], 'Er gab den Bürgern mehr Macht.'], ['Wie hieß der Politiker, der Tagegeld (Diäten) einführte?', ['Perikles'], 'So konnten auch Arme mitmachen.']],
    'g5-athen': [['Wie hieß der Sklave, der Jungen zur Schule begleitete?', ['Paidagogos', 'Pädagoge'], 'Daher kommt „Pädagoge“.']],
    'g5-sparta': [['Wie hießen die unfreien Bauern in Sparta?', ['Heloten'], 'Die größte Gruppe.'], ['Auf welcher Halbinsel lag Sparta?', ['Peloponnes'], 'Im Süden Griechenlands.']],
    'g5-vergleich': [['Wie heißt der Krieg zwischen Athen und Sparta (431 bis 404 v. Chr.)?', ['Peloponnesischer Krieg', 'Peloponnesische Krieg'], 'Sparta gewann.']],
    'g5-natur': [['Welcher griechische Gelehrte klagte über kahle Berge in Attika?', ['Platon', 'Plato'], 'Ein berühmter Philosoph aus Athen.']],
  };
  // Rechnen mit zwei Schritten
  const RECHNEN = [
    () => zahl('Die ersten Olympischen Spiele: 776 v. Chr. Die letzten antiken: 393 n. Chr. Wie viele Jahre liegen dazwischen?', 1168, 'Über Christi Geburt hinweg: zusammenzählen und 1 abziehen.', '776 + 393 − 1 = <b>1168</b> Jahre.', 'Jahre'),
    () => zahl('Die letzten antiken Olympischen Spiele: 393 n. Chr. Die ersten der Neuzeit: 1896. Wie viele Jahre dazwischen?', 1503, 'Beide n. Chr.: große minus kleine Zahl.', '1896 − 393 = <b>1503</b> Jahre.', 'Jahre'),
    () => zahl('Ötzi starb um 3300 v. Chr., die Cheops-Pyramide entstand um 2580 v. Chr. Wie viele Jahre später kam die Pyramide ungefähr?', 720, 'Beide v. Chr.: größere minus kleinere Zahl.', '3300 − 2580 = <b>720</b> Jahre.', 'Jahre'),
    () => zahl('Alexander der Große wurde 356 v. Chr. geboren und gründete 331 v. Chr. Alexandria. Wie viele Jahre nach seiner Geburt war das?', 25, 'Beide v. Chr.: größere minus kleinere Zahl.', '356 − 331 = <b>25</b> Jahre.', 'Jahre'),
    () => zahl('Der Stein von Rosette wurde 1799 gefunden, die Hieroglyphen 1822 entziffert. Wie viele Jahre dauerte das Rätsel noch?', 23, 'Große minus kleine Zahl.', '1822 − 1799 = <b>23</b> Jahre.', 'Jahre'),
    () => { const a = R(3, 9) * 100 + R(1, 9) * 10, b = R(1, 19) * 100 + R(1, 9) * 10; return zahl(`Von ${a} v. Chr. bis ${b} n. Chr.: Wie viele Jahre sind das?`, a + b - 1, 'Über Christi Geburt hinweg: zusammenzählen und 1 abziehen.', `${a} + ${b} − 1 = <b>${a + b - 1}</b> Jahre.`, 'Jahre'); },
  ];
  const ZEIT5 = () => {
    const E = shuffle(D.daten.EREIG).slice(0, 5).sort((a, b) => a.j - b.j);
    if (E.some((e, i) => i && e.j - E[i - 1].j < 15)) return ZEIT5();
    const teile = E.map((e) => `${e.t} (${D.daten.J(e.j, e.um)})`);
    return { prompt: 'Ordne <b>fünf</b> Ereignisse nach der Zeit: das Älteste zuerst.', order: { words: U.mische(teile), answer: teile.join(' '), end: '' }, hint: 'Bei v. Chr. ist die größere Zahl älter.', solution: teile.map((x, k) => `${k + 1}. ${x}`).join('<br>') };
  };
  const JH_V = () => { // Jahrhundert v. Chr. als Zahl
    let j; do { j = R(150, 3999); } while (j % 100 === 0 || j % 100 === 1);
    const n = Math.ceil(j / 100);
    return { prompt: `In welchem Jahrhundert liegt <b>${j} v. Chr.</b>?`, fields: [{ answer: n, label: 'Jahrhundert', suffix: '. Jahrhundert v. Chr.' }], hint: 'Letzte zwei Ziffern weg, 1 dazu.', solution: `${Math.floor(j / 100)} + 1 = <b>${n}</b>.` };
  };

  for (const t of themen()) {
    const v = ausSammlung(t.id);
    for (const [f, a, w] of T[t.id] || []) v.push(() => tipp(f, a, 'Denk an das Thema. Groß- und Kleinschreibung ist egal.', `<b>${a[0]}</b>: ${w}`));
    if (t.id === 'g5-rechnen') v.push(...RECHNEN);
    if (t.id === 'g5-zeitstrahl') v.push(ZEIT5, ZEIT5);
    if (t.id === 'g5-jh') v.push(JH_V, JH_V);
    K(t.id, ...v);
  }
  D.knobelVarianten = VAR;
})();
