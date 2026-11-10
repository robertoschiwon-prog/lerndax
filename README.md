# Mathelix

Mathe-Übungs-App für Klasse 1 bis 10, am **Lehrplan Gymnasium Sachsen** ausgerichtet.
Läuft im Browser auf Handy, Tablet und Rechner.

Gestartet: 10.11.2026, zuerst für Klasse 5 (Gymnasium Klotzsche).

## Ordner

| Ordner | Inhalt |
|---|---|
| `app/` | Die Web-App. `index.html` öffnen und los geht's. |
| `app/generatoren/` | Aufgabengeneratoren, eine Datei pro Klassenstufe (`klasse5.js` …) |
| `app/erklaerungen/` | Animierte Erklärungen je Thema (`klasse5.js`) und „Entdecken“-Sammlung (`entdecken.js`) |
| `lehrplan/` | Lernbereiche nach sächsischem Lehrplan, Grundlage für die Themen |
| `notizen/` | Feedback vom Testen, Ideen, offene Fragen (bleibt lokal, nicht auf GitHub) |
| `supabase/` | Datenbank-Schema für die Synchronisation |
| `SETUP.md` | Anleitung: eigene Adresse + Synchronisation einrichten |

## Wie die Aufgaben entstehen

Aufgaben werden nicht von Hand geschrieben, sondern **erzeugt**. Jedes Thema hat einen
Generator, der bei jedem Aufruf neue Zahlen würfelt und dazu Tipp und Lösungsweg
liefert. Dadurch gibt es unendlich viele Aufgaben, und neue Themen kommen als neue
Generatoren dazu.

Hierarchie: **Klasse → Lernbereich (LB) → Thema → Generator**

## Fahrplan

1. **Prototyp Klasse 5**: alle 5 Pflicht-Lernbereiche, Fortschritt lokal auf dem Gerät ✅
   - Erklär-Animationen für 18 Themen, pausierbar, mit Langsam-Modus ✅
   - Entdecken: 14 visuelle Beweise (Gedankenlesen/Binärzahlen, Gauß, ungerade Zahlen, ½+¼+…=1, Sieb, Schachbrett, Galton-Brett, Pascal/Sierpinski, Baumhöhe, Dreieck 180°, Sonnenblume, π, Kreisfläche, Pythagoras) ✅
2. **Testen mit Sohn**: Was macht Spaß, was nervt, was fehlt? (→ `notizen/feedback.md`)
3. **Schulbuch abgleichen**: Reihenfolge der Themen an das Mathebuch der Klasse anpassen
4. **Konto & Sync**: Lernstand zwischen Handy und Web synchron, Elternansicht – Code fertig, Einrichtung siehe `SETUP.md`
5. **Ausbau**: Klasse 6 und 4, danach die übrigen Klassen
6. **Eigene Adresse**: als installierbare App (PWA) auf GitHub Pages – vorbereitet (Manifest, Icons, Offline, Workflow)

## Grundsätze

- Verstehen vor Punkten: bei Fehlern gibt es den Lösungsweg, nicht nur „falsch“.
- Zeigen statt erklären: wo möglich eine Animation zum Selbst-Ausprobieren (▶).
- Fehler kommen wieder: Themen mit Fehlern landen im Wiederholungs-Training.
- Datensparsam: nur Lernstand, kein Tracking, keine Werbung.
