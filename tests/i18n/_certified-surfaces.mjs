/**
 * Shared certified Global launch surfaces (aligned with scripts/i18n/check-hebrew-runtime-scan.mjs).
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const repoRoot = path.resolve(__dirname, "../..");

const EXT = new Set([".js", ".jsx", ".ts", ".tsx", ".mjs", ".cjs", ".html", ".json", ".webmanifest"]);

export const CERTIFIED_FILES = [
  "pages/_app.js",
  "pages/_document.js",
  "pages/404.js",
  "pages/500.js",
  "pages/index.js",
  "pages/kids.js",
  "pages/parents.js",
  "pages/teachers.js",
  "pages/about.js",
  "pages/contact.js",
  "pages/parent/login.js",
  "pages/student/login.js",
  "pages/learning/index.js",
  "pages/learning/curriculum.js",
  "pages/parent/dashboard.js",
  "pages/student/home.js",
  "components/InstallAppChoiceButton.js",
  "components/ui/CopyConfirmPopup.jsx",
  "components/Layout.js",
  "components/layout/SiteLegalFooterBar.jsx",
  "lib/site/public-page-seo.js",
  "lib/site/public-site-origin.client.js",
  "public/sw.js",
  "public/student/offline.html",
];

export const CERTIFIED_DIRS = [
  "pages/help",
  "pages/guides",
  "pages/practice",
  "pages/auth",
  "components/consent",
  "locales/en",
  "lib/i18n",
  "lib/global",
];

/** Surfaces that must route user-visible copy through t() keys (narrower than full certified list). */
export const I18N_KEY_FIRST_ROOTS = [
  "pages/404.js",
  "pages/500.js",
  "pages/auth",
  "components/consent",
  "pages/teacher/install-app.js",
  "pages/learning/index.js",
];

function walk(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  const st = fs.statSync(dir);
  if (st.isFile()) {
    out.push(dir);
    return out;
  }
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    if (ent.name === "node_modules" || ent.name === ".next" || ent.name.startsWith(".")) continue;
    walk(path.join(dir, ent.name), out);
  }
  return out;
}

export function toPosix(abs) {
  return path.relative(repoRoot, abs).split(path.sep).join("/");
}

function isHebrewCompanion(rel) {
  return /\.he\.(js|jsx|ts|tsx|mjs|cjs|json)$/.test(rel);
}

function isScannableFile(rel) {
  const ext = path.extname(rel);
  return !ext || EXT.has(ext);
}

export function collectCertifiedFiles() {
  const files = new Set();

  for (const rel of CERTIFIED_FILES) {
    const abs = path.join(repoRoot, rel);
    if (fs.existsSync(abs)) files.add(toPosix(abs));
  }

  for (const dirRel of CERTIFIED_DIRS) {
    const absDir = path.join(repoRoot, dirRel);
    if (!fs.existsSync(absDir)) continue;
    for (const abs of walk(absDir)) {
      files.add(toPosix(abs));
    }
  }

  const learningDir = path.join(repoRoot, "pages/learning");
  if (fs.existsSync(learningDir)) {
    for (const ent of fs.readdirSync(learningDir, { withFileTypes: true })) {
      if (!ent.isFile()) continue;
      if (ent.name.endsWith("-master.js")) {
        files.add(toPosix(path.join(learningDir, ent.name)));
      }
    }
  }

  const siteDir = path.join(repoRoot, "lib/site");
  if (fs.existsSync(siteDir)) {
    for (const ent of fs.readdirSync(siteDir, { withFileTypes: true })) {
      if (!ent.isFile()) continue;
      if (ent.name.startsWith("canonical")) {
        files.add(toPosix(path.join(siteDir, ent.name)));
      }
    }
  }

  return [...files].sort();
}

export function collectI18nKeyFirstFiles() {
  const files = new Set();
  for (const rel of I18N_KEY_FIRST_ROOTS) {
    const abs = path.join(repoRoot, rel);
    if (!fs.existsSync(abs)) continue;
    if (fs.statSync(abs).isFile()) {
      files.add(toPosix(abs));
    } else {
      for (const f of walk(abs)) {
        files.add(toPosix(f));
      }
    }
  }
  return [...files]
    .filter((rel) => isScannableFile(rel) && !isHebrewCompanion(rel))
    .sort();
}

export function readRepoFile(rel) {
  return fs.readFileSync(path.join(repoRoot, rel), "utf8");
}
