/**
 * Shared hardcoded UI scan engine for audit, categorization, and burn-down tests.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { isAllowlistedFinding } from "../../tests/i18n/_hardcoded-ui-allowlist.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const REPO_ROOT = path.resolve(__dirname, "../..");

export const SCAN_ROOTS = ["pages", "components", "lib", "utils", "hooks"];
export const SKIP_DIRS = new Set([
  "node_modules",
  ".next",
  ".git",
  "admin",
  "admin-server",
  "admin-portal",
  "locales",
  "content-packs",
  "docs",
  "tmp",
  "tests",
  "scripts",
]);
export const EXT = new Set([".js", ".jsx", ".ts", ".tsx", ".mjs", ".cjs"]);

export const LINE_SKIP = [
  /^\s*\/\//,
  /^\s*\*/,
  /import\s+/,
  /from\s+["']/,
  /require\s*\(/,
  /console\.(log|warn|error|info|debug)/,
  /process\.env/,
  /NEXT_PUBLIC_/,
  /className=/,
  /data-testid=/,
  /\bt\s*\(/,
  /\buseT\b/,
  /\buseI18n\b/,
  /\buseReportT\b/,
  /labelKey:/,
  /createTranslator/,
  /lookupMessage/,
  /loadLocaleBundles/,
  /fetch\s*\(/,
  /axios\./,
  /\.eq\s*\(/,
  /\.from\s*\(/,
  /supabase/i,
  /SUPABASE/i,
  /\/api\//,
  /\/student\//,
  /\/parent\//,
  /\/teacher\//,
  /href=["']/,
  /src=["']/,
  /type=["']/,
  /name=["']/,
  /id=["']/,
  /role=["']/,
  /autoComplete=/,
  /inputMode=/,
  /method=["']/,
  /Content-Type/,
  /Authorization/,
  /Bearer /,
  /application\/json/,
  /text\/html/,
  /image\//,
  /font\//,
  /module\.exports/,
  /export\s+\{/,
  /export\s+function/,
  /export\s+default/,
  /@type/,
  /@param/,
  /@returns/,
  /describe\s*\(/,
  /it\s*\(/,
  /test\s*\(/,
  /expect\s*\(/,
  /assert\./,
  /Number\s*\(/,
  /typeof\s+/,
  /!= null/,
  /setAnimationStep\s*\(/,
  /\bObject\.values\s*\(/,
  /\bfilter\s*\(\s*\(/,
  /\.(ms|dueAt|start|accuracy)\b/,
  /burnDownCopy\s*\(/,
  /globalBurnDownCopy\s*\(/,
  /copilotStaticMessage\s*\(/,
  /reportPackCopy\s*\(/,
  /gamePackCopy\s*\(/,
  /bookUiCopy\s*\(/,
  /createBookUiCopy\s*\(/,
  /patternCopy\s*\(/,
  /animTitle\s*\(/,
];

export const TEXT_PATTERNS = [
  />\s*([A-Za-z][^<{]{2,}?)\s*</g,
  /\{\s*["']([A-Za-z][^"'\\]{2,})["']\s*\}/g,
  /\b(?:title|label|placeholder|aria-label|alt)\s*=\s*["']([A-Za-z][^"'\\]{2,})["']/g,
  /\b(?:alert|confirm)\s*\(\s*["']([A-Za-z][^"'\\]{2,})["']/g,
  /toast\.(?:success|error|info|warning)\s*\(\s*["']([A-Za-z][^"'\\]{2,})["']/g,
  /:\s*["']([A-Z][a-z][^"'\\]{4,})["']\s*,?\s*$/gm,
  /=\s*["']([A-Z][a-z][^"'\\]{4,})["']/g,
];

export const TEXT_ALLOW = [
  /^OK$/,
  /^Leo Kids$/i,
  /^LEO KIDS$/i,
  /^en$/,
  /^ltr$/,
  /^rtl$/,
  /^GET$/,
  /^POST$/,
  /^PATCH$/,
  /^DELETE$/,
  /^Bearer$/,
  /^application\/json$/,
  /^parent$/,
  /^teacher$/,
  /^student$/,
  /^email$/,
  /^password$/,
  /^Unknown$/,
  /^Topic$/,
  /^Game$/,
  /^Class$/,
  /^Student$/,
  /^Math$/,
  /^English$/,
  /^Science$/,
  /^Geometry$/,
];

/** @typedef {{ file: string, line: number, text: string, kind?: string }} HardcodedFinding */

export function toPosix(abs) {
  return path.relative(REPO_ROOT, abs).split(path.sep).join("/");
}

export function walk(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    if (SKIP_DIRS.has(ent.name)) continue;
    if (ent.name.startsWith(".")) continue;
    const abs = path.join(dir, ent.name);
    if (ent.isDirectory()) {
      walk(abs, out);
    } else {
      out.push(abs);
    }
  }
  return out;
}

export function isScannable(rel) {
  if (/\.he\.(js|jsx|ts|tsx|mjs|cjs)$/.test(rel)) return false;
  if (rel.includes("/admin/") || rel.startsWith("pages/admin")) return false;
  const ext = path.extname(rel);
  return EXT.has(ext);
}

export function isAllowedText(text) {
  const t = text.trim();
  if (t.length < 3) return true;
  if (TEXT_ALLOW.some((re) => re.test(t))) return true;
  if (!/[a-z]/.test(t)) return true;
  if (/^[A-Z0-9_]+$/.test(t)) return true;
  if (/^https?:\/\//.test(t)) return true;
  if (/^\/.+\//.test(t)) return true;
  if (/^[a-z]+(?:-[a-z]+)+$/.test(t)) return true;
  if (/^[a-z]+(?:[A-Z][a-z0-9]+)+$/.test(t)) return true;
  if (/^[A-Z][a-z]+(?:[A-Z][a-z0-9]+)+$/.test(t)) return true;
  if (/^Escape$/.test(t)) return true;
  // JS comparison/property fragments — `>expr<` false positives, not user-facing copy
  if (/\|\||&&/.test(t)) return true;
  if (/Date\.now\s*\(\)/.test(t)) return true;
  if (/getCoords\s*\(/.test(t)) return true;
  if (/String\s*\(/.test(t)) return true;
  if (/\.trim\s*\(\)/.test(t)) return true;
  if (/^[a-z_$][\w$]*(?:\.[\w$]+|\[\w+\])/.test(t) && !/\s{2,}/.test(t)) return true;
  return false;
}

/**
 * @param {string} rel
 * @param {string} source
 * @returns {HardcodedFinding[]}
 */
export function scanSource(rel, source) {
  /** @type {HardcodedFinding[]} */
  const hits = [];
  const lines = source.split(/\r?\n/);
  lines.forEach((line, idx) => {
    if (LINE_SKIP.some((re) => re.test(line))) return;
    for (const re of TEXT_PATTERNS) {
      re.lastIndex = 0;
      let m;
      while ((m = re.exec(line))) {
        const text = m[1];
        if (isAllowedText(text)) continue;
        hits.push({
          file: rel,
          line: idx + 1,
          text: text.trim().slice(0, 160),
          kind: re.source.slice(0, 24),
        });
      }
    }
  });
  return hits;
}

/**
 * @param {string} [repoRoot]
 * @returns {{ findings: HardcodedFinding[], scannedFiles: number }}
 */
export function scanRepository(repoRoot = REPO_ROOT) {
  const files = [];
  for (const root of SCAN_ROOTS) {
    walk(path.join(repoRoot, root), files);
  }

  /** @type {HardcodedFinding[]} */
  const findings = [];
  let scannedFiles = 0;
  for (const abs of files) {
    const rel = toPosix(abs);
    if (!isScannable(rel)) continue;
    scannedFiles += 1;
    const source = fs.readFileSync(abs, "utf8");
    for (const hit of scanSource(rel, source)) {
      if (isAllowlistedFinding(rel, hit.line, hit.text)) continue;
      findings.push(hit);
    }
  }

  findings.sort((a, b) => a.file.localeCompare(b.file) || a.line - b.line);
  return { findings, scannedFiles };
}

export function findingId(finding) {
  return `${finding.file}:${finding.line}:${finding.text}`;
}

/**
 * @param {string} baselinePath
 */
export function loadBaselineSet(baselinePath) {
  if (!fs.existsSync(baselinePath)) return new Set();
  const raw = JSON.parse(fs.readFileSync(baselinePath, "utf8"));
  return new Set(Array.isArray(raw.known) ? raw.known : []);
}

/**
 * Count English string literals in locale JSON (excluded from runtime scan by design).
 * @param {string} repoRoot
 */
export function countLocaleJsonStrings(repoRoot = REPO_ROOT) {
  const localeDir = path.join(repoRoot, "locales/en");
  /** @type {Record<string, number>} */
  const byFile = {};
  let total = 0;

  function walkJson(dir) {
    if (!fs.existsSync(dir)) return;
    for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
      const abs = path.join(dir, ent.name);
      if (ent.isDirectory()) {
        walkJson(abs);
      } else if (ent.name.endsWith(".json")) {
        const rel = toPosix(abs);
        const raw = JSON.parse(fs.readFileSync(abs, "utf8"));
        const count = countJsonStrings(raw);
        byFile[rel] = count;
        total += count;
      }
    }
  }

  walkJson(localeDir);
  return { total, byFile };
}

/**
 * @param {unknown} value
 */
function countJsonStrings(value) {
  if (typeof value === "string") return 1;
  if (Array.isArray(value)) return value.reduce((n, v) => n + countJsonStrings(v), 0);
  if (value && typeof value === "object") {
    return Object.values(value).reduce((n, v) => n + countJsonStrings(v), 0);
  }
  return 0;
}
