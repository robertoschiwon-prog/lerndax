# GeoDax (Geografie) – Startpunkt

Stand 14.11.2026: **Planung**, noch nichts gebaut. Themenplan liegt Roberto zur Durchsicht vor.

## Was feststeht

| | |
|---|---|
| Name | **GeoDax**, Fach-ID **`geo`** (nie mehr ändern) |
| Maskottchen | Dachs mit Globus-Mütze: `web/icons/geodax.svg` (liegt bereit) |
| Ordner | `web/geo/` (anzulegen), Lernstand `geodax.v1`, Namensraum `window.GeoDax` |
| Zuerst | Klasse 5, Gymnasium Sachsen |
| Schulbuch | **TERRA Geographie 5, Ausgabe Sachsen Gymnasium** (Klett, 2019), ISBN 978-3-12-104320-0 |
| Lehrplan | Fassung **2019** (für Geographie gibt es keine Fassung 2025; geprüft in den Landeslisten 2025/26 und 2026/27) |

## Unterlagen

- `lehrplan/sachsen-gymnasium.md`: Lehrplan Klasse 5 am Originaltext, mit eigenen Worten
- `lehrplan/schulbuch-abgleich.md`: Kapitel des Buchs ↔ Lernbereiche, Prüfung der Buchfotos
- `themenplan.md`: 54 Themen in 9 Bereichen (= Kapitel des Buchs) mit Beispiel-Aufgaben
- `fakten.md`: alle Zahlen und Namen mit Quelle

**Fotos des Schulbuchs** liegen nur lokal in `notizen/schulbuch-geo/` (nicht auf GitHub). Ab Foto 16 gilt:
Foto-Nummer × 2 − 12 = linke Seite der Doppelseite. Es fehlen S. 4–5 und S. 18–19.

## Regeln (wie in den anderen Fächern)

- Genau der sächsische Lehrplan, alles darüber hinaus in „Entdecken“.
- Keine Namen von Kind, Schule oder Lehrkräften im Code (Repository ist öffentlich).
- Nichts aus dem Schulbuch abschreiben, keine Bilder aus dem Buch. Seitenhinweise und die Fachwörter des Buchs: ja.
- **Bilder:** von Anfang an freie Fotos und Karten von Wikimedia Commons, mit Fotograf und Lizenz, ausgesucht und angesehen
  im eingebauten Browser; Bildnachweis-Seite `web/geo/bildnachweis.html` (wie BioDax).
- **Erklärungen:** keine bloße Wiederholung der Frage; Merkzettel oder eine Animation, die etwas Neues zeigt.
- **Gemeinsames nach `web/plattform/`:** Bausteine aus BioDax/GeDax (`baue`, `auswahl`, `fotoBild` …) dorthin verlegen,
  GeoDax nutzt sie von dort.

## Vorgehen

1. ✅ Lehrplan am Originaltext lesen, mit dem Buch abgleichen.
2. ✅ Themenplan mit Fragen je Thema, Fakten mit Quellen.
3. ⏳ Roberto zeigen, Fragen einzeln stellen (Karten, fehlende Fotos, aktuelles Kapitel, Umfang).
4. Bauen: Themen mit „📖 Buch S. …“, Entdecken, Knobeln, Tests; `faecher.js` auf `status: 'fertig'`.
