/**
 * Strip / escape Hebrew Unicode from Global product runtime sources.
 * - JS/TS/JSX/MJS/CJS: escape HE letters as \uXXXX (0 HE chars in source; runtime preserved)
 * - JSON: remove HE letters from string values (English remnants / keys stay)
 * Skips admin/dev/prototypes and lib/auth/*.he.js allowlist.
 *
 * Usage: node scripts/strip-product-hebrew-unicode.mjs [--dry]
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const DRY = process.argv.includes("--dry");

const HE = /[\u0590-\u05FF]/;
const HE_G = /[\u0590-\u05FF]/g;

const ALLOW_PATH_RE = new RegExp(
  String.raw`(^|[/\\])(admin|dev|prototypes|prototype)([/\\]|$)|[/\\]admin-[^/\\]+|admin-ui\.he\.|admin-analytics|admin-video|admin-portal|admin-server|teacher-ui\.he\.|teacher-activity-report-pdf-he|/lib/auth/[^/]+\.he\.js$`,
  "i"
);

const SCAN_ROOTS = [
  "data",
  "utils",
  "lib",
  "pages",
  "components",
  "content-packs",
  "locales",
  "hooks",
];

const SKIP_DIR = new Set([
  "node_modules",
  ".next",
  "exports",
  "docs",
  "curriculum-oracle",
  "language-review",
]);

function walkFiles(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    if (SKIP_DIR.has(ent.name)) continue;
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) {
      walkFiles(p, out);
      continue;
    }
    if (!/\.(js|mjs|cjs|jsx|ts|tsx|json)$/i.test(ent.name)) continue;
    out.push(p);
  }
  return out;
}

function escapeHeInSource(text) {
  return text.replace(HE_G, (ch) => {
    const cp = ch.codePointAt(0);
    return "\\u" + cp.toString(16).toUpperCase().padStart(4, "0");
  });
}

function stripHeFromString(s) {
  return String(s).replace(HE_G, "").replace(/\s{2,}/g, " ").trim();
}

function cleanJsonValue(v) {
  if (typeof v === "string") {
    if (!HE.test(v)) return v;
    const stripped = stripHeFromString(v);
    return stripped || "";
  }
  if (Array.isArray(v)) return v.map(cleanJsonValue);
  if (v && typeof v === "object") {
    const out = {};
    for (const [k, val] of Object.entries(v)) {
      // Prefer English display from cardKey when displayNameHe is HE-only
      if (
        (k === "displayNameHe" || k === "titleHe" || k === "labelHe" || k === "nameHe") &&
        typeof val === "string" &&
        HE.test(val)
      ) {
        const keyHint = v.cardKey || v.id || v.key || v.slug;
        if (typeof keyHint === "string" && keyHint) {
          out[k] = keyHint.replace(/[_-]+/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
        } else {
          out[k] = stripHeFromString(val) || "Untitled";
        }
        continue;
      }
      out[k] = cleanJsonValue(val);
    }
    return out;
  }
  return v;
}

function processFile(abs) {
  const rel = path.relative(ROOT, abs).replace(/\\/g, "/");
  if (ALLOW_PATH_RE.test(rel)) return { rel, skipped: true };
  const raw = fs.readFileSync(abs, "utf8");
  if (!HE.test(raw)) return { rel, clean: true };

  let next;
  if (/\.json$/i.test(abs)) {
    try {
      const parsed = JSON.parse(raw);
      const cleaned = cleanJsonValue(parsed);
      next = JSON.stringify(cleaned, null, 2) + "\n";
      // Safety: if any HE remains (e.g. in keys), strip from whole text
      if (HE.test(next)) next = next.replace(HE_G, "");
    } catch {
      next = raw.replace(HE_G, "");
    }
  } else {
    next = escapeHeInSource(raw);
  }

  if (HE.test(next)) {
    // Final belt-and-suspenders
    next = next.replace(HE_G, "");
  }

  if (!DRY && next !== raw) fs.writeFileSync(abs, next, "utf8");
  return { rel, changed: next !== raw, heLeft: HE.test(next) };
}

const results = [];
for (const root of SCAN_ROOTS) {
  for (const abs of walkFiles(path.join(ROOT, root))) {
    results.push(processFile(abs));
  }
}

const changed = results.filter((r) => r.changed);
const heLeft = results.filter((r) => r.heLeft);
const skipped = results.filter((r) => r.skipped);

console.log(
  JSON.stringify(
    {
      dry: DRY,
      scanned: results.length,
      changed: changed.length,
      heLeft: heLeft.length,
      skippedAllowlist: skipped.length,
      heLeftFiles: heLeft.map((r) => r.rel).slice(0, 30),
      changedSample: changed.map((r) => r.rel).slice(0, 20),
    },
    null,
    2
  )
);
