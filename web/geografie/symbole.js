// Themen-Symbole für GeoDax (Geografie): kleine, selbst gezeichnete Bilder. Schlüssel = Themen-ID.
// Fehlt ein Symbol, zeigt die App das Zeichen aus `icon` im Thema. viewBox 0 0 24 24, Linien in Schriftfarbe.
window.GeoDaxIcons = (function () {
  const W = 'currentColor';
  const F = `fill="${W}" stroke="none"`;
  const KUGEL = `<circle cx="12" cy="12" r="9"/>`;
  const BERG = `<path d="M2 20l7-12 4 6 3-4 6 10z"/>`;
  const WELLE = `<path d="M2 15c2-2 4-2 6 0s4 2 6 0 4-2 6 0"/><path d="M2 19c2-2 4-2 6 0s4 2 6 0 4-2 6 0"/>`;
  const HAUS = `<path d="M4 20V11l5-4 5 4v9z"/><path d="M8 20v-4h2v4"/>`;
  const I = {
    'geo5-landschaft': `${BERG}<path d="M2 20h20"/><path d="M15 20v-3h4v3"/>`,
    'geo5-weltall': `<circle cx="12" cy="12" r="3.5" ${F}/><ellipse cx="12" cy="12" rx="10" ry="4"/><circle cx="20" cy="9.5" r="1.4" ${F}/>`,
    'geo5-tagnacht': `${KUGEL}<path d="M12 3a9 9 0 0 0 0 18z" ${F}/>`,
    'geo5-jahreszeiten': `<circle cx="12" cy="12" r="3" ${F}/><ellipse cx="12" cy="12" rx="10" ry="5"/><circle cx="2.5" cy="12" r="1.6"/><circle cx="21.5" cy="12" r="1.6"/>`,
    'geo5-abbildungen': `${KUGEL}<path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18"/>`,
    'geo5-kontinente': `<path d="M3 6c3-2 6 0 6 2s-3 3-2 6-3 3-4 0 0-6 0-8z"/><path d="M13 5c3 0 6 1 8 3-1 2-3 2-3 5s-2 6-4 6-1-5-2-7-2-5 1-7z"/>`,
    'geo5-windrose': `<path d="M12 2l2.5 7.5L22 12l-7.5 2.5L12 22l-2.5-7.5L2 12l7.5-2.5z"/><path d="M12 2l2.5 7.5L12 12z" ${F}/>`,
    'geo5-gradnetz': `${KUGEL}<path d="M3 12h18M5 7h14M5 17h14M12 3v18"/><ellipse cx="12" cy="12" rx="4" ry="9"/>`,
    'geo5-atlas': `<path d="M4 4h12a3 3 0 0 1 3 3v13H7a3 3 0 0 1-3-3z"/><path d="M4 17a3 3 0 0 1 3-3h12"/>`,
    'geo5-luftbild': `<path d="M3 9h18v11H3z"/><path d="M6 13h4v4H6zM13 12h5M13 16h5"/><path d="M8 3l4 4 4-4"/>`,
    'geo5-massstab': `<path d="M2 15h20v4H2z"/><path d="M6 15v2M10 15v3M14 15v2M18 15v3"/><path d="M5 10l4-5 4 4 3-3 4 4"/>`,
    'geo5-bilder': `<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 16l5-5 4 4 3-3 6 6"/><circle cx="16" cy="9" r="1.5"/>`,
    'geo5-regenwald': `<path d="M12 21V10"/><path d="M12 10c-3-4-7-3-9-1 3 0 6 0 9 1zM12 10c3-4 7-3 9-1-3 0-6 0-9 1zM12 10c-1-4 1-7 3-8-1 3-2 5-3 8z"/>`,
    'geo5-wueste': `<path d="M2 19c4-4 8-4 12 0 2-2 5-3 8-1"/><circle cx="17" cy="6" r="3"/>`,
    'geo5-polar': `<path d="M3 20l5-9 3 4 3-7 7 12z"/><path d="M8 11l-1 3M14 8l1 4"/>`,
    'geo5-shanghai': `<path d="M3 21V11h4v10M9 21V4h5v17M16 21V9h5v12"/><path d="M2 21h20"/>`,
    'geo5-de-lage': `<path d="M12 21s-7-6-7-11a7 7 0 0 1 14 0c0 5-7 11-7 11z"/><circle cx="12" cy="10" r="2.5"/>`,
    'geo5-nachbarn': `<circle cx="12" cy="12" r="3.5" ${F}/><circle cx="12" cy="4" r="1.6"/><circle cx="20" cy="12" r="1.6"/><circle cx="12" cy="20" r="1.6"/><circle cx="4" cy="12" r="1.6"/><circle cx="18" cy="6" r="1.6"/><circle cx="6" cy="18" r="1.6"/>`,
    'geo5-laender': `<path d="M4 3h7v8H4zM13 3h7v5h-7zM13 10h7v11h-7zM4 13h7v8H4z"/>`,
    'geo5-bevoelkerung': `<circle cx="8" cy="8" r="2.5"/><circle cx="16" cy="8" r="2.5"/><path d="M3 20c0-4 2-7 5-7s5 3 5 7M11 20c0-4 2-7 5-7s5 3 5 7"/>`,
    'geo5-grosslandschaften': `<path d="M2 20h5l3-4 3 2 3-7 2 3 2-8 2 14"/>`,
    'geo5-gebirge': `${BERG}<path d="M9 8l1.5 2.5L12 9" />`,
    'geo5-berlin': `<path d="M3 21h18M5 21V10h14v11M4 10l8-6 8 6"/><path d="M9 21v-7M12 21v-7M15 21v-7"/>`,
    'geo5-sachsen': `<path d="M3 13l3-5 5 1 4-4 6 3-2 6-5 4-6-1z"/><circle cx="14" cy="11" r="1.4" ${F}/>`,
    'geo5-nord-ostsee': `${WELLE}<path d="M9 9l3-6 3 6"/>`,
    'geo5-kuestenformen': `<path d="M2 20h20"/><path d="M2 20V8h7l2 4v8"/><path d="M11 17c2-1 3-1 5 0s3 1 6 0"/>`,
    'geo5-gezeiten': `<path d="M15 3a7 7 0 1 0 6 10A6 6 0 0 1 15 3z"/><path d="M2 19c2-2 4-2 6 0s4 2 6 0"/>`,
    'geo5-watt': `<path d="M2 17c3-2 6-2 9 0s6 2 11 0"/><path d="M6 13c0-2 1-3 2-3s2 1 2 3"/><circle cx="16" cy="12" r="1" ${F}/><circle cx="19" cy="13" r="1" ${F}/>`,
    'geo5-kuestenschutz': `<path d="M2 20h20"/><path d="M5 20l5-8h4l5 8"/><path d="M2 16c1-1 2-1 3 0"/>`,
    'geo5-hafen': `<path d="M3 15h18l-3 5H6z"/><path d="M6 15V9h5v6M12 15v-4h6v4"/><path d="M8 9V5"/>`,
    'geo5-ruegen': `<path d="M3 20h18"/><path d="M6 20V8l6-4v16"/><path d="M14 12c2-1 4-1 6 0"/>`,
    'geo5-tiefland': `<path d="M2 18h20"/><path d="M5 18v-6M5 12l-2-2M5 12l2-2M10 18v-8M10 10l-2-2M10 10l2-2M15 18v-6M15 12l-2-2M15 12l2-2"/>`,
    'geo5-kanaele': `<path d="M2 10h20M2 18h20"/><path d="M8 10v8M16 10v8"/><path d="M10 14h4"/>`,
    'geo5-landwirtschaft': `<circle cx="7" cy="17" r="3"/><circle cx="18" cy="18" r="2"/><path d="M4 13V8h7l3 5h6v5"/>`,
    'geo5-kohle-entstehung': `<path d="M2 20h20M2 16h20"/><path d="M6 12V6M6 8l-2-2M6 8l2-2M14 12V4M14 7l-2-2M14 7l2-2"/>`,
    'geo5-braunkohle': `<path d="M3 21l6-6M7 17l2 2"/><path d="M10 13l7-7 3 3-7 7z"/><path d="M14 4l6 6"/>`,
    'geo5-rekultivierung': `<path d="M2 10l4 8h12l4-8"/><path d="M6 15c2-1 4-1 6 0s4 1 6 0"/>`,
    'geo5-stadt': `<path d="M3 21V9h5v12M10 21V4h5v17M17 21v-8h4v8"/><path d="M2 21h20"/>`,
    'geo5-dorf': `${HAUS}<path d="M14 20v-6l4-3 4 3v6"/><path d="M2 20h20"/>`,
    'geo5-umland': `<path d="M2 18h20"/><path d="M4 14h12a2 2 0 0 1 2 2v2H2v-2a2 2 0 0 1 2-2z"/><path d="M6 14V9h8v5"/>`,
    'geo5-sektoren': `<path d="M3 21V11l5 3v-3l5 3v-3l5 3V5h3v16z"/>`,
    'geo5-ballungsgebiet': `<path d="M2 21V12h4v9M7 21V7h4v14M12 21V10h3v11M16 21V5h5v16"/>`,
    'geo5-ruhrgebiet': `<path d="M4 21V9l4-3 4 3v12M16 21V3h4v18"/><path d="M6 14h4"/>`,
    'geo5-diagramme': `<path d="M3 3v18h18"/><path d="M7 17V12M11 17V7M15 17v-8M19 17v-3"/>`,
    'geo5-muenchen': `<path d="M8 21V8a2 2 0 0 1 4 0v13M14 21V8a2 2 0 0 1 4 0v13"/><path d="M3 21h18"/>`,
    'geo5-mittelgebirge': `<path d="M2 20c3-7 6-9 9-9s5 4 7 4 3-2 4-2v7z"/>`,
    'geo5-steigungsregen': `<path d="M6 13a4 4 0 0 1 1-8 5 5 0 0 1 9 1 3.5 3.5 0 0 1 1 7z"/><path d="M8 16l-1 3M12 16l-1 3M16 16l-1 3"/>`,
    'geo5-taeler': `<path d="M2 6l8 13h4l8-13"/><path d="M10 19h4"/>`,
    'geo5-gesteine': `<path d="M4 15l3-7 6-2 6 4 1 7-8 3z"/><path d="M7 8l5 5 8-3M12 13v7"/>`,
    'geo5-elbsandstein': `<path d="M3 21V9h4v12M9 21V5h5v16M16 21V11h5v10"/><path d="M7 9h2"/>`,
    'geo5-wald': `<path d="M8 21v-4M8 17l-5 0 5-7 5 7zM16 21v-4M16 17h-5l5-9 5 9z"/>`,
    'geo5-exkursion': `<path d="M6 8h12v13H6z"/><path d="M9 8V5a3 3 0 0 1 6 0v3M6 13h12"/>`,
    'geo5-kartieren': `<path d="M3 6l6-3 6 3 6-3v15l-6 3-6-3-6 3z"/><path d="M9 3v15M15 6v15"/>`,
    'geo5-bach': `<path d="M12 3c3 4 6 7 6 11a6 6 0 0 1-12 0c0-4 3-7 6-11z"/>`,
  };
  function svg(id) {
    const body = I[id];
    if (!body) return null;
    return `<svg viewBox="0 0 24 24" width="100%" height="100%" fill="none" stroke="${W}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${body}</svg>`;
  }
  return { svg, ids: Object.keys(I) };
})();
