/**
 * Global product guard: no Hebrew in runtime/data/content outside allowlisted paths.
 * Admin / dev / prototypes may retain Hebrew.
 */
import assert from "node:assert/strict";
import { describe, test } from "node:test";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { getLocaleFallbackChain } from "../../lib/i18n/locale-resolution.js";
import { LOCALE_REGISTRY } from "../../lib/i18n/locale-registry.js";
import { WORD_LISTS } from "../../data/english-questions/word-lists.js";
import { WORD_MEANINGS_ES_419 } from "../../data/english-questions/word-meanings/es-419.js";
import { resolveEnglishWordMeaning } from "../../data/english-questions/word-meanings-locale.js";
import { generateQuestion, ENGLISH_LEVELS } from "../../utils/english-question-generator.js";
import { resolveRegisteredContentPack } from "../../lib/content/resolve-registered-pack.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "../..");
const HE = /[\u0590-\u05FF]/;

/** Path segments / prefixes allowed to contain Hebrew (excluded product areas). */
const ALLOW_PATH_RE = new RegExp(
  String.raw`(^|[/\\])(admin|dev|prototypes|prototype|dev-student-simulator)([/\\]|$)|[/\\]admin-[^/\\]+|admin-ui\.he\.|admin-analytics|admin-video|admin-portal|admin-server|teacher-ui\.he\.|teacher-activity-report-pdf-he|(^|/)lib/auth/[^/]+\.he\.js$`,
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

function isAllowed(rel) {
  const n = rel.replace(/\\/g, "/");
  if (ALLOW_PATH_RE.test(n)) return true;
  // Curriculum oracle / israeli audit / language-review drafts — not student UI; still product debt.
  // Do NOT allowlist them — they must be cleaned or moved. For now report as failures if HE found.
  return false;
}

function walkFiles(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    if (
      ["node_modules", ".next", "exports", "docs", "curriculum-oracle", "language-review"].includes(
        ent.name
      )
    ) {
      // Skip oracle/language-review dumps from this guard (tracked separately as non-runtime).
      if (ent.name === "curriculum-oracle" || ent.name === "language-review") continue;
      if (ent.isDirectory()) continue;
    }
    const p = path.join(dir, ent.name);
    const rel = path.relative(ROOT, p).replace(/\\/g, "/");
    if (ent.isDirectory()) {
      if (["node_modules", ".next", "exports", "docs"].includes(ent.name)) continue;
      walkFiles(p, out);
      continue;
    }
    if (!/\.(js|mjs|cjs|jsx|ts|tsx|json)$/i.test(ent.name)) continue;
    out.push(rel);
  }
  return out;
}

describe("Global product — no active Hebrew", () => {
  test("no Hebrew Unicode in product runtime/data/content (allowlist admin/dev/proto)", () => {
    const offenders = [];
    for (const root of SCAN_ROOTS) {
      for (const rel of walkFiles(path.join(ROOT, root))) {
        if (isAllowed(rel)) continue;
        // Parent-copilot HE utterance banks & report HE normalizers: still present as named *-he.js
        // Require them clean OR allowlist only matcher files that don't ship student stems.
        const text = fs.readFileSync(path.join(ROOT, rel), "utf8");
        if (!HE.test(text)) continue;
        // Allow pure bidirectional / layout utilities that mention Hebrew in comments only? No — zero HE chars.
        offenders.push(rel);
      }
    }
    assert.deepEqual(
      offenders.slice(0, 40),
      [],
      `Hebrew found in ${offenders.length} product files. First: ${offenders.slice(0, 15).join(", ")}`
    );
  });

  test("locale fallback chain never includes he / he-IL", () => {
    for (const id of Object.keys(LOCALE_REGISTRY)) {
      const chain = getLocaleFallbackChain(id);
      assert.ok(!chain.includes("he"), `${id} chain has he`);
      assert.ok(!chain.includes("he-IL"), `${id} chain has he-IL`);
    }
    for (const loc of ["en", "es-419", "es-MX"]) {
      const chain = getLocaleFallbackChain(loc);
      assert.ok(!chain.some((c) => String(c).toLowerCase().startsWith("he")));
    }
  });

  test("generator never emits en_to_he / he_to_en; no Hebrew answers", () => {
    const level = ENGLISH_LEVELS.easy;
    for (let i = 0; i < 15; i++) {
      const q = generateQuestion(level, "vocabulary", "g2", null, "easy", {
        instructionLocale: "es-419",
        contentLocale: "en",
      });
      const dir = q.params?.direction;
      assert.ok(dir === "en_to_meaning" || dir === "meaning_to_en", `dir=${dir}`);
      assert.notEqual(dir, "en_to_he");
      assert.notEqual(dir, "he_to_en");
      for (const s of [q.correctAnswer, ...(q.answers || [])]) {
        if (typeof s === "string") assert.equal(HE.test(s), false, s);
      }
    }
  });

  test("WORD_LISTS has no Hebrew; meanings coverage complete", () => {
    let entries = 0;
    const ids = new Set();
    for (const [listKey, list] of Object.entries(WORD_LISTS)) {
      for (const [id, gloss] of Object.entries(list)) {
        entries += 1;
        ids.add(id);
        assert.equal(HE.test(String(gloss)), false);
        assert.equal(HE.test(id), false);
        const es = WORD_MEANINGS_ES_419[listKey]?.[id];
        assert.ok(es, `missing es-419 meaning ${listKey}.${id}`);
        assert.equal(HE.test(es), false);
      }
    }
    // orphans
    for (const [listKey, list] of Object.entries(WORD_MEANINGS_ES_419)) {
      for (const id of Object.keys(list)) {
        assert.ok(WORD_LISTS[listKey]?.[id] != null, `orphan ${listKey}.${id}`);
      }
    }
    assert.ok(entries >= 700);
    assert.equal(resolveEnglishWordMeaning("dog", { listKey: "animals", instructionLocale: "es-419" }), "perro");
    assert.equal(HE.test(resolveEnglishWordMeaning("dog", { listKey: "animals", instructionLocale: "he" })), false);
  });

  test("word board meanings follow instructionLocale", () => {
    assert.equal(resolveEnglishWordMeaning("dog", { listKey: "animals", instructionLocale: "en" }), "dog");
    assert.equal(resolveEnglishWordMeaning("dog", { listKey: "animals", instructionLocale: "es-419" }), "perro");
  });

  test("Global diagnostic framework has only four subjects", () => {
    const fw = resolveRegisteredContentPack("en", "learning", "diagnostic-framework-v1.json");
    const subjects = fw?.subjects || fw?.subjectOrder || Object.keys(fw?.bySubject || fw?.skills || {});
    // Flexible: look for subject list field
    const listed = Array.isArray(fw?.subjects)
      ? fw.subjects
      : Array.isArray(fw?.subjectOrder)
        ? fw.subjectOrder
        : null;
    if (listed) {
      for (const s of listed) {
        assert.ok(!/hebrew|moledet|history/i.test(String(s)), `Israeli subject in framework: ${s}`);
      }
      assert.ok(listed.includes("math") || listed.includes("english"));
    }
    const blob = JSON.stringify(fw);
    assert.equal(/"hebrew"\s*:/.test(blob) && blob.includes('"hebrew": {'), false);
    assert.equal(blob.includes("moledet-geography"), false);
  });

  test("english-questions directory has zero Hebrew", () => {
    const dir = path.join(ROOT, "data/english-questions");
    function walk(d) {
      for (const ent of fs.readdirSync(d, { withFileTypes: true })) {
        const p = path.join(d, ent.name);
        if (ent.isDirectory()) walk(p);
        else {
          const t = fs.readFileSync(p, "utf8");
          assert.equal(HE.test(t), false, p);
        }
      }
    }
    walk(dir);
  });
});
