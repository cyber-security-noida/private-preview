// Version: v5 (Version badhaya taaki phone purana cache delete kare)
const CACHE_NAME = 'amazon-pwa-v5-pro';

// Sirf wahi files rakho jo 100% exist karti hain
const CORE_ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './icon.png'
];

self.addEventListener('install', (event) => {
  self.skipWaiting(); // Force new worker immediately
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        // Agar koi ek file bhi missing hui to pura app fail nahi hoga, try-catch use karenge
        return cache.addAll(CORE_ASSETS).catch(err => {
            console.error("Caching failed for some files:", err);
        });
      })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache); // Purana cache safaya
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
