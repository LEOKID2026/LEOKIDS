/**
 * Stage 3 — content pack locale loading + no unauthorized hard imports of content-packs/en.
 */
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { loadContentPack } from "../../lib/content/locale.server.js";
import { resolveRegisteredContentPack } from "../../lib/content/resolve-registered-pack.js";
import { resolveContentLocale, getContentFallbackChain } from "../../lib/content/locale.js";
import { loadTaxonomyBundle } from "../../lib/learning/learning-locale-contract.js";
import { CONTENT_PACK_CATALOG } from "../../lib/content/pack-catalog.js";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "../..");

const HARD_IMPORT_RE =
  /(?:from|import)\s+["'][^"']*content-packs\/en\/[^"']+["']|require\(\s*["'][^"']*content-packs\/en\/[^"']+["']\s*\)/;

/** Paths allowed to statically import content-packs/en (registry + excluded areas). */
const ALLOWED_HARD_IMPORT_PATHS = new Set([
  "lib/content/pack-catalog.js",
]);

function isExcludedFromHardImportScan(relPosix) {
  if (ALLOWED_HARD_IMPORT_PATHS.has(relPosix)) return true;
  if (relPosix.startsWith("lib/content/pack-catalog.")) return true;
  if (/(^|\/)(admin|dev|prototypes)(\/|$)/.test(relPosix)) return true;
  if (relPosix.startsWith("pages/admin/") || relPosix.startsWith("pages/dev/")) return true;
  if (relPosix.startsWith("components/admin/") || relPosix.startsWith("components/prototypes/")) return true;
  if (relPosix.startsWith("scripts/") || relPosix.startsWith("tests/")) return true;
  if (relPosix.includes("/poc/") || relPosix.includes("/POC/")) return true;
  return false;
}

function walkJs(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === "node_modules" || entry.name.startsWith(".")) continue;
    const abs = path.join(dir, entry.name);
    if (entry.isDirectory()) walkJs(abs, out);
    else if (/\.(js|jsx|mjs|cjs|ts|tsx)$/.test(entry.name)) out.push(abs);
  }
  return out;
}

test("loadContentPack loads English learning pack via locale loader", () => {
  const pack = loadContentPack("en", "learning", "burn-down-index.json");
  assert.ok(pack && typeof pack === "object");
  assert.ok(Object.keys(pack).length > 0);
});

test("resolveRegisteredContentPack loads English rewards UI via catalog", () => {
  const pack = resolveRegisteredContentPack("en", "rewards", "ui.json");
  assert.ok(pack && typeof pack === "object");
  assert.ok(pack.rarity || pack.shop || pack.grades || Object.keys(pack).length > 0);
});

test("missing locale falls back to en inside loader chain", () => {
  const chain = getContentFallbackChain("en-XA");
  assert.ok(chain.includes("en"), `expected en in chain, got ${chain.join(",")}`);

  const fromPseudo = resolveRegisteredContentPack("en-XA", "games", "ui-pack-index.json");
  const fromEn = resolveRegisteredContentPack("en", "games", "ui-pack-index.json");
  assert.ok(fromPseudo);
  assert.equal(fromPseudo, fromEn);

  const unknown = resolveRegisteredContentPack("es-419", "learning", "diagnostic-labels.json");
  assert.ok(unknown);
  assert.equal(unknown, CONTENT_PACK_CATALOG.en["learning/diagnostic-labels.json"]);
});

test("English subject forces contentLocale en for taxonomy pack", () => {
  assert.equal(resolveContentLocale({ subject: "english", interfaceLocale: "ar-XB" }), "en");
  assert.equal(
    resolveContentLocale({ subject: "english", contentLocale: undefined, interfaceLocale: "en-XA" }),
    "en",
  );

  const { structure, content } = loadTaxonomyBundle("english");
  assert.ok(structure?.rows?.length > 0);
  assert.ok(content?.rows && Object.keys(content.rows).length > 0);

  const viaSubject = resolveRegisteredContentPack(
    { subject: "english" },
    "books",
    "english-page-skills.json",
  );
  assert.ok(viaSubject?.grades);
});

test("no unauthorized hard imports of content-packs/en in global runtime code", () => {
  /** @type {string[]} */
  const violations = [];
  for (const dir of ["lib", "utils", "components", "pages", "hooks"]) {
    for (const abs of walkJs(path.join(root, dir))) {
      const rel = path.relative(root, abs).split(path.sep).join("/");
      if (isExcludedFromHardImportScan(rel)) continue;
      const text = fs.readFileSync(abs, "utf8");
      if (HARD_IMPORT_RE.test(text)) {
        violations.push(rel);
      }
    }
  }
  assert.deepEqual(
    violations,
    [],
    `Unauthorized content-packs/en hard imports:\n${violations.join("\n")}`,
  );
});
