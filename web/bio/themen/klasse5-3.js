/* BioDax – Klasse 5, Bereiche 6 und 7: Säugetiere, Wirbeltiere im Vergleich; am Ende die Lernbereiche (D.grades)
 * (Lehrplan LB 6–7 und Wahlbereiche; LINDER Biologie 5, S. 116–185). Texte selbst geschrieben, Fakten nachgeschlagen (faecher/bio/fakten.md).
 */
(function () {
  const D = window.BioDax, U = D.util, G = D.gen;
  const { baue } = U;
  const HILFT = (kats, items, f) => ({ kats, items, f, h: 'Überlege: Wird der Lebensraum besser oder schlechter? Finden die Tiere Futter, Verstecke und Plätze für ihre Jungen?' });

  // =====================================================
  // Bereich 6: Säugetiere in ihren Lebensräumen
  // =====================================================
  const WILD = { kats: ['heimisches Wildtier', 'Haustier'], f: (x) => `Wildtier oder Haustier? <b>${x}</b>`, h: 'Haustiere hat der Mensch aus Wildtieren gezüchtet. Sie leben bei ihm und werden von ihm versorgt.',
    items: [['Reh', 0], ['Rotfuchs', 0], ['Wildschwein', 0], ['Feldhase', 0], ['Eichhörnchen', 0], ['Igel', 0], ['Dachs', 0], ['Wolf', 0], ['Biber', 0], ['Fischotter', 0],
      ['Hund', 1], ['Hauskatze', 1], ['Rind', 1], ['Hausschwein', 1], ['Pferd', 1], ['Schaf', 1], ['Ziege', 1], ['Meerschweinchen', 1]] };
  const STAMM = [['Hund', 'Wolf'], ['Hausschwein', 'Wildschwein'], ['Hauskatze', 'Falbkatze'], ['Rind', 'Auerochse'], ['Hauskaninchen', 'Wildkaninchen'], ['Hausschaf', 'Mufflon']];
  const stammform = () => { const e = U.pick(STAMM), ch = U.shuffle([e[1], ...U.shuffle(STAMM.filter((x) => x !== e).map((x) => x[1])).slice(0, 3)]);
    return { prompt: `Von welchem Wildtier stammt dieses Haustier ab? <b>${e[0]}</b>`, choices: ch, correct: ch.indexOf(e[1]), hint: 'Jedes Haustier hat eine wilde Stammform. Oft steckt sie schon im Namen.',
      solution: `<b>${e[1]}</b><br>${e[0]} und ${e[1]}: Der Mensch hat das Wildtier gezähmt und über viele Generationen gezüchtet.`, ex: { mode: 'karte', art: 'stammform', q: `Von welchem Wildtier stammt ab: ${e[0]}?`, opts: ch, ok: ch.indexOf(e[1]), svg: '', merk: `${e[0]} ← <b>${e[1]}</b>` } }; };
  G.saeugerVielfalt = baue('b5-saeuger-vielfalt', {
    h: WILD.h,
    S: WILD,
    extra: { stammform },
    F: [
      { f: 'Wie sind Haustiere entstanden?', a: 'Der Mensch hat Wildtiere gezähmt und über lange Zeit gezüchtet.', x: ['Sie waren schon immer zahm.', 'Sie sind aus dem Zoo entlaufen.', 'Sie stammen von Dinosauriern ab.'], w: 'Zur Zucht wählte der Mensch immer die Tiere aus, die ihm am nützlichsten waren.' },
      { f: 'Dackel, Schäferhund und Pudel sehen sehr verschieden aus. Was sind sie?', a: 'verschiedene Rassen derselben Art', x: ['verschiedene Arten', 'verschiedene Tiergruppen', 'Wildtiere'], w: 'Alle Hunderassen gehören zur selben Art und können miteinander Junge bekommen.' },
      { f: 'Welches war wahrscheinlich das <b>erste</b> Haustier des Menschen?', a: 'der Hund', x: ['das Pferd', 'das Huhn', 'der Goldhamster'], w: 'Schon die Jäger der Steinzeit lebten mit gezähmten Wölfen, vor weit über 10.000 Jahren.' },
      { f: 'Rinder, Schweine und Schafe geben Milch, Fleisch oder Wolle. Wie nennt man solche Haustiere?', a: 'Nutztiere', x: ['Heimtiere', 'Wildtiere', 'Raubtiere'], w: 'Heimtiere wie Katze oder Meerschweinchen hält man zur Freude.' },
      { f: 'Welches ist das <b>größte</b> Säugetier der Erde?', a: 'der Blauwal', x: ['der Elefant', 'die Giraffe', 'das Nashorn'], w: 'Er wird etwa 30 Meter lang. Das größte Landsäugetier ist der Afrikanische Elefant.' },
      { f: 'Welches Säugetier ist in Sachsen wieder heimisch, nachdem es lange ausgerottet war?', a: 'der Wolf', x: ['der Löwe', 'der Braunbär', 'das Känguru'], w: 'Seit dem Jahr 2000 werden in der Oberlausitz wieder Wolfswelpen geboren.' },
      { f: 'Wie viele Säugetierarten gibt es ungefähr auf der Welt?', a: 'über 6000', x: ['etwa 60', 'etwa 600', 'über 6 Millionen'], w: 'Von der winzigen Spitzmaus bis zum Blauwal.' },
    ],
    T: [
      { f: 'Der Hund stammt vom ___ ab.', a: 'Wolf', w: 'Alle Hunderassen haben den Wolf als Vorfahren.' },
      { f: 'Das Hausschwein stammt vom ___ ab.', a: 'Wildschwein', w: 'Es ist heller, hat weniger Borsten und einen längeren Rumpf.' },
      { f: 'Haustiere, die Fleisch, Milch oder Wolle liefern, nennt man ___.', a: ['Nutztiere', 'Nutztier'], w: 'Zum Beispiel Rind, Schwein und Schaf.' },
    ],
  }, { sortieren: 26, passtNicht: 8, stammform: 22, frage: 32, tippen: 12 });

  G.saeugerMerkmale = baue('b5-saeuger-merkmale', {
    h: 'Säugetiere haben ein Fell aus Haaren, bringen lebende Junge zur Welt, säugen sie mit Milch, atmen mit Lungen und sind gleichwarm.',
    S: { kats: ['Säugetier', 'kein Säugetier'], f: (x) => `Säugetier oder nicht? <b>${x}</b>`, h: 'Entscheidend: Fell und Milch für die Jungen. Nicht: Wo das Tier lebt.',
      items: [['Fledermaus', 0, 'Sie fliegt, hat aber Fell und säugt ihre Jungen.'], ['Delfin', 0, 'Er lebt im Wasser, atmet aber mit Lungen und säugt seine Jungen.'], ['Maulwurf', 0], ['Igel', 0], ['Blauwal', 0], ['Seehund', 0], ['Mensch', 0], ['Eichhörnchen', 0],
        ['Pinguin', 1, 'Ein Vogel: Er hat Federn und legt Eier.'], ['Hai', 1, 'Ein Fisch: Er atmet mit Kiemen.'], ['Krokodil', 1, 'Ein Kriechtier.'], ['Salamander', 1, 'Ein Lurch.'], ['Strauß', 1, 'Ein Vogel.'], ['Forelle', 1], ['Blindschleiche', 1]] },
    F: [
      { f: 'Woher haben die <b>Säugetiere</b> ihren Namen?', a: 'Die Mütter säugen ihre Jungen mit Milch.', x: ['Sie saugen Wasser auf.', 'Sie saugen Blut.', 'Sie haben Saugnäpfe.'], w: 'Die Milch wird in den Milchdrüsen gebildet.' },
      { f: 'Womit ist die Haut der Säugetiere bedeckt?', a: 'mit Haaren (Fell)', x: ['mit Federn', 'mit Hornschuppen', 'mit Schleim'], w: 'Das Fell hält die Körperwärme.' },
      { f: 'Wo entwickeln sich die Jungen der Säugetiere vor der Geburt?', a: 'im Körper der Mutter', x: ['in einem Ei im Nest', 'im Wasser', 'in einer Erdhöhle'], w: 'Dort sind sie geschützt und werden über die Nabelschnur versorgt.' },
      { f: 'Säugetiere bringen fertige Junge zur Welt. Wie nennt man das?', a: 'lebendgebärend', x: ['eierlegend', 'laichend', 'brütend'], w: 'Fast alle Säugetiere sind lebendgebärend.' },
      { f: 'Welches Säugetier legt <b>Eier</b>?', a: 'das Schnabeltier', x: ['der Delfin', 'die Fledermaus', 'der Igel'], w: 'Eine seltene Ausnahme aus Australien. Die geschlüpften Jungen trinken trotzdem Milch.' },
      { f: 'Ein Reh hat im Winter die gleiche Körpertemperatur wie im Sommer. Säugetiere sind …', a: 'gleichwarm', x: ['wechselwarm', 'kältestarr', 'kaltblütig'], w: 'Dafür brauchen sie viel Nahrung: Ihr Körper „heizt“ ständig.' },
      { f: 'Womit atmen <b>alle</b> Säugetiere, auch Wale und Robben?', a: 'mit Lungen', x: ['mit Kiemen', 'durch die Haut', 'mit Luftsäcken'], w: 'Deshalb müssen Wale zum Atmen auftauchen.' },
      { f: 'Warum ist ein <b>Delfin</b> kein Fisch?', a: 'Er atmet mit Lungen und säugt seine Jungen.', x: ['Er ist zu groß.', 'Er kann springen.', 'Er lebt im Salzwasser.'], w: 'Auf den Lebensraum kommt es nicht an, sondern auf die Merkmale.' },
      { f: 'Wozu dient das Fell vor allem?', a: 'Es schützt vor Kälte.', x: ['Es hilft beim Atmen.', 'Es macht das Tier schwerer.', 'Es dient zum Schwimmen.'], w: 'Zwischen den Haaren sitzt Luft, die die Wärme hält. Viele Tiere bekommen ein dichteres Winterfell.' },
    ],
    T: [
      { f: 'Säugetiere ernähren ihre Jungen mit ___.', a: ['Milch', 'Muttermilch'], w: 'Daher der Name.' },
      { f: 'Die Haut der Säugetiere trägt ___.', a: ['Haare', 'Fell', 'ein Fell'], w: 'Bei Walen sind es nur wenige Borsten.' },
      { f: 'Tiere, die ihre Körpertemperatur immer gleich halten, sind ___.', a: 'gleichwarm', w: 'Vögel und Säugetiere.' },
    ],
    A: { w: ['Säugetiere atmen mit Lungen.', 'Die Fledermaus ist ein Säugetier.', 'Wale sind Säugetiere.', 'Säugetiere sind gleichwarm.'],
      f: ['Wale sind Fische.', 'Die Fledermaus ist ein Vogel.', 'Säugetiere sind wechselwarm.', 'Alle Tiere mit vier Beinen sind Säugetiere.'] },
  }, { sortieren: 26, passtNicht: 8, frage: 40, tippen: 12, aussage: 14 });

  const HK = { kats: ['Hund', 'Katze'], f: (x) => `Hund oder Katze? <b>${x}</b>`, h: 'Der Hund hetzt seine Beute im Rudel. Die Katze schleicht sich allein an.',
    items: [['Hetzjäger', 0], ['lebt im Rudel', 0], ['Krallen immer ausgefahren', 0], ['Nase ist der wichtigste Sinn', 0], ['stammt vom Wolf ab', 0], ['wedelt mit dem Schwanz, wenn er sich freut', 0],
      ['Schleichjäger', 1], ['jagt allein', 1], ['Krallen einziehbar', 1], ['sieht auch in der Dämmerung sehr gut', 1], ['stammt von der Falbkatze ab', 1], ['schnurrt, wenn sie sich wohlfühlt', 1]] };
  G.hund = baue('b5-hund', {
    h: 'Der Hund stammt vom Wolf ab. Er ist ein Rudeltier, ein ausdauernder Hetzjäger und hat eine sehr feine Nase.',
    F: [
      { f: 'Von welchem Tier stammen alle Hunde ab?', a: 'vom Wolf', x: ['vom Fuchs', 'vom Schakal', 'vom Bären'], w: 'Der Mensch zähmte Wölfe schon in der Steinzeit.' },
      { f: 'Wölfe und Hunde verfolgen ihre Beute ausdauernd über weite Strecken. Sie sind …', a: 'Hetzjäger', x: ['Schleichjäger', 'Ansitzjäger', 'Sammler'], w: 'Sie hetzen die Beute, bis sie müde wird.' },
      { f: 'Welcher Sinn ist beim Hund am besten entwickelt?', a: 'der Geruchssinn', x: ['der Sehsinn', 'der Tastsinn', 'der Geschmackssinn'], w: 'Deshalb arbeiten Hunde als Spürhunde und Rettungshunde.' },
      { f: 'Hunde treten nur mit den Zehen auf. Wie nennt man sie deshalb?', a: 'Zehengänger', x: ['Sohlengänger', 'Zehenspitzengänger', 'Hufgänger'], w: 'So können sie schnell und ausdauernd laufen. Der Mensch ist ein Sohlengänger.' },
      { f: 'Können Hunde ihre Krallen einziehen?', a: 'Nein, sie sind stumpf und immer draußen.', x: ['Ja, wie Katzen.', 'Hunde haben keine Krallen.', 'Nur im Winter.'], w: 'Die Krallen geben beim Laufen Halt wie Spikes.' },
      { f: 'Wie heißen die langen, spitzen <b>Eckzähne</b> im Gebiss von Hund und Katze?', a: 'Fangzähne', x: ['Mahlzähne', 'Schneidezähne', 'Stoßzähne'], w: 'Damit packen und halten sie die Beute.', svg: 'gebissFleisch' },
      { f: 'Wozu dienen die scharfen <b>Reißzähne</b> hinten im Gebiss?', a: 'zum Zerschneiden von Fleisch', x: ['zum Mahlen von Gras', 'zum Nagen von Holz', 'zum Saugen'], w: 'Sie arbeiten wie eine Schere.' },
      { f: 'Wie viele Zähne hat das Gebiss eines erwachsenen Hundes?', a: '42', x: ['20', '32', '60'], w: 'Der erwachsene Mensch hat 32 Zähne.' },
      { f: 'Wie kommen Hundewelpen zur Welt?', a: 'blind und hilflos: Sie sind Nesthocker.', x: ['Sie laufen sofort mit.', 'Sie schlüpfen aus Eiern.', 'Sie können sofort jagen.'], w: 'Die Augen öffnen sich erst nach etwa zwei Wochen.' },
      { f: 'Im Rudel hat jeder Wolf seinen Platz. Wie nennt man diese Ordnung?', a: 'Rangordnung', x: ['Reihenfolge', 'Hausordnung', 'Nahrungskette'], w: 'Auch der Hund ordnet sich in seine „Familie“ ein. Deshalb lässt er sich gut erziehen.' },
    ],
    T: [
      { f: 'Der Hund stammt vom ___ ab.', a: 'Wolf', w: 'Er wurde schon in der Steinzeit zum Haustier.' },
      { f: 'Weil der Hund seine Beute ausdauernd verfolgt, ist er ein ___.', a: 'Hetzjäger', w: 'Die Katze ist ein Schleichjäger.' },
      { f: 'Die langen Eckzähne des Hundes heißen ___.', a: ['Fangzähne', 'Fangzahn'], w: 'Damit hält er die Beute fest.' },
    ],
    A: { w: ['Hunde sind Zehengänger.', 'Hunde haben einen sehr guten Geruchssinn.', 'Welpen werden blind geboren.', 'Hunde sind Rudeltiere.'],
      f: ['Hunde können ihre Krallen einziehen.', 'Hunde stammen vom Fuchs ab.', 'Hunde sind Einzelgänger.', 'Hunde haben ein Pflanzenfressergebiss.'] },
  }, { frage: 56, tippen: 18, aussage: 26 });

  G.katze = baue('b5-katze', {
    h: HK.h,
    S: HK,
    F: [
      { f: 'Die Katze schleicht sich lautlos an und springt dann. Sie ist ein …', a: 'Schleichjäger', x: ['Hetzjäger', 'Rudeljäger', 'Pflanzenfresser'], w: 'Sie jagt allein und braucht Geduld statt Ausdauer.' },
      { f: 'Warum kann eine Katze so <b>leise</b> schleichen?', a: 'Sie zieht die Krallen ein und läuft auf weichen Ballen.', x: ['Sie ist sehr leicht.', 'Sie hält die Luft an.', 'Sie hat keine Füße.'], w: 'So bleiben die Krallen auch scharf.' },
      { f: 'Wozu fährt die Katze ihre <b>Krallen</b> aus?', a: 'zum Packen der Beute und zum Klettern', x: ['zum Laufen', 'zum Schlafen', 'zum Trinken'], w: 'Beim Laufen sind sie eingezogen.' },
      { f: 'Wie sehen die Pupillen einer Katze im <b>hellen</b> Licht aus?', a: 'schmale, senkrechte Schlitze', x: ['große Kreise', 'Dreiecke', 'gar nicht sichtbar'], w: 'In der Dämmerung werden sie groß und rund und lassen viel Licht hinein.' },
      { f: 'Warum leuchten Katzenaugen, wenn nachts Licht darauf fällt?', a: 'Eine Schicht hinten im Auge wirft das Licht zurück.', x: ['Sie haben kleine Lampen.', 'Sie sind aus Glas.', 'Weil Katzen zaubern.'], w: 'So wird das wenige Licht doppelt genutzt. Die Katze sieht in der Dämmerung viel besser als wir.' },
      { f: 'Wozu dienen die <b>Schnurrhaare</b>?', a: 'zum Tasten, auch im Dunkeln', x: ['zum Riechen', 'zum Wärmen', 'zum Schmuck'], w: 'Die Tasthaare spüren Hindernisse und sogar Luftbewegungen.' },
      { f: 'Wie viele Zähne hat das Gebiss einer erwachsenen Katze?', a: '30', x: ['10', '42', '50'], w: 'Auch die Katze hat Fangzähne und Reißzähne: ein Raubtiergebiss.' },
      { f: 'Eine Katze peitscht mit dem Schwanz und legt die Ohren an. Was bedeutet das?', a: 'Sie ist gereizt: Lass mich in Ruhe!', x: ['Sie freut sich.', 'Sie will spielen.', 'Sie hat Hunger.'], w: 'Beim Hund bedeutet Schwanzwedeln meist Freude. Deshalb verstehen sich die beiden oft falsch.' },
      { f: 'Von welchem Wildtier stammt die Hauskatze ab?', a: 'von der Falbkatze aus Afrika und Vorderasien', x: ['vom Löwen', 'vom Luchs', 'vom Tiger'], w: 'Sie suchte die Nähe der Menschen, weil es bei den Kornspeichern viele Mäuse gab.' },
    ],
    T: [
      { f: 'Die Katze kann ihre ___ einziehen.', a: 'Krallen', w: 'So schleicht sie lautlos.' },
      { f: 'Weil sich die Katze anschleicht, ist sie ein ___.', a: 'Schleichjäger', w: 'Der Hund ist ein Hetzjäger.' },
    ],
    A: { w: ['Katzen können ihre Krallen einziehen.', 'Katzen sind Zehengänger.', 'Katzen haben ein Raubtiergebiss.'],
      f: ['Katzen jagen im Rudel.', 'Katzen sind Hetzjäger.', 'Katzen sehen im Dunkeln schlechter als Menschen.'] },
  }, { sortieren: 28, passtNicht: 8, frage: 40, tippen: 10, aussage: 14 });

  G.verstaendigung = baue('b5-verstaendigung', {
    h: 'Zur Verständigung gehören ein Sender und ein Empfänger. Das Signal kann ein Laut, eine Körperhaltung oder ein Duft sein.',
    S: { kats: ['Laut', 'Körpersprache', 'Duft'], f: (x) => `Womit wird hier eine Information gesendet? <b>${x}</b>`, h: 'Hört man es, sieht man es oder riecht man es?',
      items: [['Bellen', 0], ['Knurren', 0], ['Schnurren', 0], ['Heulen der Wölfe', 0], ['Schwanzwedeln', 1], ['Zähne fletschen', 1], ['Ohren anlegen', 1], ['Katzenbuckel mit gesträubtem Fell', 1], ['sich auf den Rücken legen', 1], ['Urinmarke am Baum', 2], ['Kopf an einem Gegenstand reiben', 2], ['Kot an der Reviergrenze', 2]] },
    F: [
      { f: 'Ein Hund knurrt, ein anderer weicht zurück. Wer ist der <b>Sender</b>?', a: 'der knurrende Hund', x: ['der zurückweichende Hund', 'beide', 'keiner'], w: 'Der Sender gibt das Signal ab, der Empfänger nimmt es wahr und reagiert.' },
      { f: 'Ein Hund legt sich vor einem stärkeren Hund auf den Rücken. Was zeigt er damit?', a: 'Ich gebe nach, tu mir nichts.', x: ['Ich greife gleich an.', 'Ich habe Hunger.', 'Ich bin der Chef.'], w: 'Diese Unterwerfung beendet den Streit, ohne dass jemand verletzt wird.' },
      { f: 'Ein Hund fletscht die Zähne und sträubt das Nackenfell. Was bedeutet das?', a: 'Er droht.', x: ['Er freut sich.', 'Er ist müde.', 'Er will spielen.'], w: 'Dann sollte man Abstand halten.' },
      { f: 'Warum hebt ein Rüde an vielen Bäumen das Bein?', a: 'Er markiert sein Revier mit Duft.', x: ['Er gießt die Bäume.', 'Er hat Durst.', 'Er übt das Stehen.'], w: 'Andere Hunde „lesen“ daran, wer hier war.' },
      { f: 'Warum leben Wölfe im <b>Rudel</b>?', a: 'Gemeinsam können sie große Beute jagen und die Jungen aufziehen.', x: ['Weil sie allein Angst haben.', 'Weil sie sich sonst verlaufen.', 'Aus Zufall.'], w: 'Ein Rudel ist meist eine Familie: die Eltern und ihre Jungen.' },
      { f: 'Was ist ein Vorteil einer festen <b>Rangordnung</b> im Rudel?', a: 'Es gibt weniger Kämpfe.', x: ['Alle bekommen gleich viel Futter.', 'Niemand muss jagen.', 'Es gibt mehr Streit.'], w: 'Jedes Tier kennt seinen Platz.' },
      { f: 'Welche Sinnesorgane braucht ein Tier, um die Körpersprache eines anderen zu verstehen?', a: 'die Augen', x: ['die Nase', 'die Zunge', 'die Haut'], w: 'Laute nimmt es mit den Ohren auf, Düfte mit der Nase.' },
      { f: 'Wölfe heulen gemeinsam. Wozu?', a: 'Sie halten Kontakt und zeigen fremden Wölfen ihr Revier an.', x: ['Sie haben Schmerzen.', 'Sie rufen den Mond.', 'Sie locken Rehe an.'], w: 'Das Heulen ist kilometerweit zu hören.' },
    ],
    T: [
      { f: 'Wer ein Signal abgibt, ist der ___.', a: 'Sender', w: 'Wer es aufnimmt, ist der Empfänger.' },
      { f: 'Die feste Ordnung in einem Rudel heißt ___.', a: 'Rangordnung', w: 'Sie verhindert ständige Kämpfe.' },
      { f: 'Ein Gebiet, das Tiere mit Duftmarken abgrenzen, heißt ___.', a: 'Revier', w: 'Es wird gegen Artgenossen verteidigt.' },
    ],
  }, { sortieren: 26, passtNicht: 8, frage: 50, tippen: 16 });

  G.rind = baue('b5-rind', {
    h: 'Das Rind ist ein Pflanzenfresser und Wiederkäuer. Sein Magen hat vier Teile: Pansen, Netzmagen, Blättermagen, Labmagen.',
    O: [
      { t: 'Der Weg des Grases beim Rind: Bringe die Stationen in die richtige Reihenfolge.', items: ['Maul: Gras wird abgerupft und fast unzerkaut geschluckt', 'Pansen: Bakterien weichen das Gras auf und zersetzen es', 'Netzmagen: formt kleine Ballen', 'Maul: Wiederkäuen', 'Blättermagen: entzieht Wasser', 'Labmagen: eigentliche Verdauung'], w: 'Pansen → Netzmagen → zurück ins Maul → Blättermagen → Labmagen.' },
    ],
    F: [
      { f: 'Was ist ein <b>Wiederkäuer</b>?', a: 'ein Tier, das seine Nahrung hochwürgt und ein zweites Mal kaut', x: ['ein Tier, das sehr langsam frisst', 'ein Tier, das zweimal am Tag frisst', 'ein Tier ohne Zähne'], w: 'Rind, Schaf, Ziege, Reh und Hirsch sind Wiederkäuer.' },
      { f: 'Wie viele <b>Magenabschnitte</b> hat ein Rind?', a: 'vier', x: ['einen', 'zwei', 'zehn'], w: 'Pansen, Netzmagen, Blättermagen und Labmagen.' },
      { f: 'Welcher Magenabschnitt ist der größte?', a: 'der Pansen', x: ['der Labmagen', 'der Blättermagen', 'der Netzmagen'], w: 'Er fasst weit über hundert Liter. Darin leben winzige Helfer wie Bakterien, die das Gras zersetzen.' },
      { f: 'Wer hilft dem Rind, das harte Gras zu verdauen?', a: 'Bakterien und andere Kleinstlebewesen im Pansen', x: ['kleine Steine im Magen', 'die Fliegen auf der Weide', 'niemand'], w: 'Ohne sie könnte das Rind Gras nicht nutzen.' },
      { f: 'Was fehlt im <b>Oberkiefer</b> des Rindes vorn?', a: 'die Schneidezähne: Dort sitzt eine harte Hornplatte.', x: ['die Zunge', 'die Backenzähne', 'nichts'], w: 'Das Rind umfasst das Gras mit der Zunge, drückt es gegen die Hornplatte und rupft es ab.', svg: 'gebissPflanze' },
      { f: 'Wie sehen die <b>Backenzähne</b> eines Pflanzenfressers aus?', a: 'breit, mit rauer Kaufläche zum Mahlen', x: ['spitz und scharf', 'lang und dünn', 'er hat keine'], w: 'Sie zerreiben die Pflanzen wie Mühlsteine.', svg: 'gebissPflanze' },
      { f: 'Rinder treten mit <b>zwei</b> Zehen auf, die von Hufen umgeben sind. Sie sind …', a: 'Paarhufer', x: ['Unpaarhufer', 'Zehengänger', 'Sohlengänger'], w: 'Das Pferd tritt nur mit einer Zehe auf: Es ist ein Unpaarhufer.' },
      { f: 'Rinder stehen auf den Spitzen ihrer Zehen. Wie nennt man solche Tiere?', a: 'Zehenspitzengänger', x: ['Sohlengänger', 'Zehengänger', 'Fersengänger'], w: 'Auch Pferd, Schwein und Reh sind Zehenspitzengänger.' },
      { f: 'Ein neugeborenes Kalb steht nach kurzer Zeit auf und läuft der Mutter nach. Es ist ein …', a: 'Nestflüchter', x: ['Nesthocker', 'Tragling', 'Larve'], w: 'In der Wildnis muss es mit der Herde vor Feinden fliehen können.' },
    ],
    T: [
      { f: 'Rinder kauen ihre Nahrung zweimal. Sie sind ___.', a: ['Wiederkäuer', 'Wiederkäuer.'], w: 'Auch Schaf, Ziege und Reh.' },
      { f: 'Der größte Magenabschnitt des Rindes heißt ___.', a: 'Pansen', w: 'Hier arbeiten die Bakterien.' },
      { f: 'Tiere, die nur Pflanzen fressen, nennt man ___.', a: 'Pflanzenfresser', w: 'Ihr Gebiss hat breite Mahlzähne.' },
    ],
    A: { w: ['Das Rind ist ein Wiederkäuer.', 'Der Magen des Rindes hat vier Abschnitte.', 'Rinder sind Paarhufer.'],
      f: ['Das Rind hat spitze Fangzähne.', 'Das Rind hat nur einen einfachen Magen.', 'Kälber sind Nesthocker.'] },
  }, { frage: 50, ordnen: 16, tippen: 16, aussage: 18 });

  const GEB = [['gebissFleisch', 'Fleischfressergebiss', 'Lange Fangzähne und scharfe Reißzähne, zum Beispiel bei Hund und Katze.'], ['gebissPflanze', 'Pflanzenfressergebiss', 'Breite Mahlzähne, oben vorn eine Hornplatte, zum Beispiel beim Rind.'], ['gebissAlles', 'Allesfressergebiss', 'Schneidezähne, Eckzähne und höckerige Backenzähne, zum Beispiel beim Schwein.']];
  G.schwein = baue('b5-schwein', {
    h: 'Das Gebiss verrät die Nahrung: spitze Fang- und Reißzähne für Fleisch, breite Mahlzähne für Pflanzen, höckerige Backenzähne für alles.',
    E: { f: 'Welches Gebiss ist das?', arten: GEB },
    S: { kats: ['Fleischfresser', 'Pflanzenfresser', 'Allesfresser'], f: (x) => `Was frisst das Tier? <b>${x}</b>`, h: 'Fleischfresser jagen Tiere, Pflanzenfresser fressen nur Pflanzen, Allesfresser beides.',
      items: [['Katze', 0], ['Wolf', 0], ['Fischotter', 0], ['Luchs', 0], ['Rind', 1], ['Pferd', 1], ['Reh', 1], ['Feldhase', 1], ['Schaf', 1], ['Wildschwein', 2], ['Hausschwein', 2], ['Dachs', 2], ['Braunbär', 2], ['Mensch', 2]] },
    F: [
      { f: 'Schweine fressen Eicheln, Wurzeln, Würmer, Schnecken und sogar Mäuse. Sie sind …', a: 'Allesfresser', x: ['Pflanzenfresser', 'Fleischfresser', 'Wiederkäuer'], w: 'Ihr Gebiss kann beides: schneiden und zermahlen.' },
      { f: 'Wie sehen die Backenzähne eines <b>Allesfressers</b> aus?', a: 'breit mit rundlichen Höckern', x: ['flach und glatt wie eine Tischplatte', 'scharf wie Messer', 'er hat keine'], w: 'Sie liegen zwischen den Reißzähnen der Fleischfresser und den Mahlzähnen der Pflanzenfresser. Auch unsere Backenzähne sind so.', svg: 'gebissAlles' },
      { f: 'Wozu dient die <b>Rüsselscheibe</b> des Schweins?', a: 'zum Wühlen im Boden und zum Riechen', x: ['zum Atmen unter Wasser', 'zum Beißen', 'zum Trinken wie ein Elefant'], w: 'Schweine riechen sehr gut. Sie finden Nahrung tief im Boden.' },
      { f: 'Von welchem Wildtier stammt das Hausschwein ab?', a: 'vom Wildschwein', x: ['vom Nilpferd', 'vom Tapir', 'vom Igel'], w: 'Wildschweine leben in unseren Wäldern.' },
      { f: 'Warum wälzen sich Schweine im <b>Schlamm</b>?', a: 'Der Schlamm kühlt und schützt die Haut.', x: ['Weil sie schmutzig sein wollen.', 'Um sich zu verstecken.', 'Um zu trinken.'], w: 'Schweine können kaum schwitzen. Die Schlammschicht hilft auch gegen Insekten.' },
      { f: 'Wie viele Zähne hat das Gebiss eines erwachsenen Schweins?', a: '44', x: ['12', '24', '80'], w: 'Das ist die volle Zahl, die ein Säugetiergebiss in seiner Grundform hat.' },
      { f: 'Wie heißen junge Wildschweine mit ihren hellen Längsstreifen?', a: 'Frischlinge', x: ['Kitze', 'Welpen', 'Fohlen'], w: 'Die Streifen tarnen sie im Unterholz. Die Mutter heißt Bache, der Vater Keiler.' },
      { f: 'Schweine treten mit zwei Zehen auf. Sie sind wie die Rinder …', a: 'Paarhufer', x: ['Unpaarhufer', 'Zehengänger', 'Sohlengänger'], w: 'Zwei kleinere Zehen sitzen weiter hinten und berühren festen Boden nicht.' },
    ],
    T: [
      { f: 'Tiere, die Pflanzen und Tiere fressen, nennt man ___.', a: 'Allesfresser', w: 'Zum Beispiel Schwein, Dachs und Mensch.' },
      { f: 'Junge Wildschweine heißen ___.', a: ['Frischlinge', 'Frischling'], w: 'Sie sind längs gestreift.' },
    ],
  }, { erkennen: 20, sortieren: 26, passtNicht: 8, frage: 36, tippen: 10 });

  const ARM = [['armMaulwurf', 'Maulwurf', 'Kurze, kräftige Knochen und eine breite Grabhand: zum Graben.'], ['armFledermaus', 'Fledermaus', 'Sehr lange Fingerknochen spannen die Flughaut: zum Fliegen.'], ['armWal', 'Wal', 'Kurze Arm- und viele Fingerknochen in einer Flosse: zum Schwimmen.'], ['armPferd', 'Pferd', 'Lange Knochen und nur eine Zehe mit Huf: zum schnellen Laufen.'], ['armMensch', 'Mensch', 'Bewegliche Finger und ein Daumen, der den anderen Fingern gegenübersteht: zum Greifen.']];
  G.gliedmassen = baue('b5-gliedmassen', {
    h: 'In Grabhand, Flügel, Flosse und Laufbein stecken die gleichen Knochen: Oberarm (rot), Unterarm (blau), Hand (gelb). Nur ihre Form ist verschieden.',
    E: { f: 'Zu welchem Säugetier gehört diese Vordergliedmaße? (Oberarm rot, Unterarm blau, Hand gelb)', arten: ARM },
    S: { kats: ['Maulwurf', 'Fledermaus', 'Delfin', 'Pferd'], f: (x) => `Zu welchem Tier passt das? <b>${x}</b>`, h: 'Boden, Luft, Wasser, Steppe: Der Körper passt zum Lebensraum.',
      items: [['Grabhände wie Schaufeln', 0], ['walzenförmiger Körper, kurzes Fell ohne Strich', 0], ['frisst Regenwürmer und Insektenlarven', 0], ['Flughaut zwischen den Fingern', 1], ['findet Beute mit Ultraschall', 1], ['schläft kopfüber hängend', 1],
        ['Vorderbeine sind Flossen', 2], ['atmet durch ein Blasloch oben am Kopf', 2], ['waagerechte Schwanzflosse (Fluke)', 2], ['tritt mit einer einzigen Zehe auf', 3], ['Unpaarhufer', 3], ['Fluchttier mit langen Beinen', 3]] },
    F: [
      { f: 'Was haben die Grabhand des Maulwurfs, der Flügel der Fledermaus und die Flosse des Wals <b>gemeinsam</b>?', a: 'die gleichen Knochen in gleicher Reihenfolge', x: ['die gleiche Form', 'die gleiche Größe', 'gar nichts'], w: 'Oberarm, Unterarm, Handwurzel, Mittelhand, Finger: Das zeigt, dass alle Säugetiere verwandt sind.' },
      { f: 'Was spannt die <b>Flughaut</b> der Fledermaus auf?', a: 'die stark verlängerten Fingerknochen', x: ['Federn', 'die Rippen', 'der Schwanz allein'], w: 'Die Flughaut reicht von den Fingern über den Körper bis zu den Beinen.', svg: 'armFledermaus' },
      { f: 'Wie findet die Fledermaus im Dunkeln ihre Beute?', a: 'Sie stößt Ultraschall-Rufe aus und hört auf das Echo.', x: ['Sie riecht die Insekten.', 'Sie sieht im Dunkeln alles.', 'Sie tastet mit den Flügeln.'], w: 'Aus dem Echo erkennt sie, wo und wie groß die Beute ist. Wir können diese hohen Töne nicht hören.' },
      { f: 'Warum stört den Maulwurf sein Fell beim <b>Rückwärtskriechen</b> im Gang nicht?', a: 'Die Haare haben keine feste Richtung (keinen Strich).', x: ['Er hat kein Fell.', 'Er kriecht nie rückwärts.', 'Das Fell ist aus Stacheln.'], w: 'Sie legen sich nach vorn wie nach hinten.' },
      { f: 'Wie atmet ein Delfin?', a: 'Er taucht auf und atmet durch das Blasloch mit seinen Lungen.', x: ['mit Kiemen', 'durch die Haut', 'gar nicht'], w: 'Das Blasloch ist seine Nasenöffnung oben am Kopf.' },
      { f: 'Woran erkennst du schon am Schwanz, ob es ein Fisch oder ein Wal ist?', a: 'Die Schwanzflosse des Wals steht waagerecht, die des Fisches senkrecht.', x: ['Der Wal hat keinen Schwanz.', 'Der Fisch hat zwei Schwänze.', 'Es gibt keinen Unterschied.'], w: 'Der Wal schlägt auf und ab, der Fisch hin und her.' },
      { f: 'Was schützt Wale im kalten Wasser vor dem Auskühlen?', a: 'eine dicke Fettschicht unter der Haut', x: ['ein dichtes Fell', 'Schuppen', 'Federn'], w: 'Ein nasses Fell würde im Wasser kaum wärmen.' },
      { f: 'Ein Pferd tritt nur mit der Spitze <b>einer</b> Zehe auf. Was umgibt diese Zehe?', a: 'ein Huf aus Horn', x: ['eine Kralle', 'eine Schwimmhaut', 'ein Fingernagel aus Knochen'], w: 'Lange Beine und harte Hufe: gebaut für schnelles Laufen auf festem Boden.', svg: 'armPferd' },
      { f: 'Welches Säugetier kann als einziges <b>aktiv fliegen</b>?', a: 'die Fledermaus', x: ['das Eichhörnchen', 'der Maulwurf', 'der Igel'], w: 'Manche anderen Säugetiere können nur gleiten.' },
    ],
    T: [
      { f: 'Die Fledermaus findet ihre Beute mit ___.', a: ['Ultraschall', 'Echoortung', 'Echo'], w: 'Sie hört das Echo ihrer Rufe.' },
      { f: 'Die Vorderbeine des Maulwurfs sind ___.', a: ['Grabhände', 'Grabschaufeln', 'Grabhand'], w: 'Breit wie Schaufeln.' },
      { f: 'Das Atemloch der Wale oben am Kopf heißt ___.', a: 'Blasloch', w: 'Es ist die Nasenöffnung.' },
    ],
  }, { erkennen: 22, sortieren: 24, passtNicht: 8, frage: 36, tippen: 10 });

  G.lunge = baue('b5-lunge', {
    h: 'Die Luft strömt durch die Luftröhre und die Bronchien bis in die Lungenbläschen. Dort geht Sauerstoff ins Blut, Kohlenstoffdioxid kommt heraus.',
    O: [
      { t: 'Der Weg der Luft beim Einatmen: Bringe die Stationen in die richtige Reihenfolge.', items: ['Nase', 'Luftröhre', 'Bronchien', 'Lungenbläschen', 'Blut'], w: 'Nase → Luftröhre → Bronchien → Lungenbläschen → Blut.' },
    ],
    F: [
      { f: 'Was passiert in den <b>Lungenbläschen</b>?', a: 'Sauerstoff geht ins Blut, Kohlenstoffdioxid aus dem Blut in die Luft.', x: ['Die Nahrung wird verdaut.', 'Das Blut wird gepumpt.', 'Die Luft wird gewärmt.'], w: 'Dieser Austausch heißt Gasaustausch.' },
      { f: 'Warum besteht die Lunge aus so <b>vielen winzigen</b> Bläschen statt aus einem großen Sack?', a: 'Viele kleine Bläschen haben zusammen eine viel größere Oberfläche.', x: ['Damit die Lunge schwerer wird.', 'Damit weniger Luft hineinpasst.', 'Das hat keinen Grund.'], w: 'Je größer die Oberfläche, desto mehr Sauerstoff kann gleichzeitig ins Blut. Das gleiche Prinzip wie bei den Kiemenblättchen.' },
      { f: 'Welches Gas brauchen Tiere und Menschen aus der Luft?', a: 'Sauerstoff', x: ['Kohlenstoffdioxid', 'Stickstoff', 'Wasserdampf'], w: 'Ohne Sauerstoff kann der Körper keine Energie aus der Nahrung gewinnen.' },
      { f: 'Welches Gas atmen wir aus, das im Körper entstanden ist?', a: 'Kohlenstoffdioxid', x: ['Sauerstoff', 'Helium', 'reinen Stickstoff'], w: 'Es entsteht, wenn der Körper Nährstoffe „verbrennt“.' },
      { f: 'Warum brauchen Säugetiere und Vögel besonders leistungsfähige Lungen?', a: 'Sie sind gleichwarm und brauchen viel Energie.', x: ['Sie sind größer.', 'Sie leben länger.', 'Sie schlafen mehr.'], w: 'Den eigenen Körper warm zu halten kostet viel Energie, also viel Sauerstoff.' },
      { f: 'Wer transportiert den Sauerstoff von der Lunge zu den Muskeln?', a: 'das Blut', x: ['die Nerven', 'die Knochen', 'die Haut'], w: 'Das Herz pumpt das Blut durch den Körper.' },
      { f: 'Wie heißen die beiden großen Äste, in die sich die Luftröhre teilt?', a: 'Bronchien', x: ['Venen', 'Kiemen', 'Rippen'], w: 'Sie verzweigen sich immer weiter, bis zu den Lungenbläschen.' },
    ],
    T: [
      { f: 'Am Ende der feinsten Äste in der Lunge sitzen die ___.', a: ['Lungenbläschen', 'Lungenbläschen.'], w: 'Hier findet der Gasaustausch statt.' },
      { f: 'Beim Einatmen nimmt das Blut ___ auf.', a: 'Sauerstoff', w: 'Beim Ausatmen wird Kohlenstoffdioxid abgegeben.' },
    ],
    A: { w: ['In den Lungenbläschen geht Sauerstoff ins Blut.', 'Viele kleine Bläschen ergeben eine große Oberfläche.', 'Säugetiere atmen mit Lungen.'],
      f: ['Die Lunge pumpt das Blut durch den Körper.', 'Wir atmen Sauerstoff aus und Kohlenstoffdioxid ein.', 'Die Lunge ist ein einziger hohler Sack ohne Kammern.'] },
  }, { frage: 50, ordnen: 20, tippen: 12, aussage: 18 });

  G.saeugerSchutz = baue('b5-saeuger-schutz', {
    h: 'Wildtiere brauchen zusammenhängende Lebensräume, Nahrung und Ruhe. Manche Arten kehren zurück, wenn man sie schützt.',
    S: HILFT(['hilft den Wildtieren', 'schadet den Wildtieren'], [['Grünbrücke über die Autobahn', 0, 'Tiere können gefahrlos auf die andere Seite.'], ['Laubhaufen für den Igel', 0], ['Fledermauskasten', 0], ['Hecken und Feldränder erhalten', 0], ['Hund im Wald an der Leine führen', 0, 'So werden Rehe und brütende Vögel nicht gehetzt.'], ['Auwald am Fluss schützen', 0, 'Lebensraum für Biber und Fischotter.'],
      ['neue Straße mitten durch den Wald', 1], ['Mähroboter nachts laufen lassen', 1, 'Igel sind nachts unterwegs und werden verletzt.'], ['alte Dachböden und Höhlen verschließen', 1, 'Dort schlafen Fledermäuse.'], ['Gift gegen Mäuse und Insekten auslegen', 1], ['abseits der Wege durch den Wald laufen', 1], ['Flussufer befestigen', 1]], (x) => `Hilft es den Wildtieren oder schadet es? <b>${x}</b>`),
    F: [
      { f: 'Welches Tier fällt Bäume und baut Dämme an sächsischen Flüssen wie Elbe und Mulde?', a: 'der Biber', x: ['der Fischotter', 'der Dachs', 'das Wildschwein'], w: 'Er war fast ausgerottet und hat sich durch Schutz wieder ausgebreitet.' },
      { f: 'In welcher sächsischen Gegend gibt es besonders viele <b>Fischotter</b>?', a: 'in der Oberlausitzer Teichlandschaft', x: ['im Stadtzentrum von Leipzig', 'auf dem Fichtelberg', 'nirgends in Sachsen'], w: 'Die vielen Teiche bieten ihm Fische und ruhige Ufer.' },
      { f: 'Seit wann werden in Sachsen wieder <b>Wolfswelpen</b> geboren?', a: 'seit dem Jahr 2000', x: ['seit 1800', 'seit 1950', 'noch nie'], w: 'Das erste Rudel lebte in der Oberlausitz. Wölfe waren in Deutschland vorher ausgerottet.' },
      { f: 'Wozu dient eine <b>Grünbrücke</b>?', a: 'Wildtiere können darauf eine Autobahn überqueren.', x: ['Sie ist ein Spielplatz.', 'Dort wächst Gemüse.', 'Sie ist nur für Radfahrer.'], w: 'Straßen zerschneiden sonst die Lebensräume.' },
      { f: 'Warum ist <b>Jagd</b> in unseren Wäldern nötig, obwohl man Tiere schützen will?', a: 'Rehe und Wildschweine haben kaum natürliche Feinde und würden zu viele.', x: ['Weil Rehe gefährlich sind.', 'Weil der Wald den Jägern gehört.', 'Sie ist nicht geregelt.'], w: 'Zu viele Rehe fressen die jungen Bäume ab. Für die Jagd gelten strenge Regeln und Schonzeiten.' },
      { f: 'Wie kannst du einem <b>Igel</b> im Garten helfen?', a: 'einen Laub- und Reisighaufen liegen lassen', x: ['ihm Milch hinstellen', 'ihn ins Haus holen', 'den Garten betonieren'], w: 'Darin findet er Insekten und ein Winterquartier. Milch macht Igel krank.' },
      { f: 'Der <b>Feldhamster</b> ist bei uns fast verschwunden. Warum?', a: 'Auf den großen, schnell abgeernteten Feldern findet er kaum Nahrung und Deckung.', x: ['Er wurde von Mäusen vertrieben.', 'Es ist ihm zu kalt geworden.', 'Er lebt jetzt im Wald.'], w: 'Er steht auf der Roten Liste und ist vom Aussterben bedroht.' },
      { f: 'Alle heimischen <b>Fledermäuse</b> sind streng geschützt. Was brauchen sie besonders?', a: 'ungestörte Quartiere und viele Insekten', x: ['helle Straßenlampen', 'Futterhäuschen mit Körnern', 'Gewässer zum Schwimmen'], w: 'Sie schlafen in Baumhöhlen, Dachböden und Stollen.' },
    ],
    T: [
      { f: 'Über die Autobahn hilft den Wildtieren eine ___.', a: ['Grünbrücke', 'Wildbrücke'], w: 'Sie ist bepflanzt wie die Landschaft ringsum.' },
      { f: 'Das Nagetier, das Dämme baut, heißt ___.', a: 'Biber', w: 'In Sachsen lebt er wieder an Elbe und Mulde.' },
    ],
  }, { sortieren: 30, passtNicht: 8, frage: 50, tippen: 12 });

  G.tierhaltung = baue('b5-tierhaltung', {
    h: 'Artgerecht heißt: Das Tier kann so leben, wie es seiner Art entspricht. Genug Platz, passendes Futter, Beschäftigung und, bei geselligen Tieren, Artgenossen.',
    S: { kats: ['artgerecht', 'nicht artgerecht'], f: (x) => `Ist das artgerecht? <b>${x}</b>`, h: 'Wie lebt die Art in der Natur: allein oder in der Gruppe, am Tag oder in der Nacht, mit viel Bewegung?',
      items: [['zwei Meerschweinchen in einem großen Gehege mit Häuschen', 0], ['Hund: jeden Tag lange Spaziergänge und Spiel', 0], ['Kaninchen zu zweit mit Auslauf zum Hoppeln und Graben', 0], ['Wellensittiche im Schwarm mit täglichem Freiflug', 0], ['Hühner mit Auslauf zum Scharren und Sandbaden', 0], ['Katze mit Kratzbaum und Verstecken', 0],
        ['ein Meerschweinchen allein im kleinen Käfig', 1, 'Meerschweinchen sind gesellig und brauchen Artgenossen.'], ['Hund den ganzen Tag allein in der Wohnung', 1, 'Der Hund ist ein Rudeltier.'], ['Goldhamster am Tag zum Spielen wecken', 1, 'Er ist nachtaktiv und braucht am Tag Ruhe.'], ['Kaninchen und Meerschweinchen als einzige Partner zusammen', 1, 'Sie verstehen die „Sprache“ der anderen Art nicht.'], ['Wellensittich allein mit einem Spiegel', 1, 'Der Spiegel ersetzt keinen Partner.'], ['Fische in einer kleinen Glaskugel', 1]] },
    F: [
      { f: 'Was bedeutet <b>artgerecht</b>?', a: 'Das Tier kann so leben, wie es seiner Art entspricht.', x: ['Das Tier ist gut erzogen.', 'Das Tier sieht hübsch aus.', 'Das Tier ist teuer.'], w: 'Dazu muss man wissen, wie die Art in der Natur lebt.' },
      { f: 'Welches Gesetz schützt in Deutschland die Tiere?', a: 'das Tierschutzgesetz', x: ['das Grundgesetz der Tiere', 'die Hausordnung', 'das Jagdgesetz allein'], w: 'Wer ein Tier hält, muss es seiner Art entsprechend ernähren, pflegen und unterbringen.' },
      { f: 'Warum sollte man Meerschweinchen nie <b>einzeln</b> halten?', a: 'Sie leben in der Natur in Gruppen.', x: ['Sie frieren sonst.', 'Sie fressen sonst zu viel.', 'Sie werden sonst zu groß.'], w: 'Ein Mensch kann den Artgenossen nicht ersetzen.' },
      { f: 'Der <b>Goldhamster</b> ist nachtaktiv und ein Einzelgänger. Was folgt daraus?', a: 'Er braucht am Tag Ruhe und lebt allein.', x: ['Er braucht viele Hamster-Freunde.', 'Man sollte ihn tagsüber oft wecken.', 'Er braucht helles Licht in der Nacht.'], w: 'Für kleine Kinder, die tagsüber spielen wollen, ist er deshalb kein gutes Haustier.' },
      { f: 'Was muss man <b>vor</b> dem Kauf eines Haustiers bedenken?', a: 'Zeit, Platz, Kosten und wer sich im Urlaub kümmert', x: ['nur die Farbe des Fells', 'nur den Namen', 'gar nichts'], w: 'Ein Tier braucht jeden Tag Pflege, oft viele Jahre lang.' },
      { f: 'Ein Hund braucht täglich Auslauf und Beschäftigung. Warum?', a: 'Seine Vorfahren, die Wölfe, laufen jeden Tag weite Strecken.', x: ['Damit er müde wird und schläft.', 'Damit er nicht friert.', 'Das braucht er nicht.'], w: 'Die Bedürfnisse eines Haustiers kommen von seiner wilden Stammform.' },
      { f: 'Woran erkennt man im Zoo ein gutes Gehege?', a: 'Die Tiere haben Platz, Rückzugsorte und Beschäftigung.', x: ['Man sieht die Tiere immer ganz nah.', 'Es ist möglichst klein.', 'Der Boden ist aus glattem Beton.'], w: 'Ein Tier muss sich auch zurückziehen können.' },
    ],
    T: [
      { f: 'Eine Haltung, die zur Lebensweise der Art passt, nennt man ___.', a: ['artgerecht', 'artgerechte Haltung', 'tiergerecht'], w: 'Das verlangt das Tierschutzgesetz.' },
    ],
  }, { sortieren: 40, passtNicht: 6, frage: 46, tippen: 8 });

  G.skelett = baue('b5-mensch-skelett', {
    h: 'Das Skelett stützt den Körper, schützt die inneren Organe und macht mit den Muskeln Bewegung möglich. Der Mensch hat denselben Bauplan wie alle Säugetiere.',
    B: { svg: 'skelett', teile: D.teile.skelett, was: { 'Schädel': 'Er schützt das Gehirn.', 'Wirbelsäule': 'Sie trägt den Körper und ist doppelt S-förmig gebogen.', 'Brustkorb': 'Die Rippen schützen Herz und Lunge.', 'Becken': 'Es trägt die Bauchorgane und verbindet Wirbelsäule und Beine.', 'Oberarmknochen': 'Er reicht von der Schulter bis zum Ellenbogen.', 'Oberschenkelknochen': 'Der längste Knochen des Körpers.' } },
    S: { kats: ['schützt', 'stützt und trägt'], f: (x) => `Was ist die wichtigste Aufgabe? <b>${x}</b>`, h: 'Kapseln und Körbe schützen, Säulen und lange Knochen tragen.',
      items: [['Schädel (um das Gehirn)', 0], ['Brustkorb (um Herz und Lunge)', 0], ['Wirbelkanal (um das Rückenmark)', 0], ['Wirbelsäule', 1], ['Oberschenkelknochen', 1], ['Schienbein', 1]] },
    F: [
      { f: 'Welche <b>drei Aufgaben</b> hat das Skelett?', a: 'stützen, schützen, bewegen', x: ['verdauen, atmen, denken', 'wärmen, kühlen, hören', 'sehen, riechen, tasten'], w: 'Ohne Skelett würde der Körper zusammensacken.' },
      { f: 'Welche Form hat die Wirbelsäule des Menschen von der Seite?', a: 'ein doppeltes S', x: ['ein gerader Stab', 'ein Kreis', 'ein Zickzack'], w: 'So federt sie Stöße beim Gehen und Springen ab.' },
      { f: 'Was schützt der <b>Brustkorb</b>?', a: 'Herz und Lunge', x: ['das Gehirn', 'den Magen und den Darm', 'die Augen'], w: 'Er besteht aus den Rippen, dem Brustbein und einem Teil der Wirbelsäule.' },
      { f: 'Woraus besteht die Wirbelsäule?', a: 'aus vielen einzelnen Wirbeln mit Bandscheiben dazwischen', x: ['aus einem einzigen langen Knochen', 'aus Knorpel ohne Knochen', 'aus Muskeln'], w: 'Deshalb ist sie stabil und trotzdem beweglich.' },
      { f: 'Wie heißt die bewegliche Verbindung zwischen zwei Knochen?', a: 'Gelenk', x: ['Sehne', 'Muskel', 'Rippe'], w: 'Zum Beispiel Schulter-, Ellenbogen- und Kniegelenk.' },
      { f: 'Der Mensch tritt mit der ganzen Fußsohle auf. Er ist ein …', a: 'Sohlengänger', x: ['Zehengänger', 'Zehenspitzengänger', 'Paarhufer'], w: 'Hund und Katze sind Zehengänger, Rind und Pferd Zehenspitzengänger.' },
      { f: 'Was unterscheidet die Hand des Menschen von der Pfote eines Hundes?', a: 'Der Daumen kann den anderen Fingern gegenübergestellt werden: eine Greifhand.', x: ['Sie hat mehr Knochen als ein ganzer Hund.', 'Sie hat keine Knochen.', 'Sie hat Hufe.'], w: 'So können wir Werkzeuge halten und fein greifen.' },
      { f: 'Welche Merkmale machen den Menschen zu einem <b>Säugetier</b>?', a: 'Haare, Milch für das Baby, gleichwarm, Lungen', x: ['aufrechter Gang und Sprache', 'Kleidung und Schuhe', 'Federn und Schnabel'], w: 'Aufrechter Gang, Greifhand, großes Gehirn und Sprache sind die Besonderheiten des Menschen.' },
      { f: 'Der Armknochen des Menschen und das Vorderbein eines Hundes haben die gleichen Knochen. Was zeigt das?', a: 'Mensch und Hund haben den gleichen Bauplan: Sie sind verwandt.', x: ['Das ist Zufall.', 'Hunde stammen vom Menschen ab.', 'Menschen sind Hunde.'], w: 'Alle Säugetiere haben diesen Grundbauplan.' },
    ],
    T: [
      { f: 'Die bewegliche Verbindung zweier Knochen heißt ___.', a: 'Gelenk', w: 'Bänder halten es zusammen.' },
      { f: 'Herz und Lunge werden vom ___ geschützt.', a: ['Brustkorb', 'Brustkorb.'], w: 'Er besteht vor allem aus den Rippen.' },
      { f: 'Die Körperachse aus vielen Wirbeln heißt ___.', a: 'Wirbelsäule', w: 'Alle Wirbeltiere haben sie.' },
    ],
  }, { beschriften: 24, sortieren: 14, passtNicht: 0, frage: 46, tippen: 16 });

  G.menschFortpfl = baue('b5-mensch-fortpfl', {
    h: 'In der Pubertät wird der Körper erwachsen. Die Eierstöcke lassen Eizellen reifen, die Hoden bilden Spermienzellen. Verschmelzen eine Eizelle und eine Spermienzelle, kann ein Kind entstehen.',
    S: { kats: ['bei Mädchen', 'bei Jungen', 'bei beiden'], f: (x) => `Bei wem verändert sich das in der Pubertät? <b>${x}</b>`, h: 'Manche Veränderungen gibt es nur bei Mädchen oder nur bei Jungen, viele bei beiden.',
      items: [['Die Brust wächst.', 0], ['Die erste Regelblutung kommt.', 0], ['Die Hüften werden breiter.', 0], ['Der Stimmbruch: Die Stimme wird deutlich tiefer.', 1], ['Der Bart beginnt zu wachsen.', 1], ['Der erste Samenerguss kommt.', 1], ['Die Schultern werden breiter.', 1],
        ['Achselhaare und Schamhaare wachsen.', 2], ['Der Körper wächst schnell.', 2], ['Die Haut wird fettiger, Pickel können kommen.', 2], ['Die Gefühle fahren manchmal Achterbahn.', 2]] },
    O: [
      { t: 'Ein Kind entsteht: Bringe die Schritte in die richtige Reihenfolge.', items: ['Eine Eizelle und eine Spermienzelle verschmelzen (Befruchtung).', 'Die befruchtete Eizelle teilt sich und nistet sich in der Gebärmutter ein.', 'Der Embryo wächst, Organe entstehen.', 'Der Fetus wächst weiter und wird über die Nabelschnur versorgt.', 'Nach etwa neun Monaten wird das Kind geboren.'], n: 4, w: 'Befruchtung → Einnistung → Embryo → Fetus → Geburt.' },
    ],
    F: [
      { f: 'Wie heißt die Zeit, in der aus Kindern Erwachsene werden?', a: 'Pubertät', x: ['Metamorphose', 'Mauser', 'Winterruhe'], w: 'Sie beginnt bei jedem zu einer anderen Zeit, bei Mädchen meist etwas früher als bei Jungen. Beides ist normal.' },
      { f: 'Was löst die Veränderungen in der Pubertät aus?', a: 'Hormone: Botenstoffe des Körpers', x: ['das Wetter', 'zu viel Sport', 'das Essen'], w: 'Hormone gelangen mit dem Blut im ganzen Körper an ihr Ziel.' },
      { f: 'Wo reifen bei der Frau die <b>Eizellen</b>?', a: 'in den Eierstöcken', x: ['in der Gebärmutter', 'im Magen', 'in der Scheide'], w: 'Etwa einmal im Monat wird eine reife Eizelle frei.' },
      { f: 'Wo werden beim Mann die <b>Spermienzellen</b> gebildet?', a: 'in den Hoden', x: ['in der Blase', 'im Penis', 'im Bauchnabel'], w: 'Die Bildung beginnt in der Pubertät.' },
      { f: 'In welchem Organ wächst das Kind vor der Geburt heran?', a: 'in der Gebärmutter', x: ['im Magen', 'im Eierstock', 'in der Lunge'], w: 'Ihre Wand ist ein kräftiger Muskel, der mitwächst.' },
      { f: 'Was ist die <b>Regelblutung</b> (Menstruation)?', a: 'Die Schleimhaut der Gebärmutter wird mit etwas Blut abgestoßen, wenn keine Eizelle befruchtet wurde.', x: ['eine Verletzung', 'eine Krankheit', 'ein Zeichen für zu viel Sport'], w: 'Sie kommt etwa einmal im Monat und ist ein Zeichen, dass der Körper gesund arbeitet. Am Anfang ist sie oft unregelmäßig.' },
      { f: 'Jungen haben in der Pubertät manchmal nachts einen Samenerguss. Was bedeutet das?', a: 'Das ist normal: Die Hoden bilden jetzt Spermienzellen.', x: ['Das ist eine Krankheit.', 'Das ist gefährlich.', 'Das passiert nur wenigen.'], w: 'Man nennt das auch Pollution.' },
      { f: 'Was passiert bei der <b>Befruchtung</b>?', a: 'Eine Spermienzelle und eine Eizelle verschmelzen.', x: ['Das Kind wird geboren.', 'Die Regelblutung beginnt.', 'Zwei Eizellen verschmelzen.'], w: 'Aus der befruchteten Eizelle entwickelt sich das Kind.' },
      { f: 'Wie lange dauert eine <b>Schwangerschaft</b> ungefähr?', a: 'neun Monate', x: ['neun Tage', 'neun Wochen', 'zwei Jahre'], w: 'Das sind etwa 40 Wochen.' },
      { f: 'Wie wird das Kind im Körper der Mutter mit Nährstoffen und Sauerstoff versorgt?', a: 'über die Nabelschnur', x: ['Es isst und atmet selbst.', 'über die Fruchtblase', 'gar nicht'], w: 'Sie verbindet das Kind mit dem Mutterkuchen in der Gebärmutter. Der Bauchnabel erinnert daran.' },
      { f: 'Was schützt das Kind in der Gebärmutter vor Stößen?', a: 'das Fruchtwasser in der Fruchtblase', x: ['ein Panzer', 'die Nabelschnur', 'nichts'], w: 'Es schwimmt darin wie in einem Wasserkissen.' },
      { f: 'Wie nennt man das Kind in den ersten etwa acht Wochen im Mutterleib?', a: 'Embryo', x: ['Larve', 'Küken', 'Säugling'], w: 'Danach, bis zur Geburt, heißt es Fetus. Nach der Geburt ist es ein Säugling.' },
      { f: 'Jeder Körper entwickelt sich in der Pubertät in seinem eigenen Tempo. Was stimmt?', a: 'Früher oder später: Beides ist normal.', x: ['Wer später dran ist, ist krank.', 'Alle müssen gleichzeitig wachsen.', 'Nur die Größten entwickeln sich richtig.'], w: 'Wer Fragen oder Sorgen hat, kann mit den Eltern, einer Ärztin oder einem Arzt sprechen.' },
    ],
    T: [
      { f: 'Die Zeit, in der der Körper erwachsen wird, heißt ___.', a: 'Pubertät', w: 'Hormone steuern sie.' },
      { f: 'Das Kind wächst in der ___ der Mutter heran.', a: 'Gebärmutter', w: 'Dort ist es geschützt und wird versorgt.' },
      { f: 'Das Verschmelzen von Eizelle und Spermienzelle heißt ___.', a: 'Befruchtung', w: 'Damit beginnt ein neues Leben.' },
      { f: 'Das Kind ist mit der Mutter durch die ___ verbunden.', a: 'Nabelschnur', w: 'Durch sie kommen Nährstoffe und Sauerstoff.' },
    ],
  }, { sortieren: 24, passtNicht: 0, ordnen: 14, frage: 48, tippen: 14 });

  // =====================================================
  // Bereich 7: Wirbeltiere im Vergleich
  // =====================================================
  const KL = ['Fische', 'Lurche', 'Kriechtiere', 'Vögel', 'Säugetiere'];
  const MERK = [
    ['Haut mit Knochenschuppen und Schleim', 0], ['atmen ihr Leben lang mit Kiemen', 0], ['Schwimmblase', 0],
    ['feuchte, nackte Haut mit Schleimdrüsen', 1], ['Larven mit Kiemen, erwachsene Tiere mit Lungen', 1], ['Verwandlung (Metamorphose)', 1],
    ['trockene Haut mit Hornschuppen', 2], ['Eier mit pergamentartiger Schale an Land', 2], ['wechselwarm und nur Lungenatmung', 2],
    ['Federn', 3], ['Eier mit Kalkschale, die bebrütet werden', 3], ['Lungen mit Luftsäcken', 3],
    ['Fell aus Haaren', 4], ['säugen ihre Jungen mit Milch', 4], ['Junge werden vor der Geburt über eine Nabelschnur versorgt', 4]];
  const TIERE = [['Hecht', 0], ['Aal', 0], ['Hai', 0], ['Feuersalamander', 1], ['Erdkröte', 1], ['Teichmolch', 1], ['Laubfrosch', 1], ['Blindschleiche', 2], ['Kreuzotter', 2], ['Krokodil', 2], ['Sumpfschildkröte', 2],
    ['Pinguin', 3, 'Er fliegt nicht, hat aber Federn und legt Eier.'], ['Schleiereule', 3], ['Strauß', 3], ['Fledermaus', 4, 'Sie fliegt, hat aber Fell und säugt ihre Jungen.'], ['Delfin', 4, 'Er lebt im Wasser, atmet aber mit Lungen und säugt.'], ['Maulwurf', 4], ['Mensch', 4]];
  const raetsel = () => { const k = U.R(0, 4), m = U.shuffle(MERK.filter((x) => x[1] === k)).slice(0, 2).map((x) => x[0]), ch = KL.slice();
    return { prompt: `Welche Wirbeltierklasse ist gemeint?<br><b>${m[0]}</b><br><b>${m[1]}</b>`, choices: ch, correct: k, hint: 'Achte auf Haut, Atmung und Fortpflanzung.',
      solution: `<b>${KL[k]}</b><br>${m.join('; ')}.`, ex: { mode: 'faecher', art: 'raetsel', kats: KL, items: [[m[0], k], [m[1], k], ...U.shuffle(MERK.filter((x) => x[1] !== k)).slice(0, 2).map((x) => [x[0], x[1]])], merk: `Beide Merkmale passen zu: <b>${KL[k]}</b>` } }; };
  G.vergleich = baue('b5-vergleich', {
    h: 'Fische: Schuppen, Kiemen. Lurche: feuchte Haut, Verwandlung. Kriechtiere: Hornschuppen, Eier an Land. Vögel: Federn. Säugetiere: Fell und Milch.',
    S: { kats: KL, f: (x) => `Zu welcher Klasse der Wirbeltiere gehört das? <b>${x}</b>`, h: 'Nicht der Lebensraum entscheidet, sondern Haut, Atmung und Fortpflanzung.', items: TIERE.concat(MERK) },
    extra: { raetsel },
    F: [
      { f: 'Was haben <b>alle</b> Wirbeltiere gemeinsam?', a: 'ein Skelett aus Knochen mit einer Wirbelsäule', x: ['ein Fell', 'vier Beine', 'Lungen'], w: 'Daher der Name. Die Wirbelsäule ist die Achse des Körpers.' },
      { f: 'Welche beiden Klassen der Wirbeltiere sind <b>gleichwarm</b>?', a: 'Vögel und Säugetiere', x: ['Fische und Lurche', 'Lurche und Kriechtiere', 'Fische und Vögel'], w: 'Federn und Fell halten die Körperwärme.' },
      { f: 'Welche Klassen sind <b>wechselwarm</b>?', a: 'Fische, Lurche und Kriechtiere', x: ['Vögel und Säugetiere', 'nur die Fische', 'alle Wirbeltiere'], w: 'Ihre Körpertemperatur richtet sich nach der Umgebung.' },
      { f: 'Welche Klassen haben eine <b>äußere</b> Befruchtung?', a: 'Fische und die meisten Lurche', x: ['Vögel und Säugetiere', 'Kriechtiere und Vögel', 'alle Wirbeltiere'], w: 'Dafür brauchen sie das Wasser. Kriechtiere, Vögel und Säugetiere haben eine innere Befruchtung.' },
      { f: 'Warum ist die <b>innere Befruchtung</b> eine Anpassung an das Leben an Land?', a: 'Spermienzellen würden an der Luft sofort austrocknen.', x: ['Weil es an Land wärmer ist.', 'Weil es an Land dunkler ist.', 'Weil Landtiere größer sind.'], w: 'Im Körper des Weibchens sind Eizelle und Spermienzellen feucht und geschützt.' },
      { f: 'Welches Atmungsorgan passt zum Leben <b>im Wasser</b>?', a: 'Kiemen', x: ['Lungen', 'Luftsäcke', 'Lungenbläschen'], w: 'Kiemen nehmen den Sauerstoff auf, der im Wasser gelöst ist.' },
      { f: 'Kiemenblättchen und Lungenbläschen haben etwas gemeinsam. Was?', a: 'Sie bilden eine sehr große Oberfläche für den Gasaustausch.', x: ['Sie sind beide im Wasser.', 'Sie sind beide aus Knochen.', 'Sie pumpen Blut.'], w: 'Große Oberfläche: Viel Sauerstoff kann gleichzeitig ins Blut.' },
      { f: 'Bei welcher Klasse entwickeln sich die Jungen <b>im Körper der Mutter</b>?', a: 'bei den Säugetieren', x: ['bei den Vögeln', 'bei den Fischen', 'bei den Lurchen'], w: 'Dort sind sie am besten geschützt.' },
      { f: 'Von den Fischen zu den Säugetieren kümmern sich die Eltern immer mehr um ihre Jungen. Was ändert sich dabei an der Zahl der Nachkommen?', a: 'Es werden weniger.', x: ['Es werden mehr.', 'Sie bleibt gleich.', 'Es gibt gar keine mehr.'], w: 'Ein Karpfen legt Hunderttausende Eier, ein Reh bekommt ein bis zwei Kitze. Dafür überleben viel mehr von ihnen.' },
      { f: 'Welche Wirbeltierklasse hat die <b>meisten</b> Arten?', a: 'die Fische', x: ['die Säugetiere', 'die Lurche', 'die Kriechtiere'], w: 'Etwa die Hälfte aller Wirbeltierarten sind Fische.' },
    ],
    T: [
      { f: 'Alle Wirbeltiere haben eine ___.', a: 'Wirbelsäule', w: 'Sie besteht aus einzelnen Wirbeln.' },
      { f: 'Vögel und Säugetiere halten ihre Körpertemperatur gleich: Sie sind ___.', a: 'gleichwarm', w: 'Fische, Lurche und Kriechtiere sind wechselwarm.' },
    ],
  }, { sortieren: 30, passtNicht: 8, raetsel: 20, frage: 34, tippen: 8 });

  G.entwicklung = baue('b5-entwicklung', {
    h: 'Zuerst gab es nur Fische. Aus fischähnlichen Vorfahren entstanden Lurche, aus Lurchen Kriechtiere, aus Kriechtieren Vögel und Säugetiere.',
    O: [
      { t: 'In welcher Reihenfolge sind die Wirbeltierklassen entstanden? Beginne mit der ältesten.', items: ['Fische', 'Lurche', 'Kriechtiere', 'Säugetiere und Vögel'], w: 'Vom Wasser an Land: Fische → Lurche → Kriechtiere → Säugetiere und Vögel.' },
      { t: 'Der Weg vom Wasser an Land: Bringe die Schritte in die richtige Reihenfolge.', items: ['Alle Wirbeltiere leben im Wasser und atmen mit Kiemen.', 'Fischähnliche Tiere mit kräftigen Flossen und Lungen kriechen ans Ufer.', 'Lurche leben an Land, brauchen aber Wasser für ihre Eier.', 'Kriechtiere legen Eier mit Schale: Sie sind unabhängig vom Wasser.'], w: 'Schritt für Schritt wurden die Wirbeltiere unabhängiger vom Wasser.' },
    ],
    F: [
      { f: 'Was sind <b>Fossilien</b>?', a: 'Reste oder Abdrücke von Lebewesen aus früheren Zeiten, meist versteinert', x: ['lebende Tiere aus dem Zoo', 'seltene Edelsteine', 'alte Werkzeuge'], w: 'An Fossilien kann man ablesen, welche Lebewesen früher lebten.' },
      { f: 'Wie heißt die Wissenschaft von den Lebewesen vergangener Zeiten?', a: 'Paläontologie', x: ['Astronomie', 'Geografie', 'Chemie'], w: 'Paläontologen untersuchen Fossilien.' },
      { f: 'Welche Wirbeltierklasse ist die <b>älteste</b>?', a: 'die Fische', x: ['die Säugetiere', 'die Vögel', 'die Kriechtiere'], w: 'Fische gab es schon vor mehreren hundert Millionen Jahren, lange vor allen anderen Wirbeltieren.' },
      { f: 'Der <b>Urvogel</b> Archaeopteryx hatte Federn und Flügel, aber auch Zähne und einen langen Schwanz mit Wirbeln. Was zeigt das?', a: 'Vögel stammen von Kriechtieren ab.', x: ['Vögel stammen von Fischen ab.', 'Der Urvogel war ein Säugetier.', 'Es zeigt nichts.'], w: 'Er hat Merkmale von beiden Gruppen. Er lebte vor etwa 150 Millionen Jahren, gefunden wurde er in Bayern bei Solnhofen.' },
      { f: 'Wann starben die <b>Dinosaurier</b> aus?', a: 'vor etwa 66 Millionen Jahren', x: ['vor etwa 6000 Jahren', 'vor etwa 66.000 Jahren', 'vor etwa 6 Milliarden Jahren'], w: 'Lange bevor es Menschen gab. Die Vögel sind ihre lebenden Nachfahren.' },
      { f: 'Welche Tiere sind die nächsten lebenden Verwandten der Dinosaurier?', a: 'die Vögel', x: ['die Frösche', 'die Fische', 'die Fledermäuse'], w: 'Vögel stammen von kleinen Raubsauriern ab.' },
      { f: 'Welches Merkmal machte die <b>Kriechtiere</b> als erste Wirbeltiere ganz unabhängig vom Wasser?', a: 'Eier mit Schale und eine trockene Schuppenhaut', x: ['Kiemen', 'eine feuchte Haut', 'Flossen'], w: 'Lurche müssen zum Laichen noch ins Wasser.' },
      { f: 'Woran sieht man an heutigen Lurchen noch, dass ihre Vorfahren aus dem Wasser kamen?', a: 'Ihre Larven leben im Wasser und atmen mit Kiemen.', x: ['Sie haben Schuppen.', 'Sie haben Federn.', 'Sie können nicht schwimmen.'], w: 'Jede Kaulquappe wiederholt den Schritt vom Wasser an Land.' },
      { f: 'Welche Körperbedeckungen machen Vögel und Säugetiere <b>gleichwarm</b> und damit unabhängiger vom Wetter?', a: 'Federn und Fell', x: ['Schuppen und Schleim', 'Panzer und Platten', 'nackte Haut'], w: 'Sie halten die Körperwärme fest.' },
    ],
    T: [
      { f: 'Versteinerte Reste früherer Lebewesen heißen ___.', a: ['Fossilien', 'Fossil', 'Versteinerungen'], w: 'Sie sind die wichtigsten Zeugen der Erdgeschichte.' },
      { f: 'Der Urvogel heißt mit seinem Fachnamen ___.', a: 'Archaeopteryx', w: 'Das bedeutet „alte Feder“ oder „alter Flügel“.' },
    ],
    A: { w: ['Fische sind die ältesten Wirbeltiere.', 'Vögel stammen von Kriechtieren ab.', 'Fossilien verraten etwas über frühere Lebewesen.'],
      f: ['Säugetiere sind die ältesten Wirbeltiere.', 'Dinosaurier und Menschen lebten zur gleichen Zeit.', 'Der Urvogel hatte keine Federn.'] },
  }, { frage: 50, ordnen: 20, tippen: 12, aussage: 18 });

  G.winterWechsel = baue('b5-winter-wechsel', {
    h: 'Wechselwarme Tiere werden mit der Umgebung kalt. Unter etwa zehn Grad bewegen sie sich kaum noch. Den Winter überstehen sie in Kältestarre an einem frostsicheren Ort.',
    S: { kats: ['im Wasser am Gewässergrund', 'an Land in einem frostfreien Versteck'], f: (x) => `Wo überwintert dieses Tier? <b>${x}</b>`, h: 'Wichtig ist nur: Der Platz muss frostfrei sein.',
      items: [['Wasserfrosch', 0, 'Er liegt im Schlamm und atmet nur durch die Haut.'], ['Karpfen', 0, 'Er steht fast reglos am Grund, wo das Wasser nicht gefriert.'], ['Europäische Sumpfschildkröte', 0, 'Sie gräbt sich im Gewässergrund ein.'], ['Hecht', 0],
        ['Erdkröte', 1, 'In einem Erdloch.'], ['Feuersalamander', 1, 'In Erdhöhlen und Felsspalten.'], ['Ringelnatter', 1, 'Gern im Komposthaufen: Beim Verrotten entsteht Wärme.'], ['Zauneidechse', 1, 'In einer frostsicheren Erdhöhle.'], ['Kreuzotter', 1], ['Blindschleiche', 1]] },
    F: [
      { f: 'Was ist <b>Kältestarre</b>?', a: 'Der Körper ist so kalt wie die Umgebung, das Tier bewegt sich nicht mehr.', x: ['ein besonders tiefer Schlaf bei 37 Grad', 'eine Krankheit', 'das Fliegen in den Süden'], w: 'Herzschlag und Atmung sind sehr langsam. Das Tier kann nicht von selbst aufwachen.' },
      { f: 'Was „weckt“ ein Tier aus der Kältestarre?', a: 'nur steigende Temperaturen im Frühjahr', x: ['Hunger', 'ein Wecker im Körper', 'Lärm'], w: 'Das ist der große Unterschied zum Winterschlaf: Ein Winterschläfer kann von selbst aufwachen.' },
      { f: 'Was passiert, wenn das Winterquartier eines Frosches <b>durchfriert</b>?', a: 'Er erfriert.', x: ['Er wacht auf und läuft weg.', 'Nichts, Frost macht ihm nichts aus.', 'Er heizt sich selbst auf.'], w: 'Er kann seinen Körper nicht selbst wärmen. Deshalb muss der Platz frostsicher sein.' },
      { f: 'Warum frieren Teiche nicht bis zum Grund zu?', a: 'Das Wasser am Grund hat etwa vier Grad und bleibt flüssig.', x: ['Weil Fische das Wasser wärmen.', 'Weil dort die Sonne hinscheint.', 'Weil dort Salz ist.'], w: 'Wasser ist bei vier Grad am schwersten und sinkt nach unten. Das Eis schwimmt oben.' },
      { f: 'Warum überwintern Ringelnattern gern in <b>Komposthaufen</b>?', a: 'Beim Verrotten der Pflanzen entsteht Wärme.', x: ['Dort gibt es Futter.', 'Dort ist es hell.', 'Dort wohnen Menschen.'], w: 'So bleibt es im Inneren frostfrei.' },
      { f: 'Fressen Frösche und Eidechsen im Winter?', a: 'Nein, in der Kältestarre brauchen sie fast keine Energie.', x: ['Ja, jeden Tag.', 'Ja, einmal pro Woche.', 'Ja, aber nur Pflanzen.'], w: 'Sie zehren von Vorräten im Körper.' },
      { f: 'Welche Tiergruppen fallen bei uns im Winter in Kältestarre?', a: 'Lurche und Kriechtiere', x: ['Vögel und Säugetiere', 'nur die Vögel', 'alle Wirbeltiere'], w: 'Auch Fische werden träge. Vögel und Säugetiere sind gleichwarm und brauchen andere Wege.' },
    ],
    T: [
      { f: 'Wechselwarme Tiere überwintern in ___.', a: ['Kältestarre', 'Winterstarre'], w: 'Ihr Körper ist dabei so kalt wie die Umgebung.' },
    ],
    A: { w: ['In der Kältestarre ist der Körper so kalt wie die Umgebung.', 'Frösche brauchen ein frostsicheres Winterquartier.', 'Kriechtiere überwintern in Kältestarre.'],
      f: ['Frösche halten Winterschlaf und wachen auf, wenn sie Hunger haben.', 'Eidechsen fliegen im Winter in den Süden.', 'Wechselwarme Tiere wärmen sich im Winter selbst.'] },
  }, { sortieren: 24, passtNicht: 6, frage: 44, tippen: 8, aussage: 18 });

  const WINTER = { kats: ['Winterschlaf', 'Winterruhe', 'winteraktiv', 'Zugvogel'], f: (x) => `Wie kommt dieses Tier durch den Winter? <b>${x}</b>`, h: 'Winterschlaf: Körper kühlt stark ab. Winterruhe: schläft viel, bleibt warm, wacht oft auf. Winteraktiv: sucht weiter Futter. Zugvogel: fliegt fort.',
    items: [['Igel', 0], ['Fledermaus', 0], ['Siebenschläfer', 0], ['Murmeltier', 0], ['Haselmaus', 0], ['Eichhörnchen', 1], ['Dachs', 1], ['Braunbär', 1], ['Waschbär', 1],
      ['Reh', 2], ['Rotfuchs', 2], ['Wildschwein', 2], ['Feldhase', 2], ['Kohlmeise', 2], ['Weißstorch', 3], ['Rauchschwalbe', 3], ['Kuckuck', 3], ['Mauersegler', 3]] };
  G.winterGleich = baue('b5-winter-gleich', {
    h: WINTER.h,
    S: WINTER,
    F: [
      { f: 'Was passiert beim <b>Winterschlaf</b> des Igels?', a: 'Seine Körpertemperatur sinkt auf wenige Grad, Herz und Atmung werden sehr langsam.', x: ['Er schläft wie wir, nur länger.', 'Er friert ein.', 'Er wird wechselwarm für immer.'], w: 'So spart er Energie und kommt mit seinem Fettvorrat aus.' },
      { f: 'Was unterscheidet die <b>Winterruhe</b> des Eichhörnchens vom Winterschlaf?', a: 'Die Körpertemperatur bleibt hoch, und es wacht oft auf, um zu fressen.', x: ['Es gibt keinen Unterschied.', 'Bei der Winterruhe erstarrt das Tier.', 'Winterruhe dauert nur eine Nacht.'], w: 'An milden Tagen holt es sich seine versteckten Vorräte.' },
      { f: 'Warum fressen sich Igel und Murmeltiere im Herbst eine dicke <b>Fettschicht</b> an?', a: 'Sie ist der Energievorrat für den Winterschlaf.', x: ['Damit sie besser rollen.', 'Damit sie nicht gefressen werden.', 'Weil das Futter im Herbst schlecht wird.'], w: 'Im Winterschlaf fressen sie nichts.' },
      { f: 'Warum darf man einen Igel im Winterschlaf <b>nicht stören</b>?', a: 'Das Aufwachen kostet viel Energie aus dem Fettvorrat.', x: ['Er beißt dann.', 'Er läuft dann weg und kommt nie wieder.', 'Er bekommt dann Schnupfen.'], w: 'Wacht er zu oft auf, reicht der Vorrat nicht bis zum Frühjahr.' },
      { f: 'Was schützt winteraktive Tiere wie Reh und Fuchs vor der Kälte?', a: 'ein dichtes Winterfell', x: ['eine Kältestarre', 'ein Nest aus Federn', 'nichts'], w: 'Im Herbst wachsen dichtere und längere Haare. Dazu kommt eine Fettschicht.' },
      { f: 'Warum fliegen Schwalben im Herbst nach Afrika?', a: 'Sie finden im Winter bei uns keine Insekten.', x: ['Es ist ihnen zu dunkel.', 'Sie haben Angst vor Schnee.', 'Sie wollen andere Vögel besuchen.'], w: 'Nicht die Kälte, sondern der Futtermangel ist der Grund. Körnerfresser wie Meisen und Sperlinge können bleiben.' },
      { f: 'Wie hat man herausgefunden, wohin Zugvögel fliegen?', a: 'Man hat Vögel mit Ringen und später mit kleinen Sendern markiert.', x: ['Man hat sie gefragt.', 'Man ist hinterhergelaufen.', 'Man hat geraten.'], w: 'Auf dem Ring steht eine Nummer. Wird der Vogel anderswo gefunden, kennt man seinen Weg.' },
      { f: 'Winterschlaf und Kältestarre: Was ist der wichtigste Unterschied?', a: 'Ein Winterschläfer kann sich selbst aufwärmen und aufwachen, ein Tier in Kältestarre nicht.', x: ['Es gibt keinen.', 'Kältestarre gibt es nur bei Säugetieren.', 'Winterschlaf gibt es nur bei Fröschen.'], w: 'Winterschläfer sind gleichwarm, sie stellen ihre „Heizung“ nur herunter.' },
      { f: 'Wie kannst du Standvögeln im Winter helfen?', a: 'mit einer sauberen Futterstelle und Sträuchern mit Beeren', x: ['mit Brot und Salz', 'mit warmem Wasser im Nest', 'gar nicht'], w: 'Brot und gesalzene Reste schaden Vögeln.' },
    ],
    T: [
      { f: 'Der Igel hält im Winter ___.', a: 'Winterschlaf', w: 'Seine Körpertemperatur sinkt dabei auf wenige Grad.' },
      { f: 'Das Eichhörnchen hält im Winter ___.', a: 'Winterruhe', w: 'Es wacht oft auf und frisst von seinen Vorräten.' },
      { f: 'Vögel, die im Herbst fortfliegen, sind ___.', a: ['Zugvögel', 'Zugvogel'], w: 'Zum Beispiel Storch, Schwalbe und Kuckuck.' },
    ],
  }, { sortieren: 34, passtNicht: 8, frage: 46, tippen: 12 });

  // =====================================================
  // Lernbereiche Klasse 5 = Kapitel von LINDER Biologie 5 (Themenplan: faecher/bio/themenplan.md)
  // =====================================================
  D.grades = D.grades || {};
  D.grades[5] = {
    lbs: [
      { id: 'b5-leben', nr: 1, title: 'Merkmale des Lebens', topics: [
        { id: 'b5-biologie', title: 'Biologie: eine Naturwissenschaft', icon: '🔬', gen: G.biologie },
        { id: 'b5-kennzeichen', title: 'Kennzeichen von Lebewesen', icon: '🌱', gen: G.kennzeichen },
      ] },
      { id: 'b5-fische', nr: 2, title: 'Fische in ihren Lebensräumen', topics: [
        { id: 'b5-fisch-bau', title: 'Fische: ein Leben im Wasser', icon: '🐟', gen: G.fischBau },
        { id: 'b5-fisch-kiemen', title: 'Fische atmen mit Kiemen', icon: '🫧', gen: G.fischKiemen },
        { id: 'b5-fisch-gewaesser', title: 'Fische in verschiedenen Gewässern', icon: '🌊', gen: G.fischGewaesser },
        { id: 'b5-fisch-fortpfl', title: 'Fortpflanzung bei Fischen', icon: '🥚', gen: G.fischFortpfl },
        { id: 'b5-fisch-nahrung', title: 'Nahrungsketten im See', icon: '🔗', gen: G.fischNahrung },
        { id: 'b5-fisch-schutz', title: 'Schutz von Fischbeständen', icon: '🛟', gen: G.fischSchutz },
      ] },
      { id: 'b5-lurche', nr: 3, title: 'Lurche in ihren Lebensräumen', topics: [
        { id: 'b5-lurch-bau', title: 'Der Frosch: Körperbau und Bewegung', icon: '🐸', gen: G.lurchBau },
        { id: 'b5-lurch-beute', title: 'Sinne und Beutefang', icon: '👅', gen: G.lurchBeute },
        { id: 'b5-lurch-haut', title: 'Haut und Atmung', icon: '💧', gen: G.lurchHaut },
        { id: 'b5-lurch-arten', title: 'Frösche, Kröten und Unken erkennen', icon: '🔎', gen: G.lurchArten },
        { id: 'b5-lurch-bestimmen', title: 'Tiere bestimmen', icon: '🧭', gen: G.lurchBestimmen },
        { id: 'b5-lurch-entw', title: 'Vom Laich zum Frosch', icon: '🔄', gen: G.lurchEntw },
        { id: 'b5-lurch-schwanz', title: 'Die Schwanzlurche', icon: '🦎', gen: G.lurchSchwanz },
        { id: 'b5-lurch-schutz', title: 'Lurche sind gefährdet', icon: '⚠', gen: G.lurchSchutz },
      ] },
      { id: 'b5-kriechtiere', nr: 4, title: 'Kriechtiere in ihren Lebensräumen', topics: [
        { id: 'b5-kt-vielfalt', title: 'Die Vielfalt der Kriechtiere', icon: '🐊', gen: G.ktVielfalt },
        { id: 'b5-kt-merkmale', title: 'Merkmale: Lurch oder Kriechtier?', icon: '🧱', gen: G.ktMerkmale },
        { id: 'b5-kt-eidechse', title: 'Heimische Eidechsen', icon: '🦎', gen: G.ktEidechse },
        { id: 'b5-kt-schlange', title: 'Heimische Schlangen', icon: '🐍', gen: G.ktSchlange },
        { id: 'b5-kt-fortpfl', title: 'Fortpflanzung: Eier an Land', icon: '🥚', gen: G.ktFortpfl },
        { id: 'b5-kt-schutz', title: 'Kriechtiere brauchen Schutz', icon: '🛡', gen: G.ktSchutz },
      ] },
      { id: 'b5-voegel', nr: 5, title: 'Vögel in ihren Lebensräumen', topics: [
        { id: 'b5-vogel-vielfalt', title: 'Die Vielfalt der Vögel', icon: '🐦', gen: G.vogelVielfalt },
        { id: 'b5-vogel-flugbau', title: 'An das Fliegen angepasst', icon: '🦴', gen: G.vogelFlugbau },
        { id: 'b5-vogel-feder', title: 'Federn', icon: '🪶', gen: G.vogelFeder },
        { id: 'b5-vogel-flug', title: 'Wie Vögel fliegen', icon: '🕊', gen: G.vogelFlug },
        { id: 'b5-vogel-schnabel', title: 'Schnabel und Füße', icon: '🦆', gen: G.vogelSchnabel },
        { id: 'b5-vogel-vier', title: 'Ente, Bussard, Eule, Specht', icon: '🦉', gen: G.vogelVier },
        { id: 'b5-vogel-ei', title: 'Vom Ei zum Küken', icon: '🐣', gen: G.vogelEi },
        { id: 'b5-vogel-nest', title: 'Nesthocker und Nestflüchter', icon: '🪹', gen: G.vogelNest },
        { id: 'b5-vogel-amsel', title: 'Verhalten der Amsel', icon: '🎵', gen: G.vogelAmsel },
        { id: 'b5-vogel-schutz', title: 'Vögel schützen', icon: '🏠', gen: G.vogelSchutz },
      ] },
      { id: 'b5-saeuger', nr: 6, title: 'Säugetiere in ihren Lebensräumen', topics: [
        { id: 'b5-saeuger-vielfalt', title: 'Wildtiere und Haustiere', icon: '🦌', gen: G.saeugerVielfalt },
        { id: 'b5-saeuger-merkmale', title: 'Merkmale von Säugetieren', icon: '🍼', gen: G.saeugerMerkmale },
        { id: 'b5-hund', title: 'Der Hund', icon: '🐕', gen: G.hund },
        { id: 'b5-katze', title: 'Die Katze: Schleichjäger', icon: '🐈', gen: G.katze },
        { id: 'b5-verstaendigung', title: 'Tiere verständigen sich', icon: '📡', gen: G.verstaendigung },
        { id: 'b5-rind', title: 'Das Rind: Pflanzenfresser', icon: '🐄', gen: G.rind },
        { id: 'b5-schwein', title: 'Das Schwein und die Gebisse', icon: '🦷', gen: G.schwein },
        { id: 'b5-gliedmassen', title: 'Maulwurf, Fledermaus, Wal, Pferd', icon: '🦇', gen: G.gliedmassen },
        { id: 'b5-lunge', title: 'Die Lunge', icon: '🫁', gen: G.lunge },
        { id: 'b5-saeuger-schutz', title: 'Schutz heimischer Säugetiere', icon: '🐺', gen: G.saeugerSchutz },
        { id: 'b5-tierhaltung', title: 'Artgerechte Tierhaltung', icon: '🐹', gen: G.tierhaltung },
        { id: 'b5-mensch-skelett', title: 'Der Mensch: Skelett und Bauplan', icon: '💀', gen: G.skelett },
        { id: 'b5-mensch-fortpfl', title: 'Pubertät und Fortpflanzung des Menschen', icon: '👶', gen: G.menschFortpfl },
      ] },
      { id: 'b5-system', nr: 7, title: 'Wirbeltiere im Vergleich', topics: [
        { id: 'b5-vergleich', title: 'Die fünf Klassen im Vergleich', icon: '📊', gen: G.vergleich },
        { id: 'b5-entwicklung', title: 'Entwicklung der Wirbeltiere', icon: '🦕', gen: G.entwicklung },
        { id: 'b5-winter-wechsel', title: 'Wechselwarme Tiere im Winter', icon: '❄', gen: G.winterWechsel },
        { id: 'b5-winter-gleich', title: 'Gleichwarme Tiere im Winter', icon: '🦔', gen: G.winterGleich },
      ] },
    ],
  };
})();
