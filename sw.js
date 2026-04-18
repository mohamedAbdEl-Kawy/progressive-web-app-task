const cacheName = "ITI PWA Task 1";
const offlinePageUrl = "./pages/offline.html";
const notFoundPageUrl = "./pages/404.html";

const assets = [
    "./",
    "./index.html",
    "./css/styles.css",
    "./img/logo.jpg",
    "./js/script.js",
    "./pages/about.html",
    "./pages/offline.html",
    "./pages/404.html",
    "./manifest.json",
];

self.addEventListener("install", (installEvent) => {
    installEvent.waitUntil(
        caches
            .open(cacheName)
            .then((cache) => {
                console.log("Caching assets...");
                return cache.addAll(assets);
            })
            .then(() => {
                console.log("All files cached successfully!");
            })
            .catch((err) => {
                console.log(err);
            }),
    );
});

self.addEventListener("activate", (activateEvent) => {
    activateEvent.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(
                keys
                    .filter((key) => key !== cacheName)
                    .map((key) => {
                        return caches.delete(key);
                    }),
            );
        }),
    );
});

self.addEventListener("fetch", (fetchEvent) => {
    const request = fetchEvent.request;

    if (request.method !== "GET") return;

    if (request.mode === "navigate") {
        fetchEvent.respondWith(
            fetch(request)
                .then((response) => {
                    if (!response || response.status === 404) {
                        return caches.match(notFoundPageUrl);
                    }

                    const clonedResponse = response.clone();
                    caches.open(cacheName).then((cache) => {
                        cache.put(request, clonedResponse);
                    });

                    return response;
                })
                .catch(() => {
                    return caches.match(offlinePageUrl);
                }),
        );
        return;
    }

    fetchEvent.respondWith(
        caches.match(request).then((cachedResponse) => {
            if (cachedResponse) {
                return cachedResponse;
            }

            return fetch(request)
                .then((response) => {
                    if (!response || response.status === 404) {
                        return caches.match(notFoundPageUrl);
                    }
                    const clonedResponse = response.clone();
                    caches.open(cacheName).then((cache) => {
                        cache.put(request, clonedResponse);
                    });

                    return response;
                })
                .catch(() => {
                    return caches.match(notFoundPageUrl);
                });
        }),
    );
});
