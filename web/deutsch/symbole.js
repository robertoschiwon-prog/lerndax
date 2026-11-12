// Themen-Symbole für DeDax (Deutsch): kleine, selbst gezeichnete Bilder. Schlüssel = Themen-ID.
// Fehlt ein Symbol, zeigt die App das Zeichen aus `icon` im Thema. viewBox 0 0 24 24, Linien in Schriftfarbe.
window.DeDaxIcons = (function () {
  const W = 'currentColor';
  const F = `fill="${W}" stroke="none"`;
  const I = {
    // Substantive: Anhänger-Schild (ein Name für ein Ding)
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
    'd5-wortarten': `<circle cx="7" cy="7.5" r="4"/><rect x="13.5" y="3.5" width="7.5" height="7.5" rx="1.2" ${F}/><path d="M12 13.5l5.5 8h-11z"/>`,
    // Satzglieder: drei Wagen hintereinander
    'd5-satzglieder': `<rect x="1.5" y="8" width="6" height="7" rx="1.2"/><rect x="9" y="8" width="6" height="7" rx="1.2" ${F}/><rect x="16.5" y="8" width="6" height="7" rx="1.2"/><path d="M3 18.5h18"/>`,
    // Subjekt und Prädikat: Figur und Bewegungspfeil
    'd5-subjekt': `<circle cx="7" cy="6.5" r="3" ${F}/><path d="M2.5 20c0-4 2-6.5 4.5-6.5s4.5 2.5 4.5 6.5"/><path d="M14 12h7"/><path d="M18 8.8 21.2 12 18 15.2"/>`,
    // Objekte: Geschenk (jemandem etwas geben)
    'd5-objekte': `<rect x="4" y="10" width="16" height="10" rx="1.5"/><path d="M3 10h18V7H3z"/><path d="M12 7v13"/><path d="M12 7c-1.5-3.5-5-3.5-4.5-1s3 1 4.5 1c1.5 0 4-1 4.5-1s-3-2.5-4.5 1"/>`,
    // Attribute: Substantiv mit Schmuck-Stern davor
    'd5-attribute': `<path d="M6.5 4l1.300 2.900 3.200.3-2.400 2.100.7 3.100-2.800-1.700-2.800 1.700.7-3.100L2 7.200l3.200-.3z" ${F}/><rect x="11" y="13" width="10.5" height="7" rx="1.5"/>`,
    // Hauptsatz und Nebensatz: großer und kleiner Kasten mit Komma dazwischen
    'd5-nebensatz': `<rect x="2" y="6" width="10" height="9" rx="1.5"/><rect x="16" y="8.5" width="6" height="6.5" rx="1.5" ${F}/><path d="M14 14.5c.300 1.5-.300 2.800-1.200 3.800"/>`,
    // Satzarten: Punkt, Fragezeichen, Ausrufezeichen
    'd5-satzarten': `<circle cx="4.5" cy="18.5" r="1.600" ${F}/><path d="M9 8c0-2.200 1.400-3.5 3.200-3.5S15.5 5.800 15.5 7.700c0 2.300-3.200 2.600-3.200 5.300"/><circle cx="12.300" cy="18.5" r="1.300" ${F}/><path d="M19.5 4.5v9"/><circle cx="19.5" cy="18.5" r="1.300" ${F}/>`,
    // Komma: ein großes Komma zwischen zwei Strichen
    'd5-komma': `<path d="M2.5 9h6"/><path d="M15.5 9h6"/><circle cx="12" cy="12.5" r="2.300" ${F}/><path d="M14 12.5c.400 3.200-1 5.600-3.5 7.5"/>`,
    // Wörtliche Rede: Sprechblase mit Anführungszeichen
    'd5-rede': `<path d="M3 5.5h18v10.5H11l-4.5 4v-4H3z"/><path d="M8 9.200v3M10.5 9.200v3M14 9.200v3M16.5 9.200v3"/>`,
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
