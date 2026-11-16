/* TecDax (Technik/Computer) – Klasse 5/6: Knobel-Aufgaben
 *
 * Schwerere, freiwillige Aufgaben zu allen Themen: ohne Auswahl tippen, die falsche Aussage finden, fünf statt vier
 * Möglichkeiten, ganze Reihen ordnen, längere Zahnradketten, Zwischenräder, Kosten, Morsewörter.
 * Sie zählen nicht für die Sterne und haben keine Animation.
 * Wird NACH den Themen-Dateien geladen. Genau eine richtige Lösung; mehrere Schreibweisen stehen alle in der Antwortliste.
 */
(function () {
  const D = window.TecDax, U = D.util;
  const { pick, shuffle, R } = U;
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
    'tc5-arbeitsplatz': [['Wie heißt das Teil im Computer, das alle Daten verarbeitet?', ['Prozessor', 'der Prozessor', 'CPU'], 'Er führt Milliarden Befehle pro Sekunde aus.'], ['Wie heißt ein Bildschirm, den man mit dem Finger bedient?', ['Touchscreen', 'Touch-Screen', 'Tastbildschirm'], 'Er ist Eingabe- und Ausgabegerät zugleich.']],
    'tc5-eva': [['Wofür steht das V in EVA?', ['Verarbeitung'], 'Eingabe, Verarbeitung, Ausgabe.'], ['Welcher Buchstabe kommt dazu, wenn man auch das Speichern meint? (EVA…)', ['S', 'EVAS'], 'EVAS: Eingabe, Verarbeitung, Ausgabe, Speicherung.']],
    'tc5-hardware': [['Wie heißt das Programm, das den ganzen Computer steuert?', ['Betriebssystem', 'das Betriebssystem', 'Systemsoftware'], 'Zum Beispiel Windows, Linux oder Android.'], ['Wie heißt eine neue, verbesserte Fassung einer Software?', ['Update', 'das Update', 'Aktualisierung'], 'Updates schließen oft Sicherheitslücken.']],
    'tc5-gesund': [['Wie viele Zentimeter Abstand sollen deine Augen mindestens vom Bildschirm haben? (Zahl)', ['50'], 'Am besten 50 bis 70 cm.']],
    'tc5-oberflaeche': [['Wie heißt das Menü, das sich mit der rechten Maustaste öffnet?', ['Kontextmenü', 'Kontextmenu'], 'Es passt zu dem, worauf du zeigst.'], ['Wie heißt die Arbeitsfläche, auf der Symbole liegen, wenn kein Fenster offen ist?', ['Desktop', 'Schreibtisch'], 'Englisch für Schreibtischplatte.']],
    'tc5-dateien': [['Welche Endung haben Programmdateien unter Windows? (ohne Punkt)', ['exe', '.exe'], 'Nur öffnen, wenn man weiß, woher sie kommen.'], ['Welche Endung haben viele Fotos? (ohne Punkt)', ['jpg', '.jpg', 'jpeg', '.jpeg'], 'Gesprochen „Jot-Peg“.']],
    'tc5-ordner': [['Wie heißt ein Ordner, der in einem anderen Ordner liegt?', ['Unterordner'], 'So entsteht ein Ordnerbaum.'], ['Wie heißt die Beschreibung des Wegs vom Laufwerk bis zur Datei?', ['Pfad', 'Dateipfad'], 'Zum Beispiel H:\\TC\\plan.docx.']],
    'tc5-schulnetz': [['Wie viele Zeichen soll ein gemischtes Passwort mindestens haben? (Zahl)', ['8', 'acht'], 'Besser noch 12 oder mehr.'], ['Wie heißt in Sachsen die Lernplattform vieler Schulen?', ['LernSax', 'Lernsax'], 'Mit Mail, Dateien und Aufgaben.']],
    'tc5-zeichen': [['In welcher Einheit misst man die Schriftgröße? (Abkürzung)', ['pt', 'Punkt'], 'Normaler Text: 11 oder 12 pt.'], ['Welche Taste drückst du zusammen mit Strg zum Einfügen?', ['V'], 'Strg + V fügt ein, Strg + C kopiert.']],
    'tc5-absatz': [['Wie heißt die Ausrichtung, bei der beide Ränder gerade sind?', ['Blocksatz'], 'Wie in der Zeitung.'], ['Mit welcher Taste beendest du einen Absatz?', ['Enter', 'Eingabetaste', 'Return'], 'Sie setzt eine Absatzmarke ¶.']],
    'tc5-inhalt': [['Wie heißt das Einfügen, das zuverlässig eine neue Seite beginnt?', ['Seitenumbruch'], 'Besser als viele leere Absätze.'], ['Wie heißen gespeicherte Gestaltungen wie „Überschrift 1“?', ['Formatvorlagen', 'Formatvorlage', 'Vorlagen'], 'Einmal ändern, überall geändert.']],
    'tc5-tabellen': [['Wie heißt ein einzelnes Kästchen einer Tabelle?', ['Zelle', 'die Zelle'], 'Dort kreuzen sich Zeile und Spalte.']],
    'tc5-medien': [['Wie heißt eine Verknüpfung, die zu einer anderen Seite führt?', ['Link', 'Hyperlink', 'Verknüpfung'], 'Darum sind digitale Medien erweiterbar.']],
    'tc5-browser': [['Wie heißen gespeicherte Adressen im Browser?', ['Lesezeichen', 'Favoriten', 'Bookmarks'], 'Mit dem Stern speichert man sie.'], ['Mit welchen Buchstaben beginnt eine verschlüsselte Adresse? (vor dem Doppelpunkt)', ['https'], 'Das s steht für secure, sicher.']],
    'tc5-suchen': [['Wie heißt eine bekannte Kindersuchmaschine? (Ein Name reicht.)', ['fragFINN', 'Frag Finn', 'fragfinn', 'Blinde Kuh', 'blindekuh'], 'Sie zeigen nur geprüfte Seiten.']],
    'tc5-quellen': [['Wo steht, wer eine Webseite betreibt?', ['Impressum', 'im Impressum'], 'Meist unten auf der Seite verlinkt.']],
    'tc5-frei': [['Wie nennt man Software, deren Bauplan jeder ansehen und verbessern darf?', ['Open Source', 'OpenSource', 'Open-Source', 'freie Software'], 'Zum Beispiel Firefox oder Linux.'], ['Wofür steht die Abkürzung OER? (deutsch, drei Wörter reichen)', ['freie Bildungsmaterialien', 'offene Bildungsmaterialien', 'Open Educational Resources', 'freie Lernmaterialien'], 'Bildungsmaterial, das jeder nutzen und weitergeben darf.']],
    'tc5-gefahren': [['Wie heißt Mobbing über Handy und Internet?', ['Cybermobbing', 'Cyber-Mobbing'], 'Hilfe: Erwachsene, Nummer gegen Kummer 116 111.'], ['Wie lautet die Nummer gegen Kummer? (ohne Leerzeichen)', ['116111', '116 111'], 'Kostenlos und anonym.']],
    'tc5-email': [['Welches Zeichen steht in jeder E-Mail-Adresse?', ['@', 'At', 'Klammeraffe', 'at-Zeichen'], 'Es trennt Benutzername und Anbieter.'], ['Wie heißt unerwünschte Werbepost im Postfach?', ['Spam'], 'Einfach löschen.']],
    'tc5-zusammen': [['Wie heißen freundliche Regeln für das Netz?', ['Netiquette', 'Netikette'], 'Aus Netz und Etikette.']],
    'tc5-maschine': [['Welche Maschine verbesserte James Watt ab 1769?', ['Dampfmaschine', 'die Dampfmaschine'], 'Sie trieb die ersten Fabriken an.']],
    'tc5-funktion': [['Wie heißt das Funktionselement, das alles zusammenhält?', ['Trägerelement', 'Träger'], 'Gehäuse, Rahmen, Gestell.'], ['Wie heißt das Funktionselement, das die Bewegung weiterleitet?', ['Übertragungselement', 'Uebertragungselement', 'Übertragung'], 'Getriebe, Kette, Riemen.']],
    'tc5-getriebe': [['Zu welchen Funktionselementen gehören Getriebe?', ['Übertragungselemente', 'Übertragungselement', 'Uebertragungselemente', 'Übertragung'], 'Sie übertragen die Bewegung.']],
    'tc5-zugmittel': [['Wie nennt man Riemen und Ketten zusammen?', ['Zugmittel'], 'Sie übertragen Bewegung durch Ziehen.']],
    'tc5-raeder': [['Wie heißen schräg verzahnte Räder, die die Drehung um die Ecke lenken?', ['Kegelräder', 'Kegelrad', 'Kegelzahnräder'], 'Zum Beispiel im Handbohrer.']],
    'tc5-uebersetzung': [['Wie heißt eine Übersetzung, bei der das angetriebene Rad langsamer, aber kräftiger dreht? (ins …)', ['Langsame', 'ins Langsame', 'langsam'], 'Kleines Rad treibt großes.']],
    'tc5-umformung': [['Wie heißt eine unrunde Scheibe, die einen Stößel anhebt?', ['Nocken', 'Kurvenscheibe', 'Nockenscheibe'], 'Im Automotor öffnet sie Ventile.']],
    'tc5-sinnbild': [['Wie heißt eine vereinfachte Zeichnung eines Getriebes?', ['Sinnbild', 'Symbol', 'Schema'], 'Nur das Wichtige ist gezeichnet.']],
    'tc5-konstruieren': [['Wie heißt die schnelle Zeichnung aus freier Hand, die eine Idee zeigt?', ['Ideenskizze', 'Skizze'], 'Sie muss nicht schön sein.']],
    'tc5-modelle': [['Welches Zugmittel treibt das Fahrrad an?', ['Kette', 'die Kette', 'Fahrradkette'], 'Sie rutscht nicht durch.']],
    'tc5-linien': [['Mit welcher Linienart zeichnet man verdeckte Kanten?', ['Strichlinie', 'gestrichelte Linie', 'Strichlinie schmal'], 'Was man nicht sieht, wird gestrichelt.'], ['Mit welcher Linienart zeichnet man Mittellinien?', ['Strich-Punkt-Linie', 'Strichpunktlinie', 'Strich-Punktlinie'], 'Ein Kreuz durch jedes Loch.']],
    'tc5-bemassung': [['Welches Zeichen steht vor einem Durchmesser? (Name des Zeichens)', ['Durchmesserzeichen', '⌀', 'Durchmesser'], 'Ein Kreis mit Schrägstrich.'], ['In welcher Einheit stehen Maße in technischen Zeichnungen? (Abkürzung)', ['mm', 'Millimeter'], 'Ohne Einheit dahinter.']],
    'tc5-ansichten': [['Wie heißt die Ansicht von oben?', ['Draufsicht', 'die Draufsicht'], 'Sie steht unter der Vorderansicht.']],
    'tc5-stueckliste': [['Wie heißt die laufende Nummer eines Teils in der Stückliste?', ['Position', 'Pos.', 'Pos'], 'Sie steht in der ersten Spalte.']],
    'tc5-ablaufplan': [['Was macht man fast immer als ersten Arbeitsschritt? (ein Wort)', ['anreißen', 'messen', 'Anreißen', 'Messen'], 'Messen und anreißen.']],
    'tc5-messen': [['Wie heißt die gerade Kante, von der aus alle Maße gemessen werden?', ['Bezugskante'], 'So addieren sich keine Fehler.'], ['Womit reißt man auf Metall an?', ['Reißnadel', 'Reissnadel', 'mit der Reißnadel'], 'Sie ritzt eine feine Linie.']],
    'tc5-werkstoffe': [['Wie heißen Kunststoffe, die beim Erwärmen weich werden?', ['Thermoplaste', 'Thermoplast'], 'Zum Beispiel Acrylglas.'], ['Bei wie viel Grad Celsius etwa schmilzt Zinn? (Zahl)', ['232', '231', '230'], 'Darum kann man es in der Schule gießen.']],
    'tc5-din8580': [['Welche Norm teilt die Fertigungsverfahren ein? (DIN und Zahl)', ['DIN 8580', 'DIN8580', '8580'], 'Sechs Hauptgruppen.'], ['Zu welcher Hauptgruppe gehört Lackieren?', ['Beschichten'], 'Eine Schicht wird aufgetragen.']],
    'tc5-urformen': [['Wie heißt eine dauerhafte Gießform aus Metall?', ['Kokille'], 'Eine Sandform wird dagegen zerstört.'], ['Wie heißt der dünne Rand, der beim Gießen an der Trennstelle der Form entsteht?', ['Gussgrat', 'Grat'], 'Er wird abgefeilt.']],
    'tc5-umformen': [['Was bleibt beim Umformen gleich: die Form oder die Masse?', ['Masse', 'die Masse'], 'Es kommt nichts weg und nichts dazu.']],
    'tc5-trennen': [['Was entsteht beim Sägen, Bohren und Feilen?', ['Späne', 'Spaene', 'Span'], 'Darum heißen sie spanende Verfahren.'], ['In welche Richtung zeigen die Zähne des Laubsägeblatts: zum Griff oder vom Griff weg?', ['zum Griff', 'Griff', 'nach unten'], 'Die Laubsäge sägt auf Zug.']],
    'tc5-fuegen': [['Woher kommt bei der Nähmaschine der Unterfaden?', ['Spule', 'von der Spule', 'aus der Spule'], 'Sie liegt unter der Stichplatte.']],
    'tc5-maschinen': [['Welche Maschine sägt Kurven mit einem auf und ab gehenden Blatt?', ['Dekupiersäge', 'Dekupiersaege'], 'Eine Laubsäge mit Motor.']],
    'tc5-sicher': [['Welche Farbe haben Gebotszeichen?', ['blau'], 'Rund und blau: Das musst du tun.'], ['Was trägt man an drehenden Maschinen nie an den Händen?', ['Handschuhe', 'Handschuh'], 'Sie können erfasst werden.']],
    'tc5-pruefen': [['Wie heißt das Prüfen eines rechten Winkels gegen das Licht?', ['Lichtspaltverfahren', 'Lichtspalt'], 'Ein Spalt zeigt die Abweichung.']],
    'tc5-cnc': [['Wie heißt das Konstruieren am Computer? (drei Buchstaben)', ['CAD'], 'Computer Aided Design.'], ['Wie nennt man die weltweite Arbeitsteilung bei der Herstellung?', ['Globalisierung'], 'Teile aus vielen Ländern.']],
    'tc5-vermeiden': [['Welche Stufe kommt beim Abfall ganz zuerst?', ['Vermeiden', 'Vermeidung'], 'Was nicht entsteht, muss nicht entsorgt werden.']],
    'tc5-muell': [['In welche Tonne kommen in Dresden Papier und Pappe? (Farbe)', ['blau', 'Blaue', 'Blaue Tonne', 'blaue Tonne'], 'Die Blaue Tonne.'], ['Bis zu welcher Kantenlänge in cm darf man kleine Elektrogeräte in großen Läden ohne Kauf abgeben? (Zahl)', ['25'], 'Größere nur beim Kauf eines neuen Geräts.']],
    'tc5-kunststoff': [['Wie heißen Kunststoffteilchen kleiner als 5 mm?', ['Mikroplastik'], 'Sie sind fast überall zu finden.']],
    'tc5-nachrichten': [['Welches Notsignal morst man mit ··· −−− ···?', ['SOS'], 'Drei kurz, drei lang, drei kurz.']],
    'tc5-mikrocontroller': [['Wie heißt ein Bauteil, das etwas misst?', ['Sensor'], 'Es liefert die Eingabe.'], ['Wie heißt ein Bauteil, das etwas tut, zum Beispiel leuchtet?', ['Aktor', 'Aktuator'], 'Es liefert die Ausgabe.']],
    'tc5-energie': [['Wie heißt das Gerät, das aus Bewegung Strom macht?', ['Generator', 'Dynamo'], 'Am Fahrrad: der Dynamo.']],
    'tc5-handwerk': [['Wie heißen beim Weben die Querfäden?', ['Schussfaden', 'Schussfäden', 'Schuss'], 'Die Längsfäden heißen Kettfäden.']],
  };

  // Schwerere, erzeugte Aufgaben
  const lang = ohneEx(() => U.zahnradRichtung('k', 5));
  // Drei Räder: Das Zwischenrad ändert die Übersetzung nicht
  function zwischenrad() {
    let z1, z2, z3, n1, n3;
    for (let i = 0; i < 300; i++) {
      [z1, z2, z3] = [pick([12, 16, 20, 24, 30, 36, 40]), pick([10, 14, 18, 22]), pick([10, 12, 15, 20, 24, 30, 40])]; n1 = R(1, 5);
      if (z1 !== z3 && (n1 * z1) % z3 === 0) { n3 = n1 * z1 / z3; if (n3 <= 20) break; }
    }
    return { prompt: `Rad A (<b>${z1} Zähne</b>) treibt Rad B (<b>${z2} Zähne</b>), B treibt Rad C (<b>${z3} Zähne</b>). A dreht sich <b>${n1}-mal</b>. Wie oft dreht sich C?`, figure: D.zeichne.zahnraeder({ z: [z1, z2, z3], namen: ['A', 'B', 'C'], pfeil: 1, zaehne: true, H: 150 }),
      fields: [{ answer: n3, suffix: '-mal', label: 'Umdrehungen von C' }], hint: 'Zähle, wie viele Zähne an jedem Rad vorbeiwandern. Was macht B mit dieser Zahl?',
      solution: `An jedem Rad wandern ${n1} · ${z1} = ${n1 * z1} Zähne vorbei, auch an B. Das Zwischenrad B ändert nur die Richtung. C: ${n1 * z1} : ${z3} = <b>${n3}</b> Umdrehungen.` };
  }
  const kosten = ohneEx(() => U.kostenRechnen('k'));
  const rechts = () => { for (let i = 0; i < 20; i++) { const t = U.bemassungLesen('k'); if (/rechten Rand/.test(t.prompt)) { delete t.ex; return t; } } const t = U.bemassungLesen('k'); delete t.ex; return t; };
  const ansicht = ohneEx(() => U.ansichtFinden('k'));
  const pfad = ohneEx(() => U.ordnerPfad('k'));
  const lineal = ohneEx(() => U.linealLesen('k'));
  const morseTipp = () => { const w = pick(['DACHS', 'SONNE', 'ZAHN', 'MAUS', 'NEST', 'HALLO', 'MOND']); return tipp(`Welches Wort ist das?<br><b style="font-size:1.2em;letter-spacing:.08em">${U.morse(w)}</b><br><small>/ trennt die Buchstaben.</small>`, [w], 'Nimm die Morsetabelle zu Hilfe: A ·− , D −·· , S ··· , O −−− …', `<b>${w}</b>`); };
  const EXTRA = {
    'tc5-raeder': [lang, lang], 'tc5-uebersetzung': [zwischenrad, zwischenrad, zwischenrad], 'tc5-stueckliste': [kosten, kosten], 'tc5-bemassung': [rechts, rechts],
    'tc5-ansichten': [ansicht, ansicht], 'tc5-ordner': [pfad, pfad], 'tc5-messen': [lineal], 'tc5-nachrichten': [morseTipp, morseTipp],
  };

  for (const t of themen()) {
    const v = ausSammlung(t.id).concat(EXTRA[t.id] || []);
    for (const [f, a, w] of T[t.id] || []) v.push(() => tipp(f, a, 'Denk an das Thema. Groß- und Kleinschreibung ist egal.', `<b>${a[0]}</b>: ${w}`));
    K(t.id, ...v);
  }
  D.knobelVarianten = VAR;
})();
