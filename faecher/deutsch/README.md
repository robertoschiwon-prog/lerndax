# DeDax (Deutsch) – Startpunkt

Stand 12.11.2026: **noch nichts gebaut.** Diese Datei sagt, was feststeht, was zu klären ist und wie man anfängt.
Vorher lesen: `STAND.md` (Abschnitt 0 und 6), `README.md`, `faecher/README.md`.

## Was feststeht

| | |
|---|---|
| Name | **DeDax** (sichtbar), Fach-ID `deutsch`, Kürzel `De` |
| Maskottchen | Dachs mit **aufgeschlagenem Buch** als Hut: `web/icons/dedax.svg` (fertig) |
| Farbe | `#3d7bff` (Eintrag in `web/plattform/faecher.js`, bisher `status: 'geplant'`) |
| Ordner | `web/deutsch/` (noch anzulegen), Lernstand im Browser unter eigenem Schlüssel, Vorschlag `dedax.v1` |
| Zuerst | Klasse 5, Gymnasium Sachsen; später Klasse 4 und 6, dann 1–10 |
| Leitidee | verstehen statt pauken; anschauliche, animierte Erklärungen; nach jeder Antwort die Lösung; „Entdecken“ zum Neugierigwerden |
| Schulbuch | laut Fächerplan „Deutschbuch 5“ (Cornelsen). **Ausgabe und ISBN noch nicht geprüft.** |

Regeln wie bei MaDax: genau der sächsische Lehrplan, alles darüber hinaus in „Entdecken“; keine Namen von Schule,
Lehrkraft oder Kind im öffentlichen Code; Aufgaben aus dem Schulbuch werden nicht abgeschrieben.

## Vorgehen (so hat es bei Mathe funktioniert)

1. **Lehrplan Deutsch Gymnasium Sachsen, Klasse 5, am Originaltext auswerten** (https://www.schulportal.sachsen.de/lplandb/)
   und als `faecher/deutsch/lehrplan/sachsen-gymnasium.md` ablegen: Lernbereiche, Inhalte, was davon am Bildschirm übbar ist.
2. **Mit dem Schulbuch abgleichen** (Stoffverteilungsplan des Verlags suchen): Reihenfolge, Begriffe, Kapitel.
   Ergebnis als `faecher/deutsch/lehrplan/schulbuch-abgleich.md`.
3. **Themenplan vorlegen**: Lernbereiche und Themen als Liste, dazu je Thema 2–3 Beispiel-Aufgaben. Der Auftraggeber
   entscheidet anhand von Optionen (einzeln fragen).
4. **Erst ein Thema ganz fertig bauen** (Aufgaben, Tipp, Lösungsweg, Erklärung, Symbol, Test) und zeigen, dann die übrigen.
5. Tests, Version, GitHub, `STAND.md`, OneDrive wie in `STAND.md` Abschnitt 0 beschrieben.

## Was vor dem Bauen zu klären ist

**Mit dem Auftraggeber**
- Welches Deutschbuch genau (Titel, Ausgabe, ISBN auf der Rückseite)?
- Womit anfangen: Was ist gerade im Unterricht dran, steht eine Klassenarbeit an, was fällt dem Kind schwer?
- Soll es wie bei Mathe eine Trainingsseite für eine bestimmte Arbeit geben?

**Technisch (wichtigste Entscheidung)**
- `web/mathe/index.html` enthält alles in einer Datei: Startseite des Fachs, Übungsrunde, Tipp/Lösungsweg, Sterne,
  Tagesziel, Knobeln, Erklär-Player, Elternbereich, Synchronisation. Für ein zweites Fach soll das **nicht kopiert**
  werden. Vorschlag: die fachunabhängigen Teile nach `web/plattform/` herausziehen (eine gemeinsame „Fach-App“), und
  jedes Fach liefert nur noch Themen, Aufgaben, Erklärungen und Symbole. Das ist ein Umbau an MaDax; vorher mit dem
  Auftraggeber besprechen und danach alle Mathe-Tests laufen lassen.
- Deutsch braucht **andere Aufgabenformen** als Mathe: Wörter eintippen (Rechtschreibung, Groß/Klein, Umlaute, ß),
  Wörter oder Satzteile antippen bzw. markieren, zuordnen, Reihenfolge herstellen, Lücken im Satz. Die Eingabeprüfung
  von MaDax kennt bisher nur Zahlen, Brüche, Uhrzeit, Primfaktoren und Auswahl.
- Aufgaben lassen sich in Deutsch nicht einfach aus Zufallszahlen erzeugen. Es braucht geprüfte **Wort- und Satzlisten**
  (selbst geschrieben, kindgerecht, ohne Urheberrechtsprobleme) und Regeln, die daraus Aufgaben bauen.
- Erklärungen im Stil von MaDax: Was lässt sich in Deutsch gut **zeigen** (zum Beispiel Sätze umstellen, Wortbausteine
  zerlegen, Zeitstrahl für Zeitformen)? Je Thema eine Idee, bevor gebaut wird.
- Der Elternbereich gehört bei zwei Fächern auf die LernDax-Startseite (steht als Idee in `STAND.md`).

## Was sich aus MaDax übernehmen lässt

- Aufbau eines Themas: `{ id, title, icon, gen }`, Aufgabe mit `prompt`, `hint`, `solution`, `ex` für die Animation.
- Erklär-Player mit Pause und Langsam-Modus, „ähnliches Beispiel“ vorher, „Lösung zu deiner Aufgabe“ nachher.
- Sterne (letzte 10 Aufgaben), Tagesziel, Fehler-Training, Gemischt, Knobel-Stufe, „Weiter üben“.
- Symbole statt Emojis (`web/plattform/symbole.js`), Avatare, Lob-Szene mit Fach-Dachs.
- Die Tests in `tests/` als Vorbild (jede Aufgabe in der App lösen, Bilder prüfen, Design auf vier Bildschirmgrößen).
