# LernDax – Projektstand & Gedächtnis

**Stand: 12.11.2026, Version `lerndax-v43`** · **Zuerst Abschnitt 0 lesen (Übergabe).** Diese Datei ist das Gedächtnis des Projekts. Sie enthält alles, was in
den Chats mit Claude besprochen, entschieden und gebaut wurde, damit ein neuer Chat (oder ein
Mensch) ohne Vorwissen weitermachen kann.

**Bitte nach jeder Änderung aktualisieren:** Abschnitt „Was fertig ist“, „Offene Punkte“ und
unten den „Verlauf“.

Weitere Dokumente:
- `README.md`: Projektsteckbrief, Grundsätze, Ordner, neues Fach hinzufügen, Fahrplan
- `SETUP.md`: Kurzanleitung für Eltern (Anmelden, Profil, PIN, App aufs Handy)
- `tests/README.md`: automatische Tests
- `faecher/README.md`: **Fächerplan** (alle Fächer, Namen, Klassen, Fahrplan in drei Phasen)
- `faecher/mathe/lehrplan/sachsen-gymnasium.md`: Lehrplan Mathe Gymnasium Sachsen, Klasse 5–10
- `faecher/mathe/lehrplan/schulbuch-abgleich.md`: Abgleich MaDax ↔ Schulbuch (Lambacher Schweizer 5 Sachsen)
- `faecher/deutsch/README.md`: **Startpunkt für DeDax** (Deutsch), Vorgehen und offene Fragen
- `notizen/feedback.md`: offene Fragen an das Kind und Vorlage für Testrunden (nur lokal, nicht auf GitHub)
- `notizen/familie.md`: persönliche Angaben (Kind, Schule, Geräte, Termine, Pfade). **Nur lokal**, weil
  dieses Repository öffentlich ist. Diese Datei hier bleibt deshalb bewusst neutral.

---

## 0. Übergabe vom 12.11.2026: Stand und nächster Schritt (DeDax)

**Wo wir stehen**
- **MaDax Klasse 5 ist inhaltlich fertig** (Version `lerndax-v43`, live). 36 Themen in 5 Lernbereichen, in der
  Reihenfolge des Schulbuchs (Lambacher Schweizer 5 Sachsen). Abgeglichen mit dem Schulbuch
  (`faecher/mathe/lehrplan/schulbuch-abgleich.md`) und mit dem Originaltext des Lehrplans
  (`faecher/mathe/lehrplan/sachsen-gymnasium.md`, Abschnitt „Abgleich mit dem Lehrplantext“).
- Jedes Thema hat: Aufgaben mit Tipp und Lösungsweg, eigenes Symbol, Erklär-Animation (frei, „ähnliches Beispiel“,
  „Lösung zu deiner Aufgabe“) und **Knobel-Aufgaben** (schwerer, freiwillig, zählen nicht für die Sterne).
- „Entdecken“ hat 16 Staunen-Momente (neu: Römische Zahlen, Zählen wie ein Computer).
- Startseite von MaDax: „Weiter üben“, Entdecken/Knobeln nebeneinander, Fortschritt je Lernbereich, fertige
  Lernbereiche eingeklappt. Sterne mit dunklem Rand, Geodreieck als vergrößerter Ausschnitt.
- Noch **nicht abgenommen**: Der erste Test mit dem Kind ist für **Freitag, 13.11.2026** geplant.

**Entscheidungen des Auftraggebers in dieser Runde (12.11.2026)**
- Fächernamen: Stundenplan-Kürzel + „Dax“ (MaDax, DeDax, EnDax …), Dachs mit Fach-Hut (siehe `faecher/README.md`).
- MaDax bleibt genau am sächsischen Lehrplan; alles darüber hinaus gehört in „Entdecken“.
- Reihenfolge: erst MaDax rund, dann ein neues Fach. **Jetzt beginnt DeDax (Deutsch, Klasse 5)** in einem neuen Chat.
- Knobel-Stufe: gebaut, für alle Themen. Klassen-Leiste 1–10 bleibt, wie sie ist.

**Offen bei MaDax (wartet auf den Auftraggeber oder den Test)**
1. Rückmeldungen aus dem Test mit dem Kind einarbeiten (Schwierigkeit, Verständlichkeit, Lesbarkeit des Geodreiecks,
   findet es sich auf der Startseite zurecht, bleibt eine Animation hängen).
2. Schriftliches Minus: Rechnet die Klasse mit **Ergänzen** oder **Entbündeln**? Danach die passende Animation bauen
   (bisher zeigt die Lösung nur die Probe mit Plus).
3. Schrägbild: Annahme „Kanten nach hinten unter 45°, halb so lang“ mit dem Buch abgleichen.
4. Prüfen, ob das Schulbuch die ISBN 978-3-12-733150-9 hat (Grundlage des Buch-Abgleichs).
5. Oberflächeninhalt zusammengesetzter Körper (bisher nur Volumen).
6. Danach „MaDax Klasse 5 abnehmen“.
Die Trainingsseite für die Arbeit am 24.11.2026 ist unverändert (8 Themen aus der Themenliste der Schule).

**Nächster Schritt: DeDax**
Startpunkt und Vorgehen stehen in **`faecher/deutsch/README.md`**. Kurz: erst Lehrplan Deutsch Klasse 5 auswerten und
mit dem Schulbuch abgleichen, dem Auftraggeber einen Themenplan mit Optionen vorlegen, dann bauen. Vor dem Bauen
klären, wie die gemeinsamen Teile aus `web/mathe/index.html` (Übungsrunde, Sterne, Knobeln, Player, Elternbereich)
für ein zweites Fach wiederverwendet werden, statt sie zu kopieren.

**So wird hier gearbeitet (hat sich bewährt)**
- Der Auftraggeber programmiert nicht. Antworten auf Deutsch, kurz, ohne Fachwörter. Er entscheidet gern anhand von
  **Optionen**; Fragen einzeln stellen (mehrere auf einmal gingen schief). Bilder zeigen statt beschreiben.
- Es kann eine **parallele Sitzung** am selben Projekt geben: vor jedem Hochladen `git fetch` und nur vorspulen
  (fast-forward); vor dem Schreiben in den OneDrive-Ordner prüfen, dass dort nichts Fremdes geändert wurde
  (Dateigrößen mit dem letzten eigenen Stand vergleichen).
- Nach jeder Änderung: `VERSION` in `web/sw.js` erhöhen, auf GitHub hochladen, `STAND.md` ergänzen, geänderte Dateien
  in den OneDrive-Ordner kopieren. Kopieren und Zurückschreiben nie im selben Schritt (sonst landet ein alter Stand dort).
- Tests vor dem Hochladen (alle in `tests/`, Beschreibung in `tests/README.md`): `ui2.py` (jede Aufgabe wird in der
  App gelöst), `loesung.py` (Lösungs-Animationen, auch Texte außerhalb des Bildes), `knobel.py`, `bild_audit.py`
  (Beschriftungen in Bildern), `design_audit.py`, `sync_test.py`, `training.py`, `hub.py`.
- Lehren aus MaDax: (1) Lehrplan **und** Schulbuch **am Originaltext** abgleichen, nicht aus dem Gedächtnis.
  (2) Jede neue Aufgabenart braucht eine passende Animation für „Lösung zu deiner Aufgabe“, sonst zeigt der Player
  etwas Unpassendes. (3) Bilder immer mit `bild_audit.py` prüfen; Figuren dürfen nicht „fast“ wie etwas anderes
  aussehen (Drachenviereck mit 87°). (4) Zusatz-Aufgaben nicht in Themen legen, die in einer Trainingsseite stecken.

---

## 1. Worum es geht

- **Für wen:** zuerst ein Kind in Klasse 5 (Gymnasium, Sachsen). Mit ihm wächst LernDax bis
  Klasse 10. Später eventuell Klassenkameraden (Trainingsseiten per Link), irgendwann vielleicht
  öffentlich (siehe Abschnitt 9). Persönliches steht in `notizen/familie.md` (nur lokal).
- **Geräte:** Das Kind hat **kein eigenes Handy**. Geübt wird an einem **Eltern-Handy (iPhone)**, am
  **Computer** und gelegentlich am **Tablet**. Deshalb muss alles auf allen drei gut aussehen und
  der Lernstand zwischen den Geräten synchronisiert sein.
- **Übungsziel:** **eine Runde pro Tag** (Tagesziel, freundlich angezeigt, ohne Druck).
- **Auftraggeber:** der Vater („Auftraggeber“ in dieser Datei). Er programmiert nicht selbst;
  Claude baut, der Auftraggeber entscheidet und testet. Kommunikation auf Deutsch, verständlich, ohne Fachchinesisch.
- **Ziel:** Schulstoff **verstehen statt pauken**. Wichtigstes Vorbild: die Videos von
  **3Blue1Brown**: anschauliche, animierte Erklärungen, die zeigen *warum* etwas stimmt.
- **Was die App können soll:**
  1. Üben mit unendlich vielen, zufällig erzeugten Aufgaben, passend zum sächsischen Lehrplan.
  2. Erklär-Animationen zu jedem Thema, die man pausieren und verlangsamen kann.
  3. Vor dem Antworten ein ähnliches Beispiel, nach dem Antworten die Lösung genau dieser Aufgabe.
  4. „Entdecken“: Staunen-Momente und visuelle Beweise, die neugierig machen.
  5. Fortschritt auf allen Geräten gleich (Handy, Tablet, Computer).
- **Schulbücher (Klasse 5):**
  - Mathe: **Lambacher Schweizer 5, Mathematik für Gymnasien, Sachsen** (Klett)
  - Deutsch: **Deutschbuch 5 Gymnasium** (Cornelsen, Ausgabe „Mit digitalen Medien“)
  - Englisch: **Green Line 1** (Klett)
  Aufgaben aus den Büchern werden **nicht** abgeschrieben; LernDax erzeugt eigene Aufgaben zu
  denselben Themen. Seitenzahlen dienen nur zur Orientierung.
- **Nächste Klassenarbeit:** **Mathe am 24.11.2026** (Themen im Abschnitt 9 unter „Klassen-Bereich“).
- **Danach bekannt:** **Mathe-Vergleichsarbeit Anfang Februar 2027** (Datum in `notizen/familie.md`;
  Themen noch unbekannt). Weitere Lehrbücher Klasse 5 (für spätere Fächer): Linder 5 (Bio),
  Terra 5 (Geo), Anno 1 (Geschichte).
- **Name:** **LernDax**. Anspielung auf **LernSax** (Schulplattform aller sächsischen Schulen),
  „Dax“ klingt wie **Dachs**, das Maskottchen. Die Fächer heißen **Kürzel + Dax**: **MaDax** (Mathe,
  bis 11.11.2026 „Mathelix“), DeDax, EnDax, BioDax, GeDax, GeoDax, TecDax … (siehe `faecher/README.md`).
- **Reihenfolge:** erst Klasse 5 in allen Fächern, dann die Klassen 4 und 6, dann alle übrigen Klassen.

## 2. Wo alles liegt

| Was | Wo |
|---|---|
| Website (live) | **https://robertoschiwon-prog.github.io/lerndax/** |
| Mathe direkt | https://robertoschiwon-prog.github.io/lerndax/mathe/ |
| Code (Hauptstand) | GitHub: **robertoschiwon-prog/lerndax** (öffentlich, Branch `main`) |
| Code (Kopie für den Auftraggeber) | lokaler OneDrive-Ordner (Pfad in `notizen/familie.md` und in den Anweisungen des Claude-Projekts „LernDax“) |
| Datenbank | Supabase, Organisation „Familie“, Projekt **familienkalender** (Ref `bpwdmdcnvdolpsxdvblq`), nur Tabellen `lerndax_…` |
| Anmeldung | dasselbe Familienkonto wie im Familienkalender |
| Veröffentlichen | automatisch bei jedem Push auf `main` (GitHub Actions „LernDax veröffentlichen“) |

**GitHub ist der maßgebliche Stand.** Der OneDrive-Ordner ist eine Kopie. Ausnahme: der Ordner
`.github/` (Veröffentlichungs-Ablauf) liegt nur auf GitHub, weil Claude in diesen Ordner auf
dem PC nicht schreiben darf. `notizen/` liegt nur auf OneDrive (privat).

**Wenn Claude in einem neuen Chat weiterarbeitet:** GitHub-Repository einbinden und klonen,
dort ändern, testen, pushen; danach geänderte Dateien in den OneDrive-Ordner kopieren.

## 3. Was fertig ist

### Plattform (für alle Fächer)
- **Startseite** (`web/index.html`): Dachs-Logo, Begrüßung mit Avatar, Fächerliste
  (Mathe aktiv; Deutsch und Englisch als „bald“), Entdecken-Kachel, Link „Für Eltern:
  Fortschritt & Geräte“. Zeigt Serie 🔥 und Sync-Status ☁︎.
- **Familienkonto & Kind-Profile:** Anmeldung mit dem Familienkalender-Konto in der
  Elternansicht. Pro Kind ein Profil (nur Vor- oder Spitzname + Klasse). Neue Konten können in
  LernDax **nicht** angelegt werden (`allowSignup: false`), das macht nur der Admin.
- **Eltern-PIN:** Optional. Schützt Abmelden, Profilwechsel und „Fortschritt löschen“.
  Gespeichert wird nur ein Fingerabdruck (SHA-256 aus `lerndax:<Konto-ID>:<PIN>`), nie die PIN.
- **Synchronisation:** Fortschritt pro Profil und Fach. Funktioniert auch offline; beim
  nächsten Kontakt wird zusammengeführt (Regeln siehe Technik).
- **Trainingsseiten für Klassenarbeiten** (seit 10.11.2026): Aufruf mit `?t=<id>`, z. B.
  **https://robertoschiwon-prog.github.io/lerndax/mathe/?t=mathe-2026-11-24**
  Eintrag je Arbeit in `web/plattform/trainings.js` (Titel, Datum, Fach, Gruppen mit
  Themen-IDs und Buchseiten, Buch-Hinweise). Die Seite zeigt Countdown, „So fit bist du“
  (gesamt und je Gruppe), Trainingsrunde (8 Aufgaben nur aus den Arbeitsthemen, Schwaches
  öfter), Fehler-Training, Mix je Gruppe, die Themen-Kacheln mit Erklärungen und „Im Buch üben“.
  In der allgemeinen App **nicht** verlinkt. Funktioniert **ohne Anmeldung** (Fortschritt nur auf
  dem Gerät); angemeldet wird synchronisiert. Fortschritt zählt auch in der allgemeinen App.
  Fitness je Thema = Trefferquote der letzten Aufgaben × min(1, bearbeitete Aufgaben / 8).
  **Neue Arbeit anlegen:** in `trainings.js` einen Eintrag ergänzen (keine Namen von Schule,
  Lehrkraft oder Kind!), `VERSION` erhöhen, Link weitergeben.
- **Tagesziel** (seit 10.11.2026, Wunsch Auftraggeber): „🎯 Tagesziel: eine Runde“ unter der Begrüßung
  in Mathelix und auf der Trainingsseite; nach der ersten vollständigen Runde des Tages grün
  „Tagesziel geschafft ✓“, auf der Ergebnisseite „Tagesziel für heute geschafft!“. Gezählt in
  `rounds` (Runden pro Tag, letzte 60 Tage) und **mit synchronisiert** (pro Tag gilt der höhere Wert).
- **Avatare** (seit 10.11.2026): 12 eigene, gezeichnete Figuren (Fuchs, Eule, Pinguin, Katze,
  Hund, Igel, Waschbär, Drache, Roboter, Krake, Faultier, Axolotl) × 8 Hintergrundfarben
  (Orange, Blau, Grün, Lila, Gelb, Pink, Türkis, Nacht). Auswahl öffnet sich beim ersten Besuch
  automatisch (einmal pro Gerät), später über Tippen auf den Avatar (✏️). Gespeichert im
  Kind-Profil, also auf allen Geräten gleich. Bewusst **keine** bekannten Figuren aus Filmen,
  Spielen usw.
- **Installierbare App (PWA):** Manifest, App-Icons (Dachs-Kopf), offline nutzbar.
- **Dachs-Logo:** `web/icons/dachs.svg`, App-Icons als PNG in mehreren Größen.

### MaDax (Mathe, früher „Mathelix“), Klasse 5 vollständig
- **Kopfzeile:** Dachs (zurück zur LernDax-Startseite), Schriftzug „MaDax“ (zum Mathe-Start),
  Serie 🔥 und Sterne ⭐. Das frühere orange „×“-Kästchen ist seit 10.11.2026 entfernt
  (wirkte doppelt und wie ein Schließen-Knopf).
- **Startbildschirm** (Stand v43): Avatar + „Hallo <Name>!“, Tagesziel, Klassen-Leiste 1–10 (nur 5 aktiv),
  **„Weiter üben“** (zuletzt geübtes Thema), „Entdecken“ und (ab zwei Sternen in einem Thema) **„Knobeln“** nebeneinander,
  „🎲 Gemischt“ (nur aus schon geübten Themen), „🔁 Fehler-Training“, dann die Lernbereiche mit Fortschrittszeile
  („6 von 13 geübt“), Themen-Kacheln mit Sternen und ▶-Knopf; Lernbereiche mit lauter Drei-Sterne-Themen sind
  eingeklappt. Darunter der Entdecken-Bereich und der Link „Für Eltern“.
- **Knobel-Stufe** (seit v39): je Thema `topic.knobel()` in `generatoren/klasse5-knobel.js`, 5 Aufgaben je Runde,
  zählt nicht für Sterne und Fehler-Training, Zähler `S.knobel` (wird synchronisiert). Zugang: Balken auf der
  Startseite/Trainingsseite ab zwei Sternen, Knopf „Jetzt knobeln“ nach einer Runde mit mindestens 75 %.
- **Themen-Symbole** (seit 10.11.2026): Jedes Thema hat ein selbst gezeichnetes Bildchen
  (z. B. Waage für Gleichungen, Faktorbaum für Primzahlen, Stoppuhr für Zeit) in einem
  44-Pixel-Kästchen. Vorher standen dort kleine Schriftzeichen (≈, ÷, ↘ …), die auf dem Handy
  kaum zu erkennen waren. Datei `web/mathe/symbole.js`; fehlt ein Symbol (z. B. neue Klasse),
  zeigt die App das Zeichen aus `icon` im Generator.
- **5 Lernbereiche, 36 Themen** (nach Lehrplan Gymnasium Sachsen Klasse 5):
  - LB 1 Natürliche Zahlen: Große Zahlen & Zahlenstrahl · Runden · Überschlagen · Schriftlich rechnen · Einfache Gleichungen ·
    **Vorrangregeln** · **Rechengesetze** · Geschickt rechnen · Potenzen · Teiler & Vielfache · Primzahlen & Primfaktoren ·
    Schriftlich dividieren · **Textaufgaben**
  - LB 2 Brüche & Dezimalzahlen: Anteile berechnen · Kürzen · Erweitern · Brüche am Zahlenstrahl · Gemischte Zahlen ·
    Bruch · Dezimal · Prozent · Zahlen vergleichen · Dezimalzahlen runden · Mit Dezimalzahlen rechnen · Arithmetisches Mittel
  - LB 3 Geometrie: Senkrecht & parallel · Koordinatensystem · Winkelarten · Winkel messen · Winkel an Geraden · Symmetrie & Spiegeln
  - LB 4 Rechtecke & Quader: Umfang & Fläche · Netze & Schrägbilder · Volumen & Oberfläche
  - LB 5 Mathe im Alltag: Einheiten umrechnen · Fahrpläne & Zeit · Sachaufgaben mit Geld · Schätzen wie Fermi
- **Übungsrunde:** Aufgabe → Eingabe (Zahl, Bruch, Uhrzeit, Primfaktoren oder Auswahl) →
  bei Fehler erst ein **Tipp**, dann der **Lösungsweg**. Fehler fließen ins Fehler-Training.
- **Erklär-Animationen** zu allen 36 Themen, jede Kachel hat den ▶-Knopf (seit `lerndax-v20` auch
  Textaufgaben „in vier Schritten“, Zahlen vergleichen und Sachaufgaben „Wechselgeld ergänzen“). Liste der Grund-Animationen: Runden am Zahlenstrahl · Der Rechenbaum (Vorrangregeln) ·
  Drei Rechengesetze zum Anschauen (Punkte drehen, Streifen umklammern, Rechteck teilen) · Dividieren: Bonbons in Tüten und
  schriftlich Stelle für Stelle · Teilbarkeit: Regeln und Teiler (Quersumme, Endziffern, durch 6,
  Teiler-Paare) ·
  Primzahlen · Potenzen: wie oft malnehmen? (Basis/Exponent, 2ⁿ verdoppeln, Zehnerpotenzen,
  a¹ und 1ⁿ, Quadratzahlen) · Anteile berechnen · Erweitern & Kürzen ·
  Die Hundertertafel · Mal 10 (das Komma bleibt, die Ziffern wandern) · Arithmetisches Mittel:
  alles gerecht verteilen · Erst laufen, dann springen (Koordinaten) · Winkelarten · Winkel an Geraden ·
  Fläche und Umfang · Volumen: Würfel stapeln · Gleichungen sind Waagen · Zeitspannen mit
  Sprüngen · Zoom ins Maßband · Was ist π? Das abrollende Rad.
- **Erklär-Player:** Abspielen, **Pause**, **Langsam-Modus**, „Nochmal“; viele Animationen
  haben Regler oder Auswahl-Chips zum Selbst-Ausprobieren.
- **Beispiel vorher / Lösung als Animation nachher:** „▶ Erklärung“ vor dem Antworten zeigt ein
  **ähnliches Beispiel** (andere Zahlen, verrät nichts), „▶ Lösung als Animation“ nach dem Antworten
  zeigt **genau die Aufgabe**. Seit `lerndax-v19` (11.11.2026) für **alle 25 Themen** (geprüft: bei
  150 falsch beantworteten Aufgaben zeigt die Animation die Zahlen und das Ergebnis der Aufgabe). Im Einzelnen:
  - **Primzahlen** (Rechteck-Legen) und **Primfaktorzerlegung** (Faktorbaum)
  - **Vorrangregeln** (seit 10.11.): Rechenbaum aus der Rechnung des Kindes, auch mit Klammern und ²;
    am Ende bleibt der Rechenweg als nummerierte Liste stehen
  - **Potenzen** (seit 10.11.): Basis/Exponent mit den Zahlen der Aufgabe (inkl. „nicht b · e“),
    Zehnerpotenzen mit markierter Zeile (auch a · 10ⁿ), Quadratzahlen bis zur Zahl der Aufgabe
  - **Schriftliches Dividieren** (seit 10.11.): Stelle für Stelle wie im Heft, mit Nullen im
    Ergebnis, Rest und Probe
  - **Bruch · Dezimal · Prozent** (seit 10.11., `lerndax-v18`): Hundertertafel mit dem Bruch der Aufgabe,
    „Erweitern mit k“ auf Hundertstel; bei Achteln auf 1000 erweitert, halbe Kästchen werden gezeigt
  - **Teilbarkeit & Teiler** (seit 10.11.): passende Regel zur Aufgabe (Quersumme, letzte Ziffer,
    letzte zwei Ziffern, durch 6 = durch 2 und 3) bzw. Teiler-Paare; **Vielfache** (v19): Sprünge auf dem
    Zahlenstrahl (n-tes Vielfaches, kleinstes über g, welche Zahl wird getroffen)
  - Neu in `lerndax-v19`:
    - **Runden** auf jede Stelle (Zahlenstrahl in Zehner-, Hunderter-, Tausender-Schritten) + Ziffernregel
    - **Rechengesetze**: das passende Gesetz mit den Zahlen der Aufgabe (Plus als Streifen, Mal als
      Punkt-/Kästchenfeld, Distributiv auch mit Minus und rückwärts = ausklammern), „Stimmt das?“ als
      Nachrechnen beider Seiten; **Geschickt rechnen**: Zahlen umstellen und glatte Paare bündeln
    - **Potenzen vergleichen** (2⁵ oder 5²): beide als Malaufgabe ausrechnen
    - **Gleichungen**: Pfeilbild mit Umkehraufgabe für +, −, · und : (Waage bleibt als Einstieg)
    - **Anteile** (bis 10 Teile mit 12 Bonbons), **Erweitern** und **Kürzen** getrennt (Kürzen: Kästchen
      zusammenfassen, ggT; unechte Brüche mit mehreren Rechtecken)
    - **Dezimalzahlen**: Komma unter Komma (+, − mit Übertrag), mal einstellig (erst ohne Komma, dann Komma
      setzen), · / : Zehnerpotenzen in passend großer Stellenwerttafel; **Zahlen vergleichen** Stelle für Stelle
    - **Mittelwert** als Balken mit den Werten der Aufgabe
    - **Koordinaten** (auch x = 0 oder y = 0), **Winkelarten** (Strahl dreht auf den Winkel der Aufgabe),
      **Winkel an Geraden** (richtiger Teil: Neben/Scheitel oder Stufen/Wechsel mit dem gegebenen Winkel)
    - **Rechteck**: Fläche, Umfang, fehlende Seite, zusammengesetzte Figur; **Quader**: Volumen (große Quader
      schichtweise), Oberfläche (je zwei gleiche Flächen), Liter (dm-Würfel)
    - **Einheiten**: Einheiten-Treppe für Länge, Masse, Zeit (Faktor 60!), Fläche, Volumen, Hohlmaß;
      **Fahrpläne**: Ankunft und Dauer mit Sprüngen über volle Stunden
    - **Sachaufgaben** nutzen die passende Rechen-Animation (Preis · Anzahl, Wechselgeld, Teilen)
  Technik: Der Generator gibt `ex: { mode, … }` mit; die Erklärung bekommt das als `ctx` mit
  `pre` (ähnliches Beispiel) oder `post` (genau die Aufgabe). Mit `ex.via: '<Themen-ID>'` nutzt
  eine Aufgabe die Erklärung eines anderen Themas (so bei den Textaufgaben).
- **Entdecken (16 Staunen-Momente, dunkle „Bühne“; seit v38 auch Römische Zahlen und Zählen wie ein Computer):** Ich kann Gedanken lesen! · Der Trick
  des kleinen Gauß · Ungerade Zahlen bauen Quadrate · Unendlich viele Brüche ergeben 1 ·
  Das Sieb des Eratosthenes · Reis auf dem Schachbrett · Das Galton-Brett · Das Pascalsche
  Dreieck · Wie hoch ist der Baum? · Warum hat jedes Dreieck 180°? · Das Geheimnis der
  Sonnenblume · Was ist π? · Aus der Pizza wird ein Rechteck · Der Satz des Pythagoras.
  Schon angesehene sind mit ✓ markiert, neue mit „neu“.
- **Elternansicht** (Mathe → ganz unten, oder Startseite → „Für Eltern“): Fortschritt je Thema,
  Anmeldung/Profile/PIN, Fortschritt zurücksetzen.

### Live geprüft (10.11.2026)
- Kind-Profil existiert, PIN gesetzt, Mathe-Fortschritt wird in der Datenbank gespeichert.
- Avatar-Auswahl öffnet sich live; das Kind sucht seinen Avatar noch selbst aus.

## 4. Technik

### Aufbau
- Reine **statische Website** (HTML, CSS, JavaScript ohne Build-Schritt), gehostet auf
  **GitHub Pages**. Datenbank und Anmeldung über **Supabase** (Bibliothek `supabase-js` v2
  von jsDelivr).
- **Plattform vs. Fach:** Was jedes Fach braucht, liegt in `web/plattform/`. Ein Fach setzt
  `window.LERNDAX_SUBJECT = '<fach>'` und bindet `plattform/avatare.js`, `config.js`,
  `sync.js` ein.

| Datei | Aufgabe |
|---|---|
| `web/index.html` | Startseite (Fächer aus `faecher.js`, Avatar, Entdecken-Kachel, Eltern-Link) |
| `web/plattform/faecher.js` | **Alle Fächer** (`window.LERNDAX_FAECHER`): ID, Kürzel, Dax-Name, Fachname, Farbe, Klassen, Stand; Hilfen `LERNDAX_FAECHER_IN(klasse)`, `LERNDAX_FACHNAME(fach, klasse)` |
| `web/plattform/config.js` | Supabase-Adresse, **öffentlicher** Schlüssel (`sb_publishable_…`), Tabellen-Präfix `lerndax_`, `allowSignup: false`, Kontoname |
| `web/plattform/sync.js` | Anmeldung, Profile, PIN, Synchronisation, Avatar-Sync (`window.LernDaxSync`, Alias `MathelixSync`) |
| `web/plattform/avatare.js` | Avatar-Figuren (SVG), Farben, Auswahlfenster (`window.LernDaxAvatare`) |
| `web/plattform/trainings.js` | Trainings für einzelne Klassenarbeiten (`window.LERNDAX_TRAININGS`), Aufruf `<fach>/?t=<id>` |
| `web/mathe/index.html` | MaDax-App (Ansichten, Übungsrunde, Player, Elternansicht) |
| `web/mathe/generatoren/klasse5.js` | Aufgabengeneratoren Klasse 5 (`window.Mathelix.grades[5]`) |
| `web/mathe/generatoren/klasse5-luecken.js` | 7 weitere Themen (Überschlagen, Schriftlich rechnen, Gemischte Zahlen, Dezimalzahlen runden, Symmetrie, Netze & Schrägbilder, Fermi); hängt sie in die Lernbereiche ein |
| `web/mathe/generatoren/klasse5-buch.js` | 4 weitere Themen (Große Zahlen, Brüche am Zahlenstrahl, Senkrecht & parallel, Winkel messen), Zusatz-Aufgabenarten für vorhandene Themen und die **Reihenfolge aller Themen** (Tabelle `FOLGE`) |
| `web/mathe/generatoren/klasse5-knobel.js` | Knobel-Aufgaben zu allen Themen (`topic.knobel`) |
| `web/mathe/erklaerungen/klasse5-luecken.js`, `klasse5-buch.js` | Animationen zu den Themen der gleichnamigen Generator-Dateien; `erweitere()` in `klasse5-buch.js` hängt eine zusätzliche Aufgabenart an eine vorhandene Erklärung |
| `web/plattform/symbole.js` | eigene Symbole statt Emojis, für alle Fächer (`window.LernDaxSymbole`) |
| `web/mathe/symbole.js` | Themen-Symbole als SVG, Schlüssel = Themen-ID (`window.MathelixIcons`) |
| `web/mathe/erklaerungen/klasse5.js` | Erklär-Animationen zu den Themen |
| `web/mathe/erklaerungen/entdecken.js` | Entdecken-Animationen |
| `web/sw.js` | Service Worker (Offline, Aktualisierung), `VERSION` |
| `web/manifest.webmanifest` | App-Name, Farben, Icons |
| `supabase/schema.sql` | Tabellen, Regeln, Rechte (gefahrlos wiederholbar) |
| `.github/workflows/pages.yml` | lädt `web/` bei jedem Push nach GitHub Pages (nur auf GitHub) |

### Aufgaben-Generatoren
Jeder Generator liefert bei jedem Aufruf eine neue Aufgabe:
`{ prompt, figure?, fields:[{answer, type, label, prefix, suffix, fixed}], layout?, choices?/correct?, check?, hint, solution, answerText, ex? }`.
`ex: {mode, n}` verknüpft eine Aufgabe mit einer Erklär-Animation (Beispiel vorher, Lösung nachher).
Zahlen werden deutsch formatiert (Komma, schmales Leerzeichen ab 10 000).

### Erklär-Animationen
Jede Erklärung: `{ title, titleFor?(ctx), viewBox, dark?, discover?:{icon, q, tag}, create(api, ctx) → { reset(), play() } }`.
`ctx` = `ex` der Aufgabe plus `pre: true` (ähnliches Beispiel) oder `post: true` (genau die Aufgabe); ohne Aufgabe ist `ctx` leer.
`play()` ist asynchron und nutzt `api.wait`, `api.tw` (Übergänge), `api.say` (Text),
`api.slider`, `api.chips`. Der Player hat eine **eigene virtuelle Uhr**; dadurch funktionieren
Pause und Langsam-Modus für alle Animationen gleich. `discover` ⇒ erscheint unter Entdecken
(Reihenfolge in `DISC_ORDER` in `web/mathe/index.html`).

### Lernstand (pro Gerät im Browser, `localStorage`)
- `mathelix.v1`: `{ name, grade, stats:{<themaId>:{n, hist:[letzte Ergebnisse 1 / 0,5 / 0], last}}, exSlow, days:[JJJJ-MM-TT], total, seen:{<id>:true}, rounds:{JJJJ-MM-TT: n}, knobel:{<themaId>:{n, ok}}, lastTopic, resetAt }` (`lastTopic` bleibt auf dem Gerät, alles andere außer `name`/`grade`/`exSlow` wird synchronisiert)
- `lerndax.device` (aktives Profil), `lerndax.auth` (Anmeldung), `lerndax.avatar`
  (z. B. `fuchs:blau`), `lerndax.avatar.pending` (noch nicht hochgeladen),
  `lerndax.avatar.asked` (Auswahl wurde schon einmal automatisch gezeigt).

### Synchronisation (Zusammenführen)
- Pro Thema gewinnt der Stand mit mehr bearbeiteten Aufgaben (`n`).
- Übungstage (`days`) und angesehene Erklärungen (`seen`) werden vereinigt.
- Runden pro Tag (`rounds`, Tagesziel): je Tag der höhere Wert, letzte 60 Tage.
- `total` = Maximum. `resetAt` (Zeitpunkt von „Fortschritt löschen“) verwirft alles Ältere.
- Avatar: lokale Änderung wird hochgeladen; sonst gilt der Avatar aus dem Profil; ist das
  Profil leer, wird der lokale hochgeladen.
- In der Claude-Vorschau ist Sync abgeschaltet.

### Datenbank (Supabase, Projekt familienkalender)
- `lerndax_profiles`: `id`, `owner` (= Konto, Standard `auth.uid()`), `name` (1–30 Zeichen),
  `grade` (1–13), `avatar` (`figur:farbe` oder leer), `created_at`
- `lerndax_progress`: `profile_id`, `subject` (z. B. `mathe`), `owner`, `state` (JSON wie
  oben), `updated_at`; Schlüssel (`profile_id`, `subject`)
- `lerndax_family_settings`: `owner`, `pin_hash`
- **Row Level Security:** Jedes Konto sieht nur eigene Zeilen. Rechte nur für angemeldete
  Nutzer (`authenticated`); `anon` hat **keine** Rechte (ausdrücklich entzogen, weil Supabase
  sie sonst standardmäßig vergibt).
- Neue Fächer brauchen **keine** Datenbankänderung (`subject` unterscheidet).
- Kostenlose Supabase-Projekte pausieren nach ca. 1 Woche ohne Nutzung; Kalender und LernDax
  halten es gegenseitig wach. Sonst im Dashboard „Restore project“.

### Service Worker & Aktualisierung
- Eigene Dateien: **erst Netz, dann Zwischenspeicher** (`cache: 'no-cache'`), offline Rückfall
  auf gespeicherte Kopie. Schriften und jsDelivr: erst Zwischenspeicher.
- Bei jeder Änderung `VERSION` in `web/sw.js` erhöhen (aktuell **`lerndax-v21`**) und neue
  Dateien in die `SHELL`-Liste aufnehmen.

### App-Icons
- Aktuelle Dateinamen enden auf **`-v4`** (z. B. `apple-touch-icon-v4.png`). Grund: iPhones
  halten alte Icons hartnäckig im Zwischenspeicher; ein neuer Dateiname erzwingt das neue Bild.
  Bei einer Icon-Änderung: neue Nummer (`-v5`) und in `index.html`, `mathe/index.html`,
  `manifest.webmanifest`, `sw.js` eintragen.
- Größen: Dachs-Kopf 81 % in Apple-/Standard-Icons, 72 % im „maskable“-Icon (Android schneidet
  rund zu, sichere Zone), 86 % im Favicon. Im Kopfbereich der Seite ist das Logo bewusst etwas
  kleiner mit Rand.
- Nach einer Icon-Änderung muss man auf dem iPhone die App vom Home-Bildschirm entfernen und
  neu hinzufügen.

### Tests
Siehe `tests/README.md`. Vor jedem Veröffentlichen mindestens `ui2.py` und `sync_test.py` laufen lassen, nach
Änderungen an Aufgaben oder Animationen auch `loesung.py`, `knobel.py` und `bild_audit.py`, nach Änderungen am
Aussehen `design_audit.py`. (`gen-test.js` braucht den Pfad einer Generator-Datei als Argument und kennt nur `klasse5.js`.)

## 5. Wichtige Entscheidungen (mit Begründung)

| Entscheidung | Warum |
|---|---|
| Prototyp zuerst nur Klasse 5 | Das Kind ist in Klasse 5; erst eine Klasse richtig gut machen |
| Lehrplan Gymnasium Sachsen als Gerüst | Schule des Kindes; Reihenfolge später mit dem Schulbuch abgleichen |
| Animationen im 3Blue1Brown-Stil | Verstehen statt auswendig lernen; der Auftraggeber mag diesen Stil |
| Lösung nach dem Antworten zeigen, ähnliches Beispiel vorher | Wunsch des Auftraggebers: erst selbst denken, dann sehen, wie es geht |
| Pause und Langsam-Modus | Wunsch des Auftraggebers: Kinder brauchen Zeit zum Mitdenken |
| Entdecken-Bereich ausgebaut („Paket 1“) | Neugier wecken; der Auftraggeber wollte mehr davon |
| Name Mathelix → Dachprojekt **LernDax** | Später auch Deutsch/Englisch; „Lernfux“ war schon vergeben |
| Hosting GitHub Pages + Supabase | Kostenlos, überall erreichbar wie der Familienkalender |
| Supabase-Tabellen **im Projekt familienkalender** statt eigenem Projekt | Kostenloser Supabase-Plan erlaubt nur 2 Projekte, beide belegt; Anmeldung mit demselben Familienkonto ist zudem praktisch |
| Tabellen-Präfix `lerndax_` | Klare Trennung von den Kalender-Tabellen |
| Keine Selbst-Registrierung | Nur die Familie nutzt die App; Konten verwaltet der Admin |
| GitHub-Repository öffentlich | Kostenloses GitHub Pages; im Code steht nur der öffentliche Schlüssel, die Daten schützt die Datenbank (RLS) |
| Alte Tabellen `mathelix_…` gelöscht | Waren leer, nach der Umbenennung überflüssig (`supabase/2026-11-10_mathelix-tabellen-entfernen.sql`) |
| Service Worker „erst Netz“ | Sonst sahen Handys alte Versionen (z. B. alte Icons) |
| Avatare als eigene Figuren | Kinder mögen Personalisierung; keine geschützten Figuren |
| Fächer heißen **Stundenplan-Kürzel + Dax** (MaDax, DeDax, EnDax …), „Mathelix“ → **MaDax** (11.11.2026) | Eine Marke statt zweier Namenswelten (Dax vs. „-ix“); Kinder kennen die Kürzel aus dem Stundenplan; sachlich genug für Klasse 10. Verspieltere Ideen (Dachsbau, Tierfreunde) nur als Gestaltung für jüngere Klassen. Interne Namen (`mathelix.v1` usw.) bleiben, damit kein Lernstand verloren geht |
| Alle Fächer in `web/plattform/faecher.js` | Eine Stelle für Namen, Klassen und Stand; die Startseite zeigt passend zur Klassenstufe fertige Fächer und „Kommt bald“ |
| Ausbau: erst Klasse 5 in allen Fächern, dann Kl. 4 und 6, dann alle | Wunsch des Auftraggebers; das Kind ist in Klasse 5 |

## 6. Regeln für die Arbeit an LernDax

1. **Nichts am Familienkalender ändern**: weder Code noch Kalender-Tabellen noch
   Anmelde-Einstellungen (Site URL, Registrierung, E-Mail-Vorlagen) noch Konten. Der Kalender
   wird im eigenen Claude-Projekt „Familienkalender“ gepflegt.
2. Nur den **öffentlichen Schlüssel** (`sb_publishable_…`) verwenden, **nie** den geheimen
   (`service_role`/`secret`).
3. **Passwörter tippt der Auftraggeber selbst** ein (Supabase, GitHub, App-Anmeldung).
4. Vor Löschungen oder anderen nicht umkehrbaren Änderungen in der Datenbank **fragen**.
   Neue Spalten/Tabellen nur additiv und immer auch in `supabase/schema.sql` nachtragen.
5. `notizen/` bleibt lokal und kommt nicht auf GitHub.
6. Nach jeder Änderung: Tests laufen lassen → `VERSION` in `web/sw.js` erhöhen → auf GitHub
   pushen → live prüfen → Dateien in den OneDrive-Ordner kopieren → **diese Datei aktualisieren**.
7. Kindgerecht und datensparsam: nur Vornamen, keine Werbung, kein Tracking, keine
   Chat- oder Sozialfunktionen.

## 7. Verbindung zum Familienkalender

- **Gemeinsam:** Supabase-Projekt `familienkalender` und dessen Familienkonten.
- **Getrennt:** LernDax hat nur seine `lerndax_`-Tabellen; Kalender-Code und -Tabellen fasst
  LernDax nicht an.
- **Link im Kalender:** Am 10.11.2026 hat der Auftraggeber dem Claude-Projekt „Familienkalender“ einen
  Auftrag für einen Link zu LernDax (Bezeichnung „📚 LernDax“ bzw. „Lernen“, Ziel
  https://robertoschiwon-prog.github.io/lerndax/) weitergegeben. Ob und wie er umgesetzt ist,
  steht im Familienkalender-Projekt (dessen `status.md`).
- **Empfohlener Hinweis für das Kalender-Projekt** (vom Auftraggeber dort einzutragen): Die Tabellen
  `lerndax_profiles`, `lerndax_progress`, `lerndax_family_settings` gehören LernDax und dürfen
  nicht verändert oder gelöscht werden; Anmelde-Einstellungen und Konten nicht ohne Rücksprache
  ändern, weil LernDax davon abhängt.
- **Ordner nicht gegenseitig freigeben.** Für gemeinsame Funktionen (z. B. „Heute geübt“ im
  Kalender) liefert LernDax eine Beschreibung, wie der Kalender den Lernstand aus
  `lerndax_progress` liest (`state.days` enthält die Übungstage).

## 8. Stolpersteine, die schon gelöst sind

- **iPhone zeigte altes, zu kleines Icon:** Ursache war Zwischenspeicher (Service Worker +
  Browser). Lösung: Service Worker „erst Netz“, Icons mit neuem Namen (`-v4`), App neu zum
  Home-Bildschirm hinzufügen.
- **Supabase gab Tabellen keine Rechte bzw. `anon` hatte zu viele:** Rechte in `schema.sql`
  ausdrücklich gesetzt bzw. entzogen.
- **GitHub Pages:** musste einmalig in den Repository-Einstellungen auf „GitHub Actions“
  gestellt werden.
- **Claude darf manche Dinge nicht selbst:** öffentliche Repositories anlegen, Berechtigungen
  vergeben, Passwörter eingeben → macht der Auftraggeber.
- **Missverständnis „Dax größer“:** gemeint war der Dachs-Kopf im Icon, nicht der Schriftzug.
- **Ordner Familienkalender:** Claude hat dort nie geschrieben; der Kalender-Code liegt im
  Claude-Projekt „Familienkalender“.

## 9. Offene Punkte & Ideen

**Aktuelle Liste (12.11.2026): siehe Abschnitt 0 „Offen bei MaDax“.** Die Punkte weiter unten sind älter;
erledigt sind davon inzwischen: Lehrplan-Lücken Klasse 5, Abgleich mit dem Schulbuch, Knobel-Stufe, Design-Durchgang.
Weiter als Idee offen: Hut-Tausch des Dachses beim Tagesziel, Spruch zur Serie, Elternbereich auf die Startseite
verlegen (sinnvoll, sobald das zweite Fach da ist), „Bundesland wählen“.

**Grundsatz (Entscheidung Auftraggeber, 10.11.2026): allgemein vs. Klasse**
Mathelix bleibt **allgemein** nach dem Lehrplan Sachsen. Alles, was nur eine bestimmte Klasse betrifft
(Klassenarbeiten, Termine, Buchseiten, Themenauswahl der Lehrkraft), kommt **nicht** in die
allgemeine App, sondern später in einen **eigenen Klassen-Bereich**, der gezielt (spezialisiert)
abrufbar ist. Der Auftraggeber möchte diesen Bereich als **eigenes Thema** zuschneiden; bis dahin wird dort
nichts gebaut.

**Klassen-Bereich: Trainingsseiten für Klassenarbeiten**
Infos zur ersten Arbeit:
- Mathe-Klassenarbeit am **24.11.2026**, Themen laut Themenliste der Schule (Übungsseiten im
  Lambacher Schweizer in Klammern):
  1. Vorrangregeln und Rechengesetze: Kommutativ-, Assoziativ-, Distributivgesetz (S. 21–29)
  2. Potenzen (S. 30–31)
  3. Teilbarkeit und Primzahlen (S. 33–37)
  4. Schriftliches Dividieren (S. 40)
  Dazu Querbeet-Aufgaben (S. 45–47) und Rückblick mit Übungstests (S. 52/53).
- Diese Themen sind seit 10.11. alle als **allgemeine** Mathelix-Themen vorhanden (siehe
  Abschnitt 3). Ein Klassen-Bereich müsste sie nur auswählen und bündeln, nicht neu bauen.
- **Gebaut am 10.11.2026 (`lerndax-v10`)**, Link: https://robertoschiwon-prog.github.io/lerndax/mathe/?t=mathe-2026-11-24
  Beschreibung siehe Abschnitt 3 („Trainingsseiten für Klassenarbeiten“).
- **Konzept (besprochen mit dem Auftraggeber am 10.11.2026):**
  - **Trainingsseite je Arbeit:** Eine Arbeit wird in LernDax als kleiner Eintrag beschrieben
    (Titel, Datum, Fach, Themen-IDs, Buchseiten). Daraus entsteht automatisch eine eigene
    Trainingsseite mit eigenem Link. Sie nutzt die allgemeinen Mathelix-Themen, zeigt aber nur
    die ausgewählten. Die allgemeine App bleibt unverändert.
  - Mögliche Bausteine: Countdown bis zur Arbeit, Runde nur aus den Arbeitsthemen, schwache
    Themen häufiger, „wie fit bin ich“ je Thema, Buchseiten als Hinweis.
  - **Zugang zuerst nur für das eigene Kind:** Die Seite wird in der allgemeinen App **nicht** verlinkt.
    Das Kind erreicht sie über den **Familienkalender** (Knopf „Jetzt üben“ beim Termin der Arbeit
    oder Sektion „Lernen“). Das baut das Kalender-Projekt; LernDax liefert dafür nur Link und
    Beschreibung (Auftrag über den Auftraggeber, wie beim LernDax-Link). Angemeldet wird der Fortschritt
    wie gewohnt synchronisiert.
  - **Option Klassenkameraden offenhalten:** Die Seite so bauen, dass sie auch **ohne Anmeldung**
    funktioniert (Fortschritt dann nur auf dem Gerät, nichts in der Datenbank). Dann genügt
    später, den Link weiterzugeben (z. B. Eltern-Chat der Klasse). Klassenkameraden bekommen
    **keine** Konten im Familienkalender.
  - Auf der Seite **keine** Namen von Schule, Lehrkraft oder Kind, weil sie technisch für jeden
    mit dem Link erreichbar ist.
- Offen: Werden im Buch (S. 36–40) auch zweistellige Teiler geübt? Beim schriftlichen Dividieren
  nutzt Mathelix nur einstellige Teiler; zweistellige kommen bei „Sachaufgaben mit Geld“
  (Klassenfahrt, 12 bis 28 Kinder) und bei der fehlenden Rechteckseite vor.

**Allgemeine Lehrplan-Ergänzungen vom 10.11.2026** (aus dem Abgleich mit der Arbeit entstanden)
- [x] Neue Themen **„Vorrangregeln“** und **„Rechengesetze“** (`lerndax-v8`)
- [x] **Potenzen** erweitert (`lerndax-v9`): 2³, 3⁴ … bis 1 024, Basis/Exponent, „als Potenz
      schreiben“, „Was ist 2³? 6, 8 oder 9“, „Was ist größer: 2⁵ oder 5²?“, a · 10ⁿ, Basis gesucht;
      Animation zusätzlich „2 hoch n: verdoppeln“. Thema heißt jetzt „Potenzen“.
- [x] **Erklärung „Potenzen“ umgebaut** (Wunsch Auftraggeber, `lerndax-v11`): Titel „Potenzen: wie oft
      malnehmen?“. Reihenfolge: (1) Basis/Exponent an 2⁵ = 2·2·2·2·2 = 32, ausdrücklich „nicht
      2 · 5 = 10“; (2) 2 hoch n: verdoppeln; (3) Zehnerpotenzen: Exponent = Anzahl der Nullen;
      (4) a¹ = a und 1ⁿ = 1; (5) Quadratzahlen als Sonderfall „hoch 2“ mit Punktquadraten und
      Regler. „Alles“ spielt die fünf Teile nacheinander, Chips springen zu einzelnen Teilen.
      Grund: Vorher startete die Erklärung mit Quadratzahlen, dadurch wirkte „hoch“ wie „Quadrat“.
- [x] **Division** erweitert (`lerndax-v9`): bis vierstellig durch einstellig, Nullen im Ergebnis,
      „Mach die Probe: Stimmt das?“
- [x] **Teilermengen** (`lerndax-v9`) im Thema „Teilbarkeit & Teiler“: Anzahl der Teiler,
      „Welche Zahl ist kein Teiler?“
- [x] **Vielfache** (im Thema „Teiler & Vielfache“) und neues Thema **„Textaufgaben“** (`lerndax-v15`):
      Verteilen mit Rest, Rechnung zum Text aufstellen (Punkt vor Strich, Klammer), Gruppen bilden
      (Teiler), Verdoppeln und Würfel (Potenzen), gleichmäßig verteilen (Teilbarkeit); jede
      Textaufgabe öffnet die passende Animation. Auf der Trainingsseite als Block „Querbeet:
      Textaufgaben“ (S. 45–47). Vorsorglich ergänzt, Abgleich mit dem Buch steht noch aus.
- [x] **Prüfung aller Aufgaben** (10.11.2026, `lerndax-v16`): je Thema 20 000 Aufgaben erzeugt und
      durchgesehen, Fehler behoben (siehe Verlauf).
- [x] **Doku neutral** (Entscheidung Auftraggeber, 10.11.2026, `lerndax-v17`): `README.md`, `STAND.md`,
      Tests und Code nennen keine Namen von Kind, Familie oder Schule mehr; Persönliches steht in
      `notizen/familie.md` (nur lokal). **Achtung:** Ältere Versionen im GitHub-Verlauf enthalten die
      Angaben noch (das Löschen aus dem Verlauf wäre nicht umkehrbar und ist nicht beschlossen). Der
      GitHub-Benutzername steckt in der Webadresse und lässt sich nur mit Umzug des Repositorys ändern.
- [ ] Mit dem Kind testen: Vorrangregeln, Rechengesetze, Potenzen, Division, Teiler & Vielfache, Textaufgaben
- [ ] Trainingsseite mit dem Kind testen
- [x] Auftrag an das Familienkalender-Projekt übergeben (10.11.2026, 19:50, mit OK des Auftraggebers;
      Chat „LernDax Übungs-Knopf und Tabellen“ im Projekt Familienkalender): Knopf „📚 Jetzt üben“,
      Hinweis zu den `lerndax_`-Tabellen für deren status.md, Rückfrage zum LernDax-Link.
      Text: `notizen/auftrag-familienkalender-training.md`. Das Kalender-Projekt meldet sich mit
      einem Vorschlag, bevor es etwas ändert.
- [x] Familienkalender hat umgesetzt (10.11.2026, laut dessen `_Status.md`): Knopf „📚 Jetzt üben“
      und Feld „Übungs-Adresse“ an Arbeiten in der Eltern-App; Mathe-Arbeit 24.11. eingetragen;
      Hinweis zu den `lerndax_`-Tabellen steht dort. Für neue Trainingsseiten: Adresse in der
      Eltern-App an der Arbeit ins Feld „Übungs-Adresse“ eintragen.
- [ ] Trainingsseite für die **Mathe-Vergleichsarbeit (Februar 2027)**, sobald die Themen bekannt sind
- [ ] Idee: „Lange Nacht der Mathematik“ (online, mathenacht.de, nächste am 20.11.2026) im Entdecken-
      Bereich oder Familienkalender erwähnen?
- [x] Nach der Arbeit (24.11.): Trainingsseite **bleibt stehen** (Entscheidung Auftraggeber, 10.11.), auch
      als Beispiel für spätere Jahrgänge bzw. eine mögliche öffentliche Version.
- [x] Lehrplan-Lücken Klasse 5 geschlossen (11.11.2026, `lerndax-v34`): sieben neue Themen, siehe Verlauf.
      Seit `lerndax-v35` auch Quadernetze, Drehungen und Schrägbilder (lesen und verstehen; das Zeichnen selbst übt man im Heft).

**Entscheidungen des Auftraggebers zur Komplett-Prüfung (11.11.2026, umgesetzt mit `lerndax-v21`)**
- Raten: mehr Aufgaben zum Eintippen, Ja/Nein höchstens bei etwa einem Viertel je Thema.
- Schwierigkeit: Teiler einstellig oder 10/20/25, höchstens drei Nachkommastellen.
- „Gemischt“ zieht nur aus Themen, die schon einzeln geübt wurden (ab zwei Themen).
- Tablet und PC: Übersicht in mehreren Spalten, Aufgabe und Erklärung größer; Handy unverändert.
- Dunkle Schrift auf Orange und Gelb; Rückfrage beim ✕; Tipp-Knopf verschwindet nach dem Tipp;
  „0.125“ zählt wie „0,125“; Zurücksetzen nur nach Eintippen des Wortes LÖSCHEN.
- Mehr Abwechslung bei Themen mit wenigen Aufgabenarten.
- **Noch offen:** Wie rechnet die Schule schriftlich minus (Ergänzen mit „1 merken“ wie in der
  Animation, oder Entbündeln)? Der Auftraggeber fragt nach; bis dahin bleibt die Animation, wie sie ist.
  Das neue Thema „Schriftlich rechnen“ zeigt bei Minus deshalb nur die Probe mit Plus (passt zu beiden Wegen).

**Als Nächstes sinnvoll**
- [x] Testrunde 1 mit dem Kind (10.11.2026)
- [x] Schulbücher und nächste Arbeit geklärt (siehe Abschnitt 1)
- [ ] Reihenfolge der Themen mit dem Schulbuch abgleichen
- [x] „Lösung als Animation“ für die Arbeitsthemen (Vorrangregeln, Potenzen, Division, Teilbarkeit)
- [x] „Lösung als Animation“ auf alle übrigen Themen übertragen (`lerndax-v19`, 11.11.2026)
- [ ] Hinweis zu den `lerndax_`-Tabellen in der `status.md` des Familienkalenders (Auftraggeber)
- [ ] Prüfen, ob der LernDax-Link im Familienkalender eingebaut ist

**Später**
- [ ] Idee Auftraggeber (10.11.2026): **LernDax irgendwann öffentlich machen**, mit den Trainingsseiten
      als Beispielen. Wäre dann nötig: eigene Datenbank (nicht im Familienkalender-Projekt),
      Registrierung bzw. Konten für Fremde, Impressum und Datenschutzerklärung, keine Familien-
      oder Schulnamen in Repository und Doku (seit `lerndax-v17` erledigt, nur der GitHub-Verlauf und der
      Benutzername in der Webadresse enthalten sie noch), Rechte an Buchseitenangaben prüfen. Nicht beschlossen.
- [ ] Klasse 6 (Gebrochene Zahlen, Zuordnungen, Dreiecke & Vierecke, Prismen, Anteile), dann
      Klasse 4 und die übrigen Klassen
- [ ] Sammelkarten (Gauß, Eratosthenes, Pythagoras …) als Belohnung
- [ ] Klassen-Bereich für die Klasse des Kindes (eigenes Thema, siehe oben), evtl. mit Terminen aus dem Familienkalender
- [ ] „Heute geübt“ im Familienkalender anzeigen (gemeinsam mit dem Kalender-Projekt)
- [ ] Elternbereich von MaDax auf die Startseite verlegen, sobald ein zweites Fach kommt
- [ ] Phase 1 (Klasse 5): DeDax, EnDax, dann BioDax, GeoDax, GeDax, TecDax; vielleicht MuDax, KuDax, EthDax
      (Fahrplan und offene Fragen in `faecher/README.md`)
- [ ] Welche 2. Fremdsprache ab Klasse 6? Stundenplan-Kürzel der Schule mit der amtlichen Liste vergleichen

## 10. Verlauf

**10.11.2026** (alles in einem langen Chat mit Claude)
- Idee: Mathe-App für das Kind; Lehrplan Gymnasium Sachsen ausgewertet; Prototyp Klasse 5 als
  „Mathelix“ gebaut (22 Themen, Tipps, Lösungswege).
- Erklär-Animationen (u. a. π-Rad), Primzahl-Erklärung überarbeitet, Lösung nach dem Antworten,
  Pause/Langsam-Modus, Entdecken-Paket (14 Staunen-Momente).
- Synchronisation: GitHub Pages + Supabase im Projekt familienkalender, Anmeldung mit
  Familienkonto, Eltern-PIN; Repository angelegt, Pages eingeschaltet, Rechte korrigiert.
- Umbau zum Dachprojekt **LernDax** (Plattform + Fächer), Repository umbenannt, alte
  `mathelix_`-Tabellen entfernt, Kind-Profil angelegt.
- Link-Auftrag an das Familienkalender-Projekt übergeben.
- Dachs-Kopf in App-Icons größer, Zwischenspeicher-Problem auf dem iPhone gelöst, Logo im
  Kopfbereich mit mehr Rand.
- **Avatare** eingeführt (Spalte `avatar` in `lerndax_profiles`, Version `lerndax-v6`).
- Tests ins Projekt übernommen (`tests/`), diese Datei angelegt.
- Testrunde mit dem Kind erledigt.
- **Themen-Symbole** neu gezeichnet und größer (44 statt 34 Pixel); orange „×“-Kästchen
  in der Mathelix-Kopfzeile entfernt (Version `lerndax-v7`).
- Schulbücher und Mathe-Klassenarbeit am 24.11. eingetragen, Abgleich der Arbeitsthemen mit
  Mathelix, Plan für die zwei Wochen bis zur Arbeit.
- Entscheidung: Klassenarbeiten und Klassenspezifisches **nicht** in die allgemeine App, sondern
  später in einen eigenen Klassen-Bereich. Kachel „Klassenarbeit 24.11.“ daher nicht gebaut.
- Schulunterlagen gesichtet (Ordner des Auftraggebers zur Schule, Familienkalender-Status,
  Schulhandbuch, LernSax): **keine Fachunterlagen** (Arbeitsblätter) vorhanden, Mathe-
  Unterlagen kommen auf Papier. Neu: Mathe-Vergleichsarbeit im Februar 2027.
- Konzept Trainingsseite je Arbeit festgehalten: zuerst nur für das eigene Kind über den Familienkalender,
  ohne Anmeldung nutzbar gebaut, damit Klassenkameraden später per Link dazukommen können.
- Potenzen, Division und Teilermengen erweitert (Version `lerndax-v9`).
- **Trainingsseite** für die Mathe-Arbeit am 24.11. gebaut (`?t=mathe-2026-11-24`), nur über den Link
  erreichbar, ohne Anmeldung nutzbar, angemeldet synchronisiert; neuer Test `tests/training.py`
  (Version `lerndax-v10`).
- Erklärung „Potenzen“ neu aufgebaut: erst Basis/Exponent, Verdoppeln, Zehnerpotenzen, Sonderfälle,
  Quadratzahlen zum Schluss (Version `lerndax-v11`).
- **Erklärungen passend zur Aufgabe** für Vorrangregeln, Potenzen, Division (neue Animation
  „schriftlich Stelle für Stelle“) und Teilbarkeit (neue Animation); neuer Test
  `tests/ex_aufgabe.py`. Fehler behoben: „Was rechnest du zuerst?“ konnte Rechnungen mit negativem
  Zwischenergebnis erzeugen (z. B. 2 − 4 + 3 · 4). Version `lerndax-v12`.
- Hinweis Auftraggeber: blaue Markierung bei den Potenzen saß nicht genau. Ursache: Nach einer Hochzahl
  blieb der Rest der Zeile hochgestellt (leeres `<tspan>` wird vom Browser ignoriert, jetzt mit
  unsichtbarem Zeichen). Markierungs-Kästen werden jetzt nach der gemessenen Textgröße gesetzt
  (`fitBox`, auch bei der Division). Version `lerndax-v13`.
- Entscheidungen Auftraggeber: ein Kind; geübt wird am iPhone der Eltern, am Computer und Tablet;
  Ziel eine Runde pro Tag; Trainingsseite bleibt nach der Arbeit stehen; Idee „später öffentlich“.
- **Tagesziel** eingebaut und mit synchronisiert (Version `lerndax-v14`).
- **Vielfache** und neues Thema **Textaufgaben** (Querbeet zu den Arbeitsthemen), auch auf der
  Trainingsseite (Version `lerndax-v15`).
- **Vorrangregeln** und **Rechengesetze** als neue Themen in LB 1 (nach „Runden“, wie im Buch),
  mit eigenen Symbolen und Animationen „Der Rechenbaum“ und „Drei Rechengesetze zum Anschauen“
  (Version `lerndax-v8`). Aufgabenarten:
  - Vorrangregeln: Punkt vor Strich (+, −, :), Klammer zuerst, nur Strich bzw. nur Punkt von links
    nach rechts, Hochzahl vor Punkt, (a + b)², längere Ketten, „Was rechnest du zuerst?“,
    „Welche Rechnung ergibt …?“ (Klammer ja/nein)
  - Rechengesetze: Gesetz benennen (Auswahl mit Fach- und deutschem Namen), Lücken füllen,
  „Stimmt das?“ (Kommutativ-/Assoziativgesetz gelten nicht für − und :), ausklammern
- **Prüfung aller Aufgaben** (Wunsch Auftraggeber, Version `lerndax-v16`). Behoben:
  - Fahrpläne: Lösungsweg zeigte negative Minuten, wenn die Fahrt vor der vollen Stunde endet;
    „Wie lange dauert die Fahrt?“ rechnet jetzt wie im Tipp über die volle Stunde.
  - Geld immer mit zwei Nachkommastellen (5,60 € statt 5,6 €), Preise realistisch (Brezel 0,60–1,50 €).
  - Dezimalzahlen mal einstellig: Faktor hat immer zwei Nachkommastellen, sonst passte der Lösungsweg nicht.
  - „Zahlen vergleichen“: nie mehr zwei gleich aussehende Zahlen (gleich große als 0,56 und 0,560).
  - Tipp bei · 10 / : 10 sagt jetzt wie die Animation: „Die Ziffern rücken, das Komma bleibt.“
  - Primfaktoren dürfen auch mit Hochzahl eingegeben werden (2^3·5 oder 2³·5); die Lösung zeigt beide Schreibweisen.
  - Weniger Raten: „Teiler & Vielfache“ nur noch 30 % Ja/Nein (neu: „Welche Zahl ist durch 6 teilbar?“
    mit 4 Auswahlen), Primzahlen nur noch 25 % Ja/Nein (neu: „Welche Zahl ist eine Primzahl?“).
  - Texte: „von 72 Kindern“, „ein Siebtel“ statt „ein 7tel“, Potenz-Tipp „kommt 5-mal als Faktor vor“
    (bei hoch 1 kein „Nicht 7 · 1!“ mehr), Primzahl-Erklärung: „genau zwei Teiler, die 1 ist keine Primzahl“.
  - Keine echten Namen mehr in Aufgaben (vorher Vorname des Kindes und Klassenbezeichnungen): Textaufgaben in der Du-Form
    oder mit neutralen Vornamen, weil die Trainingsseite per Link öffentlich ist.
  - Schriftliches Dividieren höchstens vierstellig (vorher bis 21 600), wie in der Doku beschrieben.
  - Doku: README-Fahrplan (Kalender-Knopf erledigt), SETUP (kein eigenes Handy).
- **Doku neutral** (Wunsch Auftraggeber, Version `lerndax-v17`): `README.md`, `STAND.md`, `SETUP.md`,
  Tests und Code-Kommentare ohne Namen von Kind, Familie, Schule und Stadtteil; Fahrplan-Aufgaben
  ohne den Stadtteil der Schule. Persönliches in `notizen/familie.md` (nur lokal), dort liegt auch die
  vorherige Fassung dieser Datei (`notizen/STAND-vor-v17.md`).
- Hinweis Auftraggeber (Bildschirmfoto „2/25 in Prozent“, Antwort 12,5): Die Animation zeigte immer 3/4
  statt der Aufgabe. Jetzt **Lösung als Animation** mit dem Bruch der Aufgabe und ähnliches Beispiel vorher;
  neue Chips 2/25 und 1/8. Typischer Fehler „Nenner durch Zähler“ (25 : 2 = 12,5) bekommt einen eigenen
  Hinweis. Version `lerndax-v18`.
- **Prüfung aller Erklär-Animationen** (Wunsch Auftraggeber, 11.11.2026, Version `lerndax-v19`): 14 von
  20 Animationen zeigten nach einer falschen Antwort nur ein festes Beispiel statt der Aufgabe, manche
  sogar den falschen Teil (Umfang-Aufgabe → Fläche, Stufenwinkel → Nebenwinkel, Vielfache → Quersumme).
  Jetzt zeigt jede Animation die eigene Aufgabe und vorher ein ähnliches Beispiel (Liste in Abschnitt 3).
  Außerdem: Einheiten-Satz „jede Stufe 10-mal“ korrigiert (1 km = 1000 m, Zeit Faktor 60), Dezimal-
  Vorführung ohne „passt nicht in die Tafel“, Grammatik („Es bleibt 1 übrig“, „1 Teil“), Potenz-„Merke“
  einheitlich („als Faktor vorkommt“), Schachbrett-Zahlen mit Leerzeichen statt Punkten, Preise in
  Textaufgaben realistisch. Neue Techniken: `titleFor(ctx)` für passende Überschriften, `ex.alt` für
  ähnliche Beispiele bei „Stimmt das?“, „Geschickt rechnen“ und „Potenzen vergleichen“.
  Test `tests/prim.py` an die Auswahlaufgabe mit 4 Zahlen angepasst.

**11.11.2026**
- Die Einträge zu `lerndax-v19` (Prüfung aller Erklär-Animationen) stammen von diesem Tag.
- **Komplett-Prüfung** von App, Design, Aufgaben und Erklärungen (Wunsch Auftraggeber): 179 000 Aufgaben
  unabhängig nachgerechnet (0 Rechenfehler), alle Bildschirme in vier Größen, alle Animationen mitgelesen.
  31 Befunde; die Fehler und Widersprüche sind mit **`lerndax-v20`** behoben, die Geschmacks- und
  Schwierigkeitsfragen stehen als offene Entscheidungen in Abschnitt 9.
- Behobene Fehler: Startseite zeigte „22 Themen“ (richtig 25) · „2 Themas“ → „2 Themen“ · „Stimmt das?“
  schrieb „= geht nicht“ · Winkel an Geraden nannte β erst Nebenwinkel, dann Scheitelwinkel (bei
  Aufgaben wird jetzt nur der gegebene Winkel und β beschriftet) · Lücken-Aufgaben am Handy: Eingabefeld
  steht jetzt am Ende der Rechnung · dieselbe Aufgabe kommt in einer Runde nicht mehr doppelt
  (Winkelarten: 90° und 180° seltener) · Fahrplan-Merksatz nur noch, wenn die Fahrt über die volle Stunde
  geht · Kürzen: „schrittweise erst durch 2“ nur, wenn es passt · L-Figur: Lösung und Animation zeigen,
  woher Breite und Höhe des fehlenden Stücks kommen · „letzte zwei Ziffern sind 04“ · Zahlen
  vergleichen: Lösung mit aufgefüllten Nullen statt „0,29 = 0,29“, Animation mit den Zahlen der Aufgabe
  statt „A“ und „B“ · Umfang: „Erste Seite: 11 m“, bei der fehlenden Seite steht am Ende b = …
- Tipp, Lösung und Animation passen jetzt zusammen: „Mach die Probe“ hat eine eigene Animation
  (rückwärts rechnen) · Wechselgeld wird in Lösung und Animation **ergänzt** (Zahlenstrahl mit Sprüngen,
  in Euro) · Achtel in Prozent über Tausendstel · Hundertertafel folgt der Richtung der Aufgabe
  (Prozent → Dezimalzahl, Dezimalzahl → Bruch) · „vollständig gekürzter Bruch“: ungekürzt gilt wie beim
  Kürzen als „noch nicht fertig“ · Primzahl-Animation probiert nur 2, 3, 5, 7 (wie der Tipp) ·
  Ausklammern-Beispiel mit Summe 100, Divisions-Beispiel zweistellig, wenn die Aufgabe es ist ·
  Begriffe einheitlich: „malnehmen“, „Potenz“ statt „Hochzahl“, „arithmetisches Mittel (Mittelwert)“ ·
  Startseite lobt erst, wenn das Tagesziel (eine ganze Runde) geschafft ist · alle 25 Kacheln haben ▶.
- Neuer Test `tests/loesung.py` (Lösungs-Animation zu jeder Aufgabenart); Doku berichtigt (README-
  Fahrplan, Lernstand-Felder, Teiler-Aussage, Lehrplan-Lücken).
- **Entscheidungen zur Prüfung umgesetzt (`lerndax-v21`)**, siehe Abschnitt 9. Neue Aufgabenarten:
  - Zahlen vergleichen: drei Zahlen ordnen, größte/kleinste Zahl eintippen (Auswahl nur noch 25 %);
    neue Animation „Zahlen ordnen in der Stellenwerttafel“
  - Rechengesetze: im Kopf mit dem Distributivgesetz rechnen, beide Seiten ausrechnen (Auswahl von 58 % auf 24 %)
  - Division: „Welche Zahl wurde geteilt?“ (Ja/Nein von 25 % auf 11 %); Teilbarkeit Ja/Nein 24 %
  - Erweitern: mit einer Zahl erweitern, Erweiterungszahl finden · Bruch/Dezimal/Prozent: 14 weitere
    Brüche, Dezimalzahl → Prozent
  - Anteile: Anteil am Streifen ablesen, vom Teil auf das Ganze schließen (jeweils mit eigener Animation)
  - Koordinaten: „Welcher Punkt hat die Koordinaten …?“ (ein falscher Punkt mit vertauschten Werten),
    Punkt verschieben · Winkelarten: Art am Bild schätzen, „Welcher Winkel ist ein stumpfer Winkel?“
  - Leichter: Klassenfahrt mit 10, 20 oder 25 Kindern; fehlende Rechteckseite nur mit einstelliger
    Seite, 10 oder 20; „· 10 / : 10“ mit höchstens drei Nachkommastellen
  App: „Gemischt“ nur aus geübten Themen, Rückfrage beim ✕ (sobald eine Antwort gegeben wurde),
  Tipp-Knopf verschwindet, Punkt als Komma, Zurücksetzen mit dem Wort LÖSCHEN, dunkle Schrift und
  dunkle Symbole auf Orange und Gelb, breite Darstellung ab 700 und 1000 Pixel (`data-view` am
  `#app` steuert die Breite je Ansicht). Geprüft: 87 000 neue Aufgaben unabhängig nachgerechnet.
- **Fächer-Namen und Fächerplan** (Version `lerndax-v22`): Namensschema **Kürzel + Dax** nach den
  amtlichen sächsischen Fächerkürzeln. „Mathelix“ heißt jetzt sichtbar **MaDax**; interne Namen bleiben.
  Neue Liste aller 18 Fächer der Klassen 1–10 in `web/plattform/faecher.js`; die Startseite zeigt
  daraus für Klasse 5 MaDax und unter „Kommt bald“ DeDax, EnDax, BioDax, GeDax, GeoDax, TecDax.
  Fächerplan mit drei Phasen in `faecher/README.md`.
- DeDax-Symbol auf der Startseite zeigt „De“ statt „Aa“ (Version `lerndax-v23`).
- **Dachs mit Fach-Hut** (Version `lerndax-v24`): MaDax-Dachs mit Papierhut aus Karopapier in der
  Mathe-Kopfzeile und beim Lob nach der Runde. Hüte für DeDax (Buch) und EnDax (Union-Jack-Mütze)
  liegen in `web/icons/` bereit. Regeln und Ideen für weitere Hüte in `faecher/README.md`.
- **Lob-Szene** (Version `lerndax-v25`): Nach einer Runde stehen der Avatar des Kindes und der
  Fach-Dachs nebeneinander, der Dachs spricht in einer Sprechblase mit dem Namen des Kindes.
  Vier Stufen (ab 90 %, 70 %, 50 %, darunter) mit eigenem Spruch, Symbol und kurzer Bewegung;
  ohne gewählten Avatar steht der Dachs allein. Idee für später: Hut-Tausch beim Tagesziel,
  Spruch zur Serie; für ältere Klassen abschaltbar.
- **Entdecken-Symbole neu** (Version `lerndax-v26`): Die 14 Kacheln zeigen jetzt selbst gezeichnete
  Symbole in einheitlicher Größe und Strichstärke statt Schriftzeichen und Emojis (die je nach Gerät
  unterschiedlich groß und teils kaum erkennbar waren). Definition am Ende von `entdecken.js` (`DI`).
- Entdecken-Symbole Sieb, Sonnenblume (jetzt mit Blütenblättern) und Pythagoras gröber gezeichnet, alle Symbole etwas größer (Version `lerndax-v27`).
- **Fach-Dachse auf der Startseite** (Version `lerndax-v28`): MaDax-Kachel zeigt den Dachs mit Papierhut statt „×“;
  unter „Kommt bald“ stehen DeDax, EnDax, BioDax (Strohhut), GeDax (Römerhelm), GeoDax (Tropenhelm) und
  TecDax (Headset) mit ihren Dachsen. Vier neue Bilder in `web/icons/`.
- **Entscheidung Auftraggeber (11.11.2026):** Erst MaDax so weit bringen, bis es rund ist (Inhalt, Gestaltung,
  Fehler), dann erst ein neues Fach beginnen.
- Hüte geändert (Version `lerndax-v29`): BioDax trägt einen Fliegenpilz, GeDax ein Pharaonen-Kopftuch (Wahl des Auftraggebers).
- GeoDax trägt jetzt einen Globus als Mütze (Version `lerndax-v30`, Wahl des Auftraggebers). TecDax bleibt beim Headset (nach Vergleich mit fünf Alternativen). Damit stehen alle sieben Hüte fest.
- **MaDax-Start aufgeräumt** (Version `lerndax-v31`), nach einem Design-Durchgang durch die ganze Mathe-App:
  „Gemischt“ und „Fehler-Training“ erscheinen erst als große Kacheln, wenn sie nutzbar sind, vorher als
  lesbarer Hinweis; Klassen-Leiste 1–10 passt am Handy in eine Zeile; Balken „Entdecken“ springt zum
  Entdecken-Bereich; vereinfachter Papierhut für die Kopfzeile (`icons/madax-klein.svg`).
  Die übrigen Punkte des Durchgangs sind mit `lerndax-v32` entschieden (siehe nächster Eintrag).
- **Design-Durchgang abgeschlossen** (Version `lerndax-v32`), jede Entscheidung vom Auftraggeber:
  - Eigene Symbole statt Emojis: neue Datei `web/plattform/symbole.js` (23 farbige Zeichnungen). Sie tauscht
    Emojis auf der ganzen Seite automatisch aus (auch Startseite und Trainingsseite); im Quelltext dürfen
    weiter Emojis stehen. Animationen (SVG) bleiben unberührt.
  - Entdecken: Zu Beginn sitzt der staunende MaDax-Dachs etwa zwei Sekunden auf der Bühne (`icons/madax-staunt.svg`).
  - Lob: Hinweis, was für den nächsten Stern fehlt (50 %, 75 %, 90 % der letzten 10 Aufgaben).
  - Elternbereich: zwei Reiter „Fortschritt“ und „Geräte & Konto“ (Überschrift „Für Eltern“).
  - Willkommen: Dachs mit Sprechblase, nach dem Namen einmalig die Avatar-Wahl.
  - Bewusst unverändert: Aufgabenkarte am PC, einzelne Themen-Kachel in der letzten Reihe.
  - Tests angepasst: Sie überspringen die Avatar-Frage (`lerndax.avatar.asked`) und öffnen im Elternbereich den Reiter „Geräte & Konto“.
- **Design-Prüfung** (Version `lerndax-v33`): alle Ansichten auf vier Bildschirmgrößen (320, 390, 768, 1280 Pixel)
  automatisch auf Überlauf, abgeschnittenen Text, Kontrast, Schriftgröße und Tippflächen geprüft und durchgesehen. Behoben:
  Elternbereich lief auf kleinen Handys (320 px) über den Rand; Sprechblase beim Lob hing auf Tablet und PC nicht am Dachs;
  weiße Schrift auf Blau, Grün und Lila (Lernbereichs-Marken) und auf Orange („Fertig“ in der Avatar-Wahl) war zu
  kontrastarm; Erklär-Knopf, Farbwahl, Logo und Eltern-Link hatten zu kleine Tippflächen; MaDax-Kachel der
  Startseite nutzt allein die ganze Breite.
- **Lehrplan-Lücken Klasse 5 geschlossen** (Version `lerndax-v34`): MaDax hat jetzt **32 Themen** (vorher 25).
  Neu, jeweils mit Aufgaben, Tipp, Lösungsweg, eigenem Symbol und Erklär-Animation (auch „Lösung zu deiner Aufgabe“
  und „ähnliches Beispiel“):
  - LB 1: **Überschlagen** (runden und rechnen, „Welches Ergebnis kann stimmen?“, „Reicht das Geld?“) und
    **Schriftlich rechnen** (plus, minus, mal einstellig und zweistellig)
  - LB 2: **Gemischte Zahlen** (in beide Richtungen, Einordnen, Sachaufgabe) und **Dezimalzahlen runden**
  - LB 3: **Symmetrie & Spiegeln** (Symmetrieachsen zählen, Art der Symmetrie, Spiegeln an einer Geraden,
    Punktspiegelung, Verschiebung ablesen)
  - LB 4: **Würfelnetze & Baupläne** (Würfelnetz ja/nein, gegenüberliegende Flächen, Würfel zählen, Ansicht von vorn)
  - LB 5: **Schätzen wie Fermi** (zwölf Fragen, Größenordnung wählen, Lösung in vier Schritten)
  Neue Dateien: `web/mathe/generatoren/klasse5-luecken.js` und `web/mathe/erklaerungen/klasse5-luecken.js`
  (eigene Dateien, damit sie Änderungen an `klasse5.js` nicht in die Quere kommen; sie hängen ihre Themen in die
  Lernbereiche ein). Die Runden-Erklärung in `klasse5.js` kann jetzt auch Dezimalzahlen (`scale`) und berechnet
  die Nachbarzahlen immer aus der aktuellen Zahl (vorher zeigte der Regler am rechten Rand negative Abstände).
  Geprüft: je Thema 3000 erzeugte Aufgaben ohne Fehler; alle Würfelnetze durch Falten nachgerechnet; alle 16
  Figuren auf ihre Symmetrie nachgerechnet; 96 Lösungs-Animationen laufen durch und nennen das richtige Ergebnis;
  512 Aufgaben über alle 32 Themen in der App gelöst.
- Neuer Test `tests/design_audit.py` (Design-Prüfung auf vier Bildschirmgrößen), siehe `tests/README.md`.
- **Entscheidung Auftraggeber (12.11.2026): MaDax bleibt am sächsischen Lehrplan.** Die Themen einer Klassenstufe sind
  genau der Stoff nach Lehrplan Gymnasium Sachsen; kein Stoff anderer Bundesländer oder höherer Klassen im Pflichtteil.
  Alles jenseits des Lehrplans gehört in den Bereich „Entdecken“. Idee, nicht beschlossen: je Thema eine freiwillige
  Stufe „Knobeln“ mit schwereren Aufgaben, die nicht für die Sterne zählt. Ein späteres „Bundesland wählen“ wäre nur
  eine zusätzliche Zuordnung der vorhandenen Themen zu Klassenstufen und braucht keinen Umbau.
- **Lehrplan-Reste Klasse 5** (Version `lerndax-v35`): Das Thema „Würfelnetze & Baupläne“ heißt jetzt **„Netze & Schrägbilder“**
  und hat neue Aufgabenarten: Quadernetz (markierte Fläche, ganzes Netz = Oberfläche) und Schrägbild (schräge Kante halb
  so lang, echte Tiefe, welche Kanten echt/verkürzt/gestrichelt, Ecken/Kanten/Flächen). „Symmetrie & Spiegeln“ hat zusätzlich
  **Drehungen** um einen Punkt (Vierteldrehung links/rechts, halbe Drehung). Alle mit eigener Animation.
  Annahme zum Schrägbild: Kanten nach hinten unter 45° und halb so lang (übliche Schul-Konvention; bei Gelegenheit mit dem
  Schulbuch abgleichen). Elternbereich: je Lernbereich eine Zeile „x von y Themen geübt · Sterne“.
  Langer Animations-Test über alle 32 Themen gelaufen (`tests/loesung.py 5`). Die Trainingsseite für den 24.11. bleibt
  unverändert: Ihre Themen stammen aus der Themenliste der Schule; Überschlagen und schriftliches Rechnen stehen dort nicht.
- **Abgleich mit dem Schulbuch** (Version `lerndax-v36`): MaDax Klasse 5 mit dem Stoffverteilungsplan zu
  Lambacher Schweizer 5 Sachsen (Klett) verglichen, Ergebnis in `faecher/mathe/lehrplan/schulbuch-abgleich.md`.
  Drei Themen fehlten und sind neu (jetzt **35 Themen**), jeweils mit Aufgaben, Tipp, Lösungsweg, Symbol und Animation:
  - LB 1: **Große Zahlen & Zahlenstrahl** (Zahlenstrahl ablesen, Stellenwert, Zahlwort → Zahl, Vorgänger/Nachfolger,
    ordnen, Nullen zählen, Kurzschreibweise „9 HT + 3 T“)
  - LB 2: **Brüche am Zahlenstrahl** (Bruch ablesen, Brüche vergleichen mit <, =, >, Bruch als Quotient „3 : 4 = 3/4“)
  - LB 3: **Senkrecht & parallel** (Lage zweier Geraden auf Kästchenpapier über das Schrittmuster, passende Gerade
    finden, Abstand Punkt–Gerade, Merksätze)
  Die Themen stehen jetzt **in der Reihenfolge des Schulbuchs** (Tabelle `FOLGE` in `web/mathe/generatoren/klasse5-buch.js`).
  Neue Dateien: `web/mathe/generatoren/klasse5-buch.js`, `web/mathe/erklaerungen/klasse5-buch.js`.
  Offen gelassen (siehe Abgleich): Winkel mit dem Geodreieck messen, Rechengesetze mit Dezimalzahlen, römische Zahlen
  und Zweiersystem (Kandidaten für „Entdecken“). Noch zu prüfen: ob die Schule genau diese Buchausgabe nutzt.
- **Buchstoff lückenlos** (Version `lerndax-v37`): Neues Thema **Winkel messen** in LB 3 (jetzt **36 Themen**): Winkel am
  aufgelegten Geodreieck ablesen (Schenkel rechts → äußere Skala, links → innere Skala), Winkel schätzen, „welche der zwei
  Zahlen gilt?“, überstumpfer Winkel als Rest zu 360°. Winkel sind Vielfache von 5°. Mit Animation (Geodreieck anlegen,
  Skala wählen, mitzählen, Probe spitz/stumpf).
  Mehr Aufgabenarten in den zwei jüngsten Themen: **Brüche am Zahlenstrahl** (zwischen welchen ganzen Zahlen, Vergleich
  mit einem Halben, größter/kleinster von drei Brüchen, Division mit Ergebnis über 1) und **Senkrecht & parallel**
  (Parallele/Senkrechte durch P trifft welchen Punkt, Abstand paralleler Geraden, Paare paralleler Seiten und rechte
  Winkel in Figuren zählen).
- **Buch-Zusätze** (Version `lerndax-v38`): „Mit Dezimalzahlen rechnen“ hat die neue Aufgabenart **„Rechne geschickt“**
  (z. B. 2,5 · 7 · 4 oder 3,7 + 1,8 + 6,3; etwa jede fünfte Aufgabe; Animation aus „Geschickt rechnen“ über `ex.via`).
  Bewusst nicht in „Geschickt rechnen“ selbst eingebaut, weil dieses Thema im Training vom 24.11. steckt (dort nur
  natürliche Zahlen). Zwei neue Entdeckungen (im Buch „Exkursion“): **Römische Zahlen** (`roemisch`, Zerlegung mit
  größtem Stück zuerst, Abzieh-Regel) und **Zählen wie ein Computer** (`binaer`, fünf Lampen 16-8-4-2-1 mit Regler).
  Damit ist jede Lerneinheit des Schulbuchs abgedeckt. **Knobel-Stufe: weiter nur Idee**, braucht eine Entscheidung
  (siehe Vorschlag im Chat vom 12.11.2026): schwerere Aufgaben müssen je Thema eigens geschrieben werden.
- **Knobel-Stufe** (Version `lerndax-v39`, Entscheidung Auftraggeber 12.11.2026: bauen, für alle Themen):
  Zu allen 36 Themen gibt es schwerere, freiwillige Aufgaben (gleicher Stoff, aber mehr Schritte, rückwärts denken,
  Ideen verbinden; je Thema 3 bis 5 Aufgabenarten). Datei `web/mathe/generatoren/klasse5-knobel.js`, je Thema `topic.knobel()`.
  So kommt man hin: (1) Balken „Knobeln: harte Nüsse“ auf der Start- und der Trainingsseite, sobald ein Thema
  **zwei Sterne** hat (gemischt aus allen Themen mit zwei Sternen); (2) Knopf „Jetzt knobeln“ nach einer Runde mit
  mindestens 75 %. Eine Knobel-Runde hat 5 Aufgaben. Sie **zählt nicht für die Sterne** und nicht fürs Fehler-Training,
  aber fürs Tagesziel. Geknackte Aufgaben werden je Thema gezählt (`S.knobel = { id: { n, ok } }`, Zeichen an der Kachel,
  wird mit synchronisiert: `plattform/sync.js` nimmt je Thema den höheren Wert). Knobel-Aufgaben haben Tipp und
  Lösungsweg, aber keine Animation. Neues Symbol „puzzle“ in `plattform/symbole.js`. Neuer Test `tests/knobel.py`.
  Geprüft: je Thema 2000 erzeugte Aufgaben ohne Fehler, alle Aufgabenarten durchgelesen, 225 Knobel-Aufgaben in der
  App mit der richtigen Antwort gelöst (jede wird angenommen).
- **Gründliche Prüfung aller 36 Themen** (Version `lerndax-v40`): Zu jedem Thema alle Aufgabenarten mit Antwort, Tipp und
  Lösungsweg durchgelesen (normale Aufgaben und Knobel-Aufgaben), dazu automatisch geprüft, ob die richtige Antwort im
  Lösungsweg steht und ob bei Auswahl-Aufgaben die richtige Antwort nicht immer an derselben Stelle steht.
  Korrigiert: Fermi-Lösungswege schrieben vierstellige Zahlen mit Lücke („1 200“ statt „1200“ wie sonst in der App);
  „1 Ganze“ → „1 Ganzes“; Tipp bei Würfelnetzen sprachlich; „An jeder“ bei nur einer Symmetrieachse; Knobel-Aufgabe
  „Was ist größer: 2⁵ oder 5²?“ hatte die richtige Antwort fast immer an erster Stelle. Rechenfehler wurden keine gefunden.
  Bekannt und so gelassen: Beim Überschlagen auf Zehner kann die Schätzung weit weg liegen (17 · 28 ≈ 600, genau 476);
  der Lösungsweg sagt das dazu.
  Tests nach der Prüfung: 576 Aufgaben in der App gelöst, 546 Lösungs-Animationen gelaufen. Dabei gab es in einem von
  vier Läufen eine einzelne Meldung (1 von 108), die sich in 546 weiteren Animationen nicht wiederholt hat; Ursache offen,
  vermutlich Zeitüberschreitung im Test bei hoher Last. Beim Test mit Bruno darauf achten, ob eine Animation hängen bleibt.
- **Lesbarkeit und Übersicht** (Version `lerndax-v41`, vom Auftraggeber ausgewählt; die Klassen-Leiste 1–10 bleibt bewusst
  unverändert): Sterne mit dunklem Rand (leere Sterne weiß mit grauem Rand, volle goldgelb), dadurch auf Weiß gut sichtbar.
  Geodreieck als vergrößerter Ausschnitt (Spitzen abgeschnitten, Zahlen rund ein Drittel größer; viewBox `42 46 256 142`).
  Kleingedrucktes in Lösungsweg, Tipp und Animationstext größer und dunkler. Brüche im Fließtext etwas kleiner, damit die
  Zeilen ruhiger stehen. Puzzle-Symbol mit weißem Rand. Startseite: neuer Knopf **„Weiter üben“** (zuletzt geübtes Thema,
  `S.lastTopic`, nur auf diesem Gerät gemerkt); „Entdecken“ und „Knobeln“ stehen nebeneinander in einer Zeile; je
  Lernbereich eine Zeile „x von y geübt“; ein Lernbereich, in dem **alle** Themen drei Sterne haben, ist eingeklappt
  („Geschafft! Themen anzeigen“). `tests/ui2.py` klappt eingeklappte Bereiche vor dem Klick auf.
- **Abgleich mit dem Originaltext des Lehrplans** (Version `lerndax-v42`): Drei Lücken gefunden und geschlossen, jeweils
  als Aufgabenart mit eigener Animation (`erweitere()` in `erklaerungen/klasse5-buch.js`): **Dezimalzahl : einstellige
  Zahl** (k5-dezimal, etwa jede fünfte Aufgabe), **Koordinaten mit Halben** (k5-koord, etwa jede sechste),
  **zusammengesetzte Körper, Volumen** (k5-quader, etwa jede fünfte). Knobel-Aufgabe mit Ungleichung umformuliert
  (Ungleichungen sind laut Lehrplan erst Klasse 6). Was bewusst fehlt (Zeichnen, DGS, Projekte) steht in
  `faecher/mathe/lehrplan/sachsen-gymnasium.md`.
  **Fehler behoben:** Bei Aufgaben wie „2250 : 1000“ sagte die Stellenwerttafel-Animation „Das passt nicht mehr in die
  Tafel“, weil die Endnull beim Verschieben keinen Platz hatte (`klasse5.js`, Tafel wird jetzt breit genug angelegt).
  Das war die einzelne Test-Meldung aus v40. `tests/loesung.py` prüft Koordinaten jetzt mit Komma-Schreibweise.
- **Beschriftungen in Bildern** (Version `lerndax-v43`, Rückmeldung Auftraggeber: Name einer Geraden von einer Linie
  verdeckt, Punktnamen außerhalb des Bildes, Drachenviereck sah rechtwinklig aus):
  In „Senkrecht & parallel“ werden die Namen von Geraden und Punkten jetzt automatisch gesetzt (`platziere()` in
  `generatoren/klasse5-buch.js`, auch von der Animation benutzt): im Bild, nicht übereinander, nicht auf einer Linie,
  mit hellem Rand. Drachenviereck und Dreieck bei „rechte Winkel zählen“ haben keine Ecke mehr in der Nähe von 90°.
  Neuer Test **`tests/bild_audit.py`** prüft die Bilder aller Themen; `tests/loesung.py` prüft die Animationen auf
  Texte außerhalb des Bildes. Damit gefunden und behoben: Zahlenstrahl mit Millionen (Zahlen ragten rechts hinaus),
  L-Figur bei Umfang & Fläche (Maß links abgeschnitten), Schrägbild („2,5 cm gezeichnet“ rechts abgeschnitten),
  Punktname auf dem y der Achse (Koordinatensystem, Spiegeln), Achsen-Beschriftung bei halben Koordinaten,
  Runden-Animation mit siebenstelligen Zahlen, Quader-Animation („c = 2 cm“), Schrittzahlen der Geraden-Animation.
  Außerdem: Die Lösungs-Animation zur Sachaufgabe „gleich große Gruppen“ nannte nur die Zahl der Teiler, nicht die
  Antwort; sie erklärt jetzt, warum 1 und die Zahl selbst wegfallen.
  Stand der Prüfung: 300 Bilder je Thema ohne Auffälligkeit, 632 Lösungs-Animationen und 156 freie Erklärungen ohne Meldung.
- **Dokumentation für die Übergabe** (12.11.2026): Abschnitt 0 „Übergabe“ ergänzt, Abschnitte 3 und 4 auf den Stand
  v43 gebracht, `README.md` und `faecher/README.md` aktualisiert, neuer Startpunkt `faecher/deutsch/README.md` für DeDax.
  Der Auftraggeber macht in einem neuen Chat mit Deutsch weiter.
