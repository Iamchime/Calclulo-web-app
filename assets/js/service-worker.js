const CACHE_NAME = 'calclulo-cache-v2';
const urlsToCache = [
  '/',
  '/pwa-start-page',
  '/assets/css/pwa-start-page.css',
  '/assets/js/pwa-start-page.js',
  '/assets/js/favourites.js',
  '/assets/css/favourites.css',
  '/favourites',
  '/assets/js/favourites-list.js',
  '/assets/js/header-functions.js',
  '/assets/css/search.css',
  '/assets/js/search.js'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return Promise.all(
        urlsToCache.map(url =>
          cache.add(url).catch(err => console.warn('Failed to cache:', url, err))
        )
      );
    })
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(key => key !== CACHE_NAME)
        .map(key => caches.delete(key))
      );
    })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});