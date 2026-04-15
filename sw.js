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

    if (request.method !== "GET") {
        return;
    }
    if (request.mode === "navigate") {
        fetchEvent.respondWith(
            caches.match(request).then((response) => {
                if (response) {
                    return response;
                }
                return fetch(request)
                    .then((fetchResponse) => {
                        if (fetchResponse && fetchResponse.status === 200) {
                            const clonedResponse = fetchResponse.clone();
                            caches.open(cacheName).then((cache) => {
                                cache.put(request, clonedResponse);
                            });
                        }
                        return fetchResponse;
                    })
                    .catch(() => {
                        return caches.match(offlinePageUrl);
                    });
            }),
        );
    } else {
        fetchEvent.respondWith(
            caches.match(request).then((response) => {
                return (
                    response ||
                    fetch(request)
                        .then((fetchResponse) => {
                            if (fetchResponse && fetchResponse.status === 200) {
                                const clonedResponse = fetchResponse.clone();
                                caches.open(cacheName).then((cache) => {
                                    cache.put(request, clonedResponse);
                                });
                            }
                            return fetchResponse;
                        })
                        .catch(() => {
                            return null;
                        })
                );
            }),
        );
    }
});


