/* BioDax (Biologie) – Klasse 5: Knobel-Aufgaben
 *
 * Schwerere, freiwillige Aufgaben zu allen Themen: ohne Auswahl tippen, die falsche Aussage finden, fünf statt vier
 * Möglichkeiten, ganze Reihen ordnen. Sie zählen nicht für die Sterne und haben keine Animation.
 * Wird NACH den Themen-Dateien geladen. Wie überall: genau eine richtige Lösung; wo mehrere Schreibweisen gehen,
 * stehen alle in der Antwortliste. Fakten wie in den Themen-Dateien (faecher/bio/fakten.md).
 */
(function () {
  const D = window.BioDax, U = D.util;
  const { pick, shuffle } = U;
  const themen = () => D.grades[5].lbs.flatMap((l) => l.topics);
  const VAR = {};
  function K(id, ...varianten) {
    const t = themen().find((x) => x.id === id);
    if (!t || !varianten.length) return;
    let stapel = [];
    VAR[id] = varianten;
    t.knobel = () => { if (!stapel.length) stapel = shuffle(varianten); return stapel.pop()(); };
  }
  const tipp = (prompt, answer, hint, solution) => ({ prompt: prompt + '<br><i>Ohne Auswahl: Tippe die Antwort.</i>', fields: [{ type: 'text', answer: [].concat(answer), label: 'Antwort', ci: true }], hint, solution });
  // Was passt nicht? Vier aus einer Gruppe, eins aus einer anderen
  function passt5(def) {
    const gr = def.kats.map((_, k) => k).filter((k) => def.items.filter((x) => x[1] === k).length >= 4);
    if (!gr.length) return null;
    const k = pick(gr), drin = shuffle(def.items.filter((x) => x[1] === k)).slice(0, 4), raus = pick(def.items.filter((x) => x[1] !== k));
    const ch = shuffle([...drin, raus].map((x) => x[0]));
    return { prompt: 'Vier gehören zusammen. Was <b>passt nicht</b>?', choices: ch, correct: ch.indexOf(raus[0]), hint: def.h,
      solution: `<b>${raus[0]}</b> gehört zu „${def.kats[raus[1]]}“, die anderen zu „${def.kats[k]}“.` };
  }
  // Aus der Sammlung eines Themas: falsche Aussage finden, 5er-Auswahl, ganze Reihe ordnen
  function ausSammlung(id) {
    const b = D.banken[id] || {}, v = [];
    if (b.A) v.push(() => U.aussage('k', b.A, b.h, true));
    if (b.S && passt5(b.S)) v.push(() => passt5(b.S));
    if (b.O) v.push(() => { const e = pick(b.O); return U.ordnen('k', e, b.h); });
    return v;
  }
  // Getippte Antworten je Thema: [Frage, [richtige Schreibweisen], Erklärung]
  const T = {
    'b5-biologie': [['Wie heißt das Fachwort für eine Vermutung, die man im Versuch prüft?', ['Hypothese'], 'Eine Hypothese ist eine begründete Vermutung.'], ['Welche Naturwissenschaft untersucht Kräfte, Licht und Strom?', ['Physik'], 'Die Physik erforscht die unbelebte Natur.']],
    'b5-kennzeichen': [['Aufnehmen, Umwandeln und Abgeben von Stoffen: Wie heißt dieses Kennzeichen des Lebens?', ['Stoffwechsel'], 'Dazu gehören Ernährung, Atmung und Ausscheidung.'], ['Wie heißt die Pflanze, deren Blättchen bei Berührung zusammenklappen?', ['Mimose', 'Mimosen'], 'Sie zeigt: Auch Pflanzen sind reizbar.']],
    'b5-fisch-bau': [['Mit welchem Organ spürt der Fisch Strömungen?', ['Seitenlinienorgan', 'Seitenlinie'], 'Es verläuft an beiden Körperseiten.'], ['Wie heißen die Tastfäden am Maul des Karpfens?', ['Barteln', 'Bartel', 'Bartfäden'], 'Damit ertastet er Nahrung am Grund.']],
    'b5-fisch-kiemen': [['Welches Gas nehmen die Kiemen aus dem Wasser auf?', ['Sauerstoff'], 'Er ist im Wasser gelöst.'], ['Welches Gas gibt der Fisch an das Wasser ab?', ['Kohlenstoffdioxid', 'Kohlendioxid', 'CO2'], 'Es entsteht im Körper.']],
    'b5-fisch-gewaesser': [['Welcher Wanderfisch kehrt zum Laichen in den Fluss zurück, in dem er geschlüpft ist?', ['Lachs', 'der Lachs', 'Meerforelle'], 'Er findet seinen Heimatfluss am Geruch.'], ['Welcher heimische Fisch baut ein Nest?', ['Stichling', 'der Stichling'], 'Das Männchen bewacht Eier und Junge.']],
    'b5-fisch-fortpfl': [['Wie heißt der Nahrungsvorrat am Bauch der Fischlarve?', ['Dottersack'], 'Er wird in den ersten Tagen aufgebraucht.'], ['Wie nennt man eine Befruchtung außerhalb des Körpers?', ['äußere Befruchtung', 'äussere Befruchtung', 'äußere'], 'Sie findet im Wasser statt.']],
    'b5-fisch-nahrung': [['Wie nennt man das letzte Glied einer Nahrungskette?', ['Endverbraucher', 'Endkonsument'], 'Im See ist das oft der Hecht.'], ['Wie nennt man Pflanzen in der Nahrungskette? (deutsches Wort)', ['Erzeuger'], 'Sie stellen Nährstoffe selbst her.']],
    'b5-fisch-schutz': [['Welcher Wanderfisch wird in Sachsen seit 1995 wieder ausgesetzt?', ['Lachs', 'der Lachs'], '1998 kamen die ersten zurück.'], ['Wie heißt die Zeit, in der eine Fischart nicht gefangen werden darf?', ['Schonzeit'], 'Meist während der Laichzeit.']],
    'b5-lurch-bau': [['Wie heißen Frösche, Kröten und Unken zusammen?', ['Froschlurche'], 'Die erwachsenen Tiere haben keinen Schwanz.'], ['Wie viele Zehen hat ein Frosch an einem Hinterbein? (Zahl)', ['5', 'fünf'], 'Vorn vier Finger, hinten fünf Zehen.']],
    'b5-lurch-beute': [['Wie heißt die Zunge, die der Frosch herausschnellen lässt?', ['Klappzunge'], 'Sie ist vorn im Maul angewachsen.'], ['Wie heißen die Blasen, die das Quaken lauter machen?', ['Schallblasen', 'Schallblase'], 'Nur die Männchen haben sie.']],
    'b5-lurch-haut': [['Welche Drüsen halten die Froschhaut feucht?', ['Schleimdrüsen', 'Schleimdrüse'], 'Nur feuchte Haut kann atmen.'], ['Wie nennt man Tiere, die feuchte Luft brauchen?', ['Feuchtlufttiere', 'Feuchtlufttier'], 'Alle Lurche gehören dazu.']],
    'b5-lurch-arten': [['Welcher Frosch hat Haftscheiben an den Zehen?', ['Laubfrosch', 'der Laubfrosch'], 'Er klettert auf Büsche und Bäume.'], ['Bei welchem Frosch werden die Männchen zur Paarungszeit blau?', ['Moorfrosch', 'der Moorfrosch'], 'Nur für wenige Tage im Frühjahr.']],
    'b5-lurch-bestimmen': [['Warzige Haut, heller Bauch, heller Streifen auf dem Rücken. Welche Art?', ['Kreuzkröte', 'die Kreuzkröte'], 'Ohne Streifen wäre es die Erdkröte.'], ['Glatte Haut, braun, dunkler Fleck hinter dem Auge, keine Haftscheiben. Welche Art?', ['Grasfrosch', 'der Grasfrosch'], 'Grün wäre der Wasserfrosch.']],
    'b5-lurch-entw': [['Wie heißt das Fachwort für die Verwandlung von der Kaulquappe zum Frosch?', ['Metamorphose'], 'Das bedeutet Gestaltwandel.'], ['Wie heißt die durchsichtige Hülle um jedes Froschei?', ['Gallerthülle', 'Gallerte'], 'Sie quillt im Wasser auf.']],
    'b5-lurch-schwanz': [['Welcher heimische Molch wird am größten?', ['Kammmolch', 'der Kammmolch'], 'Bis zu 18 Zentimeter.'], ['Wie heißt das Aussehen der Molche in ihrer Zeit im Wasser?', ['Wassertracht'], 'An Land tragen sie die Landtracht.']],
    'b5-lurch-schutz': [['Wie legt die Erdkröte ihre Eier ab: in Laichballen oder in Laichschnüren?', ['Laichschnüren', 'Laichschnüre', 'in Laichschnüren', 'Schnüren'], 'Die Schnüre werden mehrere Meter lang.'], ['In welcher Jahreszeit wandern die Erdkröten zum Laichgewässer?', ['Frühling', 'Frühjahr', 'im Frühjahr', 'im Frühling'], 'Meist im März.']],
    'b5-kt-vielfalt': [['Wie heißt die einzige heimische Schildkröte?', ['Europäische Sumpfschildkröte', 'Sumpfschildkröte'], 'Sie ist sehr selten.'], ['Wie heißt die größte Echse der Welt?', ['Komodowaran', 'Komododrache'], 'Sie lebt auf wenigen Inseln in Indonesien.']],
    'b5-kt-merkmale': [['Aus welchem Stoff bestehen die Schuppen der Kriechtiere?', ['Horn'], 'Wie unsere Fingernägel.'], ['Wie nennt man Tiere, die trockene Luft gut vertragen?', ['Trockenlufttiere', 'Trockenlufttier'], 'Die Hornhaut schützt vor dem Austrocknen.']],
    'b5-kt-eidechse': [['Welche heimische Eidechse bringt lebende Junge zur Welt?', ['Waldeidechse', 'die Waldeidechse', 'Bergeidechse'], 'Die Eier bleiben im Körper der Mutter.'], ['Welche Echse hat keine Beine?', ['Blindschleiche', 'die Blindschleiche'], 'Sie ist keine Schlange.']],
    'b5-kt-schlange': [['Wie heißt die abgestreifte Haut einer Schlange?', ['Natternhemd'], 'Meist in einem Stück.'], ['Welche heimische Schlange ist giftig?', ['Kreuzotter', 'die Kreuzotter'], 'Erkennbar am Zickzackband.']],
    'b5-kt-fortpfl': [['Wie nennt man es, wenn ein Weibchen die Eier nur an einem günstigen Platz ablegt und dann weggeht?', ['Brutfürsorge'], 'Brutpflege wäre das Betreuen von Eiern oder Jungen.'], ['Wie nennt man eine Befruchtung im Körper des Weibchens?', ['innere Befruchtung', 'innere'], 'So ist es bei allen Kriechtieren.']],
    'b5-kt-schutz': [['Welche seltene Wassernatter wurde bei Meißen wieder angesiedelt?', ['Würfelnatter', 'die Würfelnatter'], 'Sie frisst Fische und ist ungiftig.']],
    'b5-vogel-vielfalt': [['Von welchem Wildhuhn aus Asien stammt das Haushuhn ab?', ['Bankivahuhn'], 'Es lebt in den Wäldern Südostasiens.'], ['Wie nennt man Vögel, die das ganze Jahr bei uns bleiben?', ['Standvögel', 'Standvogel'], 'Zum Beispiel Sperling und Meise.']],
    'b5-vogel-flugbau': [['An welcher Knochenleiste sitzen die Flugmuskeln?', ['Brustbeinkamm'], 'Sie steht wie ein Kiel vom Brustbein ab.'], ['Welche luftgefüllten Anhänge hat die Vogellunge?', ['Luftsäcke', 'Luftsack'], 'Sie reichen bis in manche Knochen.']],
    'b5-vogel-feder': [['Wie heißen die Federn am Schwanz, mit denen der Vogel lenkt?', ['Steuerfedern', 'Steuerfeder'], 'Beim Landen werden sie aufgefächert.'], ['Wie heißt der Federwechsel?', ['Mauser'], 'Alte Federn fallen aus, neue wachsen nach.']],
    'b5-vogel-flug': [['Welche Flugart nutzt aufsteigende Warmluft?', ['Segelflug'], 'Der Vogel kreist und steigt, ohne zu schlagen.'], ['Welcher Falke steht im Rüttelflug über dem Feld?', ['Turmfalke', 'der Turmfalke'], 'Er späht nach Mäusen.']],
    'b5-vogel-schnabel': [['Wie heißt der Schnabel des Spechts?', ['Meißelschnabel'], 'Damit hackt er Holz auf.'], ['Wie nennt man die Füße der Greifvögel?', ['Greiffüße', 'Fänge', 'Greiffuß'], 'Mit ihnen packen sie die Beute.']],
    'b5-vogel-vier': [['Wie heißt das Nahrungssuchen der Ente mit dem Kopf unter Wasser?', ['Gründeln'], 'Der Schwanz zeigt dabei nach oben.'], ['Wie heißt der herzförmige Federkranz im Gesicht der Schleiereule?', ['Gesichtsschleier', 'Schleier'], 'Er leitet den Schall zu den Ohren.']],
    'b5-vogel-ei': [['Wie heißen die Schnüre, die den Dotter in der Mitte halten?', ['Hagelschnüre', 'Hagelschnur'], 'So bleibt die Keimscheibe immer oben.'], ['Womit bricht das Küken die Schale auf?', ['Eizahn', 'mit dem Eizahn'], 'Er fällt später ab.']],
    'b5-vogel-nest': [['Wie nennt man das Aufreißen des Schnabels bei jungen Nesthockern?', ['Sperren'], 'Es löst bei den Eltern das Füttern aus.'], ['Sind Entenküken Nesthocker oder Nestflüchter?', ['Nestflüchter'], 'Sie schwimmen schon am ersten Tag.']],
    'b5-vogel-amsel': [['Wie heißt das Werben eines Männchens um ein Weibchen?', ['Balz'], 'Mit Gesang oder besonderen Bewegungen.'], ['Welche Farbe hat das Amselweibchen?', ['braun', 'dunkelbraun'], 'So ist es auf dem Nest getarnt.']],
    'b5-vogel-schutz': [['Welcher Falke brütet wieder an den Felsen der Sächsischen Schweiz?', ['Wanderfalke', 'der Wanderfalke'], 'Er wurde dort wieder angesiedelt.'], ['Wie heißt die Liste der gefährdeten Arten?', ['Rote Liste'], 'Es gibt sie auch für Sachsen.']],
    'b5-saeuger-vielfalt': [['Von welchem ausgestorbenen Wildrind stammt das Hausrind ab?', ['Auerochse', 'Ur', 'Auerochsen'], 'Der letzte Auerochse starb vor rund 400 Jahren.'], ['Welches Säugetier ist das größte Tier der Erde?', ['Blauwal', 'der Blauwal'], 'Er wird etwa 30 Meter lang.']],
    'b5-saeuger-merkmale': [['Welches Säugetier aus Australien legt Eier?', ['Schnabeltier', 'das Schnabeltier', 'Ameisenigel'], 'Die Jungen trinken trotzdem Milch.'], ['In welchen Drüsen entsteht die Milch?', ['Milchdrüsen', 'Milchdrüse'], 'Daher der Name Säugetier.']],
    'b5-hund': [['Wie viele Zähne hat ein erwachsener Hund? (Zahl)', ['42'], '20 oben, 22 unten.'], ['Wie nennt man Tiere, die nur mit den Zehen auftreten?', ['Zehengänger'], 'Hund und Katze sind Zehengänger.']],
    'b5-katze': [['Von welcher Wildkatze stammt die Hauskatze ab?', ['Falbkatze'], 'Sie lebt in Afrika und Vorderasien.'], ['Wie viele Zähne hat eine erwachsene Katze? (Zahl)', ['30'], 'Ein Raubtiergebiss.']],
    'b5-verstaendigung': [['Wer nimmt ein Signal auf: der Sender oder der Empfänger?', ['Empfänger', 'der Empfänger'], 'Der Sender gibt es ab.'], ['Wie heißt die Ordnung, in der jedes Rudeltier seinen Platz hat?', ['Rangordnung'], 'Sie vermeidet Kämpfe.']],
    'b5-rind': [['In welchem Magenabschnitt findet beim Rind die eigentliche Verdauung statt?', ['Labmagen'], 'Er ist der letzte der vier Abschnitte.'], ['Was sitzt beim Rind im Oberkiefer an der Stelle der Schneidezähne?', ['Hornplatte', 'Kauplatte', 'eine Hornplatte'], 'Dagegen drückt es das Gras.']],
    'b5-schwein': [['Wie heißt das männliche Wildschwein?', ['Keiler'], 'Das Weibchen heißt Bache.'], ['Wie viele Zähne hat ein erwachsenes Schwein? (Zahl)', ['44'], 'So viele wie der Maulwurf.']],
    'b5-gliedmassen': [['Wie heißt die waagerechte Schwanzflosse der Wale?', ['Fluke'], 'Sie schlägt auf und ab.'], ['Wie nennt man Huftiere wie das Pferd, die mit einer Zehe auftreten?', ['Unpaarhufer'], 'Rind und Schwein sind Paarhufer.']],
    'b5-lunge': [['Wie heißt der Austausch von Sauerstoff und Kohlenstoffdioxid in der Lunge?', ['Gasaustausch'], 'Er findet in den Lungenbläschen statt.'], ['Wie heißen die Äste der Luftröhre?', ['Bronchien'], 'Sie verzweigen sich immer feiner.']],
    'b5-saeuger-schutz': [['Welches Raubtier bekommt seit dem Jahr 2000 in der Oberlausitz wieder Junge?', ['Wolf', 'der Wolf'], 'Vorher war er in Deutschland ausgerottet.'], ['Welches Nagetier baut Dämme und Burgen?', ['Biber', 'der Biber'], 'In Sachsen lebt er an Elbe und Mulde.']],
    'b5-tierhaltung': [['Welches Gesetz schreibt vor, dass Tiere ihrer Art entsprechend gehalten werden?', ['Tierschutzgesetz', 'das Tierschutzgesetz'], 'Es gilt für alle, die Tiere halten.']],
    'b5-mensch-skelett': [['Welcher ist der längste Knochen des Menschen?', ['Oberschenkelknochen', 'der Oberschenkelknochen'], 'Er trägt beim Gehen das ganze Körpergewicht.'], ['Wie nennt man Lebewesen, die mit der ganzen Fußsohle auftreten?', ['Sohlengänger'], 'Mensch und Bär sind Sohlengänger.']],
    'b5-mensch-fortpfl': [['Wie heißt das Kind im Mutterleib ab etwa dem dritten Monat bis zur Geburt?', ['Fetus', 'Fötus'], 'Vorher heißt es Embryo.'], ['Wie heißen die Botenstoffe, die die Pubertät auslösen?', ['Hormone', 'Hormon'], 'Sie werden mit dem Blut verteilt.']],
    'b5-schutz': [['Wie lautet die kostenlose Nummer gegen Kummer? (sechs Ziffern)', ['116111', '116 111'], 'Montags bis samstags von 14 bis 20 Uhr, kostenlos und ohne Namen.'], ['Unter wie vielen Jahren stehen Kinder unter dem besonderen Schutz des Gesetzes? (Zahl)', ['14', 'vierzehn'], 'Sexuelle Handlungen an Kindern sind verboten und werden bestraft.']],
    'b5-vergleich': [['Welche Wirbeltierklasse hat Federn?', ['Vögel', 'die Vögel'], 'Nur sie.'], ['Welche Wirbeltierklasse atmet als Larve mit Kiemen und später mit Lungen?', ['Lurche', 'die Lurche', 'Amphibien'], 'Dazwischen liegt die Metamorphose.']],
    'b5-entwicklung': [['Bei welchem Ort in Bayern wurde der Urvogel gefunden?', ['Solnhofen'], 'In feinem Kalkstein blieben sogar die Federn erhalten.'], ['Wie heißt die Wissenschaft, die Fossilien untersucht?', ['Paläontologie'], 'Sie erforscht das Leben früherer Zeiten.']],
    'b5-winter-wechsel': [['Bei wie viel Grad ist Wasser am schwersten? (Zahl)', ['4', 'vier'], 'Deshalb hat das Wasser am Teichgrund etwa vier Grad.']],
    'b5-winter-gleich': [['Wie heißt das Nest des Eichhörnchens?', ['Kobel'], 'Eine Kugel aus Zweigen, innen weich gepolstert.'], ['Wie nennt man das Markieren von Vögeln mit nummerierten Ringen?', ['Beringung', 'Vogelberingung', 'Beringen'], 'So erforscht man den Vogelzug.']],
  };
  for (const t of themen()) {
    const v = ausSammlung(t.id);
    for (const [f, a, w] of T[t.id] || []) v.push(() => tipp(f, a, 'Denk an das Thema. Groß- und Kleinschreibung ist egal.', `<b>${a[0]}</b>: ${w}`));
    K(t.id, ...v);
  }
  D.knobelVarianten = VAR;
})();
