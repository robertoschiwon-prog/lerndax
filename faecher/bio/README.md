# BioDax (Biologie) – Startpunkt

Stand 14.11.2026 (`lerndax-v89`): **Klasse 5 gebaut und live** (50 Themen in 7 Bereichen = Kapitel von LINDER Biologie 5,
Entdecken mit 5 Staunen-Momenten, Knobel-Aufgaben zu allen Themen). Lehrplan: `lehrplan/sachsen-gymnasium.md` (Fassung 2025),
Buchabgleich: `lehrplan/schulbuch-abgleich.md`, Themenplan: `themenplan.md`, geprüfte Fakten mit Quellen: `fakten.md`.
Tests: `tests/biodax.py`, `tests/biodax_knobel.py`. Im Unterricht am 13.11.2026: Lurche.

**Bauweise (wie GeDax):** `web/bio/themen/basis.js` enthält die Hilfen, alle selbst gezeichneten Bilder (`D.bilder`, zum Teil
mit Nummern zum Beschriften) und die Bausteine `baue(id, { F, T, O, S, A, B, E, extra })`: Auswahlfragen, Lücken, Reihenfolgen,
Sortieren in Fächer, „Was passt nicht?“, Aussagen, **B = Bild beschriften**, **E = Tier am Bild erkennen**.
Die Themen stehen in `klasse5-1.js` (Merkmale des Lebens, Fische, Lurche), `klasse5-2.js` (Kriechtiere, Vögel) und
`klasse5-3.js` (Säugetiere, Vergleich, am Ende `D.grades[5]`), Knobeln in `klasse5-knobel.js`.
Eigene Generatoren: Bestimmungsschlüssel (`b5-lurch-bestimmen`), Entwicklungsstufen des Frosches (`b5-lurch-entw`),
Schnabel und Nahrung, Stammform der Haustiere, Merkmal-Rätsel der fünf Klassen.
Animationen (`erklaerungen/klasse5.js`): Bild-Modi `karte` (mit Bild), `reihe` (auch mit kleinen Bildern), `faecher`.
Schnelltest ohne Browser: alle Generatoren vielfach aufrufen (wie bei GeDax; 166.500 Aufgaben ohne Fehler).

**Fotos des Schulbuchs** liegen nur lokal in `notizen/schulbuch-bio/` (nicht auf GitHub). Foto Nummer = Buchseite + 2.

**Offen (Roberto fragen):**
1. Erledigt (v89): Roberto hat am 14.11.2026 zugestimmt, das Thema **„Mein Körper gehört mir“** (`b5-schutz`, Schutz vor
   Missbrauch: Nein sagen, weggehen, einer Vertrauensperson erzählen, Nummer gegen Kummer 116 111) steht bei den Säugetieren.
   Roberto sollte dieses Thema und „Pubertät und Fortpflanzung“ selbst einmal durchspielen.
2. Welche Arten behandelt die Schule genau (Hefter)? BioDax nimmt die Arten aus dem Buch.
3. Durchsicht durch Roberto („ich schaue später drüber“), Rückmeldung von Bruno, besonders zu den gezeichneten Bildern.
4. Gemeinsame Bausteine (`baue`, `auswahl` …) stehen jetzt in GeDax und BioDax doppelt. Bei Gelegenheit nach
   `web/plattform/` verlegen (Regel: Gemeinsames nicht kopieren).

Der Rest dieser Datei ist der Startpunkt von vor dem Bau.

## Was feststeht

| | |
|---|---|
| Name | **BioDax**, Fach-ID **`bio`** (nie mehr ändern) |
| Maskottchen | Dachs mit Fliegenpilz-Hut: `web/icons/biodax.svg` (liegt bereit) |
| Farbe | `#4caf50` (Eintrag in `web/plattform/faecher.js`, bisher `status: 'geplant'`, Klassen 5–10) |
| Ordner | `web/bio/` (anzulegen), Lernstand `biodax.v1`, Namensraum `window.BioDax` |
| Zuerst | Klasse 5, Gymnasium Sachsen |
| Schulbuch | **LINDER Biologie SI 5, Ausgabe 2020 für Sachsen** (Westermann), ISBN 978-3-14-153000-1. Inhaltsverzeichnis noch nicht bekannt. |
| Lehrplan | Fassung **2025** (gilt für Klasse 5–10 seit 1.8.2025). Das Buch ist älter als diese Fassung. |

Regeln wie bei den anderen Fächern: genau der sächsische Lehrplan, alles darüber hinaus in „Entdecken“; keine Namen von Schule,
Lehrkraft oder Kind im öffentlichen Code; nichts aus dem Schulbuch abschreiben (auch keine Bilder); Bilder selbst zeichnen.
**Fakten immer nachschlagen** (Zahlen, Namen, Tierarten) und mit Quelle in `fakten.md` festhalten.

## Vorgehen

1. ✅ Lehrplan am Originaltext auswerten.
2. ✅ Mit dem Schulbuch abgleichen: Fotos vom Inhaltsverzeichnis, aktuelles Kapitel erfragen → `lehrplan/schulbuch-abgleich.md`.
3. ✅ Themenplan mit Beispiel-Aufgaben vorlegen (`themenplan.md`), Fragen einzeln stellen.
4. ✅ Alles bauen (Bauweise wie GeDax: `baue(id, { F, T, O, S, A, extra })`), Entdecken, Knobeln, Tests.
5. ✅ `faecher.js` auf `status: 'fertig'`, Version, GitHub, `STAND.md`, OneDrive, Übergabe.

## Mit Roberto zu klären (einzeln fragen)

1. Fotos vom Inhaltsverzeichnis; welches Kapitel ist gerade dran, steht eine Arbeit an?
2. Welche sechs Arten je Tiergruppe behandelt die Schule (Buch, Hefter)?
3. Fortpflanzung des Menschen (Pubertät): **ja** (Roberto, 14.11.2026). Schutz vor Missbrauch: **ja, als kurzes Thema** (14.11.2026).
4. Welcher Wahlbereich (Winter, Saurier, Tierhaltung)?

## Nähe zum Schulbuch (seit v90)
- Jedes Thema nennt die Buchseiten (`buch: 'S. …'` in `D.grades[5]`); die App zeigt „📖 Buch S. …“.
- Beschriftete Bilder nutzen die Wörter aus dem Buch (Feder S. 94, Skelett S. 153, Fisch S. 21, Ei S. 107).
- Bilder aus dem Buch werden nicht übernommen (App und Code sind öffentlich); alle Bilder sind selbst gezeichnet.
