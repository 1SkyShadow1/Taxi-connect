self.addEventListener('install', (e) => {
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  clients.claim();
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  if (url.origin === location.origin && url.pathname.startsWith('/')) {
    event.respondWith(
      caches.open('runtime').then(async cache => {
        try {
          const network = await fetch(event.request);
          cache.put(event.request, network.clone());
          return network;
        } catch (err) {
          const cached = await cache.match(event.request);
          if (cached) return cached;
          throw err;
        }
      })
    );
  }
});
