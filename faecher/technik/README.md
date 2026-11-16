# TecDax (Technik/Computer) – Startpunkt

Stand 16.11.2026: **Klasse 5/6 gebaut** (`lerndax-v118`): 53 Themen in 8 Bereichen, Entdecken (5), Knobeln zu allen Themen.

## Was feststeht

| | |
|---|---|
| Name | **TecDax**, Fach-ID **`technik`** (steht so in `plattform/faecher.js`; nie mehr ändern) |
| Kürzel, Farbe | TC (ab Klasse 7 Informatik), `#5b6378` |
| Maskottchen | Dachs mit Headset: `web/icons/tecdax.svg` |
| Ordner | Code `web/technik/`, Unterlagen `faecher/technik/`, Lernstand `tecdax.v1`, Namensraum `window.TecDax` |
| Lehrplan | Technik/Computer Gymnasium Sachsen, Fassung **2019**, **Klassenstufen 5/6 gemeinsam** (gilt auch 2026/27) |
| Schulbuch | **keins** (Roberto, 16.11.2026). Reihenfolge und Begriffe nach dem Lehrplan, Fakten mit Quellen in `fakten.md` |

Weil der Lehrplan Klasse 5 und 6 nicht trennt (1 Stunde pro Woche in jeder Klasse), enthält TecDax den ganzen Stoff 5/6.
Die Themen stehen unter Klasse 5 (die App kennt bisher nur `grades[5]`). Ab Klasse 7 heißt das Fach Informatik (eigener Lehrplan 2022).

## Unterlagen

- `lehrplan/sachsen-gymnasium.md`: Lehrplan 5/6 am Originaltext, mit eigenen Worten
- `themenplan.md`: 53 Themen in 8 Bereichen (von Roberto bestätigt), Aufgabenformen, Erklärungen, Entdecken
- `fakten.md`: alle Zahlen, Regeln und Namen mit Quelle

## Bauweise (`web/technik/`)

- `index.html`: das Fach beschreibt sich (`LERNDAX_FACH`), die App ist `plattform/fach.js`.
- Gemeinsame Teile aus `web/plattform/`: `bausteine.js` (auswahl, tippen, ordnen, sortiere, passtNicht, aussage, beschriften, erkennen, baue,
  fotoBild) und `erklaer.js` (Merkzettel, Schritte, Fächer, Bild). Münzen, Kronen, Laden und Spielhalle kommen automatisch dazu.
- `themen/basis.js`: erzeugte Aufgaben (Zahnräder, Riemen, Ordnerbaum und Pfad, Dateiarten, E-Mail- und Internetadresse, Stahlmaßstab,
  Bemaßung, Ansichten, Stückliste, Kostenaufstellung, Morsen).
- `themen/zeichnungen.js`: eigene Zeichnungen. Schemata (Fenster, Browser, E-Mail, richtig sitzen, Bohrmaschine und Fahrrad mit Nummern,
  Getriebe, Sinnbilder, Linienarten, Bemaßung, Sicherheitszeichen, Abfall-Stufen) und erzeugte Bilder in `D.zeichne`
  (Zahnräder mit ineinandergreifenden Zähnen: `D.radWinkel`, Riemen, Kurbel, Nocken, Zahnstange, Ordnerbaum, bemaßte Platte,
  Würfelkörper und Ansichten, Stahlmaßstab, Tabellen). Geräte und Werkzeuge sind als einfache Ersatzzeichnung da.
- `themen/fotos.js`: freie Fotos von Wikimedia Commons, die über die Ersatzzeichnung gleichen Namens gelegt werden (ohne Netz bleibt die Zeichnung).
  `bildnachweis.html`: Fotograf, Lizenz, Link.
- `themen/klasse5-1.js` bis `-3.js`: die Themen, in `-3.js` auch die Themenliste. `themen/klasse5-knobel.js`: Knobel-Aufgaben.
- `erklaerungen/klasse5.js`: Animationen (zahnrad, getriebe, riemen, eva, baum, mail, url, lineal, bemassung, ansicht, tabelle, linien, morse).
  `erklaerungen/entdecken.js`: Zählen mit 0 und 1, Bild aus Zahlen, Fahrradgänge, Morsen, Suchmaschine.
- `symbole.js`: Themen-Symbole.

## Regeln (wie in den anderen Fächern)

- Genau der sächsische Lehrplan, alles darüber hinaus in „Entdecken“.
- Keine Namen von Kind, Schule oder Lehrkräften im Code (Repository ist öffentlich). Beispieladressen enden auf `-beispiel.de`.
- Erklärungen: keine bloße Wiederholung der Frage; Merkzettel oder eine Animation, die etwas Neues zeigt.
- Jede Aufgabe hat genau eine richtige Lösung.

## Tests

`node tests/wissen_gen.js web/technik 300` (schnell, ohne Browser), `python3 tests/tecdax.py 2` (im Browser, alle Themen, Lösungs-Animationen,
freie Erklärungen, Entdecken), `python3 tests/tecdax_knobel.py` (Knobel-Aufgaben).

## Offen

- Was gerade im Unterricht dran ist (Roberto wusste es noch nicht); Rückmeldung von Bruno.
- Welches Werkstück die Klasse fertigt (Lehrplan-Beispiele: Leuchter, Schutzbacken, Kissenhülle, Zinnfigur; alle vier kommen vor).
