// Themen-Symbole für EnDax (Englisch): kleine, selbst gezeichnete Bilder. Schlüssel = Themen-ID.
// Fehlt ein Symbol, zeigt die App das Zeichen aus `icon` im Thema. viewBox 0 0 24 24, Linien in Schriftfarbe.
window.EnDaxIcons = (function () {
  const W = 'currentColor';
  const F = `fill="${W}" stroke="none"`;
  const I = {
    // to be: drei Fächer nebeneinander (am, is, are), eines ist gefüllt
    'e5-be': `<rect x="2.5" y="7" width="5.4" height="10" rx="1.4"/><rect x="9.3" y="7" width="5.4" height="10" rx="1.4" ${F}/><rect x="16.1" y="7" width="5.4" height="10" rx="1.4"/><path d="M5.2 4v1.2M12 4v1.2M18.8 4v1.2"/>`,
    // Pronomen: eine Figur und daneben drei kleine (einer oder mehrere)
    'e5-pron': `<circle cx="6.5" cy="8" r="2.6"/><path d="M2.5 18c0-2.6 1.8-4.4 4-4.4s4 1.8 4 4.4"/><circle cx="14.5" cy="9.5" r="1.7" ${F}/><circle cx="18.5" cy="9.5" r="1.7" ${F}/><circle cx="16.5" cy="13.5" r="1.7" ${F}/><path d="M13 18h7"/>`,
    // verneinen und fragen: ein Fragezeichen und ein durchgestrichener Kreis
    'e5-be-neg': `<path d="M4 8.5a3.2 3.2 0 1 1 4.6 2.9c-.9.5-1.4 1.1-1.4 2.2"/><circle cx="7.2" cy="17.4" r="1" ${F}/><circle cx="17" cy="12" r="4.6"/><path d="M13.8 15.2l6.4-6.4"/>`,
    // have got: eine Figur mit einer Tasche in der Hand
    'e5-have': `<circle cx="8" cy="6.5" r="2.6"/><path d="M4 19v-4.5c0-2.4 1.8-4 4-4s4 1.6 4 4"/><path d="M12 13.5h3"/><rect x="14.5" y="13" width="6.5" height="6.5" rx="1.4" ${F}/><path d="M16.2 13v-1.2a1.6 1.6 0 0 1 3.2 0V13"/>`,
    // a oder an: zwei Kugeln, verbunden durch eine kleine Brücke (das n)
    'e5-a-an': `<circle cx="6" cy="14" r="3.4"/><circle cx="18" cy="14" r="3.4" ${F}/><path d="M6 9.5c3-4.5 9-4.5 12 0"/>`,
    // Mehrzahl: eine Kiste links, zwei Kisten rechts
    'e5-plural': `<rect x="2.5" y="10" width="6" height="6" rx="1.2"/><path d="M11 13h2.4"/><rect x="15" y="5.5" width="6" height="6" rx="1.2" ${F}/><rect x="15" y="13.5" width="6" height="6" rx="1.2" ${F}/>`,
    // there is / there are: ein Punkt in einem Rahmen, daneben drei
    'e5-there': `<rect x="2.5" y="6" width="8" height="12" rx="1.6"/><circle cx="6.5" cy="12" r="1.8" ${F}/><rect x="13.5" y="6" width="8" height="12" rx="1.6"/><circle cx="17.5" cy="9" r="1.4" ${F}/><circle cx="15.8" cy="14.5" r="1.4" ${F}/><circle cx="19.2" cy="14.5" r="1.4" ${F}/>`,
    // this / that: ein naher großer Punkt und ein ferner kleiner, mit Zeigepfeil
    'e5-this': `<circle cx="6" cy="16" r="3.2" ${F}/><circle cx="19" cy="6.5" r="1.8"/><path d="M9.5 13.5l6-4.6"/><path d="M12.6 8.4l3-.1-.6 3"/>`,
    // my, your …: eine Figur und ein Geschenk, das ihr gehört
    'e5-poss': `<circle cx="7" cy="7" r="2.6"/><path d="M3 19v-4c0-2.4 1.8-4 4-4s4 1.6 4 4v4"/><rect x="14" y="12" width="7" height="7" rx="1.2" ${F}/><path d="M17.5 12v-2.2m0 0c-1.2-1.6-3-.2-1.6 1.2m1.6-1.2c1.2-1.6 3-.2 1.6 1.2"/>`,
    // ’s: ein Namensschild mit Apostroph
    'e5-gen': `<path d="M3 8.5h10.5l4.5 3.5-4.5 3.5H3z"/><circle cx="6.2" cy="12" r="1" ${F}/><path d="M20.5 5.5c0 1.6-.5 2.6-1.6 3.4" /><path d="M20.5 5.5h-.01"/>`,
  };
  function svg(id) {
    const body = I[id];
    if (!body) return null;
    return `<svg viewBox="0 0 24 24" width="100%" height="100%" fill="none" stroke="${W}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${body}</svg>`;
  }
  return { svg, ids: Object.keys(I) };
})();
