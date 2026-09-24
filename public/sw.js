/* iKAN service worker: keeps the app opening offline, and shows notifications when installed.
 *
 * Pages come from the network first and are kept as they load, so a page you have opened before
 * opens again with no connection - the mood journal is filled first thing in the morning, often
 * with no signal, and that has to work. Built files under /assets/ are content-hashed, so they
 * are cached on first sight and served from there forever.
 *
 * Offline pages are served by their OWN url. The app is server-rendered, so handing /journal the
 * document for / would hydrate the wrong route; a url we have never cached falls back to the
 * offline page instead of guessing. */

const VERSION = "ikan-v2";

/* Fetched once at install so the common routes work offline from the first run, not just after
 * the user happens to visit them. Failures here are fine - install must not depend on the
 * network, and the routes cache themselves on the first real visit anyway. */
const ROUTES = ["/", "/journal", "/program", "/assessments", "/resources"];
const SHELL = ["/offline.html", "/favicon.svg", "/pwa-192x192.png", "/manifest.webmanifest"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(VERSION).then(async (c) => {
      await c.addAll(SHELL);
      await Promise.allSettled(ROUTES.map((r) => c.add(new Request(r, { cache: "reload" }))));
    }),
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== VERSION).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

/** The cache key for a page: the path only, so ?category=sleep doesn't store a separate copy. */
const pageKey = (url) => new Request(new URL(url).pathname);

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return; // sign-in, data and APIs are never cached

  if (req.mode === "navigate") {
    event.respondWith(
      fetch(req)
        .then((res) => {
          // Only a real page is worth keeping - a redirect to /login or an error page would
          // otherwise become what this route shows offline.
          if (res.ok && !res.redirected) {
            const copy = res.clone();
            caches.open(VERSION).then((c) => c.put(pageKey(req.url), copy));
          }
          return res;
        })
        .catch(async () => (await caches.match(pageKey(req.url))) ?? caches.match("/offline.html")),
    );
    return;
  }
  if (url.pathname.startsWith("/assets/") || SHELL.includes(url.pathname)) {
    event.respondWith(
      caches.match(req).then(
        (hit) =>
          hit ||
          fetch(req).then((res) => {
            if (res.ok) {
              const copy = res.clone();
              caches.open(VERSION).then((c) => c.put(req, copy));
            }
            return res;
          }),
      ),
    );
  }
});

/* Server-sent pushes (once a push service is connected): { title, body, url } */
self.addEventListener("push", (event) => {
  let data = { title: "iKAN", body: "", url: "/" };
  try {
    data = { ...data, ...event.data.json() };
  } catch {
    if (event.data) data.body = event.data.text();
  }
  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: "/pwa-192x192.png",
      badge: "/pwa-64x64.png",
      data: { url: data.url },
    }),
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url = (event.notification.data && event.notification.data.url) || "/";
  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((wins) => {
      const open = wins.find((w) => new URL(w.url).origin === self.location.origin);
      if (open) {
        open.navigate(url);
        return open.focus();
      }
      return self.clients.openWindow(url);
    }),
  );
});
