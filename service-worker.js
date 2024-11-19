const CACHE_NAME = "sparing-tsvc-cache-v1";
const urlsToCache = [
    "/",
    "/index.html",
    "/manifest.json",
    "/assets/icons/icon-192x192.png",
    "/assets/icons/icon-512x512.png",
    "/offline.html"
];

// Install event
self.addEventListener("install", event => {
    self.skipWaiting(); // Langsung aktifkan service worker
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            console.log("Opened cache");
            return cache.addAll(urlsToCache);
        })
    );
});

// Fetch event
self.addEventListener("fetch", event => {
    event.respondWith(
        caches.match(event.request).then(response => {
            return response || fetch(event.request).catch(() => {
                return caches.match('/offline.html');
            });
        })
    );
});

// Activate event
self.addEventListener("activate", event => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (!cacheWhitelist.includes(cacheName)) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});
