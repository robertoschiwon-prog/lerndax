/* LernDax – Minispiele für die Spielhalle (seit lerndax-v114)
 * Vier eigene, einfache Spiele: Dachs-Sprung, Schlange, Blöcke stapeln, 2048-Zahlenschieben (Auswahl Roberto, 16.11.2026).
 * Kein Netz, keine Werbung, keine fremden Figuren. Die Spielzeit regelt die Seite (belohnung/index.html), nicht das Spiel.
 *
 * Jedes Spiel: { id, name, hilfe, tasten: [[taste, beschriftung], …], start(canvas, api) → { taste(t), wisch(richtung), tipp(), stop() } }
 *   api.punkte(n)  aktuelle Punkte melden · api.ende(n)  Spiel vorbei (Seite zeigt „Nochmal“)
 */
(function () {
  const INK = '#1c1a33', PAPIER = '#fbf6ee', TINT = '#f3ede2';
  function leinwand(canvas, w, h) {
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    canvas.width = w * dpr; canvas.height = h * dpr;
    canvas.style.aspectRatio = `${w} / ${h}`;
    const c = canvas.getContext('2d'); c.setTransform(dpr, 0, 0, dpr, 0, 0);
    return c;
  }
  function rund(c, x, y, w, h, r, fill, stroke) {
    c.beginPath(); c.moveTo(x + r, y); c.arcTo(x + w, y, x + w, y + h, r); c.arcTo(x + w, y + h, x, y + h, r); c.arcTo(x, y + h, x, y, r); c.arcTo(x, y, x + w, y, r); c.closePath();
    if (fill) { c.fillStyle = fill; c.fill(); }
    if (stroke) { c.strokeStyle = stroke; c.lineWidth = 2; c.stroke(); }
  }
  // Schleife mit requestAnimationFrame; f(dt in Sekunden), stoppt mit lauf.aus = true
  function schleife(f) {
    const lauf = { aus: false }; let t0 = null;
    const tick = (t) => { if (lauf.aus) return; if (t0 === null) t0 = t; const dt = Math.min(0.05, (t - t0) / 1000); t0 = t; f(dt); requestAnimationFrame(tick); };
    requestAnimationFrame(tick);
    return lauf;
  }

  // =====================================================
  // Dachs-Sprung: der Dachs läuft, Tippen = springen (in der Luft ein zweites Mal möglich)
  // =====================================================
  const dachsBild = new Image();
  dachsBild.src = '../icons/dachs.svg';
  const sprung = {
    id: 'sprung', name: 'Dachs-Sprung', hilfe: 'Tippe, damit der Dachs springt. In der Luft kannst du noch einmal springen.',
    tasten: [['sprung', 'Springen ⤒']],
    start(canvas, api) {
      const W = 360, H = 210, BODEN = 176, c = leinwand(canvas, W, H);
      const d = { y: BODEN - 40, vy: 0, spruenge: 0 };
      let hind = [], wolken = [{ x: 60, y: 40 }, { x: 250, y: 26 }, { x: 330, y: 60 }], tempo = 190, weg = 0, bis = 1.2, vorbei = false, pkt = 0;
      const springen = () => { if (vorbei) return; if (d.spruenge < 2) { d.vy = d.spruenge ? -430 : -520; d.spruenge++; } };
      const lauf = schleife((dt) => {
        if (!vorbei) {
          tempo = Math.min(430, tempo + dt * 6); weg += tempo * dt;
          d.vy += 1500 * dt; d.y += d.vy * dt;
          if (d.y >= BODEN - 40) { d.y = BODEN - 40; d.vy = 0; d.spruenge = 0; }
          bis -= dt;
          if (bis <= 0) {
            const art = Math.random() < 0.25 && weg > 1500 ? 'doppelt' : Math.random() < 0.5 ? 'stein' : 'stamm';
            hind.push(art === 'stein' ? { x: W + 10, w: 26, h: 24, art } : art === 'stamm' ? { x: W + 10, w: 18, h: 40, art } : { x: W + 10, w: 52, h: 26, art });
            bis = 0.9 + Math.random() * 1.1 - Math.min(0.4, weg / 12000);
          }
          hind.forEach((o) => (o.x -= tempo * dt)); hind = hind.filter((o) => o.x + o.w > -10);
          wolken.forEach((w) => { w.x -= tempo * dt * 0.2; if (w.x < -50) w.x = W + 40; });
          // Zusammenstoß (Dachs etwas kleiner gerechnet, damit es fair bleibt)
          const dx = 46, dy = d.y + 8, dw = 30, dh = 30;
          if (hind.some((o) => dx < o.x + o.w - 3 && dx + dw > o.x + 3 && dy + dh > BODEN - o.h + 3)) { vorbei = true; api.ende(pkt); }
          const neu = Math.floor(weg / 40); if (neu !== pkt) { pkt = neu; api.punkte(pkt); }
        }
        // Zeichnen
        c.fillStyle = '#dff1ff'; c.fillRect(0, 0, W, H);
        wolken.forEach((w) => { c.fillStyle = '#fff'; c.beginPath(); c.arc(w.x, w.y, 12, 0, 7); c.arc(w.x + 14, w.y - 6, 14, 0, 7); c.arc(w.x + 28, w.y, 11, 0, 7); c.fill(); });
        c.fillStyle = '#8fd18a'; c.fillRect(0, BODEN, W, H - BODEN); c.fillStyle = '#6dbb68';
        for (let x = -((weg * 1) % 24); x < W; x += 24) c.fillRect(x, BODEN, 12, 4);
        c.strokeStyle = INK; c.lineWidth = 2; c.beginPath(); c.moveTo(0, BODEN); c.lineTo(W, BODEN); c.stroke();
        hind.forEach((o) => {
          if (o.art === 'stamm') { rund(c, o.x, BODEN - o.h, o.w, o.h, 5, '#8a5a35', INK); c.fillStyle = '#c99566'; c.beginPath(); c.ellipse(o.x + o.w / 2, BODEN - o.h + 5, o.w / 2 - 3, 3, 0, 0, 7); c.fill(); }
          else if (o.art === 'stein') rund(c, o.x, BODEN - o.h, o.w, o.h, 10, '#9aa0b5', INK);
          else { rund(c, o.x, BODEN - o.h, 24, o.h, 9, '#9aa0b5', INK); rund(c, o.x + 26, BODEN - o.h, 26, o.h, 9, '#9aa0b5', INK); }
        });
        if (dachsBild.complete && dachsBild.naturalWidth) c.drawImage(dachsBild, 38, d.y, 44, 44);
        else rund(c, 40, d.y, 40, 40, 12, '#ff6b3d', INK);
      });
      return { taste: springen, tipp: springen, wisch: (r) => { if (r === 'hoch') springen(); }, stop: () => (lauf.aus = true) };
    },
  };

  // =====================================================
  // Schlange: Futter fressen, länger werden, nicht an den Rand und nicht in sich selbst
  // =====================================================
  const schlange = {
    id: 'schlange', name: 'Schlange', hilfe: 'Wische oder tippe die Pfeile. Friss die Äpfel, aber stoß nicht an den Rand oder an dich selbst.',
    tasten: [['links', '◀'], ['hoch', '▲'], ['runter', '▼'], ['rechts', '▶']],
    start(canvas, api) {
      const N = 16, Z = 20, c = leinwand(canvas, N * Z, N * Z);
      let k = [{ x: 5, y: 8 }, { x: 4, y: 8 }, { x: 3, y: 8 }], r = { x: 1, y: 0 }, naechste = r, futter = null, takt = 0, vorbei = false, pkt = 0;
      const RICHT = { links: { x: -1, y: 0 }, rechts: { x: 1, y: 0 }, hoch: { x: 0, y: -1 }, runter: { x: 0, y: 1 } };
      const neuesFutter = () => { do futter = { x: Math.floor(Math.random() * N), y: Math.floor(Math.random() * N) }; while (k.some((t) => t.x === futter.x && t.y === futter.y)); };
      neuesFutter();
      const lenken = (n) => { const d = RICHT[n]; if (d && !(d.x === -r.x && d.y === -r.y)) naechste = d; };
      const lauf = schleife((dt) => {
        if (!vorbei) {
          takt += dt;
          const dauer = Math.max(0.085, 0.16 - k.length * 0.002);
          while (takt >= dauer && !vorbei) {
            takt -= dauer; r = naechste;
            const kopf = { x: k[0].x + r.x, y: k[0].y + r.y };
            if (kopf.x < 0 || kopf.y < 0 || kopf.x >= N || kopf.y >= N || k.slice(0, -1).some((t) => t.x === kopf.x && t.y === kopf.y)) { vorbei = true; api.ende(pkt); break; }
            k.unshift(kopf);
            if (kopf.x === futter.x && kopf.y === futter.y) { pkt++; api.punkte(pkt); neuesFutter(); } else k.pop();
          }
        }
        for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) { c.fillStyle = (x + y) % 2 ? '#eef7e6' : '#e3f1d8'; c.fillRect(x * Z, y * Z, Z, Z); }
        c.fillStyle = '#e5383b'; c.beginPath(); c.arc(futter.x * Z + Z / 2, futter.y * Z + Z / 2 + 1, Z * 0.38, 0, 7); c.fill();
        c.fillStyle = '#14a06c'; c.fillRect(futter.x * Z + Z / 2, futter.y * Z + 2, 3, 5);
        k.forEach((t, i) => rund(c, t.x * Z + 1, t.y * Z + 1, Z - 2, Z - 2, 6, i ? '#3dbb6a' : '#1f8f4e', i ? null : INK));
        const h = k[0]; c.fillStyle = '#fff';
        [[-0.2, -0.2], [0.2, -0.2]].forEach(([ax, ay]) => { c.beginPath(); c.arc(h.x * Z + Z / 2 + (r.y ? ax * Z : r.x * 4), h.y * Z + Z / 2 + (r.x ? ay * Z : r.y * 4), 2.6, 0, 7); c.fill(); });
      });
      return { taste: lenken, wisch: lenken, tipp() {}, stop: () => (lauf.aus = true) };
    },
  };

  // =====================================================
  // Blöcke stapeln: fallende Formen zu vollen Reihen legen
  // =====================================================
  const FORMEN = [
    [[1, 1, 1, 1]], [[1, 1], [1, 1]], [[0, 1, 0], [1, 1, 1]], [[0, 1, 1], [1, 1, 0]], [[1, 1, 0], [0, 1, 1]], [[1, 0, 0], [1, 1, 1]], [[0, 0, 1], [1, 1, 1]],
  ];
  const FARBEN = ['#18b6c4', '#ffc53d', '#8b5cf6', '#14a06c', '#e5383b', '#3d7bff', '#ff6b3d'];
  const stapeln = {
    id: 'stapeln', name: 'Blöcke stapeln', hilfe: 'Schiebe und drehe die Formen. Eine volle Reihe verschwindet und bringt Punkte.',
    tasten: [['links', '◀'], ['drehen', '⟳'], ['runter', '▼'], ['rechts', '▶'], ['fallen', '⤓']],
    start(canvas, api) {
      const B = 10, HH = 18, Z = 18, c = leinwand(canvas, B * Z, HH * Z);
      const feld = Array.from({ length: HH }, () => Array(B).fill(0));
      let st, takt = 0, vorbei = false, pkt = 0, reihen = 0;
      const passt = (f, x, y) => f.every((zeile, j) => zeile.every((v, i) => !v || (x + i >= 0 && x + i < B && y + j < HH && (y + j < 0 || !feld[y + j][x + i]))));
      const neu = () => { const n = Math.floor(Math.random() * FORMEN.length); st = { f: FORMEN[n], n, x: Math.floor((B - FORMEN[n][0].length) / 2), y: -1 }; if (!passt(st.f, st.x, st.y + 1)) { vorbei = true; api.ende(pkt); } };
      const drehen = (f) => f[0].map((_, i) => f.map((z) => z[i]).reverse());
      const festsetzen = () => {
        st.f.forEach((zeile, j) => zeile.forEach((v, i) => { if (v && st.y + j >= 0) feld[st.y + j][st.x + i] = st.n + 1; }));
        let weg = 0;
        for (let y = HH - 1; y >= 0; y--) if (feld[y].every(Boolean)) { feld.splice(y, 1); feld.unshift(Array(B).fill(0)); weg++; y++; }
        if (weg) { reihen += weg; pkt += [0, 100, 300, 500, 800][weg] * (1 + Math.floor(reihen / 10)); api.punkte(pkt); }
        neu();
      };
      const runter = () => { if (passt(st.f, st.x, st.y + 1)) st.y++; else festsetzen(); takt = 0; };
      const taste = (t) => {
        if (vorbei) return;
        if (t === 'links' && passt(st.f, st.x - 1, st.y)) st.x--;
        else if (t === 'rechts' && passt(st.f, st.x + 1, st.y)) st.x++;
        else if (t === 'runter') runter();
        else if (t === 'fallen') { while (passt(st.f, st.x, st.y + 1)) st.y++; festsetzen(); }
        else if (t === 'drehen' || t === 'hoch') { const g = drehen(st.f); for (const dx of [0, -1, 1, -2, 2]) if (passt(g, st.x + dx, st.y)) { st.f = g; st.x += dx; break; } }
      };
      neu();
      const lauf = schleife((dt) => {
        if (!vorbei) { takt += dt; if (takt >= Math.max(0.12, 0.7 - Math.floor(reihen / 10) * 0.07)) runter(); }
        c.fillStyle = TINT; c.fillRect(0, 0, B * Z, HH * Z);
        c.strokeStyle = '#e4dccd'; c.lineWidth = 1;
        for (let x = 1; x < B; x++) { c.beginPath(); c.moveTo(x * Z, 0); c.lineTo(x * Z, HH * Z); c.stroke(); }
        const block = (x, y, farbe) => rund(c, x * Z + 1, y * Z + 1, Z - 2, Z - 2, 4, farbe, INK);
        feld.forEach((zeile, y) => zeile.forEach((v, x) => v && block(x, y, FARBEN[v - 1])));
        if (st && !vorbei) {
          let gy = st.y; while (passt(st.f, st.x, gy + 1)) gy++;
          c.globalAlpha = 0.22; st.f.forEach((zeile, j) => zeile.forEach((v, i) => v && gy + j >= 0 && block(st.x + i, gy + j, FARBEN[st.n]))); c.globalAlpha = 1;
          st.f.forEach((zeile, j) => zeile.forEach((v, i) => v && st.y + j >= 0 && block(st.x + i, st.y + j, FARBEN[st.n])));
        }
      });
      return { taste, wisch: (r) => taste(r === 'hoch' ? 'drehen' : r === 'runter' ? 'fallen' : r), tipp: () => taste('drehen'), stop: () => (lauf.aus = true) };
    },
  };

  // =====================================================
  // 2048: gleiche Zahlen zusammenschieben
  // =====================================================
  const FARB2048 = { 2: '#fff8ee', 4: '#ffe8cc', 8: '#ffc078', 16: '#ffa94d', 32: '#ff8a3d', 64: '#ff6b3d', 128: '#ffd43b', 256: '#fcc419', 512: '#94d82d', 1024: '#3dbb6a', 2048: '#3d7bff' };
  const zahlen = {
    id: 'zahlen', name: '2048', hilfe: 'Wische in eine Richtung. Zwei gleiche Zahlen werden zu einer: 2 + 2 = 4, 4 + 4 = 8 … Schaffst du 2048?',
    tasten: [['links', '◀'], ['hoch', '▲'], ['runter', '▼'], ['rechts', '▶']],
    start(canvas, api) {
      const N = 4, Z = 76, R = 8, c = leinwand(canvas, N * Z + R, N * Z + R);
      let f = Array.from({ length: N }, () => Array(N).fill(0)), pkt = 0, vorbei = false, neuPos = null, gewonnen = false;
      const leer = () => { const l = []; f.forEach((z, y) => z.forEach((v, x) => !v && l.push([x, y]))); return l; };
      const dazu = () => { const l = leer(); if (!l.length) return; const [x, y] = l[Math.floor(Math.random() * l.length)]; f[y][x] = Math.random() < 0.9 ? 2 : 4; neuPos = [x, y]; };
      dazu(); dazu();
      const schieben = (zeile) => { const z = zeile.filter(Boolean); for (let i = 0; i < z.length - 1; i++) if (z[i] === z[i + 1]) { z[i] *= 2; pkt += z[i]; if (z[i] === 2048) gewonnen = true; z.splice(i + 1, 1); } while (z.length < N) z.push(0); return z; };
      const zug = (r) => {
        if (vorbei) return;
        const vorher = JSON.stringify(f);
        for (let i = 0; i < N; i++) {
          if (r === 'links') f[i] = schieben(f[i]);
          else if (r === 'rechts') f[i] = schieben(f[i].slice().reverse()).reverse();
          else { const sp = f.map((z) => z[i]), neu = r === 'hoch' ? schieben(sp) : schieben(sp.slice().reverse()).reverse(); neu.forEach((v, y) => (f[y][i] = v)); }
        }
        if (JSON.stringify(f) === vorher) return;
        dazu(); api.punkte(pkt);
        const kannNoch = leer().length || f.some((z, y) => z.some((v, x) => (x < N - 1 && v === z[x + 1]) || (y < N - 1 && v === f[y + 1][x])));
        if (!kannNoch) { vorbei = true; api.ende(pkt); }
      };
      let pop = 0;
      const lauf = schleife((dt) => {
        pop = Math.min(1, pop + dt * 6);
        rund(c, 0, 0, N * Z + R, N * Z + R, 12, '#cdbfa8');
        f.forEach((z, y) => z.forEach((v, x) => {
          const s = neuPos && neuPos[0] === x && neuPos[1] === y ? 0.6 + 0.4 * pop : 1, g = (Z - R) * s, ox = R + x * Z + (Z - R - g) / 2, oy = R + y * Z + (Z - R - g) / 2;
          rund(c, ox, oy, g, g, 9, v ? FARB2048[v] || '#2a2d45' : '#e6dccb', v ? INK : null);
          if (v) { c.fillStyle = v >= 2048 || v > 2048 ? '#fff' : INK; c.font = `800 ${v < 100 ? 30 : v < 1000 ? 26 : 21}px Nunito, system-ui, sans-serif`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(v, ox + g / 2, oy + g / 2 + 1); }
        }));
        if (gewonnen) { c.fillStyle = 'rgba(61,123,255,.85)'; rund(c, 20, (N * Z) / 2 - 22, N * Z - 32, 50, 12, 'rgba(255,255,255,.92)', INK); c.fillStyle = INK; c.font = '800 20px Nunito, system-ui, sans-serif'; c.textAlign = 'center'; c.fillText('2048 geschafft! 🎉', (N * Z + R) / 2, (N * Z) / 2 + 4); }
      });
      return { taste: (t) => { gewonnen = false; pop = 0; zug(t); }, wisch: (t) => { gewonnen = false; pop = 0; zug(t); }, tipp() {}, stop: () => (lauf.aus = true) };
    },
  };

  window.LernDaxSpiele = [sprung, schlange, stapeln, zahlen];
})();
