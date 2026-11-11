# LernDax 🦡

**Verstehen statt pauken.** LernDax ist eine Lern-App für Schulkinder: üben, verstehen und
entdecken, Klasse 1 bis 10, nach dem Lehrplan Sachsen (Gymnasium).

Der Name zwinkert LernSax zu, der Schulplattform aller sächsischen Schulen. „Dax“ klingt wie
**Dachs**, unser Maskottchen: fleißig, gräbt sich tief hinein und gibt nicht auf.

Online: **https://robertoschiwon-prog.github.io/lerndax/**

> Neu hier? Zuerst **`STAND.md`** lesen: Dort steht alles, was bisher besprochen, entschieden und gebaut wurde.

---

## Projektsteckbrief

**Ziel**
Kinder sollen Schulstoff *verstehen*, nicht nur auswendig lernen. Erklärungen werden gezeigt
statt beschrieben (Animationen im Stil von 3Blue1Brown), und kleine Staunen-Momente machen
neugierig auf mehr.

**Für wen**
Zuerst ein Kind in Klasse 5 (Gymnasium, Sachsen), mit ihm bis Klasse 10. Später eventuell
Klassenkameraden (Trainingsseiten per Link), irgendwann vielleicht öffentlich.

**Grundsätze**
1. **Lehrplan als Gerüst:** Themen und Reihenfolge nach dem sächsischen Lehrplan,
   abgeglichen mit dem Schulbuch.
2. **Zeigen statt erklären:** Wo es geht, gibt es eine Animation, mit Pause, Langsam-Modus und
   Reglern zum Ausprobieren.
3. **Lösung zur rechten Zeit:** Vor dem Antworten ein ähnliches Beispiel, nach dem Antworten
   die Lösung genau dieser Aufgabe.
4. **Fehler sind Lernchancen:** Erst ein Tipp, dann der Lösungsweg. Fehler kommen im
   Fehler-Training wieder.
5. **Unendlich viele Aufgaben:** Aufgaben werden erzeugt, nicht abgetippt.
6. **Datensparsam & sicher:** Familienkonto, Kind nur mit Vornamen, keine Werbung, kein Tracking.
   Jede Familie sieht nur ihre eigenen Daten.
7. **Überall nutzbar:** Handy, Tablet, Computer, als App installierbar, auch offline.

**Was gehört dazu, was nicht?**
Dazu gehört alles, was beim Verstehen und Üben von Schulstoff hilft.
Nicht dazu gehören Noten-Verwaltung, Chat und soziale Funktionen.

---

## Aufbau

```
LernDax
 ├─ Plattform: gemeinsam für alle Fächer
 │   Familienkonto, Kind-Profile, Eltern-PIN, Synchronisation,
 │   Startseite, Serie 🔥, Erklär-Player, App-Icon, Offline-Betrieb
 │
 ├─ ➗ Mathelix   Mathe   ✅ Klasse 5
 ├─ 📖 Deutsch           später
 └─ 🇬🇧 Englisch          später
```

**Regel:** Was jedes Fach braucht, gehört zur Plattform. Ins Fach kommt nur der Inhalt
(Lehrplan, Aufgabengeneratoren, Erklärungen).

## Ordner

| Ordner | Inhalt |
|---|---|
| `web/` | Alles, was online geht (wird automatisch veröffentlicht) |
| `web/index.html` | LernDax-Startseite mit den Fächern |
| `web/plattform/` | Gemeinsame Teile: Einstellungen (`config.js`), Synchronisation (`sync.js`), Avatare (`avatare.js`), Trainings für Klassenarbeiten (`trainings.js`) |
| `web/mathe/` | **Mathelix**: App, `generatoren/` (Aufgaben), `erklaerungen/` (Animationen, Entdecken) |
| `web/icons/` | Dachs-Logo und App-Icons |
| `faecher/mathe/lehrplan/` | Lehrplan-Auswertung Mathe |
| `supabase/` | Datenbank-Schema (`lerndax_`-Tabellen im Familienkalender-Projekt) |
| `notizen/` | Feedback und Ideen. Bleibt lokal und kommt nicht auf GitHub |
| `tests/` | Automatische Tests (siehe `tests/README.md`) |
| `SETUP.md` | Technik: Webadresse, Datenbank, neue Version veröffentlichen |
| `STAND.md` | **Projektgedächtnis:** was fertig ist, Entscheidungen, Technik, offene Punkte, Verlauf |

## Ein neues Fach hinzufügen

1. Ordner `web/<fach>/` mit `index.html` anlegen, nach dem Vorbild von `web/mathe/`, und
   `window.LERNDAX_SUBJECT = '<fach>'` setzen.
2. In `web/index.html` beim Fach `soon: true` entfernen und `href` ergänzen.
3. Dateien in `web/sw.js` aufnehmen und `VERSION` erhöhen.

Die Datenbank muss dafür nicht geändert werden, der Lernstand wird automatisch je Fach gespeichert.

## Fahrplan

**Mathe (Mathelix)**
- [x] Klasse 5: alle 5 Lernbereiche, 25 Themen, Tipps und Lösungswege
- [x] Erklär-Animationen zu allen 25 Themen, Pause und Langsam-Modus
- [x] Beispiel vorher / Lösung als Animation nachher für alle 25 Themen
- [x] Entdecken: 14 visuelle Beweise und Staunen-Momente
- [x] Entscheidungen aus der Prüfung vom 11.11.2026 umgesetzt: weniger Raten, leichtere Zahlen, „Gemischt“ nur aus geübten Themen, breite Darstellung am Tablet und PC
- [ ] Verfahren beim schriftlichen Minus mit der Schule abgleichen
- [ ] Lehrplan-Lücken Klasse 5: Symmetrie, Quader-Netze, Überschlag, schriftlich plus/minus/mal, Dezimalzahlen runden
- [ ] Reihenfolge mit dem Schulbuch abgleichen
- [ ] Klasse 6, danach Klasse 4 und die übrigen Klassen

**Plattform**
- [x] Familienkonto (wie Familienkalender), Kind-Profile, Eltern-PIN, Synchronisation
- [x] Installierbare App, offline nutzbar
- [x] LernDax-Startseite mit Fächern
- [x] Avatare (12 Figuren × 8 Farben), im Profil synchronisiert
- [ ] Elternbereich von Mathelix auf die Startseite verlegen (sobald ein zweites Fach kommt)
- [ ] Link „📚 LernDax“ im Familienkalender (Auftrag übergeben; ob umgesetzt, im Kalender-Projekt prüfen)
- [ ] Sammelkarten (Gauß, Eratosthenes, Pythagoras …)
- [x] Trainingsseiten für einzelne Klassenarbeiten (nur per Link, getrennt von der allgemeinen App)
- [x] Knopf „Jetzt üben“ im Familienkalender (vom Kalender-Projekt umgesetzt, 10.11.2026)

**Weitere Fächer**
- [ ] Deutsch
- [ ] Englisch
