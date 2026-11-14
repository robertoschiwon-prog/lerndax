// Themen-Symbole für BioDax (Biologie): kleine, selbst gezeichnete Bilder. Schlüssel = Themen-ID.
// Fehlt ein Symbol, zeigt die App das Zeichen aus `icon` im Thema. viewBox 0 0 24 24, Linien in Schriftfarbe.
window.BioDaxIcons = (function () {
  const W = 'currentColor';
  const F = `fill="${W}" stroke="none"`;
  // Grundformen
  const FISCH = `<path d="M3 12c3-5 10-6 15-2l3-3v10l-3-3c-5 4-12 3-15-2z"/><circle cx="7" cy="11" r="1" ${F}/>`;
  const FROSCH = `<path d="M4 17c-1-5 3-9 8-9s9 4 8 9z"/><circle cx="8" cy="8" r="2.2"/><circle cx="16" cy="8" r="2.2"/><path d="M9 14c2 1.5 4 1.5 6 0"/>`;
  const ECHSE = `<path d="M2 16c4-2 6-6 10-6s6 2 10 0"/><path d="M8 12l-2-3M8 13l-2 4M15 11l1-3M15 12l2 4"/><circle cx="20" cy="10" r=".8" ${F}/>`;
  const VOGEL = `<path d="M4 15c0-5 5-8 9-6l3-3c2 0 3 1 3 3l2 1-2 1c0 5-4 8-8 8-4 0-7-1-7-4z"/><circle cx="16.5" cy="8.5" r=".9" ${F}/>`;
  const EI = `<path d="M12 3c4 0 7 6 7 11a7 7 0 0 1-14 0c0-5 3-11 7-11z"/>`;
  const SCHILD = `<path d="M12 3l7 3v5c0 5-3 8-7 10-4-2-7-5-7-10V6z"/>`;
  const PFOTE = `<circle cx="7" cy="9" r="1.8" ${F}/><circle cx="12" cy="7" r="1.8" ${F}/><circle cx="17" cy="9" r="1.8" ${F}/><path d="M7.5 17c0-3 2-5 4.5-5s4.5 2 4.5 5c0 2-2 2.5-4.5 2.500S7.5 19 7.5 17z" ${F}/>`;
  const I = {
    // Merkmale des Lebens
    'b5-biologie': `<circle cx="10" cy="10" r="6"/><path d="M14.5 14.500L21 21"/><path d="M8 10c1-2 3-2 4 0" />`,
    'b5-kennzeichen': `<path d="M12 21v-9"/><path d="M12 12c-4 0-7-3-7-7 4 0 7 3 7 7zM12 15c3 0 6-2 6-6-3 0-6 2-6 6z" ${F} opacity=".8"/>`,
    // Fische
    'b5-fisch-bau': FISCH,
    'b5-fisch-kiemen': FISCH + `<path d="M10 9c-1.5 2-1.5 4 0 6M12 9.500c-1 1.5-1 3.5 0 5"/>`,
    'b5-fisch-gewaesser': `<path d="M2 8c3-2 5 2 8 0s5-2 8 0 3 1 4 0M2 13c3-2 5 2 8 0s5-2 8 0 3 1 4 0M2 18c3-2 5 2 8 0s5-2 8 0 3 1 4 0"/>`,
    'b5-fisch-fortpfl': `<circle cx="7" cy="8" r="3"/><circle cx="15" cy="7" r="3"/><circle cx="11" cy="15" r="3"/><circle cx="18" cy="15" r="2.5"/><circle cx="7" cy="8" r="1" ${F}/><circle cx="15" cy="7" r="1" ${F}/><circle cx="11" cy="15" r="1" ${F}/>`,
    'b5-fisch-nahrung': `<circle cx="4" cy="12" r="2" ${F}/><path d="M7 12h3M9 10.500l1.5 1.500L9 13.5"/><circle cx="13" cy="12" r="2.5"/><path d="M16.5 12h2M17.5 10.500L19 12l-1.5 1.5"/><circle cx="21" cy="12" r="1.5" ${F}/>`,
    'b5-fisch-schutz': SCHILD + `<path d="M8 12c2-2.5 5-2.5 7 0l1.5-1.500v3L15 12c-2 2.5-5 2.5-7 0z" ${F}/>`,
    // Lurche
    'b5-lurch-bau': FROSCH,
    'b5-lurch-beute': FROSCH + `<path d="M12 15l7 4" stroke-width="2.6"/><circle cx="20" cy="19.5" r="1.2" ${F}/>`,
    'b5-lurch-haut': `<path d="M12 3c4 5 6 8 6 11a6 6 0 0 1-12 0c0-3 2-6 6-11z"/><path d="M9.5 14a2.5 2.5 0 0 0 2.5 2.5"/>`,
    'b5-lurch-arten': `<circle cx="10" cy="10" r="6"/><path d="M14.5 14.500L21 21"/><circle cx="8" cy="9" r="1.2" ${F}/><circle cx="12" cy="9" r="1.2" ${F}/><path d="M8 12c1.5 1 2.5 1 4 0"/>`,
    'b5-lurch-bestimmen': `<circle cx="12" cy="4" r="2" ${F}/><path d="M12 6v4M12 10L6 14M12 10l6 4M6 14v3M18 14v3"/><circle cx="6" cy="19" r="2"/><circle cx="18" cy="19" r="2"/>`,
    'b5-lurch-entw': `<circle cx="5" cy="7" r="2.5"/><circle cx="5" cy="7" r=".9" ${F}/><path d="M9 7h3M11 5.500L12.5 7 11 8.5"/><ellipse cx="17" cy="7" rx="3" ry="2" ${F}/><path d="M20 7l2.5-1.500v3z" ${F}/><path d="M17 11v3M15.5 12.500L17 14l1.5-1.5"/><path d="M12 21c-1-3 1-5 4-5s5 2 4 5z"/>`,
    'b5-lurch-schwanz': ECHSE + `<circle cx="7" cy="14.5" r=".9" ${F}/><circle cx="12" cy="10" r=".9" ${F}/><circle cx="16.5" cy="11" r=".9" ${F}/>`,
    'b5-lurch-schutz': `<path d="M12 3l10 17H2z"/><path d="M12 10v5"/><circle cx="12" cy="17.5" r=".9" ${F}/>`,
    // Kriechtiere
    'b5-kt-vielfalt': `<path d="M2 14h13l7-3-2 4H9l-3 3M9 15l1 3M15 15l1 3"/><path d="M4 14l1-2 1 2 1-2 1 2 1-2 1 2 1-2 1 2"/><circle cx="18" cy="12.5" r=".8" ${F}/>`,
    'b5-kt-merkmale': `<path d="M3 8q3-4 6 0q3-4 6 0q3-4 6 0M3 13q3-4 6 0q3-4 6 0q3-4 6 0M3 18q3-4 6 0q3-4 6 0q3-4 6 0"/>`,
    'b5-kt-eidechse': ECHSE,
    'b5-kt-schlange': `<path d="M3 18c3 0 3-5 6-5s3 5 6 5 3-10 6-10" stroke-width="2.4"/><circle cx="20.5" cy="7" r="1.6" ${F}/>`,
    'b5-kt-fortpfl': EI + `<path d="M8 12l2-2 2 2 2-2 2 2"/>`,
    'b5-kt-schutz': SCHILD + `<path d="M8 13c2-1 3-3 4-3s2 1 4 0" stroke-width="1.8"/>`,
    // Vögel
    'b5-vogel-vielfalt': VOGEL,
    'b5-vogel-flugbau': `<path d="M4 6l16 12" stroke-width="5" stroke-linecap="round"/><path d="M4 6l16 12" stroke="var(--card,#fff)" stroke-width="2" stroke-linecap="round"/>`,
    'b5-vogel-feder': `<path d="M4 20L20 4"/><path d="M8 16C8 9 14 4 20 4c0 6-5 12-12 12z" ${F} opacity=".45"/><path d="M11 13V8M14 10V6M11 13h5M14 10h4"/>`,
    'b5-vogel-flug': `<path d="M2 14c3-6 7-6 10 0 3-6 7-6 10 0"/><path d="M12 14v4"/>`,
    'b5-vogel-schnabel': `<circle cx="8" cy="12" r="5"/><circle cx="9.5" cy="10.5" r=".9" ${F}/><path d="M13 10c5-1 8 1 8 5-2-2-5-2-8-1z" ${F}/>`,
    'b5-vogel-vier': `<path d="M6 21c-2-6-1-13 6-14 7 1 8 8 6 14z"/><circle cx="9.5" cy="12" r="2"/><circle cx="14.5" cy="12" r="2"/><path d="M12 14l-1 2h2z" ${F}/><path d="M7 7l-1-3 3 2M17 7l1-3-3 2"/>`,
    'b5-vogel-ei': EI + `<circle cx="12" cy="14" r="3" ${F}/>`,
    'b5-vogel-nest': `<path d="M3 13c0 5 4 8 9 8s9-3 9-8z"/><path d="M5 13c2 2 12 2 14 0"/><circle cx="9" cy="10" r="2.2" ${F}/><circle cx="14.5" cy="9.5" r="2.2" ${F}/>`,
    'b5-vogel-amsel': `<path d="M9 18V6l10-2v11"/><circle cx="6.5" cy="18" r="2.5" ${F}/><circle cx="16.5" cy="15" r="2.5" ${F}/>`,
    'b5-vogel-schutz': `<path d="M5 21V10l7-6 7 6v11z"/><circle cx="12" cy="13" r="2.5"/><path d="M12 18v2"/>`,
    // Säugetiere
    'b5-saeuger-vielfalt': `<path d="M5 21v-7c0-3 3-5 7-5l4-3 1 3 3 2-2 3h-3v7M9 21v-5"/><path d="M15 4l-1-2M17 5l1-3"/>`,
    'b5-saeuger-merkmale': `<path d="M9 3h6v4l2 3v9a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2v-9l2-3z"/><path d="M7 13h10"/>`,
    'b5-hund': PFOTE,
    'b5-katze': `<path d="M5 20V9L4 3l5 3h6l5-3-1 6v11z"/><circle cx="9.5" cy="11" r="1" ${F}/><circle cx="14.5" cy="11" r="1" ${F}/><path d="M12 14v1.500M9 17c1.5 1 4.5 1 6 0M2 13l4 1M22 13l-4 1"/>`,
    'b5-verstaendigung': `<circle cx="5" cy="12" r="2" ${F}/><path d="M9 8c2 2.5 2 5.5 0 8M12 6c3.5 3.5 3.5 8.5 0 12M15 4c5 5 5 11 0 16"/>`,
    'b5-rind': `<path d="M6 8c0 7 2 12 6 12s6-5 6-12z"/><path d="M6 8C3 8 2 6 2 4c2 0 4 1 5 3M18 8c3 0 4-2 4-4-2 0-4 1-5 3"/><circle cx="10" cy="12" r=".9" ${F}/><circle cx="14" cy="12" r=".9" ${F}/><ellipse cx="12" cy="17" rx="2.5" ry="1.5"/>`,
    'b5-schwein': `<path d="M7 3c-2 4-2 9 0 13 1 3 3 5 5 5s4-2 5-5c2-4 2-9 0-13-1 2-3 2-5 2S8 5 7 3z"/><path d="M12 5v16"/>`,
    'b5-gliedmassen': `<path d="M12 6C8 4 4 5 2 9c3 0 4 2 5 4 1-2 3-3 5-3s4 1 5 3c1-2 2-4 5-4-2-4-6-5-10-3z"/><path d="M12 10v6M10 18l2-2 2 2"/>`,
    'b5-lunge': `<path d="M12 3v8M12 11c-1 0-2 1-3 2M12 11c1 0 2 1 3 2"/><path d="M9 8c-4 1-6 6-6 10 0 2 2 3 4 2 2-1 3-3 3-5V9zM15 8c4 1 6 6 6 10 0 2-2 3-4 2-2-1-3-3-3-5V9z"/>`,
    'b5-saeuger-schutz': SCHILD + `<circle cx="9.5" cy="10" r="1.1" ${F}/><circle cx="12" cy="8.5" r="1.1" ${F}/><circle cx="14.5" cy="10" r="1.1" ${F}/><path d="M9.5 14.500c0-1.5 1-2.5 2.5-2.500s2.5 1 2.5 2.5-1 1.5-2.5 1.5-2.5 0-2.5-1.500z" ${F}/>`,
    'b5-tierhaltung': `<path d="M3 21V11l9-7 9 7v10z"/><path d="M9.5 16.500l2.5 2.5 2.5-2.500a1.8 1.8 0 0 0-2.5-2.5 1.8 1.8 0 0 0-2.5 2.500z" ${F}/>`,
    'b5-mensch-skelett': `<circle cx="12" cy="5" r="3"/><path d="M12 8v8M7 10h10M8 13h8M12 16l-3 5M12 16l3 5M7 10l-2 5M17 10l2 5"/>`,
    'b5-mensch-fortpfl': `<circle cx="8" cy="6" r="2.5"/><path d="M4 21v-6c0-3 2-5 4-5s4 2 4 5v6"/><circle cx="17" cy="11" r="2"/><path d="M14 21v-4c0-2 1.5-3.5 3-3.500s3 1.5 3 3.500v4"/>`,
    'b5-schutz': `<path d="M8 13V6a1.5 1.5 0 0 1 3 0v5M11 11V4.5a1.5 1.5 0 0 1 3 0V11M14 11V6a1.5 1.5 0 0 1 3 0v8c0 4-2 7-6 7-3 0-4.5-1.5-6-4l-2-3.5a1.4 1.4 0 0 1 2.4-1.4L8 15"/>`,
    // Wirbeltiere im Vergleich
    'b5-vergleich': `<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 9h18M3 14.500h18M9 4v16M15 4v16"/>`,
    'b5-entwicklung': `<path d="M12 21V9M12 15l-5-4M12 12l5-4M12 9l-3-5M12 9l3-5"/><circle cx="7" cy="11" r="1.3" ${F}/><circle cx="17" cy="8" r="1.3" ${F}/><circle cx="9" cy="4" r="1.3" ${F}/><circle cx="15" cy="4" r="1.3" ${F}/>`,
    'b5-winter-wechsel': `<path d="M12 2v20M3.5 7l17 10M20.5 7l-17 10"/><path d="M12 5l-2-2M12 5l2-2M12 19l-2 2M12 19l2 2"/>`,
    'b5-winter-gleich': `<path d="M3 18c0-6 4-10 9-10s9 4 9 10z"/><path d="M6 12l-1-4M9 10l-1-5M12 9V4M15 10l1-5M18 12l1-4"/><circle cx="19" cy="16" r=".9" ${F}/>`,
  };
  function svg(id) {
    const body = I[id];
    if (!body) return null;
    return `<svg viewBox="0 0 24 24" width="100%" height="100%" fill="none" stroke="${W}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${body}</svg>`;
  }
  return { svg, ids: Object.keys(I) };
})();
