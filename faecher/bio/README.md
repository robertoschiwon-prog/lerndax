# BioDax (Biologie) – Startpunkt

Stand 14.11.2026: **Lehrplan ausgewertet** (`lehrplan/sachsen-gymnasium.md`), **mit dem Buch abgeglichen** (`lehrplan/schulbuch-abgleich.md`),
**Themenplan liegt Roberto vor** (`themenplan.md`, 48 Themen in 7 Bereichen = Kapitel des Buchs). Noch nichts gebaut. Im Unterricht: Lurche.
Fotos des ganzen Buchs liegen lokal in `notizen/schulbuch-bio/` (HEIC, Foto Nummer = Seite + 2).
Vorher lesen: `STAND.md` (Abschnitt 0 und 6), `README.md`, `faecher/README.md`, `faecher/geschichte/README.md` (Vorbild für die Bauweise).

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
3. ✅ (wartet auf Antwort) Themenplan mit Beispiel-Aufgaben vorlegen (`themenplan.md`), Fragen einzeln stellen.
4. Alles bauen (Bauweise wie GeDax: `baue(id, { F, T, O, S, A, extra })`), Entdecken, Knobeln, Tests.
5. `faecher.js` auf `status: 'fertig'`, Version, GitHub, `STAND.md`, OneDrive, Übergabe.

## Mit Roberto zu klären (einzeln fragen)

1. Fotos vom Inhaltsverzeichnis; welches Kapitel ist gerade dran, steht eine Arbeit an?
2. Welche sechs Arten je Tiergruppe behandelt die Schule (Buch, Hefter)?
3. Fortpflanzung des Menschen (Pubertät) und Schutz vor Missbrauch: in die App oder nicht?
4. Welcher Wahlbereich (Winter, Saurier, Tierhaltung)?
