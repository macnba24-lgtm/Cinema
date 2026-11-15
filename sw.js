// Service worker minimo: serve per rendere l'app installabile.
// Non salva niente in cache, i dati arrivano sempre da Firebase.
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", e => e.waitUntil(self.clients.claim()));
self.addEventListener("fetch", () => {});
