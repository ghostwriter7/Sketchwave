const buildTimestamp = __BUILD_TIMESTAMP__;
console.log(`Build timestamp: ${buildTimestamp}`);

const externalStyleResource = ['https://fonts.googleapis.com/css2', 'https://fonts.gstatic.com'];

const cachableResources = [
  '/',
  '/index.html',
  'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined',
  'https://fonts.googleapis.com/css2?family=Roboto:wght@400;500',
  '/icons/icon.png',
  '/manifest.json'
];

const addResourcesToCache = async (resources) => {
  const cache = await caches.open(buildTimestamp);
  await cache.addAll(resources);
};

const putInCache = async (request, response) => {
  const cache = await caches.open(buildTimestamp);
  console.log(`Caching ${request.url}`);
  await cache.put(request, response);
}

const resolveRequestFromCacheFirst = async (request) => {
  const path = request.url.replace(location.origin, '');

  const cachableResource = cachableResources.some((resource) => path === resource)
    || externalStyleResource.some((resource) => path.startsWith(resource));

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

const updateCachableResources = async () => {
  const response = await fetch('./vite-manifest.json');
  const manifest = await response.json();
  const indexEntry = manifest['index.html'];
  const javascriptFile = `/${indexEntry.file}`;
  const cssFile = `/${indexEntry.css[0]}`;

  console.log(`Updating cachable resources with entries: ${javascriptFile}, ${cssFile}`);

  cachableResources.push(javascriptFile, cssFile);
};

self.addEventListener('install',  (event) => {
  self.skipWaiting();

  event.waitUntil((async () => {
    await updateCachableResources();
    return addResourcesToCache(cachableResources);
  })());
});

self.addEventListener('activate', async (event) => {
  const cacheKeys = await caches.keys();
  const cachesToBeDeleted = cacheKeys.filter((cacheKey) => cacheKey !== buildTimestamp);

  if (cachesToBeDeleted.length === 0) return;

  console.log(`Purging caches: ${cachesToBeDeleted.join(', ')}`);

  Promise.all(cachesToBeDeleted.map((cacheKey) => caches.delete(cacheKey)));
  clients.claim();
});

self.addEventListener('fetch', (event) => {
  event.respondWith(resolveRequestFromCacheFirst(event.request));
});
