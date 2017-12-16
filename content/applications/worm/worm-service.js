// Frank Poth 12/01/2017

self.addEventListener("activate",  function(event) {

  event.waitUntil(self.clients.claim().then(function() {

    self.skipWaiting();

  }));

});

self.addEventListener("fetch", function(event) {

  event.respondWith(caches.match(event.request).then(function(response) {

    if (response && response.ok) {

      return response;

    }

  }));

});

self.addEventListener("install", function(event) {

  event.waitUntil(caches.open("worm").then(function(cache) {

    return cache.addAll([ "/", "worm.html", "worm.js"]).then(function() {

      self.skipWaiting();

    });

  }));

});
