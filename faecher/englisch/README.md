# EnDax (Englisch) – Startpunkt

Stand 12.11.2026 (nachts): Lehrplan ausgewertet, Themenplan als Vorschlag, **Thema 1 gebaut**, Ton entschieden. Diese Datei sagt, was feststeht, was zu klären ist und wie man anfängt.
Vorher lesen: `STAND.md` (Abschnitt 0 und 6), `README.md`, `faecher/README.md`. Vorbild für alles: DeDax
(`faecher/deutsch/README.md`, `web/deutsch/`).

| Schritt | Stand | Datei |
|---|---|---|
| 1 Lehrplan auswerten | **erledigt (12.11.2026)**. Wichtig: Klasse 5 und 6 sind gemeinsam beschrieben, die Aufteilung macht das Schulbuch | `lehrplan/sachsen-gymnasium.md` |
| 2 Schulbuch abgleichen | **erledigt (13.11.2026, v77)**: Green Line 1, Ausgabe ab 2021. Die Bereiche heißen jetzt wie die Units | `lehrplan/schulbuch-abgleich.md` |
| 3 Themenplan | **Vorschlag liegt vor (12.11.2026)**, wartet auf Zustimmung; Entscheidungen stehen dort | `themenplan.md` |
| 4 Themen bauen | **46 Themen gebaut, Bereich 1 bis 6 gebaut, EnDax steht auf der Startseite** (to be v55; Pronomen und „to be verneinen und fragen“ v57; have got und a/an v58; Mehrzahl v59; there is/are und this/that v60; my/your und ’s/of v61; Aufforderungen und can/must v62; present simple (3 Themen) v63; Fragewörter, Satzbau, Wie oft v64; present progressive, simple oder progressive, me/him/her v65; some/any und much/many v66; Wo? (mit Bild) und Wann? v67; Zahlen, Datum, Uhrzeit v68; was/were, -ed, unregelmäßige Verben v69; 11 Wortfelder v70; Im Alltag und Lesen v71; Entdecken v72; Knobeln v73; Alphabet v74; Knobeln für alle Themen v75; nach Green Line 1 geordnet und 4 neue Themen v77, jetzt 50), live; Rest offen | `web/englisch/`, Tests `tests/endax.py`, Aufnahmen `tests/endax_audio.py` |

## Was feststeht

| | |
|---|---|
| Name | **EnDax** (sichtbar), Fach-ID `englisch`, Kürzel `En` |
| Maskottchen | Dachs mit **Strickmütze mit Union Jack**: `web/icons/endax.svg` (fertig) |
| Farbe | `#14a06c` (Eintrag in `web/plattform/faecher.js`, bisher `status: 'geplant'`, Klassen 3–10) |
| Ordner | `web/englisch/` (anzulegen), Lernstand im Browser unter eigenem Schlüssel, Vorschlag `endax.v1`, Namensraum `window.EnDax` |
| Zuerst | Klasse 5, Gymnasium Sachsen; später Klasse 4 und 6, dann 3–10 |
| Leitidee | verstehen statt pauken; anschauliche, animierte Erklärungen; nach jeder Antwort die Lösung; „Entdecken“ zum Neugierigwerden |
| Schulbuch | **Green Line 1, Ausgabe ab 2021** (Klett, ISBN 978-3-12-864011-2, flexibler Einband, 255 Seiten), geprüft 13.11.2026. Aufbau: Hello! (Übergang von der Grundschule), Unit 1 A new school, Unit 2 At home, Across cultures 1 (Greenwich), Unit 3 Our Greenwich, Across cultures 2 (How does it taste?), Unit 4 Happy Birthday, Extra line. Vier Units im Schuljahr. |
| Datenbank | keine Änderung nötig: Der Lernstand wird je Fach gespeichert (`subject = 'englisch'`, ist im Schema schon erlaubt) |

Regeln wie bei MaDax und DeDax: genau der sächsische Lehrplan, alles darüber hinaus in „Entdecken“; keine Namen von
Schule, Lehrkraft oder Kind im öffentlichen Code; nichts aus dem Schulbuch abschreiben (auch keine Vokabellisten
in der Reihenfolge des Buchs übernehmen, sondern eigene Wortlisten nach Themen schreiben).

## Vorgehen (so hat es bei Mathe und Deutsch funktioniert)

1. **Lehrplan Englisch Gymnasium Sachsen, Klasse 5, am Originaltext auswerten**
   (https://www.schulportal.sachsen.de/lplandb/) und als `faecher/englisch/lehrplan/sachsen-gymnasium.md` ablegen:
   Lernbereiche, Inhalte, was davon am Bildschirm übbar ist. Nicht aus dem Gedächtnis.
2. **Mit dem Schulbuch abgleichen**, sobald ISBN und Inhaltsverzeichnis da sind (Reihenfolge der Units, Grammatik je
   Unit, Wortfelder). Ohne Buch trotzdem anfangen: Der Lehrplan reicht für den Themenplan.
3. **Themenplan vorlegen**: Bereiche und Themen als Liste, dazu je Thema 2–3 Beispiel-Aufgaben. Der Auftraggeber
   entscheidet anhand von Optionen (**Fragen einzeln stellen**).
4. **Erst ein Thema ganz fertig bauen** (Aufgaben, Tipp, Lösungsweg, Erklärung, Symbol, Test) und zeigen, dann die übrigen.
5. Danach „Entdecken“ und Knobel-Aufgaben. Zum Schluss `faecher.js` auf `status: 'fertig'` (erst wenn der
   Auftraggeber es auf der Startseite haben will).
6. Tests, Version, GitHub, `STAND.md`, OneDrive wie in `STAND.md` Abschnitt 0 beschrieben.

## Was vor dem Bauen zu klären ist (mit dem Auftraggeber, einzeln)

1. ~~Welches Englischbuch genau~~ Green Line 1, Ausgabe ab 2021 (13.11.2026), abgeglichen in v77.
2. **Womit anfangen**: Welche Unit ist gerade dran, steht eine Arbeit oder ein Vokabeltest an, was fällt schwer?
3. **Sprache der App**: Aufgabenstellung, Tipp und Lösungsweg auf Deutsch (Vorschlag für Klasse 5) oder teils Englisch?
4. **Vokabeln**: eigene Wortlisten nach Themen (Vorschlag), oder will er die Vokabeln der aktuellen Unit selbst
   eintragen können? Das wäre eine neue Funktion.
5. **Ton**: Soll EnDax Wörter und Sätze **vorlesen** (Aussprache, Hörverstehen)? Das gibt es in LernDax noch nicht
   und muss erst ausprobiert werden (siehe unten).
6. Britisches Englisch als Standard (passt zum Dachs-Hut); bei Wörtern mit zwei Schreibweisen beide zulassen?

## Technik: was schon da ist

Die App selbst wird **nicht** kopiert. `web/plattform/fach.js` und `fach.css` sind die gemeinsame Fach-App
(Startseite des Fachs, Übungsrunde, Tipp, Lösungsweg, Sterne, Tagesziel, Gemischt, Fehler-Training, Knobeln,
Erklär-Player, Elternansicht, Synchronisation). Ein Fach liefert nur:

| Datei (Vorbild in `web/deutsch/`) | Inhalt |
|---|---|
| `index.html` | kurze Hülle: `window.LERNDAX_SUBJECT = 'englisch'`, Skripte einbinden, `window.LERNDAX_FACH = { id, name, fach, key, app, icons, dachs, entdecken, entdeckenText, entdeckenKurz, andereKlassen }`, dann `../plattform/fach.js` |
| `themen/klasse5.js` | Wortlisten und Aufgaben; `window.EnDax = { util, daten, arten, grades: { 5: { lbs: [{ id, nr, title, topics: [{ id, title, icon, gen }] }] } }, explainers }` |
| `themen/klasse5-knobel.js` | Knobel-Aufgaben: `topic.knobel()` je Thema |
| `erklaerungen/klasse5.js`, `entdecken.js` | Animationen: `{ title, viewBox, create(api, ctx) → { reset(), play() } }` |
| `symbole.js` | eigenes SVG-Symbol je Thema (`window.EnDaxIcons`) |

Dazu: Dateien in `web/sw.js` (Liste `SHELL`) aufnehmen und `VERSION` erhöhen; in `web/plattform/faecher.js`
`status`, `fertig`, `href`, `key`, `themen`, `entdecken` setzen. Die Elternübersicht der Startseite nimmt ein
fertiges Fach von selbst auf.

**Aufgabenformen, die die App schon kann** (alle mit `prompt`, `hint`, `solution`, optional `answerText`, `ex`):
- Auswahl: `choices`, `correct`
- Zahl eintippen: `fields: [{ answer }]`
- Wort oder Satz eintippen: `fields: [{ type: 'text', answer: 'Wort' oder ['Wort', 'andere Schreibweise'], ci: true }]`
- Satz mit Lücken: `layout: 'satz'`, Felder mit `prefix` und `suffix`
- Wörter antippen: `tap: { tokens, correct: [Nummern] }`; Stellen zwischen Wörtern antippen: `tap: { …, gaps: true, mark: ',' }`

**Was für Englisch wahrscheinlich neu gebraucht wird** (erst klären, dann bauen, danach alle Tests für Mathe und
Deutsch laufen lassen, weil es die gemeinsame App betrifft):
- **Apostroph**: Das iPhone tippt „’“ statt „'“ (don’t). Die Prüfung in `fach.js` (`normText`) muss beide gleich
  behandeln, sonst wird „don’t“ als falsch gewertet. Das ist noch **nicht** eingebaut.
- **Autokorrektur und Großschreibung** des Handys: Die Textfelder schalten beides schon ab (`autocapitalize="none"`,
  `autocorrect="off"`).
- **Vorlesen**: Der Browser kann Text vorlesen (Sprachausgabe des Geräts). Ob das auf dem iPhone der Familie gut
  genug klingt und offline geht, ist **nicht ausprobiert**. Erst einen kleinen Versuch bauen und dem Auftraggeber zeigen.
- **Vokabeltraining**: deutsch → englisch und umgekehrt, mit mehreren richtigen Antworten je Wort. Vielleicht
  Karteikasten-Prinzip (falsche Wörter kommen öfter wieder); das Fehler-Training der App sammelt bisher Themen, keine
  einzelnen Wörter.
- **Zuordnen** (Paare verbinden) und **Wörter in die richtige Reihenfolge bringen** (Satzbau: he / plays / football)
  gibt es noch nicht als Aufgabenform.

## Lehren aus DeDax (bitte von Anfang an beachten)

1. **Jede Lücke braucht genau eine richtige Lösung, sonst alle richtigen Antworten zulassen.** (Rückmeldung des
   Auftraggebers: „Sie trinkt/trinken ein Glas Wasser“ war zweideutig.) Bei Auswahl-Lücken darf kein falsches Angebot
   ein anderes richtiges Wort oder einen anderen richtigen Satz ergeben. In Englisch besonders heikel: Kurz- und
   Langformen (isn’t / is not), britisch/amerikanisch, some/any, mehrere mögliche Zeitformen ohne Signalwort.
2. Jede neue Aufgabenart braucht eine passende Animation für „Lösung zu deiner Aufgabe“, sonst zeigt der Player
   etwas Unpassendes. Die Animation muss die richtige Antwort nennen (das prüft der Test).
3. Alle Sätze und Texte **selbst schreiben**. Fakten (Landeskunde, Wortherkunft) nachschlagen oder als unsicher kennzeichnen.
4. Vor dem Hochladen erzeugte Aufgaben massenhaft prüfen (Node: jede Aufgabenart einige hundert Mal erzeugen, auf
   `undefined`, doppelte Auswahl, leere Antworten prüfen) **und** in der App durchspielen (`tests/dedax.py` als Vorbild).
5. Bildschirmfotos ansehen, nicht nur Tests lesen: lange Wörter und Sätze laufen auf dem Handy (390 px) schnell über den Rand.
6. In SVG-Animationen: Elemente mit den Klassen `ex-b`/`ex-s` bekommen ihre Farbe über `style.fill`, nicht über das Attribut.

## Ton: so ist es entschieden und gebaut (12.11.2026)

- Die Sprachausgabe des Geräts (Browser) hat der Auftraggeber **abgelehnt**. Nicht wieder vorschlagen.
- Stattdessen **fertige Aufnahmen**: Kokoro v1.0 (frei, Apache-2.0), Stimme **`af_bella`** („Frau B“ der Hörprobe), Tempo 0.9.
  Die britischen Stimmen gefielen nicht (bei den Männern ein Nachklang nach „She“). Deshalb: **gesprochen amerikanisch,
  geschrieben britisch**.
- Jeder englische Satz, der vorgelesen werden soll, muss in einer **festen Liste** stehen und in `EnDax.audioTexte()`
  auftauchen. `python3 tests/endax_audio.py <Modell-Ordner>` erzeugt fehlende Dateien `web/englisch/audio/k5/<slug>.mp3`.
  Der Test `tests/endax.py` meldet fehlende Aufnahmen.
- In Aufgaben: `U.say(text)` liefert den Lautsprecher-Knopf. **Nicht** in die Aufgabenstellung setzen, wenn das Anhören
  die Lösung verrät (Lücken). Im Lösungsweg und in der Animation immer.
- **Seit v56 zwei Aussprachen zur Wahl** (Wunsch des Auftraggebers, 13.11.2026): Umschalter auf der Startseite von EnDax.
  Amerikanisch `af_bella` in `audio/us/`, britisch **`bm_fable`** („Mann 2“) in `audio/gb/`. **Seit v78 ist britisch die Voreinstellung** (Roberto 13.11.: das Schulbuch ist britisch).
  Jede neue Aufnahme muss es in beiden Ordnern geben (macht `endax_audio.py` von selbst, der Test prüft es).
- Offen: Aufnahmen in die Offline-Liste von `sw.js`? Bisher werden sie erst beim ersten Anhören gespeichert.
- Hinweis: Beim Zurückschreiben aus einer Claude-Sitzung bekommt jede MP3 automatisch einen eingebetteten Herkunftsvermerk
  (C2PA „Content Credentials“, rund 6 KB im ID3-Teil). Der Ton selbst bleibt gleich. Die Dateien im Ordner sind deshalb
  etwas größer als frisch erzeugte; das ist kein Fehler.

## Aufnahmen seit v59: Sammeldateien (ersetzt die Angaben oben zu einzelnen MP3)

- Ordner `web/englisch/audio/us/` (amerikanisch, `af_bella`) und `web/englisch/audio/gb/` (britisch, `bm_fable`).
  Darin `index.json` (`clips: { name: [paket, start, laenge] }`) und je Thema eine Datei `<thema>.bin`.
- Jeder Satz mit Lautsprecher muss in `EnDax.audioThemen()` beim passenden Thema stehen (`themen/klasse5.js`).
  Danach `python3 tests/endax_audio.py <Modell-Ordner>`: übernimmt vorhandene Aufnahmen aus den Paketen, erzeugt nur
  fehlende, packt neu. Ohne Modell-Ordner prüft und packt es nur. `tests/endax.py` meldet fehlende Aufnahmen.
- Neues Thema = zwei neue `.bin` und zwei geänderte `index.json`. Ändert sich ein altes Thema, ändert sich sein Paket.
- Die App lädt ein Paket vor, sobald Lautsprecher-Knöpfe zu sehen sind. Ohne Internet geht der Ton für alle Themen,
  die man mit Internet schon einmal geöffnet hat (bis zur nächsten App-Version, dann einmal neu laden).
