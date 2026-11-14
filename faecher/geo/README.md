# GeoDax (Geografie) – Startpunkt

Stand 14.11.2026: **Klasse 5 gebaut** (`lerndax-v103`): 54 Themen in 9 Bereichen, Entdecken (5), Knobeln zu allen Themen.

## Was feststeht

| | |
|---|---|
| Name | **GeoDax**, Fach-ID **`geografie`** (so steht es seit Anfang in `plattform/faecher.js`; nie mehr ändern) |
| Maskottchen | Dachs mit Globus-Mütze: `web/icons/geodax.svg` |
| Ordner | Code `web/geografie/`, Unterlagen `faecher/geo/`, Lernstand `geodax.v1`, Namensraum `window.GeoDax` |
| Zuerst | Klasse 5, Gymnasium Sachsen |
| Schulbuch | **TERRA Geographie 5, Ausgabe Sachsen Gymnasium** (Klett, 2019), ISBN 978-3-12-104320-0 |
| Lehrplan | Fassung **2019** (für Geographie gibt es keine Fassung 2025; geprüft in den Landeslisten 2025/26 und 2026/27) |

## Unterlagen

- `lehrplan/sachsen-gymnasium.md`: Lehrplan Klasse 5 am Originaltext, mit eigenen Worten
- `lehrplan/schulbuch-abgleich.md`: Kapitel des Buchs ↔ Lernbereiche, Prüfung der Buchfotos
- `themenplan.md`: 54 Themen in 9 Bereichen (= Kapitel des Buchs) mit Beispiel-Aufgaben (von Roberto bestätigt)
- `fakten.md`: alle Zahlen und Namen mit Quelle

**Fotos des Schulbuchs** liegen nur lokal in `notizen/schulbuch-geo/` (nicht auf GitHub). Ab Foto 16 gilt:
Foto-Nummer × 2 − 12 = linke Seite der Doppelseite. Es fehlen S. 4–5 und S. 18–19 (Roberto reicht sie nach).

## Bauweise (`web/geografie/`)

- `index.html`: das Fach beschreibt sich (`LERNDAX_FACH`), die App ist `plattform/fach.js`.
- Gemeinsame Teile aus `web/plattform/`: `bausteine.js` (auswahl, tippen, ordnen, sortiere, passtNicht, erkennen, baue,
  fotoBild) und `erklaer.js` (Merkzettel, Schritte, Fächer, Bild). BioDax und GeDax nutzen sie ebenfalls.
- `karten/daten.js`: Kartendaten aus **Natural Earth** (gemeinfrei), erzeugt mit `tests/geo_karten.py`.
  `karten/karten.js`: zeichnet daraus Welt (Robinson), Europa, Deutschland, Sachsen; Flächen und Orte mit Nummern zum
  Antippen (`data-wahl`: ein Tipp auf die Karte wählt die Antwort), Flüsse, Gradnetz, Ozeane, Maßstabsleiste.
- `themen/basis.js`: Kartenaufgaben (Fläche antippen/benennen, Ort antippen/benennen, Fluss benennen, Himmelsrichtung),
  Maßstab rechnen, Diagramme lesen, Ortslisten. `themen/zeichnungen.js`: Schemazeichnungen (Tag/Nacht, Jahreszeiten,
  Steigungsregen, Talformen). `themen/klasse5-1.js` bis `-3.js`: die Themen, in `-3.js` auch die Themenliste mit
  Buchseiten. `themen/fotos.js`: 49 freie Fotos von Wikimedia Commons (Fotograf, Lizenz). `themen/klasse5-knobel.js`.
- `erklaerungen/klasse5.js`: eigene Animationen (Maßstab, Tag und Nacht, Jahreszeiten, Gezeiten, Steigungsregen, Talformen),
  sonst Merkzettel. `erklaerungen/entdecken.js`: Jahreszeiten, Grönland schrumpft, Erde als Fußball, zwei Flutberge,
  ein Fluss gräbt ein Tal.
- `bildnachweis.html`: alle Fotos mit Fotograf, Lizenz und Link; Hinweis auf Natural Earth.

**Fotos aussuchen:** im eingebauten Browser auf commons.wikimedia.org, Suche über die Commons-API (`fetch` mit
`origin=*`), bevorzugt „Quality images“, Vorschaubilder als Bildtafel angesehen. Neue Fotos in `themen/fotos.js`
eintragen und in `bildnachweis.html` ergänzen.

## Regeln (wie in den anderen Fächern)

- Genau der sächsische Lehrplan, alles darüber hinaus in „Entdecken“.
- Keine Namen von Kind, Schule oder Lehrkräften im Code (Repository ist öffentlich).
- Nichts aus dem Schulbuch abschreiben, keine Bilder aus dem Buch. Seitenhinweise und die Fachwörter des Buchs: ja.
- Erklärungen: keine bloße Wiederholung der Frage; Merkzettel oder eine Animation, die etwas Neues zeigt.

## Tests

`node tests/wissen_gen.js web/geografie 200` (schnell, ohne Browser), `python3 tests/geodax.py 2` (im Browser).

## Offen

- Fotos S. 4–5 und S. 18–19 des Buchs (Roberto reicht nach), dann Seitenhinweise prüfen.
- Welches Kapitel gerade dran ist und welcher Wahlbereich (Stadt, Dorf oder Natur) gewählt wird.
- Für „Sohlental“ und „Marsch“ gab es kein gutes freies Foto; diese beiden werden mit Zeichnung bzw. Text geübt.
