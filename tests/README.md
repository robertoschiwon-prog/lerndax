# Tests

Automatische Prüfungen, die Claude bei jeder Änderung laufen lässt. Sie öffnen die App in einem
unsichtbaren Chrome-Browser (Playwright), klicken sich durch und melden Fehler.

Voraussetzung: Python 3 mit `pip install playwright` und `playwright install chromium`
(oder ein installiertes Google Chrome unter `/usr/bin/google-chrome`), für `gen-test.js` Node.js.

| Test | Prüft |
|---|---|
| `node tests/gen-test.js $PWD/web/mathe/generatoren/klasse5.js` | Alle Aufgabengeneratoren je 3000-mal: keine Fehler, kein NaN/undefined, Antworten gültig |
| `python3 tests/ui2.py` | Alle 22 Themen durchspielen und richtig beantworten (352 Aufgaben müssen als richtig erkannt werden) |
| `python3 tests/ex.py` | Alle Erklär-Animationen abspielen (Schnelldurchlauf) |
| `python3 tests/pause.py` | Pause- und Langsam-Modus im Erklär-Player |
| `python3 tests/prim.py` | Primzahlen: Beispiel vor der Aufgabe, Lösung als Animation danach |
| `python3 tests/pack2.py` | Entdecken-Bereich: alle Staunen-Momente laufen durch |
| `python3 tests/two.py` | Zwei Animationen nacheinander (kein Überlappen) |
| `python3 tests/sync_test.py` | Synchronisation zweier Geräte gegen eine Schein-Datenbank (`mock_supabase.js`), inkl. Zurücksetzen und Avatar |
| `python3 tests/hub.py` | LernDax-Startseite, Sprünge zu #eltern und #entdecken |
| `python3 tests/ava_hub.py` | Avatar-Auswahl: öffnet sich beim ersten Besuch genau einmal |

Bildschirmfotos landen in `tests/shots/` (nicht auf GitHub). Meldungen wie
`ERR_TUNNEL_CONNECTION_FAILED` bedeuten nur, dass Schriftarten aus dem Internet nicht geladen
werden konnten, das ist kein Fehler der App.
