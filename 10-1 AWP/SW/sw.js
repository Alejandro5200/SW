const CACHE_NAME = "mi-app-cache-v1";

const urlsToCache = [
    "./",
    "./index.html",
    "./styles.css", 
    "./app.js",
    "./logo.png"
];

// Evento de instalación
self.addEventListener("install", (event) => {
    console.log("SW: Instalando...");

    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log("SW: Cacheando archivos...");
                return cache.addAll(urlsToCache);
            })
            .then(() => {
                console.log("SW: Todos los recursos cacheados correctamente");
                return self.skipWaiting(); // ✅ Mejor práctica
            })
            .catch((error) => {
                console.error("SW: Error al cachear archivos:", error);
            })
    );
});

// Evento de activación
self.addEventListener("activate", (event) => {
    console.log("SW: Activado");

    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cache) => {
                    if (cache !== CACHE_NAME) {
                        console.log("SW: Eliminando caché vieja:", cache);
                        return caches.delete(cache);
                    }
                })
            );
        }).then(() => {
            console.log("SW: Listo para controlar clientes");
            return self.clients.claim(); // ✅ Mejor práctica
        })
    );
});

// Evento fetch
self.addEventListener("fetch", (event) => {
    // Solo interceptar peticiones GET
    if (event.request.method !== 'GET') return;
    
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                // Si está en caché, devolverlo
                if (response) {
                    return response;
                }

                // Si no está en caché, hacer petición a red
                return fetch(event.request)
                    .then((networkResponse) => {
                        // Opcional: guardar en caché para próximas veces
                        if (networkResponse && networkResponse.status === 200) {
                            const responseToCache = networkResponse.clone();
                            caches.open(CACHE_NAME)
                                .then((cache) => {
                                    cache.put(event.request, responseToCache);
                                });
                        }
                        return networkResponse;
                    })
                    .catch((error) => {
                        console.error("SW: Error al obtener recurso:", error);
                        // Puedes devolver una página offline personalizada
                        // return caches.match('./offline.html');
                    });
            })
    );
});