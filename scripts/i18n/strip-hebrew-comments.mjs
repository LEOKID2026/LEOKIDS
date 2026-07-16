#!/usr/bin/env node
/**
 * Strip Hebrew from inline // comments and JSX block comments in scan targets.
 * Full-line // comments are already ignored by the Hebrew scan.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "../..");
const HEBREW_RE = /[\u0590-\u05FF]/;
const HEBREW_GLOBAL = /[\u0590-\u05FF]/g;
const EXT = new Set([".js", ".jsx", ".ts", ".tsx", ".mjs", ".cjs"]);
const EXEMPTIONS = ["data/science-questions.js"];
const PAGE_SKIP_PREFIXES = [
  "pages/admin/",
  "pages/api/",
  "pages/dev/",
  "pages/school/",
  "pages/guardian/",
  "pages/teacher/",
];
const COMPONENT_SKIP_PREFIXES = [
  "components/admin/",
  "components/arcade/",
  "components/dev/",
  "components/school/",
  "components/teacher-portal/",
  "components/teacher/",
  "components/video-builder/",
  "components/prototypes/",
  "components/solo-games/prototypes/",
];
const SCAN_TARGETS = [
  "pages",
  "components",
  "locales",
  "lib/i18n",
  "lib/global",
  "lib/site",
  "lib/consent",
  "lib/ui",
  "lib/auth",
  "lib/seo",
  "lib/pwa",
  "lib/guest",
  "hooks",
  "data/seo",
  "data/home",
  "data/marketing",
  "data/legal",
  "data/help-center",
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

function shouldSkip(rel) {
  if (rel.endsWith(".he.js")) return true;
  if (EXEMPTIONS.some((e) => rel === e || rel.startsWith(e + "/"))) return true;
  if (PAGE_SKIP_PREFIXES.some((p) => rel.startsWith(p))) return true;
  if (COMPONENT_SKIP_PREFIXES.some((p) => rel.startsWith(p))) return true;
  const ext = path.extname(rel);
  if (ext && !EXT.has(ext)) return true;
  return false;
}

function lineIsCommentOnly(line) {
  const t = line.trim();
  return t.startsWith("//") || t.startsWith("*") || t.startsWith("/*") || t.startsWith("<!--");
}

function cleanLine(line) {
  if (!HEBREW_RE.test(line) || lineIsCommentOnly(line)) return line;

  let out = line;

  // JSX block comments
  out = out.replace(/\{\s*\/\*[\s\S]*?\*\/\s*\}/g, (m) => {
    if (!HEBREW_RE.test(m)) return m;
    return "{/* */}";
  });

  // Inline // comments (not inside strings — best-effort)
  const slashIdx = out.indexOf("//");
  if (slashIdx >= 0) {
    const before = out.slice(0, slashIdx);
    const after = out.slice(slashIdx);
    if (HEBREW_RE.test(after) && !/(["'`][^"'`]*\/\/)/.test(before)) {
      const cleaned = after.replace(HEBREW_GLOBAL, "").replace(/\/\/\s*$/, "//");
      out = before + cleaned;
    }
  }

  return out;
}

let changed = 0;
for (const base of SCAN_TARGETS) {
  const absBase = path.join(root, base);
  if (!fs.existsSync(absBase)) continue;
  for (const file of walk(absBase)) {
    const rel = toPosix(file);
    if (shouldSkip(rel)) continue;
    const text = fs.readFileSync(file, "utf8");
    if (!HEBREW_RE.test(text)) continue;
    const lines = text.split(/\r?\n/);
    let touched = false;
    const next = lines.map((line) => {
      const cleaned = cleanLine(line);
      if (cleaned !== line) touched = true;
      return cleaned;
    });
    if (touched) {
      fs.writeFileSync(file, next.join("\n") + (text.endsWith("\n") ? "\n" : ""), "utf8");
      changed += 1;
    }
  }
}

console.log(`[strip-hebrew-comments] updated ${changed} file(s)`);
