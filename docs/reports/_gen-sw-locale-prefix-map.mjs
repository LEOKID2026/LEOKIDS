/**
 * One-shot helper: generate LOCALE_PUBLIC_PATH_PREFIX map for public/sw.js
 * from locale-registry authority. Run: node docs/reports/_gen-sw-locale-prefix-map.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  LOCALE_REGISTRY,
  getPublicLocalePathPrefix,
  DEFAULT_LOCALE,
} from "../../lib/i18n/locale-registry.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "../..");
const SW_PATH = path.join(ROOT, "public/sw.js");

const entries = [];
for (const [id, def] of Object.entries(LOCALE_REGISTRY)) {
  if (!def?.enabled) continue;
  if (id === "en" || id === DEFAULT_LOCALE) continue;
  const prefix = getPublicLocalePathPrefix(id);
  if (!prefix) continue;
  entries.push([id, prefix]);
}
entries.sort((a, b) => a[0].localeCompare(b[0]));

const mapLines = entries.map(([id, prefix]) => `  "${id}": "${prefix}",`).join("\n");
const mapBlock = `/**
 * localeId → public URL path segment (mirrors locale-registry pathPrefix).
 * Service Worker cannot import the registry; keep in parity via sw-offline tests.
 */
const LOCALE_PUBLIC_PATH_PREFIX = {
${mapLines}
};

/** @param {string} localeId */
function offlineFallbackPath(localeId) {
  const loc = String(localeId || "en").trim();
  if (!loc || loc === "en") return "/offline";
  const prefix = LOCALE_PUBLIC_PATH_PREFIX[loc] || loc;
  return \`/\${prefix}/offline\`;
}
`;

let src = fs.readFileSync(SW_PATH, "utf8");
const start = src.indexOf("/** @param {string} localeId */\nfunction offlineFallbackPath");
const end = src.indexOf(
  "\n/**\n * Arabic UI locales use RTL inline offline chrome."
);
if (start < 0 || end < 0) {
  throw new Error("Could not locate offlineFallbackPath block in public/sw.js");
}
src = src.slice(0, start) + mapBlock + src.slice(end);
fs.writeFileSync(SW_PATH, src, "utf8");
console.log(`Updated public/sw.js with ${entries.length} public path prefixes`);
