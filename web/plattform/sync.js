/* LernDax – Synchronisation über Supabase (Plattform, für alle Fächer)
 *
 * Ein Elternkonto, Kind-Profile für alle Fächer, Lernstand je Fach (window.LERNDAX_SUBJECT).
 *
 * Offline zuerst: Der Lernstand liegt immer im Gerät (localStorage).
 * Ist ein Elternkonto angemeldet und ein Kind-Profil gewählt, wird der Stand
 * mit der Datenbank zusammengeführt – beim Start, nach jeder Runde und beim
 * Zurückkehren in die App.
 *
 * Zusammenführen ohne Datenverlust:
 *  - pro Thema gewinnt der Stand mit mehr bearbeiteten Aufgaben
 *  - Übungstage und gesehene Entdeckungen werden vereinigt
 *  - „Fortschritt zurücksetzen“ setzt einen Zeitstempel; ältere Stände werden verworfen
 */
(function () {
  const CFG = window.MATHELIX_CONFIG || {};
  // In der Claude-Vorschau blockiert die Seite Verbindungen zu fremden Servern: dort ohne Sync
  const inPreview = /claude\.ai$|claudeusercontent\.com$|anthropic\.com$/.test(location.hostname);
  const enabled = !!(CFG.supabaseUrl && CFG.supabaseKey) && !inPreview;
  const LIB = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';
  const DEV_KEY = 'lerndax.device';
  const SUBJ = window.LERNDAX_SUBJECT || ''; // '' = Startseite: nur Konto/Status, kein Lernstand
  const P = CFG.tablePrefix != null ? CFG.tablePrefix : 'lerndax_';
  const T = { profiles: P + 'profiles', progress: P + 'progress', family_settings: P + 'family_settings' };

  let sb = null, app = null, pushTimer = null, ready = null;
  let dev = {};
  try { dev = JSON.parse(localStorage.getItem(DEV_KEY) || '{}'); } catch (e) {}
  const saveDev = () => { try { localStorage.setItem(DEV_KEY, JSON.stringify(dev)); } catch (e) {} };

  const AV = () => window.LernDaxAvatare;
  const AVP = 'lerndax.avatar.pending';
  const status = { enabled, loggedIn: false, email: '', userId: '', profileId: dev.profileId || '', profileName: dev.profileName || '', lastSync: dev.lastSync || 0, busy: false, error: '', online: navigator.onLine };
  const emit = () => app && app.onStatus && app.onStatus(Object.assign({}, status));

  // ---------- Zusammenführen ----------
  function merge(a, b) {
    a = a || {}; b = b || {};
    const ra = a.resetAt || 0, rb = b.resetAt || 0, r = Math.max(ra, rb);
    const A = ra < r ? {} : a, B = rb < r ? {} : b;
    const stats = {};
    const keys = new Set([...Object.keys(A.stats || {}), ...Object.keys(B.stats || {})]);
    keys.forEach((k) => {
      const x = (A.stats || {})[k], y = (B.stats || {})[k];
      if (!x) stats[k] = y; else if (!y) stats[k] = x;
      else stats[k] = (y.n > x.n || (y.n === x.n && (y.last || '') > (x.last || ''))) ? y : x;
    });
    const days = [...new Set([...(A.days || []), ...(B.days || [])])].sort().slice(-400);
    const seen = Object.assign({}, A.seen || {}, B.seen || {});
    // Runden pro Tag (für das Tagesziel): je Tag der höhere Wert, nur die letzten 60 Tage
    const rounds = {};
    [...new Set([...Object.keys(A.rounds || {}), ...Object.keys(B.rounds || {})])].sort().slice(-60)
      .forEach((d) => { rounds[d] = Math.max((A.rounds || {})[d] || 0, (B.rounds || {})[d] || 0); });
    // Knobel-Zähler je Thema: der höhere Wert (fehlt in älteren Ständen)
    const knobel = {};
    new Set([...Object.keys(A.knobel || {}), ...Object.keys(B.knobel || {})]).forEach((k) => {
      const x = (A.knobel || {})[k] || { n: 0, ok: 0 }, y = (B.knobel || {})[k] || { n: 0, ok: 0 };
      knobel[k] = { n: Math.max(x.n || 0, y.n || 0), ok: Math.max(x.ok || 0, y.ok || 0) };
    });
    return { stats, days, seen, rounds, knobel, total: Math.max(A.total || 0, B.total || 0), resetAt: r };
  }
  const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);

  // ---------- Bibliothek laden ----------
  function loadLib() {
    if (window.supabase && window.supabase.createClient) return Promise.resolve();
    return new Promise((res, rej) => {
      const s = document.createElement('script');
      s.src = LIB; s.onload = res; s.onerror = () => rej(new Error('Bibliothek nicht ladbar'));
      document.head.appendChild(s);
    });
  }

  async function init(hooks) {
    app = hooks;
    if (!enabled) { emit(); return; }
    ready = (async () => {
      try {
        await loadLib();
        sb = window.supabase.createClient(CFG.supabaseUrl, CFG.supabaseKey, { auth: { persistSession: true, autoRefreshToken: true, storageKey: 'lerndax.auth' } });
        const { data } = await sb.auth.getSession();
        setUser(data && data.session ? data.session.user : null);
        sb.auth.onAuthStateChange((_e, session) => { setUser(session ? session.user : null); emit(); });
      } catch (e) { status.error = 'Verbindung nicht möglich'; }
      emit();
    })();
    await ready;
    if (status.loggedIn && status.profileId) { syncAvatar(); syncNow(); }
    window.addEventListener('online', () => { status.online = true; emit(); syncAvatar(); syncNow(); });
    window.addEventListener('offline', () => { status.online = false; emit(); });
    document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible') { syncAvatar(); syncNow(); } });
  }
  function setUser(u) {
    status.loggedIn = !!u; status.email = u ? u.email : ''; status.userId = u ? u.id : '';
    if (!u) { status.profileId = ''; status.profileName = ''; }
  }

  // ---------- Konto ----------
  const msg = (e) => {
    const m = (e && e.message) || String(e);
    if (/Invalid login/i.test(m)) return 'E-Mail oder Passwort stimmt nicht.';
    if (/Email not confirmed/i.test(m)) return 'Bitte bestätige zuerst deine E-Mail-Adresse (Link im Postfach).';
    if (/already registered/i.test(m)) return 'Für diese E-Mail gibt es schon ein Konto. Bitte anmelden.';
    if (/Password should be/i.test(m)) return 'Das Passwort muss mindestens 6 Zeichen haben.';
    if (/fetch|network/i.test(m)) return 'Keine Verbindung zum Server.';
    return m;
  };
  async function signIn(email, password) {
    await ready;
    const { error } = await sb.auth.signInWithPassword({ email, password });
    if (error) throw new Error(msg(error));
    emit();
  }
  async function signUp(email, password) {
    await ready;
    const { data, error } = await sb.auth.signUp({ email, password, options: { emailRedirectTo: location.href.split('#')[0] } });
    if (error) throw new Error(msg(error));
    return !(data && data.session); // true = Bestätigung per E-Mail nötig
  }
  async function signOut() {
    await ready;
    await sb.auth.signOut();
    dev = {}; saveDev();
    setUser(null); emit();
  }

  // ---------- Profile ----------
  async function listProfiles() {
    await ready;
    const { data, error } = await sb.from(T.profiles).select('id,name,grade,avatar').order('created_at');
    if (error) throw new Error(msg(error));
    return data || [];
  }
  async function createProfile(name, grade) {
    await ready;
    const av = AV() && AV().get();
    const { data, error } = await sb.from(T.profiles).insert({ name: name.slice(0, 30), grade: grade || 5, avatar: av || null }).select('id,name,avatar').single();
    if (error) throw new Error(msg(error));
    return data;
  }
  async function bindProfile(id, name, avatar) {
    status.profileId = id; status.profileName = name;
    dev.profileId = id; dev.profileName = name; saveDev();
    if (avatar && AV()) { AV().set(avatar); try { localStorage.removeItem(AVP); } catch (e) {} }
    emit();
    await syncAvatar();
    await syncNow();
  }

  // ---------- Avatar: im Profil gespeichert, auf allen Geräten gleich ----------
  async function setAvatar(v) {
    if (AV()) AV().set(v);
    try { localStorage.setItem(AVP, '1'); } catch (e) {}
    emit();
    await syncAvatar();
  }
  async function syncAvatar() {
    if (!enabled || !sb || !status.loggedIn || !status.profileId || !navigator.onLine || !AV()) return;
    try {
      let pending = false; try { pending = localStorage.getItem(AVP) === '1'; } catch (e) {}
      if (pending) {
        const { error } = await sb.from(T.profiles).update({ avatar: AV().get() }).eq('id', status.profileId);
        if (!error) { try { localStorage.removeItem(AVP); } catch (e) {} }
      } else {
        const { data } = await sb.from(T.profiles).select('avatar').eq('id', status.profileId).maybeSingle();
        if (data && data.avatar && data.avatar !== AV().get()) { AV().set(data.avatar); emit(); }
        else if (data && !data.avatar && AV().get()) await sb.from(T.profiles).update({ avatar: AV().get() }).eq('id', status.profileId);
      }
    } catch (e) {}
  }

  // ---------- Eltern-PIN ----------
  async function hash(pin) {
    const txt = `lerndax:${status.userId}:${pin}`;
    try {
      const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(txt));
      return [...new Uint8Array(buf)].map((x) => x.toString(16).padStart(2, '0')).join('');
    } catch (e) { let h = 0; for (const c of txt) h = (h * 31 + c.charCodeAt(0)) | 0; return 'h' + h; }
  }
  async function getPinHash() {
    await ready;
    const { data } = await sb.from(T.family_settings).select('pin_hash').maybeSingle();
    return data ? data.pin_hash : null;
  }
  async function setPin(pin) {
    await ready;
    const { error } = await sb.from(T.family_settings).upsert({ owner: status.userId, pin_hash: pin ? await hash(pin) : null, updated_at: new Date().toISOString() });
    if (error) throw new Error(msg(error));
  }
  async function checkPin(pin) { const h = await getPinHash(); return !h || h === (await hash(pin)); }

  // ---------- Abgleich ----------
  async function syncNow() {
    if (!enabled || !sb || !SUBJ || !status.loggedIn || !status.profileId || status.busy) return;
    if (!navigator.onLine) { status.online = false; emit(); return; }
    status.busy = true; status.error = ''; emit();
    try {
      const { data, error } = await sb.from(T.progress).select('state').eq('profile_id', status.profileId).eq('subject', SUBJ).maybeSingle();
      if (error) throw error;
      const remote = data ? data.state : null;
      const local = app.getState();
      const merged = merge(local, remote);
      if (!same(merged, local)) app.applyState(merged);
      if (!remote || !same(merged, merge(remote, {}))) {
        const { error: e2 } = await sb.from(T.progress).upsert({ profile_id: status.profileId, subject: SUBJ, owner: status.userId, state: merged, updated_at: new Date().toISOString() }, { onConflict: 'profile_id,subject' });
        if (e2) throw e2;
      }
      status.lastSync = Date.now(); dev.lastSync = status.lastSync; saveDev();
    } catch (e) { status.error = msg(e); }
    status.busy = false; emit();
  }
  function changed() {
    if (!enabled || !SUBJ || !status.profileId) return;
    clearTimeout(pushTimer);
    pushTimer = setTimeout(syncNow, 2500);
  }

  window.LernDaxSync = window.MathelixSync = { setAvatar, syncAvatar, init, status: () => Object.assign({}, status), signIn, signUp, signOut, listProfiles, createProfile, bindProfile, syncNow, changed, setPin, checkPin, getPinHash, merge };
})();
