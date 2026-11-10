/* Mathelix – Service Worker: App läuft auch offline.
 * Bei jeder neuen Version VERSION erhöhen, dann holen sich alle Geräte die neuen Dateien. */
const VERSION = 'mathelix-v1';
const SHELL = [
  './', './index.html', './config.js', './sync.js', './manifest.webmanifest',
  './generatoren/klasse5.js', './erklaerungen/klasse5.js', './erklaerungen/entdecken.js',
  './icons/icon-192.png', './icons/icon-512.png', './icons/apple-touch-icon.png', './icons/favicon.png',
];
self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(VERSION).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== VERSION).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  const own = url.origin === location.origin;
  const cdn = /fonts\.(googleapis|gstatic)\.com$|cdn\.jsdelivr\.net$/.test(url.hostname);
  if (!own && !cdn) return; // Datenbank-Anfragen nie zwischenspeichern
  // Erst Cache (schnell, offline), im Hintergrund aktualisieren
  e.respondWith(caches.open(VERSION).then(async (c) => {
    const hit = await c.match(req, { ignoreSearch: own });
    const net = fetch(req).then((res) => { if (res && (res.ok || res.type === 'opaque')) c.put(req, res.clone()); return res; }).catch(() => hit);
    return hit || net;
  }));
});
