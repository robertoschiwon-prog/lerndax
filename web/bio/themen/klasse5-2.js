/* BioDax – Klasse 5, Bereiche 4 und 5: Kriechtiere, Vögel
 * (Lehrplan LB 4–5; LINDER Biologie 5, S. 58–115). Texte selbst geschrieben, Fakten nachgeschlagen (faecher/bio/fakten.md).
 */
(function () {
  const D = window.BioDax, U = D.util, G = D.gen;
  const { baue } = U;
  const HILFT = (kats, items, f) => ({ kats, items, f, h: 'Überlege: Wird der Lebensraum besser oder schlechter? Finden die Tiere Futter, Verstecke und Plätze für ihre Jungen?' });

  // =====================================================
  // Bereich 4: Kriechtiere in ihren Lebensräumen
  // =====================================================
  const KT_GRUPPE = { kats: ['Echse', 'Schlange', 'Schildkröte', 'Krokodil'], f: (x) => `Zu welcher Gruppe der Kriechtiere gehört das Tier? <b>${x}</b>`, h: 'Kriechtiere (Reptilien): Echsen, Schlangen, Schildkröten und Krokodile.',
    items: [['Zauneidechse', 0], ['Waldeidechse', 0], ['Blindschleiche', 0, 'Sie sieht aus wie eine Schlange, ist aber eine Echse ohne Beine.'], ['Chamäleon', 0], ['Komodowaran', 0, 'Die größte Echse der Welt, bis etwa drei Meter lang.'], ['Leguan', 0], ['Gecko', 0],
      ['Ringelnatter', 1], ['Kreuzotter', 1], ['Glattnatter', 1], ['Python', 1, 'Eine Würgeschlange.'], ['Kobra', 1],
      ['Europäische Sumpfschildkröte', 2, 'Die einzige heimische Schildkröte.'], ['Griechische Landschildkröte', 2], ['Suppenschildkröte', 2, 'Eine Meeresschildkröte.'],
      ['Nilkrokodil', 3], ['Alligator', 3], ['Kaiman', 3]] };
  G.ktVielfalt = baue('b5-kt-vielfalt', {
    h: KT_GRUPPE.h,
    S: KT_GRUPPE,
    F: [
      { f: 'Wie heißen die Kriechtiere mit einem Fremdwort?', a: 'Reptilien', x: ['Amphibien', 'Insekten', 'Säuger'], w: 'Amphibien sind die Lurche.' },
      { f: 'Welche vier Gruppen gehören zu den Kriechtieren?', a: 'Echsen, Schlangen, Schildkröten, Krokodile', x: ['Frösche, Kröten, Unken, Molche', 'Fische, Lurche, Vögel, Säuger', 'Käfer, Spinnen, Würmer, Schnecken'], w: 'Frösche und Molche sind Lurche.' },
      { f: 'Welches Tier ist in Deutschland <b>heimisch</b>?', a: 'Zauneidechse', x: ['Chamäleon', 'Nilkrokodil', 'Komodowaran'], w: 'Bei uns leben nur wenige Arten. Die meisten Kriechtiere leben in warmen Ländern.' },
      { f: 'Welches Kriechtier lebt <b>nicht</b> wild in Deutschland?', a: 'Python', x: ['Ringelnatter', 'Blindschleiche', 'Kreuzotter'], w: 'Pythons sind Würgeschlangen aus den Tropen.' },
      { f: 'Warum leben in den Tropen viel mehr Kriechtierarten als bei uns?', a: 'Kriechtiere sind wechselwarm und brauchen Wärme von außen.', x: ['Dort gibt es mehr Schnee.', 'Dort gibt es keine Feinde.', 'Dort ist es dunkler.'], w: 'Nur bei Wärme sind sie beweglich genug, um Beute zu fangen.' },
      { f: 'Welche heimische Schildkröte gibt es in Deutschland?', a: 'die Europäische Sumpfschildkröte', x: ['die Riesenschildkröte', 'die Suppenschildkröte', 'gar keine'], w: 'Sie ist sehr selten und vom Aussterben bedroht.' },
      { f: 'Die <b>Blindschleiche</b> hat keine Beine. Was ist sie trotzdem?', a: 'eine Echse', x: ['eine Schlange', 'ein Wurm', 'ein Lurch'], w: 'Sie kann blinzeln und ihren Schwanz abwerfen. Das können Schlangen nicht.', svg: 'blindschleiche' },
      { f: 'Dinosaurier waren auch Kriechtiere. Wie nennt man Tiere, die es heute nicht mehr gibt?', a: 'ausgestorben', x: ['exotisch', 'heimisch', 'gezähmt'], w: 'Die Dinosaurier starben vor etwa 66 Millionen Jahren aus.' },
    ],
    T: [
      { f: 'Kriechtiere heißen mit einem Fremdwort ___.', a: ['Reptilien', 'Reptil'], w: 'Echsen, Schlangen, Schildkröten und Krokodile.' },
      { f: 'Die Echse ohne Beine, die wie eine Schlange aussieht, heißt ___.', a: 'Blindschleiche', w: 'Sie ist weder blind noch eine Schlange.' },
    ],
    A: { w: ['Die Blindschleiche ist eine Echse.', 'Krokodile sind Kriechtiere.', 'Die meisten Kriechtierarten leben in warmen Ländern.'],
      f: ['Der Feuersalamander ist ein Kriechtier.', 'Die Blindschleiche ist eine Schlange.', 'Schildkröten sind Lurche.'] },
  }, { sortieren: 30, passtNicht: 10, frage: 38, tippen: 10, aussage: 12 });

  const LK = { kats: ['Lurch', 'Kriechtier'], f: (x) => `Lurch oder Kriechtier? <b>${x}</b>`, h: 'Lurche: feuchte, nackte Haut, Eier im Wasser, Larven mit Kiemen. Kriechtiere: trockene Haut mit Hornschuppen, Eier an Land, keine Larven.',
    items: [['feuchte, nackte Haut', 0], ['Hautatmung ist wichtig', 0], ['Eier ohne Schale im Wasser', 0], ['Larven atmen mit Kiemen', 0], ['Feuchtlufttier', 0], ['Verwandlung (Metamorphose)', 0],
      ['trockene Haut mit Hornschuppen', 1], ['atmet nur mit Lungen', 1], ['Eier mit Schale an Land', 1], ['Jungtiere sehen aus wie kleine Eltern', 1], ['Trockenlufttier', 1], ['häutet sich', 1]] };
  G.ktMerkmale = baue('b5-kt-merkmale', {
    h: LK.h,
    S: LK,
    F: [
      { f: 'Womit ist die Haut der Kriechtiere bedeckt?', a: 'mit Hornschuppen oder Hornplatten', x: ['mit Schleim', 'mit Federn', 'mit Knochenschuppen wie bei Fischen'], w: 'Horn ist der gleiche Stoff wie in unseren Fingernägeln.', svg: 'zauneidechse' },
      { f: 'Wovor schützt die Hornschicht die Kriechtiere vor allem?', a: 'vor dem Austrocknen', x: ['vor Kälte', 'vor Lärm', 'vor Hunger'], w: 'Deshalb können Kriechtiere auch in heißen, trockenen Gegenden leben.' },
      { f: 'Kriechtiere kommen mit trockener Luft gut zurecht. Wie nennt man sie deshalb?', a: 'Trockenlufttiere', x: ['Feuchtlufttiere', 'Wassertiere', 'Kaltblüter'], w: 'Lurche dagegen sind Feuchtlufttiere.' },
      { f: 'Die Schuppenhaut wächst nicht mit. Was tun Eidechsen und Schlangen deshalb?', a: 'Sie häuten sich.', x: ['Sie hören auf zu wachsen.', 'Sie fressen die Schuppen.', 'Sie baden.'], w: 'Unter der alten Haut hat sich schon eine neue gebildet.' },
      { f: 'Eine Eidechse liegt morgens lange in der Sonne. Warum?', a: 'Sie wärmt sich auf, weil sie wechselwarm ist.', x: ['Sie wird braun.', 'Sie schläft dort am liebsten.', 'Sie trocknet ihre Haut.'], w: 'Erst wenn sie warm genug ist, kann sie schnell laufen und jagen.' },
      { f: 'Womit atmen Kriechtiere?', a: 'mit Lungen', x: ['mit Kiemen', 'vor allem durch die Haut', 'mit Luftsäcken'], w: 'Durch die Hornhaut geht kein Sauerstoff. Auch Krokodile und Meeresschildkröten müssen zum Atmen auftauchen.' },
      { f: 'Die Lunge der Kriechtiere hat innen mehr Kammern als die Lunge der Lurche. Was bringt das?', a: 'eine größere Oberfläche: Sie nimmt mehr Sauerstoff auf.', x: ['Sie wird schwerer.', 'Sie kann Wasser atmen.', 'Sie macht Geräusche.'], w: 'Kriechtiere haben ja keine Hautatmung, die helfen könnte.' },
      { f: 'Wie überwintern heimische Eidechsen und Schlangen?', a: 'in Kältestarre in frostsicheren Verstecken', x: ['Sie ziehen in den Süden.', 'Sie bleiben wach und jagen im Schnee.', 'Sie halten Winterschlaf im Nest und wärmen sich gegenseitig.'], w: 'Wie die Lurche können sie ihre Körpertemperatur nicht selbst halten.' },
      { f: 'Welches Merkmal haben Fische, Lurche <b>und</b> Kriechtiere gemeinsam?', a: 'Sie sind wechselwarm.', x: ['Sie haben Kiemen.', 'Sie haben Hornschuppen.', 'Sie legen Eier an Land.'], w: 'Nur Vögel und Säugetiere sind gleichwarm.' },
    ],
    T: [
      { f: 'Die Haut der Kriechtiere ist mit ___ bedeckt.', a: ['Hornschuppen', 'Schuppen', 'Hornplatten'], w: 'Sie schützen vor dem Austrocknen.' },
      { f: 'Wenn ein Kriechtier seine alte Haut abstreift, nennt man das ___.', a: 'Häutung', w: 'Eidechsen häuten sich in Fetzen, Schlangen meist in einem Stück.' },
      { f: 'Weil sie trockene Luft vertragen, sind Kriechtiere ___.', a: ['Trockenlufttiere', 'Trockenlufttier'], w: 'Lurche sind Feuchtlufttiere.' },
    ],
    A: { w: ['Kriechtiere atmen mit Lungen.', 'Kriechtiere sind wechselwarm.', 'Kriechtiere haben eine trockene Haut.'],
      f: ['Kriechtiere haben eine feuchte, schleimige Haut.', 'Kriechtiere sind gleichwarm.', 'Junge Eidechsen sind Kaulquappen.'] },
  }, { sortieren: 26, passtNicht: 8, frage: 40, tippen: 12, aussage: 14 });

  G.ktEidechse = baue('b5-kt-eidechse', {
    h: 'Eidechsen haben vier Beine, einen langen Schwanz und eine trockene Schuppenhaut. Bei Gefahr können sie ihren Schwanz abwerfen.',
    F: [
      { f: 'Was kann eine Eidechse tun, wenn ein Feind sie am <b>Schwanz</b> packt?', a: 'Sie wirft den Schwanz ab und flieht.', x: ['Sie beißt den Schwanz selbst ab.', 'Sie stellt sich tot.', 'Sie spritzt Gift.'], w: 'Der Schwanz zappelt noch und lenkt den Feind ab. Er wächst nach, wird aber kürzer.', svg: 'zauneidechse' },
      { f: 'Was fressen Zauneidechsen?', a: 'Insekten, Spinnen und Würmer', x: ['Gras und Blätter', 'Mäuse und Vögel', 'Fische'], w: 'Sie halten die Beute mit ihren spitzen Zähnen fest und schlucken sie unzerkaut.' },
      { f: 'Wo lebt die <b>Zauneidechse</b>?', a: 'an sonnigen, trockenen Plätzen: Wegränder, Böschungen, Steinhaufen', x: ['im Teich', 'tief im dunklen Wald', 'in Höhlen'], w: 'Dort kann sie sich sonnen und findet Verstecke.' },
      { f: 'Wie bewegt sich eine Eidechse?', a: 'Sie läuft schlängelnd, der Bauch ist dicht über dem Boden.', x: ['Sie hüpft wie ein Frosch.', 'Sie läuft aufrecht auf zwei Beinen.', 'Sie rollt.'], w: 'Die Beine stehen seitlich vom Körper ab.' },
      { f: 'Wie nimmt eine Eidechse <b>Gerüche</b> auf?', a: 'mit der gespaltenen Zunge: Sie züngelt.', x: ['mit den Ohren', 'mit den Füßen', 'gar nicht'], w: 'Die Zunge bringt die Duftstoffe zu einem Riechorgan im Gaumen.' },
      { f: 'Das Zauneidechsen-Weibchen vergräbt seine Eier an einem warmen, geschützten Platz und geht dann weg. Wie nennt man das?', a: 'Brutfürsorge', x: ['Brutpflege', 'Metamorphose', 'Balz'], w: 'Brutfürsorge: vorsorgen <b>vor</b> dem Schlüpfen. Brutpflege: sich um die Jungen kümmern.' },
      { f: 'Wer brütet die Eier der Zauneidechse aus?', a: 'die Wärme der Sonne und des Bodens', x: ['die Mutter', 'der Vater', 'beide Eltern abwechselnd'], w: 'Nach etwa zwei Monaten schlüpfen fertige kleine Eidechsen.' },
      { f: 'Welche heimische Eidechse bringt <b>lebende Junge</b> zur Welt?', a: 'die Waldeidechse', x: ['die Zauneidechse', 'keine', 'alle'], w: 'Die Jungen schlüpfen schon im Körper der Mutter aus den Eiern. Das hilft in kühlen Gegenden.' },
      { f: 'Woran erkennst du, dass die Blindschleiche eine <b>Echse</b> und keine Schlange ist?', a: 'Sie hat Augenlider und kann blinzeln.', x: ['Sie hat Giftzähne.', 'Sie hat ein Zickzackband.', 'Sie hat Haare.'], w: 'Schlangen haben keine beweglichen Augenlider. Die Blindschleiche kann wie andere Echsen auch den Schwanz abwerfen.', svg: 'blindschleiche' },
    ],
    T: [
      { f: 'Bei Gefahr kann die Eidechse ihren ___ abwerfen.', a: 'Schwanz', w: 'Er wächst nach.' },
      { f: 'Das Vergraben der Eier an einem geeigneten Platz nennt man ___.', a: 'Brutfürsorge', w: 'Danach kümmert sich die Mutter nicht mehr um das Gelege.' },
      { f: 'Die häufige heimische Eidechse an sonnigen Wegrändern heißt ___.', a: 'Zauneidechse', w: 'Die Männchen haben im Frühjahr grüne Seiten.' },
    ],
    A: { w: ['Eidechsen können ihren Schwanz abwerfen.', 'Die Blindschleiche ist eine Echse.', 'Zauneidechsen legen Eier.', 'Eidechsen sonnen sich, um warm zu werden.'],
      f: ['Eidechsen haben eine feuchte Haut.', 'Die Zauneidechse brütet ihre Eier selbst aus.', 'Eidechsen fressen Gras.', 'Der abgeworfene Schwanz wächst nie wieder nach.'] },
  }, { frage: 56, tippen: 20, aussage: 24 });

  G.ktSchlange = baue('b5-kt-schlange', {
    h: 'Ringelnatter: grau, gelbe Halbmond-Flecken am Hinterkopf, ungiftig. Kreuzotter: dunkles Zickzackband auf dem Rücken, giftig.',
    E: { f: 'Welches Tier ist das?', arten: [['ringelnatter', 'Ringelnatter', 'Zwei gelbe Halbmond-Flecken am Hinterkopf. Sie ist ungiftig.'], ['kreuzotter', 'Kreuzotter', 'Dunkles Zickzackband auf dem Rücken. Sie ist giftig.'], ['blindschleiche', 'Blindschleiche', 'Glatt und glänzend, Kopf kaum abgesetzt. Eine Echse ohne Beine.'], ['zauneidechse', 'Zauneidechse', 'Vier Beine, langer Schwanz, Schuppenhaut.']] },
    S: { kats: ['Ringelnatter', 'Kreuzotter'], f: (x) => `Ringelnatter oder Kreuzotter? <b>${x}</b>`, h: 'Die Ringelnatter ist ungiftig und liebt das Wasser. Die Kreuzotter ist giftig.',
      items: [['gelbe Halbmond-Flecken am Hinterkopf', 0], ['ungiftig', 0], ['schwimmt gut und jagt Frösche', 0], ['legt Eier, oft in Komposthaufen', 0], ['runde Pupille', 0],
        ['Zickzackband auf dem Rücken', 1], ['Giftschlange', 1], ['bringt lebende Junge zur Welt', 1], ['senkrechte, schlitzförmige Pupille', 1], ['lauert auf Mäuse und beißt kurz zu', 1]] },
    F: [
      { f: 'Wie bewegt sich eine Schlange ohne Beine vorwärts?', a: 'Sie schlängelt sich: Muskeln, Rippen und Bauchschuppen schieben sie voran.', x: ['Sie rollt sich wie ein Rad.', 'Sie hüpft.', 'Sie wird vom Wind getragen.'], w: 'Die Bauchschuppen stemmen sich gegen den Boden.' },
      { f: 'Warum <b>züngeln</b> Schlangen?', a: 'Sie nehmen mit der Zunge Gerüche auf.', x: ['Sie drohen damit.', 'Sie stechen damit.', 'Sie kühlen sich ab.'], w: 'Die gespaltene Zunge bringt Duftstoffe zum Riechorgan im Gaumen.' },
      { f: 'Wie frisst eine Schlange ihre Beute?', a: 'Sie verschlingt sie im Ganzen.', x: ['Sie kaut sie klein.', 'Sie reißt Stücke ab.', 'Sie saugt sie aus.'], w: 'Die Kiefer sind sehr beweglich. So passt auch Beute hinein, die dicker ist als der Kopf.' },
      { f: 'Woran erkennst du die <b>Ringelnatter</b>?', a: 'an zwei gelben Halbmond-Flecken am Hinterkopf', x: ['am Zickzackband', 'an roten Augen', 'an einer Rassel'], w: 'Sie lebt gern am Wasser und ist für Menschen harmlos.', svg: 'ringelnatter' },
      { f: 'Woran erkennst du die <b>Kreuzotter</b>?', a: 'am dunklen Zickzackband auf dem Rücken', x: ['an gelben Halbmond-Flecken', 'an Beinen', 'an einem Kamm'], w: 'Es gibt auch ganz schwarze Tiere. Die Kreuzotter ist unsere häufigste Giftschlange.', svg: 'kreuzotter' },
      { f: 'Du siehst beim Wandern eine Kreuzotter. Was tust du?', a: 'Abstand halten und sie in Ruhe lassen.', x: ['Sie anfassen.', 'Sie mit einem Stock ärgern.', 'Sie einfangen.'], w: 'Sie beißt nur, wenn sie sich bedroht fühlt. Meist flieht sie. Nach einem Biss: ruhig bleiben und zum Arzt.' },
      { f: 'Wie tötet die <b>Kreuzotter</b> eine Maus?', a: 'mit einem Giftbiss', x: ['durch Erwürgen', 'durch Ertränken', 'durch einen Schlag mit dem Schwanz'], w: 'Zwei Giftzähne im Oberkiefer klappen beim Zubeißen nach vorn.' },
      { f: 'Wohin legt die Ringelnatter ihre Eier?', a: 'an warme, feuchte Plätze wie Komposthaufen', x: ['ins Wasser', 'in ein Vogelnest', 'in den Schnee'], w: 'Die Wärme im verrottenden Kompost brütet die Eier aus.' },
      { f: 'Wie heißt die abgestreifte Haut einer Schlange?', a: 'Natternhemd', x: ['Schlangenmantel', 'Panzer', 'Kokon'], w: 'Schlangen streifen die Haut meist in einem Stück ab.' },
    ],
    T: [
      { f: 'Die heimische Giftschlange mit dem Zickzackband heißt ___.', a: 'Kreuzotter', w: 'Sie lebt an Waldrändern, in Heiden und Mooren.' },
      { f: 'Die ungiftige Schlange mit den gelben Flecken am Hinterkopf heißt ___.', a: 'Ringelnatter', w: 'Sie schwimmt gut und frisst Frösche und Fische.' },
      { f: 'Wenn eine Schlange die Zunge herausstreckt, um zu riechen, nennt man das ___.', a: 'Züngeln', w: 'Die Zunge ist gespalten.' },
    ],
  }, { erkennen: 22, sortieren: 22, passtNicht: 6, frage: 38, tippen: 12 });

  G.ktFortpfl = baue('b5-kt-fortpfl', {
    h: 'Kriechtiere: innere Befruchtung, Eier mit Schale an Land, aus dem Ei schlüpft ein fertiges kleines Tier. Kein Wasser nötig.',
    S: { kats: ['Frosch', 'Eidechse'], f: (x) => `Frosch oder Eidechse? <b>${x}</b>`, h: 'Der Frosch braucht zur Fortpflanzung das Wasser, die Eidechse nicht.',
      items: [['äußere Befruchtung', 0], ['Laich im Wasser', 0], ['Larve mit Kiemen', 0], ['Metamorphose', 0], ['Eier ohne Schale, in Gallerte', 0],
        ['innere Befruchtung', 1], ['Eier werden an Land vergraben', 1], ['Jungtier sieht aus wie die Eltern', 1], ['Ei mit pergamentartiger Schale', 1], ['kein Larvenstadium', 1]] },
    O: [
      { t: 'Fortpflanzung der Zauneidechse: Bringe die Schritte in die richtige Reihenfolge.', items: ['Männchen und Weibchen paaren sich.', 'Die Eier werden im Körper des Weibchens befruchtet.', 'Das Weibchen vergräbt die Eier an einem warmen Platz.', 'Die Sonnenwärme brütet die Eier aus.', 'Fertige kleine Eidechsen schlüpfen.'], n: 4, w: 'Innere Befruchtung, Eiablage an Land, kein Larvenstadium.' },
    ],
    F: [
      { f: 'Bei Kriechtieren werden die Eier im Körper des Weibchens befruchtet. Wie heißt das?', a: 'innere Befruchtung', x: ['äußere Befruchtung', 'Metamorphose', 'Laichen'], w: 'Dafür ist kein Wasser nötig. Das passt zum Leben an Land.' },
      { f: 'Was schützt das Ei einer Eidechse vor dem <b>Austrocknen</b>?', a: 'eine feste, pergamentartige Schale', x: ['eine Gallerthülle', 'Schleim', 'nichts'], w: 'Die Schale ist ledrig, nicht hart wie beim Hühnerei.' },
      { f: 'Was schlüpft aus dem Ei einer Eidechse?', a: 'eine fertige kleine Eidechse', x: ['eine Larve mit Kiemen', 'eine Kaulquappe', 'eine Raupe'], w: 'Kriechtiere haben kein Larvenstadium und keine Metamorphose.' },
      { f: 'Warum sind Kriechtiere bei der Fortpflanzung <b>unabhängig vom Wasser</b>?', a: 'innere Befruchtung und Eier mit Schale', x: ['Sie trinken sehr viel.', 'Sie legen ihre Eier in Regenpfützen.', 'Sie haben Kiemen.'], w: 'Das war ein großer Schritt für das Leben an Land.' },
      { f: 'Ein Krokodil bewacht sein Nest und trägt die geschlüpften Jungen im Maul zum Wasser. Wie nennt man das?', a: 'Brutpflege', x: ['Brutfürsorge', 'Häutung', 'Balz'], w: 'Brutpflege: Die Eltern kümmern sich <b>nach</b> der Eiablage um Eier oder Junge.' },
      { f: 'Kreuzotter und Waldeidechse leben auch in kühlen Gegenden. Wie schützen sie ihre Eier vor Kälte?', a: 'Die Eier bleiben im Körper der Mutter, die Jungen kommen lebend zur Welt.', x: ['Sie legen die Eier in den Schnee.', 'Sie bauen ein Nest aus Federn.', 'Sie legen gar keine Eier und haben keine Jungen.'], w: 'Die Mutter kann sich sonnen und wärmt so auch die Eier.' },
      { f: 'Müssen Meeresschildkröten zum Eierlegen an Land?', a: 'Ja, sie vergraben die Eier im Sand am Strand.', x: ['Nein, sie legen sie ins Wasser.', 'Nein, sie bekommen lebende Junge.', 'Nein, sie legen keine Eier.'], w: 'Kriechtier-Eier brauchen Luft. Im Wasser würden die Jungen ersticken.' },
    ],
    T: [
      { f: 'Wird die Eizelle im Körper des Weibchens befruchtet, ist es eine ___ Befruchtung.', a: 'innere', w: 'So ist es bei Kriechtieren, Vögeln und Säugetieren.' },
      { f: 'Kümmern sich Eltern um Eier oder Junge, nennt man das ___.', a: 'Brutpflege', w: 'Brutfürsorge ist nur die Vorsorge bis zur Eiablage.' },
    ],
    A: { w: ['Kriechtiere haben eine innere Befruchtung.', 'Kriechtiere legen ihre Eier an Land.', 'Aus Kriechtier-Eiern schlüpfen keine Larven.'],
      f: ['Eidechsen legen Laich ins Wasser.', 'Junge Schlangen atmen mit Kiemen.', 'Kriechtiere haben eine äußere Befruchtung.'] },
  }, { sortieren: 24, passtNicht: 6, ordnen: 16, frage: 34, tippen: 10, aussage: 10 });

  G.ktSchutz = baue('b5-kt-schutz', {
    h: 'Kriechtiere brauchen sonnige Plätze, Verstecke und Orte für ihre Eier. Alle heimischen Arten sind geschützt.',
    S: HILFT(['hilft den Kriechtieren', 'schadet den Kriechtieren'], [['Steinhaufen in der Sonne', 0, 'Zum Sonnen und Verstecken.'], ['alte Trockenmauer erhalten', 0, 'In den Fugen überwintern Eidechsen und legen Eier.'], ['Hecken am Feldrand', 0], ['Komposthaufen im Garten', 0, 'Ein Brutplatz für Ringelnattern.'], ['Totholz liegen lassen', 0], ['Schutzgebiet einrichten', 0],
      ['Schlangen erschlagen', 1, 'Das ist verboten.'], ['Böschung zubetonieren', 1], ['Insektengift spritzen', 1, 'Dann fehlt den Eidechsen die Nahrung.'], ['Mauerfugen zumörteln', 1], ['Eidechsen fangen und mitnehmen', 1], ['Feuchtgebiet trockenlegen', 1, 'Dann fehlen der Ringelnatter Frösche und Wasser.']], (x) => `Hilft es den Kriechtieren oder schadet es? <b>${x}</b>`),
    F: [
      { f: 'Warum ist ein <b>Steinhaufen</b> gut für Eidechsen?', a: 'Steine werden in der Sonne warm, dazwischen sind Verstecke.', x: ['Eidechsen fressen Steine.', 'Dort gibt es Wasser.', 'Dort ist es dunkel und kalt.'], w: 'Sonnenplatz und Versteck liegen dicht beieinander.' },
      { f: 'Welche Schlange wurde in Sachsen an der Elbe bei Meißen wieder angesiedelt?', a: 'die Würfelnatter', x: ['die Kobra', 'der Python', 'die Klapperschlange'], w: 'Sie ist ungiftig, lebt am Wasser und frisst Fische. In Deutschland ist sie sehr selten.' },
      { f: 'Warum schadet <b>Insektengift</b> auch den Eidechsen?', a: 'Sie finden dann weniger Insekten zu fressen.', x: ['Eidechsen fressen kein Fleisch.', 'Es macht sie größer.', 'Es schadet ihnen nicht.'], w: 'Außerdem fressen sie vergiftete Insekten.' },
      { f: 'Darf man eine Ringelnatter töten, weil man Angst vor ihr hat?', a: 'Nein, alle heimischen Kriechtiere stehen unter Schutz.', x: ['Ja, immer.', 'Ja, aber nur im Garten.', 'Ja, wenn sie größer als ein Meter ist.'], w: 'Die Ringelnatter ist für Menschen ungefährlich.' },
      { f: 'Was brauchen Zauneidechsen in ihrem Lebensraum?', a: 'Sonnenplätze, Verstecke und lockeren Boden für die Eier', x: ['tiefes Wasser', 'dichten, dunklen Wald', 'Eis und Schnee'], w: 'Solche Plätze verschwinden, wenn alles bebaut oder zugewachsen ist.' },
      { f: 'Warum sind viele Kriechtiere bei uns selten geworden?', a: 'Ihre Lebensräume verschwinden.', x: ['Es ist zu warm geworden.', 'Sie wurden von Fröschen verdrängt.', 'Sie sind ausgewandert.'], w: 'Straßen, Häuser und große Felder lassen wenig Platz für Böschungen, Hecken und Steinhaufen.' },
    ],
    T: [
      { f: 'Alle heimischen Kriechtiere stehen unter ___.', a: ['Schutz', 'Naturschutz', 'Artenschutz'], w: 'Man darf sie nicht fangen, töten oder stören.' },
    ],
  }, { sortieren: 34, passtNicht: 8, frage: 48, tippen: 10 });

  // =====================================================
  // Bereich 5: Vögel in ihren Lebensräumen
  // =====================================================
  const VOGELARTEN = [
    ['amsel', 'Amsel', 'Das Männchen ist schwarz und hat einen gelben Schnabel.'],
    ['kohlmeise', 'Kohlmeise', 'Schwarzer Kopf, weiße Wangen, gelber Bauch.'],
    ['rotkehlchen', 'Rotkehlchen', 'Orangerote Kehle und Brust.'],
    ['sperling', 'Haussperling', 'Braun und grau, kräftiger Schnabel. Man nennt ihn auch Spatz.'],
    ['stockente', 'Stockente', 'Das Männchen hat einen grünen Kopf und einen gelben Schnabel.'],
    ['buntspecht', 'Buntspecht', 'Schwarz-weiß mit Rot. Er klettert am Baumstamm.'],
    ['schleiereule', 'Schleiereule', 'Helles, herzförmiges Gesicht.'],
    ['bussard', 'Mäusebussard', 'Breite Flügel. Er kreist oft hoch am Himmel.'],
  ];
  G.vogelVielfalt = baue('b5-vogel-vielfalt', {
    h: 'Alle Vögel haben Federn, einen Schnabel ohne Zähne, zwei Flügel und zwei Beine. Sie legen Eier mit Kalkschale und sind gleichwarm.',
    E: { f: 'Welcher Vogel ist das?', arten: VOGELARTEN },
    S: { kats: ['Standvogel', 'Zugvogel'], f: (x) => `Bleibt er im Winter bei uns oder zieht er fort? <b>${x}</b>`, h: 'Zugvögel fliegen im Herbst in wärmere Länder. Standvögel bleiben das ganze Jahr.',
      items: [['Haussperling', 0], ['Kohlmeise', 0], ['Elster', 0], ['Buntspecht', 0], ['Schleiereule', 0], ['Weißstorch', 1, 'Er überwintert in Afrika.'], ['Rauchschwalbe', 1], ['Mauersegler', 1], ['Kuckuck', 1], ['Nachtigall', 1]] },
    F: [
      { f: 'Welches Merkmal haben <b>nur</b> Vögel?', a: 'Federn', x: ['Flügel', 'Eier', 'einen Schnabel'], w: 'Flügel haben auch Fledermäuse und Insekten, Eier legen auch Kriechtiere. Federn gibt es heute nur bei Vögeln.' },
      { f: 'Vögel halten ihre Körpertemperatur immer gleich hoch, auch im Winter. Sie sind …', a: 'gleichwarm', x: ['wechselwarm', 'kaltblütig', 'winterstarr'], w: 'Ihr Körper ist etwa 40 Grad warm. Das Gefieder hält die Wärme.' },
      { f: 'Womit atmen Vögel?', a: 'mit Lungen, an denen Luftsäcke hängen', x: ['mit Kiemen', 'durch die Haut', 'durch den Schnabel allein'], w: 'Die Luftsäcke machen die Atmung besonders wirksam und den Körper leichter.' },
      { f: 'Woraus besteht die Schale eines Vogeleis?', a: 'aus Kalk', x: ['aus Horn', 'aus Pergament', 'aus Gallerte'], w: 'Kriechtier-Eier haben meist eine ledrige Schale, Vogeleier eine harte Kalkschale.' },
      { f: 'Womit bestimmt man Vögel?', a: 'mit einem Bestimmungsbuch oder einer App, am Aussehen und an der Stimme', x: ['mit einer Waage', 'mit einem Thermometer', 'nur durch Raten'], w: 'Viele Vögel erkennt man am Gesang, bevor man sie sieht.' },
      { f: 'Welcher Vogel ist ein <b>Haustier</b> und stammt vom Bankivahuhn aus Asien ab?', a: 'das Haushuhn', x: ['die Amsel', 'der Mäusebussard', 'der Buntspecht'], w: 'Auch Hausgans und Hausente stammen von Wildvögeln ab.' },
      { f: 'Welche Vögel gehören zu den <b>Greifvögeln</b>?', a: 'Mäusebussard, Rotmilan und Wanderfalke', x: ['Amsel, Meise und Sperling', 'Stockente, Schwan und Gans', 'Buntspecht und Grünspecht'], w: 'Sie greifen ihre Beute mit den Füßen.' },
      { f: 'Ein sehr häufiger Gartenvogel ist schwarz und hat einen gelben Schnabel. Wie heißt er?', a: 'Amsel', x: ['Elster', 'Rabe', 'Star'], w: 'Das Weibchen ist dunkelbraun.', svg: 'amsel' },
    ],
    T: [
      { f: 'Vögel, die im Herbst in den Süden ziehen, heißen ___.', a: ['Zugvögel', 'Zugvogel'], w: 'Zum Beispiel Storch und Schwalbe.' },
      { f: 'Vögel, die das ganze Jahr bei uns bleiben, heißen ___.', a: ['Standvögel', 'Standvogel'], w: 'Zum Beispiel Sperling und Kohlmeise.' },
      { f: 'Nur Vögel haben ___.', a: 'Federn', w: 'Daran erkennt man jeden Vogel.' },
    ],
  }, { erkennen: 30, sortieren: 20, passtNicht: 6, frage: 32, tippen: 12 });

  G.vogelFlugbau = baue('b5-vogel-flugbau', {
    h: 'Der Vogelkörper ist leicht gebaut: hohle Knochen, Schnabel ohne Zähne, Federn. Die starken Flugmuskeln sitzen am Brustbeinkamm.',
    S: { kats: ['macht den Vogel leicht', 'gibt Kraft zum Fliegen'], f: (x) => `Wie hilft das beim Fliegen? <b>${x}</b>`, h: 'Fliegen braucht beides: wenig Gewicht und viel Kraft.',
      items: [['hohle, luftgefüllte Knochen', 0], ['Schnabel aus Horn statt Zähne', 0], ['Federn', 0, 'Federn sind sehr leicht und trotzdem stabil.'], ['keine Harnblase', 0, 'Kot und Harn werden sofort abgegeben.'], ['schnelle Verdauung', 0, 'Die Nahrung bleibt nur kurz im Körper.'],
        ['große Flugmuskeln', 1], ['Brustbeinkamm', 1, 'Daran sind die Flugmuskeln festgewachsen.'], ['Lunge mit Luftsäcken', 1, 'Sie liefert viel Sauerstoff für die Muskeln.']] },
    F: [
      { f: 'Wie sind viele Knochen eines Vogels gebaut?', a: 'hohl und mit Luft gefüllt', x: ['massiv und schwer', 'aus Knorpel', 'mit Wasser gefüllt'], w: 'Innen stützen feine Streben. So sind die Knochen leicht und doch stabil.' },
      { f: 'Wo sind die großen <b>Flugmuskeln</b> festgewachsen?', a: 'am Brustbeinkamm', x: ['am Schnabel', 'an den Beinen', 'am Schwanz'], w: 'Der Brustbeinkamm ist eine hohe Knochenleiste am Brustbein.' },
      { f: 'Warum haben Vögel <b>keine Zähne</b>?', a: 'Ein Hornschnabel ist viel leichter.', x: ['Sie fressen nichts.', 'Zähne wären zu warm.', 'Sie haben sie verloren.'], w: 'Harte Körner zerreibt der Muskelmagen mit kleinen Steinchen.' },
      { f: 'Welche Körperform hat ein fliegender Vogel?', a: 'eine Stromlinienform', x: ['eine Würfelform', 'eine Kugelform', 'eine Scheibenform'], w: 'Wie beim Fisch: wenig Widerstand, hier in der Luft.' },
      { f: 'Was sind die Flügel eines Vogels?', a: 'umgebildete Vorderbeine', x: ['umgebildete Hinterbeine', 'große Federn ohne Knochen', 'Hautlappen'], w: 'Im Flügel stecken Oberarm, Unterarm und Hand, wie in unserem Arm.' },
      { f: 'Wozu dienen die <b>Luftsäcke</b>?', a: 'Sie helfen bei der Atmung und machen den Körper leichter.', x: ['Sie speichern Futter.', 'Sie machen den Gesang.', 'Sie halten Wasser ab.'], w: 'Von der Lunge reichen sie zwischen die Organe und bis in manche Knochen.' },
      { f: 'Ein Seeadler ist etwa so groß wie ein Biber, wiegt aber viel weniger. Warum?', a: 'Sein Körper ist in Leichtbauweise gebaut.', x: ['Er frisst weniger.', 'Er ist jünger.', 'Er hat keine Knochen.'], w: 'Hohle Knochen, Federn, Hornschnabel: alles spart Gewicht.' },
      { f: 'Die Wirbel im Rumpf eines Vogels sind miteinander verwachsen. Was bringt das?', a: 'Der Rumpf bleibt beim Fliegen steif und stabil.', x: ['Der Vogel kann sich besser bücken.', 'Der Vogel wird schwerer.', 'Der Vogel kann schwimmen.'], w: 'Nur der Hals bleibt sehr beweglich.' },
    ],
    T: [
      { f: 'Die Flugmuskeln sitzen am ___.', a: ['Brustbeinkamm', 'Brustbein'], w: 'Eine hohe Knochenleiste.' },
      { f: 'Vogelknochen sind innen ___.', a: ['hohl', 'luftgefüllt'], w: 'Das spart Gewicht.' },
      { f: 'An der Lunge der Vögel hängen ___.', a: ['Luftsäcke', 'Luftsack'], w: 'Sie reichen bis in manche Knochen.' },
    ],
    A: { w: ['Vögel haben hohle Knochen.', 'Die Flügel sind umgebildete Vorderbeine.', 'Vögel haben keine Zähne.'],
      f: ['Vögel haben schwere, massive Knochen.', 'Vögel haben vier Beine und zwei Flügel.', 'Vögel kauen mit Backenzähnen.'] },
  }, { sortieren: 22, passtNicht: 0, frage: 46, tippen: 14, aussage: 18 });

  G.vogelFeder = baue('b5-vogel-feder', {
    h: 'Schwungfedern bilden die Tragfläche, Steuerfedern am Schwanz lenken und bremsen, Deckfedern schützen, Daunen wärmen.',
    B: { svg: 'feder', teile: D.teile.feder, was: { 'Schaft': 'Er ist hohl und trotzdem fest und biegsam.', 'Fahne': 'Sie besteht aus vielen Ästen, die sich ineinander verhaken.', 'Spule': 'Mit der Spule steckt die Feder in der Haut.' } },
    S: { kats: ['Schwungfeder', 'Steuerfeder', 'Deckfeder', 'Daune'], f: (x) => `Welche Feder ist gemeint? <b>${x}</b>`, h: 'Schwung = Flügel, Steuer = Schwanz, Deck = außen am Körper, Daune = darunter.',
      items: [['sitzt am Flügel', 0], ['bildet die Tragfläche', 0], ['sitzt am Schwanz', 1], ['lenkt und bremst beim Landen', 1], ['bedeckt den Körper wie Dachziegel', 2], ['schützt vor Wind und Regen', 2], ['weich und flauschig, direkt am Körper', 3], ['hält warm', 3]] },
    F: [
      { f: 'Woraus bestehen Federn?', a: 'aus Horn', x: ['aus Knochen', 'aus Kalk', 'aus Haut'], w: 'Wie unsere Haare und Fingernägel.' },
      { f: 'Welche Federn halten den Vogel <b>warm</b>?', a: 'die Daunen', x: ['die Schwungfedern', 'die Steuerfedern', 'die Schwanzfedern'], w: 'Zwischen den weichen Daunen sitzt viel Luft. Luft hält die Wärme gut.' },
      { f: 'Welche Federn bilden die <b>Tragfläche</b> des Flügels?', a: 'die Schwungfedern', x: ['die Daunen', 'die Deckfedern am Bauch', 'die Steuerfedern'], w: 'Sie schließen sich zu einer Fläche, die kaum Luft durchlässt.' },
      { f: 'Wozu dienen die <b>Steuerfedern</b> am Schwanz?', a: 'zum Lenken und zum Bremsen bei der Landung', x: ['zum Wärmen', 'zum Singen', 'zum Graben'], w: 'Beim Landen fächert der Vogel den Schwanz auf.' },
      { f: 'Die Äste einer Feder haken sich mit winzigen Häkchen ineinander. Womit kann man das vergleichen?', a: 'mit einem Klettverschluss', x: ['mit einem Knoten', 'mit Kleber', 'mit einem Nagel'], w: 'Reißt die Fahne auf, zieht der Vogel die Feder durch den Schnabel: Sie schließt sich wieder.' },
      { f: 'Ein Vogel zieht seine Federn immer wieder durch den Schnabel. Was tut er?', a: 'Er pflegt sein Gefieder.', x: ['Er frisst die Federn.', 'Er ist krank.', 'Er baut ein Nest.'], w: 'Er ordnet die Federn und fettet sie ein. Nur ein gepflegtes Gefieder trägt und wärmt.' },
      { f: 'Vögel werfen alte Federn ab und bekommen neue. Wie heißt dieser Federwechsel?', a: 'Mauser', x: ['Häutung', 'Metamorphose', 'Balz'], w: 'Federn nutzen sich ab und müssen ersetzt werden.' },
      { f: 'Warum plustern sich Vögel an kalten Tagen auf?', a: 'Zwischen den Federn ist dann mehr Luft, die wärmt.', x: ['Sie wollen größer aussehen.', 'Sie sind dick geworden.', 'Sie trocknen ihre Federn.'], w: 'Die Luftschicht wirkt wie eine dicke Jacke.' },
    ],
    T: [
      { f: 'Die weichen Federn, die den Vogel wärmen, heißen ___.', a: ['Daunen', 'Daunenfedern', 'Daune'], w: 'Sie liegen unter den Deckfedern.' },
      { f: 'Die großen Federn am Flügel heißen ___.', a: ['Schwungfedern', 'Schwungfeder'], w: 'Sie bilden die Tragfläche.' },
      { f: 'Der Federwechsel der Vögel heißt ___.', a: 'Mauser', w: 'Alte Federn fallen aus, neue wachsen nach.' },
    ],
  }, { beschriften: 16, sortieren: 22, passtNicht: 0, frage: 46, tippen: 16 });

  G.vogelFlug = baue('b5-vogel-flug', {
    h: 'Ruderflug: Flügel schlagen. Gleitflug: Flügel ausgebreitet, es geht abwärts. Segelflug: warme Aufwinde tragen nach oben. Rüttelflug: auf der Stelle stehen.',
    S: { kats: ['Ruderflug', 'Gleitflug', 'Segelflug', 'Rüttelflug'], f: (x) => `Welche Flugart ist das? <b>${x}</b>`, h: 'Schlagen die Flügel? Geht es abwärts oder aufwärts? Steht der Vogel auf der Stelle?',
      items: [['Die Flügel schlagen kräftig auf und ab.', 0], ['Start vom Boden', 0, 'Zum Starten braucht der Vogel Muskelkraft.'], ['Flügel ausgebreitet, ohne Schlag langsam abwärts', 1], ['Landeanflug mit stillen Flügeln', 1],
        ['Der Vogel kreist in warmer Aufwärtsluft immer höher, ohne zu schlagen.', 2], ['Störche schrauben sich über einem warmen Feld nach oben.', 2], ['Der Vogel steht mit schnellem Flügelschlag an einer Stelle in der Luft.', 3], ['Ein Turmfalke späht nach Mäusen.', 3]] },
    F: [
      { f: 'Bei welcher Flugart verbraucht der Vogel die <b>meiste</b> Kraft?', a: 'beim Ruderflug', x: ['beim Gleitflug', 'beim Segelflug', 'beim Sitzen'], w: 'Hier arbeiten die Flugmuskeln ständig.' },
      { f: 'Was passiert beim <b>Abschlag</b> der Flügel?', a: 'Die Federn schließen sich, der Flügel drückt die Luft nach unten und hinten.', x: ['Die Federn öffnen sich und lassen die Luft durch.', 'Der Vogel bremst.', 'Der Vogel sinkt.'], w: 'So entstehen Auftrieb und Vortrieb. Beim Aufschlag drehen sich die Federn und lassen Luft durch.' },
      { f: 'Welche Vögel sind besonders gute <b>Segelflieger</b>?', a: 'große Vögel mit breiten Flügeln wie Storch und Bussard', x: ['kleine Vögel wie Meisen', 'Enten', 'Hühner'], w: 'Ihre großen Flügel nutzen die aufsteigende Warmluft.' },
      { f: 'Was trägt einen Vogel beim Segelflug nach oben?', a: 'aufsteigende warme Luft', x: ['seine Muskelkraft', 'der Regen', 'die Schwerkraft'], w: 'Über warmen Feldern oder an Berghängen steigt Luft auf.' },
      { f: 'Welcher Vogel ist für seinen <b>Rüttelflug</b> bekannt?', a: 'der Turmfalke', x: ['die Amsel', 'die Stockente', 'der Buntspecht'], w: 'Er „steht“ in der Luft und späht nach Mäusen.' },
      { f: 'Wie bremst ein Vogel bei der Landung?', a: 'Er stellt die Flügel auf und fächert die Schwanzfedern.', x: ['Er klappt die Flügel zusammen.', 'Er schlägt schneller.', 'Er lässt sich fallen.'], w: 'So wird der Luftwiderstand größer.' },
      { f: 'Warum spart ein Storch auf dem Zug nach Afrika mit dem Segelflug Kraft?', a: 'Er muss kaum mit den Flügeln schlagen.', x: ['Er fliegt dann schneller als ein Flugzeug.', 'Er schläft dabei.', 'Er wird dabei leichter.'], w: 'Er lässt sich hochtragen und gleitet dann weit vorwärts.' },
    ],
    T: [
      { f: 'Fliegen mit Flügelschlag heißt ___.', a: 'Ruderflug', w: 'Die häufigste Flugart.' },
      { f: 'Kreisen in aufsteigender Warmluft heißt ___.', a: 'Segelflug', w: 'Störche und Greifvögel sind Meister darin.' },
      { f: 'Auf der Stelle in der Luft stehen heißt ___.', a: 'Rüttelflug', w: 'Typisch für den Turmfalken.' },
    ],
  }, { sortieren: 34, passtNicht: 0, frage: 48, tippen: 18 });

  const SCHNABEL = [['schnabelHaken', 'Hakenschnabel', 'Greifvogel: Fleisch zerreißen'], ['schnabelSeih', 'Seihschnabel', 'Ente: Nahrung aus dem Wasser seihen'], ['schnabelMeissel', 'Meißelschnabel', 'Specht: Holz aufhacken'], ['schnabelKegel', 'Kegelschnabel', 'Körnerfresser wie Sperling und Fink: Körner knacken'], ['schnabelPinzette', 'Pinzettenschnabel', 'Insektenfresser wie Rotkehlchen: Insekten aufpicken']];
  const schnabelWozu = () => { const e = U.pick(SCHNABEL), ch = U.shuffle([e[2], ...U.shuffle(SCHNABEL.filter((x) => x !== e).map((x) => x[2])).slice(0, 3)]);
    return { prompt: 'Zu welchem Vogel und welcher Nahrung passt dieser Schnabel?', figure: D.bilder[e[0]](), choices: ch, correct: ch.indexOf(e[2]), hint: 'Die Form des Schnabels verrät, was der Vogel frisst.',
      solution: `<b>${e[1]}</b><br>${e[2]}`, ex: { mode: 'karte', art: 'schnabelWozu', q: 'Zu welchem Vogel und welcher Nahrung passt dieser Schnabel?', opts: ch, ok: ch.indexOf(e[2]), svg: e[0], merk: `<b>${e[1]}</b>: ${e[2]}` } }; };
  G.vogelSchnabel = baue('b5-vogel-schnabel', {
    h: 'Schnabel und Füße passen zur Nahrung und zum Lebensraum: Haken zum Reißen, Sieb zum Seihen, Meißel zum Hacken, Kegel zum Knacken.',
    E: { f: 'Wie heißt diese Schnabelform?', arten: SCHNABEL.map((x) => [x[0], x[1], x[2]]) },
    extra: { schnabelWozu },
    S: { kats: ['Schwimmfuß', 'Greiffuß', 'Kletterfuß'], f: (x) => `Welcher Fuß passt? <b>${x}</b>`, h: 'Schwimmen braucht Häute, Greifen Krallen, Klettern Halt am Stamm.',
      items: [['Schwimmhäute zwischen den Zehen', 0], ['Stockente', 0], ['Schwan', 0], ['lange, spitze Krallen zum Packen der Beute', 1], ['Mäusebussard', 1], ['Schleiereule', 1], ['zwei Zehen nach vorn, zwei nach hinten', 2], ['Buntspecht', 2]] },
    F: [
      { f: 'Wozu dient der <b>Hakenschnabel</b> des Mäusebussards?', a: 'zum Zerreißen der Beute', x: ['zum Knacken von Körnern', 'zum Seihen von Wasser', 'zum Hacken von Holz'], w: 'Greifvögel können nicht kauen. Sie reißen Stücke aus der Beute.', svg: 'schnabelHaken' },
      { f: 'Am Schnabelrand der Stockente sitzen Hornleisten wie ein Sieb. Wozu?', a: 'Sie hält damit kleine Tiere und Pflanzenteile aus dem Wasser zurück.', x: ['Sie kaut damit.', 'Sie beißt damit Feinde.', 'Sie bürstet damit ihr Gefieder.'], w: 'Das Wasser läuft seitlich ab, die Nahrung bleibt im Schnabel.', svg: 'schnabelSeih' },
      { f: 'Welchen Schnabel haben <b>Körnerfresser</b> wie Sperling und Buchfink?', a: 'einen kurzen, kräftigen Kegelschnabel', x: ['einen langen Meißelschnabel', 'einen Hakenschnabel', 'einen Seihschnabel'], w: 'Damit knacken sie harte Samen.', svg: 'schnabelKegel' },
      { f: 'Welchen Schnabel haben <b>Insektenfresser</b> wie Rotkehlchen und Zaunkönig?', a: 'einen dünnen, spitzen Schnabel wie eine Pinzette', x: ['einen dicken Kegelschnabel', 'einen Hakenschnabel', 'einen breiten Seihschnabel'], w: 'Damit picken sie Insekten aus Ritzen.', svg: 'schnabelPinzette' },
      { f: 'Du siehst einen fremden Vogel mit Hakenschnabel und starken Krallen. Was frisst er wahrscheinlich?', a: 'andere Tiere', x: ['Körner', 'Blütennektar', 'Wasserpflanzen'], w: 'Bau und Aufgabe hängen zusammen: Haken und Krallen sind Werkzeuge eines Jägers.' },
      { f: 'Womit packt und tötet ein Greifvogel seine Beute?', a: 'mit den Füßen und ihren Krallen', x: ['mit dem Schnabel', 'mit den Flügeln', 'mit dem Schwanz'], w: 'Die Greiffüße nennt man auch Fänge. Der Schnabel zerteilt die Beute nur.' },
    ],
    T: [
      { f: 'Der gebogene Schnabel der Greifvögel heißt ___.', a: 'Hakenschnabel', w: 'Damit reißen sie Fleisch.' },
      { f: 'Der Schnabel der Ente, der wie ein Sieb arbeitet, heißt ___.', a: 'Seihschnabel', w: 'Seihen heißt: durch ein Sieb gießen.' },
    ],
  }, { erkennen: 20, schnabelWozu: 20, sortieren: 20, passtNicht: 0, frage: 30, tippen: 10 });

  const VIER = { kats: ['Stockente', 'Mäusebussard', 'Schleiereule', 'Buntspecht'], f: (x) => `Zu welchem Vogel passt das? <b>${x}</b>`, h: 'Wasservogel, Greifvogel, Nachtjäger, Klettervogel: Jeder Körper passt zu seiner Lebensweise.',
    items: [['Schwimmhäute und Seihschnabel', 0], ['gründelt: Kopf unter Wasser, Schwanz nach oben', 0], ['fettet das Gefieder mit Fett aus der Bürzeldrüse ein', 0], ['Küken schwimmen schon am ersten Tag', 0],
      ['kreist am Tag hoch über Feldern', 1], ['Hakenschnabel und Greiffüße, jagt am Tag Mäuse', 1], ['sieht eine Maus aus großer Höhe', 1], ['sitzt auf einem Pfahl und wartet (Ansitz)', 1],
      ['herzförmiger Gesichtsschleier', 2], ['jagt nachts und hört die Maus im Dunkeln', 2], ['fliegt fast lautlos', 2], ['brütet in Scheunen und Kirchtürmen', 2],
      ['Meißelschnabel und Stützschwanz', 3], ['trommelt am Baumstamm', 3], ['zimmert eine Bruthöhle ins Holz', 3], ['holt Insektenlarven mit langer, klebriger Zunge aus dem Holz', 3]] };
  G.vogelVier = baue('b5-vogel-vier', {
    h: VIER.h,
    S: VIER,
    E: { f: 'Welcher Vogel ist das?', arten: [['stockente', 'Stockente', 'Wasservogel mit Schwimmhäuten und Seihschnabel.'], ['bussard', 'Mäusebussard', 'Greifvogel mit breiten Flügeln.'], ['schleiereule', 'Schleiereule', 'Nachtjäger mit herzförmigem Gesichtsschleier.'], ['buntspecht', 'Buntspecht', 'Klettervogel mit Meißelschnabel und Stützschwanz.']] },
    F: [
      { f: 'Warum wird das Gefieder der <b>Stockente</b> im Wasser nicht nass?', a: 'Sie fettet es mit Fett aus der Bürzeldrüse ein.', x: ['Es ist aus Plastik.', 'Sie schwimmt so schnell.', 'Sie taucht nie unter.'], w: 'Das Wasser perlt ab. Darunter halten Daunen die Ente warm.', svg: 'stockente' },
      { f: 'Enten strecken beim Fressen den Schwanz nach oben und den Kopf unter Wasser. Wie heißt das?', a: 'Gründeln', x: ['Tauchen', 'Balzen', 'Rütteln'], w: 'Sie suchen am flachen Grund nach Nahrung.' },
      { f: 'Warum ist das Weibchen der Stockente unscheinbar braun?', a: 'Beim Brüten ist es so gut getarnt.', x: ['Es ist älter.', 'Es ist krank.', 'Es mag keine Farben.'], w: 'Das bunte Männchen (Erpel) wirbt um das Weibchen, das Weibchen brütet am Boden.' },
      { f: 'Welcher Sinn ist beim <b>Mäusebussard</b> besonders gut?', a: 'der Sehsinn', x: ['der Geruchssinn', 'der Tastsinn', 'der Geschmackssinn'], w: 'Er erkennt eine Maus aus großer Höhe.', svg: 'bussard' },
      { f: 'Wozu dient der <b>Gesichtsschleier</b> der Schleiereule?', a: 'Er leitet Geräusche zu den Ohren, wie ein Trichter.', x: ['Er wärmt das Gesicht.', 'Er schreckt Feinde ab.', 'Er hält Regen ab.'], w: 'So hört sie das Rascheln einer Maus auch in völliger Dunkelheit.', svg: 'schleiereule' },
      { f: 'Warum fliegt eine Eule fast <b>lautlos</b>?', a: 'Ihre Federn sind weich und haben gefranste Ränder.', x: ['Sie fliegt sehr langsam.', 'Sie hat keine Federn.', 'Sie hält die Luft an.'], w: 'Die Maus hört sie nicht kommen, und die Eule hört selbst besser.' },
      { f: 'Eulen würgen Haare und Knochen ihrer Beute als Ballen wieder aus. Wie heißt so ein Ballen?', a: 'Gewölle', x: ['Kot', 'Nest', 'Kropf'], w: 'An den Knochen im Gewölle sieht man, was die Eule gefressen hat.' },
      { f: 'Wie hält sich der <b>Buntspecht</b> am Stamm fest?', a: 'mit Kletterfüßen und dem steifen Stützschwanz', x: ['mit dem Schnabel', 'mit Saugnäpfen', 'mit den Flügeln'], w: 'Zwei Zehen zeigen nach vorn, zwei nach hinten. Der Schwanz stützt von unten.', svg: 'buntspecht' },
      { f: 'Wozu <b>trommelt</b> der Buntspecht im Frühjahr?', a: 'Er markiert sein Revier und lockt ein Weibchen an.', x: ['Er sucht Wasser.', 'Er baut ein Haus für Eichhörnchen.', 'Er zählt die Bäume.'], w: 'Das Trommeln ersetzt bei ihm den Gesang.' },
    ],
    T: [
      { f: 'Die Drüse, aus der die Ente Fett für ihr Gefieder nimmt, heißt ___.', a: 'Bürzeldrüse', w: 'Sie sitzt oben an der Schwanzwurzel.' },
      { f: 'Der ausgewürgte Ballen aus Haaren und Knochen heißt ___.', a: 'Gewölle', w: 'Typisch für Eulen und Greifvögel.' },
      { f: 'Der steife Schwanz, mit dem sich der Specht abstützt, heißt ___.', a: 'Stützschwanz', w: 'Seine Federn sind besonders fest.' },
    ],
  }, { sortieren: 28, passtNicht: 8, erkennen: 14, frage: 38, tippen: 12 });

  G.vogelEi = baue('b5-vogel-ei', {
    h: 'Im Ei liegt oben auf dem Dotter die Keimscheibe. Daraus wird das Küken. Dotter und Eiklar sind sein Nahrungsvorrat. Das Huhn brütet 21 Tage.',
    B: { svg: 'ei', teile: D.teile.ei, was: { 'Kalkschale': 'Sie schützt und lässt durch feine Poren Luft hindurch.', 'Eiklar': 'Es schützt den Dotter und liefert Wasser und Nährstoffe.', 'Dotter': 'Der Nahrungsvorrat für das Küken.', 'Keimscheibe': 'Aus ihr entwickelt sich das Küken.', 'Hagelschnur': 'Sie hält den Dotter in der Mitte. Die Keimscheibe bleibt so immer oben.', 'Luftkammer': 'Sie liegt am stumpfen Ende. Hier holt das Küken kurz vor dem Schlüpfen zum ersten Mal Luft.' } },
    O: [
      { t: 'Vom Ei zum Küken: Bringe die Schritte in die richtige Reihenfolge.', items: ['Der Hahn begattet die Henne.', 'Im Körper der Henne entsteht das Ei mit Eiklar und Kalkschale.', 'Die Henne legt das Ei.', 'Die Henne brütet 21 Tage.', 'Das Küken bricht die Schale mit dem Eizahn auf.'], n: 4, w: 'Innere Befruchtung, Eiablage, Brüten, Schlüpfen.' },
    ],
    F: [
      { f: 'Aus welchem Teil des Eis entwickelt sich das <b>Küken</b>?', a: 'aus der Keimscheibe', x: ['aus dem Eiklar', 'aus der Luftkammer', 'aus der Schale'], w: 'Die Keimscheibe ist ein kleiner heller Fleck auf dem Dotter.' },
      { f: 'Wovon ernährt sich das Küken im Ei?', a: 'von Dotter und Eiklar', x: ['von Körnern', 'von der Schale', 'von der Luft'], w: 'Das Ei enthält alles, was das Küken zum Wachsen braucht.' },
      { f: 'Wie lange brütet eine Henne, bis die Küken schlüpfen?', a: '21 Tage', x: ['3 Tage', '100 Tage', '9 Monate'], w: 'Also drei Wochen.' },
      { f: 'Warum muss das Ei <b>bebrütet</b> werden?', a: 'Das Küken braucht gleichmäßige Wärme, um sich zu entwickeln.', x: ['Damit die Schale hart wird.', 'Damit das Ei nicht wegrollt.', 'Damit es nicht gestohlen wird.'], w: 'Die Henne wendet die Eier auch regelmäßig.' },
      { f: 'Womit bricht das Küken die Schale auf?', a: 'mit dem Eizahn auf dem Schnabel', x: ['mit den Krallen', 'mit den Flügeln', 'Die Henne öffnet das Ei.'], w: 'Der Eizahn ist eine harte Spitze. Er fällt nach dem Schlüpfen ab.' },
      { f: 'Wo werden bei Vögeln die Eizellen befruchtet?', a: 'im Körper des Weibchens (innere Befruchtung)', x: ['im Nest', 'im Wasser', 'in der Luft'], w: 'Erst danach bilden sich Eiklar und Kalkschale um den Dotter.' },
      { f: 'Kann aus einem Ei aus dem Supermarkt ein Küken schlüpfen?', a: 'Nein, diese Eier sind nicht befruchtet.', x: ['Ja, immer.', 'Ja, wenn man es warm hält.', 'Ja, nach einem Jahr.'], w: 'In den Ställen der Legehennen leben keine Hähne.' },
      { f: 'Die Schale hat winzige <b>Poren</b>. Wozu?', a: 'Das Küken bekommt durch sie Luft.', x: ['Damit Wasser hineinläuft.', 'Damit das Ei leichter wird.', 'Zur Verzierung.'], w: 'Auch im Ei wird geatmet.' },
      { f: 'Wie nennt man eine Henne, die brütet oder Küken führt?', a: 'Glucke', x: ['Erpel', 'Hahn', 'Küken'], w: 'Sie wärmt und beschützt die Küken.' },
    ],
    T: [
      { f: 'Das Küken entwickelt sich aus der ___.', a: 'Keimscheibe', w: 'Sie liegt oben auf dem Dotter.' },
      { f: 'Eine Henne brütet ___ Tage.', a: ['21', 'einundzwanzig'], w: 'Drei Wochen.' },
      { f: 'Das Gelbe im Ei heißt ___.', a: ['Dotter', 'Eidotter', 'Eigelb'], w: 'Es ist der Nahrungsvorrat.' },
    ],
  }, { beschriften: 24, ordnen: 14, frage: 46, tippen: 16 });

  const NEST = { kats: ['Nesthocker', 'Nestflüchter'], f: (x) => `Nesthocker oder Nestflüchter? <b>${x}</b>`, h: 'Nesthocker schlüpfen nackt und blind und werden gefüttert. Nestflüchter haben Daunen, sehen und laufen gleich mit.',
    items: [['Amsel', 0], ['Kohlmeise', 0], ['Weißstorch', 0], ['Buntspecht', 0], ['Mäusebussard', 0], ['Schleiereule', 0], ['schlüpft nackt und blind', 0], ['wird wochenlang im Nest gefüttert', 0],
      ['Haushuhn', 1], ['Stockente', 1], ['Höckerschwan', 1], ['Graugans', 1], ['Kranich', 1], ['schlüpft mit Daunen und offenen Augen', 1], ['läuft wenige Stunden nach dem Schlüpfen', 1]] };
  G.vogelNest = baue('b5-vogel-nest', {
    h: NEST.h,
    S: NEST,
    F: [
      { f: 'Wie sieht ein frisch geschlüpftes <b>Amselküken</b> aus?', a: 'nackt, blind und hilflos', x: ['mit Federn, es fliegt sofort', 'mit Daunen, es läuft sofort', 'wie eine kleine Raupe'], w: 'Amseln sind Nesthocker.' },
      { f: 'Was kann ein <b>Entenküken</b> schon am ersten Tag?', a: 'laufen, schwimmen und selbst Futter suchen', x: ['fliegen', 'Eier legen', 'gar nichts'], w: 'Enten sind Nestflüchter. Die Mutter führt und wärmt die Küken.' },
      { f: 'Beide Eltern füttern und wärmen ihre Jungen. Wie nennt man das?', a: 'Brutpflege', x: ['Brutfürsorge', 'Balz', 'Mauser'], w: 'Fast alle Vögel betreiben Brutpflege.' },
      { f: 'Nestflüchter-Küken haben beim Schlüpfen schon Daunen und offene Augen. Was folgt daraus für das <b>Ei</b>?', a: 'Die Eier sind größer und werden länger bebrütet.', x: ['Die Eier sind winzig.', 'Die Eier haben keine Schale.', 'Es gibt keinen Unterschied.'], w: 'Das Küken ist beim Schlüpfen schon weiter entwickelt.' },
      { f: 'Warum bauen Nesthocker meist gut versteckte Nester in Hecken, Bäumen oder Höhlen?', a: 'Die hilflosen Jungen müssen dort lange sicher sein.', x: ['Weil sie das Sonnenlicht nicht mögen.', 'Weil sie am Boden nicht laufen können.', 'Aus Zufall.'], w: 'Nestflüchter brüten oft am Boden. Ihre Küken können vor Feinden weglaufen.' },
      { f: 'Junge Amseln reißen den Schnabel weit auf und zeigen den gelben Rachen. Wie heißt das?', a: 'Sperren', x: ['Balzen', 'Mausern', 'Gründeln'], w: 'Der leuchtende Rachen ist ein Signal: Die Eltern stopfen Futter hinein.' },
    ],
    T: [
      { f: 'Küken, die nackt und blind schlüpfen und im Nest bleiben, sind ___.', a: 'Nesthocker', w: 'Zum Beispiel Amsel und Meise.' },
      { f: 'Küken, die gleich nach dem Schlüpfen laufen, sind ___.', a: 'Nestflüchter', w: 'Zum Beispiel Huhn und Ente.' },
    ],
    A: { w: ['Hühnerküken sind Nestflüchter.', 'Amseln sind Nesthocker.', 'Nesthocker schlüpfen nackt und blind.'],
      f: ['Entenküken sind Nesthocker.', 'Amselküken können sofort fliegen.', 'Nestflüchter schlüpfen ohne Daunen.'] },
  }, { sortieren: 36, passtNicht: 10, frage: 30, tippen: 10, aussage: 14 });

  G.vogelAmsel = baue('b5-vogel-amsel', {
    h: 'Der Gesang des Männchens hat zwei Aufgaben: Er sagt anderen Männchen „Hier ist mein Revier“ und lockt Weibchen an.',
    O: [
      { t: 'Das Amseljahr im Frühling: Bringe die Schritte in die richtige Reihenfolge.', items: ['Das Männchen besetzt ein Revier und singt.', 'Männchen und Weibchen finden sich bei der Balz.', 'Das Weibchen baut das Nest.', 'Das Weibchen legt die Eier und brütet.', 'Beide Eltern füttern die Jungen.'], n: 4, w: 'Revier, Balz, Nestbau, Brüten, Füttern.' },
    ],
    F: [
      { f: 'Warum singt das <b>Amselmännchen</b> im Frühjahr von einem hohen Platz?', a: 'Es markiert sein Revier und lockt Weibchen an.', x: ['Es hat Hunger.', 'Es warnt vor Regen.', 'Es übt für den Winter.'], w: 'Der Gesang ist ein Signal an andere Amseln.', svg: 'amsel' },
      { f: 'Was ist ein <b>Revier</b>?', a: 'ein Gebiet, das ein Tier gegen Artgenossen verteidigt', x: ['ein Nest', 'ein Futterhaus', 'ein Schwarm'], w: 'Im Revier muss genug Futter für die Jungen sein.' },
      { f: 'Ein fremdes Amselmännchen kommt ins Revier. Was tut der Besitzer?', a: 'Er droht und vertreibt es.', x: ['Er teilt sein Futter.', 'Er baut ihm ein Nest.', 'Er flieht für immer.'], w: 'Meist reicht Drohen. Echte Kämpfe sind selten.' },
      { f: 'Das Werben um ein Weibchen mit Gesang und besonderen Bewegungen heißt …', a: 'Balz', x: ['Mauser', 'Brut', 'Zug'], w: 'Bei der Balz zeigt das Männchen, dass es ein guter Partner ist.' },
      { f: 'Wie sieht das Amsel-<b>Weibchen</b> aus?', a: 'dunkelbraun', x: ['schwarz mit gelbem Schnabel', 'blau', 'weiß'], w: 'Auf dem Nest ist es so besser getarnt.' },
      { f: 'Wer sendet beim Gesang die Information, und wer empfängt sie?', a: 'Das singende Männchen sendet, andere Amseln empfangen.', x: ['Der Baum sendet, die Amsel empfängt.', 'Niemand, Gesang hat keine Bedeutung.', 'Die Eier senden.'], w: 'Zur Verständigung gehören immer ein Sender und ein Empfänger.' },
      { f: 'Wie lange brütet eine Amsel ungefähr?', a: 'etwa zwei Wochen', x: ['etwa zwei Tage', 'etwa zwei Monate', 'etwa ein Jahr'], w: 'Danach werden die Jungen noch etwa zwei Wochen im Nest gefüttert.' },
      { f: 'Woraus baut die Amsel ihr napfförmiges Nest?', a: 'aus Zweigen, Halmen, Moos und feuchter Erde', x: ['aus Steinen', 'aus Federn von Greifvögeln', 'aus Schnee'], w: 'Meist gut versteckt in einer Hecke oder einem Busch.' },
    ],
    T: [
      { f: 'Ein Gebiet, das ein Tier verteidigt, heißt ___.', a: 'Revier', w: 'Die Amsel markiert es mit Gesang.' },
      { f: 'Das Werben um einen Partner heißt ___.', a: 'Balz', w: 'Bei vielen Vögeln mit Gesang oder Tanz.' },
    ],
    A: { w: ['Das Amselmännchen markiert sein Revier mit Gesang.', 'Amselküken sind Nesthocker.', 'Das Amselweibchen ist braun.'],
      f: ['Amseln singen nur, weil sie hungrig sind.', 'Das Amselweibchen ist schwarz mit gelbem Schnabel.', 'Amseln legen ihre Eier ins Wasser.'] },
  }, { frage: 48, ordnen: 20, tippen: 14, aussage: 18 });

  G.vogelSchutz = baue('b5-vogel-schutz', {
    h: 'Vögel brauchen Futter, Brutplätze und Ruhe. Am meisten hilft es, ihre Lebensräume zu erhalten.',
    S: HILFT(['hilft den Vögeln', 'schadet den Vögeln'], [['Nistkasten aufhängen', 0], ['Hecke mit Beeren pflanzen', 0, 'Futter, Versteck und Brutplatz in einem.'], ['alte Bäume mit Höhlen stehen lassen', 0, 'Spechte, Meisen und Eulen brüten darin.'], ['Wiese erst spät im Jahr mähen', 0, 'Dann sind die Jungen der Bodenbrüter schon ausgeflogen.'], ['Aufkleber auf großen Glasscheiben', 0, 'Vögel erkennen das Glas sonst nicht.'], ['Naturschutzgebiet', 0],
      ['Hecken roden', 1], ['Insektengift spritzen', 1, 'Viele Vögel füttern ihre Jungen mit Insekten.'], ['Feuchtgebiet trockenlegen', 1], ['Nester zur Brutzeit stören', 1], ['Hecke im Frühjahr schneiden', 1, 'Dann wird dort gebrütet.'], ['große Glasflächen ohne Markierung', 1]], (x) => `Hilft es den Vögeln oder schadet es? <b>${x}</b>`),
    F: [
      { f: 'Was steht in der <b>Roten Liste</b>?', a: 'die Tier- und Pflanzenarten, die gefährdet sind', x: ['alle Vögel mit roten Federn', 'verbotene Haustiere', 'giftige Pflanzen'], w: 'So weiß man, welche Arten besonders geschützt werden müssen.' },
      { f: 'Warum darf man Hecken von März bis September nicht stark zurückschneiden?', a: 'In dieser Zeit brüten dort Vögel.', x: ['Die Hecke wächst dann nicht.', 'Es ist zu heiß.', 'Die Blätter sind giftig.'], w: 'Das steht sogar im Naturschutzgesetz.' },
      { f: 'Der <b>Wanderfalke</b> war in Sachsen ausgestorben. Wo brütet er heute wieder?', a: 'an den Felsen der Sächsischen Schweiz', x: ['im Dresdner Zoo', 'nirgends', 'nur in Afrika'], w: 'Er wurde dort wieder angesiedelt. Ein Insektengift hatte früher seine Eier dünnschalig gemacht.' },
      { f: 'Warum sind große <b>Glasscheiben</b> für Vögel gefährlich?', a: 'Sie sehen das Glas nicht und prallen dagegen.', x: ['Glas ist giftig.', 'Glas ist zu laut.', 'Sie frieren daran fest.'], w: 'Im Glas spiegeln sich Himmel und Bäume.' },
      { f: 'Wie hilft ein <b>Nistkasten</b>?', a: 'Er ersetzt Baumhöhlen, in denen Höhlenbrüter wie Meisen brüten.', x: ['Er füttert die Vögel.', 'Er wärmt die Vögel im Winter mit einer Heizung.', 'Er hält Vögel gefangen.'], w: 'Alte Bäume mit Höhlen sind selten geworden.' },
      { f: 'Viele Feldvögel wie die Feldlerche werden seltener. Was ist ein wichtiger Grund?', a: 'Auf großen, stark genutzten Feldern finden sie zu wenig Futter und Brutplätze.', x: ['Sie haben das Fliegen verlernt.', 'Es gibt zu viele Hecken.', 'Sie ziehen alle in die Stadt.'], w: 'Es fehlen Insekten, Wildkräuter und ungestörte Stellen.' },
      { f: 'Welcher große Vogel mit rotem Schnabel und roten Beinen brütet in Sachsen auf Dächern und Masten?', a: 'der Weißstorch', x: ['der Pelikan', 'der Flamingo', 'der Strauß'], w: 'Er braucht feuchte Wiesen, auf denen er Frösche, Mäuse und Insekten findet.' },
    ],
    T: [
      { f: 'Gefährdete Arten stehen in der Roten ___.', a: 'Liste', w: 'Es gibt sie für Deutschland und für jedes Bundesland.' },
      { f: 'Meisen brüten gern in einem aufgehängten ___.', a: ['Nistkasten', 'Vogelhaus', 'Vogelhäuschen'], w: 'Er ersetzt eine Baumhöhle.' },
    ],
  }, { sortieren: 32, passtNicht: 8, frage: 48, tippen: 12 });
})();
