/* LernDax – die Fach-App: alles, was jedes Fach braucht (Startseite des Fachs, Übungsrunde, Tipp und Lösungsweg,
 * Sterne, Tagesziel, Knobeln, Trainingsseiten, Erklär-Player, Elternbereich, Synchronisation).
 * Ein Fach liefert nur Themen, Aufgaben, Erklärungen und Symbole und beschreibt sich in window.LERNDAX_FACH:
 *   id:            Fach-ID wie in faecher.js ('mathe', 'deutsch')
 *   name, fach:    'MaDax', 'Mathe'
 *   key:           Schlüssel für den Lernstand im Browser (nie ändern)
 *   app:           { grades: {5: {lbs: [...]}}, util: {fmt, pick, shuffle}, explainers: {...} }
 *   icons:         { svg(themaId) } (optional)
 *   dachs, dachsKlein, dachsStaunt: Bilder des Fach-Dachses
 *   entdecken:     Reihenfolge der Entdeckungen; entdeckenText, entdeckenKurz: Texte dazu
 *   andereKlassen: { 6: ['Lernbereich …'] } für „Klasse 6 kommt bald“
 *   (Aufgabenformen der Themen: choices/correct, fields, layout:'satz', tap, und seit v63
 *    order: { words:[…gemischt], answer:'richtiger Satz' oder Liste, end:'.' } = Wörter in Reihenfolge antippen)
 *   audio:         Ordner mit Aufnahmen (optional, z. B. 'audio/us/'): darin index.json und je Thema eine Sammeldatei
 *                  <thema>.bin. Knöpfe mit data-say="name" spielen die Aufnahme mit diesem Namen.
 *                  Oder eine Liste zur Auswahl [{ id, name, pfad }]: dann zeigt die Startseite des Fachs einen Umschalter „Aussprache“.
 * Das Aussehen steht in fach.css.
 */
(function () {
  const F = window.LERNDAX_FACH; // Einstellungen des Fachs, siehe <fach>/index.html
  const M = F.app;
  const U = M.util;
  const $app = document.getElementById('app');
  const TASKS_PER_ROUND = 8;
  const EXP = M.explainers || {};

  // ---------- Speicher (nur auf diesem Gerät) ----------
  const KEY = F.key;
  let S = { name: '', grade: 5, stats: {}, days: [], total: 0, seen: {}, resetAt: 0 };
  try { const raw = localStorage.getItem(KEY); if (raw) S = Object.assign(S, JSON.parse(raw)); } catch (e) {}
  const saveLocal = () => { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {} };
  const SYNC = window.LernDaxSync || window.MathelixSync || null;
  const AVA = window.LernDaxAvatare || null;
  const save = () => { saveLocal(); if (SYNC) SYNC.changed(); };
  let VIEW = 'home';
  let SYS = { enabled: false };

  // ---------- Hilfen ----------
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const today = () => { const d = new Date(); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); };
  const dayStr = (d) => d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  function streak() {
    const set = new Set(S.days);
    const d = new Date();
    if (!set.has(dayStr(d))) d.setDate(d.getDate() - 1);
    let n = 0;
    while (set.has(dayStr(d))) { n++; d.setDate(d.getDate() - 1); }
    return n;
  }
  const grade = () => M.grades[5];
  const allTopics = () => grade().lbs.flatMap((lb) => lb.topics.map((t) => Object.assign({ lb }, t)));
  const findTopic = (id) => allTopics().find((t) => t.id === id);
  // Welche Erklärung gehört zu einer Aufgabe? Normalerweise die des Themas; Textaufgaben nennen sie in ex.via.
  const exId = (topic, task) => (task && task.ex && task.ex.via && EXP[task.ex.via] ? task.ex.via : topic.id);
  const TR = (() => {
    let id = '';
    try { id = new URLSearchParams(location.search).get('t') || ''; } catch (e) {}
    if (!id) return null;
    const def = (window.LERNDAX_TRAININGS || {})[id];
    if (!def || def.fach !== F.id) return { id, missing: true };
    const gruppen = def.gruppen.map((g) => Object.assign({}, g, { topics: g.themen.map(findTopic).filter(Boolean) }));
    return Object.assign({ id }, def, { gruppen, topics: gruppen.flatMap((g) => g.topics) });
  })();
  if (TR && !TR.missing) document.title = `${TR.titel} · Training · ${F.name}`;

  // Tagesziel: eine vollständige Runde pro Tag (Wunsch der Eltern). S.rounds = { 'JJJJ-MM-TT': Anzahl },
  // wird mit synchronisiert (geübt wird abwechselnd an Handy, Computer und Tablet).
  const roundsToday = () => ((S.rounds || {})[today()] || 0);
  const goalLine = () => (roundsToday() >= 1
    ? `🎯 Tagesziel geschafft${roundsToday() > 1 ? ` (${roundsToday()} Runden)` : ''} ✓`
    : '🎯 Tagesziel: eine Runde');

  function mastery(id) {
    const st = S.stats[id];
    if (!st || !st.hist.length) return { avg: 0, n: 0, stars: 0 };
    const avg = st.hist.reduce((a, b) => a + b, 0) / st.hist.length;
    let stars = 0;
    if (st.hist.length >= 3) stars = avg >= 0.9 && st.hist.length >= 8 ? 3 : avg >= 0.75 ? 2 : avg >= 0.5 ? 1 : 0;
    return { avg, n: st.n, stars };
  }
  const starHtml = (n) => `<span class="stars">${[0, 1, 2].map((i) => `<span class="${i < n ? 'on' : ''}">★</span>`).join('')}</span>`;
  const totalStars = () => allTopics().reduce((s, t) => s + mastery(t.id).stars, 0);
  const weakTopics = () => allTopics().filter((t) => { const m = mastery(t.id); return m.n > 0 && m.avg < 0.75; });

  function parseNum(s) {
    s = String(s).trim().replace(/[\s  ]/g, '').replace(/−/g, '-');
    s = s.replace(/(%|€|°|[a-zA-ZäöüÄÖÜ²³]+)$/g, '');
    if (s === '') return NaN;
    if (s.includes(',')) s = s.replace(/\./g, '').replace(',', '.');
    else if (/^-?[1-9]\d{0,2}(\.\d{3})+$/.test(s)) s = s.replace(/\./g, ''); // 1.250 = Tausenderpunkt; 0.125 und 3.5 = Punkt statt Komma
    return /^-?\d*\.?\d+$/.test(s) ? Number(s) : NaN;
  }
  // Primfaktoren: „2·2·3“, „2*2*3“, „2 2 3“ und auch mit Hochzahl „2²·3“ oder „2^2·3“.
  // Eine unlesbare Eingabe ergibt eine leere Liste (= falsch).
  const SUPS = '⁰¹²³⁴⁵⁶⁷⁸⁹';
  function parseFactors(s) {
    s = String(s).replace(/[⁰¹²³⁴⁵⁶⁷⁸⁹]+/g, (m) => '^' + [...m].map((c) => SUPS.indexOf(c)).join(''));
    const out = [];
    for (const tok of s.split(/[\s·*×xX.,;:+]+/).filter(Boolean)) {
      const m = tok.match(/^(\d+)(?:\^(\d+))?$/);
      if (!m) return [];
      const e = m[2] === undefined ? 1 : +m[2];
      if (e < 1 || e > 20) return [];
      for (let i = 0; i < e; i++) out.push(+m[1]);
    }
    return out.sort((a, b) => a - b);
  }
  const near = (a, b) => Math.abs(a - b) <= 1e-9 * Math.max(1, Math.abs(b));

  // Wörter als Antwort (type:'text'): f.answer ist ein Wort oder eine Liste erlaubter Schreibweisen.
  // Groß- und Kleinschreibung zählt (außer f.ci), Leerzeichen am Rand und doppelte Leerzeichen nicht.
  const textAnswers = (f) => [].concat(f.answer).map(String);
  // Apostrophe gelten alle gleich: Das Handy tippt „’“ statt „'“ (don’t).
  const normText = (s, f) => { s = String(s).trim().replace(/[’‘`´]/g, "'").replace(/\s+/g, ' ').replace(/[.!?]+$/, ''); return f.ci ? s.toLocaleLowerCase('de') : s; };
  const textOk = (v, f) => textAnswers(f).some((a) => normText(a, f) === normText(v, f));
  const cleanTok = (s) => String(s).replace(/[.,!?:;„“"]+/g, '');

  function answerText(t) {
    if (t.answerText) return t.answerText;
    if (t.choices) return t.choices[t.correct];
    if (t.order) return `${[].concat(t.order.answer)[0]}${t.order.end || ''}`;
    if (t.tap) return t.tap.correct.map((i) => (t.tap.gaps ? `nach „${cleanTok(t.tap.tokens[i])}“` : cleanTok(t.tap.tokens[i]))).join(', ');
    if (t.layout === 'satz') return t.fields.map((f) => `${f.prefix || ''} ${'fixed' in f ? f.fixed : `<u>${textAnswers(f)[0]}</u>`}${f.suffix && !/^[.,!?]/.test(f.suffix) ? ' ' : ''}${f.suffix || ''}`).join(' ').replace(/\s+/g, ' ').trim();
    const parts = t.fields.filter((f) => !('fixed' in f)).map((f) => `${f.prefix ? f.prefix + ' ' : ''}${f.type === 'text' ? textAnswers(f)[0] : U.fmt(f.answer)}${f.suffix ? ' ' + f.suffix : ''}`);
    return parts.join(', ');
  }

  // ---------- Kopfzeile ----------
  const header = () => `
    <div class="top">
      <a class="hubbtn" href="../" aria-label="Zur LernDax-Startseite" title="Zur LernDax-Startseite"><img src="${F.dachsKlein || F.dachs}" alt=""></a>
      <button class="logo" data-go="home" aria-label="${F.name}-Start"><span>${F.name.replace(/Dax$/, '')}<b>Dax</b></span></button>
      <div class="pills">
        <span class="pill" title="Tage in Folge geübt">🔥 ${streak()}</span>
        <span class="pill" title="Gesammelte Sterne">⭐ ${totalStars()}</span>
        ${SYS.enabled && SYS.profileId ? `<span class="pill syncpill" id="syncpill" title="${syncTitle()}">${syncIcon()}</span>` : ''}
      </div>
    </div>`;

  // ---------- Startseite ----------
  const OTHER = F.andereKlassen || {}; // geplante Lernbereiche der anderen Klassen (für „kommt bald“)

  const DISC_ORDER = F.entdecken || [];
  const hasDisc = () => Object.keys(EXP).some((id) => EXP[id].discover);
  function discoverHtml() {
    const ids = DISC_ORDER.filter((id) => EXP[id] && EXP[id].discover).concat(Object.keys(EXP).filter((id) => EXP[id].discover && !DISC_ORDER.includes(id)));
    if (!ids.length) return '';
    const seen = S.seen || {};
    return `<section class="lb" id="entdecken">
        <div class="lbh"><span class="nr" style="background:var(--ink)">✦</span><h2>Entdecken</h2></div>
        <p class="disc-intro">${F.entdeckenText}</p>
        <div class="discs">${ids.map((id) => { const d = EXP[id].discover; return `
          <button class="disc" data-explain="${id}">
            <span class="disc-ic">${d.icon}</span>
            <span class="disc-tx"><b>${d.q}</b><small>${d.tag}</small></span>
            ${seen[id] ? '<span class="disc-seen" title="schon angesehen">✓</span>' : '<span class="disc-new">neu</span>'}
          </button>`; }).join('')}</div>
      </section>`;
  }

  function topicTile(t, nr) {
    return `
            <div class="twrap">
              <button class="topic" data-topic="${t.id}">
                <span class="ti bg${nr}">${(F.icons && F.icons.svg(t.id)) || t.icon}</span>
                <span class="tt">${t.title}${t.buch ? `<small class="tb">📖 Buch ${t.buch}</small>` : ''}</span>
                ${starHtml(mastery(t.id).stars)}${(S.knobel || {})[t.id] && S.knobel[t.id].ok ? `<span class="knz" title="${S.knobel[t.id].ok} Knobel-Aufgaben geknackt">🧩 ${S.knobel[t.id].ok}</span>` : ''}
              </button>
              ${EXP[t.id] ? `<button class="explbtn" data-explain="${t.id}" aria-label="Erklärung zu ${t.title} ansehen">▶</button>` : ''}
            </div>`;
  }
  const nameCard = () => (S.name ? '' : `
      <div class="card namecard" style="margin-bottom:18px">
        <div class="gruss"><span class="dax"><img src="${F.dachs}" alt=""></span><h2 class="blase">Hallo, ich bin ${F.name}!<br>Wie heißt du?</h2></div>
        <form id="nameF"><input id="nameI" maxlength="20" autocomplete="off" placeholder="Dein Vorname"><button class="btn org">Los</button></form>
      </div>`);
  function bindName() {
    const f = document.getElementById('nameF');
    if (f) f.addEventListener('submit', (e) => {
      e.preventDefault();
      const v = document.getElementById('nameI').value.trim();
      if (v) {
        S.name = v; save(); home();
        // Beim allerersten Mal gleich den eigenen Avatar aussuchen
        let asked = ''; try { asked = localStorage.getItem('lerndax.avatar.asked') || ''; } catch (err) {}
        if (AVA && !AVA.get() && !asked) AVA.picker(AVA.STANDARD, (a) => { if (SYNC && SYS.enabled) SYNC.setAvatar(a); else AVA.set(a); try { localStorage.setItem('lerndax.avatar.asked', '1'); } catch (err) {} home(); }, { title: `Schön, dass du da bist, ${v}!`, text: 'Such dir deinen Avatar aus. Das bist du in LernDax, und du kannst ihn jederzeit ändern.' });
      }
    });
  }

  // ---------- Training für eine Klassenarbeit (Aufruf mit ?t=<id>) ----------
  // Nur über den Link erreichbar, in der allgemeinen App nicht verlinkt (siehe plattform/trainings.js).
  const fit = (id) => { const m = mastery(id); return m.n ? Math.round(100 * m.avg * Math.min(1, m.n / 8)) : 0; };
  const fitAvg = (ts) => (ts.length ? Math.round(ts.reduce((a, t) => a + fit(t.id), 0) / ts.length) : 0);
  const fitBar = (p) => `<div class="fit" role="img" aria-label="${p} Prozent"><i style="width:${p}%;background:${p >= 75 ? 'var(--ok)' : p >= 40 ? 'var(--c5)' : 'var(--c1)'}"></i></div>`;
  const isWeak = (t) => { const m = mastery(t.id); return m.n > 0 && m.avg < 0.75; };
  function daysUntil(iso) {
    const [y, m, d] = iso.split('-').map(Number);
    const n = new Date();
    return Math.round((new Date(y, m - 1, d) - new Date(n.getFullYear(), n.getMonth(), n.getDate())) / 864e5);
  }
  function trainingHome() {
    VIEW = 'home'; $app.dataset.view = VIEW;
    if (TR.missing) {
      $app.innerHTML = header() + `<div class="card"><h2>Dieses Training gibt es nicht (mehr)</h2>
        <p style="color:var(--soft)">Vielleicht ist der Link falsch abgeschrieben. Alle Themen findest du in ${F.name}.</p>
        <a class="btn org" href="./">Zu ${F.name}</a></div>`;
      return;
    }
    const dl = daysUntil(TR.datum);
    const [y, m, d] = TR.datum.split('-').map(Number);
    const dstr = new Date(y, m - 1, d).toLocaleDateString('de-DE', { weekday: 'long', day: 'numeric', month: 'long' });
    const count = dl > 1 ? `noch <b>${dl} Tage</b>` : dl === 1 ? '<b>morgen</b>!' : dl === 0 ? '<b>heute</b>. Viel Erfolg! 🍀' : 'ist vorbei. Üben lohnt sich trotzdem.';
    const total = fitAvg(TR.topics);
    const weak = TR.topics.filter(isWeak);
    const greet = S.name ? `Hallo ${esc(S.name)}!` : 'Hallo!';
    $app.innerHTML = header() + nameCard() + `
      <div class="card trhero">
        <div class="trtop">${AVA ? `<button class="avabtn" data-ava aria-label="Avatar ändern">${AVA.html(AVA.get() || AVA.STANDARD, 44)}</button>` : ''}<span class="trhi">${greet}</span><span class="trbadge">🎯 Training</span></div>
        <h1>${esc(TR.titel)}</h1>
        <p class="trdate">${dstr} · ${count}</p>
        <div class="trfit"><span>So fit bist du</span><b>${total} %</b></div>
        ${fitBar(total)}
        <p class="trtoday">${roundsToday() >= 1 ? `✅ Tagesziel geschafft: heute ${roundsToday() === 1 ? 'eine Runde' : roundsToday() + ' Runden'} geübt. Super!` : '🎯 Tagesziel: eine Runde. Das dauert nur ein paar Minuten.'}</p>
      </div>
      <div class="quick">
        <button class="btn org" data-tr="all"><span class="ic">🎯</span>Trainingsrunde<small>${TASKS_PER_ROUND} Aufgaben, Schwaches öfter</small></button>
        <button class="btn" data-tr="review" ${weak.length ? '' : 'disabled'}><span class="ic">🔁</span>Fehler-Training<small>${weak.length ? (weak.length === 1 ? '1 Thema' : weak.length + ' Themen') + ' zum Wiederholen' : 'gerade nichts offen'}</small></button>
      </div>
      ${knobelBar(TR.topics)}
      ${TR.gruppen.map((g, i) => `
        <section class="lb">
          <div class="lbh"><span class="nr bg${(i % 5) + 1}">${i + 1}</span><h2>${esc(g.titel)}</h2>${g.topics.length > 1 ? `<button class="btn mix" data-tr="g${i}">Mix</button>` : ''}</div>
          <div class="trmeta"><span>${g.buch ? `📖 Buch ${esc(g.buch)}` : ''}</span><span>fit: <b>${fitAvg(g.topics)} %</b></span></div>
          ${fitBar(fitAvg(g.topics))}
          <div class="topics">${g.topics.map((t) => topicTile(t, t.lb.nr)).join('')}</div>
        </section>`).join('')}
      ${TR.buch && TR.buch.length ? `<div class="card trbook"><h2>📖 Im Buch üben</h2><ul>${TR.buch.map((b) => `<li>${esc(b.text)}: <b>${esc(b.seiten)}</b></li>`).join('')}</ul></div>` : ''}
      <div class="foot"><a class="btn ghost" href="./">Alle ${F.fach}-Themen</a></div>`;
    bindName();
  }

  function home() {
    sayStop();
    if (TR) return trainingHome();
    VIEW = 'home'; $app.dataset.view = VIEW;
    const weak = weakTopics();
    const mixOk = practicedTopics().length >= 2;
    const greet = S.name ? `Hallo ${esc(S.name)}!` : 'Hallo!';
    $app.innerHTML = header() + `
      ${nameCard()}
      <div class="hello">${AVA ? `<button class="avabtn" data-ava aria-label="Avatar ändern">${AVA.html(AVA.get() || AVA.STANDARD, 56)}</button>` : ''}<div><h1>${greet}</h1><p>Klasse 5 · Gymnasium Sachsen</p><p class="goal${roundsToday() >= 1 ? ' done' : ''}">${goalLine()}</p></div></div>
      <div class="grades">${Array.from({ length: 10 }, (_, i) => i + 1).map((g) => `<button class="gchip ${g === 5 ? 'on' : 'soon'}" data-grade="${g}">${g}</button>`).join('')}</div>
      ${weiterBtn()}
      ${!hasDisc() ? knobelBar(allTopics()) : knobelReif(allTopics()).length ? `<div class="jumps"><button class="jump" data-jump="entdecken"><i>✦</i>Entdecken<small>↓</small></button>${knobelBar(allTopics(), true)}</div>` : `<button class="jump" data-jump="entdecken"><i>✦</i>Entdecken: ${F.entdeckenKurz}<small>↓</small></button>`}
      <div class="quick${mixOk && weak.length ? '' : mixOk || weak.length ? ' one' : ' none'}">
        ${mixOk ? `<button class="btn org" data-mix="all"><span class="ic">🎲</span>Gemischt<small>${TASKS_PER_ROUND} Aufgaben aus ${practicedTopics().length} geübten Themen</small></button>` : ''}
        ${weak.length ? `<button class="btn" data-review><span class="ic">🔁</span>Fehler-Training<small>${(weak.length === 1 ? '1 Thema' : weak.length + ' Themen')} zum Wiederholen</small></button>` : ''}
      </div>
      ${mixOk && weak.length ? '' : `<div class="later">
        ${mixOk ? '' : '<p>🎲 <b>Gemischt</b> kommt dazu, sobald du zwei Themen geübt hast.</p>'}
        ${weak.length ? '' : `<p>🔁 <b>Fehler-Training</b> ${S.total ? 'ist leer: gerade nichts offen.' : 'sammelt Aufgaben, die noch nicht geklappt haben.'}</p>`}
      </div>`}
      ${grade().lbs.map((lb) => { const n = lb.topics.length, geuebt = lb.topics.filter((t) => mastery(t.id).n > 0).length, fertig = lb.topics.every((t) => mastery(t.id).stars === 3), zu = fertig && !LBOFFEN.has(lb.id); return `
        <section class="lb">
          <div class="lbh"><span class="nr bg${lb.nr}">${lb.nr}</span><h2>${lb.title}<small class="lbp">${fertig ? (n === 1 ? 'drei Sterne ✓' : `alle ${n} Themen mit drei Sternen ✓`) : `${geuebt} von ${n} geübt`}</small></h2><button class="btn mix" data-mix="${lb.id}">Mix</button></div>
          ${zu ? `<button class="btn lbzu" data-lbopen="${lb.id}">Geschafft! Themen anzeigen ↓</button>` : `<div class="topics">${lb.topics.map((t) => topicTile(t, lb.nr)).join('')}</div>`}
        </section>`; }).join('')}
      ${discoverHtml()}
      ${akzentWahl()}
      <div class="foot"><button class="btn ghost" data-go="parents">Für Eltern: Fortschritt ansehen</button></div>`;
    bindName();
  }

  // Rückfrage, bevor eine angefangene Runde beendet wird
  function quitAsk() {
    const ov = document.createElement('div');
    ov.className = 'overlay';
    const left = R.seq.length - R.results.length;
    ov.innerHTML = `<div class="card soon" role="dialog" aria-label="Runde beenden?">
      <h2>Runde wirklich beenden?</h2>
      <p style="margin:8px 0 0;color:var(--soft);font-weight:700">Es ${left === 1 ? 'fehlt nur noch 1 Aufgabe' : `fehlen noch ${left} Aufgaben`}. Deine Antworten bis hierher bleiben gespeichert, aber fürs Tagesziel zählt nur eine ganze Runde.</p>
      <button class="btn pri wide" style="margin-top:16px" data-stay>Weiter üben</button>
      <button class="btn wide" style="margin-top:10px" data-go="home">Runde beenden</button></div>`;
    ov.addEventListener('click', (e) => { if (e.target === ov || e.target.closest('button')) ov.remove(); });
    document.body.appendChild(ov);
  }
  function soon(g) {
    const list = OTHER[g];
    const ov = document.createElement('div');
    ov.className = 'overlay';
    ov.innerHTML = `<div class="card soon">
      <h2>Klasse ${g} kommt bald</h2>
      <p style="margin:0;color:var(--soft)">${list ? 'Diese Lernbereiche sind geplant (Lehrplan Gymnasium Sachsen):' : g < 5 ? 'Für die Grundschule werten wir den sächsischen Lehrplan noch aus.' : 'Diese Klasse bauen wir später nach dem sächsischen Lehrplan.'}</p>
      ${list ? `<ul>${list.map((l) => `<li>${l}</li>`).join('')}</ul>` : ''}
      <button class="btn pri wide" style="margin-top:16px">Okay</button></div>`;
    ov.addEventListener('click', (e) => { if (e.target === ov || e.target.tagName === 'BUTTON') ov.remove(); });
    document.body.appendChild(ov);
  }

  // ---------- Übungsrunde ----------
  let R = null; // laufende Runde

  const practicedTopics = () => allTopics().filter((t) => mastery(t.id).n > 0);
  // Knobeln: schwerere, freiwillige Aufgaben (topic.knobel). Zählen nicht für die Sterne. Frei ab zwei Sternen im Thema.
  const KNOBEL_N = 5;
  const knobelReif = (topics) => topics.filter((t) => t.knobel && mastery(t.id).stars >= 2);
  const knobelBar = (topics, kurz) => { const k = knobelReif(topics); return k.length ? `<button class="jump kn" data-knobel="${k.map((t) => t.id).join(',')}"><i>🧩</i>${kurz ? 'Knobeln' : `Knobeln: harte Nüsse aus ${k.length === 1 ? 'einem Thema' : k.length + ' Themen'}`}<small>→</small></button>` : ''; };
  // „Weiter üben“: das zuletzt geübte Thema (nur auf diesem Gerät gemerkt)
  const weiterBtn = () => { const t = S.lastTopic && findTopic(S.lastTopic); return t ? `<button class="weiter" data-topic="${t.id}"><span><small>▶ Weiter üben</small><b>${t.title}</b></span>${starHtml(mastery(t.id).stars)}</button>` : ''; };
  const LBOFFEN = new Set(); // fertige Lernbereiche (alles drei Sterne), die gerade aufgeklappt sind
  function weightedPick(topics) {
    const w = topics.map((t) => { const m = mastery(t.id); return m.n === 0 ? 1 : 1.25 - m.avg; });
    let r = Math.random() * w.reduce((a, b) => a + b, 0);
    for (let i = 0; i < topics.length; i++) { r -= w[i]; if (r <= 0) return topics[i]; }
    return topics[topics.length - 1];
  }

  function start(mode, arg) {
    let pool, title;
    if (mode === 'tr') {
      if (arg === 'all') { pool = TR.topics; title = 'Training: ' + TR.titel; }
      else if (arg === 'review') { pool = TR.topics.filter(isWeak); title = 'Fehler-Training'; }
      else { const g = TR.gruppen[+arg.slice(1)]; pool = g ? g.topics : []; title = g ? g.titel : ''; }
    }
    else if (mode === 'knobel') { pool = String(arg).split(',').map(findTopic).filter((t) => t && t.knobel); title = 'Knobeln'; }
    else if (mode === 'topic') { pool = [findTopic(arg)]; title = pool[0].title; }
    else if (mode === 'review') { pool = weakTopics(); title = 'Fehler-Training'; }
    else if (arg === 'all') { pool = practicedTopics(); title = 'Gemischtes Training'; } // nur Themen, die schon einzeln geübt wurden
    else { const lb = grade().lbs.find((l) => l.id === arg); pool = lb.topics.map((t) => Object.assign({ lb }, t)); title = 'Mix: ' + lb.title; }
    if (!pool.length) return home();
    let seq = Array.from({ length: TASKS_PER_ROUND }, () => (pool.length === 1 ? pool[0] : weightedPick(pool)));
    if (mode === 'knobel') { const mix = U.shuffle(pool.slice()); seq = Array.from({ length: KNOBEL_N }, (_, i) => mix[i % mix.length]); }
    R = { mode, arg, title, seq, idx: 0, results: [], knobel: mode === 'knobel', before: mode === 'topic' ? mastery(arg).stars : null };
    nextTask();
  }

  function nextTask() {
    sayStop();
    if (R.idx >= R.seq.length) return result();
    const topic = R.seq[R.idx];
    let task;
    // Dieselbe Aufgabe soll in einer Runde nicht zweimal kommen (bis zu 6 neue Versuche)
    R.seen = R.seen || [];
    const sig = (t) => topic.id + '|' + t.prompt + '|' + (t.figure || '') + '|' + (t.pre || '') + '|' + (t.fields || []).map((f) => (f.prefix || '') + ('fixed' in f ? f.fixed : '')).join('|');
    for (let i = 0; i < 6; i++) { try { task = R.knobel ? topic.knobel() : topic.gen(); if (!R.seen.includes(sig(task))) break; } catch (e) { console.error(e); } }
    if (task) R.seen.push(sig(task));
    R.cur = { topic, task, attempt: 1, done: false, hintShown: false };
    renderTask();
  }

  function renderTask() {
    VIEW = 'task'; $app.dataset.view = VIEW;
    const { topic, task } = R.cur;
    const lb = topic.lb;
    const bar = R.seq.map((_, i) => `<i class="${i < R.results.length ? 'r' + (R.results[i] === 1 ? 1 : R.results[i] === 0.5 ? 2 : 0) : i === R.idx ? 'cur' : ''}"></i>`).join('');
    let inputs = '';
    if (task.tap) {
      // Antippen: Wörter im Satz (tokens) oder Stellen zwischen den Wörtern (gaps), eines (one) oder mehrere
      const T = task.tap;
      inputs = `<div class="tapline${T.gaps ? ' gaps' : ''}${T.eng ? ' eng' : ''}">${T.tokens.map((w, i) => (T.gaps
        ? `<span class="tw">${w}</span>${i < T.tokens.length - 1 ? `<button class="gap" data-tok="${i}" data-mark="${T.mark || ','}" aria-label="Stelle nach ${esc(cleanTok(w))}"></button>` : ''}`
        : `<button class="tok" data-tok="${i}">${w}</button>`)).join('')}</div>`;
    } else if (task.order) {
      // Wörter in die richtige Reihenfolge bringen: antippen legt ein Wort in die Satzzeile, nochmal antippen holt es zurück
      R.cur.ord = [];
      inputs = `<div class="ordziel" id="ordZiel" aria-label="Dein Satz"><span class="ordleer">Tippe die Wörter in der richtigen Reihenfolge an.</span></div>
        <div class="ordpool" id="ordPool">${task.order.words.map((w, i) => `<button class="tok" data-ord="${i}">${w}</button>`).join('')}</div>`;
    } else if (task.choices) {
      inputs = `<div class="choices ${task.choices.length === 2 && task.choices.every((c) => String(c).replace(/<[^>]+>/g, '').length <= 22) ? 'two' : ''}">${task.choices.map((c, i) => `<button class="choice" data-choice="${i}">${c}</button>`).join('')}</div>`;
    } else {
      const inp = (f, i) => 'fixed' in f
        ? `<span class="fx">${f.fixed}</span>`
        : `<input id="f${i}" data-i="${i}" ${f.type === 'factors' ? 'inputmode="text"' : f.type === 'text' ? `inputmode="text" autocapitalize="none" class="txt" style="width:${Math.max(4, Math.max(...textAnswers(f).map((a) => a.length)) + 3)}ch"` : 'inputmode="decimal"'} autocomplete="off" autocorrect="off" spellcheck="false" ${f.placeholder ? `placeholder="${f.placeholder}"` : ''} aria-label="${f.label || 'Antwort'}">`;
      const L = task.layout || 'row';
      if (L === 'frac') {
        inputs = `<div class="answer frac">${task.pre ? `<span>${task.pre}</span>` : ''}<span class="fracin">${inp(task.fields[0], 0)}<hr>${inp(task.fields[1], 1)}</span></div>`;
      } else if (L === 'coord') {
        inputs = `<div class="answer coord"><span class="sym">P(</span>${inp(task.fields[0], 0)}<span class="sym">|</span>${inp(task.fields[1], 1)}<span class="sym">)</span></div>`;
      } else if (L === 'satz') {
        // Satz mit Lücken: Text und Felder laufen wie ein Satz hintereinander
        // Ein Satzzeichen direkt nach der Lücke bleibt am Feld kleben (sonst rutscht der Punkt allein in die nächste Zeile)
        inputs = `<div class="answer satz">${task.fields.map((f, i) => { const z = f.suffix && /^[.,!?]/.test(f.suffix) ? f.suffix[0] : '', rest = f.suffix ? f.suffix.slice(z.length) : ''; return `${f.prefix ? `<span>${f.prefix}</span>` : ''}<span class="nw">${inp(f, i)}${z}</span>${rest ? `<span>${rest}</span>` : ''}`; }).join(' ')}</div>`;
      } else if (L === 'time') {
        inputs = `<div class="answer time">${inp(task.fields[0], 0)}<span class="sym">:</span>${inp(task.fields[1], 1)}<span class="sym">Uhr</span></div>`;
      } else {
        inputs = `<div class="answer">${task.fields.map((f, i) => `
          <div class="fld">${task.fields.length > 1 && f.label ? `<label for="f${i}">${f.label}</label>` : ''}
            <div class="row${f.prefix && f.prefix.replace(/<[^>]+>/g, '').length > 12 ? ' flow' : ''}">${f.prefix ? `<span>${f.prefix}</span>` : ''}${inp(f, i)}${f.suffix ? `<span>${f.suffix}</span>` : ''}${f.type === 'factors' ? `<button class="factbtn" data-dot="${i}" aria-label="Malpunkt einfügen">·</button>` : ''}</div>
          </div>`).join('')}</div>`;
      }
    }
    $app.innerHTML = `
      <div class="ptop"><button class="x" data-go="home" aria-label="Runde beenden">✕</button><div class="bar">${bar}</div></div>
      <div class="card">
        <span class="tag bg${lb.nr}">${R.knobel ? '🧩 Knobeln · ' : ''}${topic.title}</span>${topic.buch ? `<span class="tbuch">📖 Buch ${topic.buch}</span>` : ''}
        <p class="q">${task.prompt}</p>
        ${task.figure ? `<div class="fig">${task.figure}</div>` : ''}
        ${inputs}
        <div id="hint"></div>
        <div id="fb"></div>
        <div class="acts" id="acts">
          <button class="btn" id="hintB">💡 Tipp</button>
          ${EXP[exId(topic, task)] && !R.knobel ? `<button class="btn" data-explain="${exId(topic, task)}" data-when="pre">▶ Erklärung</button>` : ''}
          ${task.choices && !task.tap ? '' : '<button class="btn pri" id="checkB">Prüfen</button>'}
        </div>
      </div>`;
    const first = document.getElementById('f0') || document.querySelector('input');
    if (first && window.matchMedia('(pointer:fine)').matches) first.focus();
  }

  function showHint() {
    if (R.cur.hintShown) return;
    R.cur.hintShown = true;
    document.getElementById('hint').innerHTML = `<div class="hint">💡 ${R.cur.task.hint}</div>`;
    const hb = document.getElementById('hintB'); if (hb) hb.remove(); // der Tipp steht jetzt da, der Knopf wird nicht mehr gebraucht
  }

  function check(choiceIdx) {
    const c = R.cur, t = c.task;
    if (c.done) return;
    let ok, note = '', wrongFields = [];
    if (t.tap) {
      const sel = [...document.querySelectorAll('[data-tok].sel')].map((b) => +b.dataset.tok).sort((a, b) => a - b);
      if (!sel.length) { const card = document.querySelector('.card'); card.classList.remove('shake'); void card.offsetWidth; card.classList.add('shake'); return; }
      const want = t.tap.correct.slice().sort((a, b) => a - b);
      ok = sel.length === want.length && sel.every((v, i) => v === want[i]);
      if (!ok && c.attempt === 1 && want.length > 1) { const hit = sel.filter((v) => want.includes(v)).length; note = sel.length !== want.length ? `Gesucht ${want.length === 1 ? 'ist 1 Stelle' : `sind ${want.length} Stellen`}.` : `${hit} von ${want.length} ${hit === 1 ? 'stimmt' : 'stimmen'} schon.`; }
    } else if (t.order) {
      const O = t.order, ord = c.ord || [];
      if (ord.length < O.words.length) { const card = document.querySelector('.card'); card.classList.remove('shake'); void card.offsetWidth; card.classList.add('shake'); return; }
      const got = ord.map((i) => O.words[i]).join(' '), f = { ci: true };
      ok = [].concat(O.answer).some((a) => normText(a, f) === normText(got, f));
    } else if (t.choices) {
      ok = choiceIdx === t.correct;
    } else {
      const els = t.fields.map((f, i) => document.getElementById('f' + i));
      const raw = els.map((el) => (el ? el.value : null));
      if (raw.some((v, i) => v !== null && v.trim() === '')) {
        const card = document.querySelector('.card');
        card.classList.remove('shake'); void card.offsetWidth; card.classList.add('shake');
        const empty = els.find((el) => el && !el.value.trim()); if (empty) empty.focus();
        return;
      }
      const vals = t.fields.map((f, i) => ('fixed' in f ? f.fixed : f.type === 'factors' ? parseFactors(raw[i]) : f.type === 'text' ? raw[i] : parseNum(raw[i])));
      if (t.check) {
        const r = t.check(vals); ok = r.ok; note = r.note || '';
        if (!ok) wrongFields = els.map((_, i) => i);
      } else {
        t.fields.forEach((f, i) => {
          if ('fixed' in f) return;
          const good = f.type === 'factors'
            ? vals[i].length === f.answer.length && vals[i].every((v, k) => v === f.answer[k])
            : f.type === 'text' ? textOk(vals[i], f)
            : near(vals[i], f.answer);
          // richtiges Wort, aber Groß- und Kleinschreibung stimmt nicht: eigener Hinweis
          if (!good && f.type === 'text' && !f.ci && textOk(vals[i], Object.assign({}, f, { ci: true }))) note = 'Achte auf die Groß- und Kleinschreibung.';
          if (!good) wrongFields.push(i);
        });
        ok = wrongFields.length === 0;
        if (!ok && t.fields.some((f, i) => !('fixed' in f) && f.type !== 'factors' && f.type !== 'text' && isNaN(vals[i]))) note = 'Gib bitte nur eine Zahl ein (Komma ist erlaubt).';
      }
      els.forEach((el, i) => {
        if (!el) return;
        el.classList.remove('w', 'g');
        if (wrongFields.includes(i)) el.classList.add('w');
        else if (ok) el.classList.add('g');
      });
    }

    const fb = document.getElementById('fb');
    const fewChoices = t.choices && t.choices.length <= 3;
    if (ok) {
      const score = c.attempt === 1 ? 1 : 0.5;
      finish(score);
      if (t.choices) markChoices(choiceIdx);
      if (t.tap) markTap();
      if (t.order) markOrd(true);
      const msg = c.attempt === 1 ? U.pick(['Richtig! 🎉', 'Stark! 💪', 'Genau so! ✨', 'Volltreffer! 🎯', 'Super gemacht! 🌟']) : 'Jetzt passt’s! 👍';
      fb.innerHTML = `<div class="fb ok"><h3>${msg}</h3>${note ? `<div>${note}</div>` : ''}<div class="sol"><b>So geht’s:</b><br>${t.solution}</div>${t.ex && t.ex.nach !== false && EXP[exId(c.topic, t)] ? `<button class="btn exinline" data-explain="${exId(c.topic, t)}" data-when="post">▶ Lösung als Animation</button>` : ''}</div>`;
    } else if (c.attempt === 1 && !fewChoices) {
      c.attempt = 2;
      if (t.tap) { /* Auswahl bleibt stehen und kann geändert werden */ }
      else if (t.choices) { const b = document.querySelector(`[data-choice="${choiceIdx}"]`); b.classList.add('w'); b.disabled = true; }
      fb.innerHTML = `<div class="fb mid"><h3>Noch nicht ganz 🤔</h3>${note ? note + '<br>' : ''}Schau dir den Tipp an und probier’s nochmal.</div>`;
      showHint();
      const firstWrong = document.getElementById('f' + (wrongFields[0] ?? 0));
      if (firstWrong) { firstWrong.focus(); firstWrong.select(); }
      return;
    } else {
      finish(0);
      if (t.choices) markChoices(choiceIdx);
      if (t.tap) markTap();
      if (t.order) markOrd(false);
      fb.innerHTML = `<div class="fb no"><h3>Leider falsch</h3>${note ? note + '<br>' : ''}Richtig ist: <b>${answerText(t)}</b><div class="sol"><b>So geht’s:</b><br>${t.solution}</div>${EXP[exId(c.topic, t)] && !R.knobel && !(t.ex && t.ex.nach === false) ? `<button class="btn exinline" data-explain="${exId(c.topic, t)}" data-when="post">▶ ${t.ex ? 'Lösung als Animation' : 'Als Animation erklärt'}</button>` : ''}</div>`;
    }
    document.getElementById('acts').innerHTML = `<button class="btn pri wide" id="nextB">${R.idx + 1 < R.seq.length ? 'Weiter →' : 'Fertig →'}</button>`;
    document.getElementById('nextB').focus();
    fb.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  function markOrd(ok) {
    document.querySelectorAll('[data-ord]').forEach((b) => { b.disabled = true; b.classList.add(ok ? 'g' : 'w'); });
  }
  function ordTok(b) {
    if (!R || !R.cur || R.cur.done || !R.cur.task.order) return;
    const i = +b.dataset.ord, ord = R.cur.ord, k = ord.indexOf(i);
    const ziel = document.getElementById('ordZiel'), pool = document.getElementById('ordPool');
    if (k >= 0) { ord.splice(k, 1); pool.appendChild(b); } else { ord.push(i); ziel.appendChild(b); }
    const leer = ziel.querySelector('.ordleer'); if (leer) leer.style.display = ord.length ? 'none' : '';
  }
  function markTap() {
    const want = R.cur.task.tap.correct;
    document.querySelectorAll('[data-tok]').forEach((b) => {
      const i = +b.dataset.tok, sel = b.classList.contains('sel');
      b.disabled = true;
      if (want.includes(i)) b.classList.add('g'); else if (sel) b.classList.add('w');
    });
  }
  function tapTok(b) {
    if (!R || !R.cur || R.cur.done || !R.cur.task.tap) return;
    if (R.cur.task.tap.one) document.querySelectorAll('[data-tok].sel').forEach((x) => { if (x !== b) x.classList.remove('sel'); });
    b.classList.toggle('sel');
  }
  function markChoices(sel) {
    document.querySelectorAll('[data-choice]').forEach((b) => {
      const i = +b.dataset.choice;
      b.disabled = true;
      if (i === R.cur.task.correct) b.classList.add('g');
      else if (i === sel) b.classList.add('w');
    });
  }

  function finish(score) {
    const c = R.cur;
    c.done = true;
    document.querySelectorAll('.answer input').forEach((el) => (el.readOnly = true));
    R.results.push(score);
    const id = c.topic.id;
    if (R.knobel) { // Knobeln zählt nicht für die Sterne, wird aber gezählt (n = versucht, ok = geknackt)
      S.knobel = S.knobel || {};
      const k = S.knobel[id] || (S.knobel[id] = { n: 0, ok: 0 });
      k.n++; if (score > 0) k.ok++;
    } else {
      const st = S.stats[id] || (S.stats[id] = { n: 0, hist: [], last: '' });
      st.n++; st.hist.push(score); if (st.hist.length > 10) st.hist.shift(); st.last = today();
      S.lastTopic = id;
    }
    if (!S.days.includes(today())) S.days.push(today());
    if (S.days.length > 400) S.days = S.days.slice(-400);
    S.total = (S.total || 0) + 1;
    save();
  }

  function result() {
    VIEW = 'result'; $app.dataset.view = VIEW;
    const first = R.results.filter((r) => r === 1).length;
    const solved = R.results.filter((r) => r > 0).length;
    const n = R.results.length;
    const ratio = R.results.reduce((a, b) => a + b, 0) / n;
    // Lob-Szene: der Avatar des Kindes und der Fach-Dachs freuen sich gemeinsam (4 Stufen)
    const stufe = R.knobel ? (ratio >= 0.6 ? 3 : ratio >= 0.2 ? 2 : 1) : ratio >= 0.9 ? 3 : ratio >= 0.7 ? 2 : ratio >= 0.5 ? 1 : 0;
    const emoji = ['🌱', '💪', '🌟', '🏆'][stufe];
    const du = S.name ? `, ${esc(S.name)}` : '';
    const head = R.knobel ? ['', 'Harte Nüsse! Die knackst du noch.', 'Gut getüftelt!', `Stark geknobelt${du}!`][stufe]
      : [`Das üben wir nochmal${du}.`, 'Gut dabei, weiter so!', `Richtig gut${du}!`, `Mega stark${du}!`][stufe];
    const ich = AVA && AVA.get() ? AVA.html(AVA.get(), 92) : '';
    const firstToday = roundsToday() === 0;
    S.rounds = Object.assign({}, S.rounds || {}, { [today()]: roundsToday() + 1 });
    const keep = Object.keys(S.rounds).sort().slice(-60);
    S.rounds = Object.fromEntries(keep.map((d) => [d, S.rounds[d]]));
    save();
    let starBlock = firstToday ? '<p class="goaldone">🎯 Tagesziel für heute geschafft!</p>' : '';
    if (R.mode === 'topic') {
      const now = mastery(R.arg).stars;
      const m = mastery(R.arg), ziel = [50, 75, 90][now];
      const sternTipp = now >= 3 ? 'Alle drei Sterne: Dieses Thema sitzt!' : `Nächster Stern ab <b>${ziel} %</b> richtig in deinen letzten 10 Aufgaben. Du bist bei <b>${Math.round(m.avg * 100)} %</b>.`;
      starBlock += `${starHtml(now)}${now > R.before ? '<p style="color:#0b7a50">Neuer Stern! ⭐</p>' : ''}<p class="sternhint">${sternTipp}</p>`;
    }
    if (R.knobel) starBlock += '<p class="sternhint">🧩 Knobel-Aufgaben sind zum Tüfteln da. Sie zählen nicht für die Sterne.</p>';
    const kn = !R.knobel && ratio >= 0.75 ? [...new Set(R.seq.filter((t) => t.knobel).map((t) => t.id))] : [];
    $app.innerHTML = header() + `
      <div class="card res">
        <div class="fest s${stufe}${ich ? '' : ' solo'}">
          <h1 class="blase">${head}</h1>
          <div class="paar">${ich ? `<span class="ich">${ich}</span><span class="mitte">${emoji}</span>` : ''}<span class="dax"><img src="${F.dachs}" alt="${F.name}"></span>${ich ? '' : `<span class="mitte">${emoji}</span>`}</div>
        </div>
        <p>${first} von ${n} beim ersten Versuch richtig${solved > first ? `, ${solved - first} im zweiten` : ''}</p>
        <div class="dots">${R.results.map((r) => `<i class="r${r === 1 ? 1 : r === 0.5 ? 2 : 0}"></i>`).join('')}</div>
        ${starBlock}
        <div class="btns">
          ${kn.length ? `<button class="btn wide knb" data-knobel="${kn.join(',')}">🧩 Jetzt knobeln: ${KNOBEL_N} harte Nüsse</button>` : ''}
          <button class="btn org wide" data-again>${R.knobel ? 'Nochmal knobeln' : 'Nochmal üben'}</button>
          <button class="btn wide" data-go="home">Zur Übersicht</button>
        </div>
      </div>`;
    if (ratio >= (R.knobel ? 0.6 : 0.85)) confetti();
  }

  function confetti() {
    const c = document.createElement('div');
    c.className = 'confetti';
    const cols = ['#ff6b3d', '#3d7bff', '#14a06c', '#8b5cf6', '#e9a800'];
    c.innerHTML = Array.from({ length: 60 }, () => `<i style="left:${Math.random() * 100}%;background:${U.pick(cols)};animation-delay:${Math.random() * 0.6}s;animation-duration:${1.4 + Math.random()}s"></i>`).join('');
    document.body.appendChild(c);
    setTimeout(() => c.remove(), 3200);
  }


  // ---------- Erklär-Animationen ----------
  // Eigene Uhr: läuft nur, wenn nicht pausiert, und im Langsam-Modus mit halber Geschwindigkeit.
  const ABORT = { abort: true };
  let EXAPI = null;
  function openExplainer(id, when) {
    const def = EXP[id];
    let ctx = {};
    if (when && R && R.cur && R.cur.task.ex) ctx = Object.assign({}, R.cur.task.ex, when === 'post' ? { post: true } : { pre: true });
    if (!def) return;
    closeExplainer();
    const ov = document.createElement('div');
    ov.className = 'overlay exov';
    const title = def.titleFor ? def.titleFor(ctx) : def.title; // manche Erklärungen heißen je nach Aufgabe anders
    ov.innerHTML = `<div class="card exsheet${def.dark ? ' dark' : ''}" role="dialog" aria-label="${title}">
      <div class="exhead"><h2>${title}</h2><button class="x" data-exclose aria-label="Schließen">✕</button></div>
      <div class="exsub"></div>
      <div class="exstage" title="Antippen zum Anhalten"><svg viewBox="${def.viewBox}" xmlns="http://www.w3.org/2000/svg"></svg>${def.discover ? `<div class="exintro"><img src="${F.dachsStaunt || F.dachs}" alt=""></div>` : ''}<div class="pausebadge"><span>❚❚ Pause<small>Antippen zum Weiterspielen</small></span></div></div>
      <div class="excap" aria-live="polite"></div>
      <div class="exctl"></div>
      <div class="exbtns">
        <button class="btn org" id="exPlay">▶ Abspielen</button>
        <button class="btn exsec" id="exRestart" aria-label="Von vorn" title="Von vorn">↺</button>
        <button class="btn exsec" id="exSpeed" aria-pressed="false" title="Langsamer abspielen">🐢</button>
      </div>
    </div>`;
    ov.addEventListener('click', (e) => { if (e.target === ov) closeExplainer(); });
    document.body.appendChild(ov);
    document.body.classList.add('noscroll');
    const svg = ov.querySelector('svg'), cap = ov.querySelector('.excap'), ctl = ov.querySelector('.exctl');
    const stage = ov.querySelector('.exstage'), playB = ov.querySelector('#exPlay'), restartB = ov.querySelector('#exRestart'), speedB = ov.querySelector('#exSpeed');

    const clock = { v: 0, last: 0, paused: false, speed: S.exSlow ? 0.5 : 1, subs: new Set(), on: true };
    const tick = (now) => {
      if (!clock.on) return;
      if (clock.last) { const dt = Math.min(250, now - clock.last); if (!clock.paused) clock.v += dt * clock.speed; }
      clock.last = now;
      clock.subs.forEach((f) => f());
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
    const until = (ms, g, each) => new Promise((res, rej) => {
      const start = clock.v;
      const f = () => {
        if (g !== api.gen) { clock.subs.delete(f); return rej(ABORT); }
        const t = ms <= 0 ? 1 : Math.min(1, (clock.v - start) / ms);
        if (each) each(t);
        if (t >= 1) { clock.subs.delete(f); res(); }
      };
      clock.subs.add(f);
    });

    const api = {
      svg, gen: 0, playing: false, played: false, clock,
      clear() { svg.innerHTML = ''; },
      sub(h) { const e = ov.querySelector('.exsub'); e.innerHTML = h || ''; e.style.display = h ? '' : 'none'; },
      say(h) { cap.innerHTML = h; cap.classList.remove('in'); void cap.offsetWidth; cap.classList.add('in'); },
      ui() {
        const paused = api.playing && clock.paused;
        playB.textContent = api.playing ? (paused ? '▶ Weiter' : '❚❚ Pause') : api.played ? '▶ Nochmal abspielen' : '▶ Abspielen';
        playB.classList.toggle('pri', api.playing && !paused);
        playB.classList.toggle('org', !(api.playing && !paused));
        restartB.style.display = api.playing ? '' : 'none';
        stage.classList.toggle('paused', paused);
        stage.classList.toggle('live', api.playing);
        speedB.classList.toggle('on', clock.speed < 1);
        speedB.setAttribute('aria-pressed', clock.speed < 1);
        speedB.textContent = clock.speed < 1 ? '🐢 Langsam' : '🐢';
      },
      stop() { api.gen++; api.playing = false; clock.paused = false; api.ui(); },
      pause() { if (api.playing) { clock.paused = true; api.ui(); } },
      resume() { clock.paused = false; api.ui(); },
      wait(ms) { return until(ms, api.gen); },
      tw(ms, fn, ease) {
        const e = ease || ((t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2));
        return until(ms, api.gen, (t) => fn(e(t)));
      },
      run(fn) {
        const g = ++api.gen;
        api.playing = true; clock.paused = false; api.ui();
        Promise.resolve().then(fn).catch((e) => { if (e !== ABORT) console.error(e); }).finally(() => {
          if (g === api.gen) { api.playing = false; api.played = true; clock.paused = false; api.ui(); }
        });
      },
      replay() { api.stop(); inst.reset(); api.played = true; api.run(() => inst.play()); },
      slider({ label, min, max, value, onInput }) {
        const w = document.createElement('label');
        w.className = 'exslider';
        w.innerHTML = `<span>${label}</span><input type="range" min="${min}" max="${max}" step="1" value="${value}">`;
        const inp = w.querySelector('input');
        inp.addEventListener('input', () => { api.stop(); onInput(+inp.value); });
        ctl.appendChild(w);
        return inp;
      },
      chips(list) {
        const w = document.createElement('div');
        w.className = 'exchips';
        list.forEach((c) => { const b = document.createElement('button'); b.className = 'exchip'; b.innerHTML = c.label; b.addEventListener('click', (e) => { e.stopPropagation(); c.onClick(); }); w.appendChild(b); });
        ctl.appendChild(w);
        return w;
      },
    };
    EXAPI = api;
    api.discover = !!def.discover;
    if (def.discover) { S.seen = S.seen || {}; S.seen[id] = true; save(); }
    api.sub('');
    const inst = def.create(api, ctx);
    const toggle = () => { if (!api.playing) api.replay(); else if (clock.paused) api.resume(); else api.pause(); };
    playB.addEventListener('click', (e) => { e.stopPropagation(); toggle(); });
    stage.addEventListener('click', (e) => { e.stopPropagation(); if (api.playing) toggle(); });
    restartB.addEventListener('click', (e) => { e.stopPropagation(); api.replay(); });
    speedB.addEventListener('click', (e) => {
      e.stopPropagation();
      clock.speed = clock.speed < 1 ? 1 : 0.5;
      S.exSlow = clock.speed < 1; save();
      api.ui();
    });
    inst.reset();
    api.say('');
    api.ui();
    setTimeout(() => { if (EXAPI === api) { api.played = false; api.replay(); } }, 350);
  }
  function closeExplainer() {
    const ov = document.querySelector('.exov');
    const wasDiscover = EXAPI && EXAPI.discover;
    if (EXAPI) { EXAPI.stop(); EXAPI.clock.on = false; EXAPI = null; }
    if (ov) ov.remove();
    document.body.classList.remove('noscroll');
    if (wasDiscover && !R) { const y = window.scrollY; home(); window.scrollTo(0, y); }
  }

  // ---------- Elternansicht ----------
  let PTAB = 'fort'; // Reiter im Elternbereich: 'fort' (Fortschritt) oder 'konto' (Geräte & Konto)
  function parents(confirmReset) {
    VIEW = 'parents'; $app.dataset.view = VIEW;
    if (confirmReset) PTAB = 'konto';
    const topics = allTopics();
    const practiced = topics.filter((t) => mastery(t.id).n > 0);
    const avg = practiced.length ? practiced.reduce((s, t) => s + mastery(t.id).avg, 0) / practiced.length : 0;
    $app.innerHTML = `
      <div class="ph"><button class="x" data-go="home" aria-label="Zurück">←</button><h1>Für Eltern</h1></div>
      <div class="ptabs" role="tablist">
        <button class="ptab${PTAB === 'fort' ? ' on' : ''}" data-ptab="fort" role="tab">Fortschritt</button>
        <button class="ptab${PTAB === 'konto' ? ' on' : ''}" data-ptab="konto" role="tab">Geräte &amp; Konto</button>
      </div>
      <div class="pview${PTAB === 'fort' ? '' : ' aus'}">
      <div class="kpis">
        <div class="card kpi"><b>${S.total || 0}</b><span>Aufgaben bearbeitet</span></div>
        <div class="card kpi"><b>${S.days.length}</b><span>Übungstage</span></div>
        <div class="card kpi"><b>${practiced.length ? Math.round(avg * 100) + ' %' : '–'}</b><span>Trefferquote*</span></div>
      </div>
      <div class="card tablecard">
        ${grade().lbs.map((lb) => `
          <h3 class="lbt"><span class="tag bg${lb.nr}" style="margin:0 6px 0 0">LB ${lb.nr}</span>${lb.title}<small class="lbsum">${lb.topics.filter((t) => mastery(t.id).n > 0).length} von ${lb.topics.length} Themen geübt · ★ ${lb.topics.reduce((n, t) => n + mastery(t.id).stars, 0)} von ${lb.topics.length * 3}</small></h3>
          <table><thead><tr><th>Thema</th><th class="n">Aufg.</th><th>Quote*</th><th>Sterne</th></tr></thead><tbody>
          ${lb.topics.map((t) => { const m = mastery(t.id); const st = S.stats[t.id];
            const col = m.avg >= 0.75 ? 'var(--ok)' : m.avg >= 0.5 ? 'var(--c5)' : 'var(--bad)';
            return `<tr><td>${t.title}${st && st.last ? `<small class="when">zuletzt ${st.last.slice(8, 10)}.${st.last.slice(5, 7)}.</small>` : ''}</td><td class="n">${m.n || '–'}</td>
              <td>${m.n ? `<div class="qbar"><i style="width:${Math.round(m.avg * 100)}%;background:${col}"></i></div>` : '<span style="color:var(--soft)">–</span>'}</td>
              <td>${starHtml(m.stars)}</td></tr>`; }).join('')}
          </tbody></table>`).join('')}
      </div>
      <p class="note">* Quote = Durchschnitt der letzten 10 Aufgaben je Thema (erster Versuch richtig = 100 %, zweiter Versuch = 50 %).<br>${SYS.enabled && SYS.profileId ? 'Der Fortschritt wird mit allen Geräten dieses Profils abgeglichen.' : 'Der Fortschritt wird nur auf diesem Gerät gespeichert.'}</p>
      </div>
      <div class="pview${PTAB === 'konto' ? '' : ' aus'}">
      <div id="synccard" class="${SYS.enabled && SYS.profileId ? 'syncbottom' : ''}"></div>
      <div style="text-align:center;margin-top:10px">${SYS.loggedIn && SY.hasPin && !SY.unlocked ? '' : confirmReset
        ? `<p style="font-weight:800;margin-bottom:4px">Wirklich alles zurücksetzen?</p><p style="margin:0 0 10px;color:var(--soft);font-weight:700">Alle Sterne und der ganze Fortschritt sind dann weg. Zur Sicherheit: Tippe das Wort <b>LÖSCHEN</b> ein.</p><p style="margin:0 0 12px"><input id="resetWord" autocomplete="off" autocapitalize="characters" spellcheck="false" aria-label="Das Wort LÖSCHEN eintippen" style="font:800 20px Nunito,system-ui,sans-serif;width:180px;text-align:center;border:2px solid var(--ink);border-radius:12px;padding:8px 10px"></p><button class="btn" data-go="parents">Abbrechen</button> <button class="btn" style="background:var(--bad);color:#fff" data-reset="yes">Ja, zurücksetzen</button>`
        : `<button class="btn ghost" data-reset="ask">Fortschritt zurücksetzen</button>`}</div>
      </div>`;
    renderSyncCard();
  }

  // ---------- Geräte & Synchronisation ----------
  const SY = { msg: '', err: '', profiles: null, switching: false, hasPin: null, unlocked: false, busy: false };
  const syncIcon = () => (SYS.busy ? '☁︎ …' : SYS.error ? '☁︎ !' : !SYS.online ? '☁︎ ⨯' : '☁︎ ✓');
  function syncTitle() {
    if (SYS.error) return 'Synchronisation: ' + SYS.error;
    if (!SYS.online) return 'Offline – wird später abgeglichen';
    return SYS.lastSync ? 'Synchronisiert um ' + new Date(SYS.lastSync).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' }) : 'Synchronisation aktiv';
  }
  function syncLine() {
    if (SYS.busy) return 'Gleiche ab …';
    if (SYS.error) return '⚠️ ' + esc(SYS.error);
    if (!SYS.online) return 'Offline – der Abgleich passiert automatisch, sobald wieder Internet da ist.';
    return SYS.lastSync ? 'Zuletzt abgeglichen: ' + new Date(SYS.lastSync).toLocaleString('de-DE', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' }) + ' Uhr' : 'Noch nicht abgeglichen.';
  }
  function renderSyncCard() {
    const box = document.getElementById('synccard');
    if (!box) return;
    const note = (SY.err ? `<p class="syncerr">${esc(SY.err)}</p>` : '') + (SY.msg ? `<p class="syncmsg">${SY.msg}</p>` : '');
    let body;
    if (!SYS.enabled) {
      body = `<p>${F.name} speichert den Lernstand gerade nur auf diesem Gerät. Für den Abgleich zwischen Handy und Computer wird LernDax unter seiner eigenen Adresse eingerichtet.</p>`;
    } else if (!SYS.loggedIn) {
      const CF = window.MATHELIX_CONFIG || {};
      body = `<p>Melde dich mit deinem <b>${esc(CF.accountName || 'Elternkonto')}</b> an. Dann lernt dein Kind auf jedem Gerät mit demselben Stand weiter, und du siehst den Fortschritt auch auf deinem Handy. Die Anmeldung gilt für alle LernDax-Fächer.</p>
        ${note}
        <form class="syncform" data-syncform="login">
          <input type="email" name="email" placeholder="E-Mail (Eltern)" autocomplete="username" required value="${esc(SY.lastEmail || '')}">
          <input type="password" name="pw" placeholder="Passwort" autocomplete="current-password" required minlength="6">
          <div class="syncbtns"><button class="btn pri" type="submit">Anmelden</button>${CF.allowSignup === false ? '' : '<button class="btn" type="submit" data-signup="1">Neues Konto anlegen</button>'}</div>
        </form>
        <p class="syncsmall">Für dein Kind wird keine E-Mail-Adresse gebraucht, nur ein Vorname oder Spitzname.</p>`;
    } else if (SY.hasPin === null) {
      body = `<p>Lade …</p>`;
      SYNC.getPinHash().then((h) => { SY.hasPin = !!h; renderSyncCard(); if (h) parents(false); }).catch(() => { SY.hasPin = false; renderSyncCard(); });
    } else if (SY.hasPin && !SY.unlocked) {
      body = `<p>Angemeldet als <b>${esc(SYS.email)}</b>${SYS.profileName ? ` · Dieses Gerät lernt als <b>${esc(SYS.profileName)}</b>` : ''}.</p>
        <p class="syncline" id="syncline">${syncLine()}</p>
        ${note}
        <form class="syncform row" data-syncform="unlock"><input name="pin" inputmode="numeric" maxlength="6" placeholder="Eltern-PIN" autocomplete="off" required><button class="btn" type="submit">Entsperren</button></form>
        <p class="syncsmall">Zum Wechseln des Profils oder Abmelden brauchst du die Eltern-PIN.</p>`;
    } else if (!SYS.profileId || SY.switching) {
      if (SY.profiles === null) { SYNC.listProfiles().then((ps) => { SY.profiles = ps; renderSyncCard(); }).catch((e) => { SY.err = e.message; SY.profiles = []; renderSyncCard(); }); }
      body = `<p>Angemeldet als <b>${esc(SYS.email)}</b>. <b>Wer lernt auf diesem Gerät?</b></p>
        ${note}
        <div class="profiles">${(SY.profiles || []).map((p) => `<button class="btn profbtn" data-sync="bind" data-id="${esc(p.id)}" data-name="${esc(p.name)}" data-avatar="${esc(p.avatar || '')}">${AVA && p.avatar ? AVA.html(p.avatar, 28) : '👤'} ${esc(p.name)}</button>`).join('') || (SY.profiles ? '<p class="syncsmall">Noch kein Kind-Profil angelegt.</p>' : '<p>Lade …</p>')}</div>
        <form class="syncform row" data-syncform="newprofile"><input name="name" maxlength="30" placeholder="Vorname oder Spitzname" value="${esc(S.name || '')}" required><button class="btn" type="submit">+ Profil anlegen</button></form>
        <div class="syncbtns">${SY.switching ? '<button class="btn ghost" data-sync="cancel">Abbrechen</button>' : ''}<button class="btn ghost" data-sync="logout">Abmelden</button></div>`;
    } else {
      body = `<p>Angemeldet als <b>${esc(SYS.email)}</b>.<br>Dieses Gerät lernt als <b>${esc(SYS.profileName)}</b>.</p>
        <p class="syncline" id="syncline">${syncLine()}</p>
        ${note}
        <div class="syncbtns"><button class="btn" data-sync="now">Jetzt abgleichen</button><button class="btn ghost" data-sync="switch">Profil wechseln</button><button class="btn ghost" data-sync="logout">Abmelden</button></div>
        <details class="pindet"><summary>${SY.hasPin ? 'Eltern-PIN ändern' : 'Eltern-PIN festlegen (empfohlen)'}</summary>
          <p class="syncsmall">Mit der PIN kann dein Kind sich nicht selbst abmelden, das Profil wechseln oder den Fortschritt löschen.</p>
          <form class="syncform row" data-syncform="setpin"><input name="pin" inputmode="numeric" pattern="[0-9]{4,6}" maxlength="6" placeholder="4–6 Ziffern" autocomplete="off" required><button class="btn" type="submit">Speichern</button></form>
        </details>`;
    }
    box.innerHTML = `<div class="card synccard"><h3>☁︎ Geräte &amp; Synchronisation</h3>${body}</div>`;
  }
  function refreshSyncBits() {
    const line = document.getElementById('syncline'); if (line) line.innerHTML = syncLine();
    const pill = document.getElementById('syncpill'); if (pill) { pill.textContent = syncIcon(); pill.title = syncTitle(); }
  }
  async function syncAction(act, b) {
    SY.err = ''; SY.msg = '';
    try {
      if (act === 'bind') {
        S.name = b.dataset.name; saveLocal();
        SY.switching = false;
        await SYNC.bindProfile(b.dataset.id, b.dataset.name, b.dataset.avatar);
        SY.msg = `Fertig! Dieses Gerät lernt jetzt als <b>${esc(b.dataset.name)}</b>. Der bisherige Fortschritt auf diesem Gerät wurde übernommen.`;
        parents(false);
      } else if (act === 'now') { await SYNC.syncNow(); }
      else if (act === 'switch') { SY.switching = true; SY.profiles = null; }
      else if (act === 'cancel') { SY.switching = false; }
      else if (act === 'logout') { await SYNC.signOut(); SY.hasPin = null; SY.unlocked = false; SY.profiles = null; SY.switching = false; SY.msg = 'Abgemeldet. Der Fortschritt bleibt auf diesem Gerät gespeichert.'; parents(false); return; }
    } catch (e) { SY.err = e.message || String(e); }
    renderSyncCard();
  }
  document.addEventListener('submit', async (e) => {
    const f = e.target.closest('form[data-syncform]');
    if (!f) return;
    e.preventDefault();
    const kind = f.dataset.syncform, v = (n) => (f.elements[n] ? f.elements[n].value.trim() : '');
    const btns = f.querySelectorAll('button'); btns.forEach((x) => (x.disabled = true));
    SY.err = ''; SY.msg = '';
    try {
      if (kind === 'login') {
        SY.lastEmail = v('email');
        if (e.submitter && e.submitter.dataset.signup) {
          const needsConfirm = await SYNC.signUp(v('email'), f.elements.pw.value);
          SY.msg = needsConfirm ? '📬 Konto angelegt! Bitte klicke auf den Bestätigungslink in deiner E-Mail und melde dich dann hier an.' : 'Konto angelegt.';
        } else { await SYNC.signIn(v('email'), f.elements.pw.value); SY.hasPin = null; SY.profiles = null; }
      } else if (kind === 'unlock') {
        if (await SYNC.checkPin(v('pin'))) { SY.unlocked = true; parents(false); return; }
        SY.err = 'Die PIN stimmt nicht.';
      } else if (kind === 'newprofile') {
        const p = await SYNC.createProfile(v('name'), 5);
        SY.profiles = null;
        S.name = p.name; saveLocal();
        SY.switching = false;
        await SYNC.bindProfile(p.id, p.name, p.avatar);
        SY.msg = `Profil <b>${esc(p.name)}</b> angelegt. Dieses Gerät lernt jetzt als ${esc(p.name)}.`;
        parents(false); return;
      } else if (kind === 'setpin') {
        if (!/^\d{4,6}$/.test(v('pin'))) throw new Error('Bitte 4 bis 6 Ziffern eingeben.');
        await SYNC.setPin(v('pin')); SY.hasPin = true; SY.unlocked = true;
        SY.msg = '🔒 Eltern-PIN gespeichert.';
      }
    } catch (err) { SY.err = err.message || String(err); }
    renderSyncCard();
  });

  // ---------- Anhören ----------
  // Ein Knopf mit data-say="<name>" spielt die Aufnahme <name> (fertige Aufnahmen des Fachs, keine Gerätestimme).
  // F.audio ist ein Ordner oder eine Liste zur Auswahl: [{ id:'us', name:'amerikanisch', pfad:'audio/k5/' }, …].
  // Die Wahl gilt für dieses Gerät (localStorage), der erste Eintrag ist die Voreinstellung.
  const AKZENT_KEY = 'lerndax.' + F.id + '.akzent';
  const AKZENTE = Array.isArray(F.audio) ? F.audio : null;
  function akzent() {
    if (!AKZENTE) return null;
    let id = null; try { id = localStorage.getItem(AKZENT_KEY); } catch (e) {}
    return AKZENTE.find((a) => a.id === id) || AKZENTE[0];
  }
  const audioPfad = () => (AKZENTE ? akzent().pfad : F.audio);
  function akzentWahl() {
    if (!AKZENTE || AKZENTE.length < 2) return '';
    const jetzt = akzent().id;
    return `<div class="akzent" role="group" aria-label="Aussprache"><span>🔊 Aussprache</span>${AKZENTE.map((a) =>
      `<button type="button" class="${a.id === jetzt ? 'on' : ''}" data-akzent="${a.id}" aria-pressed="${a.id === jetzt}">${a.name}</button>`).join('')}</div>`;
  }
  // Die Aufnahmen liegen in Sammeldateien (wenige große statt hunderter kleiner Dateien):
  //   <pfad>index.json   { clips: { name: [paket, start, laenge] } }
  //   <pfad><paket>.bin  alle MP3 eines Themas hintereinander
  // Geladen wird mit XMLHttpRequest (geht auch im Test ohne Server), abgespielt als data:-Adresse.
  const LAGER = {};
  const lager = (pfad) => LAGER[pfad] || (LAGER[pfad] = { index: null, clips: null, laden: {}, bin: {} });
  function hole(url, art) {
    return new Promise((ok) => {
      try {
        const x = new XMLHttpRequest();
        x.open('GET', url); x.responseType = art;
        x.onload = () => ok((x.status === 200 || x.status === 0) && x.response ? x.response : null);
        x.onerror = () => ok(null);
        x.send();
      } catch (e) { ok(null); }
    });
  }
  function ladeIndex(pfad) {
    const L = lager(pfad);
    return L.index || (L.index = hole(pfad + 'index.json', 'json').then((j) => { if (!j || !j.clips) { L.index = null; return null; } return (L.clips = j.clips); }));
  }
  function ladePaket(pfad, paket) {
    const L = lager(pfad);
    return L.laden[paket] || (L.laden[paket] = hole(pfad + paket + '.bin', 'arraybuffer').then((b) => { if (!b) { delete L.laden[paket]; return null; } return (L.bin[paket] = b); }));
  }
  // Adresse einer Aufnahme, wenn ihr Paket schon geladen ist (sonst null)
  function clipUrl(pfad, name) {
    const L = lager(pfad), c = L.clips && L.clips[name];
    if (!c || !L.bin[c[0]]) return null;
    const u = new Uint8Array(L.bin[c[0]], c[1], c[2]);
    let t = '';
    for (let i = 0; i < u.length; i += 8192) t += String.fromCharCode.apply(null, u.subarray(i, i + 8192));
    return 'data:audio/mpeg;base64,' + btoa(t);
  }
  async function clipHolen(pfad, name) {
    const clips = await ladeIndex(pfad), c = clips && clips[name];
    if (!c) return null;
    await ladePaket(pfad, c[0]);
    return clipUrl(pfad, name);
  }
  // Pakete zu allen Lautsprecher-Knöpfen laden, die gerade zu sehen sind (dann spielt der Ton sofort)
  function sayVorladen() {
    if (!F.audio) return;
    const namen = [...document.querySelectorAll('[data-say]')].map((b) => b.dataset.say);
    if (!namen.length) return;
    const pfad = audioPfad();
    ladeIndex(pfad).then((clips) => { if (clips) new Set(namen.map((n) => clips[n] && clips[n][0]).filter(Boolean)).forEach((p) => ladePaket(pfad, p)); });
  }
  const STILLE = 'data:audio/mpeg;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjYwLjE2LjEwMAAAAAAAAAAAAAAA//OEwAAAAAAAAAAAAEluZm8AAAAPAAAABQAAAbAAjo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojqqqqqqqqqqqqqqqqqqqqqqqqqqqx8fHx8fHx8fHx8fHx8fHx8fHx8fj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4///////////////////////////AAAAAExhdmM2MC4zMQAAAAAAAAAAAAAAACQDYAAAAAAAAAGwCcJljAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//MkxAAAAANIAAAAAExBTUUzLjEwMFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//MkxCMAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//MkxEYAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//MkxGkAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//MkxIwAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV';
  let SAYER = null, SAYBTN = null, SAYSTILL = false;
  function sayStop() { if (SAYER) { try { SAYER.pause(); } catch (e) {} } if (SAYBTN) SAYBTN.classList.remove('on'); SAYBTN = null; SAYSTILL = false; }
  function say(name, btn) {
    if (!F.audio || !/^[a-z0-9-]+$/.test(name)) return;
    const war = SAYBTN === btn;
    sayStop();
    if (war) return; // zweites Tippen hält an
    try {
      if (!SAYER) {
        SAYER = new Audio();
        SAYER.addEventListener('ended', () => { if (!SAYSTILL) sayStop(); });
        SAYER.addEventListener('error', () => { if (SAYSTILL) return; if (SAYBTN) SAYBTN.classList.add('err'); sayStop(); });
      }
      const pfad = audioPfad();
      SAYBTN = btn; btn.classList.remove('err'); btn.classList.add('on');
      const los = (url) => {
        if (SAYBTN !== btn) return; // inzwischen angehalten oder etwas anderes angetippt
        SAYSTILL = false;
        if (!url) { btn.classList.add('err'); sayStop(); return; }
        SAYER.src = url;
        const p = SAYER.play();
        if (p && p.catch) p.catch(() => { if (SAYBTN === btn) { btn.classList.add('err'); sayStop(); } });
      };
      const sofort = clipUrl(pfad, name);
      if (sofort) { los(sofort); return; }
      // Paket noch nicht geladen. Das iPhone erlaubt Ton nur direkt beim Antippen: deshalb sofort einen stillen Ton
      // starten („aufschließen“), dann laden und im selben Player abspielen.
      SAYSTILL = true;
      try { SAYER.src = STILLE; const p = SAYER.play(); if (p && p.catch) p.catch(() => {}); } catch (e) {}
      clipHolen(pfad, name).then(los);
    } catch (e) { sayStop(); }
  }

  // ---------- Ereignisse ----------
  document.addEventListener('click', (e) => {
    const b = e.target.closest('button');
    if (!b) return;
    const d = b.dataset;
    if (d.say) { say(d.say, b); return; }
    if (d.ord) { ordTok(b); return; }
    setTimeout(sayVorladen, 0); // nach diesem Klick können neue Lautsprecher-Knöpfe zu sehen sein
    if (d.akzent) { try { localStorage.setItem(AKZENT_KEY, d.akzent); } catch (e) {} sayStop(); home(); return; }
    if (d.go === 'home' && b.classList.contains('x') && VIEW === 'task' && R && (R.results.length || (R.cur && (R.cur.done || R.cur.attempt > 1)))) quitAsk();
    else if (d.go === 'home') { R = null; home(); window.scrollTo(0, 0); }
    else if (d.go === 'parents') { PTAB = 'fort'; parents(false); window.scrollTo(0, 0); }
    else if (d.ptab) { PTAB = d.ptab; parents(false); }
    else if (d.reset === 'ask') parents(true);
    else if (d.reset === 'yes' && !/^l(ö|oe)schen$/i.test((document.getElementById('resetWord') || { value: '' }).value.trim())) { const w = document.getElementById('resetWord'); if (w) { w.style.borderColor = 'var(--bad)'; w.focus(); } }
    else if (d.reset === 'yes') { S = { name: S.name, grade: 5, stats: {}, days: [], total: 0, seen: {}, resetAt: Date.now(), exSlow: S.exSlow }; save(); parents(false); }
    else if (d.sync) syncAction(d.sync, b);
    else if (d.topic) { start('topic', d.topic); window.scrollTo(0, 0); }
    else if (d.knobel) { start('knobel', d.knobel); window.scrollTo(0, 0); }
    else if (d.lbopen) { LBOFFEN.add(d.lbopen); const y = window.scrollY; home(); window.scrollTo(0, y); }
    else if (d.mix) { start('mix', d.mix); window.scrollTo(0, 0); }
    else if (d.tr) { start('tr', d.tr); window.scrollTo(0, 0); }
    else if ('review' in d) { start('review'); window.scrollTo(0, 0); }
    else if (d.grade) { if (+d.grade !== 5) soon(+d.grade); }
    else if (d.jump) { const e = document.getElementById(d.jump); if (e) e.scrollIntoView({ behavior: 'smooth' }); }
    else if ('ava' in d && AVA) AVA.picker(AVA.get() || AVA.STANDARD, (v) => { if (SYNC && SYS.enabled) SYNC.setAvatar(v); else AVA.set(v); try { localStorage.setItem('lerndax.avatar.asked', '1'); } catch (e) {} home(); });
    else if (d.explain) openExplainer(d.explain, d.when);
    else if ('exclose' in d) closeExplainer();
    else if (d.tok !== undefined) tapTok(b);
    else if (d.choice !== undefined) check(+d.choice);
    else if (d.dot !== undefined) { const el = document.getElementById('f' + d.dot); el.value = el.value.replace(/\s*·?\s*$/, '') + '·'; el.focus(); }
    else if ('again' in d) { start(R.mode, R.arg); window.scrollTo(0, 0); }
    else if (b.id === 'hintB') showHint();
    else if (b.id === 'checkB') check();
    else if (b.id === 'nextB') { R.idx++; nextTask(); window.scrollTo(0, 0); }
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && document.querySelector('.exov')) return closeExplainer();
    if (document.querySelector('.exov')) {
      if (e.key === ' ' && EXAPI && EXAPI.playing && !/INPUT|BUTTON/.test(e.target.tagName)) { e.preventDefault(); EXAPI.clock.paused ? EXAPI.resume() : EXAPI.pause(); }
      return;
    }
    if (e.key !== 'Enter' || !R || !R.cur) return;
    if (e.target.id === 'nameI') return;
    e.preventDefault();
    if (R.cur.done) { const n = document.getElementById('nextB'); if (n) n.click(); }
    else if (!R.cur.task.choices || R.cur.task.tap) {
      const inputs = [...document.querySelectorAll('.answer input')];
      const i = inputs.indexOf(e.target);
      if (i >= 0 && i < inputs.length - 1 && !inputs[i + 1].value) inputs[i + 1].focus();
      else check();
    }
  });

  // Für automatische Tests: aktuelle Runde auslesen
  window.__lerndax = window.__mathelix = { round: () => R, parseNum };

  // Installierbare App: Offline-Betrieb über Service Worker (nur unter eigener https-Adresse)
  if ('serviceWorker' in navigator && location.protocol === 'https:' && !/claude\.ai|claudeusercontent/.test(location.hostname)) {
    try { navigator.serviceWorker.register('../sw.js').catch(() => {}); } catch (e) {}
  }

  if (AVA) AVA.style();
  home();
  // Direkt-Sprünge von der LernDax-Startseite (#eltern, #entdecken)
  function jump() {
    if (location.hash === '#eltern') { R = null; parents(false); window.scrollTo(0, 0); }
    else if (location.hash === '#entdecken') { if (VIEW !== 'home') { R = null; home(); } setTimeout(() => { const e = document.getElementById('entdecken'); if (e) e.scrollIntoView(); }, 60); }
  }
  jump();
  window.addEventListener('hashchange', jump);

  if (SYNC) {
    let lastKey = '';
    SYNC.init({
      getState: () => ({ stats: S.stats, days: S.days, total: S.total || 0, seen: S.seen || {}, rounds: S.rounds || {}, knobel: S.knobel || {}, resetAt: S.resetAt || 0 }),
      applyState(m) {
        Object.assign(S, m); saveLocal();
        if (VIEW === 'home' && !document.querySelector('.exov')) home();
        else if (VIEW === 'parents') parents(false);
      },
      onStatus(st) {
        SYS = st;
        const key = [st.enabled, st.loggedIn, st.profileId].join('|');
        if (key !== lastKey) {
          lastKey = key;
          if (VIEW === 'parents') parents(false);
          else if (VIEW === 'home' && !document.querySelector('.exov')) { const y = window.scrollY; home(); window.scrollTo(0, y); }
        } else refreshSyncBits();
      },
    });
  }
})();
