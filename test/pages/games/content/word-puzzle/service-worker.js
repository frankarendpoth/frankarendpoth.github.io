const CACHE_NAME     = "word-puzzle-4";
const FILES_TO_CACHE = ["manifest.webmanifest", "word-puzzle.css", "word-puzzle.html", "word-puzzle.js", "zilla-slab-font/ZillaSlab-Regular.ttf"];

self.addEventListener("activate", event => {

  event.waitUntil(clients.claim().then(() => {

    caches.keys().then(keys => Promise.all(keys.map(key => {

      if (CACHE_NAME !== key) {
    
        return caches.delete(key);
  
      }
  
    })));

  }));

});

self.addEventListener("fetch", event => {

  event.respondWith(caches.open(CACHE_NAME).then(cache => {

    return cache.match(event.request).then( response => {

      if (response) {
          
        return response;

      }

      return fetch(event.request).then(network_response => {

        if (network_response) cache.put(event.request, network_response.clone());

        return network_response;

      }).catch(error => {

        throw error;

      });

    });

  }));

});

self.addEventListener("install", event => {

  self.skipWaiting();

  event.waitUntil(caches.open(CACHE_NAME).then(cache => {

    return cache.addAll(FILES_TO_CACHE);

  }));

});
