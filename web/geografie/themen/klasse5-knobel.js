/* GeoDax (Geografie) – Klasse 5: Knobel-Aufgaben
 *
 * Schwerere, freiwillige Aufgaben zu allen Themen: ohne Auswahl tippen, die falsche Aussage finden, fünf statt vier
 * Möglichkeiten, ganze Reihen ordnen, schwerere Maßstabsaufgaben. Sie zählen nicht für die Sterne und haben keine Animation.
 * Wird NACH den Themen-Dateien geladen. Genau eine richtige Lösung; mehrere Schreibweisen stehen alle in der Antwortliste.
 * Fakten wie in den Themen-Dateien (faecher/geo/fakten.md).
 */
(function () {
  const D = window.GeoDax, U = D.util;
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
  function passt5(def) {
    const gr = def.kats.map((_, k) => k).filter((k) => def.items.filter((x) => x[1] === k).length >= 4);
    if (!gr.length) return null;
    const k = pick(gr), drin = shuffle(def.items.filter((x) => x[1] === k)).slice(0, 4), raus = pick(def.items.filter((x) => x[1] !== k));
    const ch = shuffle([...drin, raus].map((x) => x[0]));
    return { prompt: 'Vier gehören zusammen. Was <b>passt nicht</b>?', choices: ch, correct: ch.indexOf(raus[0]), hint: def.h,
      solution: `<b>${raus[0]}</b> gehört zu „${def.kats[raus[1]]}“, die anderen zu „${def.kats[k]}“.` };
  }
  // Fünf statt vier Möglichkeiten bei Fragen mit mindestens vier falschen Antworten (sonst ganze Reihe / passt nicht)
  function ausSammlung(id) {
    const b = D.banken[id] || {}, v = [];
    if (b.A) v.push(() => U.aussage('k', b.A, b.h, true));
    if (b.S && passt5(b.S)) v.push(() => passt5(b.S));
    if (b.O) v.push(() => { const e = pick(b.O); const t = U.ordnen('k', e, b.h); delete t.ex; return t; });
    return v;
  }
  const ohneEx = (f) => () => { const t = f(); delete t.ex; return t; };

  // Getippte Antworten je Thema: [Frage, [richtige Schreibweisen], Erklärung]
  const T = {
    'geo5-landschaft': [['Wie heißt eine Landschaft, die der Mensch gestaltet hat?', ['Kulturlandschaft'], 'Felder, Dörfer, Straßen: Fast ganz Deutschland ist Kulturlandschaft.']],
    'geo5-weltall': [['Wie heißt der Planet, der der Sonne am nächsten ist?', ['Merkur', 'der Merkur'], 'Danach kommen Venus, Erde und Mars.'], ['Wie heißt unsere Galaxie?', ['Milchstraße', 'die Milchstraße', 'Milchstrasse'], 'Sie hat Hunderte Milliarden Sterne.']],
    'geo5-tagnacht': [['Wie viele Stunden braucht die Erde für eine Drehung um sich selbst? (Zahl)', ['24', 'vierundzwanzig'], 'Eine Drehung ergibt einen Tag und eine Nacht.'], ['In welcher Himmelsrichtung geht die Sonne auf?', ['Osten', 'im Osten', 'Ost'], 'Weil sich die Erde von West nach Ost dreht.']],
    'geo5-jahreszeiten': [['Wie viele Tage hat ein Schaltjahr? (Zahl)', ['366'], 'Alle vier Jahre gibt es den 29. Februar.'], ['Wie heißt der längste Tag des Jahres bei uns (Fachwort)?', ['Sommersonnenwende', 'Sonnenwende'], 'Um den 21. Juni.']],
    'geo5-abbildungen': [['Wie heißt das verkleinerte Modell der Erde als Kugel?', ['Globus', 'der Globus'], 'Nur auf dem Globus stimmen alle Formen und Größen.']],
    'geo5-kontinente': [['Welcher ist der größte Ozean?', ['Pazifik', 'der Pazifik', 'Pazifischer Ozean', 'Stiller Ozean'], 'Er ist größer als alle Kontinente zusammen.'], ['Auf welchem Kontinent liegt die Sahara?', ['Afrika'], 'Sie ist die größte Trockenwüste der Erde.']],
    'geo5-windrose': [['Welche Himmelsrichtung liegt genau zwischen Süden und Westen?', ['Südwesten', 'Südwest', 'SW'], 'Nebenhimmelsrichtungen setzen sich aus zwei Haupthimmelsrichtungen zusammen.']],
    'geo5-gradnetz': [['Wie heißt der Breitenkreis mit 0°?', ['Äquator', 'der Äquator', 'Aequator'], 'Er teilt die Erde in Nord- und Südhalbkugel.'], ['Durch welchen Ort in London verläuft der Nullmeridian?', ['Greenwich'], 'Dort steht eine Sternwarte.']],
    'geo5-atlas': [['Wie heißt das Verzeichnis aller Namen hinten im Atlas?', ['Register', 'Namensregister', 'das Register'], 'Dort stehen Seite und Planquadrat.']],
    'geo5-luftbild': [['Wie heißt die Erklärung der Zeichen und Farben einer Karte?', ['Legende', 'die Legende', 'Zeichenerklärung'], 'Ohne Legende kann man eine Karte nicht lesen.']],
    'geo5-welt': [['Auf welchem Kontinent liegt der Amazonas-Regenwald?', ['Südamerika'], 'Der größte Regenwald der Erde.'], ['Wie heißt der trockene Streifen am Südrand der Sahara?', ['Sahel', 'Sahelzone', 'die Sahelzone'], 'Dort liegt zum Beispiel Niger.']],
    'geo5-bilder': [['Wie heißt der Teil eines Bildes, der dem Betrachter am nächsten ist?', ['Vordergrund', 'der Vordergrund'], 'Dann folgen Mittelgrund und Hintergrund.']],
    'geo5-regenwald': [['Wie heißt der Fluss mit dem größten Regenwald der Erde?', ['Amazonas', 'der Amazonas'], 'Er fließt durch Südamerika.']],
    'geo5-wueste': [['Wie heißt der trockene Streifen südlich der Sahara?', ['Sahel', 'die Sahelzone', 'Sahelzone'], 'Dort wird es immer trockener.']],
    'geo5-polar': [['Wie heißt der Kontinent am Südpol?', ['Antarktis', 'die Antarktis'], 'Er ist fast ganz von Eis bedeckt.']],
    'geo5-shanghai': [['In welchem Land liegt Shanghai?', ['China'], 'Shanghai liegt an der Mündung des Jangtsekiang.']],
    'geo5-de-lage': [['Wie heißt der höchste Berg Deutschlands?', ['Zugspitze', 'die Zugspitze'], 'Er ist 2962 m hoch.']],
    'geo5-nachbarn': [['Welches Nachbarland Deutschlands ist das kleinste?', ['Luxemburg'], 'Es ist kleiner als das Saarland.'], ['Wie viele Nachbarstaaten hat Deutschland? (Zahl)', ['9', 'neun'], 'So viele wie kein anderes Land der EU.']],
    'geo5-laender': [['Wie heißt die Landeshauptstadt von Mecklenburg-Vorpommern?', ['Schwerin'], 'Nicht Rostock, das ist die größte Stadt des Landes.'], ['Wie heißt die Landeshauptstadt von Schleswig-Holstein?', ['Kiel'], 'Kiel liegt an der Ostsee.'], ['Wie heißt die Landeshauptstadt von Rheinland-Pfalz?', ['Mainz'], 'Mainz liegt am Rhein gegenüber von Wiesbaden.']],
    'geo5-bevoelkerung': [['Wie heißt die Zahl der Einwohner pro km²?', ['Bevölkerungsdichte', 'Bevoelkerungsdichte'], 'Einwohner geteilt durch Fläche.']],
    'geo5-grosslandschaften': [['Welche Großlandschaft liegt zwischen Mittelgebirgsland und Alpen?', ['Alpenvorland', 'das Alpenvorland'], 'Hügelig, mit vielen Seen.']],
    'geo5-gebirge': [['Wie heißt der höchste Berg Sachsens?', ['Fichtelberg', 'der Fichtelberg'], 'Er ist 1215 m hoch.'], ['In welchem Gebirge liegt der Feldberg (1493 m)?', ['Schwarzwald', 'im Schwarzwald'], 'Er ist der höchste Mittelgebirgsberg Deutschlands.']],
    'geo5-berlin': [['In welchem Gebäude tagt der Bundestag?', ['Reichstagsgebäude', 'Reichstag', 'im Reichstag', 'im Reichstagsgebäude'], 'Mit gläserner Kuppel.']],
    'geo5-sachsen': [['Welcher Fluss bildet die Grenze zwischen Sachsen und Polen?', ['Neiße', 'die Neiße', 'Lausitzer Neiße', 'Neisse'], 'An ihr liegt Görlitz.'], ['Welche ist die größte Stadt Sachsens?', ['Leipzig'], 'Rund 620 000 Einwohner.']],
    'geo5-nord-ostsee': [['Welche ist die größte deutsche Insel?', ['Rügen'], 'Rund 926 km².'], ['Welches Meer hat kaum Ebbe und Flut?', ['Ostsee', 'die Ostsee'], 'Sie ist fast ganz von Land umgeben.']],
    'geo5-kuestenformen': [['Wie heißt eine lange, schmale Meeresbucht, die ein Gletscher ausgeschürft hat?', ['Förde', 'die Förde', 'Foerde'], 'Zum Beispiel die Kieler Förde.'], ['Wie heißt die steile Abbruchwand an einer Steilküste?', ['Kliff', 'das Kliff'], 'Zum Beispiel das Rote Kliff auf Sylt.']],
    'geo5-gezeiten': [['Wie heißt der Unterschied zwischen Hoch- und Niedrigwasser?', ['Tidenhub'], 'An der Nordsee 2,5 bis 4 m.'], ['Wie heißt die Zeit, in der das Wasser steigt?', ['Flut', 'die Flut'], 'Das Fallen heißt Ebbe.']],
    'geo5-watt': [['Wie heißt eine Rinne im Watt, in der auch bei Ebbe Wasser fließt?', ['Priel', 'der Priel'], 'Bei Flut füllt sie sich zuerst.']],
    'geo5-kuestenschutz': [['Wie heißt der Damm, der das Land vor dem Meer schützt?', ['Deich', 'der Deich'], 'Mit Gras bewachsen, Schafe halten es kurz.'], ['Wie heißen die Pfahlreihen, die vom Strand ins Meer ragen?', ['Buhnen', 'Buhne'], 'Sie bremsen die Strömung.']],
    'geo5-hafen': [['Wie heißt die genormte Stahlkiste für Waren auf Schiff, Bahn und Lkw?', ['Container', 'der Container'], 'Das Umladen geht so schnell.']],
    'geo5-ruegen': [['Wie heißen die weißen Felsen an der Küste von Rügen?', ['Kreidefelsen', 'Kreideküste', 'Kreide'], 'Im Nationalpark Jasmund.']],
    'geo5-tiefland': [['Wie heißt der feine, fruchtbare Staub in der Börde?', ['Löss', 'Löß', 'Loess'], 'Der Wind hat ihn in der Eiszeit abgelagert.'], ['Wie heißt das fruchtbare Schlickland hinter den Deichen?', ['Marsch', 'die Marsch'], 'Aus Schlick vom Meer.']],
    'geo5-kanaele': [['Wie heißt die Anlage, die Schiffe zwischen zwei Wasserständen hebt und senkt?', ['Schleuse', 'die Schleuse'], 'Oder ein Schiffshebewerk.'], ['Wie heißt der Kanal, der in Magdeburg auf einer Brücke über die Elbe führt?', ['Mittellandkanal', 'der Mittellandkanal'], 'Die Brücke ist 918 m lang.']],
    'geo5-landwirtschaft': [['Wie heißt es, wenn auf einem Feld jedes Jahr andere Pflanzen wachsen?', ['Fruchtwechsel', 'Fruchtfolge'], 'So bleibt der Boden gesund.']],
    'geo5-kohle-entstehung': [['Was entsteht aus Pflanzen, bevor Braunkohle daraus wird?', ['Torf'], 'Pflanzen → Torf → Braunkohle.'], ['Wie heißt eine Schicht Kohle in der Erde?', ['Flöz', 'Kohleflöz', 'Floez'], 'Darüber liegt das Deckgebirge.']],
    'geo5-braunkohle': [['Bis zu welchem Jahr soll Deutschland spätestens aus der Kohle aussteigen? (Zahl)', ['2038'], 'So steht es im Kohleausstiegsgesetz.']],
    'geo5-rekultivierung': [['Wie heißt die Seenlandschaft aus alten Tagebauen südlich von Leipzig?', ['Leipziger Neuseenland', 'Neuseenland'], 'Zum Beispiel der Cospudener See.'], ['Wie nennt man das Wiederherrichten einer Landschaft nach dem Bergbau?', ['Rekultivierung'], 'Es entstehen Seen, Wälder und Felder.']],
    'geo5-stadt': [['Wie viele Grundbedürfnisse des Menschen unterscheidet man in Geografie? (Zahl)', ['7', 'sieben'], 'Wohnen, arbeiten, sich versorgen, sich bilden, sich erholen, am Verkehr teilnehmen, in Gemeinschaft leben.']],
    'geo5-dorf': [['Wie nennt man Menschen, die zur Arbeit in einen anderen Ort fahren?', ['Pendler', 'Pendlerinnen und Pendler', 'Pendlerin'], 'Viele Dorfbewohner pendeln in die Stadt.']],
    'geo5-umland': [['Wie heißt jemand, der zur Arbeit aus einer Stadt hinausfährt (aus Sicht der Stadt)?', ['Auspendler', 'Auspendlerin'], 'Wer hineinfährt, ist ein Einpendler.']],
    'geo5-sektoren': [['In welchem Wirtschaftsbereich arbeiten in Deutschland die meisten Menschen?', ['Dienstleistung', 'Dienstleistungen', 'Dienstleistungsbereich'], 'Etwa drei von vier Erwerbstätigen.']],
    'geo5-ballungsgebiet': [['Wie heißt das größte Ballungsgebiet Deutschlands?', ['Ruhrgebiet', 'das Ruhrgebiet'], 'Über 5 Millionen Menschen.']],
    'geo5-ruhrgebiet': [['Wie heißt ein Steinkohlebergwerk im Ruhrgebiet?', ['Zeche', 'die Zeche'], 'Zollverein in Essen ist Weltkulturerbe.'], ['Wie nennt man den Wandel von Kohle und Stahl zu Dienstleistungen?', ['Strukturwandel'], 'Alte Branchen verschwinden, neue entstehen.']],
    'geo5-diagramme': [['Welches Diagramm zeigt Anteile an einem Ganzen?', ['Kreisdiagramm', 'das Kreisdiagramm'], 'Der ganze Kreis sind 100 %.']],
    'geo5-muenchen': [['Wie heißen die Gründe, warum sich eine Firma an einem Ort ansiedelt?', ['Standortfaktoren', 'Standortfaktor'], 'Harte und weiche.']],
    'geo5-mittelgebirge': [['Wie heißt das Mittelgebirge an der Grenze zwischen Sachsen und Tschechien?', ['Erzgebirge', 'das Erzgebirge'], 'Benannt nach dem Bergbau auf Erze.']],
    'geo5-steigungsregen': [['Wie heißt die dem Wind zugewandte, regenreiche Seite eines Gebirges?', ['Luv', 'Luvseite'], 'Die abgewandte heißt Lee.'], ['Wie heißt die größte Trinkwassertalsperre Sachsens?', ['Eibenstock', 'Talsperre Eibenstock'], 'Sie staut die Zwickauer Mulde.']],
    'geo5-taeler': [['Wie heißt die V-förmige Talform?', ['Kerbtal', 'das Kerbtal', 'V-Tal'], 'Steile Hänge, unten der Fluss.'], ['Wie heißt die Abtragung durch Wasser, Wind oder Eis?', ['Erosion'], 'Das Gegenteil ist die Ablagerung.']],
    'geo5-gesteine': [['Welches Gestein entsteht, wenn Lava erstarrt?', ['Basalt'], 'Am Burgberg Stolpen in Säulen.'], ['Welches gestreifte Gestein ist im Erzgebirge weit verbreitet?', ['Gneis'], 'Es wurde durch Druck und Hitze umgewandelt.']],
    'geo5-elbsandstein': [['Wie heißen die flachen, steilwandigen Berge wie der Lilienstein?', ['Tafelberge', 'Tafelberg'], 'Oben flach wie ein Tisch.'], ['Wie heißt die berühmte Felsbrücke bei Rathen?', ['Bastei', 'Basteibrücke', 'die Bastei'], 'Hoch über dem Elbtal.']],
    'geo5-wald': [['Wie heißt der Freiberger, der 1713 die Nachhaltigkeit beschrieb? (Nachname)', ['Carlowitz', 'von Carlowitz', 'Hans Carl von Carlowitz'], 'Der Bergbau brauchte damals sehr viel Holz.'], ['Wie heißt ein Wald aus Laub- und Nadelbäumen?', ['Mischwald', 'der Mischwald'], 'Er übersteht Sturm und Trockenheit besser.']],
    'geo5-exkursion': [['Wie heißt die Frage, die eine Exkursion beantworten soll?', ['Leitfrage', 'die Leitfrage'], 'Sie steht am Anfang.']],
    'geo5-kartieren': [['Welches Stockwerk kartiert man bei der Gebäudenutzung in der Innenstadt meist?', ['Erdgeschoss', 'das Erdgeschoss', 'EG'], 'Dort sind Läden und Gaststätten.']],
    'geo5-bach': [['Wie heißt das Außenufer einer Flusskurve, an dem der Fluss abträgt?', ['Prallhang', 'der Prallhang'], 'Am Innenufer (Gleithang) lagert er ab.']],
  };
  // Schwerere Rechenaufgaben
  const mass = ohneEx(() => U.massstabRechnen('k', true));
  const rueck = ohneEx(() => U.massstabRueck('k'));
  const diag = ohneEx(() => U.diagramm('k'));
  const EXTRA = { 'geo5-massstab': [mass, mass, rueck], 'geo5-diagramme': [diag, diag], 'geo5-sektoren': [diag] };
  // Karten ohne Auswahl: Landeshauptstadt tippen
  const hauptTipp = () => { const l = pick(Object.keys(D.LAENDER)); return tipp(`Wie heißt die Landeshauptstadt von <b>${l}</b>?`, [D.LAENDER[l][0]], 'Groß- und Kleinschreibung ist egal.', `<b>${D.LAENDER[l][0]}</b>`); };
  EXTRA['geo5-laender'] = [hauptTipp, hauptTipp];

  for (const t of themen()) {
    const v = ausSammlung(t.id).concat(EXTRA[t.id] || []);
    for (const [f, a, w] of T[t.id] || []) v.push(() => tipp(f, a, 'Denk an das Thema. Groß- und Kleinschreibung ist egal.', `<b>${a[0]}</b>: ${w}`));
    K(t.id, ...v);
  }
  D.knobelVarianten = VAR;
})();
