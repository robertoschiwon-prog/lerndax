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
