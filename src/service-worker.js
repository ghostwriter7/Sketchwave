const randomIdentifier = Math.random().toFixed(3);

const addResourcesToCache = async (resources) => {
  const cache = await caches.open(randomIdentifier);
  await cache.addAll(resources);
};

const putInCache = async (request, response) => {
  const cache = await caches.open(randomIdentifier);
  await cache.put(request, response);
}

const resolveRequestFromCacheFirst = async (request) => {
  const responseFromCache = await caches.match(request);

  if (responseFromCache) {
    return responseFromCache;
  }

  try {
    const responseFromNetwork = await fetch(request.clone());
    putInCache(request, responseFromNetwork.clone());
    return responseFromNetwork;
  } catch (error) {
    return new Response('Network error happened', {
      status: 408,
      headers: {'Content-Type': 'text/plain'},
    });
  }
};

self.addEventListener('install', (event) => {
  event.waitUntil(
    addResourcesToCache([
      './index.html',
      './index.js',
      './styles.css',
      'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined',
      'https://fonts.googleapis.com/css2?family=Roboto:wght@400;500'
    ])
  );
});

self.addEventListener('activate', async (event) => {
  const cacheKeys = await caches.keys();
  Promise.all(
    cacheKeys.filter((cacheKey) => cacheKey !== randomIdentifier)
      .map((cacheKey) => caches.delete(cacheKey)));
});

self.addEventListener('fetch', (event) => {
  event.respondWith(resolveRequestFromCacheFirst(event.request));
});
