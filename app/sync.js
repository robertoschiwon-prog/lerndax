/* Mathelix – Synchronisation über Supabase
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
  const DEV_KEY = 'mathelix.device';
  const P = CFG.tablePrefix != null ? CFG.tablePrefix : 'mathelix_';
  const T = { profiles: P + 'profiles', progress: P + 'progress', family_settings: P + 'family_settings' };

  let sb = null, app = null, pushTimer = null, ready = null;
  let dev = {};
  try { dev = JSON.parse(localStorage.getItem(DEV_KEY) || '{}'); } catch (e) {}
  const saveDev = () => { try { localStorage.setItem(DEV_KEY, JSON.stringify(dev)); } catch (e) {} };

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
    return { stats, days, seen, total: Math.max(A.total || 0, B.total || 0), resetAt: r };
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
        sb = window.supabase.createClient(CFG.supabaseUrl, CFG.supabaseKey, { auth: { persistSession: true, autoRefreshToken: true, storageKey: 'mathelix.auth' } });
        const { data } = await sb.auth.getSession();
        setUser(data && data.session ? data.session.user : null);
        sb.auth.onAuthStateChange((_e, session) => { setUser(session ? session.user : null); emit(); });
      } catch (e) { status.error = 'Verbindung nicht möglich'; }
      emit();
    })();
    await ready;
    if (status.loggedIn && status.profileId) syncNow();
    window.addEventListener('online', () => { status.online = true; emit(); syncNow(); });
    window.addEventListener('offline', () => { status.online = false; emit(); });
    document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible') syncNow(); });
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
    const { data, error } = await sb.from(T.profiles).select('id,name,grade').order('created_at');
    if (error) throw new Error(msg(error));
    return data || [];
  }
  async function createProfile(name, grade) {
    await ready;
    const { data, error } = await sb.from(T.profiles).insert({ name: name.slice(0, 30), grade: grade || 5 }).select('id,name').single();
    if (error) throw new Error(msg(error));
    return data;
  }
  async function bindProfile(id, name) {
    status.profileId = id; status.profileName = name;
    dev.profileId = id; dev.profileName = name; saveDev();
    emit();
    await syncNow();
  }

  // ---------- Eltern-PIN ----------
  async function hash(pin) {
    const txt = `mathelix:${status.userId}:${pin}`;
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
    if (!enabled || !sb || !status.loggedIn || !status.profileId || status.busy) return;
    if (!navigator.onLine) { status.online = false; emit(); return; }
    status.busy = true; status.error = ''; emit();
    try {
      const { data, error } = await sb.from(T.progress).select('state').eq('profile_id', status.profileId).maybeSingle();
      if (error) throw error;
      const remote = data ? data.state : null;
      const local = app.getState();
      const merged = merge(local, remote);
      if (!same(merged, local)) app.applyState(merged);
      if (!remote || !same(merged, merge(remote, {}))) {
        const { error: e2 } = await sb.from(T.progress).upsert({ profile_id: status.profileId, owner: status.userId, state: merged, updated_at: new Date().toISOString() });
        if (e2) throw e2;
      }
      status.lastSync = Date.now(); dev.lastSync = status.lastSync; saveDev();
    } catch (e) { status.error = msg(e); }
    status.busy = false; emit();
  }
  function changed() {
    if (!enabled || !status.profileId) return;
    clearTimeout(pushTimer);
    pushTimer = setTimeout(syncNow, 2500);
  }

  window.MathelixSync = { init, status: () => Object.assign({}, status), signIn, signUp, signOut, listProfiles, createProfile, bindProfile, syncNow, changed, setPin, checkPin, getPinHash, merge };
})();
