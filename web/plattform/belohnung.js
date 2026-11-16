/* LernDax – Belohnungen (Plattform, für alle Fächer), seit lerndax-v114
 *
 * Wunsch des Kindes: ein Belohnungssystem wie bei Anton. Entscheidungen von Roberto (16.11.2026):
 *   - Münzen für jede richtige Aufgabe, eine Krone für eine fehlerfreie Runde
 *   - Ausgeben im Laden (Hüte, Brillen, Halsschmuck, Hintergründe für den Avatar) und in der Spielhalle
 *   - Spielhalle erst nach der ersten Runde des Tages, höchstens 15 Minuten am Tag
 *
 * Münzen:  erster Versuch richtig 2 · zweiter Versuch 1 · Knobel-Aufgabe geknackt 3
 *          fehlerfreie Runde +5 (bei Themen-Runden dazu eine 👑 am Thema) · Tagesziel (erste Runde des Tages) +5
 * Spielen: 3 Minuten kosten 10 Münzen, gezählt wird nur die Zeit, in der wirklich gespielt wird.
 *
 * Gespeichert im Gerät (localStorage 'lerndax.belohnung') und – mit Elternkonto – in lerndax_progress unter subject 'belohnung'
 * (plattform/sync.js). Damit mehrere Geräte nichts verlieren, zählt jedes Gerät seine eigenen Summen (verdient, ausgegeben,
 * Runden, Spielsekunden); beim Zusammenführen gilt je Gerät der höhere Wert. Gekaufte Sachen und Kronen werden vereinigt,
 * beim Angezogenen gilt die neueste Änderung.
 */
(function () {
  const KEY = 'lerndax.belohnung', GKEY = 'lerndax.geraet', TKEY = 'lerndax.spielguthaben';
  const PREISE = {
    partyhut: 30, bommel: 40, cap: 40, zylinder: 70, zauberhut: 90, doktorhut: 80, piratenhut: 90, koenigskrone: 150,
    rundbrille: 30, sonnenbrille: 50, sternbrille: 60, taucherbrille: 60, maske: 80,
    fliege: 25, halstuch: 30, schal: 40, kette: 60, medaille: 100,
    streifen: 30, punkte: 30, schach: 40, regenbogen: 80, nachthimmel: 90, weltall: 120, unterwasser: 90,
  };
  const SPIEL = { preis: 10, sekunden: 180, proTag: 900 }; // 3 Minuten für 10 Münzen, höchstens 15 Minuten am Tag
  const MUENZEN = { erster: 2, zweiter: 1, knobel: 3, perfekt: 5, tagesziel: 5 };

  const ls = {
    get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch (e) {} },
  };
  let GERAET = ls.get(GKEY);
  if (!GERAET) { GERAET = 'g' + Math.random().toString(36).slice(2, 10); ls.set(GKEY, GERAET); }

  const tag = (d = new Date()) => d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  const leer = () => ({ verdient: {}, ausgegeben: {}, gekauft: {}, getragen: { t: 0 }, kronen: {}, runden: {}, spiel: {}, rekord: {} });
  let W = leer();
  try { const raw = ls.get(KEY); if (raw) W = Object.assign(leer(), JSON.parse(raw)); } catch (e) {}

  const hoerer = [];
  function speichern() { ls.set(KEY, JSON.stringify(W)); hoerer.forEach((f) => { try { f(); } catch (e) {} }); }

  // ---------- Zusammenführen (für sync.js; Schlüssel sortiert, damit der Vergleich als Text klappt) ----------
  const sortiert = (o) => Object.fromEntries(Object.keys(o).sort().map((k) => [k, o[k]]));
  const maxJe = (a, b) => { const r = {}; new Set([...Object.keys(a || {}), ...Object.keys(b || {})]).forEach((k) => { r[k] = Math.max((a || {})[k] || 0, (b || {})[k] || 0); }); return sortiert(r); };
  const tageJe = (a, b) => {
    const r = {}, tage = [...new Set([...Object.keys(a || {}), ...Object.keys(b || {})])].sort().slice(-30);
    tage.forEach((d) => { r[d] = maxJe((a || {})[d], (b || {})[d]); });
    return r;
  };
  function merge(a, b) {
    a = Object.assign(leer(), a || {}); b = Object.assign(leer(), b || {});
    const gekauft = {};
    new Set([...Object.keys(a.gekauft), ...Object.keys(b.gekauft)]).forEach((k) => { const x = a.gekauft[k], y = b.gekauft[k]; gekauft[k] = !x ? y : !y ? x : x < y ? x : y; });
    const kronen = {};
    new Set([...Object.keys(a.kronen), ...Object.keys(b.kronen)]).forEach((k) => { const x = a.kronen[k], y = b.kronen[k]; kronen[k] = !x ? y : !y ? x : x < y ? x : y; });
    const g = (b.getragen.t || 0) > (a.getragen.t || 0) ? b.getragen : a.getragen;
    return {
      verdient: maxJe(a.verdient, b.verdient), ausgegeben: maxJe(a.ausgegeben, b.ausgegeben),
      gekauft: sortiert(gekauft), getragen: sortiert(Object.assign({}, g)), kronen: sortiert(kronen),
      runden: tageJe(a.runden, b.runden), spiel: tageJe(a.spiel, b.spiel), rekord: maxJe(a.rekord, b.rekord),
    };
  }

  // ---------- Münzen ----------
  const summe = (o) => Object.values(o || {}).reduce((s, x) => s + (x || 0), 0);
  const muenzen = () => Math.max(0, summe(W.verdient) - summe(W.ausgegeben));
  function verdienen(n) {
    if (!(n > 0)) return 0;
    W.verdient[GERAET] = (W.verdient[GERAET] || 0) + n; speichern(); return n;
  }
  function ausgeben(n) {
    if (muenzen() < n) return false;
    W.ausgegeben[GERAET] = (W.ausgegeben[GERAET] || 0) + n; speichern(); return true;
  }

  // ---------- Laden ----------
  const hat = (id) => !!W.gekauft[id];
  function kaufen(id) {
    if (hat(id)) return true;
    const p = PREISE[id]; if (!p || !ausgeben(p)) return false;
    W.gekauft[id] = tag(); speichern(); return true;
  }
  const getragen = () => { const g = Object.assign({}, W.getragen); delete g.t; Object.keys(g).forEach((k) => { if (!g[k] || !hat(g[k])) delete g[k]; }); return g; };
  function anziehen(slot, id) { if (id && !hat(id)) return false; W.getragen = Object.assign({}, W.getragen, { [slot]: id || '', t: Date.now() }); speichern(); return true; }

  // ---------- Kronen und Runden ----------
  const hatKrone = (k) => !!W.kronen[k];
  const kronenZahl = () => Object.keys(W.kronen).length;
  function krone(k) { const neu = !W.kronen[k]; if (neu) { W.kronen[k] = tag(); speichern(); } return neu; }
  function rundeFertig() {
    const d = tag(); W.runden[d] = Object.assign({}, W.runden[d], { [GERAET]: ((W.runden[d] || {})[GERAET] || 0) + 1 });
    W.runden = Object.fromEntries(Object.keys(W.runden).sort().slice(-30).map((k) => [k, W.runden[k]]));
    speichern();
  }
  const rundenHeute = () => summe(W.runden[tag()]);

  // ---------- Spielhalle ----------
  const gespieltHeute = () => summe(W.spiel[tag()]);
  // Guthaben: gekaufte, noch nicht verspielte Sekunden – nur auf diesem Gerät und nur heute
  function guthaben() { try { const g = JSON.parse(ls.get(TKEY) || '{}'); return g.tag === tag() ? g.s || 0 : 0; } catch (e) { return 0; } }
  const setGuthaben = (s) => ls.set(TKEY, JSON.stringify({ tag: tag(), s: Math.max(0, Math.round(s)) }));
  const restHeute = () => Math.max(0, SPIEL.proTag - gespieltHeute() - guthaben());
  // Antwort: 'ok' | 'ziel' (erst Tagesrunde) | 'grenze' (15 Minuten erreicht) | 'muenzen' (zu wenig Münzen)
  function zeitKaufen() {
    if (!rundenHeute()) return 'ziel';
    const rest = restHeute();
    if (rest <= 0) return 'grenze';
    if (!ausgeben(SPIEL.preis)) return 'muenzen';
    setGuthaben(guthaben() + Math.min(SPIEL.sekunden, rest));
    return 'ok';
  }
  // Eine gespielte Sekunde abbuchen; Antwort: noch übrige Sekunden
  function sekundeGespielt() {
    const g = guthaben(); if (g <= 0) return 0;
    setGuthaben(g - 1);
    const d = tag(); W.spiel[d] = Object.assign({}, W.spiel[d], { [GERAET]: ((W.spiel[d] || {})[GERAET] || 0) + 1 });
    W.spiel = Object.fromEntries(Object.keys(W.spiel).sort().slice(-30).map((k) => [k, W.spiel[k]]));
    // nur alle 10 Sekunden (und am Ende) speichern und melden, sonst würde jede Sekunde synchronisiert
    if ((g - 1) % 10 === 0) speichern(); else ls.set(KEY, JSON.stringify(W));
    return g - 1;
  }
  function rekord(spiel, punkte) { if (punkte > (W.rekord[spiel] || 0)) { W.rekord[spiel] = punkte; speichern(); return true; } return false; }

  window.LernDaxBelohnung = {
    PREISE, SPIEL, MUENZEN, merge, tag,
    getState: () => JSON.parse(JSON.stringify(W)),
    setState(s) { W = Object.assign(leer(), s || {}); ls.set(KEY, JSON.stringify(W)); hoerer.forEach((f) => { try { f('sync'); } catch (e) {} }); },
    onChange(f) { hoerer.push(f); },
    muenzen, verdienen, ausgeben, hat, kaufen, getragen, anziehen,
    krone, hatKrone, kronenZahl, kronen: () => Object.assign({}, W.kronen), rundeFertig, rundenHeute,
    gespieltHeute, guthaben, restHeute, zeitKaufen, sekundeGespielt, rekord, rekorde: () => Object.assign({}, W.rekord),
  };
})();
