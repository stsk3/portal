var staticCacheName = "stsk-portal-v1.2";

self.addEventListener("install", function (e) {
    e.waitUntil(
        caches.open(staticCacheName).then(function (cache) {
            return cache.addAll([
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
                "mcl/index.html"
            ]);
        })
    );
});

self.addEventListener("fetch", function (event) {
    console.log(event.request.url);

    event.respondWith(
        caches.match(event.request).then(function (response) {
            return response || fetch(event.request);
        })
    );
});


self.addEventListener('activate', event => {
    // Remove old caches
    event.waitUntil(
        (async () => {
            const keys = await caches.keys();
            return keys.map(async (cache) => {
                if(cache !== cacheName) {
                    console.log('Service Worker: Removing old cache: '+cache);
                    return await caches.delete(cache);
                }
            })
        })()
    )
})
