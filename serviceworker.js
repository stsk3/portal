const filesToCache = [
    "index.html",
    "header.html",
    "home.html",
    "bus-interchange.html",
    "bus-sectional-fare.html",
    "footer.html",
    "main.css",
    "script/jquery.dataTables.min.css",
    "script/jquery.dataTables.min.js",
    "script/jquery-3.3.1.js",
    "script/bus-route.js",
    "mcl/index.html",
    "mcl/image/favicon.ico",
    "kfc/index.html"
];

const version = 1.66;
const cacheName = 'stsk-portal-v' + version;
const dataCacheName = 'stsk-portal-data-v' + version;

// install
self.addEventListener('install', event => {
    console.log('[Install]');
    event.waitUntil(
        caches.open(cacheName).then(cache => {
            console.log('Finished caching');
            return cache.addAll(filesToCache);
        })
    );
});

// activate
self.addEventListener('activate', event => {
    console.log('[Activate]');
    event.waitUntil(
        caches.keys().then(function(cacheNames) {
            var promiseArr = cacheNames.map(function(item) {
                if (item !== cacheName) {
                    // Delete that cached file
                    console.log('[ServiceWorker] Removing Cached Files from Cache - ', item);
                    return caches.delete(item);
                }
            })
            return Promise.all(promiseArr);
        })
    ); // end event.waitUntil
})

// fetch
self.addEventListener('fetch', event => {
    console.log('[Fetch]');
    event.respondWith(
        caches.match(event.request).then(function (response) {
            return response || fetch(event.request).then(res =>
                caches.open(dataCacheName)
                .then(function(cache) {
                    if(event.request.url.indexOf('http') === 0){
                        console.log('Fetched and Cached: ' + event.request.url);
                        cache.put(event.request, res.clone());
                        return res;
                    }
                })
            );
        })
    );
})
