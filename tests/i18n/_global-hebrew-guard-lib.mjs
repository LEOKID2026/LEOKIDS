/**
 * Shared helpers for global no-Hebrew / Israeli-residue production guards.
 * Imported by tests only — not a production module.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const ROOT = path.resolve(__dirname, "../..");
export const HE = /[\u0590-\u05FF]/;

/** User-facing production scan roots (includes public/**). */
export const SCAN_ROOTS = [
  "locales",
  "content-packs",
  "data/help-center",
  "public",
  "pages",
  "components",
  "lib",
  "utils",
];

const SKIP_DIR_NAMES = new Set([
  "node_modules",
  ".next",
  "exports",
  "docs",
  "scripts",
  "tests",
  "curriculum-oracle",
  "language-review",
]);

const ALLOW_PATH_RE = new RegExp(
  String.raw`(^|[/\\])(admin|dev|prototypes|prototype|dev-student-simulator)([/\\]|$)|[/\\]admin-[^/\\]+|admin-ui\.he\.|admin-analytics|admin-video|admin-portal|admin-server|teacher-ui\.he\.|teacher-activity-report-pdf-he|(^|/)lib/auth/[^/]+\.he\.js$`,
  "i"
);

/**
 * Precise translated Israeli-residue denylist for English/global production authority.
 * Generic tokens like "History", "Geography", or bare "Hebrew" are not blocked alone.
 */
export const TRANSLATED_ISRAELI_RESIDUE_RES = [
  /\bHasmonaean\b/i,
  /\bHasmonean\b/i,
  /\bHellenism\b/i,
  /\bHellenistic\b/i,
  /\bRome-Judea\b/i,
  /\bRome\/Judea\b/i,
  /\bJudea\b/i,
  /\bHomeland Studies\b/i,
  /\bHomeland & Geography\b/i,
  /\bHomeland Explorer\b/i,
  /\bHebrew Star\b/i,
  /\bHebrew vocabulary\b/i,
  /\bHebrew grammar\b/i,
  /\bIsrael elementary\b/i,
  // Display-form Moledet only (not camelCase / kebab internal keys).
  /(?<![A-Za-z0-9])Moledet(?![A-Za-z0-9])/,
  /\bisraeli-primary-curriculum-map\b/i,
];

/** Country overlays are cleaned in a later pass — not English-base authority. */
export function isCountryOverlayPackPath(rel) {
  const n = String(rel || "").replace(/\\/g, "/");
  return /^content-packs\/[a-z]{2,3}-[A-Za-z0-9]+(\/|$)/.test(n);
}

/** Pack slug / path name may appear in import paths; flag only in pack/locale payloads. */
function shouldScanIsraeliResidue(rel) {
  const n = String(rel || "").replace(/\\/g, "/");
  if (isCountryOverlayPackPath(n)) return false;
  if (n.startsWith("content-packs/en/") || n.startsWith("locales/en/")) return true;
  // Report/learning English authority helpers — display string scan only.
  if (
    n.startsWith("utils/parent-report") ||
    n.startsWith("utils/detailed-parent-report") ||
    n.startsWith("utils/math-report-generator") ||
    n.startsWith("utils/diagnostic-labels") ||
    n.startsWith("utils/parent-copilot/report-row-resolver") ||
    n.startsWith("lib/reports/")
  ) {
    return true;
  }
  return false;
}

const SCAN_EXT_RE = /\.(js|mjs|cjs|jsx|ts|tsx|json|svg|html|htm|webmanifest|xml)$/i;

/**
 * @param {string} rel
 */
export function isAllowedPath(rel) {
  const n = rel.replace(/\\/g, "/");
  if (ALLOW_PATH_RE.test(n)) return true;
  if (n.startsWith("pages/admin/") || n.startsWith("pages/dev/")) return true;
  if (n.startsWith("components/admin/") || n.startsWith("components/prototypes/")) return true;
  if (/(^|\/)lib\/admin-[^/]+/.test(n)) return true;
  if (n.startsWith("tests/") || n.startsWith("docs/") || n.startsWith("scripts/")) return true;
  return false;
}

/**
 * @param {string} line
 */
export function isCommentOnlyLine(line) {
  const t = line.trim();
  if (
    t.startsWith("//") ||
    t.startsWith("*") ||
    t.startsWith("/*") ||
    t.startsWith("<!--") ||
    /^\s*\{\s*\/\*/.test(t)
  ) {
    return true;
  }
  if (line.includes("//") && HE.test(line)) {
    const codePart = line.split("//")[0];
    if (!HE.test(codePart.replace(/["'`][^"'`]*["'`]/g, ""))) return true;
  }
  return false;
}

/**
 * @param {string} text
 * @param {string} rel
 */
export function stripCommentsForScan(text, rel) {
  const n = rel.replace(/\\/g, "/");
  if (/\.(svg|html|htm|webmanifest|xml|json)$/i.test(n)) {
    return text.replace(/<!--[\s\S]*?-->/g, "");
  }
  let out = text.replace(/\/\*[\s\S]*?\*\//g, "");
  out = out
    .split(/\r?\n/)
    .map((line) => {
      if (isCommentOnlyLine(line)) return "";
      const idx = line.indexOf("//");
      if (idx === -1) return line;
      const before = line.slice(0, idx);
      const quotes = (before.match(/(["'`])/g) || []).length;
      if (quotes % 2 === 1) return line;
      return before;
    })
    .join("\n");
  return out;
}

/**
 * @param {string} text
 */
export function textHasHebrewUnicode(text) {
  return HE.test(String(text || ""));
}

/**
 * @param {string} text
 * @returns {string[]}
 */
export function findTranslatedIsraeliResidue(text) {
  const src = String(text || "");
  /** @type {string[]} */
  const hits = [];
  for (const re of TRANSLATED_ISRAELI_RESIDUE_RES) {
    if (re.test(src)) hits.push(re.source);
  }
  return hits;
}

/**
 * @param {string} text
 * @param {{ rel?: string }} [opts]
 */
export function scanTextForGlobalHebrewGuards(text, opts = {}) {
  const rel = opts.rel || "synthetic.txt";
  const stripped = stripCommentsForScan(text, rel);
  return {
    hebrew: textHasHebrewUnicode(stripped),
    residue: findTranslatedIsraeliResidue(stripped),
    commentOnlyHebrew:
      textHasHebrewUnicode(text) && !textHasHebrewUnicode(stripped),
  };
}

/**
 * @param {string} dir
 * @param {string[]} [out]
 */
function walkFiles(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    if (SKIP_DIR_NAMES.has(ent.name) || ent.name.startsWith(".")) continue;
    const p = path.join(dir, ent.name);
    const rel = path.relative(ROOT, p).replace(/\\/g, "/");
    if (isAllowedPath(rel)) continue;
    if (ent.isDirectory()) {
      walkFiles(p, out);
      continue;
    }
    if (!SCAN_EXT_RE.test(ent.name)) continue;
    out.push(rel);
  }
  return out;
}

/**
 * @returns {{ hebrew: string[], residue: { rel: string, patterns: string[] }[] }}
 */
export function collectProductionGuardFindings() {
  /** @type {string[]} */
  const hebrew = [];
  /** @type {{ rel: string, patterns: string[] }[]} */
  const residue = [];

  for (const root of SCAN_ROOTS) {
    for (const rel of walkFiles(path.join(ROOT, root))) {
      if (isAllowedPath(rel)) continue;
      let text;
      try {
        text = fs.readFileSync(path.join(ROOT, rel), "utf8");
      } catch {
        continue;
      }
      if (text.length > 4_000_000) continue;
      const stripped = stripCommentsForScan(text, rel);
      if (textHasHebrewUnicode(stripped)) hebrew.push(rel);
      if (!shouldScanIsraeliResidue(rel)) continue;
      const n = rel.replace(/\\/g, "/");
      // Curriculum-map module imports outside packs are compatibility stubs, not product copy.
      const residueText =
        n.startsWith("content-packs/") || n.startsWith("locales/")
          ? stripped
          : stripped.replace(/israeli-primary-curriculum-map/gi, "");
      const patterns = findTranslatedIsraeliResidue(residueText);
      if (patterns.length) residue.push({ rel, patterns });
    }
  }
  return { hebrew, residue };
}
