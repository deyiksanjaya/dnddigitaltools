const CACHE_NAME = 'dnd-dashboard-v2'; // Versi cache diperbarui untuk memicu pembaruan

const urlsToCache = [

  // Aset Inti Aplikasi

  './',

  './index.html',

  './manifest.json',

  

  // Ikon (sesuaikan dengan path di manifest.json)

  './icons/icon-192x192.png',

  './icons/icon-512x512.png',


  // Aset Eksternal (CDN)

  'https://cdn.tailwindcss.com',

  'https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700&family=Roboto:wght@400;500&display=swap'

  // Google Fonts juga mengambil file font lain, tetapi caching URL CSS utama sudah sangat membantu

];


// Install a service worker

self.addEventListener('install', event => {

  event.waitUntil(

    caches.open(CACHE_NAME)

      .then(cache => {

        console.log('Opened cache and caching assets');

        return cache.addAll(urlsToCache);

      })

  );

});


// Cache and return requests

self.addEventListener('fetch', event => {

  event.respondWith(

    caches.match(event.request)

      .then(response => {

        // Cache hit - return response

        if (response) {

          return response;

        }

        // Jika tidak ada di cache, ambil dari jaringan

        return fetch(event.request).then(

          (networkResponse) => {

            // Periksa jika respons valid

            if(!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic' && networkResponse.type !== 'cors') {

              return networkResponse;

            }


            // Penting: Gandakan respons. Satu untuk browser, satu untuk cache.

            const responseToCache = networkResponse.clone();


            caches.open(CACHE_NAME)

              .then(cache => {

                // Hanya cache request GET

                if(event.request.method === 'GET') {

                    cache.put(event.request, responseToCache);

                }

              });


            return networkResponse;

          }

        );

      }

    )

  );

});



// Update a service worker

self.addEventListener('activate', event => {

  const cacheWhitelist = [CACHE_NAME]; // Hanya simpan cache dengan nama saat ini

  event.waitUntil(

    caches.keys().then(cacheNames => {

      return Promise.all(

        cacheNames.map(cacheName => {

          if (cacheWhitelist.indexOf(cacheName) === -1) {

            console.log('Deleting old cache:', cacheName);

            return caches.delete(cacheName);

          }

        })

      );

    })

  );

});
