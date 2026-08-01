/**
 * Central Global product guard — zero Hebrew runtime dependencies.
 * Allowlist: Admin / pages/dev / prototypes / admin-* modules.
 * Negative leak fixtures under tests/fixtures may contain Hebrew markers.
 */
import assert from "node:assert/strict";
import { describe, test } from "node:test";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { getLocaleFallbackChain } from "../../lib/i18n/locale-resolution.js";
import { normalizeLocaleInput } from "../../lib/i18n/locale-normalize.js";
import { LOCALE_REGISTRY } from "../../lib/i18n/locale-registry.js";
import { resolveEnglishWordMeaning } from "../../data/english-questions/word-meanings-locale.js";
import { generateQuestion, ENGLISH_LEVELS } from "../../utils/english-question-generator.js";
import { resolveRegisteredContentPack } from "../../lib/content/resolve-registered-pack.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "../..");

const ALLOW =
  /(^|[/\\])(admin|dev|prototypes|prototype|dev-student-simulator)([/\\]|$)|[/\\]admin-[^/\\]+|admin-ui\.he\.|admin-analytics|admin-video|admin-portal|admin-server|teacher-ui\.he\.|teacher-activity-report-pdf-he|lib[/\\]auth[/\\][^/\\]+\.he\.js$/i;

const SCAN_ROOTS = ["data", "utils", "lib", "pages", "components", "content-packs", "locales", "hooks"];
const SKIP = new Set(["node_modules", ".next", "exports", "docs", "curriculum-oracle", "language-review"]);

const MARKERS = {
  literalHe: /[\u0590-\u05FF]/,
  escapedHe: /\\u05[0-9a-fA-F]{2}/,
  heRange: /\\u0590|\\u05FF/,
  en_to_he: /\ben_to_he\b/,
  he_to_en: /\bhe_to_en\b/,
  wordHe: /\bwordHe\b/,
  sentenceHe: /\bsentenceHe\b/,
  subjectLabelHe: /\bsubjectLabelHe\b/,
  findHebrewMeaning: /\bfindHebrewMeaning\b/,
  heLocaleBranch:
    /he-IL|\.startsWith\(\s*["']he["']\)|locale\s*===\s*["']he["']|===\s*["']he-IL["']|normalizeLocaleTag\([^)]*\)[^\n]{0,40}startsWith\(\s*["']he/,
  heRuntimeImport:
    /utterance-normalize-he|conversational-reply-class-he|parent-facing-normalize-he|contextual-follow-up-he|hebrew-display-labels|classroom-skill-labels-he|isHebrewInstructionLocale|diagnostic-labels-he|learning-live-feedback-he|prepare-hebrew-book-audio/,
  israeliSubjectId: /["'](hebrew|moledet[_-]geography|moledet_geography)["']/,
};

function walk(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    if (SKIP.has(ent.name)) continue;
    const p = path.join(dir, ent.name);
    const rel = path.relative(ROOT, p).replace(/\\/g, "/");
    if (ALLOW.test(rel)) continue;
    if (ent.isDirectory()) walk(p, out);
    else if (/\.(js|mjs|cjs|jsx|ts|tsx|json)$/i.test(ent.name)) out.push(rel);
  }
  return out;
}

function collectHits(pattern) {
  const hits = [];
  for (const root of SCAN_ROOTS) {
    for (const rel of walk(path.join(ROOT, root))) {
      const text = fs.readFileSync(path.join(ROOT, rel), "utf8");
      if (pattern.test(text)) hits.push(rel);
    }
  }
  return hits;
}

describe("Global product — zero Hebrew runtime (central)", () => {
  test("Hebrew literals in product runtime = 0", () => {
    assert.deepEqual(collectHits(MARKERS.literalHe).slice(0, 20), []);
  });

  test("Escaped Hebrew Unicode matchers = 0", () => {
    assert.deepEqual(collectHits(MARKERS.escapedHe).slice(0, 20), []);
    assert.deepEqual(collectHits(MARKERS.heRange).slice(0, 20), []);
  });

  test("Hebrew-specific locale branches = 0", () => {
    assert.deepEqual(collectHits(MARKERS.heLocaleBranch).slice(0, 20), []);
  });

  test("Hebrew-specific runtime imports = 0", () => {
    assert.deepEqual(collectHits(MARKERS.heRuntimeImport).slice(0, 20), []);
  });

  test("Hebrew-specific filenames used by runtime = 0", () => {
    const named = [];
    for (const root of SCAN_ROOTS) {
      for (const rel of walk(path.join(ROOT, root))) {
        const base = path.basename(rel);
        if (
          /(^|[-_.])he\.js$/i.test(base) ||
          /-he\.js$/i.test(base) ||
          /\.he\.js$/i.test(base) ||
          /hebrew/i.test(base)
        ) {
          named.push(rel);
        }
      }
    }
    assert.deepEqual(named, []);
  });

  test("en_to_he / he_to_en runtime references = 0", () => {
    assert.deepEqual(collectHits(MARKERS.en_to_he), []);
    assert.deepEqual(collectHits(MARKERS.he_to_en), []);
  });

  test("legacy He field names absent from product runtime", () => {
    assert.deepEqual(collectHits(MARKERS.wordHe), []);
    assert.deepEqual(collectHits(MARKERS.sentenceHe), []);
    assert.deepEqual(collectHits(MARKERS.subjectLabelHe), []);
    assert.deepEqual(collectHits(MARKERS.findHebrewMeaning), []);
  });

  test("Israeli subject IDs absent from product runtime (quoted)", () => {
    // Allow english word-list category keys like "history" only via exact subject ids
    // Align with scan-israeli-subject-ids.mjs product boundary (exclude dev sim / language-review tooling).
    const hits = collectHits(MARKERS.israeliSubjectId).filter(
      (rel) =>
        !rel.includes("word-lists.js") &&
        !rel.includes("word-meanings/") &&
        !rel.includes("dev-student-simulator") &&
        !rel.includes("language-review")
    );
    assert.deepEqual(hits.slice(0, 30), []);
  });

  test("locale fallback never includes he; unknown → en", () => {
    for (const id of Object.keys(LOCALE_REGISTRY)) {
      const chain = getLocaleFallbackChain(id);
      assert.ok(!chain.some((c) => String(c).toLowerCase().startsWith("he")));
    }
    assert.equal(normalizeLocaleInput("he").canonical, "en");
    assert.equal(normalizeLocaleInput("he-IL").canonical, "en");
    assert.equal(normalizeLocaleInput("xx-YY").canonical, "en");
  });

  test("en_to_meaning and meaning_to_en work; locales resolve meanings", () => {
    assert.equal(
      resolveEnglishWordMeaning("dog", { listKey: "animals", instructionLocale: "es-419" }),
      "perro"
    );
    assert.equal(
      resolveEnglishWordMeaning("dog", { listKey: "animals", instructionLocale: "en" }),
      "dog"
    );
    assert.equal(
      resolveEnglishWordMeaning("dog", { listKey: "animals", instructionLocale: "zz" }),
      "dog"
    );

    const level = ENGLISH_LEVELS.easy;
    let sawEnTo = false;
    let sawMeaningTo = false;
    for (let i = 0; i < 24; i += 1) {
      const q = generateQuestion(level, "vocabulary", "g2", null, "easy", {
        instructionLocale: "es-419",
        contentLocale: "en",
      });
      const dir = q.params?.direction;
      assert.ok(dir === "en_to_meaning" || dir === "meaning_to_en", `dir=${dir}`);
      if (dir === "en_to_meaning") sawEnTo = true;
      if (dir === "meaning_to_en") sawMeaningTo = true;
      for (const s of [q.correctAnswer, ...(q.answers || [])]) {
        if (typeof s === "string") {
          assert.equal(/[\u0590-\u05FF]/.test(s), false);
          assert.equal(/\\u05/.test(s), false);
        }
      }
    }
    assert.ok(sawEnTo || sawMeaningTo);
  });

  test("diagnostic framework has only global subjects", () => {
    const fw = resolveRegisteredContentPack("en", "learning", "diagnostic-framework-v1.json");
    const blob = JSON.stringify(fw);
    assert.equal(blob.includes("moledet-geography"), false);
    assert.equal(/"hebrew"\s*:/.test(blob), false);
    const ids = fw?.framework?.supportedSubjectIds || [];
    assert.deepEqual(ids, ["math", "geometry", "english", "science"]);
  });
});
