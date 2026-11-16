/* TecDax – Klasse 5/6, Bereiche 6 bis 8: Werkstoffe, Werkzeuge, Fertigen · Umwelt · Wahlthemen
 * (Lehrplan Technik/Computer LB 3 „Fertigen eines technischen Objektes“ und Wahlbereiche 1, 3, 4, 5).
 * Am Ende: die Themenliste (Bereiche und Reihenfolge wie im Lehrplan; es gibt kein Schulbuch).
 * Texte selbst geschrieben, Fakten mit Quellen in faecher/technik/fakten.md.
 */
(function () {
  const D = window.TecDax, U = D.util, G = D.gen;
  const { baue, pick, shuffle, R } = U;

  // =====================================================
  // Bereich 6: Werkstoffe, Werkzeuge, Fertigen
  // =====================================================
  G.werkstoffe = baue('tc5-werkstoffe', {
    h: 'In der Werkstatt gibt es vier Werkstoffgruppen: Holz, Metall, Kunststoff und Textil (Stoff). Jede hat eigene Eigenschaften.',
    F: [
      { f: 'Woraus wird der meiste <b>Kunststoff</b> hergestellt?', a: 'aus Erdöl', x: ['aus Holz', 'aus Sand', 'aus Wolle'], w: 'Erdöl wächst nicht nach. Auch darum soll man Kunststoff sparsam verwenden.' },
      { f: 'Welcher Werkstoff <b>wächst nach</b>?', a: 'Holz', x: ['Stahl', 'Acrylglas', 'Aluminium'], w: 'Wenn man so viele Bäume pflanzt, wie man fällt, geht er nie aus.' },
      { f: 'Welcher Werkstoff <b>leitet Wärme und Strom</b> besonders gut?', a: 'Metall', x: ['Holz', 'Kunststoff', 'Filz'], w: 'Darum sind Kabel innen aus Kupfer und außen aus Kunststoff.' },
      { f: 'Worauf musst du bei <b>Holz</b> achten?', a: 'auf die Faserrichtung', x: ['auf die Temperatur', 'auf die Magnetkraft', 'auf das Gewicht der Späne'], w: 'Längs zur Faser spaltet Holz leicht, quer dazu bricht es schwerer.' },
      { f: 'Was passiert mit <b>Acrylglas</b>, wenn man es erwärmt?', a: 'Es wird weich.', x: ['Es wird hart wie Stahl.', 'Es löst sich in Wasser auf.', 'Es wird magnetisch.'], w: 'Kunststoffe, die beim Erwärmen weich werden, heißen Thermoplaste.' },
      { f: 'Woraus ist <b>Baumwolle</b>?', a: 'aus einer Pflanze', x: ['aus Erdöl', 'aus Schafhaar', 'aus Metall'], w: 'Wolle kommt vom Schaf, Polyester aus Erdöl.' },
      { f: 'Bei welcher Temperatur etwa schmilzt <b>Zinn</b>?', a: 'bei etwa 232 °C', x: ['bei etwa 50 °C', 'bei etwa 1 500 °C', 'bei etwa 0 °C'], w: 'Weil das für ein Metall wenig ist, kann man Zinnfiguren in der Schule gießen.' },
      { f: 'Was ist <b>Sperrholz</b>?', a: 'verleimte dünne Holzschichten', x: ['verbotenes Holz', 'Holz aus Kunststoff', 'ein besonders weiches Holz'], w: 'Durch das kreuzweise Verleimen verzieht es sich kaum.' },
    ],
    S: { kats: ['Holz', 'Metall', 'Kunststoff', 'Textil'], f: (b) => `<b>${b}</b>: Zu welcher Werkstoffgruppe gehört das?`, h: 'Wächst es (Holz), glänzt und leitet es (Metall), kommt es meist aus Erdöl (Kunststoff) oder ist es ein Stoff aus Fasern (Textil)?',
      items: [['Kiefer', 0], ['Buche', 0], ['Sperrholz', 0], ['Spanplatte', 0], ['Stahl', 1], ['Aluminium', 1], ['Kupfer', 1], ['Zinn', 1], ['Messing', 1], ['Acrylglas', 2], ['PET (Getränkeflaschen)', 2], ['Styropor', 2], ['Baumwolle', 3], ['Wolle', 3], ['Filz', 3], ['Jeansstoff', 3]] },
  });

  const VERF = ['Urformen', 'Umformen', 'Trennen', 'Fügen', 'Beschichten', 'Stoffeigenschaft ändern'];
  D.VERF = VERF;
  G.din8580 = baue('tc5-din8580', {
    h: 'Sechs Hauptgruppen: Urformen (aus Flüssigem wird Festes), Umformen (biegen), Trennen (sägen, bohren), Fügen (verbinden), Beschichten (lackieren), Stoffeigenschaft ändern (härten).',
    F: [
      { f: 'Was passiert beim <b>Urformen</b>?', a: 'Aus Flüssigem wird Festes.', x: ['Ein Teil wird gebogen.', 'Zwei Teile werden verbunden.', 'Material wird abgetrennt.'], w: 'Aus Flüssigem wird ein fester Körper. Beispiele: Gießen, 3D-Druck, Kerzen gießen.' },
      { f: 'Was passiert beim <b>Umformen</b>?', a: 'Nur die Form ändert sich.', x: ['Material wird weggeschnitten.', 'Teile werden zusammengeklebt.', 'Eine Schicht wird aufgetragen.'], w: 'Beispiele: Biegen, Abkanten, Schmieden.' },
      { f: 'Was passiert beim <b>Trennen</b>?', a: 'Material wird abgetrennt.', x: ['Material wird gegossen.', 'Eine Farbe wird aufgetragen.', 'Teile werden verschraubt.'], w: 'Beispiele: Sägen, Bohren, Feilen, Schneiden.' },
      { f: 'Was passiert beim <b>Fügen</b>?', a: 'Teile werden verbunden.', x: ['Ein Teil wird zerlegt.', 'Ein Teil wird gehärtet.', 'Ein Teil wird geschmolzen.'], w: 'Beispiele: Kleben, Schrauben, Nähen, Löten, Nageln.' },
      { f: 'Was passiert beim <b>Beschichten</b>?', a: 'Eine Schicht wird aufgetragen.', x: ['Das Werkstück wird gebogen.', 'Das Werkstück wird halbiert.', 'Das Werkstück wird gegossen.'], w: 'Beispiele: Lackieren, Anstreichen, Verzinken.' },
      { f: 'Welche Norm teilt die Fertigungsverfahren in sechs Hauptgruppen ein?', a: 'DIN 8580', x: ['DIN A4', 'ISO 9001', 'DIN 1'], w: 'DIN steht für Deutsches Institut für Normung.' },
      { f: 'Zu welcher Hauptgruppe gehört der <b>3D-Druck</b>?', a: 'Urformen', x: ['Trennen', 'Fügen', 'Beschichten'], w: 'Der Drucker baut aus geschmolzenem Kunststoff Schicht für Schicht einen festen Körper.' },
    ],
    S: { kats: VERF.slice(0, 5), f: (b) => `<b>${b}</b>: Zu welcher Hauptgruppe gehört das?`, h: 'Neu aus Flüssigem? Form ändern? Etwas weg? Verbinden? Schicht drauf? Innen ändern?',
      items: [['Zinnfigur gießen', 0], ['Kerze gießen', 0], ['3D-Druck', 0], ['Acrylglas abkanten', 1], ['Draht biegen', 1], ['Schmieden', 1], ['Sägen', 2], ['Bohren', 2], ['Feilen', 2], ['Schneiden mit der Schere', 2], ['Kleben', 3], ['Schrauben', 3], ['Nähen', 3], ['Löten', 3], ['Lackieren', 4], ['Anstreichen', 4], ['Verzinken', 4]] },
    O: [{ t: 'Ordne die Hauptgruppen so, wie sie in der Norm DIN 8580 nummeriert sind.', items: VERF, n: 4, w: '1 Urformen, 2 Umformen, 3 Trennen, 4 Fügen, 5 Beschichten, 6 Stoffeigenschaft ändern.' }],
  }, { sortieren: 34 });

  G.urformen = baue('tc5-urformen', {
    h: 'Gießen ist Urformen: Flüssiges Material fließt in eine Form und wird dort fest. Beim Zinngießen: Schutzbrille, kein Wasser in der Nähe, nur mit Lehrkraft.',
    F: [
      { f: 'Wie heißt eine dauerhafte Gießform aus Metall, die man immer wieder benutzt?', a: 'Kokille', x: ['Kerze', 'Sandform', 'Schablone'], w: 'Eine Sandform dagegen wird beim Herausholen des Teils zerstört (verlorene Form).' },
      { f: 'Warum darf beim Zinngießen <b>kein Wasser</b> in die Nähe?', a: 'Wasser verdampft schlagartig.', x: ['Weil Zinn sonst rostet.', 'Weil Wasser das Zinn härter macht.', 'Weil das Zinn sonst kalt wird.'], w: 'Dabei spritzt heißes Zinn heraus. Darum muss auch die Form ganz trocken sein.' },
      { f: 'Was ist der <b>Gussgrat</b>?', a: 'ein dünner, überstehender Rand', x: ['eine besonders schöne Stelle', 'die Gießkelle', 'ein Werkzeug zum Schmelzen'], w: 'Man feilt ihn nach dem Gießen ab.' },
      { f: 'Welche Dinge entstehen durch <b>Gießen</b>?', a: 'Zinnfiguren und Kerzen', x: ['Pullover und Socken', 'Bretter und Latten', 'gebogene Blechwinkel'], w: 'Auch Seife, Schokoladenfiguren und viele Motorteile werden gegossen.' },
      { f: 'Wie werden viele Kunststoffteile wie Spielzeugsteine hergestellt?', a: 'durch Spritzgießen', x: ['durch Schnitzen', 'durch Weben', 'durch Feilen'], w: 'So entstehen Millionen gleiche Teile, ganz genau.' },
      { f: 'Was gehört beim Zinngießen zur <b>Schutzausrüstung</b>?', a: 'Schutzbrille und feste Schuhe', x: ['Badelatschen', 'kurze Hose', 'nichts, Zinn ist harmlos'], w: 'Flüssiges Zinn ist über 230 °C heiß.' },
    ],
    O: [{ t: 'Bring das Gießen einer <b>Zinnfigur</b> in die richtige Reihenfolge.', items: ['Form zusammenklemmen', 'Zinn schmelzen', 'flüssiges Zinn in die Form gießen', 'abkühlen lassen', 'Form öffnen, Figur herausnehmen', 'Gussgrat abfeilen'], n: 5, w: 'Form schließen, schmelzen, gießen, abkühlen, entformen, entgraten.' }],
    T: [{ f: 'Eine dauerhafte Gießform aus Metall heißt ___.', a: 'Kokille', w: 'Aus dem Französischen: Muschelschale.' }],
  });

  G.umformen = baue('tc5-umformen', {
    h: 'Umformen ändert die Form, ohne Material wegzunehmen. Acrylglas wird entlang der Biegelinie erwärmt, dann abgekantet und gehalten, bis es abgekühlt ist.',
    F: [
      { f: 'Wie biegt man <b>Acrylglas</b> zu Schutzbacken?', a: 'erwärmen, dann biegen', x: ['kalt mit dem Hammer schlagen', 'in Wasser einweichen', 'mit der Säge einschneiden'], w: 'Entlang der Biegelinie erwärmen, abkanten und halten, bis es abgekühlt ist. Kalt würde es brechen.' },
      { f: 'Wozu dienen <b>Schutzbacken</b> am Schraubstock?', a: 'Sie schützen das Werkstück.', x: ['Sie machen den Schraubstock schwerer.', 'Sie wärmen das Werkstück.', 'Sie ersetzen die Schraubzwinge.'], w: 'Die Backen des Schraubstocks haben Rillen aus Stahl.' },
      { f: 'Was gehört zum <b>Umformen</b>?', a: 'Biegen, Abkanten, Schmieden', x: ['Sägen, Bohren, Feilen', 'Kleben, Nähen, Schrauben', 'Gießen, 3D-Druck'], w: 'Bei allen ändert sich die Form, die Masse bleibt gleich.' },
      { f: 'Warum wird ein <b>Schmied</b> das Eisen vorher glühend heiß?', a: 'Heißes Metall ist formbarer.', x: ['damit es schöner leuchtet', 'damit es leichter wird', 'damit es nicht rostet'], w: 'Das heißt Warmumformen.' },
      { f: 'Was bleibt beim Umformen <b>gleich</b>?', a: 'die Masse', x: ['die Form', 'die Länge', 'der Winkel'], w: 'Es kommt nichts weg und nichts dazu.' },
    ],
    S: { kats: ['Umformen', 'kein Umformen'], f: (b) => `<b>${b}</b>: Umformen oder nicht?`, h: 'Ändert sich nur die Form, ohne dass etwas wegkommt oder dazukommt?',
      items: [['Acrylglas abkanten', 0], ['Draht zu einem Haken biegen', 0], ['Hufeisen schmieden', 0], ['Blech zu einer Dose tiefziehen', 0], ['Brett sägen', 1], ['Loch bohren', 1], ['Kerze gießen', 1], ['Teile kleben', 1]] },
  });

  G.trennen = baue('tc5-trennen', {
    h: 'Trennen nimmt Material weg: sägen, bohren, feilen, schleifen, schneiden. Die Laubsäge sägt auf Zug, die Zähne zeigen zum Griff. Die Feile arbeitet beim Vorschieben.',
    F: [
      { f: 'Wie spannt man das <b>Laubsägeblatt</b> ein?', a: 'Zähne zeigen zum Griff.', x: ['Die Zähne zeigen nach oben.', 'Die Zähne zeigen zur Seite.', 'Ganz egal.'], w: 'Die Laubsäge schneidet beim Ziehen nach unten.' },
      { f: 'Wann arbeitet eine <b>Feile</b>?', a: 'beim Vorschieben (Stoß)', x: ['beim Zurückziehen', 'nur beim Drehen', 'gar nicht, sie poliert nur'], w: 'Beim Zurückziehen hebt man sie leicht an.' },
      { f: 'Was bedeutet eine <b>große Zahl</b> auf Schleifpapier, zum Beispiel 240?', a: 'feines Schleifpapier', x: ['grobes Schleifpapier', 'besonders großes Blatt', 'Schleifpapier für Metall'], w: 'Man beginnt grob (zum Beispiel 80) und endet fein (zum Beispiel 240).' },
      { f: 'Womit sägt man in der Schule <b>Kurven</b> in dünnes Holz?', a: 'mit der Laubsäge', x: ['mit dem Fuchsschwanz', 'mit der Feile', 'mit dem Hammer'], w: 'Ihr schmales Blatt kann um Kurven sägen.' },
      { f: 'Was entsteht fast immer beim Sägen, Bohren und Feilen?', a: 'Späne', x: ['Funken', 'Kleber', 'Farbe'], w: 'Darum heißen diese Verfahren auch spanende Verfahren.' },
      { f: 'Warum muss das Werkstück beim Sägen und Bohren <b>eingespannt</b> sein?', a: 'damit es nicht verrutscht', x: ['damit es schneller fertig wird', 'damit es wärmer wird', 'das ist nicht nötig'], w: 'Mit Schraubzwinge oder Schraubstock hast du beide Hände frei.' },
    ],
    E: { f: 'Welches Werkzeug oder welche Maschine ist das?', arten: [['laubsaege', 'Laubsäge', 'Sägt Kurven in dünnes Holz.'], ['feile', 'Feile', 'Glättet Kanten und nimmt wenig Material ab.'], ['dekupiersaege', 'Dekupiersäge', 'Elektrische Laubsäge für Kurven.'], ['tischbohrmaschine', 'Tischbohrmaschine', 'Bohrt genaue, senkrechte Löcher.']] },
    S: { kats: ['Laubsäge', 'Feile', 'Bohrer', 'Schleifpapier'], f: (b) => `<b>${b}</b>: Welches Werkzeug brauchst du?`, h: 'Kurven sägen, Kanten glätten, Löcher machen oder Flächen glatt machen?',
      items: [['Eine Herzform aus Sperrholz aussägen', 0], ['Einen Bogen aus dünnem Holz sägen', 0], ['Eine scharfe Metallkante entgraten', 1], ['Die Kante eines Acrylglas-Stücks glätten', 1], ['Ein Loch für die Kerze machen', 2], ['Ein Loch für eine Schraube vorbereiten', 2], ['Die Holzfläche vor dem Ölen glätten', 3], ['Splitter an einer Holzkante entfernen', 3]] },
  }, { erkennen: 22 });

  G.fuegen = baue('tc5-fuegen', {
    h: 'Fügen verbindet Teile. Lösbar: Schrauben, Stecken, Knöpfe. Unlösbar (nur mit Zerstörung): Kleben, Löten, Nieten. Holzleim braucht Druck und Zeit.',
    F: [
      { f: 'Welche Verbindung ist <b>lösbar</b>?', a: 'Schrauben', x: ['Kleben', 'Löten', 'Nieten'], w: 'Eine Schraube kann man wieder herausdrehen, ohne etwas zu zerstören.' },
      { f: 'Was braucht eine <b>Holzleim</b>-Verbindung, damit sie hält?', a: 'Druck und Zeit', x: ['Hitze und Wasser', 'nur viel Leim', 'nichts weiter'], w: 'Zum Beispiel mit Schraubzwingen pressen und trocknen lassen. Ausgequollenen Leim wischt man gleich feucht ab.' },
      { f: 'Woher kommt bei der Nähmaschine der <b>Unterfaden</b>?', a: 'von der Spule', x: ['von oben, wie der Oberfaden', 'aus der Nadel', 'aus dem Stoff'], w: 'Ober- und Unterfaden verschlingen sich im Stoff: Steppstich.' },
      { f: 'Warum <b>bohrt</b> man bei Holzschrauben oft <b>vor</b>?', a: 'damit das Holz nicht reißt', x: ['damit die Schraube rostet', 'damit die Schraube lockerer sitzt', 'damit man keinen Schraubendreher braucht'], w: 'Besonders nahe am Rand kann Holz sonst aufplatzen.' },
      { f: 'Was bedeutet <b>unlösbare</b> Verbindung?', a: 'Trennen geht nur mit Zerstörung.', x: ['Sie hält gar nicht.', 'Man kann sie jederzeit öffnen.', 'Sie ist besonders leicht.'], w: 'Zum Beispiel eine Klebestelle oder eine Lötstelle.' },
    ],
    S: { kats: ['lösbar', 'unlösbar (nur mit Zerstörung)'], f: (b) => `<b>${b}</b>: lösbar oder unlösbar?`, h: 'Kann man es wieder öffnen, ohne etwas kaputt zu machen?',
      items: [['Schraube', 0], ['Steckverbindung bei Bausteinen', 0], ['Druckknopf', 0], ['Reißverschluss', 0], ['Klettverschluss', 0], ['Klebstoff', 1], ['Lötstelle', 1], ['Schweißnaht', 1], ['Niete', 1]] },
    T: [{ f: 'Ober- und Unterfaden der Nähmaschine bilden zusammen den ___.', a: ['Steppstich', 'Stich'], w: 'Er sieht von beiden Seiten gleich aus.' }],
  });

  G.maschinen = baue('tc5-maschinen', {
    h: 'Akkuschrauber: schrauben und bohren. Dekupiersäge: Kurven sägen. Tischbohrmaschine: genaue, senkrechte Löcher. Nähmaschine: Stoff nähen. Jede Maschine nur nach Einweisung und mit Erlaubnis.',
    E: { f: 'Welche Maschine ist das?', arten: [['akkuschrauber', 'Akkuschrauber', 'Schraubt und bohrt, läuft mit Akku.'], ['dekupiersaege', 'Dekupiersäge', 'Das Sägeblatt geht schnell auf und ab, ideal für Kurven.'], ['tischbohrmaschine', 'Tischbohrmaschine', 'Bohrt genau senkrecht. Das Werkstück wird eingespannt.'], ['naehmaschine', 'Nähmaschine', 'Näht Stoff mit Ober- und Unterfaden.']] },
    F: [
      { f: 'Wofür ist die <b>Dekupiersäge</b> besonders gut?', a: 'zum Sägen von Kurven', x: ['zum Bohren von Löchern', 'zum Nähen', 'zum Biegen von Metall'], w: 'Sie ist eine Laubsäge mit Motor.' },
      { f: 'Wie stellst du beim Akkuschrauber ein, ob er eine Schraube <b>hinein- oder herausdreht</b>?', a: 'mit dem Drehrichtungsschalter', x: ['durch stärkeres Drücken', 'durch Umdrehen des Akkus', 'gar nicht'], w: 'Rechtslauf dreht hinein, Linkslauf dreht heraus.' },
      { f: 'Wie wählt man die <b>Drehzahl</b> an der Tischbohrmaschine?', a: 'großer Bohrer, kleine Drehzahl', x: ['immer so schnell wie möglich', 'großer Bohrer: große Drehzahl', 'die Drehzahl ist egal'], w: 'Kleiner Bohrer: große Drehzahl. Sonst wird der große Bohrer zu heiß und stumpf.' },
      { f: 'Wie hältst du ein kleines Werkstück an der <b>Tischbohrmaschine</b>?', a: 'im Maschinenschraubstock', x: ['mit der Hand fest drücken', 'mit Handschuhen festhalten', 'eine Freundin hält es'], w: 'Nie mit der Hand halten. Packt der Bohrer das Werkstück, wird es sonst herumgeschleudert.' },
      { f: 'Wann darfst du eine Maschine in der Schulwerkstatt benutzen?', a: 'nach Einweisung, mit Erlaubnis', x: ['immer, wenn sie frei ist', 'wenn niemand hinschaut', 'nur in der Pause'], w: 'Jede Maschine hat eigene Gefahren. Die Einweisung zeigt, wie man sicher arbeitet.' },
      { f: 'Was machst du <b>als Erstes</b>, wenn an einer Maschine etwas schiefgeht?', a: 'den Not-Aus-Schalter drücken', x: ['weglaufen', 'die Maschine festhalten', 'das Werkstück wegziehen'], w: 'Der rote Not-Aus-Schalter hält alle Maschinen sofort an.' },
    ],
    T: [{ f: 'Der rote Schalter, der alle Maschinen sofort stoppt, heißt ___.', a: ['Not-Aus', 'Notaus', 'Not-Aus-Schalter', 'Notausschalter'], w: 'Man muss wissen, wo er ist, bevor man anfängt.' }],
  }, { erkennen: 30 });

  G.sicher = baue('tc5-sicher', {
    h: 'Schutzbrille, Haare zusammen, kein Schmuck, keine Handschuhe an drehenden Maschinen, Werkstück einspannen, Ordnung halten, jede Verletzung melden.',
    F: [
      { f: 'Warum trägt man an der <b>Bohrmaschine keine Handschuhe</b>?', a: 'Der Bohrer kann sie erfassen.', x: ['weil sie zu warm sind', 'weil man damit schlechter sieht', 'das stimmt nicht, Handschuhe sind Pflicht'], w: 'Er reißt dann die Hand mit. Dasselbe gilt für lange Haare, Schals, Ketten und weite Ärmel.' },
      { f: 'Wann trägst du eine <b>Schutzbrille</b>?', a: 'beim Bohren, Sägen, Gießen', x: ['nur beim Lesen', 'nie, sie stört', 'nur draußen'], w: 'beim Bohren und Sägen. Späne und Spritzer können ins Auge fliegen.' },
      { f: 'Wie entfernst du <b>Späne</b> vom Werktisch?', a: 'mit einem Handfeger', x: ['wegpusten', 'mit der bloßen Hand wegwischen', 'liegen lassen'], w: 'Beim Pusten fliegen sie ins Auge, mit der Hand schneidest du dich an Metallspänen.' },
      { f: 'Was bedeutet ein <b>blaues, rundes</b> Schild?', a: 'Gebot: Das musst du tun', x: ['Verbot', 'Warnung', 'Rettungsweg'], w: 'Gebot: Das musst du tun. Rund und blau = Gebotszeichen.' },
      { f: 'Was bedeutet ein <b>gelbes Dreieck</b>?', a: 'Warnung', x: ['Gebot', 'Verbot', 'Erste Hilfe'], w: 'Zum Beispiel Warnung vor heißer Oberfläche.' },
      { f: 'Was tust du, wenn du dich <b>verletzt</b> hast, auch nur leicht?', a: 'sofort der Lehrkraft Bescheid sagen', x: ['nichts sagen und weiterarbeiten', 'schnell nach Hause gehen', 'das Pflaster selbst im Schrank suchen'], w: 'Jede Verletzung wird versorgt und aufgeschrieben.' },
    ],
    E: { f: 'Was für ein Sicherheitszeichen ist das?', arten: [['zeichenGebot', 'Gebotszeichen', 'Rund und blau: Das musst du tun.'], ['zeichenVerbot', 'Verbotszeichen', 'Rund, rot umrandet und durchgestrichen: Das ist verboten.'], ['zeichenWarn', 'Warnzeichen', 'Gelbes Dreieck: Achtung, Gefahr!'], ['zeichenRettung', 'Rettungszeichen', 'Grün und eckig: Rettungsweg oder Erste Hilfe.']] },
    S: { kats: ['richtig', 'gefährlich'], f: (b) => `<b>${b}</b>`, h: 'Was schützt dich und andere?',
      items: [['Lange Haare zusammenbinden', 0], ['Werkstück mit Schraubzwinge festspannen', 0], ['Schutzbrille an der Bohrmaschine', 0], ['Werkzeug nach der Arbeit wegräumen', 0], ['Mit Handschuhen an die Bohrmaschine', 1], ['Werkstück beim Bohren mit der Hand halten', 1], ['Späne wegpusten', 1], ['Mit der Säge in der Hand herumlaufen', 1], ['Halskette an der Dekupiersäge tragen', 1]] },
  }, { erkennen: 22 });

  G.pruefen = baue('tc5-pruefen', {
    h: 'Prüfe Funktion (Tut es, was es soll?), Sicherheit (keine scharfen Kanten, kippt nicht) und Qualität (Maße, Winkel, Oberfläche). Dann bewerte ehrlich: Was gelang, was mache ich nächstes Mal besser?',
    F: [
      { f: 'Was prüfst du bei der <b>Funktion</b>?', a: 'ob es seinen Zweck erfüllt', x: ['ob es schön bunt ist', 'wie teuer es war', 'wie lange es gedauert hat'], w: 'Zum Beispiel: Hält der Leuchter die Kerze fest?' },
      { f: 'Wie prüfst du, ob eine Ecke genau <b>rechtwinklig</b> ist?', a: 'mit dem Anschlagwinkel', x: ['mit dem Hammer draufklopfen', 'mit dem Finger fühlen', 'mit dem Lineal die Farbe messen'], w: 'Anlegen und gegen das Licht schauen: Ein Lichtspalt zeigt die Abweichung. Das heißt Lichtspaltverfahren.' },
      { f: 'Was gehört zur <b>Sicherheit</b> eines Werkstücks?', a: 'keine scharfen Kanten', x: ['eine glänzende Farbe', 'ein hoher Preis', 'ein schöner Name'], w: 'Ein Werkstück darf niemanden verletzen.' },
      { f: 'Was ist eine <b>Selbstbewertung</b>?', a: 'Man prüft die eigene Arbeit ehrlich.', x: ['Man gibt sich immer die beste Note.', 'Die Lehrkraft bewertet allein.', 'Man vergleicht nur den Preis.'], w: 'Bei der Fremdbewertung schätzen andere deine Arbeit ein.' },
      { f: 'Woran misst man die <b>Qualität</b>?', a: 'an Maßen, Winkeln, Oberfläche', x: ['an der Zahl der Fehler der anderen', 'am Gewicht des Werkzeugs', 'an der Uhrzeit'], w: 'Vergleiche mit der technischen Zeichnung.' },
    ],
    S: { kats: ['Funktion', 'Sicherheit', 'Qualität'], f: (b) => `<b>${b}</b>: Was wird hier geprüft?`, h: 'Tut es, was es soll? Kann sich jemand verletzen? Ist es genau und sauber gearbeitet?',
      items: [['Der Leuchter hält die Kerze fest.', 0], ['Die Schutzbacken halten am Schraubstock.', 0], ['Das Kissen passt in die Hülle.', 0], ['Keine Splitter an den Kanten', 1], ['Der Leuchter kippt nicht um.', 1], ['Keine scharfen Ecken am Acrylglas', 1], ['Die Länge stimmt auf 1 mm genau.', 2], ['Die Oberfläche ist glatt geschliffen.', 2], ['Die Ecken sind rechtwinklig.', 2]] },
  });

  G.cnc = baue('tc5-cnc', {
    h: 'Computergestützte Fertigung: Am Computer wird gezeichnet (CAD), dann steuert der Computer die Maschine (CNC, 3D-Drucker, Laserschneider, Roboter). Schnell, genau, viele gleiche Teile.',
    F: [
      { f: 'Was ist eine <b>CNC-Maschine</b>?', a: 'eine Maschine mit Computer', x: ['eine Maschine ohne Strom', 'ein Spielzeugroboter', 'ein Drucker für Papier'], w: 'eine computergesteuerte Maschine. CNC steht für computergesteuert (englisch Computerized Numerical Control).' },
      { f: 'Wie baut ein <b>3D-Drucker</b> ein Teil auf?', a: 'Schicht für Schicht', x: ['durch Wegfräsen von Material', 'durch Biegen', 'durch Weben'], w: 'Das gehört zum Urformen.' },
      { f: 'Wofür steht <b>CAD</b>?', a: 'Konstruieren am Computer', x: ['für einen Kleber', 'für eine Säge', 'für eine Maßeinheit'], w: 'für Konstruieren am Computer. Englisch Computer Aided Design: rechnergestütztes Konstruieren.' },
      { f: 'Was ist ein Vorteil der computergesteuerten Fertigung?', a: 'Sie stellt sehr viele gleiche Teile schnell und genau her.', x: ['Sie ist immer billiger als Handarbeit, auch für ein einziges Teil.', 'Sie braucht keinen Strom.', 'Sie macht keine Programme nötig.'], w: 'Für ein einzelnes Stück lohnt sich oft Handarbeit.' },
      { f: 'Warum stecken in einem Handy Teile aus <b>vielen Ländern</b>?', a: 'Die Teile kommen aus aller Welt.', x: ['weil es Vorschrift ist', 'weil ein Land allein keine Schrauben hat', 'das stimmt nicht'], w: 'Diese weltweite Arbeitsteilung nennt man Globalisierung.' },
      { f: 'Was wird in <b>Dresden</b> in großen, hochmodernen Fabriken hergestellt?', a: 'Mikrochips', x: ['Schiffe', 'Flugzeuge', 'Teppiche'], w: 'Die Gegend um Dresden heißt darum auch „Silicon Saxony“.' },
    ],
    S: { kats: ['eher Handarbeit', 'eher computergesteuert'], f: (b) => `<b>${b}</b>`, h: 'Ein Einzelstück oder Tausende gleiche Teile?',
      items: [['ein Leuchter in der Schulwerkstatt', 0], ['ein maßgeschneidertes Kleid', 0], ['eine Geige vom Geigenbauer', 0], ['10 000 gleiche Spielzeugsteine', 1], ['Computerchips', 1], ['Autotüren im Autowerk', 1], ['ein Ersatzteil aus dem 3D-Drucker', 1]] },
  });

  // =====================================================
  // Bereich 7: Umwelt: Abfall und Rohstoffe
  // =====================================================
  const STUFEN = ['Vermeiden', 'Wiederverwenden', 'Recyceln', 'Verbrennen (Energie gewinnen)', 'Ablagern (Deponie)'];
  G.vermeiden = baue('tc5-vermeiden', {
    h: 'Die Reihenfolge im Gesetz: 1. Vermeiden, 2. Wiederverwenden, 3. Recyceln, 4. sonst verwerten (zum Beispiel verbrennen und Energie gewinnen), 5. ablagern.',
    O: [{ t: 'Ordne: Was ist beim Umgang mit Abfall am <b>besten</b>, was am <b>schlechtesten</b>?', items: STUFEN, n: 4, w: 'Am besten entsteht gar kein Abfall. Am schlechtesten ist die Deponie.', ex: { mode: 'karte', nach: false, svg: 'abfallStufen', q: 'Die fünf Stufen beim Abfall', opts: ['Vermeiden zuerst'], ok: 0, merk: '<b>Vermeiden zuerst</b>: dann wiederverwenden, recyceln, verbrennen, ablagern.' } }],
    F: [
      { f: 'Was ist beim Abfall am <b>allerbesten</b>?', a: 'ihn vermeiden', x: ['ihn recyceln', 'ihn verbrennen', 'ihn auf die Deponie bringen'], w: 'Was nicht entsteht, muss man nicht entsorgen.' },
      { f: 'Du nimmst eine <b>Brotdose</b> statt Alufolie mit. Was ist das?', a: 'Abfall vermeiden', x: ['Recycling', 'Verbrennung', 'Deponie'], w: 'Die Dose hält Jahre.' },
      { f: 'Ein altes Marmeladenglas wird zur Stiftedose. Was ist das?', a: 'Wiederverwenden', x: ['Recyceln', 'Verbrennen', 'Ablagern'], w: 'Der Gegenstand bleibt ganz und bekommt eine neue Aufgabe.' },
      { f: 'Aus Altpapier wird neues Papier. Was ist das?', a: 'Recyceln', x: ['Vermeiden', 'Wiederverwenden', 'Ablagern'], w: 'Beim Recyceln wird der Stoff aufbereitet und neu verarbeitet.' },
      { f: 'Was passiert mit dem <b>Restmüll</b> meistens?', a: 'Er wird verbrannt.', x: ['Er wird zu neuem Papier.', 'Er wird ins Meer gekippt.', 'Er wird wieder verkauft.'], w: 'Das ist besser als die Deponie, aber schlechter als Recycling.' },
      { f: 'Was bringt ein <b>Repair-Café</b>?', a: 'Man repariert dort Dinge.', x: ['Man bekommt dort Kaffee aus Müll.', 'Dort wird Müll verbrannt.', 'Dort werden neue Geräte verkauft.'], w: 'Reparieren verlängert das Leben eines Geräts.' },
    ],
    S: { kats: ['Vermeiden', 'Wiederverwenden', 'Recyceln'], f: (b) => `<b>${b}</b>: Welche Stufe ist das?`, h: 'Entsteht gar kein Abfall? Bleibt das Ding ganz? Oder wird der Stoff neu verarbeitet?',
      items: [['Stoffbeutel statt Plastiktüte', 0], ['Leitungswasser statt Wasser aus Einwegflaschen', 0], ['Brotdose statt Alufolie', 0], ['Mehrwegflasche wird gespült und neu befüllt', 1], ['Kleidung an Jüngere weitergeben', 1], ['Glas als Stiftedose', 1], ['Altpapier wird neues Papier', 2], ['Altglas wird eingeschmolzen', 2], ['Aus Getränkedosen wird neues Aluminium', 2]] },
  }, { ordnen: 26 });

  const TONNEN = { kats: ['Gelbe Tonne', 'Blaue Tonne', 'Biotonne', 'Glascontainer', 'Restabfall', 'Wertstoffhof oder Handel'], f: (b) => `Wohin gehört <b>${b}</b>?`, h: 'Verpackung? Papier? Essensrest? Glas? Gefährlich oder elektrisch? Sonst Restabfall.',
    items: [['leerer Joghurtbecher', 0], ['leere Konservendose', 0], ['Getränkekarton', 0], ['Chipstüte', 0], ['Zeitung', 1], ['Pappkarton', 1], ['Eierkarton aus Pappe', 1], ['Bananenschale', 2], ['Kaffeefilter mit Kaffeesatz', 2], ['Teebeutel', 2], ['leeres Marmeladenglas', 3], ['Saftflasche ohne Pfand', 3], ['Windel', 4], ['verschmutzter Pizzakarton', 4], ['Staubsaugerbeutel', 4], ['alte Batterie', 5], ['kaputtes Handy', 5], ['alter Akku', 5], ['LED-Lampe', 5]] };
  const WARUM = ['Verpackungen aus Kunststoff, Metall und Getränkekartons', 'Papier und Pappe, sauber', 'Essensreste, Kaffee, Tee, Grünes', 'Gläser und Flaschen ohne Pfand, nach Farben', 'Was schmutzig ist oder in keine andere Tonne passt', 'Batterien, Akkus und Elektrogeräte: Schadstoffe und wertvolle Metalle'];
  const alsKarte = (t, art) => { const ok = t.choices[t.correct], k = TONNEN.kats.indexOf(ok); t.ex = { mode: 'karte', nach: false, art, q: U.nurText(t.prompt), opts: [ok], ok: 0, merk: k >= 0 ? `<b>${ok}</b>: ${WARUM[k]}` : t.solution }; return t; };
  G.muell = baue('tc5-muell', {
    extra: { tonne: () => alsKarte(U.sortiere('tonne', TONNEN), 'tonne'), passtNichtTonne: () => alsKarte(U.passtNicht('passtNichtTonne', TONNEN), 'passtNichtTonne') },
    h: 'Gelbe Tonne: Verpackungen aus Kunststoff, Metall und Getränkekartons. Blaue Tonne: Papier. Biotonne: Essensreste. Glascontainer: Gläser. Batterien, Akkus und Elektrogeräte nie in den Hausmüll.',
    F: [
      { f: 'Wohin bringst du ein <b>kaputtes Handy</b>?', a: 'zum Wertstoffhof', x: ['in die Gelbe Tonne', 'in die Restmülltonne', 'in die Biotonne'], w: 'Darin stecken wertvolle Metalle und ein Akku, der brennen kann.' },
      { f: 'Warum gehören <b>Batterien und Akkus</b> nicht in den Hausmüll?', a: 'Sie enthalten Schadstoffe.', x: ['Sie sind zu schwer.', 'Sie passen nicht hinein.', 'Das stimmt nicht.'], w: 'Dazu wertvolle Metalle, und Akkus können Brände auslösen. Sammelboxen gibt es in Supermärkten und Elektrogeschäften.' },
      { f: 'Wo kannst du kleine <b>Elektrogeräte</b> (bis 25 cm) kostenlos abgeben, ohne etwas Neues zu kaufen?', a: 'in großen Elektrogeschäften', x: ['nirgends', 'nur beim Hersteller in einem anderen Land', 'beim Bäcker'], w: 'Große Geschäfte, die Elektrogeräte verkaufen, müssen sie zurücknehmen.' },
      { f: 'Warum soll man Müll überhaupt <b>trennen</b>?', a: 'damit die Wertstoffe recycelt werden können', x: ['damit die Tonnen bunter aussehen', 'weil es sonst nicht in eine Tonne passt', 'das ist unnötig'], w: 'Aus getrenntem Papier wird neues Papier, aus Glas neues Glas.' },
      { f: 'Wohin gehört ein <b>Getränkekarton</b> (Milch, Saft)?', a: 'in die Gelbe Tonne', x: ['in die Blaue Tonne', 'in die Biotonne', 'in den Glascontainer'], w: 'Er sieht aus wie Pappe, ist innen aber mit Kunststoff und oft Aluminium beschichtet.' },
      { f: 'Was tust du mit dem <b>Akku</b>, bevor du ein altes Gerät abgibst?', a: 'herausnehmen, getrennt abgeben', x: ['drinlassen und Wasser darüber gießen', 'in die Gelbe Tonne werfen', 'aufschneiden'], w: 'So kann er nicht beschädigt werden und Feuer fangen.' },
    ],
    A: { w: ['Getränkekartons gehören in die Gelbe Tonne.', 'Batterien gibt man im Handel oder am Wertstoffhof ab.', 'Ein verschmutzter Pizzakarton gehört in den Restabfall.'], f: ['Batterien gehören in die Gelbe Tonne.', 'Glas gehört in die Blaue Tonne.', 'Ein altes Handy gehört in die Biotonne.'] },
  }, { tonne: 40, passtNichtTonne: 14 });

  G.kunststoff = baue('tc5-kunststoff', {
    h: 'Kunststoff kommt meist aus Erdöl, zerfällt erst nach sehr langer Zeit und zerbröselt dabei zu Mikroplastik. Viele Sorten erschweren das Recycling. Darum: vermeiden und richtig trennen.',
    F: [
      { f: 'Warum ist Kunststoff in der Natur ein <b>Problem</b>?', a: 'Er zerfällt sehr langsam.', x: ['Er löst sich sofort auf.', 'Er wird zu Erde.', 'Er ist für Tiere gutes Futter.'], w: 'Nach Jahrzehnten oder Jahrhunderten zerbröselt er zu Mikroplastik. Mikroplastik findet man inzwischen sogar im Tiefseeboden und im Eis der Arktis.' },
      { f: 'Was ist <b>Mikroplastik</b>?', a: 'Kunststoff kleiner als 5 mm', x: ['besonders starker Kunststoff', 'Kunststoff aus Pflanzen', 'ein Werkzeug zum Schneiden'], w: 'Es entsteht auch beim Waschen von Kleidung aus Kunstfasern und durch Reifenabrieb.' },
      { f: 'Warum ist Kunststoff <b>schwer zu recyceln</b>?', a: 'Es gibt zu viele Sorten.', x: ['Er ist zu leicht.', 'Er ist immer sauber.', 'Er brennt nicht.'], w: 'Oft sind sie auch mit anderen Stoffen verklebt. Darum wird ein großer Teil verbrannt statt recycelt.' },
      { f: 'Was zeigt das <b>Dreieck mit einer Zahl</b> auf vielen Verpackungen?', a: 'die Kunststoffsorte', x: ['wie alt die Verpackung ist', 'wie viel sie kostet', 'wie heiß sie werden darf'], w: 'Die 1 steht zum Beispiel für PET, aus dem viele Getränkeflaschen sind.' },
      { f: 'Wie gefährdet Kunststoff im Meer die <b>Tiere</b>?', a: 'Sie halten ihn für Futter.', x: ['Er wärmt das Wasser.', 'Er macht Tiere schneller.', 'Gar nicht.'], w: 'Seevögel und Schildkröten verhungern mit vollem Magen voller Plastik.' },
      { f: 'Was kannst du selbst gegen Kunststoffmüll tun?', a: 'Mehrweg und Stoffbeutel nutzen', x: ['Plastik im Wald vergraben', 'Plastik verbrennen im Garten', 'nichts'], w: 'Jede vermiedene Verpackung zählt.' },
    ],
    A: { w: ['Kunststoff wird meist aus Erdöl hergestellt.', 'Mikroplastik ist kleiner als 5 mm.', 'Viele Kunststoffsorten erschweren das Recycling.'], f: ['Kunststoff zerfällt in wenigen Wochen.', 'Alle Kunststoffe sind gleich und leicht zu recyceln.', 'Mikroplastik gibt es nur in Fabriken.'] },
  });

  // =====================================================
  // Bereich 8: Wahlthemen (der Lehrplan bietet sechs an; die Schule wählt höchstens eines)
  // =====================================================
  G.nachrichten = baue('tc5-nachrichten', {
    h: 'Von Rauchzeichen und Flügeltelegraf über Morsetelegraf und Telefon zu E-Mail und SMS. Morsecode: Buchstaben aus kurzen und langen Signalen.',
    O: [{ t: 'Ordne die Arten, Nachrichten zu übertragen: die älteste zuerst.', items: ['Rauchzeichen', 'Flügeltelegraf', 'Morsetelegraf', 'Telefon', 'E-Mail', 'SMS'], n: 4, w: 'Flügeltelegraf ab 1794, Morsetelegraf ab 1844, Telefon 1876, erste E-Mail 1971, erste SMS 1992.' }],
    F: [
      { f: 'Wie funktionierte ein <b>Flügeltelegraf</b>?', a: 'mit Armen auf Türmen', x: ['mit Strom durch Kabel', 'mit Funkwellen', 'mit Brieftauben'], w: 'Bewegliche Arme zeigten Zeichen, die man mit dem Fernrohr zum nächsten Turm weitergab. Man brauchte gute Sicht. Bei Nebel und nachts ging nichts.' },
      { f: 'Woraus besteht der <b>Morsecode</b>?', a: 'aus kurzen und langen Signalen', x: ['aus Farben', 'aus Bildern', 'aus Zahlen von 1 bis 100'], w: 'Man kann sie als Töne, Lichtblitze oder Klopfzeichen senden.' },
      { f: 'Wie lautet der Notruf <b>SOS</b> im Morsecode?', a: '··· −−− ···', x: ['−−− ··· −−−', '·−·−·−', '−·−· −−−'], w: 'Drei kurz, drei lang, drei kurz. Leicht zu merken, schwer zu verwechseln.' },
      { f: 'Was braucht ein einfacher <b>Stromkreis</b> mit Klingel?', a: 'Batterie, Taster, Klingel', x: ['nur eine Batterie', 'nur einen Taster', 'Wasser und Kabel'], w: 'Batterie, Taster, Klingel, Leitung. Drückst du den Taster, ist der Kreis geschlossen und die Klingel läutet.' },
      { f: 'Warum hat der Buchstabe <b>E</b> das kürzeste Morsezeichen (·)?', a: 'Weil E am häufigsten vorkommt.', x: ['Weil E im Alphabet vorn steht.', 'Zufall', 'Weil E ein Vokal ist.'], w: 'Häufige Buchstaben haben kurze Zeichen. So geht das Senden schneller.' },
    ],
    extra: { morse: () => U.morseLesen('morse') },
  }, { morse: 40 });

  G.mikrocontroller = baue('tc5-mikrocontroller', {
    h: 'Ein Mikrocontroller ist ein kleiner Computer auf einer Platine. Sensoren messen (Eingabe), das Programm entscheidet (Verarbeitung), Aktoren handeln (Ausgabe).',
    F: [
      { f: 'Was ist ein <b>Sensor</b>?', a: 'ein Bauteil, das misst', x: ['ein Motor', 'ein Lautsprecher', 'ein Kabel'], w: 'Zum Beispiel Licht, Temperatur oder Lage. Sensoren liefern die Eingabe.' },
      { f: 'Was ist ein <b>Aktor</b>?', a: 'ein Bauteil, das handelt', x: ['ein Bauteil, das misst', 'die Batterie', 'das Programm'], w: 'Es leuchtet, piept oder bewegt sich. Aktoren liefern die Ausgabe, zum Beispiel LED, Lautsprecher, Motor.' },
      { f: 'Ein Nachtlicht geht an, wenn es dunkel wird. Was ist hier der <b>Sensor</b>?', a: 'der Lichtsensor', x: ['die LED', 'die Batterie', 'das Gehäuse'], w: 'Die LED ist der Aktor.' },
      { f: 'Wie misst ein <b>Schrittzähler</b> deine Schritte?', a: 'mit einem Bewegungssensor', x: ['mit einem Mikrofon', 'mit einem Thermometer', 'mit einer Kamera'], w: 'mit einem Bewegungssensor, der jedes Wackeln beim Gehen spürt. Das Programm zählt die Wackler und zeigt die Zahl an.' },
      { f: 'Was macht ein <b>Wenn-dann-Befehl</b> im Programm?', a: 'Er prüft eine Bedingung.', x: ['Er wiederholt alles für immer.', 'Er schaltet den Strom ab.', 'Er löscht das Programm.'], w: 'Nur wenn sie erfüllt ist, führt er den Befehl aus. Zum Beispiel: Wenn es dunkel ist, dann LED an.' },
      { f: 'Wie regelt eine <b>Heizung</b> die Zimmertemperatur?', a: 'Sie misst und vergleicht ständig.', x: ['Sie heizt immer gleich stark.', 'Sie fragt jede Stunde nach.', 'Der Heizkörper misst nichts.'], w: 'Ein Temperatursensor misst, das Programm vergleicht mit dem Wunschwert und öffnet oder schließt das Ventil. Messen, vergleichen, handeln: immer wieder. So bleibt es gleich warm.' },
    ],
    S: { kats: ['Sensor (Eingabe)', 'Aktor (Ausgabe)'], f: (b) => `<b>${b}</b>: Sensor oder Aktor?`, h: 'Misst es etwas, oder tut es etwas?',
      items: [['Lichtsensor', 0], ['Temperatursensor', 0], ['Lagesensor', 0], ['Taster', 0], ['Mikrofon', 0], ['Bewegungsmelder', 0], ['LED', 1], ['Lautsprecher', 1], ['Motor', 1], ['Anzeige (Display)', 1], ['Summer', 1], ['Heizungsventil', 1]] },
    O: [{ t: 'Bring das Programm für ein <b>Nachtlicht</b> in die richtige Reihenfolge.', items: ['Lichtsensor misst die Helligkeit', 'Programm prüft: Ist es dunkel?', 'wenn ja: LED einschalten', 'kurz warten, dann von vorn'], w: 'Messen, prüfen, handeln, wiederholen: wie das EVA-Prinzip in einer Schleife.' }],
  });

  G.energie = baue('tc5-energie', {
    h: 'Wind, Wasser und Sonne gehen nicht aus: erneuerbare Energien. Ein Generator macht aus Drehbewegung Strom. Kohle, Erdöl und Erdgas sind fossil und gehen zur Neige.',
    F: [
      { f: 'Was macht ein <b>Generator</b>?', a: 'Er macht aus Bewegung Strom.', x: ['Er wandelt Strom in Wind um.', 'Er speichert Wasser.', 'Er misst die Windstärke.'], w: 'Der Fahrraddynamo ist ein kleiner Generator.' },
      { f: 'Was dreht sich bei einer <b>Windkraftanlage</b> zuerst?', a: 'der Rotor', x: ['der Turm', 'das Fundament', 'das Stromkabel'], w: 'der Rotor mit den Flügeln. Der Rotor treibt (oft über ein Getriebe) den Generator an.' },
      { f: 'Was ist ein Nachteil der <b>Windkraft</b>?', a: 'Der Wind weht nicht immer.', x: ['Wind geht bald aus.', 'Wind macht Abgase.', 'Windräder brauchen Kohle.'], w: 'Der Wind weht nicht immer gleich stark. Darum braucht man Speicher und andere Kraftwerke dazu.' },
      { f: 'Welche Energie ist <b>erneuerbar</b>?', a: 'Sonnenenergie', x: ['Braunkohle', 'Erdöl', 'Erdgas'], w: 'Die Sonne scheint noch Milliarden Jahre.' },
      { f: 'Wie nutzte man früher die Kraft des <b>Wassers</b>?', a: 'mit Wasserrädern', x: ['gar nicht', 'mit Solarzellen', 'mit Dampfmaschinen ohne Feuer'], w: 'Wasserräder trieben Mühlen und Hämmer an. Heute treibt Wasser in Kraftwerken Turbinen an, die Generatoren drehen.' },
      { f: 'Was ist ein <b>Pumpspeicherwerk</b>?', a: 'ein Speicher für Strom mit Wasser', x: ['ein Brunnen', 'eine Windkraftanlage', 'ein Wasserhahn'], w: 'Bei Stromüberschuss pumpt es Wasser bergauf, bei Bedarf läuft es durch Turbinen wieder herunter. So kann man Strom speichern. Eines der größten in Deutschland steht in Markersbach im Erzgebirge.' },
    ],
    S: { kats: ['erneuerbar', 'nicht erneuerbar'], f: (b) => `<b>${b}</b>: erneuerbar oder nicht?`, h: 'Kommt es immer wieder nach, oder ist es irgendwann verbraucht?',
      items: [['Wind', 0], ['Sonne', 0], ['Wasser', 0], ['Erdwärme', 0], ['Biogas', 0], ['Braunkohle', 1], ['Steinkohle', 1], ['Erdöl', 1], ['Erdgas', 1], ['Uran', 1]] },
  });

  G.handwerk = baue('tc5-handwerk', {
    h: 'Gießer, Weber und Schneider sind alte Handwerke. Früher alles mit der Hand, heute helfen Maschinen. Der Webstuhl mit Lochkarten war ein Vorläufer der Computerprogramme.',
    F: [
      { f: 'Was macht ein <b>Weber</b>?', a: 'Er macht Stoff aus Fäden.', x: ['Er gießt Metall.', 'Er baut Häuser.', 'Er schneidet Haare.'], w: 'Er verkreuzt Fäden zu einem Stoff. Die Längsfäden heißen Kettfäden, der Querfaden heißt Schussfaden.' },
      { f: 'Wie heißen beim Weben die <b>Querfäden</b>?', a: 'Schussfaden', x: ['Kettfaden', 'Nähfaden', 'Unterfaden'], w: 'Das Schiffchen „schießt“ den Faden quer durch die Kettfäden.' },
      { f: 'Was war am <b>Jacquard-Webstuhl</b> (1804) besonders?', a: 'Lochkarten steuerten das Muster.', x: ['Er lief mit Strom.', 'Er konnte sprechen.', 'Er war aus Kunststoff.'], w: 'Ein Vorläufer der Computerprogramme. Loch oder kein Loch: Das ist wie 1 oder 0 im Computer.' },
      { f: 'Was macht ein <b>Zinngießer</b>?', a: 'Er gießt Zinn in Formen.', x: ['Er webt Teppiche.', 'Er näht Kleider.', 'Er backt Brot.'], w: 'Er gießt flüssiges Zinn in Formen, zum Beispiel für Becher und Figuren. Zinn schmilzt schon bei etwa 232 °C.' },
      { f: 'Was erleichtert einem <b>Schneider</b> heute die Arbeit?', a: 'die Nähmaschine', x: ['der Hammer', 'die Bohrmaschine', 'der Lötkolben'], w: 'Die ersten brauchbaren Nähmaschinen gab es Mitte des 19. Jahrhunderts.' },
      { f: 'Wie wird man heute <b>Handwerker</b>?', a: 'mit einer Ausbildung', x: ['nur durch Zuschauen', 'man muss es nicht lernen', 'nur an der Universität'], w: 'Im Betrieb und in der Berufsschule. Später kann man die Meisterprüfung machen.' },
    ],
    O: [{ t: 'Vom Schaf zum Pullover: Bring die Schritte in die richtige Reihenfolge.', items: ['Schaf scheren', 'Wolle waschen', 'Wolle zu Garn spinnen', 'Garn stricken oder weben', 'Teile zusammennähen'], n: 4, w: 'Scheren, waschen, spinnen, stricken oder weben, nähen.' }],
    T: [{ f: 'Die Längsfäden beim Weben heißen ___.', a: ['Kettfäden', 'Kettfaden', 'Kette'], w: 'Sie werden zuerst gespannt.' }],
  });

  // =====================================================
  // Themenliste Klasse 5/6 (Lehrplan TC 5/6; kein Schulbuch)
  // =====================================================
  D.grades = D.grades || {};
  D.grades[5] = {
    lbs: [
      { id: 'tc5-computer', nr: 1, title: 'Computer und Daten', topics: [
        { id: 'tc5-arbeitsplatz', title: 'Der Computerarbeitsplatz', icon: '🖥', gen: G.arbeitsplatz },
        { id: 'tc5-eva', title: 'Das EVA-Prinzip', icon: '➡', gen: G.eva },
        { id: 'tc5-hardware', title: 'Hardware und Software', icon: '💾', gen: G.hardware },
        { id: 'tc5-gesund', title: 'Gesund am Computer', icon: '🪑', gen: G.gesund },
        { id: 'tc5-oberflaeche', title: 'Fenster, Symbole, Menüs', icon: '🪟', gen: G.oberflaeche },
        { id: 'tc5-dateien', title: 'Dateien und Dateiarten', icon: '📄', gen: G.dateien },
        { id: 'tc5-ordner', title: 'Ordner und Pfade', icon: '📁', gen: G.ordner },
        { id: 'tc5-schulnetz', title: 'Im Schulnetz arbeiten', icon: '🔑', gen: G.schulnetz },
      ] },
      { id: 'tc5-text', nr: 2, title: 'Texte gestalten', topics: [
        { id: 'tc5-zeichen', title: 'Zeichen gestalten', icon: '𝐁', gen: G.zeichen },
        { id: 'tc5-absatz', title: 'Absätze gestalten', icon: '☰', gen: G.absatz },
        { id: 'tc5-inhalt', title: 'Inhalt und Gestaltung trennen', icon: '¶', gen: G.inhalt },
        { id: 'tc5-tabellen', title: 'Tabellen und Bilder', icon: '▦', gen: G.tabellen },
      ] },
      { id: 'tc5-netz', nr: 3, title: 'Im Netz: suchen, prüfen, mailen', topics: [
        { id: 'tc5-medien', title: 'Gedruckt oder digital?', icon: '📰', gen: G.medien },
        { id: 'tc5-browser', title: 'Browser und Internetadressen', icon: '🌐', gen: G.browser },
        { id: 'tc5-suchen', title: 'Geschickt suchen', icon: '🔎', gen: G.suchen },
        { id: 'tc5-quellen', title: 'Kann ich der Quelle trauen?', icon: '🧐', gen: G.quellen },
        { id: 'tc5-frei', title: 'Wikipedia, freie Inhalte, Bilderrechte', icon: '©', gen: G.frei },
        { id: 'tc5-gefahren', title: 'Gefahren im Netz', icon: '⚠', gen: G.gefahren },
        { id: 'tc5-email', title: 'Die E-Mail', icon: '✉', gen: G.email },
        { id: 'tc5-zusammen', title: 'Gut zusammenarbeiten', icon: '🤝', gen: G.zusammen },
      ] },
      { id: 'tc5-getriebe', nr: 4, title: 'Maschinen und Getriebe', topics: [
        { id: 'tc5-maschine', title: 'Was ist eine Maschine?', icon: '⚙', gen: G.maschine },
        { id: 'tc5-funktion', title: 'Die fünf Funktionselemente', icon: '🔧', gen: G.funktion },
        { id: 'tc5-getriebe', title: 'Wozu Getriebe?', icon: '⚙', gen: G.getriebe },
        { id: 'tc5-zugmittel', title: 'Riemen und Kette', icon: '⛓', gen: G.zugmittel },
        { id: 'tc5-raeder', title: 'Zahnräder und Reibräder', icon: '⚙', gen: G.raeder },
        { id: 'tc5-uebersetzung', title: 'Übersetzung: schneller oder kräftiger', icon: '🚲', gen: G.uebersetzung },
        { id: 'tc5-umformung', title: 'Aus Drehen wird Schieben', icon: '↔', gen: G.umformung },
        { id: 'tc5-sinnbild', title: 'Getriebe als Sinnbild', icon: '◎', gen: G.sinnbild },
        { id: 'tc5-konstruieren', title: 'Konstruieren Schritt für Schritt', icon: '💡', gen: G.konstruieren },
        { id: 'tc5-modelle', title: 'Welches Getriebe steckt drin?', icon: '🏗', gen: G.modelle },
      ] },
      { id: 'tc5-planen', nr: 5, title: 'Planen wie in der Werkstatt', topics: [
        { id: 'tc5-linien', title: 'Linienarten', icon: '✏', gen: G.linien },
        { id: 'tc5-bemassung', title: 'Bemaßung', icon: '📐', gen: G.bemassung },
        { id: 'tc5-ansichten', title: 'Ansichten: vorn, oben, Seite', icon: '🧊', gen: G.ansichten },
        { id: 'tc5-stueckliste', title: 'Stückliste und Kosten', icon: '📋', gen: G.stueckliste },
        { id: 'tc5-ablaufplan', title: 'Arbeitsablaufplan', icon: '🗒', gen: G.ablaufplan },
        { id: 'tc5-messen', title: 'Messen und Anreißen', icon: '📏', gen: G.messen },
      ] },
      { id: 'tc5-fertigen', nr: 6, title: 'Werkstoffe, Werkzeuge, Fertigen', topics: [
        { id: 'tc5-werkstoffe', title: 'Holz, Metall, Kunststoff, Stoff', icon: '🪵', gen: G.werkstoffe },
        { id: 'tc5-din8580', title: 'Die sechs Hauptgruppen der Fertigung', icon: '🏭', gen: G.din8580 },
        { id: 'tc5-urformen', title: 'Urformen: Gießen', icon: '🫗', gen: G.urformen },
        { id: 'tc5-umformen', title: 'Umformen: Biegen', icon: '↪', gen: G.umformen },
        { id: 'tc5-trennen', title: 'Trennen: Sägen, Bohren, Feilen', icon: '🪚', gen: G.trennen },
        { id: 'tc5-fuegen', title: 'Fügen: Nähen, Kleben, Schrauben', icon: '🔩', gen: G.fuegen },
        { id: 'tc5-maschinen', title: 'Maschinen in der Werkstatt', icon: '🛠', gen: G.maschinen },
        { id: 'tc5-sicher', title: 'Sicher arbeiten', icon: '🥽', gen: G.sicher },
        { id: 'tc5-pruefen', title: 'Prüfen und bewerten', icon: '✅', gen: G.pruefen },
        { id: 'tc5-cnc', title: 'Computer in der Fabrik', icon: '🤖', gen: G.cnc },
      ] },
      { id: 'tc5-umwelt', nr: 7, title: 'Umwelt: Abfall und Rohstoffe', topics: [
        { id: 'tc5-vermeiden', title: 'Vermeiden vor Verwerten', icon: '♻', gen: G.vermeiden },
        { id: 'tc5-muell', title: 'Richtig trennen', icon: '🗑', gen: G.muell },
        { id: 'tc5-kunststoff', title: 'Das Problem mit Kunststoff', icon: '🧴', gen: G.kunststoff },
      ] },
      { id: 'tc5-wahl', nr: 8, title: 'Wahlthemen', topics: [
        { id: 'tc5-nachrichten', title: 'Nachrichten übertragen, Morsen', icon: '📡', gen: G.nachrichten },
        { id: 'tc5-mikrocontroller', title: 'Mikrocontroller: Sensoren und Aktoren', icon: '🔌', gen: G.mikrocontroller },
        { id: 'tc5-energie', title: 'Wind- und Wasserkraft', icon: '🌬', gen: G.energie },
        { id: 'tc5-handwerk', title: 'Handwerk früher und heute', icon: '🧵', gen: G.handwerk },
      ] },
    ],
  };
})();
