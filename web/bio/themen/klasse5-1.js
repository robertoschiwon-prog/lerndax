/* BioDax – Klasse 5, Bereiche 1 bis 3: Merkmale des Lebens, Fische, Lurche
 * (Lehrplan LB 1–3; LINDER Biologie 5, S. 8–57). Texte selbst geschrieben, Fakten nachgeschlagen (faecher/bio/fakten.md).
 */
(function () {
  const D = window.BioDax, U = D.util, G = D.gen;
  const { baue, pick, shuffle } = U;

  // =====================================================
  // Bereich 1: Merkmale des Lebens
  // =====================================================
  G.biologie = baue('b5-biologie', {
    h: 'Biologie ist die Wissenschaft von den Lebewesen. Biologen beobachten genau, stellen eine Vermutung auf und prüfen sie mit einem Versuch.',
    F: [
      { f: 'Womit beschäftigt sich die <b>Biologie</b>?', a: 'mit Lebewesen: Tieren, Pflanzen, Pilzen, Bakterien und Menschen', x: ['mit Sternen und Planeten', 'mit Gesteinen', 'mit Strom und Magneten'], w: '„Bios“ ist griechisch und heißt Leben. Biologie ist die Lehre vom Leben.' },
      { f: 'Welche Wissenschaft untersucht <b>Gesteine</b>?', a: 'Geologie', x: ['Biologie', 'Astronomie', 'Chemie'], w: 'Geologie ist die Gesteinskunde.' },
      { f: 'Welche Wissenschaft untersucht <b>Sterne und Planeten</b>?', a: 'Astronomie', x: ['Biologie', 'Geologie', 'Chemie'], w: 'Astronomie ist die Himmelskunde.' },
      { f: 'Welche Wissenschaft untersucht, wie sich <b>Stoffe umwandeln</b>, zum Beispiel wenn Eisen rostet?', a: 'Chemie', x: ['Biologie', 'Astronomie', 'Geologie'], w: 'Rosten oder Verbrennen sind Stoffumwandlungen. Damit beschäftigt sich die Chemie.' },
      { f: 'Lena schaut eine Stunde lang zu, was eine Amsel frisst, und schreibt es auf. Was tut sie?', a: 'Sie beobachtet.', x: ['Sie macht ein Experiment.', 'Sie stellt eine Vermutung auf.', 'Sie misst.'], w: 'Beobachten heißt: genau hinsehen, ohne etwas zu verändern.' },
      { f: 'Tom glaubt: „Meerschweinchen fressen lieber Löwenzahn als Brot.“ Was ist das?', a: 'eine Vermutung', x: ['ein Ergebnis', 'eine Beobachtung', 'ein Protokoll'], w: 'Eine Vermutung ist eine Idee, die man noch prüfen muss.' },
      { f: 'Wie prüft man eine Vermutung am besten?', a: 'mit einem Experiment (Versuch)', x: ['durch Abstimmen in der Klasse', 'gar nicht', 'indem man fest daran glaubt'], w: 'Im Experiment verändert man gezielt eine Sache und schaut, was passiert.' },
      { f: 'Warum schreibt man bei einem Versuch ein <b>Protokoll</b>?', a: 'Damit andere den Versuch genauso wiederholen und prüfen können.', x: ['Damit das Heft voll wird.', 'Weil Versuche sonst nicht gelingen.', 'Damit niemand das Ergebnis erfährt.'], w: 'Im Protokoll stehen Frage, Material, Durchführung, Beobachtung und Ergebnis.' },
      { f: 'Mit welchem Gerät sieht man die Schuppen eines Fisches <b>vergrößert</b>?', a: 'mit einer Lupe', x: ['mit einem Thermometer', 'mit einer Waage', 'mit einem Lineal'], w: 'Die Lupe vergrößert kleine Dinge.' },
      { f: 'Zwei Vögel nebeneinander stellen und schauen, was gleich und was verschieden ist: Wie heißt diese Arbeitsweise?', a: 'Vergleichen', x: ['Messen', 'Experimentieren', 'Protokollieren'], w: 'Beim Vergleichen sucht man Gemeinsamkeiten und Unterschiede.' },
    ],
    T: [
      { f: 'Die Wissenschaft von den Lebewesen heißt ___.', a: 'Biologie', w: 'Biologie = Lehre vom Leben.' },
      { f: 'Eine Idee, die man erst noch prüfen muss, nennt man ___.', a: ['Vermutung', 'Hypothese'], w: 'Das Fachwort dafür ist Hypothese.' },
      { f: 'Ein geplanter Versuch heißt auch ___.', a: ['Experiment', 'Versuch'], w: 'Mit dem Experiment prüft man die Vermutung.' },
    ],
    O: [
      { t: 'So arbeiten Forscherinnen und Forscher. Bringe die Schritte in die richtige Reihenfolge.', items: ['Beobachtung und Frage', 'Vermutung', 'Experiment', 'Ergebnis'], w: 'Erst kommt die Frage, dann die Vermutung, dann der Versuch, am Ende das Ergebnis.' },
      { t: 'Ein Versuchsprotokoll: Bringe die Teile in die richtige Reihenfolge.', items: ['Frage', 'Material', 'Durchführung', 'Beobachtung', 'Ergebnis'], n: 4, w: 'Frage → Material → Durchführung → Beobachtung → Ergebnis.' },
    ],
    S: { kats: ['Biologie', 'andere Naturwissenschaft'], f: (x) => `Wer untersucht das? <b>${x}</b>`, h: 'Biologie: alles, was lebt.',
      items: [['Wie atmet ein Fisch?', 0], ['Warum fallen Blätter im Herbst?', 0], ['Wie wächst ein Pilz?', 0], ['Wie findet die Fledermaus ihre Beute?', 0], ['Wie entsteht ein Blitz?', 1, 'Physik'], ['Woraus besteht Granit?', 1, 'Geologie'], ['Wie weit ist der Mond entfernt?', 1, 'Astronomie'], ['Warum rostet Eisen?', 1, 'Chemie']] },
  }, { frage: 46, tippen: 14, ordnen: 18, sortieren: 22, passtNicht: 0 });

  const LEBT = { kats: ['lebt', 'lebt nicht'], f: (x) => `Lebewesen oder nicht? <b>${x}</b>`, h: 'Ein Lebewesen zeigt alle Kennzeichen: Es bewegt sich, reagiert auf Reize, hat einen Stoffwechsel, wächst und pflanzt sich fort.',
    nicht: 'Drei gehören zusammen. Was <b>passt nicht</b> dazu?',
    items: [['Schnecke', 0], ['Pilz', 0, 'Pilze wachsen, ernähren sich und pflanzen sich fort.'], ['Gänseblümchen', 0, 'Auch Pflanzen leben.'], ['Bakterium', 0], ['Baum', 0], ['Regenwurm', 0], ['Moos', 0],
      ['Kerzenflamme', 1, 'Sie „frisst“ Wachs und braucht Luft, aber sie pflanzt sich nicht fort und reagiert nicht auf Reize.'], ['Roboter', 1, 'Er bewegt sich, wächst aber nicht und pflanzt sich nicht fort.'], ['Wolke', 1], ['Stein', 1], ['Auto', 1, 'Es fährt und braucht Benzin, aber es wächst nicht und bekommt keine Jungen.'], ['Kristall', 1, 'Ein Kristall kann größer werden, hat aber keinen Stoffwechsel.'], ['Fluss', 1]] };
  G.kennzeichen = baue('b5-kennzeichen', {
    h: LEBT.h,
    S: LEBT,
    F: [
      { f: 'Eine Maus hört ein Geräusch und flitzt in ihr Loch. Welches Kennzeichen des Lebens zeigt sich?', a: 'Reizbarkeit', x: ['Wachstum', 'Fortpflanzung', 'Ernährung'], w: 'Das Geräusch ist ein Reiz. Die Maus nimmt ihn wahr und reagiert darauf.' },
      { f: 'Eine Sonnenblume dreht ihre Blüte zur Sonne. Welches Kennzeichen zeigt sich?', a: 'Reizbarkeit und Bewegung', x: ['Fortpflanzung', 'Atmung', 'Wachstum'], w: 'Das Licht ist der Reiz. Auch Pflanzen bewegen sich, nur langsam.' },
      { f: 'Aus einer Kaulquappe wird ein Frosch. Welches Kennzeichen zeigt sich?', a: 'Wachstum und Entwicklung', x: ['Reizbarkeit', 'Atmung', 'Bewegung'], w: 'Lebewesen werden größer und verändern sich dabei.' },
      { f: 'Eine Katze bekommt vier Junge. Welches Kennzeichen zeigt sich?', a: 'Fortpflanzung', x: ['Stoffwechsel', 'Reizbarkeit', 'Bewegung'], w: 'Lebewesen bringen Nachkommen hervor.' },
      { f: 'Ein Hund frisst, atmet und setzt Kot ab. Wie heißt das Kennzeichen, das alle drei zusammenfasst?', a: 'Stoffwechsel', x: ['Reizbarkeit', 'Fortpflanzung', 'Wachstum'], w: 'Stoffe werden aufgenommen, im Körper umgewandelt und wieder abgegeben.' },
      { f: 'Die Blättchen einer <b>Mimose</b> klappen zusammen, wenn man sie berührt. Was beweist das?', a: 'Auch Pflanzen reagieren auf Reize.', x: ['Mimosen sind Tiere.', 'Pflanzen leben nicht.', 'Mimosen haben Muskeln.'], w: 'Die Berührung ist der Reiz, das Zusammenklappen die Reaktion.' },
      { f: 'Eine Kerzenflamme „frisst“ Wachs, braucht Luft und kann größer werden. Warum ist sie trotzdem <b>kein</b> Lebewesen?', a: 'Weil sie nicht alle Kennzeichen zeigt, zum Beispiel keine Fortpflanzung.', x: ['Weil sie heiß ist.', 'Weil sie leuchtet.', 'Weil sie zu klein ist.'], w: 'Nur wer <b>alle</b> Kennzeichen des Lebens zeigt, ist ein Lebewesen.' },
      { f: 'Welche Gruppe zeigt nur <b>Kennzeichen des Lebens</b>?', a: 'Bewegung, Wachstum, Fortpflanzung', x: ['Bewegung, Farbe, Gewicht', 'Größe, Form, Geruch', 'Wärme, Licht, Lärm'], w: 'Dazu kommen noch Reizbarkeit und Stoffwechsel.' },
      { f: 'Was nehmen Tiere bei der <b>Atmung</b> auf?', a: 'Sauerstoff', x: ['Kohlenstoffdioxid', 'Stickstoff', 'Wasserdampf'], w: 'Sie nehmen Sauerstoff auf und geben Kohlenstoffdioxid ab.' },
      { f: 'Bewegen sich Pflanzen?', a: 'Ja, aber meist sehr langsam: Sie wachsen zum Licht oder öffnen ihre Blüten.', x: ['Nein, niemals.', 'Ja, sie laufen nachts umher.', 'Nur wenn der Wind weht.'], w: 'Wind bewegt Pflanzen nur von außen. Das Wenden zum Licht machen sie selbst.' },
    ],
    T: [
      { f: 'Fressen, Atmen und Ausscheiden gehören zum ___.', a: 'Stoffwechsel', w: 'Stoffe werden aufgenommen, umgewandelt und abgegeben.' },
      { f: 'Wenn ein Lebewesen auf Licht, Geräusche oder Berührung reagiert, nennt man das ___.', a: 'Reizbarkeit', w: 'Licht, Schall und Berührung sind Reize.' },
      { f: 'Wenn Lebewesen Nachkommen bekommen, nennt man das ___.', a: 'Fortpflanzung', w: 'So bleibt die Art erhalten.' },
    ],
    A: { w: ['Auch Pflanzen sind Lebewesen.', 'Ein Lebewesen zeigt alle Kennzeichen des Lebens.', 'Pilze sind Lebewesen.', 'Lebewesen wachsen und entwickeln sich.'],
      f: ['Nur Tiere sind Lebewesen.', 'Ein Auto lebt, weil es sich bewegt.', 'Pflanzen reagieren nicht auf Reize.', 'Eine Kerzenflamme ist ein Lebewesen.'] },
  }, { frage: 38, sortieren: 26, passtNicht: 10, tippen: 12, aussage: 14 });

  // =====================================================
  // Bereich 2: Fische in ihren Lebensräumen
  // =====================================================
  G.fischBau = baue('b5-fisch-bau', {
    h: 'Der Fischkörper ist stromlinienförmig: vorn und hinten schmal. Die Schwanzflosse treibt an, Brust- und Bauchflossen steuern, Rücken- und Afterflosse halten den Fisch aufrecht.',
    B: { svg: 'fischNr', teile: D.teile.fischNr, was: { 'Rückenflosse': 'Sie verhindert, dass der Fisch zur Seite kippt.', 'Schwanzflosse': 'Sie treibt den Fisch an.', 'Afterflosse': 'Sie hält den Fisch zusammen mit der Rückenflosse aufrecht.', 'Bauchflosse': 'Bauchflossen gibt es paarweise. Sie helfen beim Steuern.', 'Brustflosse': 'Brustflossen gibt es paarweise. Mit ihnen steuert und bremst der Fisch.', 'Kiemendeckel': 'Darunter liegen die Kiemen.' } },
    F: [
      { f: 'Welche Flosse <b>treibt</b> den Fisch an?', a: 'die Schwanzflosse', x: ['die Rückenflosse', 'die Brustflossen', 'die Afterflosse'], w: 'Der Fisch schlägt mit dem Schwanz hin und her und schiebt sich so vorwärts.' },
      { f: 'Wozu dienen <b>Brust- und Bauchflossen</b>?', a: 'zum Steuern und Bremsen', x: ['zum Atmen', 'zum Antrieb', 'zum Fressen'], w: 'Es gibt sie paarweise: links und rechts je eine.' },
      { f: 'Wozu dienen <b>Rücken- und Afterflosse</b>?', a: 'Sie verhindern, dass der Fisch umkippt.', x: ['Sie treiben den Fisch an.', 'Damit atmet der Fisch.', 'Damit tastet der Fisch.'], w: 'Sie wirken wie der Kiel eines Bootes.' },
      { f: 'Der Fischkörper ist vorn und hinten schmal. Wie nennt man diese Form?', a: 'Stromlinienform', x: ['Kugelform', 'Würfelform', 'Sternform'], w: 'So gleitet der Fisch mit wenig Widerstand durch das Wasser.' },
      { f: 'Wozu dient die <b>Schleimschicht</b> auf der Fischhaut?', a: 'Der Fisch gleitet leichter durch das Wasser und ist geschützt.', x: ['Damit atmet der Fisch.', 'Sie hält den Fisch warm.', 'Damit kann der Fisch leuchten.'], w: 'Der Schleim verringert die Reibung und schützt die Haut.' },
      { f: 'Woraus bestehen die <b>Schuppen</b> der Fische?', a: 'aus Knochen', x: ['aus Horn', 'aus Haaren', 'aus Kalk wie eine Eierschale'], w: 'Die Knochenschuppen liegen in der Haut wie Dachziegel übereinander.' },
      { f: 'Mit welchem Organ kann ein Fisch im Wasser <b>schweben</b>, ohne zu sinken oder zu steigen?', a: 'mit der Schwimmblase', x: ['mit den Kiemen', 'mit dem Magen', 'mit den Schuppen'], w: 'Sie ist mit Gas gefüllt. Mehr Gas: Der Fisch steigt. Weniger Gas: Er sinkt.' },
      { f: 'Was spürt ein Fisch mit dem <b>Seitenlinienorgan</b>?', a: 'Strömungen und Bewegungen im Wasser', x: ['Gerüche', 'Farben', 'Wärme'], w: 'So merkt er Hindernisse, Beute und Feinde auch im Dunkeln.', svg: 'seitenlinie' },
      { f: 'Karpfen haben am Maul kleine Fäden, die <b>Barteln</b>. Wozu dienen sie?', a: 'zum Tasten am Gewässergrund', x: ['zum Atmen', 'zum Schwimmen', 'zum Festhalten der Beute'], w: 'Mit den Barteln ertastet der Karpfen seine Nahrung im Schlamm.', svg: 'karpfen' },
      { f: 'Im kalten Wasser ist auch der Fisch kalt, im warmen Wasser warm. Fische sind …', a: 'wechselwarm', x: ['gleichwarm', 'immer warm', 'immer eiskalt'], w: 'Ihre Körpertemperatur richtet sich nach der Umgebung.' },
      { f: 'In welche drei Abschnitte ist der Fischkörper gegliedert?', a: 'Kopf, Rumpf, Schwanz', x: ['Kopf, Hals, Bauch', 'Kopf, Brust, Hinterleib', 'Kopf, Arme, Beine'], w: 'Einen Hals haben Fische nicht.' },
    ],
    T: [
      { f: 'Für den Antrieb sorgt die ___.', a: 'Schwanzflosse', w: 'Sie schlägt hin und her.' },
      { f: 'Mit der ___ kann der Fisch im Wasser schweben.', a: 'Schwimmblase', w: 'Sie ist mit Gas gefüllt.' },
      { f: 'Die Körperform der Fische nennt man ___.', a: ['Stromlinienform', 'stromlinienförmig'], w: 'Vorn und hinten schmal: wenig Widerstand.' },
      { f: 'Die Haut der Fische ist mit ___ aus Knochen bedeckt.', a: 'Schuppen', w: 'Darüber liegt eine Schleimschicht.' },
    ],
    A: { w: ['Fische sind wechselwarm.', 'Die Schwanzflosse treibt den Fisch an.', 'Fische haben eine Wirbelsäule.', 'Brustflossen gibt es paarweise.'],
      f: ['Fische haben ein Fell.', 'Die Rückenflosse treibt den Fisch an.', 'Fische sind gleichwarm.', 'Fische atmen mit der Schwimmblase.'] },
  }, { beschriften: 26, frage: 40, tippen: 16, aussage: 14 });

  G.fischKiemen = baue('b5-fisch-kiemen', {
    h: 'Fische atmen mit Kiemen. Das Wasser strömt durch das Maul hinein, an den Kiemen vorbei und unter dem Kiemendeckel wieder hinaus. Dabei geht der Sauerstoff aus dem Wasser ins Blut.',
    O: [
      { t: 'Der Weg des Atemwassers: Bringe die Schritte in die richtige Reihenfolge.', items: ['Der Fisch öffnet das Maul.', 'Wasser strömt in die Mundhöhle.', 'Das Wasser fließt an den Kiemenblättchen vorbei.', 'Sauerstoff geht aus dem Wasser ins Blut.', 'Das Wasser strömt unter dem Kiemendeckel hinaus.'], n: 4, w: 'Maul auf, Wasser hinein, an den Kiemen vorbei, hinten wieder hinaus.' },
    ],
    F: [
      { f: 'Womit atmen Fische?', a: 'mit Kiemen', x: ['mit Lungen', 'mit der Schwimmblase', 'mit den Flossen'], w: 'Die Kiemen liegen links und rechts hinter dem Kopf unter den Kiemendeckeln.' },
      { f: 'Woher bekommt der Fisch den <b>Sauerstoff</b>?', a: 'Er ist im Wasser gelöst.', x: ['Er taucht zum Luftholen auf.', 'Aus dem Futter.', 'Fische brauchen keinen Sauerstoff.'], w: 'Im Wasser ist unsichtbar Sauerstoff gelöst. Die Kiemen holen ihn heraus.' },
      { f: 'Was schützt die empfindlichen Kiemen?', a: 'der Kiemendeckel', x: ['die Schwanzflosse', 'die Schwimmblase', 'die Barteln'], w: 'Er öffnet und schließt sich beim Atmen.' },
      { f: 'Warum sind die <b>Kiemenblättchen</b> rot?', a: 'Sie sind stark durchblutet.', x: ['Sie sind angemalt.', 'Sie sind entzündet.', 'Wegen der Schuppen.'], w: 'In den vielen feinen Blutgefäßen nimmt das Blut den Sauerstoff auf.' },
      { f: 'Warum hat eine Kieme so <b>viele feine Blättchen</b>?', a: 'So entsteht eine große Fläche, die viel Sauerstoff aufnehmen kann.', x: ['Damit sie schöner aussieht.', 'Damit der Fisch schwerer wird.', 'Damit das Wasser nicht hindurchkommt.'], w: 'Viele kleine Blättchen haben zusammen eine riesige Oberfläche.' },
      { f: 'Warum <b>erstickt</b> ein Fisch an Land, obwohl in der Luft viel Sauerstoff ist?', a: 'Die Kiemenblättchen kleben zusammen und trocknen aus.', x: ['Luft ist giftig für Fische.', 'In der Luft ist kein Sauerstoff.', 'Der Fisch vergisst zu atmen.'], w: 'Nur im Wasser bleiben die Blättchen ausgebreitet.' },
      { f: 'Was gibt der Fisch beim Atmen an das Wasser <b>ab</b>?', a: 'Kohlenstoffdioxid', x: ['Sauerstoff', 'Schleim', 'Schuppen'], w: 'Sauerstoff hinein, Kohlenstoffdioxid hinaus.' },
      { f: 'Ein Fisch öffnet und schließt ständig das Maul. Was macht er da?', a: 'Er atmet: Er pumpt Wasser zu den Kiemen.', x: ['Er trinkt.', 'Er spricht mit anderen Fischen.', 'Er kaut.'], w: 'Maul und Kiemendeckel arbeiten wie eine Pumpe.' },
      { f: 'In warmem Wasser ist <b>weniger</b> Sauerstoff gelöst als in kaltem. Was folgt daraus für Fische in einem heißen Sommer?', a: 'Sie können in Atemnot geraten.', x: ['Sie atmen dann mit Lungen.', 'Es geht ihnen besonders gut.', 'Sie brauchen dann keinen Sauerstoff.'], w: 'Deshalb leben Forellen in kühlen, sauerstoffreichen Bächen.' },
    ],
    T: [
      { f: 'Fische atmen mit ___.', a: 'Kiemen', w: 'Sie nehmen Sauerstoff aus dem Wasser auf.' },
      { f: 'Die Kiemen liegen geschützt unter dem ___.', a: 'Kiemendeckel', w: 'Unter jedem Kiemendeckel liegen vier Kiemenbögen.' },
      { f: 'Beim Atmen nimmt der Fisch ___ aus dem Wasser auf.', a: 'Sauerstoff', w: 'Kohlenstoffdioxid gibt er ab.' },
    ],
    A: { w: ['Kiemen nehmen Sauerstoff aus dem Wasser auf.', 'Das Atemwasser strömt durch das Maul hinein.', 'An der Luft kleben die Kiemenblättchen zusammen.'],
      f: ['Fische atmen mit Lungen.', 'Fische brauchen keinen Sauerstoff.', 'Das Atemwasser strömt durch die Kiemen hinein und durch das Maul hinaus.'] },
  }, { frage: 46, ordnen: 20, tippen: 16, aussage: 18 });

  const FISCH_ORT = { kats: ['Süßwasserfisch', 'Meeresfisch', 'Wanderfisch'], f: (x) => `Wo lebt dieser Fisch? <b>${x}</b>`, h: 'Süßwasser: Bäche, Flüsse, Teiche, Seen. Meer: Salzwasser. Wanderfische wechseln zum Laichen zwischen beiden.',
    items: [['Karpfen', 0, 'Er lebt in Teichen und Seen.'], ['Hecht', 0, 'Ein Raubfisch in Seen und Flüssen.'], ['Bachforelle', 0, 'Sie braucht klare, kühle Bäche.'], ['Rotfeder', 0], ['Flussbarsch', 0], ['Wels', 0], ['Stichling', 0],
      ['Hering', 1, 'Er lebt in großen Schwärmen im Meer.'], ['Makrele', 1], ['Kabeljau', 1], ['Scholle', 1, 'Ein Plattfisch am Meeresboden.'], ['Thunfisch', 1],
      ['Lachs', 2, 'Er schlüpft im Fluss, lebt im Meer und kommt zum Laichen in seinen Fluss zurück.'], ['Aal', 2, 'Er lebt im Fluss und wandert zum Laichen ins Meer.'], ['Meerforelle', 2], ['Stör', 2]] };
  G.fischGewaesser = baue('b5-fisch-gewaesser', {
    h: FISCH_ORT.h,
    S: FISCH_ORT,
    E: { f: 'Welcher Fisch ist das?', arten: [['karpfen', 'Karpfen', 'Hoher Rücken, große Schuppen und Barteln am Maul.'], ['hecht', 'Hecht', 'Langer Körper, Maul wie ein Entenschnabel, Rückenflosse weit hinten.'], ['forelle', 'Bachforelle', 'Rote und dunkle Punkte an den Seiten.'], ['aal', 'Aal', 'Lang und dünn wie eine Schlange.']] },
    F: [
      { f: 'Der <b>Lachs</b> ist ein Wanderfisch. Wohin wandert er zum Laichen?', a: 'vom Meer zurück in den Fluss, in dem er geschlüpft ist', x: ['vom Fluss ins Meer', 'von einem See in den nächsten', 'er wandert nicht'], w: 'Er findet seinen Heimatfluss am Geruch wieder.' },
      { f: 'Der <b>Aal</b> wandert zum Laichen …', a: 'vom Fluss ins Meer.', x: ['vom Meer in den Fluss.', 'in einen Bergsee.', 'gar nicht.'], w: 'Aale schwimmen Tausende Kilometer bis in die Sargassosee im Atlantik.' },
      { f: 'Warum lebt die <b>Bachforelle</b> in kühlen, schnell fließenden Bächen?', a: 'Dort ist besonders viel Sauerstoff im Wasser.', x: ['Dort ist das Wasser salzig.', 'Dort gibt es keine anderen Tiere.', 'Dort ist es dunkel.'], w: 'Kaltes, sprudelndes Wasser enthält viel Sauerstoff.' },
      { f: 'Der Hecht frisst andere Fische. Er ist ein …', a: 'Raubfisch', x: ['Friedfisch', 'Wanderfisch', 'Plattfisch'], w: 'Er lauert zwischen Wasserpflanzen und schießt blitzschnell hervor.', svg: 'hecht' },
      { f: 'Karpfen und Rotfeder fressen Kleintiere und Pflanzen, aber keine Fische. Sie sind …', a: 'Friedfische', x: ['Raubfische', 'Wanderfische', 'Meeresfische'], w: 'Friedfische jagen keine anderen Fische.' },
      { f: 'Welcher heimische Fisch <b>baut ein Nest</b> und bewacht die Eier?', a: 'der Stichling', x: ['der Karpfen', 'der Hering', 'der Aal'], w: 'Das Männchen baut das Nest aus Pflanzenteilen und beschützt Eier und Junge.' },
      { f: 'Die <b>Scholle</b> liegt flach auf dem Meeresboden. Wie passt ihr Körper dazu?', a: 'Er ist platt, beide Augen sitzen auf einer Seite.', x: ['Er ist kugelrund.', 'Er ist lang wie eine Schlange.', 'Er hat Beine.'], w: 'So ist sie auf dem Boden gut getarnt.' },
      { f: 'Fische, die im freien Wasser schnell schwimmen (Hering, Makrele), haben meist welche Form?', a: 'eine schlanke Spindelform', x: ['eine platte Form', 'eine Kugelform', 'eine eckige Form'], w: 'Die Spindelform bietet wenig Widerstand.' },
      { f: 'Welche Gruppe der Wirbeltiere hat <b>die meisten Arten</b>?', a: 'die Fische', x: ['die Säugetiere', 'die Vögel', 'die Lurche'], w: 'Es gibt weltweit rund 35.000 Fischarten: etwa die Hälfte aller Wirbeltierarten.' },
    ],
    T: [
      { f: 'Fische, die andere Fische fressen, nennt man ___.', a: ['Raubfische', 'Raubfisch'], w: 'Zum Beispiel Hecht und Zander.' },
      { f: 'Fische, die zwischen Fluss und Meer wechseln, nennt man ___.', a: ['Wanderfische', 'Wanderfisch'], w: 'Zum Beispiel Lachs und Aal.' },
      { f: 'Fische, die keine anderen Fische jagen, nennt man ___.', a: ['Friedfische', 'Friedfisch'], w: 'Zum Beispiel Karpfen und Rotfeder.' },
    ],
  }, { sortieren: 26, passtNicht: 8, erkennen: 22, frage: 32, tippen: 12 });

  G.fischFortpfl = baue('b5-fisch-fortpfl', {
    h: 'Das Weibchen legt die Eier (Laich) ins Wasser, das Männchen gibt seine Spermien darüber. Die Befruchtung findet außerhalb des Körpers statt: äußere Befruchtung.',
    O: [
      { t: 'Von der Forelle zur Forelle: Bringe die Entwicklung in die richtige Reihenfolge.', items: ['Das Weibchen legt die Eier in eine Grube im Kies.', 'Das Männchen gibt seine Spermien über die Eier.', 'Im Ei wächst der Embryo.', 'Die Larve schlüpft, am Bauch hängt der Dottersack.', 'Der Dottersack ist aufgebraucht: ein Jungfisch.', 'Die erwachsene Forelle laicht selbst.'], n: 4, w: 'Ei → Larve mit Dottersack → Jungfisch → erwachsener Fisch.' },
    ],
    F: [
      { f: 'Wie nennt man die abgelegten <b>Eier</b> der Fische?', a: 'Laich', x: ['Brut', 'Gelege', 'Nest'], w: 'Das Ablegen der Eier heißt Laichen.' },
      { f: 'Bei Fischen treffen Eizelle und Spermienzelle im Wasser aufeinander. Wie heißt das?', a: 'äußere Befruchtung', x: ['innere Befruchtung', 'Brutpflege', 'Metamorphose'], w: 'Außerhalb des Körpers: äußere Befruchtung.' },
      { f: 'Wovon lebt eine frisch geschlüpfte <b>Fischlarve</b> in den ersten Tagen?', a: 'vom Vorrat im Dottersack', x: ['von der Milch der Mutter', 'von kleinen Fischen', 'von Wasserpflanzen'], w: 'Der Dottersack hängt am Bauch und wird nach und nach aufgebraucht.' },
      { f: 'Warum legt ein Fischweibchen oft <b>Tausende Eier</b>?', a: 'Weil die meisten Eier und Jungfische gefressen werden.', x: ['Weil die Eltern jedes Junge füttern.', 'Weil Fische gern zählen.', 'Weil das Wasser sonst leer wäre.'], w: 'Die meisten Fische kümmern sich nicht um ihre Eier. Nur wenige Junge überleben.' },
      { f: 'Was bedeutet „<b>geschlechtliche Fortpflanzung</b>“?', a: 'Eine Eizelle und eine Spermienzelle verschmelzen.', x: ['Ein Tier teilt sich in zwei.', 'Die Jungen wachsen aus einer Knospe.', 'Es gibt nur Weibchen.'], w: 'Die Eizelle kommt vom Weibchen, die Spermienzelle vom Männchen.' },
      { f: 'Wohin legt die Bachforelle ihre Eier?', a: 'in eine Grube im Kies des Baches', x: ['in ein Nest im Schilf', 'in den Schlamm eines Teiches', 'ins offene Meer'], w: 'Das Weibchen schlägt die Laichgrube mit dem Schwanz in den Kies.' },
      { f: 'Wie nennt man das Jungtier, das aus dem Fischei schlüpft?', a: 'Larve', x: ['Kaulquappe', 'Küken', 'Welpe'], w: 'Die Fischlarve sieht noch anders aus als ein erwachsener Fisch.' },
      { f: 'Menschen ziehen in Teichen Karpfen oder Forellen auf. Wie nennt man das?', a: 'Fischzucht', x: ['Fischfang', 'Angeln', 'Überfischung'], w: 'In Sachsen gibt es viele Teiche, zum Beispiel in der Oberlausitz und bei Moritzburg.' },
    ],
    T: [
      { f: 'Die Eier der Fische nennt man ___.', a: 'Laich', w: 'Fische laichen.' },
      { f: 'Findet die Befruchtung im Wasser statt, ist es eine ___ Befruchtung.', a: ['äußere', 'äussere'], w: 'Außerhalb des Körpers.' },
      { f: 'Die Fischlarve ernährt sich zuerst aus ihrem ___.', a: 'Dottersack', w: 'Er ist ihr Nahrungsvorrat.' },
    ],
    A: { w: ['Fische haben eine äußere Befruchtung.', 'Aus dem Fischei schlüpft eine Larve.', 'Die meisten Fische kümmern sich nicht um ihre Eier.'],
      f: ['Fische säugen ihre Jungen.', 'Fische haben eine innere Befruchtung und legen Eier an Land.', 'Aus dem Fischei schlüpft eine Kaulquappe.'] },
  }, { frage: 46, ordnen: 22, tippen: 16, aussage: 16 });

  G.fischNahrung = baue('b5-fisch-nahrung', {
    h: 'Eine Nahrungskette beginnt immer mit einer Pflanze. Der Pfeil bedeutet „wird gefressen von“: Alge → Wasserfloh → Rotfeder → Hecht.',
    O: [
      { t: 'Baue die Nahrungskette im See. Beginne mit dem Lebewesen, das <b>zuerst</b> gefressen wird.', items: ['Alge', 'Wasserfloh', 'Rotfeder', 'Hecht'], w: 'Alge → Wasserfloh → Rotfeder → Hecht. Der Pfeil heißt: „wird gefressen von“.' },
      { t: 'Baue die Nahrungskette. Beginne mit der Pflanze.', items: ['Wasserpflanze', 'Schlammschnecke', 'Plötze', 'Hecht'], w: 'Am Anfang steht immer eine Pflanze, am Ende der Endverbraucher.' },
      { t: 'Baue die Nahrungskette. Beginne mit der Pflanze.', items: ['Alge', 'Kaulquappe', 'Flussbarsch', 'Fischotter'], w: 'Pflanze → Pflanzenfresser → Raubfisch → Endverbraucher.' },
    ],
    F: [
      { f: 'Womit <b>beginnt</b> jede Nahrungskette?', a: 'mit einer Pflanze', x: ['mit einem Raubfisch', 'mit einem Menschen', 'mit einem Stein'], w: 'Pflanzen stellen ihre Nährstoffe mit Hilfe des Sonnenlichts selbst her.' },
      { f: 'Pflanzen stellen Nährstoffe selbst her. Wie nennt man sie deshalb in der Nahrungskette?', a: 'Erzeuger', x: ['Verbraucher', 'Endverbraucher', 'Räuber'], w: 'Ein anderes Wort für Erzeuger ist Produzent.' },
      { f: 'Tiere müssen Nährstoffe fressen. Wie nennt man sie in der Nahrungskette?', a: 'Verbraucher', x: ['Erzeuger', 'Zersetzer', 'Pflanzen'], w: 'Ein anderes Wort für Verbraucher ist Konsument.' },
      { f: 'Alge → Wasserfloh → Rotfeder → Hecht. Wer ist der <b>Endverbraucher</b>?', a: 'der Hecht', x: ['die Alge', 'der Wasserfloh', 'die Rotfeder'], w: 'Der Endverbraucher steht am Ende der Kette.' },
      { f: 'Was bedeutet der <b>Pfeil</b> in einer Nahrungskette?', a: '„wird gefressen von“', x: ['„frisst“', '„ist größer als“', '„schwimmt zu“'], w: 'Der Pfeil zeigt vom Futter zum Fresser.' },
      { f: 'In einem See sterben alle <b>Hechte</b>. Was passiert zunächst mit den Rotfedern?', a: 'Es werden mehr, weil sie niemand frisst.', x: ['Sie sterben sofort auch.', 'Es werden weniger.', 'Nichts ändert sich.'], w: 'Später fressen die vielen Rotfedern die Wasserflöhe weg. Alles hängt zusammen.' },
      { f: 'Der Hecht frisst Rotfedern, Plötzen und Frösche. Viele Nahrungsketten sind so miteinander verknüpft. Wie nennt man das?', a: 'Nahrungsnetz', x: ['Nahrungsleine', 'Fischernetz', 'Nahrungsturm'], w: 'Mehrere verbundene Ketten bilden ein Netz.' },
      { f: 'Der Wasserfloh frisst Algen. Er ist ein …', a: 'Pflanzenfresser', x: ['Raubfisch', 'Erzeuger', 'Endverbraucher'], w: 'Pflanzenfresser sind die ersten Verbraucher in der Kette.' },
    ],
    T: [
      { f: 'Jede Nahrungskette beginnt mit einer ___.', a: ['Pflanze', 'Alge'], w: 'Pflanzen sind die Erzeuger.' },
      { f: 'Pflanzen nennt man in der Nahrungskette ___.', a: ['Erzeuger', 'Produzenten', 'Produzent'], w: 'Sie stellen Nährstoffe selbst her.' },
      { f: 'Mehrere verknüpfte Nahrungsketten bilden ein ___.', a: 'Nahrungsnetz', w: 'Die meisten Tiere fressen mehr als eine Art.' },
    ],
    S: { kats: ['Erzeuger', 'Verbraucher'], f: (x) => `Erzeuger oder Verbraucher? <b>${x}</b>`, h: 'Pflanzen erzeugen Nährstoffe, Tiere verbrauchen sie.',
      items: [['Alge', 0], ['Seerose', 0], ['Schilf', 0], ['Wasserpest', 0, 'Die Wasserpest ist eine Wasserpflanze.'], ['Wasserfloh', 1], ['Hecht', 1], ['Rotfeder', 1], ['Graureiher', 1], ['Kaulquappe', 1]] },
  }, { ordnen: 26, frage: 38, tippen: 12, sortieren: 16, passtNicht: 8 });

  const HILFT = (kats, items, f) => ({ kats, items, f, h: 'Überlege: Wird der Lebensraum besser oder schlechter? Können die Tiere wandern, fressen und sich fortpflanzen?' });
  G.fischSchutz = baue('b5-fisch-schutz', {
    h: 'Fische brauchen sauberes Wasser, freie Wanderwege und Zeit zum Laichen.',
    S: HILFT(['hilft den Fischen', 'schadet den Fischen'], [['Fischtreppe an einem Wehr', 0, 'So kommen Wanderfische am Hindernis vorbei.'], ['Kläranlage', 0, 'Sie reinigt das Abwasser.'], ['Schonzeit zur Laichzeit', 0, 'In dieser Zeit darf die Art nicht gefangen werden.'], ['Mindestmaß beim Angeln', 0, 'Kleine Fische kommen zurück ins Wasser und können sich noch fortpflanzen.'], ['Fluss mit natürlichem Ufer', 0], ['Jungfische aussetzen', 0],
      ['ungeklärtes Abwasser', 1], ['Wehr ohne Fischtreppe', 1, 'Wanderfische kommen nicht zu ihren Laichplätzen.'], ['Überfischung', 1, 'Es wird mehr gefangen, als nachwachsen kann.'], ['begradigter Fluss mit Betonufer', 1], ['Müll im Wasser', 1], ['zu viel Dünger im Wasser', 1]], (x) => `Hilft es den Fischen oder schadet es? <b>${x}</b>`),
    F: [
      { f: 'Wozu dient eine <b>Fischtreppe</b>?', a: 'Fische können ein Wehr oder Kraftwerk umschwimmen.', x: ['Damit Fische an Land gehen können.', 'Zum Angeln.', 'Zum Füttern der Fische.'], w: 'Das Wasser fließt in kleinen Stufen. Wanderfische wie der Lachs schwimmen hinauf.' },
      { f: 'Was bedeutet <b>Überfischung</b>?', a: 'Es werden mehr Fische gefangen, als nachwachsen.', x: ['Es gibt zu viele Fische.', 'Fische fressen zu viel.', 'Ein See läuft über.'], w: 'Dann wird der Bestand immer kleiner.' },
      { f: 'Was ist eine <b>Schonzeit</b>?', a: 'eine Zeit, in der eine Fischart nicht gefangen werden darf', x: ['eine Zeit, in der Fische schlafen', 'die Zeit des Winterschlafs', 'ein Angelwettbewerb'], w: 'Die Schonzeit liegt meist in der Laichzeit.' },
      { f: 'Der <b>Lachs</b> war in Sachsen ausgestorben. Was war ein Grund dafür?', a: 'Die Elbe war verschmutzt und durch Wehre versperrt.', x: ['Das Wasser war zu sauber.', 'Die Lachse wanderten nach Afrika aus.', 'Es gab zu viele Hechte.'], w: 'Lachse brauchen saubere Laichgewässer und einen Weg ohne Hindernisse.' },
      { f: 'Seit 1995 werden in Sachsen junge Lachse ausgesetzt. Was geschah 1998?', a: 'Die ersten Lachse kehrten aus dem Meer zum Laichen zurück.', x: ['Alle Lachse starben.', 'Die Lachse wurden verboten.', 'Die Elbe trocknete aus.'], w: 'Sie kamen in den Lachsbach in der Sächsischen Schweiz zurück.' },
      { f: 'Warum dürfen Angler zu kleine Fische nicht mitnehmen (<b>Mindestmaß</b>)?', a: 'Die Fische sollen sich erst fortpflanzen können.', x: ['Kleine Fische schmecken nicht.', 'Kleine Fische sind giftig.', 'Das ist nur ein Brauch.'], w: 'Wer sich fortgepflanzt hat, hat für Nachwuchs gesorgt.' },
      { f: 'Warum schadet zu viel <b>Dünger</b> von den Feldern einem See?', a: 'Algen wachsen stark, später fehlt den Fischen der Sauerstoff.', x: ['Der See wird zu salzig.', 'Die Fische werden zu dick.', 'Das Wasser gefriert.'], w: 'Sterben die vielen Algen ab, verbraucht ihre Zersetzung den Sauerstoff im Wasser.' },
    ],
    T: [
      { f: 'An einem Wehr hilft den Wanderfischen eine ___.', a: ['Fischtreppe', 'Fischtreppen'], w: 'Auch Fischpass genannt.' },
      { f: 'Wenn mehr Fische gefangen werden, als nachwachsen, spricht man von ___.', a: 'Überfischung', w: 'Davon sind viele Meeresfische betroffen.' },
    ],
  }, { sortieren: 30, passtNicht: 8, frage: 46, tippen: 16 });

  // =====================================================
  // Bereich 3: Lurche in ihren Lebensräumen
  // =====================================================
  G.lurchBau = baue('b5-lurch-bau', {
    h: 'Lurche heißen auch Amphibien: „in beidem lebend“, im Wasser und an Land. Froschlurche haben keinen Schwanz, kurze Vorderbeine und lange, kräftige Hinterbeine.',
    F: [
      { f: 'Was bedeutet das Wort <b>Amphibie</b>?', a: 'in beidem lebend: im Wasser und an Land', x: ['im Wasser lebend', 'an Land lebend', 'in der Luft lebend'], w: 'Lurche leben als Larve im Wasser und später meist an Land.' },
      { f: 'Wozu dienen die <b>Schwimmhäute</b> zwischen den Zehen?', a: 'Der Frosch drückt damit mehr Wasser weg und schwimmt schneller.', x: ['Damit atmet der Frosch.', 'Damit klettert der Frosch auf Bäume.', 'Sie halten die Füße warm.'], w: 'Die gespreizten Zehen wirken wie Paddel.', svg: 'wasserfrosch' },
      { f: 'Warum sind die <b>Hinterbeine</b> des Frosches so lang und kräftig?', a: 'zum Springen und Schwimmen', x: ['zum Graben', 'zum Festhalten der Beute', 'zum Klettern an Felsen'], w: 'Er streckt sie blitzschnell und schnellt so nach vorn.', svg: 'grasfrosch' },
      { f: 'Wozu braucht der Frosch beim Springen die <b>Vorderbeine</b>?', a: 'Er fängt sich bei der Landung damit ab.', x: ['Er stößt sich damit ab.', 'Er steuert damit in der Luft.', 'Gar nicht.'], w: 'Abstoßen mit den Hinterbeinen, landen auf den Vorderbeinen.' },
      { f: 'Wie viele Finger hat ein Frosch an einem <b>Vorderbein</b>?', a: 'vier', x: ['zwei', 'fünf', 'sechs'], w: 'Vorn vier Finger, hinten fünf Zehen.' },
      { f: 'Woran erkennst du einen <b>Froschlurch</b> (Frosch, Kröte, Unke)?', a: 'Das erwachsene Tier hat keinen Schwanz.', x: ['Er hat einen langen Schwanz.', 'Er hat Schuppen.', 'Er hat sechs Beine.'], w: 'Molche und Salamander haben einen Schwanz: Sie sind Schwanzlurche.' },
      { f: 'Frösche können den Kopf kaum drehen. Wie behalten sie trotzdem den Überblick?', a: 'Die großen Augen sitzen erhöht oben am Kopf.', x: ['Sie haben Augen am Rücken.', 'Sie drehen den ganzen Körper im Kreis.', 'Sie sehen gar nichts.'], w: 'So sehen sie fast rundherum, sogar wenn nur die Augen aus dem Wasser schauen.' },
      { f: 'Der Wasserfrosch legt beim Schwimmen die Vorderbeine eng an. Welche Form bekommt sein Körper dadurch?', a: 'eine Stromlinienform', x: ['eine Kugelform', 'eine Würfelform', 'eine Sternform'], w: 'Wie bei den Fischen: wenig Widerstand im Wasser.' },
      { f: 'Welche Tiere sind <b>Lurche</b>?', a: 'Frösche, Kröten, Unken, Molche und Salamander', x: ['Eidechsen und Schlangen', 'Fische und Krebse', 'Schnecken und Würmer'], w: 'Eidechsen und Schlangen sind Kriechtiere.' },
      { f: 'Wie viele Lurcharten sind in Deutschland heimisch?', a: 'etwa 21', x: ['etwa 2', 'etwa 500', 'etwa 7000'], w: 'Weltweit gibt es mehrere tausend Arten, die meisten in den warmen, feuchten Tropen.' },
    ],
    T: [
      { f: 'Lurche nennt man mit einem Fremdwort auch ___.', a: ['Amphibien', 'Amphibie'], w: 'Das heißt: in beidem lebend.' },
      { f: 'Zwischen den Zehen der Hinterbeine hat der Frosch ___.', a: ['Schwimmhäute', 'Schwimmhaut'], w: 'Sie wirken wie Paddel.' },
      { f: 'Frösche, Kröten und Unken haben keinen Schwanz. Sie sind ___.', a: ['Froschlurche', 'Froschlurch'], w: 'Molche und Salamander sind Schwanzlurche.' },
    ],
    O: [
      { t: 'Ein Frosch springt. Bringe die Bewegung in die richtige Reihenfolge.', items: ['Der Frosch sitzt mit angewinkelten Hinterbeinen.', 'Er drückt die Hinterbeine gegen den Boden und streckt sie.', 'Er fliegt gestreckt durch die Luft.', 'Er landet auf den Vorderbeinen.'], w: 'Anwinkeln, abstoßen, fliegen, mit den Vorderbeinen abfangen.' },
    ],
    A: { w: ['Froschlurche haben lange Hinterbeine.', 'Lurche gehören zu den Wirbeltieren.', 'Frösche haben Schwimmhäute.', 'Erwachsene Frösche haben keinen Schwanz.'],
      f: ['Frösche haben einen langen Schwanz.', 'Frösche haben Schuppen wie Fische.', 'Lurche sind Insekten.', 'Frösche stoßen sich mit den Vorderbeinen ab.'] },
  }, { frage: 50, tippen: 16, ordnen: 14, aussage: 20 });

  G.lurchBeute = baue('b5-lurch-beute', {
    h: 'Frösche sind Ansitzjäger: Sie warten gut getarnt, bis sich etwas bewegt. Dann schnellt die klebrige Klappzunge heraus.',
    O: [
      { t: 'Ein Frosch fängt eine Fliege. Bringe die Schritte in die richtige Reihenfolge.', items: ['Der Frosch sitzt still und gut getarnt.', 'Eine Fliege bewegt sich in der Nähe.', 'Die Klappzunge schnellt heraus.', 'Die Fliege bleibt an der Zunge kleben.', 'Der Frosch verschluckt die Fliege im Ganzen.'], n: 4, w: 'Warten, sehen, Zunge raus, kleben, schlucken.' },
    ],
    F: [
      { f: 'Frösche sitzen still und warten auf Beute. Wie nennt man solche Jäger?', a: 'Ansitzjäger', x: ['Hetzjäger', 'Schleichjäger', 'Sammler'], w: 'Sie sitzen an und lauern, statt der Beute nachzulaufen.' },
      { f: 'Womit fängt der Frosch seine Beute?', a: 'mit der klebrigen Klappzunge', x: ['mit den Vorderbeinen', 'mit spitzen Zähnen', 'mit einem Netz'], w: 'Die Zunge ist vorn im Maul angewachsen und klappt blitzschnell heraus.' },
      { f: 'Die Haut eines Frosches hat fast die Farbe seiner Umgebung. Wie nennt man das?', a: 'Tarnfärbung', x: ['Warnfärbung', 'Wassertracht', 'Häutung'], w: 'Feinde und Beutetiere übersehen ihn leicht.' },
      { f: 'Worauf achtet ein Frosch bei seiner Beute vor allem?', a: 'ob sie sich bewegt', x: ['ob sie gut riecht', 'ob sie bunt ist', 'ob sie Geräusche macht'], w: 'Eine Fliege, die stillsitzt, bemerkt der Frosch oft gar nicht.' },
      { f: 'Was fressen erwachsene Frösche?', a: 'Insekten, Würmer und Schnecken', x: ['Wasserpflanzen', 'Körner', 'Fische aus dem Meer'], w: 'Sie fressen, was sich bewegt und ins Maul passt.' },
      { f: 'Kaut ein Frosch seine Beute?', a: 'Nein, er verschluckt sie im Ganzen.', x: ['Ja, sehr gründlich.', 'Ja, mit Backenzähnen.', 'Er saugt sie aus.'], w: 'Frösche haben keine Zähne zum Kauen.' },
      { f: 'Froschmännchen quaken laut. Wozu?', a: 'Sie locken Weibchen an.', x: ['Sie vertreiben Fliegen.', 'Sie rufen nach Futter.', 'Sie haben Schmerzen.'], w: 'Die Schallblasen machen das Quaken lauter. Das Männchen sendet ein Signal, das Weibchen empfängt es.', svg: 'wasserfrosch' },
      { f: 'Mit welchen Sinnen bemerkt ein Frosch Feinde, die sich nähern?', a: 'Er hört gut und spürt Erschütterungen des Bodens.', x: ['Er riecht sie über viele Kilometer.', 'Er schmeckt sie im Wasser.', 'Gar nicht.'], w: 'Bei Gefahr springt er sofort ins Wasser.' },
    ],
    T: [
      { f: 'Der Frosch fängt Insekten mit seiner ___.', a: ['Klappzunge', 'Zunge'], w: 'Sie ist klebrig und schnellt weit heraus.' },
      { f: 'Eine Hautfarbe, die zur Umgebung passt, nennt man ___.', a: ['Tarnfärbung', 'Tarnfarbe', 'Tarnung'], w: 'Sie schützt vor Feinden.' },
      { f: 'Ein Tier, das still auf Beute wartet, ist ein ___.', a: 'Ansitzjäger', w: 'Auch Hecht und Kreuzotter jagen so.' },
    ],
    A: { w: ['Frösche sind Ansitzjäger.', 'Die Zunge des Frosches ist klebrig.', 'Frösche verschlucken ihre Beute unzerkaut.'],
      f: ['Frösche jagen ihre Beute im schnellen Lauf.', 'Frösche kauen ihre Beute gründlich.', 'Frösche fressen vor allem Wasserpflanzen.'] },
  }, { frage: 46, ordnen: 20, tippen: 16, aussage: 18 });

  G.lurchHaut = baue('b5-lurch-haut', {
    h: 'Die Haut der Lurche ist dünn, nackt und feucht. Durch sie können Lurche atmen (Hautatmung). Dazu kommt die Lunge. Lurche sind wechselwarm und brauchen feuchte Luft.',
    F: [
      { f: 'Wie fühlt sich die Haut eines Frosches an?', a: 'feucht und glatt', x: ['trocken und schuppig', 'weich und behaart', 'hart wie ein Panzer'], w: 'Schleimdrüsen in der Haut halten sie feucht.' },
      { f: 'Frösche können durch die Haut Sauerstoff aufnehmen. Wie heißt das?', a: 'Hautatmung', x: ['Kiemenatmung', 'Lungenatmung', 'Mundatmung'], w: 'Der Sauerstoff geht durch die dünne Haut direkt ins Blut.' },
      { f: 'Warum muss die Haut eines Frosches immer <b>feucht</b> bleiben?', a: 'Nur durch feuchte Haut kann er atmen.', x: ['Sonst friert er.', 'Sonst kann er nicht quaken.', 'Sonst wird er zu schwer.'], w: 'Trocknet die Haut aus, erstickt der Frosch.' },
      { f: 'Was halten die <b>Schleimdrüsen</b> der Froschhaut feucht?', a: 'die Haut', x: ['die Augen', 'die Zunge', 'die Lunge'], w: 'Der Schleim schützt vor dem Austrocknen.' },
      { f: 'Womit atmet ein erwachsener Frosch an Land <b>außer</b> mit der Haut?', a: 'mit der Lunge', x: ['mit Kiemen', 'mit der Schwimmblase', 'mit den Schallblasen'], w: 'Erwachsene Frösche sind Lungenatmer. Die Hautatmung kommt dazu.' },
      { f: 'Lurche leben nur dort, wo es feucht ist. Wie nennt man sie deshalb?', a: 'Feuchtlufttiere', x: ['Trockenlufttiere', 'Wüstentiere', 'Warmblüter'], w: 'In trockener Luft würde ihre Haut austrocknen.' },
      { f: 'Die Körpertemperatur eines Frosches richtet sich nach der Umgebung. Er ist …', a: 'wechselwarm', x: ['gleichwarm', 'ein Warmblüter', 'immer 37 Grad warm'], w: 'Ist es kalt, wird der Frosch langsam und träge.' },
      { f: 'Wie überstehen Frösche und Kröten den <b>Winter</b>?', a: 'in Kältestarre, im Schlamm oder in Erdlöchern', x: ['Sie fliegen in den Süden.', 'Sie fressen mehr und bleiben wach.', 'Sie bekommen ein Winterfell.'], w: 'In der Kältestarre bewegen sie sich nicht und brauchen kaum Sauerstoff.' },
      { f: 'Ein Wasserfrosch überwintert im Schlamm am Teichgrund. Wie atmet er dort?', a: 'nur durch die Haut', x: ['mit der Lunge', 'gar nicht', 'mit Kiemen'], w: 'Die Hautatmung reicht aus, weil er in der Kältestarre sehr wenig Sauerstoff braucht.' },
      { f: 'Warum sieht man Frösche an heißen, trockenen Tagen selten in der prallen Sonne?', a: 'Ihre Haut würde austrocknen.', x: ['Sie haben Angst vor Licht.', 'Sie schlafen den ganzen Sommer.', 'Sie sind dann unsichtbar.'], w: 'Sie bleiben im Wasser oder an schattigen, feuchten Plätzen.' },
    ],
    T: [
      { f: 'Atmen durch die Haut heißt ___.', a: 'Hautatmung', w: 'Die Haut muss dafür feucht sein.' },
      { f: 'Tiere, deren Körpertemperatur sich nach der Umgebung richtet, sind ___.', a: 'wechselwarm', w: 'Fische, Lurche und Kriechtiere sind wechselwarm.' },
      { f: 'Den Winter überstehen Lurche in ___.', a: ['Kältestarre', 'Winterstarre'], w: 'Sie liegen starr im Schlamm oder in Erdlöchern.' },
      { f: 'Weil Lurche feuchte Luft brauchen, nennt man sie ___.', a: ['Feuchtlufttiere', 'Feuchtlufttier'], w: 'Das Gegenteil sind Trockenlufttiere wie die Eidechsen.' },
    ],
    A: { w: ['Lurche atmen auch durch die Haut.', 'Die Haut der Lurche ist feucht.', 'Lurche sind wechselwarm.', 'Erwachsene Frösche haben Lungen.'],
      f: ['Lurche haben eine trockene Schuppenhaut.', 'Lurche sind gleichwarm.', 'Erwachsene Frösche atmen mit Kiemen.', 'Frösche halten Winterschlaf in einem Nest aus Laub.'] },
  }, { frage: 52, tippen: 22, aussage: 26 });

  const FROSCHARTEN = [
    ['wasserfrosch', 'Wasserfrosch', 'Grün, oft mit hellem Streifen auf dem Rücken. Er lebt am und im Wasser.'],
    ['grasfrosch', 'Grasfrosch', 'Braun, mit einem dunklen Fleck hinter dem Auge.'],
    ['laubfrosch', 'Laubfrosch', 'Klein und leuchtend grün, mit Haftscheiben an Fingern und Zehen.'],
    ['erdkroete', 'Erdkröte', 'Plump, braun, mit warziger Haut und ohne Streifen.'],
    ['kreuzkroete', 'Kreuzkröte', 'Warzige Haut und ein heller Streifen mitten auf dem Rücken.'],
    ['rotbauchunke', 'Rotbauchunke', 'Dunkle, warzige Haut und ein Bauch mit roten Flecken.'],
    ['gelbbauchunke', 'Gelbbauchunke', 'Warzige Haut und ein gelb und dunkel gefleckter Bauch.'],
  ];
  G.lurchArten = baue('b5-lurch-arten', {
    h: 'Frösche haben glatte Haut und lange Beine. Kröten sind plump und warzig. Unken sind warzig und haben einen bunt gefleckten Bauch.',
    E: { f: 'Welcher Lurch ist das?', arten: FROSCHARTEN },
    S: { kats: ['Frosch', 'Kröte', 'Unke'], f: (x) => `Frosch, Kröte oder Unke? <b>${x}</b>`, h: 'Glatte Haut: Frosch. Warzig und plump: Kröte. Warzig mit buntem Bauch: Unke.',
      items: [['glatte, feuchte Haut', 0], ['sehr lange Hinterbeine, weite Sprünge', 0], ['Haftscheiben an den Zehen (Laubfrosch)', 0], ['Laich in Klumpen', 0, 'Frösche legen Laichballen.'],
        ['plumper Körper, trockene, warzige Haut', 1], ['Laich in langen Schnüren', 1, 'Kröten legen Laichschnüre.'], ['läuft mehr, als sie springt', 1],
        ['Bauch leuchtend gelb oder rot gefleckt', 2], ['Pupille herzförmig', 2, 'Das gibt es nur bei den Unken.'], ['zeigt bei Gefahr die bunte Unterseite', 2, 'Die Farben warnen: Ich bin giftig!']] },
    F: [
      { f: 'Welcher heimische Frosch kann auf Büsche und Bäume <b>klettern</b>?', a: 'der Laubfrosch', x: ['der Grasfrosch', 'der Wasserfrosch', 'der Moorfrosch'], w: 'Seine Haftscheiben an Fingern und Zehen halten wie kleine Saugnäpfe.', svg: 'laubfrosch' },
      { f: 'Woran erkennst du den <b>Grasfrosch</b>?', a: 'Er ist braun und hat einen dunklen Fleck hinter dem Auge.', x: ['Er ist leuchtend grün.', 'Er hat einen roten Bauch.', 'Er hat einen Schwanz.'], w: 'Er ist einer der häufigsten Frösche Europas.', svg: 'grasfrosch' },
      { f: 'Welche Haut haben <b>Kröten</b>?', a: 'eine warzige Haut mit vielen Drüsen', x: ['eine glatte, glänzende Haut', 'eine Haut mit Schuppen', 'ein Fell'], w: 'Daran unterscheidet man sie von den Fröschen.', svg: 'erdkroete' },
      { f: 'Wie unterscheidet man <b>Kreuzkröte</b> und Erdkröte?', a: 'Die Kreuzkröte hat einen hellen Streifen auf dem Rücken.', x: ['Die Kreuzkröte hat ein Kreuz auf dem Bauch.', 'Die Kreuzkröte hat einen Schwanz.', 'Die Kreuzkröte ist blau.'], w: 'Der helle Streifen läuft mitten über den Rücken.', svg: 'kreuzkroete' },
      { f: 'Welche <b>Unke</b> findet man in Sachsen eher?', a: 'die Rotbauchunke', x: ['die Gelbbauchunke', 'die Blaubauchunke', 'gar keine'], w: 'Sie lebt im Tiefland in pflanzenreichen Kleingewässern. Die Gelbbauchunke lebt weiter im Süden und Westen.', svg: 'rotbauchunke' },
      { f: 'Bei welchem Frosch färben sich die Männchen zur Paarungszeit <b>blau</b>?', a: 'beim Moorfrosch', x: ['beim Laubfrosch', 'beim Grasfrosch', 'beim Wasserfrosch'], w: 'Nur wenige Tage im Frühjahr sind die Männchen himmelblau.' },
      { f: 'Welche ist die <b>häufigste</b> Kröte bei uns?', a: 'die Erdkröte', x: ['die Kreuzkröte', 'die Wechselkröte', 'die Knoblauchkröte'], w: 'Sie wird bis etwa elf Zentimeter groß und lebt in Wäldern, Gärten und Parks.' },
      { f: 'Was haben Frösche, Kröten und Unken <b>gemeinsam</b>?', a: 'Sie sind Froschlurche: Die erwachsenen Tiere haben keinen Schwanz.', x: ['Sie haben alle eine glatte Haut.', 'Sie sind alle grün.', 'Sie leben alle auf Bäumen.'], w: 'Die Gruppe heißt Froschlurche.' },
    ],
    T: [
      { f: 'Der kleine grüne Frosch mit Haftscheiben heißt ___.', a: ['Laubfrosch', 'Europäischer Laubfrosch'], w: 'Er klettert auf Sträucher und Bäume.' },
      { f: 'Plump und warzig, ohne Rückenstreifen: Das ist die ___.', a: 'Erdkröte', w: 'Die häufigste Kröte bei uns.' },
      { f: 'Froschlurche mit bunt geflecktem Bauch heißen ___.', a: ['Unken', 'Unke'], w: 'Es gibt die Rotbauchunke und die Gelbbauchunke.' },
    ],
  }, { erkennen: 32, sortieren: 22, passtNicht: 8, frage: 28, tippen: 10 });

  // Bestimmungsschlüssel (eigene Fassung): immer zwischen zwei Möglichkeiten entscheiden
  const SCHLUESSEL = [
    { n: 'Teichmolch', svg: 'teichmolch', m: ['hat einen Schwanz'], weg: ['Schwanz? Ja.', 'Also ein Schwanzlurch.'] , gruppe: 'Schwanzlurch' },
    { n: 'Erdkröte', svg: 'erdkroete', m: ['kein Schwanz', 'warzige Haut', 'Bauch hell', 'Rücken ohne Streifen'], weg: ['Schwanz? Nein: Froschlurch.', 'Haut warzig? Ja.', 'Bauch bunt gefleckt? Nein: Kröte.', 'Heller Rückenstreifen? Nein: Erdkröte.'] },
    { n: 'Kreuzkröte', svg: 'kreuzkroete', m: ['kein Schwanz', 'warzige Haut', 'Bauch hell', 'heller Streifen auf dem Rücken'], weg: ['Schwanz? Nein: Froschlurch.', 'Haut warzig? Ja.', 'Bauch bunt gefleckt? Nein: Kröte.', 'Heller Rückenstreifen? Ja: Kreuzkröte.'] },
    { n: 'Rotbauchunke', svg: 'rotbauchunke', m: ['kein Schwanz', 'warzige Haut', 'Bauch mit roten Flecken'], weg: ['Schwanz? Nein: Froschlurch.', 'Haut warzig? Ja.', 'Bauch bunt gefleckt? Ja: Unke.', 'Flecken rot: Rotbauchunke.'] },
    { n: 'Gelbbauchunke', svg: 'gelbbauchunke', m: ['kein Schwanz', 'warzige Haut', 'Bauch mit gelben Flecken'], weg: ['Schwanz? Nein: Froschlurch.', 'Haut warzig? Ja.', 'Bauch bunt gefleckt? Ja: Unke.', 'Flecken gelb: Gelbbauchunke.'] },
    { n: 'Laubfrosch', svg: 'laubfrosch', m: ['kein Schwanz', 'glatte Haut', 'Haftscheiben an den Zehen'], weg: ['Schwanz? Nein: Froschlurch.', 'Haut warzig? Nein: Frosch.', 'Haftscheiben? Ja: Laubfrosch.'] },
    { n: 'Wasserfrosch', svg: 'wasserfrosch', m: ['kein Schwanz', 'glatte Haut', 'keine Haftscheiben', 'grün'], weg: ['Schwanz? Nein: Froschlurch.', 'Haut warzig? Nein: Frosch.', 'Haftscheiben? Nein.', 'Farbe grün: Wasserfrosch.'] },
    { n: 'Grasfrosch', svg: 'grasfrosch', m: ['kein Schwanz', 'glatte Haut', 'keine Haftscheiben', 'braun'], weg: ['Schwanz? Nein: Froschlurch.', 'Haut warzig? Nein: Frosch.', 'Haftscheiben? Nein.', 'Farbe braun: Grasfrosch.'] },
  ];
  const TIPP_SCHL = 'Geh den Schlüssel Schritt für Schritt durch: 1. Schwanz? 2. Haut warzig oder glatt? 3. Warzig: Bauch bunt gefleckt (Unke) oder hell (Kröte)? Glatt: Haftscheiben (Laubfrosch) oder nicht?';
  const namen = (ok) => { const ch = shuffle([ok, ...shuffle(SCHLUESSEL.map((x) => x.n).filter((x) => x !== ok)).slice(0, 3)]); return { ch, i: ch.indexOf(ok) }; };
  const schlBild = () => { const e = pick(SCHLUESSEL), { ch, i } = namen(e.n);
    return { prompt: 'Bestimme das Tier mit dem Schlüssel: Schwanz? Haut warzig oder glatt? Bauch? Haftscheiben? Farbe?', figure: D.bilder[e.svg](), choices: ch, correct: i, hint: TIPP_SCHL,
      solution: `<b>${e.n}</b><br>${e.weg.join('<br>')}`, ex: { mode: 'reihe', art: 'schlBild', items: e.weg, s1: 'Der Bestimmungsschlüssel: immer zwischen zwei Möglichkeiten entscheiden.', merk: `Am Ende des Weges steht: <b>${e.n}</b>` } }; };
  const schlText = () => { const e = pick(SCHLUESSEL.filter((x) => x.m.length > 1)), { ch, i } = namen(e.n);
    return { prompt: `Ein Lurch hat diese Merkmale: <b>${e.m.join(', ')}</b>. Welche Art ist es?`, choices: ch, correct: i, hint: TIPP_SCHL,
      solution: `<b>${e.n}</b><br>${e.weg.join('<br>')}`, ex: { mode: 'reihe', art: 'schlText', items: e.weg, s1: 'Schritt für Schritt durch den Schlüssel:', merk: `Die Merkmale führen zu: <b>${e.n}</b>` } }; };
  G.lurchBestimmen = baue('b5-lurch-bestimmen', {
    h: TIPP_SCHL,
    extra: { schlBild, schlText },
    F: [
      { f: 'Wie arbeitet man mit einem <b>Bestimmungsschlüssel</b>?', a: 'Man entscheidet sich bei jedem Schritt zwischen zwei Möglichkeiten.', x: ['Man rät den Namen.', 'Man fragt das Tier.', 'Man misst nur die Länge.'], w: 'Schritt für Schritt kommt man so zum Namen der Art.' },
      { f: 'Welche Frage steht im Schlüssel für Lurche <b>ganz am Anfang</b>?', a: 'Hat das Tier einen Schwanz?', x: ['Ist der Bauch rot oder gelb?', 'Hat es einen Rückenstreifen?', 'Wie laut quakt es?'], w: 'Damit trennt man Schwanzlurche und Froschlurche.' },
      { f: 'Ein Froschlurch hat eine warzige Haut und einen hellen Bauch ohne bunte Flecken. Zu welcher Gruppe gehört er?', a: 'zu den Kröten', x: ['zu den Unken', 'zu den Fröschen', 'zu den Molchen'], w: 'Unken haben einen bunt gefleckten Bauch, Frösche eine glatte Haut.' },
      { f: 'Welche Frage unterscheidet <b>Erdkröte</b> und <b>Kreuzkröte</b>?', a: 'Hat sie einen hellen Streifen auf dem Rücken?', x: ['Hat sie einen Schwanz?', 'Hat sie Haftscheiben?', 'Ist ihre Haut glatt?'], w: 'Mit Streifen: Kreuzkröte. Ohne: Erdkröte.' },
      { f: 'Welche Frage unterscheidet <b>Laubfrosch</b> und <b>Grasfrosch</b>?', a: 'Hat er Haftscheiben an den Zehen?', x: ['Hat er einen Schwanz?', 'Ist die Haut warzig?', 'Hat er einen roten Bauch?'], w: 'Haftscheiben hat nur der Laubfrosch.' },
      { f: 'Du findest einen Lurch und möchtest wissen, wie er heißt. Was hilft dir <b>nicht</b>?', a: 'das Tier lange in der warmen Hand halten', x: ['ein Bestimmungsbuch', 'eine Bestimmungs-App', 'ein Foto und der Bestimmungsschlüssel'], w: 'Lurche sind geschützt, ihre Haut ist empfindlich. Besser: anschauen, fotografieren, in Ruhe lassen.' },
    ],
  }, { schlBild: 36, schlText: 30, frage: 34 });

  const ENTW = ['Laich: Eier in einer Gallerthülle', 'Kaulquappe mit äußeren Kiemen', 'Kaulquappe mit Ruderschwanz, noch ohne Beine', 'Kaulquappe mit Hinterbeinen', 'Kaulquappe mit vier Beinen, der Schwanz wird kürzer', 'Jungfrosch ohne Schwanz'];
  const ENTW_B = ['laich', 'quappe1', 'quappe2', 'quappe3', 'quappe4', 'jungfrosch'];
  const stufeBild = () => { const i = U.R(0, 5), ch = shuffle([ENTW[i], ...shuffle(ENTW.filter((_, k) => k !== i)).slice(0, 3)]);
    return { prompt: 'Welche Stufe der Entwicklung zeigt das Bild?', figure: D.bilder[ENTW_B[i]](), choices: ch, correct: ch.indexOf(ENTW[i]), hint: 'Schau genau hin: Gibt es Beine? Wie viele? Gibt es noch einen Schwanz?',
      solution: `<b>${ENTW[i]}</b><br>Das ist Stufe ${i + 1} von 6.`, ex: { mode: 'reihe', art: 'stufeBild', items: ENTW, bilder: ENTW_B, hell: i, s1: 'Vom Laich zum Frosch in sechs Stufen:', merk: `Gesucht war Stufe ${i + 1}: <b>${ENTW[i]}</b>` } }; };
  const danach = () => { const i = U.R(0, 4), ch = shuffle([ENTW[i + 1], ...shuffle(ENTW.filter((_, k) => k !== i + 1 && k !== i)).slice(0, 3)]);
    return { prompt: `Die Entwicklung des Frosches. Was kommt <b>direkt nach</b> dieser Stufe?<br><b>${ENTW[i]}</b>`, choices: ch, correct: ch.indexOf(ENTW[i + 1]), hint: 'Erst wachsen die Hinterbeine, dann die Vorderbeine. Der Schwanz verschwindet zuletzt.',
      solution: `Danach kommt: <b>${ENTW[i + 1]}</b>`, ex: { mode: 'reihe', art: 'danach', items: ENTW, bilder: ENTW_B, hell: i + 1, s1: 'Vom Laich zum Frosch in sechs Stufen:', merk: `Nach „${ENTW[i]}“ kommt: <b>${ENTW[i + 1]}</b>` } }; };
  G.lurchEntw = baue('b5-lurch-entw', {
    h: 'Aus dem Laich schlüpft die Kaulquappe. Sie atmet mit Kiemen. Erst wachsen die Hinterbeine, dann die Vorderbeine, zuletzt verschwindet der Schwanz. Diese Verwandlung heißt Metamorphose.',
    extra: { stufeBild, danach },
    O: [
      { t: 'Vom Laich zum Frosch: Bringe die Stufen in die richtige Reihenfolge.', items: ENTW, bilder: ENTW_B, n: 4, w: 'Laich → Kaulquappe mit Kiemen → Hinterbeine → Vorderbeine → Schwanz weg: Frosch.', s1: 'Vom Laich zum Frosch:' },
      { t: 'Paarung beim Grasfrosch: Bringe die Schritte in die richtige Reihenfolge.', items: ['Das Männchen lockt das Weibchen mit Rufen an.', 'Das Männchen klammert sich auf dem Rücken des Weibchens fest.', 'Das Weibchen legt die Eier ins Wasser.', 'Das Männchen gibt seine Spermien über die Eier.', 'Die Gallerthülle der Eier quillt auf: ein Laichballen.'], n: 4, w: 'Die Befruchtung findet im Wasser statt: äußere Befruchtung.' },
    ],
    F: [
      { f: 'Wie heißt die Larve des Frosches?', a: 'Kaulquappe', x: ['Raupe', 'Küken', 'Made'], w: 'Sie sieht ganz anders aus als ihre Eltern.', svg: 'quappe2' },
      { f: 'Womit atmet eine <b>Kaulquappe</b>?', a: 'mit Kiemen', x: ['mit Lungen', 'gar nicht', 'mit dem Schwanz'], w: 'Wie ein Fisch nimmt sie Sauerstoff aus dem Wasser auf.', svg: 'quappe1' },
      { f: 'Welche Beine wachsen der Kaulquappe <b>zuerst</b>?', a: 'die Hinterbeine', x: ['die Vorderbeine', 'alle vier gleichzeitig', 'gar keine'], w: 'Die Vorderbeine brechen erst später durch.', svg: 'quappe3' },
      { f: 'Die Kaulquappe verwandelt sich in einen Frosch. Wie heißt diese Verwandlung?', a: 'Metamorphose', x: ['Häutung', 'Mauser', 'Winterschlaf'], w: 'Metamorphose bedeutet Gestaltwandel.' },
      { f: 'Eier und Spermien treffen beim Frosch im Wasser aufeinander. Wie heißt das?', a: 'äußere Befruchtung', x: ['innere Befruchtung', 'Brutpflege', 'Metamorphose'], w: 'Wie bei den Fischen: außerhalb des Körpers.' },
      { f: 'Was passiert bei der Metamorphose mit dem <b>Schwanz</b> der Kaulquappe?', a: 'Er wird immer kürzer und verschwindet.', x: ['Er fällt plötzlich ab.', 'Er wird zu einem dritten Beinpaar.', 'Er bleibt, wie er ist.'], w: 'Der Körper baut ihn ab und nutzt die Stoffe weiter.', svg: 'quappe4' },
      { f: 'Was ändert sich bei der Metamorphose an der <b>Atmung</b>?', a: 'Aus Kiemenatmung wird Lungenatmung.', x: ['Aus Lungenatmung wird Kiemenatmung.', 'Nichts.', 'Der Frosch atmet danach gar nicht mehr.'], w: 'Die Kaulquappe kommt dann zum Luftholen an die Wasseroberfläche.' },
      { f: 'Was ändert sich bei der Metamorphose an der <b>Nahrung</b>?', a: 'Die Kaulquappe raspelt vor allem Pflanzen und Algen ab, der Frosch frisst Tiere.', x: ['Die Kaulquappe frisst Fliegen, der Frosch Algen.', 'Nichts.', 'Beide trinken Milch.'], w: 'Auch das Maul verändert sich dabei.' },
      { f: 'Wie schützt die <b>Gallerthülle</b> die Froscheier?', a: 'Sie quillt im Wasser auf und hält die Eier zusammen.', x: ['Sie ist hart wie eine Schale.', 'Sie wärmt die Eier auf 37 Grad.', 'Sie macht die Eier unsichtbar.'], w: 'So entsteht beim Frosch ein Laichballen.', svg: 'laich' },
      { f: 'Wie lange dauert es ungefähr, bis aus dem Ei ein kleiner Grasfrosch geworden ist?', a: 'etwa drei Monate', x: ['etwa drei Tage', 'etwa drei Jahre', 'etwa drei Stunden'], w: 'Im Frühjahr wird gelaicht, im Sommer gehen die Jungfrösche an Land.' },
      { f: 'Ein Grasfrosch-Weibchen legt über tausend Eier. Warum so viele?', a: 'Die meisten Eier und Kaulquappen werden gefressen.', x: ['Damit der Teich voll wird.', 'Weil die Eltern alle Jungen füttern.', 'Weil Frösche nicht zählen können.'], w: 'Fische, Libellenlarven und Wasserkäfer fressen Kaulquappen.' },
    ],
    T: [
      { f: 'Die Larve des Frosches heißt ___.', a: 'Kaulquappe', w: 'Sie lebt im Wasser.' },
      { f: 'Die Verwandlung der Kaulquappe zum Frosch heißt ___.', a: ['Metamorphose', 'Gestaltwandel', 'Verwandlung'], w: 'Das Fachwort ist Metamorphose.' },
      { f: 'Die Eier der Frösche nennt man ___.', a: 'Laich', w: 'Wie bei den Fischen.' },
      { f: 'Die Kaulquappe atmet mit ___.', a: 'Kiemen', w: 'Der Frosch atmet später mit Lungen und Haut.' },
    ],
    A: { w: ['Kaulquappen atmen mit Kiemen.', 'Bei der Kaulquappe wachsen zuerst die Hinterbeine.', 'Froschlurche haben eine äußere Befruchtung.'],
      f: ['Kaulquappen atmen mit Lungen.', 'Bei der Kaulquappe wachsen zuerst die Vorderbeine.', 'Der Jungfrosch behält seinen Ruderschwanz.', 'Frösche legen ihre Eier an Land in den Sand.'] },
  }, { stufeBild: 16, danach: 12, ordnen: 20, frage: 34, tippen: 10, aussage: 8 });

  const SCHWANZARTEN = [
    ['feuersalamander', 'Feuersalamander', 'Schwarz mit leuchtend gelben Flecken: eine Warnfärbung.'],
    ['teichmolch', 'Teichmolch', 'Bräunlich, der Bauch orange mit dunklen Flecken. Unser häufigster Molch.'],
    ['bergmolch', 'Bergmolch', 'Bläulicher Rücken und ein orangefarbener Bauch ohne Flecken.'],
    ['kammmolch', 'Kammmolch', 'Dunkel, mit hohem, gezacktem Kamm auf dem Rücken (Männchen im Frühjahr).'],
  ];
  G.lurchSchwanz = baue('b5-lurch-schwanz', {
    h: 'Molche und Salamander sind Schwanzlurche: lang gestreckt, mit Schwanz und vier kurzen Beinen. Ihre Haut ist feucht und nackt wie bei den Fröschen.',
    E: { f: 'Welcher Schwanzlurch ist das?', arten: SCHWANZARTEN },
    S: { kats: ['Froschlurch', 'Schwanzlurch'], f: (x) => `Froschlurch oder Schwanzlurch? <b>${x}</b>`, h: 'Schwanzlurche behalten ihren Schwanz. Froschlurche haben als erwachsene Tiere keinen.',
      items: [['Grasfrosch', 0], ['Erdkröte', 0], ['Laubfrosch', 0], ['Rotbauchunke', 0], ['Wasserfrosch', 0], ['Kreuzkröte', 0], ['Feuersalamander', 1], ['Teichmolch', 1], ['Bergmolch', 1], ['Kammmolch', 1], ['Alpensalamander', 1]] },
    F: [
      { f: 'Die gelb-schwarze Haut des Feuersalamanders ist eine <b>Warnfärbung</b>. Was „sagt“ sie den Feinden?', a: 'Vorsicht, ich bin giftig!', x: ['Ich bin gut versteckt.', 'Ich bin lecker.', 'Ich will mich paaren.'], w: 'Drüsen in seiner Haut geben ein giftiges Sekret ab.', svg: 'feuersalamander' },
      { f: 'Was ist der Unterschied zwischen <b>Warnfärbung</b> und <b>Tarnfärbung</b>?', a: 'Warnfärbung fällt auf, Tarnfärbung versteckt.', x: ['Es gibt keinen.', 'Warnfärbung versteckt, Tarnfärbung fällt auf.', 'Beide machen unsichtbar.'], w: 'Der Feuersalamander warnt, der Teichmolch tarnt sich.' },
      { f: 'Im Frühjahr leben Molche im Wasser und bekommen einen Hautsaum am Schwanz. Wie nennt man dieses Aussehen?', a: 'Wassertracht', x: ['Landtracht', 'Winterfell', 'Brutkleid'], w: 'An Land verschwindet der Saum wieder: Landtracht.', svg: 'kammmolch' },
      { f: 'Wozu dient der <b>Flossensaum</b> der Molche in der Wassertracht?', a: 'Sie schwimmen damit schneller und wendiger.', x: ['Zum Atmen.', 'Zum Fliegen.', 'Zum Graben.'], w: 'Der Schwanz wird zum Ruder.' },
      { f: 'Welcher ist der <b>größte</b> heimische Molch?', a: 'der Kammmolch', x: ['der Teichmolch', 'der Bergmolch', 'der Fadenmolch'], w: 'Er kann bis zu 18 Zentimeter lang werden.', svg: 'kammmolch' },
      { f: 'Wo leben <b>Feuersalamander</b>?', a: 'in feuchten Laubwäldern mit Bächen', x: ['in trockenen Sandgruben', 'im Meer', 'auf sonnigen Felsen'], w: 'Man sieht sie vor allem nachts und bei Regen.' },
      { f: 'Wie bringt das Weibchen des <b>Feuersalamanders</b> seinen Nachwuchs zur Welt?', a: 'Es setzt lebende Larven in einem Bach ab.', x: ['Es legt Laichschnüre.', 'Es legt Eier mit harter Schale an Land.', 'Es säugt die Jungen.'], w: 'Die Larven schlüpfen schon im Körper der Mutter. Sie haben außen Büschelkiemen.' },
      { f: 'Wohin legen <b>Molche</b> ihre Eier?', a: 'einzeln an Wasserpflanzen', x: ['in große Laichballen', 'in lange Schnüre', 'in ein Nest an Land'], w: 'Das Weibchen wickelt jedes Ei in ein Blatt.' },
      { f: 'Was haben Molche und Frösche <b>gemeinsam</b>?', a: 'eine feuchte, nackte Haut', x: ['einen langen Schwanz', 'Schuppen', 'lange Sprungbeine'], w: 'Beide sind Lurche, wechselwarm und Feuchtlufttiere.' },
      { f: 'Woran erkennst du auf den ersten Blick, dass ein Molch <b>keine Eidechse</b> ist?', a: 'Seine Haut ist feucht und hat keine Schuppen.', x: ['Er hat keinen Schwanz.', 'Er hat sechs Beine.', 'Er hat Federn.'], w: 'Eidechsen haben eine trockene Haut mit Hornschuppen.' },
    ],
    T: [
      { f: 'Molche und Salamander sind ___.', a: ['Schwanzlurche', 'Schwanzlurch'], w: 'Sie behalten ihren Schwanz ein Leben lang.' },
      { f: 'Eine auffällige Farbe, die Feinde vor Gift warnt, heißt ___.', a: ['Warnfärbung', 'Warnfarbe'], w: 'Beispiel: Feuersalamander.' },
      { f: 'Der schwarze Lurch mit den gelben Flecken heißt ___.', a: 'Feuersalamander', w: 'Er lebt in feuchten Laubwäldern.' },
    ],
  }, { erkennen: 22, sortieren: 20, passtNicht: 6, frage: 40, tippen: 12 });

  G.lurchSchutz = baue('b5-lurch-schutz', {
    h: 'Erdkröten wandern im Frühjahr zu dem Gewässer, in dem sie selbst geschlüpft sind. Auf dem Weg müssen sie oft Straßen überqueren.',
    O: [
      { t: 'Das Jahr der Erdkröte: Bringe die Abschnitte in die richtige Reihenfolge. Beginne im Winter.', items: ['Kältestarre im Erdloch', 'Wanderung zum Laichgewässer im Frühjahr', 'Paarung und Ablegen der Laichschnüre', 'Sommer im Wald: nachts auf Jagd', 'Rückzug ins Winterquartier im Herbst'], n: 4, w: 'Winterquartier → Laichgewässer → Sommerlebensraum → Winterquartier.' },
    ],
    S: HILFT(['hilft den Lurchen', 'schadet den Lurchen'], [['Krötenzaun an der Straße', 0, 'Die Tiere fallen in Eimer und werden hinübergetragen.'], ['Tunnel unter der Straße', 0], ['neuer Teich ohne Fische', 0, 'Fische fressen Laich und Kaulquappen.'], ['Straße in den Wandernächten sperren', 0], ['Hecken und feuchte Wiesen erhalten', 0], ['Laubhaufen im Garten liegen lassen', 0, 'Ein gutes Versteck für den Winter.'],
      ['neue Straße zwischen Wald und Teich', 1], ['Teich zuschütten', 1], ['Pflanzenschutzmittel auf dem Feld', 1, 'Die dünne Haut der Lurche nimmt Gifte leicht auf.'], ['Kaulquappen mit nach Hause nehmen', 1, 'Alle Lurche stehen unter Schutz.'], ['Wiese trockenlegen', 1], ['Fische in einen kleinen Gartenteich setzen', 1]], (x) => `Hilft es den Lurchen oder schadet es? <b>${x}</b>`),
    F: [
      { f: 'Wohin wandern Erdkröten im Frühjahr?', a: 'zu dem Gewässer, in dem sie selbst geschlüpft sind', x: ['in den Süden', 'auf den nächsten Berg', 'in die Stadt'], w: 'Dort paaren sie sich und laichen.' },
      { f: 'Wann beginnt die <b>Krötenwanderung</b>?', a: 'im zeitigen Frühjahr, in milden, feuchten Nächten', x: ['im Hochsommer zur Mittagszeit', 'im Dezember bei Schnee', 'im Herbst bei Sturm'], w: 'Meist im März, sobald es nachts einige Grad über null hat und regnet.' },
      { f: 'Wie legt die Erdkröte ihre Eier ab?', a: 'in langen Laichschnüren, um Wasserpflanzen gewickelt', x: ['in Laichballen', 'einzeln in Blätter gewickelt', 'in einem Nest an Land'], w: 'Die Schnüre können mehrere Meter lang sein. Frösche legen Laichballen.' },
      { f: 'Wozu dient ein <b>Krötenzaun</b>?', a: 'Er hält die Tiere von der Straße fern; Helfer tragen sie hinüber.', x: ['Er sperrt die Kröten für immer ein.', 'Er schützt den Garten vor Kröten.', 'Er hält Autos auf.'], w: 'Die Kröten laufen am Zaun entlang und fallen in eingegrabene Eimer.' },
      { f: 'Warum ist eine <b>Straße</b> für Erdkröten so gefährlich?', a: 'Sie sind langsam und wandern nachts zu Hunderten über die Fahrbahn.', x: ['Der Asphalt ist giftig.', 'Kröten mögen Autos.', 'Straßen sind zu hell.'], w: 'Viele Tiere werden überfahren.' },
      { f: 'Das Krötenmännchen lässt sich auf der Wanderung oft tragen. Von wem?', a: 'vom Weibchen, auf dessen Rücken es sich festklammert', x: ['von einem Vogel', 'von einem anderen Männchen', 'von Menschen'], w: 'Das Weibchen ist größer und trägt das Männchen huckepack zum Wasser.' },
      { f: 'Wo verbringt die Erdkröte den <b>Sommer</b>?', a: 'an Land: in Wäldern, Gärten und Wiesen', x: ['im Teich', 'im Meer', 'in einer Höhle im Gebirge'], w: 'Am Tag sitzt sie im Versteck, nachts jagt sie Insekten, Würmer und Schnecken.' },
      { f: 'Darf man Frösche, Kröten oder Kaulquappen fangen und mit nach Hause nehmen?', a: 'Nein, alle heimischen Lurche stehen unter Schutz.', x: ['Ja, so viele man will.', 'Ja, aber nur Kaulquappen.', 'Ja, aber nur im Sommer.'], w: 'Beobachten ist erlaubt, mitnehmen nicht.' },
      { f: 'Warum sind <b>Pflanzenschutzmittel</b> für Lurche besonders gefährlich?', a: 'Ihre dünne, feuchte Haut nimmt Gifte leicht auf.', x: ['Sie fressen die Mittel gern.', 'Sie sind dagegen unempfindlich.', 'Die Mittel machen sie größer.'], w: 'Was beim Atmen hilft, ist hier ein Nachteil.' },
      { f: 'Etwa wie viele der 21 heimischen Lurcharten gelten als <b>gefährdet</b>?', a: 'etwa die Hälfte', x: ['keine', 'eine einzige', 'alle sind ausgestorben'], w: 'Vor allem, weil Teiche, Tümpel und feuchte Wiesen verschwinden.' },
    ],
    T: [
      { f: 'Das Gewässer, in dem Lurche ihre Eier ablegen, heißt ___.', a: ['Laichgewässer', 'Laichplatz'], w: 'Dorthin wandern sie im Frühjahr.' },
      { f: 'Erdkröten legen ihre Eier in langen ___ ab.', a: ['Laichschnüren', 'Schnüren', 'Laichschnüre'], w: 'Frösche legen Laichballen.' },
      { f: 'An der Straße hält ein ___ die wandernden Kröten auf.', a: ['Krötenzaun', 'Amphibienzaun', 'Schutzzaun'], w: 'Helfer tragen die Tiere über die Straße.' },
    ],
  }, { sortieren: 24, passtNicht: 6, frage: 40, ordnen: 16, tippen: 14 });
})();
