#!/usr/bin/env node
/**
 * Hard-fail Hebrew scan for curated Global Production certification surfaces.
 *
 * Only scans the explicit CERTIFIED_FILES / roots list below — not entire
 * pages/components trees. Does NOT soft-warn. Narrow file exemptions only.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "../..");
const HEBREW_RE = /[\u0590-\u05FF]/;
const EXT = new Set([".js", ".jsx", ".ts", ".tsx", ".mjs", ".cjs", ".html", ".json", ".webmanifest"]);

/**
 * @typedef {{ path: string, reason: string }} Exemption
 * @type {Exemption[]}
 */
const EXEMPTIONS = [
  {
    path: "data/science-questions.js",
    reason:
      "Hebrew bank kept as SCIENCE_QUESTIONS_HE; Production masters use English SCIENCE_QUESTIONS + overlay. Not rendered as Hebrew.",
  },
  {
    path: "data/help-center/videos-manifest.he.json",
    reason:
      "Historical Hebrew video capture metadata; Production help uses empty English videos-manifest.json (placeholders only).",
  },
];

/** Single files on the certified Global launch surface. */
const CERTIFIED_FILES = [
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

/** Directories whose files are certified (`.he.*` files skipped). */
const CERTIFIED_DIRS = [
  "pages/help",
  "pages/guides",
  "pages/practice",
  "pages/auth",
  "components/consent",
  "locales/en",
  "lib/i18n",
  "lib/global",
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
    const full = path.join(dir, ent.name);
    if (ent.isDirectory()) walk(full, out);
    else out.push(full);
  }
  return out;
}

function toPosix(abs) {
  return path.relative(root, abs).split(path.sep).join("/");
}

function isHebrewCompanion(rel) {
  return /\.he\.(js|jsx|ts|tsx|mjs|cjs|json)$/.test(rel);
}

function isScannableFile(rel) {
  const ext = path.extname(rel);
  return !ext || EXT.has(ext);
}

function shouldSkip(rel) {
  if (isHebrewCompanion(rel)) return true;
  if (EXEMPTIONS.some((e) => rel === e.path || rel.startsWith(e.path + "/"))) return true;
  if (!isScannableFile(rel)) return true;
  return false;
}

function collectCertifiedFiles() {
  const files = new Set();

  for (const rel of CERTIFIED_FILES) {
    const abs = path.join(root, rel);
    if (fs.existsSync(abs)) files.add(toPosix(abs));
  }

  for (const dirRel of CERTIFIED_DIRS) {
    const absDir = path.join(root, dirRel);
    if (!fs.existsSync(absDir)) continue;
    for (const abs of walk(absDir)) {
      files.add(toPosix(abs));
    }
  }

  const learningDir = path.join(root, "pages/learning");
  if (fs.existsSync(learningDir)) {
    for (const ent of fs.readdirSync(learningDir, { withFileTypes: true })) {
      if (!ent.isFile()) continue;
      if (ent.name.endsWith("-master.js")) {
        files.add(toPosix(path.join(learningDir, ent.name)));
      }
    }
  }

  const siteDir = path.join(root, "lib/site");
  if (fs.existsSync(siteDir)) {
    for (const ent of fs.readdirSync(siteDir, { withFileTypes: true })) {
      if (!ent.isFile()) continue;
      if (ent.name.startsWith("canonical")) {
        files.add(toPosix(path.join(siteDir, ent.name)));
      }
    }
  }

  const publicDir = path.join(root, "public");
  if (fs.existsSync(publicDir)) {
    for (const ent of fs.readdirSync(publicDir, { withFileTypes: true })) {
      if (ent.isDirectory()) {
        const swPath = path.join(publicDir, ent.name, "sw.js");
        if (fs.existsSync(swPath)) files.add(toPosix(swPath));
      } else if (ent.isFile() && ent.name.startsWith("manifest")) {
        files.add(toPosix(path.join(publicDir, ent.name)));
      }
    }
  }

  return [...files].sort();
}

function lineIsCommentOnly(line) {
  const t = line.trim();
  return t.startsWith("//") || t.startsWith("*") || t.startsWith("/*") || t.startsWith("<!--");
}

const scanFiles = collectCertifiedFiles();
const failures = [];

for (const rel of scanFiles) {
  if (shouldSkip(rel)) continue;
  const abs = path.join(root, rel);
  let text;
  try {
    text = fs.readFileSync(abs, "utf8");
  } catch {
    continue;
  }
  if (!HEBREW_RE.test(text)) continue;
  text.split(/\r?\n/).forEach((line, i) => {
    if (!HEBREW_RE.test(line)) return;
    if (lineIsCommentOnly(line)) return;
    failures.push(`${rel}:${i + 1}: ${line.trim().slice(0, 140)}`);
  });
}

if (failures.length) {
  console.error(`[i18n:hebrew] FAIL — ${failures.length} Hebrew hit(s) on certified Global surfaces:`);
  for (const h of failures.slice(0, 100)) console.error(`  ${h}`);
  if (failures.length > 100) console.error(`  … +${failures.length - 100} more`);
  console.error(`\nCertified scope: ${scanFiles.length} file(s)`);
  console.error("\nDocumented exemptions:");
  for (const e of EXEMPTIONS) console.error(`  - ${e.path}: ${e.reason}`);
  process.exit(1);
}

console.log("[i18n:hebrew] OK — certified Global surfaces are Hebrew-free");
console.log(`[i18n:hebrew] Scanned ${scanFiles.length} certified file(s)`);
console.log(`[i18n:hebrew] Exemptions: ${EXEMPTIONS.length}`);
