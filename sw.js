//sw.js
const cacheName = "ITI PWA Task 1";
const offlinePageUrl = "./pages/offline.html";
const notFoundPageUrl = "./pages/404.html";

const assets = [
    "./",
    "./index.html",
    "./css/styles.css",
    "./img/logo.jpg",
    "./js/script.js",
    "./js/app.js",
    "./idb.js",
    "./pages/about.html",
    "./pages/offline.html",
    "./pages/404.html",
    "./pages/todo.html",
    "./manifest.json",
];

self.addEventListener("install", (installEvent) => {
    self.skipWaiting();
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
            ).then(() => self.clients.claim());
        }),
    );
});

self.addEventListener("notificationclick", (event) => {
    const action = event.action;
    const taskId = event.notification.data.taskId;
    const taskName = event.notification.data.taskName;

    event.notification.close();

    if (action === "complete") {
        self.clients.matchAll().then((clients) => {
            clients.forEach((client) => {
                client.postMessage({ type: "completeTask", taskId, taskName });
            });
        });
    }

    event.waitUntil(
        self.clients.matchAll({ type: "window" }).then((clientList) => {
            for (let i = 0; i < clientList.length; i++) {
                const client = clientList[i];
                if (client.url.includes("todo.html") && "focus" in client) {
                    return client.focus();
                }
            }
            if (self.clients.openWindow) {
                return self.clients.openWindow("./pages/todo.html");
            }
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

self.addEventListener("message", (event) => {
    if (event.data && event.data.type === "taskReminder") {
        const { taskName } = event.data;

        self.registration.showNotification("Task Reminder", {
            body: `Task '${taskName}' is due soon!`,
            icon: "img/notification-icon.png",
        });
    }
});
