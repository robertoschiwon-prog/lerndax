# Tests

Automatische Prüfungen, die Claude bei jeder Änderung laufen lässt. Sie öffnen die App in einem
unsichtbaren Chrome-Browser (Playwright), klicken sich durch und melden Fehler.

Voraussetzung: Python 3 mit `pip install playwright` und `playwright install chromium`
(oder ein installiertes Google Chrome unter `/usr/bin/google-chrome`), für `gen-test.js` Node.js.

| Test | Prüft |
|---|---|
| `node tests/gen-test.js $PWD/web/mathe/generatoren/klasse5.js` | Alle Aufgabengeneratoren je 3000-mal: keine Fehler, kein NaN/undefined, Antworten gültig |
| `python3 tests/ui2.py` | Alle 25 Themen durchspielen und richtig beantworten (400 Aufgaben müssen als richtig erkannt werden) |
| `python3 tests/ex.py` | Alle Erklär-Animationen abspielen (Schnelldurchlauf) |
| `python3 tests/pause.py` | Pause- und Langsam-Modus im Erklär-Player |
| `python3 tests/ex_aufgabe.py` | Erklärungen passend zur Aufgabe (Vorrangregeln, Potenzen, Division, Teilbarkeit): „Erklärung“ vorher mit ähnlichem Beispiel, „Lösung als Animation“ nachher mit genau der Aufgabe |
| `python3 tests/loesung.py` | Je Thema 3 Aufgaben falsch beantworten und „Lösung als Animation“ abspielen: läuft zu Ende, Untertitel „Lösung zu deiner Aufgabe“, das Ergebnis der Aufgabe kommt in den Texten vor (dauert einige Minuten; `python3 tests/loesung.py 10` für 10 je Thema) |
| `python3 tests/prim.py` | Primzahlen: Beispiel vor der Aufgabe, Lösung als Animation danach |
| `python3 tests/pack2.py` | Entdecken-Bereich: alle Staunen-Momente laufen durch |
| `python3 tests/two.py` | Zwei Animationen nacheinander (kein Überlappen) |
| `python3 tests/sync_test.py` | Synchronisation zweier Geräte gegen eine Schein-Datenbank (`mock_supabase.js`), inkl. Zurücksetzen, Avatar und Trainingsseite |
| `python3 tests/training.py` | Trainingsseite für eine Klassenarbeit (`mathe/?t=…`): nur Arbeitsthemen in den Runden, Rückweg ins Training, Fit-Anzeige, unbekanntes Training, Fortschritt im allgemeinen Lernstand |
| `python3 tests/hub.py` | LernDax-Startseite, Sprünge zu #eltern und #entdecken |
| `python3 tests/ava_hub.py` | Avatar-Auswahl: öffnet sich beim ersten Besuch genau einmal |

Bildschirmfotos landen in `tests/shots/` (nicht auf GitHub). Meldungen wie
`ERR_TUNNEL_CONNECTION_FAILED` bedeuten nur, dass Schriftarten aus dem Internet nicht geladen
werden konnten, das ist kein Fehler der App.

## Design-Prüfung

`python3 tests/design_audit.py` geht alle Ansichten auf vier Bildschirmgrößen durch (320, 390, 768, 1280 px) und meldet
Überlauf über den Rand, abgeschnittenen Text, schwachen Kontrast, zu kleine Schrift und zu kleine Tippflächen.
Keine Ausgabe außer den Sternen (Deko), dem orangen „Dax“ im Logo und den Klassen-Feldern heißt: alles in Ordnung.
Bildschirmfotos landen in `tests/shots/audit/`.

Neue Themen prüfen: `python3 tests/loesung.py 12 k5-ueberschlag,k5-schriftlich,k5-dezrunden,k5-gemischt,k5-symmetrie,k5-netze,k5-fermi`
- `knobel.py [Runden]`: Knobel-Stufe. Prüft: Balken erscheint erst ab zwei Sternen, 5 Aufgaben je Runde, jede richtige Antwort wird angenommen, Sterne-Statistik bleibt unverändert, Zähler `S.knobel` stimmt, Knopf „Jetzt knobeln“ nach guter Runde.
- `bild_audit.py [Aufgaben je Thema] [Themen]`: Bilder aller Aufgaben (normal und Knobeln). Meldet Beschriftungen, die aus dem Bild ragen, sich überdecken oder von einer farbigen Linie durchkreuzt werden. `loesung.py` prüft dasselbe „ragt aus dem Bild“ für die Animationen.
- `dedax.py [Runden]`: **DeDax (Deutsch).** Spielt jedes Thema in der App durch: jede richtige Antwort wird angenommen (Auswahl, Wort eintippen, Satz mit Lücken, Wörter antippen), falsche Antworten führen zur Lösung, die Lösungs-Animation läuft zu Ende, nennt die Antwort und kein Text ragt aus dem Bild.

Seit `lerndax-v44` steckt die App in `web/plattform/fach.js`; die Mathe-Tests laufen unverändert über `web/mathe/index.html`.
- `eltern.py`: **Elternübersicht auf der Startseite.** Legt einen Lernstand für Mathe und Deutsch an und prüft: beide Fächer mit richtigen Zahlen, der Knopf führt in die Elternansicht des Fachs, „Zurück“ führt zur Startseite. Startet dafür selbst einen kleinen Webserver.
- `dedax_knobel.py [Runden]`: **Knobel-Aufgaben in DeDax.** Balken erst ab zwei Sternen; jede Aufgabenart jedes Themas wird als Knobel-Runde gespielt (richtige Antwort angenommen, falsche führt zur Lösung, nichts ragt über den Rand), Sterne-Statistik bleibt unverändert, Zähler stimmt. Bildschirmfotos in `tests/shots/knobel/`.

## EnDax (Englisch)

- `endax.py [Runden]`: spielt jedes Englisch-Thema in der App durch (wie `dedax.py`). Braucht den Chrome-Schalter `--allow-file-access-from-files` (ist im Test gesetzt). Zusätzlich: tippt mit dem geraden
  Apostroph, prüft, dass es zu jedem Lautsprecher-Knopf die Aufnahme in beiden Aussprachen gibt (in den Sammeldateien), stellt den Umschalter „Aussprache“
  auf britisch und tippt einen Knopf an.
- `endax_audio.py [Modell-Ordner] [--alle]`: erzeugt fehlende Aufnahmen (Kokoro: amerikanisch `af_bella`, britisch `bm_fable`)
  und packt sie in Sammeldateien `web/englisch/audio/us/` und `gb/` (`index.json` und je Thema `<thema>.bin`).
  Kein Test, sondern das Werkzeug dazu; Einrichtung steht im Kopf der Datei.
- `endax_knobel.py`: EnDax-Knobel-Aufgaben, jede Variante jedes Themas eine Runde (wie `dedax_knobel.py`). Alltag-Themen haben keine Knobel-Aufgaben.
