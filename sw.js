// Tiene in memoria la grafica dell'app (pagina, icone, font, librerie Firebase)
// così si apre subito. I voti arrivano sempre aggiornati da Firebase.
const CACHE = "cinema-v2";
const SHELL = ["./", "index.html", "manifest.webmanifest"];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener("fetch", e => {
  const req = e.request;
  if(req.method !== "GET") return;
  const url = new URL(req.url);
  const ok = url.origin === location.origin || url.hostname === "www.gstatic.com" || url.hostname.endsWith("fonts.googleapis.com") || url.hostname === "fonts.gstatic.com";
  if(!ok || url.hostname.includes("firestore")) return;
  // Risponde subito dalla memoria e intanto scarica la versione nuova
  e.respondWith(caches.open(CACHE).then(async c => {
    const hit = await c.match(req);
    const net = fetch(req).then(res => { if(res && (res.ok || res.type === "opaque")) c.put(req, res.clone()); return res; }).catch(() => hit);
    return hit || net;
  }));
});
