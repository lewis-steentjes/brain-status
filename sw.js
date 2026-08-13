// Service worker: cache the shell so the app opens with no network.
//
// It deliberately does NOT cache api.github.com. Repo data is private and
// per-user; caching it here would put it in a store the app can't reason
// about and can't clear when the token changes. Data caching lives in the
// page, in localStorage, where the offline fallback is explicit.

const VERSION = "brain-shell-v1";
const SHELL = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./icon-180.png",
  "./icon-512.png"
];

self.addEventListener("install", e => {
  e.waitUntil(
    caches.open(VERSION)
      // addAll is atomic — one missing icon would fail the whole install, so
      // add individually and tolerate gaps.
      .then(c => Promise.all(SHELL.map(u => c.add(u).catch(() => {}))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== VERSION).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", e => {
  const url = new URL(e.request.url);
  if (e.request.method !== "GET") return;
  if (url.origin !== self.location.origin) return;   // never touch the API

  // Network-first so a deploy is picked up promptly, cache as the fallback
  // that makes the app work on a plane.
  e.respondWith(
    fetch(e.request)
      .then(r => {
        const copy = r.clone();
        caches.open(VERSION).then(c => c.put(e.request, copy)).catch(() => {});
        return r;
      })
      .catch(() => caches.match(e.request).then(r => r || caches.match("./index.html")))
  );
});
