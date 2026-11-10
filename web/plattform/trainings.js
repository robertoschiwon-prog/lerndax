/* LernDax – Trainings für einzelne Klassenarbeiten
 *
 * Jede Arbeit ist ein Eintrag. Daraus macht das Fach eine eigene Trainingsseite:
 *   <fach>/?t=<id>     z. B. mathe/?t=mathe-2026-11-24
 * Die Seite ist in der allgemeinen App NICHT verlinkt. Man erreicht sie nur über den Link
 * (z. B. aus dem Familienkalender). Sie funktioniert auch ohne Anmeldung; dann bleibt der
 * Fortschritt nur auf diesem Gerät.
 *
 * Bitte KEINE Namen von Schule, Lehrkraft oder Kind eintragen: Die Seite ist für jeden
 * erreichbar, der den Link kennt.
 *
 * Felder:
 *   fach:    'mathe' (später auch 'deutsch', 'englisch')
 *   titel:   kurze Überschrift
 *   datum:   'JJJJ-MM-TT' (Tag der Arbeit)
 *   gruppen: [{ titel, buch?, themen: [Themen-IDs aus dem Fach] }]
 *   buch:    optionale Hinweise zum Schulbuch [{ text, seiten }]
 */
window.LERNDAX_TRAININGS = {
  'mathe-2026-11-24': {
    fach: 'mathe',
    titel: 'Mathe-Arbeit',
    datum: '2026-11-24',
    gruppen: [
      { titel: 'Vorrangregeln und Rechengesetze', buch: 'S. 21–29', themen: ['k5-vorrang', 'k5-gesetze', 'k5-vorteil'] },
      { titel: 'Potenzen', buch: 'S. 30–31', themen: ['k5-potenz'] },
      { titel: 'Teilbarkeit und Primzahlen', buch: 'S. 33–37', themen: ['k5-teilbar', 'k5-prim'] },
      { titel: 'Schriftliches Dividieren', buch: 'S. 40', themen: ['k5-division'] },
      { titel: 'Querbeet: Textaufgaben', buch: 'S. 45–47', themen: ['k5-text'] },
    ],
    buch: [
      { text: 'Querbeet-Aufgaben zu allen Themen', seiten: 'S. 45–47' },
      { text: 'Rückblick mit Übungstests', seiten: 'S. 52/53' },
      { text: 'Lösungen zum Kontrollieren', seiten: 'S. 228–232' },
    ],
  },
};
