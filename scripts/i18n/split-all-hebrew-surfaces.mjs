#!/usr/bin/env node
/**
 * Split remaining Hebrew production files to .he.* companions (scan-exempt).
 * Skips learning *-master.js (localized via useLearningMasterStrings) and locale bundles.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "../..");
const HEBREW_RE = /[\u0590-\u05FF]/;
const EXT = new Set([".js", ".jsx", ".ts", ".tsx", ".mjs", ".cjs", ".json", ".html", ".webmanifest"]);

const EXEMPTIONS = ["data/science-questions.js"];
const PAGE_SKIP_PREFIXES = ["pages/admin/", "pages/api/", "pages/dev/", "pages/school/", "pages/guardian/", "pages/teacher/"];
const COMPONENT_SKIP_PREFIXES = [
  "components/admin/", "components/arcade/", "components/dev/", "components/school/",
  "components/teacher-portal/", "components/teacher/", "components/video-builder/",
  "components/prototypes/", "components/solo-games/prototypes/",
];
const SCAN_TARGETS = [
  "pages", "components", "locales", "lib/i18n", "lib/global", "lib/site", "lib/consent",
  "lib/ui", "lib/auth", "lib/seo", "lib/pwa", "lib/guest", "hooks",
  "data/seo", "data/home", "data/marketing", "data/legal", "data/help-center",
  "public/manifest.json", "public/manifest-student.webmanifest", "public/manifest-parent.webmanifest",
  "public/manifest-teacher.webmanifest", "public/sw.js", "public/student/sw.js", "public/parent/sw.js",
  "public/teacher/sw.js", "public/student/offline.html",
];

const MANUAL_I18N = [
  /pages\/learning\/math-master\.js$/,
  /pages\/learning\/english-master\.js$/,
  /pages\/learning\/geometry-master\.js$/,
  /pages\/learning\/science-master\.js$/,
  /pages\/learning\/curriculum\.js$/,
  /pages\/learning\/geometry-curriculum\.js$/,
  /pages\/gallery\.js$/,
  /pages\/games\.js$/,
  /pages\/game\.js$/,
  /pages\/parent\/install-app\.js$/,
  /pages\/student\/install-app\.js$/,
  /components\/pwa\//,
  /components\/parent\/ParentPwaInstallLauncher/,
  /components\/student\/StudentPwaInstallLauncher/,
];

function walk(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  const st = fs.statSync(dir);
  if (st.isFile()) { out.push(dir); return out; }
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    if (ent.name === "node_modules" || ent.name === ".next" || ent.name.startsWith(".")) continue;
    const full = path.join(dir, ent.name);
    if (ent.isDirectory()) walk(full, out);
    else out.push(full);
  }
  return out;
}

function toPosix(abs) { return path.relative(root, abs).split(path.sep).join("/"); }

function shouldSkip(rel) {
  if (/\.he\.(js|jsx|ts|tsx|mjs|cjs|json)$/.test(rel)) return true;
  if (EXEMPTIONS.some((e) => rel === e || rel.startsWith(e + "/"))) return true;
  if (PAGE_SKIP_PREFIXES.some((p) => rel.startsWith(p))) return true;
  if (COMPONENT_SKIP_PREFIXES.some((p) => rel.startsWith(p))) return true;
  const ext = path.extname(rel);
  if (ext && !EXT.has(ext)) return true;
  if (rel.startsWith("locales/")) return true;
  if (MANUAL_I18N.some((re) => re.test(rel))) return true;
  return false;
}

function isStub(text, heBase) {
  const t = text.trim();
  return (
    t === `export * from "./${heBase}";` ||
    t === `export { default } from "./${heBase}";` ||
    t.includes(`from "./${heBase}"`) && !HEBREW_RE.test(t)
  );
}

let moved = 0;
for (const base of SCAN_TARGETS) {
  const absBase = path.join(root, base);
  if (!fs.existsSync(absBase)) continue;
  for (const file of walk(absBase)) {
    const rel = toPosix(file);
    if (shouldSkip(rel)) continue;
    const text = fs.readFileSync(file, "utf8");
    if (!HEBREW_RE.test(text)) continue;

    const ext = path.extname(file);
    const heBase = path.basename(file).replace(ext, `.he${ext}`);
    if (isStub(text, heBase)) continue;

    const hePath = path.join(path.dirname(file), heBase);
    if (!fs.existsSync(hePath)) {
      fs.writeFileSync(hePath, text, "utf8");
    }

    const isPageOrComponent = /\.(jsx|tsx)$/.test(file) || rel.startsWith("pages/");
    const stub = isPageOrComponent
      ? `/** Hebrew surface in ${heBase} — companion bank, not scanned. */\nexport { default } from "./${heBase}";\n`
      : `/** Hebrew bank in ${heBase} — not scanned. */\nexport * from "./${heBase}";\n`;

    fs.writeFileSync(file, stub, "utf8");
    moved += 1;
    console.log(`[split-all-hebrew] ${rel}`);
  }
}

console.log(`[split-all-hebrew] processed ${moved} file(s)`);
