// Themen-Symbole für GeDax (Geschichte): kleine, selbst gezeichnete Bilder. Schlüssel = Themen-ID.
// Fehlt ein Symbol, zeigt die App das Zeichen aus `icon` im Thema. viewBox 0 0 24 24, Linien in Schriftfarbe.
window.GeDaxIcons = (function () {
  const W = 'currentColor';
  const F = `fill="${W}" stroke="none"`;
  const I = {
    // Quellen: Lupe über einer Scherbe
    'g5-quellen': `<path d="M3 15l5-6 6 2 1 6-7 3z" ${F} opacity=".35"/><circle cx="15" cy="9" r="5"/><path d="M18.5 12.5L22 16"/>`,
    // Zeitstrahl: Pfeil mit Strichen, Mitte betont
    'g5-zeitstrahl': `<path d="M2 13h19"/><path d="M18.5 10l3 3-3 3"/><path d="M6 11v4M10 11v4M15 11v4"/><path d="M12 7v12" stroke-width="2.6"/>`,
    // Jahrhunderte: Lineal mit einem farbigen Abschnitt
    'g5-jh': `<rect x="2" y="8" width="20" height="8" rx="1.5"/><rect x="9" y="8" width="6" height="8" ${F}/><path d="M5.5 8v3M18.5 8v3"/>`,
    // Wie lange her: Bogen über dem Zeitstrahl
    'g5-rechnen': `<path d="M2 18h20"/><circle cx="5" cy="18" r="1.8" ${F}/><circle cx="19" cy="18" r="1.8" ${F}/><path d="M5 15C7 6 17 6 19 15"/><path d="M16.5 13.5l2.5 1.5.5-2.8"/>`,
    // Zeitabschnitte: vier Blöcke hintereinander
    'g5-epochen': `<rect x="2" y="9" width="4.5" height="7" rx="1"/><rect x="7.5" y="9" width="4.5" height="7" rx="1" ${F}/><rect x="13" y="9" width="4.5" height="7" rx="1"/><rect x="18.5" y="9" width="3.5" height="7" rx="1" ${F}/>`,
    // Entwicklung zum Menschen: gebückte und aufrechte Figur
    'g5-mensch': `<circle cx="6.5" cy="7.5" r="2"/><path d="M6.5 9.5c-1 2-2.5 3-2.5 5.5M5.5 15l-1 5M6 15l2 5M6.5 11l3 2"/><circle cx="17" cy="4.5" r="2" ${F}/><path d="M17 6.5v8M17 14.5l-2 6M17 14.5l2 6M17 9l-3 2.5M17 9l3 2.5"/>`,
    // Altsteinzeit: Faustkeil
    'g5-alt': `<path d="M12 2.5c4 3 5.5 9 4.5 13-.8 3.5-8.2 3.5-9 0-1-4 .5-10 4.5-13z" ${F} opacity=".85"/><path d="M12 6l-1.5 4 2 3" stroke="#fff" stroke-width="1.5"/>`,
    // Höhlenmalerei: Hand an der Felswand
    'g5-hoehle': `<path d="M3 21V9c3-6 15-6 18 0v12"/><path d="M10 19v-5.5M12 19v-6.5M14 19v-6M8.6 19.5c-.8-1.6-1.8-2.4-2.6-2.2M10 19h4.6c.6 0 1-.5 1-1.2v-3.3"/>`,
    // Jungsteinzeit: Ähre
    'g5-jung': `<path d="M12 22V6"/><path d="M12 9c-2-1-3.5-3-3.5-5 2 .5 3.5 2.5 3.5 5zM12 9c2-1 3.5-3 3.5-5-2 .5-3.5 2.5-3.5 5zM12 14c-2-1-3.5-3-3.5-5 2 .5 3.5 2.5 3.5 5zM12 14c2-1 3.5-3 3.5-5-2 .5-3.5 2.5-3.5 5z" ${F}/>`,
    // Alt oder Jung: Waage
    'g5-altjung': `<path d="M12 4v16M7 20h10M4 7h16"/><path d="M4 7l-2.5 6h5zM20 7l-2.5 6h5z"/><path d="M1.5 13a2.5 1.5 0 0 0 5 0M17.5 13a2.5 1.5 0 0 0 5 0" ${F}/>`,
    // Ötzi: Berg mit Gletscher und Beil
    'g5-oetzi': `<path d="M2 20l7-12 4 6 3-4 6 10z"/><path d="M9 8l1.6 2.7-1.6.8-1.4-1z" ${F}/><path d="M14 18l5-6" stroke-width="2.4"/><path d="M17.5 11.2l2.8 1.5-1 1.8z" ${F}/>`,
    // Metall: Hammer und Amboss
    'g5-metall': `<path d="M4 15h13l-2 3H7z" ${F}/><path d="M9 18v3h6v-3"/><path d="M14 3l5 5M12.5 8.5l4-4 3 3-4 4zM14.5 10.5L8 4"/>`,
    // Himmelsscheibe: Scheibe mit Mond, Sonne und Sternen
    'g5-nebra': `<circle cx="12" cy="12" r="9.5"/><circle cx="8" cy="9" r="2.4" ${F}/><path d="M15 7a4 4 0 1 0 2 7a3.2 3.2 0 1 1-2-7z" ${F}/><circle cx="11" cy="16" r=".9" ${F}/><circle cx="13" cy="17" r=".9" ${F}/><circle cx="12.5" cy="15" r=".9" ${F}/>`,
    // Nil: Fluss mit Delta
    'g5-nil': `<path d="M12 22c-1-4 2-7 0-11"/><path d="M12 11L7 3M12 11V3M12 11l5-8"/><path d="M3 21h4M17 21h4"/>`,
    // Pharao: Krone
    'g5-staat': `<path d="M6 21h12M7 21l-1-9 3 2 3-7 3 7 3-2-1 9"/><circle cx="12" cy="16" r="1.4" ${F}/>`,
    // Hieroglyphen: Auge, Vogel, Wellen
    'g5-schrift': `<path d="M3 7c2-2.5 6-2.5 8 0-2 2.5-6 2.5-8 0z"/><circle cx="7" cy="7" r="1" ${F}/><path d="M14 4c3 0 5 2 5 4h-3l-2 3h-1"/><path d="M3 16l2-2 2 2 2-2 2 2 2-2 2 2 2-2 2 2 2-2"/><path d="M3 20h18"/>`,
    // Gesellschaftspyramide: gestufte Pyramide
    'g5-gesellschaft': `<rect x="9.5" y="3" width="5" height="4" rx=".6" ${F}/><rect x="7" y="8" width="10" height="4" rx=".6"/><rect x="4.5" y="13" width="15" height="4" rx=".6"/><rect x="2" y="18" width="20" height="4" rx=".6"/>`,
    // Götter Ägyptens: Sonnenscheibe mit Strahlen
    'g5-religion-ag': `<circle cx="12" cy="12" r="4.5" ${F}/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M4.9 19.1L7 17M17 7l2.1-2.1"/>`,
    // Jenseits: Mumie
    'g5-jenseits': `<path d="M8 4c0-1.5 8-1.5 8 0v15c0 2-8 2-8 0z"/><path d="M8 8l8 2M8 11l8 2M8 14l8 2M8 17l8 1.5"/>`,
    // Pyramiden: zwei Pyramiden mit Sonne
    'g5-pyramiden': `<path d="M2 20l7-12 7 12z" ${F} opacity=".85"/><path d="M12 20l5-8 5 8z"/><circle cx="19" cy="5" r="2"/>`,
    // Hochkultur: Säulentempel
    'g5-hochkultur': `<path d="M3 9l9-5 9 5z"/><path d="M5 10v8M9.5 10v8M14.5 10v8M19 10v8"/><path d="M3 20h18"/>`,
    // Land und Kolonien: Segelschiff
    'g5-land': `<path d="M3 16h18l-3 4H6z" ${F}/><path d="M12 3v13"/><path d="M12 4l7 10h-7zM12 6l-5 8h5"/>`,
    // Olympia: Lorbeerkranz
    'g5-olympia': `<path d="M7 20C3 16 3 9 7 5M17 20c4-4 4-11 0-15"/><path d="M5 9l-2-1M4.5 13l-2 0M5.5 17l-2 1M19 9l2-1M19.5 13l2 0M18.5 17l2 1"/><path d="M9 20h6"/>`,
    // Götter der Griechen: Blitz
    'g5-religion-gr': `<path d="M13 2L5 14h6l-2 8 9-13h-6z" ${F}/>`,
    // Quellen über die Griechen: Amphore
    'g5-quellen-gr': `<path d="M9 2h6M10 2v3c-3 1.5-5 4-5 8 0 4 3 7 4 9h6c1-2 4-5 4-9 0-4-2-6.5-5-8V2"/><path d="M7 11h10M7.5 15h9"/>`,
    // Wirtschaft: Münze mit Eule
    'g5-wirtschaft': `<circle cx="12" cy="12" r="9.5"/><ellipse cx="12" cy="13.5" rx="3.6" ry="5"/><circle cx="10.4" cy="10" r="1.3" ${F}/><circle cx="13.6" cy="10" r="1.3" ${F}/>`,
    // Demokratie: Hand hebt sich, Stimmzettel
    'g5-demokratie': `<path d="M4 21v-5h16v5z"/><path d="M9 16V9.5a1.5 1.5 0 0 1 3 0V8a1.5 1.5 0 0 1 3 0v8"/><path d="M12 9.5V16"/><path d="M15 12.5a1.5 1.5 0 0 1 3 0V16"/>`,
    // Leben in Athen: Haus mit Innenhof
    'g5-athen': `<rect x="3" y="5" width="18" height="15" rx="1"/><rect x="8" y="9.5" width="8" height="6" ${F} opacity=".3"/><path d="M11 20v-3h2v3"/>`,
    // Sparta: Rundschild mit Lambda
    'g5-sparta': `<circle cx="12" cy="12" r="9.5"/><path d="M8 17l4-10 4 10"/>`,
    // Vergleich: zwei Säulen mit Doppelpfeil
    'g5-vergleich': `<path d="M4 20V8M8 20V8M3 6h6M3 20h6M16 20V8M20 20V8M15 6h6M15 20h6"/><path d="M10 13h4M10.5 11.5L9 13l1.5 1.5M13.5 11.5L15 13l-1.5 1.5"/>`,
    // Mensch und Natur: Baum und Stumpf
    'g5-natur': `<circle cx="8" cy="8" r="5" ${F} opacity=".85"/><path d="M8 13v8"/><path d="M15 21v-4h4v4"/><path d="M14 17h6"/><path d="M3 21h19"/>`,
  };
  function svg(id) {
    const body = I[id];
    if (!body) return null;
    return `<svg viewBox="0 0 24 24" width="100%" height="100%" fill="none" stroke="${W}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${body}</svg>`;
  }
  return { svg, ids: Object.keys(I) };
})();
