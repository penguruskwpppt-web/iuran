// Updated service worker for caching files
const CACHE_NAME = 'my-site-cache-v1';
const urlsToCache = [
    '/index.html',
    '/styles/main.css',
    '/scripts/main.js',
    // Add other necessary files for caching
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Opened cache');
                return cache.addAll(urlsToCache);
            })
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                return response || fetch(event.request);
            })
    );
});
