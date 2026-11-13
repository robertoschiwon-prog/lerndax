/* LernDax – Service Worker: App läuft auch offline.
 * Eigene Dateien: immer zuerst frisch vom Server, der Speicher ist nur der Offline-Ersatz.
 * So kommen Änderungen sofort an. Bei neuer Version VERSION erhöhen. */
const VERSION = 'lerndax-v84';
const SHELL = [
  './', './index.html', './manifest.webmanifest', './plattform/config.js', './plattform/sync.js', './plattform/avatare.js', './plattform/trainings.js', './plattform/faecher.js', './plattform/symbole.js', './plattform/fach.js', './plattform/fach.css',
  './deutsch/', './deutsch/index.html', './deutsch/themen/klasse5.js', './deutsch/themen/klasse5-knobel.js', './deutsch/erklaerungen/klasse5.js', './deutsch/erklaerungen/entdecken.js', './deutsch/symbole.js',
  './englisch/', './englisch/index.html', './englisch/themen/klasse5.js', './englisch/themen/klasse5-knobel.js', './englisch/erklaerungen/klasse5.js', './englisch/erklaerungen/entdecken.js', './englisch/symbole.js', './englisch/audio/us/index.json', './englisch/audio/gb/index.json', // Sammeldateien der Aufnahmen (englisch/audio/*/<thema>.bin) werden beim ersten Öffnen eines Themas gespeichert
  './mathe/', './mathe/index.html', './mathe/generatoren/klasse5.js', './mathe/generatoren/klasse5-luecken.js', './mathe/generatoren/klasse5-buch.js', './mathe/generatoren/klasse5-knobel.js', './mathe/symbole.js',
  './mathe/erklaerungen/klasse5.js', './mathe/erklaerungen/klasse5-luecken.js', './mathe/erklaerungen/klasse5-buch.js', './mathe/erklaerungen/entdecken.js',
  './icons/dachs.svg', './icons/madax.svg', './icons/madax-klein.svg', './icons/madax-staunt.svg', './icons/dedax.svg', './icons/endax.svg', './icons/biodax.svg', './icons/gedax.svg', './icons/geodax.svg', './icons/tecdax.svg', './icons/icon-192-v4.png', './icons/icon-512-v4.png',
  './icons/apple-touch-icon-v4.png', './icons/favicon-v4.png',
];
self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(VERSION)
    .then((c) => c.addAll(SHELL.map((u) => new Request(u, { cache: 'reload' }))))
    .then(() => self.skipWaiting()));
});
self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys()
    .then((keys) => Promise.all(keys.filter((k) => k !== VERSION).map((k) => caches.delete(k))))
    .then(() => self.clients.claim()));
});
self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  const own = url.origin === location.origin;
  const cdn = /fonts\.(googleapis|gstatic)\.com$|cdn\.jsdelivr\.net$/.test(url.hostname);
  if (!own && !cdn) return; // Datenbank-Anfragen nie zwischenspeichern
  if (own) {
    // Netz zuerst (ohne veralteten Browser-Cache), offline aus dem Speicher
    e.respondWith(fetch(req, { cache: 'no-cache' })
      .then((res) => { if (res && res.ok) { const copy = res.clone(); caches.open(VERSION).then((c) => c.put(req, copy)); } return res; })
      .catch(() => caches.match(req, { ignoreSearch: true }).then((hit) => hit || caches.match('./index.html'))));
    return;
  }
  // Schriften & Bibliotheken: Speicher zuerst (ändern sich nicht)
  e.respondWith(caches.open(VERSION).then(async (c) => {
    const hit = await c.match(req);
    if (hit) return hit;
    const res = await fetch(req);
    if (res && (res.ok || res.type === 'opaque')) c.put(req, res.clone());
    return res;
  }));
});
