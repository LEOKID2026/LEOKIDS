/**
 * Global product guard: no Hebrew / Israeli residue in user-facing production surfaces.
 * Admin / Dev / prototypes / comment-only Hebrew remain exempt.
 */
import assert from "node:assert/strict";
import { describe, test } from "node:test";
import fs from "fs";
import path from "path";
import { getLocaleFallbackChain } from "../../lib/i18n/locale-resolution.js";
import { LOCALE_REGISTRY } from "../../lib/i18n/locale-registry.js";
import { WORD_LISTS } from "../../data/english-questions/word-lists.js";
import { WORD_MEANINGS_ES_419 } from "../../data/english-questions/word-meanings/es-419.js";
import { resolveEnglishWordMeaning } from "../../data/english-questions/word-meanings-locale.js";
import { generateQuestion, ENGLISH_LEVELS } from "../../utils/english-question-generator.js";
import { resolveRegisteredContentPack } from "../../lib/content/resolve-registered-pack.js";
import {
  HE,
  ROOT,
  SCAN_ROOTS,
  collectProductionGuardFindings,
  isAllowedPath,
  scanTextForGlobalHebrewGuards,
  stripCommentsForScan,
  textHasHebrewUnicode,
} from "./_global-hebrew-guard-lib.mjs";

describe("Global product — no active Hebrew", () => {
  test("synthetic Hebrew SVG/string is detected by Unicode guard", () => {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg"><text>שלום</text></svg>`;
    const hit = scanTextForGlobalHebrewGuards(svg, { rel: "synthetic.svg" });
    assert.equal(hit.hebrew, true);
    const clean = scanTextForGlobalHebrewGuards(`<svg><text>Hello</text></svg>`, {
      rel: "synthetic.svg",
    });
    assert.equal(clean.hebrew, false);
  });

  test("synthetic Israeli residue key is detected; generic History/Hebrew alone is not", () => {
    const dirty = scanTextForGlobalHebrewGuards(
      JSON.stringify({ title: "Hasmonaean timeline", slug: "israeli-primary-curriculum-map" }),
      { rel: "synthetic.json" }
    );
    assert.ok(dirty.residue.length >= 1);
    const generic = scanTextForGlobalHebrewGuards(
      JSON.stringify({ subject: "History", note: "Hebrew as a language discussion" }),
      { rel: "synthetic.json" }
    );
    assert.deepEqual(generic.residue, []);
  });

  test("Admin/Dev path exemption works", () => {
    assert.equal(isAllowedPath("pages/admin/tools.js"), true);
    assert.equal(isAllowedPath("pages/dev/sandbox.jsx"), true);
    assert.equal(isAllowedPath("components/admin/Panel.jsx"), true);
    assert.equal(isAllowedPath("components/prototypes/X.jsx"), true);
    assert.equal(isAllowedPath("lib/admin-portal/labels.js"), true);
    assert.equal(isAllowedPath("lib/auth/auth-registration-request.server.he.js"), true);
    assert.equal(isAllowedPath("public/rewards/cards/placeholders/gold/default.svg"), false);
    assert.equal(isAllowedPath("locales/en/common.json"), false);
  });

  test("comment-only Hebrew is exempt from rendered scan", () => {
    const swComment = `// Cache רק קבצים סטטיים אמיתיים`;
    const hit = scanTextForGlobalHebrewGuards(swComment, { rel: "public/sw.js" });
    assert.equal(hit.hebrew, false);
    assert.equal(textHasHebrewUnicode(stripCommentsForScan(swComment, "public/sw.js")), false);
  });

  test("no Hebrew Unicode in product runtime/data/content/public (allowlist admin/dev/proto/comments)", () => {
    const { hebrew } = collectProductionGuardFindings();
    assert.deepEqual(
      hebrew.slice(0, 40),
      [],
      `Hebrew found in ${hebrew.length} product files. First: ${hebrew.slice(0, 15).join(", ")}`
    );
  });

  test("no translated Israeli residue in scanned production surfaces", () => {
    const { residue } = collectProductionGuardFindings();
    assert.deepEqual(
      residue.slice(0, 25).map((r) => r.rel),
      [],
      `Israeli residue in ${residue.length} files. First: ${residue
        .slice(0, 10)
        .map((r) => `${r.rel}[${r.patterns.join("|")}]`)
        .join(", ")}`
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
    for (const [listKey, list] of Object.entries(WORD_LISTS)) {
      for (const [id, gloss] of Object.entries(list)) {
        entries += 1;
        assert.equal(HE.test(String(gloss)), false);
        assert.equal(HE.test(id), false);
        const es = WORD_MEANINGS_ES_419[listKey]?.[id];
        assert.ok(es, `missing es-419 meaning ${listKey}.${id}`);
        assert.equal(HE.test(es), false);
      }
    }
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

  test("scan roots include public/**", () => {
    assert.ok(SCAN_ROOTS.includes("public"));
    assert.ok(SCAN_ROOTS.includes("locales"));
    assert.ok(SCAN_ROOTS.includes("content-packs"));
    assert.ok(SCAN_ROOTS.includes("data/help-center"));
  });

  test("reward card placeholder SVGs have zero Hebrew", () => {
    const dir = path.join(ROOT, "public/rewards/cards/placeholders");
    for (const tier of ["regular", "gold", "rare", "special"]) {
      const abs = path.join(dir, tier, "default.svg");
      const svg = fs.readFileSync(abs, "utf8");
      assert.equal(HE.test(svg), false, abs);
    }
  });

  test("en reward catalog does not expose Hebrew Star or Homeland Explorer", () => {
    const catalogPath = path.join(ROOT, "content-packs/en/rewards/card-catalog.json");
    const catalog = JSON.parse(fs.readFileSync(catalogPath, "utf8"));
    const cards = catalog.cards || {};
    assert.equal(Object.prototype.hasOwnProperty.call(cards, "achievement_hebrew_star"), false);
    assert.equal(Object.prototype.hasOwnProperty.call(cards, "achievement_moledet_explorer"), false);
    const blob = JSON.stringify(cards);
    assert.equal(/Hebrew Star/.test(blob), false);
    assert.equal(/Homeland Explorer/.test(blob), false);
  });
});
