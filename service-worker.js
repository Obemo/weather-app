const cacheName = "weather-app-v1";
const assets = [
    "./",
    "./index.html",
    "./styles.css",
    "./script.js",
    "./icons/icon-192x192.png",
    "./icons/icon-512x512.png"
];

self.addEventListener("install", event => {
    event.waitUntil(
        caches.open(cacheName).then(cache => {
            console.log("Caching assets...");
            return cache.addAll(assets);
        })
    );
});

self.addEventListener("fetch", event => {
    event.respondWith(
        caches.match(event.request).then(response => {
            return response || fetch(event.request);
        })
    );
});