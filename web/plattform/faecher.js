/* LernDax – alle Fächer an einer Stelle
 *
 * Namensschema: Kürzel aus dem sächsischen Stundenplan + „Dax“ (MaDax, DeDax, EnDax …).
 * Die Kürzel folgen den amtlichen Fächerabkürzungen in Sachsen (VwV Stundentafeln).
 * Auf jeder Kachel steht zusätzlich der ausgeschriebene Fachname.
 *
 * Felder:
 *   id:      Ordnername unter web/ und Schlüssel für den Lernstand (nie mehr ändern!)
 *   kuerzel: Kürzel wie im Stundenplan
 *   name:    Name in LernDax (Kürzel + Dax)
 *   fach:    ausgeschriebener Fachname
 *   fachAb:  anderer Fachname ab einer Klassenstufe, z. B. { 7: 'Informatik' } (TecDax: TC in 5–6, Informatik ab 7)
 *   icon:    Zeichen auf der Kachel
 *   dachs:   Dachs mit Fach-Hut (Kopfzeile im Fach, Lob nach der Runde); fehlt, solange der Hut noch nicht gezeichnet ist
 *   farbe:   Kachelfarbe
 *   klassen: [von, bis] laut Stundentafel Sachsen (Grundschule 1–4, Gymnasium 5–10)
 *   gruppe:  'kern' (Hauptfach) | 'sach' (Sachfach) | 'sprache2' (2. Fremdsprache, nur die gewählte) | 'vielleicht'
 *   status:  'fertig' | 'geplant' | 'vielleicht'
 *   fertig:  Klassenstufen, die in LernDax schon fertig sind
 *   href, key, themen: nur für fertige Fächer (Link, Lernstand im Browser, Anzahl Themen)
 *   entdecken: Text der „Entdecken“-Karte auf der Startseite (nur wenn das Fach Entdeckungen hat)
 *
 * Nicht vorgesehen: Sport, Werken, Religion, Profil (lassen sich kaum sinnvoll am Bildschirm üben).
 */
window.LERNDAX_FAECHER = [
  // Hauptfächer
  { id: 'mathe', dachs: 'icons/madax.svg',    kuerzel: 'Ma',  name: 'MaDax',  fach: 'Mathe',    icon: '×',  farbe: '#ff6b3d', klassen: [1, 10], gruppe: 'kern', status: 'fertig',  fertig: [5], href: 'mathe/', key: 'mathelix.v1', themen: 36, entdecken: 'Mathe zum Staunen: Gedankenlesen, das Galton-Brett, π und mehr' },
  { id: 'deutsch', dachs: 'icons/dedax.svg',  kuerzel: 'De',  name: 'DeDax',  fach: 'Deutsch',  icon: 'De', farbe: '#3d7bff', klassen: [1, 10], gruppe: 'kern', status: 'fertig',  fertig: [5], href: 'deutsch/', key: 'dedax.v1', themen: 37, entdecken: 'Sprache zum Staunen: Geheimschrift, Riesenwörter, Sächsisch und mehr' },
  { id: 'englisch', dachs: 'icons/endax.svg', kuerzel: 'En',  name: 'EnDax',  fach: 'Englisch', icon: 'En', farbe: '#14a06c', klassen: [3, 10], gruppe: 'kern', status: 'fertig',  fertig: [5], href: 'englisch/', key: 'endax.v1', themen: 53, entdecken: 'Englisch zum Staunen: falsche Freunde, stumme Buchstaben, Pfund und Pence' },

  // Sachfächer
  { id: 'sachunterricht', kuerzel: 'Su',  name: 'SuDax',  fach: 'Sachunterricht', icon: 'Su',  farbe: '#e9a800', klassen: [1, 4],  gruppe: 'sach', status: 'geplant', fertig: [] },
  { id: 'bio', dachs: 'icons/biodax.svg',            kuerzel: 'Bio', name: 'BioDax', fach: 'Biologie',       icon: 'Bio', farbe: '#4caf50', klassen: [5, 10], gruppe: 'sach', status: 'fertig', fertig: [5], href: 'bio/', key: 'biodax.v1', themen: 49, entdecken: 'Biologie zum Staunen: vom Laich zum Frosch, der Axolotl, die Fledermaus, der Urvogel' },
  { id: 'geschichte', dachs: 'icons/gedax.svg',     kuerzel: 'Ge',  name: 'GeDax',  fach: 'Geschichte',     icon: 'Ge',  farbe: '#a0522d', klassen: [5, 10], gruppe: 'sach', status: 'fertig', fertig: [5], href: 'geschichte/', key: 'gedax.v1', themen: 31, entdecken: 'Geschichte zum Staunen: die Erdgeschichte als ein Tag, Steinzeit-Brunnen in Sachsen, Alexander der Große' },
  { id: 'geografie', dachs: 'icons/geodax.svg',      kuerzel: 'Geo', name: 'GeoDax', fach: 'Geografie',      icon: 'Geo', farbe: '#0e9fb5', klassen: [5, 10], gruppe: 'sach', status: 'geplant', fertig: [] },
  { id: 'technik', dachs: 'icons/tecdax.svg',        kuerzel: 'TC',  name: 'TecDax', fach: 'Technik/Computer', fachAb: { 7: 'Informatik' }, icon: 'Tc', farbe: '#5b6378', klassen: [5, 10], gruppe: 'sach', status: 'geplant', fertig: [] },
  { id: 'physik',         kuerzel: 'Ph',  name: 'PhDax',  fach: 'Physik',         icon: 'Ph',  farbe: '#8b5cf6', klassen: [6, 10], gruppe: 'sach', status: 'geplant', fertig: [] },
  { id: 'chemie',         kuerzel: 'Ch',  name: 'ChDax',  fach: 'Chemie',         icon: 'Ch',  farbe: '#d6336c', klassen: [7, 10], gruppe: 'sach', status: 'geplant', fertig: [] },
  { id: 'grw',            kuerzel: 'GRW', name: 'GrwDax', fach: 'Gemeinschaftskunde/Recht/Wirtschaft', icon: 'GRW', farbe: '#2f4b8f', klassen: [7, 10], gruppe: 'sach', status: 'geplant', fertig: [] },

  // 2. Fremdsprache ab Klasse 6 (gezeigt wird später nur die gewählte)
  { id: 'franzoesisch', kuerzel: 'Fr',  name: 'FrDax',  fach: 'Französisch', icon: 'Fr', farbe: '#1f5fbf', klassen: [6, 10], gruppe: 'sprache2', status: 'geplant', fertig: [] },
  { id: 'latein',       kuerzel: 'La',  name: 'LaDax',  fach: 'Latein',      icon: 'La', farbe: '#9c6b30', klassen: [6, 10], gruppe: 'sprache2', status: 'geplant', fertig: [] },
  { id: 'russisch',     kuerzel: 'Ru',  name: 'RuDax',  fach: 'Russisch',    icon: 'Ru', farbe: '#c0392b', klassen: [6, 10], gruppe: 'sprache2', status: 'geplant', fertig: [] },
  { id: 'spanisch',     kuerzel: 'Spa', name: 'SpaDax', fach: 'Spanisch',    icon: 'Es', farbe: '#e67e22', klassen: [6, 10], gruppe: 'sprache2', status: 'geplant', fertig: [] },

  // Vielleicht später (nur Teile lassen sich gut am Bildschirm lernen)
  { id: 'musik', kuerzel: 'Mu',  name: 'MuDax',  fach: 'Musik', icon: '♪',  farbe: '#7c4dff', klassen: [1, 10], gruppe: 'vielleicht', status: 'vielleicht', fertig: [] },
  { id: 'kunst', kuerzel: 'Ku',  name: 'KuDax',  fach: 'Kunst', icon: 'Ku', farbe: '#f06292', klassen: [1, 10], gruppe: 'vielleicht', status: 'vielleicht', fertig: [] },
  { id: 'ethik', kuerzel: 'Eth', name: 'EthDax', fach: 'Ethik', icon: 'Eth', farbe: '#607d8b', klassen: [1, 10], gruppe: 'vielleicht', status: 'vielleicht', fertig: [] },
];

/* Fachname in einer Klassenstufe (beachtet fachAb). */
window.LERNDAX_FACHNAME = function (f, klasse) {
  let n = f.fach;
  for (const ab in f.fachAb || {}) if (klasse >= +ab) n = f.fachAb[ab];
  return n;
};

/* Fächer, die es in einer Klassenstufe gibt (laut Stundentafel). */
window.LERNDAX_FAECHER_IN = function (klasse) {
  return window.LERNDAX_FAECHER.filter((f) => klasse >= f.klassen[0] && klasse <= f.klassen[1]);
};
