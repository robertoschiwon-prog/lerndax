/* TecDax (Technik/Computer) – Grundlage für Klasse 5/6: Bausteine, Bilder und eigene Aufgabenarten
 * (Lehrplan Gymnasium Sachsen Technik/Computer, Fassung 2019, Klassenstufen 5/6; kein Schulbuch)
 *
 * Aufgaben wie in GeoDax und BioDax: Jeder Generator liefert bei jedem Aufruf eine neue Aufgabe
 *   { prompt, hint, solution, figure?, ex } mit choices/correct, fields oder order.
 * Die gemeinsamen Bausteine (auswahl, tippen, ordnen, sortiere, aussage, beschriften, erkennen, baue …) stehen in plattform/bausteine.js.
 * Neu in TecDax (unendlich viele Aufgaben, weil erzeugt):
 *   Zahnräder: Drehrichtung und Übersetzung · Riemen und Kette · Ordnerbaum und Pfad · Dateiarten an der Endung
 *   E-Mail-Adresse und Internetadresse zerlegen · Stahlmaßstab ablesen · Bemaßung lesen · Ansichten eines Körpers
 *   Stückliste lesen · Kostenaufstellung rechnen · Morsezeichen
 * Bilder: eigene Zeichnungen (themen/zeichnungen.js) und freie Fotos von Wikimedia Commons (themen/fotos.js, bildnachweis.html).
 * Fakten mit Quellen: faecher/technik/fakten.md. Jede Aufgabe hat genau eine richtige Lösung.
 */
(function () {
  const D = (window.TecDax = window.TecDax || {});
  const U = LernDaxBausteine(D, { passtNicht: 'Drei gehören zusammen. Was <b>passt nicht</b> dazu?' });
  const { R, pick, shuffle, nurText } = U;
  const BILDER = (D.bilder = D.bilder || {});
  const komma = (x) => String(Math.round(x * 100) / 100).replace('.', ',');
  const euro = (x) => (Math.round(x * 100) / 100).toFixed(2).replace('.', ',') + ' €';
  U.komma = komma; U.euro = euro;

  // Erzeugte Bilder bekommen einen Namen, damit der Merkzettel sie wieder zeigen kann
  let gz = 0;
  const GEN = {};
  function merke(sig, f) {
    if (!GEN[sig]) { GEN[sig] = 'gen' + ++gz; BILDER[GEN[sig]] = f; }
    return GEN[sig];
  }
  D.merke = merke;
  // Ein fertiges <svg> an eine Stelle in ein größeres Bild setzen
  const einbetten = (roh, x, y, w, h) => roh.replace(/^<svg([^>]*)>/, (m, a) => `<svg${a.replace(/ (style|role|aria-label)="[^"]*"/g, '')} x="${x}" y="${y}" width="${w}" height="${h}">`);
  D.einbetten = einbetten;
  const vb = (roh) => (roh.match(/viewBox="([^"]+)"/) || [0, '0 0 200 120'])[1].split(' ').map(Number);

  // =====================================================
  // Zahnräder: Drehrichtung
  // =====================================================
  const NAMEN = ['A', 'B', 'C', 'D', 'E'];
  const UHR = ['im Uhrzeigersinn', 'gegen den Uhrzeigersinn'];
  const zufallsZaehne = (n) => { const z = []; while (z.length < n) { const k = pick([10, 12, 14, 16, 18, 20, 24]); if (z[z.length - 1] !== k) z.push(k); } return z; };
  function zahnradRichtung(art, n) {
    n = n || R(2, 4);
    const z = zufallsZaehne(n), dir = pick([1, -1]), k = R(1, n - 1), erg = k % 2 ? -dir : dir;
    const o = { z, namen: NAMEN.slice(0, n), pfeil: dir };
    const ch = UHR.slice(), ok = erg > 0 ? 0 : 1;
    return { prompt: `Rad A dreht sich <b>${UHR[dir > 0 ? 0 : 1]}</b> (roter Pfeil). Wie dreht sich Rad <b>${NAMEN[k]}</b>?`, figure: D.zeichne.zahnraeder(o), choices: ch, correct: ok,
      hint: 'Zwei Zahnräder, die ineinandergreifen, drehen sich immer gegeneinander. Zähle Rad für Rad.',
      solution: `Jedes Rad dreht anders herum als sein Nachbar: A ${dir > 0 ? '↻' : '↺'}${NAMEN.slice(1, k + 1).map((x, i) => `, ${x} ${(i % 2 ? dir : -dir) > 0 ? '↻' : '↺'}`).join('')}. Rad ${NAMEN[k]} dreht sich <b>${UHR[ok]}</b>.`,
      ex: { mode: 'zahnrad', art, z, namen: o.namen, dir, k, frage: 'richtung' } };
  }
  // Übersetzung: Wie oft dreht sich das angetriebene Rad?
  function zahnradUebersetzung(art) {
    let z1, z2, n1, n2;
    for (let i = 0; i < 200; i++) {
      z1 = pick([10, 12, 15, 16, 20, 24, 30, 36, 40]); z2 = pick([10, 12, 15, 16, 20, 24, 30, 36, 40]); n1 = R(1, 6);
      if (z1 !== z2 && (n1 * z1) % z2 === 0) { n2 = (n1 * z1) / z2; if (n2 >= 1 && n2 <= 24) break; }
    }
    const typ = R(0, 2);
    const fig = D.zeichne.zahnraeder({ z: [z1, z2], namen: ['A', 'B'], pfeil: 1, zaehne: true, H: 150 });
    const ex = { mode: 'zahnrad', art, z: [z1, z2], namen: ['A', 'B'], dir: 1, n1, n2, frage: 'uebersetzung' };
    if (typ === 0) {
      return { prompt: `Rad A (<b>${z1} Zähne</b>) treibt Rad B (<b>${z2} Zähne</b>) an. A dreht sich <b>${n1}-mal</b>. Wie oft dreht sich B?`, figure: fig,
        fields: [{ answer: n2, suffix: '-mal', label: 'Umdrehungen von B' }], hint: `Bei einer Umdrehung von A greifen ${z1} Zähne in B. B braucht ${z2} Zähne für eine ganze Umdrehung.`,
        solution: `A dreht ${n1}-mal: ${n1} · ${z1} = ${n1 * z1} Zähne wandern an B vorbei. ${n1 * z1} : ${z2} = <b>${n2}</b> Umdrehungen von B.`, ex };
    }
    if (typ === 1) {
      const ch = ['Rad A', 'Rad B'], ok = z1 < z2 ? 0 : 1;
      return { prompt: `Rad A hat <b>${z1} Zähne</b>, Rad B hat <b>${z2} Zähne</b>. Welches Rad dreht sich <b>schneller</b>?`, figure: fig, choices: ch, correct: ok,
        hint: 'Beide Räder bewegen am Rand gleich viele Zähne weiter. Das kleine Rad ist schneller einmal herum.',
        solution: `Das Rad mit weniger Zähnen dreht sich schneller: <b>${ch[ok]}</b>.`, ex: Object.assign(ex, { frage: 'schneller' }) };
    }
    const ch = ['ins Schnelle: B dreht sich schneller als A', 'ins Langsame: B dreht sich langsamer als A'], ok = z1 > z2 ? 0 : 1;
    return { prompt: `Rad A (<b>${z1} Zähne</b>) treibt Rad B (<b>${z2} Zähne</b>) an. Wie ist dieses Getriebe übersetzt?`, figure: fig, choices: ch, correct: ok,
      hint: 'Großes Rad treibt kleines: Das kleine muss sich öfter drehen.',
      solution: `${z1 > z2 ? 'Das große Rad treibt das kleine an' : 'Das kleine Rad treibt das große an'}. Übersetzung <b>${ch[ok].split(':')[0]}</b>. Dafür ${z1 > z2 ? 'braucht man mehr Kraft' : 'reicht weniger Kraft'}.`, ex: Object.assign(ex, { frage: 'art' }) };
  }
  // Riemen, gekreuzter Riemen, Kette: Drehrichtung der zweiten Scheibe
  function riemenRichtung(art) {
    const typ = pick(['offen', 'gekreuzt', 'kette']), dir = pick([1, -1]);
    const erg = typ === 'gekreuzt' ? -dir : dir, ch = UHR.slice(), ok = erg > 0 ? 0 : 1;
    const name = { offen: 'Riemen', gekreuzt: 'gekreuzter Riemen', kette: 'Kette' }[typ];
    const fig = D.zeichne.riemen({ r: typ === 'kette' ? [32, 16] : typ === 'gekreuzt' ? [26, 26] : [30, 20], gekreuzt: typ === 'gekreuzt', kette: typ === 'kette', pfeil: dir, namen: ['A', 'B'] });
    return { prompt: `Scheibe A dreht sich <b>${UHR[dir > 0 ? 0 : 1]}</b>. Wie dreht sich Scheibe B? (${name})`, figure: fig, choices: ch, correct: ok,
      hint: 'Ein Riemen oder eine Kette nimmt die zweite Scheibe in dieselbe Richtung mit. Nur ein gekreuzter Riemen kehrt die Richtung um.',
      solution: typ === 'gekreuzt' ? `Der Riemen ist gekreuzt: B dreht sich <b>andersherum</b>, also ${UHR[ok]}.` : `${typ === 'kette' ? 'Eine Kette' : 'Ein offener Riemen'} nimmt B in dieselbe Richtung mit: <b>${UHR[ok]}</b>.`,
      ex: { mode: 'riemen', art, typ, dir } };
  }
  Object.assign(U, { zahnradRichtung, zahnradUebersetzung, riemenRichtung });

  // =====================================================
  // Ordner und Pfade
  // =====================================================
  const ORDNER = {
    TC: [['Leuchter', ['stueckliste.docx', 'zeichnung.png', 'ablaufplan.docx']], ['Getriebe', ['kran.png', 'notizen.txt']]],
    Deutsch: [['Gedichte', ['herbst.docx', 'vortrag.mp3']], ['Referate', ['dachs.docx', 'dachs.pptx']]],
    Mathe: [['Brüche', ['uebung.docx', 'torte.png']], ['Geometrie', ['dreieck.png', 'messung.xlsx']]],
    Bilder: [['Klassenfahrt', ['gruppe.jpg', 'burg.jpg']], ['Werkstatt', ['saege.jpg', 'video.mp4']]],
    Englisch: [['Vokabeln', ['unit1.docx', 'unit2.docx']], ['Lieder', ['song.mp3']]],
  };
  function baumNeu() {
    const faecher = shuffle(Object.keys(ORDNER)).slice(0, 3), wurzel = { name: 'H:', kinder: [] };
    faecher.forEach((f) => {
      const k = { name: f, kinder: [] };
      shuffle(ORDNER[f]).slice(0, R(1, 2)).forEach(([u, dat]) => k.kinder.push({ name: u, kinder: shuffle(dat).slice(0, R(1, 2)).map((d) => ({ name: d })) }));
      wurzel.kinder.push(k);
    });
    return wurzel;
  }
  const dateien = (w) => { const l = []; (function lauf(k, pfad) { if (!k.kinder) l.push({ name: k.name, pfad }); else k.kinder.forEach((c) => lauf(c, pfad.concat(k.name))); })(w, []); return l; };
  const pfadText = (p, name) => p.concat(name).join('\\').replace('H:\\', 'H:\\');
  function ordnerPfad(art) {
    for (let v = 0; v < 30; v++) {
      const w = baumNeu(), alle = dateien(w), ziel = pick(alle.filter((d) => d.pfad.length === 3)), typ = R(0, 2);
      if (!ziel) continue;
      const ordnerNamen = []; (function lauf(k) { if (k.kinder) { if (k.name !== 'H:') ordnerNamen.push(k.name); k.kinder.forEach(lauf); } })(w);
      const richtig = pfadText(ziel.pfad, ziel.name);
      const ex = { mode: 'baum', art, wurzel: w, ziel: ziel.name, pfad: ziel.pfad.slice() };
      if (typ === 0) {
        const p = ziel.pfad, anderer = pick(ordnerNamen.filter((n) => !p.includes(n)));
        const falsch = [pfadText([p[0], p[2], p[1]], ziel.name), pfadText([p[0], p[1]], ziel.name), pfadText([p[0], anderer, p[2]], ziel.name), pfadText([p[0], p[2]], ziel.name)];
        const ch = shuffle([richtig, ...shuffle([...new Set(falsch)].filter((x) => x !== richtig)).slice(0, 3)]);
        if (ch.length < 4) continue;
        // unsichtbare Trennstellen nach jedem \, damit lange Pfade auf schmalen Handys umbrechen
        const brich = (x) => x.replace(/\\/g, '\\\u200b');
        return { prompt: `Wie lautet der <b>Pfad</b> zur Datei <b>${ziel.name}</b>?`, figure: D.zeichne.ordnerbaum({ wurzel: w, hell: ziel.name }), choices: ch.map(brich), correct: ch.indexOf(richtig),
          hint: 'Ein Pfad beginnt beim Laufwerk und nennt jeden Ordner auf dem Weg, getrennt durch \\. Am Ende steht die Datei.',
          solution: `Vom Laufwerk H: über ${p.slice(1).join(' und ')} zur Datei: <b>${richtig}</b>`, ex };
      }
      if (typ === 1) {
        const eltern = ziel.pfad[2], ch = shuffle([eltern, ...shuffle(ordnerNamen.filter((n) => n !== eltern)).slice(0, 3)]);
        if (ch.length < 4) continue;
        return { prompt: `In welchem Ordner liegt die Datei <b>${ziel.name}</b> direkt?`, figure: D.zeichne.ordnerbaum({ wurzel: w, hell: ziel.name }), choices: ch, correct: ch.indexOf(eltern),
          hint: 'Folge der Linie von der Datei nach links oben zum nächsten Ordner.', solution: `Sie liegt im Ordner <b>${eltern}</b> (im Ordner ${ziel.pfad[1]}).`, ex };
      }
      // Welche Datei liegt in diesem Ordner?
      const ordner = ziel.pfad[2], drin = alle.filter((d) => d.pfad[2] === ordner), rest = alle.filter((d) => d.pfad[2] !== ordner);
      if (rest.length < 3) continue;
      const ch = shuffle([ziel.name, ...shuffle(rest).slice(0, 3).map((d) => d.name)]);
      return { prompt: `Welche Datei liegt im Ordner <b>${ordner}</b>?`, figure: D.zeichne.ordnerbaum({ wurzel: w }), choices: ch, correct: ch.indexOf(ziel.name),
        hint: `Suche den Ordner ${ordner} und schau, was eingerückt darunter steht.`, solution: `Im Ordner ${ordner} liegt: <b>${drin.map((d) => d.name).join(', ')}</b>. Gefragt war eine davon: <b>${ziel.name}</b>.`, ex };
    }
  }
  Object.assign(U, { ordnerPfad, baumNeu });

  // =====================================================
  // Dateiarten an der Endung
  // =====================================================
  const ENDUNG = [['txt', 0, 'reiner Text'], ['docx', 0, 'Text aus einem Textverarbeitungsprogramm'], ['odt', 0, 'Text aus einem Textverarbeitungsprogramm'],
    ['jpg', 1, 'Foto'], ['png', 1, 'Bild oder Grafik'], ['gif', 1, 'Bild, oft kleine Grafik'],
    ['exe', 2, 'Programm unter Windows'], ['apk', 2, 'App für Android'],
    ['mp3', 3, 'Musik oder Sprache'], ['wav', 3, 'Ton'], ['mp4', 3, 'Video']];
  const DATEIKATS = ['Textdatei', 'Grafikdatei', 'Programmdatei', 'Ton oder Video'];
  const STAMM = ['ferien', 'brief', 'logo', 'aufsatz', 'spiel', 'lied', 'katze', 'einladung', 'start', 'plan', 'hausaufgabe', 'werkstatt', 'radio', 'rechner'];
  function dateiArt(art) {
    const [e, k, w] = pick(ENDUNG), n = `${pick(STAMM)}.${e}`;
    return { prompt: `Was für eine Datei ist <b>${n}</b>?`, choices: DATEIKATS.slice(), correct: k, hint: 'Schau auf die Endung nach dem Punkt.',
      solution: `Die Endung <b>.${e}</b> steht für: ${w}. Also eine <b>${DATEIKATS[k]}</b>.`,
      ex: { mode: 'faecher', art, kats: DATEIKATS, items: [[n, k], ...shuffle(ENDUNG.filter((x) => x[0] !== e)).slice(0, 3).map((x) => [`${pick(STAMM)}.${x[0]}`, x[1]])], merk: `.${e} → <b>${DATEIKATS[k]}</b> (${w})` } };
  }
  U.dateiArt = dateiArt; D.ENDUNG = ENDUNG; D.DATEIKATS = DATEIKATS;

  // =====================================================
  // E-Mail-Adresse und Internetadresse zerlegen
  // =====================================================
  const VORN = ['lena', 'max', 'tom', 'mia', 'ben', 'emma', 'paul', 'lina', 'noah', 'ida'], NACH = ['berg', 'kurz', 'wolf', 'stein', 'brand', 'roth', 'lang', 'hahn'];
  const ANBIETER = ['schule-beispiel.de', 'post-beispiel.de', 'mail-beispiel.de', 'lernnetz-beispiel.de'];
  function mailAdresse(art) {
    const name = `${pick(VORN)}.${pick(NACH)}`, anb = pick(ANBIETER), adr = `${name}@${anb}`, typ = R(0, 2);
    const ex = { mode: 'mail', art, name, anb, frage: typ };
    if (typ === 0) {
      const ch = shuffle([name, anb, adr, '@']);
      return { prompt: `E-Mail-Adresse: <b>${adr}</b><br>Welcher Teil ist der <b>Benutzername</b>?`, choices: ch, correct: ch.indexOf(name), hint: 'Der Benutzername steht vor dem @.',
        solution: `Vor dem @ steht der Benutzername <b>${name}</b>, dahinter der Anbieter ${anb}.`, ex };
    }
    if (typ === 1) {
      const ch = shuffle([anb, name, adr, 'de']);
      return { prompt: `E-Mail-Adresse: <b>${adr}</b><br>Welcher Teil nennt den <b>Anbieter</b> (wo das Postfach liegt)?`, choices: ch, correct: ch.indexOf(anb), hint: 'Hinter dem @ steht, bei wem das Postfach liegt.',
        solution: `Hinter dem @ steht der Anbieter: <b>${anb}</b>.`, ex };
    }
    const ok = adr, falsch = [`${name}.${anb}`, `${name}@${anb.replace('.de', '')}`, `${name} @ ${anb}`, `@${name}${anb}`];
    const ch = shuffle([ok, ...shuffle(falsch).slice(0, 3)]);
    return { prompt: 'Welche E-Mail-Adresse ist <b>richtig geschrieben</b>?', choices: ch, correct: ch.indexOf(ok), hint: 'Eine E-Mail-Adresse hat genau ein @, keine Leerzeichen und hinten eine Endung wie .de.',
      solution: `Richtig: <b>${ok}</b>: Benutzername, @, Anbieter mit Endung, ohne Leerzeichen.`, ex };
  }
  const SEITEN = [['www.dachs-beispiel.de', 'tiere'], ['www.werkstatt-beispiel.de', 'saegen'], ['www.lernen-beispiel.at', 'mathe'], ['www.museum-beispiel.ch', 'technik'], ['www.zahnrad-beispiel.org', 'getriebe']];
  const LAND = { de: 'Deutschland', at: 'Österreich', ch: 'Schweiz', org: 'keinem Land (Organisation)' };
  function urlTeile(art) {
    const [dom, pf] = pick(SEITEN), prot = pick(['https', 'https', 'http']), adr = `${prot}://${dom}/${pf}`, end = dom.split('.').pop(), typ = R(0, 2);
    const ex = { mode: 'url', art, prot, dom, pf, frage: typ };
    if (typ === 0) {
      const ch = shuffle([`.${end}`, prot, `/${pf}`, 'www']);
      return { prompt: `Internetadresse: <b>${adr}</b><br>Welcher Teil ist die <b>Endung</b>, die oft das Land verrät?`, choices: ch, correct: ch.indexOf(`.${end}`), hint: 'Die Endung steht am Ende des Namens, vor dem ersten /.',
        solution: `<b>.${end}</b> steht für ${LAND[end]}.`, ex };
    }
    if (typ === 1) {
      const ch = shuffle([`/${pf}`, dom, prot, `.${end}`]);
      return { prompt: `Internetadresse: <b>${adr}</b><br>Welcher Teil führt zu einer <b>bestimmten Seite</b> auf der Webseite?`, choices: ch, correct: ch.indexOf(`/${pf}`), hint: 'Nach dem Namen der Webseite kommt ein /. Dahinter steht, welche Seite du willst.',
        solution: `<b>/${pf}</b> zeigt auf die Seite „${pf}“ der Webseite ${dom}.`, ex };
    }
    const ch = ['https: die Verbindung ist verschlüsselt', 'http: die Verbindung ist verschlüsselt'], ok = 0;
    return { prompt: 'Woran erkennst du an der Adresse, dass die Verbindung <b>verschlüsselt</b> ist?', choices: ch, correct: ok, hint: 'Das s steht für „sicher“ (englisch secure).',
      solution: 'Bei <b>https</b> ist die Verbindung verschlüsselt. Andere können nicht mitlesen, was du eingibst. Ob die Seite selbst vertrauenswürdig ist, sagt das aber nicht.', ex: Object.assign(ex, { prot: 'https' }) };
  }
  Object.assign(U, { mailAdresse, urlTeile });

  // =====================================================
  // Stahlmaßstab ablesen (Anriss von der Bezugskante)
  // =====================================================
  function linealLesen(art) {
    const mm = pick([R(3, 58), R(1, 11) * 5]);
    return { prompt: 'Der rote Strich ist der <b>Anriss</b>. Wie weit ist er von der Bezugskante entfernt?', figure: D.zeichne.lineal(mm),
      fields: [{ answer: mm, suffix: 'mm', label: 'Abstand' }], hint: 'Der Maßstab beginnt genau an der Bezugskante bei 0. Die langen Striche mit Zahl sind 10 mm, die mittleren 5 mm, jeder kleine Strich 1 mm.',
      solution: `Bis zur ${Math.floor(mm / 10) * 10} sind es ${Math.floor(mm / 10) * 10} mm${mm % 10 ? `, dann noch ${mm % 10} kleine Striche` : ''}: <b>${mm} mm</b>.`, ex: { mode: 'lineal', art, mm } };
  }
  U.linealLesen = linealLesen;

  // =====================================================
  // Bemaßung lesen
  // =====================================================
  function bemassungLesen(art) {
    const l = pick([80, 90, 100, 120, 140, 150, 160]), b = pick([40, 50, 60, 70, 80].filter((x) => x < l * 0.8)), d = pick([6, 8, 10, 12, 16, 20].filter((x) => x < b / 2.5));
    const x = Math.round(R(Math.ceil(d), l - d * 2) / 5) * 5 || 20, y = Math.round(b / 2 / 5) * 5 || b / 2;
    const o = { l, b, x: Math.min(Math.max(x, d + 5), l - d - 5), y, d };
    const typ = R(0, 4), fig = D.zeichne.bemassung(o), ex = { mode: 'bemassung', art, o, frage: typ };
    const fr = [
      ['Wie <b>lang</b> ist die Platte?', o.l, 'Die Länge steht an der Maßlinie unter der ganzen Platte.'],
      ['Wie <b>breit</b> (hoch) ist die Platte?', o.b, 'Die Maßlinie links reicht über die ganze Höhe. Ihre Zahl liest man von rechts.'],
      ['Wie groß ist der <b>Durchmesser</b> des Lochs?', o.d, 'Das Zeichen ⌀ heißt Durchmesser.'],
      ['Wie weit ist die <b>Mitte des Lochs</b> von der linken Kante entfernt?', o.x, 'Maße zu einem Loch gehen immer bis zu seiner Mittellinie.'],
      ['Wie weit ist das Loch vom <b>rechten Rand</b> entfernt (bis zur Lochmitte)?', o.l - o.x, 'Diese Zahl steht nicht da. Rechne: ganze Länge minus Abstand von links.'],
    ][typ];
    return { prompt: fr[0] + '<br><small>Alle Maße in mm.</small>', figure: fig, fields: [{ answer: fr[1], suffix: 'mm', label: 'Maß' }], hint: fr[2],
      solution: typ === 4 ? `${o.l} mm − ${o.x} mm = <b>${o.l - o.x} mm</b>` : `Die Maßzahl ist <b>${fr[1]}</b>, also ${fr[1]} mm. Ohne Einheit bedeuten Maße in technischen Zeichnungen immer Millimeter.`, ex };
  }
  U.bemassungLesen = bemassungLesen;

  // =====================================================
  // Ansichten eines Körpers aus Würfeln
  // =====================================================
  const ANSICHT = { vorn: 'Vorderansicht', oben: 'Draufsicht', links: 'Seitenansicht von links' };
  function koerperNeu() {
    for (let v = 0; v < 200; v++) {
      const NX = R(2, 3), h = [0, 1].map(() => Array.from({ length: NX }, () => R(0, 2)));
      const n = h.flat().reduce((a, b) => a + b, 0);
      if (n < 3 || h[0].every((x) => !x) || h[1].every((x) => !x)) continue;
      // jede Spalte (von vorn gesehen) braucht etwas, sonst ist die Form zerrissen
      if (h[0].some((x, i) => !x && !h[1][i])) continue;
      const sig = ['vorn', 'oben', 'links'].map((a) => D.zeichne.ansicht(h, a).sig);
      if (new Set(sig).size === 3) return h;
    }
    return [[1, 2, 1], [0, 1, 0]];
  }
  function ansichtBild(h, labels) {
    const koerper = D.zeichne.koerper(h, { s: 26 }), [, , kw, kh] = vb(koerper), ans = labels.map(([a, l]) => [D.zeichne.ansicht(h, a, { s: 15 }), l]);
    const W = kw + ans.reduce((s, [v]) => s + v.w + 12, 0) + 8, H = Math.max(kh, ...ans.map(([v]) => v.h + 30));
    let s = einbetten(koerper, 0, (H - kh) / 2, kw, kh), x = kw + 8;
    ans.forEach(([v, l], i) => {
      const y = (H - v.h - 18) / 2;
      s += `<g data-wahl="${i}" style="cursor:pointer"><rect x="${x - 4}" y="${y - 4}" width="${v.w + 8}" height="${v.h + 26}" rx="6" fill="#f7f8fb" stroke="#c9c2b4"/><g transform="translate(${x} ${y})">${v.s}</g><text x="${x + v.w / 2}" y="${y + v.h + 16}" text-anchor="middle" style="font:800 11px Nunito,sans-serif;fill:#2b2540">${l}</text></g>`;
      x += v.w + 12;
    });
    return D.svg(Math.round(W), Math.round(H), s, 'Körper und Ansichten');
  }
  function ansichtFinden(art) {
    const h = koerperNeu(), typ = R(0, 1);
    if (typ === 0) {
      const gesucht = pick(['vorn', 'oben', 'links']), reihe = shuffle(['vorn', 'oben', 'links']), k = reihe.indexOf(gesucht), L = ['A', 'B', 'C'];
      return { prompt: `Welches Bild zeigt die <b>${ANSICHT[gesucht]}</b> des Körpers?<br><small>Tippe auf das Bild oder den Buchstaben.</small>`, figure: ansichtBild(h, reihe.map((a, i) => [a, L[i]])), choices: L.slice(), correct: k,
        hint: 'Vorderansicht: Blick in Pfeilrichtung. Draufsicht: Blick von oben. Seitenansicht von links: Blick von der linken Seite.',
        solution: `<b>${L[k]}</b> ist die ${ANSICHT[gesucht]}. ${reihe.map((a, i) => i === k ? '' : `${L[i]}: ${ANSICHT[a]}`).filter(Boolean).join(', ')}.`,
        ex: { mode: 'ansicht', art, h, gesucht } };
    }
    const gezeigt = pick(['vorn', 'oben', 'links']), ch = ['Vorderansicht', 'Draufsicht', 'Seitenansicht von links'];
    return { prompt: 'Welche Ansicht des Körpers siehst du rechts?', figure: ansichtBild(h, [[gezeigt, '?']]), choices: ch, correct: ch.indexOf(ANSICHT[gezeigt]),
      hint: 'Stell dir vor, du schaust genau von vorn, genau von oben oder genau von links auf den Körper.',
      solution: `Das ist die <b>${ANSICHT[gezeigt]}</b>.`, ex: { mode: 'ansicht', art, h, gesucht: gezeigt } };
  }
  Object.assign(U, { ansichtFinden, koerperNeu, ansichtBild }); D.ANSICHT = ANSICHT;

  // =====================================================
  // Stückliste und Kostenaufstellung
  // =====================================================
  // Werkstücke wie im Lehrplan (Beispiele): Leuchter (Holz), Schutzbacken (Kunststoff), Kissenhülle (Stoff), Handyhalter (Holz)
  const STUECK = [
    { name: 'Leuchter', teile: [['Grundplatte', 1, 'Kiefer', '120 × 120 × 18'], ['Säule', 1, 'Buche, Rundstab', '⌀ 30 × 150'], ['Kerzenteller', 1, 'Kiefer', '⌀ 80 × 12'], ['Holzschraube', 2, 'Stahl', '4 × 40']] },
    { name: 'Schutzbacken', teile: [['Backe', 2, 'Acrylglas', '100 × 40 × 3'], ['Magnetstreifen', 2, 'Gummi mit Magnet', '80 × 10']] },
    { name: 'Kissenhülle', teile: [['Vorderteil', 1, 'Baumwollstoff', '420 × 420'], ['Rückteil', 2, 'Baumwollstoff', '420 × 260'], ['Nähgarn', 1, 'Polyester', '20 m']] },
    { name: 'Handyhalter', teile: [['Standfuß', 1, 'Buche', '100 × 70 × 18'], ['Lehne', 1, 'Buche', '100 × 90 × 10'], ['Holzdübel', 3, 'Buche', '⌀ 6 × 30'], ['Filzgleiter', 4, 'Filz', '⌀ 10']] },
  ];
  D.STUECK = STUECK;
  const stueckTabelle = (s, hell) => D.zeichne.tabelle({ kopf: ['Pos.', 'Menge', 'Benennung', 'Werkstoff', 'Maße (mm)'], breiten: [26, 34, 70, 84, 72], zeilen: s.teile.map((t, i) => [String(i + 1), String(t[1]), t[0], t[2], t[3]]), hell, name: 'Stückliste ' + s.name });
  function stuecklisteLesen(art) {
    const s = pick(STUECK), i = R(0, s.teile.length - 1), t = s.teile[i], typ = R(0, 3);
    const ex = { mode: 'karte', nach: false, art, svg: merke('stueck' + s.name + i, () => stueckTabelle(s, i)) };
    if (typ === 0) {
      return { prompt: `Stückliste <b>${s.name}</b>: Wie viele Teile „${t[0]}“ braucht man?`, figure: stueckTabelle(s), fields: [{ answer: t[1], label: 'Menge', suffix: 'Stück' }], hint: 'Such die Zeile mit der Benennung und lies in der Spalte „Menge“.',
        solution: `Zeile ${i + 1}: <b>${t[1]}</b> × ${t[0]}.`, ex: Object.assign(ex, { q: `Wie viele ${t[0]}?`, opts: [String(t[1])], ok: 0, merk: `<b>${t[1]}</b>: Die Menge steht in der zweiten Spalte.` }) };
    }
    if (typ === 1) {
      const wst = [...new Set(STUECK.flatMap((x) => x.teile.map((y) => y[2])))], ch = shuffle([t[2], ...shuffle(wst.filter((w) => w !== t[2])).slice(0, 3)]);
      return { prompt: `Stückliste <b>${s.name}</b>: Aus welchem <b>Werkstoff</b> ist Position ${i + 1}?`, figure: stueckTabelle(s), choices: ch, correct: ch.indexOf(t[2]), hint: 'Pos. ist die Nummer der Zeile. Lies in der Spalte „Werkstoff“.',
        solution: `Position ${i + 1} (${t[0]}) ist aus <b>${t[2]}</b>.`, ex: Object.assign(ex, { q: `Werkstoff von Position ${i + 1}?`, opts: [t[2]], ok: 0, merk: `<b>${t[2]}</b>: Spalte Werkstoff, Zeile ${i + 1}.` }) };
    }
    if (typ === 2) {
      const pool = [...new Set(s.teile.map((x) => x[0]).concat(['Schraubzwinge', 'Laubsägeblatt', 'Feile']))];
      const ch2 = shuffle([t[0], ...shuffle(pool.filter((x) => x !== t[0])).slice(0, 3)]);
      return { prompt: `Stückliste <b>${s.name}</b>: Welches Teil steht in <b>Position ${i + 1}</b>?`, figure: stueckTabelle(s), choices: ch2, correct: ch2.indexOf(t[0]), hint: 'Die Position ist die laufende Nummer in der ersten Spalte.',
        solution: `Position ${i + 1}: <b>${t[0]}</b>.`, ex: Object.assign(ex, { q: `Position ${i + 1}?`, opts: [t[0]], ok: 0, merk: `<b>${t[0]}</b>: erste Spalte = Position.` }) };
    }
    const n = s.teile.reduce((a, x) => a + x[1], 0);
    return { prompt: `Stückliste <b>${s.name}</b>: Wie viele Teile sind es <b>zusammen</b>?`, figure: stueckTabelle(s), fields: [{ answer: n, label: 'Teile', suffix: 'Stück' }], hint: 'Addiere alle Zahlen in der Spalte „Menge“.',
      solution: `${s.teile.map((x) => x[1]).join(' + ')} = <b>${n}</b> Teile.`, ex: Object.assign(ex, { q: 'Wie viele Teile zusammen?', opts: [String(n)], ok: 0, merk: `<b>${n}</b>: alle Mengen addiert.` }) };
  }
  // Kostenaufstellung: Menge × Einzelpreis = Preis, dazu die Summe
  const PREISE = { Grundplatte: 1.2, Säule: 0.8, Kerzenteller: 0.6, Holzschraube: 0.1, Backe: 0.9, Magnetstreifen: 0.4, Vorderteil: 2.5, Rückteil: 1.5, Nähgarn: 1, Standfuß: 1.1, Lehne: 0.9, Holzdübel: 0.05, Filzgleiter: 0.15 };
  function kostenRechnen(art) {
    const s = pick(STUECK), zeilen = s.teile.map((t) => [t[0], t[1], PREISE[t[0]], t[1] * PREISE[t[0]]]), sum = zeilen.reduce((a, z) => a + z[3], 0), typ = R(0, 1);
    const i = R(0, zeilen.length - 1);
    const tab = (frage) => D.zeichne.tabelle({ kopf: ['Teil', 'Menge', 'Einzelpreis', 'Preis'], breiten: [76, 40, 64, 60], zeilen: zeilen.map((z, k) => [z[0], String(z[1]), euro(z[2]), frage === k ? '?' : euro(z[3])]).concat([['Summe', '', '', frage === 'summe' ? '?' : euro(sum)]]), name: 'Kostenaufstellung' });
    if (typ === 0) {
      const z = zeilen[i];
      return { prompt: `Kostenaufstellung <b>${s.name}</b>: Was kostet die Zeile „${z[0]}“?`, figure: tab(i), fields: [{ answer: Math.round(z[3] * 100) / 100, suffix: '€', label: 'Preis' }], hint: 'Preis = Menge mal Einzelpreis.',
        solution: `${z[1]} · ${euro(z[2])} = <b>${euro(z[3])}</b>`, ex: { mode: 'tabelle', art, zeilen, i, sum, name: s.name } };
    }
    return { prompt: `Kostenaufstellung <b>${s.name}</b>: Was kostet alles <b>zusammen</b>?`, figure: tab('summe'), fields: [{ answer: Math.round(sum * 100) / 100, suffix: '€', label: 'Summe' }], hint: 'Addiere alle Preise in der letzten Spalte.',
      solution: `${zeilen.map((z) => euro(z[3])).join(' + ')} = <b>${euro(sum)}</b>`, ex: { mode: 'tabelle', art, zeilen, i: -1, sum, name: s.name } };
  }
  Object.assign(U, { stuecklisteLesen, kostenRechnen, stueckTabelle });

  // =====================================================
  // Morsezeichen
  // =====================================================
  const MORSE = { A: '·−', B: '−···', C: '−·−·', D: '−··', E: '·', F: '··−·', G: '−−·', H: '····', I: '··', J: '·−−−', K: '−·−', L: '·−··', M: '−−', N: '−·', O: '−−−', P: '·−−·', Q: '−−·−', R: '·−·', S: '···', T: '−', U: '··−', V: '···−', W: '·−−', X: '−··−', Y: '−·−−', Z: '−−··' };
  D.MORSE = MORSE;
  const WOERTER = ['SOS', 'TOR', 'OMA', 'OPA', 'ROT', 'EIS', 'TEE', 'MAUS', 'DACHS', 'HALLO', 'NEST', 'SONNE', 'MOND', 'AST', 'ZAHN'];
  const morse = (w) => w.split('').map((b) => MORSE[b]).join(' / ');
  function morseLesen(art) {
    const w = pick(WOERTER), typ = R(0, 1);
    if (typ === 0) {
      const ch = shuffle([w, ...shuffle(WOERTER.filter((x) => x !== w && x.length === w.length)).concat(shuffle(WOERTER.filter((x) => x !== w))).filter((x, i, a) => a.indexOf(x) === i).slice(0, 3)]);
      return { prompt: `Welches Wort ist das?<br><b style="font-size:1.25em;letter-spacing:.08em">${morse(w)}</b><br><small>/ trennt die Buchstaben. · = kurz, − = lang</small>`, choices: ch, correct: ch.indexOf(w), hint: 'Schau in die Morsetabelle: E = ·, T = −, S = ···, O = −−−.',
        solution: `${w.split('').map((b) => `${b} = ${MORSE[b]}`).join(', ')}: <b>${w}</b>`, ex: { mode: 'morse', art, w } };
    }
    const b = pick(Object.keys(MORSE)), ch = shuffle([MORSE[b], ...shuffle(Object.values(MORSE).filter((x) => x !== MORSE[b])).slice(0, 3)]);
    return { prompt: `Wie morst man den Buchstaben <b>${b}</b>?`, choices: ch, correct: ch.indexOf(MORSE[b]), hint: 'Häufige Buchstaben haben kurze Zeichen: E ist nur ein Punkt.',
      solution: `<b>${b} = ${MORSE[b]}</b>`, ex: { mode: 'morse', art, w: b } };
  }
  U.morseLesen = morseLesen; U.morse = morse;
})();
