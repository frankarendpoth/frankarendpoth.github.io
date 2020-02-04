const CACHE_NAME     = "word-puzzle-1";
const FILES_TO_CACHE = ["manifest.webmanifest", "word-puzzle.css", "word-puzzle.html", "word-puzzle.js"];

self.addEventListener("activate", event => {

  console.log("Service Worker Activate Initiated");

  event.waitUntil(caches.keys().then(keys => Promise.all(keys.map(key => {

    console.log("Service Worker Activate: current: " + CACHE_NAME + ", found: " + key);

    if (CACHE_NAME !== key) {

      console.log("Deleting old cache: " + key);

      return caches.delete(key);

    }

  }))));

});

self.addEventListener("fetch", event => {

  console.log("Service Worker Fetch Initiated");

  event.respondWith(caches.open(CACHE_NAME).then(cache => {

    console.log("Service Worker Fetch: fetch " + event.request.url);

    return cache.match(event.request).then( response => {

      if (response) {
          
        console.log("Service Worker Fetch: response: " + response.url);

        return response;

      }

      return fetch(event.request).then(network_response => {

        console.log("Service Worker Fetch: response (network): " + network_response.url);

        if (network_response) cache.put(event.request, network_response.clone());

        return network_response;

      }).catch(error => {

        console.log("Service Worker Fetch: could not find " + event.request.url + " over network");

        throw error;

      });

    });

  }));

});

self.addEventListener("install", event => {

  self.skipWaiting();

  console.log("Service Worker Install Initiated");

  event.waitUntil(caches.open(CACHE_NAME).then(cache => {

    console.log("Service Worker Install: opening cache: " + CACHE_NAME);
    console.log("Service Worker Install: caching: " + FILES_TO_CACHE);

    return cache.addAll(FILES_TO_CACHE);

  }));

});
