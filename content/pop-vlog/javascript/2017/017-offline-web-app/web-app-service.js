// Frank Poth 10/25/2017
// here's a great resource on service workers: https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API/Using_Service_Workers
// here's where I basically copy and pasted the code for this service worker: https://airhorner.com/sw.js

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

  event.waitUntil(caches.open("web-app").then(function(cache) {

    return cache.addAll([ "/", "manifest.json", "web-app.css", "web-app.html", "web-app.png"]).then(function() {

      self.skipWaiting();

    });

  }));

});
