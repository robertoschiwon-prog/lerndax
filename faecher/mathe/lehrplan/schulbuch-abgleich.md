# Abgleich MaDax Klasse 5 ↔ Schulbuch

Schulbuch: **Lambacher Schweizer Mathematik 5, Ausgabe Sachsen** (Klett 2019, ISBN **978-3-12-733150-9**).
**Am Buch geprüft am 15.11.2026:** Die ISBN auf der Rückseite stimmt. Roberto hat alle Doppelseiten fotografiert (S. 2–269, nur lokal in
`notizen/schulbuch-mathe/`, nie auf GitHub). Vorher stammte der Abgleich nur aus dem Stoffverteilungsplan des Verlags (12.11.2026).

**Seit v112 ist MaDax genau wie das Buch aufgebaut:** fünf Bereiche = die fünf Kapitel I–V, Themen in der Reihenfolge der Lerneinheiten,
jedes Thema mit „📖 Buch S. …“. Festgelegt in `web/mathe/generatoren/klasse5-buch.js` (Tabelle `KAPITEL`, Titel aus dem Buch in `TITEL`).
Lernstand und Sterne hängen an der Themen-ID, deshalb ging beim Umbau nichts verloren.

Alles hier in eigenen Worten. Keine Aufgaben, Bilder oder Texte aus dem Buch (Regel 9 in STAND.md).

## Aufbau des Buchs

Jedes Kapitel: Erkundungen (Einstieg zum Ausprobieren), Lerneinheiten (Einstiegsaufgabe, Merkkasten, Beispiele, Aufgaben in drei Niveaus,
„Teste dich!“, „Teste dein Grundwissen!“), danach „Wiederholen – Vertiefen – Vernetzen“, Exkursionen, Rückblick (alle Merksätze des Kapitels)
und ein Test in zwei Runden. Hinten: Exkursion EXTRA „Mathematik im Alltag“ (S. 216–217), Check-in zu jedem Kapitel (S. 218–222),
**Grundwissen** (S. 223–226: schriftliche Rechenverfahren, Diagramme, Größen), Lösungen (S. 227–263), Register (S. 264), Begriffe (S. 268).

## Kapitel I – Arbeiten mit natürlichen Zahlen (S. 6–53)

| Buch | Seiten | MaDax-Thema | Begriffe und Rechenwege im Buch |
|---|---|---|---|
| Erkundung: Linienbrett, Fermi-Fragen | 6–7 | **Schätzen wie Fermi** (S. 7) | Fermi-Fragen: mit Hilfsfragen schätzen und überschlagen |
| 1 Natürliche Zahlen ordnen | 8–10 | **Große Zahlen & Zahlenstrahl** (S. 8–13) | natürliche Zahlen, Nachfolger, Vorgänger, Ziffer und Zahl, Menge ℕ, Zahlenstrahl, kleiner/größer (<, >), Gegenbeispiel |
| 2 Große Zahlen und Runden | 11–14 | Große Zahlen & Zahlenstrahl, **Runden** (S. 11–14) | Stellenwerttafel bis Milliarden (H Z E je Dreiergruppe), Zahlwörter, Rundungsstelle: 0–4 abrunden, 5–9 aufrunden, Zeichen ≈ („ist ungefähr“) |
| 3 Grundrechenarten, Gleichungen | 15–18 | **Fachbegriffe** *(neu in v112)*, **Gleichungen** (S. 15–18) | Strich- und Punktrechnung; Summand + Summand = Summe, Minuend − Subtrahend = Differenz, Faktor · Faktor = Produkt, Dividend : Divisor = Quotient; Aufgaben in Worten; Zahlenmauern; Gleichung, Variable, Lösung, systematisches Probieren oder Umkehraufgabe |
| 4 Terme, Vorrangregeln | 19–22 | **Vorrangregeln** | Term; Klammern zuerst (innen nach außen, auch eckige Klammern), Punkt vor Strich, sonst von links nach rechts; Rechenbaum |
| 5 Rechenvorteile beim Addieren und Multiplizieren | 23–25 | **Rechengesetze**, **Rechenvorteile** (beide S. 23–28) | Kommutativgesetz (Summanden/Faktoren vertauschen), Assoziativgesetz (Klammern setzen oder weglassen); gelten nicht für Minus und Geteilt |
| 6 Ausklammern und Ausmultiplizieren | 26–28 | Rechengesetze, Rechenvorteile | Distributivgesetz: Ausmultiplizieren und Ausklammern, auch mit Differenz (z. B. 9 · 31 = 9 · 30 + 9 · 1) |
| 7 Potenzieren | 29–31 | **Potenzen** | Potenz, Grundzahl oder Basis, Hochzahl oder Exponent („5 hoch 3“); Potenzen vor Punkt vor Strich; Quadratzahlen bis 20²; Zehnerpotenzen |
| 8 Teilbarkeit | 32–34 | **Teilbarkeit** | Teiler, teilbar, Vielfaches; Endstellenregel (2, 5, 10; durch 4: letzte zwei Ziffern), Quersummenregel (3); durch 6 = durch 2 und 3; Regeln für 9, 8, 15 nur als Aufgaben |
| 9 Primzahlen | 35–37 | **Primzahlen & Primfaktoren** | Primzahl (0 und 1 sind keine), Primfaktorzerlegung als Kette (72 = 2 · 36 = 2 · 2 · 18 = …), Potenzschreibweise, Faktoren der Größe nach; alle Teiler aus der Zerlegung; Primzahlzwillinge |
| 10 Schriftliches Dividieren | 38–40 | **Schriftlich dividieren** | erst Überschlag (auf ein einfaches Vielfaches runden), dann Stelle für Stelle („passt 5-mal“, nächste Ziffer dazuschreiben), Rest, Probe mit Rest |
| 11 Sachaufgaben systematisch lösen | 41–44 | **Sachaufgaben systematisch lösen**, **Sachaufgaben mit Geld** (S. 41–44) | vier Schritte: Verstehen der Aufgabe – Zerlegen in Teilprobleme – Rechenweg durchführen – Rückschau und Antwort |
| Wiederholen – Vertiefen – Vernetzen | 45–47 | (Training für die Arbeit) | |
| Exkursionen: Römische Zahlzeichen, Zweiersystem | 48–51 | „Entdecken“: Römische Zahlen, Zählen wie ein Computer | |
| Rückblick, Test | 52–53 | | |
| Grundwissen: Schriftliche Rechenverfahren | 223 | **Schriftlich rechnen** (S. 223), **Überschlagen** (S. 38, 101, 223) | siehe unten |

**Schriftliche Rechenverfahren wie im Buch (Grundwissen S. 223), seit v112 auch so in MaDax:**
- Addieren: stellengerecht untereinander, von rechts; „schreibe 3, übertrage 1“.
- **Subtrahieren:** Abziehen mit Übertrag. Geht es an einer Stelle nicht (2 − 5), rechnet man mit 10 mehr (12 − 5 = 7) und überträgt 1;
  die 1 steht in einer eigenen Zeile unter dem Subtrahenden und wird in der nächsten Spalte mit abgezogen (6 − 3 − 1 = 2).
  *Damit ist die offene Frage „Verfahren beim schriftlichen Minus“ geklärt.* Früher zeigte MaDax hier nur die Probe mit Plus.
- **Multiplizieren:** den ersten Faktor nacheinander mit jeder Ziffer des zweiten Faktors malnehmen, **vorn beginnend**; jedes
  Teilergebnis endet unter seiner Ziffer (also versetzt), dann addieren. Früher zerlegte MaDax den zweiten Faktor in Zehner und Einer.

## Kapitel II – Gemeine Brüche und Prozente (S. 56–85)

| Buch | Seiten | MaDax-Thema | Begriffe und Rechenwege im Buch |
|---|---|---|---|
| Erkundungen | 56–57 | | |
| 1 Bruch und Anteil | 58–62 | **Bruch und Anteil** | Bruch, Zähler („zählt“), Nenner („nennt“ die Art des Teils), Bruchstrich, Stammbruch; Anteil berechnen (erst teilen, dann malnehmen); vom Anteil zum Ganzen |
| 2 Kürzen und erweitern | 63–67 | **Erweitern**, **Kürzen** | erst Erweitern (feinere Einteilung), dann Kürzen; vollständig gekürzt; schrittweise kürzen; Verhältnisse (18 : 9 = 2 : 1) |
| 3 Brüche vergleichen | 68–71 | **Brüche vergleichen** *(neu in v112)* | Rechtecksbilder; gleicher Nenner → größerer Zähler; gleicher Zähler → kleinerer Nenner ist größer; sonst gemeinsamer Nenner (kleinstes gemeinsames Vielfaches) |
| 4 Prozente | 72–75 | **Prozente** *(neu in v112)* | Prozentschreibweise, 1 % = 1/100, auf den Nenner 100 bringen (auch erst kürzen, z. B. 40/200); näherungsweise (1/3 ≈ 33 %); Anteile vergleichen |
| 5 Brüche als Quotienten | 76–78 | **Brüche am Zahlenstrahl** (S. 76–81) | 3 : 4 = 3/4; Division durch 0 hat kein Ergebnis |
| 6 Brüche auf dem Zahlenstrahl | 79–81 | Brüche am Zahlenstrahl, **Unechte und gemischte Brüche** (S. 79–81) | gleiche Stelle für erweiterte/gekürzte Brüche; natürliche Zahlen als Brüche; unechter Bruch (Zähler größer als Nenner); gemischter Bruch, gemischte Schreibweise |
| WVV, Rückblick, Test | 82–85 | | |

## Kapitel III – Dezimalzahlen (S. 88–125)

| Buch | Seiten | MaDax-Thema | Begriffe und Rechenwege im Buch |
|---|---|---|---|
| Erkundungen | 88–89 | | |
| 1 Dezimalschreibweise | 90–93 | **Dezimalschreibweise** | Komma- oder Dezimalschreibweise, Zehntel, Hundertstel, Tausendstel, Stellenwerttafel; Bruch mit Nenner 10, 100, 1000; Endnullen (0,3 = 0,30); auch in Prozent |
| 2 Dezimalzahlen vergleichen und runden | 94–97 | **Dezimalzahlen vergleichen**, **Dezimalzahlen runden** | von links Stelle für Stelle; Rundungsstelle wie bei natürlichen Zahlen; 2,098 ≈ 2,10 (die Null bleibt stehen); Vergleich über gleiche Schreibweise |
| 3 Größenangaben in Kommaschreibweise | 98–100 | **Größenangaben in Kommaschreibweise** (S. 98–100, 225–226) | Stellenwerttafel für Längen (km, m, dm, cm, mm) und Massen (t, kg, g, mg); Maßeinheit gilt für die Stelle vor dem Komma; Geld (1,53 € = 153 ct). Seit v112 ohne Flächen und Volumen (eigene Themen), dafür mit Euro und Cent |
| (Grundwissen Zeit) | 226 | **Fahrpläne & Zeit** (S. 226) | 1 d = 24 h, 1 h = 60 min, 1 min = 60 s; gemischte Schreibweise. Fahrpläne selbst stehen nicht im Buch (nur in der Exkursion S. 216) |
| 4 Dezimalzahlen addieren und subtrahieren | 101–105 | **Mit Dezimalzahlen rechnen** (S. 101–112, 116–118) | Komma unter Komma, Nullen ergänzen, Komma setzen; Überschlag (schneller Überblick und zur Kontrolle) |
| 5 Rechnen mit Zehnerpotenzen | 106–108 | Mit Dezimalzahlen rechnen | Kommaverschiebung: mal 10, 100 … nach rechts, geteilt nach links; Nullen ergänzen bzw. voranstellen |
| 6 Dezimalzahlen vervielfachen und teilen | 109–112 | Mit Dezimalzahlen rechnen | nur mit natürlichen Zahlen: Komma wegschieben, rechnen, zurückschieben; Teilen schriftlich, Komma beim Überschreiten des Kommas setzen |
| 7 Arithmetisches Mittel | 113–115 | **Arithmetisches Mittel** | Mittelwert oder Durchschnitt: Summe durch Anzahl; Größen in derselben Einheit |
| 8 Rechengesetze – Vorteile beim Rechnen | 116–118 | Mit Dezimalzahlen rechnen (Aufgabenart „Rechne geschickt“) | dieselben Regeln und Gesetze wie bei natürlichen Zahlen |
| WVV, Exkursion „Besondere Maßeinheiten“, Rückblick, Test | 119–125 | | |

## Kapitel IV – Lagebeziehungen geometrischer Objekte (S. 128–167)

| Buch | Seiten | MaDax-Thema | Begriffe und Rechenwege im Buch |
|---|---|---|---|
| Erkundungen | 128–129 | | |
| 1 Senkrechte und parallele Geraden | 130–132 | **Senkrechte und parallele Geraden** | Strecke, Gerade, Halbgerade (Strahl), Schnittpunkt; senkrecht (g ⊥ h, orthogonal), parallel (g ∥ h); Geodreieck: Mittellinie, Grundlinie, Hilfslinien |
| 2 Koordinatensystem | 133–135 | **Koordinatensystem** | Koordinatenursprung O, x-Achse, y-Achse, Längeneinheit, P(4 \| 2), x- und y-Koordinate („erst x, dann y, wie im Alphabet“), Quadrant |
| 3 Winkel | 136–139 | **Winkel** | Schenkel, Scheitelpunkt, Bezeichnung ∢ASB (gegen den Uhrzeigersinn), griechische Buchstaben; spitzer, rechter, stumpfer, gestreckter, überstumpfer Winkel, Vollwinkel; Grad |
| 4 Winkel mit dem Geodreieck messen und zeichnen | 140–143 | **Winkel messen** | Grundseite auf den 1. Schenkel, Nullmarke auf den Scheitelpunkt, Skala, die am 1. Schenkel mit 0° beginnt; überstumpfe Winkel: 180° + Rest oder 360° − Ergänzung |
| 5 Winkel an sich schneidenden Geraden | 144–147 | **Winkel an sich schneidenden Geraden** | Nebenwinkel (zusammen 180°), Scheitelwinkel (gleich groß), Stufen- und Wechselwinkel an Parallelen (gleich groß) |
| 6 Achsensymmetrische Figuren | 148–152 | **Symmetrie und Verschiebungen** (S. 148–159) | achsensymmetrisch, Symmetrieachse, Spiegelpunkt, Verbindungsstrecke senkrecht zur Achse und von ihr halbiert; Spiegeln in vier Schritten |
| 7 Dreh- und Punktsymmetrie | 153–156 | Symmetrie und Verschiebungen | Drehung um ein Drehzentrum mit Drehwinkel, Bildpunkt; drehsymmetrisch; punktsymmetrisch, Symmetriezentrum; Punktspiegelung = Drehung um 180° |
| 8 Verschiebungen | 157–159 | Symmetrie und Verschiebungen | Verschiebungspfeil (Translation); Strecke und Bildstrecke gleich lang |
| WVV, Exkursion DGS, Rückblick, Test | 160–167 | | |

## Kapitel V – Rechtecke und Quader (S. 170–215)

| Buch | Seiten | MaDax-Thema | Begriffe und Rechenwege im Buch |
|---|---|---|---|
| Erkundungen | 170–171 | | |
| 1 Flächeninhalte vergleichen | 172–173 | **Flächeninhalt und Umfang** (S. 172–173, 180–186) | Auslegen mit gleich großen Plättchen, Kästchen zählen, Zerlegen |
| 2 Flächeneinheiten | 174–177 | **Flächeneinheiten** *(neu in v112)* | km², ha, a, m², dm², cm², mm²; Umrechnungszahl 100; Stellenwerttafel mit zwei Spalten (Z, E) je Einheit; gemischte Schreibweise (7 a 50 m²); Rechnen nur in derselben Einheit |
| 3 Flächeninhalt eines Rechtecks | 180–183 | Flächeninhalt und Umfang | A = a · b, Quadrat A = a · a = a²; Seite über die Umkehraufgabe; zusammengesetzte Figuren zerlegen oder ergänzen |
| 4 Umfang von Figuren | 184–186 | Flächeninhalt und Umfang | Umfang = Summe aller Randstrecken; u = 2 · a + 2 · b = 2 · (a + b); Quadrat u = 4 · a |
| 5 Quader und Netze | 187–190 | **Quader, Netze, Schrägbilder** (S. 187–193) | Körper, Quader: 8 Ecken, 12 Kanten, 6 Seitenflächen; Länge, Breite, Höhe; Würfel; Netz |
| 6 Schrägbilder | 191–193 | Quader, Netze, Schrägbilder | Kavalierperspektive: vordere Fläche in wahrer Größe, nach hinten schräg auf der Kästchendiagonale und auf die Hälfte verkürzt, verdeckte Kanten gestrichelt |
| 7 Rauminhalte vergleichen | 194–196 | **Volumen und Oberflächeninhalt** (S. 194–196, 201–207) | Rauminhalt oder Volumen; Zerlegen in gleich große Würfel |
| 8 Volumeneinheiten | 197–200 | **Volumeneinheiten** *(neu in v112)* | m³, dm³, cm³, mm³ (Kubik-…); 1 dm³ = 1 l, 1 cm³ = 1 ml; Umrechnungszahl 1000; Stellenwerttafel mit drei Spalten (H, Z, E) je Einheit; cl, dl, hl nur in einer Aufgabe |
| 9 Volumen eines Quaders | 201–204 | Volumen und Oberflächeninhalt | V = a · b · c, Würfel V = a³; Grundfläche · Höhe; vorher in dieselbe Einheit umrechnen |
| 10 Oberflächeninhalt von Quadern und Würfeln | 205–207 | Volumen und Oberflächeninhalt | A<sub>O</sub> = 2 · a · b + 2 · a · c + 2 · b · c, Würfel A<sub>O</sub> = 6 · a² |
| WVV, Exkursion „Sportplätze“, Rückblick, Test | 208–215 | | |

## Was am 15.11.2026 geändert wurde (v112)

- **Bereiche = Buchkapitel I–V** (vorher: „Brüche & Dezimalzahlen“ zusammen und ein eigener Bereich „Mathe im Alltag“). Alltag-Themen
  verteilt: Fermi und Geld zu I, Größen und Zeit zu III. **Reihenfolge** wie die Lerneinheiten, **jedes Thema mit Seitenhinweis**.
- **Fünf neue Themen:** Fachbegriffe (I, 3), Brüche vergleichen (II, 3), Prozente (II, 4), Flächeneinheiten (V, 2), Volumeneinheiten (V, 8),
  je mit Erklär-Animation (Beispiel vorher, Lösung nachher), Knobel-Aufgaben und Symbol. MaDax hat jetzt **41 Themen**.
- **Titel wie im Buch:** Rechenvorteile, Teilbarkeit, Sachaufgaben systematisch lösen, Bruch und Anteil, Unechte und gemischte Brüche,
  Dezimalschreibweise, Dezimalzahlen vergleichen, Größenangaben in Kommaschreibweise, Senkrechte und parallele Geraden, Winkel,
  Winkel an sich schneidenden Geraden, Symmetrie und Verschiebungen, Flächeninhalt und Umfang, Quader, Netze, Schrägbilder,
  Volumen und Oberflächeninhalt.
- **Begriffe wie im Buch:** Kommutativ-, Assoziativ-, Distributivgesetz ohne die deutschen Ersatznamen (dafür „Summanden oder Faktoren
  vertauschen“, „Klammern setzen oder weglassen“, „ausmultiplizieren oder ausklammern“); Grundzahl/Hochzahl (oder Basis/Exponent);
  Endstellen- und Quersummenregel; gemischter Bruch, unechter Bruch; Scheitelpunkt; die vier Schritte bei Sachaufgaben.
- **Rechenwege wie im Buch:** schriftliches Subtrahieren und Multiplizieren (siehe oben), Primfaktorzerlegung als Kette mit
  Potenzschreibweise, „übertrage“ statt „merke“.

## Was bewusst offen bleibt

- **Zeichnen** (Winkel, Parallelen, Spiegeln, Schrägbilder) bleibt Handarbeit mit Geodreieck und Heft. MaDax übt das Ablesen und Erkennen.
- **Diagramme** (Grundwissen S. 224, Runden beim Erstellen S. 12) sind kein eigenes Thema.
- **Verhältnisse** (S. 63) und **alle Teiler aus der Primfaktorzerlegung** (S. 35–36) sind noch keine eigene Aufgabenart.
- **Drehsymmetrie mit Drehwinkel** (Quadrat 90°, 180°, 270°) ist noch keine eigene Aufgabenart in „Symmetrie und Verschiebungen“.
- Erkundungen, Exkursionen und „Wiederholen – Vertiefen – Vernetzen“ sind keine eigenen Themen; die Exkursionen zu römischen Zahlen
  und zum Zweiersystem stehen unter „Entdecken“.
