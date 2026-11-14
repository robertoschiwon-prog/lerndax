/* GeoDax – freie Fotos von Wikimedia Commons (Fotograf und Lizenz stehen im Bild und in bildnachweis.html).
 * Jedes Foto: Name → { datei, von, liz, titel, px?, aus?, ganz? } (Felder wie LernDaxBausteine.fotoBild).
 * Ausgesucht und angesehen im eingebauten Browser. Keine Bilder aus dem Schulbuch.
 */
(function () {
  const D = window.GeoDax;
  Object.assign(D.fotos, {
  });
  // Für jedes Foto, das in einer Aufgabe vorkommt, aber (noch) fehlt: Platzhalter mit Namen
  const genutzt = new Set();
  Object.values(D.banken).forEach((b) => (b.E ? b.E.arten : []).forEach((a) => genutzt.add(a[0])));
  ['alpen', 'bastei'].forEach((n) => genutzt.add(n));
  genutzt.forEach((n) => { if (!D.fotos[n]) D.fotos[n] = { titel: n, fehlt: true }; });
  D.fotosAnmelden();
})();
