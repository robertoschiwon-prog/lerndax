# LernDax – Technik & Einrichtung

**Stand 10.11.2026: alles eingerichtet.**

| Was | Wo |
|---|---|
| Webseite | https://robertoschiwon-prog.github.io/lerndax/ (GitHub Pages, Repository `robertoschiwon-prog/lerndax`) |
| Datenbank | Supabase, Projekt **familienkalender** (Organisation „Familie“), Tabellen `lerndax_…` |
| Anmeldung | dasselbe Familienkonto wie im Familienkalender (neue Konten legt nur der Admin an) |

## So benutzt ihr es

**Einmalig auf jedem Gerät** (Papas iPhone, Tablet, Computer):
1. https://robertoschiwon-prog.github.io/lerndax/ öffnen → **Mathe** → ganz unten
   **„Für Eltern: Fortschritt ansehen“**. Von der Startseite aus geht es auch direkt über
   **„Für Eltern: Fortschritt & Geräte“**.
2. Mit dem **Familienkalender-Konto** anmelden.
3. **Profil anlegen** (Vor- oder Spitzname) bzw. auf weiteren Geräten das Profil antippen.
   Das Profil gilt für alle Fächer.
4. Empfohlen: **Eltern-PIN festlegen**. Dann kann sich das Kind nicht selbst abmelden,
   das Profil wechseln oder den Fortschritt löschen.

**Als App aufs Handy legen**
- iPhone (Safari): Teilen-Symbol → **Zum Home-Bildschirm**
- Android (Chrome): Menü ⋮ → **App installieren** bzw. **Zum Startbildschirm hinzufügen**

## Neue Version veröffentlichen

Jede Änderung, die auf GitHub (`main`) landet, wird automatisch veröffentlicht
(`.github/workflows/pages.yml` lädt den Ordner `web/` hoch). Damit Handys die neuen Dateien
sofort laden, in `web/sw.js` die `VERSION` erhöhen.

## Datenbank

- `supabase/schema.sql`: alle Tabellen, Regeln und Rechte (kann gefahrlos erneut ausgeführt werden)
- Die Auth-Einstellungen gehören dem Familienkalender und werden von LernDax nicht verändert.
- Kostenlose Supabase-Projekte pausieren nach etwa einer Woche ganz ohne Nutzung. Kalender und
  LernDax halten das Projekt gegenseitig wach. Falls es doch passiert: im Dashboard
  **Restore project** klicken.
