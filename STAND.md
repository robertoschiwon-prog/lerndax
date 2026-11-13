# LernDax – Projektstand & Gedächtnis

**Stand: 13.11.2026, Version `lerndax-v86`** · **Zuerst Abschnitt 0 lesen (Übergabe).** Diese Datei ist das Gedächtnis des Projekts. Sie enthält alles, was in
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

## 0. Übergabe vom 13.11.2026 abends: GeDax gebaut (`lerndax-v87`)

- **GeDax (Geschichte) Klasse 5 ist gebaut und live** (Auftrag Roberto: „Baue alles, frage wenig nach. Wir schauen später drüber.“).
  31 Themen in 5 Bereichen = Kapitel von ANNO 1 (Begegnungen mit Geschichte, Frühgeschichte, Ägypten, Griechische Polis,
  Längsschnitt Mensch und Natur), Entdecken (5: Erdgeschichte als ein Tag, Steinzeit-Brunnen/Jahresringe, C-14-Uhr, wandernder
  Kalender, Alexander der Große), Knobeln (104 Varianten). Auf der Startseite als fertiges Fach (`faecher.js`: `themen: 31`).
- Grundlagen: `faecher/geschichte/lehrplan/sachsen-gymnasium.md` (Lehrplan 2019, Originaltext), `schulbuch-abgleich.md`
  (Fotos Inhaltsverzeichnis 13.11.), `themenplan.md`, `fakten.md` (alle Jahreszahlen mit Quellen). Im Unterricht: Kapitel 01,
  Höhlenmalerei (Arbeitsblatt-Foto).
- Tests: `tests/gedax.py 2` (31 Themen, 372 Antworten, 124 Lösungs-Animationen, nichts ragt aus dem Bild), `tests/gedax_knobel.py`
  (520 Knobel-Aufgaben), Generatoren ohne Browser je 2000-mal, `tests/hub.py`.
- **Wartet auf Roberto:** Durchsicht von GeDax; Rechnen über Christi Geburt mit „minus 1“ so wie in der Schule?; Begriffe der
  Quellenarten; welcher Wahlbereich; Rückmeldungen von Bruno zu allen Fächern.

## 0a. Übergabe vom 12.11.2026: Stand und nächster Schritt (EnDax)

**Kurz für den neuen Chat (Stand `lerndax-v54`, Abend des 12.11.2026)**
- **MaDax Klasse 5** (36 Themen) und **DeDax Klasse 5** (30 Themen, 6 Entdeckungen, Knobel-Aufgaben zu allen Themen)
  sind gebaut und live. Die Startseite hat eine Elternübersicht für alle Fächer.
- **Jetzt beginnt EnDax (Englisch, Klasse 5).** Startpunkt mit Vorgehen, offenen Fragen, Technik und den Lehren aus
  DeDax: **`faecher/englisch/README.md`**. Für Englisch ist noch nichts gebaut und nichts ausgewertet.
- Erster Schritt: Lehrplan Englisch Klasse 5 am Originaltext auswerten, dann dem Auftraggeber die offenen Fragen
  **einzeln** stellen (Schulbuch, womit anfangen, Sprache der App, Vokabeln, Vorlesen), dann Themenplan vorlegen.
- Wartet auf den Auftraggeber: ISBN und Foto des Inhaltsverzeichnisses vom **Deutschbuch** (Schulbuch-Abgleich DeDax),
  Rückmeldungen aus dem Test mit dem Kind (MaDax am 13.11.2026 geplant; DeDax hat außer „Zeitformen“ noch niemand
  durchgespielt, die Knobel-Aufgaben und ihre Texte hat noch kein Mensch gegengelesen).
- **EnDax, Stand 12.11.2026 spät:** Lehrplan Englisch Klassenstufen 5/6 am Originaltext ausgewertet
  (`faecher/englisch/lehrplan/sachsen-gymnasium.md`). Wichtig: Klasse 5 und 6 sind dort **gemeinsam** beschrieben, die
  Aufteilung auf Klasse 5 macht das Schulbuch. Als Nächstes: offene Fragen einzeln klären (zuerst das Schulbuch), dann Themenplan.
  **Entscheidungen des Auftraggebers:** Schulbuch noch unbekannt (wird nachgereicht); Start mit **Grammatik vom
  Schuljahresanfang**; App-Sprache **Deutsch**; Vorlesen **erst ausprobieren** (Probeseite als Claude-Artifact
  „EnDax – Probe: Vorlesen“, wartet auf Anhören am iPhone). **Themenplan als Vorschlag:** `faecher/englisch/themenplan.md`
  (29 Grammatik-Themen in 4 Bereichen, dazu Wörter, Alltag/Lesen), wartet auf Zustimmung. Danach: Apostroph in `fach.js`,
  dann Thema 1 „to be: am, is, are“ ganz fertig bauen. Hochgeladen am 13.11.2026.
  **Vorlesen:** Die Stimme des Geräts (Sprachausgabe des Browsers) hat der Auftraggeber **abgelehnt**. Jetzt wird geprüft,
  ob fertige Aufnahmen taugen: Kokoro (freie Sprachausgabe, Apache-2.0, läuft ohne Konto), britische Stimmen, rund 6–18 KB
  je Wort oder Satz als MP3. Hörprobe mit vier Stimmen als Claude-Artifact „EnDax – Hörprobe: aufgenommene Stimmen“,
  wartet auf sein Urteil. Aufnahmen gehen nur für **feste** Wörter und Sätze, nicht für zufällig zusammengesetzte.
  Am Code wurde nichts geändert (Version bleibt `lerndax-v54`).
- **EnDax v55 (12.11.2026 nachts): erstes Thema „to be: am, is, are“ gebaut** (`web/englisch/`, erreichbar unter `…/lerndax/englisch/`,
  steht noch **nicht** auf der Startseite: `faecher.js` bleibt „geplant“). 8 Aufgabenarten, 34 feste Sätze, Animation
  „drei Fächer: am, is, are“ (frei, ähnliches Beispiel, Lösung zur Aufgabe), Symbol, Test `tests/endax.py`.
  **Ton entschieden:** Stimme **„Frau B“** = Kokoro `af_bella` (amerikanisch; die britischen Stimmen gefielen nicht).
  Aufnahmen als MP3 in `web/englisch/audio/k5/` (56 Dateien, 496 KB), erzeugt mit `tests/endax_audio.py`.
  Neu in der gemeinsamen App (`fach.js`, `fach.css`): Lautsprecher-Knopf (`data-say`, Einstellung `audio` im Fach) und
  Apostroph „’“ = „'“ beim Prüfen. Geschrieben wird britisch, gesprochen amerikanisch (dem Auftraggeber gesagt).
  Aufnahmen stehen **nicht** in der Offline-Liste von `sw.js`; sie werden beim ersten Anhören gespeichert.
  (Am 12.11. noch nicht auf GitHub, hochgeladen am 13.11. zusammen mit v56.)
  Zum Ausprobieren gibt es eine Vorschau als Claude-Artifact „EnDax – Vorschau: to be“ (ohne Konto und Synchronisation).
  Wartet auf: Urteil des Auftraggebers zum Thema und zum Themenplan, Englischbuch, Hochladen auf GitHub.
- **EnDax v56 (13.11.2026 früh): Umschalter „Aussprache“ amerikanisch / britisch** (Wunsch des Auftraggebers).
  Auf der Startseite von EnDax, gilt je Gerät (`localStorage`, Schlüssel `lerndax.englisch.akzent`), Voreinstellung amerikanisch.
  Amerikanisch = `af_bella` („Frau B“), britisch = `bm_fable` („Mann 2“, vom Auftraggeber so gewählt, er fand ihn „einigermaßen“).
  Britische Aufnahmen in `web/englisch/audio/k5-gb/` (56 Dateien, 725 KB). `F.audio` kann jetzt eine Liste sein.
  **Seit 13.11.2026 auf GitHub und live (v55 und v56 zusammen hochgeladen)**, mit ausdrücklichem Ja des Auftraggebers.
  Das Vorschau-Artifact „EnDax – Vorschau: to be“ wird damit nicht mehr gebraucht.
- **EnDax v57 (13.11.2026): zwei weitere Themen**, auf GitHub und live. `e5-pron` „I, you, he, she, it, we, they“
  (6 Aufgabenarten, 22 Sätze, Animation „sieben Kärtchen“) und `e5-be-neg` „to be: verneinen und fragen“ (6 Aufgabenarten:
  verneinen, Frage bilden, Kurzantwort; Animation mit wandernden Wörtern). Jetzt 141 Aufnahmen je Aussprache.
  Bewusst weggelassen: Fragen mit „I“ und Kurzantworten mit you/we (dort wechselt die Person: Are you …? Yes, I am.).
  Das wäre ein eigener Baustein, noch nicht gebaut. Als Nächstes laut Themenplan: have got, a/an, Mehrzahl.
- **EnDax v58 (13.11.2026): Themen 4 und 5**, auf GitHub und live. `e5-have` „have got und has got“ (8 Aufgabenarten:
  Form, Satz, Kurzform, verneinen, Frage, Kurzantwort; Animation „zwei Fächer“) und `e5-a-an` „a oder an“ (5 Aufgabenarten,
  31 Wörter, mit den Sonderfällen an hour und a uniform; Animation „das n ist eine Brücke“). Jetzt 251 Aufnahmen je Aussprache.
  (Die MP3 von v58 lagen zunächst nur auf GitHub; mit v59 erledigt, siehe nächster Punkt.)
- **EnDax v59 (13.11.2026): Aufnahmen in Sammeldateien, Thema 6 „Mehrzahl“**, auf GitHub und live.
  **Sammeldateien** (Entscheidung des Auftraggebers): statt hunderter MP3 je Aussprache ein Ordner `web/englisch/audio/us/`
  bzw. `gb/` mit `index.json` und je Thema einer Datei `<thema>.bin` (alle MP3 hintereinander). `fach.js` lädt das Paket
  eines Themas vor, sobald Lautsprecher-Knöpfe zu sehen sind, und spielt die Aufnahme als `data:`-Adresse. Ist das Paket
  beim Antippen noch nicht da, startet zuerst ein stiller Ton (damit das iPhone den Ton erlaubt), dann die Aufnahme.
  Die alten Ordner `audio/k5/` und `audio/k5-gb/` sind im Repository gelöscht. **Im OneDrive-Ordner liegen sie noch**
  (Löschen geht aus der Sitzung nicht): Der Auftraggeber kann beide Ordner löschen, sie werden nicht mehr gebraucht.
  Damit sind OneDrive und GitHub wieder gleich (bis auf diese beiden alten Ordner).
  Zunächst nur im Test-Browser geprüft; **am 13.11.2026 hat der Auftraggeber bestätigt: Der Ton funktioniert am iPhone.**
  `e5-plural` „Mehrzahl: one box, two boxes“: 41 Wörter, 5 Aufgabenarten (Mehrzahl tippen und wählen, Einzahl, Regel
  erkennen, passendes Wort finden), Animation „auf das Wortende kommt es an“. Jetzt 292 Aufnahmen je Aussprache.
  Als Nächstes laut Themenplan: there is/are, this/that, my/your, ’s, Imperativ, can/must.
- **EnDax v60 (13.11.2026): Themen 7 und 8**, auf GitHub und live. `e5-there` „there is und there are“ (8 Aufgabenarten:
  Form, Satz, Kurzform There’s, verneinen, Frage, Kurzantwort; Animation mit Punkten „eins oder mehrere“) und `e5-this`
  „this, that, these, those“ (5 Aufgabenarten, 40 Sätze mit here / over there; Animation „zwei Fragen, vier Felder“).
  Jetzt 8 Themen und 383 Aufnahmen je Aussprache in 8 Paketen. Bewusst weggelassen: verneinte Mehrzahl und Fragen mit
  „any“ (There aren’t any …), das gehört zu some/any (Thema 22). Als Nächstes laut Themenplan: my/your/his/her,
  ’s und of, Imperativ, can/must.
- **EnDax v61 (13.11.2026): Themen 9 und 10**, auf GitHub und live. `e5-poss` „my, your, his, her …“ (5 Aufgabenarten:
  einsetzen, Paare I–my, his oder her nach dem Besitzer, Its oder It’s; Animation „sieben Kärtchen mit Pfeil“) und
  `e5-gen` „Wem gehört es? ’s und of“ (6 Aufgabenarten: mit ’s schreiben, Schreibweise wählen, ein Besitzer oder
  mehrere (girl’s / girls’), of bei Sachen). Jetzt 10 Themen und 432 Aufnahmen je Aussprache in 10 Paketen.
  Vom ersten Bereich fehlen noch: Aufforderungen (Imperativ) und can/must.
- **EnDax v62 (13.11.2026): Themen 11 und 12, Bereich 1 „Erste Bausteine“ ist damit vollständig**, auf GitHub und live.
  `e5-imp` „Aufforderungen: Open … / Don’t …“ (6 Aufgabenarten: Don’t einsetzen, richtige Form, Verb tippen, verstehen,
  Be quiet / Don’t be late; Animation „you fällt weg, Don’t kommt davor“) und `e5-can` „can und must“ (7 Aufgabenarten:
  kein -s, Grundform dahinter, can’t, Frage, Kurzantwort, can/must/mustn’t nach der Bedeutung, mustn’t = nicht dürfen;
  Animation „drei Schilder“). Jetzt 12 Themen und 511 Aufnahmen je Aussprache in 12 Paketen.
  Der Test `tests/endax.py` dauert mit 8 Runden jetzt gut 10 Minuten: mit 3 bis 4 Runden laufen lassen oder im Hintergrund.
  Als Nächstes: Bereich 2 (present simple und progressive), dafür die neue Aufgabenform „Wörter in Reihenfolge bringen“
  in `fach.js`. Vorher fragen, ob EnDax jetzt auf die Startseite soll (`faecher.js`: Status „fertig“).
- **EnDax v63 (13.11.2026): auf der Startseite, neue Aufgabenform, Bereich 2 begonnen**, auf GitHub und live.
  **Startseite:** EnDax ist dritte Kachel (Entscheidung des Auftraggebers; `faecher.js`: Status „fertig“, `themen: 15`).
  **Die Zahl `themen` in `faecher.js` bei jedem neuen Thema mitzählen** (Startseite und Elternübersicht rechnen damit).
  **Neue Aufgabenform „Wörter in Reihenfolge bringen“** in `fach.js` (für alle Fächer): `order: { words, answer, end }`,
  in EnDax über `U.ordne([Teile in richtiger Reihenfolge], Satzzeichen)`. Antippen legt ein Wort in die Satzzeile,
  nochmal antippen holt es zurück.
  **Bereich 2 „Sätze in der Gegenwart“:** `e5-ps` (he, she, it – das s muss mit; 20 Sätze, 14 Verben mit -s, -es, -ies, has),
  `e5-ps-neg` (don’t / doesn’t, das Verb verliert sein s), `e5-ps-frage` (Do / Does, Kurzantwort). Eine gemeinsame
  Animation „das s gibt es nur einmal“ (likes → doesn’t like → Does … like?). Jetzt 15 Themen, 577 Aufnahmen je Aussprache.
  Auftrag des Auftraggebers: **ohne Rückfragen weiterbauen** („einfach bauen“). Als Nächstes laut Themenplan:
  Fragewörter, Satzbau, Häufigkeitsadverbien, present progressive, simple oder progressive, Objektpronomen.
- **EnDax v64 (13.11.2026): Themen 16 bis 18**, auf GitHub und live. `e5-fragewort` „Fragewörter: who, what, where …“
  (14 Frage-Antwort-Paare; Fragewort wählen und tippen, Bedeutung, passende Antwort, Frage ordnen; Animation „sechs Karten“),
  `e5-satzbau` „wer – tut – was – wo – wann“ (10 Sätze mit fünf Teilen; ordnen, deutsche Wortstellung als Falle, Ort vor
  Zeit, Satzteile antippen; Animation „fünf Plätze“) und `e5-oft` „Wie oft? always, often, never“ (13 Sätze; Stelle
  antippen, ordnen, vor dem Verb / hinter am, is, are; Animation „Leiter von nie bis immer“).
  Beim Ordnen gelten mehrere Lösungen, wo das Englische sie erlaubt (Zeit am Satzanfang; sometimes, usually, often
  auch vorn oder hinten). Jetzt 18 Themen (`faecher.js`: `themen: 18`), 614 Aufnahmen je Aussprache in 18 Paketen.
  Vom zweiten Bereich fehlen noch: present progressive, simple oder progressive, Objektpronomen (me, him, her …).
- **EnDax v65 (13.11.2026): Themen 19 bis 21, Bereich 2 „Gegenwart“ ist vollständig**, auf GitHub und live. `e5-pp` „present progressive: is playing“
  (am/is/are wählen, -ing-Form tippen und auswählen, beide Teile tippen, Satz ordnen, verneinen, Frage ordnen; Erklärung mit Zeitstrahl „jetzt“ und
  drei Regeln für -ing), `e5-sp` „simple oder progressive?“ (Form wählen und tippen, Signalwort wählen, Signalwörter sortieren, Bedeutung;
  Erklärung mit zwei Kästen „immer wieder“ und „gerade jetzt“), `e5-obj` „me, him, her, us, them“ (ersetzen per Auswahl und Tippen, Paare,
  vorn oder hinten, Deutsch → Englisch; Erklärung mit Tafel „vorn/hinten“). 21 Themen, 699 Aufnahmen je Aussprache in 21 Paketen.
  Als Nächstes: Bereich 3 ab Thema 22 (some/any).
- **EnDax v66 (13.11.2026): Themen 22 und 23, Bereich 3 „Mengen, Ort und Zeit“ begonnen**, auf GitHub und live. `e5-some` „some und any“
  (Auswahl, tippen, richtiger Satz, Aussage umbauen in Verneinung oder Frage, Bedeutung; Erklärung mit drei Fächern Aussage/Verneinung/Frage),
  `e5-much` „much, many, a lot of“ (How much/How many, tippen, zählbar oder nicht, verneinte Sätze, a lot of; Erklärung mit zwei Kästen
  zählbar/nicht zählbar). 23 Themen, 756 Aufnahmen je Aussprache in 23 Paketen. Bewusst weggelassen: some in Angeboten und Bitten
  („Would you like some …?“). Als Nächstes: Thema 24 (Präpositionen des Ortes, mit Bild).
- **EnDax v67 (13.11.2026): Themen 24 und 25**, auf GitHub und live. `e5-ort` „Wo? in, on, under, next to …“: erstes EnDax-Thema
  **mit Bild** (Feld `figure` der Aufgabe; Katze oder Hund bei Kiste, Tisch oder zwei Kisten, 9 Szenen in `ORT_SZENE`, gezeichnet als SVG
  im Code). Aufgaben: Bild ansehen und Wort wählen oder tippen, passenden Satz wählen, Deutsch → Englisch. Erklärung: Das Tier springt
  von Platz zu Platz. Wörter, die bei einem Bild auch passen könnten, kommen nicht als falsche Antwort vor (`ORT_NICHT`).
  `e5-zeit` „Wann? at, on, in“ (Lücke wählen und tippen, „___ Monday“, Satz auf Englisch wählen; Erklärung als Trichter
  in – on – at). 25 Themen, 792 Aufnahmen je Aussprache. Als Nächstes: Thema 26 (Zahlen, Ordnungszahlen, Datum, Uhrzeit).
- **EnDax v68 (13.11.2026): Thema 26, Bereich 3 „Mengen, Ort und Zeit“ ist vollständig**, auf GitHub und live. `e5-zahl` „Zahlen,
  Datum und Uhrzeit“: Zahlwort tippen und wählen (0–100), **Hör-Aufgabe** -teen oder -ty (Lautsprecher in der Frage, Antwort als Ziffer),
  Ordnungszahlen tippen und wählen, Datum sagen („the third of May“), Monate tippen, **Uhr lesen mit Bild** (Zeiger, o’clock, quarter
  past, half past, quarter to) und Digitalzeit. Erklärung je nach Aufgabe: Zahl zerlegen, teen/ty, Ordnungszahlen, Kalenderblatt, Uhr mit
  den Hälften past/to. 26 Themen, 1002 Aufnahmen je Aussprache. Als Nächstes: Bereich 4 (Vergangenheit) nur, wenn das Buch es in
  Klasse 5 hat – das ist offen, solange das Englischbuch fehlt. Sonst Bereich 5 Wörter: vorher die Vokabel-Frage an Roberto.
- **EnDax v69 (13.11.2026): Bereich 4 „Was war gestern?“ (Themen 27 bis 29)**, auf GitHub und live. **Roberto (13.11.): Vergangenheit
  bauen, auch ohne das Buch zu kennen; Wörter zuerst mit festen Listen, selbst eintragen vielleicht später.**
  `e5-was` „was und were“ (wählen, tippen, Gegenwart → Vergangenheit, verneinen, Frage ordnen), `e5-ed` „past simple: played, danced,
  stopped“ (Form tippen und wählen mit vier Schreib-Regeln, im Satz, „every day“ → „yesterday“, didn’t + Grundform), `e5-irr` „past simple:
  went, saw, had“ (22 unregelmäßige Verben: Form tippen, wählen, rückwärts, im Satz, didn’t + Grundform). Für „read – read“ gibt es keine
  Aufnahme, weil beide Formen gleich geschrieben, aber verschieden gesprochen werden. 29 Themen, 1144 Aufnahmen je Aussprache.
  Als Nächstes: Bereich 5 Wörter (Wortfelder mit festen Listen).
- **EnDax v70 (13.11.2026): Bereich 5 „Wörter“ mit 11 Wortfeldern (Themen 30 bis 40)**, auf GitHub und live. Feste Listen
  (Roberto 13.11.): Familie, Haus und Wohnung, Schule, Tagesablauf, Kleidung, Freizeit, Tiere, Körper, Essen und Trinken, Farben,
  Tage und Jahreszeiten – zusammen gut 200 Wörter und 77 Sätze, alle in `wfFeld(...)` in `themen/klasse5.js`. Ein gemeinsamer
  Aufgaben-Baukasten `WFT` für alle Felder: Deutsch → Englisch wählen, Englisch → Deutsch, eintippen (mit erlaubten Schreibweisen
  `alt`, z. B. grey/gray, trainers/sneakers), Hören, **Bild** (Emoji; bei Farben ein Farbfleck), Wort im Satz (je Satz drei feste
  falsche Wörter, die sicher nicht passen), „Was passt nicht dazu?“ (ohne zu nahe Themenpaare, `WF_NAH`; Wörter mit `kein` wie
  fish, chicken, cook nie als Außenseiter). Eine gemeinsame Erklärung für alle Felder: Wortkarten drehen sich von Deutsch auf Englisch.
  40 Themen, 1425 Aufnahmen je Aussprache. Als Nächstes: Bereich 6 Alltag und Lesen, dann „Entdecken“ für Englisch.
- **EnDax v71 (13.11.2026): Bereich 6 „Im Alltag“ (Themen 41 bis 45)**, auf GitHub und live. `e5-a-hallo` (begrüßen, sich vorstellen),
  `e5-a-klasse` (Sätze im Unterricht und Anweisungen der Lehrerin), `e5-a-laden` (einkaufen, Preise mit Preisschild und Hören),
  `e5-a-weg` (nach dem Weg fragen, Karte mit Weg zum Stern), `e5-a-lesen` (5 kurze selbst geschriebene Texte mit Fragen und
  „Stimmt das?“, jeder Text auch zum Anhören). Gemeinsamer Baukasten `ALT` (passende Antwort, Hören, Situation → Satz, Lücke), Daten
  in `alFeld(...)`; Erklärung mit Sprechblasen, Preisschild, Karte; beim Lesen zeigt sie den Satz im Text, in dem die Antwort steht.
  `web/plattform/fach.css`: Farben `bg6` bis `bg8` für Lernbereich 6 bis 8 ergänzt (vorher war das Themen-Schild im 6. Bereich weiß und leer);
  ui2 und eltern danach ohne Fehler.
  45 Themen, 1525 Aufnahmen je Aussprache. **Damit ist der Themenplan Klasse 5 (Bereiche 1 bis 6) gebaut.** Offen: Alphabet und
  Buchstabieren, Lautschrift (die Stimme spricht einzelne Buchstaben nicht sicher richtig), „Entdecken“ und Knobeln für Englisch.
- **EnDax v72 (13.11.2026): „Entdecken“ für Englisch** (6 Entdeckungen in `web/englisch/erklaerungen/entdecken.js`, dunkle Bühne wie
  in MaDax/DeDax, Wörter mit Aufnahme aus `D.daten.ENT` in `themen/klasse5.js`): falsche Freunde (gift, become, chef …), „an hour,
  aber a house?“ (es zählt der Laut), British oder American English (biscuit/cookie …), stumme Buchstaben (knight – Knecht),
  Pfund und Pence (£ von libra, 100 Pence, bis 1971 waren es 240), Schule in England (mit 10–11 wäre man in Year 6).
  `index.html` (Reihenfolge, Texte), `faecher.js` (Entdecken-Karte auf der Startseite), `sw.js`. 1561 Aufnahmen je Aussprache.
- **EnDax v73 (13.11.2026): Knobel-Aufgaben für Englisch** (`web/englisch/themen/klasse5-knobel.js`, Aufbau wie DeDax: `K(id, …Varianten)`,
  frei ab zwei Sternen, zählen nicht für die Sterne). 40 Themen mit je 2 Varianten: Fehler finden (ein falsches Wort antippen),
  zwei Regeln in einem Satz (z. B. „Tom usually walks …, but today he is taking …“), Ausnahmen (some in Angeboten, an hour,
  homework = much, lying, stayed), längere Sätze ordnen, kleine Rätsel (Datum morgen, Uhrzeit plus 30 Minuten, wer sitzt wo).
  Wortfelder: Buchstabensalat und Lückensatz ohne Auswahl. **Bewusst ohne Knobeln:** die 5 Alltag-Themen (`e5-a-…`).
  Neuer Test `tests/endax_knobel.py` (spielt jede Variante: 400 Aufgaben, keine Fehler). `index.html` und `sw.js` laden die Datei.
- **EnDax v74 (13.11.2026): Thema 46 „Alphabet und Buchstabieren“** (`e5-a-abc` im Bereich „Im Alltag“). **Roberto hat die Hörprobe
  A–Z beider Stimmen am 13.11. freigegeben („passt“).** Aufgaben: Buchstaben hören (mit leicht verwechselbaren Buchstaben als
  Auswahl), buchstabiertes Wort hören und eintippen (20 Wörter und Namen), „Welcher Buchstabe klingt wie eye, you, see …?“,
  Buchstabe davor oder danach. Erklärung: Tafel mit allen 26 Buchstaben, die tückischen sind blau. 46 Themen, 1607 Aufnahmen
  je Aussprache (jeder Buchstabe einzeln). Lautschrift ist weiter offen.
- **EnDax v75 (13.11.2026): Knobel-Aufgaben auch für die 6 Alltag-Themen** – jetzt haben alle 46 Themen Knobeln. Hallo (Fehler
  finden, passende Antwort im Gespräch), Unterricht (Fehler, Anweisung der Lehrerin auf Englisch), Einkaufen (Preise addieren,
  Wechselgeld, Fehler), Weg (Karte mit ähnlichen Sätzen zur Auswahl, Fehler), Alphabet (Abkürzungen wie „C U“, „R U OK?“, „B4“;
  rückwärts buchstabierte Wörter), Lesen (zwei Stellen im Text kombinieren). `tests/endax_knobel.py` verlangt jetzt Knobeln für alle Themen.
- **v76 (13.11.2026): Schulbücher bekannt** (ISBN von der Rückseite, nur Doku geändert, die App nicht):
  Mathe **Lambacher Schweizer 5, Ausgabe Sachsen** (Klett, 978-3-12-733150-9) – **bestätigt**, der MaDax-Abgleich stimmt also.
  Englisch **Green Line 1, Ausgabe ab 2021** (Klett, 978-3-12-864011-2, flexibler Einband): Hello! (Übergang), Unit 1 A new school,
  Unit 2 At home, Unit 3 Our Greenwich, Unit 4 Happy Birthday. Deutsch **Deutschbuch Gymnasium 5** (Cornelsen, 978-3-06-061189-8) –
  **nicht** die vermutete Länderausgabe 978-3-06-200082-9; welche Ausgabe genau, klärt das Inhaltsverzeichnis.
  Außerdem (für spätere Fächer): Geografie TERRA 5 Sachsen Gymnasium (Klett, 978-3-12-104320-0), Geschichte ANNO 1 Sachsen
  (Westermann, 978-3-14-115406-1), Biologie LINDER Biologie SI 5 Sachsen (Westermann, 978-3-14-153000-1).
  **Als Nächstes:** Fotos der Inhaltsverzeichnisse von Green Line 1 und Deutschbuch, dann EnDax mit den Units und DeDax mit den
  Kapiteln abgleichen (Reihenfolge, Grammatik je Unit, Begriffe).
- **EnDax v77 (13.11.2026): nach dem Schulbuch geordnet.** Roberto hat das Inhaltsverzeichnis von Green Line 1 fotografiert.
  Abgleich in `faecher/englisch/lehrplan/schulbuch-abgleich.md`. Die sechs Bereiche heißen jetzt wie im Buch: **Hello!, Unit 1 bis
  Unit 4** und **„Extra: nicht in Green Line 1“** (have got, this/that, Tiere, Körper, Lesen und die Vergangenheit, die erst in
  Klasse 6 kommt). Themen-IDs unverändert, also kein Lernstand verloren. **Neu (50 Themen):** Wortfelder Gefühle (Unit 1), Beschreiben
  (Adjektive, Unit 3), Party und Geburtstag (Unit 4), Monate im Wortfeld Zeit, Thema `e5-wenig` „a few, a little, a bottle of“
  (Unit 4), Kurzantworten im present progressive (Yes, she is). 1714 Aufnahmen je Aussprache.
  **Deutschbuch** ebenfalls fotografiert: Abgleich in `faecher/deutsch/lehrplan/schulbuch-abgleich.md` (Lücken: Präpositionen,
  Adverbien, adverbiale Bestimmungen, Satzreihe, silbentrennendes h, Apposition …). **Offene Frage an Roberto: „Nomen“ (wie
  im Buch) oder „Substantiv“ (bisher in DeDax)?** Außerdem: britische Stimme als Voreinstellung, weil das Buch britisch ist?
- **v78 (13.11.2026): Roberto hat entschieden: „Nomen, britisch“.** DeDax sagt jetzt überall **„Nomen“** wie das Deutschbuch
  (vorher „Substantiv“; die Themen-ID `d5-substantive` bleibt). EnDax spricht als **Voreinstellung britisch** (wer schon
  amerikanisch gewählt hat, behält es). Als Nächstes: die DeDax-Lücken aus `faecher/deutsch/lehrplan/schulbuch-abgleich.md` bauen.
- **v79 (13.11.2026): DeDax-Lücken aus dem Deutschbuch geschlossen.** Neu (34 Themen): `d5-praep` Präpositionen (erkennen, Fall,
  Wo?/Wohin?, passende Präposition), `d5-adverb` Adverbien, `d5-adverbial` adverbiale Bestimmungen (Zeit, Ort, Art und Weise,
  Grund), `d5-satzreihe` Satzreihe und weil/da/denn. Ergänzt: Komma bei Apposition (`d5-komma`), Anrede im Brief (`d5-gross`),
  silbentrennendes h und offene/geschlossene Silbe (`d5-silben`). Alle mit Erklärung und Knobeln. Noch offen aus dem Buch:
  Metrum/Metapher, Theaterszene, Kamera (siehe `faecher/deutsch/lehrplan/schulbuch-abgleich.md`).
- **v80 (13.11.2026): DeDax 36 Themen.** Neu `d5-theater` (Dialog, Monolog, Regieanweisung, Mimik/Gestik/Stimme) und
  `d5-kamera` (Einstellungsgrößen mit Bildausschnitten einer gezeichneten Szene, Perspektiven mit Kamera-Skizze). Ergänzt: Versmaß
  (Jambus, Trochäus) in `d5-gedicht`, Metapher in `d5-bilder`. Bereich 5 heißt jetzt „Texte und Medien verstehen“. Neuer
  Erklär-Bildmodus `bild` (zeigt das SVG der Aufgabe). Damit ist alles aus dem Inhaltsverzeichnis des Deutschbuchs abgedeckt,
  was sich am Bildschirm üben lässt (Schreibaufgaben wie Brief oder Erzählung nicht).
- **v81 (13.11.2026):** EnDax 52 Themen: `e5-w-medien` Wortfeld Computer und Medien (Unit 1, Media smart) und `e5-a-meinung`
  Meinung sagen (Unit 3, Station 3: I think … because …, I agree / I don’t agree). DeDax 37 Themen: `d5-konj` Konjunktionen
  (antippen, passende Konjunktion nach Verbstellung und Sinn, Wortart unterscheiden, Hauptsatz oder Nebensatz). Beide Bücher sind
  damit vollständig abgeglichen, soweit am Bildschirm übbar.
- **v82 (13.11.2026): EnDax Lautschrift** (`e5-laut`, Bereich Hello!, 53 Themen). 57 Wörter in britischer Wörterbuch-Lautschrift
  (wie im Vocabulary von Green Line). Aufgaben: Wort zur Lautschrift, Lautschrift zum Wort (falsche Angebote tauschen genau einen
  Laut, z. B. ɪ/iː, θ/s), Wort eintippen, Zeichen zum Laut (θ, ð, ʃ, æ, ʌ, ə …), Betonung (ˈ). Ohne einzelne Laute als Ton;
  in der Lösung wird das ganze Wort gesprochen. Damit ist die Liste aus dem Themenplan vollständig.
- **v83 (13.11.2026): Englisch im Unterricht gerade dran: Green Line 1, Unit 1, Station 2** (S. 22–23, „There are TTS tablets for
  you here“: there is/there are mit Fragen und Kurzantworten, Präpositionen on/in/next to/behind/in front of/under, Wörter aus
  Bücherei und Klassenzimmer). Foto von Roberto, 13.11. Passende EnDax-Themen: `e5-there`, `e5-ort`, `e5-w-schule`. Ergänzt:
  6 Sätze zu Klassenzimmer und Bücherei in `e5-there`; Wortfeld Schule + desk, clock, noticeboard, map, library, magazine,
  newspaper; Medien + headphones.
- **v84 (13.11.2026): Durchsicht EnDax gegen das Buch, drei Lücken geschlossen.** (1) Kurzantworten mit Personenwechsel in
  `e5-be-neg` (`kurzIch`: Are you …? – Yes, I am. / we / Am I …? – you). (2) Uhrzeit mit Minuten in `e5-zahl` (`UHRM`: five/ten/
  twenty/twenty-five past und to; Uhr-Bild, digital, Hören). (3) Entdeckung `en-greenwich` (Nullmeridian, Zeitzonen, Aussprache).
  Der Mehrzahl-Genitiv (girls’) war schon da (`gWieViele`, `gApostroph`). **Offen und nur mit Buchseiten zu klären:** Benutzt
  Green Line „have got“ oder „have“? Vokabeln je Unit (eigene Listen treffen sie nur ungefähr).
- **v85 (13.11.2026): „have got“ geklärt** (Fotos S. 42–46): Green Line 1 lehrt **have got** in Unit 2, Station 2 („The verb have
  got“, G8: I’ve got two brothers. / I haven’t got …). `e5-have` steht deshalb jetzt in Unit 2 (nach Familie), nicht mehr in Extra.
  Die Sätze mit have got bleiben. Familie + „only child“. Bestätigt durch S. 46: Uhrzeit mit Minuten (twenty past eight),
  Häufigkeitswörter (always, usually, often, never), Gefühle. „at weekends“ bleibt weggelassen (amerikanisch „on weekends“ wäre auch richtig).
- **Übergabe 13.11.2026, 20:46 (v86, nur Doku): Als Nächstes GeDax (Geschichte, Klasse 5) in einem neuen Chat.** Startpunkt:
  **`faecher/geschichte/README.md`**. Buch: ANNO 1, Ausgabe 2019 Sachsen (Westermann, 978-3-14-115406-1); Inhaltsverzeichnis fehlt
  noch. Englisch ist laut Durchsicht vollständig (53 Themen); offen dort nur „Vokabeln selbst eintragen“ (zurückgestellt) und
  Rückmeldungen. Deutsch 37 Themen, Mathe 36.
- Der Rest dieses Abschnitts ist der Verlauf der bisherigen Übergaben (MaDax, dann DeDax) und bleibt zum Nachlesen stehen.


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
4. ~~Prüfen, ob das Schulbuch die ISBN 978-3-12-733150-9 hat~~ **erledigt 13.11.2026: ja** (Foto der Rückseite).
5. Oberflächeninhalt zusammengesetzter Körper (bisher nur Volumen).
6. Danach „MaDax Klasse 5 abnehmen“.
Die Trainingsseite für die Arbeit am 24.11.2026 ist unverändert (8 Themen aus der Themenliste der Schule).

**Nächster Schritt: DeDax**
Startpunkt und Vorgehen stehen in **`faecher/deutsch/README.md`**. Kurz: erst Lehrplan Deutsch Klasse 5 auswerten und
mit dem Schulbuch abgleichen, dem Auftraggeber einen Themenplan mit Optionen vorlegen, dann bauen. Vor dem Bauen
klären, wie die gemeinsamen Teile aus `web/mathe/index.html` (Übungsrunde, Sterne, Knobeln, Player, Elternbereich)
für ein zweites Fach wiederverwendet werden, statt sie zu kopieren.

**Stand DeDax (12.11.2026, zweiter Chat, Version `lerndax-v44`)**
- Lehrplan Deutsch Klasse 5 am Originaltext ausgewertet: `faecher/deutsch/lehrplan/sachsen-gymnasium.md`.
- Schulbuch-Abgleich **noch nicht möglich**: Ausgabe unklar (wahrscheinlich Deutschbuch Gymnasium, östliche
  Bundesländer, Ausgabe 2019, ISBN 978-3-06-200082-9), kein Stoffverteilungsplan im Netz. Es fehlen die ISBN und ein
  Foto des Inhaltsverzeichnisses (`faecher/deutsch/lehrplan/schulbuch-abgleich.md`).
- Themenplan als **Vorschlag** (5 Bereiche, 31 Themen): `faecher/deutsch/themenplan.md`.
- **Entscheidungen des Auftraggebers:** (1) Start mit dem Bereich **Wortarten**. (2) Die gemeinsamen Teile **jetzt**
  aus der Mathe-Seite herausziehen (nicht kopieren, nicht erst nach der Arbeit am 24.11.).
- **Umbau erledigt:** Die App steckt jetzt in `web/plattform/fach.js` und `fach.css`. `web/mathe/index.html` und
  `web/deutsch/index.html` beschreiben nur noch ihr Fach (`window.LERNDAX_FACH`). Inhaltlich wurde an MaDax nichts
  geändert; alle Mathe-Tests sind danach gelaufen (Ergebnis im Verlauf).
- **Erstes Thema gebaut: „Zeitformen“** (`web/deutsch/`), mit Aufgaben, Tipp, Lösungsweg, Symbol und der Animation
  „Zeitformen am Zeitstrahl“ (frei, ähnliches Beispiel, Lösung zur Aufgabe). Erreichbar unter `…/lerndax/deutsch/`.
  Auf der Startseite steht DeDax weiter unter „Kommt bald“ (`faecher.js` unverändert), bis mehr Themen da sind.
- ~~Entschieden: „Substantiv“~~ **Seit v78 (13.11.2026) „Nomen“**, wie im Deutschbuch (Entscheidung des Auftraggebers).
- **Gebaut (v46): „Substantive: Geschlecht und Mehrzahl“ und „Die vier Fälle“**, je mit Aufgaben, Tipp, Lösungsweg,
  Symbol und Animation. Wortliste: 60 Substantive mit Artikel, Genitiv und Mehrzahl in `web/deutsch/themen/klasse5.js`.
- **Gebaut (v47): Bereich Wortarten ist vollständig** (7 Themen): dazu kamen „Pronomen“, „Adjektive steigern“,
  „Verbformen: Person, Partizip, Aufforderung“ und „Wortarten erkennen“. Wortlisten: 34 Adjektive mit Steigerung,
  27 Aufforderungsformen, 16 Sätze mit Wortart je Wort, 12 Sätze mit markierten Pronomen.
- **Gebaut (v54): Knobel-Aufgaben für Deutsch**, alle 30 Themen, 86 Aufgabenarten (`web/deutsch/themen/klasse5-knobel.js`).
  Gleiche Regeln wie in MaDax: ab zwei Sternen im Thema, 5 Aufgaben je Runde, zählen nicht für die Sterne, keine Animation.
  Neuer Test `tests/dedax_knobel.py`. Noch von niemandem durchgespielt; die Texte hat nur das Programm und ich geprüft.
- **Gebaut (v53): Elternübersicht auf der Startseite** (`web/index.html`, Adresse `…/lerndax/#eltern`, Link „Für Eltern“
  ganz unten). Je fertigem Fach eine Karte: Aufgaben, Übungstage, geübte Themen, Trefferquote, Sterne, zuletzt geübt.
  Knopf „Alle Themen in MaDax/DeDax ansehen“ führt in die ausführliche Elternansicht des Fachs (`mathe/#eltern`,
  `deutsch/#eltern`, unverändert in `fach.js`). „Geräte & Konto“ bleibt in der Fach-App (ein Konto für alle Fächer),
  die Startseite verlinkt dorthin. Neuer Test `tests/eltern.py`.
- **Gebaut (v52): „Entdecken“ für Deutsch** mit sechs Entdeckungen (`web/deutsch/erklaerungen/entdecken.js`). Auf der
  Startseite gibt es jetzt je Fach eine „Entdecken“-Karte (`entdecken` in `faecher.js`).
- **Gebaut (v51): Bereich 4 „Wörter bauen und Wortschatz“ (4 Themen) und Bereich 5 „Texte verstehen“ (5 Themen).**
  **Damit ist der Themenplan Klasse 5 vollständig gebaut: 30 Themen in 5 Bereichen.**
- **Gebaut (v50): Bereich 3 „Rechtschreibung“ ist vollständig** (6 Themen).
- **Gebaut (v49): Bereich 2 „Satzbau und Satzzeichen“ ist vollständig** (8 Themen).
- **DeDax steht seit v48 auf der Startseite** (Entscheidung des Auftraggebers; `faecher.js`: Status „fertig“, jetzt 30 Themen).
  Die Zahl `themen` dort bei jedem neuen Thema mitzählen.
- **Als Nächstes:** „Gemischt“-Prüfung über alle Bereiche ansehen, Schulbuch-Abgleich (ISBN und Inhaltsverzeichnis fehlen), Rückmeldung des Auftraggebers und Test mit Bruno.

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
- **Elternansicht** (Startseite → „Für Eltern“ zeigt seit v53 alle Fächer im Überblick; im Fach ganz unten die Einzelheiten): Fortschritt je Thema,
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
| `web/plattform/fach.js`, `fach.css` | **Die Fach-App für alle Fächer** (seit `lerndax-v44`): Startseite des Fachs, Übungsrunde, Tipp und Lösungsweg, Sterne, Tagesziel, Knobeln, Trainingsseiten, Erklär-Player, Elternansicht. Liest das Fach aus `window.LERNDAX_FACH` |
| `web/mathe/index.html` | MaDax: bindet die Mathe-Dateien ein und beschreibt das Fach (`LERNDAX_FACH`: Name, Schlüssel `mathelix.v1`, Dachs-Bilder, Reihenfolge der Entdeckungen, geplante Lernbereiche der anderen Klassen) |
| `web/deutsch/index.html` | DeDax: dasselbe für Deutsch (Schlüssel `dedax.v1`) |
| `web/deutsch/themen/klasse5.js` | Wortlisten (Verben mit allen Formen) und Aufgaben Klasse 5 (`window.DeDax`) |
| `web/deutsch/themen/klasse5-knobel.js` | Knobel-Aufgaben zu allen 30 Deutsch-Themen (`topic.knobel`, Varianten in `DeDax.knobelVarianten`) |
| `web/deutsch/erklaerungen/klasse5.js`, `web/deutsch/symbole.js` | Animationen und Themen-Symbole für DeDax |
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
Für Sprach-Aufgaben kennt die App seit `lerndax-v44` drei weitere Formen: **Wort eintippen** (`type: 'text'`, `answer` ist
ein Wort oder eine Liste erlaubter Wörter; Groß- und Kleinschreibung zählt, außer mit `ci: true`), **Satz mit Lücken**
(`layout: 'satz'`, `prefix`/`suffix` sind die Satzteile) und **Antippen** (`tap: { tokens, correct, one?, gaps?, mark? }`:
Wörter im Satz oder, mit `gaps`, Stellen zwischen den Wörtern, etwa für Kommas).
Zahlen werden deutsch formatiert (Komma, schmales Leerzeichen ab 10 000).

### Erklär-Animationen
Jede Erklärung: `{ title, titleFor?(ctx), viewBox, dark?, discover?:{icon, q, tag}, create(api, ctx) → { reset(), play() } }`.
`ctx` = `ex` der Aufgabe plus `pre: true` (ähnliches Beispiel) oder `post: true` (genau die Aufgabe); ohne Aufgabe ist `ctx` leer.
`play()` ist asynchron und nutzt `api.wait`, `api.tw` (Übergänge), `api.say` (Text),
`api.slider`, `api.chips`. Der Player hat eine **eigene virtuelle Uhr**; dadurch funktionieren
Pause und Langsam-Modus für alle Animationen gleich. `discover` ⇒ erscheint unter Entdecken
(Reihenfolge in `LERNDAX_FACH.entdecken` in `web/mathe/index.html`).

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
- Bei jeder Änderung `VERSION` in `web/sw.js` erhöhen (aktuell **`lerndax-v54`**) und neue
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
- [x] Elternbereich auf der Startseite für alle Fächer (v53: Übersicht je Fach, Einzelheiten weiter im Fach)
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
- **DeDax begonnen**: Lehrplan Deutsch Klasse 5 ausgewertet, Schulbuch-Ausgaben ermittelt (Abgleich wartet auf ISBN und
  Inhaltsverzeichnis), Themenplan mit 31 Themen in 5 Bereichen vorgeschlagen (`faecher/deutsch/`).
- **Gemeinsame Fach-App und erstes Deutsch-Thema** (Version `lerndax-v44`, Entscheidungen des Auftraggebers: Start mit
  Wortarten, Umbau sofort): Stil und Programm der Mathe-Seite sind unverändert nach `web/plattform/fach.css` und
  `fach.js` gewandert; fachspezifische Stellen (Name, Bilder, Lernstand-Schlüssel, Entdecken-Reihenfolge, Texte) kommen
  aus `window.LERNDAX_FACH`. Neu in der App: Wort eintippen, Satz mit Lücken, Wörter antippen.
  DeDax „Zeitformen“: 39 Verben mit geprüften Formen (alle Formen ausgegeben und durchgelesen), sieben Aufgabenarten
  (Zeitform bestimmen, Verb ins Präsens/Präteritum setzen, Perfekt/Plusquamperfekt/Futur I bilden, Verbteile antippen,
  haben oder sein, Grundform finden, „Welcher Satz steht im …?“). Präteritum nur mit ich, er/sie/es, wir, sie
  (keine Formen wie „du lasest“). „schwimmen“ bewusst nicht dabei (haben und sein sind beide richtig).
  Neuer Test `tests/dedax.py`.
  Tests nach dem Umbau: Mathe unverändert in Ordnung (`ui2.py` 576 Aufgaben gelöst, `loesung.py` 108 Animationen,
  `knobel.py`, `training.py`, `sync_test.py`, `hub.py`, `ava_hub.py`, `ex.py`, `pause.py`, `two.py`, `pack2.py`, `prim.py`,
  `ex_aufgabe.py`, `bild_audit.py` ohne Auffälligkeit, `design_audit.py` nur die bekannten Deko-Meldungen,
  `gen-test.js` 75 000 Aufgaben ohne Fehler). DeDax: 20 000 erzeugte Aufgaben ohne Fehler, in der App alle richtigen
  Antworten angenommen, alle Lösungs-Animationen nennen die Antwort.
- Rückmeldung Auftraggeber zu „Zeitformen“ (Version `lerndax-v45`): Der Satzanfang „Sie“ war mehrdeutig (eine Person oder
  mehrere, also „trinkt“ oder „trinken“). „Sie“ allein kommt als Subjekt nicht mehr vor. **Lehre für alle Sprach-Aufgaben:**
  Jede Lücke muss genau eine richtige Lösung haben; sonst alle richtigen Antworten zulassen.
- **DeDax: zwei weitere Themen** (Version `lerndax-v46`, Entscheidung des Auftraggebers: „Substantiv“ statt „Nomen“).
  „Substantive: Geschlecht und Mehrzahl“: Artikel wählen, Mehrzahl und Einzahl eintippen, Einzahl oder Mehrzahl,
  alle Substantive im Satz antippen. „Die vier Fälle“: Fall oder Frage bestimmen, Artikel in die Lücke, Wortgruppe in
  den richtigen Fall setzen (auch Mehrzahl, Dativ mit -n), Wortgruppe im gesuchten Fall antippen.
  Eindeutigkeit geprüft: Beim Genitiv gelten „-s“ und „-es“, wo beides richtig ist (des Hundes, des Hunds). Bei der
  Artikel-Lücke kommen keine Wörter vor, die in Einzahl und Mehrzahl gleich aussehen (sonst wären „den Lehrer“ und
  „die Lehrer“ beide richtig). Dativ-Sätze nur mit Personen und Tieren, damit die Frage „Wem?“ passt.
  Alle Wortformen ausgegeben und durchgelesen. `tests/dedax.py`: 144 richtige Antworten angenommen, 48 Lösungs-Animationen
  nennen die Antwort; 60 000 erzeugte Aufgaben ohne Fehler.
- **DeDax: Bereich Wortarten fertig** (Version `lerndax-v47`): vier weitere Themen.
  „Pronomen“ (Wortgruppe durch Personalpronomen ersetzen als Auswahl und zum Eintippen, Possessivpronomen, „Wofür steht
  das Pronomen?“, alle Pronomen antippen), „Adjektive steigern“ (Vergleichs- und Höchststufe eintippen, Stufe bestimmen,
  im Satz steigern, als oder wie), „Verbformen“ (Personalform eintippen, Pronomen zur Form, Partizip, Aufforderung an
  eine oder mehrere Personen, Personalform/Grundform/Partizip unterscheiden), „Wortarten erkennen“ (Wortart bestimmen,
  alle Wörter einer Wortart antippen, Wort aus vier wählen).
  Eindeutigkeit: „das Mädchen“ kommt beim Ersetzen nicht vor (es/sie strittig); „Pronomen zur Verbform“ nur mit Formen,
  die zu genau einer Person passen (nicht „spielt“: er und ihr); Aufforderung nimmt beide Formen an (Komm/Komme), bei
  mehreren Personen nur Sätze ohne „dir/dein“; Adjektive mit strittigem Umlaut (nass, gesund, rot) fehlen bewusst.
  Animationen: gemeinsame Bausteine in `web/deutsch/erklaerungen/klasse5.js` (zwei Zeilen mit Pfeil, Wörter markieren,
  Türme fürs Steigern, als/wie, Wortarten in Farben); „ähnliches Beispiel“ erzeugt eine neue Aufgabe derselben Art.
  `tests/dedax.py`: 7 Themen, alle richtigen Antworten angenommen, alle Lösungs-Animationen nennen die Antwort;
  140 000 erzeugte Aufgaben ohne Fehler (keine doppelten Auswahl-Antworten).
- **DeDax auf der Startseite** (Version `lerndax-v48`): zweite Kachel neben MaDax. „Entdecken“ und „Für Eltern“ auf der
  Startseite führen weiter zu MaDax (offen: Elternbereich für beide Fächer).
- **DeDax: Bereich 2 „Satzbau und Satzzeichen“ fertig** (Version `lerndax-v49`): acht Themen.
  „Satzglieder und Umstellprobe“ (Grenzen antippen, zählen, richtige Umstellung wählen), „Subjekt und Prädikat“
  (antippen, bestimmen, passende Verbform), „Dativ- und Akkusativobjekt“, „Attribute“ (antippen, Weglassprobe, zu
  welchem Substantiv), „Hauptsatz und Nebensatz“ (Personalform antippen, richtig gebauter Nebensatz), „Satzarten und
  Satzschlusszeichen“, „Komma: Aufzählung und Satzgefüge“ (Kommastellen antippen), „Wörtliche Rede“ (richtige
  Schreibung, fehlendes Zeichen, Begleitsatz und Rede).
  Wortlisten: 18 Sätze mit Satzgliedern und Rollen, 14 Sätze mit Attributen, 14 Satzgefüge, je 8 Sätze pro Satzart,
  8 Aufzählungen, 12 Redesätze. Eindeutigkeit: Bei der Umstellprobe ist „Die Kinder im Garten spielen“ keine falsche
  Antwort mehr (das wäre ein richtiger Satz), falsch ist nur „Im Garten die Kinder spielen“. Bei der Weglassprobe sind
  Artikel keine falschen Antworten („Sie trinkt heißen Tee“ ist richtig). Satzzeichen-Auswahl nur Punkt oder
  Fragezeichen (ein Aussagesatz mit Ausrufezeichen wäre auch richtig).
  Neue Animationen: Satzglieder als Wagen, die die Plätze tauschen; Kommas, die an ihrer Stelle erscheinen.
  `tests/dedax.py` misst jetzt echte Bildschirmpositionen (vorher Fehlalarm bei verschobenen Gruppen): 15 Themen,
  540 richtige Antworten angenommen, 180 Lösungs-Animationen; 150 000 erzeugte Aufgaben ohne Fehler.
- **DeDax: Bereich 3 „Rechtschreibung“ fertig** (Version `lerndax-v50`): sechs Themen.
  „Lange Vokale“ (Dehnungs-h, Doppelvokal, einfach, ie), „Kurze Vokale und Doppelkonsonanten“ (auch ck/k, tz/z),
  „Verlängern und Ableiten“ (b/d/g am Wortende, ä/e, äu/eu), „s-Laute: s, ss, ß“, „Groß- und Kleinschreibung“
  (kleingeschriebenen Satz antippen, Wort in Großbuchstaben richtig einsetzen, „das Laufen“ / „wir laufen“),
  „Silben und Worttrennung“ (Trennstellen zwischen Buchstaben antippen, zählen, richtige Trennung, mit Strichen
  schreiben).
  **Lückenwörter:** rund 330 Wörter in der Schreibweise `F[eh]ler|e,ee` (richtig in Klammern, dahinter die falschen
  Angebote). Jedes Wort mit allen falschen Varianten ausgegeben und durchgelesen: Mit keinem Angebot darf ein anderes
  richtiges Wort entstehen. Deshalb fehlen z. B. Meer/mehr, Hütte/Hüte, Gäste/Geste, Kälte/Kelte, reißen/reisen,
  Maße/Masse, Paar (Par), Tor (Torr), Hund (Hunt), Kloß (Klos), Gruß (Grus), Spaß (in Österreich auch Spass).
  Beim Eintippen steht die Auswahl dabei („mit u oder uh?“), weil in „T▢r“ sonst auch Tor, Tür und Tier passen.
  Worttrennung nach heutiger Regel (Fens-ter, Zu-cker); Wörter mit einem einzelnen Vokal am Anfang (Abend, Igel) fehlen.
  Plattform: Antippen zwischen Buchstaben (`tap.eng`), zwei lange Antworten stehen untereinander statt nebeneinander.
  `tests/dedax.py`: 21 Themen, 756 richtige Antworten angenommen, 252 Lösungs-Animationen; 210 000 erzeugte Aufgaben
  ohne Fehler.
- **DeDax: Bereiche 4 und 5 fertig, Themenplan Klasse 5 vollständig** (Version `lerndax-v51`, 30 Themen).
  Bereich 4: „Zusammengesetzte Wörter“ (Artikel, zusammensetzen auch mit Fugenzeichen, Grundwort, Nahtstelle antippen),
  „Vorsilben und Nachsilben“ (passende Vorsilbe, Wortart nach Nachsilbe, Wort bauen mit Groß/Klein), „Wortfamilien“
  (gehört nicht dazu, gehört dazu, Wortstamm), „Wortfelder“ (treffendes Wort, passt nicht, welches Wortfeld).
  Bereich 5: „Märchen und Sage“, „Gedichte: Vers, Strophe, Reim“, „Sprachliche Bilder“, „Erzählen, Beschreiben,
  Berichten“, „Sachtexte, Tabellen, Schaubilder“ (Tabelle und Balken-Schaubild mit zufälligen Zahlen, Antwort als Zahl).
  **Alle Texte sind selbst geschrieben** (6 Strophen, 8 Märchen- und Sagen-Anfänge, 9 Textsorten-Ausschnitte, 4 Sachtexte).
  Orte und Namen in den Sagen sind erfunden. Sachtext-Fakten geprüft (Elbe: Quelle im Riesengebirge, rund 1100 km,
  Mündung in die Nordsee).
  Eindeutigkeit: Vorsilben-Angebote ergeben nur mit der richtigen Vorsilbe ein Wort (nicht „verdeckt“ neben „entdeckt“);
  falsche Nachsilben ergeben kein Wort (nicht „herzig“ neben „herzlich“); in Wortfamilien keine strittigen Verwandten
  (nicht „Gefahr“ bei „fahren“, nicht „lernen“ bei „lehren“); Nahtstelle nur bei Wörtern ohne Fugenzeichen.
  Neue Animationen: Wortliste mit farbigem Wortstamm, Reimschema in Farben, wachsendes Balken-Schaubild.
  `tests/dedax.py`: 30 Themen, 1080 richtige Antworten angenommen, 360 Lösungs-Animationen; 240 000 erzeugte Aufgaben
  ohne Fehler.
- **DeDax: „Entdecken“** (Version `lerndax-v52`): sechs Entdeckungen auf dunkler Bühne.
  „Cäsars Geheimschrift“ (Alphabet verschieben, Wort verschlüsseln, Knacken über den häufigsten Buchstaben E),
  „Rückwärts-Wörter“ (Palindrome: Buchstaben tauschen die Plätze), „Wie lang kann ein Wort werden?“ (Donau… bis
  Donaudampfschifffahrtsgesellschaftskapitänsmütze, 48 Buchstaben, der Artikel wechselt mit dem letzten Wort),
  „Woher kommen die Familiennamen?“ (Beruf, Aussehen, Herkunft, Vater), „Wörter auf Wanderschaft“ (Fenster, Mauer, Keks,
  Zucker, Joghurt; umgekehrt Kindergarten, Rucksack, buterbrod, arubaito, vasistas), „Sächsisch“ (k/t/p werden weich,
  dazu Bemme, nu, Plinsen, Mutschekiebchen, Hitsche; passt zum Lehrplan-Punkt Dialekt und Hochsprache).
  Geprüft: alle Palindrome per Programm, Buchstabenzahl per Programm. „vasistas von ‚Was ist das?‘“ ist als Erzählung
  formuliert („man erzählt“), weil die Herkunft nicht ganz sicher ist. Sächsische Schreibweisen sind Lautschrift.
  Startseite: „Entdecken in MaDax“ und „Entdecken in DeDax“. `tests/dedax.py` spielt jetzt auch alle Entdeckungen durch.
- **Elternübersicht auf der Startseite** (Version `lerndax-v53`): „Für Eltern“ öffnet jetzt eine Übersicht über alle
  fertigen Fächer statt nur MaDax. Je Fach: Aufgaben, Übungstage, „x / y Themen geübt“, Trefferquote (Durchschnitt der
  letzten Aufgaben je Thema), Sterne-Balken, „zuletzt geübt am“. Von dort ein Knopf in die ausführliche Ansicht des
  Fachs und einer zu „Geräte & Konto“. Die Zahlen kommen aus dem Lernstand im Browser (`mathelix.v1`, `dedax.v1`),
  nichts Neues in der Datenbank. `tests/eltern.py` prüft Zahlen, Links und den Zurück-Knopf über einen kleinen
  Webserver (Links wie `deutsch/#eltern` öffnen als Datei keine `index.html`).
- **DeDax: Knobel-Aufgaben** (Version `lerndax-v54`): zu jedem der 30 Themen zwei oder drei schwerere Aufgabenarten
  (zusammen 86), alle mit Tipp und Lösungsweg. Ideen: Fallen (wird/hat/ist als einziges Verb, „das Laufen“ als
  Substantiv, Adjektiv hinter „ist“ ist kein Attribut), zwei Regeln auf einmal (Komma bei Aufzählung **und** Nebensatz),
  längere Sätze (Satzglieder mit Attributen, Subjekt in der Satzmitte, zweiteiliges Prädikat), Rückwärts-Aufgaben
  (Grundform zu „saß“, verwandtes Wort als Beweis für „Gebäude“), Neues am Rand des Stoffs (Fälle nach mit/für/wegen,
  Wo?/Wohin?, das/dass, eingeschobener Begleitsatz, Metapher, Redewendungen, Brückenwörter, Märchen-Rätsel).
  Eindeutigkeit: Bei Lücken ergibt kein falsches Angebot ein anderes Wort; wo zwei echte Wörter zur Wahl stehen
  (Wal/Wahl, mahlen/malen, das/dass), entscheidet der Satz. Mehrere richtige Schreibweisen sind alle zugelassen
  (Atlanten/Atlasse, Fahr/Fahre, gesünder/gesunder). Weggelassen: Gang (Gong), Biss, Schuss, Fluss als Lückenwort;
  Herz (Hertz); klingt (klinkt); Missgeschick/Missgunst (Ungeschick, Ungunst gibt es auch); Zeuge bei „ziehen“ und
  Wachs bei „wachsen“ (Herkunft strittig); „Sie“-Bezüge mit zwei möglichen Personen.
  Die drei kurzen Sachtexte (Dachs, Igel, Biber) sind selbst geschrieben, die Tier-Angaben aus meinem Wissen, nicht nachgeschlagen.
  Nebenbei an der gemeinsamen App (`fach.js`, `fach.css`): Ein Satzzeichen nach einer Lücke bleibt am Feld (rutschte
  allein in die nächste Zeile); lange Eingabefelder ragten über den Rand; in „Richtig ist: …“ fehlten bei Sätzen mit
  Lücken die Leerzeichen (betraf auch die normalen Deutsch-Aufgaben).
  Geprüft: 34 400 erzeugte Aufgaben ohne Fehler; `tests/dedax_knobel.py` spielt jede Aufgabenart in der App
  (430 Aufgaben: richtige Antwort angenommen, falsche führt zur Lösung, nichts ragt über den Rand, Sterne unverändert).
- **Übergabe für EnDax vorbereitet** (12.11.2026, keine Änderung an der App, Version bleibt `lerndax-v54`): neuer
  Startpunkt `faecher/englisch/README.md`; Abschnitt 0 beginnt jetzt mit der Kurzfassung für den neuen Chat;
  `faecher/README.md` und `faecher/deutsch/README.md` auf den heutigen Stand gebracht.
- **EnDax begonnen** (12.11.2026 spät, keine Änderung an der App, Version bleibt `lerndax-v54`): Lehrplan Englisch
  Klassenstufen 5/6 am Originaltext ausgewertet (`faecher/englisch/lehrplan/sachsen-gymnasium.md`). Noch **nicht auf GitHub**
  (in dieser Sitzung kein Schreibzugriff auf das Repository), liegt nur im OneDrive-Ordner.
- **v55: EnDax, erstes Thema „to be: am, is, are“** (12.11.2026 nachts). Neu: `web/englisch/` (Themen, Erklärung, Symbol,
  56 Aufnahmen), `tests/endax.py`, `tests/endax_audio.py`. Gemeinsame App: Anhören-Knopf und Apostroph-Regel.
  Geprüft: 4800 erzeugte Aufgaben ohne Fehler; `tests/endax.py` (12 Runden: richtige Antwort angenommen, falsche führt zur
  Lösung, Animation nennt die Antwort, nichts ragt aus dem Bild, jede Aufnahme vorhanden). Tests für Mathe und Deutsch nach der Änderung an `fach.js` ohne Fehler: `ui2` (576 Aufgaben), `loesung` (108 Animationen), `knobel`, `dedax` (2 Runden, 360 Antworten, 120 Animationen), `dedax_knobel` (430), `eltern`, `training`, `hub`. Nicht gelaufen: `sync_test`, `design_audit`, `bild_audit`.
  Die Aufnahmen hat nur der Auftraggeber in der Hörprobe gehört (9 Beispielsätze), die 56 Dateien selbst noch niemand.
- **v56: Umschalter „Aussprache“ in EnDax** (13.11.2026). `fach.js`/`fach.css`: `F.audio` als Liste `[{ id, name, pfad }]`,
  Umschalter auf der Startseite des Fachs. Britische Aufnahmen (`bm_fable`) in `audio/k5-gb/`. `tests/endax_audio.py` erzeugt
  beide Sätze, `tests/endax.py` prüft beide Ordner und den Umschalter. Tests: endax (8 Runden) ohne Fehler; Mathe und Deutsch danach ohne Fehler: `ui2` (576 Aufgaben), `dedax` (2 Runden, 360 Antworten), `eltern`.
  Die britischen Aufnahmen hat noch niemand angehört.
- **v57: EnDax, Themen 2 und 3** (13.11.2026): `e5-pron` und `e5-be-neg`. Nur `web/englisch/` und `sw.js` geändert, die
  gemeinsame App nicht. Geprüft: 10 000 erzeugte Aufgaben ohne Fehler (auch: jede Aufnahme steht in der Liste);
  `tests/endax.py` 10 Runden (180 Antworten, 60 Animationen) ohne Fehler. Mathe und Deutsch nicht erneut getestet (unverändert).
  Die neuen Aufnahmen hat noch niemand angehört.
- **v58: EnDax, Themen 4 und 5** (13.11.2026): `e5-have` und `e5-a-an`. Nur `web/englisch/` und `sw.js` geändert.
  Geprüft: 10 400 erzeugte Aufgaben der beiden Themen ohne Fehler; `tests/endax.py` 10 Runden (5 Themen, 300 Antworten,
  100 Animationen) ohne Fehler. Die neuen Aufnahmen hat noch niemand angehört.
- **v59: Sammeldateien für Aufnahmen und EnDax-Thema „Mehrzahl“** (13.11.2026). Geändert: `web/plattform/fach.js`
  (Wiedergabe aus Sammeldateien), `web/englisch/` (Thema, Animation, Symbol, `audio/us/`, `audio/gb/`), `tests/endax.py`,
  `tests/endax_audio.py` (packt, übernimmt vorhandene Aufnahmen, erzeugt nur fehlende), `sw.js`.
  Geprüft: alle 251 bisherigen Aufnahmen liegen byte-gleich in den Paketen; 14 100 erzeugte Aufgaben ohne Fehler;
  `tests/endax.py` 8 Runden (6 Themen, 288 Antworten, 96 Animationen, 46 Lautsprecher angetippt) ohne Fehler; Wiedergabe
  im Test-Browser gemessen (Aufnahme läuft bis zum Ende, auch wenn das Paket beim Antippen noch fehlt). Mathe und Deutsch danach ohne Fehler: `ui2` (576 Aufgaben), `dedax` (2 Runden, 360 Antworten), `eltern`, `hub`.
- **v60: EnDax, Themen 7 und 8** (13.11.2026): `e5-there` und `e5-this`. Nur `web/englisch/` und `sw.js` geändert.
  Geprüft: 13 000 erzeugte Aufgaben der beiden Themen ohne Fehler; `tests/endax.py` 8 Runden (8 Themen, 384 Antworten,
  128 Animationen, 64 Lautsprecher angetippt) ohne Fehler. Die neuen Aufnahmen hat noch niemand angehört.
- **v61: EnDax, Themen 9 und 10** (13.11.2026): `e5-poss` und `e5-gen`. Nur `web/englisch/` und `sw.js` geändert.
  Geprüft: 11 000 erzeugte Aufgaben der beiden Themen ohne Fehler; `tests/endax.py` 8 Runden (10 Themen, 480 Antworten,
  160 Animationen, 78 Lautsprecher angetippt) ohne Fehler. Die neuen Aufnahmen hat noch niemand angehört.
- **v62: EnDax, Themen 11 und 12** (13.11.2026): `e5-imp` und `e5-can`. Nur `web/englisch/` und `sw.js` geändert.
  Geprüft: 19 500 erzeugte Aufgaben der beiden Themen ohne Fehler, Auswahl-Angebote durchgesehen; `tests/endax.py`
  8 Runden (12 Themen, 576 Antworten, 192 Animationen, 95 Lautsprecher angetippt) ohne Fehler.
  Die neuen Aufnahmen hat noch niemand angehört.
- **v63: EnDax auf der Startseite, Aufgabenform „Wörter ordnen“, Themen 13 bis 15** (13.11.2026). Geändert: `fach.js`,
  `fach.css`, `faecher.js`, `web/englisch/`, `tests/endax.py`, `sw.js`. Geprüft: 18 000 erzeugte Aufgaben der drei Themen
  ohne Fehler, Sätze und Auswahl-Angebote durchgesehen (dabei „likees“ und eine doppelte Antwort bei „do“ behoben);
  `tests/endax.py` 3 Runden (15 Themen, 300 Antworten, 60 Animationen) ohne Fehler; Startseite zeigt drei Kacheln. Mathe und Deutsch danach ohne Fehler: `ui2` (576 Aufgaben), `dedax` (2 Runden), `eltern`, `hub`.
- **v86: Startpunkt für GeDax** (13.11.2026): neu `faecher/geschichte/README.md`; `STAND.md`, `faecher/README.md`, `web/sw.js`. App unverändert.
- **v85: `e5-have` nach Unit 2 verschoben, „only child“** (13.11.2026): `web/englisch/themen/klasse5.js`, Aufnahmen, `sw.js`. Test `endax.py 1`.
- **v84: EnDax Kurzantworten mit I/we/you, Uhrzeit mit Minuten, Entdeckung Greenwich** (13.11.2026): `web/englisch/themen/klasse5.js`,
  `erklaerungen/klasse5.js`, `erklaerungen/entdecken.js`, `index.html`, Aufnahmen, `sw.js`.
- **v83: EnDax Unit 1 Station 2 ergänzt** (13.11.2026): `web/englisch/themen/klasse5.js` (TH, Schule, Medien), Aufnahmen, `sw.js`.
- **v82: EnDax Lautschrift** (13.11.2026). Geändert: `web/englisch/themen/klasse5.js` (LS, LZ, LS_SILB, `lautschrift`),
  `klasse5-knobel.js`, `erklaerungen/klasse5.js` (`EX['e5-laut']`), `symbole.js`, Aufnahmen (e5-laut), `faecher.js` (53), `sw.js`.
- **v81: EnDax Medien und Meinung, DeDax Konjunktionen** (13.11.2026). Geändert: `web/englisch/themen/klasse5.js`, `klasse5-knobel.js`,
  `erklaerungen/klasse5.js`, `symbole.js`, Aufnahmen-Pakete; `web/deutsch/themen/klasse5.js`, `klasse5-knobel.js`, `erklaerungen/klasse5.js`,
  `symbole.js`; `web/plattform/faecher.js` (52 und 37 Themen), `web/sw.js`, Doku.
- **v80: DeDax Theater und Film, Versmaß, Metapher** (13.11.2026). Geändert: `web/deutsch/themen/klasse5.js`, `klasse5-knobel.js`,
  `erklaerungen/klasse5.js` (Bildmodus `bild`), `symbole.js`, `web/plattform/faecher.js` (36 Themen), `web/sw.js`, Doku.
  Tests: `dedax.py 3` (36 Themen, 720 Antworten, 144 Animationen), `dedax_knobel.py` (510 Aufgaben), nach letzter Textänderung `dedax.py 1`.
  `tests/dedax.py` klappt vor den freien Erklärungen fertige Bereiche auf (sonst fehlen bei 1 Runde Erklär-Knöpfe).
- **v79: DeDax 4 neue Themen und 4 Ergänzungen nach dem Deutschbuch** (13.11.2026). Geändert: `web/deutsch/themen/klasse5.js`,
  `klasse5-knobel.js`, `erklaerungen/klasse5.js` (über `thema()`), `symbole.js`, `web/plattform/faecher.js` (34 Themen), `web/sw.js`, Doku.
- **v78: „Nomen“ statt „Substantiv“ in DeDax, britische Stimme als Voreinstellung in EnDax** (13.11.2026). Geändert:
  `web/deutsch/themen/klasse5.js`, `klasse5-knobel.js`, `erklaerungen/klasse5.js`, `symbole.js` (109 Stellen), `web/englisch/index.html`
  (gb zuerst), `tests/endax.py` (prüft die Voreinstellung; klappt vor den freien Erklärungen fertige Bereiche auf), `web/sw.js`.
  Tests: `dedax.py 2` (30 Themen, 360 Antworten, 120 Animationen), `dedax_knobel.py` (430 Aufgaben), `endax.py 1` ohne Meldung.
- **v77: EnDax nach Green Line 1 geordnet, 4 neue Themen** (13.11.2026). Geändert: `web/englisch/themen/klasse5.js`
  (Bereiche = Units, Wortfelder Gefühle, Party, Beschreiben, Monate, Thema `e5-wenig`, Kurzantworten `ppKurzantwort`),
  `klasse5-knobel.js`, `erklaerungen/klasse5.js` (`EX['e5-wenig']`), `symbole.js`, Aufnahmen-Pakete, `web/plattform/faecher.js`
  (50 Themen), `web/sw.js`; neu `faecher/englisch/lehrplan/schulbuch-abgleich.md`, neu geschrieben
  `faecher/deutsch/lehrplan/schulbuch-abgleich.md`. Tests siehe unten.
- **v76: Schulbücher eingetragen** (13.11.2026): ISBN aller Klasse-5-Bücher bestimmt. Geändert nur Doku: `STAND.md`,
  `faecher/README.md`, `faecher/englisch/README.md`, `faecher/englisch/themenplan.md`, `faecher/deutsch/README.md`,
  `faecher/deutsch/lehrplan/schulbuch-abgleich.md`; dazu `web/sw.js` (Version). Keine Tests nötig, die App ist unverändert.
- **v75: EnDax Knobeln für Alltag** (13.11.2026): geändert `web/englisch/themen/klasse5-knobel.js`, `tests/endax_knobel.py`, `web/sw.js`.
  Test `endax_knobel.py` ohne Meldung.
- **v74: EnDax Alphabet** (13.11.2026): Thema `e5-a-abc`. Geändert: `web/englisch/` (Themen, Erklärungen, Symbole, Aufnahmen-Pakete),
  `web/plattform/faecher.js` (46 Themen), `web/sw.js`. Test `endax.py 3` ohne Meldung.
- **v73: EnDax Knobel-Aufgaben** (13.11.2026): neu `web/englisch/themen/klasse5-knobel.js`, `tests/endax_knobel.py`; geändert
  `web/englisch/index.html`, `web/sw.js`. Test `endax_knobel.py` ohne Meldung.
- **v72: EnDax „Entdecken“** (13.11.2026): neu `web/englisch/erklaerungen/entdecken.js`; geändert `web/englisch/index.html`,
  `web/englisch/themen/klasse5.js` (ENT, Aufnahmen „e5-entdecken“), Aufnahmen-Pakete, `web/plattform/faecher.js`, `web/sw.js`.
  Tests `endax.py 3` und `hub.py` (nur Netzfehler der Sandbox) ohne Meldung.
- **v71: EnDax, Themen 41 bis 45 (Im Alltag)** (13.11.2026): neuer Bereich `e5-alltag`. Geändert: `web/englisch/` (Themen, Erklärungen,
  Symbole, Aufnahmen-Pakete), `web/plattform/faecher.js` (45 Themen), `web/plattform/fach.css` (Farben bg6–bg8), `web/sw.js`.
  Tests `endax.py 3`, `ui2.py`, `eltern.py` ohne Meldung.
- **v70: EnDax, Themen 30 bis 40 (Wortfelder)** (13.11.2026): neuer Bereich `e5-woerter`. Geändert: `web/englisch/` (Themen, Erklärungen,
  Symbole, Aufnahmen-Pakete), `web/plattform/faecher.js` (40 Themen), `web/sw.js`. Test `tests/endax.py 3` ohne Meldung.
- **v69: EnDax, Themen 27 bis 29** (13.11.2026): `e5-was`, `e5-ed`, `e5-irr`, neuer Bereich `e5-vergangen`. Geändert: `web/englisch/`
  (Themen, Erklärungen, Symbole, Aufnahmen-Pakete), `web/plattform/faecher.js` (29 Themen), `web/sw.js`. Test `tests/endax.py 3` ohne Meldung.
- **v68: EnDax, Thema 26** (13.11.2026): `e5-zahl`. Geändert: `web/englisch/` (Themen, Erklärungen, Symbole, Aufnahmen-Pakete),
  `web/plattform/faecher.js` (26 Themen), `web/sw.js`. Test `tests/endax.py 3` ohne Meldung.
- **v67: EnDax, Themen 24 und 25** (13.11.2026): `e5-ort` (mit Bildern), `e5-zeit`. Geändert: `web/englisch/` (Themen, Erklärungen,
  Symbole, Aufnahmen-Pakete), `web/plattform/faecher.js` (25 Themen), `web/sw.js`. Test `tests/endax.py 3` ohne Meldung.
- **v66: EnDax, Themen 22 und 23** (13.11.2026): `e5-some`, `e5-much`, neuer Bereich `e5-mengen`. Geändert: `web/englisch/` (Themen,
  Erklärungen, Symbole, Aufnahmen-Pakete), `web/plattform/faecher.js` (23 Themen), `web/sw.js`. Test `tests/endax.py 3` ohne Meldung.
- **v65: EnDax, Themen 19 bis 21** (13.11.2026): `e5-pp`, `e5-sp`, `e5-obj`. Geändert: `web/englisch/` (Themen, Erklärungen, Symbole,
  Aufnahmen-Pakete `pp`, `sp`, `obj` in `audio/us` und `audio/gb`), `web/plattform/faecher.js` (21 Themen), `web/sw.js`. Test `tests/endax.py 3` ohne Meldung.
- **v64: EnDax, Themen 16 bis 18** (13.11.2026): `e5-fragewort`, `e5-satzbau`, `e5-oft`. Geändert: `web/englisch/`,
  `faecher.js` (Themenzahl), `sw.js`. Geprüft: 22 500 erzeugte Aufgaben der drei Themen ohne Fehler, Angebote und
  zugelassene Lösungen durchgesehen; `tests/endax.py` (18 Themen, 3 Runden: 360 Antworten, 72 Animationen) ohne Fehler,
  nachdem ein fehlender Untertitel in zwei Animationen ergänzt war. Mathe und Deutsch nicht erneut getestet
  (`fach.js` seit v63 unverändert). Die neuen Aufnahmen hat noch niemand angehört.
