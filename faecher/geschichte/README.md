# GeDax (Geschichte) – Startpunkt

Stand 13.11.2026 (`lerndax-v86`): **noch nichts gebaut.** Diese Datei sagt, was feststeht, was zu klären ist und wie man anfängt.
Vorher lesen: `STAND.md` (Abschnitt 0 und 6), `README.md`, `faecher/README.md`. Vorbilder: DeDax (`faecher/deutsch/README.md`,
`web/deutsch/`) für Wissens- und Textaufgaben, EnDax (`web/englisch/`) für Bilder in Aufgaben und für „Bereiche = Kapitel des Buchs“.

## Was feststeht

| | |
|---|---|
| Name | **GeDax** (Kürzel „Ge“ + Dax), Fach-ID **`geschichte`** (nie mehr ändern) |
| Maskottchen | Dachs mit Pharaonen-Kopftuch: `web/icons/gedax.svg` (liegt bereit) |
| Farbe | `#a0522d` (Eintrag in `web/plattform/faecher.js`, bisher `status: 'geplant'`, Klassen 5–10) |
| Ordner | `web/geschichte/` (anzulegen), Lernstand unter eigenem Schlüssel, Vorschlag `gedax.v1`, Namensraum `window.GeDax` |
| Zuerst | Klasse 5, Gymnasium Sachsen |
| Schulbuch | **ANNO 1, Ausgabe 2019 für Gymnasien in Sachsen** (Westermann), ISBN 978-3-14-115406-1 (Foto der Rückseite, 13.11.2026). Inhaltsverzeichnis noch nicht bekannt. |
| Leitidee | verstehen statt pauken; anschauliche, animierte Erklärungen; nach jeder Antwort die Lösung; „Entdecken“ zum Neugierigwerden |
| Datenbank | keine Änderung geplant; vorher prüfen, ob `subject = 'geschichte'` im Schema erlaubt ist (`supabase/schema.sql`). Wenn nicht: Roberto fragen, nichts am Familienkalender ändern. |

Regeln wie bei den anderen Fächern: genau der sächsische Lehrplan, alles darüber hinaus in „Entdecken“; keine Namen von Schule,
Lehrkraft oder Kind im öffentlichen Code; nichts aus dem Schulbuch abschreiben (auch keine Bilder, Karten oder Quellentexte).
**Fakten immer nachschlagen** (Jahreszahlen, Namen, Karten), nicht aus dem Gedächtnis.

## Vorgehen (so hat es bei Mathe, Deutsch und Englisch funktioniert)

1. **Lehrplan Geschichte Gymnasium Sachsen, Klasse 5, am Originaltext auswerten** (https://www.schulportal.sachsen.de/lplandb/)
   und als `faecher/geschichte/lehrplan/sachsen-gymnasium.md` ablegen: Lernbereiche, Inhalte, was am Bildschirm übbar ist.
2. **Mit dem Schulbuch abgleichen**: Roberto um Fotos des Inhaltsverzeichnisses von ANNO 1 bitten (ging bei Englisch und Deutsch
   in wenigen Minuten) und fragen, welches Kapitel gerade dran ist. Ergebnis als `lehrplan/schulbuch-abgleich.md`.
   Bewährt: die Bereiche der App so nennen wie die Kapitel des Buchs.
3. **Themenplan vorlegen** (`themenplan.md`): Bereiche und Themen, je Thema 2–3 Beispiel-Aufgaben. Roberto entscheidet über
   Optionen, **Fragen einzeln stellen**.
4. **Erst ein Thema ganz fertig bauen** (Aufgaben, Tipp, Lösungsweg, Erklärung, Symbol, Test) und zeigen, dann die übrigen.
5. Danach „Entdecken“ und Knobel-Aufgaben. Zum Schluss `faecher.js` auf `status: 'fertig'`.
6. Tests, Version, GitHub, `STAND.md`, OneDrive, Übergabe wie in `STAND.md` Abschnitt 0.

## Ideen für Aufgabenformen (alle gibt es in der Plattform schon)

- **Zeitstrahl**: Ereignisse in die richtige Reihenfolge bringen (`order`), „vor oder nach Christus“, Jahrhundert bestimmen,
  Abstände ausrechnen (wie lange ist … her?). Gut animierbar.
- **Begriffe** zuordnen (Auswahl), Lückentexte (Felder), „Was passt nicht dazu?“
- **Bilder** (selbst gezeichnete SVG im Feld `figure`): Werkzeuge, Pyramide, Karte in einfacher Form, wie `ortBild` und `kBild`.
- **Quellen lesen**: kurzer, selbst geschriebener Text mit Fragen (wie `e5-a-lesen` in EnDax, `d5-sachtext` in DeDax);
  Unterschied Quelle/Darstellung, Sachquelle/Bildquelle/Textquelle.
- Erklärungen: wo möglich der einfache Baukasten wie in DeDax (`thema(id, titel, viewBox)` mit Bild-Modi), dazu ein neuer
  Bild-Modus „Zeitstrahl“.

## Was mit Roberto zu klären ist (einzeln fragen)

1. Fotos vom Inhaltsverzeichnis von ANNO 1; welches Kapitel ist gerade dran, steht eine Arbeit an?
2. Reihenfolge und Umfang des Themenplans (nach dem Vorschlag).
3. Soll etwas vorgelesen werden? (Vermutlich nein: Deutsch braucht keinen Ton. Die Sprachausgabe des Geräts ist abgelehnt.)
