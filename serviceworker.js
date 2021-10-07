const filesToCache = [
    "index.html",
    "home.html",
    "bus-interchange.html",
    "bus-sectional-fare.html",
    "weather.html",
    "footer.html",

    "mcl/index.html",
    "kfc/index.html",


    "image/favicon.ico",
    "image/home-icon/bus_interchange.png",
    "image/home-icon/bus_sectional_fare.png",
    "image/home-icon/hmd.png",
    "image/home-icon/kfc.png",
    "image/home-icon/mcl.png",
    "image/home-icon/weather.png",

    "main.css",
    "script/jquery.dataTables.min.css",
    "script/jquery.dataTables.min.js",
    "script/jquery-3.3.1.js",
    "script/bus-route.js"
];

const swVersion = 1.91;
const cacheName = 'stsk-portal-v' + swVersion;
const dataCacheName = 'stsk-portal-data-v' + swVersion;

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
                    if(event.request.url.indexOf('http') === 0 && event.request.url.indexOf('warnsum') !== -1 && !event.request.url.endsWith('version.js')){
                        console.log('Fetched and Cached: ' + event.request.url);
                        cache.put(event.request, res.clone());
                    }
                    return res;
                })
            );
        })
    );
})
