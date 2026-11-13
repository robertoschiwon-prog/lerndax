// Themen-Symbole für EnDax (Englisch): kleine, selbst gezeichnete Bilder. Schlüssel = Themen-ID.
// Fehlt ein Symbol, zeigt die App das Zeichen aus `icon` im Thema. viewBox 0 0 24 24, Linien in Schriftfarbe.
window.EnDaxIcons = (function () {
  const W = 'currentColor';
  const F = `fill="${W}" stroke="none"`;
  const I = {
    // to be: drei Fächer nebeneinander (am, is, are), eines ist gefüllt
    'e5-be': `<rect x="2.5" y="7" width="5.4" height="10" rx="1.4"/><rect x="9.3" y="7" width="5.4" height="10" rx="1.4" ${F}/><rect x="16.1" y="7" width="5.4" height="10" rx="1.4"/><path d="M5.2 4v1.2M12 4v1.2M18.8 4v1.2"/>`,
  };
  function svg(id) {
    const body = I[id];
    if (!body) return null;
    return `<svg viewBox="0 0 24 24" width="100%" height="100%" fill="none" stroke="${W}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${body}</svg>`;
  }
  return { svg, ids: Object.keys(I) };
})();
