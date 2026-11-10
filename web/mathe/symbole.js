// Themen-Symbole für Mathelix: kleine, selbst gezeichnete Bilder (weiß auf Farbe).
// Schlüssel = Themen-ID aus den Generatoren. Fehlt ein Symbol, zeigt die App das Zeichen aus `icon`.
// viewBox 0 0 24 24, Linien weiß, runde Enden.
window.MathelixIcons = (function () {
  const W = '#fff';
  const F = `fill="${W}" stroke="none"`;
  const I = {
    // LB 1 Natürliche Zahlen
    'k5-runden': `<path d="M2 18h20M19 14.5v7"/><circle cx="6.5" cy="18" r="2.4" ${F}/><path d="M6.5 13.6C7.5 3.5 18 3.5 19 10.8"/><path d="M16.4 9l2.6 2.6L21.6 9"/>`,
    'k5-vorrang': `<path d="M8.5 3C4.6 7 4.6 17 8.5 21M15.5 3c3.9 4 3.9 14 0 18"/><circle cx="12" cy="12" r="2.5" ${F}/>`,
    'k5-gesetze': `<path d="M3.5 8h15"/><path d="M15 4.5 18.5 8 15 11.5"/><path d="M20.5 16h-15"/><path d="M9 12.5 5.5 16 9 19.5"/>`,
    'k5-text': `<path d="M4 4.5h16a1.5 1.5 0 0 1 1.5 1.5v9a1.5 1.5 0 0 1-1.5 1.5H10l-4.5 4v-4H4A1.5 1.5 0 0 1 2.5 15V6A1.5 1.5 0 0 1 4 4.5z"/><path d="M9.6 8.4a2.4 2.4 0 1 1 3.4 2.2c-.6.3-1 .8-1 1.5v.3"/><circle cx="12" cy="14.3" r="1.15" ${F}/>`,
    'k5-vorteil': `<path d="M13.8 2 4.8 13.6h6.4L9.6 22 19.2 9.8h-6.4z" ${F}/>`,
    'k5-potenz': [6, 12, 18].map(y => [6, 12, 18].map(x => `<circle cx="${x}" cy="${y}" r="2.3" ${F}/>`).join('')).join(''),
    'k5-division': `<path d="M4.5 12h15"/><circle cx="12" cy="5.8" r="2.3" ${F}/><circle cx="12" cy="18.2" r="2.3" ${F}/>`,
    'k5-teilbar': [6.5, 12, 17.5].map(y => `<circle cx="5.5" cy="${y}" r="2.1" ${F}/><circle cx="18.5" cy="${y}" r="2.1" ${F}/>`).join('') + `<path d="M12 3v18" stroke-dasharray="2.2 2.6" stroke-width="1.8"/>`,
    'k5-prim': `<circle cx="12" cy="5" r="2.7"/><circle cx="5.8" cy="18.5" r="2.7"/><circle cx="18.2" cy="18.5" r="2.7"/><path d="M10.7 7.4 7 16.1M13.3 7.4l3.7 8.7"/>`,
    'k5-gleichung': `<path d="M12 3.5V20M7.5 20.5h9M3.5 7h17"/><path d="M3.5 7 1.4 13M3.5 7l2.1 6M20.5 7l-2.1 6M20.5 7l2.1 6"/><path d="M.9 13h5.2a2.6 2.6 0 0 1-5.2 0zM17.9 13h5.2a2.6 2.6 0 0 1-5.2 0z" ${F}/>`,
    // LB 2 Brüche & Dezimalzahlen
    'k5-anteil': `<circle cx="12" cy="12" r="8.6"/><path d="M12 12V3.4A8.6 8.6 0 1 1 4.55 16.3z" ${F}/>`,
    'k5-kuerzen': `<rect x="3" y="7" width="18" height="10" rx="1.5"/><rect x="3" y="7" width="9" height="10" rx="1.5" ${F}/>`,
    'k5-erweitern': `<rect x="3" y="7" width="18" height="10" rx="1.5"/><rect x="3" y="7" width="4.1" height="10" rx="1" ${F}/><rect x="7.9" y="7" width="4.1" height="10" rx="1" ${F}/><path d="M16.5 7v10" stroke-width="1.8"/>`,
    'k5-umwandeln': `<circle cx="6.8" cy="6.8" r="2.7"/><circle cx="17.2" cy="17.2" r="2.7"/><path d="M18.8 5.2 5.2 18.8"/>`,
    'k5-dezimal': `<text x="12" y="16.6" text-anchor="middle" font-size="13.5" font-weight="900" font-family="Nunito, system-ui, sans-serif" ${F}>0,5</text>`,
    'k5-vergleich': `<circle cx="4" cy="12" r="1.9" ${F}/><path d="M13.2 6.5 7.7 12l5.5 5.5"/><circle cx="18.6" cy="12" r="4.2" ${F}/>`,
    'k5-mittel': `<rect x="3" y="14" width="4.6" height="7" rx="1" ${F} opacity=".75"/><rect x="9.7" y="5" width="4.6" height="16" rx="1" ${F} opacity=".75"/><rect x="16.4" y="10" width="4.6" height="11" rx="1" ${F} opacity=".75"/><path d="M1.5 10.7h21" stroke-dasharray="3 2"/>`,
    // LB 3 Geometrie
    'k5-koord': `<path d="M4 2.5V20h17.5"/><path d="M4 9h10.5M14.5 9v11" stroke-dasharray="2 2.2" stroke-width="1.5"/><circle cx="14.5" cy="9" r="2.6" ${F}/>`,
    'k5-winkelart': `<path d="M3.5 19.5H13.0A9.5 9.5 0 0 0 9.79 12.38z" ${F} opacity=".7"/><path d="M3 19.5h18M3.5 19.5 15.5 5.9"/>`,
    'k5-winkelpaar': `<path d="M11.05 14H18.25A7.2 7.2 0 0 0 14.89 7.91zM11.05 14H3.85A7.2 7.2 0 0 0 7.21 20.09z" ${F} opacity=".7"/><path d="M1.5 14h21M6 22 18 3"/>`,
    // LB 4 Rechtecke & Quader
    'k5-rechteck': `<rect x="2.5" y="5.5" width="19" height="13" rx="1"/><path d="M8.8 5.5v13M15.2 5.5v13M2.5 12h19" stroke-width="1.3" opacity=".75"/>`,
    'k5-quader': `<path d="M12 12 4 7.5 12 3l8 4.5z" ${F} opacity=".45"/><path d="M12 3l8 4.5v9L12 21l-8-4.5v-9z"/><path d="M4 7.5 12 12l8-4.5M12 12v9"/>`,
    // LB 5 Mathe im Alltag
    'k5-einheit': `<rect x="1.8" y="7.5" width="20.4" height="9" rx="1.6"/><path d="M6 7.5v3.6M10 7.5v2.2M14 7.5v3.6M18 7.5v2.2" stroke-width="1.7"/>`,
    'k5-fahrplan': `<circle cx="12" cy="13.5" r="8"/><path d="M12 9.3v4.2l3 2"/><path d="M9.8 2.5h4.4M12 2.5v3"/>`,
    'k5-sach': `<circle cx="12" cy="12" r="9.3"/><path d="M15.9 8.4a4.9 4.9 0 1 0 0 7.2"/><path d="M6.6 10.7h6.6M6.6 13.4h6.6" stroke-width="1.8"/>`,
  };
  function svg(id) {
    const body = I[id];
    if (!body) return null;
    return `<svg viewBox="0 0 24 24" width="100%" height="100%" fill="none" stroke="${W}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${body}</svg>`;
  }
  return { svg, ids: Object.keys(I) };
})();
