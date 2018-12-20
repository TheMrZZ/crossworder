importScripts('/cache-polyfill.js');

self.addEventListener('install', function (e) {
    e.waitUntil(
        caches.open('main').then(function (cache) {
            return cache.addAll([
                '/',
                '/dist/app.bundle.js',
                '/index.html',
                '/dist/camera.svg',
                '/dist/trash.svg',
            ]);
        }).catch(error => {
            console.error('Error caught |', error);
        }),
    );
});

self.addEventListener('fetch', function (event) {
    console.log(event.request.url);
    event.respondWith(
        caches.match(event.request).then(function (response) {
            return response || fetch(event.request);
        }),
    );
});