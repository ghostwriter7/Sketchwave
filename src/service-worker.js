const randomIdentifier = Math.random().toFixed(3);

const CACHABLE_RESOURCES = [
  '/',
  './index.html',
  './index.js',
  './styles.css',
  'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined',
  'https://fonts.googleapis.com/css2?family=Roboto:wght@400;500'
];

const addResourcesToCache = async (resources) => {
  const cache = await caches.open(randomIdentifier);
  await cache.addAll(resources);
};

const putInCache = async (request, response) => {
  const cache = await caches.open(randomIdentifier);
  console.log(`Caching ${request.url}`);
  await cache.put(request, response);
}

const resolveRequestFromCacheFirst = async (request) => {
  const cachableResource = CACHABLE_RESOURCES.some((resource) => request.url.includes(resource));

  if (cachableResource) {
    const responseFromCache = await caches.match(request);

    if (responseFromCache) {
      console.log(`Serving ${request.url} from cache`);
      return responseFromCache;
    }
  }

  try {
    console.log(`Fetching ${request.url} from network`);
    const responseFromNetwork = await fetch(request.clone());
    cachableResource && putInCache(request, responseFromNetwork.clone());
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
    addResourcesToCache(CACHABLE_RESOURCES)
  );
});

self.addEventListener('activate', async (event) => {
  const cacheKeys = await caches.keys();
  const cachesToBeDeleted = cacheKeys.filter((cacheKey) => cacheKey !== randomIdentifier);

  if (cachesToBeDeleted.length === 0) return;

  console.log(`Purging caches: ${cachesToBeDeleted.join(', ')}`);

  Promise.all(cachesToBeDeleted.map((cacheKey) => caches.delete(cacheKey)));
});

self.addEventListener('fetch', (event) => {
  event.respondWith(resolveRequestFromCacheFirst(event.request));
});
