var staticCacheName = "pwa";

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
                "script/jquery-3.3.1.js"
                
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
