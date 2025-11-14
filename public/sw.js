// Service Worker for SkinBestie PWA
// Using official caching strategies from https://web.dev/offline-cookbook/

const CACHE_NAME = 'skinbestie-v1';
const DYNAMIC_CACHE = 'skinbestie-dynamic-v1';

// Install event - precache core assets
self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      return cache.addAll([
        '/',
        '/dashboard',
        '/my-profile',
        '/manifest.webmanifest',
        '/Favicon.png',
      ]);
    })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches.keys().then(function (cacheNames) {
      return Promise.all(
        cacheNames
          .filter(function (cacheName) {
            return cacheName !== CACHE_NAME && cacheName !== DYNAMIC_CACHE;
          })
          .map(function (cacheName) {
            return caches.delete(cacheName);
          })
      );
    })
  );
});

// Fetch event - apply caching strategies
self.addEventListener('fetch', function (event) {
  const url = new URL(event.request.url);

  // Skip cross-origin requests
  if (url.origin !== location.origin) {
    return;
  }

  // Cache, falling back to network - for static assets
  // From: https://web.dev/offline-cookbook/#cache-falling-back-to-network
  if (
    event.request.destination === 'script' ||
    event.request.destination === 'style' ||
    event.request.destination === 'font' ||
    event.request.destination === 'image' ||
    url.pathname.startsWith('/_next/static/')
  ) {
    event.respondWith(
      caches.match(event.request).then(function (response) {
        return response || fetch(event.request);
      })
    );
    return;
  }

  // Stale-while-revalidate - for pages
  // From: https://web.dev/offline-cookbook/#stale-while-revalidate
  if (event.request.destination === 'document') {
    event.respondWith(
      caches.open(DYNAMIC_CACHE).then(function (cache) {
        return cache.match(event.request).then(function (response) {
          var fetchPromise = fetch(event.request).then(function (networkResponse) {
            cache.put(event.request, networkResponse.clone());
            return networkResponse;
          });
          return response || fetchPromise;
        });
      })
    );
    return;
  }

  // Network falling back to cache - for API calls
  // From: https://web.dev/offline-cookbook/#network-falling-back-to-cache
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(event.request).catch(function () {
        return caches.match(event.request);
      })
    );
    return;
  }
});

// Push notification event (for future use)
self.addEventListener('push', function (event) {
  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body,
      icon: data.icon || '/Favicon.png',
      badge: '/Favicon.png',
      vibrate: [100, 50, 100],
      data: {
        dateOfArrival: Date.now(),
        primaryKey: '2',
      },
    };
    event.waitUntil(self.registration.showNotification(data.title, options));
  }
});

self.addEventListener('notificationclick', function (event) {
  console.log('Notification click received.');
  event.notification.close();
  event.waitUntil(clients.openWindow('/'));
});
