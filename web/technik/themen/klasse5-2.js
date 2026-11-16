/* TecDax – Klasse 5/6, Bereiche 4 und 5: Maschinen und Getriebe, Planen wie in der Werkstatt
 * (Lehrplan Technik/Computer LB 2 „Konstruieren technischer Objekte“ und LB 3 „Fertigen“: Fertigungsunterlagen).
 * Texte selbst geschrieben, Fakten mit Quellen in faecher/technik/fakten.md.
 */
(function () {
  const D = window.TecDax, U = D.util, G = D.gen;
  const { baue, pick, shuffle, R } = U;

  // Getriebe am Bild erkennen (die Erklärung lässt das Getriebe laufen)
  const GETRIEBE = {
    offen: ['riemenOffen', 'Riemengetriebe', 'Ein Riemen verbindet zwei Scheiben. Beide drehen in dieselbe Richtung.'],
    gekreuzt: ['riemenGekreuzt', 'Riemengetriebe mit gekreuztem Riemen', 'Der gekreuzte Riemen kehrt die Drehrichtung um.'],
    kette: ['kette', 'Kettengetriebe', 'Eine Kette verbindet zwei Zahnräder auf Abstand und rutscht nicht.'],
    reibrad: ['reibrad', 'Reibradgetriebe', 'Zwei glatte Räder drücken aufeinander und nehmen sich durch Reibung mit.'],
    zahnrad: ['zahnradpaar', 'Zahnradgetriebe', 'Die Zähne greifen ineinander. Die Räder drehen gegeneinander.'],
    kurbel: ['kurbel', 'Kurbel mit Schubstange', 'Aus der Drehung wird ein Hin und Her.'],
    nocken: ['nocken', 'Nocken mit Stößel', 'Die unrunde Scheibe hebt den Stößel bei jeder Umdrehung einmal an.'],
    zahnstange: ['zahnstange', 'Zahnrad und Zahnstange', 'Das Zahnrad schiebt die Zahnstange geradeaus.'],
  };
  D.GETRIEBE = GETRIEBE;
  function getriebeErkennen(art, typen, frage) {
    const k = pick(typen), [bild, name, w] = GETRIEBE[k], ch = shuffle([name, ...shuffle(typen.filter((x) => x !== k).map((x) => GETRIEBE[x][1])).slice(0, 3)]);
    return { prompt: frage || 'Welches Getriebe ist das?', figure: D.bilder[bild](), choices: ch, correct: ch.indexOf(name), hint: 'Schau, was die Räder verbindet und wie sich die Bewegung ändert.',
      solution: `Das ist ein <b>${name}</b>. ${w}`, ex: { mode: 'getriebe', art, typ: k, merk: `<b>${name}</b>: ${w}` } };
  }
  U.getriebeErkennen = getriebeErkennen;

  // =====================================================
  // Bereich 4: Maschinen und Getriebe
  // =====================================================
  G.maschine = baue('tc5-maschine', {
    h: 'Eine Maschine hat einen Antrieb (Motor, Wasser, Wind, Muskelkraft über eine Kurbel) und überträgt Bewegung, um Arbeit zu verrichten. Ein Werkzeug führst du selbst mit der Hand.',
    F: [
      { f: 'Was unterscheidet eine <b>Maschine</b> von einem Werkzeug?', a: 'Eine Maschine hat einen eigenen Antrieb.', x: ['Eine Maschine ist immer kleiner.', 'Ein Werkzeug hat immer einen Motor.', 'Es gibt keinen Unterschied.'], w: 'Eine Maschine hat einen Antrieb und überträgt Bewegungen. Ein Werkzeug führt man selbst mit der Hand. Hammer und Feile sind Werkzeuge. Bohrmaschine und Waschmaschine sind Maschinen.' },
      { f: 'Welche Maschine trieb im 18. und 19. Jahrhundert die ersten <b>Fabriken</b> an?', a: 'die Dampfmaschine', x: ['der Elektromotor', 'der Computer', 'das Fahrrad'], w: 'James Watt verbesserte sie ab 1769 entscheidend. Das war der Beginn der Industrialisierung.' },
      { f: 'Welche Maschinen nutzten Menschen schon in der <b>Antike</b>?', a: 'Wasserräder', x: ['Elektromotoren', 'Dampfmaschinen', 'Roboter'], w: 'Wasserräder trieben Mühlen an, lange bevor es Motoren gab.' },
      { f: 'Was ist ein Vorteil von Maschinen für den <b>Menschen</b>?', a: 'Sie nehmen schwere Arbeit ab.', x: ['Sie brauchen keine Energie.', 'Sie machen nie Lärm.', 'Sie verbrauchen keine Rohstoffe.'], w: 'Sie nehmen schwere, gefährliche oder eintönige Arbeit ab. Waschmaschine, Kran oder Bagger sparen viel Mühe.' },
      { f: 'Was ist ein Nachteil von Maschinen für die <b>Umwelt</b>?', a: 'Sie brauchen Energie und Rohstoffe.', x: ['Sie machen die Luft sauberer.', 'Sie wachsen nach.', 'Sie haben keine Nachteile.'], w: 'Sie brauchen Energie und Rohstoffe, manche machen Lärm oder Abgase. Darum lohnt es sich, Maschinen sparsam und lange zu nutzen.' },
      { f: 'Woher bekommt eine Maschine die Energie für ihre Bewegung?', a: 'von ihrem Antrieb', x: ['vom Gehäuse', 'vom Schalter', 'von der Farbe'], w: 'Von ihrem Antrieb, zum Beispiel einem Elektromotor. Antriebe können auch Wind, Wasser, Benzin oder unsere Muskeln sein.' },
    ],
    S: { kats: ['Werkzeug', 'Maschine'], f: (b) => `<b>${b}</b>: Werkzeug oder Maschine?`, h: 'Hat es einen eigenen Antrieb, der Bewegung überträgt?',
      items: [['Hammer', 0], ['Schraubendreher', 0], ['Feile', 0], ['Laubsäge', 0], ['Zange', 0], ['Bohrmaschine', 1], ['Waschmaschine', 1], ['Dekupiersäge', 1], ['Akkuschrauber', 1], ['Nähmaschine', 1], ['Mixer', 1]] },
    O: [{ t: 'Ordne die Antriebe nach ihrer Erfindung: das Älteste zuerst.', items: ['Wasserrad', 'Dampfmaschine', 'Elektromotor', 'Industrieroboter'], w: 'Wasserrad (Antike), Dampfmaschine (18. Jh.), Elektromotor (19. Jh.), Industrieroboter (20. Jh.).' }],
  });

  G.funktion = baue('tc5-funktion', {
    h: 'Antriebselement bringt die Bewegung, Übertragungselement leitet sie weiter, Arbeitselement macht die Arbeit, Steuerelement schaltet und lenkt, Trägerelement hält alles zusammen.',
    B: { svg: 'bohrmaschine', f: (n) => `Bohrmaschine, aufgeschnitten: Welches Funktionselement ist Nummer <b>${n}</b>?`, teile: ['Antriebselement', 'Übertragungselement', 'Arbeitselement', 'Steuerelement', 'Trägerelement'],
      was: { Antriebselement: 'Der Elektromotor bringt die Bewegung.', Übertragungselement: 'Die Zahnräder leiten die Drehung zum Bohrer weiter.', Arbeitselement: 'Der Bohrer macht das Loch.', Steuerelement: 'Mit dem Schalter schaltest du ein und aus.', Trägerelement: 'Das Gehäuse hält alle Teile zusammen.' } },
    F: [
      { f: 'Welches Funktionselement ist ein <b>Elektromotor</b>?', a: 'Antriebselement', x: ['Arbeitselement', 'Steuerelement', 'Trägerelement'], w: 'Er bringt die Bewegung in die Maschine.' },
      { f: 'Welches Funktionselement ist die <b>Fahrradkette</b>?', a: 'Übertragungselement', x: ['Antriebselement', 'Arbeitselement', 'Trägerelement'], w: 'Sie leitet die Bewegung von den Pedalen zum Hinterrad weiter.' },
      { f: 'Welches Funktionselement ist das <b>Messer im Mixer</b>?', a: 'Arbeitselement', x: ['Antriebselement', 'Übertragungselement', 'Steuerelement'], w: 'Es macht die eigentliche Arbeit: zerkleinern.' },
      { f: 'Welches Funktionselement ist ein <b>Schalter</b>?', a: 'Steuerelement', x: ['Arbeitselement', 'Trägerelement', 'Antriebselement'], w: 'Steuerelemente schalten ein und aus oder lenken.' },
      { f: 'Welches Funktionselement ist der <b>Fahrradrahmen</b>?', a: 'Trägerelement', x: ['Übertragungselement', 'Arbeitselement', 'Steuerelement'], w: 'Er trägt und verbindet alle Teile.' },
      { f: 'Wie viele Arten von Funktionselementen unterscheidet man in TC?', a: 'fünf', x: ['zwei', 'drei', 'zehn'], w: 'Antrieb, Übertragung, Arbeit, Steuerung, Träger.' },
    ],
    S: { kats: ['Antrieb', 'Übertragung', 'Arbeit', 'Steuerung', 'Träger'], f: (b) => `<b>${b}</b>: Welches Funktionselement?`, h: 'Bringt es Bewegung, leitet es sie weiter, arbeitet es, steuert es oder trägt es?',
      items: [['Elektromotor', 0], ['Pedale mit Kurbel', 0], ['Handkurbel', 0], ['Kette', 1], ['Zahnräder', 1], ['Riemen', 1], ['Bohrer', 2], ['Sägeblatt', 2], ['Messer im Mixer', 2], ['Schalter', 3], ['Bremse', 3], ['Lenker', 3], ['Gehäuse', 4], ['Fahrradrahmen', 4], ['Gestell', 4]] },
    O: [{ t: 'Verfolge die Bewegung durch die Bohrmaschine: Wo beginnt sie, wo endet sie?', items: ['Schalter drücken (Steuerung)', 'Motor dreht sich (Antrieb)', 'Zahnräder leiten weiter (Übertragung)', 'Bohrer bohrt (Arbeit)'], w: 'Vom Steuern über den Antrieb und die Übertragung zur Arbeit.' }],
    extra: { fahrrad: () => U.beschriften('fahrrad', { svg: 'fahrrad', f: (n) => `Fahrrad: Welches Funktionselement ist Nummer <b>${n}</b>?`, teile: ['Antriebselement', 'Übertragungselement', 'Arbeitselement', 'Steuerelement', 'Trägerelement'],
      was: { Antriebselement: 'Die Pedale mit der Kurbel: Hier bringst du mit deinen Beinen die Bewegung hinein.', Übertragungselement: 'Die Kette leitet die Drehung zum Hinterrad.', Arbeitselement: 'Das Hinterrad bewegt das Fahrrad vorwärts.', Steuerelement: 'Lenker und Bremse steuern die Fahrt.', Trägerelement: 'Der Rahmen trägt alle Teile.' } }) },
  }, { beschriften: 20, fahrrad: 20 });

  G.getriebe = baue('tc5-getriebe', {
    h: 'Getriebe übertragen Bewegung. Sie können schneller oder langsamer machen, die Kraft verstärken, die Drehrichtung umkehren, einen Abstand überbrücken oder aus Drehen ein Schieben machen.',
    F: [
      { f: 'Was ist die Hauptaufgabe eines <b>Getriebes</b>?', a: 'Bewegung übertragen und verändern', x: ['Strom erzeugen', 'die Maschine zusammenhalten', 'die Maschine ein- und ausschalten'], w: 'Bewegung vom Antrieb zum Arbeitselement übertragen und dabei oft verändern. Getriebe gehören zu den Übertragungselementen.' },
      { f: 'Ein Motor dreht sich sehr schnell, aber schwach. Was kann ein Getriebe daraus machen?', a: 'eine langsamere, aber kräftigere Drehung', x: ['eine schnellere und kräftigere Drehung', 'Strom', 'gar nichts'], w: 'Langsamer heißt kräftiger: So schafft ein kleiner Motor schwere Arbeit.' },
      { f: 'Welche Aufgabe hat die Kette am Fahrrad <b>vor allem</b>?', a: 'einen Abstand überbrücken', x: ['die Drehrichtung umkehren', 'aus Drehen Schieben machen', 'das Fahrrad bremsen'], w: 'Den Abstand zwischen Pedalen und Hinterrad überbrücken. Mit der Gangschaltung ändert sie zusätzlich, wie schnell sich das Hinterrad dreht.' },
      { f: 'Der Motor eines Scheibenwischers dreht sich. Was macht der Wischer?', a: 'Er bewegt sich hin und her.', x: ['Er dreht sich im Kreis.', 'Er steht still.', 'Er bewegt sich nur nach oben.'], w: 'Ein Getriebe wandelt hier die Drehbewegung in eine Hin- und Herbewegung um.' },
    ],
    S: { kats: ['Abstand', 'Tempo', 'Drehrichtung', 'Bewegungsart'], f: (b) => `<b>${b}</b><br>Was macht das Getriebe hier vor allem? Überbrückt es einen Abstand, ändert es das Tempo, kehrt es die Drehrichtung um oder ändert es die Bewegungsart?`, h: 'Abstand überbrücken, Tempo ändern (schneller oder langsamer), Drehrichtung umkehren oder Bewegungsart ändern (aus Drehen wird Schieben).',
      items: [['Die Fahrradkette bringt die Kraft von den Pedalen zum Hinterrad.', 0], ['Der Riemen in der Waschmaschine verbindet Motor und Trommel.', 0], ['Die Gangschaltung am Fahrrad', 1], ['Die Zahnräder im Akkuschrauber machen die schnelle Motordrehung langsam und kräftig.', 1], ['Ein gekreuzter Riemen', 2], ['Ein Zwischenzahnrad, damit beide Räder gleich herum laufen', 2], ['Die Nähmaschinennadel geht auf und ab.', 3], ['Die Zahnstange der Tischbohrmaschine senkt den Bohrer.', 3], ['Der Kolben einer Dampflok bewegt die Räder.', 3]] },
    A: { w: ['Getriebe sind Übertragungselemente.', 'Ein Getriebe kann eine Drehung kräftiger machen.'], f: ['Getriebe erzeugen Energie.', 'Ein Getriebe ist immer ein Antriebselement.'] },
  });

  G.zugmittel = baue('tc5-zugmittel', {
    h: 'Zugmittelgetriebe verbinden zwei Räder auf Abstand mit einem Riemen oder einer Kette. Beide Räder drehen in dieselbe Richtung, außer der Riemen ist gekreuzt.',
    F: [
      { f: 'Was verbindet die beiden Räder bei einem <b>Zugmittelgetriebe</b>?', a: 'ein Riemen oder eine Kette', x: ['nur Zahnräder, die sich berühren', 'eine Schraube', 'ein Kabel mit Strom'], w: 'Riemen und Kette werden gezogen, daher der Name Zugmittel.' },
      { f: 'Was ist ein Vorteil der <b>Kette</b> gegenüber dem Riemen?', a: 'Sie rutscht nicht durch.', x: ['Sie ist leiser.', 'Sie muss nie geölt werden.', 'Sie kehrt die Drehrichtung um.'], w: 'Darum treiben Ketten Fahrräder und Motorräder an.' },
      { f: 'Was ist ein Vorteil des <b>Riemens</b>?', a: 'Er läuft leise.', x: ['Er rutscht nie.', 'Er braucht keine Scheiben.', 'Er hält ewig.'], w: 'Er läuft leise und rutscht bei zu großer Last durch, das schützt die Maschine. Riemen stecken zum Beispiel in Waschmaschinen und Nähmaschinen.' },
      { f: 'Wie drehen sich zwei Scheiben mit einem <b>gekreuzten</b> Riemen?', a: 'gegeneinander', x: ['in dieselbe Richtung', 'gar nicht', 'abwechselnd'], w: 'In entgegengesetzte Richtungen. Durch das Kreuzen wird die Drehrichtung umgekehrt.' },
      { f: 'Wie drehen sich die Kettenräder vorn und hinten am <b>Fahrrad</b>?', a: 'in dieselbe Richtung', x: ['in entgegengesetzte Richtungen', 'das hintere steht still', 'abwechselnd'], w: 'Eine Kette (wie ein offener Riemen) nimmt das zweite Rad in dieselbe Richtung mit.' },
    ],
    T: [{ f: 'Riemen und Kette nennt man ___.', a: ['Zugmittel', 'Zugmittelgetriebe'], w: 'Sie übertragen die Bewegung durch Ziehen.' }],
    extra: { riemenRichtung: () => U.riemenRichtung('riemenRichtung'), erkennen: () => getriebeErkennen('erkennen', ['offen', 'gekreuzt', 'kette', 'zahnrad', 'reibrad']) },
  }, { riemenRichtung: 30, erkennen: 22 });

  G.raeder = baue('tc5-raeder', {
    h: 'Bei Rädergetrieben berühren sich die Räder direkt. Zahnräder greifen ineinander, Reibräder nehmen sich durch Reibung mit. Benachbarte Räder drehen sich gegeneinander.',
    F: [
      { f: 'Wie drehen sich zwei Zahnräder, die <b>ineinandergreifen</b>?', a: 'gegeneinander', x: ['in dieselbe Richtung', 'gar nicht', 'immer gleich schnell'], w: 'Der Zahn des einen Rads schiebt das andere in die Gegenrichtung.' },
      { f: 'Rad 1 treibt Rad 2, Rad 2 treibt Rad 3. Wie dreht sich Rad 3 im Vergleich zu Rad 1?', a: 'in dieselbe Richtung', x: ['in die Gegenrichtung', 'gar nicht', 'abwechselnd'], w: 'Zweimal umkehren ergibt wieder die alte Richtung. Rad 2 heißt Zwischenrad.' },
      { f: 'Was ist ein Nachteil von <b>Reibrädern</b>?', a: 'Sie können durchrutschen.', x: ['Sie sind immer laut.', 'Sie drehen in dieselbe Richtung.', 'Sie brauchen eine Kette.'], w: 'Sie können bei großer Last durchrutschen. Dafür sind sie einfach und leise. Zahnräder rutschen nicht.' },
      { f: 'Wozu dienen <b>Kegelräder</b> (schräg verzahnte Räder), zum Beispiel im Handbohrer?', a: 'Sie lenken die Drehung um.', x: ['Sie machen aus Drehen Schieben.', 'Sie bremsen.', 'Sie erzeugen Strom.'], w: 'Sie lenken die Drehung um die Ecke, meist um 90 Grad. Auch Schneebesen mit Kurbel funktionieren so.' },
      { f: 'Warum rutschen Zahnräder <b>nicht</b> durch?', a: 'Die Zähne greifen fest ineinander.', x: ['Sie sind mit Gummi beschichtet.', 'Sie drehen sehr langsam.', 'Sie sind geölt.'], w: 'Darum nimmt man Zahnräder dort, wo es genau sein muss, zum Beispiel in Uhren.' },
    ],
    T: [{ f: 'Ein Rad zwischen zwei anderen, das nur die Richtung angleicht, heißt ___.', a: ['Zwischenrad', 'Zwischenzahnrad'], w: 'Mit ihm drehen sich erstes und letztes Rad gleich herum.' }],
    extra: { richtung: () => U.zahnradRichtung('richtung') },
  }, { richtung: 50 });

  G.uebersetzung = baue('tc5-uebersetzung', {
    h: 'Großes Rad treibt kleines: Das kleine dreht sich schneller (ins Schnelle). Kleines treibt großes: Das große dreht sich langsamer, aber kräftiger (ins Langsame). Umdrehungen von B = Umdrehungen von A · Zähne von A : Zähne von B.',
    F: [
      { f: 'Ein großes Zahnrad (40 Zähne) treibt ein kleines (10 Zähne). Wie oft dreht sich das kleine bei <b>einer</b> Umdrehung des großen?', a: '4-mal', x: ['1-mal', '10-mal', 'eine Viertel Umdrehung'], w: '40 Zähne wandern vorbei, das kleine braucht 10 für eine Runde: 40 : 10 = 4.' },
      { f: 'Am Fahrrad geht es steil bergauf. Welchen Gang wählst du?', a: 'vorn klein, hinten groß', x: ['vorn groß, hinten klein', 'vorn groß, hinten groß', 'egal'], w: 'Vorn ein kleines Kettenblatt, hinten ein großes Ritzel. So drehst du die Pedale leichter, das Rad dreht sich aber langsamer.' },
      { f: 'Was bedeutet „Übersetzung <b>ins Langsame</b>“?', a: 'Das zweite Rad dreht langsamer.', x: ['Das angetriebene Rad dreht sich schneller.', 'Beide Räder stehen still.', 'Die Räder drehen sich gleich schnell.'], w: 'Das angetriebene Rad dreht sich langsamer, dafür kräftiger. Das braucht man, wenn viel Kraft nötig ist, zum Beispiel beim Kran.' },
      { f: 'Zwei Zahnräder haben <b>gleich viele</b> Zähne. Was passiert?', a: 'Beide drehen gleich schnell.', x: ['Das zweite dreht sich doppelt so schnell.', 'Das zweite dreht sich gar nicht.', 'Beide drehen in dieselbe Richtung.'], w: 'Beide drehen sich gleich schnell, aber in entgegengesetzte Richtungen. Die Übersetzung ist dann 1 : 1.' },
      { f: 'Warum braucht man für eine Übersetzung ins Schnelle <b>mehr Kraft</b> am Antrieb?', a: 'Schneller heißt schwächer.', x: ['Weil das kleine Rad bremst.', 'Weil Zahnräder schwer sind.', 'Das stimmt nicht.'], w: 'Was man an Geschwindigkeit gewinnt, muss man an Kraft hergeben. Man bekommt nichts geschenkt: schneller heißt schwächer, langsamer heißt kräftiger.' },
    ],
    extra: { uebersetzung: () => U.zahnradUebersetzung('uebersetzung') },
  }, { uebersetzung: 70 });

  G.umformung = baue('tc5-umformung', {
    h: 'Kurbel mit Schubstange: Drehen wird Hin und Her. Nocken: Drehen wird Heben und Senken. Zahnrad mit Zahnstange: Drehen wird Schieben in einer Geraden.',
    F: [
      { f: 'Was macht eine <b>Kurbel mit Schubstange</b>?', a: 'Aus Drehen wird Hin und Her.', x: ['Sie macht eine Drehung schneller.', 'Sie kehrt die Drehrichtung um.', 'Sie erzeugt Strom.'], w: 'Sie wandelt eine Drehbewegung in eine Hin- und Herbewegung um (oder umgekehrt). So treibt der Kolben einer Dampflok die Räder an, und im Motor bewegen die Kolben die Kurbelwelle.' },
      { f: 'Was macht ein <b>Nocken</b> (eine unrunde Scheibe)?', a: 'Er hebt einen Stößel an.', x: ['Er dreht sich nicht.', 'Er überträgt die Drehung mit einer Kette.', 'Er macht die Drehung gleichmäßig.'], w: 'Er hebt einen Stößel bei jeder Umdrehung an und lässt ihn wieder sinken. Im Automotor öffnen Nocken die Ventile.' },
      { f: 'Wo steckt ein <b>Zahnrad mit Zahnstange</b>?', a: 'in der Lenkung eines Autos', x: ['in der Fahrradkette', 'im Gehäuse eines Handys', 'in einer Glühlampe'], w: 'Das Drehen am Lenkrad schiebt die Zahnstange nach links oder rechts. Auch der Hebel an der Tischbohrmaschine senkt den Bohrer so.' },
      { f: 'Wie bewegt sich die Nadel einer <b>Nähmaschine</b>, obwohl der Motor sich dreht?', a: 'auf und ab', x: ['im Kreis', 'gar nicht', 'nach links und rechts'], w: 'Auf und ab, über eine Kurbel. Eine kleine Kurbel macht aus der Drehung das Auf und Ab der Nadel.' },
      { f: 'Wie macht eine <b>Schraubzwinge</b> aus Drehen ein Schieben?', a: 'mit einem Gewinde', x: ['mit einer Kette', 'mit einem Riemen', 'mit einem Motor'], w: 'Mit einem Gewinde: Beim Drehen wandert die Spindel vorwärts. Auch der Schraubstock arbeitet mit einer Gewindespindel.' },
    ],
    S: { kats: ['Kurbel', 'Nocken', 'Zahnstange', 'Gewinde'], f: (b) => `<b>${b}</b>: Was macht hier aus Drehen ein Schieben? Kurbel mit Schubstange, Nocken, Zahnrad mit Zahnstange oder Gewinde?`, h: 'Hin und her: Kurbel. Heben durch eine unrunde Scheibe: Nocken. Geradeaus durch Zähne: Zahnstange. Durch eine Schraube: Gewinde.',
      items: [['Dampflok: Kolben treibt die Räder an', 0], ['Stichsäge: Sägeblatt geht auf und ab', 0], ['Nähmaschinennadel', 0], ['Ventile im Automotor', 1], ['Spieluhr: Stifte heben Metallzungen an', 1], ['Lenkung im Auto', 2], ['Zahnradbahn auf den Berg', 2], ['Hebel an der Tischbohrmaschine', 2], ['Schraubzwinge', 3], ['Schraubstock', 3]] },
    extra: { erkennen: () => getriebeErkennen('erkennen', ['kurbel', 'nocken', 'zahnstange'], 'Was wandelt hier die Drehbewegung um?') },
  }, { erkennen: 26 });

  // Sinnbilder (vereinfachte Zeichnungen)
  const SINN = [['sinnRiemen', 'Riemengetriebe', 'Zwei Kreise, verbunden durch zwei Linien außen.'], ['sinnGekreuzt', 'gekreuzter Riemen', 'Die Linien kreuzen sich zwischen den Scheiben.'], ['sinnZahnrad', 'Zahnradgetriebe', 'Zwei Kreise, die sich berühren.'], ['sinnZahnstange', 'Zahnrad und Zahnstange', 'Ein Kreis auf einer geraden Linie.'], ['sinnKurbel', 'Kurbel mit Schubstange', 'Zwei Stangen mit Gelenken und ein Klotz, der hin und her gleitet.']];
  G.sinnbild = baue('tc5-sinnbild', {
    h: 'Ein Sinnbild zeigt ein Getriebe ganz vereinfacht: Räder als Kreise, Riemen als Linien, Gelenke als kleine Kreise. Man lässt alles weg, was nicht wichtig ist.',
    E: { f: 'Welches Getriebe zeigt dieses <b>Sinnbild</b>?', arten: SINN },
    F: [
      { f: 'Was ist ein <b>Sinnbild</b> eines Getriebes?', a: 'eine vereinfachte Zeichnung', x: ['ein Foto des Getriebes', 'eine genaue Zeichnung mit allen Zähnen', 'ein Bild, das ein Künstler gemalt hat'], w: 'Eine vereinfachte Zeichnung, die nur das Wichtige zeigt. So versteht man auf einen Blick, wie die Bewegung übertragen wird.' },
      { f: 'Warum zeichnet man Getriebe <b>vereinfacht</b>?', a: 'damit man es schneller versteht', x: ['weil man Zahnräder nicht zeichnen kann', 'weil es hübscher aussieht', 'weil es Pflicht im Kunstunterricht ist'], w: 'Weil man so schnell sieht, wie die Bewegung übertragen wird. Zähne, Schrauben und Gehäuse lässt man weg.' },
      { f: 'Wie zeichnet man im Sinnbild ein <b>Rad</b>?', a: 'als Kreis', x: ['als Dreieck', 'als Wellenlinie', 'gar nicht'], w: 'Der kleine Kreis in der Mitte zeigt die Achse.' },
      { f: 'Woran erkennst du im Sinnbild einen <b>gekreuzten</b> Riemen?', a: 'Die Linien kreuzen sich.', x: ['Die Kreise berühren sich.', 'Es gibt nur einen Kreis.', 'Die Linien sind gestrichelt.'], w: 'Die beiden Linien kreuzen sich zwischen den Kreisen. Das zweite Rad dreht dann andersherum.' },
    ],
  }, { erkennen: 40 });

  G.konstruieren = baue('tc5-konstruieren', {
    h: 'Problem verstehen, Ideen sammeln, Skizze zeichnen, bauen, ausprobieren, verbessern. Black-Box-Methode: nur schauen, was hineingeht und was herauskommt.',
    O: [
      { t: 'Bring die Schritte beim <b>Konstruieren</b> in die richtige Reihenfolge.', items: ['Problem erkennen: Was soll das Ding können?', 'Ideen im Team sammeln', 'Ideenskizze zeichnen', 'Modell bauen', 'Modell ausprobieren', 'bewerten und verbessern'], n: 5, w: 'Erst denken und planen, dann bauen, dann testen und verbessern.' },
    ],
    F: [
      { f: 'Was macht man bei der <b>Black-Box-Methode</b>?', a: 'Man prüft nur Eingang und Ausgang.', x: ['Man malt alles schwarz an.', 'Man baut das Gerät in eine Kiste ein.', 'Man arbeitet im Dunkeln.'], w: 'Man untersucht nur, was hineingeht und was herauskommt, ohne ins Innere zu schauen. Zum Beispiel: Kurbel einmal drehen, das Seil kommt 10 cm hoch. Wie es innen aussieht, ist erst einmal egal.' },
      { f: 'Was ist die <b>Variationsmethode</b>?', a: 'eine bekannte Lösung abwandeln', x: ['alles dem Zufall überlassen', 'immer dieselbe Lösung nehmen', 'eine Lösung abschreiben'], w: 'Eine bekannte Lösung abwandeln und vergleichen, was besser klappt. Zum Beispiel ein größeres Zahnrad einsetzen und schauen, was sich ändert.' },
      { f: 'Was ist eine <b>Ideenskizze</b>?', a: 'eine schnelle Freihandzeichnung', x: ['eine fertige technische Zeichnung', 'ein Foto des Modells', 'eine Stückliste'], w: 'Eine schnelle Zeichnung aus freier Hand, die eine Idee zeigt. Sie muss nicht schön sein, nur verständlich.' },
      { f: 'Warum <b>erprobt</b> man ein Modell?', a: 'um zu sehen, ob es funktioniert', x: ['damit es kaputt geht', 'weil es Spaß macht, sonst nichts', 'um es zu verkaufen'], w: 'Um zu sehen, ob es funktioniert und was man verbessern kann. Fehler beim Erproben sind wertvoll: Sie zeigen, was besser werden muss.' },
      { f: 'Womit kann man in der Schule Getriebe-Modelle <b>bauen</b>?', a: 'mit Baukästen', x: ['nur mit Ton', 'nur mit Papier', 'gar nicht'], w: 'Mit Baukästen oder am Computer mit einem Programm. Baukästen haben Zahnräder, Achsen und Riemen. Programme zeigen, wie sich alles bewegt.' },
      { f: 'Wozu vergleicht man sein Modell mit Lösungen aus der <b>Industrie</b>?', a: 'um zu lernen, wie Fachleute dasselbe Problem gelöst haben', x: ['um sie zu kopieren und zu verkaufen', 'um zu zeigen, dass das eigene Modell besser ist', 'das macht man nicht'], w: 'Oft sieht man dann neue Ideen für die eigene Lösung.' },
    ],
    T: [{ f: 'Untersucht man nur Eingang und Ausgang eines Geräts, nutzt man die ___-Methode.', a: ['Black-Box', 'Blackbox', 'Black Box'], w: 'Englisch für „schwarzer Kasten“: Was innen ist, sieht man nicht.' }],
  }, { ordnen: 30 });

  G.modelle = baue('tc5-modelle', {
    h: 'Schau auf die Bewegung: Abstand überbrückt? Kette oder Riemen. Langsam und kräftig? Zahnräder ins Langsame. Hin und her? Kurbel. Geradeaus geschoben? Zahnstange oder Gewinde.',
    F: [
      { f: 'Ein Kran soll schwere Lasten <b>langsam und kräftig</b> heben. Was passt in die Seilwinde?', a: 'ein kleines Zahnrad, das ein großes antreibt', x: ['ein großes Zahnrad, das ein kleines antreibt', 'ein gekreuzter Riemen', 'ein Nocken'], w: 'Übersetzung ins Langsame: Die Trommel dreht sich langsam, aber mit viel Kraft.' },
      { f: 'Wie kommt die Drehung des Motors in der <b>Bohrmaschine</b> zum Bohrer?', a: 'über Zahnräder', x: ['über eine Kette', 'über einen Nocken', 'über eine Zahnstange'], w: 'Über Zahnräder, die sie langsamer und kräftiger machen. Der Motor ist sehr schnell. Der Bohrer braucht mehr Kraft.' },
      { f: 'Womit bewegt der Motor einer alten <b>Nähmaschine</b> das Handrad?', a: 'mit einem Riemen', x: ['mit einer Zahnstange', 'mit einem Nocken', 'gar nicht'], w: 'Innen macht dann eine Kurbel aus der Drehung das Auf und Ab der Nadel.' },
      { f: 'Eine <b>Schrottpresse</b> soll eine Platte langsam und mit großer Kraft vorwärtsschieben. Was eignet sich?', a: 'eine Gewindespindel', x: ['ein offener Riemen allein', 'ein gekreuzter Riemen', 'ein Reibrad'], w: 'Gewindespindel oder Zahnrad mit Zahnstange. Beide machen aus der Drehung ein kräftiges Schieben.' },
      { f: 'Was steckt in einer mechanischen <b>Uhr</b>?', a: 'viele Zahnräder', x: ['eine Fahrradkette', 'ein Nocken mit Stößel', 'ein Reibrad aus Gummi'], w: 'Zahnräder rutschen nicht. So bleibt die Uhr genau.' },
      { f: 'Wie dreht ein <b>Handbohrer</b> die Bewegung der Kurbel um die Ecke?', a: 'mit Kegelrädern', x: ['mit einer Kette', 'mit einem Riemen', 'mit einem Nocken'], w: 'Kegelräder sind schräg verzahnt und lenken die Drehung um 90 Grad um.' },
    ],
    S: { kats: ['Kette', 'Zahnräder', 'Kurbel', 'Zahnstange'], f: (b) => `<b>${b}</b>: Welches Getriebe steckt darin? (Kurbel = Kurbel mit Schubstange, Zahnstange = Zahnrad mit Zahnstange)`, h: 'Abstand, langsamer, hin und her oder geradeaus?',
      items: [['Fahrrad', 0], ['Motorrad', 0], ['mechanische Uhr', 1], ['Handbohrer', 1], ['Akkuschrauber', 1], ['Stichsäge', 2], ['Dampflok', 2], ['Lenkung im Auto', 3], ['Zahnradbahn', 3], ['Tischbohrmaschine: Bohrer senken', 3]] },
  });

  // =====================================================
  // Bereich 5: Planen wie in der Werkstatt
  // =====================================================
  const LINIEN = [['breit', 'breite Volllinie', 'sichtbare Kanten und Umrisse'], ['schmal', 'schmale Volllinie', 'Maßlinien und Maßhilfslinien'], ['strich', 'Strichlinie', 'verdeckte (unsichtbare) Kanten'], ['strichpunkt', 'Strich-Punkt-Linie', 'Mittellinien und Symmetrieachsen']];
  D.LINIEN = LINIEN;
  function linieErkennen(art) {
    const k = R(0, 3), [id, name, zweck] = LINIEN[k], typ = R(0, 2), ex = { mode: 'linien', art, hell: id };
    if (typ === 0) {
      const ch = LINIEN.map((l) => l[1]);
      return { prompt: 'Welche <b>Linienart</b> ist rot gezeichnet?', figure: D.zeichne.linien(id), choices: ch, correct: k, hint: 'Durchgehend oder unterbrochen? Dick oder dünn? Mit Punkten?',
        solution: `Das ist eine <b>${name}</b>. Sie zeigt ${zweck}.`, ex };
    }
    if (typ === 1) {
      const ch = LINIEN.map((l) => l[2]);
      return { prompt: 'Was zeigt die <b>rote</b> Linie in dieser Zeichnung?', figure: D.zeichne.linien(id), choices: ch, correct: k, hint: 'Breit und durchgehend: sichtbar. Gestrichelt: verdeckt. Strich-Punkt: Mitte. Schmal: Maße.',
        solution: `Die rote ${name} zeigt <b>${zweck}</b>.`, ex };
    }
    const L = ['A', 'B', 'C', 'D'];
    return { prompt: `Mit welcher Linie zeichnet man <b>${zweck}</b>?`, figure: D.bilder.linienMuster(), choices: L.slice(), correct: k, hint: 'Breit und durchgehend: sichtbar. Gestrichelt: verdeckt. Strich-Punkt: Mitte. Schmal: Maße.',
      solution: `Mit der <b>${name}</b> (${L[k]}).`, ex };
  }
  G.linien = baue('tc5-linien', {
    h: 'Breite Volllinie: sichtbare Kanten. Schmale Volllinie: Maßlinien. Strichlinie: verdeckte Kanten. Strich-Punkt-Linie: Mittellinien.',
    F: [
      { f: 'Mit welcher Linie zeichnet man <b>sichtbare Kanten</b>?', a: 'breite Volllinie', x: ['Strichlinie', 'Strich-Punkt-Linie', 'schmale Volllinie'], w: 'Sie fällt am meisten auf, denn die Form des Werkstücks ist das Wichtigste.' },
      { f: 'Wofür steht eine <b>Strichlinie</b> (gestrichelt)?', a: 'für verdeckte Kanten', x: ['für Maße', 'für die Mitte eines Lochs', 'für sichtbare Kanten'], w: 'Für verdeckte Kanten, die man von hier aus nicht sieht. Zum Beispiel ein Loch, das in der Seitenansicht im Inneren liegt.' },
      { f: 'Wofür steht eine <b>Strich-Punkt-Linie</b>?', a: 'für Mittellinien', x: ['für verdeckte Kanten', 'für sichtbare Kanten', 'für Maßlinien'], w: 'Für Mittellinien und Symmetrieachsen. Durch die Mitte jedes Lochs zeichnet man ein Kreuz aus Strich-Punkt-Linien.' },
      { f: 'Mit welcher Linie zeichnet man <b>Maßlinien</b>?', a: 'schmale Volllinie', x: ['breite Volllinie', 'Strichlinie', 'Strich-Punkt-Linie'], w: 'Maße sollen nicht vom Werkstück ablenken, darum sind die Linien dünn.' },
      { f: 'Warum gibt es in technischen Zeichnungen <b>verschiedene</b> Linienarten?', a: 'damit man ihre Bedeutung erkennt', x: ['damit die Zeichnung bunter wird', 'weil die Stifte unterschiedlich sind', 'das ist reiner Zufall'], w: 'Damit jeder sofort sieht, was eine Linie bedeutet. Die Regeln sind genormt und gelten überall gleich.' },
    ],
    extra: { linie: () => linieErkennen('linie') },
  }, { linie: 60 });

  G.bemassung = baue('tc5-bemassung', {
    h: 'Maße stehen in Millimetern ohne Einheit über der Maßlinie, lesbar von unten oder von rechts. ⌀ heißt Durchmesser. Maße zu Löchern gehen bis zur Mittellinie.',
    B: { svg: 'massTeile', teile: ['Maßlinie', 'Maßhilfslinie', 'Maßpfeil', 'Maßzahl', 'Körperkante', 'Mittellinie'],
      was: { Maßlinie: 'Schmale Linie mit Pfeilen. Sie zeigt, welche Strecke gemessen ist.', Maßhilfslinie: 'Sie führt von der Kante weg und ragt etwa 2 mm über die Maßlinie hinaus.', Maßpfeil: 'Schmale, gefüllte Spitze am Ende der Maßlinie.', Maßzahl: 'Das Maß in mm. Sie steht über der Maßlinie.', Körperkante: 'Breite Volllinie: der Umriss des Werkstücks.', Mittellinie: 'Strich-Punkt-Linie durch die Mitte des Lochs.' } },
    F: [
      { f: 'In welcher Einheit stehen Maße in technischen Zeichnungen, wenn keine Einheit dabeisteht?', a: 'in Millimetern', x: ['in Zentimetern', 'in Metern', 'in Zoll'], w: 'Darum schreibt man nur „120“ statt „120 mm“.' },
      { f: 'Wo steht die <b>Maßzahl</b>?', a: 'über der Maßlinie', x: ['unter der Maßlinie, auf dem Kopf', 'irgendwo auf dem Blatt', 'in der Stückliste'], w: 'Über der Maßlinie, lesbar von unten oder von rechts. Senkrechte Maße liest man, wenn man das Blatt nach rechts dreht.' },
      { f: 'Was bedeutet das Zeichen <b>⌀</b> vor einer Zahl?', a: 'Durchmesser', x: ['Radius', 'Dicke', 'ungefähr'], w: '⌀ 10 heißt: Das Loch ist 10 mm breit. Ein R vor der Zahl heißt Radius.' },
      { f: 'Wie weit ragen <b>Maßhilfslinien</b> über die Maßlinie hinaus?', a: 'etwa 2 mm', x: ['gar nicht', 'etwa 2 cm', 'bis zum Blattrand'], w: 'So sieht man genau, wo die Maßlinie endet.' },
      { f: 'Wie oft schreibt man ein Maß in eine Zeichnung?', a: 'nur einmal', x: ['zweimal, sicher ist sicher', 'in jede Ansicht', 'gar nicht'], w: 'Doppelte Maße führen zu Fehlern, wenn eines geändert wird und das andere nicht.' },
    ],
    extra: { lesen: () => U.bemassungLesen('lesen') },
  }, { lesen: 50, beschriften: 22 });

  G.ansichten = baue('tc5-ansichten', {
    h: 'Vorderansicht: Blick von vorn. Draufsicht: Blick von oben, sie steht unter der Vorderansicht. Seitenansicht von links: Blick von links, sie steht rechts neben der Vorderansicht.',
    F: [
      { f: 'Welche Ansicht zeichnet man als <b>erste und wichtigste</b>?', a: 'die Vorderansicht', x: ['die Draufsicht', 'die Seitenansicht von links', 'die Rückansicht'], w: 'Man wählt als Vorderansicht die Seite, die am meisten über die Form verrät.' },
      { f: 'Wo steht die <b>Draufsicht</b> auf dem Blatt?', a: 'unter der Vorderansicht', x: ['über der Vorderansicht', 'links neben der Vorderansicht', 'auf der Rückseite'], w: 'So ist es in Europa genormt.' },
      { f: 'Wo steht die <b>Seitenansicht von links</b>?', a: 'rechts neben der Vorderansicht', x: ['links neben der Vorderansicht', 'unter der Draufsicht', 'über der Vorderansicht'], w: 'Das klingt verdreht, ist aber so genormt: Man klappt sie nach rechts.' },
      { f: 'Wie heißt die Ansicht, bei der man <b>von oben</b> auf das Werkstück schaut?', a: 'Draufsicht', x: ['Vorderansicht', 'Seitenansicht', 'Untersicht'], w: 'Man sieht dann die Länge und die Tiefe.' },
      { f: 'Warum zeichnet man ein Werkstück in <b>mehreren</b> Ansichten?', a: 'Eine Ansicht zeigt nur zwei Maße.', x: ['damit die Zeichnung voller wird', 'weil eine Ansicht verboten ist', 'damit man mehr Farben braucht'], w: 'Eine Ansicht zeigt nur zwei Richtungen, für die dritte braucht man eine weitere. Vorderansicht: Länge und Höhe. Draufsicht: Länge und Tiefe. Seitenansicht: Tiefe und Höhe.' },
    ],
    extra: { finden: () => U.ansichtFinden('finden') },
  }, { finden: 70 });

  G.stueckliste = baue('tc5-stueckliste', {
    h: 'In der Stückliste stehen alle Teile: Position, Menge, Benennung, Werkstoff, Maße. In der Kostenaufstellung gilt: Preis = Menge · Einzelpreis.',
    F: [
      { f: 'Was steht in einer <b>Stückliste</b>?', a: 'alle Teile mit Menge und Maßen', x: ['die Reihenfolge der Arbeitsschritte', 'die Namen aller Schüler', 'nur die Preise'], w: 'Alle Teile eines Werkstücks mit Menge, Werkstoff und Maßen. Die Reihenfolge der Schritte steht im Arbeitsablaufplan.' },
      { f: 'Wozu braucht man eine Stückliste?', a: 'um nichts zu vergessen', x: ['um das Werkstück zu bemalen', 'nur für die Note', 'um die Maschine einzuschalten'], w: 'Um das Material zu besorgen, die Kosten zu berechnen und nichts zu vergessen. Sie ist ein Teil der Fertigungsunterlagen.' },
      { f: 'In welcher Reihenfolge schreibt man die Maße eines Bretts?', a: 'Länge × Breite × Dicke', x: ['Dicke × Länge × Breite', 'Breite × Dicke × Länge', 'egal'], w: '120 × 80 × 18 heißt: 120 mm lang, 80 mm breit, 18 mm dick.' },
      { f: 'Was bedeutet „Pos.“ in der Stückliste?', a: 'Position', x: ['Preis ohne Steuer', 'positiv', 'Postleitzahl'], w: 'Position: die laufende Nummer des Teils. Mit der Nummer findet man das Teil auch in der Zeichnung wieder.' },
      { f: 'Wie rechnet man den Preis einer Zeile in der <b>Kostenaufstellung</b>?', a: 'Menge mal Einzelpreis', x: ['Menge plus Einzelpreis', 'Einzelpreis geteilt durch Menge', 'Menge minus Einzelpreis'], w: '4 Schrauben zu je 0,10 € kosten 4 · 0,10 € = 0,40 €.' },
    ],
    extra: { lesen: () => U.stuecklisteLesen('lesen'), kosten: () => U.kostenRechnen('kosten') },
  }, { lesen: 40, kosten: 34 });

  // Arbeitsablaufpläne (Beispiele aus dem Lehrplan: Leuchter, Schutzbacken, Kissenhülle, Zinnfigur)
  const ABLAUF = [
    { name: 'Leuchter (Holz)', s: ['Maße von der Bezugskante aus anreißen', 'Grundplatte mit der Säge zuschneiden', 'Kanten feilen und schleifen', 'Loch für die Säule bohren', 'Säule einleimen', 'Oberfläche ölen'], w: 'Anreißen, trennen, glätten, bohren, fügen, zum Schluss die Oberfläche.' },
    { name: 'Schutzbacken (Kunststoff)', s: ['Maße und Biegelinie anreißen', 'Acrylglas zuschneiden', 'Kanten feilen', 'entlang der Biegelinie erwärmen', 'im rechten Winkel abkanten und abkühlen lassen', 'Magnetstreifen aufkleben'], w: 'Erst anreißen und zuschneiden, dann erwärmen und umformen, zuletzt fügen.' },
    { name: 'Kissenhülle (Stoff)', s: ['Schnittteile auf den Stoff zeichnen', 'Stoff zuschneiden', 'Teile mit Stecknadeln feststecken', 'Nähte mit der Nähmaschine nähen', 'Hülle wenden', 'Nähte bügeln'], w: 'Zeichnen, zuschneiden, feststecken, nähen, wenden, bügeln.' },
    { name: 'Zinnfigur (Metall)', s: ['Form zusammenklemmen', 'Zinn schmelzen', 'flüssiges Zinn in die Form gießen', 'abkühlen lassen', 'Form öffnen, Figur herausnehmen', 'Gussgrat abfeilen'], w: 'Form schließen, schmelzen, gießen, abkühlen, entformen, entgraten.' },
  ];
  D.ABLAUF = ABLAUF;
  G.ablaufplan = baue('tc5-ablaufplan', {
    h: 'Der Arbeitsablaufplan legt die Reihenfolge fest: erst messen und anreißen, dann trennen, dann bearbeiten und fügen, zum Schluss die Oberfläche.',
    O: ABLAUF.map((a) => ({ t: `Arbeitsablaufplan <b>${a.name}</b>: Bring die Schritte in die richtige Reihenfolge.`, items: a.s, n: 4, w: a.w })),
    F: [
      { f: 'Was legt ein <b>Arbeitsablaufplan</b> fest?', a: 'die Reihenfolge der Schritte', x: ['nur die Materialkosten', 'die Farbe des Werkstücks', 'wer die beste Note bekommt'], w: 'Die Reihenfolge der Arbeitsschritte mit Werkzeugen, Hilfsmitteln und Zeit. Er hilft, sicher und ohne Umwege zu arbeiten.' },
      { f: 'Was kommt fast immer <b>zuerst</b>?', a: 'messen und anreißen', x: ['lackieren', 'kleben', 'schleifen'], w: 'Ohne Anriss weiß man nicht, wo man sägen oder bohren soll.' },
      { f: 'Was kommt meist <b>ganz zum Schluss</b>?', a: 'die Oberfläche ölen', x: ['anreißen', 'zuschneiden', 'Material besorgen'], w: 'Die Oberfläche behandeln, zum Beispiel ölen oder lackieren. Sonst würde die Oberfläche beim Bearbeiten wieder beschädigt.' },
      { f: 'Warum lohnt es sich, die <b>Zeit</b> für jeden Schritt zu planen?', a: 'damit man rechtzeitig fertig wird', x: ['damit die Säge schneller schneidet', 'weil die Lehrkraft es so schön findet', 'damit man Pausen streichen kann'], w: 'So merkt man früh, wenn man zu langsam ist.' },
      { f: 'Womit legt man einen Arbeitsablaufplan gern als <b>Tabelle</b> an?', a: 'mit einer Textverarbeitung', x: ['mit der Laubsäge', 'mit dem Lötkolben', 'mit dem Taschenrechner'], w: 'Mit einer Textverarbeitung am Computer. Spalten: Nr., Arbeitsschritt, Werkzeug oder Maschine, Hilfsmittel, Zeit.' },
    ],
    S: { kats: ['Arbeitsschritt', 'Werkzeug, Maschine', 'Hilfsmittel'], f: (b) => `<b>${b}</b>: In welche Spalte des Ablaufplans gehört das?`, h: 'Ein Arbeitsschritt ist eine Tätigkeit. Werkzeuge bearbeiten das Material. Hilfs- und Prüfmittel halten fest oder messen.',
      items: [['Brett zuschneiden', 0], ['Loch bohren', 0], ['Kanten schleifen', 0], ['Laubsäge', 1], ['Tischbohrmaschine', 1], ['Feile', 1], ['Anschlagwinkel', 2], ['Schraubzwinge', 2], ['Stahlmaßstab', 2]] },
  }, { ordnen: 44 });

  G.messen = baue('tc5-messen', {
    h: 'Alle Maße von einer geraden Bezugskante aus messen. Anreißen heißt Maße auf dem Werkstück markieren: auf Holz mit Bleistift, auf Metall mit der Reißnadel. Der Anschlagwinkel hilft beim rechten Winkel.',
    F: [
      { f: 'Was ist die <b>Bezugskante</b>?', a: 'die Kante, von der aus man misst', x: ['die Kante, die man zuletzt sägt', 'eine Linie in der Mitte', 'die rauste Kante'], w: 'Eine gerade Kante, von der aus man alle Maße misst. Misst man alles von derselben Kante aus, summieren sich kleine Fehler nicht.' },
      { f: 'Was bedeutet <b>anreißen</b>?', a: 'Maße markieren', x: ['ein Werkstück zerreißen', 'die Zeichnung abreißen', 'schnell sägen'], w: 'Maße und Linien auf dem Werkstück markieren. Auf dem Anriss wird dann gesägt, gebohrt oder gebogen.' },
      { f: 'Womit reißt man auf <b>Metall</b> an?', a: 'mit der Reißnadel', x: ['mit dem Filzstift', 'mit Kreide', 'mit dem Finger'], w: 'Die harte Spitze ritzt eine feine Linie. Auf Holz nimmt man einen Bleistift.' },
      { f: 'Wozu dient der <b>Anschlagwinkel</b>?', a: 'für rechte Winkel', x: ['um Kreise zu zeichnen', 'um Schrauben einzudrehen', 'um Holz zu schleifen'], w: 'Man legt ihn fest an die Bezugskante an.' },
      { f: 'Wie genau misst ein <b>Stahlmaßstab</b>?', a: 'auf 1 mm genau', x: ['auf 1 cm genau', 'auf 1 m genau', 'auf 0,01 mm genau'], w: 'Genauer misst ein Messschieber: auf etwa 0,1 mm.' },
      { f: 'Warum misst man nicht jedes Maß von der <b>vorigen Markierung</b> aus weiter?', a: 'weil sich Fehler addieren', x: ['weil das zu schnell geht', 'weil der Maßstab sonst bricht', 'das ist sogar besser'], w: 'Darum misst man immer von derselben Bezugskante aus.' },
    ],
    E: { f: 'Welches Mess- oder Anreißwerkzeug ist das?', arten: [['stahlmassstab', 'Stahlmaßstab', 'misst Längen auf 1 mm genau.'], ['anschlagwinkel', 'Anschlagwinkel', 'reißt rechte Winkel an und prüft sie.'], ['reissnadel', 'Reißnadel', 'ritzt feine Linien in Metall.'], ['messschieber', 'Messschieber', 'misst sehr genau, auch Durchmesser.']] },
    extra: { lineal: () => U.linealLesen('lineal') },
  }, { lineal: 50, erkennen: 22 });
})();
