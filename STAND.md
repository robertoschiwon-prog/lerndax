# LernDax – Projektstand & Gedächtnis

**Stand: 10.11.2026** · Diese Datei ist das Gedächtnis des Projekts. Sie enthält alles, was in
den Chats mit Claude besprochen, entschieden und gebaut wurde, damit ein neuer Chat (oder ein
Mensch) ohne Vorwissen weitermachen kann.

**Bitte nach jeder Änderung aktualisieren:** Abschnitt „Was fertig ist“, „Offene Punkte“ und
unten den „Verlauf“.

Weitere Dokumente:
- `README.md`: Projektsteckbrief, Grundsätze, Ordner, neues Fach hinzufügen, Fahrplan
- `SETUP.md`: Kurzanleitung für Eltern (Anmelden, Profil, PIN, App aufs Handy)
- `tests/README.md`: automatische Tests
- `faecher/mathe/lehrplan/sachsen-gymnasium.md`: Lehrplan Mathe Gymnasium Sachsen, Klasse 5–10
- `notizen/feedback.md`: offene Fragen an das Kind und Vorlage für Testrunden (nur lokal, nicht auf GitHub)
- `notizen/familie.md`: persönliche Angaben (Kind, Schule, Geräte, Termine, Pfade). **Nur lokal**, weil
  dieses Repository öffentlich ist. Diese Datei hier bleibt deshalb bewusst neutral.

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
  „Dax“ klingt wie **Dachs**, das Maskottchen. Das Mathe-Fach heißt **Mathelix**.

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

### Mathelix (Mathe), Klasse 5 vollständig
- **Kopfzeile:** Dachs (zurück zur LernDax-Startseite), Schriftzug „Mathelix“ (zum Mathe-Start),
  Serie 🔥 und Sterne ⭐. Das frühere orange „×“-Kästchen ist seit 10.11.2026 entfernt
  (wirkte doppelt und wie ein Schließen-Knopf).
- **Startbildschirm:** Avatar + „Hallo <Name>!“, Klassen-Chips 1–10 (nur 5 aktiv; andere zeigen
  die geplanten Lernbereiche laut Lehrplan), „🎲 Gemischt“ (Runde aus allem),
  „🔁 Fehler-Training“ (Themen mit vielen Fehlern), Lernbereiche mit Themen und Sternen
  (Beherrschung), ▶-Knopf für die Erklärung, Entdecken-Bereich, Elternansicht.
- **Themen-Symbole** (seit 10.11.2026): Jedes Thema hat ein selbst gezeichnetes Bildchen
  (z. B. Waage für Gleichungen, Faktorbaum für Primzahlen, Stoppuhr für Zeit) in einem
  44-Pixel-Kästchen. Vorher standen dort kleine Schriftzeichen (≈, ÷, ↘ …), die auf dem Handy
  kaum zu erkennen waren. Datei `web/mathe/symbole.js`; fehlt ein Symbol (z. B. neue Klasse),
  zeigt die App das Zeichen aus `icon` im Generator.
- **5 Lernbereiche, 25 Themen** (nach Lehrplan Gymnasium Sachsen Klasse 5):
  - LB 1 Natürliche Zahlen: Runden · **Vorrangregeln** · **Rechengesetze** · Geschickt rechnen · Potenzen ·
    Schriftlich dividieren · Teiler & Vielfache · Primzahlen & Primfaktoren · Einfache Gleichungen · **Textaufgaben**
  - LB 2 Brüche & Dezimalzahlen: Anteile berechnen · Kürzen · Erweitern ·
    Bruch · Dezimal · Prozent · Mit Dezimalzahlen rechnen · Zahlen vergleichen · Arithmetisches Mittel
  - LB 3 Geometrie: Koordinatensystem · Winkelarten · Winkel an Geraden
  - LB 4 Rechtecke & Quader: Umfang & Fläche · Volumen & Oberfläche
  - LB 5 Mathe im Alltag: Einheiten umrechnen · Fahrpläne & Zeit · Sachaufgaben mit Geld
- **Übungsrunde:** Aufgabe → Eingabe (Zahl, Bruch, Uhrzeit, Primfaktoren oder Auswahl) →
  bei Fehler erst ein **Tipp**, dann der **Lösungsweg**. Fehler fließen ins Fehler-Training.
- **Erklär-Animationen** zu allen 25 Themen (Liste der Grund-Animationen): Runden am Zahlenstrahl · Der Rechenbaum (Vorrangregeln) ·
  Drei Rechengesetze zum Anschauen (Punkte drehen, Streifen umklammern, Rechteck teilen) · Dividieren: Bonbons in Tüten und
  schriftlich Stelle für Stelle · Teilbarkeit: Regeln und Teiler (Quersumme, Endziffern, durch 6,
  Teiler-Paare) ·
  Primzahlen · Potenzen: wie oft malnehmen? (Basis/Exponent, 2ⁿ verdoppeln, Zehnerpotenzen,
  a¹ und 1ⁿ, Quadratzahlen) · Anteile berechnen · Erweitern & Kürzen ·
  Die Hundertertafel · Mal 10 (das Komma bleibt, die Ziffern wandern) · Der Mittelwert macht
  alles gerecht · Erst laufen, dann springen (Koordinaten) · Winkelarten · Winkel an Geraden ·
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
- **Entdecken (14 Staunen-Momente, dunkle „Bühne“):** Ich kann Gedanken lesen! · Der Trick
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
| `web/index.html` | Startseite (Fächer, Avatar, Entdecken-Kachel, Eltern-Link) |
| `web/plattform/config.js` | Supabase-Adresse, **öffentlicher** Schlüssel (`sb_publishable_…`), Tabellen-Präfix `lerndax_`, `allowSignup: false`, Kontoname |
| `web/plattform/sync.js` | Anmeldung, Profile, PIN, Synchronisation, Avatar-Sync (`window.LernDaxSync`, Alias `MathelixSync`) |
| `web/plattform/avatare.js` | Avatar-Figuren (SVG), Farben, Auswahlfenster (`window.LernDaxAvatare`) |
| `web/plattform/trainings.js` | Trainings für einzelne Klassenarbeiten (`window.LERNDAX_TRAININGS`), Aufruf `<fach>/?t=<id>` |
| `web/mathe/index.html` | Mathelix-App (Ansichten, Übungsrunde, Player, Elternansicht) |
| `web/mathe/generatoren/klasse5.js` | Aufgabengeneratoren Klasse 5 (`window.Mathelix.grades[5]`) |
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
- `mathelix.v1`: `{ name, grade, stats:{<themaId>:{n, ok, …}}, days:[JJJJ-MM-TT], total, seen:{<id>:true}, rounds:{JJJJ-MM-TT: n}, resetAt }`
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
- Bei jeder Änderung `VERSION` in `web/sw.js` erhöhen (aktuell **`lerndax-v19`**) und neue
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
Siehe `tests/README.md`. Vor jedem Veröffentlichen mindestens `gen-test.js`, `ui2.py`,
`sync_test.py` laufen lassen.

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
- Offen: Werden im Buch (S. 36–40) auch zweistellige Teiler geübt? Mathelix nutzt bisher nur
  einstellige.

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
- Danach (Lehrplan-Lücken): Symmetrie & Abbildungen, Würfelnetze/Quader-Ansichten, unechte
  Brüche/gemischte Zahlen, Überschlag, Fermi-Aufgaben

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
- [ ] Elternbereich von Mathelix auf die Startseite verlegen, sobald ein zweites Fach kommt
- [ ] Fächer Deutsch und Englisch

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
