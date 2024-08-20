// v1 
"use strict"; self.oninstall = (ev) => { ev.waitUntil(caches.open('e-racun').then((cache) => cache.addAll(['/', 'main.js']))); }; self.onfetch = (ev) => { ev.respondWith(caches.match(ev.request).then((cachedResponse) => { if (cachedResponse) { return cachedResponse; }  return fetch(ev.request); }) ); };
