const kmbPrefix = "https://data.etabus.gov.hk/v1/transport/kmb/";
const nwPrefix = "https://rt.data.gov.hk/v1.1/transport/citybus-nwfb/route/";


const filesToCache = [
    "index.html",
    "home.html",
    "home-uk.html",
    "bus-interchange.html",
    "bus-sectional-fare.html",
    "bus-eta.html",
    "bus-mtr-eta.html",
    "bus-brighton-eta.html",
    "work-eta.html",
    "mtr-lr-eta.html",
    "weather.html",
    "hospital.html",
    "traffic-news.html",
    "finance-bill.html",

    "footer.html",

    "mcl/index.html",
    "kfc/index.html",
    "kfc/image/KFC.png",


    "image/favicon.ico",
    "image/icon.png",
    "image/home-icon/bus_interchange.png",
    "image/home-icon/bus_sectional_fare.png",
    "image/home-icon/bus_kmb_eta.png",
    "image/home-icon/bus_brighton_eta.png",
    "image/home-icon/mtr_lr_eta.png",
    "image/home-icon/hmd.png",
    "image/home-icon/kfc.png",
    "image/home-icon/mcl.png",
    "image/home-icon/weather.png",
    "image/home-icon/hospital.png",
    "image/home-icon/traffic-news.png",
    "image/home-icon/tv_schedule.png",
    "image/home-icon/fairwood.png",
    "image/home-icon/promotion.png",
    "image/home-icon/tvstsk.png",
    "image/home-icon/finance_bill.png",

    "image/map-marker/anniversary_2021.png",
    "image/map-marker/anniversary_2022.png",
    "image/map-marker/birthday_2020.png",
    "image/map-marker/birthday_2021.png",
    "image/map-marker/birthday_2022.png",
    "image/map-marker/cockroach.png",
    "image/map-marker/cow.png",
    "image/map-marker/enlarge-button.png",
    "image/map-marker/farm.png",
    "image/map-marker/flower.png",
    "image/map-marker/flower_group.png",
    "image/map-marker/gold.png",
    "image/map-marker/gps.png",
    "image/map-marker/gps-button.png",
    "image/map-marker/grass.png",
    "image/map-marker/mushroom.png",
    "image/map-marker/next-button.png",
    "image/map-marker/peach.png",
    "image/map-marker/pepeachristsky.png",
    "image/map-marker/pepeachristsky_love.png",
    "image/map-marker/prev-button.png",
    "image/map-marker/shinchan.png",
    "image/map-marker/snoopy_blue.png",
    "image/map-marker/snoopy_yellow.png",
    "image/map-marker/bus.png",

    "image/loading/loading1.gif",
    "image/loading/loading2.gif",
    "image/loading/loading3.gif",
    "image/loading/loading4.gif",
    "image/loading/loading5.gif",
    "image/loading/loading6.gif",


    "main.css",
    "manifest.json",
    "script/jquery.dataTables.min.css",
    "script/jquery.dataTables.min.js",
    "script/jquery-3.3.1.js",
    "script/leaflet.js",
    "script/leaflet.js.map",
    "script/leaflet.css",
    "script/map-component.js",
    "script/common.js",

    "transport/light_rail_station_list.js",
    "transport/mtr_bus_route_list.js",
    "transport/brighton_bus_route_list.js",
    "transport/brighton_bus_station_list.js",
    "transport/sectional-tko.png",
    "transport/sectional-tuen-yuen-tin.png",
    "transport/sectional-north.png",
    "transport/interchange/BBI_routeF1.js",
    "transport/interchange/BBI_routeF2.js",
    "transport/interchange/BBI_routeB1.js",
    "transport/interchange/BBI_routeB2.js",

    kmbPrefix + "stop",
    kmbPrefix + "route/",
    nwPrefix + "CTB/",
    nwPrefix + "NWFB/",
];

const swVersion = '1.32';
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
                    if(event.request.url.includes('http') &&
                        (event.request.url.includes('stsk3') ||
                            event.request.url.includes(kmbPrefix) ||
                            event.request.url.includes(nwPrefix) ||
                            event.request.url.includes('hko.gov.hk')) &&
                        !event.request.url.includes('_=') &&
                        !event.request.url.includes('?') &&
                        !event.request.url.includes('/apk/') &&
                        !event.request.url.includes('/config/'))
                    {
                        console.log('Fetched and Cached: ' + event.request.url);
                        cache.put(event.request, res.clone());
                    }
                    return res;
                })
            );
        })
    );
})
