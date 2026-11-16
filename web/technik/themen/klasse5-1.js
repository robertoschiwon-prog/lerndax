/* TecDax – Klasse 5/6, Bereiche 1 bis 3: Computer und Daten, Texte gestalten, Im Netz
 * (Lehrplan Technik/Computer LB 1 „Grundlagen im Umgang mit digitalen Medien“). Texte selbst geschrieben,
 * Fakten mit Quellen in faecher/technik/fakten.md.
 */
(function () {
  const D = window.TecDax, U = D.util, G = D.gen;
  const { baue, pick, shuffle, R } = U;

  // =====================================================
  // Bereich 1: Computer und Daten
  // =====================================================
  G.arbeitsplatz = baue('tc5-arbeitsplatz', {
    h: 'Eingabegeräte bringen etwas in den Computer hinein, Ausgabegeräte geben etwas heraus. Speicher bewahren Daten auf.',
    F: [
      { f: 'Welche beiden Geräte sind <b>Eingabegeräte</b>?', a: 'Tastatur und Maus', x: ['Bildschirm und Drucker', 'Lautsprecher und Beamer', 'Drucker und Lautsprecher'], w: 'Mit Tastatur und Maus gibst du dem Computer Befehle und Text ein.' },
      { f: 'Wozu dient ein <b>Ausgabegerät</b>?', a: 'Es gibt Ergebnisse als Bild, Druck oder Ton aus.', x: ['Es nimmt Befehle von uns entgegen.', 'Es bewahrt Daten nach dem Ausschalten auf.', 'Es verbindet den Computer mit dem Strom.'], w: 'Es gibt die Ergebnisse des Computers an uns weiter, als Bild, Ausdruck oder Ton. Bildschirm, Drucker, Lautsprecher und Beamer sind Ausgabegeräte.' },
      { f: 'Was steckt im <b>Grundgerät</b> (der Zentraleinheit)?', a: 'Prozessor und Arbeitsspeicher', x: ['nur der Bildschirm', 'die Tastatur und die Maus', 'nur das Stromkabel'], w: 'Der Prozessor, der alles verarbeitet, und der Arbeitsspeicher. Das Grundgerät ist das Gehäuse mit Prozessor, Arbeitsspeicher und Festplatte. Beim Laptop ist alles in einem.' },
      { f: 'Wo bleiben deine Daten erhalten, wenn du den Computer <b>ausschaltest</b>?', a: 'auf der Festplatte', x: ['im Arbeitsspeicher', 'auf dem Bildschirm', 'im Drucker'], w: 'Auf einem Speicher wie Festplatte oder USB-Stick. Der Arbeitsspeicher vergisst beim Ausschalten alles. Darum musst du speichern.' },
      { f: 'Welches Gerät ist <b>Eingabe- und Ausgabegerät</b> zugleich?', a: 'der Touchscreen', x: ['die Maus', 'der Drucker', 'der Lautsprecher'], w: 'Er zeigt ein Bild (Ausgabe) und spürt, wo du tippst (Eingabe). Handys und Tablets haben einen.' },
      { f: 'Ein <b>Scanner</b> liest ein Blatt Papier in den Computer ein. Was für ein Gerät ist er?', a: 'ein Eingabegerät', x: ['ein Ausgabegerät', 'ein Speicher', 'ein Teil des Prozessors'], w: 'Er bringt das Bild des Blatts in den Computer hinein. Der Drucker macht das Gegenteil.' },
      { f: 'Welches Gerät brauchst du, um eine Sprachnachricht <b>aufzunehmen</b>?', a: 'ein Mikrofon', x: ['einen Lautsprecher', 'einen Beamer', 'einen Drucker'], w: 'Das Mikrofon nimmt Ton auf (Eingabe). Der Lautsprecher gibt Ton wieder (Ausgabe).' },
      { f: 'Welches Teil im Computer <b>rechnet</b> und verarbeitet die Daten?', a: 'der Prozessor', x: ['die Maus', 'der Bildschirm', 'das Netzteil'], w: 'Der Prozessor ist das „Gehirn“ des Computers. Er schafft Milliarden Rechenschritte pro Sekunde.' },
      { f: 'Wozu dient ein <b>Beamer</b>?', a: 'Er zeigt das Bild groß.', x: ['Er scannt Bilder ein.', 'Er speichert Filme.', 'Er nimmt Ton auf.'], w: 'Er zeigt das Bild an der Wand. Er wirft das Bild des Computers groß an die Wand. Ein Beamer ist ein Ausgabegerät, wie ein riesiger Bildschirm.' },
    ],
    S: { kats: ['Eingabegerät', 'Ausgabegerät', 'Speicher'], f: (b) => `<b>${b}</b>: Was ist das?`, h: 'Hinein in den Computer, heraus aus dem Computer oder aufbewahren?',
      items: [['Tastatur', 0], ['Maus', 0], ['Mikrofon', 0], ['Scanner', 0], ['Webcam', 0], ['Bildschirm', 1], ['Drucker', 1], ['Lautsprecher', 1], ['Beamer', 1], ['Kopfhörer', 1], ['Festplatte', 2], ['USB-Stick', 2], ['Speicherkarte', 2]] },
    E: { f: 'Welches Gerät ist das?', arten: [['tastatur', 'Tastatur', 'Eingabegerät für Buchstaben, Zahlen und Befehle.'], ['maus', 'Maus', 'Eingabegerät: Sie bewegt den Mauszeiger.'], ['bildschirm', 'Bildschirm', 'Ausgabegerät: Er zeigt Bilder und Text.'], ['drucker', 'Drucker', 'Ausgabegerät: Er bringt Text und Bilder aufs Papier.'], ['scanner', 'Scanner', 'Eingabegerät: Er liest Blätter und Fotos ein.'], ['lautsprecher', 'Lautsprecher', 'Ausgabegerät für Ton.'], ['mikrofon', 'Mikrofon', 'Eingabegerät für Ton.'], ['webcam', 'Webcam', 'Eingabegerät: eine kleine Kamera für Bild und Video.'], ['usbstick', 'USB-Stick', 'Speicher zum Mitnehmen.'], ['beamer', 'Beamer', 'Ausgabegerät: Er wirft das Bild an die Wand.']] },
    T: [
      { f: 'Tastatur und Maus sind ___.', a: ['Eingabegeräte', 'Eingabegerät'], w: 'Mit ihnen gibst du etwas in den Computer ein.' },
      { f: 'Bildschirm und Drucker sind ___.', a: ['Ausgabegeräte', 'Ausgabegerät'], w: 'Sie geben Ergebnisse aus.' },
    ],
    A: { w: ['Ein USB-Stick ist ein Speicher.', 'Der Prozessor verarbeitet die Daten.', 'Ein Touchscreen ist Eingabe- und Ausgabegerät.', 'Ein Drucker ist ein Ausgabegerät.'],
      f: ['Ein Lautsprecher ist ein Eingabegerät.', 'Der Arbeitsspeicher behält alles nach dem Ausschalten.', 'Die Maus ist ein Ausgabegerät.', 'Ein Scanner gibt Bilder auf Papier aus.'] },
  }, { erkennen: 26 });

  // Abläufe nach dem EVA-Prinzip (für Ordnen und die Animation)
  const EVA = [
    { g: 'Taschenrechner', s: ['3 + 4 eintippen', 'rechnen', '7 in der Anzeige'] },
    { g: 'Supermarktkasse', s: ['Strichcode scannen', 'Preis heraussuchen', 'Preis anzeigen und Bon drucken'] },
    { g: 'Navi', s: ['Ziel eintippen', 'Weg berechnen', '„Jetzt links abbiegen“ ansagen'] },
    { g: 'Handy', s: ['Frage ins Mikrofon sprechen', 'Antwort suchen', 'Antwort vorlesen'] },
    { g: 'Computerspiel', s: ['Pfeiltaste drücken', 'neue Position berechnen', 'Figur auf dem Bildschirm bewegen'] },
  ];
  D.EVA = EVA;
  G.eva = baue('tc5-eva', {
    h: 'EVA heißt Eingabe, Verarbeitung, Ausgabe. Erst kommt etwas hinein, dann wird es verarbeitet, dann kommt ein Ergebnis heraus.',
    F: [
      { f: 'Wofür steht <b>EVA</b>?', a: 'Eingabe, Verarbeitung, Ausgabe', x: ['Einschalten, Verbinden, Ausschalten', 'Erst Vorlesen, dann Abschreiben', 'Eingabe, Vergrößern, Anzeigen'], w: 'Nach diesem Prinzip arbeitet jeder Computer: vom Taschenrechner bis zum Handy.' },
      { f: 'Du tippst am Taschenrechner <b>3 + 4</b>. Was ist das?', a: 'Eingabe', x: ['Verarbeitung', 'Ausgabe', 'Speicherung'], w: 'Du gibst dem Rechner die Zahlen und den Befehl.' },
      { f: 'In der Anzeige des Taschenrechners erscheint <b>7</b>. Was ist das?', a: 'Ausgabe', x: ['Eingabe', 'Verarbeitung', 'Speicherung'], w: 'Das Ergebnis kommt heraus.' },
      { f: 'Der Taschenrechner <b>rechnet</b>. Was ist das?', a: 'Verarbeitung', x: ['Eingabe', 'Ausgabe', 'Speicherung'], w: 'Das passiert im Inneren, im Prozessor.' },
      { f: 'An der Kasse liest der Scanner den <b>Strichcode</b>. Was ist das?', a: 'Eingabe', x: ['Verarbeitung', 'Ausgabe', 'Speicherung'], w: 'Der Strichcode kommt in die Kasse hinein.' },
      { f: 'Welches Teil des Computers ist für die <b>Verarbeitung</b> zuständig?', a: 'der Prozessor', x: ['die Tastatur', 'der Bildschirm', 'der Lautsprecher'], w: 'Er führt die Befehle aus und rechnet.' },
      { f: 'Warum braucht ein Computer neben E, V und A oft noch einen <b>Speicher</b>?', a: 'damit Daten später noch da sind', x: ['damit er schneller rechnet', 'damit der Bildschirm heller wird', 'damit die Tastatur funktioniert'], w: 'Damit Daten und Ergebnisse auch später noch da sind. Manche sagen darum EVAS: Eingabe, Verarbeitung, Ausgabe, Speicherung.' },
      { f: 'Beim Navi: Der Weg wird <b>berechnet</b>. Was ist das?', a: 'Verarbeitung', x: ['Eingabe', 'Ausgabe', 'Speicherung'], w: 'Das Navi überlegt, welcher Weg zum Ziel führt.' },
    ],
    S: { kats: ['Eingabe', 'Verarbeitung', 'Ausgabe'], f: (b) => `<b>${b}</b>: E, V oder A?`, h: 'Kommt etwas hinein, wird es verarbeitet oder kommt ein Ergebnis heraus?',
      items: EVA.flatMap((e) => e.s.map((s, k) => [`${e.g}: ${s}`, k])) },
    O: EVA.map((e) => ({ t: `Bring die Schritte beim <b>${e.g}</b> in die richtige Reihenfolge.`, items: e.s, w: 'Eingabe → Verarbeitung → Ausgabe.', ex: { mode: 'eva', geraet: e.g, schritte: e.s } })),
    A: { w: ['Die Verarbeitung passiert im Prozessor.', 'Ein Mikrofon dient der Eingabe.', 'Jeder Computer arbeitet nach dem EVA-Prinzip.'], f: ['Die Ausgabe kommt vor der Eingabe.', 'Ein Bildschirm dient der Eingabe.', 'Nur große Computer arbeiten nach dem EVA-Prinzip.'] },
  });

  G.hardware = baue('tc5-hardware', {
    h: 'Hardware kannst du anfassen. Software sind die Programme. Das Betriebssystem ist das Programm, das den ganzen Computer steuert.',
    F: [
      { f: 'Was ist <b>Hardware</b>?', a: 'alle Teile zum Anfassen', x: ['alle Programme auf dem Computer', 'nur die Spiele', 'das Internet'], w: 'Alle Teile des Computers, die man anfassen kann. Tastatur, Bildschirm, Prozessor und Festplatte sind Hardware.' },
      { f: 'Was ist <b>Software</b>?', a: 'die Programme des Computers', x: ['weiche Teile wie Mauspads', 'alle Kabel', 'der Bildschirm'], w: 'Die Programme, die auf dem Computer laufen. Ohne Software kann die Hardware nichts tun.' },
      { f: 'Was macht das <b>Betriebssystem</b> (die Systemsoftware)?', a: 'Es steuert den Computer.', x: ['Es ist nur ein Spiel.', 'Es schreibt Briefe.', 'Es druckt Bilder.'], w: 'Es steuert den Computer und startet die anderen Programme. Bekannte Betriebssysteme: Windows, macOS, Linux, Android, iOS.' },
      { f: 'Was ist ein <b>Anwendungsprogramm</b>?', a: 'ein Programm für eine bestimmte Aufgabe', x: ['das Programm, das den Computer startet', 'ein Teil der Hardware', 'ein Kabel für das Netz'], w: 'Ein Programm für eine bestimmte Aufgabe, zum Beispiel Texte schreiben. Textverarbeitung, Browser und Malprogramm sind Anwendungsprogramme. Auf dem Handy heißen sie Apps.' },
      { f: 'Welches ist ein <b>Betriebssystem</b>?', a: 'Android', x: ['Textverarbeitung', 'Browser', 'Malprogramm'], w: 'Android steuert viele Handys und Tablets.' },
      { f: 'Was ist ein <b>Update</b>?', a: 'eine neue Fassung', x: ['ein neuer Bildschirm', 'ein Virus', 'eine kaputte Datei'], w: 'Eine neue, verbesserte Fassung einer Software. Updates schließen oft Sicherheitslücken. Darum sind sie wichtig.' },
      { f: 'Was heißt „App“?', a: 'ein Anwendungsprogramm', x: ['ein Teil der Hardware', 'ein Betriebssystem', 'ein Kabel'], w: 'Kurz für „Application“: ein Anwendungsprogramm. Auf Handys und Tablets heißen Anwendungsprogramme Apps.' },
    ],
    S: { kats: ['Hardware', 'Betriebssystem', 'Anwendungsprogramm'], f: (b) => `<b>${b}</b>: Was ist das?`, h: 'Anfassen kann man nur Hardware. Das Betriebssystem steuert den ganzen Computer.',
      items: [['Tastatur', 0], ['Prozessor', 0], ['Festplatte', 0], ['Bildschirm', 0], ['Drucker', 0], ['Windows', 1], ['Android', 1], ['Linux', 1], ['iOS', 1], ['macOS', 1], ['Textverarbeitung', 2], ['Browser', 2], ['Malprogramm', 2], ['Lernspiel', 2], ['Taschenrechner-App', 2]] },
    T: [{ f: 'Alle Teile, die man anfassen kann, heißen ___.', a: 'Hardware', w: 'Englisch hard = hart.' }, { f: 'Die Programme eines Computers heißen ___.', a: 'Software', w: 'Englisch soft = weich.' }],
    A: { w: ['Ohne Betriebssystem startet kein Programm.', 'Eine Festplatte ist Hardware.', 'Ein Browser ist ein Anwendungsprogramm.'], f: ['Windows ist Hardware.', 'Software kann man anfassen.', 'Ein Drucker ist Software.'] },
  });

  G.gesund = baue('tc5-gesund', {
    h: 'Abstand etwa eine Armlänge (50 bis 70 cm), Bildschirm oben auf Augenhöhe oder etwas darunter, Unterarme waagerecht, Füße flach auf dem Boden, oft bewegen.',
    F: [
      { f: 'Wie weit sollen deine Augen vom Bildschirm entfernt sein?', a: 'etwa 50 bis 70 cm', x: ['etwa 10 bis 20 cm', 'mindestens 2 m', 'so nah wie möglich'], w: 'Etwa 50 bis 70 cm, ungefähr eine Armlänge. Strecke den Arm mit Faust aus: Wenn die Faust den Bildschirm berührt, passt es ungefähr.' },
      { f: 'Wo soll die <b>Oberkante</b> des Bildschirms sein?', a: 'etwa auf Augenhöhe', x: ['weit über den Augen', 'auf dem Tisch liegend', 'ganz egal'], w: 'Dann schaust du leicht nach unten. Das schont Nacken und Augen.' },
      { f: 'Wie liegen deine <b>Unterarme</b> beim Tippen?', a: 'etwa waagerecht auf dem Tisch', x: ['steil nach oben gestreckt', 'hängend unter dem Tisch', 'auf dem Bildschirm'], w: 'Etwa waagerecht, Ober- und Unterarm bilden einen rechten Winkel. Dann sind Schultern und Handgelenke entspannt.' },
      { f: 'Wo sind deine <b>Füße</b>?', a: 'flach auf dem Boden', x: ['auf dem Stuhl', 'baumelnd in der Luft', 'unter dem Po'], w: 'Reichen die Füße nicht hinunter, hilft eine Fußstütze.' },
      { f: 'Was hilft gegen müde Augen?', a: 'in die Ferne schauen, Pausen machen', x: ['näher an den Bildschirm rücken', 'den Bildschirm ganz dunkel stellen', 'die Augen weit aufreißen'], w: 'Öfter in die Ferne schauen und Pausen machen. Beim Schauen auf den Bildschirm blinzeln wir seltener. Der Blick in die Ferne entspannt.' },
      { f: 'Wie stellst du den Bildschirm zum <b>Fenster</b>?', a: 'seitlich, sodass du parallel zum Fenster schaust', x: ['mit dem Fenster direkt hinter dem Bildschirm', 'mit dem Fenster direkt hinter dir', 'egal'], w: 'So blendet das Licht nicht und spiegelt sich nicht im Bildschirm.' },
      { f: 'Warum soll man beim Arbeiten am Computer <b>oft die Haltung wechseln</b> und aufstehen?', a: 'weil Stillsitzen den Rücken verspannt', x: ['weil der Computer sonst heiß wird', 'weil sonst die Maus kaputt geht', 'weil man sonst zu schnell tippt'], w: 'Weil langes Stillsitzen Rücken und Nacken verspannt. Bewegungspausen halten den Körper fit.' },
    ],
    B: { svg: 'sitzen', teile: ['Sehabstand', 'Bildschirmoberkante', 'Unterarme', 'Füße', 'Rückenlehne'],
      was: { Sehabstand: 'etwa 50 bis 70 cm, eine Armlänge.', Bildschirmoberkante: 'auf Augenhöhe oder etwas darunter.', Unterarme: 'liegen etwa waagerecht auf dem Tisch.', Füße: 'stehen flach auf dem Boden.', Rückenlehne: 'stützt den Rücken, du sitzt aufrecht.' } },
    S: { kats: ['gut für dich', 'nicht gut für dich'], f: (b) => `<b>${b}</b>`, h: 'Was schont Augen, Rücken und Nacken?',
      items: [['Nach einer Weile aufstehen und sich strecken', 0], ['In die Ferne schauen', 0], ['Füße flach auf dem Boden', 0], ['Aufrecht an die Lehne gelehnt sitzen', 0], ['Stundenlang ohne Pause spielen', 1], ['Mit der Nase fast am Bildschirm', 1], ['Bildschirm vor einem hellen Fenster', 1], ['Krumm auf dem Bett mit dem Laptop', 1]] },
  }, { beschriften: 24 });

  G.oberflaeche = baue('tc5-oberflaeche', {
    h: 'Ein Fenster hat oben die Titelleiste mit Knöpfen zum Verkleinern, Vergrößern und Schließen, darunter die Menüleiste. Symbole sind kleine Bilder.',
    B: { svg: 'oberflaeche', teile: ['Titelleiste', 'Menüleiste', 'Schaltfläche „Schließen“', 'Bildlaufleiste', 'Symbol (Icon)', 'Mauszeiger'],
      was: { Titelleiste: 'Sie zeigt den Namen der Datei und des Programms.', Menüleiste: 'Hier stehen die Befehle, geordnet in Menüs.', 'Schaltfläche „Schließen“': 'Das X schließt das Fenster.', Bildlaufleiste: 'Mit ihr schiebst du den Inhalt nach oben und unten.', 'Symbol (Icon)': 'Ein kleines Bild für einen Ordner, eine Datei oder ein Programm.', Mauszeiger: 'Er zeigt, wohin die Maus gerade zeigt.' } },
    F: [
      { f: 'Wie <b>schließt</b> du ein Fenster?', a: 'mit dem X oben rechts', x: ['mit dem Strich oben rechts', 'mit einem Doppelklick auf den Text', 'mit der Bildlaufleiste'], w: 'Der Strich (–) verkleinert das Fenster nur in die Taskleiste.' },
      { f: 'Was ist eine <b>Schaltfläche</b>?', a: 'ein Knopf auf dem Bildschirm', x: ['eine Taste auf der Tastatur', 'ein Kabel', 'eine Datei'], w: 'Ein Knopf auf dem Bildschirm, den man anklickt. Zum Beispiel „OK“, „Abbrechen“ oder das X zum Schließen.' },
      { f: 'Was ist ein <b>Menü</b>?', a: 'eine aufklappbare Liste mit Befehlen', x: ['ein Bild auf dem Schreibtisch', 'ein Programm zum Kochen', 'eine Art Ordner'], w: 'Eine Liste mit Befehlen, die sich beim Anklicken öffnet. Im Menü „Datei“ stehen zum Beispiel Öffnen, Speichern und Drucken.' },
      { f: 'Was passiert meist bei einem <b>Doppelklick</b> auf ein Symbol?', a: 'Es öffnet sich.', x: ['Das Symbol wird gelöscht.', 'Der Computer schaltet sich aus.', 'Das Symbol wird kopiert.'], w: 'Das Programm, die Datei oder der Ordner öffnet sich. Ein einfacher Klick wählt nur aus (markiert).' },
      { f: 'Was öffnet sich meist bei einem Klick mit der <b>rechten</b> Maustaste?', a: 'ein Menü mit passenden Befehlen', x: ['immer der Browser', 'der Drucker', 'nichts, die rechte Taste hat keine Aufgabe'], w: 'Ein kleines Menü mit Befehlen zu dem, worauf du zeigst. Dieses Menü heißt Kontextmenü. Es passt zu dem Ding, auf das du zeigst.' },
      { f: 'Wie nennt man die Arbeitsfläche, die man sieht, wenn kein Fenster offen ist?', a: 'Desktop', x: ['Taskleiste', 'Menüleiste', 'Titelleiste'], w: 'Desktop (Schreibtisch). Auf dem Desktop liegen oft Symbole für Programme und Ordner.' },
      { f: 'Wozu dient die <b>Bildlaufleiste</b>?', a: 'um den Inhalt zu verschieben', x: ['um das Fenster zu schließen', 'um die Schrift fett zu machen', 'um den Computer auszuschalten'], w: 'Um den Inhalt im Fenster nach oben oder unten zu schieben. Das geht auch mit dem Mausrad.' },
    ],
    T: [{ f: 'Ein kleines Bild für ein Programm oder einen Ordner heißt ___.', a: ['Symbol', 'Icon'], w: 'Auf Englisch: Icon.' }],
  }, { beschriften: 30 });

  G.dateien = baue('tc5-dateien', {
    h: 'Ein Dateiname hat einen Namen, einen Punkt und eine Endung. Die Endung verrät die Dateiart: .txt Text, .jpg Bild, .exe Programm, .mp3 Ton.',
    F: [
      { f: 'Was ist eine <b>Datei</b>?', a: 'gespeicherte Daten', x: ['ein Ordner aus Pappe', 'ein Teil des Prozessors', 'ein Kabel'], w: 'Gespeicherte Daten mit einem Namen, zum Beispiel ein Text, ein Bild oder ein Programm. Jede Datei hat einen Namen und liegt an einem bestimmten Ort.' },
      { f: 'Woran erkennst du die <b>Dateiart</b>?', a: 'an der Endung nach dem Punkt', x: ['an der Länge des Namens', 'am ersten Buchstaben', 'an der Uhrzeit'], w: 'Bei „ferien.jpg“ ist „.jpg“ die Endung: ein Foto.' },
      { f: 'Was für eine Datei ist <b>spiel.exe</b>?', a: 'eine Programmdatei', x: ['eine Textdatei', 'ein Bild', 'ein Lied'], w: '.exe-Dateien starten unter Windows ein Programm. Öffne sie nur, wenn du weißt, woher sie kommen.' },
      { f: 'Welcher Dateiname ist am <b>besten</b> gewählt?', a: 'TC_Leuchter.docx', x: ['neu1.docx', 'asdf.docx', 'Dokument (3).docx'], w: 'TC_Stueckliste_Leuchter.docx. Ein guter Name sagt, was drin ist. Dann findest du die Datei schnell wieder.' },
      { f: 'Welche Zeichen soll man in Dateinamen <b>nicht</b> benutzen?', a: '/ \\ : * ? und |', x: ['Buchstaben', 'Ziffern', 'den Unterstrich _'], w: 'Diese Zeichen haben im Computer eine besondere Bedeutung, zum Beispiel trennt \\ die Ordner im Pfad.' },
      { f: 'Was passiert, wenn du die Endung einer Datei einfach <b>löschst</b>?', a: 'Sie lässt sich nicht öffnen.', x: ['Die Datei wird kleiner.', 'Die Datei wird gelöscht.', 'Nichts, die Endung ist unwichtig.'], w: 'Der Computer weiß nicht mehr, mit welchem Programm er sie öffnen soll. Die Endung sagt dem Betriebssystem, welches Programm passt.' },
    ],
    S: { kats: D.DATEIKATS, f: (b) => `Was für eine Datei ist <b>${b}</b>?`, h: 'Schau auf die Endung.',
      items: [['brief.txt', 0], ['aufsatz.docx', 0], ['notizen.odt', 0], ['urlaub.jpg', 1], ['logo.png', 1], ['bild.gif', 1], ['setup.exe', 2], ['spiel.exe', 2], ['app.apk', 2], ['lied.mp3', 3], ['film.mp4', 3], ['ton.wav', 3]] },
    T: [{ f: 'Bei „lied.mp3“ heißt „.mp3“ die ___.', a: ['Endung', 'Dateiendung'], w: 'Sie verrät die Dateiart.' }],
    extra: { dateiArt: () => U.dateiArt('dateiArt') },
  }, { dateiArt: 26 });

  G.ordner = baue('tc5-ordner', {
    h: 'Ordner sind Behälter für Dateien und andere Ordner. Der Pfad beschreibt den Weg: Laufwerk\\Ordner\\Unterordner\\Datei.',
    F: [
      { f: 'Was ist ein <b>Ordner</b> (Verzeichnis)?', a: 'ein Behälter für Dateien', x: ['eine besondere Datei mit Text', 'ein Programm', 'ein Teil der Tastatur'], w: 'Ein Behälter für Dateien und weitere Ordner. Ordner helfen, Ordnung zu halten, wie Ordner im Regal.' },
      { f: 'Was ist ein <b>Unterordner</b>?', a: 'ein Ordner, der in einem anderen Ordner liegt', x: ['ein Ordner ganz unten auf dem Bildschirm', 'eine kleine Datei', 'ein gelöschter Ordner'], w: 'So entsteht ein Ordnerbaum, zum Beispiel Schule → TC → Leuchter.' },
      { f: 'Was beschreibt ein <b>Pfad</b> wie H:\\TC\\Leuchter\\plan.docx?', a: 'den Weg vom Laufwerk zur Datei', x: ['wie groß die Datei ist', 'wann die Datei gespeichert wurde', 'wer die Datei geschrieben hat'], w: 'Den Weg vom Laufwerk durch die Ordner bis zur Datei. Das Zeichen \\ trennt die einzelnen Ordner.' },
      { f: 'Womit beginnt ein Pfad unter Windows?', a: 'mit dem Laufwerk', x: ['mit dem Dateinamen', 'mit der Endung', 'mit dem Programm'], w: 'Mit dem Laufwerk, zum Beispiel H:. Laufwerke haben Buchstaben: C: ist oft die Festplatte, im Schulnetz hast du meist ein eigenes Laufwerk.' },
      { f: 'Warum lohnt es sich, Ordner nach <b>Fächern</b> anzulegen?', a: 'Man findet seine Dateien schneller wieder.', x: ['Der Computer wird schneller.', 'Die Dateien werden kleiner.', 'Dann braucht man keine Dateinamen.'], w: 'Ordnung spart Zeit beim Suchen.' },
    ],
    T: [{ f: 'Die Ordner im Pfad H:\\TC\\Leuchter werden durch das Zeichen ___ getrennt.', a: ['\\', 'Backslash', 'umgekehrter Schrägstrich'], w: 'Unter Windows ist es der umgekehrte Schrägstrich \\.' }],
    extra: { ordnerPfad: () => U.ordnerPfad('ordnerPfad') },
  }, { ordnerPfad: 70 });

  G.schulnetz = baue('tc5-schulnetz', {
    h: 'Anmelden, arbeiten, speichern, Programm beenden, abmelden. Das Passwort bleibt geheim: lang und gemischt.',
    F: [
      { f: 'Warum musst du dich am Ende <b>abmelden</b>?', a: 'damit niemand dein Konto benutzt', x: ['damit der Bildschirm sauber bleibt', 'damit der Strom gespart wird', 'das ist nicht nötig'], w: 'Damit niemand mit deinem Konto weiterarbeitet. Wer dein Konto benutzt, kann deine Dateien ändern oder in deinem Namen schreiben.' },
      { f: 'Wem darfst du dein <b>Passwort</b> verraten?', a: 'niemandem außer deinen Eltern', x: ['allen in der Klasse', 'nur der besten Freundin oder dem besten Freund', 'jedem, der freundlich fragt'], w: 'Niemandem, auch nicht der besten Freundin oder dem besten Freund. Ein Passwort ist wie ein Haustürschlüssel. Ausnahme: Deine Eltern dürfen es kennen.' },
      { f: 'Welches Passwort ist am <b>sichersten</b>?', a: 'Dachs!baut7Hoehlen#', x: ['123456', 'passwort', 'Max2014'], w: 'Lang, mit großen und kleinen Buchstaben, Ziffern und Sonderzeichen, kein Name und kein Geburtsjahr.' },
      { f: 'Was ist der Unterschied zwischen <b>Speichern</b> und <b>Speichern unter</b>?', a: '„Speichern unter“ fragt nach Name und Ort.', x: ['Es gibt keinen Unterschied.', '„Speichern“ löscht die Datei.', '„Speichern unter“ druckt die Datei.'], w: '„Speichern unter“ fragt nach neuem Namen oder Ort, „Speichern“ überschreibt die bisherige Datei. Beim ersten Speichern fragt auch „Speichern“ nach Name und Ort.' },
      { f: 'Wie kannst du im Schulnetz eine Datei mit anderen <b>austauschen</b>?', a: 'über Tauschordner oder Lernplattform', x: ['indem du sie ausdruckst und abtippst', 'gar nicht', 'indem du das Passwort weitergibst'], w: 'Über einen Tauschordner oder die Lernplattform. In Sachsen nutzen viele Schulen die Lernplattform LernSax.' },
      { f: 'Was tust du, <b>bevor</b> du ein Programm beendest?', a: 'die Arbeit speichern', x: ['den Bildschirm ausschalten', 'die Maus abziehen', 'das Passwort ändern'], w: 'Sonst ist alles weg, was seit dem letzten Speichern dazukam.' },
      { f: 'Wie viele Zeichen soll ein Passwort <b>mindestens</b> haben, wenn es aus Buchstaben, Ziffern und Sonderzeichen gemischt ist?', a: 'mindestens 8', x: ['3', '5', '1'], w: 'Besser 12. Mindestens 8, besser 12. Je länger, desto sicherer. Ganz lange Passwörter (ab etwa 25 Zeichen) dürfen auch einfacher gemischt sein.' },
    ],
    O: [{ t: 'Bring die Arbeit am Schulcomputer in die richtige Reihenfolge.', items: ['anmelden', 'Programm starten', 'Datei öffnen', 'bearbeiten', 'speichern', 'Programm beenden', 'abmelden'], n: 5, w: 'Anmelden, arbeiten, speichern, beenden, abmelden.' }],
    S: { kats: ['sicheres Passwort', 'unsicheres Passwort'], f: (b) => `<b>${b}</b>`, h: 'Sicher: lang, gemischt, kein Name, kein Wort aus dem Wörterbuch.',
      items: [['Dachs!baut7Hoehlen#', 0], ['Gruen7Tisch?Wolke!', 0], ['Ich-esse-gern-12-Aepfel!', 0], ['Ke$s3l_Blau_Mond', 0], ['123456', 1], ['passwort', 1], ['Max2014', 1], ['qwertz', 1], ['hallo', 1], ['Fussball', 1]] },
  });

  // =====================================================
  // Bereich 2: Texte gestalten
  // =====================================================
  const WORTE = ['Säge', 'Zahnrad', 'Leuchter', 'Werkstatt', 'Bohrer', 'Getriebe', 'Feile', 'Dachs'];
  const FORMAT = [['fett', (w) => `<b>${w}</b>`], ['kursiv', (w) => `<i>${w}</i>`], ['unterstrichen', (w) => `<u>${w}</u>`], ['durchgestrichen', (w) => `<s>${w}</s>`]];
  function formatErkennen(art) {
    const [n, f] = pick(FORMAT), w = pick(WORTE), ch = FORMAT.map((x) => x[0]);
    return { prompt: `Wie ist das Wort gestaltet?<br><span style="font-size:1.7em;font-weight:500">${f(w)}</span>`, choices: ch, correct: ch.indexOf(n), hint: 'Fett: dicker. Kursiv: schräg. Unterstrichen: Linie darunter. Durchgestrichen: Linie hindurch.',
      solution: `Das Wort ist <b>${n}</b>.`, ex: { mode: 'karte', nach: false, art, q: 'Wie ist das Wort gestaltet?', opts: [n], ok: 0, merk: `<b>${n}</b>: ${{ fett: 'dicke Buchstaben, gut für Überschriften und wichtige Wörter', kursiv: 'schräge Buchstaben, gut für Titel und Fremdwörter', unterstrichen: 'mit Linie darunter. Vorsicht: Im Netz sehen Links so aus.', durchgestrichen: 'mit Linie hindurch, zeigt, was nicht mehr gilt' }[n]}.` } };
  }
  G.zeichen = baue('tc5-zeichen', {
    h: 'Zuerst das Wort markieren, dann gestalten: fett, kursiv, unterstrichen, Schriftart, Schriftgröße, Farbe.',
    F: [
      { f: 'Was musst du tun, <b>bevor</b> du ein Wort fett machen kannst?', a: 'das Wort markieren', x: ['das Programm neu starten', 'die Datei drucken', 'das Wort löschen'], w: 'Das Programm muss wissen, welcher Text gemeint ist. Markierter Text ist farbig hinterlegt.' },
      { f: 'In welcher Einheit gibt man die <b>Schriftgröße</b> an?', a: 'in Punkt (pt)', x: ['in Zentimetern', 'in Kilogramm', 'in Pixeln pro Sekunde'], w: 'Normaler Text hat oft 11 oder 12 pt, Überschriften sind größer.' },
      { f: 'Welche Schrift ist <b>größer</b>?', a: '18 pt', x: ['12 pt', '10 pt', '8 pt'], w: 'Je größer die Zahl, desto größer die Schrift.' },
      { f: 'Wie viele <b>Schriftarten</b> sollte ein Text höchstens haben?', a: 'ein bis zwei', x: ['fünf oder mehr', 'für jedes Wort eine andere', 'so viele wie möglich'], w: 'Zu viele Schriftarten machen einen Text unruhig und schwer lesbar.' },
      { f: 'Welche Tasten <b>kopieren</b> markierten Text?', a: 'Strg + C', x: ['Strg + V', 'Strg + Z', 'Strg + X'], w: 'Strg + C kopieren, Strg + V einfügen, Strg + X ausschneiden, Strg + Z rückgängig.' },
      { f: 'Welche Tasten <b>machen rückgängig</b>, was du gerade getan hast?', a: 'Strg + Z', x: ['Strg + C', 'Strg + V', 'Strg + S'], w: 'Ein Rettungsanker, wenn du aus Versehen etwas gelöscht hast.' },
      { f: 'Wofür eignet sich <b>fette</b> Schrift?', a: 'für Überschriften', x: ['für den ganzen Text', 'für unwichtige Nebensachen', 'für Links im Internet'], w: 'Für Überschriften und ganz wichtige Wörter. Wenn alles fett ist, fällt nichts mehr auf.' },
    ],
    S: { kats: ['Zeichen gestalten', 'Absatz gestalten'], f: (b) => `<b>${b}</b>: Zeichen oder Absatz?`, h: 'Zeichen-Gestaltung betrifft einzelne Buchstaben und Wörter, Absatz-Gestaltung den ganzen Absatz.',
      items: [['fett', 0], ['kursiv', 0], ['Schriftart', 0], ['Schriftgröße', 0], ['Schriftfarbe', 0], ['zentriert', 1], ['Blocksatz', 1], ['Zeilenabstand', 1], ['Aufzählung mit Punkten', 1], ['Einzug', 1]] },
    extra: { formatErkennen: () => formatErkennen('formatErkennen') },
  }, { formatErkennen: 24 });

  // Ausrichtung eines Absatzes als Bild erkennen
  const AUSR = ['linksbündig', 'zentriert', 'rechtsbündig', 'Blocksatz'];
  D.ausrichtungBild = function (k) {
    const L = [150, 120, 160, 100, 140, 70], X0 = 20, B = 170;
    let s = '';
    L.forEach((l, i) => {
      const len = k === 3 && i < L.length - 1 ? B : l, x = k === 0 || (k === 3) ? X0 : k === 1 ? X0 + (B - len) / 2 : X0 + B - len;
      s += `<rect x="${x}" y="${16 + i * 14}" width="${len}" height="6" rx="2" fill="#5b6378"/>`;
    });
    s += `<path d="M${X0} 8 V 100 M${X0 + B} 8 V 100" stroke="#d0443a" stroke-width=".8" stroke-dasharray="3 2"/>`;
    return D.svg(210, 108, s, 'Absatz');
  };
  AUSR.forEach((_, k) => { D.bilder['ausr' + k] = () => D.ausrichtungBild(k); });
  function ausrichtung(art) {
    const k = R(0, 3);
    return { prompt: 'Wie ist dieser Absatz <b>ausgerichtet</b>? (Jeder Balken ist eine Zeile.)', figure: D.ausrichtungBild(k), choices: AUSR.slice(), correct: k, hint: 'Schau, an welcher Seite die Zeilen eine gerade Kante bilden.',
      solution: `<b>${AUSR[k]}</b>: ${['links gerade Kante, rechts flatternd', 'jede Zeile in der Mitte', 'rechts gerade Kante, links flatternd', 'links und rechts gerade Kante, nur die letzte Zeile ist kürzer'][k]}.`,
      ex: { mode: 'karte', nach: false, art, q: 'Wie ist der Absatz ausgerichtet?', opts: [AUSR[k]], ok: 0, svg: 'ausr' + k, merk: `<b>${AUSR[k]}</b>: ${['so schreiben wir meistens', 'gut für Überschriften', 'zum Beispiel für das Datum im Brief', 'wie in Zeitungen und Büchern'][k]}.` } };
  }
  G.absatz = baue('tc5-absatz', {
    h: 'Ein Absatz endet, wenn du Enter drückst. Absätze kann man links, mittig, rechts oder im Blocksatz ausrichten.',
    F: [
      { f: 'Womit beendest du einen <b>Absatz</b>?', a: 'mit der Enter-Taste', x: ['mit der Leertaste', 'mit der Taste Strg', 'mit einem Punkt'], w: 'Die Textverarbeitung setzt dann eine unsichtbare Absatzmarke ¶.' },
      { f: 'Wie richtet man eine <b>Überschrift</b> oft aus?', a: 'zentriert', x: ['rechtsbündig', 'im Blocksatz', 'gar nicht'], w: 'Zentriert steht sie mittig über dem Text.' },
      { f: 'Wie sind die Zeilen im <b>Blocksatz</b>?', a: 'beidseitig bündig', x: ['nur in der Mitte', 'nur rechts bündig', 'kreuz und quer'], w: 'Links und rechts genau bündig, wie in einer Zeitung. Das Programm vergrößert dazu die Abstände zwischen den Wörtern.' },
      { f: 'Wie setzt man mehrere Punkte <b>untereinander</b> wie in einer Liste?', a: 'mit der Aufzählung (Punkte) oder Nummerierung', x: ['mit vielen Leerzeichen', 'mit der Tabulatortaste in jedem Wort', 'gar nicht'], w: 'Die Aufzählung setzt die Punkte automatisch und rückt sauber ein.' },
      { f: 'Was regelt der <b>Zeilenabstand</b>?', a: 'den Abstand der Zeilen', x: ['wie groß die Buchstaben sind', 'wie breit das Blatt ist', 'welche Farbe der Text hat'], w: 'Wie weit die Zeilen auseinanderstehen. Bei 1,5-fachem Abstand lässt sich ein Text leichter lesen und korrigieren.' },
      { f: 'Wie heißt das Zeichen ¶, das man sich in der Textverarbeitung anzeigen lassen kann?', a: 'Absatzmarke', x: ['Leerzeichen', 'Seitenzahl', 'Fußnote'], w: 'Man sieht es nur auf dem Bildschirm, nicht im Ausdruck.' },
    ],
    T: [{ f: 'Eine Ausrichtung, bei der jede Zeile in der Mitte steht, heißt ___.', a: ['zentriert', 'mittig'], w: 'Gut für Überschriften und Einladungen.' }],
    extra: { ausrichtung: () => ausrichtung('ausrichtung') },
  }, { ausrichtung: 30 });

  G.inhalt = baue('tc5-inhalt', {
    h: 'Erst schreiben, dann gestalten. Nie mit Leerzeichen oder vielen Enter-Tasten ausrichten, sondern mit den Werkzeugen der Textverarbeitung.',
    F: [
      { f: 'Was heißt „<b>Inhalt und Gestaltung trennen</b>“?', a: 'Erst schreiben, dann gestalten.', x: ['Den Text in zwei Dateien speichern.', 'Nur Bilder, keinen Text verwenden.', 'Den Text zweimal schreiben.'], w: 'Erst den Text schreiben, danach mit den Werkzeugen gestalten. So kannst du die Gestaltung jederzeit ändern, ohne den Text anzufassen.' },
      { f: 'Wie rückst du eine Überschrift in die Mitte?', a: 'mit der Schaltfläche „zentriert“', x: ['mit vielen Leerzeichen davor', 'mit der Tabulatortaste, bis es ungefähr passt', 'mit Enter'], w: 'Leerzeichen verrutschen, sobald sich Schrift oder Text ändern.' },
      { f: 'Wie kommst du richtig auf eine <b>neue Seite</b>?', a: 'mit einem Seitenumbruch', x: ['mit vielen Enter-Tasten', 'mit vielen Leerzeichen', 'indem du die Datei neu anlegst'], w: 'Leere Absätze verschieben sich, sobald oben Text dazukommt.' },
      { f: 'Was sind <b>Formatvorlagen</b> wie „Überschrift 1“?', a: 'gespeicherte Gestaltungen', x: ['fertige Briefe zum Abschreiben', 'Bilder aus dem Internet', 'Druckerpatronen'], w: 'Gespeicherte Gestaltungen, die man mit einem Klick zuweist. Ändert man die Vorlage, ändern sich alle Überschriften auf einmal.' },
      { f: 'Was bedeutet eine <b>rote Wellenlinie</b> unter einem Wort?', a: 'Vielleicht ein Tippfehler.', x: ['Das Wort ist besonders wichtig.', 'Das Wort ist ein Link.', 'Das Wort wird gleich gelöscht.'], w: 'Die Rechtschreibprüfung kennt das Wort nicht. Vielleicht ist es falsch geschrieben. Prüfe selbst nach: Die Prüfung kennt nicht jedes richtige Wort.' },
      { f: 'Wie findest du heraus, wo im Text zu viele Leerzeichen und leere Absätze stecken?', a: 'die Steuerzeichen einblenden', x: ['den Text ausdrucken', 'die Schrift vergrößern', 'den Bildschirm heller stellen'], w: 'Die Steuerzeichen (¶ und ·) einblenden. Dann siehst du jedes Leerzeichen als Punkt und jedes Enter als ¶.' },
    ],
    S: { kats: ['gute Gewohnheit', 'schlechte Gewohnheit'], f: (b) => `<b>${b}</b>`, h: 'Gut ist, was auch dann noch passt, wenn sich der Text ändert.',
      items: [['Überschrift mit „zentriert“ in die Mitte setzen', 0], ['Neue Seite mit einem Seitenumbruch', 0], ['Erst schreiben, dann gestalten', 0], ['Formatvorlage „Überschrift 1“ verwenden', 0], ['Aufzählung über die Schaltfläche', 0], ['Mit 20 Leerzeichen einrücken', 1], ['Mit vielen Enter-Tasten auf die nächste Seite', 1], ['Jede Überschrift von Hand anders gestalten', 1], ['Am Zeilenende selbst Enter drücken', 1]] },
    A: { w: ['Die Textverarbeitung bricht Zeilen am Rand selbst um.', 'Enter drückt man nur am Ende eines Absatzes.'], f: ['Am Ende jeder Zeile muss man Enter drücken.', 'Leerzeichen sind der beste Weg, um Text auszurichten.'] },
  });

  // Tabellen: Zeile und Spalte finden
  function zelleFinden(art) {
    const NZ = R(3, 4), NS = R(3, 4), z = R(1, NZ), sp = R(1, NS), wort = pick(['Säge', 'Feile', 'Bohrer', 'Leim', 'Zange', 'Holz']);
    const zeilen = Array.from({ length: NZ }, (_, i) => Array.from({ length: NS }, (_, j) => (i + 1 === z && j + 1 === sp ? wort : '')));
    const fig = D.zeichne.tabelle({ kopf: Array.from({ length: NS }, (_, j) => `Spalte ${j + 1}`), breiten: Array.from({ length: NS }, () => 58), zeilen: zeilen.map((r) => r), name: 'Tabelle' });
    const ok = `Zeile ${z}, Spalte ${sp}`, falsch = [`Zeile ${sp}, Spalte ${z}`, `Zeile ${z}, Spalte ${sp === 1 ? 2 : sp - 1}`, `Zeile ${z === 1 ? 2 : z - 1}, Spalte ${sp}`, `Zeile ${z === NZ ? 1 : z + 1}, Spalte ${sp === NS ? 1 : sp + 1}`];
    const ch = shuffle([ok, ...shuffle([...new Set(falsch)].filter((x) => x !== ok)).slice(0, 3)]);
    return { prompt: `In welcher Zelle steht <b>${wort}</b>? (Die Kopfzeile zählt nicht mit.)`, figure: fig, choices: ch, correct: ch.indexOf(ok), hint: 'Zeilen liegen waagerecht und werden von oben gezählt, Spalten stehen senkrecht und werden von links gezählt.',
      solution: `${wort} steht in <b>${ok}</b>.`, ex: { mode: 'karte', nach: false, art, q: `Wo steht ${wort}?`, opts: [ok], ok: 0, merk: `<b>${ok}</b>: Zeilen waagerecht von oben, Spalten senkrecht von links.` } };
  }
  G.tabellen = baue('tc5-tabellen', {
    h: 'Eine Tabelle hat Zeilen (waagerecht) und Spalten (senkrecht). Ein einzelnes Kästchen heißt Zelle.',
    F: [
      { f: 'Wie heißen die <b>waagerechten</b> Reihen einer Tabelle?', a: 'Zeilen', x: ['Spalten', 'Zellen', 'Absätze'], w: 'Spalten stehen senkrecht wie Säulen.' },
      { f: 'Wie heißt ein einzelnes Kästchen einer Tabelle?', a: 'Zelle', x: ['Spalte', 'Zeile', 'Feld der Menüleiste'], w: 'Dort, wo sich eine Zeile und eine Spalte kreuzen, liegt eine Zelle.' },
      { f: 'Wozu dient die <b>Kopfzeile</b> einer Tabelle?', a: 'Sie benennt die Spalten.', x: ['Sie enthält die Summe.', 'Sie ist immer leer.', 'Sie zeigt das Datum.'], w: 'Sie sagt, was in jeder Spalte steht. In einer Stückliste stehen dort zum Beispiel Pos., Menge, Benennung, Werkstoff, Maße.' },
      { f: 'Wie veränderst du ein Bild, ohne es zu <b>verzerren</b>?', a: 'an einer Ecke ziehen', x: ['nur an der Seite ziehen', 'nur oben ziehen', 'das geht nicht'], w: 'An der Ecke bleibt das Seitenverhältnis gleich, an der Seite wird das Bild gestaucht.' },
      { f: 'Was musst du angeben, wenn du ein Bild aus dem Internet verwendest?', a: 'Quelle und Urheber', x: ['nichts', 'nur die Dateigröße', 'nur das Datum'], w: 'Die Quelle und den Urheber. Bilder gehören dem, der sie gemacht hat. Manche darf man mit Namensnennung verwenden.' },
      { f: 'Was bedeutet „Text <b>umfließt</b> das Bild“?', a: 'Der Text läuft um das Bild.', x: ['Der Text steht im Bild.', 'Der Text wird gelöscht.', 'Das Bild wird zum Hintergrund.'], w: 'Der Text läuft rund um das Bild herum. Diese Einstellung heißt Textumbruch.' },
    ],
    T: [{ f: 'Die senkrechten Reihen einer Tabelle heißen ___.', a: ['Spalten', 'Spalte'], w: 'Wie Säulen.' }],
    extra: { zelleFinden: () => zelleFinden('zelleFinden') },
  }, { zelleFinden: 26 });

  // =====================================================
  // Bereich 3: Im Netz: suchen, prüfen, mailen
  // =====================================================
  G.medien = baue('tc5-medien', {
    h: 'Digitale Medien sind erweiterbar (Links), interaktiv (mitmachen), immer verfügbar und schnell aktuell. Gedruckte bleiben, wie sie sind.',
    F: [
      { f: 'Was ist ein Vorteil eines <b>gedruckten</b> Buchs?', a: 'Es braucht keinen Strom.', x: ['Es ist immer auf dem neuesten Stand.', 'Man kann darin auf Links tippen.', 'Es zeigt Videos.'], w: 'Es braucht keinen Strom und verändert sich nicht. Was gedruckt ist, bleibt so. Das macht es verlässlich, aber nicht aktuell.' },
      { f: 'Was ist ein Vorteil eines <b>Online-Lexikons</b>?', a: 'Es kann jederzeit ergänzt und berichtigt werden.', x: ['Es braucht keinen Strom.', 'Es ändert sich nie.', 'Man kann es nicht verlieren, weil es aus Papier ist.'], w: 'Digitale Medien sind aktuell. Dafür muss man prüfen, was gerade drinsteht.' },
      { f: 'Was bedeutet: Digitale Medien sind <b>interaktiv</b>?', a: 'Man kann mitmachen.', x: ['Sie sind immer kostenlos.', 'Sie sind aus Papier.', 'Sie sind besonders alt.'], w: 'Man kann mitmachen: klicken, antworten, auswählen. Zum Beispiel ein Lernspiel, ein Quiz oder eine Karte, die man verschieben kann.' },
      { f: 'Was bedeutet: Digitale Medien sind <b>erweiterbar</b>?', a: 'Links führen zu mehr Inhalten.', x: ['Man kann sie größer drucken.', 'Sie werden mit der Zeit schwerer.', 'Sie haben mehr Seiten als Bücher.'], w: 'Über Links kommt man zu weiteren Inhalten, und man kann Neues ergänzen. Ein Link verbindet eine Seite mit einer anderen.' },
      { f: 'Was bedeutet: Digitale Medien sind <b>verfügbar</b>?', a: 'Man erreicht sie fast immer.', x: ['Sie kosten nichts.', 'Sie sind immer richtig.', 'Man muss sie ausleihen.'], w: 'Man kommt fast überall und jederzeit an sie heran. Mit Handy und Netz hast du eine riesige Bücherei in der Tasche.' },
    ],
    S: { kats: ['aktuell', 'interaktiv', 'erweiterbar', 'verfügbar'], f: (b) => `<b>${b}</b>: Welches Merkmal digitaler Medien zeigt das?`, h: 'Neu? Mitmachen? Weiterklicken? Überall?',
      items: [['Die Wetter-App zeigt den Regen von gerade eben.', 0], ['Die Nachrichtenseite meldet ein Tor eine Minute nach dem Schuss.', 0], ['Im Lernvideo beantwortest du zwischendurch Fragen.', 1], ['Auf der Karte im Netz kannst du heranzoomen.', 1], ['Ein Link führt zu einem Video über Zahnräder.', 2], ['Unter dem Artikel steht: „Mehr dazu“.', 2], ['Du liest das E-Book im Bus.', 3], ['Du schaust nachts um zwölf im Online-Lexikon nach.', 3]] },
    A: { w: ['Ein gedrucktes Buch braucht keinen Strom.', 'Im Netz kann sich ein Text über Nacht ändern.'], f: ['Was im Internet steht, ist immer richtig.', 'Gedruckte Bücher sind immer aktueller als das Internet.'] },
  });

  G.browser = baue('tc5-browser', {
    h: 'Der Browser ist das Programm, mit dem du Webseiten ansiehst. Oben steht die Adressleiste. Ein Link führt zu einer anderen Seite.',
    B: { svg: 'browser', teile: ['Registerkarte (Tab)', 'Zurück-Knopf', 'Adressleiste', 'Link', 'Neu laden'],
      was: { 'Registerkarte (Tab)': 'Jede Registerkarte zeigt eine eigene Webseite.', 'Zurück-Knopf': 'Er führt zur vorigen Seite.', Adressleiste: 'Hier steht die Internetadresse der Seite.', Link: 'Ein Klick darauf öffnet eine andere Seite.', 'Neu laden': 'Lädt die Seite noch einmal, zum Beispiel wenn sie hängt.' } },
    F: [
      { f: 'Was ist ein <b>Browser</b>?', a: 'ein Programm für Webseiten', x: ['eine Suchmaschine', 'ein Teil der Hardware', 'eine Webseite für Spiele'], w: 'Ein Programm, um Webseiten anzuzeigen. Bekannte Browser: Firefox, Chrome, Edge, Safari.' },
      { f: 'Was ist der Unterschied zwischen <b>Browser</b> und <b>Suchmaschine</b>?', a: 'Der Browser zeigt Seiten, die Suchmaschine findet sie.', x: ['Es gibt keinen Unterschied.', 'Die Suchmaschine ist ein Gerät.', 'Der Browser findet Seiten, die Suchmaschine zeigt sie an.'], w: 'Der Browser zeigt Webseiten an. Die Suchmaschine ist eine Webseite, die andere Seiten findet. Du öffnest die Suchmaschine im Browser.' },
      { f: 'Was ist ein <b>Link</b>?', a: 'eine Verknüpfung', x: ['ein Fehler auf der Seite', 'ein Passwort', 'eine Werbeanzeige'], w: 'Eine Verknüpfung, die beim Anklicken eine andere Seite öffnet. Links sind oft blau oder unterstrichen. Der Mauszeiger wird zur Hand.' },
      { f: 'Wie heißen gespeicherte Adressen, die du schnell wieder öffnen willst?', a: 'Lesezeichen', x: ['Verlauf', 'Cookies', 'Downloads'], w: 'Lesezeichen (Favoriten). Der Verlauf dagegen merkt sich von selbst, welche Seiten du besucht hast.' },
    ],
    T: [{ f: 'Das Programm zum Ansehen von Webseiten heißt ___.', a: 'Browser', w: 'Englisch to browse = stöbern.' }],
    extra: { urlTeile: () => U.urlTeile('urlTeile') },
  }, { beschriften: 26, urlTeile: 26 });

  G.suchen = baue('tc5-suchen', {
    h: 'Wenige, treffende Suchwörter statt ganzer Sätze. Treffer erst lesen (Titel, Adresse, Kurztext), dann klicken. Werbung ist als „Anzeige“ gekennzeichnet.',
    F: [
      { f: 'Du willst wissen, <b>wie schwer ein Dachs wird</b>. Was tippst du am besten ein?', a: 'Dachs Gewicht', x: ['Ich möchte bitte gerne wissen, wie schwer so ein Dachs eigentlich wird', 'Tier', 'schwer'], w: 'Zwei, drei treffende Stichwörter reichen meist.' },
      { f: 'Was bewirken <b>Anführungszeichen</b> bei der Suche, zum Beispiel "rotes Zahnrad"?', a: 'Sie sucht genau diese Wortgruppe.', x: ['Die Wörter werden ausgeschlossen.', 'Nur Bilder werden gesucht.', 'Nichts.'], w: 'Es werden Seiten mit genau dieser Wortgruppe gesucht. So findest du genaue Zitate oder feste Begriffe.' },
      { f: 'Was bedeutet „<b>Anzeige</b>“ oder „Gesponsert“ bei einem Treffer?', a: 'Das ist bezahlte Werbung.', x: ['Das ist der beste Treffer.', 'Die Seite ist geprüft.', 'Die Seite ist kostenlos.'], w: 'Diese Treffer stehen oben, weil jemand dafür bezahlt hat, nicht weil sie am besten passen.' },
      { f: 'Welche Suchmaschinen sind extra für <b>Kinder</b> gemacht?', a: 'fragFINN', x: ['Es gibt keine.', 'Nur Videoseiten.', 'Online-Shops'], w: 'Auch Blinde Kuh ist eine Kindersuchmaschine. FragFINN und Blinde Kuh. Sie zeigen nur Seiten, die für Kinder geprüft sind.' },
      { f: 'Was liest du, <b>bevor</b> du einen Treffer anklickst?', a: 'Titel, Adresse und Kurztext', x: ['nichts, man klickt immer den ersten', 'nur die Zahl der Treffer', 'nur die Werbung'], w: 'Titel, Internetadresse und den kurzen Text darunter. Schon die Adresse verrät viel: Lexikon, Zeitung, Shop oder Spieleseite?' },
      { f: 'Was machst du, wenn du <b>zu viele</b> Treffer bekommst?', a: 'genauere Suchwörter wählen', x: ['alle Treffer lesen', 'aufgeben', 'den Computer neu starten'], w: 'Genauere Suchwörter wählen oder eines dazunehmen. Zum Beispiel statt „Getriebe“ lieber „Getriebe Fahrrad Gangschaltung“.' },
    ],
    O: [{ t: 'Bring das Vorgehen bei einer Recherche in die richtige Reihenfolge.', items: ['Frage genau überlegen', 'Suchwörter auswählen', 'Treffer lesen: Titel und Adresse', 'passende Seite öffnen', 'mit einer zweiten Quelle vergleichen', 'Quelle notieren'], n: 5, w: 'Erst denken, dann suchen, dann prüfen.' }],
    T: [{ f: 'Bezahlte Treffer sind als ___ gekennzeichnet.', a: ['Anzeige', 'Werbung', 'gesponsert'], w: 'Oft ganz oben in der Liste.' }],
  });

  G.quellen = baue('tc5-quellen', {
    h: 'Prüfe: Wer hat es geschrieben? Wann? Warum? Steht es auch in anderen guten Quellen? Gibt es ein Impressum?',
    F: [
      { f: 'Woran erkennst du, <b>wer</b> hinter einer Webseite steckt?', a: 'am Impressum', x: ['an der Farbe der Seite', 'an der Zahl der Bilder', 'am Wetterbericht'], w: 'In Deutschland müssen die meisten Webseiten ein Impressum mit Namen und Anschrift haben.' },
      { f: 'Wie prüfst du am besten, ob eine Angabe <b>stimmt</b>?', a: 'andere Quellen prüfen', x: ['einfach glauben', 'die Seite neu laden', 'schauen, ob sie bunt ist'], w: 'In mindestens einer weiteren guten Quelle nachsehen. Wenn verschiedene, verlässliche Quellen dasselbe sagen, stimmt es wahrscheinlich.' },
      { f: 'Eine Seite will dir vor allem etwas <b>verkaufen</b>. Was bedeutet das?', a: 'Sie lobt ihr Produkt wohl zu sehr.', x: ['Alles darauf ist besonders genau.', 'Sie ist besonders aktuell.', 'Sie ist eine Kindersuchmaschine.'], w: 'Sie stellt ihr Produkt vermutlich besser dar, als es ist. Frag immer: Warum wurde das geschrieben?' },
      { f: 'Eine Überschrift lautet: „UNGLAUBLICH! Das verschweigen alle!!!“ Was ist davon zu halten?', a: 'Vorsicht, das klingt unseriös.', x: ['Das stimmt bestimmt.', 'Das ist eine Seite der Schule.', 'Das ist ein Lexikon.'], w: 'Vorsicht: So locken oft unseriöse Seiten oder Falschmeldungen. Großbuchstaben, viele Ausrufezeichen und Geheimnisse sollen neugierig machen, nicht informieren.' },
      { f: 'Warum ist das <b>Datum</b> eines Artikels wichtig?', a: 'Alte Angaben können inzwischen überholt sein.', x: ['Es ist nicht wichtig.', 'Ältere Artikel sind immer richtiger.', 'Das Datum zeigt, wie lang der Text ist.'], w: 'Zum Beispiel Einwohnerzahlen oder Preise ändern sich.' },
      { f: 'Kann man einem <b>Foto</b> im Netz immer glauben?', a: 'Nein, Fotos können bearbeitet sein.', x: ['Ja, Fotos lügen nie.', 'Ja, wenn sie bunt sind.', 'Ja, wenn sie oft geteilt wurden.'], w: 'Nein, Fotos können bearbeitet oder aus einem anderen Zusammenhang sein. Auch Fotos und Videos sollte man prüfen.' },
    ],
    S: { kats: ['spricht für eine gute Quelle', 'spricht dagegen'], f: (b) => `<b>${b}</b>`, h: 'Gut: Wer, wann, woher ist klar. Schlecht: kein Absender, Werbung, Übertreibung.',
      items: [['Es gibt ein Impressum mit Name und Anschrift.', 0], ['Der Artikel nennt seine Quellen.', 0], ['Ein Datum zeigt, wie aktuell der Text ist.', 0], ['Andere gute Seiten sagen dasselbe.', 0], ['Kein Name, keine Anschrift, kein Datum', 1], ['Überall blinkt Werbung.', 1], ['„SENSATION!!! Teile das sofort!“', 1], ['Die Seite will dir vor allem etwas verkaufen.', 1]] },
    T: [{ f: 'Die Angaben, wer eine Webseite betreibt, stehen im ___.', a: 'Impressum', w: 'Meist ganz unten auf der Seite verlinkt.' }],
  });

  G.frei = baue('tc5-frei', {
    h: 'Wikipedia schreiben Freiwillige. Open Source heißt: Jeder darf das Programm ansehen, verbessern und weitergeben. Bilder gehören ihrem Urheber, freie Lizenzen erlauben die Nutzung mit Namensnennung.',
    F: [
      { f: 'Wer schreibt die <b>Wikipedia</b>?', a: 'viele Freiwillige', x: ['nur Lehrkräfte', 'ein einziger Verlag', 'ein Computerprogramm'], w: 'Viele Freiwillige, jeder kann mitschreiben. Andere prüfen die Änderungen. Fehler sind trotzdem möglich. Achte auf die Einzelnachweise.' },
      { f: 'Was bedeutet <b>Open Source</b>?', a: 'Der Bauplan ist offen.', x: ['Das Programm ist kaputt.', 'Das Programm ist geheim.', 'Das Programm läuft nur im Freien.'], w: 'Der Bauplan (Quelltext) eines Programms ist offen: Jeder darf ihn ansehen, verbessern und weitergeben. Beispiele: Firefox, LibreOffice, Linux.' },
      { f: 'Was sind <b>OER</b>?', a: 'freie Bildungsmaterialien', x: ['Spiele für die Pause', 'geheime Prüfungsaufgaben', 'Teile eines Computers'], w: 'Freie Bildungsmaterialien, die man nutzen und weitergeben darf. OER steht für Open Educational Resources, englisch für offene Bildungsmaterialien.' },
      { f: 'Darfst du ein Bild aus dem Internet einfach in deine Schülerzeitung im Netz stellen?', a: 'Nur, wenn die Lizenz es erlaubt.', x: ['Ja, alles im Internet ist frei.', 'Ja, wenn du es kleiner machst.', 'Ja, wenn du es umbenennst.'], w: 'Nein, nur wenn die Lizenz es erlaubt, und dann mit Namen des Urhebers. Das Urheberrecht schützt Bilder, Texte und Musik.' },
      { f: 'Was erlaubt eine <b>Creative-Commons-Lizenz</b> wie „CC BY“?', a: 'Das Werk zu nutzen, wenn man den Urheber nennt', x: ['Das Werk zu verkaufen, ohne zu fragen', 'Gar nichts', 'Den eigenen Namen daruntersetzen'], w: 'BY heißt „von“: Nenne, von wem es ist.' },
    ],
    S: { kats: ['freie Software (Open Source)', 'nicht freie Software'], f: (b) => `<b>${b}</b>`, h: 'Open Source: Bauplan offen, jeder darf mitmachen.',
      items: [['Firefox', 0], ['LibreOffice', 0], ['Linux', 0], ['GIMP (Bildbearbeitung)', 0], ['VLC (Videoabspieler)', 0], ['Windows', 1], ['macOS', 1], ['Microsoft Word', 1], ['Photoshop', 1]] },
    A: { w: ['Auch Bilder im Internet haben einen Urheber.', 'Firefox ist Open Source.'], f: ['Alles im Internet darf jeder frei verwenden.', 'Wikipedia wird von einer einzigen Person geschrieben.'] },
  });

  G.gefahren = baue('tc5-gefahren', {
    h: 'Private Daten bleiben privat. Passwörter nie weitergeben. Bei Ärger oder komischen Nachrichten: nicht antworten, Beweise sichern, Erwachsenen Bescheid sagen.',
    F: [
      { f: 'Eine Nachricht sagt: „Dein Konto wird gesperrt! Gib hier sofort dein Passwort ein.“ Was tust du?', a: 'Nichts eingeben, Erwachsenen Bescheid sagen.', x: ['Schnell das Passwort eingeben.', 'Die Nachricht an alle weiterleiten.', 'Ein neues, kürzeres Passwort eingeben.'], w: 'Nichts eingeben und Erwachsenen Bescheid sagen. Das ist wahrscheinlich ein Betrug. Solche Fallen heißen Phishing (gesprochen wie Fisching): Passwörter „angeln“.' },
      { f: 'Jemand verbreitet gemeine Sachen über dich im Klassenchat. Was hilft?', a: 'Beweise sichern und Erwachsene holen', x: ['alles löschen und niemandem erzählen', 'genauso gemein zurückschreiben', 'das Handy für immer wegwerfen'], w: 'Nicht zurückschimpfen, Bildschirmfotos als Beweis machen, Eltern oder Lehrkraft Bescheid sagen. Das heißt Cybermobbing. Hilfe gibt es auch kostenlos bei der Nummer gegen Kummer: 116 111.' },
      { f: 'Ein Spiel bietet „Diamanten“ für echtes Geld an. Was ist die Gefahr?', a: 'Man gibt schnell viel Geld aus.', x: ['Die Diamanten sind echt.', 'Das Spiel wird langsamer.', 'Es gibt keine Gefahr.'], w: 'Man gibt schnell viel Geld aus, oft ohne es zu merken. Solche Käufe in Apps heißen In-App-Käufe. Eltern können sie sperren.' },
      { f: 'Jemand Fremdes im Chat will sich mit dir allein treffen und sagt, du sollst es geheim halten. Was tust du?', a: 'sofort den Eltern davon erzählen', x: ['hingehen, er war doch nett', 'das Geheimnis für dich behalten', 'deine Adresse schicken'], w: 'Nicht darauf eingehen und sofort Eltern oder einer anderen Vertrauensperson davon erzählen. Im Netz kann sich jeder als jemand anderes ausgeben. Solche Geheimnisse sind schlechte Geheimnisse.' },
      { f: 'Was gehört <b>nicht</b> in ein öffentliches Profil?', a: 'Adresse und Handynummer', x: ['ein Spitzname', 'das Lieblingstier', 'ein selbst gemaltes Bild ohne Namen'], w: 'Mit Adresse und Nummer kann dich jeder finden und anrufen.' },
      { f: 'Eine Mail mit unbekanntem Absender hat einen Anhang „rechnung.exe“. Was tust du?', a: 'nicht öffnen, Erwachsenen zeigen', x: ['sofort öffnen', 'an Freunde weiterleiten', 'mit dem eigenen Passwort beantworten'], w: 'Nicht öffnen, sondern löschen oder Erwachsenen zeigen. Programme in Anhängen können Schadprogramme (Viren) sein.' },
      { f: 'Ein Kettenbrief droht: „Wenn du das nicht an 10 Leute schickst, passiert dir etwas Schlimmes!“', a: 'nicht weiterschicken, löschen', x: ['sofort an 10 Leute schicken', 'an 100 Leute schicken, sicher ist sicher', 'der Polizei melden, dass du in Gefahr bist'], w: 'Nicht weiterschicken: Das ist Unsinn und soll nur Angst machen. Kettenbriefe sind erfunden. Du darfst sie einfach löschen.' },
    ],
    S: { kats: ['meist unbedenklich', 'privat: nicht öffentlich teilen'], f: (b) => `<b>${b}</b>`, h: 'Alles, womit dich ein Fremder finden, erreichen oder bloßstellen könnte, bleibt privat.',
      items: [['Lieblingsfarbe', 0], ['Lieblingsbuch', 0], ['Meinung zu einem Film', 0], ['selbst gemaltes Bild ohne Namen', 0], ['Wohnadresse', 1], ['Handynummer', 1], ['Passwort', 1], ['Name der Schule', 1], ['Urlaubsfotos, während niemand zu Hause ist', 1], ['Fotos von anderen ohne deren Erlaubnis', 1]] },
    T: [{ f: 'Gefälschte Nachrichten, die nach deinem Passwort fragen, nennt man ___.', a: ['Phishing', 'Fishing'], w: 'Gesprochen wie Fisching: Sie wollen Passwörter angeln.' }],
  });

  G.email = baue('tc5-email', {
    h: 'Eine E-Mail-Adresse: Benutzername @ Anbieter. In die Mail gehören Empfänger, ein klarer Betreff, Anrede, Text und Gruß.',
    B: { svg: 'mail', teile: ['Empfänger (An)', 'Kopie an (Cc)', 'Betreff', 'Anhang', 'Senden', 'Nachricht (Text)'],
      was: { 'Empfänger (An)': 'An diese Adresse geht die Mail.', 'Kopie an (Cc)': 'Diese Person bekommt eine Kopie. Alle sehen, wer sie bekommt.', Betreff: 'Kurz und klar: worum es geht.', Anhang: 'Eine Datei, die mitgeschickt wird.', Senden: 'Erst klicken, wenn alles fertig ist.', 'Nachricht (Text)': 'Mit Anrede, Text und Gruß.' } },
    F: [
      { f: 'Was ist der Unterschied zwischen <b>Antworten</b> und <b>Weiterleiten</b>?', a: 'Weiterleiten schickt sie an jemand Neues.', x: ['Es gibt keinen Unterschied.', 'Weiterleiten löscht die Mail.', 'Antworten schickt die Mail an alle.'], w: 'Antworten geht an den Absender zurück. Antworten geht an den Absender zurück, Weiterleiten schickt die Mail an jemand Neues. „Allen antworten“ schickt die Antwort an alle, die die Mail bekommen haben.' },
      { f: 'Was gehört in den <b>Betreff</b>?', a: 'worum es geht', x: ['der ganze Text', 'das Passwort', 'nichts, er bleibt leer'], w: 'Kurz, worum es in der Mail geht. Zum Beispiel: „Stückliste für den Leuchter“.' },
      { f: 'Was ist ein <b>Anhang</b>?', a: 'eine mitgeschickte Datei', x: ['der letzte Satz der Mail', 'ein zweiter Empfänger', 'die Unterschrift'], w: 'Eine Datei, die mit der Mail mitgeschickt wird. Man erkennt ihn an der Büroklammer.' },
      { f: 'Was bedeutet <b>Cc</b>?', a: 'Kopie an', x: ['geheime Kopie', 'Mail löschen', 'Mail später senden'], w: 'Kopie an: Diese Person bekommt die Mail auch, und alle sehen das. Bei Bcc (Blindkopie) sehen die anderen nicht, wer noch eine Kopie bekommt.' },
      { f: 'Wie heißt unerwünschte Werbe- oder Betrugspost im Postfach?', a: 'Spam', x: ['Cc', 'Anhang', 'Betreff'], w: 'Spam einfach löschen, nicht antworten, keine Links anklicken.' },
      { f: 'Wie schreibst du einer Lehrkraft eine <b>höfliche</b> Mail?', a: 'mit Anrede, klarem Text und Gruß', x: ['ohne Anrede, alles in Großbuchstaben', 'nur mit einem Smiley', 'ohne Namen, damit es geheim bleibt'], w: 'Mit Anrede („Sehr geehrte …“ oder „Liebe …“), klarem Text und Gruß mit deinem Namen. Großbuchstaben wirken wie Schreien.' },
    ],
    extra: { mailAdresse: () => U.mailAdresse('mailAdresse') },
  }, { beschriften: 24, mailAdresse: 26 });

  G.zusammen = baue('tc5-zusammen', {
    h: 'Gemeinsam arbeiten: Dateien mit klarem Namen und Datum austauschen, freundlich schreiben, nur nötige Daten teilen, Fotos anderer nur mit Erlaubnis.',
    F: [
      { f: 'Ihr arbeitet zu dritt an einem Text. Wie vermeidet ihr, dass jemand die Arbeit der anderen <b>überschreibt</b>?', a: 'Fassungen mit Nummer speichern: plakat_v3', x: ['Alle speichern unter demselben Namen.', 'Gar nicht speichern.', 'Jeder löscht vorher die Datei der anderen.'], w: 'Jede neue Fassung mit Datum oder Nummer im Namen speichern, zum Beispiel plakat_v3. Oder ihr arbeitet gemeinsam in einem Dokument auf der Lernplattform.' },
      { f: 'Was ist eine <b>Lernplattform</b>?', a: 'eine Seite für Schule und Klasse', x: ['ein Bahnsteig vor der Schule', 'ein Spiel', 'ein Drucker'], w: 'Eine Seite im Internet, auf der Schule, Klasse und Lehrkräfte Aufgaben, Dateien und Nachrichten austauschen. In Sachsen nutzen viele Schulen LernSax.' },
      { f: 'Was bedeutet Schreiben in <b>GROSSBUCHSTABEN</b> im Chat?', a: 'Es wirkt wie Schreien.', x: ['Es wirkt besonders höflich.', 'Es ist geheim.', 'Es ist schneller zu lesen.'], w: 'Freundliche Regeln im Netz heißen auch Netiquette (Netz + Etikette).' },
      { f: 'Darfst du ein Foto deiner Mitschülerin in den Klassenchat stellen?', a: 'nur, wenn sie es erlaubt', x: ['immer', 'nur, wenn es lustig ist', 'nur abends'], w: 'Jeder darf selbst bestimmen, wo Fotos von ihm auftauchen (Recht am eigenen Bild).' },
      { f: 'Was heißt <b>Datenschutz</b>?', a: 'persönliche Daten schützen', x: ['Daten auf einer Festplatte schützen, damit sie nicht nass wird', 'alle Daten löschen', 'Daten in Großbuchstaben schreiben'], w: 'Persönliche Daten schützen und nur weitergeben, was wirklich nötig ist. Persönliche Daten sind zum Beispiel Name, Adresse, Geburtstag, Fotos.' },
    ],
    S: { kats: ['freundlich und fair', 'unfreundlich oder unfair'], f: (b) => `<b>${b}</b>`, h: 'Würdest du das auch jemandem ins Gesicht sagen?',
      items: [['„Danke für die Datei, ich schau sie mir an!“', 0], ['Erst nachdenken, dann senden', 0], ['„Kannst du mir bitte die Tabelle schicken?“', 0], ['Beim Teilen fremder Dateien den Namen nennen', 0], ['„DU HAST ALLES FALSCH GEMACHT!!!“', 1], ['Peinliches Foto ohne Erlaubnis posten', 1], ['Andere aus dem Gruppenchat ausschließen', 1], ['Die Datei der anderen einfach überschreiben', 1]] },
    T: [{ f: 'Freundliche Regeln für das Netz heißen auch ___.', a: ['Netiquette', 'Netikette'], w: 'Aus Netz und Etikette.' }],
  });
})();
