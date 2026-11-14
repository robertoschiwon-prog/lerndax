# Fächerplan LernDax

Stand: 14.11.2026 · Die technische Liste aller Fächer steht in `web/plattform/faecher.js`.
Diese Datei erklärt, welche Fächer es gibt, wie sie heißen und in welcher Reihenfolge sie kommen.

## Namensschema

**Kürzel aus dem Stundenplan + „Dax“**, zum Beispiel MaDax, DeDax und EnDax.

- Die Kürzel folgen den amtlichen Fächerabkürzungen in Sachsen (VwV Stundentafeln, Abkürzungsliste
  Gymnasium: MA, DE, EN, BIO, GE, GEO, PH, CH, FR, LA, RU, SPA, MU, KU, ETH …). Kinder kennen sie aus dem
  Stundenplan und müssen nichts entschlüsseln.
- Auf jeder Kachel steht **groß der Dax-Name und klein der ausgeschriebene Fachname**.
- Die Namen sind bewusst sachlich, damit sie von Klasse 1 bis 10 passen. Verspieltes (Dachs als
  Maskottchen, Bilder, Tonfall) gehört zur Gestaltung und kann für jüngere Klassen stärker sein.
- **Ausnahme TecDax:** Das Fach heißt in Klasse 5–6 „Technik/Computer“ (TC) und ab Klasse 7
  „Informatik“. Beides ist ein Fach in LernDax, der Name spielt auf den echten TecDAX an.
- Das Mathe-Fach hieß bis 11.11.2026 „Mathelix“. Intern (Lernstand `mathelix.v1`,
  `window.Mathelix`, `MATHELIX_CONFIG`) bleibt der alte Name, damit kein Lernstand verloren geht.
- Die Fach-ID (`id` in `faecher.js`) ist zugleich Ordnername und Schlüssel in der Datenbank.
  Sie wird nie mehr geändert, auch wenn sich der Anzeigename ändert.

## Der Dachs mit Fach-Hut

Jedes Fach bekommt einen eigenen Dachs mit Hut (`web/icons/<name>.svg`). Er steht in der Kopfzeile
des Fachs, groß beim Lob nach einer Runde und auf der Kachel der Startseite. Das LernDax-Logo (`dachs.svg`, ohne Hut) bleibt für
Startseite und App-Icon.

| Fach | Hut | Datei |
|---|---|---|
| MaDax | Papierhut aus Karopapier mit + − × ÷ | `madax.svg` ✅ eingebaut |
| DeDax | aufgeschlagenes Buch als Dach, mit Lesezeichen | `dedax.svg` ✅ eingebaut |
| EnDax | Strickmütze mit Union Jack | `endax.svg` (liegt bereit) |
| BioDax | Fliegenpilz als Hut | `biodax.svg` ✅ eingebaut |
| GeDax | Pharaonen-Kopftuch | `gedax.svg` ✅ eingebaut |
| GeoDax | Globus als Mütze | `geodax.svg` (liegt bereit) |
| TecDax | Headset mit Mikrofon | `tecdax.svg` (liegt bereit) |

Alle sieben stehen auf der Startseite (MaDax und DeDax als große Kacheln, die übrigen unter „Kommt bald“).
Ideen für später: PhDax/ChDax Schutzbrille auf der Stirn.

Regeln für neue Hüte: gleicher Rahmen `viewBox="-20 -32.75 140 140"`, Kopf unverändert an derselben
Stelle, Hut bleibt im Bereich x 6…94 und y ab −20, flächig ohne Umrisslinien, der Hut verdeckt den
Kopf oberhalb der Stirn vollständig. Für ältere Klassen kann der Hut später entfallen.

## Alle Fächer

Klassen laut Stundentafel Sachsen (Grundschule Kl. 1–4, Gymnasium Sekundarstufe I Kl. 5–10).

| Name | Fach | Kürzel | Klassen | Gruppe | Stand |
|---|---|---|---|---|---|
| **MaDax** | Mathe | Ma | 1–10 | Hauptfach | ✅ Klasse 5 |
| **DeDax** | Deutsch | De | 1–10 | Hauptfach | ✅ Klasse 5 |
| **EnDax** | Englisch | En | 3–10 | Hauptfach | ✅ Klasse 5 |
| **SuDax** | Sachunterricht | Su | 1–4 | Sachfach | geplant |
| **BioDax** | Biologie | Bio | 5–10 | Sachfach | ✅ Klasse 5 |
| **GeDax** | Geschichte | Ge | 5–10 | Sachfach | ✅ Klasse 5 |
| **GeoDax** | Geografie | Geo | 5–10 | Sachfach | geplant |
| **TecDax** | Technik/Computer, ab Kl. 7 Informatik | TC / Inf | 5–10 | Sachfach | geplant |
| **PhDax** | Physik | Ph | 6–10 | Sachfach | geplant |
| **ChDax** | Chemie | Ch | 7–10 | Sachfach | geplant |
| **GrwDax** | Gemeinschaftskunde/Rechtserziehung/Wirtschaft | GRW | 7–10 | Sachfach | geplant |
| **FrDax** / **LaDax** / **RuDax** / **SpaDax** | 2. Fremdsprache (nur die gewählte) | Fr / La / Ru / Spa | 6–10 | 2. Fremdsprache | geplant |
| MuDax | Musik (Noten, Rhythmus, Instrumente) | Mu | 1–10 | vielleicht | offen |
| KuDax | Kunst (Farbenlehre, Kunstgeschichte) | Ku | 1–10 | vielleicht | offen |
| EthDax | Ethik | Eth | 1–10 | vielleicht | offen |

**Nicht vorgesehen:** Sport, Werken, Religion, Profilunterricht (Kl. 8–10) und 3. Fremdsprache.
Sie lassen sich kaum sinnvoll am Bildschirm üben oder sind von der Schule und der Wahl abhängig.
Das kann später neu entschieden werden.

## Fahrplan in drei Phasen

**Phase 1: Klasse 5 fertig bauen, alle Fächer**
1. MaDax ✅ inhaltlich fertig (36 Themen, Knobel-Stufe, Abgleich mit Buch und Lehrplan; Abnahme nach dem Test mit dem Kind, siehe `STAND.md` Abschnitt 0)
2. DeDax ✅ gebaut (37 Themen, Entdecken, Knobeln; mit dem Deutschbuch abgeglichen; Test mit dem Kind steht aus)
3. EnDax ✅ gebaut (53 Themen nach den Units des Buchs, Entdecken, Knobeln; Startpunkt `faecher/englisch/README.md`; Schulbuch Green Line 1, Klett, Ausgabe ab 2021, ISBN 978-3-12-864011-2, geprüft 13.11.2026)
4. GeDax ✅ gebaut (31 Themen nach den Kapiteln von ANNO 1, Entdecken, Knobeln; `faecher/geschichte/README.md`); 
5. BioDax ✅ gebaut (50 Themen nach den Kapiteln von LINDER Biologie 5, Entdecken, Knobeln; `faecher/bio/README.md`); **als Nächstes GeoDax (Terra 5)**
6. TecDax (Technik/Computer)
7. Vielleicht: MuDax, KuDax, EthDax

**Phase 2: die Nachbarklassen 4 und 6 in allen Fächern**
- Klasse 6: dazu PhDax und die 2. Fremdsprache, die das Kind wählt
- Klasse 4: MaDax, DeDax, EnDax, SuDax

**Phase 3: alle übrigen Klassen (1–3 und 7–10)**
- ab Klasse 7 zusätzlich ChDax, GrwDax, TecDax als Informatik

## Für jedes neue Fach

1. Lehrplan Sachsen auswerten, in `faecher/<id>/lehrplan/` ablegen (Vorbild:
   `faecher/mathe/lehrplan/sachsen-gymnasium.md`; Lehrpläne unter https://www.schulportal.sachsen.de/lplandb/).
2. Mit dem Schulbuch abgleichen (Reihenfolge, Begriffe). Aufgaben werden nicht abgeschrieben.
3. Ordner `web/<id>/` anlegen (Vorbild `web/deutsch/`) und die Schritte unter „Ein neues Fach hinzufügen“ in der `README.md` befolgen.
4. In `faecher.js` beim Fach `status: 'fertig'`, `fertig: [Klasse]`, `href`, `key` und `themen` setzen.
   Dann erscheint es auf der Startseite als große Kachel statt unter „Kommt bald“.

## Offene Fragen

- Welche 2. Fremdsprache wählt das Kind ab Klasse 6? Welche bietet die Schule an?
- Die Stundenplan-Kürzel der Schule mit der amtlichen Liste vergleichen (zum Beispiel „Geo“ oder „Gg“, „TC“ oder „TeC“).
- Sollen MuDax, KuDax und EthDax kommen?

Quellen: Stundentafel Gymnasium Sekundarstufe I (Anlage 4a) und Grundschule (Anlage 1a) der
VwV Stundentafeln, Abkürzungsliste der Fächer (Gymnasium), alle auf https://www.revosax.sachsen.de.

## Schulbücher Klasse 5 (geprüft 13.11.2026, ISBN von der Rückseite)

| Fach | Buch | Verlag | ISBN |
|---|---|---|---|
| Mathe | Lambacher Schweizer Mathematik 5, Ausgabe Sachsen (ab 2019) | Klett | 978-3-12-733150-9 |
| Deutsch | Deutschbuch Gymnasium 5 (Ausgabe noch zu klären, siehe `deutsch/lehrplan/schulbuch-abgleich.md`) | Cornelsen | 978-3-06-061189-8 |
| Englisch | Green Line 1, Ausgabe ab 2021 (flexibler Einband) | Klett | 978-3-12-864011-2 |
| Geografie | TERRA Geographie 5, Ausgabe Sachsen Gymnasium (ab 2019) | Klett | 978-3-12-104320-0 |
| Geschichte | ANNO 1, Ausgabe 2019 für Gymnasien in Sachsen | Westermann | 978-3-14-115406-1 |
| Biologie | LINDER Biologie SI 5, Ausgabe 2020 für Sachsen | Westermann | 978-3-14-153000-1 |
