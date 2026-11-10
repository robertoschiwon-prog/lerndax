window.MATHELIX_CONFIG = { supabaseUrl: 'https://mock.supabase.co', supabaseKey: 'mock-key' };
(function () {
  const srv = (op, args) => window.__srv(op, JSON.stringify(args)).then((r) => JSON.parse(r));
  const getSess = () => { try { return JSON.parse(localStorage.getItem('mock.session')); } catch (e) { return null; } };
  const listeners = [];
  function Q(table) {
    const q = { table, ops: [] };
    const api = {
      select(c) { q.ops.push(['select', c]); return api; },
      order(c) { q.ops.push(['order', c]); return api; },
      eq(c, v) { q.ops.push(['eq', c, v]); return api; },
      insert(o) { q.ops.push(['insert', o]); return api; },
      upsert(o) { q.ops.push(['upsert', o]); return api; },
      update(o) { q.ops.push(['update', o]); return api; },
      single() { q.ops.push(['single']); return api; },
      maybeSingle() { q.ops.push(['maybe']); return api; },
      then(res, rej) { const s = getSess(); return srv('query', { uid: s && s.user.id, q }).then(res, rej); },
    };
    return api;
  }
  window.supabase = {
    createClient() {
      return {
        auth: {
          async getSession() { return { data: { session: getSess() } }; },
          onAuthStateChange(fn) { listeners.push(fn); },
          async signInWithPassword({ email, password }) {
            const r = await srv('login', { email, password });
            if (r.error) return { error: r.error };
            localStorage.setItem('mock.session', JSON.stringify(r.session)); listeners.forEach((f) => f('SIGNED_IN', r.session)); return { data: r };
          },
          async signUp({ email, password }) {
            const r = await srv('signup', { email, password });
            if (r.error) return { error: r.error };
            localStorage.setItem('mock.session', JSON.stringify(r.session)); listeners.forEach((f) => f('SIGNED_IN', r.session)); return { data: r };
          },
          async signOut() { localStorage.removeItem('mock.session'); listeners.forEach((f) => f('SIGNED_OUT', null)); return {}; },
        },
        from: (t) => Q(t),
      };
    },
  };
})();
