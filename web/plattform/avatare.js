/* LernDax – Avatare (Plattform, für alle Fächer)
 * 12 eigene Figuren im Stil des Dachses, dazu eine Hintergrundfarbe.
 * Gespeichert als Text "figur:farbe", z. B. "fuchs:blau".
 *
 *   LernDaxAvatare.html(wert, px)     → HTML für einen runden Avatar
 *   LernDaxAvatare.picker(wert, fertig) → Auswahl-Fenster öffnen
 */
(function () {
  const INK = '#1c1a33';
  // Auge: weiß, Pupille leicht nach vorn, kleiner Glanzpunkt
  const eye = (x, y, r = 4.4) =>
    `<circle cx="${x}" cy="${y}" r="${r}" fill="#fff"/><circle cx="${x + r * 0.18}" cy="${y + r * 0.15}" r="${r * 0.58}" fill="${INK}"/><circle cx="${x + r * 0.42}" cy="${y - r * 0.2}" r="${r * 0.2}" fill="#fff"/>`;
  const eyes = (y, dx = 11, r) => eye(50 - dx, y, r) + eye(50 + dx, y, r);
  const smile = (y, w = 6, c = INK) => `<path d="M${50 - w} ${y} Q50 ${y + w * 0.7} ${50 + w} ${y}" stroke="${c}" stroke-width="2.2" fill="none" stroke-linecap="round"/>`;

  const FIGUREN = [
    { id: 'fuchs', name: 'Fuchs', svg:
      `<path d="M22 14 L42 36 L16 46 Z" fill="#e8742a"/><path d="M78 14 L58 36 L84 46 Z" fill="#e8742a"/>
       <path d="M25 22 L37 36 L22 41 Z" fill="${INK}" opacity=".75"/><path d="M75 22 L63 36 L78 41 Z" fill="${INK}" opacity=".75"/>
       <path d="M50 90 C42 84 22 64 17 47 C14 34 30 26 50 26 C70 26 86 34 83 47 C78 64 58 84 50 90 Z" fill="#ff8a3d"/>
       <path d="M50 90 C44 84 31 70 26 58 C35 62 43 61 50 67 C57 61 65 62 74 58 C69 70 56 84 50 90 Z" fill="#fff8ee"/>
       ${eyes(50, 12)}<ellipse cx="50" cy="83" rx="5.5" ry="4" fill="${INK}"/>` },
    { id: 'eule', name: 'Eule', svg:
      `<path d="M22 22 L34 34 L20 40 Z" fill="#6f4f36"/><path d="M78 22 L66 34 L80 40 Z" fill="#6f4f36"/>
       <ellipse cx="50" cy="58" rx="33" ry="33" fill="#8d6748"/>
       <ellipse cx="50" cy="72" rx="20" ry="17" fill="#d9b98f"/>
       <path d="M42 70 q3 3 6 0 M52 70 q3 3 6 0 M47 77 q3 3 6 0" stroke="#a7825b" stroke-width="1.6" fill="none"/>
       <circle cx="37" cy="50" r="12" fill="#f3e3c6"/><circle cx="63" cy="50" r="12" fill="#f3e3c6"/>
       ${eye(37, 50, 7.5)}${eye(63, 50, 7.5)}
       <path d="M45 60 L55 60 L50 69 Z" fill="#ff9f43"/>` },
    { id: 'pinguin', name: 'Pinguin', svg:
      `<ellipse cx="50" cy="55" rx="34" ry="35" fill="#2a2d45"/>
       <path d="M50 88 C30 88 20 74 21 60 C22 50 30 42 39 44 C44 45 47 48 50 52 C53 48 56 45 61 44 C70 42 78 50 79 60 C80 74 70 88 50 88 Z" fill="#fff8ee"/>
       ${eyes(54, 11)}
       <path d="M42 63 Q50 58 58 63 Q50 72 42 63 Z" fill="#ff9f43"/>
       <circle cx="30" cy="66" r="4" fill="#ffb3c7" opacity=".7"/><circle cx="70" cy="66" r="4" fill="#ffb3c7" opacity=".7"/>` },
    { id: 'katze', name: 'Katze', svg:
      `<path d="M18 20 L42 34 L20 50 Z" fill="#8f96ad"/><path d="M82 20 L58 34 L80 50 Z" fill="#8f96ad"/>
       <path d="M23 28 L36 35 L24 44 Z" fill="#ffb3c7"/><path d="M77 28 L64 35 L76 44 Z" fill="#ffb3c7"/>
       <ellipse cx="50" cy="58" rx="34" ry="30" fill="#a3aac1"/>
       <path d="M50 30 L46 42 L54 42 Z M38 31 L38 39 M62 31 L62 39" stroke="#7d849b" stroke-width="2.4" fill="#7d849b" stroke-linecap="round"/>
       ${eyes(55, 12)}
       <path d="M46 66 L54 66 L50 71 Z" fill="#ff8fab"/>${smile(73, 5)}
       <path d="M22 64 L36 66 M22 72 L36 70 M78 64 L64 66 M78 72 L64 70" stroke="${INK}" stroke-width="1.4" stroke-linecap="round" opacity=".55"/>` },
    { id: 'hund', name: 'Hund', svg:
      `<ellipse cx="50" cy="56" rx="31" ry="32" fill="#c98b55"/>
       <ellipse cx="20" cy="52" rx="10" ry="21" transform="rotate(14 20 52)" fill="#7a4e2c"/>
       <ellipse cx="80" cy="52" rx="10" ry="21" transform="rotate(-14 80 52)" fill="#7a4e2c"/>
       <ellipse cx="62" cy="44" rx="9" ry="8" fill="#fff4e4"/>
       ${eyes(48, 11)}
       <ellipse cx="50" cy="72" rx="16" ry="13" fill="#fff4e4"/>
       <ellipse cx="50" cy="66" rx="6.5" ry="4.8" fill="${INK}"/>
       <path d="M50 70 L50 74" stroke="${INK}" stroke-width="2"/>${smile(74, 6)}
       <path d="M47 77 Q50 85 53 77 Z" fill="#ff7b9c"/>` },
    { id: 'igel', name: 'Igel', svg:
      `<path d="M10 64 L16 48 L8 40 L20 34 L16 22 L30 24 L32 10 L44 18 L50 6 L56 18 L68 10 L70 24 L84 22 L80 34 L92 40 L84 48 L90 64 Z" fill="#5e4632"/>
       <path d="M18 64 C18 44 32 34 50 34 C68 34 82 44 82 64 C82 80 68 90 50 90 C32 90 18 80 18 64 Z" fill="#f2dcb8"/>
       ${eyes(60, 12)}
       <circle cx="50" cy="73" r="5" fill="${INK}"/>${smile(78, 7)}
       <circle cx="30" cy="72" r="4" fill="#ffb3a7" opacity=".8"/><circle cx="70" cy="72" r="4" fill="#ffb3a7" opacity=".8"/>` },
    { id: 'waschbaer', name: 'Waschbär', svg:
      `<circle cx="24" cy="30" r="10" fill="#7f8494"/><circle cx="76" cy="30" r="10" fill="#7f8494"/>
       <circle cx="24" cy="30" r="5" fill="${INK}"/><circle cx="76" cy="30" r="5" fill="${INK}"/>
       <ellipse cx="50" cy="57" rx="35" ry="31" fill="#a2a7b6"/>
       <path d="M16 52 C26 40 40 44 50 52 C60 44 74 40 84 52 C78 64 62 62 50 58 C38 62 22 64 16 52 Z" fill="#2a2d45"/>
       <path d="M30 40 Q38 36 44 42 M70 40 Q62 36 56 42" stroke="#fff" stroke-width="3" fill="none" stroke-linecap="round"/>
       ${eyes(52, 13)}
       <path d="M32 72 C38 64 62 64 68 72 C64 84 36 84 32 72 Z" fill="#f3f0ea"/>
       <ellipse cx="50" cy="70" rx="5.5" ry="4" fill="${INK}"/>${smile(76, 5)}` },
    { id: 'drache', name: 'Drache', svg:
      `<path d="M30 30 L24 10 L38 26 Z" fill="#ffd166"/><path d="M70 30 L76 10 L62 26 Z" fill="#ffd166"/>
       <path d="M44 22 L50 12 L56 22 Z" fill="#2c9e5c"/>
       <ellipse cx="50" cy="54" rx="33" ry="30" fill="#3dbb6a"/>
       <ellipse cx="50" cy="74" rx="24" ry="15" fill="#8be0a4"/>
       <circle cx="43" cy="70" r="2.2" fill="#1f6b3e"/><circle cx="57" cy="70" r="2.2" fill="#1f6b3e"/>
       ${eyes(48, 13, 5)}
       <path d="M36 79 Q50 86 64 79" stroke="#1f6b3e" stroke-width="2.2" fill="none" stroke-linecap="round"/>
       <path d="M44 81 L46 86 L48 81 Z M52 81 L54 86 L56 81 Z" fill="#fff"/>` },
    { id: 'roboter', name: 'Roboter', svg:
      `<line x1="50" y1="22" x2="50" y2="10" stroke="#7f8494" stroke-width="3"/><circle cx="50" cy="9" r="5" fill="#ff6b6b"/>
       <rect x="12" y="44" width="8" height="18" rx="3" fill="#7f8494"/><rect x="80" y="44" width="8" height="18" rx="3" fill="#7f8494"/>
       <rect x="18" y="22" width="64" height="62" rx="16" fill="#b8c4d6"/>
       <rect x="26" y="34" width="48" height="36" rx="10" fill="#2a2d45"/>
       <rect x="33" y="43" width="10" height="12" rx="4" fill="#58e1ff"/><rect x="57" y="43" width="10" height="12" rx="4" fill="#58e1ff"/>
       <path d="M40 61 Q50 67 60 61" stroke="#58e1ff" stroke-width="2.6" fill="none" stroke-linecap="round"/>
       <circle cx="26" cy="77" r="2.4" fill="#7f8494"/><circle cx="74" cy="77" r="2.4" fill="#7f8494"/>` },
    { id: 'krake', name: 'Krake', svg:
      `<path d="M22 66 C14 78 18 90 26 86 C30 84 28 76 34 72 M38 72 C34 84 36 94 44 92 C48 90 46 80 48 74 M52 74 C54 82 52 92 58 92 C66 92 64 82 62 72 M66 72 C72 76 70 84 74 86 C82 90 86 78 78 66" stroke="#7b4fe0" stroke-width="9" fill="none" stroke-linecap="round"/>
       <path d="M16 56 C16 30 32 16 50 16 C68 16 84 30 84 56 C84 70 70 76 50 76 C30 76 16 70 16 56 Z" fill="#8b5cf6"/>
       <circle cx="34" cy="30" r="4" fill="#a98bff"/><circle cx="62" cy="26" r="3" fill="#a98bff"/><circle cx="70" cy="38" r="2.5" fill="#a98bff"/>
       ${eyes(52, 12, 5)}${smile(64, 6)}
       <circle cx="28" cy="62" r="4" fill="#ffb3c7" opacity=".7"/><circle cx="72" cy="62" r="4" fill="#ffb3c7" opacity=".7"/>` },
    { id: 'faultier', name: 'Faultier', svg:
      `<ellipse cx="50" cy="56" rx="35" ry="33" fill="#8a6b50"/>
       <ellipse cx="50" cy="60" rx="28" ry="25" fill="#e8d5b5"/>
       <path d="M24 56 C28 46 40 48 44 54 C42 62 30 66 24 56 Z" fill="#5b4330"/>
       <path d="M76 56 C72 46 60 48 56 54 C58 62 70 66 76 56 Z" fill="#5b4330"/>
       ${eye(35, 55, 4)}${eye(65, 55, 4)}
       <ellipse cx="50" cy="66" rx="5" ry="3.6" fill="${INK}"/>${smile(73, 7)}
       <path d="M30 30 Q40 24 50 28 Q60 24 70 30" stroke="#6e523b" stroke-width="3" fill="none" stroke-linecap="round"/>` },
    { id: 'axolotl', name: 'Axolotl', svg:
      `<g stroke="#ff6fa8" stroke-width="5" stroke-linecap="round" fill="none">
         <path d="M20 46 L6 36"/><path d="M18 56 L4 56"/><path d="M20 66 L6 76"/>
         <path d="M80 46 L94 36"/><path d="M82 56 L96 56"/><path d="M80 66 L94 76"/></g>
       <ellipse cx="50" cy="58" rx="34" ry="28" fill="#ffa8cb"/>
       <circle cx="36" cy="54" r="4" fill="${INK}"/><circle cx="64" cy="54" r="4" fill="${INK}"/>
       <circle cx="37.3" cy="52.7" r="1.3" fill="#fff"/><circle cx="65.3" cy="52.7" r="1.3" fill="#fff"/>
       <path d="M34 68 Q50 78 66 68" stroke="${INK}" stroke-width="2.4" fill="none" stroke-linecap="round"/>
       <circle cx="28" cy="64" r="4" fill="#ff7fb0" opacity=".7"/><circle cx="72" cy="64" r="4" fill="#ff7fb0" opacity=".7"/>` },
  ];

  const FARBEN = [
    { id: 'orange', name: 'Orange', c: '#ff6b3d' }, { id: 'blau', name: 'Blau', c: '#3d7bff' },
    { id: 'gruen', name: 'Grün', c: '#14a06c' }, { id: 'lila', name: 'Lila', c: '#8b5cf6' },
    { id: 'gelb', name: 'Gelb', c: '#ffc53d' }, { id: 'pink', name: 'Pink', c: '#ff5fa2' },
    { id: 'tuerkis', name: 'Türkis', c: '#18b6c4' }, { id: 'nacht', name: 'Nacht', c: '#2a2d45' },
  ];
  const STANDARD = 'fuchs:blau';

  function parse(v) {
    const [f, c] = String(v || STANDARD).split(':');
    return { fig: FIGUREN.find((x) => x.id === f) || FIGUREN[0], col: FARBEN.find((x) => x.id === c) || FARBEN[1] };
  }
  function svg(v) {
    const { fig, col } = parse(v);
    return `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${fig.name}"><circle cx="50" cy="50" r="50" fill="${col.c}"/><g transform="translate(9 11) scale(.82)">${fig.svg}</g></svg>`;
  }
  function html(v, px, extra) {
    return `<span class="ldx-ava${extra ? ' ' + extra : ''}" style="width:${px}px;height:${px}px">${svg(v)}</span>`;
  }

  // ---------- Auswahl-Fenster ----------
  let styled = false;
  function style() {
    if (styled) return; styled = true;
    const s = document.createElement('style');
    s.textContent = `
.ldx-ava{display:inline-block;flex:0 0 auto;border-radius:50%;border:2px solid #1c1a33;box-shadow:2px 2px 0 #1c1a33;overflow:hidden;background:#fff;line-height:0}
.ldx-ava svg{width:100%;height:100%;display:block}
.ldx-ov{position:fixed;inset:0;z-index:50;background:rgba(28,26,51,.5);display:grid;place-items:end center;padding:0}
@media (min-width:600px){.ldx-ov{place-items:center;padding:20px}}
.ldx-sheet{width:100%;max-width:520px;max-height:94vh;overflow:auto;background:#fbf6ee;border:2px solid #1c1a33;border-radius:22px 22px 0 0;padding:16px 16px calc(18px + env(safe-area-inset-bottom));font-family:Nunito,system-ui,sans-serif;color:#1c1a33;animation:ldxup .22s ease-out}
@media (min-width:600px){.ldx-sheet{border-radius:22px}}
@keyframes ldxup{from{transform:translateY(30px);opacity:0}to{transform:none;opacity:1}}
.ldx-sheet.still{animation:none}
.ldx-sheet h2{font:800 22px "Bricolage Grotesque",Nunito,system-ui,sans-serif;margin:0 0 4px}
.ldx-sheet p{margin:0 0 12px;color:#6b6680;font-weight:700;font-size:15px}
.ldx-prev{display:flex;align-items:center;gap:14px;margin:4px 0 14px}
.ldx-prev b{font:800 20px "Bricolage Grotesque",Nunito,system-ui,sans-serif}
.ldx-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-bottom:14px}
.ldx-fig{background:#fff;border:2px solid #1c1a33;border-radius:16px;padding:6px 4px 4px;display:flex;flex-direction:column;align-items:center;gap:2px;font:800 12px Nunito,system-ui,sans-serif;cursor:pointer;color:#1c1a33}
.ldx-fig svg{width:100%;max-width:72px;height:auto}
.ldx-fig.on{background:#fff1e6;box-shadow:0 0 0 3px #ff6b3d}
.ldx-cols{display:flex;flex-wrap:wrap;gap:8px;margin:2px 0 16px}
.ldx-col{width:38px;height:38px;border-radius:50%;border:2px solid #1c1a33;cursor:pointer}
.ldx-col.on{box-shadow:0 0 0 3px #fbf6ee,0 0 0 6px #1c1a33}
.ldx-done{width:100%;border:2px solid #1c1a33;border-radius:14px;box-shadow:3px 3px 0 #1c1a33;background:#ff6b3d;color:#1c1a33;font:800 18px Nunito,system-ui,sans-serif;padding:13px;cursor:pointer}
.ldx-done:active{transform:translate(3px,3px);box-shadow:none}
.ldx-lbl{font-weight:800;font-size:13px;color:#6b6680;margin:0 0 6px}`;
    document.head.appendChild(s);
  }
  function picker(current, done, opts) {
    style();
    opts = opts || {};
    let { fig, col } = parse(current);
    const ov = document.createElement('div');
    ov.className = 'ldx-ov';
    let first = true;
    const draw = () => {
      const v = fig.id + ':' + col.id;
      const y = ov.firstChild ? ov.firstChild.scrollTop : 0;
      ov.innerHTML = `<div class="ldx-sheet${first ? '' : ' still'}" role="dialog" aria-label="Avatar aussuchen">
        <h2>${opts.title || 'Such dir deinen Avatar aus!'}</h2>
        <p>${opts.text || 'Du kannst ihn jederzeit wieder ändern.'}</p>
        <div class="ldx-prev">${html(v, 72)}<b>${fig.name}</b></div>
        <div class="ldx-lbl">Figur</div>
        <div class="ldx-grid">${FIGUREN.map((f) => `<button class="ldx-fig${f.id === fig.id ? ' on' : ''}" data-fig="${f.id}">${svg(f.id + ':' + col.id)}${f.name}</button>`).join('')}</div>
        <div class="ldx-lbl">Farbe</div>
        <div class="ldx-cols">${FARBEN.map((c) => `<button class="ldx-col${c.id === col.id ? ' on' : ''}" data-col="${c.id}" title="${c.name}" aria-label="${c.name}" style="background:${c.c}"></button>`).join('')}</div>
        <button class="ldx-done">Fertig</button></div>`;
      ov.firstChild.scrollTop = y; first = false;
    };
    draw();
    ov.addEventListener('click', (e) => {
      const b = e.target.closest('button');
      if (e.target === ov) { ov.remove(); return; }
      if (!b) return;
      if (b.dataset.fig) { fig = FIGUREN.find((x) => x.id === b.dataset.fig); draw(); }
      else if (b.dataset.col) { col = FARBEN.find((x) => x.id === b.dataset.col); draw(); }
      else if (b.classList.contains('ldx-done')) { ov.remove(); done(fig.id + ':' + col.id); }
    });
    document.body.appendChild(ov);
  }

  // ---------- Speichern (auf dem Gerät, mit dem Profil synchronisiert) ----------
  const KEY = 'lerndax.avatar';
  const get = () => { try { return localStorage.getItem(KEY) || ''; } catch (e) { return ''; } };
  const set = (v) => { try { localStorage.setItem(KEY, v); } catch (e) {} };

  window.LernDaxAvatare = { FIGUREN, FARBEN, STANDARD, parse, svg, html, picker, get, set, style };
})();
