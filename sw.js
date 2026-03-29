const CACHE_NAME = 'kwp3t-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/404.html',
  '/laporan-kas.html',
  '/admin/login.html',
  '/images/logo.webp',
  '/images/logo-192.webp',
  '/images/logo-512.webp',
  '/images/thr.webp',
  '/images/gotong.webp',
  '/images/tiang.webp',
  'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700;800&display=swap',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css',
  'https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js',
  'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'
];

// Install event: cache semua asset yang diperlukan
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
      .then(() => self.skipWaiting())
  );
});

// Fetch event: serve dari cache, jika tidak ada ambil dari network
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        return fetch(event.request).then(networkResponse => {
          // Optional: cache file baru yang belum ada (hanya untuk GET dan dari origin yang sama)
          if (event.request.method === 'GET' && event.request.url.startsWith(self.location.origin)) {
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then(cache => {
              cache.put(event.request, responseToCache);
            });
          }
          return networkResponse;
        });
      })
  );
});

// Activate event: hapus cache lama
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});
