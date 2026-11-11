/* LernDax – eigene Symbole statt Emojis (gemeinsam für alle Fächer)
 *
 * Emojis sehen auf jedem Gerät anders aus. Diese Datei ersetzt sie auf der ganzen Seite automatisch
 * durch selbst gezeichnete, farbige Symbole. Im Quelltext dürfen weiter Emojis stehen: Sobald ein
 * Emoji aus der Liste ZEICHEN auf der Seite erscheint, wird es gegen das passende Symbol getauscht.
 * Zeichnungen in Animationen (SVG) und Eingabefelder bleiben unberührt.
 *
 * Neues Symbol: in SYMBOLE zeichnen (viewBox 0 0 24 24, flächig, ohne Umrisslinien) und in ZEICHEN zuordnen.
 * Direkt verwenden: LernDaxSymbole.html('pokal')
 */
(function () {
  const SYMBOLE = {
    ziel: '<circle cx="12" cy="12" r="10.5" fill="#e5383b"/><circle cx="12" cy="12" r="7.3" fill="#fff"/><circle cx="12" cy="12" r="4.2" fill="#e5383b"/><circle cx="12" cy="12" r="1.5" fill="#fff"/>',
    flamme: '<path d="M12.5 1.5c.6 4.2 6 6.3 6 12.4a6.5 6.5 0 0 1-13 0c0-3 1.7-4.7 3-7.3.8 1.9 2 2.3 2.2.9.2-1.8.8-3.9 1.8-6z" fill="#ff6b3d"/><path d="M12 11.5c1.8 2 3.2 3.6 3.2 5.4a3.2 3.2 0 0 1-6.4 0c0-2.1 1.9-3.3 3.2-5.4z" fill="#ffd166"/>',
    stern: '<polygon points="12.0,1.6 14.7,8.9 22.5,9.2 16.4,14.0 18.5,21.5 12.0,17.2 5.5,21.5 7.6,14.0 1.5,9.2 9.3,8.9" fill="#f5b301"/>',
    funkeln: '<polygon points="9.5,5.0 11.3,11.7 18.0,13.5 11.3,15.3 9.5,22.0 7.7,15.3 1.0,13.5 7.7,11.7" fill="#f5b301"/><polygon points="18.8,1.0 19.8,4.6 23.4,5.6 19.8,6.6 18.8,10.2 17.8,6.6 14.2,5.6 17.8,4.6" fill="#ffd166"/>',
    klee: '<path d="M12 12.5C13.5 17 15 19.5 18 22" fill="none" stroke="#2e7d32" stroke-width="2" stroke-linecap="round"/><circle cx="8" cy="8" r="4.3" fill="#3fa34d"/><circle cx="16" cy="8" r="4.3" fill="#3fa34d"/><circle cx="8" cy="15.5" r="4.3" fill="#3fa34d"/><circle cx="16" cy="15.5" r="4.3" fill="#3fa34d"/><circle cx="12" cy="11.8" r="2.6" fill="#2e7d32"/>',
    haken: '<circle cx="12" cy="12" r="10.5" fill="#14a06c"/><path d="M7 12.3l3.4 3.4L17.3 8.8" fill="none" stroke="#fff" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/>',
    nochmal: '<g fill="none" stroke="#ff6b3d" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 11a8 8 0 0 1 14.2-4.6"/><path d="M18.8 2.2v4.8H14"/><path d="M20 13a8 8 0 0 1-14.2 4.6"/><path d="M5.2 21.8V17H10"/></g>',
    buch: '<path d="M12 6.2C9.8 4.6 6.5 4.2 2.5 4.6v13.8c4-.4 7.3 0 9.5 1.6 2.2-1.6 5.5-2 9.5-1.6V4.6c-4-.4-7.3 0-9.5 1.6z" fill="#fff" stroke="#3d7bff" stroke-width="2" stroke-linejoin="round"/><path d="M12 6.2V20" stroke="#3d7bff" stroke-width="2"/><path d="M5.3 8.8c1.7-.1 3 .1 4.2.6M5.3 12.3c1.7-.1 3 .1 4.2.6M14.5 9.4c1.2-.5 2.5-.7 4.2-.6M14.5 12.9c1.2-.5 2.5-.7 4.2-.6" fill="none" stroke="#9db8f2" stroke-width="1.4" stroke-linecap="round"/>',
    wuerfel: '<g transform="rotate(-10 12 12)"><rect x="3" y="3" width="18" height="18" rx="4" fill="#fff" stroke="#1c1a33" stroke-width="2"/><circle cx="7.8" cy="7.8" r="1.7" fill="#1c1a33"/><circle cx="16.2" cy="7.8" r="1.7" fill="#1c1a33"/><circle cx="12" cy="12" r="1.7" fill="#1c1a33"/><circle cx="7.8" cy="16.2" r="1.7" fill="#1c1a33"/><circle cx="16.2" cy="16.2" r="1.7" fill="#1c1a33"/></g>',
    tipp: '<path d="M12 2a7.2 7.2 0 0 0-4.2 13.1c.5.4.7.9.7 1.5V17h7v-.4c0-.6.2-1.1.7-1.5A7.2 7.2 0 0 0 12 2z" fill="#f5b301"/><path d="M9.3 8.2a3.5 3.5 0 0 1 2.4-2.3" fill="none" stroke="#fff" stroke-width="1.7" stroke-linecap="round"/><rect x="8.7" y="18" width="6.6" height="2" rx="1" fill="#8d8799"/><rect x="10" y="20.8" width="4" height="1.7" rx=".85" fill="#8d8799"/>',
    feier: '<path d="M3 21l4.5-12 7.5 7.5z" fill="#8b5cf6"/><path d="M5.4 14.6l4 4M7 10.6l6.4 6.4" stroke="#c4b0fb" stroke-width="1.6"/><polygon points="17.5,1.4 18.3,4.2 21.1,5.0 18.3,5.8 17.5,8.6 16.7,5.8 13.9,5.0 16.7,4.2" fill="#f5b301"/><circle cx="12.5" cy="4" r="1.5" fill="#e5383b"/><circle cx="20.5" cy="11.5" r="1.5" fill="#14a06c"/><rect x="15" y="10" width="2.8" height="2.8" rx=".6" fill="#3d7bff" transform="rotate(20 16.4 11.4)"/>',
    blitz: '<path d="M13.5 1.5 4.5 13.5h5.8L9 22.5l10.5-13h-6.3z" fill="#f5b301"/>',
    frage: '<circle cx="12" cy="12" r="10.5" fill="#3d7bff"/><path d="M9 9.3a3.1 3.1 0 1 1 4.5 2.8c-.9.5-1.5 1.1-1.5 2.1v.3" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round"/><circle cx="12" cy="17.8" r="1.5" fill="#fff"/>',
    keim: '<path d="M12 22V11" stroke="#2e7d32" stroke-width="2.4" stroke-linecap="round"/><path d="M12 12.5C7 13 3.5 10 3 5c5-.5 8.5 2.5 9 7.5z" fill="#3fa34d"/><path d="M12 10.5c.3-4.3 3.3-7 8-7-.3 4.3-3.3 7-8 7z" fill="#7ccf6b"/>',
    pokal: '<path d="M7 5H3.5v2a4 4 0 0 0 4 4M17 5h3.5v2a4 4 0 0 1-4 4" fill="none" stroke="#e0a8" stroke-width="2"/><path d="M6.5 2.5h11V9a5.5 5.5 0 0 1-11 0z" fill="#f5b301"/><path d="M9 4.5v4" stroke="#ffe08a" stroke-width="1.7" stroke-linecap="round"/><rect x="10.7" y="14" width="2.6" height="3.6" fill="#e0a8"/><rect x="7" y="17.5" width="10" height="4" rx="1.2" fill="#8a5a2b"/>',
    langsam: '<rect x="6.3" y="15" width="3.3" height="4.6" rx="1.5" fill="#7ccf6b"/><rect x="13.6" y="15" width="3.3" height="4.6" rx="1.5" fill="#7ccf6b"/><path d="M2.5 15.5l2.5-1" stroke="#7ccf6b" stroke-width="2" stroke-linecap="round"/><circle cx="20.3" cy="12.3" r="2.9" fill="#7ccf6b"/><circle cx="21.2" cy="11.6" r=".8" fill="#1c1a33"/><path d="M4 16a7.5 8 0 0 1 15 0z" fill="#2e8b47"/><path d="M8.5 10.5l2 5.5M14.5 10.5l-2 5.5M6.5 13.2h10" fill="none" stroke="#7ccf6b" stroke-width="1.2"/>',
    achtung: '<path d="M12 2.5 22.5 20.5h-21z" fill="#f5b301" stroke="#f5b301" stroke-width="2" stroke-linejoin="round"/><path d="M12 9v5.5" stroke="#1c1a33" stroke-width="2.4" stroke-linecap="round"/><circle cx="12" cy="17.7" r="1.4" fill="#1c1a33"/>',
    person: '<circle cx="12" cy="8" r="4.8" fill="#8d8799"/><path d="M3 22a9 9 0 0 1 18 0z" fill="#8d8799"/>',
    post: '<rect x="2.5" y="5" width="19" height="14" rx="2.5" fill="#fff" stroke="#1c1a33" stroke-width="2"/><path d="M3.5 7l8.5 6.5L20.5 7" fill="none" stroke="#1c1a33" stroke-width="2" stroke-linejoin="round"/>',
    schloss: '<path d="M7.5 11V8a4.5 4.5 0 0 1 9 0v3" fill="none" stroke="#8d8799" stroke-width="2.4"/><rect x="4.5" y="10.5" width="15" height="11" rx="2.5" fill="#f5b301"/><circle cx="12" cy="15.5" r="1.7" fill="#1c1a33"/><rect x="11.2" y="15.5" width="1.6" height="3.3" rx=".8" fill="#1c1a33"/>',
    wolke: '<path d="M7 19.5a4.8 4.8 0 0 1-.6-9.6 6 6 0 0 1 11.5 1.5 4.1 4.1 0 0 1-.4 8.1z" fill="currentColor"/>',
    stift: '<g transform="rotate(45 12 12)"><rect x="9.5" y="2" width="5" height="3" rx="1" fill="#f7a6b5"/><rect x="9.5" y="5" width="5" height="11" fill="#f5b301"/><path d="M9.5 16h5L12 21.5z" fill="#f3d9b1"/><path d="M11 19.3h2L12 21.5z" fill="#1c1a33"/></g>',
    daumen: '<circle cx="12" cy="12" r="10.5" fill="#14a06c"/><path d="M12 17.5V7M7.5 11.5 12 7l4.5 4.5" fill="none" stroke="#fff" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/>',
  };
  const ZEICHEN = {'🎯': 'ziel', '🔥': 'flamme', '⭐': 'stern', '🌟': 'stern', '✨': 'funkeln', '🍀': 'klee', '✅': 'haken', '👍': 'haken', '🔁': 'nochmal', '📖': 'buch', '🎲': 'wuerfel', '💡': 'tipp', '🎉': 'feier', '💪': 'blitz', '🤔': 'frage', '🌱': 'keim', '🏆': 'pokal', '🐢': 'langsam', '⚠': 'achtung', '👤': 'person', '📬': 'post', '🔒': 'schloss', '☁': 'wolke', '✏': 'stift', '👋': '' };
  const html = (name) => (SYMBOLE[name] ? `<svg class="ldx-sym" viewBox="0 0 24 24" aria-hidden="true">${SYMBOLE[name]}</svg>` : '');
  const RE = new RegExp('(' + Object.keys(ZEICHEN).join('|') + ')[\\uFE0E\\uFE0F]?', 'u');
  const REG = new RegExp(RE.source, 'gu');

  function tausche(node) {
    const txt = node.nodeValue;
    if (!txt || !RE.test(txt)) return;
    const p = node.parentNode;
    if (!p || p.closest('svg, script, style, textarea, .ldx-keep')) return;
    const frag = document.createDocumentFragment();
    let last = 0;
    txt.replace(REG, (m, z, pos) => {
      if (pos > last) frag.appendChild(document.createTextNode(txt.slice(last, pos)));
      const name = ZEICHEN[z];
      if (name) { const s = document.createElement('span'); s.className = 'ldx-symw'; s.innerHTML = html(name); frag.appendChild(s); }
      last = pos + m.length;
      return m;
    });
    if (last < txt.length) frag.appendChild(document.createTextNode(txt.slice(last)));
    p.replaceChild(frag, node);
  }
  function durchsuche(root) {
    if (root.nodeType === 3) return tausche(root);
    if (root.nodeType !== 1 || root.closest('svg')) return;
    const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while (w.nextNode()) nodes.push(w.currentNode);
    nodes.forEach(tausche);
  }
  function start() {
    const st = document.createElement('style');
    st.textContent = '.ldx-symw{display:inline-block;line-height:0;vertical-align:-.22em}.ldx-sym{width:1.3em;height:1.3em;display:block}';
    document.head.appendChild(st);
    durchsuche(document.body);
    new MutationObserver((ms) => {
      for (const m of ms) {
        if (m.type === 'characterData') tausche(m.target);
        else m.addedNodes.forEach(durchsuche);
      }
    }).observe(document.body, { childList: true, subtree: true, characterData: true });
  }
  window.LernDaxSymbole = { SYMBOLE, ZEICHEN, html };
  if (document.body) start(); else document.addEventListener('DOMContentLoaded', start);
})();
