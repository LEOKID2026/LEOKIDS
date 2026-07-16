#!/usr/bin/env node
/**
 * Re-apply Production Acceptance chrome fixes after .he stub recovery.
 */
import fs from "node:fs";

// SW v2 + scoped global cache cleanup + navigate network-first
let sw = fs.readFileSync("public/sw.js", "utf8");
sw = sw
  .replace(/lk-global-v1/g, "lk-global-v2")
  .replace(/lk-global-static-v1/g, "lk-global-static-v2")
  .replace(/lk-global-dynamic-v1/g, "lk-global-dynamic-v2");
if (!sw.includes("GLOBAL_CACHE_PREFIX")) {
  sw = sw.replace(
    "const DYNAMIC_CACHE = 'lk-global-dynamic-v2';",
    `const DYNAMIC_CACHE = 'lk-global-dynamic-v2';
const GLOBAL_CACHE_PREFIX = 'lk-global-';
const CURRENT_GLOBAL_CACHES = new Set([CACHE_NAME, STATIC_CACHE, DYNAMIC_CACHE]);`
  );
}
sw = sw.replace(
  /if \(cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE && cacheName !== CACHE_NAME\) \{\s*console\.log\('\[SW\] Deleting old cache:', cacheName\);\s*return caches\.delete\(cacheName\);\s*\}/,
  `if (!cacheName.startsWith(GLOBAL_CACHE_PREFIX)) {
            return undefined;
          }
          if (CURRENT_GLOBAL_CACHES.has(cacheName)) {
            return undefined;
          }
          console.log('[SW] Deleting old global cache:', cacheName);
          return caches.delete(cacheName);`
);
sw = sw.replace(
  /if \(request\.destination === 'document' && !url\.pathname\.startsWith\('\/_next'\)\)/,
  `if (
    (request.mode === 'navigate' || request.destination === 'document') &&
    !url.pathname.startsWith('/_next')
  )`
);
fs.writeFileSync("public/sw.js", sw);

for (const [file, from, to] of [
  ["public/student/sw.js", "lk-global-student-offline-v1", "lk-global-student-offline-v2"],
  ["public/parent/sw.js", "lk-global-parent-v1", "lk-global-parent-v2"],
  ["public/teacher/sw.js", "lk-global-teacher-v1", "lk-global-teacher-v2"],
]) {
  if (!fs.existsSync(file)) continue;
  let t = fs.readFileSync(file, "utf8");
  t = t.replaceAll(from, to);
  fs.writeFileSync(file, t);
}

console.log("SW versions bumped");
