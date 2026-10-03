const CACHE_NAME = 'kwp3t-v1.0.0'; // Ubah versi ini setiap kali Anda update web
const RUNTIME_CACHE = 'kwp3t-runtime-v1';

// Daftar file yang akan di-cache saat pertama kali diakses
const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/laporan-kas.html',
  '/offline.html',
  '/manifest.json',
  '/images/logo.webp',
  '/images/logo-192.webp',
  '/images/logo-512.webp'
];

// ===== INSTALL =====
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(PRECACHE_ASSETS))
      .then(() => self.skipWaiting())
  );
});

// ===== ACTIVATE =====
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME && key !== RUNTIME_CACHE)
            .map((key) => caches.delete(key))
      );
    }).then(() => self.clients.claim())
  );
});

// ===== FETCH =====
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  if (request.method !== 'GET') return;

  // Jangan cache request ke Supabase (harus selalu fresh)
  if (url.hostname.includes('supabase.co')) return;

  // HTML: Network-first (selalu ambil versi terbaru, fallback ke cache/offline)
  if (request.mode === 'navigate' || request.destination === 'document') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone();
          caches.open(RUNTIME_CACHE).then((cache) => cache.put(request, copy));
          return response;
        })
        .catch(() => {
          return caches.match(request).then((cached) => cached || caches.match('/offline.html'));
        })
    );
    return;
  }

  // Aset statis (Gambar, CSS, JS, Font): Cache-first
  const isStatic = ['style', 'script', 'font', 'image'].includes(request.destination)
    || url.hostname === 'cdn.jsdelivr.net'
    || url.hostname === 'cdnjs.cloudflare.com'
    || url.hostname === 'fonts.googleapis.com'
    || url.hostname === 'fonts.gstatic.com';

  if (isStatic) {
    event.respondWith(
      caches.match(request).then((cached) => {
        if (cached) return cached;
        return fetch(request).then((response) => {
          if (!response || response.status !== 200 || response.type === 'opaque') return response;
          const copy = response.clone();
          caches.open(RUNTIME_CACHE).then((cache) => cache.put(request, copy));
          return response;
        }).catch(() => caches.match('/offline.html'));
      })
    );
  }
});
