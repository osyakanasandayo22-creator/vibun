const CACHE_NAME = "visionquest-grammar-v2";
const urlsToCache = [
  "./",
  "./index.html",
  "./style.css",
  "./script.js",
  "./images/title.png",
  "./images/icon-192.png",
  "./images/icon-512.png",
  "./images/icons8-右-100.png",
  "./images/icons8-大音量-96.png",
  "./images/家の無料アイコン.png",
  "./images/月のアイコン.png"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache)).catch(() => {})
  );
});

self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => response || fetch(event.request))
  );
});

self.addEventListener("activate", event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(keyList =>
      Promise.all(
        keyList.map(key => {
          if (!cacheWhitelist.includes(key)) return caches.delete(key);
        })
      )
    )
  );
});
