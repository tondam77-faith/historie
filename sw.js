const CACHE_NAME = 'historie-srs-v33'; // ZMĚNIT PŘI KAŽDÉM UPDATE (v33, v34...)
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './icon.png'
];

// Instalace - stáhne nové soubory
self.addEventListener('install', (e) => {
  self.skipWaiting(); // Donutí nový SW aktivovat se ihned
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
});

// Aktivace - SMAŽE STAROU VERZI APLIKACE (ale data v DB nechá!)
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('Mažu starou cache:', key);
            return caches.delete(key);
          }
        })
      );
    })
  );
  return self.clients.claim(); // Převezme kontrolu nad otevřenými stránkami
});

// Fetch - slouží soubory z cache nebo sítě
self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((res) => res || fetch(e.request))
  );
});