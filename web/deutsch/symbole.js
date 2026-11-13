// Themen-Symbole für DeDax (Deutsch): kleine, selbst gezeichnete Bilder. Schlüssel = Themen-ID.
// Fehlt ein Symbol, zeigt die App das Zeichen aus `icon` im Thema. viewBox 0 0 24 24, Linien in Schriftfarbe.
window.DeDaxIcons = (function () {
  const W = 'currentColor';
  const F = `fill="${W}" stroke="none"`;
  const I = {
    // Nomen: Anhänger-Schild (ein Name für ein Ding)
    'd5-substantive': `<path d="M3 5h8.5L21 14.5 14.5 21 3 12.5z"/><circle cx="7.6" cy="9.4" r="1.6" ${F}/>`,
    // Die vier Fälle: vier Felder, eines ist gefüllt
    'd5-faelle': `<rect x="3" y="3" width="7.5" height="7.5" rx="1.5"/><rect x="13.5" y="3" width="7.5" height="7.5" rx="1.5"/><rect x="3" y="13.5" width="7.5" height="7.5" rx="1.5" ${F}/><rect x="13.5" y="13.5" width="7.5" height="7.5" rx="1.5"/>`,
    // Pronomen: langes Wort wird zum kurzen (Pfeil von großem zu kleinem Kasten)
    'd5-pronomen': `<rect x="2.5" y="4" width="14" height="6.5" rx="1.5"/><path d="M9.5 10.5v4.5h5"/><path d="M12.2 12.6l2.6 2.4-2.6 2.4"/><rect x="15.5" y="12.5" width="6" height="6.5" rx="1.5" ${F}/>`,
    // Adjektive steigern: drei wachsende Türme
    'd5-adjektive': `<rect x="3" y="14" width="4.6" height="7" rx="1"/><rect x="9.7" y="9.5" width="4.6" height="11.5" rx="1"/><rect x="16.4" y="3.5" width="4.6" height="17.5" rx="1" ${F}/>`,
    // Verbformen: Wortstamm mit ansteckbarer Endung
    'd5-verbformen': `<rect x="2.5" y="8" width="11" height="8" rx="1.5"/><rect x="16" y="8" width="5.5" height="8" rx="1.5" ${F}/><path d="M13.5 12h2.5"/>`,
    // Wortarten erkennen: drei verschiedene Formen
    // Präpositionen: Kasten und ein Punkt darunter (unter dem Tisch)
    'd5-praep': `<path d="M3 10h18M6 10v9M18 10v9"/><circle cx="12" cy="16.5" r="2.6" ${F}/>`,
    // Adverbien: Uhr mit Pfeil (wann? wo?)
    'd5-adverb': `<circle cx="10" cy="12" r="7"/><path d="M10 8v4l3 2"/><path d="M19 6l3 3-3 3" />`,
    // adverbiale Bestimmungen: Kompass
    'd5-adverbial': `<circle cx="12" cy="12" r="9"/><path d="M15.5 8.5l-2 5-5 2 2-5z" ${F}/>`,
    // Satzreihe: zwei gleich große Kästen, verbunden
    'd5-satzreihe': `<rect x="2" y="7" width="8.5" height="9" rx="1.5"/><rect x="13.5" y="7" width="8.5" height="9" rx="1.5" ${F}/><path d="M10.5 11.5h3"/>`,
    // Theater: Vorhang
    'd5-theater': `<path d="M3 4h18v16"/><path d="M3 4v16"/><path d="M3 4c2 5 4 8 7 9M21 4c-2 5-4 8-7 9" ${F}/>`,
    // Film: Kamera
    'd5-kamera': `<rect x="2.5" y="8" width="13" height="10" rx="2"/><path d="M15.5 11l6-3v10l-6-3z" ${F}/><circle cx="6" cy="5" r="2.2"/><circle cx="12" cy="5" r="2.2"/>`,
    // Konjunktion: zwei Kettenglieder
    'd5-konj': `<rect x="2" y="8" width="11" height="8" rx="4"/><rect x="11" y="8" width="11" height="8" rx="4" ${F}/>`,
    'd5-wortarten': `<circle cx="7" cy="7.5" r="4"/><rect x="13.5" y="3.5" width="7.5" height="7.5" rx="1.2" ${F}/><path d="M12 13.5l5.5 8h-11z"/>`,
    // Satzglieder: drei Wagen hintereinander
    'd5-satzglieder': `<rect x="1.5" y="8" width="6" height="7" rx="1.2"/><rect x="9" y="8" width="6" height="7" rx="1.2" ${F}/><rect x="16.5" y="8" width="6" height="7" rx="1.2"/><path d="M3 18.5h18"/>`,
    // Subjekt und Prädikat: Figur und Bewegungspfeil
    'd5-subjekt': `<circle cx="7" cy="6.5" r="3" ${F}/><path d="M2.5 20c0-4 2-6.5 4.5-6.5s4.5 2.5 4.5 6.5"/><path d="M14 12h7"/><path d="M18 8.8 21.2 12 18 15.2"/>`,
    // Objekte: Geschenk (jemandem etwas geben)
    'd5-objekte': `<rect x="4" y="10" width="16" height="10" rx="1.5"/><path d="M3 10h18V7H3z"/><path d="M12 7v13"/><path d="M12 7c-1.5-3.5-5-3.5-4.5-1s3 1 4.5 1c1.5 0 4-1 4.5-1s-3-2.5-4.5 1"/>`,
    // Attribute: Nomen mit Schmuck-Stern davor
    'd5-attribute': `<path d="M6.5 4l1.300 2.900 3.2.3-2.400 2.100.7 3.100-2.8-1.7-2.8 1.7.7-3.100L2 7.2l3.2-.3z" ${F}/><rect x="11" y="13" width="10.5" height="7" rx="1.5"/>`,
    // Hauptsatz und Nebensatz: großer und kleiner Kasten mit Komma dazwischen
    'd5-nebensatz': `<rect x="2" y="6" width="10" height="9" rx="1.5"/><rect x="16" y="8.5" width="6" height="6.5" rx="1.5" ${F}/><path d="M14 14.5c.300 1.5-.300 2.8-1.2 3.8"/>`,
    // Satzarten: Punkt, Fragezeichen, Ausrufezeichen
    'd5-satzarten': `<circle cx="4.5" cy="18.5" r="1.6" ${F}/><path d="M9 8c0-2.2 1.400-3.5 3.2-3.5S15.5 5.8 15.5 7.7c0 2.300-3.2 2.6-3.2 5.300"/><circle cx="12.300" cy="18.5" r="1.300" ${F}/><path d="M19.5 4.5v9"/><circle cx="19.5" cy="18.5" r="1.300" ${F}/>`,
    // Komma: ein großes Komma zwischen zwei Strichen
    'd5-komma': `<path d="M2.5 9h6"/><path d="M15.5 9h6"/><circle cx="12" cy="12.5" r="2.300" ${F}/><path d="M14 12.5c.400 3.2-1 5.6-3.5 7.5"/>`,
    // Wörtliche Rede: Sprechblase mit Anführungszeichen
    'd5-rede': `<path d="M3 5.5h18v10.5H11l-4.5 4v-4H3z"/><path d="M8 9.2v3M10.5 9.2v3M14 9.2v3M16.5 9.2v3"/>`,
    // Lange Vokale: gedehnter Strich
    'd5-lang': `<path d="M3 12h18"/><path d="M3 8.5v7M21 8.5v7"/>`,
    // Kurze Vokale: Punkt (kurz) und zwei gleiche Striche (Doppelkonsonant)
    'd5-kurz': `<circle cx="5.5" cy="12" r="2.4" ${F}/><path d="M13 5.5v13M18.5 5.5v13"/>`,
    // Verlängern: Wort mit angesetztem Stück
    'd5-ableiten': `<rect x="2" y="8.5" width="10" height="7" rx="1.5"/><path d="M12 12h3.5"/><rect x="15.5" y="8.5" width="6.5" height="7" rx="1.5" stroke-dasharray="2.2 2.2"/>`,
    // s-Laute: geschwungenes S
    'd5-slaute': `<path d="M17 6.5c-1-1.7-2.8-2.5-5-2.5-3 0-5 1.5-5 3.8 0 5 10.5 2.7 10.5 8.2 0 2.5-2.2 4-5.5 4-2.6 0-4.6-1-5.5-3"/>`,
    // Groß und klein: großer und kleiner Balken
    'd5-gross': `<path d="M3 20 8 4l5 16"/><path d="M5 14.5h6"/><circle cx="18" cy="16" r="3.5"/><path d="M21.5 12.5v7.5"/>`,
    // Silben: Wort mit Schnitt in der Mitte
    'd5-silben': `<rect x="2" y="8.5" width="8" height="7" rx="1.5"/><rect x="14" y="8.5" width="8" height="7" rx="1.5"/><path d="M12 4v16" stroke-dasharray="2.5 2.5"/>`,
    // Zusammengesetzte Wörter: zwei Puzzleteile
    'd5-zusammen': `<path d="M2.5 7.5h8v3.2a1.9 1.9 0 1 1 0 3.6v3.2h-8z"/><path d="M13.5 7.5h8v10h-8v-3.2a1.9 1.9 0 1 0 0-3.6z" ${F}/>`,
    // Vorsilben und Nachsilben: Stamm mit Baustein vorn und hinten
    'd5-ableitung': `<rect x="1.5" y="9" width="5" height="6" rx="1.2" ${F}/><rect x="8.5" y="7.5" width="7" height="9" rx="1.5"/><rect x="17.5" y="9" width="5" height="6" rx="1.2" ${F}/>`,
    // Wortfamilie: Baum mit Stamm und Krone
    'd5-wortfamilie': `<path d="M12 21v-9"/><path d="M12 15l-4-3.5M12 13l4-3.5"/><circle cx="12" cy="7.5" r="5.5"/>`,
    // Wortfeld: Wolke
    'd5-wortfeld': `<path d="M7 18.5a4 4 0 0 1-.5-8 5.5 5.5 0 0 1 10.6-1.2A4.6 4.6 0 0 1 17.5 18.5z"/>`,
    // Märchen: Krone
    'd5-maerchen': `<path d="M3 17.5 4.5 7l4.5 5 3-7 3 7 4.5-5L21 17.5z"/><path d="M3 20.5h18"/>`,
    // Gedicht: vier Verse, zwei Reimpaare (gleich lange Zeilen)
    'd5-gedicht': `<path d="M3 5.5h13M3 10h9M3 14.5h13M3 19h9"/><circle cx="20" cy="5.5" r="1.4" ${F}/><circle cx="20" cy="14.5" r="1.4" ${F}/>`,
    // Sprachliche Bilder: Bilderrahmen mit Sonne und Berg
    'd5-bilder': `<rect x="2.5" y="4" width="19" height="16" rx="2"/><circle cx="8" cy="9.5" r="2" ${F}/><path d="M4.5 18l5.5-5.5 3.5 3.5 2.5-2.5 3.5 4.5"/>`,
    // Textsorten: Blatt mit Zeilen und Stift
    'd5-textsorten': `<path d="M5 3h10l4 4v14H5z"/><path d="M8.5 9.5h6M8.5 13h7M8.5 16.5h4.5"/>`,
    // Sachtexte und Schaubilder: Balkendiagramm
    'd5-sachtext': `<path d="M3 3v18h18"/><rect x="6.5" y="12" width="3.2" height="6" ${F}/><rect x="11.5" y="7.5" width="3.2" height="10.5" ${F}/><rect x="16.5" y="10" width="3.2" height="8" ${F}/>`,
    // Zeitformen: Zeitstrahl mit drei Punkten, der mittlere („jetzt“) ist groß
    'd5-zeitformen': `<path d="M2 14h19"/><path d="M18.5 10.8 21.8 14l-3.3 3.2"/><circle cx="5.5" cy="14" r="1.7" ${F}/><circle cx="11.5" cy="14" r="3.1" ${F}/><path d="M11.5 3.5v4.5"/><path d="M9.4 6.2l2.1 2.1 2.1-2.1"/>`,
  };
  function svg(id) {
    const body = I[id];
    if (!body) return null;
    return `<svg viewBox="0 0 24 24" width="100%" height="100%" fill="none" stroke="${W}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${body}</svg>`;
  }
  return { svg, ids: Object.keys(I) };
})();
