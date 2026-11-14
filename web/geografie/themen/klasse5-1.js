/* GeoDax – Klasse 5, Bereiche 1 und 2: Geografie – dein neues Fach, Unser Planet Erde
 * (Lehrplan LB 1; TERRA Geographie 5 Sachsen, S. 4–43). Texte selbst geschrieben, Fakten nachgeschlagen (faecher/geo/fakten.md).
 */
(function () {
  const D = window.GeoDax, U = D.util, G = D.gen;
  const { baue, pick, shuffle, R } = U;

  // =====================================================
  // Bereich 1: Geografie – dein neues Fach
  // =====================================================
  G.landschaft = baue('geo5-landschaft', {
    h: 'Eine Naturlandschaft hat der Mensch nicht verändert. In einer Kulturlandschaft sieht man Felder, Straßen, Häuser oder Kanäle.',
    F: [
      { f: 'Womit beschäftigt sich die <b>Geografie</b>?', a: 'mit der Erde, ihren Landschaften und wie Menschen dort leben', x: ['nur mit Pflanzen und Tieren', 'nur mit der Vergangenheit der Menschen', 'mit Zahlen und Formen'], w: '„Geografie“ heißt übersetzt „Erdbeschreibung“. Sie fragt: Wo liegt etwas? Wie sieht es dort aus? Warum leben Menschen so?' },
      { f: 'Was bedeutet das lateinische Wort <b>terra</b>?', a: 'Erde', x: ['Land und Leute', 'Wasser', 'Himmel'], w: 'Daher kommen auch Wörter wie Terrasse oder Territorium.' },
      { f: 'Was ist eine <b>Naturlandschaft</b>?', a: 'eine Landschaft, die der Mensch nicht verändert hat', x: ['eine Landschaft mit vielen Feldern', 'ein Park in der Stadt', 'eine Landschaft mit Bauernhöfen'], w: 'Naturlandschaften gibt es heute vor allem im Hochgebirge, in Urwäldern, Wüsten und an den Polen.' },
      { f: 'Was ist eine <b>Kulturlandschaft</b>?', a: 'eine Landschaft, die der Mensch verändert und gestaltet hat', x: ['eine Landschaft ganz ohne Menschen', 'ein Gebirge mit Gletschern', 'eine Landschaft mit Theatern'], w: 'Felder, Dörfer, Straßen, Kanäle und Städte machen aus der Naturlandschaft eine Kulturlandschaft.' },
      { f: 'Woran erkennst du auf einem Foto sofort eine <b>Kulturlandschaft</b>?', a: 'an Feldern in geraden Formen, Straßen und Häusern', x: ['an Wolken am Himmel', 'an einem Fluss', 'an Bergen im Hintergrund'], w: 'Gerade Linien und Flächen gibt es in der Natur kaum. Sie zeigen: Hier hat der Mensch gearbeitet.' },
      { f: 'Wo in Deutschland findet man noch am ehesten fast unberührte Natur?', a: 'in Nationalparks, zum Beispiel im Wattenmeer oder in der Sächsischen Schweiz', x: ['mitten in Großstädten', 'auf Ackerflächen', 'an Autobahnen'], w: 'In Nationalparks soll sich die Natur möglichst ohne Eingriffe des Menschen entwickeln.' },
      { f: 'Ein Wald wurde abgeholzt und dort ist jetzt ein Weizenfeld. Was ist passiert?', a: 'Aus Naturlandschaft wurde Kulturlandschaft.', x: ['Aus Kulturlandschaft wurde Naturlandschaft.', 'Nichts hat sich verändert.', 'Es ist ein Gebirge entstanden.'], w: 'Der Mensch hat die Landschaft verändert und nutzt sie.' },
      { f: 'Welches Hilfsmittel benutzt du in Geografie, um Orte auf der ganzen Welt zu finden?', a: 'den Atlas', x: ['das Wörterbuch', 'den Taschenrechner', 'das Lineal allein'], w: 'Im Atlas stehen Karten der ganzen Welt, dazu ein Register mit allen Namen.' },
    ],
    S: { kats: ['Naturlandschaft', 'Kulturlandschaft'], f: (b) => `<b>${b}</b>: Natur- oder Kulturlandschaft?`, h: 'Hat hier der Mensch etwas gebaut oder angelegt?',
      items: [['Gletscher im Hochgebirge', 0], ['Urwald am Amazonas', 0], ['Sandwüste ohne Straßen', 0], ['Eis in der Antarktis', 0], ['Weizenfeld', 1], ['Dorf mit Kirche', 1], ['Kanal mit Schleuse', 1], ['Stausee hinter einer Talsperre', 1], ['Obstplantage', 1], ['Braunkohletagebau', 1]] },
    E: { f: 'Ist das eine <b>Natur-</b> oder eine <b>Kulturlandschaft</b>?', arten: [['naturlandschaft', 'Naturlandschaft', 'Keine Felder, keine Häuser, keine Wege: Der Mensch hat hier nichts verändert.'], ['kulturlandschaft', 'Kulturlandschaft', 'Felder, Wege und Häuser zeigen: Hier hat der Mensch die Landschaft gestaltet.']] },
  });

  // =====================================================
  // Bereich 2: Unser Planet Erde
  // =====================================================
  const PLANETEN = ['Merkur', 'Venus', 'Erde', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptun'];
  G.weltall = baue('geo5-weltall', {
    h: 'Die Sonne ist ein Stern. Um sie kreisen acht Planeten. Merksatz: Mein Vater erklärt mir jeden Sonntag unseren Nachthimmel.',
    F: [
      { f: 'Was ist die <b>Sonne</b>?', a: 'ein Stern', x: ['ein Planet', 'ein Mond', 'ein Zwergplanet'], w: 'Sterne leuchten selbst. Die Sonne ist der Stern, der uns am nächsten ist.' },
      { f: 'Was ist die <b>Erde</b>?', a: 'ein Planet', x: ['ein Stern', 'ein Mond', 'eine Galaxie'], w: 'Planeten leuchten nicht selbst. Sie kreisen um einen Stern und werden von ihm angestrahlt.' },
      { f: 'Was ist der <b>Mond</b>?', a: 'ein Begleiter der Erde, der um sie kreist', x: ['ein Stern', 'ein Planet, der um die Sonne kreist', 'ein Teil der Sonne'], w: 'Der Mond umkreist die Erde. Er leuchtet nicht selbst, sondern wird von der Sonne angestrahlt.' },
      { f: 'Wie viele <b>Planeten</b> kreisen um die Sonne?', a: '8', x: ['9', '7', '12'], w: 'Merkur, Venus, Erde, Mars, Jupiter, Saturn, Uranus, Neptun. Pluto gilt seit 2006 als Zwergplanet.' },
      { f: 'Welcher Planet ist der Sonne am <b>nächsten</b>?', a: 'Merkur', x: ['Venus', 'Erde', 'Neptun'], w: 'Der erste Buchstabe im Merksatz: <b>M</b>ein Vater …' },
      { f: 'Welcher Planet ist der <b>dritte</b> von der Sonne aus?', a: 'die Erde', x: ['der Mars', 'die Venus', 'der Jupiter'], w: 'Merkur, Venus, <b>Erde</b>: Mein Vater <b>e</b>rklärt …' },
      { f: 'Warum ist <b>Pluto</b> seit 2006 kein Planet mehr?', a: 'Die Astronomen haben festgelegt, was ein Planet ist. Pluto ist zu klein und teilt seine Bahn mit vielen anderen Körpern.', x: ['Er ist auf die Sonne gestürzt.', 'Er wurde zerstört.', 'Er ist ein Stern geworden.'], w: 'Seit 2006 heißt Pluto Zwergplanet.' },
      { f: 'Leuchtet der Mond selbst?', a: 'Nein, er wird von der Sonne angestrahlt.', x: ['Ja, wie die Sonne.', 'Ja, aber nur nachts.', 'Nein, er wird von der Erde angestrahlt.'], w: 'Der Mond wirft das Sonnenlicht zurück. Darum sehen wir ihn mal ganz und mal nur zum Teil.' },
      { f: 'Wie weit ist die Erde ungefähr von der Sonne entfernt?', a: 'rund 150 Millionen km', x: ['rund 384 000 km', 'rund 40 000 km', 'rund 1 Milliarde km'], w: 'Das Licht der Sonne braucht für diesen Weg etwa 8 Minuten. 384 000 km ist der Weg zum Mond.' },
    ],
    O: [
      { t: 'Ordne die Planeten: der Sonne am nächsten zuerst.', items: PLANETEN, n: 5, w: 'Mein Vater erklärt mir jeden Sonntag unseren Nachthimmel.' },
      { t: 'Ordne nach der Größe: das Größte zuerst.', items: ['Sonne', 'Erde', 'Mond'], w: 'Die Sonne ist viel größer als die Erde, die Erde ist größer als der Mond.' },
    ],
    S: { kats: ['Stern', 'Planet', 'Mond (Begleiter)'], f: (b) => `<b>${b}</b>: Was ist das?`, h: 'Sterne leuchten selbst. Planeten kreisen um einen Stern, Monde um einen Planeten.',
      items: [['Sonne', 0], ['Erde', 1], ['Mars', 1], ['Jupiter', 1], ['Venus', 1], ['Mond der Erde', 2], ['Polarstern', 0], ['Saturn', 1]] },
    T: [
      { f: 'Die Sonne ist kein Planet, sondern ein ___.', a: 'Stern', w: 'Sterne leuchten selbst.' },
      { f: 'Seit 2006 ist Pluto ein ___.', a: ['Zwergplanet', 'Zwerg-Planet'], w: 'Die Astronomen haben festgelegt, was ein Planet ist.' },
    ],
  });

  G.tagNacht = baue('geo5-tagnacht', {
    h: 'Die Erde dreht sich in 24 Stunden einmal um sich selbst, von West nach Ost. Die Seite, die zur Sonne zeigt, hat Tag.',
    F: [
      { f: 'Warum gibt es <b>Tag und Nacht</b>?', a: 'Die Erde dreht sich um sich selbst. Immer eine Hälfte zeigt zur Sonne.', x: ['Die Sonne geht nachts aus.', 'Der Mond schiebt sich nachts vor die Sonne.', 'Die Erde kreist an einem Tag einmal um die Sonne.'], w: 'Die Hälfte, die zur Sonne zeigt, hat Tag. Die andere Hälfte hat Nacht.' },
      { f: 'Wie lange dauert eine <b>Drehung</b> der Erde um sich selbst?', a: 'etwa 24 Stunden', x: ['etwa 12 Stunden', 'etwa 365 Tage', 'etwa einen Monat'], w: 'Eine Drehung ist ein Tag mit Nacht.' },
      { f: 'In welche Richtung dreht sich die Erde?', a: 'von West nach Ost', x: ['von Ost nach West', 'von Nord nach Süd', 'sie dreht sich nicht'], w: 'Darum sieht es so aus, als ginge die Sonne im Osten auf und wandere nach Westen.' },
      { f: 'In welcher Himmelsrichtung geht die Sonne <b>auf</b>?', a: 'im Osten', x: ['im Westen', 'im Norden', 'im Süden'], w: 'Weil sich die Erde nach Osten dreht, kommt die Sonne im Osten in Sicht.' },
      { f: 'In welcher Himmelsrichtung geht die Sonne <b>unter</b>?', a: 'im Westen', x: ['im Osten', 'im Norden', 'im Süden'], w: 'Im Westen dreht sich unser Ort von der Sonne weg.' },
      { f: 'Wo steht die Sonne bei uns zur <b>Mittagszeit</b>?', a: 'im Süden', x: ['im Norden', 'im Osten', 'im Westen'], w: 'In Deutschland steht die Sonne mittags im Süden, darum zeigen Schatten mittags nach Norden.' },
      { f: 'In Dresden ist Mittag. Was ist auf der anderen Seite der Erde, zum Beispiel auf Neuseeland?', a: 'Nacht', x: ['auch Mittag', 'Morgen', 'Abend'], w: 'Neuseeland liegt fast genau auf der anderen Seite der Erde. Dort ist es dann Nacht.' },
      { f: 'Wie nennt man die Drehung der Erde um sich selbst?', a: 'Erdrotation', x: ['Erdumlauf', 'Jahreszeit', 'Schaltjahr'], w: 'Rotation heißt Drehung. Der Weg um die Sonne heißt Umlauf.' },
    ],
    O: [
      { t: 'Ordne die Tageszeiten in Dresden: Die Erde dreht sich weiter …', items: ['Sonnenaufgang im Osten', 'Sonne mittags im Süden', 'Sonnenuntergang im Westen', 'Nacht'], w: 'Die Erde dreht sich von West nach Ost. Die Sonne scheint darum von Osten über Süden nach Westen zu wandern.' },
    ],
    T: [
      { f: 'Die Sonne geht im ___ auf.', a: 'Osten', w: 'Im Osten auf, im Süden ihr Mittagslauf, im Westen geht sie unter.' },
      { f: 'Eine Drehung der Erde dauert etwa ___ Stunden.', a: '24', w: 'Ein Tag und eine Nacht zusammen.' },
    ],
    extra: { tagNachtAnim: () => tagNachtFrage() },
  }, { tagNachtAnim: 12 });
  function tagNachtFrage() {
    const zeiten = [['Mitternacht', 'Dresden liegt mitten auf der Nachtseite.'], ['Sonnenaufgang', 'Dresden dreht sich gerade aus der Nacht in den Tag.'], ['Mittag', 'Dresden zeigt genau zur Sonne.'], ['Sonnenuntergang', 'Dresden dreht sich gerade aus dem Tag in die Nacht.']];
    const k = R(0, 3), ch = shuffle(zeiten.map((z) => z[0]));
    return { prompt: 'Die Erde von oben (über dem Nordpol). Die Sonne scheint von rechts. Welche Tageszeit ist am roten Punkt?', figure: D.tagNachtBild(k), choices: ch, correct: ch.indexOf(zeiten[k][0]), hint: 'Die helle Hälfte hat Tag. Die Erde dreht sich gegen den Uhrzeigersinn.',
      solution: `<b>${zeiten[k][0]}</b>: ${zeiten[k][1]}`, ex: { mode: 'tagnacht', art: 'tagNachtAnim', k, merk: `<b>${zeiten[k][0]}</b>: ${zeiten[k][1]}` } };
  }

  G.jahreszeiten = baue('geo5-jahreszeiten', {
    h: 'Die Erde braucht ein Jahr für einen Umlauf um die Sonne. Weil die Erdachse schräg steht, ist mal die Nordhalbkugel und mal die Südhalbkugel der Sonne zugeneigt.',
    F: [
      { f: 'Wie lange braucht die Erde für einen Umlauf um die Sonne?', a: 'etwa 365 Tage und 6 Stunden', x: ['genau 365 Tage', 'etwa 24 Stunden', 'etwa 30 Tage'], w: 'Die 6 Stunden sammeln sich: Nach vier Jahren ist ein ganzer Tag zusammengekommen.' },
      { f: 'Warum gibt es alle vier Jahre einen <b>29. Februar</b>?', a: 'Weil ein Umlauf etwa 6 Stunden länger dauert als 365 Tage: 4 · 6 Stunden = 1 Tag.', x: ['Weil der Februar sonst zu kurz wäre.', 'Weil sich die Erde schneller dreht.', 'Weil der Mond es so will.'], w: 'Dieses Jahr mit 366 Tagen heißt Schaltjahr.' },
      { f: 'Was ist der Grund für die <b>Jahreszeiten</b>?', a: 'Die Erdachse steht schräg. Darum treffen die Sonnenstrahlen im Jahr unterschiedlich steil auf.', x: ['Im Sommer ist die Erde viel näher an der Sonne.', 'Die Sonne leuchtet im Sommer stärker.', 'Der Mond verdeckt im Winter die Sonne.'], w: 'Im Januar ist die Erde der Sonne sogar am nächsten – trotzdem ist bei uns Winter.' },
      { f: 'Wie viel Grad ist die Erdachse ungefähr geneigt?', a: 'etwa 23,5 Grad', x: ['etwa 90 Grad', 'gar nicht', 'etwa 45 Grad'], w: 'Diese Schräglage bleibt das ganze Jahr gleich, die Achse zeigt immer in dieselbe Richtung.' },
      { f: 'Bei uns ist Sommer. Welche Jahreszeit ist dann in <b>Australien</b>?', a: 'Winter', x: ['auch Sommer', 'Frühling', 'Herbst'], w: 'Australien liegt auf der Südhalbkugel. Ist der Norden der Sonne zugeneigt, ist der Süden abgewandt.' },
      { f: 'Wie stehen die Sonnenstrahlen im <b>Sommer</b> bei uns?', a: 'steil, darum wärmen sie stark', x: ['flach, darum wärmen sie stark', 'steil, darum wärmen sie kaum', 'gar nicht'], w: 'Steile Strahlen bündeln die Wärme auf eine kleine Fläche. Flache Strahlen verteilen sie.' },
      { f: 'Was gibt es im Winter in den <b>Polargebieten</b>?', a: 'die Polarnacht: Die Sonne geht wochen- oder monatelang nicht auf.', x: ['den Polartag: Die Sonne geht nie unter.', 'besonders lange Sommerferien', 'Ebbe und Flut'], w: 'Im Sommer ist es umgekehrt: Dann gibt es den Polartag.' },
      { f: 'Wie nennt man den Umlauf der Erde um die Sonne?', a: 'Erdrevolution (Umlauf)', x: ['Erdrotation', 'Schaltjahr', 'Polarnacht'], w: 'Rotation = Drehung um sich selbst (Tag), Revolution = Umlauf um die Sonne (Jahr).' },
    ],
    S: { kats: ['Drehung um sich selbst', 'Umlauf um die Sonne'], f: (b) => `<b>${b}</b>: Woher kommt das?`, h: 'Drehung = 1 Tag. Umlauf = 1 Jahr.',
      items: [['Tag und Nacht', 0], ['Sonnenaufgang im Osten', 0], ['24 Stunden', 0], ['Jahreszeiten', 1], ['Schaltjahr', 1], ['365 Tage', 1], ['Sonne wandert über den Himmel', 0], ['Polartag im Sommer', 1]] },
    T: [
      { f: 'Ein Jahr mit 366 Tagen heißt ___.', a: 'Schaltjahr', w: 'Der zusätzliche Tag ist der 29. Februar.' },
    ],
    extra: { jahrAnim: () => jahrFrage() },
  }, { jahrAnim: 12 });
  function jahrFrage() {
    const lagen = [['Sommer', 'Die Nordhalbkugel ist zur Sonne geneigt: steile Strahlen, lange Tage.'], ['Winter', 'Die Nordhalbkugel ist von der Sonne weggeneigt: flache Strahlen, kurze Tage.']];
    const k = R(0, 1), ch = ['Sommer', 'Winter', 'Frühling', 'Herbst'];
    return { prompt: 'Die Sonne steht in der Mitte. Welche Jahreszeit ist auf der <b>Nordhalbkugel</b>, wenn die Erde an der markierten Stelle ist?', figure: D.jahrBild(k), choices: ch, correct: ch.indexOf(lagen[k][0]), hint: 'Schau, ob der Nordpol zur Sonne hin oder von ihr weg zeigt.',
      solution: `<b>${lagen[k][0]}</b>: ${lagen[k][1]}`, ex: { mode: 'jahr', art: 'jahrAnim', k, merk: `<b>${lagen[k][0]}</b>: ${lagen[k][1]}` } };
  }

  G.abbildungen = baue('geo5-abbildungen', {
    h: 'Ein Weltraumbild ist ein Foto. Der Globus ist ein verkleinertes Modell der Erde. Eine Weltkarte zeigt alles auf einen Blick, aber verzerrt.',
    F: [
      { f: 'Was ist ein <b>Globus</b>?', a: 'ein verkleinertes Modell der Erde als Kugel', x: ['ein Foto der Erde aus dem Weltall', 'eine flache Karte der Welt', 'ein Fernrohr'], w: 'Auf dem Globus stimmen Formen, Größen und Entfernungen. Man sieht aber nie die ganze Erde auf einmal.' },
      { f: 'Welche Abbildung zeigt die <b>ganze Erde auf einen Blick</b>?', a: 'die Weltkarte', x: ['der Globus', 'das Weltraumbild', 'das Luftbild einer Stadt'], w: 'Die Weltkarte breitet die Kugel auf einer Ebene aus. Dabei wird manches verzerrt.' },
      { f: 'Warum ist <b>jede Weltkarte</b> etwas verzerrt?', a: 'Eine Kugeloberfläche lässt sich nicht ohne Dehnen flach ausbreiten.', x: ['Weil die Zeichner Fehler machen.', 'Weil die Erde eine Scheibe ist.', 'Weil Karten zu klein sind.'], w: 'Probier es mit einer Orangenschale: Sie reißt oder muss gedehnt werden.' },
      { f: 'Auf manchen Weltkarten sieht <b>Grönland</b> fast so groß aus wie Afrika. Stimmt das?', a: 'Nein, Afrika ist ungefähr 14-mal so groß. Die Karte vergrößert Gebiete nahe den Polen.', x: ['Ja, beide sind gleich groß.', 'Nein, Grönland ist größer.', 'Ja, auf dem Globus auch.'], w: 'Auf dem Globus sieht man die richtigen Größen.' },
      { f: 'Was zeigt ein <b>Weltraumbild</b>?', a: 'ein Foto der Erde, aus dem Weltall aufgenommen', x: ['eine gezeichnete Karte', 'ein Modell der Erde', 'nur die Sterne'], w: 'Weltraumbilder werden von Satelliten oder Raumstationen gemacht. Man sieht Wolken, Meere und Land, aber keine Grenzen.' },
      { f: 'Was kann man auf einem <b>Weltraumbild nicht</b> sehen?', a: 'Ländergrenzen', x: ['Wolken', 'Meere', 'Wüsten'], w: 'Grenzen gibt es nur auf Karten. In der Natur sind sie nicht zu sehen.' },
      { f: 'Wie heißt die gedachte Linie, um die sich die Erde dreht?', a: 'Erdachse', x: ['Äquator', 'Nullmeridian', 'Wendekreis'], w: 'Die Erdachse verläuft vom Nordpol zum Südpol.' },
      { f: 'Wo endet die Erdachse?', a: 'am Nordpol und am Südpol', x: ['am Äquator', 'in Deutschland', 'an der Sonne'], w: 'Die Pole sind die Enden der Erdachse.' },
    ],
    S: { kats: ['Globus', 'Weltkarte', 'Weltraumbild'], f: (b) => `Welche Abbildung passt? <b>${b}</b>`, h: 'Globus = Kugel-Modell, Weltkarte = flach, Weltraumbild = Foto.',
      items: [['zeigt Größen und Formen richtig', 0], ['man muss ihn drehen, um alles zu sehen', 0], ['zeigt die ganze Erde auf einen Blick', 1], ['ist verzerrt', 1], ['zeigt Wolken', 2], ['ist ein Foto', 2], ['passt ins Buch und auf den Tisch', 1]] },
    E: { f: 'Was zeigt dieses Bild?', arten: [['weltraumbild', 'ein Weltraumbild', 'Ein Foto aus dem All: Wolken, Meere und Land, aber keine Grenzen.'], ['globus', 'einen Globus', 'Ein Modell der Erde als Kugel, mit Achse und Gestell.'], ['weltkarteFoto', 'eine Weltkarte', 'Die ganze Erde flach auf einen Blick.']] },
  });

  G.kontinente = baue('geo5-kontinente', {
    h: 'Sieben Kontinente: Asien, Afrika, Nordamerika, Südamerika, Antarktis, Europa, Australien. Drei große Ozeane: Pazifik, Atlantik, Indischer Ozean.',
    F: [
      { f: 'Welcher ist der <b>größte</b> Kontinent?', a: 'Asien', x: ['Afrika', 'Nordamerika', 'Europa'], w: 'Asien ist mit rund 44 Mio. km² der größte Kontinent.' },
      { f: 'Welcher ist der <b>kleinste</b> Kontinent?', a: 'Australien', x: ['Europa', 'Antarktis', 'Südamerika'], w: 'Australien (mit Ozeanien) hat rund 9 Mio. km², Europa rund 10 Mio. km².' },
      { f: 'Welcher ist der <b>größte</b> Ozean?', a: 'der Pazifische Ozean (Pazifik)', x: ['der Atlantische Ozean', 'der Indische Ozean', 'die Nordsee'], w: 'Der Pazifik ist größer als alle Kontinente zusammen.' },
      { f: 'Welcher Ozean liegt zwischen <b>Europa und Amerika</b>?', a: 'der Atlantische Ozean (Atlantik)', x: ['der Pazifische Ozean', 'der Indische Ozean', 'das Nordpolarmeer'], w: 'Wer von Europa nach Amerika fliegt, fliegt über den Atlantik.' },
      { f: 'Auf welchem Kontinent leben wir?', a: 'Europa', x: ['Asien', 'Afrika', 'Eurasien-Amerika'], w: 'Deutschland liegt in der Mitte Europas.' },
      { f: 'Welcher Kontinent ist fast ganz mit <b>Eis</b> bedeckt?', a: 'die Antarktis', x: ['Australien', 'Europa', 'Südamerika'], w: 'Die Antarktis liegt rund um den Südpol. Dort lebt niemand dauerhaft.' },
      { f: 'Welcher Kontinent grenzt <b>ohne Meer dazwischen</b> an Europa?', a: 'Asien', x: ['Afrika', 'Nordamerika', 'Australien'], w: 'Europa und Asien bilden zusammen eine große Landmasse. Als Grenze gilt meist das Uralgebirge.' },
      { f: 'Welcher Ozean liegt zwischen <b>Afrika und Australien</b>?', a: 'der Indische Ozean', x: ['der Atlantische Ozean', 'der Pazifische Ozean', 'das Südpolarmeer'], w: 'Der Indische Ozean liegt südlich von Asien.' },
      { f: 'Wie viel der Erdoberfläche ist von Wasser bedeckt?', a: 'etwa 7 von 10 Teilen (71 %)', x: ['etwa die Hälfte', 'etwa 3 von 10 Teilen', 'fast nichts'], w: 'Darum sieht die Erde aus dem All blau aus: der „Blaue Planet“.' },
    ],
    O: [{ t: 'Ordne die Kontinente nach der Größe: der größte zuerst.', items: ['Asien', 'Afrika', 'Nordamerika', 'Südamerika', 'Antarktis', 'Europa', 'Australien'], n: 4, w: 'Asien (44), Afrika (30), Nordamerika (25), Südamerika (18), Antarktis (14), Europa (10), Australien (9) – in Mio. km².' }],
    T: [{ f: 'Der größte Ozean heißt Pazifischer Ozean oder ___.', a: ['Pazifik', 'Stiller Ozean'], w: 'Er reicht von Amerika bis Asien und Australien.' }],
    extra: {
      kontTippen: () => U.flaecheTippen('kontTippen', { art: 'welt', namen: D.KONTINENTE, frage: (k) => `Wo liegt <b>${k}</b>?`, merk: (k) => `Fläche rund ${D.KONT_GROESSE[k]} Mio. km².`, h: 'Europa liegt oben in der Mitte, Afrika darunter.' }),
      kontNennen: () => U.flaecheNennen('kontNennen', { art: 'welt', namen: D.KONTINENTE, frage: () => 'Welcher Kontinent ist <b>gelb</b>?', merk: (k) => `Fläche rund ${D.KONT_GROESSE[k]} Mio. km².` }),
      ozean: () => ozeanFrage(),
    },
  }, { kontTippen: 26, kontNennen: 20, ozean: 14, frage: 26 });
  function ozeanFrage() {
    const oz = ['Pazifischer Ozean', 'Atlantischer Ozean', 'Indischer Ozean'], ziel = pick(oz), ch = shuffle([...oz, 'Nordpolarmeer']);
    const meere = {}; meere[ziel] = '?';
    return { prompt: 'Wie heißt der Ozean mit dem <b>Fragezeichen</b>?', figure: window.GeoKarte.welt({ meere, namen: true }), choices: ch, correct: ch.indexOf(ziel), hint: 'Der Atlantik liegt zwischen Amerika und Europa/Afrika, der Pazifik zwischen Amerika und Asien.',
      solution: `Das ist der <b>${ziel}</b>.`, ex: { mode: 'karte', nach: false, art: 'ozean', q: 'Wie heißt der Ozean?', opts: [ziel], ok: 0, svg: D.karte('welt', { meere: { [ziel]: ziel } }), merk: `<b>${ziel}</b>: ${{ 'Pazifischer Ozean': 'zwischen Amerika im Osten und Asien und Australien im Westen. Er ist der größte Ozean.', 'Atlantischer Ozean': 'zwischen Amerika im Westen und Europa und Afrika im Osten.', 'Indischer Ozean': 'zwischen Afrika, Asien und Australien.' }[ziel]}` } };
  }

  G.windrose = baue('geo5-windrose', {
    h: 'Auf Karten ist Norden oben, Süden unten, Osten rechts und Westen links. Dazwischen liegen Nordosten, Südosten, Südwesten und Nordwesten.',
    F: [
      { f: 'Wo ist auf einer Karte (fast immer) <b>Norden</b>?', a: 'oben', x: ['unten', 'links', 'rechts'], w: 'Nie ohne Seife waschen: Norden oben, Osten rechts, Süden unten, Westen links (im Uhrzeigersinn).' },
      { f: 'Wo ist auf einer Karte <b>Osten</b>?', a: 'rechts', x: ['links', 'oben', 'unten'], w: 'Im Uhrzeigersinn: Norden, Osten, Süden, Westen.' },
      { f: 'Welche Himmelsrichtung liegt genau zwischen Norden und Osten?', a: 'Nordosten', x: ['Südosten', 'Nordwesten', 'Südwesten'], w: 'Die Zwischenrichtungen nennen zuerst Norden oder Süden.' },
      { f: 'Welche Himmelsrichtung ist das Gegenteil von <b>Südwesten</b>?', a: 'Nordosten', x: ['Nordwesten', 'Südosten', 'Süden'], w: 'Gegenüber heißt: beide Teile tauschen. Süd → Nord, West → Ost.' },
      { f: 'Womit findest du draußen ohne Karte heraus, wo Norden ist?', a: 'mit einem Kompass', x: ['mit einem Thermometer', 'mit einem Lineal', 'mit einer Waage'], w: 'Die Kompassnadel zeigt immer nach Norden.' },
      { f: 'Wie heißt der Kreis mit allen Himmelsrichtungen?', a: 'Windrose', x: ['Gradnetz', 'Legende', 'Maßstab'], w: 'Die Windrose zeigt die vier Haupt- und vier Zwischenrichtungen.' },
      { f: 'Mittags um 12 Uhr scheint die Sonne. In welche Richtung zeigt dein <b>Schatten</b>?', a: 'nach Norden', x: ['nach Süden', 'nach Osten', 'nach Westen'], w: 'Mittags steht die Sonne bei uns im Süden, der Schatten fällt auf die andere Seite.' },
    ],
    T: [{ f: 'Zwischen Süden und Westen liegt ___.', a: 'Südwesten', w: 'Zuerst Süden, dann Westen.' }],
    extra: {
      richtungSN: () => U.himmelsrichtung('richtungSN', { art: 'sachsen', orte: D.SN_ORTE, opts: { namen: ['Sachsen'] } }),
      richtungDE: () => U.himmelsrichtung('richtungDE', { art: 'deutschland', orte: D.DE_STAEDTE, opts: {} }),
    },
  }, { richtungSN: 26, richtungDE: 26, frage: 22 });

  // Gradnetz: Orte auf beiden Halbkugeln
  const WELTORTE = { Dresden: [13.7, 51.1], Sydney: [151.2, -33.9], 'Rio de Janeiro': [-43.2, -22.9], 'New York': [-74.0, 40.7], Kapstadt: [18.4, -33.9], Tokio: [139.7, 35.7], 'Buenos Aires': [-58.4, -34.6], Kairo: [31.2, 30.0], Peking: [116.4, 39.9], 'Mexiko-Stadt': [-99.1, 19.4], Lima: [-77.0, -12.0], Perth: [115.9, -32.0] };
  G.gradnetz = baue('geo5-gradnetz', {
    h: 'Der Äquator teilt die Erde in Nord- und Südhalbkugel. Der Nullmeridian (durch Greenwich bei London) teilt sie in West- und Osthalbkugel.',
    F: [
      { f: 'Wie heißt die Linie, die die Erde in eine <b>Nord- und eine Südhalbkugel</b> teilt?', a: 'Äquator', x: ['Nullmeridian', 'Erdachse', 'Wendekreis'], w: 'Der Äquator ist der längste Breitenkreis, rund 40 000 km.' },
      { f: 'Durch welche Stadt verläuft der <b>Nullmeridian</b>?', a: 'Greenwich bei London', x: ['Berlin', 'Paris', 'Rom'], w: 'Dort steht eine alte Sternwarte. Von dieser Linie aus zählt man die Längengrade nach Osten und Westen.' },
      { f: 'Wie verlaufen die <b>Breitenkreise</b>?', a: 'parallel zum Äquator, von West nach Ost', x: ['vom Nordpol zum Südpol', 'kreuz und quer', 'nur um die Pole'], w: 'Breitenkreise sind Ringe um die Erde. Je näher am Pol, desto kleiner.' },
      { f: 'Wie verlaufen die <b>Längenhalbkreise</b> (Meridiane)?', a: 'vom Nordpol zum Südpol', x: ['parallel zum Äquator', 'nur auf der Südhalbkugel', 'als kleine Kreise um Städte'], w: 'Alle Meridiane treffen sich an den Polen.' },
      { f: 'Wozu dient das <b>Gradnetz</b>?', a: 'um die Lage jedes Ortes auf der Erde genau anzugeben', x: ['um Entfernungen zu messen', 'um das Wetter vorherzusagen', 'um Länder zu färben'], w: 'Jeder Ort hat eine Breite (Nord/Süd) und eine Länge (Ost/West).' },
      { f: 'Auf welcher Halbkugel liegt <b>Deutschland</b>?', a: 'auf der Nord- und der Osthalbkugel', x: ['auf der Süd- und der Osthalbkugel', 'auf der Nord- und der Westhalbkugel', 'genau auf dem Äquator'], w: 'Deutschland liegt nördlich des Äquators und östlich des Nullmeridians.' },
      { f: 'Welcher Breitenkreis ist der <b>längste</b>?', a: 'der Äquator', x: ['der nördliche Polarkreis', 'der Wendekreis', 'alle sind gleich lang'], w: 'Zu den Polen hin werden die Breitenkreise immer kürzer.' },
      { f: 'Wie viel Grad Breite hat der Äquator?', a: '0 Grad', x: ['90 Grad', '180 Grad', '23,5 Grad'], w: 'Vom Äquator zählt man bis 90 Grad nach Norden (Nordpol) und 90 Grad nach Süden (Südpol).' },
    ],
    T: [{ f: 'Der Äquator teilt die Erde in Nord- und ___.', a: ['Südhalbkugel', 'Süd-Halbkugel'], w: 'Halbkugel = halbe Kugel.' }],
    extra: {
      linie: () => {
        const L = [['Äquator', { hell: ['aequator'] }, 'Er teilt die Erde in Nord- und Südhalbkugel.'], ['Nullmeridian', { hell: ['nullmeridian'] }, 'Er läuft durch Greenwich bei London und teilt in West- und Osthalbkugel.'], ['Breitenkreise', { hell: ['breiten'] }, 'Sie verlaufen parallel zum Äquator.'], ['Längenhalbkreise', { hell: ['laengen'] }, 'Sie verlaufen von Pol zu Pol.']];
        const k = R(0, 3), ch = shuffle(L.map((x) => x[0]));
        return { prompt: 'Wie heißen die <b>farbig</b> hervorgehobenen Linien?', figure: window.GeoKarte.welt({ gradnetz: L[k][1] }), choices: ch, correct: ch.indexOf(L[k][0]), hint: 'Breitenkreise liegen waagerecht, Längenhalbkreise laufen von oben nach unten.',
          solution: `<b>${L[k][0]}</b>: ${L[k][2]}`, ex: { mode: 'karte', nach: false, art: 'linie', q: 'Wie heißen die farbigen Linien?', opts: [L[k][0]], ok: 0, svg: D.karte('welt', { gradnetz: L[k][1] }), merk: `<b>${L[k][0]}</b>: ${L[k][2]}` } };
      },
      halbkugel: () => {
        const n = pick(Object.keys(WELTORTE)), [lo, la] = WELTORTE[n], ok = `${la > 0 ? 'Nord' : 'Süd'}- und ${lo > 0 ? 'Ost' : 'West'}halbkugel`;
        const ch = shuffle(['Nord- und Osthalbkugel', 'Nord- und Westhalbkugel', 'Süd- und Osthalbkugel', 'Süd- und Westhalbkugel']);
        const fig = window.GeoKarte.welt({ gradnetz: { hell: ['aequator', 'nullmeridian'], namen: true }, orte: [[n, lo, la, { hell: true, lage: lo > 100 ? [-6, 3, 'end'] : [6, 3, 'start'] }]] });
        return { prompt: `Auf welchen Halbkugeln liegt <b>${n}</b>?`, figure: fig, choices: ch, correct: ch.indexOf(ok), hint: 'Rot ist der Äquator (Nord/Süd), grün der Nullmeridian (West/Ost).',
          solution: `${n} liegt ${la > 0 ? 'nördlich' : 'südlich'} des Äquators und ${lo > 0 ? 'östlich' : 'westlich'} des Nullmeridians: <b>${ok}</b>.`,
          ex: { mode: 'karte', nach: false, art: 'halbkugel', q: `${n}: welche Halbkugeln?`, opts: [ok], ok: 0, svg: D.karte('welt', { gradnetz: { hell: ['aequator', 'nullmeridian'], namen: true }, orte: [[n, lo, la, { hell: true, lage: lo > 100 ? [-6, 3, 'end'] : [6, 3, 'start'] }]] }), merk: `<b>${ok}</b>: ${la > 0 ? 'über' : 'unter'} dem Äquator, ${lo > 0 ? 'rechts' : 'links'} vom Nullmeridian.` } };
      },
    },
  }, { linie: 22, halbkugel: 26, frage: 28 });

  G.atlas = baue('geo5-atlas', {
    h: 'Im Register (hinten im Atlas) stehen alle Namen von A bis Z mit Seite und Planquadrat. Das Planquadrat findest du wie beim Schiffe-Versenken: Buchstabe und Zahl am Kartenrand.',
    F: [
      { f: 'Wo im Atlas findest du einen Ort, von dem du nur den <b>Namen</b> kennst?', a: 'im Register (Namensverzeichnis) hinten im Atlas', x: ['im Inhaltsverzeichnis vorn', 'in der Legende', 'auf der Titelseite'], w: 'Das Register nennt Seite und Planquadrat.' },
      { f: 'Im Register steht: <b>Dresden 34 C3</b>. Was bedeutet die <b>34</b>?', a: 'die Seite im Atlas', x: ['die Einwohnerzahl in Tausend', 'das Planquadrat', 'die Entfernung in km'], w: 'Zuerst die Seite aufschlagen, dann das Planquadrat C3 suchen.' },
      { f: 'Im Register steht: <b>Dresden 34 C3</b>. Was bedeutet <b>C3</b>?', a: 'das Planquadrat auf der Karte', x: ['die Seite', 'das dritte Kapitel', 'die Postleitzahl'], w: 'Buchstabe und Zahl stehen am Kartenrand. Wo sich Spalte und Zeile kreuzen, liegt der Ort.' },
      { f: 'Wo findest du im Atlas eine <b>Karte zu einem Thema</b>, zum Beispiel „Landwirtschaft in Deutschland“?', a: 'im Inhaltsverzeichnis oder in der Kartenübersicht', x: ['im Register', 'in der Legende', 'auf der Rückseite'], w: 'Das Inhaltsverzeichnis ordnet die Karten nach Räumen und Themen.' },
      { f: 'Was erklärt die <b>Legende</b> einer Karte?', a: 'was die Farben und Zeichen bedeuten', x: ['wer die Karte gezeichnet hat', 'eine alte Sage', 'wie alt die Karte ist'], w: 'Ohne Legende versteht man eine Karte nicht.' },
      { f: 'Was zeigt eine <b>physische Karte</b>?', a: 'Höhen (Tiefland und Gebirge), Gewässer und Orte', x: ['nur Ländergrenzen in bunten Farben', 'nur das Wetter', 'nur Straßen'], w: 'Grün heißt tief gelegen, Gelb und Braun heißt höher.' },
      { f: 'Was zeigt eine <b>thematische Karte</b>?', a: 'ein bestimmtes Thema, zum Beispiel Landwirtschaft oder Bevölkerung', x: ['immer nur Höhen', 'nur das Gradnetz', 'nichts, sie ist leer'], w: 'Das Thema steht im Titel der Karte.' },
      { f: 'Was liest du bei einer Karte <b>zuerst</b>?', a: 'die Überschrift: Sie nennt das Thema und das Gebiet', x: ['den kleinsten Ortsnamen', 'die Seitenzahl', 'das Planquadrat'], w: 'Danach in der Legende die Zeichen und Farben suchen.' },
      { f: 'Auf einer physischen Karte ist das Meer <b>dunkelblau</b>. Was bedeutet das meist?', a: 'Das Meer ist dort sehr tief.', x: ['Das Wasser ist dort besonders sauber.', 'Dort ist es sehr kalt.', 'Dort fahren viele Schiffe.'], w: 'Flaches Meer ist hell, tiefes Meer dunkelblau.' },
      { f: 'Woher hat der <b>Atlas</b> seinen Namen?', a: 'von Atlas, einem König aus einer alten Sage: Nach ihm wurde 1595 die Kartensammlung von Gerhard Mercator benannt', x: ['von einem Gebirge in Sachsen', 'von einem Schiff', 'von einer Abkürzung für „alle Karten“'], w: 'Mercator war ein berühmter Kartenzeichner. Sein „Atlas“ erschien kurz nach seinem Tod.' },
      { f: 'Auf einer physischen Karte ist ein Gebiet <b>dunkelbraun</b>. Was bedeutet das meist?', a: 'Es liegt sehr hoch, zum Beispiel ein Hochgebirge.', x: ['Dort ist eine Wüste.', 'Dort wird Kaffee angebaut.', 'Das Gebiet liegt unter dem Meeresspiegel.'], w: 'Höhenschichten: Grün (tief), Gelb, Hellbraun, Dunkelbraun (hoch), oft Weiß für Gletscher.' },
    ],
    O: [{ t: 'Du suchst „Freiberg“ im Atlas. Ordne die Schritte.', items: ['im Register den Namen suchen', 'die Seite aufschlagen', 'am Kartenrand Buchstabe und Zahl suchen', 'im Planquadrat den Ort finden'], w: 'Register → Seite → Planquadrat → Ort.' },
      { t: 'So liest du eine Karte. Ordne.', items: ['die Überschrift lesen (Thema und Gebiet)', 'in der Legende die Zeichen und Farben suchen', 'die Zeichen in der Karte finden', 'beschreiben, wo etwas liegt und wie es verteilt ist'], w: 'Erst das Thema, dann die Legende, dann die Karte selbst.' }],
    S: { kats: ['physische Karte', 'thematische Karte'], f: (b) => `<b>${b}</b>: Welche Kartenart?`, h: 'Physisch = Gelände (Höhen, Gewässer). Thematisch = ein bestimmtes Thema.',
      items: [['Höhen in Grün, Gelb und Braun', 0], ['Gebirge und Flüsse', 0], ['Bevölkerungsdichte in Deutschland', 1], ['Wo wird Weizen angebaut?', 1], ['Ferienorte an der Ostsee', 1], ['Tiefland und Hochgebirge', 0]] },
    T: [{ f: 'Das Namensverzeichnis im Atlas heißt ___.', a: 'Register', w: 'Es steht hinten im Atlas und ist alphabetisch geordnet.' }],
    extra: { planquadrat: () => planquadrat() },
  }, { planquadrat: 26 });
  function planquadrat() {
    const sp = 'ABCDEF', s = R(0, 5), z = R(0, 3), ok = sp[s] + (z + 1);
    let fig = '<svg viewBox="0 0 200 140" role="img" aria-label="Karte mit Planquadraten" style="max-width:100%;height:auto"><rect width="200" height="140" fill="#fff"/>';
    for (let i = 0; i < 6; i++) fig += `<text x="${30 + i * 28}" y="12" text-anchor="middle" style="font:800 9px Nunito,sans-serif;fill:#2b2540">${sp[i]}</text>`;
    for (let j = 0; j < 4; j++) fig += `<text x="8" y="${34 + j * 28}" text-anchor="middle" style="font:800 9px Nunito,sans-serif;fill:#2b2540">${j + 1}</text>`;
    fig += '<rect x="16" y="18" width="168" height="112" fill="#efe8d6" stroke="#2b2540" stroke-width="1"/>';
    for (let i = 1; i < 6; i++) fig += `<line x1="${16 + i * 28}" y1="18" x2="${16 + i * 28}" y2="130" stroke="#8f8571" stroke-width=".7"/>`;
    for (let j = 1; j < 4; j++) fig += `<line x1="16" y1="${18 + j * 28}" x2="184" y2="${18 + j * 28}" stroke="#8f8571" stroke-width=".7"/>`;
    fig += `<circle cx="${30 + s * 28}" cy="${32 + z * 28}" r="5" fill="#d0443a" stroke="#fff" stroke-width="1.5"/></svg>`;
    const fal = new Set(); while (fal.size < 3) { const x = sp[R(0, 5)] + R(1, 4); if (x !== ok) fal.add(x); }
    const ch = shuffle([ok, ...fal]);
    return { prompt: 'In welchem <b>Planquadrat</b> liegt der rote Punkt?', figure: fig, choices: ch, correct: ch.indexOf(ok), hint: 'Erst die Spalte (Buchstabe oben), dann die Zeile (Zahl links).', solution: `Spalte ${sp[s]}, Zeile ${z + 1}: <b>${ok}</b>.`,
      ex: { mode: 'karte', nach: false, art: 'planquadrat', q: 'Planquadrat des roten Punkts?', opts: [ok], ok: 0, svg: '', merk: `<b>${ok}</b>: Buchstabe der Spalte, dann Zahl der Zeile.` } };
  }

  G.luftbild = baue('geo5-luftbild', {
    h: 'Ein Senkrechtluftbild ist genau von oben fotografiert, ein Schrägluftbild schräg von der Seite. Die Karte vereinfacht: Sie zeigt nur das Wichtige mit Farben und Zeichen.',
    F: [
      { f: 'Wie unterscheiden sich <b>Schrägluftbild</b> und <b>Senkrechtluftbild</b>?', a: 'Das Schrägluftbild ist schräg von der Seite, das Senkrechtluftbild genau von oben fotografiert.', x: ['Das Schrägluftbild ist gezeichnet.', 'Das Senkrechtluftbild zeigt nur Straßen.', 'Es gibt keinen Unterschied.'], w: 'Auf dem Schrägluftbild erkennt man Häuser gut von der Seite. Das Senkrechtluftbild ist der Karte schon sehr ähnlich.' },
      { f: 'Was ist bei einer <b>Karte</b> anders als bei einem Luftbild?', a: 'Die Karte vereinfacht: Sie zeigt nur das Wichtige mit Farben und Zeichen.', x: ['Die Karte zeigt jedes Auto und jeden Baum.', 'Die Karte ist immer schräg.', 'Die Karte hat keine Farben.'], w: 'Darum braucht jede Karte eine Legende.' },
      { f: 'Was zeigt eine Karte <b>nicht</b>, ein Luftbild aber schon?', a: 'parkende Autos und einzelne Menschen', x: ['Straßen', 'Flüsse', 'Gebäude'], w: 'Dinge, die sich bewegen oder unwichtig sind, lässt die Karte weg.' },
      { f: 'Welche Abbildung ist einer Karte am <b>ähnlichsten</b>?', a: 'das Senkrechtluftbild', x: ['das Schrägluftbild', 'ein Foto vom Boden', 'ein Gemälde'], w: 'Beide zeigen alles von genau oben.' },
      { f: 'Auf vielen Karten ist Wasser <b>blau</b> und Wald <b>grün</b>. Wo steht, was die Farben bedeuten?', a: 'in der Legende', x: ['im Register', 'auf der Rückseite des Atlas', 'nirgends'], w: 'Die Legende erklärt alle Farben und Zeichen.' },
    ],
    O: [{ t: 'Vom Foto zur Karte: Ordne die Bilder.', items: ['Foto vom Boden', 'Schrägluftbild', 'Senkrechtluftbild', 'Karte'], w: 'Je weiter rechts, desto mehr wird vereinfacht.' }],
    E: { f: 'Was für ein Bild ist das?', arten: [['luftbildSchraeg', 'ein Schrägluftbild', 'Von schräg oben: Man sieht die Seiten der Häuser.'], ['luftbildSenkrecht', 'ein Senkrechtluftbild', 'Genau von oben: Man sieht nur die Dächer.'], ['stadtplan', 'eine Karte', 'Vereinfacht mit Farben, Linien und Namen.']] },
  });

  G.massstab = baue('geo5-massstab', {
    h: 'Der Maßstab sagt, wie stark verkleinert ist. 1 : 100 000 heißt: 1 cm auf der Karte sind 100 000 cm = 1 km in Wirklichkeit.',
    F: [
      { f: 'Was gibt der <b>Maßstab</b> einer Karte an?', a: 'wie stark die Wirklichkeit verkleinert ist', x: ['wie alt die Karte ist', 'wie viele Orte auf der Karte sind', 'wie hoch die Berge sind'], w: 'Mit dem Maßstab kann man Entfernungen berechnen.' },
      { f: 'Welche Karte zeigt <b>mehr Einzelheiten</b>: 1 : 25 000 oder 1 : 1 000 000?', a: '1 : 25 000', x: ['1 : 1 000 000', 'beide gleich viel', 'man kann es nicht sagen'], w: 'Bei 1 : 25 000 wird weniger verkleinert. Man sieht sogar einzelne Häuser (großer Maßstab).' },
      { f: 'Wofür ist eine <b>Maßstabsleiste</b> praktisch?', a: 'um Entfernungen direkt mit dem Lineal oder Papierstreifen abzulesen', x: ['um die Höhe zu messen', 'um Norden zu finden', 'um die Karte zu falten'], w: 'Man legt die Strecke an die Leiste und liest die km ab.' },
      { f: 'Wie misst man eine <b>kurvige</b> Strecke, zum Beispiel einen Fluss, auf der Karte?', a: 'mit einem Faden, der der Kurve folgt, und dann an der Maßstabsleiste', x: ['mit dem Lineal in gerader Linie', 'man kann sie nicht messen', 'mit einem Thermometer'], w: 'Die Luftlinie ist immer kürzer als der echte Weg.' },
      { f: 'Was ist die <b>Luftlinie</b>?', a: 'die gerade Entfernung zwischen zwei Orten', x: ['der Weg auf der Straße', 'die Strecke eines Flugzeugs mit Umwegen', 'eine Linie am Himmel'], w: 'Wege auf Straßen sind fast immer länger als die Luftlinie.' },
    ],
    extra: { rechnen: () => U.massstabRechnen('rechnen'), rueck: () => U.massstabRueck('rueck'), bedeutung: () => U.massstabBedeutung('bedeutung') },
  }, { rechnen: 34, rueck: 18, bedeutung: 22, frage: 20 });

  // Die Welt entdecken: vier Lebensräume und vier Hilfsmittel (Bild, Karte, Text, Zahl)
  const LR = { 'Arktis an der Baffin Bay': [-68, 72, 'Nordamerika, nahe dem Nordpol'], 'Regenwald am Amazonas': [-62, -4, 'Südamerika, am Äquator'], 'Niger am Rand der Sahara': [8, 15, 'Afrika, im Sahel südlich der Sahara'], Shanghai: [121.5, 31.2, 'Asien (China), am Pazifischen Ozean'] };
  const LR_ORTE = Object.fromEntries(Object.entries(LR).map(([k, v]) => [k, [v[0], v[1]]]));
  const HILFSMITTEL = { kats: ['Bild', 'Karte', 'Text', 'Zahl'], f: (b) => `<b>${b}</b>: Welches Hilfsmittel hilft hier am besten?`, h: 'Bild = wie es aussieht. Karte = wo es liegt. Text = warum es so ist. Zahl = wie groß, wie viele.',
    items: [['Wie sehen die Häuser am Amazonas aus?', 0], ['Welche Kleidung tragen die Menschen in der Arktis?', 0], ['Wie sieht eine Schule in Niger aus?', 0], ['Wo liegen die Regenwälder der Erde?', 1], ['Welche Flüsse und Städte liegen in der Nähe?', 1], ['An welchem Ozean liegt Shanghai?', 1], ['Warum regnet es im Regenwald fast jeden Tag?', 2], ['Wie leben die Menschen mit der Trockenheit?', 2], ['Wie groß ist der Regenwald in km²?', 3], ['Wie viele Menschen leben in Shanghai?', 3], ['Wie viel Regen fällt in einem Jahr?', 3]] };
  G.weltEntdecken = baue('geo5-welt', {
    h: 'Gebiete, die man nicht selbst besuchen kann, lernt man mit Bildern, Karten, Texten und Zahlen kennen. Vier sehr verschiedene Lebensräume: Polargebiet, Tropischer Regenwald, Wüstenrand und Riesenstadt.',
    F: [
      { f: 'Womit kannst du Gebiete kennenlernen, die du nicht selbst besuchen kannst?', a: 'mit Bildern, Karten, Texten und Zahlen', x: ['nur mit dem Wetterbericht', 'gar nicht', 'nur mit Postkarten von Freunden'], w: 'Jedes Hilfsmittel zeigt etwas anderes. Zusammen ergeben sie ein gutes Bild.' },
      { f: 'Was zeigt ein <b>Foto</b> besonders gut?', a: 'wie es dort aussieht, zum Beispiel Häuser, Kleidung und Landschaft', x: ['wie viele Menschen in einem Land leben', 'warum es dort so heiß ist', 'wie weit es bis dorthin ist'], w: 'Ein Bild kann man in Ruhe anschauen, ein Film zeigt dafür Bewegung.' },
      { f: 'Warum zeigt ein Foto nie die <b>ganze</b> Wirklichkeit?', a: 'Es ist nur ein Ausschnitt, und der Fotograf wählt aus, was er zeigen will.', x: ['Weil Fotos immer unscharf sind.', 'Weil Fotos nur schwarz-weiß sind.', 'Weil Fotos immer gefälscht sind.'], w: 'Darum fragt man: Was ist außerhalb des Bildes? Was wollte der Fotograf zeigen?' },
      { f: 'Wofür ist eine <b>Karte</b> besonders gut?', a: 'um die Lage zu zeigen: wo etwas liegt und was in der Nähe ist', x: ['um zu zeigen, wie die Menschen aussehen', 'um Gefühle zu beschreiben', 'um Musik zu hören'], w: 'Karten zeigen zum Beispiel Verkehrswege, Städte oder wo Pflanzen wachsen.' },
      { f: 'Wofür ist ein <b>Text</b> besonders gut?', a: 'um Hintergründe und Zusammenhänge zu erklären', x: ['um die genaue Lage zu zeigen', 'um Farben zu zeigen', 'um Entfernungen zu messen'], w: 'Ein Text kann erklären, warum etwas so ist.' },
      { f: 'Wofür sind <b>Zahlen</b> besonders gut?', a: 'um Größen zu vergleichen und Veränderungen zu zeigen', x: ['um zu zeigen, wie es riecht', 'um die Landschaft zu zeigen', 'um eine Geschichte zu erzählen'], w: 'Zum Beispiel Fläche, Einwohner oder Regenmenge.' },
      { f: 'Auf welchem Kontinent liegt der Regenwald am <b>Amazonas</b>?', a: 'Südamerika', x: ['Afrika', 'Asien', 'Australien'], w: 'Der Amazonas-Regenwald ist der größte Regenwald der Erde.' },
      { f: 'Am Rand welcher Wüste liegt das Land <b>Niger</b>?', a: 'der Sahara', x: ['der Gobi', 'der Atacama', 'der Namib'], w: 'Niger liegt in Afrika. Der trockene Streifen südlich der Sahara heißt Sahel.' },
      { f: 'Auf welchem Kontinent liegt die Riesenstadt <b>Shanghai</b>?', a: 'Asien', x: ['Europa', 'Nordamerika', 'Afrika'], w: 'Shanghai liegt in China am Pazifischen Ozean.' },
      { f: 'In welchem Lebensraum ist es viele Monate sehr <b>kalt</b> und lange dunkel?', a: 'im Polargebiet', x: ['im Tropischen Regenwald', 'am Rand der Sahara', 'in Shanghai'], w: 'Im Winter geht dort die Sonne wochenlang nicht auf (Polarnacht).' },
    ],
    S: { kats: ['Polargebiet', 'Tropischer Regenwald', 'Wüstenrand', 'Riesenstadt'], f: (b) => `<b>${b}</b>: Zu welchem Lebensraum passt das?`, h: 'Kalt, nass und heiß, trocken oder voller Menschen?',
      items: [['Polarnacht im Winter', 0], ['Eis und Schnee fast das ganze Jahr', 0], ['Dauerfrostboden', 0], ['fast jeden Tag ein Regenguss', 1], ['riesige Bäume in mehreren Stockwerken', 1], ['schwülheiß das ganze Jahr', 1], ['lange Trockenzeit', 2], ['Wasser aus dem Brunnen holen', 2], ['Dürre und Sandstürme', 2], ['Hochhäuser und U-Bahn', 3], ['Millionen Menschen auf engem Raum', 3], ['Stau und Smog', 3]] },
    E: { f: 'Welchen Lebensraum zeigt das Foto?', arten: [['polar', 'ein Polargebiet', 'Eis und kaltes Meer.'], ['regenwald', 'einen Tropischen Regenwald', 'Dichter, nebliger Wald, heiß und feucht.'], ['sahel', 'den Rand einer Wüste (Sahel)', 'Trockener Boden, wenige Büsche und Bäume.'], ['shanghai', 'eine Riesenstadt', 'Hochhäuser, so weit man sieht.']] },
    extra: {
      hilfsmittel: () => U.sortiere('hilfsmittel', HILFSMITTEL),
      lage: () => U.ortTippen('lage', { art: 'welt', ortArt: 'gebiet', orte: LR_ORTE, frage: (n) => `Wo liegt der Lebensraum <b>${n}</b>?`, merk: (n) => LR[n][2] + '.', h: 'Denk an die Kontinente und den Äquator.', opts: { gradnetz: { hell: ['aequator'] } } }),
    },
  }, { hilfsmittel: 24, lage: 22, frage: 24, sortieren: 18, erkennen: 14 });

  G.bilderTexte = baue('geo5-bilder', {
    h: 'Ein Bild beschreibt man von vorn nach hinten: Vordergrund, Mittelgrund, Hintergrund. Erst beschreiben, was man sieht, dann erklären, dann bewerten.',
    F: [
      { f: 'In welcher Reihenfolge beschreibst du ein Foto am besten?', a: 'Vordergrund, Mittelgrund, Hintergrund', x: ['Hintergrund, Himmel, Rand', 'nur das Wichtigste, egal wo', 'von rechts nach links'], w: 'So vergisst man nichts.' },
      { f: 'Was gehört bei der Bildbeschreibung an den <b>Anfang</b>?', a: 'Was ist das Thema, wo und wann ist das Foto entstanden?', x: ['meine Meinung zum Bild', 'eine Erklärung, warum alles so ist', 'die Farbe des Rahmens'], w: 'Erst der Überblick, dann die Einzelheiten.' },
      { f: 'Wie liest man einen <b>Sachtext</b> gut?', a: 'Überschrift lesen, Text lesen, unbekannte Wörter klären, das Wichtigste herausschreiben', x: ['nur die Bilder anschauen', 'nur den letzten Satz lesen', 'schnell überfliegen und weglegen'], w: 'Schlüsselwörter helfen, den Inhalt kurz wiederzugeben.' },
      { f: 'Was sind <b>Schlüsselwörter</b> in einem Text?', a: 'die wichtigsten Wörter, die den Inhalt tragen', x: ['Wörter mit dem Buchstaben S', 'alle Verben', 'die Wörter in der Überschrift'], w: 'Mit ihnen kann man den Text kurz zusammenfassen.' },
    ],
    O: [
      { t: 'Ordne die Schritte beim Beschreiben eines Fotos.', items: ['Thema, Ort und Zeit nennen', 'den Vordergrund beschreiben', 'den Mittelgrund beschreiben', 'den Hintergrund beschreiben', 'erklären und bewerten'], w: 'Vom Überblick zu den Einzelheiten, zum Schluss erklären.' },
      { t: 'Ordne die Schritte beim Lesen eines Sachtextes.', items: ['Überschrift und Bilder anschauen', 'den Text genau lesen', 'unbekannte Wörter klären', 'Schlüsselwörter herausschreiben', 'den Inhalt mit eigenen Worten wiedergeben'], w: 'So versteht und behält man den Text.' },
    ],
    extra: { bildTeil: () => bildTeil() },
  }, { bildTeil: 24 });
  function bildTeil() {
    const B = pick([['alpen', [['der Vordergrund', 'unten im Bild, am nächsten'], ['der Hintergrund', 'oben im Bild, am weitesten weg']]], ['bastei', [['der Vordergrund', 'unten im Bild, am nächsten'], ['der Hintergrund', 'oben im Bild, am weitesten weg']]]]);
    const vorn = R(0, 1), ok = B[1][vorn][0], ch = ['der Vordergrund', 'der Mittelgrund', 'der Hintergrund'];
    return { prompt: `Wo im Bild liegt <b>${vorn === 0 ? 'das, was dem Fotografen am nächsten war' : 'das, was am weitesten weg ist'}</b>?`, figure: D.bilder[B[0]](), choices: ch, correct: ch.indexOf(ok), hint: 'Vorn = nah, hinten = fern.',
      solution: `<b>${ok}</b>: ${B[1][vorn][1]}.`, ex: { mode: 'karte', nach: false, art: 'bildTeil', q: 'Vordergrund oder Hintergrund?', opts: [ok], ok: 0, svg: B[0], merk: `<b>${ok}</b>: ${B[1][vorn][1]}.` } };
  }

  // Leben in unterschiedlichen Räumen
  G.regenwald = baue('geo5-regenwald', {
    h: 'Im Tropischen Regenwald am Äquator ist es das ganze Jahr heiß und feucht. Fast jeden Tag regnet es.',
    F: [
      { f: 'Wo liegt der <b>Tropische Regenwald</b>?', a: 'rund um den Äquator', x: ['an den Polen', 'in Mitteleuropa', 'in der Sahara'], w: 'Zum Beispiel am Amazonas in Südamerika und im Kongobecken in Afrika.' },
      { f: 'Wie ist das Wetter im Tropischen Regenwald?', a: 'das ganze Jahr heiß und feucht, fast täglich Regen', x: ['kalt und trocken', 'Sommer und Winter wie bei uns', 'heiß und fast nie Regen'], w: 'Jahreszeiten wie bei uns gibt es dort nicht.' },
      { f: 'Welcher große Fluss fließt durch den größten Regenwald der Erde?', a: 'der Amazonas', x: ['der Nil', 'die Elbe', 'der Rhein'], w: 'Der Amazonas fließt durch Südamerika.' },
      { f: 'Warum wird der Regenwald immer kleiner?', a: 'Er wird für Felder, Weiden, Holz und Bergbau abgeholzt.', x: ['Er wird von Wüsten überrollt.', 'Er friert im Winter ein.', 'Er wächst ins Meer.'], w: 'Mit dem Wald verschwinden viele Tier- und Pflanzenarten.' },
      { f: 'Wie heißt ein Volk, das im Regenwald am Amazonas lebt (in Brasilien und Venezuela)?', a: 'Yanomami', x: ['Inuit', 'Hausa', 'Sorben'], w: 'Die Yanomami leben vom und im Wald: Sie jagen, sammeln und legen kleine Felder an.' },
      { f: 'Wie wohnen die Yanomami in ihrem Dorf?', a: 'alle zusammen in einem großen runden Gemeinschaftshaus', x: ['jede Familie in einem Hochhaus', 'in Häusern aus Eisblöcken', 'in Lehmhäusern mit dicken Wänden'], w: 'In dem Rundhaus hat jede Familie ihre eigene Feuerstelle, geschlafen wird in Hängematten.' },
      { f: 'Woher bekommen die Yanomami ihre Nahrung?', a: 'Sie jagen, fischen, sammeln Früchte und bauen auf kleinen Feldern Maniok an.', x: ['Sie kaufen alles im Supermarkt.', 'Sie halten große Rinderherden.', 'Sie fangen Robben.'], w: 'Maniok ist eine Pflanze mit dicken, stärkereichen Wurzeln, ähnlich wie Kartoffeln.' },
      { f: 'Warum sind im Regenwald am Äquator Tag und Nacht fast <b>gleich lang</b>?', a: 'Am Äquator dauern Tag und Nacht das ganze Jahr etwa 12 Stunden.', x: ['Weil dort immer Sommerzeit gilt.', 'Weil die Bäume das Licht schlucken.', 'Weil die Sonne dort nie untergeht.'], w: 'Jahreszeiten wie bei uns gibt es dort nicht. Es ist immer warm.' },
      { f: 'Wer bedroht das Leben der Menschen im Regenwald?', a: 'Holzfäller, Goldsucher und Straßenbauer, die den Wald roden', x: ['Eisbären', 'Sandstürme', 'zu viele Touristen am Strand'], w: 'Sie zerstören den Wald und schleppen Krankheiten ein.' },
      { f: 'Was gibt es im Regenwald besonders viel?', a: 'verschiedene Tier- und Pflanzenarten', x: ['Schnee und Eis', 'Sand', 'Ackerflächen'], w: 'Viele Tier- und Pflanzenarten gibt es nur dort. Wird der Wald abgeholzt, verschwinden sie.' },
    ],
    S: { kats: ['passt zum Regenwald', 'passt nicht zum Regenwald'], f: (b) => `<b>${b}</b>: Passt das zum Tropischen Regenwald?`, h: 'Im Regenwald ist es immer heiß und feucht, und es wächst sehr viel.',
      items: [['das ganze Jahr warm', 0], ['fast jeden Tag Regen', 0], ['Lianen und riesige Bäume', 0], ['sehr viele Tier- und Pflanzenarten', 0], ['Hängematten zum Schlafen', 0], ['Schnee im Winter', 1], ['monatelang kein Regen', 1], ['kaum Pflanzen', 1], ['Polarnacht', 1]] },
    O: [{ t: 'Vom Wald auf den Teller: Wie kommen die Yanomami zu einer Mahlzeit aus Maniok? Ordne.', items: ['ein kleines Stück Wald wird gerodet', 'Maniok wird gepflanzt', 'die Wurzeln werden geerntet', 'die Wurzeln werden gerieben und gebacken'], w: 'Nach wenigen Jahren wird das Feld aufgegeben, und der Wald wächst nach.' }],
    T: [{ f: 'Der größte Regenwald der Erde liegt am Fluss ___.', a: 'Amazonas', w: 'Er fließt durch Südamerika.' }],
    E: { f: 'Wo wurde dieses Foto aufgenommen?', arten: [['regenwald', 'im Tropischen Regenwald', 'Dichter, grüner Wald mit vielen Stockwerken.'], ['sahel', 'am Rand der Wüste', 'Trocken, wenig Pflanzen, sandiger Boden.'], ['polar', 'im Polargebiet', 'Eis und Schnee, keine Bäume.'], ['shanghai', 'in einer Riesenstadt', 'Hochhäuser dicht an dicht.']] },
  });
  G.wueste = baue('geo5-wueste', {
    h: 'Am Rand der Wüste (zum Beispiel in der Sahelzone südlich der Sahara) regnet es nur wenige Wochen im Jahr. Wasser ist kostbar.',
    F: [
      { f: 'Was ist am Rand der Wüste am <b>knappsten</b>?', a: 'Wasser', x: ['Sonne', 'Sand', 'Wärme'], w: 'Brunnen sind oft weit weg. Wasserholen dauert viel Zeit.' },
      { f: 'Wie heißt die größte Wüste Afrikas?', a: 'Sahara', x: ['Gobi', 'Amazonas', 'Antarktis'], w: 'Die Sahara liegt im Norden Afrikas.' },
      { f: 'Warum sind viele Häuser am Wüstenrand aus <b>Lehm</b> mit dicken Wänden?', a: 'Lehm hält die Hitze draußen und ist vor Ort vorhanden.', x: ['Weil Lehm leuchtet.', 'Weil es dort sehr viel Holz gibt.', 'Weil Lehm Regen anzieht.'], w: 'Dicke Wände halten das Innere tagsüber kühl.' },
      { f: 'Wovon leben viele Familien am Wüstenrand?', a: 'von Viehhaltung (Ziegen, Rinder, Kamele) und etwas Ackerbau', x: ['vom Fischfang im Meer', 'vom Wintersport', 'vom Bergbau unter Eis'], w: 'Hirten ziehen mit ihren Tieren dorthin, wo es Wasser und Futter gibt.' },
      { f: 'Wie ist das Wetter am Rand der Wüste?', a: 'sehr heiß, lange Trockenzeit, kurze Regenzeit', x: ['das ganze Jahr Regen', 'kalt mit Schnee', 'wie in Deutschland'], w: 'Bleibt die Regenzeit aus, gibt es eine Dürre.' },
      { f: 'Wie heißt die Hauptstadt des Landes <b>Niger</b>?', a: 'Niamey', x: ['Nairobi', 'Kairo', 'Shanghai'], w: 'Niamey liegt am Fluss Niger und hat über eine Million Einwohner.' },
      { f: 'Auf welchem Kontinent liegt das Land <b>Niger</b>?', a: 'Afrika', x: ['Asien', 'Südamerika', 'Australien'], w: 'Niger liegt in Westafrika, am Südrand der Sahara.' },
      { f: 'Woher holen viele Familien in Niamey ihr <b>Wasser</b>?', a: 'aus dem Brunnen oder vom Wasserhändler', x: ['aus dem Wasserhahn in jeder Wohnung', 'aus geschmolzenem Schnee', 'aus dem Meer'], w: 'Viele Häuser haben keinen Wasseranschluss und keinen Strom.' },
      { f: 'Was ist ein <b>Nachteil</b> von Häusern aus Lehm?', a: 'Nach der Regenzeit müssen sie oft ausgebessert werden.', x: ['Sie sind im Sommer zu heiß.', 'Sie schmelzen in der Sonne.', 'Man kann keine Fenster einbauen.'], w: 'Regen weicht den Lehm auf. Dafür bleibt es innen angenehm kühl.' },
      { f: 'Was essen viele Familien am Rand der Sahara häufig?', a: 'Brei aus Hirse', x: ['Robbenfleisch', 'Maniok aus dem Regenwald', 'Fischstäbchen'], w: 'Hirse ist ein Getreide, das mit wenig Wasser auskommt.' },
      { f: 'Warum sprechen viele Menschen in Niger <b>mehrere Sprachen</b>?', a: 'Im Land leben viele Völker mit eigenen Sprachen, zum Beispiel Hausa und Zarma.', x: ['Weil es in der Schule Pflicht ist, zehn Sprachen zu lernen.', 'Weil dort viele Touristen leben.', 'Weil jede Straße eine eigene Sprache hat.'], w: 'In der Schule wird außerdem Französisch gelernt.' },
    ],
    S: { kats: ['Vorteil von Lehmhäusern', 'Schwierigkeit im Alltag'], f: (b) => `<b>${b}</b>: Vorteil des Lehmhauses oder Schwierigkeit im Alltag am Wüstenrand?`, h: 'Lehm schützt vor Hitze. Schwierig ist vieles, was mit Wasser, Strom und Wegen zu tun hat.',
      items: [['innen bleibt es kühl', 0], ['Baustoff gibt es vor Ort', 0], ['feste Wände', 0], ['kein Wasseranschluss', 1], ['kein Strom im Haus', 1], ['Trinkwasser ist teuer', 1], ['monatelang kein Regen', 1], ['wenige Busse', 1]] },
    O: [{ t: 'Ein Jahr am Rand der Sahara: Ordne von der Regenzeit an.', items: ['im Sommer fällt Regen', 'Hirse wird gesät und wächst', 'die Ernte wird eingebracht', 'monatelang fällt kein Regen'], w: 'Bleibt der Regen aus, fällt die Ernte aus: eine Dürre.' }],
    T: [{ f: 'Die größte Wüste Afrikas heißt ___.', a: 'Sahara', w: 'Niger liegt an ihrem Südrand.' }],
    E: { f: 'Wo wurde dieses Foto aufgenommen?', arten: [['sahel', 'am Rand der Wüste', 'Trockener, sandiger Boden mit wenigen Bäumen.'], ['regenwald', 'im Tropischen Regenwald', 'Dichter, grüner Wald.'], ['polar', 'im Polargebiet', 'Eis und kaltes Meer.']] },
  });
  G.polar = baue('geo5-polar', {
    h: 'In den Polargebieten ist es sehr kalt. Im Sommer geht die Sonne wochenlang nicht unter (Polartag), im Winter nicht auf (Polarnacht).',
    F: [
      { f: 'Was ist die <b>Polarnacht</b>?', a: 'eine Zeit im Winter, in der die Sonne gar nicht aufgeht', x: ['eine besonders kurze Nacht', 'die Nacht zum 1. Januar', 'eine Nacht ohne Mond'], w: 'Am Pol dauert die Polarnacht ein halbes Jahr.' },
      { f: 'Was ist der <b>Polartag</b>?', a: 'eine Zeit im Sommer, in der die Sonne gar nicht untergeht', x: ['ein Feiertag am Nordpol', 'ein besonders kalter Tag', 'der kürzeste Tag des Jahres'], w: 'Man nennt es auch Mitternachtssonne.' },
      { f: 'Wie heißen die Ureinwohner in der Arktis, zum Beispiel in Grönland und Kanada?', a: 'Inuit', x: ['Aborigines', 'Tuareg', 'Maya'], w: 'Früher jagten sie Robben und Wale, heute leben viele in modernen Siedlungen.' },
      { f: 'Welches Verkehrsmittel benutzen viele Menschen in der Arktis im Winter?', a: 'Schneemobil oder Hundeschlitten', x: ['Fahrrad', 'Straßenbahn', 'Kamel'], w: 'Straßen gibt es kaum, im Winter fährt man über Schnee und Eis.' },
      { f: 'Warum wachsen in den Polargebieten keine Bäume?', a: 'Es ist zu kalt und der Sommer ist zu kurz.', x: ['Es regnet zu viel.', 'Die Menschen haben alle gefällt.', 'Es ist zu heiß.'], w: 'Der Boden taut im Sommer nur oben etwas auf.' },
      { f: 'Was bedeutet das Wort <b>Inuit</b>?', a: 'Menschen', x: ['Eisbären', 'Schneehaus', 'Jäger'], w: 'Ein einzelner Mensch heißt in ihrer Sprache „Inuk“.' },
      { f: 'Warum stehen viele Häuser der Inuit auf <b>Stelzen</b>?', a: 'So kommt die Kälte nicht aus dem gefrorenen Boden ins Haus, und das Haus schneit nicht ein.', x: ['Wegen des Hochwassers im Sommer.', 'Damit man weiter sehen kann.', 'Damit keine Eisbären hineinkommen.'], w: 'Die Holzhäuser sind gut geheizt und gedämmt.' },
      { f: 'Was ist ein <b>Iglu</b>?', a: 'ein Haus aus Schneeblöcken, das Jäger früher unterwegs bauten', x: ['ein Boot aus Robbenfell', 'ein Schlitten mit Motor', 'eine warme Jacke'], w: 'Heute wohnen die Inuit in festen Häusern.' },
      { f: 'Wovon ernährten sich die Inuit früher fast nur?', a: 'von Fisch und Fleisch, zum Beispiel von Robben und Karibus', x: ['von Getreide und Obst', 'von Maniok', 'von Hirsebrei'], w: 'Ackerbau ist in der Kälte nicht möglich. Karibus sind die Rentiere Nordamerikas.' },
      { f: 'Was hat den <b>Hundeschlitten</b> im Alltag der Inuit weitgehend ersetzt?', a: 'das Schneemobil (Motorschlitten)', x: ['das Fahrrad', 'die Straßenbahn', 'das Kamel'], w: 'Hundeschlitten sieht man heute vor allem bei Rennen und Touren für Gäste.' },
      { f: 'Welche Kleidung schützt in der Arktis gegen Kälte und Wind?', a: 'ein Parka mit Kapuze aus Pelz und warme Stiefel', x: ['ein T-Shirt und Sandalen', 'ein dünner Regenmantel', 'ein Turban'], w: 'Die Kapuze schützt das Gesicht vor dem eisigen Wind.' },
    ],
    S: { kats: ['früher', 'heute'], f: (b) => `<b>${b}</b>: Leben der Inuit früher oder heute?`, h: 'Früher: alles aus der Natur. Heute: feste Häuser, Motoren, Schule.',
      items: [['Iglu auf der Jagd', 0], ['Hundeschlitten als wichtigstes Fahrzeug', 0], ['Kleidung nur aus Fell', 0], ['Schneemobil', 1], ['geheiztes Holzhaus auf Stelzen', 1], ['Schule mit Computern', 1], ['Smartphone', 1]] },
    O: [{ t: 'Ein Jahr in der Arktis: Ordne vom Winter an.', items: ['Polarnacht: Die Sonne geht nicht auf', 'die Tage werden länger', 'Polartag: Die Sonne geht nicht unter', 'die Tage werden kürzer'], w: 'Schuld ist die schräge Erdachse, wie bei unseren Jahreszeiten.' }],
    T: [{ f: 'Die Ureinwohner der Arktis in Kanada und Grönland heißen ___.', a: 'Inuit', w: 'Das Wort bedeutet „Menschen“.' }],
    E: { f: 'Wo wurde dieses Foto aufgenommen?', arten: [['polar', 'im Polargebiet', 'Eis und kaltes Meer.'], ['sahel', 'am Rand der Wüste', 'Trockener, sandiger Boden.'], ['shanghai', 'in einer Riesenstadt', 'Hochhäuser dicht an dicht.']] },
  });
  G.shanghai = baue('geo5-shanghai', {
    h: 'Shanghai in China ist eine der größten Städte der Erde, mit rund 25 Millionen Einwohnern und dem größten Containerhafen der Welt.',
    F: [
      { f: 'In welchem Land liegt <b>Shanghai</b>?', a: 'China', x: ['Japan', 'Indien', 'Brasilien'], w: 'Shanghai liegt an der Ostküste Chinas, an der Mündung des Jangtsekiang.' },
      { f: 'Wie viele Menschen leben ungefähr in Shanghai?', a: 'rund 25 Millionen', x: ['rund 500 000', 'rund 2 Millionen', 'rund 250 Millionen'], w: 'Das sind etwa sechsmal so viele wie in ganz Sachsen (rund 4 Millionen).' },
      { f: 'Wofür ist Shanghai weltweit bekannt?', a: 'für den größten Containerhafen der Welt und viele Hochhäuser', x: ['für den höchsten Berg der Erde', 'für den größten Regenwald', 'für ewiges Eis'], w: '2024 wurden dort über 51 Millionen Standardcontainer umgeschlagen.' },
      { f: 'Warum bauen Riesenstädte wie Shanghai viele <b>Hochhäuser</b>?', a: 'Auf wenig Fläche sollen sehr viele Menschen wohnen und arbeiten.', x: ['Weil es dort keinen Boden gibt.', 'Weil Hochhäuser billiger als Dörfer sind.', 'Damit man das Meer sieht.'], w: 'In die Höhe bauen spart Fläche.' },
      { f: 'Was ist ein Problem in Riesenstädten?', a: 'viel Verkehr und schlechte Luft', x: ['zu wenig Menschen', 'zu viele Wälder', 'keine Geschäfte'], w: 'Darum bauen viele Städte U-Bahnen und Elektrobusse.' },
      { f: 'Wie heißt der Stadtteil von Shanghai mit den berühmten Hochhäusern?', a: 'Pudong', x: ['Manhattan', 'Altstadt', 'Niamey'], w: 'Um 1990 lagen dort noch Felder. Heute steht dort das Finanzviertel.' },
      { f: 'Wie hoch ist das höchste Gebäude Chinas, der <b>Shanghai Tower</b>?', a: '632 m', x: ['63 m', '232 m', '2962 m'], w: 'Zum Vergleich: Der Berliner Fernsehturm ist 368 m hoch.' },
      { f: 'Shanghai hat rund 25 Millionen Einwohner, Sachsen rund 4 Millionen. Was stimmt?', a: 'In Shanghai leben etwa sechsmal so viele Menschen wie in Sachsen.', x: ['In Sachsen leben mehr Menschen.', 'Es leben gleich viele Menschen dort.', 'In Shanghai leben hundertmal so viele.'], w: 'Dabei ist Shanghai nur etwa ein Drittel so groß wie Sachsen.' },
      { f: 'Was macht in Shanghai die Luft schmutzig?', a: 'Abgase von Autos, Bussen und Fabriken (Feinstaub)', x: ['der Sand aus der Sahara', 'der Rauch von Lagerfeuern', 'der Nebel vom Meer'], w: 'Feinstaub kann krank machen, zum Beispiel Asthma auslösen.' },
      { f: 'Was hilft in Shanghai gegen Stau und schlechte Luft?', a: 'U-Bahn fahren und Elektroroller benutzen', x: ['mehr Autos kaufen', 'breitere Hochhäuser bauen', 'die Fenster schließen'], w: 'Shanghai hat eines der längsten U-Bahn-Netze der Welt.' },
      { f: 'Wie nennt man eine Stadt mit mehr als einer Million Einwohnern?', a: 'Millionenstadt', x: ['Kleinstadt', 'Dorf', 'Hauptstadt'], w: 'In Deutschland sind das Berlin, Hamburg, München und Köln.' },
    ],
    S: { kats: ['Vorteil der Riesenstadt', 'Nachteil der Riesenstadt'], f: (b) => `<b>${b}</b>: Vorteil oder Nachteil der Riesenstadt?`, h: 'Was macht das Leben leichter, was schwerer?',
      items: [['viele Arbeitsplätze', 0], ['viele Schulen und Geschäfte', 0], ['U-Bahn in alle Stadtteile', 0], ['Stau auf den Straßen', 1], ['Feinstaub in der Luft', 1], ['wenig Platz zum Wohnen', 1], ['Lärm', 1]] },
    O: [{ t: 'Wie Pudong entstand: Ordne.', items: ['feuchtes Ackerland am Fluss', 'die ersten Hochhäuser werden gebaut', 'ein Finanzviertel mit Wolkenkratzern entsteht', 'der Shanghai Tower wird das höchste Gebäude Chinas'], w: 'In nur etwa 25 Jahren wurde aus Feldern eine Skyline.' }],
    T: [{ f: 'Shanghai liegt im Land ___.', a: 'China', w: 'An der Ostküste, am Pazifischen Ozean.' }],
    E: { f: 'Wo wurde dieses Foto aufgenommen?', arten: [['shanghai', 'in einer Riesenstadt', 'Hochhäuser dicht an dicht.'], ['polar', 'im Polargebiet', 'Eis und kaltes Meer.'], ['regenwald', 'im Tropischen Regenwald', 'Dichter, grüner Wald.']] },
  });
})();
