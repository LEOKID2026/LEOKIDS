// Minimal service worker for LEO KIDS teacher PWA (scope /teacher/ only).
// Cache names use lk-global- prefix (aligned with public/student/sw.js).

const CACHE_NAME = "lk-global-teacher-v1";
const CACHE_PREFIX = "lk-global-teacher-";

self.addEventListener("install", (event) => {
  event.waitUntil(self.skipWaiting());
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(
        keys
          .filter((k) => k.startsWith(CACHE_PREFIX) && k !== CACHE_NAME)
          .map((k) => caches.delete(k))
      );
      await self.clients.claim();
    })()
  );
});

self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;
  if (
    url.pathname.endsWith(".webmanifest") ||
    url.pathname === "/manifest.json" ||
    url.pathname === "/manifest-teacher.webmanifest"
  ) {
    return;
  }
});
