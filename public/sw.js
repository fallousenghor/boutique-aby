const CACHE_NAME = 'rawda-pwa-v1';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/favicon.svg',
  '/logo-96x96.png',
  '/logo-144x144.png',
  '/logo-192x192.png',
  '/logo-192x192-maskable.png',
  '/logo-512x512.png',
  '/logo-512x512-maskable.png',
  '/apple-touch-icon.png',
  '/manifest.webmanifest'
];

// Installation du service worker
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(STATIC_ASSETS))
      .catch(err => console.log('Cache installation failed:', err))
  );
  self.skipWaiting();
});

// Activation et nettoyage des anciens caches
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
    })
  );
  self.clients.claim();
});

// Stratégie de fetch: Network First, Fall back to Cache
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // Ignorer les requêtes non-GET
  if (request.method !== 'GET') {
    return;
  }

  // Pour les assets statiques, utiliser le cache
  if (url.pathname.includes('/logo') || 
      url.pathname.includes('/favicon') ||
      url.pathname === '/manifest.webmanifest') {
    event.respondWith(
      caches.match(request)
        .then(response => response || fetch(request))
        .catch(() => caches.match('/index.html'))
    );
    return;
  }

  // Pour le reste: Network First, avec fallback cache
  event.respondWith(
    fetch(request)
      .then(response => {
        // Ne cache que les réponses valides
        if (!response || response.status !== 200) {
          return response;
        }

        // Clone la réponse pour la cacher
        const responseToCache = response.clone();
        caches.open(CACHE_NAME)
          .then(cache => cache.put(request, responseToCache))
          .catch(err => console.log('Failed to cache:', err));

        return response;
      })
      .catch(() => {
        // Fallback: retourner depuis le cache ou une page d'erreur
        return caches.match(request)
          .then(response => response || caches.match('/index.html'));
      })
  );
});
