// Frank Poth 10/25/2017
// here's a great resource on service workers: https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API/Using_Service_Workers
// here's where I basically copy and pasted the code for this service worker: https://airhorner.com/sw.js

self.addEventListener("install", function(event) {

  //console.log("Service Worker: handling install event...");

  event.waitUntil(caches.open("web-app").then(function(cache) {

    return cache.addAll([ "https://192.168.0.101:2468/", "https://192.168.0.101:2468/web-app.css", "https://192.168.0.101:2468/web-app.html", "https://192.168.0.101:2468/web-app.png"]).then(function() {

      //console.log("Service Worker cache installed!");
      self.skipWaiting();

    });

  }));

});

self.addEventListener("activate",  function(event) {

  //console.log("Service Worker: handling activate event...");

  event.waitUntil(self.clients.claim().then(function() {

    //console.log("Service Worker Activated!");

    self.skipWaiting();

  }));

});

self.addEventListener("fetch", function(event) {

  //console.log("Service Worker: handling fetch event...");

  event.respondWith(caches.match(event.request).then(function(response) {

    return response || fetch(event.request);

  }));

});
