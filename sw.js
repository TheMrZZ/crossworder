importScripts('./cache-polyfill.js')

self.addEventListener('install', function (e) {
  e.waitUntil(
    caches.open('main').then(function (cache) {
      return cache.addAll([
        '/',
        '/index.html',
        '/dist/app.bundle.js',
        '/dist/camera.svg',
        '/dist/trash.svg',
      ])
    }).catch(error => {
      console.error('Error caught |', error)
    }),
  )
})

self.addEventListener('fetch', function (event) {
  event.respondWith(
    caches.match(event.request).then(function (response) {
      return response || fetch(event.request)
    }),
  )
})