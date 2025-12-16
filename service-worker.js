const CACHE_NAME = "checklist-rpas-v1.1.2";

const ASSETS = [
  "./",
  "./index.html",
  "./sobre.html",
  "./css/style.css",
  "./js/app.js",
  "./manifest.json",

  "./assets/icons/apple-touch-icon.png",
  "./assets/icons/icon-192.png",
  "./assets/icons/icon-512.png",
  "./assets/icons/icon-512-maskable.png",

  "./assets/logos/pcsc.png",
  "./assets/logos/saer.png",
  "./assets/logos/coarp.png",
  "./assets/logos/noarp.png"
];

/* Normaliza URL pra evitar duplicar cache com querystring (?v=123 etc.) */
function normalizeRequest(request) {
  try {
    const url = new URL(request.url);
    url.search = "";
    url.hash = "";
    return new Request(url.toString(), {
      method: request.method,
      headers: request.headers,
      mode: request.mode,
      credentials: request.credentials,
      redirect: request.redirect,
      referrer: request.referrer,
      referrerPolicy: request.referrerPolicy,
      integrity: request.integrity,
      cache: request.cache
    });
  } catch {
    return request;
  }
}

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.map((k) => (k !== CACHE_NAME ? caches.delete(k) : null)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;

  const url = new URL(req.url);

  // ✅ Só controla/cacha o que é do mesmo domínio (GitHub Pages)
  if (url.origin !== self.location.origin) return;

  // ✅ Evita cachear navegação “pura” fora do app (opcional, mas seguro)
  // (mantém cache de index.html via lista ASSETS)
  const normalizedReq = normalizeRequest(req);

  event.respondWith(
    caches.match(normalizedReq).then((cached) => {
      if (cached) return cached;

      return fetch(req).then((res) => {
        if (res && res.ok) {
          const copy = res.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(normalizedReq, copy));
        }
        return res;
      });
    })
  );
});
