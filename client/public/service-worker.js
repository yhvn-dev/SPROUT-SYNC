// public/service-worker.js

const CACHE_NAME = "sproutsync-cache-v3"; // ✅ bump this version on every deploy

const urlsToCache = [
  "/",
  "/index.html",
  "/manifest.json",
  "/vite.svg"
];

// ✅ Install — cache files AND immediately take control (don't wait)
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
  self.skipWaiting(); // ✅ activate new SW immediately, don't wait for old one to die
});

// ✅ Activate — delete ALL old caches so stale files are gone
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME) // delete anything not current version
          .map((name) => caches.delete(name))
      );
    })
  );
  self.clients.claim(); // ✅ take control of all open tabs immediately
});

// ✅ Fetch — Network First for HTML/navigation, Cache First for assets
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // For HTML page navigations — always try network first
  // This ensures the latest index.html is always served on page load
  if (request.mode === "navigate" || request.headers.get("accept")?.includes("text/html")) {
    event.respondWith(
      fetch(request)
        .then((networkResponse) => {
          // Update the cache with the fresh response
          const responseClone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, responseClone);
          });
          return networkResponse;
        })
        .catch(() => {
          return caches.match("/index.html");
        })
    );
    return;
  }

  // For JS/CSS/images — Cache First (fast loads)
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      if (cachedResponse) return cachedResponse;

      return fetch(request).then((networkResponse) => {
        // Only cache same-origin assets
        if (url.origin === self.location.origin) {
          const responseClone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, responseClone);
          });
        }
        return networkResponse;
      });
    })
  );
});