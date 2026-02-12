const CACHE_NAME = 'historie-srs-v3.0-FINAL';
const ASSETS = [
  './',
  './index.html',
  './editor.html',
  './manifest.json',
  './history.png',
  './favicon.ico'
];

// Instalace a stažení souborů do paměti
self.addEventListener('install', (e) => {
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS)));
});

// Aktivace a vymazání staré paměti (tohle opraví chyby)
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  return self.clients.claim();
});

// Obsluha požadavků (offline režim)
self.addEventListener('fetch', (e) => {
  e.respondWith(caches.match(e.request).then((res) => res || fetch(e.request)));
});