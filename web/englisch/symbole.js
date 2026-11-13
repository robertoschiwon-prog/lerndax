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
    // Aufforderung: eine Sprechblase mit Ausrufezeichen
    'e5-imp': `<path d="M4 5h16v11H11l-4 3.5V16H4z"/><path d="M12 7.8v4.2"/><circle cx="12" cy="13.9" r=".9" ${F}/>`,
    // can / must / mustn’t: Haken, Ausrufezeichen, Verbot
    'e5-can': `<path d="M2.5 12.5l2.4 2.6 4-5.2"/><path d="M12 8v5"/><circle cx="12" cy="15.6" r=".9" ${F}/><circle cx="18.5" cy="12" r="3.4"/><path d="M16.2 14.4l4.6-4.8"/>`,
    // present simple: ein Kreislauf (jeden Tag wieder)
    'e5-ps': `<path d="M19 12a7 7 0 0 1-12.2 4.7"/><path d="M5 12a7 7 0 0 1 12.2-4.7"/><path d="M17.6 3.6v3.9h-3.9"/><path d="M6.4 20.4v-3.9h3.9"/>`,
    // verneinen: ein Kreislauf mit Strich
    'e5-ps-neg': `<circle cx="12" cy="12" r="7.5"/><path d="M6.8 17.2L17.2 6.8"/>`,
    // fragen: ein Fragezeichen in einer Sprechblase
    'e5-ps-frage': `<path d="M4 5h16v11H11l-4 3.5V16H4z"/><path d="M9.8 9a2.3 2.3 0 1 1 3.3 2.1c-.7.4-1.1.8-1.1 1.6"/><circle cx="12" cy="14.3" r=".8" ${F}/>`,
    // Fragewörter: eine Lupe
    'e5-fragewort': `<circle cx="10.5" cy="10.5" r="6"/><path d="M15 15l5.5 5.5"/><path d="M8.6 9a2 2 0 1 1 2.9 1.8c-.6.3-1 .7-1 1.3"/>`,
    // Satzbau: fünf Bausteine in einer Reihe
    'e5-satzbau': `<rect x="2" y="9" width="3.4" height="6" rx=".8" ${F}/><rect x="6.2" y="9" width="3.4" height="6" rx=".8"/><rect x="10.4" y="9" width="3.4" height="6" rx=".8"/><rect x="14.6" y="9" width="3.4" height="6" rx=".8"/><rect x="18.8" y="9" width="3.4" height="6" rx=".8"/>`,
    // Wie oft: eine Leiter mit fünf Punkten, einer gefüllt
    'e5-oft': `<path d="M3 12h18"/><circle cx="3.5" cy="12" r="1.6"/><circle cx="8" cy="12" r="1.6"/><circle cx="12.5" cy="12" r="1.6" ${F}/><circle cx="17" cy="12" r="1.6"/><circle cx="21" cy="12" r="1.6"/>`,
    'e5-pp': `<circle cx="12" cy="12" r="9"/><path d="M10 8.5v7l5.5-3.5z" ${F}/>`,
    'e5-sp': `<path d="M12 4v16M7 20h10M4 7h16"/><path d="M4 7l-2.5 6h5zM20 7l-2.5 6h5z"/>`,
    'e5-obj': `<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.5" ${F}/>`,
    'e5-some': `<path d="M4 12h16a8 8 0 0 1-16 0z"/><circle cx="9" cy="7.5" r="1.4" ${F}/><circle cx="13" cy="5.5" r="1.4" ${F}/><circle cx="16" cy="8" r="1.4" ${F}/>`,
    'e5-much': `<path d="M7 4h10l-1.5 16h-7z"/><path d="M7.7 11h8.6"/><path d="M10 15h4"/>`,
    'e5-ort': `<path d="M3 20h18"/><rect x="5" y="11" width="9" height="9" rx="1"/><circle cx="18" cy="16.5" r="3" ${F}/>`,
    'e5-zeit': `<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.5 2"/>`,
    'e5-zahl': `<path d="M5 9h14M4 15h14M10 4L8 20M16 4l-2 16"/>`,
    'e5-was': `<path d="M3 12a9 9 0 1 0 3-6.7"/><path d="M3 4v4h4"/><path d="M12 8v4l3 2"/>`,
    'e5-ed': `<rect x="4" y="5" width="16" height="15" rx="2"/><path d="M4 10h16M9 3v4M15 3v4"/><path d="M8 14l2.5 2.5L16 13"/>`,
    'e5-irr': `<path d="M4 17c3-9 13-9 16 0"/><path d="M17 14l3 3 3-3" transform="translate(-3 0)"/><circle cx="6" cy="8" r="2" ${F}/>`,
    'e5-w-familie': `<circle cx="8" cy="7" r="3"/><circle cx="16" cy="7" r="3"/><path d="M3 20c0-4 2-7 5-7s5 3 5 7M11 20c0-4 2-7 5-7s5 3 5 7"/>`,
    'e5-w-haus': `<path d="M3 11l9-7 9 7"/><path d="M5 10v10h14V10"/><rect x="10" y="14" width="4" height="6" ${F}/>`,
    'e5-w-schule': `<path d="M4 19V6a2 2 0 0 1 2-2h12v15H6a2 2 0 0 0-2 2"/><path d="M8 8h6"/>`,
    'e5-w-tag': `<circle cx="12" cy="13" r="7"/><path d="M12 10v3l2 2M5 4l3 2M19 4l-3 2"/>`,
    'e5-w-kleidung': `<path d="M8 3l4 3 4-3 5 4-3 3-2-1v12H8V9l-2 1-3-3z"/>`,
    'e5-w-freizeit': `<circle cx="12" cy="12" r="9"/><path d="M12 7l4 3-1.5 5h-5L8 10z" ${F}/>`,
    'e5-w-tiere': `<circle cx="6" cy="9" r="2"/><circle cx="10" cy="5" r="2"/><circle cx="14" cy="5" r="2"/><circle cx="18" cy="9" r="2"/><path d="M8 17c0-3 2-5 4-5s4 2 4 5-2 3-4 3-4 0-4-3z" ${F}/>`,
    'e5-w-koerper': `<circle cx="12" cy="5" r="2.5"/><path d="M12 8v7M6 11h12M12 15l-4 6M12 15l4 6"/>`,
    'e5-w-essen': `<path d="M12 7c-4-3-8 0-8 5 0 5 4 9 8 9s8-4 8-9c0-5-4-8-8-5z"/><path d="M12 7c0-2 1-4 3-4"/>`,
    'e5-w-farben': `<path d="M12 3a9 9 0 1 0 0 18c1.5 0 2-1 2-2s-1-2 0-3 4 0 5-2a9 9 0 0 0-7-11z"/><circle cx="8" cy="10" r="1.5" ${F}/><circle cx="12" cy="7" r="1.5" ${F}/><circle cx="16" cy="10" r="1.5" ${F}/>`,
    'e5-w-zeit': `<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/><rect x="7" y="13" width="3" height="3" ${F}/>`,
    // Gefühle: lachendes Gesicht
    'e5-w-gefuehle': `<circle cx="12" cy="12" r="9"/><circle cx="9" cy="10" r="1.2" ${F}/><circle cx="15" cy="10" r="1.2" ${F}/><path d="M8 14.5c1 1.6 2.4 2.4 4 2.4s3-.8 4-2.4"/>`,
    // Party: Luftballon an einer Schnur
    'e5-w-party': `<path d="M12 3c3.3 0 5.5 2.6 5.5 5.8S15 15 12 15s-5.5-3-5.5-6.2S8.7 3 12 3z"/><path d="M11 15l1 1.5 1-1.5"/><path d="M12 16.5c-1 1.5 1 2.5 0 4.5"/>`,
    // Beschreiben: großes und kleines Quadrat
    'e5-w-adj': `<rect x="3" y="6" width="11" height="13" rx="1.5"/><rect x="16.5" y="13" width="4.5" height="6" rx="1" ${F}/>`,
    // a few, a little: Flasche
    'e5-wenig': `<path d="M10 3h4v4l2 3v10a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1V10l2-3z"/><path d="M8 14h8v6H8z" ${F}/>`,
    // Medien: Laptop
    'e5-w-medien': `<rect x="4" y="5" width="16" height="11" rx="1.5"/><path d="M2 19h20"/><rect x="7" y="8" width="10" height="5" ${F}/>`,
    // Meinung: Sprechblase mit Daumen
    'e5-a-meinung': `<path d="M4 4h16v11H10l-5 4v-4H4z"/><path d="M9 12V9l2-3c1 0 1.4.6 1.2 1.6L12 9h3c.6 0 1 .5.9 1.1l-.6 2.2c-.1.4-.5.7-.9.7z" ${F}/>`,
    'e5-a-hallo': `<path d="M4 5h16v11H9l-5 4z"/><path d="M8 10h8"/>`,
    'e5-a-klasse': `<circle cx="9" cy="6" r="2.5"/><path d="M5 21v-6a4 4 0 0 1 8 0v6M15 12l3-8"/>`,
    'e5-a-laden': `<path d="M3 4h3l2 11h11l2-8H7"/><circle cx="10" cy="19" r="1.6" ${F}/><circle cx="17" cy="19" r="1.6" ${F}/>`,
    'e5-a-weg': `<circle cx="12" cy="12" r="9"/><path d="M15.5 8.5l-2 5-5 2 2-5z" ${F}/>`,
    'e5-a-abc': `<path d="M3 18l3.5-10L10 18M4.3 15h3.4"/><path d="M13 8h3a2 2 0 0 1 0 4h-3zM13 12h3.5a2 2 0 0 1 0 4H13z"/>`,
    'e5-a-lesen': `<path d="M3 5c3-1 6-1 9 1 3-2 6-2 9-1v14c-3-1-6-1-9 1-3-2-6-2-9-1z"/><path d="M12 6v14"/>`,
  };
  function svg(id) {
    const body = I[id];
    if (!body) return null;
    return `<svg viewBox="0 0 24 24" width="100%" height="100%" fill="none" stroke="${W}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${body}</svg>`;
  }
  return { svg, ids: Object.keys(I) };
})();
