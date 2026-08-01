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
});

test("es-419 diagnostic-labels returns Spanish distinct from en", () => {
  const es = resolveRegisteredContentPack("es-419", "learning", "diagnostic-labels.json");
  const en = resolveRegisteredContentPack("en", "learning", "diagnostic-labels.json");
  assert.ok(es && typeof es === "object");
  assert.ok(en && typeof en === "object");
  // Deep-merged along es-419 → en; Spanish leaf wins over English.
  assert.equal(en.operations?.addition, "Addition");
  assert.equal(es.operations?.addition, "Suma");
  assert.notEqual(es.operations?.addition, en.operations?.addition);
  assert.equal(
    es.operations?.addition,
    CONTENT_PACK_CATALOG["es-419"]["learning/diagnostic-labels.json"].operations?.addition
  );
});

test("es-419 falls back to en for a missing registered pack path", () => {
  const chain = getContentFallbackChain("es-419");
  assert.ok(chain.includes("es-419"), `expected es-419 in chain, got ${chain.join(",")}`);
  assert.ok(chain.includes("en"), `expected en in chain, got ${chain.join(",")}`);

  // Path not registered in either locale catalog → null from catalog resolver.
  const missing = resolveRegisteredContentPack("es-419", "learning", "__missing-pack-path__.json");
  assert.equal(missing, null);

  // Simulate unregistered es-419 key by resolving a path only present on disk for en
  // via catalog: both locales register the same 28 keys, so remove temporarily.
  const key = "learning/diagnostic-labels.json";
  const saved = CONTENT_PACK_CATALOG["es-419"];
  const { [key]: _removed, ...rest } = saved;
  CONTENT_PACK_CATALOG["es-419"] = Object.freeze(rest);
  try {
    const fallback = resolveRegisteredContentPack("es-419", "learning", "diagnostic-labels.json");
    assert.ok(fallback);
    assert.equal(fallback, CONTENT_PACK_CATALOG.en[key]);
    assert.equal(fallback.operations?.addition, "Addition");
  } finally {
    CONTENT_PACK_CATALOG["es-419"] = saved;
  }
});
test("es-ES catalog packs deep-merge onto es-419 (books, rewards, burn-down indexes)", () => {
  const books = resolveRegisteredContentPack("es-ES", "books", "ui.json");
  const books419 = resolveRegisteredContentPack("es-419", "books", "ui.json");
  assert.equal(books?.grades?.g1, "1.º de Primaria");
  assert.equal(books419?.grades?.g1, "Grado 1");
  // Sibling keys inherit from es-419 when present on the base pack
  for (const key of Object.keys(books419?.grades || {})) {
    assert.ok(key in (books?.grades || {}), `missing sibling grade key ${key}`);
  }

  const titles = resolveRegisteredContentPack("es-ES", "books", "registry-titles.json");
  assert.equal(titles?.meta?.["english.g1"]?.bookTitle, "Inglés — 1.º de Primaria");

  const rewards = resolveRegisteredContentPack("es-ES", "rewards", "ui.json");
  const rewards419 = resolveRegisteredContentPack("es-419", "rewards", "ui.json");
  assert.equal(rewards?.gradeBands?.g12, "Cursos 1.º–2.º");
  assert.equal(rewards?.gradeBands?.g34, "Cursos 3.º–4.º");
  assert.equal(rewards?.gradeBands?.g56, "Cursos 5.º–6.º");
  assert.equal(rewards?.rarity?.regular, rewards419?.rarity?.regular);

  const learning = resolveRegisteredContentPack("es-ES", "learning", "burn-down-index.json");
  assert.equal(
    learning?.["components__parent__ParentCurriculumContent"]?.topics_by_grade,
    "Temas por curso"
  );

  const global = resolveRegisteredContentPack("es-ES", "global-burn-down", "burn-down-index.json");
  assert.equal(global?.["lib__teacher-portal__teacher-class-grade"]?.grade_1, "1.º de Primaria");
  assert.match(String(global?.["lib__site__public-page-seo"]?.leo_kids_practice_for_elementary_learners || ""), /Primaria/);
});

test("es-ES catalog resolution leaves es-419 unchanged", () => {
  const esBooks = resolveRegisteredContentPack("es-419", "books", "ui.json");
  assert.equal(esBooks?.grades?.g1, "Grado 1");
  const mxMissing = resolveRegisteredContentPack("es-MX", "books", "ui.json");
  // es-MX not in catalog → falls through to es-419 (same deep-merge chain as locale fallback)
  assert.equal(mxMissing?.grades?.g1, "Grado 1");
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
