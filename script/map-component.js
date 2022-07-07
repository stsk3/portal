document.write('<link rel="stylesheet" href="script/leaflet.css" />');

const MAP_ENABLED = "map-enabled";

var leafletMap;
var leafletMapStationMarkerMap = {};
var leafletMapGPSMarkerLayer;
const leafletMapMaxZoom = 17;
var currentPopupTitle;

var userLng = -1;
var userLat = -1;

//This function takes in latitude and longitude of two location and returns the distance between them as the crow flies (in km)
function calcCrow(lat2, lon2) {
    var lat1 = userLat;
    var lon1 = userLng;
    if (lat1 == -1 || lon1 == -1 || lat2 == -1 || lon2 == -1) {
        return -1;
    } else {
        var R = 6371; // km
        var dLat = toRad(lat2 - lat1);
        var dLon = toRad(lon2 - lon1);
        var lat1 = toRad(lat1);
        var lat2 = toRad(lat2);

        var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        var d = R * c; //KM
        var m = Math.round(d * 1000);
        return m;
    }
}


// Converts numeric degrees to radians
function toRad(Value) {
    return Value * Math.PI / 180;
}


//function that gets the location and returns it
function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else {
        console.log("Geo Location not supported by browser");
    }
}
//function that retrieves the position
function showPosition(position) {
    var location = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
    }
    console.log(location);
    userLat = location.latitude;
    userLng = location.longitude;
}

function initMap() {
    if (isShowMap()) {
        if (!leafletMap) {
            leafletMap = L.map('leaflet-map', {
                attributionControl: false,
                zoomControl: true,
                dragging: !L.Browser.mobile,
                tap: !L.Browser.mobile
            });
            //L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(leafletMap); //unlimited
            //L.tileLayer('https://tile.thunderforest.com/cycle/{z}/{x}/{y}.png?apikey=0942c800a2af4b9092eabaadb56bf511').addTo(leafletMap);
            //L.tileLayer('https://tile.thunderforest.com/transport/{z}/{x}/{y}.png?apikey=0942c800a2af4b9092eabaadb56bf511').addTo(leafletMap);
            L.tileLayer('https://tileserver.memomaps.de/tilegen/{z}/{x}/{y}.png').addTo(leafletMap); //unlimited

            leafletMap.createPane("gpsPane");
            leafletMap.getPane("gpsPane").style.zIndex = 610;

            leafletMap.locate({
                    setView: false,
                    enableHighAccuracy: false,
                    watch: true
                })
                .on('locationfound', function(data) {
                    //console.log(data);
                    const setView = Object.entries(leafletMapStationMarkerMap) == 0;
                    if (leafletMapGPSMarkerLayer) {
                        leafletMapGPSMarkerLayer.remove();
                    }
                    leafletMapGPSMarkerLayer = new L.marker(data.latlng, {
                        opacity: 0.75,
                        icon: L.icon({
                            iconSize: [20, 20],
                            iconUrl: "image/map-marker/gps.png"
                        }),
                        pane: "gpsPane"
                    }).addTo(leafletMap);
                    if (setView) {
                        setViewToGpsLocation();
                    }
                })
                .on('locationerror', function(e) {
                    console.log(e);
                    //alert("Location access has been denied.");
                    const setView = Object.entries(leafletMapStationMarkerMap) == 0;
                    if (setView) {
                        leafletMap.setView([22.3493, 114.1694], 10); //Default HK view
                    }
                });
        } else {
            clearMarkersFromMap();
            setViewToGpsLocation()
        }
        setMapVisibility(true);
    }
}

function destroyMap() {
    if (leafletMap) {
        leafletMap.off();
        leafletMap.remove();
        leafletMap = null;
        leafletMapStationMarkerMap = {};
        leafletMapGPSMarkerLayer = null;
    }
    setMapVisibility(false);
}

function setMapVisibility(isShow) {
    const leafletMap = $("#leaflet-map");
    if (isShowMap() && isShow)
        leafletMap.show();
    else
        leafletMap.hide();
}

function setViewToGpsLocation() {
    if (leafletMapGPSMarkerLayer) {
        leafletMap.setView(leafletMapGPSMarkerLayer._latlng, leafletMapMaxZoom);
    }
}

function resizeMap() {
    const element = $('#leaflet-map');
    const className = "enlarge";
    if (element.attr("class").includes(className)) {
        element.removeClass(className);
    } else {
        element.addClass(className);
    }
    leafletMap.invalidateSize();
}

function clearMarkersFromMap() {
    if (leafletMap) {
        for (const [key, value] of Object.entries(leafletMapStationMarkerMap)) {
            value.remove();
        }
        leafletMapStationMarkerMap = {};
        currentPopupTitle = null;
    }
}

// setup icon
const iconSize = [70, 70];
const iconAnchor = [iconSize[0]/2, iconSize[1]];
const popupAnchor = [0, -iconSize[1]+20];
// Random icon
const flowerIcon = L.icon({ iconSize: iconSize, iconAnchor: iconAnchor, popupAnchor: popupAnchor, iconUrl: "image/map-marker/flower.png" });
const flowerGroupIcon = L.icon({ iconSize: iconSize, iconAnchor: iconAnchor, popupAnchor: popupAnchor, iconUrl: "image/map-marker/flower_group.png" });
const goldIcon = L.icon({ iconSize: iconSize, iconAnchor: iconAnchor, popupAnchor: popupAnchor, iconUrl: "image/map-marker/gold.png" });
const grassIcon = L.icon({ iconSize: iconSize, iconAnchor: iconAnchor, popupAnchor: popupAnchor, iconUrl: "image/map-marker/grass.png" });
const mushroomIcon = L.icon({ iconSize: iconSize, iconAnchor: iconAnchor, popupAnchor: popupAnchor, iconUrl: "image/map-marker/mushroom.png" });
const peachIcon = L.icon({ iconSize: iconSize, iconAnchor: iconAnchor, popupAnchor: popupAnchor, iconUrl: "image/map-marker/peach.png" });
const randomIconGroup = [flowerIcon, flowerGroupIcon, goldIcon, grassIcon, mushroomIcon, peachIcon];
// Specific icon
const farmIcon = L.icon({ iconSize: iconSize, iconAnchor: iconAnchor, popupAnchor: popupAnchor, iconUrl: "image/map-marker/farm.png" });
const cockroachIcon = L.icon({ iconSize: iconSize, iconAnchor: iconAnchor, popupAnchor: popupAnchor, iconUrl: "image/map-marker/cockroach.png" });
const cowIcon = L.icon({ iconSize: iconSize, iconAnchor: iconAnchor, popupAnchor: popupAnchor, iconUrl: "image/map-marker/cow.png" });
const pepeachristskyIcon = L.icon({ iconSize: iconSize, iconAnchor: iconAnchor, popupAnchor: popupAnchor, iconUrl: "image/map-marker/pepeachristsky.png" });
const pepeachristskyLoveIcon = L.icon({ iconSize: iconSize, iconAnchor: iconAnchor, popupAnchor: popupAnchor, iconUrl: "image/map-marker/pepeachristsky_love.png" });
const shinchanIcon = L.icon({ iconSize: iconSize, iconAnchor: iconAnchor, popupAnchor: popupAnchor, iconUrl: "image/map-marker/shinchan.png" });
const snoopyBlueIcon = L.icon({ iconSize: iconSize, iconAnchor: iconAnchor, popupAnchor: popupAnchor, iconUrl: "image/map-marker/snoopy_blue.png" });
const snoopyYellowIcon = L.icon({ iconSize: iconSize, iconAnchor: iconAnchor, popupAnchor: popupAnchor, iconUrl: "image/map-marker/snoopy_yellow.png" });
// Birthday icon
const birthday2020Icon = L.icon({ iconSize: iconSize, iconAnchor: iconAnchor, popupAnchor: popupAnchor, iconUrl: "image/map-marker/birthday_2020.png" });
const birthday2021Icon = L.icon({ iconSize: iconSize, iconAnchor: iconAnchor, popupAnchor: popupAnchor, iconUrl: "image/map-marker/birthday_2021.png" });
const birthdayIconGroup = [birthday2020Icon, birthday2021Icon];
function getMarkerIcon(lat, lng, title) {
    var dateObj = new Date();
    var month = dateObj.getMonth() + 1; //months from 1-12
    var day = dateObj.getDate();
    if (month == 1 && day == 31 || month == 9 && day == 25) {
        return birthdayIconGroup[Math.floor(Math.random() * birthdayIconGroup.length)];
    } else if (title.includes("農場") || title.includes("濕地") || title.includes("海洋")) {
        return farmIcon;
    } else if (title.includes("警署")) {
        return cockroachIcon;
    } else if (lat > 22.336580 && lat < 22.338074 && lng > 114.144197 && lng < 114.149740) {
        return cowIcon;
    } else if (lat > 22.336964 && lat < 22.363622 && lng > 114.095672 && lng < 114.112284) {
        return pepeachristskyIcon;
    } else if (lat > 22.499862 && lat < 22.506404 && lng > 114.124999 && lng < 114.133139) {
        return pepeachristskyLoveIcon;
    } else if (lat > 22.378108 && lat < 22.382899 && lng > 114.184857 && lng < 114.190576 ||
        lat > 22.337514 && lat < 22.340208 && lng > 114.150742 && lng < 114.153199 ||
        lat > 22.293074 && lat < 22.298610 && lng > 114.167096 && lng < 114.170694 ||
        lat > 22.316337 && lat < 22.317684 && lng > 114.265320 && lng < 114.267037 ||
        lat > 22.503357 && lat < 22.504148 && lng > 114.132813 && lng < 114.134248 ||
        lat > 22.320862 && lat < 22.325913 && lng > 114.254699 && lng < 114.262062) {
        return shinchanIcon;
    } else if (lat > 22.444000 && lat < 22.446200 && lng > 114.022155 && lng < 114.026000) {
        return snoopyBlueIcon;
    } else if (title.includes("太和")) {
        return snoopyYellowIcon;
    }
    return randomIconGroup[lat.toString().slice(-1) % randomIconGroup.length];
}

function addMarkersToMap(points) {
    if (isShowMap()) {
        // clear previous markers
        clearMarkersFromMap();

        // adding all markers to the featureGroups array
        let featureGroups = [];
        for (let i = 0; i < points.length; i++) {
            const [lat, lng, title] = points[i]; //
            var popup = L.popup({
                closeOnClick: false,
              }).setContent(title);
            const marker = L.marker([lat, lng], {
                opacity: 1.0,
                icon: getMarkerIcon(lat, lng, title)
            }).bindPopup(popup);
            leafletMapStationMarkerMap[title] = marker;
            featureGroups.push(marker);
        }

        // adding all markers to the map
        for (let i = 0; i < featureGroups.length; i++) {
            featureGroups[i].addTo(leafletMap);
        }

        // Extended `LayerGroup` that makes it easy to do the same for all layers of its members
        const group = new L.featureGroup(featureGroups);

        // method fitBounds sets a map view that contains the given geographical bounds
        leafletMap.fitBounds(group.getBounds(), {
            padding: [20, 20], // adding padding to map
            maxZoom: leafletMapMaxZoom
        });
    }
}

function selectMarker(title) {
    if (isShowMap()) {
        const marker = leafletMapStationMarkerMap[title];
        if (marker) {
            leafletMap.closePopup();
            currentPopupTitle = title;
            marker.openPopup();
            leafletMap.setView(marker._latlng, leafletMapMaxZoom);
        }
    }
}

function popupPrevNextMarker(isNext) {
    if (isShowMap()) {
        const markerArray = Object.keys(leafletMapStationMarkerMap);
        const markerArrayLength = markerArray.length;
        if (markerArrayLength > 0) {
            const currentPopupIndex = markerArray.indexOf(currentPopupTitle);
            const futurePopupIndex = isNext ? 
                (currentPopupIndex + 1) != markerArrayLength ? (currentPopupIndex + 1) : 0 :
                (currentPopupIndex - 1) < 0 ? markerArrayLength - 1 : (currentPopupIndex - 1)
            selectMarker(markerArray[futurePopupIndex]);
        }
    }
}

function mapCheckboxChanged(event) {
    const isChecked = event.target.checked;
    localStorage.setItem(MAP_ENABLED, isChecked);
    if (isChecked)
        initMap();
    else
        destroyMap();
}

function isShowMap() {
    return $("#mapSwitch").prop("checked");
}


$(document).ready(function () {
    getLocation();
    $("#mapSwitch").prop("checked", localStorage.getItem(MAP_ENABLED) === 'true');
});